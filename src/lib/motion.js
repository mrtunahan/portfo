/* ───────────────────────────────────────────────────────────
   motion.js — sayfanın hareket altyapısı.
   Kütüphane yok: IntersectionObserver, rAF ve FLIP elle yazıldı.
   AnimCore'daki easing fonksiyonları burada da kullanılıyor.
   ─────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Easing } from '../animations/AnimCore';

/** Kullanıcı hareketi azaltmak istiyor mu? */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ─── Görünürlük ─────────────────────────────────────────── */

/**
 * Eleman görüş alanına girdiğinde bir kez true olur ve öyle kalır.
 * Tek yönlü: geri kaydırınca tekrar gizlenmez, bu yanıp sönme yapar.
 */
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null);
  // Hareket azaltma tercihinde gözlemci hiç kurulmaz; başlangıçta görünür.
  const [seen, setSeen] = useState(prefersReducedMotion);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, seen];
}

/**
 * Hangi bölümün ekranda olduğunu izler; kenar dizini bunu kullanıyor.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: '-20% 0px -40% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/* ─── Sayfa kaydırma ilerlemesi ───────────────────────────── */

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return progress;
}

/* ─── Sayı sayacı ─────────────────────────────────────────── */

/**
 * Görünür olduğunda 0'dan hedefe sayar. Portföy rakamları için.
 */
export function useCountUp(target, { duration = 1100, start = false } = {}) {
  // Hareket azaltmada sayaç hiç çalışmaz, sayı doğrudan yerinde durur.
  const reduced = prefersReducedMotion();
  const animate = start && !reduced;
  const [value, setValue] = useState(() => (reduced ? target : 0));

  useEffect(() => {
    if (!animate) return;

    let frame = 0;
    const t0 = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      setValue(Math.round(Easing.easeOutCubic(t) * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, animate]);

  return value;
}

/* ─── Değişken font genişlik animasyonu ───────────────────── */

/**
 * Archivo'nun wdth eksenini canlandırır. Başlık dar başlayıp
 * yerine otururken genişler — tipografinin kendisi hareket.
 */
export function useWidthAxis(
  { from = 68, to = 112, weight = 800, duration = 1400, delay = 0, run = true } = {},
) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !run) return;

    if (prefersReducedMotion()) {
      el.style.fontVariationSettings = `'wdth' ${to}, 'wght' ${weight}`;
      return;
    }

    let frame = 0;
    let t0 = 0;

    const tick = (now) => {
      if (!t0) t0 = now;
      const elapsed = now - t0 - delay;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      const eased = Easing.easeOutQuart(t);
      const wdth = from + (to - from) * eased;
      el.style.fontVariationSettings = `'wdth' ${wdth.toFixed(2)}, 'wght' ${weight}`;
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    el.style.fontVariationSettings = `'wdth' ${from}, 'wght' ${weight}`;
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [from, to, weight, duration, delay, run]);

  return ref;
}

/* ─── FLIP: filtre değişiminde satırların yer değiştirmesi ── */

/**
 * First-Last-Invert-Play. Liste filtrelenince kalan satırlar
 * yeni yerlerine kayar; yeniden çizim sıçramaz.
 */
export function useFlip(deps) {
  const containerRef = useRef(null);
  const positions = useRef(new Map());

  // Yeniden çizimden önce mevcut konumları ölç
  const capture = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    positions.current.clear();
    root.querySelectorAll('[data-flip-id]').forEach((el) => {
      positions.current.set(el.dataset.flipId, el.getBoundingClientRect().top);
    });
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root || prefersReducedMotion()) return;
    if (!positions.current.size) return;

    root.querySelectorAll('[data-flip-id]').forEach((el) => {
      const prev = positions.current.get(el.dataset.flipId);
      if (prev == null) {
        // Yeni gelen satır: sessizce belirsin
        el.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: 320, easing: 'ease-out' },
        );
        return;
      }
      const next = el.getBoundingClientRect().top;
      const delta = prev - next;
      if (Math.abs(delta) < 1) return;

      el.animate(
        [{ transform: `translateY(${delta}px)` }, { transform: 'none' }],
        { duration: 460, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
      );
    });

    positions.current.clear();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return [containerRef, capture];
}

/* ─── Açılır panel yüksekliği ─────────────────────────────── */

/**
 * height:auto animasyonlanmadığı için gerçek yüksekliği ölçüp
 * piksel olarak uygular; açılma bitince auto'ya bırakır.
 */
export function usePanelHeight(open) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inner = el.firstElementChild;
    if (!inner) return;

    if (prefersReducedMotion()) {
      el.style.height = open ? 'auto' : '0px';
      return;
    }

    if (open) {
      el.style.height = `${inner.offsetHeight}px`;
      const done = () => {
        el.style.height = 'auto';
      };
      el.addEventListener('transitionend', done, { once: true });
      return () => el.removeEventListener('transitionend', done);
    }

    // Kapanış: auto'dan ölçülen değere düşür, sonra sıfırla
    el.style.height = `${inner.offsetHeight}px`;
    requestAnimationFrame(() => {
      el.style.height = '0px';
    });
  }, [open]);

  return ref;
}

/* ─── Izgara göstergesi (g tuşu) ──────────────────────────── */

export function useGridToggle(key = 'g') {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === key) setOn((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [key]);

  return on;
}

/* ─── Açılış dizilimi tetikleyici ─────────────────────────── */

export function useIntro(delay = 120) {
  useEffect(() => {
    const id = setTimeout(() => {
      document.documentElement.dataset.intro = 'done';
    }, delay);
    return () => clearTimeout(id);
  }, [delay]);
}
