// Utilitarios compartilhados pelos scripts de desenvolvimento local.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
export const backendDir = join(rootDir, 'Back-End');
export const backendEnvPath = join(backendDir, '.env');

// Le DATABASE_URL do Back-End/.env (ou do ambiente) e devolve as partes da conexao.
export function readDatabaseConfig() {
  let url = process.env.DATABASE_URL;

  if (!url && existsSync(backendEnvPath)) {
    const match = readFileSync(backendEnvPath, 'utf8').match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m);
    url = match?.[1];
  }

  if (!url) {
    throw new Error('DATABASE_URL nao encontrada. Rode "npm run setup" primeiro.');
  }

  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port || 5432),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
  };
}

export function isLocalHost(host) {
  return host === 'localhost' || host === '127.0.0.1';
}
