import * as THREE from 'three';
import { CG4_D4 } from '../config/tuning-d4';
import type { WindState } from '../render/d4-state';

/**
 * K35: the one wind the 3D Grove's cloth and grass share. The uniform objects are single
 * instances, so every material that declares them reads the same direction, lean and gust; the
 * dressing sets them once a frame from the scene's weather. `WIND_GLSL` is the shader side: a
 * vertex helper `windMag(worldPos, weight, time)` returning how far (world units) a point
 * `weight` of the way up its cloth or blade (0 at the fixed edge, 1 at the free one) is pushed
 * along `uWindDir`. Under reduced motion `uWindMove` is 0: the ripple stops and the lean stays.
 */
export const WIND_U = {
  uWindDir: { value: new THREE.Vector2(Math.cos(CG4_D4.wind.dir), Math.sin(CG4_D4.wind.dir)) },
  uWindLean: { value: CG4_D4.wind.lean as number },
  uWindGust: { value: CG4_D4.wind.gust as number },
  uWindMove: { value: 1 },
  uWindT: { value: 0 },
};

export const WIND_GLSL_DECL = `uniform vec2 uWindDir;
uniform float uWindLean;
uniform float uWindGust;
uniform float uWindMove;
uniform float uWindT;
float windMag( vec3 wp, float w, float t ) {
  float ripple = 0.5 + 0.5 * sin( t * ${CG4_D4.wind.gustHz.toFixed(2)} + dot( wp.xz, uWindDir ) * ${CG4_D4.wind.ripple.toFixed(2)} );
  float g = mix( 0.5, ripple, uWindMove );
  return ( uWindLean + uWindGust * g ) * w;
}
`;

/** Push the shared uniforms from the wind's state; once a frame. */
export function setWind(state: WindState, reduce: boolean, t = 0): void {
  WIND_U.uWindT.value = t;
  WIND_U.uWindDir.value.set(state.dirX, state.dirZ);
  WIND_U.uWindLean.value = state.lean;
  WIND_U.uWindGust.value = state.gust;
  WIND_U.uWindMove.value = reduce ? 0 : 1;
}

/**
 * K25: the snow cover the terrain and the meadow's blades share (0..1), so a blade turns white
 * with the ground it stands on. The dressing sets it once a frame.
 */
export const SNOW_U = { uSnowAmt: { value: 0 } };

/**
 * K35: teach any basic or standard material (instanced or not) to bend in the shared wind.
 * `weight` is a GLSL float expression over the vertex (`position` is in scope): 0 where the
 * cloth is fixed, 1 where it hangs free. Wraps the material's own compile hook and cache key,
 * so what it already does stays.
 */
export function windBend(material: THREE.Material, weight: string): void {
  if (material.userData.windBend) return;
  material.userData.windBend = true;
  const prev = material.onBeforeCompile.bind(material);
  material.onBeforeCompile = (shader, renderer) => {
    prev(shader, renderer);
    Object.assign(shader.uniforms, WIND_U);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${WIND_GLSL_DECL}`)
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        {
          mat4 wm = modelMatrix;
          #ifdef USE_INSTANCING
            wm = modelMatrix * instanceMatrix;
          #endif
          vec3 wp = ( wm * vec4( transformed, 1.0 ) ).xyz;
          vec3 dl = ( vec3( uWindDir.x, 0.0, uWindDir.y ) * mat3( wm ) ) / dot( wm[ 0 ].xyz, wm[ 0 ].xyz );
          transformed += dl * windMag( wp, ${weight}, uWindT );
        }`,
      );
  };
  const key = material.customProgramCacheKey.bind(material);
  material.customProgramCacheKey = () => `${key()}|wind`;
  material.needsUpdate = true;
}
