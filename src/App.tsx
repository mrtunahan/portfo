import { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Projects } from '@/components/projects';
import { Timeline } from '@/components/timeline';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { DemoModal } from '@/components/demo-modal';
import { AdminPanel } from '@/components/admin-panel';
import { useProjects } from '@/data/store';

function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

function Site() {
  const [demoKey, setDemoKey] = useState<string | null>(null);
  const [projects] = useProjects();

  const counts = useMemo(
    () => ({
      software: projects.filter((p) => p.track === 'software').length,
      research: projects.filter((p) => p.track === 'research').length,
    }),
    [projects],
  );

  return (
    <>
      <a
        href="#projeler"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
      >
        İçeriğe geç
      </a>

      <Navbar />

      <main>
        <Hero softwareCount={counts.software} researchCount={counts.research} />
        <About />
        <Projects onDemo={setDemoKey} />
        <Timeline />
        <Contact />
      </main>

      <Footer />

      {demoKey && <DemoModal demoKey={demoKey} onClose={() => setDemoKey(null)} />}
    </>
  );
}

export default function App() {
  const hash = useHashRoute();
  return <ThemeProvider>{hash === '#admin' ? <AdminPanel /> : <Site />}</ThemeProvider>;
}
