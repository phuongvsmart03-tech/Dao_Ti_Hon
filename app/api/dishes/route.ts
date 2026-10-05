import { NextRequest, NextResponse } from 'next/server';
import { getTursoClient } from '@/lib/turso';
import { ensureTablesInitialized } from '@/lib/services/db-schema';
import { MenuService } from '@/lib/services/menu.service';
import { MASTER_SEED_BACKUP_DISHES } from '@/lib/dish-library';
import { DishItem } from '@/types/preschool';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

// Server-side persistent memory cache (shares across all devices hitting this server instance)
let serverDishLibraryCache: DishItem[] = [...MASTER_SEED_BACKUP_DISHES];

/**
 * GET /api/dishes
 * Lấy toàn bộ kho món ăn đồng bộ từ máy chủ (Hỗ trợ đa thiết bị)
 */
export async function GET(req: NextRequest) {
  const db = getTursoClient();

  if (db) {
    try {
      await ensureTablesInitialized(db);
      const dishes = await MenuService.getDishLibrary(db);
      if (dishes && dishes.length > 0) {
        serverDishLibraryCache = dishes;
        return NextResponse.json({
          success: true,
          source: 'turso_cloud',
          dishes,
          count: dishes.length,
        });
      }
    } catch (err: any) {
      console.warn('Failed to fetch dishes from Turso, falling back to server cache:', err.message);
    }
  }

  // Fallback to server memory cache
  return NextResponse.json({
    success: true,
    source: 'server_central_cache',
    dishes: serverDishLibraryCache,
    count: serverDishLibraryCache.length,
  });
}

/**
 * POST /api/dishes
 * Lưu hoặc cập nhật món ăn lên máy chủ để các máy khác đồng bộ tức thì
 */
export async function POST(req: NextRequest) {
  const clientId = getClientIdentifier(req);
  const rateLimit = checkRateLimit(clientId, { limit: 120, windowMs: 60 * 1000, keyPrefix: 'dishes-post' });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Thao tác quá nhanh. Thử lại sau ${rateLimit.retryAfterSec}s.` },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { action, dish, dishes } = body;

    // 1. Thêm hoặc cập nhật 1 món ăn đơn lẻ
    if (action === 'save_dish' || (!action && dish)) {
      const targetDish: DishItem = dish;
      if (!targetDish || !targetDish.name) {
        return NextResponse.json({ success: false, error: 'Thiếu thông tin món ăn.' }, { status: 400 });
      }

      // Cập nhật server cache
      const existingIdx = serverDishLibraryCache.findIndex((d) => d.id === targetDish.id || d.name.toLowerCase() === targetDish.name.toLowerCase());
      if (existingIdx >= 0) {
        serverDishLibraryCache[existingIdx] = { ...serverDishLibraryCache[existingIdx], ...targetDish };
      } else {
        serverDishLibraryCache = [targetDish, ...serverDishLibraryCache];
      }

      // Lưu vào Turso nếu có kết nối
      const db = getTursoClient();
      if (db) {
        try {
          await ensureTablesInitialized(db);
          await MenuService.upsertDishLibraryBatch(db, [targetDish]);
        } catch (dbErr: any) {
          console.warn('Turso upsert failed, dish saved to server cache only:', dbErr.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Đã lưu món '${targetDish.name}' lên máy chủ thành công.`,
        dish: targetDish,
        totalDishes: serverDishLibraryCache.length,
      });
    }

    // 2. Đồng bộ toàn bộ danh sách món ăn (Batch Sync)
    if (action === 'sync_batch' || (!action && Array.isArray(dishes))) {
      const itemsToSync: DishItem[] = Array.isArray(dishes) ? dishes : [];
      if (itemsToSync.length === 0) {
        return NextResponse.json({ success: true, count: 0, dishes: serverDishLibraryCache });
      }

      // Hợp nhất dữ liệu (Merge unique by ID / Name)
      const dishMap = new Map<string, DishItem>();
      // Cho các món gốc vào trước
      serverDishLibraryCache.forEach((d) => dishMap.set(d.id, d));
      // Ghi đè các món từ máy client gửi lên
      itemsToSync.forEach((d) => dishMap.set(d.id, d));
      serverDishLibraryCache = Array.from(dishMap.values());

      // Ghi vào Turso nếu có
      const db = getTursoClient();
      if (db) {
        try {
          await ensureTablesInitialized(db);
          await MenuService.upsertDishLibraryBatch(db, serverDishLibraryCache);
        } catch (dbErr: any) {
          console.warn('Turso batch upsert failed, merged in server cache:', dbErr.message);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Đã đồng bộ ${serverDishLibraryCache.length} món ăn trên máy chủ.`,
        dishes: serverDishLibraryCache,
        count: serverDishLibraryCache.length,
      });
    }

    // 3. Khôi phục về kho 30 món gốc
    if (action === 'reset_default') {
      serverDishLibraryCache = [...MASTER_SEED_BACKUP_DISHES];
      const db = getTursoClient();
      if (db) {
        try {
          await ensureTablesInitialized(db);
          await db.execute('DELETE FROM dish_library');
          await MenuService.upsertDishLibraryBatch(db, serverDishLibraryCache);
        } catch {
          // ignore
        }
      }
      return NextResponse.json({
        success: true,
        message: 'Đã khôi phục kho món ăn mặc định.',
        dishes: serverDishLibraryCache,
      });
    }

    return NextResponse.json({ success: false, error: 'Thao tác không được hỗ trợ.' }, { status: 400 });
  } catch (err: any) {
    console.error('Error in POST /api/dishes:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/dishes?id=dish-xxx
 * Xóa một món ăn khỏi kho máy chủ
 */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dishId = searchParams.get('id');

  if (!dishId) {
    return NextResponse.json({ success: false, error: 'Thiếu ID món ăn cần xóa.' }, { status: 400 });
  }

  serverDishLibraryCache = serverDishLibraryCache.filter((d) => d.id !== dishId);

  const db = getTursoClient();
  if (db) {
    try {
      await ensureTablesInitialized(db);
      await db.execute({ sql: 'DELETE FROM dish_library WHERE id = ?', args: [dishId] });
    } catch (err: any) {
      console.warn('Failed to delete from Turso:', err.message);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Đã xóa món ăn khỏi máy chủ.`,
    remainingCount: serverDishLibraryCache.length,
  });
}
