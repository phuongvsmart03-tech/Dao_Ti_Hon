'use client';

import React, { useState } from 'react';
import {
  Radio,
  Wifi,
  WifiOff,
  Users,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  X,
  Laptop,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Database,
  Smartphone,
  Server,
} from 'lucide-react';
import { ClientPresence, RealtimeEventPayload, RealtimeConnectionStatus } from '@/types/realtime';

interface RealtimeDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionStatus: RealtimeConnectionStatus;
  activeClients: ClientPresence[];
  activeCount: number;
  recentEvents: RealtimeEventPayload[];
  pingMs: number | null;
  lastEventTime: Date | null;
  deviceInfo: { clientId: string; deviceName: string; role: 'admin' | 'kitchen' | 'medical' | 'teacher' };
  onReconnect: () => void;
  onSimulateConflict: () => void;
  onUpdateDeviceIdentity: (name: string, role: 'admin' | 'kitchen' | 'medical' | 'teacher') => void;
}

export default function RealtimeDrawerModal({
  isOpen,
  onClose,
  connectionStatus,
  activeClients,
  activeCount,
  recentEvents,
  pingMs,
  lastEventTime,
  deviceInfo,
  onReconnect,
  onSimulateConflict,
  onUpdateDeviceIdentity,
}: RealtimeDrawerModalProps) {
  if (!isOpen) return null;

  const [customDeviceName, setCustomDeviceName] = useState(deviceInfo.deviceName);
  const [customRole, setCustomRole] = useState(deviceInfo.role);
  const [isEditingDevice, setIsEditingDevice] = useState(false);

  const handleSaveDevice = () => {
    onUpdateDeviceIdentity(customDeviceName, customRole);
    setIsEditingDevice(false);
  };

  const isConnected = connectionStatus === 'connected';

  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: 'Ban Giám Hiệu / Quản Trị', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    kitchen: { label: 'Nhà Bếp / Bếp Trưởng', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    medical: { label: 'Cán Bộ Y Tế', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    teacher: { label: 'Giáo Viên Lớp', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white p-5 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner shrink-0">
              <Radio className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-sky-100 mb-1">
                <span>Giai Đoạn 3: Hoàn Tất &amp; Đang Hoạt Động</span>
              </div>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Trung Tâm Đồng Bộ Thời Gian Thực (Real-Time SSE)
              </h3>
              <p className="text-xs text-sky-100 mt-0.5">
                Kết nối tức thì giữa Nhà bếp, Ban giám hiệu và Cán bộ y tế với cơ chế Khóa Lạc Quan chống ghi đè dữ liệu.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đóng bảng điều khiển"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Metrics Quick Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-sky-50/70 border-b border-sky-100 text-xs">
          {/* Metric 1: Connection Status */}
          <div className="p-2.5 bg-white rounded-xl border border-sky-200/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
              <span>Trạng thái SSE</span>
              {isConnected ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-rose-600" />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected
                    ? 'bg-emerald-500 ring-4 ring-emerald-200 animate-pulse'
                    : 'bg-rose-500 ring-4 ring-rose-200'
                }`}
              />
              <span className="font-bold text-slate-800">
                {isConnected ? 'Đang Trực Tuyến' : connectionStatus === 'connecting' ? 'Đang Kết Nối...' : 'Mất Kết Nối'}
              </span>
            </div>
          </div>

          {/* Metric 2: Active Devices */}
          <div className="p-2.5 bg-white rounded-xl border border-sky-200/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
              <span>Thiết bị Online</span>
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-sm font-extrabold text-blue-700">
              {activeCount} thiết bị
            </div>
          </div>

          {/* Metric 3: Ping / Latency */}
          <div className="p-2.5 bg-white rounded-xl border border-sky-200/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
              <span>Độ trễ (Ping)</span>
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="text-sm font-extrabold text-indigo-700">
              {pingMs !== null ? `${pingMs} ms` : '< 25 ms'}
            </div>
          </div>

          {/* Metric 4: Protection Engine */}
          <div className="p-2.5 bg-white rounded-xl border border-sky-200/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 font-semibold mb-1 flex items-center justify-between">
              <span>Bảo vệ Dữ liệu</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-[11px] font-extrabold text-emerald-700 truncate">
              Optimistic Lock V3
            </div>
          </div>
        </div>

        {/* Modal Body / Tabs Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* SECTION 1: Thiết Bị Này & Đổi Vai Trò Thử Nghiệm */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  Định Danh Thiết Bị Này (Current Device Identity)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingDevice(!isEditingDevice)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                {isEditingDevice ? 'Hủy bỏ' : 'Đổi vai trò / Tên thiết bị'}
              </button>
            </div>

            {isEditingDevice ? (
              <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tên thiết bị:</label>
                    <input
                      type="text"
                      value={customDeviceName}
                      onChange={(e) => setCustomDeviceName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-semibold"
                      placeholder="Ví dụ: iPad Nhà Bếp"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Vai trò sử dụng:</label>
                    <select
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value as any)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-semibold"
                    >
                      <option value="admin">Ban Giám Hiệu / Quản Trị</option>
                      <option value="kitchen">Nhà Bếp / Bếp Trưởng</option>
                      <option value="medical">Cán Bộ Y Tế</option>
                      <option value="teacher">Giáo Viên Lớp</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveDevice}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Lưu Định Danh
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900">{deviceInfo.deviceName}</span>
                  <div className="text-[11px] text-slate-500 font-mono">Mã kết nối: {deviceInfo.clientId}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleLabels[deviceInfo.role]?.color || ''}`}>
                  {roleLabels[deviceInfo.role]?.label || deviceInfo.role}
                </span>
              </div>
            )}
          </div>

          {/* SECTION 2: Danh Sách Thiết Bị Trực Tuyến */}
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-2.5 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Thiết Bị Đang Kết Nối Đồng Thời ({activeClients.length || 1})</span>
            </h4>
            <div className="space-y-2">
              {(activeClients.length > 0 ? activeClients : [{ ...deviceInfo, connectedAt: Date.now(), lastPing: Date.now() }]).map((cl) => {
                const isSelf = cl.clientId === deviceInfo.clientId;
                return (
                  <div
                    key={cl.clientId}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isSelf ? 'bg-sky-50/50 border-sky-300' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{cl.deviceName}</span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                              (Thiết bị này)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: {cl.clientId.substring(0, 12)}...
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleLabels[cl.role]?.color || 'bg-slate-100 text-slate-800'}`}>
                      {roleLabels[cl.role]?.label || cl.role}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: Live Realtime Events Feed */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Nhật Ký Thay Đổi Thời Gian Thực (Live Event Stream)</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                {recentEvents.length} sự kiện gần đây
              </span>
            </div>

            <div className="p-3 bg-slate-900 rounded-2xl max-h-52 overflow-y-auto font-mono text-xs text-slate-200 space-y-2 border border-slate-800">
              {recentEvents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-sans text-xs">
                  <Activity className="w-5 h-5 mx-auto mb-1 text-slate-400 opacity-60" />
                  Đang lắng nghe sự kiện đồng bộ từ các thiết bị... Mọi thao tác lưu sẽ xuất hiện tại đây ngay lập tức.
                </div>
              ) : (
                recentEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-800/80 border border-slate-700/60"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sky-400 text-[10px] shrink-0 font-sans">
                        {new Date(ev.timestamp).toLocaleTimeString('vi-VN')}
                      </span>
                      <div>
                        <span className="text-amber-300 font-bold mr-1">[{ev.module || 'SYSTEM'}]</span>
                        <span className="text-slate-100 font-sans text-xs">{ev.message || ev.type}</span>
                        {ev.senderName && (
                          <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                            Từ: {ev.senderName}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-700 text-slate-300 shrink-0">
                      {ev.action || ev.type.split(':')[1] || 'EVENT'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECTION 4: Trình Thử Nghiệm Xung Đột & Kiểm Thử Giai Đoạn 3 */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 font-bold text-xs text-amber-950 mb-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Công Cụ Thử Nghiệm Xung Đột Dữ Liệu (Conflict Simulator)</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Kích hoạt tình huống giả lập 2 thiết bị cùng chỉnh sửa 1 món ăn để kiểm chứng Hộp thoại Phân giải Xung đột (Conflict Resolution Modal).
              </p>
            </div>

            <button
              type="button"
              onClick={onSimulateConflict}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chạy Giả Lập Xung Đột</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Server-Sent Events v3.0 (SSE + Turso Cloud)</span>
          </div>

          <div className="flex items-center gap-2">
            {!isConnected && (
              <button
                type="button"
                onClick={onReconnect}
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử kết nối lại</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
