import { useMemo, useState } from 'react';
import { useProjects, useScientificProjects } from '../data/store';
import { usePanelHeight, useFlip, useInView } from '../lib/motion';

/* Durum etiketleri — ham veri anahtarlarını okunur Türkçeye çevirir */
const STATUS_TR = {
  live: 'yayında',
  dev: 'geliştirmede',
  active: 'yürüyor',
  done: 'tamamlandı',
};

/** İki ayrı veri şemasını tek satır biçimine indirger. */
function normalize(projects, scientific) {
  const a = projects.map((p) => ({
    key: `sw-${p.id}`,
    track: 'yazilim',
    title: p.name,
    desc: (p.screenDesc || []).join(' '),
    tech: p.tech,
    status: STATUS_TR[p.status] || p.status,
    href: p.url,
    hrefLabel: p.displayUrl,
    demoKey: p.demoKey,
    aside: null,
  }));

  const b = scientific.map((p) => ({
    key: `sci-${p.id}`,
    track: 'arastirma',
    title: p.name,
    desc: (p.screenDesc || []).join(' '),
    tech: p.tech,
    status: STATUS_TR[p.status] || p.status,
    href: p.url,
    hrefLabel: p.displayUrl,
    demoKey: null,
    aside: [p.program, p.no && `No ${p.no}`, p.role, p.year].filter(Boolean),
  }));

  return [...a, ...b];
}

/* ─── Tek satır ───────────────────────────────────────────── */

function Row({ item, open, onToggle, onDemo }) {
  const panelRef = usePanelHeight(open);
  const panelId = `panel-${item.key}`;

  return (
    <div data-flip-id={item.key} className="rule-b">
      <button
        type="button"
        className="row grid12 items-baseline"
        data-active={open}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="t-row row__title col-span-9 md:col-span-7">{item.title}</span>
        <span className="t-meta col-span-3 md:col-span-2 md:col-start-9 text-right md:text-left">
          {item.status}
        </span>
        <span className="t-meta hidden md:block md:col-span-2 text-right">
          {open ? 'kapat' : 'aç'}
        </span>
      </button>

      {/* inert: kapalı panel yüksekliği 0 olsa da içindeki bağlantılar
          DOM'da duruyor; bu olmadan klavyeyle görünmez butonlara geçiliyor. */}
      <div className="row__panel" ref={panelRef} id={panelId} data-active={open} inert={!open}>
        <div className="row__panelInner grid12" style={{ opacity: open ? 1 : 0 }}>
          <div className="col-span-12 md:col-span-6">
            <p className="t-body">{item.desc}</p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              {item.href && (
                <a
                  className="btn"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  Siteyi aç
                </a>
              )}
              {item.demoKey && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDemo(item.demoKey);
                  }}
                >
                  Demoyu izle
                </button>
              )}
              {item.hrefLabel && <span className="t-meta">{item.hrefLabel}</span>}
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 md:col-start-9 mt-6 md:mt-0">
            <p className="t-meta leading-relaxed">{item.tech}</p>
            {item.aside && (
              <ul className="mt-4 space-y-1">
                {item.aside.map((line) => (
                  <li key={line} className="t-meta">
                    {line}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Bölüm ───────────────────────────────────────────────── */

const FILTERS = [
  { id: 'hepsi', label: 'Hepsi' },
  { id: 'yazilim', label: 'Yazılım' },
  { id: 'arastirma', label: 'Araştırma' },
];

export default function Work({ onDemo }) {
  const [projects] = useProjects();
  const [scientific] = useScientificProjects();
  const [filter, setFilter] = useState('hepsi');
  const [openKey, setOpenKey] = useState(null);
  const [sectionRef, seen] = useInView();

  const all = useMemo(() => normalize(projects, scientific), [projects, scientific]);
  const shown = useMemo(
    () => (filter === 'hepsi' ? all : all.filter((i) => i.track === filter)),
    [all, filter],
  );

  const [listRef, captureFlip] = useFlip([filter]);

  const changeFilter = (id) => {
    if (id === filter) return;
    captureFlip();
    setOpenKey(null);
    setFilter(id);
  };

  return (
    <section
      id="isler"
      ref={sectionRef}
      className="shell enter py-24 md:py-32"
      data-seen={seen}
    >
      <div className="grid12 items-end gap-y-6">
        <h2 className="t-section col-span-12 md:col-span-5">İşler</h2>

        <div className="col-span-12 md:col-span-6 md:col-start-7 flex flex-wrap gap-6">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            const count =
              f.id === 'hepsi' ? all.length : all.filter((i) => i.track === f.id).length;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => changeFilter(f.id)}
                aria-pressed={on}
                className="t-meta"
                style={{
                  color: on ? 'var(--accent)' : 'var(--mute)',
                  fontVariationSettings: on ? "'wdth' 94, 'wght' 700" : "'wdth' 76, 'wght' 500",
                  transition: 'font-variation-settings .3s cubic-bezier(.2,.8,.2,1), color .2s',
                  borderBottom: on ? '1px solid var(--accent)' : '1px solid transparent',
                  paddingBottom: 2,
                }}
              >
                {f.label} <span className="tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div ref={listRef} className="mt-12 rule-t">
        {shown.map((item) => (
          <Row
            key={item.key}
            item={item}
            open={openKey === item.key}
            onToggle={() => setOpenKey((k) => (k === item.key ? null : item.key))}
            onDemo={onDemo}
          />
        ))}
      </div>
    </section>
  );
}
