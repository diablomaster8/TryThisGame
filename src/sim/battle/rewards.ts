import { foeName } from '../../config/strings-battle';
import { BATTLE } from '../../config/tuning-battle';
import { hashSeed } from '../rng';
import { addRecruit } from '../town';
import type { SimEvent, World } from '../types';
import { battleOf } from './moves-sources';
import type { BattleContext, BattleResult, BattleState } from './types';

/**
 * Seeds and prizes. A bout is seeded from the world (recs FIGHT-03), like races, so it can be
 * replayed from a save; the count goes up in the sim when a bout starts. Prizes come from the
 * tier tables in `tuning-battle.ts` (FIGHT-02), never from a number a screen sends; losing pays
 * a little or nothing and never costs Shells.
 */
export function contextKey(c: BattleContext): string {
  return c.kind === 'encounter'
    ? `encounter:${c.source}:${c.key}:${c.tier}`
    : `${c.kind}:${c.tier}`;
}

export function battleSeedFor(world: World, c: BattleContext): number {
  return hashSeed(`${world.seed}:${contextKey(c)}:${world.battleRuns ?? 0}`) % 2147483647;
}

const tierIx = (tier: number, len: number): number => Math.max(0, Math.min(len - 1, tier - 1));

export function karatePrize(tier: number, won: boolean): number {
  const P = BATTLE.prizes;
  return won ? P.karate[tierIx(tier, P.karate.length)]! : P.karateLoss;
}

export function partyPrize(tier: number, won: boolean): number {
  const P = BATTLE.prizes;
  const prize = P.party[tierIx(tier, P.party.length)]!;
  return won ? prize : Math.round(prize * P.partyLossShare);
}

export function prizeFor(c: BattleContext, r: BattleResult): number {
  const won = r.winner === 0;
  if (r.reason === 'forfeit') return 0;
  if (c.kind === 'karate') return r.winner === null ? 0 : karatePrize(c.tier, won);
  if (c.kind === 'party') return r.winner === null ? 0 : partyPrize(c.tier, won);
  const P = BATTLE.prizes;
  const prize = P.encounter[tierIx(c.tier, P.encounter.length)]!;
  return won ? prize : Math.round(prize * P.encounterLossShare);
}

/** The dojo's record after a bout, shared with the old `karateResult` command. */
export function recordKarate(
  world: World,
  nubbinId: string,
  won: boolean,
  tier: number,
  rival: { name: string; species: string } | null,
  events: SimEvent[],
): void {
  if (won) {
    world.karate.wins += 1;
    world.karate.belt = Math.max(world.karate.belt, tier);
    if (rival) addRecruit(world, rival.name, rival.species, events);
  } else world.karate.losses += 1;
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (n) {
    n.karate ??= { wins: 0, losses: 0, belt: 0 };
    if (won) n.karate.wins += 1;
    else n.karate.losses += 1;
    n.karate.belt = Math.max(n.karate.belt, won ? tier : 0);
    events.push({ kind: 'karate', nubbinId: n.id, won, belt: n.karate.belt });
  }
}

/** Pays a finished bout once and tells the rest of the sim how it went. */
export function grantRewards(world: World, s: BattleState, events: SimEvent[]): void {
  if (!s.result || s.settled) return;
  s.settled = true;
  const c = s.context;
  const r = s.result;
  const shells = prizeFor(c, r);
  world.inventory.shells += shells;
  const won = r.winner === 0;
  if (c.kind === 'karate' && r.reason !== 'forfeit' && r.winner !== null) {
    const rival = s.sides[1][0];
    recordKarate(
      world,
      c.nubbinId,
      won,
      c.tier,
      rival ? { name: foeName(rival.foeName), species: rival.species } : null,
      events,
    );
  } else if (c.kind === 'party' && r.reason !== 'forfeit') {
    events.push({ kind: 'partyBout', won, tier: c.tier, shells });
  }
  // Each Nubbin keeps its own turn-bout record (recs FIGHT-17).
  if (s.mode === 'turn' && r.reason !== 'forfeit' && r.winner !== null) {
    for (const ally of s.sides[0]) {
      const n = world.nubbins.find((x) => x.id === ally.nubbinId);
      if (!n) continue;
      const b = battleOf(n);
      if (won) b.wins += 1;
      else b.losses += 1;
    }
  }
  events.push({
    kind: 'battleEnd',
    context: c.kind,
    source: c.kind === 'encounter' ? c.source : c.kind,
    key: c.kind === 'encounter' ? c.key : '',
    winner: r.winner,
    reason: r.reason,
    shells,
  });
}
