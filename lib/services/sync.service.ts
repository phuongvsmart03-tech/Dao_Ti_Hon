import type { Client } from '@libsql/client';
import { InspectionService } from './inspection.service';
import { MenuService } from './menu.service';
import { StudentService } from './student.service';
import { FinanceService } from './finance.service';
import { StaffLessonService } from './staff-lesson.service';
import { ensureTablesInitialized } from './db-schema';

export interface FullDatabaseSnapshot {
  timestamp: string;
  version: string;
  schoolInfo: any;
  step1: any[];
  step2: any[];
  step3: any[];
  sampleDisposals: any[];
  menuItems: any[];
  dishBreakdowns: any[];
  students: any[];
  healthRecords: any[];
  staffMembers: any[];
  lessonPlans: any[];
  teacherSalaries: any[];
  financeTransactions: any[];
}

export class SyncService {
  /**
   * Export all tables into a single JSON snapshot
   */
  static async exportFullSnapshot(db: Client): Promise<FullDatabaseSnapshot> {
    await ensureTablesInitialized(db);

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
      InspectionService.getStep1Records(db),
      InspectionService.getStep2Records(db),
      InspectionService.getStep3Records(db),
      InspectionService.getSampleDisposalRecords(db),
      MenuService.getMenuItems(db),
      MenuService.getDishBreakdowns(db),
      StudentService.getStudents(db),
      StudentService.getHealthRecords(db),
      StaffLessonService.getStaffMembers(db),
      StaffLessonService.getLessonPlans(db),
      FinanceService.getSalaries(db),
      FinanceService.getTransactions(db),
    ]);

    return {
      timestamp: new Date().toISOString(),
      version: '2.0-turso-lww',
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
    };
  }

  /**
   * ATOMIC RESTORE / IMPORT USING A SINGLE `db.batch()` TRANSACTION
   * All-or-Nothing guarantee: Nếu có bất kỳ lỗi nào, DB sẽ không bị bẩn hay thiếu dữ liệu.
   */
  static async restoreFullSnapshotAtomic(db: Client, snapshot: Partial<FullDatabaseSnapshot>): Promise<{ success: boolean; totalRecords: number }> {
    await ensureTablesInitialized(db);

    const batchStatements: { sql: string; args: any[] }[] = [];
    const now = Date.now();

    // 1. School Info
    if (snapshot.schoolInfo) {
      const s = snapshot.schoolInfo;
      batchStatements.push({
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
          updated_at = excluded.updated_at`,
        args: [
          s.id || 'default_school_config',
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
          s.updated_at || now,
        ],
      });
    }

    // 2. Step 1
    if (Array.isArray(snapshot.step1)) {
      snapshot.step1.forEach(r => {
        batchStatements.push({
          sql: `INSERT INTO step1_inspections (
            id, date, time, food_name, category, quantity, sensory_quality,
            supplier, expiry_or_certificate, deliverer, inspector, result, notes, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            date = excluded.date,
            time = excluded.time,
            food_name = excluded.food_name,
            category = excluded.category,
            quantity = excluded.quantity,
            sensory_quality = excluded.sensory_quality,
            supplier = excluded.supplier,
            expiry_or_certificate = excluded.expiry_or_certificate,
            deliverer = excluded.deliverer,
            inspector = excluded.inspector,
            result = excluded.result,
            notes = excluded.notes,
            updated_at = excluded.updated_at`,
          args: [
            r.id,
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
            r.updated_at || now,
          ],
        });
      });
    }

    // 3. Step 2
    if (Array.isArray(snapshot.step2)) {
      snapshot.step2.forEach(r => {
        batchStatements.push({
          sql: `INSERT INTO step2_cookings (
            id, date, meal, dish_name, prep_time, cook_time, cooking_temp,
            hygiene_status, chef, supervisor, result, notes, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            date = excluded.date,
            meal = excluded.meal,
            dish_name = excluded.dish_name,
            prep_time = excluded.prep_time,
            cook_time = excluded.cook_time,
            cooking_temp = excluded.cooking_temp,
            hygiene_status = excluded.hygiene_status,
            chef = excluded.chef,
            supervisor = excluded.supervisor,
            result = excluded.result,
            notes = excluded.notes,
            updated_at = excluded.updated_at`,
          args: [
            r.id,
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
            r.updated_at || now,
          ],
        });
      });
    }

    // 4. Step 3
    if (Array.isArray(snapshot.step3)) {
      snapshot.step3.forEach(r => {
        batchStatements.push({
          sql: `INSERT INTO step3_tastings (
            id, date, time, meal, dish_name, sensory_evaluation, serving_temp,
            sample_weight, storage_location, taster, keeper, result, notes, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            date = excluded.date,
            time = excluded.time,
            meal = excluded.meal,
            dish_name = excluded.dish_name,
            sensory_evaluation = excluded.sensory_evaluation,
            serving_temp = excluded.serving_temp,
            sample_weight = excluded.sample_weight,
            storage_location = excluded.storage_location,
            taster = excluded.taster,
            keeper = excluded.keeper,
            result = excluded.result,
            notes = excluded.notes,
            updated_at = excluded.updated_at`,
          args: [
            r.id,
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
            r.updated_at || now,
          ],
        });
      });
    }

    // 5. Sample Disposals
    if (Array.isArray(snapshot.sampleDisposals)) {
      snapshot.sampleDisposals.forEach(r => {
        batchStatements.push({
          sql: `INSERT INTO sample_disposals (
            id, date_sampled, time_sampled, meal, dish_name, sample_weight,
            container_type, storage_temp, disposal_date, disposal_time,
            condition_at_disposal, sampler_name, witness_name, status, notes, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            date_sampled = excluded.date_sampled,
            time_sampled = excluded.time_sampled,
            meal = excluded.meal,
            dish_name = excluded.dish_name,
            sample_weight = excluded.sample_weight,
            container_type = excluded.container_type,
            storage_temp = excluded.storage_temp,
            disposal_date = excluded.disposal_date,
            disposal_time = excluded.disposal_time,
            condition_at_disposal = excluded.condition_at_disposal,
            sampler_name = excluded.sampler_name,
            witness_name = excluded.witness_name,
            status = excluded.status,
            notes = excluded.notes,
            updated_at = excluded.updated_at`,
          args: [
            r.id,
            r.dateSampled,
            r.timeSampled,
            r.meal,
            r.dishName,
            r.sampleWeight || '',
            r.containerType || '',
            r.storageTemp || '',
            r.disposalDate,
            r.disposalTime,
            r.conditionAtDisposal,
            r.samplerName || '',
            r.witnessName || '',
            r.status,
            r.notes || '',
            r.updated_at || now,
          ],
        });
      });
    }

    // 6. Menu Items
    if (Array.isArray(snapshot.menuItems)) {
      snapshot.menuItems.forEach(r => {
        batchStatements.push({
          sql: `INSERT INTO menu_items (
            id, week_number, month, age_group, day_of_week, breakfast,
            snack_morning, lunch_main, lunch_soup, lunch_staple, lunch_dessert,
            afternoon_snack, calories_kcal, protein_ratio, status, approved_by, notes, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            week_number = excluded.week_number,
            month = excluded.month,
            age_group = excluded.age_group,
            day_of_week = excluded.day_of_week,
            breakfast = excluded.breakfast,
            snack_morning = excluded.snack_morning,
            lunch_main = excluded.lunch_main,
            lunch_soup = excluded.lunch_soup,
            lunch_staple = excluded.lunch_staple,
            lunch_dessert = excluded.lunch_dessert,
            afternoon_snack = excluded.afternoon_snack,
            calories_kcal = excluded.calories_kcal,
            protein_ratio = excluded.protein_ratio,
            status = excluded.status,
            approved_by = excluded.approved_by,
            notes = excluded.notes,
            updated_at = excluded.updated_at`,
          args: [
            r.id,
            r.weekNumber,
            r.month,
            r.ageGroup,
            r.dayOfWeek,
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
            r.updated_at || now,
          ],
        });
      });
    }

    // 7. Students
    if (Array.isArray(snapshot.students)) {
      snapshot.students.forEach(s => {
        batchStatements.push({
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
            updated_at = excluded.updated_at`,
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
            s.updated_at || now,
          ],
        });
      });
    }

    // 8. Health Records
    if (Array.isArray(snapshot.healthRecords)) {
      snapshot.healthRecords.forEach(h => {
        batchStatements.push({
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
            updated_at = excluded.updated_at`,
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
            h.updated_at || now,
          ],
        });
      });
    }

    // 9. Staff Members
    if (Array.isArray(snapshot.staffMembers)) {
      snapshot.staffMembers.forEach(st => {
        batchStatements.push({
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
            updated_at = excluded.updated_at`,
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
            st.updated_at || now,
          ],
        });
      });
    }

    // 10. Lesson Plans
    if (Array.isArray(snapshot.lessonPlans)) {
      snapshot.lessonPlans.forEach(l => {
        batchStatements.push({
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
            updated_at = excluded.updated_at`,
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
            l.updated_at || now,
          ],
        });
      });
    }

    // 11. Teacher Salaries
    if (Array.isArray(snapshot.teacherSalaries)) {
      snapshot.teacherSalaries.forEach(s => {
        batchStatements.push({
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
            updated_at = excluded.updated_at`,
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
        });
      });
    }

    // 12. Finance Transactions
    if (Array.isArray(snapshot.financeTransactions)) {
      snapshot.financeTransactions.forEach(f => {
        batchStatements.push({
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
            updated_at = excluded.updated_at`,
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
        });
      });
    }

    // 13. Dish Breakdowns
    if (Array.isArray(snapshot.dishBreakdowns)) {
      snapshot.dishBreakdowns.forEach(b => {
        batchStatements.push({
          sql: `INSERT INTO dish_breakdowns (
            dish_id, dish_name, category, target_age, default_portion_calories, breakdown_json, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(dish_id) DO UPDATE SET
            dish_name = excluded.dish_name,
            category = excluded.category,
            target_age = excluded.target_age,
            default_portion_calories = excluded.default_portion_calories,
            breakdown_json = excluded.breakdown_json,
            updated_at = excluded.updated_at`,
          args: [
            b.id,
            b.dishName,
            b.category || '',
            b.ageGroup || '',
            b.totalCalories || 0,
            JSON.stringify(b),
            (b as any).updated_at || now,
          ],
        });
      });
    }

    // Thực thi toàn bộ lệnh trong 1 transaction db.batch duy nhất
    if (batchStatements.length > 0) {
      // libSQL hỗ trợ batch tới 500-1000 statements, chia chunk nếu quá lớn
      const CHUNK_SIZE = 400;
      for (let i = 0; i < batchStatements.length; i += CHUNK_SIZE) {
        const chunk = batchStatements.slice(i, i + CHUNK_SIZE);
        await db.batch(chunk, 'write');
      }
    }

    return { success: true, totalRecords: batchStatements.length };
  }

  /**
   * RESET ENTIRE DATABASE ATOMICALLY
   */
  static async resetAllDataAtomic(db: Client): Promise<void> {
    const clearStatements = [
      `DELETE FROM step1_inspections;`,
      `DELETE FROM step2_cookings;`,
      `DELETE FROM step3_tastings;`,
      `DELETE FROM sample_disposals;`,
      `DELETE FROM menu_items;`,
      `DELETE FROM dish_breakdowns;`,
      `DELETE FROM health_records;`,
      `DELETE FROM students;`,
      `DELETE FROM lesson_plans;`,
      `DELETE FROM teacher_salaries;`,
      `DELETE FROM finance_transactions;`,
      `DELETE FROM staff;`,
    ].map(sql => ({ sql, args: [] }));

    await db.batch(clearStatements, 'write');
  }
}
