'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  RealtimeConnectionStatus,
  ClientPresence,
  RealtimeEventPayload,
  ConflictData,
} from '@/types/realtime';

interface UseRealtimeSyncOptions {
  enabled?: boolean;
  onRemoteMutation?: (event: RealtimeEventPayload) => void;
  onRemoteSync?: (event: RealtimeEventPayload) => void;
  onConflict?: (conflict: ConflictData) => void;
}

export function useRealtimeSync({
  enabled = true,
  onRemoteMutation,
  onRemoteSync,
  onConflict,
}: UseRealtimeSyncOptions = {}) {
  const [connectionStatus, setConnectionStatus] = useState<RealtimeConnectionStatus>('disconnected');
  const [activeClients, setActiveClients] = useState<ClientPresence[]>([]);
  const [recentEvents, setRecentEvents] = useState<RealtimeEventPayload[]>([]);
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [lastEventTime, setLastEventTime] = useState<Date | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<{ clientId: string; deviceName: string; role: 'admin' | 'kitchen' | 'medical' | 'teacher' }>(() => {
    if (typeof window === 'undefined') {
      return { clientId: 'server', deviceName: 'Trường Mầm Non', role: 'admin' };
    }
    const savedId = localStorage.getItem('preschool_client_id') || `client-${Math.random().toString(36).substring(2, 8)}`;
    const savedName = localStorage.getItem('preschool_device_name') || 'Thiết bị Quản trị (PC Ban Giám Hiệu)';
    const savedRole = (localStorage.getItem('preschool_device_role') as any) || 'admin';

    localStorage.setItem('preschool_client_id', savedId);
    return { clientId: savedId, deviceName: savedName, role: savedRole };
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isManuallyClosedRef = useRef(false);

  // Stable callbacks via ref to avoid reconnecting when callback identity changes
  const onRemoteMutationRef = useRef(onRemoteMutation);
  const onRemoteSyncRef = useRef(onRemoteSync);
  const onConflictRef = useRef(onConflict);

  useEffect(() => {
    onRemoteMutationRef.current = onRemoteMutation;
  }, [onRemoteMutation]);

  useEffect(() => {
    onRemoteSyncRef.current = onRemoteSync;
  }, [onRemoteSync]);

  useEffect(() => {
    onConflictRef.current = onConflict;
  }, [onConflict]);

  // Connect to SSE
  const connectSSE = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setConnectionStatus('connecting');

    const params = new URLSearchParams({
      clientId: deviceInfo.clientId,
      deviceName: deviceInfo.deviceName,
      role: deviceInfo.role,
    });

    const url = `/api/realtime?${params.toString()}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      setConnectionStatus('connected');
      reconnectAttemptsRef.current = 0;
    };

    es.onmessage = (event) => {
      try {
        const payload: RealtimeEventPayload = JSON.parse(event.data);
        setLastEventTime(new Date());

        // Add to recent events log (keep max 30)
        setRecentEvents((prev) => [payload, ...prev].slice(0, 30));

        switch (payload.type) {
          case 'system:connected':
            if (payload.data?.activeClients) {
              setActiveClients(payload.data.activeClients);
            }
            break;

          case 'system:presence':
            if (payload.data?.clients) {
              setActiveClients(payload.data.clients);
            }
            break;

          case 'data:mutation':
          case 'data:delete':
            // Ignore echoes from self
            if (payload.senderId !== deviceInfo.clientId) {
              if (onRemoteMutationRef.current) {
                onRemoteMutationRef.current(payload);
              }
            }
            break;

          case 'data:sync':
            if (payload.senderId !== deviceInfo.clientId) {
              if (onRemoteSyncRef.current) {
                onRemoteSyncRef.current(payload);
              }
            }
            break;

          case 'conflict:detected':
            if (payload.data) {
              setConflictData(payload.data);
              if (onConflictRef.current) {
                onConflictRef.current(payload.data);
              }
            }
            break;

          default:
            break;
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    es.onerror = () => {
      setConnectionStatus('error');
      es.close();
      eventSourceRef.current = null;

      if (!isManuallyClosedRef.current) {
        // Exponential backoff reconnect: 1s, 2s, 4s, up to 10s
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
        reconnectAttemptsRef.current += 1;

        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSSE();
        }, delay);
      }
    };
  }, [enabled, deviceInfo]);

  // Initial connect & cleanup
  useEffect(() => {
    isManuallyClosedRef.current = false;
    connectSSE();

    return () => {
      isManuallyClosedRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [connectSSE]);

  // Periodic heartbeat ping to measure latency and maintain presence
  useEffect(() => {
    if (connectionStatus !== 'connected') return;

    const interval = setInterval(async () => {
      try {
        const start = performance.now();
        const res = await fetch('/api/realtime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'ping',
            clientId: deviceInfo.clientId,
            deviceName: deviceInfo.deviceName,
            role: deviceInfo.role,
          }),
        });

        if (res.ok) {
          const end = performance.now();
          setPingMs(Math.round(end - start));
          const data = await res.json();
          if (data.activeClients) {
            setActiveClients(data.activeClients);
          }
        }
      } catch {
        // ignore
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [connectionStatus, deviceInfo]);

  // Function to simulate a concurrent edit conflict for QA/Demo
  const simulateTestConflict = useCallback(async () => {
    try {
      const res = await fetch('/api/realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simulate_conflict',
          clientId: deviceInfo.clientId,
          deviceName: deviceInfo.deviceName,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.conflictData) {
          setConflictData(data.conflictData);
        }
      }
    } catch (err) {
      console.error('Failed to simulate conflict:', err);
    }
  }, [deviceInfo]);

  // Resolve conflict
  const resolveConflict = useCallback(
    (decision: 'keep_local' | 'accept_remote' | 'smart_merge') => {
      if (!conflictData) return null;
      const resolved = { ...conflictData, resolution: decision };
      setConflictData(null);
      return resolved;
    },
    [conflictData]
  );

  // Update current device name / role
  const updateDeviceIdentity = useCallback(
    (name: string, role: 'admin' | 'kitchen' | 'medical' | 'teacher') => {
      const updated = { ...deviceInfo, deviceName: name, role };
      setDeviceInfo(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('preschool_device_name', name);
        localStorage.setItem('preschool_device_role', role);
      }
    },
    [deviceInfo]
  );

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    activeClients,
    activeCount: activeClients.length || 1,
    recentEvents,
    conflictData,
    pingMs,
    lastEventTime,
    deviceInfo,
    reconnect: connectSSE,
    resolveConflict,
    simulateTestConflict,
    updateDeviceIdentity,
  };
}
