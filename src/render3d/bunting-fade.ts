import type * as THREE from 'three';
import { CG2_P } from '../config/tuning-p';

/**
 * H9: bunting that fades out as the camera comes near it, so a string strung past the lens
 * never cuts across the frame. Works on any basic or line material: a view-depth varying in
 * the vertex stage and a screen-door dither in the fragment stage (no transparency, so the
 * bunting stays opaque and sorted as before). Full at `far` and beyond, gone at `near`.
 * It is a fixed screen pattern, not a flicker, so reduced motion needs no still form.
 */
export function fadeNearCamera(
  material: THREE.Material,
  near: number = CG2_P.buntingFade.near,
  far: number = CG2_P.buntingFade.far,
): void {
  const f = (n: number): string => n.toFixed(2);
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying float vNearFade;')
      .replace(
        '#include <project_vertex>',
        '#include <project_vertex>\nvNearFade = -mvPosition.z;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vNearFade;')
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
float nearFade = smoothstep(${f(near)}, ${f(far)}, vNearFade);
float nearDither = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
if (nearFade < nearDither) discard;`,
      );
  };
  material.customProgramCacheKey = () => `near-fade-${f(near)}-${f(far)}`;
}
