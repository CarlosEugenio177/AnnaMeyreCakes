import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
  navigate: (path: string) => void;
};

export function AdminLayout({ children, title, navigate }: AdminLayoutProps) {
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <main className="min-h-screen bg-petal text-cocoa">
      <header className="border-b border-brand/10 bg-white/85 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <button className="font-display text-xl font-bold text-brand" onClick={() => navigate('/admin')} type="button">
            Anna Meyre Admin
          </button>
          <nav className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" onClick={() => navigate('/admin/orders')}>Pedidos</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/settings')}>Configurações</Button>
          </nav>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="h-4 w-4" aria-hidden />
            Sair
          </Button>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-5 font-display text-3xl font-bold text-roseText">{title}</h1>
        {children}
      </div>
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-2 border-t border-brand/10 bg-white md:hidden">
        <button className="py-4 text-sm font-bold text-brand" onClick={() => navigate('/admin/orders')} type="button">Pedidos</button>
        <button className="py-4 text-sm font-bold text-brand" onClick={() => navigate('/admin/settings')} type="button">Configurações</button>
      </nav>
    </main>
  );
}
