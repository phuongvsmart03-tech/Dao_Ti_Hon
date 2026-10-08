import { NextRequest, NextResponse } from 'next/server';
import { runTursoQuery } from '@/lib/turso';
import { ensureTablesInitialized } from '@/lib/services/db-schema';
import { InspectionService } from '@/lib/services/inspection.service';
import { MenuService } from '@/lib/services/menu.service';
import { StudentService } from '@/lib/services/student.service';
import { FinanceService } from '@/lib/services/finance.service';
import { StaffLessonService } from '@/lib/services/staff-lesson.service';
import { SystemSettingsService } from '@/lib/services/system-settings.service';
import { SyncService } from '@/lib/services/sync.service';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

/**
 * GET Handler: Tải dữ liệu từ Master Database
 */
export async function GET(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, { limit: 120, windowMs: 60 * 1000, keyPrefix: 'turso-get' });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Tần suất truy vấn quá nhanh. Vui lòng đợi ${rateLimit.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSec) } }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'all';
    const month = searchParams.get('month') || undefined;
    const fromDate = searchParams.get('fromDate') || undefined;
    const toDate = searchParams.get('toDate') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offsetParam = searchParams.get('offset');
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    return await runTursoQuery(async (db) => {
      await ensureTablesInitialized(db);

      if (action === 'school_info') {
        const schoolInfo = await StaffLessonService.getSchoolInfo(db);
        return NextResponse.json({ connected: true, configured: true, schoolInfo });
      }

      if (action === 'default_settings' || action === 'settings') {
        const defaultSettings = await SystemSettingsService.getAppSettings(db);
        return NextResponse.json({ connected: true, configured: true, defaultSettings });
      }

      if (action === 'lightning_state') {
        const lightningState = await SystemSettingsService.getLightningState(db);
        return NextResponse.json({ connected: true, configured: true, lightningState });
      }

      if (action === 'audit_logs') {
        const auditLogs = await SystemSettingsService.getAuditLogs(db, limit || 100);
        return NextResponse.json({ connected: true, configured: true, auditLogs });
      }

      if (action === 'step1') {
        const step1 = await InspectionService.getStep1Records(db, { fromDate, toDate, month, limit, offset });
        return NextResponse.json({ connected: true, configured: true, step1 });
      }

      if (action === 'menu') {
        const menuItems = await MenuService.getMenuItems(db, { month, limit, offset });
        const dishBreakdowns = await MenuService.getDishBreakdowns(db);
        return NextResponse.json({ connected: true, configured: true, menuItems, dishBreakdowns });
      }

      if (action === 'students') {
        const students = await StudentService.getStudents(db, { limit, offset });
        const healthRecords = await StudentService.getHealthRecords(db, { limit, offset });
        return NextResponse.json({ connected: true, configured: true, students, healthRecords });
      }

      if (action === 'finance') {
        const financeTransactions = await FinanceService.getTransactions(db, { fromDate, toDate, month, limit, offset });
        const teacherSalaries = await FinanceService.getSalaries(db, { month, limit, offset });
        return NextResponse.json({ connected: true, configured: true, financeTransactions, teacherSalaries });
      }

      if (action === 'dish_library' || action === 'dishLibrary') {
        const dishLibrary = await MenuService.getDishLibrary(db);
        return NextResponse.json({ connected: true, configured: true, dishLibrary });
      }

      // Default 'all': Tải dữ liệu toàn hệ thống đồng bộ cho tất cả các thiết bị
      const [
        schoolInfo,
        defaultSettings,
        lightningState,
        auditLogs,
        step1,
        step2,
        step3,
        sampleDisposals,
        menuItems,
        dishBreakdowns,
        dishLibrary,
        students,
        healthRecords,
        staffMembers,
        lessonPlans,
        teacherSalaries,
        financeTransactions,
      ] = await Promise.all([
        StaffLessonService.getSchoolInfo(db),
        SystemSettingsService.getAppSettings(db),
        SystemSettingsService.getLightningState(db),
        SystemSettingsService.getAuditLogs(db, 100),
        InspectionService.getStep1Records(db, { fromDate, toDate, month, limit, offset }),
        InspectionService.getStep2Records(db, { fromDate, toDate, month, limit, offset }),
        InspectionService.getStep3Records(db, { fromDate, toDate, month, limit, offset }),
        InspectionService.getSampleDisposalRecords(db, { fromDate, toDate, month, limit, offset }),
        MenuService.getMenuItems(db, { month }),
        MenuService.getDishBreakdowns(db),
        MenuService.getDishLibrary(db),
        StudentService.getStudents(db),
        StudentService.getHealthRecords(db),
        StaffLessonService.getStaffMembers(db),
        StaffLessonService.getLessonPlans(db),
        FinanceService.getSalaries(db, { month }),
        FinanceService.getTransactions(db, { fromDate, toDate, month }),
      ]);

      let deletedSet = new Set<string>();
      try {
        const delRes = await db.execute(`SELECT id FROM deleted_records`);
        deletedSet = new Set(delRes.rows.map((r: any) => String(r.id)));
      } catch {
        // ignore
      }

      const fDel = (arr: any[]) => Array.isArray(arr) ? arr.filter((item) => !item?.id || !deletedSet.has(String(item.id))) : arr;

      return NextResponse.json({
        connected: true,
        configured: true,
        schoolInfo,
        defaultSettings,
        lightningState,
        auditLogs,
        step1: fDel(step1),
        step2: fDel(step2),
        step3: fDel(step3),
        sampleDisposals: fDel(sampleDisposals),
        menuItems: fDel(menuItems),
        dishBreakdowns,
        dishLibrary: fDel(dishLibrary),
        students: fDel(students),
        healthRecords: fDel(healthRecords),
        staffMembers: fDel(staffMembers),
        lessonPlans: fDel(lessonPlans),
        teacherSalaries: fDel(teacherSalaries),
        financeTransactions: fDel(financeTransactions),
        counts: {
          step1: step1.length,
          step2: step2.length,
          step3: step3.length,
          sampleDisposals: sampleDisposals.length,
          menuItems: menuItems.length,
          dishLibrary: dishLibrary.length,
          students: students.length,
          healthRecords: healthRecords.length,
          staffMembers: staffMembers.length,
          lessonPlans: lessonPlans.length,
          teacherSalaries: teacherSalaries.length,
          financeTransactions: financeTransactions.length,
        },
      });
    });
  } catch (error: any) {
    console.error('Error in GET /api/turso:', error);
    return NextResponse.json(
      {
        connected: false,
        configured: true,
        error: error.message || 'Lỗi khi đọc dữ liệu từ Database',
      },
      { status: 500 }
    );
  }
}

