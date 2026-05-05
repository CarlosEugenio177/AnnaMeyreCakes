import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CakeScene } from '../components/cake3d/CakeScene';
import { CakeBuilderForm } from '../components/form/CakeBuilderForm';
import { CustomerForm } from '../components/form/CustomerForm';
import { SweetBuilderForm } from '../components/form/SweetBuilderForm';
import { Logo } from '../components/Logo';
import { OrderSummaryBar } from '../components/summary/OrderSummaryBar';
import { OrderSummaryCard } from '../components/summary/OrderSummaryCard';
import { StoreStatusBanner } from '../components/status/StoreStatusBanner';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage } from '../services/api';
import { getCatalog } from '../services/catalogService';
import { createOrder } from '../services/ordersService';
import { useOrderStore } from '../store/orderStore';
import { useSettingsStore } from '../store/settingsStore';
import type { Catalog, CustomerData } from '../types';
import { getMaxSweetFlavors } from '../utils/sweetRules';

type BuilderProps = {
  navigate: (path: string) => void;
};

const customerSchema = z.object({
  customerName: z.string().min(2, 'Informe seu nome.'),
  customerPhone: z.string().min(8, 'Informe um WhatsApp válido.'),
  desiredDate: z.string().min(1, 'Escolha a data de entrega.'),
  notes: z.string().optional(),
});

