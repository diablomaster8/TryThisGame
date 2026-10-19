import * as THREE from 'three';
import { fbm, ridged, vnoise } from '../render/paint/noise';
import { hex, Raster, type RGB } from '../render/paint/raster';
import { sculpt, type Prim } from './sculpted';
import { defineRule } from './sculpt-rules';

/**
 * The creature toolkit the species format builds with: triplanar surface materials,
 * shell fur, the smoke shell, baked-colour helpers (gradient, stripes, spots), the eye
 * rig, pivoted parts, blink and breathe. The five hand-built sample creatures that
 * used to live here are in `creatures-legacy.ts`, for reference only.
 */
export interface Creature {
  group: THREE.Group;
  name: string;
  animate(t: number): void;
}

// ---------------------------------------------------------------- surface detail

type Detail = 'fur' | 'scale' | 'leaf' | 'plate' | 'smooth' | 'facet';

/** A repeatable 0..1 value per cell, so the facet lattice tiles without a seam. */
function cellHash(a: number, b: number, salt: number): number {
  const n = Math.sin(a * 127.1 + b * 311.7 + salt * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

interface DetailMaps {
  albedo: THREE.CanvasTexture;
  normal: THREE.DataTexture;
}

const detailCache = new Map<Detail, DetailMaps>();

function paintDetail(kind: Detail): DetailMaps {
  const cached = detailCache.get(kind);
  if (cached) return cached;
  const s = 256;
  const r = new Raster(s, s, hex('#808080'));
  const height = new Float32Array(s * s);
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const ax = Math.cos((x / s) * Math.PI * 2) * 1.5;
      const ay = Math.sin((x / s) * Math.PI * 2) * 1.5;
      const bx = Math.cos((y / s) * Math.PI * 2) * 1.5;
      const by = Math.sin((y / s) * Math.PI * 2) * 1.5;
      const n = fbm(ax + bx + 3, ay + by + 3, 3, 81);
      let v: number;
      let h: number;
      switch (kind) {
        case 'fur': {
          const strand = Math.abs(vnoise(x / 2.2 + n * 6, y / 26, 82) - 0.5);
          const clump = fbm(x / 30, y / 18, 2, 83);
          v = 0.42 + (strand < 0.08 ? 0.22 : 0) + clump * 0.18;
          h = strand < 0.08 ? 0.8 : 0.35 + clump * 0.3;
          break;
        }
        case 'scale': {
          const cell = vnoise(x / 18 + (Math.floor(y / 18) % 2) * 0.5, y / 18, 84);
          const edge = Math.abs(cell - 0.5) < 0.05;
          v = 0.5 + (cell - 0.5) * 0.25 - (edge ? 0.2 : 0);
          h = edge ? 0.15 : 0.5 + (cell - 0.5) * 0.6;
          break;
        }
        case 'leaf': {
          const vein =
            Math.abs(vnoise(x / 40, y / 6, 85) - 0.5) < 0.02 || Math.abs((x % 64) - 32) < 1.5;
          v = 0.5 + n * 0.14 - (vein ? 0.16 : 0);
          h = vein ? 0.3 : 0.5 + n * 0.3;
          break;
        }
        case 'plate': {
          const px = x % 64;
          const py = y % 48;
          const seam = px < 3 || py < 3;
          const rivet = Math.hypot(px - 10, py - 10) < 4 || Math.hypot(px - 54, py - 38) < 4;
          const wear = ridged(x / 9, y / 9, 3, 86);
          v = 0.5 + (wear > 0.85 ? 0.18 : 0) - (seam ? 0.25 : 0) + (rivet ? 0.12 : 0);
          h = seam ? 0.1 : rivet ? 0.9 : 0.55 + fbm(x / 12, y / 12, 2, 87) * 0.2;
          break;
        }
        case 'facet': {
          // A jittered lattice of cells, each a flat plane with its own tilt, so the normal
          // breaks at every cell edge like a cut stone; the edges catch a bright line.
          const cs = 32;
          const cells = s / cs;
          const cx = Math.floor(x / cs);
          const cy = Math.floor(y / cs);
          let d1 = 1e9;
          let d2 = 1e9;
          let plane = 0.5;
          let tone = 0;
          for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
              const gx = cx + i;
              const gy = cy + j;
              const kx = ((gx % cells) + cells) % cells;
              const ky = ((gy % cells) + cells) % cells;
              const sx = (gx + 0.2 + cellHash(kx, ky, 1) * 0.6) * cs;
              const sy = (gy + 0.2 + cellHash(kx, ky, 2) * 0.6) * cs;
              const d = Math.hypot(x - sx, y - sy);
              if (d < d1) {
                d2 = d1;
                d1 = d;
                const tx = (cellHash(kx, ky, 3) - 0.5) * 0.05;
                const ty = (cellHash(kx, ky, 4) - 0.5) * 0.05;
                plane = 0.5 + (x - sx) * tx + (y - sy) * ty;
                tone = cellHash(kx, ky, 5) - 0.5;
              } else if (d < d2) d2 = d;
            }
          }
          const edge = d2 - d1 < 2.4;
          v = edge ? 0.92 : 0.48 + tone * 0.14;
          h = edge ? plane - 0.1 : plane;
          break;
        }
        default:
          v = 0.5 + (n - 0.5) * 0.1;
          h = 0.5 + (n - 0.5) * 0.3;
      }
      const c: RGB = [v, v, v];
      r.set(x, y, c);
      height[y * s + x] = h;
    }
  }
  const albedo = r.toTexture(true);
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.magFilter = THREE.LinearFilter;
  albedo.minFilter = THREE.LinearMipmapLinearFilter;
  albedo.generateMipmaps = true;
  const data = new Uint8Array(s * s * 4);
  const strength =
    kind === 'facet' ? 9 : kind === 'plate' ? 5 : kind === 'scale' ? 4 : kind === 'fur' ? 2.5 : 2;
  const hh = (x: number, y: number) => height[((y + s) % s) * s + ((x + s) % s)]!;
  const nv = new THREE.Vector3();
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      nv.set(
        -(hh(x + 1, y) - hh(x - 1, y)) * strength,
        -(hh(x, y + 1) - hh(x, y - 1)) * strength,
        1,
      ).normalize();
      const i = (y * s + x) * 4;
      data[i] = Math.round((nv.x * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((nv.y * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((nv.z * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  const normal = new THREE.DataTexture(data, s, s);
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  normal.magFilter = THREE.LinearFilter;
  normal.minFilter = THREE.LinearMipmapLinearFilter;
  normal.generateMipmaps = true;
  normal.needsUpdate = true;
  const maps = { albedo, normal };
  detailCache.set(kind, maps);
  return maps;
}

export interface SurfaceOpts {
  detail: Detail;
  scale?: number;
  amount?: number;
  bump?: number;
  roughness?: number;
  sheen?: number;
  sheenColor?: string;
  clearcoat?: number;
  glowStrength?: number;
  /** Flat two-band toon shading for this surface; the stage's `&toon` flag when left out. */
  toon?: boolean;
}

// ---------------------------------------------------------------- the toon mode

/**
 * The toon stage mode (`&toon`): the hard-edged, flat-shaded, outlined look of Maor's
 * "Chao World" line-up. Direct light falls in two bands, specular, sheen and the triplanar
 * grain are gone, the lash and mouth lines are thick and dark, and every opaque creature
 * mesh carries an inverted-hull outline. The stage sets `on` before it builds its
 * creatures; it is off by default, so nothing changes without the flag. `rim` adds a soft
 * light rim on the silhouette (the Full 3D Grove uses it so a creature in shade still
 * separates from the grass); it is read when a material is made, like `on`. `sky` lets
 * that share of the sky's soft diffuse light back in (no reflections): the stage's flats
 * keep none, but the Grove is lit mostly by its sky, and without it a creature in the
 * shade band or with the sun low went near black.
 */
export const TOON = { on: false, rim: 0, sky: 0 };

/** The outline's colour (also the lash and mouth lines) and its thickness in world units. */
export const TOON_OUTLINE = { color: '#1a1026', width: 0.025 };

/**
 * The two bands on the light's dot product: where the lit band ends, and how bright each
 * band is against the stage's sun. Lights behind the surface give nothing.
 */
const TOON_BAND = { edge: 0.3, lit: 0.95, shade: 0.62 };

/**
 * Patch a physical shader into the toon ramp: direct light in two bands, no specular, and
 * the vertex colours a touch more saturated so the flats read like painted plastic.
 */
export function toonShader(shader: { fragmentShader: string }, rim = 0, sky = 0): void {
  const physical = THREE.ShaderChunk.lights_physical_pars_fragment.replace(
    'vec3 irradiance = dotNL * directLight.color;',
    `vec3 irradiance = ( dotNL <= 0.0 ? 0.0 : dotNL < ${TOON_BAND.edge.toFixed(3)} ? ${TOON_BAND.shade.toFixed(3)} : ${TOON_BAND.lit.toFixed(3)} ) * directLight.color;`,
  );
  // The rim: a light band where the surface turns away from the eye, stepped like the
  // bands so it reads as paint, not as a glow. It is lit by the fill, so it dims at night.
  const rimLight =
    rim > 0
      ? `{
        float facing = clamp( dot( geometryNormal, geometryViewDir ), 0.0, 1.0 );
        float band = smoothstep( 0.34, 0.26, facing );
        float fill = 0.6;
        #if NUM_HEMI_LIGHTS > 0
          fill = clamp( dot( hemisphereLights[ 0 ].skyColor, vec3( 1.0 ) ), 0.15, 1.0 );
        #endif
        reflectedLight.indirectDiffuse += diffuseColor.rgb * band * fill * ${rim.toFixed(3)};
      }`
      : '';
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <lights_physical_pars_fragment>', physical)
    // No image-based reflections: the sky map carries the sun disc, and even a twentieth of
    // it washes every flat to pastel and hides the bands. The hemisphere light stays as
    // fill, and `sky` lets that share of the sky's diffuse light in.
    .replace(
      '#include <lights_fragment_maps>',
      sky > 0
        ? `#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
            irradiance += getIBLIrradiance( geometryNormal ) * ${sky.toFixed(3)};
          #endif`
        : '',
    )
    .replace(
      '#include <lights_fragment_end>',
      `#include <lights_fragment_end>
      reflectedLight.directSpecular = vec3( 0.0 );
      reflectedLight.indirectSpecular = vec3( 0.0 );
      ${rimLight}`,
    )
    .replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      {
        float lum = dot( diffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) );
        diffuseColor.rgb = clamp( mix( vec3( lum ), diffuseColor.rgb, 1.2 ), 0.0, 1.0 );
      }`,
    );
}

/** Turn a plain physical material (an eye, a lid, a lip) into a flat toon surface. */
export function toonMaterial(m: THREE.MeshPhysicalMaterial): THREE.MeshPhysicalMaterial {
  m.roughness = 1;
  m.clearcoat = 0;
  m.sheen = 0;
  m.specularIntensity = 0;
  const { rim, sky } = TOON;
  m.onBeforeCompile = (shader) => toonShader(shader, rim, sky);
  // Every toon patch has the same function text, so three would share one program between
  // rims; the key keeps them apart.
  m.customProgramCacheKey = () => `toon|${rim}|${sky}`;
  return m;
}

/** A material is `toonMaterial`-ed only when the mode is on; otherwise left as built. */
const flat = (m: THREE.MeshPhysicalMaterial): THREE.MeshPhysicalMaterial =>
  TOON.on ? toonMaterial(m) : m;

/**
 * The inverted-hull outline: every opaque mesh under `root` gets a back-face copy of its
 * geometry pushed out along the normals in view space, so the silhouette and every crease
 * between parts carry a dark line of the same width whatever the part's scale.
 */
export function outline(
  root: THREE.Object3D,
  width = TOON_OUTLINE.width,
  color = TOON_OUTLINE.color,
): void {
  const mat = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uWidth = { value: width };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWidth;')
      .replace(
        '#include <project_vertex>',
        `vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
        mvPosition.xyz += normalize( normalMatrix * normal ) * uWidth;
        gl_Position = projectionMatrix * mvPosition;`,
      );
  };
  const hosts: THREE.Mesh[] = [];
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh) || o.userData.hull || o.userData.noOutline) return;
    const m = o.material as THREE.Material | THREE.Material[];
    if (Array.isArray(m) || m.transparent) return;
    hosts.push(o);
  });
  for (const o of hosts) {
    const hull = new THREE.Mesh(o.geometry, mat);
    hull.userData.hull = true;
    hull.castShadow = false;
    hull.receiveShadow = false;
    hull.frustumCulled = o.frustumCulled;
    o.add(hull);
  }
}

const TRIPLANAR_PARS = `
  uniform sampler2D uDetail;
  uniform sampler2D uDetailN;
  uniform float uScale;
  uniform float uAmount;
  uniform float uBump;
  uniform float uGlowStrength;
  uniform mat3 normalMatrix;
  varying vec3 vObjPos;
  varying vec3 vObjNrm;
  varying float vGlow;
  vec3 triW() { vec3 w = pow( abs( vObjNrm ), vec3( 4.0 ) ); return w / ( w.x + w.y + w.z + 1e-5 ); }`;

/** Vertex colours for regions, triplanar detail, sheen/clearcoat, and glow from the attribute. */
export function surfaceMaterial(o: SurfaceOpts): THREE.MeshPhysicalMaterial {
  const maps = paintDetail(o.detail);
  const toon = o.toon ?? TOON.on;
  const rim = toon ? TOON.rim : 0;
  const sky = toon ? TOON.sky : 0;
  const m = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: toon ? 1 : (o.roughness ?? 0.6),
    metalness: 0,
    sheen: toon ? 0 : (o.sheen ?? 0.3),
    sheenColor: new THREE.Color(o.sheenColor ?? '#ffffff'),
    sheenRoughness: 0.7,
    clearcoat: toon ? 0 : (o.clearcoat ?? 0.08),
    clearcoatRoughness: 0.35,
    ...(toon ? { specularIntensity: 0 } : {}),
  });
  m.onBeforeCompile = (shader) => {
    m.userData.shader = shader;
    shader.uniforms.uDetail = { value: maps.albedo };
    shader.uniforms.uDetailN = { value: maps.normal };
    shader.uniforms.uScale = { value: o.scale ?? 1.6 };
    // The toon ramp wants flat colour: no grain, no bump.
    shader.uniforms.uAmount = { value: toon ? 0 : (o.amount ?? 0.6) };
    shader.uniforms.uBump = { value: toon ? 0 : (o.bump ?? 0.6) };
    shader.uniforms.uGlowStrength = { value: o.glowStrength ?? 0 };
    if (toon) toonShader(shader, rim, sky);
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nattribute float glow;\nvarying vec3 vObjPos;\nvarying vec3 vObjNrm;\nvarying float vGlow;',
      )
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvObjPos = position;\nvObjNrm = normal;\nvGlow = glow;',
      );
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${TRIPLANAR_PARS}`)
      .replace(
        '#include <map_fragment>',
        `{
          vec3 w = triW();
          vec3 d = texture2D( uDetail, vObjPos.yz * uScale ).rgb * w.x
                 + texture2D( uDetail, vObjPos.xz * uScale ).rgb * w.y
                 + texture2D( uDetail, vObjPos.xy * uScale ).rgb * w.z;
          diffuseColor.rgb *= mix( vec3( 1.0 ), d * 2.0, uAmount );
        }`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `{
          vec3 w = triW();
          vec3 tx = texture2D( uDetailN, vObjPos.yz * uScale ).xyz * 2.0 - 1.0;
          vec3 ty = texture2D( uDetailN, vObjPos.xz * uScale ).xyz * 2.0 - 1.0;
          vec3 tz = texture2D( uDetailN, vObjPos.xy * uScale ).xyz * 2.0 - 1.0;
          vec3 bump = ( vec3( 0.0, tx.x, tx.y ) * w.x + vec3( ty.x, 0.0, ty.y ) * w.y + vec3( tz.x, tz.y, 0.0 ) * w.z ) * uBump;
          vec3 nO = normalize( normalize( vObjNrm ) + bump );
          normal = normalize( normalMatrix * nO );
          #ifdef DOUBLE_SIDED
            normal = normal * faceDirection;
          #endif
        }`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vColor.rgb * vGlow * uGlowStrength;',
      );
  };
  // The toon and the physical surface share this function's text; without a key of their
  // own, the first one linked would serve both.
  m.customProgramCacheKey = () => `surface|${toon ? 1 : 0}|${rim}|${sky}`;
  return m;
}

/**
 * Shell fur: the body drawn again several times, each shell pushed out along the
 * normal and thinned by a 3D hash, so the silhouette breaks into soft strands and the
 * surface reads as fluff instead of plastic. The strands lighten toward the tips.
 */
export function furShells(
  parent: THREE.Object3D,
  mesh: THREE.Mesh,
  layers: number,
  length: number,
  tipLift: number,
  cellFreq = 46,
  directional = false,
): THREE.Mesh[] {
  const shells: THREE.Mesh[] = [];
  for (let i = 1; i <= layers; i++) {
    const f = i / layers;
    const m = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.85,
      sheen: 1,
      sheenColor: new THREE.Color('#fff2e0'),
      sheenRoughness: 0.6,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
    });
    if (directional) m.defines = { FUR_DIR: '' };
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uShell = { value: f };
      shader.uniforms.uLen = { value: length };
      shader.uniforms.uLift = { value: tipLift };
      shader.uniforms.uCell = { value: cellFreq };
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform float uShell;\nuniform float uLen;\nvarying vec3 vObjPos;\n#ifdef FUR_DIR\nattribute float furLen;\nattribute vec3 furDir;\n#endif',
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           vObjPos = position;
           #ifdef FUR_DIR
             vec3 grow = normalize( mix( normalize( normal ), normalize( furDir ), 0.65 ) );
             transformed += grow * uShell * uLen * furLen * 1.6 + vec3( 0.0, -0.25 * uShell * uShell * uLen * furLen, 0.0 );
           #else
             transformed += normalize( normal ) * uShell * uLen + vec3( 0.0, -0.35 * uShell * uShell * uLen, 0.0 );
           #endif`,
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          '#include <common>\nuniform float uShell;\nuniform float uLift;\nuniform float uCell;\nvarying vec3 vObjPos;',
        )
        .replace(
          '#include <alphatest_fragment>',
          `{
            vec3 cell = floor( vObjPos * uCell );
            float hsh = fract( sin( dot( cell, vec3( 12.9898, 78.233, 37.719 ) ) ) * 43758.5453 );
            if ( hsh < uShell * 0.92 ) discard;
            diffuseColor.rgb *= ( 1.0 + uLift * uShell ) * mix( vec3( 1.0 ), vec3( 1.12, 1.06, 0.96 ), uShell );
          }
          #include <alphatest_fragment>`,
        );
    };
    const shell = new THREE.Mesh(mesh.geometry, m);
    shell.position.copy(mesh.position);
    shell.rotation.copy(mesh.rotation);
    shell.scale.copy(mesh.scale);
    shell.castShadow = false;
    shell.receiveShadow = true;
    parent.add(shell);
    shells.push(shell);
  }
  return shells;
}

