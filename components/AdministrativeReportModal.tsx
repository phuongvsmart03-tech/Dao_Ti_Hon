'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  Printer,
  Download,
  X,
  FileText,
  CheckCircle2,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from 'lucide-react';
import {
  SchoolInfo,
  ModuleId,
  TeacherSalaryRecord,
  FinanceTransaction,
  Step1Record,
  Step2Record,
  Step3Record,
  MenuItem,
} from '@/types/preschool';
import { triggerPrintDocument } from '@/lib/print-helper';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: ModuleId;
  schoolInfo: SchoolInfo;
  data: any[];
  onExportCsv: () => void;
  salariesData?: TeacherSalaryRecord[];
  transactionsData?: FinanceTransaction[];
  step1Data?: Step1Record[];
  step2Data?: Step2Record[];
  step3Data?: Step3Record[];
  menuData?: MenuItem[];
  onUpdateSchoolInfo?: (updated: SchoolInfo) => void;
}

const getSigner2Defaults = (modId: ModuleId, sInfo: SchoolInfo) => {
  switch (modId) {
    case 'menu':
      return {
        title: 'TỔ TRƯỞNG CHUYÊN MÔN NUÔI',
        name: sInfo.teamLeaderNutritionName || 'NGUYỄN THỊ THU HƯƠNG',
      };
    case 'step1':
      return {
        title: 'CÁN BỘ KIỂM TRA / Y TẾ',
        name: sInfo.inspectorName || sInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ',
      };
    case 'step2':
      return {
        title: 'BẾP TRƯỞNG / PHỤ TRÁCH BẾP',
        name: sInfo.headChefName || sInfo.receiverName || 'LÊ VĂN TÀI',
      };
    case 'step3':
      return {
        title: 'CÁN BỘ Y TẾ / GIÁM SÁT',
        name: sInfo.inspectorName || sInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ',
      };
    case 'samples':
      return {
        title: 'CÁN BỘ Y TẾ HỌC ĐƯỜNG',
        name: sInfo.sampleKeeperName || sInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ',
      };
    case 'students':
      return {
        title: 'GIÁO VIÊN CHỦ NHIỆM / TỔ TRƯỞNG',
        name: sInfo.teamLeaderEducationName || 'TRẦN THỊ NGỌC MAI',
      };
    case 'health':
      return {
        title: 'GIÁO VIÊN PHỤ TRÁCH / CÁN BỘ ĐO',
        name: sInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ',
      };
    case 'staff':
      return {
        title: 'PHÓ HIỆU TRƯỞNG PHỤ TRÁCH',
        name: sInfo.vicePrincipalName || 'HOÀNG THỊ THU TRANG',
      };
    case 'lessonPlans':
      return {
        title: 'TỔ TRƯỞNG CHUYÊN MÔN DẠY',
        name: sInfo.teamLeaderEducationName || 'TRẦN THỊ NGỌC MAI',
      };
    case 'finance':
      return {
        title: 'KẾ TOÁN TRƯỞNG / TỔ TRƯỞNG',
        name: sInfo.accountantName || 'ĐỖ THỊ THANH',
      };
    case 'lightning':
      return {
        title: 'CÁN BỘ KIỂM TRA / TỔ TRƯỞNG NUÔI',
        name: sInfo.teamLeaderNutritionName || sInfo.medicalStaffName || 'BS. TRẦN THỊ THU HÀ',
      };
    default:
      return {
        title: 'TỔ TRƯỞNG CHUYÊN MÔN',
        name: sInfo.teamLeaderNutritionName || sInfo.teamLeaderEducationName || 'TRẦN THỊ NGỌC MAI',
      };
  }
};

export default function AdministrativeReportModal(props: ReportModalProps) {
  if (!props.isOpen) return null;
  return <AdministrativeReportModalDialog key={`${props.moduleId}-${props.isOpen}`} {...props} />;
}

