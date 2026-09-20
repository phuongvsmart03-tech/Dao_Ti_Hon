'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  UserCheck,
  Edit2,
  Trash2,
  FileCheck,
  X,
  Save,
  ShieldCheck,
  Phone,
  Calendar,
  Database,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { StaffRecord } from '@/types/preschool';

interface StaffManagementProps {
  records: StaffRecord[];
  onSaveRecord: (record: StaffRecord) => void;
  onDeleteRecord: (id: string) => void;
  onPrintPreview: () => void;
}

export default function StaffManagement({
  records,
  onSaveRecord,
  onDeleteRecord,
  onPrintPreview,
}: StaffManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StaffRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<StaffRecord | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [formState, setFormState] = useState<Partial<StaffRecord>>({
    staffCode: `CB-${new Date().getFullYear()}-00${records.length + 1}`,
    fullName: '',
    role: 'Giáo viên',
    assignedDuty: 'Chủ nhiệm Lớp Mầm 1',
    phone: '',
    email: '',
    qualification: 'Cử nhân GD Mầm non',
    foodSafetyCertDate: '2024-03-15',
    healthCheckExpiry: '2026-03-15',
    contractStatus: 'Hợp đồng dài hạn',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSyncTurso = async () => {
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'syncStaff',
          staff: records,
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

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.staffCode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.assignedDuty || r.assignedClassOrDept || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.phone || '').includes(searchTerm);
      const matchRole = selectedRole === 'all' || r.role === selectedRole;
      const matchStatus = selectedStatus === 'all' || r.contractStatus === selectedStatus;
      return matchSearch && matchRole && matchStatus;
    });
  }, [records, searchTerm, selectedRole, selectedStatus]);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormState({
      staffCode: `CB-${new Date().getFullYear()}-00${records.length + 1}`,
      fullName: '',
      role: 'Giáo viên',
      assignedDuty: 'Chủ nhiệm Lớp Mầm 1',
      phone: '',
      email: '',
      qualification: 'Cử nhân GD Mầm non',
      foodSafetyCertDate: '2024-03-15',
      healthCheckExpiry: '2026-03-15',
      contractStatus: 'Hợp đồng dài hạn',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (rec: StaffRecord) => {
    setEditingRecord(rec);
    setFormState({ ...rec });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: StaffRecord = {
      id: editingRecord ? editingRecord.id : `stf-${Date.now()}`,
      staffCode: formState.staffCode || `CB-${Date.now()}`,
      fullName: formState.fullName || '',
      role: (formState.role as any) || 'Giáo viên',
      assignedDuty: formState.assignedDuty || '',
      phone: formState.phone || '',
      email: formState.email || '',
      qualification: formState.qualification || '',
      foodSafetyCertDate: formState.foodSafetyCertDate || '',
      healthCheckExpiry: formState.healthCheckExpiry || '',
      contractStatus: (formState.contractStatus as any) || 'Hợp đồng dài hạn',
      startDate: formState.startDate || '',
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                Phân hệ 8
              </span>
              <span className="text-xs text-slate-500 font-medium">Hồ sơ Cán bộ - Giáo viên - Nhân viên</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 truncate">
              Nhân sự: Ban giám hiệu, Giáo viên, Cấp dưỡng & Nhân viên
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Quản lý định biên nhân sự nhà trường, phân công chuyên môn, hạn chứng chỉ ATTP và KSK định kỳ.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleSyncTurso}
              title="Lưu toàn bộ danh sách nhân sự lên Turso Cloud Database"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 shadow-2xs transition-colors cursor-pointer"
            >
              <Database className="w-4 h-4 text-teal-700" />
              <span>{syncStatus === 'syncing' ? 'Đang lưu...' : syncStatus === 'success' ? 'Đã lưu Turso ✓' : syncStatus === 'local_only' ? 'Đã lưu cục bộ' : 'Lưu & Đồng bộ Turso'}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm nhân sự mới</span>
            </button>
            <button
              type="button"
              onClick={onPrintPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>In danh sách nhân sự</span>
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
              placeholder="Tìm theo họ tên, mã nhân sự, vị trí phân công, SĐT..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tất cả chức vụ</option>
              <option value="Ban giám hiệu">Ban giám hiệu</option>
              <option value="Giáo viên">Giáo viên</option>
              <option value="Cấp dưỡng">Cấp dưỡng / Đầu bếp</option>
              <option value="Cán bộ y tế">Cán bộ y tế</option>
              <option value="Bảo vệ / Phục vụ">Bảo vệ / Phục vụ</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            >
              <option value="all">Tất cả tình trạng HĐ</option>
              <option value="Hợp đồng dài hạn">Hợp đồng dài hạn</option>
              <option value="Thử việc / Thời vụ">Thử việc / Thời vụ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Official Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600 font-medium">
          <span>
            Hiển thị <strong>{filteredRecords.length}</strong> / {records.length} cán bộ, giáo viên, nhân viên
          </span>
          <span className="italic text-slate-500">Mẫu thống kê định biên và hồ sơ hành chính trường</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm text-slate-900">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 font-semibold text-slate-700">
                <th className="p-3 w-12 text-center border-r border-slate-200">STT</th>
                <th className="p-3 border-r border-slate-200">Mã CB</th>
                <th className="p-3 border-r border-slate-200">Họ và tên</th>
                <th className="p-3 border-r border-slate-200">Chức vụ</th>
                <th className="p-3 border-r border-slate-200">Nhiệm vụ phân công</th>
                <th className="p-3 border-r border-slate-200">Trình độ CM</th>
                <th className="p-3 border-r border-slate-200">Số điện thoại</th>
                <th className="p-3 border-r border-slate-200">Chứng chỉ ATTP</th>
                <th className="p-3 border-r border-slate-200">Hạn KSK định kỳ</th>
                <th className="p-3 border-r border-slate-200 text-center">Hợp đồng</th>
                <th className="p-3 text-center w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500">
                    Không có nhân sự nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, index) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-medium text-slate-500 border-r border-slate-200">
                      {index + 1}
                    </td>
                    <td className="p-3 font-mono text-slate-600 border-r border-slate-200">{r.staffCode}</td>
                    <td className="p-3 font-bold text-blue-900 border-r border-slate-200">
                      {r.fullName}
                    </td>
                    <td className="p-3 border-r border-slate-200 font-semibold text-slate-800">{r.role}</td>
                    <td className="p-3 border-r border-slate-200 text-slate-700">{r.assignedDuty}</td>
                    <td className="p-3 border-r border-slate-200 text-xs text-slate-600">
                      {r.qualification}
                    </td>
                    <td className="p-3 border-r border-slate-200 font-mono text-xs text-blue-800">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {r.phone}
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-200 text-xs">
                      {r.foodSafetyCertDate ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {r.foodSafetyCertDate}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3 border-r border-slate-200 font-mono text-xs text-slate-700">
                      {r.healthCheckExpiry}
                    </td>
                    <td className="p-3 text-center border-r border-slate-200">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800">
                        {r.contractStatus}
                      </span>
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
                          onClick={() => setDeletingRecord(r)}
                          title="Xóa nhân sự"
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
                {editingRecord ? 'Chỉnh sửa thông tin nhân sự' : 'Thêm mới nhân sự'}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã nhân sự</label>
                  <input
                    type="text"
                    required
                    value={formState.staffCode ?? ''}
                    onChange={(e) => setFormState({ ...formState, staffCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Thị Mai Hoa"
                    value={formState.fullName ?? ''}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chức vụ</label>
                  <select
                    value={formState.role ?? 'Giáo viên'}
                    onChange={(e) => setFormState({ ...formState, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-semibold"
                  >
                    <option value="Ban giám hiệu">Ban giám hiệu</option>
                    <option value="Giáo viên">Giáo viên</option>
                    <option value="Cấp dưỡng">Cấp dưỡng / Đầu bếp</option>
                    <option value="Cán bộ y tế">Cán bộ y tế</option>
                    <option value="Bảo vệ / Phục vụ">Bảo vệ / Phục vụ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phân công nhiệm vụ</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Chủ nhiệm lớp Lá 1"
                    value={formState.assignedDuty ?? ''}
                    onChange={(e) => setFormState({ ...formState, assignedDuty: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    placeholder="0912 345 678"
                    value={formState.phone ?? ''}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Trình độ chuyên môn</label>
                  <input
                    type="text"
                    required
                    placeholder="Cử nhân ĐH Sư phạm Mầm non"
                    value={formState.qualification ?? ''}
                    onChange={(e) => setFormState({ ...formState, qualification: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Y tế & Vệ sinh an toàn thực phẩm
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ngày cấp chứng chỉ ATTP
                    </label>
                    <input
                      type="date"
                      value={formState.foodSafetyCertDate ?? ''}
                      onChange={(e) => setFormState({ ...formState, foodSafetyCertDate: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Hạn khám sức khỏe định kỳ
                    </label>
                    <input
                      type="date"
                      required
                      value={formState.healthCheckExpiry ?? ''}
                      onChange={(e) => setFormState({ ...formState, healthCheckExpiry: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tình trạng hợp đồng</label>
                  <select
                    value={formState.contractStatus ?? 'Hợp đồng dài hạn'}
                    onChange={(e) => setFormState({ ...formState, contractStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Hợp đồng dài hạn">Hợp đồng dài hạn (Biên chế/Chính thức)</option>
                    <option value="Thử việc / Thời vụ">Thử việc / Thời vụ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày vào làm</label>
                  <input
                    type="date"
                    required
                    value={formState.startDate ?? ''}
                    onChange={(e) => setFormState({ ...formState, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú</label>
                <input
                  type="text"
                  placeholder="Khen thưởng, sáng kiến kinh nghiệm..."
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
                  {editingRecord ? 'Lưu thay đổi' : 'Lưu nhân sự'}
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
              <h3 className="text-base font-bold text-slate-900">Xác nhận xóa nhân sự</h3>
              <p className="text-xs text-slate-600 mt-2">
                Bạn có chắc chắn muốn xóa hồ sơ của <strong>{deletingRecord.fullName}</strong> ({deletingRecord.role}) khỏi hệ thống? Thao tác này không thể hoàn tác.
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
