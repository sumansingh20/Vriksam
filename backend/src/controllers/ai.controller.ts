import { Request, Response } from 'express';
import prisma from '../config/database';
import aiService from '../services/ai.service';

export const aiController = {
  /**
   * POST /ai/plant-diagnosis
   * Diagnose a plant's health using AI from description/image
   */
  async plantDiagnosis(req: Request, res: Response): Promise<void> {
    try {
      const { description, speciesId, imageUrl, currentConditions } = req.body;

      if (!description && !imageUrl) {
        res.status(400).json({
          success: false,
          error: 'Please provide a description or image URL for diagnosis.',
        });
        return;
      }

      // Get species name if speciesId is provided
      let speciesName: string | undefined;
      if (speciesId) {
        const species = await prisma.plantSpecies.findUnique({
          where: { id: speciesId },
          select: { commonName: true, scientificName: true },
        });
        if (species) {
          speciesName = `${species.commonName} (${species.scientificName})`;
        }
      }

      const diagnosis = await aiService.diagnosePlant({
        description: description || 'Please analyze the provided image.',
        speciesName,
        imageUrl,
        currentConditions,
      });

      res.status(200).json({
        success: true,
        data: diagnosis,
      });
    } catch (error) {
      console.error('Plant diagnosis error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('not configured')) {
        res.status(503).json({
          success: false,
          error: 'AI service is not configured. Please set OPENAI_API_KEY.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to diagnose plant. Please try again.',
      });
    }
  },

  /**
   * POST /ai/health-prediction
   * Predict future health of a plant based on history
   */
  async healthPrediction(req: Request, res: Response): Promise<void> {
    try {
      const { plantId } = req.body;

      if (!plantId) {
        res.status(400).json({
          success: false,
          error: 'Plant ID is required.',
        });
        return;
      }

      // Fetch plant data with health history
      const plant = await prisma.plant.findUnique({
        where: { id: plantId },
        include: {
          species: {
            select: { commonName: true, scientificName: true },
          },
          location: {
            select: { name: true, type: true },
          },
          healthLogs: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
              healthScore: true,
              notes: true,
              createdAt: true,
            },
          },
        },
      });

      if (!plant) {
        res.status(404).json({ success: false, error: 'Plant not found.' });
        return;
      }

      if (plant.healthLogs.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No health history available for this plant. At least one health log is required.',
        });
        return;
      }

      const healthHistory = plant.healthLogs.map((log) => ({
        date: log.createdAt.toISOString().split('T')[0],
        score: log.healthScore,
        notes: log.notes || undefined,
      }));

      // Determine current season
      const month = new Date().getMonth();
      const seasons = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Autumn', 'Autumn', 'Autumn', 'Winter'];
      const currentSeason = seasons[month];

      const prediction = await aiService.predictHealth({
        speciesName: `${plant.species.commonName} (${plant.species.scientificName})`,
        healthHistory,
        locationInfo: `${plant.location.name} (${plant.location.type})`,
        currentSeason,
      });

      res.status(200).json({
        success: true,
        data: {
          plant: {
            id: plant.id,
            species: plant.species.commonName,
            location: plant.location.name,
          },
          prediction,
        },
      });
    } catch (error) {
      console.error('Health prediction error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('not configured')) {
        res.status(503).json({
          success: false,
          error: 'AI service is not configured. Please set OPENAI_API_KEY.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to generate health prediction.',
      });
    }
  },

  /**
   * POST /ai/care-recommendation
   * Get AI-powered care recommendations for a plant
   */
  async careRecommendation(req: Request, res: Response): Promise<void> {
    try {
      const { plantId, speciesId, locationType, currentConditions, issues } = req.body;

      let speciesName: string | undefined;
      let scientificName: string | undefined;
      let resolvedLocationType: string | undefined = locationType;

      // If plantId is provided, fetch details
      if (plantId) {
        const plant = await prisma.plant.findUnique({
          where: { id: plantId },
          include: {
            species: { select: { commonName: true, scientificName: true } },
            location: { select: { type: true } },
          },
        });

        if (!plant) {
          res.status(404).json({ success: false, error: 'Plant not found.' });
          return;
        }

        speciesName = plant.species.commonName;
        scientificName = plant.species.scientificName;
        resolvedLocationType = resolvedLocationType || plant.location.type;
      } else if (speciesId) {
        const species = await prisma.plantSpecies.findUnique({
          where: { id: speciesId },
          select: { commonName: true, scientificName: true },
        });

        if (!species) {
          res.status(404).json({ success: false, error: 'Species not found.' });
          return;
        }

        speciesName = species.commonName;
        scientificName = species.scientificName;
      }

      if (!speciesName) {
        res.status(400).json({
          success: false,
          error: 'Please provide either a plantId or speciesId.',
        });
        return;
      }

      const recommendation = await aiService.getCareRecommendation({
        speciesName,
        scientificName,
        locationType: resolvedLocationType,
        currentConditions,
        issues,
      });

      res.status(200).json({
        success: true,
        data: recommendation,
      });
    } catch (error) {
      console.error('Care recommendation error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('not configured')) {
        res.status(503).json({
          success: false,
          error: 'AI service is not configured. Please set OPENAI_API_KEY.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to generate care recommendations.',
      });
    }
  },

  /**
   * POST /ai/chat
   * Chat with Vriksham AI assistant
   */
  async chat(req: Request, res: Response): Promise<void> {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({
          success: false,
          error: 'Messages array is required and must not be empty.',
        });
        return;
      }

      // Build context from user's data if authenticated
      let context: string | undefined;
      if (req.user) {
        const userData = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: {
            name: true,
            role: true,
            client: {
              select: {
                companyName: true,
                status: true,
                _count: { select: { locations: true } },
              },
            },
          },
        });

        if (userData) {
          const parts: string[] = [`User: ${userData.name} (${userData.role})`];
          if (userData.client) {
            parts.push(`Company: ${userData.client.companyName || 'N/A'}`);
            parts.push(`Locations: ${userData.client._count.locations}`);
            parts.push(`Status: ${userData.client.status}`);
          }
          context = parts.join('\n');
        }
      }

      // Validate message format
      const validatedMessages = messages.map((msg: { role: string; content: string }) => {
        if (!msg.role || !msg.content) {
          throw new Error('Each message must have a role and content.');
        }
        return {
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        };
      });

      const response = await aiService.chat({
        messages: validatedMessages,
        context,
      });

      res.status(200).json({
        success: true,
        data: {
          message: response,
        },
      });
    } catch (error) {
      console.error('AI chat error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      if (message.includes('not configured')) {
        res.status(503).json({
          success: false,
          error: 'AI service is not configured. Please set OPENAI_API_KEY.',
        });
        return;
      }
      if (message.includes('must have a role')) {
        res.status(400).json({
          success: false,
          error: message,
        });
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Failed to process chat request.',
      });
    }
  },
};

export default aiController;
