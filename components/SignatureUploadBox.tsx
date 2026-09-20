'use client';

import React, { useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Sparkles, PenTool } from 'lucide-react';

interface SignatureUploadBoxProps {
  signatureUrl?: string;
  onSaveSignature: (dataUrl: string) => void;
  onRemoveSignature: () => void;
  staffName?: string;
  roleTitle: string;
}

export default function SignatureUploadBox({
  signatureUrl,
  onSaveSignature,
  onRemoveSignature,
  staffName,
  roleTitle,
}: SignatureUploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh chữ ký dung lượng dưới 2MB để tối ưu in ấn và lưu trữ.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSaveSignature(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate an elegant SVG handwritten signature as a quick digital signature
  const handleGenerateDigitalSignature = () => {
    const name = staffName?.trim() || 'Chữ ký số';
    // Draw SVG on a canvas
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 300, 100);
    // Blue fountain pen ink style
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fancy signature cursive text
    ctx.font = 'italic 34px "Brush Script MT", "Caveat", "Dancing Script", cursive, serif';
    ctx.fillStyle = '#0369a1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 150, 45);

    // Dynamic underline loop flourish
    ctx.beginPath();
    ctx.moveTo(35, 75);
    ctx.bezierCurveTo(90, 85, 210, 65, 265, 80);
    ctx.stroke();

    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl);
  };

  return (
    <div className="mt-2.5 pt-2.5 border-t border-slate-200/80">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="font-semibold text-slate-700 flex items-center gap-1">
          <PenTool className="w-3.5 h-3.5 text-indigo-600" />
          Chữ ký số / Ảnh chữ ký:
        </span>
        {signatureUrl ? (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" /> Đã có chữ ký
          </span>
        ) : (
          <span className="text-[10px] text-slate-600">Chưa có (để trống ký tay)</span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
      />

      {signatureUrl ? (
        <div className="relative group bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
          <div className="h-12 flex items-center justify-center bg-slate-50 rounded px-2 border border-slate-100 flex-1">
            <img
              src={signatureUrl}
              alt={`Chữ ký ${roleTitle}`}
              className="max-h-10 max-w-full object-contain"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
              title="Thay đổi ảnh chữ ký khác"
            >
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={onRemoveSignature}
              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
              title="Xóa chữ ký này"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Tải ảnh chữ ký (PNG/JPG)</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateDigitalSignature}
            title="Tạo nhanh mẫu chữ ký số mực xanh thanh lịch từ tên nhân sự"
            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tạo chữ ký mẫu</span>
          </button>
        </div>
      )}
      <p className="text-[10px] text-slate-600 mt-1">
        Tự động chèn chữ ký vào biểu mẫu khi in &amp; xuất PDF, không bị dính chữ hay gộp dòng.
      </p>
    </div>
  );
}
