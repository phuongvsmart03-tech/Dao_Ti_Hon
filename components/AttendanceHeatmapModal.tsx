'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Save,
  Trash2,
  RotateCcw,
  Search,
  Filter,
  Users,
  Check,
  XCircle,
  HelpCircle,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
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
  const [selectedDay, setSelectedDay] = useState<number | null>(14);

  // Mở trình chỉnh sửa chi tiết ngày đang chọn
  const [isDayEditorOpen, setIsDayEditorOpen] = useState(false);

  // Thông báo phản hồi ngắn
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Xác nhận xóa trắng
  const [clearConfirmScope, setClearConfirmScope] = useState<'day' | 'week' | 'month' | null>(null);

  // Bộ nhớ tùy chỉnh số lượng theo ngày: key = YYYY-MM-DD
  const [customAttendance, setCustomAttendance] = useState<
    Record<string, { present: number; absent: number; note: string; cleared?: boolean }>
  >(() => {
    const defaultPresent = Math.round(students.length * 0.92) || 145;
    const defaultAbsent = Math.max(0, students.length - defaultPresent) || 12;
    return {
      '2026-05-15': { present: defaultPresent, absent: defaultAbsent, note: 'Đi học đều, thời tiết mát mẻ' },
      '2026-05-16': { present: defaultPresent + 2, absent: Math.max(0, defaultAbsent - 2), note: 'Đủ sĩ số' },
    };
  });

  // Lưu trạng thái điểm danh chi tiết từng học sinh theo ngày: [dateKey][studentId] = status
  const [dailyStudentStatuses, setDailyStudentStatuses] = useState<
    Record<string, Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'>>
  >({});

  // Dữ liệu chỉnh sửa tạm của ngày được chọn
  const [editPresent, setEditPresent] = useState<number>(Math.max(1, students.length - 8));
  const [editAbsent, setEditAbsent] = useState<number>(8);
  const [editNote, setEditNote] = useState<string>('Đi học đều, kiểm tra hồ sơ đạt');

  // Bộ lọc bên trong bảng danh sách học sinh
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Thứ 2 = 0

  const getDateKey = (day: number) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Khi bấm vào 1 ngày bất kỳ: chọn ngày và MỞ NGAY TRÌNH SỬA CHI TIẾT
  const handleSelectDay = (day: number, openEditor = true) => {
    setSelectedDay(day);
    const dateKey = getDateKey(day);
    const custom = customAttendance[dateKey];

    if (custom) {
      setEditPresent(custom.present);
      setEditAbsent(custom.absent);
      setEditNote(custom.note || '');
    } else {
      const basePresent = Math.max(1, students.length - 8);
      setEditPresent(basePresent);
      setEditAbsent(8);
      setEditNote('Đi học bình thường');
    }

    // Khởi tạo map điểm danh học sinh cho ngày này nếu chưa có
    setDailyStudentStatuses((prev) => {
      if (prev[dateKey]) return prev;
      const initialMap: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'> = {};
      students.forEach((s) => {
        initialMap[s.id] = s.attendanceStatus || 'Có mặt';
      });
      return { ...prev, [dateKey]: initialMap };
    });

    if (openEditor) {
      setIsDayEditorOpen(true);
    }
  };

  // Lưu sĩ số & danh sách ngày đang chọn
  const handleSaveCurrentDay = () => {
    if (!selectedDay) return;
    const dateKey = getDateKey(selectedDay);

    setCustomAttendance((prev) => ({
      ...prev,
      [dateKey]: {
        present: editPresent,
        absent: editAbsent,
        note: editNote,
        cleared: editPresent === 0,
      },
    }));

    onUpdateAttendanceCount(dateKey, editPresent, editAbsent);
    showToast(`Đã lưu sĩ số ngày ${selectedDay}/${currentMonth + 1}/${currentYear} thành công!`);
    setIsDayEditorOpen(false);
  };

  // Đổi trạng thái 1 học sinh trong ngày đang chọn
  const handleToggleStudent = (studentId: string, status: 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép') => {
    if (!selectedDay) return;
    const dateKey = getDateKey(selectedDay);

    setDailyStudentStatuses((prev) => {
      const dayMap = { ...(prev[dateKey] || {}) };
      dayMap[studentId] = status;

      // Tính lại tổng số có mặt & vắng
      let present = 0;
      let absent = 0;
      students.forEach((s) => {
        const st = s.id === studentId ? status : dayMap[s.id] || 'Có mặt';
        if (st === 'Có mặt') present++;
        else absent++;
      });

      setEditPresent(present);
      setEditAbsent(absent);

      return {
        ...prev,
        [dateKey]: dayMap,
      };
    });
  };

  // Đánh dấu tất cả có mặt
  const handleMarkAllPresent = () => {
    if (!selectedDay) return;
    const dateKey = getDateKey(selectedDay);
    const dayMap: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'> = {};
    students.forEach((s) => {
      dayMap[s.id] = 'Có mặt';
    });
    setDailyStudentStatuses((prev) => ({ ...prev, [dateKey]: dayMap }));
    setEditPresent(students.length);
    setEditAbsent(0);
    showToast(`Đã đánh dấu toàn bộ ${students.length} học sinh có mặt!`);
  };

  // Đánh dấu tất cả nghỉ
  const handleMarkAllAbsent = () => {
    if (!selectedDay) return;
    const dateKey = getDateKey(selectedDay);
    const dayMap: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'> = {};
    students.forEach((s) => {
      dayMap[s.id] = 'Nghỉ có phép';
    });
    setDailyStudentStatuses((prev) => ({ ...prev, [dateKey]: dayMap }));
    setEditPresent(0);
    setEditAbsent(students.length);
    showToast(`Đã đánh dấu tất cả học sinh nghỉ ngày này!`);
  };

  // XÓA TRẮNG THEO NGÀY
  const handleClearDay = (day: number) => {
    const dateKey = getDateKey(day);
    setCustomAttendance((prev) => ({
      ...prev,
      [dateKey]: {
        present: 0,
        absent: students.length,
        note: 'Đã xóa trắng (0 bé)',
        cleared: true,
      },
    }));
    // Đặt danh sách học sinh đều nghỉ
    const dayMap: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'> = {};
    students.forEach((s) => {
      dayMap[s.id] = 'Nghỉ có phép';
    });
    setDailyStudentStatuses((prev) => ({ ...prev, [dateKey]: dayMap }));
    setEditPresent(0);
    setEditAbsent(students.length);
    onUpdateAttendanceCount(dateKey, 0, students.length);
    showToast(`Đã xóa trắng sĩ số ngày ${day}/${currentMonth + 1}/${currentYear} (về 0 bé)`);
  };

  // XÓA TRẮNG THEO TUẦN (7 ngày trong tuần chứa ngày đang chọn)
  const handleClearWeek = (referenceDay: number) => {
    const refDate = new Date(currentYear, currentMonth, referenceDay);
    const dayOfWeek = refDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayDate = new Date(refDate);
    mondayDate.setDate(refDate.getDate() + diffToMonday);

    setCustomAttendance((prev) => {
      const next = { ...prev };
      for (let i = 0; i < 7; i++) {
        const d = new Date(mondayDate);
        d.setDate(mondayDate.getDate() + i);
        if (d.getMonth() === currentMonth) {
          const dateKey = getDateKey(d.getDate());
          next[dateKey] = {
            present: 0,
            absent: students.length,
            note: 'Đã xóa trắng tuần',
            cleared: true,
          };
          onUpdateAttendanceCount(dateKey, 0, students.length);
        }
      }
      return next;
    });

    setEditPresent(0);
    setEditAbsent(students.length);
    showToast(`Đã xóa trắng toàn bộ các ngày trong tuần này!`);
    setClearConfirmScope(null);
  };

  // XÓA TRẮNG CẢ THÁNG
  const handleClearMonth = () => {
    setCustomAttendance((prev) => {
      const next = { ...prev };
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = getDateKey(day);
        next[dateKey] = {
          present: 0,
          absent: students.length,
          note: 'Đã xóa trắng cả tháng',
          cleared: true,
        };
        onUpdateAttendanceCount(dateKey, 0, students.length);
      }
      return next;
    });

    setEditPresent(0);
    setEditAbsent(students.length);
    showToast(`Đã xóa trắng sĩ số tất cả các ngày trong Tháng ${currentMonth + 1}/${currentYear}!`);
    setClearConfirmScope(null);
  };

  // KHÔI PHỤC MẶC ĐỊNH
  const handleRestoreDefaults = () => {
    setCustomAttendance({});
    setDailyStudentStatuses({});
    const basePresent = Math.round(students.length * 0.92) || 145;
    setEditPresent(basePresent);
    setEditAbsent(Math.max(0, students.length - basePresent));
    showToast('Đã khôi phục toàn bộ sĩ số về mặc định!');
    setClearConfirmScope(null);
  };

  // Lấy trạng thái của từng ô ngày trên Heatmap
  const getDayStatus = (day: number) => {
    const d = new Date(currentYear, currentMonth, day);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { isWeekend: true, label: 'Nghỉ', color: 'bg-slate-50 text-slate-400 border-slate-200' };
    }

    const dateKey = getDateKey(day);
    const custom = customAttendance[dateKey];

    if (custom && custom.cleared) {
      return {
        isWeekend: false,
        label: '0%',
        color: 'bg-rose-50/70 text-rose-800 border-rose-200',
        rate: 0,
        isCleared: true,
      };
    }

    const present = custom ? custom.present : Math.max(1, students.length - 8);
    const total = students.length || 150;
    const rate = (present / total) * 100;

    if (rate >= 95) return { isWeekend: false, label: `${Math.round(rate)}%`, color: 'bg-emerald-50 text-emerald-900 border-emerald-200', rate };
    if (rate >= 90) return { isWeekend: false, label: `${Math.round(rate)}%`, color: 'bg-teal-50 text-teal-900 border-teal-200', rate };
    if (rate >= 80) return { isWeekend: false, label: `${Math.round(rate)}%`, color: 'bg-amber-50/60 text-amber-900 border-amber-200', rate };
    return { isWeekend: false, label: `${Math.round(rate)}%`, color: 'bg-rose-50 text-rose-900 border-rose-200', rate };
  };

  // Danh sách các lớp học
  const classList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.className));
    return Array.from(set).sort();
  }, [students]);

  // Danh sách học sinh theo bộ lọc bên trong editor
  const currentDayStudentMap = selectedDay ? dailyStudentStatuses[getDateKey(selectedDay)] || {} : {};
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase();
        const matches =
          s.fullName.toLowerCase().includes(q) ||
          s.studentCode.toLowerCase().includes(q) ||
          s.parentName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedClass !== 'all' && s.className !== selectedClass) return false;
      const status = currentDayStudentMap[s.id] || 'Có mặt';
      if (selectedStatusFilter !== 'all' && status !== selectedStatusFilter) return false;
      return true;
    });
  }, [students, studentSearch, selectedClass, selectedStatusFilter, currentDayStudentMap]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {toastMessage}
            </span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-white hover:opacity-80 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header Modal */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>Lịch Theo Dõi Điểm Danh &amp; Chuyên Cần</span>
                <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  Tháng {currentMonth + 1} / {currentYear}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Bấm vào ngày bất kỳ để sửa danh sách chuyên cần hoặc sử dụng biểu tượng xóa trắng nhanh.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thanh điều khiển Tháng/Năm & NÚT XÓA TRẮNG THEO NGÀY, TUẦN, THÁNG */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Controls tháng/năm */}
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
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-extrabold text-sm sm:text-base text-slate-800 px-2">
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
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 cursor-pointer"
              title="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setCurrentMonth(now.getMonth());
                setCurrentYear(now.getFullYear());
                handleSelectDay(now.getDate(), false);
              }}
              className="text-xs font-bold px-2 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 cursor-pointer transition-colors"
            >
              Hôm nay
            </button>
          </div>

          {/* NHÓM NÚT XÓA TRẮNG TUẦN, THÁNG, KHÔI PHỤC */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Xóa Trắng:
            </span>

            {selectedDay && (
              <button
                type="button"
                onClick={() => handleClearDay(selectedDay)}
                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100/90 hover:bg-rose-200 text-rose-800 border border-rose-300 cursor-pointer transition-colors flex items-center gap-1"
                title={`Xóa trắng riêng ngày ${selectedDay} (về 0)`}
              >
                <span>Ngày {selectedDay}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setClearConfirmScope('week')}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100/90 hover:bg-rose-200 text-rose-800 border border-rose-300 cursor-pointer transition-colors"
              title="Xóa trắng toàn bộ tuần này"
            >
              Theo Tuần
            </button>

            <button
              type="button"
              onClick={() => setClearConfirmScope('month')}
              className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100/90 hover:bg-rose-200 text-rose-800 border border-rose-300 cursor-pointer transition-colors"
              title="Xóa trắng tất cả các ngày trong tháng này"
            >
              Cả Tháng
            </button>

            <button
              type="button"
              onClick={handleRestoreDefaults}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer transition-colors flex items-center gap-1"
              title="Khôi phục lại tất cả dữ liệu về mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>
          </div>
        </div>

        {/* Chú giải tỷ lệ chuyên cần */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-slate-700">Tỷ lệ chuyên cần:</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> &ge;95%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> 90-94%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 80-89%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> &lt;80%
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Đã xóa trắng (0 bé)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"></span> Cuối tuần
            </span>
          </div>

          <div className="text-slate-500 font-medium text-[11px]">
            Bấm vào ngày để sửa hoặc dùng biểu tượng sửa/xóa nhanh trên từng ô
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-7 gap-2">
            {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'].map((w, idx) => (
              <div key={idx} className="text-center font-bold text-xs text-slate-700 py-1.5 bg-slate-100 rounded-md">
                {w}
              </div>
            ))}

            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-20 rounded-xl border border-transparent" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const status = getDayStatus(day);
              const isSelected = selectedDay === day;
              const dateKey = getDateKey(day);
              const custom = customAttendance[dateKey];
              const present = custom ? custom.present : Math.max(1, students.length - 8);
              const absent = custom ? custom.absent : 8;

              return (
                <div
                  key={day}
                  onClick={() => handleSelectDay(day, true)}
                  className={`h-22 p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all relative group ${
                    status.color
                  } ${
                    isSelected
                      ? 'ring-3 ring-emerald-600 shadow-md font-bold'
                      : 'hover:shadow-md hover:border-emerald-400'
                  }`}
                  title={`Bấm để mở bảng sửa danh sách điểm danh ngày ${day}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">{day}</span>
                    {!status.isWeekend && (
                      <span className="text-[10px] font-bold text-slate-600">{status.label}</span>
                    )}
                  </div>

                  {!status.isWeekend ? (
                    <div className="text-[10px] space-y-0.5">
                      {status.isCleared ? (
                        <div className="text-rose-700 font-bold">0 bé (Xóa trắng)</div>
                      ) : (
                        <>
                          <div className="text-slate-800 font-bold">Có mặt: {present}</div>
                          <div className="text-slate-500 font-medium">Vắng: {absent}</div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic">Nghỉ</div>
                  )}

                  {/* NÚT THAO TÁC NHANH TRÊN Ô NGÀY: SỬA & DẤU XÓA - CHỈ BIỂU TƯỢNG */}
                  {!status.isWeekend && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 mt-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDay(day, true);
                        }}
                        className="p-1 rounded bg-white/90 hover:bg-emerald-600 hover:text-white text-slate-600 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                        title="Sửa danh sách ngày này"
                        aria-label="Sửa"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearDay(day);
                        }}
                        className="p-1 rounded bg-white/90 hover:bg-rose-600 hover:text-white text-slate-600 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                        title="Xóa trắng ngày này về 0"
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL / DRAWER CHỈNH SỬA CHI TIẾT DANH SÁCH HỌC SINH CỦA NGÀY ĐANG CHỌN */}
        {isDayEditorOpen && selectedDay && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header Editor */}
              <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base flex items-center gap-2">
                      <span>
                        Sửa Chữa Danh Sách Điểm Danh Ngày {selectedDay}/{currentMonth + 1}/{currentYear}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {students.length} học sinh
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Chỉnh sửa trực tiếp từng bé có mặt/nghỉ hoặc dùng các nút thao tác hàng loạt và xóa trắng.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDayEditorOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Thanh thống kê & thao tác nhanh */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 shrink-0">
                <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-emerald-800 block">Số trẻ Có mặt:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      max={students.length}
                      value={editPresent}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setEditPresent(val);
                        setEditAbsent(Math.max(0, students.length - val));
                      }}
                      className="w-20 text-sm font-extrabold text-emerald-900 border border-emerald-300 rounded-lg px-2 py-1 bg-emerald-50/50 focus:bg-white"
                    />
                    <span className="text-xs text-slate-500 font-medium">/ {students.length} bé</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-rose-800 block">Số trẻ Vắng mặt:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="number"
                      min="0"
                      max={students.length}
                      value={editAbsent}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setEditAbsent(val);
                        setEditPresent(Math.max(0, students.length - val));
                      }}
                      className="w-20 text-sm font-extrabold text-rose-900 border border-rose-300 rounded-lg px-2 py-1 bg-rose-50/50 focus:bg-white"
                    />
                    <span className="text-xs text-slate-500 font-medium">bé vắng</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-700 block">Ghi chú ngày này:</span>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="VD: Đi học đều, thời tiết tốt"
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 mt-1 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* NÚT THAO TÁC NHANH VÀ DẤU XÓA */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-700 block">Thao tác nhanh &amp; Xóa:</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      type="button"
                      onClick={handleMarkAllPresent}
                      className="flex-1 text-[10.5px] font-bold py-1 px-1 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer text-center"
                      title="Đánh dấu tất cả có mặt"
                    >
                      Tất cả có mặt
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClearDay(selectedDay)}
                      className="flex-1 text-[10.5px] font-bold py-1 px-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white cursor-pointer text-center flex items-center justify-center gap-1"
                      title="Xóa trắng ngày này (về 0 bé)"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Xóa trắng</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bộ lọc học sinh */}
              <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Tìm theo tên học sinh, mã HS, phụ huynh..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                  >
                    <option value="all">Tất cả lớp ({students.length})</option>
                    {classList.map((c) => (
                      <option key={c} value={c}>
                        Lớp {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="Có mặt">Chỉ Có mặt</option>
                    <option value="Nghỉ có phép">Nghỉ có phép</option>
                    <option value="Nghỉ không phép">Nghỉ không phép</option>
                  </select>
                </div>
              </div>

              {/* Bảng Danh sách Học sinh */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  <table className="w-full text-xs text-left text-slate-700 border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10.5px] border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="p-2.5 w-10 text-center">STT</th>
                        <th className="p-2.5 w-24">Mã HS</th>
                        <th className="p-2.5 min-w-[160px]">Họ và tên học sinh</th>
                        <th className="p-2.5 w-28">Lớp học</th>
                        <th className="p-2.5 min-w-[140px]">Phụ huynh &amp; SĐT</th>
                        <th className="p-2.5 min-w-[180px] text-center">
                          Điểm danh ngày {selectedDay}/{currentMonth + 1}
                        </th>
                        <th className="p-2.5 min-w-[140px]">Ghi chú ăn kiêng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                            Không tìm thấy học sinh nào phù hợp.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student, idx) => {
                          const status = currentDayStudentMap[student.id] || 'Có mặt';
                          return (
                            <tr
                              key={student.id}
                              className={`hover:bg-slate-50 transition-colors ${
                                status !== 'Có mặt' ? 'bg-rose-50/30' : ''
                              }`}
                            >
                              <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                              <td className="p-2.5 font-mono font-semibold text-slate-600">{student.studentCode}</td>
                              <td className="p-2.5 font-bold text-slate-900">{student.fullName}</td>
                              <td className="p-2.5">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                  {student.className}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-600">
                                <div className="font-medium">{student.parentName}</div>
                                <div className="text-[10px] font-mono text-slate-400">{student.parentPhone}</div>
                              </td>
                              <td className="p-2.5 text-center">
                                <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStudent(student.id, 'Có mặt')}
                                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                      status === 'Có mặt'
                                        ? 'bg-emerald-600 text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                                    }`}
                                  >
                                    Có mặt
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStudent(student.id, 'Nghỉ có phép')}
                                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                      status === 'Nghỉ có phép'
                                        ? 'bg-amber-500 text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                                    }`}
                                  >
                                    Phép
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStudent(student.id, 'Nghỉ không phép')}
                                    className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                      status === 'Nghỉ không phép'
                                        ? 'bg-rose-600 text-white shadow-2xs'
                                        : 'text-slate-600 hover:text-rose-700 hover:bg-rose-50'
                                    }`}
                                  >
                                    K.Phép
                                  </button>
                                </div>
                              </td>
                              <td className="p-2.5 text-slate-500">
                                {student.allergiesOrDiet && student.allergiesOrDiet !== 'Không có dị ứng' ? (
                                  <span className="text-[10.5px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                    {student.allergiesOrDiet}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic">Bình thường</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Editor */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
                <div className="text-xs text-slate-600">
                  Sĩ số: <strong className="text-emerald-700">{editPresent} có mặt</strong> /{' '}
                  <strong className="text-rose-700">{editAbsent} vắng</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDayEditorOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCurrentDay}
                    className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Sĩ Số &amp; Điểm Danh Ngày Này</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL XÁC NHẬN XÓA TRẮNG TUẦN / THÁNG */}
        {clearConfirmScope && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-2.5 bg-rose-100 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Xác Nhận Xóa Trắng{' '}
                    {clearConfirmScope === 'week' ? 'Theo Tuần' : 'Theo Cả Tháng'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thao tác này sẽ đặt sĩ số toàn bộ các ngày đã chọn về 0.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p>
                  <strong>Phạm vi:</strong>{' '}
                  {clearConfirmScope === 'week'
                    ? `Toàn bộ các ngày trong tuần chứa ngày ${selectedDay || 1}`
                    : `Tất cả ${daysInMonth} ngày trong Tháng ${currentMonth + 1}/${currentYear}`}
                </p>
                <p className="text-[11px] text-amber-700">
                  💡 Bạn có thể bấm nút <strong>&quot;Khôi phục&quot;</strong> bất cứ lúc nào để lấy lại dữ liệu ban đầu.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setClearConfirmScope(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy thao tác
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (clearConfirmScope === 'week') {
                      handleClearWeek(selectedDay || 1);
                    } else if (clearConfirmScope === 'month') {
                      handleClearMonth();
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xác nhận Xóa Trắng</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
