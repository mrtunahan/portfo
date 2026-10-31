import { useEffect, useState } from 'react';
import Site from './components/Site';
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
  return <Site />;
}
