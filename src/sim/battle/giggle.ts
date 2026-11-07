import { FRIENDLY_MATCH as F } from '../../config/tuning-friendly-match';
import { Rng } from '../rng';
import { levelOf } from '../stats';
import type { Nubbin, StatKey } from '../types';

/**
 * The Friendly Match (recs KIDS-79, R0747): the kid-safe skin of the turn engine for child
 * profiles. A trick is resolved from the same stats as the fight moves, the opponent giggles
 * instead of losing HP, and the match can only end in 'fun'. There is no defeat state and no
 * event with a defeat in its name: `matchResult` returns the one word, whatever happened.
 */
export type TrickId = 'splash' | 'twirl' | 'bigJump';

export const TRICKS: Readonly<Record<TrickId, StatKey>> = {
  splash: 'swim',
  twirl: 'fly',
  bigJump: 'run',
};

export type GiggleEvent =
  | { k: 'trick'; side: 0 | 1; trick: TrickId; fun: number; twist: boolean }
  | { k: 'giggle'; side: 0 | 1 }
  | { k: 'end'; reason: 'fullMeter' | 'turnsUp' };

export interface FriendlyMatch {
  friendly: true;
  rng: Rng;
  /** Fun points on each side's meter: side 0 is the child's Nubbin. */
  fun: [number, number];
  /** Stat levels used for each side. */
  levels: [Record<StatKey, number>, Record<StatKey, number>];
  round: number;
  done: boolean;
  log: GiggleEvent[];
}

function levelsOf(n: Pick<Nubbin, 'stats'>): Record<StatKey, number> {
  return {
    swim: levelOf(n.stats.swim.points),
    fly: levelOf(n.stats.fly.points),
    run: levelOf(n.stats.run.points),
    power: levelOf(n.stats.power.points),
    stamina: levelOf(n.stats.stamina.points),
  };
}

export function startFriendlyMatch(
  child: Pick<Nubbin, 'stats'>,
  pal: Pick<Nubbin, 'stats'>,
  seed: number,
): FriendlyMatch {
  return {
    friendly: true,
    rng: Rng.fromSeed(seed),
    fun: [0, 0],
    levels: [levelsOf(child), levelsOf(pal)],
    round: 0,
    done: false,
    log: [],
  };
}

/** Fun points one trick earns: the stat's level lifts a base amount, the twist doubles it. */
export function trickFun(level: number, twist: boolean): number {
  const base = F.baseFun + level * F.perLevel;
  return Math.round(base * (twist ? F.twistMultiplier : 1));
}

/**
 * Plays one round: the child's trick, then the pal's. `twist` is whether the child answered
 * the optional learning twist; skipping it or missing it is a normal-power trick.
 */
export function playTrick(m: FriendlyMatch, trick: TrickId, twist = false): void {
  if (m.done) return;
  m.round += 1;
  const mine = trickFun(m.levels[0][TRICKS[trick]], twist);
  m.fun[1] = Math.min(F.funToFill, m.fun[1] + mine);
  m.log.push({ k: 'trick', side: 0, trick, fun: mine, twist });
  m.log.push({ k: 'giggle', side: 1 });
  const theirs = m.rng.pick(Object.keys(TRICKS) as TrickId[]);
  const back = trickFun(m.levels[1][TRICKS[theirs]], false) + m.rng.int(0, F.opponentFun);
  m.fun[0] = Math.min(F.funToFill, m.fun[0] + back);
  m.log.push({ k: 'trick', side: 1, trick: theirs, fun: back, twist: false });
  m.log.push({ k: 'giggle', side: 0 });
  if (m.fun[1] >= F.funToFill) finish(m, 'fullMeter');
  else if (m.round >= F.maxRounds) finish(m, 'turnsUp');
}

function finish(m: FriendlyMatch, reason: 'fullMeter' | 'turnsUp'): void {
  m.done = true;
  m.log.push({ k: 'end', reason });
}

/** There is only one way a Friendly Match ends. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function matchResult(_m: FriendlyMatch): 'fun' {
  return 'fun';
}
