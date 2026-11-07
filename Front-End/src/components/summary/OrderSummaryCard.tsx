import type { Catalog, SweetSelection } from '../../types';
import { calculatePricePreview, currency } from '../../utils/pricePreview';

export type OrderSummaryProps = {
  catalog?: Catalog | null;
  doughId?: string;
  cakeSizeId?: string;
  filling1Id?: string;
  filling2Id?: string;
  toppingId?: string;
  sweets: SweetSelection[];
};

export function OrderSummaryCard(props: OrderSummaryProps) {
  const { catalog, doughId, cakeSizeId, filling1Id, filling2Id, toppingId, sweets } = props;
  const preview = calculatePricePreview(props);
  const findName = <T extends { id: string; name: string }>(items: T[] | undefined, id?: string) => items?.find((item) => item.id === id)?.name;
  const size = catalog?.cakeSizes.find((item) => item.id === cakeSizeId);
  const fillings = [findName(catalog?.fillings, filling1Id), findName(catalog?.fillings, filling2Id)].filter(Boolean).join(' + ');

  return (
    <div data-testid="order-summary">
      <h2 className="font-display text-xl font-semibold text-cocoa">Seu pedido</h2>

      <dl className="mt-4 space-y-2.5 text-sm">
        <Row label="Massa" value={findName(catalog?.doughs, doughId)} />
        <Row label="Tamanho" value={size ? `${size.slices} fatias` : undefined} />
        <Row label="Recheios" value={fillings || undefined} />
        <Row label="Cobertura" value={findName(catalog?.toppings, toppingId)} />
        {sweets.map((sweet, index) => (
          <Row key={index} label="Docinhos" value={`${sweet.quantity} ${findName(catalog?.sweetTypes, sweet.sweetTypeId)?.toLowerCase() ?? ''}`} />
        ))}
      </dl>

      <div className="mt-5 space-y-1.5 border-t border-dashed border-line pt-4 text-sm">
        <div data-testid="order-total" className="flex items-baseline justify-between">
          <span className="font-semibold text-cocoa">Total</span>
          <span className="font-display text-2xl font-semibold text-cocoa">{currency.format(preview.total)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Entrada de 50% para reservar</span>
          <span>{currency.format(preview.deposit)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Restante na entrega</span>
          <span>{currency.format(preview.remaining)}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-cocoa">{value ?? '—'}</dd>
    </div>
  );
}
