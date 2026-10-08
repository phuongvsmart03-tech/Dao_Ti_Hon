'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Users,
  Edit2,
  Trash2,
  FileCheck,
  X,
  Save,
  CheckCircle2,
  AlertOctagon,
  CircleHelp,
  Phone,
  CalendarDays,
} from 'lucide-react';
import { StudentRecord, HealthRecord } from '@/types/preschool';
import AttendanceHeatmapModal from '@/components/AttendanceHeatmapModal';
import { HeartPulse } from 'lucide-react';

interface StudentManagementProps {
  records: StudentRecord[];
  healthRecords?: HealthRecord[];
  onSaveRecord: (record: StudentRecord) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
  onClearAllSampleData?: () => void;
}

export default function StudentManagement({
  records,
  healthRecords = [],
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
  onClearAllSampleData,
}: StudentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedAttendance, setSelectedAttendance] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StudentRecord | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentRecord | null>(null);

  const [formState, setFormState] = useState<Partial<StudentRecord>>({
    studentCode: `MN-${new Date().getFullYear()}-00${records.length + 1}`,
    fullName: '',
    dob: '2020-01-01',
    gender: 'Nam',
    className: 'Lá 1',
    parentName: '',
    parentPhone: '',
    address: '',
    attendanceStatus: 'Có mặt',
    allergiesOrDiet: 'Không có dị ứng',
    enrollmentDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.parentPhone.includes(searchTerm);
      const matchClass = selectedClass === 'all' || r.className === selectedClass;
      const matchAtt = selectedAttendance === 'all' || r.attendanceStatus === selectedAttendance;
      return matchSearch && matchClass && matchAtt;
    });
  }, [records, searchTerm, selectedClass, selectedAttendance]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormState({
      studentCode: `MN-${new Date().getFullYear()}-00${records.length + 1}`,
      fullName: '',
      dob: '2020-01-01',
      gender: 'Nam',
      className: 'Lá 1',
      parentName: '',
      parentPhone: '',
      address: '',
      attendanceStatus: 'Có mặt',
      allergiesOrDiet: 'Không có dị ứng',
      enrollmentDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: StudentRecord) => {
    setEditingRecord(rec);
    setFormState({ ...rec });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: StudentRecord = {
      id: editingRecord ? editingRecord.id : `st-${Date.now()}`,
      studentCode: formState.studentCode || `MN-${Date.now()}`,
      fullName: formState.fullName || '',
      dob: formState.dob || '',
      gender: (formState.gender as any) || 'Nam',
      className: (formState.className as any) || 'Lá 1',
      parentName: formState.parentName || '',
      parentPhone: formState.parentPhone || '',
      address: formState.address || '',
      attendanceStatus: (formState.attendanceStatus as any) || 'Có mặt',
      allergiesOrDiet: formState.allergiesOrDiet || 'Không có dị ứng',
      enrollmentDate: formState.enrollmentDate || '',
      notes: formState.notes || '',
    };
    onSaveRecord(newRecord);
    setModalOpen(false);
  };

  // Quick Attendance Toggle
  const handleToggleAttendance = (id: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'Có mặt'
        ? 'Nghỉ có phép'
        : currentStatus === 'Nghỉ có phép'
        ? 'Nghỉ không phép'
        : 'Có mặt';
    const target = records.find((r) => r.id === id);
    if (target) {
      onSaveRecord({ ...target, attendanceStatus: nextStatus as any });
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0a2550] via-[#103a75] to-[#0c2e62] text-white rounded-2xl p-5 sm:p-6 border border-blue-600/40 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-blue-200 font-medium">
              <span className="text-blue-300 font-bold flex items-center gap-1.5 bg-blue-900/60 px-2 py-0.5 rounded-md border border-blue-400/30">
                <Users className="w-3.5 h-3.5 text-blue-300" />
                Học Sinh &amp; Điểm Danh
              </span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="text-blue-100">Thông tư 28/2020/TT-BGDĐT</span>
              <span aria-hidden="true" className="text-blue-400">·</span>
              <span className="font-mono text-blue-200 font-semibold">{records.length} học sinh</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-xs">
              Quản Lý Hồ Sơ Học Sinh &amp; Sổ Điểm Danh Chuyên Cần
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-3xl leading-relaxed font-normal">
              Số hóa toàn diện thông tin lý lịch trẻ, phân lớp học, số liên lạc phụ huynh, chế độ ăn kiêng, tiền sử dị ứng và sổ theo dõi chuyên cần theo ngày.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setHeatmapOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-blue-900/70 hover:bg-blue-800 text-blue-100 border border-blue-400/30 shadow-xs transition-colors cursor-pointer"
              title="Xem và chỉnh sửa lịch điểm danh, theo dõi chuyên cần học sinh"
            >
              <CalendarDays className="w-4 h-4 text-blue-300" />
              <span>Lịch Điểm Danh (Heatmap)</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all cursor-pointer border border-blue-400/40"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>+ Tiếp nhận học sinh</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800/60 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-slate-400" />
              <span>In danh sách</span>
            </button>
            {onClearAllSampleData && (
              <button
                type="button"
                onClick={onClearAllSampleData}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 transition-colors cursor-pointer"
                title="Xóa toàn bộ data mẫu để tự nhập danh sách học sinh thực tế của trường"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Xóa Data Mẫu</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 mt-4 pt-4 border-t border-slate-800">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên bé, mã định danh, phụ huynh, số điện thoại..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả các lớp</option>
              <option value="Nhà Trẻ Hoa Cúc">Nhà Trẻ Hoa Cúc</option>
              <option value="Mầm 1">Lớp Mầm 1</option>
              <option value="Mầm 2">Lớp Mầm 2</option>
              <option value="Chồi 1">Lớp Chồi 1</option>
              <option value="Chồi 2">Lớp Chồi 2</option>
              <option value="Lá 1">Lớp Lá 1</option>
              <option value="Lá 2">Lớp Lá 2</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={selectedAttendance}
              onChange={(e) => setSelectedAttendance(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tất cả điểm danh hôm nay</option>
              <option value="Có mặt">Có mặt</option>
              <option value="Nghỉ có phép">Nghỉ có phép</option>
              <option value="Nghỉ không phép">Nghỉ không phép</option>
            </select>
          </div>
        </div>
      </div>

      {/* Official Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Hiển thị <strong>{filteredRecords.length}</strong> / {records.length} học sinh
          </span>
          <span className="italic text-slate-500">Mẫu sổ danh sách và điểm danh mầm non</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Mã HS</th>
                <th className="p-3 border-r border-slate-200">Họ và tên học sinh</th>
                <th className="p-3 border-r border-slate-200">Ngày sinh & Giới tính</th>
                <th className="p-3 border-r border-slate-200">Lớp học</th>
                <th className="p-3 border-r border-slate-200">Kênh Dinh Dưỡng &amp; SK</th>
                <th className="p-3 border-r border-slate-200">Họ tên Phụ huynh &amp; SĐT</th>
                <th className="p-3 border-r border-slate-200">Địa chỉ cư trú</th>
                <th className="p-3 border-r border-slate-200">Lưu ý ăn uống / Dị ứng</th>
                <th className="p-3 border-r border-slate-200 text-center">Điểm danh hôm nay</th>
                <th className="p-3 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    Không tìm thấy học sinh nào phù hợp tiêu chí lọc.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-medium text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-3 font-mono text-slate-600 border-r border-slate-200">
                      {r.studentCode}
                    </td>
                    <td className="p-3 border-r border-slate-200 font-bold text-blue-900">
                      {r.fullName}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div>{r.dob}</div>
                      <span className="text-xs text-slate-500">{r.gender}</span>
                    </td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-slate-800">
                      {r.className}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      {(() => {
                        const hr = healthRecords.find(
                          (h) => h.studentId === r.id || h.studentName.trim().toLowerCase() === r.fullName.trim().toLowerCase()
                        );
                        if (!hr) {
                          return (
                            <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              Chờ đo đợt mới
                            </span>
                          );
                        }
                        const isNormal = hr.nutritionStatus.includes('Kênh A') || hr.nutritionStatus.includes('Bình thường');
                        const isUnder = hr.nutritionStatus.includes('nhẹ cân') || hr.nutritionStatus.includes('thấp còi');
                        return (
                          <div className="space-y-0.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${
                                isNormal
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : isUnder
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-purple-50 text-purple-900 border-purple-300'
                              }`}
                            >
                              <HeartPulse className="w-3 h-3 shrink-0" />
                              <span>{hr.nutritionStatus}</span>
                            </span>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {hr.heightCm}cm • {hr.weightKg}kg
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-3 border-r border-slate-200">
                      <div className="font-medium text-slate-900">{r.parentName}</div>
                      <div className="text-xs text-blue-700 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 shrink-0" />
                        {r.parentPhone}
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-200 text-slate-700 text-xs">{r.address}</td>
                    <td className="p-3 border-r border-slate-200 text-xs">
                      {r.allergiesOrDiet === 'Không có dị ứng' ? (
                        <span className="text-slate-500">{r.allergiesOrDiet}</span>
                      ) : (
                        <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          {r.allergiesOrDiet}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center border-r border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleToggleAttendance(r.id, r.attendanceStatus)}
                        title="Bấm để chuyển trạng thái điểm danh"
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                          r.attendanceStatus === 'Có mặt'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : r.attendanceStatus === 'Nghỉ có phép'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {r.attendanceStatus === 'Có mặt' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : r.attendanceStatus === 'Nghỉ có phép' ? (
                          <CircleHelp className="w-3.5 h-3.5" />
                        ) : (
                          <AlertOctagon className="w-3.5 h-3.5" />
                        )}
                        {r.attendanceStatus}
                      </button>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
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
                          onClick={() => setDeletingStudent(r)}
                          title="Xóa học sinh này"
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-900">
                {editingRecord ? 'Chỉnh sửa hồ sơ học sinh' : 'Tiếp nhận hồ sơ học sinh mới'}
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã định danh HS</label>
                  <input
                    type="text"
                    required
                    value={formState.studentCode ?? ''}
                    onChange={(e) => setFormState({ ...formState, studentCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên học sinh</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Gia Bảo"
                    value={formState.fullName ?? ''}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày sinh</label>
                  <input
                    type="date"
                    required
                    value={formState.dob ?? ''}
                    onChange={(e) => setFormState({ ...formState, dob: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select
                    value={formState.gender ?? 'Nam'}
                    onChange={(e) => setFormState({ ...formState, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phân vào lớp</label>
                  <select
                    value={formState.className ?? 'Lá 1'}
                    onChange={(e) => setFormState({ ...formState, className: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-semibold"
                  >
                    <option value="Nhà Trẻ Hoa Cúc">Nhà Trẻ Hoa Cúc</option>
                    <option value="Mầm 1">Mầm 1</option>
                    <option value="Mầm 2">Mầm 2</option>
                    <option value="Chồi 1">Chồi 1</option>
                    <option value="Chồi 2">Chồi 2</option>
                    <option value="Lá 1">Lá 1</option>
                    <option value="Lá 2">Lá 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ tên Phụ huynh</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Thành Long"
                    value={formState.parentName ?? ''}
                    onChange={(e) => setFormState({ ...formState, parentName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    required
                    placeholder="0988 123 456"
                    value={formState.parentPhone ?? ''}
                    onChange={(e) => setFormState({ ...formState, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ thường trú / Nơi ở hiện tại</label>
                <input
                  type="text"
                  placeholder="Số nhà, phố, phường, quận..."
                  value={formState.address ?? ''}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chế độ ăn kiêng / Dị ứng thức ăn</label>
                  <input
                    type="text"
                    placeholder="VD: Dị ứng tôm cua / Không dung nạp lactose..."
                    value={formState.allergiesOrDiet ?? ''}
                    onChange={(e) => setFormState({ ...formState, allergiesOrDiet: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm danh hiện tại</label>
                  <select
                    value={formState.attendanceStatus ?? 'Có mặt'}
                    onChange={(e) => setFormState({ ...formState, attendanceStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-bold"
                  >
                    <option value="Có mặt">Có mặt</option>
                    <option value="Nghỉ có phép">Nghỉ có phép</option>
                    <option value="Nghỉ không phép">Nghỉ không phép</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú thêm</label>
                <input
                  type="text"
                  placeholder="Đặc điểm tâm lý, sở thích của bé..."
                  value={formState.notes ?? ''}
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
                  {editingRecord ? 'Lưu thay đổi' : 'Lưu học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {heatmapOpen && (
        <AttendanceHeatmapModal
          students={records}
          onClose={() => setHeatmapOpen(false)}
          onUpdateAttendanceCount={(dateStr, present, absent) => {
            // Đồng bộ điểm danh vào bộ nhớ máy
            if (typeof window !== 'undefined') {
              try {
                const saved = JSON.parse(localStorage.getItem('preschool_custom_attendance') || '{}');
                saved[dateStr] = {
                  present,
                  absent,
                  note: `Cập nhật ngày ${dateStr}: ${present} bé có mặt, ${absent} bé nghỉ`,
                  cleared: present === 0,
                };
                localStorage.setItem('preschool_custom_attendance', JSON.stringify(saved));
              } catch (e) {
                console.error('Lỗi khi lưu điểm danh:', e);
              }
            }
          }}
        />
      )}

      {/* Modal Xác Nhận Xóa Học Sinh */}
      {deletingStudent && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Xác Nhận Xóa Học Sinh
                </h3>
                <p className="text-xs text-slate-500">
                  Thao tác này sẽ xóa hồ sơ học sinh khỏi danh sách lớp.
                </p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
              <div>
                Họ và tên: <strong className="text-rose-950 font-bold">{deletingStudent.fullName}</strong>
              </div>
              <div>
                Mã định danh: <strong className="font-mono">{deletingStudent.studentCode}</strong> • Lớp: <strong>{deletingStudent.className}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteRecord(deletingStudent.id);
                  setDeletingStudent(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
