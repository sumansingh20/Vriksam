import OpenAI from 'openai';
import config from '../config';

const openai = config.openai.apiKey
  ? new OpenAI({ apiKey: config.openai.apiKey })
  : null;

function getOpenAI(): OpenAI {
  if (!openai) {
    throw new Error('OpenAI is not configured. Set OPENAI_API_KEY in environment.');
  }
  return openai;
}

const SYSTEM_PROMPTS = {
  plantDiagnosis: `You are an expert plant pathologist and horticulturist working for Vriksham, a green infrastructure management company.
Your task is to analyze plant health based on descriptions and/or images provided.

When analyzing a plant, provide:
1. **Diagnosis**: Identify any diseases, pests, nutrient deficiencies, or environmental stressors
2. **Severity**: Rate the severity from 1-10 (1=minor, 10=critical)
3. **Health Score**: Rate overall health from 0-100
4. **Causes**: Explain likely causes of any issues found
5. **Treatment**: Provide specific, actionable treatment recommendations
6. **Prevention**: Suggest preventive measures for the future
7. **Urgency**: Indicate if immediate action is required

Format your response as structured JSON with keys: diagnosis, severity, healthScore, causes, treatment, prevention, urgency (boolean), summary.`,

  healthPrediction: `You are a predictive analytics AI for Vriksham's green infrastructure platform.
Based on the plant's historical health data, species characteristics, and environmental conditions, predict:
1. **Trend**: Whether plant health is improving, stable, or declining
2. **Predicted Health Score**: Estimated health score in 30 days
3. **Risk Factors**: Potential risks in the coming weeks
4. **Recommended Actions**: Proactive steps to maintain or improve health
5. **Confidence**: Your confidence level in the prediction (low/medium/high)

Format your response as JSON with keys: trend, predictedHealthScore, riskFactors (array), recommendedActions (array), confidence, explanation.`,

  careRecommendation: `You are a plant care specialist AI for Vriksham, an indoor and outdoor green infrastructure company.
Based on the plant species, current conditions, and location type, provide detailed care recommendations:
1. **Watering**: Frequency, amount, and method
2. **Light**: Optimal light conditions and adjustments needed
3. **Soil**: Soil type and fertilization schedule
4. **Temperature**: Ideal temperature range
5. **Humidity**: Humidity preferences and how to maintain them
6. **Pruning**: When and how to prune
7. **Common Issues**: What to watch for
8. **Seasonal Adjustments**: Changes needed by season

Format your response as JSON with keys: watering, light, soil, temperature, humidity, pruning, commonIssues (array), seasonalAdjustments (object with spring/summer/autumn/winter keys).`,

  chatAssistant: `You are Vriksham AI, an intelligent assistant for the Vriksham Green Infrastructure Platform.
You help users with:
- Plant care and health questions
- Understanding their dashboard data and analytics
- Maintenance scheduling advice
- ESG (Environmental, Social, Governance) metrics interpretation
- General plant knowledge and recommendations

Be conversational, helpful, and knowledgeable. If you don't know something specific to their account data, let them know you'd need access to their specific records.
Always maintain a professional yet friendly tone. You're passionate about plants and sustainability.`,
};

export interface DiagnosisResult {
  diagnosis: string;
  severity: number;
  healthScore: number;
  causes: string;
  treatment: string;
  prevention: string;
  urgency: boolean;
  summary: string;
}

export interface PredictionResult {
  trend: 'improving' | 'stable' | 'declining';
  predictedHealthScore: number;
  riskFactors: string[];
  recommendedActions: string[];
  confidence: 'low' | 'medium' | 'high';
  explanation: string;
}

export interface CareRecommendation {
  watering: string;
  light: string;
  soil: string;
  temperature: string;
  humidity: string;
  pruning: string;
  commonIssues: string[];
  seasonalAdjustments: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
}

export const aiService = {
  /**
   * Diagnose a plant's health based on description and optional image URL
   */
  async diagnosePlant(params: {
    description: string;
    speciesName?: string;
    imageUrl?: string;
    currentConditions?: string;
  }): Promise<DiagnosisResult> {
    const client = getOpenAI();

    const userContent: OpenAI.ChatCompletionContentPart[] = [];

    let textPrompt = `Please diagnose this plant:\n\nDescription: ${params.description}`;
    if (params.speciesName) {
      textPrompt += `\nSpecies: ${params.speciesName}`;
    }
    if (params.currentConditions) {
      textPrompt += `\nCurrent Conditions: ${params.currentConditions}`;
    }

    userContent.push({ type: 'text', text: textPrompt });

    if (params.imageUrl) {
      userContent.push({
        type: 'image_url',
        image_url: { url: params.imageUrl, detail: 'high' },
      });
    }

    const response = await client.chat.completions.create({
      model: config.openai.model,
      max_tokens: config.openai.maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.plantDiagnosis },
        { role: 'user', content: userContent },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    return JSON.parse(content) as DiagnosisResult;
  },

  /**
   * Predict future plant health based on historical data
   */
  async predictHealth(params: {
    speciesName: string;
    healthHistory: Array<{ date: string; score: number; notes?: string }>;
    locationInfo?: string;
    currentSeason?: string;
  }): Promise<PredictionResult> {
    const client = getOpenAI();

    const prompt = `Predict the health trajectory for this plant:

Species: ${params.speciesName}
${params.locationInfo ? `Location: ${params.locationInfo}` : ''}
${params.currentSeason ? `Current Season: ${params.currentSeason}` : ''}

Health History (most recent first):
${params.healthHistory
  .map((h) => `- ${h.date}: Score ${h.score}/100${h.notes ? ` (${h.notes})` : ''}`)
  .join('\n')}`;

    const response = await client.chat.completions.create({
      model: config.openai.model,
      max_tokens: config.openai.maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.healthPrediction },
        { role: 'user', content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    return JSON.parse(content) as PredictionResult;
  },

  /**
   * Get care recommendations for a plant species in a specific environment
   */
  async getCareRecommendation(params: {
    speciesName: string;
    scientificName?: string;
    locationType?: string;
    currentConditions?: string;
    issues?: string;
  }): Promise<CareRecommendation> {
    const client = getOpenAI();

    const prompt = `Provide care recommendations for:

Species: ${params.speciesName}${params.scientificName ? ` (${params.scientificName})` : ''}
${params.locationType ? `Location Type: ${params.locationType}` : ''}
${params.currentConditions ? `Current Conditions: ${params.currentConditions}` : ''}
${params.issues ? `Known Issues: ${params.issues}` : ''}`;

    const response = await client.chat.completions.create({
      model: config.openai.model,
      max_tokens: config.openai.maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.careRecommendation },
        { role: 'user', content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    return JSON.parse(content) as CareRecommendation;
  },

  /**
   * Chat completion with Vriksham AI assistant
   */
  async chat(params: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    context?: string;
  }): Promise<string> {
    const client = getOpenAI();

    let systemPrompt = SYSTEM_PROMPTS.chatAssistant;
    if (params.context) {
      systemPrompt += `\n\nAdditional context about the user's account:\n${params.context}`;
    }

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...params.messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const response = await client.chat.completions.create({
      model: config.openai.model,
      max_tokens: config.openai.maxTokens,
      messages,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    return content;
  },
};

export default aiService;
