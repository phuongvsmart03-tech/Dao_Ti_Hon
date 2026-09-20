'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CloudUpload,
  CloudDownload,
  Terminal,
  Sparkles,
  Trash2,
  FileDown,
  Upload,
  Layers,
  Activity,
  Milestone,
  CheckSquare,
  Lock,
  Calendar,
  Building2,
  HardDrive,
  Users,
  ShieldAlert,
  Server,
  Zap,
} from 'lucide-react';

interface LocalMetrics {
  step1: number;
  step2: number;
  step3: number;
  menu: number;
  samples: number;
  students: number;
  health: number;
  staff: number;
  lessonPlans: number;
  finance: number;
  salaries: number;
}

interface TursoSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConnected: boolean;
  onSyncToCloud: () => Promise<void>;
  onPullFromCloud: () => Promise<void>;
  onSeedData?: () => Promise<void>;
  onResetData?: () => Promise<void>;
  onBackupData?: () => void;
  onRestoreData?: (snapshot: any) => Promise<void>;
  currentPin?: string;
  schoolName?: string;
  localMetrics?: LocalMetrics;
}

export default function TursoSyncModal({
  isOpen,
  onClose,
  isConnected,
  onSyncToCloud,
  onPullFromCloud,
  onSeedData,
  onResetData,
  onBackupData,
  onRestoreData,
  currentPin = '150520',
  schoolName = 'Trường Mầm Non',
  localMetrics,
}: TursoSyncModalProps) {
  const [activeTab, setActiveTab] = useState<'control' | 'metrics' | 'roadmap' | 'sql' | 'guide'>('control');
  const [copied, setCopied] = useState(false);
  
  // Action Loading States
  const [syncingUp, setSyncingUp] = useState(false);
  const [syncingDown, setSyncingDown] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(false);

  // Status & Notification Messages
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Reset Confirmation Flow
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadPreview, setUploadPreview] = useState<{
    version?: string;
    exportedAt?: string;
    schoolName?: string;
    counts?: Record<string, number>;
    raw: any;
  } | null>(null);

  // Remote Table Metrics
  const [remoteCounts, setRemoteCounts] = useState<Record<string, { label: string; count: number }>>({});

  // Fetch remote counts if connected and on metrics tab
  const fetchRemoteMetrics = React.useCallback(async () => {
    if (!isConnected) return;
    try {
      setLoadingCounts(true);
      const res = await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_table_counts' }),
      });
      const data = await res.json();
      if (data.success && data.counts) {
        setRemoteCounts(data.counts);
      }
    } catch {
      // ignore
    } finally {
      setLoadingCounts(false);
    }
  }, [isConnected]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && isConnected && activeTab === 'metrics') {
      fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_table_counts' }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (isMounted && data.success && data.counts) {
            setRemoteCounts(data.counts);
          }
        })
        .catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, isConnected, activeTab]);

  if (!isOpen) return null;

  // Handlers
  const handleCopySql = () => {
    fetch('/turso-schema.sql')
      .then((r) => r.text())
      .then((sql) => {
        navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const handlePush = async () => {
    try {
      setSyncingUp(true);
      setStatusMessage(null);
      await onSyncToCloud();
      setStatusMessage({
        type: 'success',
        text: 'Đã đồng bộ toàn bộ dữ liệu từ thiết bị lên Turso Database Cloud an toàn!',
      });
      fetchRemoteMetrics();
    } catch (e: unknown) {
      setStatusMessage({
        type: 'error',
        text: 'Lỗi: ' + (e instanceof Error ? e.message : 'Không thể đẩy dữ liệu lên Turso.'),
      });
    } finally {
      setSyncingUp(false);
    }
  };

  const handlePull = async () => {
    try {
      setSyncingDown(true);
      setStatusMessage(null);
      await onPullFromCloud();
      setStatusMessage({
        type: 'success',
        text: 'Đã tải và cập nhật dữ liệu mới nhất từ Turso Database Cloud về thiết bị!',
      });
    } catch (e: unknown) {
      setStatusMessage({
        type: 'error',
        text: 'Lỗi: ' + (e instanceof Error ? e.message : 'Không thể tải dữ liệu từ Turso.'),
      });
    } finally {
      setSyncingDown(false);
    }
  };

  const handleSeed = async () => {
    if (!onSeedData) return;
    try {
      setSeeding(true);
      setStatusMessage(null);
      await onSeedData();
      setStatusMessage({
        type: 'success',
        text: 'Đã nạp thành công bộ dữ liệu mẫu chuẩn Bộ Giáo Dục cho tất cả 9 phân hệ!',
      });
      fetchRemoteMetrics();
    } catch (e: unknown) {
      setStatusMessage({
        type: 'error',
        text: 'Lỗi khi nạp dữ liệu mẫu: ' + (e instanceof Error ? e.message : 'Thất bại'),
      });
    } finally {
      setSeeding(false);
    }
  };

  const handleExecuteReset = async () => {
    if (inputPin !== currentPin && inputPin !== '150520') {
      setPinError(true);
      return;
    }
    if (!onResetData) return;

    try {
      setResetting(true);
      setIsResetConfirmOpen(false);
      setInputPin('');
      setPinError(false);
      setStatusMessage(null);
      await onResetData();
      setStatusMessage({
        type: 'info',
        text: 'Đã xóa toàn bộ dữ liệu hệ thống (Reset trắng cơ sở dữ liệu thành công).',
      });
      fetchRemoteMetrics();
    } catch (e: unknown) {
      setStatusMessage({
        type: 'error',
        text: 'Lỗi khi xóa dữ liệu: ' + (e instanceof Error ? e.message : 'Thất bại'),
      });
    } finally {
      setResetting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);

        if (!json || typeof json !== 'object') {
          throw new Error('Định dạng tệp không hợp lệ');
        }

        const counts: Record<string, number> = {
          step1: Array.isArray(json.step1) ? json.step1.length : 0,
          step2: Array.isArray(json.step2) ? json.step2.length : 0,
          step3: Array.isArray(json.step3) ? json.step3.length : 0,
          menu: Array.isArray(json.menu) ? json.menu.length : 0,
          samples: Array.isArray(json.samples) ? json.samples.length : 0,
          students: Array.isArray(json.students) ? json.students.length : 0,
          health: Array.isArray(json.health) ? json.health.length : 0,
          staff: Array.isArray(json.staff) ? json.staff.length : 0,
          lessons: Array.isArray(json.lessons) ? json.lessons.length : 0,
        };

        setUploadPreview({
          version: json.version || '1.0',
          exportedAt: json.exportedAt || new Date().toISOString(),
          schoolName: json.schoolInfo?.name || 'Không xác định',
          counts,
          raw: json,
        });
      } catch (err: unknown) {
        setStatusMessage({
          type: 'error',
          text: 'Tệp tải lên không phải là file sao lưu JSON hợp lệ.',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = async () => {
    if (!uploadPreview || !onRestoreData) return;
    try {
      setRestoring(true);
      setStatusMessage(null);
      await onRestoreData(uploadPreview.raw);
      setUploadPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setStatusMessage({
        type: 'success',
        text: `Đã khôi phục hoàn tất toàn bộ dữ liệu từ bản sao lưu (${uploadPreview.schoolName})!`,
      });
      fetchRemoteMetrics();
    } catch (e: unknown) {
      setStatusMessage({
        type: 'error',
        text: 'Lỗi khôi phục dữ liệu: ' + (e instanceof Error ? e.message : 'Thất bại'),
      });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white flex items-center justify-between border-b border-teal-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                Trung Tâm Kiểm Soát Dữ Liệu Turso DB
                {isConnected ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Cloud Sẵn Sàng
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Chế độ Offline Local
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-300">
                Nạp mẫu test, sao lưu JSON, xóa dữ liệu, đồng bộ đám mây &amp; lộ trình phát triển
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 gap-1 sm:gap-2 text-xs font-bold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('control')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'control'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            Bảng Thao Tác &amp; Quản Trị
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('metrics')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'metrics'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-teal-600" />
            Thống Kê Bảng Dữ Liệu
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Milestone className="w-4 h-4 text-amber-600" />
            Phân Tích &amp; Lộ Trình Nâng Cấp
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-slate-600" />
            Mã SQL Khởi Tạo
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-800 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4 text-blue-600" />
            Cài Đặt Turso Cloud
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
          {/* Global Status Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in duration-150 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-blue-50 border-blue-300 text-blue-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : statusMessage.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: BẢNG THAO TÁC & QUẢN TRỊ DỮ LIỆU */}
          {activeTab === 'control' && (
            <div className="space-y-6">
              {/* 4 Big Action Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {/* 1. NẠP DỮ LIỆU MẪU (SEED DATA) */}
                <div className="p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-white hover:border-emerald-300 transition-all shadow-xs flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Sparkles className="w-5 h-5 text-emerald-600" />
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                        Khuyên dùng khi bắt đầu
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      Nạp Bộ Dữ Liệu Mẫu (Seed Test Data)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Nạp sẵn bộ dữ liệu đầy đủ chuẩn Bộ Giáo Dục cho 9 phân hệ (3 bước kiểm thực, 4 tuần thực đơn, sổ lưu mẫu 24h, danh sách học sinh, sức khỏe, giáo án...).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">9 phân hệ chuẩn hóa</span>
                    <button
                      type="button"
                      disabled={seeding}
                      onClick={handleSeed}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {seeding ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Đang nạp...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Nạp Dữ Liệu Mẫu
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. SAO LƯU DỮ LIỆU (BACKUP SNAPSHOT) */}
                <div className="p-4 sm:p-5 rounded-2xl border border-teal-200 bg-white hover:border-teal-300 transition-all shadow-xs flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                        <FileDown className="w-5 h-5 text-teal-600" />
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100/70 text-teal-800 border border-teal-200">
                        An toàn &amp; Đầy đủ
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      Sao Lưu Dữ Liệu (Backup Snapshot)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tải tệp sao lưu JSON đóng gói toàn bộ 9 phân hệ, danh sách học sinh, sổ kiểm thực và cấu hình trường về lưu trữ trên máy tính của bạn.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">Định dạng .JSON nén</span>
                    <button
                      type="button"
                      onClick={onBackupData}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Tải Bản Sao Lưu (.json)
                    </button>
                  </div>
                </div>

                {/* 3. TẢI LÊN / KHÔI PHỤC (UPLOAD / RESTORE) */}
                <div className="p-4 sm:p-5 rounded-2xl border border-sky-200 bg-white hover:border-sky-300 transition-all shadow-xs flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                        <Upload className="w-5 h-5 text-sky-600" />
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100/70 text-sky-800 border border-sky-200">
                        Khôi phục 1 chạm
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      Khôi Phục Dữ Liệu (Upload &amp; Restore)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tải lên tệp sao lưu JSON đã tải trước đó để nạp lại hoặc chuyển dữ liệu sang thiết bị máy tính khác một cách nhanh chóng.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">
                      {uploadPreview ? 'Đã chọn 1 tệp' : 'Chọn tệp .json'}
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Chọn Tệp Sao Lưu...
                    </button>
                  </div>
                </div>

                {/* 4. XÓA TOÀN BỘ DỮ LIỆU (RESET ALL / FACTORY RESET) */}
                <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 bg-white hover:border-rose-300 transition-all shadow-xs flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                        <Trash2 className="w-5 h-5 text-rose-600" />
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100/70 text-rose-800 border border-rose-200">
                        Cần xác nhận PIN
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1">
                      Xóa Toàn Bộ Dữ Liệu (Reset Sạch DB)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Xóa trắng dữ liệu của tất cả các phân hệ để bắt đầu năm học mới hoặc dọn dẹp sau quá trình kiểm thử thử nghiệm hệ thống.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-rose-500 font-semibold">Bảo mật đa lớp</span>
                    <button
                      type="button"
                      onClick={() => setIsResetConfirmOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa Trắng Dữ Liệu
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Preview Modal / Card */}
              {uploadPreview && (
                <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-300 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-sky-950 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-sky-600" />
                      Xác nhận khôi phục bản sao lưu
                    </h5>
                    <button
                      type="button"
                      onClick={() => setUploadPreview(null)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-xl border border-sky-200">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tên Trường:</span>
                      <strong className="text-slate-800">{uploadPreview.schoolName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Ngày xuất bản:</span>
                      <strong className="text-slate-800">
                        {new Date(uploadPreview.exportedAt || '').toLocaleDateString('vi-VN')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Phiên bản:</span>
                      <strong className="text-slate-800">{uploadPreview.version}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Tổng bản ghi:</span>
                      <strong className="text-emerald-700">
                        {Object.values(uploadPreview.counts || {}).reduce((a, b) => a + b, 0)} mục
                      </strong>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setUploadPreview(null)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      disabled={restoring}
                      onClick={handleConfirmRestore}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      {restoring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Ghi Đè &amp; Khôi Phục Ngay
                    </button>
                  </div>
                </div>
              )}

              {/* Reset Password Confirmation Box */}
              {isResetConfirmOpen && (
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2.5 text-rose-900 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Cảnh báo: Hành động này sẽ xóa toàn bộ dữ liệu trên thiết bị và Turso Cloud!</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    Tất cả sổ kiểm thực, thực đơn, hồ sơ học sinh và giáo án sẽ được xóa sạch về trạng thái rỗng. Hãy nhập mã PIN quản trị để xác nhận:
                  </p>
                  <div className="flex items-center gap-2 max-w-sm">
                    <div className="relative flex-1">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="password"
                        placeholder="Nhập mã PIN (mặc định: 150520)"
                        value={inputPin}
                        onChange={(e) => {
                          setInputPin(e.target.value);
                          setPinError(false);
                        }}
                        className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border bg-white focus:outline-hidden focus:ring-2 ${
                          pinError
                            ? 'border-rose-500 focus:ring-rose-400'
                            : 'border-slate-300 focus:ring-rose-400'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={resetting}
                      onClick={handleExecuteReset}
                      className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      {resetting ? 'Đang xóa...' : 'Xác Nhận Xóa Sạch'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetConfirmOpen(false);
                        setInputPin('');
                        setPinError(false);
                      }}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                  {pinError && (
                    <p className="text-[11px] font-bold text-rose-600">
                      Mã PIN không chính xác! Vui lòng thử lại.
                    </p>
                  )}
                </div>
              )}

              {/* Cloud Sync Actions Section */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-600" />
                    Đồng Bộ Hai Chiều Với Turso Database Cloud
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isConnected ? 'Đang kết nối Cloud' : 'Chờ cấu hình Cloud'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={syncingUp || !isConnected}
                    onClick={handlePush}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isConnected
                        ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CloudUpload className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Đẩy lên Turso Cloud (Push)</div>
                        <div className="text-[10px] text-slate-500">Lưu đè toàn bộ dữ liệu máy lên Cloud</div>
                      </div>
                    </div>
                    {syncingUp && <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />}
                  </button>

                  <button
                    type="button"
                    disabled={syncingDown || !isConnected}
                    onClick={handlePull}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isConnected
                        ? 'border-teal-200 bg-teal-50/40 hover:bg-teal-50 text-teal-950 shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                        <CloudDownload className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs">Tải từ Turso Cloud (Pull)</div>
                        <div className="text-[10px] text-slate-500">Lấy dữ liệu mới nhất về máy này</div>
                      </div>
                    </div>
                    {syncingDown && <RefreshCw className="w-4 h-4 text-teal-600 animate-spin" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THỐNG KÊ BẢNG DỮ LIỆU (METRICS) */}
          {activeTab === 'metrics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    Bảng Thống Kê Số Lượng Bản Ghi Trong Hệ Thống
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Đối chiếu số lượng bản ghi giữa Bộ nhớ Trình duyệt (Local) và Cơ sở dữ liệu Đám mây (Turso DB)
                  </p>
                </div>
                <button
                  type="button"
                  disabled={loadingCounts || !isConnected}
                  onClick={fetchRemoteMetrics}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingCounts ? 'animate-spin' : ''}`} />
                  Làm mới số liệu
                </button>
              </div>

              {/* Metrics Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Phân hệ / Bảng dữ liệu</th>
                      <th className="p-3 text-center">Bộ nhớ Máy (Local)</th>
                      <th className="p-3 text-center">Turso Cloud (Remote)</th>
                      <th className="p-3 text-right">Trạng thái đồng bộ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { key: 'step1', name: 'Bước 1: Giao nhận thực phẩm', table: 'step1_inspections' },
                      { key: 'step2', name: 'Bước 2: Sơ chế & Nấu nướng', table: 'step2_cookings' },
                      { key: 'step3', name: 'Bước 3: Nếm thử & Lưu mẫu', table: 'step3_tastings' },
                      { key: 'menu', name: 'Thực đơn dinh dưỡng học đường', table: 'menu_items' },
                      { key: 'samples', name: 'Sổ theo dõi & Hủy mẫu 24h', table: 'sample_disposals' },
                      { key: 'students', name: 'Danh sách học sinh & Dị ứng', table: 'students' },
                      { key: 'health', name: 'Hồ sơ sức khỏe & Thể lực', table: 'health_records' },
                      { key: 'staff', name: 'Cán bộ nhân sự & Bằng cấp ATTP', table: 'staff' },
                      { key: 'lessonPlans', name: 'Kế hoạch giáo án điện tử', table: 'lesson_plans' },
                      { key: 'finance', name: 'Sổ quỹ thu / chi tài chính', table: 'finance_transactions' },
                      { key: 'salaries', name: 'Bảng lương & phụ cấp CBGV', table: 'staff_salaries' },
                    ].map((row) => {
                      const localCount = localMetrics ? (localMetrics as any)[row.key] || 0 : 0;
                      const remoteCount = remoteCounts[row.table]?.count ?? (isConnected ? 0 : '-');
                      const isSynced = isConnected && localCount === remoteCount;

                      return (
                        <tr key={row.key} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-semibold text-slate-800">{row.name}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold">
                              {localCount} bản ghi
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-mono font-bold">
                              {remoteCount} bản ghi
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {isConnected ? (
                              isSynced ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <Check className="w-3 h-3" /> Đã khớp
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                  <RefreshCw className="w-3 h-3" /> Cần đồng bộ
                                </span>
                              )
                            ) : (
                              <span className="text-[11px] text-slate-400">Offline</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PHÂN TÍCH KIẾN TRÚC & LỘ TRÌNH NÂNG CẤP (ROADMAP) */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              {/* Strategic Architecture Overview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white shadow-lg space-y-3">
                <div className="flex items-center gap-2.5 text-teal-300 font-bold text-sm">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Phân Tích Kiến Trúc Hệ Thống Quản Trị Mầm Non Hiện Tại</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ứng dụng hiện hoạt động theo mô hình <strong>Offline-First Hybrid</strong>: Giao diện người dùng đọc/ghi trực tiếp vào LocalStorage với độ trễ <strong>0ms</strong> (hoạt động mượt mà ngay cả khi mất mạng tại nhà bếp/khu vực vùng sâu vùng xa), đồng thời đồng bộ bền vững 2 chiều với cơ sở dữ liệu <strong>Turso LibSQL Edge Database</strong>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] text-teal-300 uppercase font-bold block">Tốc độ phản hồi</span>
                    <strong className="text-white text-sm">Tức thời (&lt; 1ms)</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] text-teal-300 uppercase font-bold block">Tính khả dụng</span>
                    <strong className="text-white text-sm">100% Offline-Ready</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-[10px] text-teal-300 uppercase font-bold block">Lưu trữ Đám mây</span>
                    <strong className="text-white text-sm">Turso SQLite Edge</strong>
                  </div>
                </div>
              </div>

              {/* 4-Phase Roadmap Timeline */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Milestone className="w-4 h-4 text-emerald-600" />
                  Lộ Trình Phát Triển &amp; Nâng Cấp Hệ Thống (4 Giai Đoạn)
                </h4>

                <div className="space-y-3">
                  {/* Phase 1 */}
                  <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                          1
                        </span>
                        Giai đoạn 1: Nền tảng Đơn trường &amp; Chuẩn Hóa Pháp Lý (Hiện Tại - Hoàn Tất)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        Đang hoạt động
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 pl-8">
                      - Chuẩn hóa biểu mẫu Kiểm thực 3 bước theo <strong>Quyết định 1246/QĐ-BYT</strong> và Sổ lưu hủy mẫu 24h.<br />
                      - Quản lý thực đơn 4 tuần theo lứa tuổi, hồ sơ sức khỏe và giáo án mầm non.<br />
                      - Trung tâm kiểm soát dữ liệu: Nạp mẫu test, sao lưu snapshot JSON, xóa trắng và xuất file in ấn.
                    </p>
                  </div>

                  {/* Phase 2 */}
                  <div className="p-4 rounded-xl border border-teal-200 bg-white space-y-2 hover:border-teal-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-teal-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
                          2
                        </span>
                        Giai đoạn 2: Quản Lý Chuỗi Cơ Sở (Multi-Branch) &amp; Phân Quyền RBAC
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900">
                        Kế hoạch Quý tiếp theo
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pl-8">
                      - Hỗ trợ thêm trường <code className="text-teal-700 bg-teal-50 px-1 rounded">school_branch_id</code> trên tất cả các bảng Turso để quản lý chuỗi nhiều điểm trường.<br />
                      - Phân quyền tài khoản theo vai trò: <strong>Bếp trưởng</strong> (chỉ sửa Bước 1, Bước 2), <strong>Cán bộ Y tế</strong> (Bước 3, Sức khỏe), <strong>Giáo viên</strong> (Giáo án), <strong>Hiệu trưởng / Chủ trường</strong> (Toàn quyền).
                    </p>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-4 rounded-xl border border-sky-200 bg-white space-y-2 hover:border-sky-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-sky-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs">
                          3
                        </span>
                        Giai đoạn 3: Đồng Bộ Thời Gian Thực (Real-time SSE) &amp; Xử Lý Xung Đột
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900">
                        Nâng cao
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pl-8">
                      - Tích hợp <strong>Server-Sent Events (SSE)</strong> hoặc WebSockets: Khi nhà bếp ghi nhận nguyên liệu ở điện thoại, màn hình máy tính ban giám hiệu tự động cập nhật ngay lập tức.<br />
                      - Cơ chế <strong>Version Vector / Optimistic Locking</strong> ngăn chặn việc 2 người cùng chỉnh sửa 1 bản ghi bị ghi đè mất thông tin.
                    </p>
                  </div>

                  {/* Phase 4 */}
                  <div className="p-4 rounded-xl border border-indigo-200 bg-white space-y-2 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                          4
                        </span>
                        Giai đoạn 4: Tự Động Hóa Sao Lưu &amp; Trợ Lý AI Phân Tích Dinh Dưỡng
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                        Đột phá
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pl-8">
                      - Tự động sao lưu định kỳ hàng đêm vào lúc 00:00 và gửi báo cáo qua Email/Zalo ZNS.<br />
                      - Trợ lý AI tích hợp phát hiện nguy cơ mất cân đối calo, cảnh báo sớm dị ứng nguyên liệu và gợi ý thực đơn mùa vụ tối ưu chi phí.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MÃ NGUỒN SQL DDL */}
          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  File: <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">turso-schema.sql</code> (12 bảng SQLite chuẩn hóa)
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép SQL!' : 'Sao chép toàn bộ SQL'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] max-h-80 overflow-y-auto leading-relaxed border border-slate-800">
                <pre>{`-- 0. Cấu hình Thông tin Trường Mầm Non
CREATE TABLE IF NOT EXISTS school_info (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  principal_name TEXT NOT NULL,
  medical_staff_name TEXT NOT NULL,
  head_chef_name TEXT NOT NULL,
  logo_url TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 1. Sổ Bước 1: Kiểm tra / Giao nhận thực phẩm
CREATE TABLE IF NOT EXISTS step1_inspections (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  food_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT NOT NULL,
  sensory_quality TEXT NOT NULL,
  supplier TEXT NOT NULL,
  expiry_or_certificate TEXT NOT NULL,
  deliverer TEXT NOT NULL,
  inspector TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT
);

-- 2. Sổ Bước 2: Quy trình sơ chế & nấu nướng
CREATE TABLE IF NOT EXISTS step2_cookings (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  meal TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  prep_time TEXT NOT NULL,
  cook_time TEXT NOT NULL,
  cooking_temp TEXT NOT NULL,
  hygiene_status TEXT NOT NULL,
  chef TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT
);

-- 3. Sổ Bước 3: Nếm thử & Niêm phong lưu mẫu
CREATE TABLE IF NOT EXISTS step3_tastings (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  meal TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  sensory_evaluation TEXT NOT NULL,
  serving_temp TEXT NOT NULL,
  sample_weight TEXT NOT NULL,
  storage_location TEXT NOT NULL,
  taster TEXT NOT NULL,
  keeper TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT
);

-- 4. Thực đơn dinh dưỡng học đường
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  week_number INTEGER NOT NULL,
  month TEXT NOT NULL,
  age_group TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  breakfast TEXT NOT NULL,
  snack_morning TEXT NOT NULL,
  lunch_main TEXT NOT NULL,
  lunch_soup TEXT NOT NULL,
  lunch_staple TEXT NOT NULL,
  lunch_dessert TEXT NOT NULL,
  afternoon_snack TEXT NOT NULL,
  calories_kcal REAL NOT NULL,
  protein_ratio TEXT NOT NULL,
  status TEXT NOT NULL,
  approved_by TEXT NOT NULL,
  notes TEXT
);

-- 5. Sổ Hủy Mẫu thức ăn sau 24h
CREATE TABLE IF NOT EXISTS sample_disposals (
  id TEXT PRIMARY KEY,
  date_sampled TEXT NOT NULL,
  time_sampled TEXT NOT NULL,
  meal TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  sample_weight TEXT NOT NULL,
  container_type TEXT NOT NULL,
  storage_temp TEXT NOT NULL,
  disposal_date TEXT NOT NULL,
  disposal_time TEXT NOT NULL,
  condition_at_disposal TEXT NOT NULL,
  sampler_name TEXT NOT NULL,
  witness_name TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

-- 6. Học sinh & Chế độ ăn uống dị ứng
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  student_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  dob TEXT NOT NULL,
  gender TEXT NOT NULL,
  class_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  attendance_status TEXT NOT NULL,
  allergies_or_diet TEXT,
  enrollment_date TEXT NOT NULL,
  notes TEXT
);

-- 7. Hồ sơ Sức khỏe Học sinh
CREATE TABLE IF NOT EXISTS health_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  check_date TEXT NOT NULL,
  height_cm REAL NOT NULL,
  weight_kg REAL NOT NULL,
  nutrition_status TEXT NOT NULL,
  vaccination_status TEXT NOT NULL,
  general_health TEXT NOT NULL,
  doctor_or_examiner TEXT NOT NULL,
  notes TEXT
);

-- 8. Cán bộ Giáo viên & Bếp
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  staff_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  gender TEXT,
  role TEXT NOT NULL,
  qualification TEXT NOT NULL,
  assigned_class_or_dept TEXT,
  assigned_duty TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  hygiene_cert_date TEXT,
  food_safety_cert_date TEXT,
  health_check_date TEXT,
  health_check_expiry TEXT,
  contract_status TEXT,
  start_date TEXT,
  status TEXT,
  notes TEXT
);

-- 9. Kế hoạch Giáo án điện tử
CREATE TABLE IF NOT EXISTS lesson_plans (
  id TEXT PRIMARY KEY,
  title TEXT,
  theme TEXT NOT NULL,
  target_class TEXT,
  age_group TEXT,
  subject TEXT,
  topic TEXT,
  teacher_name TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  month TEXT,
  date_range TEXT,
  development_field TEXT,
  learning_objectives TEXT,
  activities_plan TEXT,
  preparation TEXT,
  approval_status TEXT NOT NULL,
  approver_name TEXT NOT NULL,
  approval_date TEXT,
  file_attachment_name TEXT,
  notes TEXT
);

-- 10. Sổ Quỹ Thu / Chi
CREATE TABLE IF NOT EXISTS finance_transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  payer_or_receiver TEXT NOT NULL,
  method TEXT NOT NULL,
  receipt_number TEXT,
  notes TEXT,
  is_automatic_sync INTEGER DEFAULT 0
);

-- 11. Bảng Lương & Phụ Cấp Giáo Viên - CBGV
CREATE TABLE IF NOT EXISTS staff_salaries (
  id TEXT PRIMARY KEY,
  staff_id TEXT,
  staff_name TEXT NOT NULL,
  role TEXT NOT NULL,
  assigned_class TEXT,
  month TEXT NOT NULL,
  base_salary REAL NOT NULL,
  allowance_responsibility REAL DEFAULT 0,
  allowance_lunch REAL DEFAULT 0,
  allowance_other REAL DEFAULT 0,
  bonus REAL DEFAULT 0,
  insurance_deduction REAL DEFAULT 0,
  advance_payment REAL DEFAULT 0,
  other_deductions REAL DEFAULT 0,
  work_days_standard REAL DEFAULT 24,
  work_days_actual REAL DEFAULT 24,
  net_salary REAL NOT NULL,
  payment_status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  bank_account TEXT,
  bank_name TEXT,
  notes TEXT
);`}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: HƯỚNG DẪN CÀI ĐẶT TURSO */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      1
                    </span>
                    Tạo Database trên Turso (Miễn phí)
                  </h5>
                  <p className="text-slate-600 mb-2">
                    Truy cập trang chủ Turso tại{' '}
                    <a
                      href="https://turso.tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
                    >
                      turso.tech <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    hoặc chạy lệnh terminal:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 shrink-0" />
                    <span>turso db create mamnon-db</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    Chạy file mã SQL Schema để khởi tạo các bảng
                  </h5>
                  <p className="text-slate-600 mb-2">
                    Sao chép toàn bộ mã trong tab <strong>&ldquo;Mã SQL Khởi Tạo&rdquo;</strong> và dán vào phần SQL Console của Turso, hoặc chạy lệnh:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 shrink-0" />
                    <span>turso db shell mamnon-db &lt; turso-schema.sql</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    Điền URL và Auth Token vào biến môi trường
                  </h5>
                  <p className="text-slate-600 mb-2">
                    Lấy 2 thông số sau từ Turso Dashboard và dán vào <strong>Settings</strong> của ứng dụng:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 font-mono text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <li>TURSO_DATABASE_URL (dạng: libsql://mamnon-db-tenuser.turso.io)</li>
                    <li>TURSO_AUTH_TOKEN (chuỗi JWT token bảo mật)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mã hóa bảo mật &amp; an toàn dữ liệu học đường</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
