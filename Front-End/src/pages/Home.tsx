import { Logo } from '../components/Logo';
import { WhatsAppButton } from '../components/WhatsAppButton';

type HomeProps = {
  onStart: () => void;
};

export function Home({ onStart }: HomeProps) {
  return (
    <main className="flex min-h-dvh flex-col px-6 pb-8 pt-10 text-center">
      <div className="flex flex-1 flex-col items-center">
        <Logo />
        <div className="mt-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-brand/70">Anna Meyre Cakes</p>
          <h1 className="font-display text-5xl font-bold leading-tight text-roseText">Monte seu bolo</h1>
          <p className="mx-auto mt-5 max-w-72 font-display text-2xl font-bold leading-snug text-roseText/90">
            Escolha massa, recheios e tamanho
          </p>
        </div>
        <div className="mt-12 grid w-full grid-cols-3 gap-3">
          {['3 discos', '2 recheios', 'sem chantilly'].map((item) => (
            <div key={item} className="rounded-full bg-blush/72 px-3 py-4 text-xs font-bold uppercase text-brand shadow-sm">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <WhatsAppButton onClick={onStart}>Começar pedido</WhatsAppButton>
        <div>
          <div className="mx-auto mb-5 h-px w-20 bg-brand/20" />
          <p className="font-display text-lg font-bold text-roseText">50% de entrada • Encomendas até 3 dias antes</p>
        </div>
      </div>
    </main>
  );
}
