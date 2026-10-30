/**
 * The Mystery Basket stall (R0176, DUNG-33; lane B round 6): at a camp's vendor, a covered
 * basket for one gear slot, priced by act. Opening one rolls a rarity with the stall's own
 * odds (never Plain) and the piece lands in the sack, banked at once since a camp banks. The
 * price is shown plainly: no timers, no pressure, Shells only. It is the bigger Hollow's
 * Shells sink.
 */
import { actStartDepth } from '../config/dungeon-acts';
import { BASES, type RarityId } from '../config/dungeon-loot';
import { HOLLOW_R6 } from '../config/tuning-dungeon';
import { serviceHere } from './dungeon-towns';
import { keepGear, rollGear } from './gear';
import type { Rng } from './rng';
import type { GearItem, SimEvent, World } from './types';

/** The basket's price in act `act`. */
export function basketPrice(act: number): number {
  const p = HOLLOW_R6.basketPrice;
  return p[Math.max(0, Math.min(p.length - 1, act))]!;
}

/** A basket's rarity: the stall's odds, never Plain. */
export function basketRarity(rng: Rng): RarityId {
  const odds = HOLLOW_R6.basketOdds;
  let roll = rng.next();
  for (const id of ['shiny', 'fancy', 'legendary', 'set'] as const)
    if ((roll -= odds[id]) < 0) return id;
  return 'shiny';
}

/** The gear slots a basket can be bought for. */
export function basketSlots(): string[] {
  return [...new Set(BASES.filter((b) => b.slot !== 'charm').map((b) => b.slot))];
}

/** Buys and opens a basket for `slot` at a camp's vendor; the piece, or null. */
export function gambleBasket(
  world: World,
  slot: string,
  rng: Rng,
  events: SimEvent[],
): GearItem | null {
  const run = world.dungeon;
  const base = BASES.find((b) => b.slot === slot && b.slot !== 'charm');
  if (!run || run.act === undefined || serviceHere(world)?.kind !== 'vendor' || !base) return null;
  const price = basketPrice(run.act);
  if (world.inventory.shells < price) {
    events.push({ kind: 'basketOpened', ok: false, price });
    return null;
  }
  world.inventory.shells -= price;
  const item = rollGear(world, rng, actStartDepth(run.act) * 2, 0, basketRarity(rng));
  item.base = base.id;
  item.slot = base.slot;
  keepGear(world, item);
  events.push({ kind: 'basketOpened', ok: true, price, item });
  return item;
}
