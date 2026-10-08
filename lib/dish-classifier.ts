import { DishCategory, MealSlot } from '@/types/preschool';

export interface ClassifiedDishInfo {
  category: DishCategory;
  defaultMealSlot: MealSlot;
  nutritionTags: string[];
  caloriesEstimate: number;
  suitableAge: string;
  description: string;
}

/**
 * Bộ Phân Loại Món Ăn Mầm Non Thông Minh (Preschool Smart Dish Classifier)
 * Nhận diện tức thì loại món ăn chuẩn 7 nhóm nghiệp vụ mầm non Việt Nam.
 */
export function classifyDish(dishName: string): ClassifiedDishInfo {
  const name = (dishName || '').trim();
  const lower = name.toLowerCase();

  // 1. NHÓM: ĐỒ UỐNG & NƯỚC ÉP (Giải khát, bổ sung vitamin, bữa phụ/xế)
  const isDrink =
    lower.includes('chanh') ||
    lower.includes('tắc') ||
    lower.includes('quất') ||
    lower.includes('nước cam') ||
    lower.includes('nước ép') ||
    lower.includes('sinh tố') ||
    lower.includes('sữa hạt') ||
    lower.includes('sữa đậu') ||
    lower.includes('sữa bắp') ||
    lower.includes('sữa ngô') ||
    lower.includes('sữa tươi') ||
    lower.includes('sữa chua uống') ||
    lower.includes('sắn dây') ||
    lower.includes('nước mía') ||
    lower.includes('nước dừa') ||
    lower.includes('nước sâm') ||
    lower.includes('sâm bí đao') ||
    lower.includes('trà thảo mộc') ||
    lower.includes('nước lọc') ||
    lower.includes('nước quả') ||
    lower.includes('nước vối') ||
    (lower.includes('nước') && !lower.includes('nước mắm') && !lower.includes('nước tương') && !lower.includes('nước dùng'));

  if (isDrink) {
    let calo = 55;
    const tags = ['Thanh nhiệt', 'Giàu Vitamin C', 'Giải khát tự nhiên', 'Dễ tiêu'];
    if (lower.includes('sữa')) {
      calo = 110;
      tags.push('Giàu Canxi', 'Đạm thực vật');
    } else if (lower.includes('chanh') || lower.includes('cam')) {
      calo = 50;
      tags.push('Đề kháng khỏe', 'Axit citric tự nhiên');
    }
    return {
      category: 'Đồ uống & Nước ép',
      defaultMealSlot: 'snackMorning',
      caloriesEstimate: calo,
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: tags,
      description: `Thức uống thanh mát cho trẻ mầm non, pha chế từ nguyên liệu sạch tươi ngon, cân đối độ ngọt dịu vừa phải.`,
    };
  }

  // 2. NHÓM: TRÁNG MIỆNG (Hoa quả tươi, chè, sữa chua ăn, thạch)
  const isDessert =
    lower.includes('chuối') ||
    lower.includes('dưa hấu') ||
    lower.includes('đu đủ') ||
    lower.includes('thanh long') ||
    lower.includes('xoài') ||
    lower.includes('táo') ||
    lower.includes('lê') ||
    lower.includes('quýt') ||
    lower.includes('bưởi') ||
    lower.includes('chôm chôm') ||
    lower.includes('nho') ||
    lower.includes('chè ') ||
    lower.includes('sữa chua') ||
    lower.includes('thạch ') ||
    lower.includes('caramen') ||
    lower.includes('bánh flan') ||
    (lower.includes('cam') && !lower.includes('thịt') && !lower.includes('sốt') && !lower.includes('xào'));

  if (isDessert) {
    let calo = 65;
    const tags = ['Vitamin & Khoáng chất', 'Chất xơ tự nhiên', 'Thanh ngọt dịu', 'Dễ tiêu hóa'];
    if (lower.includes('sữa chua') || lower.includes('flan')) {
      calo = 95;
      tags.push('Lợi khuẩn đường ruột', 'Giàu Canxi');
    } else if (lower.includes('chè')) {
      calo = 120;
      tags.push('Năng lượng glucid', 'Vị bùi ngọt');
    }
    return {
      category: 'Tráng miệng',
      defaultMealSlot: 'lunchDessert',
      caloriesEstimate: calo,
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: tags,
      description: `Món tráng miệng tươi sạch, gọt vỏ cắt miếng vừa ăn, giúp trẻ hấp thu vitamin và khoáng chất sau bữa ăn.`,
    };
  }

  // 3. NHÓM: MÓN CANH & SÚP (Bữa trưa chính hoặc phụ)
  const isSoup =
    lower.includes('canh ') ||
    lower.includes('súp ') ||
    lower.includes('soup') ||
    lower.includes('riêu') ||
    lower.includes('xáo');

  if (isSoup) {
    let calo = 85;
    const tags = ['Giàu chất xơ', 'Nước dùng thanh ngọt', 'Dễ nuốt', 'Thanh mát'];
    if (lower.includes('cua') || lower.includes('tôm') || lower.includes('nghêu') || lower.includes('hến')) {
      calo = 95;
      tags.push('Giàu Canxi biển', 'Khoáng chất');
    } else if (lower.includes('thịt') || lower.includes('bò') || lower.includes('gà')) {
      calo = 100;
      tags.push('Đạm ngọt tự nhiên');
    }
    return {
      category: 'Món canh',
      defaultMealSlot: 'lunchSoup',
      caloriesEstimate: calo,
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: tags,
      description: `Món canh mầm non nấu nhạt, rau củ băm/cắt nhỏ ninh mềm, nước dùng ngọt tự nhiên từ xương và thịt nạc.`,
    };
  }

  // 4. NHÓM: BỮA SÁNG & BỮA XẾ
  const isBreakfast =
    lower.includes('bún') ||
    lower.includes('phở') ||
    lower.includes('miến') ||
    lower.includes('hủ tiếu') ||
    lower.includes('hủ tiêu') ||
    lower.includes('bánh bao') ||
    lower.includes('bánh giò') ||
    lower.includes('bánh cuốn') ||
    lower.includes('bánh mì') ||
    lower.includes('nui') ||
    lower.includes('mì ý') ||
    lower.includes('mì sợi') ||
    (lower.includes('cháo') && !lower.includes('xế'));

  if (isBreakfast) {
    return {
      category: 'Bữa sáng',
      defaultMealSlot: 'breakfast',
      caloriesEstimate: 220,
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: ['Năng lượng dồi dào', 'Dễ tiêu hóa', 'Ấm bụng', 'Đầy đủ 4 nhóm chất'],
      description: `Món ăn sáng dinh dưỡng khởi đầu ngày mới cho trẻ, sợi mềm dễ nhai nuốt, nước dùng ngọt thanh bổ dưỡng.`,
    };
  }

  const isAfternoonSnack =
    lower.includes('bữa xế') ||
    lower.includes('ăn xế') ||
    lower.includes('chè ') ||
    lower.includes('bánh flan') ||
    lower.includes('caramen') ||
    lower.includes('sữa chua') ||
    lower.includes('bông lan') ||
    lower.includes('bánh quy') ||
    lower.includes('súp bí đỏ') ||
    lower.includes('súp bắp');

  if (isAfternoonSnack) {
    return {
      category: 'Bữa xế (phụ)',
      defaultMealSlot: 'afternoonSnack',
      caloriesEstimate: 140,
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: ['Bổ sung năng lượng chiều', 'Dễ hấp thu', 'Thanh ngọt dịu'],
      description: `Món ăn nhẹ bữa xế chiều sau giấc ngủ trưa, giúp trẻ hồi phục năng lượng tham gia hoạt động chiều.`,
    };
  }

  // 5. NHÓM: MÓN ĂN KÈM & CƠM (Cơm tẻ, cơm nếp, xôi, khoai, ngô)
  const isStaple =
    lower.includes('cơm') ||
    lower.includes('xôi') ||
    lower.includes('khoai lang') ||
    lower.includes('ngô luộc') ||
    lower.includes('bắp luộc');

  if (isStaple) {
    return {
      category: 'Món ăn kèm & Cơm',
      defaultMealSlot: 'lunchStaple',
      caloriesEstimate: 180,
      suitableAge: 'Tất cả lứa tuổi',
      nutritionTags: ['Năng lượng chính', 'Giàu tinh bột sạch', 'Dẻo thơm'],
      description: `Cơm dẻo thơm nấu chín kỹ từ gạo sạch chất lượng cao, cung cấp nguồn năng lượng glucid chủ lực cho trẻ.`,
    };
  }

  // 6. NHÓM: MÓN MẶN CHÍNH (Thịt, cá, tôm, cua, trứng, bò, gà, đậu phụ...)
  let tags = ['Giàu đạm', 'Phát triển thể chất'];
  let calo = 165;

  if (lower.includes('cá') || lower.includes('tôm') || lower.includes('chả cá') || lower.includes('hải sản')) {
    tags.push('Omega-3', 'Giàu Canxi', 'Đạm biển mềm');
    calo = 160;
  } else if (lower.includes('bò')) {
    tags.push('Giàu sắt', 'Đạm cao', 'Bổ máu');
    calo = 180;
  } else if (lower.includes('gà')) {
    tags.push('Đạm trắng', 'Dễ tiêu hóa');
    calo = 150;
  } else if (lower.includes('trứng')) {
    tags.push('Lecithin', 'Vitamin A', 'Dễ hấp thu');
    calo = 145;
  } else if (lower.includes('đậu') || lower.includes('tàu hũ')) {
    tags.push('Đạm thực vật', 'Thanh đạm');
    calo = 135;
  } else {
    tags.push('Đạm động vật', 'Nạc mềm');
  }

  return {
    category: 'Món mặn chính',
    defaultMealSlot: 'lunchMain',
    caloriesEstimate: calo,
    suitableAge: 'Tất cả lứa tuổi',
    nutritionTags: tags,
    description: `Món mặn bữa trưa giàu protein và chất khoáng, băm nhỏ hoặc thái mỏng rim/kho/xào mềm vừa khẩu vị trẻ.`,
  };
}
