# BẢNG MÔ TẢ YÊU CẦU VÀ QUY TRÌNH NGHIỆP VỤ PHẦN MỀM
## HỆ THỐNG QUẢN LÝ DINH DƯỠNG, BẾP ĂN BÁN TRÚ & VẬN HÀNH TRƯỜNG MẦM NON
*(Tài liệu đặc tả bài toán nghiệp vụ dành cho đối tác phát triển phần mềm)*

---

## 1. TỔNG QUAN DỰ ÁN & MỤC TIÊU CỦA NHÀ TRƯỜNG

### 1.1. Bối cảnh & Vấn đề thực tế
Tại các trường mầm non (cả công lập lẫn tư thục), công tác quản lý nuôi dưỡng và bán trú hiện nay gặp nhiều khó khăn:
- **Hồ sơ sổ sách quá nhiều và rời rạc:** Hàng ngày phải ghi chép tay hoặc dùng các file Excel riêng lẻ cho: Sổ kiểm thực 3 bước, Sổ lưu và hủy mẫu thức ăn 24h, Bảng tính khẩu phần dinh dưỡng, Báo ăn hàng ngày, Sổ thu chi tiền ăn, Phiếu lương nhân viên, Hồ sơ sức khỏe học sinh...
- **Rủi ro khi thanh kiểm tra:** Các đoàn kiểm tra liên ngành (Phòng Giáo dục & Đào tạo, Chi cục An toàn Vệ sinh Thực phẩm, Y tế) yêu cầu hồ sơ phải khớp nhau 100% theo đúng biểu mẫu Thông tư Bộ Y tế và Bộ GD&ĐT (đúng ngày, đúng giờ, đúng người giao, người nhận, tên thực phẩm, nhiệt độ tủ lưu mẫu, có đầy đủ chữ ký). Việc ghi chép thủ công dễ sai sót ngày tháng và số liệu.
- **Nhiều máy tính cùng làm việc trong trường:** Hiệu trưởng, Kế toán, Nhân viên Y tế và Bếp trưởng ngồi ở các phòng khác nhau, sử dụng các máy tính khác nhau. Khi một bên thay đổi thực đơn, đổi nhà cung cấp hay cập nhật chữ ký thì các máy khác phải cập nhật tức thì, không được lệch dữ liệu.
- **Tính toán dinh dưỡng phức tạp:** Việc cân đối năng lượng (Kcal) và tỷ lệ 3 chất Đạm - Béo - Đường (P - L - G) theo từng nhóm tuổi (Nhà trẻ từ 24 - 36 tháng và Mẫu giáo từ 3 - 5 tuổi) rất mất thời gian nếu làm thủ công.

### 1.2. Mục tiêu mong muốn khi xây dựng phần mềm
- **Tự động hóa hoàn toàn quy trình Bếp ăn bán trú:** Nhập thực đơn một lần, hệ thống tự động sinh ra sổ kiểm thực 3 bước, sổ lưu hủy mẫu, định lượng đi chợ, tính toán dinh dưỡng và chi phí tương ứng.
- **Đúng chuẩn quy định Nhà nước 100%:** Mọi biểu mẫu xuất ra in ấn (A4 dọc hoặc ngang) phải đúng quy cách trình bày của Phòng GD&ĐT, sẵn sàng ký duyệt và đóng dấu lưu hồ sơ thanh tra.
- **Làm việc đồng thời trên nhiều máy tính:** Dữ liệu tự động đồng bộ giữa các máy (máy Ban Giám Hiệu, máy Kế toán, máy Bếp, máy Y tế). Một máy ký tên hay đổi món thì các máy khác nhìn thấy ngay.
- **Dễ sử dụng cho nhân sự nhà trường:** Giao diện trực quan, rõ ràng, có sẵn mẫu gợi ý chuẩn, không đòi hỏi nhân viên phải giỏi tin học.
- **An toàn dữ liệu tuyệt đối:** Tự động sao lưu dữ liệu mỗi đêm, có thể tải về máy tính lưu trữ và phục hồi khi máy bị hỏng hoặc đổi máy mới.

---

## 2. CÁC ĐỐI TƯỢNG SỬ DỤNG (USER ROLES) TRONG NHÀ TRƯỜNG

1. **Ban Giám Hiệu (Hiệu trưởng / Phó Hiệu trưởng chuyên môn):**
   - Phê duyệt thực đơn tuần/tháng.
   - Ký duyệt báo cáo kiểm thực, bảng lương, kế hoạch giáo án và báo cáo tài chính.
   - Giám sát toàn bộ hoạt động của trường từ xa hoặc trên máy tính riêng.
