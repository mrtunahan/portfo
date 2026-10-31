import { useEffect, useRef } from 'react';
import { DEMO_REGISTRY } from '../data/demos';

/**
 * Demolar koyu bir sahnede oynuyor; sayfanın geri kalanı açık zeminli.
 * Bu karşıtlık bilinçli: demo ayrı bir bağlam, sayfanın parçası değil.
 */
export default function DemoModal({ onClose, demoKey }) {
  const entry = demoKey ? DEMO_REGISTRY[demoKey] : null;
  const Demo = entry?.component;
  const closeRef = useRef(null);

  // Sayımı sıfırla, kaydırmayı kilitle, Esc ile kapat, odağı yakala
  useEffect(() => {
    if (entry?.timerKey) {
      try {
        localStorage.removeItem(entry.timerKey);
      } catch {
        /* yoksay */
      }
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [entry, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={entry ? `${entry.label} demosu` : 'Demo'}
      className="fixed inset-0 z-[9000] bg-ink/95"
      style={{ animation: 'fadeIn .25s ease' }}
    >
      {Demo ? (
        <Demo />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="t-body text-paper">Bu proje için demo tanımlı değil.</p>
        </div>
      )}

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-[9100] border border-paper/30 px-4 py-2 text-paper"
        style={{ fontSize: '0.85rem', fontVariationSettings: "'wdth' 86, 'wght' 600" }}
      >
        Kapat
      </button>
    </div>
  );
}
