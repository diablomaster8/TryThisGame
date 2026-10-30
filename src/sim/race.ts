import { RACE } from '../config/tuning';
import { HURDLES } from '../config/tuning-move-race';
import { RACE_GAGS } from '../config/tuning-fun';
import { hashSeed, Rng } from './rng';
import { levelOf } from './stats';
import type { Nubbin, StatKey, World } from './types';
import { STAT_KEYS } from './types';

/**
 * Races: a course is a list of sections, each checking one stat. Racers move along a
 * one-dimensional track; stamina drains with effort and runs dry into a short rest.
 * Pure and seeded so results are testable; the screen only draws it.
 */
export type SectionKind = 'swim' | 'fly' | 'run' | 'climb' | 'stretch' | 'hurdles';

export interface Section {
  kind: SectionKind;
  length: number;
}

export interface Course {
  id: string;
  sections: Section[];
  /** A different section list for a tier (tier 2 and 3 courses may swap in hurdles). */
  tierSections?: Partial<Record<number, Section[]>>;
}

export const COURSES: readonly Course[] = [
  {
    id: 'meadow',
    sections: [
      { kind: 'run', length: 14 },
      { kind: 'swim', length: 8 },
      { kind: 'run', length: 8 },
      { kind: 'fly', length: 6 },
      { kind: 'stretch', length: 10 },
    ],
    tierSections: {
      2: [
        { kind: 'run', length: 14 },
        { kind: 'swim', length: 8 },
        { kind: 'hurdles', length: 8 },
        { kind: 'fly', length: 6 },
        { kind: 'stretch', length: 10 },
      ],
    },
  },
  {
    id: 'cliffs',
    sections: [
      { kind: 'run', length: 8 },
      { kind: 'climb', length: 8 },
      { kind: 'fly', length: 8 },
      { kind: 'climb', length: 6 },
      { kind: 'stretch', length: 8 },
      { kind: 'run', length: 8 },
    ],
    tierSections: {
      3: [
        { kind: 'run', length: 8 },
        { kind: 'climb', length: 8 },
        { kind: 'fly', length: 8 },
        { kind: 'climb', length: 6 },
        { kind: 'stretch', length: 8 },
        { kind: 'hurdles', length: 8 },
      ],
    },
  },
  {
    id: 'lagoon',
    sections: [
      { kind: 'swim', length: 12 },
      { kind: 'fly', length: 8 },
      { kind: 'swim', length: 10 },
      { kind: 'run', length: 6 },
      { kind: 'stretch', length: 12 },
    ],
  },
];

