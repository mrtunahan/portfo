import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PROFILE, EXPERTISE } from '@/data/portfolioData';

export function About() {
  return (
    <section id="hakkimda" className="container scroll-mt-24 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Hakkımda</h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            {PROFILE.bio.map((p, i) => (
              <p key={i} className="max-w-measure text-pretty leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>

          {/* Yüzde çubukları yerine alana göre gruplama: uydurma seviye
              rakamları okuyucuya hiçbir şey anlatmıyor. */}
          <div className="space-y-6 lg:col-span-5">
            {EXPERTISE.map((group) => (
              <div key={group.area} className="rounded-lg border border-border p-5">
                <h3 className="text-sm font-medium">{group.area}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
