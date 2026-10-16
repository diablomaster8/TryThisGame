import { GROVE, GROVE3D } from '../config/tuning';
import type { GrassField } from '../samples/grass-place';
import { groveHeight, pathDistance, riverDistance } from './terrain-shape';

/**
 * Where the 3D Grove's grass grows: the meadow, kept off the paths, the water, the
 * buildings and the rim. No materials or DOM here, so the grass worker can load it.
 */
export function groveGrassField(): GrassField {
  const keepOut = [
    ...Object.values(GROVE.buildings).map((p) => ({ x: p.x, z: p.z, r: p.r + 0.6 })),
    { x: GROVE.pond.x, z: GROVE.pond.z, r: GROVE.pond.r + 1 },
  ];
  return {
    ground: groveHeight,
    half: GROVE3D.grassHalf,
    centreZ: 0,
    count: GROVE3D.grassCount,
    allow: (x, z, y) => {
      if (y > 3.5 || y < -0.2) return false;
      if (pathDistance(x, z) < GROVE3D.pathWidth + 0.3) return false;
      if (riverDistance(x, z) < GROVE.river.width * 0.5 + 0.6) return false;
      for (const k of keepOut) if (Math.hypot(x - k.x, z - k.z) < k.r) return false;
      return true;
    },
  };
}
