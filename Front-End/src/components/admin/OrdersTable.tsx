import { Eye } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { AdminOrder, OrderStatus } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';
import { orderStatuses, statusLabels } from '../../utils/statusLabels';
import { Button } from '../ui/Button';
import { StatusBadge } from './StatusBadge';

type OrdersTableProps = {
  orders: AdminOrder[];
  onOpen: (id: string) => void;
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string) => void;
  onToggleAll?: () => void;
  allVisibleSelected?: boolean;
  someVisibleSelected?: boolean;
  onStatusChange?: (id: string, status: OrderStatus) => void;
  updatingOrderIds?: Set<string>;
};

export function OrdersTable({
  orders,
  onOpen,
  selectedIds,
  onToggleSelection,
  onToggleAll,
  allVisibleSelected = false,
  someVisibleSelected = false,
  onStatusChange,
  updatingOrderIds = new Set<string>(),
}: OrdersTableProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const selectable = Boolean(selectedIds && onToggleSelection);
  const canBulkSelect = selectable && Boolean(onToggleAll);
  const canChangeStatus = Boolean(onStatusChange);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someVisibleSelected && !allVisibleSelected;
    }
  }, [allVisibleSelected, someVisibleSelected]);

  return (
    <>
      <div className="hidden overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_12px_30px_rgba(138,75,62,0.035)] md:block">
        <table className="w-full border-collapse text-left">
          <thead className="bg-blush/35 text-[11px] uppercase tracking-[0.16em] text-muted">
            <tr>
              {selectable ? (
                <th className="w-12 px-4 py-3">
                  {canBulkSelect ? (
                    <input
                      ref={selectAllRef}
                      aria-label="Selecionar todos os pedidos visiveis"
                      checked={allVisibleSelected}
                      className="h-4 w-4 rounded border-line accent-brand"
                      data-testid="orders-select-all"
                      disabled={orders.length === 0}
                      onChange={onToggleAll}
                      onClick={(event) => event.stopPropagation()}
                      type="checkbox"
                    />
                  ) : null}
                </th>
              ) : null}
              <th className="px-4 py-3 font-bold">Pedido</th>
              <th className="px-4 py-3 font-bold">Cliente</th>
              <th className="px-4 py-3 font-bold">Data</th>
              <th className="px-4 py-3 font-bold">Status</th>
              {canChangeStatus ? <th className="px-4 py-3 font-bold">Alterar</th> : null}
              <th className="px-4 py-3 text-right font-bold">Total</th>
              <th className="px-4 py-3 text-right font-bold">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/80">
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`cursor-pointer transition hover:bg-blush/20 ${selectedIds?.has(order.id) ? 'bg-blush/30' : ''}`}
                onClick={() => onOpen(order.id)}
              >
                {selectable ? (
                  <td className="px-4 py-3 align-middle">
                    <input
                      aria-label={`Selecionar pedido ${order.orderCode}`}
                      checked={selectedIds?.has(order.id) ?? false}
                      className="h-4 w-4 rounded border-line accent-brand"
                      data-testid={`order-checkbox-${order.orderCode}`}
                      disabled={updatingOrderIds.has(order.id)}
                      onChange={() => onToggleSelection?.(order.id)}
                      onClick={(event) => event.stopPropagation()}
                      type="checkbox"
                    />
                  </td>
                ) : null}
                <td className="px-4 py-3 align-middle">
                  <span className="block font-bold text-cocoa">{order.orderCode}</span>
                  <span className="text-xs text-muted">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span className="block text-sm font-semibold text-cocoa">{order.customer.name}</span>
                  <span className="text-xs text-muted">{order.customer.phone}</span>
                </td>
                <td className="px-4 py-3 align-middle text-sm font-semibold text-cocoa">{new Date(order.desiredDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-3 align-middle"><StatusBadge status={order.status} /></td>
                {canChangeStatus ? (
                  <td className="px-4 py-3 align-middle">
                    <select
                      className="min-h-9 rounded-full border border-line bg-white px-3 text-xs font-bold text-cocoa outline-none transition focus:border-brand disabled:cursor-wait disabled:opacity-60"
                      disabled={updatingOrderIds.has(order.id)}
                      onChange={(event) => onStatusChange?.(order.id, event.target.value as OrderStatus)}
                      onClick={(event) => event.stopPropagation()}
                      value={order.status}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>{statusLabels[status]}</option>
                      ))}
                    </select>
                  </td>
                ) : null}
                <td className="px-4 py-3 align-middle text-right font-bold text-brand">{currency.format(toNumber(order.totalPrice))}</td>
                <td className="px-4 py-3 text-right align-middle">
                  <Button type="button" variant="ghost" className="min-h-9 px-3 text-xs" onClick={(event) => { event.stopPropagation(); onOpen(order.id); }}>
                    <Eye className="h-4 w-4" aria-hidden />
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {orders.map((order) => (
          <article
            key={order.id}
            className={`w-full rounded-[20px] border border-line bg-surface p-4 text-left shadow-[0_10px_24px_rgba(138,75,62,0.04)] ${selectedIds?.has(order.id) ? 'border-brand/45 bg-blush/35' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                {selectable ? (
                  <input
                    aria-label={`Selecionar pedido ${order.orderCode}`}
                    checked={selectedIds?.has(order.id) ?? false}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-line accent-brand"
                    disabled={updatingOrderIds.has(order.id)}
                    onChange={() => onToggleSelection?.(order.id)}
                    type="checkbox"
                  />
                ) : null}
                <button className="min-w-0 text-left" onClick={() => onOpen(order.id)} type="button">
                <p className="font-bold text-cocoa">{order.orderCode}</p>
                <p className="mt-1 text-sm text-muted">{order.customer.name}</p>
                </button>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-sm text-muted">Entrega {new Date(order.desiredDate).toLocaleDateString('pt-BR')}</p>
              <p className="font-bold text-brand">{currency.format(toNumber(order.totalPrice))}</p>
            </div>
            {canChangeStatus ? (
              <select
                className="mt-4 min-h-11 w-full rounded-full border border-line bg-white px-4 text-sm font-bold text-cocoa outline-none transition focus:border-brand disabled:cursor-wait disabled:opacity-60"
                disabled={updatingOrderIds.has(order.id)}
                onChange={(event) => onStatusChange?.(order.id, event.target.value as OrderStatus)}
                value={order.status}
              >
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>{statusLabels[status]}</option>
                ))}
              </select>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}
