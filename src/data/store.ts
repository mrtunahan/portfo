import { useEffect, useState, useCallback } from 'react';
import { PROJECTS as DEFAULT_PROJECTS, TIMELINE as DEFAULT_TIMELINE } from './portfolioData';
import type { Project, TimelineEntry } from './portfolioData';

/* Yönetim panelinin düzenlemeleri tarayıcının localStorage'ında tutulur.
   Depoda kayıt yoksa portfolioData.ts içindeki varsayılanlar kullanılır. */

const KEY_PROJECTS = 'portfo:projects:v2';
const KEY_TIMELINE = 'portfo:timeline:v1';
const EVT_PREFIX = 'portfo:store-changed:';

function readStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVT_PREFIX + key));
  } catch {
    /* kota dolu veya depolama kapalı — sessizce geç */
  }
}

type StoreTuple<T> = [T[], (next: T[]) => void, () => void];

function useStorageList<T>(key: string, defaults: T[]): StoreTuple<T> {
  const [items, setItems] = useState<T[]>(() => readStorage(key, defaults));

  useEffect(() => {
    const refresh = () => setItems(readStorage(key, defaults));
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) refresh();
    };
    window.addEventListener(EVT_PREFIX + key, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVT_PREFIX + key, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, [key, defaults]);

  const save = useCallback(
    (next: T[]) => {
      writeStorage(key, next);
      setItems(next);
    },
    [key],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* yoksay */
    }
    window.dispatchEvent(new CustomEvent(EVT_PREFIX + key));
    setItems(defaults);
  }, [key, defaults]);

  return [items, save, reset];
}

export const useProjects = (): StoreTuple<Project> =>
  useStorageList<Project>(KEY_PROJECTS, DEFAULT_PROJECTS);

export const useTimeline = (): StoreTuple<TimelineEntry> =>
  useStorageList<TimelineEntry>(KEY_TIMELINE, DEFAULT_TIMELINE);

export const STORAGE_KEYS = { projects: KEY_PROJECTS, timeline: KEY_TIMELINE };