2. **Nhân viên Y tế học đường:**
   - Thực hiện và xác nhận Bước 1 (Kiểm tra thực phẩm nhập kho lúc sáng sớm).
   - Tham gia Bước 3 (Nếm thử món ăn và niêm phong tủ lưu mẫu 24 giờ).
   - Theo dõi sức khỏe, biểu đồ tăng trưởng cân nặng/chiều cao và cảnh báo dị ứng của trẻ.
3. **Bếp trưởng / Nhân viên Cấp dưỡng:**
   - Xác nhận nhận thực phẩm tươi sống, gia vị.
   - Thực hiện Bước 2 (Ghi nhận sơ chế, nhiệt độ và thời gian nấu chín các món).
   - Ghi nhận thực hiện hủy mẫu thức ăn sau 24 giờ lưu trữ đúng nhiệt độ quy định (≤ 5°C).
4. **Kế toán / Thủ quỹ:**
   - Cài đặt đơn giá suất ăn/ngày, sĩ số báo ăn thực tế từng ngày.
   - Tính toán chi phí đi chợ thực tế, đối chiếu tồn quỹ tiền ăn.
   - Quản lý thu chi học phí, tiền ăn, tính lương và in phiếu lương cho giáo viên - nhân viên.
5. **Giáo viên chủ nhiệm các lớp:**
   - Điểm danh học sinh hàng ngày (Có mặt / Nghỉ học có phép / Không phép).
   - Báo cắt suất ăn cho học sinh nghỉ trước giờ quy định của nhà bếp.
   - Nộp kế hoạch bài giảng (giáo án) điện tử để Ban Giám Hiệu duyệt.

---

## 3. QUY TRÌNH NGHIỆP VỤ HÀNG NGÀY TẠI TRƯỜNG (WORKFLOW)

Quy trình vận hành khép kín từ 05:30 sáng đến chiều tối gồm các giai đoạn:

```
[05:30 - 06:30]                [07:00 - 08:00]                [08:00 - 11:30]
Nhà cung cấp giao hàng  --->   Giáo viên điểm danh     --->   Bếp sơ chế & nấu chín
+ Y tế & Bếp trưởng             + Chốt sĩ số ăn                + Kiểm tra nhiệt độ
+ Kiểm thực Bước 1             + Điều chỉnh lượng thực phẩm   + Kiểm thực Bước 2
        |                                                              |
        v                                                              v
[10:30 - 11:00]                [11:00 - 14:00]                [Hôm sau (24h sau)]
Nếm thử & Lưu mẫu 24h   --->   Trẻ ăn bán trú & ngủ    --->   Hủy mẫu thức ăn cũ
+ Y tế, Bếp, Ban Giám hiệu      + Theo dõi sức khỏe, dị ứng    + Kiểm tra trạng thái mẫu
+ Kiểm thực Bước 3              + Ghi nhận phát sinh           + Ký biên bản hủy mẫu
```

- **Bước 1: Giao nhận & Kiểm tra nguồn gốc thực phẩm (05:30 - 06:30 sáng):** Nhà cung cấp chở hàng tới cổng; Y tế & Bếp trưởng cân đo, kiểm tra độ tươi, hạn dùng, chứng nhận thú y, tích "Đạt" hoặc "Từ chối" trên hệ thống.
- **Bước 2: Báo ăn & Chốt định lượng (07:00 - 08:00 sáng):** Điểm danh sĩ số ăn thực tế tại các lớp; hệ thống tự tính lại lượng gạo, thịt, rau cần nấu và chi phí đi chợ trong ngày.
- **Bước 3: Sơ chế và Nấu chín (08:00 - 10:30 sáng):** Bếp sơ chế, nấu chín thức ăn; ghi nhận giờ bắt đầu, giờ kết thúc và nhiệt độ nấu đạt chuẩn (> 80°C - 100°C).
- **Bước 4: Nếm thử & Lưu mẫu thức ăn (10:30 - 11:00 trưa):** Trước giờ ăn 15-20 phút, người thử nếm đánh giá cảm quan; lấy mẫu lưu từng món (tối thiểu 100g/150ml) vào hũ vô trùng, niêm phong tủ lạnh (≤ 5°C).
- **Bước 5: Hủy mẫu thức ăn sau 24 giờ (Hôm sau):** Sau 24h kiểm tra mẫu bình thường, tiến hành hủy mẫu và ký xác nhận biên bản hủy mẫu.

---

## 4. CHI TIẾT CÁC PHÂN HỆ VÀ QUYỀN CHỈNH SỬA DỮ LIỆU CỦA NGƯỜI DÙNG (DATA EDITING RIGHTS)

