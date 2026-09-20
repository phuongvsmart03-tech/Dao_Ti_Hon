import { DishItem } from '@/types/preschool';

/**
 * BỘ DỮ LIỆU GỐC CHUẨN CƠ SỞ (SEED BACKUP DATA - 30 MÓN CHỐT)
 * Được bảo vệ trong hệ thống để người dùng có thể khôi phục lại bất kỳ lúc nào.
 */
export const MASTER_SEED_BACKUP_DISHES: DishItem[] = [
  // --- I. MÓN MẶN CHÍNH (8 MÓN) ---
  {
    id: 'dish-1',
    name: 'Cá Basa kho thơm',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu đạm', 'Omega-3', 'Vị thanh ngọt'],
    caloriesEstimate: 165,
    description: 'Cá basa béo mềm kho dứa (thơm) dịu ngọt, đậm đà, khử tanh bằng nước gừng tươi.',
  },
  {
    id: 'dish-2',
    name: 'Thịt bò xào cà chua',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Mẫu giáo (3-6 tuổi)',
    nutritionTags: ['Giàu sắt', 'Đạm cao', 'Vitamin C'],
    caloriesEstimate: 180,
    description: 'Thịt bò mềm băm/thái mỏng xào cà chua chín tới, sốt chua ngọt đưa cơm.',
  },
  {
    id: 'dish-3',
    name: 'Cá thu sốt cà',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu DHA', 'Đạm biển', 'Vitamin A'],
    caloriesEstimate: 175,
    description: 'Cá thu nạc thơm sốt cà chua tươi, nước sốt sánh mịn giàu dưỡng chất cho não bộ.',
  },
  {
    id: 'dish-4',
    name: 'Tôm sốt cam',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu Canxi', 'Vitamin C', 'Hấp dẫn vị giác'],
    caloriesEstimate: 155,
    description: 'Tôm sú lột nõn đảo sốt nước cốt cam tươi vàng óng, chua ngọt tự nhiên kích thích ăn ngon.',
  },
  {
    id: 'dish-5',
    name: 'Tôm ram',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu Canxi', 'Đậm đà', 'Khoáng chất'],
    caloriesEstimate: 160,
    description: 'Tôm nõn rim mặn ngọt óng ả, rắc hành hoa, thơm lừng vị mầm non.',
  },
  {
    id: 'dish-6',
    name: 'Thịt kho trứng cút',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Đạm kép', 'Giàu Lecithin', 'Khoáng chất'],
    caloriesEstimate: 210,
    description: 'Thịt lợn nạc vai thái quân cờ kho mềm cùng trứng cút bùi ngậy, nước dừa tươi thơm lừng.',
  },
  {
    id: 'dish-7',
    name: 'Chả cá chiên',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Đạm hải sản', 'Thơm ngon', 'Dễ nhai'],
    caloriesEstimate: 170,
    description: 'Chả cá thác lác quết dẻo thơm thì là, chiên vàng mặt ngoài, bên trong mềm mọng.',
  },
  {
    id: 'dish-8',
    name: 'Trứng chiên rau củ',
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Lutein', 'Vitamin tổng hợp', 'Màu sắc vui mắt'],
    caloriesEstimate: 145,
    description: 'Trứng gà ta đánh bông trộn cà rốt, bắp ngọt, nấm tươi xắt hạt lựu, cuộn vàng đều.',
  },

  // --- II. MÓN CANH (6 MÓN) ---
  {
    id: 'dish-9',
    name: 'Canh chua cá bớp',
    category: 'Món canh',
    defaultMealSlot: 'lunchSoup',
    suitableAge: 'Mẫu giáo (3-6 tuổi)',
    nutritionTags: ['Omega-3', 'Thanh mát', 'Chua dịu'],
    caloriesEstimate: 95,
    description: 'Cá bớp ngọt thịt nấu chua thanh cùng cà chua, giá đỗ, thì là, thơm mát giải nhiệt.',
  },
  {
    id: 'dish-10',
    name: 'Canh cua mồng tơi',
    category: 'Món canh',
    defaultMealSlot: 'lunchSoup',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu Canxi tự nhiên', 'Mát ruột', 'Dễ tiêu'],
    caloriesEstimate: 85,
    description: 'Cua đồng xay lọc gạch thơm béo nấu rau mồng tơi mướp hương thanh ngọt mùa hè.',
  },
  {
    id: 'dish-11',
    name: 'Canh bí đao thịt bằm',
    category: 'Món canh',
    defaultMealSlot: 'lunchSoup',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Thanh nhiệt', 'Ít calo', 'Nhuận tràng'],
    caloriesEstimate: 75,
    description: 'Bí đao non băm nhỏ hoặc thái mỏng nấu thịt nạc băm ngọt trong, rắc ngò gai hành hoa.',
  },
  {
    id: 'dish-12',
    name: 'Canh bí đỏ thịt bằm',
    category: 'Món canh',
    defaultMealSlot: 'lunchSoup',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu Vitamin A', 'Bổ mắt', 'Bổ não'],
    caloriesEstimate: 95,
    description: 'Bí đỏ ngọt bùi nấu mềm cùng thịt nạc xay, giúp sáng mắt và phát triển trí tuệ.',
  },
  {
    id: 'dish-13',
    name: 'Canh cải thịt bằm',
    category: 'Món canh',
    defaultMealSlot: 'lunchSoup',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Chất xơ', 'Vitamin C', 'Kẽm'],
    caloriesEstimate: 70,
    description: 'Rau cải ngọt non cắt nhuyễn nấu thịt lợn thăn băm, nước canh trong ngọt tự nhiên.',
  },
  {
    id: 'dish-14',
    name: 'Canh dưa hồng thịt bằm',
    category: 'Món canh',
    defaultMealSlot: 'lunchSoup',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giải nhiệt', 'Mát cơ thể', 'Khoáng vi lượng'],
    caloriesEstimate: 70,
    description: 'Dưa hồng non giòn ngọt đặc trưng nấu thịt băm, món canh thanh mát giải độc mùa nóng.',
  },

  // --- III. BỮA SÁNG & BỮA XẾ (6 MÓN) ---
  {
    id: 'dish-15',
    name: 'Súp gà',
    category: 'Bữa sáng & Bữa xế',
    defaultMealSlot: 'breakfast',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Đạm gia cầm', 'Dễ nuốt', 'Bổ phế'],
    caloriesEstimate: 160,
    description: 'Thịt gà ta xé sợi nhỏ nấu bắp ngọt, nấm tuyết, trứng cút thả hoa, rắc ngò tươi thơm dịu.',
  },
  {
    id: 'dish-16',
    name: 'Phở bò',
    category: 'Bữa sáng & Bữa xế',
    defaultMealSlot: 'breakfast',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Năng lượng cao', 'Sắt', 'Món truyền thống'],
    caloriesEstimate: 230,
    description: 'Bánh phở tươi mềm nấu nước dùng ninh xương ống bò củ quả trong vắt, thịt bò thái mỏng chín mềm.',
  },
  {
    id: 'dish-17',
    name: 'Bánh canh chả cá',
    category: 'Bữa sáng & Bữa xế',
    defaultMealSlot: 'breakfast',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Đạm cá', 'Sợi dai mềm', 'Nước dùng thanh'],
    caloriesEstimate: 210,
    description: 'Sợi bánh canh bột gạo mềm mượt, chả cá thác lác hấp cắt lát, nước dùng sườn hầm thanh vị.',
  },
  {
    id: 'dish-18',
    name: 'Cháo thịt bằm',
    category: 'Bữa sáng & Bữa xế',
    defaultMealSlot: 'breakfast',
    suitableAge: 'Nhà trẻ & Mẫu giáo Bé',
    nutritionTags: ['Dễ tiêu hóa', 'Ấm dạ dày', 'Lành tính'],
    caloriesEstimate: 180,
    description: 'Gạo tẻ thơm ninh nhừ sánh mịn cùng thịt heo băm xào thơm hành củ, phù hợp thể trạng non nớt.',
  },
  {
    id: 'dish-19',
    name: 'Soup nui',
    category: 'Bữa sáng & Bữa xế',
    defaultMealSlot: 'afternoonSnack',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Carbohydrate tốt', 'Hình thù đẹp mắt', 'Vitamin'],
    caloriesEstimate: 195,
    description: 'Nui chữ cái/nui sò luộc mềm nấu cùng sườn non băm, cà rốt tỉa hoa, đậu Hà Lan thơm ngọt.',
  },
  {
    id: 'dish-20',
    name: 'Bánh hỏi chả lụa',
    category: 'Bữa sáng & Bữa xế',
    defaultMealSlot: 'breakfast',
    suitableAge: 'Mẫu giáo (3-6 tuổi)',
    nutritionTags: ['Năng lượng sạch', 'Thơm bột gạo', 'Dễ ăn'],
    caloriesEstimate: 220,
    description: 'Bánh hỏi sợi chỉ trắng ngần thoa dầu hẹ, ăn kèm chả lụa loại 1 cắt que và nước mắm ngọt dịu.',
  },

  // --- IV. ĐỒ UỐNG & TRÁNG MIỆNG (8 MÓN) ---
  {
    id: 'dish-21',
    name: 'Sinh tố trái cây theo mùa',
    category: 'Tráng miệng',
    defaultMealSlot: 'lunchDessert',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Vitamin C, A, E', 'Chất chống oxy hóa', 'Tự nhiên 100%'],
    caloriesEstimate: 110,
    description: 'Xoài cát, bơ sáp, chuối hoặc dâu tây xay nhuyễn mịn cùng sữa đặc và sữa tươi tiệt trùng.',
  },
  {
    id: 'dish-22',
    name: 'Yaourt tự làm',
    category: 'Tráng miệng',
    defaultMealSlot: 'afternoonSnack',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Lợi khuẩn Probiotics', 'Tăng miễn dịch ruột', 'Canxi'],
    caloriesEstimate: 105,
    description: 'Sữa chua nhà trường tự ủ bằng men sống tự nhiên, sánh dẻo, vị chua ngọt thanh nhẹ.',
  },
  {
    id: 'dish-23',
    name: 'Nước Sâm',
    category: 'Đồ uống & Nước ép',
    defaultMealSlot: 'snackMorning',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Thanh nhiệt', 'Mát gan', 'Thảo mộc tự nhiên'],
    caloriesEstimate: 45,
    description: 'Nước sâm thảo mộc nấu từ mía lau, rễ tranh, lá dứa, râu ngô và đường phèn dịu mát.',
  },
  {
    id: 'dish-24',
    name: 'Nước Mía',
    category: 'Đồ uống & Nước ép',
    defaultMealSlot: 'snackMorning',
    suitableAge: 'Mẫu giáo (3-6 tuổi)',
    nutritionTags: ['Khoáng chất', 'Năng lượng tức thì', 'Vitamin'],
    caloriesEstimate: 60,
    description: 'Nước mía tươi ép cùng tắc/quất thơm lừng, bổ sung khoáng và giải khát ngày hè năng động.',
  },
  {
    id: 'dish-25',
    name: 'Nước Cam',
    category: 'Đồ uống & Nước ép',
    defaultMealSlot: 'snackMorning',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Vitamin C cao', 'Tăng đề kháng', 'Chống cảm cúm'],
    caloriesEstimate: 65,
    description: 'Cam sành/cam xoàn tươi mọng nước vắt tay, pha chút xíu mật ong/đường phèn thanh sạch.',
  },
  {
    id: 'dish-26',
    name: 'Nước Dừa',
    category: 'Đồ uống & Nước ép',
    defaultMealSlot: 'snackMorning',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Chất điện giải tự nhiên', 'Kali', 'Hydrate tế bào'],
    caloriesEstimate: 45,
    description: 'Nước dừa xiêm xanh nguyên chất, ngọt thanh tự nhiên, bù nước và khoáng chất tuyệt hảo.',
  },
  {
    id: 'dish-27',
    name: 'Thạch rau câu',
    category: 'Tráng miệng',
    defaultMealSlot: 'lunchDessert',
    suitableAge: 'Mẫu giáo (3-6 tuổi)',
    nutritionTags: ['Chất xơ rau câu', 'Mát lạnh', 'Trẻ hào hứng'],
    caloriesEstimate: 70,
    description: 'Thạch rau câu dẻo nấu từ nước cốt dừa và lá dứa thơm mát, cắt hạt lựu an toàn chống hóc nghẹn.',
  },
  {
    id: 'dish-28',
    name: 'Bánh chuối',
    category: 'Tráng miệng',
    defaultMealSlot: 'afternoonSnack',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Giàu Kali', 'Chất xơ', 'Năng lượng ngọt lành'],
    caloriesEstimate: 140,
    description: 'Bánh chuối hấp nước cốt dừa mè rang bùi béo, mềm mịn thơm ngọt mùi chuối sứ chín muồi.',
  },

  // --- V. MÓN ĂN KÈM & NƯỚC UỐNG THIẾT YẾU (2 MÓN) ---
  {
    id: 'dish-29',
    name: 'Cơm trắng',
    category: 'Món ăn kèm & Cơm',
    defaultMealSlot: 'lunchStaple',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Năng lượng chính', 'Dẻo thơm', 'Gạo sạch'],
    caloriesEstimate: 180,
    description: 'Cơm gạo tám thơm Điện Biên nấu chín mềm dẻo, xới tơi nóng hổi phục vụ bữa trưa.',
  },
  {
    id: 'dish-30',
    name: 'Nước lọc',
    category: 'Đồ uống & Nước ép',
    defaultMealSlot: 'snackMorning',
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: ['Nước uống tinh khiết', 'Tiệt trùng', 'Thanh lọc'],
    caloriesEstimate: 0,
    description: 'Nước tinh khiết đun sôi để nguội / nước khoáng đóng bình kiểm định an toàn vệ sinh.',
  },
];

