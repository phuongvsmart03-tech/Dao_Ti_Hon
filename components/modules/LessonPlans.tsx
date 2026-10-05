'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  GraduationCap,
  Layers,
  Printer,
  Search,
  Sparkles,
  Users,
  School,
  Clock,
  Download,
  Share2,
  Plus,
  Edit3,
  Trash2,
  Save,
  Check,
  RotateCcw,
} from 'lucide-react';
import { LessonPlan } from '@/types/preschool';
import {
  DEFAULT_PRESCHOOL_ADMIN,
  PreschoolAdminInfo,
  getStoredAdminInfo,
  saveStoredAdminInfo,
} from '@/lib/preschool-curriculum-data';
import { THEME_1_DOSSIER } from '@/lib/preschool-full-dossiers';
import A4DocumentSuite from './lesson-plans/A4DocumentSuite';
import YearPlanAndObjectivesView from './lesson-plans/YearPlanAndObjectivesView';
import MonthlyPlansToddlerView from './lesson-plans/MonthlyPlansToddlerView';
import GoogleDocsSyncModal from './lesson-plans/GoogleDocsSyncModal';

interface LessonPlansProps {
  plans?: LessonPlan[];
  onSavePlan?: (plan: LessonPlan) => void;
  onDeletePlan?: (id: string) => void;
  onPrintPreview?: () => void;
  onOpenAiAssistant?: () => void;
}

