// =============================================================================
// VRIKSHAM - Auth Hook
// =============================================================================
// Provides authentication actions and state by combining
// the Zustand auth store with auth service API calls.
// =============================================================================

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import authService from '@/services/auth.service';
import { setTokens, clearTokens } from '@/services/api';
import type { LoginRequest, RegisterRequest } from '@/types';

// Alias types used by this hook
type LoginCredentials = LoginRequest;
type RegisterData = RegisterRequest;

export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    isHydrated,
    login: storeLogin,
    logout: storeLogout,
    setUser,
    setLoading,
    updateUser,
  } = useAuthStore();

  /**
   * Log in with email/password credentials.
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const response = await authService.login(credentials);
        storeLogin(
          response.user,
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
        router.push('/dashboard');
        return response;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [storeLogin, setLoading, router]
  );

  /**
   * Register a new account.
   */
  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true);
      try {
        const response = await authService.register(data);
        storeLogin(
          response.user,
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
        router.push('/dashboard');
        return response;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [storeLogin, setLoading, router]
  );

  /**
   * Log out, clear tokens, and redirect to login.
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Proceed with local logout even if API call fails
    } finally {
      storeLogout();
      clearTokens();
      router.push('/login');
    }
  }, [storeLogout, router]);

  /**
   * Fetch and update the current user profile.
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
      return currentUser;
    } catch {
      // If fetching user fails (e.g., token expired), log out
      storeLogout();
      clearTokens();
      return null;
    }
  }, [setUser, storeLogout]);

  /**
   * Initialize auth state on app load.
   * Validates existing tokens and fetches user profile.
   */
  const initialize = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch {
      storeLogout();
      clearTokens();
    } finally {
      setLoading(false);
    }
  }, [token, setUser, setLoading, storeLogout]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    isHydrated,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    initialize,
    updateUser,
    setTokens,
  };
}

export default useAuth;
