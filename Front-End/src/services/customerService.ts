import type { CustomerOrder, CustomerProfile, ReorderPayload } from '../types';
import { api } from './api';

export async function getCurrentCustomer() {
  const { data } = await api.get<CustomerProfile>('/customer/me');
  return data;
}

export async function logoutCustomer() {
  await api.delete('/customer/session');
}

export async function getCustomerOrders() {
  const { data } = await api.get<CustomerOrder[]>('/customer/orders');
  return data;
}

export async function getReorderPayload(orderCode: string) {
  const { data } = await api.get<ReorderPayload>(`/customer/orders/${orderCode}/reorder`);
  return data;
}
