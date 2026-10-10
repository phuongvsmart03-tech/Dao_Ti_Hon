import { NextRequest, NextResponse } from 'next/server';
import { runTursoQuery } from '@/lib/turso';
import { ensureTablesInitialized } from '@/lib/services/db-schema';
import { SyncService } from '@/lib/services/sync.service';
import { realtimeHub } from '@/lib/realtime-hub';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getBackupsDir(): string {
  const dir = path.join(process.cwd(), 'data', 'backups');
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.error('Lỗi tạo thư mục backups:', e);
    }
  }
  return dir;
}

function calculateChecksum(str: string): string {
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  const hex1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  return `SHA-${hex1.toUpperCase()}${hex2.toUpperCase()}`;
}

/**
 * GET: Lấy danh sách các bản sao lưu tự động & thủ công đã lưu trên máy chủ
 */
export async function GET() {
  try {
    const dir = getBackupsDir();
    if (!fs.existsSync(dir)) {
      return NextResponse.json({ success: true, backups: [] });
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    const backups = files.map((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      let meta: any = {};
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        meta = {
          totalRecords: (parsed.step1?.length || 0) + (parsed.menuItems?.length || 0) + (parsed.students?.length || 0) + (parsed.staffMembers?.length || 0) + (parsed.financeTransactions?.length || 0),
          summary: {
            students: parsed.students?.length || 0,
            menu: parsed.menuItems?.length || 0,
            staff: parsed.staffMembers?.length || 0,
            finance: parsed.financeTransactions?.length || 0,
            inspections: (parsed.step1?.length || 0) + (parsed.step2?.length || 0) + (parsed.step3?.length || 0),
          },
          checksum: calculateChecksum(content),
          version: parsed.version || '2.0-turso-lww',
        };
      } catch {
        // ignore
      }

      return {
        id: file.replace('.json', ''),
        fileName: file,
        createdAt: stat.mtime.toISOString(),
        sizeBytes: stat.size,
        ...meta,
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, backups });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST: Tạo mới bản sao lưu tự động, khôi phục hoặc xóa bản sao lưu
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, backupId, clientId, deviceName } = body;

    return await runTursoQuery(async (db) => {
      await ensureTablesInitialized(db);

      // 1. Tự động sao lưu toàn hệ thống (Giai đoạn 4)
      if (action === 'create_backup' || action === 'trigger_auto_backup') {
        const snapshot = await SyncService.exportFullSnapshot(db);
        const dir = getBackupsDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `backup-${timestamp}.json`;
        const filePath = path.join(dir, fileName);

        const content = JSON.stringify(snapshot, null, 2);
        fs.writeFileSync(filePath, content, 'utf-8');

        const checksum = calculateChecksum(content);
        const totalRecords =
          (snapshot.step1?.length || 0) +
          (snapshot.step2?.length || 0) +
          (snapshot.step3?.length || 0) +
          (snapshot.menuItems?.length || 0) +
          (snapshot.students?.length || 0) +
          (snapshot.staffMembers?.length || 0) +
          (snapshot.financeTransactions?.length || 0);

        realtimeHub.broadcast({
          id: `backup-${Date.now()}`,
          type: 'data:sync',
          timestamp: Date.now(),
          senderId: clientId,
          senderName: deviceName,
          message: 'Hệ thống vừa hoàn tất bản tự động sao lưu an toàn (Giai đoạn 4)',
        });

        return NextResponse.json({
          success: true,
          message: 'Tạo bản sao lưu toàn hệ thống thành công!',
          backup: {
            id: `backup-${timestamp}`,
            fileName,
            createdAt: new Date().toISOString(),
            totalRecords,
            checksum,
            sizeBytes: Buffer.byteLength(content, 'utf-8'),
          },
        });
      }

      // 2. Khôi phục từ bản sao lưu máy chủ
      if (action === 'restore_backup') {
        const targetId = backupId || id;
        if (!targetId) {
          return NextResponse.json({ success: false, error: 'Thiếu mã bản sao lưu cần khôi phục' }, { status: 400 });
        }

        const dir = getBackupsDir();
        const fileName = targetId.endsWith('.json') ? targetId : `${targetId}.json`;
        const filePath = path.join(dir, fileName);

        if (!fs.existsSync(filePath)) {
          return NextResponse.json({ success: false, error: 'Không tìm thấy file bản sao lưu trên máy chủ' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const snapshot = JSON.parse(content);
        const result = await SyncService.restoreFullSnapshotAtomic(db, snapshot);

        realtimeHub.broadcast({
          id: `restore-${Date.now()}`,
          type: 'data:sync',
          timestamp: Date.now(),
          senderId: clientId,
          senderName: deviceName,
          message: `Đã khôi phục thành công ${result.totalRecords} bản ghi từ bản sao lưu ${fileName}`,
        });

        return NextResponse.json({
          success: true,
          message: `Khôi phục thành công ${result.totalRecords} bản ghi từ bản sao lưu!`,
          totalRecords: result.totalRecords,
        });
      }

      // 3. Xóa bản sao lưu
      if (action === 'delete_backup') {
        const targetId = backupId || id;
        if (!targetId) {
          return NextResponse.json({ success: false, error: 'Thiếu mã bản sao lưu cần xóa' }, { status: 400 });
        }
        const dir = getBackupsDir();
        const fileName = targetId.endsWith('.json') ? targetId : `${targetId}.json`;
        const filePath = path.join(dir, fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return NextResponse.json({ success: true, message: 'Đã xóa bản sao lưu thành công' });
      }

      return NextResponse.json({ success: false, error: 'Thao tác không hợp lệ' }, { status: 400 });
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
