// Sobe um PostgreSQL local embutido (pacote npm "embedded-postgres"), sem Docker
// e sem instalar o Postgres na maquina. Os dados ficam em .pgdata/ e persistem
// entre execucoes. Usa usuario, senha, porta e banco do DATABASE_URL do Back-End/.env.
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isLocalHost, readDatabaseConfig, rootDir } from './local-env.mjs';

// Retorna uma funcao para desligar o banco, ou null se nao foi preciso iniciar um.
export async function startDatabase() {
  const config = readDatabaseConfig();

  if (!isLocalHost(config.host)) {
    console.log(`[db] DATABASE_URL aponta para ${config.host}; nenhum banco local sera iniciado.`);
    return null;
  }

  if (await isPortInUse(config.port)) {
    console.log(`[db] Ja existe um banco escutando na porta ${config.port}; usando ele.`);
    return null;
  }

  const dataDir = join(rootDir, '.pgdata');
  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: config.user,
    password: config.password,
    port: config.port,
    persistent: true,
    onLog: () => {},
  });

  if (!existsSync(join(dataDir, 'PG_VERSION'))) {
    console.log('[db] Criando o banco local em .pgdata/ (so na primeira vez)...');
    await pg.initialise();
  }

  await pg.start();

  try {
    await pg.createDatabase(config.database);
  } catch {
    // O banco ja existe.
  }

  console.log(`[db] PostgreSQL pronto em localhost:${config.port}/${config.database}`);
  return () => pg.stop();
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}

// Execucao direta (npm run dev:db): mantem o banco no ar ate Ctrl+C.
const invokedPath = process.argv[1] ? resolvePath(process.argv[1]).toLowerCase() : '';
if (invokedPath === fileURLToPath(import.meta.url).toLowerCase()) {
  const stopDatabase = await startDatabase();

  if (stopDatabase) {
    let stopping = false;
    const stop = async () => {
      if (stopping) {
        return;
      }
      stopping = true;
      console.log('[db] Desligando o PostgreSQL...');
      await stopDatabase().catch(() => {});
      process.exit(0);
    };

    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
    process.on('SIGHUP', stop);
    setInterval(() => {}, 1 << 30);
  }
}
