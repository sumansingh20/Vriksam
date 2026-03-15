// =============================================================================
// VRIKSHAM - WebSocket Context Provider
// =============================================================================
// Wraps the application with a WebSocket connection that is automatically
// established when the user is authenticated. Provides WebSocket state
// and methods to all child components via React Context.
// =============================================================================

'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import { useWebSocket, type WebSocketMessage } from '@/hooks/use-websocket';
import { useAuthStore } from '@/store/auth-store';

// -----------------------------------------------------------------------------
// Context Type
// -----------------------------------------------------------------------------

type MessageHandler = (data: unknown, message: WebSocketMessage) => void;

interface WebSocketContextValue {
  /** Whether the WebSocket is currently connected */
  isConnected: boolean;
  /** The last message received over the WebSocket */
  lastMessage: WebSocketMessage | null;
  /** Number of reconnection attempts */
  connectionAttempts: number;
  /** Send a message through the WebSocket */
  sendMessage: (event: string, data?: unknown, room?: string) => void;
  /** Subscribe to a specific WebSocket event type */
  subscribe: (eventType: string, handler: MessageHandler) => void;
  /** Unsubscribe from a specific WebSocket event type */
  unsubscribe: (eventType: string, handler: MessageHandler) => void;
  /** Join a named room */
  joinRoom: (room: string) => void;
  /** Leave a named room */
  leaveRoom: (room: string) => void;
}

// Default no-op context value (used when provider is not mounted)
const defaultContextValue: WebSocketContextValue = {
  isConnected: false,
  lastMessage: null,
  connectionAttempts: 0,
  sendMessage: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  joinRoom: () => {},
  leaveRoom: () => {},
};

const WebSocketContext = createContext<WebSocketContextValue>(defaultContextValue);

// -----------------------------------------------------------------------------
// Provider Component
// -----------------------------------------------------------------------------

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  // Read authentication state from Zustand store
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Only connect when the user is authenticated and has a valid token
  const ws = useWebSocket({
    token,
    userRole: user?.role,
    userId: user?.id,
    enabled: isAuthenticated && !!token,
  });

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo<WebSocketContextValue>(
    () => ({
      isConnected: ws.isConnected,
      lastMessage: ws.lastMessage,
      connectionAttempts: ws.connectionAttempts,
      sendMessage: ws.sendMessage,
      subscribe: ws.subscribe,
      unsubscribe: ws.unsubscribe,
      joinRoom: ws.joinRoom,
      leaveRoom: ws.leaveRoom,
    }),
    [
      ws.isConnected,
      ws.lastMessage,
      ws.connectionAttempts,
      ws.sendMessage,
      ws.subscribe,
      ws.unsubscribe,
      ws.joinRoom,
      ws.leaveRoom,
    ]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

/**
 * Access the WebSocket context from any child component.
 *
 * Usage:
 * ```tsx
 * const { isConnected, subscribe, sendMessage } = useWebSocketContext();
 * ```
 */
export function useWebSocketContext(): WebSocketContextValue {
  return useContext(WebSocketContext);
}

export default WebSocketProvider;
