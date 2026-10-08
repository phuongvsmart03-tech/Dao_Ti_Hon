'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Sparkles,
  Utensils,
  Soup,
  Coffee,
  Apple,
  GlassWater,
  Flame,
  RotateCcw,
  CheckCircle2,
  ChefHat,
  Scale,
  Loader2,
  Layers,
  ArrowRight,
  Info,
  ShieldCheck,
  Save,
  X,
  BookOpen,
  Check,
  ExternalLink,
  Sunrise,
  Sun,
  Sunset,
} from 'lucide-react';
import { DishItem, DishCategory, MenuItem, SchoolInfo } from '@/types/preschool';
import {
  getStoredDishLibrary,
  saveDishLibrary,
  resetDishLibraryToDefault,
  addDishToLibrary,
  syncAllDishesToCloud,
  MASTER_SEED_BACKUP_DISHES,
} from '@/lib/dish-library';
import { classifyDish } from '@/lib/dish-classifier';
import { getStandardizedIngredientsForDish } from '@/lib/dish-database';
import { DishIngredient } from '@/types/lightning';

export const STANDARD_CLEAN_INGREDIENTS = [
  'Đường kính',
  'Dầu ăn',
  'Nước mắm',
  'Muối I-ốt',
  'Hạt nêm',
  'Thịt lợn nạc',
  'Thịt heo xay',
  'Thịt bò thăn',
  'Thịt gà ta',
  'Cá Basa fillet',
  'Tôm thẻ tươi',
  'Tôm tươi băm',
  'Trứng gà ta',
  'Đậu phụ non',
  'Gạo tẻ',
  'Bánh phở tươi',
  'Bún tươi',
  'Bánh hỏi tươi',
  'Khoai tây',
  'Cà rốt',
  'Bí đỏ',
  'Bí xanh (Bí đao)',
  'Cà chua',
  'Rau ngót',
  'Rau mồng tơi',
  'Rau cải xanh',
  'Cải bó xôi',
  'Hành lá',
  'Hành hoa tươi',
  'Ngò rí',
  'Sữa tươi',
  'Sữa chua',
  'Chuối tiêu',
  'Đu đủ chín',
  'Dưa hấu',
  'Cam sành',
  'Xoài chín',
  'Thanh long',
];

interface MenuManagementProps {
  items?: MenuItem[];
  onSaveItem?: (item: MenuItem) => void;
  onDeleteItem?: (id: string) => void;
  onPrintPreview?: () => void;
  onOpenAiAssistant?: () => void;
  studentsCount?: number;
  schoolInfo?: SchoolInfo;
  onSyncToStep1?: (newRecords: any) => void;
  onSyncToFinance?: (tx: any) => void;
}

