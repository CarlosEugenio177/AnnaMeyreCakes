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
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted">Total</p>
          <p className="font-display text-2xl font-semibold leading-tight text-cocoa">{currency.format(preview.total)}</p>
        </div>
        <Button type="submit" form="cake-builder-form" disabled={disabled || isSubmitting} className="min-h-12 px-6">
          <MessageCircle className="h-4 w-4" aria-hidden />
          {isSubmitting ? 'Enviando...' : 'Fazer pedido'}
        </Button>
      </div>
    </div>
  );
}
