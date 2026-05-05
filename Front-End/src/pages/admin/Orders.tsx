import { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { Card } from '../../components/ui/Card';
import { getAdminOrders } from '../../services/adminService';
import type { AdminOrder } from '../../types';
import { currency, toNumber } from '../../utils/pricePreview';

type OrdersProps = {
  navigate: (path: string) => void;
};

export function Orders({ navigate }: OrdersProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AdminLayout title="Pedidos" navigate={navigate}>
      <Card>
        {isLoading ? <p className="font-semibold text-softGray">Carregando pedidos...</p> : null}
        <div className="space-y-3">
          {orders.map((order) => (
            <button
              key={order.id}
              className="grid w-full gap-3 rounded-[18px] border border-brand/10 bg-white px-4 py-4 text-left md:grid-cols-[1.2fr_1fr_auto_auto]"
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              type="button"
            >
              <span>
                <span className="block font-bold text-cocoa">{order.orderCode}</span>
                <span className="text-sm text-softGray">{order.customer.name}</span>
              </span>
              <span className="text-sm text-cocoa">{new Date(order.desiredDate).toLocaleDateString('pt-BR')}</span>
              <StatusBadge status={order.status} />
              <span className="font-bold text-brand">{currency.format(toNumber(order.totalPrice))}</span>
            </button>
          ))}
        </div>
      </Card>
    </AdminLayout>
  );
}
