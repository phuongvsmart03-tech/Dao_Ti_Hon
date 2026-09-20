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
} from 'lucide-react';
import { DishItem, DishCategory, MenuItem, SchoolInfo } from '@/types/preschool';
import {
  getStoredDishLibrary,
  saveDishLibrary,
  resetDishLibraryToDefault,
  addDishToLibrary,
  MASTER_SEED_BACKUP_DISHES,
} from '@/lib/dish-library';
import { getStandardizedIngredientsForDish } from '@/lib/dish-database';
import { DishIngredient } from '@/types/lightning';

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
}: MenuManagementProps) {
  // Kho món ăn chính từ localStorage
  const [dishLibrary, setDishLibrary] = useState<DishItem[]>(() => getStoredDishLibrary());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);
  const [selectedDishForBOM, setSelectedDishForBOM] = useState<DishItem | null>(null);
  const [showRestoreSuccess, setShowRestoreSuccess] = useState(false);

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

  // Danh mục phân loại chuẩn cơ sở
  const categories: { id: string; label: string; icon: any; color: string }[] = [
    { id: 'all', label: 'Tất cả kho món', icon: Utensils, color: 'bg-slate-800 text-white' },
    { id: 'Món mặn chính', label: 'Món mặn chính (8 món)', icon: Utensils, color: 'bg-amber-600 text-white' },
    { id: 'Món canh', label: 'Món canh (6 món)', icon: Soup, color: 'bg-emerald-600 text-white' },
    { id: 'Bữa sáng & Bữa xế', label: 'Sáng & Xế (6 món)', icon: Coffee, color: 'bg-blue-600 text-white' },
    { id: 'Đồ uống & Nước ép', label: 'Đồ uống (5 món)', icon: GlassWater, color: 'bg-cyan-600 text-white' },
    { id: 'Tráng miệng', label: 'Tráng miệng (3 món)', icon: Apple, color: 'bg-rose-600 text-white' },
    { id: 'Món ăn kèm & Cơm', label: 'Cơm & Nước (2 món)', icon: Layers, color: 'bg-indigo-600 text-white' },
  ];

  // Trích xuất tất cả các tag dinh dưỡng có trong kho món
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    dishLibrary.forEach((d) => {
      d.nutritionTags?.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet);
  }, [dishLibrary]);

  // Bộ lọc danh sách món ăn
  const filteredDishes = useMemo(() => {
    return dishLibrary.filter((dish) => {
      const matchSearch =
        searchTerm === '' ||
        dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dish.nutritionTags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || dish.category === selectedCategory;

      const matchTag =
        selectedTag === 'all' || dish.nutritionTags?.includes(selectedTag);

      return matchSearch && matchCategory && matchTag;
    });
  }, [dishLibrary, searchTerm, selectedCategory, selectedTag]);

  // AI Auto-Analyze Dish Name
  const handleAiAnalyzeDish = async () => {
    const name = newDish.name?.trim();
    if (!name) {
      alert('Vui lòng nhập tên món ăn trước khi nhấn AI phân tích!');
      return;
    }

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
            mealSlot: newDish.defaultMealSlot || 'lunchMain',
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

          // Auto detect category
          const lower = name.toLowerCase();
          let detectedCategory: DishCategory = 'Món mặn chính';
          let detectedSlot: any = 'lunchMain';

          if (lower.includes('canh') || lower.includes('soup') || lower.includes('súp') || lower.includes('riêu')) {
            detectedCategory = 'Món canh';
            detectedSlot = 'lunchSoup';
          } else if (lower.includes('chè') || lower.includes('chuối') || lower.includes('dưa') || lower.includes('xoài') || lower.includes('táo') || lower.includes('bưởi') || (lower.includes('cam') && !lower.includes('thịt') && !lower.includes('sốt')) || lower.includes('thạch') || lower.includes('yaourt')) {
            detectedCategory = 'Tráng miệng';
            detectedSlot = 'lunchDessert';
          } else if (lower.includes('sữa') || lower.includes('nước ép') || lower.includes('sinh tố') || lower.includes('nước cam') || lower.includes('sâm') || lower.includes('mía') || lower.includes('dừa')) {
            detectedCategory = 'Đồ uống & Nước ép';
            detectedSlot = 'snackMorning';
          } else if (lower.includes('cháo') || lower.includes('bún') || lower.includes('phở') || lower.includes('miến') || lower.includes('bánh flan') || lower.includes('bánh bao') || lower.includes('bánh giò') || lower.includes('hủ tiếu') || lower.includes('bánh canh') || lower.includes('bánh hỏi')) {
            detectedCategory = 'Bữa sáng & Bữa xế';
            detectedSlot = 'breakfast';
          } else if (lower.includes('cơm') || lower.includes('xôi') || lower.includes('gạo')) {
            detectedCategory = 'Món ăn kèm & Cơm';
            detectedSlot = 'lunchStaple';
          }

          // Build tags
          const tags: string[] = [];
          if (lower.includes('cá') || lower.includes('tôm') || lower.includes('cua') || lower.includes('hải sản')) {
            tags.push('Giàu đạm', 'Omega-3', 'Giàu canxi');
          } else if (lower.includes('bò')) {
            tags.push('Giàu sắt', 'Đạm cao', 'Bổ máu');
          } else if (lower.includes('gà') || lower.includes('thịt')) {
            tags.push('Giàu đạm', 'Dễ tiêu hóa');
          } else if (lower.includes('rau') || lower.includes('bí') || lower.includes('củ')) {
            tags.push('Giàu chất xơ', 'Vitamin A', 'Thanh mát');
          } else {
            tags.push('Dinh dưỡng mầm non', 'Dễ hấp thu');
          }

          const calo = data.totalCalories || Math.round((data.ingredients || []).reduce((acc: number, ing: any) => acc + (ing.caloriesPer100g || 100) * ((ing.rawGramsPerPortion || 30) / 100), 0)) || 150;

          setNewDish((prev) => ({
            ...prev,
            category: detectedCategory,
            defaultMealSlot: detectedSlot,
            caloriesEstimate: calo > 0 ? calo : 150,
            nutritionTags: tags,
            description: data.cookingInstructions || `Món ăn giàu dinh dưỡng chuẩn mầm non, bóc tách gồm ${data.ingredients?.length || 2} nguyên liệu sạch.`,
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

    const item: DishItem = {
      id: `dish-custom-${Date.now()}`,
      name: newDish.name.trim(),
      category: newDish.category || 'Món mặn chính',
      defaultMealSlot: newDish.defaultMealSlot || 'lunchMain',
      suitableAge: newDish.suitableAge || 'Tất cả lứa tuổi',
      nutritionTags: newDish.nutritionTags || ['Dinh dưỡng mầm non'],
      caloriesEstimate: Number(newDish.caloriesEstimate) || 150,
      description: newDish.description || '',
    };

    const updated = addDishToLibrary(item);
    setDishLibrary(updated);
    setIsAddingNew(false);
    setAiAnalysisResult(null);
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
  const handleDeleteDish = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa món "${name}" khỏi kho món ăn của trường?`)) {
      const updated = dishLibrary.filter((d) => d.id !== id);
      setDishLibrary(updated);
      saveDishLibrary(updated);
    }
  };

  // Khôi phục 30 món gốc
  const handleRestoreDefaultDishes = () => {
    if (
      confirm(
        'Bạn có chắc chắn muốn khôi phục kho món ăn về đúng BỘ 30 MÓN GỐC CHUẨN CƠ SỞ (Seed Backup)?\n\nDanh mục 30 món đã chốt sẽ được thiết lập lại nguyên bản.'
      )
    ) {
      const restored = resetDishLibraryToDefault();
      setDishLibrary(restored);
      setShowRestoreSuccess(true);
      setTimeout(() => setShowRestoreSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner & Thông báo vai trò Quản trị */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl shadow-md border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-amber-400 text-slate-950 rounded-md">
                KHO QUẢN TRỊ MÓN ĂN GỐC
              </span>
              <span className="px-2.5 py-1 text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đồng bộ 100% với Tab 1 (Lên Lịch & Trích Xuất Hồ Sơ)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Utensils className="w-7 h-7 text-amber-400" />
              Kho Quản Trị Món Ăn & Dinh Dưỡng Mầm Non
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Quản lý danh mục <strong>30 món ăn chuẩn cơ sở</strong>, định lượng Calo, bóc tách nguyên liệu sạch (BOM) và tỷ lệ hao hụt. Bạn có thể thêm món mới tự do bằng <strong>AI thông minh</strong> hoặc xóa/sửa bất kỳ món nào.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleRestoreDefaultDishes}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              title="Khôi phục nguyên bản 30 món ăn gốc chuẩn cơ sở"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Khôi phục 30 món gốc</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAddingNew(!isAddingNew);
                setAiAnalysisResult(null);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>{isAddingNew ? 'Đóng Form thêm' : '+ Thêm món mới & AI'}</span>
            </button>
          </div>
        </div>

        {/* Restore Toast Banner */}
        {showRestoreSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400 text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
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
                    placeholder="VD: Cá hồi sốt cam, Canh bí đao thịt bằm, Chè bắp lá dứa..."
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
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
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-800 mb-1">Phân loại món</label>
                <select
                  value={newDish.category}
                  onChange={(e) => {
                    const cat = e.target.value as DishCategory;
                    let slot: any = 'lunchMain';
                    if (cat === 'Món canh') slot = 'lunchSoup';
                    else if (cat === 'Bữa sáng & Bữa xế') slot = 'breakfast';
                    else if (cat === 'Tráng miệng') slot = 'lunchDessert';
                    else if (cat === 'Đồ uống & Nước ép') slot = 'snackMorning';
                    else if (cat === 'Món ăn kèm & Cơm') slot = 'lunchStaple';
                    setNewDish({ ...newDish, category: cat, defaultMealSlot: slot });
                  }}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Món mặn chính">Món mặn chính</option>
                  <option value="Món canh">Món canh</option>
                  <option value="Bữa sáng & Bữa xế">Bữa sáng & Bữa xế</option>
                  <option value="Đồ uống & Nước ép">Đồ uống & Nước ép</option>
                  <option value="Tráng miệng">Tráng miệng</option>
                  <option value="Món ăn kèm & Cơm">Món ăn kèm & Cơm</option>
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
          const ingredients = getStandardizedIngredientsForDish(dish.name);
          const isCoreDish = MASTER_SEED_BACKUP_DISHES.some((m) => m.name === dish.name);

          // Get category badge color
          let catBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
          if (dish.category === 'Món canh') catBadgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
          else if (dish.category === 'Bữa sáng & Bữa xế') catBadgeClass = 'bg-blue-100 text-blue-900 border-blue-300';
          else if (dish.category === 'Đồ uống & Nước ép') catBadgeClass = 'bg-cyan-100 text-cyan-900 border-cyan-300';
          else if (dish.category === 'Tráng miệng') catBadgeClass = 'bg-rose-100 text-rose-900 border-rose-300';
          else if (dish.category === 'Món ăn kèm & Cơm') catBadgeClass = 'bg-indigo-100 text-indigo-900 border-indigo-300';

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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${catBadgeClass}`}>
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
                  <span>Xem định lượng BOM</span>
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
                    onClick={() => handleDeleteDish(dish.id, dish.name)}
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

      {/* 5. Modal Xem Định Lượng BOM Chi Tiết */}
      {selectedDishForBOM && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Bóc tách định lượng & Nhà cung cấp: {selectedDishForBOM.name}
                  </h3>
                  <span className="text-xs text-slate-300">
                    Phân loại: {selectedDishForBOM.category} | Ước tính {selectedDishForBOM.caloriesEstimate || 150} Kcal/suất
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDishForBOM(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                      <th className="p-2.5 border-r border-slate-200">STT</th>
                      <th className="p-2.5 border-r border-slate-200">Tên nguyên liệu</th>
                      <th className="p-2.5 border-r border-slate-200 text-center">Loại</th>
                      <th className="p-2.5 border-r border-slate-200 text-right">Định lượng thô/suất</th>
                      <th className="p-2.5 border-r border-slate-200 text-right">Tinh sạch/suất</th>
                      <th className="p-2.5 border-r border-slate-200 text-right">Hao hụt (%)</th>
                      <th className="p-2.5 border-r border-slate-200 text-right">Calo (Kcal)</th>
                      <th className="p-2.5">Nhà cung cấp / Cơ sở sản xuất</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {getStandardizedIngredientsForDish(selectedDishForBOM.name).map((ing, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/40">
                        <td className="p-2.5 text-center border-r border-slate-200 font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                          {ing.name}
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              ing.type === 'tuoi_song'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ing.type === 'tuoi_song' ? 'Tươi sống' : 'Đồ khô / Gia vị'}
                          </span>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-blue-900 border-r border-slate-200">
                          {ing.rawPerPortionGrams}g
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-700 border-r border-slate-200">
                          {ing.cleanPerPortionGrams}g
                        </td>
                        <td className="p-2.5 text-right font-mono text-rose-700 border-r border-slate-200">
                          {ing.wasteRate ? `${ing.wasteRate}%` : '0%'}
                        </td>
                        <td className="p-2.5 text-right font-mono text-amber-800 font-bold border-r border-slate-200">
                          {ing.calories}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          <div className="font-semibold text-slate-900">{ing.supplierName || ing.producerName || 'Cơ sở chuẩn hóa'}</div>
                          <div className="text-[10px] text-slate-500">{ing.supplierAddress || ing.producerAddress}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDishForBOM(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Đóng bảng định lượng
              </button>
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
                    <option value="Món mặn chính">Món mặn chính</option>
                    <option value="Món canh">Món canh</option>
                    <option value="Bữa sáng & Bữa xế">Bữa sáng & Bữa xế</option>
                    <option value="Đồ uống & Nước ép">Đồ uống & Nước ép</option>
                    <option value="Tráng miệng">Tráng miệng</option>
                    <option value="Món ăn kèm & Cơm">Món ăn kèm & Cơm</option>
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
    </div>
  );
}
