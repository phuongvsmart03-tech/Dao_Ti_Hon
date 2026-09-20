import { DishIngredient } from '@/types/lightning';
import { STANDARDIZED_DISH_DATABASE, getStandardizedIngredientsForDish } from '@/lib/dish-database';

// Danh mục định mức nguyên vật liệu mặc định cho các món ăn mầm non
export const DEFAULT_INGREDIENT_MAP: Record<string, DishIngredient[]> = {
  // 1. Món mặn
  'Thịt lợn rim nấm đông cô': [
    {
      name: 'Thịt lợn nạc mông',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 50,
      cleanPerPortionGrams: 45,
      pricePerKg: 135000,
      supplierName: 'Công ty Thực phẩm Sạch Ba Vì',
      supplierAddress: 'Khu công nghệ cao Hòa Lạc, Ba Vì, Hà Nội',
      supplierPhone: '024 3388 9911',
      delivererName: 'Nguyễn Văn Tuấn',
    },
    {
      name: 'Nấm đông cô tươi',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 15,
      cleanPerPortionGrams: 12,
      pricePerKg: 85000,
      supplierName: 'HTX Nông nghiệp Hữu cơ Đà Lạt',
      supplierAddress: '12 Đường Mai Anh Đào, P.8, TP. Đà Lạt',
      supplierPhone: '0263 3822 556',
      delivererName: 'Trần Đình Nam',
    },
    {
      name: 'Dầu ăn đậu nành Simply',
      type: 'kho',
      unit: 'lít',
      rawPerPortionGrams: 5,
      cleanPerPortionGrams: 5,
      pricePerKg: 55000,
      supplierName: 'Đại lý Bách Hóa Tổng Hợp Tuấn Mai',
      supplierAddress: 'Số 45 Chợ Hôm, Hà Nội',
      supplierPhone: '0912 345 678',
      delivererName: 'Phạm Minh Hải',
    },
  ],
  'Thịt kho trứng cút': [
    {
      name: 'Thịt lợn nạc vai',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 45,
      cleanPerPortionGrams: 40,
      pricePerKg: 140000,
      supplierName: 'Công ty Thực phẩm Sạch Ba Vì',
      supplierAddress: 'Khu công nghệ cao Hòa Lạc, Ba Vì, Hà Nội',
      supplierPhone: '024 3388 9911',
      delivererName: 'Nguyễn Văn Tuấn',
    },
    {
      name: 'Trứng cút tươi',
      type: 'tuoi_song',
      unit: 'quả',
      rawPerPortionGrams: 25,
      cleanPerPortionGrams: 20,
      pricePerKg: 70000,
      supplierName: 'Trang trại Gia cầm Tiên Viên',
      supplierAddress: 'Chương Mỹ, Hà Nội',
      supplierPhone: '024 3355 6677',
      delivererName: 'Lê Văn Thắng',
    },
  ],
  'Thịt bò xào cà chua': [
    {
      name: 'Thịt bò thăn tươi',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 45,
      cleanPerPortionGrams: 42,
      pricePerKg: 260000,
      supplierName: 'Công ty TNHH Bò Thịt Vĩnh Thịnh',
      supplierAddress: 'Vĩnh Tường, Vĩnh Phúc',
      supplierPhone: '0211 3833 444',
      delivererName: 'Hoàng Quốc Việt',
    },
    {
      name: 'Cà chua VietGAP',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 25,
      cleanPerPortionGrams: 22,
      pricePerKg: 280000,
      supplierName: 'HTX Nông sản An Toàn Văn Đức',
      supplierAddress: 'Gia Lâm, Hà Nội',
      supplierPhone: '024 3876 5432',
      delivererName: 'Nguyễn Tiến Dũng',
    },
  ],
  'Cá basa kho thơm': [
    {
      name: 'Cá ba sa phi lê',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 55,
      cleanPerPortionGrams: 48,
      pricePerKg: 95000,
      supplierName: 'Cty Thủy Hải Sản Biển Đông',
      supplierAddress: 'Cần Thơ',
      supplierPhone: '0292 3888 999',
      delivererName: 'Đặng Văn Lực',
    },
    {
      name: 'Thơm (Dứa) mật',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 20,
      cleanPerPortionGrams: 15,
      pricePerKg: 22000,
      supplierName: 'HTX Nông sản An Toàn Văn Đức',
      supplierAddress: 'Gia Lâm, Hà Nội',
      supplierPhone: '024 3876 5432',
      delivererName: 'Nguyễn Tiến Dũng',
    },
  ],
  'Tôm hấp nước dừa xiêm': [
    {
      name: 'Tôm sú tươi lột nõn',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 40,
      cleanPerPortionGrams: 35,
      pricePerKg: 220000,
      supplierName: 'Cty TNHH Hải Sản Xanh',
      supplierAddress: 'Hải Hậu, Nam Định',
      supplierPhone: '0228 3777 888',
      delivererName: 'Trần Văn Quảng',
    },
  ],

  // 2. Món canh
  'Canh bí đỏ nấu tôm nõn': [
    {
      name: 'Bí đỏ hồ lô',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 40,
      cleanPerPortionGrams: 35,
      pricePerKg: 20000,
      supplierName: 'HTX Rau Sạch Đông Anh',
      supplierAddress: 'Đông Anh, Hà Nội',
      supplierPhone: '024 3965 4321',
      delivererName: 'Vũ Đức Thịnh',
    },
    {
      name: 'Tôm nõn tươi băm',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 15,
      cleanPerPortionGrams: 12,
      pricePerKg: 220000,
      supplierName: 'Cty TNHH Hải Sản Xanh',
      supplierAddress: 'Hải Hậu, Nam Định',
      supplierPhone: '0228 3777 888',
      delivererName: 'Trần Văn Quảng',
    },
  ],
  'Canh cua mồng tơi mướp hương': [
    {
      name: 'Cua đồng tươi xay lọc',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 35,
      cleanPerPortionGrams: 20,
      pricePerKg: 130000,
      supplierName: 'HTX Thủy sản Đồng Quê',
      supplierAddress: 'Ứng Hòa, Hà Nội',
      supplierPhone: '024 3399 8811',
      delivererName: 'Nguyễn Văn Lâm',
    },
    {
      name: 'Rau mồng tơi hữu cơ',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 30,
      cleanPerPortionGrams: 25,
      pricePerKg: 25000,
      supplierName: 'HTX Rau Sạch Đông Anh',
      supplierAddress: 'Đông Anh, Hà Nội',
      supplierPhone: '024 3965 4321',
      delivererName: 'Vũ Đức Thịnh',
    },
    {
      name: 'Mướp hương non',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 20,
      cleanPerPortionGrams: 16,
      pricePerKg: 24000,
      supplierName: 'HTX Rau Sạch Đông Anh',
      supplierAddress: 'Đông Anh, Hà Nội',
      supplierPhone: '024 3965 4321',
      delivererName: 'Vũ Đức Thịnh',
    },
  ],
  'Canh cải ngọt nấu thịt băm': [
    {
      name: 'Rau cải ngọt non',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 35,
      cleanPerPortionGrams: 30,
      pricePerKg: 22000,
      supplierName: 'HTX Rau Sạch Đông Anh',
      supplierAddress: 'Đông Anh, Hà Nội',
      supplierPhone: '024 3965 4321',
      delivererName: 'Vũ Đức Thịnh',
    },
    {
      name: 'Thịt lợn nạc băm',
      type: 'tuoi_song',
      unit: 'kg',
      rawPerPortionGrams: 15,
      cleanPerPortionGrams: 15,
      pricePerKg: 135000,
      supplierName: 'Công ty Thực phẩm Sạch Ba Vì',
      supplierAddress: 'Khu công nghệ cao Hòa Lạc, Ba Vì, Hà Nội',
      supplierPhone: '024 3388 9911',
      delivererName: 'Nguyễn Văn Tuấn',
    },
  ],

  // 3. Cơm & Lương thực chính
  'Cơm trắng gạo tám thơm': [
    {
      name: 'Gạo tám thơm Điện Biên',
      type: 'kho',
      unit: 'kg',
      rawPerPortionGrams: 80,
      cleanPerPortionGrams: 80,
      pricePerKg: 24000,
      supplierName: 'Tổng Đại lý Lương thực Miền Bắc',
      supplierAddress: 'Số 88 Giải Phóng, Đống Đa, Hà Nội',
      supplierPhone: '024 3864 1234',
      delivererName: 'Lý Văn Hải',
    },
  ],

  // 4. Gia vị dùng chung hàng ngày
  'Gia vị bếp': [
    {
      name: 'Nước mắm cá cơm Chinsu',
      type: 'kho',
      unit: 'lít',
      rawPerPortionGrams: 3,
      cleanPerPortionGrams: 3,
      pricePerKg: 42000,
      supplierName: 'Đại lý Bách Hóa Tổng Hợp Tuấn Mai',
      supplierAddress: 'Số 45 Chợ Hôm, Hà Nội',
      supplierPhone: '0912 345 678',
      delivererName: 'Phạm Minh Hải',
    },
    {
      name: 'Muối I-ốt tinh chế',
      type: 'kho',
      unit: 'kg',
      rawPerPortionGrams: 1,
      cleanPerPortionGrams: 1,
      pricePerKg: 10000,
      supplierName: 'Đại lý Bách Hóa Tổng Hợp Tuấn Mai',
      supplierAddress: 'Số 45 Chợ Hôm, Hà Nội',
      supplierPhone: '0912 345 678',
      delivererName: 'Phạm Minh Hải',
    },
  ],
};

