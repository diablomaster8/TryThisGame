import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { TOON_OUTLINE } from '../samples/creatures';

/**
 * The Full 3D Grove's creature outlines: the inverted hull of the stage's toon mode, but
 * sized on screen instead of in world units, so a Nubbin carries the same line weight
 * whether the camera is close or zoomed out, on a phone or a desktop. The width is a share
 * of the screen's height, read from the projection itself (no resolution uniform to keep in
 * step with the frame-time governor), and capped in world units so a speck in the distance
 * does not turn into a blob. Every hull shares one material, so one switch hides them all
 * when the governor finds the device short of CPU (`setOutlines`).
 */
const WIDTH = { value: GROVE3D.toon.outlineScreen };
const MAX_WORLD = { value: GROVE3D.toon.outlineMaxWorld };

const HULL = new THREE.MeshBasicMaterial({ color: TOON_OUTLINE.color, side: THREE.BackSide });
HULL.onBeforeCompile = (shader) => {
  shader.uniforms.uWidth = WIDTH;
  shader.uniforms.uMaxWorld = MAX_WORLD;
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      '#include <common>\nuniform float uWidth;\nuniform float uMaxWorld;',
    )
    .replace(
      '#include <project_vertex>',
      `vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
      // The world size of the given share of the screen at this depth: the view's height
      // at distance d is 2 d / projectionMatrix[1][1].
      float depth = max( -mvPosition.z, 0.0 );
      float w = min( uWidth * 2.0 * depth / projectionMatrix[ 1 ][ 1 ], uMaxWorld );
      mvPosition.xyz += normalize( normalMatrix * normal ) * w;
      gl_Position = projectionMatrix * mvPosition;`,
    );
};
HULL.customProgramCacheKey = () => 'grove-toon-hull';

/** Never pick or ray-test a hull; the creature under it answers for it. */
const noRaycast = (): void => {};

/** Give every opaque, big-enough mesh under `root` a hull (once). */
export function addOutlines(root: THREE.Object3D): void {
  const hosts: THREE.Mesh[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || m.userData.hull || m.userData.noOutline || m.userData.hasHull) return;
    const mat = m.material as THREE.Material | THREE.Material[];
    if (Array.isArray(mat) || mat.transparent || (mat as THREE.MeshBasicMaterial).alphaTest > 0)
      return;
    if (triangles(m) < GROVE3D.toon.outlineMinTris) return;
    hosts.push(m);
  });
  for (const o of hosts) addHull(o);
}

/** Give one mesh the shared hull (the building kit outlines its smooth pieces this way). */
export function addHull(o: THREE.Mesh): void {
  if (o.userData.hasHull) return;
  const hull = new THREE.Mesh(o.geometry, HULL);
  hull.userData.hull = true;
  hull.castShadow = false;
  hull.receiveShadow = false;
  hull.frustumCulled = o.frustumCulled;
  hull.raycast = noRaycast;
  // It sits exactly on its part: no local transform to recompose each frame.
  hull.matrixAutoUpdate = false;
  o.userData.hasHull = true;
  o.add(hull);
}

/** Show or hide every creature outline at once (the governor's CPU step). */
export function setOutlines(on: boolean): void {
  HULL.visible = on;
}

export function outlinesOn(): boolean {
  return HULL.visible;
}

function triangles(m: THREE.Mesh): number {
  const g = m.geometry;
  return (g.index ? g.index.count : (g.attributes.position?.count ?? 0)) / 3;
}
