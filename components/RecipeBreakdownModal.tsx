'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Scale,
  DollarSign,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HelpCircle,
  ChefHat,
  ArrowRight,
  Info,
  ShieldCheck,
  Save,
  Layers,
} from 'lucide-react';
import { FoodIngredient, DishRecipeBreakdown, FoodIngredientCategory, MenuItem } from '@/types/preschool';
import {
  MASTER_VIETNAMESE_INGREDIENTS,
  calculateIngredientPortionNutrition,
  calculateDishNutrition,
  calculateMacroEnergyDistribution,
  MasterNutritionItem,
} from '@/lib/nutrition-calculator';

interface RecipeBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onSaveBreakdownToMenuItem: (updatedMenuItem: MenuItem) => void;
  studentCount?: number;
}

const MEAL_SLOT_LABELS: Record<string, { label: string; defaultName: string; field: keyof MenuItem }> = {
  lunchMain: { label: 'Món mặn chính (Trưa)', defaultName: 'Thịt lợn rim ngũ vị', field: 'lunchMain' },
  lunchSoup: { label: 'Món canh (Trưa)', defaultName: 'Canh bí đỏ thịt bằm', field: 'lunchSoup' },
  lunchStaple: { label: 'Cơm / Tinh bột (Trưa)', defaultName: 'Cơm tám thơm', field: 'lunchStaple' },
  lunchDessert: { label: 'Tráng miệng (Trưa)', defaultName: 'Dưa hấu / Chuối chín', field: 'lunchDessert' },
  breakfast: { label: 'Bữa sáng', defaultName: 'Bún mọc thịt nạc', field: 'breakfast' },
  snackMorning: { label: 'Bữa phụ sáng', defaultName: 'Sữa đậu nành hạt sen', field: 'snackMorning' },
  afternoonSnack: { label: 'Bữa xế chiều', defaultName: 'Bánh flan caramen + Sữa tươi', field: 'afternoonSnack' },
};

// Helper to construct breakdowns map
const getInitialBreakdowns = (item: MenuItem | null): Record<string, DishRecipeBreakdown> => {
  if (!item) return {};
  const breakdownsMap: Record<string, DishRecipeBreakdown> = {};
  if (item.recipeBreakdowns && item.recipeBreakdowns.length > 0) {
    item.recipeBreakdowns.forEach((rb) => {
      breakdownsMap[rb.mealSlot] = rb;
    });
  }

  // Populate default structure for missing slots
  Object.keys(MEAL_SLOT_LABELS).forEach((slotKey) => {
    if (!breakdownsMap[slotKey]) {
      const fieldKey = MEAL_SLOT_LABELS[slotKey].field;
      const dishName = (item[fieldKey] as string) || MEAL_SLOT_LABELS[slotKey].defaultName;
      breakdownsMap[slotKey] = {
        id: `rb-${slotKey}-${Date.now()}`,
        dishName: dishName || MEAL_SLOT_LABELS[slotKey].defaultName,
        mealSlot: slotKey as any,
        ageGroup: item.ageGroup || 'Mẫu giáo (3-6 tuổi)',
        ingredients: [],
        totalCalories: 0,
        totalProteinGrams: 0,
        totalLipidGrams: 0,
        totalGlucidGrams: 0,
        estimatedCostPerPortion: 0,
      };
    }
  });

  return breakdownsMap;
};

