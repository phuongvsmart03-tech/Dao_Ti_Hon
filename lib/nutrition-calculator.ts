import { FoodIngredient, DishRecipeBreakdown, FoodIngredientCategory } from '@/types/preschool';

/**
 * Bảng tra cứu thành phần dinh dưỡng và định mức mầm non tiêu chuẩn
 * Tham chiếu theo Bảng thành phần thực phẩm Việt Nam - Viện Dinh Dưỡng Quốc Gia
 */
export interface MasterNutritionItem {
  name: string;
  category: FoodIngredientCategory;
  type: 'tuoi_song' | 'kho';
  unit: string;
  defaultRawGrams: number; // Định mức gram thô mặc định cho 1 suất mầm non
  wasteRatePercent: number; // % Tỷ lệ thải bỏ sơ chế
  pricePerKg: number; // Đơn giá thị trường ước tính (VNĐ/kg)
  caloriesPer100g: number; // Năng lượng Kcal/100g
  proteinPer100g: number; // Đạm (g)/100g
  lipidPer100g: number; // Béo (g)/100g
  glucidPer100g: number; // Bột đường (g)/100g
  calciumMg: number; // Canxi (mg)/100g
  ironMg: number; // Sắt (mg)/100g
  defaultSupplier: string;
}

export const MASTER_VIETNAMESE_INGREDIENTS: MasterNutritionItem[] = [
  // 1. Thịt cá gia cầm
  {
    name: 'Thịt lợn nạc mông / vai',
    category: 'Thịt cá tươi sống',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 40,
    wasteRatePercent: 8,
    pricePerKg: 135000,
    caloriesPer100g: 145,
    proteinPer100g: 19.0,
    lipidPer100g: 7.0,
    glucidPer100g: 0,
    calciumMg: 7,
    ironMg: 1.5,
    defaultSupplier: 'Công ty Thực phẩm Sạch Ba Vì / Vựa thịt Liên Hương',
  },
  {
    name: 'Thịt bò thăn tươi',
    category: 'Thịt cá tươi sống',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 35,
    wasteRatePercent: 5,
    pricePerKg: 250000,
    caloriesPer100g: 142,
    proteinPer100g: 21.0,
    lipidPer100g: 3.5,
    glucidPer100g: 0,
    calciumMg: 12,
    ironMg: 3.1,
    defaultSupplier: 'Công ty TNHH Bò Sạch / Vựa thịt Tuy Phong',
  },
  {
    name: 'Thịt gà ta phi lê / ức gà',
    category: 'Thịt cá tươi sống',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 40,
    wasteRatePercent: 12,
    pricePerKg: 110000,
    caloriesPer100g: 130,
    proteinPer100g: 22.4,
    lipidPer100g: 2.8,
    glucidPer100g: 0,
    calciumMg: 12,
    ironMg: 1.3,
    defaultSupplier: 'Trang trại Gia cầm Tiên Viên / HTX Chăn nuôi',
  },
  {
    name: 'Trứng gà tươi / Trứng cút',
    category: 'Thịt cá tươi sống',
    type: 'tuoi_song',
    unit: 'quả',
    defaultRawGrams: 30,
    wasteRatePercent: 12,
    pricePerKg: 65000,
    caloriesPer100g: 166,
    proteinPer100g: 14.8,
    lipidPer100g: 11.6,
    glucidPer100g: 0.5,
    calciumMg: 55,
    ironMg: 2.7,
    defaultSupplier: 'Trang trại Gia cầm Tiên Viên / Đại lý trứng',
  },

  // 2. Thủy hải sản
  {
    name: 'Tôm đồng / Tôm biển tươi',
    category: 'Thủy hải sản',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 25,
    wasteRatePercent: 25,
    pricePerKg: 180000,
    caloriesPer100g: 90,
    proteinPer100g: 18.5,
    lipidPer100g: 0.8,
    glucidPer100g: 0.9,
    calciumMg: 1120,
    ironMg: 2.2,
    defaultSupplier: 'Vựa hải sản Tươi sống Liên Hương / Tuy Phong',
  },
  {
    name: 'Cá thu / Cá bớp phi lê',
    category: 'Thủy hải sản',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 35,
    wasteRatePercent: 15,
    pricePerKg: 190000,
    caloriesPer100g: 134,
    proteinPer100g: 18.2,
    lipidPer100g: 6.8,
    glucidPer100g: 0,
    calciumMg: 45,
    ironMg: 1.2,
    defaultSupplier: 'Vựa hải sản Tươi sống Liên Hương / Tuy Phong',
  },
  {
    name: 'Cua đồng giã nhỏ nấu canh',
    category: 'Thủy hải sản',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 25,
    wasteRatePercent: 40,
    pricePerKg: 140000,
    caloriesPer100g: 89,
    proteinPer100g: 12.3,
    lipidPer100g: 3.3,
    glucidPer100g: 2.0,
    calciumMg: 5040,
    ironMg: 4.7,
    defaultSupplier: 'Vựa thủy sản tươi sống',
  },

  // 3. Rau củ quả nấm
  {
    name: 'Bí đỏ hồ lô',
    category: 'Rau củ quả nấm',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 45,
    wasteRatePercent: 12,
    pricePerKg: 22000,
    caloriesPer100g: 27,
    proteinPer100g: 0.9,
    lipidPer100g: 0.1,
    glucidPer100g: 6.1,
    calciumMg: 24,
    ironMg: 0.5,
    defaultSupplier: 'HTX Nông nghiệp Rau sạch Tuy Phong',
  },
  {
    name: 'Rau mồng tơi / Rau đay',
    category: 'Rau củ quả nấm',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 35,
    wasteRatePercent: 20,
    pricePerKg: 25000,
    caloriesPer100g: 14,
    proteinPer100g: 1.4,
    lipidPer100g: 0.2,
    glucidPer100g: 2.1,
    calciumMg: 176,
    ironMg: 1.6,
    defaultSupplier: 'HTX Nông sản Hữu cơ Đà Lạt / Tuy Phong',
  },
  {
    name: 'Cà rốt Đà Lạt',
    category: 'Rau củ quả nấm',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 20,
    wasteRatePercent: 15,
    pricePerKg: 28000,
    caloriesPer100g: 39,
    proteinPer100g: 1.5,
    lipidPer100g: 0.2,
    glucidPer100g: 7.8,
    calciumMg: 43,
    ironMg: 0.8,
    defaultSupplier: 'HTX Nông sản Hữu cơ Đà Lạt',
  },
  {
    name: 'Nấm rơm / Nấm đông cô tươi',
    category: 'Rau củ quả nấm',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 15,
    wasteRatePercent: 10,
    pricePerKg: 85000,
    caloriesPer100g: 31,
    proteinPer100g: 3.6,
    lipidPer100g: 0.3,
    glucidPer100g: 3.4,
    calciumMg: 28,
    ironMg: 1.2,
    defaultSupplier: 'Trại nấm hữu cơ sạch',
  },

  // 4. Gạo, bột đường & ngũ cốc
  {
    name: 'Gạo tẻ Tám thơm (Cơm trưa)',
    category: 'Gạo & ngũ cốc',
    type: 'kho',
    unit: 'kg',
    defaultRawGrams: 60,
    wasteRatePercent: 0,
    pricePerKg: 24000,
    caloriesPer100g: 344,
    proteinPer100g: 7.6,
    lipidPer100g: 0.7,
    glucidPer100g: 76.2,
    calciumMg: 30,
    ironMg: 1.3,
    defaultSupplier: 'Đại lý Lương thực Bình Thuận',
  },
  {
    name: 'Bún tươi / Phở tươi sợi mềm',
    category: 'Gạo & ngũ cốc',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 90,
    wasteRatePercent: 0,
    pricePerKg: 20000,
    caloriesPer100g: 110,
    proteinPer100g: 1.7,
    lipidPer100g: 0.2,
    glucidPer100g: 25.7,
    calciumMg: 12,
    ironMg: 0.4,
    defaultSupplier: 'Cơ sở sản xuất Bún sạch Liên Hương',
  },

  // 5. Gia vị, dầu mỡ
  {
    name: 'Dầu ăn đậu nành Simply / Neptune',
    category: 'Gia vị & dầu mỡ',
    type: 'kho',
    unit: 'lít',
    defaultRawGrams: 6,
    wasteRatePercent: 0,
    pricePerKg: 58000,
    caloriesPer100g: 896,
    proteinPer100g: 0,
    lipidPer100g: 99.6,
    glucidPer100g: 0,
    calciumMg: 0,
    ironMg: 0,
    defaultSupplier: 'Đại lý Bách Hóa Tổng Hợp Tuấn Mai',
  },
  {
    name: 'Nước mắm cá cơm truyền thống / Muối I-ốt',
    category: 'Gia vị & dầu mỡ',
    type: 'kho',
    unit: 'lít',
    defaultRawGrams: 2,
    wasteRatePercent: 0,
    pricePerKg: 45000,
    caloriesPer100g: 35,
    proteinPer100g: 5.5,
    lipidPer100g: 0,
    glucidPer100g: 3.2,
    calciumMg: 20,
    ironMg: 0.5,
    defaultSupplier: 'Cơ sở Nước mắm Liên Hương',
  },

  // 6. Sữa & Chế phẩm, Bữa xế
  {
    name: 'Sữa tươi tiệt trùng Vinamilk / TH True Milk 110ml',
    category: 'Sữa & chế phẩm',
    type: 'kho',
    unit: 'hộp',
    defaultRawGrams: 110,
    wasteRatePercent: 0,
    pricePerKg: 75000,
    caloriesPer100g: 73,
    proteinPer100g: 3.0,
    lipidPer100g: 3.3,
    glucidPer100g: 7.8,
    calciumMg: 110,
    ironMg: 0.1,
    defaultSupplier: 'Đại lý Sữa Vinamilk / TH True Milk Tuy Phong',
  },
  {
    name: 'Sữa chua men sống tự nhiên',
    category: 'Sữa & chế phẩm',
    type: 'tuoi_song',
    unit: 'hộp',
    defaultRawGrams: 100,
    wasteRatePercent: 0,
    pricePerKg: 65000,
    caloriesPer100g: 95,
    proteinPer100g: 3.5,
    lipidPer100g: 2.8,
    glucidPer100g: 13.9,
    calciumMg: 120,
    ironMg: 0.1,
    defaultSupplier: 'Đại lý Sữa Vinamilk',
  },
  {
    name: 'Chuối già hương / Dưa hấu / Đu đủ chín',
    category: 'Trái cây tráng miệng',
    type: 'tuoi_song',
    unit: 'kg',
    defaultRawGrams: 60,
    wasteRatePercent: 25,
    pricePerKg: 20000,
    caloriesPer100g: 66,
    proteinPer100g: 1.0,
    lipidPer100g: 0.2,
    glucidPer100g: 15.0,
    calciumMg: 10,
    ironMg: 0.4,
    defaultSupplier: 'Vựa trái cây tươi ngon Liên Hương',
  },
];

