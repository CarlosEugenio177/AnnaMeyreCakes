import type { Order } from '../data/menu';
import { calculateDeposit, calculateFillingExtra, calculateOrderTotal, currency } from '../utils/price';
import { Card } from './Card';
import { SectionTitle } from './SectionTitle';

type OrderSummaryProps = {
  order: Order;
};

export function OrderSummary({ order }: OrderSummaryProps) {
  const total = calculateOrderTotal(order.size, order.fillings, order.sweets);
  const fillingExtra = calculateFillingExtra(order.fillings);

  return (
    <Card>
      <SectionTitle title="Resumo do pedido" hint="Confira antes de enviar pelo WhatsApp." />
      <dl className="space-y-3 text-sm">
        <SummaryRow label="Tipo" value={order.sweets ? 'Bolo + docinhos' : 'Bolo personalizado'} />
        <SummaryRow label="Massa" value={order.base} />
        <SummaryRow label="Tamanho" value={`${order.size.label} - ${currency.format(order.size.price)}`} />
        <SummaryRow label="Recheios" value={order.fillings.join(' + ') || 'Escolha 2 recheios'} />
        <SummaryRow label="Adicionais" value={currency.format(fillingExtra)} />
        <SummaryRow label="Cobertura" value={order.topping} />
        <SummaryRow label="Docinhos" value={order.sweets ? `${order.sweets.label} - ${currency.format(order.sweets.price)}` : 'Nao selecionado'} />
        <SummaryRow label="Observacoes" value={order.customer.notes || 'Sem observacoes'} />
      </dl>
      <div className="mt-5 rounded-[22px] bg-petal p-4 text-center">
        <p className="text-sm font-semibold text-softGray">Valor total</p>
        <p className="font-display text-3xl font-bold text-brand">{currency.format(total)}</p>
        <p className="mt-1 text-sm text-softGray">Entrada de 50%: {currency.format(calculateDeposit(total))}</p>
      </div>
    </Card>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex gap-4 border-b border-brand/8 pb-3 last:border-b-0">
      <dt className="w-24 shrink-0 font-semibold text-roseText">{label}</dt>
      <dd className="min-w-0 flex-1 text-right leading-relaxed text-[#4b4141]">{value}</dd>
    </div>
  );
}
