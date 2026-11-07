import type { OrderStatus } from '../../types';
import { statusLabels } from '../../utils/statusLabels';
import { Badge } from '../ui/Badge';

type StatusBadgeProps = {
  status: OrderStatus;
};

const tones: Record<OrderStatus, 'rose' | 'cream' | 'green' | 'gray' | 'butter'> = {
  NEW: 'rose',
  WAITING_DEPOSIT: 'butter',
  DEPOSIT_PAID: 'green',
  CONFIRMED: 'green',
  IN_PRODUCTION: 'cream',
  READY: 'green',
  DELIVERED: 'gray',
  CANCELED: 'gray',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge tone={tones[status]} className="min-w-[96px] justify-center">
      {statusLabels[status]}
    </Badge>
  );
}