/**
 * Tính toán dinh dưỡng chi tiết của một nguyên liệu cho 1 suất trẻ
 */
export function calculateIngredientPortionNutrition(ingredient: FoodIngredient) {
  const cleanGrams = ingredient.cleanGramsPerPortion || ingredient.rawGramsPerPortion * (1 - (ingredient.wasteRatePercent || 0) / 100);
  const factor = cleanGrams / 100;

  const calories = (ingredient.caloriesPer100g || 0) * factor;
  const protein = (ingredient.proteinPer100g || 0) * factor;
  const lipid = (ingredient.lipidPer100g || 0) * factor;
  const glucid = (ingredient.glucidPer100g || 0) * factor;
  const calcium = (ingredient.calciumMg || 0) * factor;
  const iron = (ingredient.ironMg || 0) * factor;

  // Tính chi phí dựa trên gram thô (mua ngoài chợ)
  const cost = (ingredient.rawGramsPerPortion / 1000) * (ingredient.pricePerKg || 0);

  return {
    cleanGrams: Math.round(cleanGrams * 10) / 10,
    calories: Math.round(calories * 10) / 10,
    protein: Math.round(protein * 10) / 10,
    lipid: Math.round(lipid * 10) / 10,
    glucid: Math.round(glucid * 10) / 10,
    calcium: Math.round(calcium * 10) / 10,
    iron: Math.round(iron * 10) / 10,
    cost: Math.round(cost),
  };
}

