import type { APIRequestContext } from '@playwright/test';
import { ensureStoreOpen, futureIsoDate, getPublicCatalog, type PublicCatalog } from './api-fixtures';

export async function createCustomerOrder(request: APIRequestContext, suffix = Date.now().toString()) {
  await ensureStoreOpen(request);
  const catalog = await getPublicCatalog(request);

  const payload = {
    customerName: `Cliente Contrato ${suffix}`,
    customerPhone: `(86) 9${suffix.slice(-8).padStart(8, '0')}`,
    customerEmail: `cliente-${suffix}@example.com`,
    customerAddress: `Rua Teste ${suffix}`,
    desiredDate: futureIsoDate(),
    notes: 'Pedido criado pelo teste de contrato',
    cake: {
      doughId: catalog.doughs[0].publicId,
      cakeSizeId: catalog.cakeSizes[0].publicId,
      filling1Id: catalog.fillings[0].publicId,
      filling2Id: catalog.fillings[1]?.publicId ?? catalog.fillings[0].publicId,
      toppingId: catalog.toppings[0].publicId,
    },
  };

  const response = await request.post('/orders', { data: payload });

  return { response, payload };
}

export function makeOrderPayload(catalog: PublicCatalog, overrides: Partial<Record<string, unknown>> = {}) {
  return {
    customerName: `Cliente Teste ${Date.now()}`,
    customerPhone: `(86) 99999-${String(Date.now()).slice(-4)}`,
    customerEmail: `cliente-${Date.now()}@example.com`,
    customerAddress: 'Rua dos Testes, 123',
    desiredDate: futureIsoDate(),
    notes: 'Pedido automatizado',
    cake: {
      doughId: catalog.doughs[0].publicId,
      cakeSizeId: catalog.cakeSizes[0].publicId,
      filling1Id: catalog.fillings[0].publicId,
      filling2Id: catalog.fillings[1]?.publicId ?? catalog.fillings[0].publicId,
      toppingId: catalog.toppings[0].publicId,
    },
    ...overrides,
  };
}
