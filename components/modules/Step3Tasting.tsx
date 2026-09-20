'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Filter,
  CheckCircle,
  Edit2,
  Trash2,
  UtensilsCrossed,
  FileCheck,
  X,
  Save,
  Thermometer,
  Copy,
} from 'lucide-react';
import { Step3Record } from '@/types/preschool';
import HistoricalDateFilterBar, { TimeFilterMode } from '@/components/HistoricalDateFilterBar';
import { matchesTimeFilter, extractAvailableDates, formatDateVN } from '@/lib/utils';

interface Step3TastingProps {
  records: Step3Record[];
  onSaveRecord: (record: Step3Record) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
}

export default function Step3Tasting({
  records,
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
}: Step3TastingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<string>('all');
  
  // Historical Time Filters
  const [timeFilterMode, setTimeFilterMode] = useState<TimeFilterMode>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Step3Record | null>(null);

  const [formState, setFormState] = useState<Partial<Step3Record>>({
    date: new Date().toISOString().split('T')[0],
    time: '10:30',
    meal: 'Bữa trưa',
    dishName: '',
    sensoryEvaluation: 'Màu sắc tươi, mùi vị thơm ngon tự nhiên, chín kỹ',
    servingTemp: '70°C',
    sampleWeight: '150g',
    storageLocation: 'Tủ lưu mẫu số 01 - Ngăn 1 (3°C)',
    taster: 'Hiệu trưởng Nguyễn Thị Mai Hoa',
    keeper: 'Cán bộ Y tế Trần Thị Thu Hà',
    result: 'Đủ điều kiện cho trẻ ăn',
    notes: '',
  });

  const availableDates = useMemo(() => {
    return extractAvailableDates(records);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.taster.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.keeper.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMeal = selectedMeal === 'all' || r.meal === selectedMeal;
      const matchTime = matchesTimeFilter(r.date, timeFilterMode, selectedDate, startDate, endDate);
      return matchSearch && matchMeal && matchTime;
    });
  }, [records, searchTerm, selectedMeal, timeFilterMode, selectedDate, startDate, endDate]);

  const handleOpenAdd = (presetDate?: string) => {
    setEditingRecord(null);
    setFormState({
      date: presetDate || selectedDate || new Date().toISOString().split('T')[0],
      time: '10:30',
      meal: 'Bữa trưa',
      dishName: '',
      sensoryEvaluation: 'Màu sắc tươi, mùi vị thơm ngon tự nhiên, chín kỹ',
      servingTemp: '70°C',
      sampleWeight: '150g',
      storageLocation: 'Tủ lưu mẫu số 01 - Ngăn 1 (3°C)',
      taster: 'Hiệu trưởng Nguyễn Thị Mai Hoa',
      keeper: 'Cán bộ Y tế Trần Thị Thu Hà',
      result: 'Đủ điều kiện cho trẻ ăn',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: Step3Record) => {
    setEditingRecord(rec);
    setFormState({ ...rec });
    setModalOpen(true);
  };

  const handleDuplicateRecord = (rec: Step3Record) => {
    const cloned: Step3Record = {
      ...rec,
      id: `s3-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      notes: rec.notes ? `${rec.notes} (Bản sao)` : '(Bản sao)',
    };
    onSaveRecord(cloned);
  };

  const handleCloneDateData = (sourceDate: string, targetDate: string) => {
    const sourceRecords = records.filter((r) => r.date === sourceDate);
    if (sourceRecords.length === 0) return;

    sourceRecords.forEach((r, idx) => {
      const newRec: Step3Record = {
        ...r,
        id: `s3-${Date.now()}-${idx}`,
        date: targetDate,
      };
      onSaveRecord(newRec);
    });

    setTimeFilterMode('customDate');
    setSelectedDate(targetDate);
  };

  const handleSeedHistoricalData = () => {
    const now = new Date();
    const daysToSeed = [1, 2, 3, 4, 5];
    const templates = [
      { meal: 'Bữa trưa', dish: 'Thịt lợn nạc rim ngũ vị', temp: '72°C', taster: 'Nguyễn Thị Mai Hoa (BGH)' },
      { meal: 'Bữa trưa', dish: 'Canh cua đồng mồng tơi', temp: '68°C', taster: 'Nguyễn Thị Mai Hoa (BGH)' },
      { meal: 'Bữa trưa', dish: 'Cơm tám thơm dẻo', temp: '75°C', taster: 'Nguyễn Thị Mai Hoa (BGH)' },
      { meal: 'Bữa phụ xế', dish: 'Cháo cá hồi bí đỏ phô mai', temp: '65°C', taster: 'Phạm Thị Lan (Tổ trưởng CM)' },
    ];

    daysToSeed.forEach((dOffset) => {
      const d = new Date(now.getTime() - dOffset * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const existing = records.filter((r) => r.date === dateStr);
      if (existing.length === 0) {
        templates.forEach((tmpl, tIdx) => {
          onSaveRecord({
            id: `s3-seed-${dateStr}-${tIdx}`,
            date: dateStr,
            time: tmpl.meal === 'Bữa trưa' ? '10:30' : '14:45',
            meal: tmpl.meal as any,
            dishName: tmpl.dish,
            sensoryEvaluation: 'Màu sắc tươi, mùi vị thơm ngon tự nhiên, chín kỹ',
            servingTemp: tmpl.temp,
            sampleWeight: '150g',
            storageLocation: 'Tủ lưu mẫu số 01 - Ngăn 1 (3°C)',
            taster: tmpl.taster,
            keeper: 'Trần Thị Thu Hà (Y tế)',
            result: 'Đủ điều kiện cho trẻ ăn',
            notes: 'Mẫu thức ăn lưu kín trong hũ inox chuyên dụng niêm phong kẹp chì',
          });
        });
      }
    });

    setTimeFilterMode('all');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: Step3Record = {
      id: editingRecord ? editingRecord.id : `s3-${Date.now()}`,
      date: formState.date || new Date().toISOString().split('T')[0],
      time: formState.time || '10:30',
      meal: (formState.meal as any) || 'Bữa trưa',
      dishName: formState.dishName || '',
      sensoryEvaluation: (formState.sensoryEvaluation as any) || 'Màu sắc tươi, mùi vị thơm ngon tự nhiên, chín kỹ',
      servingTemp: formState.servingTemp || '70°C',
      sampleWeight: formState.sampleWeight || '150g',
      storageLocation: formState.storageLocation || 'Tủ lưu mẫu',
      taster: formState.taster || '',
      keeper: formState.keeper || '',
      result: (formState.result as any) || 'Đủ điều kiện cho trẻ ăn',
      notes: formState.notes || '',
    };
    onSaveRecord(newRecord);
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                Phân hệ 3
              </span>
              <span className="text-xs text-slate-500 font-medium">Quyết định 1246/QĐ-BYT</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Sổ lưu bước 3: Kiểm tra trước khi ăn & Lưu mẫu thức ăn
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Thử nếm cảm quan thức ăn (màu, mùi, vị, độ chín), kiểm tra nhiệt độ chia suất và tiến hành niêm phong mẫu lưu bảo quản 24h.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới thử nếm & lưu mẫu</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>In sổ bước 3</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo món ăn, người thử nếm, cán bộ lưu..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tất cả các bữa ăn</option>
              <option value="Bữa sáng">Bữa sáng</option>
              <option value="Bữa trưa">Bữa trưa</option>
              <option value="Bữa phụ xế">Bữa phụ xế</option>
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
        moduleName="mẫu thử nếm & lưu"
        onAddForDate={(date) => handleOpenAdd(date)}
        onCloneDateData={handleCloneDateData}
        onSeedHistoricalData={handleSeedHistoricalData}
      />

      {/* Official Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Hiển thị <strong>{filteredRecords.length}</strong> / {records.length} bản ghi
            {timeFilterMode !== 'all' && (
              <span className="ml-2 text-emerald-700 font-semibold">
                (Bộ lọc thời gian đang áp dụng)
              </span>
            )}
          </span>
          <span className="italic text-slate-500 hidden sm:inline">
            Mẫu số 03 - Phụ lục ban hành kèm theo Quyết định 1246/QĐ-BYT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Ngày & Giờ</th>
                <th className="p-3 border-r border-slate-200">Bữa ăn</th>
                <th className="p-3 border-r border-slate-200">Tên món ăn</th>
                <th className="p-3 border-r border-slate-200">Đánh giá cảm quan & Nhiệt độ</th>
                <th className="p-3 border-r border-slate-200">Lượng mẫu lưu & Vị trí</th>
                <th className="p-3 border-r border-slate-200">Người nếm (BGH)</th>
                <th className="p-3 border-r border-slate-200">Người lưu mẫu</th>
                <th className="p-3 border-r border-slate-200 text-center">Kết luận</th>
                <th className="p-3 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">Không tìm thấy bản ghi thử nếm/lưu mẫu nào trong khoảng thời gian này.</p>
                      <p className="text-xs text-slate-500">
                        Chọn <strong>&quot;Toàn bộ lịch sử&quot;</strong> hoặc nhấn <strong>&quot;Thêm mới thử nếm &amp; lưu mẫu&quot;</strong> để nhập hồ sơ.
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
                    <td className="p-3 whitespace-nowrap border-r border-slate-200">
                      <div className="font-bold text-slate-900">{formatDateVN(r.date)}</div>
                      <div className="text-xs text-slate-500">{r.time}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap border-r border-slate-200 font-medium">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
                        {r.meal}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-blue-950 border-r border-slate-200">
                      {r.dishName}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="text-slate-800">{r.sensoryEvaluation}</div>
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                        <Thermometer className="w-3.5 h-3.5" />
                        Nhiệt độ chia ăn: {r.servingTemp}
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="font-medium text-slate-900">Lượng mẫu: {r.sampleWeight}</div>
                      <div className="text-xs text-slate-500">{r.storageLocation}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {r.taster}
                    </td>
                    <td className="p-3 text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {r.keeper}
                    </td>
                    <td className="p-3 text-center border-r border-slate-200 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-900">
                        {r.result}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="Chỉnh sửa bản ghi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateRecord(r)}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="Nhân bản bản ghi"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa bản ghi lưu mẫu "${r.dishName}"?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Xóa bản ghi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRecord ? 'Chỉnh sửa phiếu thử nếm & lưu mẫu' : 'Thêm mới thử nếm & lưu mẫu thức ăn'}
                  </h3>
                  <p className="text-xs text-slate-500">Mẫu kiểm thực bước 3 theo QĐ 1246/QĐ-BYT</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày thực hiện</label>
                  <input
                    type="date"
                    required
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-emerald-50/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời gian thử nếm</label>
                  <input
                    type="time"
                    required
                    value={formState.time}
                    onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bữa ăn</label>
                  <select
                    value={formState.meal}
                    onChange={(e) => setFormState({ ...formState, meal: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Bữa sáng">Bữa sáng</option>
                    <option value="Bữa trưa">Bữa trưa</option>
                    <option value="Bữa phụ xế">Bữa phụ xế</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên món ăn kiểm tra & lưu mẫu</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thịt lợn rim sốt cà chua"
                  value={formState.dishName}
                  onChange={(e) => setFormState({ ...formState, dishName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đánh giá cảm quan (Màu, Mùi, Vị)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Màu sắc tươi, mùi vị thơm ngon tự nhiên, chín kỹ"
                    value={formState.sensoryEvaluation}
                    onChange={(e) => setFormState({ ...formState, sensoryEvaluation: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhiệt độ thức ăn khi chia suất</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 70°C (nóng ấm trên 60°C)"
                    value={formState.servingTemp}
                    onChange={(e) => setFormState({ ...formState, servingTemp: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lượng mẫu lưu (&ge; 150g hoặc 100ml)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 150g"
                    value={formState.sampleWeight}
                    onChange={(e) => setFormState({ ...formState, sampleWeight: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vị trí tủ lưu mẫu</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Tủ lưu mẫu số 01 - Ngăn 1 (3°C)"
                    value={formState.storageLocation}
                    onChange={(e) => setFormState({ ...formState, storageLocation: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người thử nếm (BGH / Quản lý)</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên người thử"
                    value={formState.taster}
                    onChange={(e) => setFormState({ ...formState, taster: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cán bộ lưu mẫu (Y tế)</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên cán bộ y tế"
                    value={formState.keeper}
                    onChange={(e) => setFormState({ ...formState, keeper: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kết luận đánh giá</label>
                  <select
                    value={formState.result}
                    onChange={(e) => setFormState({ ...formState, result: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-semibold"
                  >
                    <option value="Đủ điều kiện cho trẻ ăn">Đủ điều kiện cho trẻ ăn</option>
                    <option value="Không đủ điều kiện (hủy)">Không đủ điều kiện (hủy)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú bổ sung</label>
                <input
                  type="text"
                  placeholder="Ghi chú về tình trạng niêm phong, mã hũ inox..."
                  value={formState.notes}
                  onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
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
                  {editingRecord ? 'Lưu thay đổi' : 'Thêm bản ghi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
