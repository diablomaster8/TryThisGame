/**
 * LOOK-62: the evolution reveal, shared by both renderers. The evolving cocoon shakes harder
 * through its last 1.2 s, the screen flashes white as it opens (never under reduced motion),
 * and the new form spins one turn as it lands, its emote ball already in the band's shape.
 */
import { EVOLVE_REVEAL, LIFECYCLE } from '../config/tuning';
import type { Nubbin } from '../sim/types';

/** The cocoon's sideways shake (−1..1 times an amplitude) in its last moments, else 0. */
export function cocoonShake(
  n: Pick<Nubbin, 'stage' | 'cocoonKind' | 'stageMs'>,
  nowMs: number,
): number {
  if (n.stage !== 'cocoon' || n.cocoonKind !== 'evolve') return 0;
  const left = LIFECYCLE.cocoonMs - n.stageMs;
  if (left > EVOLVE_REVEAL.shakeMs || left < 0) return 0;
  const k = 1 - left / EVOLVE_REVEAL.shakeMs;
  return Math.sin(nowMs / 35) * (0.4 + 0.6 * k);
}

/** How far through its landing turn a Nubbin that popped at `startMs` is: radians, 0 after. */
export function revealTurn(startMs: number | undefined, nowMs: number, reduced: boolean): number {
  if (startMs === undefined || reduced) return 0;
  const p = (nowMs - startMs) / EVOLVE_REVEAL.spinMs;
  if (p < 0 || p >= 1) return 0;
  const e = 1 - (1 - p) * (1 - p);
  return e * Math.PI * 2;
}

/** A white flash over the whole page as a cocoon opens; none under reduced motion. */
export function evolveFlash(reduced: boolean): void {
  if (reduced || typeof document === 'undefined') return;
  const d = document.createElement('div');
  d.className = 'evolve-flash';
  d.style.animationDuration = `${EVOLVE_REVEAL.flashMs}ms`;
  document.body.appendChild(d);
  d.addEventListener('animationend', () => d.remove());
  window.setTimeout(() => d.remove(), EVOLVE_REVEAL.flashMs + 200);
}
