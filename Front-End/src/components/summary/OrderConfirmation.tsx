import { MessageCircle, PartyPopper } from 'lucide-react';
import type { CreateOrderResponse } from '../../services/ordersService';
import { formatDeliveryDate } from '../../utils/date';
import { currency, toNumber } from '../../utils/pricePreview';
import { PixPayment } from '../payment/PixPayment';
import { Button, buttonBase, buttonVariants } from '../ui/Button';

type OrderConfirmationProps = {
  result: CreateOrderResponse;
  onNewOrder: () => void;
  onViewOrders: () => void;
};

export function OrderConfirmation({ result, onNewOrder, onViewOrders }: OrderConfirmationProps) {
  const { order, pix, whatsapp } = result;

  return (
    <section className="mx-auto max-w-2xl animate-rise" data-testid="order-confirmation">
      <div className="sprinkles relative overflow-hidden rounded-[32px] bg-choco px-6 pb-8 pt-10 text-center text-cream">
        <span className="mx-auto grid h-16 w-16 animate-wobble place-items-center rounded-3xl bg-butter text-choco">
          <PartyPopper className="h-8 w-8" aria-hidden />
        </span>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.25em] text-butter">Pedido recebido</p>
        <h2 className="mt-2 font-display text-4xl sm:text-5xl">Oba! Seu bolo já está na fila.</h2>
        <p className="mx-auto mt-3 max-w-md text-cream/75">
          Código <strong className="text-cream">{order.orderCode}</strong> · entrega em {formatDeliveryDate(order.desiredDate)}
        </p>
      </div>

      <div className="-mt-4 space-y-4 rounded-[32px] bg-surface p-5 shadow-soft sm:p-7">
        <ol className="space-y-3">
          <Step number={1} title="Pague a entrada de 50%">
            Seu bolo é reservado quando a entrada é confirmada. O restante é pago na entrega.
          </Step>
          <Step number={2} title="Confirme com a gente no WhatsApp">
            Envie a mensagem do pedido (e o comprovante, se já pagou).
          </Step>
        </ol>

        {pix ? (
          <PixPayment code={pix.code} amount={pix.amount} />
        ) : (
          <p className="rounded-2xl bg-cream p-4 text-sm text-muted">
            Entrada de <strong className="text-choco">{currency.format(toNumber(order.depositPrice))}</strong>: combinamos a forma de pagamento pelo WhatsApp.
          </p>
        )}

        <div className="flex justify-between rounded-2xl bg-cream px-4 py-3 text-sm">
          <span className="text-muted">Total do pedido</span>
          <span className="font-bold text-choco">{currency.format(toNumber(order.totalPrice))}</span>
        </div>

        <a
          href={whatsapp.link}
          target="_blank"
          rel="noreferrer"
          data-testid="whatsapp-link"
          className={`${buttonBase} ${buttonVariants.primary} min-h-14 w-full text-base`}
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          Enviar pedido no WhatsApp
        </a>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="secondary" onClick={onViewOrders}>
            Ver meus pedidos
          </Button>
          <Button type="button" variant="ghost" onClick={onNewOrder} data-testid="new-order-button">
            Montar outro bolo
          </Button>
        </div>
      </div>
    </section>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: string }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush font-display text-brand">{number}</span>
      <div>
        <p className="font-bold text-choco">{title}</p>
        <p className="text-sm text-muted">{children}</p>
      </div>
    </li>
  );
}
