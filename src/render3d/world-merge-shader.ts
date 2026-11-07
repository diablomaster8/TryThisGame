/**
 * The merged program of `world-merge.ts`: the first piece's own shader hooks replayed, then the
 * per-piece reads (colour, glow, normal strength, ground flag, a lantern post's fade) from the
 * data texture into flat varyings, and the branch that samples each piece's texture set.
 */
import * as THREE from 'three';

/**
 * Hook uniforms (floats) read per piece, each with the value that leaves its hook doing
 * nothing: a lantern post's fade (`crowns.ts`: 1 and 0, no dither), a roof's snow
 * (`dress-d4.ts`: 0, no whitening) and the occluder boxes' count (`occluders.ts`: 0, no box).
 * A piece whose material lacks the hook reads the neutral value, so pieces with and without
 * these hooks share one program (`OPTIONAL_HOOKS`).
 */
export const PER_PIECE_FLOATS = [
  ['uCrownFade', 1],
  ['uCrownWhole', 0],
  ['uSnowAmt', 0],
  ['uObxN', 0],
] as const;

/**
 * Program-key parts of the hooks that `PER_PIECE_FLOATS` can switch off, and the shared
 * (scene-wide) uniforms each adds besides those floats.
 */
export const OPTIONAL_HOOKS: Record<string, readonly string[]> = {
  'crown-dither': ['uCrownHole', 'uCrownHole2'],
  d4roof: [],
  occlude: ['uObxA', 'uObxB', 'uObxKeep'],
};

/**
 * The merged program: the representative's own hooks replayed (its `userData` left as it was),
 * then the per-piece numbers and the texture-set branch. Its hook and key cannot be patched
 * again by the dressings that patch materials they find in the scene (a roof's snow, the
 * occluder's dither): those patches are already in the replayed hooks where they belong.
 */