// ---------------------------------------------------------------- colour helpers

export type Shade = (p: THREE.Vector3, n: THREE.Vector3, c: THREE.Color, nearest: Prim) => void;

/** Light from above baked in: tops brighter, undersides in shadow; plus a height roll-off. */
function gradientShade(top = 1.12, bottom = 0.62, yMin = 0, yMax = 3): Shade {
  return (p, n, c) => {
    const up = THREE.MathUtils.clamp(n.y * 0.5 + 0.5, 0, 1);
    const h = THREE.MathUtils.clamp((p.y - yMin) / (yMax - yMin), 0, 1);
    c.multiplyScalar(THREE.MathUtils.lerp(bottom, top, up * 0.65 + h * 0.35));
  };
}

// Named, so a sculpt that uses them can be posted to a worker (see sculpt-rules.ts).
export const gradient = defineRule('gradient', gradientShade);
export const stripes = defineRule('stripes', stripesShade);
export const spots = defineRule('spots', spotsShade);

export function combine(...shades: Shade[]): Shade {
  return (p, n, c, q) => {
    for (const s of shades) s(p, n, c, q);
  };
}

/** Stripes across an axis, blended toward a colour. */
function stripesShade(
  axis: 'x' | 'y' | 'z',
  freq: number,
  width: number,
  color: string,
  tags: string[],
  amount = 0.85,
): Shade {
  const col = new THREE.Color(color);
  return (p, _n, c, q) => {
    if (!tags.includes(q.tag ?? '')) return;
    const v = axis === 'x' ? p.x : axis === 'y' ? p.y : p.z;
    const s = Math.abs(Math.sin(v * freq + fbm(p.x * 2, p.z * 2, 2, 90) * 1.2));
    if (s < width) c.lerp(col, amount * (1 - s / width));
  };
}

