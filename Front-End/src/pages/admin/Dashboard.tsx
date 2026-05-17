import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { getAdminOrders } from '../../services/adminService';
import type { AdminOrder } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';

type DashboardProps = {
  navigate: (path: string) => void;
};

export function Dashboard({ navigate }: DashboardProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    getAdminOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  const totalOpen = orders.filter((order) => !['DELIVERED', 'CANCELED'].includes(order.status)).length;
  const revenue = orders
    .filter((order) => order.status !== 'CANCELED')
    .reduce((total, order) => total + toNumber(order.totalPrice), 0);

  return (
    <AdminLayout title="Dashboard" navigate={navigate}>
      <div data-testid="admin-dashboard" className="sr-only">Dashboard</div>
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Pedidos ativos" value={String(totalOpen)} />
        <Metric label="Pedidos recebidos" value={String(orders.length)} />
        <Metric label="Total vendido" value={currency.format(revenue)} />
      </div>
      <Card className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-roseText">Últimos pedidos</h2>
          <Button variant="secondary" onClick={() => navigate('/admin/orders')}>Ver todos</Button>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <button
              key={order.id}
              className="flex w-full items-center justify-between gap-3 rounded-[18px] border border-brand/10 bg-white px-4 py-3 text-left"
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              type="button"
            >
              <span>
                <span className="block font-bold text-cocoa">{order.orderCode}</span>
                <span className="text-sm text-softGray">{order.customer.name}</span>
              </span>
              <StatusBadge status={order.status} />
            </button>
          ))}
        </div>
      </Card>
    </AdminLayout>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm font-bold uppercase text-softGray">{label}</p>
      <p className="mt-2 text-3xl font-bold text-brand">{value}</p>
    </Card>
  );
}
