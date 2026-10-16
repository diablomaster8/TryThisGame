import type * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { buildGrass, pourGrass, type Tex } from '../samples/aaa-kit';
import { placeGrass, type GrassPlacement } from '../samples/grass-place';
import { groveGrassField } from './grass-field';
import type { GrassReply } from './grass-worker';

/**
 * The 3D Grove's grass. The meshes go in at once, empty, and the tufts are placed in a
 * worker (`grass-worker.ts`) while the scene boots; `ready` stays false until they are
 * poured in, and the loading veil waits for it, so the first frame shows the same meadow
 * as when the placement ran on the page. Without workers it places on the page in a
 * later task.
 */
export interface GroveGrass {
  readonly meshes: THREE.InstancedMesh[];
  readonly ready: boolean;
}

export function buildGroveGrass(
  scene: THREE.Object3D,
  tex: Tex,
  time: { value: number },
): GroveGrass {
  const meshes = buildGrass(scene, tex, time, GROVE3D.grassCount);
  const state = { meshes, ready: false };
  const pour = (p: GrassPlacement) => {
    if (state.ready) return;
    state.ready = true;
    pourGrass(meshes, p);
  };
  const onPage = () => setTimeout(() => pour(placeGrass(groveGrassField())), 0);
  if (typeof Worker === 'undefined') onPage();
  else {
    try {
      const w = new Worker(new URL('./grass-worker.ts', import.meta.url), { type: 'module' });
      w.onmessage = (e: MessageEvent<GrassReply>) => {
        w.terminate();
        if (e.data.placement) pour(e.data.placement);
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
