'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  X,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Save,
  RotateCcw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Utensils,
  UserCheck,
  UserX,
  Sparkles,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { StudentRecord } from '@/types/preschool';
import { getDayInfo } from '@/components/modules/LightningModule';

interface DailyAttendanceModalProps {
  isOpen: boolean;
  initialDate: string;
  availableDates: string[];
  students: StudentRecord[];
  nurseryPrice: number;
  kindergartenPrice: number;
  defaultNurseryCount: number;
  defaultKindergartenCount: number;
  customCountsByDate: Record<string, { nurseryCount?: number; kindergartenCount?: number }>;
  onClose: () => void;
  onSaveAttendance: (
    dateStr: string,
    nurseryCount: number,
    kindergartenCount: number,
    studentStatusMap?: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'>
  ) => void;
  onClearDate: (dateStr: string) => void;
  onClearWeek: (referenceDateStr: string) => void;
  onClearMonth: (referenceDateStr: string) => void;
  onResetDate: (dateStr: string) => void;
}

export default function DailyAttendanceModal({
  isOpen,
  initialDate,
  availableDates,
  students,
  nurseryPrice,
  kindergartenPrice,
  defaultNurseryCount,
  defaultKindergartenCount,
  customCountsByDate,
  onClose,
  onSaveAttendance,
  onClearDate,
  onClearWeek,
  onClearMonth,
  onResetDate,
}: DailyAttendanceModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || new Date().toISOString().split('T')[0]);

  // Bộ nhớ tạm thời lưu điểm danh học sinh theo ngày: [dateStr][studentId] = status
  const [dailyAttendanceState, setDailyAttendanceState] = useState<
    Record<string, Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'>>
  >({});

  // Sĩ số Nhà trẻ & Mẫu giáo cho ngày đang chọn
  const [currentNurseryCount, setCurrentNurseryCount] = useState<number>(defaultNurseryCount);
  const [currentKindergartenCount, setCurrentKindergartenCount] = useState<number>(defaultKindergartenCount);

  // Bộ lọc danh sách học sinh
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'>('all');

  // Trạng thái modal xác nhận xóa trắng
  const [clearConfirmType, setClearConfirmType] = useState<'day' | 'week' | 'month' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hiển thị thông báo Toast ngắn
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cập nhật ngày khi initialDate thay đổi
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  // Khi chuyển sang 1 ngày khác: Khởi tạo dữ liệu điểm danh và số lượng
  useEffect(() => {
    if (!selectedDate) return;

    // 1. Kiểm tra xem ngày này đã có sĩ số tùy chỉnh trong customCountsByDate chưa
    const savedCounts = customCountsByDate[selectedDate];
    if (savedCounts) {
      if (savedCounts.nurseryCount !== undefined) setCurrentNurseryCount(savedCounts.nurseryCount);
      if (savedCounts.kindergartenCount !== undefined) setCurrentKindergartenCount(savedCounts.kindergartenCount);
    } else {
      // Dùng số mặc định
      setCurrentNurseryCount(defaultNurseryCount);
      setCurrentKindergartenCount(defaultKindergartenCount);
    }

    // 2. Kiểm tra xem ngày này đã có trạng thái chi tiết của từng bé chưa
    setDailyAttendanceState((prev) => {
      if (prev[selectedDate]) return prev;

      // Khởi tạo mặc định cho ngày này:
      // Mặc định tất cả các bé đều Có mặt
      const initialMap: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'> = {};
      students.forEach((s) => {
        initialMap[s.id] = s.attendanceStatus || 'Có mặt';
      });

      return {
        ...prev,
        [selectedDate]: initialMap,
      };
    });
  }, [selectedDate, customCountsByDate, defaultNurseryCount, defaultKindergartenCount, students]);

  if (!isOpen) return null;

  // Lấy trạng thái điểm danh hiện tại của ngày đang chọn
  const currentDayMap = dailyAttendanceState[selectedDate] || {};

  // Phân loại danh sách học sinh theo khối
  const isNurseryStudent = (s: StudentRecord) => {
    return s.className.toLowerCase().includes('nhà trẻ') || s.className.toLowerCase().includes('mầm');
  };

  // Tính toán số lượng bé có mặt theo danh sách thực tế
  const actualPresentCounts = useMemo(() => {
    let nt = 0;
    let kg = 0;
    students.forEach((s) => {
      const status = currentDayMap[s.id] || 'Có mặt';
      if (status === 'Có mặt') {
        if (isNurseryStudent(s)) {
          nt++;
        } else {
          kg++;
        }
      }
    });
    return { nt, kg, total: nt + kg };
  }, [students, currentDayMap]);

  // Danh sách các lớp học hiện có
  const classList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.className));
    return Array.from(set).sort();
  }, [students]);

  // Danh sách học sinh sau khi tìm kiếm và lọc
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Tìm kiếm theo tên hoặc mã định danh hoặc phụ huynh
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          s.fullName.toLowerCase().includes(q) ||
          s.studentCode.toLowerCase().includes(q) ||
          s.parentName.toLowerCase().includes(q) ||
          s.className.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Lọc theo lớp
      if (selectedClass !== 'all' && s.className !== selectedClass) {
        return false;
      }

      // Lọc theo trạng thái điểm danh
      const status = currentDayMap[s.id] || 'Có mặt';
      if (attendanceFilter !== 'all' && status !== attendanceFilter) {
        return false;
      }

      return true;
    });
  }, [students, searchTerm, selectedClass, attendanceFilter, currentDayMap]);

  // Đổi trạng thái 1 học sinh
  const handleToggleStudentStatus = (
    studentId: string,
    newStatus: 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'
  ) => {
    setDailyAttendanceState((prev) => {
      const prevDay = prev[selectedDate] || {};
      const updatedDay = {
        ...prevDay,
        [studentId]: newStatus,
      };

      // Tự động cập nhật lại sĩ số Nhà Trẻ & Mẫu Giáo theo số bé Có mặt
      let newNT = 0;
      let newKG = 0;
      students.forEach((s) => {
        const st = s.id === studentId ? newStatus : updatedDay[s.id] || 'Có mặt';
        if (st === 'Có mặt') {
          if (isNurseryStudent(s)) newNT++;
          else newKG++;
        }
      });
      setCurrentNurseryCount(newNT);
      setCurrentKindergartenCount(newKG);

      return {
        ...prev,
        [selectedDate]: updatedDay,
      };
    });
  };

  // Đánh dấu tất cả có mặt cho ngày này
  const handleMarkAllPresent = () => {
    const updatedDay: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'> = {};
    let nt = 0;
    let kg = 0;
    students.forEach((s) => {
      updatedDay[s.id] = 'Có mặt';
      if (isNurseryStudent(s)) nt++;
      else kg++;
    });

    setDailyAttendanceState((prev) => ({
      ...prev,
      [selectedDate]: updatedDay,
    }));
    setCurrentNurseryCount(nt);
    setCurrentKindergartenCount(kg);
    showToast(`Đã đánh dấu toàn bộ ${students.length} bé Có Mặt ngày ${selectedDate}`);
  };

  // Đánh dấu tất cả nghỉ cho ngày này
  const handleMarkAllAbsent = () => {
    const updatedDay: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'> = {};
    students.forEach((s) => {
      updatedDay[s.id] = 'Nghỉ có phép';
    });

    setDailyAttendanceState((prev) => ({
      ...prev,
      [selectedDate]: updatedDay,
    }));
    setCurrentNurseryCount(0);
    setCurrentKindergartenCount(0);
    showToast(`Đã đánh dấu toàn bộ bé Nghỉ ngày ${selectedDate}`);
  };

  // Khôi phục về sĩ số trường mặc định
  const handleRestoreDefaultCounts = () => {
    setCurrentNurseryCount(defaultNurseryCount);
    setCurrentKindergartenCount(defaultKindergartenCount);
    onResetDate(selectedDate);
    showToast(`Đã khôi phục sĩ số mặc định (${defaultNurseryCount} NT, ${defaultKindergartenCount} MG) cho ngày ${selectedDate}`);
  };

  // Lưu và đồng bộ
  const handleSaveAndSync = () => {
    onSaveAttendance(
      selectedDate,
      currentNurseryCount,
      currentKindergartenCount,
      dailyAttendanceState[selectedDate]
    );
    showToast(`Đã lưu và đồng bộ điểm danh ngày ${selectedDate} vào hồ sơ kiểm thực!`);
  };

  // Chuyển ngày trước / sau
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Xử lý XÓA TRẮNG
  const handleExecuteClear = (type: 'day' | 'week' | 'month') => {
    if (type === 'day') {
      setCurrentNurseryCount(0);
      setCurrentKindergartenCount(0);
      handleMarkAllAbsent();
      onClearDate(selectedDate);
      showToast(`Đã xóa trắng số suất ăn ngày ${selectedDate} (về 0)`);
    } else if (type === 'week') {
      onClearWeek(selectedDate);
      setCurrentNurseryCount(0);
      setCurrentKindergartenCount(0);
      showToast(`Đã xóa trắng số suất ăn toàn bộ tuần chứa ngày ${selectedDate}`);
    } else if (type === 'month') {
      onClearMonth(selectedDate);
      setCurrentNurseryCount(0);
      setCurrentKindergartenCount(0);
      showToast(`Đã xóa trắng số suất ăn toàn bộ tháng chứa ngày ${selectedDate}`);
    }
    setClearConfirmType(null);
  };

  const dayInfo = getDayInfo(selectedDate);
  const totalMoney = currentNurseryCount * nurseryPrice + currentKindergartenCount * kindergartenPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
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

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-emerald-300">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                <span>Kiểm Soát &amp; Sửa Chữa Danh Sách Điểm Danh Học Sinh</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-semibold">
                  Sổ Sách Chuẩn BGD&amp;ĐT
                </span>
              </h2>
              <p className="text-xs text-emerald-200/90">
                Cho phép chọn bất kỳ ngày nào để sửa danh sách chuyên cần, tự động tính số suất ăn và đồng bộ hồ sơ kiểm thực.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Bar: CHỌN NGÀY BẤT KỲ & ĐIỀU HƯỚNG */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          {/* Trình chọn ngày bất kỳ */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="w-4 h-4 text-emerald-700" />
              Chọn ngày kiểm soát:
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevDay}
                className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 cursor-pointer"
                title="Ngày trước đó"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              />

              <button
                type="button"
                onClick={handleNextDay}
                className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 cursor-pointer"
                title="Ngày tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${dayInfo.badgeClass}`}>
              {dayInfo.label} ({new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN')})
            </span>

            {/* Danh sách nhanh các ngày trong bộ hồ sơ đang lọc */}
            {availableDates && availableDates.length > 0 && (
              <select
                value={availableDates.includes(selectedDate) ? selectedDate : ''}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="text-xs font-medium px-2 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
                title="Chọn nhanh từ đợt hồ sơ đang xuất in"
              >
                <option value="">-- Chọn ngày từ đợt hồ sơ --</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {new Date(d + 'T00:00:00').toLocaleDateString('vi-VN')} ({getDayInfo(d).shortLabel})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* NHÓM NÚT XÓA TRẮNG THEO NGÀY, TUẦN, THÁNG */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-rose-800 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Xóa Trắng:
            </span>

            <button
              type="button"
              onClick={() => setClearConfirmType('day')}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-100/80 hover:bg-rose-200 text-rose-800 border border-rose-300 cursor-pointer transition-colors"
              title="Xóa trắng suất ăn của ngày này (đặt về 0)"
            >
              Theo Ngày
            </button>

            <button
              type="button"
              onClick={() => setClearConfirmType('week')}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-100/80 hover:bg-rose-200 text-rose-800 border border-rose-300 cursor-pointer transition-colors"
              title="Xóa trắng suất ăn của các ngày trong tuần này"
            >
              Theo Tuần
            </button>

            <button
              type="button"
              onClick={() => setClearConfirmType('month')}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-rose-100/80 hover:bg-rose-200 text-rose-800 border border-rose-300 cursor-pointer transition-colors"
              title="Xóa trắng suất ăn của các ngày trong cả tháng này"
            >
              Theo Tháng
            </button>

            <button
              type="button"
              onClick={handleRestoreDefaultCounts}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 cursor-pointer transition-colors flex items-center gap-1"
              title="Khôi phục lại sĩ số ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục</span>
            </button>
          </div>
        </div>

        {/* BẢNG TỔNG QUÁT SĨ SỐ & KHẨU PHẦN ĂN TRONG NGÀY */}
        <div className="p-4 bg-emerald-50/60 border-b border-emerald-200 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-800 block">Suất Nhà Trẻ (NT):</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min="0"
                value={currentNurseryCount === 0 ? '' : currentNurseryCount}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                  setCurrentNurseryCount(val);
                }}
                className="w-20 text-sm font-extrabold text-amber-900 border border-amber-300 rounded-lg px-2 py-1 bg-amber-50/50 focus:bg-white"
              />
              <span className="text-xs text-slate-500 font-medium">
                (Thực tế: <strong>{actualPresentCounts.nt}</strong> bé)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              {(currentNurseryCount * nurseryPrice).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-sky-200 shadow-2xs">
            <span className="text-[11px] font-bold text-sky-800 block">Suất Mẫu Giáo (MG):</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                min="0"
                value={currentKindergartenCount === 0 ? '' : currentKindergartenCount}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                  setCurrentKindergartenCount(val);
                }}
                className="w-20 text-sm font-extrabold text-sky-900 border border-sky-300 rounded-lg px-2 py-1 bg-sky-50/50 focus:bg-white"
              />
              <span className="text-xs text-slate-500 font-medium">
                (Thực tế: <strong>{actualPresentCounts.kg}</strong> bé)
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              {(currentKindergartenCount * kindergartenPrice).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-800 block">Tổng Suất Ăn Ngày Này:</span>
            <div className="text-lg font-black text-emerald-900 mt-1">
              {currentNurseryCount + currentKindergartenCount}{' '}
              <span className="text-xs font-normal text-slate-600">khẩu phần</span>
            </div>
            <span className="text-[10.5px] text-emerald-700 font-semibold mt-0.5 block">
              Tổng tiền: {totalMoney.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-bold text-slate-700 block">Thao tác sĩ số nhanh:</span>
            <div className="flex items-center gap-1.5 mt-1">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="flex-1 text-[11px] font-bold py-1 px-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer transition-colors text-center"
                title="Tất cả học sinh có mặt"
              >
                Tất cả có mặt
              </button>
              <button
                type="button"
                onClick={handleMarkAllAbsent}
                className="flex-1 text-[11px] font-bold py-1 px-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer transition-colors text-center"
                title="Tất cả học sinh nghỉ"
              >
                Tất cả nghỉ
              </button>
            </div>
          </div>
        </div>

        {/* BỘ LỌC TÌM KIẾM DANH SÁCH HỌC SINH */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên học sinh, mã HS, phụ huynh, lớp..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
            >
              <option value="all">Tất cả các lớp ({students.length})</option>
              {classList.map((c) => (
                <option key={c} value={c}>
                  Lớp {c}
                </option>
              ))}
            </select>

            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value as any)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Có mặt">Chỉ Có mặt ({actualPresentCounts.total})</option>
              <option value="Nghỉ có phép">Nghỉ có phép</option>
              <option value="Nghỉ không phép">Nghỉ không phép</option>
            </select>
          </div>
        </div>

        {/* BẢNG DANH SÁCH ĐIỂM DANH HỌC SINH TRONG NGÀY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10.5px] border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="p-2.5 w-10 text-center">STT</th>
                  <th className="p-2.5 w-24">Mã HS</th>
                  <th className="p-2.5 min-w-[160px]">Họ và tên học sinh</th>
                  <th className="p-2.5 w-28">Lớp &amp; Khối</th>
                  <th className="p-2.5 min-w-[140px]">Phụ huynh &amp; SĐT</th>
                  <th className="p-2.5 min-w-[180px] text-center">
                    Điểm danh ngày {new Date(selectedDate + 'T00:00:00').toLocaleDateString('vi-VN')}
                  </th>
                  <th className="p-2.5 min-w-[160px]">Lưu ý ăn uống / Dị ứng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                      Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const status = currentDayMap[student.id] || 'Có mặt';
                    const isNT = isNurseryStudent(student);

                    return (
                      <tr
                        key={student.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          status !== 'Có mặt' ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-mono font-semibold text-slate-600">{student.studentCode}</td>
                        <td className="p-2.5 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{student.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({student.gender})
                            </span>
                          </div>
                        </td>
                        <td className="p-2.5">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                              isNT
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-sky-100 text-sky-900 border-sky-300'
                            }`}
                          >
                            {student.className}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600">
                          <div className="truncate font-medium">{student.parentName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{student.parentPhone}</div>
                        </td>
                        <td className="p-2.5 text-center">
                          <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() => handleToggleStudentStatus(student.id, 'Có mặt')}
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
                              onClick={() => handleToggleStudentStatus(student.id, 'Nghỉ có phép')}
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
                              onClick={() => handleToggleStudentStatus(student.id, 'Nghỉ không phép')}
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
                        <td className="p-2.5">
                          {student.allergiesOrDiet && student.allergiesOrDiet !== 'Không có' ? (
                            <span className="text-[10.5px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                              {student.allergiesOrDiet}
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-slate-400 italic">Bình thường</span>
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

        {/* MODAL XÁC NHẬN XÓA TRẮNG (THEO NGÀY, TUẦN, THÁNG) */}
        {clearConfirmType && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-2.5 bg-rose-100 rounded-xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Xác Nhận Xóa Trắng{' '}
                    {clearConfirmType === 'day'
                      ? 'Theo Ngày'
                      : clearConfirmType === 'week'
                      ? 'Theo Tuần'
                      : 'Theo Cả Tháng'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Thao tác này sẽ đặt sĩ số suất ăn về 0 cho phạm vi đã chọn.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p>
                  <strong>Phạm vi xóa trắng:</strong>{' '}
                  {clearConfirmType === 'day' && (
                    <span>
                      Chỉ riêng ngày <strong>{selectedDate}</strong> ({dayInfo.label}).
                    </span>
                  )}
                  {clearConfirmType === 'week' && (
                    <span>
                      Toàn bộ các ngày trong <strong>tuần</strong> chứa ngày {selectedDate}.
                    </span>
                  )}
                  {clearConfirmType === 'month' && (
                    <span>
                      Toàn bộ các ngày trong <strong>tháng</strong> chứa ngày {selectedDate}.
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-amber-700">
                  💡 Bạn có thể bấm nút <strong>&quot;Khôi phục&quot;</strong> bất cứ lúc nào để lấy lại sĩ số mặc định ban đầu.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setClearConfirmType(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy thao tác
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteClear(clearConfirmType)}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xác nhận Xóa Trắng</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <span>
              Đang xem ngày: <strong className="text-slate-900 font-bold">{selectedDate}</strong>
            </span>
            <span>•</span>
            <span>
              Suất ăn đã chốt:{' '}
              <strong className="text-emerald-700 font-bold">
                {currentNurseryCount} NT + {currentKindergartenCount} MG ={' '}
                {currentNurseryCount + currentKindergartenCount} suất
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer transition-colors"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSaveAndSync}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5 active:scale-98"
            >
              <Save className="w-4 h-4" />
              <span>Lưu &amp; Đồng Bộ Hồ Sơ Ngày Này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
