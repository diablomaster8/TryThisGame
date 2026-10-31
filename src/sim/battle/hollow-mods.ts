/**
 * The Hollow's champion modifiers (R0155, DUNG-15) and the Keeper's Brave gear (R0164,
 * DUNG-24) inside a fight. The dungeon hands each foe's modifiers and each ally's Brave
 * through the encounter context; this file turns them into play once, when the bout is made,
 * and adds the two on-hit touches (a Sparkly zap back, a Sticky slow). Everything lands on
 * the optional `Combatant.mod`, so bouts without modifiers play exactly as before.
 *
 * The hit and damage-taken factors are read in `damage.ts` (`modMult`). Played: Zoomy (Zip), Big Biceps (hits), Bouncy (damage taken), Bossy (packmates' hits),
 * Grumpy Cloud (the party's hits for a few turns), Sparkly (a small zap back) and Sticky (a
 * Zip mood down on whoever it hits). Not played in the fight: Copycat, Snack Thief, Hiding.
 */
import { championMod } from '../../config/dungeon-foes';
import { BATTLE_R9 } from '../../config/tuning-battle-r9';
import { BATTLE } from '../../config/tuning-battle';
import type { Rng } from '../rng';
import { hurt, standing } from './damage';
import type { BattleState, Combatant } from './types';

const H = BATTLE_R9.hollow;

type Mod = NonNullable<Combatant['mod']>;
const modOf = (c: Combatant): Mod => (c.mod ??= {});

/** Applies the context's modifiers and Brave to a freshly made bout. */
export function dressHollowMods(s: BattleState): void {
  const c = s.context;
  if (c.kind !== 'encounter') return;
  const [allies, foes] = s.sides;
  c.foes.forEach((spec, i) => {
    const foe = foes[i];
    if (!foe || !spec.mods?.length) return;
    for (const id of spec.mods) {
      const e = championMod(id).effect;
      if (e.speed) foe.zip = foe.zip * (1 + e.speed);
      if (e.power) modOf(foe).hit = (foe.mod?.hit ?? 1) * (1 + e.power);
      if (e.damageTaken) modOf(foe).taken = (foe.mod?.taken ?? 1) * (1 + e.damageTaken);
      if (e.chainOnStruck) modOf(foe).chain = (foe.mod?.chain ?? 0) + e.chainOnStruck;
      if (e.slowOnHit) modOf(foe).sticky = true;
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
  });
  if (c.brave)
    for (const a of allies) {
      const b = c.brave[a.id] ?? 0;
      if (b > 0) modOf(a).hit = (a.mod?.hit ?? 1) * (1 + Math.min(H.braveCap, b * H.bravePerPoint));
    }
}

/** After `by` hits `to` for `dmg`: Sparkly zaps back, Sticky slows. No dice are rolled. */
export function afterModHit(
  s: BattleState,
  rng: Rng,
  by: Combatant,
  to: Combatant,
  dmg: number,
): void {
  if (by.side === to.side) return;
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
}

/** End of a round: a grumpy cloud drifts off after its turns. */
export function tickMods(c: Combatant): void {
  const cloud = c.mod?.cloud;
  if (cloud && --cloud.turns <= 0) delete c.mod!.cloud;
}
