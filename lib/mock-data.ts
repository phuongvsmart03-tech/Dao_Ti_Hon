import {
  SchoolInfo,
  Step1Record,
  Step2Record,
  Step3Record,
  MenuItem,
  SampleDisposalRecord,
  StudentRecord,
  HealthRecord,
  StaffRecord,
  LessonPlanRecord,
  TeacherSalaryRecord,
  FinanceTransaction,
} from '@/types/preschool';

export const initialSchoolInfo: SchoolInfo = {
  name: 'MẦM NON TƯ THỤC ĐẢO TÍ HON',
  department: 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO XÃ LIÊN HƯƠNG',
  address: 'Xã Liên Hương, Huyện Tuy Phong, Tỉnh Bình Thuận',
  phone: '0913 456 789',
  academicYear: 'Năm học 2024 - 2025',
  principalName: 'VÕ THỊ HỒNG SIM',
  medicalStaffName: 'HUỲNH THỊ NGỌC NHI',
  headChefName: 'HUỲNH THỊ HOA',
  inspectorName: 'THANH XUÂN',
  receiverName: 'HUỲNH THỊ HOA',
  sampleKeeperName: 'HUỲNH THỊ HOA',
  sampleDisposerName: 'HUỲNH THỊ HOA',
  sampleStorageTemp: '5°C',
  learnSaturday: false,
  learnSunday: false,
  defaultPrintOrientation: 'landscape',
  // Nhân sự Ký tên Biểu mẫu & Báo cáo Hành chính
  creatorName: 'THANH XUÂN',
  teamLeaderNutritionName: 'HUỲNH THỊ HOA',
  teamLeaderEducationName: 'THANH XUÂN',
  vicePrincipalName: 'VÕ THỊ HỒNG SIM',
  accountantName: 'THANH XUÂN',
  // Nhà cung cấp thực phẩm tươi sống
  meatSupplierName: 'Đại lý Thực phẩm Sạch Liên Hương',
  meatSupplierAddress: 'Chợ Liên Hương, Xã Liên Hương - ĐT: 0918.234.567',
  meatDelivererName: 'Trần Văn Hưng',
  vegSupplierName: 'Vựa Rau củ quả An Toàn Liên Hương',
  vegSupplierAddress: 'Xã Liên Hương - ĐT: 0988.112.233',
  vegDelivererName: 'Nguyễn Văn Tâm',
  seafoodSupplierName: 'Vựa Thủy Hải Sản Tươi Sống Liên Hương',
  seafoodSupplierAddress: 'Khu phố 1, Xã Liên Hương - ĐT: 0912.889.900',
  seafoodDelivererName: 'Lê Văn Hoàng',
  // Nhà cung cấp thực phẩm khô
  dryProducerName: 'Nhà máy Phân phối Thực phẩm Bình Thuận',
  dryProducerAddress: 'Tuy Phong, Bình Thuận',
  drySupplierName: 'Cửa hàng Bách Hóa Tổng Hợp Liên Hương',
  drySupplierAddress: 'Trung tâm Xã Liên Hương - ĐT: 0252.385.1234',
  dryDelivererName: 'Đặng Văn Long',
};

// Dữ liệu trống sạch sẽ để người dùng tự nhập dữ liệu thực tế
export const initialStep1Records: Step1Record[] = [];
export const initialStep2Records: Step2Record[] = [];
export const initialStep3Records: Step3Record[] = [];
export const initialMenuItems: MenuItem[] = [];
export const initialSampleDisposalRecords: SampleDisposalRecord[] = [];
export const initialStudents: StudentRecord[] = [];
export const initialHealthRecords: HealthRecord[] = [];
export const initialStaffRecords: StaffRecord[] = [];
export const initialLessonPlans: LessonPlanRecord[] = [];
export const initialSalaries: TeacherSalaryRecord[] = [];
export const initialTransactions: FinanceTransaction[] = [];
