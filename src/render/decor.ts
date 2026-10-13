import { GROVE } from '../config/tuning';
import { Rng } from '../sim/rng';
import { BUILDINGS, nearBuilding } from './scenery';

/** A ground decoration: a prop-sheet frame at a fixed spot. */
export interface Decoration {
  frame:
    | 'tuft'
    | 'mushroom'
    | 'pebble'
    | 'daisy'
    | 'bluebell'
    | 'stump'
    | 'sign'
    | 'reed'
    | 'tallgrass'
    | 'lily';
  x: number;
  z: number;
  flip: boolean;
  /** Lies on the water instead of standing up. */
  flat?: boolean;
}

function clear(x: number, z: number): boolean {
  const pond = GROVE.pond;
  if (Math.hypot(x - pond.x, z - pond.z) < pond.r + 1.2) return false;
  for (const t of GROVE.trees) if (Math.hypot(x - t.x, z - t.z) < 2.2) return false;
  for (const h of GROVE.hills) if (Math.hypot(x - h.x, z - h.z) < h.r + 0.5) return false;
  const s = GROVE.keeperStart;
  if (Math.hypot(x - s.x, z - s.z) < 2.5) return false;
  for (const e of GROVE.eggSpots) if (Math.hypot(x - e.x, z - e.z) < 1.5) return false;
  const wf = GROVE.waterfall;
  if (Math.hypot(x - (wf.x - 3.6), z - (wf.z + 5.6)) < 2.5) return false;
  if (nearBuilding(x, z, 3.2)) return false;
  // The crop plot by the cottage.
  if (
    x > BUILDINGS.cottage!.x - 3.5 &&
    x < BUILDINGS.cottage!.x + 1.5 &&
    z > BUILDINGS.cottage!.z + 2.5 &&
    z < BUILDINGS.cottage!.z + 6.5
  )
    return false;
  return Math.abs(x) < GROVE.size / 2 - 1 && Math.abs(z) < GROVE.size / 2 - 1;
}

/** Seeded, so every Grove looks the same on every device. */
export function placeDecorations(seed = 11): Decoration[] {
  const rng = new Rng(seed);
  const out: Decoration[] = [];
  const spread = GROVE.size / 2 - 1.5;
  const tryPlace = (frame: Decoration['frame'], count: number) => {
    let placed = 0;
    for (let tries = 0; tries < count * 12 && placed < count; tries++) {
      const x = rng.float(-spread, spread);
      const z = rng.float(-spread, spread);
      if (!clear(x, z)) continue;
      if (out.some((d) => Math.hypot(d.x - x, d.z - z) < 1.1)) continue;
      out.push({ frame, x, z, flip: rng.chance(0.5) });
      placed++;
    }
  };
  tryPlace('tuft', 40);
  tryPlace('daisy', 14);
  tryPlace('bluebell', 10);
  tryPlace('pebble', 12);
  tryPlace('mushroom', 6);
  tryPlace('stump', 2);
  // Tall grass along the Grove's edges.
  for (let i = 0; i < 28; i++) {
    const side = rng.int(0, 3);
    const t = rng.float(-spread, spread);
    const e = spread - rng.float(0, 1.2);
    const x = side === 0 ? -e : side === 1 ? e : t;
    const z = side === 2 ? -e : side === 3 ? e : t;
    if (!clear(x, z)) continue;
    out.push({ frame: 'tallgrass', x, z, flip: rng.chance(0.5) });
  }
  // Reeds on the pond's rim and lily pads on the water.
  const pond = GROVE.pond;
  for (let i = 0; i < 9; i++) {
    const a = rng.float(0, Math.PI * 2);
    const r = pond.r + rng.float(0.2, 0.7);
    out.push({
      frame: 'reed',
      x: pond.x + Math.cos(a) * r,
      z: pond.z + Math.sin(a) * r,
      flip: rng.chance(0.5),
    });
  }
  for (let i = 0; i < 5; i++) {
    const a = rng.float(0, Math.PI * 2);
    const r = rng.float(1.2, pond.r - 0.8);
    out.push({
      frame: 'lily',
      x: pond.x + Math.cos(a) * r,
      z: pond.z + Math.sin(a) * r,
      flip: rng.chance(0.5),
      flat: true,
    });
  }
  // The signpost greets the Keeper by the start.
  out.push({
    frame: 'sign',
    x: GROVE.keeperStart.x + 2.4,
    z: GROVE.keeperStart.z + 1.2,
    flip: false,
  });
  return out;
}
