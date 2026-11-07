import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CakePreview } from '../components/decor/CakePreview';
import { Drip } from '../components/decor/Drip';
import { CakeBuilderForm } from '../components/form/CakeBuilderForm';
import { CustomerForm } from '../components/form/CustomerForm';
import { SweetBuilderForm } from '../components/form/SweetBuilderForm';
import { Logo } from '../components/Logo';
import { StoreStatusBanner } from '../components/status/StoreStatusBanner';
import { OrderConfirmation } from '../components/summary/OrderConfirmation';
import { OrderSummaryBar } from '../components/summary/OrderSummaryBar';
import { OrderSummaryCard } from '../components/summary/OrderSummaryCard';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage } from '../services/api';
import { getCatalog } from '../services/catalogService';
import { createOrder, type CreateOrderResponse } from '../services/ordersService';
import { useCustomerStore } from '../store/customerStore';
import { useOrderStore } from '../store/orderStore';
import { useSettingsStore } from '../store/settingsStore';
import type { Catalog, CustomerData } from '../types';
import { getMinimumOrderDate } from '../utils/date';
import { formatPhone, phoneDigits } from '../utils/phone';
import { getMaxSweetFlavors } from '../utils/sweetRules';

type BuilderProps = {
  navigate: (path: string) => void;
};

const customerSchema = z.object({
  customerName: z.string().trim().min(2, 'Informe seu nome.'),
  customerPhone: z.string().refine((value) => {
    const digits = phoneDigits(value).length;
    return digits >= 10 && digits <= 13;
  }, 'Informe o WhatsApp com DDD.'),
  customerEmail: z.string().email('Informe um e-mail válido.').optional().or(z.literal('')),
  customerAddress: z.string().optional(),
  desiredDate: z.string().min(1, 'Escolha a data de entrega.'),
  notes: z.string().optional(),
});

