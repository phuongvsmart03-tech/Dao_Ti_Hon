export type ModuleId =
  | 'lightning'
  | 'finance'
  | 'menu'
  | 'students'
  | 'health'
  | 'staff'
  | 'lessonPlans'
  | 'settings'
  | 'history'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'samples';

// Cấu trúc Lương Giáo Viên / Cán bộ nhân viên mầm non
export interface TeacherSalaryRecord {
  id: string;
  staffId?: string;
  staffName: string;
  role: string; // Giáo viên, Bảo mẫu, Bếp trưởng, Y tế, Kế toán...
  assignedClass?: string;
  month: string; // YYYY-MM
  baseSalary: number; // Lương cơ bản
  allowanceResponsibility: number; // Phụ cấp trách nhiệm / Đứng lớp
  allowanceLunch: number; // Phụ cấp ăn trưa
  allowanceOther: number; // Phụ cấp khác (xăng xe, chuyên cần)
  bonus: number; // Thưởng thi đua, hiệu quả
  insuranceDeduction: number; // Khấu trừ BHXH, BHYT, BHTN
  advancePayment: number; // Tạm ứng
  otherDeductions: number; // Giảm trừ khác
  workDaysStandard: number; // Ngày công chuẩn (e.g. 24 hoặc 26)
  workDaysActual: number; // Ngày công thực tế
  netSalary: number; // Thực lĩnh
  paymentStatus: 'Đã thanh toán' | 'Chờ thanh toán' | 'Đã tạm ứng';
  paymentMethod: 'Chuyển khoản ngân hàng' | 'Tiền mặt';
  bankAccount?: string;
  bankName?: string;
  notes?: string;
}

// Cấu trúc Giao dịch Thu / Chi
export type TransactionType = 'thu' | 'chi';

export interface FinanceTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string;
  amount: number;
  payerOrReceiver: string; // Người nộp / Người nhận tiền
  method: 'Tiền mặt' | 'Chuyển khoản';
  receiptNumber?: string; // Số phiếu thu / chi
  notes?: string;
  isAutomaticSync?: boolean; // Tự động đồng bộ từ chi phí chợ hoặc quỹ lương
}

export interface SchoolInfo {
  id?: string;
  name: string;
  department: string; // Phòng GD&ĐT
  address: string;
  phone: string;
  academicYear: string;
  principalName: string;
  medicalStaffName: string;
  headChefName: string;
  updated_at?: number;
  logoUrl?: string; // Custom logo image URL, base64 data, or preset identifier
  // Cấu hình danh tính nhân sự kiểm thực & giao nhận (Phòng GD&ĐT)
  inspectorName?: string; // Tên người kiểm tra (VD: BS. Trần Thị Thu Hà)
  receiverName?: string; // Tên người nhận hàng / người được kiểm tra (VD: Lê Văn Tài)
  sampleKeeperName?: string; // Tên người lưu mẫu (VD: BS. Trần Thị Thu Hà)
  sampleDisposerName?: string; // Tên người hủy mẫu (VD: Lê Văn Tài)
  medicalStaffSignature?: string; // Chữ ký Cán bộ Y tế
  headChefSignature?: string; // Chữ ký Bếp trưởng
  defaultPrintOrientation?: 'portrait' | 'landscape'; // Khổ in mặc định (Mặc định A4 ngang Landscape)

  // Cấu hình Ký tên Biểu mẫu & Báo cáo Hành chính (Người lập biểu, Tổ trưởng,...)
  creatorName?: string; // Người lập biểu / Văn thư / Kế toán (VD: Nguyễn Thu Hằng)
  creatorSignature?: string; // Chữ ký số / hình ảnh chữ ký Người lập biểu
  teamLeaderNutritionName?: string; // Tổ trưởng chuyên môn nuôi / Tổ nuôi dưỡng (VD: Nguyễn Thị Thu Hương)
  teamLeaderNutritionSignature?: string; // Chữ ký số Tổ trưởng Nuôi
  teamLeaderEducationName?: string; // Tổ trưởng chuyên môn dạy / Giáo dục (VD: Trần Thị Ngọc Mai)
  teamLeaderEducationSignature?: string; // Chữ ký số Tổ trưởng Dạy
  vicePrincipalName?: string; // Phó Hiệu trưởng phụ trách (VD: Hoàng Thị Thu Trang)
  vicePrincipalSignature?: string; // Chữ ký số Phó Hiệu trưởng
  accountantName?: string; // Kế toán / Phụ trách tài chính (VD: Đỗ Thị Thanh)
  accountantSignature?: string; // Chữ ký số Kế toán
  inspectorSignature?: string; // Chữ ký số Người kiểm tra ATTP
  receiverSignature?: string; // Chữ ký số Người nhận hàng / Bếp trưởng
  sampleKeeperSignature?: string; // Chữ ký số Người lưu mẫu
  sampleDisposerSignature?: string; // Chữ ký số Người hủy mẫu
  principalSignature?: string; // Chữ ký số Hiệu trưởng / BGH

