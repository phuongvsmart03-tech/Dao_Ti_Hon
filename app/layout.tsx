import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Phần mềm Quản lý Mầm non & Số hóa Hồ sơ',
  description: 'Hệ thống số hóa hồ sơ sổ sách mầm non, quản lý kiểm thực 3 bước, thực đơn dinh dưỡng, lưu hủy mẫu, học sinh, sức khỏe, nhân sự và giáo án chuẩn biểu mẫu Phòng GD&ĐT.',
  openGraph: {
    title: 'Phần mềm Quản lý Mầm non & Số hóa Hồ sơ',
    description: 'Hệ thống số hóa hồ sơ sổ sách mầm non, quản lý kiểm thực 3 bước, thực đơn dinh dưỡng, lưu hủy mẫu, học sinh, sức khỏe, nhân sự và giáo án chuẩn biểu mẫu Phòng GD&ĐT.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phần mềm Quản lý Mầm non & Số hóa Hồ sơ',
    description: 'Hệ thống số hóa hồ sơ sổ sách mầm non, quản lý kiểm thực 3 bước, thực đơn dinh dưỡng, lưu hủy mẫu, học sinh, sức khỏe, nhân sự và giáo án chuẩn biểu mẫu Phòng GD&ĐT.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased font-sans">{children}</body>
    </html>
  );
}
