// =============================================================================
// VRIKSHAM - WebSocket Hook
// =============================================================================
// React hook for managing a WebSocket connection to the backend.
// Features: JWT auth, auto-reconnect with exponential backoff,
// event subscription/unsubscription, room joining.
// =============================================================================

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface WebSocketMessage {
  event: string;
  data: unknown;
  room?: string;
  timestamp: string;
}

type MessageHandler = (data: unknown, message: WebSocketMessage) => void;

interface UseWebSocketOptions {
  /** JWT token for authentication */
  token: string | null;
  /** User role for auto-joining rooms */
  userRole?: string;
  /** User ID for auto-joining client-specific rooms */
  userId?: string;
  /** Whether the hook should attempt to connect */
  enabled?: boolean;
}

interface UseWebSocketReturn {
  /** Whether the WebSocket is currently connected */
  isConnected: boolean;
  /** The last message received */
  lastMessage: WebSocketMessage | null;
  /** Number of reconnection attempts so far */
  connectionAttempts: number;
  /** Send a message through the WebSocket */
  sendMessage: (event: string, data?: unknown, room?: string) => void;
  /** Subscribe to a specific event type */
  subscribe: (eventType: string, handler: MessageHandler) => void;
  /** Unsubscribe from a specific event type */
  unsubscribe: (eventType: string, handler: MessageHandler) => void;
  /** Join a room */
  joinRoom: (room: string) => void;
  /** Leave a room */
  leaveRoom: (room: string) => void;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

const INITIAL_RECONNECT_DELAY = 1000;   // 1 second
const MAX_RECONNECT_DELAY = 30000;      // 30 seconds
const BACKOFF_MULTIPLIER = 2;

// -----------------------------------------------------------------------------
// Hook Implementation
// -----------------------------------------------------------------------------

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const { token, userRole: _userRole, userId: _userId, enabled = true } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const listenersRef = useRef<Map<string, Set<MessageHandler>>>(new Map());
  const isCleaningUpRef = useRef(false);
  const pendingRoomsRef = useRef<string[]>([]);

  // ---------------------------------------------------------------------------
  // Subscribe / Unsubscribe
  // ---------------------------------------------------------------------------

  const subscribe = useCallback((eventType: string, handler: MessageHandler) => {
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, new Set());
    }
    listenersRef.current.get(eventType)!.add(handler);
  }, []);

  const unsubscribe = useCallback((eventType: string, handler: MessageHandler) => {
    const handlers = listenersRef.current.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        listenersRef.current.delete(eventType);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Send Message
  // ---------------------------------------------------------------------------

  const sendMessage = useCallback(
    (event: string, data?: unknown, room?: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ event, data, room }));
      } else {
        console.warn('[WebSocket] Cannot send message: not connected');
      }
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Room Management
  // ---------------------------------------------------------------------------

  const joinRoom = useCallback(
    (room: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        sendMessage('join:room', undefined, room);
      } else {
        // Queue the room join for when connection is established
        pendingRoomsRef.current.push(room);
      }
    },
    [sendMessage]
  );

  const leaveRoom = useCallback(
    (room: string) => {
      sendMessage('leave:room', undefined, room);
      // Remove from pending if present
      pendingRoomsRef.current = pendingRoomsRef.current.filter((r) => r !== room);
    },
    [sendMessage]
  );

  // ---------------------------------------------------------------------------
  // Dispatch incoming messages to listeners
  // ---------------------------------------------------------------------------

  const dispatchMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message);

    const handlers = listenersRef.current.get(message.event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(message.data, message);
        } catch (error) {
          console.error(
            `[WebSocket] Error in handler for event "${message.event}":`,
            error
          );
        }
      }
    }

    // Also dispatch to wildcard listeners
    const wildcardHandlers = listenersRef.current.get('*');
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        try {
          handler(message.data, message);
        } catch (error) {
          console.error('[WebSocket] Error in wildcard handler:', error);
        }
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Connection Logic
  // ---------------------------------------------------------------------------

  const connect = useCallback(() => {
    if (!token || !enabled || isCleaningUpRef.current) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      const url = `${WS_BASE_URL}?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
        setConnectionAttempts(0);
        reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;

        // Join any pending rooms
        for (const room of pendingRoomsRef.current) {
          ws.send(JSON.stringify({ event: 'join:room', room }));
        }
        pendingRoomsRef.current = [];
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const message = JSON.parse(event.data as string) as WebSocketMessage;
          dispatchMessage(message);
        } catch {
          console.warn('[WebSocket] Received non-JSON message');
        }
      };

      ws.onclose = (event: CloseEvent) => {
        console.log(
          `[WebSocket] Disconnected (code: ${event.code}, reason: ${event.reason})`
        );
        setIsConnected(false);
        wsRef.current = null;

        // Don't reconnect if:
        // - We're intentionally cleaning up
        // - Auth failed (4001)
        // - Server told us to go away (1008)
        if (
          isCleaningUpRef.current ||
          event.code === 4001 ||
          event.code === 1008
        ) {
          return;
        }

        // Schedule reconnection with exponential backoff
        const delay = reconnectDelayRef.current;
        reconnectDelayRef.current = Math.min(
          delay * BACKOFF_MULTIPLIER,
          MAX_RECONNECT_DELAY
        );

        setConnectionAttempts((prev) => prev + 1);
        console.log(`[WebSocket] Reconnecting in ${delay}ms...`);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      };

      ws.onerror = (error: Event) => {
        console.error('[WebSocket] Error:', error);
        // The onclose handler will fire after onerror; reconnect logic lives there
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
    }
  }, [token, enabled, dispatchMessage]);

  // ---------------------------------------------------------------------------
  // Effect: Connect / Disconnect
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (token && enabled) {
      isCleaningUpRef.current = false;
      connect();
    }

    return () => {
      isCleaningUpRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }

      setIsConnected(false);
    };
  }, [token, enabled, connect]);

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    isConnected,
    lastMessage,
    connectionAttempts,
    sendMessage,
    subscribe,
    unsubscribe,
    joinRoom,
    leaveRoom,
  };
}

export default useWebSocket;
