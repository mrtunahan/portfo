import { motion } from 'framer-motion';
import { Briefcase, FlaskConical, GraduationCap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTimeline } from '@/data/store';
import type { TimelineEntry } from '@/data/portfolioData';

const ICON: Record<TimelineEntry['kind'], LucideIcon> = {
  work: Briefcase,
  research: FlaskConical,
  education: GraduationCap,
};

const KIND_LABEL: Record<TimelineEntry['kind'], string> = {
  work: 'Profesyonel',
  research: 'Akademik',
  education: 'Eğitim',
};

export function Timeline() {
  const [entries] = useTimeline();

  return (
    <section id="gecmis" className="container scroll-mt-24 py-20 md:py-28">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Geçmiş</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Akademik ve profesyonel adımlar.
      </p>

      <ol className="relative mt-10 space-y-8 border-l border-border pl-8">
        {entries.map((entry, i) => {
          const Icon = ICON[entry.kind];
          return (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Çizgi üzerindeki işaret */}
              <span
                className="absolute -left-[41px] flex h-[18px] w-[18px] items-center justify-center rounded-full border border-border bg-background"
                aria-hidden="true"
              >
                <Icon className="h-2.5 w-2.5 text-accent" />
              </span>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="tnum text-sm font-medium text-accent">{entry.period}</span>
                <span className="text-xs text-muted-foreground">{KIND_LABEL[entry.kind]}</span>
              </div>

              <h3 className="mt-1 font-medium tracking-tight">{entry.title}</h3>
              <p className="text-sm text-muted-foreground">{entry.organization}</p>
              <p className="mt-2 max-w-measure text-sm leading-relaxed text-muted-foreground">
                {entry.description}
              </p>
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
