import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';

let tursoClient: Client | null = null;
let localClient: Client | null = null;

export function getLocalTursoClient(): Client {
  if (!localClient) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error('Error creating data directory:', err);
      }
    }
    const dbFilePath = path.join(dataDir, 'mamnon.db');
    localClient = createClient({
      url: `file:${dbFilePath}`,
    });
  }
  return localClient;
}

export function getTursoClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url) {
    if (!tursoClient) {
      tursoClient = createClient({
        url,
        authToken: authToken || undefined,
      });
    }
    return tursoClient;
  }

  return getLocalTursoClient();
}

/**
 * Runs a Turso DB query operation with automatic fallback to local persistent SQLite (data/mamnon.db)
 * if remote connection fails or times out.
 */
export async function runTursoQuery<T>(operation: (db: Client) => Promise<T>): Promise<T> {
  const primaryDb = getTursoClient();
  try {
    return await operation(primaryDb);
  } catch (err: any) {
    const errString = String(err?.message || err) + ' ' + String(err?.cause || '');
    if (
      errString.includes('fetch failed') ||
      errString.includes('ConnectTimeoutError') ||
      errString.includes('Connect Timeout') ||
      errString.includes('ETIMEDOUT') ||
      errString.includes('ENOTFOUND') ||
      errString.includes('Network') ||
      errString.includes('timeout')
    ) {
      console.warn('[Turso DB] Remote connection unreachable or timed out. Auto-falling back to local SQLite:', errString);
      const localDb = getLocalTursoClient();
      return await operation(localDb);
    }
    throw err;
  }
}

