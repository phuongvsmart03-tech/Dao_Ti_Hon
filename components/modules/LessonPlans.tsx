'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Edit2,
  FileText,
  GraduationCap,
  Layers,
  Loader2,
  Printer,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Users,
  X,
  School,
  Sun,
  Clock,
  Compass,
  ArrowRight,
  Check,
} from 'lucide-react';
import { LessonPlan } from '@/types/preschool';
import WordDocumentViewer from './WordDocumentViewer';
import { findLessonByObjectiveCode } from '@/lib/preschool-full-dossiers';
import {
  DEFAULT_PRESCHOOL_ADMIN,
  PreschoolAdminInfo,
  MASTER_PRESCHOOL_OBJECTIVES_3_4T,
  MASTER_THEMES_3_4T,
  MASTER_THEMES_25_36T,
  SAMPLE_WEEK_1_LESSON_PLAN_3_4T,
  WeekCurriculumPlan,
  DayLessonDetail,
  getStoredAdminInfo,
  saveStoredAdminInfo,
  PreschoolTheme,
} from '@/lib/preschool-curriculum-data';
import {
  generateFullPreschoolDossierHtml,
  generateCoverPageHtml,
  generateTimetableAndScheduleHtml,
  generateFourWeeksMatrixHtml,
  generateThemeObjectivesAndEnvironmentHtml,
  generateDetailedWeekPlan7TimepointsHtml,
  generateDailySteam5ELessonHtml,
  THEME_7_FULL_MATRIX_DATA,
  THEME_7_OBJECTIVES_DATA,
  THEME_7_ENVIRONMENT_DATA,
} from '@/lib/preschool-print-templates';
import { openPrintBlobWindow } from '@/lib/print-helper';

interface LessonPlansProps {
  plans?: LessonPlan[];
  onSavePlan?: (plan: LessonPlan) => void;
  onDeletePlan?: (id: string) => void;
  onPrintPreview?: () => void;
  onOpenAiAssistant?: () => void;
}

