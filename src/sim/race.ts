import { RACE } from '../config/tuning';
import { Rng } from './rng';
import { levelOf } from './stats';
import type { Nubbin, StatKey } from './types';
import { STAT_KEYS } from './types';

/**
 * Races: a course is a list of sections, each checking one stat. Racers move along a
 * one-dimensional track; stamina drains with effort and runs dry into a short rest.
 * Pure and seeded so results are testable; the screen only draws it.
 */
export type SectionKind = 'swim' | 'fly' | 'run' | 'climb' | 'stretch';

export interface Section {
  kind: SectionKind;
  length: number;
}

export interface Course {
  id: string;
  sections: Section[];
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
  }
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
}

export interface RaceState {
  course: Course;
  tier: number;
  length: number;
  timeMs: number;
  racers: Racer[];
  cheerUntilMs: number;
  cheerReadyAtMs: number;
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

export function createRace(course: Course, tier: number, player: Nubbin, seed: number): RaceState {
  const rng = Rng.fromSeed(seed);
  const t = Math.max(0, Math.min(2, tier - 1));
  const [minRivals, maxRivals] = RACE.rivals[t]!;
  const [minLvl, maxLvl] = RACE.rivalLevels[t]!;
  const playerLevels = levelsOf(player);
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
    },
  ];
  const count = rng.int(minRivals, maxRivals);
  const names = [...RIVAL_NAMES];
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
    });
  }
  return {
    course,
    tier,
    length: courseLength(course),
    timeMs: 0,
    racers,
    cheerUntilMs: -1,
    cheerReadyAtMs: 0,
    finished: false,
    placements: [],
  };
}

/** The cheer button: a small boost for the player, at most once every 3 s. */
export function cheer(race: RaceState): boolean {
  if (race.finished || race.timeMs < race.cheerReadyAtMs) return false;
  race.cheerUntilMs = race.timeMs + RACE.cheerMs;
  race.cheerReadyAtMs = race.timeMs + RACE.cheerCooldownMs;
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
    const { section } = sectionAt(race.course, r.pos);
    const stat = statFor(section.kind);
    const level = r.levels[stat];
    let speed = RACE.baseSpeed + (RACE.statSpeedBonus * level) / 99;
    if (r.isPlayer && race.timeMs < race.cheerUntilMs) speed *= RACE.cheerBoost;
    r.pos += speed * dt;
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

/** Shells for a placement at a tier; only the top three pay. */
export function prizeFor(placement: number, tier: number): number {
  const base = RACE.prizes[placement - 1];
  return base ? base * tier : 0;
}
