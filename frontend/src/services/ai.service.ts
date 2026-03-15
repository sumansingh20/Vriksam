// =============================================================================
// VRIKSHAM - AI Service
// =============================================================================

import api from './api';
import type { ApiResponse } from '@/types';
import type {
  AIDiagnosisRequest,
  AIDiagnosisResponse,
  AIHealthPrediction,
  AIChatRequest,
  AIChatResponse,
} from '@/types';

const AI_PREFIX = '/ai';

/**
 * AI-powered care recommendation response.
 */
export interface AICareRecommendation {
  plantId: string;
  recommendations: Array<{
    category: string;
    action: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    frequency?: string;
    details?: string;
  }>;
  optimalConditions: {
    temperature?: number;
    humidity?: number;
    lightLevel?: number;
    soilMoisture?: number;
    soilPh?: number;
  };
}

export const aiService = {
  /**
   * Submit a plant for AI-powered diagnosis.
   * Analyzes symptoms, images, and sensor data to identify issues.
   */
  async diagnosePlant(data: AIDiagnosisRequest): Promise<AIDiagnosisResponse> {
    const response = await api.post<ApiResponse<AIDiagnosisResponse>>(
      `${AI_PREFIX}/diagnose`,
      data
    );
    return response.data;
  },

  /**
   * Predict future health trajectory for a plant.
   * Uses historical data and environmental factors.
   */
  async predictHealth(
    plantId: string,
    params?: { daysAhead?: number }
  ): Promise<AIHealthPrediction> {
    const response = await api.get<ApiResponse<AIHealthPrediction>>(
      `${AI_PREFIX}/predict/${plantId}`,
      {
        params: {
          daysAhead: params?.daysAhead,
        },
      }
    );
    return response.data;
  },

  /**
   * Get personalized care recommendations for a plant.
   */
  async getCareRecommendation(plantId: string): Promise<AICareRecommendation> {
    const response = await api.get<ApiResponse<AICareRecommendation>>(
      `${AI_PREFIX}/recommendations/${plantId}`
    );
    return response.data;
  },

  /**
   * Send a message to the AI plant care assistant chatbot.
   */
  async chat(data: AIChatRequest): Promise<AIChatResponse> {
    const response = await api.post<ApiResponse<AIChatResponse>>(
      `${AI_PREFIX}/chat`,
      data
    );
    return response.data;
  },
};

export default aiService;