export function Builder({ navigate }: BuilderProps) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const order = useOrderStore();
  const { settings, loadSettings } = useSettingsStore();
  const isClosed = settings?.storeStatus === 'CLOSED';

  const minDate = useMemo(() => getMinimumOrderDate(), []);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { customerName: '', customerPhone: '', desiredDate: '', notes: '' },
  });

  useEffect(() => {
    loadSettings();
    getCatalog()
      .then((data) => {
        setCatalog(data);
        useOrderStore.setState((state) => ({
          selectedDoughId: state.selectedDoughId ?? data.doughs[0]?.id,
          selectedCakeSizeId: state.selectedCakeSizeId ?? data.cakeSizes[0]?.id,
          selectedFilling1Id: state.selectedFilling1Id ?? data.fillings[0]?.id,
          selectedFilling2Id: state.selectedFilling2Id ?? data.fillings[1]?.id ?? data.fillings[0]?.id,
          selectedToppingId: state.selectedToppingId ?? data.toppings[0]?.id,
        }));
      })
      .catch(() => setCatalogError('Não foi possível carregar o catálogo.'));
  }, [loadSettings]);

  const selectedDough = catalog?.doughs.find((item) => item.id === order.selectedDoughId);
  const selectedFilling1 = catalog?.fillings.find((item) => item.id === order.selectedFilling1Id);
  const selectedFilling2 = catalog?.fillings.find((item) => item.id === order.selectedFilling2Id);
  const selectedTopping = catalog?.toppings.find((item) => item.id === order.selectedToppingId);

  function updateSelection(field: string, value: string) {
    order.updateOrder({ [field]: value });
  }

  async function onSubmit(customer: CustomerData) {
    setFormError(undefined);

    if (isClosed) {
      setFormError('A loja está fechada no momento.');
      return;
    }

    if (!order.selectedDoughId || !order.selectedCakeSizeId || !order.selectedFilling1Id || !order.selectedFilling2Id || !order.selectedToppingId) {
      setFormError('Complete massa, tamanho, dois recheios e cobertura.');
      return;
    }

    const invalidSweet = order.sweets.find((sweet) => {
      const max = getMaxSweetFlavors(sweet.quantity);
      return sweet.sweetFlavorIds.length < 1 || sweet.sweetFlavorIds.length > max;
    });

    if (invalidSweet) {
      setFormError('Revise os sabores dos docinhos antes de finalizar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createOrder({
        ...customer,
        cake: {
          doughId: order.selectedDoughId,
          cakeSizeId: order.selectedCakeSizeId,
          filling1Id: order.selectedFilling1Id,
          filling2Id: order.selectedFilling2Id,
          toppingId: order.selectedToppingId,
        },
        sweets: order.sweets.length > 0 ? order.sweets : undefined,
      });
      window.open(response.whatsapp.link, '_blank', 'noopener,noreferrer');
      order.resetOrder();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-petal pb-28 text-cocoa md:pb-0">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="justify-self-start px-0 text-xl font-normal">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar
          </Button>
          <Logo compact />
          <span aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-6xl pb-8 md:px-4">
        <div className="md:hidden">
          <CakeScene
            doughColor={selectedDough?.colorHex}
            filling1Color={selectedFilling1?.colorHex}
            filling2Color={selectedFilling2?.colorHex}
            toppingColor={selectedTopping?.colorHex}
          />
        </div>

        <div className="px-5 py-14 text-center md:px-0 md:text-left">
          <h1 className="font-display text-[52px] leading-none text-cocoa md:text-6xl">Crie a receita do seu dia.</h1>
          <p className="mx-auto mt-8 max-w-2xl text-[26px] leading-snug text-muted md:mx-0">
            Escolha cada detalhe com calma, a gente prepara com afeto.
          </p>
        </div>

        <StoreStatusBanner closed={isClosed} />

        {catalogError ? <p className="mt-5 rounded-[20px] bg-brand/10 px-4 py-3 font-semibold text-brand">{catalogError}</p> : null}

        {!catalog ? (
          <div className="mt-8 rounded-[28px] bg-white/80 p-8 text-center font-semibold text-softGray">Carregando catálogo...</div>
        ) : (
          <form id="cake-builder-form" className="grid gap-6 px-5 md:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] md:px-0" onSubmit={handleSubmit(onSubmit)}>
            <section className="space-y-5 md:max-h-[calc(100vh-150px)] md:overflow-y-auto md:pr-2">
              <CakeBuilderForm
                catalog={catalog}
                selectedDoughId={order.selectedDoughId}
                selectedCakeSizeId={order.selectedCakeSizeId}
                selectedFilling1Id={order.selectedFilling1Id}
                selectedFilling2Id={order.selectedFilling2Id}
                selectedToppingId={order.selectedToppingId}
                onSelect={updateSelection}
              />
              <SweetBuilderForm catalog={catalog} sweets={order.sweets} onChange={order.setSweets} />
              <CustomerForm
                register={register}
                minDate={minDate}
                errors={{
                  customerName: errors.customerName?.message,
                  customerPhone: errors.customerPhone?.message,
                  desiredDate: errors.desiredDate?.message,
                  notes: errors.notes?.message,
                }}
              />
              {formError ? <p className="rounded-[20px] bg-brand/10 px-4 py-3 font-semibold text-brand">{formError}</p> : null}
            </section>

            <aside className="hidden space-y-5 md:sticky md:top-24 md:block md:self-start">
              <CakeScene
                doughColor={selectedDough?.colorHex}
                filling1Color={selectedFilling1?.colorHex}
                filling2Color={selectedFilling2?.colorHex}
                toppingColor={selectedTopping?.colorHex}
              />
              <OrderSummaryCard
                catalog={catalog}
                cakeSizeId={order.selectedCakeSizeId}
                filling1Id={order.selectedFilling1Id}
                filling2Id={order.selectedFilling2Id}
                sweets={order.sweets}
              />
              <Button type="submit" disabled={isClosed || isSubmitting} className="w-full py-5 text-base">
                <MessageCircle className="h-5 w-5" aria-hidden />
                {isSubmitting ? 'Enviando pedido...' : 'Enviar pedido pelo WhatsApp'}
              </Button>
              {isClosed ? <p className="text-center text-sm font-semibold text-softGray">WhatsApp desabilitado enquanto a loja está fechada.</p> : null}
            </aside>
            <OrderSummaryBar
              catalog={catalog}
              cakeSizeId={order.selectedCakeSizeId}
              filling1Id={order.selectedFilling1Id}
              filling2Id={order.selectedFilling2Id}
              sweets={order.sweets}
              disabled={isClosed}
              isSubmitting={isSubmitting}
            />
          </form>
        )}
      </div>
    </main>
  );
}

function getMinimumOrderDate() {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toISOString().slice(0, 10);
}
