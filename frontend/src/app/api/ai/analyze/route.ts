// =============================================================================
// VRIKSHAM API - POST /api/ai/analyze
// =============================================================================
// Accepts plant symptoms and optional image URL, calls OpenAI for AI-powered
// plant health analysis, and returns diagnosis with recommendations.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Plant } from '@/lib/models';
import { getAuthUser } from '@/lib/auth';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { plantId, symptoms, imageUrl } = body;

    if (!symptoms && !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'At least one of symptoms or imageUrl is required' },
        { status: 400 },
      );
    }

    // Fetch plant details if plantId is provided
    let plantContext = '';
    if (plantId) {
      const plant = await Plant.findById(plantId)
        .populate('species')
        .lean();

      if (plant) {
        const species = plant.species as unknown as Record<string, unknown> | null;
        plantContext = `
Plant Details:
- Name: ${plant.name}
- Plant ID: ${plant.plantId}
- Species: ${species ? `${species.commonName} (${species.scientificName})` : 'Unknown'}
- Current Health Score: ${plant.healthScore}/100
- Current Status: ${plant.status}
- Growth Stage: ${plant.growthStage}
- Placement: ${plant.placement}
- Last Maintenance: ${plant.lastMaintenanceDate ? new Date(plant.lastMaintenanceDate).toLocaleDateString() : 'Unknown'}
`;
        if (species?.careInstructions) {
          const care = species.careInstructions as Record<string, string>;
          plantContext += `
Care Instructions:
- Watering: ${care.watering}
- Sunlight: ${care.sunlight}
- Temperature: ${care.temperature}
- Humidity: ${care.humidity}
`;
        }
      }
    }

    // If no OpenAI key, return a structured fallback analysis
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: true,
          data: {
            diagnosis: generateFallbackDiagnosis(symptoms),
            confidence: 0.7,
            severity: determineSeverity(symptoms),
            recommendations: generateFallbackRecommendations(symptoms),
            possibleCauses: generateFallbackCauses(symptoms),
            immediateActions: [
              'Isolate the plant if pest symptoms are present',
              'Check soil moisture levels',
              'Move to appropriate lighting conditions',
            ],
            aiProvider: 'fallback',
            note: 'OpenAI API key not configured. Using rule-based analysis.',
          },
        },
        { status: 200 },
      );
    }

    // Build the OpenAI prompt
    const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
      {
        role: 'system',
        content: `You are VRIKSHAM AI, an expert plant health diagnostician specializing in indoor and office plants commonly found in Indian corporate and residential environments. Analyze plant symptoms and provide detailed, actionable diagnosis.

Always respond in this exact JSON format:
{
  "diagnosis": "Brief diagnosis summary",
  "confidence": 0.0 to 1.0,
  "severity": "low" | "medium" | "high" | "critical",
  "possibleCauses": ["cause1", "cause2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "immediateActions": ["action1", "action2"],
  "longTermCare": ["care1", "care2"],
  "estimatedRecoveryDays": number
}`,
      },
    ];

    // Build user message
    let userMessage = '';
    if (plantContext) {
      userMessage += plantContext + '\n';
    }
    if (symptoms) {
      userMessage += `\nReported Symptoms:\n${symptoms}\n`;
    }
    if (imageUrl) {
      userMessage += `\nAn image of the plant has been provided for visual analysis.\n`;
    }

    // Use vision model if image is provided
    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userMessage },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: userMessage,
      });
    }

    // Call OpenAI API
    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: imageUrl ? 'gpt-4o' : 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json().catch(() => ({}));
      console.error('[API] OpenAI API error:', errorData);
      return NextResponse.json(
        { success: false, message: 'AI analysis service temporarily unavailable' },
        { status: 502 },
      );
    }

    const openaiData = await openaiResponse.json();
    const analysisText = openaiData.choices?.[0]?.message?.content;

    if (!analysisText) {
      return NextResponse.json(
        { success: false, message: 'Failed to get analysis from AI service' },
        { status: 502 },
      );
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      analysis = {
        diagnosis: analysisText,
        confidence: 0.5,
        severity: 'medium',
        recommendations: ['Please consult a plant specialist for detailed analysis'],
        possibleCauses: [],
        immediateActions: [],
      };
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          ...analysis,
          aiProvider: 'openai',
          model: imageUrl ? 'gpt-4o' : 'gpt-4o-mini',
          analyzedAt: new Date().toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[API] POST /api/ai/analyze error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// Fallback analysis helpers (when OpenAI is unavailable)
// ---------------------------------------------------------------------------

function determineSeverity(symptoms: string): string {
  const lowered = (symptoms || '').toLowerCase();
  if (lowered.includes('dying') || lowered.includes('dead') || lowered.includes('severe') || lowered.includes('rot')) {
    return 'critical';
  }
  if (lowered.includes('yellow') || lowered.includes('drooping') || lowered.includes('wilting') || lowered.includes('brown')) {
    return 'high';
  }
  if (lowered.includes('spots') || lowered.includes('slow growth') || lowered.includes('pale')) {
    return 'medium';
  }
  return 'low';
}

function generateFallbackDiagnosis(symptoms: string): string {
  const lowered = (symptoms || '').toLowerCase();
  if (lowered.includes('yellow')) {
    return 'Leaf yellowing (chlorosis) detected. This typically indicates overwatering, nutrient deficiency, or insufficient light.';
  }
  if (lowered.includes('brown') || lowered.includes('crispy')) {
    return 'Brown/crispy leaf edges suggest underwatering, low humidity, or excessive direct sunlight exposure.';
  }
  if (lowered.includes('droop') || lowered.includes('wilt')) {
    return 'Wilting or drooping indicates either underwatering, root problems, or temperature stress.';
  }
  if (lowered.includes('pest') || lowered.includes('bug') || lowered.includes('insect')) {
    return 'Possible pest infestation detected. Common indoor pests include spider mites, mealybugs, and fungus gnats.';
  }
  if (lowered.includes('spot')) {
    return 'Leaf spots may indicate fungal infection, bacterial disease, or mineral deposits from hard water.';
  }
  return 'General plant health concern detected. A thorough inspection of watering, light, and soil conditions is recommended.';
}

function generateFallbackRecommendations(symptoms: string): string[] {
  const lowered = (symptoms || '').toLowerCase();
  const recommendations: string[] = [];

  if (lowered.includes('yellow') || lowered.includes('overwater')) {
    recommendations.push('Reduce watering frequency. Allow top 2 inches of soil to dry between waterings.');
    recommendations.push('Check drainage holes are not blocked.');
    recommendations.push('Consider testing soil pH and nutrient levels.');
  }
  if (lowered.includes('brown') || lowered.includes('dry') || lowered.includes('crispy')) {
    recommendations.push('Increase watering frequency slightly.');
    recommendations.push('Mist leaves daily or use a humidifier to increase humidity.');
    recommendations.push('Move plant away from direct sunlight or air conditioning vents.');
  }
  if (lowered.includes('pest') || lowered.includes('bug')) {
    recommendations.push('Apply neem oil solution (2ml per liter of water) as a natural pesticide.');
    recommendations.push('Isolate affected plant to prevent spread.');
    recommendations.push('Wipe leaves with diluted rubbing alcohol for visible pests.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Ensure proper watering schedule based on the species requirements.');
    recommendations.push('Verify the plant is receiving appropriate light levels.');
    recommendations.push('Check for proper drainage and soil quality.');
    recommendations.push('Monitor temperature and humidity in the plant area.');
  }

  return recommendations;
}

function generateFallbackCauses(symptoms: string): string[] {
  const lowered = (symptoms || '').toLowerCase();
  const causes: string[] = [];

  if (lowered.includes('yellow')) {
    causes.push('Overwatering leading to root oxygen deprivation');
    causes.push('Nitrogen deficiency in soil');
    causes.push('Insufficient light exposure');
  }
  if (lowered.includes('brown')) {
    causes.push('Low humidity in air-conditioned environments');
    causes.push('Underwatering or inconsistent watering schedule');
    causes.push('Mineral buildup from hard water');
  }
  if (lowered.includes('wilt') || lowered.includes('droop')) {
    causes.push('Inadequate water supply');
    causes.push('Root rot from overwatering');
    causes.push('Heat stress or cold drafts');
  }

  if (causes.length === 0) {
    causes.push('Environmental stress (temperature, humidity, or light changes)');
    causes.push('Watering imbalance');
    causes.push('Natural aging process');
  }

  return causes;
}
