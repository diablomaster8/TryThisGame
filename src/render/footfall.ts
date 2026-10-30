/**
 * The Keeper's footfalls by surface (MOVE-46), for both renderers: every stride walked on
 * the ground it says what the foot came down on (grass, path, stone, water, or a deck: the
 * bridge, a bench, a rock top) and plays that surface's step, if it has one. It reads the
 * sim and never changes it.
 */
import { FOOTFALL } from '../config/tuning-move';
import { playSound } from '../platform/audio';
import { keeperFooting } from '../sim/keeper';
import { groundAt, type GroundSurface } from '../sim/terrain';
import type { World } from '../sim/types';

export class Footfall {
  private lx = NaN;
  private lz = NaN;
  private walked = 0;
  /** The surface under the last step, for the dust and prints. */
  surface: GroundSurface = 'grass';

  /** Follow the Keeper; returns the surface on a step, else null. */
  step(world: World, x: number, z: number): GroundSurface | null {
    const k = world.keeper;
    const moved = Number.isNaN(this.lx) ? 0 : Math.hypot(x - this.lx, z - this.lz);
    this.lx = x;
    this.lz = z;
    if (!k.grounded || world.location !== 'grove' || moved > 2) {
      this.walked = 0;
      return null;
    }
    this.walked += moved;
    if (this.walked < FOOTFALL.stride) return null;
    this.walked = 0;
    const g = groundAt(world, x, z).surface;
    this.surface = g !== 'water' && keeperFooting(world, x, z, k.y).on === 'deck' ? 'deck' : g;
    if (this.surface === 'deck') playSound('stepDeck');
    else if (this.surface === 'stone') playSound('stepStone');
    else if (this.surface === 'water') playSound('stepWade');
    return this.surface;
  }
}
