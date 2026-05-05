import type { OrderStatus } from '../types';

export const statusLabels: Record<OrderStatus, string> = {
  NEW: 'Novo',
  WAITING_DEPOSIT: 'Aguardando entrada',
  DEPOSIT_PAID: 'Entrada paga',
  CONFIRMED: 'Confirmado',
  IN_PRODUCTION: 'Em produção',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

export const orderStatuses = Object.keys(statusLabels) as OrderStatus[];
