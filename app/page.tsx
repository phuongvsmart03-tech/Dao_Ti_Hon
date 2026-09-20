'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import {
  ModuleId,
  SchoolInfo,
  Step1Record,
  Step2Record,
  Step3Record,
  MenuItem,
  SampleDisposalRecord,
  StudentRecord,
  HealthRecord,
  StaffRecord,
  LessonPlan,
} from '@/types/preschool';

import {
  getStoredPin,
  savePin,
  getStoredSession,
  setStoredSession,
  getSchoolInfo,
  saveSchoolInfo,
  moduleStorage,
  exportToCsv,
} from '@/lib/storage';

import {
  initialSchoolInfo,
  initialStep1Records,
  initialStep2Records,
  initialStep3Records,
  initialMenuItems,
  initialSampleDisposalRecords,
  initialStudents,
  initialHealthRecords,
  initialStaffRecords,
  initialLessonPlans,
  initialSalaries,
  initialTransactions,
} from '@/lib/mock-data';

import AuthScreen from '@/components/AuthScreen';
import Header from '@/components/Header';
import Sidebar, { MODULE_ITEMS } from '@/components/Sidebar';
import SchoolConfigModal from '@/components/SchoolConfigModal';
import ChangePinModal from '@/components/ChangePinModal';
import AdministrativeReportModal from '@/components/AdministrativeReportModal';
import LogoSelectModal from '@/components/LogoSelectModal';
import TursoSyncModal from '@/components/TursoSyncModal';
import AiPreschoolModal from '@/components/AiPreschoolModal';

// Modules
import LightningModule from '@/components/modules/LightningModule';
import FinanceSalaryModule from '@/components/modules/FinanceSalaryModule';
import Step1Inspection from '@/components/modules/Step1Inspection';
import Step2Cooking from '@/components/modules/Step2Cooking';
import Step3Tasting from '@/components/modules/Step3Tasting';
import MenuManagement from '@/components/modules/MenuManagement';
import SampleDisposal from '@/components/modules/SampleDisposal';
import StudentManagement from '@/components/modules/StudentManagement';
import HealthRecords from '@/components/modules/HealthRecords';
import StaffManagement from '@/components/modules/StaffManagement';
import LessonPlans from '@/components/modules/LessonPlans';
import SettingsTab from '@/components/modules/SettingsTab';
import HistoryAuditTab from '@/components/modules/HistoryAuditTab';
import { TeacherSalaryRecord, FinanceTransaction, AuditLogRecord } from '@/types/preschool';

