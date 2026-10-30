import { EGG_COLORS } from './nubbin';
import { dayKey } from './edu';
import { Rng } from './rng';
import type { World } from './types';

type EggColor = (typeof EGG_COLORS)[number];

/**
 * R0692 (KIDS-24): a Learning Grove shop has no egg lottery. Three eggs sit on the shelf, their
 * colours on show; the shelf is new each day (the daily-refresh rule allows it), each egg can be
 * bought once that day, and the egg bought is the egg that hatches: that colour, a Nubbin, with
 * no hidden roll for rare colours, jewels, two-tones or shine.
 */
export const EDU_EGG_SHELF = 3;

/** The day's shelf: three different colours, the same for a save all day. */
export function eduEggStock(day: string, seed: number): EggColor[] {
  const rng = Rng.fromSeed(`edu-eggs:${day}:${seed}`);
  const pool: EggColor[] = [...EGG_COLORS];
  const out: EggColor[] = [];
  while (out.length < EDU_EGG_SHELF) out.push(pool.splice(rng.int(0, pool.length - 1), 1)[0]!);
  return out;
}

/** Today's shelf for a save, with which places are already bought. */
export function eduEggShelf(world: World): { colours: EggColor[]; bought: number[] } {
  const day = dayKey(world.lastWallMs);
  const shelf = world.edu?.eggShelf;
  return {
    colours: eduEggStock(day, world.seed),
    bought: shelf?.day === day ? shelf.bought : [],
  };
}

/**
 * Take egg `pick` off today's shelf: its colour, or the first one left when no pick is given.
 * Null when that egg (or every egg) is gone for today.
 */
export function eduTakeEgg(world: World, pick?: number): EggColor | null {
  const e = world.edu;
  if (!e) return null;
  const { colours, bought } = eduEggShelf(world);
  const at = pick ?? colours.findIndex((_, i) => !bought.includes(i));
  if (at < 0 || at >= colours.length || bought.includes(at)) return null;
  e.eggShelf = { day: dayKey(world.lastWallMs), bought: [...bought, at] };
  return colours[at]!;
}
