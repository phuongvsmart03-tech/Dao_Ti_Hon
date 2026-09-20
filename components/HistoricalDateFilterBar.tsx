'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Copy,
  Plus,
  Filter,
  Check,
  RotateCcw,
  Layers,
  History,
} from 'lucide-react';

export type TimeFilterMode =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'customDate'
  | 'customRange';

export interface DateItemSummary {
  date: string; // YYYY-MM-DD
  count: number;
  label?: string;
}

interface HistoricalDateFilterBarProps {
  filterMode: TimeFilterMode;
  onFilterModeChange: (mode: TimeFilterMode) => void;
  selectedDate: string; // YYYY-MM-DD
  onSelectedDateChange: (date: string) => void;
  startDate?: string;
  endDate?: string;
  onDateRangeChange?: (start: string, end: string) => void;
  availableDates: DateItemSummary[]; // List of dates that actually have data
  totalRecordsCount: number;
  filteredRecordsCount: number;
  moduleName?: string;
  onAddForDate?: (targetDate: string) => void;
  onCloneDateData?: (sourceDate: string, targetDate: string) => void;
  onSeedHistoricalData?: () => void;
}

export default function HistoricalDateFilterBar({
  filterMode,
  onFilterModeChange,
  selectedDate,
  onSelectedDateChange,
  startDate = '',
  endDate = '',
  onDateRangeChange,
  availableDates,
  totalRecordsCount,
  filteredRecordsCount,
  moduleName = 'hồ sơ',
  onAddForDate,
  onCloneDateData,
  onSeedHistoricalData,
}: HistoricalDateFilterBarProps) {
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [cloneSourceDate, setCloneSourceDate] = useState(selectedDate || (availableDates[0]?.date ?? ''));
  const [cloneTargetDate, setCloneTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [cloneSuccessMsg, setCloneSuccessMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleApplyClone = () => {
    if (!cloneSourceDate || !cloneTargetDate) return;
    if (cloneSourceDate === cloneTargetDate) {
      alert('Vui lòng chọn ngày đích khác ngày nguồn!');
      return;
    }
    if (onCloneDateData) {
      onCloneDateData(cloneSourceDate, cloneTargetDate);
      setCloneSuccessMsg(`Đã nhân bản thành công sang ngày ${cloneTargetDate}!`);
      setTimeout(() => {
        setCloneSuccessMsg('');
        setIsCloneModalOpen(false);
      }, 1500);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getDayOfWeekShort = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[d.getDay()] || '';
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 via-emerald-50/40 to-teal-50/40 rounded-2xl border border-emerald-200/80 p-3 sm:p-4 shadow-xs space-y-3">
      {/* Top row: Title + Quick Presets + Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Historical Navigator Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                Lịch sử dữ liệu theo Thời gian
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {filteredRecordsCount} / {totalRecordsCount} {moduleName}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Chọn ngày/tuần/tháng trong quá khứ để tra cứu, chỉnh sửa hoặc nhân bản
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Clone, Add for Date, Seed) */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          {onCloneDateData && availableDates.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setCloneSourceDate(selectedDate || availableDates[0]?.date || todayStr);
                setIsCloneModalOpen(true);
              }}
              title="Sao chép toàn bộ bản ghi của ngày đã chọn sang một ngày khác"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Nhân bản sang ngày khác</span>
            </button>
          )}

          {onAddForDate && (
            <button
              type="button"
              onClick={() => onAddForDate(selectedDate || todayStr)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm bản ghi cho {selectedDate ? formatDateDisplay(selectedDate) : 'hôm nay'}</span>
            </button>
          )}

          {onSeedHistoricalData && (
            <button
              type="button"
              onClick={onSeedHistoricalData}
              title="Tự động khởi tạo dữ liệu mẫu cho tuần qua / tháng qua để xem thử"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Tạo mẫu 7 ngày qua</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset filter mode buttons */}
      <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => onFilterModeChange('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterMode === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Toàn bộ lịch sử ({totalRecordsCount})
        </button>

        <button
          type="button"
          onClick={() => {
            onFilterModeChange('today');
            onSelectedDateChange(todayStr);
          }}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
            filterMode === 'today'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Clock className="w-3 h-3" />
          Hôm nay
        </button>

        <button
          type="button"
          onClick={() => {
            onFilterModeChange('yesterday');
            const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            onSelectedDateChange(yest);
          }}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterMode === 'yesterday'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Hôm qua
        </button>

        <button
          type="button"
          onClick={() => onFilterModeChange('thisWeek')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
            filterMode === 'thisWeek'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <CalendarDays className="w-3 h-3" />
          Tuần này
        </button>

        <button
          type="button"
          onClick={() => onFilterModeChange('lastWeek')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterMode === 'lastWeek'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Tuần trước
        </button>

        <button
          type="button"
          onClick={() => onFilterModeChange('thisMonth')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
            filterMode === 'thisMonth'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Calendar className="w-3 h-3" />
          Tháng này
        </button>

        <button
          type="button"
          onClick={() => onFilterModeChange('lastMonth')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
            filterMode === 'lastMonth'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Tháng trước
        </button>

        <button
          type="button"
          onClick={() => onFilterModeChange('customDate')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
            filterMode === 'customDate'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Calendar className="w-3 h-3" />
          Chọn ngày cụ thể
        </button>

        <button
          type="button"
          onClick={() => onFilterModeChange('customRange')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
            filterMode === 'customRange'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <CalendarRange className="w-3 h-3" />
          Khoảng ngày
        </button>
      </div>

      {/* Sub-inputs when Custom Date or Custom Range is selected */}
      {filterMode === 'customDate' && (
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-300">
          <label className="text-xs font-bold text-slate-700 shrink-0">Chọn ngày xem hồ sơ:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectedDateChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/40"
          />
          {selectedDate && (
            <span className="text-xs text-emerald-800 font-medium">
              Đang xem hồ sơ ngày: <strong className="font-bold">{formatDateDisplay(selectedDate)}</strong> (
              {getDayOfWeekShort(selectedDate)})
            </span>
          )}
        </div>
      )}

      {filterMode === 'customRange' && onDateRangeChange && (
        <div className="flex items-center gap-2.5 flex-wrap bg-white p-2.5 rounded-xl border border-emerald-300 text-xs">
          <span className="font-bold text-slate-700">Từ ngày:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onDateRangeChange(e.target.value, endDate)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <span className="font-bold text-slate-700">Đến ngày:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onDateRangeChange(startDate, e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Recorded Dates Timeline / Chip Bar */}
      {availableDates.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-emerald-200/60">
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span className="font-semibold text-emerald-900 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              Các ngày đã có dữ liệu trong hệ thống ({availableDates.length} ngày):
            </span>
            <span className="text-slate-500 italic">Nhấn vào ngày bất kỳ để xem & chỉnh sửa</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {availableDates.map((item) => {
              const isSelected = filterMode === 'customDate' && selectedDate === item.date;
              const isToday = item.date === todayStr;

              return (
                <button
                  key={item.date}
                  type="button"
                  onClick={() => {
                    onFilterModeChange('customDate');
                    onSelectedDateChange(item.date);
                  }}
                  title={`Xem hồ sơ ngày ${item.date} (${item.count} bản ghi)`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs shrink-0 transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-emerald-800 text-white font-bold ring-2 ring-emerald-500 shadow-xs'
                      : 'bg-white hover:bg-emerald-100/70 text-slate-700 border border-emerald-200/80'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-emerald-600">
                    {getDayOfWeekShort(item.date)}
                  </span>
                  <span>{formatDateDisplay(item.date)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {item.count}
                  </span>
                  {isToday && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Hôm nay" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Clone Records to Another Date */}
      {isCloneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Nhân bản dữ liệu sang ngày khác</h3>
                  <p className="text-xs text-slate-500">Sao chép nhanh hồ sơ của một ngày đã có sang ngày mới</p>
                </div>
              </div>
            </div>

            {cloneSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-emerald-900 text-sm">{cloneSuccessMsg}</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">1. Ngày nguồn (Ngày đang có dữ liệu):</label>
                  <select
                    value={cloneSourceDate}
                    onChange={(e) => setCloneSourceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    {availableDates.map((d) => (
                      <option key={d.date} value={d.date}>
                        {formatDateDisplay(d.date)} ({getDayOfWeekShort(d.date)}) - {d.count} bản ghi
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">2. Ngày đích (Ngày muốn sao chép đến):</label>
                  <input
                    type="date"
                    value={cloneTargetDate}
                    onChange={(e) => setCloneTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-emerald-50/50"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Toàn bộ danh mục món ăn, thực phẩm, người ký của ngày nguồn sẽ được nhân bản sang ngày này với mã ID mới.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCloneModalOpen(false)}
                    className="px-3.5 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyClone}
                    className="px-4 py-2 rounded-lg font-bold bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer shadow-xs"
                  >
                    Thực hiện nhân bản
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
