import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { adminPath, isAdminPath } from './config/admin';
import { Home } from './pages/Home';
import { useAuthStore } from './store/authStore';

const Builder = lazy(() => import('./pages/Builder').then((module) => ({ default: module.Builder })));
const CustomerOrders = lazy(() => import('./pages/CustomerOrders').then((module) => ({ default: module.CustomerOrders })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then((module) => ({ default: module.Dashboard })));
const Login = lazy(() => import('./pages/admin/Login').then((module) => ({ default: module.Login })));
const OrderDetails = lazy(() => import('./pages/admin/OrderDetails').then((module) => ({ default: module.OrderDetails })));
const Orders = lazy(() => import('./pages/admin/Orders').then((module) => ({ default: module.Orders })));
const Settings = lazy(() => import('./pages/admin/Settings').then((module) => ({ default: module.Settings })));

function App() {
  const [path, setPath] = useState(normalizePath(window.location.pathname));
  const token = useAuthStore((state) => state.token);
  const onAdmin = isAdminPath(path);

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Paginas do painel nunca devem ser indexadas por buscadores.
  useEffect(() => {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (onAdmin) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
    } else {
      robots?.remove();
    }
  }, [onAdmin]);

  function navigate(nextPath: string) {
    window.history.pushState({}, '', nextPath);
    setPath(normalizePath(nextPath));
    window.scrollTo({ top: 0 });
  }

  if (path === '/builder') {
    return <Lazy><Builder navigate={navigate} /></Lazy>;
  }

  if (path === '/meus-pedidos') {
    return <Lazy><CustomerOrders navigate={navigate} /></Lazy>;
  }

  if (onAdmin) {
    if (!token || path === adminPath('/login')) {
      return <Lazy><Login navigate={navigate} /></Lazy>;
    }

    if (path === adminPath()) {
      return <Lazy><Dashboard navigate={navigate} /></Lazy>;
    }

    if (path === adminPath('/orders')) {
      return <Lazy><Orders navigate={navigate} /></Lazy>;
    }

    if (path.startsWith(adminPath('/orders/'))) {
      const id = path.slice(adminPath('/orders/').length);
      return <Lazy><OrderDetails id={id} navigate={navigate} /></Lazy>;
    }

    if (path === adminPath('/settings')) {
      return <Lazy><Settings navigate={navigate} /></Lazy>;
    }

    return <Lazy><Dashboard navigate={navigate} /></Lazy>;
  }

  // Qualquer rota desconhecida (inclusive /admin) cai na pagina inicial.
  return <Home navigate={navigate} />;
}

function normalizePath(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" aria-label="Carregando" />
    </main>
  );
}

export default App;
