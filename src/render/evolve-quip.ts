/**
 * R0354 (FUN-65): the comic beat after the evolution card. When the card closes, the new
 * adult looks itself over, turns all the way round to see its tail, overbalances and sits
 * down. The UI starts it (`startQuip`); both renderers ask `quipBeat` each frame. Under
 * reduced motion it is one still frame: sitting, for the whole beat.
 */
import { EVOLVE_QUIP } from '../config/tuning-fun-r7';

const started = new Map<string, number>();

/** The card for Nubbin `id` has closed: play its beat from now. */
export function startQuip(id: string, nowMs: number): void {
  started.set(id, nowMs);
}

export type QuipPhase = 'look' | 'turn' | 'wobble' | 'sit';

/** Where Nubbin `id` is in its beat (with `turn`, radians of the spin so far), or null. */
export function quipBeat(
  id: string,
  nowMs: number,
  reduced: boolean,
): { phase: QuipPhase; turn: number } | null {
  const t0 = started.get(id);
  if (t0 === undefined) return null;
  const t = nowMs - t0;
  const Q = EVOLVE_QUIP;
  const end = Q.lookMs + Q.turnMs + Q.wobbleMs + Q.sitMs;
  if (t < 0 || t >= end) {
    if (t >= end) started.delete(id);
    return null;
  }
  if (reduced) return { phase: 'sit', turn: 0 };
  if (t < Q.lookMs) return { phase: 'look', turn: 0 };
  if (t < Q.lookMs + Q.turnMs) {
    const p = (t - Q.lookMs) / Q.turnMs;
    return { phase: 'turn', turn: p * Math.PI * 2 };
  }
  if (t < Q.lookMs + Q.turnMs + Q.wobbleMs) return { phase: 'wobble', turn: 0 };
  return { phase: 'sit', turn: 0 };
}