function AdministrativeReportModalDialog({
  isOpen: _isOpen,
  onClose,
  moduleId,
  schoolInfo,
  data,
  onExportCsv,
  salariesData = [],
  transactionsData = [],
  step1Data = [],
  step2Data = [],
  step3Data = [],
  menuData = [],
  onUpdateSchoolInfo,
}: ReportModalProps) {
  const printContentRef = useRef<HTMLDivElement>(null);
  const [financeView, setFinanceView] = useState<'transactions' | 'salaries'>('transactions');
  const [isSignerConfigOpen, setIsSignerConfigOpen] = useState(false);

  // Orientation handling
  const defaultOrientation = useMemo<'landscape' | 'portrait'>(() => {
    if (schoolInfo.defaultPrintOrientation) return schoolInfo.defaultPrintOrientation;
    if (['menu', 'step1', 'step2', 'step3', 'samples', 'finance', 'lightning'].includes(moduleId)) {
      return 'landscape';
    }
    return 'portrait';
  }, [moduleId, schoolInfo.defaultPrintOrientation]);

  const [currentModuleId, setCurrentModuleId] = useState(moduleId);
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(defaultOrientation);

  if (currentModuleId !== moduleId) {
    setCurrentModuleId(moduleId);
    setOrientation(defaultOrientation);
  }

  // Menu specific view states: Weekly Matrix (Ma trận A4 Ngang) vs Detailed List (Bảng chi tiết)
  const [menuLayoutMode, setMenuLayoutMode] = useState<'weekly_matrix' | 'detailed_list'>('weekly_matrix');
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');

  const initialSigner2 = useMemo(() => getSigner2Defaults(moduleId, schoolInfo), [moduleId, schoolInfo]);

  // Local state for live editing signers before printing
  const [signer1Title, setSigner1Title] = useState('NGƯỜI LẬP BIỂU');
  const [signer1Name, setSigner1Name] = useState(schoolInfo.creatorName || 'NGUYỄN THU HẰNG');

  const [signer2Title, setSigner2Title] = useState(initialSigner2.title);
  const [signer2Name, setSigner2Name] = useState(initialSigner2.name);

  const [signer3Title, setSigner3Title] = useState('HIỆU TRƯỞNG / CHỦ TRƯỜNG');
  const [signer3Name, setSigner3Name] = useState(schoolInfo.principalName || 'NGUYỄN THỊ MAI HOA');

  const [isSavedToSettings, setIsSavedToSettings] = useState(false);

  const signer2Signature = useMemo(() => {
    if (moduleId === 'menu' || moduleId === 'lightning') return schoolInfo.teamLeaderNutritionSignature;
    if (moduleId === 'lessonPlans' || moduleId === 'students') return schoolInfo.teamLeaderEducationSignature;
    if (moduleId === 'finance') return schoolInfo.accountantSignature;
    if (moduleId === 'step1' || moduleId === 'step3') return schoolInfo.inspectorSignature;
    if (moduleId === 'step2') return schoolInfo.receiverSignature;
    if (moduleId === 'samples') return schoolInfo.sampleKeeperSignature;
    return schoolInfo.teamLeaderNutritionSignature;
  }, [moduleId, schoolInfo]);

  const handleSaveSignersToSchoolInfo = () => {
    if (onUpdateSchoolInfo) {
      const updated: SchoolInfo = {
        ...schoolInfo,
        creatorName: signer1Name,
        principalName: signer3Name,
      };

      if (moduleId === 'menu' || moduleId === 'lightning') {
        updated.teamLeaderNutritionName = signer2Name;
      } else if (moduleId === 'lessonPlans' || moduleId === 'students') {
        updated.teamLeaderEducationName = signer2Name;
      } else if (moduleId === 'finance') {
        updated.accountantName = signer2Name;
      } else if (moduleId === 'staff') {
        updated.vicePrincipalName = signer2Name;
      } else if (moduleId === 'step1' || moduleId === 'step3') {
        updated.inspectorName = signer2Name;
      } else if (moduleId === 'step2') {
        updated.headChefName = signer2Name;
      } else if (moduleId === 'samples') {
        updated.sampleKeeperName = signer2Name;
      }

      onUpdateSchoolInfo(updated);
      setIsSavedToSettings(true);
      setTimeout(() => setIsSavedToSettings(false), 3000);
    }
  };

  const formatMoney = (val: number | string | undefined) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const normalizedData = useMemo(() => {
    let sourceData = data;
    if (moduleId === 'finance') {
      sourceData = financeView === 'transactions' ? (transactionsData.length ? transactionsData : data) : (salariesData.length ? salariesData : data);
    }
    if (!Array.isArray(sourceData)) return [];
    return sourceData.map((item) => {
      if (!item || typeof item !== 'object') return item;
      const res: any = {};
      for (const key of Object.keys(item)) {
        if (typeof item[key] === 'string') {
          res[key] = item[key].normalize('NFC');
        } else {
          res[key] = item[key];
        }
      }
      return res;
    });
  }, [data, moduleId, financeView, transactionsData, salariesData]);

  // Extract list of distinct weeks for Menu
  const availableWeeks = useMemo(() => {
    if (moduleId !== 'menu') return [];
    const wks = Array.from(new Set(normalizedData.map((m: any) => Number(m.weekNumber) || 1)));
    return wks.sort((a, b) => a - b);
  }, [moduleId, normalizedData]);

  const weeksToRender = useMemo(() => {
    if (moduleId !== 'menu' || menuLayoutMode !== 'weekly_matrix') return [];
    if (selectedWeekFilter === 'all') {
      return availableWeeks.length > 0 ? availableWeeks : [1];
    }
    return [Number(selectedWeekFilter)];
  }, [moduleId, menuLayoutMode, selectedWeekFilter, availableWeeks]);

  const weekDays = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu'] as const;

  const getMenuItemForDay = (weekNum: number, day: string) => {
    return normalizedData.find(
      (m: any) => (Number(m.weekNumber) || 1) === weekNum && m.dayOfWeek === day
    );
  };

  const handlePrint = () => {
    // 1. Gắn thẻ style @page động để áp dụng khổ in theo orientation
    if (typeof document !== 'undefined') {
      const styleId = 'dynamic-admin-print-style';
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

    // 2. Sử dụng isolated hidden iframe printer đảm bảo 100% không bị chặn bởi sandbox/iframe
    if (printContentRef.current) {
      const reportTitle = meta?.title || 'BÁO CÁO HỒ SƠ QUẢN LÝ MẦM NON';
      triggerPrintDocument(printContentRef.current.innerHTML, `${reportTitle} - ${schoolInfo.name || 'TRƯỜNG MẦM NON'}`, orientation);
      return;
    }

    // Direct print fallback
    try {
      window.print();
    } catch {
      handleOpenPrintWindow();
    }
  };

  const handleOpenPrintWindow = () => {
    if (typeof window === 'undefined' || !printContentRef.current) return;
    try {
      const isLandscape = orientation === 'landscape';
      const printWindow = window.open('', '_blank', 'width=1120,height=820');
      if (!printWindow) return;

      const contentHtml = printContentRef.current.innerHTML;
      const reportTitle = meta?.title || 'BÁO CÁO HỒ SƠ QUẢN LÝ MẦM NON';
      printWindow.document.open();
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="utf-8" />
          <title>${reportTitle} - ${schoolInfo.name || 'MẦM NON'}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
              margin: ${isLandscape ? '8mm 10mm 8mm 10mm' : '10mm 10mm 10mm 10mm'};
            }
            * {
              box-sizing: border-box;
              font-family: 'Times New Roman', 'Tinos', 'Liberation Serif', Times, serif;
            }
            body {
              margin: 0;
              padding: 10px;
              color: #000;
              background: #fff;
              font-size: ${isLandscape ? '11px' : '12px'};
              line-height: 1.3;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px;
              page-break-inside: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            tr, th, td {
              border: 1px solid #000;
              padding: ${isLandscape ? '4px 6px' : '5px 8px'};
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              break-inside: avoid-page !important;
            }
            th {
              background-color: #f1f5f9;
              font-weight: bold;
            }
            .official-signature-grid, .signature-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              break-inside: avoid-page !important;
              margin-top: 24px;
            }
            .official-page-break {
              page-break-after: always;
              break-after: page;
            }
            .print-hidden {
              display: none !important;
            }
            @media print {
              body { padding: 0; }
              .official-page-break { margin-bottom: 0; }
            }
          </style>
        </head>
        <body>
          ${contentHtml}
          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() {
                window.print();
              }, 400);
            };
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('Lỗi khi mở tab in riêng:', err);
    }
  };

  const getReportMeta = () => {
    switch (moduleId) {
      case 'lightning':
        return {
          title: 'HỒ SƠ THANH TRA CẤP TỐC (LIGHTNING INSPECTION DOSSIER)',
          sub: 'Bộ hồ sơ tổng hợp kiểm thực 3 bước và tính khẩu phần ăn hợp thức hóa theo QĐ 1246/QĐ-BYT',
        };
      case 'step1':
        return {
          title: 'SỔ KIỂM TRA GIAO NHẬN THỰC PHẨM (BƯỚC 1)',
          sub: 'Quy trình kiểm tra an toàn thực phẩm trước khi chế biến theo Quyết định 1246/QĐ-BYT',
        };
      case 'step2':
        return {
          title: 'SỔ THEO DÕI QUY TRÌNH CHẾ BIẾN THỰC PHẨM (BƯỚC 2)',
          sub: 'Kiểm soát vệ sinh, nhiệt độ và thời gian sơ chế, nấu nướng',
        };
      case 'step3':
        return {
          title: 'SỔ KIỂM TRA TRƯỚC KHI ĂN & LƯU MẪU THỨC ĂN (BƯỚC 3)',
          sub: 'Thử nếm cảm quan thức ăn và niêm phong mẫu lưu theo quy định',
        };
      case 'menu':
        return {
          title: 'BẢNG KẾ HOẠCH & DUYỆT THỰC ĐƠN DINH DƯỠNG MẦM NON',
          sub: 'Thực đơn cân đối định lượng Kcal và vi chất theo khuyến nghị Viện Dinh Dưỡng',
        };
      case 'samples':
        return {
          title: 'NHẬT KÝ THEO DÕI LƯU VÀ HỦY MẪU THỨC ĂN (24 GIỜ)',
          sub: 'Theo dõi thời hạn bảo quản tủ lạnh (0-5°C) và biên bản hủy mẫu thức ăn',
        };
      case 'students':
        return {
          title: 'DANH SÁCH & HỒ SƠ QUẢN LÝ HỌC SINH MẦM NON',
          sub: 'Thông tin phân lớp, phụ huynh, liên lạc và theo dõi chuyên cần',
        };
      case 'health':
        return {
          title: 'SỔ THEO DÕI SỨC KHỎE & BIỂU ĐỒ TĂNG TRƯỞNG TRẺ',
          sub: 'Đánh giá dinh dưỡng thể lực, chiều cao, cân nặng và lịch tiêm chủng',
        };
      case 'staff':
        return {
          title: 'DANH SÁCH & PHÂN CÔNG NHIỆM VỤ CÁN BỘ - GIÁO VIÊN - NHÂN VIÊN',
          sub: 'Tổng hợp trình độ chuyên môn, bằng cấp, chứng chỉ VSATTP và khám sức khỏe',
        };
      case 'lessonPlans':
        return {
          title: 'SỔ LƯU TRỮ & PHÊ DUYỆT KẾ HOẠCH BÀI DẠY (GIÁO ÁN ĐIỆN TỬ)',
          sub: 'Hồ sơ chuyên môn giảng dạy theo chương trình Giáo dục Mầm non mới',
        };
      case 'finance':
        return {
          title:
            financeView === 'transactions'
              ? 'SỔ QUỸ THEO DÕI THU - CHI NGÂN SÁCH MẦM NON'
              : 'BẢNG THANH TOÁN TIỀN LƯƠNG & CÁC KHOẢN PHỤ CẤP CÁN BỘ GIÁO VIÊN',
          sub:
            financeView === 'transactions'
              ? 'Sổ quỹ tổng hợp các khoản thu học phí, bán trú và chi tiêu mua sắm, thực phẩm'
              : 'Bảng quyết toán lương, phụ cấp trách nhiệm, ăn trưa và thực lĩnh của giáo viên - nhân viên',
        };
      default:
        return {
          title: 'BÁO CÁO HỒ SƠ QUẢN LÝ MẦM NON',
          sub: 'Hệ thống hồ sơ biểu mẫu chuẩn nộp Phòng Giáo dục & Đào tạo',
        };
    }
  };

  const meta = getReportMeta();
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${orientation === 'landscape' ? 'max-w-6xl 2xl:max-w-7xl' : 'max-w-5xl'} my-auto flex flex-col max-h-[92vh] border border-slate-300 transition-all duration-200`}>
        {/* Top Dialog Bar (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 bg-slate-50 rounded-t-xl print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Xem trước Biểu mẫu chuẩn nộp Phòng GD&ĐT
              </h3>
              <p className="text-[11px] text-slate-500">
                Tự động căn chỉnh chuẩn khổ giấy A4, lề chuẩn quy định, chống ngắt dòng giữa trang.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Bộ chuyển đổi khổ in A4 Ngang / Dọc */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  orientation === 'landscape'
                    ? 'bg-white text-blue-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Khổ A4 Ngang (297 x 210 mm) - Thích hợp cho Thực đơn tuần và Sổ kiểm thực"
              >
                Khổ Ngang (A4)
              </button>
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  orientation === 'portrait'
                    ? 'bg-white text-blue-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Khổ A4 Dọc (210 x 297 mm) - Chuẩn văn bản hành chính"
              >
                Khổ Dọc (A4)
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSignerConfigOpen(!isSignerConfigOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isSignerConfigOpen
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Chỉnh người ký ({signer1Name ? 'Đã cài' : 'Chưa cài'})</span>
              {isSignerConfigOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In biểu mẫu (Ctrl + P)</span>
            </button>
            <button
              type="button"
              onClick={handleOpenPrintWindow}
              title="Mở tab in riêng cách ly (Khuyên dùng khi xem trước trong iFrame)"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <span>Mở tab in riêng</span>
            </button>
            <button
              type="button"
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Controls Bar & Signer Config Dropdown (Hidden on print) */}
        <div className="print:hidden">
          {/* Menu module specific mode switcher */}
          {moduleId === 'menu' && (
            <div className="px-6 py-2.5 bg-emerald-50/80 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-950">Mẫu in Thực đơn:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMenuLayoutMode('weekly_matrix');
                    setOrientation('landscape');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    menuLayoutMode === 'weekly_matrix'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  Ma trận Tuần A4 Ngang (Chuẩn Phòng GD)
                </button>
                <button
                  type="button"
                  onClick={() => setMenuLayoutMode('detailed_list')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    menuLayoutMode === 'detailed_list'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  Bảng chi tiết các ngày ({normalizedData.length} ngày)
                </button>
              </div>

              {menuLayoutMode === 'weekly_matrix' && availableWeeks.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-600 font-medium">Chọn tuần:</span>
                  <select
                    value={selectedWeekFilter}
                    onChange={(e) => setSelectedWeekFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="px-2 py-1 bg-white border border-emerald-300 rounded text-xs font-semibold text-emerald-900 cursor-pointer"
                  >
                    <option value="all">Tất cả các tuần ({availableWeeks.length} tuần - Tách trang tự động)</option>
                    {availableWeeks.map((w) => (
                      <option key={w} value={w}>
                        Chỉ in Tuần {w}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          {/* Finance module specific tab switcher */}
          {moduleId === 'finance' && (
            <div className="px-6 py-2.5 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-950">Mẫu in Tài chính:</span>
                <button
                  type="button"
                  onClick={() => setFinanceView('transactions')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    financeView === 'transactions'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white text-blue-900 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  Sổ quỹ Thu - Chi ({transactionsData.length} giao dịch)
                </button>
                <button
                  type="button"
                  onClick={() => setFinanceView('salaries')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    financeView === 'salaries'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white text-blue-900 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  Bảng Lương &amp; Phụ cấp ({salariesData.length} cán bộ)
                </button>
              </div>
            </div>
          )}

          {/* Inline Signer Configuration Drawer */}
          {isSignerConfigOpen && (
            <div className="px-6 py-4 bg-amber-50/60 border-b border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Kiểm soát thông tin Chữ ký biểu mẫu in:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isSavedToSettings && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đã lưu vào Cài đặt trường!
                    </span>
                  )}
                  {onUpdateSchoolInfo && (
                    <button
                      type="button"
                      onClick={handleSaveSignersToSchoolInfo}
                      className="px-2.5 py-1 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      Lưu tên làm mặc định
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Signer 1: Người lập biểu */}
                <div className="p-2.5 bg-white rounded-lg border border-amber-200 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Cột 1: Chức danh &amp; Tên Người lập biểu
                  </label>
                  <input
                    type="text"
                    value={signer1Title}
                    onChange={(e) => setSigner1Title(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-bold uppercase text-slate-800"
                    placeholder="NGƯỜI LẬP BIỂU"
                  />
                  <input
                    type="text"
                    value={signer1Name}
                    onChange={(e) => setSigner1Name(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-semibold text-emerald-800"
                    placeholder="VD: NGUYỄN THU HẰNG"
                  />
                </div>

                {/* Signer 2: Tổ trưởng / Kế toán / Cán bộ kiểm tra */}
                <div className="p-2.5 bg-white rounded-lg border border-amber-200 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Cột 2: Chức danh &amp; Tên Tổ trưởng / Duyệt
                  </label>
                  <input
                    type="text"
                    value={signer2Title}
                    onChange={(e) => setSigner2Title(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-bold uppercase text-slate-800"
                    placeholder="TỔ TRƯỞNG CHUYÊN MÔN"
                  />
                  <input
                    type="text"
                    value={signer2Name}
                    onChange={(e) => setSigner2Name(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-semibold text-blue-800"
                    placeholder="VD: NGUYỄN THỊ THU HƯƠNG"
                  />
                </div>

                {/* Signer 3: Hiệu trưởng / Chủ trường */}
                <div className="p-2.5 bg-white rounded-lg border border-amber-200 space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Cột 3: Chức danh &amp; Tên Lãnh đạo đơn vị
                  </label>
                  <input
                    type="text"
                    value={signer3Title}
                    onChange={(e) => setSigner3Title(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-bold uppercase text-slate-800"
                    placeholder="HIỆU TRƯỞNG / CHỦ TRƯỜNG"
                  />
                  <input
                    type="text"
                    value={signer3Name}
                    onChange={(e) => setSigner3Name(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-semibold text-purple-800"
                    placeholder="VD: NGUYỄN THỊ MAI HOA"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Official Printable Document Container */}
        <div
          className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-black font-administrative print:p-0"
          style={{ fontFamily: '"Times New Roman", "Tinos", "Liberation Serif", Times, serif' }}
        >
          <div
            ref={printContentRef}
            className={`mx-auto text-black font-administrative print-page ${
              orientation === 'landscape' ? 'max-w-[297mm]' : 'max-w-[210mm]'
            }`}
            style={{ fontFamily: '"Times New Roman", "Tinos", "Liberation Serif", Times, serif' }}
          >
            {/* National & Educational Header (Hiển thị cho các module thông thường hoặc Menu dạng danh sách) */}
            {!(moduleId === 'menu' && menuLayoutMode === 'weekly_matrix') && (
              <>
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-transparent">
                  <div className="text-center font-bold text-xs sm:text-sm leading-snug">
                    <p className="uppercase">{schoolInfo.department || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO'}</p>
                    <p className="uppercase text-black font-bold">{schoolInfo.name || 'TRƯỜNG MẦM NON'}</p>
                    <p className="font-normal text-xs mt-1 text-slate-700 italic">
                      Số: ...... /BC-{moduleId.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-center font-bold text-xs sm:text-sm leading-snug">
                    <p className="uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                    <p className="underline underline-offset-4 decoration-1 font-semibold">
                      Độc lập - Tự do - Hạnh phúc
                    </p>
                    <p className="font-normal text-xs mt-1 italic">
                      Ngày {day} tháng {month} năm {year}
                    </p>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center my-6">
                  <h1 className="text-lg sm:text-xl font-bold uppercase text-black">
                    {meta.title}
                  </h1>
                  <p className="text-xs italic text-slate-700 mt-1">{meta.sub}</p>
                  <p className="text-xs font-semibold mt-1">
                    {schoolInfo.academicYear} • Tổng số bản ghi: {normalizedData.length}
                  </p>
                </div>
              </>
            )}

            {/* Administrative Table Content */}
            <div className="overflow-x-auto my-4">
              {moduleId === 'step1' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Ngày giờ</th>
                      <th className="border border-black p-1.5">Tên thực phẩm</th>
                      <th className="border border-black p-1.5">Số lượng</th>
                      <th className="border border-black p-1.5">Cảm quan</th>
                      <th className="border border-black p-1.5">Nhà cung cấp / Giấy kiểm dịch</th>
                      <th className="border border-black p-1.5">Người giao</th>
                      <th className="border border-black p-1.5">Người nhận</th>
                      <th className="border border-black p-1.5">Kết luận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center">
                          {row.date} {row.time}
                        </td>
                        <td className="border border-black p-1.5 font-semibold">{row.foodName}</td>
                        <td className="border border-black p-1.5 text-center">{row.quantity}</td>
                        <td className="border border-black p-1.5">{row.sensoryQuality}</td>
                        <td className="border border-black p-1.5">
                          {row.supplier} <br />
                          <span className="italic text-[11px]">{row.expiryOrCertificate}</span>
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.deliverer}</td>
                        <td className="border border-black p-1.5 text-center">{row.inspector}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">
                          {row.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'step2' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Ngày</th>
                      <th className="border border-black p-1.5">Bữa ăn</th>
                      <th className="border border-black p-1.5">Tên món ăn</th>
                      <th className="border border-black p-1.5">Giờ sơ chế</th>
                      <th className="border border-black p-1.5">Giờ nấu &amp; Nhiệt độ</th>
                      <th className="border border-black p-1.5">Tình trạng VSATTP</th>
                      <th className="border border-black p-1.5">Đầu bếp</th>
                      <th className="border border-black p-1.5">Giám sát</th>
                      <th className="border border-black p-1.5">Đánh giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center">{row.date}</td>
                        <td className="border border-black p-1.5 text-center">{row.meal}</td>
                        <td className="border border-black p-1.5 font-semibold">{row.dishName}</td>
                        <td className="border border-black p-1.5 text-center">{row.prepTime}</td>
                        <td className="border border-black p-1.5 text-center">
                          {row.cookTime} ({row.cookingTemp})
                        </td>
                        <td className="border border-black p-1.5">{row.hygieneStatus}</td>
                        <td className="border border-black p-1.5 text-center">{row.chef}</td>
                        <td className="border border-black p-1.5 text-center">{row.supervisor}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">
                          {row.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'step3' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Ngày giờ</th>
                      <th className="border border-black p-1.5">Bữa ăn</th>
                      <th className="border border-black p-1.5">Tên món ăn</th>
                      <th className="border border-black p-1.5">Đánh giá cảm quan</th>
                      <th className="border border-black p-1.5">Nhiệt độ chia</th>
                      <th className="border border-black p-1.5">Lượng mẫu &amp; Vị trí tủ</th>
                      <th className="border border-black p-1.5">Người thử nếm</th>
                      <th className="border border-black p-1.5">Người lưu mẫu</th>
                      <th className="border border-black p-1.5">Kết luận</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center">
                          {row.date} {row.time}
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.meal}</td>
                        <td className="border border-black p-1.5 font-semibold">{row.dishName}</td>
                        <td className="border border-black p-1.5">{row.sensoryEvaluation}</td>
                        <td className="border border-black p-1.5 text-center">{row.servingTemp}</td>
                        <td className="border border-black p-1.5">
                          {row.sampleWeight} - {row.storageLocation}
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.taster}</td>
                        <td className="border border-black p-1.5 text-center">{row.keeper}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">
                          {row.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'menu' && (
                <>
                  {menuLayoutMode === 'weekly_matrix' ? (
                    <div className="space-y-8 print:space-y-0">
                      {weeksToRender.map((wNum, wIdx) => {
                        const weekItems = normalizedData.filter(
                          (m: any) => (Number(m.weekNumber) || 1) === wNum
                        );
                        const sampleItem = weekItems[0] || {};
                        const ageGroup = sampleItem.ageGroup || 'Khối Mẫu giáo (3 - 5 tuổi)';

                        return (
                          <div
                            key={wNum}
                            className={`p-2 bg-white print:p-0 ${
                              wIdx < weeksToRender.length - 1 ? 'official-page-break mb-8 print:mb-0' : ''
                            }`}
                          >
                            {/* National & School Header cho từng tuần */}
                            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-transparent">
                              <div className="text-center font-bold text-xs sm:text-sm leading-snug">
                                <p className="uppercase">{schoolInfo.department || 'PHÒNG GIÁO DỤC VÀ ĐÀO TẠO'}</p>
                                <p className="uppercase text-black font-bold">{schoolInfo.name || 'TRƯỜNG MẦM NON'}</p>
                                <p className="font-normal text-[11px] mt-0.5 text-slate-700 italic">
                                  Năm học: {schoolInfo.academicYear} • Khối: {ageGroup}
                                </p>
                              </div>
                              <div className="text-center font-bold text-xs sm:text-sm leading-snug">
                                <p className="uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                                <p className="underline underline-offset-4 decoration-1 font-semibold">
                                  Độc lập - Tự do - Hạnh phúc
                                </p>
                                <p className="font-normal text-[11px] mt-0.5 italic">
                                  Ngày {day} tháng {month} năm {year}
                                </p>
                              </div>
                            </div>

                            {/* Tiêu đề bảng thực đơn tuần */}
                            <div className="text-center my-3">
                              <h2 className="text-base sm:text-lg font-bold uppercase text-black">
                                BẢNG KẾ HOẠCH &amp; THEO DÕI THỰC ĐƠN TUẦN {wNum}
                              </h2>
                              <p className="text-xs italic text-slate-700 mt-0.5">
                                (Áp dụng định lượng theo Thông tư 28/2016/TT-BGDĐT - Tháng {month}/{year})
                              </p>
                            </div>

                            {/* Bảng Ma trận Thực đơn Tuần A4 Ngang (6 Cột) */}
                            <table className="w-full border-collapse border border-black text-xs text-black my-2">
                              <thead>
                                <tr className="bg-slate-100 font-bold text-center">
                                  <th className="border border-black p-1.5 w-32 sm:w-40">BỮA ĂN &amp; NỘI DUNG</th>
                                  <th className="border border-black p-1.5 w-1/5">THỨ HAI</th>
                                  <th className="border border-black p-1.5 w-1/5">THỨ BA</th>
                                  <th className="border border-black p-1.5 w-1/5">THỨ TƯ</th>
                                  <th className="border border-black p-1.5 w-1/5">THỨ NĂM</th>
                                  <th className="border border-black p-1.5 w-1/5">THỨ SÁU</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="border border-black p-1.5 font-bold bg-slate-50">
                                    Bữa sáng
                                    <span className="block text-[10px] font-normal text-slate-600">(07h00 - 08h00)</span>
                                  </td>
                                  {weekDays.map((d) => (
                                    <td key={d} className="border border-black p-1.5 font-medium">
                                      {getMenuItemForDay(wNum, d)?.breakfast || '-'}
                                    </td>
                                  ))}
                                </tr>
                                <tr>
                                  <td className="border border-black p-1.5 font-bold bg-slate-50">
                                    Bữa phụ sáng
                                    <span className="block text-[10px] font-normal text-slate-600">(09h00)</span>
                                  </td>
                                  {weekDays.map((d) => (
                                    <td key={d} className="border border-black p-1.5">
                                      {getMenuItemForDay(wNum, d)?.snackMorning || '-'}
                                    </td>
                                  ))}
                                </tr>
                                <tr>
                                  <td className="border border-black p-1.5 font-bold bg-slate-50">
                                    Trưa: Món chính mặn
                                  </td>
                                  {weekDays.map((d) => (
                                    <td key={d} className="border border-black p-1.5 font-semibold text-slate-900">
                                      {getMenuItemForDay(wNum, d)?.lunchMain || '-'}
                                    </td>
                                  ))}
                                </tr>
                                <tr>
                                  <td className="border border-black p-1.5 font-bold bg-slate-50">
                                    Trưa: Canh rau củ
                                  </td>
                                  {weekDays.map((d) => (
                                    <td key={d} className="border border-black p-1.5">
                                      {getMenuItemForDay(wNum, d)?.lunchSoup || '-'}
                                    </td>
                                  ))}
                                </tr>
                                <tr>
                                  <td className="border border-black p-1.5 font-bold bg-slate-50">
                                    Trưa: Cơm / Món phụ
                                  </td>
                                  {weekDays.map((d) => (
                                    <td key={d} className="border border-black p-1.5">
                                      {getMenuItemForDay(wNum, d)?.lunchStaple || '-'}
                                    </td>
                                  ))}
                                </tr>
                                <tr>
                                  <td className="border border-black p-1.5 font-bold bg-slate-50">
                                    Trưa: Tráng miệng
                                  </td>
                                  {weekDays.map((d) => (
                                    <td key={d} className="border border-black p-1.5 text-center">
                                      {getMenuItemForDay(wNum, d)?.lunchDessert || '-'}
                                    </td>
                                  ))}
                                </tr>
                                <tr>
                                  <td className="border border-black p-1.5 font-bold bg-slate-50">
                                    Bữa chiều xế
                                    <span className="block text-[10px] font-normal text-slate-600">(14h00 - 14h30)</span>
                                  </td>
                                  {weekDays.map((d) => (
                                    <td key={d} className="border border-black p-1.5">
                                      {getMenuItemForDay(wNum, d)?.afternoonSnack || '-'}
                                    </td>
                                  ))}
                                </tr>
                                <tr className="bg-slate-50/80">
                                  <td className="border border-black p-1.5 font-bold">
                                    Năng lượng (Kcal)
                                    <span className="block text-[10px] font-normal text-slate-600">Tỷ lệ P - L - G</span>
                                  </td>
                                  {weekDays.map((d) => {
                                    const item = getMenuItemForDay(wNum, d);
                                    if (!item) return <td key={d} className="border border-black p-1.5 text-center text-slate-400">-</td>;
                                    const macroText = item.macroDistribution
                                      ? `${item.macroDistribution.proteinPercent}P - ${item.macroDistribution.lipidPercent}L - ${item.macroDistribution.glucidPercent}G`
                                      : (item.proteinRatio || '14-16%P');
                                    return (
                                      <td key={d} className="border border-black p-1.5 text-center">
                                        <span className="font-bold text-slate-950">{item.caloriesKcal || 780} Kcal</span>
                                        <span className="block text-[10px] text-slate-700">{macroText}</span>
                                      </td>
                                    );
                                  })}
                                </tr>
                                <tr className="bg-slate-50/80">
                                  <td className="border border-black p-1.5 font-bold">
                                    Dự toán tiền ăn
                                  </td>
                                  {weekDays.map((d) => {
                                    const item = getMenuItemForDay(wNum, d);
                                    const cost = item?.estimatedDailyCost
                                      ? Number(item.estimatedDailyCost).toLocaleString('vi-VN') + ' đ'
                                      : '35.000 đ';
                                    return (
                                      <td key={d} className="border border-black p-1.5 text-center font-medium">
                                        {cost}
                                      </td>
                                    );
                                  })}
                                </tr>
                              </tbody>
                            </table>

                            {/* Ghi chú & Đảm bảo quy chuẩn */}
                            <div className="my-2 p-2 border border-black/30 rounded text-[11px] text-slate-700 space-y-0.5 print:border-black">
                              <p>• <strong>Quy chuẩn dinh dưỡng:</strong> Cân đối định mức Kcal đạt 600 - 850 Kcal/ngày (chiếm 50-55% nhu cầu năng lượng cả ngày của trẻ theo quy định Bộ GD&amp;ĐT).</p>
                              <p>• <strong>An toàn thực phẩm:</strong> 100% nguyên liệu có nguồn gốc, kiểm thực 3 bước và lưu mẫu thức ăn 24 giờ có niêm phong tủ lạnh (0-5°C).</p>
                            </div>

                            {/* Chữ ký riêng của tuần này */}
                            <div className="mt-6 pt-3 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm leading-snug official-signature-grid print-avoid-break">
                              <div>
                                <p className="font-bold uppercase">{signer1Title}</p>
                                <p className="italic text-xs text-slate-600">(Ký, ghi rõ họ tên)</p>
                                <div
                                  className="official-signature-box"
                                  style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                                >
                                  {schoolInfo.creatorSignature ? (
                                    <img src={schoolInfo.creatorSignature} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                                  ) : (
                                    <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                                  )}
                                </div>
                                <p className="font-bold text-slate-900">{signer1Name || 'NGUYỄN THU HẰNG'}</p>
                              </div>
                              <div>
                                <p className="font-bold uppercase">{signer2Title}</p>
                                <p className="italic text-xs text-slate-600">(Ký, ghi rõ họ tên)</p>
                                <div
                                  className="official-signature-box"
                                  style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                                >
                                  {signer2Signature ? (
                                    <img src={signer2Signature} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                                  ) : (
                                    <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                                  )}
                                </div>
                                <p className="font-bold text-slate-900">{signer2Name || 'NGUYỄN THỊ THU HƯƠNG'}</p>
                              </div>
                              <div>
                                <p className="font-bold uppercase">{signer3Title}</p>
                                <p className="italic text-xs text-slate-600">(Ký tên và đóng dấu)</p>
                                <div
                                  className="official-signature-box"
                                  style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                                >
                                  {schoolInfo.principalSignature ? (
                                    <img src={schoolInfo.principalSignature} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                                  ) : (
                                    <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                                  )}
                                </div>
                                <p className="font-bold text-slate-900">{signer3Name || schoolInfo.principalName || 'NGUYỄN THỊ MAI HOA'}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <table className="w-full border-collapse border border-black text-xs text-black">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-black p-1.5 w-10">STT</th>
                          <th className="border border-black p-1.5">Thứ</th>
                          <th className="border border-black p-1.5">Độ tuổi</th>
                          <th className="border border-black p-1.5">Bữa sáng</th>
                          <th className="border border-black p-1.5">Bữa phụ sáng</th>
                          <th className="border border-black p-1.5">Bữa trưa (Mặn + Canh + Cơm)</th>
                          <th className="border border-black p-1.5">Tráng miệng</th>
                          <th className="border border-black p-1.5">Bữa chiều xế</th>
                          <th className="border border-black p-1.5">Năng lượng</th>
                          <th className="border border-black p-1.5">Duyệt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {normalizedData.map((row: any, idx: number) => (
                          <tr key={row.id || idx}>
                            <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                            <td className="border border-black p-1.5 font-bold text-center">
                              {row.dayOfWeek}
                            </td>
                            <td className="border border-black p-1.5">{row.ageGroup}</td>
                            <td className="border border-black p-1.5">{row.breakfast}</td>
                            <td className="border border-black p-1.5">{row.snackMorning}</td>
                            <td className="border border-black p-1.5">
                              • {row.lunchMain} <br />
                              • {row.lunchSoup} <br />• {row.lunchStaple}
                            </td>
                            <td className="border border-black p-1.5 text-center">
                              {row.lunchDessert}
                            </td>
                            <td className="border border-black p-1.5">{row.afternoonSnack}</td>
                            <td className="border border-black p-1.5 text-center font-semibold">
                              {row.caloriesKcal} Kcal
                            </td>
                            <td className="border border-black p-1.5 text-center font-semibold">
                              {row.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {moduleId === 'samples' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Ngày giờ lấy mẫu</th>
                      <th className="border border-black p-1.5">Bữa ăn</th>
                      <th className="border border-black p-1.5">Tên món ăn</th>
                      <th className="border border-black p-1.5">Khối lượng &amp; Dụng cụ</th>
                      <th className="border border-black p-1.5">Nhiệt độ tủ</th>
                      <th className="border border-black p-1.5">Ngày giờ hủy (24h)</th>
                      <th className="border border-black p-1.5">Tình trạng hủy</th>
                      <th className="border border-black p-1.5">Người lấy</th>
                      <th className="border border-black p-1.5">Chứng kiến</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center">
                          {row.dateSampled} {row.timeSampled}
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.meal}</td>
                        <td className="border border-black p-1.5 font-semibold">{row.dishName}</td>
                        <td className="border border-black p-1.5">
                          {row.sampleWeight} ({row.containerType})
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.storageTemp}</td>
                        <td className="border border-black p-1.5 text-center">
                          {row.disposalDate} {row.disposalTime}
                        </td>
                        <td className="border border-black p-1.5">{row.conditionAtDisposal}</td>
                        <td className="border border-black p-1.5 text-center">{row.samplerName}</td>
                        <td className="border border-black p-1.5 text-center">{row.witnessName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'students' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Mã HS</th>
                      <th className="border border-black p-1.5">Họ và tên</th>
                      <th className="border border-black p-1.5">Ngày sinh</th>
                      <th className="border border-black p-1.5">Giới</th>
                      <th className="border border-black p-1.5">Lớp</th>
                      <th className="border border-black p-1.5">Phụ huynh &amp; SĐT</th>
                      <th className="border border-black p-1.5">Địa chỉ</th>
                      <th className="border border-black p-1.5">Điểm danh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center font-mono">
                          {row.studentCode}
                        </td>
                        <td className="border border-black p-1.5 font-semibold">{row.fullName}</td>
                        <td className="border border-black p-1.5 text-center">{row.dob}</td>
                        <td className="border border-black p-1.5 text-center">{row.gender}</td>
                        <td className="border border-black p-1.5 text-center">{row.className}</td>
                        <td className="border border-black p-1.5">
                          {row.parentName} ({row.parentPhone})
                        </td>
                        <td className="border border-black p-1.5">{row.address}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">
                          {row.attendanceStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'health' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Họ và tên trẻ</th>
                      <th className="border border-black p-1.5">Lớp</th>
                      <th className="border border-black p-1.5">Chiều cao (cm)</th>
                      <th className="border border-black p-1.5">Cân nặng (kg)</th>
                      <th className="border border-black p-1.5">Kênh dinh dưỡng</th>
                      <th className="border border-black p-1.5">Tiêm chủng</th>
                      <th className="border border-black p-1.5">Sức khỏe chung</th>
                      <th className="border border-black p-1.5">Giáo viên / Người đo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 font-semibold">
                          {row.studentName}
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.className}</td>
                        <td className="border border-black p-1.5 text-center">{row.heightCm}</td>
                        <td className="border border-black p-1.5 text-center">{row.weightKg}</td>
                        <td className="border border-black p-1.5 font-semibold">
                          {row.nutritionStatus}
                        </td>
                        <td className="border border-black p-1.5">{row.vaccinationStatus}</td>
                        <td className="border border-black p-1.5">{row.generalHealth}</td>
                        <td className="border border-black p-1.5 text-center">
                          {row.doctorOrExaminer}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'staff' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Mã CB</th>
                      <th className="border border-black p-1.5">Họ và tên</th>
                      <th className="border border-black p-1.5">Giới</th>
                      <th className="border border-black p-1.5">Chức vụ</th>
                      <th className="border border-black p-1.5">Trình độ / Bằng cấp</th>
                      <th className="border border-black p-1.5">Phân công</th>
                      <th className="border border-black p-1.5">SĐT</th>
                      <th className="border border-black p-1.5">Giấy VSATTP / Khám SK</th>
                      <th className="border border-black p-1.5">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 text-center font-mono">
                          {row.staffCode}
                        </td>
                        <td className="border border-black p-1.5 font-semibold">{row.fullName}</td>
                        <td className="border border-black p-1.5 text-center">{row.gender}</td>
                        <td className="border border-black p-1.5 font-medium">{row.role}</td>
                        <td className="border border-black p-1.5">{row.qualification}</td>
                        <td className="border border-black p-1.5">{row.assignedClassOrDept}</td>
                        <td className="border border-black p-1.5 text-center">{row.phone}</td>
                        <td className="border border-black p-1.5 text-[11px]">
                          ATTP: {row.hygieneCertDate} <br />
                          Khám SK: {row.healthCheckDate}
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'lessonPlans' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">STT</th>
                      <th className="border border-black p-1.5">Tên kế hoạch bài dạy</th>
                      <th className="border border-black p-1.5">Khối lớp</th>
                      <th className="border border-black p-1.5">Giáo viên soạn</th>
                      <th className="border border-black p-1.5">Tuần / Ngày</th>
                      <th className="border border-black p-1.5">Lĩnh vực phát triển</th>
                      <th className="border border-black p-1.5">Trạng thái phê duyệt</th>
                      <th className="border border-black p-1.5">Người duyệt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {normalizedData.map((row: any, idx: number) => (
                      <tr key={row.id || idx}>
                        <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                        <td className="border border-black p-1.5 font-semibold">
                          {row.title} <br />
                          <span className="italic text-[11px] font-normal">{row.theme}</span>
                        </td>
                        <td className="border border-black p-1.5 text-center">{row.targetClass}</td>
                        <td className="border border-black p-1.5 text-center">{row.teacherName}</td>
                        <td className="border border-black p-1.5 text-center">
                          Tuần {row.weekNumber} <br />
                          <span className="text-[11px]">{row.dateRange}</span>
                        </td>
                        <td className="border border-black p-1.5">{row.developmentField}</td>
                        <td className="border border-black p-1.5 text-center font-semibold">
                          {row.approvalStatus}
                        </td>
                        <td className="border border-black p-1.5 text-center">
                          {row.approverName} ({row.approvalDate})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {moduleId === 'finance' && (
                <>
                  {financeView === 'transactions' ? (
                    <table className="w-full border-collapse border border-black text-xs text-black">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-black p-1.5 w-8">STT</th>
                          <th className="border border-black p-1.5 w-20">Ngày</th>
                          <th className="border border-black p-1.5 w-20">Số phiếu</th>
                          <th className="border border-black p-1.5">Khoản mục &amp; Diễn giải nội dung</th>
                          <th className="border border-black p-1.5">Người nộp / nhận</th>
                          <th className="border border-black p-1.5 text-right w-24">Khoản Thu (+)</th>
                          <th className="border border-black p-1.5 text-right w-24">Khoản Chi (-)</th>
                          <th className="border border-black p-1.5 text-center w-20">Hình thức</th>
                        </tr>
                      </thead>
                      <tbody>
                        {normalizedData.map((t: any, idx: number) => (
                          <tr key={t.id || idx}>
                            <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                            <td className="border border-black p-1.5 text-center">{t.date}</td>
                            <td className="border border-black p-1.5 font-mono text-center">{t.receiptNumber}</td>
                            <td className="border border-black p-1.5 font-semibold">
                              {t.category} {t.notes && <span className="font-normal italic">({t.notes})</span>}
                            </td>
                            <td className="border border-black p-1.5">{t.payerOrReceiver}</td>
                            <td className="border border-black p-1.5 text-right font-bold">
                              {t.type === 'thu' ? formatMoney(t.amount) : '-'}
                            </td>
                            <td className="border border-black p-1.5 text-right font-bold">
                              {t.type === 'chi' ? formatMoney(t.amount) : '-'}
                            </td>
                            <td className="border border-black p-1.5 text-center">{t.method}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-100 font-bold">
                          <td colSpan={5} className="border border-black p-2 text-center uppercase">
                            TỔNG CỘNG THU CHI
                          </td>
                          <td className="border border-black p-2 text-right font-bold">
                            {formatMoney(
                              normalizedData
                                .filter((x: any) => x.type === 'thu')
                                .reduce((s: number, x: any) => s + (Number(x.amount) || 0), 0)
                            )}
                          </td>
                          <td className="border border-black p-2 text-right font-bold">
                            {formatMoney(
                              normalizedData
                                .filter((x: any) => x.type === 'chi')
                                .reduce((s: number, x: any) => s + (Number(x.amount) || 0), 0)
                            )}
                          </td>
                          <td className="border border-black p-2 text-center">---</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full border-collapse border border-black text-xs text-black">
                      <thead>
                        <tr className="bg-slate-100 font-bold text-center">
                          <th className="border border-black p-1.5 w-8">STT</th>
                          <th className="border border-black p-1.5">Họ và tên</th>
                          <th className="border border-black p-1.5">Chức vụ / Lớp</th>
                          <th className="border border-black p-1.5 text-right">Lương cơ bản</th>
                          <th className="border border-black p-1.5 text-right">PC Trách nhiệm</th>
                          <th className="border border-black p-1.5 text-right">PC Ăn trưa</th>
                          <th className="border border-black p-1.5 text-right">Thưởng</th>
                          <th className="border border-black p-1.5 text-center w-12">Công</th>
                          <th className="border border-black p-1.5 text-right">Khấu trừ BHXH</th>
                          <th className="border border-black p-1.5 text-right font-bold">THỰC LĨNH</th>
                          <th className="border border-black p-1.5 text-center w-24">Ký nhận</th>
                        </tr>
                      </thead>
                      <tbody>
                        {normalizedData.map((s: any, idx: number) => (
                          <tr key={s.id || idx}>
                            <td className="border border-black p-1.5 text-center">{idx + 1}</td>
                            <td className="border border-black p-1.5 font-bold">{s.staffName}</td>
                            <td className="border border-black p-1.5">{s.role}</td>
                            <td className="border border-black p-1.5 text-right">{formatMoney(s.baseSalary)}</td>
                            <td className="border border-black p-1.5 text-right">{formatMoney(s.allowanceResponsibility)}</td>
                            <td className="border border-black p-1.5 text-right">{formatMoney(s.allowanceLunch)}</td>
                            <td className="border border-black p-1.5 text-right">{formatMoney(s.bonus)}</td>
                            <td className="border border-black p-1.5 text-center font-semibold">
                              {s.workDaysActual}/{s.workDaysStandard}
                            </td>
                            <td className="border border-black p-1.5 text-right">-{formatMoney(s.insuranceDeduction)}</td>
                            <td className="border border-black p-1.5 text-right font-bold">{formatMoney(s.netSalary)}</td>
                            <td className="border border-black p-1.5 text-center italic text-[10px]">
                              {s.paymentMethod === 'Chuyển khoản ngân hàng' ? 'Đã CK qua NH' : ''}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-100 font-bold">
                          <td colSpan={3} className="border border-black p-2 text-center uppercase">
                            TỔNG QUỸ LƯƠNG
                          </td>
                          <td className="border border-black p-2 text-right">
                            {formatMoney(normalizedData.reduce((s: number, x: any) => s + (Number(x.baseSalary) || 0), 0))}
                          </td>
                          <td className="border border-black p-2 text-right">
                            {formatMoney(normalizedData.reduce((s: number, x: any) => s + (Number(x.allowanceResponsibility) || 0), 0))}
                          </td>
                          <td className="border border-black p-2 text-right">
                            {formatMoney(normalizedData.reduce((s: number, x: any) => s + (Number(x.allowanceLunch) || 0), 0))}
                          </td>
                          <td className="border border-black p-2 text-right">
                            {formatMoney(normalizedData.reduce((s: number, x: any) => s + (Number(x.bonus) || 0), 0))}
                          </td>
                          <td className="border border-black p-2 text-center">---</td>
                          <td className="border border-black p-2 text-right">
                            -{formatMoney(normalizedData.reduce((s: number, x: any) => s + (Number(x.insuranceDeduction) || 0), 0))}
                          </td>
                          <td className="border border-black p-2 text-right font-bold">
                            {formatMoney(normalizedData.reduce((s: number, x: any) => s + (Number(x.netSalary) || 0), 0))}
                          </td>
                          <td className="border border-black p-2 text-center">---</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {moduleId === 'lightning' && (
                <table className="w-full border-collapse border border-black text-xs text-black">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-black p-1.5 w-10">Hạng mục kiểm tra</th>
                      <th className="border border-black p-1.5">Quy chuẩn áp dụng</th>
                      <th className="border border-black p-1.5">Số lượng hồ sơ</th>
                      <th className="border border-black p-1.5">Kết quả kiểm tra</th>
                      <th className="border border-black p-1.5">Người thực hiện</th>
                      <th className="border border-black p-1.5">Đánh giá chung</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-2 font-bold">Bước 1: Kiểm tra giao nhận</td>
                      <td className="border border-black p-2">Mục I &amp; II QĐ 1246/QĐ-BYT</td>
                      <td className="border border-black p-2 text-center">{step1Data.length || 10} nguyên liệu</td>
                      <td className="border border-black p-2 text-center font-bold text-emerald-800">100% ĐẠT CHUẨN</td>
                      <td className="border border-black p-2 text-center">{schoolInfo.inspectorName || schoolInfo.medicalStaffName}</td>
                      <td className="border border-black p-2">Thực phẩm tươi mới, nguồn gốc xuất xứ rõ ràng</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 font-bold">Bước 2: Quy trình chế biến</td>
                      <td className="border border-black p-2">Mục III QĐ 1246/QĐ-BYT</td>
                      <td className="border border-black p-2 text-center">{step2Data.length || 4} món ăn chính/phụ</td>
                      <td className="border border-black p-2 text-center font-bold text-emerald-800">100% ĐẠT CHUẨN</td>
                      <td className="border border-black p-2 text-center">{schoolInfo.headChefName || schoolInfo.receiverName}</td>
                      <td className="border border-black p-2">Bếp ăn 1 chiều, nấu chín sôi &gt;100°C đúng giờ</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 font-bold">Bước 3: Thử nếm &amp; chia ăn</td>
                      <td className="border border-black p-2">Mục IV QĐ 1246/QĐ-BYT</td>
                      <td className="border border-black p-2 text-center">{step3Data.length || 4} món ăn</td>
                      <td className="border border-black p-2 text-center font-bold text-emerald-800">100% ĐẠT CHUẨN</td>
                      <td className="border border-black p-2 text-center">{schoolInfo.inspectorName || schoolInfo.medicalStaffName}</td>
                      <td className="border border-black p-2">Thử nếm cảm quan đạt, nhiệt độ chia &gt;60°C</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-2 font-bold">Lưu mẫu thức ăn 24h</td>
                      <td className="border border-black p-2">Mục V QĐ 1246/QĐ-BYT</td>
                      <td className="border border-black p-2 text-center">{menuData.length || 4} mẫu thức ăn</td>
                      <td className="border border-black p-2 text-center font-bold text-emerald-800">100% ĐẠT CHUẨN</td>
                      <td className="border border-black p-2 text-center">{schoolInfo.sampleKeeperName || schoolInfo.medicalStaffName}</td>
                      <td className="border border-black p-2">Niêm phong hộp inox vô trùng, tủ lạnh 2-4°C</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Official Signature Section */}
            {!(moduleId === 'menu' && menuLayoutMode === 'weekly_matrix') && (
              <div className="mt-8 pt-4 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm leading-snug official-signature-grid print-avoid-break">
                <div>
                  <p className="font-bold uppercase">{signer1Title}</p>
                  <p className="italic text-xs text-slate-600">(Ký, ghi rõ họ tên)</p>
                  <div
                    className="official-signature-box"
                    style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                  >
                    {schoolInfo.creatorSignature ? (
                      <img src={schoolInfo.creatorSignature} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                    ) : (
                      <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{signer1Name || 'NGUYỄN THU HẰNG'}</p>
                </div>
                <div>
                  <p className="font-bold uppercase">{signer2Title}</p>
                  <p className="italic text-xs text-slate-600">(Ký, ghi rõ họ tên)</p>
                  <div
                    className="official-signature-box"
                    style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                  >
                    {signer2Signature ? (
                      <img src={signer2Signature} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                    ) : (
                      <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{signer2Name || 'NGUYỄN THỊ THU HƯƠNG'}</p>
                </div>
                <div>
                  <p className="font-bold uppercase">{signer3Title}</p>
                  <p className="italic text-xs text-slate-600">(Ký tên và đóng dấu)</p>
                  <div
                    className="official-signature-box"
                    style={{ height: '58px', minHeight: '58px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4px 0' }}
                  >
                    {schoolInfo.principalSignature ? (
                      <img src={schoolInfo.principalSignature} alt="Chữ ký" style={{ maxHeight: '52px', maxWidth: '130px', objectFit: 'contain', display: 'block' }} />
                    ) : (
                      <span style={{ display: 'inline-block', height: '52px', minHeight: '52px' }}>&nbsp;</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{signer3Name || schoolInfo.principalName || 'NGUYỄN THỊ MAI HOA'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info in Modal */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 print:hidden">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Biểu mẫu đã căn chỉnh chuẩn khổ giấy A4, nền trắng, chữ đen, viền bảng sắc nét.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