/**
 * Tổng hợp dinh dưỡng của 1 món ăn từ các thành phần nguyên liệu
 */
export function calculateDishNutrition(ingredients: FoodIngredient[]): {
  totalCalories: number;
  totalProteinGrams: number;
  totalLipidGrams: number;
  totalGlucidGrams: number;
  totalCalciumMg: number;
  totalIronMg: number;
  estimatedCostPerPortion: number;
} {
  let totalCalories = 0;
  let totalProteinGrams = 0;
  let totalLipidGrams = 0;
  let totalGlucidGrams = 0;
  let totalCalciumMg = 0;
  let totalIronMg = 0;
  let estimatedCostPerPortion = 0;

  ingredients.forEach((ing) => {
    const nut = calculateIngredientPortionNutrition(ing);
    totalCalories += nut.calories;
    totalProteinGrams += nut.protein;
    totalLipidGrams += nut.lipid;
    totalGlucidGrams += nut.glucid;
    totalCalciumMg += nut.calcium;
    totalIronMg += nut.iron;
    estimatedCostPerPortion += nut.cost;
  });

  return {
    totalCalories: Math.round(totalCalories),
    totalProteinGrams: Math.round(totalProteinGrams * 10) / 10,
    totalLipidGrams: Math.round(totalLipidGrams * 10) / 10,
    totalGlucidGrams: Math.round(totalGlucidGrams * 10) / 10,
    totalCalciumMg: Math.round(totalCalciumMg * 10) / 10,
    totalIronMg: Math.round(totalIronMg * 10) / 10,
    estimatedCostPerPortion: Math.round(estimatedCostPerPortion),
  };
}

