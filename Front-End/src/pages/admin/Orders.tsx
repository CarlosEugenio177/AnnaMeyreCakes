import { RefreshCw, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { ErrorState } from '../../components/admin/ErrorState';
import { LoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { OrdersTable } from '../../components/admin/OrdersTable';
import { Button } from '../../components/ui/Button';
import { getAdminOrders, updateOrderStatus, updateOrderStatusesBulk } from '../../services/adminService';
import type { AdminOrder, OrderStatus } from '../../types';
import { orderStatuses, statusLabels } from '../../utils/statusLabels';

type OrdersProps = {
  navigate: (path: string) => void;
};

type StatusFilter = 'ALL' | OrderStatus;

const filters: Array<{ value: StatusFilter; label: string }> = [
  { value: 'ALL', label: 'Todos' },
  { value: 'NEW', label: 'Novo' },
  { value: 'IN_PRODUCTION', label: 'Em preparo' },
  { value: 'DELIVERED', label: 'Finalizado' },
  { value: 'CANCELED', label: 'Cancelado' },
];

export function Orders({ navigate }: OrdersProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>('IN_PRODUCTION');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [updatingOrderIds, setUpdatingOrderIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string>();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    setError(undefined);
    setSuccessMessage(undefined);
    try {
      setOrders(await getAdminOrders());
      setSelectedIds(new Set());
    } catch {
      setError('Nao conseguimos carregar a lista de pedidos.');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = status === 'ALL' || order.status === status;
      const matchesSearch =
        term.length === 0 ||
        order.orderCode.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.phone.includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, status]);

  useEffect(() => {
    setSelectedIds(new Set());
    setSuccessMessage(undefined);
  }, [search, status]);

  const selectedVisibleCount = filteredOrders.filter((order) => selectedIds.has(order.id)).length;
  const allVisibleSelected = filteredOrders.length > 0 && selectedVisibleCount === filteredOrders.length;
  const someVisibleSelected = selectedVisibleCount > 0;

  function toggleSelection(id: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) {
        filteredOrders.forEach((order) => next.delete(order.id));
      } else {
        filteredOrders.forEach((order) => next.add(order.id));
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function replaceUpdatedOrders(updatedOrders: AdminOrder[]) {
    const updatedById = new Map(updatedOrders.map((order) => [order.id, order]));
    setOrders((current) => current.map((order) => updatedById.get(order.id) ?? order));
  }

  async function handleBulkStatusChange() {
    const orderIds = Array.from(selectedIds);
    if (orderIds.length === 0) {
      return;
    }

    if (bulkStatus === 'CANCELED' && !window.confirm(`Tem certeza que deseja cancelar ${orderIds.length} pedido(s)?`)) {
      return;
    }

    setIsBulkUpdating(true);
    setError(undefined);
    setSuccessMessage(undefined);
    try {
      const result = await updateOrderStatusesBulk(orderIds, bulkStatus);
      replaceUpdatedOrders(result.orders);
      setSelectedIds(new Set());
      setSuccessMessage(`${result.updatedCount} pedido(s) atualizados para ${statusLabels[bulkStatus]}.`);
    } catch {
      setError('Nao foi possivel alterar os status selecionados.');
    } finally {
      setIsBulkUpdating(false);
    }
  }

  async function handleSingleStatusChange(id: string, nextStatus: OrderStatus) {
    const currentOrder = orders.find((order) => order.id === id);
    if (!currentOrder || currentOrder.status === nextStatus) {
      return;
    }

    if (nextStatus === 'CANCELED' && !window.confirm(`Tem certeza que deseja cancelar o pedido ${currentOrder.orderCode}?`)) {
      return;
    }

    setUpdatingOrderIds((current) => new Set(current).add(id));
    setError(undefined);
    setSuccessMessage(undefined);
    try {
      const updatedOrder = await updateOrderStatus(id, nextStatus);
      replaceUpdatedOrders([updatedOrder]);
      setSuccessMessage(`Pedido ${updatedOrder.orderCode} atualizado para ${statusLabels[nextStatus]}.`);
    } catch {
      setError('Nao foi possivel alterar o status do pedido.');
    } finally {
      setUpdatingOrderIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <AdminLayout title="Pedidos" navigate={navigate}>
      <AdminPageHeader
        title="Pedidos"
        subtitle="Gerencie as encomendas recebidas."
        actions={
          <Button variant="secondary" onClick={loadOrders} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Atualizar
          </Button>
        }
      />

      <AdminCard className="mb-5 p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              className="min-h-12 w-full rounded-full border border-line bg-white px-11 text-sm font-semibold text-cocoa outline-none transition placeholder:text-muted/70 focus:border-brand"
              placeholder="Buscar por codigo, cliente ou telefone"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <div className="flex gap-2 overflow-x-auto rounded-full border border-line bg-white/70 p-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className={`min-h-10 shrink-0 rounded-full px-4 text-xs font-bold transition ${
                  status === filter.value ? 'bg-brand text-white shadow-[0_10px_22px_rgba(230,30,77,0.16)]' : 'text-cocoa hover:bg-blush'
                }`}
                onClick={() => setStatus(filter.value)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </AdminCard>

      {someVisibleSelected ? (
        <AdminCard className="mb-5 border-brand/20 bg-blush/50 p-4 shadow-[0_12px_30px_rgba(230,30,77,0.06)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm font-bold text-roseText" data-testid="bulk-selected-count">
              {selectedIds.size} pedido(s) selecionados
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-bold text-cocoa">
                Novo status:
                <select
                  className="bg-transparent text-sm font-bold text-brand outline-none"
                  data-testid="bulk-status-select"
                  disabled={isBulkUpdating}
                  onChange={(event) => setBulkStatus(event.target.value as OrderStatus)}
                  value={bulkStatus}
                >
                  {orderStatuses.map((candidate) => (
                    <option key={candidate} value={candidate}>{statusLabels[candidate]}</option>
                  ))}
                </select>
              </label>
              <Button
                className="min-h-11 px-5 text-sm"
                data-testid="bulk-update-status-button"
                disabled={isBulkUpdating}
                onClick={handleBulkStatusChange}
                type="button"
              >
                {isBulkUpdating ? 'Atualizando...' : 'Alterar status'}
              </Button>
              <Button
                className="min-h-11 px-4 text-sm"
                disabled={isBulkUpdating}
                onClick={clearSelection}
                type="button"
                variant="ghost"
              >
                <X className="h-4 w-4" aria-hidden />
                Limpar
              </Button>
            </div>
          </div>
        </AdminCard>
      ) : null}

      {error ? <ErrorState message={error} onRetry={loadOrders} /> : null}
      {successMessage ? (
        <div className="mb-5 rounded-[18px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {successMessage}
        </div>
      ) : null}
      {isLoading ? (
        <AdminCard className="p-4"><LoadingSkeleton /></AdminCard>
      ) : filteredOrders.length > 0 ? (
        <OrdersTable
          allVisibleSelected={allVisibleSelected}
          onOpen={(id) => navigate(`/admin/orders/${id}`)}
          onStatusChange={handleSingleStatusChange}
          onToggleAll={toggleAllVisible}
          onToggleSelection={toggleSelection}
          orders={filteredOrders}
          selectedIds={selectedIds}
          someVisibleSelected={someVisibleSelected}
          updatingOrderIds={updatingOrderIds}
        />
      ) : (
        <EmptyState title="Nenhum pedido encontrado" description={`Nao ha pedidos para o filtro ${status === 'ALL' ? 'selecionado' : statusLabels[status]}.`} />
      )}
    </AdminLayout>
  );
}
