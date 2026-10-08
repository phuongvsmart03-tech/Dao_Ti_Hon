import { NextRequest, NextResponse } from 'next/server';
import { realtimeHub } from '@/lib/realtime-hub';
import { RealtimeEventPayload } from '@/types/realtime';

export const dynamic = 'force-dynamic';

/**
 * GET /api/realtime
 * Server-Sent Events (SSE) Endpoint for real-time multi-device sync
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get('clientId') || `dev-${Math.random().toString(36).substring(2, 9)}`;
  const deviceName = url.searchParams.get('deviceName') || 'Thiết bị trường mầm non';
  const roleParam = url.searchParams.get('role');
  const role = (['admin', 'kitchen', 'medical', 'teacher'].includes(roleParam || '') ? roleParam : 'admin') as any;

  // Extract client IP (handling x-forwarded-for if present)
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  let clientController: ReadableStreamDefaultController<Uint8Array> | null = null;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      clientController = controller;

      // Register with RealtimeHub
      realtimeHub.registerClient(clientId, deviceName, role, controller, ip);

      // Send initial connection greeting
      const welcomeEvent: RealtimeEventPayload = {
        id: `init-${Date.now()}`,
        type: 'system:connected',
        timestamp: Date.now(),
        senderId: clientId,
        message: 'Kết nối SSE thời gian thực thành công (Giai đoạn 3: Real-time Multi-Device)',
        data: {
          clientId,
          deviceName,
          role,
          activeClients: realtimeHub.getActiveClients(),
          serverTime: new Date().toISOString(),
          version: '3.0.0-sse-optimistic',
        },
      };

      const encoder = new TextEncoder();
      const payloadString = `id: ${welcomeEvent.id}\nevent: message\ndata: ${JSON.stringify(welcomeEvent)}\n\n`;
      controller.enqueue(encoder.encode(payloadString));
    },
    cancel() {
      if (clientId) {
        realtimeHub.unregisterClient(clientId);
      }
    },
  });

  // Handle abort signal
  req.signal.addEventListener('abort', () => {
    if (clientId) {
      realtimeHub.unregisterClient(clientId);
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for Nginx/proxies
    },
  });
}

/**
 * POST /api/realtime
 * Allows clients to send heartbeat pings, broadcast changes, or trigger conflict simulation
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, clientId, deviceName, role, module: moduleName, data, conflictSimulation } = body;

    if (action === 'ping' && clientId) {
      realtimeHub.updatePing(clientId);
      return NextResponse.json({
        success: true,
        activeCount: realtimeHub.getClientCount(),
        activeClients: realtimeHub.getActiveClients(),
      });
    }

    if (action === 'broadcast_mutation') {
      realtimeHub.broadcastMutation({
        module: moduleName || 'general',
        action: body.subAction || 'update',
        recordId: body.recordId,
        data,
        senderId: clientId,
        senderName: deviceName || 'Thiết bị khác',
        version: body.version,
        message: body.message,
      });
      return NextResponse.json({ success: true, message: 'Đã phát sóng cập nhật tới tất cả thiết bị' });
    }

    if (action === 'simulate_conflict') {
      // Create a simulated conflict event for demonstration and testing of Giai đoạn 3
      const conflictData = {
        id: `sim-conflict-${Date.now()}`,
        entityType: body.entityType || 'menu',
        recordId: body.recordId || 'menu-item-mon-01',
        localVersion: 1,
        remoteVersion: 2,
        localData: body.localData || {
          dishName: 'Thịt heo rim nước dừa (Nhà bếp chỉnh)',
          calories: 145,
          unitPrice: 28000,
          notes: 'Ướp gia vị giảm muối cho bé',
        },
        remoteData: body.remoteData || {
          dishName: 'Thịt kho trứng cút (Ban Giám Hiệu chỉnh)',
          calories: 160,
          unitPrice: 30000,
          notes: 'Thay đổi theo thực đơn mùa hè',
        },
        conflictingFields: ['dishName', 'calories', 'unitPrice', 'notes'],
        detectedAt: Date.now(),
        remoteUser: 'Cô Mai (Hiệu Phó Nuôi Dưỡng)',
        remoteDevice: 'Máy tính BGH (Văn phòng)',
      };

      realtimeHub.broadcastConflict(conflictData);
      return NextResponse.json({
        success: true,
        message: 'Đã tạo sự kiện xung đột mẫu để kiểm thử giải quyết xung đột',
        conflictData,
      });
    }

    return NextResponse.json({
      success: true,
      activeClients: realtimeHub.getActiveClients(),
      clientCount: realtimeHub.getClientCount(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xử lý yêu cầu realtime' }, { status: 500 });
  }
}
