'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Sparkles,
  Layers,
  School,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';
import { PreschoolAdminInfo } from '@/lib/preschool-curriculum-data';
import { PreschoolThemeFullDossier, THEME_1_DOSSIER, DayFullLessonPlan } from '@/lib/preschool-full-dossiers';
import { openPrintBlobWindow } from '@/lib/print-helper';
import { downloadAsWordDoc, copyFormattedContentForGoogleDocs } from '@/lib/google-docs-export';
import GoogleDocsSyncModal from './GoogleDocsSyncModal';

interface A4DocumentSuiteProps {
  adminInfo: PreschoolAdminInfo;
  currentDossier?: PreschoolThemeFullDossier;
  selectedThemeIndex: number;
  onSelectThemeIndex: (idx: number) => void;
}

interface DossierPageItem {
  id: string;
  title: string;
  type: 'cover' | 'timetable' | 'schedule' | 'matrix' | 'environment' | 'week_plan' | 'day_lesson';
  dayData?: DayFullLessonPlan;
  dayIdx?: number;
}

export default function A4DocumentSuite({
  adminInfo,
  currentDossier = THEME_1_DOSSIER,
  selectedThemeIndex,
  onSelectThemeIndex,
}: A4DocumentSuiteProps) {
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'single_page' | 'all_pages'>('all_pages');
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(1);
  const [isGoogleDocsModalOpen, setIsGoogleDocsModalOpen] = useState(false);
  const [copiedQuick, setCopiedQuick] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const currentWeek = currentDossier.weeks.find((w) => w.weekNumber === selectedWeekNum) || currentDossier.weeks[0];

  // Danh sách các trang A4 tách bạch
  const pageList: DossierPageItem[] = [
    { id: 'page-cover', title: 'Trang 1: Trang Bìa Hồ Sơ', type: 'cover' },
    { id: 'page-timetable', title: 'Trang 2: Thời Khóa Biểu Khối Mầm', type: 'timetable' },
    { id: 'page-schedule', title: 'Trang 3: Thời Gian Biểu Trong Ngày', type: 'schedule' },
    { id: 'page-matrix', title: 'Trang 4: Kế Hoạch Nội Dung Giáo Dục (Ma Trận 3 Cột)', type: 'matrix' },
    { id: 'page-environment', title: 'Trang 5: Môi Trường Giáo Dục (Trong & Ngoài Lớp)', type: 'environment' },
    { id: 'page-week-plan', title: `Trang 6: Kế Hoạch Tuần ${currentWeek.weekNumber} (7 Thời Điểm)`, type: 'week_plan' },
    ...currentWeek.days.map((day, idx) => ({
      id: `page-day-${idx}`,
      title: `Trang ${7 + idx}: Bài Dạy Thứ ${day.dayOfWeek} (STEAM 5E - ${day.activityName})`,
      type: 'day_lesson' as const,
      dayData: day,
      dayIdx: idx,
    })),
  ];

  // Danh mục 10 chủ đề chuẩn theo hồ sơ Word của nhà trường
  const themesMenu = [
    { id: 1, title: 'Quyển 1: Lớp mẫu giáo của bé (2 tuần)', weeks: 2 },
    { id: 2, title: 'Quyển 2: Ngôi nhà thân yêu của bé (3 tuần)', weeks: 3 },
    { id: 3, title: 'Quyển 3: Bản thân (4 tuần)', weeks: 4 },
    { id: 4, title: 'Quyển 4: Những nghề bé biết (4 tuần)', weeks: 4 },
    { id: 5, title: 'Quyển 5: Những con vật yêu thích (4 tuần)', weeks: 4 },
    { id: 6, title: 'Quyển 6: Cây, hoa, quả (3 tuần)', weeks: 3 },
    { id: 7, title: 'Quyển 7: Bé đi đường an toàn (4 tuần)', weeks: 4 },
    { id: 8, title: 'Quyển 8: Sự kì diệu của nước (4 tuần)', weeks: 4 },
    { id: 9, title: 'Quyển 9: Phố phường, bản làng em (3 tuần)', weeks: 3 },
    { id: 10, title: 'Quyển 10: Tạm biệt lớp 3 tuổi (2 tuần)', weeks: 2 },
  ];

  // Sinh mã HTML chuẩn để xuất sang Word / In / Google Docs
  const generateDossierFullHtml = (): string => {
    const pagesHtml = pageList.map((p, idx) => {
      let content = '';
      if (p.type === 'cover') {
        content = renderCoverPageHtml();
      } else if (p.type === 'timetable') {
        content = renderTimetableHtml();
      } else if (p.type === 'schedule') {
        content = renderScheduleHtml();
      } else if (p.type === 'matrix') {
        content = renderMatrixHtml();
      } else if (p.type === 'environment') {
        content = renderEnvironmentHtml();
      } else if (p.type === 'week_plan') {
        content = renderWeekPlanHtml();
      } else if (p.type === 'day_lesson' && p.dayData) {
        content = renderDayLessonHtml(p.dayData);
      }

      return `
        <div style="page-break-after: always; padding: 25px 20px; font-family: 'Times New Roman', serif;">
          ${content}
        </div>
      `;
    }).join('\n');

    return pagesHtml;
  };

  const renderCoverPageHtml = () => `
    <div style="border: 3px double #1e3a8a; padding: 30px 20px; text-align: center; min-height: 950px; box-sizing: border-box; position: relative;">
      <p style="font-size: 13pt; font-weight: bold; margin: 0;">ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG</p>
      <p style="font-size: 14pt; font-weight: bold; text-decoration: underline; margin-top: 4px; margin-bottom: 25px; color: #1e3a8a;">
        TRƯỜNG MẦM NON ĐẢO TÍ HON
      </p>

      <div style="margin-top: 50px; margin-bottom: 30px;">
        <h1 style="font-size: 20pt; font-weight: bold; color: #b91c1c; text-transform: uppercase; line-height: 1.4; margin: 0;">
          KẾ HOẠCH CHĂM SÓC GIÁO DỤC TRẺ 3-4 TUỔI
        </h1>
        <p style="font-size: 13pt; font-style: italic; color: #475569; margin-top: 10px;">
          (Chương trình giáo dục mầm non ứng dụng phương pháp tiên tiến STEAM 5E)
        </p>
      </div>

      <div style="margin: 40px auto; max-width: 480px; padding: 18px; border: 2px dashed #94a3b8; background-color: #f8fafc; border-radius: 8px;">
        <h2 style="font-size: 16pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin: 0 0 12px 0;">
          ${currentDossier.bookTitle}
        </h2>
        <p style="font-size: 13pt; margin: 6px 0;"><strong>LỚP:</strong> 3 - 4 TUỔI</p>
        <p style="font-size: 13pt; margin: 6px 0;"><strong>GIÁO VIÊN PHỤ TRÁCH:</strong> ${adminInfo.teachers || 'VÕ THỊ HỒNG SIM - BÁ THỊ THANH XUÂN'}</p>
        <p style="font-size: 12pt; font-style: italic; color: #64748b; margin-top: 8px;">Thời gian thực hiện: ${currentDossier.dateRange}</p>
      </div>

      <div style="position: absolute; bottom: 40px; left: 0; right: 0; text-align: center;">
        <p style="font-size: 13pt; font-weight: bold; margin: 0; color: #1e293b;">NĂM HỌC: ${adminInfo.schoolYear || '2025 - 2026'}</p>
      </div>
    </div>
  `;

  const renderTimetableHtml = () => `
    <div style="border: 2px solid #334155; padding: 25px 20px; min-height: 950px; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="font-size: 12pt; font-weight: bold; margin: 0;">ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG</p>
        <p style="font-size: 13pt; font-weight: bold; text-decoration: underline; margin-top: 3px; color: #1e3a8a;">
          TRƯỜNG MẦM NON ĐẢO TÍ HON
        </p>
        <h2 style="font-size: 18pt; font-weight: bold; color: #1e3a8a; margin-top: 25px; text-transform: uppercase;">
          THỜI KHÓA BIỂU KHỐI MẦM (3 - 4 TUỔI)
        </h2>
        <p style="font-size: 12pt; font-style: italic; color: #64748b;">Năm học: ${adminInfo.schoolYear || '2025 - 2026'}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;" border="1">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="padding: 10px; width: 18%;">Thứ</th>
            <th style="padding: 10px; width: 15%;">Số tiết</th>
            <th style="padding: 10px; text-align: left;">Hoạt động giáo dục trong một ngày</th>
          </tr>
        </thead>
        <tbody>
          ${currentDossier.timetable.map((t) => `
            <tr>
              <td style="padding: 12px; font-weight: bold; text-align: center; background-color: #f8fafc;">${t.day}</td>
              <td style="padding: 12px; text-align: center;">${t.period}</td>
              <td style="padding: 12px; font-size: 12.5pt; font-weight: 500;">${t.subjects.join('<br>')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const renderScheduleHtml = () => `
    <div style="border: 2px solid #334155; padding: 25px 20px; min-height: 950px; box-sizing: border-box;">
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="font-size: 12pt; font-weight: bold; margin: 0;">ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG</p>
        <p style="font-size: 13pt; font-weight: bold; text-decoration: underline; margin-top: 3px; color: #1e3a8a;">
          TRƯỜNG MẦM NON ĐẢO TÍ HON
        </p>
        <h2 style="font-size: 18pt; font-weight: bold; color: #1e3a8a; margin-top: 25px; text-transform: uppercase;">
          THỜI GIAN BIỂU TRONG MỘT NGÀY
        </h2>
        <p style="font-size: 12pt; font-style: italic; color: #64748b;">(Áp dụng cho Lớp 3-4 Tuổi - Chế độ sinh hoạt một ngày của trẻ)</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;" border="1">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center; font-weight: bold;">
            <th style="padding: 10px; width: 28%;">Thời gian</th>
            <th style="padding: 10px; text-align: left;">Nội dung hoạt động của trẻ</th>
          </tr>
        </thead>
        <tbody>
          ${currentDossier.dailySchedule.map((s) => `
            <tr>
              <td style="padding: 10px; font-weight: bold; text-align: center; background-color: #f8fafc;">${s.time}</td>
              <td style="padding: 10px; font-size: 12pt;">${s.activity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const renderMatrixHtml = () => `
    <div>
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 16pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin: 0;">
          KẾ HOẠCH NỘI DUNG GIÁO DỤC: ${currentDossier.title}
        </h2>
        <p style="font-size: 12pt; font-style: italic; color: #475569; margin-top: 4px;">
          (Ma trận liên kết Khung Mục tiêu GD và Hoạt động thực tế)
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse;" border="1">
        <thead>
          <tr style="background-color: #f1f5f9; font-weight: bold; text-align: center;">
            <th style="padding: 8px; width: 25%;">MỤC TIÊU GIÁO DỤC</th>
            <th style="padding: 8px; width: 45%;">NỘI DUNG GIÁO DỤC</th>
            <th style="padding: 8px; width: 30%;">HOẠT ĐỘNG GIÁO DỤC</th>
          </tr>
        </thead>
        <tbody>
          ${currentDossier.objectivesMatrix.map((item) => `
            <tr>
              <td style="padding: 8px; font-weight: bold; color: #1e3a8a; vertical-align: top;">
                ${item.targetCode}<br>
                <span style="font-size: 10.5pt; font-weight: normal; color: #475569;">(${item.category})</span>
              </td>
              <td style="padding: 8px; vertical-align: top; font-size: 11pt;">${item.content}</td>
              <td style="padding: 8px; vertical-align: top; font-size: 11pt; color: #0f172a;">${item.activityMapping}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const renderEnvironmentHtml = () => `
    <div>
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 16pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin: 0;">
          DỰ KIẾN KẾ HOẠCH MÔI TRƯỜNG GIÁO DỤC
        </h2>
        <p style="font-size: 12pt; font-style: italic; color: #475569; margin-top: 4px;">
          ${currentDossier.bookTitle} - Thời gian: ${currentDossier.dateRange}
        </p>
      </div>

      <h3 style="font-size: 13pt; font-weight: bold; color: #0f172a; margin-top: 15px; margin-bottom: 8px; text-transform: uppercase;">
        I. MÔI TRƯỜNG VẬT CHẤT:
      </h3>
      <div style="margin-left: 15px; margin-bottom: 15px;">
        <p style="font-weight: bold; margin-bottom: 6px;">1. Môi trường trong lớp học:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          ${currentDossier.environmentPlanning.indoor.map((i) => `<li>${i}</li>`).join('')}
        </ul>

        <p style="font-weight: bold; margin-top: 12px; margin-bottom: 6px;">2. Môi trường ngoài lớp học:</p>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
          ${currentDossier.environmentPlanning.outdoor.map((o) => `<li>${o}</li>`).join('')}
        </ul>
      </div>

      <h3 style="font-size: 13pt; font-weight: bold; color: #0f172a; margin-top: 20px; margin-bottom: 8px; text-transform: uppercase;">
        II. MÔI TRƯỜNG XÃ HỘI (TÂM LÝ & TÌNH CẢM):
      </h3>
      <ul style="margin: 0; padding-left: 35px; line-height: 1.6;">
        ${currentDossier.environmentPlanning.social.map((s) => `<li>${s}</li>`).join('')}
      </ul>
    </div>
  `;

  const renderWeekPlanHtml = () => `
    <div>
      <div style="text-align: center; margin-bottom: 15px;">
        <h2 style="font-size: 16pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin: 0;">
          KẾ HOẠCH GIÁO DỤC TUẦN ${currentWeek.weekNumber}
        </h2>
        <p style="font-size: 12pt; font-style: italic; color: #475569; margin-top: 4px;">
          ${currentWeek.weekTitle}
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;" border="1">
        <thead>
          <tr style="background-color: #f1f5f9; font-weight: bold; text-align: center;">
            <th style="padding: 8px; width: 16%;">Thời điểm</th>
            ${currentWeek.days.map((d) => `<th style="padding: 8px;">Thứ ${d.dayOfWeek}<br><small>${d.dateText}</small></th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">1. Đón trẻ, TD sáng</td>
            <td colspan="5" style="padding: 8px; font-size: 11pt;">
              ${currentWeek.morningRoutine.welcome}<br>
              <strong>TD Sáng:</strong> Hô hấp (${currentWeek.morningRoutine.exercise.breathing}); Tay (${currentWeek.morningRoutine.exercise.arms}); Bụng (${currentWeek.morningRoutine.exercise.torso}); Chân (${currentWeek.morningRoutine.exercise.legs}); Bật (${currentWeek.morningRoutine.exercise.jumping}).
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">2. Hoạt động học (STEAM)</td>
            ${currentWeek.days.map((d) => `
              <td style="padding: 8px; font-size: 11pt; vertical-align: top;">
                <strong>${d.domain}</strong><br>
                <span style="color: #1e3a8a; font-weight: bold;">${d.lessonTopic}</span>
              </td>
            `).join('')}
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">3. Hoạt động góc</td>
            <td colspan="5" style="padding: 8px; font-size: 10.5pt;">
              ${currentWeek.cornerSetup.map((c) => `<strong>${c.cornerName}:</strong> ${c.activities}`).join('<br>')}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">4. Hoạt động ngoài trời</td>
            ${currentWeek.days.map((d) => `
              <td style="padding: 8px; font-size: 10.5pt; vertical-align: top;">
                - Quan sát: ${d.outdoorActivity.focusedObservation}<br>
                - TCVĐ: ${d.outdoorActivity.movementGame}
              </td>
            `).join('')}
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">5. Ăn, ngủ trưa</td>
            <td colspan="5" style="padding: 8px; font-size: 11pt;">
              Rèn nề nếp rửa tay bằng xà phòng 6 bước trước khi ăn, xúc cơm gọn gàng. Ngủ trưa đủ giấc, thoáng mát, yên tĩnh, đảm bảo an toàn tuyệt đối.
            </td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">6. Hoạt động chiều</td>
            ${currentWeek.days.map((d) => `
              <td style="padding: 8px; font-size: 10.5pt; vertical-align: top;">
                ${d.afternoonActivity.reinforcement}
              </td>
            `).join('')}
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; background-color: #f8fafc;">7. Trả trẻ</td>
            <td colspan="5" style="padding: 8px; font-size: 11pt;">
              Bình cờ bé ngoan cuối ngày, động viên khen ngợi trẻ; cất dọn đồ dùng đồ chơi; nhắc trẻ chào cô, chào bố mẹ khi ra về.
            </td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 30px; width: 100%;">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="border: none; text-align: center; width: 50%;">
              <p><strong>PHÓ HIỆU TRƯỞNG CHUYÊN MÔN</strong></p>
              <p style="font-style: italic; color: #64748b;">(Đã ký duyệt)</p>
              <br><br><br>
              <p><strong>${adminInfo.approver || 'LÊ THỊ NGỌC CHÂU'}</strong></p>
            </td>
            <td style="border: none; text-align: center; width: 50%;">
              <p style="font-style: italic;">Liên Hương, ngày .... tháng .... năm 2025</p>
              <p><strong>GIÁO VIÊN SOẠN BÀI</strong></p>
              <p style="font-style: italic; color: #64748b;">(Ký và ghi rõ họ tên)</p>
              <br><br><br>
              <p><strong>${adminInfo.teachers || 'VÕ THỊ HỒNG SIM'}</strong></p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  `;

  const renderDayLessonHtml = (day: any) => `
    <div>
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="font-size: 16pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin: 0;">
          KẾ HOẠCH BÀI DẠY: THỨ ${day.dayOfWeek.toUpperCase()} (${day.dateText})
        </h2>
        <p style="font-size: 12pt; font-style: italic; color: #475569; margin-top: 4px;">
          Lĩnh vực: <strong>${day.domain}</strong> | Hoạt động: <strong>${day.activityName}</strong>
        </p>
      </div>

      <div style="border: 1px solid #cbd5e1; padding: 12px; background-color: #f8fafc; margin-bottom: 15px;">
        <p style="margin: 0; font-size: 13pt;"><strong>ĐỀ TÀI BÀI DẠY:</strong> <span style="color: #b91c1c; font-weight: bold;">${day.lessonTopic}</span></p>
        <p style="margin: 5px 0 0 0; font-size: 11.5pt;"><strong>Mô hình:</strong> ${day.steamMethod} | <strong>Mục tiêu:</strong> ${day.targetCodes.join(', ')}</p>
      </div>

      <h3 style="font-size: 13pt; font-weight: bold; color: #0f172a; margin-top: 15px; margin-bottom: 6px;">I. MỤC ĐÍCH - YÊU CẦU:</h3>
      <ul style="margin: 0; padding-left: 25px; line-height: 1.6;">
        <li><strong>Kiến thức:</strong> ${day.aims.knowledge.join(' ')}</li>
        <li><strong>Kỹ năng:</strong> ${day.aims.skills.join(' ')}</li>
        <li><strong>Thái độ:</strong> ${day.aims.attitudes.join(' ')}</li>
        ${day.aims.integrationHCM ? `<li><strong>Lồng ghép tư tưởng HCM:</strong> ${day.aims.integrationHCM}</li>` : ''}
        ${day.aims.genderIntegration ? `<li><strong>Lồng ghép giới tính:</strong> ${day.aims.genderIntegration}</li>` : ''}
      </ul>

      <h3 style="font-size: 13pt; font-weight: bold; color: #0f172a; margin-top: 15px; margin-bottom: 6px;">II. CHUẨN BỊ:</h3>
      <ul style="margin: 0; padding-left: 25px; line-height: 1.6;">
        <li><strong>Đồ dùng của cô:</strong> ${day.preparation.teacher.join(', ')}</li>
        <li><strong>Đồ dùng của trẻ:</strong> ${day.preparation.students.join(', ')}</li>
      </ul>

      <h3 style="font-size: 13pt; font-weight: bold; color: #0f172a; margin-top: 15px; margin-bottom: 6px;">
        III. TIẾN TRÌNH HOẠT ĐỘNG (QUY TRÌNH STEAM 5E):
      </h3>
      
      <div style="margin-bottom: 10px;">
        <p style="font-weight: bold; color: #1e3a8a; margin: 0 0 4px 0;">1. Gắn kết (Engage):</p>
        <ul style="margin: 0; padding-left: 25px; line-height: 1.5;">${day.steps.step1_engage.map((s: string) => `<li>${s}</li>`).join('')}</ul>
      </div>

      <div style="margin-bottom: 10px;">
        <p style="font-weight: bold; color: #1e3a8a; margin: 0 0 4px 0;">2. Khám phá (Explore):</p>
        <ul style="margin: 0; padding-left: 25px; line-height: 1.5;">${day.steps.step2_explore.map((s: string) => `<li>${s}</li>`).join('')}</ul>
      </div>

      <div style="margin-bottom: 10px;">
        <p style="font-weight: bold; color: #1e3a8a; margin: 0 0 4px 0;">3. Giải thích (Explain):</p>
        <ul style="margin: 0; padding-left: 25px; line-height: 1.5;">${day.steps.step3_explain.map((s: string) => `<li>${s}</li>`).join('')}</ul>
      </div>

      <div style="margin-bottom: 10px;">
        <p style="font-weight: bold; color: #1e3a8a; margin: 0 0 4px 0;">4. Áp dụng / Củng cố (Elaborate):</p>
        <ul style="margin: 0; padding-left: 25px; line-height: 1.5;">${day.steps.step4_elaborate.map((s: string) => `<li>${s}</li>`).join('')}</ul>
      </div>

      <div style="margin-bottom: 10px;">
        <p style="font-weight: bold; color: #1e3a8a; margin: 0 0 4px 0;">5. Đánh giá (Evaluate):</p>
        <ul style="margin: 0; padding-left: 25px; line-height: 1.5;">${day.steps.step5_evaluate.map((s: string) => `<li>${s}</li>`).join('')}</ul>
      </div>

      <h3 style="font-size: 13pt; font-weight: bold; color: #0f172a; margin-top: 15px; margin-bottom: 6px;">
        IV. CÁC HOẠT ĐỘNG KHÁC TRONG NGÀY:
      </h3>
      <ul style="margin: 0; padding-left: 25px; line-height: 1.6;">
        <li><strong>Hoạt động ngoài trời:</strong> ${day.outdoorActivity.focusedObservation} - TCVĐ: ${day.outdoorActivity.movementGame}</li>
        <li><strong>Hoạt động góc:</strong> ${day.cornerActivities}</li>
        <li><strong>Hoạt động chiều:</strong> ${day.afternoonActivity.reinforcement} - Vệ sinh & trả trẻ: ${day.afternoonActivity.hygieneAndRewards}</li>
      </ul>
    </div>
  `;

  // Xử lý nút In A4
  const handlePrint = () => {
    const fullHtml = generateDossierFullHtml();
    openPrintBlobWindow(fullHtml, `${currentDossier.bookTitle} - In A4`);
  };

  // Xử lý tải File Word
  const handleDownloadWord = () => {
    const fullHtml = generateDossierFullHtml();
    downloadAsWordDoc(fullHtml, `${currentDossier.bookTitle.replace(/\s+/g, '_')}.doc`);
  };

  // Xử lý sao chép nhanh cho Google Docs
  const handleQuickCopyGoogleDocs = async () => {
    const fullHtml = generateDossierFullHtml();
    const ok = await copyFormattedContentForGoogleDocs(fullHtml);
    if (ok) {
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. THANH ĐIỀU KHIỂN ĐỈNH CAO (Toolbar) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sticky top-0 z-30 backdrop-blur-md bg-white/95">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Bộ chọn chủ đề & Tuần */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Chủ Đề:</span>
              <select
                value={selectedThemeIndex + 1}
                onChange={(e) => onSelectThemeIndex(Number(e.target.value) - 1)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-800 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {themesMenu.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tuần:</span>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                {currentDossier.weeks.map((w) => (
                  <button
                    key={w.weekNumber}
                    onClick={() => setSelectedWeekNum(w.weekNumber)}
                    className={`px-3 py-1 text-xs font-bold transition-colors ${
                      selectedWeekNum === w.weekNumber
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tuần {w.weekNumber}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Xem:</span>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                <button
                  onClick={() => setViewMode('all_pages')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    viewMode === 'all_pages' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất Cả Các Trang A4 ({pageList.length} trang)
                </button>
                <button
                  onClick={() => setViewMode('single_page')}
                  className={`px-3 py-1 text-xs font-medium transition-colors ${
                    viewMode === 'single_page' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Từng Trang Độc Lập
                </button>
              </div>
            </div>
          </div>

          {/* Nhóm nút hành động: Xuất Word, Google Docs, In */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsGoogleDocsModalOpen(true)}
              className="bg-sky-50 text-sky-800 border border-sky-300 hover:bg-sky-100 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4 text-sky-600" />
              Đồng Bộ Google Docs
            </button>

            <button
              onClick={handleQuickCopyGoogleDocs}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all border ${
                copiedQuick
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {copiedQuick ? (
                <>
                  <Check className="w-4 h-4" /> Đã Copy Định Dạng!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" /> Copy Cho Docs (Ctrl+V)
                </>
              )}
            </button>

            <button
              onClick={handleDownloadWord}
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
              In A4 (Print)
            </button>
          </div>
        </div>

        {/* Thanh chuyển trang khi ở chế độ Single Page */}
        {viewMode === 'single_page' && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-3xl">
              {pageList.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePageIndex(idx)}
                  className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md font-medium transition-colors ${
                    activePageIndex === idx
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Trang {idx + 1}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 pl-3">
              <button
                disabled={activePageIndex === 0}
                onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700">
                {activePageIndex + 1} / {pageList.length}
              </span>
              <button
                disabled={activePageIndex === pageList.length - 1}
                onClick={() => setActivePageIndex((prev) => Math.min(pageList.length - 1, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-100 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. KHU VỰC HIỂN THỊ CÁC TRANG A4 TÁCH RỜI CHUẨN TỶ LỆ */}
      <div className="bg-slate-200/70 p-4 md:p-8 rounded-2xl flex flex-col items-center gap-8 overflow-x-auto">
        {viewMode === 'all_pages' ? (
          // Hiển thị tất cả các trang A4 tách bạch tuần tự
          pageList.map((page, idx) => (
            <div key={page.id} className="flex flex-col items-center w-full max-w-[820px]">
              {/* Nhãn phân cách từng trang A4 */}
              <div className="w-full flex items-center justify-between mb-2 text-xs font-bold text-slate-600 px-2">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {page.title}
                </span>
                <span className="bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-300 shadow-2xs">
                  Trang A4 ({idx + 1} / {pageList.length})
                </span>
              </div>

              {/* Tấm giấy A4 chuẩn: 210mm x 297mm (Tỉ lệ A4) */}
              <div
                className="w-full bg-white rounded-sm shadow-xl border border-slate-300/80 p-8 md:p-12 transition-all relative"
                style={{
                  minHeight: '1050px',
                  fontFamily: '"Times New Roman", Times, serif',
                }}
              >
                {page.type === 'cover' && renderCoverPageHtmlInApp()}
                {page.type === 'timetable' && renderTimetableHtmlInApp()}
                {page.type === 'schedule' && renderScheduleHtmlInApp()}
                {page.type === 'matrix' && renderMatrixHtmlInApp()}
                {page.type === 'environment' && renderEnvironmentHtmlInApp()}
                {page.type === 'week_plan' && renderWeekPlanHtmlInApp()}
                {page.type === 'day_lesson' && page.dayData && renderDayLessonHtmlInApp(page.dayData)}

                {/* Footer số trang A4 chân trang */}
                <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 font-serif border-t border-slate-100 pt-2 mx-12">
                  Trường Mầm Non Đảo Tí Hon • {currentDossier.bookTitle} • Trang {idx + 1}
                </div>
              </div>
            </div>
          ))
        ) : (
          // Chế độ xem 1 trang độc lập
          <div className="flex flex-col items-center w-full max-w-[820px]">
            <div className="w-full flex items-center justify-between mb-2 text-xs font-bold text-slate-600 px-2">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                {pageList[activePageIndex].title}
              </span>
              <span className="bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-300 shadow-2xs">
                Trang A4 ({activePageIndex + 1} / {pageList.length})
              </span>
            </div>

            <div
              className="w-full bg-white rounded-sm shadow-2xl border border-slate-300/80 p-8 md:p-12 relative"
              style={{
                minHeight: '1050px',
                fontFamily: '"Times New Roman", Times, serif',
              }}
            >
              {pageList[activePageIndex].type === 'cover' && renderCoverPageHtmlInApp()}
              {pageList[activePageIndex].type === 'timetable' && renderTimetableHtmlInApp()}
              {pageList[activePageIndex].type === 'schedule' && renderScheduleHtmlInApp()}
              {pageList[activePageIndex].type === 'matrix' && renderMatrixHtmlInApp()}
              {pageList[activePageIndex].type === 'environment' && renderEnvironmentHtmlInApp()}
              {pageList[activePageIndex].type === 'week_plan' && renderWeekPlanHtmlInApp()}
              {pageList[activePageIndex].type === 'day_lesson' && pageList[activePageIndex].dayData && renderDayLessonHtmlInApp(pageList[activePageIndex].dayData)}

              <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 font-serif border-t border-slate-100 pt-2 mx-12">
                Trường Mầm Non Đảo Tí Hon • {currentDossier.bookTitle} • Trang {activePageIndex + 1}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL ĐỒNG BỘ GOOGLE DOCS */}
      <GoogleDocsSyncModal
        isOpen={isGoogleDocsModalOpen}
        onClose={() => setIsGoogleDocsModalOpen(false)}
        documentTitle={currentDossier.bookTitle}
        themeName={currentDossier.title}
        htmlContent={generateDossierFullHtml()}
      />
    </div>
  );

  // -------------------------------------------------------------
  // CÁC HÀM RENDER NỘI DUNG GIAO DIỆN TRỰC QUAN TRONG APP (JSX)
  // -------------------------------------------------------------

  function renderCoverPageHtmlInApp() {
    return (
      <div className="border-4 border-double border-blue-900 p-8 text-center min-h-[950px] flex flex-col justify-between relative bg-amber-50/20">
        {/* Họa tiết hoa văn 4 góc */}
        <div className="absolute top-2 left-2 text-blue-900 font-serif text-2xl select-none">❖</div>
        <div className="absolute top-2 right-2 text-blue-900 font-serif text-2xl select-none">❖</div>
        <div className="absolute bottom-2 left-2 text-blue-900 font-serif text-2xl select-none">❖</div>
        <div className="absolute bottom-2 right-2 text-blue-900 font-serif text-2xl select-none">❖</div>

        {/* Header cấp cơ quan */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-0.5">
            ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG
          </p>
          <p className="text-base font-bold text-blue-950 underline underline-offset-4 tracking-wide">
            TRƯỜNG MẦM NON ĐẢO TÍ HON
          </p>
          <div className="w-24 h-0.5 bg-blue-900 mx-auto mt-1 mb-8" />
        </div>

        {/* Tiêu đề chính */}
        <div className="my-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-red-700 uppercase tracking-tight leading-snug">
            KẾ HOẠCH CHĂM SÓC GIÁO DỤC TRẺ 3 - 4 TUỔI
          </h1>
          <p className="text-sm italic text-slate-600 mt-2">
            (Chương trình giáo dục mầm non ứng dụng phương pháp tiên tiến STEAM 5E)
          </p>
        </div>

        {/* Khung ảnh minh họa đôi đúng như bản Word của khách hàng */}
        <div className="my-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="border border-slate-300 rounded-lg p-2 bg-white shadow-xs">
            <div className="h-32 bg-gradient-to-br from-sky-100 to-blue-200 rounded flex flex-col items-center justify-center p-2 text-center text-blue-900">
              <School className="w-8 h-8 mb-1 text-blue-700" />
              <span className="text-[11px] font-bold">Khuôn Viên Trường Mầm Non Đảo Tí Hon</span>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-1 italic">Sân chơi vận động liên hoàn</p>
          </div>

          <div className="border border-slate-300 rounded-lg p-2 bg-white shadow-xs">
            <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-200 rounded flex flex-col items-center justify-center p-2 text-center text-amber-900">
              <Sparkles className="w-8 h-8 mb-1 text-amber-700" />
              <span className="text-[11px] font-bold">Hoạt Động Sáng Tạo Nghệ Thuật</span>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-1 italic">Cô và bé cùng trải nghiệm</p>
          </div>
        </div>

        {/* Box thông tin hồ sơ */}
        <div className="border-2 border-dashed border-blue-900/40 bg-white/80 p-5 rounded-xl max-w-lg mx-auto w-full shadow-2xs">
          <h2 className="text-lg font-bold text-blue-950 uppercase tracking-wide mb-2">
            {currentDossier.bookTitle}
          </h2>
          <div className="text-sm space-y-1 text-slate-800">
            <p>
              <strong className="font-bold">LỚP:</strong> 3 - 4 TUỔI
            </p>
            <p>
              <strong className="font-bold">HỌ VÀ TÊN GIÁO VIÊN:</strong>
            </p>
            <p className="font-bold text-blue-900 text-base">
              {adminInfo.teachers || 'VÕ THỊ HỒNG SIM - BÁ THỊ THANH XUÂN'}
            </p>
            <p className="text-xs text-slate-500 italic mt-2">
              Thời gian thực hiện: {currentDossier.dateRange}
            </p>
          </div>
        </div>

        {/* Footer năm học */}
        <div className="mt-8">
          <p className="text-sm font-bold text-slate-800 tracking-wider">
            NĂM HỌC: {adminInfo.schoolYear || '2025 - 2026'}
          </p>
        </div>
      </div>
    );
  }

  function renderTimetableHtmlInApp() {
    return (
      <div className="border-2 border-slate-800 p-8 min-h-[950px] flex flex-col justify-between">
        <div>
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase text-slate-700 mb-0.5">
              ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG
            </p>
            <p className="text-sm font-bold text-blue-950 underline underline-offset-4 tracking-wide">
              TRƯỜNG MẦM NON ĐẢO TÍ HON
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-blue-950 uppercase mt-8 tracking-wide">
              THỜI KHÓA BIỂU KHỐI MẦM
            </h2>
            <p className="text-xs italic text-slate-500 mt-1">Lớp 3 - 4 Tuổi • Năm học 2025 - 2026</p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-slate-900">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-400 p-3 text-center text-sm font-bold w-24">Thứ</th>
                <th className="border border-slate-400 p-3 text-center text-sm font-bold w-24">Số tiết</th>
                <th className="border border-slate-400 p-3 text-left text-sm font-bold">
                  Hoạt động giáo dục trong một ngày
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDossier.timetable.map((t, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="border border-slate-400 p-3 text-center font-bold text-slate-800">
                    {t.day}
                  </td>
                  <td className="border border-slate-400 p-3 text-center text-slate-700">{t.period}</td>
                  <td className="border border-slate-400 p-3 text-sm font-semibold text-slate-900 leading-relaxed">
                    {t.subjects.map((sub, sIdx) => (
                      <div key={sIdx} className="py-0.5">
                        • {sub}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right text-xs italic text-slate-500 mt-8">
          Thời khóa biểu được ban hành và thực hiện thống nhất từ tháng 09/2025 đến tháng 05/2026.
        </div>
      </div>
    );
  }

  function renderScheduleHtmlInApp() {
    return (
      <div className="border-2 border-slate-800 p-8 min-h-[950px] flex flex-col justify-between">
        <div>
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase text-slate-700 mb-0.5">
              ỦY BAN NHÂN DÂN XÃ LIÊN HƯƠNG
            </p>
            <p className="text-sm font-bold text-blue-950 underline underline-offset-4 tracking-wide">
              TRƯỜNG MẦM NON ĐẢO TÍ HON
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-blue-950 uppercase mt-8 tracking-wide">
              THỜI GIAN BIỂU TRONG MỘT NGÀY
            </h2>
            <p className="text-xs italic text-slate-500 mt-1">
              Chế độ sinh hoạt hàng ngày của trẻ Lớp Mầm (3 - 4 Tuổi)
            </p>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-slate-900">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-400 p-2.5 text-center text-sm font-bold w-44">
                  Thời gian
                </th>
                <th className="border border-slate-400 p-2.5 text-left text-sm font-bold">
                  Hoạt động giáo dục trong 1 ngày
                </th>
              </tr>
            </thead>
            <tbody>
              {currentDossier.dailySchedule.map((s, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="border border-slate-400 p-2.5 text-center font-bold text-blue-950 text-xs">
                    {s.time}
                  </td>
                  <td className="border border-slate-400 p-2.5 text-xs text-slate-800 font-medium">
                    {s.activity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center text-xs italic text-slate-500 mt-8">
          Đảm bảo cân bằng giữa hoạt động tĩnh và động, thời gian nghỉ ngơi, ăn uống vệ sinh chuẩn Bộ GD&ĐT.
        </div>
      </div>
    );
  }

  function renderMatrixHtmlInApp() {
    return (
      <div className="p-2">
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-blue-950 uppercase tracking-tight">
            KẾ HOẠCH NỘI DUNG GIÁO DỤC: {currentDossier.title}
          </h2>
          <p className="text-xs italic text-slate-600 mt-1">
            Bảng ma trận 3 cột: Mục tiêu giáo dục • Nội dung giáo dục • Hoạt động giáo dục
          </p>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-xs text-slate-900">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-400 p-2 text-center font-bold w-36">
                MỤC TIÊU GIÁO DỤC
              </th>
              <th className="border border-slate-400 p-2 text-left font-bold">
                NỘI DUNG GIÁO DỤC
              </th>
              <th className="border border-slate-400 p-2 text-left font-bold w-48">
                HOẠT ĐỘNG GIÁO DỤC
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDossier.objectivesMatrix.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                <td className="border border-slate-400 p-2 align-top font-bold text-blue-900">
                  {item.targetCode}
                  <div className="text-[10px] font-normal text-slate-500">{item.category}</div>
                </td>
                <td className="border border-slate-400 p-2 align-top text-slate-800 leading-relaxed">
                  {item.content}
                </td>
                <td className="border border-slate-400 p-2 align-top font-medium text-slate-900 leading-relaxed">
                  {item.activityMapping}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function renderEnvironmentHtmlInApp() {
    return (
      <div className="p-2">
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-blue-950 uppercase tracking-tight">
            DỰ KIẾN KẾ HOẠCH MÔI TRƯỜNG GIÁO DỤC
          </h2>
          <p className="text-xs italic text-slate-600 mt-1">
            {currentDossier.bookTitle} • Thời gian thực hiện: {currentDossier.dateRange}
          </p>
        </div>

        <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="font-bold text-sm text-blue-950 uppercase mb-2">
              I. MÔI TRƯỜNG VẬT CHẤT:
            </h3>

            <div className="ml-2 space-y-3">
              <div>
                <p className="font-bold text-slate-900 mb-1">• 1. Môi trường trong lớp học:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
                  {currentDossier.environmentPlanning.indoor.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-bold text-slate-900 mb-1">• 2. Môi trường ngoài lớp học:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
                  {currentDossier.environmentPlanning.outdoor.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <h3 className="font-bold text-sm text-blue-950 uppercase mb-2">
              II. MÔI TRƯỜNG XÃ HỘI (TÂM LÝ & TÌNH CẢM):
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-2">
              {currentDossier.environmentPlanning.social.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  function renderWeekPlanHtmlInApp() {
    return (
      <div className="p-2">
        <div className="text-center mb-6">
          <h2 className="text-lg md:text-xl font-bold text-blue-950 uppercase tracking-tight">
            KẾ HOẠCH GIÁO DỤC TUẦN {currentWeek.weekNumber}
          </h2>
          <p className="text-xs italic text-slate-600 mt-1">{currentWeek.weekTitle}</p>
        </div>

        <table className="w-full border-collapse border border-slate-400 text-xs text-slate-900 mb-6">
          <thead>
            <tr className="bg-slate-100 text-slate-800">
              <th className="border border-slate-400 p-2 text-center font-bold w-28">Thời điểm</th>
              {currentWeek.days.map((d, i) => (
                <th key={i} className="border border-slate-400 p-2 text-center font-bold">
                  Thứ {d.dayOfWeek}
                  <div className="text-[10px] font-normal text-slate-500">{d.dateText}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold bg-slate-50 text-slate-900">
                1. Đón trẻ & TD sáng
              </td>
              <td colSpan={5} className="border border-slate-400 p-2 text-slate-800 leading-relaxed">
                {currentWeek.morningRoutine.welcome}
                <div className="mt-1 text-[11px] font-medium text-blue-900">
                  <strong>TD Sáng:</strong> Hô hấp ({currentWeek.morningRoutine.exercise.breathing}); Tay ({currentWeek.morningRoutine.exercise.arms}); Bụng ({currentWeek.morningRoutine.exercise.torso}); Chân ({currentWeek.morningRoutine.exercise.legs}); Bật ({currentWeek.morningRoutine.exercise.jumping}).
                </div>
              </td>
            </tr>

            <tr>
              <td className="border border-slate-400 p-2 font-bold bg-slate-50 text-slate-900">
                2. Hoạt động học (STEAM)
              </td>
              {currentWeek.days.map((d, i) => (
                <td key={i} className="border border-slate-400 p-2 align-top">
                  <div className="text-[11px] font-semibold text-slate-500">{d.domain}</div>
                  <div className="font-bold text-blue-950 text-xs mt-0.5">{d.lessonTopic}</div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="border border-slate-400 p-2 font-bold bg-slate-50 text-slate-900">
                3. Hoạt động góc
              </td>
              <td colSpan={5} className="border border-slate-400 p-2 text-slate-800 leading-relaxed">
                <div className="space-y-1">
                  {currentWeek.cornerSetup.map((c, i) => (
                    <div key={i}>
                      <strong className="text-blue-900">{c.cornerName}:</strong> {c.activities}
                    </div>
                  ))}
                </div>
              </td>
            </tr>

            <tr>
              <td className="border border-slate-400 p-2 font-bold bg-slate-50 text-slate-900">
                4. Hoạt động ngoài trời
              </td>
              {currentWeek.days.map((d, i) => (
                <td key={i} className="border border-slate-400 p-2 align-top text-[11px]">
                  <div>• Quan sát: {d.outdoorActivity.focusedObservation}</div>
                  <div className="mt-1 font-medium text-slate-700">• TCVĐ: {d.outdoorActivity.movementGame}</div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="border border-slate-400 p-2 font-bold bg-slate-50 text-slate-900">
                5. Ăn, ngủ trưa
              </td>
              <td colSpan={5} className="border border-slate-400 p-2 text-slate-800">
                Rèn nề nếp rửa tay bằng xà phòng 6 bước trước khi ăn, xúc cơm gọn gàng, không làm rơi vãi. Ngủ trưa đủ giấc, phòng thoáng mát, yên tĩnh, đảm bảo an toàn tuyệt đối.
              </td>
            </tr>

            <tr>
              <td className="border border-slate-400 p-2 font-bold bg-slate-50 text-slate-900">
                6. Hoạt động chiều
              </td>
              {currentWeek.days.map((d, i) => (
                <td key={i} className="border border-slate-400 p-2 align-top text-[11px] text-slate-800">
                  {d.afternoonActivity.reinforcement}
                </td>
              ))}
            </tr>

            <tr>
              <td className="border border-slate-400 p-2 font-bold bg-slate-50 text-slate-900">
                7. Trả trẻ
              </td>
              <td colSpan={5} className="border border-slate-400 p-2 text-slate-800">
                Bình cờ bé ngoan cuối ngày, động viên khen ngợi trẻ; cất dọn đồ dùng đồ chơi ngăn nắp; nhắc trẻ chào cô, chào bố mẹ khi ra về an toàn.
              </td>
            </tr>
          </tbody>
        </table>

        {/* Khung chữ ký chuẩn theo mẫu giáo dục */}
        <div className="grid grid-cols-2 text-center text-xs mt-8 pt-4 border-t border-slate-200">
          <div>
            <p className="font-bold uppercase text-slate-800">PHÓ HIỆU TRƯỞNG CHUYÊN MÔN</p>
            <p className="italic text-slate-500 text-[11px] mt-0.5">(Đã ký duyệt)</p>
            <div className="h-16 flex items-center justify-center italic text-blue-800 font-serif text-base">
              Lê Thị Ngọc Châu
            </div>
            <p className="font-bold text-slate-900">{adminInfo.approver || 'LÊ THỊ NGỌC CHÂU'}</p>
          </div>

          <div>
            <p className="italic text-slate-500 text-[11px]">Liên Hương, ngày .... tháng .... năm 2025</p>
            <p className="font-bold uppercase text-slate-800 mt-0.5">GIÁO VIÊN SOẠN BÀI</p>
            <p className="italic text-slate-500 text-[11px]">(Ký và ghi rõ họ tên)</p>
            <div className="h-16 flex items-center justify-center italic text-blue-800 font-serif text-base">
              Võ Thị Hồng Sim
            </div>
            <p className="font-bold text-slate-900">{adminInfo.teachers || 'VÕ THỊ HỒNG SIM'}</p>
          </div>
        </div>
      </div>
    );
  }

  function renderDayLessonHtmlInApp(day: any) {
    return (
      <div className="p-2 space-y-4">
        <div className="text-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-blue-950 uppercase tracking-tight">
            KẾ HOẠCH BÀI DẠY: THỨ {day.dayOfWeek.toUpperCase()} ({day.dateText})
          </h2>
          <p className="text-xs italic text-slate-600 mt-0.5">
            Lĩnh vực: <strong>{day.domain}</strong> • Hoạt động: <strong>{day.activityName}</strong>
          </p>
        </div>

        <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-blue-700 tracking-wider">Đề Tài Bài Dạy:</span>
            <h3 className="text-base font-bold text-red-700 mt-0.5">{day.lessonTopic}</h3>
            <p className="text-xs text-slate-600 mt-1">
              Mô hình: <span className="font-semibold text-blue-950">{day.steamMethod}</span> • Mã MT: {day.targetCodes.join(', ')}
            </p>
          </div>
          <span className="px-2.5 py-1 bg-white border border-blue-300 text-blue-900 text-xs font-bold rounded-full shadow-2xs">
            STEAM 5E
          </span>
        </div>

        {/* I. Mục đích yêu cầu */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-white text-xs leading-relaxed">
          <h4 className="font-bold text-slate-900 text-sm mb-1.5 uppercase tracking-wide">
            I. MỤC ĐÍCH - YÊU CẦU:
          </h4>
          <ul className="space-y-1 text-slate-700">
            <li>• <strong>Kiến thức:</strong> {day.aims.knowledge.join(' ')}</li>
            <li>• <strong>Kỹ năng:</strong> {day.aims.skills.join(' ')}</li>
            <li>• <strong>Thái độ:</strong> {day.aims.attitudes.join(' ')}</li>
            {day.aims.integrationHCM && (
              <li className="text-red-700 font-medium">• <strong>Lồng ghép tư tưởng HCM:</strong> {day.aims.integrationHCM}</li>
            )}
            {day.aims.genderIntegration && (
              <li className="text-indigo-700 font-medium">• <strong>Lồng ghép giới tính:</strong> {day.aims.genderIntegration}</li>
            )}
          </ul>
        </div>

        {/* II. Chuẩn bị */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-white text-xs leading-relaxed">
          <h4 className="font-bold text-slate-900 text-sm mb-1.5 uppercase tracking-wide">
            II. CHUẨN BỊ:
          </h4>
          <ul className="space-y-1 text-slate-700">
            <li>• <strong>Đồ dùng của cô:</strong> {day.preparation.teacher.join(', ')}</li>
            <li>• <strong>Đồ dùng của trẻ:</strong> {day.preparation.students.join(', ')}</li>
          </ul>
        </div>

        {/* III. Tiến trình STEAM 5E */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-white text-xs leading-relaxed space-y-3">
          <h4 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-wide">
            III. TIẾN TRÌNH HOẠT ĐỘNG (QUY TRÌNH STEAM 5E):
          </h4>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <p className="font-bold text-blue-900 mb-1">1. Gắn kết (Engage):</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
              {day.steps.step1_engage.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <p className="font-bold text-blue-900 mb-1">2. Khám phá (Explore):</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
              {day.steps.step2_explore.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <p className="font-bold text-blue-900 mb-1">3. Giải thích (Explain):</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
              {day.steps.step3_explain.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <p className="font-bold text-blue-900 mb-1">4. Áp dụng / Củng cố (Elaborate):</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
              {day.steps.step4_elaborate.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <p className="font-bold text-blue-900 mb-1">5. Đánh giá (Evaluate):</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
              {day.steps.step5_evaluate.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* IV. Các hoạt động khác trong ngày */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-white text-xs leading-relaxed">
          <h4 className="font-bold text-slate-900 text-sm mb-1.5 uppercase tracking-wide">
            IV. CÁC HOẠT ĐỘNG KHÁC TRONG NGÀY:
          </h4>
          <ul className="space-y-1 text-slate-700">
            <li>• <strong>Ngoài trời:</strong> {day.outdoorActivity.focusedObservation} - TCVĐ: {day.outdoorActivity.movementGame}</li>
            <li>• <strong>Hoạt động góc:</strong> {day.cornerActivities}</li>
            <li>• <strong>Hoạt động chiều:</strong> {day.afternoonActivity.reinforcement} - Vệ sinh trả trẻ: {day.afternoonActivity.hygieneAndRewards}</li>
          </ul>
        </div>
      </div>
    );
  }
}
