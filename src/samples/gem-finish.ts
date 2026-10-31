import { reducedMotion } from '../platform/motion';
import * as THREE from 'three';
import { TOON } from './creatures';
import type { RigContext, SpeciesSpec } from './species';
import { GEM_LOOK } from '../config/tuning-look';

/**
 * The rare finishes in Full 3D (LOOK-29, LOOK-30): jewel, metal and shiny Nubbins. The toon
 * ramp zeroes every specular and clearcoat, so the old glossy `surface` fields read matte in
 * the Grove; these finishes are painted in the body's own fragment shader instead, after the
 * lighting, so they read under toon and under the physical stage alike.
 * - Jewel: a lighter core facing the eye and a darker rim (a fake inner gradient), a hard
 *   two-step specular band, a rim in the gem's light colour, and a star that twinkles at a new
 *   point on the body every 0.7 s (three alive at once). No transmission (review C, item 6).
 * - Metal (gold eggs, silver jewels): a banded matcap-style ramp on the view normal and the
 *   same hard highlight.
 * - Shiny: a bright band that sweeps across the body every 3 s.
 * Everything runs in the one body material: no extra meshes, no extra draw calls. The finish
 * hangs on the spec as an `extras` wrapper, so the pool and the stage samples both get it.
 */
export interface GemFinish {
  jewel?: boolean;
  metal?: boolean;
  shiny?: boolean;
  /** The light gem colour for the jewel rim. */
  rim?: string;
}

/** The fragment block, added just before the colour is written. */
function chunk(f: GemFinish): string {
  const g = GEM_LOOK;
  const parts: string[] = [
    'vec3 gN = normalize( normal );',
    'vec3 gV = normalize( vViewPosition );',
    'float gF = clamp( dot( gN, gV ), 0.0, 1.0 );',
    'vec3 gH = normalize( normalize( vec3( -0.45, 0.65, 0.6 ) ) + gV );',
    'float gS = dot( gN, gH );',
  ];
  if (f.metal) {
    // A matcap-like ramp on the view normal: a bright sky band, a dark horizon band, a
    // lighter ground bounce, stepped like the toon bands.
    parts.push(
      `outgoingLight *= gN.y > 0.5 ? ${g.metalHi.toFixed(3)} : gN.y > 0.05 ? 1.0 : gN.y > -0.3 ? ${g.metalLo.toFixed(3)} : 0.85;`,
      `outgoingLight += vec3( gS > 0.97 ? ${g.spec.toFixed(3)} : gS > 0.92 ? ${(g.spec * 0.4).toFixed(3)} : 0.0 );`,
    );
  } else if (f.jewel) {
    parts.push(
      `outgoingLight *= gF > 0.62 ? ${g.core.toFixed(3)} : gF > 0.3 ? 1.0 : ${g.edge.toFixed(3)};`,
      `outgoingLight += vec3( gS > 0.975 ? ${g.spec.toFixed(3)} : gS > 0.93 ? ${(g.spec * 0.4).toFixed(3)} : 0.0 );`,
      `outgoingLight = mix( outgoingLight, uGemRim, smoothstep( 0.3, 0.16, gF ) * ${g.rim.toFixed(3)} );`,
    );
  }
  if (f.jewel || f.metal) {
    // The twinkles: a star every `twinkle` seconds at a hashed point on the body, each
    // living three slots, so three are alive at once. Biased to the front half.
    parts.push(
      'vec3 gD = normalize( vObjPos - uGemC );',
      'for ( int k = 0; k < 3; k ++ ) {',
      `  float gT = ( uGemTime - float( k ) * ${g.twinkle.toFixed(3)} ) / ${(g.twinkle * 3).toFixed(3)};`,
      '  float gSlot = floor( gT ) * 3.0 + float( k );',
      '  float gEnv = sin( fract( gT ) * 3.14159 );',
      '  vec3 gP = fract( sin( vec3( gSlot * 12.9898, gSlot * 78.233, gSlot * 37.719 ) ) * 43758.5453 ) * 2.0 - 1.0;',
      '  gP.z = abs( gP.z ) + 0.35;',
      '  gP = normalize( gP );',
      '  vec3 gT1 = normalize( cross( gP, vec3( 0.0, 1.0, 0.01 ) ) );',
      '  vec3 gB1 = cross( gP, gT1 );',
      '  vec3 gQ = gD - gP;',
      '  float gx = abs( dot( gQ, gT1 ) ), gy = abs( dot( gQ, gB1 ) );',
      `  float gR = ${g.star.toFixed(3)} * gEnv;`,
      '  float gStar = max( step( gx, gR ) * step( gy, gR * 0.16 ), step( gy, gR ) * step( gx, gR * 0.16 ) );',
      '  gStar = max( gStar, step( length( vec2( gx, gy ) ), gR * 0.3 ) );',
      '  outgoingLight += vec3( 1.0, 0.97, 0.88 ) * gStar * step( 0.0, dot( gD, gP ) ) * 1.3;',
      '}',
    );
  }
  if (f.shiny) {
    // A diagonal band that crosses the body, then rests: one pass every `sweep` seconds.
    parts.push(
      'float gU = ( vObjPos.y - uGemC.y + ( vObjPos.x - uGemC.x ) * 0.6 ) / ( 2.4 * uGemR ) + 0.5;',
      `float gC = fract( uGemTime / ${g.sweep.toFixed(3)} ) * 1.8 - 0.4;`,
      'float gDist = abs( gU - gC );',
      `outgoingLight += vec3( gDist < 0.05 ? ${g.band.toFixed(3)} : gDist < 0.11 ? ${(g.band * 0.4).toFixed(3)} : 0.0 ) * step( 0.25, gF );`,
    );
  }
  return `{\n${parts.join('\n')}\n}\n#include <opaque_fragment>`;
}

