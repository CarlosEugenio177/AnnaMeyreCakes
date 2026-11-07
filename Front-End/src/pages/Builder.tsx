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
import { getMinimumOrderDate } from '../utils/date';
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
      if (catalog) {
        applyCatalogDefaults(catalog);
      }
      resetField('desiredDate');
      resetField('notes');

      // Se o navegador bloquear a nova aba (comum apos uma requisicao assincrona),
      // abre o WhatsApp na propria aba: o pedido ja esta salvo.
      const whatsappTab = window.open(response.whatsapp.link, '_blank');
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
    <main className="min-h-screen bg-cream pb-28 text-cocoa lg:pb-16" data-testid="builder-page">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 justify-self-start text-sm font-medium text-muted hover:text-cocoa"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Início
          </button>
          <Logo compact />
          <span aria-hidden />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        <div className="py-8 sm:py-10">
          <p className="text-sm font-medium text-brand">Encomenda personalizada</p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight sm:text-4xl">Monte o seu bolo</h1>
          <p className="mt-2 max-w-xl text-muted">Escolha cada detalhe com calma. O valor é atualizado na hora.</p>
        </div>

        <div className="space-y-4">
          <StoreStatusBanner closed={isClosed} />

          {customer ? (
            <div
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              data-testid="customer-greeting"
            >
              <div>
                <p className="font-semibold">Que bom te ver de novo, {customer.name}!</p>
                <p className="text-sm text-muted">Seus dados já estão preenchidos.</p>
              </div>
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

          {catalogError ? <p className="rounded-2xl bg-brand/10 p-4 font-medium text-brand">{catalogError}</p> : null}
        </div>

        {!catalog ? (
          <div className="mt-6 grid place-items-center rounded-3xl border border-line bg-surface p-12 text-muted">Carregando o cardápio...</div>
        ) : (
          <form
            id="cake-builder-form"
            className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
            onSubmit={handleSubmit(onSubmit)}
          >
            <section className="space-y-4">
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
              {formError ? <p className="rounded-2xl bg-brand/10 p-4 font-medium text-brand">{formError}</p> : null}
            </section>

            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
                <OrderSummaryCard
                  catalog={catalog}
                  doughId={order.selectedDoughId}
                  cakeSizeId={order.selectedCakeSizeId}
                  filling1Id={order.selectedFilling1Id}
                  filling2Id={order.selectedFilling2Id}
                  toppingId={order.selectedToppingId}
                  sweets={order.sweets}
                />
                <Button type="submit" disabled={isClosed || isSubmitting} className="mt-6 min-h-12 w-full" data-testid="finish-order-button">
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  {isSubmitting ? 'Enviando pedido...' : 'Enviar pedido pelo WhatsApp'}
                </Button>
                <p className="mt-3 text-center text-xs text-muted">
                  {isClosed ? 'Pedidos pausados enquanto a agenda estiver fechada.' : 'O pedido é salvo e você confirma com a gente no WhatsApp.'}
                </p>
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

// Preenche apenas as escolhas que ainda estao vazias (preserva um "repetir pedido").
function applyCatalogDefaults(catalog: Catalog) {
  useOrderStore.setState((state) => ({
    selectedDoughId: state.selectedDoughId ?? catalog.doughs[0]?.id,
    selectedCakeSizeId: state.selectedCakeSizeId ?? catalog.cakeSizes[0]?.id,
    selectedFilling1Id: state.selectedFilling1Id ?? catalog.fillings[0]?.id,
    selectedFilling2Id: state.selectedFilling2Id ?? catalog.fillings[1]?.id ?? catalog.fillings[0]?.id,
    selectedToppingId: state.selectedToppingId ?? catalog.toppings[0]?.id,
  }));
}