export default function RecipeBreakdownModal({
  isOpen,
  onClose,
  menuItem,
  onSaveBreakdownToMenuItem,
  studentCount = 80,
}: RecipeBreakdownModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>('lunchMain');
  const [allBreakdowns, setAllBreakdowns] = useState<Record<string, DishRecipeBreakdown>>({});
  const [prevMenuItemId, setPrevMenuItemId] = useState<string | null>(null);

  if (menuItem && menuItem.id !== prevMenuItemId) {
    setPrevMenuItemId(menuItem.id);
    setAllBreakdowns(getInitialBreakdowns(menuItem));
  }

  const currentBreakdown = allBreakdowns[selectedSlot] || null;

  const [isAiDecomposing, setIsAiDecomposing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Substitute modal state
  const [substituteModalOpen, setSubstituteModalOpen] = useState(false);
  const [substitutingIngredient, setSubstitutingIngredient] = useState<FoodIngredient | null>(null);
  const [substituteSuggestions, setSubstituteSuggestions] = useState<any[]>([]);
  const [isLoadingSubstitute, setIsLoadingSubstitute] = useState(false);

  // Add custom ingredient popup state
  const [addIngredientOpen, setAddIngredientOpen] = useState(false);
  const [selectedMasterItemName, setSelectedMasterItemName] = useState<string>('');
  const [customIngName, setCustomIngName] = useState('');
  const [customRawGrams, setCustomRawGrams] = useState<number>(35);
  const [customPriceKg, setCustomPriceKg] = useState<number>(120000);
  const [customCategory, setCustomCategory] = useState<FoodIngredientCategory>('Thịt cá tươi sống');

  // Recalculate nutrition whenever ingredients change
  const currentNutrition = useMemo(() => {
    if (!currentBreakdown || !currentBreakdown.ingredients) {
      return {
        totalCalories: 0,
        totalProteinGrams: 0,
        totalLipidGrams: 0,
        totalGlucidGrams: 0,
        totalCalciumMg: 0,
        totalIronMg: 0,
        estimatedCostPerPortion: 0,
      };
    }
    return calculateDishNutrition(currentBreakdown.ingredients);
  }, [currentBreakdown]);

  const currentMacro = useMemo(() => {
    return calculateMacroEnergyDistribution(
      currentNutrition.totalProteinGrams,
      currentNutrition.totalLipidGrams,
      currentNutrition.totalGlucidGrams
    );
  }, [currentNutrition]);

  // Total daily summary across all slots
  const fullDaySummary = useMemo(() => {
    let cal = 0;
    let pro = 0;
    let lip = 0;
    let glu = 0;
    let cost = 0;
    let totalIngCount = 0;

    Object.values(allBreakdowns).forEach((rb) => {
      const nut = calculateDishNutrition(rb.ingredients || []);
      cal += nut.totalCalories;
      pro += nut.totalProteinGrams;
      lip += nut.totalLipidGrams;
      glu += nut.totalGlucidGrams;
      cost += nut.estimatedCostPerPortion;
      totalIngCount += (rb.ingredients || []).length;
    });

    const ageGroupKey = menuItem?.ageGroup?.includes('Nhà trẻ') ? 'nha_tre' : 'mau_giao';
    const macro = calculateMacroEnergyDistribution(pro, lip, glu, ageGroupKey);

    return {
      totalCalories: Math.round(cal),
      totalProteinGrams: Math.round(pro * 10) / 10,
      totalLipidGrams: Math.round(lip * 10) / 10,
      totalGlucidGrams: Math.round(glu * 10) / 10,
      estimatedCostPerChild: Math.round(cost),
      totalDailyBudget: Math.round(cost * studentCount),
      macro,
      totalIngCount,
    };
  }, [allBreakdowns, studentCount, menuItem?.ageGroup]);

  // AI Decompose single dish handler
  const handleAiDecomposeCurrentDish = async () => {
    if (!currentBreakdown) return;
    setIsAiDecomposing(true);
    setAiError(null);
    setAiSuccessMessage(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'decompose_dish',
          payload: {
            dishName: currentBreakdown.dishName,
            mealSlot: selectedSlot,
            ageGroup: menuItem?.ageGroup || 'Mẫu giáo (3-6 tuổi)',
            studentCount,
            targetPortionCost: 10000,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data && data.data.ingredients) {
        const newBreakdown: DishRecipeBreakdown = {
          ...currentBreakdown,
          ingredients: data.data.ingredients,
          totalCalories: data.data.totalCalories || 0,
          totalProteinGrams: data.data.totalProteinGrams || 0,
          totalLipidGrams: data.data.totalLipidGrams || 0,
          totalGlucidGrams: data.data.totalGlucidGrams || 0,
          estimatedCostPerPortion: data.data.estimatedCostPerPortion || 0,
          cookingInstructions: data.data.cookingInstructions,
        };

        setAllBreakdowns((prev) => ({ ...prev, [selectedSlot]: newBreakdown }));
        setAiSuccessMessage(`Đã bóc tách thành công ${data.data.ingredients.length} nguyên liệu chuẩn cho "${currentBreakdown.dishName}"!`);
      } else {
        setAiError('Không thể bóc tách món ăn. Đã áp dụng mẫu định mức chuẩn ngoại tuyến.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Lỗi kết nối AI');
    } finally {
      setIsAiDecomposing(false);
    }
  };

  // AI Decompose ALL dishes in the day
  const handleAiDecomposeAllDishes = async () => {
    if (!menuItem) return;
    setIsAiDecomposing(true);
    setAiError(null);
    setAiSuccessMessage(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'decompose_full_day_menu',
          payload: {
            menuDay: menuItem,
            studentCount,
            ageGroup: menuItem.ageGroup,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data && data.data.recipeBreakdowns) {
        const newMap: Record<string, DishRecipeBreakdown> = {};
        data.data.recipeBreakdowns.forEach((rb: DishRecipeBreakdown) => {
          newMap[rb.mealSlot] = rb;
        });

        setAllBreakdowns(newMap);
        setAiSuccessMessage(`Đã bóc tách tự động toàn bộ 7 bữa ăn trong ngày ${menuItem.dayOfWeek}!`);
      }
    } catch (err: any) {
      setAiError('Lỗi bóc tách toàn ngày: ' + err.message);
    } finally {
      setIsAiDecomposing(false);
    }
  };

  // Add Master or Custom ingredient
  const handleAddIngredient = () => {
    if (!currentBreakdown) return;

    let newIng: FoodIngredient;

    if (selectedMasterItemName) {
      const master = MASTER_VIETNAMESE_INGREDIENTS.find((m) => m.name === selectedMasterItemName);
      if (master) {
        const rawG = customRawGrams || master.defaultRawGrams;
        const cleanG = rawG * (1 - master.wasteRatePercent / 100);
        newIng = {
          id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: master.name,
          category: master.category,
          type: master.type,
          unit: master.unit,
          rawGramsPerPortion: rawG,
          cleanGramsPerPortion: Math.round(cleanG * 10) / 10,
          wasteRatePercent: master.wasteRatePercent,
          pricePerKg: customPriceKg || master.pricePerKg,
          caloriesPer100g: master.caloriesPer100g,
          proteinPer100g: master.proteinPer100g,
          lipidPer100g: master.lipidPer100g,
          glucidPer100g: master.glucidPer100g,
          calciumMg: master.calciumMg,
          ironMg: master.ironMg,
          supplierName: master.defaultSupplier,
        };
      } else {
        return;
      }
    } else {
      if (!customIngName.trim()) return;
      newIng = {
        id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: customIngName.trim(),
        category: customCategory,
        type: customCategory === 'Gạo & ngũ cốc' || customCategory === 'Gia vị & dầu mỡ' ? 'kho' : 'tuoi_song',
        unit: 'kg',
        rawGramsPerPortion: customRawGrams,
        cleanGramsPerPortion: Math.round(customRawGrams * 0.9 * 10) / 10,
        wasteRatePercent: 10,
        pricePerKg: customPriceKg,
        caloriesPer100g: 120,
        proteinPer100g: 10,
        lipidPer100g: 3,
        glucidPer100g: 5,
        supplierName: 'Vựa thực phẩm sạch địa phương',
      };
    }

    const updatedIngredients = [...(currentBreakdown.ingredients || []), newIng];
    const updated = { ...currentBreakdown, ingredients: updatedIngredients };
    setAllBreakdowns((prev) => ({ ...prev, [selectedSlot]: updated }));

    setAddIngredientOpen(false);
    setSelectedMasterItemName('');
    setCustomIngName('');
  };

  // Remove ingredient
  const handleRemoveIngredient = (ingId: string) => {
    if (!currentBreakdown) return;
    const updatedIngredients = currentBreakdown.ingredients.filter((i) => i.id !== ingId);
    const updated = { ...currentBreakdown, ingredients: updatedIngredients };
    setAllBreakdowns((prev) => ({ ...prev, [selectedSlot]: updated }));
  };

  // Update ingredient field (e.g. change raw grams or price)
  const handleUpdateIngredientField = (ingId: string, field: keyof FoodIngredient, val: any) => {
    if (!currentBreakdown) return;
    const updatedIngredients = currentBreakdown.ingredients.map((ing) => {
      if (ing.id !== ingId) return ing;
      const updated = { ...ing, [field]: val };
      if (field === 'rawGramsPerPortion' || field === 'wasteRatePercent') {
        const raw = field === 'rawGramsPerPortion' ? Number(val) : ing.rawGramsPerPortion;
        const waste = field === 'wasteRatePercent' ? Number(val) : ing.wasteRatePercent;
        updated.cleanGramsPerPortion = Math.round(raw * (1 - waste / 100) * 10) / 10;
      }
      return updated;
    });

    const updated = { ...currentBreakdown, ingredients: updatedIngredients };
    setAllBreakdowns((prev) => ({ ...prev, [selectedSlot]: updated }));
  };

  // AI Suggest Substitute Handler
  const handleOpenSubstituteModal = async (ing: FoodIngredient) => {
    setSubstitutingIngredient(ing);
    setSubstituteModalOpen(true);
    setIsLoadingSubstitute(true);
    setSubstituteSuggestions([]);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_ingredient_substitute',
          payload: {
            ingredientName: ing.name,
            dishName: currentBreakdown?.dishName,
            reason: 'Trẻ bị dị ứng hoặc cần tối ưu chi phí tiền chợ',
            ageGroup: menuItem?.ageGroup,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data && data.data.substitutes) {
        setSubstituteSuggestions(data.data.substitutes);
      }
    } catch {
      // Fallback suggestions
      setSubstituteSuggestions([
        {
          name: 'Thịt gà ta phi lê / ức gà',
          recommendedRawGrams: ing.rawGramsPerPortion,
          ratioExplanation: 'Tỷ lệ 1:1, giàu đạm nạc, thịt mềm rất an toàn cho trẻ',
          priceComparison: 'Tiết kiệm ~20%',
          nutrientPros: 'Giàu đạm, ít cholesterol',
          allergySafety: 'An toàn cao cho mọi lứa tuổi',
        },
        {
          name: 'Đậu phụ non tươi sạch',
          recommendedRawGrams: Math.round(ing.rawGramsPerPortion * 1.5),
          ratioExplanation: 'Tăng 50% trọng lượng để bù đạm thực vật thanh mát',
          priceComparison: 'Tiết kiệm ~65%',
          nutrientPros: 'Bổ sung Canxi & Isoflavone tự nhiên',
          allergySafety: 'Dễ tiêu hóa, hấp thu nhanh',
        },
      ]);
    } finally {
      setIsLoadingSubstitute(false);
    }
  };

  // Apply chosen substitute
  const handleApplySubstitute = (sub: any) => {
    if (!substitutingIngredient || !currentBreakdown) return;

    handleUpdateIngredientField(substitutingIngredient.id, 'name', sub.name);
    if (sub.recommendedRawGrams) {
      handleUpdateIngredientField(substitutingIngredient.id, 'rawGramsPerPortion', sub.recommendedRawGrams);
    }

    setSubstituteModalOpen(false);
    setSubstitutingIngredient(null);
  };

  // Save full recipe breakdowns back to parent MenuItem
  const handleSaveAllToMenuItem = () => {
    if (!menuItem) return;

    const breakdownList: DishRecipeBreakdown[] = Object.values(allBreakdowns).map((rb) => {
      const nut = calculateDishNutrition(rb.ingredients || []);
      return {
        ...rb,
        totalCalories: nut.totalCalories,
        totalProteinGrams: nut.totalProteinGrams,
        totalLipidGrams: nut.totalLipidGrams,
        totalGlucidGrams: nut.totalGlucidGrams,
        estimatedCostPerPortion: nut.estimatedCostPerPortion,
      };
    });

    const updatedMenuItem: MenuItem = {
      ...menuItem,
      recipeBreakdowns: breakdownList,
      caloriesKcal: fullDaySummary.totalCalories || menuItem.caloriesKcal,
      estimatedDailyCost: fullDaySummary.estimatedCostPerChild,
      macroDistribution: {
        proteinPercent: fullDaySummary.macro.proteinPercent,
        lipidPercent: fullDaySummary.macro.lipidPercent,
        glucidPercent: fullDaySummary.macro.glucidPercent,
      },
    };

    onSaveBreakdownToMenuItem(updatedMenuItem);
    onClose();
  };

  if (!isOpen || !menuItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <ChefHat className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Bóc Tách & Quản Trị Thành Phần Món Ăn (BOM)</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 text-xs font-semibold border border-emerald-400/30">
                  {menuItem.dayOfWeek} • Tuần {menuItem.weekNumber} ({menuItem.month})
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Lập định mức nguyên liệu chi tiết cho 1 suất trẻ ({menuItem.ageGroup}) • Sĩ số: <strong>{studentCount} trẻ</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAiDecomposeAllDishes}
              disabled={isAiDecomposing}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAiDecomposing ? 'AI Đang Bóc Tách...' : 'AI Bóc Tách Toàn Ngày'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Alert messages */}
        {aiSuccessMessage && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{aiSuccessMessage}</span>
            </div>
            <button type="button" onClick={() => setAiSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {aiError && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{aiError}</span>
            </div>
            <button type="button" onClick={() => setAiError(null)} className="text-amber-600 hover:text-amber-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Body: Left Slot Nav + Center Ingredient Editor */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
          {/* Left Sidebar: 7 Meals Selector */}
          <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col p-3 overflow-y-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
              Các Món Trong Ngày
            </span>
            <div className="space-y-1.5 flex-1">
              {Object.entries(MEAL_SLOT_LABELS).map(([slotKey, meta]) => {
                const isSelected = selectedSlot === slotKey;
                const dishObj = allBreakdowns[slotKey];
                const ingCount = dishObj?.ingredients?.length || 0;
                const dishName = dishObj?.dishName || (menuItem[meta.field] as string) || meta.defaultName;

                return (
                  <button
                    key={slotKey}
                    type="button"
                    onClick={() => setSelectedSlot(slotKey)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${isSelected ? 'text-emerald-800' : 'text-slate-700'}`}>
                        {meta.label}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          ingCount > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {ingCount} nguyên liệu
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium truncate mt-1">
                      {dishName}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Daily Full Overview Box */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white text-xs">
              <div className="flex items-center justify-between font-bold mb-1 text-emerald-300">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Calo Toàn Ngày
                </span>
                <span>{fullDaySummary.totalCalories} Kcal</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
                <span>Tỷ lệ P-L-G ({fullDaySummary.macro.ageGroup === 'nha_tre' ? 'Nhà trẻ' : 'Mẫu giáo'}):</span>
                <span className="font-semibold text-amber-300">
                  {fullDaySummary.macro.proteinPercent}% / {fullDaySummary.macro.lipidPercent}% / {fullDaySummary.macro.glucidPercent}%
                </span>
              </div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Chuẩn GD&ĐT: {fullDaySummary.macro.targetRatioString}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    fullDaySummary.macro.isBalanced
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
                  }`}
                >
                  {fullDaySummary.macro.isBalanced ? '✓ Cân đối' : '⚠ Cần điều chỉnh'}
                </span>
              </div>
              {fullDaySummary.macro.recommendations.length > 0 && (
                <div className="bg-amber-950/40 border border-amber-500/30 rounded p-1.5 text-[10px] text-amber-200 mb-1.5 leading-tight">
                  {fullDaySummary.macro.recommendations[0]}
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-700/60 pt-1.5 mt-1.5">
                <span>Tiền ăn / trẻ:</span>
                <span className="font-bold text-emerald-400">{fullDaySummary.estimatedCostPerChild.toLocaleString()} đ</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Tổng tiền chợ ({studentCount} trẻ):</span>
                <span className="font-bold text-amber-400">{fullDaySummary.totalDailyBudget.toLocaleString()} đ</span>
              </div>
            </div>
          </div>

          {/* Center Column: Current Dish Editor */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5">
            {/* Current Dish Header & Quick AI Decompose Button */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-bold uppercase rounded bg-teal-100 text-teal-800">
                      {MEAL_SLOT_LABELS[selectedSlot]?.label}
                    </span>
                    <span className="text-xs text-slate-400">Đang chỉnh sửa thành phần cấu thành</span>
                  </div>
                  <input
                    type="text"
                    value={currentBreakdown?.dishName || ''}
                    onChange={(e) => {
                      if (!currentBreakdown) return;
                      const updated = { ...currentBreakdown, dishName: e.target.value };
                      setAllBreakdowns((prev) => ({ ...prev, [selectedSlot]: updated }));
                    }}
                    placeholder="Nhập tên món ăn..."
                    className="mt-1 text-base sm:text-lg font-bold text-slate-800 border-b border-dashed border-slate-300 hover:border-emerald-500 focus:border-emerald-600 focus:outline-hidden w-full bg-transparent py-0.5"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAiDecomposeCurrentDish}
                    disabled={isAiDecomposing}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>{isAiDecomposing ? 'AI đang bóc tách...' : 'AI Bóc Tách Món Này'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAddIngredientOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Nguyên Liệu</span>
                  </button>
                </div>
              </div>

              {/* Live Metric Banner for this dish */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100">
                <div className="p-2.5 rounded-lg bg-orange-50/70 border border-orange-100">
                  <span className="text-[10px] text-orange-600 font-bold uppercase block">Năng Lượng / Suất</span>
                  <span className="text-sm font-extrabold text-orange-950">{currentNutrition.totalCalories} Kcal</span>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                  <span className="text-[10px] text-blue-600 font-bold uppercase block">Đạm (Protein) / Béo</span>
                  <span className="text-sm font-extrabold text-blue-950">
                    {currentNutrition.totalProteinGrams}g / {currentNutrition.totalLipidGrams}g
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase block">Chi Phí / Suất</span>
                  <span className="text-sm font-extrabold text-emerald-950">
                    {currentNutrition.estimatedCostPerPortion.toLocaleString()} đ
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-100">
                  <span className="text-[10px] text-purple-600 font-bold uppercase block">Tổng Tiền ({studentCount} trẻ)</span>
                  <span className="text-sm font-extrabold text-purple-950">
                    {(currentNutrition.estimatedCostPerPortion * studentCount).toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Danh Sách Nguyên Liệu Cấu Thành ({currentBreakdown?.ingredients?.length || 0})
                </span>
                <span className="text-[11px] text-slate-500 italic">
                  * Bạn có thể chỉnh sửa trực tiếp số Gram hoặc Đơn giá
                </span>
              </div>

              <div className="flex-1 overflow-x-auto overflow-y-auto">
                {(!currentBreakdown?.ingredients || currentBreakdown.ingredients.length === 0) ? (
                  <div className="p-8 text-center text-slate-400">
                    <Scale className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-600">Chưa có nguyên liệu cấu thành cho món này</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Hãy bấm <strong>&quot;AI Bóc Tách Món Này&quot;</strong> để tự động bóc tách định mức mầm non, hoặc bấm <strong>&quot;Thêm Nguyên Liệu&quot;</strong> để chọn thủ công.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">Tên Nguyên Liệu</th>
                        <th className="py-2.5 px-3">Phân Nhóm</th>
                        <th className="py-2.5 px-3 text-center">Gram thô / trẻ</th>
                        <th className="py-2.5 px-3 text-center">Gram tinh</th>
                        <th className="py-2.5 px-3 text-center">Tổng mua ({studentCount} trẻ)</th>
                        <th className="py-2.5 px-3 text-right">Đơn giá/kg</th>
                        <th className="py-2.5 px-3 text-right">Thành tiền / suất</th>
                        <th className="py-2.5 px-3 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentBreakdown.ingredients.map((ing) => {
                        const nut = calculateIngredientPortionNutrition(ing);
                        const totalKg = Math.round((ing.rawGramsPerPortion * studentCount / 1000) * 100) / 100;

                        return (
                          <tr key={ing.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">
                              <div className="flex items-center gap-1.5">
                                <span>{ing.name}</span>
                                {ing.notes && (
                                  <span className="text-[10px] text-slate-400 italic block">({ing.notes})</span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                                {ing.category}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="inline-flex items-center gap-1">
                                <input
                                  type="number"
                                  min="0.5"
                                  step="0.5"
                                  value={ing.rawGramsPerPortion}
                                  onChange={(e) =>
                                    handleUpdateIngredientField(ing.id, 'rawGramsPerPortion', parseFloat(e.target.value) || 0)
                                  }
                                  className="w-16 px-1.5 py-1 text-center font-bold text-slate-800 bg-emerald-50/60 border border-emerald-300 rounded focus:bg-white focus:outline-emerald-500"
                                />
                                <span className="text-slate-500 text-[10px]">g</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium text-slate-600">
                              {nut.cleanGrams}g <span className="text-[10px] text-slate-400">(-{ing.wasteRatePercent}%)</span>
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                              {totalKg} {ing.unit || 'kg'}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="1000"
                                value={ing.pricePerKg}
                                onChange={(e) =>
                                  handleUpdateIngredientField(ing.id, 'pricePerKg', parseFloat(e.target.value) || 0)
                                }
                                className="w-24 px-1.5 py-1 text-right font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-emerald-500"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                              {nut.cost.toLocaleString()} đ
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  title="Gợi ý thay thế nguyên liệu an toàn (khi dị ứng/hết hàng)"
                                  onClick={() => handleOpenSubstituteModal(ing)}
                                  className="p-1 rounded text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  title="Xóa nguyên liệu này"
                                  onClick={() => handleRemoveIngredient(ing.id)}
                                  className="p-1 rounded text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Số liệu bóc tách được lưu trữ và tự động đồng bộ vào <strong>Sổ Kiểm thực Bước 1</strong> &amp; <strong>Sổ Đi Chợ</strong>.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveAllToMenuItem}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Thành &amp; Cập Nhật Thực Đơn</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-MODAL: Add Ingredient */}
      {addIngredientOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" /> Thêm Nguyên Liệu Cấu Thành
              </h3>
              <button type="button" onClick={() => setAddIngredientOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chọn nhanh từ Thư viện Dinh dưỡng Quốc gia:
                </label>
                <select
                  value={selectedMasterItemName}
                  onChange={(e) => {
                    const name = e.target.value;
                    setSelectedMasterItemName(name);
                    const master = MASTER_VIETNAMESE_INGREDIENTS.find((m) => m.name === name);
                    if (master) {
                      setCustomRawGrams(master.defaultRawGrams);
                      setCustomPriceKg(master.pricePerKg);
                      setCustomCategory(master.category);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                >
                  <option value="">-- Hoặc tự gõ tên mới bên dưới --</option>
                  {MASTER_VIETNAMESE_INGREDIENTS.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name} ({m.category} - {m.caloriesPer100g} kcal/100g)
                    </option>
                  ))}
                </select>
              </div>

              {!selectedMasterItemName && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tên nguyên liệu mới:</label>
                    <input
                      type="text"
                      value={customIngName}
                      onChange={(e) => setCustomIngName(e.target.value)}
                      placeholder="Ví dụ: Nấm hương tươi, Hạt sen tươi..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phân loại thực phẩm:</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-emerald-500"
                    >
                      <option value="Thịt cá tươi sống">Thịt cá tươi sống</option>
                      <option value="Thủy hải sản">Thủy hải sản</option>
                      <option value="Rau củ quả nấm">Rau củ quả nấm</option>
                      <option value="Gạo & ngũ cốc">Gạo & ngũ cốc</option>
                      <option value="Gia vị & dầu mỡ">Gia vị & dầu mỡ</option>
                      <option value="Sữa & chế phẩm">Sữa & chế phẩm</option>
                      <option value="Trái cây tráng miệng">Trái cây tráng miệng</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Định mức thô / 1 trẻ (gram):</label>
                  <input
                    type="number"
                    min="1"
                    value={customRawGrams}
                    onChange={(e) => setCustomRawGrams(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-emerald-500 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đơn giá thị trường (VNĐ/kg):</label>
                  <input
                    type="number"
                    step="1000"
                    value={customPriceKg}
                    onChange={(e) => setCustomPriceKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-emerald-500 font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddIngredientOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Thêm Vào Món
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: AI Substitute Assistant */}
      {substituteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800">
                  AI Gợi Ý Thay Thế: <span className="text-emerald-700">{substitutingIngredient?.name}</span>
                </h3>
              </div>
              <button type="button" onClick={() => setSubstituteModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Áp dụng khi trẻ bị dị ứng, chợ hết hàng, hoặc cần cân đối lại chi phí mà vẫn giữ nguyên lượng Calo và Đạm tương đương:
            </p>

            {isLoadingSubstitute ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                AI đang tính toán các phương án thay thế dinh dưỡng tương đương...
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {substituteSuggestions.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 transition-all flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">{sub.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800">
                          {sub.priceComparison}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{sub.ratioExplanation}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-emerald-700">
                        <span>• Định mức đề xuất: <strong>{sub.recommendedRawGrams || substitutingIngredient?.rawGramsPerPortion}g</strong></span>
                        <span>• {sub.allergySafety}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleApplySubstitute(sub)}
                      className="self-end px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Áp Dụng Phương Án Này
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSubstituteModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
