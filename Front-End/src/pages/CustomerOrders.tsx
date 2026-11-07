import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage } from '../services/api';
import { getCustomerOrders, getReorderPayload } from '../services/customerService';
import { useOrderStore } from '../store/orderStore';
import type { CustomerOrder, OrderStatus } from '../types';
import { formatDeliveryDate } from '../utils/date';
import { currency } from '../utils/pricePreview';

type CustomerOrdersProps = {
  navigate: (path: string) => void;
};

export function CustomerOrders({ navigate }: CustomerOrdersProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [reorderingCode, setReorderingCode] = useState<string>();

  useEffect(() => {
    getCustomerOrders()
      .then(setOrders)
      .catch((requestError) => setError(getApiErrorMessage(requestError)))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleReorder(orderCode: string) {
    setError(undefined);
    setReorderingCode(orderCode);
    try {
      const payload = await getReorderPayload(orderCode);
      useOrderStore.setState({
        selectedDoughId: payload.cake?.doughId,
        selectedCakeSizeId: payload.cake?.cakeSizeId,
        selectedFilling1Id: payload.cake?.filling1Id,
        selectedFilling2Id: payload.cake?.filling2Id,
        selectedToppingId: payload.cake?.toppingId,
        sweets: payload.sweets,
      });
      navigate('/builder');
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setReorderingCode(undefined);
    }
  }

  return (
    <main className="min-h-screen bg-cream text-cocoa">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-3xl grid-cols-[1fr_auto_1fr] items-center px-5">
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="inline-flex items-center gap-1.5 justify-self-start text-sm font-medium text-muted hover:text-cocoa"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar
          </button>
          <Logo compact />
          <span aria-hidden />
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Meus pedidos</h1>
        <p className="mt-2 text-muted">Acompanhe os pedidos feitos neste aparelho.</p>

        <div className="mt-8 space-y-3">
          {isLoading ? <p className="rounded-2xl border border-line bg-surface p-5 text-muted">Carregando pedidos...</p> : null}
          {error ? <p className="rounded-2xl bg-brand/10 p-5 font-medium text-brand">{error}</p> : null}
          {!isLoading && !error && orders.length === 0 ? (
            <div className="rounded-3xl border border-line bg-surface p-8 text-center">
              <p className="text-muted">Você ainda não fez nenhum pedido por aqui.</p>
              <Button className="mt-5" onClick={() => navigate('/builder')}>
                Montar meu bolo
              </Button>
            </div>
          ) : null}

          {orders.map((order) => (
            <article key={order.publicId} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wider text-muted">{order.orderCode}</p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>
                    {statusLabel[order.status] ?? order.status}
                  </span>
                  <p className="mt-3 text-sm text-muted">Entrega em {formatDeliveryDate(order.desiredDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Total</p>
                  <p className="font-display text-2xl font-semibold">{currency.format(Number(order.totalPrice))}</p>
                </div>
              </div>
              <div className="mt-4 border-t border-line pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={reorderingCode !== undefined}
                  onClick={() => void handleReorder(order.orderCode)}
                  className="-ml-3"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  {reorderingCode === order.orderCode ? 'Carregando...' : 'Pedir de novo'}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const statusLabel: Record<OrderStatus, string> = {
  NEW: 'Pedido recebido',
  WAITING_DEPOSIT: 'Aguardando entrada',
  DEPOSIT_PAID: 'Entrada paga',
  CONFIRMED: 'Confirmado',
  IN_PRODUCTION: 'Em produção',
  READY: 'Pronto',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

function statusTone(status: OrderStatus) {
  if (status === 'CANCELED') {
    return 'bg-stone-100 text-stone-600';
  }
  if (status === 'READY' || status === 'DELIVERED') {
    return 'bg-emerald-50 text-emerald-700';
  }
  return 'bg-blush text-brand';
}