// Hàm lấy danh sách nguyên liệu của một món ăn hoặc tạo mặc định thông minh nếu chưa có trong map
export function getIngredientsForDish(dishName: string): DishIngredient[] {
  const trimmed = dishName.trim();
  
  // 1. Ưu tiên tra cứu trong bảng dữ liệu chuẩn hóa dinh dưỡng (đầy đủ món mặn, phụ gia, gia vị, tỷ lệ thải bỏ)
  const standardized = getStandardizedIngredientsForDish(trimmed);
  if (standardized && standardized.length > 0) {
    return standardized;
  }

  if (DEFAULT_INGREDIENT_MAP[trimmed]) {
    return DEFAULT_INGREDIENT_MAP[trimmed];
  }

  // Khớp gần đúng
  for (const key of Object.keys(DEFAULT_INGREDIENT_MAP)) {
    if (trimmed.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(trimmed.toLowerCase())) {
      return DEFAULT_INGREDIENT_MAP[key];
    }
  }

  // Sinh tự động thực phẩm tươi sống dựa trên từ khóa trong tên món
  const isSoup = trimmed.toLowerCase().includes('canh') || trimmed.toLowerCase().includes('súp');
  const isPork = trimmed.toLowerCase().includes('thịt') || trimmed.toLowerCase().includes('heo') || trimmed.toLowerCase().includes('lợn');
  const isBeef = trimmed.toLowerCase().includes('bò');
  const isFish = trimmed.toLowerCase().includes('cá');
  const isShrimp = trimmed.toLowerCase().includes('tôm');
  const isChicken = trimmed.toLowerCase().includes('gà');

  let rawItem = 'Thịt lợn nạc sạch';
  let price = 135000;
  let supplier = 'Công ty Thực phẩm Sạch Ba Vì';
  let address = 'Ba Vì, Hà Nội';
  let phone = '024 3388 9911';

  if (isBeef) {
    rawItem = 'Thịt bò nạc tươi';
    price = 260000;
    supplier = 'Công ty Bò Thịt Vĩnh Thịnh';
    address = 'Vĩnh Phúc';
    phone = '0211 3833 444';
  } else if (isFish) {
    rawItem = 'Cá phi lê tươi';
    price = 110000;
    supplier = 'Cty Thủy Hải Sản Biển Đông';
    address = 'Cần Thơ';
    phone = '0292 3888 999';
  } else if (isShrimp) {
    rawItem = 'Tôm nõn tươi';
    price = 220000;
    supplier = 'Cty TNHH Hải Sản Xanh';
    address = 'Nam Định';
    phone = '0228 3777 888';
  } else if (isChicken) {
    rawItem = 'Thịt gà ta phi lê';
    price = 125000;
    supplier = 'Trang trại Gia cầm Tiên Viên';
    address = 'Hà Nội';
    phone = '024 3355 6677';
  }

  const rawGrams = isSoup ? 20 : 45;
  const cleanGrams = isSoup ? 18 : 40;

  return [
    {
      name: rawItem,
      type: 'tuoi_song',
      unit: 'kg',
      role: 'NL chính',
      rawPerPortionGrams: rawGrams,
      cleanPerPortionGrams: cleanGrams,
      pricePerKg: price,
      supplierName: supplier,
      supplierAddress: address,
      supplierPhone: phone,
      delivererName: 'Nguyễn Văn Tuấn',
    },
    {
      name: isSoup ? 'Rau củ hỗn hợp (Cà rốt, bí, rau)' : 'Hành hoa & Gia vị tươi',
      type: 'tuoi_song',
      unit: 'kg',
      role: 'NL phụ',
      rawPerPortionGrams: isSoup ? 30 : 10,
      cleanPerPortionGrams: isSoup ? 25 : 8,
      pricePerKg: 25000,
      supplierName: 'HTX Rau Sạch Đông Anh',
      supplierAddress: 'Đông Anh, Hà Nội',
      supplierPhone: '024 3965 4321',
      delivererName: 'Vũ Đức Thịnh',
    },
    {
      name: 'Dầu ăn Simply',
      type: 'kho',
      unit: 'lít',
      role: 'Gia vị',
      rawPerPortionGrams: 2,
      cleanPerPortionGrams: 2,
      pricePerKg: 52000,
      supplierName: 'Đại lý Bách Hóa Tổng Hợp Tuấn Mai',
      supplierAddress: 'Số 45 Chợ Hôm, Hai Bà Trưng, Hà Nội',
      supplierPhone: '0912 345 678',
      delivererName: 'Phạm Minh Hải',
    },
    {
      name: 'Nước mắm Chinsu',
      type: 'kho',
      unit: 'lít',
      role: 'Gia vị',
      rawPerPortionGrams: 1,
      cleanPerPortionGrams: 1,
      pricePerKg: 42000,
      supplierName: 'Đại lý Bách Hóa Tổng Hợp Tuấn Mai',
      supplierAddress: 'Số 45 Chợ Hôm, Hai Bà Trưng, Hà Nội',
      supplierPhone: '0912 345 678',
      delivererName: 'Phạm Minh Hải',
    },
  ];
}
