import { createClient, Client } from '@libsql/client';

let tursoClient: Client | null = null;

export function getTursoClient(): Client | null {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    return null;
  }

  if (!tursoClient) {
    tursoClient = createClient({
      url,
      authToken: authToken || undefined,
    });
  }

  return tursoClient;
}
