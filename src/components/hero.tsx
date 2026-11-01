import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROFILE } from '@/data/portfolioData';

interface HeroProps {
  softwareCount: number;
  researchCount: number;
}

export function Hero({ softwareCount, researchCount }: HeroProps) {
  const reduce = useReducedMotion();

  // Sayfa açılışında tek bir orkestre edilmiş diziliş
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 12 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] } },
  } as const;

  const mail = PROFILE.links.find((l) => l.icon === 'mail');

  return (
    <section id="giris" className="container pt-32 pb-20 md:pt-40 md:pb-28">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-emerald-500" />
            </span>
            {PROFILE.availability}
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
        >
          {PROFILE.name}
        </motion.h1>

        <motion.p variants={item} className="mt-3 text-lg text-muted-foreground md:text-xl">
          {PROFILE.title}
        </motion.p>

        <motion.p variants={item} className="mt-6 max-w-measure text-pretty leading-relaxed text-muted-foreground">
          {PROFILE.summary}
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
          {PROFILE.cvUrl ? (
            <Button asChild>
              <a href={PROFILE.cvUrl} download>
                <Download aria-hidden="true" />
                CV indir
              </a>
            </Button>
          ) : (
            // CV dosyası eklenene kadar buton gizlenir; kırık bağlantı sunmaktansa
            // hiç göstermemek daha iyi. public/cv.pdf eklenince cvUrl'i doldur.
            null
          )}

          {mail && (
            <Button asChild variant={PROFILE.cvUrl ? 'outline' : 'default'}>
              <a href={mail.href}>
                <Mail aria-hidden="true" />
                İletişime geç
              </a>
            </Button>
          )}

          <Button asChild variant="ghost">
            <a href="#projeler">
              <ArrowDown aria-hidden="true" />
              Projeleri gör
            </a>
          </Button>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3"
        >
          <div>
            <dt className="text-sm text-muted-foreground">Yazılım projesi</dt>
            <dd className="tnum mt-1 text-3xl font-semibold tracking-tight">{softwareCount}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Araştırma projesi</dt>
            <dd className="tnum mt-1 text-3xl font-semibold tracking-tight">{researchCount}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-sm text-muted-foreground">Konum</dt>
            <dd className="mt-1 text-lg">{PROFILE.location}</dd>
          </div>
        </motion.dl>
      </motion.div>
    </section>
  );
}
