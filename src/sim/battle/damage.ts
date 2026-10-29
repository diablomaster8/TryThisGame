import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { moodMult } from './status';
import { alignMult, typeMult } from './types-chart';
import type { BattleEvent, BattleState, Combatant, MoveDef } from './types';

/**
 * One strike of the timed dojo bout: the target may slip it (dodge), a guard takes a share, and
 * a combatant whose HP reaches 0 is tuckered out (never "down" or "knocked out"). The caller
 * picks the multiplier; this file owns the order the dice are rolled in, which replays rely on.
 */
export function strikeOn(
  s: BattleState,
  rng: Rng,
  by: Combatant,
  to: Combatant,
  mult: number,
  spread: readonly [number, number],
  guardFactor: number,
  strong = false,
): number {
  if (rng.chance(to.dodge)) {
    s.log.push({ k: 'miss', by: by.id, to: to.id });
    return 0;
  }
  const guarded = to.guard;
  const raw = by.power * mult * rng.float(spread[0], spread[1]) * (guarded ? guardFactor : 1);
  const dmg = Math.max(1, Math.round(raw));
  to.hp = Math.max(0, to.hp - dmg);
  to.guard = false;
  s.log.push({ k: 'hit', by: by.id, to: to.id, dmg, strong, guarded });
  if (to.hp === 0) s.log.push({ k: 'tuckered', who: to.id, side: to.side });
  return dmg;
}

/** STAB: the user's type, or a Normal user's second type ("Adaptable"). */
export function stabOf(by: Combatant, move: MoveDef): number {
  const own = move.type === by.type || (by.type === 'normal' && move.type === by.second);
  return own ? BATTLE.damage.stab : 1;
}

/**
 * One damage formula (recs FIGHT-11):
 * max(1, round(power × (A+20)/(D+20) × 0.35 × type × align × stab × crit × rng(0.9,1.1))),
 * A and D being Bonk/Guard for a bonk move and Splash/Splash for a splash move, with moods
 * and a caught breath on top. A non-crit hit never takes more than 60% of max HP. Rolls: the
 * crit first, then the spread.
 */
export function moveDamage(
  rng: Rng,
  by: Combatant,
  to: Combatant,
  move: MoveDef,
): { dmg: number; eff: number; crit: boolean } {
  const crit = rng.chance(BATTLE.damage.critChance);
  return { ...damageWith(by, to, move, crit, rng.float(...BATTLE.damage.spread)), crit };
}

/**
 * The formula above with both dice already rolled, so the tactics preview (recs FIGHT-54)
 * shows exactly what a resolved hit with the same roll does. `mult` is the grid's facing,
 * height, terrain and job factor; 1 leaves the turn mode exactly as it was.
 */
export function damageWith(
  by: Combatant,
  to: Combatant,
  move: MoveDef,
  crit: boolean,
  roll: number,
  mult = 1,
): { dmg: number; eff: number } {
  const K = BATTLE.damage;
  const bonk = move.kind === 'bonk';
  const a = (bonk ? by.bonk * moodMult(by, 'bonk') : by.splash) + K.soak;
  const guard = to.guard ? BATTLE.puff.breathGuard : 1;
  const d = (bonk ? to.def * moodMult(to, 'guard') : to.splash) * guard + K.soak;
  const eff = to.eternal ? 1 : typeMult(move.type, to.type);
  const boost = by.boosted.includes(move.id) ? K.lessonBoost : 1;
  const raw =
    move.power *
    boost *
    (a / d) *
    K.scale *
    eff *
    alignMult(by.alignAs?.align ?? move.align, to.band, to.eternal) *
    stabOf(by, move) *
    (crit ? K.crit : 1) *
    roll *
    mult;
  let dmg = Math.max(1, Math.round(raw));
  if (!crit) dmg = Math.min(dmg, Math.max(1, Math.floor(to.maxHp * K.capShare)));
  return { dmg, eff };
}

/**
 * Takes HP off; Stamina S "Second Wind" (A: on a coin flip) keeps one HP, once a bout.
 * Logs the tuck-in when HP reaches 0.
 */
export function hurt(s: BattleState, rng: Rng, to: Combatant, dmg: number): number {
  let left = to.hp - dmg;
  // Gentle bouts: the Keeper's side never drops below 1 HP; at 1 a cuddle and a free fruit.
  if (s.gentle && to.side === 0 && left <= 1) {
    const heal = Math.round(to.maxHp * BATTLE.gentle.cuddleHeal);
    to.hp = Math.min(to.maxHp, 1 + heal);
    s.log.push({ k: 'cuddle', who: to.id, heal });
    return to.hp;
  }
  const sw = to.traits.find((t) => t.id === 'secondWind');
  if (left <= 0 && to.hp > 1 && sw && !to.used.includes('secondWind')) {
    to.used.push('secondWind');
    if (sw.full || rng.chance(BATTLE.traits.halfChance)) {
      left = 1;
      s.log.push({ k: 'trait', who: to.id, id: 'secondWind' });
    }
  }
  to.hp = Math.max(0, left);
  if (to.hp === 0) s.log.push({ k: 'tuckered', who: to.id, side: to.side });
  return to.hp;
}

/** Still in the bout: not tuckered, and not gone home with the Keeper as a new friend. */
export const standing = (c: Combatant): boolean => c.hp > 0 && !c.friend;

/** On the field: standing and, in singles, its side's active one (recs FIGHT-19). */
export const onField = (s: BattleState, c: Combatant): boolean =>
  standing(c) && (!s.lead || s.sides[c.side][s.lead[c.side]] === c);

/** Ends the bout when a side has nobody standing. */
export function settle(s: BattleState): void {
  if (s.result) return;
  const foesUp = s.sides[1].some(standing);
  const alliesUp = s.sides[0].some(standing);
  const friends = s.sides[1].some((c) => c.friend);
  if (!foesUp) end(s, { k: 'end', winner: 0, reason: friends ? 'friends' : 'tuckered' });
  else if (!alliesUp) end(s, { k: 'end', winner: 1, reason: 'tuckered' });
}

export function end(s: BattleState, e: Extract<BattleEvent, { k: 'end' }>): void {
  if (s.result) return;
  s.result = { winner: e.winner, reason: e.reason };
  s.phase = 'done';
  s.log.push(e);
}
