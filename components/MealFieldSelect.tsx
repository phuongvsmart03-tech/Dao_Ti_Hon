'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Utensils,
  ChevronDown,
  Search,
  Check,
  Plus,
  X,
  Flame,
  Soup,
  Coffee,
  Apple,
  GlassWater,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { DishItem, DishCategory } from '@/types/preschool';
import {
  getStoredDishLibrary,
  addDishToLibrary,
  removeDishFromLibrary,
} from '@/lib/dish-library';

interface MealFieldSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  slot:
    | 'lunchMain'
    | 'lunchSoup'
    | 'lunchStaple'
    | 'lunchDessert'
    | 'breakfast'
    | 'snackMorning'
    | 'afternoonSnack';
  placeholder?: string;
  required?: boolean;
  onCaloriesSelect?: (calories: number) => void;
  inputClassName?: string;
}

export default function MealFieldSelect({
  label,
  value,
  onChange,
  slot,
  placeholder = 'Nhập hoặc chọn món...',
  required = false,
  onCaloriesSelect,
  inputClassName = '',
}: MealFieldSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [allDishes, setAllDishes] = useState<DishItem[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredDishLibrary();
    }
    return [];
  });

  const handleOpen = () => {
    if (!isOpen && typeof window !== 'undefined') {
      setAllDishes(getStoredDishLibrary());
    }
    setIsOpen(!isOpen);
  };

  // Determine target category based on meal slot
  const defaultCategory: DishCategory | null = useMemo(() => {
    switch (slot) {
      case 'lunchMain':
        return 'Món mặn chính';
      case 'lunchSoup':
        return 'Món canh';
      case 'lunchStaple':
        return 'Món ăn kèm & Cơm';
      case 'lunchDessert':
        return 'Tráng miệng';
      case 'breakfast':
        return 'Bữa sáng & Bữa xế';
      case 'snackMorning':
        return 'Đồ uống & Nước ép';
      case 'afternoonSnack':
        return 'Bữa sáng & Bữa xế';
      default:
        return null;
    }
  }, [slot]);

  // Filter dishes top-to-bottom
  const filteredDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      const matchCat =
        showAllCategories ||
        !defaultCategory ||
        dish.category === defaultCategory ||
        dish.defaultMealSlot === slot;

      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        dish.name.toLowerCase().includes(q) ||
        (dish.description && dish.description.toLowerCase().includes(q)) ||
        dish.nutritionTags.some((t) => t.toLowerCase().includes(q));

      return matchCat && matchSearch;
    });
  }, [allDishes, showAllCategories, defaultCategory, slot, searchTerm]);

  // Currently selected dish names in this field (parsed from string)
  const currentDishesInField = useMemo(() => {
    if (!value) return [];
    return value
      .split(/[-–—,;/]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Toggle dish in this field
  const handleToggleDish = (dish: DishItem) => {
    const isAlready = currentDishesInField.some(
      (name) => name.toLowerCase() === dish.name.toLowerCase()
    );

    let updatedList: string[];
    if (isAlready) {
      // Remove dish
      updatedList = currentDishesInField.filter(
        (name) => name.toLowerCase() !== dish.name.toLowerCase()
      );
    } else {
      // Append dish
      updatedList = [...currentDishesInField, dish.name];
      if (dish.caloriesEstimate && onCaloriesSelect) {
        onCaloriesSelect(dish.caloriesEstimate);
      }
    }

    onChange(updatedList.join(' - '));
  };

  // Replace single dish
  const handleSelectOnlyThisDish = (dish: DishItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(dish.name);
    if (dish.caloriesEstimate && onCaloriesSelect) {
      onCaloriesSelect(dish.caloriesEstimate);
    }
    setIsOpen(false);
  };

  const handleQuickAddNewDish = (dishName: string) => {
    const trimmed = dishName.trim();
    if (!trimmed) return;
    const newDish: DishItem = {
      id: `dish-custom-${Date.now()}`,
      name: trimmed,
      category: defaultCategory || 'Món mặn chính',
      defaultMealSlot: slot,
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: ['Dinh dưỡng'],
      caloriesEstimate: 150,
    };
    const updated = addDishToLibrary(newDish);
    setAllDishes(updated);
    handleToggleDish(newDish);
    setSearchTerm('');
  };

  const handleDeleteDish = (dishId: string, dishName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc muốn xóa món "${dishName}" khỏi thư viện?`)) {
      const updated = removeDishFromLibrary(dishId);
      setAllDishes(updated);
      if (currentDishesInField.some((n) => n.toLowerCase() === dishName.toLowerCase())) {
        const remaining = currentDishesInField.filter((n) => n.toLowerCase() !== dishName.toLowerCase());
        onChange(remaining.join(' - '));
      }
    }
  };

  const getSlotIcon = () => {
    switch (slot) {
      case 'lunchMain':
        return <Utensils className="w-3.5 h-3.5 text-rose-600" />;
      case 'lunchSoup':
        return <Soup className="w-3.5 h-3.5 text-emerald-600" />;
      case 'breakfast':
        return <Coffee className="w-3.5 h-3.5 text-amber-600" />;
      case 'snackMorning':
        return <GlassWater className="w-3.5 h-3.5 text-sky-600" />;
      case 'afternoonSnack':
        return <Coffee className="w-3.5 h-3.5 text-indigo-600" />;
      case 'lunchDessert':
        return <Apple className="w-3.5 h-3.5 text-pink-600" />;
      default:
        return <Utensils className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Label with quick helper */}
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          {getSlotIcon()}
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={handleOpen}
          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{isOpen ? 'Đóng gợi ý' : 'Chọn nhanh món'}</span>
        </button>
      </div>

      {/* Input Group */}
      <div className="relative flex items-center">
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (!isOpen) handleOpen();
          }}
          placeholder={placeholder}
          className={`w-full pl-3 pr-20 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-600 transition-colors bg-white ${
            isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-300'
          } ${inputClassName}`}
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              title="Xóa nhanh nội dung ô"
              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={handleOpen}
            title="Mở danh sách món ăn từ trên xuống dưới"
            className={`flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              isOpen
                ? 'bg-blue-700 text-white'
                : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 border border-slate-200'
            }`}
          >
            <span>Món</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick selected pill chips */}
      {currentDishesInField.length > 1 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {currentDishesInField.map((dishName, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200"
            >
              <span>{dishName}</span>
              <button
                type="button"
                onClick={() => {
                  const remaining = currentDishesInField.filter((_, i) => i !== idx);
                  onChange(remaining.join(' - '));
                }}
                className="text-blue-700 hover:text-rose-600 cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Top-to-Bottom Vertical Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header of dropdown: Search + Category filter */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Tìm kiếm món cho ${label.toLowerCase()}...`}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <span>{showAllCategories ? 'Tất cả thư viện' : defaultCategory || 'Gợi ý chuẩn'}:</span>
                <span className="text-blue-700">({filteredDishes.length} món)</span>
              </span>

              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="text-blue-700 hover:text-blue-900 font-semibold hover:underline cursor-pointer"
              >
                {showAllCategories ? '← Chỉ món phù hợp ô này' : 'Xem thêm từ nhóm khác →'}
              </button>
            </div>
          </div>

          {/* Quick Add New Dish Banner */}
          {searchTerm.trim() && (
            <div className="p-2 border-b border-emerald-200 bg-emerald-50 flex items-center justify-between gap-2">
              <div className="text-xs text-emerald-900 truncate">
                Thêm món: &ldquo;<strong>{searchTerm.trim()}</strong>&rdquo;
              </div>
              <button
                type="button"
                onClick={() => handleQuickAddNewDish(searchTerm)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md cursor-pointer shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm món mới</span>
              </button>
            </div>
          )}

          {/* Top-to-Bottom Vertical Scrollable Dish List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-1 bg-slate-50/50">
            {filteredDishes.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Không tìm thấy món phù hợp với từ khóa &ldquo;{searchTerm}&rdquo;.
              </div>
            ) : (
              filteredDishes.map((dish) => {
                const isSelected = currentDishesInField.some(
                  (name) => name.toLowerCase() === dish.name.toLowerCase()
                );

                return (
                  <div
                    key={dish.id}
                    onClick={() => handleToggleDish(dish)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-left select-none ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200 text-blue-950 font-bold'
                        : 'hover:bg-white hover:shadow-2xs text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-700 text-white'
                            : 'border border-slate-300 bg-white hover:border-slate-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold leading-tight">{dish.name}</span>
                          {dish.caloriesEstimate && (
                            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                              {dish.caloriesEstimate} kcal
                            </span>
                          )}
                        </div>
                        {dish.nutritionTags && dish.nutritionTags.length > 0 && (
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
                            {dish.nutritionTags.slice(0, 2).map((t, i) => (
                              <span key={i} className="bg-slate-100 px-1 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleSelectOnlyThisDish(dish, e)}
                        title="Chọn duy nhất món này cho ô"
                        className="px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:text-blue-800 hover:bg-blue-100/70 rounded transition-colors cursor-pointer"
                      >
                        Chỉ chọn
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDish(dish.id, dish.name, e)}
                        title={`Xóa món "${dish.name}" khỏi thư viện`}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer of dropdown */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="text-[11px]">
              Tích chọn nhiều món (VD: {label} có 2 món kết hợp)
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-2.5 py-1 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md cursor-pointer"
            >
              Xong
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