/** Spots from a value-noise field, blended toward a colour. */
function spotsShade(
  scale: number,
  threshold: number,
  color: string,
  tags: string[],
  seed = 91,
): Shade {
  const col = new THREE.Color(color);
  return (p, _n, c, q) => {
    if (!tags.includes(q.tag ?? '')) return;
    const v = vnoise(p.x * scale + seed, (p.y + p.z * 0.7) * scale, seed);
    if (v > threshold) c.lerp(col, Math.min(1, (v - threshold) * 6));
  };
}

// ---------------------------------------------------------------- parts

export function glossy(
  color: string,
  extra: Partial<THREE.MeshPhysicalMaterialParameters> = {},
): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    ...extra,
  });
}

export function add(
  parent: THREE.Object3D,
  m: THREE.Mesh,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

const irisCache = new Map<string, THREE.CanvasTexture>();

/** A painted iris: a big dark pupil, a coloured ring lit from below, a dark limbal rim, catchlights. */
function irisTexture(color: string): THREE.CanvasTexture {
  const cached = irisCache.get(color);
  if (cached) return cached;
  const s = 128;
  const r = new Raster(s, s, null);
  r.tracking = true;
  const base = hex(color);
  const c = s / 2;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const d = Math.hypot(x - c, y - c) / c;
      if (d > 1) continue;
      const lit = THREE.MathUtils.clamp((y - c) / c, -1, 1) * 0.5 + 0.5;
      let k = 0.45 + lit * 1.0;
      if (d > 0.86) k *= 0.3;
      const a = Math.atan2(y - c, x - c);
      if (Math.abs(Math.sin(a * 12)) > 0.94 && d > 0.58 && d < 0.84) k *= 1.2;
      let col: RGB = [Math.min(1, base[0] * k), Math.min(1, base[1] * k), Math.min(1, base[2] * k)];
      // A large pupil with a soft edge.
      const pupil = THREE.MathUtils.clamp((0.56 - d) / 0.05, 0, 1);
      col = [
        col[0] + (0.04 - col[0]) * pupil,
        col[1] + (0.04 - col[1]) * pupil,
        col[2] + (0.06 - col[2]) * pupil,
      ];
      r.set(x, y, col);
    }
  }
  r.disc(c - s * 0.2, c - s * 0.22, s * 0.13, hex('#ffffff'));
  r.disc(c + s * 0.2, c + s * 0.22, s * 0.055, hex('#ffffff'));
  r.tracking = false;
  const t = r.toTexture(false);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  irisCache.set(color, t);
  return t;
}