Dưới đây là đặc tả rõ ràng **Người dùng được phép xem, thêm, sửa, xóa những dữ liệu nào** trong từng phân hệ:

### 4.1. Phân hệ Cài đặt Thông tin Trường, Nhân sự Ký tên & Nhà cung cấp
Người dùng (Chủ trường / Kế toán / Ban Giám Hiệu) có toàn quyền chỉnh sửa các mục sau:
- **Thông tin định danh trường:**
  - Tên trường mầm non.
  - Tên Phòng Giáo dục & Đào tạo chủ quản.
  - Địa chỉ trường, Số điện thoại liên hệ, Niên khóa học (VD: "Năm học 2024 - 2025").
  - Tải lên / Thay đổi **Logo trường** (ảnh hiển thị tự động trên góc trái tất cả biểu mẫu in).
- **Danh sách Họ tên & Chữ ký số của các chức danh:**
  - Người lập biểu (Cột trái trên các báo cáo).
  - Tổ trưởng Chuyên môn Nuôi (phụ trách Dinh dưỡng & Bếp ăn).
  - Tổ trưởng Chuyên môn Dạy (phụ trách Giáo dục & Học sinh).
  - Kế toán trưởng / Phụ trách Tài chính.
  - Nhân viên Y tế học đường (kiểm tra Bước 1 & Bước 3).
  - Bếp trưởng (giao nhận & nấu nướng Bước 2).
  - Người thử nếm & Người niêm phong mẫu lưu 24h.
  - Hiệu trưởng duyệt văn bản.
  - *Chức năng chữ ký:* Tải ảnh chữ ký (file PNG/JPG trong suốt) hoặc vẽ chữ ký trực tiếp bằng chuột/cảm ứng. **Chữ ký đã thêm phải lưu vĩnh viễn và tự động hiển thị trên tất cả máy tính khác**.
- **Danh mục Nhà cung cấp thực phẩm:**
  - Đơn vị cung cấp thịt cá tươi sống (Tên cơ sở, Địa chỉ, Người giao hàng, Điện thoại).
  - Đơn vị cung cấp rau củ quả an toàn.
  - Đơn vị cung cấp thủy hải sản tươi sống.
  - Đơn vị cung cấp hàng khô, gia vị, gạo và sữa.
- **Cấu hình vận hành mặc định:**
  - Nhiệt độ tủ lưu mẫu mặc định (mặc định 5°C, có thể chỉnh 2°C - 8°C).
  - Khung giờ kiểm thực tự động (Giờ nhập hàng, Giờ nấu chín, Giờ thử nếm, Giờ lưu mẫu, Giờ hủy mẫu).
  - Tùy chọn học bán trú Thứ 7 / Chủ Nhật (Bật/Tắt).
  - Hướng in mặc định (Khổ ngang Landscape hoặc Khổ dọc Portrait).

### 4.2. Phân hệ Cài đặt Sĩ số, Tiền ăn & Định mức mặc định
Người dùng có quyền chỉnh sửa:
- Sĩ số trẻ mặc định nhóm Nhà trẻ (VD: 25 trẻ).
- Sĩ số trẻ mặc định nhóm Mẫu giáo (VD: 95 trẻ).
- Đơn giá tiền ăn mỗi ngày của 1 học sinh (VD: 30.000 VNĐ hoặc 35.000 VNĐ/trẻ/ngày).
- Tỷ lệ phân bổ tiền ăn giữa các bữa: Bữa chính trưa (65%), Bữa sáng và xế (35%).

### 4.3. Phân hệ Kiểm thực 3 Bước & Sổ Lưu hủy mẫu 24h
Người dùng có toàn quyền:
- **Bước 1 (Giao nhận nguyên liệu):**
  - Thêm mới dòng thực phẩm nhập kho hoặc chỉnh sửa số lượng thực tế nhận được (kg/lít).
  - Sửa đánh giá cảm quan: "Đạt (tươi mới, không mùi lạ)" hoặc "Không đạt (hỏng, ôi thiu)".
  - Sửa hạn sử dụng / Số giấy chứng nhận kiểm dịch thú y.
  - Sửa thông tin người giao, người nhận, người kiểm tra.
  - Xóa dòng thực phẩm nếu ngày hôm đó không nhập.
- **Bước 2 (Chế biến thực phẩm):**
  - Sửa giờ bắt đầu chế biến, giờ nấu chín hoàn thành của từng món.
  - Đánh giá tình trạng chín kỹ, màu sắc, mùi vị, nhiệt độ đạt chuẩn.
  - Sửa tên Bếp trưởng nấu và Người giám sát bếp.