export const INITIAL_DISH_LIBRARY: DishItem[] = MASTER_SEED_BACKUP_DISHES;

const DISH_STORAGE_KEY = 'preschool_master_dish_library_v3';

export function getStoredDishLibrary(): DishItem[] {
  if (typeof window === 'undefined') return MASTER_SEED_BACKUP_DISHES;
  try {
    const raw = localStorage.getItem(DISH_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(MASTER_SEED_BACKUP_DISHES));
      return MASTER_SEED_BACKUP_DISHES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MASTER_SEED_BACKUP_DISHES;
  } catch {
    return MASTER_SEED_BACKUP_DISHES;
  }
}

export function saveDishLibrary(items: DishItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function addDishToLibrary(dish: DishItem): DishItem[] {
  const current = getStoredDishLibrary();
  const updated = [dish, ...current];
  saveDishLibrary(updated);
  return updated;
}

export function removeDishFromLibrary(dishId: string): DishItem[] {
  const current = getStoredDishLibrary();
  const updated = current.filter((d) => d.id !== dishId);
  saveDishLibrary(updated);
  return updated;
}

/**
 * Khôi phục kho món ăn về đúng 30 món chốt của cơ sở
 */
export function resetDishLibraryToDefault(): DishItem[] {
  if (typeof window === 'undefined') return MASTER_SEED_BACKUP_DISHES;
  try {
    localStorage.setItem(DISH_STORAGE_KEY, JSON.stringify(MASTER_SEED_BACKUP_DISHES));
  } catch {
    // ignore
  }
  return MASTER_SEED_BACKUP_DISHES;
}
