'use client';

import React from 'react';
import { Radio, Users, WifiOff } from 'lucide-react';
import { RealtimeConnectionStatus } from '@/types/realtime';

interface RealtimeStatusBadgeProps {
  connectionStatus: RealtimeConnectionStatus;
  activeCount: number;
  onClick: () => void;
}

export default function RealtimeStatusBadge({
  connectionStatus,
  activeCount,
  onClick,
}: RealtimeStatusBadgeProps) {
  const isConnected = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <button
      type="button"
      onClick={onClick}
      title="Trung tâm Đồng bộ Thời gian thực (SSE) - Bấm để xem thiết bị online, lịch sử thay đổi và kiểm soát xung đột"
      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer shadow-2xs active:scale-95 ${
        isConnected
          ? 'bg-sky-50 hover:bg-sky-100 text-sky-900 border-sky-300'
          : isConnecting
          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
          : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300'
      }`}
    >
      {/* Status Dot / Ping */}
      <span className="relative flex h-2 w-2 shrink-0">
        {isConnected && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isConnected
              ? 'bg-emerald-500'
              : isConnecting
              ? 'bg-amber-500 animate-pulse'
              : 'bg-rose-500'
          }`}
        ></span>
      </span>

      <Radio className={`w-3.5 h-3.5 shrink-0 ${isConnected ? 'text-sky-600' : 'text-slate-500'}`} />

      <span className="hidden md:inline">
        {isConnected ? 'Real-time SSE' : isConnecting ? 'Đang nối SSE...' : 'Mất SSE'}
      </span>

      {isConnected && (
        <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded-md bg-sky-200/70 text-sky-950 font-extrabold">
          <Users className="w-2.5 h-2.5" />
          <span>{activeCount}</span>
        </span>
      )}
    </button>
  );
}