- **Bước 3 (Thử nếm thức ăn):**
  - Sửa giờ thử nếm của từng món ăn (trước giờ ăn của trẻ 15-20 phút).
  - Sửa kết luận thử nếm ("Mùi vị thơm ngon, chín nhừ, đạt yêu cầu").
  - Sửa tên Người thử nếm và Người giám sát.
- **Sổ Theo dõi & Hủy mẫu lưu 24h:**
  - Sửa khối lượng mẫu lưu thực tế (gam hoặc ml).
  - Sửa vị trí tủ lạnh, nhiệt độ tủ lưu mẫu thực tế khi ghi nhận.
  - Cập nhật giờ hủy mẫu thực tế (sau 24h).
  - Sửa tình trạng mẫu khi mở niêm phong hủy ("Bình thường, không biến chất").
  - Ký biên bản hủy mẫu giữa Người lưu mẫu và Người chứng kiến hủy.

### 4.4. Phân hệ Lập Thực Đơn & Cân Bằng Dinh Dưỡng
Người dùng có toàn quyền:
- **Lập thực đơn tuần/tháng:**
  - Chọn món ăn cho từng bữa: Bữa sáng, Bữa phụ sáng, Bữa chính trưa (Món mặn + Món canh + Món xào), Bữa tráng miệng trưa, Bữa xế chiều, Bữa phụ chiều.
  - Phân tách thực đơn riêng cho lứa tuổi **Nhà Trẻ** (cháo, súp, món mềm) và **Mẫu Giáo** (cơm, canh, món mặn).
  - Sao chép thực đơn từ tuần này sang tuần khác chỉ với 1 nút bấm.
- **Quản lý Thư viện món ăn:**
  - **Thêm món ăn mới** vào kho dữ liệu của trường (Nhập tên món, chọn bữa ăn, nhóm tuổi, thẻ dinh dưỡng, calo ước tính, mô tả chế biến).
  - **Chỉnh sửa món ăn có sẵn:** Đổi tên món, chỉnh sửa thành phần dinh dưỡng.
  - **Xóa món ăn** khỏi thư viện nếu trường không còn nấu món đó.
  - **Chỉnh sửa Bảng phân rã nguyên liệu của từng món (Recipe Breakdown):**
    - Sửa danh sách nguyên liệu tạo nên món (VD: Thịt heo, bí đỏ, hành ngò, dầu ăn, nước mắm).
    - Sửa định lượng gam thô/suất, định lượng gam tinh/suất, tỷ lệ hao hụt khi sơ chế (%).
    - Sửa đơn giá mua vào của từng loại nguyên liệu (VNĐ/kg).
- **Tính toán dinh dưỡng & Chi phí:**
  - Xem và kiểm tra tổng Kcal trong ngày (chuẩn 600 - 850 Kcal/ngày tại trường).
  - Kiểm tra tỷ lệ 3 chất P-L-G (Đạm 13-20%, Béo 25-35%, Đường bột 52-60%).

### 4.5. Phân hệ Đổi món & Sĩ số nhanh trong ngày (Phân hệ Linh hoạt)
Người dùng có quyền:
- Bấm **"Đổi món hôm nay"**: Thay thế tức thì một món ăn trong ngày hôm nay sang món khác (khi chợ hết nguyên liệu đột xuất) mà **không làm thay đổi hay ảnh hưởng đến thực đơn các tuần khác**.
- **Chỉnh sửa sĩ số ăn hôm nay**: Tăng/giảm số bé ăn Nhà trẻ hoặc Mẫu giáo của riêng ngày hôm đó theo báo cáo điểm danh thực tế; hệ thống tự tính lại chi phí và lượng thực phẩm đi chợ của ngày.

### 4.6. Phân hệ Quản Lý Học Sinh, Sức Khỏe & Cảnh Báo Dị Ứng
Người dùng có toàn quyền:
- **Hồ sơ học sinh:**
  - Thêm học sinh mới, sửa thông tin, xóa học sinh nghỉ học/chuyển trường.
  - Sửa các trường: Mã học sinh, Họ và tên, Ngày sinh, Giới tính, Lớp học (Nhà trẻ Hoa Cúc, Mầm 1, Mầm 2, Chồi 1, Chồi 2, Lá 1, Lá 2), Họ tên phụ huynh, Số điện thoại liên hệ, Địa chỉ nhà.
- **Điểm danh hàng ngày:**
  - Tích chọn trạng thái từng bé: Có mặt / Nghỉ có phép / Nghỉ không phép.
