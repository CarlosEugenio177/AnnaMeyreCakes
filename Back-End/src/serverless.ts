import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from './app.factory';

type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void;

// A instancia do Nest e reaproveitada entre invocacoes da mesma funcao (warm start).
let cachedHandler: Promise<RequestHandler> | undefined;

async function bootstrap(): Promise<RequestHandler> {
  const app = await createApp();
  await app.init();
  return app.getHttpAdapter().getInstance() as RequestHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  cachedHandler ??= bootstrap().catch((error: unknown) => {
    cachedHandler = undefined;
    throw error;
  });

  const app = await cachedHandler;
  app(req, res);
}
