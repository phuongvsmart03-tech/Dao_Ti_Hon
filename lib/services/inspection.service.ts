import type { Client } from '@libsql/client';
import { Step1Record, Step2Record, Step3Record, SampleDisposalRecord } from '@/types/preschool';

export interface InspectionQueryParams {
  fromDate?: string;
  toDate?: string;
  month?: string;
  limit?: number;
  offset?: number;
}

export class InspectionService {
  /**
   * STEP 1 - BATCH UPSERT WITH CONFLICT RESOLUTION (Last-Write-Wins)
   */
  static async upsertStep1Batch(db: Client, records: Step1Record[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(r => ({
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
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= step1_inspections.updated_at`,
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
        (r as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getStep1Records(db: Client, params: InspectionQueryParams = {}): Promise<Step1Record[]> {
    let sql = `SELECT * FROM step1_inspections WHERE 1=1`;
    const args: any[] = [];

    if (params.fromDate && params.toDate) {
      sql += ` AND date BETWEEN ? AND ?`;
      args.push(params.fromDate, params.toDate);
    } else if (params.month) {
      sql += ` AND substr(date, 1, 7) = ?`;
      args.push(params.month);
    }

    sql += ` ORDER BY date DESC, time DESC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      time: row.time,
      foodName: row.food_name,
      category: row.category,
      quantity: row.quantity,
      sensoryQuality: row.sensory_quality,
      supplier: row.supplier,
      expiryOrCertificate: row.expiry_or_certificate,
      deliverer: row.deliverer,
      inspector: row.inspector,
      result: row.result,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }

  /**
   * STEP 2 - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertStep2Batch(db: Client, records: Step2Record[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(r => ({
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
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= step2_cookings.updated_at`,
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
        (r as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getStep2Records(db: Client, params: InspectionQueryParams = {}): Promise<Step2Record[]> {
    let sql = `SELECT * FROM step2_cookings WHERE 1=1`;
    const args: any[] = [];

    if (params.fromDate && params.toDate) {
      sql += ` AND date BETWEEN ? AND ?`;
      args.push(params.fromDate, params.toDate);
    } else if (params.month) {
      sql += ` AND substr(date, 1, 7) = ?`;
      args.push(params.month);
    }

    sql += ` ORDER BY date DESC, prep_time DESC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      meal: row.meal,
      dishName: row.dish_name,
      prepTime: row.prep_time,
      cookTime: row.cook_time,
      cookingTemp: row.cooking_temp,
      hygieneStatus: row.hygiene_status,
      chef: row.chef,
      supervisor: row.supervisor,
      result: row.result,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }

  /**
   * STEP 3 - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertStep3Batch(db: Client, records: Step3Record[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(r => ({
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
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= step3_tastings.updated_at`,
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
        (r as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getStep3Records(db: Client, params: InspectionQueryParams = {}): Promise<Step3Record[]> {
    let sql = `SELECT * FROM step3_tastings WHERE 1=1`;
    const args: any[] = [];

    if (params.fromDate && params.toDate) {
      sql += ` AND date BETWEEN ? AND ?`;
      args.push(params.fromDate, params.toDate);
    } else if (params.month) {
      sql += ` AND substr(date, 1, 7) = ?`;
      args.push(params.month);
    }

    sql += ` ORDER BY date DESC, time DESC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      date: row.date,
      time: row.time,
      meal: row.meal,
      dishName: row.dish_name,
      sensoryEvaluation: row.sensory_evaluation,
      servingTemp: row.serving_temp,
      sampleWeight: row.sample_weight,
      storageLocation: row.storage_location,
      taster: row.taster,
      keeper: row.keeper,
      result: row.result,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }

  /**
   * SAMPLE DISPOSAL - BATCH UPSERT
   */
  static async upsertSampleDisposalsBatch(db: Client, records: SampleDisposalRecord[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(r => ({
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
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= sample_disposals.updated_at`,
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
        (r as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getSampleDisposalRecords(db: Client, params: InspectionQueryParams = {}): Promise<SampleDisposalRecord[]> {
    let sql = `SELECT * FROM sample_disposals WHERE 1=1`;
    const args: any[] = [];

    if (params.fromDate && params.toDate) {
      sql += ` AND disposal_date BETWEEN ? AND ?`;
      args.push(params.fromDate, params.toDate);
    } else if (params.month) {
      sql += ` AND substr(disposal_date, 1, 7) = ?`;
      args.push(params.month);
    }

    sql += ` ORDER BY disposal_date DESC, disposal_time DESC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      dateSampled: row.date_sampled,
      timeSampled: row.time_sampled,
      meal: row.meal,
      dishName: row.dish_name,
      sampleWeight: row.sample_weight || '',
      containerType: row.container_type || 'Hộp Inox có nắp vô trùng',
      storageTemp: row.storage_temp || '2°C - 4°C',
      disposalDate: row.disposal_date,
      disposalTime: row.disposal_time,
      conditionAtDisposal: row.condition_at_disposal,
      samplerName: row.sampler_name || '',
      witnessName: row.witness_name || '',
      status: row.status,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }
}