export default function MainPage() {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return getStoredSession();
  });
  const [activeModuleId, setActiveModuleId] = useState<ModuleId>('lightning');
  const activeModuleConfig = useMemo(() => {
    return MODULE_ITEMS.find((item) => item.id === activeModuleId) || MODULE_ITEMS[0];
  }, [activeModuleId]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('preschool_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const handleToggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('preschool_sidebar_collapsed', String(next));
      }
      return next;
    });
  }, []);

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSidebarCollapse]);

  // Modals state
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isTursoModalOpen, setIsTursoModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isTursoConnected, setIsTursoConnected] = useState(false);
  const [currentPin, setCurrentPin] = useState<string>(() => getStoredPin());

  // School Information state
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => getSchoolInfo());

  // Data states for all 9 modules
  const [step1Data, setStep1Data] = useState<Step1Record[]>(() => moduleStorage.getStep1());
  const [step2Data, setStep2Data] = useState<Step2Record[]>(() => moduleStorage.getStep2());
  const [step3Data, setStep3Data] = useState<Step3Record[]>(() => moduleStorage.getStep3());
  const [menuData, setMenuData] = useState<MenuItem[]>(() => moduleStorage.getMenu());
  const [samplesData, setSamplesData] = useState<SampleDisposalRecord[]>(() => moduleStorage.getSamples());
  const [studentsData, setStudentsData] = useState<StudentRecord[]>(() => moduleStorage.getStudents());
  const [healthData, setHealthData] = useState<HealthRecord[]>(() => moduleStorage.getHealth());
  const [staffData, setStaffData] = useState<StaffRecord[]>(() => moduleStorage.getStaff());
  const [lessonsData, setLessonsData] = useState<LessonPlan[]>(() => moduleStorage.getLessons());
  const [salariesData, setSalariesData] = useState<TeacherSalaryRecord[]>(() => moduleStorage.getSalaries());
  const [transactionsData, setTransactionsData] = useState<FinanceTransaction[]>(() => moduleStorage.getTransactions());
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(() => moduleStorage.getAuditLogs());
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Quick Save & Sync to Turso Cloud handler with green success confirmation
  const handleQuickSaveAndSync = async () => {
    setIsSavingCloud(true);
    try {
      showToast('⏳ Đang lưu dữ liệu và đồng bộ lên đám mây Turso...', 'info');
      await handleSyncToCloud();
      moduleStorage.addAuditLog({
        action: 'sync',
        actionLabel: 'Đồng bộ',
        module: activeModuleId,
        moduleName: activeModuleConfig.label,
        description: `Đồng bộ toàn bộ cơ sở dữ liệu lên đám mây Turso Cloud`,
        canUndo: false,
      });
      setAuditLogs(moduleStorage.getAuditLogs());
      showToast('✅ Đã lưu dữ liệu và đồng bộ Turso Cloud thành công!', 'success');
    } catch (err: any) {
      showToast('⚠️ Đã lưu vào bộ nhớ máy (Offline). Đám mây: ' + (err?.message || 'Không có kết nối'), 'info');
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleRestoreAuditLog = (log: AuditLogRecord) => {
    if (log.previousData) {
      try {
        const item = log.previousData;
        if (log.module === 'menu') {
          const updated = [...menuData];
          const idx = updated.findIndex((m) => m.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setMenuData(updated);
          moduleStorage.saveMenu(updated);
        } else if (log.module === 'step1') {
          const updated = [...step1Data];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setStep1Data(updated);
          moduleStorage.saveStep1(updated);
        } else if (log.module === 'step2') {
          const updated = [...step2Data];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setStep2Data(updated);
          moduleStorage.saveStep2(updated);
        } else if (log.module === 'step3') {
          const updated = [...step3Data];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setStep3Data(updated);
          moduleStorage.saveStep3(updated);
        } else if (log.module === 'samples') {
          const updated = [...samplesData];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setSamplesData(updated);
          moduleStorage.saveSamples(updated);
        } else if (log.module === 'students') {
          const updated = [...studentsData];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setStudentsData(updated);
          moduleStorage.saveStudents(updated);
        } else if (log.module === 'health') {
          const updated = [...healthData];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setHealthData(updated);
          moduleStorage.saveHealth(updated);
        } else if (log.module === 'staff') {
          const updated = [...staffData];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setStaffData(updated);
          moduleStorage.saveStaff(updated);
        } else if (log.module === 'lessonPlans') {
          const updated = [...lessonsData];
          const idx = updated.findIndex((s) => s.id === item.id);
          if (idx >= 0) updated[idx] = item;
          else updated.unshift(item);
          setLessonsData(updated);
          moduleStorage.saveLessons(updated);
        }
        moduleStorage.addAuditLog({
          action: 'restore',
          actionLabel: 'Khôi phục',
          module: log.module,
          moduleName: log.moduleName,
          description: `Khôi phục thành công bản ghi: ${log.description}`,
          targetId: log.targetId,
        });
        setAuditLogs(moduleStorage.getAuditLogs());
        showToast(`Đã khôi phục thành công: ${log.description}`, 'success');
      } catch (e: any) {
        showToast(`Không thể khôi phục bản ghi: ${e.message}`, 'error');
      }
    } else {
      showToast(`Bản ghi này không có bản sao lưu trước đó để khôi phục tự động.`, 'info');
    }
  };

  const handleClearAuditLogs = () => {
    moduleStorage.clearAuditLogs();
    setAuditLogs([]);
    showToast('Đã dọn dẹp toàn bộ lịch sử thao tác.', 'info');
  };

  const handleSeedSampleAuditLogs = () => {
    const sampleLogs: Omit<AuditLogRecord, 'id' | 'timestamp' | 'displayTime'>[] = [
      {
        action: 'sync',
        actionLabel: 'Đồng bộ',
        module: 'menu',
        moduleName: 'Thực đơn & Dinh dưỡng',
        description: 'Đồng bộ cơ sở dữ liệu dinh dưỡng lên Turso Cloud',
        canUndo: false,
      },
      {
        action: 'update',
        actionLabel: 'Cập nhật',
        module: 'menu',
        moduleName: 'Thực đơn & Dinh dưỡng',
        description: 'Điều chỉnh lượng Kcal và định mức món Canh cua rau mồng tơi',
        canUndo: true,
      },
      {
        action: 'create',
        actionLabel: 'Thêm mới',
        module: 'step1',
        moduleName: 'Kiểm thực Bước 1 (Giao nhận)',
        description: 'Tiếp nhận nguồn thực phẩm tươi: Thịt bò phi lê tươi 12.5 kg',
        canUndo: true,
      },
      {
        action: 'create',
        actionLabel: 'Thêm mới',
        module: 'samples',
        moduleName: 'Lưu & Hủy mẫu',
        description: 'Lưu niêm phong mẫu 24h thức ăn Bữa Trưa (tủ lạnh 3°C)',
        canUndo: true,
      },
      {
        action: 'update',
        actionLabel: 'Cập nhật',
        module: 'settings',
        moduleName: 'Cài đặt hệ thống',
        description: 'Cập nhật chữ ký số tự động cho Bác sĩ Y tế Trần Thị Thu Hà',
        canUndo: false,
      },
    ];
    for (const s of sampleLogs) {
      moduleStorage.addAuditLog(s);
    }
    setAuditLogs(moduleStorage.getAuditLogs());
    showToast('Đã nạp mẫu lịch sử thao tác thành công!', 'success');
  };

  // Check Turso connection on mount
  useEffect(() => {
    fetch('/api/turso')
      .then((res) => res.json())
      .then((data) => {
        if (data.connected) {
          setIsTursoConnected(true);
        }
      })
      .catch(() => {
        setIsTursoConnected(false);
      });
  }, []);

  // Handlers for Turso sync
  const handleSyncToCloud = async () => {
    // 1. Sync school info
    await fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_school_info', payload: schoolInfo }),
    });

    // 2. Sync all modules
    const modulesToSync = [
      { moduleId: 'step1', items: step1Data },
      { moduleId: 'step2', items: step2Data },
      { moduleId: 'step3', items: step3Data },
      { moduleId: 'menu', items: menuData },
      { moduleId: 'samples', items: samplesData },
      { moduleId: 'students', items: studentsData },
      { moduleId: 'health', items: healthData },
      { moduleId: 'staff', items: staffData },
      { moduleId: 'lessonPlans', items: lessonsData },
      { moduleId: 'salaries', items: salariesData },
      { moduleId: 'finance', items: transactionsData },
    ];

    for (const mod of modulesToSync) {
      await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_module', payload: mod }),
      });
    }
  };

  const handlePullFromCloud = async () => {
    const res = await fetch('/api/turso');
    const result = await res.json();
    if (!result.connected || !result.data) {
      throw new Error(result.error || 'Không kết nối được với Turso');
    }

    const { data } = result;
    if (data.schoolInfo) {
      setSchoolInfo(data.schoolInfo);
      saveSchoolInfo(data.schoolInfo);
    }
    if (data.step1 && data.step1.length > 0) {
      setStep1Data(data.step1);
      moduleStorage.saveStep1(data.step1);
    }
    if (data.step2 && data.step2.length > 0) {
      setStep2Data(data.step2);
      moduleStorage.saveStep2(data.step2);
    }
    if (data.step3 && data.step3.length > 0) {
      setStep3Data(data.step3);
      moduleStorage.saveStep3(data.step3);
    }
    if (data.menu && data.menu.length > 0) {
      setMenuData(data.menu);
      moduleStorage.saveMenu(data.menu);
    }
    if (data.samples && data.samples.length > 0) {
      setSamplesData(data.samples);
      moduleStorage.saveSamples(data.samples);
    }
    if (data.students && data.students.length > 0) {
      setStudentsData(data.students);
      moduleStorage.saveStudents(data.students);
    }
    if (data.health && data.health.length > 0) {
      setHealthData(data.health);
      moduleStorage.saveHealth(data.health);
    }
    if (data.staff && data.staff.length > 0) {
      setStaffData(data.staff);
      moduleStorage.saveStaff(data.staff);
    }
    if (data.lessons && data.lessons.length > 0) {
      setLessonsData(data.lessons);
      moduleStorage.saveLessons(data.lessons);
    }
    if (data.salaries && data.salaries.length > 0) {
      setSalariesData(data.salaries);
      moduleStorage.saveSalaries(data.salaries);
    }
    if (data.transactions && data.transactions.length > 0) {
      setTransactionsData(data.transactions);
      moduleStorage.saveTransactions(data.transactions);
    }
  };

  // Handler to seed all initial test data across all 9 modules
  const handleSeedAllData = async () => {
    moduleStorage.seedAllDefault();
    setSchoolInfo(initialSchoolInfo);
    setStep1Data(initialStep1Records);
    setStep2Data(initialStep2Records);
    setStep3Data(initialStep3Records);
    setMenuData(initialMenuItems);
    setSamplesData(initialSampleDisposalRecords);
    setStudentsData(initialStudents);
    setHealthData(initialHealthRecords);
    setStaffData(initialStaffRecords);
    setLessonsData(initialLessonPlans);
    setSalariesData(initialSalaries);
    setTransactionsData(initialTransactions);

    if (isTursoConnected) {
      const snap = moduleStorage.getAllSnapshot();
      await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore_full_snapshot', snapshot: snap }),
      });
    }
  };

  // Handler to reset/clear all module records
  const handleResetAllData = async () => {
    moduleStorage.clearAllData();
    setStep1Data([]);
    setStep2Data([]);
    setStep3Data([]);
    setMenuData([]);
    setSamplesData([]);
    setStudentsData([]);
    setHealthData([]);
    setStaffData([]);
    setLessonsData([]);
    setSalariesData([]);
    setTransactionsData([]);

    if (isTursoConnected) {
      await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all_data' }),
      });
    }
  };

  // Handler to create & download JSON backup snapshot
  const handleBackupSnapshot = () => {
    const snapshot = moduleStorage.getAllSnapshot();
    const dateStr = new Date().toISOString().slice(0, 10);
    const cleanSchoolName = (schoolInfo.name || 'MamNon')
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_')
      .slice(0, 30);
    const filename = `SaoLuu_${cleanSchoolName}_${dateStr}.json`;

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handler to restore full snapshot
  const handleRestoreSnapshot = async (snapshot: any) => {
    const ok = moduleStorage.restoreSnapshot(snapshot);
    if (!ok) throw new Error('Cấu trúc file sao lưu JSON không hợp lệ.');

    if (snapshot.schoolInfo) setSchoolInfo(snapshot.schoolInfo);
    if (Array.isArray(snapshot.step1)) setStep1Data(snapshot.step1);
    if (Array.isArray(snapshot.step2)) setStep2Data(snapshot.step2);
    if (Array.isArray(snapshot.step3)) setStep3Data(snapshot.step3);
    if (Array.isArray(snapshot.menu)) setMenuData(snapshot.menu);
    if (Array.isArray(snapshot.samples)) setSamplesData(snapshot.samples);
    if (Array.isArray(snapshot.students)) setStudentsData(snapshot.students);
    if (Array.isArray(snapshot.health)) setHealthData(snapshot.health);
    if (Array.isArray(snapshot.staff)) setStaffData(snapshot.staff);
    if (Array.isArray(snapshot.lessons)) setLessonsData(snapshot.lessons);
    if (Array.isArray(snapshot.salaries)) setSalariesData(snapshot.salaries);
    if (Array.isArray(snapshot.transactions)) setTransactionsData(snapshot.transactions);

    if (isTursoConnected) {
      await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore_full_snapshot', snapshot }),
      });
    }
  };

  // Handlers for Authentication
  const handleAuthenticated = () => {
    setStoredSession(true);
    setIsAuthenticated(true);
  };

  const handleLock = () => {
    setStoredSession(false);
    setIsAuthenticated(false);
  };

  // Handlers for School Info update
  const handleSaveSchoolInfo = (info: SchoolInfo, autoCascade: boolean = true) => {
    const updatedInfo: SchoolInfo = {
      ...info,
      medicalStaffName: info.inspectorName || info.medicalStaffName,
      headChefName: info.receiverName || info.headChefName,
      principalName: info.principalName || schoolInfo.principalName || 'NGUYỄN THỊ MAI HOA',
    };

    setSchoolInfo(updatedInfo);
    saveSchoolInfo(updatedInfo);

    if (autoCascade) {
      const inspector = updatedInfo.inspectorName || updatedInfo.medicalStaffName || 'Cán bộ Y tế';
      const receiver = updatedInfo.receiverName || updatedInfo.headChefName || 'Bếp trưởng';
      const sampleKeeper = updatedInfo.sampleKeeperName || updatedInfo.inspectorName || updatedInfo.medicalStaffName || 'Cán bộ Y tế';
      const sampleDisposer = updatedInfo.sampleDisposerName || updatedInfo.receiverName || updatedInfo.headChefName || 'Bếp trưởng';

      // 1. Tự động đồng bộ Bước 1 (Người kiểm tra & Nhà cung cấp)
      setStep1Data((prev) => {
        const updated = prev.map((r) => {
          let updatedSupplier = r.supplier;
          let updatedDeliverer = r.deliverer;

          if (r.category === 'Thịt cá tươi sống') {
            if (updatedInfo.meatSupplierName) updatedSupplier = updatedInfo.meatSupplierName;
            if (updatedInfo.meatDelivererName) updatedDeliverer = updatedInfo.meatDelivererName;
          } else if (r.category === 'Rau củ quả') {
            if (updatedInfo.vegSupplierName) updatedSupplier = updatedInfo.vegSupplierName;
            if (updatedInfo.vegDelivererName) updatedDeliverer = updatedInfo.vegDelivererName;
          } else if (r.category === 'Gia vị khô' || r.category === 'Gạo & ngũ cốc' || r.category === 'Sữa & chế phẩm') {
            if (updatedInfo.drySupplierName) updatedSupplier = updatedInfo.drySupplierName;
            if (updatedInfo.dryDelivererName) updatedDeliverer = updatedInfo.dryDelivererName;
          }

          return {
            ...r,
            inspector: inspector,
            supplier: updatedSupplier,
            deliverer: updatedDeliverer,
          };
        });
        moduleStorage.saveStep1(updated);
        return updated;
      });

      // 2. Tự động đồng bộ Bước 2 (Chế biến: Bếp trưởng & Người giám sát)
      setStep2Data((prev) => {
        const updated = prev.map((r) => ({
          ...r,
          chef: receiver,
          supervisor: inspector,
        }));
        moduleStorage.saveStep2(updated);
        return updated;
      });

      // 3. Tự động đồng bộ Bước 3 (Người thử nếm & Người niêm phong lưu mẫu)
      setStep3Data((prev) => {
        const updated = prev.map((r) => ({
          ...r,
          taster: inspector,
          keeper: sampleKeeper,
        }));
        moduleStorage.saveStep3(updated);
        return updated;
      });

      // 4. Tự động đồng bộ Sổ lưu hủy mẫu 24h (Người lưu mẫu & Người hủy mẫu)
      setSamplesData((prev) => {
        const updated = prev.map((r) => ({
          ...r,
          samplerName: sampleKeeper,
          witnessName: sampleDisposer,
        }));
        moduleStorage.saveSamples(updated);
        return updated;
      });
    }
  };

  // Handler for Logo update
  const handleSaveLogo = (logoUrl: string) => {
    const updated = { ...schoolInfo, logoUrl };
    setSchoolInfo(updated);
    saveSchoolInfo(updated);
  };

  // Handler for PIN update
  const handleUpdatePin = (newPin: string) => {
    savePin(newPin);
    setCurrentPin(newPin);
  };

  // CRUD Handlers for Step 1
  const handleSaveStep1 = (record: Step1Record) => {
    const exists = step1Data.some((r) => r.id === record.id);
    const updated = exists
      ? step1Data.map((r) => (r.id === record.id ? record : r))
      : [record, ...step1Data];
    setStep1Data(updated);
    moduleStorage.saveStep1(updated);
  };

  const handleDeleteStep1 = (id: string) => {
    const updated = step1Data.filter((r) => r.id !== id);
    setStep1Data(updated);
    moduleStorage.saveStep1(updated);
  };

  // CRUD Handlers for Step 2
  const handleSaveStep2 = (record: Step2Record) => {
    const exists = step2Data.some((r) => r.id === record.id);
    const updated = exists
      ? step2Data.map((r) => (r.id === record.id ? record : r))
      : [record, ...step2Data];
    setStep2Data(updated);
    moduleStorage.saveStep2(updated);
  };

  const handleDeleteStep2 = (id: string) => {
    const updated = step2Data.filter((r) => r.id !== id);
    setStep2Data(updated);
    moduleStorage.saveStep2(updated);
  };

  // CRUD Handlers for Step 3
  const handleSaveStep3 = (record: Step3Record) => {
    const exists = step3Data.some((r) => r.id === record.id);
    const updated = exists
      ? step3Data.map((r) => (r.id === record.id ? record : r))
      : [record, ...step3Data];
    setStep3Data(updated);
    moduleStorage.saveStep3(updated);
  };

  const handleDeleteStep3 = (id: string) => {
    const updated = step3Data.filter((r) => r.id !== id);
    setStep3Data(updated);
    moduleStorage.saveStep3(updated);
  };

  // CRUD Handlers for Menu
  const handleSaveMenu = (item: MenuItem) => {
    const exists = menuData.some((r) => r.id === item.id);
    const updated = exists
      ? menuData.map((r) => (r.id === item.id ? item : r))
      : [item, ...menuData];
    setMenuData(updated);
    moduleStorage.saveMenu(updated);
  };

  const handleDeleteMenu = (id: string) => {
    const updated = menuData.filter((r) => r.id !== id);
    setMenuData(updated);
    moduleStorage.saveMenu(updated);
  };

  // CRUD Handlers for Samples
  const handleSaveSamples = (record: SampleDisposalRecord) => {
    const exists = samplesData.some((r) => r.id === record.id);
    const updated = exists
      ? samplesData.map((r) => (r.id === record.id ? record : r))
      : [record, ...samplesData];
    setSamplesData(updated);
    moduleStorage.saveSamples(updated);
  };

  const handleDeleteSamples = (id: string) => {
    const updated = samplesData.filter((r) => r.id !== id);
    setSamplesData(updated);
    moduleStorage.saveSamples(updated);
  };

  // CRUD Handlers for Students
  const handleSaveStudents = (record: StudentRecord) => {
    const exists = studentsData.some((r) => r.id === record.id);
    const updated = exists
      ? studentsData.map((r) => (r.id === record.id ? record : r))
      : [record, ...studentsData];
    setStudentsData(updated);
    moduleStorage.saveStudents(updated);
  };

  const handleDeleteStudents = (id: string) => {
    const updated = studentsData.filter((r) => r.id !== id);
    setStudentsData(updated);
    moduleStorage.saveStudents(updated);
  };

  // CRUD Handlers for Health
  const handleSaveHealth = (record: HealthRecord) => {
    const exists = healthData.some((r) => r.id === record.id);
    const updated = exists
      ? healthData.map((r) => (r.id === record.id ? record : r))
      : [record, ...healthData];
    setHealthData(updated);
    moduleStorage.saveHealth(updated);
  };

  const handleDeleteHealth = (id: string) => {
    const updated = healthData.filter((r) => r.id !== id);
    setHealthData(updated);
    moduleStorage.saveHealth(updated);
  };

  // CRUD Handlers for Staff
  const handleSaveStaff = (record: StaffRecord) => {
    const exists = staffData.some((r) => r.id === record.id);
    const updated = exists
      ? staffData.map((r) => (r.id === record.id ? record : r))
      : [record, ...staffData];
    setStaffData(updated);
    moduleStorage.saveStaff(updated);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staffData.filter((r) => r.id !== id);
    setStaffData(updated);
    moduleStorage.saveStaff(updated);
  };

  // CRUD Handlers for Lesson Plans
  const handleSaveLessons = (plan: LessonPlan) => {
    const exists = lessonsData.some((r) => r.id === plan.id);
    const updated = exists
      ? lessonsData.map((r) => (r.id === plan.id ? plan : r))
      : [plan, ...lessonsData];
    setLessonsData(updated);
    moduleStorage.saveLessons(updated);
  };

  const handleDeleteLessons = (id: string) => {
    const updated = lessonsData.filter((r) => r.id !== id);
    setLessonsData(updated);
    moduleStorage.saveLessons(updated);
  };

  // CRUD Handlers for Teacher Salaries
  const handleSaveSalary = (salary: TeacherSalaryRecord) => {
    const exists = salariesData.some((r) => r.id === salary.id);
    const updated = exists
      ? salariesData.map((r) => (r.id === salary.id ? salary : r))
      : [salary, ...salariesData];
    setSalariesData(updated);
    moduleStorage.saveSalaries(updated);
  };

  const handleDeleteSalary = (id: string) => {
    const updated = salariesData.filter((r) => r.id !== id);
    setSalariesData(updated);
    moduleStorage.saveSalaries(updated);
  };

  // CRUD Handlers for Finance Transactions
  const handleSaveTransaction = (tx: FinanceTransaction) => {
    const exists = transactionsData.some((r) => r.id === tx.id);
    const updated = exists
      ? transactionsData.map((r) => (r.id === tx.id ? tx : r))
      : [tx, ...transactionsData];
    setTransactionsData(updated);
    moduleStorage.saveTransactions(updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactionsData.filter((r) => r.id !== id);
    setTransactionsData(updated);
    moduleStorage.saveTransactions(updated);
  };

  // Compute counts for sidebar badges
  const countsRecord = useMemo<Record<ModuleId, number>>(() => {
    return {
      lightning: 1,
      finance: transactionsData.length + salariesData.length,
      step1: step1Data.length,
      step2: step2Data.length,
      step3: step3Data.length,
      menu: menuData.length,
      samples: samplesData.length,
      students: studentsData.length,
      health: healthData.length,
      staff: staffData.length,
      lessonPlans: lessonsData.length,
      history: auditLogs.length,
      settings: 0,
    };
  }, [
    transactionsData,
    salariesData,
    step1Data,
    step2Data,
    step3Data,
    menuData,
    samplesData,
    studentsData,
    healthData,
    staffData,
    lessonsData,
    auditLogs,
  ]);

  // Current active data for printing / exporting
  const currentActiveData = useMemo(() => {
    switch (activeModuleId) {
      case 'step1':
        return step1Data;
      case 'step2':
        return step2Data;
      case 'step3':
        return step3Data;
      case 'menu':
        return menuData;
      case 'samples':
        return samplesData;
      case 'students':
        return studentsData;
      case 'health':
        return healthData;
      case 'staff':
        return staffData;
      case 'lessonPlans':
        return lessonsData;
      case 'finance':
        return transactionsData;
      case 'lightning':
        return step1Data;
      default:
        return [];
    }
  }, [
    activeModuleId,
    step1Data,
    step2Data,
    step3Data,
    menuData,
    samplesData,
    studentsData,
    healthData,
    staffData,
    lessonsData,
    transactionsData,
  ]);

  // CSV Export Handler
  const handleExportCsv = useCallback(() => {
    const dateStr = new Date().toISOString().split('T')[0];
    const prefix = `BaoCao_${activeModuleId.toUpperCase()}_${dateStr}`;

    switch (activeModuleId) {
      case 'lightning': {
        const headers = ['Ngày', 'Trạng thái', 'Hồ sơ', 'Ghi chú'];
        const rows = [[dateStr, 'Sẵn sàng', 'Bộ hồ sơ thanh tra cấp tốc', 'Xuất theo mẫu QĐ 1246/QĐ-BYT']];
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'step1': {
        const headers = [
          'STT',
          'Ngày',
          'Giờ',
          'Tên thực phẩm',
          'Phân loại',
          'Số lượng',
          'Cảm quan',
          'Nhà cung cấp',
          'Hạn dùng / Kiểm dịch',
          'Người giao',
          'Người nhận',
          'Kết luận',
          'Ghi chú',
        ];
        const rows = step1Data.map((r, i) => [
          i + 1,
          r.date,
          r.time,
          r.foodName,
          r.category,
          r.quantity,
          r.sensoryQuality,
          r.supplier,
          r.expiryOrCertificate,
          r.deliverer,
          r.inspector,
          r.result,
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'step2': {
        const headers = [
          'STT',
          'Ngày',
          'Bữa ăn',
          'Tên món ăn',
          'Giờ sơ chế',
          'Giờ nấu',
          'Nhiệt độ',
          'Tình trạng VSATTP',
          'Đầu bếp',
          'Giám sát',
          'Đánh giá',
          'Ghi chú',
        ];
        const rows = step2Data.map((r, i) => [
          i + 1,
          r.date,
          r.meal,
          r.dishName,
          r.prepTime,
          r.cookTime,
          r.cookingTemp,
          r.hygieneStatus,
          r.chef,
          r.supervisor,
          r.result,
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'step3': {
        const headers = [
          'STT',
          'Ngày',
          'Giờ',
          'Bữa ăn',
          'Tên món ăn',
          'Đánh giá cảm quan',
          'Nhiệt độ chia ăn',
          'Khối lượng mẫu',
          'Vị trí lưu mẫu',
          'Người thử nếm',
          'Người niêm phong lưu mẫu',
          'Kết luận',
          'Ghi chú',
        ];
        const rows = step3Data.map((r, i) => [
          i + 1,
          r.date,
          r.time,
          r.meal,
          r.dishName,
          r.sensoryEvaluation,
          r.servingTemp,
          r.sampleWeight,
          r.storageLocation,
          r.taster,
          r.keeper,
          r.result,
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'menu': {
        const headers = [
          'STT',
          'Thứ',
          'Nhóm tuổi',
          'Bữa sáng',
          'Phụ sáng',
          'Món chính trưa',
          'Canh trưa',
          'Cơm/Tinh bột',
          'Tráng miệng',
          'Bữa phụ xế chiều',
          'Năng lượng (Kcal)',
          'Tỷ lệ đạm',
          'Trạng thái phê duyệt',
          'Người duyệt',
          'Ghi chú',
        ];
        const rows = menuData.map((r, i) => [
          i + 1,
          r.dayOfWeek,
          r.ageGroup,
          r.breakfast,
          r.snackMorning,
          r.lunchMain,
          r.lunchSoup,
          r.lunchStaple,
          r.lunchDessert,
          r.afternoonSnack,
          r.caloriesKcal,
          r.proteinRatio,
          r.status,
          r.approvedBy,
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'samples': {
        const headers = [
          'STT',
          'Ngày lấy mẫu',
          'Giờ lấy',
          'Bữa ăn',
          'Tên món ăn',
          'Khối lượng',
          'Dụng cụ',
          'Nhiệt độ tủ (°C)',
          'Ngày hủy mẫu (24h)',
          'Giờ hủy',
          'Tình trạng khi hủy',
          'Người lấy mẫu',
          'Người chứng kiến',
          'Trạng thái',
          'Ghi chú',
        ];
        const rows = samplesData.map((r, i) => [
          i + 1,
          r.dateSampled,
          r.timeSampled,
          r.meal,
          r.dishName,
          r.sampleWeight,
          r.containerType,
          r.storageTemp,
          r.disposalDate,
          r.disposalTime,
          r.conditionAtDisposal,
          r.samplerName,
          r.witnessName,
          r.status,
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'students': {
        const headers = [
          'STT',
          'Mã học sinh',
          'Họ và tên',
          'Ngày sinh',
          'Giới tính',
          'Lớp học',
          'Phụ huynh',
          'Số điện thoại',
          'Địa chỉ',
          'Điểm danh',
          'Dị ứng / Chế độ ăn riêng',
          'Ngày nhập học',
          'Ghi chú',
        ];
        const rows = studentsData.map((r, i) => [
          i + 1,
          r.studentCode,
          r.fullName,
          r.dob,
          r.gender,
          r.className,
          r.parentName,
          r.parentPhone,
          r.address,
          r.attendanceStatus,
          r.allergiesOrDiet,
          r.enrollmentDate,
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'health': {
        const headers = [
          'STT',
          'Họ và tên trẻ',
          'Lớp học',
          'Ngày kiểm tra',
          'Chiều cao (cm)',
          'Cân nặng (kg)',
          'Kênh dinh dưỡng',
          'Tiêm chủng',
          'Tình trạng sức khỏe',
          'Cán bộ khám',
          'Ghi chú',
        ];
        const rows = healthData.map((r, i) => [
          i + 1,
          r.studentName,
          r.className,
          r.checkDate,
          r.heightCm,
          r.weightKg,
          r.nutritionStatus,
          r.vaccinationStatus,
          r.generalHealth,
          r.doctorOrExaminer,
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'staff': {
        const headers = [
          'STT',
          'Mã cán bộ',
          'Họ và tên',
          'Giới tính',
          'Chức vụ',
          'Trình độ chuyên môn',
          'Phân công nhiệm vụ',
          'Số điện thoại',
          'Chứng nhận VSATTP',
          'Khám sức khỏe định kỳ',
          'Tình trạng công tác',
          'Ghi chú',
        ];
        const rows = staffData.map((r, i) => [
          i + 1,
          r.staffCode,
          r.fullName,
          r.gender || 'N/A',
          r.role,
          r.qualification,
          r.assignedClassOrDept || '',
          r.phone,
          r.hygieneCertDate || '',
          r.healthCheckDate || '',
          r.status || '',
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
      case 'lessonPlans': {
        const headers = [
          'STT',
          'Tên bài giảng / Kế hoạch',
          'Chủ đề',
          'Khối lớp',
          'Giáo viên soạn',
          'Tuần',
          'Thời gian thực hiện',
          'Lĩnh vực phát triển',
          'Trạng thái duyệt',
          'Người phê duyệt',
          'Ngày phê duyệt',
          'Ghi chú',
        ];
        const rows = lessonsData.map((r, i) => [
          i + 1,
          r.title || '',
          r.theme,
          r.targetClass || r.ageGroup || '',
          r.teacherName,
          r.weekNumber,
          r.dateRange || '',
          r.developmentField || '',
          r.approvalStatus,
          r.approverName,
          r.approvalDate || '',
          r.notes || '',
        ]);
        exportToCsv(prefix, headers, rows);
        break;
      }
    }
  }, [
    activeModuleId,
    step1Data,
    step2Data,
    step3Data,
    menuData,
    samplesData,
    studentsData,
    healthData,
    staffData,
    lessonsData,
  ]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-700">Đang khởi động hệ thống quản trị...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, render Login PIN screen
  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={handleAuthenticated} schoolInfo={schoolInfo} />;
  }

  // Render Main Application
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Bar Header */}
      <Header
        schoolInfo={schoolInfo}
        activeModuleId={activeModuleId}
        activeModuleName={activeModuleConfig.label}
        onLock={handleLock}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenSchoolModal={() => setIsSchoolModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onExportCsv={handleExportCsv}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebarCollapse}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        onOpenTursoModal={() => setIsTursoModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        isTursoConnected={isTursoConnected}
        onSaveCloud={handleQuickSaveAndSync}
        isSavingCloud={isSavingCloud}
      />

      {/* Mobile Top Sub-Header with Menu button */}
      <div className="lg:hidden bg-gradient-to-r from-[#133246] to-[#0e3b44] text-white px-4 py-2 flex items-center justify-between border-b border-[#1e4a55] sticky top-16 z-20 shadow-xs">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
        >
          <MenuIcon className="w-4 h-4" />
          <span>Danh mục 9 Sổ mầm non</span>
        </button>
        <span className="text-xs font-semibold text-emerald-200 truncate max-w-[200px]">
          {activeModuleConfig.label}
        </span>
      </div>

      <div className="flex-1 flex w-full">
        {/* Navigation Sidebar with Preschool Theme & Collapse Functionality */}
        <Sidebar
          activeModuleId={activeModuleId}
          onSelectModule={(id) => setActiveModuleId(id)}
          counts={countsRecord}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebarCollapse}
        />

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72 sm:lg:pl-80'
          } p-3 sm:p-5 lg:p-6 min-w-0`}
        >
          {activeModuleId === 'lightning' && (
            <LightningModule
              schoolInfo={schoolInfo}
              menuItems={menuData}
              students={studentsData}
            />
          )}

          {activeModuleId === 'finance' && (
            <FinanceSalaryModule
              schoolInfo={schoolInfo}
              salaries={salariesData}
              transactions={transactionsData}
              staffList={staffData}
              onSaveSalary={handleSaveSalary}
              onDeleteSalary={handleDeleteSalary}
              onSaveTransaction={handleSaveTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeModuleId === 'step1' && (
            <Step1Inspection
              records={step1Data}
              onSaveRecord={handleSaveStep1}
              onDeleteRecord={handleDeleteStep1}
              onPrintPreview={() => setIsReportModalOpen(true)}
            />
          )}

          {activeModuleId === 'step2' && (
            <Step2Cooking
              records={step2Data}
              onSaveRecord={handleSaveStep2}
              onDeleteRecord={handleDeleteStep2}
              onPrintPreview={() => setIsReportModalOpen(true)}
            />
          )}

          {activeModuleId === 'step3' && (
            <Step3Tasting
              records={step3Data}
              onSaveRecord={handleSaveStep3}
              onDeleteRecord={handleDeleteStep3}
              onPrintPreview={() => setIsReportModalOpen(true)}
            />
          )}

          {activeModuleId === 'menu' && (
            <MenuManagement
              items={menuData}
              onSaveItem={handleSaveMenu}
              onDeleteItem={handleDeleteMenu}
              onPrintPreview={() => setIsReportModalOpen(true)}
              onOpenAiAssistant={() => setIsAiModalOpen(true)}
              studentsCount={studentsData.length || 80}
              schoolInfo={schoolInfo}
              onSyncToStep1={(newRecords) => {
                setStep1Data((prev) => {
                  const updated = [...newRecords, ...prev];
                  moduleStorage.saveStep1(updated);
                  return updated;
                });
              }}
              onSyncToFinance={(tx) => {
                handleSaveTransaction(tx);
              }}
            />
          )}

          {activeModuleId === 'samples' && (
            <SampleDisposal
              records={samplesData}
              onSaveRecord={handleSaveSamples}
              onDeleteRecord={handleDeleteSamples}
              onPrintPreview={() => setIsReportModalOpen(true)}
            />
          )}

          {activeModuleId === 'students' && (
            <StudentManagement
              records={studentsData}
              onSaveRecord={handleSaveStudents}
              onDeleteRecord={handleDeleteStudents}
              onPrintPreview={() => setIsReportModalOpen(true)}
            />
          )}

          {activeModuleId === 'health' && (
            <HealthRecords
              records={healthData}
              onSaveRecord={handleSaveHealth}
              onDeleteRecord={handleDeleteHealth}
              onPrintPreview={() => setIsReportModalOpen(true)}
            />
          )}

          {activeModuleId === 'staff' && (
            <StaffManagement
              records={staffData}
              onSaveRecord={handleSaveStaff}
              onDeleteRecord={handleDeleteStaff}
              onPrintPreview={() => setIsReportModalOpen(true)}
            />
          )}

          {activeModuleId === 'lessonPlans' && (
            <LessonPlans
              plans={lessonsData}
              onSavePlan={handleSaveLessons}
              onDeletePlan={handleDeleteLessons}
              onPrintPreview={() => setIsReportModalOpen(true)}
              onOpenAiAssistant={() => setIsAiModalOpen(true)}
            />
          )}

          {activeModuleId === 'settings' && (
            <SettingsTab
              key={`${schoolInfo.name}-${schoolInfo.inspectorName || ''}-${schoolInfo.receiverName || ''}-${schoolInfo.sampleKeeperName || ''}-${schoolInfo.sampleDisposerName || ''}`}
              schoolInfo={schoolInfo}
              onSave={handleSaveSchoolInfo}
              onOpenLogoPicker={() => setIsLogoModalOpen(true)}
            />
          )}

          {activeModuleId === 'history' && (
            <HistoryAuditTab
              logs={auditLogs}
              onRestore={handleRestoreAuditLog}
              onClearLogs={handleClearAuditLogs}
              onSeedSampleLogs={handleSeedSampleAuditLogs}
            />
          )}
        </main>
      </div>

      {/* School Info Configuration Modal */}
      <SchoolConfigModal
        key={`modal-${isSchoolModalOpen ? 'open' : 'closed'}-${schoolInfo.name}`}
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        schoolInfo={schoolInfo}
        onSave={handleSaveSchoolInfo}
        onOpenLogoPicker={() => {
          setIsSchoolModalOpen(false);
          setIsLogoModalOpen(true);
        }}
      />

      {/* Change PIN Security Modal */}
      <ChangePinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        currentSavedPin={currentPin}
        onUpdatePin={handleUpdatePin}
      />

      {/* Administrative Report Preview & Print Modal */}
      <AdministrativeReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        moduleId={activeModuleId}
        schoolInfo={schoolInfo}
        data={currentActiveData}
        onExportCsv={handleExportCsv}
        salariesData={salariesData}
        transactionsData={transactionsData}
        step1Data={step1Data}
        step2Data={step2Data}
        step3Data={step3Data}
        menuData={menuData}
        onUpdateSchoolInfo={handleSaveSchoolInfo}
      />

      {/* Custom Logo Selection & Upload Modal */}
      <LogoSelectModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogoUrl={schoolInfo.logoUrl}
        onSaveLogo={handleSaveLogo}
      />

      {/* Turso Database Cloud Sync & Data Management Modal */}
      <TursoSyncModal
        isOpen={isTursoModalOpen}
        onClose={() => setIsTursoModalOpen(false)}
        isConnected={isTursoConnected}
        onSyncToCloud={handleSyncToCloud}
        onPullFromCloud={handlePullFromCloud}
        onSeedData={handleSeedAllData}
        onResetData={handleResetAllData}
        onBackupData={handleBackupSnapshot}
        onRestoreData={handleRestoreSnapshot}
        currentPin={currentPin}
        schoolName={schoolInfo.name}
        localMetrics={{
          step1: step1Data.length,
          step2: step2Data.length,
          step3: step3Data.length,
          menu: menuData.length,
          samples: samplesData.length,
          students: studentsData.length,
          health: healthData.length,
          staff: staffData.length,
          lessonPlans: lessonsData.length,
          finance: transactionsData.length,
          salaries: salariesData.length,
        }}
      />

      {/* AI Preschool Assistant Modal (Groq LPU & Gemini) */}
      <AiPreschoolModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        schoolName={schoolInfo.name}
        defaultTeacher={schoolInfo.creatorName || 'Thanh Xuân'}
        defaultApprover={schoolInfo.principalName || 'Võ Thị Hồng Sim (Chủ cơ sở)'}
        onAddLessonPlan={(planRecord) => {
          const newPlan: LessonPlan = {
            id: planRecord.id || `lp-${Date.now()}`,
            theme: planRecord.theme || 'Chủ đề mới',
            weekNumber: planRecord.weekNumber || 36,
            month: '05/2025',
            ageGroup: (planRecord.targetClass as any) || 'Mẫu giáo Lớn (5-6 tuổi)',
            subject: planRecord.developmentField || 'Phát triển Nhận thức',
            topic: planRecord.title || 'Đề tài hoạt động học',
            teacherName: planRecord.teacherName || schoolInfo.creatorName || 'Thanh Xuân',
            learningObjectives: planRecord.notes || 'Mục tiêu kiến thức, kỹ năng, thái độ theo chuẩn Bộ GD&ĐT',
            activitiesPlan: '1. Ổn định & gây hứng thú\n2. Nội dung trọng tâm bài học\n3. Trò chơi vận dụng củng cố\n4. Nhận xét & đánh giá kết thúc',
            preparation: 'Đồ dùng học tập của cô và trẻ, dụng cụ trực quan sinh động.',
            approvalStatus: 'Đã phê duyệt',
            approverName: schoolInfo.principalName || 'Võ Thị Hồng Sim (Chủ cơ sở)',
            notes: planRecord.notes || 'Soạn tự động bằng Trợ lý AI',
          };
          handleSaveLessons(newPlan);
        }}
        onApplyWeeklyMenu={(days) => {
          days.forEach((day: any, idx: number) => {
            const newItem: MenuItem = {
              id: `m-ai-${Date.now()}-${idx}`,
              weekNumber: 36,
              month: '05/2025',
              ageGroup: 'Mẫu giáo Lớn (5-6 tuổi)',
              dayOfWeek: day.dayOfWeek || 'Thứ Hai',
              breakfast: day.breakfast || '',
              snackMorning: 'Nước ép hoa quả tươi / Sữa hạt sen',
              lunchMain: day.lunchMain || '',
              lunchSoup: day.lunchSoup || '',
              lunchStaple: 'Cơm tám thơm',
              lunchDessert: 'Trái cây theo mùa',
              afternoonSnack: day.snackAfternoon || '',
              caloriesKcal: 780,
              proteinRatio: '14-16% Pro, 25-30% Lipid, 55-60% Glucid',
              status: 'Đã phê duyệt',
              approvedBy: schoolInfo.principalName || 'Võ Thị Hồng Sim',
              notes: `Gợi ý thực đơn AI (${day.dailyCostEstimate || '35.000đ'})`,
            };
            handleSaveMenu(newItem);
          });
        }}
        onAddStep1Records={(records) => {
          records.forEach((r) => {
            handleSaveStep1(r);
          });
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-2.5 text-sm font-semibold transition-all transform animate-in slide-in-from-bottom-3 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-600 shadow-emerald-900/30'
              : toastMessage.type === 'error'
              ? 'bg-rose-800 text-white border-rose-600 shadow-rose-900/30'
              : 'bg-slate-900 text-white border-slate-700 shadow-slate-900/30'
          }`}
        >
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
