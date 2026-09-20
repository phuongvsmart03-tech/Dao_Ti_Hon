import type { Client } from '@libsql/client';
import { StudentRecord, HealthRecord } from '@/types/preschool';

export interface StudentQueryParams {
  className?: string;
  limit?: number;
  offset?: number;
}

export interface HealthQueryParams {
  studentId?: string;
  checkDate?: string;
  limit?: number;
  offset?: number;
}

export class StudentService {
  /**
   * STUDENTS - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertStudentsBatch(db: Client, records: StudentRecord[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(s => ({
      sql: `INSERT INTO students (
        id, student_code, full_name, dob, gender, class_name, parent_name,
        parent_phone, address, attendance_status, allergies_or_diet,
        enrollment_date, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        student_code = excluded.student_code,
        full_name = excluded.full_name,
        dob = excluded.dob,
        gender = excluded.gender,
        class_name = excluded.class_name,
        parent_name = excluded.parent_name,
        parent_phone = excluded.parent_phone,
        address = excluded.address,
        attendance_status = excluded.attendance_status,
        allergies_or_diet = excluded.allergies_or_diet,
        enrollment_date = excluded.enrollment_date,
        notes = excluded.notes,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= students.updated_at`,
      args: [
        s.id,
        s.studentCode,
        s.fullName,
        s.dob,
        s.gender,
        s.className,
        s.parentName,
        s.parentPhone,
        s.address,
        s.attendanceStatus,
        s.allergiesOrDiet || '',
        s.enrollmentDate,
        s.notes || '',
        (s as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getStudents(db: Client, params: StudentQueryParams = {}): Promise<StudentRecord[]> {
    let sql = `SELECT * FROM students WHERE 1=1`;
    const args: any[] = [];

    if (params.className) {
      sql += ` AND class_name = ?`;
      args.push(params.className);
    }

    sql += ` ORDER BY class_name ASC, full_name ASC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      studentCode: row.student_code,
      fullName: row.full_name,
      dob: row.dob,
      gender: row.gender,
      className: row.class_name,
      parentName: row.parent_name,
      parentPhone: row.parent_phone,
      address: row.address,
      attendanceStatus: row.attendance_status,
      allergiesOrDiet: row.allergies_or_diet || '',
      enrollmentDate: row.enrollment_date,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }

  /**
   * HEALTH RECORDS - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertHealthRecordsBatch(db: Client, records: HealthRecord[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(h => ({
      sql: `INSERT INTO health_records (
        id, student_id, student_name, class_name, check_date,
        height_cm, weight_kg, nutrition_status, vaccination_status,
        general_health, doctor_or_examiner, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        student_id = excluded.student_id,
        student_name = excluded.student_name,
        class_name = excluded.class_name,
        check_date = excluded.check_date,
        height_cm = excluded.height_cm,
        weight_kg = excluded.weight_kg,
        nutrition_status = excluded.nutrition_status,
        vaccination_status = excluded.vaccination_status,
        general_health = excluded.general_health,
        doctor_or_examiner = excluded.doctor_or_examiner,
        notes = excluded.notes,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= health_records.updated_at`,
      args: [
        h.id,
        h.studentId,
        h.studentName,
        h.className,
        h.checkDate,
        h.heightCm,
        h.weightKg,
        h.nutritionStatus,
        h.vaccinationStatus,
        h.generalHealth,
        h.doctorOrExaminer,
        h.notes || '',
        (h as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getHealthRecords(db: Client, params: HealthQueryParams = {}): Promise<HealthRecord[]> {
    let sql = `SELECT * FROM health_records WHERE 1=1`;
    const args: any[] = [];

    if (params.studentId) {
      sql += ` AND student_id = ?`;
      args.push(params.studentId);
    }
    if (params.checkDate) {
      sql += ` AND check_date = ?`;
      args.push(params.checkDate);
    }

    sql += ` ORDER BY check_date DESC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      className: row.class_name,
      checkDate: row.check_date,
      heightCm: Number(row.height_cm),
      weightKg: Number(row.weight_kg),
      nutritionStatus: row.nutrition_status,
      vaccinationStatus: row.vaccination_status,
      generalHealth: row.general_health,
      doctorOrExaminer: row.doctor_or_examiner,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }
}