export type PreschoolAgeGroup = 'nha_tre' | 'mau_giao';

export interface NutritionStandardResult {
  proteinPercent: number;
  lipidPercent: number;
  glucidPercent: number;
  isProteinStandard: boolean;
  isLipidStandard: boolean;
  isGlucidStandard: boolean;
  isBalanced: boolean;
  ratioString: string;
  ageGroup: PreschoolAgeGroup;
  targetRatioString: string;
  evaluationNote: string;
  recommendations: string[];
}

/**
 * Tính tỷ lệ % phân bổ năng lượng P - L - G (Đạm - Béo - Đường)
 * 1g Protein = 4 kcal, 1g Lipid = 9 kcal, 1g Glucid = 4 kcal
 * Tuân thủ Thông tư 28/2016/TT-BGDĐT & Chuẩn Viện Dinh Dưỡng
 */
export function calculateMacroEnergyDistribution(
  proteinGrams: number,
  lipidGrams: number,
  glucidGrams: number,
  ageGroup: PreschoolAgeGroup = 'mau_giao'
): NutritionStandardResult {
  const energyProtein = proteinGrams * 4;
  const energyLipid = lipidGrams * 9;
  const energyGlucid = glucidGrams * 4;
  const totalEnergy = energyProtein + energyLipid + energyGlucid || 1;

  const proteinPercent = Math.round((energyProtein / totalEnergy) * 1000) / 10;
  const lipidPercent = Math.round((energyLipid / totalEnergy) * 1000) / 10;
  const glucidPercent = Math.round((energyGlucid / totalEnergy) * 1000) / 10;

  // Chuẩn Thông tư 28/2016/TT-BGDĐT:
  // - Nhà trẻ (24-36 tháng): P: 13-20%, L: 30-40%, G: 47-50%
  // - Mẫu giáo (3-6 tuổi): P: 13-20%, L: 25-35%, G: 52-60%
  let minP = 13;
  let maxP = 20;
  let minL = ageGroup === 'nha_tre' ? 30 : 25;
  let maxL = ageGroup === 'nha_tre' ? 40 : 35;
  let minG = ageGroup === 'nha_tre' ? 45 : 50;
  let maxG = ageGroup === 'nha_tre' ? 55 : 62;

  const isProteinStandard = proteinPercent >= minP && proteinPercent <= maxP;
  const isLipidStandard = lipidPercent >= minL && lipidPercent <= maxL;
  const isGlucidStandard = glucidPercent >= minG && glucidPercent <= maxG;
  const isBalanced = isProteinStandard && isLipidStandard && isGlucidStandard;

  const recommendations: string[] = [];
  if (proteinPercent < minP) recommendations.push(`Tăng cường đạm động/thực vật (hiện tại ${proteinPercent}%, chuẩn ${minP}-${maxP}%)`);
  if (proteinPercent > maxP) recommendations.push(`Thừa đạm (hiện tại ${proteinPercent}%, chuẩn ${minP}-${maxP}%), nên giảm bớt thịt/trứng để tránh gánh nặng thận cho trẻ`);
  if (lipidPercent < minL) recommendations.push(`Thiếu chất béo (hiện tại ${lipidPercent}%, chuẩn ${minL}-${maxL}%), nên bổ sung thêm dầu ăn dinh dưỡng/dầu mè/dầu gấc vào cháo/canh`);
  if (lipidPercent > maxL) recommendations.push(`Thừa chất béo (hiện tại ${lipidPercent}%, chuẩn ${minL}-${maxL}%), nên giảm món chiên rán`);
  if (glucidPercent < minG) recommendations.push(`Thiếu tinh bột đường (hiện tại ${glucidPercent}%, chuẩn ${minG}-${maxG}%), cần tăng lượng gạo tẻ, bún, khoai củ`);
  if (glucidPercent > maxG) recommendations.push(`Thừa tinh bột đường (hiện tại ${glucidPercent}%, chuẩn ${minG}-${maxG}%), cần tăng tỷ lệ rau xanh và thịt đạm`);

  let evaluationNote = isBalanced
    ? 'Đạt tỷ lệ P-L-G cân đối theo quy định GD&ĐT'
    : recommendations.join('; ');

  return {
    proteinPercent,
    lipidPercent,
    glucidPercent,
    isProteinStandard,
    isLipidStandard,
    isGlucidStandard,
    isBalanced,
    ratioString: `P: ${proteinPercent}% | L: ${lipidPercent}% | G: ${glucidPercent}%`,
    ageGroup,
    targetRatioString: ageGroup === 'nha_tre' ? 'P: 13-20% | L: 30-40% | G: 47-50%' : 'P: 13-20% | L: 25-35% | G: 52-60%',
    evaluationNote,
    recommendations,
  };
}