/** The movable pieces of one eye, for blinks and expressions. */
export interface EyeRig {
  group: THREE.Group;
  /** Upper lid: a shell on the dome that `setLid` grows down over it, 0 open to 1 shut. */
  lid: THREE.Mesh;
  /** Lower lid: the same shell from below; a squint raises it toward the middle. */
  lower: THREE.Mesh;
  /** The upturned lash line shown over a closed happy eye. */
  arc: THREE.Mesh;
  /** The brow ridge; `userData.baseY` and `userData.r` size its lift and tilt. */
  brow: THREE.Mesh;
  /** The iris disc in its own group, slid about the eye to look; the catchlight is not in it. */
  iris: THREE.Object3D;
  /** Everything that makes the open eye: hidden when the eye shuts into the arc, so the skin shows. */
  ball: THREE.Object3D[];
}

/**
 * A round cartoon eye in the manner of a modern creature collector: a glossy dome
 * sitting proud of the face, a big iris with a large dark pupil that hugs the dome, a
 * thin ring of white around it, a bold catchlight, a thin dark line along the top lid,
 * and a hinged lid of body colour. The group's +z is the direction the eye faces, so a
 * caller places it on the face and aims it along the surface normal.
 */
export function eye(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  r: number,
  iris: string,
  lidColor: string,
  yaw: number,
  lid = 0.25,
  irisScale = 0.8,
  pitch = 0,
  tall = 1.2,
): EyeRig {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.set(pitch, yaw, 0);
  // The dome: a flattened eyeball whose centre sits a little behind the face, so the
  // rim is buried and only the front shows.
  const depth = 0.7;
  const back = -r * 0.42;
  const white = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(r, 36, 28),
      flat(glossy('#fbfbff', { roughness: 0.06, emissive: '#ffffff', emissiveIntensity: 0.1 })),
    ),
    0,
    0,
    back,
  );
  // In the toon mode the lash line and the happy arc are thick and dark, as the line-up
  // draws them; otherwise a thin liner.
  const line = TOON.on ? 0.11 : 0.045;
  const lineColor = TOON.on ? TOON_OUTLINE.color : '#241a24';
  white.scale.set(1, tall, depth);
  white.castShadow = false;
  // A disc of concentric rings bent onto the dome, so the iris and its catchlight hug
  // the eyeball instead of cutting through it.
  const domeDisc = (radius: number, sy: number, ox: number, oy: number, lift: number) => {
    const rings = 12;
    const segs = 48;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const push = (x: number, y: number) => {
      const px = x + ox;
      const py = y * sy + oy;
      const q = Math.max(0, r * r - px * px - (py / tall) * (py / tall));
      pos.push(px, py, back + depth * Math.sqrt(q) + lift);
      uv.push((x / radius) * 0.5 + 0.5, (y / radius) * 0.5 + 0.5);
    };
    push(0, 0);
    for (let j = 1; j <= rings; j++) {
      const rr = (radius * j) / rings;
      for (let i = 0; i < segs; i++) {
        const a = (i / segs) * Math.PI * 2;
        push(Math.cos(a) * rr, Math.sin(a) * rr);
      }
    }
    for (let i = 0; i < segs; i++) idx.push(0, 1 + i, 1 + ((i + 1) % segs));
    for (let j = 1; j < rings; j++) {
      for (let i = 0; i < segs; i++) {
        const a = 1 + (j - 1) * segs + i;
        const b = 1 + (j - 1) * segs + ((i + 1) % segs);
        const c = a + segs;
        const d = b + segs;
        idx.push(a, c, d, a, d, b);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  };
  const disc = new THREE.Mesh(
    domeDisc(r * irisScale, tall * 0.96, 0, -r * 0.02, r * 0.012),
    new THREE.MeshPhysicalMaterial({
      map: irisTexture(iris),
      emissive: '#ffffff',
      emissiveMap: irisTexture(iris),
      emissiveIntensity: 0.3,
      transparent: true,
      roughness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
  );
  disc.castShadow = false;
  // The iris group slides about on the dome to look at things; the catchlight below stays
  // put in the eye group because it is a reflection of the sky, not part of the iris.
  const irisGroup = new THREE.Group();
  irisGroup.userData = { r, tall, depth };
  irisGroup.add(disc);
  g.add(irisGroup);
  // The catchlight: a bold white spot high on the eye, slightly over the iris edge.
  const gloss = new THREE.Mesh(
    domeDisc(r * 0.17, 0.8, -r * 0.34, r * 0.4, r * 0.02),
    new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.92 }),
  );
  gloss.castShadow = false;
  g.add(gloss);
  // The liner: a thin dark line where the top lid meets the eye.
  const liner = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(r * 0.8, r * line, 8, 32, Math.PI),
      flat(new THREE.MeshPhysicalMaterial({ color: lineColor, roughness: 0.5 })),
    ),
    0,
    0,
    r * 0.03,
  );
  liner.scale.set(1, tall, 0.4);
  liner.castShadow = false;
  // The lid: a shell a tenth outside the dome (room for an iris that has slid to look),
  // with the dome's own proportions, that starts as a cap at the top (the species' `lid`
  // amount hanging at rest) and closes by growing down over the eye. A shell that hugs the dome never pokes the white out
  // or bulges forward, which a tilted rigid cap did on tall eyes.
  const lidMat = flat(
    new THREE.MeshPhysicalMaterial({ color: lidColor, roughness: 0.6, sheen: 0.3 }),
  );
  const lidMesh = add(g, new THREE.Mesh(lidShell(r * 1.1), lidMat), 0, 0, back);
  lidMesh.scale.set(1, tall, depth + 0.07);
  lidMesh.userData.open = (0.05 + lid * 0.5) * Math.PI;
  lidMesh.userData.closed = LID_SHUT;
  setLid(lidMesh, 0);
  // The lower lid: the same shell from below, rising a little for a squint.
  const lowerWrap = new THREE.Group();
  lowerWrap.rotation.z = Math.PI;
  g.add(lowerWrap);
  const lower = add(lowerWrap, new THREE.Mesh(lidShell(r * 1.1), lidMat), 0, 0, back);
  lower.scale.set(1, tall, depth + 0.07);
  lower.userData.open = 0.07 * Math.PI;
  lower.userData.closed = LID_SHUT;
  setLid(lower, 0);
  // The happy arc: the upturned lash line drawn over a closed eye.
  const arc = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(r * 0.78, r * Math.max(line, 0.065), 8, 24, Math.PI),
      flat(new THREE.MeshPhysicalMaterial({ color: lineColor, roughness: 0.5 })),
    ),
    0,
    r * 0.05,
    r * 0.12,
  );
  arc.scale.set(1, tall * 0.9, 0.5);
  arc.visible = false;
  arc.castShadow = false;
  // The brow: a skin ridge above the eye that tilts and lifts with the mood.
  const brow = add(
    g,
    new THREE.Mesh(
      new THREE.CapsuleGeometry(r * 0.085, r * 0.95, 4, 10),
      flat(
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(lidColor).multiplyScalar(0.88),
          roughness: 0.7,
        }),
      ),
    ),
    0,
    r * tall * 1.1,
    r * 0.2,
  );
  brow.rotation.z = Math.PI / 2;
  brow.userData.baseY = r * tall * 1.1;
  brow.userData.r = r;
  brow.castShadow = false;
  parent.add(g);
  return {
    group: g,
    lid: lidMesh,
    lower,
    arc,
    brow,
    iris: irisGroup,
    ball: [white, disc, gloss, liner, lidMesh, lowerWrap],
  };
}

