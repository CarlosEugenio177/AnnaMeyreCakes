import type { AdminOrder } from '../types';

export function normalizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, '');
}

export function buildFallbackWhatsAppLink(number: string, message: string) {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`;
}

export function getOrderWhatsAppMessage(order: AdminOrder) {
  return order.whatsappMessage ?? `Pedido Anna Meyre Cakes ${order.orderCode}`;
}
