-- =================================================================
-- HỆ THỐNG QUẢN TRỊ TRƯỜNG MẦM NON & AN TOÀN VỆ SINH THỰC PHẨM
-- TURSO LIBSQL / SQLITE DATABASE SCHEMA (12 BẢNG DỮ LIỆU CHUẨN HÓA)
-- Phiên bản: 2.0 - Hỗ trợ Kiểm thực 3 bước, Dinh dưỡng, Nhân sự & Tài chính
-- =================================================================

-- 0. Cấu hình Thông tin Trường Mầm Non
CREATE TABLE IF NOT EXISTS school_info (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  principal_name TEXT NOT NULL,
  medical_staff_name TEXT NOT NULL,
  head_chef_name TEXT NOT NULL,
  logo_url TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 1. Sổ Bước 1: Kiểm tra / Giao nhận thực phẩm (QĐ 1246/QĐ-BYT)
CREATE TABLE IF NOT EXISTS step1_inspections (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  food_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT NOT NULL,
  sensory_quality TEXT NOT NULL,
  supplier TEXT NOT NULL,
  expiry_or_certificate TEXT NOT NULL,
  deliverer TEXT NOT NULL,
  inspector TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT
);

-- 2. Sổ Bước 2: Quy trình sơ chế & nấu nướng
CREATE TABLE IF NOT EXISTS step2_cookings (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  meal TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  prep_time TEXT NOT NULL,
  cook_time TEXT NOT NULL,
  cooking_temp TEXT NOT NULL,
  hygiene_status TEXT NOT NULL,
  chef TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT
);

-- 3. Sổ Bước 3: Nếm thử & Niêm phong lưu mẫu
CREATE TABLE IF NOT EXISTS step3_tastings (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  meal TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  sensory_evaluation TEXT NOT NULL,
  serving_temp TEXT NOT NULL,
  sample_weight TEXT NOT NULL,
  storage_location TEXT NOT NULL,
  taster TEXT NOT NULL,
  keeper TEXT NOT NULL,
  result TEXT NOT NULL,
  notes TEXT
);

-- 4. Thực đơn dinh dưỡng học đường
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  week_number INTEGER NOT NULL,
  month TEXT NOT NULL,
  age_group TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  breakfast TEXT NOT NULL,
  snack_morning TEXT NOT NULL,
  lunch_main TEXT NOT NULL,
  lunch_soup TEXT NOT NULL,
  lunch_staple TEXT NOT NULL,
  lunch_dessert TEXT NOT NULL,
  afternoon_snack TEXT NOT NULL,
  calories_kcal REAL NOT NULL,
  protein_ratio TEXT NOT NULL,
  status TEXT NOT NULL,
  approved_by TEXT NOT NULL,
  notes TEXT
);

-- 5. Sổ Hủy Mẫu thức ăn sau 24h
CREATE TABLE IF NOT EXISTS sample_disposals (
  id TEXT PRIMARY KEY,
  date_sampled TEXT NOT NULL,
  time_sampled TEXT NOT NULL,
  meal TEXT NOT NULL,
  dish_name TEXT NOT NULL,
  sample_weight TEXT NOT NULL,
  container_type TEXT NOT NULL,
  storage_temp TEXT NOT NULL,
  disposal_date TEXT NOT NULL,
  disposal_time TEXT NOT NULL,
  condition_at_disposal TEXT NOT NULL,
  sampler_name TEXT NOT NULL,
  witness_name TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT
);

-- 6. Học sinh & Chế độ ăn uống dị ứng
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  student_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  dob TEXT NOT NULL,
  gender TEXT NOT NULL,
  class_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  attendance_status TEXT NOT NULL,
  allergies_or_diet TEXT,
  enrollment_date TEXT NOT NULL,
  notes TEXT
);

-- 7. Hồ sơ Sức khỏe Học sinh & Thể lực
CREATE TABLE IF NOT EXISTS health_records (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class_name TEXT NOT NULL,
  check_date TEXT NOT NULL,
  height_cm REAL NOT NULL,
  weight_kg REAL NOT NULL,
  nutrition_status TEXT NOT NULL,
  vaccination_status TEXT NOT NULL,
  general_health TEXT NOT NULL,
  doctor_or_examiner TEXT NOT NULL,
  notes TEXT
);

-- 8. Cán bộ Giáo viên & Bằng cấp ATTP
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  staff_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  gender TEXT,
  role TEXT NOT NULL,
  qualification TEXT NOT NULL,
  assigned_class_or_dept TEXT,
  assigned_duty TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  hygiene_cert_date TEXT,
  food_safety_cert_date TEXT,
  health_check_date TEXT,
  health_check_expiry TEXT,
  contract_status TEXT,
  start_date TEXT,
  status TEXT,
  notes TEXT
);

-- 9. Kế hoạch Giáo án điện tử
CREATE TABLE IF NOT EXISTS lesson_plans (
  id TEXT PRIMARY KEY,
  title TEXT,
  theme TEXT NOT NULL,
  target_class TEXT,
  age_group TEXT,
  subject TEXT,
  topic TEXT,
  teacher_name TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  month TEXT,
  date_range TEXT,
  development_field TEXT,
  learning_objectives TEXT,
  activities_plan TEXT,
  preparation TEXT,
  approval_status TEXT NOT NULL,
  approver_name TEXT NOT NULL,
  approval_date TEXT,
  file_attachment_name TEXT,
  notes TEXT
);

-- 10. Sổ Quỹ Thu / Chi & Tài chính
CREATE TABLE IF NOT EXISTS finance_transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount REAL NOT NULL,
  payer_or_receiver TEXT NOT NULL,
  method TEXT NOT NULL,
  receipt_number TEXT,
  notes TEXT,
  is_automatic_sync INTEGER DEFAULT 0
);

-- 11. Bảng Lương & Phụ Cấp Giáo Viên - Cán Bộ Nhân Viên
CREATE TABLE IF NOT EXISTS staff_salaries (
  id TEXT PRIMARY KEY,
  staff_id TEXT,
  staff_name TEXT NOT NULL,
  role TEXT NOT NULL,
  assigned_class TEXT,
  month TEXT NOT NULL,
  base_salary REAL NOT NULL,
  allowance_responsibility REAL DEFAULT 0,
  allowance_lunch REAL DEFAULT 0,
  allowance_other REAL DEFAULT 0,
  bonus REAL DEFAULT 0,
  insurance_deduction REAL DEFAULT 0,
  advance_payment REAL DEFAULT 0,
  other_deductions REAL DEFAULT 0,
  work_days_standard REAL DEFAULT 24,
  work_days_actual REAL DEFAULT 24,
  net_salary REAL NOT NULL,
  payment_status TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  bank_account TEXT,
  bank_name TEXT,
  notes TEXT
);
