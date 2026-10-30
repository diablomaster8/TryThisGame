import { BEHAVIOR, EGG, EGGSHELL, ETERNAL, LIFECYCLE, REBIRTH, TYPE_LEAN } from '../config/tuning';
import { eggshellColour, eggshellId } from '../config/cosmetics';
import { bandOf, roundAlignment, winningType } from './alignment';
import { lifetimeHappiness } from './needs';
import { decidePersonality, personalityCause } from './personality';
import { nextSpecies, speciesOf } from './species';
import { levelOf, nextGrade } from './stats';
import { lifespanMs, noteEvolutionSlips } from './slips';
import { beforeRebirth } from './inheritance';
import { evolvedThisLife } from './degeneration';
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
  if (n.shellMs !== undefined && world) tickEggshell(n, dtMs, world, offline);
  // The baby step above needs the child stage timer, which hatch() resets.
  if (n.awaitingKeeper) {
    // Frozen at the end of its life until live play runs the check, once the away screen
    // has closed and one at a time, so the player sees every cocoon.
    if (!offline && world && endOfLifeDue(world)) {
      events.push({ kind: 'endOfLifeFocus', nubbinId: n.id });
      runEndOfLife(n, world, false, events);
      world.endOfLife = { held: false, nextMs: world.timeMs + LIFECYCLE.awaitingStaggerMs };
    }
    return;
  }
  n.stageMs += dtMs;
  n.ageMs += dtMs;

  // Hatchlings of some lines grow into a second baby form a few minutes in.
  if (n.stage === 'child' && n.stageMs >= LIFECYCLE.babyGrowthMs) {
    const s = speciesOf(n.species);
    if (
      s.stage === 'baby' &&
      s.evolve?.kind === 'fixed' &&
      speciesOf(s.evolve.to).stage === 'baby'
    ) {
      n.species = s.evolve.to;
      events.push({ kind: 'speciesGrew', nubbinId: n.id, species: n.species });
    }
  }
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
    // Champions take their final form later in adult life.
    if (n.stageMs >= LIFECYCLE.thirdEvolutionMs) {
      const s = speciesOf(n.species);
      if (s.stage === 'champion' && s.evolve) {
        const next = nextSpecies(s, n.form.type, n.form.band, lifetimeHappiness(n));
        if (next && next !== n.species) {
          n.species = next;
          events.push({ kind: 'speciesGrew', nubbinId: n.id, species: n.species });
        }
      }
    }
    if (!n.eternal && n.stageMs >= lifespanMs(n) && world) {
      n.stageMs = lifespanMs(n);
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
    case 'evolve': {
      const wasChild = n.form === null;
      // A Nubbin that reverted to an egg (Dawn & Dusk) had its upgrades already this life.
      const again = evolvedThisLife(n);
      const upgraded = evolve(n, events, world);
      if (wasChild && noteEvolutionSlips(n) === 'wellRaised' && !again) {
        // Well raised: a second stat steps up a grade too, never the one evolution just
        // raised (evolution picks by level, so a tie can make that one not the top by points).
        const sorted = [...STAT_KEYS].sort((a, b) => n.stats[b].points - n.stats[a].points);
        const second = sorted.find((k) => k !== upgraded && n.stats[k].grade !== 'S');
        if (second) {
          n.stats[second].grade = nextGrade(n.stats[second].grade);
          // Recorded like the evolution upgrade, so rebirth keeps it.
          n.gradeUpgrades[second] = (n.gradeUpgrades[second] ?? 0) + 1;
        }
        events.push({ kind: 'wellRaised', nubbinId: n.id });
      }
      return;
    }
    case 'rebirth':
      rebirth(n, events);
      return;
    case 'depart':
      depart(n, events, world);
      return;
  }
}

/** Whether a waiting Nubbin's check may run now: not held, and the last one has had its moment. */
export function endOfLifeDue(world: World): boolean {
  const s = world.endOfLife;
  return !s || (!s.held && world.timeMs >= s.nextMs);
}

