import { GROVE, GROVE3D } from '../config/tuning';
import type { GrassField } from '../samples/grass-place';
import { exactHeight, pathDistance, riverDistance } from './terrain-shape';

/**
 * Where the 3D Grove's grass grows: the meadow, kept off the paths, the water, the
 * buildings and the rim. No materials or DOM here, so the grass worker can load it.
 */
/** How far in from the square's edge the grass starts to thin, in world units. */
const GRASS_FRAY = 5;

export function groveGrassField(): GrassField {
  const keepOut = [
    ...Object.values(GROVE.buildings).map((p) => ({ x: p.x, z: p.z, r: p.r + 0.6 })),
    { x: GROVE.pond.x, z: GROVE.pond.z, r: GROVE.pond.r + 1 },
  ];
  return {
    // Placed once, in a worker: the exact sum, not the runtime height tiles.
    ground: exactHeight,
    half: GROVE3D.grassHalf,
    centreZ: 0,
    count: GROVE3D.grassCount,
    allow: (x, z, y) => {
      if (y > 3.5 || y < -0.2) return false;
      if (pathDistance(x, z) < GROVE3D.pathWidth + 0.3) return false;
      if (riverDistance(x, z) < GROVE.river.width * 0.5 + 0.6) return false;
      for (const k of keepOut) if (Math.hypot(x - k.x, z - k.z) < k.r) return false;
      // Thin out over the last few units of the square, so the meadow frays into the
      // painted ground instead of stopping at a straight line. A hash of the spot, not a
      // random draw, so the same tufts are kept every time.
      const edge = GROVE3D.grassHalf - Math.max(Math.abs(x), Math.abs(z));
      if (edge < GRASS_FRAY) {
        const h = Math.abs(Math.sin(x * 12.9898 + z * 78.233) * 43758.5453) % 1;
        if (h > (edge / GRASS_FRAY) ** 1.5) return false;
      }
      return true;
    },
  };
}
