import api from './api';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MarketplaceCatalogItem {
  id: string;
  slug: string;
  name: string;
  scientificName: string;
  category: string;
  categories: string[];
  lightRequirement: string;
  difficulty: string;
  description: string | null;
  careInstructions: string | null;
  imageUrl: string | null;
  humidityPreference: string | null;
  temperatureMin: number | null;
  temperatureMax: number | null;
  plantCount: number;
  healthyPlantCount: number;
  needsAttentionCount: number;
  criticalCount: number;
  healthRatio: number;
  healthBand: 'Excellent' | 'Good' | 'Needs Attention' | 'No Data';
  inventoryQuantity: number;
  averageUnitCost: number | null;
  minUnitCost: number | null;
  maxUnitCost: number | null;
  updatedAt: string;
}

export interface MarketplaceCatalogQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  light?: string;
  difficulty?: string;
  sortBy?: 'popular' | 'name' | 'price-asc' | 'price-desc' | 'inventory' | 'newest' | 'health';
}

export interface MarketplaceCatalogResponse {
  items: MarketplaceCatalogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function formatMarketplaceCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const marketplaceService = {
  async getCatalog(
    query: MarketplaceCatalogQuery = {}
  ): Promise<MarketplaceCatalogResponse> {
    const response = await api.get<ApiEnvelope<MarketplaceCatalogItem[]>>('/plants/catalog', {
      params: {
        page: query.page,
        limit: query.limit,
        search: query.search,
        category: query.category,
        light: query.light,
        difficulty: query.difficulty,
        sortBy: query.sortBy,
      },
      skipAuth: true,
    });

    return {
      items: response.data ?? [],
      pagination: response.pagination ?? {
        page: 1,
        limit: query.limit ?? 24,
        total: (response.data ?? []).length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  async getBySlug(slug: string): Promise<MarketplaceCatalogItem> {
    const response = await api.get<ApiEnvelope<MarketplaceCatalogItem>>(
      `/plants/catalog/${encodeURIComponent(slug)}`,
      { skipAuth: true }
    );

    return response.data;
  },
};

export default marketplaceService;
