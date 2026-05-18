import { SearchX } from 'lucide-react';
import { AdminCard } from './AdminCard';

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <AdminCard className="grid place-items-center px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-blush text-brand">
        <SearchX className="h-5 w-5" aria-hidden />
      </span>
      <h2 className="mt-4 font-display text-2xl font-bold text-roseText">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
    </AdminCard>
  );
}
