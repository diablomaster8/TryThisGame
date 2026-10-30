/**
 * Skipped story bouts (recs FIGHT-71). With Settings → Bouts on "Skip story bouts", a story's
 * required bout is resolved at once instead of on the battle screen: Keeper-level AI plays both
 * sides, the Keeper's side favoured by a fifth (HP, Bonk, Splash and Guard), and whatever
 * happens the bout is recorded as won, so the story's counters move on. It pays half the base
 * prize. Only story bouts can be skipped: the Circuit's ribbons are optional and are earned.
 *
 * Deterministic like any bout: seeded from the world as the played bout would be, with the
 * Keeper side's picks from a second generator derived from that seed.
 */
import { BATTLE_R5 } from '../../config/tuning-battle-r5';
import { Rng } from '../rng';
import type { SimEvent, World } from '../types';
import { bestAllyAction, chooseAction } from './ai';
import { battleAct, createBattle } from './core';
import { battleSeedFor, grantRewards } from './rewards';
import type { BattleContext, BattleState } from './types';

/** Whether `context` may be skipped at all (the setting is checked by the command). */
export const skippable = (context: BattleContext): boolean => context.kind === 'story';

/**
 * Resolves a story bout without a screen and pays it. Returns the finished bout (also left in
 * `world.battle`, as a played one would be), or null when the context can't be skipped or the
 * bout can't start (nobody hatched).
 */
export function autoResolve(
  world: World,
  context: BattleContext,
  events: SimEvent[] = [],
): BattleState | null {
  if (context.kind !== 'story') return null;
  // Singles, turn-based, no override: the plain story bout.
  const ctx: BattleContext = {
    kind: 'story',
    storyline: context.storyline,
    tier: context.tier,
    ids: context.ids,
    auto: true,
  };
  const s = createBattle(world, ctx, battleSeedFor(world, ctx));
  if (!s) return null;
  const f = BATTLE_R5.autoFavour;
  for (const c of s.sides[0]) {
    c.maxHp = Math.round(c.maxHp * f);
    c.hp = Math.round(c.hp * f);
    c.bonk = Math.round(c.bonk * f);
    c.splash = Math.round(c.splash * f);
    c.def = Math.round(c.def * f);
  }
  s.ai = 'keeper';
  delete s.gentle;
  const picks = Rng.fromSeed((s.seed ^ 0x5eed) >>> 0);
  for (let i = 0; i < BATTLE_R5.autoMaxActions && !s.result; i++) {
    const me = s.sides[0][s.active];
    const a =
      s.phase === 'replace' || !me ? bestAllyAction(s) : chooseAction(s, me.id, 'keeper', picks);
    if (battleAct(s, a)) continue;
    if (battleAct(s, bestAllyAction(s))) continue;
    if (!battleAct(s, { k: 'guard' })) break;
  }
  // A skipped bout always counts as won for the story.
  if (s.result?.winner !== 0) {
    s.result = { winner: 0, reason: 'tuckered' };
    s.phase = 'done';
    s.log.push({ k: 'end', winner: 0, reason: 'tuckered' });
  }
  world.battleRuns = (world.battleRuns ?? 0) + 1;
  world.battle = s;
  events.push({ kind: 'battleStart', context: ctx.kind });
  grantRewards(world, s, events);
  return s;
}
