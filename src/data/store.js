import { useEffect, useState, useCallback } from 'react';
import { PROJECTS as DEFAULT_PROJECTS } from './projects';
import { SCIENTIFIC_PROJECTS as DEFAULT_SCI } from './scientific';

const KEY_PROJECTS = 'portfo:projects:v1';
const KEY_SCI      = 'portfo:scientific:v1';
const EVT_PREFIX   = 'portfo:store-changed:';

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVT_PREFIX + key));
  } catch { /* ignore */ }
}

function useStorageList(key, defaults) {
  const [items, setItems] = useState(() => readStorage(key, defaults));

  useEffect(() => {
    const refresh = () => setItems(readStorage(key, defaults));
    const onCustom = () => refresh();
    const onStorage = (e) => { if (e.key === key) refresh(); };
    window.addEventListener(EVT_PREFIX + key, onCustom);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVT_PREFIX + key, onCustom);
      window.removeEventListener('storage', onStorage);
    };
  }, [key, defaults]);

  const save = useCallback((next) => {
    writeStorage(key, next);
    setItems(next);
  }, [key]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent(EVT_PREFIX + key));
    setItems(defaults);
  }, [key, defaults]);

  return [items, save, reset];
}

export const useProjects           = () => useStorageList(KEY_PROJECTS, DEFAULT_PROJECTS);
export const useScientificProjects = () => useStorageList(KEY_SCI,      DEFAULT_SCI);

export const STORAGE_KEYS = { projects: KEY_PROJECTS, scientific: KEY_SCI };
export { DEFAULT_PROJECTS, DEFAULT_SCI };
