import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { AdminCard } from './AdminCard';

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <AdminCard className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
          <AlertCircle className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-bold text-roseText">Nao foi possivel carregar</h2>
          <p className="mt-1 text-sm text-muted">{message}</p>
        </div>
      </div>
      {onRetry ? <Button type="button" variant="secondary" onClick={onRetry}>Tentar novamente</Button> : null}
    </AdminCard>
  );
}
