'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Plus,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  Utensils,
  Soup,
  Coffee,
  Apple,
  GlassWater,
  Flame,
  Copy,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Star,
  Loader2,
  ChefHat,
  Info,
} from 'lucide-react';
import { DishItem, DishCategory } from '@/types/preschool';
import {
  getStoredDishLibrary,
  saveDishLibrary,
  resetDishLibraryToDefault,
} from '@/lib/dish-library';

interface DishLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySelectedDishes?: (selectedDishes: DishItem[]) => void;
  // If provided, marks these IDs as pre-selected
  initialSelectedIds?: string[];
  mode?: 'picker' | 'manager'; // 'picker' for picking into menu form, 'manager' for full library management
}

export default function DishLibraryModal({
  isOpen,
  onClose,
  onApplySelectedDishes,
  initialSelectedIds = [],
  mode = 'picker',
}: DishLibraryModalProps) {
  const [dishLibrary, setDishLibrary] = useState<DishItem[]>(() => getStoredDishLibrary());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initialSelectedIds));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  // New Dish Form
  const [newDish, setNewDish] = useState<Partial<DishItem>>({
    name: '',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu đạm', 'Dễ tiêu'],
    caloriesEstimate: 150,
    description: '',
  });
  const [newTagInput, setNewTagInput] = useState('');

  const categories: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: 'Tất cả món', icon: Utensils },
    { id: 'Món mặn chính', label: 'Món mặn chính', icon: Utensils },
    { id: 'Món canh', label: 'Món canh', icon: Soup },
    { id: 'Bữa sáng & Bữa xế', label: 'Sáng & Xế', icon: Coffee },
    { id: 'Tráng miệng', label: 'Tráng miệng', icon: Apple },
    { id: 'Đồ uống & Nước ép', label: 'Đồ uống / Nước ép', icon: GlassWater },
    { id: 'Món ăn kèm & Cơm', label: 'Cơm & Món kèm', icon: Utensils },
  ];

  const filteredDishes = useMemo(() => {
    return dishLibrary.filter((dish) => {
      const matchCat = selectedCategory === 'all' || dish.category === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchSearch =
        !search ||
        dish.name.toLowerCase().includes(search) ||
        (dish.description && dish.description.toLowerCase().includes(search)) ||
        dish.nutritionTags.some((t) => t.toLowerCase().includes(search));
      return matchCat && matchSearch;
    });
  }, [dishLibrary, selectedCategory, searchTerm]);

  const toggleSelectDish = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredDishes.forEach((d) => next.add(d.id));
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  const selectedDishesList = useMemo(() => {
    return dishLibrary.filter((d) => selectedIds.has(d.id));
  }, [dishLibrary, selectedIds]);

  const handleCopyNames = () => {
    if (selectedDishesList.length === 0) return;
    const names = selectedDishesList.map((d) => d.name).join(', ');
    navigator.clipboard.writeText(names);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleApply = () => {
    if (onApplySelectedDishes) {
      onApplySelectedDishes(selectedDishesList);
    }
    onClose();
  };

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
            studentCount: 80,
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
          } else if (lower.includes('chè') || lower.includes('chuối') || lower.includes('dưa') || lower.includes('xoài') || lower.includes('táo') || lower.includes('bưởi') || lower.includes('cam') && !lower.includes('thịt') && !lower.includes('sốt')) {
            detectedCategory = 'Tráng miệng';
            detectedSlot = 'lunchDessert';
          } else if (lower.includes('sữa') || lower.includes('nước ép') || lower.includes('sinh tố') || lower.includes('nước cam')) {
            detectedCategory = 'Đồ uống & Nước ép';
            detectedSlot = 'snackMorning';
          } else if (lower.includes('cháo') || lower.includes('bún') || lower.includes('phở') || lower.includes('miến') || lower.includes('bánh flan') || lower.includes('bánh bao') || lower.includes('bánh giò') || lower.includes('hủ tiếu')) {
            detectedCategory = 'Bữa sáng & Bữa xế';
            detectedSlot = 'breakfast';
          } else if (lower.includes('cơm') || lower.includes('xôi')) {
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

          const calo = data.totalCalories || Math.round((data.ingredients || []).reduce((acc: number, ing: any) => acc + (ing.caloriesPer100g || 100) * ((ing.rawGramsPerPortion || 30) / 100), 0)) || 140;

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

  const handleAddNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.name) return;

    const item: DishItem = {
      id: `dish-custom-${Date.now()}`,
      name: newDish.name.trim(),
      category: (newDish.category as DishCategory) || 'Món mặn chính',
      defaultMealSlot: newDish.defaultMealSlot || 'lunchMain',
      suitableAge: newDish.suitableAge || 'Tất cả lứa tuổi',
      nutritionTags: newDish.nutritionTags && newDish.nutritionTags.length > 0 ? newDish.nutritionTags : ['Dinh dưỡng'],
      caloriesEstimate: Number(newDish.caloriesEstimate) || 120,
      description: newDish.description || '',
    };

    const updated = [item, ...dishLibrary];
    setDishLibrary(updated);
    saveDishLibrary(updated);
    // Auto-select the newly added dish
    setSelectedIds((prev) => new Set(prev).add(item.id));
    setIsAddingNew(false);
    setAiAnalysisResult(null);
    setNewDish({
      name: '',
      category: 'Món mặn chính',
      defaultMealSlot: 'lunchMain',
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: ['Giàu đạm', 'Dễ tiêu'],
      caloriesEstimate: 150,
      description: '',
    });
  };

  const handleToggleFavorite = (dishId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = dishLibrary.map((d) => (d.id === dishId ? { ...d, isFavorite: !d.isFavorite } : d));
    setDishLibrary(updated);
    saveDishLibrary(updated);
  };

  const handleDeleteDish = (id: string, name: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa món "${name}" khỏi thư viện thực đơn của trường?`)) {
      const updated = dishLibrary.filter((d) => d.id !== id);
      setDishLibrary(updated);
      saveDishLibrary(updated);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Khôi phục toàn bộ danh sách 60+ món ăn chuẩn ban đầu của trường?')) {
      const defs = resetDishLibraryToDefault();
      setDishLibrary(defs);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-auto flex flex-col max-h-[92vh] border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Utensils className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg">Thư viện Món ăn Dinh dưỡng Mầm non</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold">
                  {dishLibrary.length} món chuẩn
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Tích chọn nhiều món (multi-choice) để đưa nhanh vào thực đơn tuần, món mặn, canh, xế và tráng miệng
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetDefaults}
              title="Khôi phục danh sách gốc"
              className="px-2.5 py-1.5 text-xs text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi phục gốc</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search, Category Pills, Action Buttons */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm món ăn (VD: Cá basa, Canh cua, Bò xào, Canxi, Vitamin, Nước cam...)"
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-blue-700" />
                <span>Chọn tất cả ({filteredDishes.length})</span>
              </button>
              {selectedIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Bỏ chọn</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsAddingNew(!isAddingNew)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm món mới</span>
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count =
                cat.id === 'all'
                  ? dishLibrary.length
                  : dishLibrary.filter((d) => d.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Add Form Drawer with AI Power */}
        {isAddingNew && (
          <form onSubmit={handleAddNewDish} className="p-4 bg-gradient-to-br from-amber-50/90 via-blue-50/60 to-indigo-50/80 border-b border-blue-200 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                Thêm món ăn mới & Phân tích Dinh Dưỡng AI
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setAiAnalysisResult(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Đóng form
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tên món ăn mới <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="VD: Cá hồi sốt cam, Canh bí đao thịt bằm, Chè đậu đỏ..."
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAiAnalyzeDish}
                    disabled={isAiAnalyzing || !newDish.name?.trim()}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                    title="AI tự động phân tích Calo, nhóm món, dinh dưỡng và bóc tách nguyên liệu"
                  >
                    {isAiAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI đang tính...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-100 fill-amber-200" />
                        <span>AI Phân tích</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phân loại danh mục</label>
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-medium"
                >
                  <option value="Món mặn chính">Món mặn chính</option>
                  <option value="Món canh">Món canh</option>
                  <option value="Bữa sáng & Bữa xế">Bữa sáng & Bữa xế</option>
                  <option value="Tráng miệng">Tráng miệng</option>
                  <option value="Đồ uống & Nước ép">Đồ uống & Nước ép</option>
                  <option value="Món ăn kèm & Cơm">Món ăn kèm & Cơm</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Ước tính Calo (Kcal/suất)</label>
                <input
                  type="number"
                  value={newDish.caloriesEstimate}
                  onChange={(e) => setNewDish({ ...newDish, caloriesEstimate: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-mono font-bold text-amber-900"
                />
              </div>
            </div>

            {/* AI Breakdown Preview Banner if available */}
            {aiAnalysisResult && (
              <div className="p-3 bg-white/95 rounded-xl border border-indigo-200 shadow-2xs space-y-2 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-emerald-600" />
                    AI đã bóc tách {aiAnalysisResult.ingredients?.length || 0} nguyên liệu chuẩn mầm non:
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ~{aiAnalysisResult.totalCalories || newDish.caloriesEstimate} Kcal / suất
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiAnalysisResult.ingredients?.map((ing: any, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-medium flex items-center gap-1"
                    >
                      <span className="font-semibold">{ing.name}</span>
                      <span className="text-indigo-600 font-mono text-[10px]">({ing.rawGramsPerPortion || 30}g)</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-600 font-medium">Từ khóa dinh dưỡng:</span>
                <input
                  type="text"
                  placeholder="Nhập tag (VD: Giàu sắt, Omega-3...)"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newTagInput.trim()) {
                        const tags = newDish.nutritionTags || [];
                        setNewDish({ ...newDish, nutritionTags: [...tags, newTagInput.trim()] });
                        setNewTagInput('');
                      }
                    }
                  }}
                  className="px-2 py-1 text-xs rounded border border-slate-300 w-44 bg-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTagInput.trim()) {
                      const tags = newDish.nutritionTags || [];
                      setNewDish({ ...newDish, nutritionTags: [...tags, newTagInput.trim()] });
                      setNewTagInput('');
                    }
                  }}
                  className="px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 rounded cursor-pointer font-medium"
                >
                  + Thêm tag
                </button>
                <div className="flex flex-wrap gap-1 ml-1">
                  {newDish.nutritionTags?.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Lưu món vào Thư viện</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Top-to-Bottom Vertical Scrollable Dish Library */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-100/60 space-y-6">
          {filteredDishes.length === 0 ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold">Không tìm thấy món ăn phù hợp.</p>
              <p className="text-xs text-slate-400 mt-1">Thử tìm kiếm với từ khóa khác hoặc bấm Thêm món mới.</p>
            </div>
          ) : (
            // Group by category for smooth top-to-bottom vertical scrolling
            categories
              .filter((cat) => cat.id !== 'all')
              .map((cat) => {
                const dishesInCat = filteredDishes.filter((d) => d.category === cat.id);
                if (dishesInCat.length === 0) return null;
                const Icon = cat.icon;

                const allInCatSelected = dishesInCat.every((d) => selectedIds.has(d.id));

                const toggleSelectCategory = () => {
                  setSelectedIds((prev) => {
                    const next = new Set(prev);
                    if (allInCatSelected) {
                      dishesInCat.forEach((d) => next.delete(d.id));
                    } else {
                      dishesInCat.forEach((d) => next.add(d.id));
                    }
                    return next;
                  });
                };

                return (
                  <div key={cat.id} className="space-y-2">
                    {/* Sticky Category Header in vertical scroll */}
                    <div className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-xs py-1.5 px-1 flex items-center justify-between border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-blue-700 text-white flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                          {cat.label}
                        </h4>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-blue-900 border border-slate-200">
                          {dishesInCat.length} món
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={toggleSelectCategory}
                        className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 px-2 py-1 rounded hover:bg-white transition-colors cursor-pointer"
                      >
                        {allInCatSelected ? 'Bỏ chọn nhóm' : '+ Chọn hết nhóm'}
                      </button>
                    </div>

                    {/* Vertical Stream List of Dishes (Top-to-Bottom) */}
                    <div className="space-y-2">
                      {dishesInCat.map((dish) => {
                        const isSelected = selectedIds.has(dish.id);
                        return (
                          <div
                            key={dish.id}
                            onClick={() => toggleSelectDish(dish.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-blue-50/90 border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                            }`}
                          >
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isSelected
                                    ? 'bg-blue-700 text-white'
                                    : 'border border-slate-300 bg-white hover:border-slate-400'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h5
                                    className={`text-sm font-bold ${
                                      isSelected ? 'text-blue-950 font-extrabold' : 'text-slate-900'
                                    }`}
                                  >
                                    {dish.name}
                                  </h5>

                                  {dish.caloriesEstimate && (
                                    <span className="inline-flex items-center gap-0.5 text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                      <Flame className="w-3 h-3 text-amber-500" />
                                      {dish.caloriesEstimate} Kcal
                                    </span>
                                  )}

                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                    {dish.defaultMealSlot === 'lunchMain'
                                      ? 'Món mặn'
                                      : dish.defaultMealSlot === 'lunchSoup'
                                      ? 'Canh'
                                      : dish.defaultMealSlot === 'breakfast'
                                      ? 'Sáng'
                                      : dish.defaultMealSlot === 'afternoonSnack'
                                      ? 'Xế'
                                      : dish.defaultMealSlot === 'lunchDessert'
                                      ? 'Tráng miệng'
                                      : dish.defaultMealSlot === 'snackMorning'
                                      ? 'Phụ sáng'
                                      : 'Cơm/kèm'}
                                  </span>
                                </div>

                                {dish.description && (
                                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                                    {dish.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {dish.nutritionTags.map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                type="button"
                                onClick={(e) => handleToggleFavorite(dish.id, e)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  dish.isFavorite
                                    ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                    : 'text-slate-300 hover:text-amber-500 hover:bg-slate-100'
                                }`}
                                title={dish.isFavorite ? 'Món yêu thích tại trường (Bấm để hủy)' : 'Đánh dấu món yêu thích'}
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    dish.isFavorite ? 'fill-amber-500 text-amber-500' : 'stroke-[1.5]'
                                  }`}
                                />
                              </button>

                              <span
                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                                  isSelected
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-900'
                                }`}
                              >
                                {isSelected ? 'Đã chọn' : '+ Chọn món'}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDish(dish.id, dish.name);
                                }}
                                className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title={`Xóa món "${dish.name}" khỏi thư viện`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Floating Multi-choice Bottom Action Bar */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700 shrink-0">
              Đã tích chọn ({selectedIds.size}):
            </span>
            {selectedDishesList.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                Chưa chọn món nào. Hãy tích vào các ô vuông ở trên.
              </span>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
                {selectedDishesList.slice(0, 4).map((d) => (
                  <span
                    key={d.id}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 shrink-0"
                  >
                    {d.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectDish(d.id);
                      }}
                      className="hover:text-rose-600 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {selectedDishesList.length > 4 && (
                  <span className="text-[11px] font-bold text-slate-500 shrink-0">
                    +{selectedDishesList.length - 4} món nữa
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopyNames}
              disabled={selectedDishesList.length === 0}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {copiedNotification ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép tên món</span>
                </>
              )}
            </button>

            {onApplySelectedDishes && (
              <button
                type="button"
                onClick={handleApply}
                disabled={selectedDishesList.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>
                  {mode === 'picker'
                    ? `Điền ${selectedDishesList.length} món vào Thực đơn`
                    : `Áp dụng ${selectedDishesList.length} món đã chọn`}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
