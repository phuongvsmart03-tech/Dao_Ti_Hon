import { ClientPresence, RealtimeEventPayload, ConflictData } from '@/types/realtime';

interface ActiveClient {
  clientId: string;
  deviceName: string;
  role: 'admin' | 'kitchen' | 'medical' | 'teacher';
  connectedAt: number;
  lastPing: number;
  ip?: string;
  controller: ReadableStreamDefaultController<Uint8Array>;
}

// Global symbol to preserve singleton state across Next.js dev server reloads
const REALTIME_HUB_KEY = Symbol.for('__preschool_realtime_hub__');

class RealtimeHub {
  private clients = new Map<string, ActiveClient>();
  private entityVersions = new Map<string, { version: number; lastModifiedBy: string; updatedAt: number }>();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startHeartbeat();
  }

  private startHeartbeat() {
    if (this.heartbeatInterval) return;
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 15000); // 15s keep-alive interval
  }

  public registerClient(
    clientId: string,
    deviceName: string,
    role: 'admin' | 'kitchen' | 'medical' | 'teacher',
    controller: ReadableStreamDefaultController<Uint8Array>,
    ip?: string
  ): void {
    // If existing client reconnected, clean up
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
    }

    const client: ActiveClient = {
      clientId,
      deviceName,
      role,
      connectedAt: Date.now(),
      lastPing: Date.now(),
      ip,
      controller,
    };

    this.clients.set(clientId, client);

    // Broadcast updated presence to all clients
    this.broadcastPresence();
  }

  public unregisterClient(clientId: string): void {
    if (this.clients.has(clientId)) {
      this.clients.delete(clientId);
      this.broadcastPresence();
    }
  }

  public updatePing(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.lastPing = Date.now();
    }
  }

  public getActiveClients(): ClientPresence[] {
    const now = Date.now();
    const result: ClientPresence[] = [];

    for (const client of this.clients.values()) {
      result.push({
        clientId: client.clientId,
        deviceName: client.deviceName,
        role: client.role,
        connectedAt: client.connectedAt,
        lastPing: client.lastPing,
        ip: client.ip,
      });
    }

    return result;
  }

  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Send SSE message to a specific controller
   */
  private sendEventToController(
    controller: ReadableStreamDefaultController<Uint8Array>,
    event: RealtimeEventPayload
  ): boolean {
    try {
      const encoder = new TextEncoder();
      const payloadString = `id: ${event.id}\nevent: message\ndata: ${JSON.stringify(event)}\n\n`;
      controller.enqueue(encoder.encode(payloadString));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Broadcast an event to all connected clients (optionally exclude sender)
   */
  public broadcast(event: RealtimeEventPayload, excludeClientId?: string): void {
    const deadClients: string[] = [];

    for (const [id, client] of this.clients.entries()) {
      if (excludeClientId && id === excludeClientId) continue;

      const success = this.sendEventToController(client.controller, event);
      if (!success) {
        deadClients.push(id);
      }
    }

    for (const deadId of deadClients) {
      this.clients.delete(deadId);
    }
  }

  /**
   * Broadcast presence update with current active client list
   */
  public broadcastPresence(): void {
    const presenceList = this.getActiveClients();
    const event: RealtimeEventPayload = {
      id: `pres-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'system:presence',
      timestamp: Date.now(),
      data: {
        count: presenceList.length,
        clients: presenceList,
      },
    };
    this.broadcast(event);
  }

  /**
   * Send periodic heartbeat to keep SSE connection alive
   */
  private sendHeartbeat(): void {
    const encoder = new TextEncoder();
    const deadClients: string[] = [];
    const keepAliveBytes = encoder.encode(`:keepalive ${Date.now()}\n\n`);

    for (const [id, client] of this.clients.entries()) {
      try {
        client.controller.enqueue(keepAliveBytes);
      } catch {
        deadClients.push(id);
      }
    }

    for (const deadId of deadClients) {
      this.clients.delete(deadId);
    }
  }

  /**
   * Check for optimistic locking conflict
   */
  public checkAndAdvanceVersion(
    entityKey: string,
    clientBaseVersion?: number,
    senderName?: string
  ): { isConflict: boolean; currentVersion: number; nextVersion: number } {
    const current = this.entityVersions.get(entityKey) || {
      version: 1,
      lastModifiedBy: 'Hệ thống',
      updatedAt: Date.now(),
    };

    if (clientBaseVersion !== undefined && clientBaseVersion < current.version) {
      return {
        isConflict: true,
        currentVersion: current.version,
        nextVersion: current.version + 1,
      };
    }

    const nextVersion = current.version + 1;
    this.entityVersions.set(entityKey, {
      version: nextVersion,
      lastModifiedBy: senderName || 'Người dùng',
      updatedAt: Date.now(),
    });

    return {
      isConflict: false,
      currentVersion: current.version,
      nextVersion,
    };
  }

  /**
   * Broadcast data mutation
   */
  public broadcastMutation(params: {
    module: string;
    action: 'create' | 'update' | 'delete' | 'sync';
    recordId?: string;
    data?: any;
    senderId?: string;
    senderName?: string;
    version?: number;
    message?: string;
  }): void {
    const event: RealtimeEventPayload = {
      id: `mut-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: params.action === 'delete' ? 'data:delete' : 'data:mutation',
      timestamp: Date.now(),
      senderId: params.senderId,
      senderName: params.senderName || 'Thiết bị khác',
      module: params.module,
      action: params.action,
      recordId: params.recordId,
      version: params.version,
      data: params.data,
      message: params.message || `Đã cập nhật phân hệ ${params.module}`,
    };

    this.broadcast(event, params.senderId);
  }

  /**
   * Broadcast conflict event to notify involved parties
   */
  public broadcastConflict(conflict: ConflictData, targetClientId?: string): void {
    const event: RealtimeEventPayload = {
      id: `conf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: 'conflict:detected',
      timestamp: Date.now(),
      module: conflict.entityType,
      recordId: conflict.recordId,
      data: conflict,
      message: `Phát hiện xung đột phiên bản trên bản ghi ${conflict.recordId}`,
    };

    if (targetClientId && this.clients.has(targetClientId)) {
      const client = this.clients.get(targetClientId)!;
      this.sendEventToController(client.controller, event);
    } else {
      this.broadcast(event);
    }
  }
}

// Global singleton instance
const globalAny = global as any;
if (!globalAny[REALTIME_HUB_KEY]) {
  globalAny[REALTIME_HUB_KEY] = new RealtimeHub();
}

export const realtimeHub: RealtimeHub = globalAny[REALTIME_HUB_KEY];
