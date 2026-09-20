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
} from 'lucide-react';
import { SchoolInfo, MenuItem, StudentRecord, DishItem } from '@/types/preschool';
import { InspectionPrintRecord } from '@/types/lightning';
import { getStandardizedIngredientsForDish } from '@/lib/dish-database';
import OfficialPrintView from '@/components/OfficialPrintView';
import { getStoredDishLibrary } from '@/lib/dish-library';

interface LightningModuleProps {
  schoolInfo: SchoolInfo;
  menuItems: MenuItem[];
  students: StudentRecord[];
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

export default function LightningModule({
  schoolInfo,
  menuItems,
  students,
}: LightningModuleProps) {
  // 1. Inputs cho phân hệ Tia Chớp
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Số lượng bé & tiền ăn mặc định
  const [nurseryCount, setNurseryCount] = useState<number>(() => {
    const nt = students.filter((s) => s.className.includes('Nhà Trẻ') || s.className.includes('Mầm'));
    return nt.length > 0 ? nt.length : 35;
  });
  const [kindergartenCount, setKindergartenCount] = useState<number>(() => {
    const kg = students.filter((s) => !s.className.includes('Nhà Trẻ') && !s.className.includes('Mầm'));
    return kg.length > 0 ? kg.length : 110;
  });

  const [nurseryPrice, setNurseryPrice] = useState<number>(30000);
  const [kindergartenPrice, setKindergartenPrice] = useState<number>(35000);

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
  >({});

  // Lưu số lượng suất Nhà Trẻ & Mẫu Giáo nhập riêng cho từng ngày
  const [customCountsByDate, setCustomCountsByDate] = useState<
    Record<string, { nurseryCount?: number; kindergartenCount?: number }>
  >({});

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

  // Tạo danh sách các ngày trong khoảng thời gian (loại bỏ Thứ 7, CN)
  const dateList = useMemo(() => {
    const dates: string[] = [];
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) return [startDate];

      let curr = new Date(start);
      while (curr <= end && dates.length < 31) {
        // Chỉ lấy từ Thứ 2 đến Thứ 6
        const day = curr.getDay();
        if (day !== 0 && day !== 6) {
          dates.push(curr.toISOString().split('T')[0]);
        }
        curr.setDate(curr.getDate() + 1);
      }
      return dates.length > 0 ? dates : [startDate];
    } catch {
      return [startDate];
    }
  }, [startDate, endDate]);

  // Cập nhật số suất ăn trực tiếp cho 1 ngày
  const handleUpdateCount = (
    dateStr: string,
    field: 'nursery' | 'kindergarten',
    value: number
  ) => {
    setCustomCountsByDate((prev) => {
      const current = prev[dateStr] || {};
      return {
        ...prev,
        [dateStr]: {
          ...current,
          [field === 'nursery' ? 'nurseryCount' : 'kindergartenCount']: value,
        },
      };
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

      return {
        ...prev,
        [dateStr]: updated,
      };
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
      return nextState;
    });
    setMealModalState(null);
  };

  // Khôi phục mặc định cho 1 ngày
  const handleResetDate = (dateStr: string) => {
    setCustomDishesByDate((prev) => {
      const nextState = { ...prev };
      delete nextState[dateStr];
      return nextState;
    });
    setCustomCountsByDate((prev) => {
      const nextState = { ...prev };
      delete nextState[dateStr];
      return nextState;
    });
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
      {/* Header Banner Trích Xuất Hồ Sơ */}
      <div className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck className="w-4 h-4 text-amber-200" />
              <span>Kiểm Soát Hồ Sơ Quy Định Bộ GD&amp;ĐT &amp; Bộ Y Tế</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Phân Hệ: Trích Xuất Hồ Sơ Kiểm Thực 3 Bước &amp; Tiền Ăn
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-3xl">
              Hệ thống trích xuất và quản lý hồ sơ kiểm thực 3 bước, sổ lưu mẫu &amp; tính định mức tiền ăn theo đúng quy chuẩn pháp lý của Bộ GD&amp;ĐT và Bộ Y Tế.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white text-amber-900 hover:bg-amber-50 font-bold px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-5 h-5 text-amber-600" />
            <span>XUẤT IN TOÀN BỘ HỒ SƠ ({dateList.length} NGÀY)</span>
          </button>
        </div>
      </div>

      {/* Control Dashboard: 3 Cột cấu hình nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Cột 1: Chọn khoảng thời gian & Chọn nhanh */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>1. Khoảng Thời Gian Hồ Sơ</span>
              </div>
            </div>

            {/* Quick date presets */}
            <div className="flex items-center gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => {
                  setStartDate('2025-05-12');
                  setEndDate('2025-05-16');
                }}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md text-[11px] font-semibold transition-colors border border-amber-200 cursor-pointer"
              >
                Tuần 1 (12-16/5)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDate('2025-05-19');
                  setEndDate('2025-05-23');
                }}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md text-[11px] font-semibold transition-colors border border-amber-200 cursor-pointer"
              >
                Tuần 2 (19-23/5)
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDate('2025-05-01');
                  setEndDate('2025-05-31');
                }}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-md text-[11px] font-semibold transition-colors border border-amber-200 cursor-pointer"
              >
                Cả tháng 5
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Từ ngày:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Đến ngày:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                />
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <span>Số ngày lập hồ sơ hợp lệ:</span>
            <strong className="font-bold text-sm text-amber-900">{dateList.length} ngày (T2-T6)</strong>
          </div>
        </div>

        {/* Cột 2: Đơn Giá & Khẩu Phần */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>2. Đơn Giá &amp; Khẩu Phần</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tiền ăn Nhà Trẻ:</label>
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
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">đ</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tiền ăn Mẫu Giáo:</label>
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
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">đ</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Suất NT mặc định:</label>
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
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">bé</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Suất MG mặc định:</label>
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
                    className="w-full text-xs font-bold border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-amber-500 bg-slate-50"
                  />
                  <span className="absolute right-2 top-2 text-[11px] text-slate-400">bé</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 leading-tight">
            💡 <strong>Nhập trực tiếp:</strong> Bạn có thể gõ thay đổi số suất riêng của từng ngày tại 2 cột <strong>Suất NT</strong> &amp; <strong>Suất MG</strong> ở bảng bên dưới.
          </div>
        </div>

        {/* Cột 3: Tùy chọn Biểu mẫu & Nút In */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>3. Mẫu Cần Xuất In</span>
            </div>

            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as any)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">★ Trọn Bộ Đầy Đủ 6 Biểu Mẫu (Chuẩn PDF GD&amp;ĐT)</option>
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
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer transform active:scale-98"
          >
            <Printer className="w-5 h-5" />
            <span>XUẤT IN TOÀN BỘ HỒ SƠ ({dateList.length} NGÀY)</span>
          </button>
        </div>
      </div>

      {/* Preview Card List & Table */}
      <div className="w-full bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Bảng Tổng Hợp Dữ Liệu Hồ Sơ Kiểm Thực
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Thực đơn chia rõ 3 bữa <strong className="text-amber-700">Sáng • Trưa • Chiều</strong>. Nhấp vào bữa để mở bảng chọn toàn bộ món ăn.
              </p>
            </div>
          </div>
          {(Object.keys(customDishesByDate).length > 0 || Object.keys(customCountsByDate).length > 0) && (
            <button
              type="button"
              onClick={() => {
                setCustomDishesByDate({});
                setCustomCountsByDate({});
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start sm:self-auto px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục tất cả về mặc định</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs text-left text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-2.5 sm:p-3 whitespace-nowrap">Ngày</th>
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

                return (
                  <tr key={dateStr} className="hover:bg-amber-50/30 transition-colors align-top">
                    <td className="p-2.5 sm:p-3 font-bold text-slate-900 whitespace-nowrap pt-3.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{new Date(dateStr).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {isCustomDish && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] bg-amber-500 text-white font-semibold">
                            Đã đổi món
                          </span>
                        )}
                        {isCustomCount && (
                          <span className="px-1.5 py-0.5 rounded text-[9.5px] bg-blue-500 text-white font-semibold">
                            Đã đổi sĩ số
                          </span>
                        )}
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
    </div>
  );
}