export function courseById(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function courseLength(course: Course): number {
  return course.sections.reduce((a, s) => a + s.length, 0);
}

/** The stat a section checks. */
export function statFor(kind: SectionKind): StatKey {
  switch (kind) {
    case 'swim':
      return 'swim';
    case 'fly':
      return 'fly';
    case 'run':
      return 'run';
    case 'climb':
      return 'power';
    case 'stretch':
      return 'stamina';
    case 'hurdles':
      return 'run';
  }
}

/** The skill a racer brings to a hurdles section: run and fly blended. */
export function hurdleSkill(levels: Record<StatKey, number>): number {
  return levels.run * HURDLES.runShare + levels.fly * HURDLES.flyShare;
}

/** Chance of a clean jump at a hurdle for a racer with these levels. */
export function hurdleCleanChance(levels: Record<StatKey, number>): number {
  return Math.min(HURDLES.maxClean, HURDLES.baseClean + HURDLES.perSkill * hurdleSkill(levels));
}

/** Track positions of every hurdle on a course, in order. */
export function hurdlePositions(course: Course): number[] {
  const out: number[] = [];
  let start = 0;
  for (const s of course.sections) {
    if (s.kind === 'hurdles') {
      const n = Math.max(1, Math.floor(s.length / HURDLES.spacing));
      for (let i = 0; i < n; i++) out.push(start + ((i + 0.5) * s.length) / n);
    }
    start += s.length;
  }
  return out;
}

export function sectionAt(
  course: Course,
  pos: number,
): { section: Section; index: number; start: number } {
  let start = 0;
  for (let i = 0; i < course.sections.length; i++) {
    const s = course.sections[i]!;
    if (pos < start + s.length) return { section: s, index: i, start };
    start += s.length;
  }
  const last = course.sections.length - 1;
  return {
    section: course.sections[last]!,
    index: last,
    start: start - course.sections[last]!.length,
  };
}

export interface Racer {
  id: string;
  name: string;
  /** Stat levels 0..99. */
  levels: Record<StatKey, number>;
  pos: number;
  stamina: number;
  staminaMax: number;
  restMs: number;
  finishedAtMs: number | null;
  /** Visual hints for the screen. */
  look: { band: 'sun' | 'moon' | 'neutral'; type: StatKey | 'normal' };
  isPlayer: boolean;
  /** Hurdles: how many are behind this racer, how many it cleared, and the stumble clock. */
  hurdleNext: number;
  hurdlesCleared: number;
  stumbleMs: number;
  /** The race time until which the dizzy emote shows (-1: none). */
  dizzyUntilMs: number;
  /**
   * R0325 (FUN-36): a happy Nubbin may stop to look at a butterfly: the track positions it
   * will, until when it is gazing now, how often it did, and a cheer's "!" that snaps it out.
   * A rival's quirk (an index into the quirk lines).
   */
  gazeAt?: number[];
  gazeUntilMs?: number;
  gazes?: number;
  perkUntilMs?: number;
  quirk?: number;
}

export interface RaceState {
  course: Course;
  tier: number;
  length: number;
  timeMs: number;
  racers: Racer[];
  cheerUntilMs: number;
  cheerReadyAtMs: number;
  /** When the player last cheered (-1: never), for the hurdle timing bonus. */
  lastCheerMs: number;
  /** Track positions of the course's hurdles, and the roll that decides each jump. */
  hurdles: number[];
  hurdleRng: Rng;
  finished: boolean;
  /** Final placements by racer id once finished. */
  placements: string[];
}

function levelsOf(n: Nubbin): Record<StatKey, number> {
  const out = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) out[k] = levelOf(n.stats[k].points);
  return out;
}

function staminaPool(levels: Record<StatKey, number>): number {
  return RACE.staminaBase + (RACE.staminaBonus * levels.stamina) / 99;
}

const RIVAL_NAMES = [
  'Zip',
  'Mochi',
  'Bramble',
  'Pip',
  'Sorrel',
  'Nib',
  'Tansy',
  'Flick',
  'Dot',
  'Clover',
];

