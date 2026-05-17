import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { useCustomerStore } from '../store/customerStore';
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
  customerEmail: z.string().email('Informe um email válido.').optional().or(z.literal('')),
  customerAddress: z.string().optional(),
  desiredDate: z.string().min(1, 'Escolha a data de entrega.'),
  notes: z.string().optional(),
});

export function Builder({ navigate }: BuilderProps) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const order = useOrderStore();
  const { customer, loadCustomer, logout } = useCustomerStore();
  const { settings, loadSettings } = useSettingsStore();
  const isClosed = settings?.storeStatus === 'CLOSED';

  const minDate = useMemo(() => getMinimumOrderDate(), []);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerAddress: '',
      desiredDate: '',
      notes: '',
    },
  });

  useEffect(() => {
    loadSettings();
    loadCustomer();
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
  }, [loadCustomer, loadSettings]);

  useEffect(() => {
    if (!customer) {
      return;
    }

    setValue('customerName', customer.name);
    setValue('customerPhone', customer.phone);
    setValue('customerEmail', customer.email ?? '');
    setValue('customerAddress', customer.address ?? '');
  }, [customer, setValue]);

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
      await loadCustomer();
      order.resetOrder();
      const whatsappTab = window.open(response.whatsapp.link, '_blank', 'noopener,noreferrer');

      if (!whatsappTab) {
        window.location.assign(response.whatsapp.link);
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-petal pb-28 text-cocoa md:pb-0">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur lg:py-2.5">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="justify-self-start px-0 text-xl font-normal lg:min-h-9 lg:text-sm">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Voltar
          </Button>
          <Logo compact />
          <span aria-hidden />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1160px] pb-8 md:px-6 lg:px-7">
        <div className="px-5 py-12 text-center md:px-0 md:py-12 md:text-left lg:max-w-xl lg:pb-5 lg:pt-6">
          <h1 className="font-display text-[52px] leading-none text-cocoa md:text-6xl lg:text-[42px]">Crie a receita do seu dia.</h1>
          <p className="mx-auto mt-8 max-w-2xl text-[26px] leading-snug text-muted md:mx-0 lg:mt-3 lg:max-w-lg lg:text-base lg:leading-7">
            Escolha cada detalhe com calma, a gente prepara com afeto.
          </p>
        </div>

        <StoreStatusBanner closed={isClosed} />

        {customer ? (
          <div className="mx-5 mb-5 flex flex-col gap-3 rounded-[22px] border border-line bg-white/80 px-5 py-4 text-cocoa shadow-[0_12px_32px_rgba(138,75,62,0.04)] md:mx-0 md:flex-row md:items-center md:justify-between lg:mb-4 lg:min-h-[64px] lg:rounded-[20px] lg:border-brand/10 lg:bg-blush/35 lg:px-4 lg:py-2.5 lg:shadow-[0_8px_22px_rgba(138,75,62,0.035)]">
            <div className="min-w-0">
              <p className="font-semibold">Olá, {customer.name}! Seus dados já estão preenchidos.</p>
              <p className="text-sm text-muted">Você pode alterar qualquer informação antes de finalizar.</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button type="button" variant="secondary" onClick={() => navigate('/meus-pedidos')} className="px-3 py-2 text-sm lg:min-h-9 lg:border-brand/15 lg:bg-white/80 lg:px-4 lg:text-xs">
                Meus pedidos
              </Button>
              <Button type="button" variant="ghost" onClick={() => void logout()} className="px-3 py-2 text-sm lg:min-h-9 lg:px-3 lg:text-xs">
                Sair
              </Button>
            </div>
          </div>
        ) : null}

        {catalogError ? <p className="mt-5 rounded-[20px] bg-brand/10 px-4 py-3 font-semibold text-brand">{catalogError}</p> : null}

        {!catalog ? (
          <div className="mt-8 rounded-[28px] bg-white/80 p-8 text-center font-semibold text-softGray">Carregando catálogo...</div>
        ) : (
          <form
            id="cake-builder-form"
            className="grid gap-6 px-5 md:px-0 lg:grid-cols-[minmax(0,1fr)_328px] lg:items-start lg:gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <section className="space-y-6 lg:space-y-4">
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
                  customerEmail: errors.customerEmail?.message,
                  customerAddress: errors.customerAddress?.message,
                  desiredDate: errors.desiredDate?.message,
                  notes: errors.notes?.message,
                }}
              />
              {formError ? <p className="rounded-[20px] bg-brand/10 px-4 py-3 font-semibold text-brand">{formError}</p> : null}
            </section>

            <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
              <div className="space-y-2.5 rounded-[20px] border border-line/90 bg-white/80 p-2.5 shadow-[0_12px_34px_rgba(138,75,62,0.045)] backdrop-blur">
              <OrderSummaryCard
                catalog={catalog}
                cakeSizeId={order.selectedCakeSizeId}
                filling1Id={order.selectedFilling1Id}
                filling2Id={order.selectedFilling2Id}
                sweets={order.sweets}
              />
              <Button type="submit" disabled={isClosed || isSubmitting} className="w-full min-h-11 py-2.5 text-xs">
                <MessageCircle className="h-4 w-4" aria-hidden />
                {isSubmitting ? 'Enviando pedido...' : 'Enviar pedido pelo WhatsApp'}
              </Button>
              {isClosed ? <p className="text-center text-sm font-semibold text-softGray">WhatsApp desabilitado enquanto a loja está fechada.</p> : null}
              </div>
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
