/**
 * R0688 (KIDS-20): the Learning Grove's Fun Run. One short course (swim, run, fly) on the
 * race sim, with three friendly rivals: the child's other Nubbins first, then Fern's. It is
 * `friendly`: no prize tiers, no placings shown, nothing unlocked; everyone gets a ribbon.
 * Pure and seeded; `RaceScreen` draws it and the HUD sends `funRunDone` when it ends.
 */
import { FUN_RUN } from '../config/tuning-kids';
import { FUN_RUN_TEXT } from '../config/strings-kid-games';
import { hashSeed, Rng } from './rng';
import { courseLength, createRace, statFor, type Course, type RaceState, type Racer } from './race';
import { levelOf } from './stats';
import type { Nubbin, StatKey, World } from './types';
import { STAT_KEYS } from './types';

export const FUN_RUN_COURSE: Course = {
  id: 'funrun',
  sections: FUN_RUN.sections.map((s) => ({ ...s })),
};

function levelsOf(n: Nubbin): Record<StatKey, number> {
  const out = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) out[k] = levelOf(n.stats[k].points);
  return out;
}

/** The Nubbins that can run beside the runner: hatched, not the runner, not a cocoon. */
export function funRunRivals(world: World, runner: Nubbin): Nubbin[] {
  return world.nubbins
    .filter((n) => n.id !== runner.id && n.stage !== 'egg' && n.stage !== 'cocoon')
    .slice(0, FUN_RUN.rivals);
}

/** A friendly race: the runner and three rivals with levels close to the runner's. */
export function createFunRun(world: World, runner: Nubbin, seed: number): RaceState {
  const base = createRace(FUN_RUN_COURSE, 1, runner, seed);
  const me = base.racers.find((r) => r.isPlayer)!;
  const rng = Rng.fromSeed(hashSeed(`funrun:${seed}`));
  const own = funRunRivals(world, runner);
  const rivals: Racer[] = [];
  let fern = 0;
  for (let i = 0; i < FUN_RUN.rivals; i++) {
    const n = own[i];
    const levels = {} as Record<StatKey, number>;
    for (const k of STAT_KEYS) {
      const near = me.levels[k] + rng.int(-FUN_RUN.rivalSpread, FUN_RUN.rivalSpread);
      levels[k] = Math.max(0, Math.min(99, near));
    }
    const stamina = me.staminaMax;
    rivals.push({
      ...me,
      id: n ? `own-${n.id}` : `fern-${i + 1}`,
      name: n ? n.name : (FUN_RUN.fernNames[fern++] ?? `Fern ${i + 1}`),
      levels: n ? blend(levelsOf(n), levels) : levels,
      stamina,
      staminaMax: stamina,
      isPlayer: false,
      look: n
        ? { band: n.form?.band ?? 'neutral', type: n.form?.type ?? 'normal' }
        : { band: 'neutral', type: 'normal' },
    });
  }
  // Only the runner gazes at butterflies; the rivals just run.
  for (const r of rivals) {
    delete r.gazeAt;
    delete r.gazeUntilMs;
    delete r.gazes;
  }
  return { ...base, racers: [me, ...rivals], friendly: true, length: courseLength(base.course) };
}

/** An own Nubbin keeps its own stats, pulled halfway toward a close match so nobody runs away. */
function blend(
  own: Record<StatKey, number>,
  close: Record<StatKey, number>,
): Record<StatKey, number> {
  const out = {} as Record<StatKey, number>;
  for (const k of STAT_KEYS) out[k] = Math.round((own[k] + close[k]) / 2);
  return out;
}

/** The runner's weakest stat on this course: the one a tip should name. */
export function weakestOnCourse(race: RaceState): StatKey | null {
  const me = race.racers.find((r) => r.isPlayer);
  if (!me) return null;
  const used = new Set(race.course.sections.map((s) => statFor(s.kind)));
  let weakest: StatKey | null = null;
  for (const k of STAT_KEYS) {
    if (!used.has(k)) continue;
    if (weakest === null || me.levels[k] < me.levels[weakest]) weakest = k;
  }
  return weakest;
}

/** The spoken tip at the end: "Swimming more will make Nono faster in water." */
export function funRunTip(race: RaceState): string {
  const me = race.racers.find((r) => r.isPlayer);
  const k = weakestOnCourse(race);
  if (!me || !k) return FUN_RUN_TEXT.tipNone(me?.name ?? 'Your Nubbin');
  const stat = FUN_RUN_TEXT.tipStat[k as keyof typeof FUN_RUN_TEXT.tipStat];
  const where = FUN_RUN_TEXT.tipWhere[k as keyof typeof FUN_RUN_TEXT.tipWhere];
  return stat && where ? FUN_RUN_TEXT.tip(me.name, stat, where) : FUN_RUN_TEXT.tipNone(me.name);
}

/** The ribbon: every finished Fun Run earns one, whoever came first. Nothing else changes. */
export function funRunDone(world: World, nubbinId: string): void {
  const e = world.edu;
  if (!e || !world.nubbins.some((n) => n.id === nubbinId)) return;
  e.ribbons = (e.ribbons ?? 0) + 1;
}
