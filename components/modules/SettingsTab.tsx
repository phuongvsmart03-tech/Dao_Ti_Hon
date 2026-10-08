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
  Users,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SchoolInfo } from '@/types/preschool';
import { initialSchoolInfo } from '@/lib/mock-data';
import { saveSchoolInfo, getDefaultSettings, saveDefaultSettings, AppDefaultSettings } from '@/lib/storage';
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
    creatorName: schoolInfo.creatorName || 'THANH XUÂN',
    teamLeaderNutritionName: schoolInfo.teamLeaderNutritionName || 'HUỲNH THỊ HOA',
    teamLeaderEducationName: schoolInfo.teamLeaderEducationName || 'THANH XUÂN',
    vicePrincipalName: schoolInfo.vicePrincipalName || 'VÕ THỊ HỒNG SIM',
    accountantName: schoolInfo.accountantName || 'THANH XUÂN',
    inspectorName: schoolInfo.inspectorName || schoolInfo.medicalStaffName || 'THANH XUÂN',
    receiverName: schoolInfo.receiverName || schoolInfo.headChefName || 'HUỲNH THỊ HOA',
    sampleKeeperName: schoolInfo.sampleKeeperName || schoolInfo.medicalStaffName || 'HUỲNH THỊ HOA',
    sampleDisposerName: schoolInfo.sampleDisposerName || schoolInfo.headChefName || 'HUỲNH THỊ HOA',
    principalName: schoolInfo.principalName || 'VÕ THỊ HỒNG SIM',
    defaultPrintOrientation: schoolInfo.defaultPrintOrientation || 'landscape',
    meatSupplierName: schoolInfo.meatSupplierName || 'Đại lý Thực phẩm Sạch Liên Hương',
    meatSupplierAddress: schoolInfo.meatSupplierAddress || 'Chợ Liên Hương, Xã Liên Hương - ĐT: 0918.234.567',
    meatDelivererName: schoolInfo.meatDelivererName || 'Trần Văn Hưng',
    vegSupplierName: schoolInfo.vegSupplierName || 'Vựa Rau củ quả An Toàn Liên Hương',
    vegSupplierAddress: schoolInfo.vegSupplierAddress || 'Xã Liên Hương - ĐT: 0988.112.233',
    vegDelivererName: schoolInfo.vegDelivererName || 'Nguyễn Văn Tâm',
    seafoodSupplierName: schoolInfo.seafoodSupplierName || 'Vựa Thủy Hải Sản Tươi Sống Liên Hương',
    seafoodSupplierAddress: schoolInfo.seafoodSupplierAddress || 'Khu phố 1, Xã Liên Hương - ĐT: 0912.889.900',
    seafoodDelivererName: schoolInfo.seafoodDelivererName || 'Lê Văn Hoàng',
    dryProducerName: schoolInfo.dryProducerName || 'Nhà máy Phân phối Thực phẩm Bình Thuận',
    dryProducerAddress: schoolInfo.dryProducerAddress || 'Tuy Phong, Bình Thuận',
    drySupplierName: schoolInfo.drySupplierName || 'Cửa hàng Bách Hóa Tổng Hợp Liên Hương',
    drySupplierAddress: schoolInfo.drySupplierAddress || 'Trung tâm Xã Liên Hương - ĐT: 0252.385.1234',
    dryDelivererName: schoolInfo.dryDelivererName || 'Đặng Văn Long',
  }));

  // Cấu hình mặc định hệ thống (Sĩ số bé ăn, Tiền ăn, Giờ kiểm thực)
  const [defaultSettings, setDefaultSettingsState] = useState<AppDefaultSettings>(() => getDefaultSettings());

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
    saveDefaultSettings(defaultSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleResetToInitial = () => {
    setFormData(initialSchoolInfo);
    onSave(initialSchoolInfo, true);
    saveSchoolInfo(initialSchoolInfo);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Cấu hình Ký tên, Sĩ Số Mặc Định &amp; In ấn Phòng GD&amp;ĐT
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
                Tự động lưu &amp; Điền biểu mẫu
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Thiết lập tên người kiểm tra, số bé ăn mặc định, đơn giá tiền ăn, khung giờ kiểm thực và chữ ký số chuẩn.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-blue-900 bg-blue-100 border border-blue-300 px-3 py-1.5 rounded-lg animate-fade-in flex items-center gap-1.5 shadow-xs">
              <Check className="w-4 h-4 text-blue-700" />
              Đã lưu cấu hình &amp; cài đặt mặc định!
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              onSave(formData, autoCascade);
              saveSchoolInfo(formData);
              saveDefaultSettings(defaultSettings);
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Lưu &amp; Cập Nhật Cấu Hình
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* KHỐI 0: CẤU HÌNH MẶC ĐỊNH SĨ SỐ BÉ ĂN & TIỀN ĂN (Lưu cố định) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Cài Đặt Mặc Định Suất Ăn &amp; Khung Giờ Kiểm Thực (Tự Động Lưu)</span>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Luôn ghi nhớ
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Khi bạn chỉnh sửa hoặc lưu các giá trị ở đây, hệ thống sẽ tự động ghi nhớ làm giá trị mặc định cho mọi ngày và không bị mất khi tải lại trang.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Suất Nhà Trẻ */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Số bé Nhà Trẻ mặc định:</span>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 py-0.5 rounded">
                  Suất NT
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={defaultSettings.nurseryCount}
                  onChange={(e) =>
                    setDefaultSettingsState({
                      ...defaultSettings,
                      nurseryCount: Math.max(0, parseInt(e.target.value, 10) || 0),
                    })
                  }
                  className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <span className="absolute right-2.5 top-2 text-xs text-slate-400">bé</span>
              </div>
            </div>

            {/* Suất Mẫu Giáo */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Số bé Mẫu Giáo mặc định:</span>
                <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 py-0.5 rounded">
                  Suất MG
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={defaultSettings.kindergartenCount}
                  onChange={(e) =>
                    setDefaultSettingsState({
                      ...defaultSettings,
                      kindergartenCount: Math.max(0, parseInt(e.target.value, 10) || 0),
                    })
                  }
                  className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <span className="absolute right-2.5 top-2 text-xs text-slate-400">bé</span>
              </div>
            </div>

            {/* Tiền ăn Nhà Trẻ */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Tiền ăn Nhà Trẻ:</span>
                <span className="text-[10px] text-slate-600 font-mono">đ/bé/ngày</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={defaultSettings.nurseryPrice}
                  onChange={(e) =>
                    setDefaultSettingsState({
                      ...defaultSettings,
                      nurseryPrice: Math.max(0, parseInt(e.target.value, 10) || 0),
                    })
                  }
                  className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <span className="absolute right-2.5 top-2 text-xs text-slate-400">đ</span>
              </div>
            </div>

            {/* Tiền ăn Mẫu Giáo */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Tiền ăn Mẫu Giáo:</span>
                <span className="text-[10px] text-slate-600 font-mono">đ/bé/ngày</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={defaultSettings.kindergartenPrice}
                  onChange={(e) =>
                    setDefaultSettingsState({
                      ...defaultSettings,
                      kindergartenPrice: Math.max(0, parseInt(e.target.value, 10) || 0),
                    })
                  }
                  className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <span className="absolute right-2.5 top-2 text-xs text-slate-400">đ</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Giờ nhận hàng (Bước 1):
              </label>
              <input
                type="time"
                value={defaultSettings.step1Time}
                onChange={(e) =>
                  setDefaultSettingsState({ ...defaultSettings, step1Time: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Giờ chế biến (Bước 2):
              </label>
              <input
                type="time"
                value={defaultSettings.step2Time}
                onChange={(e) =>
                  setDefaultSettingsState({ ...defaultSettings, step2Time: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Giờ chia ăn / nếm (Bước 3):
              </label>
              <input
                type="time"
                value={defaultSettings.step3Time}
                onChange={(e) =>
                  setDefaultSettingsState({ ...defaultSettings, step3Time: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Giờ lưu mẫu 24h:
              </label>
              <input
                type="time"
                value={defaultSettings.sampleTime}
                onChange={(e) =>
                  setDefaultSettingsState({ ...defaultSettings, sampleTime: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Cấu hình ngày học trong tuần & Nhiệt độ lưu mẫu thức ăn (Chuyển từ các nút mặc định vào đây) */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-xl space-y-3 mt-3">
            <div className="text-xs font-bold text-amber-950 uppercase tracking-wide flex items-center justify-between">
              <span>Cấu hình Ngày học trong tuần &amp; Nhiệt độ lưu mẫu thức ăn</span>
              <span className="text-[10.5px] text-amber-800 font-semibold lowercase">áp dụng toàn hệ thống</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Nhiệt độ lưu mẫu thức ăn (Chuẩn QĐ 1246):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.sampleStorageTemp ?? '5°C'}
                    onChange={(e) => setFormData({ ...formData, sampleStorageTemp: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-bold text-blue-900 bg-white"
                    placeholder="VD: 5°C"
                  />
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sampleStorageTemp: '5°C' })}
                      className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      title="Nhiệt độ tủ mát chuẩn theo yêu cầu khách hàng"
                    >
                      5°C
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, sampleStorageTemp: '-18°C' })}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      title="Tủ đông"
                    >
                      -18°C
                    </button>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Yêu cầu của khách hàng: Cho phép chỉnh nhiệt độ lưu mẫu thành <strong>5°C</strong> (tự động cập nhật vào toàn bộ hồ sơ kiểm thực).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Ngày học trong tuần mặc định của trường:
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <label className={`flex-1 inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    formData.learnSaturday
                      ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={!!formData.learnSaturday}
                      onChange={(e) => setFormData({ ...formData, learnSaturday: e.target.checked })}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Học Thứ 7 (Bán trú T7)</span>
                  </label>

                  <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    formData.learnSunday
                      ? 'bg-rose-100/90 border-rose-300 text-rose-950 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    <input
                      type="checkbox"
                      checked={!!formData.learnSunday}
                      onChange={(e) => setFormData({ ...formData, learnSunday: e.target.checked })}
                      className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Chủ Nhật</span>
                  </label>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Mặc định áp dụng khi mở trích xuất hồ sơ kiểm thực theo tuần và theo tháng.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 1: CẤU HÌNH NHÂN SỰ KÝ TÊN BIỂU MẪU (Theo yêu cầu Phòng GD&ĐT) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
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
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Người lập biểu / Cán bộ lập báo cáo
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                  Người lập biểu
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.creatorName || ''}
                onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: THANH XUÂN"
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: HUỲNH THỊ HOA"
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: THANH XUÂN"
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
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  Kế toán trưởng / Phụ trách Tài chính &amp; Lương
                </label>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                  Kế toán trưởng
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.accountantName || ''}
                onChange={(e) => setFormData({ ...formData, accountantName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: THANH XUÂN"
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
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Người kiểm tra (Bước 1, 2, 3)
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                  Kiểm tra VSATTP
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.inspectorName || ''}
                onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: THANH XUÂN"
              />
              <p className="text-[11px] text-slate-500">
                Ký ở cột <strong>NGƯỜI KIỂM TRA</strong> trong Sổ Kiểm thực 3 bước.
              </p>
              <SignatureUploadBox
                roleTitle="Người kiểm tra"
                staffName={formData.inspectorName}
                signatureUrl={formData.inspectorSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('inspectorSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('inspectorSignature')}
              />
            </div>

            {/* Người giao/nhận hàng */}
            <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-blue-600" />
                  Người nhận hàng &amp; Chế biến (Bếp trưởng)
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                  Giao nhận / Nấu
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.receiverName || ''}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: HUỲNH THỊ HOA"
              />
              <p className="text-[11px] text-slate-500">
                Ký ở cột <strong>NGƯỜI GIAO NHẬN / BẾP TRƯỞNG</strong> trong Sổ Bước 1 và Bước 2.
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
                  <Flame className="w-4 h-4 text-amber-600" />
                  Người lấy mẫu &amp; Niêm phong (Lưu mẫu 24h)
                </label>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  Lưu mẫu
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.sampleKeeperName || ''}
                onChange={(e) => setFormData({ ...formData, sampleKeeperName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: HUỲNH THỊ HOA"
              />
              <p className="text-[11px] text-slate-500">
                Ký ở cột <strong>NGƯỜI LẤY MẪU</strong> trong Sổ theo dõi lưu &amp; hủy mẫu thức ăn.
              </p>
              <SignatureUploadBox
                roleTitle="Người lấy mẫu"
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
                  <FileSpreadsheet className="w-4 h-4 text-rose-600" />
                  Người hủy mẫu &amp; Ký xác nhận sau 24h
                </label>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                  Hủy mẫu
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.sampleDisposerName || ''}
                onChange={(e) => setFormData({ ...formData, sampleDisposerName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-900"
                placeholder="VD: HUỲNH THỊ HOA"
              />
              <p className="text-[11px] text-slate-500">
                Ký ở cột <strong>NGƯỜI HỦY MẪU</strong> sau 24 giờ lưu trữ đúng quy trình.
              </p>
              <SignatureUploadBox
                roleTitle="Người hủy mẫu"
                staffName={formData.sampleDisposerName}
                signatureUrl={formData.sampleDisposerSignature}
                onSaveSignature={(dataUrl) => handleUpdateSignature('sampleDisposerSignature', dataUrl)}
                onRemoveSignature={() => handleRemoveSignature('sampleDisposerSignature')}
              />
            </div>

            {/* Hiệu trưởng */}
            <div className="md:col-span-2 p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-blue-700" />
                  Hiệu trưởng / Đại diện cơ sở Mầm non
                </label>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2.5 py-0.5 rounded-full">
                  Thủ trưởng đơn vị
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.principalName || ''}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                onBlur={handleNameBlur}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-bold text-slate-900"
                placeholder="VD: VÕ THỊ HỒNG SIM"
              />
              <p className="text-[11px] text-slate-500">
                Ký duyệt ở phần <strong>HIỆU TRƯỞNG / THỦ TRƯỞNG ĐƠN VỊ</strong> trên các biểu mẫu báo cáo tổng hợp.
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
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-950 tracking-wider bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              <Truck className="w-4 h-4 text-blue-700" />
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Đại lý Thực phẩm Sạch Liên Hương"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Chợ Liên Hương, Xã Liên Hương - ĐT: 0918.234.567"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Trần Văn Hưng"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Vựa Rau củ quả An Toàn Liên Hương"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Xã Liên Hương - ĐT: 0988.112.233"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Nguyễn Văn Tâm"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Vựa Thủy Hải Sản Tươi Sống Liên Hương"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Khu phố 1, Xã Liên Hương - ĐT: 0912.889.900"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Lê Văn Hoàng"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Nhà máy Phân phối Thực phẩm Bình Thuận"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Tuy Phong, Bình Thuận"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Cửa hàng Bách Hóa Tổng Hợp Liên Hương"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Trung tâm Xã Liên Hương - ĐT: 0252.385.1234"
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
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="VD: Đặng Văn Long"
                />
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 3: CẤU HÌNH KHỔ IN & QUY CHUẨN IN ẤN (Khổ ngang A4 mặc định) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
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
                  ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="printOrientation"
                value="landscape"
                checked={formData.defaultPrintOrientation === 'landscape'}
                onChange={() => setFormData({ ...formData, defaultPrintOrientation: 'landscape' })}
                className="mt-1 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">Khổ Ngang A4 (Landscape)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    Khuyến nghị &amp; Chuẩn Phòng GD
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tối ưu chiều rộng cho bảng biểu nhiều cột: Bước 1, Bước 2, Bước 3 và Bảng tính khẩu phần ăn không bị co chữ.
                </p>
              </div>
            </label>

            <label
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                formData.defaultPrintOrientation === 'portrait'
                  ? 'border-blue-600 bg-blue-50/50 text-blue-950 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="printOrientation"
                value="portrait"
                checked={formData.defaultPrintOrientation === 'portrait'}
                onChange={() => setFormData({ ...formData, defaultPrintOrientation: 'portrait' })}
                className="mt-1 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                placeholder="VD: PHÒNG GIÁO DỤC VÀ ĐÀO TẠO XÃ LIÊN HƯƠNG"
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-950"
                placeholder="VD: MẦM NON TƯ THỤC ĐẢO TÍ HON"
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0913 456 789"
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
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Xã Liên Hương, Huyện Tuy Phong, Tỉnh Bình Thuận"
              />
            </div>
          </div>
        </div>

        {/* KHỐI 5: TỰ ĐỘNG ÁP DỤNG VÀ ĐỒNG BỘ TOÀN BỘ DỮ LIỆU */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl p-5 border border-blue-200 shadow-xs">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="auto-cascade-checkbox"
              checked={autoCascade}
              onChange={(e) => setAutoCascade(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <span className="font-bold text-sm text-blue-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
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
              <span className="text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-300 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Đã lưu &amp; đồng bộ thành công!
              </span>
            )}
            <button
              type="submit"
              id="save-school-settings-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
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
