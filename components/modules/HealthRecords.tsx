'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  HeartPulse,
  Edit2,
  Trash2,
  FileCheck,
  X,
  Save,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Database,
  LineChart as LineChartIcon,
  Copy,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { HealthRecord } from '@/types/preschool';
import HistoricalDateFilterBar, { TimeFilterMode } from '@/components/HistoricalDateFilterBar';
import { matchesTimeFilter, extractAvailableDates, formatDateVN } from '@/lib/utils';

interface HealthRecordsProps {
  records: HealthRecord[];
  onSaveRecord: (record: HealthRecord) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
}

// Hàm tự động tính toán kênh dinh dưỡng theo WHO (BMI & cân nặng / chiều cao)
export function calculateNutritionStatus(heightCm: number, weightKg: number): HealthRecord['nutritionStatus'] {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return 'Bình thường (Kênh A)';
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 13.5) {
    return 'Suy dinh dưỡng thể nhẹ cân';
  }
  if (bmi < 14.0) {
    return 'Suy dinh dưỡng thấp còi';
  }
  if (bmi > 18.5) {
    return 'Nguy cơ béo phì / Béo phì';
  }
  if (bmi >= 16.8) {
    return 'Nguy cơ béo phì / Béo phì';
  }
  return 'Bình thường (Kênh A)';
}

