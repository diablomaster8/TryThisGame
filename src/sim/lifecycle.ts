import { BEHAVIOR, EGG, ETERNAL, LIFECYCLE, REBIRTH, TYPE_LEAN } from '../config/tuning';
import { bandOf, winningType } from './alignment';
import { lifetimeHappiness } from './needs';
import { levelOf, nextGrade } from './stats';
import type {
  AlignmentBand,
  CocoonKind,
  GroveKind,
  Nubbin,
  NubbinType,
  SimEvent,
  StatKey,
  World,
} from './types';
import { NUBBIN_TYPES, STAT_KEYS } from './types';

/**
 * Stage timers: egg → child → cocoon → adult → end-of-life check.
 *
 * Evolution picks the adult form from alignment band and type lean, raises one grade,
 * and unlocks the Sun or Moon Grove. The second evolution settles an hour into adult
 * life. After five hours an adult is either reborn (glowing cocoon → egg, keeping name,
 * 10 % of points, grade upgrades and affection) or departs (soft cocoon → memorial
 * flower). Eternals never age. While the player is away, departures only happen when
 * `allowOfflineDepartures` is on; otherwise the Nubbin waits for the Keeper.
 */
export function advanceStage(
  n: Nubbin,
  dtMs: number,
  events: SimEvent[],
  world?: World,
  offline = false,
): void {
  if (n.stage === 'egg') {
    n.stageMs += dtMs;
    return; // hatching is driven by hatchRemainingMs in world.ts
  }
  if (n.awaitingKeeper) {
    // Frozen at the end of its life until live play runs the check.
    if (!offline && world) runEndOfLife(n, world, false, events);
    return;
  }
  n.stageMs += dtMs;
  n.ageMs += dtMs;

  if (n.stage === 'child' && n.stageMs >= LIFECYCLE.childMs) {
    startCocoon(n, 'evolve', n.stageMs - LIFECYCLE.childMs, events);
  }
  if (n.stage === 'cocoon' && n.stageMs >= LIFECYCLE.cocoonMs) {
    const carry = n.stageMs - LIFECYCLE.cocoonMs;
    finishCocoon(n, events, world);
    n.stageMs = carry;
  }
  if (n.stage === 'adult' && n.form) {
    if (n.form.second === null && n.stageMs >= LIFECYCLE.secondEvolutionMs) {
      secondEvolve(n, events);
    }
    if (!n.eternal && n.stageMs >= LIFECYCLE.adultMs && world) {
      n.stageMs = LIFECYCLE.adultMs;
      runEndOfLife(n, world, offline, events);
    }
  }
}

function startCocoon(n: Nubbin, kind: CocoonKind, carryMs: number, events: SimEvent[]): void {
  n.stage = 'cocoon';
  n.cocoonKind = kind;
  n.stageMs = carryMs;
  n.behavior.state = 'sit';
  n.behavior.target = null;
  n.behavior.itemId = null;
  n.behavior.reaction = null;
  events.push({ kind: 'cocoonStarted', nubbinId: n.id, cocoon: kind });
}

function finishCocoon(n: Nubbin, events: SimEvent[], world?: World): void {
  const kind = n.cocoonKind ?? 'evolve';
  n.cocoonKind = null;
  switch (kind) {
    case 'evolve':
      evolve(n, events, world);
      return;
    case 'rebirth':
      rebirth(n, events);
      return;
    case 'depart':
      depart(n, events, world);
      return;
  }
}

/** The end-of-life check. Rebirth when loved; otherwise a departure (or a wait). */
export function runEndOfLife(n: Nubbin, world: World, offline: boolean, events: SimEvent[]): void {
  const loved =
    lifetimeHappiness(n) >= REBIRTH.minLifetimeHappiness &&
    n.needs.affection >= REBIRTH.minAffection;
  if (loved) {
    n.awaitingKeeper = false;
    startCocoon(n, 'rebirth', 0, events);
    return;
  }
  if (offline && !world.settings.offlineAging.allowOfflineDepartures) {
    if (!n.awaitingKeeper) {
      n.awaitingKeeper = true;
      events.push({ kind: 'awaitingKeeper', nubbinId: n.id });
    }
    return;
  }
  n.awaitingKeeper = false;
  startCocoon(n, 'depart', 0, events);
}

