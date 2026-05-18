import { CalendarClock, ClipboardList, DollarSign, Store, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminCard } from '../../components/admin/AdminCard';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { ErrorState } from '../../components/admin/ErrorState';
import { LoadingSkeleton } from '../../components/admin/LoadingSkeleton';
import { MetricCard } from '../../components/admin/MetricCard';
import { OrdersTable } from '../../components/admin/OrdersTable';
import { Button } from '../../components/ui/Button';
import { getAdminOrders } from '../../services/adminService';
import { getPublicSettings } from '../../services/settingsService';
import type { AdminOrder, StoreStatus } from '../../types';
import { formatCurrency, toNumber } from '../../utils/pricePreview';

type DashboardProps = {
  navigate: (path: string) => void;
};

export function Dashboard({ navigate }: DashboardProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('OPEN');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setIsLoading(true);
    setError(undefined);
    try {
      const [ordersData, settings] = await Promise.all([getAdminOrders(), getPublicSettings()]);
      setOrders(ordersData);
      setStoreStatus(settings.storeStatus);
    } catch {
      setError('Nao conseguimos carregar os dados do painel.');
    } finally {
      setIsLoading(false);
    }
  }

  const activeOrders = orders.filter((order) => !['DELIVERED', 'CANCELED'].includes(order.status));
  const validOrders = orders.filter((order) => order.status !== 'CANCELED');
  const revenue = validOrders.reduce((total, order) => total + toNumber(order.totalPrice), 0);
  const averageTicket = validOrders.length > 0 ? revenue / validOrders.length : 0;
  const recentOrders = orders.slice(0, 6);

  return (
    <AdminLayout title="Dashboard" navigate={navigate}>
      <div data-testid="admin-dashboard" className="sr-only">Dashboard</div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Acompanhe os pedidos e o desempenho da loja."
        actions={<Button variant="secondary" onClick={loadDashboard}>Atualizar</Button>}
      />

      {error ? <ErrorState message={error} onRetry={loadDashboard} /> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Pedidos ativos" value={String(activeOrders.length)} hint="Em aberto" icon={ClipboardList} />
        <MetricCard label="Recebidos" value={String(orders.length)} hint="Total no painel" icon={CalendarClock} tone="cream" />
        <MetricCard label="Total vendido" value={formatCurrency(revenue)} hint="Sem cancelados" icon={DollarSign} />
        <MetricCard label="Loja" value={storeStatus === 'OPEN' ? 'Aberta' : 'Fechada'} hint="Status atual" icon={Store} tone={storeStatus === 'OPEN' ? 'green' : 'rose'} />
        <MetricCard label="Ticket medio" value={formatCurrency(averageTicket)} hint="Pedidos validos" icon={TrendingUp} tone="cream" />
      </div>

      <AdminCard className="mt-5 p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-roseText">Ultimos pedidos</h2>
            <p className="mt-1 text-sm text-muted">Pedidos recentes para acompanhamento rapido.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/admin/orders')}>Ver todos</Button>
        </div>
        {isLoading ? <LoadingSkeleton /> : recentOrders.length > 0 ? <OrdersTable orders={recentOrders} onOpen={(id) => navigate(`/admin/orders/${id}`)} /> : <EmptyState title="Nenhum pedido recebido" description="Quando um cliente finalizar um pedido, ele aparecera aqui." />}
      </AdminCard>
    </AdminLayout>
  );
}
