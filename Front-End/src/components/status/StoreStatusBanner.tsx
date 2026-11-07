import { Clock } from 'lucide-react';

type StoreStatusBannerProps = {
  closed?: boolean;
};

export function StoreStatusBanner({ closed }: StoreStatusBannerProps) {
  if (!closed) {
    return null;
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/[0.06] p-4 text-cocoa">
      <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
      <div>
        <p className="font-semibold text-brand">Estamos com a agenda fechada no momento</p>
        <p className="mt-0.5 text-sm text-muted">Você pode montar seu bolo à vontade, mas novos pedidos ficam pausados até reabrirmos.</p>
      </div>
    </div>
  );
}
