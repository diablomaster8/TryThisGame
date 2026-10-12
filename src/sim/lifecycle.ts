import { LIFECYCLE, TYPE_LEAN } from '../config/tuning';
import { bandOf, winningType } from './alignment';
import { levelOf, nextGrade } from './stats';
import type { GroveKind, Nubbin, NubbinType, SimEvent, StatKey, World } from './types';
import { NUBBIN_TYPES, STAT_KEYS } from './types';

/**
 * Stage timers: egg → child → cocoon → adult. Evolution picks the adult form from
 * alignment band and type lean, raises one grade, and unlocks the Sun or Moon Grove.
 * The second evolution settles an hour into adult life from the lean gained since.
 * The end-of-life check (M3) hooks in here later.
 */
export function advanceStage(n: Nubbin, dtMs: number, events: SimEvent[], world?: World): void {
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
    evolve(n, events, world);
    n.stageMs = carry;
  }
  if (
    n.stage === 'adult' &&
    n.form &&
    n.form.second === null &&
    n.stageMs >= LIFECYCLE.secondEvolutionMs
  ) {
    secondEvolve(n, events);
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

/** The highest-level stat that is not already S, or null. Ties go to the first in STAT_KEYS. */
export function upgradeCandidate(n: Nubbin): StatKey | null {
  let best: StatKey | null = null;
  let bestLevel = -1;
  for (const key of STAT_KEYS) {
    const s = n.stats[key];
    if (s.grade === 'S') continue;
    const lvl = levelOf(s.points);
    if (lvl > bestLevel) {
      bestLevel = lvl;
      best = key;
    }
  }
  return best;
}

export function evolve(n: Nubbin, events: SimEvent[], world?: World): void {
  const band = bandOf(n.alignment);
  const type = winningType(n.typeLean);
  n.form = { band, type, second: null, leanAtEvolution: { ...n.typeLean } };
  n.stage = 'adult';
  n.stageMs = 0;
  n.behavior.state = 'react';
  n.behavior.reaction = 'happy';
  n.behavior.untilMs = 0;

  // Permanent grade upgrade on the highest-level stat that is not already S.
  const upgraded = upgradeCandidate(n);
  if (upgraded) {
    n.stats[upgraded].grade = nextGrade(n.stats[upgraded].grade);
    n.gradeUpgrades[upgraded] = (n.gradeUpgrades[upgraded] ?? 0) + 1;
  }

  // The Sun and Moon Groves unlock the first time an adult of that band appears.
  let groveUnlocked: GroveKind | null = null;
  if (world) {
    if (band === 'sun' && !world.unlocks.sunGrove) {
      world.unlocks.sunGrove = true;
      groveUnlocked = 'sun';
    } else if (band === 'moon' && !world.unlocks.moonGrove) {
      world.unlocks.moonGrove = true;
      groveUnlocked = 'moon';
    }
  }
  events.push({ kind: 'evolved', nubbinId: n.id, band, type, upgraded, groveUnlocked });
}

/** The type trained most since evolution, if it grew enough. */
export function secondTypeFor(n: Nubbin): NubbinType | null {
  if (!n.form) return null;
  let best: NubbinType | null = null;
  let bestGain = TYPE_LEAN.secondMin - 1e-9;
  for (const type of NUBBIN_TYPES) {
    if (type === 'normal') continue;
    const gain = n.typeLean[type] - n.form.leanAtEvolution[type];
    if (gain > bestGain) {
      bestGain = gain;
      best = type;
    }
  }
  return best;
}

export function secondEvolve(n: Nubbin, events: SimEvent[]): void {
  if (!n.form) return;
  const second = secondTypeFor(n) ?? 'normal';
  n.form.second = second;
  events.push({ kind: 'secondEvolved', nubbinId: n.id, second });
}
