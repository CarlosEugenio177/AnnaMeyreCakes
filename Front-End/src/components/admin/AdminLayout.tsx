import { BarChart3, ClipboardList, LogOut, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  navigate: (path: string) => void;
};

export function AdminLayout({ children, title, navigate }: AdminLayoutProps) {
  const logout = useAuthStore((state) => state.logout);
  const path = window.location.pathname;

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <main className="min-h-screen bg-petal text-cocoa">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-surface/94 px-4 py-3 shadow-[0_10px_30px_rgba(138,75,62,0.03)] backdrop-blur">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3">
            <button className="text-left font-display text-xl font-bold leading-none text-brand" onClick={() => navigate('/admin')} type="button">
              Anna Meyre Admin
              <span className="mt-1 block font-body text-[11px] font-bold uppercase tracking-[0.22em] text-muted">Painel operacional</span>
            </button>
            <Button variant="secondary" onClick={handleLogout} className="min-h-10 px-4 text-sm md:hidden">
              <LogOut className="h-4 w-4" aria-hidden />
              Sair
            </Button>
          </div>
          <nav className="flex items-center gap-1.5 overflow-x-auto rounded-full border border-line/90 bg-white/75 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <NavButton active={path === '/admin' || path === '/admin/' || path === '/admin/dashboard'} onClick={() => navigate('/admin')} icon={BarChart3}>
              Dashboard
            </NavButton>
            <NavButton active={path.startsWith('/admin/orders')} onClick={() => navigate('/admin/orders')} icon={ClipboardList}>
              Pedidos
            </NavButton>
            <NavButton active={path === '/admin/settings'} onClick={() => navigate('/admin/settings')} icon={Settings}>
              Configuracoes
            </NavButton>
          </nav>
          <Button variant="secondary" onClick={handleLogout} className="hidden min-h-10 px-4 text-sm md:inline-flex">
            <LogOut className="h-4 w-4" aria-hidden />
            Sair
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-[1160px] px-4 py-7 md:px-6 md:py-9">
        {title ? <h1 className="sr-only">{title}</h1> : null}
        {children}
      </div>
    </main>
  );
}

function NavButton({
  active,
  children,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  icon: typeof BarChart3;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${
        active ? 'bg-brand text-white shadow-[0_10px_22px_rgba(230,30,77,0.16)]' : 'text-cocoa hover:bg-blush/75 hover:text-brand'
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon className="h-4 w-4" aria-hidden />
      {children}
    </button>
  );
}
