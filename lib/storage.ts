import {
  SchoolInfo,
  Step1Record,
  Step2Record,
  Step3Record,
  MenuItem,
  SampleDisposalRecord,
  StudentRecord,
  HealthRecord,
  StaffRecord,
  LessonPlanRecord,
  TeacherSalaryRecord,
  FinanceTransaction,
  AuditLogRecord,
  ModuleId,
} from '@/types/preschool';

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
} from './mock-data';

const STORAGE_KEYS = {
  PIN: 'preschool_auth_pin',
  PIN_DISABLED: 'preschool_pin_disabled',
  SESSION: 'preschool_auth_session',
  SCHOOL_INFO: 'preschool_school_info',
  STEP1: 'preschool_module_step1',
  STEP2: 'preschool_module_step2',
  STEP3: 'preschool_module_step3',
  MENU: 'preschool_module_menu',
  SAMPLES: 'preschool_module_samples',
  STUDENTS: 'preschool_module_students',
  HEALTH: 'preschool_module_health',
  STAFF: 'preschool_module_staff',
  LESSONS: 'preschool_module_lessons',
  SALARIES: 'preschool_module_salaries',
  TRANSACTIONS: 'preschool_module_transactions',
  AUDIT_LOGS: 'preschool_audit_logs',
  APP_DEFAULTS: 'preschool_default_app_settings',
};

export const DEFAULT_PIN = '150520';

export interface AppDefaultSettings {
  nurseryCount: number;
  kindergartenCount: number;
  nurseryPrice: number;
  kindergartenPrice: number;
  step1Time: string;
  step2Time: string;
  step3Time: string;
  sampleTime: string;
  dateMode: 'range' | 'week' | 'month';
  includeSaturday: boolean;
  includeSunday: boolean;
}

export const DEFAULT_APP_SETTINGS: AppDefaultSettings = {
  nurseryCount: 30,
  kindergartenCount: 80,
  nurseryPrice: 30000,
  kindergartenPrice: 35000,
  step1Time: '06:30',
  step2Time: '09:30',
  step3Time: '10:30',
  sampleTime: '10:45',
  dateMode: 'range',
  includeSaturday: false,
  includeSunday: false,
};

export function getDefaultSettings(): AppDefaultSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.APP_DEFAULTS);
    if (saved) {
      return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(saved) };
    }
    const nC = localStorage.getItem('lightning_default_nursery_count');
    const kC = localStorage.getItem('lightning_default_kg_count');
    const nP = localStorage.getItem('lightning_default_nursery_price');
    const kP = localStorage.getItem('lightning_default_kg_price');
    return {
      ...DEFAULT_APP_SETTINGS,
      nurseryCount: nC !== null && nC !== '' ? Number(nC) : DEFAULT_APP_SETTINGS.nurseryCount,
      kindergartenCount: kC !== null && kC !== '' ? Number(kC) : DEFAULT_APP_SETTINGS.kindergartenCount,
      nurseryPrice: nP !== null && nP !== '' ? Number(nP) : DEFAULT_APP_SETTINGS.nurseryPrice,
      kindergartenPrice: kP !== null && kP !== '' ? Number(kP) : DEFAULT_APP_SETTINGS.kindergartenPrice,
    };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveDefaultSettings(settings: Partial<AppDefaultSettings>): AppDefaultSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  try {
    const current = getDefaultSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.APP_DEFAULTS, JSON.stringify(updated));
    if (settings.nurseryCount !== undefined) localStorage.setItem('lightning_default_nursery_count', String(settings.nurseryCount));
    if (settings.kindergartenCount !== undefined) localStorage.setItem('lightning_default_kg_count', String(settings.kindergartenCount));
    if (settings.nurseryPrice !== undefined) localStorage.setItem('lightning_default_nursery_price', String(settings.nurseryPrice));
    if (settings.kindergartenPrice !== undefined) localStorage.setItem('lightning_default_kg_price', String(settings.kindergartenPrice));
    return updated;
  } catch (e) {
    console.error('Lỗi khi lưu cấu hình mặc định:', e);
    return DEFAULT_APP_SETTINGS;
  }
}

// Check if PIN requirement is disabled (Single user mode)
// Defaults to true as requested by user to eliminate PIN entry friction
export function isPinDisabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.PIN_DISABLED);
    if (val === null) {
      localStorage.setItem(STORAGE_KEYS.PIN_DISABLED, 'true');
      return true;
    }
    return val === 'true';
  } catch {
    return true;
  }
}

export function setPinDisabled(disabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PIN_DISABLED, String(disabled));
    if (disabled) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, 'true');
    }
  } catch {
    // ignore
  }
}

