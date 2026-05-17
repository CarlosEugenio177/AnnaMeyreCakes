import { lazy, Suspense, useEffect, useState } from 'react';
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
  const [path, setPath] = useState(window.location.pathname);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(nextPath: string) {
    window.history.pushState({}, '', nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0 });
  }

  if (path === '/builder') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Builder navigate={navigate} />
      </Suspense>
    );
  }

  if (path === '/meus-pedidos') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <CustomerOrders navigate={navigate} />
      </Suspense>
    );
  }

  if (path === '/admin/login') {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Login navigate={navigate} />
      </Suspense>
    );
  }

  if (path.startsWith('/admin')) {
    if (!token) {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <Login navigate={navigate} />
        </Suspense>
      );
    }

    if (path === '/admin' || path === '/admin/') {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <Dashboard navigate={navigate} />
        </Suspense>
      );
    }

    if (path === '/admin/orders') {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <Orders navigate={navigate} />
        </Suspense>
      );
    }

    if (path.startsWith('/admin/orders/')) {
      const id = path.split('/').at(-1) ?? '';
      return (
        <Suspense fallback={<LoadingScreen />}>
          <OrderDetails id={id} navigate={navigate} />
        </Suspense>
      );
    }

    if (path === '/admin/settings') {
      return (
        <Suspense fallback={<LoadingScreen />}>
          <Settings navigate={navigate} />
        </Suspense>
      );
    }
  }

  return <Home navigate={navigate} />;
}

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-petal px-6 text-center font-semibold text-cocoa">
      Carregando...
    </main>
  );
}

export default App;
