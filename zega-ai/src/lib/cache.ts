const PREFIX = 'zega:';

export function readCache<T>(key: string): T | null {
  try { const raw = localStorage.getItem(PREFIX + key); return raw ? (JSON.parse(raw) as T) : null; }
  catch { return null; }
}
export function writeCache(key: string, data: unknown): void {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(data)); } catch { /* storage full — ignore */ }
}
export function removeCache(key: string): void { localStorage.removeItem(PREFIX + key); }

/** Network-first with localStorage fallback for offline reads. */
export async function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  try {
    const fresh = await fetcher();
    writeCache(key, fresh);
    return fresh;
  } catch (e) {
    const stale = readCache<T>(key);
    if (stale !== null) return stale;
    throw e;
  }
}

export function clearZegaCache(): void {
  Object.keys(localStorage).filter((k) => k.startsWith(PREFIX)).forEach((k) => localStorage.removeItem(k));
}
