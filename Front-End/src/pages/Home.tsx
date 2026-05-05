import { Settings } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';

type HomeProps = {
  navigate: (path: string) => void;
};

export function Home({ navigate }: HomeProps) {
  return (
    <main className="min-h-screen bg-petal px-6 pb-8 pt-10 text-center text-cocoa">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-3xl flex-col">
        <header className="relative flex justify-center">
          <Logo />
          <button
            type="button"
            aria-label="Area administrativa"
            onClick={() => navigate('/admin/login')}
            className="absolute right-0 top-0 rounded-full p-2 text-muted/70"
          >
            <Settings className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-12">
          <h1 className="font-display text-5xl font-bold leading-tight text-roseText md:text-7xl">Monte seu bolo</h1>
          <p className="mx-auto mt-5 max-w-72 font-display text-2xl font-bold leading-snug text-roseText/90 md:max-w-xl md:text-3xl">
            Escolha massa, recheios e tamanho
          </p>

          <div className="mt-12 grid w-full max-w-md grid-cols-2 gap-3">
            {['3 discos', '2 recheios'].map((item) => (
              <div key={item} className="rounded-full bg-blush/70 px-3 py-4 text-xs font-bold uppercase text-brand shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <footer className="space-y-5">
          <Button className="mx-auto w-full max-w-md py-5 text-base" onClick={() => navigate('/builder')}>
            Comecar pedido
          </Button>
          <div>
            <div className="mx-auto mb-5 h-px w-20 bg-brand/20" />
            <p className="font-display text-lg font-bold text-roseText">50% de entrada - Encomendas ate 3 dias antes</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
