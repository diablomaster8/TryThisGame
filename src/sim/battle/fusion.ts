import { BATTLE_R6 } from '../../config/tuning-battle-r6';
import type { World } from '../types';
import { settle, standing } from './damage';
import type { BattleState, Combatant } from './types';

/**
 * Fusion burst (recs FIGHT-95). In a doubles bout, the Keeper's two partners (`world.partners`)
 * with a bond (affection) of 80 or more may fuse once a bout: both step into one combatant
 * with the pair's best stats a little boosted, their HP pooled and the Fusion Burst move, for
 * three turns. Then it splits, the pool's HP shared at the ratio the halves had when they
 * fused. A fused combatant that is tuckered out takes both halves with it.
 */
const F = BATTLE_R6.fusion;

/** The pair that may fuse in this bout, or null: both partners on the Keeper's side. */
export function fusionPair(world: World, allies: readonly Combatant[]): [string, string] | null {
  const [a, b] = world.partners;
  if (!a || !b) return null;
  const ca = allies.find((c) => c.nubbinId === a);
  const cb = allies.find((c) => c.nubbinId === b);
  const na = world.nubbins.find((n) => n.id === a);
  const nb = world.nubbins.find((n) => n.id === b);
  if (!ca || !cb || !na || !nb) return null;
  if (na.needs.affection < F.bond || nb.needs.affection < F.bond) return null;
  return [ca.id, cb.id];
}

export function canFuse(s: BattleState): boolean {
  const f = s.fusable;
  if (!s.doubles || !f || f.used || s.phase !== 'choose') return false;
  return f.pair.every((id) => {
    const c = s.sides[0].find((x) => x.id === id);
    return !!c && standing(c);
  });
}

/** Fuses the pair (its choices this turn are dropped); the fused one chooses next. */
export function fuse(s: BattleState): boolean {
  if (!canFuse(s)) return false;
  const [a, b] = s.fusable!.pair.map((id) => s.sides[0].find((x) => x.id === id)!) as [
    Combatant,
    Combatant,
  ];
  s.fusable!.used = true;
  const best = (k: 'bonk' | 'splash' | 'def' | 'zip' | 'flutter') =>
    Math.round(Math.max(a[k], b[k]) * F.boost);
  const id = `fusion-${a.id}-${b.id}`;
  const moves = [...new Set([F.move, ...a.moves, ...b.moves])].slice(0, 4);
  const one: Combatant = {
    ...a,
    id,
    nubbinId: null,
    name: `${a.name ?? ''} + ${b.name ?? ''}`,
    level: Math.max(a.level, b.level),
    hp: a.hp + b.hp,
    maxHp: a.maxHp + b.maxHp,
    bonk: best('bonk'),
    splash: best('splash'),
    def: best('def'),
    zip: best('zip'),
    flutter: best('flutter'),
    puff: Math.max(a.puff, b.puff, 4),
    puffMax: Math.max(a.puffMax, b.puffMax),
    moves,
    boosted: [...new Set([...a.boosted, ...b.boosted])],
    traits: [...a.traits],
    major: null,
    moods: {},
    used: [],
    last: null,
    decoy: 0,
    guard: false,
    fusion: { of: [a.id, b.id], hp: [a.hp, b.hp], left: F.turns },
  };
  delete one.fusedInto;
  a.fusedInto = id;
  b.fusedInto = id;
  if (s.choices) {
    delete s.choices[a.id];
    delete s.choices[b.id];
  }
  s.sides[0].push(one);
  s.active = s.sides[0].length - 1;
  s.log.push({ k: 'fusion', who: id, of: [a.id, b.id], on: true });
  return true;
}

/** At each turn's end: the fused one counts down, and splits at its last turn. */
export function tickFusion(s: BattleState): void {
  let split1 = false;
  for (const c of [...s.sides[0]]) {
    if (!c.fusion) continue;
    c.fusion.left -= 1;
    if (c.fusion.left <= 0 || c.hp <= 0) {
      split(s, c);
      split1 = true;
    }
  }
  // Only a split can change who is standing here; other bouts keep their old timing.
  if (split1) settle(s);
}

/** Splits a fused combatant: the pooled HP back to its halves at their fusing ratio. */
export function split(s: BattleState, one: Combatant): void {
  const f = one.fusion;
  if (!f) return;
  const total = f.hp[0] + f.hp[1];
  f.of.forEach((id, i) => {
    const half = s.sides[0].find((x) => x.id === id);
    if (!half) return;
    delete half.fusedInto;
    const share = total > 0 ? (one.hp * f.hp[i]!) / total : 0;
    half.hp = Math.min(half.maxHp, Math.round(share));
    if (half.hp === 0) s.log.push({ k: 'tuckered', who: half.id, side: 0 });
  });
  s.sides[0].splice(s.sides[0].indexOf(one), 1);
  s.log.push({ k: 'fusion', who: one.id, of: f.of, on: false });
}
