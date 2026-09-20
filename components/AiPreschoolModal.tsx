'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  BookOpen,
  Utensils,
  ClipboardList,
  HeartHandshake,
  MessageSquare,
  Check,
  Copy,
  Plus,
  Send,
  Loader2,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileText,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { LessonPlanRecord, MenuItem, Step1Record } from '@/types/preschool';

interface AiPreschoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLessonPlan?: (plan: LessonPlanRecord) => void;
  onApplyWeeklyMenu?: (menuDays: any[]) => void;
  onAddStep1Records?: (records: Step1Record[]) => void;
  schoolName?: string;
  defaultTeacher?: string;
  defaultApprover?: string;
}

export default function AiPreschoolModal({
  isOpen,
  onClose,
  onAddLessonPlan,
  onApplyWeeklyMenu,
  onAddStep1Records,
  schoolName = 'Mầm Non Tư Thục Đảo Tí Hon',
  defaultTeacher = 'Thanh Xuân',
  defaultApprover = 'Võ Thị Hồng Sim (Chủ cơ sở)',
}: AiPreschoolModalProps) {
  const [activeTab, setActiveTab] = useState<'lesson' | 'menu' | 'step1' | 'evaluation' | 'chat'>('lesson');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // 1. STATE: SOẠN GIÁO ÁN
  const [lessonTheme, setLessonTheme] = useState('Thế giới Động vật biển quê hương Liên Hương: Chú cá heo thông minh');
  const [lessonClass, setLessonClass] = useState('Khối Chồi (4-5 tuổi)');
  const [lessonField, setLessonField] = useState('Phát triển Nhận thức');
  const [lessonNotes, setLessonNotes] = useState('Tạo hoạt động trải nghiệm sờ mẫu vật thật, trò chơi vận động sôi nổi');
  const [lessonLoading, setLessonLoading] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any | null>(null);
  const [lessonProvider, setLessonProvider] = useState<string>('');

  // 2. STATE: THỰC ĐƠN DINH DƯỠNG
  const [menuAgeGroup, setMenuAgeGroup] = useState('Mẫu giáo (3-6 tuổi)');
  const [menuSeason, setMenuSeason] = useState('Mùa hè mát mẻ');
  const [menuBudget, setMenuBudget] = useState('35.000');
  const [menuLoading, setMenuLoading] = useState(false);
  const [generatedMenu, setGeneratedMenu] = useState<any | null>(null);
  const [menuProvider, setMenuProvider] = useState<string>('');

  // 3. STATE: NHẬP NHANH KIỂM THỰC BƯỚC 1
  const [step1RawText, setStep1RawText] = useState(
    'Sáng nay 06:30 nhận 18kg thịt heo nạc mông tươi vựa Ba Vì giá 110.000đ, 15kg rau mồng tơi HTX Tuy Phong 18.000đ, 8kg cá bớp phi lê tươi vựa Liên Hương 160.000đ, 1 bình gas công nghiệp 45kg Petrolimex. Tất cả tươi ngon đạt chuẩn cảm quan.'
  );
  const [step1Loading, setStep1Loading] = useState(false);
  const [generatedStep1, setGeneratedStep1] = useState<any | null>(null);
  const [step1Provider, setStep1Provider] = useState<string>('');

  // 4. STATE: NHẬN XÉT HỌC SINH
  const [evalName, setEvalName] = useState('Nguyễn Gia Bảo');
  const [evalClass, setEvalClass] = useState('Khối Lá (5-6 tuổi)');
  const [evalAttendance, setEvalAttendance] = useState('22/22 ngày (chăm ngoan, đúng giờ)');
  const [evalHabits, setEvalHabits] = useState('Tự xúc ăn hết suất, ngủ sâu giấc, biết cất dọn gối nệm');
  const [evalSkills, setEvalSkills] = useState('Rất tích cực phát biểu, thích vẽ tranh tô màu, biết nhường nhịn bạn');
  const [evalLoading, setEvalLoading] = useState(false);
  const [generatedEval, setGeneratedEval] = useState<any | null>(null);
  const [evalProvider, setEvalProvider] = useState<string>('');

  // 5. STATE: CHAT COPILOT
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; provider?: string }>>([
    {
      role: 'assistant',
      text: `Xin chào Cô giáo và Ban Giám hiệu trường ${schoolName}! Tôi là Trợ lý AI Mầm Non (hỗ trợ nền tảng Groq LPU & Gemini). Tôi có thể hỗ trợ cô soạn giáo án, cân đối dinh dưỡng thực đơn, giải đáp quy định kiểm thực QĐ 1246/QĐ-BYT hoặc xử lý tình huống tâm lý trẻ. Cô cần tôi hỗ trợ việc gì ạ?`,
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  if (!isOpen) return null;

  // HANDLER: SOẠN GIÁO ÁN
  const handleGenerateLesson = async () => {
    try {
      setLessonLoading(true);
      setSavedSuccess(null);
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_lesson_plan',
          payload: {
            theme: lessonTheme,
            targetClass: lessonClass,
            developmentField: lessonField,
            extraNotes: lessonNotes,
            teacherName: defaultTeacher,
            approverName: defaultApprover,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedLesson(data.data);
        setLessonProvider(data.provider || 'Groq / Gemini AI');
      }
    } catch (e: any) {
      alert('Không thể tạo giáo án: ' + e.message);
    } finally {
      setLessonLoading(false);
    }
  };

  const handleSaveLessonPlanToStore = () => {
    if (!generatedLesson || !onAddLessonPlan) return;
    const newPlan: LessonPlanRecord = {
      id: 'lp-ai-' + Date.now(),
      title: generatedLesson.title || lessonTheme,
      theme: generatedLesson.theme || lessonTheme,
      targetClass: generatedLesson.targetClass || lessonClass,
      teacherName: defaultTeacher,
      weekNumber: Math.min(35, Math.max(1, Math.ceil(new Date().getDate() / 7) + 30)),
      dateRange: 'Tuần này',
      developmentField: generatedLesson.developmentField || lessonField,
      approvalStatus: 'Đã phê duyệt',
      approverName: defaultApprover,
      approvalDate: new Date().toISOString().split('T')[0],
      fileAttachmentName: `GiaoAn_AI_${(generatedLesson.title || 'Moi').replace(/\s+/g, '_').slice(0, 20)}.pdf`,
      notes: `Soạn tự động bằng AI (${lessonProvider}). Mục tiêu: ${(generatedLesson.objectives?.knowledge || []).join('; ')}`,
    };
    onAddLessonPlan(newPlan);
    setSavedSuccess('Đã lưu giáo án vào Sổ Kế Hoạch Giáo Án của trường thành công!');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  // HANDLER: THỰC ĐƠN
  const handleGenerateMenu = async () => {
    try {
      setMenuLoading(true);
      setSavedSuccess(null);
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_menu_plan',
          payload: {
            ageGroup: menuAgeGroup,
            season: menuSeason,
            budgetPerDay: menuBudget,
            location: 'Xã Liên Hương, Tuy Phong, Bình Thuận',
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedMenu(data.data);
        setMenuProvider(data.provider || 'Groq / Gemini AI');
      }
    } catch (e: any) {
      alert('Không thể tạo thực đơn: ' + e.message);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleApplyMenuToStore = () => {
    if (!generatedMenu?.days || !onApplyWeeklyMenu) return;
    onApplyWeeklyMenu(generatedMenu.days);
    setSavedSuccess('Đã áp dụng thực đơn 5 ngày vào Bảng Thực Đơn Tuần của trường!');
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  // HANDLER: KIỂM THỰC BƯỚC 1
  const handleParseStep1 = async () => {
    try {
      setStep1Loading(true);
      setSavedSuccess(null);
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'parse_step1_inspection',
          payload: {
            rawText: step1RawText,
            inspectionDate: new Date().toISOString().split('T')[0],
            shift: 'Sáng 06:30',
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedStep1(data.data);
        setStep1Provider(data.provider || 'AI Engine');
      }
    } catch (e: any) {
      alert('Không thể phân tích: ' + e.message);
    } finally {
      setStep1Loading(false);
    }
  };

  const handleImportStep1Records = () => {
    if (!generatedStep1?.records || !onAddStep1Records) return;
    const newRecords: Step1Record[] = generatedStep1.records.map((r: any, idx: number) => ({
      id: `step1-ai-${Date.now()}-${idx}`,
      date: new Date().toISOString().split('T')[0],
      foodName: r.foodName || 'Thực phẩm',
      foodType: r.foodType || 'Tươi sống',
      quantityKg: Number(r.quantityKg) || 10,
      unitPrice: Number(r.unitPrice) || 50000,
      totalAmount: Number(r.totalAmount) || (Number(r.quantityKg) || 10) * (Number(r.unitPrice) || 50000),
      supplier: r.supplier || 'Nhà cung cấp Liên Hương',
      sensoryEvaluation: r.sensoryEvaluation || 'Đạt',
      sensoryNotes: r.sensoryNotes || 'Tươi ngon, đạt chuẩn cảm quan',
      originOrCert: r.origin || 'Chứng nhận ATTP',
      expiryDate: r.expiryDate || new Date().toISOString().split('T')[0],
      mealShift: 'Bữa sáng & Bữa trưa',
      inspectorName: 'Huỳnh Thị Hoa (Cấp dưỡng)',
      notes: r.notes || 'Nhập nhanh bằng Trợ lý AI',
    }));
    onAddStep1Records(newRecords);
    setSavedSuccess(`Đã thêm ${newRecords.length} dòng thực phẩm vào Sổ Kiểm Thực Bước 1!`);
    setTimeout(() => setSavedSuccess(null), 3000);
  };

  // HANDLER: NHẬN XÉT HỌC SINH
  const handleGenerateEvaluation = async () => {
    try {
      setEvalLoading(true);
      setSavedSuccess(null);
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_student_evaluation',
          payload: {
            studentName: evalName,
            className: evalClass,
            attendanceDays: evalAttendance,
            eatingSleepingHabits: evalHabits,
            learningSkills: evalSkills,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setGeneratedEval(data.data);
        setEvalProvider(data.provider || 'AI Engine');
      }
    } catch (e: any) {
      alert('Không thể tạo nhận xét: ' + e.message);
    } finally {
      setEvalLoading(false);
    }
  };

  // HANDLER: CHAT
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat_preschool_copilot',
          payload: { message: userMsg },
        }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: data.answer, provider: data.provider },
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Có lỗi kết nối: ' + err.message },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Trợ Lý AI Mầm Non Thông Minh
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-300 shadow-2xs">
                  Groq LPU / Gemini Ultra-Fast
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium">
                {schoolName} • Soạn giáo án, cân đối dinh dưỡng &amp; số hóa kiểm thực 3 bước tức thời
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Notification Banner */}
        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-1">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedSuccess}</span>
          </div>
        )}

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'lesson', label: 'Soạn Giáo Án AI', icon: BookOpen, tag: '0.3s' },
            { id: 'menu', label: 'Thực Đơn Dinh Dưỡng', icon: Utensils, tag: 'Chuẩn Calo' },
            { id: 'step1', label: 'Nhập Nhanh Kiểm Thực', icon: ClipboardList, tag: 'QĐ 1246' },
            { id: 'evaluation', label: 'Nhận Xét & Thư Bố Mẹ', icon: HeartHandshake, tag: 'Ấm Áp' },
            { id: 'chat', label: 'Trợ Lý Tư Vấn 24/7', icon: MessageSquare, tag: 'Q&A' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSavedSuccess(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-emerald-800 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tab.tag}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-4">
          {/* TAB 1: SOẠN GIÁO ÁN MẦM NON TỰ ĐỘNG */}
          {activeTab === 'lesson' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Form: Parameters */}
              <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm pb-1 border-b border-slate-100">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Thông số hoạt động học</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Đề tài / Ý tưởng bài giảng:
                  </label>
                  <textarea
                    rows={2}
                    value={lessonTheme}
                    onChange={(e) => setLessonTheme(e.target.value)}
                    placeholder="VD: Khám phá chú rùa biển, Vận động bật qua vạch, Chữ cái s-x..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Khối lớp / Lứa tuổi:
                    </label>
                    <select
                      value={lessonClass}
                      onChange={(e) => setLessonClass(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Nhà trẻ (24-36 tháng)">Nhà trẻ (24-36 tháng)</option>
                      <option value="Khối Mầm (3-4 tuổi)">Khối Mầm (3-4 tuổi)</option>
                      <option value="Khối Chồi (4-5 tuổi)">Khối Chồi (4-5 tuổi)</option>
                      <option value="Khối Lá (5-6 tuổi)">Khối Lá (5-6 tuổi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lĩnh vực phát triển:
                    </label>
                    <select
                      value={lessonField}
                      onChange={(e) => setLessonField(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="Phát triển Nhận thức">Phát triển Nhận thức</option>
                      <option value="Phát triển Thể chất">Phát triển Thể chất</option>
                      <option value="Phát triển Ngôn ngữ">Phát triển Ngôn ngữ</option>
                      <option value="Phát triển Thẩm mỹ (Âm nhạc/Tạo hình)">Phát triển Thẩm mỹ</option>
                      <option value="Phát triển Tình cảm - Kỹ năng XH">Tình cảm &amp; Kỹ năng XH</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ghi chú / Yêu cầu sư phạm bổ sung:
                  </label>
                  <input
                    type="text"
                    value={lessonNotes}
                    onChange={(e) => setLessonNotes(e.target.value)}
                    placeholder="VD: Gắn với sinh vật biển Tuy Phong, tăng tương tác..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>

                {/* Quick Preset Ideas */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Gợi ý chủ đề nhanh:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Chú rùa biển quê em',
                      'Làm quen chữ cái b - d',
                      'Bật qua vạch kẻ êm ái',
                      'Kỹ năng nói lời cảm ơn',
                      'Bé nhận biết màu đỏ - vàng',
                    ].map((idea) => (
                      <button
                        key={idea}
                        type="button"
                        onClick={() => setLessonTheme(idea)}
                        className="text-[10px] font-medium px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                      >
                        + {idea}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={lessonLoading}
                  onClick={handleGenerateLesson}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  {lessonLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>AI đang soạn giáo án siêu tốc...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Soạn Giáo Án Hoàn Chỉnh Bằng AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Output: Lesson Plan Preview */}
              <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                {generatedLesson ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {generatedLesson.developmentField || lessonField}
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                          {generatedLesson.title}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {generatedLesson.targetClass} • Thời lượng: ~{generatedLesson.estimatedDurationMinutes || 30} phút • Giáo viên: {defaultTeacher}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(JSON.stringify(generatedLesson, null, 2))}
                          title="Sao chép nội dung giáo án"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="hidden sm:inline">{copied ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Objectives */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                      <strong className="text-emerald-900 font-bold block">I. MỤC TIÊU BÀI HỌC:</strong>
                      <div className="space-y-1 pl-2 text-slate-700">
                        <p><strong>1. Kiến thức:</strong> {(generatedLesson.objectives?.knowledge || []).join(' ')}</p>
                        <p><strong>2. Kỹ năng:</strong> {(generatedLesson.objectives?.skills || []).join(' ')}</p>
                        <p><strong>3. Thái độ:</strong> {(generatedLesson.objectives?.attitudes || []).join(' ')}</p>
                      </div>
                    </div>

                    {/* Preparations */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                      <strong className="text-emerald-900 font-bold block">II. CHUẨN BỊ ĐỒ DÙNG:</strong>
                      <div className="space-y-1 pl-2 text-slate-700">
                        <p><strong>- Đồ dùng của cô:</strong> {(generatedLesson.preparations?.teacher || []).join(', ')}</p>
                        <p><strong>- Đồ dùng của trẻ:</strong> {(generatedLesson.preparations?.students || []).join(', ')}</p>
                      </div>
                    </div>

                    {/* Procedure Steps */}
                    <div className="space-y-2 text-xs">
                      <strong className="text-emerald-900 font-bold block">III. TIẾN TRÌNH HOẠT ĐỘNG:</strong>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {(generatedLesson.procedure || []).map((step: any, sIdx: number) => (
                          <div key={sIdx} className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1">
                            <div className="flex items-center justify-between text-slate-900 font-bold">
                              <span>{step.step}</span>
                              <span className="text-[10px] text-slate-500 font-normal">{step.duration}</span>
                            </div>
                            <p className="text-slate-700 text-[11px] leading-relaxed">
                              <strong className="text-emerald-800">Hoạt động cô:</strong> {step.teacherActivities}
                            </p>
                            <p className="text-slate-600 text-[11px] leading-relaxed">
                              <strong className="text-teal-800">Hoạt động trẻ:</strong> {step.studentActivities}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Động cơ AI: <strong>{lessonProvider || 'Groq LPU'}</strong>
                      </span>
                      {onAddLessonPlan && (
                        <button
                          type="button"
                          onClick={handleSaveLessonPlanToStore}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-bold shadow-xs hover:from-emerald-700 hover:to-teal-800 flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Lưu Vào Sổ Kế Hoạch Giáo Án
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-700">Chưa có nội dung giáo án</h5>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">
                        Nhập đề tài hoặc chọn các gợi ý bên trái, sau đó nhấn nút <strong>&quot;Soạn Giáo Án Hoàn Chỉnh Bằng AI&quot;</strong> để tạo bài giảng chuẩn Bộ GD&amp;ĐT trong 0.3 giây.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: THỰC ĐƠN DINH DƯỠNG & CALO */}
          {activeTab === 'menu' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm pb-1 border-b border-slate-100">
                  <Utensils className="w-4 h-4 text-emerald-700" />
                  <span>Thiết lập khẩu phần tuần</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Độ tuổi học sinh:
                  </label>
                  <select
                    value={menuAgeGroup}
                    onChange={(e) => setMenuAgeGroup(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Mẫu giáo (3-6 tuổi)">Mẫu giáo (3-6 tuổi) • 750-850 kcal</option>
                    <option value="Nhà trẻ (12-36 tháng)">Nhà trẻ (12-36 tháng) • 600-700 kcal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mùa vụ &amp; Thời tiết:
                  </label>
                  <select
                    value={menuSeason}
                    onChange={(e) => setMenuSeason(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Mùa hè mát mẻ, thanh nhiệt">Mùa hè mát mẻ, thanh nhiệt</option>
                    <option value="Mùa mưa mát, giàu năng lượng">Mùa mưa mát, ấm bụng</option>
                    <option value="Mùa xuân tươi mới, đa dạng">Mùa xuân tươi mới, đa dạng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Định mức tiền ăn/ngày:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={menuBudget}
                      onChange={(e) => setMenuBudget(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-white pr-12 font-bold text-emerald-800"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold">
                      VNĐ
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <strong>💡 Đặc trưng địa phương Liên Hương:</strong>
                  <p>AI tự động tích hợp hải sản tươi sạch (tôm, cá thu, ngao) và rau củ quả theo mùa của vùng Tuy Phong - Bình Thuận.</p>
                </div>

                <button
                  type="button"
                  disabled={menuLoading}
                  onClick={handleGenerateMenu}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  {menuLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>AI đang tính toán Calo &amp; Thực đơn...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Gợi Ý Thực Đơn Tuần Chuẩn Viện Dinh Dưỡng</span>
                    </>
                  )}
                </button>
              </div>

              {/* Menu Result */}
              <div className="lg:col-span-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                {generatedMenu ? (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {generatedMenu.weekTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap mt-0.5">
                          <span className="font-bold text-emerald-700">⚡ Calo: {generatedMenu.estimatedDailyCalo}</span>
                          <span>•</span>
                          <span>Tỷ lệ P-L-G: <strong>{generatedMenu.nutritionRatio}</strong></span>
                        </div>
                      </div>
                      {onApplyWeeklyMenu && (
                        <button
                          type="button"
                          onClick={handleApplyMenuToStore}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Cập Nhật Vào Bảng Thực Đơn Tuần
                        </button>
                      )}
                    </div>

                    {/* 5-Day Menu List */}
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {(generatedMenu.days || []).map((day: any, dIdx: number) => (
                        <div key={dIdx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold text-slate-900 pb-1 border-b border-slate-200/60">
                            <span className="text-emerald-800 font-extrabold">{day.dayOfWeek}</span>
                            <span className="text-[11px] text-slate-500 font-normal">{day.dailyCostEstimate} • {day.notes}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500 block text-[10px] font-semibold">Bữa sáng:</span>
                              <strong className="text-slate-800">{day.breakfast}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] font-semibold">Bữa trưa chính (Mặn + Canh + Rau):</span>
                              <strong className="text-slate-800">{day.lunchMain} • {day.lunchSoup} ({day.lunchSide})</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] font-semibold">Bữa phụ chiều:</span>
                              <strong className="text-slate-800">{day.snackAfternoon}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] font-semibold">Bữa xế chiều:</span>
                              <strong className="text-slate-800">{day.snackLate}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{generatedMenu.nutritionalAdvice}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Utensils className="w-7 h-7" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-700">Chưa có thực đơn mẫu</h5>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">
                        Chọn độ tuổi và kinh phí rồi nhấn <strong>&quot;Gợi Ý Thực Đơn Tuần Chuẩn Viện Dinh Dưỡng&quot;</strong> để AI cân đối khẩu phần 5 ngày.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NHẬP NHANH KIỂM THỰC BƯỚC 1 TỰ NHIÊN */}
          {activeTab === 'step1' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm pb-1 border-b border-slate-100">
                  <ClipboardList className="w-4 h-4 text-emerald-700" />
                  <span>Nhập văn bản ghi chép của nhà bếp</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nội dung nhận hàng buổi sáng (gõ hoặc nói):
                  </label>
                  <textarea
                    rows={6}
                    value={step1RawText}
                    onChange={(e) => setStep1RawText(e.target.value)}
                    placeholder="VD: Sáng nay nhận 15kg thịt heo nạc Ba Vì giá 110k, 10kg rau mồng tơi 18k..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 leading-relaxed font-sans"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setStep1RawText(
                        'Sáng 06:30 nhận 20kg thịt bò tươi vựa Ba Vì 240.000đ, 12kg bí đỏ HTX Tuy Phong 15.000đ, 6 hộp sữa chua Vinamilk thùng 48 hộp 320.000đ. Cảm quan đạt chuẩn, màng thịt khô ráo đàn hồi.'
                      )
                    }
                    className="text-[10px] font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                  >
                    + Mẫu Thịt Bò &amp; Sữa
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setStep1RawText(
                        'Sáng 06:15 nhận 15kg tôm biển tươi sống vựa Liên Hương 180.000đ, 10kg rau ngót sạch 20.000đ, 5 nải chuối tiêu chín tự nhiên 35.000đ. Đầy đủ giấy kiểm dịch ATTP.'
                      )
                    }
                    className="text-[10px] font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
                  >
                    + Mẫu Hải Sản &amp; Rau Ngót
                  </button>
                </div>

                <button
                  type="button"
                  disabled={step1Loading}
                  onClick={handleParseStep1}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  {step1Loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>AI đang bóc tách thực phẩm...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Trích Xuất Bảng Kiểm Thực Bước 1</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step 1 Result */}
              <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                {generatedStep1?.records ? (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Kết quả bóc tách ({generatedStep1.records.length} mặt hàng)
                        </h4>
                        <span className="text-xs text-emerald-700 font-bold">
                          {generatedStep1.summary?.qualityVerdict || 'Đạt chuẩn 100% QĐ 1246/QĐ-BYT'}
                        </span>
                      </div>
                      {onAddStep1Records && (
                        <button
                          type="button"
                          onClick={handleImportStep1Records}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Nạp Vào Sổ Bước 1 (Giao Nhận)
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {generatedStep1.records.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 text-sm font-extrabold">{item.foodName}</span>
                            <span className="text-emerald-700 font-extrabold">
                              {Number(item.totalAmount).toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] text-slate-600 pt-1">
                            <div>Khối lượng: <strong>{item.quantityKg} kg</strong></div>
                            <div>Đơn giá: <strong>{Number(item.unitPrice).toLocaleString('vi-VN')} đ/kg</strong></div>
                            <div>Cảm quan: <strong className="text-emerald-700">{item.sensoryEvaluation}</strong></div>
                            <div className="col-span-2">NCC: <strong>{item.supplier}</strong></div>
                            <div>HSD: <strong>{item.expiryDate}</strong></div>
                          </div>
                          <p className="text-[10px] text-slate-500 italic">&ldquo;{item.sensoryNotes}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <ClipboardList className="w-7 h-7" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-700">Chưa có dữ liệu trích xuất</h5>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">
                        Nhập văn bản ghi chép giao nhận ca sáng bên trái rồi nhấn <strong>&quot;Trích Xuất Bảng Kiểm Thực Bước 1&quot;</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: NHẬN XÉT HỌC SINH & THƯ GỬI PHỤ HUYNH */}
          {activeTab === 'evaluation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm pb-1 border-b border-slate-100">
                  <HeartHandshake className="w-4 h-4 text-emerald-700" />
                  <span>Thông tin rèn luyện của bé</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên bé:</label>
                    <input
                      type="text"
                      value={evalName}
                      onChange={(e) => setEvalName(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp:</label>
                    <input
                      type="text"
                      value={evalClass}
                      onChange={(e) => setEvalClass(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ăn uống &amp; Giấc ngủ:</label>
                  <input
                    type="text"
                    value={evalHabits}
                    onChange={(e) => setEvalHabits(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kỹ năng &amp; Thái độ:</label>
                  <input
                    type="text"
                    value={evalSkills}
                    onChange={(e) => setEvalSkills(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-slate-50"
                  />
                </div>

                <button
                  type="button"
                  disabled={evalLoading}
                  onClick={handleGenerateEvaluation}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer disabled:opacity-50"
                >
                  {evalLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                      <span>AI đang viết thư và nhận xét...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Tạo Nhận Xét &amp; Thư Phụ Huynh</span>
                    </>
                  )}
                </button>
              </div>

              {/* Evaluation Output */}
              <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                {generatedEval ? (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          Nhận xét tháng bé: {generatedEval.studentName} ({generatedEval.className})
                        </h4>
                        <span className="text-xs text-slate-500">Người viết: {defaultTeacher}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedEval.parentMessage || generatedEval.monthlySummary)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Đã chép thư' : 'Chép gửi Zalo'}</span>
                      </button>
                    </div>

                    <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-2 leading-relaxed">
                      <strong className="text-emerald-900 block font-bold">1. Đánh giá tổng quan sự tiến bộ:</strong>
                      <p>{generatedEval.monthlySummary}</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-2">
                      <strong className="text-teal-900 block font-bold">2. Thư nhắn gửi ba mẹ (gửi Zalo / App):</strong>
                      <p className="whitespace-pre-line text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200">
                        {generatedEval.parentMessage}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <HeartHandshake className="w-7 h-7" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-700">Chưa có bản nhận xét</h5>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">
                        Nhập thông tin bé bên trái rồi nhấn <strong>&quot;Tạo Nhận Xét &amp; Thư Phụ Huynh&quot;</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CHAT TRỢ LÝ TƯ VẤN 24/7 */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[460px]">
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>
                      {msg.provider && (
                        <span className="block text-[9px] text-slate-400 mt-1 font-semibold">
                          ⚡ Phản hồi qua: {msg.provider}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-2.5 items-center text-xs text-slate-500 italic pl-10">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Trợ lý AI đang tra cứu quy định và soạn câu trả lời...</span>
                  </div>
                )}
              </div>

              {/* Quick Prompts */}
              <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">Hỏi nhanh:</span>
                {[
                  'Quy trình lưu mẫu 24h chuẩn QĐ 1246?',
                  'Cách tính định lượng calo cho bé mẫu giáo?',
                  'Xử lý tình huống trẻ biếng ăn khi đến lớp?',
                  'Mẫu biên bản hủy mẫu thực phẩm?',
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setChatInput(q);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 whitespace-nowrap cursor-pointer transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Đặt câu hỏi về kiểm thực 3 bước, giáo án, dinh dưỡng hoặc quản lý mầm non..."
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
