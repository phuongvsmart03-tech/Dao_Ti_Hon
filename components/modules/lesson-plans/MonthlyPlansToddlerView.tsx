'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Printer,
  Share2,
  Users,
  Clock,
  BookOpen,
  Sparkles,
  ChevronRight,
  Check,
} from 'lucide-react';
import { MONTHLY_PLANS_25_36T } from '@/lib/preschool-all-json-data';
import { openPrintBlobWindow } from '@/lib/print-helper';
import { downloadAsWordDoc, copyFormattedContentForGoogleDocs } from '@/lib/google-docs-export';
import GoogleDocsSyncModal from './GoogleDocsSyncModal';

export default function MonthlyPlansToddlerView() {
  const [selectedPlanIdx, setSelectedPlanIdx] = useState<number>(0);
  const [isGoogleDocsModalOpen, setIsGoogleDocsModalOpen] = useState(false);
  const [copiedQuick, setCopiedQuick] = useState(false);

  const currentPlan = MONTHLY_PLANS_25_36T[selectedPlanIdx] || MONTHLY_PLANS_25_36T[0];

  const generateToddlerPlanHtml = (): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>KHGD Tháng: ${currentPlan.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 20px; font-size: 12pt; line-height: 1.4; }
          h2, h3, h4 { text-align: center; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; }
          th { background-color: #f1f5f9; font-weight: bold; text-align: center; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-weight: bold; margin: 0;">ỦY BAN NHÂN DÂN XÃ PHƯỚC THỂ</p>
          <p style="font-weight: bold; text-decoration: underline; margin: 0;">TRƯỜNG MẦM NON PHƯỚC THỂ</p>
          <h2 style="text-transform: uppercase; margin-top: 15px; color: #1e3a8a;">
            KẾ HOẠCH GIÁO DỤC THÁNG - CHỦ ĐỀ: ${currentPlan.title.toUpperCase()}
          </h2>
          <p style="font-style: italic;">
            Nhóm 25 - 36 Tháng • Thời gian: ${currentPlan.duration} • Giáo viên: ${currentPlan.teacher}
          </p>
        </div>

        ${currentPlan.weeks.map((w) => `
          <h3 style="text-align: left; margin-top: 20px; color: #0f172a;">${w.title}</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Thứ</th>
                <th style="width: 20%;">Ngày</th>
                <th>Hoạt động giáo dục trong ngày (Chế độ sinh hoạt & STEAM)</th>
              </tr>
            </thead>
            <tbody>
              ${w.schedule.map((s) => `
                <tr>
                  <td class="text-center font-bold">Thứ ${s.day}</td>
                  <td class="text-center">${s.date}</td>
                  <td class="font-bold" style="color: #1e3a8a;">${s.activity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `).join('')}

        <div style="margin-top: 35px; width: 100%;">
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none; text-align: center; width: 50%;">
                <p><strong>PHÓ HIỆU TRƯỞNG CHUYÊN MÔN</strong></p>
                <p style="font-style: italic;">(Đã duyệt)</p>
                <br><br><br>
                <p><strong>${currentPlan.approver}</strong></p>
              </td>
              <td style="border: none; text-align: center; width: 50%;">
                <p style="font-style: italic;">Phước Thể, ngày .... tháng .... năm 2025</p>
                <p><strong>GIÁO VIÊN LẬP KẾ HOẠCH</strong></p>
                <p style="font-style: italic;">(Ký và ghi rõ họ tên)</p>
                <br><br><br>
                <p><strong>${currentPlan.teacher}</strong></p>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const html = generateToddlerPlanHtml();
    openPrintBlobWindow(html, `KHGD_25_36T_${currentPlan.title}`);
  };

  const handleDownload = () => {
    const html = generateToddlerPlanHtml();
    downloadAsWordDoc(html, `KHGD_25_36T_${currentPlan.title.replace(/\s+/g, '_')}.doc`);
  };

  const handleQuickCopy = async () => {
    const html = generateToddlerPlanHtml();
    const ok = await copyFormattedContentForGoogleDocs(html);
    if (ok) {
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
            Chủ Đề Tháng (25-36T):
          </span>
          <select
            value={selectedPlanIdx}
            onChange={(e) => setSelectedPlanIdx(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-blue-950 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-80"
          >
            {MONTHLY_PLANS_25_36T.map((p, idx) => (
              <option key={idx} value={idx}>
                Chủ đề {p.themeNumber}: {p.title} ({p.duration})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <button
            onClick={() => setIsGoogleDocsModalOpen(true)}
            className="bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4 text-sky-600" />
            Đồng Bộ Google Docs
          </button>

          <button
            onClick={handleQuickCopy}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all border ${
              copiedQuick
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {copiedQuick ? (
              <>
                <Check className="w-4 h-4" /> Đã Copy!
              </>
            ) : (
              'Copy Cho Docs (Ctrl+V)'
            )}
          </button>

          <button
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            Tải Word (.doc)
          </button>

          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            In A4
          </button>
        </div>
      </div>

      {/* Main Content A4 Card */}
      <div className="bg-slate-200/70 p-4 md:p-8 rounded-2xl flex justify-center">
        <div
          className="w-full max-w-[820px] bg-white rounded-sm shadow-xl border border-slate-300/80 p-8 md:p-12 space-y-6"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-6">
            <p className="text-xs font-bold uppercase text-slate-800 tracking-wide mb-0.5">
              ỦY BAN NHÂN DÂN XÃ PHƯỚC THỂ
            </p>
            <p className="text-sm font-bold text-blue-950 underline underline-offset-4 tracking-wide">
              TRƯỜNG MẦM NON PHƯỚC THỂ
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-blue-950 uppercase mt-6 tracking-tight">
              KẾ HOẠCH GIÁO DỤC THÁNG: CHỦ ĐỀ {currentPlan.title.toUpperCase()}
            </h1>
            <p className="text-xs italic text-slate-600 mt-1">
              Nhóm Trẻ 25 - 36 Tháng • Thời gian thực hiện: {currentPlan.duration}
            </p>
            <p className="text-xs font-medium text-slate-800 mt-1">
              Giáo viên phụ trách: <strong>{currentPlan.teacher}</strong>
            </p>
          </div>

          {/* Các tuần của chủ đề */}
          <div className="space-y-6">
            {currentPlan.weeks.map((week, wIdx) => (
              <div key={wIdx} className="space-y-2">
                <div className="bg-blue-50 px-3.5 py-2 rounded-lg border border-blue-200 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-blue-950">{week.title}</h2>
                  <span className="text-[11px] font-semibold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                    Tuần {week.weekNum}
                  </span>
                </div>

                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 p-2 text-center font-bold w-20">Thứ</th>
                      <th className="border border-slate-300 p-2 text-center font-bold w-28">Ngày</th>
                      <th className="border border-slate-300 p-2 text-left font-bold">
                        Hoạt động giáo dục trong ngày (Chế độ sinh hoạt & STEAM)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {week.schedule.map((day, dIdx) => (
                      <tr key={dIdx} className={dIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="border border-slate-300 p-2 text-center font-bold text-slate-800">
                          Thứ {day.day}
                        </td>
                        <td className="border border-slate-300 p-2 text-center text-slate-600">
                          {day.date}
                        </td>
                        <td className="border border-slate-300 p-2 font-semibold text-blue-950">
                          {day.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* Chữ ký phê duyệt */}
          <div className="grid grid-cols-2 text-center text-xs pt-6 border-t border-slate-200">
            <div>
              <p className="font-bold uppercase text-slate-800">PHÓ HIỆU TRƯỞNG CHUYÊN MÔN</p>
              <p className="italic text-slate-500 text-[11px] mt-0.5">(Đã ký duyệt)</p>
              <div className="h-16 flex items-center justify-center italic text-blue-800 font-serif text-base">
                Lê Thị Ngọc Châu
              </div>
              <p className="font-bold text-slate-900">{currentPlan.approver}</p>
            </div>

            <div>
              <p className="italic text-slate-500 text-[11px]">Phước Thể, ngày .... tháng .... năm 2025</p>
              <p className="font-bold uppercase text-slate-800 mt-0.5">GIÁO VIÊN LẬP KẾ HOẠCH</p>
              <p className="italic text-slate-500 text-[11px]">(Ký và ghi rõ họ tên)</p>
              <div className="h-16 flex items-center justify-center italic text-blue-800 font-serif text-base">
                Nguyễn Thị Thu Thủy
              </div>
              <p className="font-bold text-slate-900">{currentPlan.teacher}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Đồng Bộ Google Docs */}
      <GoogleDocsSyncModal
        isOpen={isGoogleDocsModalOpen}
        onClose={() => setIsGoogleDocsModalOpen(false)}
        documentTitle={`KHGD_${currentPlan.title}`}
        themeName={`Nhóm 25-36T: ${currentPlan.title}`}
        htmlContent={generateToddlerPlanHtml()}
      />
    </div>
  );
}
