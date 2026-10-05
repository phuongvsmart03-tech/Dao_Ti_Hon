import type { Client } from '@libsql/client';
import { AuditLogRecord } from '@/types/preschool';
import { AppDefaultSettings, DEFAULT_APP_SETTINGS } from '@/lib/storage';

export class SystemSettingsService {
  /**
   * Lấy cấu hình mặc định toàn hệ thống (Sĩ số, đơn giá ăn, khung giờ)
   */
  static async getAppSettings(db: Client): Promise<AppDefaultSettings> {
    try {
      const res = await db.execute({
        sql: `SELECT value_json FROM app_settings WHERE key = 'app_default_settings' LIMIT 1;`,
        args: [],
      });
      if (res.rows.length > 0 && res.rows[0].value_json) {
        return JSON.parse(res.rows[0].value_json as string);
      }
    } catch (err) {
      console.error('Error fetching app settings:', err);
    }
    return DEFAULT_APP_SETTINGS;
  }

  /**
   * Cập nhật cấu hình mặc định toàn hệ thống
   */
  static async upsertAppSettings(db: Client, settings: AppDefaultSettings): Promise<void> {
    const now = Date.now();
    await db.execute({
      sql: `INSERT INTO app_settings (id, key, value_json, updated_at)
            VALUES ('default_settings', 'app_default_settings', ?, ?)
            ON CONFLICT(key) DO UPDATE SET
              value_json = excluded.value_json,
              updated_at = excluded.updated_at;`,
      args: [JSON.stringify(settings), now],
    });
  }

  /**
   * Lấy danh sách nhật ký thao tác
   */
  static async getAuditLogs(db: Client, limit = 100): Promise<AuditLogRecord[]> {
    try {
      const res = await db.execute({
        sql: `SELECT * FROM audit_logs ORDER BY updated_at DESC, timestamp DESC LIMIT ?;`,
        args: [limit],
      });
      return res.rows.map((row) => ({
        id: row.id as string,
        timestamp: row.timestamp as string,
        displayTime: row.display_time as string,
        action: row.action as any,
        actionLabel: row.action_label as string,
        module: row.module as any,
        moduleName: row.module_name as string,
        description: row.description as string,
        canUndo: Boolean(row.can_undo),
        previousData: row.previous_data_json ? JSON.parse(row.previous_data_json as string) : undefined,
        targetId: (row.target_id as string) || undefined,
      }));
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      return [];
    }
  }

  /**
   * Lưu danh sách nhật ký thao tác
   */
  static async upsertAuditLogsBatch(db: Client, logs: AuditLogRecord[]): Promise<void> {
    if (!logs || logs.length === 0) return;
    const now = Date.now();
    const batch = logs.map((log) => ({
      sql: `INSERT INTO audit_logs (
              id, timestamp, display_time, action, action_label,
              module, module_name, description, can_undo,
              previous_data_json, target_id, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              timestamp = excluded.timestamp,
              display_time = excluded.display_time,
              action = excluded.action,
              action_label = excluded.action_label,
              module = excluded.module,
              module_name = excluded.module_name,
              description = excluded.description,
              can_undo = excluded.can_undo,
              previous_data_json = excluded.previous_data_json,
              target_id = excluded.target_id,
              updated_at = excluded.updated_at;`,
      args: [
        log.id,
        log.timestamp || new Date().toISOString(),
        log.displayTime || new Date().toLocaleTimeString('vi-VN'),
        log.action,
        log.actionLabel,
        log.module,
        log.moduleName,
        log.description,
        log.canUndo ? 1 : 0,
        log.previousData ? JSON.stringify(log.previousData) : null,
        log.targetId || null,
        now,
      ],
    }));

    await db.batch(batch, 'write');
  }

  /**
   * Lấy trạng thái tùy biến Kiểm Thực Chớp Nhoáng (đổi món, đổi sĩ số theo từng ngày)
   */
  static async getLightningState(db: Client): Promise<{
    customDishes: Record<string, any>;
    customCounts: Record<string, any>;
    defaultSettings?: AppDefaultSettings;
  }> {
    try {
      const res = await db.execute({
        sql: `SELECT * FROM lightning_state WHERE id = 'main_state' LIMIT 1;`,
        args: [],
      });
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          customDishes: row.custom_dishes_json ? JSON.parse(row.custom_dishes_json as string) : {},
          customCounts: row.custom_counts_json ? JSON.parse(row.custom_counts_json as string) : {},
          defaultSettings: row.default_settings_json ? JSON.parse(row.default_settings_json as string) : undefined,
        };
      }
    } catch (err) {
      console.error('Error fetching lightning state:', err);
    }
    return { customDishes: {}, customCounts: {} };
  }

  /**
   * Lưu trạng thái tùy biến Kiểm Thực Chớp Nhoáng
   */
  static async upsertLightningState(
    db: Client,
    state: {
      customDishes?: Record<string, any>;
      customCounts?: Record<string, any>;
      defaultSettings?: AppDefaultSettings;
    }
  ): Promise<void> {
    const now = Date.now();
    await db.execute({
      sql: `INSERT INTO lightning_state (id, custom_dishes_json, custom_counts_json, default_settings_json, updated_at)
            VALUES ('main_state', ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              custom_dishes_json = excluded.custom_dishes_json,
              custom_counts_json = excluded.custom_counts_json,
              default_settings_json = excluded.default_settings_json,
              updated_at = excluded.updated_at;`,
      args: [
        JSON.stringify(state.customDishes || {}),
        JSON.stringify(state.customCounts || {}),
        state.defaultSettings ? JSON.stringify(state.defaultSettings) : null,
        now,
      ],
    });
  }
}