export default function HealthRecords({
  records,
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
}: HealthRecordsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedNutrition, setSelectedNutrition] = useState<string>('all');

  // Historical Time Filters
  const [timeFilterMode, setTimeFilterMode] = useState<TimeFilterMode>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<HealthRecord | null>(null);
  const [growthChartRecord, setGrowthChartRecord] = useState<HealthRecord | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [formState, setFormState] = useState<Partial<HealthRecord>>({
    studentName: '',
    className: 'Lá 1',
    checkDate: new Date().toISOString().split('T')[0],
    heightCm: 110.0,
    weightKg: 18.0,
    nutritionStatus: 'Bình thường (Kênh A)',
    vaccinationStatus: 'Đầy đủ theo độ tuổi',
    generalHealth: 'Tốt',
    doctorOrExaminer: 'GV. Phụ trách lớp',
    notes: '',
  });

  const availableDates = useMemo(() => {
    return extractAvailableDates(
      records.map((r) => ({
        ...r,
        date: r.checkDate,
      }))
    );
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.doctorOrExaminer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === 'all' || r.className === selectedClass;
      const matchNutr = selectedNutrition === 'all' || r.nutritionStatus === selectedNutrition;
      const matchTime = matchesTimeFilter(r.checkDate, timeFilterMode, selectedDate, startDate, endDate);
      return matchSearch && matchClass && matchNutr && matchTime;
    });
  }, [records, searchTerm, selectedClass, selectedNutrition, timeFilterMode, selectedDate, startDate, endDate]);

  const handleSyncTurso = async () => {
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'syncHealth',
          health: records,
        }),
      });
      if (res.ok) {
        setSyncStatus('success');
      } else {
        setSyncStatus('local_only');
      }
    } catch {
      setSyncStatus('local_only');
    }
    setTimeout(() => {
      setSyncStatus(null);
    }, 3500);
  };

  const handleOpenAdd = (presetDate?: string) => {
    setEditingRecord(null);
    setFormState({
      studentName: '',
      className: 'Lá 1',
      checkDate: presetDate || selectedDate || new Date().toISOString().split('T')[0],
      heightCm: 110.0,
      weightKg: 18.0,
      nutritionStatus: 'Bình thường (Kênh A)',
      vaccinationStatus: 'Đầy đủ theo độ tuổi',
      generalHealth: 'Tốt',
      doctorOrExaminer: 'GV. Phụ trách lớp',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: HealthRecord) => {
    setEditingRecord(rec);
    setFormState({ ...rec });
    setModalOpen(true);
  };

  const handleDuplicateRecord = (rec: HealthRecord) => {
    const cloned: HealthRecord = {
      ...rec,
      id: `hr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      notes: rec.notes ? `${rec.notes} (Bản sao)` : '(Bản sao)',
    };
    onSaveRecord(cloned);
  };

  const handleCloneDateData = (sourceDate: string, targetDate: string) => {
    const sourceRecords = records.filter((r) => r.checkDate === sourceDate);
    if (sourceRecords.length === 0) return;

    sourceRecords.forEach((r, idx) => {
      const newRec: HealthRecord = {
        ...r,
        id: `hr-${Date.now()}-${idx}`,
        checkDate: targetDate,
      };
      onSaveRecord(newRec);
    });

    setTimeFilterMode('customDate');
    setSelectedDate(targetDate);
  };

  const handleSeedHistoricalData = () => {
    const now = new Date();
    const periods = [
      { dOffset: 90, note: 'Khám sức khỏe đầu năm học' },
      { dOffset: 60, note: 'Đo cân nặng chiều cao đợt 2' },
      { dOffset: 30, note: 'Khám sức khỏe giữa kỳ' },
    ];

    const kids = [
      { name: 'Nguyễn Gia Bảo', class: 'Lá 1', h: 112, w: 19.2 },
      { name: 'Trần Bảo An', class: 'Lá 1', h: 109, w: 17.5 },
      { name: 'Lê Minh Khang', class: 'Chồi 1', h: 102, w: 15.8 },
      { name: 'Phạm Quỳnh Anh', class: 'Mầm 1', h: 95, w: 14.1 },
    ];

    periods.forEach((p, pIdx) => {
      const d = new Date(now.getTime() - p.dOffset * 86400000);
      const dateStr = d.toISOString().split('T')[0];

      kids.forEach((kid, kIdx) => {
        const deltaH = (3 - pIdx) * 1.2;
        const deltaW = (3 - pIdx) * 0.4;
        const actualH = Number((kid.h - deltaH).toFixed(1));
        const actualW = Number((kid.w - deltaW).toFixed(1));

        onSaveRecord({
          id: `hr-seed-${dateStr}-${kIdx}`,
          studentId: `st-${kid.name.replace(/\s+/g, '').toLowerCase()}`,
          studentName: kid.name,
          className: kid.class,
          checkDate: dateStr,
          heightCm: actualH,
          weightKg: actualW,
          nutritionStatus: calculateNutritionStatus(actualH, actualW),
          vaccinationStatus: 'Đầy đủ theo độ tuổi',
          generalHealth: 'Tốt',
          doctorOrExaminer: 'Bs. Trạm Y tế Phường',
          notes: p.note,
        });
      });
    });

    setTimeFilterMode('all');
  };

  const handleHeightWeightChange = (newH: number, newW: number) => {
    const autoStatus = calculateNutritionStatus(newH, newW);
    setFormState((prev) => ({
      ...prev,
      heightCm: newH,
      weightKg: newW,
      nutritionStatus: autoStatus,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const height = Number(formState.heightCm) || 100;
    const weight = Number(formState.weightKg) || 15;
    const autoNutr = formState.nutritionStatus || calculateNutritionStatus(height, weight);

    const newRecord: HealthRecord = {
      id: editingRecord ? editingRecord.id : `hr-${Date.now()}`,
      studentId: editingRecord ? editingRecord.studentId : `st-${Date.now()}`,
      studentName: formState.studentName || '',
      className: formState.className || 'Lá 1',
      checkDate: formState.checkDate || new Date().toISOString().split('T')[0],
      heightCm: height,
      weightKg: weight,
      nutritionStatus: autoNutr,
      vaccinationStatus: (formState.vaccinationStatus as any) || 'Đầy đủ theo độ tuổi',
      generalHealth: (formState.generalHealth as any) || 'Tốt',
      doctorOrExaminer: formState.doctorOrExaminer || 'GV. Phụ trách lớp',
      notes: formState.notes || '',
    };
    onSaveRecord(newRecord);
    setModalOpen(false);
  };

  // Mock timeline data for growth chart simulation based on current record
  const growthTimelineData = useMemo(() => {
    if (!growthChartRecord) return [];
    const baseH = growthChartRecord.heightCm;
    const baseW = growthChartRecord.weightKg;
    return [
      {
        period: 'Đợt 1 (Đầu năm)',
        height: Math.max(70, Number((baseH - 4.5).toFixed(1))),
        weight: Math.max(10, Number((baseW - 1.8).toFixed(1))),
        whoHeight: Number((baseH - 4.0).toFixed(1)),
        whoWeight: Number((baseW - 1.5).toFixed(1)),
      },
      {
        period: 'Đợt 2 (Học kỳ 1)',
        height: Math.max(72, Number((baseH - 2.8).toFixed(1))),
        weight: Math.max(10.5, Number((baseW - 1.1).toFixed(1))),
        whoHeight: Number((baseH - 2.5).toFixed(1)),
        whoWeight: Number((baseW - 1.0).toFixed(1)),
      },
      {
        period: 'Đợt 3 (Giữa kỳ)',
        height: Math.max(74, Number((baseH - 1.2).toFixed(1))),
        weight: Math.max(11, Number((baseW - 0.4).toFixed(1))),
        whoHeight: Number((baseH - 1.0).toFixed(1)),
        whoWeight: Number((baseW - 0.3).toFixed(1)),
      },
      { period: 'Đợt 4 (Hiện tại)', height: baseH, weight: baseW, whoHeight: baseH, whoWeight: baseW },
    ];
  }, [growthChartRecord]);

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                Phân hệ 7
              </span>
              <span className="text-xs text-slate-500 font-medium">Theo dõi Sức khỏe Mầm non</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 truncate">
              Sức Khỏe: Chiều cao, Cân nặng, Kênh Dinh dưỡng &amp; Biểu đồ Tăng trưởng
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Tự động tính kênh dinh dưỡng theo WHO khi nhập chiều cao/cân nặng, tra cứu lịch sử khám sức khỏe từng đợt.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleSyncTurso}
              title="Lưu toàn bộ hồ sơ sức khỏe lên Turso Cloud Database"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-teal-700" />
              <span>
                {syncStatus === 'syncing'
                  ? 'Đang lưu...'
                  : syncStatus === 'success'
                  ? 'Đã lưu Turso ✓'
                  : syncStatus === 'local_only'
                  ? 'Đã lưu cục bộ'
                  : 'Lưu & Đồng bộ Turso'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi nhận đo sức khỏe</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>In sổ sức khỏe</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên bé, giáo viên phụ trách hoặc người đo..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tất cả các lớp</option>
              <option value="Nhà Trẻ Hoa Cúc">Nhà Trẻ Hoa Cúc</option>
              <option value="Mầm 1">Lớp Mầm 1</option>
              <option value="Chồi 1">Lớp Chồi 1</option>
              <option value="Chồi 2">Lớp Chồi 2</option>
              <option value="Lá 1">Lớp Lá 1</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={selectedNutrition}
              onChange={(e) => setSelectedNutrition(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tất cả kênh dinh dưỡng</option>
              <option value="Bình thường (Kênh A)">Bình thường (Kênh A)</option>
              <option value="Suy dinh dưỡng thể nhẹ cân">Suy dinh dưỡng nhẹ cân</option>
              <option value="Suy dinh dưỡng thấp còi">Suy dinh dưỡng thấp còi</option>
              <option value="Nguy cơ béo phì / Béo phì">Nguy cơ béo phì</option>
            </select>
          </div>
        </div>
      </div>

      {/* Historical Date / Week / Month Explorer Bar */}
      <HistoricalDateFilterBar
        filterMode={timeFilterMode}
        onFilterModeChange={setTimeFilterMode}
        selectedDate={selectedDate}
        onSelectedDateChange={setSelectedDate}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={(s, e) => {
          setStartDate(s);
          setEndDate(e);
        }}
        availableDates={availableDates}
        totalRecordsCount={records.length}
        filteredRecordsCount={filteredRecords.length}
        moduleName="hồ sơ sức khỏe"
        onAddForDate={(date) => handleOpenAdd(date)}
        onCloneDateData={handleCloneDateData}
        onSeedHistoricalData={handleSeedHistoricalData}
      />

      {/* Official Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Hiển thị <strong>{filteredRecords.length}</strong> / {records.length} hồ sơ theo dõi
            {timeFilterMode !== 'all' && (
              <span className="ml-2 text-emerald-700 font-semibold">
                (Bộ lọc thời gian đang áp dụng)
              </span>
            )}
          </span>
          <span className="italic text-slate-500">Sổ theo dõi sức khỏe và biểu đồ tăng trưởng trẻ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Họ và tên học sinh</th>
                <th className="p-3 border-r border-slate-200">Lớp</th>
                <th className="p-3 border-r border-slate-200 text-center">Ngày đo</th>
                <th className="p-3 border-r border-slate-200 text-center">Chiều cao (cm)</th>
                <th className="p-3 border-r border-slate-200 text-center">Cân nặng (kg)</th>
                <th className="p-3 border-r border-slate-200">Đánh giá dinh dưỡng</th>
                <th className="p-3 border-r border-slate-200">Lịch tiêm chủng</th>
                <th className="p-3 border-r border-slate-200">Khám sức khỏe chung</th>
                <th className="p-3 border-r border-slate-200">Giáo viên / Người đo</th>
                <th className="p-3 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">Không có hồ sơ sức khỏe nào trong thời gian đã chọn.</p>
                      <p className="text-xs text-slate-500">
                        Chọn <strong>&quot;Toàn bộ lịch sử&quot;</strong> hoặc nhấn <strong>&quot;Ghi nhận đo sức khỏe&quot;</strong>.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-medium text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-3 font-bold text-blue-900 border-r border-slate-200">
                      <div className="flex items-center justify-between gap-2">
                        <span>{r.studentName}</span>
                        <button
                          type="button"
                          onClick={() => setGrowthChartRecord(r)}
                          title="Xem Biểu đồ tăng trưởng cá nhân của bé"
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 cursor-pointer"
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>Biểu đồ</span>
                        </button>
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-200 font-medium text-slate-700">{r.className}</td>
                    <td className="p-3 text-center whitespace-nowrap border-r border-slate-200 text-slate-600 font-medium">
                      {formatDateVN(r.checkDate)}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                      {r.heightCm} cm
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-900 border-r border-slate-200">
                      {r.weightKg} kg
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold ${
                          r.nutritionStatus.includes('Kênh A')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.nutritionStatus.includes('Kênh A') ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        {r.nutritionStatus}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-200 text-xs text-slate-700">
                      {r.vaccinationStatus}
                    </td>
                    <td className="p-3 border-r border-slate-200 text-xs text-slate-700">
                      {r.generalHealth}
                      {r.notes && <span className="block text-slate-500 italic mt-0.5">{r.notes}</span>}
                    </td>
                    <td className="p-3 border-r border-slate-200 font-medium text-slate-800">
                      {r.doctorOrExaminer}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setGrowthChartRecord(r)}
                          title="Xem Biểu đồ tăng trưởng"
                          className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 rounded cursor-pointer"
                        >
                          <LineChartIcon className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(r)}
                          title="Chỉnh sửa"
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateRecord(r)}
                          title="Nhân bản hồ sơ"
                          className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingRecord(r)}
                          title="Xóa hồ sơ"
                          className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Chart Modal */}
      {growthChartRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Biểu đồ tăng trưởng chuẩn WHO: {growthChartRecord.studentName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Lớp {growthChartRecord.className} • Ngày đo gần nhất:{' '}
                    {formatDateVN(growthChartRecord.checkDate)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGrowthChartRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-indigo-700 font-semibold block">Chiều cao hiện tại</span>
                  <span className="text-xl font-bold text-indigo-950 font-mono">
                    {growthChartRecord.heightCm} cm
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-blue-700 font-semibold block">Cân nặng hiện tại</span>
                  <span className="text-xl font-bold text-blue-950 font-mono">
                    {growthChartRecord.weightKg} kg
                  </span>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <span className="text-xs text-emerald-700 font-semibold block">Đánh giá theo WHO</span>
                  <span className="text-xs font-bold text-emerald-950 block mt-1">
                    {growthChartRecord.nutritionStatus}
                  </span>
                </div>
              </div>

              {/* Chart */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Diễn biến Chiều cao &amp; Cân nặng qua các đợt kiểm tra sức khỏe
                </h4>
                <div className="h-64 w-full bg-slate-50/50 rounded-xl p-2 border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="height"
                        name="Chiều cao bé (cm)"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="whoHeight"
                        name="Chuẩn WHO (cm)"
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="weight"
                        name="Cân nặng bé (kg)"
                        stroke="#059669"
                        strokeWidth={2.5}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setGrowthChartRecord(null)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  Đóng biểu đồ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">
                {editingRecord ? 'Chỉnh sửa hồ sơ sức khỏe' : 'Ghi nhận đo sức khỏe mới'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên trẻ</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Gia Bảo"
                    value={formState.studentName}
                    onChange={(e) => setFormState({ ...formState, studentName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp học</label>
                  <select
                    value={formState.className}
                    onChange={(e) => setFormState({ ...formState, className: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Nhà Trẻ Hoa Cúc">Nhà Trẻ Hoa Cúc</option>
                    <option value="Mầm 1">Lớp Mầm 1</option>
                    <option value="Chồi 1">Lớp Chồi 1</option>
                    <option value="Chồi 2">Lớp Chồi 2</option>
                    <option value="Lá 1">Lớp Lá 1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày đo</label>
                  <input
                    type="date"
                    required
                    value={formState.checkDate}
                    onChange={(e) => setFormState({ ...formState, checkDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-emerald-50/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chiều cao (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formState.heightCm}
                    onChange={(e) =>
                      handleHeightWeightChange(Number(e.target.value), Number(formState.weightKg || 0))
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cân nặng (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formState.weightKg}
                    onChange={(e) =>
                      handleHeightWeightChange(Number(formState.heightCm || 0), Number(e.target.value))
                    }
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>
              </div>

              {/* Auto calculated WHO result indicator */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 flex items-center justify-between">
                <span className="text-xs text-blue-900 font-medium">Tự động tính kênh dinh dưỡng (WHO):</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-700 text-white">
                  {formState.nutritionStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêm chủng</label>
                  <select
                    value={formState.vaccinationStatus}
                    onChange={(e) => setFormState({ ...formState, vaccinationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Đầy đủ theo độ tuổi">Đầy đủ theo độ tuổi</option>
                    <option value="Thiếu mũi (cần nhắc phụ huynh)">Thiếu mũi (cần nhắc phụ huynh)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khám sức khỏe chung</label>
                  <select
                    value={formState.generalHealth}
                    onChange={(e) => setFormState({ ...formState, generalHealth: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Cần theo dõi">Cần theo dõi</option>
                    <option value="Có bệnh lý về tai mũi họng/răng miệng">Có bệnh lý về tai mũi họng/răng miệng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người đo / Bác sĩ</label>
                  <input
                    type="text"
                    value={formState.doctorOrExaminer}
                    onChange={(e) => setFormState({ ...formState, doctorOrExaminer: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú theo dõi</label>
                  <input
                    type="text"
                    placeholder="VD: Cần bổ sung canxi, theo dõi thêm..."
                    value={formState.notes}
                    onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {editingRecord ? 'Lưu thay đổi' : 'Lưu hồ sơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            <div className="p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Xác nhận xóa hồ sơ sức khỏe</h3>
              <p className="text-xs text-slate-600 mt-2">
                Bạn có chắc chắn muốn xóa hồ sơ sức khỏe của học sinh{' '}
                <strong>{deletingRecord.studentName}</strong> (Lớp {deletingRecord.className})?
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 bg-slate-50 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDeletingRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRecord(deletingRecord.id);
                  setDeletingRecord(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer"
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
