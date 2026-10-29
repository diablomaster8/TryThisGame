import { foeName } from '../../config/strings-battle';
import { BATTLE } from '../../config/tuning-battle';
import { hashSeed } from '../rng';
import { addRecruit } from '../town';
import { Rng } from '../rng';
import { befriendWild, noteScan } from '../scans';
import type { SimEvent, World } from '../types';
import { circuitPrize, circuitWin } from './circuit';
import { payItems } from './items';
import { battleOf } from './moves-sources';
import type { BattleContext, BattleResult, BattleState } from './types';

/**
 * Seeds and prizes. A bout is seeded from the world (recs FIGHT-03), like races, so it can be
 * replayed from a save; the count goes up in the sim when a bout starts. Prizes come from the
 * tier tables in `tuning-battle.ts` (FIGHT-02), never from a number a screen sends; losing pays
 * a little or nothing and never costs Shells.
 */
export function contextKey(c: BattleContext): string {
  if (c.kind === 'encounter') return `encounter:${c.source}:${c.key}:${c.tier}`;
  if (c.kind === 'circuit') return `circuit:${c.trainer}:${c.champion ? 'c' : ''}${c.tier}`;
  if (c.kind === 'story') return `story:${c.storyline}:${c.tier}`;
  return `${c.kind}:${c.tier}`;
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

export function prizeFor(c: BattleContext, r: BattleResult, gentle = false): number {
  const won = r.winner === 0;
  if (r.reason === 'forfeit') return 0;
  // A gentle bout's play-fight hug pays half (recs FIGHT-24).
  const share = gentle ? BATTLE.gentle.prizeShare : 1;
  const base = basePrize(c, r, won);
  return Math.round(base * share);
}

function basePrize(c: BattleContext, r: BattleResult, won: boolean): number {
  if (c.kind === 'karate' || c.kind === 'dojo')
    return r.winner === null ? 0 : karatePrize(c.tier, won);
  if (c.kind === 'party' || c.kind === 'story')
    return r.winner === null ? 0 : partyPrize(c.tier, won);
  if (c.kind === 'circuit') return won ? circuitPrize(c.trainer, !!c.champion) : 0;
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
  const shells = prizeFor(c, r, !!s.gentle);
  world.inventory.shells += shells;
  const won = r.winner === 0;
  payItems(world, s);
  settleWild(world, s, events);
  if (c.kind === 'dojo' && r.reason !== 'forfeit' && r.winner !== null) {
    const rival = s.sides[1][0];
    recordKarate(
      world,
      c.ids[0] ?? '',
      won,
      c.tier,
      rival ? { name: foeName(rival.foeName), species: rival.species } : null,
      events,
    );
  }
  if (c.kind === 'circuit' && won) circuitWin(world, c.trainer, !!c.champion, events);
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
  } else if ((c.kind === 'party' || c.kind === 'story') && r.reason !== 'forfeit') {
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
    key: c.kind === 'encounter' ? c.key : c.kind === 'circuit' ? c.trainer : '',
    winner: r.winner,
    reason: r.reason,
    shells,
  });
}

/**
 * Wild foes after a bout (recs FIGHT-21): each befriended one comes home (or fills its scan
 * and leaves a gift); each tuckered one goes home and fills some of its scan. Kept even when
 * the Keeper leaves early: a friend's choice is its own.
 */
function settleWild(world: World, s: BattleState, events: SimEvent[]): void {
  const rng = new Rng(s.rngState);
  let friends = 0;
  for (const f of s.sides[1]) {
    if (f.calm === undefined) continue;
    if (f.friend) {
      friends += 1;
      befriendWild(world, f.species, rng, events);
    } else if (f.hp <= 0) noteScan(world, f.species, BATTLE.befriend.tuckeredScan, events);
  }
  if (friends === 0) return;
  for (const ally of s.sides[0]) {
    const n = world.nubbins.find((x) => x.id === ally.nubbinId);
    if (n) battleOf(n).befriended += friends;
  }
}
