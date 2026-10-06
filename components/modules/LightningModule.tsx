'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Zap,
  Printer,
  Calendar,
  Users,
  Utensils,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Flame,
  FileCheck,
  Building,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  Clock,
  Layers,
  BookOpen,
  Edit2,
  RotateCcw,
  Check,
  X,
  Plus,
  Search,
  Sunrise,
  Sun,
  Sunset,
  ChevronDown,
  Coffee,
  Soup,
  CakeSlice,
  Filter,
  UserCheck,
  Trash2,
} from 'lucide-react';
import { SchoolInfo, MenuItem, StudentRecord, DishItem } from '@/types/preschool';
import { InspectionPrintRecord } from '@/types/lightning';
import { getStandardizedIngredientsForDish } from '@/lib/dish-database';
import OfficialPrintView from '@/components/OfficialPrintView';
import { getStoredDishLibrary } from '@/lib/dish-library';
import DailyAttendanceModal from '@/components/DailyAttendanceModal';
import { getDefaultSettings, saveDefaultSettings, AppDefaultSettings } from '@/lib/storage';
import { Cog } from 'lucide-react';

interface LightningModuleProps {
  schoolInfo: SchoolInfo;
  menuItems: MenuItem[];
  students: StudentRecord[];
  defaultSettings?: AppDefaultSettings;
  onSaveDefaultSettings?: (settings: Partial<AppDefaultSettings>) => void;
  lightningState?: {
    customDishes?: Record<string, any>;
    customCounts?: Record<string, any>;
  };
  onSaveLightningState?: (state: { customDishes?: Record<string, any>; customCounts?: Record<string, any> }) => void;
  onClearAllSampleData?: () => void;
}

// Danh sách gợi ý Combo trưa từ 30 món chốt của cơ sở
const LUNCH_COMBO_SUGGESTIONS = [
  { main: 'Cá Basa kho thơm', soup: 'Canh bí đao thịt bằm' },
  { main: 'Thịt bò xào cà chua', soup: 'Canh cải thịt bằm' },
  { main: 'Cá thu sốt cà', soup: 'Canh bí đỏ thịt bằm' },
  { main: 'Tôm sốt cam', soup: 'Canh cua mồng tơi' },
  { main: 'Tôm ram', soup: 'Canh dưa hồng thịt bằm' },
  { main: 'Thịt kho trứng cút', soup: 'Canh chua cá bớp' },
  { main: 'Chả cá chiên', soup: 'Canh bí đao thịt bằm' },
  { main: 'Trứng chiên rau củ', soup: 'Canh cải thịt bằm' },
];

// Helper chuyển đổi Date sang chuỗi YYYY-MM-DD theo giờ địa phương (tránh lệch timezone)
const toLocalDateString = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Helper parse chuỗi YYYY-MM-DD an toàn
const parseLocalDate = (str: string): Date => {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Helper tìm Thứ Hai đầu tuần
const getMondayOfWeek = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 1: Thứ 2, 0: Chủ Nhật
  date.setDate(date.getDate() + diff);
  return date;
};

