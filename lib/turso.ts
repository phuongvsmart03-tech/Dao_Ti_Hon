import { createClient, Client } from '@libsql/client';
import fs from 'fs';
import path from 'path';

let tursoClient: Client | null = null;

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

  // Fallback to embedded SQLite database stored persistently on the server
  if (!tursoClient) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error('Error creating data directory:', err);
      }
    }
    const dbFilePath = path.join(dataDir, 'mamnon.db');
    tursoClient = createClient({
      url: `file:${dbFilePath}`,
    });
  }

  return tursoClient;
}
