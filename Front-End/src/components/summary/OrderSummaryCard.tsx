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
      <dl className="space-y-2 text-sm">
        <Row label="Massa" value={findName(catalog?.doughs, doughId)} />
        <Row label="Tamanho" value={size ? `${size.slices} fatias` : undefined} />
        <Row label="Recheios" value={fillings || undefined} />
        <Row label="Cobertura" value={findName(catalog?.toppings, toppingId)} />
        {sweets.map((sweet, index) => (
          <Row key={index} label="Docinhos" value={`${sweet.quantity} ${findName(catalog?.sweetTypes, sweet.sweetTypeId)?.toLowerCase() ?? ''}`} />
        ))}
      </dl>

      <div className="mt-4 space-y-1 rounded-2xl bg-cream p-4 text-sm">
        <div data-testid="order-total" className="flex items-baseline justify-between">
          <span className="font-bold text-choco">Total</span>
          <span className="font-display text-3xl text-choco">{currency.format(preview.total)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Entrada (50%) para reservar</span>
          <span className="font-semibold text-brand">{currency.format(preview.deposit)}</span>
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
      <dd className={`text-right font-semibold ${value ? 'text-choco' : 'text-muted/60'}`}>{value ?? 'escolher'}</dd>
    </div>
  );
}
