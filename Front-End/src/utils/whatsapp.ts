import { WHATSAPP_NUMBER, type Order } from '../data/menu';
import { calculateDeposit, calculateOrderTotal, currency } from './price';

export function buildWhatsAppMessage(order: Order) {
  const total = calculateOrderTotal(order.size, order.fillings, order.sweets);
  const deposit = calculateDeposit(total);
  const sweetsLine = order.sweets
    ? `${order.sweets.label} (${order.sweets.flavors.join(', ')})`
    : 'Nao selecionado';

  return [
    '*Pedido Anna Meyre Cakes*',
    '',
    `Cliente: ${order.customer.name}`,
    `WhatsApp: ${order.customer.whatsapp}`,
    `Data desejada: ${order.customer.desiredDate}`,
    '',
    '*Bolo personalizado*',
    `Massa: ${order.base}`,
    `Tamanho: ${order.size.label}`,
    `Recheios: ${order.fillings.join(' + ')}`,
    `Cobertura: ${order.topping}`,
    `Docinhos: ${sweetsLine}`,
    '',
    `Valor total: ${currency.format(total)}`,
    `Entrada 50%: ${currency.format(deposit)}`,
    '',
    `Observacoes: ${order.customer.notes || 'Sem observacoes'}`,
    '',
    'Ciente: encomendas somente pelo WhatsApp, pedido ate 3 dias antes, 50% de entrada e sem chantilly.',
  ].join('\n');
}

export function buildWhatsAppLink(order: Order) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(order))}`;
}