/** The away screen opened (hold) or closed (release); see `World.endOfLife`. */
export function holdEndOfLife(world: World, hold: boolean): void {
  // On release the first check waits a beat, so the screen has closed before a cocoon forms.
  const nextMs = hold
    ? (world.endOfLife?.nextMs ?? 0)
    : Math.max(world.endOfLife?.nextMs ?? 0, world.timeMs + LIFECYCLE.awaitingAfterReleaseMs);
  world.endOfLife = { held: hold, nextMs };
}

/** The end-of-life check. Rebirth when loved; otherwise a departure (or a wait). */
export function runEndOfLife(n: Nubbin, world: World, offline: boolean, events: SimEvent[]): void {
  // While the away screen is up, a check that comes due waits like one from catch-up.
  if (!offline && world.endOfLife?.held) {
    if (!n.awaitingKeeper) {
      n.awaitingKeeper = true;
      events.push({ kind: 'awaitingKeeper', nubbinId: n.id });
    }
    return;
  }
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
  if (n.rebirths === 0) {
    n.needs.hunger = EGG.hatchHunger;
    n.needs.energy = EGG.hatchEnergy;
  }
  n.behavior.state = 'react';
  n.behavior.sinceMs = nowMs;
  // A reborn Nubbin greets the Keeper with a heart; a new one is simply happy.
  n.behavior.reaction = n.rebirths > 0 ? 'love' : 'happy';
  n.behavior.untilMs = nowMs + BEHAVIOR.reactMs * 2;
  // Lane E, R0394: a Grove-line hatchling wears the top of its eggshell as a hat.
  if (n.species === 'chao' && !n.hat) {
    n.hat = eggshellId(n.eggColor);
    n.shellMs = EGGSHELL.wearMs;
  }
  events.push({ kind: 'hatched', nubbinId: n.id });
}

/**
 * Lane E, R0394: put a hatchling's eggshell in the hat box, so the Roster lists it. Live
 * hatching calls this at once (`world.ts`); a shell from any other hatch goes in when it
 * comes off.
 */
export function keepEggshell(n: Nubbin, world: World): void {
  const shell = n.hat && eggshellColour(n.hat) !== null ? n.hat : null;
  if (shell && n.shellMs !== undefined && !world.inventory.hats.includes(shell))
    world.inventory.hats.push(shell);
}

/**
 * Lane E, R0394: the eggshell comes off the head after `EGGSHELL.wearMs` of live play and
 * stays in the hat box. Catch-up never counts down: the player should see it.
 */
function tickEggshell(n: Nubbin, dtMs: number, world: World, offline: boolean): void {
  const shell = n.hat && eggshellColour(n.hat) !== null ? n.hat : null;
  if (!shell) {
    delete n.shellMs;
    return;
  }
  // Only a child wears its shell: a story Nubbin hatched straight into an adult drops it.
  if (n.stage !== 'child') {
    n.hat = null;
    delete n.shellMs;
    return;
  }
  if (offline) return;
  n.shellMs = (n.shellMs ?? 0) - dtMs;
  if (n.shellMs > 0) return;
  keepEggshell(n, world);
  n.hat = null;
  delete n.shellMs;
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
  // Compared in hundredths: exactly 0.80 is not "above 0.8".
  const a = roundAlignment(n.alignment);
  if (a > ETERNAL.sunThreshold) return 'sun';
  if (a < ETERNAL.moonThreshold) return 'moon';
  if (Math.abs(a) <= ETERNAL.neutralBand) return 'neutral';
  return null;
}

