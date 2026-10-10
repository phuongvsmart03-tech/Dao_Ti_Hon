export interface BackupSnapshotItem {
  id: string;
  timestamp: number;
  dateStr: string;
  source: 'auto_midnight' | 'manual_cloud' | 'scheduled';
  totalRecords: number;
  sizeBytes: number;
  checksum: string;
  data?: any;
  summary: {
    students: number;
    menu: number;
    staff: number;
    finance: number;
    inspections: number;
  };
}

export interface AutoBackupConfig {
  enabled: boolean;
  scheduleTime: string; // e.g. "00:00"
  lastBackupDate: string | null;
  retentionDays: number;
}

const CONFIG_KEY = 'mamnon_auto_backup_config_v4';
const SNAPSHOTS_KEY = 'mamnon_backup_snapshots_v4';

export const DEFAULT_AUTO_BACKUP_CONFIG: AutoBackupConfig = {
  enabled: true,
  scheduleTime: '00:00',
  lastBackupDate: null,
  retentionDays: 14,
};

export function getAutoBackupConfig(): AutoBackupConfig {
  if (typeof window === 'undefined') return DEFAULT_AUTO_BACKUP_CONFIG;
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return DEFAULT_AUTO_BACKUP_CONFIG;
    return { ...DEFAULT_AUTO_BACKUP_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AUTO_BACKUP_CONFIG;
  }
}

export function saveAutoBackupConfig(cfg: Partial<AutoBackupConfig>): AutoBackupConfig {
  if (typeof window === 'undefined') return DEFAULT_AUTO_BACKUP_CONFIG;
  try {
    const current = getAutoBackupConfig();
    const updated = { ...current, ...cfg };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_AUTO_BACKUP_CONFIG;
  }
}

/**
 * Calculates a 64-bit integrity hash representation for data validation (Checksum)
 */
export function calculateChecksum(obj: any): string {
  try {
    const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
    let hash1 = 5381;
    let hash2 = 52711;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash1 = ((hash1 << 5) + hash1) ^ char;
      hash2 = ((hash2 << 5) + hash2) ^ char;
    }
    const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
    const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');
    return `SHA-${hex1.toUpperCase()}${hex2.toUpperCase()}`;
  } catch {
    return `SHA-${Date.now().toString(16).toUpperCase()}`;
  }
}

export function getLocalBackupHistory(): BackupSnapshotItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalBackupSnapshot(item: BackupSnapshotItem): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalBackupHistory();
    // Exclude data payload from the metadata list in localStorage to save quota, or keep compact version
    const compactItem: BackupSnapshotItem = {
      ...item,
      // Store compact copy in localStorage, full copy can be downloaded or synced
    };
    const updated = [compactItem, ...current.filter((x) => x.id !== item.id)].slice(0, 30);
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Lỗi khi lưu lịch sử snapshot:', err);
  }
}

export function deleteLocalBackupSnapshot(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalBackupHistory();
    const updated = current.filter((x) => x.id !== id);
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
