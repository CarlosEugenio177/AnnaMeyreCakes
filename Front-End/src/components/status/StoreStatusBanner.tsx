import { AlertCircle } from 'lucide-react';

type StoreStatusBannerProps = {
  closed?: boolean;
};

export function StoreStatusBanner({ closed }: StoreStatusBannerProps) {
  if (!closed) {
    return null;
  }

  return (
    <div className="mx-5 flex items-start gap-3 rounded-[22px] border border-brand/25 bg-brand/10 px-4 py-4 text-brand shadow-[0_12px_24px_rgba(230,30,77,0.1)] md:mx-0 md:px-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
        <AlertCircle className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <p className="font-display text-xl font-bold leading-tight text-brand md:text-2xl">Loja temporariamente fechada</p>
        <p className="mt-1.5 text-base font-semibold leading-relaxed text-cocoa md:text-lg">
          No momento nao estamos aceitando encomendas. Voce pode navegar e montar seu bolo, mas a finalizacao esta bloqueada.
        </p>
      </div>
    </div>
  );
}
