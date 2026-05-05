import type { CreateOrderPayload } from '../types';
import { api } from './api';

type CreateOrderResponse = {
  order: {
    id: string;
    orderCode: string;
  };
  whatsapp: {
    number: string;
    message: string;
    link: string;
  };
};

export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await api.post<CreateOrderResponse>('/orders', payload);
  return data;
}
