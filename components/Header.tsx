'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  School,
  LogOut,
  KeyRound,
  Printer,
  Settings,
  FileSpreadsheet,
  Calendar,
  Camera,
  Database,
  Sparkles,
  ChevronDown,
  Save,
  Menu,
  Cloud,
  CloudOff,
  Trash2,
} from 'lucide-react';
import { SchoolInfo, ModuleId } from '@/types/preschool';
import { PRESET_LOGOS } from './LogoSelectModal';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  activeModuleId: ModuleId;
  activeModuleName: string;
  onLock: () => void;
  onOpenPinModal: () => void;
  onOpenSchoolModal: () => void;
  onOpenReportModal: () => void;
  onExportCsv: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onOpenLogoModal?: () => void;
  onOpenTursoModal?: () => void;
  onOpenAiModal?: () => void;
  isTursoConnected?: boolean;
  onSaveCloud?: () => void;
  isSavingCloud?: boolean;
  isPinDisabled?: boolean;
  onToggleMobileSidebar?: () => void;
  onClearAllSampleData?: () => void;
}

export default function Header({
  schoolInfo,
  activeModuleId,
  activeModuleName,
  onLock,
  onOpenPinModal,
  onOpenSchoolModal,
  onOpenReportModal,
  onExportCsv,
  isSidebarCollapsed = false,
  onToggleSidebar,
  onOpenLogoModal,
  onOpenTursoModal,
  onOpenAiModal,
  isTursoConnected = false,
  onSaveCloud,
  isSavingCloud = false,
  isPinDisabled = true,
  onToggleMobileSidebar,
  onClearAllSampleData,
}: HeaderProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isSystemMenuOpen, setIsSystemMenuOpen] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const systemMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
      if (systemMenuRef.current && !systemMenuRef.current.contains(e.target as Node)) {
        setIsSystemMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentDateFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const printButtonLabel = React.useMemo(() => {
    switch (activeModuleId) {
      case 'lightning':
        return 'In Bộ Hồ Sơ Kiểm Thực 3 Bước';
      case 'finance':
        return 'In Sổ Thu Chi & Bảng Lương';
      case 'menu':
        return 'In Thực Đơn & Kho Món Ăn';
      case 'students':
        return 'In Danh Sách Trẻ & Điểm Danh';
      case 'health':
        return 'In Sổ Sức Khỏe & Kênh Dinh Dưỡng';
      case 'staff':
        return 'In Hồ Sơ Nhân Sự & Cấp Dưỡng';
      case 'lessonPlans':
        return 'In Giáo Án Kế Hoạch Tuần';
      default:
        return 'In Biểu Mẫu Chuẩn Phòng GD&ĐT';
    }
  }, [activeModuleId]);

  const renderLogo = () => {
    if (schoolInfo.logoUrl) {
      if (schoolInfo.logoUrl.startsWith('preset:')) {
        const found = PRESET_LOGOS.find((p) => p.id === schoolInfo.logoUrl);
        if (found) {
          const PresetIcon = found.icon;
          return (
            <div
              className={`w-full h-full rounded-xl bg-gradient-to-tr ${found.gradient} ${found.iconColor} flex items-center justify-center shadow-xs`}
            >
              <PresetIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>
          );
        }
      }
      return (
        <div className="w-full h-full rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden border border-emerald-300 shadow-2xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={schoolInfo.logoUrl}
            alt={schoolInfo.name}
            className="w-full h-full object-contain"
          />
        </div>
      );
    }
    return (
      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-2xs">
        <School className="w-5 h-5" />
      </div>
    );
  };

  return (
    <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
      <div className="h-full px-3 sm:px-5 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* 1. Left: Mobile Menu Toggle + School Brand & Module Breadcrumb */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Sidebar Hamburger Toggle */}
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              title="Mở danh mục sổ sách"
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* School Logo */}
          <div
            onClick={onOpenLogoModal}
            title="Nhấn vào biểu tượng để đổi logo trường mầm non"
            className="relative group w-9 h-9 sm:w-10 sm:h-10 shrink-0 cursor-pointer select-none transition-transform hover:scale-105"
          >
            {renderLogo()}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLogoModal?.();
              }}
              title="Đổi logo trường"
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 flex items-center justify-center text-[9px] shadow-sm border border-white group-hover:scale-110 transition-transform cursor-pointer"
            >
              <Camera className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* School Name & Breadcrumb */}
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-1.5 flex-wrap leading-none">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-800 truncate">
                {schoolInfo.department}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-500">
                {schoolInfo.academicYear}
              </span>
              <span className="text-slate-300 hidden md:inline">•</span>
              <div className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <span className="text-slate-400">Phân hệ:</span>
                <span className="text-emerald-700 truncate max-w-[220px]">{activeModuleName}</span>
              </div>
            </div>
            <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 tracking-tight truncate mt-0.5">
              {schoolInfo.name}
            </h1>
          </div>
        </div>

        {/* 2. Right: Action Buttons with Clear 3-Color Save/Sync State & Clean Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* PRIMARY ACTION: Save & Cloud Status (Màu xanh: đã đồng bộ | Màu cam: đang lưu | Màu đỏ: lỗi offline) */}
          {onSaveCloud && (
            <button
              type="button"
              onClick={onSaveCloud}
              disabled={isSavingCloud}
              title={
                isSavingCloud
                  ? 'Đang lưu dữ liệu và đồng bộ lên đám mây...'
                  : isTursoConnected
                  ? 'Đã đồng bộ an toàn với máy chủ Turso Cloud (Bấm để lưu thủ công)'
                  : 'Đang lỗi offline: Dữ liệu lưu cục bộ trong máy, chưa kết nối Turso Cloud'
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl active:scale-95 text-white transition-all shadow-xs hover:shadow cursor-pointer disabled:opacity-85 ${
                isSavingCloud
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                  : isTursoConnected
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
              }`}
            >
              {isSavingCloud ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                  <span className="hidden sm:inline">Đang Lưu...</span>
                  <span className="sm:hidden">Lưu...</span>
                  {/* Status Dot: Orange */}
                  <span className="w-2 h-2 rounded-full bg-amber-200 ring-2 ring-amber-300 animate-pulse shrink-0" />
                </>
              ) : isTursoConnected ? (
                <>
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-100" />
                  <span className="hidden sm:inline">Đã Đồng Bộ</span>
                  <span className="sm:hidden">Đồng Bộ</span>
                  {/* Status Dot: Green */}
                  <span className="w-2 h-2 rounded-full bg-emerald-200 ring-2 ring-emerald-300/80 animate-pulse shrink-0" />
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-100" />
                  <span className="hidden sm:inline">Lưu (Offline)</span>
                  <span className="sm:hidden">Offline</span>
                  {/* Status Dot: Red */}
                  <span className="w-2 h-2 rounded-full bg-rose-200 ring-2 ring-rose-300 animate-pulse shrink-0" />
                </>
              )}
            </button>
          )}

          {/* SECONDARY ACTION: In & Xuất Hồ Sơ */}
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsExportMenuOpen(!isExportMenuOpen);
                setIsSystemMenuOpen(false);
              }}
              title="Trung tâm In & Xuất file: In biểu mẫu chuẩn Phòng GD&ĐT, Xuất file Excel/CSV"
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isExportMenuOpen
                  ? 'bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span className="hidden sm:inline">In &amp; Xuất</span>
              <span className="sm:hidden">In/Xuất</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isExportMenuOpen ? 'rotate-180 text-slate-700' : ''
                }`}
              />
            </button>

            {/* In & Xuất Dropdown Panel */}
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Tùy chọn In ấn &amp; Báo cáo
                  </span>
                  <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                    Phân hệ: {activeModuleName}
                  </p>
                </div>

                <div className="p-1 space-y-1">
                  {/* Option 1: In Biểu mẫu */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onOpenReportModal();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 transition-colors flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                        {printButtonLabel}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Xem trước &amp; In mẫu theo quy định Bộ GD&amp;ĐT / Bộ Y Tế
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Xuất Excel */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      onExportCsv();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-950 transition-colors flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                        Xuất File Excel / CSV Tiếng Việt
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Tải dữ liệu bảng tính đầy đủ cột, UTF-8 có dấu
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TERTIARY ACTION: AI Assistant Copilot */}
          {onOpenAiModal && (
            <button
              type="button"
              onClick={onOpenAiModal}
              title="Trợ Lý AI Mầm Non: Soạn giáo án, Cân đối dinh dưỡng & Phân tích món ăn"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200/90 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
              <span className="hidden md:inline font-bold">Trợ Lý AI</span>
              <span className="md:hidden">AI</span>
            </button>
          )}

          {/* QUẢN TRỊ / HỆ THỐNG MENU (Chỉ cần emoji cài đặt ⚙️ Cài Đặt) */}
          <div className="relative" ref={systemMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsSystemMenuOpen(!isSystemMenuOpen);
                setIsExportMenuOpen(false);
              }}
              title="Menu Cài Đặt Hệ Thống: Cài đặt trường, Dữ liệu đám mây Turso, Đổi mã PIN & Đăng xuất"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isSystemMenuOpen
                  ? 'bg-slate-100 text-slate-900 border-slate-300'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline font-bold text-slate-800">Cài Đặt</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isSystemMenuOpen ? 'rotate-180 text-slate-700' : ''
                }`}
              />
            </button>

            {/* System Dropdown Menu Panel */}
            {isSystemMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Profile Header */}
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/80 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950">
                      Quản trị viên (Chủ trường)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isTursoConnected
                          ? 'bg-emerald-200/80 text-emerald-900'
                          : 'bg-amber-200/80 text-amber-900'
                      }`}
                    >
                      {isTursoConnected ? (
                        <>
                          <Cloud className="w-3 h-3 text-emerald-700" />
                          Đám mây kết nối
                        </>
                      ) : (
                        <>
                          <CloudOff className="w-3 h-3 text-amber-700" />
                          Lưu cục bộ
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {currentDateFormatted}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-1">
                  {/* Item 1: Turso Data Center (đã có trong tab hệ thống) */}
                  {onOpenTursoModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSystemMenuOpen(false);
                        onOpenTursoModal();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-teal-50 text-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-teal-100 text-teal-800 group-hover:bg-teal-600 group-hover:text-white transition-colors shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-teal-950">
                          Trung Tâm Dữ Liệu Turso Cloud
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Đồng bộ 2 máy, sao lưu JSON &amp; nạp mẫu test
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Item 2: School Config */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSystemMenuOpen(false);
                      onOpenSchoolModal();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-700 group-hover:text-white transition-colors shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900">
                        Thông Tin Trường &amp; Ban Giám Hiệu
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Cài đặt tên trường, phòng GD, người ký sổ sách
                      </div>
                    </div>
                  </button>

                  {/* Item 3: Security & PIN Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSystemMenuOpen(false);
                      onOpenPinModal();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50/70 text-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900">
                        Cài Đặt Bảo Mật &amp; Mã PIN
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Đổi mã PIN 6 số bảo vệ ứng dụng
                      </div>
                    </div>
                  </button>

                  {/* Item 4: Clear All Sample Data */}
                  {onClearAllSampleData && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSystemMenuOpen(false);
                        onClearAllSampleData();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 text-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-rose-700">
                          Xóa Sạch Toàn Bộ Data Mẫu
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Bắt đầu nhập dữ liệu thực tế của trường
                        </div>
                      </div>
                    </button>
                  )}

                  <div className="h-px bg-slate-100 my-1" />

                  {/* Item 5: Lock Session */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSystemMenuOpen(false);
                      onLock();
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-700 group-hover:text-white transition-colors shrink-0">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800">
                        Khóa Phiên (Đăng Xuất)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Khóa màn hình làm việc an toàn
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
