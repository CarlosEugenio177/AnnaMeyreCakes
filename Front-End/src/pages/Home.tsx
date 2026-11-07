import { ArrowRight, CalendarHeart, CakeSlice, QrCode, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CakePreview } from '../components/decor/CakePreview';
import { Drip } from '../components/decor/Drip';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { getCatalog } from '../services/catalogService';
import { useCustomerStore } from '../store/customerStore';
import type { Catalog } from '../types';

type HomeProps = {
  navigate: (path: string) => void;
};

// Combinacoes que o bolo da vitrine alterna sozinho.
const showcase = [
  { doughColor: '#F6DFBD', filling1Color: '#553022', filling2Color: '#FFF3D6', toppingColor: '#F8EFD9' },
  { doughColor: '#6F3D2E', filling1Color: '#DF4B57', filling2Color: '#FFF3D6', toppingColor: '#553022' },
  { doughColor: '#C99566', filling1Color: '#E4F19F', filling2Color: '#4A281A', toppingColor: '#F9E0C8' },
];

const steps = [
  { icon: CakeSlice, title: 'Monte', text: 'Massa, tamanho, dois recheios e a cobertura. O bolo muda na tela a cada escolha.' },
  { icon: QrCode, title: 'Reserve', text: 'Pague 50% de entrada pelo Pix, com QR Code na hora e sem taxas.' },
  { icon: MessageCircle, title: 'Confirme', text: 'Seu pedido chega até nós pelo WhatsApp, com todos os detalhes.' },
];

export function Home({ navigate }: HomeProps) {
  const { customer, loadCustomer } = useCustomerStore();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  useEffect(() => {
    void loadCustomer();
    getCatalog().then(setCatalog).catch(() => setCatalog(null));
  }, [loadCustomer]);

  useEffect(() => {
    const timer = window.setInterval(() => setShowcaseIndex((index) => (index + 1) % showcase.length), 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-cream text-choco">
      <section className="sprinkles bg-choco text-cream">
        <div className="mx-auto max-w-6xl px-5">
          <header className="flex h-20 items-center justify-between">
            <Logo compact />
            {customer ? (
              <button type="button" onClick={() => navigate('/meus-pedidos')} className="rounded-full border-2 border-cream/20 px-4 py-2 text-sm font-semibold text-cream/90 hover:border-cream/50">
                Meus pedidos
              </button>
            ) : null}
          </header>

          <div className="grid items-center gap-6 pb-10 pt-6 md:grid-cols-[1.1fr_1fr] md:pb-16 md:pt-10">
            <div className="animate-rise text-center md:text-left">
              <p className="inline-flex rounded-full bg-butter px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-choco">Confeitaria artesanal</p>
              <h1 className="mt-5 font-display text-5xl leading-[1.02] [text-wrap:balance] sm:text-7xl">
                Monte seu bolo, <em className="text-[#F49AB0]">camada por camada.</em>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-lg text-cream/75 md:mx-0">
                Feito à mão pela Anna Meyre, com recheio generoso e a sua cara. Você escolhe tudo e vê o bolo ganhando forma.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
                <Button onClick={() => navigate('/builder')} className="min-h-14 px-8 text-base">
                  Começar meu bolo
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <span className="text-sm text-cream/60">Pedidos com 3 dias de antecedência</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-6 rounded-full bg-brand/30 blur-3xl" aria-hidden />
              <CakePreview {...showcase[showcaseIndex]} sizeRatio={1} sweetsCount={1} className="relative w-full drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>
      <Drip className="h-8 sm:h-14" />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <p className="text-center text-xs font-extrabold uppercase tracking-[0.25em] text-brand">Como funciona</p>
        <h2 className="mt-2 text-center font-display text-4xl">Três passos até a festa</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="relative rounded-[28px] bg-surface p-6 shadow-soft">
              <span className="absolute right-5 top-4 font-display text-6xl text-blush">{index + 1}</span>
              <span className="relative grid h-12 w-12 rotate-[-6deg] place-items-center rounded-2xl bg-butter text-choco">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="relative mt-5 font-display text-2xl">{title}</h3>
              <p className="relative mt-1 text-sm leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {catalog && catalog.fillings.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <div className="sprinkles-soft rounded-[32px] bg-blush px-6 py-10 text-center sm:px-10">
            <h2 className="font-display text-3xl sm:text-4xl">Recheios da casa</h2>
            <p className="mt-2 text-muted">Combine dois. Os especiais estão marcados com ★.</p>
            <ul className="mt-7 flex flex-wrap justify-center gap-2">
              {catalog.fillings.map((filling) => (
                <li key={filling.id} className="inline-flex items-center gap-2 rounded-full bg-surface py-1.5 pl-1.5 pr-4 text-sm font-semibold shadow-sm">
                  <span className="h-6 w-6 rounded-full ring-2 ring-line" style={{ backgroundColor: filling.colorHex }} />
                  {filling.name}
                  {Number(filling.extraPrice) > 0 ? <span className="text-brand">★</span> : null}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate('/builder')} variant="dark" className="mt-8 min-h-12 px-7">
              Escolher meus recheios
            </Button>
          </div>
        </section>
      ) : null}

      <footer className="bg-choco text-cream/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-8 text-center text-sm sm:flex-row sm:justify-between sm:text-left">
          <span className="inline-flex items-center gap-2 font-display text-lg text-cream">
            <CalendarHeart className="h-5 w-5 text-butter" aria-hidden />
            Anna Meyre Cakes
          </span>
          <span>Encomendas com 3 dias de antecedência · 50% de entrada via Pix</span>
        </div>
      </footer>
    </main>
  );
}
