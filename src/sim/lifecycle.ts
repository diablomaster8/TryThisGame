import { LIFECYCLE } from '../config/tuning';
import { bandOf, winningType } from './alignment';
import type { Nubbin, SimEvent } from './types';

/**
 * Stage timers: egg → child → cocoon → adult. Evolution picks the adult form from
 * alignment band and type lean. The grade upgrade, Sun/Moon Grove unlocks (M2) and the
 * end-of-life check (M3) hook in here later.
 */
export function advanceStage(n: Nubbin, dtMs: number, events: SimEvent[]): void {
  n.stageMs += dtMs;
  if (n.stage === 'egg') return; // hatching is driven by hatchRemainingMs in world.ts
  n.ageMs += dtMs;

  if (n.stage === 'child' && n.stageMs >= LIFECYCLE.childMs) {
    n.stage = 'cocoon';
    n.stageMs -= LIFECYCLE.childMs;
    n.behavior.state = 'sit';
    n.behavior.target = null;
    n.behavior.itemId = null;
  }
  if (n.stage === 'cocoon' && n.stageMs >= LIFECYCLE.cocoonMs) {
    const carry = n.stageMs - LIFECYCLE.cocoonMs;
    evolve(n, events);
    n.stageMs = carry;
  }
  // Adults accumulate stageMs; the end-of-life check arrives in M3.
}

export function hatch(n: Nubbin, events: SimEvent[]): void {
  n.stage = 'child';
  n.stageMs = 0;
  n.hatchRemainingMs = 0;
  n.behavior.state = 'react';
  n.behavior.reaction = 'happy';
  n.behavior.untilMs = 0;
  events.push({ kind: 'hatched', nubbinId: n.id });
}

export function evolve(n: Nubbin, events: SimEvent[]): void {
  const band = bandOf(n.alignment);
  const type = winningType(n.typeLean);
  n.form = { band, type };
  n.stage = 'adult';
  n.stageMs = 0;
  n.behavior.state = 'react';
  n.behavior.reaction = 'happy';
  n.behavior.untilMs = 0;
  events.push({ kind: 'evolved', nubbinId: n.id, band, type });
}
