/**
 * PERF (2026-11-01): the window's inner size, cached until the next `resize` event. Reading
 * `innerWidth`/`innerHeight` after the HUD's DOM writes forces a synchronous style and layout
 * pass; several per-frame checks (the phone budget, the survey zoom, the minimap's auto-hide,
 * the moon's pixel size) read it, so each frame paid for an extra recalc.
 */
let size: { w: number; h: number } | null = null;
if (typeof window !== 'undefined') window.addEventListener('resize', () => (size = null));

export function viewportSize(): { readonly w: number; readonly h: number } {
  return (size ??= { w: window.innerWidth, h: window.innerHeight });
}

/**
 * PERF (2026-11-06): `matchMedia(...)` evaluated afresh flushes style like `innerWidth` does and
 * allocates a list; the HUD asked about the pointer every refresh. The answer is read once and
 * kept current by the list's own change event.
 */
let coarse: boolean | null = null;

export function coarsePointer(): boolean {
  if (coarse !== null) return coarse;
  coarse = false;
  try {
    if (typeof matchMedia !== 'function') return coarse;
    const mql = matchMedia('(pointer: coarse)');
    coarse = mql.matches;
    mql.addEventListener?.('change', (e) => (coarse = e.matches));
  } catch {
    // A browser without media queries: not a touch screen.
  }
  return coarse;
}