export function createRace(
  course: Course,
  tier: number,
  player: Nubbin,
  seed: number,
  levelsOverride?: Record<StatKey, number>,
  /** Names the rivals must not take: the player's own Nubbins (the runner's is always left out). */
  taken: readonly string[] = [],
): RaceState {
  const rng = Rng.fromSeed(seed);
  const t = Math.max(0, Math.min(2, tier - 1));
  const [minRivals, maxRivals] = RACE.rivals[t]!;
  const [minLvl, maxLvl] = RACE.rivalLevels[t]!;
  const playerLevels = levelsOverride ?? levelsOf(player);
  const racers: Racer[] = [
    {
      id: player.id,
      name: player.name,
      levels: playerLevels,
      pos: 0,
      stamina: staminaPool(playerLevels),
      staminaMax: staminaPool(playerLevels),
      restMs: 0,
      finishedAtMs: null,
      look: { band: player.form?.band ?? 'neutral', type: player.form?.type ?? 'normal' },
      isPlayer: true,
      hurdleNext: 0,
      hurdlesCleared: 0,
      stumbleMs: 0,
      dizzyUntilMs: -1,
      gazeAt: butterflyStops(course, tier, player.needs.happiness, seed),
      gazeUntilMs: -1,
      gazes: 0,
    },
  ];
  // R0325: the rivals' quirks come from their own dice, so the stat rolls are as before.
  const quirks = Rng.fromSeed(hashSeed(`quirks:${seed}`));
  const count = rng.int(minRivals, maxRivals);
  // A rival never shares a name with one of the Keeper's own Nubbins (two racers called Pip).
  const avoid = new Set([player.name, ...taken].map((s) => s.trim().toLowerCase()));
  const names = RIVAL_NAMES.filter((s) => !avoid.has(s.toLowerCase()));
  for (let i = 0; i < count; i++) {
    const levels = {} as Record<StatKey, number>;
    const favourite = rng.pick(STAT_KEYS);
    for (const k of STAT_KEYS) {
      levels[k] = rng.int(minLvl, maxLvl) + (k === favourite ? rng.int(5, 15) : 0);
      levels[k] = Math.min(99, levels[k]);
    }
    const nameIndex = rng.int(0, names.length - 1);
    const name = names.splice(nameIndex, 1)[0] ?? `Rival ${i + 1}`;
    racers.push({
      id: `rival-${i + 1}`,
      name,
      levels,
      pos: 0,
      stamina: staminaPool(levels),
      staminaMax: staminaPool(levels),
      restMs: 0,
      finishedAtMs: null,
      look: {
        band: rng.pick(['sun', 'moon', 'neutral'] as const),
        type: favourite === 'stamina' ? 'normal' : favourite,
      },
      isPlayer: false,
      hurdleNext: 0,
      hurdlesCleared: 0,
      stumbleMs: 0,
      dizzyUntilMs: -1,
      quirk: quirks.int(0, RACE_GAGS.quirks - 1),
    });
  }
  const resolved: Course = { ...course, sections: course.tierSections?.[tier] ?? course.sections };
  return {
    course: resolved,
    tier,
    length: courseLength(resolved),
    timeMs: 0,
    racers,
    cheerUntilMs: -1,
    cheerReadyAtMs: 0,
    lastCheerMs: -1,
    hurdles: hurdlePositions(resolved),
    hurdleRng: Rng.fromSeed(hashSeed(`hurdles:${seed}`)),
    finished: false,
    placements: [],
  };
}

/** The cheer button: a small boost for the player, at most once every 3 s. */
export function cheer(race: RaceState): boolean {
  if (race.finished || race.timeMs < race.cheerReadyAtMs) return false;
  race.cheerUntilMs = race.timeMs + RACE.cheerMs;
  // R0325: a cheer snaps a gazing Nubbin out of it, with a "!".
  const me = race.racers.find((r) => r.isPlayer);
  if (me && (me.gazeUntilMs ?? -1) > race.timeMs) {
    me.gazeUntilMs = race.timeMs;
    me.perkUntilMs = race.timeMs + RACE_GAGS.perkMs;
  }
  race.cheerReadyAtMs = race.timeMs + RACE.cheerCooldownMs;
  race.lastCheerMs = race.timeMs;
  return true;
}

export function cheerReady(race: RaceState): boolean {
  return race.timeMs >= race.cheerReadyAtMs;
}

