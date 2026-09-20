import type { Client } from '@libsql/client';
import { MenuItem, DishRecipeBreakdown } from '@/types/preschool';

export interface MenuQueryParams {
  weekNumber?: number;
  month?: string;
  ageGroup?: string;
  academicYear?: string;
  limit?: number;
  offset?: number;
}

export class MenuService {
  /**
   * MENU ITEMS - BATCH UPSERT WITH CONFLICT RESOLUTION
   */
  static async upsertMenuItemsBatch(db: Client, records: MenuItem[]): Promise<{ count: number }> {
    if (!records || records.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = records.map(r => ({
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
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= menu_items.updated_at`,
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
        (r as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: records.length };
  }

  static async getMenuItems(db: Client, params: MenuQueryParams = {}): Promise<MenuItem[]> {
    let sql = `SELECT * FROM menu_items WHERE 1=1`;
    const args: any[] = [];

    if (params.weekNumber !== undefined && params.weekNumber !== null) {
      sql += ` AND week_number = ?`;
      args.push(params.weekNumber);
    }
    if (params.month) {
      sql += ` AND month = ?`;
      args.push(params.month);
    }
    if (params.ageGroup) {
      sql += ` AND age_group = ?`;
      args.push(params.ageGroup);
    }

    sql += ` ORDER BY week_number ASC, day_of_week ASC`;
    if (params.limit) {
      sql += ` LIMIT ? OFFSET ?`;
      args.push(params.limit, params.offset || 0);
    }

    const res = await db.execute({ sql, args });
    return res.rows.map((row: any) => ({
      id: row.id,
      weekNumber: Number(row.week_number),
      month: row.month,
      ageGroup: row.age_group,
      dayOfWeek: row.day_of_week,
      breakfast: row.breakfast,
      snackMorning: row.snack_morning,
      lunchMain: row.lunch_main,
      lunchSoup: row.lunch_soup,
      lunchStaple: row.lunch_staple,
      lunchDessert: row.lunch_dessert,
      afternoonSnack: row.afternoon_snack,
      caloriesKcal: Number(row.calories_kcal),
      proteinRatio: row.protein_ratio,
      status: row.status,
      approvedBy: row.approved_by,
      notes: row.notes || '',
      updated_at: row.updated_at,
    }));
  }

  /**
   * DISH BREAKDOWNS - BATCH UPSERT
   */
  static async upsertDishBreakdownsBatch(db: Client, breakdowns: DishRecipeBreakdown[]): Promise<{ count: number }> {
    if (!breakdowns || breakdowns.length === 0) return { count: 0 };
    const now = Date.now();

    const statements = breakdowns.map(b => ({
      sql: `INSERT INTO dish_breakdowns (
        dish_id, dish_name, category, target_age, default_portion_calories, breakdown_json, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(dish_id) DO UPDATE SET
        dish_name = excluded.dish_name,
        category = excluded.category,
        target_age = excluded.target_age,
        default_portion_calories = excluded.default_portion_calories,
        breakdown_json = excluded.breakdown_json,
        updated_at = excluded.updated_at
      WHERE excluded.updated_at >= dish_breakdowns.updated_at`,
      args: [
        b.id,
        b.dishName,
        b.category || '',
        b.ageGroup || '',
        b.totalCalories || 0,
        JSON.stringify(b),
        (b as any).updated_at || now,
      ],
    }));

    await db.batch(statements, 'write');
    return { count: breakdowns.length };
  }

  static async getDishBreakdowns(db: Client): Promise<DishRecipeBreakdown[]> {
    const res = await db.execute(`SELECT breakdown_json FROM dish_breakdowns ORDER BY dish_name ASC`);
    return res.rows.map((row: any) => {
      try {
        return JSON.parse(row.breakdown_json as string);
      } catch {
        return null;
      }
    }).filter(Boolean) as DishRecipeBreakdown[];
  }
}
