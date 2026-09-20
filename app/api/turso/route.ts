import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';
import { ensureTablesInitialized } from '@/lib/services/db-schema';
import { InspectionService } from '@/lib/services/inspection.service';
import { MenuService } from '@/lib/services/menu.service';
import { StudentService } from '@/lib/services/student.service';
import { FinanceService } from '@/lib/services/finance.service';
import { StaffLessonService } from '@/lib/services/staff-lesson.service';
import { SyncService } from '@/lib/services/sync.service';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

/**
 * GET Handler: Tải dữ liệu từ Turso Cloud Database
 * Hỗ trợ bộ lọc thời gian (month, academicYear, fromDate, toDate, limit, offset) để tăng tốc tải ban đầu
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

  const db = getTursoClient();
  if (!db) {
    return NextResponse.json({
      connected: false,
      configured: false,
      message: 'Turso client is not configured (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN missing)',
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'all';
    const month = searchParams.get('month') || undefined;
    const academicYear = searchParams.get('academicYear') || undefined;
    const fromDate = searchParams.get('fromDate') || undefined;
    const toDate = searchParams.get('toDate') || undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const offsetParam = searchParams.get('offset');
    const offset = offsetParam ? parseInt(offsetParam, 10) : undefined;

    await ensureTablesInitialized(db);

    if (action === 'school_info') {
      const schoolInfo = await StaffLessonService.getSchoolInfo(db);
      return NextResponse.json({ connected: true, configured: true, schoolInfo });
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

    // Default 'all': Tải dữ liệu toàn hệ thống (áp dụng bộ lọc thời gian nếu có)
    const [
      schoolInfo,
      step1,
      step2,
      step3,
      sampleDisposals,
      menuItems,
      dishBreakdowns,
      students,
      healthRecords,
      staffMembers,
      lessonPlans,
      teacherSalaries,
      financeTransactions,
    ] = await Promise.all([
      StaffLessonService.getSchoolInfo(db),
      InspectionService.getStep1Records(db, { fromDate, toDate, month, limit, offset }),
      InspectionService.getStep2Records(db, { fromDate, toDate, month, limit, offset }),
      InspectionService.getStep3Records(db, { fromDate, toDate, month, limit, offset }),
      InspectionService.getSampleDisposalRecords(db, { fromDate, toDate, month, limit, offset }),
      MenuService.getMenuItems(db, { month }),
      MenuService.getDishBreakdowns(db),
      StudentService.getStudents(db),
      StudentService.getHealthRecords(db),
      StaffLessonService.getStaffMembers(db),
      StaffLessonService.getLessonPlans(db),
      FinanceService.getSalaries(db, { month }),
      FinanceService.getTransactions(db, { fromDate, toDate, month }),
    ]);

    return NextResponse.json({
      connected: true,
      configured: true,
      schoolInfo,
      step1,
      step2,
      step3,
      sampleDisposals,
      menuItems,
      dishBreakdowns,
      students,
      healthRecords,
      staffMembers,
      lessonPlans,
      teacherSalaries,
      financeTransactions,
      counts: {
        step1: step1.length,
        step2: step2.length,
        step3: step3.length,
        sampleDisposals: sampleDisposals.length,
        menuItems: menuItems.length,
        students: students.length,
        healthRecords: healthRecords.length,
        staffMembers: staffMembers.length,
        lessonPlans: lessonPlans.length,
        teacherSalaries: teacherSalaries.length,
        financeTransactions: financeTransactions.length,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/turso:', error);
    return NextResponse.json(
      {
        connected: false,
        configured: true,
        error: error.message || 'Lỗi khi đọc dữ liệu từ Turso Database',
      },
      { status: 500 }
    );
  }
}

/**
 * POST Handler: Ghi và Đồng bộ dữ liệu lên Turso Cloud Database
 * Áp dụng Transaction Atomic (`db.batch`) và Cơ chế xung đột Last-Write-Wins
 */
export async function POST(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, { limit: 90, windowMs: 60 * 1000, keyPrefix: 'turso-post' });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Thao tác đồng bộ quá dày đặc. Vui lòng thử lại sau ${rateLimit.retryAfterSec}s.` },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSec) } }
    );
  }

  const db = getTursoClient();
  if (!db) {
    return NextResponse.json(
      {
        success: false,
        error: 'Turso client is not configured (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN missing)',
      },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { action, module: moduleName, data, payload } = body;
    await ensureTablesInitialized(db);

    // 1. Đồng bộ từng module (Sync Module with Upsert & LWW)
    if (action === 'sync_module') {
      const targetData = data || payload;
      let count = 0;

      switch (moduleName) {
        case 'school_info':
          if (targetData) {
            await StaffLessonService.upsertSchoolInfo(db, targetData);
            count = 1;
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
          if (Array.isArray(targetData)) {
            const res = await InspectionService.upsertSampleDisposalsBatch(db, targetData);
            count = res.count;
          }
          break;

        case 'menu_items':
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

        case 'students':
          if (Array.isArray(targetData)) {
            const res = await StudentService.upsertStudentsBatch(db, targetData);
            count = res.count;
          }
          break;

        case 'student_health_records':
          if (Array.isArray(targetData)) {
            const res = await StudentService.upsertHealthRecordsBatch(db, targetData);
            count = res.count;
          }
          break;

        case 'staff_members':
          if (Array.isArray(targetData)) {
            const res = await StaffLessonService.upsertStaffBatch(db, targetData);
            count = res.count;
          }
          break;

        case 'lesson_plans':
          if (Array.isArray(targetData)) {
            const res = await StaffLessonService.upsertLessonPlansBatch(db, targetData);
            count = res.count;
          }
          break;

        case 'teacher_salaries':
          if (Array.isArray(targetData)) {
            const res = await FinanceService.upsertSalariesBatch(db, targetData);
            count = res.count;
          }
          break;

        case 'finance_transactions':
          if (Array.isArray(targetData)) {
            const res = await FinanceService.upsertTransactionsBatch(db, targetData);
            count = res.count;
          }
          break;

        default:
          return NextResponse.json({ success: false, error: `Module '${moduleName}' không hợp lệ.` }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `Đồng bộ thành công ${count} bản ghi của phân hệ '${moduleName}'.`,
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
      // Yêu cầu xác nhận an toàn
      const confirmText = body.confirmation;
      if (confirmText !== 'XAC_NHAN_XOA_TOAN_BO_DU_LIEU') {
        return NextResponse.json(
          {
            success: false,
            error: 'Thao tác nguy hiểm yêu cầu mã xác thực: confirmation = "XAC_NHAN_XOA_TOAN_BO_DU_LIEU"',
          },
          { status: 403 }
        );
      }

      await SyncService.resetAllDataAtomic(db);
      return NextResponse.json({
        success: true,
        message: 'Đã xóa trắng toàn bộ dữ liệu trên Turso Cloud Database trong 1 transaction an toàn.',
      });
    }

    return NextResponse.json({ success: false, error: `Action '${action}' không được hỗ trợ.` }, { status: 400 });
  } catch (error: any) {
    console.error('Error in POST /api/turso:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi khi ghi dữ liệu lên Turso Database',
      },
      { status: 500 }
    );
  }
}
