// =============================================================================
// VRIKSHAM - Base API Client
// =============================================================================
// Fetch-based API wrapper with interceptors, auth token management,
// automatic token refresh on 401, and standardized error handling.
// =============================================================================

import type { ApiResponse, ErrorResponse } from '@/types';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const TOKEN_KEY = 'vriksham_access_token';
const REFRESH_TOKEN_KEY = 'vriksham_refresh_token';

// -----------------------------------------------------------------------------
// Token Management
// -----------------------------------------------------------------------------

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void): void {
  refreshSubscribers.push(cb);
}

// -----------------------------------------------------------------------------
// Request / Response Interceptors
// -----------------------------------------------------------------------------

type RequestInterceptor = (
  config: RequestInit & { headers: Record<string, string> }
) => RequestInit & { headers: Record<string, string> };
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];

export function addRequestInterceptor(interceptor: RequestInterceptor): () => void {
  requestInterceptors.push(interceptor);
  return () => {
    const index = requestInterceptors.indexOf(interceptor);
    if (index > -1) requestInterceptors.splice(index, 1);
  };
}

export function addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
  responseInterceptors.push(interceptor);
  return () => {
    const index = responseInterceptors.indexOf(interceptor);
    if (index > -1) responseInterceptors.splice(index, 1);
  };
}

// -----------------------------------------------------------------------------
// Error Handling
// -----------------------------------------------------------------------------

export class ApiRequestError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: Record<string, string[]>;
  public requestId?: string;

  constructor(message: string, statusCode: number, errorResponse?: ErrorResponse) {
    super(message);
    this.name = 'ApiRequestError';
    this.statusCode = statusCode;
    this.code = errorResponse?.error?.code;
    this.details = errorResponse?.error?.details;
    this.requestId = errorResponse?.requestId;
  }
}

async function handleErrorResponse(response: Response): Promise<never> {
  let errorData: ErrorResponse | undefined;
  try {
    errorData = (await response.json()) as ErrorResponse;
  } catch {
    // Response body is not valid JSON
  }

  const message = errorData?.error?.message || `Request failed with status ${response.status}`;
  throw new ApiRequestError(message, response.status, errorData);
}

// -----------------------------------------------------------------------------
// Token Refresh Logic
// -----------------------------------------------------------------------------

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    throw new ApiRequestError('No refresh token available', 401);
  }

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    throw new ApiRequestError('Token refresh failed', 401);
  }

  const data = (await response.json()) as ApiResponse<{
    accessToken: string;
    refreshToken: string;
  }>;
  const { accessToken, refreshToken: newRefreshToken } = data.data;
  setTokens(accessToken, newRefreshToken);
  return accessToken;
}

// -----------------------------------------------------------------------------
// Core Request Function
// -----------------------------------------------------------------------------

interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  skipAuth?: boolean;
  timeout?: number;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, skipAuth = false, timeout = 30000, ...fetchOptions } = options;

  // Build URL with query params
  const url = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Build headers
  const headers: Record<string, string> = { ...DEFAULT_HEADERS };

  // Attach auth token
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Build config
  let config: RequestInit & { headers: Record<string, string> } = {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  // Apply request interceptors
  for (const interceptor of requestInterceptors) {
    config = interceptor(config);
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  config.signal = controller.signal;

  try {
    let response = await fetch(url.toString(), config);

    // Apply response interceptors
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response);
    }

    // Handle 401 -- attempt token refresh
    if (response.status === 401 && !skipAuth) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);

          // Retry original request with new token
          config.headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(url.toString(), config);
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          throw refreshError;
        }
      } else {
        // Queue the request until token is refreshed
        const newToken = await new Promise<string>((resolve) => {
          addRefreshSubscriber(resolve);
        });
        config.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url.toString(), config);
      }
    }

    // Handle error responses
    if (!response.ok) {
      await handleErrorResponse(response);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse JSON response
    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiRequestError('Request timeout', 408);
    }
    throw new ApiRequestError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// -----------------------------------------------------------------------------
// HTTP Method Helpers
// -----------------------------------------------------------------------------

export const api = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PATCH', body });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Upload files using FormData. Omits Content-Type so browser sets
   * the multipart boundary header automatically.
   */
  async upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    const token = getAccessToken();
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token && !options?.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: formData as BodyInit,
    });

    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return response.json() as Promise<T>;
  },
};

export default api;