export function Builder({ navigate }: BuilderProps) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<CreateOrderResponse | null>(null);
  const order = useOrderStore();
  const { customer, loadCustomer, logout } = useCustomerStore();
  const { settings, loadSettings } = useSettingsStore();
  const isClosed = settings?.storeStatus === 'CLOSED';

  const minDate = useMemo(() => getMinimumOrderDate(), []);
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
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
        applyCatalogDefaults(data);
      })
      .catch(() => setCatalogError('Não foi possível carregar o cardápio.'));
  }, [loadCustomer, loadSettings]);

  useEffect(() => {
    if (!customer) {
      return;
    }

    setValue('customerName', customer.name);
    setValue('customerPhone', formatPhone(customer.phone));
    setValue('customerEmail', customer.email ?? '');
    setValue('customerAddress', customer.address ?? '');
  }, [customer, setValue]);

  const preview = useMemo(() => {
    const find = <T extends { id: string }>(items: T[] | undefined, id?: string) => items?.find((item) => item.id === id);
    const sizeIndex = catalog?.cakeSizes.findIndex((item) => item.id === order.selectedCakeSizeId) ?? -1;
    const sizeCount = catalog?.cakeSizes.length ?? 1;
    return {
      doughColor: find(catalog?.doughs, order.selectedDoughId)?.colorHex,
      filling1Color: find(catalog?.fillings, order.selectedFilling1Id)?.colorHex ?? '#F3E6D6',
      filling2Color: find(catalog?.fillings, order.selectedFilling2Id)?.colorHex ?? '#F3E6D6',
      toppingColor: find(catalog?.toppings, order.selectedToppingId)?.colorHex,
      sizeRatio: sizeIndex < 0 || sizeCount < 2 ? 0.5 : sizeIndex / (sizeCount - 1),
      sweetsCount: order.sweets.length,
    };
  }, [catalog, order.selectedDoughId, order.selectedCakeSizeId, order.selectedFilling1Id, order.selectedFilling2Id, order.selectedToppingId, order.sweets]);

  function updateSelection(field: string, value: string) {
    order.updateOrder({ [field]: value });
  }

  // Lista unica de recheios: o 1o clique preenche o 1o recheio, o 2o clique o 2o.
  // Clicar num recheio escolhido remove; com os dois escolhidos, troca o 2o.
  function toggleFilling(id: string) {
    const { selectedFilling1Id: first, selectedFilling2Id: second } = order;

    if (id === first) {
      order.updateOrder({ selectedFilling1Id: second, selectedFilling2Id: undefined });
    } else if (id === second) {
      order.updateOrder({ selectedFilling2Id: undefined });
    } else if (!first) {
      order.updateOrder({ selectedFilling1Id: id });
    } else {
      order.updateOrder({ selectedFilling2Id: id });
    }
  }

  async function onSubmit(data: CustomerData) {
    setFormError(undefined);

    if (isClosed) {
      setFormError('A agenda está fechada no momento.');
      return;
    }

    if (!order.selectedDoughId || !order.selectedCakeSizeId || !order.selectedToppingId) {
      setFormError('Escolha a massa, o tamanho e a cobertura.');
      return;
    }

    if (!order.selectedFilling1Id || !order.selectedFilling2Id) {
      setFormError('Escolha os 2 recheios do seu bolo.');
      return;
    }

    const invalidSweet = order.sweets.find((sweet) => {
      const max = getMaxSweetFlavors(sweet.quantity);
      return sweet.sweetFlavorIds.length < 1 || sweet.sweetFlavorIds.length > max;
    });

    if (invalidSweet) {
      setFormError('Escolha os sabores dos docinhos antes de finalizar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createOrder({
        ...data,
        customerPhone: phoneDigits(data.customerPhone),
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
      if (catalog) {
        applyCatalogDefaults(catalog);
      }
      resetField('desiredDate');
      resetField('notes');
      setConfirmation(response);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  function onInvalid() {
    setFormError('Confira seus dados: alguns campos precisam de atenção.');
    document.getElementById('customer-step')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="min-h-screen bg-cream pb-32 text-choco lg:pb-20" data-testid="builder-page">
      <header className="bg-choco text-cream">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 justify-self-start text-sm font-semibold text-cream/70 hover:text-cream"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Início
          </button>
          <Logo compact />
          <span aria-hidden />
        </div>
        {!confirmation ? (
          <div className="mx-auto max-w-6xl px-5 pb-6 pt-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-butter">Encomenda personalizada</p>
            <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">
              Monte o seu bolo <em className="text-[#F49AB0]">camada por camada</em>
            </h1>
          </div>
        ) : (
          <div className="h-6" />
        )}
      </header>
      <Drip className="h-6 sm:h-10" />

      <div className="mx-auto max-w-6xl px-5">
        <div className="space-y-4">
          <StoreStatusBanner closed={isClosed} />

          {customer ? (
            <div
              className="flex flex-col gap-3 rounded-3xl border-2 border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              data-testid="customer-greeting"
            >
              <p className="font-semibold">
                Que bom te ver, {customer.name}! <span className="font-normal text-muted">Seus dados já estão preenchidos.</span>
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => navigate('/meus-pedidos')} data-testid="customer-orders-link">
                  Meus pedidos
                </Button>
                <Button type="button" variant="ghost" onClick={() => void logout()} data-testid="customer-logout-button">
                  Sair
                </Button>
              </div>
            </div>
          ) : null}

          {catalogError ? <p className="rounded-2xl bg-brand/10 p-4 font-semibold text-brand">{catalogError}</p> : null}
        </div>

        {confirmation ? (
          <div className="mt-6">
            <OrderConfirmation
              result={confirmation}
              onNewOrder={() => setConfirmation(null)}
              onViewOrders={() => navigate('/meus-pedidos')}
            />
          </div>
        ) : !catalog ? (
          <div className="mt-6 grid place-items-center rounded-[28px] bg-surface p-12 text-muted shadow-soft">Separando os ingredientes...</div>
        ) : (
          <form
            id="cake-builder-form"
            className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start"
            onSubmit={handleSubmit(onSubmit, onInvalid)}
          >
            {/* No celular a previa do bolo aparece no topo do fluxo. */}
            <div className="sprinkles-soft flex items-center gap-4 rounded-[28px] bg-surface p-4 shadow-soft lg:hidden">
              <CakePreview {...preview} className="h-28 w-32 shrink-0" />
              <p className="text-sm text-muted">
                <span className="block font-display text-xl text-choco">Seu bolo, ao vivo</span>
                Cada escolha muda o desenho. É só uma prévia ilustrativa!
              </p>
            </div>

            <section className="space-y-5">
              <CakeBuilderForm
                catalog={catalog}
                selectedDoughId={order.selectedDoughId}
                selectedCakeSizeId={order.selectedCakeSizeId}
                selectedFilling1Id={order.selectedFilling1Id}
                selectedFilling2Id={order.selectedFilling2Id}
                selectedToppingId={order.selectedToppingId}
                onSelect={updateSelection}
                onToggleFilling={toggleFilling}
              />
              <SweetBuilderForm catalog={catalog} sweets={order.sweets} onChange={order.setSweets} />
              <CustomerForm
                register={register}
                setValue={setValue}
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
              {formError ? <p className="rounded-2xl bg-brand/10 p-4 font-semibold text-brand lg:hidden">{formError}</p> : null}
            </section>

            <aside className="hidden lg:sticky lg:top-6 lg:block">
              <div className="overflow-hidden rounded-[32px] bg-surface shadow-soft">
                <div className="sprinkles-soft bg-gradient-to-b from-blush to-surface px-6 pt-6">
                  <p className="text-center text-xs font-extrabold uppercase tracking-[0.25em] text-brand">Seu bolo, ao vivo</p>
                  <CakePreview {...preview} className="mx-auto h-56 w-full" />
                </div>
                <div className="p-6 pt-2">
                  <OrderSummaryCard
                    catalog={catalog}
                    doughId={order.selectedDoughId}
                    cakeSizeId={order.selectedCakeSizeId}
                    filling1Id={order.selectedFilling1Id}
                    filling2Id={order.selectedFilling2Id}
                    toppingId={order.selectedToppingId}
                    sweets={order.sweets}
                  />
                  {formError ? <p className="mt-4 rounded-2xl bg-brand/10 p-3 text-sm font-semibold text-brand">{formError}</p> : null}
                  <Button type="submit" disabled={isClosed || isSubmitting} className="mt-5 min-h-14 w-full text-base" data-testid="finish-order-button">
                    <MessageCircle className="h-5 w-5" aria-hidden />
                    {isSubmitting ? 'Enviando pedido...' : 'Fazer meu pedido'}
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted">
                    {isClosed ? 'Pedidos pausados enquanto a agenda estiver fechada.' : 'Você paga 50% via Pix para reservar a data.'}
                  </p>
                </div>
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

// Preenche apenas as escolhas que ainda estao vazias (preserva um "pedir de novo").
function applyCatalogDefaults(catalog: Catalog) {
  useOrderStore.setState((state) => ({
    selectedDoughId: state.selectedDoughId ?? catalog.doughs[0]?.id,
    selectedCakeSizeId: state.selectedCakeSizeId ?? catalog.cakeSizes[0]?.id,
    selectedFilling1Id: state.selectedFilling1Id ?? catalog.fillings[0]?.id,
    selectedFilling2Id: state.selectedFilling2Id ?? catalog.fillings[1]?.id,
    selectedToppingId: state.selectedToppingId ?? catalog.toppings[0]?.id,
  }));
}
