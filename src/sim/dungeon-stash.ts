/**
 * The stash's tabs, search and the Grove's cottage chest (R0174, DUNG-31; lane B round 8). The
 * stash itself is `gear.stash` (lane B round 6); each piece remembers its tab (`tab`, 0 when
 * unset). There are four tabs of forty, one more per act boss's first win; a full stash keeps
 * piling into the last tab rather than lose anything. The same stash opens at every act camp's
 * chest and at the cottage in the Grove. Pure sim: the filter is a plain function the panel
 * and the tests share.
 */
import { STASH } from '../config/dungeon-items-r8';
import { GROVE } from '../config/tuning';
import { depositStash, ensureGear, stashTabCount, unequipGear } from './gear';
import type { GearItem, World } from './types';

/** The Keeper stands at a stash chest: an act camp underground, or the Grove's cottage. */
export function canReachStash(world: World): boolean {
  if (world.location === 'dungeon') return world.dungeon?.zone === 'town';
  if (world.location !== 'grove') return false;
  const c = GROVE.buildings.cottage;
  const k = world.keeper.pos;
  return Math.hypot(k.x - c.x, k.z - c.z) <= STASH.cottageReach;
}

export function stashTab(world: World, item: GearItem): number {
  return Math.min(stashTabCount(world) - 1, item.tab ?? 0);
}

/** How many pieces sit in each tab. */
export function tabCounts(world: World): number[] {
  const out = new Array<number>(stashTabCount(world)).fill(0);
  for (const x of world.gear?.stash ?? []) out[stashTab(world, x)]! += 1;
  return out;
}

/** Satchel → stash (taking it off whoever wears it). Only at a chest. */
export function stashPut(world: World, itemId: string): boolean {
  if (!canReachStash(world)) return false;
  const g = ensureGear(world);
  const i = g.items.findIndex((x) => x.id === itemId);
  if (i < 0) return false;
  unequipGear(world, itemId);
  depositStash(world, g.items.splice(i, 1)[0]!);
  return true;
}

/** Moves a stashed piece to another tab, if that tab has room. */
export function stashMove(world: World, itemId: string, tab: number): boolean {
  const item = world.gear?.stash?.find((x) => x.id === itemId);
  if (!item || !Number.isInteger(tab) || tab < 0 || tab >= stashTabCount(world)) return false;
  if ((tabCounts(world)[tab] ?? 0) >= STASH.perTab) return false;
  if (tab > 0) item.tab = tab;
  else delete item.tab;
  return true;
}

/**
 * The panel's view: one tab (or every tab with `tab` null), one slot or all, and a search over
 * the words the panel shows (`nameOf` gives a piece's name and tier words).
 */
export function filterStash(
  items: readonly GearItem[],
  opts: { tab: number | null; slot: string | null; query: string },
  tabOf: (item: GearItem) => number,
  nameOf: (item: GearItem) => string,
): GearItem[] {
  const q = opts.query.trim().toLowerCase();
  return items.filter(
    (x) =>
      (opts.tab === null || tabOf(x) === opts.tab) &&
      (!opts.slot || x.slot === opts.slot) &&
      (!q || nameOf(x).toLowerCase().includes(q)),
  );
}
