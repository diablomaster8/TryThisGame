/**
 * PERF (2026-11-06): per-frame `document.querySelector('.dialogue')` and friends cost about
 * 0.7 ms a frame on a 4x-throttled phone. The HUD's shell elements live as long as the page, so
 * the first match is kept while it stays in the document; a miss is looked up again next call.
 */
const found = new Map<string, Element>();

export function cachedQuery(selector: string): Element | null {
  if (typeof document === 'undefined') return null;
  const hit = found.get(selector);
  if (hit?.isConnected) return hit;
  const el = document.querySelector(selector);
  if (el) found.set(selector, el);
  else found.delete(selector);
  return el;
}
