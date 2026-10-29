import { foeName } from '../../config/strings-battle';
import { BATTLE, BATTLE_ONCE, BATTLE_PROGRESS } from '../../config/tuning-battle';
import { BATTLE_R5 } from '../../config/tuning-battle-r5';
import { hashSeed } from '../rng';
import { addRecruit } from '../town';
import { Rng } from '../rng';
import { befriendWild, noteScan } from '../scans';
import { addHappiness } from '../needs';
import { addPoints } from '../stats';
import type { Nubbin, SimEvent, StatKey, World } from '../types';
import { circuitPrize, circuitWin } from './circuit';
import { payItems } from './items';
import { moveOf } from './moves';
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
  // Spicy pays more for the Champion AI (FIGHT-86); a skipped story bout pays half (FIGHT-71).
  const spicy = c.difficulty === 'spicy' && c.kind !== 'karate' ? BATTLE_R5.spicyPrize : 1;
  const auto = c.auto ? BATTLE_R5.autoPrize : 1;
  return Math.round(base * share * spicy * auto);
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
  settleSpoils(world, s, shells, events);
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

// ---- Round 5: what a bout gives back (recs FIGHT-73, FIGHT-74) ----

/** What a finished bout gave, for the results card and the Collection book. */
export interface BoutSpoils {
  won: boolean;
  shells: number;
  /** Raw stat points by Nubbin id, before the grade multiplier (the gain is in `gained`). */
  points: Record<string, Partial<Record<StatKey, number>>>;
  gained: Record<string, Partial<Record<StatKey, number>>>;
  /** The first win at this tier's hat, once ever; null otherwise. */
  hat: string | null;
  /** Moves seen for the first time ever: new cards in the Collection book. */
  cards: string[];
}

/** One-time rewards already given. Optional in the save; read with `onceOf`. */
export interface BattleOnceState {
  /** Tiers whose first win (dojo, party or story) has paid its hat. */
  firstWins: number[];
  /** Keepsakes for the decorate list (a calmed boss and the like), by id. */
  keepsakes: string[];
  /** Every move a Nubbin of this save has known: the Collection book's move cards. */
  moveCards: string[];
}

export function onceOf(world: World): BattleOnceState {
  return world.battleOnce ?? { firstWins: [], keepsakes: [], moveCards: [] };
}

function onceFor(world: World): BattleOnceState {
  return (world.battleOnce ??= { firstWins: [], keepsakes: [], moveCards: [] });
}

/** The care stat a move trains: priority moves are Run, bonks Power, splashes Swim. */
export function moveStat(id: string): StatKey | null {
  const d = moveOf(id);
  if (d.priority > 0) return 'run';
  if (d.kind === 'bonk') return 'power';
  if (d.kind === 'splash') return 'swim';
  return null;
}

/**
 * Raw points one ally earned in a bout, read from the log: 4 per move use by its stat, 4 per
 * attack it slipped (Fly) and 4 per turn it lasted after first stepping in (Stamina), each
 * capped at 60. The timed dojo bout has no moves, so its landed strikes count as bonks.
 */
export function boutPoints(s: BattleState, allyId: string): Partial<Record<StatKey, number>> {
  const P = BATTLE_PROGRESS;
  const raw: Partial<Record<StatKey, number>> = {};
  const add = (k: StatKey): void => {
    raw[k] = Math.min(P.capPerStat, (raw[k] ?? 0) + P.perUse);
  };
  let present = false;
  let out = false;
  for (const e of s.log) {
    if (e.k === 'use' && e.by === allyId) {
      present = true;
      const k = moveStat(e.move);
      if (k) add(k);
    } else if (e.k === 'hit' && e.by === allyId && s.mode === 'karate') {
      present = true;
      add('power');
    } else if (e.k === 'miss' && e.to === allyId && e.by !== allyId) {
      present = true;
      add('fly');
    } else if (e.k === 'tuckered' && e.who === allyId) out = true;
    else if (e.k === 'turnEnd' && present && !out) add('stamina');
  }
  return raw;
}

