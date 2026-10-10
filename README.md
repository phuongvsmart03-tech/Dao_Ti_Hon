# HỆ THỐNG QUẢN LÝ DINH DƯỠNG & BẾP ĂN BÁN TRÚ MẦM NON
*(Phần mềm chạy trên nền tảng Next.js, React 19, TypeScript và Tailwind CSS)*

Dự án đã được tối ưu hóa sẵn sàng để mở và chạy ngay trên máy tính cá nhân (PC / Laptop) bằng **VS Code**, **Google Antigravity** hoặc bất kỳ trình soạn thảo mã nguồn nào mà không gặp lỗi.

---

## 1. YÊU CẦU MÔI TRƯỜNG TRÊN MÁY TÍNH
Trước khi chạy ứng dụng trên máy tính của bạn, hãy đảm bảo máy tính đã cài đặt:
- **Node.js**: Phiên bản **18.x** trở lên (Khuyến nghị dùng Node.js 20 LTS hoặc 22 LTS).
  - Tải tại: [https://nodejs.org](https://nodejs.org)
- **Trình soạn thảo mã nguồn**: Visual Studio Code (VS Code) hoặc Google Antigravity.

---

## 2. HƯỚNG DẪN CÀI ĐẶT & CHẠY TRÊN MÁY TÍNH (3 BƯỚC)

### Bước 1: Mở thư mục dự án
1. Giải nén thư mục dự án bạn vừa tải về.
2. Mở ứng dụng **VS Code** (hoặc Google Antigravity).
3. Chọn menu `File` -> `Open Folder...` (Mở thư mục) và chọn thư mục dự án này.

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
Mở cửa sổ Terminal trong VS Code (phím tắt: `Ctrl + ~` trên Windows hoặc `Cmd + ~` trên Mac) và gõ lệnh:
```bash
npm install
```
*Lưu ý: Hệ thống đã có sẵn file `package-lock.json` chuẩn hóa, quá trình cài đặt sẽ diễn ra tự động và chính xác.*

### Bước 3: Khởi động phần mềm
Gõ lệnh sau vào Terminal:
```bash
npm run dev
```
Hoặc trong VS Code: Bấm phím **`F5`** để hệ thống tự động khởi động máy chủ thử nghiệm.

Sau khi màn hình hiển thị:
```
✓ Ready in ...ms
- Local: http://localhost:3000
```
Bạn chỉ cần mở trình duyệt web (Google Chrome, Cốc Cốc, Edge) và truy cập vào địa chỉ:
👉 **`http://localhost:3000`**

---

## 3. CƠ CHẾ LƯU TRỮ CƠ SỞ DỮ LIỆU TRÊN PC

Phần mềm được thiết kế chạy **offline hoàn toàn tự động** trên máy tính mà không cần cấu hình phức tạp:
1. **Mặc định (Offline nội bộ):** Nếu không điền URL đám mây, hệ thống sẽ tự động tạo cơ sở dữ liệu SQLite tại thư mục `data/mamnon.db` ngay trong dự án của bạn. Dữ liệu trường học, thực đơn, kiểm thực 3 bước và chữ ký số sẽ được lưu an toàn tại đây.
2. **Kết nối Turso Cloud (Tùy chọn nếu muốn đồng bộ nhiều máy qua mạng Internet):**
   - Sao chép file `.env.example` thành file `.env.local`
   - Điền thông tin cơ sở dữ liệu Turso của bạn:
     ```env
     TURSO_DATABASE_URL=libsql://your-database.turso.io
     TURSO_AUTH_TOKEN=your-token-here
     ```

---

## 4. CÁC LỆNH HỮU ÍCH KHÁC

- **Kiểm tra cú pháp & tính toàn vẹn (Linting):**
  ```bash
  npm run lint
  ```
- **Đóng gói sản phẩm chạy thực tế (Production Build):**
  ```bash
  npm run build
  npm start
  ```

---

## 5. DANH MỤC CÁC TÀI LIỆU QUAN TRỌNG TRONG DỰ ÁN
- **`nhu_cau.md`**: Bảng đặc tả toàn bộ quy trình nghiệp vụ thực tế, quyền chỉnh sửa dữ liệu của nhà trường và danh mục hơn 30 món ăn mặc định chuẩn mầm non (dành cho đối tác bên thứ ba).
- **`.vscode/`**: Thư mục cấu hình sẵn để VS Code và Antigravity tự động nhận diện TypeScript, định dạng code và cho phép bấm F5 chạy ngay.
- **`metadata.json`**: Thông tin định danh của ứng dụng.
