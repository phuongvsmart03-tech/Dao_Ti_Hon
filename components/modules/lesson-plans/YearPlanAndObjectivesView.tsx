'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Award,
  Search,
  Filter,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  YEAR_PLAN_35_WEEKS_3_4T,
  FULL_69_OBJECTIVES_3_4T,
  YearObjectiveItem,
} from '@/lib/preschool-all-json-data';
import { openPrintBlobWindow } from '@/lib/print-helper';
import { downloadAsWordDoc } from '@/lib/google-docs-export';

export default function YearPlanAndObjectivesView() {
  const [activeSubTab, setActiveSubTab] = useState<'35_weeks' | '69_objectives'>('35_weeks');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');

  // Lọc 69 mục tiêu
  const filteredObjectives = FULL_69_OBJECTIVES_3_4T.filter((item) => {
    const matchesDomain = selectedDomain === 'all' || item.domain === selectedDomain;
    const matchesSearch =
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handlePrint = () => {
    if (activeSubTab === '35_weeks') {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Dự kiến các chủ đề 2025-2026</title>
          <style>
            body { font-family: 'Times New Roman', serif; margin: 20px; }
            h2, h3 { text-align: center; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; }
            th { background-color: #f1f5f9; text-align: center; }
          </style>
        </head>
        <body>
          <h2>ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG - TRƯỜNG MẦM NON ĐẢO TÍ HON</h2>
          <h3>DỰ KIẾN CÁC CHỦ ĐỀ NĂM HỌC 2025 - 2026 (LỚP 3-4 TUỔI)</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Tên Chủ Đề</th>
                <th style="width: 10%;">Thời gian</th>
                <th style="width: 8%;">Tuần</th>
                <th style="width: 25%;">Chủ đề nhánh / Nội dung</th>
                <th style="width: 15%;">Từ ngày - Đến ngày</th>
                <th>Tích hợp giáo dục</th>
              </tr>
            </thead>
            <tbody>
              ${YEAR_PLAN_35_WEEKS_3_4T.map((r) => `
                <tr>
                  <td style="font-weight: bold;">${r.themeName}</td>
                  <td style="text-align: center;">${r.totalWeeks}</td>
                  <td style="text-align: center;">${r.weekIndex > 0 ? r.weekIndex : '-'}</td>
                  <td>${r.subThemeName}</td>
                  <td style="text-align: center;">${r.dateRange}</td>
                  <td>${r.integratedThemes.join(', ')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      openPrintBlobWindow(html, 'Du_Kien_35_Tuan_3_4T');
    } else {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Kế hoạch 69 Mục tiêu GD 3-4T</title>
          <style>
            body { font-family: 'Times New Roman', serif; margin: 20px; }
            h2, h3 { text-align: center; margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #000; padding: 6px 8px; font-size: 11pt; }
            th { background-color: #f1f5f9; text-align: center; }
          </style>
        </head>
        <body>
          <h2>ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG - TRƯỜNG MẦM NON ĐẢO TÍ HON</h2>
          <h3>KẾ HOẠCH MỤC TIÊU PHÁT TRIỂN GIÁO DỤC NĂM HỌC 2025 - 2026 (LỚP 3-4 TUỔI)</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 12%;">Mã MT</th>
                <th style="width: 20%;">Lĩnh Vực</th>
                <th style="width: 28%;">Tên Chỉ Số / Mục Tiêu</th>
                <th>Nội Dung Yêu Cầu Cần Đạt</th>
              </tr>
            </thead>
            <tbody>
              ${FULL_69_OBJECTIVES_3_4T.map((o) => `
                <tr>
                  <td style="text-align: center; font-weight: bold;">${o.code}</td>
                  <td>${o.domain}</td>
                  <td style="font-weight: 500;">${o.title}</td>
                  <td>${o.content}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;
      openPrintBlobWindow(html, 'Khung_69_Muc_Tieu_GD_3_4T');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex rounded-xl bg-slate-100 p-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('35_weeks')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === '35_weeks'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Dự Kiến 35 Tuần Học (2025 - 2026)
          </button>
          <button
            onClick={() => setActiveSubTab('69_objectives')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeSubTab === '69_objectives'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            Khung 69 Mục Tiêu Phát Triển (MT1 - MT69)
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            In Bản A4 Chuẩn
          </button>
        </div>
      </div>

      {/* Sub Tab 1: 35 Tuần Học */}
      {activeSubTab === '35_weeks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-blue-950 uppercase tracking-tight">
              Kế Hoạch Dự Kiến Các Chủ Đề Năm Học 2025 - 2026 (Khối 3 - 4 Tuổi)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Phân bổ chi tiết 35 tuần thực học, các chủ đề nhánh và các nội dung lồng ghép tư tưởng HCM, bình đẳng giới, kỹ năng sống.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2.5 text-left font-bold w-48">Tên Chủ Đề</th>
                  <th className="border border-slate-300 p-2.5 text-center font-bold w-20">Thời gian</th>
                  <th className="border border-slate-300 p-2.5 text-center font-bold w-16">Tuần</th>
                  <th className="border border-slate-300 p-2.5 text-left font-bold w-52">Chủ đề nhánh / Nội dung</th>
                  <th className="border border-slate-300 p-2.5 text-center font-bold w-36">Từ ngày - Đến ngày</th>
                  <th className="border border-slate-300 p-2.5 text-left font-bold">Nội dung tích hợp giáo dục</th>
                </tr>
              </thead>
              <tbody>
                {YEAR_PLAN_35_WEEKS_3_4T.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="border border-slate-300 p-2.5 font-bold text-blue-950">
                      {row.themeName}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center font-medium text-slate-600">
                      {row.totalWeeks}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center font-bold text-slate-800">
                      {row.weekIndex > 0 ? `Tuần ${row.weekIndex}` : '-'}
                    </td>
                    <td className="border border-slate-300 p-2.5 font-semibold text-slate-900">
                      {row.subThemeName}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center text-slate-600 font-medium">
                      {row.dateRange}
                    </td>
                    <td className="border border-slate-300 p-2.5">
                      <div className="flex flex-wrap gap-1">
                        {row.integratedThemes.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-block bg-blue-50 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded text-[10.5px]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub Tab 2: 69 Mục Tiêu Phát Triển Năm Học */}
      {activeSubTab === '69_objectives' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-blue-950 uppercase tracking-tight">
                Khung 69 Mục Tiêu Phát Triển Giáo Dục Năm Học 2025 - 2026
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lớp Mẫu Giáo 3 - 4 Tuổi • Căn cứ theo chương trình GD Mầm Non ban hành kèm Thông tư 28/2016/TT-BGDĐT
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm mã MT, từ khóa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-52"
                />
              </div>

              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">Tất cả 5 lĩnh vực</option>
                <option value="Thể chất">1. Thể chất (MT1 - MT17)</option>
                <option value="Nhận thức">2. Nhận thức (MT18 - MT34)</option>
                <option value="Ngôn ngữ">3. Ngôn ngữ (MT35 - MT47)</option>
                <option value="Tình cảm - KNXH">4. Tình cảm - KNXH (MT48 - MT58)</option>
                <option value="Thẩm mĩ">5. Thẩm mĩ (MT59 - MT69)</option>
              </select>
            </div>
          </div>

          {/* Table 69 Mục Tiêu */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2.5 text-center font-bold w-20">Mã MT</th>
                  <th className="border border-slate-300 p-2.5 text-center font-bold w-32">Lĩnh Vực</th>
                  <th className="border border-slate-300 p-2.5 text-left font-bold w-64">Tên Chỉ Số / Mục Tiêu</th>
                  <th className="border border-slate-300 p-2.5 text-left font-bold">Nội Dung Yêu Cầu Cần Đạt Của Trẻ</th>
                </tr>
              </thead>
              <tbody>
                {filteredObjectives.map((obj, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="border border-slate-300 p-2.5 text-center font-bold text-blue-900 bg-blue-50/20">
                      {obj.code}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-700">
                        {obj.domain}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2.5 font-bold text-slate-900">
                      {obj.title}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-slate-800 leading-relaxed font-normal">
                      {obj.content}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
