import { useWidthAxis, useCountUp, useInView } from '../lib/motion';
import { PROFILE } from '../data/profile';

/**
 * Açılış. Sayfanın tek orkestre edilmiş hareket anı burada:
 * isim dar bir kesimden başlayıp yerine otururken genişliyor.
 * Aşağıdaki her şey sakin.
 */
export default function Hero({ softwareCount, scientificCount }) {
  const line1 = useWidthAxis({ from: 64, to: 112, weight: 800, duration: 1500, delay: 180 });
  const line2 = useWidthAxis({ from: 64, to: 112, weight: 800, duration: 1500, delay: 320 });

  const [statsRef, statsSeen] = useInView({ threshold: 0.5 });
  const sw = useCountUp(softwareCount, { start: statsSeen, duration: 900 });
  const sci = useCountUp(scientificCount, { start: statsSeen, duration: 1100 });

  return (
    <header id="giris" className="shell min-h-[92svh] pt-28 pb-16 flex flex-col justify-between">
      <div>
        <h1 className="t-display">
          <span className="rise">
            <span style={{ '--d': '160ms' }} ref={line1}>
              {PROFILE.nameLines[0]}
            </span>
          </span>
          <span className="rise">
            <span style={{ '--d': '300ms' }} ref={line2}>
              {PROFILE.nameLines[1]}
            </span>
          </span>
        </h1>

        <div className="grid12 mt-10 md:mt-14">
          <p className="t-lead col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-6">
            {PROFILE.lead}
          </p>
        </div>
      </div>

      {/* Sayılar gerçek: üretimdeki iş ve yürütülen araştırma adedi */}
      <div ref={statsRef} className="grid12 rule-t pt-6 mt-16 gap-y-8">
        <div className="col-span-6 md:col-span-3">
          <p className="t-figure tabular-nums">{sw}</p>
          <p className="t-meta mt-2">yazılım projesi</p>
        </div>
        <div className="col-span-6 md:col-span-3">
          <p className="t-figure tabular-nums">{sci}</p>
          <p className="t-meta mt-2">araştırma projesi</p>
        </div>
        <div className="col-span-12 md:col-span-4 md:col-start-9 self-end">
          <p className="t-meta">
            {PROFILE.location}
            <br />
            {PROFILE.role}
          </p>
        </div>
      </div>
    </header>
  );
}
