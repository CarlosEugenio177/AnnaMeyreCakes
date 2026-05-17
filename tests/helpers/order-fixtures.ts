import type { APIRequestContext } from '@playwright/test';

export async function createCustomerOrder(request: APIRequestContext, suffix = Date.now().toString()) {
  const catalogResponse = await request.get('/api/public/catalog');
  const catalog = await catalogResponse.json();
  const desiredDate = new Date();
  desiredDate.setDate(desiredDate.getDate() + 7);

  const payload = {
    customerName: `Cliente Contrato ${suffix}`,
    customerPhone: `(86) 9${suffix.slice(-8).padStart(8, '0')}`,
    customerEmail: `cliente-${suffix}@example.com`,
    customerAddress: `Rua Teste ${suffix}`,
    desiredDate: desiredDate.toISOString(),
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
