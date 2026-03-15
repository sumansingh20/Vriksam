// =============================================================================
// VRIKSHAM - Auth Service
// =============================================================================

import api, { setTokens, clearTokens } from './api';
import type {
  ApiResponse,
  AuthSession,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
} from '@/types';

const AUTH_PREFIX = '/auth';

export const authService = {
  /**
   * Authenticate user with email and password.
   */
  async login(credentials: LoginRequest): Promise<AuthSession> {
    const response = await api.post<ApiResponse<AuthSession>>(
      `${AUTH_PREFIX}/login`,
      credentials,
      { skipAuth: true }
    );
    const { tokens } = response.data;
    setTokens(tokens.accessToken, tokens.refreshToken);
    return response.data;
  },

  /**
   * Register a new user account.
   */
  async register(data: RegisterRequest): Promise<AuthSession> {
    const response = await api.post<ApiResponse<AuthSession>>(
      `${AUTH_PREFIX}/register`,
      data,
      { skipAuth: true }
    );
    const { tokens } = response.data;
    setTokens(tokens.accessToken, tokens.refreshToken);
    return response.data;
  },

  /**
   * Log out the current user and invalidate tokens server-side.
   */
  async logout(): Promise<void> {
    try {
      await api.post(`${AUTH_PREFIX}/logout`);
    } finally {
      clearTokens();
    }
  },

  /**
   * Refresh the access token using the stored refresh token.
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post<ApiResponse<AuthTokens>>(
      `${AUTH_PREFIX}/refresh`,
      { refreshToken },
      { skipAuth: true }
    );
    const tokens = response.data;
    setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens;
  },

  /**
   * Fetch the currently authenticated user's profile.
   */
  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${AUTH_PREFIX}/me`);
    return response.data;
  },

  /**
   * Request a password reset email.
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${AUTH_PREFIX}/forgot-password`,
      data,
      { skipAuth: true }
    );
    return response.data;
  },

  /**
   * Reset password using a token from the reset email.
   */
  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${AUTH_PREFIX}/reset-password`,
      data,
      { skipAuth: true }
    );
    return response.data;
  },

  /**
   * Change current user's password (requires current password).
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `${AUTH_PREFIX}/change-password`,
      data
    );
    return response.data;
  },

  /**
   * Update current user's profile.
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<ApiResponse<User>>(`${AUTH_PREFIX}/me`, data);
    return response.data;
  },
};

export default authService;