export function hatch(n: Nubbin, events: SimEvent[], nowMs = 0): void {
  n.stage = 'child';
  n.stageMs = 0;
  n.hatchRemainingMs = 0;
  n.behavior.state = 'react';
  n.behavior.sinceMs = nowMs;
  // A reborn Nubbin greets the Keeper with a heart; a new one is simply happy.
  n.behavior.reaction = n.rebirths > 0 ? 'love' : 'happy';
  n.behavior.untilMs = nowMs + BEHAVIOR.reactMs * 2;
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

/** Eternal: reborn at least twice, evolving as Normal with a strong (or exactly balanced) alignment. */
export function eternalBandFor(n: Nubbin, type: NubbinType): AlignmentBand | null {
  if (n.rebirths < ETERNAL.minRebirths || type !== 'normal') return null;
  if (n.alignment > ETERNAL.sunThreshold) return 'sun';
  if (n.alignment < ETERNAL.moonThreshold) return 'moon';
  if (Math.abs(n.alignment) <= ETERNAL.neutralBand) return 'neutral';
  return null;
}

export function evolve(n: Nubbin, events: SimEvent[], world?: World): void {
  const band = bandOf(n.alignment);
  const type = winningType(n.typeLean);
  n.form = { band, type, second: null, leanAtEvolution: { ...n.typeLean } };
  n.stage = 'adult';
  n.stageMs = 0;
  n.cocoonKind = null;
  n.behavior.state = 'react';
  n.behavior.reaction = 'happy';
  n.behavior.sinceMs = world?.timeMs ?? 0;
  n.behavior.untilMs = (world?.timeMs ?? 0) + BEHAVIOR.reactMs * 2;

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

  const eternal = eternalBandFor(n, type);
  if (eternal) {
    n.eternal = eternal;
    events.push({ kind: 'eternal', nubbinId: n.id, band: eternal });
  }
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

/** Back to an egg: same name, 10 % of points, grades and affection kept, rebirths +1. */
export function rebirth(n: Nubbin, events: SimEvent[]): void {
  n.rebirths += 1;
  n.stage = 'egg';
  n.stageMs = 0;
  n.ageMs = 0;
  n.cocoonKind = null;
  n.hatchRemainingMs = EGG.hatchMs;
  n.form = null;
  n.parts = { ears: null, tail: null, arms: null, back: null };
  n.typeLean = { normal: 0, swim: 0, fly: 0, run: 0, power: 0 };
  for (const key of STAT_KEYS) {
    n.stats[key].points = Math.floor(n.stats[key].points * REBIRTH.keepPointsFraction);
  }
  n.needs.hunger = 1;
  n.needs.energy = 1;
  n.needs.happiness = Math.max(n.needs.happiness, 20);
  n.happinessSum = 0;
  n.happinessSamples = 0;
  n.behavior.state = 'sit';
  n.behavior.target = null;
  n.behavior.itemId = null;
  n.behavior.reaction = null;
  n.y = 0;
  n.vel = { x: 0, y: 0, z: 0 };
  events.push({ kind: 'reborn', nubbinId: n.id });
}

/** Moves on for good, leaving a memorial flower where it stood. */
export function depart(n: Nubbin, events: SimEvent[], world?: World): void {
  if (world) {
    world.nubbins = world.nubbins.filter((x) => x.id !== n.id);
    world.memorials.push({ id: `memorial-${n.id}`, name: n.name, pos: { x: n.pos.x, z: n.pos.z } });
    if (world.selected === n.id) world.selected = null;
    if (world.keeper.carrying === n.id) world.keeper.carrying = null;
  }
  events.push({ kind: 'departed', nubbinId: n.id, name: n.name });
}
