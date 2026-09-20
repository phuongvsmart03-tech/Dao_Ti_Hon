// components/modules/WordDocumentViewer.tsx
// Trình Xem & Xuất Bản Bộ Giáo Án Hoàn Chỉnh Mầm Non Chuẩn Template Microsoft Word (.doc)
// Tích hợp Đầy đủ Khung Trang A4, Mục Lục Điều Hướng, In Chuẩn Form và Xuất Tệp Word

'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  Search,
  ChevronRight,
  Sparkles,
  School,
  Calendar,
  Layers,
  Award,
  ArrowLeft,
} from 'lucide-react';
import {
  PreschoolThemeFullDossier,
  THEME_1_DOSSIER,
  exportToWordDocument,
  findLessonByObjectiveCode,
} from '@/lib/preschool-full-dossiers';
import { PreschoolAdminInfo } from '@/lib/preschool-curriculum-data';
import { openPrintBlobWindow } from '@/lib/print-helper';
import { generateCoverPageHtml, generateTimetableAndScheduleHtml } from '@/lib/preschool-print-templates';

interface WordDocumentViewerProps {
  adminInfo: PreschoolAdminInfo;
  currentThemeDossier?: PreschoolThemeFullDossier;
  highlightObjectiveCode?: string;
  onClose?: () => void;
  onOpenAiAssistant?: () => void;
}

