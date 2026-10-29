import { BATTLE } from '../../config/tuning-battle';
import type { Flavor, World } from '../types';
import { addCalm, calmGain } from './befriend';
import { cure, shiftMood } from './status';
import type { Rng } from '../rng';
import type { BattleItemId, BattleState, Combatant, MoodStat, SideIx } from './types';

/**
 * Battle items (recs FIGHT-20), from the Grove's own inventory with no new currency: plain
 * fruit heals and cures Peckish, a stat fruit lifts one mood, a Sun or Moon fruit lends its
 * alignment to the holder's moves, a toy makes a foe stop to play. The bout takes a snapshot of
 * what the Keeper carries (`bag`) and counts what it used (`spent`); the inventory pays only
 * when the bout ends with a result, so a forfeit refunds everything. Using an item is the
 * combatant's action for the turn, at most `BATTLE.items.perTurn` per side.
 */
export const BATTLE_ITEMS: readonly BattleItemId[] = [
  'fruit',
  'fruit:swim',
  'fruit:fly',
  'fruit:run',
  'fruit:power',
  'fruit:stamina',
  'fruit:sun',
  'fruit:moon',
  'toy',
];

/** Which mood each stat fruit lifts (assumption: there is no Splash mood, so Swim steadies Guard). */
const FRUIT_MOOD: Record<'swim' | 'fly' | 'run' | 'power' | 'stamina', MoodStat> = {
  swim: 'guard',
  fly: 'acc',
  run: 'zip',
  power: 'bonk',
  stamina: 'guard',
};

const flavourOf = (item: BattleItemId): Flavor | null =>
  item.startsWith('fruit:') ? (item.slice(6) as Flavor) : null;

/** What the Keeper carries into a bout. Flavoured fruit comes from `inventory.pocketFruit`. */
export function bagFrom(world: World): Partial<Record<BattleItemId, number>> {
  const inv = world.inventory;
  const bag: Partial<Record<BattleItemId, number>> = {};
  if (inv.fruit > 0) bag.fruit = inv.fruit;
  const toys = Object.values(inv.toys ?? {}).reduce((a, n) => a + (n ?? 0), 0);
  if (toys > 0) bag.toy = toys;
  for (const [f, n] of Object.entries(inv.pocketFruit ?? {}))
    if (n && n > 0) bag[`fruit:${f}` as BattleItemId] = n;
  return bag;
}

/** How many of `item` side `side` may still use (the rivals carry `foeBag`). */
export function itemsLeft(s: BattleState, side: SideIx, item: BattleItemId): number {
  const bag = side === 0 ? s.bag : s.foeBag;
  const spent = side === 0 ? s.spent : s.foeSpent;
  return (bag?.[item] ?? 0) - (spent?.[item] ?? 0);
}

/** Whether `by` may use `item` on `to` this turn (the per-turn cap is checked by the caller). */
export function itemFits(by: Combatant, item: BattleItemId, to: Combatant): boolean {
  if (to.hp <= 0 || to.friend) return false;
  if (item === 'toy') return to.side !== by.side && !to.toyed;
  // Fruit goes to an ally, or is offered to a wild foe as a snack.
  return to.side === by.side || to.calm !== undefined;
}

/** Uses `item` from `by` on `to`. The item counts as spent even if it does nothing. */
export function useItem(
  s: BattleState,
  rng: Rng,
  by: Combatant,
  item: BattleItemId,
  to: Combatant,
): void {
  const spent = by.side === 0 ? (s.spent ??= {}) : (s.foeSpent ??= {});
  spent[item] = (spent[item] ?? 0) + 1;
  s.log.push({ k: 'item', by: by.id, item, to: to.id });
  const I = BATTLE.items;
  if (item === 'toy') {
    to.toyed = true;
    to.playing = I.toySkip;
    if (to.calm !== undefined) addCalm(s, to, BATTLE.befriend.toy);
    return;
  }
  const flavour = flavourOf(item);
  if (to.side !== by.side) {
    // A snack for a wild one: the lower its HP, the gladder it is of it.
    addCalm(s, to, calmGain(to, flavour ? BATTLE.befriend.treatFlavour : 0));
    return;
  }
  if (!flavour) {
    const add = Math.min(to.maxHp - to.hp, Math.round(to.maxHp * I.fruitHeal));
    to.hp += add;
    s.log.push({ k: 'rally', by: to.id, heal: add });
    if (to.major?.id === 'peckish') cure(s, to);
  } else if (flavour === 'sun' || flavour === 'moon') {
    to.alignAs = { align: flavour, turns: I.alignTurns };
  } else {
    shiftMood(s, rng, by, to, FRUIT_MOOD[flavour], 1, 1);
  }
}

/** Pays for the items a finished bout used; a forfeit pays nothing (recs FIGHT-20). */
export function payItems(world: World, s: BattleState): void {
  if (!s.result || s.result.reason === 'forfeit' || !s.spent) return;
  const inv = world.inventory;
  for (const [id, n] of Object.entries(s.spent) as [BattleItemId, number][]) {
    if (!n) continue;
    if (id === 'fruit') inv.fruit = Math.max(0, inv.fruit - n);
    else if (id === 'toy') {
      let left = n;
      for (const k of Object.keys(inv.toys) as (keyof typeof inv.toys)[]) {
        const take = Math.min(left, inv.toys[k] ?? 0);
        inv.toys[k] = (inv.toys[k] ?? 0) - take;
        left -= take;
      }
    } else {
      const f = flavourOf(id)!;
      const pocket = (inv.pocketFruit ??= {});
      pocket[f] = Math.max(0, (pocket[f] ?? 0) - n);
    }
  }
}