  // Cấu hình Nhà cung cấp thực phẩm địa phương (cho in ấn & thanh tra)
  // I. Tươi sống: Thịt, cá, gia cầm
  meatSupplierName?: string;
  meatSupplierAddress?: string;
  meatDelivererName?: string;
  // I. Tươi sống: Rau, củ, quả, nấm
  vegSupplierName?: string;
  vegSupplierAddress?: string;
  vegDelivererName?: string;
  // I. Tươi sống: Thủy hải sản, trứng
  seafoodSupplierName?: string;
  seafoodSupplierAddress?: string;
  seafoodDelivererName?: string;
  // II. Thực phẩm khô, gia vị, bao gói sẵn
  dryProducerName?: string;
  dryProducerAddress?: string;
  drySupplierName?: string;
  drySupplierAddress?: string;
  dryDelivererName?: string;
}

// 1. Sổ lưu bước 1: Kiểm tra / giao nhận thực phẩm & nguyên liệu
export interface Step1Record {
  id: string;
  date: string;
  time: string;
  foodName: string;
  category: 'Thịt cá tươi sống' | 'Rau củ quả' | 'Gia vị khô' | 'Sữa & chế phẩm' | 'Gạo & ngũ cốc';
  quantity: string;
  sensoryQuality: 'Đạt (tươi mới, không mùi lạ)' | 'Không đạt (hỏng, ôi thiu)';
  supplier: string;
  expiryOrCertificate: string;
  deliverer: string;
  inspector: string;
  result: 'Đạt nhập kho' | 'Từ chối nhận';
  notes?: string;
}

// 2. Sổ lưu bước 2: Quy trình chế biến, sơ chế thực phẩm
export interface Step2Record {
  id: string;
  date: string;
  meal: 'Bữa sáng' | 'Bữa trưa' | 'Bữa phụ xế';
  dishName: string;
  prepTime: string;
  cookTime: string;
  cookingTemp: string; // e.g., 100°C
  hygieneStatus: 'Đạt vệ sinh ATTP' | 'Cần khử trùng lại';
  chef: string;
  supervisor: string;
  result: 'Đạt chuẩn vào phục vụ' | 'Yêu cầu xử lý lại';
  notes?: string;
}

// 3. Sổ lưu bước 3: Kiểm tra trước khi ăn & lưu mẫu
export interface Step3Record {
  id: string;
  date: string;
  time: string;
  meal: 'Bữa sáng' | 'Bữa trưa' | 'Bữa phụ xế';
  dishName: string;
  sensoryEvaluation: 'Màu sắc tươi, mùi vị thơm ngon tự nhiên, chín kỹ' | 'Bất thường / Không đạt';
  servingTemp: string; // e.g. 65°C - 75°C
  sampleWeight: string; // e.g. 150g (≥100g)
  storageLocation: string; // Tủ lưu mẫu chuyên dụng ngăn 2 (0-5°C)
  taster: string; // Người thử nếm (Hiệu phó/BGH)
  keeper: string; // Người niêm phong lưu mẫu
  result: 'Đủ điều kiện cho trẻ ăn' | 'Tạm dừng phục vụ';
  notes?: string;
}

// 4. Thực đơn: Quản lý & duyệt thực đơn dinh dưỡng
export type DishCategory =
  | 'Món mặn chính'
  | 'Món canh'
  | 'Bữa sáng & Bữa xế'
  | 'Tráng miệng'
  | 'Đồ uống & Nước ép'
  | 'Món ăn kèm & Cơm';

export type FoodIngredientCategory =
  | 'Thịt cá tươi sống'
  | 'Thủy hải sản'
  | 'Rau củ quả nấm'
  | 'Gạo & ngũ cốc'
  | 'Gia vị & dầu mỡ'
  | 'Sữa & chế phẩm'
  | 'Trái cây tráng miệng'
  | 'Khác';

