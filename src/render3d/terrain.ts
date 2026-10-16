import * as THREE from 'three';
import { terrainMaterial, type Tex } from '../samples/aaa-kit';
import type { TerrainReply } from './terrain-worker';
import { terrainArrays, type TerrainArrays } from './terrain-shape';

export {
  WATER_LEVEL,
  groveHeight,
  pathDistance,
  riverDistance,
  standHeight,
} from './terrain-shape';

/**
 * The 3D Grove's ground mesh. The heights, normals and blend are sampled in a worker
 * (`terrain-worker.ts`) while the scene boots; until they land the mesh holds a one-triangle
 * placeholder with the same attributes, so its programs compile exactly as before, and
 * `ready` stays false (the loading veil waits for it). Without workers it samples on the
 * page in a later task. The samplers everything stands on live in `terrain-shape.ts`.
 */
export interface GroveTerrain {
  readonly mesh: THREE.Mesh;
  readonly ready: boolean;
}

/** A geometry holding the terrain's buffers, as `terrainArrays` made them. */
function geometryFrom(a: TerrainArrays): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setIndex(new THREE.BufferAttribute(a.index, 1));
  geo.setAttribute('position', new THREE.BufferAttribute(a.position, 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(a.normal, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(a.uv, 2));
  geo.setAttribute('blend', new THREE.BufferAttribute(a.blend, 2));
  return geo;
}

export function buildGroveTerrain(
  scene: THREE.Object3D,
  tex: Tex,
  time: { value: number },
): GroveTerrain {
  const n = 3;
  const placeholder = geometryFrom({
    position: new Float32Array(n * 3),
    normal: new Float32Array(n * 3),
    uv: new Float32Array(n * 2),
    blend: new Float32Array(n * 2),
    index: new Uint16Array([0, 1, 2]),
  });
  const mesh = new THREE.Mesh(placeholder, terrainMaterial(tex, false, time));
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  mesh.name = 'terrain';
  scene.add(mesh);
  const state = { mesh, ready: false };
  const pour = (a: TerrainArrays) => {
    if (state.ready) return;
    state.ready = true;
    mesh.geometry.dispose();
    mesh.geometry = geometryFrom(a);
  };
  const onPage = () => setTimeout(() => pour(terrainArrays()), 0);
  if (typeof Worker === 'undefined') onPage();
  else {
    try {
      const w = new Worker(new URL('./terrain-worker.ts', import.meta.url), { type: 'module' });
      w.onmessage = (e: MessageEvent<TerrainReply>) => {
        w.terminate();
        if (e.data.arrays) pour(e.data.arrays);
        else onPage();
      };
      w.onerror = () => {
        w.terminate();
        onPage();
      };
      w.postMessage(null);
    } catch {
      onPage();
    }
  }
  return state;
}
