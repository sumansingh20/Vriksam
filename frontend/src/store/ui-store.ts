// =============================================================================
// VRIKSHAM - UI Store (Zustand)
// =============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type Theme = 'light' | 'dark' | 'system';
export type ModalId = string | null;

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// -----------------------------------------------------------------------------
// State Interface
// -----------------------------------------------------------------------------

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Theme
  theme: Theme;

  // Modal
  activeModal: ModalId;
  modalData: Record<string, unknown> | null;

  // Notifications
  notifications: Notification[];

  // Global loading states
  globalLoading: boolean;
  loadingMessage: string | null;

  // Command palette
  commandPaletteOpen: boolean;
}

interface UIActions {
  // Sidebar
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Theme
  setTheme: (theme: Theme) => void;

  // Modal
  setActiveModal: (modalId: ModalId, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Global loading
  setGlobalLoading: (loading: boolean, message?: string) => void;

  // Command palette
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
}

type UIStore = UIState & UIActions;

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'system',
  activeModal: null,
  modalData: null,
  notifications: [],
  globalLoading: false,
  loadingMessage: null,
  commandPaletteOpen: false,
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

let notificationCounter = 0;

function generateNotificationId(): string {
  notificationCounter += 1;
  return `notification-${Date.now()}-${notificationCounter}`;
}

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Sidebar
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      toggleSidebarCollapsed: () =>
        set({ sidebarCollapsed: !get().sidebarCollapsed }),

      // Theme
      setTheme: (theme) => {
        set({ theme });
        // Apply theme class to document
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          root.classList.remove('light', 'dark');

          if (theme === 'system') {
            const systemDark = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches;
            root.classList.add(systemDark ? 'dark' : 'light');
          } else {
            root.classList.add(theme);
          }
        }
      },

      // Modal
      setActiveModal: (activeModal, modalData = undefined) =>
        set({ activeModal, modalData }),
      closeModal: () => set({ activeModal: null, modalData: undefined }),

      // Notifications
      addNotification: (notification) => {
        const id = generateNotificationId();
        const newNotification: Notification = { ...notification, id };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove after duration (default 5s)
        const duration = notification.duration ?? 5000;
        if (duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, duration);
        }
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),

      // Global loading
      setGlobalLoading: (globalLoading, loadingMessage = undefined) =>
        set({ globalLoading, loadingMessage }),

      // Command palette
      setCommandPaletteOpen: (commandPaletteOpen) =>
        set({ commandPaletteOpen }),
      toggleCommandPalette: () =>
        set({ commandPaletteOpen: !get().commandPaletteOpen }),
    }),
    {
      name: 'vriksham-ui',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        };
      }),
      // Only persist theme and sidebar preferences
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// -----------------------------------------------------------------------------
// Selectors
// -----------------------------------------------------------------------------

export const selectTheme = (state: UIStore) => state.theme;
export const selectSidebarOpen = (state: UIStore) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIStore) => state.sidebarCollapsed;
export const selectActiveModal = (state: UIStore) => state.activeModal;
export const selectNotifications = (state: UIStore) => state.notifications;
