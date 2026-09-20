'use client';

import React, { useRef } from 'react';
import { Printer, Download, X, FileCheck, Calendar, Users, AlertCircle, ShieldCheck } from 'lucide-react';
import { SchoolInfo } from '@/types/preschool';
import { InspectionPrintRecord } from '@/types/lightning';
import { triggerPrintDocument, openPrintBlobWindow } from '@/lib/print-helper';

interface OfficialPrintViewProps {
  records: InspectionPrintRecord[];
  schoolInfo: SchoolInfo;
  onClose: () => void;
  selectedTemplate?: 'all' | 'step1_raw' | 'step1_dry' | 'step2' | 'step3' | 'samples' | 'menu_ration';
}

export default function OfficialPrintView({
  records,
  schoolInfo,
  onClose,
  selectedTemplate: initialTemplate = 'all',
}: OfficialPrintViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTemplate, setActiveTemplate] = React.useState<'all' | 'step1_raw' | 'step1_dry' | 'step2' | 'step3' | 'samples' | 'menu_ration'>(initialTemplate);
  const selectedTemplate = activeTemplate;
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(() => {
    return schoolInfo.defaultPrintOrientation || 'landscape';
  });

  // Chế độ in phôi trắng có dòng chấm (như mẫu gốc phôi Phòng GD) hoặc in có sẵn dữ liệu
  const [isBlankForm, setIsBlankForm] = React.useState<boolean>(false);
  const [isPrinting, setIsPrinting] = React.useState<boolean>(false);

  // Trạng thái các ô kiểm tra điều kiện vệ sinh Bước 2 & Bước 3
  // Mặc định: để ô trống (empty) đúng 100% như phôi gốc có khung đỏ của Phòng Giáo Dục trong ảnh!
  const [step2Boxes, setStep2Boxes] = React.useState({
    staff: false,
    staffBad: false,
    equip: false,
    equipBad: false,
    area: false,
    areaBad: false,
  });

  const [step3Boxes, setStep3Boxes] = React.useState({
    tools: false,
    toolsBad: false,
  });

  const toggleStep2Box = (key: keyof typeof step2Boxes) => {
    setStep2Boxes((prev) => ({
      ...prev,
      [key]: !prev[key],
      ...(key === 'staff' && !prev.staff ? { staffBad: false } : {}),
      ...(key === 'staffBad' && !prev.staffBad ? { staff: false } : {}),
      ...(key === 'equip' && !prev.equip ? { equipBad: false } : {}),
      ...(key === 'equipBad' && !prev.equipBad ? { equip: false } : {}),
      ...(key === 'area' && !prev.area ? { areaBad: false } : {}),
      ...(key === 'areaBad' && !prev.areaBad ? { area: false } : {}),
    }));
  };

  const toggleStep3Box = (key: keyof typeof step3Boxes) => {
    setStep3Boxes((prev) => ({
      ...prev,
      [key]: !prev[key],
      ...(key === 'tools' && !prev.tools ? { toolsBad: false } : {}),
      ...(key === 'toolsBad' && !prev.toolsBad ? { tools: false } : {}),
    }));
  };

  const isAllPassedChecked =
    step2Boxes.staff && step2Boxes.equip && step2Boxes.area && step3Boxes.tools;

  const handleToggleCheckMode = () => {
    if (isAllPassedChecked) {
      setStep2Boxes({
        staff: false,
        staffBad: false,
        equip: false,
        equipBad: false,
        area: false,
        areaBad: false,
      });
      setStep3Boxes({
        tools: false,
        toolsBad: false,
      });
    } else {
      setStep2Boxes({
        staff: true,
        staffBad: false,
        equip: true,
        equipBad: false,
        area: true,
        areaBad: false,
      });
      setStep3Boxes({
        tools: true,
        toolsBad: false,
      });
    }
  };

  // Lấy danh tính người kiểm tra, nhận hàng, lưu mẫu, hủy mẫu từ SchoolInfo cấu hình
  const creatorName = schoolInfo.creatorName || schoolInfo.inspectorName || schoolInfo.medicalStaffName || 'NGUYỄN THU HẰNG';
  const teamLeaderNutritionName = schoolInfo.teamLeaderNutritionName || schoolInfo.receiverName || schoolInfo.headChefName || 'NGUYỄN THỊ THU HƯƠNG';
  const principalName = schoolInfo.principalName || 'NGUYỄN THỊ MAI HOA';
  const inspectorName = schoolInfo.inspectorName || schoolInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ';
  const receiverName = schoolInfo.receiverName || schoolInfo.headChefName || 'LÊ VĂN TÀI';
  const sampleKeeperName = schoolInfo.sampleKeeperName || schoolInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ';
  const sampleDisposerName = schoolInfo.sampleDisposerName || schoolInfo.headChefName || 'LÊ VĂN TÀI';

  // Bộ phân giải chữ ký thông minh (Khớp chính xác role, khớp theo họ tên người ký, hoặc fallback role tương ứng)
  const resolveSignature = (
    role: 'creator' | 'teamLeaderNutrition' | 'teamLeaderEducation' | 'inspector' | 'receiver' | 'sampleKeeper' | 'sampleDisposer' | 'principal' | 'accountant',
    targetName?: string
  ): string | undefined => {
    // 1. Kiểm tra trực tiếp role trong schoolInfo
    const roleKey = `${role}Signature` as keyof SchoolInfo;
    const directSig = schoolInfo[roleKey] as string | undefined;
    if (directSig && directSig.trim().length > 10) return directSig;

    // 2. Kiểm tra khớp theo Họ Tên (Nếu người dùng tải chữ ký ở một ô bất kỳ trùng tên, tự động dùng cho người đó)
    const normalizedTarget = targetName?.trim().toLowerCase();
    if (normalizedTarget) {
      const candidates: [string | undefined, string | undefined][] = [
        [schoolInfo.inspectorName, schoolInfo.inspectorSignature],
        [schoolInfo.medicalStaffName, schoolInfo.medicalStaffSignature],
        [schoolInfo.receiverName, schoolInfo.receiverSignature],
        [schoolInfo.headChefName, schoolInfo.headChefSignature],
        [schoolInfo.sampleKeeperName, schoolInfo.sampleKeeperSignature],
        [schoolInfo.sampleDisposerName, schoolInfo.sampleDisposerSignature],
        [schoolInfo.creatorName, schoolInfo.creatorSignature],
        [schoolInfo.teamLeaderNutritionName, schoolInfo.teamLeaderNutritionSignature],
        [schoolInfo.teamLeaderEducationName, schoolInfo.teamLeaderEducationSignature],
        [schoolInfo.accountantName, schoolInfo.accountantSignature],
        [schoolInfo.principalName, schoolInfo.principalSignature],
      ];

      for (const [cName, cSig] of candidates) {
        if (cName && cSig && cSig.trim().length > 10) {
          const norm = cName.trim().toLowerCase();
          if (norm === normalizedTarget || norm.includes(normalizedTarget) || normalizedTarget.includes(norm)) {
            return cSig;
          }
        }
      }
    }

    // 3. Fallback logic theo cấu trúc vai trò tương đương
    if (role === 'creator') {
      return (
        schoolInfo.creatorSignature ||
        schoolInfo.inspectorSignature ||
        schoolInfo.medicalStaffSignature ||
        schoolInfo.accountantSignature
      );
    }
    if (role === 'teamLeaderNutrition') {
      return (
        schoolInfo.teamLeaderNutritionSignature ||
        schoolInfo.receiverSignature ||
        schoolInfo.headChefSignature ||
        schoolInfo.sampleDisposerSignature
      );
    }
    if (role === 'teamLeaderEducation') {
      return (
        schoolInfo.teamLeaderEducationSignature ||
        schoolInfo.vicePrincipalSignature ||
        schoolInfo.creatorSignature
      );
    }
    if (role === 'inspector') {
      return (
        schoolInfo.inspectorSignature ||
        schoolInfo.medicalStaffSignature ||
        schoolInfo.creatorSignature
      );
    }
    if (role === 'receiver') {
      return (
        schoolInfo.receiverSignature ||
        schoolInfo.headChefSignature ||
        schoolInfo.sampleDisposerSignature ||
        schoolInfo.teamLeaderNutritionSignature
      );
    }
    if (role === 'sampleKeeper') {
      return (
        schoolInfo.sampleKeeperSignature ||
        schoolInfo.inspectorSignature ||
        schoolInfo.medicalStaffSignature ||
        schoolInfo.creatorSignature
      );
    }
    if (role === 'sampleDisposer') {
      return (
        schoolInfo.sampleDisposerSignature ||
        schoolInfo.receiverSignature ||
        schoolInfo.headChefSignature ||
        schoolInfo.teamLeaderNutritionSignature
      );
    }
    if (role === 'principal') {
      return schoolInfo.principalSignature || schoolInfo.vicePrincipalSignature;
    }

    return undefined;
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => setIsPrinting(false), 2500);

    // 1. Gắn thẻ style @page động vào head
    if (typeof document !== 'undefined') {
      const styleId = 'official-print-dynamic-style';
      let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
      const isLandscape = orientation === 'landscape';
      styleTag.innerHTML = `
        @media print {
          @page {
            size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'} !important;
            margin: ${isLandscape ? '8mm 10mm 8mm 10mm' : '10mm 10mm 10mm 10mm'} !important;
          }
        }
      `;
    }

    // 2. Sử dụng isolated Blob Tab printer đảm bảo 100% hoạt động trong mọi môi trường / sandbox
    if (containerRef.current) {
      const docTitle = `HỒ SƠ KIỂM THỰC 3 BƯỚC & KHẨU PHẦN ĂN - ${schoolInfo.name || 'TRƯỜNG MẦM NON'}`;
      triggerPrintDocument(containerRef.current.innerHTML, docTitle, orientation);
      return;
    }

    try {
      window.print();
    } catch {
      handleOpenSeparateWindow();
    }
  };

  const handleOpenSeparateWindow = () => {
    if (containerRef.current) {
      const docTitle = `HỒ SƠ KIỂM THỰC 3 BƯỚC & KHẨU PHẦN ĂN - ${schoolInfo.name || 'TRƯỜNG MẦM NON'}`;
      openPrintBlobWindow(containerRef.current.innerHTML, docTitle, orientation);
    }
  };

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePrint]);

  const formatDateVietnamese = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { day: '.....', month: '.....', year: '2026' };
      return {
        day: String(d.getDate()).padStart(2, '0'),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        year: String(d.getFullYear()),
      };
    } catch {
      return { day: '.....', month: '.....', year: '2026' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Top Toolbar (Hidden on print) */}
      <div className="sticky top-0 z-30 bg-slate-900 text-white px-6 py-3 flex items-center justify-between shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              HỒ SƠ IN CHUẨN PHÒNG GD&ĐT &amp; BỘ Y TẾ (QĐ 1246/QĐ-BYT)
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                {records.length} ngày hồ sơ
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Biểu mẫu chính xác 100% theo bản gốc PDF: Bảng tính khẩu phần, Bước 1 (Tươi sống/Khô), Bước 2, Bước 3, Lưu hủy mẫu 24h
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {/* Chuyển đổi chế độ ô kiểm tra */}
          <button
            type="button"
            onClick={handleToggleCheckMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isAllPassedChecked
                ? 'bg-emerald-700/60 text-emerald-100 border-emerald-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
            title="Bấm để chuyển đổi giữa ô trống chuẩn phôi Phòng GD và tích sẵn Đạt (✓)"
          >
            <span>Ô kiểm tra:</span>
            <span className="font-bold text-white">
              {isAllPassedChecked ? 'Đã tích Đạt [✓]' : 'Ô trống [ ▭ ] (Chuẩn mẫu)'}
            </span>
          </button>

          {/* Chuyển đổi giữa in có sẵn dữ liệu và in phôi chấm viết tay */}
          <button
            type="button"
            onClick={() => setIsBlankForm((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isBlankForm
                ? 'bg-amber-600/60 text-amber-100 border-amber-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
            }`}
            title="Chuyển sang phôi chấm (ngày...tháng...năm...) hoặc in có sẵn dữ liệu"
          >
            {isBlankForm ? 'Phôi chấm viết tay (...)' : 'In có sẵn dữ liệu'}
          </button>

          {/* Bộ chọn khổ in A4 Ngang / Dọc */}
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                orientation === 'landscape'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Khổ Ngang (A4)
            </button>
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                orientation === 'portrait'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Khổ Dọc (A4)
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>In Ngay / Xuất PDF (Ctrl+P)</span>
          </button>
          <button
            type="button"
            onClick={handleOpenSeparateWindow}
            title="Mở tab in riêng biệt cách ly (Khuyên dùng khi xem trước trong iFrame)"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition-colors cursor-pointer"
          >
            <span>Mở tab in riêng</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sub-toolbar: Chọn in từng trang hoặc in toàn bộ bộ hồ sơ */}
      <div className="bg-slate-800/90 border-b border-slate-700 px-6 py-2 flex items-center gap-2 overflow-x-auto print:hidden text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap">Trang in:</span>
        <button
          type="button"
          onClick={() => setActiveTemplate('all')}
          className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTemplate === 'all'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Toàn bộ hồ sơ (Tách trang tự động)
        </button>
        <button
          type="button"
          onClick={() => setActiveTemplate('menu_ration')}
          className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTemplate === 'menu_ration'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Trang 1: Khẩu phần ăn
        </button>
        <button
          type="button"
          onClick={() => setActiveTemplate('step1_raw')}
          className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTemplate === 'step1_raw'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Trang 2: Bước 1 (I. Tươi sống - Mặt trước)
        </button>
        <button
          type="button"
          onClick={() => setActiveTemplate('step1_dry')}
          className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTemplate === 'step1_dry'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Trang 3: Bước 1 (II. Thực phẩm khô - Mặt sau)
        </button>
        <button
          type="button"
          onClick={() => setActiveTemplate('step2')}
          className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTemplate === 'step2'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Trang 4: Bước 2 (Chế biến)
        </button>
        <button
          type="button"
          onClick={() => setActiveTemplate('step3')}
          className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTemplate === 'step3'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Trang 5: Bước 3 (Trước khi ăn)
        </button>
        <button
          type="button"
          onClick={() => setActiveTemplate('samples')}
          className={`px-3 py-1 rounded-md font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeTemplate === 'samples'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          Trang 6: Sổ lưu hủy mẫu 24h
        </button>
      </div>

      {/* Main Printable Content */}
      <div
        ref={containerRef}
        className={`flex-1 mx-auto w-full bg-white text-black p-8 shadow-2xl print:shadow-none print:p-0 print:m-0 print:max-w-none text-[12px] leading-tight font-official-print font-administrative ${
          orientation === 'landscape' ? 'max-w-[297mm]' : 'max-w-[210mm]'
        }`}
        style={{ fontFamily: '"Times New Roman", "Tinos", "Liberation Serif", Times, serif' }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap');
          * {
            font-family: 'Times New Roman', 'Tinos', 'Liberation Serif', Times, serif;
          }
          .official-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 16px;
            border: 1px solid #000;
            text-align: center;
            vertical-align: middle;
            line-height: 1;
            font-size: 11px;
            font-weight: bold;
            background-color: #fff;
            color: #000;
            box-sizing: border-box;
          }
          @media print {
            body, html {
              background: white !important;
              color: black !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              font-family: 'Times New Roman', 'Tinos', 'Liberation Serif', Times, serif !important;
            }
            .official-page-break { page-break-after: always; break-after: page; }
            .print-hidden { display: none !important; }
            .hygiene-row {
              display: flex !important;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
              width: 100% !important;
              margin-bottom: 5px !important;
            }
            .hygiene-controls {
              display: inline-flex !important;
              flex-direction: row !important;
              align-items: center !important;
              flex-shrink: 0 !important;
              white-space: nowrap !important;
            }
            .hygiene-col1 {
              display: inline-flex !important;
              align-items: center !important;
              margin-right: 28px !important;
            }
            .hygiene-col2 {
              display: inline-flex !important;
              align-items: center !important;
              width: 140px !important;
              justify-content: flex-end !important;
            }
            .official-box {
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              width: 32px !important;
              height: 16px !important;
              border: 1px solid #000 !important;
              text-align: center !important;
              vertical-align: middle !important;
              line-height: 1 !important;
              font-size: 11px !important;
              font-weight: bold !important;
              background-color: #fff !important;
              color: #000 !important;
              box-sizing: border-box !important;
            }
            @page {
              size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
              margin: ${orientation === 'landscape' ? '8mm 10mm 8mm 10mm' : '10mm 10mm 10mm 10mm'};
            }
            table {
              border-collapse: collapse !important;
              width: 100% !important;
              page-break-inside: auto !important;
            }
            thead {
              display: table-header-group !important;
            }
            tfoot {
              display: table-footer-group !important;
            }
            tr, th, td {
              border: 1px solid #000 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              break-inside: avoid-page !important;
            }
            .official-signature-grid {
              display: flex !important;
              flex-direction: row !important;
              justify-content: space-between !important;
              align-items: flex-start !important;
              width: 100% !important;
              margin-top: 24px !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              break-inside: avoid-page !important;
            }
            .official-signature-col-left {
              width: 48% !important;
              text-align: left !important;
              padding-left: 16px !important;
              box-sizing: border-box !important;
              display: inline-block !important;
            }
            .official-signature-col-right {
              width: 48% !important;
              text-align: right !important;
              padding-right: 16px !important;
              box-sizing: border-box !important;
              display: inline-block !important;
            }
          }
        `}} />

        {records.map((rec, dayIdx) => {
          const dParts = formatDateVietnamese(rec.date);
          const rawItems = rec.ingredients.filter((x) => x.type === 'tuoi_song');
          const dryItems = rec.ingredients.filter((x) => x.type === 'kho');

          // Đảm bảo số lượng dòng tối thiểu theo chuẩn biểu mẫu gốc phòng GD&ĐT (ít nhất 10 dòng cho bảng LTTP)
          const MIN_LTTP_ROWS = 10;
          const emptyLttpCount = Math.max(0, MIN_LTTP_ROWS - rec.ingredients.length);
          const totalLttpRowCount = rec.ingredients.length + emptyLttpCount;

          // Đảm bảo số lượng dòng tối thiểu cho bảng tươi sống (ít nhất 8 dòng) và bảng khô (ít nhất 6 dòng)
          const MIN_RAW_ROWS = 8;
          const emptyRawCount = Math.max(0, MIN_RAW_ROWS - rawItems.length);

          const MIN_DRY_ROWS = 6;
          const emptyDryCount = Math.max(0, MIN_DRY_ROWS - dryItems.length);

          const totalRawNT = rec.ingredients.reduce((acc, x) => acc + x.rawNT, 0);
          const totalRawMG = rec.ingredients.reduce((acc, x) => acc + x.rawMG, 0);
          const totalCleanNT = rec.ingredients.reduce((acc, x) => acc + x.cleanNT, 0);
          const totalCleanMG = rec.ingredients.reduce((acc, x) => acc + x.cleanMG, 0);
          const totalMoneyNT = rec.ingredients.reduce((acc, x) => acc + x.costNT, 0);
          const totalMoneyMG = rec.ingredients.reduce((acc, x) => acc + x.costMG, 0);
          const grandTotal = totalMoneyNT + totalMoneyMG;

          return (
            <React.Fragment key={rec.date || dayIdx}>
              {/* ========================================================================= */}
              {/* TRANG 1: BẢNG TÍNH KHẨU PHẦN ĂN (CHUẨN 100% PDF TRANG 1) */}
              {/* ========================================================================= */}
              {(selectedTemplate === 'all' || selectedTemplate === 'menu_ration') && (
                <div className="official-page-break mb-10 pb-8 border-b-2 border-slate-300 print:border-none">
                  {/* Header ngày tháng */}
                  <div className="text-right italic text-[13px] mb-2">
                    Ngày {dParts.day} tháng {dParts.month} năm {dParts.year}
                  </div>

                  {/* Bảng thông tin suất ăn & đơn giá */}
                  <table className="w-full border-collapse border border-black mb-4 text-[12px]">
                    <thead>
                      <tr>
                        <th className="border border-black p-1.5 w-1/2 font-bold text-center bg-slate-50">Nhà trẻ</th>
                        <th className="border border-black p-1.5 w-1/2 font-bold text-center bg-slate-50">Mẫu giáo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 leading-relaxed">
                          - Số xuất ăn: <strong className="font-bold">{rec.nurseryCount}</strong>...............................<br />
                          - Tiền ăn: <strong className="font-bold">{rec.nurseryPrice.toLocaleString('vi-VN')} đ</strong> / xuất.<br />
                          - Tổng số tiền: <strong className="font-bold">{(rec.nurseryCount * rec.nurseryPrice).toLocaleString('vi-VN')} đ</strong>........................
                        </td>
                        <td className="border border-black p-2 leading-relaxed">
                          - Số xuất ăn: <strong className="font-bold">{rec.kindergartenCount}</strong>...............................<br />
                          - Tiền ăn: <strong className="font-bold">{rec.kindergartenPrice.toLocaleString('vi-VN')} đ</strong> / xuất.<br />
                          - Tổng số tiền: <strong className="font-bold">{(rec.kindergartenCount * rec.kindergartenPrice).toLocaleString('vi-VN')} đ</strong>........................
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Bảng Thực Đơn & Nguyên Vật Liệu */}
                  <table className="w-full border-collapse border border-black text-[11px]">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="border border-black p-1.5 w-[28%] font-bold text-center bg-slate-50">
                          THỰC ĐƠN
                        </th>
                        <th rowSpan={2} className="border border-black p-1.5 w-[22%] font-bold text-center bg-slate-50">
                          Tên LTTP
                        </th>
                        <th colSpan={2} className="border border-black p-1 font-bold text-center bg-slate-50">
                          Số lượng thô (kg)
                        </th>
                        <th colSpan={2} className="border border-black p-1 font-bold text-center bg-slate-50">
                          Số lượng làm sạch (kg)
                        </th>
                        <th rowSpan={2} className="border border-black p-1 w-[10%] font-bold text-center bg-slate-50">
                          Đơn giá (đ)
                        </th>
                        <th colSpan={2} className="border border-black p-1 font-bold text-center bg-slate-50">
                          Thành tiền (đ)
                        </th>
                      </tr>
                      <tr>
                        <th className="border border-black p-1 text-center font-semibold bg-slate-50 w-[8%]">NT</th>
                        <th className="border border-black p-1 text-center font-semibold bg-slate-50 w-[8%]">MG</th>
                        <th className="border border-black p-1 text-center font-semibold bg-slate-50 w-[8%]">NT</th>
                        <th className="border border-black p-1 text-center font-semibold bg-slate-50 w-[8%]">MG</th>
                        <th className="border border-black p-1 text-center font-semibold bg-slate-50 w-[10%]">NT</th>
                        <th className="border border-black p-1 text-center font-semibold bg-slate-50 w-[10%]">MG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dòng 1: Khung bên trái Thực Đơn Nhà Trẻ & Mẫu Giáo ghép với các dòng LTTP */}
                      {rec.ingredients.map((ing, idx) => {
                        const isFirst = idx === 0;
                        const isHalf = idx === Math.floor(totalLttpRowCount / 2);

                        return (
                          <tr key={ing.id || idx}>
                            {isFirst && (
                              <td
                                rowSpan={Math.max(1, Math.floor(totalLttpRowCount / 2))}
                                className="border border-black p-2 align-top text-[11px] leading-relaxed"
                              >
                                <div className="font-bold uppercase tracking-wider mb-1 text-center border-b border-black pb-0.5">
                                  THỰC ĐƠN NHÀ TRẺ
                                </div>
                                <div className="font-semibold">* Bữa chính:</div>
                                <div className="pl-2">
                                  + Canh: {rec.dishes.lunchSoup}<br />
                                  + Món mặn: {rec.dishes.lunchMain}
                                </div>
                                <div className="font-semibold mt-1.5">* Bữa phụ:</div>
                                <div className="pl-2">
                                  + Sáng: {rec.dishes.snackMorning || rec.dishes.breakfast || 'Sữa hạt dinh dưỡng'}<br />
                                  + Chiều: {rec.dishes.afternoonSnack || 'Bánh flan caramen + Sữa hạt'}
                                </div>
                              </td>
                            )}
                            {isHalf && (
                              <td
                                rowSpan={Math.max(1, totalLttpRowCount - Math.floor(totalLttpRowCount / 2))}
                                className="border border-black p-2 align-top text-[11px] leading-relaxed"
                              >
                                <div className="font-bold uppercase tracking-wider mb-1 text-center border-b border-black pb-0.5">
                                  THỰC ĐƠN MẪU GIÁO
                                </div>
                                <div className="font-semibold">* Bữa chính:</div>
                                <div className="pl-2">
                                  + Canh: {rec.dishes.lunchSoup}<br />
                                  + Món mặn: {rec.dishes.lunchMain}
                                </div>
                                <div className="font-semibold mt-1.5">* Bữa phụ:</div>
                                <div className="pl-2">
                                  + Sáng: {rec.dishes.snackMorning || 'Nước ép trái cây tươi'}<br />
                                  + Chiều: {rec.dishes.afternoonSnack}
                                </div>
                              </td>
                            )}

                            {/* Các cột LTTP */}
                            <td className="border border-black p-1 font-medium">{ing.name}</td>
                            <td className="border border-black p-1 text-right">{ing.rawNT.toFixed(2)}</td>
                            <td className="border border-black p-1 text-right">{ing.rawMG.toFixed(2)}</td>
                            <td className="border border-black p-1 text-right">{ing.cleanNT.toFixed(2)}</td>
                            <td className="border border-black p-1 text-right">{ing.cleanMG.toFixed(2)}</td>
                            <td className="border border-black p-1 text-right">{ing.unitPrice.toLocaleString('vi-VN')}</td>
                            <td className="border border-black p-1 text-right">{Math.round(ing.costNT).toLocaleString('vi-VN')}</td>
                            <td className="border border-black p-1 text-right">{Math.round(ing.costMG).toLocaleString('vi-VN')}</td>
                          </tr>
                        );
                      })}

                      {/* Các dòng trống LTTP bổ sung theo template biểu mẫu để đủ chiều cao chuẩn */}
                      {Array.from({ length: emptyLttpCount }).map((_, emptyIdx) => {
                        const currentVirtualIdx = rec.ingredients.length + emptyIdx;
                        const isHalf = currentVirtualIdx === Math.floor(totalLttpRowCount / 2);

                        return (
                          <tr key={`empty-lttp-${emptyIdx}`} className="h-6">
                            {isHalf && (
                              <td
                                rowSpan={Math.max(1, totalLttpRowCount - Math.floor(totalLttpRowCount / 2))}
                                className="border border-black p-2 align-top text-[11px] leading-relaxed"
                              >
                                <div className="font-bold uppercase tracking-wider mb-1 text-center border-b border-black pb-0.5">
                                  THỰC ĐƠN MẪU GIÁO
                                </div>
                                <div className="font-semibold">* Bữa chính:</div>
                                <div className="pl-2">
                                  + Canh: {rec.dishes.lunchSoup}<br />
                                  + Món mặn: {rec.dishes.lunchMain}
                                </div>
                                <div className="font-semibold mt-1.5">* Bữa phụ:</div>
                                <div className="pl-2">
                                  + Sáng: {rec.dishes.snackMorning || 'Nước ép trái cây tươi'}<br />
                                  + Chiều: {rec.dishes.afternoonSnack}
                                </div>
                              </td>
                            )}
                            <td className="border border-black p-1 text-center text-slate-300">...</td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                            <td className="border border-black p-1"></td>
                          </tr>
                        );
                      })}

                      {/* Dòng Tổng cộng */}
                      <tr className="font-bold bg-slate-100">
                        <td colSpan={2} className="border border-black p-1.5 text-center uppercase">
                          TỔNG CỘNG
                        </td>
                        <td className="border border-black p-1 text-right">{totalRawNT.toFixed(2)}</td>
                        <td className="border border-black p-1 text-right">{totalRawMG.toFixed(2)}</td>
                        <td className="border border-black p-1 text-right">{totalCleanNT.toFixed(2)}</td>
                        <td className="border border-black p-1 text-right">{totalCleanMG.toFixed(2)}</td>
                        <td className="border border-black p-1 text-center">-</td>
                        <td className="border border-black p-1 text-right">{Math.round(totalMoneyNT).toLocaleString('vi-VN')}</td>
                        <td className="border border-black p-1 text-right">{Math.round(totalMoneyMG).toLocaleString('vi-VN')}</td>
                      </tr>
                      <tr className="font-bold bg-slate-50">
                        <td colSpan={7} className="border border-black p-1.5 text-right uppercase">
                          TỔNG SỐ TIỀN THANH TOÁN (NT + MG):
                        </td>
                        <td colSpan={3} className="border border-black p-1.5 text-right text-[12px] text-red-700">
                          {Math.round(grandTotal).toLocaleString('vi-VN')} đồng
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Chữ ký 3 cột Trang 1 */}
                  <div
                    className="official-signature-grid w-full mt-6 text-[12px] flex flex-row items-start justify-between"
                    style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: '20px', pageBreakInside: 'avoid', breakInside: 'avoid' }}
                  >
                    <div style={{ width: '32%', textAlign: 'center' }}>
                      <strong>NGƯỜI LẬP BIỂU</strong><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                      >
                        {resolveSignature('creator', creatorName) ? (
                          <img src={resolveSignature('creator', creatorName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{creatorName}</div>
                    </div>
                    <div style={{ width: '32%', textAlign: 'center' }}>
                      <strong>TỔ TRƯỞNG CHUYÊN MÔN NUÔI</strong><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                      >
                        {resolveSignature('teamLeaderNutrition', teamLeaderNutritionName) ? (
                          <img src={resolveSignature('teamLeaderNutrition', teamLeaderNutritionName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{teamLeaderNutritionName}</div>
                    </div>
                    <div style={{ width: '32%', textAlign: 'center' }}>
                      <strong>HIỆU TRƯỞNG</strong><br />
                      <div className="italic text-[11px]">(Ký tên và đóng dấu)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                      >
                        {resolveSignature('principal', principalName) ? (
                          <img src={resolveSignature('principal', principalName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{principalName}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TRANG 2: KIỂM THỰC BƯỚC 1 - THỰC PHẨM TƯƠI SỐNG (PDF TRANG 2) */}
              {/* ========================================================================= */}
              {(selectedTemplate === 'all' || selectedTemplate === 'step1_raw') && (
                <div className="official-page-break mb-10 pb-8 border-b-2 border-slate-300 print:border-none">
                  <div className="text-[13px] mb-1">
                    - <strong>Thời gian kiểm tra:</strong> ngày {dParts.day} tháng {dParts.month} năm {dParts.year} (lúc 06:15 sáng)
                  </div>
                  <div className="text-[13px] mb-2">
                    - <strong>Địa điểm kiểm tra:</strong> Khu vực tiếp nhận thực phẩm trường {schoolInfo.name}
                  </div>
                  <div className="font-bold text-[13px] uppercase mb-2">
                    I. Thực phẩm tươi sống, đông lạnh: Thịt, cá, rau, củ, quả...
                  </div>

                  <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="border border-black p-1 w-[3%] text-center bg-slate-50">TT</th>
                        <th rowSpan={2} className="border border-black p-1 w-[14%] text-center bg-slate-50">Tên thực phẩm</th>
                        <th rowSpan={2} className="border border-black p-1 w-[8%] text-center bg-slate-50">Thời gian nhập (ngày, giờ)</th>
                        <th colSpan={2} className="border border-black p-0.5 text-center bg-slate-50">Khối lượng (kg/lít...)</th>
                        <th colSpan={3} className="border border-black p-0.5 text-center bg-slate-50">Nơi cung cấp</th>
                        <th rowSpan={2} className="border border-black p-1 w-[6%] text-center bg-slate-50">Chứng từ, hóa đơn</th>
                        <th rowSpan={2} className="border border-black p-1 w-[5%] text-center bg-slate-50">Giấy ĐK VS</th>
                        <th rowSpan={2} className="border border-black p-1 w-[5%] text-center bg-slate-50">Giấy kiểm dịch</th>
                        <th colSpan={2} className="border border-black p-0.5 text-center bg-slate-50">Kiểm tra cảm quan</th>
                        <th colSpan={2} className="border border-black p-0.5 text-center bg-slate-50">Xét nghiệm nhanh</th>
                        <th rowSpan={2} className="border border-black p-1 w-[9%] text-center bg-slate-50">Biện pháp xử lý/ Ghi chú</th>
                      </tr>
                      <tr>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[5%]">Thô</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[5%]">Tinh</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[12%]">Tên cơ sở</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[11%]">Địa chỉ, điện thoại</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[8%]">Tên người giao</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[4%]">Đạt</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[4%]">K.đạt</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[4%]">Đạt</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[4%]">K.đạt</th>
                      </tr>
                      <tr className="text-slate-500 font-normal italic text-[9px] text-center bg-slate-100">
                        <td className="border border-black p-0.5">(1)</td>
                        <td className="border border-black p-0.5">(2)</td>
                        <td className="border border-black p-0.5">(3)</td>
                        <td className="border border-black p-0.5">(4)</td>
                        <td className="border border-black p-0.5">(5)</td>
                        <td className="border border-black p-0.5">(6)</td>
                        <td className="border border-black p-0.5">(7)</td>
                        <td className="border border-black p-0.5">(8)</td>
                        <td className="border border-black p-0.5">(9)</td>
                        <td className="border border-black p-0.5">(10)</td>
                        <td className="border border-black p-0.5">(11)</td>
                        <td className="border border-black p-0.5">(12)</td>
                        <td className="border border-black p-0.5">(13)</td>
                        <td className="border border-black p-0.5">(14)</td>
                        <td className="border border-black p-0.5">(15)</td>
                        <td className="border border-black p-0.5">(16)</td>
                      </tr>
                    </thead>
                    <tbody>
                      {rawItems.map((item, idx) => {
                        const isMeatOrPoultry = /thịt|lợn|heo|bò|gà|vịt|ngan|chim/i.test(item.name);
                        const isFishOrSeafood = /cá|tôm|cua|lươn|mực|chả cá/i.test(item.name);
                        const isEgg = /trứng/i.test(item.name);

                        let supName = item.supplier;
                        let supAddr = item.supplierAddress || item.supplierPhone || '';
                        let delName = item.deliverer;

                        if (isMeatOrPoultry) {
                          supName = schoolInfo.meatSupplierName || supName;
                          supAddr = schoolInfo.meatSupplierAddress || supAddr;
                          delName = schoolInfo.meatDelivererName || delName;
                        } else if (isFishOrSeafood || isEgg) {
                          supName = schoolInfo.seafoodSupplierName || schoolInfo.meatSupplierName || supName;
                          supAddr = schoolInfo.seafoodSupplierAddress || schoolInfo.meatSupplierAddress || supAddr;
                          delName = schoolInfo.seafoodDelivererName || delName;
                        } else {
                          // Rau, củ, quả, nấm
                          supName = schoolInfo.vegSupplierName || supName;
                          supAddr = schoolInfo.vegSupplierAddress || supAddr;
                          delName = schoolInfo.vegDelivererName || delName;
                        }

                        const isQuarantine = isMeatOrPoultry || isFishOrSeafood;

                        return (
                          <tr key={item.id || idx}>
                            <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                            <td className="border border-black p-1 font-medium">{item.name}</td>
                            <td className="border border-black p-1 text-center">06:15 {dParts.day}/{dParts.month}</td>
                            <td className="border border-black p-1 text-right font-semibold">{(item.rawNT + item.rawMG).toFixed(2)}</td>
                            <td className="border border-black p-1 text-right">{(item.cleanNT + item.cleanMG).toFixed(2)}</td>
                            <td className="border border-black p-1 text-[10px]">{supName}</td>
                            <td className="border border-black p-1 text-[9px] leading-tight">{supAddr}</td>
                            <td className="border border-black p-1 text-[10px]">{delName}</td>
                            <td className="border border-black p-1 text-center text-[10px]">Có (HĐ {idx + 101})</td>
                            <td className="border border-black p-1 text-center text-[10px]">Đầy đủ</td>
                            <td className="border border-black p-1 text-center text-[10px]">{isQuarantine ? 'Đạt KD' : '-'}</td>
                            <td className="border border-black p-1 text-center font-bold text-emerald-700">✓</td>
                            <td className="border border-black p-1 text-center"></td>
                            <td className="border border-black p-1 text-center font-bold text-emerald-700">✓</td>
                            <td className="border border-black p-1 text-center"></td>
                            <td className="border border-black p-1 text-center text-[10px]">Nhận đủ, tươi mới</td>
                          </tr>
                        );
                      })}
                      {/* Các dòng trống bổ sung theo chuẩn template */}
                      {Array.from({ length: emptyRawCount }).map((_, emptyIdx) => (
                        <tr key={`empty-raw-${emptyIdx}`} className="h-6">
                          <td className="border border-black p-1 text-center text-slate-400">{rawItems.length + emptyIdx + 1}</td>
                          <td className="border border-black p-1 text-slate-300">...</td>
                          <td className="border border-black p-1 text-center">06:15 {dParts.day}/{dParts.month}</td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Luôn có chữ ký cho Phần I (để in 2 mặt độc lập hoặc kẹp hồ sơ) */}
                  <div className="official-signature-grid w-full mt-6 text-[12px] flex flex-row items-start justify-between" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div className="official-signature-col-left w-1/2 text-left pl-4" style={{ width: '48%', textAlign: 'left', paddingLeft: '16px' }}>
                      <strong>Người kiểm tra</strong><br />
                      Nhận xét và biện pháp xử lý: <em>Thực phẩm tươi sống đạt chất lượng, nhập kho chế biến.</em><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '4px 0' }}
                      >
                        {resolveSignature('inspector', inspectorName) ? (
                          <img src={resolveSignature('inspector', inspectorName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{inspectorName}</div>
                    </div>
                    <div className="official-signature-col-right w-1/2 text-right pr-4" style={{ width: '48%', textAlign: 'right', paddingRight: '16px' }}>
                      <strong>Người nhận hàng</strong><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '4px 0' }}
                      >
                        {resolveSignature('receiver', receiverName) ? (
                          <img src={resolveSignature('receiver', receiverName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{receiverName}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TRANG 3: KIỂM THỰC BƯỚC 1 - PHẦN II: THỰC PHẨM KHÔ, GIA VỊ, PHỤ GIA (TÁCH THÀNH TRANG RỜI ĐỂ IN 2 MẶT) */}
              {/* ========================================================================= */}
              {(selectedTemplate === 'all' || selectedTemplate === 'step1_dry') && (
                <div className="official-page-break mb-10 pb-8 border-b-2 border-slate-300 print:border-none">
                  <div className="text-[13px] mb-1">
                    - <strong>Thời gian kiểm tra:</strong> ngày {dParts.day} tháng {dParts.month} năm {dParts.year} (lúc 06:30 sáng)
                  </div>
                  <div className="text-[13px] mb-2">
                    - <strong>Địa điểm kiểm tra:</strong> Kho lưu trữ và khu vực tiếp nhận thực phẩm khô trường {schoolInfo.name}
                  </div>
                  <div className="font-bold text-[13px] uppercase mb-2">
                    II. Thực phẩm khô và thực phẩm bao gói sẵn, phụ gia thực phẩm:
                  </div>

                  <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="border border-black p-1 w-[3%] text-center bg-slate-50">TT</th>
                        <th rowSpan={2} className="border border-black p-1 w-[14%] text-center bg-slate-50">Tên thực phẩm</th>
                        <th rowSpan={2} className="border border-black p-1 w-[11%] text-center bg-slate-50">Tên cơ sở sản xuất</th>
                        <th rowSpan={2} className="border border-black p-1 w-[11%] text-center bg-slate-50">Địa chỉ sản xuất</th>
                        <th rowSpan={2} className="border border-black p-1 w-[8%] text-center bg-slate-50">Thời gian nhập (ngày, giờ)</th>
                        <th colSpan={2} className="border border-black p-0.5 text-center bg-slate-50">Khối lượng (kg/lít...)</th>
                        <th colSpan={3} className="border border-black p-0.5 text-center bg-slate-50">Nơi cung cấp</th>
                        <th rowSpan={2} className="border border-black p-1 w-[6%] text-center bg-slate-50">Hạn sử dụng</th>
                        <th rowSpan={2} className="border border-black p-1 w-[6%] text-center bg-slate-50">Điều kiện bảo quản</th>
                        <th rowSpan={2} className="border border-black p-1 w-[6%] text-center bg-slate-50">Chứng từ, hóa đơn</th>
                        <th colSpan={2} className="border border-black p-0.5 text-center bg-slate-50">Kiểm tra cảm quan</th>
                        <th rowSpan={2} className="border border-black p-1 w-[8%] text-center bg-slate-50">Biện pháp xử lý</th>
                      </tr>
                      <tr>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[4.5%]">Thô</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[4.5%]">Tinh</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[10%]">Tên cơ sở</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[7%]">Tên người giao</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[9%]">Địa chỉ, điện thoại</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[3.5%]">Đạt</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[3.5%]">K.đạt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dryItems.map((item, idx) => {
                        const prodName = schoolInfo.dryProducerName || item.producerName || 'Nhà máy NS Miền Bắc';
                        const prodAddr = schoolInfo.dryProducerAddress || item.producerAddress || 'KCN Tiên Sơn, Bắc Ninh';
                        const supName = schoolInfo.drySupplierName || item.supplier || 'Đại lý Bách Hóa Cầu Giấy';
                        const supAddr = schoolInfo.drySupplierAddress || item.supplierAddress || 'Số 28 Cầu Giấy, Hà Nội - ĐT: 024.3768.1234';
                        const delName = schoolInfo.dryDelivererName || item.deliverer || 'Trần Văn Bình';

                        return (
                          <tr key={item.id || idx}>
                            <td className="border border-black p-1 text-center font-bold">{idx + 1}</td>
                            <td className="border border-black p-1 font-medium">{item.name}</td>
                            <td className="border border-black p-1 text-[10px]">{prodName}</td>
                            <td className="border border-black p-1 text-[9px] leading-tight">{prodAddr}</td>
                            <td className="border border-black p-1 text-center">06:30 {dParts.day}/{dParts.month}</td>
                            <td className="border border-black p-1 text-right font-semibold">{(item.rawNT + item.rawMG).toFixed(2)}</td>
                            <td className="border border-black p-1 text-right">{(item.cleanNT + item.cleanMG).toFixed(2)}</td>
                            <td className="border border-black p-1 text-[10px]">{supName}</td>
                            <td className="border border-black p-1 text-[10px]">{delName}</td>
                            <td className="border border-black p-1 text-[9px] leading-tight">{supAddr}</td>
                            <td className="border border-black p-1 text-center text-[10px]">12 tháng</td>
                            <td className="border border-black p-1 text-center text-[10px]">Nhiệt độ thường khô ráo</td>
                            <td className="border border-black p-1 text-center text-[10px]">HĐ 240/BH</td>
                            <td className="border border-black p-1 text-center font-bold text-emerald-700">✓</td>
                            <td className="border border-black p-1 text-center"></td>
                            <td className="border border-black p-1 text-center text-[10px]">Đạt tiêu chuẩn</td>
                          </tr>
                        );
                      })}
                      {/* Các dòng trống bổ sung theo chuẩn template */}
                      {Array.from({ length: emptyDryCount }).map((_, emptyIdx) => (
                        <tr key={`empty-dry-${emptyIdx}`} className="h-6">
                          <td className="border border-black p-1 text-center text-slate-400">{dryItems.length + emptyIdx + 1}</td>
                          <td className="border border-black p-1 text-slate-300">...</td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1 text-center">06:30 {dParts.day}/{dParts.month}</td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                          <td className="border border-black p-1"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Ký tên */}
                  <div className="official-signature-grid w-full mt-6 text-[12px] flex flex-row items-start justify-between" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div className="official-signature-col-left w-1/2 text-left pl-4" style={{ width: '48%', textAlign: 'left', paddingLeft: '16px' }}>
                      <strong>Người kiểm tra</strong><br />
                      Nhận xét và biện pháp xử lý: <em>Bao bì nguyên vẹn, còn hạn sử dụng, bảo quản đúng quy định.</em><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '4px 0' }}
                      >
                        {resolveSignature('inspector', inspectorName) ? (
                          <img src={resolveSignature('inspector', inspectorName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{inspectorName}</div>
                    </div>
                    <div className="official-signature-col-right w-1/2 text-right pr-4" style={{ width: '48%', textAlign: 'right', paddingRight: '16px' }}>
                      <strong>Người nhận hàng</strong><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '4px 0' }}
                      >
                        {resolveSignature('receiver', receiverName) ? (
                          <img src={resolveSignature('receiver', receiverName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{receiverName}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TRANG 4: KIỂM THỰC BƯỚC 2 - QUÁ TRÌNH CHẾ BIẾN THỰC PHẨM (PDF TRANG 4) */}
              {/* ========================================================================= */}
              {(selectedTemplate === 'all' || selectedTemplate === 'step2') && (
                <div className="official-page-break mb-10 pb-8 border-b-2 border-slate-300 print:border-none">
                  <div className="text-[13px] mb-1">
                    - <strong>Thời gian kiểm tra:</strong> {isBlankForm ? 'ngày..................tháng...................năm 20..................' : `ngày ${dParts.day} tháng ${dParts.month} năm ${dParts.year}`}
                  </div>
                  <div className="text-[13px] mb-1">
                    - <strong>Địa điểm kiểm tra:</strong> {isBlankForm ? '..........................................................................................................................' : `Bếp ăn 1 chiều trường ${schoolInfo.name}`}
                  </div>
                  <div className="text-[12.5px] mb-3 leading-relaxed">
                    <div className="mb-1.5">
                      - <strong>Kiểm tra điều kiện vệ sinh:</strong> <em>(Từ thời điểm bắt đầu sơ chế, chế biến cho đến khi thức ăn được chế biến xong)</em>
                    </div>
                    <div className="pl-3 space-y-1.5 max-w-[820px]">
                      {/* Dòng 1: Người tham gia chế biến */}
                      <div className="hygiene-row flex items-center justify-between">
                        <span>+ Người tham gia chế biến: Thực hành tốt vệ sinh cá nhân</span>
                        <div className="hygiene-controls flex items-center shrink-0">
                          <div className="hygiene-col1 flex items-center mr-10">
                            <span
                              onClick={() => toggleStep2Box('staff')}
                              className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                              title="Nhấn để tích chọn (✓) hoặc để ô trống"
                            >
                              {step2Boxes.staff ? '✓' : ''}
                            </span>
                            <span className="ml-1 font-semibold text-[13px]">;</span>
                          </div>
                          <div className="hygiene-col2 flex items-center w-36 justify-end">
                            <span className="mr-2">Chưa tốt:</span>
                            <span
                              onClick={() => toggleStep2Box('staffBad')}
                              className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                              title="Nhấn để tích chọn (✓) hoặc để ô trống"
                            >
                              {step2Boxes.staffBad ? '✓' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dòng 2: Trang thiết bị dụng cụ */}
                      <div className="hygiene-row flex items-center justify-between">
                        <span>+ Trang thiết bị dụng cụ: Vệ sinh sạch sẽ và tách biệt giữa thực phẩm sống và chín</span>
                        <div className="hygiene-controls flex items-center shrink-0">
                          <div className="hygiene-col1 flex items-center mr-10">
                            <span
                              onClick={() => toggleStep2Box('equip')}
                              className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                              title="Nhấn để tích chọn (✓) hoặc để ô trống"
                            >
                              {step2Boxes.equip ? '✓' : ''}
                            </span>
                            <span className="ml-1 font-semibold text-[13px]">;</span>
                          </div>
                          <div className="hygiene-col2 flex items-center w-36 justify-end">
                            <span className="mr-2">Chưa sạch sẽ:</span>
                            <span
                              onClick={() => toggleStep2Box('equipBad')}
                              className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                              title="Nhấn để tích chọn (✓) hoặc để ô trống"
                            >
                              {step2Boxes.equipBad ? '✓' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dòng 3: Khu vực chế biến và phụ trợ */}
                      <div className="hygiene-row flex items-center justify-between">
                        <span>+ Khu vực chế biến và phụ trợ: Vệ sinh sạch sẽ</span>
                        <div className="hygiene-controls flex items-center shrink-0">
                          <div className="hygiene-col1 flex items-center mr-10">
                            <span
                              onClick={() => toggleStep2Box('area')}
                              className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                              title="Nhấn để tích chọn (✓) hoặc để ô trống"
                            >
                              {step2Boxes.area ? '✓' : ''}
                            </span>
                            <span className="ml-1 font-semibold text-[13px]">;</span>
                          </div>
                          <div className="hygiene-col2 flex items-center w-36 justify-end">
                            <span className="mr-2">Chưa sạch sẽ:</span>
                            <span
                              onClick={() => toggleStep2Box('areaBad')}
                              className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                              title="Nhấn để tích chọn (✓) hoặc để ô trống"
                            >
                              {step2Boxes.areaBad ? '✓' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-black text-[11px]">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="border border-black p-1 w-[4%] text-center bg-slate-50">TT</th>
                        <th rowSpan={2} className="border border-black p-1 w-[12%] text-center bg-slate-50">Ca/bữa ăn (bữa ăn, giờ ăn,...)</th>
                        <th rowSpan={2} className="border border-black p-1 w-[18%] text-center bg-slate-50">Tên món ăn</th>
                        <th rowSpan={2} className="border border-black p-1 w-[22%] text-center bg-slate-50">Nguyên liệu chính để chế biến (tên, SL...)</th>
                        <th rowSpan={2} className="border border-black p-1 w-[10%] text-center bg-slate-50">Số lượng/ Số suất ăn</th>
                        <th rowSpan={2} className="border border-black p-1 w-[10%] text-center bg-slate-50">Thời gian sơ chế xong (ngày, giờ)</th>
                        <th rowSpan={2} className="border border-black p-1 w-[10%] text-center bg-slate-50">Thời gian chế biến xong (ngày, giờ)</th>
                        <th colSpan={2} className="border border-black p-0.5 text-center bg-slate-50">Kiểm tra cảm quan</th>
                        <th rowSpan={2} className="border border-black p-1 w-[9%] text-center bg-slate-50">Biện pháp xử lý/ Ghi chú</th>
                      </tr>
                      <tr>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[5%]">Đạt</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[5%]">K.Đạt</th>
                      </tr>
                      <tr className="text-slate-500 font-normal italic text-[9px] text-center bg-slate-100">
                        <td className="border border-black p-0.5">(1)</td>
                        <td className="border border-black p-0.5">(2)</td>
                        <td className="border border-black p-0.5">(3)</td>
                        <td className="border border-black p-0.5">(4)</td>
                        <td className="border border-black p-0.5">(5)</td>
                        <td className="border border-black p-0.5">(6)</td>
                        <td className="border border-black p-0.5">(7)</td>
                        <td className="border border-black p-0.5">(8)</td>
                        <td className="border border-black p-0.5">(9)</td>
                        <td className="border border-black p-0.5">(10)</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">1</td>
                        <td className="border border-black p-1.5">Bữa trưa (10h30)</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.lunchMain}</td>
                        <td className="border border-black p-1.5">{rawItems[0] ? `${rawItems[0].name} (${(rawItems[0].rawNT + rawItems[0].rawMG).toFixed(1)}kg)` : 'Thịt lợn nạc sạch'}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">{rec.nurseryCount + rec.kindergartenCount} suất</td>
                        <td className="border border-black p-1.5 text-center">07:45 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">09:50 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center font-bold text-emerald-700">✓</td>
                        <td className="border border-black p-1.5 text-center"></td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Chín nhừ, màu đẹp</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">2</td>
                        <td className="border border-black p-1.5">Bữa trưa (10h30)</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.lunchSoup}</td>
                        <td className="border border-black p-1.5">{rawItems[1] ? `${rawItems[1].name} (${(rawItems[1].rawNT + rawItems[1].rawMG).toFixed(1)}kg)` : 'Rau củ sạch'}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">{rec.nurseryCount + rec.kindergartenCount} suất</td>
                        <td className="border border-black p-1.5 text-center">08:00 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">10:05 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center font-bold text-emerald-700">✓</td>
                        <td className="border border-black p-1.5 text-center"></td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Nước ngọt, rau mềm</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">3</td>
                        <td className="border border-black p-1.5">Bữa trưa (10h30)</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.lunchStaple}</td>
                        <td className="border border-black p-1.5">Gạo tám thơm Điện Biên</td>
                        <td className="border border-black p-1.5 text-center font-semibold">{rec.nurseryCount + rec.kindergartenCount} suất</td>
                        <td className="border border-black p-1.5 text-center">08:30 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">10:00 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center font-bold text-emerald-700">✓</td>
                        <td className="border border-black p-1.5 text-center"></td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Cơm dẻo ráo</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">4</td>
                        <td className="border border-black p-1.5">Bữa xế (14h15)</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.afternoonSnack}</td>
                        <td className="border border-black p-1.5">Sữa chua men sống + Bánh mềm dinh dưỡng</td>
                        <td className="border border-black p-1.5 text-center font-semibold">{rec.nurseryCount + rec.kindergartenCount} suất</td>
                        <td className="border border-black p-1.5 text-center">13:15 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">13:50 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center font-bold text-emerald-700">✓</td>
                        <td className="border border-black p-1.5 text-center"></td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Đạt chuẩn bữa xế</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Ký tên */}
                  <div className="official-signature-grid w-full mt-6 text-[12px] flex flex-row items-start justify-between" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div className="official-signature-col-left w-1/2 text-left pl-4" style={{ width: '48%', textAlign: 'left', paddingLeft: '16px' }}>
                      <strong>Người kiểm tra</strong><br />
                      Nhận xét và biện pháp xử lý: <em>Khu sơ chế sạch sẽ, thức ăn nấu chín kỹ đạt nhiệt độ &gt; 100°C.</em><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '4px 0' }}
                      >
                        {resolveSignature('inspector', inspectorName) ? (
                          <img src={resolveSignature('inspector', inspectorName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{inspectorName}</div>
                    </div>
                    <div className="official-signature-col-right w-1/2 text-right pr-4" style={{ width: '48%', textAlign: 'right', paddingRight: '16px' }}>
                      <strong>Người được kiểm tra</strong><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '4px 0' }}
                      >
                        {resolveSignature('receiver', receiverName) ? (
                          <img src={resolveSignature('receiver', receiverName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{receiverName}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TRANG 5: KIỂM THỰC BƯỚC 3 - KIỂM TRA TRƯỚC KHI ĂN (PDF TRANG 5) */}
              {/* ========================================================================= */}
              {(selectedTemplate === 'all' || selectedTemplate === 'step3') && (
                <div className="official-page-break mb-10 pb-8 border-b-2 border-slate-300 print:border-none">
                  <div className="text-[13px] mb-1">
                    - <strong>Thời gian kiểm tra:</strong> {isBlankForm ? 'ngày..................tháng...................năm 20..................' : `ngày ${dParts.day} tháng ${dParts.month} năm ${dParts.year}`}
                  </div>
                  <div className="text-[13px] mb-1">
                    - <strong>Địa điểm kiểm tra:</strong> {isBlankForm ? '..........................................................................................................................' : `Phòng ăn & Bếp chia thức ăn trường ${schoolInfo.name}`}
                  </div>
                  <div className="text-[12.5px] mb-3 leading-relaxed">
                    <div className="hygiene-row flex items-center justify-between max-w-[820px]">
                      <span>- <strong>Dụng cụ chia, chứa đựng, che đậy, bảo quản thức ăn:</strong> Đảm bảo an toàn thực phẩm</span>
                      <div className="hygiene-controls flex items-center shrink-0">
                        <div className="hygiene-col1 flex items-center mr-10">
                          <span
                            onClick={() => toggleStep3Box('tools')}
                            className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                            title="Nhấn để tích chọn (✓) hoặc để ô trống"
                          >
                            {step3Boxes.tools ? '✓' : ''}
                          </span>
                          <span className="ml-1 font-semibold text-[13px]">;</span>
                        </div>
                        <div className="hygiene-col2 flex items-center w-36 justify-end">
                          <span className="mr-2">chưa đạt:</span>
                          <span
                            onClick={() => toggleStep3Box('toolsBad')}
                            className="official-box border border-black inline-flex items-center justify-center w-8 h-4 text-[11px] font-bold bg-white cursor-pointer select-none"
                            title="Nhấn để tích chọn (✓) hoặc để ô trống"
                          >
                            {step3Boxes.toolsBad ? '✓' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-black text-[11px]">
                    <thead>
                      <tr>
                        <th rowSpan={2} className="border border-black p-1 w-[4%] text-center bg-slate-50">TT</th>
                        <th rowSpan={2} className="border border-black p-1 w-[16%] text-center bg-slate-50">Ca/bữa ăn (bữa ăn, giờ ăn,...)</th>
                        <th rowSpan={2} className="border border-black p-1 w-[24%] text-center bg-slate-50">Tên món ăn</th>
                        <th rowSpan={2} className="border border-black p-1 w-[12%] text-center bg-slate-50">Số lượng suất ăn</th>
                        <th rowSpan={2} className="border border-black p-1 w-[12%] text-center bg-slate-50">Thời gian chia món ăn xong (ngày, giờ)</th>
                        <th rowSpan={2} className="border border-black p-1 w-[12%] text-center bg-slate-50">Thời gian bắt đầu ăn (ngày, giờ)</th>
                        <th colSpan={2} className="border border-black p-0.5 text-center bg-slate-50">Kiểm tra cảm quan món ăn</th>
                        <th rowSpan={2} className="border border-black p-1 w-[10%] text-center bg-slate-50">Biện pháp xử lý/ Ghi chú</th>
                      </tr>
                      <tr>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[5%]">Đạt</th>
                        <th className="border border-black p-0.5 text-center bg-slate-50 w-[5%]">K.Đạt</th>
                      </tr>
                      <tr className="text-slate-500 font-normal italic text-[9px] text-center bg-slate-100">
                        <td className="border border-black p-0.5">(1)</td>
                        <td className="border border-black p-0.5">(2)</td>
                        <td className="border border-black p-0.5">(3)</td>
                        <td className="border border-black p-0.5">(4)</td>
                        <td className="border border-black p-0.5">(5)</td>
                        <td className="border border-black p-0.5">(6)</td>
                        <td className="border border-black p-0.5">(7)</td>
                        <td className="border border-black p-0.5">(8)</td>
                        <td className="border border-black p-0.5">(9)</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 text-center font-bold">1</td>
                        <td className="border border-black p-2">Bữa trưa chính</td>
                        <td className="border border-black p-2 font-bold">{rec.dishes.lunchMain}</td>
                        <td className="border border-black p-2 text-center font-semibold">{rec.nurseryCount + rec.kindergartenCount}</td>
                        <td className="border border-black p-2 text-center">10:15 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-2 text-center">10:30 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-2 text-center font-bold text-emerald-700">✓</td>
                        <td className="border border-black p-2 text-center"></td>
                        <td className="border border-black p-2 text-center text-[10px]">Đạt, phục vụ trẻ</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 text-center font-bold">2</td>
                        <td className="border border-black p-2">Bữa trưa chính</td>
                        <td className="border border-black p-2 font-bold">{rec.dishes.lunchSoup}</td>
                        <td className="border border-black p-2 text-center font-semibold">{rec.nurseryCount + rec.kindergartenCount}</td>
                        <td className="border border-black p-2 text-center">10:20 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-2 text-center">10:30 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-2 text-center font-bold text-emerald-700">✓</td>
                        <td className="border border-black p-2 text-center"></td>
                        <td className="border border-black p-2 text-center text-[10px]">Đạt, ấm nóng</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 text-center font-bold">3</td>
                        <td className="border border-black p-2">Bữa xế chiều</td>
                        <td className="border border-black p-2 font-bold">{rec.dishes.afternoonSnack}</td>
                        <td className="border border-black p-2 text-center font-semibold">{rec.nurseryCount + rec.kindergartenCount}</td>
                        <td className="border border-black p-2 text-center">14:00 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-2 text-center">14:15 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-2 text-center font-bold text-emerald-700">✓</td>
                        <td className="border border-black p-2 text-center"></td>
                        <td className="border border-black p-2 text-center text-[10px]">Đạt, chia đều các lớp</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Ký tên */}
                  <div className="official-signature-grid w-full mt-6 text-[12px] flex flex-row items-start justify-between" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                    <div className="official-signature-col-left w-1/2 text-left pl-4" style={{ width: '48%', textAlign: 'left', paddingLeft: '16px' }}>
                      <strong>Người kiểm tra</strong><br />
                      Nhận xét và biện pháp xử lý: <em>Thức ăn cảm quan tốt, nhiệt độ phục vụ 65-70°C, đủ điều kiện cho trẻ ăn.</em><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '4px 0' }}
                      >
                        {resolveSignature('inspector', inspectorName) ? (
                          <img src={resolveSignature('inspector', inspectorName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{inspectorName}</div>
                    </div>
                    <div className="official-signature-col-right w-1/2 text-right pr-4" style={{ width: '48%', textAlign: 'right', paddingRight: '16px' }}>
                      <strong>Người được kiểm tra</strong><br />
                      <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                      <div
                        className="official-signature-box"
                        style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '4px 0' }}
                      >
                        {resolveSignature('receiver', receiverName) ? (
                          <img src={resolveSignature('receiver', receiverName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                        ) : (
                          <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                        )}
                      </div>
                      <div className="font-bold">{receiverName}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TRANG 6: SỔ THEO DÕI LƯU VÀ HỦY MẪU THỨC ĂN (PDF TRANG 6) */}
              {/* ========================================================================= */}
              {(selectedTemplate === 'all' || selectedTemplate === 'samples') && (
                <div className="official-page-break mb-10 pb-8 border-b-2 border-slate-300 print:border-none">
                  <div className="text-center font-bold text-[14px] uppercase mb-4">
                    SỔ THEO DÕI LƯU VÀ HỦY MẪU THỨC ĂN (24 GIỜ)
                  </div>

                  <table className="w-full border-collapse border border-black text-[10.5px]">
                    <thead>
                      <tr>
                        <th className="border border-black p-1 w-[3%] text-center bg-slate-50">TT</th>
                        <th className="border border-black p-1 w-[16%] text-center bg-slate-50">Tên mẫu thức ăn</th>
                        <th className="border border-black p-1 w-[8%] text-center bg-slate-50">Bữa ăn (giờ ăn...)</th>
                        <th className="border border-black p-1 w-[6%] text-center bg-slate-50">Số lượng suất ăn</th>
                        <th className="border border-black p-1 w-[8%] text-center bg-slate-50">Khối lượng/ thể tích mẫu (gam, ml)</th>
                        <th className="border border-black p-1 w-[9%] text-center bg-slate-50">Dụng cụ chứa mẫu thức ăn lưu</th>
                        <th className="border border-black p-1 w-[6%] text-center bg-slate-50">Nhiệt độ bảo quản mẫu (°C)</th>
                        <th className="border border-black p-1 w-[10%] text-center bg-slate-50">Thời gian lấy mẫu (giờ, ngày, tháng, năm)</th>
                        <th className="border border-black p-1 w-[10%] text-center bg-slate-50">Thời gian hủy mẫu (giờ, ngày, tháng, năm)</th>
                        <th className="border border-black p-1 w-[8%] text-center bg-slate-50">Ghi chú (chất lượng, mẫu thức ăn lưu...)</th>
                        <th className="border border-black p-1 w-[8%] text-center bg-slate-50">Người lưu mẫu (ký, ghi rõ họ tên)</th>
                        <th className="border border-black p-1 w-[8%] text-center bg-slate-50">Người hủy mẫu (ký, ghi rõ họ tên)</th>
                      </tr>
                      <tr className="text-slate-500 font-normal italic text-[9px] text-center bg-slate-100">
                        <td className="border border-black p-0.5">(1)</td>
                        <td className="border border-black p-0.5">(2)</td>
                        <td className="border border-black p-0.5">(3)</td>
                        <td className="border border-black p-0.5">(4)</td>
                        <td className="border border-black p-0.5">(5)</td>
                        <td className="border border-black p-0.5">(6)</td>
                        <td className="border border-black p-0.5">(7)</td>
                        <td className="border border-black p-0.5">(8)</td>
                        <td className="border border-black p-0.5">(9)</td>
                        <td className="border border-black p-0.5">(10)</td>
                        <td className="border border-black p-0.5">(11)</td>
                        <td className="border border-black p-0.5">(12)</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">1</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.lunchMain}</td>
                        <td className="border border-black p-1.5 text-center">Bữa trưa</td>
                        <td className="border border-black p-1.5 text-center">{rec.nurseryCount + rec.kindergartenCount}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">150g (≥100g)</td>
                        <td className="border border-black p-1.5 text-center text-[9.5px]">Hộp Inox có nắp vô trùng</td>
                        <td className="border border-black p-1.5 text-center font-semibold">2°C - 4°C</td>
                        <td className="border border-black p-1.5 text-center">10:30 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">10:30 {String(Number(dParts.day) + 1).padStart(2, '0')}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Niêm phong kín</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleKeeperName}</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleDisposerName}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">2</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.lunchSoup}</td>
                        <td className="border border-black p-1.5 text-center">Bữa trưa</td>
                        <td className="border border-black p-1.5 text-center">{rec.nurseryCount + rec.kindergartenCount}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">150ml (≥100ml)</td>
                        <td className="border border-black p-1.5 text-center text-[9.5px]">Hộp Inox có nắp vô trùng</td>
                        <td className="border border-black p-1.5 text-center font-semibold">2°C - 4°C</td>
                        <td className="border border-black p-1.5 text-center">10:30 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">10:30 {String(Number(dParts.day) + 1).padStart(2, '0')}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Niêm phong kín</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleKeeperName}</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleDisposerName}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">3</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.lunchStaple}</td>
                        <td className="border border-black p-1.5 text-center">Bữa trưa</td>
                        <td className="border border-black p-1.5 text-center">{rec.nurseryCount + rec.kindergartenCount}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">150g (≥100g)</td>
                        <td className="border border-black p-1.5 text-center text-[9.5px]">Hộp Inox có nắp vô trùng</td>
                        <td className="border border-black p-1.5 text-center font-semibold">2°C - 4°C</td>
                        <td className="border border-black p-1.5 text-center">10:30 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">10:30 {String(Number(dParts.day) + 1).padStart(2, '0')}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Niêm phong kín</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleKeeperName}</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleDisposerName}</td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 text-center font-bold">4</td>
                        <td className="border border-black p-1.5 font-bold">{rec.dishes.afternoonSnack}</td>
                        <td className="border border-black p-1.5 text-center">Bữa xế</td>
                        <td className="border border-black p-1.5 text-center">{rec.nurseryCount + rec.kindergartenCount}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">120g/ml</td>
                        <td className="border border-black p-1.5 text-center text-[9.5px]">Hộp Inox có nắp vô trùng</td>
                        <td className="border border-black p-1.5 text-center font-semibold">2°C - 4°C</td>
                        <td className="border border-black p-1.5 text-center">14:15 {dParts.day}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center">14:15 {String(Number(dParts.day) + 1).padStart(2, '0')}/{dParts.month}</td>
                        <td className="border border-black p-1.5 text-center text-[10px]">Niêm phong kín</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleKeeperName}</td>
                        <td className="border border-black p-1.5 text-center font-medium">{sampleDisposerName}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Ký tên */}
                  <div className="mt-6 text-left pl-4 text-[12px]">
                    <strong>Người kiểm tra</strong><br />
                    Nhận xét: <em>Mẫu thức ăn lưu bảo quản đúng nhiệt độ, niêm phong tem nhãn đầy đủ 24 giờ. Hủy mẫu đúng quy định sau 24h, không phát hiện biến chất.</em><br />
                    <div className="italic text-[11px]">(Ký, ghi rõ họ tên)</div>
                    <div
                      className="official-signature-box"
                      style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', margin: '4px 0' }}
                    >
                      {resolveSignature('inspector', inspectorName) ? (
                        <img src={resolveSignature('inspector', inspectorName)} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                      ) : (
                        <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                      )}
                    </div>
                    <div className="font-bold">{inspectorName}</div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