export function stepRace(race: RaceState, dtMs: number): void {
  if (race.finished) return;
  const dt = dtMs / 1000;
  race.timeMs += dtMs;
  for (const r of race.racers) {
    if (r.finishedAtMs !== null) continue;
    if (r.restMs > 0) {
      r.restMs -= dtMs;
      if (r.restMs <= 0) r.stamina = r.staminaMax * RACE.restRefill;
      continue;
    }
    if (r.stumbleMs > 0) {
      // A clipped fence: a short stall, no fall, and stamina holds.
      r.stumbleMs -= dtMs;
      continue;
    }
    // R0325: stopped to look at a butterfly.
    if ((r.gazeUntilMs ?? -1) > race.timeMs) continue;
    if (r.gazeAt && r.gazeAt.length > 0 && r.pos >= r.gazeAt[0]!) {
      r.gazeAt.shift();
      r.gazeUntilMs = race.timeMs + RACE_GAGS.gazeMs;
      r.gazes = (r.gazes ?? 0) + 1;
      continue;
    }
    const { section } = sectionAt(race.course, r.pos);
    const level =
      section.kind === 'hurdles' ? hurdleSkill(r.levels) : r.levels[statFor(section.kind)];
    let speed = RACE.baseSpeed + (RACE.statSpeedBonus * level) / 99;
    if (r.isPlayer && race.timeMs < race.cheerUntilMs) speed *= RACE.cheerBoost;
    const before = r.pos;
    r.pos += speed * dt;
    // Each hurdle passed this step is one timing roll; a cheer just before it is always clean.
    while (r.hurdleNext < race.hurdles.length && race.hurdles[r.hurdleNext]! <= r.pos) {
      const at = race.hurdles[r.hurdleNext]!;
      r.hurdleNext++;
      const crossMs = race.timeMs - (dtMs * (r.pos - at)) / Math.max(1e-9, r.pos - before);
      const cheered =
        r.isPlayer &&
        race.lastCheerMs >= 0 &&
        crossMs >= race.lastCheerMs &&
        crossMs - race.lastCheerMs <= HURDLES.cheerWindowMs;
      const roll = race.hurdleRng.next();
      if (cheered || roll < hurdleCleanChance(r.levels)) r.hurdlesCleared++;
      else {
        r.stumbleMs = HURDLES.stumbleMs;
        r.dizzyUntilMs = race.timeMs + HURDLES.dizzyMs;
      }
    }
    const drain = section.kind === 'stretch' ? RACE.stretchDrain : 1;
    r.stamina -= dt * drain;
    if (r.stamina <= 0) {
      r.stamina = 0;
      r.restMs = RACE.restMs;
    }
    if (r.pos >= race.length) {
      r.pos = race.length;
      r.finishedAtMs = race.timeMs;
    }
  }
  const allDone = race.racers.every((r) => r.finishedAtMs !== null);
  if (allDone || race.timeMs >= RACE.maxMs) {
    race.finished = true;
    race.placements = [...race.racers]
      .sort((a, b) => {
        const fa = a.finishedAtMs ?? Infinity;
        const fb = b.finishedAtMs ?? Infinity;
        if (fa !== fb) return fa - fb;
        return b.pos - a.pos;
      })
      .map((r) => r.id);
  }
}

export function playerPlacement(race: RaceState): number {
  const player = race.racers.find((r) => r.isPlayer);
  if (!player) return race.racers.length;
  return race.placements.indexOf(player.id) + 1;
}

/**
 * The seed for the next race on a course and tier, from the world's seed and how many races
 * it has recorded: quitting and starting again meets the same field, so a race cannot be
 * rerolled for a better draw (review C, item 28).
 */
export function raceSeedFor(world: World, courseId: string, tier: number): number {
  return hashSeed(`${world.seed}:${courseId}:${tier}:${world.raceRuns}`) % 2147483647;
}

/** Shells for a placement at a tier; only the top three pay. */
export function prizeFor(placement: number, tier: number): number {
  const base = RACE.prizes[placement - 1];
  return base ? base * tier : 0;
}

// Lane E, R0395: the tier-3 character-look prizes. The four shared looks, plus Quills for
// a Sun Keeper and Shade for a Moon Keeper (the two hero looks follow the Keeper's side).
const SHARED_LOOK_PRIZES = ['look-fox', 'look-echidna', 'look-rose', 'look-dream'] as const;

/** The looks a tier-3 win can pay, for the active Keeper. */
export function lookPrizesFor(keeper: 'sun' | 'moon'): readonly string[] {
  return [...SHARED_LOOK_PRIZES, keeper === 'sun' ? 'look-quills' : 'look-shade'];
}

/**
 * R0325 (FUN-36): where a happy Nubbin stops to look at a butterfly: above the happiness
 * line, a small chance at each section after the first, a little way into it. Its own dice
 * (from the race seed), so the race's other rolls are unchanged.
 */
export function butterflyStops(
  course: Course,
  tier: number,
  happiness: number,
  seed: number,
): number[] {
  if (happiness <= RACE_GAGS.happyOver) return [];
  const sections = course.tierSections?.[tier] ?? course.sections;
  const rng = Rng.fromSeed(hashSeed(`butterfly:${seed}`));
  const out: number[] = [];
  let at = 0;
  sections.forEach((s, i) => {
    if (i > 0 && rng.chance(RACE_GAGS.chance)) out.push(at + Math.min(3, s.length / 3));
    at += s.length;
  });
  return out;
}
