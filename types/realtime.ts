export type RealtimeConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ClientPresence {
  clientId: string;
  deviceName: string;
  role: 'admin' | 'kitchen' | 'medical' | 'teacher';
  connectedAt: number;
  lastPing: number;
  ip?: string;
  isCurrentDevice?: boolean;
}

export type RealtimeEventType =
  | 'system:connected'
  | 'system:presence'
  | 'heartbeat'
  | 'data:mutation'
  | 'data:delete'
  | 'data:sync'
  | 'conflict:detected';

export interface RealtimeEventPayload {
  id: string;
  type: RealtimeEventType;
  timestamp: number;
  senderId?: string;
  senderName?: string;
  module?: string;
  action?: 'create' | 'update' | 'delete' | 'sync';
  recordId?: string;
  version?: number;
  data?: any;
  message?: string;
}

export interface ConflictData {
  id: string;
  entityType: string;
  recordId: string;
  localVersion: number;
  remoteVersion: number;
  localData: Record<string, any>;
  remoteData: Record<string, any>;
  conflictingFields: string[];
  detectedAt: number;
  remoteUser?: string;
  remoteDevice?: string;
}

export interface OptimisticRecordMeta {
  version: number;
  updatedAt: number;
  lastModifiedBy?: string;
  deviceId?: string;
}
