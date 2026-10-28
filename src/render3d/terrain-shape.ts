import * as THREE from 'three';
import { GROVE, GROVE3D } from '../config/tuning';
import { exactHeight, pathDistance, riverDistance } from '../sim/terrain';

/**
 * The 3D Grove's ground mesh. The height model itself (hills, pond and stream dips, the
 * rim and the noise roll) moved to `sim/terrain.ts` so the sim can stand things on it;
 * the samplers are re-exported here so every 3D file keeps importing them from this
 * module. `terrainArrays` is the mesh built from them. No materials here, so the terrain
 * worker can load it.
 */
export {
  exactHeight,
  groveHeight,
  pathDistance,
  riverDistance,
  standHeight,
  WATER_LEVEL,
} from '../sim/terrain';

/** The terrain mesh's buffers, as `terrain.ts` pours them into its geometry. */
export interface TerrainArrays {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  blend: Float32Array;
  index: Uint16Array | Uint32Array;
}

/** Side of the terrain square, in world units, and its grid. */
export const TERRAIN_SIZE = GROVE.size + 16;
export const TERRAIN_SEGS = 224;

/** Heights, normals and the rock/dirt blend for every vertex of the terrain grid. */
export function terrainArrays(): TerrainArrays {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const blend = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, exactHeight(x, z));
    uv.setXY(i, x / 3.2, z / 3.2);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const slope = 1 - nrm.getY(i);
    const y = pos.getY(i);
    // Steep faces and the rim go to rock; the stream bed and the paths go to dirt.
    const rock = THREE.MathUtils.smoothstep(slope, 0.2, 0.5) + THREE.MathUtils.smoothstep(y, 5, 10);
    const path = 1 - THREE.MathUtils.smoothstep(pathDistance(x, z), GROVE3D.pathWidth, 1.9);
    const bed = 1 - THREE.MathUtils.smoothstep(riverDistance(x, z), 0.9, 1.9);
    blend[i * 2] = Math.min(1, rock);
    blend[i * 2 + 1] = Math.max(path, bed);
  }
  return {
    position: pos.array as Float32Array,
    normal: nrm.array as Float32Array,
    uv: uv.array as Float32Array,
    blend,
    index: geo.index!.array as Uint16Array | Uint32Array,
  };
}
