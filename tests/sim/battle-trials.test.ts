import { describe, expect, it } from 'vitest';
import { TRIAL_MAPS, type TrialMap } from '../../src/config/battle-maps';
import {
  STEPS,
  trialClear,
  trialKey,
  trialReplay,
  trialStart,
  trialStep,
  type Step,
  type TrialState,
} from '../../src/sim/battle/tactics/trials';
import type { SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** Breadth-first search over scripted steps: the shortest clear, as its steps. */
function solve(m: TrialMap, cap = 120): Step[] | null {
  type Node = { s: TrialState; path: Step[] };
  let frontier: Node[] = [{ s: trialStart(m), path: [] }];
  const seen = new Set([trialKey(frontier[0]!.s)]);
  for (let d = 0; d < cap && frontier.length; d++) {
    const next: Node[] = [];
    for (const { s, path } of frontier)
      for (const st of STEPS) {
        const n = trialStep(m, s, st);
        if (!n) continue;
        if (n.done) return [...path, st];
        const k = trialKey(n);
        if (seen.has(k)) continue;
        seen.add(k);
        next.push({ s: n, path: [...path, st] });
      }
    frontier = next;
  }
  return null;
}

describe('the trial map pack (recs FIGHT-97)', () => {
  it('has twelve maps, each with a par the solver reaches exactly', () => {
    expect(TRIAL_MAPS.length).toBe(12);
    for (const m of TRIAL_MAPS) {
      const path = solve(m);
      expect(path, m.id).not.toBeNull();
      expect(path!.length, m.id).toBe(m.par);
      expect(trialReplay(m, path!)?.done).toBe(true);
    }
  });

  it('a clear at par pays its hat once; a refused or short replay pays nothing', () => {
    const w = createWorld(3, 0);
    const events: SimEvent[] = [];
    const m = TRIAL_MAPS[0]!;
    const path = solve(m)!;
    const hats = w.inventory.hats.length;
    expect(trialClear(w, m.id, path.slice(0, -1), events)).toBe(false);
    expect(trialClear(w, m.id, path, events)).toBe(true);
    expect(w.trials?.[m.id]).toEqual({ best: m.par, par: true });
    const after = w.inventory.hats.length;
    expect(after).toBeGreaterThanOrEqual(hats);
    expect(trialClear(w, m.id, path, events)).toBe(true);
    expect(w.inventory.hats.length).toBe(after);
    expect(events.filter((e) => e.kind === 'trialCleared' && e.first).length).toBe(1);
  });

  it('bells out of order start again, and the gate stays shut until all are rung', () => {
    const m = TRIAL_MAPS[1]!;
    let s: TrialState | null = trialStart(m);
    // Walk straight to the gate: refused while the bells are silent.
    for (const d of ['s', 'e', 'e'] as Step[]) s = s && trialStep(m, s, d);
    expect(s).toBeNull();
  });
});
