import type { CreateOrderPayload, PixCharge } from '../types';
import { api } from './api';

export type CreateOrderResponse = {
  order: {
    publicId: string;
    orderCode: string;
    status: string;
    totalPrice: string | number;
    depositPrice: string | number;
    remainingPrice: string | number;
    desiredDate: string;
  };
  pix: PixCharge | null;
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
