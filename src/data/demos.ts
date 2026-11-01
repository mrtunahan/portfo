import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

/* Demolar toplamda ~2500 satır ve yalnızca kullanıcı "Demoyu izle"
   dediğinde gerekiyor. Tembel yüklenerek ana paketten çıkarıldılar. */

export interface DemoEntry {
  component: LazyExoticComponent<ComponentType>;
  label: string;
  /** Demo açılırken sıfırlanan oynatma konumu anahtarı. */
  timerKey: string;
}

export const DEMO_REGISTRY: Record<string, DemoEntry> = {
  'offline-asistan': {
    component: lazy(() => import('../animations/OfflineAsistanDemo')),
    label: 'Offline Asistan',
    timerKey: 'offline-asistan-demo:t',
  },
  'karatekin-travel': {
    component: lazy(() => import('../animations/KaratekinTravelDemo')),
    label: 'KaratekinTravel',
    timerKey: 'karatekin-travel-demo:t',
  },
};

export const DEMO_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '(demo yok)' },
  ...Object.entries(DEMO_REGISTRY).map(([value, { label }]) => ({ value, label })),
];