/**
 * Tính toán bảng đi chợ tổng hợp cho toàn trường sáng sớm dựa trên sĩ số học sinh
 */
export function generateProcurementGroceryList(breakdowns: DishRecipeBreakdown[], studentCount: number) {
  const map: Record<string, {
    ingredientName: string;
    category: FoodIngredientCategory;
    type: 'tuoi_song' | 'kho';
    unit: string;
    totalRawKg: number;
    totalCleanKg: number;
    pricePerKg: number;
    totalAmount: number;
    supplierName: string;
    dishesUsedIn: string[];
  }> = {};

  breakdowns.forEach((breakdown) => {
    breakdown.ingredients.forEach((ing) => {
      const key = ing.name.trim().toLowerCase();
      const rawGramsTotal = ing.rawGramsPerPortion * studentCount;
      const cleanGramsTotal = (ing.cleanGramsPerPortion || ing.rawGramsPerPortion * 0.9) * studentCount;
      const rawKg = rawGramsTotal / 1000;
      const cleanKg = cleanGramsTotal / 1000;
      const cost = rawKg * (ing.pricePerKg || 0);

      if (!map[key]) {
        map[key] = {
          ingredientName: ing.name,
          category: ing.category,
          type: ing.type,
          unit: ing.unit || 'kg',
          totalRawKg: rawKg,
          totalCleanKg: cleanKg,
          pricePerKg: ing.pricePerKg || 0,
          totalAmount: cost,
          supplierName: ing.supplierName || 'Vựa thực phẩm địa phương',
          dishesUsedIn: [breakdown.dishName],
        };
      } else {
        map[key].totalRawKg += rawKg;
        map[key].totalCleanKg += cleanKg;
        map[key].totalAmount += cost;
        if (!map[key].dishesUsedIn.includes(breakdown.dishName)) {
          map[key].dishesUsedIn.push(breakdown.dishName);
        }
      }
    });
  });

  const groceryItems = Object.values(map).map((item) => ({
    ...item,
    totalRawKg: Math.round(item.totalRawKg * 100) / 100,
    totalCleanKg: Math.round(item.totalCleanKg * 100) / 100,
    totalAmount: Math.round(item.totalAmount),
  }));

  const grandTotalCost = groceryItems.reduce((sum, item) => sum + item.totalAmount, 0);

  return {
    studentCount,
    groceryItems,
    grandTotalCost,
    averageCostPerStudent: Math.round(grandTotalCost / (studentCount || 1)),
  };
}
