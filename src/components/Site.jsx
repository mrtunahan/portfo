import { useMemo, useState } from 'react';
import Hero from '../sections/Hero';
import Work from '../sections/Work';
import About from '../sections/About';
import Contact from '../sections/Contact';
import SideIndex from './SideIndex';
import GridOverlay from './GridOverlay';
import DemoModal from './DemoModal';
import { useActiveSection, useGridToggle, useIntro } from '../lib/motion';
import { useProjects, useScientificProjects } from '../data/store';
import { PROFILE } from '../data/profile';

const SECTIONS = [
  { id: 'giris', label: 'Giriş' },
  { id: 'isler', label: 'İşler' },
  { id: 'hakkinda', label: 'Hakkında' },
  { id: 'iletisim', label: 'İletişim' },
];

export default function Site() {
  const [demoKey, setDemoKey] = useState(null);
  const [projects] = useProjects();
  const [scientific] = useScientificProjects();

  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useActiveSection(ids);
  const gridOn = useGridToggle('g');
  useIntro();

  return (
    <>
      <a
        href="#isler"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        İçeriğe geç
      </a>

      <GridOverlay on={gridOn} />
      <SideIndex sections={SECTIONS} active={active} />

      {/* Üst çubuk: isim solda, bölümler sağda */}
      <div className="fixed inset-x-0 top-0 z-30 bg-paper/85 backdrop-blur-sm">
        <div className="shell flex items-center justify-between py-4 rule-b">
          <a href="#giris" className="t-meta" style={{ fontVariationSettings: "'wdth' 88, 'wght' 700", color: 'var(--ink)' }}>
            {PROFILE.name}
          </a>
          <nav className="hidden gap-7 md:flex" aria-label="Üst menü">
            {SECTIONS.slice(1).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="t-meta"
                style={{ color: active === s.id ? 'var(--accent)' : 'var(--mute)' }}
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <main>
        <Hero softwareCount={projects.length} scientificCount={scientific.length} />
        <Work onDemo={setDemoKey} />
        <About />
        <Contact />
      </main>

      {demoKey && <DemoModal demoKey={demoKey} onClose={() => setDemoKey(null)} />}
    </>
  );
}