export function getStoredPin(): string {
  if (typeof window === 'undefined') return DEFAULT_PIN;
  try {
    const pin = localStorage.getItem(STORAGE_KEYS.PIN);
    return pin || DEFAULT_PIN;
  } catch {
    return DEFAULT_PIN;
  }
}

export function savePin(newPin: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEYS.PIN, newPin);
    return true;
  } catch {
    return false;
  }
}

export function resetPinToDefault(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.PIN);
  } catch {
    // ignore
  }
}

export function getStoredSession(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    if (isPinDisabled()) return true;
    return sessionStorage.getItem(STORAGE_KEYS.SESSION) === 'true';
  } catch {
    return true;
  }
}

export function setStoredSession(authenticated: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (authenticated) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  } catch {
    // ignore
  }
}

// School Info persistence
export function getSchoolInfo(): SchoolInfo {
  if (typeof window === 'undefined') return initialSchoolInfo;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SCHOOL_INFO);
    return data ? JSON.parse(data) : initialSchoolInfo;
  } catch {
    return initialSchoolInfo;
  }
}

export function saveSchoolInfo(info: SchoolInfo): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOOL_INFO, JSON.stringify(info));
  } catch {
    // ignore
  }
}

// Helper to load generic array or fallback
function loadData<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function saveData<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Module data loaders & savers
export const moduleStorage = {
  getStep1: (): Step1Record[] => loadData(STORAGE_KEYS.STEP1, initialStep1Records),
  saveStep1: (d: Step1Record[]) => saveData(STORAGE_KEYS.STEP1, d),

  getStep2: (): Step2Record[] => loadData(STORAGE_KEYS.STEP2, initialStep2Records),
  saveStep2: (d: Step2Record[]) => saveData(STORAGE_KEYS.STEP2, d),

  getStep3: (): Step3Record[] => loadData(STORAGE_KEYS.STEP3, initialStep3Records),
  saveStep3: (d: Step3Record[]) => saveData(STORAGE_KEYS.STEP3, d),

  getMenu: (): MenuItem[] => loadData(STORAGE_KEYS.MENU, initialMenuItems),
  saveMenu: (d: MenuItem[]) => saveData(STORAGE_KEYS.MENU, d),

  getSamples: (): SampleDisposalRecord[] => loadData(STORAGE_KEYS.SAMPLES, initialSampleDisposalRecords),
  saveSamples: (d: SampleDisposalRecord[]) => saveData(STORAGE_KEYS.SAMPLES, d),

  getStudents: (): StudentRecord[] => loadData(STORAGE_KEYS.STUDENTS, initialStudents),
  saveStudents: (d: StudentRecord[]) => saveData(STORAGE_KEYS.STUDENTS, d),

  getHealth: (): HealthRecord[] => loadData(STORAGE_KEYS.HEALTH, initialHealthRecords),
  saveHealth: (d: HealthRecord[]) => saveData(STORAGE_KEYS.HEALTH, d),

  getStaff: (): StaffRecord[] => loadData(STORAGE_KEYS.STAFF, initialStaffRecords),
  saveStaff: (d: StaffRecord[]) => saveData(STORAGE_KEYS.STAFF, d),

  getLessons: (): LessonPlanRecord[] => loadData(STORAGE_KEYS.LESSONS, initialLessonPlans),
  saveLessons: (d: LessonPlanRecord[]) => saveData(STORAGE_KEYS.LESSONS, d),

  getSalaries: (): TeacherSalaryRecord[] => loadData(STORAGE_KEYS.SALARIES, initialSalaries),
  saveSalaries: (d: TeacherSalaryRecord[]) => saveData(STORAGE_KEYS.SALARIES, d),

  getTransactions: (): FinanceTransaction[] => loadData(STORAGE_KEYS.TRANSACTIONS, initialTransactions),
  saveTransactions: (d: FinanceTransaction[]) => saveData(STORAGE_KEYS.TRANSACTIONS, d),

  getAuditLogs: (): AuditLogRecord[] => loadData(STORAGE_KEYS.AUDIT_LOGS, []),
  saveAuditLogs: (logs: AuditLogRecord[]) => saveData(STORAGE_KEYS.AUDIT_LOGS, logs),
  addAuditLog: (logInput: Omit<AuditLogRecord, 'id' | 'timestamp' | 'displayTime'>): AuditLogRecord => {
    const currentLogs = moduleStorage.getAuditLogs();
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const displayTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const newRecord: AuditLogRecord = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: now.toISOString(),
      displayTime,
      ...logInput,
    };
    const updated = [newRecord, ...currentLogs].slice(0, 300);
    moduleStorage.saveAuditLogs(updated);
    return newRecord;
  },
  clearAuditLogs: () => {
    saveData(STORAGE_KEYS.AUDIT_LOGS, []);
  },

  resetAll: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.STEP1);
    localStorage.removeItem(STORAGE_KEYS.STEP2);
    localStorage.removeItem(STORAGE_KEYS.STEP3);
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.SAMPLES);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.HEALTH);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.LESSONS);
    localStorage.removeItem(STORAGE_KEYS.SALARIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SCHOOL_INFO);
    localStorage.removeItem(STORAGE_KEYS.APP_DEFAULTS);
    localStorage.removeItem('lightning_custom_dishes');
    localStorage.removeItem('lightning_custom_counts');
    localStorage.removeItem('preschool_custom_attendance');
    localStorage.removeItem('preschool_daily_student_statuses');
  },

  getAllSnapshot: () => {
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      schoolInfo: getSchoolInfo(),
      defaults: getDefaultSettings(),
      step1: moduleStorage.getStep1(),
      step2: moduleStorage.getStep2(),
      step3: moduleStorage.getStep3(),
      menu: moduleStorage.getMenu(),
      samples: moduleStorage.getSamples(),
      students: moduleStorage.getStudents(),
      health: moduleStorage.getHealth(),
      staff: moduleStorage.getStaff(),
      lessons: moduleStorage.getLessons(),
      salaries: moduleStorage.getSalaries(),
      transactions: moduleStorage.getTransactions(),
    };
  },

  restoreSnapshot: (data: any) => {
    if (!data || typeof data !== 'object') return false;
    if (data.schoolInfo) saveSchoolInfo(data.schoolInfo);
    if (data.defaults) saveDefaultSettings(data.defaults);
    if (Array.isArray(data.step1)) moduleStorage.saveStep1(data.step1);
    if (Array.isArray(data.step2)) moduleStorage.saveStep2(data.step2);
    if (Array.isArray(data.step3)) moduleStorage.saveStep3(data.step3);
    if (Array.isArray(data.menu)) moduleStorage.saveMenu(data.menu);
    if (Array.isArray(data.samples)) moduleStorage.saveSamples(data.samples);
    if (Array.isArray(data.students)) moduleStorage.saveStudents(data.students);
    if (Array.isArray(data.health)) moduleStorage.saveHealth(data.health);
    if (Array.isArray(data.staff)) moduleStorage.saveStaff(data.staff);
    if (Array.isArray(data.lessons)) moduleStorage.saveLessons(data.lessons);
    if (Array.isArray(data.salaries)) moduleStorage.saveSalaries(data.salaries);
    if (Array.isArray(data.transactions)) moduleStorage.saveTransactions(data.transactions);
    return true;
  },

  seedAllDefault: () => {
    saveSchoolInfo(initialSchoolInfo);
    moduleStorage.saveStep1(initialStep1Records);
    moduleStorage.saveStep2(initialStep2Records);
    moduleStorage.saveStep3(initialStep3Records);
    moduleStorage.saveMenu(initialMenuItems);
    moduleStorage.saveSamples(initialSampleDisposalRecords);
    moduleStorage.saveStudents(initialStudents);
    moduleStorage.saveHealth(initialHealthRecords);
    moduleStorage.saveStaff(initialStaffRecords);
    moduleStorage.saveLessons(initialLessonPlans);
    moduleStorage.saveSalaries(initialSalaries);
    moduleStorage.saveTransactions(initialTransactions);
  },

  clearAllData: () => {
    moduleStorage.saveStep1([]);
    moduleStorage.saveStep2([]);
    moduleStorage.saveStep3([]);
    moduleStorage.saveMenu([]);
    moduleStorage.saveSamples([]);
    moduleStorage.saveStudents([]);
    moduleStorage.saveHealth([]);
    moduleStorage.saveStaff([]);
    moduleStorage.saveLessons([]);
    moduleStorage.saveSalaries([]);
    moduleStorage.saveTransactions([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lightning_custom_dishes');
      localStorage.removeItem('lightning_custom_counts');
      localStorage.removeItem('preschool_custom_attendance');
      localStorage.removeItem('preschool_daily_student_statuses');
    }
  },
};

export const backupRestore = {
  getAllSnapshot: () => moduleStorage.getAllSnapshot(),
  restoreSnapshot: (data: any) => moduleStorage.restoreSnapshot(data),
  seedAllDefault: () => moduleStorage.seedAllDefault(),
  clearAllData: () => moduleStorage.clearAllData(),
  resetAll: () => moduleStorage.resetAll(),
};

/**
 * Export table data to CSV with UTF-8 BOM so Excel opens Vietnamese characters without garbled text.
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const processCell = (cell: string | number) => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(processCell).join(','),
    ...rows.map((row) => row.map(processCell).join(',')),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