- **Thông tin dị ứng & Chế độ ăn đặc biệt:**
  - Nhập chi tiết chất dị ứng của từng bé (VD: "Dị ứng tôm cua", "Không uống sữa bò", "Dị ứng đậu phộng", "Ăn chay").
  - Khi thực đơn có món chứa chất dị ứng, hệ thống tự động lọc và cảnh báo danh sách học sinh cần suất ăn thay thế.
- **Khám sức khỏe định kỳ:**
  - Nhập ngày khám, số đo Chiều cao (cm), Cân nặng (kg).
  - Sửa tình trạng tiêm chủng, tình trạng răng miệng, mắt, tai mũi họng.
  - Hệ thống tự phân loại: Bình thường (Kênh A), Suy dinh dưỡng thể nhẹ cân, Thấp còi, Thừa cân/Béo phì.

### 4.7. Phân hệ Quản Lý Nhân Sự, Giáo Án & Tài Chính Bán Trú
Người dùng có toàn quyền:
- **Hồ sơ cán bộ nhân viên:**
  - Thêm, sửa, xóa nhân viên (Hiệu trưởng, Hiệu phó, Giáo viên, Y tế, Bếp trưởng, Cấp dưỡng, Kế toán).
  - Sửa chức danh, lớp phụ trách, bằng cấp chuyên môn, ngày hết hạn Giấy khám sức khỏe, ngày hết hạn Chứng chỉ tập huấn An toàn thực phẩm.
- **Kế hoạch bài giảng (Giáo án):**
  - Thêm kế hoạch giáo án theo tuần/tháng, chủ đề, độ tuổi, mục tiêu phát triển.
  - Đổi trạng thái: Chờ duyệt, Đã duyệt, Yêu cầu chỉnh sửa kèm ghi chú của Ban Giám Hiệu.
- **Bảng lương & Chấm công:**
  - Sửa số ngày công làm việc thực tế trong tháng.
  - Sửa mức lương cơ bản, tiền trách nhiệm, phụ cấp ăn trưa, tiền thưởng, trừ tạm ứng, trích đóng bảo hiểm.
  - Sửa phương thức chi trả (Chuyển khoản / Tiền mặt), số tài khoản ngân hàng, tên ngân hàng.
  - Xuất phiếu lương cá nhân và bảng ký nhận lương.
- **Sổ quỹ Thu - Chi tiền ăn & Tài chính:**
  - Thêm phiếu thu (Tiền ăn phụ huynh đóng, Học phí, Phụ phí).
  - Thêm phiếu chi (Tiền chợ trả nhà cung cấp thịt/rau/sữa, Tiền gas, Tiền điện nước, Đồ dùng học tập).
  - Sửa ngày chứng từ, số phiếu thu/chi, số tiền, người nộp/người nhận, ghi chú.

### 4.8. Phân hệ Quản Trị Hệ Thống, Bảo Mật & Sao Lưu
Người dùng có quyền:
- **Đổi mã PIN bảo mật quản trị** (mặc định '123456') dùng để bảo vệ các thao tác nhạy cảm.
- **Cấu hình tự động sao lưu:**
  - Bật / Tắt tính năng tự động sao lưu định kỳ hàng đêm.
  - Thay đổi giờ sao lưu (mặc định 00:00).
  - Bấm nút **"Chạy sao lưu ngay"** để tạo bản sao lưu dữ liệu tức thì.
  - Xem lịch sử các bản sao lưu (thời gian, dung lượng KB, số lượng bản ghi, mã SHA kiểm tra).
  - Bấm **"Khôi phục"** từ bản sao lưu cũ để phục hồi toàn bộ dữ liệu khi cần.
  - Bấm **"Tải về file sao lưu (.JSON)"** để cất giữ an toàn trên máy tính cá nhân.

---

## 5. DANH SÁCH CÁC MÓN ĂN MẶC ĐỊNH SẴN CÓ TRONG HỆ THỐNG (MASTER DISH LIBRARY)

Hệ thống được nạp sẵn **hơn 30 món ăn chuẩn mực ngành giáo dục mầm non Việt Nam**, đầy đủ thông tin dinh dưỡng và thành phần phân rã nguyên liệu để nhà trường sử dụng ngay mà không mất công nhập lại từ đầu:

### 5.1. Nhóm I: Món Mặn Chính (Bữa trưa - Cung cấp đạm chính)
1. **Cá Basa kho thơm:**
   - *Độ tuổi:* Tất cả lứa tuổi (Nhà trẻ & Mẫu giáo).
   - *Đặc điểm dinh dưỡng:* 165 Kcal, giàu đạm dễ tiêu, Omega-3, vị thanh ngọt dịu từ dứa chín.
   - *Nguyên liệu chính:* Cá basa fillet nạc khử tanh nước gừng, dứa tươi, hành hoa, dầu Simply, nước mắm Chinsu.