export interface Part {
  mesh: THREE.Mesh;
  pivot: THREE.Group;
}

/** A sculpted sub-part hung from a pivot so it can sway. */
export function part(
  parent: THREE.Object3D,
  prims: Prim[],
  blend: number,
  box: [THREE.Vector3, THREE.Vector3],
  mat: THREE.Material,
  pivotAt: THREE.Vector3,
  res = 72,
  shade?: Shade,
): Part {
  const geo = sculpt({ prims, blend, min: box[0], max: box[1], ...(shade ? { shade } : {}) }, res);
  geo.translate(-pivotAt.x, -pivotAt.y, -pivotAt.z);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const pivot = new THREE.Group();
  pivot.position.copy(pivotAt);
  pivot.add(mesh);
  parent.add(pivot);
  return { mesh, pivot };
}

export function breathe(g: THREE.Group, base: number, t: number, rate = 2.2, amount = 0.012): void {
  g.scale.y = base * (1 + Math.sin(t * rate) * amount);
}

// ---------------------------------------------------------------- the five

/** A quick blink every few seconds: the lids drop over the eye and lift again. */
export function blink(lids: THREE.Mesh[], t: number, phase: number, every = 4.2): void {
  const cycle = (t + phase) % every;
  const k = cycle < 0.2 ? Math.sin((cycle / 0.2) * Math.PI) : 0;
  for (const l of lids) setLid(l, k);
}

