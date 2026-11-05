import type * as THREE from 'three';

/**
 * WORLD-39 (R12 lane D): the live Grove terrain, registered by the 3D scene, so the Grove
 * drawn back across a seamless border (`region-grove-edge.ts`) stands on the real ground (its
 * hills, paths, banks and marsh): it shares the terrain's vertex buffers and material and
 * draws them through its own index, cut to the Grove's square near the borders a neighbour
 * sees. `index` gives the whole grid's index as poured (null until the worker's grid lands).
 */
export interface GroveBackSource {
  mesh: THREE.Mesh;
  index: () => Uint16Array | Uint32Array | null;
}

let source: GroveBackSource | null = null;

export function setGroveBackSource(s: GroveBackSource | null): void {
  source = s;
}

export function groveBackSource(): GroveBackSource | null {
  return source;
}
