import { useEffect, useState } from 'react';
import PortfolioScene from './components/PortfolioScene';
import AdminPanel from './components/AdminPanel';

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  if (hash === '#admin') return <AdminPanel />;
  return <PortfolioScene />;
}