export interface FoodIngredient {
  id: string;
  name: string; // Tên nguyên liệu (ví dụ: Thịt lợn nạc mông, Bí đỏ, Tôm tươi)
  category: FoodIngredientCategory;
  type: 'tuoi_song' | 'kho'; // Phân loại tươi sống hay hàng khô
  unit: string; // kg, gam, lít, quả, hộp
  rawGramsPerPortion: number; // Định mức thô cho 1 suất trẻ (gram)
  cleanGramsPerPortion: number; // Định mức tinh sau sơ chế (gram)
  wasteRatePercent: number; // % Tỷ lệ hao hụt / thải bỏ (ví dụ: 15%)
  pricePerKg: number; // Đơn giá VNĐ / kg (hoặc lít)
  caloriesPer100g: number; // Năng lượng Kcal / 100g
  proteinPer100g: number; // Đạm (g) / 100g
  lipidPer100g: number; // Béo (g) / 100g
  glucidPer100g: number; // Bột đường (g) / 100g
  calciumMg?: number; // Canxi (mg) / 100g
  ironMg?: number; // Sắt (mg) / 100g
  supplierName?: string; // Nhà cung cấp
  delivererName?: string; // Người giao hàng
  notes?: string; // Ghi chú đặc thù
}

export interface DishRecipeBreakdown {
  id: string;
  dishName: string;
  mealSlot: 'breakfast' | 'snackMorning' | 'lunchMain' | 'lunchSoup' | 'lunchStaple' | 'lunchDessert' | 'afternoonSnack';
  category?: DishCategory;
  ageGroup?: string;
  ingredients: FoodIngredient[];
  totalCalories: number; // Kcal / 1 suất trẻ
  totalProteinGrams: number; // g Đạm / suất
  totalLipidGrams: number; // g Béo / suất
  totalGlucidGrams: number; // g Bột đường / suất
  estimatedCostPerPortion: number; // VNĐ / suất
  cookingInstructions?: string; // Hướng dẫn sơ chế & chế biến mầm non
}

export interface DishItem {
  id: string;
  name: string;
  category: DishCategory;
  suitableAge?: string;
  nutritionTags: string[];
  defaultMealSlot: 'lunchMain' | 'lunchSoup' | 'breakfast' | 'afternoonSnack' | 'lunchDessert' | 'snackMorning' | 'lunchStaple';
  caloriesEstimate?: number;
  description?: string;
  isFavorite?: boolean;
  ingredients?: FoodIngredient[];
}

export interface MenuItem {
  id: string;
  weekNumber: number;
  month: string;
  ageGroup: 'Nhà trẻ (18-36 tháng)' | 'Mẫu giáo Bé (3-4 tuổi)' | 'Mẫu giáo Nhỡ (4-5 tuổi)' | 'Mẫu giáo Lớn (5-6 tuổi)';
  dayOfWeek: 'Thứ Hai' | 'Thứ Ba' | 'Thứ Tư' | 'Thứ Năm' | 'Thứ Sáu';
  breakfast: string;
  snackMorning: string;
  lunchMain: string;
  lunchSoup: string;
  lunchStaple: string;
  lunchDessert: string;
  afternoonSnack: string;
  caloriesKcal: number;
  proteinRatio: string;
  status: 'Đã phê duyệt' | 'Chờ phê duyệt' | 'Dự thảo';
  approvedBy: string;
  notes?: string;
  // Bóc tách định lượng chi tiết các món ăn trong ngày (Giai đoạn 1)
  recipeBreakdowns?: DishRecipeBreakdown[];
  estimatedDailyCost?: number; // Tổng chi phí tiền ăn 1 ngày (VNĐ/trẻ)
  macroDistribution?: {
    proteinPercent: number; // % Năng lượng từ Đạm (13 - 20%)
    lipidPercent: number; // % Năng lượng từ Béo (25 - 30%)
    glucidPercent: number; // % Năng lượng từ Bột đường (50 - 60%)
  };
}

// 5. Lưu Hủy Mẫu: Theo dõi lưu và hủy mẫu 24h
export interface SampleDisposalRecord {
  id: string;
  dateSampled: string;
  timeSampled: string;
  meal: 'Bữa sáng' | 'Bữa trưa' | 'Bữa phụ xế';
  dishName: string;
  sampleWeight: string; // e.g. 120g
  containerType: 'Hộp Inox có nắp vô trùng' | 'Túi tiệt trùng kín PE';
  storageTemp: string; // 2°C - 4°C
  disposalDate: string; // +24h
  disposalTime: string;
  conditionAtDisposal: 'Bình thường, không biến chất' | 'Có hiện tượng lạ (ghi rõ)';
  samplerName: string;
  witnessName: string;
  status: 'Đang lưu mẫu (<24h)' | 'Đã hủy mẫu theo quy định' | 'Quá hạn chưa hủy';
  notes?: string;
}

