import { useInView } from '../lib/motion';
import { PROFILE, STACK } from '../data/profile';

export default function About() {
  const [ref, seen] = useInView();

  return (
    <section id="hakkinda" ref={ref} className="shell enter py-24 md:py-32" data-seen={seen}>
      <div className="grid12 gap-y-12">
        <h2 className="t-section col-span-12 md:col-span-4">Hakkında</h2>

        <div className="col-span-12 md:col-span-6 md:col-start-6 space-y-6">
          {PROFILE.about.map((p, i) => (
            <p key={i} className="t-body">
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* Teknolojiler yüzdelerle değil, kullanıldıkları alana göre gruplu.
          Uydurulmuş seviye çubukları kimseye bir şey anlatmıyor. */}
      <div className="grid12 rule-t mt-20 pt-10 gap-y-10">
        {STACK.map((group) => (
          <div key={group.area} className="col-span-12 md:col-span-4">
            <h3
              className="mb-4"
              style={{ fontVariationSettings: "'wdth' 100, 'wght' 650", fontSize: '1.05rem' }}
            >
              {group.area}
            </h3>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item} className="t-body" style={{ fontSize: '0.92rem' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
