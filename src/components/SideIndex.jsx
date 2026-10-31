import { useScrollProgress } from '../lib/motion';

/**
 * Sol kenarda duran bölüm dizini ve ilerleme çizgisi.
 * Mobilde gizli; orada üstteki başlık yeterli.
 */
export default function SideIndex({ sections, active }) {
  const progress = useScrollProgress();

  return (
    <nav
      className="fixed left-0 top-0 z-40 hidden h-full w-[var(--gutter)] flex-col items-center justify-center lg:flex"
      aria-label="Bölümler"
    >
      {/* İlerleme: ince dikey çizgi */}
      <div className="absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-rule">
        <div
          className="w-full bg-accent origin-top"
          style={{ height: `${progress * 100}%`, transition: 'height 90ms linear' }}
        />
      </div>

      <ul className="relative flex flex-col gap-7">
        {sections.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group block"
                aria-current={on ? 'true' : undefined}
              >
                <span
                  className="t-meta block whitespace-nowrap transition-colors"
                  style={{
                    writingMode: 'vertical-rl',
                    color: on ? 'var(--accent)' : 'var(--mute)',
                    fontVariationSettings: on
                      ? "'wdth' 92, 'wght' 700"
                      : "'wdth' 76, 'wght' 500",
                    transition: 'font-variation-settings .35s cubic-bezier(.2,.8,.2,1), color .25s',
                  }}
                >
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
