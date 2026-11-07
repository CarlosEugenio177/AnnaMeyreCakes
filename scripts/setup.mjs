// Prepara o ambiente local em um comando: cria o Back-End/.env (se nao existir),
// sobe o banco embutido, aplica as migrations e roda o seed.
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { startDatabase } from './db.mjs';
import { backendDir, backendEnvPath } from './local-env.mjs';

const DEV_ADMIN_PASSWORD = 'admin123456';

if (!existsSync(backendEnvPath)) {
  copyFileSync(join(backendDir, '.env.example'), backendEnvPath);
  const env = readFileSync(backendEnvPath, 'utf8').replace(
    /^SEED_ADMIN_PASSWORD=.*$/m,
    `SEED_ADMIN_PASSWORD="${DEV_ADMIN_PASSWORD}"`,
  );
  writeFileSync(backendEnvPath, env);
  console.log('[setup] Back-End/.env criado a partir do .env.example.');
}

const stopDatabase = await startDatabase();

try {
  await run('npx', ['prisma', 'migrate', 'deploy'], backendDir);
  await run('npm', ['run', 'prisma:seed'], backendDir);

  const env = readFileSync(backendEnvPath, 'utf8');
  const email = env.match(/^SEED_ADMIN_EMAIL="?([^"\r\n]+)"?/m)?.[1];
  const password = env.match(/^SEED_ADMIN_PASSWORD="?([^"\r\n]+)"?/m)?.[1];
  console.log('\n[setup] Pronto! Agora rode: npm run dev');
  console.log(`[setup] Login do painel: ${email} / ${password}`);
} finally {
  await stopDatabase?.();
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    child.once('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} falhou (${code})`))));
  });
}