2. **Thịt bò xào cà chua:**
   - *Độ tuổi:* Mẫu giáo (3-6 tuổi).
   - *Đặc điểm dinh dưỡng:* 180 Kcal, giàu sắt, đạm cao, Vitamin C từ cà chua chín đỏ.
   - *Nguyên liệu chính:* Thịt thăn bò băm nhỏ/thái mỏng, cà chua tươi Hải Hậu, hành tím, tỏi, dầu ăn.
3. **Cá thu sốt cà chua:**
   - *Độ tuổi:* Tất cả lứa tuổi.
   - *Đặc điểm dinh dưỡng:* 175 Kcal, đạm biển cao cấp, giàu DHA phát triển trí não, Vitamin A.
   - *Nguyên liệu chính:* Cá thu nạc không xương, sốt cà chua sánh mịn, ngò rí, gia vị mầm non.
4. **Tôm sốt cam:**
   - *Độ tuổi:* Tất cả lứa tuổi.
   - *Đặc điểm dinh dưỡng:* 155 Kcal, giàu Canxi phát triển chiều cao, Vitamin C tự nhiên, kích thích thèm ăn.
   - *Nguyên liệu chính:* Tôm sú lột nõn băm/xắt hạt lựu, nước cốt cam sành tươi vàng óng, đường phèn, dầu ăn.
5. **Tôm rim thịt nạc:**
   - *Độ tuổi:* Tất cả lứa tuổi.
   - *Đặc điểm dinh dưỡng:* 160 Kcal, đạm kép biển - gia súc, giàu Canxi, khoáng chất vi lượng.
   - *Nguyên liệu chính:* Tôm nõn băm xào cùng thịt nạc vai xay, rim mặn ngọt óng ả, hành hoa.
6. **Thịt kho trứng cút:**
   - *Độ tuổi:* Tất cả lứa tuổi.
   - *Đặc điểm dinh dưỡng:* 210 Kcal, giàu Lecithin bổ não từ lòng đỏ trứng, đạm hoàn chỉnh.
   - *Nguyên liệu chính:* Thịt nạc vai heo Ba Vì thái nhỏ kho mềm, trứng cút bóc vỏ luộc kỹ, nước dừa tươi.
7. **Chả cá chiên thì là:**
   - *Độ tuổi:* Tất cả lứa tuổi.
   - *Đặc điểm dinh dưỡng:* 170 Kcal, mềm xốp dễ nhai, đạm hải sản lành tính.
   - *Nguyên liệu chính:* Cá thác lác quết dẻo thì là hành hoa, chiên mềm vàng mặt ngoài, bên trong ẩm mọng.
8. **Trứng chiên ngũ sắc rau củ:**
   - *Độ tuổi:* Tất cả lứa tuổi.
   - *Đặc điểm dinh dưỡng:* 145 Kcal, giàu Lutein sáng mắt, Vitamin tổng hợp từ rau củ.
   - *Nguyên liệu chính:* Trứng gà tươi đánh bông, cà rốt, bắp ngọt, nấm tươi xắt hạt lựu nhuyễn cuộn vàng.

### 5.2. Nhóm II: Món Canh Dinh Dưỡng (Bữa trưa - Bổ sung nước, vitamin & khoáng chất)
9. **Canh chua cá bớp:**
   - *Đặc điểm dinh dưỡng:* 95 Kcal, Omega-3, vị chua dịu thanh mát giải nhiệt mùa nóng.
   - *Nguyên liệu chính:* Cá bớp ngọt thịt lọc xương, cà chua, giá đỗ, ngò gai, thì là.
10. **Canh cua đồng mồng tơi mướp hương:**
    - *Đặc điểm dinh dưỡng:* 85 Kcal, nguồn Canxi tự nhiên dồi dào, mát ruột, nhuận tràng.
    - *Nguyên liệu chính:* Cua đồng tươi xay lọc gạch béo ngậy, rau mồng tơi non, mướp hương thái mỏng.
11. **Canh bí đao thịt bằm:**
    - *Đặc điểm dinh dưỡng:* 75 Kcal, thanh nhiệt cơ thể, nước canh ngọt lành, dễ nuốt.
    - *Nguyên liệu chính:* Bí đao xanh non băm nhuyễn, thịt nạc lợn thăn băm ngọt nước, hành ngò.
