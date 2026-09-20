'use client';

import React, { useState } from 'react';
import {
  Settings,
  UserCheck,
  PackageCheck,
  ShieldCheck,
  Flame,
  FileSpreadsheet,
  Save,
  RotateCcw,
  Check,
  CheckCircle2,
  Printer,
  School,
  Building,
  Phone,
  Calendar,
  AlertCircle,
  HelpCircle,
  Truck,
  Store,
  Apple,
  Beef,
  Fish,
  Package,
} from 'lucide-react';
import { SchoolInfo } from '@/types/preschool';
import { initialSchoolInfo } from '@/lib/mock-data';
import { saveSchoolInfo } from '@/lib/storage';
import SignatureUploadBox from '@/components/SignatureUploadBox';

interface SettingsTabProps {
  schoolInfo: SchoolInfo;
  onSave: (updatedInfo: SchoolInfo, autoCascade?: boolean) => void;
  onOpenLogoPicker?: () => void;
}

export default function SettingsTab({
  schoolInfo,
  onSave,
  onOpenLogoPicker,
}: SettingsTabProps) {
  const [formData, setFormData] = useState<SchoolInfo>(() => ({
    ...schoolInfo,
    creatorName: schoolInfo.creatorName || 'NGUYỄN THU HẰNG',
    teamLeaderNutritionName: schoolInfo.teamLeaderNutritionName || 'NGUYỄN THỊ THU HƯƠNG',
    teamLeaderEducationName: schoolInfo.teamLeaderEducationName || 'TRẦN THỊ NGỌC MAI',
    vicePrincipalName: schoolInfo.vicePrincipalName || 'HOÀNG THỊ THU TRANG',
    accountantName: schoolInfo.accountantName || 'ĐỖ THỊ THANH',
    inspectorName: schoolInfo.inspectorName || schoolInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ',
    receiverName: schoolInfo.receiverName || schoolInfo.headChefName || 'LÊ VĂN TÀI',
    sampleKeeperName: schoolInfo.sampleKeeperName || schoolInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ',
    sampleDisposerName: schoolInfo.sampleDisposerName || schoolInfo.headChefName || 'LÊ VĂN TÀI',
    principalName: schoolInfo.principalName || 'NGUYỄN THỊ MAI HOA',
    defaultPrintOrientation: schoolInfo.defaultPrintOrientation || 'landscape',
    meatSupplierName: schoolInfo.meatSupplierName || 'Công ty CP Thực phẩm Sạch Ba Vì',
    meatSupplierAddress: schoolInfo.meatSupplierAddress || 'KCN Hòa Lạc, Ba Vì, Hà Nội - ĐT: 024.3388.9911',
    meatDelivererName: schoolInfo.meatDelivererName || 'Nguyễn Văn Tuấn',
    vegSupplierName: schoolInfo.vegSupplierName || 'HTX Nông nghiệp An Toàn Đông Anh',
    vegSupplierAddress: schoolInfo.vegSupplierAddress || 'Đông Anh, Hà Nội - ĐT: 0988.123.456',
    vegDelivererName: schoolInfo.vegDelivererName || 'Vũ Đức Thịnh',
    seafoodSupplierName: schoolInfo.seafoodSupplierName || 'HTX Thủy sản Ứng Hòa',
    seafoodSupplierAddress: schoolInfo.seafoodSupplierAddress || 'Ứng Hòa, Hà Nội - ĐT: 0912.345.678',
    seafoodDelivererName: schoolInfo.seafoodDelivererName || 'Nguyễn Văn Lâm',
    dryProducerName: schoolInfo.dryProducerName || 'Nhà máy NS Miền Bắc',
    dryProducerAddress: schoolInfo.dryProducerAddress || 'KCN Tiên Sơn, Bắc Ninh',
    drySupplierName: schoolInfo.drySupplierName || 'Đại lý Bách Hóa Cầu Giấy',
    drySupplierAddress: schoolInfo.drySupplierAddress || 'Số 28 Cầu Giấy, Hà Nội - ĐT: 024.3768.1234',
    dryDelivererName: schoolInfo.dryDelivererName || 'Trần Văn Bình',
  }));

  const [autoCascade, setAutoCascade] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [prevSchoolInfo, setPrevSchoolInfo] = useState(schoolInfo);

  if (schoolInfo !== prevSchoolInfo) {
    setPrevSchoolInfo(schoolInfo);
    setFormData((prev) => ({
      ...prev,
      ...schoolInfo,
    }));
  }

  const handleUpdateSignature = (field: keyof SchoolInfo, dataUrl: string) => {
    const updated = { ...formData, [field]: dataUrl };

    // Auto-link signature to other roles if the same staff name is assigned
    const nameKey = field.replace('Signature', 'Name') as keyof SchoolInfo;
    const currentName = (updated[nameKey] as string)?.trim().toLowerCase();
    if (currentName) {
      const allRoles = [
        'creator',
        'teamLeaderNutrition',
        'teamLeaderEducation',
        'accountant',
        'inspector',
        'receiver',
        'sampleKeeper',
        'sampleDisposer',
        'principal',
      ] as const;
      for (const r of allRoles) {
        const rName = (updated[`${r}Name` as keyof SchoolInfo] as string)?.trim().toLowerCase();
        const rSigKey = `${r}Signature` as keyof SchoolInfo;
        if (rName && rName === currentName && !updated[rSigKey]) {
          (updated as any)[rSigKey] = dataUrl;
        }
      }
    }

    setFormData(updated);
    onSave(updated, autoCascade);
    saveSchoolInfo(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleRemoveSignature = (field: keyof SchoolInfo) => {
    const updated = { ...formData, [field]: '' };
    setFormData(updated);
    onSave(updated, autoCascade);
    saveSchoolInfo(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleNameBlur = () => {
    onSave(formData, autoCascade);
    saveSchoolInfo(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, autoCascade);
    saveSchoolInfo(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetToInitial = () => {
    if (confirm('Bạn có chắc muốn khôi phục về cấu hình mẫu mặc định?')) {
      setFormData(initialSchoolInfo);
      onSave(initialSchoolInfo, true);
      saveSchoolInfo(initialSchoolInfo);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Cấu hình Ký tên &amp; In ấn Phòng GD&amp;ĐT
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Tự động điền biểu mẫu
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Thiết lập tên người kiểm tra, người nhận hàng, chữ ký số mẫu và tự động chèn vào hồ sơ in.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-lg animate-fade-in flex items-center gap-1.5 shadow-xs">
              <Check className="w-4 h-4 text-emerald-600" />
              Đã lưu cấu hình &amp; chữ ký!
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              onSave(formData, autoCascade);
              saveSchoolInfo(formData);
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu &amp; Cập Nhật Chữ Ký
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* KHỐI 1: CẤU HÌNH NHÂN SỰ KÝ TÊN BIỂU MẪU (Theo yêu cầu Phòng GD&ĐT) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                1. Danh tính Nhân sự Ký tên &amp; Trách nhiệm (Tự động điền)
              </h3>
              <p className="text-xs text-slate-500">
                Sau khi nhập ở đây, các chữ ký ở Bước 1, Bước 2, Bước 3 và Sổ lưu hủy mẫu sẽ tự động hiển thị chính xác.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Người lập biểu */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  Người lập biểu / Cán bộ lập báo cáo
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Người lập biểu
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.creatorName || ''}
                onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-900"
                placeholder="VD: NGUYỄN THU HẰNG"
              />
              <p className="text-[11px] text-slate-500">
                Xuất hiện ở vị trí <strong>NGƯỜI LẬP BIỂU</strong> trên tất cả biểu mẫu in chuẩn Phòng GD&amp;ĐT (Cột trái).
              </p>
              <SignatureUploadBox
                roleTitle="Người lập biểu"
                staffName={formData.creatorName}
                signatureUrl={formData.creatorSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('creatorSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('creatorSignature')}
              />
            </div>

            {/* Tổ trưởng chuyên môn nuôi */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  Tổ trưởng Chuyên môn Nuôi (Dinh dưỡng &amp; Bếp)
                </label>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  Tổ trưởng Nuôi
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.teamLeaderNutritionName || ''}
                onChange={(e) => setFormData({ ...formData, teamLeaderNutritionName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-900"
                placeholder="VD: NGUYỄN THỊ THU HƯƠNG"
              />
              <p className="text-[11px] text-slate-500">
                Xuất hiện ở vị trí <strong>TỔ TRƯỞNG CHUYÊN MÔN NUÔI</strong> khi in Thực đơn, Bếp ăn và Dinh dưỡng.
              </p>
              <SignatureUploadBox
                roleTitle="Tổ trưởng Nuôi"
                staffName={formData.teamLeaderNutritionName}
                signatureUrl={formData.teamLeaderNutritionSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('teamLeaderNutritionSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('teamLeaderNutritionSignature')}
              />
            </div>

            {/* Tổ trưởng chuyên môn dạy */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Tổ trưởng Chuyên môn Dạy (Giáo dục &amp; Học sinh)
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                  Tổ trưởng Dạy
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.teamLeaderEducationName || ''}
                onChange={(e) => setFormData({ ...formData, teamLeaderEducationName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-900"
                placeholder="VD: TRẦN THỊ NGỌC MAI"
              />
              <p className="text-[11px] text-slate-500">
                Xuất hiện ở vị trí <strong>TỔ TRƯỞNG CHUYÊN MÔN DẠY</strong> khi in Giáo án, Sổ theo dõi trẻ em &amp; Sức khỏe.
              </p>
              <SignatureUploadBox
                roleTitle="Tổ trưởng Dạy"
                staffName={formData.teamLeaderEducationName}
                signatureUrl={formData.teamLeaderEducationSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('teamLeaderEducationSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('teamLeaderEducationSignature')}
              />
            </div>

            {/* Kế toán / Phụ trách tài chính */}
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  Kế toán trưởng / Phụ trách Tài chính &amp; Lương
                </label>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Kế toán trưởng
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.accountantName || ''}
                onChange={(e) => setFormData({ ...formData, accountantName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-900"
                placeholder="VD: ĐỖ THỊ THANH"
              />
              <p className="text-[11px] text-slate-500">
                Xuất hiện ở vị trí <strong>KẾ TOÁN TRƯỞNG</strong> khi in Bảng lương, Phiếu lương và Sổ quỹ Thu - Chi.
              </p>
              <SignatureUploadBox
                roleTitle="Kế toán trưởng"
                staffName={formData.accountantName}
                signatureUrl={formData.accountantSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('accountantSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('accountantSignature')}
              />
            </div>

            {/* Người kiểm tra */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Người kiểm tra (Bước 1, 2, 3)
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Cán bộ Y tế / Kiểm tra
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.inspectorName || ''}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-800"
                placeholder="VD: BS. TRẦN THỊ THU HÀ"
              />
              <p className="text-[11px] text-slate-500">
                Xuất hiện ở vị trí <strong>Người kiểm tra</strong> tại bảng kiểm thực Bước 1 (Tươi sống &amp; Khô), Bước 2 và Bước 3.
              </p>
              <SignatureUploadBox
                roleTitle="Người kiểm tra"
                staffName={formData.inspectorName}
                signatureUrl={formData.inspectorSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('inspectorSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('inspectorSignature')}
              />
            </div>

            {/* Người nhận hàng */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-blue-600" />
                  Người nhận hàng / Người được kiểm tra
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                  Bếp trưởng / Tiếp nhận
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.receiverName || ''}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-800"
                placeholder="VD: LÊ VĂN TÀI"
              />
              <p className="text-[11px] text-slate-500">
                Xuất hiện ở vị trí <strong>Người nhận hàng</strong> (Bước 1) và <strong>Người được kiểm tra</strong> (Bước 2, Bước 3).
              </p>
              <SignatureUploadBox
                roleTitle="Người nhận hàng"
                staffName={formData.receiverName}
                signatureUrl={formData.receiverSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('receiverSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('receiverSignature')}
              />
            </div>

            {/* Người lưu mẫu */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                  Người lưu mẫu (Sổ lưu hủy mẫu 24h)
                </label>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
                  Cán bộ Lưu mẫu
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.sampleKeeperName || ''}
                onChange={(e) => setFormData({ ...formData, sampleKeeperName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-800"
                placeholder="VD: BS. TRẦN THỊ THU HÀ"
              />
              <p className="text-[11px] text-slate-500">
                Tự động điền vào Cột (11) <strong>Người lưu mẫu (ký, ghi rõ họ tên)</strong> trong Sổ lưu &amp; hủy mẫu thức ăn 24 giờ.
              </p>
              <SignatureUploadBox
                roleTitle="Người lưu mẫu"
                staffName={formData.sampleKeeperName}
                signatureUrl={formData.sampleKeeperSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('sampleKeeperSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('sampleKeeperSignature')}
              />
            </div>

            {/* Người hủy mẫu */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Người hủy mẫu (Sổ lưu hủy mẫu 24h)
                </label>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  Bếp trưởng / Tiêu hủy
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.sampleDisposerName || ''}
                onChange={(e) => setFormData({ ...formData, sampleDisposerName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-800"
                placeholder="VD: LÊ VĂN TÀI"
              />
              <p className="text-[11px] text-slate-500">
                Tự động điền vào Cột (12) <strong>Người hủy mẫu (ký, ghi rõ họ tên)</strong> trong Sổ lưu &amp; hủy mẫu thức ăn 24 giờ.
              </p>
              <SignatureUploadBox
                roleTitle="Người hủy mẫu"
                staffName={formData.sampleDisposerName}
                signatureUrl={formData.sampleDisposerSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('sampleDisposerSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('sampleDisposerSignature')}
              />
            </div>

            {/* Hiệu trưởng / Đại diện BGH */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  Hiệu trưởng / Đại diện Ban Giám hiệu
                </label>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Lãnh đạo đơn vị
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.principalName || ''}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-800"
                placeholder="VD: NGUYỄN THỊ MAI HOA"
              />
              <p className="text-[11px] text-slate-500">
                Xuất hiện ở vị trí <strong>Hiệu trưởng (Ký, đóng dấu)</strong> trên các báo cáo tổng hợp hành chính nộp Phòng GD&amp;ĐT.
              </p>
              <SignatureUploadBox
                roleTitle="Hiệu trưởng"
                staffName={formData.principalName}
                signatureUrl={formData.principalSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('principalSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('principalSignature')}
              />
            </div>
          </div>
        </div>

        {/* KHỐI 2: CẤU HÌNH CƠ SỞ & NHÀ CUNG CẤP THỰC PHẨM ĐỊA PHƯƠNG */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-700 border border-orange-200">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                2. Cấu hình Cơ sở &amp; Nhà cung cấp Thực phẩm Địa phương
              </h3>
              <p className="text-xs text-slate-500">
                Điền thông tin nhà cung cấp tại địa bàn để khi in ấn Sổ Bước 1 (Phần I &amp; Phần II) sẽ tự động khớp đúng với cơ sở tại địa phương.
              </p>
            </div>
          </div>

          {/* Phần I: Thực phẩm tươi sống */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-900 tracking-wider bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <Truck className="w-4 h-4 text-emerald-700" />
              I. Thực phẩm tươi sống, đông lạnh: Thịt, cá, gia cầm, rau, củ, quả...
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="md:col-span-3 font-semibold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                <Beef className="w-4 h-4 text-red-600" />
                1.1. Cơ sở cung cấp Thịt tươi sống &amp; Gia cầm (Lợn, Bò, Gà...)
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên cơ sở cung cấp (Cột 6)
                </label>
                <input
                  type="text"
                  value={formData.meatSupplierName || ''}
                  onChange={(e) => setFormData({ ...formData, meatSupplierName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Công ty CP Thực phẩm Sạch Ba Vì"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Địa chỉ &amp; Điện thoại (Cột 7)
                </label>
                <input
                  type="text"
                  value={formData.meatSupplierAddress || ''}
                  onChange={(e) => setFormData({ ...formData, meatSupplierAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: KCN Hòa Lạc, Ba Vì, Hà Nội - ĐT: 024.3388.9911"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên người giao hàng (Cột 8)
                </label>
                <input
                  type="text"
                  value={formData.meatDelivererName || ''}
                  onChange={(e) => setFormData({ ...formData, meatDelivererName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Nguyễn Văn Tuấn"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="md:col-span-3 font-semibold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                <Apple className="w-4 h-4 text-emerald-600" />
                1.2. Cơ sở cung cấp Rau, Củ, Quả &amp; Nấm tươi
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên cơ sở cung cấp (Cột 6)
                </label>
                <input
                  type="text"
                  value={formData.vegSupplierName || ''}
                  onChange={(e) => setFormData({ ...formData, vegSupplierName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: HTX Nông nghiệp An Toàn Đông Anh"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Địa chỉ &amp; Điện thoại (Cột 7)
                </label>
                <input
                  type="text"
                  value={formData.vegSupplierAddress || ''}
                  onChange={(e) => setFormData({ ...formData, vegSupplierAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Đông Anh, Hà Nội - ĐT: 0988.123.456"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên người giao hàng (Cột 8)
                </label>
                <input
                  type="text"
                  value={formData.vegDelivererName || ''}
                  onChange={(e) => setFormData({ ...formData, vegDelivererName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Vũ Đức Thịnh"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="md:col-span-3 font-semibold text-xs text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                <Fish className="w-4 h-4 text-sky-600" />
                1.3. Cơ sở cung cấp Thủy sản &amp; Trứng gia cầm
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên cơ sở cung cấp (Cột 6)
                </label>
                <input
                  type="text"
                  value={formData.seafoodSupplierName || ''}
                  onChange={(e) => setFormData({ ...formData, seafoodSupplierName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: HTX Thủy sản Ứng Hòa"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Địa chỉ &amp; Điện thoại (Cột 7)
                </label>
                <input
                  type="text"
                  value={formData.seafoodSupplierAddress || ''}
                  onChange={(e) => setFormData({ ...formData, seafoodSupplierAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Ứng Hòa, Hà Nội - ĐT: 0912.345.678"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên người giao hàng (Cột 8)
                </label>
                <input
                  type="text"
                  value={formData.seafoodDelivererName || ''}
                  onChange={(e) => setFormData({ ...formData, seafoodDelivererName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Nguyễn Văn Lâm"
                />
              </div>
            </div>
          </div>

          {/* Phần II: Thực phẩm khô & bao gói sẵn */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-900 tracking-wider bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <Package className="w-4 h-4 text-amber-700" />
              II. Thực phẩm khô, gia vị, dầu ăn, bao gói sẵn, phụ gia thực phẩm
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên cơ sở sản xuất (Cột 3)
                </label>
                <input
                  type="text"
                  value={formData.dryProducerName || ''}
                  onChange={(e) => setFormData({ ...formData, dryProducerName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Nhà máy NS Miền Bắc"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Địa chỉ cơ sở sản xuất (Cột 4)
                </label>
                <input
                  type="text"
                  value={formData.dryProducerAddress || ''}
                  onChange={(e) => setFormData({ ...formData, dryProducerAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: KCN Tiên Sơn, Bắc Ninh"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên cơ sở / Đại lý cung cấp (Cột 8)
                </label>
                <input
                  type="text"
                  value={formData.drySupplierName || ''}
                  onChange={(e) => setFormData({ ...formData, drySupplierName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Đại lý Bách Hóa Cầu Giấy"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Địa chỉ &amp; Điện thoại nơi cung cấp (Cột 10)
                </label>
                <input
                  type="text"
                  value={formData.drySupplierAddress || ''}
                  onChange={(e) => setFormData({ ...formData, drySupplierAddress: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Số 28 Cầu Giấy, Hà Nội - ĐT: 024.3768.1234"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Tên người giao hàng đồ khô (Cột 9)
                </label>
                <input
                  type="text"
                  value={formData.dryDelivererName || ''}
                  onChange={(e) => setFormData({ ...formData, dryDelivererName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="VD: Trần Văn Bình"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 3: CẤU HÌNH KHỔ IN & QUY CHUẨN IN ẤN (Khổ ngang A4 mặc định) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                3. Chế độ Khổ in Biểu mẫu (A4 Ngang / A4 Dọc)
              </h3>
              <p className="text-xs text-slate-500">
                Chuyển đổi linh hoạt giữa in Khổ Ngang (Landscape) và Khổ Dọc (Portrait) theo yêu cầu thanh tra Phòng GD&amp;ĐT.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                formData.defaultPrintOrientation === 'landscape'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="printOrientation"
                value="landscape"
                checked={formData.defaultPrintOrientation === 'landscape'}
                onChange={() => setFormData({ ...formData, defaultPrintOrientation: 'landscape' })}
                className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Khổ Ngang A4 (Landscape)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                    Khuyến nghị &amp; Chuẩn Phòng GD
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tối ưu chiều rộng cho bảng biểu nhiều cột (12-16 cột): Bước 1, Bước 2, Bước 3 và Bảng tính khẩu phần ăn không bị co chữ.
                </p>
              </div>
            </label>

            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                formData.defaultPrintOrientation === 'portrait'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="printOrientation"
                value="portrait"
                checked={formData.defaultPrintOrientation === 'portrait'}
                onChange={() => setFormData({ ...formData, defaultPrintOrientation: 'portrait' })}
                className="mt-1 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Khổ Dọc A4 (Portrait)</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Định dạng khổ dọc truyền thống cho hồ sơ văn bản thông thường.
                </p>
              </div>
            </label>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Lưu ý về quy chuẩn Phòng GD&amp;ĐT:</strong> Dưới chân bảng thực đơn (Khẩu phần ăn), hệ thống tuân thủ nghiêm ngặt theo đúng mẫu gốc: <strong>không chèn dòng chữ Hiệu trưởng duyệt</strong> mà để nguyên chuẩn theo phôi của Phòng.
            </div>
          </div>
        </div>

        {/* KHỐI 4: THÔNG TIN CƠ BẢN TRƯỜNG MẦM NON & PHÒNG GD */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                4. Thông tin Đơn vị &amp; Cơ quan Quản lý
              </h3>
              <p className="text-xs text-slate-500">
                Hiển thị trên tiêu ngữ, đầu trang biểu mẫu thanh tra.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cơ quan cấp trên / Phòng GD&amp;ĐT
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-900"
                placeholder="VD: TRƯỜNG MẦM NON HOA HƯỚNG DƯƠNG"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Năm học hiện tại
              </label>
              <input
                type="text"
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Năm học 2024 - 2025"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên hệ
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="024 3756 8899"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ trường mầm non
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Số 18 Phố Nguyễn Phong Sắc, Cầu Giấy, Hà Nội"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 5: TỰ ĐỘNG ÁP DỤNG VÀ ĐỒNG BỘ TOÀN BỘ DỮ LIỆU */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-xs">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="auto-cascade-checkbox"
              checked={autoCascade}
              onChange={(e) => setAutoCascade(e.target.checked)}
              className="mt-1 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
            />
            <div>
              <span className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tự động áp dụng và đồng bộ hóa toàn bộ dữ liệu lịch sử &amp; biểu mẫu hiện có
              </span>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Khi kích hoạt, hệ thống sẽ tự động cập nhật tên <strong>Người kiểm tra</strong>, <strong>Người nhận hàng / Chế biến</strong>, <strong>Người lưu mẫu</strong>, <strong>Người hủy mẫu</strong> và <strong>Cơ sở / Nhà cung cấp thực phẩm địa phương</strong> vào toàn bộ các dòng nhật ký trong sổ Bước 1, Bước 2, Bước 3 và Sổ lưu hủy mẫu 24h.
              </p>
            </div>
          </label>
        </div>

        {/* Nút lưu hành động */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={handleResetToInitial}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Khôi phục mặc định ban đầu
          </button>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Đã lưu &amp; đồng bộ thành công!
              </span>
            )}
            <button
              type="submit"
              id="save-school-settings-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Lưu Cấu hình &amp; Tự động áp dụng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
