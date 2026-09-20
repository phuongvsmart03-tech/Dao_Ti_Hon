'use client';

import React from 'react';
import {
  Zap,
  DollarSign,
  CalendarDays,
  Utensils,
  Users,
  HeartPulse,
  Briefcase,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Sun,
  School,
  X,
  Settings,
  FileCheck,
  TrendingUp,
  History,
} from 'lucide-react';
import { ModuleId } from '@/types/preschool';

export interface ModuleItemConfig {
  id: ModuleId;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  stepBadge?: string;
  category: 'vsattp' | 'education' | 'management';
  accentColor: {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
    activeBg: string;
  };
}

export const MODULE_ITEMS: ModuleItemConfig[] = [
  {
    id: 'lightning',
    label: 'Trích xuất hồ sơ',
    subLabel: 'Kiểm thực 3 bước & quyết toán tiền ăn',
    icon: FileCheck,
    stepBadge: 'TRỌNG TÂM',
    category: 'vsattp',
    accentColor: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-300',
      border: 'border-amber-400/50',
      iconBg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold',
      activeBg: 'from-amber-500 to-yellow-600',
    },
  },
  {
    id: 'finance',
    label: 'Thu Chi & Tính Lương',
    subLabel: 'Lương giáo viên, dòng tiền & biểu đồ',
    icon: DollarSign,
    stepBadge: 'TÀI CHÍNH',
    category: 'management',
    accentColor: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-300',
      border: 'border-emerald-400/50',
      iconBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold',
      activeBg: 'from-emerald-600 to-teal-700',
    },
  },
  {
    id: 'menu',
    label: 'Kho Món Ăn & Dinh Dưỡng',
    subLabel: 'Quản trị 30 món chốt cơ sở & công thức',
    icon: Utensils,
    category: 'vsattp',
    accentColor: {
      bg: 'bg-sky-500/10',
      text: 'text-sky-300',
      border: 'border-sky-400/30',
      iconBg: 'bg-sky-500 text-white',
      activeBg: 'from-sky-600 to-blue-700',
    },
  },
  {
    id: 'students',
    label: 'Bé & Học sinh',
    subLabel: 'Hồ sơ các bé, lớp học, điểm danh',
    icon: Users,
    category: 'education',
    accentColor: {
      bg: 'bg-pink-500/10',
      text: 'text-pink-300',
      border: 'border-pink-400/30',
      iconBg: 'bg-pink-500 text-white',
      activeBg: 'from-pink-600 to-rose-700',
    },
  },
  {
    id: 'health',
    label: 'Sức Khỏe Bé',
    subLabel: 'Cân nặng, chiều cao, tiêm chủng',
    icon: HeartPulse,
    category: 'education',
    accentColor: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-300',
      border: 'border-teal-400/30',
      iconBg: 'bg-teal-500 text-white',
      activeBg: 'from-teal-600 to-emerald-700',
    },
  },
  {
    id: 'staff',
    label: 'Cô giáo & Nhân sự',
    subLabel: 'Đội ngũ giáo viên, bảo mẫu, cấp dưỡng',
    icon: Briefcase,
    category: 'management',
    accentColor: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-300',
      border: 'border-indigo-400/30',
      iconBg: 'bg-indigo-500 text-white',
      activeBg: 'from-indigo-600 to-blue-800',
    },
  },
  {
    id: 'lessonPlans',
    label: 'Giáo Án Mầm Non',
    subLabel: 'Kế hoạch bài giảng, hoạt động bé',
    icon: BookOpen,
    category: 'education',
    accentColor: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      border: 'border-amber-400/30',
      iconBg: 'bg-amber-400 text-amber-950',
      activeBg: 'from-amber-600 to-orange-700',
    },
  },
  {
    id: 'history',
    label: 'Lịch sử thao tác',
    subLabel: 'Nhật ký thêm, sửa, xóa & khôi phục',
    icon: History,
    stepBadge: 'HOÀN TÁC',
    category: 'management',
    accentColor: {
      bg: 'bg-violet-500/10',
      text: 'text-violet-300',
      border: 'border-violet-400/30',
      iconBg: 'bg-violet-600 text-white',
      activeBg: 'from-violet-600 to-purple-800',
    },
  },
  {
    id: 'settings',
    label: 'Cài đặt hệ thống',
    subLabel: 'Ký & in, nhà cung cấp thực phẩm, trường học',
    icon: Settings,
    category: 'management',
    accentColor: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-300',
      border: 'border-slate-400/30',
      iconBg: 'bg-slate-600 text-white',
      activeBg: 'from-slate-700 to-slate-800',
    },
  },
];