12. **Canh bí đỏ thịt bằm:**
    - *Đặc điểm dinh dưỡng:* 95 Kcal, giàu tiền Vitamin A (Beta-carotene) bổ mắt, bổ thần kinh và tăng cân.
    - *Nguyên liệu chính:* Bí đỏ dẻo bùi nấu nhừ tán nhuyễn, thịt heo nạc xay, ngò tây.
13. **Canh rau cải ngọt thịt bằm:**
    - *Đặc điểm dinh dưỡng:* 70 Kcal, giàu chất xơ hòa tan, Vitamin C và Kẽm.
    - *Nguyên liệu chính:* Cải ngọt non Đông Anh cắt nhỏ, thịt nạc xay, nước dùng trong vắt.
14. **Canh dưa hồng thịt bằm:**
    - *Đặc điểm dinh dưỡng:* 70 Kcal, vị mát giòn ngọt đặc trưng vùng duyên hải, giải độc cơ thể.
    - *Nguyên liệu chính:* Dưa hồng non băm sợi nấu cùng thịt heo thăn tươi băm nhỏ.

### 5.3. Nhóm III: Bữa Sáng & Bữa Xế Chiều (Món ăn no, năng lượng cao, dễ tiêu hóa)
15. **Súp gà ngô non nấm tuyết:**
    - *Đặc điểm dinh dưỡng:* 160 Kcal, đạm gà xé sợi mịn dễ nuốt, bắp ngọt, trứng cút đánh sợi hoa.
16. **Phở bò truyền thống:**
    - *Đặc điểm dinh dưỡng:* 230 Kcal, nước hầm xương củ quả ngọt đậm, bánh phở mềm, thịt thăn bò thái mỏng chín mềm.
17. **Bánh canh chả cá sườn non:**
    - *Đặc điểm dinh dưỡng:* 210 Kcal, sợi bánh canh bột gạo mềm mượt, chả cá hấp lát mỏng, nước sườn hầm thanh.
18. **Cháo thịt bằm hạt sen (Đặc biệt cho Nhà trẻ):**
    - *Đặc điểm dinh dưỡng:* 180 Kcal, gạo tẻ ninh nhừ sánh đặc cùng hạt sen bở tơi, thịt nạc xay xào thơm, ấm dạ dày.
19. **Soup nui chữ cái thịt bằm đậu Hà Lan:**
    - *Đặc điểm dinh dưỡng:* 195 Kcal, nui chữ cái xinh xắn kích thích trí tò mò của trẻ, sườn non băm, cà rốt, đậu ngọt.
20. **Bánh hỏi chả lụa nước mắm ngọt:**
    - *Đặc điểm dinh dưỡng:* 220 Kcal, bánh hỏi sợi chỉ thoa dầu hẹ, ăn kèm chả lụa loại 1 cắt que vừa tay cầm.

### 5.4. Nhóm IV: Tráng Miệng & Bữa Phụ Hoa Quả (Vitamin & Men vi sinh)
21. **Yaourt (Sữa chua) tự làm:**
    - *Đặc điểm dinh dưỡng:* 105 Kcal, chứa hàng tỷ lợi khuẩn Probiotics tự nhiên tăng cường hệ miễn dịch đường ruột.
22. **Sinh tố hoa quả theo mùa (Xoài cát, bơ sáp, chuối tiêu):**
    - *Đặc điểm dinh dưỡng:* 110 Kcal, Vitamin A, C, E nguyên chất xay cùng sữa tươi tiệt trùng.
23. **Thạch rau câu cốt dừa lá dứa:**
    - *Đặc điểm dinh dưỡng:* 70 Kcal, mát lành, chất xơ tự nhiên từ rong biển, cắt hạt lựu an toàn chống nghẹn.
24. **Bánh chuối hấp nước cốt dừa mè rang:**
    - *Đặc điểm dinh dưỡng:* 140 Kcal, giàu Kali và chất xơ, vị ngọt lành từ chuối sứ chín muồi.

### 5.5. Nhóm V: Đồ Uống & Nước Ép Thanh Nhiệt Bổ Sung
25. **Nước Cam sành vắt tươi:** 65 Kcal, Vitamin C hàm lượng cao, tăng sức đề kháng, chống cảm cúm mùa đổi gió.
26. **Nước Dừa xiêm tươi:** 45 Kcal, bù điện giải tự nhiên (Kali, Magie), giải nhiệt ngày nóng.
27. **Nước Mía tắc tươi:** 60 Kcal, khoáng chất vi lượng, năng lượng sạch tự nhiên giúp trẻ sảng khoái sau vận động.
28. **Nước Sâm thảo mộc (Mía lau, lá dứa, râu bắp):** 45 Kcal, mát gan, lợi tiểu, thanh lọc cơ thể.
29. **Nước Chanh đường phèn:** 40 Kcal, dịu họng, bổ sung nước và Vitamin C.

