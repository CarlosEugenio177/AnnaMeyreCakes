import { MessageCircle } from 'lucide-react';
import type { Catalog, SweetSelection } from '../../types';
import { calculatePricePreview, currency } from '../../utils/pricePreview';
import { Button } from '../ui/Button';

type OrderSummaryBarProps = {
  catalog?: Catalog | null;
  cakeSizeId?: string;
  filling1Id?: string;
  filling2Id?: string;
  sweets: SweetSelection[];
  disabled?: boolean;
  isSubmitting?: boolean;
};

// Barra fixa no rodape, so no celular (no desktop o resumo fica na lateral).
export function OrderSummaryBar({ disabled, isSubmitting, ...props }: OrderSummaryBarProps) {
  const preview = calculatePricePreview(props);

  return (
    <div className="fixed inset-x-3 bottom-3 z-20 rounded-[24px] bg-choco px-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 text-cream shadow-[0_20px_40px_-12px_rgba(42,23,18,0.6)] lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-butter">Total</p>
          <p className="font-display text-2xl leading-tight">{currency.format(preview.total)}</p>
        </div>
        <Button type="submit" form="cake-builder-form" disabled={disabled || isSubmitting} className="min-h-12 px-6">
          <MessageCircle className="h-4 w-4" aria-hidden />
          {isSubmitting ? 'Enviando...' : 'Fazer pedido'}
        </Button>
      </div>
    </div>
  );
}