/** The polar reach of a shut lid: past the equator, so the dome's whole front is covered. */
const LID_SHUT = 0.92 * Math.PI;
const LID_SEGS = 24;
const LID_ROWS = 10;

/** A lid's shell: a sphere cap whose rows `setLid` moves down the dome as it closes. */
function lidShell(radius: number): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, LID_SEGS, LID_ROWS, 0, Math.PI * 2, 0, 0.1);
  geo.userData.radius = radius;
  return geo;
}

/**
 * Close a lid (from `eye`) by `k`, 0 open to 1 shut: its cap grows from the species'
 * resting reach (`userData.open`) down to `userData.closed`, hugging the dome the whole
 * way. Rows are rewritten in place, so a lid that has not moved costs nothing.
 */
export function setLid(lid: THREE.Mesh, k: number): void {
  const open = lid.userData.open as number;
  const closed = lid.userData.closed as number;
  const reach = open + Math.min(1, Math.max(0, k)) * (closed - open);
  if (lid.userData.reach === reach) return;
  lid.userData.reach = reach;
  const geo = lid.geometry;
  const R = geo.userData.radius as number;
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const nor = geo.attributes.normal as THREE.BufferAttribute;
  let i = 0;
  for (let iy = 0; iy <= LID_ROWS; iy++) {
    const theta = (iy / LID_ROWS) * reach;
    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    for (let ix = 0; ix <= LID_SEGS; ix++, i++) {
      const phi = (ix / LID_SEGS) * Math.PI * 2;
      const x = -Math.cos(phi) * st;
      const z = Math.sin(phi) * st;
      pos.setXYZ(i, x * R, ct * R, z * R);
      nor.setXYZ(i, x, ct, z);
    }
  }
  pos.needsUpdate = true;
  nor.needsUpdate = true;
}

