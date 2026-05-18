import { ArrowLeft, CalendarDays, CreditCard, MessageCircle, Package, UserRound } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { ErrorState } from '../../components/admin/ErrorState';
import { LoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Button } from '../../components/ui/Button';
import { createPayment, getAdminOrder, updateOrderStatus } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/api';
import type { AdminOrder, OrderStatus, PaymentMethod } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';
import { orderStatuses, statusLabels } from '../../utils/statusLabels';

type OrderDetailsProps = {
  id: string;
  navigate: (path: string) => void;
};

export function OrderDetails({ id, navigate }: OrderDetailsProps) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [paymentError, setPaymentError] = useState<string>();

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    setIsLoading(true);
    try {
      setOrder(await getAdminOrder(id));
    } catch {
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(status: OrderStatus) {
    if (!order) {
      return;
    }

    setIsSaving(true);
    try {
      setOrder(await updateOrderStatus(order.id, status));
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!order) {
      return;
    }

    const amount = Number(paymentAmount.replace(',', '.'));

    if (!Number.isFinite(amount) || amount <= 0) {
      setPaymentError('Informe um valor valido.');
      return;
    }

    setIsSaving(true);
    setPaymentError(undefined);
    try {
      await createPayment(order.id, {
        amount,
        paymentMethod,
        status: 'PAID',
      });
      setOrder(await getAdminOrder(order.id));
      setPaymentAmount('');
    } catch (error) {
      setPaymentError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout title="Detalhe do pedido" navigate={navigate}>
      <AdminPageHeader
        title={order?.orderCode ?? 'Detalhe do pedido'}
        subtitle="Confira dados do cliente, itens escolhidos, status e pagamentos."
        actions={
          <Button variant="secondary" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar
          </Button>
        }
      />

      {isLoading ? <AdminCard className="p-5"><LoadingSkeleton /></AdminCard> : null}
      {!isLoading && !order ? <ErrorState message="Pedido nao encontrado." onRetry={loadOrder} /> : null}

      {order ? (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="space-y-5">
            <AdminCard className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Pedido</p>
                  <h2 className="mt-2 font-display text-3xl font-bold text-roseText">{order.orderCode}</h2>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Info icon={UserRound} label="Cliente" value={order.customer.name} />
                <Info icon={MessageCircle} label="WhatsApp" value={order.customer.phone} />
                <Info icon={CalendarDays} label="Entrega" value={new Date(order.desiredDate).toLocaleDateString('pt-BR')} />
              </div>
            </AdminCard>

            <AdminCard className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-brand">
                  <Package className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-roseText">Itens escolhidos</h3>
                  <p className="text-sm text-muted">Resumo da encomenda registrada.</p>
                </div>
              </div>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-[18px] border border-line bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold text-brand">{item.productType === 'CAKE' ? 'Bolo' : 'Docinhos'}</p>
                      <p className="text-sm font-bold text-cocoa">{currency.format(toNumber(item.totalPrice))}</p>
                    </div>
                    {item.cakeDetail ? (
                      <p className="mt-2 text-sm leading-6 text-cocoa">
                        {item.cakeDetail.cakeSize.slices} fatias, massa {item.cakeDetail.dough.name}, recheios {item.cakeDetail.filling1.name} e{' '}
                        {item.cakeDetail.filling2.name}, cobertura {item.cakeDetail.topping.name}.
                      </p>
                    ) : null}
                    {item.sweetDetail ? (
                      <p className="mt-2 text-sm leading-6 text-cocoa">
                        {item.quantity} {item.sweetDetail.sweetType.name}: {item.sweetDetail.flavors.map((flavor) => flavor.sweetFlavor.name).join(', ')}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </AdminCard>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <AdminCard className="p-5">
              <h3 className="font-display text-2xl font-bold text-roseText">Status</h3>
              <p className="mt-1 text-sm text-muted">Atualize o andamento do pedido.</p>
              <select
                className="mt-4 min-h-12 w-full rounded-[18px] border border-line bg-white px-4 font-semibold text-cocoa outline-none focus:border-brand"
                value={order.status}
                disabled={isSaving}
                onChange={(event) => handleStatusChange(event.target.value as OrderStatus)}
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </AdminCard>

            <AdminCard className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-brand">
                  <CreditCard className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="font-display text-2xl font-bold text-roseText">Financeiro</h3>
              </div>
              <div className="space-y-2 rounded-[18px] bg-blush/45 p-4">
                <PriceRow label="Total" value={currency.format(toNumber(order.totalPrice))} strong />
                <PriceRow label="Entrada 50%" value={currency.format(toNumber(order.depositPrice))} />
                <PriceRow label="Restante" value={currency.format(toNumber(order.remainingPrice))} />
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">Pagamentos</p>
                {order.payments.length === 0 ? (
                  <p className="rounded-[16px] bg-white p-3 text-sm font-semibold text-muted">Nenhum pagamento registrado.</p>
                ) : (
                  <div className="space-y-2">
                    {order.payments.map((payment) => (
                      <div key={payment.id} className="rounded-[16px] bg-white px-3 py-2 text-sm">
                        <span className="font-bold text-cocoa">{currency.format(toNumber(payment.amount))}</span>
                        <span className="ml-2 text-muted">{payment.paymentMethod} - {payment.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <form className="mt-5 space-y-3" onSubmit={handlePaymentSubmit}>
                <input
                  className="min-h-12 w-full rounded-[18px] border border-line bg-white px-4 font-semibold text-cocoa outline-none focus:border-brand"
                  inputMode="decimal"
                  placeholder="Valor pago"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                />
                <select
                  className="min-h-12 w-full rounded-[18px] border border-line bg-white px-4 font-semibold text-cocoa outline-none focus:border-brand"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                >
                  <option value="PIX">PIX</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="CARD">Cartao</option>
                  <option value="BANK_TRANSFER">Transferencia</option>
                  <option value="OTHER">Outro</option>
                </select>
                {paymentError ? <p className="text-sm font-semibold text-brand">{paymentError}</p> : null}
                <Button type="submit" className="w-full" disabled={isSaving}>
                  Registrar pagamento
                </Button>
              </form>
            </AdminCard>
          </aside>
        </div>
      ) : null}
    </AdminLayout>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-line bg-white p-4">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" aria-hidden />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">{label}</span>
      </div>
      <p className="mt-2 font-semibold text-cocoa">{value}</p>
    </div>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${strong ? 'font-bold text-brand' : 'text-cocoa'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
