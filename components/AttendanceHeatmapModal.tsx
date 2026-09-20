'use client';

import React, { useState } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Edit3, Save } from 'lucide-react';
import { StudentRecord } from '@/types/preschool';

interface AttendanceHeatmapModalProps {
  students: StudentRecord[];
  onClose: () => void;
  onUpdateAttendanceCount: (dateStr: string, presentCount: number, absentCount: number) => void;
}

export default function AttendanceHeatmapModal({
  students,
  onClose,
  onUpdateAttendanceCount,
}: AttendanceHeatmapModalProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); // Tháng 5 (0-indexed: 4)
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  // Lưu tùy chỉnh số lượng theo ngày: key = YYYY-MM-DD
  const [customAttendance, setCustomAttendance] = useState<Record<string, { present: number; absent: number; note: string }>>(() => {
    // Khởi tạo mặc định
    const defaultPresent = Math.round(students.length * 0.92) || 145;
    const defaultAbsent = Math.max(0, students.length - defaultPresent) || 12;
    return {
      '2026-05-15': { present: defaultPresent, absent: defaultAbsent, note: 'Đi học đều, thời tiết mát mẻ' },
      '2026-05-16': { present: defaultPresent + 2, absent: Math.max(0, defaultAbsent - 2), note: 'Đủ sĩ số' },
    };
  });

  const [editPresent, setEditPresent] = useState<number>(Math.round(students.length * 0.92) || 145);
  const [editAbsent, setEditAbsent] = useState<number>(Math.max(0, students.length - (Math.round(students.length * 0.92) || 145)) || 12);
  const [editNote, setEditNote] = useState<string>('Đi học đều, kiểm tra hồ sơ đạt');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Thứ 2 = 0

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (customAttendance[dateKey]) {
      setEditPresent(customAttendance[dateKey].present);
      setEditAbsent(customAttendance[dateKey].absent);
      setEditNote(customAttendance[dateKey].note || '');
    } else {
      const basePresent = Math.max(1, students.length - 8);
      setEditPresent(basePresent);
      setEditAbsent(8);
      setEditNote('Đi học bình thường');
    }
  };

  const handleSaveDay = () => {
    if (!selectedDay) return;
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    setCustomAttendance((prev) => ({
      ...prev,
      [dateKey]: {
        present: editPresent,
        absent: editAbsent,
        note: editNote,
      },
    }));
    onUpdateAttendanceCount(dateKey, editPresent, editAbsent);
  };

  const getDayStatus = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { isWeekend: true, emoji: '🏖️', color: 'bg-slate-100 text-slate-400' };
    }

    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const custom = customAttendance[dateKey];
    const present = custom ? custom.present : Math.max(1, students.length - 8);
    const total = students.length || 150;
    const rate = (present / total) * 100;

    if (rate >= 95) return { isWeekend: false, emoji: '🌟', color: 'bg-emerald-500/20 text-emerald-800 border-emerald-400/50', rate };
    if (rate >= 90) return { isWeekend: false, emoji: '😊', color: 'bg-green-500/20 text-green-800 border-green-400/40', rate };
    if (rate >= 80) return { isWeekend: false, emoji: '😐', color: 'bg-amber-500/20 text-amber-800 border-amber-400/40', rate };
    return { isWeekend: false, emoji: '🤒', color: 'bg-rose-500/20 text-rose-800 border-rose-400/40', rate };
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="font-bold text-lg">Heatmap Lịch Điểm Danh Sĩ Số Trẻ Toàn Trường</h3>
              <p className="text-xs text-emerald-100">
                Hiển thị tỷ lệ chuyên cần theo ngày, tuần, tháng bằng Emoji trực quan và cho phép sửa nhanh sĩ số để đồng bộ hồ sơ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls tháng/năm */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear((y) => y - 1);
                  } else {
                    setCurrentMonth((m) => m - 1);
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-base text-slate-800">
                Tháng {currentMonth + 1} / {currentYear}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear((y) => y + 1);
                  } else {
                    setCurrentMonth((m) => m + 1);
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Chú giải Emoji */}
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1">
                <span>🌟</span> &ge;95%
              </span>
              <span className="inline-flex items-center gap-1">
                <span>😊</span> 90-94%
              </span>
              <span className="inline-flex items-center gap-1">
                <span>😐</span> 80-89%
              </span>
              <span className="inline-flex items-center gap-1">
                <span>🤒</span> &lt;80%
              </span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <span>🏖️</span> Cuối tuần
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((w, idx) => (
              <div key={idx} className="text-center font-bold text-xs text-slate-600 py-1 bg-slate-100 rounded-md">
                {w}
              </div>
            ))}

            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 rounded-xl border border-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const status = getDayStatus(day);
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  onClick={() => handleSelectDay(day)}
                  className={`h-20 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    status.color
                  } ${isSelected ? 'ring-3 ring-emerald-600 shadow-md scale-102 font-bold' : 'hover:shadow-xs'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{day}</span>
                    <span className="text-sm">{status.emoji}</span>
                  </div>

                  {!status.isWeekend ? (
                    <div className="text-[10px] space-y-0.5">
                      <div className="text-emerald-900 font-semibold">
                        Có mặt: {customAttendance[`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`]?.present || Math.max(1, students.length - 8)}
                      </div>
                      <div className="text-slate-500">
                        Vắng: {customAttendance[`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`]?.absent || 8}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">Nghỉ</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Form Chỉnh sửa sĩ số cho ngày đang chọn */}
          {selectedDay && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-700" />
                  Chỉnh Sửa Sĩ Số Ngày {selectedDay}/{currentMonth + 1}/{currentYear}
                </span>
                <span className="text-xs text-slate-500">
                  Tổng danh sách: <strong>{students.length || 150} trẻ</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Số trẻ có mặt ăn bán trú:</label>
                  <input
                    type="number"
                    value={editPresent}
                    onChange={(e) => setEditPresent(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Số trẻ vắng mặt:</label>
                  <input
                    type="number"
                    value={editAbsent}
                    onChange={(e) => setEditAbsent(Number(e.target.value))}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú tình trạng:</label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="VD: Nghỉ ốm 2 bé, còn lại khỏe mạnh"
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-600 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveDay}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Sĩ Số Ngày Này</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
