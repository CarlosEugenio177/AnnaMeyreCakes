import { useEffect, useState } from 'react';
import { Builder } from './pages/Builder';
import { Home } from './pages/Home';
import { Dashboard } from './pages/admin/Dashboard';
import { Login } from './pages/admin/Login';
import { OrderDetails } from './pages/admin/OrderDetails';
import { Orders } from './pages/admin/Orders';
import { Settings } from './pages/admin/Settings';
import { useAuthStore } from './store/authStore';

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
    return <Builder navigate={navigate} />;
  }

  if (path === '/admin/login') {
    return <Login navigate={navigate} />;
  }

  if (path.startsWith('/admin')) {
    if (!token) {
      return <Login navigate={navigate} />;
    }

    if (path === '/admin' || path === '/admin/') {
      return <Dashboard navigate={navigate} />;
    }

    if (path === '/admin/orders') {
      return <Orders navigate={navigate} />;
    }

    if (path.startsWith('/admin/orders/')) {
      const id = path.split('/').at(-1) ?? '';
      return <OrderDetails id={id} navigate={navigate} />;
    }

    if (path === '/admin/settings') {
      return <Settings navigate={navigate} />;
    }
  }

  return <Home navigate={navigate} />;
}

export default App;