export function mergedMaterial(
  rep: THREE.MeshStandardMaterial,
  sets: [THREE.Texture | null, THREE.Texture | null][],
  data: THREE.DataTexture,
  normals: boolean,
  colours: boolean,
): THREE.MeshStandardMaterial {
  const mat = (rep as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial
    ? new THREE.MeshPhysicalMaterial()
    : new THREE.MeshStandardMaterial();
  const ud = rep.userData;
  rep.userData = {};
  try {
    mat.copy(rep);
  } finally {
    rep.userData = ud;
  }
  mat.map = sets[0]![0];
  mat.normalMap = sets[0]![1];
  mat.vertexColors = colours;
  const hook = rep.onBeforeCompile;
  const repKey = rep.customProgramCacheKey();
  const n = sets.length;
  const key = `${repKey}|wmerge${n}`;
  const compile = (
    shader: THREE.WebGLProgramParametersWithUniforms,
    r: THREE.WebGLRenderer,
  ): void => {
    replay(rep, hook, shader, r);
    patchMerged(shader, sets, data, normals);
    mat.userData.shader = shader;
  };
  Object.defineProperty(mat, 'onBeforeCompile', { get: () => compile, set: () => {} });
  Object.defineProperty(mat, 'customProgramCacheKey', { get: () => () => key, set: () => {} });
  return mat;
}

/** Run `rep`'s hook chain on `shader`, leaving `rep.userData` as it was. */
function replay(
  rep: THREE.Material,
  hook: THREE.Material['onBeforeCompile'],
  shader: THREE.WebGLProgramParametersWithUniforms,
  r: THREE.WebGLRenderer,
): void {
  const saved = { ...rep.userData };
  try {
    hook.call(rep, shader, r);
  } finally {
    for (const k of Object.keys(rep.userData)) if (!(k in saved)) delete rep.userData[k];
    Object.assign(rep.userData, saved);
  }
}

/**
 * Whether the merged program can be made from `rep`'s hooks: they are replayed on three's own
 * physical shader text and patched, as the compile will; a hook that rewrote what the patch
 * needs (a terrain painting its own colour) leaves the group unmerged.
 */
export function mergeable(
  rep: THREE.Material,
  sets: readonly [THREE.Texture | null, THREE.Texture | null][],
  r: THREE.WebGLRenderer,
): 'all' | 'colours' | false {
  const lib = THREE.ShaderLib.physical;
  const tryIt = (normals: boolean): boolean => {
    const probe = {
      uniforms: {},
      vertexShader: lib.vertexShader,
      fragmentShader: lib.fragmentShader,
      defines: {},
    } as unknown as THREE.WebGLProgramParametersWithUniforms;
    try {
      replay(rep, rep.onBeforeCompile, probe, r);
      patchMerged(probe, sets, new THREE.Texture(), normals);
      return true;
    } catch {
      return false;
    }
  };
  // A hook that does its own normal mapping (the terrain) keeps the material's strength: then
  // every piece must share it, and only one texture set can be drawn.
  return tryIt(true) ? 'all' : sets.length === 1 && tryIt(false) ? 'colours' : false;
}

/** Replace `target` in `src` once, or throw (the merged program must match the pieces'). */
function swap(src: string, target: string, by: string): string {
  if (!src.includes(target)) throw new Error(`world-merge: shader has no "${target}"`);
  return src.replace(target, by);
}

/** Add the per-piece reads and the texture-set branch to the replayed shader. */
export function patchMerged(
  shader: THREE.WebGLProgramParametersWithUniforms,
  sets: readonly [THREE.Texture | null, THREE.Texture | null][],
  data: THREE.Texture,
  normals = true,
): void {
  shader.uniforms.wmData = { value: data };
  const n = sets.length;
  const flat =
    'flat varying vec3 vWmColor;\nflat varying vec3 vWmEmis;\nflat varying vec3 vWmMore;\nflat varying vec4 vWmF;\nflat varying int vWmSet;';
  shader.vertexShader = swap(
    shader.vertexShader,
    '#include <common>',
    `#include <common>\nattribute float wmId;\nuniform highp sampler2D wmData;\n${flat}`,
  );
  shader.vertexShader = swap(
    shader.vertexShader,
    'void main() {',
    `void main() {
	int wmI = int( wmId + 0.5 );
	int wmP = wmI & 65535;
	vec4 wmA = texelFetch( wmData, ivec2( wmP, 0 ), 0 );
	// A piece hidden, off screen or drawing itself: its vertices fall outside the view.
	if ( wmA.w < 0.5 ) { gl_Position = vec4( 2.0, 2.0, 2.0, 1.0 ); return; }
	vec4 wmB = texelFetch( wmData, ivec2( wmP, 1 ), 0 );
	vec4 wmC = texelFetch( wmData, ivec2( wmP, 2 ), 0 );
	vWmColor = wmA.rgb;
	vWmEmis = wmB.rgb;
	vWmMore = vec3( wmC.xy, wmB.w );
	vWmF = texelFetch( wmData, ivec2( wmP, 3 ), 0 );
	vWmSet = wmI >> 16;`,
  );
  let decl = flat;
  for (let i = 1; i < n; i++) {
    if (sets[i]![0]) {
      decl += `\nuniform sampler2D wmMap${i};`;
      shader.uniforms[`wmMap${i}`] = { value: sets[i]![0] };
    }
    if (sets[i]![1]) {
      decl += `\nuniform sampler2D wmNormal${i};`;
      shader.uniforms[`wmNormal${i}`] = { value: sets[i]![1] };
    }
  }
  let fs = swap(shader.fragmentShader, '#include <common>', `#include <common>\n${decl}`);
  fs = swap(
    fs,
    'vec4 diffuseColor = vec4( diffuse, opacity );',
    'vec4 diffuseColor = vec4( vWmColor, opacity );',
  );
  fs = swap(fs, 'vec3 totalEmissiveRadiance = emissive;', 'vec3 totalEmissiveRadiance = vWmEmis;');
  if (fs.includes('uOccIsGround > 0.5')) fs = fs.replace('uOccIsGround > 0.5', 'vWmMore.z > 0.5');
  PER_PIECE_FLOATS.forEach(([name], i) => {
    const decl = `uniform float ${name};`;
    if (!fs.includes(decl)) return;
    fs = fs.replace(decl, '').replace(new RegExp(`\\b${name}\\b`, 'g'), `vWmF.${'xyzw'[i]}`);
  });
  // Each piece samples its own set; the derivatives are taken outside the branch.
  const pick = (tex: 'map' | 'normal', uvName: string): string => {
    let s = `wm${tex}Dx = dFdx( ${uvName} ); wm${tex}Dy = dFdy( ${uvName} );\n`;
    const base = tex === 'map' ? 'map' : 'normalMap';
    for (let i = n - 1; i >= 1; i--) {
      const has = tex === 'map' ? sets[i]![0] : sets[i]![1];
      if (!has) continue;
      const u = tex === 'map' ? `wmMap${i}` : `wmNormal${i}`;
      s += `if ( vWmSet == ${i} ) wm${tex}S = textureGrad( ${u}, ${uvName}, wm${tex}Dx, wm${tex}Dy ); else `;
    }
    return `${s}wm${tex}S = textureGrad( ${base}, ${uvName}, wm${tex}Dx, wm${tex}Dy );`;
  };
  if (sets[0]![0] && n > 1) {
    // One set needs no branch: the hooks' own sampling (a terrain's) stays as it is.
    const chunk = THREE.ShaderChunk.map_fragment.replace(
      'vec4 sampledDiffuseColor = texture2D( map, vMapUv );',
      `vec2 wmmapDx; vec2 wmmapDy; vec4 wmmapS;\n${pick('map', 'vMapUv')}\nvec4 sampledDiffuseColor = wmmapS;`,
    );
    fs = swap(fs, '#include <map_fragment>', chunk);
  }
  if (sets[0]![1] && normals) {
    let chunk = THREE.ShaderChunk.normal_fragment_maps.replace(
      'mapN.xy *= normalScale;',
      'mapN.xy *= vWmMore.xy;',
    );
    if (n > 1)
      chunk = chunk.replace(
        'vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;',
        `vec2 wmnormalDx; vec2 wmnormalDy; vec4 wmnormalS;\n${pick('normal', 'vNormalMapUv')}\nvec3 mapN = wmnormalS.xyz * 2.0 - 1.0;`,
      );
    fs = swap(fs, '#include <normal_fragment_maps>', chunk);
  }
  shader.fragmentShader = fs;
}