// 6. Học sinh: Hồ sơ, danh sách lớp, phụ huynh, điểm danh
export interface StudentRecord {
  id: string;
  studentCode: string; // e.g., MN-2024-001
  fullName: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  className: 'Nhà Trẻ Hoa Cúc' | 'Mầm 1' | 'Mầm 2' | 'Chồi 1' | 'Chồi 2' | 'Lá 1' | 'Lá 2';
  parentName: string;
  parentPhone: string;
  address: string;
  attendanceStatus: 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép';
  allergiesOrDiet: string;
  enrollmentDate: string;
  notes?: string;
}

// 7. Sức Khỏe: Chiều cao, cân nặng, tiêm chủng, khám định kỳ
export interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  checkDate: string;
  heightCm: number;
  weightKg: number;
  nutritionStatus: 'Bình thường (Kênh A)' | 'Suy dinh dưỡng thể nhẹ cân' | 'Suy dinh dưỡng thấp còi' | 'Nguy cơ béo phì / Béo phì';
  vaccinationStatus: 'Đầy đủ theo độ tuổi' | 'Thiếu mũi (cần nhắc phụ huynh)';
  generalHealth: 'Tốt' | 'Cần theo dõi' | 'Có bệnh lý về tai mũi họng/răng miệng';
  doctorOrExaminer: string;
  notes?: string;
}

// 8. Nhân sự: Danh sách giáo viên, nhân viên, bằng cấp, phân công
export interface StaffRecord {
  id: string;
  staffCode: string;
  fullName: string;
  gender?: 'Nam' | 'Nữ';
  role: string;
  qualification: string;
  assignedClassOrDept?: string;
  assignedDuty?: string;
  phone: string;
  email?: string;
  hygieneCertDate?: string; // Giấy xác nhận kiến thức VSATTP
  foodSafetyCertDate?: string;
  healthCheckDate?: string; // Giấy khám sức khỏe định kỳ
  healthCheckExpiry?: string;
  contractStatus?: 'Hợp đồng dài hạn' | 'Thử việc / Thời vụ';
  startDate?: string;
  status?: 'Đang công tác' | 'Nghỉ phép';
  notes?: string;
}

// 9. Giáo Án: Kho lưu trữ, phê duyệt và theo dõi kế hoạch giảng dạy
export interface LessonPlanRecord {
  id: string;
  title?: string;
  theme: string; // e.g. Chủ đề "Trường Mầm Non", "Thế giới động vật"
  targetClass?: string;
  ageGroup?: 'Nhà trẻ (18-36 tháng)' | 'Mẫu giáo Bé (3-4 tuổi)' | 'Mẫu giáo Nhỡ (4-5 tuổi)' | 'Mẫu giáo Lớn (5-6 tuổi)';
  subject?: string;
  topic?: string;
  teacherName: string;
  weekNumber: number;
  month?: string;
  dateRange?: string;
  developmentField?: string;
  learningObjectives?: string;
  activitiesPlan?: string;
  preparation?: string;
  approvalStatus: 'Đã phê duyệt' | 'Chờ phê duyệt' | 'Yêu cầu bổ sung/sửa đổi' | 'Yêu cầu chỉnh sửa';
  approverName: string;
  approvalDate?: string;
  fileAttachmentName?: string;
  notes?: string;
}

export type LessonPlan = LessonPlanRecord;

// 10. Lịch sử thao tác & Nhật ký hoạt động (Audit Log / Operation History)
export interface AuditLogRecord {
  id: string;
  timestamp: string; // ISO string
  displayTime: string; // e.g. 14:32:10 18/09/2026
  module: ModuleId | 'settings' | 'general' | 'all';
  moduleName: string; // Tên tiếng Việt: Thực đơn, Kiểm thực Bước 1, v.v.
  action: 'create' | 'update' | 'delete' | 'restore' | 'sync' | 'reset';
  actionLabel: string; // "Thêm mới", "Cập nhật", "Xóa", "Khôi phục", "Đồng bộ"
  description: string; // "Xóa món Canh cua mồng tơi trong thực đơn Tuần 36"
  targetId?: string;
  previousData?: any; // Dữ liệu cũ để hoàn tác
  newData?: any; // Dữ liệu mới
  canUndo?: boolean;
}
