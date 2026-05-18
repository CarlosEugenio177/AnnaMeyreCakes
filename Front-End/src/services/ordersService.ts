import type { CreateOrderPayload } from '../types';
import { api } from './api';

type CreateOrderResponse = {
  order: {
    publicId: string;
    orderCode: string;
    status: string;
    totalPrice: string | number;
    depositPrice: string | number;
    remainingPrice: string | number;
    desiredDate: string;
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
