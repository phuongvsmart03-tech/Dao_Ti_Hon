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
  AlertCircle,
  FileCheck,
  X,
  Save,
  Copy,
  CalendarDays,
} from 'lucide-react';
import { Step1Record } from '@/types/preschool';
import HistoricalDateFilterBar, { TimeFilterMode } from '@/components/HistoricalDateFilterBar';
import { matchesTimeFilter, extractAvailableDates, formatDateVN } from '@/lib/utils';

interface Step1InspectionProps {
  records: Step1Record[];
  onSaveRecord: (record: Step1Record) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
  onBatchSaveRecords?: (records: Step1Record[]) => void;
}

export default function Step1Inspection({
  records,
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
  onBatchSaveRecords,
}: Step1InspectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Historical Time Filters
  const [timeFilterMode, setTimeFilterMode] = useState<TimeFilterMode>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Step1Record | null>(null);

  // Form State
  const [formState, setFormState] = useState<Partial<Step1Record>>({
    date: new Date().toISOString().split('T')[0],
    time: '06:30',
    foodName: '',
    category: 'Thịt cá tươi sống',
    quantity: '',
    sensoryQuality: 'Đạt (tươi mới, không mùi lạ)',
    supplier: '',
    expiryOrCertificate: '',
    deliverer: '',
    inspector: 'Cán bộ Y tế',
    result: 'Đạt nhập kho',
    notes: '',
  });

  const availableDates = useMemo(() => {
    return extractAvailableDates(records);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.inspector.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || r.category === selectedCategory;
      const matchTime = matchesTimeFilter(r.date, timeFilterMode, selectedDate, startDate, endDate);
      return matchSearch && matchCat && matchTime;
    });
  }, [records, searchTerm, selectedCategory, timeFilterMode, selectedDate, startDate, endDate]);

  const handleOpenAdd = (presetDate?: string) => {
    setEditingRecord(null);
    setFormState({
      date: presetDate || selectedDate || new Date().toISOString().split('T')[0],
      time: '06:30',
      foodName: '',
      category: 'Thịt cá tươi sống',
      quantity: '',
      sensoryQuality: 'Đạt (tươi mới, không mùi lạ)',
      supplier: '',
      expiryOrCertificate: '',
      deliverer: '',
      inspector: 'Cán bộ Y tế',
      result: 'Đạt nhập kho',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: Step1Record) => {
    setEditingRecord(rec);
    setFormState({ ...rec });
    setModalOpen(true);
  };

  const handleDuplicateRecord = (rec: Step1Record) => {
    const cloned: Step1Record = {
      ...rec,
      id: `s1-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      notes: rec.notes ? `${rec.notes} (Bản sao)` : '(Bản sao)',
    };
    onSaveRecord(cloned);
  };

  const handleCloneDateData = (sourceDate: string, targetDate: string) => {
    const sourceRecords = records.filter((r) => r.date === sourceDate);
    if (sourceRecords.length === 0) return;

    sourceRecords.forEach((r, idx) => {
      const newRec: Step1Record = {
        ...r,
        id: `s1-${Date.now()}-${idx}`,
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
      { name: 'Thịt nạc vai heo sạch', cat: 'Thịt cá tươi sống', qty: '26.0 kg', sup: 'Công ty Thực phẩm Ba Vì' },
      { name: 'Cá hồi tươi phi lê', cat: 'Thịt cá tươi sống', qty: '15.5 kg', sup: 'HTX Thủy sản Hải Đăng' },
      { name: 'Rau mồng tơi & mướp hương VietGAP', cat: 'Rau củ quả', qty: '20.0 kg', sup: 'HTX Nông Nghiệp Đông Anh' },
      { name: 'Sữa tươi tiệt trùng Vinamilk 180ml', cat: 'Sữa & chế phẩm', qty: '220 hộp', sup: 'Đại lý Vinamilk Cầu Giấy' },
      { name: 'Gạo tám thơm Điện Biên', cat: 'Gạo & ngũ cốc', qty: '35.0 kg', sup: 'Đại lý Gạo Sạch Miền Bắc' },
    ];

    daysToSeed.forEach((dOffset) => {
      const d = new Date(now.getTime() - dOffset * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const existing = records.filter((r) => r.date === dateStr);
      if (existing.length === 0) {
        templates.forEach((tmpl, tIdx) => {
          onSaveRecord({
            id: `s1-seed-${dateStr}-${tIdx}`,
            date: dateStr,
            time: `06:${30 + tIdx * 10}`,
            foodName: tmpl.name,
            category: tmpl.cat as any,
            quantity: tmpl.qty,
            sensoryQuality: 'Đạt (tươi mới, không mùi lạ)',
            supplier: tmpl.sup,
            expiryOrCertificate: 'HĐ kiểm dịch số ' + (100 + tIdx) + '/TY',
            deliverer: 'Nguyễn Văn Tuấn',
            inspector: 'Trần Thị Thu Hà (Y tế)',
            result: 'Đạt nhập kho',
            notes: 'Hồ sơ kiểm thực lưu trữ định kỳ đạt chuẩn',
          });
        });
      }
    });

    setTimeFilterMode('all');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: Step1Record = {
      id: editingRecord ? editingRecord.id : `s1-${Date.now()}`,
      date: formState.date || new Date().toISOString().split('T')[0],
      time: formState.time || '06:30',
      foodName: formState.foodName || '',
      category: (formState.category as any) || 'Thịt cá tươi sống',
      quantity: formState.quantity || '',
      sensoryQuality: (formState.sensoryQuality as any) || 'Đạt (tươi mới, không mùi lạ)',
      supplier: formState.supplier || '',
      expiryOrCertificate: formState.expiryOrCertificate || '',
      deliverer: formState.deliverer || '',
      inspector: formState.inspector || '',
      result: (formState.result as any) || 'Đạt nhập kho',
      notes: formState.notes || '',
    };
    onSaveRecord(newRecord);
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Banner & Summary */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                Phân hệ 1
              </span>
              <span className="text-xs text-slate-500 font-medium">Quyết định 1246/QĐ-BYT</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Sổ lưu bước 1: Kiểm tra & Giao nhận thực phẩm, nguyên liệu
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Kiểm tra tình trạng cảm quan, số lượng, nguồn gốc xuất xứ và giấy chứng nhận kiểm dịch trước khi đưa vào sơ chế.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới giao nhận</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>In sổ bước 1</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên thực phẩm, nhà cung cấp, người giao nhận..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tất cả nhóm thực phẩm</option>
              <option value="Thịt cá tươi sống">Thịt cá tươi sống</option>
              <option value="Rau củ quả">Rau củ quả</option>
              <option value="Gia vị khô">Gia vị khô</option>
              <option value="Sữa & chế phẩm">Sữa & chế phẩm</option>
              <option value="Gạo & ngũ cốc">Gạo & ngũ cốc</option>
              <option value="Thực phẩm chế biến ngay">Thực phẩm chế biến ngay</option>
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
        moduleName="bản ghi giao nhận"
        onAddForDate={(date) => handleOpenAdd(date)}
        onCloneDateData={handleCloneDateData}
        onSeedHistoricalData={handleSeedHistoricalData}
      />

      {/* Official Administrative Table Container */}
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
            Mẫu số 01 - Phụ lục ban hành kèm theo Quyết định 1246/QĐ-BYT
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Ngày & Giờ nhận</th>
                <th className="p-3 border-r border-slate-200">Tên thực phẩm</th>
                <th className="p-3 border-r border-slate-200">Khối lượng</th>
                <th className="p-3 border-r border-slate-200">Chất lượng cảm quan</th>
                <th className="p-3 border-r border-slate-200">Nhà cung cấp / HĐ kiểm dịch</th>
                <th className="p-3 border-r border-slate-200">Người giao</th>
                <th className="p-3 border-r border-slate-200">Người nhận (Ký)</th>
                <th className="p-3 border-r border-slate-200 text-center">Kết luận</th>
                <th className="p-3 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">Không tìm thấy bản ghi nào trong khoảng thời gian đã chọn.</p>
                      <p className="text-xs text-slate-500">
                        Bạn có thể chọn chế độ <strong>&quot;Toàn bộ lịch sử&quot;</strong>, chọn ngày khác trong danh sách, hoặc nhấn <strong>&quot;Thêm bản ghi cho ngày này&quot;</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenAdd()}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-700 text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Nhập mới ngay
                      </button>
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
                      <div className="text-xs text-slate-500 font-medium">{r.time}</div>
                    </td>
                    <td className="p-3 font-semibold text-blue-900 border-r border-slate-200">
                      {r.foodName}
                      <span className="block text-xs font-normal text-slate-500">{r.category}</span>
                    </td>
                    <td className="p-3 font-medium text-slate-900 whitespace-nowrap border-r border-slate-200">
                      {r.quantity}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                          r.sensoryQuality.includes('Đạt')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {r.sensoryQuality.includes('Đạt') ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {r.sensoryQuality}
                      </span>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="font-medium text-slate-800">{r.supplier}</div>
                      {r.expiryOrCertificate && (
                        <div className="text-xs text-slate-500">{r.expiryOrCertificate}</div>
                      )}
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                      {r.deliverer}
                    </td>
                    <td className="p-3 font-medium text-slate-800 border-r border-slate-200 whitespace-nowrap">
                      {r.inspector}
                    </td>
                    <td className="p-3 text-center border-r border-slate-200 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                          r.result === 'Đạt nhập kho'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
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
                            if (confirm(`Bạn có chắc chắn muốn xóa bản ghi kiểm thực "${r.foodName}" ngày ${r.date}?`)) {
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
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRecord ? 'Chỉnh sửa phiếu giao nhận thực phẩm' : 'Thêm mới giao nhận thực phẩm'}
                  </h3>
                  <p className="text-xs text-slate-500">Mẫu kiểm thực bước 1 theo QĐ 1246/QĐ-BYT</p>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày nhận hàng</label>
                  <input
                    type="date"
                    required
                    value={formState.date}
                    onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-emerald-50/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giờ nhận hàng</label>
                  <input
                    type="time"
                    required
                    value={formState.time}
                    onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên thực phẩm / Nguyên liệu</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Thịt lợn nạc vai sinh học"
                    value={formState.foodName}
                    onChange={(e) => setFormState({ ...formState, foodName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhóm thực phẩm</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Thịt cá tươi sống">Thịt cá tươi sống</option>
                    <option value="Rau củ quả">Rau củ quả</option>
                    <option value="Gia vị khô">Gia vị khô</option>
                    <option value="Sữa & chế phẩm">Sữa & chế phẩm</option>
                    <option value="Gạo & ngũ cốc">Gạo & ngũ cốc</option>
                    <option value="Thực phẩm chế biến ngay">Thực phẩm chế biến ngay</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số lượng / Khối lượng</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 25.5 kg hoặc 200 hộp"
                    value={formState.quantity}
                    onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đánh giá cảm quan ban đầu</label>
                  <select
                    value={formState.sensoryQuality}
                    onChange={(e) => setFormState({ ...formState, sensoryQuality: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Đạt (tươi mới, không mùi lạ)">Đạt (tươi mới, không mùi lạ)</option>
                    <option value="Không đạt (hỏng, ôi thiu)">Không đạt (hỏng, ôi thiu)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn vị / Cơ sở cung cấp</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: HTX Rau sạch An Phú"
                    value={formState.supplier}
                    onChange={(e) => setFormState({ ...formState, supplier: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hạn sử dụng / Hóa đơn chứng từ</label>
                  <input
                    type="text"
                    placeholder="VD: Giấy kiểm dịch số 88/TY-HN"
                    value={formState.expiryOrCertificate}
                    onChange={(e) => setFormState({ ...formState, expiryOrCertificate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người giao hàng</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên người giao"
                    value={formState.deliverer}
                    onChange={(e) => setFormState({ ...formState, deliverer: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người nhận kiểm tra</label>
                  <input
                    type="text"
                    required
                    placeholder="Cán bộ y tế / bếp"
                    value={formState.inspector}
                    onChange={(e) => setFormState({ ...formState, inspector: e.target.value })}
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
                    <option value="Đạt nhập kho">Đạt nhập kho</option>
                    <option value="Từ chối nhận">Từ chối nhận</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú kiểm tra</label>
                <input
                  type="text"
                  placeholder="Ghi chú chi tiết về bao bì, nhiệt độ bảo quản xe chuyên dụng..."
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
