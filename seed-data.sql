-- =========================================================================
-- MÃ NẠP DỮ LIỆU ĐẦY ĐỦ 9 SỔ SÁCH & HỌC SINH MẦM NON VÀO TURSO DB
-- CHUẨN QUYẾT ĐỊNH 1246/QĐ-BYT (BỘ Y TẾ)
-- =========================================================================

-- 1. THỰC ĐƠN TUẦN CHUẨN DINH DƯỠNG (menu_items)
INSERT INTO menu_items (
  id, week_number, month, age_group, day_of_week, 
  breakfast, snack_morning, lunch_main, lunch_soup, lunch_staple, lunch_dessert, afternoon_snack, 
  calories_kcal, protein_ratio, status, approved_by, notes
) VALUES
(
  'menu-t2', 38, '09/2026', 'Mẫu giáo (3-5 tuổi)', 'Thứ Hai',
  'Cháo gà hạt sen', 'Sữa chua dâu tươi',
  'Thịt lợn rim nấm đông cô', 'Canh bí đỏ nấu tôm nõn', 'Cơm trắng gạo tám thơm', 'Chuối tiêu chín cây',
  'Bánh flan caramen + Sữa hạt óc chó',
  765.0, '14.8%', 'Đã duyệt', 'Nguyễn Thị Hiệu Trưởng', 'Nguyên liệu sạch chứng nhận VietGAP'
),
(
  'menu-t3', 38, '09/2026', 'Mẫu giáo (3-5 tuổi)', 'Thứ Ba',
  'Súp tôm bắp ngọt măng tây', 'Nước ép cam sành nguyên chất',
  'Cá hồi áp chảo sốt bơ tỏi', 'Canh cải ngọt nấu thịt băm', 'Cơm trắng gạo tám thơm', 'Dưa hấu Long An',
  'Chè đậu xanh hạt sen + Sữa chua nếp cẩm',
  780.0, '15.2%', 'Đã duyệt', 'Nguyễn Thị Hiệu Trưởng', 'Bổ sung Omega-3 cho các bé'
),
(
  'menu-t4', 38, '09/2026', 'Mẫu giáo (3-5 tuổi)', 'Thứ Tư',
  'Phở bò tươi Hà Nội', 'Sữa chua uống men sống Probi',
  'Thịt bò xào rau củ ngũ sắc', 'Canh mồng tơi nấu cua đồng', 'Cơm gạo tám thơm', 'Thanh long ruột đỏ',
  'Bánh mì sandwich bơ sữa + Sữa bột Abbott Grow',
  795.0, '15.5%', 'Đã duyệt', 'Nguyễn Thị Hiệu Trưởng', 'Canh cua đồng giàu canxi hỗ trợ chiều cao'
),
(
  'menu-t5', 38, '09/2026', 'Mẫu giáo (3-5 tuổi)', 'Thứ Năm',
  'Bún mọc nấm rơm sườn heo', 'Sữa đậu nành mè đen Fami',
  'Gà sốt chua ngọt hạt điều', 'Canh súp rau củ thập cẩm', 'Cơm trắng dẻo thơm', 'Đu đủ chín ruột đỏ',
  'Cháo tôm thịt băm nhuyễn + Nước ép ổi',
  750.0, '14.5%', 'Đã duyệt', 'Nguyễn Thị Hiệu Trưởng', 'Rau củ hữu cơ Đà Lạt'
),
(
  'menu-t6', 38, '09/2026', 'Mẫu giáo (3-5 tuổi)', 'Thứ Sáu',
  'Cháo cá chép đậu xanh hạt sen', 'Nước ép táo Gala nguyên chất',
  'Tôm hấp nước dừa xiêm', 'Canh chua cá lóc nấu thì là', 'Cơm gạo tám Điện Biên', 'Nho đen không hạt',
  'Bánh bao kim sa sữa dừa + Sữa tươi tiệt trùng Vinamilk',
  770.0, '15.0%', 'Đã duyệt', 'Nguyễn Thị Hiệu Trưởng', 'Bữa ăn cuối tuần đổi vị thơm ngon'
)
ON CONFLICT(id) DO UPDATE SET
  breakfast=excluded.breakfast,
  lunch_main=excluded.lunch_main,
  lunch_soup=excluded.lunch_soup,
  calories_kcal=excluded.calories_kcal,
  protein_ratio=excluded.protein_ratio;

-- 2. CẤU HÌNH TRƯỜNG HỌC (school_info)
INSERT INTO school_info (id, name, department, address, phone, academic_year, principal_name, medical_staff_name, head_chef_name)
VALUES (
  'default',
  'Trường Mầm Non Họa Mi',
  'Phòng Giáo Dục & Đào Tạo Quận 1, TP. Hồ Chí Minh',
  'Số 123 Đường Nguyễn Du, Phường Bến Nghé, Quận 1',
  '028 3822 1234',
  '2025 - 2026',
  'Nguyễn Thị Kim Dung',
  'Trần Yến Nhi (Cử nhân Điều dưỡng)',
  'Lê Thị Thu Cúc (Bếp trưởng)'
)
ON CONFLICT(id) DO UPDATE SET
  name=excluded.name,
  department=excluded.department,
  address=excluded.address,
  phone=excluded.phone,
  academic_year=excluded.academic_year,
  principal_name=excluded.principal_name;

-- 3. HỌC SINH MẪU (students)
INSERT INTO students (id, student_code, full_name, dob, gender, class_name, parent_name, parent_phone, address, attendance_status, allergies_or_diet, enrollment_date)
VALUES
('hs-01', 'HS2026-001', 'Nguyễn Hoàng Nam', '2021-05-12', 'Nam', 'Lớp Lá 1 (5-6 tuổi)', 'Nguyễn Văn Hùng', '0903123456', '12 Nguyễn Thị Minh Khai, Q1', 'Có mặt', 'Không dị ứng', '2024-09-01'),
('hs-02', 'HS2026-002', 'Trần Bảo Anh', '2021-08-20', 'Nữ', 'Lớp Lá 1 (5-6 tuổi)', 'Trần Thị Mai', '0918765432', '45 Lê Duẩn, Q1', 'Có mặt', 'Dị ứng hải sản vỏ cứng (tôm, cua)', '2024-09-01'),
('hs-03', 'HS2026-003', 'Lê Minh Khôi', '2022-03-15', 'Nam', 'Lớp Chồi 2 (4-5 tuổi)', 'Lê Tuấn Kiệt', '0982334455', '88 Hai Bà Trưng, Q1', 'Có mặt', 'Không dung nạp đường Lactose sữa bò', '2024-09-01')
ON CONFLICT(id) DO NOTHING;
