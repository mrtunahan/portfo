import { useInView, useWidthAxis } from '../lib/motion';
import { PROFILE } from '../data/profile';

export default function Contact() {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const headline = useWidthAxis({
    from: 72,
    to: 108,
    weight: 700,
    duration: 1200,
    run: seen,
  });

  return (
    <footer id="iletisim" ref={ref} className="shell enter py-24 md:py-32" data-seen={seen}>
      <div className="grid12 gap-y-10">
        <h2 ref={headline} className="t-section col-span-12 md:col-span-5">
          Birlikte çalışalım
        </h2>

        <ul className="col-span-12 md:col-span-6 md:col-start-7 rule-t">
          {PROFILE.links.map((l) => (
            <li key={l.label} className="rule-b py-5 flex items-baseline justify-between gap-6">
              <span className="t-meta">{l.label}</span>
              <a
                className="link"
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{ fontVariationSettings: "'wdth' 100, 'wght' 500" }}
              >
                {l.value}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid12 mt-20 pt-6 rule-t">
        <p className="t-meta col-span-12 md:col-span-6">
          {PROFILE.name}, {new Date().getFullYear()}
        </p>
        <p className="t-meta col-span-12 md:col-span-6 md:text-right">
          Izgarayı görmek için <kbd className="font-sans">G</kbd> tuşuna bas
        </p>
      </div>
    </footer>
  );
}
