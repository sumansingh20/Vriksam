// =============================================================================
// VRIKSHAM - WebSocket Service
// =============================================================================
// Real-time communication layer using the `ws` library. Handles JWT
// authentication, room-based subscriptions, ping/pong heartbeat,
// and targeted event broadcasting.
// =============================================================================

import { WebSocketServer, WebSocket } from 'ws';
import { Server, IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { URL } from 'url';
import config from '../config';
import type { JwtPayload } from '../middleware/auth';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface AuthenticatedWebSocket extends WebSocket {
  userId: string;
  userEmail: string;
  userRole: string;
  isAlive: boolean;
  rooms: Set<string>;
}

interface WebSocketMessage {
  event: string;
  data: unknown;
  room?: string;
  timestamp: string;
}

// -----------------------------------------------------------------------------
// WebSocket Service
// -----------------------------------------------------------------------------

class WebSocketService {
  private wss: WebSocketServer | null = null;

  /**
   * Connected clients keyed by userId -> Set of WebSocket connections.
   * A single user may have multiple tabs/devices connected simultaneously.
   */
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map();

  /**
   * Room subscriptions keyed by room name -> Set of userIds.
   * Rooms follow the pattern: dashboard:admin, dashboard:client:{id},
   * plant:{id}, maintenance:{id}, etc.
   */
  private rooms: Map<string, Set<string>> = new Map();

  /** Heartbeat interval reference for cleanup on shutdown. */
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  /**
   * Attach a WebSocket server to the existing HTTP server on the `/ws` path.
   */
  initialize(server: Server): void {
    this.wss = new WebSocketServer({
      server,
      path: '/ws',
      maxPayload: 1024 * 64, // 64 KB max payload
    });

    console.log('[WebSocket] Server initialized on path /ws');

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      this.handleConnection(ws as AuthenticatedWebSocket, req);
    });

    this.wss.on('error', (error: Error) => {
      console.error('[WebSocket] Server error:', error);
    });

    // Start heartbeat (ping every 30 seconds)
    this.startHeartbeat();
  }

  // ---------------------------------------------------------------------------
  // Connection Handling
  // ---------------------------------------------------------------------------

  private handleConnection(ws: AuthenticatedWebSocket, req: IncomingMessage): void {
    // Authenticate the connection
    const user = this.authenticateConnection(req);

    if (!user) {
      ws.close(4001, 'Authentication failed');
      return;
    }

    // Attach user info to the socket
    ws.userId = user.userId;
    ws.userEmail = user.email;
    ws.userRole = user.role;
    ws.isAlive = true;
    ws.rooms = new Set();

    // Track the connection
    this.addClient(ws);

    console.log(
      `[WebSocket] Client connected: ${user.email} (${user.userId}) | ` +
      `Total connections: ${this.getConnectionCount()}`
    );

    // Send welcome message
    this.sendToSocket(ws, 'connection:established', {
      userId: user.userId,
      message: 'WebSocket connection established',
      timestamp: new Date().toISOString(),
    });

    // Auto-join role-based rooms
    this.autoJoinRooms(ws);

    // Handle incoming messages
    ws.on('message', (raw: Buffer | string) => {
      this.handleMessage(ws, raw);
    });

    // Handle pong responses (heartbeat)
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Handle disconnect
    ws.on('close', (code: number, reason: Buffer) => {
      this.handleDisconnect(ws, code, reason.toString());
    });

    // Handle errors
    ws.on('error', (error: Error) => {
      console.error(`[WebSocket] Client error (${ws.userId}):`, error.message);
    });
  }

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  /**
   * Verify the JWT token from either the query string (?token=...) or the
   * Authorization header (Bearer ...). Returns decoded payload or null.
   */
  private authenticateConnection(req: IncomingMessage): JwtPayload | null {
    try {
      let token: string | null = null;

      // Try query string first
      if (req.url) {
        const baseUrl = `http://${req.headers.host || 'localhost'}`;
        const url = new URL(req.url, baseUrl);
        token = url.searchParams.get('token');
      }

      // Fall back to Authorization header
      if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        console.warn('[WebSocket] No authentication token provided');
        return null;
      }

      const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

      if (!decoded.userId || !decoded.email) {
        console.warn('[WebSocket] Invalid token payload');
        return null;
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.warn('[WebSocket] Authentication token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.warn('[WebSocket] Invalid authentication token');
      } else {
        console.error('[WebSocket] Authentication error:', error);
      }
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Client Tracking
  // ---------------------------------------------------------------------------

  private addClient(ws: AuthenticatedWebSocket): void {
    if (!this.clients.has(ws.userId)) {
      this.clients.set(ws.userId, new Set());
    }
    this.clients.get(ws.userId)!.add(ws);
  }

  private removeClient(ws: AuthenticatedWebSocket): void {
    const userSockets = this.clients.get(ws.userId);
    if (userSockets) {
      userSockets.delete(ws);
      if (userSockets.size === 0) {
        this.clients.delete(ws.userId);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Room Management
  // ---------------------------------------------------------------------------

  /**
   * Subscribe a user to a named room.
   */
  joinRoom(userId: string, room: string): void {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set());
    }
    this.rooms.get(room)!.add(userId);

    // Update the user's socket room set
    const userSockets = this.clients.get(userId);
    if (userSockets) {
      for (const ws of userSockets) {
        ws.rooms.add(room);
      }
    }
  }

  /**
   * Unsubscribe a user from a named room.
   */
  leaveRoom(userId: string, room: string): void {
    const roomMembers = this.rooms.get(room);
    if (roomMembers) {
      roomMembers.delete(userId);
      if (roomMembers.size === 0) {
        this.rooms.delete(room);
      }
    }

    // Update socket room set
    const userSockets = this.clients.get(userId);
    if (userSockets) {
      for (const ws of userSockets) {
        ws.rooms.delete(room);
      }
    }
  }

  /**
   * Auto-join role-based rooms when a user connects.
   */
  private autoJoinRooms(ws: AuthenticatedWebSocket): void {
    switch (ws.userRole) {
      case 'ADMIN':
        this.joinRoom(ws.userId, 'dashboard:admin');
        this.joinRoom(ws.userId, 'alerts:admin');
        break;
      case 'CLIENT':
        this.joinRoom(ws.userId, `dashboard:client:${ws.userId}`);
        break;
      case 'TECHNICIAN':
        this.joinRoom(ws.userId, 'maintenance:active');
        this.joinRoom(ws.userId, `technician:${ws.userId}`);
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Message Handling
  // ---------------------------------------------------------------------------

  private handleMessage(ws: AuthenticatedWebSocket, raw: Buffer | string): void {
    try {
      const message = JSON.parse(raw.toString()) as {
        event: string;
        data?: unknown;
        room?: string;
      };

      switch (message.event) {
        case 'join:room':
          if (typeof message.room === 'string') {
            this.joinRoom(ws.userId, message.room);
            this.sendToSocket(ws, 'room:joined', { room: message.room });
          }
          break;

        case 'leave:room':
          if (typeof message.room === 'string') {
            this.leaveRoom(ws.userId, message.room);
            this.sendToSocket(ws, 'room:left', { room: message.room });
          }
          break;

        case 'ping':
          this.sendToSocket(ws, 'pong', { timestamp: new Date().toISOString() });
          break;

        default:
          // Unknown event -- ignore or log
          console.log(
            `[WebSocket] Unknown event "${message.event}" from ${ws.userId}`
          );
          break;
      }
    } catch {
      console.warn(`[WebSocket] Invalid message from ${ws.userId}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Disconnect
  // ---------------------------------------------------------------------------

  private handleDisconnect(
    ws: AuthenticatedWebSocket,
    code: number,
    reason: string
  ): void {
    // Remove from all rooms
    for (const room of ws.rooms) {
      this.leaveRoom(ws.userId, room);
    }

    // Remove from client tracking
    this.removeClient(ws);

    console.log(
      `[WebSocket] Client disconnected: ${ws.userEmail} (${ws.userId}) | ` +
      `Code: ${code} | Reason: ${reason || 'none'} | ` +
      `Total connections: ${this.getConnectionCount()}`
    );
  }

  // ---------------------------------------------------------------------------
  // Heartbeat (Ping/Pong)
  // ---------------------------------------------------------------------------

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (!this.wss) return;

      this.wss.clients.forEach((rawWs) => {
        const ws = rawWs as AuthenticatedWebSocket;

        if (!ws.isAlive) {
          console.log(`[WebSocket] Terminating stale connection: ${ws.userId}`);
          ws.terminate();
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // 30 seconds
  }

  // ---------------------------------------------------------------------------
  // Broadcasting
  // ---------------------------------------------------------------------------

  /**
   * Send a message to a specific WebSocket.
   */
  private sendToSocket(ws: WebSocket, event: string, data: unknown): void {
    if (ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        event,
        data,
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast an event to all users subscribed to a room.
   */
  broadcast(room: string, event: string, data: unknown): void {
    const roomMembers = this.rooms.get(room);
    if (!roomMembers || roomMembers.size === 0) return;

    const message: WebSocketMessage = {
      event,
      data,
      room,
      timestamp: new Date().toISOString(),
    };
    const serialized = JSON.stringify(message);

    for (const userId of roomMembers) {
      const userSockets = this.clients.get(userId);
      if (userSockets) {
        for (const ws of userSockets) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(serialized);
          }
        }
      }
    }
  }

  /**
   * Send an event to a specific user (across all their connected sockets).
   */
  sendToUser(userId: string, event: string, data: unknown): void {
    const userSockets = this.clients.get(userId);
    if (!userSockets || userSockets.size === 0) return;

    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };
    const serialized = JSON.stringify(message);

    for (const ws of userSockets) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(serialized);
      }
    }
  }

  /**
   * Broadcast an event to ALL connected clients.
   */
  broadcastAll(event: string, data: unknown): void {
    if (!this.wss) return;

    const message: WebSocketMessage = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };
    const serialized = JSON.stringify(message);

    this.wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(serialized);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Domain-Specific Notification Methods
  // ---------------------------------------------------------------------------

  /**
   * Notify relevant users about a plant health update.
   */
  notifyPlantHealthUpdate(
    plantId: string,
    healthData: {
      healthScore: number;
      status: string;
      notes?: string;
      plantName?: string;
      locationName?: string;
    }
  ): void {
    // Notify plant-specific room subscribers
    this.broadcast(`plant:${plantId}`, 'plant:health_update', {
      plantId,
      ...healthData,
    });

    // If health is critical, also notify admin dashboard
    if (healthData.healthScore < 40 || healthData.status === 'CRITICAL') {
      this.broadcast('dashboard:admin', 'plant:health_alert', {
        plantId,
        severity: 'critical',
        ...healthData,
      });

      this.broadcast('alerts:admin', 'alert:plant_critical', {
        plantId,
        ...healthData,
      });
    }
  }

  /**
   * Notify relevant users about a maintenance/service visit status change.
   */
  notifyMaintenanceUpdate(
    visitId: string,
    status: string,
    details?: {
      plantId?: string;
      technicianId?: string;
      clientId?: string;
      scheduledDate?: string;
      type?: string;
    }
  ): void {
    // Notify maintenance-specific room
    this.broadcast(`maintenance:${visitId}`, 'maintenance:status_update', {
      visitId,
      status,
      ...details,
    });

    // Notify active maintenance room (technicians)
    this.broadcast('maintenance:active', 'maintenance:update', {
      visitId,
      status,
      ...details,
    });

    // Notify admin dashboard
    this.broadcast('dashboard:admin', 'maintenance:update', {
      visitId,
      status,
      ...details,
    });

    // Notify specific client if provided
    if (details?.clientId) {
      this.broadcast(
        `dashboard:client:${details.clientId}`,
        'maintenance:update',
        { visitId, status, ...details }
      );
    }

    // Notify specific technician if provided
    if (details?.technicianId) {
      this.sendToUser(details.technicianId, 'maintenance:assigned', {
        visitId,
        status,
        ...details,
      });
    }
  }

  /**
   * Notify a client about a received payment.
   */
  notifyPaymentReceived(
    clientId: string,
    paymentData: {
      invoiceId: string;
      amount: number;
      method: string;
      invoiceNumber?: string;
    }
  ): void {
    // Notify the client
    this.broadcast(`dashboard:client:${clientId}`, 'payment:received', paymentData);

    // Notify admin dashboard
    this.broadcast('dashboard:admin', 'payment:received', {
      clientId,
      ...paymentData,
    });
  }

  /**
   * Send a real-time alert notification to a specific user.
   */
  notifyNewAlert(
    userId: string,
    alert: {
      id: string;
      type: string;
      title: string;
      message: string;
      priority?: string;
      actionUrl?: string;
    }
  ): void {
    this.sendToUser(userId, 'notification:new', alert);
  }

  // ---------------------------------------------------------------------------
  // Utility Methods
  // ---------------------------------------------------------------------------

  /**
   * Get a list of all currently connected user IDs.
   */
  getOnlineUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Get the total number of active WebSocket connections.
   */
  getConnectionCount(): number {
    let count = 0;
    for (const sockets of this.clients.values()) {
      count += sockets.size;
    }
    return count;
  }

  /**
   * Check if a specific user is currently online.
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.clients.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }

  /**
   * Get rooms a user is currently subscribed to.
   */
  getUserRooms(userId: string): string[] {
    const rooms: string[] = [];
    for (const [room, members] of this.rooms.entries()) {
      if (members.has(userId)) {
        rooms.push(room);
      }
    }
    return rooms;
  }

  // ---------------------------------------------------------------------------
  // Shutdown
  // ---------------------------------------------------------------------------

  /**
   * Gracefully shut down the WebSocket server.
   */
  shutdown(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.wss) {
      // Close all connections
      this.wss.clients.forEach((ws) => {
        ws.close(1001, 'Server shutting down');
      });

      this.wss.close(() => {
        console.log('[WebSocket] Server shut down');
      });
    }

    this.clients.clear();
    this.rooms.clear();
  }
}

// -----------------------------------------------------------------------------
// Export Singleton
// -----------------------------------------------------------------------------

const websocketService = new WebSocketService();
export default websocketService;