export default function LessonPlans({
  plans = [],
  onSavePlan,
  onDeletePlan,
  onPrintPreview,
  onOpenAiAssistant,
}: LessonPlansProps) {
  // 1. Quản lý thông tin trường & giáo viên
  const [adminInfo, setAdminInfo] = useState<PreschoolAdminInfo>(() => getStoredAdminInfo());
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [tempAdminInfo, setTempAdminInfo] = useState<PreschoolAdminInfo>(adminInfo);

  // 2. Tab chính
  const [activeTab, setActiveTab] = useState<'a4_dossier' | 'year_objectives' | 'toddlers_25_36' | 'quick_editor'>('a4_dossier');

  // 3. Khối lớp đang chọn
  const [selectedClassGroup, setSelectedClassGroup] = useState<'3_4T' | '25_36T'>('3_4T');

  // 4. Chủ đề đang chọn trong A4 Document Suite
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);

  // 5. State cho Quick Editor (Soạn bài mới)
  const [customPlans, setCustomPlans] = useState<LessonPlan[]>(plans);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [newPlanForm, setNewPlanForm] = useState<{
    topic: string;
    domain: string;
    ageGroup: 'Mẫu giáo Bé (3-4 tuổi)' | 'Nhà trẻ (18-36 tháng)';
    objective: string;
    method: string;
    preparation: string;
    steps: string;
  }>({
    topic: '',
    domain: 'Khám phá khoa học',
    ageGroup: 'Mẫu giáo Bé (3-4 tuổi)',
    objective: '',
    method: 'STEAM 5E',
    preparation: '',
    steps: '',
  });
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Cập nhật thông tin hành chính
  const handleSaveAdmin = () => {
    setAdminInfo(tempAdminInfo);
    saveStoredAdminInfo(tempAdminInfo);
    setIsEditingAdmin(false);
  };

  const handleCreateNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanForm.topic.trim()) return;

    const newPlan: LessonPlan = {
      id: `custom_plan_${Date.now()}`,
      title: newPlanForm.topic,
      theme: 'Chủ đề giáo án phát triển',
      topic: newPlanForm.topic,
      developmentField: newPlanForm.domain,
      ageGroup: newPlanForm.ageGroup,
      teacherName: adminInfo.teachers || 'Võ Thị Hồng Sim - Bá Thị Thanh Xuân',
      approverName: adminInfo.approver || 'Lê Thị Ngọc Châu',
      weekNumber: 1,
      approvalStatus: 'Đã phê duyệt',
      learningObjectives: newPlanForm.objective || 'Trẻ nhận biết đặc điểm đối tượng và hứng thú tham gia',
      preparation: newPlanForm.preparation || 'Tranh ảnh, học cụ trực quan',
      activitiesPlan: newPlanForm.steps || 'Quy trình STEAM 5E: Gắn kết, Khám phá, Giải thích, Củng cố và Đánh giá',
    };

    if (onSavePlan) {
      onSavePlan(newPlan);
    }
    setCustomPlans((prev) => [newPlan, ...prev]);
    setIsCreatingNew(false);
    setNewPlanForm({
      topic: '',
      domain: 'Khám phá khoa học',
      ageGroup: 'Mẫu giáo Bé (3-4 tuổi)',
      objective: '',
      method: 'STEAM 5E',
      preparation: '',
      steps: '',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. THANH TIÊU ĐỀ & THÔNG TIN HÀNH CHÍNH (Metadata Bar) */}
      <div className="bg-gradient-to-r from-[#0a2550] via-[#103a75] to-[#0c2e62] text-white rounded-2xl p-5 sm:p-6 border border-blue-600/40 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
              <span className="text-blue-300 font-bold flex items-center gap-1.5 bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-400/30">
                <BookOpen className="w-3.5 h-3.5 text-blue-300" />
                Hồ Sơ Giáo Dục
              </span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="text-blue-100">STEAM 5E &amp; Khung Chuẩn Bộ GD&amp;ĐT</span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="font-mono text-blue-200 font-semibold">Năm học {adminInfo.schoolYear || '2025 - 2026'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5 drop-shadow-xs">
              Hồ Sơ Kế Hoạch Chăm Sóc &amp; Giáo Dục Trẻ
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-2xl leading-relaxed font-normal">
              Hệ thống số hóa toàn diện 10 quyển giáo án mầm non chuẩn khung Word (A4 từng trang, TKB, TGB, Ma trận 3 cột, STEAM 5E) và xuất in chuẩn chỉ.
            </p>
          </div>

          {/* Hộp thông tin giáo viên & nút sửa */}
          <div className="bg-blue-950/80 rounded-xl p-3.5 border border-blue-400/30 min-w-[280px]">
            {isEditingAdmin ? (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-slate-300 block mb-0.5">Giáo viên:</label>
                  <input
                    type="text"
                    value={tempAdminInfo.teachers}
                    onChange={(e) => setTempAdminInfo({ ...tempAdminInfo, teachers: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-white/20 text-white border border-white/30 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-0.5">Phó Hiệu trưởng duyệt:</label>
                  <input
                    type="text"
                    value={tempAdminInfo.approver}
                    onChange={(e) => setTempAdminInfo({ ...tempAdminInfo, approver: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-white/20 text-white border border-white/30 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveAdmin}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Lưu
                  </button>
                  <button
                    onClick={() => setIsEditingAdmin(false)}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-xs"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-blue-200">
                  <span className="font-semibold">GIÁO VIÊN:</span>
                  <button
                    onClick={() => {
                      setTempAdminInfo(adminInfo);
                      setIsEditingAdmin(true);
                    }}
                    className="text-sky-300 hover:text-white underline text-[11px]"
                  >
                    Chỉnh sửa
                  </button>
                </div>
                <p className="font-bold text-sm text-white">{adminInfo.teachers || 'Võ Thị Hồng Sim - Bá Thị Thanh Xuân'}</p>
                <div className="text-slate-300 text-[11px] pt-1 border-t border-white/10 flex justify-between">
                  <span>PHT Duyệt:</span>
                  <span className="font-semibold text-white">{adminInfo.approver || 'Lê Thị Ngọc Châu'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chuyển nhanh Khối Lớp */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Khối Lớp:</span>
            <div className="flex rounded-xl bg-black/25 p-1 border border-white/10">
              <button
                onClick={() => {
                  setSelectedClassGroup('3_4T');
                  setActiveTab('a4_dossier');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedClassGroup === '3_4T'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Lớp 3 - 4 Tuổi (Đảo Tí Hon)
              </button>
              <button
                onClick={() => {
                  setSelectedClassGroup('25_36T');
                  setActiveTab('toddlers_25_36');
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedClassGroup === '25_36T'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                Nhóm 25 - 36 Tháng (Phước Thể)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Trợ Lý AI Giáo Viên
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. THANH ĐIỀU HƯỚNG CÁC PHÂN HỆ CHÍNH */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-1.5 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('a4_dossier')}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'a4_dossier'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Bộ Giáo Án A4 (Quyển 1 - 10)
        </button>

        <button
          onClick={() => setActiveTab('year_objectives')}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'year_objectives'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Dự Kiến 35 Tuần & 69 Mục Tiêu GD
        </button>

        <button
          onClick={() => setActiveTab('toddlers_25_36')}
          className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'toddlers_25_36'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          KHGD Tháng (Nhóm 25 - 36 Tháng)
        </button>

        <button
          onClick={() => setActiveTab('quick_editor')}
          className={`flex-1 min-w-[180px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'quick_editor'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          Soạn Bài Mới (STEAM 5E)
        </button>
      </div>

      {/* 3. NỘI DUNG TỪNG TAB */}

      {/* TAB 1: Bộ Giáo Án Chuẩn A4 Từng Trang */}
      {activeTab === 'a4_dossier' && (
        <A4DocumentSuite
          adminInfo={adminInfo}
          currentDossier={THEME_1_DOSSIER}
          selectedThemeIndex={selectedThemeIndex}
          onSelectThemeIndex={setSelectedThemeIndex}
        />
      )}

      {/* TAB 2: Dự Kiến 35 Tuần & 69 Mục Tiêu GD */}
      {activeTab === 'year_objectives' && <YearPlanAndObjectivesView />}

      {/* TAB 3: Kế Hoạch Giáo Dục Nhóm 25-36 Tháng */}
      {activeTab === 'toddlers_25_36' && <MonthlyPlansToddlerView />}

      {/* TAB 4: Soạn Bài Mới Nhanh */}
      {activeTab === 'quick_editor' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-blue-950 uppercase tracking-tight">
                Biên Tập & Soạn Bài Dạy Mới (STEAM 5E)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tạo nhanh giáo án mới theo quy trình 5 bước STEAM 5E, lưu trữ cục bộ và xuất sang Google Docs / Word.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              {isCreatingNew ? 'Đóng Form' : 'Soạn Kế Hoạch Bài Mới'}
            </button>
          </div>

          {/* Form Soạn Bài Mới */}
          {isCreatingNew && (
            <form onSubmit={handleCreateNewPlan} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Đề tài bài dạy (*):</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Khám phá phương tiện giao thông"
                    value={newPlanForm.topic}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, topic: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lĩnh vực phát triển:</label>
                  <select
                    value={newPlanForm.domain}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, domain: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Khám phá khoa học">Khám phá khoa học (KPKH)</option>
                    <option value="Phát triển thể chất">Phát triển thể chất (HĐTD)</option>
                    <option value="Làm quen với toán">Làm quen với toán (LQTSĐ)</option>
                    <option value="Giáo dục âm nhạc">Giáo dục âm nhạc (GDÂN)</option>
                    <option value="Hoạt động tạo hình">Hoạt động tạo hình (HĐTH)</option>
                    <option value="Văn học thơ truyện">Văn học thơ truyện (HĐVH)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp:</label>
                  <select
                    value={newPlanForm.ageGroup}
                    onChange={(e) =>
                      setNewPlanForm({
                        ...newPlanForm,
                        ageGroup: e.target.value as 'Mẫu giáo Bé (3-4 tuổi)' | 'Nhà trẻ (18-36 tháng)',
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Mẫu giáo Bé (3-4 tuổi)">Lớp Mầm (3 - 4 Tuổi)</option>
                    <option value="Nhà trẻ (18-36 tháng)">Nhóm Trẻ (25 - 36 Tháng)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mục đích yêu cầu (Kiến thức, kỹ năng, thái độ):</label>
                <textarea
                  rows={2}
                  placeholder="Trẻ nhận biết đặc điểm đối tượng, rèn luyện kỹ năng quan sát, biết yêu quý giữ gìn..."
                  value={newPlanForm.objective}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, objective: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chuẩn bị (Đồ dùng cô và trẻ):</label>
                <input
                  type="text"
                  placeholder="Mô hình, tranh ảnh trình chiếu, học cụ trực quan, giấy màu bút vẽ..."
                  value={newPlanForm.preparation}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, preparation: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung hoạt động khám phá chính:</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả các bước trẻ quan sát, thảo luận nhóm, giải thích kết quả..."
                  value={newPlanForm.steps}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, steps: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Lưu Giáo Án
                </button>
              </div>
            </form>
          )}

          {/* Danh Sách Giáo Án Tuỳ Chỉnh Đã Lưu */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">
              Danh Sách Giáo Án Hiện Có ({customPlans.length})
            </h3>

            {customPlans.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Chưa có giáo án tự tạo nào. Hãy nhấn &quot;Soạn Kế Hoạch Bài Mới&quot; để bắt đầu soạn bài.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customPlans.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 shadow-2xs transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {plan.developmentField || plan.theme}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{plan.topic || plan.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Khối: {plan.ageGroup || 'Mẫu giáo Bé (3-4 tuổi)'}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-800">
                        {plan.approvalStatus || 'Đã phê duyệt'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 line-clamp-2 mt-2">
                      <strong>Mục tiêu:</strong> {plan.learningObjectives}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Quy trình STEAM 5E</span>
                      {onDeletePlan && (
                        <button
                          onClick={() => onDeletePlan(plan.id)}
                          className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Xóa
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
