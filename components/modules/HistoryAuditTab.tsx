'use client';

import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  Download,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Edit3,
  Database,
  Calendar,
  Layers,
  FileSpreadsheet,
  Info,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AuditLogRecord, ModuleId } from '@/types/preschool';
import { exportToCsv } from '@/lib/storage';

interface HistoryAuditTabProps {
  logs: AuditLogRecord[];
  onRestore: (log: AuditLogRecord) => void;
  onClearLogs: () => void;
  onSeedSampleLogs?: () => void;
}

export default function HistoryAuditTab({
  logs,
  onRestore,
  onClearLogs,
  onSeedSampleLogs,
}: HistoryAuditTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [restoreSuccessMessage, setRestoreSuccessMessage] = useState<string | null>(null);

  const modulesList = [
    { id: 'all', label: 'Tất cả phân hệ' },
    { id: 'menu', label: 'Thực đơn dinh dưỡng' },
    { id: 'step1', label: 'Kiểm thực Bước 1 (Giao nhận)' },
    { id: 'step2', label: 'Kiểm thực Bước 2 (Chế biến)' },
    { id: 'step3', label: 'Kiểm thực Bước 3 (Trước khi ăn)' },
    { id: 'samples', label: 'Sổ lưu & Hủy mẫu 24h' },
    { id: 'finance', label: 'Tài chính & Thu chi' },
    { id: 'students', label: 'Hồ sơ Học sinh' },
    { id: 'health', label: 'Sức khỏe & Khám định kỳ' },
    { id: 'staff', label: 'Nhân sự & Phân công' },
    { id: 'lessonPlans', label: 'Kế hoạch & Giáo án' },
    { id: 'settings', label: 'Cấu hình trường & Chữ ký' },
  ];

  const actionsList = [
    { id: 'all', label: 'Tất cả hành động' },
    { id: 'create', label: '➕ Thêm mới' },
    { id: 'update', label: '✏️ Cập nhật / Sửa' },
    { id: 'delete', label: '🗑️ Xóa bản ghi' },
    { id: 'restore', label: '↩️ Khôi phục' },
    { id: 'sync', label: '☁️ Đồng bộ đám mây' },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        !searchTerm.trim() ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.actionLabel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchModule = selectedModule === 'all' || log.module === selectedModule;
      const matchAction = selectedAction === 'all' || log.action === selectedAction;

      return matchSearch && matchModule && matchAction;
    });
  }, [logs, searchTerm, selectedModule, selectedAction]);

  const stats = useMemo(() => {
    const creates = logs.filter((l) => l.action === 'create').length;
    const updates = logs.filter((l) => l.action === 'update').length;
    const deletes = logs.filter((l) => l.action === 'delete').length;
    const restores = logs.filter((l) => l.action === 'restore').length;
    return { total: logs.length, creates, updates, deletes, restores };
  }, [logs]);

  const handleExportCsv = () => {
    const headers = ['Thời gian', 'Phân hệ', 'Hành động', 'Mô tả chi tiết', 'Mã bản ghi', 'Có thể khôi phục'];
    const rows = filteredLogs.map((log) => [
      log.displayTime,
      log.moduleName,
      log.actionLabel,
      log.description,
      log.targetId || '---',
      log.canUndo ? 'Có' : 'Không',
    ]);
    exportToCsv(`Nhat_Ky_Thao_Tac_${new Date().toISOString().slice(0, 10)}`, headers, rows);
  };

  const handleRestoreItem = (log: AuditLogRecord) => {
    if (!log.canUndo || !log.previousData) {
      alert('Thao tác này không có bản sao lưu trước đó để khôi phục.');
      return;
    }
    if (confirm(`Bạn có chắc muốn khôi phục thao tác: "${log.description}"?`)) {
      onRestore(log);
      setRestoreSuccessMessage(`Đã khôi phục thành công: ${log.description}`);
      setTimeout(() => setRestoreSuccessMessage(null), 4000);
    }
  };

  const getActionBadge = (action: AuditLogRecord['action']) => {
    switch (action) {
      case 'create':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <PlusCircle className="w-3 h-3" />
            Thêm mới
          </span>
        );
      case 'update':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Edit3 className="w-3 h-3" />
            Cập nhật
          </span>
        );
      case 'delete':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <Trash2 className="w-3 h-3" />
            Đã xóa
          </span>
        );
      case 'restore':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <RotateCcw className="w-3 h-3" />
            Khôi phục
          </span>
        );
      case 'sync':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200">
            <Database className="w-3 h-3" />
            Đồng bộ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            <Info className="w-3 h-3" />
            Khác
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-800 text-white shadow-xs">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                Lịch Sử Thao Tác &amp; Nhật Ký Hoạt Động
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {logs.length} bản ghi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              Theo dõi chi tiết toàn bộ hành vi thêm mới, chỉnh sửa, xóa và đồng bộ dữ liệu. Bạn có thể khôi phục lại các bản ghi đã xóa hoặc phục hồi trạng thái trước đó bất cứ lúc nào.
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {logs.length > 0 && (
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-300"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Xuất CSV</span>
            </button>
          )}

          {logs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử thao tác? Dữ liệu nghiệp vụ sẽ không bị ảnh hưởng.')) {
                  onClearLogs();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa nhật ký</span>
            </button>
          )}

          {logs.length === 0 && onSeedSampleLogs && (
            <button
              type="button"
              onClick={onSeedSampleLogs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Nạp dữ liệu mẫu lịch sử</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert */}
      {restoreSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{restoreSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setRestoreSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Tổng hành động</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{stats.total}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700 block">Thêm mới (+)</span>
          <span className="text-xl font-bold text-emerald-800 mt-1 block">{stats.creates}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs">
          <span className="text-xs font-semibold text-rose-700 block">Đã xóa (Có thể hoàn tác)</span>
          <span className="text-xl font-bold text-rose-800 mt-1 block">{stats.deletes}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-indigo-200 shadow-2xs">
          <span className="text-xs font-semibold text-indigo-700 block">Đã khôi phục (↩)</span>
          <span className="text-xl font-bold text-indigo-800 mt-1 block">{stats.restores}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nội dung thao tác, tên món, học sinh, giao dịch..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Module Filter */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer w-1/2 sm:w-auto"
          >
            {modulesList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Action Filter */}
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer w-1/2 sm:w-auto"
          >
            {actionsList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>

          {(searchTerm || selectedModule !== 'all' || selectedAction !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedModule('all');
                setSelectedAction('all');
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Hiển thị <strong>{filteredLogs.length}</strong> / {logs.length} nhật ký
          </span>
          <span className="italic text-slate-500">
            Tự động ghi lại mọi thay đổi trong hệ thống quản lý mầm non
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-700">Chưa có nhật ký thao tác nào phù hợp</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Khi bạn thêm mới thực đơn, cập nhật sổ kiểm thực, sửa hồ sơ học sinh hoặc xóa bản ghi, toàn bộ lịch sử sẽ xuất hiện tại đây kèm nút khôi phục.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                    {/* Left details */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="mt-0.5 shrink-0">
                        {getActionBadge(log.action)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {log.moduleName}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {log.displayTime}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 mt-1 break-words">
                          {log.description}
                        </p>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      {log.canUndo && log.previousData && (
                        <button
                          type="button"
                          onClick={() => handleRestoreItem(log)}
                          title="Hoàn tác và phục hồi lại dữ liệu trước thao tác này"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Khôi phục</span>
                        </button>
                      )}

                      {(log.previousData || log.newData) && (
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết dữ liệu"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Snapshot Panel */}
                  {isExpanded && (
                    <div className="mt-2 p-3 bg-slate-900 rounded-xl text-slate-200 text-xs font-mono overflow-x-auto space-y-2 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                        <span>Chi tiết bản ghi ({log.id})</span>
                        <span>Mã đối tượng: {log.targetId || 'N/A'}</span>
                      </div>
                      {log.previousData && (
                        <div>
                          <span className="text-amber-400 font-bold block mb-0.5">
                            Dữ liệu trước thao tác (Snapshot phục hồi):
                          </span>
                          <pre className="text-[11px] text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto bg-slate-950 p-2 rounded">
                            {JSON.stringify(log.previousData, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.newData && (
                        <div>
                          <span className="text-emerald-400 font-bold block mb-0.5">
                            Dữ liệu sau thao tác:
                          </span>
                          <pre className="text-[11px] text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto bg-slate-950 p-2 rounded">
                            {JSON.stringify(log.newData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
