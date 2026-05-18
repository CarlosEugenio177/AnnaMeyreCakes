import type { OrderStatus } from '../../types';
import { statusLabels } from '../../utils/statusLabels';
import { Badge } from '../ui/Badge';

type StatusBadgeProps = {
  status: OrderStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone = status === 'CANCELED' ? 'gray' : status === 'DELIVERED' || status === 'READY' ? 'green' : 'rose';
  return <Badge tone={tone} className="min-w-[92px] justify-center">{statusLabels[status]}</Badge>;
}