interface SidebarProps {
  activeModuleId: ModuleId;
  onSelectModule: (id: ModuleId) => void;
  counts: Record<ModuleId, number>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  activeModuleId,
  onSelectModule,
  counts,
  isOpenMobile,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Preschool Themed Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 bg-gradient-to-b from-[#133246] via-[#0e3b44] to-[#0a2e36] text-white flex flex-col border-r border-[#1e4a55] shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 w-72 sm:w-80 shadow-2xl' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72 sm:lg:w-80'}`}
      >
        {/* Top Header inside Sidebar with Preschool Vibe */}
        <div
          className={`border-b border-[#1e4a55] bg-[#0c2738]/80 backdrop-blur-xs flex items-center transition-all duration-300 ${
            isCollapsed ? 'p-3 flex-col justify-center gap-2' : 'px-4 py-3.5 justify-between'
          }`}
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-1.5 w-full">
              <div
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
                onClick={onToggleCollapse}
                title="Bung rộng thanh điều hướng"
              >
                <Sun className="w-5 h-5 text-amber-900 animate-spin-slow" />
              </div>

              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Bung rộng thanh bên"
                  className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-amber-950 flex items-center justify-center shadow-md shrink-0">
                  <Sun className="w-5 h-5 text-amber-900" />
                </div>
                <div className="min-w-0 truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                      Sổ Sách Mầm Non
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                      9/9 Sổ
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/70 truncate">Hồ sơ dinh dưỡng & CSGD</p>
                </div>
              </div>

              {/* Close Button on Mobile */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* 9 Modules Navigation List with Warm Kindergarten Theme */}
        <nav
          className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${
            isCollapsed ? 'p-2 space-y-2' : 'p-3 space-y-1.5'
          }`}
        >
          {MODULE_ITEMS.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeModuleId === item.id;
            const count = counts[item.id] || 0;

            if (isCollapsed) {
              // Compact Icon-Only Mode with Floating Tooltip
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectModule(item.id);
                      onCloseMobile();
                    }}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-tr from-amber-400 to-amber-300 text-amber-950 shadow-lg scale-105 ring-2 ring-amber-300/50 font-bold'
                        : 'text-emerald-100/80 hover:bg-white/10 hover:text-white hover:scale-102'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-950' : 'text-emerald-200'}`} />
                    <span className="text-[9px] font-mono leading-none mt-0.5 opacity-90 font-bold">
                      {index + 1}
                    </span>

                    {/* Badge Count Dot */}
                    {count > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </button>

                  {/* Floating Tooltip when Collapsed */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none">
                    <div className="bg-[#0b2432] text-white p-2.5 rounded-xl shadow-2xl border border-emerald-500/30 whitespace-nowrap min-w-[210px]">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="font-bold text-xs text-amber-300">
                          {index + 1}. {item.label}
                        </span>
                        {item.stepBadge && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-amber-950">
                            {item.stepBadge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-100/70">{item.subLabel}</p>
                      <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-300">
                        <span>Đã lưu hồ sơ:</span>
                        <span className="font-mono font-bold text-white bg-white/10 px-1.5 py-0.2 rounded">
                          {count} mục
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Expanded Full Row Mode
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectModule(item.id);
                  onCloseMobile();
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-start gap-3 group relative cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-lg font-medium ring-1 ring-emerald-300/40'
                    : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {/* Colorful Preschool Icon Container */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-semibold transition-transform mt-0.5 group-hover:scale-105 ${
                    isActive
                      ? 'bg-amber-300 text-amber-950 shadow-md ring-1 ring-amber-400'
                      : `${item.accentColor.iconBg} shadow-xs`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text Labels */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-sm leading-tight truncate">
                      {index + 1}. {item.label}
                    </span>
                    {item.stepBadge && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 shrink-0 shadow-2xs">
                        {item.stepBadge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 line-clamp-1 leading-relaxed ${
                      isActive ? 'text-emerald-50' : 'text-emerald-200/70 group-hover:text-emerald-100'
                    }`}
                  >
                    {item.subLabel}
                  </p>
                </div>

                {/* Count Badge */}
                <span
                  className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 self-center transition-colors ${
                    isActive
                      ? 'bg-emerald-900/60 text-amber-200 border border-amber-300/30'
                      : 'bg-black/20 text-emerald-200 group-hover:bg-white/15 group-hover:text-white'
                  }`}
                >
                  {count}
                </span>

                {/* Active Sunshine Indicator Bar on Left */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-amber-300 shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info in Sidebar */}
        <div
          className={`border-t border-[#1e4a55] bg-[#0c2738]/80 text-xs transition-all duration-300 ${
            isCollapsed ? 'p-2 flex flex-col items-center' : 'p-3 flex items-center justify-between'
          }`}
        >
          {isCollapsed ? (
            <div className="relative group">
              <button
                type="button"
                onClick={onToggleCollapse}
                title="Bung rộng thanh bên"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
              <div className="absolute left-full bottom-0 ml-3.5 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                <div className="bg-[#0b2432] text-white px-2.5 py-1.5 rounded-lg shadow-xl border border-emerald-500/30 whitespace-nowrap text-xs font-semibold">
                  Mở rộng thanh bên (Ctrl + B)
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="leading-tight truncate">
                  <span className="font-bold text-white block text-[11px]">QĐ 1246/QĐ-BYT</span>
                  <span className="text-[10px] text-emerald-200/80">Hồ sơ mầm non chuẩn hóa</span>
                </div>
              </div>

              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Thu gọn thanh bên để mở rộng không gian xem sổ sách"
                  className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
