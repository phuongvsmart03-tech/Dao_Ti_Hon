/**
 * In-memory Token-bucket Rate Limiter for Next.js API routes
 * Giúp ngăn chặn spam request, cạn kiệt quota AI hoặc DDoS endpoint Turso DB
 */

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
  requestCount: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Định kỳ dọn dẹp các IP không hoạt động sau 15 phút để tránh memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const expiry = 15 * 60 * 1000;
    for (const [key, record] of rateLimitStore.entries()) {
      if (now - record.lastRefill > expiry) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit: number; // Số request tối đa trong cửa sổ thời gian
  windowMs: number; // Cửa sổ thời gian (milliseconds)
  keyPrefix?: string;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 30, windowMs: 60 * 1000, keyPrefix: 'global' }
): { allowed: boolean; remaining: number; resetTime: number; retryAfterSec: number } {
  const key = `${options.keyPrefix || 'rl'}:${identifier}`;
  const now = Date.now();
  const record = rateLimitStore.get(key) || {
    tokens: options.limit,
    lastRefill: now,
    requestCount: 0,
  };

  // Tính lượng token phục hồi theo thời gian trôi qua
  const elapsedTime = now - record.lastRefill;
  if (elapsedTime > options.windowMs) {
    record.tokens = options.limit;
    record.lastRefill = now;
    record.requestCount = 0;
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    record.requestCount += 1;
    rateLimitStore.set(key, record);
    return {
      allowed: true,
      remaining: record.tokens,
      resetTime: record.lastRefill + options.windowMs,
      retryAfterSec: 0,
    };
  }

  // Bị chặn rate limit
  const retryAfterSec = Math.ceil((record.lastRefill + options.windowMs - now) / 1000);
  return {
    allowed: false,
    remaining: 0,
    resetTime: record.lastRefill + options.windowMs,
    retryAfterSec: Math.max(1, retryAfterSec),
  };
}

export function getClientIdentifier(req: Request): string {
  // Lấy IP từ headers hoặc fallback sang session token/header
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const authHeader = req.headers.get('authorization') || req.headers.get('x-client-session-id');

  const ip = (forwardedFor ? forwardedFor.split(',')[0].trim() : null) || realIp || cfConnectingIp || '127.0.0.1';
  return authHeader ? `${ip}:${authHeader.slice(0, 16)}` : ip;
}
