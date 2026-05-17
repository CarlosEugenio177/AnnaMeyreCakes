import { useEffect, useState, type FormEvent } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
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
  const [isSaving, setIsSaving] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [paymentError, setPaymentError] = useState<string>();

  useEffect(() => {
    getAdminOrder(id).then(setOrder).catch(() => setOrder(null));
  }, [id]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) {
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrder(updated);
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
      const updated = await getAdminOrder(order.id);
      setOrder(updated);
      setPaymentAmount('');
    } catch (error) {
      setPaymentError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout title="Detalhe do pedido" navigate={navigate}>
      {!order ? (
        <Card>Pedido não encontrado.</Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <section className="space-y-5">
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase text-softGray">Código</p>
                  <h2 className="font-display text-3xl font-bold text-roseText">{order.orderCode}</h2>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
                <Info label="Cliente" value={order.customer.name} />
                <Info label="WhatsApp" value={order.customer.phone} />
                <Info label="Data desejada" value={new Date(order.desiredDate).toLocaleDateString('pt-BR')} />
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 font-display text-2xl font-bold text-roseText">Itens</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-[18px] border border-brand/10 bg-white px-4 py-3">
                    <p className="font-bold text-brand">{item.productType === 'CAKE' ? 'Bolo' : 'Docinhos'}</p>
                    {item.cakeDetail ? (
                      <p className="mt-1 text-sm text-cocoa">
                        {item.cakeDetail.cakeSize.slices} fatias, massa {item.cakeDetail.dough.name}, recheios {item.cakeDetail.filling1.name} e{' '}
                        {item.cakeDetail.filling2.name}, cobertura {item.cakeDetail.topping.name}.
                      </p>
                    ) : null}
                    {item.sweetDetail ? (
                      <p className="mt-1 text-sm text-cocoa">
                        {item.quantity} {item.sweetDetail.sweetType.name}: {item.sweetDetail.flavors.map((flavor) => flavor.sweetFlavor.name).join(', ')}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </Card>
          </section>

          <aside className="space-y-5">
            <Card>
              <h3 className="mb-4 font-display text-2xl font-bold text-roseText">Status</h3>
              <select
                className="min-h-14 w-full rounded-[18px] border border-brand/10 bg-white px-4 font-semibold text-cocoa outline-none"
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
            </Card>
            <Card>
              <h3 className="mb-3 font-display text-2xl font-bold text-roseText">Financeiro</h3>
              <Info label="Total" value={currency.format(toNumber(order.totalPrice))} />
              <Info label="Entrada 50%" value={currency.format(toNumber(order.depositPrice))} />
              <Info label="Restante" value={currency.format(toNumber(order.remainingPrice))} />
              <div className="mt-5 border-t border-brand/10 pt-4">
                <p className="mb-3 text-xs font-bold uppercase text-softGray">Pagamentos</p>
                {order.payments.length === 0 ? (
                  <p className="text-sm font-semibold text-softGray">Nenhum pagamento registrado.</p>
                ) : (
                  <div className="space-y-2">
                    {order.payments.map((payment) => (
                      <div key={payment.id} className="rounded-[16px] bg-white px-3 py-2 text-sm">
                        <span className="font-bold text-cocoa">{currency.format(toNumber(payment.amount))}</span>
                        <span className="ml-2 text-softGray">{payment.paymentMethod} - {payment.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <form className="mt-5 space-y-3" onSubmit={handlePaymentSubmit}>
                <input
                  className="min-h-12 w-full rounded-[18px] border border-brand/10 bg-white px-4 font-semibold text-cocoa outline-none"
                  inputMode="decimal"
                  placeholder="Valor pago"
                  value={paymentAmount}
                  onChange={(event) => setPaymentAmount(event.target.value)}
                />
                <select
                  className="min-h-12 w-full rounded-[18px] border border-brand/10 bg-white px-4 font-semibold text-cocoa outline-none"
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
            </Card>
            <Button className="w-full" variant="secondary" onClick={() => navigate('/admin/orders')}>Voltar para pedidos</Button>
          </aside>
        </div>
      )}
    </AdminLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="block text-xs font-bold uppercase text-softGray">{label}</span>
      <span className="font-semibold text-cocoa">{value}</span>
    </p>
  );
}
