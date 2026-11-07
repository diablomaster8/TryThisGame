import type { ReadonlyWorld } from './readonly';
import { BUILD_PLOTS } from '../config/region-extras-r11d6';
import { PLOT_RULES } from '../config/tuning-more/world-content-tables';
import type { RegionId } from '../config/regions';
import { newId } from './world';
import { plotAt } from './region-marks';
import { drawnRegionOf } from './region-walk';
import type { DecorKind, PlacedDecor, SimEvent, Vec2, World } from './types';

/**
 * R0136 (WORLD-70): a build plot in each drawn region. An 8 x 8 square of open ground, set out
 * with posts, takes a few calm pieces of the Grove's decorations (`BUILD_PLOTS[region].accepts`).
 * Free to use, no upkeep: pieces stay where they are put, kept per region in `world.plotDecor`
 * (an optional save field), and come back to the pack when taken up. Placing and taking up use
 * the same two commands as the Grove's decorating; the world picks the plot when the Keeper is in
 * a drawn region.
 */
export function plotPieces(
  world: Pick<ReadonlyWorld, 'plotDecor'>,
  region: RegionId,
): readonly PlacedDecor[] {
  return world.plotDecor?.[region] ?? [];
}

/** Why a piece cannot go at `at` on `region`'s plot, or null. */
export function plotRefusal(
  world: World,
  region: RegionId,
  kind: DecorKind,
  at: Vec2,
): string | null {
  const plot = plotAt(region);
  const rule = BUILD_PLOTS[region as keyof typeof BUILD_PLOTS];
  if (!plot || !rule) return 'no-plot';
  if (!rule.accepts.includes(kind)) return 'kind';
  if (Math.abs(at.x - plot.x) > PLOT_RULES.half || Math.abs(at.z - plot.z) > PLOT_RULES.half)
    return 'outside';
  const here = plotPieces(world, region);
  if (here.length >= PLOT_RULES.max) return 'full';
  if (here.some((p) => Math.hypot(p.pos.x - at.x, p.pos.z - at.z) < PLOT_RULES.spacing))
    return 'someone';
  return null;
}

/** Put a piece from the pack on the plot of the region the Keeper is in. */
export function placeOnPlot(
  world: World,
  kind: DecorKind,
  pos: Vec2,
  events: SimEvent[],
  yaw = 0,
): boolean {
  const region = drawnRegionOf(world.location);
  if (!region) return false;
  if ((world.inventory.decor[kind] ?? 0) <= 0) return false;
  const at = { x: Math.round(pos.x * 2) / 2, z: Math.round(pos.z * 2) / 2 };
  const refused = plotRefusal(world, region, kind, at);
  if (refused) {
    events.push({
      kind: 'decorRefused',
      decor: kind,
      reason: refused === 'someone' ? 'someone' : 'spot',
    });
    return false;
  }
  world.inventory.decor[kind] = (world.inventory.decor[kind] ?? 0) - 1;
  const id = newId(world, 'decor');
  const list = ((world.plotDecor ??= {})[region] ??= []);
  list.push({ id, kind, pos: at, ...(yaw !== 0 ? { yaw } : {}) });
  events.push({ kind: 'decorPlaced', id, decor: kind });
  return true;
}

/** Take a piece back off the plot (to the pack). True when it was one of the plot's. */
export function removeFromPlot(world: World, id: string): boolean {
  for (const [region, list] of Object.entries(world.plotDecor ?? {})) {
    const d = list.find((p) => p.id === id);
    if (!d) continue;
    world.plotDecor![region] = list.filter((p) => p.id !== id);
    world.inventory.decor[d.kind] = (world.inventory.decor[d.kind] ?? 0) + 1;
    return true;
  }
  return false;
}