export default function WordDocumentViewer({
  adminInfo,
  currentThemeDossier = THEME_1_DOSSIER,
  highlightObjectiveCode,
  onClose,
  onOpenAiAssistant,
}: WordDocumentViewerProps) {
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(currentThemeDossier.themeNumber - 1);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [activeSectionId, setActiveSectionId] = useState<string>('section-cover');
  const [copied, setCopied] = useState(false);
  const documentContainerRef = useRef<HTMLDivElement>(null);

  // Danh sách các chủ đề
  const themeList = [
    { num: 1, title: 'Lớp mẫu giáo của bé (2 tuần)' },
    { num: 2, title: 'Ngôi nhà thân yêu của bé (3 tuần)' },
    { num: 3, title: 'Bản thân (4 tuần)' },
    { num: 4, title: 'Những nghề bé biết (4 tuần)' },
    { num: 5, title: 'Những con vật yêu thích (4 tuần)' },
    { num: 6, title: 'Cây, hoa, quả (3 tuần)' },
    { num: 7, title: 'Bé đi đường an toàn (4 tuần)' },
    { num: 8, title: 'Sự kì diệu của nước (4 tuần)' },
    { num: 9, title: 'Phố phường, bản làng em (3 tuần)' },
    { num: 10, title: 'Tạm biệt lớp 3 tuổi (2 tuần)' },
  ];

  // Nếu có highlightObjectiveCode, tự động xác định chủ đề và ngày áp dụng
  useEffect(() => {
    if (highlightObjectiveCode) {
      const match = findLessonByObjectiveCode(highlightObjectiveCode);
      if (match) {
        const timer = setTimeout(() => {
          setSelectedThemeIndex(match.themeNumber - 1);
          const targetEl = document.getElementById(`section-day-${match.dayOfWeek.toLowerCase()}`);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            setActiveSectionId(`section-day-${match.dayOfWeek.toLowerCase()}`);
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightObjectiveCode]);

  // Dossier của chủ đề hiện đang chọn
  const dossier = THEME_1_DOSSIER; // Mặc định hoặc nạp tương ứng
  const currentWeek = dossier.weeks[selectedWeekIndex] || dossier.weeks[0];

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = () => {
    const coverHtml = generateCoverPageHtml(adminInfo, dossier.bookTitle, dossier.ageGroup.toUpperCase());
    const timetableHtml = generateTimetableAndScheduleHtml(adminInfo, dossier.ageGroup.toUpperCase());

    const daysHtml = currentWeek.days
      .map(
        (day) => `
        <div style="page-break-before: always; padding: 20px 0; font-family: 'Times New Roman', serif;">
          <h3 style="font-size: 14pt; font-weight: bold; text-align: center; text-transform: uppercase; color: #1e3a8a; margin-bottom: 8px;">
            KẾ HOẠCH BÀI DẠY: THỨ ${day.dayOfWeek.toUpperCase()} (${day.dateText})
          </h3>
          <p style="text-align: center; font-style: italic; margin-bottom: 15px;">
            <strong>Lĩnh vực:</strong> ${day.domain} | <strong>Hoạt động:</strong> ${day.activityName}
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;" border="1">
            <tr style="background-color: #f8fafc;">
              <td style="padding: 6px; font-weight: bold; width: 25%;">Đề tài bài dạy:</td>
              <td style="padding: 6px; font-weight: bold; color: #0f172a; font-size: 12pt;">${day.lessonTopic}</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-weight: bold;">Mô hình:</td>
              <td style="padding: 6px;">${day.steamMethod} (${day.targetCodes.join(', ')})</td>
            </tr>
          </table>

          <h4 style="font-size: 12pt; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
            I. MỤC ĐÍCH YÊU CẦU:
          </h4>
          <p><strong>1. Kiến thức:</strong></p>
          <ul>${day.aims.knowledge.map((k) => `<li>${k}</li>`).join('')}</ul>
          <p><strong>2. Kỹ năng:</strong></p>
          <ul>${day.aims.skills.map((s) => `<li>${s}</li>`).join('')}</ul>
          <p><strong>3. Thái độ:</strong></p>
          <ul>${day.aims.attitudes.map((a) => `<li>${a}</li>`).join('')}</ul>
          ${day.aims.integrationHCM ? `<p><strong>* Lồng ghép Tư tưởng Hồ Chí Minh:</strong> ${day.aims.integrationHCM}</p>` : ''}
          ${day.aims.genderIntegration ? `<p><strong>* Lồng ghép Giới tính:</strong> ${day.aims.genderIntegration}</p>` : ''}

          <h4 style="font-size: 12pt; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
            II. CHUẨN BỊ:
          </h4>
          <p><strong>- Giáo viên:</strong> ${day.preparation.teacher.join('; ')}</p>
          <p><strong>- Trẻ em:</strong> ${day.preparation.students.join('; ')}</p>

          <h4 style="font-size: 12pt; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
            III. TIẾN TRÌNH HOẠT ĐỘNG DẠY HỌC (STEAM 5E):
          </h4>
          <p><strong>1. Gắn kết (Engage):</strong></p>
          <ul>${day.steps.step1_engage.map((s) => `<li>${s}</li>`).join('')}</ul>
          <p><strong>2. Khám phá (Explore):</strong></p>
          <ul>${day.steps.step2_explore.map((s) => `<li>${s}</li>`).join('')}</ul>
          <p><strong>3. Giải thích / Chia sẻ (Explain):</strong></p>
          <ul>${day.steps.step3_explain.map((s) => `<li>${s}</li>`).join('')}</ul>
          <p><strong>4. Áp dụng / Củng cố (Elaborate):</strong></p>
          <ul>${day.steps.step4_elaborate.map((s) => `<li>${s}</li>`).join('')}</ul>
          <p><strong>5. Đánh giá (Evaluate):</strong></p>
          <ul>${day.steps.step5_evaluate.map((s) => `<li>${s}</li>`).join('')}</ul>

          <h4 style="font-size: 12pt; font-weight: bold; margin-top: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px;">
            IV. HOẠT ĐỘNG KHÁC TRONG NGÀY:
          </h4>
          <p><strong>1. Hoạt động ngoài trời:</strong> Quan sát: ${day.outdoorActivity.focusedObservation} | TCVĐ: ${day.outdoorActivity.movementGame} | TCDG: ${day.outdoorActivity.folkGame || 'Chơi tự do'}</p>
          <p><strong>2. Hoạt động góc:</strong> ${day.cornerActivities}</p>
          <p><strong>3. Hoạt động chiều:</strong> ${day.afternoonActivity.reinforcement} - Trò chơi: ${day.afternoonActivity.game} - ${day.afternoonActivity.hygieneAndRewards}</p>
        </div>
      `
      )
      .join('');

    const bodyHtml = `
      ${coverHtml}
      <div style="page-break-before: always;">
        ${timetableHtml}
      </div>
      ${daysHtml}
    `;

    openPrintBlobWindow(bodyHtml, dossier.bookTitle, 'portrait');
  };

  const handleCopyAll = () => {
    if (documentContainerRef.current) {
      const text = documentContainerRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col -m-4 sm:-m-6">
      {/* 1. THANH CÔNG CỤ SOẠN THẢO CHUẨN WORD (Microsoft Word Style Ribbon Header) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-300 shadow-sm px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                  BỘ GIÁO ÁN MẦM NON (WORD TEMPLATE)
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                  {dossier.ageGroup}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight truncate max-w-xs md:max-w-md">
                {dossier.bookTitle} — {currentWeek.weekTitle || currentWeek.weekName || `Tuần ${currentWeek.weekNumber}`}
              </h2>
            </div>
          </div>
        </div>

        {/* Action Controls & Dropdowns */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Chọn Chủ đề */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
            <Layers className="w-3.5 h-3.5 text-indigo-700" />
            <select
              value={selectedThemeIndex}
              onChange={(e) => setSelectedThemeIndex(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
            >
              {themeList.map((t, idx) => (
                <option key={t.num} value={idx}>
                  Chủ đề {t.num}: {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Chọn Tuần */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-blue-700" />
            <select
              value={selectedWeekIndex}
              onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 outline-hidden cursor-pointer"
            >
              {dossier.weeks.map((w, idx) => (
                <option key={w.weekNumber} value={idx}>
                  Tuần {w.weekNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Nút In / Xuất PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            title="In toàn bộ giáo án ra giấy A4 chuẩn hoặc xuất file PDF"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>In / Xuất PDF</span>
          </button>

          {/* Nút Tải Word .doc */}
          <button
            type="button"
            onClick={() => exportToWordDocument(dossier, adminInfo, selectedWeekIndex)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            title="Tải tệp văn bản Microsoft Word (.doc) hoàn chỉnh đã soạn"
          >
            <Download className="w-3.5 h-3.5 text-emerald-200" />
            <span>Tải File Word (.doc)</span>
          </button>

          {/* Nút Sao chép */}
          <button
            type="button"
            onClick={handleCopyAll}
            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all"
            title="Sao chép toàn bộ văn bản giáo án"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>
      </header>

      {/* Thông báo Highlight Mục tiêu nếu mở từ Tab Mục tiêu */}
      {highlightObjectiveCode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-950" />
            <span>
              🎯 Bạn đang xem bộ giáo án hoàn chỉnh áp dụng Mục tiêu{' '}
              <span className="underline uppercase">{highlightObjectiveCode}</span> ({findLessonByObjectiveCode(highlightObjectiveCode).lessonTopic})
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const match = findLessonByObjectiveCode(highlightObjectiveCode);
              const targetEl = document.getElementById(`section-day-${match.dayOfWeek.toLowerCase()}`);
              if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2 py-0.5 bg-slate-950 text-white rounded text-[11px] hover:bg-slate-800 cursor-pointer"
          >
            Đến bài dạy Thứ {findLessonByObjectiveCode(highlightObjectiveCode).dayOfWeek}
          </button>
        </div>
      )}

      {/* 2. THÂN GIAO DIỆN (SIDEBAR MỤC LỤC + CANVAS TRANG A4) */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full p-4 md:p-6 gap-6 items-start">
        {/* SIDEBAR MỤC LỤC ĐIỀU HƯỚNG NHANH */}
        <aside className="w-64 shrink-0 sticky top-16 hidden lg:block bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              Mục lục Giáo án
            </span>
            <span className="text-[10px] text-slate-400 font-bold">10 Trang</span>
          </div>

          <nav className="space-y-1 text-xs font-medium text-slate-700">
            <button
              type="button"
              onClick={() => scrollToSection('section-cover')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                activeSectionId === 'section-cover' ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span>1. Trang Bìa Hồ Sơ</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-timetable')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                activeSectionId === 'section-timetable' ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span>2. Thời Khóa Biểu & TGB</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-objectives')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                activeSectionId === 'section-objectives' ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span>3. Kế hoạch Mục tiêu GD</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-environment')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                activeSectionId === 'section-environment' ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span>4. Môi trường Giáo dục</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('section-week-matrix')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                activeSectionId === 'section-week-matrix' ? 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-700' : 'hover:bg-slate-50'
              }`}
            >
              <span>5. Kế hoạch Tuần 7 Thời điểm</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>

            <div className="pt-2 pb-1 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2">
                Bài soạn chi tiết từng ngày (STEAM 5E):
              </span>
            </div>

            {currentWeek.days.map((day) => (
              <button
                key={day.dayOfWeek}
                type="button"
                onClick={() => scrollToSection(`section-day-${day.dayOfWeek.toLowerCase()}`)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                  activeSectionId === `section-day-${day.dayOfWeek.toLowerCase()}`
                    ? 'bg-indigo-50 text-indigo-900 font-bold border-l-2 border-indigo-700'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="truncate">
                  <span className="font-bold">Thứ {day.dayOfWeek}:</span>{' '}
                  <span className="text-slate-600 truncate">{day.lessonTopic}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
            ))}
          </nav>
        </aside>

        {/* TRANG GIẤY CHUẨN A4 (DOCUMENT CANVAS) */}
        <main className="flex-1 w-full space-y-8" ref={documentContainerRef}>
          {/* TRANG 1: TRANG BÌA HỒ SƠ */}
          <section
            id="section-cover"
            className="bg-white rounded-xs border border-slate-300 shadow-md p-8 md:p-12 min-h-[29.7cm] flex flex-col justify-between font-serif relative"
          >
            {/* Double Frame viền đôi chuẩn hồ sơ văn thư */}
            <div className="border-[3px] border-double border-slate-900 p-8 h-full flex flex-col justify-between">
              <div className="text-center space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {adminInfo.unitName}
                </p>
                <h3 className="text-sm font-black uppercase text-blue-900 tracking-wider">
                  {adminInfo.schoolName}
                </h3>
                <div className="w-32 border-b-2 border-slate-900 mx-auto pt-1"></div>

                <div className="pt-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-900">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </p>
                  <p className="text-xs font-bold italic underline text-slate-700">
                    Độc lập - Tự do - Hạnh phúc
                  </p>
                </div>
              </div>

              {/* Tiêu đề quyển */}
              <div className="text-center my-12 space-y-4">
                <p className="text-base font-bold uppercase tracking-widest text-slate-700">
                  KẾ HOẠCH CHĂM SÓC & GIÁO DỤC TRẺ
                </p>
                <p className="text-lg font-black uppercase text-blue-900">
                  {dossier.ageGroup}
                </p>
                <div className="border-2 border-red-700 bg-red-50/40 p-4 inline-block rounded-xs shadow-2xs">
                  <h1 className="text-2xl font-black uppercase tracking-wider text-red-800">
                    {dossier.bookTitle}
                  </h1>
                </div>
              </div>

              {/* Chân trang bìa */}
              <div className="w-4/5 mx-auto text-xs space-y-2 text-slate-900 border-t border-slate-200 pt-6">
                <div className="flex justify-between">
                  <span className="font-bold">Giáo viên soạn / phụ trách:</span>
                  <span className="font-bold text-blue-900">{adminInfo.teachers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Người duyệt / Chuyên môn BGH:</span>
                  <span className="font-bold text-emerald-900">{adminInfo.approver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Lớp / Nhóm tuổi:</span>
                  <span className="font-bold">{dossier.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Thời gian thực hiện:</span>
                  <span>{dossier.dateRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Năm học:</span>
                  <span className="font-bold">{adminInfo.schoolYear}</span>
                </div>
              </div>
            </div>
          </section>

          {/* TRANG 2: THỜI KHÓA BIỂU & THỜI GIAN BIỂU */}
          <section
            id="section-timetable"
            className="bg-white rounded-xs border border-slate-300 shadow-md p-8 md:p-12 font-serif text-xs space-y-6"
          >
            <div className="text-center border-b border-slate-300 pb-3">
              <h2 className="text-base font-black uppercase text-slate-900">
                THỜI KHÓA BIỂU & THỜI GIAN BIỂU HOẠT ĐỘNG
              </h2>
              <p className="text-slate-600 italic">
                {dossier.ageGroup} — Năm học: {adminInfo.schoolYear} ({adminInfo.schoolName})
              </p>
            </div>

            {/* Bảng thời khóa biểu 5 ngày */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase">
                1. Thời khóa biểu hoạt động học trong tuần (5 ngày)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-900 text-center">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="border border-slate-900 p-2 w-28">Thứ</th>
                      <th className="border border-slate-900 p-2 w-24">Tiết</th>
                      <th className="border border-slate-900 p-2 text-left">Hoạt động giáo dục trong ngày</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.timetable.map((t) => (
                      <tr key={t.day}>
                        <td className="border border-slate-900 p-2 font-bold">{t.day}</td>
                        <td className="border border-slate-900 p-2">{t.period}</td>
                        <td className="border border-slate-900 p-2 text-left">
                          <ul className="list-disc pl-4 space-y-0.5">
                            {t.subjects.map((sub, i) => (
                              <li key={i}>{sub}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng thời gian biểu 1 ngày */}
            <div className="space-y-2 pt-4">
              <h4 className="font-bold text-slate-900 uppercase">
                2. Thời gian biểu chế độ sinh hoạt 1 ngày bán trú (Từ 6h45 đến 17h00)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-900">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-slate-900 p-2 w-48">Khung thời gian</th>
                      <th className="border border-slate-900 p-2 text-left">Hoạt động giáo dục & Chế độ sinh hoạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.dailySchedule.map((s, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-900 p-2 font-bold text-center">{s.time}</td>
                        <td className="border border-slate-900 p-2">{s.activity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* TRANG 3: KẾ HOẠCH MỤC TIÊU GD & MA TRẬN NỘI DUNG */}
          <section
            id="section-objectives"
            className="bg-white rounded-xs border border-slate-300 shadow-md p-8 md:p-12 font-serif text-xs space-y-4"
          >
            <div className="text-center border-b border-slate-300 pb-3">
              <h2 className="text-base font-black uppercase text-slate-900">
                KẾ HOẠCH NỘI DUNG GIÁO DỤC {dossier.title}
              </h2>
              <p className="text-slate-600 italic">
                Thời gian thực hiện: {dossier.dateRange} ({dossier.totalWeeks} Tuần)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-900">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center">
                    <th className="border border-slate-900 p-2 w-28">Mục tiêu GD</th>
                    <th className="border border-slate-900 p-2 text-left">Nội dung giáo dục năm học</th>
                    <th className="border border-slate-900 p-2 text-left">Hoạt động giáo dục áp dụng</th>
                  </tr>
                </thead>
                <tbody>
                  {dossier.objectivesMatrix.map((item, idx) => (
                    <tr
                      key={idx}
                      className={highlightObjectiveCode === item.targetCode ? 'bg-amber-100 font-bold' : ''}
                    >
                      <td className="border border-slate-900 p-2 text-center font-bold text-blue-900">
                        {item.targetCode}
                      </td>
                      <td className="border border-slate-900 p-2">{item.content}</td>
                      <td className="border border-slate-900 p-2 font-medium">{item.activityMapping}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* TRANG 4: MÔI TRƯỜNG GIÁO DỤC */}
          <section
            id="section-environment"
            className="bg-white rounded-xs border border-slate-300 shadow-md p-8 md:p-12 font-serif text-xs space-y-4"
          >
            <div className="text-center border-b border-slate-300 pb-3">
              <h2 className="text-base font-black uppercase text-slate-900">
                KẾ HOẠCH XÂY DỰNG MÔI TRƯỜNG GIÁO DỤC
              </h2>
              <p className="text-slate-600 italic">Chủ đề: {dossier.title}</p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-slate-900 uppercase">I. Môi trường vật chất bên trong lớp:</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {dossier.environmentPlanning.indoor.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase">II. Môi trường giáo dục vật chất bên ngoài:</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {dossier.environmentPlanning.outdoor.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase">III. Môi trường tâm lý - xã hội an toàn, thân thiện:</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  {dossier.environmentPlanning.social.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* TRANG 5: KẾ HOẠCH TUẦN CHI TIẾT 7 THỜI ĐIỂM */}
          <section
            id="section-week-matrix"
            className="bg-white rounded-xs border border-slate-300 shadow-md p-8 md:p-12 font-serif text-xs space-y-4"
          >
            <div className="text-center border-b border-slate-300 pb-3">
              <h2 className="text-base font-black uppercase text-slate-900">
                KẾ HOẠCH GIÁO DỤC {(currentWeek.weekTitle || currentWeek.weekName || `TUẦN ${currentWeek.weekNumber}`).toUpperCase()}
              </h2>
              <p className="text-slate-600 italic">
                Thời gian thực hiện: {currentWeek.duration} | Giáo viên phụ trách: {adminInfo.teachers}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-900">
                <thead>
                  <tr className="bg-slate-100 font-bold text-center">
                    <th className="border border-slate-900 p-2 w-32">Thời điểm</th>
                    {currentWeek.days.map((d) => (
                      <th key={d.dayOfWeek} className="border border-slate-900 p-2">
                        Thứ {d.dayOfWeek}
                        <br />
                        <span className="font-normal text-[10px] text-slate-600">{d.dateText}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-900 p-2 font-bold bg-slate-50">1. Đón trẻ & TD sáng</td>
                    <td colSpan={5} className="border border-slate-900 p-2">
                      <p>{currentWeek.morningRoutine.welcome}</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        * Bài tập phát triển chung:{' '}
                        <span className="font-normal">
                          Hô hấp ({currentWeek.morningRoutine.exercise.breathing}); Tay ({currentWeek.morningRoutine.exercise.arms}); Bụng ({currentWeek.morningRoutine.exercise.torso}); Chân ({currentWeek.morningRoutine.exercise.legs}); Bật ({currentWeek.morningRoutine.exercise.jumping}).
                        </span>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-900 p-2 font-bold bg-slate-50">2. Hoạt động học (STEAM)</td>
                    {currentWeek.days.map((d) => (
                      <td key={d.dayOfWeek} className="border border-slate-900 p-2 font-bold text-blue-900">
                        {d.lessonTopic}
                        <span className="block font-normal text-[10px] text-slate-500">{d.domain}</span>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="border border-slate-900 p-2 font-bold bg-slate-50">3. Hoạt động góc</td>
                    <td colSpan={5} className="border border-slate-900 p-2">
                      <div className="space-y-1">
                        {currentWeek.cornerSetup.map((c, i) => (
                          <div key={i}>
                            <strong>- {c.cornerName}:</strong> {c.activities}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-900 p-2 font-bold bg-slate-50">4. Hoạt động ngoài trời</td>
                    {currentWeek.days.map((d) => (
                      <td key={d.dayOfWeek} className="border border-slate-900 p-2">
                        <p><strong>- QSCMĐ:</strong> {d.outdoorActivity.focusedObservation}</p>
                        <p><strong>- TCVĐ:</strong> {d.outdoorActivity.movementGame}</p>
                        <p><strong>- Tự do:</strong> {d.outdoorActivity.freePlay}</p>
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="border border-slate-900 p-2 font-bold bg-slate-50">5. Ăn, ngủ trưa</td>
                    <td colSpan={5} className="border border-slate-900 p-2">
                      Rèn kỹ năng rửa tay bằng xà phòng trước và sau khi ăn, lau miệng sạch sẽ, không nói chuyện trong bữa ăn; ngủ trưa ngon giấc.
                    </td>
                  </tr>

                  <tr>
                    <td className="border border-slate-900 p-2 font-bold bg-slate-50">6. Hoạt động chiều</td>
                    {currentWeek.days.map((d) => (
                      <td key={d.dayOfWeek} className="border border-slate-900 p-2">
                        {d.afternoonActivity.reinforcement}
                      </td>
                    ))}
                  </tr>

                  <tr>
                    <td className="border border-slate-900 p-2 font-bold bg-slate-50">7. Trả trẻ</td>
                    <td colSpan={5} className="border border-slate-900 p-2">
                      Dọn dẹp đồ chơi ngăn nắp, chuẩn bị đồ dùng cá nhân, nhắc trẻ chào cô và ba mẹ ra về an toàn.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Ký duyệt cuối kế hoạch tuần */}
            <div className="pt-6 grid grid-cols-2 text-center text-xs">
              <div>
                <p className="font-bold uppercase">PHÓ HIỆU TRƯỞNG CHUYÊN MÔN</p>
                <p className="italic text-slate-500 mt-1">(Ký và duyệt kế hoạch)</p>
                <div className="h-14 flex items-center justify-center font-serif text-slate-400 italic">
                  (Đã ký duyệt)
                </div>
                <p className="font-bold text-slate-900">{adminInfo.approver}</p>
              </div>

              <div>
                <p className="italic text-slate-500">Liên Hương, ngày .... tháng .... năm 2025</p>
                <p className="font-bold uppercase mt-0.5">GIÁO VIÊN SOẠN BÀI</p>
                <div className="h-14 flex items-center justify-center font-serif text-slate-400 italic">
                  (Đã ký tên)
                </div>
                <p className="font-bold text-slate-900">{adminInfo.teachers}</p>
              </div>
            </div>
          </section>

          {/* TRANG 6 ĐẾN 10: BÀI SOẠN CHI TIẾT TỪNG NGÀY (THỨ 2 ĐẾN THỨ 6) */}
          {currentWeek.days.map((day, dayIndex) => (
            <article
              key={day.dayOfWeek}
              id={`section-day-${day.dayOfWeek.toLowerCase()}`}
              className="bg-white rounded-xs border border-slate-300 shadow-md p-8 md:p-12 font-serif text-xs space-y-5"
            >
              {/* Header ngày */}
              <div className="text-center border-b-2 border-slate-900 pb-3">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  {day.domain}
                </span>
                <h3 className="text-base font-black uppercase text-slate-900 mt-1">
                  KẾ HOẠCH BÀI DẠY CHI TIẾT: THỨ {day.dayOfWeek.toUpperCase()} ({day.dateText})
                </h3>
                <p className="text-sm font-bold text-blue-900 mt-0.5">
                  ĐỀ TÀI: {day.lessonTopic} ({day.steamMethod})
                </p>
              </div>

              {/* Thông tin bài dạy */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <strong>Hoạt động:</strong> {day.activityName}
                </div>
                <div>
                  <strong>Phương pháp:</strong> {day.steamMethod}
                </div>
                <div>
                  <strong>Mục tiêu áp dụng:</strong>{' '}
                  <span className="font-bold text-blue-900">{day.targetCodes.join(', ')}</span>
                </div>
                <div>
                  <strong>Thời gian thực hiện:</strong> {day.dateText} (20 - 25 phút)
                </div>
              </div>

              {/* I. MỤC ĐÍCH YÊU CẦU */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
                  I. Mục đích yêu cầu:
                </h4>
                <div>
                  <strong className="block text-slate-800">1. Kiến thức:</strong>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {day.aims.knowledge.map((k, idx) => (
                      <li key={idx}>{k}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="block text-slate-800">2. Kỹ năng:</strong>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {day.aims.skills.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong className="block text-slate-800">3. Thái độ:</strong>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {day.aims.attitudes.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>

                {day.aims.integrationHCM && (
                  <p className="text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                    <strong>* Tích hợp Tư tưởng, đạo đức, phong cách Hồ Chí Minh:</strong> {day.aims.integrationHCM}
                  </p>
                )}

                {day.aims.genderIntegration && (
                  <p className="text-purple-900 bg-purple-50 p-2 rounded border border-purple-200">
                    <strong>* Lồng ghép Giới tính & Bình đẳng:</strong> {day.aims.genderIntegration}
                  </p>
                )}
              </div>

              {/* II. CHUẨN BỊ */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
                  II. Chuẩn bị:
                </h4>
                <p>
                  <strong>- Về phía giáo viên:</strong> {day.preparation.teacher.join('; ')}
                </p>
                <p>
                  <strong>- Về phía trẻ:</strong> {day.preparation.students.join('; ')}
                </p>
              </div>

              {/* III. TIẾN TRÌNH HOẠT ĐỘNG (STEAM 5E) */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase border-b border-slate-200 pb-1">
                  III. Tiến trình tổ chức hoạt động học (Mô hình STEAM 5E):
                </h4>

                {/* Bước 1: Gắn kết */}
                <div className="bg-slate-50/70 p-3 rounded border border-slate-200 space-y-1">
                  <h5 className="font-bold text-blue-900 uppercase">1. Gắn kết (Engage):</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {day.steps.step1_engage.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Bước 2: Khám phá */}
                <div className="bg-slate-50/70 p-3 rounded border border-slate-200 space-y-1">
                  <h5 className="font-bold text-blue-900 uppercase">2. Khám phá (Explore):</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {day.steps.step2_explore.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Bước 3: Giải thích / Chia sẻ */}
                <div className="bg-slate-50/70 p-3 rounded border border-slate-200 space-y-1">
                  <h5 className="font-bold text-blue-900 uppercase">3. Giải thích / Chia sẻ (Explain):</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {day.steps.step3_explain.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Bước 4: Áp dụng / Củng cố */}
                <div className="bg-slate-50/70 p-3 rounded border border-slate-200 space-y-1">
                  <h5 className="font-bold text-blue-900 uppercase">4. Củng cố & Mở rộng (Elaborate):</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {day.steps.step4_elaborate.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Bước 5: Đánh giá */}
                <div className="bg-slate-50/70 p-3 rounded border border-slate-200 space-y-1">
                  <h5 className="font-bold text-blue-900 uppercase">5. Đánh giá (Evaluate):</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    {day.steps.step5_evaluate.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* IV. CÁC HOẠT ĐỘNG KHÁC TRONG NGÀY */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase">
                  IV. Các thời điểm hoạt động khác trong ngày:
                </h4>

                <div className="space-y-1">
                  <p>
                    <strong>1. Hoạt động ngoài trời:</strong>
                  </p>
                  <p className="pl-4">- Quan sát có chủ đích: {day.outdoorActivity.focusedObservation}</p>
                  <p className="pl-4">- Trò chơi vận động: {day.outdoorActivity.movementGame}</p>
                  <p className="pl-4">- Chơi tự do: {day.outdoorActivity.freePlay}</p>
                </div>

                <div className="space-y-1">
                  <p>
                    <strong>2. Chơi hoạt động ở các góc:</strong> {day.cornerActivities}
                  </p>
                </div>

                <div className="space-y-1">
                  <p>
                    <strong>3. Chơi hoạt động theo ý thích buổi chiều:</strong>
                  </p>
                  <p className="pl-4">- Ôn luyện: {day.afternoonActivity.reinforcement}</p>
                  <p className="pl-4">- Trò chơi: {day.afternoonActivity.game}</p>
                  <p className="pl-4">- Vệ sinh & Nêu gương: {day.afternoonActivity.hygieneAndRewards}</p>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