/**
 * Patch a body material with the finish. Called from the spec's `extras`, before the
 * material compiles; returns the per-frame clock update.
 */
export function applyGemFinish(
  mat: THREE.MeshPhysicalMaterial,
  meshes: readonly THREE.Mesh[],
  f: GemFinish,
): (t: number) => void {
  const box = new THREE.Box3();
  for (const m of meshes) {
    if (m.material !== mat) continue;
    m.geometry.computeBoundingBox();
    if (m.geometry.boundingBox) box.union(m.geometry.boundingBox);
  }
  const sphere = box.isEmpty()
    ? new THREE.Sphere(new THREE.Vector3(0, 1.5, 0), 1.5)
    : box.getBoundingSphere(new THREE.Sphere());
  const uniforms = {
    uGemTime: { value: 0 },
    uGemRim: { value: new THREE.Color(f.rim ?? '#ffffff') },
    uGemC: { value: sphere.center.clone() },
    uGemR: { value: Math.max(0.1, sphere.radius) },
  };
  // Off the toon ramp the physical surface does the rest: a hard clearcoat for shiny, a
  // metal for gold and silver (the stage carries an environment to reflect).
  if (!TOON.on) {
    if (f.shiny || f.jewel) mat.clearcoat = 1;
    if (f.metal) mat.metalness = GEM_LOOK.metalness;
  }
  const prev = mat.onBeforeCompile;
  // Read before the hook is swapped: three's default key is the hook's own text.
  const prevKey = mat.customProgramCacheKey.call(mat);
  const key = `gem|${f.jewel ? 'j' : ''}${f.metal ? 'm' : ''}${f.shiny ? 's' : ''}`;
  mat.onBeforeCompile = (shader, renderer) => {
    prev.call(mat, shader, renderer);
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uGemTime;\nuniform vec3 uGemRim;\nuniform vec3 uGemC;\nuniform float uGemR;',
      )
      .replace('#include <opaque_fragment>', chunk(f));
  };
  mat.customProgramCacheKey = () => `${prevKey}|${key}`;
  return (t) => {
    // Reduced motion holds one moment: the band mid-body, the stars at full size.
    uniforms.uGemTime.value = reducedMotion() ? GEM_LOOK.stillAt : t;
  };
}

/** Hang a finish on a spec: its `extras` (if any) still run, then the finish patches the body. */
export function withGemFinish(spec: SpeciesSpec, f: GemFinish): void {
  if (!f.jewel && !f.metal && !f.shiny) return;
  const before = spec.extras;
  spec.extras = (rig: RigContext) => {
    const own = before?.(rig);
    const tick = applyGemFinish(rig.mat, Object.values(rig.meshes), f);
    return (t, pose) => {
      own?.(t, pose);
      tick(t);
    };
  };
}
