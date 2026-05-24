import OfflineAsistanDemo from '../animations/OfflineAsistanDemo';
import KaratekinTravelDemo from '../animations/KaratekinTravelDemo';

export const DEMO_REGISTRY = {
  'offline-asistan':  { component: OfflineAsistanDemo,  label: 'Offline Asistan',  timerKey: 'offline-asistan-demo:t' },
  'karatekin-travel': { component: KaratekinTravelDemo, label: 'KaratekinTravel',  timerKey: 'karatekin-travel-demo:t' },
};

export const DEMO_OPTIONS = [
  { value: '',                  label: '(demo yok)' },
  ...Object.entries(DEMO_REGISTRY).map(([value, { label }]) => ({ value, label })),
];
