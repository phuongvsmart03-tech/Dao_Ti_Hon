'use client';

import React, { useState, useRef, useEffect } from 'react';
import { School, X, Save, RotateCcw, Upload, Camera } from 'lucide-react';
import { SchoolInfo } from '@/types/preschool';
import { initialSchoolInfo } from '@/lib/mock-data';
import { PRESET_LOGOS } from './LogoSelectModal';

interface SchoolConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolInfo: SchoolInfo;
  onSave: (info: SchoolInfo) => void;
  onOpenLogoPicker?: () => void;
}

export default function SchoolConfigModal({
  isOpen,
  onClose,
  schoolInfo,
  onSave,
  onOpenLogoPicker,
}: SchoolConfigModalProps) {
  const [formData, setFormData] = useState<SchoolInfo>(schoolInfo);
  const [prevSchoolInfo, setPrevSchoolInfo] = useState<SchoolInfo>(schoolInfo);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (prevSchoolInfo !== schoolInfo) {
    setPrevSchoolInfo(schoolInfo);
    setFormData(schoolInfo);
  }

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có dung lượng nhỏ hơn 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, logoUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const renderLogoPreview = () => {
    if (formData.logoUrl) {
      if (formData.logoUrl.startsWith('preset:')) {
        const found = PRESET_LOGOS.find((p) => p.id === formData.logoUrl);
        if (found) {
          const PresetIcon = found.icon;
          return (
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${found.gradient} ${found.iconColor} flex items-center justify-center shadow-xs`}
            >
              <PresetIcon className="w-6 h-6" />
            </div>
          );
        }
      }
      return (
        <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden border border-emerald-300 shadow-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={formData.logoUrl}
            alt="Logo trường"
            className="w-full h-full object-contain"
          />
        </div>
      );
    }
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 text-white flex items-center justify-center shadow-xs">
        <School className="w-6 h-6" />
      </div>
    );
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleResetDefault = () => {
    setFormData(initialSchoolInfo);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Cài đặt Thông tin Trường Mầm non</h3>
              <p className="text-xs text-slate-500">Thông tin xuất hiện trên các biểu mẫu hành chính nộp Phòng</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Logo trường mầm non */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80 flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3">
              <div className="shrink-0">{renderLogoPreview()}</div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Logo / Biểu trưng Trường
                </label>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Hiển thị trên Header và biểu mẫu in nộp Phòng GD&ĐT
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/70 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tải ảnh</span>
              </button>

              {onOpenLogoPicker && (
                <button
                  type="button"
                  onClick={onOpenLogoPicker}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Chọn mẫu</span>
                </button>
              )}

              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                  title="Xóa logo, dùng biểu tượng mặc định"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cơ quan cấp trên / Phòng GD&ĐT
            </label>
            <input
              type="text"
              required
              value={formData.department ?? ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-medium"
              placeholder="VD: PHÒNG GIÁO DỤC VÀ ĐÀO TẠO QUẬN CẦU GIẤY"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên trường Mầm non
            </label>
            <input
              type="text"
              required
              value={formData.name ?? ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-bold text-blue-900"
              placeholder="VD: TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Năm học hiện tại
              </label>
              <input
                type="text"
                required
                value={formData.academicYear ?? ''}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Năm học 2024 - 2025"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên hệ
              </label>
              <input
                type="text"
                value={formData.phone ?? ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="024 3756 8899"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Địa chỉ cơ sở mầm non
            </label>
            <input
              type="text"
              value={formData.address ?? ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Địa chỉ số trường..."
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center justify-between">
              <span>Nhân sự Ký tên Biểu mẫu &amp; Báo cáo (Tự động xuất hiện khi in)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Chuẩn Phòng GD&amp;ĐT
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Người lập biểu */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Người lập biểu / Cán bộ lập báo cáo
                </label>
                <input
                  type="text"
                  value={formData.creatorName ?? ''}
                  onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                  placeholder="VD: NGUYỄN THU HẰNG"
                />
              </div>

              {/* Tổ trưởng chuyên môn nuôi */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tổ trưởng chuyên môn Nuôi (Thực đơn / Bếp)
                </label>
                <input
                  type="text"
                  value={formData.teamLeaderNutritionName ?? ''}
                  onChange={(e) => setFormData({ ...formData, teamLeaderNutritionName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                  placeholder="VD: NGUYỄN THỊ THU HƯƠNG"
                />
              </div>

              {/* Tổ trưởng chuyên môn dạy */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tổ trưởng chuyên môn Dạy (Giáo án / Học sinh)
                </label>
                <input
                  type="text"
                  value={formData.teamLeaderEducationName ?? ''}
                  onChange={(e) => setFormData({ ...formData, teamLeaderEducationName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                  placeholder="VD: TRẦN THỊ NGỌC MAI"
                />
              </div>

              {/* Kế toán / Phụ trách tài chính */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kế toán trưởng / Phụ trách Tài chính - Lương
                </label>
                <input
                  type="text"
                  value={formData.accountantName ?? ''}
                  onChange={(e) => setFormData({ ...formData, accountantName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-900"
                  placeholder="VD: ĐỖ THỊ THANH"
                />
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide pt-2 border-t border-slate-100">
              Nhân sự Kiểm thực 3 bước &amp; Lưu mẫu thực phẩm
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Người kiểm tra (Bước 1, 2, 3)
                </label>
                <input
                  type="text"
                  value={formData.inspectorName ?? formData.medicalStaffName ?? ''}
                  onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  placeholder="VD: BS. TRẦN THỊ THU HÀ"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Người nhận hàng / Người được kiểm tra
                </label>
                <input
                  type="text"
                  value={formData.receiverName ?? formData.headChefName ?? ''}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  placeholder="VD: LÊ VĂN TÀI"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Người lưu mẫu (Cột 11 Sổ lưu hủy mẫu)
                </label>
                <input
                  type="text"
                  value={formData.sampleKeeperName ?? formData.medicalStaffName ?? ''}
                  onChange={(e) => setFormData({ ...formData, sampleKeeperName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  placeholder="VD: BS. TRẦN THỊ THU HÀ"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Người hủy mẫu (Cột 12 Sổ lưu hủy mẫu)
                </label>
                <input
                  type="text"
                  value={formData.sampleDisposerName ?? formData.headChefName ?? ''}
                  onChange={(e) => setFormData({ ...formData, sampleDisposerName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                  placeholder="VD: LÊ VĂN TÀI"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Hiệu trưởng / Chủ trường
              </label>
              <input
                type="text"
                value={formData.principalName ?? ''}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Cán bộ Y tế học đường
              </label>
              <input
                type="text"
                value={formData.medicalStaffName ?? ''}
                onChange={(e) => setFormData({ ...formData, medicalStaffName: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Bếp trưởng
              </label>
              <input
                type="text"
                value={formData.headChefName ?? ''}
                onChange={(e) => setFormData({ ...formData, headChefName: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục mặc định
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Lưu cài đặt
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
