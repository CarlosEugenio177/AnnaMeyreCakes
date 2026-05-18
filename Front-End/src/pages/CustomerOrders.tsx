import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage } from '../services/api';
import { getCustomerOrders } from '../services/customerService';
import type { CustomerOrder } from '../types';
import { currency } from '../utils/pricePreview';

type CustomerOrdersProps = {
  navigate: (path: string) => void;
};

export function CustomerOrders({ navigate }: CustomerOrdersProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getCustomerOrders()
      .then(setOrders)
      .catch((requestError) => setError(getApiErrorMessage(requestError)))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-petal text-cocoa">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto grid max-w-[1160px] grid-cols-[1fr_auto_1fr] items-center">
          <Button variant="ghost" onClick={() => navigate('/builder')} className="justify-self-start px-0 text-xl font-normal">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar
          </Button>
          <Logo compact />
          <span aria-hidden />
        </div>
      </header>

      <section className="mx-auto w-full max-w-[960px] px-5 py-10 md:px-6">
        <div className="mb-7">
          <h1 className="font-display text-5xl leading-none md:text-6xl">Meus pedidos</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">Acompanhe seus pedidos feitos neste navegador.</p>
        </div>

        {isLoading ? <p className="rounded-[22px] bg-white/80 p-5 font-semibold text-muted">Carregando pedidos...</p> : null}
        {error ? <p className="rounded-[22px] bg-brand/10 p-5 font-semibold text-brand">{error}</p> : null}
        {!isLoading && !error && orders.length === 0 ? (
          <p className="rounded-[22px] bg-white/80 p-5 font-semibold text-muted">Voce ainda nao tem pedidos neste perfil.</p>
        ) : null}

        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.publicId} className="rounded-[22px] border border-line bg-white/85 p-5 shadow-[0_12px_34px_rgba(138,75,62,0.05)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted">{order.orderCode}</p>
                  <h2 className="mt-2 text-xl font-bold text-cocoa">{statusLabel[order.status] ?? order.status}</h2>
                  <p className="mt-1 text-sm text-muted">Entrega: {new Date(order.desiredDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm font-semibold text-muted">Total</p>
                  <p className="font-display text-3xl text-brand">{currency.format(Number(order.totalPrice))}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" variant="ghost" onClick={() => navigate('/builder')} className="px-3 py-2 text-sm">
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Repetir pedido
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const statusLabel: Record<string, string> = {
  NEW: 'Pedido recebido',
  WAITING_DEPOSIT: 'Aguardando entrada',
  DEPOSIT_PAID: 'Entrada paga',
  CONFIRMED: 'Confirmado',
  IN_PRODUCTION: 'Em producao',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};
