'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingCart,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  DollarSign,
  Users,
  Building2,
  Calendar,
  Layers,
  FileCheck,
  Receipt,
  Download,
} from 'lucide-react';
import { MenuItem, Step1Record, FinanceTransaction, SchoolInfo } from '@/types/preschool';
import { generateProcurementGroceryList } from '@/lib/nutrition-calculator';

interface ProcurementGroceryModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  studentCount?: number;
  schoolInfo?: SchoolInfo;
  onSyncToStep1?: (records: Step1Record[]) => void;
  onSyncToFinance?: (tx: FinanceTransaction) => void;
}

export default function ProcurementGroceryModal({
  isOpen,
  onClose,
  menuItem,
  studentCount = 80,
  schoolInfo,
  onSyncToStep1,
  onSyncToFinance,
}: ProcurementGroceryModalProps) {
  const [currentStudentCount, setCurrentStudentCount] = useState<number>(studentCount);
  const [syncStep1Success, setSyncStep1Success] = useState<boolean>(false);
  const [syncFinanceSuccess, setSyncFinanceSuccess] = useState<boolean>(false);

  // Calculate grocery list based on breakdowns
  const groceryData = useMemo(() => {
    if (!menuItem || !menuItem.recipeBreakdowns || menuItem.recipeBreakdowns.length === 0) {
      return null;
    }
    return generateProcurementGroceryList(menuItem.recipeBreakdowns, currentStudentCount);
  }, [menuItem, currentStudentCount]);

  if (!isOpen || !menuItem) return null;

  // Split items into fresh and dry
  const freshItems = groceryData?.groceryItems.filter((i) => i.type === 'tuoi_song') || [];
  const dryItems = groceryData?.groceryItems.filter((i) => i.type === 'kho') || [];

  // 1-Click Sync to Step 1 Inspection Record
  const handleSyncToStep1Inspection = () => {
    if (!groceryData || !onSyncToStep1) return;

    const todayDate = new Date().toISOString().split('T')[0];
    const inspectorName = schoolInfo?.inspectorName || schoolInfo?.medicalStaffName || 'Cán bộ Y tế';
    const receiverName = schoolInfo?.receiverName || schoolInfo?.headChefName || 'Bếp trưởng';

    const newRecords: Step1Record[] = groceryData.groceryItems.map((item, idx) => {
      let cat: Step1Record['category'] = 'Thịt cá tươi sống';
      if (item.category === 'Rau củ quả nấm') cat = 'Rau củ quả';
      else if (item.category === 'Gạo & ngũ cốc') cat = 'Gạo & ngũ cốc';
      else if (item.category === 'Sữa & chế phẩm') cat = 'Sữa & chế phẩm';
      else if (item.category === 'Gia vị & dầu mỡ') cat = 'Gia vị khô';

      return {
        id: `step1-sync-${Date.now()}-${idx}`,
        date: todayDate,
        time: item.type === 'tuoi_song' ? '06:30' : '07:00',
        foodName: item.ingredientName,
        category: cat,
        quantity: `${item.totalRawKg} ${item.unit}`,
        sensoryQuality: 'Đạt (tươi mới, không mùi lạ)',
        supplier: item.supplierName || schoolInfo?.meatSupplierName || 'Vựa thực phẩm sạch địa phương',
        expiryOrCertificate: 'Đầy đủ hóa đơn & giấy kiểm dịch ATTP',
        deliverer: schoolInfo?.meatDelivererName || 'Nhà cung cấp',
        inspector: inspectorName,
        result: 'Đạt nhập kho',
        notes: `Phục vụ ${menuItem.dayOfWeek} (${menuItem.ageGroup}) - Dùng cho: ${item.dishesUsedIn.join(', ')}`,
      };
    });

    onSyncToStep1(newRecords);
    setSyncStep1Success(true);
    setTimeout(() => setSyncStep1Success(false), 4000);
  };

  // 1-Click Sync to Finance Transaction (Chi tiền chợ)
  const handleSyncToFinanceTransaction = () => {
    if (!groceryData || !onSyncToFinance) return;

    const todayDate = new Date().toISOString().split('T')[0];
    const newTx: FinanceTransaction = {
      id: `tx-market-${Date.now()}`,
      date: todayDate,
      type: 'chi',
      category: 'Tiền chợ & Thực phẩm bán trú',
      amount: groceryData.grandTotalCost,
      payerOrReceiver: schoolInfo?.meatSupplierName || 'Vựa thực phẩm sạch & Nhà cung cấp chợ',
      method: 'Tiền mặt',
      receiptNumber: `PC-CHO-${todayDate.replace(/-/g, '')}`,
      notes: `Chi tiền mua thực phẩm ${menuItem.dayOfWeek} cho ${currentStudentCount} học sinh (${menuItem.ageGroup})`,
      isAutomaticSync: true,
    };

    onSyncToFinance(newTx);
    setSyncFinanceSuccess(true);
    setTimeout(() => setSyncFinanceSuccess(false), 4000);
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <ShoppingCart className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Bảng Kê Mua Hàng &amp; Sổ Đi Chợ Sáng Sớm</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-200 text-xs font-semibold">
                  {menuItem.dayOfWeek} • Tuần {menuItem.weekNumber}
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Tự động tổng hợp số kg thực phẩm cần mua sáng sớm từ các món ăn trong ngày
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Phiếu Đi Chợ</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Toolbar & Student Count Slider */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Sĩ số trẻ ăn bán trú:
            </span>
            <div className="inline-flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="500"
                value={currentStudentCount}
                onChange={(e) => setCurrentStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-2 py-1 text-center font-bold text-sm bg-white border border-emerald-400 rounded-lg text-emerald-950 focus:outline-emerald-600"
              />
              <span className="text-xs text-slate-500 font-medium">cháu</span>
            </div>
          </div>

          {/* Quick 1-Click Sync Buttons */}
          <div className="flex items-center gap-2">
            {onSyncToStep1 && (
              <button
                type="button"
                onClick={handleSyncToStep1Inspection}
                disabled={!groceryData || groceryData.groceryItems.length === 0}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>{syncStep1Success ? '✓ Đã đồng bộ Bước 1' : '1-Chạm Đồng Bộ Sổ Bước 1'}</span>
              </button>
            )}

            {onSyncToFinance && (
              <button
                type="button"
                onClick={handleSyncToFinanceTransaction}
                disabled={!groceryData || groceryData.grandTotalCost === 0}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>{syncFinanceSuccess ? '✓ Đã tạo Phiếu Chi' : '1-Chạm Tạo Phiếu Chi Tiền Chợ'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Success Banners */}
        {syncStep1Success && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-200 text-blue-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Đã tự động thêm toàn bộ nguyên liệu vào <strong>Sổ Kiểm thực Bước 1 (Giao nhận sáng sớm)</strong>!</span>
          </div>
        )}

        {syncFinanceSuccess && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã tự động tạo <strong>Phiếu Chi Tiền Chợ ({groceryData?.grandTotalCost.toLocaleString()} đ)</strong> vào Sổ Quỹ Thu Chi!</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-100 print:bg-white print:p-0">
          {!groceryData || groceryData.groceryItems.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Chưa có dữ liệu bóc tách nguyên liệu</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Hãy mở <strong>&quot;Bóc Tách &amp; Quản Trị Món Ăn (BOM)&quot;</strong> và bấm <strong>&quot;AI Bóc Tách Toàn Ngày&quot;</strong> để tự động sinh danh sách đi chợ.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Financial KPI Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden">
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
                  <span className="text-xs font-bold text-emerald-700 uppercase block">Tổng Tiền Chợ Ngày</span>
                  <span className="text-xl font-black text-emerald-950">
                    {groceryData.grandTotalCost.toLocaleString()} đ
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Cho {currentStudentCount} học sinh</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-teal-200 shadow-xs">
                  <span className="text-xs font-bold text-teal-700 uppercase block">Bình Quân Tiền Ăn / Trẻ</span>
                  <span className="text-xl font-black text-teal-950">
                    {groceryData.averageCostPerStudent.toLocaleString()} đ
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Chuẩn mức ăn mầm non</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                  <span className="text-xs font-bold text-amber-700 uppercase block">Tổng Mặt Hàng Cần Mua</span>
                  <span className="text-xl font-black text-amber-950">
                    {groceryData.groceryItems.length} loại thực phẩm
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {freshItems.length} tươi sống • {dryItems.length} hàng khô/gia vị
                  </span>
                </div>
              </div>

              {/* Printable Table Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
                {/* Print Title Header */}
                <div className="hidden print:block p-6 text-center border-b border-slate-200">
                  <h1 className="text-lg font-bold uppercase">{schoolInfo?.name || 'TRƯỜNG MẦM NON HOA SEN'}</h1>
                  <h2 className="text-base font-bold uppercase mt-1">BẢNG KÊ MUA HÀNG &amp; TIỀN CHỢ SÁNG SỚM</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Ngày áp dụng: {menuItem.dayOfWeek} (Tuần {menuItem.weekNumber}) • Sĩ số: {currentStudentCount} học sinh • Độ tuổi: {menuItem.ageGroup}
                  </p>
                </div>

                {/* Section I: Fresh Foods */}
                {freshItems.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
                        I. Thực Phẩm Tươi Sống (Giao sáng sớm 06:00 - 06:30)
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <th className="py-2 px-3 border border-slate-200 text-center w-10">STT</th>
                            <th className="py-2 px-3 border border-slate-200">Tên Thực Phẩm</th>
                            <th className="py-2 px-3 border border-slate-200">Phân Nhóm</th>
                            <th className="py-2 px-3 border border-slate-200 text-center">Số Lượng Mua</th>
                            <th className="py-2 px-3 border border-slate-200 text-right">Đơn Giá (VNĐ)</th>
                            <th className="py-2 px-3 border border-slate-200 text-right">Thành Tiền (VNĐ)</th>
                            <th className="py-2 px-3 border border-slate-200">Nhà Cung Cấp</th>
                            <th className="py-2 px-3 border border-slate-200">Dùng Cho Món</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {freshItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 border border-slate-200 text-center font-medium text-slate-500">{idx + 1}</td>
                              <td className="py-2 px-3 border border-slate-200 font-bold text-slate-800">{item.ingredientName}</td>
                              <td className="py-2 px-3 border border-slate-200 text-slate-600">{item.category}</td>
                              <td className="py-2 px-3 border border-slate-200 text-center font-bold text-emerald-700">
                                {item.totalRawKg} {item.unit}
                              </td>
                              <td className="py-2 px-3 border border-slate-200 text-right text-slate-700">{item.pricePerKg.toLocaleString()} đ</td>
                              <td className="py-2 px-3 border border-slate-200 text-right font-bold text-slate-900">{item.totalAmount.toLocaleString()} đ</td>
                              <td className="py-2 px-3 border border-slate-200 text-slate-600">{item.supplierName}</td>
                              <td className="py-2 px-3 border border-slate-200 text-slate-500 italic text-[11px]">{item.dishesUsedIn.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Section II: Dry Foods & Spices */}
                {dryItems.length > 0 && (
                  <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
                        II. Thực Phẩm Khô, Gạo, Gia Vị &amp; Sữa
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse border border-slate-200">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <th className="py-2 px-3 border border-slate-200 text-center w-10">STT</th>
                            <th className="py-2 px-3 border border-slate-200">Tên Thực Phẩm</th>
                            <th className="py-2 px-3 border border-slate-200">Phân Nhóm</th>
                            <th className="py-2 px-3 border border-slate-200 text-center">Số Lượng Mua</th>
                            <th className="py-2 px-3 border border-slate-200 text-right">Đơn Giá (VNĐ)</th>
                            <th className="py-2 px-3 border border-slate-200 text-right">Thành Tiền (VNĐ)</th>
                            <th className="py-2 px-3 border border-slate-200">Nhà Cung Cấp</th>
                            <th className="py-2 px-3 border border-slate-200">Dùng Cho Món</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dryItems.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 border border-slate-200 text-center font-medium text-slate-500">{idx + 1}</td>
                              <td className="py-2 px-3 border border-slate-200 font-bold text-slate-800">{item.ingredientName}</td>
                              <td className="py-2 px-3 border border-slate-200 text-slate-600">{item.category}</td>
                              <td className="py-2 px-3 border border-slate-200 text-center font-bold text-amber-700">
                                {item.totalRawKg} {item.unit}
                              </td>
                              <td className="py-2 px-3 border border-slate-200 text-right text-slate-700">{item.pricePerKg.toLocaleString()} đ</td>
                              <td className="py-2 px-3 border border-slate-200 text-right font-bold text-slate-900">{item.totalAmount.toLocaleString()} đ</td>
                              <td className="py-2 px-3 border border-slate-200 text-slate-600">{item.supplierName}</td>
                              <td className="py-2 px-3 border border-slate-200 text-slate-500 italic text-[11px]">{item.dishesUsedIn.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Total Cost Summary in Table */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Tổng cộng chi phí tiền chợ cả ngày ({currentStudentCount} học sinh):
                  </span>
                  <span className="text-base font-black text-emerald-800">
                    {groceryData.grandTotalCost.toLocaleString()} VNĐ
                  </span>
                </div>

                {/* Print Signature Footer */}
                <div className="hidden print:grid grid-cols-3 gap-6 p-8 text-center text-xs mt-6">
                  <div>
                    <p className="font-bold">NGƯỜI ĐI CHỢ / CẤP DƯỠNG</p>
                    <p className="text-[10px] text-slate-500 italic">(Ký và ghi rõ họ tên)</p>
                    <div className="h-16"></div>
                    <p className="font-semibold">{schoolInfo?.receiverName || 'Lê Văn Tài'}</p>
                  </div>
                  <div>
                    <p className="font-bold">KẾ TOÁN BÁN TRÚ</p>
                    <p className="text-[10px] text-slate-500 italic">(Ký và ghi rõ họ tên)</p>
                    <div className="h-16"></div>
                    <p className="font-semibold">{schoolInfo?.accountantName || 'Đỗ Thị Thanh'}</p>
                  </div>
                  <div>
                    <p className="font-bold">HIỆU TRƯỞNG / DUYỆT CHI</p>
                    <p className="text-[10px] text-slate-500 italic">(Ký và đóng dấu)</p>
                    <div className="h-16"></div>
                    <p className="font-semibold">{schoolInfo?.principalName || 'NGUYỄN THỊ MAI HOA'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            * Bảng kê tự động đồng bộ sang hồ sơ thanh tra ATTP và kế toán bán trú.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
