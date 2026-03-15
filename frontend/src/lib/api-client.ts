// =============================================================================
// VRIKSHAM - Frontend API Client
// =============================================================================
// API client for calling Next.js API routes (serverless) instead of a separate
// Express backend. Automatically handles auth tokens from cookies/localStorage,
// retries on 401 with token refresh, and provides typed responses.
//
// Base URL: '/api' (same origin -- works seamlessly on Vercel)
// =============================================================================

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/** Standard API success response wrapper. */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/** Standard API error response wrapper. */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, string[]>;
  };
  requestId?: string;
}

/** Union of possible API responses. */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Configuration for individual requests. */
export interface RequestConfig {
  /** Query parameters to append to the URL. */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Additional headers to merge with defaults. */
  headers?: Record<string, string>;
  /** Skip automatic Authorization header attachment. */
  skipAuth?: boolean;
  /** Request timeout in milliseconds (default: 30000). */
  timeout?: number;
  /** AbortSignal for manual cancellation. */
  signal?: AbortSignal;
}

// -----------------------------------------------------------------------------
// Custom Error Class
// -----------------------------------------------------------------------------

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, string[]>;
  public readonly requestId?: string;

  constructor(
    message: string,
    statusCode: number,
    options?: {
      code?: string;
      details?: Record<string, string[]>;
      requestId?: string;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = options?.code;
    this.details = options?.details;
    this.requestId = options?.requestId;
  }

  /** Whether this is a client-side error (4xx). */
  get isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  /** Whether this is a server-side error (5xx). */
  get isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /** Whether this is a network or timeout error. */
  get isNetworkError(): boolean {
    return this.statusCode === 0 || this.statusCode === 408;
  }

  /** Whether this is an authentication error. */
  get isAuthError(): boolean {
    return this.statusCode === 401;
  }

  /** Whether this is a forbidden error. */
  get isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /** Whether this is a not-found error. */
  get isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /** Whether this is a validation error. */
  get isValidationError(): boolean {
    return this.statusCode === 422;
  }
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const BASE_URL = '/api';
const TOKEN_STORAGE_KEY = 'vriksham_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'vriksham_refresh_token';
const DEFAULT_TIMEOUT = 30_000;

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

// -----------------------------------------------------------------------------
// Token Management
// -----------------------------------------------------------------------------

function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Try cookie first (set by middleware / NextAuth)
  const cookieToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('vriksham-token='))
    ?.split('=')[1];
  if (cookieToken) return cookieToken;

  // Fall back to localStorage
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

  // Also set as cookie for middleware to read
  document.cookie = `vriksham-token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);

  // Clear cookie
  document.cookie = 'vriksham-token=; path=/; max-age=0; SameSite=Lax';
}

// -----------------------------------------------------------------------------
// Token Refresh Queue
// -----------------------------------------------------------------------------
// When multiple requests fail with 401 simultaneously, only one refresh
// request is sent. All others queue up and are resolved once the refresh
// completes.
// -----------------------------------------------------------------------------

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

function processRefreshQueue(error: Error | null, token: string | null): void {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    redirectToLogin();
    throw new ApiError('No refresh token available', 401);
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      redirectToLogin();
      throw new ApiError('Token refresh failed', response.status);
    }

    const data = (await response.json()) as ApiSuccessResponse<{
      accessToken: string;
      refreshToken: string;
    }>;

    const { accessToken, refreshToken: newRefreshToken } = data.data;
    setTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    clearTokens();
    redirectToLogin();
    throw error instanceof ApiError
      ? error
      : new ApiError('Token refresh failed', 401);
  }
}

// -----------------------------------------------------------------------------
// Redirect Helper
// -----------------------------------------------------------------------------

function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/register') {
    window.location.href = `/login?callbackUrl=${encodeURIComponent(currentPath)}`;
  }
}

// -----------------------------------------------------------------------------
// URL Builder
// -----------------------------------------------------------------------------

function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  if (!params) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

// -----------------------------------------------------------------------------
// Core Request Function
// -----------------------------------------------------------------------------

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  config: RequestConfig = {}
): Promise<T> {
  const {
    params,
    headers: extraHeaders,
    skipAuth = false,
    timeout = DEFAULT_TIMEOUT,
    signal: externalSignal,
  } = config;

  const url = buildUrl(endpoint, params);

  // Build headers
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...extraHeaders,
  };

  // Attach auth token
  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // If caller provides an external signal, also listen to it
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    signal: controller.signal,
  };

  if (body !== undefined && body !== null) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    let response = await fetch(url, fetchOptions);

    // Handle 401 -- attempt token refresh and retry
    if (response.status === 401 && !skipAuth) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          processRefreshQueue(null, newToken);

          // Retry the original request with the new token
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryOptions: RequestInit = { ...fetchOptions, headers };
          response = await fetch(url, retryOptions);
        } catch (refreshError) {
          isRefreshing = false;
          processRefreshQueue(refreshError as Error, null);
          throw refreshError;
        }
      } else {
        // Another refresh is in progress -- queue this request
        const newToken = await new Promise<string>((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });

        headers['Authorization'] = `Bearer ${newToken}`;
        const retryOptions: RequestInit = { ...fetchOptions, headers };
        response = await fetch(url, retryOptions);
      }
    }

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: ApiErrorResponse | undefined;
      try {
        errorData = (await response.json()) as ApiErrorResponse;
      } catch {
        // Response body is not valid JSON -- ignore
      }

      const message =
        errorData?.error?.message ||
        `Request failed with status ${response.status}`;

      throw new ApiError(message, response.status, {
        code: errorData?.error?.code,
        details: errorData?.error?.details,
        requestId: errorData?.requestId,
      });
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Parse and return JSON
    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    // Re-throw ApiError instances as-is
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle timeout / abort
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 408);
    }

    // Handle network errors
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected network error occurred',
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// -----------------------------------------------------------------------------
// Public API Methods
// -----------------------------------------------------------------------------

/**
 * API client for calling Next.js API routes.
 *
 * @example
 * ```ts
 * // GET request
 * const clients = await apiClient.get<ApiSuccessResponse<Client[]>>('/clients', {
 *   params: { page: 1, limit: 10, status: 'active' },
 * });
 *
 * // POST request
 * const newPlant = await apiClient.post<ApiSuccessResponse<Plant>>('/plants', {
 *   name: 'Monstera Deliciosa',
 *   locationId: 'loc_123',
 * });
 *
 * // PATCH request
 * const updated = await apiClient.patch<ApiSuccessResponse<Plant>>('/plants/plant_123', {
 *   healthScore: 85,
 * });
 *
 * // DELETE request
 * await apiClient.del('/plants/plant_123');
 * ```
 */
export const apiClient = {
  /**
   * Send a GET request.
   * @param endpoint - API endpoint path (e.g., '/clients')
   * @param config   - Optional request configuration
   */
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>('GET', endpoint, undefined, config);
  },

  /**
   * Send a POST request.
   * @param endpoint - API endpoint path (e.g., '/auth/login')
   * @param body     - Request body (will be JSON-serialized)
   * @param config   - Optional request configuration
   */
  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>('POST', endpoint, body, config);
  },

  /**
   * Send a PUT request.
   * @param endpoint - API endpoint path
   * @param body     - Request body (will be JSON-serialized)
   * @param config   - Optional request configuration
   */
  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>('PUT', endpoint, body, config);
  },

  /**
   * Send a PATCH request.
   * @param endpoint - API endpoint path (e.g., '/plants/plant_123')
   * @param body     - Partial update body (will be JSON-serialized)
   * @param config   - Optional request configuration
   */
  patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return request<T>('PATCH', endpoint, body, config);
  },

  /**
   * Send a DELETE request.
   * @param endpoint - API endpoint path (e.g., '/plants/plant_123')
   * @param config   - Optional request configuration
   */
  del<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return request<T>('DELETE', endpoint, undefined, config);
  },

  /**
   * Upload files using FormData.
   * Omits Content-Type so the browser sets the multipart boundary automatically.
   *
   * @param endpoint - API endpoint path (e.g., '/plants/plant_123/image')
   * @param formData - FormData containing the files to upload
   * @param config   - Optional request configuration
   */
  async upload<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<T> {
    const {
      skipAuth = false,
      timeout = 60_000,
      signal: externalSignal,
    } = config || {};

    const url = buildUrl(endpoint, config?.params);

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (!skipAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (externalSignal) {
      externalSignal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorData: ApiErrorResponse | undefined;
        try {
          errorData = (await response.json()) as ApiErrorResponse;
        } catch {
          // not JSON
        }
        throw new ApiError(
          errorData?.error?.message || `Upload failed with status ${response.status}`,
          response.status,
          {
            code: errorData?.error?.code,
            details: errorData?.error?.details,
            requestId: errorData?.requestId,
          }
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Upload timed out', 408);
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Upload failed',
        0
      );
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

export default apiClient;