/** Returns the stat whose grade went up, if any. */
export function evolve(n: Nubbin, events: SimEvent[], world?: World): StatKey | null {
  const band = bandOf(n.alignment);
  const type = winningType(n.typeLean);
  n.form = { band, type, second: null, leanAtEvolution: { ...n.typeLean } };
  // Personality locks in now, from how the child was treated.
  n.personality = decidePersonality(n.childCare);
  // Other families change species as they grow; the Chao line changes form only.
  const next = nextSpecies(speciesOf(n.species), type, band, lifetimeHappiness(n));
  if (next) n.species = next;
  n.stage = 'adult';
  n.stageMs = 0;
  n.cocoonKind = null;
  n.behavior.state = 'react';
  n.behavior.reaction = 'happy';
  n.behavior.sinceMs = world?.timeMs ?? 0;
  n.behavior.untilMs = (world?.timeMs ?? 0) + BEHAVIOR.reactMs * 2;

  // Permanent grade upgrade on the highest-level stat that is not already S, once a life:
  // a Nubbin that reverted to an egg and grows up again does not earn a second one.
  const upgraded = evolvedThisLife(n) ? null : upgradeCandidate(n);
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
  events.push({
    kind: 'evolved',
    nubbinId: n.id,
    band,
    type,
    upgraded,
    groveUnlocked,
    species: n.species,
  });

  // R0531: the moment the personality locks, and why.
  events.push({
    kind: 'personalityLocked',
    nubbinId: n.id,
    personality: n.personality,
    cause: personalityCause(n.childCare, n.personality),
  });

  const eternal = eternalBandFor(n, type);
  // Cleared when the rules are not met, so no older save keeps a stray Eternal flag.
  n.eternal = eternal;
  if (eternal) {
    events.push({ kind: 'eternal', nubbinId: n.id, band: eternal });
  }
  return upgraded;
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
  // A grown species takes its next form now (e.g. the mouse line's third stage).
  const s = speciesOf(n.species);
  if (s.stage === 'grown' && s.evolve) {
    const next = nextSpecies(
      s,
      second === 'normal' ? n.form.type : second,
      n.form.band,
      lifetimeHappiness(n),
    );
    if (next) n.species = next;
  }
  events.push({ kind: 'secondEvolved', nubbinId: n.id, second, species: n.species });
}

/** Back to an egg: same name, 10 % of points, grades and affection kept, rebirths +1. */
export function rebirth(n: Nubbin, events: SimEvent[]): void {
  const keep = beforeRebirth(n);
  n.rebirths += 1;
  // A new life: nothing left to restore, and evolution may upgrade a grade again.
  delete n.genes.degenerated;
  delete n.genes.evolvedThisLife;
  n.stage = 'egg';
  n.stageMs = 0;
  n.ageMs = 0;
  n.cocoonKind = null;
  n.hatchRemainingMs = EGG.hatchMs;
  n.form = null;
  n.species = n.lineage;
  if (!keep.keepParts) n.parts = { ears: null, tail: null, arms: null, back: null };
  if (!keep.keepLessons) n.lessons = {};
  if (!keep.keepAccessories) {
    n.hat = null;
    n.hatDye = null;
    n.scarf = null;
    n.glasses = false;
  }
  n.slips = [];
  n.slipCount = 0;
  n.moody = null;
  n.wellRaised = false;
  n.typeLean = { normal: 0, swim: 0, fly: 0, run: 0, power: 0 };
  n.personality = null;
  n.childCare = { pets: 0, throws: 0, feeds: 0 };
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

/** The form a memorial remembers: `eternal:<band>`, `<band>:<type>` or `child`. */
export function memorialForm(n: Nubbin): string {
  if (n.eternal) return `eternal:${n.eternal}`;
  if (n.form) return `${n.form.band}:${n.form.type}`;
  return 'child';
}

/** Moves on for good, leaving a memorial flower where it stood. */
export function depart(n: Nubbin, events: SimEvent[], world?: World): void {
  if (world) {
    world.nubbins = world.nubbins.filter((x) => x.id !== n.id);
    world.memorials.push({
      id: `memorial-${n.id}`,
      name: n.name,
      pos: { x: n.pos.x, z: n.pos.z },
      species: n.species,
      form: memorialForm(n),
      ageMs: n.ageMs,
      rebirths: n.rebirths,
      eggColor: n.eggColor,
      departedAtMs: world.timeMs,
    });
    if (world.selected === n.id) world.selected = null;
    if (world.keeper.carrying === n.id) world.keeper.carrying = null;
  }
  events.push({ kind: 'departed', nubbinId: n.id, name: n.name });
}
