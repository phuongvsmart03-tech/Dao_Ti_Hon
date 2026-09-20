'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  RotateCcw,
  Sparkles,
  School,
  Sun,
  Sprout,
  Flower2,
  Apple,
  Heart,
  BookOpen,
  Palette,
} from 'lucide-react';

interface LogoSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl?: string;
  onSaveLogo: (logoUrl: string) => void;
}

// Pre-made high quality preschool SVG badges / emblems
export const PRESET_LOGOS = [
  {
    id: 'preset:sunflower',
    name: 'Hoa Hướng Dương',
    category: 'Thiên nhiên',
    icon: Flower2,
    gradient: 'from-amber-400 via-yellow-400 to-orange-500',
    iconColor: 'text-amber-950',
    desc: 'Tươi sáng, ấm áp và rạng rỡ',
  },
  {
    id: 'preset:sun',
    name: 'Mặt Trời Ban Mai',
    category: 'Năng lượng',
    icon: Sun,
    gradient: 'from-yellow-400 to-amber-500',
    iconColor: 'text-amber-950',
    desc: 'Niềm vui và khởi đầu ngày mới',
  },
  {
    id: 'preset:school',
    name: 'Ngôi Trường Thân Yêu',
    category: 'Sư phạm',
    icon: School,
    gradient: 'from-emerald-500 to-teal-700',
    iconColor: 'text-white',
    desc: 'Biểu tượng chuẩn giáo dục mầm non',
  },
  {
    id: 'preset:sprout',
    name: 'Mầm Xanh Tuổi Thơ',
    category: 'Nuôi dưỡng',
    icon: Sprout,
    gradient: 'from-emerald-400 to-green-600',
    iconColor: 'text-white',
    desc: 'Ươm mầm những tài năng tương lai',
  },
  {
    id: 'preset:apple',
    name: 'Quả Táo Dinh Dưỡng',
    category: 'Dinh dưỡng',
    icon: Apple,
    gradient: 'from-rose-500 to-red-600',
    iconColor: 'text-white',
    desc: 'Bữa ăn ngon, đủ chất và an toàn',
  },
  {
    id: 'preset:heart',
    name: 'Trái Tim Yêu Thương',
    category: 'Chăm sóc',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    iconColor: 'text-white',
    desc: 'Tận tâm chăm sóc từng bé yêu',
  },
  {
    id: 'preset:book',
    name: 'Sách Mở Tri Thức',
    category: 'Học tập',
    icon: BookOpen,
    gradient: 'from-sky-500 to-blue-700',
    iconColor: 'text-white',
    desc: 'Khơi gợi niềm đam mê khám phá',
  },
  {
    id: 'preset:palette',
    name: 'Bảng Màu Sáng Tạo',
    category: 'Nghệ thuật',
    icon: Palette,
    gradient: 'from-violet-500 to-purple-700',
    iconColor: 'text-white',
    desc: 'Phát triển tư duy thẩm mỹ và năng khiếu',
  },
];

export default function LogoSelectModal({
  isOpen,
  onClose,
  currentLogoUrl = '',
  onSaveLogo,
}: LogoSelectModalProps) {
  const [selectedLogo, setSelectedLogo] = useState<string>(currentLogoUrl || '');
  const [urlInput, setUrlInput] = useState<string>(
    currentLogoUrl && !currentLogoUrl.startsWith('data:') && !currentLogoUrl.startsWith('preset:')
      ? currentLogoUrl
      : ''
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit ~3MB
    if (file.size > 3 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có dung lượng nhỏ hơn 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ tải lên tệp định dạng hình ảnh.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setSelectedLogo(urlInput.trim());
    }
  };

  const handleSave = () => {
    onSaveLogo(selectedLogo);
    onClose();
  };

  const handleReset = () => {
    setSelectedLogo('');
    setUrlInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold">Tùy Chọn Logo Trường Mầm Non</h3>
              <p className="text-xs text-emerald-100">
                Thay thế biểu tượng mặc định bằng ảnh logo thật của trường bạn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {/* Section 1: Upload custom image from device */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Tải ảnh logo từ máy tính / điện thoại
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-emerald-700 hover:underline">
                    Nhấn để tải ảnh logo lên
                  </span>
                  <span className="text-xs text-slate-500"> hoặc kéo thả file vào đây</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Định dạng PNG (khuyên dùng nền trong suốt), JPG, SVG hoặc WebP (Tối đa 3MB)
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Choose from Preschool Preset Emblems */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                2. Hoặc chọn Biểu trưng Mầm non có sẵn
              </label>
              <span className="text-[11px] text-slate-500 font-medium">8 mẫu thiết kế chuẩn</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_LOGOS.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = selectedLogo === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedLogo(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col items-center text-center group cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/80'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}

                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${preset.gradient} ${preset.iconColor} flex items-center justify-center shadow-xs mb-2 transition-transform group-hover:scale-105`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">{preset.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Direct URL Link */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Hoặc liên kết ảnh qua URL trực tuyến
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://truongmamnon.edu.vn/logo.png"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Live Preview of Selected Logo */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/70 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-slate-700">Xem trước trên Header:</div>
              <div className="w-12 h-12 rounded-xl bg-white p-1 border border-emerald-200 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                {selectedLogo ? (
                  selectedLogo.startsWith('preset:') ? (
                    (() => {
                      const found = PRESET_LOGOS.find((p) => p.id === selectedLogo);
                      if (found) {
                        const Icon = found.icon;
                        return (
                          <div
                            className={`w-full h-full rounded-lg bg-gradient-to-tr ${found.gradient} ${found.iconColor} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                        );
                      }
                      return <School className="w-6 h-6 text-emerald-700" />;
                    })()
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedLogo}
                      alt="Logo xem trước"
                      className="w-full h-full object-contain rounded-lg"
                      onError={() => {
                        // Fallback if URL is invalid
                        setSelectedLogo('');
                        alert('Không tải được ảnh từ đường dẫn này. Vui lòng kiểm tra lại URL.');
                      }}
                    />
                  )
                ) : (
                  <div className="w-full h-full rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center">
                    <School className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 block">
                  {selectedLogo ? 'Đã chọn logo mới' : 'Biểu tượng mặc định (Trường học)'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Logo sẽ hiển thị đồng bộ trên Header và các biểu mẫu in ấn
                </span>
              </div>
            </div>

            {selectedLogo && (
              <button
                type="button"
                onClick={handleReset}
                title="Khôi phục về biểu tượng mặc định"
                className="text-xs text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 shrink-0 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa logo</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Đóng
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Lưu & Áp dụng Logo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
