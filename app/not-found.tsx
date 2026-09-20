import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">404 - Không tìm thấy trang</h2>
      <p className="text-slate-600 mb-4 text-sm">Trang bạn yêu cầu không tồn tại hoặc đã bị chuyển đi.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