/**
 * POST Handler: Ghi và Đồng bộ dữ liệu lên Master Database
 */
export async function POST(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, { limit: 120, windowMs: 60 * 1000, keyPrefix: 'turso-post' });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Thao tác đồng bộ quá dày đặc. Vui lòng thử lại sau ${rateLimit.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSec) } }
    );
  }

  try {
    const body = await req.json();
    const { action, module: moduleName, data, payload } = body;

    return await runTursoQuery(async (db) => {
      await ensureTablesInitialized(db);

      // Xử lý lưu School Info
      if (action === 'save_school_info') {
        const targetData = payload || data || body.schoolInfo;
        if (targetData) {
          await StaffLessonService.upsertSchoolInfo(db, targetData);
        }
        return NextResponse.json({ success: true, message: 'Đã lưu thông tin trường lên máy chủ thành công' });
      }

      // Xử lý lưu Default Settings (Sĩ số NT/MG, tiền ăn, khung giờ)
      if (action === 'save_default_settings') {
        const targetSettings = payload || data || body.defaultSettings;
        if (targetSettings) {
          await SystemSettingsService.upsertAppSettings(db, targetSettings);
        }
        return NextResponse.json({ success: true, message: 'Đã lưu cấu hình mặc định lên máy chủ thành công' });
      }

      // Xử lý lưu Lightning State (đổi món, đổi sĩ số theo ngày)
      if (action === 'save_lightning_state') {
        const targetState = payload || data || body.lightningState;
        if (targetState) {
          await SystemSettingsService.upsertLightningState(db, targetState);
        }
        return NextResponse.json({ success: true, message: 'Đã lưu trạng thái kiểm thực lên máy chủ thành công' });
      }

      // Xử lý lưu Audit Logs
      if (action === 'save_audit_logs') {
        const logs = Array.isArray(payload) ? payload : Array.isArray(data) ? data : body.auditLogs;
        if (Array.isArray(logs)) {
          await SystemSettingsService.upsertAuditLogsBatch(db, logs);
        }
        return NextResponse.json({ success: true, message: 'Đã lưu nhật ký thao tác lên máy chủ thành công' });
      }

      // Xử lý Xóa 1 bản ghi trực tiếp trên Database
      if (action === 'delete_record') {
        const targetModule = moduleName || body.moduleId || body.targetModule;
        const targetId = body.id || payload?.id || data?.id;
        if (!targetModule || !targetId) {
          return NextResponse.json({ success: false, error: 'Thiếu targetModule hoặc targetId' }, { status: 400 });
        }
        const tableMap: Record<string, string> = {
          step1: 'step1_inspections',
          step2: 'step2_cookings',
          step3: 'step3_tastings',
          samples: 'sample_disposals',
          sample_disposals: 'sample_disposals',
          menu: 'menu_items',
          menu_items: 'menu_items',
          students: 'students',
          health: 'health_records',
          student_health_records: 'health_records',
          staff: 'staff',
          staff_members: 'staff',
          lessons: 'lesson_plans',
          lessonPlans: 'lesson_plans',
          lesson_plans: 'lesson_plans',
          salaries: 'teacher_salaries',
          teacher_salaries: 'teacher_salaries',
          finance: 'finance_transactions',
          finance_transactions: 'finance_transactions',
          dishes: 'dish_library',
          dish_library: 'dish_library',
        };
        const tableName = tableMap[targetModule];
        if (tableName) {
          await db.batch([
            {
              sql: `DELETE FROM ${tableName} WHERE id = ?`,
              args: [targetId],
            },
            {
              sql: `INSERT INTO deleted_records (id, module, deleted_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET deleted_at = excluded.deleted_at`,
              args: [targetId, targetModule, Date.now()],
            },
          ], 'write');
          return NextResponse.json({ success: true, message: `Đã xóa bản ghi ${targetId} khỏi bảng ${tableName} và lưu vào danh sách xóa vĩnh viễn` });
        }
        return NextResponse.json({ success: false, error: `Không tìm thấy bảng cho module '${targetModule}'` }, { status: 400 });
      }

      // 1. Đồng bộ từng module (Sync Module with Upsert & LWW - Filter out deleted records to prevent resurrection)
      if (action === 'sync_module') {
        const targetModule = moduleName || body.moduleId || body.payload?.moduleId;
        const rawTargetData = data || payload?.items || payload;

        // Lấy danh sách ID đã bị xóa để chặn hồi sinh
        let targetData = rawTargetData;
        try {
          const deletedRes = await db.execute(`SELECT id FROM deleted_records`);
          const deletedSet = new Set(deletedRes.rows.map((r: any) => String(r.id)));
          if (Array.isArray(rawTargetData)) {
            targetData = rawTargetData.filter((item: any) => !item?.id || !deletedSet.has(String(item.id)));
          }
        } catch {
          // ignore
        }

        let count = 0;

        switch (targetModule) {
          case 'school_info':
            if (targetData) {
              await StaffLessonService.upsertSchoolInfo(db, targetData);
              count = 1;
            }
            break;

          case 'default_settings':
          case 'settings':
            if (targetData) {
              await SystemSettingsService.upsertAppSettings(db, targetData);
              count = 1;
            }
            break;

          case 'lightning_state':
          case 'lightning':
            if (targetData) {
              await SystemSettingsService.upsertLightningState(db, targetData);
              count = 1;
            }
            break;

          case 'audit_logs':
          case 'logs':
            if (Array.isArray(targetData)) {
              await SystemSettingsService.upsertAuditLogsBatch(db, targetData);
              count = targetData.length;
            }
            break;

          case 'step1':
            if (Array.isArray(targetData)) {
              const res = await InspectionService.upsertStep1Batch(db, targetData);
              count = res.count;
            }
            break;

          case 'step2':
            if (Array.isArray(targetData)) {
              const res = await InspectionService.upsertStep2Batch(db, targetData);
              count = res.count;
            }
            break;

          case 'step3':
            if (Array.isArray(targetData)) {
              const res = await InspectionService.upsertStep3Batch(db, targetData);
              count = res.count;
            }
            break;

          case 'sample_disposals':
          case 'samples':
            if (Array.isArray(targetData)) {
              const res = await InspectionService.upsertSampleDisposalsBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'menu_items':
          case 'menu':
            if (Array.isArray(targetData)) {
              const res = await MenuService.upsertMenuItemsBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'dish_breakdowns':
            if (Array.isArray(targetData)) {
              const res = await MenuService.upsertDishBreakdownsBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'dish_library':
          case 'dishLibrary':
          case 'dishes':
            if (Array.isArray(targetData)) {
              const res = await MenuService.upsertDishLibraryBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'students':
            if (Array.isArray(targetData)) {
              const res = await StudentService.upsertStudentsBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'student_health_records':
          case 'health':
            if (Array.isArray(targetData)) {
              const res = await StudentService.upsertHealthRecordsBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'staff_members':
          case 'staff':
            if (Array.isArray(targetData)) {
              const res = await StaffLessonService.upsertStaffBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'lesson_plans':
          case 'lessonPlans':
            if (Array.isArray(targetData)) {
              const res = await StaffLessonService.upsertLessonPlansBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'teacher_salaries':
          case 'salaries':
            if (Array.isArray(targetData)) {
              const res = await FinanceService.upsertSalariesBatch(db, targetData);
              count = res.count;
            }
            break;

          case 'finance_transactions':
          case 'finance':
            if (Array.isArray(targetData)) {
              const res = await FinanceService.upsertTransactionsBatch(db, targetData);
              count = res.count;
            }
            break;

          default:
            return NextResponse.json({ success: false, error: `Module '${targetModule}' không hợp lệ.` }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: `Đồng bộ thành công ${count} bản ghi của phân hệ '${targetModule}'.`,
          count,
          syncedAt: new Date().toISOString(),
        });
      }

      // 2. Xuất bản sao lưu toàn bộ (Export Full Backup)
      if (action === 'export_full_backup') {
        const snapshot = await SyncService.exportFullSnapshot(db);
        return NextResponse.json({
          success: true,
          snapshot,
        });
      }

      // 3. Khôi phục toàn bộ bản sao lưu (Atomic Restore Full Snapshot via db.batch)
      if (action === 'restore_full_snapshot') {
        const snapshot = data || payload;
        if (!snapshot) {
          return NextResponse.json({ success: false, error: 'Không tìm thấy dữ liệu snapshot để khôi phục.' }, { status: 400 });
        }

        const result = await SyncService.restoreFullSnapshotAtomic(db, snapshot);
        return NextResponse.json({
          success: true,
          message: `Khôi phục nguyên tử thành công ${result.totalRecords} bản ghi từ bản sao lưu.`,
          totalRecords: result.totalRecords,
        });
      }

      // 4. Xóa sạch toàn bộ dữ liệu (Reset All Data Atomic)
      if (action === 'reset_all_data') {
        await SyncService.resetAllDataAtomic(db);
        return NextResponse.json({
          success: true,
          message: 'Đã xóa trắng toàn bộ dữ liệu trên Master Database.',
        });
      }

      return NextResponse.json({ success: false, error: `Action '${action}' không được hỗ trợ.` }, { status: 400 });
    });
  } catch (error: any) {
    console.error('Error in POST /api/turso:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi khi ghi dữ liệu lên Master Database',
      },
      { status: 500 }
    );
  }
}
