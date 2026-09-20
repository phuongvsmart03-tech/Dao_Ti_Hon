'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  FileCheck,
  X,
  Save,
  ShieldCheck,
  AlertTriangle,
  Copy,
} from 'lucide-react';
import { SampleDisposalRecord } from '@/types/preschool';
import HistoricalDateFilterBar, { TimeFilterMode } from '@/components/HistoricalDateFilterBar';
import { matchesTimeFilter, extractAvailableDates, formatDateVN } from '@/lib/utils';

interface SampleDisposalProps {
  records: SampleDisposalRecord[];
  onSaveRecord: (record: SampleDisposalRecord) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
}

const DEFAULT_SAMPLE_FORM: Partial<SampleDisposalRecord> = {
  dateSampled: new Date().toISOString().split('T')[0],
  timeSampled: '10:30',
  meal: 'Bữa trưa',
  dishName: '',
  sampleWeight: '150g',
  containerType: 'Hộp Inox có nắp vô trùng',
  storageTemp: '3.0°C',
  disposalDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  disposalTime: '10:30',
  conditionAtDisposal: 'Bình thường, không biến chất',
  samplerName: 'Trần Thị Thu Hà (Y tế)',
  witnessName: 'Lê Văn Tài (Bếp trưởng)',
  status: 'Đang lưu mẫu (<24h)',
  notes: '',
};

