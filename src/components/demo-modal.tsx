import { Suspense, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEMO_REGISTRY } from '@/data/demos';

interface DemoModalProps {
  demoKey: string;
  onClose: () => void;
}

/** Demolar kendi koyu sahnesinde oynar; sayfanın temasından bağımsız. */
export function DemoModal({ demoKey, onClose }: DemoModalProps) {
  const entry = DEMO_REGISTRY[demoKey];
  const Demo = entry?.component;
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (entry?.timerKey) {
      try {
        localStorage.removeItem(entry.timerKey);
      } catch {
        /* yoksay */
      }
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [entry, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={entry ? `${entry.label} demosu` : 'Demo'}
      className="fixed inset-0 z-[100] bg-zinc-950"
    >
      {Demo ? (
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-zinc-400">Demo yükleniyor…</p>
            </div>
          }
        >
          <Demo />
        </Suspense>
      ) : (
        <div className="flex h-full items-center justify-center p-6">
          <p className="text-sm text-zinc-300">Bu proje için demo tanımlı değil.</p>
        </div>
      )}

      <Button
        ref={closeRef}
        variant="outline"
        size="sm"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 border-white/25 bg-black/40 text-white hover:bg-black/70"
      >
        <X aria-hidden="true" />
        Kapat
      </Button>
    </div>
  );
}