### 5.6. Nhóm VI: Món Ăn Kèm & Nước Uống Thiết Yếu Hàng Ngày
30. **Cơm trắng gạo tám thơm dẻo:** 180 Kcal/suất, nguồn cung cấp tinh bột chính, dẻo ngọt, dễ nhai.
31. **Nước uống đun sôi để nguội tiệt trùng:** Nước tinh khiết kiểm định định kỳ, sẵn sàng 24/24 cho trẻ uống tại lớp.

---

## 6. YÊU CẦU KỸ THUẬT VẬN HÀNH & ĐỒNG BỘ ĐA THIẾT BỊ

- **Cơ chế hoạt động đa máy tính:**
  - Nhà trường sử dụng đồng thời máy tính tại: Phòng Hiệu trưởng, Phòng Kế toán, Phòng Y tế, Bếp ăn.
  - Khi Máy 1 thay đổi bất kỳ dữ liệu nào (ví dụ: đổi thực đơn, đổi số điện thoại nhà xe, cập nhật chữ ký Y tế mới), hệ thống tự động đẩy dữ liệu sang các máy còn lại tức thì.
- **Cơ chế sao lưu tự động & An toàn dữ liệu (Disaster Recovery):**
  - Tự động sao lưu toàn bộ dữ liệu trường học lúc **00:00 hàng đêm**.
  - Mỗi bản sao lưu có mã Checksum SHA chống can thiệp hoặc hư hỏng file.
  - Cho phép người dùng bấm nút **"⚡ Chạy Sao Lưu Ngay"** bất cứ lúc nào.
  - Cho phép khôi phục lại 100% dữ liệu từ lịch sử sao lưu chỉ bằng 1 thao tác.
  - Cho phép tải bản sao lưu dạng tệp về máy tính để lưu vào USB hoặc Google Drive.
- **Quy chuẩn in ấn:**
  - Xuất in khổ A4 chuẩn hành chính Phòng Giáo dục & Đào tạo.
  - Biểu mẫu dọc: Sổ lưu hủy mẫu, Sổ sức khỏe, Phiếu lương, Danh sách học sinh.
  - Biểu mẫu ngang: Sổ kiểm thực Bước 1, Bước 2, Bước 3, Bảng thực đơn tuần.
  - Chữ ký số tự động chèn đúng chân trang từng chức danh.

---

## 7. BẢNG TIÊU CHÍ NGHIỆM THU BÀN GIAO SẢN PHẨM

| STT | Tiêu chí nghiệm thu bắt buộc | Mức độ |
|:---:|:---|:---:|
| 1 | Người dùng có thể sửa đầy đủ tất cả các trường dữ liệu ở mục 4 (Trường, Ký tên, Kiểm thực, Thực đơn, Học sinh, Nhân sự, Tài chính) | **Bắt buộc 100%** |
| 2 | Chữ ký số thêm từ 1 máy tính phải xuất hiện ngay trên tất cả các máy tính khác trong trường | **Bắt buộc 100%** |
| 3 | Có sẵn hơn 30 món ăn mặc định chuẩn mầm non kèm đầy đủ định lượng dinh dưỡng Kcal | **Bắt buộc 100%** |
| 4 | Nhập thực đơn tự động sinh ra đủ Sổ kiểm thực 3 bước và Sổ lưu hủy mẫu 24h | **Bắt buộc 100%** |
| 5 | Tự động cân đối Kcal và tỷ lệ P-L-G riêng biệt cho Nhà trẻ và Mẫu giáo | **Bắt buộc 100%** |
| 6 | Cảnh báo tự động danh sách trẻ dị ứng khi thực đơn có món chứa nguyên liệu gây dị ứng | **Bắt buộc 100%** |
| 7 | Có chức năng Đổi món & Sĩ số nhanh trong ngày mà không làm hỏng thực đơn các tuần khác | **Bắt buộc 100%** |
| 8 | Tự động sao lưu dữ liệu mỗi đêm lúc 00:00 và có tính năng tải về / khôi phục dữ liệu an toàn | **Bắt buộc 100%** |
| 9 | In ấn chuẩn khổ A4, đẹp mắt, không tràn trang, có sẵn logo trường và chữ ký các chức danh | **Bắt buộc 100%** |

---

*Tài liệu này là căn cứ chính thức để Nhà trường tiến hành ký kết hợp đồng, giám sát tiến độ và nghiệm thu bàn giao sản phẩm với đối tác phát triển phần mềm.*
