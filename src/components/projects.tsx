import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/data/store';
import { STATUS_LABEL, displayName } from '@/data/portfolioData';
import type { Project, ProjectTrack } from '@/data/portfolioData';

type Filter = 'all' | ProjectTrack;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Hepsi' },
  { id: 'software', label: 'Yazılım' },
  { id: 'research', label: 'Araştırma' },
];

/** Yürüyen ve yayında olan işleri vurgulamak için nokta rengi. */
const statusDot: Record<Project['status'], string> = {
  live: 'bg-emerald-500',
  active: 'bg-emerald-500',
  dev: 'bg-amber-500',
  done: 'bg-muted-foreground',
};

function ProjectCard({ project, onDemo }: { project: Project; onDemo: (k: string) => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      layout={!reduce}
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group flex min-w-0 flex-col rounded-lg border border-border bg-card p-6',
        'transition-all duration-200 hover:-translate-y-1 hover:border-accent/40',
        'hover:shadow-[0_8px_30px_-12px_hsl(var(--accent)/0.25)]',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-medium tracking-tight">{displayName(project)}</h3>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className={cn('h-1.5 w-1.5 rounded-full', statusDot[project.status])} />
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.summary}
      </p>

      {project.grant && (
        <dl className="mt-4 space-y-1 border-l-2 border-accent/30 pl-3 text-xs text-muted-foreground">
          <div className="flex gap-2">
            <dt className="shrink-0">Program</dt>
            <dd className="font-medium text-foreground">{project.grant.program}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">Proje no</dt>
            <dd className="tnum">{project.grant.number}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">Görev</dt>
            <dd>
              {project.grant.role} · {project.grant.period}
            </dd>
          </div>
        </dl>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <Badge key={t} variant="outline">
            {t}
          </Badge>
        ))}
      </div>

      {(project.url || project.demoKey) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {project.url && (
            <Button asChild size="sm" variant="outline">
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.displayUrl ?? 'Siteyi aç'}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          )}
          {project.demoKey && (
            <Button size="sm" variant="ghost" onClick={() => onDemo(project.demoKey as string)}>
              <PlayCircle aria-hidden="true" />
              Demoyu izle
            </Button>
          )}
        </div>
      )}
    </motion.article>
  );
}

export function Projects({ onDemo }: { onDemo: (k: string) => void }) {
  const [projects] = useProjects();
  const [filter, setFilter] = useState<Filter>('all');

  const shown = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.track === filter)),
    [projects, filter],
  );

  const countOf = (f: Filter) =>
    f === 'all' ? projects.length : projects.filter((p) => p.track === f).length;

  return (
    <section id="projeler" className="container scroll-mt-24 py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Projeler</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Üretime çıkmış yazılımlar ve TÜBİTAK destekli araştırmalar.
          </p>
        </div>

        <div
          className="flex flex-wrap gap-1 rounded-lg border border-border p-1"
          role="group"
          aria-label="Proje filtresi"
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                filter === f.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {f.label}
              <span className="tnum ml-1.5 opacity-60">{countOf(f.id)}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <ProjectCard key={p.id} project={p} onDemo={onDemo} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
