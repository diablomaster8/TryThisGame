/**
 * TECH-56: how much the Grove keeps in this browser. Sums the length of every `grove`
 * key in localStorage (UTF-16, two bytes a character) and asks `navigator.storage.estimate`
 * for the quota where it can. Wrapped throughout: no storage reads as nothing used.
 */
export function groveBytes(): number {
  let n = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith('grove')) continue;
      n += (k.length + (localStorage.getItem(k)?.length ?? 0)) * 2;
    }
  } catch {
    return 0;
  }
  return n;
}

export async function storageQuota(): Promise<number | null> {
  try {
    const e = await navigator.storage?.estimate?.();
    return e?.quota ?? null;
  } catch {
    return null;
  }
}

/** R0497: the origin's whole use (offline packs, the sculpt cache) and quota, where known. */
export async function storageEstimate(): Promise<{ usage: number; quota: number } | null> {
  try {
    const e = await navigator.storage?.estimate?.();
    return e && typeof e.usage === 'number' && e.quota ? { usage: e.usage, quota: e.quota } : null;
  } catch {
    return null;
  }
}