// Helper lấy thông tin thứ trong tuần
export const getDayInfo = (dateStr: string) => {
  const d = parseLocalDate(dateStr);
  const day = d.getDay();
  switch (day) {
    case 0:
      return { label: 'Chủ Nhật', shortLabel: 'CN', isWeekend: true, badgeClass: 'bg-rose-100 text-rose-800 border-rose-300' };
    case 1:
      return { label: 'Thứ Hai', shortLabel: 'T2', isWeekend: false, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 2:
      return { label: 'Thứ Ba', shortLabel: 'T3', isWeekend: false, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 3:
      return { label: 'Thứ Tư', shortLabel: 'T4', isWeekend: false, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 4:
      return { label: 'Thứ Năm', shortLabel: 'T5', isWeekend: false, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 5:
      return { label: 'Thứ Sáu', shortLabel: 'T6', isWeekend: false, badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
    case 6:
      return { label: 'Thứ Bảy', shortLabel: 'T7', isWeekend: true, badgeClass: 'bg-amber-100 text-amber-900 border-amber-300' };
    default:
      return { label: '', shortLabel: '', isWeekend: false, badgeClass: '' };
  }
};

export default function LightningModule({
  schoolInfo,
  menuItems,
  students,
  defaultSettings,
  onSaveDefaultSettings,
  lightningState,
  onSaveLightningState,
  onClearAllSampleData,
}: LightningModuleProps) {
  // 1. Inputs cho phân hệ Tia Chớp
  const [dateMode, setDateMode] = useState<'range' | 'week' | 'month'>('range');
  const [includeSaturday, setIncludeSaturday] = useState<boolean>(false);
  const [includeSunday, setIncludeSunday] = useState<boolean>(false);

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const [selectedWeekDate, setSelectedWeekDate] = useState<string>(() => {
    return toLocalDateString(new Date());
  });

  const [startDate, setStartDate] = useState<string>(() => {
    return toLocalDateString(new Date());
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return toLocalDateString(new Date());
  });

  // Cấu hình mặc định hệ thống (Sĩ số, Tiền ăn, Giờ kiểm thực)
  const initialDefaults = useMemo(() => defaultSettings || getDefaultSettings(), [defaultSettings]);

  // Số lượng bé & tiền ăn mặc định (Đồng bộ thời gian thực từ Server)
  const [nurseryCount, setNurseryCount] = useState<number>(() => initialDefaults.nurseryCount);
  const [kindergartenCount, setKindergartenCount] = useState<number>(() => initialDefaults.kindergartenCount);
  const [nurseryPrice, setNurseryPrice] = useState<number>(() => initialDefaults.nurseryPrice);
  const [kindergartenPrice, setKindergartenPrice] = useState<number>(() => initialDefaults.kindergartenPrice);

  const [defaultStep1Time, setDefaultStep1Time] = useState<string>(() => initialDefaults.step1Time || '06:30');
  const [defaultStep2Time, setDefaultStep2Time] = useState<string>(() => initialDefaults.step2Time || '09:30');
  const [defaultStep3Time, setDefaultStep3Time] = useState<string>(() => initialDefaults.step3Time || '10:30');
  const [defaultSampleTime, setDefaultSampleTime] = useState<string>(() => initialDefaults.sampleTime || '10:45');

  const [isDefaultModalOpen, setIsDefaultModalOpen] = useState<boolean>(false);
  const [defaultToast, setDefaultToast] = useState<string | null>(null);

  // Tự động nhận diện và đồng bộ tức thì khi Máy khác cập nhật Cấu hình mặc định
  useEffect(() => {
    if (defaultSettings) {
      if (defaultSettings.nurseryCount !== undefined) setNurseryCount(defaultSettings.nurseryCount);
      if (defaultSettings.kindergartenCount !== undefined) setKindergartenCount(defaultSettings.kindergartenCount);
      if (defaultSettings.nurseryPrice !== undefined) setNurseryPrice(defaultSettings.nurseryPrice);
      if (defaultSettings.kindergartenPrice !== undefined) setKindergartenPrice(defaultSettings.kindergartenPrice);
      if (defaultSettings.step1Time) setDefaultStep1Time(defaultSettings.step1Time);
      if (defaultSettings.step2Time) setDefaultStep2Time(defaultSettings.step2Time);
      if (defaultSettings.step3Time) setDefaultStep3Time(defaultSettings.step3Time);
      if (defaultSettings.sampleTime) setDefaultSampleTime(defaultSettings.sampleTime);
      if (defaultSettings.includeSaturday !== undefined) setIncludeSaturday(defaultSettings.includeSaturday);
      if (defaultSettings.includeSunday !== undefined) setIncludeSunday(defaultSettings.includeSunday);
      if (defaultSettings.dateMode) setDateMode(defaultSettings.dateMode);
    }
  }, [defaultSettings]);

  const handleSaveAllAsDefault = (
    nCnt = nurseryCount,
    kCnt = kindergartenCount,
    nPr = nurseryPrice,
    kPr = kindergartenPrice,
    s1T = defaultStep1Time,
    s2T = defaultStep2Time,
    s3T = defaultStep3Time,
    smT = defaultSampleTime
  ) => {
    const newSettings: AppDefaultSettings = {
      nurseryCount: nCnt,
      kindergartenCount: kCnt,
      nurseryPrice: nPr,
      kindergartenPrice: kPr,
      step1Time: s1T,
      step2Time: s2T,
      step3Time: s3T,
      sampleTime: smT,
      dateMode,
      includeSaturday,
      includeSunday,
    };

    setNurseryCount(nCnt);
    setKindergartenCount(kCnt);
    setNurseryPrice(nPr);
    setKindergartenPrice(kPr);
    setDefaultStep1Time(s1T);
    setDefaultStep2Time(s2T);
    setDefaultStep3Time(s3T);
    setDefaultSampleTime(smT);
    setIsDefaultModalOpen(false);

    if (onSaveDefaultSettings) {
      onSaveDefaultSettings(newSettings);
    } else {
      saveDefaultSettings(newSettings);
      fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_default_settings',
          defaultSettings: newSettings,
        }),
      }).catch(() => {});
    }

    setDefaultToast('Đã lưu cấu hình mặc định (Sĩ số bé ăn, Tiền ăn, Giờ kiểm thực) & Đồng bộ toàn hệ thống!');
    setTimeout(() => setDefaultToast(null), 3500);
  };

  // Template lựa chọn in
  const [selectedTemplate, setSelectedTemplate] = useState<
    'all' | 'step1_raw' | 'step1_dry' | 'step2' | 'step3' | 'samples' | 'menu_ration'
  >('all');

  // Preview Modal In
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Lưu món ăn tùy chỉnh riêng cho từng ngày
  const [customDishesByDate, setCustomDishesByDate] = useState<
    Record<
      string,
      {
        breakfast?: string;
        snackMorning?: string;
        lunchMain?: string;
        lunchSoup?: string;
        lunchStaple?: string;
        lunchDessert?: string;
        afternoonSnack?: string;
      }
    >
  >(() => {
    if (lightningState?.customDishes) return lightningState.customDishes;
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('lightning_custom_dishes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Lưu số lượng suất Nhà Trẻ & Mẫu Giáo nhập riêng cho từng ngày
  const [customCountsByDate, setCustomCountsByDate] = useState<
    Record<string, { nurseryCount?: number; kindergartenCount?: number }>
  >(() => {
    if (lightningState?.customCounts) return lightningState.customCounts;
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('lightning_custom_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Tự động nhận diện khi máy khác cập nhật món hoặc sĩ số từng ngày
  useEffect(() => {
    if (lightningState) {
      if (lightningState.customDishes) setCustomDishesByDate(lightningState.customDishes);
      if (lightningState.customCounts) setCustomCountsByDate(lightningState.customCounts);
    }
  }, [lightningState]);

  // Kho toàn bộ món ăn từ dish-library
  const [allDishes, setAllDishes] = useState<DishItem[]>(() => getStoredDishLibrary());

  // Modal Chọn Món Ăn (Bảng thể hiện toàn bộ món, không che layout table)
  const [mealModalState, setMealModalState] = useState<{
    date: string;
    slot: 'morning' | 'lunch' | 'afternoon';
  } | null>(null);

  const [modalSearch, setModalSearch] = useState('');
  const [modalCategoryFilter, setModalCategoryFilter] = useState<string>('all');
  const [customInputDish, setCustomInputDish] = useState('');

  // Modal Kiểm Soát Điểm Danh & Sửa Danh Sách Theo Ngày
  const [dailyAttendanceModalOpen, setDailyAttendanceModalOpen] = useState(false);
  const [dailyAttendanceModalDate, setDailyAttendanceModalDate] = useState<string>(() => {
    return toLocalDateString(new Date());
  });

  // Hộp thoại xác nhận Xóa Trắng (Ngày / Tuần / Tháng)
  const [clearConfirmDialog, setClearConfirmDialog] = useState<{
    type: 'day' | 'week' | 'month';
    targetDate: string;
  } | null>(null);

  // Dropdown mở menu xóa trắng trên thanh công cụ
  const [isClearMenuOpen, setIsClearMenuOpen] = useState(false);

  // Tạo danh sách các ngày trong khoảng thời gian (loại bỏ hoặc bao gồm Thứ 7, CN)
  const dateList = useMemo(() => {
    const dates: string[] = [];
    try {
      if (!startDate || !endDate) return [];
      const start = parseLocalDate(startDate);
      const end = parseLocalDate(endDate);
      if (start > end) return [startDate];

      const curr = new Date(start);
      // Hỗ trợ tối đa 62 ngày (đầy đủ 2 tháng) mượt mà
      while (curr <= end && dates.length < 62) {
        const day = curr.getDay(); // 0: CN, 1: T2, ..., 6: T7
        let isIncluded = false;
        if (day >= 1 && day <= 5) {
          isIncluded = true; // Thứ 2 đến Thứ 6
        } else if (day === 6 && includeSaturday) {
          isIncluded = true; // Thứ 7 nếu bật
        } else if (day === 0 && includeSunday) {
          isIncluded = true; // Chủ Nhật nếu bật
        }

        if (isIncluded) {
          dates.push(toLocalDateString(curr));
        }
        curr.setDate(curr.getDate() + 1);
      }
      return dates.length > 0 ? dates : [startDate];
    } catch {
      return [startDate];
    }
  }, [startDate, endDate, includeSaturday, includeSunday]);

  // Hàm chọn khoảng tuần
  const handleSelectWeek = (referenceDateStr: string, incSat = includeSaturday, incSun = includeSunday) => {
    setSelectedWeekDate(referenceDateStr);
    const ref = parseLocalDate(referenceDateStr);
    const monday = getMondayOfWeek(ref);
    const endDays = incSun ? 6 : incSat ? 5 : 4;
    const endDay = new Date(monday);
    endDay.setDate(monday.getDate() + endDays);

    setStartDate(toLocalDateString(monday));
    setEndDate(toLocalDateString(endDay));
  };

  // Hàm chọn cả tháng
  const handleSelectMonth = (yearMonthStr: string) => {
    setSelectedMonth(yearMonthStr);
    const [y, m] = yearMonthStr.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    // Ngày cuối cùng của tháng: ngày 0 của tháng tiếp theo
    const end = new Date(y, m, 0);

    setStartDate(toLocalDateString(start));
    setEndDate(toLocalDateString(end));
  };

  // Thao tác tuần nhanh
  const handleQuickCurrentWeek = () => {
    handleSelectWeek(toLocalDateString(new Date()));
  };

  const handleQuickPrevWeek = () => {
    const ref = parseLocalDate(selectedWeekDate || startDate);
    ref.setDate(ref.getDate() - 7);
    handleSelectWeek(toLocalDateString(ref));
  };

  const handleQuickNextWeek = () => {
    const ref = parseLocalDate(selectedWeekDate || startDate);
    ref.setDate(ref.getDate() + 7);
    handleSelectWeek(toLocalDateString(ref));
  };

  // Thao tác tháng nhanh
  const handleQuickCurrentMonth = () => {
    const today = new Date();
    const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    handleSelectMonth(ym);
  };

  const handleQuickPrevMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const prev = new Date(y, m - 2, 1);
    const ym = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
    handleSelectMonth(ym);
  };

  const handleQuickNextMonth = () => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const next = new Date(y, m, 1);
    const ym = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    handleSelectMonth(ym);
  };

  // Bật/tắt Thứ 7
  const handleToggleSaturday = (checked: boolean) => {
    setIncludeSaturday(checked);
    if (dateMode === 'week') {
      handleSelectWeek(selectedWeekDate, checked, includeSunday);
    }
  };

  // Bật/tắt Chủ Nhật
  const handleToggleSunday = (checked: boolean) => {
    setIncludeSunday(checked);
    if (dateMode === 'week') {
      handleSelectWeek(selectedWeekDate, includeSaturday, checked);
    }
  };

  // Cập nhật số suất ăn trực tiếp cho 1 ngày
  const handleUpdateCount = (
    dateStr: string,
    field: 'nursery' | 'kindergarten',
    value: number
  ) => {
    setCustomCountsByDate((prev) => {
      const current = prev[dateStr] || {};
      const updated = {
        ...prev,
        [dateStr]: {
          ...current,
          [field === 'nursery' ? 'nurseryCount' : 'kindergartenCount']: value,
        },
      };
      if (onSaveLightningState) {
        onSaveLightningState({ customDishes: customDishesByDate, customCounts: updated });
      }
      return updated;
    });
  };

  // Hàm cập nhật nhanh món cho 1 ngày
  const handleUpdateMeal = (
    dateStr: string,
    slot: 'morning' | 'lunch' | 'afternoon',
    value: { main?: string; soup?: string; text?: string; breakfast?: string; snackMorning?: string }
  ) => {
    setCustomDishesByDate((prev) => {
      const current = prev[dateStr] || {};
      const updated = { ...current };

      if (slot === 'morning') {
        if (value.breakfast !== undefined) updated.breakfast = value.breakfast;
        if (value.snackMorning !== undefined) updated.snackMorning = value.snackMorning;
        if (value.text) updated.breakfast = value.text;
      } else if (slot === 'lunch') {
        if (value.main !== undefined) updated.lunchMain = value.main;
        if (value.soup !== undefined) updated.lunchSoup = value.soup;
        if (value.text) {
          updated.lunchMain = value.text;
        }
      } else if (slot === 'afternoon') {
        const snack = value.text || value.main || '';
        updated.afternoonSnack = snack;
        updated.lunchDessert = snack; // đồng bộ món tráng miệng xế chiều
      }

      const nextDishes = {
        ...prev,
        [dateStr]: updated,
      };

      if (onSaveLightningState) {
        onSaveLightningState({ customDishes: nextDishes, customCounts: customCountsByDate });
      }

      return nextDishes;
    });
  };

  // Áp dụng món hiện tại cho tất cả các ngày
  const handleApplyToAllDates = (
    slot: 'morning' | 'lunch' | 'afternoon',
    value: { main?: string; soup?: string; text?: string; breakfast?: string; snackMorning?: string }
  ) => {
    setCustomDishesByDate((prev) => {
      const nextState = { ...prev };
      dateList.forEach((d) => {
        const current = nextState[d] || {};
        const updated = { ...current };
        if (slot === 'morning') {
          if (value.breakfast !== undefined) updated.breakfast = value.breakfast;
          if (value.snackMorning !== undefined) updated.snackMorning = value.snackMorning;
          if (value.text) updated.breakfast = value.text;
        } else if (slot === 'lunch') {
          if (value.main !== undefined) updated.lunchMain = value.main;
          if (value.soup !== undefined) updated.lunchSoup = value.soup;
          if (value.text) updated.lunchMain = value.text;
        } else if (slot === 'afternoon') {
          const snack = value.text || value.main || '';
          updated.afternoonSnack = snack;
          updated.lunchDessert = snack;
        }
        nextState[d] = updated;
      });

      if (onSaveLightningState) {
        onSaveLightningState({ customDishes: nextState, customCounts: customCountsByDate });
      }

      return nextState;
    });
    setMealModalState(null);
  };

  // Khôi phục mặc định cho 1 ngày
  const handleResetDate = (dateStr: string) => {
    setCustomDishesByDate((prev) => {
      const nextDishes = { ...prev };
      delete nextDishes[dateStr];
      setCustomCountsByDate((countsPrev) => {
        const nextCounts = { ...countsPrev };
        delete nextCounts[dateStr];
        if (onSaveLightningState) {
          onSaveLightningState({ customDishes: nextDishes, customCounts: nextCounts });
        }
        return nextCounts;
      });
      return nextDishes;
    });
  };

  // Xóa trắng theo ngày (đặt suất NT & MG về 0)
  const handleClearDate = (dateStr: string) => {
    setCustomCountsByDate((prev) => {
      const nextCounts = {
        ...prev,
        [dateStr]: { nurseryCount: 0, kindergartenCount: 0 },
      };
      if (onSaveLightningState) {
        onSaveLightningState({ customDishes: customDishesByDate, customCounts: nextCounts });
      }
      return nextCounts;
    });
  };

  // Xóa trắng theo tuần (đặt suất NT & MG của tất cả các ngày trong tuần này về 0)
  const handleClearWeek = (referenceDateStr: string) => {
    const ref = parseLocalDate(referenceDateStr);
    const monday = getMondayOfWeek(ref);
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push(toLocalDateString(d));
    }
    setCustomCountsByDate((prev) => {
      const next = { ...prev };
      weekDates.forEach((d) => {
        next[d] = { nurseryCount: 0, kindergartenCount: 0 };
      });
      if (onSaveLightningState) {
        onSaveLightningState({ customDishes: customDishesByDate, customCounts: next });
      }
      return next;
    });
  };

  // Xóa trắng theo tháng (đặt suất NT & MG của tất cả các ngày trong tháng về 0)
  const handleClearMonth = (referenceDateStr: string) => {
    const [y, m] = referenceDateStr.split('-').map(Number);
    const totalDays = new Date(y, m, 0).getDate();
    setCustomCountsByDate((prev) => {
      const next = { ...prev };
      for (let day = 1; day <= totalDays; day++) {
        const dStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        next[dStr] = { nurseryCount: 0, kindergartenCount: 0 };
      }
      if (onSaveLightningState) {
        onSaveLightningState({ customDishes: customDishesByDate, customCounts: next });
      }
      return next;
    });
  };

  // Mở modal kiểm soát điểm danh cho 1 ngày bất kỳ
  const handleOpenAttendanceForDate = (dateStr: string) => {
    setDailyAttendanceModalDate(dateStr);
    setDailyAttendanceModalOpen(true);
  };

  // Lưu điểm danh chi tiết từ DailyAttendanceModal (Lưu cả sĩ số và trạng thái từng bé)
  const handleSaveDailyAttendance = (
    dateStr: string,
    nurseryCountVal: number,
    kindergartenCountVal: number,
    studentStatusMap?: Record<string, 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép'>
  ) => {
    setCustomCountsByDate((prev) => {
      const updated = {
        ...prev,
        [dateStr]: {
          nurseryCount: nurseryCountVal,
          kindergartenCount: kindergartenCountVal,
        },
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('lightning_custom_counts', JSON.stringify(updated));
        } catch (e) {}
      }
      if (onSaveLightningState) {
        onSaveLightningState({ customDishes: customDishesByDate, customCounts: updated });
      }
      return updated;
    });

    if (studentStatusMap && typeof window !== 'undefined') {
      try {
        const savedStatuses = JSON.parse(localStorage.getItem('preschool_daily_student_statuses') || '{}');
        savedStatuses[dateStr] = studentStatusMap;
        localStorage.setItem('preschool_daily_student_statuses', JSON.stringify(savedStatuses));
      } catch (e) {
        console.error('Lỗi lưu chi tiết điểm danh học sinh:', e);
      }
    }
  };

  // Bộ sinh hồ sơ tự động từ Menu (kết hợp tùy chỉnh món & suất ăn từng ngày)
  const generatedRecords = useMemo<InspectionPrintRecord[]>(() => {
    return dateList.map((dateStr, idx) => {
      // Tìm menu tương ứng mặc định
      const menuForDay =
        menuItems.length > 0
          ? menuItems[idx % menuItems.length]
          : {
              breakfast: 'Cháo gà hạt sen',
              snackMorning: 'Sữa chua dâu tươi',
              lunchMain: 'Thịt lợn rim nấm đông cô',
              lunchSoup: 'Canh bí đỏ nấu tôm nõn',
              lunchStaple: 'Cơm trắng gạo tám thơm',
              lunchDessert: 'Bánh flan caramen + Sữa hạt óc chó',
              afternoonSnack: 'Bánh flan caramen + Sữa hạt óc chó',
            };

      // Món thực tế (kết hợp tuỳ chỉnh nếu có)
      const custom = customDishesByDate[dateStr] || {};
      const effectiveLunchMain =
        custom.lunchMain !== undefined ? custom.lunchMain : menuForDay.lunchMain || 'Thịt lợn rim nấm đông cô';
      const effectiveLunchSoup =
        custom.lunchSoup !== undefined ? custom.lunchSoup : menuForDay.lunchSoup || 'Canh bí đỏ nấu tôm nõn';
      const effectiveLunchStaple =
        custom.lunchStaple !== undefined ? custom.lunchStaple : menuForDay.lunchStaple || 'Cơm trắng gạo tám thơm';
      const effectiveAfternoonSnack =
        custom.afternoonSnack !== undefined
          ? custom.afternoonSnack
          : menuForDay.afternoonSnack || 'Bánh flan caramen + Sữa hạt óc chó';
      const effectiveBreakfast =
        custom.breakfast !== undefined ? custom.breakfast : menuForDay.breakfast || 'Cháo gà hạt sen';
      const effectiveSnackMorning =
        custom.snackMorning !== undefined ? custom.snackMorning : menuForDay.snackMorning || 'Sữa hạt dinh dưỡng';
      const effectiveLunchDessert = custom.afternoonSnack || custom.lunchDessert || effectiveAfternoonSnack;

      // Sĩ số riêng của từng ngày (nếu đã nhập trực tiếp)
      const dayCounts = customCountsByDate[dateStr] || {};
      const dayNurseryCount = dayCounts.nurseryCount !== undefined ? dayCounts.nurseryCount : nurseryCount;
      const dayKindergartenCount =
        dayCounts.kindergartenCount !== undefined ? dayCounts.kindergartenCount : kindergartenCount;

      // Gom toàn bộ nguyên liệu chuẩn hóa từ các món trong ngày
      const ingMain = getStandardizedIngredientsForDish(effectiveLunchMain);
      const ingSoup = getStandardizedIngredientsForDish(effectiveLunchSoup);
      const ingStaple = getStandardizedIngredientsForDish(effectiveLunchStaple);
      const ingSnack = getStandardizedIngredientsForDish(effectiveAfternoonSnack);
      const ingMorningSnack = effectiveSnackMorning ? getStandardizedIngredientsForDish(effectiveSnackMorning) : [];

      const allRawIngs = [...ingMain, ...ingSoup, ...ingStaple, ...ingSnack, ...ingMorningSnack];

      // Loại bỏ trùng tên và cộng dồn định mức
      const combinedMap = new Map<string, (typeof allRawIngs)[0]>();
      allRawIngs.forEach((item) => {
        if (combinedMap.has(item.name)) {
          const existing = combinedMap.get(item.name)!;
          existing.rawPerPortionGrams += item.rawPerPortionGrams;
          existing.cleanPerPortionGrams += item.cleanPerPortionGrams;
        } else {
          combinedMap.set(item.name, { ...item });
        }
      });

      // Tạo danh sách nguyên liệu tính chuẩn theo số lượng bé của ngày đó
      const calculatedIngredients = Array.from(combinedMap.values()).map((ing, ingIdx) => {
        // Suất Nhà trẻ thường ăn 80% định lượng Mẫu giáo
        const rawNTKg = Number(((ing.rawPerPortionGrams * 0.8 * dayNurseryCount) / 1000).toFixed(2));
        const rawMGKg = Number(((ing.rawPerPortionGrams * dayKindergartenCount) / 1000).toFixed(2));
        const cleanNTKg = Number(((ing.cleanPerPortionGrams * 0.8 * dayNurseryCount) / 1000).toFixed(2));
        const cleanMGKg = Number(((ing.cleanPerPortionGrams * dayKindergartenCount) / 1000).toFixed(2));

        const costNT = Math.round(rawNTKg * ing.pricePerKg);
        const costMG = Math.round(rawMGKg * ing.pricePerKg);

        return {
          id: `ing-${idx}-${ingIdx}`,
          name: ing.name,
          type: ing.type,
          rawNT: rawNTKg,
          rawMG: rawMGKg,
          cleanNT: cleanNTKg,
          cleanMG: cleanMGKg,
          unitPrice: ing.pricePerKg,
          costNT,
          costMG,
          producerName:
            ing.producerName || (ing.type === 'kho' ? 'Công ty CP Lương thực & Thực phẩm Miền Bắc' : undefined),
          producerAddress: ing.producerAddress || (ing.type === 'kho' ? 'KCN Tiên Sơn, Bắc Ninh' : undefined),
          supplier: ing.supplierName,
          supplierAddress: ing.supplierAddress || 'Hà Nội',
          supplierPhone: ing.supplierPhone || '024 3388 9911',
          deliverer: ing.delivererName || 'Nguyễn Văn Tuấn',
          isPassedSensory: true,
        };
      });

      const dayTotalMoney = dayNurseryCount * nurseryPrice + dayKindergartenCount * kindergartenPrice;

      return {
        date: dateStr,
        nurseryCount: dayNurseryCount,
        kindergartenCount: dayKindergartenCount,
        nurseryPrice,
        kindergartenPrice,
        dishes: {
          breakfast: effectiveBreakfast,
          snackMorning: effectiveSnackMorning,
          lunchMain: effectiveLunchMain,
          lunchSoup: effectiveLunchSoup,
          lunchStaple: effectiveLunchStaple,
          lunchDessert: effectiveLunchDessert,
          afternoonSnack: effectiveAfternoonSnack,
        },
        ingredients: calculatedIngredients,
        inspector1: schoolInfo.principalName || schoolInfo.inspectorName || 'Nguyễn Thị Hiệu Trưởng',
        inspector2: schoolInfo.receiverName || 'Trần Thị Kế Toán',
        inspector3: schoolInfo.headChefName || 'Lê Thị Bếp Trưởng',
        medicalStaff: schoolInfo.medicalStaffName || 'Phạm Thị Y Tế',
        totalMoneyPerDay: dayTotalMoney,
      };
    });
  }, [
    dateList,
    menuItems,
    customDishesByDate,
    customCountsByDate,
    nurseryCount,
    kindergartenCount,
    nurseryPrice,
    kindergartenPrice,
    schoolInfo,
  ]);

  // Lọc món ăn cho Modal theo tab danh mục và ô tìm kiếm
  const filteredModalDishes = useMemo(() => {
    let list = allDishes;

    if (modalCategoryFilter === 'main') {
      list = list.filter((d) => d.category.includes('mặn') || d.defaultMealSlot === 'lunchMain');
    } else if (modalCategoryFilter === 'soup') {
      list = list.filter((d) => d.category.includes('canh') || d.defaultMealSlot === 'lunchSoup');
    } else if (modalCategoryFilter === 'sweet') {
      list = list.filter(
        (d) =>
          d.category.includes('phụ') ||
          d.category.includes('Tráng miệng') ||
          d.defaultMealSlot === 'afternoonSnack' ||
          d.name.includes('Chè') ||
          d.name.includes('Sinh tố') ||
          d.name.includes('Bánh') ||
          d.name.includes('Sữa') ||
          d.name.includes('Thạch')
      );
    } else if (modalCategoryFilter === 'morning') {
      list = list.filter(
        (d) =>
          d.defaultMealSlot === 'breakfast' ||
          d.defaultMealSlot === 'snackMorning' ||
          d.name.includes('Cháo') ||
          d.name.includes('Súp') ||
          d.name.includes('Phở') ||
          d.name.includes('Bún') ||
          d.name.includes('Bánh canh') ||
          d.name.includes('Xôi')
      );
    }

    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q)) ||
          (d.category && d.category.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allDishes, modalCategoryFilter, modalSearch]);

  // Thông tin ngày đang chọn trong Modal
  const currentModalRecord = useMemo(() => {
    if (!mealModalState) return null;
    return generatedRecords.find((r) => r.date === mealModalState.date) || null;
  }, [mealModalState, generatedRecords]);

  return (
    <div className="w-full space-y-5">
      {/* Header Banner Trích Xuất Hồ Sơ - Rich Royal Oceanic Blue SaaS Style */}
      <div className="w-full bg-gradient-to-r from-[#0a2550] via-[#103a75] to-[#0c2e62] text-white rounded-2xl p-5 sm:p-6 border border-blue-600/40 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
              <span className="text-blue-300 font-bold flex items-center gap-1.5 bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-400/30">
                <FileCheck className="w-3.5 h-3.5 text-blue-300" />
                Chuẩn QĐ 1246/QĐ-BYT
              </span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="text-blue-100 font-medium">Bộ Giáo Dục &amp; Đào Tạo</span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="font-mono text-blue-200 font-semibold">{dateList.length} ngày trích xuất</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-xs">
              Trích Xuất Hồ Sơ Kiểm Thực 3 Bước &amp; Tiền Ăn
            </h2>
            <p className="text-blue-100/90 text-xs sm:text-sm max-w-3xl leading-relaxed font-normal">
              Tự động bóc tách định lượng thực đơn, bảng kê nguyên liệu sạch, giám sát chế biến, chia ăn và sổ hủy mẫu 24h chuẩn quy định.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 text-xs sm:text-sm cursor-pointer whitespace-nowrap border border-blue-400/40 shrink-0"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>XUẤT IN TOÀN BỘ HỒ SƠ ({dateList.length} NGÀY)</span>
          </button>
        </div>
      </div>

      {/* Control Dashboard: 3 Cột cấu hình nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Cột 1: Chọn khoảng thời gian & Chọn nhanh (Khoảng ngày / Theo Tuần / Cả Tháng) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3.5">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>1. Khoảng Thời Gian Hồ Sơ</span>
              </div>
            </div>

            {/* 3 Chế Độ Chọn: Khoảng Ngày | Theo Tuần | Cả Tháng */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100/90 rounded-xl mb-3 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setDateMode('range')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  dateMode === 'range'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Khoảng ngày
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateMode('week');
                  handleSelectWeek(selectedWeekDate || startDate);
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  dateMode === 'week'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Theo tuần
              </button>
              <button
                type="button"
                onClick={() => {
                  setDateMode('month');
                  handleSelectMonth(selectedMonth);
                }}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  dateMode === 'month'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cả tháng
              </button>
            </div>

            {/* UI theo chế độ đang chọn */}
            {dateMode === 'range' && (
              <div className="space-y-2 mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Từ ngày:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Đến ngày:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {dateMode === 'week' && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleQuickPrevWeek}
                    className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors border border-slate-200 cursor-pointer"
                  >
                    ◀ Tuần trước
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickCurrentWeek}
                    className="flex-1 py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md text-[11px] font-bold transition-colors border border-amber-300 cursor-pointer"
                  >
                    Tuần này
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickNextWeek}
                    className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors border border-slate-200 cursor-pointer"
                  >
                    Tuần sau ▶
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Chọn ngày trong tuần muốn trích xuất:
                  </label>
                  <input
                    type="date"
                    value={selectedWeekDate}
                    onChange={(e) => handleSelectWeek(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                  />
                </div>
              </div>
            )}

            {dateMode === 'month' && (
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleQuickPrevMonth}
                    className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors border border-slate-200 cursor-pointer"
                  >
                    ◀ Tháng trước
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickCurrentMonth}
                    className="flex-1 py-1 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-md text-[11px] font-bold transition-colors border border-amber-300 cursor-pointer"
                  >
                    Tháng này
                  </button>
                  <button
                    type="button"
                    onClick={handleQuickNextMonth}
                    className="flex-1 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors border border-slate-200 cursor-pointer"
                  >
                    Tháng sau ▶
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Chọn tháng cần trích xuất sổ sách:
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => handleSelectMonth(e.target.value)}
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                  />
                </div>
              </div>
            )}

            {/* Tùy chọn Ngày học trong tuần: Thứ 7 & Chủ Nhật */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">Ngày học trong tuần:</span>
              <div className="flex items-center gap-2">
                <label className={`flex-1 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  includeSaturday
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}>
                  <input
                    type="checkbox"
                    checked={includeSaturday}
                    onChange={(e) => handleToggleSaturday(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Học Thứ 7 (Bán trú T7)</span>
                </label>

                <label className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  includeSunday
                    ? 'bg-rose-50 border-rose-300 text-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}>
                  <input
                    type="checkbox"
                    checked={includeSunday}
                    onChange={(e) => handleToggleSunday(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Chủ Nhật</span>
                </label>
              </div>
            </div>
          </div>

          {/* Hộp tóm tắt số ngày đã lọc */}
          <div className="p-2.5 rounded-lg bg-blue-50/90 border border-blue-200 text-xs text-blue-950 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium">Hồ sơ được xác định:</span>
              <strong className="font-extrabold text-sm text-blue-900">
                {dateList.length} ngày
              </strong>
            </div>
            <div className="text-[10.5px] text-blue-800 flex items-center justify-between">
              <span>
                {includeSunday
                  ? 'Gồm cả Thứ 7 & Chủ Nhật'
                  : includeSaturday
                  ? 'Gồm Thứ 2 đến Thứ 7'
                  : 'Chỉ Thứ 2 đến Thứ 6'}
              </span>
              <span className="font-mono text-slate-500">{startDate} ➔ {endDate}</span>
            </div>
          </div>
        </div>

        {/* Cột 2: Đơn Giá & Khẩu Phần */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span>2. Đơn Giá &amp; Khẩu Phần</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDefaultModalOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
                title="Cài đặt mặc định hệ thống cho toàn bộ các ngày"
              >
                <Cog className="w-3.5 h-3.5" />
                <span>Cài Đặt Mặc Định</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tiền ăn Nhà Trẻ:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={nurseryPrice === 0 ? '' : nurseryPrice}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                      setNurseryPrice(val);
                    }}
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 bg-slate-50 tabular-nums"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">đ</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tiền ăn Mẫu Giáo:</label>
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={kindergartenPrice === 0 ? '' : kindergartenPrice}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                      setKindergartenPrice(val);
                    }}
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 bg-slate-50 tabular-nums"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">đ</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Suất NT mặc định:</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={nurseryCount === 0 ? '' : nurseryCount}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                      setNurseryCount(val);
                    }}
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 bg-slate-50 tabular-nums"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">bé</span>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Suất MG mặc định:</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={kindergartenCount === 0 ? '' : kindergartenCount}
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                      setKindergartenCount(val);
                    }}
                    className="w-full text-xs font-mono font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-blue-500 bg-slate-50 tabular-nums"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">bé</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveAllAsDefault()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold text-xs transition-colors cursor-pointer"
                title="Lưu các giá trị này làm mặc định cho tất cả ngày mới và lần dùng sau"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Lưu Làm Mặc Định</span>
              </button>
            </div>

            <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[10.5px] text-blue-900 leading-relaxed flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shrink-0" />
                <span>
                  <strong>Tự động ghi nhớ:</strong> Sĩ số &amp; tiền ăn sẽ được lưu lại làm mặc định cho máy này.
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-100/80 px-2 py-0.5 rounded-md shrink-0 border border-blue-300/60">
                ✓ Đã lưu
              </span>
            </div>
          </div>
        </div>

        {/* Cột 3: Tùy chọn Biểu mẫu & Nút In */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2.5 mb-3">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>3. Mẫu Cần Xuất In</span>
            </div>

            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as any)}
              className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-blue-500 cursor-pointer text-slate-800"
            >
              <option value="all">Trọn Bộ Đầy Đủ 6 Biểu Mẫu (Chuẩn PDF GD&amp;ĐT)</option>
              <option value="menu_ration">Trang 1: Bảng Tính Khẩu Phần Ăn Hàng Ngày</option>
              <option value="step1_raw">Trang 2: Kiểm thực Bước 1 (Tươi sống, Đông lạnh)</option>
              <option value="step1_dry">Trang 3: Kiểm thực Bước 1 (Đồ khô, Phụ gia)</option>
              <option value="step2">Trang 4: Kiểm thực Bước 2 (Quá trình Chế biến)</option>
              <option value="step3">Trang 5: Kiểm thực Bước 3 (Nếm thử &amp; Chia ăn)</option>
              <option value="samples">Trang 6: Sổ Lưu &amp; Hủy Mẫu Thức Ăn (24h)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-98"
          >
            <Printer className="w-4 h-4 text-blue-200" />
            <span>XUẤT IN TOÀN BỘ HỒ SƠ ({dateList.length} NGÀY)</span>
          </button>
        </div>
      </div>

      {/* Preview Card List & Table */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Bảng Tổng Hợp Dữ Liệu Hồ Sơ Kiểm Thực &amp; Điểm Danh</span>
                <span className="text-xs text-slate-500 font-normal">
                  ({dateList.length} ngày hồ sơ)
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Thực đơn chia rõ 3 bữa. Nhấp vào bất kỳ bữa ăn nào để đổi món hoặc tùy chỉnh sĩ số từng ngày.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            {/* Nút Vào Kiểm Soát Điểm Danh Cho 1 Ngày Bất Kỳ */}
            <button
              type="button"
              onClick={() => {
                setDailyAttendanceModalDate(startDate || toLocalDateString(new Date()));
                setDailyAttendanceModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              title="Vào trường kiểm soát điểm danh cho ngày bất kỳ"
            >
              <UserCheck className="w-4 h-4" />
              <span>Kiểm Soát Điểm Danh (Ngày Bất Kỳ)</span>
            </button>

            {/* Nút Xóa Toàn Bộ Data Mẫu */}
            {onClearAllSampleData && (
              <button
                type="button"
                onClick={onClearAllSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
                title="Xóa toàn bộ data mẫu để tự nhập dữ liệu thực tế của trường"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa Data Mẫu</span>
              </button>
            )}

            {/* Menu Dropdown Xóa Trắng Theo Ngày, Tuần, Tháng */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsClearMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                title="Tùy chọn xóa trắng số suất ăn theo Ngày, Tuần, Tháng"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Xóa Trắng</span>
                <ChevronDown className="w-3 h-3 text-slate-600" />
              </button>

              {isClearMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsClearMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Tùy chọn Xóa Trắng Suất Ăn
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsClearMenuOpen(false);
                        setClearConfirmDialog({
                          type: 'day',
                          targetDate: startDate || toLocalDateString(new Date()),
                        });
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>Xóa trắng Ngày ({startDate})</span>
                      <span className="text-[10px] text-rose-500 font-bold">về 0 suất</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsClearMenuOpen(false);
                        setClearConfirmDialog({
                          type: 'week',
                          targetDate: startDate || toLocalDateString(new Date()),
                        });
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>Xóa trắng Theo Tuần</span>
                      <span className="text-[10px] text-rose-500 font-bold">7 ngày</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsClearMenuOpen(false);
                        setClearConfirmDialog({
                          type: 'month',
                          targetDate: selectedMonth || startDate,
                        });
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 font-semibold flex items-center justify-between cursor-pointer border-t border-slate-100"
                    >
                      <span>Xóa trắng Cả Tháng</span>
                      <span className="text-[10px] text-rose-500 font-bold">toàn tháng</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {(Object.keys(customDishesByDate).length > 0 || Object.keys(customCountsByDate).length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setCustomDishesByDate({});
                  setCustomCountsByDate({});
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('lightning_custom_dishes');
                    localStorage.removeItem('lightning_custom_counts');
                  }
                  if (onSaveLightningState) {
                    onSaveLightningState({ customDishes: {}, customCounts: {} });
                  }
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 cursor-pointer transition-colors"
                title="Khôi phục toàn bộ về mặc định ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục mặc định</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full max-h-[640px] overflow-y-auto custom-scrollbar rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left text-slate-600 border-collapse">
            <thead className="bg-slate-100/95 backdrop-blur-xs text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="p-2.5 sm:p-3 whitespace-nowrap">Ngày &amp; Điểm Danh</th>
                <th className="p-2.5 sm:p-3 min-w-[340px] lg:min-w-[420px]">
                  THỰC ĐƠN (SÁNG • TRƯA • CHIỀU)
                </th>
                <th className="p-2.5 sm:p-3 text-center whitespace-nowrap" title="Nhập trực tiếp số suất Nhà Trẻ">
                  <div className="flex items-center justify-center gap-1">
                    <Edit2 className="w-3 h-3 text-amber-600" />
                    <span>Suất NT</span>
                  </div>
                </th>
                <th className="p-2.5 sm:p-3 text-center whitespace-nowrap" title="Nhập trực tiếp số suất Mẫu Giáo">
                  <div className="flex items-center justify-center gap-1">
                    <Edit2 className="w-3 h-3 text-sky-600" />
                    <span>Suất MG</span>
                  </div>
                </th>
                <th className="p-2.5 sm:p-3 text-right whitespace-nowrap">Tổng Tiền Chợ</th>
                <th className="p-2.5 sm:p-3 text-center">Bước 1</th>
                <th className="p-2.5 sm:p-3 text-center">Bước 2</th>
                <th className="p-2.5 sm:p-3 text-center">Bước 3</th>
                <th className="p-2.5 sm:p-3 text-center">Lưu Mẫu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {generatedRecords.map((item) => {
                const dateStr = item.date;
                const isCustomDish = !!customDishesByDate[dateStr];
                const isCustomCount = !!customCountsByDate[dateStr];
                const dayInfo = getDayInfo(dateStr);
                const isCleared = item.nurseryCount === 0 && item.kindergartenCount === 0;

                return (
                  <tr key={dateStr} className={`hover:bg-amber-50/30 transition-colors align-top ${
                    dayInfo.isWeekend ? 'bg-amber-50/15' : ''
                  }`}>
                    <td className="p-2.5 sm:p-3 font-bold text-slate-900 whitespace-nowrap pt-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${dayInfo.badgeClass}`}>
                          {dayInfo.label}
                        </span>
                        <span className="font-mono text-slate-800 text-xs font-bold">
                          {new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {isCustomDish && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] bg-amber-500 text-white font-semibold">
                            Đã đổi món
                          </span>
                        )}
                        {isCustomCount && !isCleared && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] bg-blue-500 text-white font-semibold">
                            Đã đổi sĩ số
                          </span>
                        )}
                        {isCleared && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] bg-rose-600 text-white font-bold">
                            Đã xóa trắng (0 suất)
                          </span>
                        )}
                      </div>

                      {/* Nút hành động nhanh trên từng ngày - chỉ biểu tượng sửa và xóa, không ghi chữ */}
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          type="button"
                          onClick={() => handleOpenAttendanceForDate(dateStr)}
                          className="p-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors cursor-pointer"
                          title="Sửa danh sách điểm danh ngày này"
                          aria-label="Sửa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleClearDate(dateStr)}
                          className="p-1 rounded bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
                          title="Xóa trắng suất ăn ngày này về 0"
                          aria-label="Xóa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Cột Thực đơn chia 3 dòng nhỏ Sáng / Trưa / Chiều */}
                    <td className="p-2.5 sm:p-3">
                      <div className="space-y-1.5">
                        {/* Dòng 1: SÁNG */}
                        <div
                          onClick={() => {
                            setMealModalState({ date: dateStr, slot: 'morning' });
                            setModalSearch('');
                            setModalCategoryFilter('all');
                            setCustomInputDish('');
                          }}
                          className="group/morning p-2 rounded-lg border bg-amber-50/70 hover:bg-amber-100 border-amber-200/80 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs"
                          title="Nhấp để mở Bảng chọn món ăn Bữa Sáng"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200/90 text-amber-900 whitespace-nowrap shrink-0">
                              <Sunrise className="w-3.5 h-3.5 text-amber-700" />
                              Sáng:
                            </span>
                            <span className="font-semibold text-slate-800 truncate text-xs">
                              {item.dishes.breakfast || item.dishes.snackMorning || 'Cháo gà hạt sen'}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-amber-700 font-bold opacity-80 group-hover/morning:opacity-100 transition-opacity flex items-center gap-0.5 whitespace-nowrap shrink-0 bg-white/70 px-2 py-0.5 rounded-md border border-amber-200">
                            Chọn món <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>

                        {/* Dòng 2: TRƯA */}
                        <div
                          onClick={() => {
                            setMealModalState({ date: dateStr, slot: 'lunch' });
                            setModalSearch('');
                            setModalCategoryFilter('combos');
                            setCustomInputDish('');
                          }}
                          className="group/lunch p-2 rounded-lg border bg-sky-50/70 hover:bg-sky-100 border-sky-200/80 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs"
                          title="Nhấp để mở Bảng chọn món ăn Bữa Trưa (Món chính + Canh)"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-200/90 text-sky-900 whitespace-nowrap shrink-0">
                              <Sun className="w-3.5 h-3.5 text-sky-700" />
                              Trưa:
                            </span>
                            <span className="font-bold text-slate-900 truncate text-xs">
                              {item.dishes.lunchMain} <span className="text-slate-400 font-normal">+</span> <span className="text-slate-700 font-medium">{item.dishes.lunchSoup}</span>
                            </span>
                          </div>
                          <span className="text-[10.5px] text-sky-700 font-bold opacity-80 group-hover/lunch:opacity-100 transition-opacity flex items-center gap-0.5 whitespace-nowrap shrink-0 bg-white/70 px-2 py-0.5 rounded-md border border-sky-200">
                            Chọn món <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>

                        {/* Dòng 3: CHIỀU */}
                        <div
                          onClick={() => {
                            setMealModalState({ date: dateStr, slot: 'afternoon' });
                            setModalSearch('');
                            setModalCategoryFilter('sweet');
                            setCustomInputDish('');
                          }}
                          className="group/afternoon p-2 rounded-lg border bg-purple-50/70 hover:bg-purple-100 border-purple-200/80 transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs"
                          title="Nhấp để mở Bảng chọn món ăn Bữa Chiều (Tráng miệng / Bữa phụ)"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-200/90 text-purple-900 whitespace-nowrap shrink-0">
                              <Sunset className="w-3.5 h-3.5 text-purple-700" />
                              Chiều:
                            </span>
                            <span className="font-semibold text-purple-950 truncate text-xs">
                              {item.dishes.afternoonSnack || 'Bánh flan caramen + Sữa hạt óc chó'}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-purple-700 font-bold opacity-80 group-hover/afternoon:opacity-100 transition-opacity flex items-center gap-0.5 whitespace-nowrap shrink-0 bg-white/70 px-2 py-0.5 rounded-md border border-purple-200">
                            Chọn món <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cột SUẤT NT: Cho phép người dùng nhập trực tiếp con số */}
                    <td className="p-2 sm:p-2.5 text-center align-middle pt-3">
                      <div className="inline-flex flex-col items-center">
                        <input
                          type="number"
                          min="0"
                          value={item.nurseryCount === 0 ? '' : item.nurseryCount}
                          placeholder="0"
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                            handleUpdateCount(dateStr, 'nursery', val);
                          }}
                          className="w-16 sm:w-20 text-center font-bold text-xs py-1.5 px-1 rounded-lg border border-amber-300 bg-amber-50/80 text-amber-950 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden hover:border-amber-400 transition-all shadow-2xs"
                          title="Nhập trực tiếp số suất Nhà Trẻ cho ngày này"
                        />
                      </div>
                    </td>

                    {/* Cột SUẤT MG: Cho phép người dùng nhập trực tiếp con số */}
                    <td className="p-2 sm:p-2.5 text-center align-middle pt-3">
                      <div className="inline-flex flex-col items-center">
                        <input
                          type="number"
                          min="0"
                          value={item.kindergartenCount === 0 ? '' : item.kindergartenCount}
                          placeholder="0"
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                            handleUpdateCount(dateStr, 'kindergarten', val);
                          }}
                          className="w-16 sm:w-20 text-center font-bold text-xs py-1.5 px-1 rounded-lg border border-sky-300 bg-sky-50/80 text-sky-950 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden hover:border-sky-400 transition-all shadow-2xs"
                          title="Nhập trực tiếp số suất Mẫu Giáo cho ngày này"
                        />
                      </div>
                    </td>

                    {/* Cột TỔNG TIỀN CHỢ: Tính toán tự động theo đúng số suất riêng của ngày đó */}
                    <td className="p-2.5 sm:p-3 text-right font-black text-emerald-700 pt-3.5 whitespace-nowrap">
                      {item.totalMoneyPerDay.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="p-2.5 sm:p-3 text-center pt-3.5">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ✓ 16 Cột
                      </span>
                    </td>
                    <td className="p-2.5 sm:p-3 text-center pt-3.5">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ✓ 10 Cột
                      </span>
                    </td>
                    <td className="p-2.5 sm:p-3 text-center pt-3.5">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ✓ 9 Cột
                      </span>
                    </td>
                    <td className="p-2.5 sm:p-3 text-center pt-3.5">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ✓ 12 Cột
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BẢNG CHỌN TOÀN BỘ MÓN ĂN (HIỂN THỊ DẠNG BẢNG RỘNG TÁCH BIỆT, KHÔNG CHIẾM DIỆN TÍCH TABLE) */}
      {mealModalState && currentModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl text-white ${
                    mealModalState.slot === 'morning'
                      ? 'bg-amber-500'
                      : mealModalState.slot === 'lunch'
                      ? 'bg-sky-500'
                      : 'bg-purple-500'
                  }`}
                >
                  {mealModalState.slot === 'morning' && <Sunrise className="w-5 h-5" />}
                  {mealModalState.slot === 'lunch' && <Sun className="w-5 h-5" />}
                  {mealModalState.slot === 'afternoon' && <Sunset className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    <span>
                      BẢNG CHỌN MÓN ĂN -{' '}
                      {mealModalState.slot === 'morning'
                        ? 'BỮA SÁNG'
                        : mealModalState.slot === 'lunch'
                        ? 'BỮA TRƯA (MÓN CHÍNH & CANH)'
                        : 'BỮA CHIỀU (TRÁNG MIỆNG & PHỤ)'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Áp dụng cho ngày:{' '}
                    <strong className="text-amber-300 font-bold">
                      {new Date(mealModalState.date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMealModalState(null)}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thanh công cụ tìm kiếm và lọc danh mục */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
              {/* Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    modalCategoryFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  Toàn bộ món ({allDishes.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('combos')}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    modalCategoryFilter === 'combos'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
                  }`}
                >
                  Combo Trưa ({LUNCH_COMBO_SUGGESTIONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('main')}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    modalCategoryFilter === 'main'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  Món mặn chính
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('soup')}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    modalCategoryFilter === 'soup'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white text-teal-800 hover:bg-teal-50 border border-teal-200'
                  }`}
                >
                  Món canh
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('morning')}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    modalCategoryFilter === 'morning'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
                  }`}
                >
                  Cháo / Súp / Phở / Bún
                </button>
                <button
                  type="button"
                  onClick={() => setModalCategoryFilter('sweet')}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                    modalCategoryFilter === 'sweet'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white text-purple-800 hover:bg-purple-50 border border-purple-200'
                  }`}
                >
                  Chè / Bánh / Sinh tố / Sữa
                </button>
              </div>

              {/* Tìm kiếm và Nhập tên món tùy ý */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm nhanh theo tên món, nguyên liệu, dinh dưỡng..."
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Gõ tên món mới tự do..."
                    value={customInputDish}
                    onChange={(e) => setCustomInputDish(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-amber-300 bg-amber-50/50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
                  />
                  <button
                    type="button"
                    disabled={!customInputDish.trim()}
                    onClick={() => {
                      if (!customInputDish.trim()) return;
                      if (mealModalState.slot === 'morning') {
                        handleUpdateMeal(mealModalState.date, 'morning', { text: customInputDish.trim() });
                      } else if (mealModalState.slot === 'lunch') {
                        handleUpdateMeal(mealModalState.date, 'lunch', { text: customInputDish.trim() });
                      } else {
                        handleUpdateMeal(mealModalState.date, 'afternoon', { text: customInputDish.trim() });
                      }
                      setMealModalState(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                  >
                    + Chọn món này
                  </button>
                </div>
              </div>
            </div>

            {/* Vùng hiển thị toàn bộ danh sách các món ăn (Dạng Lưới Thẻ rõ ràng) */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[50vh] bg-slate-50/50">
              {/* NẾU ĐANG CHỌN TAB COMBO TRƯA */}
              {modalCategoryFilter === 'combos' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {LUNCH_COMBO_SUGGESTIONS.filter(
                    (c) =>
                      c.main.toLowerCase().includes(modalSearch.toLowerCase()) ||
                      c.soup.toLowerCase().includes(modalSearch.toLowerCase())
                  ).map((combo, idx) => {
                    const isSelected =
                      currentModalRecord.dishes.lunchMain === combo.main &&
                      currentModalRecord.dishes.lunchSoup === combo.soup;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (mealModalState.slot === 'lunch') {
                            handleUpdateMeal(mealModalState.date, 'lunch', { main: combo.main, soup: combo.soup });
                          } else if (mealModalState.slot === 'morning') {
                            handleUpdateMeal(mealModalState.date, 'morning', { text: `${combo.main} + ${combo.soup}` });
                          } else {
                            handleUpdateMeal(mealModalState.date, 'afternoon', { text: combo.main });
                          }
                          setMealModalState(null);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-300 shadow-sm'
                            : 'bg-white hover:bg-sky-50/60 border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                            Combo #{idx + 1}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-sky-600 text-white' : 'border border-slate-300 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 text-sm">{combo.main}</div>
                          <div className="text-xs text-sky-700 font-medium mt-1 flex items-center gap-1">
                            <Soup className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{combo.soup}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-sky-800 font-medium">
                          <span>Món mặn + Canh</span>
                          <span className="font-bold text-sky-600">Chọn ngay →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* HIỂN THỊ LƯỚI TOÀN BỘ MÓN ĂN */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                  {filteredModalDishes.map((dish) => {
                    const isSelected =
                      (mealModalState.slot === 'morning' && currentModalRecord.dishes.breakfast === dish.name) ||
                      (mealModalState.slot === 'lunch' &&
                        (currentModalRecord.dishes.lunchMain === dish.name ||
                          currentModalRecord.dishes.lunchSoup === dish.name)) ||
                      (mealModalState.slot === 'afternoon' &&
                        currentModalRecord.dishes.afternoonSnack === dish.name);

                    return (
                      <div
                        key={dish.id}
                        onClick={() => {
                          if (mealModalState.slot === 'morning') {
                            handleUpdateMeal(mealModalState.date, 'morning', { text: dish.name });
                          } else if (mealModalState.slot === 'lunch') {
                            if (dish.category.includes('canh') || dish.defaultMealSlot === 'lunchSoup') {
                              handleUpdateMeal(mealModalState.date, 'lunch', { soup: dish.name });
                            } else {
                              handleUpdateMeal(mealModalState.date, 'lunch', { main: dish.name });
                            }
                          } else {
                            handleUpdateMeal(mealModalState.date, 'afternoon', { text: dish.name });
                          }
                          setMealModalState(null);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 shadow-sm'
                            : 'bg-white hover:bg-amber-50/50 border-slate-200 hover:border-amber-300 shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {dish.category}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300 text-transparent group-hover:border-amber-400'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-950">
                            {dish.name}
                          </div>
                          {dish.description && (
                            <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                              {dish.description}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          {dish.nutritionTags && dish.nutritionTags[0] ? (
                            <span className="text-emerald-700 font-semibold">{dish.nutritionTags[0]}</span>
                          ) : (
                            <span className="text-slate-400">Chuẩn dinh dưỡng</span>
                          )}
                          <span className="font-bold text-emerald-700 group-hover:text-emerald-800">
                            Chọn món →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Modal với các nút hành động */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                {customDishesByDate[mealModalState.date] && (
                  <button
                    type="button"
                    onClick={() => {
                      handleResetDate(mealModalState.date);
                      setMealModalState(null);
                    }}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Khôi phục món gốc cho ngày này
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (mealModalState.slot === 'morning') {
                      handleApplyToAllDates('morning', {
                        breakfast: currentModalRecord.dishes.breakfast,
                        snackMorning: currentModalRecord.dishes.snackMorning,
                      });
                    } else if (mealModalState.slot === 'lunch') {
                      handleApplyToAllDates('lunch', {
                        main: currentModalRecord.dishes.lunchMain,
                        soup: currentModalRecord.dishes.lunchSoup,
                      });
                    } else {
                      handleApplyToAllDates('afternoon', {
                        text: currentModalRecord.dishes.afternoonSnack,
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Áp dụng món này cho tất cả {dateList.length} ngày
                </button>

                <button
                  type="button"
                  onClick={() => setMealModalState(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal In Hồ Sơ Trọn Bộ (6 Biểu Mẫu Chuẩn) */}
      {isPrintModalOpen && (
        <OfficialPrintView
          records={generatedRecords}
          schoolInfo={schoolInfo}
          onClose={() => setIsPrintModalOpen(false)}
          selectedTemplate={selectedTemplate}
        />
      )}

      {/* Modal Kiểm Soát & Sửa Danh Sách Điểm Danh Từng Ngày Bất Kỳ */}
      {dailyAttendanceModalOpen && (
        <DailyAttendanceModal
          isOpen={dailyAttendanceModalOpen}
          initialDate={dailyAttendanceModalDate}
          availableDates={dateList}
          students={students}
          nurseryPrice={nurseryPrice}
          kindergartenPrice={kindergartenPrice}
          defaultNurseryCount={nurseryCount}
          defaultKindergartenCount={kindergartenCount}
          customCountsByDate={customCountsByDate}
          onClose={() => setDailyAttendanceModalOpen(false)}
          onSaveAttendance={handleSaveDailyAttendance}
          onClearDate={handleClearDate}
          onClearWeek={handleClearWeek}
          onClearMonth={handleClearMonth}
          onResetDate={handleResetDate}
        />
      )}

      {/* Modal Xác Nhận Xóa Trắng (Từ thanh công cụ) */}
      {clearConfirmDialog && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Xác Nhận Xóa Trắng{' '}
                  {clearConfirmDialog.type === 'day'
                    ? `Theo Ngày (${clearConfirmDialog.targetDate})`
                    : clearConfirmDialog.type === 'week'
                    ? 'Toàn Bộ Tuần'
                    : 'Toàn Bộ Tháng'}
                </h3>
                <p className="text-xs text-slate-500">
                  Thao tác này sẽ đặt sĩ số suất ăn về 0 cho phạm vi đã chọn.
                </p>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p>
                <strong>Phạm vi xóa trắng:</strong>{' '}
                {clearConfirmDialog.type === 'day' && (
                  <span>
                    Chỉ riêng ngày <strong>{clearConfirmDialog.targetDate}</strong>.
                  </span>
                )}
                {clearConfirmDialog.type === 'week' && (
                  <span>
                    Toàn bộ các ngày trong <strong>tuần</strong> chứa ngày {clearConfirmDialog.targetDate}.
                  </span>
                )}
                {clearConfirmDialog.type === 'month' && (
                  <span>
                    Toàn bộ các ngày trong <strong>tháng</strong> chứa ngày {clearConfirmDialog.targetDate}.
                  </span>
                )}
              </p>
              <p className="text-[11px] text-amber-700">
                💡 Dữ liệu thực đơn vẫn được giữ nguyên. Bạn có thể bấm <strong>&quot;Khôi phục mặc định&quot;</strong> bất cứ lúc nào.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setClearConfirmDialog(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  if (clearConfirmDialog.type === 'day') {
                    handleClearDate(clearConfirmDialog.targetDate);
                  } else if (clearConfirmDialog.type === 'week') {
                    handleClearWeek(clearConfirmDialog.targetDate);
                  } else if (clearConfirmDialog.type === 'month') {
                    handleClearMonth(clearConfirmDialog.targetDate);
                  }
                  setClearConfirmDialog(null);
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

      {/* Toast thông báo Lưu mặc định */}
      {defaultToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-blue-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-blue-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{defaultToast}</span>
          </div>
        </div>
      )}

      {/* Modal Cài Đặt Mặc Định Hệ Thống (Sĩ số, Tiền ăn, Giờ kiểm thực) */}
      {isDefaultModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-blue-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Cog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cài Đặt Mặc Định Hệ Thống
                  </h3>
                  <p className="text-xs text-slate-500">
                    Giá trị cài đặt ở đây sẽ được lưu cố định và tự động áp dụng cho tất cả ngày mới.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDefaultModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Sĩ số ăn */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
                <div className="font-bold text-blue-950 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>1. Sĩ Số Bé Ăn Bán Trú Mặc Định</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Số bé Nhà Trẻ:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={nurseryCount}
                      onChange={(e) => setNurseryCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Số bé Mẫu Giáo:
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={kindergartenCount}
                      onChange={(e) => setKindergartenCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Mức tiền ăn */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>2. Mức Tiền Ăn Mặc Định (VNĐ / Bé / Ngày)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tiền ăn Nhà Trẻ:
                    </label>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={nurseryPrice}
                      onChange={(e) => setNurseryPrice(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tiền ăn Mẫu Giáo:
                    </label>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={kindergartenPrice}
                      onChange={(e) => setKindergartenPrice(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Giờ quy trình kiểm thực */}
              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>3. Khung Giờ Kiểm Thực Mặc Định (Chuẩn BGD&amp;ĐT)</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Giờ nhận hàng (B1):
                    </label>
                    <input
                      type="time"
                      value={defaultStep1Time}
                      onChange={(e) => setDefaultStep1Time(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Giờ sơ chế &amp; nấu (B2):
                    </label>
                    <input
                      type="time"
                      value={defaultStep2Time}
                      onChange={(e) => setDefaultStep2Time(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Giờ nếm &amp; chia ăn (B3):
                    </label>
                    <input
                      type="time"
                      value={defaultStep3Time}
                      onChange={(e) => setDefaultStep3Time(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Giờ lưu mẫu 24h:
                    </label>
                    <input
                      type="time"
                      value={defaultSampleTime}
                      onChange={(e) => setDefaultSampleTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDefaultModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => handleSaveAllAsDefault()}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Lưu &amp; Áp Dụng Mặc Định</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