/**
 * A child's bout record leans its personality (recs FIGHT-73): many more wins than losses
 * leans Cheerful, the reverse Shy. `decidePersonality` in `sim/personality.ts` is the place to
 * consult it; until then this only reports the lean.
 */
export function boutLean(care: Nubbin['childCare']): 'cheerful' | 'shy' | null {
  const w = care.boutWins ?? 0;
  const l = care.boutLosses ?? 0;
  if (w - l >= BATTLE_PROGRESS.leanGap) return 'cheerful';
  if (l - w >= BATTLE_PROGRESS.leanGap) return 'shy';
  return null;
}

/** Adds every move this save's Nubbins know to the move cards; returns the new ones. */
export function collectMoveCards(world: World, nubbins: readonly Nubbin[] = world.nubbins) {
  const once = onceFor(world);
  const fresh: string[] = [];
  for (const n of nubbins) {
    if (n.stage === 'egg') continue;
    for (const id of battleOf(n).known)
      if (!once.moveCards.includes(id)) {
        once.moveCards.push(id);
        fresh.push(id);
      }
  }
  return fresh;
}

/**
 * Gives a keepsake once (a calmed boss's, for the decorate list). Returns false when it was
 * already given, so a replayed objective never pays twice.
 */
export function grantKeepsake(world: World, id: string): boolean {
  const once = onceFor(world);
  if (once.keepsakes.includes(id)) return false;
  once.keepsakes.push(id);
  return true;
}

const FIRST_WIN_KINDS = new Set<BattleContext['kind']>(['karate', 'dojo', 'party', 'story']);

/** The first win at a tier pays its hat once; the Circuit has its own ribbons. */
function firstWinHat(world: World, c: BattleContext, won: boolean): string | null {
  if (!won || !FIRST_WIN_KINDS.has(c.kind)) return null;
  const once = onceFor(world);
  if (once.firstWins.includes(c.tier)) return null;
  once.firstWins.push(c.tier);
  const hats = BATTLE_ONCE.firstWinHats;
  const hat = hats[Math.max(0, Math.min(hats.length - 1, c.tier - 1))]!;
  if (!world.inventory.hats.includes(hat)) world.inventory.hats.push(hat);
  return hat;
}

/**
 * Care after a bout (recs FIGHT-73): stat points by the moves used, a little energy, a little
 * happiness either way, and a child's win/loss count. A forfeit gives nothing, as the leave
 * prompt promises. Runs once, from `grantRewards`, after the `battleEnd` event.
 */
function settleSpoils(world: World, s: BattleState, shells: number, events: SimEvent[]): void {
  const r = s.result;
  if (!r || r.reason === 'forfeit') return;
  const P = BATTLE_PROGRESS;
  const won = r.winner === 0;
  const spoils: BoutSpoils = { won, shells, points: {}, gained: {}, hat: null, cards: [] };
  const party: Nubbin[] = [];
  for (const ally of s.sides[0]) {
    const n = world.nubbins.find((x) => x.id === ally.nubbinId);
    if (!n) continue;
    party.push(n);
    const raw = boutPoints(s, ally.id);
    const gained: Partial<Record<StatKey, number>> = {};
    for (const k of Object.keys(raw) as StatKey[]) gained[k] = addPoints(n.stats[k], raw[k]!);
    spoils.points[n.id] = raw;
    spoils.gained[n.id] = gained;
    n.needs.energy = Math.max(0, n.needs.energy - P.energyCost);
    addHappiness(n, won ? P.happyWin : P.happyLoss);
    if (n.stage === 'child' && r.winner !== null) {
      if (won) n.childCare.boutWins = (n.childCare.boutWins ?? 0) + 1;
      else n.childCare.boutLosses = (n.childCare.boutLosses ?? 0) + 1;
    }
  }
  spoils.hat = firstWinHat(world, s.context, won);
  spoils.cards = collectMoveCards(world, party);
  events.push({ kind: 'battleSpoils', spoils });
  // Kept on the bout too, so the results card can read it without the event stream.
  s.spoils = spoils;
}
