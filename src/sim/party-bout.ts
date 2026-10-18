import { KARATE, PARTY_BOUT } from '../config/tuning';
import { Rng } from './rng';
import { levelOf } from './stats';
import type { Nubbin } from './types';

/**
 * SL2's (Logged In) party bouts: three partners against a seeded line of foes, turn by turn, in a
 * card-like format that reuses the karate stat maths (Power strikes, Stamina is HP, Run
 * dodges). Each party member picks a move on its turn, then the foes act. Pure and
 * seeded; the panel draws it and feeds the moves, and reports the result as a command.
 */
export type PartyMove = 'strike' | 'guard' | 'rally';

export interface PartyFighter {
  /** The Nubbin's id, or null for a foe. */
  id: string | null;
  name: string;
  hp: number;
  maxHp: number;
  power: number;
  dodge: number;
  guard: boolean;
}

export interface PartyBout {
  tier: number;
  party: PartyFighter[];
  foes: PartyFighter[];
  /** Index into `party` of the member to move next. */
  active: number;
  round: number;
  log: string[];
  finished: boolean;
  won: boolean | null;
  rng: Rng;
}

export function fighterOf(n: Nubbin): PartyFighter {
  const power = levelOf(n.stats.power.points);
  const stamina = levelOf(n.stats.stamina.points);
  const run = levelOf(n.stats.run.points);
  const maxHp = Math.round(KARATE.hp + stamina * KARATE.staminaPerLevel);
  return {
    id: n.id,
    name: n.name,
    hp: maxHp,
    maxHp,
    power: 10 + power * KARATE.powerPerLevel,
    dodge: Math.min(0.35, run * KARATE.dodgePerRunLevel),
    guard: false,
  };
}

function foeOf(tier: number, i: number, rng: Rng): PartyFighter {
  const level = PARTY_BOUT.foeLevel[Math.min(tier, PARTY_BOUT.foeLevel.length) - 1] ?? 10;
  const maxHp = Math.round(KARATE.hp * 0.8 + level * KARATE.staminaPerLevel * rng.float(0.8, 1.2));
  return {
    id: null,
    name: PARTY_BOUT.foeNames[(tier + i) % PARTY_BOUT.foeNames.length]!,
    hp: maxHp,
    maxHp,
    power: 8 + level * KARATE.powerPerLevel * rng.float(0.8, 1.1),
    dodge: Math.min(0.3, level * KARATE.dodgePerRunLevel * 0.8),
    guard: false,
  };
}

export function createPartyBout(party: Nubbin[], tier: number, seed: number): PartyBout {
  const rng = Rng.fromSeed(seed);
  const foes = Array.from({ length: PARTY_BOUT.foesPerTier }, (_, i) => foeOf(tier, i, rng));
  return {
    tier,
    party: party.map(fighterOf),
    foes,
    active: 0,
    round: 1,
    log: [],
    finished: false,
    won: null,
    rng,
  };
}

const alive = (f: PartyFighter): boolean => f.hp > 0;

function hit(b: PartyBout, from: PartyFighter, to: PartyFighter): number {
  if (b.rng.chance(to.dodge)) return 0;
  const raw = from.power * b.rng.float(0.8, 1.2) * (to.guard ? PARTY_BOUT.guardFactor : 1);
  const dmg = Math.max(1, Math.round(raw));
  to.hp = Math.max(0, to.hp - dmg);
  to.guard = false;
  return dmg;
}

function settle(b: PartyBout): void {
  if (!b.foes.some(alive)) {
    b.finished = true;
    b.won = true;
  } else if (!b.party.some(alive)) {
    b.finished = true;
    b.won = false;
  }
}

function nextActive(b: PartyBout): number {
  for (let i = b.active + 1; i < b.party.length; i++) if (alive(b.party[i]!)) return i;
  return -1;
}

/** The foes' turn: each strikes the weakest standing party member, or guards now and then. */
function foesAct(b: PartyBout): void {
  for (const foe of b.foes.filter(alive)) {
    const targets = b.party.filter(alive).sort((x, y) => x.hp - y.hp);
    const target = targets[0];
    if (!target) break;
    if (b.rng.chance(PARTY_BOUT.foeGuardChance)) {
      foe.guard = true;
      b.log.push(`${foe.name} guards.`);
      continue;
    }
    const dmg = hit(b, foe, target);
    b.log.push(
      dmg > 0 ? `${foe.name} hits ${target.name} for ${dmg}.` : `${target.name} slips aside.`,
    );
  }
  settle(b);
}

/** The active member's move. Returns false if the bout is over or the move is invalid. */
export function partyMove(b: PartyBout, move: PartyMove, target = 0): boolean {
  if (b.finished) return false;
  const me = b.party[b.active];
  if (!me || !alive(me)) return false;
  if (move === 'strike') {
    const foes = b.foes.filter(alive);
    const to = foes[Math.min(target, foes.length - 1)];
    if (!to) return false;
    const dmg = hit(b, me, to);
    b.log.push(dmg > 0 ? `${me.name} strikes ${to.name} for ${dmg}.` : `${to.name} slips aside.`);
  } else if (move === 'guard') {
    me.guard = true;
    b.log.push(`${me.name} guards.`);
  } else {
    for (const ally of b.party.filter(alive)) {
      ally.hp = Math.min(ally.maxHp, ally.hp + Math.round(ally.maxHp * PARTY_BOUT.rallyHeal));
    }
    b.log.push(`${me.name} rallies the party.`);
  }
  while (b.log.length > PARTY_BOUT.logLines) b.log.shift();
  settle(b);
  if (b.finished) return true;
  const next = nextActive(b);
  if (next >= 0) {
    b.active = next;
    return true;
  }
  foesAct(b);
  for (const p of b.party) p.guard = p.guard && alive(p);
  b.round += 1;
  b.active = b.party.findIndex(alive);
  return true;
}

/** Shells for a bout, by tier. */
export function partyPrize(tier: number, won: boolean): number {
  const prize = PARTY_BOUT.prize[Math.min(tier, PARTY_BOUT.prize.length) - 1] ?? 0;
  return won ? prize : Math.round(prize / 4);
}
