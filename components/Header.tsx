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
  CheckCircle2,
  Lock,
  Layers,
  Shield,
  Cloud,
  CloudOff,
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
              <PresetIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          );
        }
      }
      return (
        <div className="w-full h-full rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden border border-emerald-300/80 shadow-xs">
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
      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-center shadow-xs">
        <School className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    );
  };

  return (
    <header className="bg-gradient-to-r from-emerald-100/90 via-teal-50/70 via-white to-amber-100/80 border-b border-emerald-200/80 sticky top-0 z-30 shadow-xs backdrop-blur-md">
      {/* Preschool Rainbow Accent Ribbon Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 via-amber-400 via-rose-400 to-sky-500 shadow-2xs" />

      <div className="w-full px-3 sm:px-5 lg:px-6 py-1.5">
        {/* Main Header Inner Strip Container */}
        <div className="flex items-center justify-between h-14 sm:h-15 gap-2 sm:gap-4 bg-white/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl border border-emerald-200/70 shadow-2xs">
          
          {/* 1. Left: School Identity & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* School Logo with Click-to-Change */}
            <div
              onClick={onOpenLogoModal}
              title="Nhấn vào biểu tượng để đổi logo trường mầm non"
              className="relative group w-10 h-10 sm:w-11 sm:h-11 shrink-0 cursor-pointer select-none transition-transform hover:scale-105"
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

            <div className="truncate">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 truncate">
                  {schoolInfo.department}
                </span>
                <span className="hidden md:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300/60">
                  {schoolInfo.academicYear}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 truncate">
                {schoolInfo.name}
              </h2>
            </div>
          </div>

          {/* 2. Center: Active Task Indicator Badge (Clean Spatial Awareness) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Phân hệ:</span>
            <span className="font-extrabold text-slate-800">{activeModuleName}</span>
          </div>

          {/* 3. Right: Combined, Uncluttered Action Groups */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* ACTION 1: Quick Save & Cloud Sync (Prominent, High-Priority) */}
            {onSaveCloud && (
              <button
                type="button"
                onClick={onSaveCloud}
                disabled={isSavingCloud}
                title={
                  isTursoConnected
                    ? '⚡ Đã kết nối Turso Cloud: Lưu dữ liệu an toàn & đồng bộ tức thời giữa các máy tính'
                    : '⚡ Lưu dữ liệu vào máy tính (Offline) & đồng bộ lên máy chủ đám mây'
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isSavingCloud ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span className="hidden sm:inline">Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-100" />
                    <span className="hidden sm:inline">Lưu &amp; Đồng Bộ</span>
                    <span className="sm:hidden">Lưu</span>
                    {/* Live Cloud Status Dot */}
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        isTursoConnected ? 'bg-emerald-300 ring-2 ring-emerald-400/40 animate-pulse' : 'bg-amber-300'
                      }`}
                      title={isTursoConnected ? 'Turso Cloud: Trực tuyến' : 'Bộ nhớ: Ngoại tuyến'}
                    />
                  </>
                )}
              </button>
            )}

            {/* ACTION 2: Combined In & Xuất Hồ Sơ (Print & Export Center) */}
            <div className="relative" ref={exportMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsExportMenuOpen(!isExportMenuOpen);
                  setIsSystemMenuOpen(false);
                }}
                title="Trung tâm In & Xuất file: In biểu mẫu chuẩn Phòng GD&ĐT, Xuất file Excel/CSV"
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isExportMenuOpen
                    ? 'bg-blue-50 text-blue-900 border-blue-400 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:border-slate-400'
                }`}
              >
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                <span className="hidden sm:inline">In &amp; Xuất</span>
                <span className="sm:hidden">In/File</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    isExportMenuOpen ? 'rotate-180 text-blue-600' : ''
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

            {/* ACTION 3: AI Assistant Copilot */}
            {onOpenAiModal && (
              <button
                type="button"
                onClick={onOpenAiModal}
                title="Trợ Lý AI Mầm Non: Soạn giáo án, Cân đối dinh dưỡng & Phân tích món ăn"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-100 animate-pulse" />
                <span className="hidden sm:inline">Trợ Lý AI</span>
                <span className="sm:hidden">AI</span>
              </button>
            )}

            {/* ACTION 4: Combined System Menu (Hệ Thống, Cài đặt, Dữ liệu, PIN, Khóa) */}
            <div className="relative" ref={systemMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsSystemMenuOpen(!isSystemMenuOpen);
                  setIsExportMenuOpen(false);
                }}
                title="Menu Quản Trị Hệ Thống: Cài đặt trường, Dữ liệu đám mây Turso, Đổi mã PIN & Đăng xuất"
                className={`inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-2 text-xs sm:text-sm font-bold rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isSystemMenuOpen
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-400 shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                  QT
                </div>
                <span className="hidden md:inline">Hệ Thống</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    isSystemMenuOpen ? 'rotate-180 text-emerald-700' : ''
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
                    {/* Item 1: Turso Data Center */}
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

                    {/* Item 3: Change PIN */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSystemMenuOpen(false);
                        onOpenPinModal();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900">
                          Đổi Mã PIN Bảo Mật
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Đổi mật mã 4 số bảo vệ phần mềm
                        </div>
                      </div>
                    </button>

                    <div className="h-px bg-slate-100 my-1" />

                    {/* Item 4: Lock / Logout */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSystemMenuOpen(false);
                        onLock();
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 text-rose-700 transition-colors flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors shrink-0">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-rose-900">
                          Khóa Phiên Làm Việc (Đăng Xuất)
                        </div>
                        <div className="text-[11px] text-rose-500">
                          Khóa màn hình, yêu cầu nhập lại mã PIN
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
