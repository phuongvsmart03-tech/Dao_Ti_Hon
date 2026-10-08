import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-slate-600 mb-6">Trang không tồn tại hoặc đã được di chuyển.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
