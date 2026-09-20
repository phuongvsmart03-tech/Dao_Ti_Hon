import type { Client } from '@libsql/client';
import { StaffRecord, LessonPlanRecord, SchoolInfo } from '@/types/preschool';

export interface LessonPlanQueryParams {
  theme?: string;
  targetClass?: string;
  teacherName?: string;
  limit?: number;
  offset?: number;
}

export class StaffLessonService {
  /**
   * SCHOOL INFO - UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertSchoolInfo(db: Client, s: SchoolInfo): Promise<void> {
    const now = Date.now();
    await db.execute({
      sql: `INSERT INTO school_info (
        id, name, department, address, phone, academic_year,
        principal_name, medical_staff_name, head_chef_name,
        inspector_name, receiver_name, sample_keeper_name, sample_disposer_name,
        default_print_orientation, creator_name, team_leader_nutrition_name,
        team_leader_education_name, vice_principal_name, accountant_name,
        meat_supplier_name, meat_supplier_address, meat_deliverer_name,
        veg_supplier_name, veg_supplier_address, veg_deliverer_name,
        seafood_supplier_name, seafood_supplier_address, seafood_deliverer_name,
        dry_producer_name, dry_producer_address, dry_supplier_name,
        dry_supplier_address, dry_deliverer_name, logo_url, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        department = excluded.department,
        address = excluded.address,
        phone = excluded.phone,
        academic_year = excluded.academic_year,
        principal_name = excluded.principal_name,
        medical_staff_name = excluded.medical_staff_name,
        head_chef_name = excluded.head_chef_name,
        inspector_name = excluded.inspector_name,
        receiver_name = excluded.receiver_name,
        sample_keeper_name = excluded.sample_keeper_name,
        sample_disposer_name = excluded.sample_disposer_name,
        default_print_orientation = excluded.default_print_orientation,
        creator_name = excluded.creator_name,
        team_leader_nutrition_name = excluded.team_leader_nutrition_name,
        team_leader_education_name = excluded.team_leader_education_name,
        vice_principal_name = excluded.vice_principal_name,
        accountant_name = excluded.accountant_name,
        meat_supplier_name = excluded.meat_supplier_name,
        meat_supplier_address = excluded.meat_supplier_address,
        meat_deliverer_name = excluded.meat_deliverer_name,
        veg_supplier_name = excluded.veg_supplier_name,
        veg_supplier_address = excluded.veg_supplier_address,
        veg_deliverer_name = excluded.veg_deliverer_name,
        seafood_supplier_name = excluded.seafood_supplier_name,
        seafood_supplier_address = excluded.seafood_supplier_address,
        seafood_deliverer_name = excluded.seafood_deliverer_name,
        dry_producer_name = excluded.dry_producer_name,
        dry_producer_address = excluded.dry_producer_address,
        dry_supplier_name = excluded.dry_supplier_name,
        dry_supplier_address = excluded.dry_supplier_address,
        dry_deliverer_name = excluded.dry_deliverer_name,
        logo_url = excluded.logo_url,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= school_info.updated_at`,
      args: [
        (s as any).id || 'default_school_config',
        s.name,
        s.department,
        s.address,
        s.phone,
        s.academicYear,
        s.principalName,
        s.medicalStaffName,
        s.headChefName,
        s.inspectorName || '',
        s.receiverName || '',
        s.sampleKeeperName || '',
        s.sampleDisposerName || '',
        s.defaultPrintOrientation || 'landscape',
        s.creatorName || '',
        s.teamLeaderNutritionName || '',
        s.teamLeaderEducationName || '',
        s.vicePrincipalName || '',
        s.accountantName || '',
        s.meatSupplierName || '',
        s.meatSupplierAddress || '',
        s.meatDelivererName || '',
        s.vegSupplierName || '',
        s.vegSupplierAddress || '',
        s.vegDelivererName || '',
        s.seafoodSupplierName || '',
        s.seafoodSupplierAddress || '',
        s.seafoodDelivererName || '',
        s.dryProducerName || '',
        s.dryProducerAddress || '',
        s.drySupplierName || '',
        s.drySupplierAddress || '',
        s.dryDelivererName || '',
        s.logoUrl || '',
        (s as any).updated_at || now,
      ],
    });
  }

  static async getSchoolInfo(db: Client): Promise<SchoolInfo | null> {
    const res = await db.execute(`SELECT * FROM school_info ORDER BY updated_at DESC LIMIT 1`);
    if (res.rows.length === 0) return null;
    const row: any = res.rows[0];
    return {
      id: row.id,
      name: row.name,
      department: row.department,
      address: row.address,
      phone: row.phone,
      academicYear: row.academic_year,
      principalName: row.principal_name,
      medicalStaffName: row.medical_staff_name,
      headChefName: row.head_chef_name,
      inspectorName: row.inspector_name || undefined,
      receiverName: row.receiver_name || undefined,
      sampleKeeperName: row.sample_keeper_name || undefined,
      sampleDisposerName: row.sample_disposer_name || undefined,
      defaultPrintOrientation: row.default_print_orientation || undefined,
      creatorName: row.creator_name || undefined,
      teamLeaderNutritionName: row.team_leader_nutrition_name || undefined,
      teamLeaderEducationName: row.team_leader_education_name || undefined,
      vicePrincipalName: row.vice_principal_name || undefined,
      accountantName: row.accountant_name || undefined,
      meatSupplierName: row.meat_supplier_name || undefined,
      meatSupplierAddress: row.meat_supplier_address || undefined,
      meatDelivererName: row.meat_deliverer_name || undefined,
      vegSupplierName: row.veg_supplier_name || undefined,
      vegSupplierAddress: row.veg_supplier_address || undefined,
      vegDelivererName: row.veg_deliverer_name || undefined,
      seafoodSupplierName: row.seafood_supplier_name || undefined,
      seafoodSupplierAddress: row.seafood_supplier_address || undefined,
      seafoodDelivererName: row.seafood_deliverer_name || undefined,
      dryProducerName: row.dry_producer_name || undefined,
      dryProducerAddress: row.dry_producer_address || undefined,
      drySupplierName: row.dry_supplier_name || undefined,
      drySupplierAddress: row.dry_supplier_address || undefined,
      dryDelivererName: row.dry_deliverer_name || undefined,
      logoUrl: row.logo_url || '',
      updated_at: row.updated_at,
    };
  }

  /**
   * STAFF MEMBERS - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertStaffBatch(db: Client, records: StaffRecord[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(st => ({
      sql: `INSERT INTO staff (
        id, staff_code, full_name, gender, role, qualification,
        assigned_class_or_dept, assigned_duty, phone, email,
        hygiene_cert_date, food_safety_cert_date, health_check_date,
        health_check_expiry, contract_status, start_date, status, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        staff_code = excluded.staff_code,
        full_name = excluded.full_name,
        gender = excluded.gender,
        role = excluded.role,
        qualification = excluded.qualification,
        assigned_class_or_dept = excluded.assigned_class_or_dept,
        assigned_duty = excluded.assigned_duty,
        phone = excluded.phone,
        email = excluded.email,
        hygiene_cert_date = excluded.hygiene_cert_date,
        food_safety_cert_date = excluded.food_safety_cert_date,
        health_check_date = excluded.health_check_date,
        health_check_expiry = excluded.health_check_expiry,
        contract_status = excluded.contract_status,
        start_date = excluded.start_date,
        status = excluded.status,
        notes = excluded.notes,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= staff.updated_at`,
      args: [
        st.id,
        st.staffCode,
        st.fullName,
        st.gender || null,
        st.role,
        st.qualification,
        st.assignedClassOrDept || null,
        st.assignedDuty || null,
        st.phone,
        st.email || null,
        st.hygieneCertDate || null,
        st.foodSafetyCertDate || null,
        st.healthCheckDate || null,
        st.healthCheckExpiry || null,
        st.contractStatus || null,
        st.startDate || null,
        st.status || 'Đang công tác',
        st.notes || '',
        (st as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getStaffMembers(db: Client): Promise<StaffRecord[]> {
    const res = await db.execute(`SELECT * FROM staff ORDER BY role ASC, full_name ASC`);
    return res.rows.map((row: any) => ({
      id: row.id,
      staffCode: row.staff_code,
      fullName: row.full_name,
      gender: row.gender || undefined,
      role: row.role,
      qualification: row.qualification,
      assignedClassOrDept: row.assigned_class_or_dept || undefined,
      assignedDuty: row.assigned_duty || undefined,
      phone: row.phone,
      email: row.email || undefined,
      hygieneCertDate: row.hygiene_cert_date || undefined,
      foodSafetyCertDate: row.food_safety_cert_date || undefined,
      healthCheckDate: row.health_check_date || undefined,
      healthCheckExpiry: row.health_check_expiry || undefined,
      contractStatus: row.contract_status || undefined,
      startDate: row.start_date || undefined,
      status: row.status || undefined,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }

  /**
   * LESSON PLANS - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertLessonPlansBatch(db: Client, records: LessonPlanRecord[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(l => ({
      sql: `INSERT INTO lesson_plans (
        id, title, theme, target_class, age_group, subject, topic,
        teacher_name, week_number, month, date_range, development_field,
        learning_objectives, activities_plan, preparation,
        approval_status, approver_name, approval_date, file_attachment_name, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        theme = excluded.theme,
        target_class = excluded.target_class,
        age_group = excluded.age_group,
        subject = excluded.subject,
        topic = excluded.topic,
        teacher_name = excluded.teacher_name,
        week_number = excluded.week_number,
        month = excluded.month,
        date_range = excluded.date_range,
        development_field = excluded.development_field,
        learning_objectives = excluded.learning_objectives,
        activities_plan = excluded.activities_plan,
        preparation = excluded.preparation,
        approval_status = excluded.approval_status,
        approver_name = excluded.approver_name,
        approval_date = excluded.approval_date,
        file_attachment_name = excluded.file_attachment_name,
        notes = excluded.notes,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= lesson_plans.updated_at`,
      args: [
        l.id,
        l.title || '',
        l.theme,
        l.targetClass || '',
        l.ageGroup || '',
        l.subject || '',
        l.topic || '',
        l.teacherName,
        l.weekNumber,
        l.month || '',
        l.dateRange || '',
        l.developmentField || '',
        l.learningObjectives || '',
        l.activitiesPlan || '',
        l.preparation || '',
        l.approvalStatus,
        l.approverName,
        l.approvalDate || '',
        l.fileAttachmentName || '',
        l.notes || '',
        (l as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getLessonPlans(db: Client, params: LessonPlanQueryParams = {}): Promise<LessonPlanRecord[]> {
    let sql = `SELECT * FROM lesson_plans WHERE 1=1`;
    const args: any[] = [];

    if (params.theme) {
      sql += ` AND theme = ?`;
      args.push(params.theme);
    }
    if (params.targetClass) {
      sql += ` AND target_class = ?`;
      args.push(params.targetClass);
    }
    if (params.teacherName) {
      sql += ` AND teacher_name = ?`;
      args.push(params.teacherName);
    }

    sql += ` ORDER BY week_number DESC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      title: row.title || undefined,
      theme: row.theme,
      targetClass: row.target_class || undefined,
      ageGroup: row.age_group || undefined,
      subject: row.subject || undefined,
      topic: row.topic || undefined,
      teacherName: row.teacher_name,
      weekNumber: Number(row.week_number),
      month: row.month || undefined,
      dateRange: row.date_range || undefined,
      developmentField: row.development_field || undefined,
      learningObjectives: row.learning_objectives || undefined,
      activitiesPlan: row.activities_plan || undefined,
      preparation: row.preparation || undefined,
      approvalStatus: row.approval_status,
      approverName: row.approver_name,
      approvalDate: row.approval_date || undefined,
      fileAttachmentName: row.file_attachment_name || undefined,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }
}

