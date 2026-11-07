// Espera o banco do DATABASE_URL aceitar conexoes antes de subir a API.
import net from 'node:net';
import { readDatabaseConfig } from './local-env.mjs';

const { host, port } = readDatabaseConfig();
const timeoutMs = 120_000;
const startedAt = Date.now();

while (!(await canConnect())) {
  if (Date.now() - startedAt > timeoutMs) {
    console.error(`[db] O banco em ${host}:${port} nao respondeu em ${timeoutMs / 1000}s.`);
    process.exit(1);
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

function canConnect() {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });
}
