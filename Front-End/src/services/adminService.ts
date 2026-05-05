import type { AdminOrder, OrderStatus } from '../types';
import { api } from './api';

export async function getAdminOrders() {
  const { data } = await api.get<AdminOrder[]>('/admin/orders');
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { data } = await api.patch<AdminOrder>(`/admin/orders/${id}/status`, { status });
  return data;
}
