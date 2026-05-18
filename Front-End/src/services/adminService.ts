import type {
  AdminOrder,
  CreatePaymentPayload,
  OrderStatus,
  PaymentRecord,
} from '../types';
import { api } from './api';

export async function getAdminOrders() {
  const { data } = await api.get<AdminOrder[]>('/admin/orders');
  return data;
}

export async function getAdminOrder(id: string) {
  const { data } = await api.get<AdminOrder>(`/admin/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { data } = await api.patch<AdminOrder>(`/admin/orders/${id}/status`, { status });
  return data;
}

export async function updateOrderStatusesBulk(orderIds: string[], status: OrderStatus) {
  const { data } = await api.patch<{ updatedCount: number; orders: AdminOrder[] }>('/api/admin/orders/status', {
    orderIds,
    status,
  });
  return data;
}

export async function createPayment(id: string, payload: CreatePaymentPayload) {
  const { data } = await api.post<PaymentRecord>(`/admin/orders/${id}/payments`, payload);
  return data;
}
