'use client';

import React from 'react';
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
  const currentDateFormatted = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const printButtonLabel = React.useMemo(() => {
    switch (activeModuleId) {
      case 'lightning':
        return 'In Hồ Sơ Kiểm Thực';
      case 'finance':
        return 'In Sổ Thu Chi & Lương';
      case 'menu':
        return 'In Thực Đơn Tuần';
      case 'students':
        return 'In Danh Sách Bé';
      case 'health':
        return 'In Sổ Sức Khỏe';
      case 'staff':
        return 'In Hồ Sơ Nhân Sự';
      case 'lessonPlans':
        return 'In Giáo Án Mầm Non';
      default:
        return 'In chuẩn Phòng';
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
    <header className="bg-gradient-to-r from-emerald-100/85 via-teal-50/70 via-white to-amber-100/75 border-b border-emerald-200/80 sticky top-0 z-30 shadow-xs backdrop-blur-md">
      {/* Preschool Rainbow Accent Ribbon Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 via-amber-400 via-rose-400 to-sky-500 shadow-2xs" />

      <div className="w-full px-3 sm:px-5 lg:px-6 py-1">
        {/* Main Header Inner Strip Container */}
        <div className="flex items-center justify-between h-15 gap-3 sm:gap-4 bg-white/85 backdrop-blur-sm px-3 sm:px-4 py-1.5 rounded-2xl border border-emerald-200/60 shadow-2xs">
          {/* Left: School Logo with Change Option, & School Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* School Logo Container with Click-to-Change */}
            <div
              onClick={onOpenLogoModal}
              title="Nhấn vào biểu tượng máy ảnh để đổi logo trường mầm non"
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

          {/* Center/Right: User Greeting & Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Greeting */}
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-[11px] text-slate-500 capitalize flex items-center justify-end gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {currentDateFormatted}
              </span>
              <span className="text-xs font-bold text-slate-800">
                Xin chào, <span className="text-emerald-800 font-extrabold">Quản trị viên (Chủ trường)</span>
              </span>
            </div>

            {/* Print Official Report Button (Context-Aware) */}
            <button
              type="button"
              onClick={onOpenReportModal}
              title={`Xem và In biểu mẫu ${printButtonLabel} theo chuẩn Phòng GD&ĐT`}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span className="text-sm">🖨️</span>
              <span className="hidden sm:inline">{printButtonLabel}</span>
              <span className="sm:hidden">In</span>
            </button>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={onExportCsv}
              title="Xuất file Excel/CSV theo chuẩn tiếng Việt"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              <span className="text-sm">📊</span>
              <span className="hidden md:inline">Xuất Excel</span>
            </button>

            {/* AI Preschool Assistant (Groq / Gemini Copilot) */}
            {onOpenAiModal && (
              <button
                type="button"
                onClick={onOpenAiModal}
                title="Trợ Lý AI Mầm Non: Soạn giáo án tức thời, Cân đối thực đơn & Phân tích kiểm thực 3 bước (Groq LPU / Gemini)"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:from-amber-600 hover:to-rose-600 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95 animate-pulse"
              >
                <span className="text-sm">✨</span>
                <span className="hidden sm:inline">Trợ Lý AI</span>
                <span className="sm:hidden">AI</span>
                <span className="hidden lg:inline text-[9px] px-1 py-0.2 rounded-md bg-white/20 text-white font-mono">
                  Groq
                </span>
              </button>
            )}

            {/* Turso Database Data Control Center */}
            {onOpenTursoModal && (
              <button
                type="button"
                onClick={onOpenTursoModal}
                title="Trung Tâm Kiểm Soát Dữ Liệu: Nạp mẫu test, Sao lưu, Phục hồi, Reset & Lộ trình nâng cấp"
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border transition-all shadow-xs cursor-pointer active:scale-95 ${
                  isTursoConnected
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 border-emerald-300 hover:border-emerald-400 hover:shadow-sm'
                    : 'bg-gradient-to-r from-teal-50 to-amber-50/60 text-slate-800 border-teal-300/80 hover:border-teal-400 hover:shadow-sm'
                }`}
              >
                <span className="text-sm">🗄️</span>
                <span className="hidden md:inline">Dữ Liệu</span>
                <span className="md:hidden">Data</span>
                {isTursoConnected ? (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            )}

            {/* Quick Save & Sync button with green success feedback */}
            {onSaveCloud && (
              <button
                type="button"
                onClick={onSaveCloud}
                disabled={isSavingCloud}
                title="⚡ Lưu dữ liệu an toàn và đồng bộ tức thời lên đám mây Turso"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isSavingCloud ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    <span className="hidden sm:inline">Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">💾</span>
                    <span className="hidden sm:inline">Lưu &amp; Đồng Bộ</span>
                    <span className="sm:hidden">Lưu</span>
                  </>
                )}
              </button>
            )}

            {/* School Info Settings */}
            <button
              type="button"
              onClick={onOpenSchoolModal}
              title="Cài đặt thông tin Trường & Phòng GD&ĐT"
              className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Change PIN */}
            <button
              type="button"
              onClick={onOpenPinModal}
              title="Đổi mã PIN bảo mật nội bộ"
              className="p-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-emerald-200"
            >
              <KeyRound className="w-4 h-4" />
            </button>

            {/* Lock / Logout */}
            <button
              type="button"
              onClick={onLock}
              title="Khóa hệ thống (yêu cầu nhập lại PIN)"
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
