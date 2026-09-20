'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  CookingPot,
  FileCheck,
  X,
  Save,
  Copy,
} from 'lucide-react';
import { Step2Record } from '@/types/preschool';
import HistoricalDateFilterBar, { TimeFilterMode } from '@/components/HistoricalDateFilterBar';
import { matchesTimeFilter, extractAvailableDates, formatDateVN } from '@/lib/utils';

interface Step2CookingProps {
  records: Step2Record[];
  onSaveRecord: (record: Step2Record) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
}

export default function Step2Cooking({
  records,
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
}: Step2CookingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<string>('all');
  
  // Historical Time Filters
  const [timeFilterMode, setTimeFilterMode] = useState<TimeFilterMode>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Step2Record | null>(null);

  const [formState, setFormState] = useState<Partial<Step2Record>>({
    date: new Date().toISOString().split('T')[0],
    meal: 'Bữa trưa',
    dishName: '',
    prepTime: '08:30 - 09:30',
    cookTime: '09:45 - 10:30',
    cookingTemp: '100°C',
    hygieneStatus: 'Đạt vệ sinh ATTP',
    chef: 'Bếp trưởng Lê Văn Tài',
    supervisor: 'Y tế Trần Thị Thu Hà',
    result: 'Đạt chuẩn vào phục vụ',
    notes: '',
  });

  const availableDates = useMemo(() => {
    return extractAvailableDates(records);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.chef.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMeal = selectedMeal === 'all' || r.meal === selectedMeal;
      const matchTime = matchesTimeFilter(r.date, timeFilterMode, selectedDate, startDate, endDate);
      return matchSearch && matchMeal && matchTime;
    });
  }, [records, searchTerm, selectedMeal, timeFilterMode, selectedDate, startDate, endDate]);

  const handleOpenAdd = (presetDate?: string) => {
    setEditingRecord(null);
    setFormState({
      date: presetDate || selectedDate || new Date().toISOString().split('T')[0],
      meal: 'Bữa trưa',
      dishName: '',
      prepTime: '08:30 - 09:30',
      cookTime: '09:45 - 10:30',
      cookingTemp: '100°C',
      hygieneStatus: 'Đạt vệ sinh ATTP',
      chef: 'Bếp trưởng Lê Văn Tài',
      supervisor: 'Y tế Trần Thị Thu Hà',
      result: 'Đạt chuẩn vào phục vụ',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: Step2Record) => {
    setEditingRecord(rec);
    setFormState({ ...rec });
    setModalOpen(true);
  };

  const handleDuplicateRecord = (rec: Step2Record) => {
    const cloned: Step2Record = {
      ...rec,
      id: `s2-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      notes: rec.notes ? `${rec.notes} (Bản sao)` : '(Bản sao)',
    };
    onSaveRecord(cloned);
  };

  const handleCloneDateData = (sourceDate: string, targetDate: string) => {
    const sourceRecords = records.filter((r) => r.date === sourceDate);
    if (sourceRecords.length === 0) return;

    sourceRecords.forEach((r, idx) => {
      const newRec: Step2Record = {
        ...r,
        id: `s2-${Date.now()}-${idx}`,
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
      { meal: 'Bữa trưa', dish: 'Thịt lợn nạc rim ngũ vị & Trứng cút', prep: '08:00 - 09:00', cook: '09:15 - 10:15', chef: 'Lê Văn Tài' },
      { meal: 'Bữa trưa', dish: 'Canh cua đồng mồng tơi mướp hương', prep: '08:30 - 09:15', cook: '09:45 - 10:20', chef: 'Nguyễn Thị Hiền' },
      { meal: 'Bữa trưa', dish: 'Cơm tám thơm dẻo', prep: '09:00 - 09:20', cook: '09:30 - 10:30', chef: 'Lê Văn Tài' },
      { meal: 'Bữa phụ xế', dish: 'Cháo cá hồi bí đỏ phô mai', prep: '13:00 - 13:45', cook: '14:00 - 14:45', chef: 'Vũ Thị Oanh' },
    ];

    daysToSeed.forEach((dOffset) => {
      const d = new Date(now.getTime() - dOffset * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const existing = records.filter((r) => r.date === dateStr);
      if (existing.length === 0) {
        templates.forEach((tmpl, tIdx) => {
          onSaveRecord({
            id: `s2-seed-${dateStr}-${tIdx}`,
            date: dateStr,
            meal: tmpl.meal as any,
            dishName: tmpl.dish,
            prepTime: tmpl.prep,
            cookTime: tmpl.cook,
            cookingTemp: '100°C (nấu chín sôi kỹ)',
            hygieneStatus: 'Đạt vệ sinh ATTP',
            chef: tmpl.chef,
            supervisor: 'Trần Thị Thu Hà (Y tế)',
            result: 'Đạt chuẩn vào phục vụ',
            notes: 'Tuân thủ nghiêm ngặt quy trình 1 chiều và nhiệt độ quy định',
          });
        });
      }
    });

    setTimeFilterMode('all');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: Step2Record = {
      id: editingRecord ? editingRecord.id : `s2-${Date.now()}`,
      date: formState.date || new Date().toISOString().split('T')[0],
      meal: (formState.meal as any) || 'Bữa trưa',
      dishName: formState.dishName || '',
      prepTime: formState.prepTime || '',
      cookTime: formState.cookTime || '',
      cookingTemp: formState.cookingTemp || '100°C',
      hygieneStatus: (formState.hygieneStatus as any) || 'Đạt vệ sinh ATTP',
      chef: formState.chef || '',
      supervisor: formState.supervisor || '',
      result: (formState.result as any) || 'Đạt chuẩn vào phục vụ',
      notes: formState.notes || '',
    };
    onSaveRecord(newRecord);
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                Phân hệ 2
              </span>
              <span className="text-xs text-slate-500 font-medium">Kiểm thực 3 bước - QĐ 1246/QĐ-BYT</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Sổ lưu bước 2: Quy trình chế biến, sơ chế thực phẩm
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Ghi chép kiểm tra điều kiện vệ sinh khu sơ chế, thời gian đun nấu, nhiệt độ sôi và người chịu trách nhiệm bếp ăn bán trú.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới chế biến</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>In sổ bước 2</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo món ăn, đầu bếp, người giám sát..."
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
        moduleName="món chế biến"
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
            Mẫu số 02 - Phụ lục ban hành kèm theo Quyết định 1246/QĐ-BYT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Ngày</th>
                <th className="p-3 border-r border-slate-200">Bữa ăn</th>
                <th className="p-3 border-r border-slate-200">Tên món ăn</th>
                <th className="p-3 border-r border-slate-200">Thời gian sơ chế</th>
                <th className="p-3 border-r border-slate-200">Thời gian nấu & Nhiệt độ</th>
                <th className="p-3 border-r border-slate-200">Vệ sinh dụng cụ</th>
                <th className="p-3 border-r border-slate-200">Đầu bếp thực hiện</th>
                <th className="p-3 border-r border-slate-200">Người giám sát</th>
                <th className="p-3 border-r border-slate-200 text-center">Kết luận</th>
                <th className="p-3 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">Không tìm thấy bản ghi chế biến nào trong khoảng thời gian này.</p>
                      <p className="text-xs text-slate-500">
                        Chọn <strong>&quot;Toàn bộ lịch sử&quot;</strong> hoặc nhấn <strong>&quot;Thêm mới chế biến&quot;</strong> để nhập hồ sơ.
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
                    <td className="p-3 whitespace-nowrap font-bold text-slate-900 border-r border-slate-200">
                      {formatDateVN(r.date)}
                    </td>
                    <td className="p-3 whitespace-nowrap border-r border-slate-200 font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
                        {r.meal}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-blue-950 border-r border-slate-200">
                      {r.dishName}
                    </td>
                    <td className="p-3 text-slate-600 border-r border-slate-200 whitespace-nowrap">
                      {r.prepTime}
                    </td>
                    <td className="p-3 border-r border-slate-200 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">{r.cookTime}</div>
                      <div className="text-xs text-slate-500">{r.cookingTemp}</div>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {r.hygieneStatus}
                      </span>
                    </td>
                    <td className="p-3 text-slate-800 border-r border-slate-200 font-medium whitespace-nowrap">
                      {r.chef}
                    </td>
                    <td className="p-3 text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {r.supervisor}
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
                            if (confirm(`Bạn có chắc chắn muốn xóa bản ghi chế biến "${r.dishName}"?`)) {
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <CookingPot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRecord ? 'Chỉnh sửa quy trình chế biến' : 'Thêm mới quy trình chế biến'}
                  </h3>
                  <p className="text-xs text-slate-500">Mẫu kiểm thực bước 2 theo QĐ 1246/QĐ-BYT</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày chế biến</label>
                  <input
                    type="date"
                    required
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-emerald-50/30 font-medium"
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên món ăn / Thực đơn</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thịt lợn băm rim sốt cà chua"
                  value={formState.dishName}
                  onChange={(e) => setFormState({ ...formState, dishName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời gian sơ chế</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 08:00 - 09:15"
                    value={formState.prepTime}
                    onChange={(e) => setFormState({ ...formState, prepTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời gian nấu</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 09:30 - 10:15"
                    value={formState.cookTime}
                    onChange={(e) => setFormState({ ...formState, cookTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhiệt độ sôi / đun nấu</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 100°C (sôi 20 phút)"
                    value={formState.cookingTemp}
                    onChange={(e) => setFormState({ ...formState, cookingTemp: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tình trạng vệ sinh dụng cụ & khu bếp</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Đạt vệ sinh ATTP, dao thớt sống chín riêng"
                    value={formState.hygieneStatus}
                    onChange={(e) => setFormState({ ...formState, hygieneStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kết luận kiểm tra</label>
                  <select
                    value={formState.result}
                    onChange={(e) => setFormState({ ...formState, result: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-semibold"
                  >
                    <option value="Đạt chuẩn vào phục vụ">Đạt chuẩn vào phục vụ</option>
                    <option value="Cần chế biến lại">Cần chế biến lại</option>
                    <option value="Hủy bỏ không đạt">Hủy bỏ không đạt</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đầu bếp thực hiện</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên đầu bếp"
                    value={formState.chef}
                    onChange={(e) => setFormState({ ...formState, chef: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người giám sát (Y tế / Quản lý)</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên người giám sát"
                    value={formState.supervisor}
                    onChange={(e) => setFormState({ ...formState, supervisor: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú thêm</label>
                <input
                  type="text"
                  placeholder="Ghi chú về kiểm tra cảm quan thực phẩm sau khi nấu xong..."
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
