export interface DishIngredient {
  name: string; // Tên nguyên liệu, ví dụ: "Thịt nạc vai heo", "Bí đỏ", "Tôm nõn"
  type: 'tuoi_song' | 'kho'; // Phân loại tươi sống (Thịt, cá, rau) hay đồ khô (Gia vị, dầu ăn, gạo)
  unit: string; // kg, g, lít, quả
  rawPerPortionGrams: number; // Định mức thô cho 1 suất (gram)
  cleanPerPortionGrams: number; // Định mức tinh/làm sạch cho 1 suất (gram)
  pricePerKg: number; // Đơn giá VNĐ / kg (hoặc lít)
  role?: 'NL chính' | 'NL phụ' | 'Gia vị' | 'Lương thực';
  wasteRate?: number; // Tỷ lệ thải bỏ (%)
  protein?: number;
  fat?: number;
  carbs?: number;
  calories?: number;
  producerName?: string; // Tên cơ sở sản xuất (VD: Công ty Dầu thực vật Cái Lân, Cty Masan...)
  producerAddress?: string; // Địa chỉ cơ sở sản xuất
  supplierName: string; // Tên cơ sở cung cấp (VD: HTX Rau Sạch Ba Vì, Cty Thực Phẩm An Toàn)
  supplierAddress?: string;
  supplierPhone?: string;
  delivererName?: string;
}

export interface InspectionPrintRecord {
  date: string;
  nurseryCount: number; // Suất Nhà Trẻ
  kindergartenCount: number; // Suất Mẫu Giáo
  nurseryPrice: number; // Tiền ăn NT / ngày
  kindergartenPrice: number; // Tiền ăn MG / ngày
  totalMoneyPerDay: number;
  inspector1?: string;
  inspector2?: string;
  inspector3?: string;
  medicalStaff?: string;
  dishes: {
    breakfast: string;
    snackMorning: string;
    lunchMain: string;
    lunchSoup: string;
    lunchStaple: string;
    lunchDessert: string;
    afternoonSnack: string;
  };
  ingredients: {
    id: string;
    name: string;
    type: 'tuoi_song' | 'kho';
    rawNT: number; // kg thô Nhà trẻ
    rawMG: number; // kg thô Mẫu giáo
    cleanNT: number; // kg sạch Nhà trẻ
    cleanMG: number; // kg sạch Mẫu giáo
    unitPrice: number; // Đơn giá
    costNT: number; // Thành tiền NT
    costMG: number; // Thành tiền MG
    producerName?: string;
    producerAddress?: string;
    supplier: string;
    supplierAddress: string;
    supplierPhone: string;
    deliverer: string;
    isPassedSensory: boolean;
  }[];
}
