import { DishIngredient } from '@/types/lightning';

// Nhà cung cấp & cơ sở sản xuất chuẩn mực ngành giáo dục mầm non
const SUPPLIERS = {
  MEAT: {
    name: 'Công ty CP Thực phẩm Sạch Ba Vì',
    address: 'KCN Hòa Lạc, Ba Vì, Hà Nội',
    phone: '024 3388 9911',
    deliverer: 'Nguyễn Văn Tuấn',
  },
  SEAFOOD: {
    name: 'Công ty TNHH Hải Sản Xanh',
    address: 'Hải Hậu, Nam Định',
    phone: '0228 3777 888',
    deliverer: 'Trần Văn Quảng',
  },
  VEGGIE: {
    name: 'HTX Nông nghiệp An Toàn Đông Anh',
    address: 'Đông Anh, Hà Nội',
    phone: '024 3965 4321',
    deliverer: 'Vũ Đức Thịnh',
  },
  DRY_SPICE: {
    name: 'Tổng Đại lý Lương thực & Thực phẩm Tuấn Mai',
    address: 'Số 45 Chợ Hôm, Hai Bà Trưng, Hà Nội',
    phone: '0912 345 678',
    deliverer: 'Phạm Minh Hải',
  },
  MILK: {
    name: 'Công ty Cổ phần Sữa Ba Vì & TH True Milk',
    address: 'Ba Vì, Hà Nội / Nghĩa Đàn, Nghệ An',
    phone: '1800 54 54 40',
    deliverer: 'Lê Hoàng Sơn',
  },
  RICE: {
    name: 'Tổng Công ty Lương thực Miền Bắc',
    address: 'Số 88 Giải Phóng, Đống Đa, Hà Nội',
    phone: '024 3864 1234',
    deliverer: 'Lý Văn Hải',
  },
};

// Cơ sở sản xuất đồ khô / bao gói sẵn / phụ gia
const PRODUCERS = {
  OIL: { name: 'Công ty Dầu thực vật Cái Lân (Simply)', address: 'KCN Cái Lân, TP. Hạ Long, Quảng Ninh' },
  FISH_SAUCE: { name: 'Công ty CP Hàng tiêu dùng Masan (Chinsu)', address: 'KCN Tân Đông Hiệp, Dĩ An, Bình Dương' },
  SUGAR: { name: 'Công ty CP Đường Biên Hòa', address: 'KCN Biên Hòa 1, Đồng Nai' },
  SALT: { name: 'Công ty CP Muối & Thực phẩm Miền Bắc', address: 'P. Phúc Xá, Ba Đình, Hà Nội' },
  RICE: { name: 'Nhà máy chế biến Lương thực Hải Hậu', address: 'Hải Hậu, Nam Định' },
  MILK_TH: { name: 'Nhà máy Chế biến Sữa Tươi Sạch TH', address: 'Nghĩa Đàn, Nghệ An' },
  MILK_BV: { name: 'Nhà máy Sữa Ba Vì', address: 'Tản Lĩnh, Ba Vì, Hà Nội' },
  NOODLE: { name: 'Công ty CP Thực phẩm Safoco / Bích Chi', address: 'TP. Sa Đéc, Đồng Tháp' },
  FLOUR: { name: 'Công ty CP Tinh bột Tài Ký', address: 'KCN Tân Tạo, Bình Tân, TP.HCM' },
  JELLY: { name: 'Công ty TNHH Rau câu Long Hải', address: 'TP. Hải Dương, Hải Dương' },
};

