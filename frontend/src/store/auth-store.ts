// =============================================================================
// VRIKSHAM - Auth Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

// -----------------------------------------------------------------------------
// State Interface
// -----------------------------------------------------------------------------

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
}

interface AuthActions {
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  updateUser: (updates: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  isHydrated: false,
};

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (user, token, refreshToken) => {
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          ...initialState,
          isLoading: false,
          isHydrated: true,
        });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token) => {
        set({ token });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setHydrated: (isHydrated) => {
        set({ isHydrated });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'vriksham-auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // SSR fallback: return a no-op storage
        return {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        };
      }),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            state.setHydrated(true);
            state.setLoading(false);
          }
        };
      },
    }
  )
);

// -----------------------------------------------------------------------------
// Selectors (for performance-optimized subscriptions)
// -----------------------------------------------------------------------------

export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectToken = (state: AuthStore) => state.token;