/** Thin vein capsules radiating inside a wing, so the membrane reads as a wing. */
export function wingVeins(pivot: THREE.Object3D, dx: number, color: string): void {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.6,
    transparent: true,
    opacity: 0.7,
  });
  for (let i = 0; i < 3; i++) {
    const a = 0.35 + i * 0.45;
    const len = 0.55 - i * 0.08;
    const v = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, len, 3, 6), m);
    v.position.set(Math.sin(a) * len * 0.5 * dx, Math.cos(a) * len * 0.5, 0.002);
    v.rotation.z = -a * dx;
    pivot.add(v);
  }
}

/**
 * A smoke shell: the body drawn once more, a little larger, as drifting vapour that
 * only shows at the silhouette (a Fresnel term) and breaks up with moving 3D noise.
 */
export function smokeShell(
  parent: THREE.Object3D,
  mesh: THREE.Mesh,
  color: string,
  time: { value: number },
): THREE.Mesh {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity: 1,
    roughness: 1,
    depthWrite: false,
    side: THREE.FrontSide,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.6,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uTime;\nvarying vec3 vObjPos;',
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vObjPos = position;
         float puff = 0.14 + 0.05 * sin( uTime * 1.7 + position.y * 3.0 );
         transformed += normalize( normal ) * puff;
         transformed.y += 0.04 * sin( uTime * 2.3 + position.x * 4.0 );`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         varying vec3 vObjPos;
         float hash3( vec3 p ) { return fract( sin( dot( p, vec3( 12.9898, 78.233, 37.719 ) ) ) * 43758.5453 ); }
         float noise3( vec3 p ) {
           vec3 i = floor( p ); vec3 f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
           return mix( mix( mix( hash3( i ), hash3( i + vec3( 1, 0, 0 ) ), f.x ), mix( hash3( i + vec3( 0, 1, 0 ) ), hash3( i + vec3( 1, 1, 0 ) ), f.x ), f.y ),
                       mix( mix( hash3( i + vec3( 0, 0, 1 ) ), hash3( i + vec3( 1, 0, 1 ) ), f.x ), mix( hash3( i + vec3( 0, 1, 1 ) ), hash3( i + vec3( 1, 1, 1 ) ), f.x ), f.y ), f.z );
         }`,
      )
      .replace(
        '#include <alphatest_fragment>',
        `{
          vec3 n = normalize( vNormal );
          vec3 v = normalize( vViewPosition );
          float rim = pow( 1.0 - max( dot( n, v ), 0.0 ), 2.2 );
          float wisps = noise3( vObjPos * 3.5 + vec3( 0.0, -uTime * 0.6, 0.0 ) ) * 0.6 + noise3( vObjPos * 9.0 + vec3( uTime * 0.3 ) ) * 0.4;
          diffuseColor.a = clamp( rim * 1.4 * smoothstep( 0.35, 0.75, wisps ), 0.0, 0.85 );
        }
        #include <alphatest_fragment>`,
      );
  };
  const shell = new THREE.Mesh(mesh.geometry, m);
  shell.castShadow = false;
  shell.receiveShadow = false;
  parent.add(shell);
  return shell;
}
