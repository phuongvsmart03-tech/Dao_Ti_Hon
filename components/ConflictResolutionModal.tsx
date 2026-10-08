'use client';

import React from 'react';
import {
  AlertTriangle,
  GitMerge,
  ArrowRight,
  CheckCircle,
  X,
  Laptop,
  Cloud,
  ShieldAlert,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ConflictData } from '@/types/realtime';

interface ConflictResolutionModalProps {
  conflict: ConflictData | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (decision: 'keep_local' | 'accept_remote' | 'smart_merge') => void;
}

export default function ConflictResolutionModal({
  conflict,
  isOpen,
  onClose,
  onResolve,
}: ConflictResolutionModalProps) {
  if (!isOpen || !conflict) return null;

  const fields = conflict.conflictingFields && conflict.conflictingFields.length > 0
    ? conflict.conflictingFields
    : Object.keys({ ...conflict.localData, ...conflict.remoteData });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header with Alert Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/25 text-[11px] font-black uppercase tracking-wider text-amber-100 mb-1">
                <span>Giai Đoạn 3: Version Vector &amp; Optimistic Locking</span>
              </div>
              <h3 className="text-lg font-black tracking-tight leading-snug">
                Phát Hiện Xung Đột Dữ Liệu Đồng Thời
              </h3>
              <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                Hai thiết bị đã chỉnh sửa cùng một bản ghi trong cùng khoảng thời gian. Vui lòng chọn cách giải quyết để đảm bảo tính toàn vẹn dữ liệu.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đóng hộp thoại"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict Metadata Bar */}
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-bold text-amber-900">Phân hệ:</span>
            <span className="bg-amber-100 text-amber-900 font-mono px-2 py-0.5 rounded-md font-semibold">
              {conflict.entityType}
            </span>
            <span className="text-slate-400">|</span>
            <span className="font-bold text-amber-900">Mã bản ghi:</span>
            <span className="font-mono text-slate-800">{conflict.recordId}</span>
          </div>

          <div className="text-[11px] text-slate-600">
            Thời điểm:{' '}
            <span className="font-semibold text-slate-900">
              {new Date(conflict.detectedAt).toLocaleTimeString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Diff Comparison Table */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Local Column Header */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 font-bold text-blue-900 mb-1">
                <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                <span>📱 Thiết bị của bạn (Phiên bản V{conflict.localVersion})</span>
              </div>
              <p className="text-[11px] text-blue-700">
                Dữ liệu bạn vừa chỉnh sửa trên máy này
              </p>
            </div>

            {/* Remote Column Header */}
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2 font-bold text-purple-900 mb-1">
                <Cloud className="w-4 h-4 text-purple-600 shrink-0" />
                <span>☁️ Máy chủ / Thiết bị khác (Phiên bản V{conflict.remoteVersion})</span>
              </div>
              <p className="text-[11px] text-purple-700">
                {conflict.remoteUser ? `Được gửi bởi ${conflict.remoteUser}` : 'Dữ liệu mới nhất trên máy chủ'}
              </p>
            </div>
          </div>

          {/* Fields Diff Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5 w-1/4">Trường Thông Tin</th>
                  <th className="p-2.5 w-[37.5%] border-l border-slate-200 bg-blue-50/50 text-blue-950">
                    Bản ghi cục bộ
                  </th>
                  <th className="p-2.5 w-[37.5%] border-l border-slate-200 bg-purple-50/50 text-purple-950">
                    Bản ghi máy chủ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {fields.map((key) => {
                  const localVal = conflict.localData?.[key];
                  const remoteVal = conflict.remoteData?.[key];
                  const isDifferent = JSON.stringify(localVal) !== JSON.stringify(remoteVal);

                  return (
                    <tr
                      key={key}
                      className={isDifferent ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2.5 font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          {isDifferent && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          )}
                          <span>{key}</span>
                        </div>
                      </td>
                      <td className="p-2.5 border-l border-slate-200 font-mono text-[11px] text-blue-900 bg-blue-50/20">
                        {typeof localVal === 'object'
                          ? JSON.stringify(localVal)
                          : String(localVal ?? '—')}
                      </td>
                      <td className="p-2.5 border-l border-slate-200 font-mono text-[11px] text-purple-900 bg-purple-50/20">
                        {typeof remoteVal === 'object'
                          ? JSON.stringify(remoteVal)
                          : String(remoteVal ?? '—')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Resolution Buttons */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Bỏ qua &amp; Đóng
          </button>

          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
            {/* Option 1: Keep Local */}
            <button
              type="button"
              onClick={() => onResolve('keep_local')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Ghi đè máy chủ bằng dữ liệu máy này"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Giữ Dữ Liệu Máy Này</span>
            </button>

            {/* Option 2: Accept Remote */}
            <button
              type="button"
              onClick={() => onResolve('accept_remote')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Cập nhật dữ liệu từ máy chủ về máy này"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Chấp Nhận Bản Ghi Máy Chủ</span>
            </button>

            {/* Option 3: Smart Merge */}
            <button
              type="button"
              onClick={() => onResolve('smart_merge')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Hợp nhất thông minh các trường không xung đột"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hợp Nhất Thông Minh</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
