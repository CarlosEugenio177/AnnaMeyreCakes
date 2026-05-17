import type { CustomerOrder, CustomerProfile } from '../types';
import { api } from './api';

export async function getCurrentCustomer() {
  const { data } = await api.get<{ customer: CustomerProfile }>('/customer/me');
  return data.customer;
}

export async function logoutCustomer() {
  await api.delete('/customer/session');
}

export async function getCustomerOrders() {
  const { data } = await api.get<CustomerOrder[]>('/customer/orders');
  return data;
}

export async function getCustomerOrder(id: string) {
  const { data } = await api.get<CustomerOrder>(`/customer/orders/${id}`);
  return data;
}
