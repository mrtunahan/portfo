import { PROFILE } from '@/data/portfolioData';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-wrap items-center justify-between gap-4 py-8">
        <p className="text-sm text-muted-foreground">
          {PROFILE.name}, {new Date().getFullYear()}
        </p>
        <p className="text-sm text-muted-foreground">{PROFILE.location}</p>
      </div>
    </footer>
  );
}
