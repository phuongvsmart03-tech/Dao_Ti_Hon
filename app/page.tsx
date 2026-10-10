'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  isPinDisabled,
  setPinDisabled,
  getSchoolInfo,
  saveSchoolInfo,
  getDefaultSettings,
  saveDefaultSettings,
  AppDefaultSettings,
  moduleStorage,
  backupRestore,
  exportToCsv,
  recordDeletedId,
  getDeletedIds,
  clearDeletedIds,
} from '@/lib/storage';

import {
  getStoredDishLibrary,
  fetchCloudDishLibrary,
  syncAllDishesToCloud,
} from '@/lib/dish-library';

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
import RealtimeDrawerModal from '@/components/RealtimeDrawerModal';
import ConflictResolutionModal from '@/components/ConflictResolutionModal';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { RealtimeEventPayload } from '@/types/realtime';
import { Trash2 } from 'lucide-react';
import { getAutoBackupConfig, saveAutoBackupConfig, saveLocalBackupSnapshot } from '@/lib/services/auto-backup';

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
    if (typeof window === 'undefined') return true;
    return isPinDisabled() || getStoredSession();
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
  const [isRealtimeModalOpen, setIsRealtimeModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isTursoConnected, setIsTursoConnected] = useState(false);
  const [currentPin, setCurrentPin] = useState<string>(() => getStoredPin());
  const [pinDisabled, setPinDisabledState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return isPinDisabled();
  });

  // School Information state
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo>(() => getSchoolInfo());

  // Default App Settings & Lightning State (Sĩ số NT/MG, Tiền ăn, Giờ kiểm thực & Món tùy chỉnh)
  const [defaultSettings, setDefaultSettings] = useState<AppDefaultSettings>(() => getDefaultSettings());
  const [lightningState, setLightningState] = useState<{
    customDishes?: Record<string, any>;
    customCounts?: Record<string, any>;
  }>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const dishes = localStorage.getItem('lightning_custom_dishes');
      const counts = localStorage.getItem('lightning_custom_counts');
      return {
        customDishes: dishes ? JSON.parse(dishes) : {},
        customCounts: counts ? JSON.parse(counts) : {},
      };
    } catch {
      return {};
    }
  });

  const handleSaveDefaultSettings = useCallback((settings: Partial<AppDefaultSettings>) => {
    const updated = saveDefaultSettings(settings);
    setDefaultSettings(updated);
    fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_default_settings',
        defaultSettings: updated,
      }),
    }).catch(() => {});
  }, []);

  const handleSaveLightningState = useCallback((state: { customDishes?: Record<string, any>; customCounts?: Record<string, any> }) => {
    setLightningState(state);
    if (typeof window !== 'undefined') {
      if (state.customDishes) localStorage.setItem('lightning_custom_dishes', JSON.stringify(state.customDishes));
      if (state.customCounts) localStorage.setItem('lightning_custom_counts', JSON.stringify(state.customCounts));
    }
    fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_lightning_state',
        lightningState: state,
      }),
    }).catch(() => {});
  }, []);

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
  const [isClearAllDataModalOpen, setIsClearAllDataModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Cơ chế chống ghi đè khi khởi động: Cờ xác định dữ liệu Master đã tải xong từ máy chủ
  const isInitialLoadCompletedRef = useRef(false);
  const [isInitialLoadCompleted, setIsInitialLoadCompleted] = useState(false);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Tự động đồng bộ hai chiều Danh sách Học sinh & Hồ sơ Sức khỏe trên client
  useEffect(() => {
    if (!studentsData || studentsData.length === 0) return;
    const today = new Date().toISOString().split('T')[0];
    let needsUpdate = false;
    const updatedHealth = [...healthData];

    studentsData.forEach((st) => {
      const hasHealth = updatedHealth.some(
        (h) =>
          h.studentId === st.id ||
          h.studentName.trim().toLowerCase() === st.fullName.trim().toLowerCase()
      );
      if (!hasHealth) {
        let h = 100;
        let w = 15.5;
        if (st.className.includes('Nhà Trẻ')) {
          h = 86.5;
          w = 12.2;
        } else if (st.className.includes('Mầm')) {
          h = 96.0;
          w = 14.2;
        } else if (st.className.includes('Chồi')) {
          h = 103.5;
          w = 16.5;
        } else if (st.className.includes('Lá')) {
          h = 111.0;
          w = 19.0;
        }

        updatedHealth.push({
          id: `hr-${st.id}`,
          studentId: st.id,
          studentName: st.fullName,
          className: st.className,
          checkDate: today,
          heightCm: h,
          weightKg: w,
          nutritionStatus: 'Bình thường (Kênh A)',
          vaccinationStatus: 'Đầy đủ theo độ tuổi',
          generalHealth: 'Tốt',
          doctorOrExaminer: 'Cán bộ Y tế học đường',
          notes:
            st.allergiesOrDiet && st.allergiesOrDiet !== 'Không có dị ứng'
              ? `Lưu ý ăn uống: ${st.allergiesOrDiet}`
              : 'Đồng bộ tự động từ danh sách lớp',
        });
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      setHealthData(updatedHealth);
      moduleStorage.saveHealth(updatedHealth);
      syncModuleToServer('health', updatedHealth);
    }
  }, [studentsData.length]);

  // Xóa toàn bộ dữ liệu mẫu để người dùng bắt đầu tự nhập dữ liệu thực tế
  const handleConfirmClearAllData = useCallback(async () => {
    backupRestore.clearAllData();
    clearDeletedIds();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lightning_custom_dishes');
      localStorage.removeItem('lightning_custom_counts');
      localStorage.removeItem('preschool_custom_attendance');
      localStorage.removeItem('preschool_daily_student_statuses');
    }
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
    setLightningState({ customDishes: {}, customCounts: {} });

    // Gọi trực tiếp API Server /api/turso để xóa sạch toàn bộ Master Database (cả SQLite local lẫn Turso Cloud)
    try {
      await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all_data' }),
      });
    } catch (e) {
      console.error('Lỗi khi gửi lệnh reset toàn bộ dữ liệu lên máy chủ:', e);
    }

    // Đánh dấu xóa qua BroadcastChannel để các tab khác cũng xóa sạch ngay tức thì
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('mamnon_sync_channel');
        bc.postMessage({ type: 'ALL_DATA_CLEARED' });
        bc.close();
      } catch {}
    }

    setIsClearAllDataModalOpen(false);
    showToast('Đã xóa sạch toàn bộ data mẫu trên cả thiết bị và máy chủ! Hệ thống sẵn sàng để bạn tự nhập dữ liệu thực tế.', 'success');
  }, [showToast]);

  // Quick Save & Sync to Turso Cloud handler with guaranteed local storage
  const handleQuickSaveAndSync = async () => {
    setIsSavingCloud(true);
    try {
      // 1. Luôn ghi nhớ an toàn 100% dữ liệu của toàn bộ 9 phân hệ vào bộ nhớ máy (localStorage)
      saveSchoolInfo(schoolInfo);
      moduleStorage.saveStep1(step1Data);
      moduleStorage.saveStep2(step2Data);
      moduleStorage.saveStep3(step3Data);
      moduleStorage.saveMenu(menuData);
      moduleStorage.saveSamples(samplesData);
      moduleStorage.saveStudents(studentsData);
      moduleStorage.saveHealth(healthData);
      moduleStorage.saveStaff(staffData);
      moduleStorage.saveLessons(lessonsData);
      moduleStorage.saveSalaries(salariesData);
      moduleStorage.saveTransactions(transactionsData);

      showToast('⏳ Đang lưu dữ liệu và đồng bộ lên đám mây Turso...', 'info');
      await handleSyncToCloud();
      moduleStorage.addAuditLog({
        action: 'sync',
        actionLabel: 'Đồng bộ',
        module: activeModuleId,
        moduleName: activeModuleConfig.label,
        description: `Đã lưu toàn bộ dữ liệu 9 phân hệ và đồng bộ đám mây Turso Cloud`,
        canUndo: false,
      });
      setAuditLogs(moduleStorage.getAuditLogs());
      showToast('✅ Đã lưu toàn bộ dữ liệu máy & đồng bộ đám mây thành công!', 'success');
    } catch (err: any) {
      showToast('✅ Đã lưu an toàn toàn bộ dữ liệu vào bộ nhớ máy (Offline). Đám mây: ' + (err?.message || 'Chưa cấu hình'), 'success');
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

  // Sync module to central database (Có bảo vệ chống ghi đè khi khởi động)
  const syncModuleToServer = useCallback((moduleId: string, items: any) => {
    if (!isInitialLoadCompletedRef.current) return;
    fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'sync_module', moduleId, payload: items }),
    }).catch((e) => console.error('Lỗi khi đồng bộ lên máy chủ:', e));
  }, []);

  // Xóa nguyên tử bản ghi trực tiếp trên Server Database và ghi nhận Tombstone vĩnh viễn
  const deleteRecordFromServer = useCallback((targetModule: string, id: string) => {
    // 1. Ghi nhận ID vào bộ nhớ Tombstone của máy này
    recordDeletedId(id);

    // 2. Bắn tín hiệu qua BroadcastChannel cho các tab / cửa sổ khác trên máy cập nhật ngay tức thì
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel('mamnon_sync_channel');
        bc.postMessage({ type: 'RECORD_DELETED', targetModule, id });
        bc.close();
      } catch {}
    }

    // 3. Gửi lệnh xóa lên server database và lưu vào danh sách deleted_records
    fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_record', targetModule, id }),
    }).catch((e) => console.error('Lỗi khi xóa bản ghi trên máy chủ:', e));
  }, []);

  // Tải dữ liệu chính từ Master Database và tự động đồng bộ thời gian thực cho tất cả các máy
  const loadMasterData = useCallback(async () => {
    try {
      fetchCloudDishLibrary().catch(() => {});
      const res = await fetch('/api/turso').catch(() => null);
      if (!res || !res.ok) {
        isInitialLoadCompletedRef.current = true;
        setIsInitialLoadCompleted(true);
        return;
      }
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        isInitialLoadCompletedRef.current = true;
        setIsInitialLoadCompleted(true);
        return;
      }
      const data = await res.json().catch(() => null);
      if (!data) {
        isInitialLoadCompletedRef.current = true;
        setIsInitialLoadCompleted(true);
        return;
      }
      const deletedIds = getDeletedIds();

      if (data.connected) {
        setIsTursoConnected(true);

        if (data.schoolInfo && Object.keys(data.schoolInfo).length > 0) {
          setSchoolInfo((prev) => {
            const merged = { ...prev, ...data.schoolInfo };
            saveSchoolInfo(merged);
            return merged;
          });
        }
        if (data.defaultSettings && Object.keys(data.defaultSettings).length > 0) {
          setDefaultSettings(data.defaultSettings);
          saveDefaultSettings(data.defaultSettings);
        }
        if (data.lightningState) {
          setLightningState(data.lightningState);
          if (data.lightningState.customDishes) {
            localStorage.setItem('lightning_custom_dishes', JSON.stringify(data.lightningState.customDishes));
          }
          if (data.lightningState.customCounts) {
            localStorage.setItem('lightning_custom_counts', JSON.stringify(data.lightningState.customCounts));
          }
        }
        if (Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
          setAuditLogs(data.auditLogs);
          localStorage.setItem('audit_logs_v1', JSON.stringify(data.auditLogs));
        }
        if (Array.isArray(data.step1)) {
          const clean = data.step1.filter((r: any) => !deletedIds.has(r.id));
          setStep1Data(clean);
          moduleStorage.saveStep1(clean);
        }
        if (Array.isArray(data.step2)) {
          const clean = data.step2.filter((r: any) => !deletedIds.has(r.id));
          setStep2Data(clean);
          moduleStorage.saveStep2(clean);
        }
        if (Array.isArray(data.step3)) {
          const clean = data.step3.filter((r: any) => !deletedIds.has(r.id));
          setStep3Data(clean);
          moduleStorage.saveStep3(clean);
        }
        if (Array.isArray(data.menuItems)) {
          const clean = data.menuItems.filter((r: any) => !deletedIds.has(r.id));
          setMenuData(clean);
          moduleStorage.saveMenu(clean);
        }
        if (Array.isArray(data.sampleDisposals)) {
          const clean = data.sampleDisposals.filter((r: any) => !deletedIds.has(r.id));
          setSamplesData(clean);
          moduleStorage.saveSamples(clean);
        }
        if (Array.isArray(data.students)) {
          const cleanStudents = data.students.filter((r: any) => !deletedIds.has(r.id));
          const cleanHealth = Array.isArray(data.healthRecords)
            ? data.healthRecords.filter((r: any) => !deletedIds.has(r.id))
            : [];
          
          // Đảm bảo 100% học sinh đều đồng bộ có hồ sơ sức khỏe
          const today = new Date().toISOString().split('T')[0];
          const updatedHealth = [...cleanHealth];
          cleanStudents.forEach((st: any) => {
            const hasRec = updatedHealth.some(
              (h: any) =>
                h.studentId === st.id ||
                h.studentName.trim().toLowerCase() === st.fullName.trim().toLowerCase()
            );
            if (!hasRec) {
              let h = 100;
              let w = 15.5;
              if (st.className.includes('Nhà Trẻ')) { h = 86.5; w = 12.2; }
              else if (st.className.includes('Mầm')) { h = 96.0; w = 14.2; }
              else if (st.className.includes('Chồi')) { h = 103.5; w = 16.5; }
              else if (st.className.includes('Lá')) { h = 111.0; w = 19.0; }

              updatedHealth.push({
                id: `hr-${st.id}`,
                studentId: st.id,
                studentName: st.fullName,
                className: st.className,
                checkDate: today,
                heightCm: h,
                weightKg: w,
                nutritionStatus: 'Bình thường (Kênh A)',
                vaccinationStatus: 'Đầy đủ theo độ tuổi',
                generalHealth: 'Tốt',
                doctorOrExaminer: 'Cán bộ Y tế học đường',
                notes: st.allergiesOrDiet && st.allergiesOrDiet !== 'Không có dị ứng'
                  ? `Lưu ý ăn uống: ${st.allergiesOrDiet}`
                  : 'Đồng bộ tự động từ danh sách lớp',
              });
            }
          });

          setStudentsData(cleanStudents);
          moduleStorage.saveStudents(cleanStudents);
          setHealthData(updatedHealth);
          moduleStorage.saveHealth(updatedHealth);
        } else if (Array.isArray(data.healthRecords)) {
          const clean = data.healthRecords.filter((r: any) => !deletedIds.has(r.id));
          setHealthData(clean);
          moduleStorage.saveHealth(clean);
        }
        if (Array.isArray(data.staffMembers)) {
          const clean = data.staffMembers.filter((r: any) => !deletedIds.has(r.id));
          setStaffData(clean);
          moduleStorage.saveStaff(clean);
        }
        if (Array.isArray(data.lessonPlans)) {
          const clean = data.lessonPlans.filter((r: any) => !deletedIds.has(r.id));
          setLessonsData(clean);
          moduleStorage.saveLessons(clean);
        }
        if (Array.isArray(data.teacherSalaries)) {
          const clean = data.teacherSalaries.filter((r: any) => !deletedIds.has(r.id));
          setSalariesData(clean);
          moduleStorage.saveSalaries(clean);
        }
        if (Array.isArray(data.financeTransactions)) {
          const clean = data.financeTransactions.filter((r: any) => !deletedIds.has(r.id));
          setTransactionsData(clean);
          moduleStorage.saveTransactions(clean);
        }
      }
      isInitialLoadCompletedRef.current = true;
      setIsInitialLoadCompleted(true);
    } catch {
      // Offline fallback: Sử dụng dữ liệu cục bộ an toàn
      isInitialLoadCompletedRef.current = true;
      setIsInitialLoadCompleted(true);
    }
  }, []);

  // Tự động tải từ Master Database khi mở máy và polling định kỳ 15s để đồng bộ xuyên suốt các thiết bị
  useEffect(() => {
    let isMounted = true;

    const runSync = async () => {
      if (isMounted) {
        await loadMasterData();
      }
    };

    runSync();

    const interval = setInterval(runSync, 15000);
    window.addEventListener('focus', runSync);

    // Kênh đồng bộ BroadcastChannel tức thời giữa các tab / trình duyệt
    let syncChannel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        syncChannel = new BroadcastChannel('mamnon_sync_channel');
        syncChannel.onmessage = (event) => {
          if (event.data?.type === 'ALL_DATA_CLEARED') {
            backupRestore.clearAllData();
            clearDeletedIds();
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
            setLightningState({ customDishes: {}, customCounts: {} });
            return;
          }
          if (event.data?.type === 'RECORD_DELETED' && event.data.id) {
            recordDeletedId(event.data.id);
          }
          runSync();
        };
      } catch {}
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && (e.key.startsWith('preschool_') || e.key.startsWith('lightning_'))) {
        runSync();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', runSync);
      window.removeEventListener('storage', handleStorageChange);
      syncChannel?.close();
    };
  }, [loadMasterData]);

  // Phân hệ Đồng Bộ Thời Gian Thực (Real-time SSE & Concurrency Control - Giai đoạn 3)
  const realtime = useRealtimeSync({
    enabled: true,
    onRemoteMutation: useCallback((event: RealtimeEventPayload) => {
      if (event.module === 'school_info' && event.data) {
        setSchoolInfo((prev) => {
          const merged = { ...prev, ...event.data };
          saveSchoolInfo(merged);
          return merged;
        });
      }
      loadMasterData();
      showToast(`☁️ Đồng bộ tức thời (SSE): ${event.message || 'Dữ liệu vừa được cập nhật từ thiết bị khác'}`, 'info');
    }, [loadMasterData, showToast]),
    onRemoteSync: useCallback(() => {
      loadMasterData();
      showToast('☁️ [SSE] Dữ liệu vừa được làm mới từ máy chủ!', 'info');
    }, [loadMasterData, showToast]),
    onConflict: useCallback(() => {
      setIsConflictModalOpen(true);
    }, []),
  });

  const handleResolveConflict = async (decision: 'keep_local' | 'accept_remote' | 'smart_merge') => {
    const resolved = realtime.resolveConflict(decision);
    setIsConflictModalOpen(false);
    if (!resolved) return;

    if (decision === 'keep_local') {
      await handleQuickSaveAndSync();
      showToast('✅ Đã giữ lại dữ liệu trên máy này và đồng bộ lên đám mây.', 'success');
    } else if (decision === 'accept_remote') {
      await loadMasterData();
      showToast('✅ Đã cập nhật phiên bản mới nhất từ máy chủ.', 'info');
    } else if (decision === 'smart_merge') {
      await loadMasterData();
      showToast('✅ Đã hợp nhất thông minh dữ liệu thành công.', 'success');
    }
  };

  // Giai đoạn 4: Bộ Lập Lịch Tự Động Sao Lưu Hàng Đêm (Automated Daily 00:00 Backup Scheduler)
  useEffect(() => {
    const checkAutoBackup = async () => {
      if (typeof window === 'undefined') return;
      const cfg = getAutoBackupConfig();
      if (!cfg.enabled) return;

      const now = new Date();
      const todayDateStr = now.toISOString().split('T')[0];
      const lastBackupDateStr = cfg.lastBackupDate ? cfg.lastBackupDate.split('T')[0] : null;

      if (todayDateStr !== lastBackupDateStr) {
        try {
          const res = await fetch('/api/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create_backup' }),
          });
          const data = await res.json();
          if (data.success && data.backup) {
            saveLocalBackupSnapshot(data.backup);
            saveAutoBackupConfig({ lastBackupDate: now.toISOString() });
            showToast(`💾 [Giai đoạn 4: Tự Động Sao Lưu] Đã hoàn tất bản sao lưu định kỳ hàng ngày (${data.backup.checksum}).`, 'info');
          }
        } catch {
          // ignore
        }
      }
    };

    const timer = setTimeout(checkAutoBackup, 6000);
    const interval = setInterval(checkAutoBackup, 30 * 60 * 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [showToast]);

  // Handlers for Turso sync
  const handleSyncToCloud = async () => {
    // 1. Sync school info
    await fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_school_info', payload: schoolInfo }),
    });

    // 2. Sync default settings & lightning state
    await fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_default_settings', defaultSettings }),
    });
    await fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_lightning_state', lightningState }),
    });

    // 3. Sync all modules + dish library
    const modulesToSync = [
      { moduleId: 'step1', items: step1Data },
      { moduleId: 'step2', items: step2Data },
      { moduleId: 'step3', items: step3Data },
      { moduleId: 'menu', items: menuData },
      { moduleId: 'dish_library', items: getStoredDishLibrary() },
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

    // Also sync dishes to central /api/dishes
    await syncAllDishesToCloud();
  };

  const handlePullFromCloud = async () => {
    const res = await fetch('/api/turso').catch(() => null);
    if (!res || !res.ok) {
      await fetchCloudDishLibrary();
      throw new Error('Chưa thể kết nối tới cơ sở dữ liệu máy chủ, đã tải dữ liệu từ bộ nhớ máy.');
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      await fetchCloudDishLibrary();
      throw new Error('Phản hồi từ máy chủ không đúng định dạng JSON.');
    }
    const result = await res.json().catch(() => null);
    if (!result) {
      throw new Error('Không thể đọc dữ liệu phản hồi từ máy chủ.');
    }
    if (!result.connected && !result.data && !result.step1) {
      // Try pulling dishes from central server fallback
      await fetchCloudDishLibrary();
      throw new Error(result.error || 'Chưa cấu hình Turso Database, đã đồng bộ kho món ăn qua Server.');
    }

    const data = result.data || result;
    const deletedIds = getDeletedIds();

    if (data.schoolInfo) {
      setSchoolInfo(data.schoolInfo);
      saveSchoolInfo(data.schoolInfo);
    }
    if (data.defaultSettings && Object.keys(data.defaultSettings).length > 0) {
      setDefaultSettings(data.defaultSettings);
      saveDefaultSettings(data.defaultSettings);
    }
    if (data.lightningState) {
      setLightningState(data.lightningState);
      if (data.lightningState.customDishes) {
        localStorage.setItem('lightning_custom_dishes', JSON.stringify(data.lightningState.customDishes));
      }
      if (data.lightningState.customCounts) {
        localStorage.setItem('lightning_custom_counts', JSON.stringify(data.lightningState.customCounts));
      }
    }
    if (Array.isArray(data.step1)) {
      const clean = data.step1.filter((r: any) => !deletedIds.has(r.id));
      setStep1Data(clean);
      moduleStorage.saveStep1(clean);
    }
    if (Array.isArray(data.step2)) {
      const clean = data.step2.filter((r: any) => !deletedIds.has(r.id));
      setStep2Data(clean);
      moduleStorage.saveStep2(clean);
    }
    if (Array.isArray(data.step3)) {
      const clean = data.step3.filter((r: any) => !deletedIds.has(r.id));
      setStep3Data(clean);
      moduleStorage.saveStep3(clean);
    }
    const menuList = data.menuItems || data.menu;
    if (Array.isArray(menuList)) {
      const clean = menuList.filter((r: any) => !deletedIds.has(r.id));
      setMenuData(clean);
      moduleStorage.saveMenu(clean);
    }
    const sampleList = data.sampleDisposals || data.samples;
    if (Array.isArray(sampleList)) {
      const clean = sampleList.filter((r: any) => !deletedIds.has(r.id));
      setSamplesData(clean);
      moduleStorage.saveSamples(clean);
    }
    if (Array.isArray(data.students)) {
      const clean = data.students.filter((r: any) => !deletedIds.has(r.id));
      setStudentsData(clean);
      moduleStorage.saveStudents(clean);
    }
    const healthList = data.healthRecords || data.health;
    if (Array.isArray(healthList)) {
      const clean = healthList.filter((r: any) => !deletedIds.has(r.id));
      setHealthData(clean);
      moduleStorage.saveHealth(clean);
    }
    const staffList = data.staffMembers || data.staff;
    if (Array.isArray(staffList)) {
      const clean = staffList.filter((r: any) => !deletedIds.has(r.id));
      setStaffData(clean);
      moduleStorage.saveStaff(clean);
    }
    const lessonList = data.lessonPlans || data.lessons;
    if (Array.isArray(lessonList)) {
      const clean = lessonList.filter((r: any) => !deletedIds.has(r.id));
      setLessonsData(clean);
      moduleStorage.saveLessons(clean);
    }
    const salaryList = data.teacherSalaries || data.salaries;
    if (Array.isArray(salaryList)) {
      const clean = salaryList.filter((r: any) => !deletedIds.has(r.id));
      setSalariesData(clean);
      moduleStorage.saveSalaries(clean);
    }
    const transactionList = data.financeTransactions || data.transactions;
    if (Array.isArray(transactionList)) {
      const clean = transactionList.filter((r: any) => !deletedIds.has(r.id));
      setTransactionsData(clean);
      moduleStorage.saveTransactions(clean);
    }

    // Pull and update dish library
    await fetchCloudDishLibrary();
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
    clearDeletedIds();
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
    setLightningState({ customDishes: {}, customCounts: {} });

    try {
      await fetch('/api/turso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all_data' }),
      });
    } catch (e) {
      console.error('Lỗi khi reset toàn bộ dữ liệu máy chủ:', e);
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

  // Handlers for Authentication & Single User Mode
  const handleAuthenticated = () => {
    setStoredSession(true);
    setIsAuthenticated(true);
  };

  const handleTogglePinDisabled = (disabled: boolean) => {
    setPinDisabledState(disabled);
    setPinDisabled(disabled);
    if (disabled) {
      setIsAuthenticated(true);
      showToast('✨ Đã bật Chế độ 1 người dùng: Đã tắt hoàn toàn mã PIN. Hệ thống luôn sẵn sàng!', 'success');
    } else {
      showToast('🔒 Đã bật lại tính năng yêu cầu mã PIN 6 số khi mở phần mềm.', 'info');
    }
  };

  const handleLock = () => {
    if (pinDisabled) {
      showToast('ℹ️ Bạn đang ở Chế độ 1 người dùng (Không dùng PIN). Đã làm mới phiên làm việc!', 'info');
      return;
    }
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

    fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_school_info',
        payload: updatedInfo,
        clientId: realtime?.deviceInfo?.clientId,
        deviceName: realtime?.deviceInfo?.deviceName,
      }),
    }).catch(() => {});
  };

  // Handler for Logo update
  const handleSaveLogo = (logoUrl: string) => {
    const updated = { ...schoolInfo, logoUrl };
    setSchoolInfo(updated);
    saveSchoolInfo(updated);
    fetch('/api/turso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_school_info',
        payload: updated,
        clientId: realtime?.deviceInfo?.clientId,
        deviceName: realtime?.deviceInfo?.deviceName,
      }),
    }).catch(() => {});
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
    syncModuleToServer('step1', updated);
  };

  const handleDeleteStep1 = (id: string) => {
    const updated = step1Data.filter((r) => r.id !== id);
    setStep1Data(updated);
    moduleStorage.saveStep1(updated);
    deleteRecordFromServer('step1', id);
  };

  // CRUD Handlers for Step 2
  const handleSaveStep2 = (record: Step2Record) => {
    const exists = step2Data.some((r) => r.id === record.id);
    const updated = exists
      ? step2Data.map((r) => (r.id === record.id ? record : r))
      : [record, ...step2Data];
    setStep2Data(updated);
    moduleStorage.saveStep2(updated);
    syncModuleToServer('step2', updated);
  };

  const handleDeleteStep2 = (id: string) => {
    const updated = step2Data.filter((r) => r.id !== id);
    setStep2Data(updated);
    moduleStorage.saveStep2(updated);
    deleteRecordFromServer('step2', id);
  };

  // CRUD Handlers for Step 3
  const handleSaveStep3 = (record: Step3Record) => {
    const exists = step3Data.some((r) => r.id === record.id);
    const updated = exists
      ? step3Data.map((r) => (r.id === record.id ? record : r))
      : [record, ...step3Data];
    setStep3Data(updated);
    moduleStorage.saveStep3(updated);
    syncModuleToServer('step3', updated);
  };

  const handleDeleteStep3 = (id: string) => {
    const updated = step3Data.filter((r) => r.id !== id);
    setStep3Data(updated);
    moduleStorage.saveStep3(updated);
    deleteRecordFromServer('step3', id);
  };

  // CRUD Handlers for Menu
  const handleSaveMenu = (item: MenuItem) => {
    const exists = menuData.some((r) => r.id === item.id);
    const updated = exists
      ? menuData.map((r) => (r.id === item.id ? item : r))
      : [item, ...menuData];
    setMenuData(updated);
    moduleStorage.saveMenu(updated);
    syncModuleToServer('menu', updated);
  };

  const handleDeleteMenu = (id: string) => {
    const updated = menuData.filter((r) => r.id !== id);
    setMenuData(updated);
    moduleStorage.saveMenu(updated);
    deleteRecordFromServer('menu', id);
  };

  // CRUD Handlers for Samples
  const handleSaveSamples = (record: SampleDisposalRecord) => {
    const exists = samplesData.some((r) => r.id === record.id);
    const updated = exists
      ? samplesData.map((r) => (r.id === record.id ? record : r))
      : [record, ...samplesData];
    setSamplesData(updated);
    moduleStorage.saveSamples(updated);
    syncModuleToServer('samples', updated);
  };

  const handleDeleteSamples = (id: string) => {
    const updated = samplesData.filter((r) => r.id !== id);
    setSamplesData(updated);
    moduleStorage.saveSamples(updated);
    deleteRecordFromServer('samples', id);
  };

  // CRUD Handlers for Students (Đồng bộ hai chiều với Hồ sơ sức khỏe)
  const handleSaveStudents = (record: StudentRecord) => {
    const exists = studentsData.some((r) => r.id === record.id);
    const updated = exists
      ? studentsData.map((r) => (r.id === record.id ? record : r))
      : [record, ...studentsData];
    setStudentsData(updated);
    moduleStorage.saveStudents(updated);
    syncModuleToServer('students', updated);

    // Đồng bộ tức thì sang Hồ sơ sức khỏe:
    // 1. Nếu học sinh chưa có hồ sơ sức khỏe -> Tự động khởi tạo hồ sơ ban đầu chuẩn hóa
    // 2. Nếu đã có -> Tự động cập nhật họ tên và lớp học của bé để dữ liệu luôn khớp 100%
    setHealthData((prevHealth) => {
      let updatedHealth = [...prevHealth];
      const hasHealthRecord = updatedHealth.some(
        (h) =>
          h.studentId === record.id ||
          h.studentName.trim().toLowerCase() === record.fullName.trim().toLowerCase()
      );

      if (!hasHealthRecord) {
        let h = 100;
        let w = 15.5;
        if (record.className.includes('Nhà Trẻ')) {
          h = 86.5;
          w = 12.2;
        } else if (record.className.includes('Mầm')) {
          h = 96.0;
          w = 14.2;
        } else if (record.className.includes('Chồi')) {
          h = 103.5;
          w = 16.5;
        } else if (record.className.includes('Lá')) {
          h = 111.0;
          w = 19.0;
        }

        const newHealthRec: HealthRecord = {
          id: `hr-${record.id}`,
          studentId: record.id,
          studentName: record.fullName,
          className: record.className,
          checkDate: new Date().toISOString().split('T')[0],
          heightCm: h,
          weightKg: w,
          nutritionStatus: 'Bình thường (Kênh A)',
          vaccinationStatus: 'Đầy đủ theo độ tuổi',
          generalHealth: 'Tốt',
          doctorOrExaminer: 'Cán bộ Y tế học đường',
          notes: record.allergiesOrDiet ? `Lưu ý ăn uống: ${record.allergiesOrDiet}` : 'Đồng bộ từ hồ sơ lớp học',
        };
        updatedHealth = [newHealthRec, ...updatedHealth];
      } else {
        updatedHealth = updatedHealth.map((h) => {
          if (
            h.studentId === record.id ||
            h.studentName.trim().toLowerCase() === record.fullName.trim().toLowerCase()
          ) {
            return {
              ...h,
              studentName: record.fullName,
              className: record.className,
            };
          }
          return h;
        });
      }

      moduleStorage.saveHealth(updatedHealth);
      syncModuleToServer('health', updatedHealth);
      return updatedHealth;
    });
  };

  const handleDeleteStudents = (id: string) => {
    const studentToDelete = studentsData.find((s) => s.id === id);
    const updated = studentsData.filter((r) => r.id !== id);
    setStudentsData(updated);
    moduleStorage.saveStudents(updated);
    recordDeletedId(id);
    deleteRecordFromServer('students', id);

    // Dọn dẹp đồng bộ hồ sơ sức khỏe của học sinh bị xóa
    if (studentToDelete) {
      setHealthData((prevHealth) => {
        const remainingHealth = prevHealth.filter(
          (h) =>
            h.studentId !== id &&
            h.studentName.trim().toLowerCase() !== studentToDelete.fullName.trim().toLowerCase()
        );
        const removedRecords = prevHealth.filter(
          (h) =>
            h.studentId === id ||
            h.studentName.trim().toLowerCase() === studentToDelete.fullName.trim().toLowerCase()
        );
        removedRecords.forEach((rh) => {
          recordDeletedId(rh.id);
          deleteRecordFromServer('health', rh.id);
        });
        moduleStorage.saveHealth(remainingHealth);
        return remainingHealth;
      });
    }
  };

  // CRUD Handlers for Health (Đồng bộ hai chiều với Danh sách Học sinh)
  const handleSaveHealth = (record: HealthRecord) => {
    const exists = healthData.some((r) => r.id === record.id);
    const updated = exists
      ? healthData.map((r) => (r.id === record.id ? record : r))
      : [record, ...healthData];
    setHealthData(updated);
    moduleStorage.saveHealth(updated);
    syncModuleToServer('health', updated);

    // Đồng bộ ngược lại Danh sách Học sinh nếu thay đổi lớp hoặc tên
    setStudentsData((prevStudents) => {
      const matchIdx = prevStudents.findIndex(
        (s) => s.id === record.studentId || s.fullName.trim().toLowerCase() === record.studentName.trim().toLowerCase()
      );
      if (matchIdx !== -1) {
        const student = prevStudents[matchIdx];
        let hasChange = false;
        let updatedStudent = { ...student };
        if (record.className && record.className !== student.className) {
          updatedStudent.className = record.className as any;
          hasChange = true;
        }
        if (record.studentName && record.studentName !== student.fullName) {
          updatedStudent.fullName = record.studentName;
          hasChange = true;
        }
        if (hasChange) {
          const newStudents = [...prevStudents];
          newStudents[matchIdx] = updatedStudent;
          moduleStorage.saveStudents(newStudents);
          syncModuleToServer('students', newStudents);
          return newStudents;
        }
      }
      return prevStudents;
    });
  };

  const handleDeleteHealth = (id: string) => {
    const updated = healthData.filter((r) => r.id !== id);
    setHealthData(updated);
    moduleStorage.saveHealth(updated);
    deleteRecordFromServer('health', id);
  };

  // CRUD Handlers for Staff
  const handleSaveStaff = (record: StaffRecord) => {
    const exists = staffData.some((r) => r.id === record.id);
    const updated = exists
      ? staffData.map((r) => (r.id === record.id ? record : r))
      : [record, ...staffData];
    setStaffData(updated);
    moduleStorage.saveStaff(updated);
    syncModuleToServer('staff', updated);
  };

  const handleDeleteStaff = (id: string) => {
    const updated = staffData.filter((r) => r.id !== id);
    setStaffData(updated);
    moduleStorage.saveStaff(updated);
    deleteRecordFromServer('staff', id);
  };

  // CRUD Handlers for Lesson Plans
  const handleSaveLessons = (plan: LessonPlan) => {
    const exists = lessonsData.some((r) => r.id === plan.id);
    const updated = exists
      ? lessonsData.map((r) => (r.id === plan.id ? plan : r))
      : [plan, ...lessonsData];
    setLessonsData(updated);
    moduleStorage.saveLessons(updated);
    syncModuleToServer('lessonPlans', updated);
  };

  const handleDeleteLessons = (id: string) => {
    const updated = lessonsData.filter((r) => r.id !== id);
    setLessonsData(updated);
    moduleStorage.saveLessons(updated);
    deleteRecordFromServer('lessonPlans', id);
  };

  // CRUD Handlers for Teacher Salaries
  const handleSaveSalary = (salary: TeacherSalaryRecord) => {
    const exists = salariesData.some((r) => r.id === salary.id);
    const updated = exists
      ? salariesData.map((r) => (r.id === salary.id ? salary : r))
      : [salary, ...salariesData];
    setSalariesData(updated);
    moduleStorage.saveSalaries(updated);
    syncModuleToServer('salaries', updated);
  };

  const handleDeleteSalary = (id: string) => {
    const updated = salariesData.filter((r) => r.id !== id);
    setSalariesData(updated);
    moduleStorage.saveSalaries(updated);
    deleteRecordFromServer('salaries', id);
  };

  // CRUD Handlers for Finance Transactions
  const handleSaveTransaction = (tx: FinanceTransaction) => {
    const exists = transactionsData.some((r) => r.id === tx.id);
    const updated = exists
      ? transactionsData.map((r) => (r.id === tx.id ? tx : r))
      : [tx, ...transactionsData];
    setTransactionsData(updated);
    moduleStorage.saveTransactions(updated);
    syncModuleToServer('finance', updated);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactionsData.filter((r) => r.id !== id);
    setTransactionsData(updated);
    moduleStorage.saveTransactions(updated);
    deleteRecordFromServer('finance', id);
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
    <div className="min-h-screen bg-slate-50 flex selection:bg-emerald-600 selection:text-white">
      {/* 1. Left Navigation Sidebar - Fixed full height */}
      <Sidebar
        activeModuleId={activeModuleId}
        onSelectModule={(id) => setActiveModuleId(id)}
        counts={countsRecord}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebarCollapse}
      />

      {/* 2. Main Content Column - Automatically offset by Sidebar width on desktop */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72 xl:pl-80'
        }`}
      >
        {/* Top Header Bar - Clean SaaS Glass Bar, Perfectly Aligned */}
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
          onOpenRealtimeModal={() => setIsRealtimeModalOpen(true)}
          realtimeConnectionStatus={realtime.connectionStatus}
          realtimeActiveCount={realtime.activeCount}
          isTursoConnected={isTursoConnected}
          onSaveCloud={handleQuickSaveAndSync}
          isSavingCloud={isSavingCloud}
          isPinDisabled={pinDisabled}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onClearAllSampleData={() => setIsClearAllDataModalOpen(true)}
        />

        {/* Main Workspace Area - Zero Clutter, Cuộn độc lập */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 min-w-0">
          {activeModuleId === 'lightning' && (
            <LightningModule
              schoolInfo={schoolInfo}
              menuItems={menuData}
              students={studentsData}
              defaultSettings={defaultSettings}
              onSaveDefaultSettings={handleSaveDefaultSettings}
              lightningState={lightningState}
              onSaveLightningState={handleSaveLightningState}
              onClearAllSampleData={() => setIsClearAllDataModalOpen(true)}
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

          {activeModuleId === 'students' && (
            <StudentManagement
              records={studentsData}
              healthRecords={healthData}
              onSaveRecord={handleSaveStudents}
              onDeleteRecord={handleDeleteStudents}
              onPrintPreview={() => setIsReportModalOpen(true)}
              onClearAllSampleData={() => setIsClearAllDataModalOpen(true)}
              onNavigateToHealth={() => setActiveModuleId('health')}
            />
          )}

          {activeModuleId === 'health' && (
            <HealthRecords
              records={healthData}
              students={studentsData}
              onSaveRecord={handleSaveHealth}
              onDeleteRecord={handleDeleteHealth}
              onPrintPreview={() => setIsReportModalOpen(true)}
              onNavigateToStudents={() => setActiveModuleId('students')}
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
        isPinDisabled={pinDisabled}
        onTogglePinDisabled={handleTogglePinDisabled}
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
        onOpenRealtimeModal={() => setIsRealtimeModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        menuData={menuData}
        studentsData={studentsData}
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

      {/* Realtime Multi-Device Drawer Modal (Giai đoạn 3: Real-Time SSE Multi-Device) */}
      <RealtimeDrawerModal
        isOpen={isRealtimeModalOpen}
        onClose={() => setIsRealtimeModalOpen(false)}
        connectionStatus={realtime.connectionStatus}
        activeClients={realtime.activeClients}
        activeCount={realtime.activeCount}
        recentEvents={realtime.recentEvents}
        pingMs={realtime.pingMs}
        lastEventTime={realtime.lastEventTime}
        deviceInfo={realtime.deviceInfo}
        onReconnect={realtime.reconnect}
        onSimulateConflict={realtime.simulateTestConflict}
        onUpdateDeviceIdentity={realtime.updateDeviceIdentity}
      />

      {/* Concurrency Conflict Resolution Modal (Giai đoạn 3: Optimistic Locking) */}
      <ConflictResolutionModal
        conflict={realtime.conflictData}
        isOpen={isConflictModalOpen || !!realtime.conflictData}
        onClose={() => setIsConflictModalOpen(false)}
        onResolve={handleResolveConflict}
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

      {/* Modal Xác Nhận Xóa Toàn Bộ Data Mẫu */}
      {isClearAllDataModalOpen && (
        <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl border border-rose-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 bg-rose-100 rounded-xl">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Xóa Sạch Toàn Bộ Data Mẫu?
                </h3>
                <p className="text-xs text-slate-500">
                  Chuẩn bị dữ liệu trắng để tự nhập dữ liệu thực tế của trường.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-2">
              <p className="font-semibold">
                Toàn bộ dữ liệu mẫu thử nghiệm sau đây sẽ được xóa sạch về 0:
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800">
                <li>Danh sách học sinh &amp; lịch sử chuyên cần</li>
                <li>Hồ sơ kiểm thực 3 bước (bước 1, 2, 3 &amp; lưu mẫu)</li>
                <li>Thực đơn tuần &amp; định lượng mẫu</li>
                <li>Sổ sức khỏe, nhân sự, giáo án, tài chính</li>
              </ul>
              <p className="text-[11px] text-slate-600 pt-1 border-t border-rose-200">
                Sau khi xóa, bạn có thể tự nhập hồ sơ thực tế hoặc dùng chức năng sao lưu/khôi phục bất cứ lúc nào.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsClearAllDataModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmClearAllData}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer"
              >
                Xác Nhận Xóa Sạch Data Mẫu
              </button>
            </div>
          </div>
        </div>
      )}

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
