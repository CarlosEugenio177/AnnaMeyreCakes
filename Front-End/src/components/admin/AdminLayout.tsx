import { BarChart3, ClipboardList, LogOut, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { adminPath } from '../../config/admin';
import { useAuthStore } from '../../store/authStore';
import { Logo } from '../Logo';

type AdminLayoutProps = {
  children: ReactNode;
  title?: string;
  navigate: (path: string) => void;
};

export function AdminLayout({ children, title, navigate }: AdminLayoutProps) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const path = window.location.pathname.replace(/\/+$/, '');

  const items = [
    { label: 'Visão geral', icon: BarChart3, to: adminPath(), active: path === adminPath() },
    { label: 'Pedidos', icon: ClipboardList, to: adminPath('/orders'), active: path.startsWith(adminPath('/orders')) },
    { label: 'Configuracoes', icon: Settings, to: adminPath('/settings'), active: path === adminPath('/settings') },
  ];

  function handleLogout() {
    logout();
    navigate(adminPath('/login'));
  }

  return (
    <div className="min-h-screen bg-cream text-choco lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sprinkles bg-choco text-cream lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block lg:px-6 lg:py-8">
          <button type="button" onClick={() => navigate(adminPath())} className="flex items-center gap-3 text-left">
            <Logo compact />
            <span>
              <span className="block font-display text-xl leading-none">Anna Meyre</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-butter">Painel</span>
            </span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-cream/20 px-3 py-1.5 text-xs font-bold text-cream/80 lg:hidden"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden />
            Sair
          </button>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-4 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-4">
          {items.map(({ label, icon: Icon, to, active }) => (
            <button
              key={to}
              type="button"
              onClick={() => navigate(to)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-2xl px-4 text-sm font-bold transition ${
                active ? 'bg-cream text-choco' : 'text-cream/75 hover:bg-cream/10 hover:text-cream'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden border-t border-cream/10 px-6 py-5 lg:block">
          {user ? <p className="truncate text-xs text-cream/60">{user.email}</p> : null}
          <button type="button" onClick={handleLogout} className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-cream/80 hover:text-cream">
            <LogOut className="h-4 w-4" aria-hidden />
            Sair
          </button>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-6xl px-4 py-7 md:px-8 md:py-10">
        {title ? <h1 className="sr-only">{title}</h1> : null}
        {children}
      </main>
    </div>
  );
}
