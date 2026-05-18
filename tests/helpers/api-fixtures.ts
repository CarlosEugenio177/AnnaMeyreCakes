import { expect, type APIRequestContext } from '@playwright/test';

export type PublicCatalog = {
  doughs: Array<{ publicId: string; name: string; colorHex: string }>;
  fillings: Array<{ publicId: string; name: string; extraPrice: string | number; colorHex: string }>;
  toppings: Array<{ publicId: string; name: string; colorHex: string }>;
  cakeSizes: Array<{ publicId: string; slices: number; price: string | number }>;
  sweetTypes: Array<{
    publicId: string;
    name: string;
    pricePer100: string | number;
    flavors: Array<{ publicId: string; name: string; sweetTypePublicId: string }>;
  }>;
};

export async function getPublicCatalog(request: APIRequestContext): Promise<PublicCatalog> {
  const response = await request.get('/api/public/catalog');
  expect(response.ok()).toBeTruthy();
  return response.json();
}

export async function loginAdmin(request: APIRequestContext) {
  const response = await request.post('/admin/login', {
    data: {
      email: process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? 'admin@annameyrecakes.local',
      password: process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? 'admin123',
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return body.accessToken as string;
}

export async function getAdminOrderByCode(request: APIRequestContext, orderCode: string) {
  const token = await loginAdmin(request);
  const response = await request.get('/admin/orders', {
    headers: authHeaders(token),
  });

  expect(response.ok()).toBeTruthy();
  const orders = await response.json();
  const order = orders.find((candidate: { orderCode?: string }) => candidate.orderCode === orderCode);
  expect(order, `Expected admin order with code ${orderCode}`).toBeTruthy();
  return order;
}

export function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function ensureStoreOpen(request: APIRequestContext) {
  const token = await loginAdmin(request);
  const response = await request.patch('/admin/settings', {
    headers: authHeaders(token),
    data: { storeStatus: 'OPEN' },
  });

  expect(response.ok()).toBeTruthy();
}

export function numberValue(value: string | number) {
  return Number(value);
}

export function futureIsoDate(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function byName<T extends { name: string }>(items: T[], name: string) {
  const item = items.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
  expect(item, `Expected catalog item named "${name}"`).toBeTruthy();
  return item!;
}

export function bySlices<T extends { slices: number }>(items: T[], slices: number) {
  const item = items.find((candidate) => candidate.slices === slices);
  expect(item, `Expected cake size with ${slices} slices`).toBeTruthy();
  return item!;
}
