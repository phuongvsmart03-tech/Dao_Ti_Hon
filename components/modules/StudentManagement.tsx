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
  HelpCircle,
  Phone,
  CalendarDays,
} from 'lucide-react';
import { StudentRecord } from '@/types/preschool';
import AttendanceHeatmapModal from '@/components/AttendanceHeatmapModal';

interface StudentManagementProps {
  records: StudentRecord[];
  onSaveRecord: (record: StudentRecord) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
}

export default function StudentManagement({
  records,
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
}: StudentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedAttendance, setSelectedAttendance] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [heatmapOpen, setHeatmapOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StudentRecord | null>(null);

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
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                Phân hệ 6
              </span>
              <span className="text-xs text-slate-500 font-medium">Thông tư 28/2020/TT-BGDĐT</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              Học sinh: Quản lý hồ sơ, danh sách lớp, phụ huynh & Điểm danh
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Số hóa toàn diện thông tin lý lịch trẻ, phân lớp học, số liên lạc phụ huynh, chế độ ăn kiêng và sổ theo dõi chuyên cần.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setHeatmapOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer border border-emerald-500"
              title="Xem và chỉnh sửa Heatmap lịch điểm danh, chuyên cần bằng Emoji"
            >
              <span className="text-sm">😊</span>
              <span>Lịch Điểm Danh (Heatmap)</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tiếp nhận học sinh mới</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>In danh sách học sinh</span>
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
              placeholder="Tìm theo tên bé, mã định danh, phụ huynh, số điện thoại..."
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
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
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
                <th className="p-3 border-r border-slate-200">Họ tên Phụ huynh & SĐT</th>
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
                          <HelpCircle className="w-3.5 h-3.5" />
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
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa học sinh "${r.fullName}"?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          title="Xóa"
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
            console.log('Updated attendance for date', dateStr, present, absent);
          }}
        />
      )}
    </div>
  );
}