export default function LessonPlans({
  onSavePlan,
  onDeletePlan,
  onPrintPreview,
  onOpenAiAssistant,
}: LessonPlansProps) {
  // 1. Quản lý Thông tin hành chính (Metadata Bar)
  const [adminInfo, setAdminInfo] = useState<PreschoolAdminInfo>(() => getStoredAdminInfo());
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [tempAdminInfo, setTempAdminInfo] = useState<PreschoolAdminInfo>(adminInfo);

  // 2. Chuyển đổi Khối lớp & Lứa tuổi
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'Lớp 3-4 tuổi' | 'Nhóm 25-36 tháng'>(
    'Lớp 3-4 tuổi'
  );

  // 3. Tab điều hướng phân hệ
  const [activeTab, setActiveTab] = useState<
    'word_document' | 'matrix' | 'daily_detail' | 'objectives' | 'themes'
  >('word_document');
  const [highlightObjectiveCode, setHighlightObjectiveCode] = useState<string | undefined>(undefined);

  // 4. Kế hoạch tuần hiện hành
  const [currentWeekPlan, setCurrentWeekPlan] = useState<WeekCurriculumPlan>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('preschool_current_week_plan_v2');
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.error('Failed to load stored week plan:', e);
      }
    }
    return SAMPLE_WEEK_1_LESSON_PLAN_3_4T;
  });

  // Chọn ngày để xem giáo án chi tiết
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Chỉnh sửa ô ma trận tuần (Inline cell editing)
  const [editingCell, setEditingCell] = useState<{
    dayIndex: number;
    field: 'morning' | 'studyActivity' | 'cornerActivity' | 'outdoorActivity' | 'afternoonActivity';
    value: string;
  } | null>(null);

  // Modal chỉnh sửa giáo án chi tiết
  const [editingDayDetail, setEditingDayDetail] = useState<DayLessonDetail | null>(null);

  // Bộ lọc mục tiêu GD
  const [objFilterCategory, setObjFilterCategory] = useState<string>('all');
  const [objSearchTerm, setObjSearchTerm] = useState('');

  // AI Prompt Modal
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');
  const [aiDomainPrompt, setAiDomainPrompt] = useState('Khám phá khoa học');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Modal xem bản in
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPrintTemplate, setSelectedPrintTemplate] = useState<
    | 'full_dossier'
    | 'cover_page'
    | 'timetable_schedule'
    | 'four_weeks_matrix'
    | 'objectives_environment'
    | 'week_7_timepoints'
    | 'daily_lesson_steam5e'
  >('full_dossier');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sinh HTML theo template được chọn
  const getRenderedPrintHtml = (template = selectedPrintTemplate): string => {
    const ageGroupLabel = selectedAgeGroup === 'Lớp 3-4 tuổi' ? '3 - 4 TUỔI' : '25 - 36 THÁNG';
    const ageGroupShort = selectedAgeGroup === 'Lớp 3-4 tuổi' ? '3-4 tuổi' : '25-36 tháng';
    const currentThemeTitle = currentWeekPlan.themeName || 'QUYỂN 7: BÉ ĐI ĐƯỜNG AN TOÀN';
    const activeDay = currentWeekPlan.dayDetails[selectedDayIndex] || currentWeekPlan.dayDetails[0];

    switch (template) {
      case 'cover_page':
        return generateCoverPageHtml(adminInfo, currentThemeTitle, ageGroupLabel);
      case 'timetable_schedule':
        return generateTimetableAndScheduleHtml(adminInfo, ageGroupLabel);
      case 'four_weeks_matrix':
        return generateFourWeeksMatrixHtml(
          adminInfo,
          `KẾ HOẠCH GIÁO DỤC ${currentThemeTitle.toUpperCase()}`,
          ageGroupShort,
          THEME_7_FULL_MATRIX_DATA
        );
      case 'objectives_environment':
        return generateThemeObjectivesAndEnvironmentHtml(
          adminInfo,
          `KẾ HOẠCH NỘI DUNG GIÁO DỤC ${currentThemeTitle.toUpperCase()}`,
          '4 tuần (từ ngày 23/02 đến ngày 20/03/2026)',
          THEME_7_OBJECTIVES_DATA,
          THEME_7_ENVIRONMENT_DATA
        );
      case 'week_7_timepoints':
        return generateDetailedWeekPlan7TimepointsHtml(currentWeekPlan, adminInfo);
      case 'daily_lesson_steam5e':
        return generateDailySteam5ELessonHtml(activeDay, adminInfo, currentThemeTitle);
      case 'full_dossier':
      default:
        return generateFullPreschoolDossierHtml(
          adminInfo,
          currentWeekPlan,
          currentThemeTitle,
          ageGroupShort,
          activeDay
        );
    }
  };

  const handlePrintTemplate = (template = selectedPrintTemplate) => {
    const html = getRenderedPrintHtml(template);
    const title =
      template === 'full_dossier'
        ? `Trọn Bộ Hồ Sơ Giáo Án - ${currentWeekPlan.themeName}`
        : template === 'cover_page'
        ? `Trang Bìa - ${currentWeekPlan.themeName}`
        : template === 'timetable_schedule'
        ? `Thời Khóa Biểu & Thời Gian Biểu - ${adminInfo.schoolName}`
        : template === 'four_weeks_matrix'
        ? `Kế Hoạch Ma Trận 4 Tuần - ${currentWeekPlan.themeName}`
        : template === 'objectives_environment'
        ? `Nội Dung Giáo Dục & Môi Trường - ${currentWeekPlan.themeName}`
        : template === 'week_7_timepoints'
        ? `Kế Hoạch Tuần 7 Thời Điểm - ${currentWeekPlan.subTheme}`
        : `Giáo Án STEAM 5E - Thứ ${currentWeekPlan.dayDetails[selectedDayIndex]?.dayOfWeek || ''}`;

    openPrintBlobWindow(html, title, template === 'timetable_schedule' ? 'landscape' : 'portrait');
  };

  // Lưu plan vào LocalStorage khi có cập nhật
  useEffect(() => {
    try {
      localStorage.setItem('preschool_current_week_plan_v2', JSON.stringify(currentWeekPlan));
    } catch (e) {
      console.error('Failed to save week plan:', e);
    }
  }, [currentWeekPlan]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Danh mục chủ đề tương ứng theo khối lớp
  const themesList = useMemo(() => {
    return selectedAgeGroup === 'Lớp 3-4 tuổi' ? MASTER_THEMES_3_4T : MASTER_THEMES_25_36T;
  }, [selectedAgeGroup]);

  // Bộ lọc mục tiêu phát triển
  const filteredObjectives = useMemo(() => {
    return MASTER_PRESCHOOL_OBJECTIVES_3_4T.filter((obj) => {
      const matchCat = objFilterCategory === 'all' || obj.category === objFilterCategory;
      const matchSearch =
        objSearchTerm === '' ||
        obj.title.toLowerCase().includes(objSearchTerm.toLowerCase()) ||
        obj.targetContent.toLowerCase().includes(objSearchTerm.toLowerCase()) ||
        obj.code.toLowerCase().includes(objSearchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [objFilterCategory, objSearchTerm]);

  // Cập nhật thông tin hành chính
  const handleSaveAdminInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminInfo(tempAdminInfo);
    saveStoredAdminInfo(tempAdminInfo);
    setIsEditingAdmin(false);
    showToast('Đã lưu thông tin Giáo viên & Ban giám hiệu thành công!');
  };

  // Chuyển chủ đề nhanh
  const handleSelectTheme = (theme: PreschoolTheme, subThemeIndex: number = 0) => {
    const subThemeTitle = theme.subThemes[subThemeIndex] || `Tuần 1: ${theme.title}`;
    const updatedPlan: WeekCurriculumPlan = {
      ...currentWeekPlan,
      themeId: theme.id,
      themeName: `CHỦ ĐỀ ${theme.themeNumber}: ${theme.title}`,
      subTheme: subThemeTitle,
      dateRange: theme.duration,
      ageGroup: selectedAgeGroup,
    };
    setCurrentWeekPlan(updatedPlan);
    setActiveTab('matrix');
    showToast(`Đã chuyển sang Chủ đề ${theme.themeNumber}: ${theme.title}!`);
  };

  // Khôi phục kế hoạch gốc
  const handleRestoreDefaultPlan = () => {
    if (
      confirm(
        'Bạn có chắc chắn muốn khôi phục Kế hoạch Giáo dục & Giáo án về dữ liệu chuẩn gốc (Seed Backup)?'
      )
    ) {
      setCurrentWeekPlan(SAMPLE_WEEK_1_LESSON_PLAN_3_4T);
      setAdminInfo(DEFAULT_PRESCHOOL_ADMIN);
      saveStoredAdminInfo(DEFAULT_PRESCHOOL_ADMIN);
      localStorage.removeItem('preschool_current_week_plan_v2');
      showToast('Đã khôi phục toàn bộ Kế hoạch & Giáo án về bản chuẩn gốc!');
    }
  };

  // Lưu ô ma trận tuần
  const handleSaveCellEdit = () => {
    if (!editingCell) return;
    const { dayIndex, field, value } = editingCell;
    const updatedMatrix = [...currentWeekPlan.scheduleMatrix];
    updatedMatrix[dayIndex] = {
      ...updatedMatrix[dayIndex],
      [field]: value,
    };
    setCurrentWeekPlan({
      ...currentWeekPlan,
      scheduleMatrix: updatedMatrix,
    });
    setEditingCell(null);
    showToast('Đã cập nhật thời khóa biểu tuần!');
  };

  // Lưu giáo án chi tiết ngày
  const handleSaveDayDetail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDayDetail) return;
    const updatedDetails = [...currentWeekPlan.dayDetails];
    updatedDetails[selectedDayIndex] = editingDayDetail;

    // Cập nhật luôn vào ô ma trận tuần tương ứng
    const updatedMatrix = [...currentWeekPlan.scheduleMatrix];
    if (updatedMatrix[selectedDayIndex]) {
      updatedMatrix[selectedDayIndex] = {
        ...updatedMatrix[selectedDayIndex],
        studyActivity: editingDayDetail.topic,
        outdoorActivity: `${editingDayDetail.outdoorActivity.purposeTitle} (${editingDayDetail.outdoorActivity.gameMovement})`,
      };
    }

    setCurrentWeekPlan({
      ...currentWeekPlan,
      dayDetails: updatedDetails,
      scheduleMatrix: updatedMatrix,
    });
    setEditingDayDetail(null);
    showToast(`Đã lưu Giáo án chi tiết Thứ ${currentWeekPlan.dayDetails[selectedDayIndex]?.dayOfWeek}!`);
  };

  // AI Soạn giáo án STEAM 5E
  const handleGenerateAiLesson = async () => {
    if (!aiTopicPrompt.trim()) {
      alert('Vui lòng nhập tên đề tài bài dạy cần AI soạn giáo án!');
      return;
    }
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_lesson_plan',
          payload: {
            topic: aiTopicPrompt.trim(),
            domain: aiDomainPrompt,
            ageGroup: selectedAgeGroup,
            method: 'STEAM 5E',
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          const aiData = data.data;
          const currentDay = currentWeekPlan.dayDetails[selectedDayIndex] || currentWeekPlan.dayDetails[0];
          const updatedDay: DayLessonDetail = {
            ...currentDay,
            topic: `ĐỀ TÀI: ${aiTopicPrompt.trim().toUpperCase()} (STEAM 5E)`,
            activityType: `HOẠT ĐỘNG ${aiDomainPrompt.toUpperCase()}`,
            subjectDomain: `LĨNH VỰC PHÁT TRIỂN ${aiDomainPrompt.includes('Khoa học') || aiDomainPrompt.includes('Toán') ? 'NHẬN THỨC' : aiDomainPrompt.includes('Tạo hình') || aiDomainPrompt.includes('Âm nhạc') ? 'THẨM MĨ' : 'NGÔN NGỮ'}`,
            objectives: {
              knowledge: aiData.knowledge || [
                `Trẻ hiểu và nêu được đặc điểm cơ bản của đề tài ${aiTopicPrompt} (S).`,
                'Trẻ ứng dụng công cụ, vật liệu tạo hình phù hợp (T+E).',
                'Cảm nhận được nét đẹp thẩm mĩ và số lượng đếm được (A+M).',
              ],
              skills: aiData.skills || ['Rèn luyện kỹ năng quan sát, tư duy phản biện, làm việc nhóm.'],
              attitudes: aiData.attitudes || ['Hứng thú tích cực tham gia hoạt động, đoàn kết cùng bạn bè.'],
              integrationHCM: 'Tích hợp lời Bác Hồ dạy: Chăm chỉ học tập, giữ gìn vệ sinh chung.',
              genderIntegration: 'Giáo dục bình đẳng giới: Bạn trai bạn gái cùng nhau chia sẻ đồ chơi.',
            },
            preparation: {
              teacher: aiData.prepTeacher || 'Giáo án điện tử, tranh ảnh trực quan, mẫu vật thật, máy chiếu.',
              students: aiData.prepStudents || 'Đồ dùng học tập, bảng con, sáp màu, rổ nguyên vật liệu.',
            },
            steps: {
              step1_engage: aiData.engage || `Cô cho trẻ hát bài hát khởi động dẫn dắt vào đề tài ${aiTopicPrompt}. Gợi mở sự tò mò và gắn kết trẻ vào bài học.`,
              step2_explore: aiData.explore || `Cho trẻ chia nhóm khám phá vật thật/mô hình tranh ảnh về ${aiTopicPrompt}. Trẻ quan sát, thảo luận và đặt câu hỏi.`,
              step3_explain: aiData.explain || `Cô mời đại diện nhóm chia sẻ ý kiến. Cô khái quát, giải thích rõ các đặc điểm bản chất và củng cố kiến thức.`,
              step4_elaborate: aiData.elaborate || `Tổ chức trò chơi ứng dụng, thực hành tạo ra sản phẩm liên quan đến ${aiTopicPrompt}. Trẻ thi đua sôi nổi.`,
              step5_evaluate: aiData.evaluate || `Trưng bày sản phẩm, nhận xét tuyên dương các bạn và tổ chức hoạt động hồi tĩnh nhẹ nhàng.`,
            },
          };

          const updatedDetails = [...currentWeekPlan.dayDetails];
          updatedDetails[selectedDayIndex] = updatedDay;
          setCurrentWeekPlan({
            ...currentWeekPlan,
            dayDetails: updatedDetails,
          });
          setAiModalOpen(false);
          setAiTopicPrompt('');
          showToast('AI đã tạo thành công Giáo án STEAM 5E chi tiết!');
        }
      } else {
        alert('Không thể kết nối AI, vui lòng thử lại sau giây lát!');
      }
    } catch (err) {
      console.error('AI Lesson Plan Error:', err);
      alert('Đã xảy ra lỗi khi tạo giáo án bằng AI!');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const activeDayDetail = currentWeekPlan.dayDetails[selectedDayIndex] || currentWeekPlan.dayDetails[0];

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner & Thông tin Hành chính */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-2xl shadow-md border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase bg-amber-400 text-slate-950 rounded-md">
                GIÁO ÁN MẦM NON CHUẨN (2025 - 2026)
              </span>
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-md flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Mô hình STEAM (5E & EDP)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-400" />
              Kế Hoạch Giáo Dục & Giáo Án Mầm Non
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Hệ thống số hóa toàn diện <strong>10 Chủ đề giáo dục</strong>, Kế hoạch tuần ma trận và Bài soạn chi tiết STEAM (5E/EDP). Cho phép tùy biến thông tin giáo viên, ban giám hiệu và ngày tháng linh hoạt.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleRestoreDefaultPlan}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Khôi phục nguyên bản kế hoạch giáo dục mẫu gốc"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Khôi phục bản gốc</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHighlightObjectiveCode(undefined);
                setActiveTab('word_document');
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>📖 Bộ Giáo Án Chuẩn Word</span>
            </button>

            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>✨ AI Soạn giáo án 5E</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>In Kế hoạch / Giáo án</span>
            </button>
          </div>
        </div>

        {/* Administrative Metadata Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-200">
            <div className="bg-slate-800/70 p-2.5 rounded-xl border border-indigo-900/50">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Cơ sở / Trường</span>
              <span className="font-bold text-white truncate block">{adminInfo.schoolName}</span>
            </div>
            <div className="bg-slate-800/70 p-2.5 rounded-xl border border-indigo-900/50">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Giáo viên phụ trách</span>
              <span className="font-bold text-amber-300 truncate block">{adminInfo.teachers}</span>
            </div>
            <div className="bg-slate-800/70 p-2.5 rounded-xl border border-indigo-900/50">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Người duyệt / BGH</span>
              <span className="font-bold text-emerald-300 truncate block">{adminInfo.approver}</span>
            </div>
            <div className="bg-slate-800/70 p-2.5 rounded-xl border border-indigo-900/50">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Năm học & Thời gian</span>
              <span className="font-bold text-sky-300 block">
                Năm học {adminInfo.schoolYear} ({currentWeekPlan.dateRange})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTempAdminInfo(adminInfo);
              setIsEditingAdmin(true);
            }}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 self-start md:self-center shrink-0 cursor-pointer shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Sửa thông tin trường/cô</span>
          </button>
        </div>
      </div>

      {/* 2. Bộ Lọc Chuyển Đổi Khối Lớp & Navigation Tabs */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Age Group Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            Khối lớp:
          </span>
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setSelectedAgeGroup('Lớp 3-4 tuổi');
                showToast('Đã chuyển sang Chương trình Lớp 3-4 Tuổi');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedAgeGroup === 'Lớp 3-4 tuổi'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lớp 3-4 tuổi (Mẫu giáo Bé)
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAgeGroup('Nhóm 25-36 tháng');
                showToast('Đã chuyển sang Chương trình Nhóm 25-36 Tháng (Nhà trẻ)');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedAgeGroup === 'Nhóm 25-36 tháng'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nhóm 25-36 tháng (Nhà trẻ)
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab('word_document');
              setHighlightObjectiveCode(undefined);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === 'word_document'
                ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border-blue-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Bộ Giáo Án Hoàn Chỉnh (Word)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === 'matrix'
                ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>2. Kế hoạch Tuần (Matrix)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('daily_detail')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === 'daily_detail'
                ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>3. Giáo án Chi tiết ngày (5E)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('objectives')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === 'objectives'
                ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>4. Khung 69 Mục tiêu GD</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('themes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
              activeTab === 'themes'
                ? 'bg-indigo-900 text-white border-indigo-900 shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. 10 Chủ đề Năm học</span>
          </button>
        </div>
      </div>

      {/* 2.5 TAB 1: BỘ GIÁO ÁN HOÀN CHỈNH CHUẨN WORD (WORD DOCUMENT VIEWER) */}
      {activeTab === 'word_document' && (
        <WordDocumentViewer
          adminInfo={adminInfo}
          highlightObjectiveCode={highlightObjectiveCode}
          onClose={() => setActiveTab('matrix')}
          onOpenAiAssistant={() => setAiModalOpen(true)}
        />
      )}

      {/* 3. TAB 1: KẾ HOẠCH TUẦN (SCHEDULE MATRIX) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Header Card của Tuần */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                  {currentWeekPlan.ageGroup}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  Thời gian: {currentWeekPlan.dateRange}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>{currentWeekPlan.themeName}</span>
                <span className="text-slate-400 font-normal">—</span>
                <span className="text-blue-800 font-bold">{currentWeekPlan.subTheme}</span>
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setHighlightObjectiveCode(undefined);
                  setActiveTab('word_document');
                }}
                className="px-3 py-1.5 bg-blue-900 text-white hover:bg-blue-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>Xem Toàn Bộ Giáo Án (Word)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('daily_detail');
                  setSelectedDayIndex(0);
                }}
                className="px-3 py-1.5 bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Xem giáo án Thứ Hai</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Ma trận Lịch tuần Thứ 2 -> Thứ 6 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-center">
                    <th className="p-3 w-40 border-r border-slate-800">Thời điểm / Hoạt động</th>
                    {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                      <th key={idx} className="p-3 border-r border-slate-800 last:border-r-0">
                        <div className="text-sm font-black text-amber-300">Thứ {item.dayOfWeek}</div>
                        <div className="text-[11px] text-slate-300 font-normal font-mono">{item.date}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Row 1: Đón trẻ & Thể dục sáng */}
                  <tr className="hover:bg-blue-50/20">
                    <td className="p-3 font-bold text-slate-900 bg-slate-50/80 border-r border-slate-200 align-top">
                      <div className="flex items-center gap-1.5 text-blue-900 font-extrabold mb-1">
                        <Sun className="w-4 h-4 text-amber-500" />
                        1. Đón trẻ, chơi & Thể dục sáng
                      </div>
                      <div className="text-[10px] text-slate-500">Điểm danh, kiểm tra sức khỏe, bài tập PTC</div>
                    </td>
                    {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                      <td
                        key={idx}
                        onClick={() =>
                          setEditingCell({
                            dayIndex: idx,
                            field: 'morning',
                            value: item.morning,
                          })
                        }
                        className="p-3 border-r border-slate-200 last:border-r-0 text-slate-700 align-top cursor-pointer hover:bg-blue-50/50 transition-colors group relative"
                        title="Nhấp để chỉnh sửa nội dung"
                      >
                        <div className="line-clamp-4 leading-relaxed">{item.morning}</div>
                        <span className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] text-blue-700 font-bold bg-white px-1.5 py-0.5 rounded shadow-xs border border-blue-200">
                          Sửa
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 2: Hoạt động học chính (STEAM 5E) */}
                  <tr className="bg-amber-50/30 hover:bg-amber-50/50">
                    <td className="p-3 font-bold text-slate-900 bg-amber-100/50 border-r border-slate-200 align-top">
                      <div className="flex items-center gap-1.5 text-amber-950 font-extrabold mb-1">
                        <BookOpen className="w-4 h-4 text-amber-700" />
                        2. Hoạt động học (STEAM 5E)
                      </div>
                      <div className="text-[10px] text-amber-800">Khám phá, Âm nhạc, Toán, Văn học, Thể dục</div>
                    </td>
                    {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                      <td
                        key={idx}
                        className="p-3 border-r border-slate-200 last:border-r-0 align-top"
                      >
                        <div className="font-bold text-blue-950 mb-1.5 leading-snug">
                          {item.studyActivity}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDayIndex(idx);
                            setActiveTab('daily_detail');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 shadow-2xs transition-all cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Xem giáo án chi tiết</span>
                        </button>
                      </td>
                    ))}
                  </tr>

                  {/* Row 3: Hoạt động góc */}
                  <tr className="hover:bg-blue-50/20">
                    <td className="p-3 font-bold text-slate-900 bg-slate-50/80 border-r border-slate-200 align-top">
                      <div className="flex items-center gap-1.5 text-purple-900 font-extrabold mb-1">
                        <Layers className="w-4 h-4 text-purple-600" />
                        3. Hoạt động góc (5 góc)
                      </div>
                      <div className="text-[10px] text-slate-500">Phân vai, Xây dựng, Tạo hình, Sách, Khám phá</div>
                    </td>
                    {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                      <td
                        key={idx}
                        onClick={() =>
                          setEditingCell({
                            dayIndex: idx,
                            field: 'cornerActivity',
                            value: item.cornerActivity,
                          })
                        }
                        className="p-3 border-r border-slate-200 last:border-r-0 text-slate-700 align-top cursor-pointer hover:bg-blue-50/50 transition-colors group relative"
                        title="Nhấp để chỉnh sửa nội dung"
                      >
                        <div className="line-clamp-4 leading-relaxed">{item.cornerActivity}</div>
                        <span className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] text-blue-700 font-bold bg-white px-1.5 py-0.5 rounded shadow-xs border border-blue-200">
                          Sửa
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 4: Hoạt động ngoài trời */}
                  <tr className="hover:bg-blue-50/20">
                    <td className="p-3 font-bold text-slate-900 bg-slate-50/80 border-r border-slate-200 align-top">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold mb-1">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        4. Hoạt động ngoài trời
                      </div>
                      <div className="text-[10px] text-slate-500">HĐ có chủ đích, trò chơi vận động & dân gian</div>
                    </td>
                    {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                      <td
                        key={idx}
                        onClick={() =>
                          setEditingCell({
                            dayIndex: idx,
                            field: 'outdoorActivity',
                            value: item.outdoorActivity,
                          })
                        }
                        className="p-3 border-r border-slate-200 last:border-r-0 text-slate-700 align-top cursor-pointer hover:bg-blue-50/50 transition-colors group relative"
                        title="Nhấp để chỉnh sửa nội dung"
                      >
                        <div className="line-clamp-4 leading-relaxed">{item.outdoorActivity}</div>
                        <span className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] text-blue-700 font-bold bg-white px-1.5 py-0.5 rounded shadow-xs border border-blue-200">
                          Sửa
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: Ăn, ngủ, vệ sinh & Chiều */}
                  <tr className="hover:bg-blue-50/20">
                    <td className="p-3 font-bold text-slate-900 bg-slate-50/80 border-r border-slate-200 align-top">
                      <div className="flex items-center gap-1.5 text-cyan-900 font-extrabold mb-1">
                        <Clock className="w-4 h-4 text-cyan-600" />
                        5. Ăn ngủ & Hoạt động chiều
                      </div>
                      <div className="text-[10px] text-slate-500">Ôn tập, làm quen bài mới, nêu gương trả trẻ</div>
                    </td>
                    {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                      <td
                        key={idx}
                        onClick={() =>
                          setEditingCell({
                            dayIndex: idx,
                            field: 'afternoonActivity',
                            value: item.afternoonActivity,
                          })
                        }
                        className="p-3 border-r border-slate-200 last:border-r-0 text-slate-700 align-top cursor-pointer hover:bg-blue-50/50 transition-colors group relative"
                        title="Nhấp để chỉnh sửa nội dung"
                      >
                        <div className="line-clamp-4 leading-relaxed">{item.afternoonActivity}</div>
                        <span className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] text-blue-700 font-bold bg-white px-1.5 py-0.5 rounded shadow-xs border border-blue-200">
                          Sửa
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: GIÁO ÁN CHI TIẾT TỪNG NGÀY (STEAM 5E / EDP) */}
      {activeTab === 'daily_detail' && (
        <div className="space-y-4">
          {/* Day Selector Buttons */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-500 mr-1">Chọn ngày soạn:</span>
              {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    selectedDayIndex === idx
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  <span>Thứ {item.dayOfWeek}</span>
                  <span className="text-[10px] opacity-80">({item.date})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingDayDetail(activeDayDetail)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Chỉnh sửa giáo án này</span>
              </button>
            </div>
          </div>

          {/* Chi tiết Giáo Án Bài Dạy */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            {/* Header Giáo Án */}
            <div className="border-b-2 border-slate-200 pb-5 text-center space-y-2">
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-2 mb-2">
                <div className="font-bold uppercase text-slate-800">
                  {adminInfo.unitName} — {adminInfo.schoolName}
                </div>
                <div className="italic">
                  Thứ {activeDayDetail.dayOfWeek}, ngày {activeDayDetail.dateStr}
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-extrabold uppercase inline-block">
                {activeDayDetail.subjectDomain}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeDayDetail.topic}
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                Khối: <strong>{selectedAgeGroup}</strong> | Giáo viên giảng dạy: <strong>{adminInfo.teachers}</strong>
              </div>
            </div>

            {/* I. Mục đích yêu cầu */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-blue-950 uppercase border-l-4 border-blue-700 pl-2.5">
                I. Mục đích — Yêu cầu:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-3">
                <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 space-y-1.5">
                  <h4 className="font-bold text-blue-950 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    1. Kiến thức (S-T-E-A-M):
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {activeDayDetail.objectives.knowledge.map((k, i) => (
                      <li key={i} className="leading-relaxed">{k}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 space-y-1.5">
                  <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    2. Kỹ năng:
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {activeDayDetail.objectives.skills.map((s, i) => (
                      <li key={i} className="leading-relaxed">{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-1.5">
                  <h4 className="font-bold text-purple-950 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    3. Thái độ & Lồng ghép:
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {activeDayDetail.objectives.attitudes.map((a, i) => (
                      <li key={i} className="leading-relaxed">{a}</li>
                    ))}
                  </ul>
                  {activeDayDetail.objectives.integrationHCM && (
                    <div className="text-[11px] text-purple-900 bg-purple-100/70 p-2 rounded-lg mt-1.5 italic">
                      ★ {activeDayDetail.objectives.integrationHCM}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* II. Chuẩn bị */}
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-blue-950 uppercase border-l-4 border-blue-700 pl-2.5">
                II. Chuẩn bị:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">👩‍🏫 Đồ dùng của Cô:</strong>
                  <p className="text-slate-700 leading-relaxed">{activeDayDetail.preparation.teacher}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">👦👧 Đồ dùng của Trẻ:</strong>
                  <p className="text-slate-700 leading-relaxed">{activeDayDetail.preparation.students}</p>
                </div>
              </div>
            </div>

            {/* III. Tiến trình 5E */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-blue-950 uppercase border-l-4 border-blue-700 pl-2.5 flex items-center gap-2">
                <span>III. Tiến trình hoạt động (Mô hình STEAM 5E):</span>
              </h3>
              <div className="space-y-2.5 pl-3">
                <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80">
                  <h4 className="font-extrabold text-amber-950 text-xs mb-1">
                    1. Gắn kết (Engage) — Thu hút, gợi mở vấn đề:
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed">{activeDayDetail.steps.step1_engage}</p>
                </div>

                <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200/80">
                  <h4 className="font-extrabold text-blue-950 text-xs mb-1">
                    2. Khám phá (Explore) — Trải nghiệm, tìm tòi:
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed">{activeDayDetail.steps.step2_explore}</p>
                </div>

                <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-200/80">
                  <h4 className="font-extrabold text-indigo-950 text-xs mb-1">
                    3. Giải thích / Chia sẻ (Explain) — Thuyết trình, đàm thoại:
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed">{activeDayDetail.steps.step3_explain}</p>
                </div>

                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/80">
                  <h4 className="font-extrabold text-emerald-950 text-xs mb-1">
                    4. Áp dụng / Củng cố (Elaborate) — Mở rộng kiến thức, trò chơi:
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed">{activeDayDetail.steps.step4_elaborate}</p>
                </div>

                <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-200/80">
                  <h4 className="font-extrabold text-rose-950 text-xs mb-1">
                    5. Đánh giá (Evaluate) — Nhận xét, tuyên dương:
                  </h4>
                  <p className="text-xs text-slate-800 leading-relaxed">{activeDayDetail.steps.step5_evaluate}</p>
                </div>
              </div>
            </div>

            {/* Trích đoạn thơ / truyện nếu có */}
            {activeDayDetail.poemStorySongText && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">📖 Văn bản đính kèm (Thơ / Truyện / Lời ca):</span>
                <pre className="text-xs font-serif text-slate-800 whitespace-pre-wrap leading-relaxed italic bg-white p-3 rounded-lg border border-slate-200">
                  {activeDayDetail.poemStorySongText}
                </pre>
              </div>
            )}

            {/* Chữ ký phê duyệt */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 uppercase">NGƯỜI DUYỆT BGH</div>
                <div className="text-[11px] text-slate-500 italic">(Ký và ghi rõ họ tên)</div>
                <div className="h-16 flex items-center justify-center font-serif text-slate-400 italic">
                  (Đã ký duyệt)
                </div>
                <div className="font-bold text-slate-900">{adminInfo.approver}</div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900 uppercase">GIÁO VIÊN SOẠN BÀI</div>
                <div className="text-[11px] text-slate-500 italic">(Ký và ghi rõ họ tên)</div>
                <div className="h-16 flex items-center justify-center font-serif text-slate-400 italic">
                  (Đã ký tên)
                </div>
                <div className="font-bold text-slate-900">{adminInfo.teachers}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: KHUNG 69 MỤC TIÊU GIÁO DỤC (MT1 - MT69) */}
      {activeTab === 'objectives' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm mục tiêu (VD: MT1, thăng bằng, số lượng, hát...)"
                value={objSearchTerm}
                onChange={(e) => setObjSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              <span className="font-bold text-slate-500 whitespace-nowrap">Lĩnh vực:</span>
              {['all', 'Thể chất', 'Nhận thức', 'Ngôn ngữ', 'Tình cảm - KNXH', 'Thẩm mĩ'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setObjFilterCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      objFilterCategory === cat
                        ? 'bg-blue-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả (69 MT)' : cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredObjectives.map((obj) => (
              <div
                key={obj.id}
                onClick={() => {
                  setHighlightObjectiveCode(obj.code);
                  setActiveTab('word_document');
                }}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2.5 cursor-pointer group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                      {obj.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {obj.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {obj.title}
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {obj.targetContent}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] text-blue-900 bg-blue-50/60 p-2 rounded-lg">
                    <strong className="block text-[10px] text-blue-700 uppercase font-bold">
                      Hoạt động giáo dục áp dụng:
                    </strong>
                    <span>{obj.activities}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHighlightObjectiveCode(obj.code);
                      setActiveTab('word_document');
                    }}
                    className="w-full py-1.5 px-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>Xem Giáo Án Hoàn Chỉnh (Word) →</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: 10 CHỦ ĐỀ NĂM HỌC */}
      {activeTab === 'themes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-700" />
              Lộ Trình 10 Chủ Đề Năm Học (2025 - 2026) — {selectedAgeGroup}
            </h3>
            <span className="text-xs font-bold text-slate-500">35 - 46 tuần thực hiện</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themesList.map((theme) => (
              <div
                key={theme.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                        CHỦ ĐỀ {theme.themeNumber} ({theme.weeksCount} TUẦN)
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900">{theme.title}</h4>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200">
                      {theme.duration}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">{theme.description}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 block">Các chủ đề nhánh:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {theme.subThemes.map((st, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectTheme(theme, i)}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-800 transition-colors cursor-pointer text-left"
                        >
                          {st} →
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setHighlightObjectiveCode(undefined);
                      setActiveTab('word_document');
                    }}
                    className="w-full py-2 bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Xem Trọn Bộ Giáo Án (Word Template)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTheme(theme, 0)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                  >
                    <span>Xem Kế hoạch Phân bổ Tuần (Matrix)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: CHỈNH SỬA THÔNG TIN HÀNH CHÍNH */}
      {isEditingAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAdminInfo}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-700" />
                Cấu hình Thông tin Trường & Giáo viên
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingAdmin(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cơ quan / UBND chủ quản</label>
                <input
                  type="text"
                  required
                  value={tempAdminInfo.unitName}
                  onChange={(e) =>
                    setTempAdminInfo({ ...tempAdminInfo, unitName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Trường / Cơ sở mầm non</label>
                <input
                  type="text"
                  required
                  value={tempAdminInfo.schoolName}
                  onChange={(e) =>
                    setTempAdminInfo({ ...tempAdminInfo, schoolName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Giáo viên soạn / Đứng lớp (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  required
                  value={tempAdminInfo.teachers}
                  onChange={(e) =>
                    setTempAdminInfo({ ...tempAdminInfo, teachers: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-amber-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Người duyệt / Ban Giám Hiệu (Chức vụ & Họ tên)
                </label>
                <input
                  type="text"
                  required
                  value={tempAdminInfo.approver}
                  onChange={(e) =>
                    setTempAdminInfo({ ...tempAdminInfo, approver: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold text-emerald-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Năm học</label>
                  <input
                    type="text"
                    value={tempAdminInfo.schoolYear}
                    onChange={(e) =>
                      setTempAdminInfo({ ...tempAdminInfo, schoolYear: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Địa phương ký duyệt</label>
                  <input
                    type="text"
                    value={tempAdminInfo.location}
                    onChange={(e) =>
                      setTempAdminInfo({ ...tempAdminInfo, location: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsEditingAdmin(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu thông tin</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: CHỈNH SỬA Ô MA TRẬN TUẦN */}
      {editingCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-700" />
                Chỉnh sửa nội dung Thứ {currentWeekPlan.scheduleMatrix[editingCell.dayIndex]?.dayOfWeek}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Nội dung hoạt động:</label>
              <textarea
                rows={4}
                value={editingCell.value}
                onChange={(e) =>
                  setEditingCell({ ...editingCell, value: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveCellEdit}
                className="px-4 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CHỈNH SỬA GIÁO ÁN CHI TIẾT NGÀY */}
      {editingDayDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveDayDetail}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                Chỉnh sửa Giáo Án Chi Tiết (Thứ {editingDayDetail.dayOfWeek})
              </h3>
              <button
                type="button"
                onClick={() => setEditingDayDetail(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lĩnh vực phát triển</label>
                  <input
                    type="text"
                    required
                    value={editingDayDetail.subjectDomain}
                    onChange={(e) =>
                      setEditingDayDetail({ ...editingDayDetail, subjectDomain: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đề tài bài dạy</label>
                  <input
                    type="text"
                    required
                    value={editingDayDetail.topic}
                    onChange={(e) =>
                      setEditingDayDetail({ ...editingDayDetail, topic: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-blue-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">1. Gắn kết (Engage):</label>
                <textarea
                  rows={2}
                  value={editingDayDetail.steps.step1_engage}
                  onChange={(e) =>
                    setEditingDayDetail({
                      ...editingDayDetail,
                      steps: { ...editingDayDetail.steps, step1_engage: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">2. Khám phá (Explore):</label>
                <textarea
                  rows={2}
                  value={editingDayDetail.steps.step2_explore}
                  onChange={(e) =>
                    setEditingDayDetail({
                      ...editingDayDetail,
                      steps: { ...editingDayDetail.steps, step2_explore: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">3. Giải thích / Chia sẻ (Explain):</label>
                <textarea
                  rows={2}
                  value={editingDayDetail.steps.step3_explain}
                  onChange={(e) =>
                    setEditingDayDetail({
                      ...editingDayDetail,
                      steps: { ...editingDayDetail.steps, step3_explain: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">4. Áp dụng / Củng cố (Elaborate):</label>
                <textarea
                  rows={2}
                  value={editingDayDetail.steps.step4_elaborate}
                  onChange={(e) =>
                    setEditingDayDetail({
                      ...editingDayDetail,
                      steps: { ...editingDayDetail.steps, step4_elaborate: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">5. Đánh giá (Evaluate):</label>
                <textarea
                  rows={2}
                  value={editingDayDetail.steps.step5_evaluate}
                  onChange={(e) =>
                    setEditingDayDetail({
                      ...editingDayDetail,
                      steps: { ...editingDayDetail.steps, step5_evaluate: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingDayDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-blue-900 hover:bg-blue-950 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu giáo án</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 4: AI SOẠN GIÁO ÁN STEAM 5E */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-600 text-white rounded-lg shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  ✨ AI Soạn Giáo Án Mầm Non STEAM (5E)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đề tài bài dạy cần soạn <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Khám phá quả cam và quả bưởi, Thơ Bé yêu biển lắm, Chạy dích dắc..."
                  value={aiTopicPrompt}
                  onChange={(e) => setAiTopicPrompt(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lĩnh vực hoạt động</label>
                  <select
                    value={aiDomainPrompt}
                    onChange={(e) => setAiDomainPrompt(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    <option value="Khám phá khoa học">Khám phá khoa học</option>
                    <option value="Khám phá xã hội">Khám phá xã hội</option>
                    <option value="Làm quen toán sơ đẳng">Làm quen toán sơ đẳng</option>
                    <option value="Hoạt động văn học (Thơ/Truyện)">Hoạt động văn học (Thơ/Truyện)</option>
                    <option value="Hoạt động âm nhạc">Hoạt động âm nhạc</option>
                    <option value="Hoạt động tạo hình">Hoạt động tạo hình</option>
                    <option value="Hoạt động thể dục vận động">Hoạt động thể dục vận động</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Áp dụng cho ngày</label>
                  <select
                    value={selectedDayIndex}
                    onChange={(e) => setSelectedDayIndex(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                  >
                    {currentWeekPlan.scheduleMatrix.map((item, idx) => (
                      <option key={idx} value={idx}>
                        Thứ {item.dayOfWeek} ({item.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 space-y-1">
                <span className="font-bold block">💡 Trợ lý AI sẽ tự động tạo:</span>
                <p className="leading-relaxed text-[11px]">
                  • Mục tiêu S-T-E-A-M chuẩn Bộ GD&ĐT & Tích hợp lời dạy Bác Hồ.<br />
                  • Chuẩn bị đồ dùng của cô và cháu.<br />
                  • Tiến trình 5 bước 5E: Gắn kết, Khám phá, Giải thích, Áp dụng, Đánh giá.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleGenerateAiLesson}
                disabled={isAiGenerating || !aiTopicPrompt.trim()}
                className="px-4 py-2 text-xs font-bold bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI đang phân tích & soạn bài...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tạo Giáo Án Ngay</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: XEM BẢN IN GIÁO ÁN & KẾ HOẠCH THEO TEMPLATE CHUẨN */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[94vh] flex flex-col overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Xuất In Hồ Sơ Giáo Án Theo Template Mẫu Khách Hàng</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-medium border border-emerald-500/30">
                      Chuẩn Khung Viền & Thể Thức
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Hỗ trợ in trọn bộ hoặc từng phần: Bìa khung nghệ thuật, TKB, Ma trận 4 tuần, Mục tiêu GD, 7 thời điểm & Giáo án 5E.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintTemplate(selectedPrintTemplate)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                  title="Mở hộp thoại in trình duyệt chuẩn trang in A4"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>🖨️ In / Xuất PDF Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Template Selector Bar */}
            <div className="bg-slate-100 p-2.5 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5 text-xs shrink-0">
              <span className="text-[11px] font-bold text-slate-500 uppercase px-2 whitespace-nowrap">
                Chọn Mẫu In:
              </span>

              <button
                type="button"
                onClick={() => setSelectedPrintTemplate('full_dossier')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedPrintTemplate === 'full_dossier'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🌟 Trọn Bộ Hồ Sơ (Đầy đủ)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPrintTemplate('cover_page')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedPrintTemplate === 'cover_page'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>📜 1. Trang Bìa Khung Viền</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPrintTemplate('timetable_schedule')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedPrintTemplate === 'timetable_schedule'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>⏰ 2. TKB & Thời Gian Biểu</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPrintTemplate('four_weeks_matrix')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedPrintTemplate === 'four_weeks_matrix'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>📊 3. Ma Trận 4 Tuần</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPrintTemplate('objectives_environment')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedPrintTemplate === 'objectives_environment'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>📑 4. Nội Dung & Môi Trường GD</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPrintTemplate('week_7_timepoints')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedPrintTemplate === 'week_7_timepoints'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🗓️ 5. Kế Hoạch 7 Thời Điểm</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPrintTemplate('daily_lesson_steam5e')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                  selectedPrintTemplate === 'daily_lesson_steam5e'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>🎓 6. Bài Soạn STEAM 5E</span>
              </button>
            </div>

            {/* Print Preview Canvas Frame */}
            <div className="flex-1 bg-slate-200/80 p-4 sm:p-6 overflow-y-auto flex justify-center">
              <div className="w-full max-w-[860px] bg-white shadow-xl rounded-lg p-6 sm:p-10 border border-slate-300 min-h-full">
                <div
                  className="font-serif text-slate-900 text-xs leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: getRenderedPrintHtml(selectedPrintTemplate) }}
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Mẹo in chuẩn:</span>
                <span>Trên hộp thoại in trình duyệt, chọn khổ giấy <strong>A4</strong> và đánh dấu <strong>&quot;Background graphics&quot; (Đồ họa nền)</strong> để viền hoa văn sắc nét nhất.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintTemplate(selectedPrintTemplate)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In Mẫu Hiện Tại ({selectedPrintTemplate})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintTemplate('full_dossier')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>In Trọn Bộ Hồ Sơ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
