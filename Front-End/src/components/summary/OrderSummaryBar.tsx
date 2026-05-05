import type { Catalog, SweetSelection } from '../../types';
import { calculatePricePreview, currency } from '../../utils/pricePreview';
import { MessageCircle } from 'lucide-react';
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

export function OrderSummaryBar({ disabled, isSubmitting, ...props }: OrderSummaryBarProps) {
  const preview = calculatePricePreview(props);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-6 py-4 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-muted">Total estimado</p>
          <p className="mt-1 font-display text-3xl text-cocoa">{currency.format(preview.total)}</p>
        </div>
        <Button type="submit" form="cake-builder-form" disabled={disabled || isSubmitting} className="min-w-44 py-4 text-xl">
          <MessageCircle className="h-5 w-5" aria-hidden />
          {isSubmitting ? 'Enviando...' : 'WhatsApp'}
        </Button>
      </div>
    </div>
  );
}
