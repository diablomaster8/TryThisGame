/**
 * The Hollow's champion modifiers (R0155, DUNG-15) and the Keeper's Brave gear (R0164,
 * DUNG-24) inside a fight. The dungeon hands each foe's modifiers and each ally's Brave
 * through the encounter context; this file turns them into play once, when the bout is made,
 * and adds the on-hit touches. Everything lands on the optional `Combatant.mod`, so bouts
 * without modifiers play exactly as before. The tactics mode calls the same `afterModHit`,
 * and a Hollow rumble dresses its foes with `dressFoeMods`.
 *
 * The hit and damage-taken factors are read in `damage.ts` (`modMult`). Played: Zoomy (Zip),
 * Big Biceps (hits), Bouncy (damage taken), Bossy (packmates' hits), Grumpy Cloud (the
 * party's hits for a few turns), Sparkly (a small zap back), Sticky (a Zip mood down on
 * whoever it hits), Copycat (a weak echo of each hit), Hiding (after it strikes it puffs
 * away, and the next hit on it lands at half) and Immune to Tickles (Wild, R0179: its own
 * type of move does half). Snack Thief plays after the fight (`dungeon-encounters.ts`).
 */
import { championMod, type ChampionModId } from '../../config/dungeon-foes';
import { BATTLE_R9 } from '../../config/tuning-battle-r9';
import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { hurt, standing } from './damage';
import type { BattleState, Combatant } from './types';

const H = BATTLE_R9.hollow;

type Mod = NonNullable<Combatant['mod']>;
const modOf = (c: Combatant): Mod => (c.mod ??= {});

/** Lays one foe's modifiers on it, its packmates and the side it faces. */
export function dressFoeMods(
  foe: Combatant,
  mods: readonly ChampionModId[],
  foes: readonly Combatant[],
  allies: readonly Combatant[],
): void {
  for (const id of mods) {
    const e = championMod(id).effect;
    if (e.speed) foe.zip = foe.zip * (1 + e.speed);
    if (e.power) modOf(foe).hit = (foe.mod?.hit ?? 1) * (1 + e.power);
    if (e.damageTaken) modOf(foe).taken = (foe.mod?.taken ?? 1) * (1 + e.damageTaken);
    if (e.chainOnStruck) modOf(foe).chain = (foe.mod?.chain ?? 0) + e.chainOnStruck;
    if (e.slowOnHit) modOf(foe).sticky = true;
    if (e.extraWeakAttack) modOf(foe).copy = e.extraWeakAttack;
    if (e.hops) modOf(foe).hides = true;
    if (e.proof) modOf(foe).proof = foe.type;
    if (e.aura)
      for (const mate of foes)
        if (mate !== foe) modOf(mate).hit = (mate.mod?.hit ?? 1) * (1 + e.aura.power);
    if (e.curse)
      for (const a of allies) {
        const was = a.mod?.cloud;
        modOf(a).cloud = {
          mult: Math.min(was?.mult ?? 1, 1 + e.curse.targetPower),
          turns: Math.max(was?.turns ?? 0, e.curse.turns),
        };
      }
  }
}

/** Applies the context's modifiers and Brave to a freshly made bout. */
export function dressHollowMods(s: BattleState): void {
  const c = s.context;
  if (c.kind !== 'encounter') return;
  const [allies, foes] = s.sides;
  c.foes.forEach((spec, i) => {
    const foe = foes[i];
    if (foe && spec.mods?.length) dressFoeMods(foe, spec.mods, foes, allies);
  });
  if (c.brave)
    for (const a of allies) {
      const b = c.brave[a.id] ?? 0;
      if (b > 0) modOf(a).hit = (a.mod?.hit ?? 1) * (1 + Math.min(H.braveCap, b * H.bravePerPoint));
    }
}

/**
 * After `by` hits `to` for `dmg`: Sparkly zaps back, Sticky slows, Copycat echoes, and Hiding
 * puffs away (or, struck while hidden, comes out). No dice are rolled.
 */
export function afterModHit(
  s: BattleState,
  rng: Rng,
  by: Combatant,
  to: Combatant,
  dmg: number,
): void {
  if (by.side === to.side) return;
  if (to.mod?.hidden) delete to.mod.hidden;
  if (to.mod?.chain && standing(by) && dmg > 0) {
    const zap = Math.max(1, Math.round(dmg * to.mod.chain));
    s.log.push({ k: 'hit', by: to.id, to: by.id, dmg: zap, strong: false, guarded: false });
    hurt(s, rng, by, zap);
  }
  if (by.mod?.sticky && standing(to)) {
    const cur = to.moods.zip ?? 0;
    const next = Math.max(-BATTLE.status.moodMax, cur - H.stickyZip);
    if (next !== cur) {
      to.moods.zip = next;
      s.log.push({ k: 'mood', to: to.id, stat: 'zip', delta: next - cur });
    }
  }
  if (by.mod?.copy && standing(by) && standing(to) && dmg > 0) {
    const echo = Math.max(1, Math.round(dmg * by.mod.copy));
    s.log.push({ k: 'hit', by: by.id, to: to.id, dmg: echo, strong: false, guarded: false });
    hurt(s, rng, to, echo);
  }
  if (by.mod?.hides && standing(by)) by.mod.hidden = true;
}

/** End of a round: a grumpy cloud drifts off after its turns. */
export function tickMods(c: Combatant): void {
  const cloud = c.mod?.cloud;
  if (cloud && --cloud.turns <= 0) delete c.mod!.cloud;
}