export default function SampleDisposal({
  records,
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
}: SampleDisposalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Historical Time Filters
  const [timeFilterMode, setTimeFilterMode] = useState<TimeFilterMode>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SampleDisposalRecord | null>(null);

  const [formState, setFormState] = useState<Partial<SampleDisposalRecord>>(DEFAULT_SAMPLE_FORM);

  const availableDates = useMemo(() => {
    return extractAvailableDates(records);
  }, [records]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.samplerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.witnessName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = selectedStatus === 'all' || r.status === selectedStatus;
      const matchTime = matchesTimeFilter(r.dateSampled, timeFilterMode, selectedDate, startDate, endDate);
      return matchSearch && matchStatus && matchTime;
    });
  }, [records, searchTerm, selectedStatus, timeFilterMode, selectedDate, startDate, endDate]);

  const handleOpenAdd = (presetDate?: string) => {
    const curDate = presetDate || selectedDate || new Date().toISOString().split('T')[0];
    const nextDate = new Date(new Date(curDate).getTime() + 86400000).toISOString().split('T')[0];

    setEditingRecord(null);
    setFormState({
      dateSampled: curDate,
      timeSampled: '10:30',
      meal: 'Bữa trưa',
      dishName: '',
      sampleWeight: '150g',
      containerType: 'Hộp Inox có nắp vô trùng',
      storageTemp: '3.0°C',
      disposalDate: nextDate,
      disposalTime: '10:30',
      conditionAtDisposal: 'Bình thường, không biến chất',
      samplerName: 'Trần Thị Thu Hà (Y tế)',
      witnessName: 'Lê Văn Tài (Bếp trưởng)',
      status: 'Đang lưu mẫu (<24h)',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: SampleDisposalRecord) => {
    setEditingRecord(rec);
    setFormState({ ...rec });
    setModalOpen(true);
  };

  const handleDuplicateRecord = (rec: SampleDisposalRecord) => {
    const cloned: SampleDisposalRecord = {
      ...rec,
      id: `disp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      notes: rec.notes ? `${rec.notes} (Bản sao)` : '(Bản sao)',
    };
    onSaveRecord(cloned);
  };

  const handleCloneDateData = (sourceDate: string, targetDate: string) => {
    const sourceRecords = records.filter((r) => r.dateSampled === sourceDate);
    if (sourceRecords.length === 0) return;

    const nextTargetDate = new Date(new Date(targetDate).getTime() + 86400000).toISOString().split('T')[0];

    sourceRecords.forEach((r, idx) => {
      const newRec: SampleDisposalRecord = {
        ...r,
        id: `disp-${Date.now()}-${idx}`,
        dateSampled: targetDate,
        disposalDate: nextTargetDate,
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
      { meal: 'Bữa trưa', dish: 'Thịt lợn rim ngũ vị', weight: '150g' },
      { meal: 'Bữa trưa', dish: 'Canh cua đồng mồng tơi', weight: '150g' },
      { meal: 'Bữa phụ xế', dish: 'Cháo cá hồi bí đỏ phô mai', weight: '150g' },
    ];

    daysToSeed.forEach((dOffset) => {
      const sampledD = new Date(now.getTime() - dOffset * 86400000);
      const dispD = new Date(now.getTime() - (dOffset - 1) * 86400000);
      const dateSampledStr = sampledD.toISOString().split('T')[0];
      const disposalDateStr = dispD.toISOString().split('T')[0];

      const existing = records.filter((r) => r.dateSampled === dateSampledStr);
      if (existing.length === 0) {
        templates.forEach((tmpl, tIdx) => {
          onSaveRecord({
            id: `disp-seed-${dateSampledStr}-${tIdx}`,
            dateSampled: dateSampledStr,
            timeSampled: tmpl.meal === 'Bữa trưa' ? '10:30' : '14:45',
            meal: tmpl.meal as any,
            dishName: tmpl.dish,
            sampleWeight: tmpl.weight,
            containerType: 'Hộp Inox có nắp vô trùng',
            storageTemp: '3.2°C',
            disposalDate: disposalDateStr,
            disposalTime: tmpl.meal === 'Bữa trưa' ? '10:45' : '15:00',
            conditionAtDisposal: 'Bình thường, không biến chất',
            samplerName: 'Trần Thị Thu Hà (Y tế)',
            witnessName: 'Lê Văn Tài (Bếp trưởng)',
            status: dOffset === 1 ? 'Đang lưu mẫu (<24h)' : 'Đã hủy mẫu theo quy định',
            notes: 'Mẫu lưu đủ 24 giờ, niêm phong kẹp chì đảm bảo an toàn',
          });
        });
      }
    });

    setTimeFilterMode('all');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: SampleDisposalRecord = {
      id: editingRecord ? editingRecord.id : `disp-${Date.now()}`,
      dateSampled: formState.dateSampled || new Date().toISOString().split('T')[0],
      timeSampled: formState.timeSampled || '10:30',
      meal: (formState.meal as any) || 'Bữa trưa',
      dishName: formState.dishName || '',
      sampleWeight: formState.sampleWeight || '150g',
      containerType: (formState.containerType as any) || 'Hộp Inox có nắp vô trùng',
      storageTemp: formState.storageTemp || '3.0°C',
      disposalDate: formState.disposalDate || '',
      disposalTime: formState.disposalTime || '',
      conditionAtDisposal: (formState.conditionAtDisposal as any) || 'Bình thường, không biến chất',
      samplerName: formState.samplerName || '',
      witnessName: formState.witnessName || '',
      status: (formState.status as any) || 'Đang lưu mẫu (<24h)',
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
                Phân hệ 5
              </span>
              <span className="text-xs text-slate-500 font-medium">Quy định lưu mẫu 24 giờ VSATTP</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Lưu Hủy Mẫu: Nhật ký theo dõi lưu và hủy mẫu thức ăn
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Kiểm soát quy trình lưu mẫu thức ăn trong tủ lạnh chuyên dụng (2-4°C) đủ 24 giờ và biên bản hủy mẫu có người làm chứng.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenAdd()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi nhật ký lưu mẫu mới</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>In nhật ký lưu & hủy</span>
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
              placeholder="Tìm theo món ăn, người lấy mẫu, người chứng kiến..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang lưu mẫu (<24h)">Đang lưu mẫu (&lt;24h)</option>
              <option value="Đã hủy mẫu theo quy định">Đã hủy mẫu theo quy định</option>
              <option value="Giữ lại phục vụ kiểm tra">Giữ lại phục vụ kiểm tra</option>
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
        moduleName="nhật ký mẫu lưu"
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
            Sổ theo dõi hủy mẫu thực phẩm lưu 24h
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Thời điểm lấy mẫu</th>
                <th className="p-3 border-r border-slate-200">Bữa ăn & Tên món ăn</th>
                <th className="p-3 border-r border-slate-200">Lượng mẫu & Dụng cụ</th>
                <th className="p-3 border-r border-slate-200">Nhiệt độ tủ lưu</th>
                <th className="p-3 border-r border-slate-200">Thời điểm hủy mẫu</th>
                <th className="p-3 border-r border-slate-200">Tình trạng khi hủy</th>
                <th className="p-3 border-r border-slate-200">Người lấy / Chứng kiến</th>
                <th className="p-3 border-r border-slate-200 text-center">Trạng thái</th>
                <th className="p-3 text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-2">
                      <p className="font-semibold text-slate-700">Không tìm thấy bản ghi lưu mẫu nào trong thời gian đã chọn.</p>
                      <p className="text-xs text-slate-500">
                        Chọn <strong>&quot;Toàn bộ lịch sử&quot;</strong> hoặc nhấn <strong>&quot;Ghi nhật ký lưu mẫu mới&quot;</strong>.
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
                      <div className="font-bold text-slate-900">{formatDateVN(r.dateSampled)}</div>
                      <div className="text-xs text-slate-500">{r.timeSampled}</div>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="font-semibold text-blue-950">{r.dishName}</div>
                      <span className="text-xs text-slate-500">{r.meal}</span>
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="font-medium text-slate-900">{r.sampleWeight}</div>
                      <div className="text-xs text-slate-500">{r.containerType}</div>
                    </td>
                    <td className="p-3 font-semibold text-emerald-700 border-r border-slate-200 whitespace-nowrap">
                      {r.storageTemp}
                    </td>
                    <td className="p-3 whitespace-nowrap border-r border-slate-200">
                      <div className="font-medium text-slate-900">{formatDateVN(r.disposalDate)}</div>
                      <div className="text-xs text-slate-500">{r.disposalTime}</div>
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      {r.conditionAtDisposal}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="text-slate-900 font-medium">{r.samplerName}</div>
                      <div className="text-xs text-slate-500">CK: {r.witnessName}</div>
                    </td>
                    <td className="p-3 text-center border-r border-slate-200 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          r.status.includes('Đang lưu')
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {r.status}
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
                            if (confirm(`Bạn có chắc muốn xóa bản ghi lưu mẫu "${r.dishName}"?`)) {
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
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRecord ? 'Chỉnh sửa nhật ký lưu & hủy mẫu' : 'Ghi nhật ký lưu & hủy mẫu thức ăn'}
                  </h3>
                  <p className="text-xs text-slate-500">Tuân thủ quy định lưu mẫu 24h của Bộ Y tế</p>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày lấy mẫu</label>
                  <input
                    type="date"
                    required
                    value={formState.dateSampled}
                    onChange={(e) => setFormState({ ...formState, dateSampled: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-emerald-50/30 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giờ lấy mẫu</label>
                  <input
                    type="time"
                    required
                    value={formState.timeSampled}
                    onChange={(e) => setFormState({ ...formState, timeSampled: e.target.value })}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên món ăn lưu mẫu</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Canh ngao nấu chua mồng tơi"
                  value={formState.dishName}
                  onChange={(e) => setFormState({ ...formState, dishName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lượng mẫu lưu</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Loại dụng cụ đựng</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Hộp Inox có nắp vô trùng"
                    value={formState.containerType}
                    onChange={(e) => setFormState({ ...formState, containerType: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhiệt độ bảo quản tủ mẫu</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 3.0°C"
                    value={formState.storageTemp}
                    onChange={(e) => setFormState({ ...formState, storageTemp: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày hủy mẫu (Sau 24h)</label>
                  <input
                    type="date"
                    value={formState.disposalDate}
                    onChange={(e) => setFormState({ ...formState, disposalDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giờ hủy mẫu</label>
                  <input
                    type="time"
                    value={formState.disposalTime}
                    onChange={(e) => setFormState({ ...formState, disposalTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tình trạng mẫu khi hủy</label>
                  <input
                    type="text"
                    placeholder="VD: Bình thường, không biến chất"
                    value={formState.conditionAtDisposal}
                    onChange={(e) => setFormState({ ...formState, conditionAtDisposal: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người lấy mẫu</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên cán bộ y tế"
                    value={formState.samplerName}
                    onChange={(e) => setFormState({ ...formState, samplerName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người chứng kiến</label>
                  <input
                    type="text"
                    required
                    placeholder="Họ tên người chứng kiến"
                    value={formState.witnessName}
                    onChange={(e) => setFormState({ ...formState, witnessName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái mẫu</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-semibold"
                  >
                    <option value="Đang lưu mẫu (<24h)">Đang lưu mẫu (&lt;24h)</option>
                    <option value="Đã hủy mẫu theo quy định">Đã hủy mẫu theo quy định</option>
                    <option value="Giữ lại phục vụ kiểm tra">Giữ lại phục vụ kiểm tra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú lưu hủy mẫu</label>
                <input
                  type="text"
                  placeholder="Ghi chú về dung dịch khử trùng, biên bản kiểm tra liên ngành nếu có..."
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
