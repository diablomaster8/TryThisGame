import { BATTLE_R6 } from '../../config/tuning-battle-r6';
import type { Nubbin, SimEvent, World } from '../types';
import type { BattleContext, BattleState } from './types';

/**
 * The Dojo Ladder (recs FIGHT-99): five belts, white to black, each a ladder of three singles
 * bouts against a sharper rival each time. A loss sends the Nubbin back to the ladder's first
 * bout. The record lives on the Nubbin's `karateRecord` (the field kept for karate's future),
 * which a rebirth leaves alone, so belts outlive a life. The black belt grants its hat once
 * and, for a Nubbin with an S grade, refreshes its moody trait.
 */
const L = BATTLE_R6.ladder;

export interface LadderRecord {
  /** Each belt won, in order: the ladder belt is the list's length. */
  beltHistory: { belt: number; atMs: number }[];
  /** Bouts won on the current belt's ladder. */
  step: number;
}

export function ladderOf(n: Nubbin): LadderRecord {
  const r = n.karateRecord as Partial<LadderRecord>;
  return {
    beltHistory: Array.isArray(r.beltHistory) ? r.beltHistory : [],
    step: typeof r.step === 'number' ? r.step : 0,
  };
}

export const ladderBelt = (n: Nubbin): number => Math.min(L.belts, ladderOf(n).beltHistory.length);

/** The next ladder bout for `n`, or null once it has the black belt. */
export function ladderContext(n: Nubbin): Extract<BattleContext, { kind: 'dojo' }> | null {
  const belt = ladderBelt(n) + 1;
  if (belt > L.belts) return null;
  return { kind: 'dojo', tier: ladderTier(belt), ids: [n.id], ladder: belt };
}

/** The prize table's tier for a belt: white 1, yellow and green 2, brown and black 3. */
export const ladderTier = (belt: number): number => Math.min(3, Math.ceil((belt * 3) / L.belts));

/** Whether a ladder context is the fighter's next one (refused otherwise). */
export function ladderValid(world: World, c: Extract<BattleContext, { kind: 'dojo' }>): boolean {
  const n = world.nubbins.find((x) => x.id === c.ids[0]);
  return !!n && c.ladder === ladderBelt(n) + 1 && c.tier === ladderTier(c.ladder);
}

/** The rival's level bump and AI for the fighter's current ladder bout. */
export function ladderRival(world: World, c: Extract<BattleContext, { kind: 'dojo' }>) {
  const n = world.nubbins.find((x) => x.id === c.ids[0]);
  const step = n ? Math.min(L.bouts - 1, ladderOf(n).step) : 0;
  const belt = c.ladder ?? 1;
  return {
    level: belt * L.levelPerBelt + step,
    ai: L.ai[Math.min(L.ai.length - 1, step + (belt >= 4 ? 1 : 0))]!,
  };
}

function save(n: Nubbin, r: LadderRecord): void {
  n.karateRecord = { ...n.karateRecord, beltHistory: r.beltHistory, step: r.step };
}

/** Pays a finished ladder bout: a win climbs a step (a belt after the third), a loss resets. */
export function ladderSettle(world: World, s: BattleState, events: SimEvent[]): void {
  const c = s.context;
  if (c.kind !== 'dojo' || !c.ladder || !s.result || s.result.reason === 'forfeit') return;
  const n = world.nubbins.find((x) => x.id === c.ids[0]);
  if (!n) return;
  const r = ladderOf(n);
  if (s.result.winner !== 0) {
    r.step = 0;
    save(n, r);
    return;
  }
  world.inventory.shells += L.prize[c.ladder - 1] ?? 0;
  r.step += 1;
  let beltWon = false;
  if (r.step >= L.bouts) {
    r.step = 0;
    r.beltHistory.push({ belt: c.ladder, atMs: world.timeMs });
    beltWon = true;
    if (c.ladder === L.belts) blackBelt(world, n);
  }
  save(n, r);
  events.push({ kind: 'ladderStep', nubbinId: n.id, belt: c.ladder, step: r.step, beltWon });
}

function blackBelt(world: World, n: Nubbin): void {
  if (!world.inventory.hats.includes(L.hat)) world.inventory.hats.push(L.hat);
  // The S-grade-only trait refresh: a Nubbin with an S grade sheds its moody trait.
  if (Object.values(n.stats).some((st) => st.grade === 'S')) n.moody = null;
}