export const STANDARDIZED_DISH_DATABASE: Record<string, DishIngredient[]> = {
  // ================= 1. CÁC MÓN MẶN CHÍNH =================
  'Cá Basa kho thơm': [
    { name: 'Cá Basa fillet', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 60, cleanPerPortionGrams: 33, wasteRate: 45, pricePerKg: 90000, protein: 7.8, fat: 2.4, carbs: 0, calories: 118, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Thơm (Dứa)', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 30, cleanPerPortionGrams: 24, wasteRate: 20, pricePerKg: 25000, protein: 0.15, fat: 0.03, carbs: 3.9, calories: 16.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 5, cleanPerPortionGrams: 5, pricePerKg: 52000, protein: 0, fat: 5, carbs: 0, calories: 45, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 45000, protein: 0.012, fat: 0.001, carbs: 0.1, calories: 0.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước mắm Chinsu', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 42000, protein: 0.1, fat: 0, carbs: 0, calories: 0.4, producerName: PRODUCERS.FISH_SAUCE.name, producerAddress: PRODUCERS.FISH_SAUCE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Đường kính trắng Biên Hòa', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 26000, protein: 0, fat: 0, carbs: 2, calories: 8, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Tỏi ta Hải Dương', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.85, wasteRate: 15, pricePerKg: 65000, protein: 0.064, fat: 0.005, carbs: 0.331, calories: 1.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 4, cleanPerPortionGrams: 3.88, wasteRate: 3, pricePerKg: 30000, protein: 0.072, fat: 0.02, carbs: 0.292, calories: 1.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Thịt bò xào cà chua': [
    { name: 'Thịt bò thăn tươi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 45, cleanPerPortionGrams: 28, wasteRate: 38, pricePerKg: 260000, protein: 10.035, fat: 2.025, carbs: 0, calories: 92, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Cà chua VietGAP', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 20, cleanPerPortionGrams: 15.6, wasteRate: 22, pricePerKg: 25000, protein: 0.18, fat: 0.04, carbs: 0.78, calories: 4.2, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành tây trắng', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 13, cleanPerPortionGrams: 11.44, wasteRate: 12, pricePerKg: 22000, protein: 0.143, fat: 0.013, carbs: 1.17, calories: 5.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 52000, protein: 0, fat: 2, carbs: 0, calories: 18, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.94, wasteRate: 3, pricePerKg: 45000, protein: 0.024, fat: 0.002, carbs: 0.2, calories: 0.9, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước mắm Chinsu', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 42000, protein: 0.1, fat: 0, carbs: 0, calories: 0.4, producerName: PRODUCERS.FISH_SAUCE.name, producerAddress: PRODUCERS.FISH_SAUCE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 4, cleanPerPortionGrams: 3.88, wasteRate: 3, pricePerKg: 30000, protein: 0.072, fat: 0.02, carbs: 0.292, calories: 1.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Cá thu sốt cà': [
    { name: 'Cá thu tươi cắt khúc', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 35, cleanPerPortionGrams: 21, wasteRate: 40, pricePerKg: 180000, protein: 6.65, fat: 4.55, carbs: 0, calories: 117, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Cà chua VietGAP', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 25, cleanPerPortionGrams: 18, wasteRate: 28, pricePerKg: 25000, protein: 0.225, fat: 0.05, carbs: 0.975, calories: 5.3, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 52000, protein: 0, fat: 1, carbs: 0, calories: 9, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 45000, protein: 0.012, fat: 0.001, carbs: 0.1, calories: 0.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước mắm Chinsu', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 42000, protein: 0.1, fat: 0, carbs: 0, calories: 0.4, producerName: PRODUCERS.FISH_SAUCE.name, producerAddress: PRODUCERS.FISH_SAUCE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành ngò tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 0.5, cleanPerPortionGrams: 0.48, wasteRate: 4, pricePerKg: 35000, protein: 0.009, fat: 0.0025, carbs: 0.03, calories: 0.3, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Tôm sốt cam': [
    { name: 'Tôm sú tươi lột nõn', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 60, cleanPerPortionGrams: 25.2, wasteRate: 58, pricePerKg: 220000, protein: 11.04, fat: 0.54, carbs: 0, calories: 82, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Nước cam tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 14.5, wasteRate: 3, pricePerKg: 35000, protein: 0.105, fat: 0.03, carbs: 1.5, calories: 6.7, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 52000, protein: 0, fat: 1, carbs: 0, calories: 9, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 45000, protein: 0.012, fat: 0.001, carbs: 0.1, calories: 0.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Đường kính trắng Biên Hòa', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 3, cleanPerPortionGrams: 3, pricePerKg: 26000, protein: 0, fat: 0, carbs: 3, calories: 12, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Tôm ram': [
    { name: 'Tôm sú tươi lột nõn', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 60, cleanPerPortionGrams: 25.2, wasteRate: 58, pricePerKg: 220000, protein: 11.04, fat: 0.54, carbs: 0, calories: 88, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 5, cleanPerPortionGrams: 5, pricePerKg: 52000, protein: 0, fat: 5, carbs: 0, calories: 45, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 45000, protein: 0.012, fat: 0.001, carbs: 0.1, calories: 0.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước mắm Chinsu', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 42000, protein: 0.1, fat: 0, carbs: 0, calories: 0.4, producerName: PRODUCERS.FISH_SAUCE.name, producerAddress: PRODUCERS.FISH_SAUCE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Đường kính trắng Biên Hòa', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 26000, protein: 0, fat: 0, carbs: 2, calories: 8, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Thịt kho trứng cút': [
    { name: 'Thịt heo nạc vai tươi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 70, cleanPerPortionGrams: 59.5, wasteRate: 15, pricePerKg: 135000, protein: 14, fat: 4.9, carbs: 0, calories: 98, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Trứng cút tươi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 50, cleanPerPortionGrams: 42.5, wasteRate: 15, pricePerKg: 65000, protein: 6.55, fat: 5.55, carbs: 0.55, calories: 78, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 52000, protein: 0, fat: 1, carbs: 0, calories: 9, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.94, wasteRate: 3, pricePerKg: 45000, protein: 0.024, fat: 0.002, carbs: 0.2, calories: 0.9, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước mắm Chinsu', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 42000, protein: 0.2, fat: 0, carbs: 0, calories: 0.8, producerName: PRODUCERS.FISH_SAUCE.name, producerAddress: PRODUCERS.FISH_SAUCE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Đường kính trắng Biên Hòa', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 26000, protein: 0, fat: 0, carbs: 2, calories: 8, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Chả cá chiên': [
    { name: 'Cá thác lác nạo nguyên chất', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 50, cleanPerPortionGrams: 47.5, wasteRate: 5, pricePerKg: 190000, protein: 7.7, fat: 3.3, carbs: 0, calories: 106, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 52000, protein: 0, fat: 1, carbs: 0, calories: 9, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 45000, protein: 0.012, fat: 0.001, carbs: 0.1, calories: 0.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Trứng chiên rau củ': [
    { name: 'Trứng gà ta Ba Huân', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 20, cleanPerPortionGrams: 18, wasteRate: 10, pricePerKg: 55000, protein: 2.6, fat: 2.2, carbs: 0.2, calories: 140, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Cà rốt tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 40, cleanPerPortionGrams: 32, wasteRate: 20, pricePerKg: 22000, protein: 0.36, fat: 0.08, carbs: 3.84, calories: 17.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 52000, protein: 0, fat: 1, carbs: 0, calories: 9, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 30000, protein: 0.018, fat: 0.005, carbs: 0.073, calories: 0.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước mắm Chinsu', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 42000, protein: 0.1, fat: 0, carbs: 0, calories: 0.4, producerName: PRODUCERS.FISH_SAUCE.name, producerAddress: PRODUCERS.FISH_SAUCE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Thịt lợn rim nấm đông cô': [
    { name: 'Thịt lợn nạc vai', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 50, cleanPerPortionGrams: 42.5, wasteRate: 15, pricePerKg: 135000, protein: 9.5, fat: 3.5, carbs: 0, calories: 69.5, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Nấm đông cô tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 12, wasteRate: 20, pricePerKg: 85000, protein: 0.45, fat: 0.05, carbs: 1.2, calories: 7.0, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 3, cleanPerPortionGrams: 3, pricePerKg: 52000, protein: 0, fat: 3, carbs: 0, calories: 27, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 45000, protein: 0.012, fat: 0.001, carbs: 0.1, calories: 0.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước mắm Chinsu', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 42000, protein: 0.1, fat: 0, carbs: 0, calories: 0.4, producerName: PRODUCERS.FISH_SAUCE.name, producerAddress: PRODUCERS.FISH_SAUCE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  // ================= 2. CÁC MÓN CANH DINH DƯỠNG =================
  'Canh chua cá bớp': [
    { name: 'Cá bớp biển tươi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 42, cleanPerPortionGrams: 29.4, wasteRate: 30, pricePerKg: 210000, protein: 7.56, fat: 0.42, carbs: 0, calories: 78, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Dứa (Thơm)', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.6, wasteRate: 20, pricePerKg: 25000, protein: 0.01, fat: 0.002, carbs: 0.26, calories: 1.1, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Cà chua VietGAP', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 5, cleanPerPortionGrams: 3.9, wasteRate: 22, pricePerKg: 25000, protein: 0.045, fat: 0.01, carbs: 0.195, calories: 1.0, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Giá đỗ sạch', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 5, cleanPerPortionGrams: 4.8, wasteRate: 4, pricePerKg: 20000, protein: 0.2, fat: 0.01, carbs: 0.1, calories: 1.3, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước cốt me đóng chai', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 5, cleanPerPortionGrams: 5, pricePerKg: 35000, protein: 0.05, fat: 0.025, carbs: 2, calories: 8.4, producerName: 'Công ty Thực phẩm Cholimex', producerAddress: 'KCN Vĩnh Lộc, Bình Chánh, TP.HCM', supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Đường kính trắng', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 26000, protein: 0, fat: 0, carbs: 2, calories: 8, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành ngò tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 35000, protein: 0.036, fat: 0.01, carbs: 0.12, calories: 0.7, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Canh cua mồng tơi': [
    { name: 'Cua đồng xay lọc', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 35, cleanPerPortionGrams: 15, wasteRate: 57, pricePerKg: 130000, protein: 2.1, fat: 0.45, carbs: 0.3, calories: 42, supplierName: 'HTX Thủy sản Ứng Hòa', supplierAddress: 'Ứng Hòa, Hà Nội', supplierPhone: '024 3399 8811', delivererName: 'Nguyễn Văn Lâm' },
    { name: 'Rau mồng tơi sạch', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 30, cleanPerPortionGrams: 24, wasteRate: 20, pricePerKg: 25000, protein: 0.6, fat: 0.06, carbs: 1.1, calories: 7.3, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành tím khô', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 45000, protein: 0.012, fat: 0.001, carbs: 0.1, calories: 0.5, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Muối I-ốt tinh chế', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 10000, protein: 0, fat: 0, carbs: 0, calories: 0, producerName: PRODUCERS.SALT.name, producerAddress: PRODUCERS.SALT.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Canh cua mồng tơi mướp hương': [
    { name: 'Cua đồng tươi xay lọc', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 35, cleanPerPortionGrams: 15, wasteRate: 57, pricePerKg: 130000, protein: 2.1, fat: 0.45, carbs: 0.3, calories: 13.6, supplierName: 'HTX Thủy sản Ứng Hòa', supplierAddress: 'Ứng Hòa, Hà Nội', supplierPhone: '024 3399 8811', delivererName: 'Nguyễn Văn Lâm' },
    { name: 'Rau mồng tơi sạch', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 30, cleanPerPortionGrams: 24, wasteRate: 20, pricePerKg: 25000, protein: 0.6, fat: 0.06, carbs: 1.1, calories: 7.3, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Mướp hương non', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 20, cleanPerPortionGrams: 16, wasteRate: 20, pricePerKg: 24000, protein: 0.18, fat: 0.02, carbs: 0.8, calories: 4.1, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Muối I-ốt tinh chế', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 0.8, cleanPerPortionGrams: 0.8, pricePerKg: 10000, protein: 0, fat: 0, carbs: 0, calories: 0, producerName: PRODUCERS.SALT.name, producerAddress: PRODUCERS.SALT.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Canh bí đao thịt bằm': [
    { name: 'Thịt heo nạc băm', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 40, cleanPerPortionGrams: 34, wasteRate: 15, pricePerKg: 135000, protein: 7.6, fat: 3.6, carbs: 0, calories: 52, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Bí đao non', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 40, cleanPerPortionGrams: 32, wasteRate: 20, pricePerKg: 18000, protein: 0.16, fat: 0.04, carbs: 0.96, calories: 4.8, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành ngò tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 35000, protein: 0.036, fat: 0.01, carbs: 0.12, calories: 0.7, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Canh bí đỏ thịt bằm': [
    { name: 'Thịt heo nạc bằm', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 15, cleanPerPortionGrams: 12.75, wasteRate: 15, pricePerKg: 135000, protein: 2.85, fat: 1.35, carbs: 0, calories: 58, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Bí đỏ hồ lô', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 40, cleanPerPortionGrams: 30, wasteRate: 25, pricePerKg: 20000, protein: 0.4, fat: 0.04, carbs: 2.6, calories: 12.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 30000, protein: 0.018, fat: 0.005, carbs: 0.073, calories: 0.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Canh bí đỏ nấu tôm nõn': [
    { name: 'Bí đỏ hồ lô', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 40, cleanPerPortionGrams: 30, wasteRate: 25, pricePerKg: 20000, protein: 0.36, fat: 0.04, carbs: 3.2, calories: 14.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Tôm tươi băm', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 7.5, wasteRate: 50, pricePerKg: 220000, protein: 2.76, fat: 0.13, carbs: 0, calories: 12.2, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 1, pricePerKg: 52000, protein: 0, fat: 1, carbs: 0, calories: 9, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Muối I-ốt tinh chế', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 0.8, cleanPerPortionGrams: 0.8, pricePerKg: 10000, protein: 0, fat: 0, carbs: 0, calories: 0, producerName: PRODUCERS.SALT.name, producerAddress: PRODUCERS.SALT.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành hoa tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 30000, protein: 0.03, fat: 0.01, carbs: 0.12, calories: 0.7, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Canh cải thịt bằm': [
    { name: 'Thịt heo nạc bằm', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 15, cleanPerPortionGrams: 12.75, wasteRate: 15, pricePerKg: 135000, protein: 2.85, fat: 1.35, carbs: 0, calories: 48, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Rau cải xanh sạch', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 30, cleanPerPortionGrams: 24, wasteRate: 20, pricePerKg: 20000, protein: 0.69, fat: 0.09, carbs: 1.2, calories: 8.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 4, cleanPerPortionGrams: 4, pricePerKg: 52000, protein: 0, fat: 4, carbs: 0, calories: 36, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành ngò tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 35000, protein: 0.036, fat: 0.01, carbs: 0.12, calories: 0.7, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Canh dưa hồng thịt bằm': [
    { name: 'Thịt heo nạc bằm', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 15, cleanPerPortionGrams: 12.75, wasteRate: 15, pricePerKg: 135000, protein: 2.85, fat: 1.35, carbs: 0, calories: 48, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Dưa hồng tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 40, cleanPerPortionGrams: 32, wasteRate: 20, pricePerKg: 20000, protein: 0.24, fat: 0.04, carbs: 2.0, calories: 9.3, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 30000, protein: 0.036, fat: 0.01, carbs: 0.146, calories: 0.8, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  // ================= 3. CÁC MÓN SÁNG & BỮA XẾ =================
  'Súp gà': [
    { name: 'Thịt ức gà ta', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 15, cleanPerPortionGrams: 12, wasteRate: 20, pricePerKg: 95000, protein: 3.45, fat: 0.15, carbs: 0, calories: 112, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Cà rốt tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 12, wasteRate: 20, pricePerKg: 22000, protein: 0.135, fat: 0.03, carbs: 1.44, calories: 6.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Bắp ngọt hạt', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 14.5, wasteRate: 3, pricePerKg: 35000, protein: 0.51, fat: 0.225, carbs: 3.15, calories: 16.7, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nấm rơm tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 13.5, wasteRate: 10, pricePerKg: 75000, protein: 0.54, fat: 0.045, carbs: 0.51, calories: 4.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Trứng gà ta Ba Huân', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 20, cleanPerPortionGrams: 18, wasteRate: 10, pricePerKg: 55000, protein: 2.6, fat: 2.2, carbs: 0.2, calories: 29, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Bột năng Tài Ký', type: 'kho', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 5, cleanPerPortionGrams: 5, pricePerKg: 32000, protein: 0.005, fat: 0.005, carbs: 4.25, calories: 17.1, producerName: PRODUCERS.FLOUR.name, producerAddress: PRODUCERS.FLOUR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 30000, protein: 0.036, fat: 0.01, carbs: 0.146, calories: 0.8, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Phở bò': [
    { name: 'Thịt bò thăn tươi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 40, cleanPerPortionGrams: 28, wasteRate: 30, pricePerKg: 260000, protein: 8.92, fat: 1.8, carbs: 0, calories: 165, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Bánh phở tươi sạch', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 90, cleanPerPortionGrams: 90, pricePerKg: 25000, protein: 1.98, fat: 0.27, carbs: 28.8, calories: 125, supplierName: 'Lò Bún Phở Sạch Cầu Giấy', supplierAddress: 'Cầu Giấy, Hà Nội', supplierPhone: '024 3768 1122', delivererName: 'Nguyễn Văn Định' },
    { name: 'Xương ống hầm nước dùng', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 50, cleanPerPortionGrams: 15, wasteRate: 70, pricePerKg: 60000, protein: 1.8, fat: 2.25, carbs: 0.75, calories: 30.5, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Hành lá + ngò rí', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 4, cleanPerPortionGrams: 3.8, wasteRate: 5, pricePerKg: 35000, protein: 0.072, fat: 0.02, carbs: 0.24, calories: 1.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành tím nướng thơm', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.94, wasteRate: 3, pricePerKg: 45000, protein: 0.024, fat: 0.002, carbs: 0.2, calories: 0.9, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Bánh canh chả cá': [
    { name: 'Chả cá thác lác viên', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 40, cleanPerPortionGrams: 38, wasteRate: 5, pricePerKg: 190000, protein: 6.3, fat: 2.1, carbs: 1.2, calories: 170, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Sợi bánh canh tươi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 50, cleanPerPortionGrams: 50, pricePerKg: 26000, protein: 1.0, fat: 0.1, carbs: 17.5, calories: 75, supplierName: 'Lò Bún Phở Sạch Cầu Giấy', supplierAddress: 'Cầu Giấy, Hà Nội', supplierPhone: '024 3768 1122', delivererName: 'Nguyễn Văn Định' },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 52000, protein: 0, fat: 2, carbs: 0, calories: 18, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 1, cleanPerPortionGrams: 0.97, wasteRate: 3, pricePerKg: 30000, protein: 0.018, fat: 0.005, carbs: 0.073, calories: 0.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Cháo thịt bằm': [
    { name: 'Thịt heo nạc vai bằm', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 25, cleanPerPortionGrams: 21.25, wasteRate: 15, pricePerKg: 135000, protein: 5, fat: 1.75, carbs: 0, calories: 178, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Gạo tẻ thơm Điện Biên', type: 'kho', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 60, cleanPerPortionGrams: 60, pricePerKg: 24000, protein: 4.2, fat: 0.6, carbs: 47.4, calories: 212, producerName: PRODUCERS.RICE.name, producerAddress: PRODUCERS.RICE.address, supplierName: SUPPLIERS.RICE.name, supplierAddress: SUPPLIERS.RICE.address, supplierPhone: SUPPLIERS.RICE.phone, delivererName: SUPPLIERS.RICE.deliverer },
    { name: 'Cà rốt tươi băm nhỏ', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 12, wasteRate: 20, pricePerKg: 22000, protein: 0.135, fat: 0.03, carbs: 1.44, calories: 6.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 30000, protein: 0.036, fat: 0.01, carbs: 0.146, calories: 0.8, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Soup nui': [
    { name: 'Tôm nõn tươi băm', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 15, cleanPerPortionGrams: 7.5, wasteRate: 50, pricePerKg: 220000, protein: 2.85, fat: 0.6, carbs: 0, calories: 175, supplierName: SUPPLIERS.SEAFOOD.name, supplierAddress: SUPPLIERS.SEAFOOD.address, supplierPhone: SUPPLIERS.SEAFOOD.phone, delivererName: SUPPLIERS.SEAFOOD.deliverer },
    { name: 'Nui chữ Safoco', type: 'kho', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 30, cleanPerPortionGrams: 30, pricePerKg: 38000, protein: 3.6, fat: 0.45, carbs: 22.5, calories: 108, producerName: PRODUCERS.NOODLE.name, producerAddress: PRODUCERS.NOODLE.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Đậu Hà Lan & Cà rốt hạt lựu', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.8, wasteRate: 10, pricePerKg: 40000, protein: 0.07, fat: 0.006, carbs: 0.24, calories: 1.3, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Dầu ăn Simply', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 5, cleanPerPortionGrams: 5, pricePerKg: 52000, protein: 0, fat: 5, carbs: 0, calories: 45, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 30000, protein: 0.036, fat: 0.01, carbs: 0.146, calories: 0.8, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Bánh hỏi chả lụa': [
    { name: 'Chả lụa heo sạch', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 12, cleanPerPortionGrams: 12, pricePerKg: 160000, protein: 1.8, fat: 1.2, carbs: 0.24, calories: 180, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Bánh hỏi tươi Ba Vì', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 90, cleanPerPortionGrams: 90, pricePerKg: 28000, protein: 1.35, fat: 0.18, carbs: 22.5, calories: 97, supplierName: 'Lò Bún Phở Sạch Cầu Giấy', supplierAddress: 'Cầu Giấy, Hà Nội', supplierPhone: '024 3768 1122', delivererName: 'Nguyễn Văn Định' },
    { name: 'Mỡ hành (dầu ăn Simply)', type: 'kho', unit: 'lít', role: 'Gia vị', rawPerPortionGrams: 3, cleanPerPortionGrams: 3, pricePerKg: 52000, protein: 0, fat: 2.7, carbs: 0, calories: 24.3, producerName: PRODUCERS.OIL.name, producerAddress: PRODUCERS.OIL.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Hành lá phi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 3, cleanPerPortionGrams: 2.85, wasteRate: 5, pricePerKg: 30000, protein: 0.054, fat: 0.015, carbs: 0.219, calories: 1.2, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  // ================= 4. ĐỒ UỐNG, TRÁNG MIỆNG & BỮA XẾ CHIỀU =================
  'Sinh tố trái cây theo mùa': [
    { name: 'Trái cây tươi hỗn hợp (bơ, xoài, mãng cầu)', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 80, cleanPerPortionGrams: 64, wasteRate: 20, pricePerKg: 45000, protein: 0.64, fat: 0, carbs: 16.96, calories: 155, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Sữa tươi không đường TH True Milk', type: 'kho', unit: 'lít', role: 'NL phụ', rawPerPortionGrams: 50, cleanPerPortionGrams: 50, pricePerKg: 38000, protein: 1.6, fat: 1.75, carbs: 2.4, calories: 31.8, producerName: PRODUCERS.MILK_TH.name, producerAddress: PRODUCERS.MILK_TH.address, supplierName: SUPPLIERS.MILK.name, supplierAddress: SUPPLIERS.MILK.address, supplierPhone: SUPPLIERS.MILK.phone, delivererName: SUPPLIERS.MILK.deliverer },
    { name: 'Sữa đặc Ông Thọ', type: 'kho', unit: 'hộp', role: 'NL phụ', rawPerPortionGrams: 10, cleanPerPortionGrams: 10, pricePerKg: 70000, protein: 0.8, fat: 0.9, carbs: 5.5, calories: 33.3, producerName: 'Công ty CP Sữa Việt Nam (Vinamilk)', producerAddress: 'Quận 7, TP.HCM', supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Đường cát Biên Hòa', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 26000, protein: 0, fat: 0, carbs: 2, calories: 8, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Yaourt tự làm': [
    { name: 'Sữa tươi tiệt trùng TH True Milk', type: 'kho', unit: 'lít', role: 'NL chính', rawPerPortionGrams: 100, cleanPerPortionGrams: 100, pricePerKg: 38000, protein: 3.3, fat: 3.3, carbs: 4.5, calories: 82, producerName: PRODUCERS.MILK_TH.name, producerAddress: PRODUCERS.MILK_TH.address, supplierName: SUPPLIERS.MILK.name, supplierAddress: SUPPLIERS.MILK.address, supplierPhone: SUPPLIERS.MILK.phone, delivererName: SUPPLIERS.MILK.deliverer },
    { name: 'Sữa đặc Ông Thọ có đường', type: 'kho', unit: 'hộp', role: 'NL chính', rawPerPortionGrams: 20, cleanPerPortionGrams: 20, pricePerKg: 70000, protein: 1.62, fat: 1.76, carbs: 10.88, calories: 65.8, producerName: 'Vinamilk', producerAddress: 'TP.HCM', supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Sữa chua cái men sống Ba Vì', type: 'kho', unit: 'hộp', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 15, pricePerKg: 45000, protein: 0.525, fat: 0.45, carbs: 0.75, calories: 9.15, producerName: PRODUCERS.MILK_BV.name, producerAddress: PRODUCERS.MILK_BV.address, supplierName: SUPPLIERS.MILK.name, supplierAddress: SUPPLIERS.MILK.address, supplierPhone: SUPPLIERS.MILK.phone, delivererName: SUPPLIERS.MILK.deliverer },
  ],

  'Nước Sâm': [
    { name: 'Rễ tranh, mía lau, thục địa tươi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 50, cleanPerPortionGrams: 45, wasteRate: 10, pricePerKg: 50000, protein: 0.25, fat: 0.05, carbs: 7.5, calories: 96, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Lá dứa thơm tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 5, cleanPerPortionGrams: 4.8, wasteRate: 4, pricePerKg: 30000, protein: 0.025, fat: 0.005, carbs: 0.25, calories: 1.1, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Đường phèn Quảng Ngãi', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 15, cleanPerPortionGrams: 15, pricePerKg: 36000, protein: 0, fat: 0, carbs: 14.97, calories: 59.9, producerName: 'Công ty CP Đường Quảng Ngãi', producerAddress: 'TP. Quảng Ngãi', supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Nước Mía': [
    { name: 'Mía tươi ép nguyên chất', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 150, cleanPerPortionGrams: 150, pricePerKg: 20000, protein: 0, fat: 0, carbs: 19.5, calories: 120, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Quất (Tắc) tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 5, cleanPerPortionGrams: 4.5, wasteRate: 10, pricePerKg: 30000, protein: 0.04, fat: 0.02, carbs: 0.45, calories: 2.1, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],

  'Nước Cam': [
    { name: 'Cam sành Hàm Yên mọng nước', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 100, cleanPerPortionGrams: 55, wasteRate: 45, pricePerKg: 32000, protein: 0.9, fat: 0.1, carbs: 11.8, calories: 145, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Đường cát Biên Hòa', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 2, pricePerKg: 26000, protein: 0, fat: 0, carbs: 2, calories: 8, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Nước Dừa': [
    { name: 'Nước dừa xiêm tươi', type: 'tuoi_song', unit: 'lít', role: 'NL chính', rawPerPortionGrams: 150, cleanPerPortionGrams: 150, pricePerKg: 28000, protein: 1.05, fat: 0.3, carbs: 5.55, calories: 29.1, supplierName: 'Đại lý Dừa Xiêm Bến Tre', supplierAddress: 'Chợ Long Biên, Hà Nội', supplierPhone: '0988 223 344', delivererName: 'Trần Văn Hải' },
    { name: 'Cơm dừa non nạo', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 10, cleanPerPortionGrams: 10, pricePerKg: 40000, protein: 0.33, fat: 1.52, carbs: 0.5, calories: 17, supplierName: 'Đại lý Dừa Xiêm Bến Tre', supplierAddress: 'Chợ Long Biên, Hà Nội', supplierPhone: '0988 223 344', delivererName: 'Trần Văn Hải' },
  ],

  'Thạch rau câu': [
    { name: 'Cơm dừa non nạo sợi', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 10, cleanPerPortionGrams: 10, pricePerKg: 40000, protein: 0.33, fat: 1.52, carbs: 0.5, calories: 17, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Đường phèn Quảng Ngãi', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 10, cleanPerPortionGrams: 10, pricePerKg: 36000, protein: 0, fat: 0, carbs: 9.98, calories: 40, producerName: 'Công ty CP Đường Quảng Ngãi', producerAddress: 'TP. Quảng Ngãi', supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Bột rau câu dẻo Long Hải', type: 'kho', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 3, cleanPerPortionGrams: 3, pricePerKg: 120000, protein: 0, fat: 0.015, carbs: 0.24, calories: 1.0, producerName: PRODUCERS.JELLY.name, producerAddress: PRODUCERS.JELLY.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Bánh chuối': [
    { name: 'Chuối tiêu chín cây', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 34, cleanPerPortionGrams: 23.8, wasteRate: 30, pricePerKg: 20000, protein: 0.374, fat: 0.102, carbs: 7.752, calories: 33.4, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Nước cốt dừa lon Chaokoh/Bến Tre', type: 'kho', unit: 'lít', role: 'NL phụ', rawPerPortionGrams: 10, cleanPerPortionGrams: 10, pricePerKg: 65000, protein: 0.2, fat: 2.4, carbs: 0.6, calories: 24.8, producerName: 'Công ty TNHH Chế biến Dừa Bến Tre', producerAddress: 'Châu Thành, Bến Tre', supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
    { name: 'Đường phèn tinh khiết', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 10, cleanPerPortionGrams: 10, pricePerKg: 36000, protein: 0, fat: 0, carbs: 9.98, calories: 40, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Cơm trắng': [
    { name: 'Gạo tám thơm Điện Biên', type: 'kho', unit: 'kg', role: 'Lương thực', rawPerPortionGrams: 45, cleanPerPortionGrams: 45, pricePerKg: 24000, protein: 3.15, fat: 0.45, carbs: 35.55, calories: 159, producerName: PRODUCERS.RICE.name, producerAddress: PRODUCERS.RICE.address, supplierName: SUPPLIERS.RICE.name, supplierAddress: SUPPLIERS.RICE.address, supplierPhone: SUPPLIERS.RICE.phone, delivererName: SUPPLIERS.RICE.deliverer },
  ],

  'Cơm trắng gạo tám thơm': [
    { name: 'Gạo tám thơm Điện Biên', type: 'kho', unit: 'kg', role: 'Lương thực', rawPerPortionGrams: 80, cleanPerPortionGrams: 80, pricePerKg: 24000, protein: 6.08, fat: 0.64, carbs: 61.2, calories: 275.2, producerName: PRODUCERS.RICE.name, producerAddress: PRODUCERS.RICE.address, supplierName: SUPPLIERS.RICE.name, supplierAddress: SUPPLIERS.RICE.address, supplierPhone: SUPPLIERS.RICE.phone, delivererName: SUPPLIERS.RICE.deliverer },
  ],

  'Nước lọc': [
    { name: 'Nước tinh khiết LaVie / Aquafina bình 19L', type: 'kho', unit: 'lít', role: 'Lương thực', rawPerPortionGrams: 1200, cleanPerPortionGrams: 1200, pricePerKg: 3000, protein: 0, fat: 0, carbs: 0, calories: 0, producerName: 'Công ty TNHH La Vie (Nestlé Waters)', producerAddress: 'Tân An, Long An', supplierName: 'Đại lý Nước Khoáng Tinh Khiết Ánh Dương', supplierAddress: 'Số 12 Đội Cấn, Ba Đình, Hà Nội', supplierPhone: '024 3722 8899', delivererName: 'Phạm Đức Chung' },
  ],

  'Bánh flan caramen + Sữa hạt óc chó': [
    { name: 'Sữa tươi thanh trùng TH True Milk', type: 'kho', unit: 'lít', role: 'NL chính', rawPerPortionGrams: 120, cleanPerPortionGrams: 120, pricePerKg: 38000, protein: 3.6, fat: 3.8, carbs: 5.5, calories: 70.6, producerName: PRODUCERS.MILK_TH.name, producerAddress: PRODUCERS.MILK_TH.address, supplierName: SUPPLIERS.MILK.name, supplierAddress: SUPPLIERS.MILK.address, supplierPhone: SUPPLIERS.MILK.phone, delivererName: SUPPLIERS.MILK.deliverer },
    { name: 'Trứng gà ta Ba Huân', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 20, cleanPerPortionGrams: 18, wasteRate: 10, pricePerKg: 55000, protein: 2.6, fat: 2.0, carbs: 0.2, calories: 29.0, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Đường kính trắng Biên Hòa', type: 'kho', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 5, cleanPerPortionGrams: 5, pricePerKg: 26000, protein: 0, fat: 0, carbs: 5.0, calories: 20.0, producerName: PRODUCERS.SUGAR.name, producerAddress: PRODUCERS.SUGAR.address, supplierName: SUPPLIERS.DRY_SPICE.name, supplierAddress: SUPPLIERS.DRY_SPICE.address, supplierPhone: SUPPLIERS.DRY_SPICE.phone, delivererName: SUPPLIERS.DRY_SPICE.deliverer },
  ],

  'Sữa chua dâu tươi': [
    { name: 'Sữa chua men sống Ba Vì', type: 'kho', unit: 'hộp', role: 'NL chính', rawPerPortionGrams: 100, cleanPerPortionGrams: 100, pricePerKg: 45000, protein: 3.3, fat: 3.0, carbs: 12.0, calories: 88.0, producerName: PRODUCERS.MILK_BV.name, producerAddress: PRODUCERS.MILK_BV.address, supplierName: SUPPLIERS.MILK.name, supplierAddress: SUPPLIERS.MILK.address, supplierPhone: SUPPLIERS.MILK.phone, delivererName: SUPPLIERS.MILK.deliverer },
  ],

  'Cháo gà hạt sen': [
    { name: 'Thịt ức gà ta', type: 'tuoi_song', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 25, cleanPerPortionGrams: 20, wasteRate: 20, pricePerKg: 95000, protein: 5.75, fat: 0.25, carbs: 0, calories: 85, supplierName: SUPPLIERS.MEAT.name, supplierAddress: SUPPLIERS.MEAT.address, supplierPhone: SUPPLIERS.MEAT.phone, delivererName: SUPPLIERS.MEAT.deliverer },
    { name: 'Hạt sen Huế tươi', type: 'tuoi_song', unit: 'kg', role: 'NL phụ', rawPerPortionGrams: 15, cleanPerPortionGrams: 13.5, wasteRate: 10, pricePerKg: 85000, protein: 0.6, fat: 0.05, carbs: 3.2, calories: 15.6, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
    { name: 'Gạo tẻ thơm Điện Biên', type: 'kho', unit: 'kg', role: 'NL chính', rawPerPortionGrams: 50, cleanPerPortionGrams: 50, pricePerKg: 24000, protein: 3.5, fat: 0.5, carbs: 39.5, calories: 176, producerName: PRODUCERS.RICE.name, producerAddress: PRODUCERS.RICE.address, supplierName: SUPPLIERS.RICE.name, supplierAddress: SUPPLIERS.RICE.address, supplierPhone: SUPPLIERS.RICE.phone, delivererName: SUPPLIERS.RICE.deliverer },
    { name: 'Hành lá tươi', type: 'tuoi_song', unit: 'kg', role: 'Gia vị', rawPerPortionGrams: 2, cleanPerPortionGrams: 1.9, wasteRate: 5, pricePerKg: 30000, protein: 0.036, fat: 0.01, carbs: 0.146, calories: 0.8, supplierName: SUPPLIERS.VEGGIE.name, supplierAddress: SUPPLIERS.VEGGIE.address, supplierPhone: SUPPLIERS.VEGGIE.phone, delivererName: SUPPLIERS.VEGGIE.deliverer },
  ],
};

// Hàm chuẩn truy xuất thành phần món ăn bám sát dữ liệu gốc
export function getStandardizedIngredientsForDish(dishName: string): DishIngredient[] {
  if (!dishName) return STANDARDIZED_DISH_DATABASE['Thịt lợn rim nấm đông cô'];
  const trimmed = dishName.trim();

  // 1. Khớp chính xác
  if (STANDARDIZED_DISH_DATABASE[trimmed]) {
    return STANDARDIZED_DISH_DATABASE[trimmed];
  }

  // 2. Khớp tương đối không phân biệt hoa thường
  for (const key of Object.keys(STANDARDIZED_DISH_DATABASE)) {
    if (
      trimmed.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(trimmed.toLowerCase())
    ) {
      return STANDARDIZED_DISH_DATABASE[key];
    }
  }

  // 3. Fallback thông minh theo từ khóa dinh dưỡng
  const lower = trimmed.toLowerCase();
  if (lower.includes('basa') || (lower.includes('cá') && lower.includes('kho'))) {
    return STANDARDIZED_DISH_DATABASE['Cá Basa kho thơm'];
  }
  if (lower.includes('bò') || lower.includes('xào')) {
    return STANDARDIZED_DISH_DATABASE['Thịt bò xào cà chua'];
  }
  if (lower.includes('cá thu') || (lower.includes('cá') && lower.includes('sốt'))) {
    return STANDARDIZED_DISH_DATABASE['Cá thu sốt cà'];
  }
  if (lower.includes('chả cá')) {
    return STANDARDIZED_DISH_DATABASE['Chả cá chiên'];
  }
  if (lower.includes('tôm') && lower.includes('cam')) {
    return STANDARDIZED_DISH_DATABASE['Tôm sốt cam'];
  }
  if (lower.includes('tôm') && (lower.includes('ram') || lower.includes('rang') || lower.includes('rim'))) {
    return STANDARDIZED_DISH_DATABASE['Tôm ram'];
  }
  if (lower.includes('trứng cút') || (lower.includes('thịt') && lower.includes('kho'))) {
    return STANDARDIZED_DISH_DATABASE['Thịt kho trứng cút'];
  }
  if (lower.includes('trứng chiên') || lower.includes('trứng cuộn') || lower.includes('trứng rán')) {
    return STANDARDIZED_DISH_DATABASE['Trứng chiên rau củ'];
  }
  if (lower.includes('thịt') && (lower.includes('rim') || lower.includes('nấm'))) {
    return STANDARDIZED_DISH_DATABASE['Thịt lợn rim nấm đông cô'];
  }
  if (lower.includes('canh chua') || lower.includes('cá bớp') || lower.includes('bớp')) {
    return STANDARDIZED_DISH_DATABASE['Canh chua cá bớp'];
  }
  if (lower.includes('canh cua') || lower.includes('mồng tơi') || lower.includes('mướp')) {
    return STANDARDIZED_DISH_DATABASE['Canh cua mồng tơi mướp hương'];
  }
  if (lower.includes('canh bí đao') || (lower.includes('bí đao') && lower.includes('thịt'))) {
    return STANDARDIZED_DISH_DATABASE['Canh bí đao thịt bằm'];
  }
  if (lower.includes('canh bí đỏ') || (lower.includes('bí đỏ') && lower.includes('tôm'))) {
    return STANDARDIZED_DISH_DATABASE['Canh bí đỏ nấu tôm nõn'];
  }
  if (lower.includes('bí đỏ')) {
    return STANDARDIZED_DISH_DATABASE['Canh bí đỏ thịt bằm'];
  }
  if (lower.includes('canh cải') || lower.includes('cải xanh') || lower.includes('cải ngót')) {
    return STANDARDIZED_DISH_DATABASE['Canh cải thịt bằm'];
  }
  if (lower.includes('dưa hồng')) {
    return STANDARDIZED_DISH_DATABASE['Canh dưa hồng thịt bằm'];
  }
  if (lower.includes('súp gà') || lower.includes('soup gà')) {
    return STANDARDIZED_DISH_DATABASE['Súp gà'];
  }
  if (lower.includes('phở') || lower.includes('bún')) {
    return STANDARDIZED_DISH_DATABASE['Phở bò'];
  }
  if (lower.includes('bánh canh')) {
    return STANDARDIZED_DISH_DATABASE['Bánh canh chả cá'];
  }
  if (lower.includes('cháo gà') || lower.includes('hạt sen')) {
    return STANDARDIZED_DISH_DATABASE['Cháo gà hạt sen'];
  }
  if (lower.includes('cháo') || lower.includes('bột')) {
    return STANDARDIZED_DISH_DATABASE['Cháo thịt bằm'];
  }
  if (lower.includes('nui') || lower.includes('soup nui')) {
    return STANDARDIZED_DISH_DATABASE['Soup nui'];
  }
  if (lower.includes('bánh hỏi') || lower.includes('chả lụa')) {
    return STANDARDIZED_DISH_DATABASE['Bánh hỏi chả lụa'];
  }
  if (lower.includes('sinh tố') || lower.includes('nước ép')) {
    return STANDARDIZED_DISH_DATABASE['Sinh tố trái cây theo mùa'];
  }
  if (lower.includes('yaourt') || lower.includes('sữa chua')) {
    return STANDARDIZED_DISH_DATABASE['Yaourt tự làm'];
  }
  if (lower.includes('sâm') || lower.includes('nước sâm')) {
    return STANDARDIZED_DISH_DATABASE['Nước Sâm'];
  }
  if (lower.includes('mía') || lower.includes('nước mía')) {
    return STANDARDIZED_DISH_DATABASE['Nước Mía'];
  }
  if (lower.includes('cam') || lower.includes('nước cam')) {
    return STANDARDIZED_DISH_DATABASE['Nước Cam'];
  }
  if (lower.includes('dừa') || lower.includes('nước dừa')) {
    return STANDARDIZED_DISH_DATABASE['Nước Dừa'];
  }
  if (lower.includes('thạch') || lower.includes('rau câu')) {
    return STANDARDIZED_DISH_DATABASE['Thạch rau câu'];
  }
  if (lower.includes('bánh chuối') || lower.includes('chuối')) {
    return STANDARDIZED_DISH_DATABASE['Bánh chuối'];
  }
  if (lower.includes('nước lọc') || lower.includes('nước sôi')) {
    return STANDARDIZED_DISH_DATABASE['Nước lọc'];
  }
  if (lower.includes('cơm') || lower.includes('gạo')) {
    return STANDARDIZED_DISH_DATABASE['Cơm trắng gạo tám thơm'];
  }
  if (lower.includes('sữa') || lower.includes('bánh') || lower.includes('flan')) {
    return STANDARDIZED_DISH_DATABASE['Bánh flan caramen + Sữa hạt óc chó'];
  }

  // Mặc định trả về món mặn dinh dưỡng hoàn chỉnh có cả thực phẩm tươi sống + đồ khô/gia vị
  return STANDARDIZED_DISH_DATABASE['Thịt lợn rim nấm đông cô'];
}
