/**
 * The tracing game's judging (CV3), on a 0-100 board. Kana: one stroke at a time, in
 * order; a drag counts when it starts near the stroke's start, passes near most of the
 * stroke and ends near its end. Hebrew: no stroke order beyond right to left, so a letter
 * counts once the finger has covered enough of its ink. Pure geometry, no DOM.
 */
export interface Pt {
  x: number;
  y: number;
}

const dist = (a: Pt, b: Pt): number => Math.hypot(a.x - b.x, a.y - b.y);

/** Points every `step` units along a polyline, ends included. */
export function resample(line: readonly Pt[], step = 4): Pt[] {
  const out: Pt[] = [];
  if (line.length === 0) return out;
  out.push(line[0]!);
  for (let i = 1; i < line.length; i++) {
    const a = line[i - 1]!;
    const b = line[i]!;
    const n = Math.max(1, Math.ceil(dist(a, b) / step));
    for (let k = 1; k <= n; k++)
      out.push({ x: a.x + ((b.x - a.x) * k) / n, y: a.y + ((b.y - a.y) * k) / n });
  }
  return out;
}

function near(p: Pt, pts: readonly Pt[], radius: number): boolean {
  return pts.some((q) => dist(p, q) <= radius);
}

/** Did this drag trace this stroke, in its direction? */
export function strokeMet(
  stroke: readonly Pt[],
  drag: readonly Pt[],
  radius: number,
  cover: number,
): boolean {
  if (stroke.length < 2 || drag.length < 2) return false;
  const start = stroke[0]!;
  const end = stroke[stroke.length - 1]!;
  if (dist(drag[0]!, start) > radius * 1.5) return false;
  if (dist(drag[drag.length - 1]!, end) > radius * 1.5) return false;
  const path = resample(drag, 3);
  const along = resample(stroke, 4);
  const hit = along.filter((p) => near(p, path, radius)).length;
  return hit / along.length >= cover;
}

/** Share of a letter's ink points the drags have passed over. */
export function inkCovered(ink: readonly Pt[], drags: readonly Pt[][], radius: number): number {
  if (ink.length === 0) return 1;
  const path = drags.flatMap((d) => resample(d, 3));
  return ink.filter((p) => near(p, path, radius)).length / ink.length;
}

/** Where a right-to-left letter starts: its rightmost ink, topmost of those. */
export function rightStart(ink: readonly Pt[]): Pt | null {
  let best: Pt | null = null;
  for (const p of ink) if (!best || p.x > best.x || (p.x === best.x && p.y < best.y)) best = p;
  return best;
}

/**
 * R0703 (KIDS-35): how far from a stroke still counts, by who is tracing: little hands
 * (3–4) get the most room, readers the main game's.
 */
export function traceRadius(
  edu: { age: number; band: string } | null | undefined,
  r: { young: number; older: number; reader: number },
  fallback: number,
): number {
  if (!edu) return fallback;
  if (edu.band === 'reader') return r.reader;
  return edu.age <= 4 ? r.young : r.older;
}

/** R0703: after a miss on a stroke: try again, show the ghost finger, or finish it for them. */
export function afterMiss(
  misses: number,
  demoAfter: number,
  completeAfter: number,
): 'again' | 'demo' | 'complete' {
  if (misses >= completeAfter) return 'complete';
  return misses >= demoAfter ? 'demo' : 'again';
}
