import type { Catalog, SweetSelection } from '../../types';
import { calculatePricePreview, currency } from '../../utils/pricePreview';
import { Card } from '../ui/Card';

type OrderSummaryCardProps = {
  catalog?: Catalog | null;
  cakeSizeId?: string;
  filling1Id?: string;
  filling2Id?: string;
  sweets: SweetSelection[];
};

export function OrderSummaryCard(props: OrderSummaryCardProps) {
  const preview = calculatePricePreview(props);

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-roseText">Resumo</h2>
        <span className="text-xs font-bold uppercase text-softGray">Prévia</span>
      </div>
      <SummaryRow label="Bolo" value={currency.format(preview.cakeTotal)} />
      <SummaryRow label="Docinhos" value={currency.format(preview.sweetTotal)} />
      <div className="border-t border-brand/10 pt-3">
        <SummaryRow label="Total" value={currency.format(preview.total)} strong />
        <SummaryRow label="Entrada 50%" value={currency.format(preview.deposit)} />
        <SummaryRow label="Restante" value={currency.format(preview.remaining)} />
      </div>
    </Card>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 text-sm ${strong ? 'font-bold text-brand' : 'text-cocoa'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
