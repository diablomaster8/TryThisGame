import { GROVE } from '../config/tuning';
import { CG2_K } from '../config/tuning-k';
import type { Memorial, World } from '../sim/types';
import { ddLayout } from './story-b-layout';

/**
 * Where a memorial flower stands (campaign graphics N7), shared by both renderers. In
 * Hazel's Grove it stays where the Nubbin was. In the separate campaigns that have no hill
 * of their own it moves to the campaign's own mark, so the departed have a place: the ring
 * round the Fold's well in The Hundred Days, and the green's edge, between the houses, in
 * Dawn & Dusk. The slot comes from the flower's place in `world.memorials` (stable: they only
 * ever append), so no flower moves when another is added. Reads only.
 */
export function memorialSpot(world: World, m: Memorial): { x: number; z: number } {
  const line = world.campaign?.storyline;
  const slot = world.memorials.indexOf(m);
  if (slot < 0) return m.pos;
  if (line === 'hundred') {
    const well = GROVE.buildings.well;
    const R = CG2_K.memorial.wellRing;
    // A ring on the side of the well away from the square, 0.55 radians apart, outward in rows.
    const row = Math.floor(slot / 8);
    const a = R.from + (slot % 8) * R.step;
    const r = R.r + row * 0.7;
    return {
      x: well.x + Math.cos(a) * r,
      z: well.z + Math.sin(a) * r,
    };
  }
  if (line === 'dawn' || line === 'dusk') {
    const L = ddLayout();
    const E = CG2_K.memorial.greenEdge;
    // Four arcs, one on each diagonal between two houses, a flower every 0.2 radians.
    const arc = slot % 4;
    const idx = Math.floor(slot / 4);
    const diag = Math.PI / 4 + (Math.PI / 2) * arc;
    const a = diag + (idx % E.per) * E.arcOffset - ((E.per - 1) * E.arcOffset) / 2;
    const r = L.radius + E.out + Math.floor(idx / E.per) * 0.5;
    return { x: L.centre.x + Math.cos(a) * r, z: L.centre.z + Math.sin(a) * r };
  }
  return m.pos;
}
