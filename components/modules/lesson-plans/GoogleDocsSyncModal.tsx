'use client';

import React, { useState } from 'react';
import {
  X,
  FileText,
  Copy,
  ExternalLink,
  Download,
  Check,
  Sparkles,
  Cloud,
  Share2,
  CircleHelp,
} from 'lucide-react';
import {
  downloadAsWordDoc,
  copyFormattedContentForGoogleDocs,
  openNewGoogleDoc,
} from '@/lib/google-docs-export';

interface GoogleDocsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  htmlContent: string;
  themeName: string;
}

export default function GoogleDocsSyncModal({
  isOpen,
  onClose,
  documentTitle,
  htmlContent,
  themeName,
}: GoogleDocsSyncModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const ok = await copyFormattedContentForGoogleDocs(htmlContent);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    downloadAsWordDoc(htmlContent, `${documentTitle.replace(/\s+/g, '_')}.doc`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Cloud className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Đồng Bộ & Mở Trên Google Docs
              </h2>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                {documentTitle} • {themeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-blue-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-4 text-sm text-slate-700">
            <p className="font-semibold text-blue-950 flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Chuẩn hóa 100% định dạng trang Word & Google Docs
            </p>
            <p className="text-xs leading-relaxed text-slate-600">
              Toàn bộ hồ sơ (Trang bìa khung hoa văn, Thời khóa biểu, Thời gian biểu, Ma trận 3 cột,
              Tiến trình STEAM 5E) đã được tinh chỉnh tương thích tuyệt đối khi hiển thị trong Google Docs và Microsoft Word.
            </p>
          </div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phương án 1: Sao chép dán trực tiếp */}
            <div className="p-5 border-2 border-indigo-200 bg-indigo-50/40 rounded-xl flex flex-col justify-between hover:border-indigo-400 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                    Cách 1: Nhanh Nhất
                  </span>
                  <Copy className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Sao Chép Sang Google Docs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Hệ thống sao chép toàn bộ bảng biểu, viền và kiểu chữ. Bạn chỉ cần mở tài liệu Google Docs và nhấn <strong>Ctrl + V</strong> (hoặc Command + V trên Mac).
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCopy}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> Đã Sao Chép Thành Công!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Sao Chép Định Dạng A4
                    </>
                  )}
                </button>

                <button
                  onClick={openNewGoogleDoc}
                  className="w-full py-2 px-4 rounded-lg font-medium text-xs text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở Tài Liệu Docs Mới (docs.new)
                </button>
              </div>
            </div>

            {/* Phương án 2: Tải file Word mở trên Drive */}
            <div className="p-5 border border-slate-200 bg-white rounded-xl flex flex-col justify-between hover:border-blue-400 transition-all shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    Cách 2: File Độc Lập
                  </span>
                  <Download className="w-5 h-5 text-slate-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  Tải File Word (.doc)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Tải tệp Word đã định dạng sẵn. Sau đó kéo thả vào <strong>Google Drive</strong> để mở chỉnh sửa cộng tác online cùng tổ chuyên môn và Ban Giám Hiệu.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleDownload}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                    downloaded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {downloaded ? (
                    <>
                      <Check className="w-4 h-4" /> Đã Tải Tệp Về Máy!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Tải Tệp Word (.doc)
                    </>
                  )}
                </button>

                <a
                  href="https://drive.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-lg font-medium text-xs text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Truy Cập Google Drive Của Bạn
                </a>
              </div>
            </div>
          </div>

          {/* Hướng dẫn thao tác */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CircleHelp className="w-3.5 h-3.5 text-slate-500" />
              Quy trình 3 bước đưa giáo án vào Google Docs:
            </h4>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>Nhấn <strong>&quot;Sao Chép Định Dạng A4&quot;</strong> ở phía trên.</li>
              <li>Nhấn <strong>&quot;Mở Tài Liệu Docs Mới&quot;</strong> để mở trang soạn thảo Google Docs.</li>
              <li>Nhấn tổ hợp phím <strong>Ctrl + V</strong> để dán. Toàn bộ trang bìa, bảng biểu, khung viền hiển thị đầy đủ ngay lập tức.</li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 italic">
            Hỗ trợ Google Workspace, Google Drive & Microsoft 365
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
}
