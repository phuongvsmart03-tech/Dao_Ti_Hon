'use client';

import React from 'react';
import {
  DollarSign,
  Utensils,
  Users,
  HeartPulse,
  Briefcase,
  BookOpen,
  ChevronLeft,
  ShieldCheck,
  PanelLeftOpen,
  School,
  X,
  Settings,
  FileCheck,
  History,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { ModuleId } from '@/types/preschool';

export interface ModuleItemConfig {
  id: ModuleId;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'vsattp' | 'education' | 'management';
}

export const MODULE_ITEMS: ModuleItemConfig[] = [
  // Nhóm 1: Kiểm Thực VSATTP & Bán Trú
  {
    id: 'lightning',
    label: 'Trích xuất hồ sơ kiểm thực',
    subLabel: 'Kiểm thực 3 bước & quyết toán tiền ăn',
    icon: FileCheck,
    category: 'vsattp',
  },
  {
    id: 'menu',
    label: 'Kho Món & Dinh Dưỡng',
    subLabel: 'Quản trị danh mục món & công thức',
    icon: Utensils,
    category: 'vsattp',
  },
  {
    id: 'samples',
    label: 'Sổ lưu & Hủy mẫu 24h',
    subLabel: 'Biên bản hủy mẫu thức ăn lưu đúng chuẩn',
    icon: Layers,
    category: 'vsattp',
  },

  // Nhóm 2: Giáo Dục & Quản Lý Trẻ
  {
    id: 'students',
    label: 'Học sinh & Điểm danh',
    subLabel: 'Danh sách lớp, dị ứng & điểm danh ngày',
    icon: Users,
    category: 'education',
  },
  {
    id: 'health',
    label: 'Sức khỏe & Kênh dinh dưỡng',
    subLabel: 'Theo dõi chiều cao, cân nặng & tiêm chủng',
    icon: HeartPulse,
    category: 'education',
  },
  {
    id: 'lessonPlans',
    label: 'Kế hoạch giáo dục & Giáo án',
    subLabel: 'Giáo án tuần chuẩn STEAM 5E Bộ GD&ĐT',
    icon: BookOpen,
    category: 'education',
  },

  // Nhóm 3: Quản Trị & Tài Chính
  {
    id: 'finance',
    label: 'Thu Chi & Bảng Tính Lương',
    subLabel: 'Dòng tiền quỹ, học phí & lương giáo viên',
    icon: DollarSign,
    category: 'management',
  },
  {
    id: 'staff',
    label: 'Cán bộ, Giáo viên & Cấp dưỡng',
    subLabel: 'Hồ sơ nhân sự, chứng nhận ATTP & KSK',
    icon: Briefcase,
    category: 'management',
  },
  {
    id: 'history',
    label: 'Lịch sử thao tác (Audit Log)',
    subLabel: 'Nhật ký thêm, sửa, xóa & khôi phục',
    icon: History,
    category: 'management',
  },
  {
    id: 'settings',
    label: 'Cấu hình trường & Chữ ký số',
    subLabel: 'Ban giám hiệu, y tế, kế toán & chữ ký',
    icon: Settings,
    category: 'management',
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
  const groups = [
    { key: 'vsattp', title: 'HỒ SƠ KIỂM THỰC & BÁN TRÚ' },
    { key: 'education', title: 'GIÁO DỤC & HỌC SINH' },
    { key: 'management', title: 'QUẢN TRỊ & TÀI CHÍNH' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Modern SaaS Dark Minimalist Sidebar with Rich Royal Oceanic Blue */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 h-screen bg-[#0a1e3f] text-slate-100 flex flex-col border-r border-blue-900/60 shadow-2xl transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 w-72 sm:w-80' : '-translate-x-full'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72 xl:w-80'}`}
      >
        {/* Top Header inside Sidebar */}
        <div
          className={`h-16 shrink-0 border-b border-blue-900/60 bg-[#071630] flex items-center transition-all duration-300 ${
            isCollapsed ? 'justify-center px-2' : 'px-4 justify-between'
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Mở rộng thanh điều hướng"
              className="w-10 h-10 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 flex items-center justify-center transition-colors cursor-pointer border border-blue-700/50"
            >
              <School className="w-5 h-5 text-blue-300" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0 border border-blue-300/40">
                  <School className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs uppercase font-black tracking-wider text-white">
                      Mầm Non ERP
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200/80 truncate">Hồ sơ dinh dưỡng &amp; CSGD</p>
                </div>
              </div>

              {/* Close Button on Mobile */}
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-blue-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Categorized Navigation List */}
        <nav
          className={`flex-1 overflow-y-auto custom-scrollbar transition-all duration-300 ${
            isCollapsed ? 'p-2 space-y-2' : 'p-3 space-y-4'
          }`}
        >
          {isCollapsed ? (
            // Collapsed Icon-Only Mode
            <div className="space-y-1.5">
              {MODULE_ITEMS.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeModuleId === item.id;
                const count = counts[item.id] || 0;

                return (
                  <div key={item.id} className="relative group flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectModule(item.id);
                        onCloseMobile();
                      }}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center relative transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />

                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-700 text-slate-200 border border-slate-600 text-[9px] font-mono font-bold flex items-center justify-center">
                          {count > 99 ? '99+' : count}
                        </span>
                      )}
                    </button>

                    {/* Floating Tooltip */}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none">
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-2xl border border-slate-700 whitespace-nowrap min-w-[200px]">
                        <div className="font-bold text-xs text-white mb-0.5">
                          {index + 1}. {item.label}
                        </div>
                        <p className="text-[11px] text-slate-400">{item.subLabel}</p>
                        <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10.5px] text-slate-400">
                          <span>Dữ liệu:</span>
                          <span className="font-mono font-bold text-blue-400">
                            {count} bản ghi
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Expanded Mode with Group Categories
            groups.map((group) => {
              const groupItems = MODULE_ITEMS.filter((item) => item.category === group.key);

              return (
                <div key={group.key} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-300/60">
                    {group.title}
                  </div>

                  <div className="space-y-0.5">
                    {groupItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeModuleId === item.id;
                      const count = counts[item.id] || 0;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onSelectModule(item.id);
                            onCloseMobile();
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-2.5 group relative cursor-pointer select-none ${
                            isActive
                              ? 'bg-blue-600 text-white font-bold shadow-md border border-blue-400/40 ring-1 ring-blue-300/50'
                              : 'text-blue-100/80 hover:bg-blue-900/60 hover:text-white'
                          }`}
                        >
                          {/* Active Indicator Line */}
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-white" />
                          )}

                          {/* Icon Container */}
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? 'bg-white/20 text-white border border-white/30'
                                : 'bg-blue-950/70 text-blue-300 group-hover:text-white group-hover:bg-blue-800/80 border border-blue-800/40'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Title & SubLabel */}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs leading-snug font-semibold truncate text-blue-50 group-hover:text-white">
                              {item.label}
                            </div>
                          </div>

                          {/* Count Badge */}
                          {count > 0 && (
                            <span
                              className={`text-[10.5px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 transition-colors ${
                                isActive
                                  ? 'bg-blue-900 text-white border border-blue-400/60'
                                  : 'bg-blue-950/90 text-blue-300 group-hover:text-white'
                              }`}
                            >
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </nav>

        {/* Footer info in Sidebar */}
        <div
          className={`border-t border-blue-900/60 bg-[#071630] text-xs transition-all duration-300 ${
            isCollapsed ? 'p-2 flex flex-col items-center' : 'p-3 flex items-center justify-between'
          }`}
        >
          {isCollapsed ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Mở rộng thanh bên"
              className="w-10 h-10 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-blue-800/60"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-300 flex items-center justify-center shrink-0 border border-blue-400/40">
                  <ShieldCheck className="w-4 h-4 text-blue-300" />
                </div>
                <div className="leading-tight truncate">
                  <span className="font-bold text-white block text-[11px]">QĐ 1246/QĐ-BYT</span>
                  <span className="text-[10px] text-blue-300/80">Chuẩn hóa biểu mẫu BGD&amp;ĐT</span>
                </div>
              </div>

              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  title="Thu gọn thanh bên"
                  className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900/60 transition-colors cursor-pointer"
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
