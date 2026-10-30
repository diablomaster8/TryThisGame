/**
 * TECH-54: at ×100 and ×1000 one frame runs many sim steps, and the HUD used to hear the same
 * thing once per step (the same Nubbin hungry ten times over, ten toasts). Feedback hears each
 * kind of event once per subject per frame instead: the subject is the event's Nubbin or id,
 * and an event with neither is kept unless an identical one came earlier in the frame. The
 * renderers still get every event. A toaster wrapper drops a toast whose text was shown a
 * moment ago while time runs fast.
 */
import { FAST_TIME } from '../config/tuning-r8d-perf';
import type { SimEvent } from '../sim/types';

function subjectOf(e: SimEvent): string {
  const r = e as unknown as Record<string, unknown>;
  const id = r['nubbinId'] ?? r['id'];
  return typeof id === 'string' || typeof id === 'number' ? `${e.kind}#${id}` : JSON.stringify(e);
}

/** The frame's events with repeats per kind and subject dropped, first one kept, order kept. */
export function dedupeEvents(events: readonly SimEvent[]): SimEvent[] {
  const seen = new Set<string>();
  const out: SimEvent[] = [];
  for (const e of events) {
    const k = subjectOf(e);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
  }
  return out;
}

/**
 * Wrap a toaster: above ×1, a toast with the same text as one shown in the last
 * `FAST_TIME.toastDedupeMs` is dropped.
 */
export function dedupeToaster(
  inner: (text: string, ms?: number) => void,
  timeScale: () => number,
  now: () => number = () => performance.now(),
): (text: string, ms?: number) => void {
  const shown = new Map<string, number>();
  return (text, ms) => {
    if (timeScale() > 1) {
      const t = now();
      const last = shown.get(text);
      if (last !== undefined && t - last < FAST_TIME.toastDedupeMs) return;
      shown.set(text, t);
      if (shown.size > 64) {
        for (const [k, v] of shown) if (t - v >= FAST_TIME.toastDedupeMs) shown.delete(k);
      }
    }
    if (ms === undefined) inner(text);
    else inner(text, ms);
  };
}
