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
  Clock,
  ChevronLeft,
  ChevronRight,
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
  const [isCalendarPopupOpen, setIsCalendarPopupOpen] = useState(false);

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const systemMenuRef = useRef<HTMLDivElement>(null);
  const calendarPopupRef = useRef<HTMLDivElement>(null);

  // Đồng hồ điện tử thời gian thực & Lịch số
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
      if (systemMenuRef.current && !systemMenuRef.current.contains(e.target as Node)) {
        setIsSystemMenuOpen(false);
      }
      if (calendarPopupRef.current && !calendarPopupRef.current.contains(e.target as Node)) {
        setIsCalendarPopupOpen(false);
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
        <div className="w-full h-full rounded-xl bg-white p-0.5 flex items-center justify-center overflow-hidden border border-blue-300 shadow-2xs">
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
      <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-2xs">
        <School className="w-5 h-5" />
      </div>
    );
  };

  return (
    <header className="h-16 shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50 shadow-2xs">
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* 1. Left: Mobile Menu Toggle + School Brand & Module Breadcrumb (Không bị co hẹp hay che khuất) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 max-w-[40%] sm:max-w-[46%] lg:max-w-[50%]">
          {/* Mobile Sidebar Hamburger Toggle */}
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              title="Mở danh mục sổ sách"
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* School Logo */}
          <div
            onClick={onOpenLogoModal}
            title="Nhấn vào biểu tượng để đổi logo trường mầm non"
            className="relative group w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 shrink-0 cursor-pointer select-none transition-transform hover:scale-105"
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
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-700 truncate">
                {schoolInfo.department}
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-500">
                {schoolInfo.academicYear}
              </span>
              <span className="text-slate-300 hidden 2xl:inline">•</span>
              <div className="hidden 2xl:inline-flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <span className="text-slate-400">Phân hệ:</span>
                <span className="text-blue-700 truncate max-w-[180px]">{activeModuleName}</span>
              </div>
            </div>
            <h1
              className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 tracking-tight truncate mt-0.5"
              title={schoolInfo.name}
            >
              {schoolInfo.name}
            </h1>
          </div>
        </div>

        {/* 2. Right: Cụm Đồng Hồ & Lịch Điện Tử Tinh Tế, Nhỏ Gọn + Các Nút Thao Tác (Không bị che khuất) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* ĐỒNG HỒ SỐ & LỊCH ĐIỆN TỬ TINH TẾ, NHỎ GỌN */}
          {(() => {
            const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const dayOfWeekName = dayNames[currentTime.getDay()];
            const timeHours = String(currentTime.getHours()).padStart(2, '0');
            const timeMinutes = String(currentTime.getMinutes()).padStart(2, '0');
            const timeSeconds = String(currentTime.getSeconds()).padStart(2, '0');
            const dateShort = `${String(currentTime.getDate()).padStart(2, '0')}/${String(currentTime.getMonth() + 1).padStart(2, '0')}/${currentTime.getFullYear()}`;

            // Calendar Popover Grid calculations
            const viewYear = calendarViewDate.getFullYear();
            const viewMonth = calendarViewDate.getMonth();
            const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
            const firstDayIndex = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday = 0
            const isCurrentViewTodayMonth =
              viewMonth === currentTime.getMonth() && viewYear === currentTime.getFullYear();

            return (
              <div className="relative shrink-0" ref={calendarPopupRef}>
                <button
                  type="button"
                  onClick={() => setIsCalendarPopupOpen(!isCalendarPopupOpen)}
                  title="Lịch điện tử & đồng hồ số thời gian thực (Bấm để xem lịch tháng chuẩn)"
                  className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border transition-all cursor-pointer shadow-2xs select-none ${
                    isCalendarPopupOpen
                      ? 'bg-slate-100 border-blue-500 ring-2 ring-blue-500/20 text-slate-900'
                      : 'bg-slate-50/90 hover:bg-slate-100/90 border-slate-200/90 text-slate-700'
                  }`}
                >
                  {/* Live pulsating blue dot */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>

                  {/* Digital Clock */}
                  <div className="flex items-center gap-0.5 font-mono text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                    <Clock className="w-3.5 h-3.5 text-blue-700 shrink-0 mr-0.5" />
                    <span>{timeHours}</span>
                    <span className="text-blue-600 animate-pulse font-normal">:</span>
                    <span>{timeMinutes}</span>
                    <span className="hidden xl:inline text-slate-400 text-[10px] font-semibold">:{timeSeconds}</span>
                  </div>

                  {/* Vertical subtle divider */}
                  <span className="hidden sm:inline-block h-3.5 w-px bg-slate-300/80"></span>

                  {/* Electronic Calendar Date */}
                  <div className="hidden sm:flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="hidden lg:inline">{dayOfWeekName}, </span>
                    <span className="font-mono">{dateShort}</span>
                  </div>

                  {/* Dropdown Chevron */}
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 group-hover:text-slate-600 ${
                      isCalendarPopupOpen ? 'rotate-180 text-blue-700' : ''
                    }`}
                  />
                </button>

                {/* Electronic Calendar Popover Modal/Panel */}
                {isCalendarPopupOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Top Digital Display Banner */}
                    <div className="p-3 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl mb-3 shadow-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="flex items-center gap-1 text-blue-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                          Thời gian thực hệ thống
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">GMT+7</span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <div className="font-mono text-2xl sm:text-3xl font-black text-blue-400 tracking-wider">
                          {timeHours}:{timeMinutes}
                          <span className="text-base text-blue-200/90 font-bold ml-0.5">:{timeSeconds}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-white">{dayOfWeekName}</div>
                          <div className="text-[11px] text-slate-300 font-mono">{dateShort}</div>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Month Navigation */}
                    <div className="flex items-center justify-between px-1 mb-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setCalendarViewDate(new Date(viewYear, viewMonth - 1, 1));
                          }}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                          title="Tháng trước"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-xs sm:text-sm text-slate-800 px-1">
                          Tháng {viewMonth + 1}, {viewYear}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setCalendarViewDate(new Date(viewYear, viewMonth + 1, 1));
                          }}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
                          title="Tháng sau"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setCalendarViewDate(new Date())}
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 cursor-pointer transition-colors"
                        title="Về tháng hiện tại"
                      >
                        Hôm nay
                      </button>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10.5px] text-slate-400 py-1 border-y border-slate-100 mb-1">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                        <div key={i} className={i >= 5 ? 'text-amber-600' : ''}>
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Day Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: firstDayIndex }).map((_, idx) => (
                        <div key={`empty-${idx}`} className="h-7" />
                      ))}

                      {Array.from({ length: daysInViewMonth }).map((_, idx) => {
                        const day = idx + 1;
                        const isToday =
                          isCurrentViewTodayMonth && day === currentTime.getDate();
                        const dateObj = new Date(viewYear, viewMonth, day);
                        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

                        return (
                          <div
                            key={day}
                            className={`h-7 flex items-center justify-center rounded-lg text-[11px] font-medium transition-colors ${
                              isToday
                                ? 'bg-blue-600 text-white font-black shadow-xs ring-1 ring-blue-500'
                                : isWeekend
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
                      <span className="truncate">Lịch chuẩn mầm non BGD&amp;ĐT</span>
                      <button
                        type="button"
                        onClick={() => setIsCalendarPopupOpen(false)}
                        className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          
          {/* PRIMARY ACTION: Save & Cloud Status (Xanh dương: đã đồng bộ | Cam: đang lưu | Đỏ: lỗi offline) */}
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
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/25'
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
                  <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-100" />
                  <span className="hidden sm:inline">Đã Đồng Bộ</span>
                  <span className="sm:hidden">Đồng Bộ</span>
                  {/* Status Dot: Blue */}
                  <span className="w-2 h-2 rounded-full bg-blue-200 ring-2 ring-blue-300/80 animate-pulse shrink-0" />
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
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 hover:text-blue-950 transition-colors flex items-start gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                      <Printer className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
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
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/90 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
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
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/80 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-950">
                      Quản trị viên (Chủ trường)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isTursoConnected
                          ? 'bg-blue-200/80 text-blue-900'
                          : 'bg-amber-200/80 text-amber-900'
                      }`}
                    >
                      {isTursoConnected ? (
                        <>
                          <Cloud className="w-3 h-3 text-blue-700" />
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
                      className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-950">
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
                    className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50/70 text-slate-800 transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
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
