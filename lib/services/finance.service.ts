import type { Client } from '@libsql/client';
import { FinanceTransaction, TeacherSalaryRecord } from '@/types/preschool';

export interface FinanceQueryParams {
  fromDate?: string;
  toDate?: string;
  month?: string;
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface SalaryQueryParams {
  month?: string;
  staffId?: string;
  limit?: number;
  offset?: number;
}

export class FinanceService {
  /**
   * FINANCE TRANSACTIONS - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertTransactionsBatch(db: Client, records: FinanceTransaction[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(f => ({
      sql: `INSERT INTO finance_transactions (
        id, date, type, category, amount, payer_or_receiver,
        method, receipt_number, notes, is_automatic_sync, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        date = excluded.date,
        type = excluded.type,
        category = excluded.category,
        amount = excluded.amount,
        payer_or_receiver = excluded.payer_or_receiver,
        method = excluded.method,
        receipt_number = excluded.receipt_number,
        notes = excluded.notes,
        is_automatic_sync = excluded.is_automatic_sync,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= finance_transactions.updated_at`,
      args: [
        f.id,
        f.date,
        f.type,
        f.category,
        f.amount,
        f.payerOrReceiver,
        f.method,
        f.receiptNumber || null,
        f.notes || '',
        f.isAutomaticSync ? 1 : 0,
        (f as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getTransactions(db: Client, params: FinanceQueryParams = {}): Promise<FinanceTransaction[]> {
    let sql = `SELECT * FROM finance_transactions WHERE 1=1`;
    const args: any[] = [];

    if (params.fromDate && params.toDate) {
      sql += ` AND date BETWEEN ? AND ?`;
      args.push(params.fromDate, params.toDate);
    } else if (params.month) {
      sql += ` AND substr(date, 1, 7) = ?`;
      args.push(params.month);
    }
    if (params.type) {
      sql += ` AND type = ?`;
      args.push(params.type);
    }
    if (params.category) {
      sql += ` AND category = ?`;
      args.push(params.category);
    }

    sql += ` ORDER BY date DESC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      type: row.type,
      category: row.category,
      amount: Number(row.amount),
      payerOrReceiver: row.payer_or_receiver,
      method: row.method,
      receiptNumber: row.receipt_number || undefined,
      notes: row.notes || '',
      isAutomaticSync: Boolean(row.is_automatic_sync),
      updated_at: row.updated_at,
    }));
  }

  /**
   * TEACHER SALARIES - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertSalariesBatch(db: Client, records: TeacherSalaryRecord[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(s => ({
      sql: `INSERT INTO teacher_salaries (
        id, staff_id, staff_name, role, assigned_class, month,
        base_salary, allowance_responsibility, allowance_lunch, allowance_other,
        bonus, insurance_deduction, advance_payment, other_deductions,
        work_days_standard, work_days_actual, net_salary,
        payment_status, payment_method, bank_account, bank_name, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        staff_id = excluded.staff_id,
        staff_name = excluded.staff_name,
        role = excluded.role,
        assigned_class = excluded.assigned_class,
        month = excluded.month,
        base_salary = excluded.base_salary,
        allowance_responsibility = excluded.allowance_responsibility,
        allowance_lunch = excluded.allowance_lunch,
        allowance_other = excluded.allowance_other,
        bonus = excluded.bonus,
        insurance_deduction = excluded.insurance_deduction,
        advance_payment = excluded.advance_payment,
        other_deductions = excluded.other_deductions,
        work_days_standard = excluded.work_days_standard,
        work_days_actual = excluded.work_days_actual,
        net_salary = excluded.net_salary,
        payment_status = excluded.payment_status,
        payment_method = excluded.payment_method,
        bank_account = excluded.bank_account,
        bank_name = excluded.bank_name,
        notes = excluded.notes,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= teacher_salaries.updated_at`,
      args: [
        s.id,
        s.staffId || null,
        s.staffName,
        s.role,
        s.assignedClass || '',
        s.month,
        s.baseSalary,
        s.allowanceResponsibility,
        s.allowanceLunch,
        s.allowanceOther,
        s.bonus,
        s.insuranceDeduction,
        s.advancePayment,
        s.otherDeductions,
        s.workDaysStandard,
        s.workDaysActual,
        s.netSalary,
        s.paymentStatus,
        s.paymentMethod,
        s.bankAccount || null,
        s.bankName || null,
        s.notes || '',
        (s as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getSalaries(db: Client, params: SalaryQueryParams = {}): Promise<TeacherSalaryRecord[]> {
    let sql = `SELECT * FROM teacher_salaries WHERE 1=1`;
    const args: any[] = [];

    if (params.month) {
      sql += ` AND month = ?`;
      args.push(params.month);
    }
    if (params.staffId) {
      sql += ` AND staff_id = ?`;
      args.push(params.staffId);
    }

    sql += ` ORDER BY month DESC, staff_name ASC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      staffId: row.staff_id || undefined,
      staffName: row.staff_name,
      role: row.role,
      assignedClass: row.assigned_class || '',
      month: row.month,
      baseSalary: Number(row.base_salary),
      allowanceResponsibility: Number(row.allowance_responsibility),
      allowanceLunch: Number(row.allowance_lunch),
      allowanceOther: Number(row.allowance_other),
      bonus: Number(row.bonus),
      insuranceDeduction: Number(row.insurance_deduction),
      advancePayment: Number(row.advance_payment),
      otherDeductions: Number(row.other_deductions),
      workDaysStandard: Number(row.work_days_standard),
      workDaysActual: Number(row.work_days_actual),
      netSalary: Number(row.net_salary),
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      bankAccount: row.bank_account || undefined,
      bankName: row.bank_name || undefined,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }
}

