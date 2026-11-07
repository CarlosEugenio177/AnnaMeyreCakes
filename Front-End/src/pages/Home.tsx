import { ArrowRight, CalendarHeart, CakeSlice, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { useCustomerStore } from '../store/customerStore';

type HomeProps = {
  navigate: (path: string) => void;
};

const steps = [
  { icon: CakeSlice, title: 'Monte', text: 'Escolha massa, tamanho, dois recheios e a cobertura.' },
  { icon: MessageCircle, title: 'Envie', text: 'Seu pedido chega até nós pelo WhatsApp, já com o valor.' },
  { icon: CalendarHeart, title: 'Receba', text: 'Com 50% de entrada, seu bolo fica reservado para a data.' },
];

export function Home({ navigate }: HomeProps) {
  const { customer, loadCustomer } = useCustomerStore();

  useEffect(() => {
    void loadCustomer();
  }, [loadCustomer]);

  return (
    <main className="min-h-screen bg-cream text-cocoa">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-5">
        <header className="flex h-16 items-center justify-end">
          {customer ? (
            <button type="button" onClick={() => navigate('/meus-pedidos')} className="text-sm font-medium text-muted hover:text-cocoa">
              Meus pedidos
            </button>
          ) : null}
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <Logo />
          <p className="mt-8 text-sm font-medium tracking-wide text-brand">Anna Meyre Cakes · confeitaria artesanal</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-[1.1] [text-wrap:balance] sm:text-6xl">Monte seu bolo do seu jeito</h1>
          <p className="mt-5 max-w-md text-lg text-muted [text-wrap:balance]">Bolos feitos à mão, com recheios generosos e muito carinho em cada camada.</p>

          <Button onClick={() => navigate('/builder')} className="mt-10 min-h-14 px-8 text-base">
            Começar meu pedido
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <p className="mt-4 text-sm text-muted">Encomendas com no mínimo 3 dias de antecedência</p>
        </section>

        <section className="grid gap-3 pb-12 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-xs font-semibold text-muted">0{index + 1}</span>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </section>

        <footer className="border-t border-line py-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Anna Meyre Cakes · Feito com amor
        </footer>
      </div>
    </main>
  );
}