export default function MenuManagement({
  studentsCount = 80,
  schoolInfo,
}: MenuManagementProps) {
  // Kho món ăn chính từ localStorage
  const [dishLibrary, setDishLibrary] = useState<DishItem[]>(() => getStoredDishLibrary());
  // Bộ lọc 3 bữa ăn cơ sở: Sáng - Trưa - Xế
  const [selectedMealFilter, setSelectedMealFilter] = useState<'all' | 'breakfast' | 'lunch' | 'snack'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);
  const [selectedDishForBOM, setSelectedDishForBOM] = useState<DishItem | null>(null);
  const [deletingDish, setDeletingDish] = useState<DishItem | null>(null);
  const [confirmRestoreModal, setConfirmRestoreModal] = useState(false);
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false);

  // BOM Editing State
  const [editableBOM, setEditableBOM] = useState<any[]>([]);
  const [bomSuccessMessage, setBomSuccessMessage] = useState(false);
  const [bomSaving, setBomSaving] = useState(false);

  // Thống kê số lượng món theo 3 bữa của cơ sở
  const breakfastCount = useMemo(() => {
    return dishLibrary.filter(
      (d) => d.category === 'Bữa sáng' || d.category === 'Bữa sáng & Bữa xế' || d.defaultMealSlot === 'breakfast'
    ).length;
  }, [dishLibrary]);

  const lunchCount = useMemo(() => {
    return dishLibrary.filter(
      (d) =>
        d.category === 'Món mặn chính' ||
        d.category === 'Món canh' ||
        d.category === 'Món ăn kèm & Cơm' ||
        d.defaultMealSlot === 'lunchMain' ||
        d.defaultMealSlot === 'lunchSoup' ||
        d.defaultMealSlot === 'lunchStaple'
    ).length;
  }, [dishLibrary]);

  const snackCount = useMemo(() => {
    return dishLibrary.filter(
      (d) =>
        d.category === 'Bữa xế (phụ)' ||
        d.category === 'Tráng miệng' ||
        d.category === 'Đồ uống & Nước ép' ||
        d.defaultMealSlot === 'afternoonSnack' ||
        d.defaultMealSlot === 'snackMorning' ||
        d.defaultMealSlot === 'lunchDessert'
    ).length;
  }, [dishLibrary]);

  // Sync editable BOM when modal opens
  useEffect(() => {
    if (selectedDishForBOM) {
      const initial = resolveDishIngredients(selectedDishForBOM);
      setEditableBOM(JSON.parse(JSON.stringify(initial)));
      setBomSuccessMessage(false);
    } else {
      setEditableBOM([]);
      setBomSuccessMessage(false);
    }
  }, [selectedDishForBOM]);

  // Options for suppliers and producers
  const supplierOptions = useMemo(() => {
    const list: string[] = [];
    if (schoolInfo?.meatSupplierName) list.push(schoolInfo.meatSupplierName);
    if (schoolInfo?.vegSupplierName) list.push(schoolInfo.vegSupplierName);
    if (schoolInfo?.seafoodSupplierName) list.push(schoolInfo.seafoodSupplierName);
    if (schoolInfo?.drySupplierName) list.push(schoolInfo.drySupplierName);
    if (schoolInfo?.dryProducerName) list.push(schoolInfo.dryProducerName);

    const standardProviders = [
      'Cơ sở sản xuất & giết mổ thịt an toàn',
      'Hợp tác xã Rau an toàn & Nông sản sạch',
      'Công ty CP Thủy hải sản sạch',
      'Nhà máy Chế biến gia vị & Đồ khô',
      'Công ty Cổ phần Sữa Việt Nam',
      'Cơ sở chế biến thực phẩm chuẩn hóa',
    ];
    standardProviders.forEach((p) => {
      if (!list.includes(p)) list.push(p);
    });
    return list;
  }, [schoolInfo]);

  // New Dish State
  const [newDish, setNewDish] = useState<Partial<DishItem>>({
    name: '',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu đạm', 'Dễ tiêu'],
    caloriesEstimate: 160,
    description: '',
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Danh mục phân loại chuẩn cơ sở đáp ứng đầy đủ 3 bữa: Sáng, Trưa (chính), Xế (phụ)
  const categories: { id: string; label: string; icon: any; color: string }[] = [
    { id: 'all', label: 'Tất cả kho món', icon: Utensils, color: 'bg-slate-800 text-white' },
    { id: 'Bữa sáng', label: 'Bữa sáng (5 món)', icon: Sunrise, color: 'bg-orange-600 text-white' },
    { id: 'Món mặn chính', label: 'Trưa - Món mặn (8 món)', icon: Utensils, color: 'bg-amber-600 text-white' },
    { id: 'Món canh', label: 'Trưa - Món canh (6 món)', icon: Soup, color: 'bg-emerald-600 text-white' },
    { id: 'Bữa xế (phụ)', label: 'Bữa xế phụ (5 món)', icon: Sunset, color: 'bg-purple-600 text-white' },
    { id: 'Đồ uống & Nước ép', label: 'Đồ uống & Nước ép', icon: GlassWater, color: 'bg-cyan-600 text-white' },
    { id: 'Tráng miệng', label: 'Tráng miệng', icon: Apple, color: 'bg-rose-600 text-white' },
    { id: 'Món ăn kèm & Cơm', label: 'Cơm & Ăn kèm', icon: Layers, color: 'bg-indigo-600 text-white' },
  ];

  // Trích xuất tất cả các tag dinh dưỡng có trong kho món
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    dishLibrary.forEach((d) => {
      d.nutritionTags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [dishLibrary]);

  // Bộ lọc danh sách món ăn kết hợp 3 bữa + Danh mục + Từ khóa
  const filteredDishes = useMemo(() => {
    return dishLibrary.filter((dish) => {
      const matchSearch =
        searchTerm === '' ||
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.nutritionTags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchMeal = true;
      if (selectedMealFilter === 'breakfast') {
        matchMeal =
          dish.category === 'Bữa sáng' ||
          dish.category === 'Bữa sáng & Bữa xế' ||
          dish.defaultMealSlot === 'breakfast';
      } else if (selectedMealFilter === 'lunch') {
        matchMeal =
          dish.category === 'Món mặn chính' ||
          dish.category === 'Món canh' ||
          dish.category === 'Món ăn kèm & Cơm' ||
          dish.defaultMealSlot === 'lunchMain' ||
          dish.defaultMealSlot === 'lunchSoup' ||
          dish.defaultMealSlot === 'lunchStaple';
      } else if (selectedMealFilter === 'snack') {
        matchMeal =
          dish.category === 'Bữa xế (phụ)' ||
          dish.category === 'Tráng miệng' ||
          dish.category === 'Đồ uống & Nước ép' ||
          dish.defaultMealSlot === 'afternoonSnack' ||
          dish.defaultMealSlot === 'snackMorning' ||
          dish.defaultMealSlot === 'lunchDessert';
      }

      const matchCategory =
        selectedCategory === 'all' ||
        dish.category === selectedCategory ||
        (selectedCategory === 'Bữa sáng' && (dish.category === 'Bữa sáng & Bữa xế' || dish.defaultMealSlot === 'breakfast')) ||
        (selectedCategory === 'Bữa xế (phụ)' && (dish.category === 'Bữa xế (phụ)' || dish.defaultMealSlot === 'afternoonSnack'));

      const matchTag =
        selectedTag === 'all' || dish.nutritionTags?.includes(selectedTag);

      return matchSearch && matchMeal && matchCategory && matchTag;
    });
  }, [dishLibrary, searchTerm, selectedMealFilter, selectedCategory, selectedTag]);

  // AI Auto-Analyze Dish Name
  const handleAiAnalyzeDish = async () => {
    const name = newDish.name?.trim();
    if (!name) {
      alert('Vui lòng nhập tên món ăn trước khi nhấn AI phân tích!');
      return;
    }

    // Tiền phân loại theo chuẩn mầm non
    const preClassified = classifyDish(name);
    const categoryToSend = newDish.category || preClassified.category;
    const slotToSend = newDish.defaultMealSlot || preClassified.defaultMealSlot;

    setIsAiAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'decompose_dish',
          payload: {
            dishName: name,
            category: categoryToSend,
            mealSlot: slotToSend,
            ageGroup: 'Mẫu giáo (3-6 tuổi)',
            studentCount: studentsCount || 80,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const data = json.data;
        if (data) {
          setAiAnalysisResult(data);

          const finalCategory: DishCategory = data.category || categoryToSend || preClassified.category;
          const finalSlot = data.mealSlot || slotToSend || preClassified.defaultMealSlot;
          const calo = data.totalCalories || preClassified.caloriesEstimate || 120;

          setNewDish((prev) => ({
            ...prev,
            category: finalCategory,
            defaultMealSlot: finalSlot,
            caloriesEstimate: calo > 0 ? calo : 150,
            nutritionTags: preClassified.nutritionTags,
            description: data.cookingInstructions || preClassified.description,
            ingredients: data.ingredients,
          }));
        }
      }
    } catch (err) {
      console.error('AI Dish Analysis Error:', err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  // Thêm món mới vào kho
  const handleAddNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name?.trim()) return;

    const classified = classifyDish(newDish.name);

    const item: DishItem = {
      id: `dish-custom-${Date.now()}`,
      name: newDish.name.trim(),
      category: (newDish.category as DishCategory) || classified.category || 'Món mặn chính',
      defaultMealSlot: newDish.defaultMealSlot || classified.defaultMealSlot || 'lunchMain',
      suitableAge: newDish.suitableAge || 'Tất cả lứa tuổi',
      nutritionTags: newDish.nutritionTags && newDish.nutritionTags.length > 0 ? newDish.nutritionTags : classified.nutritionTags,
      caloriesEstimate: Number(newDish.caloriesEstimate) || classified.caloriesEstimate || 120,
      description: newDish.description || classified.description || '',
      ingredients: aiAnalysisResult?.ingredients || newDish.ingredients,
    };

    const updated = addDishToLibrary(item);
    setDishLibrary(updated);
    setIsAddingNew(false);
    setAiAnalysisResult(null);

    // Đồng bộ tức thì lên đám mây Turso Server
    syncAllDishesToCloud(updated).catch(() => {});

    setNewDish({
      name: '',
      category: 'Món mặn chính',
      defaultMealSlot: 'lunchMain',
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: ['Giàu đạm', 'Dễ tiêu'],
      caloriesEstimate: 160,
      description: '',
    });
  };

  // Cập nhật món ăn
  const handleSaveEditDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    const updated = dishLibrary.map((d) => (d.id === editingDish.id ? editingDish : d));
    setDishLibrary(updated);
    saveDishLibrary(updated);
    setEditingDish(null);
  };

  // Xóa món ăn khỏi kho
  const handleDeleteDish = (dish: DishItem) => {
    setDeletingDish(dish);
  };

  const handleConfirmDeleteDish = () => {
    if (!deletingDish) return;
    const updated = dishLibrary.filter((d) => d.id !== deletingDish.id);
    setDishLibrary(updated);
    saveDishLibrary(updated);
    setDeletingDish(null);
  };

  // Khôi phục 30 món gốc
  const handleRestoreDefaultDishes = () => {
    setConfirmRestoreModal(true);
  };

  const handleConfirmRestoreDefaultDishes = () => {
    const restored = resetDishLibraryToDefault();
    setDishLibrary(restored);
    setConfirmRestoreModal(false);
    setShowRestoreSuccess(true);
    setTimeout(() => setShowRestoreSuccess(false), 3000);
  };

  // Helper: Trích xuất chính xác thành phần nguyên liệu của món (ưu tiên dữ liệu đã bóc tách từ AI/người dùng)
  const resolveDishIngredients = (d: DishItem) => {
    if (d.ingredients && d.ingredients.length > 0) {
      return d.ingredients.map((ing) => ({
        name: ing.name,
        type: (ing.type || 'tuoi_song') as 'tuoi_song' | 'kho',
        unit: ing.unit || 'kg',
        role: (ing.category === 'Gia vị & dầu mỡ' ? 'Gia vị' : 'NL chính') as string,
        rawPerPortionGrams: ing.rawGramsPerPortion || 30,
        cleanPerPortionGrams: ing.cleanGramsPerPortion || 25,
        wasteRate: ing.wasteRatePercent || 0,
        pricePerKg: ing.pricePerKg || 35000,
        protein: Math.round(((ing.proteinPer100g || 0) * (ing.rawGramsPerPortion || 30) / 100) * 10) / 10,
        fat: Math.round(((ing.lipidPer100g || 0) * (ing.rawGramsPerPortion || 30) / 100) * 10) / 10,
        carbs: Math.round(((ing.glucidPer100g || 0) * (ing.rawGramsPerPortion || 30) / 100) * 10) / 10,
        calories: Math.round(((ing.caloriesPer100g || 50) * (ing.rawGramsPerPortion || 30) / 100) * 10) / 10,
        supplierName: ing.supplierName || schoolInfo?.meatSupplierName || 'Vựa thực phẩm sạch',
        producerName: ing.producerName || ing.supplierName || 'Cơ sở sản xuất chuẩn hóa',
        supplierAddress: ing.supplierAddress || '',
        producerAddress: ing.producerAddress || '',
      }));
    }
    return getStandardizedIngredientsForDish(d.name, d.category);
  };

  // Các thao tác điều chỉnh bảng định lượng BOM
  const handleUpdateBOMRow = (index: number, patch: Partial<any>) => {
    setEditableBOM((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const handleAddBOMRow = () => {
    setEditableBOM((prev) => [
      ...prev,
      {
        name: 'Đường kính',
        type: 'kho',
        unit: 'kg',
        role: 'Gia vị',
        rawPerPortionGrams: 5,
        cleanPerPortionGrams: 5,
        wasteRate: 0,
        pricePerKg: 25000,
        protein: 0,
        fat: 0,
        carbs: 5,
        calories: 20,
        supplierName: schoolInfo?.drySupplierName || 'Nhà máy Chế biến gia vị & Đồ khô',
        producerName: schoolInfo?.dryProducerName || 'Nhà máy Chế biến gia vị & Đồ khô',
        supplierAddress: schoolInfo?.drySupplierAddress || '',
        producerAddress: schoolInfo?.dryProducerAddress || '',
      },
    ]);
  };

  const handleRemoveBOMRow = (index: number) => {
    setEditableBOM((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetBOMToDefault = () => {
    if (!selectedDishForBOM) return;
    const defaultIngredients = getStandardizedIngredientsForDish(selectedDishForBOM.name, selectedDishForBOM.category);
    setEditableBOM(JSON.parse(JSON.stringify(defaultIngredients)));
  };

  const handleSaveBOM = async () => {
    if (!selectedDishForBOM) return;
    setBomSaving(true);
    try {
      const totalCalories = editableBOM.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);

      const convertedIngredients: any[] = editableBOM.map((item, idx) => ({
        id: `ing-${selectedDishForBOM.id}-${idx}-${Date.now()}`,
        name: item.name?.trim() || 'Nguyên liệu',
        type: item.type === 'tuoi_song' ? 'tuoi_song' : 'kho',
        unit: item.unit || 'kg',
        category: item.type === 'tuoi_song' ? 'Thịt cá tươi sống' : 'Gia vị & dầu mỡ',
        rawGramsPerPortion: Number(item.rawPerPortionGrams) || 0,
        cleanGramsPerPortion: Number(item.cleanPerPortionGrams) || 0,
        wasteRatePercent: Number(item.wasteRate) || 0,
        pricePerKg: Number(item.pricePerKg) || 0,
        caloriesPer100g: item.rawPerPortionGrams > 0 ? Math.round(((Number(item.calories) || 0) / item.rawPerPortionGrams) * 100) : 0,
        proteinPer100g: item.rawPerPortionGrams > 0 ? Math.round(((Number(item.protein) || 0) / item.rawPerPortionGrams) * 100 * 10) / 10 : 0,
        lipidPer100g: item.rawPerPortionGrams > 0 ? Math.round(((Number(item.fat) || 0) / item.rawPerPortionGrams) * 100 * 10) / 10 : 0,
        glucidPer100g: item.rawPerPortionGrams > 0 ? Math.round(((Number(item.carbs) || 0) / item.rawPerPortionGrams) * 100 * 10) / 10 : 0,
        supplierName: item.supplierName?.trim() || schoolInfo?.meatSupplierName || 'Cơ sở chuẩn hóa',
        producerName: item.producerName?.trim() || item.supplierName?.trim() || 'Cơ sở sản xuất chuẩn hóa',
        supplierAddress: item.supplierAddress || '',
        producerAddress: item.producerAddress || '',
      }));

      const updatedDish: DishItem = {
        ...selectedDishForBOM,
        caloriesEstimate: Math.round(totalCalories) || selectedDishForBOM.caloriesEstimate || 150,
        ingredients: convertedIngredients,
      };

      const updatedLibrary = dishLibrary.map((d) => (d.id === selectedDishForBOM.id ? updatedDish : d));
      setDishLibrary(updatedLibrary);
      saveDishLibrary(updatedLibrary);
      setSelectedDishForBOM(updatedDish);

      // Đồng bộ ngay lập tức lên server và broadcast qua BroadcastChannel
      await syncAllDishesToCloud(updatedLibrary);

      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const bc = new BroadcastChannel('mamnon_sync_channel');
          bc.postMessage({ type: 'DISH_BOM_UPDATED', dishId: updatedDish.id });
          bc.close();
        } catch {}
      }

      setBomSuccessMessage(true);
      setTimeout(() => setBomSuccessMessage(false), 3500);
    } catch (e) {
      console.error('Lỗi khi lưu bảng định lượng BOM:', e);
      alert('Có lỗi khi lưu định lượng BOM. Vui lòng thử lại!');
    } finally {
      setBomSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Thông báo vai trò Quản trị */}
      <div className="bg-gradient-to-r from-[#0a2550] via-[#103a75] to-[#0c2e62] text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-blue-600/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
              <span className="text-blue-300 font-bold flex items-center gap-1.5 bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-400/30">
                <Utensils className="w-3.5 h-3.5 text-blue-300" />
                Kho Quản Trị Món Ăn &amp; Dinh Dưỡng
              </span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="text-blue-100">Đồng bộ hồ sơ kiểm thực</span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="font-mono text-blue-200 font-semibold">{dishLibrary.length} món trong kho</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 drop-shadow-xs">
              Kho Món Ăn &amp; Công Thức Dinh Dưỡng Mầm Non
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-3xl leading-relaxed font-normal">
              Quản lý danh mục món ăn chuẩn cơ sở, định lượng Calo, bóc tách nguyên liệu sạch (BOM) và tỷ lệ hao hụt tự động tính theo số lượng học sinh.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleRestoreDefaultDishes}
              className="px-3.5 py-2.5 bg-blue-900/70 hover:bg-blue-800 text-blue-100 border border-blue-400/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              title="Khôi phục nguyên bản 30 món ăn gốc chuẩn cơ sở"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-300" />
              <span>Khôi phục 30 món gốc</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAddingNew(!isAddingNew);
                setAiAnalysisResult(null);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer border border-blue-400/40"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{isAddingNew ? 'Đóng Form' : '+ Thêm món mới & AI'}</span>
            </button>
          </div>
        </div>

        {/* Restore Toast Banner */}
        {showRestoreSuccess && (
          <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Đã khôi phục thành công toàn bộ kho món ăn về 30 món chuẩn cơ sở!
          </div>
        )}
      </div>

      {/* 2. Form Thêm món mới & AI Bóc tách */}
      {isAddingNew && (
        <div className="p-5 bg-gradient-to-br from-amber-50/90 via-blue-50/70 to-indigo-50/90 border-2 border-indigo-200 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500 text-white rounded-lg shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-indigo-950">
                Thêm món ăn mới vào Kho & Phân tích Dinh dưỡng AI
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-100 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAddNewDish} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Tên món ăn mới <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="VD: Nước Chanh, Cá basa kho thơm, Canh bí đỏ thịt bằm..."
                    value={newDish.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      if (!name.trim()) {
                        setNewDish((prev) => ({ ...prev, name }));
                        return;
                      }
                      const classified = classifyDish(name);
                      setNewDish((prev) => ({
                        ...prev,
                        name,
                        category: classified.category,
                        defaultMealSlot: classified.defaultMealSlot,
                        caloriesEstimate: classified.caloriesEstimate,
                        nutritionTags: classified.nutritionTags,
                        description: classified.description,
                      }));
                    }}
                    className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-semibold text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={handleAiAnalyzeDish}
                    disabled={isAiAnalyzing || !newDish.name?.trim()}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                    title="AI tự động phân loại, tính Calo và bóc tách nguyên liệu chuẩn mầm non"
                  >
                    {isAiAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI đang phân tích...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                        <span>AI Phân tích</span>
                      </>
                    )}
                  </button>
                </div>
                {newDish.name && newDish.name.trim().length > 1 && (
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      AI nhận diện: <strong>{newDish.category}</strong> • Định mức ~<strong>{newDish.caloriesEstimate || 50}</strong> Kcal
                    </span>
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-800 mb-1">Phân loại món &amp; Bữa ăn</label>
                <select
                  value={newDish.category}
                  onChange={(e) => {
                    const cat = e.target.value as DishCategory;
                    let slot: any = 'lunchMain';
                    if (cat === 'Bữa sáng') slot = 'breakfast';
                    else if (cat === 'Bữa xế (phụ)') slot = 'afternoonSnack';
                    else if (cat === 'Món canh') slot = 'lunchSoup';
                    else if (cat === 'Tráng miệng') slot = 'lunchDessert';
                    else if (cat === 'Đồ uống & Nước ép') slot = 'snackMorning';
                    else if (cat === 'Món ăn kèm & Cơm') slot = 'lunchStaple';
                    setNewDish({ ...newDish, category: cat, defaultMealSlot: slot });
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Bữa sáng">1. Bữa Sáng (Ăn sáng dinh dưỡng)</option>
                  <option value="Món mặn chính">2. Bữa Trưa (chính) - Món mặn</option>
                  <option value="Món canh">2. Bữa Trưa (chính) - Món canh</option>
                  <option value="Bữa xế (phụ)">3. Bữa Xế (phụ) (Ăn nhẹ chiều)</option>
                  <option value="Đồ uống & Nước ép">Đồ uống &amp; Sữa hạt</option>
                  <option value="Tráng miệng">Tráng miệng &amp; Hoa quả</option>
                  <option value="Món ăn kèm & Cơm">Món ăn kèm &amp; Cơm dẻo</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-800 mb-1">Ước tính Calo (Kcal/suất)</label>
                <input
                  type="number"
                  value={newDish.caloriesEstimate}
                  onChange={(e) => setNewDish({ ...newDish, caloriesEstimate: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold text-amber-900 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                />
              </div>
            </div>

            {/* AI Breakdown Result Preview */}
            {aiAnalysisResult && (
              <div className="p-3.5 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-emerald-600" />
                    AI đã bóc tách {aiAnalysisResult.ingredients?.length || 0} nguyên liệu chuẩn mầm non:
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    ~{aiAnalysisResult.totalCalories || newDish.caloriesEstimate} Kcal / suất
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiAnalysisResult.ingredients?.map((ing: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-medium flex items-center gap-1.5"
                    >
                      <span className="font-bold text-slate-900">{ing.name}</span>
                      <span className="text-indigo-600 font-mono text-[10px]">({ing.rawGramsPerPortion || 30}g)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-700 font-bold">Từ khóa dinh dưỡng:</span>
                <input
                  type="text"
                  placeholder="Nhập tag (VD: Giàu sắt, Omega-3...)"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newTagInput.trim()) {
                        setNewDish({
                          ...newDish,
                          nutritionTags: [...(newDish.nutritionTags || []), newTagInput.trim()],
                        });
                        setNewTagInput('');
                      }
                    }
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTagInput.trim()) {
                      setNewDish({
                        ...newDish,
                        nutritionTags: [...(newDish.nutritionTags || []), newTagInput.trim()],
                      });
                      setNewTagInput('');
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg cursor-pointer"
                >
                  + Thêm tag
                </button>
                <div className="flex flex-wrap gap-1 ml-1">
                  {newDish.nutritionTags?.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Lưu món vào Kho Thư Viện</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Toolbar: Tìm kiếm, Bộ lọc danh mục & Tags */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm món ăn, nguyên liệu, từ khóa dinh dưỡng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-slate-50/50 focus:bg-white transition-all font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Counts and Info */}
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>Hiển thị: </span>
            <span className="font-bold text-indigo-950 font-mono text-sm bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
              {filteredDishes.length} / {dishLibrary.length} món
            </span>
          </div>
        </div>

        {/* Thanh chọn 3 bữa chuẩn cơ sở: Bữa Sáng - Bữa Trưa (chính) - Bữa Xế (phụ) */}
        <div className="p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-2.5 pr-1 shrink-0">
            Khẩu phần 3 bữa:
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedMealFilter('all');
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedMealFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-slate-600" />
            <span>Tất cả kho món ({dishLibrary.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMealFilter('breakfast');
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedMealFilter === 'breakfast'
                ? 'bg-orange-500 text-white shadow-xs border border-orange-600 font-extrabold'
                : 'text-orange-950 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/60'
            }`}
          >
            <Sunrise className="w-3.5 h-3.5" />
            <span>1. Bữa Sáng ({breakfastCount} món)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMealFilter('lunch');
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedMealFilter === 'lunch'
                ? 'bg-blue-600 text-white shadow-xs border border-blue-700 font-extrabold'
                : 'text-blue-950 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>2. Bữa Trưa (chính) ({lunchCount} món)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMealFilter('snack');
              setSelectedCategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              selectedMealFilter === 'snack'
                ? 'bg-purple-600 text-white shadow-xs border border-purple-700 font-extrabold'
                : 'text-purple-950 bg-purple-50/80 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <Sunset className="w-3.5 h-3.5" />
            <span>3. Bữa Xế (phụ) ({snackCount} món)</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? dishLibrary.length
                : dishLibrary.filter((d) => d.category === cat.id).length;
            const IconComponent = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Lọc theo vi chất:</span>
            <button
              type="button"
              onClick={() => setSelectedTag('all')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer ${
                selectedTag === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả tag
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(selectedTag === tag ? 'all' : tag)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Grid Món Ăn Trong Kho */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDishes.map((dish) => {
          const ingredients = resolveDishIngredients(dish);
          const isCoreDish = MASTER_SEED_BACKUP_DISHES.some((m) => m.name === dish.name);

          // Get category badge color & meal label
          let catBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
          let mealLabel = 'Bữa trưa (chính)';
          let mealBadgeClass = 'bg-blue-50 text-blue-800 border-blue-200';

          if (dish.category === 'Bữa sáng' || dish.category === 'Bữa sáng & Bữa xế' || dish.defaultMealSlot === 'breakfast') {
            catBadgeClass = 'bg-orange-100 text-orange-900 border-orange-300';
            mealLabel = '1. Bữa Sáng';
            mealBadgeClass = 'bg-orange-50 text-orange-800 border-orange-200';
          } else if (dish.category === 'Bữa xế (phụ)' || dish.defaultMealSlot === 'afternoonSnack') {
            catBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300';
            mealLabel = '3. Bữa Xế (phụ)';
            mealBadgeClass = 'bg-purple-50 text-purple-800 border-purple-200';
          } else if (dish.category === 'Món canh') {
            catBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
            mealLabel = '2. Trưa (Canh)';
            mealBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          } else if (dish.category === 'Đồ uống & Nước ép') {
            catBadgeClass = 'bg-cyan-100 text-cyan-900 border-cyan-300';
            mealLabel = 'Đồ uống xế';
            mealBadgeClass = 'bg-cyan-50 text-cyan-800 border-cyan-200';
          } else if (dish.category === 'Tráng miệng') {
            catBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300';
            mealLabel = 'Tráng miệng';
            mealBadgeClass = 'bg-rose-50 text-rose-800 border-rose-200';
          } else if (dish.category === 'Món ăn kèm & Cơm') {
            catBadgeClass = 'bg-indigo-100 text-indigo-900 border-indigo-300';
            mealLabel = '2. Trưa (Cơm)';
            mealBadgeClass = 'bg-indigo-50 text-indigo-800 border-indigo-200';
          }

          return (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-4 space-y-3">
                {/* Header card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${mealBadgeClass}`}>
                        {mealLabel}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${catBadgeClass}`}>
                        {dish.category}
                      </span>
                      {isCoreDish ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          30 Món chốt
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          Món bổ sung
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-950 transition-colors">
                      {dish.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      {dish.caloriesEstimate || 150} Kcal
                    </span>
                  </div>
                </div>

                {/* Description */}
                {dish.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                    {dish.description}
                  </p>
                )}

                {/* Nutrition Tags */}
                <div className="flex flex-wrap gap-1">
                  {dish.nutritionTags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Ingredients snippet preview */}
                <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <ChefHat className="w-3.5 h-3.5 text-blue-700" />
                      Nguyên liệu bóc tách ({ingredients.length} thành phần):
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-2 gap-y-1">
                    {ingredients.slice(0, 4).map((ing, idx) => (
                      <span key={idx} className="inline-flex items-center gap-0.5">
                        <span className="font-semibold text-slate-800">• {ing.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({ing.rawPerPortionGrams}g)</span>
                      </span>
                    ))}
                    {ingredients.length > 4 && (
                      <span className="text-[10px] text-blue-700 font-bold self-center">
                        +{ingredients.length - 4} loại gia vị khác...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDishForBOM(dish)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Sửa định lượng BOM &amp; NCC</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingDish(dish)}
                    className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                    title="Chỉnh sửa thông tin món"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDish(dish)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Xóa món khỏi kho thư viện"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Không tìm thấy món ăn phù hợp</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục món khác, hoặc nhấn &quot;Khôi phục 30 món gốc&quot; để nạp lại dữ liệu.
          </p>
          <button
            type="button"
            onClick={handleRestoreDefaultDishes}
            className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Khôi phục 30 món ăn gốc
          </button>
        </div>
      )}

      {/* 5. Modal Chỉnh Sửa Định Lượng BOM & Nhà Cung Cấp Chi Tiết */}
      {selectedDishForBOM && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Bóc tách định lượng BOM &amp; Nhà cung cấp: <span className="text-amber-300 font-extrabold">{selectedDishForBOM.name}</span>
                  </h3>
                  <span className="text-xs text-slate-300">
                    Phân loại: <span className="font-semibold text-white">{selectedDishForBOM.category}</span> | Ước tính{' '}
                    <span className="font-mono font-bold text-amber-300">
                      {editableBOM.reduce((sum, item) => sum + (Number(item.calories) || 0), 0)}
                    </span>{' '}
                    Kcal/suất ({editableBOM.length} thành phần)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDishForBOM(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
                title="Đóng modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Thông báo lưu thành công */}
              {bomSuccessMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-emerald-900 text-xs font-bold animate-in fade-in-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đã lưu thành công định lượng BOM &amp; Nhà cung cấp, đồng bộ thời gian thực sang các máy khác!</span>
                </div>
              )}

              {/* Hướng dẫn sử dụng */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">Quản trị bảng định lượng BOM:</span> Bạn có thể chọn tên nguyên liệu chuẩn hóa từ menu dropdown (Đường kính, Dầu ăn, Nước mắm, Muối I-ốt...) hoặc tự gõ tên mới; chọn/sửa trực tiếp tên Nhà cung cấp (NCC) hoặc Cơ sở sản xuất. Mọi thay đổi sau khi lưu sẽ đồng bộ thời gian thực sang các máy khác trên toàn hệ thống.
                </div>
              </div>

              {/* Bảng Danh Sách Nguyên Liệu BOM */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-2.5 border-r border-slate-200 text-center w-10">STT</th>
                      <th className="p-2.5 border-r border-slate-200 min-w-[200px]">Tên nguyên liệu (Dropdown / Tự nhập)</th>
                      <th className="p-2.5 border-r border-slate-200 text-center w-28">Loại NL</th>
                      <th className="p-2.5 border-r border-slate-200 text-right w-24">ĐL thô (g)</th>
                      <th className="p-2.5 border-r border-slate-200 text-right w-24">Tinh sạch (g)</th>
                      <th className="p-2.5 border-r border-slate-200 text-right w-20">Hao hụt (%)</th>
                      <th className="p-2.5 border-r border-slate-200 text-right w-20">Calo (Kcal)</th>
                      <th className="p-2.5 border-r border-slate-200 min-w-[220px]">Nhà cung cấp / Cơ sở sản xuất</th>
                      <th className="p-2.5 text-center w-12">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {editableBOM.map((ing, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/30">
                        {/* STT */}
                        <td className="p-2.5 text-center border-r border-slate-200 font-mono text-slate-500 font-bold">
                          {idx + 1}
                        </td>

                        {/* Tên nguyên liệu */}
                        <td className="p-2 border-r border-slate-200">
                          <div className="space-y-1">
                            <select
                              value={STANDARD_CLEAN_INGREDIENTS.includes(ing.name) ? ing.name : '__custom__'}
                              onChange={(e) => {
                                if (e.target.value !== '__custom__') {
                                  handleUpdateBOMRow(idx, { name: e.target.value });
                                }
                              }}
                              className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-lg px-2 py-1 focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="" disabled>-- Chọn nguyên liệu chuẩn --</option>
                              {STANDARD_CLEAN_INGREDIENTS.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                              <option value="__custom__">-- Tự nhập tên khác --</option>
                            </select>
                            <input
                              type="text"
                              value={ing.name || ''}
                              onChange={(e) => handleUpdateBOMRow(idx, { name: e.target.value })}
                              placeholder="Nhập tên nguyên liệu..."
                              className="w-full text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:bg-white focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </td>

                        {/* Loại NL */}
                        <td className="p-2 border-r border-slate-200 text-center">
                          <select
                            value={ing.type || 'tuoi_song'}
                            onChange={(e) => handleUpdateBOMRow(idx, { type: e.target.value })}
                            className="text-xs font-semibold rounded-lg border border-slate-300 px-2 py-1 bg-white text-slate-800"
                          >
                            <option value="tuoi_song">Tươi sống</option>
                            <option value="kho">Đồ khô / Gia vị</option>
                          </select>
                        </td>

                        {/* ĐL thô (g) */}
                        <td className="p-2 border-r border-slate-200 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={ing.rawPerPortionGrams ?? 0}
                            onChange={(e) => handleUpdateBOMRow(idx, { rawPerPortionGrams: Number(e.target.value) })}
                            className="w-20 text-right font-mono font-bold text-blue-900 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:bg-white"
                          />
                        </td>

                        {/* Tinh sạch (g) */}
                        <td className="p-2 border-r border-slate-200 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={ing.cleanPerPortionGrams ?? 0}
                            onChange={(e) => handleUpdateBOMRow(idx, { cleanPerPortionGrams: Number(e.target.value) })}
                            className="w-20 text-right font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:bg-white"
                          />
                        </td>

                        {/* Hao hụt (%) */}
                        <td className="p-2 border-r border-slate-200 text-right">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={ing.wasteRate ?? 0}
                            onChange={(e) => handleUpdateBOMRow(idx, { wasteRate: Number(e.target.value) })}
                            className="w-16 text-right font-mono text-rose-700 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:bg-white"
                          />
                        </td>

                        {/* Calo */}
                        <td className="p-2 border-r border-slate-200 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={ing.calories ?? 0}
                            onChange={(e) => handleUpdateBOMRow(idx, { calories: Number(e.target.value) })}
                            className="w-16 text-right font-mono font-bold text-amber-800 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 focus:bg-white"
                          />
                        </td>

                        {/* Nhà cung cấp / Cơ sở sản xuất */}
                        <td className="p-2 border-r border-slate-200">
                          <div className="space-y-1">
                            <select
                              value={supplierOptions.includes(ing.supplierName || '') ? ing.supplierName : '__custom__'}
                              onChange={(e) => {
                                if (e.target.value !== '__custom__') {
                                  handleUpdateBOMRow(idx, { supplierName: e.target.value, producerName: e.target.value });
                                }
                              }}
                              className="w-full text-[11px] font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2 py-1"
                            >
                              <option value="" disabled>-- Chọn NCC / Cơ sở --</option>
                              {supplierOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                              <option value="__custom__">-- Tự nhập NCC / Cơ sở khác --</option>
                            </select>
                            <input
                              type="text"
                              value={ing.supplierName || ing.producerName || ''}
                              onChange={(e) => handleUpdateBOMRow(idx, { supplierName: e.target.value, producerName: e.target.value })}
                              placeholder="Nhập tên NCC hoặc Cơ sở sản xuất..."
                              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:bg-white focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </td>

                        {/* Xóa dòng */}
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveBOMRow(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                            title="Xóa nguyên liệu này khỏi BOM"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Nút thêm dòng nguyên liệu & Khôi phục */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAddBOMRow}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-blue-700" />
                  <span>+ Thêm nguyên liệu vào BOM</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBOMToDefault}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  title="Khôi phục nguyên liệu ban đầu của món này"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nạp lại BOM chuẩn ban đầu</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Lưu ý: Thay đổi sẽ áp dụng cho toàn bộ hồ sơ kiểm thực 3 bước và báo cáo dinh dưỡng liên quan.
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedDishForBOM(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveBOM}
                  disabled={bomSaving}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all disabled:opacity-50"
                >
                  {bomSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang lưu &amp; đồng bộ...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu &amp; Đồng bộ BOM món ăn</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal Chỉnh Sửa Món Ăn */}
      {editingDish && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEditDish}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 animate-in fade-in-50"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-700" />
                Chỉnh sửa món ăn: {editingDish.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên món ăn</label>
                <input
                  type="text"
                  required
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phân loại món</label>
                  <select
                    value={editingDish.category}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, category: e.target.value as DishCategory })
                    }
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300"
                  >
                    <option value="Bữa sáng">1. Bữa Sáng (Ăn sáng)</option>
                    <option value="Món mặn chính">2. Bữa Trưa - Món mặn chính</option>
                    <option value="Món canh">2. Bữa Trưa - Món canh</option>
                    <option value="Bữa xế (phụ)">3. Bữa Xế (phụ) (Ăn nhẹ chiều)</option>
                    <option value="Đồ uống & Nước ép">Đồ uống &amp; Sữa hạt</option>
                    <option value="Tráng miệng">Tráng miệng &amp; Hoa quả</option>
                    <option value="Món ăn kèm & Cơm">Món ăn kèm &amp; Cơm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ước tính Calo (Kcal/suất)</label>
                  <input
                    type="number"
                    value={editingDish.caloriesEstimate}
                    onChange={(e) =>
                      setEditingDish({ ...editingDish, caloriesEstimate: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả / Hướng dẫn chế biến</label>
                <textarea
                  rows={2}
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Cập nhật món ăn</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Món Ăn */}
      {deletingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác Nhận Xóa Món Ăn</h3>
                <p className="text-xs text-slate-500">Món này sẽ bị xóa khỏi kho thư viện món ăn của trường.</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tên món:</span>
                <strong className="text-slate-900 font-bold text-sm">{deletingDish.name}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Danh mục:</span>
                <span className="font-semibold text-blue-900">{deletingDish.category}</span>
              </div>
              {deletingDish.caloriesEstimate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Năng lượng ước tính:</span>
                  <span className="font-mono text-amber-700 font-bold">{deletingDish.caloriesEstimate} Kcal</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingDish(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteDish}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác Nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Khôi Phục 30 Món Gốc */}
      {confirmRestoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-blue-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-blue-700">
              <div className="p-3 bg-blue-100 rounded-xl">
                <RotateCcw className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Khôi Phục 30 Món Ăn Gốc</h3>
                <p className="text-xs text-slate-500">Thiết lập lại danh mục 30 món dinh dưỡng chuẩn cơ sở.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bạn có chắc muốn khôi phục kho món ăn về đúng <strong>Bộ 30 Món Dinh Dưỡng Gốc</strong> của cơ sở?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmRestoreModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmRestoreDefaultDishes}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Xác Nhận Khôi Phục</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
