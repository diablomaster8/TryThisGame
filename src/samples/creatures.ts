import * as THREE from 'three';
import { fbm, ridged, vnoise } from '../render/paint/noise';
import { hex, Raster, type RGB } from '../render/paint/raster';
import { sculpt, V, type Prim } from './sculpted';

/**
 * Five creatures at a modern-console finish (`?aaa=1&creature=1..5`): each one a
 * sculpted single surface (see `sculpted.ts`) with its own silhouette and plenty of
 * secondary shape (tufts, ruffs, crests, plates, claws), colour that is baked rather
 * than flat (a light-to-shadow gradient over the body, markings, two-tone fur), a
 * surface detail map projected triplanar (fur, scales, leaf veins, armour plates, a
 * smooth glow) for albedo and normal detail without UVs, shell fur on the furred
 * ones, painted anime irises, and articulated pieces that idle-animate. The mood,
 * light and post come from the AAA stage.
 */
export interface Creature {
  group: THREE.Group;
  name: string;
  animate(t: number): void;
}

// ---------------------------------------------------------------- surface detail

type Detail = 'fur' | 'scale' | 'leaf' | 'plate' | 'smooth';

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
  const strength = kind === 'plate' ? 5 : kind === 'scale' ? 4 : kind === 'fur' ? 2.5 : 2;
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
  const m = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: o.roughness ?? 0.6,
    metalness: 0,
    sheen: o.sheen ?? 0.3,
    sheenColor: new THREE.Color(o.sheenColor ?? '#ffffff'),
    sheenRoughness: 0.7,
    clearcoat: o.clearcoat ?? 0.08,
    clearcoatRoughness: 0.35,
  });
  m.onBeforeCompile = (shader) => {
    m.userData.shader = shader;
    shader.uniforms.uDetail = { value: maps.albedo };
    shader.uniforms.uDetailN = { value: maps.normal };
    shader.uniforms.uScale = { value: o.scale ?? 1.6 };
    shader.uniforms.uAmount = { value: o.amount ?? 0.6 };
    shader.uniforms.uBump = { value: o.bump ?? 0.6 };
    shader.uniforms.uGlowStrength = { value: o.glowStrength ?? 0 };
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
            diffuseColor.rgb *= 1.0 + uLift * uShell;
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
export function gradient(top = 1.12, bottom = 0.62, yMin = 0, yMax = 3): Shade {
  return (p, n, c) => {
    const up = THREE.MathUtils.clamp(n.y * 0.5 + 0.5, 0, 1);
    const h = THREE.MathUtils.clamp((p.y - yMin) / (yMax - yMin), 0, 1);
    c.multiplyScalar(THREE.MathUtils.lerp(bottom, top, up * 0.65 + h * 0.35));
  };
}

export function combine(...shades: Shade[]): Shade {
  return (p, n, c, q) => {
    for (const s of shades) s(p, n, c, q);
  };
}

/** Stripes across an axis, blended toward a colour. */
export function stripes(
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
export function spots(
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

/** A painted anime iris: a dark limbal ring, a lit lower crescent, radial streaks, a pupil, catchlights. */
function irisTexture(color: string): THREE.CanvasTexture {
  const cached = irisCache.get(color);
  if (cached) return cached;
  const s = 96;
  const r = new Raster(s, s, null);
  r.tracking = true;
  const base = hex(color);
  const c = s / 2;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const d = Math.hypot(x - c, y - c) / c;
      if (d > 1) continue;
      const lit = THREE.MathUtils.clamp((y - c) / c, -1, 1) * 0.5 + 0.5;
      let k = 0.55 + lit * 0.9;
      if (d > 0.82) k *= 0.35;
      const a = Math.atan2(y - c, x - c);
      if (Math.abs(Math.sin(a * 14)) > 0.93 && d > 0.4 && d < 0.8) k *= 1.25;
      let col: RGB = [Math.min(1, base[0] * k), Math.min(1, base[1] * k), Math.min(1, base[2] * k)];
      if (d < 0.36) col = [0.05, 0.05, 0.08];
      r.set(x, y, col);
    }
  }
  r.disc(c - s * 0.16, c - s * 0.2, s * 0.12, hex('#ffffff'));
  r.disc(c + s * 0.18, c + s * 0.22, s * 0.05, hex('#ffffff'));
  r.tracking = false;
  const t = r.toTexture(false);
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  irisCache.set(color, t);
  return t;
}

/**
 * An anime-style eye set into the face: a tall almond, the iris filling almost all of
 * it, a dark liner along the top lid, a wet highlight, and a hinged lid of body
 * colour. The eyeball is flattened and sunk into the head so only its front shows.
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
  irisScale = 0.9,
  pitch = 0,
): { group: THREE.Group; lid: THREE.Mesh } {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.set(pitch, yaw, 0);
  const tall = 1.45;
  // The eyeball: a flattened sphere, most of it inside the head.
  const white = add(
    g,
    new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), glossy('#fbfbff', { roughness: 0.05 })),
    0,
    0,
    -r * 0.3,
  );
  white.scale.set(1, tall, 0.5);
  white.castShadow = false;
  // The iris disc covers most of the eye and carries the pupil and catchlights.
  const disc = add(
    g,
    new THREE.Mesh(
      new THREE.CircleGeometry(r * irisScale, 40),
      new THREE.MeshPhysicalMaterial({
        map: irisTexture(iris),
        transparent: true,
        roughness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
      }),
    ),
    0,
    -r * 0.02,
    r * 0.19,
  );
  disc.scale.set(1, tall * 0.98, 1);
  disc.castShadow = false;
  // A soft wet highlight across the upper eye.
  const gloss = add(
    g,
    new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.42, 24),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.75 }),
    ),
    -r * 0.28,
    r * 0.52,
    r * 0.2,
  );
  gloss.scale.set(1, 0.55, 1);
  gloss.castShadow = false;
  // The liner: a dark arc hugging the top edge, thicker toward the outer corner.
  const liner = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(r * 1.0, r * 0.075, 8, 28, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#1a1420', roughness: 0.5 }),
    ),
    0,
    0,
    r * 0.2,
  );
  liner.scale.set(1, tall, 0.6);
  liner.castShadow = false;
  const under = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(r * 0.98, r * 0.03, 6, 28, Math.PI),
      new THREE.MeshPhysicalMaterial({
        color: '#3a2a30',
        roughness: 0.6,
        transparent: true,
        opacity: 0.6,
      }),
    ),
    0,
    0,
    r * 0.19,
  );
  under.scale.set(1, tall, 0.6);
  under.rotation.z = Math.PI;
  under.castShadow = false;
  // The lid: a half-shell hinged at the eye, tilted back by the species' lid amount
  // and swung down over the eye to blink or sleep.
  const lidMesh = add(
    g,
    new THREE.Mesh(
      new THREE.SphereGeometry(r * 1.08, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.52),
      new THREE.MeshPhysicalMaterial({ color: lidColor, roughness: 0.6, sheen: 0.3 }),
    ),
    0,
    0,
    -r * 0.28,
  );
  lidMesh.scale.set(1, tall, 0.55);
  lidMesh.userData.base = -1.35 + lid * 2.0;
  lidMesh.rotation.x = lidMesh.userData.base;
  parent.add(g);
  return { group: g, lid: lidMesh };
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
  for (const l of lids) l.rotation.x = (l.userData.base as number) + k * 1.9;
}

/** Thin vein capsules radiating inside a wing, so the membrane reads as a wing. */
function wingVeins(pivot: THREE.Object3D, dx: number, color: string): void {
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

/** 1. Nubbin: the Chao-faithful hero, velvet-fuzzed, with veined wings, lashes and a glowing ball. */
function nubbin(): Creature {
  const body = '#9ad0ff';
  const tip = '#ffd94a';
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'smooth',
    amount: 0.25,
    bump: 0.25,
    roughness: 0.46,
    sheen: 0.75,
    sheenColor: '#dff2ff',
  });
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.74, 0),
      radii: V(0.72, 0.7, 0.68),
      r: 0,
      color: body,
      tag: 'belly',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.92, 0),
      radii: V(0.74, 0.68, 0.7),
      r: 0,
      color: body,
      tag: 'head',
    },
    {
      kind: 'cone',
      a: V(0, 2.35, 0),
      b: V(0, 3.05, 0),
      r: 0.42,
      r2: 0.05,
      color: body,
      tag: 'crown',
    },
    { kind: 'sphere', a: V(0, 3.06, 0), r: 0.1, color: tip, tag: 'tip' },
    {
      kind: 'capsule',
      a: V(-0.62, 1.0, 0.1),
      b: V(-1.0, 0.76, 0.2),
      r: 0.15,
      color: body,
      tag: 'arm',
    },
    {
      kind: 'capsule',
      a: V(0.62, 1.0, 0.1),
      b: V(1.0, 0.76, 0.2),
      r: 0.15,
      color: body,
      tag: 'arm',
    },
    { kind: 'sphere', a: V(-1.03, 0.73, 0.22), r: 0.19, color: tip, tag: 'hand' },
    { kind: 'sphere', a: V(1.03, 0.73, 0.22), r: 0.19, color: tip, tag: 'hand' },
    {
      kind: 'ellipsoid',
      a: V(-0.36, 0.15, 0.24),
      radii: V(0.25, 0.15, 0.34),
      r: 0,
      color: tip,
      tag: 'foot',
    },
    {
      kind: 'ellipsoid',
      a: V(0.36, 0.15, 0.24),
      radii: V(0.25, 0.15, 0.34),
      r: 0,
      color: tip,
      tag: 'foot',
    },
  ];
  const bodyMesh = add(
    g,
    new THREE.Mesh(
      sculpt({
        prims,
        blend: 0.22,
        min: V(-1.4, 0, -1.0),
        max: V(1.4, 3.3, 1.0),
        colorAt: (p, q) => (q.tag === 'belly' && p.z > 0.3 && p.y < 1.2 ? '#cfe9ff' : q.color),
        shade: combine(gradient(1.1, 0.72, 0, 3.1), (p, _n, c, q) => {
          // The yellow tips fade into the body instead of stopping dead.
          if (q.tag === 'hand' || q.tag === 'foot' || q.tag === 'tip') {
            const d = p.distanceTo(q.a) / (q.kind === 'sphere' ? q.r : 0.3);
            c.lerp(new THREE.Color(body), THREE.MathUtils.clamp((d - 0.7) * 1.6, 0, 0.6));
          }
        }),
      }),
      mat,
    ),
    0,
    0,
    0,
  );
  // A velvet fuzz: two very short, very fine shells.
  furShells(g, bodyMesh, 2, 0.03, 0.2, 220);
  const lids: THREE.Mesh[] = [];
  for (const dx of [-0.27, 0.27]) {
    const e = eye(g, dx, 2.0, 0.56, 0.18, '#2a4fd0', body, dx * 0.6, 0.22, 0.78);
    lids.push(e.lid);
    // Lashes on the outer upper corner.
    for (let i = 0; i < 3; i++) {
      const lash = add(
        e.group,
        new THREE.Mesh(
          new THREE.CapsuleGeometry(0.012, 0.07, 3, 6),
          new THREE.MeshPhysicalMaterial({ color: '#1a2040' }),
        ),
        Math.sign(dx) * (0.12 + i * 0.03),
        0.2 - i * 0.03,
        0.08,
      );
      lash.rotation.z = -Math.sign(dx) * (0.6 + i * 0.3);
    }
    const cheek = add(
      g,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 12),
        new THREE.MeshPhysicalMaterial({
          color: '#ffb0c4',
          roughness: 0.9,
          transparent: true,
          opacity: 0.7,
        }),
      ),
      dx * 1.7,
      1.78,
      0.58,
    );
    cheek.scale.set(1, 0.6, 0.3);
  }
  const smile = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#5a3a4a' }),
    ),
    0,
    1.76,
    0.7,
  );
  smile.rotation.z = Math.PI;
  const wings: THREE.Group[] = [];
  for (const dx of [-1, 1]) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.46 * dx, 0.5, 0.16 * dx, 1.0);
    shape.quadraticCurveTo(-0.18 * dx, 0.55, 0, 0);
    const pivot = new THREE.Group();
    pivot.position.set(dx * 0.42, 1.15, -0.6);
    pivot.rotation.y = -dx * 0.5;
    pivot.add(
      new THREE.Mesh(
        new THREE.ShapeGeometry(shape, 18),
        new THREE.MeshPhysicalMaterial({
          color: '#f6faff',
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
          roughness: 0.2,
          transmission: 0.3,
        }),
      ),
    );
    wingVeins(pivot, dx, '#9ab8e0');
    g.add(pivot);
    wings.push(pivot);
  }
  const ballMat = glossy(tip, { emissive: new THREE.Color('#9a7010'), emissiveIntensity: 1.6 });
  const ball = add(g, new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 18), ballMat), 0, 3.5, 0);
  const ballLight = new THREE.PointLight('#ffe08a', 1.2, 2.5, 1.6);
  ballLight.position.set(0, 3.5, 0);
  g.add(ballLight);
  g.scale.setScalar(0.78);
  return {
    group: g,
    name: 'Nubbin',
    animate: (t) => {
      breathe(g, 0.78, t);
      g.rotation.z = Math.sin(t * 0.8) * 0.03;
      ball.position.set(
        Math.sin(t * 0.7) * 0.08,
        3.5 + Math.sin(t * 1.6) * 0.08,
        Math.cos(t * 0.7) * 0.08,
      );
      ballLight.position.copy(ball.position);
      ballMat.emissiveIntensity = 1.3 + Math.sin(t * 2.4) * 0.5;
      wings.forEach((w, i) => {
        w.rotation.y = -(i === 0 ? -1 : 1) * 0.5 + Math.sin(t * 9 + i) * 0.35 * (i === 0 ? -1 : 1);
      });
      blink(lids, t, 0.6);
    },
  };
}

/** 2. Mossling: a sprout with vines and moss, a gilled spotted cap with dew, swaying arms and drifting spores. */
function mossling(): Creature {
  const body = '#6fbf62';
  const belly = '#e2f3c0';
  const cap = '#e0502f';
  const vine = '#3d8a3a';
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'leaf',
    scale: 1.4,
    amount: 0.5,
    bump: 0.5,
    roughness: 0.55,
    sheen: 0.35,
  });
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.95, 0),
      radii: V(0.95, 0.9, 0.85),
      r: 0,
      color: body,
      tag: 'body',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.8, 0.45),
      radii: V(0.55, 0.55, 0.45),
      r: 0,
      color: belly,
      tag: 'belly',
    },
    {
      kind: 'cone',
      a: V(0, 1.7, 0),
      b: V(0, 2.15, 0),
      r: 0.28,
      r2: 0.22,
      color: '#f3e6c8',
      tag: 'stem',
    },
    { kind: 'sphere', a: V(-0.4, 1.6, -0.5), r: 0.22, color: '#4f9a3a', tag: 'moss' },
    { kind: 'sphere', a: V(0.45, 1.55, -0.55), r: 0.2, color: '#4f9a3a', tag: 'moss' },
    { kind: 'sphere', a: V(0.05, 1.3, -0.85), r: 0.24, color: '#4f9a3a', tag: 'moss' },
    // A vine winding round the body with little leaves.
    {
      kind: 'capsule',
      a: V(-0.9, 0.5, 0.2),
      b: V(-0.5, 1.1, -0.7),
      r: 0.05,
      color: vine,
      tag: 'vine',
    },
    {
      kind: 'capsule',
      a: V(-0.5, 1.1, -0.7),
      b: V(0.5, 1.45, -0.6),
      r: 0.05,
      color: vine,
      tag: 'vine',
    },
    {
      kind: 'capsule',
      a: V(0.5, 1.45, -0.6),
      b: V(0.95, 1.2, 0.1),
      r: 0.05,
      color: vine,
      tag: 'vine',
    },
    {
      kind: 'ellipsoid',
      a: V(-0.72, 0.85, -0.25),
      radii: V(0.14, 0.06, 0.22),
      r: 0,
      color: '#5fb050',
      tag: 'leaf',
    },
    {
      kind: 'ellipsoid',
      a: V(0.1, 1.5, -0.75),
      radii: V(0.2, 0.06, 0.13),
      r: 0,
      color: '#5fb050',
      tag: 'leaf',
    },
    {
      kind: 'ellipsoid',
      a: V(0.85, 1.3, -0.2),
      radii: V(0.12, 0.06, 0.2),
      r: 0,
      color: '#5fb050',
      tag: 'leaf',
    },
  ];
  for (const dx of [-0.45, 0.45]) {
    for (let i = 0; i < 3; i++) {
      const a = (i - 1) * 0.5;
      prims.push({
        kind: 'cone',
        a: V(dx, 0.3, 0.3),
        b: V(dx + Math.sin(a) * 0.5 + dx * 0.4, 0.08, 0.3 + Math.cos(a) * 0.55),
        r: 0.14,
        r2: 0.04,
        color: '#4a7a3a',
        tag: 'root',
      });
    }
  }
  const bodyMesh = add(
    g,
    new THREE.Mesh(
      sculpt({
        prims,
        blend: 0.18,
        min: V(-1.7, 0, -1.3),
        max: V(1.7, 2.4, 1.3),
        shade: combine(gradient(1.12, 0.66, 0, 2.2), spots(3.0, 0.68, '#3e8a34', ['body'], 92)),
      }),
      mat,
    ),
    0,
    0,
    0,
  );
  // Mossy fuzz on the moss tufts and back.
  furShells(g, bodyMesh, 3, 0.05, 0.1, 140);
  // Arms on shoulder pivots.
  const armMat = surfaceMaterial({
    detail: 'leaf',
    scale: 1.4,
    amount: 0.4,
    bump: 0.4,
    roughness: 0.55,
    sheen: 0.35,
  });
  const arms: Part[] = [];
  for (const dx of [-1, 1]) {
    const a = part(
      g,
      [
        {
          kind: 'capsule',
          a: V(dx * 0.8, 1.1, 0.2),
          b: V(dx * 1.25, 0.7, 0.45),
          r: 0.16,
          color: body,
          tag: 'arm',
        },
        {
          kind: 'cone',
          a: V(dx * 1.25, 0.7, 0.45),
          b: V(dx * 1.45, 0.5, 0.65),
          r: 0.1,
          r2: 0.02,
          color: '#3f7a38',
        },
        {
          kind: 'cone',
          a: V(dx * 1.22, 0.72, 0.5),
          b: V(dx * 1.3, 0.45, 0.8),
          r: 0.08,
          r2: 0.02,
          color: '#3f7a38',
        },
      ],
      0.06,
      [
        V(Math.min(dx * 0.8, dx * 1.5) - 0.3, 0.2, -0.2),
        V(Math.max(dx * 0.8, dx * 1.5) + 0.3, 1.5, 1.1),
      ],
      armMat,
      V(dx * 0.8, 1.1, 0.2),
      48,
      gradient(1.08, 0.72, 0.3, 1.3),
    );
    arms.push(a);
  }
  const capMat = surfaceMaterial({
    detail: 'smooth',
    amount: 0.3,
    bump: 0.3,
    roughness: 0.36,
    clearcoat: 0.45,
    sheen: 0.1,
  });
  const capPart = part(
    g,
    [
      {
        kind: 'ellipsoid',
        a: V(0, 2.1, 0),
        radii: V(1.4, 0.66, 1.4),
        r: 0,
        color: cap,
        tag: 'cap',
      },
      { kind: 'torus', a: V(0, 1.93, 0), r: 1.18, r2: 0.2, color: '#f3e6c8', tag: 'rim' },
      {
        kind: 'cone',
        a: V(0.3, 2.7, -0.1),
        b: V(0.55, 3.25, -0.2),
        r: 0.1,
        r2: 0.02,
        color: '#4fa040',
        tag: 'sprout',
      },
      { kind: 'sphere', a: V(0.62, 3.28, -0.22), r: 0.12, color: '#8fd255', tag: 'sprout' },
    ],
    0.1,
    [V(-1.8, 1.5, -1.8), V(1.8, 3.6, 1.8)],
    capMat,
    V(0, 2.0, 0),
    88,
    combine(gradient(1.1, 0.75, 1.6, 3.2), spots(2.6, 0.64, '#fff1dc', ['cap'], 93)),
  );
  // Dew on the cap.
  const dewMat = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.02,
    transmission: 0.9,
    thickness: 0.2,
    ior: 1.33,
    transparent: true,
    opacity: 0.95,
  });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.7;
    const rr = 0.35 + (i % 3) * 0.3;
    const drop = add(
      capPart.pivot,
      new THREE.Mesh(new THREE.SphereGeometry(0.06 + (i % 2) * 0.03, 14, 10), dewMat),
      Math.cos(a) * rr,
      0.6 - rr * rr * 0.28,
      Math.sin(a) * rr,
    );
    drop.scale.set(1, 0.7, 1);
    drop.castShadow = false;
  }
  const gillMat = new THREE.MeshPhysicalMaterial({ color: '#f0d8b0', roughness: 0.7 });
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const gill = add(
      capPart.pivot,
      new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.03), gillMat),
      Math.cos(a) * 0.9,
      -0.1,
      Math.sin(a) * 0.9,
    );
    gill.rotation.y = -a;
  }
  const leafMat = new THREE.MeshPhysicalMaterial({
    color: '#4fa040',
    roughness: 0.5,
    side: THREE.DoubleSide,
    sheen: 0.4,
  });
  const leaves: THREE.Mesh[] = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.26, 0.4, 0, 0.9);
    shape.quadraticCurveTo(-0.26, 0.4, 0, 0);
    const leaf = add(
      g,
      new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), leafMat),
      Math.cos(a) * 0.8,
      1.6,
      Math.sin(a) * 0.8,
    );
    leaf.rotation.y = -a + Math.PI / 2;
    leaf.rotation.x = -1.0;
    leaves.push(leaf);
  }
  const lids: THREE.Mesh[] = [];
  for (const dx of [-0.3, 0.3])
    lids.push(eye(g, dx, 1.15, 0.78, 0.21, '#3a8a2a', body, dx * 0.5, 0.22, 0.75).lid);
  const mouth = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.025, 8, 16, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#3a5a2a' }),
    ),
    0,
    0.84,
    0.95,
  );
  mouth.rotation.z = Math.PI;
  // Spores drifting up from the gills.
  const spores = new THREE.Group();
  const sporeMat = new THREE.MeshBasicMaterial({
    color: '#d8ffb0',
    transparent: true,
    opacity: 0.8,
  });
  for (let i = 0; i < 16; i++)
    spores.add(new THREE.Mesh(new THREE.SphereGeometry(0.025 + (i % 3) * 0.01, 6, 5), sporeMat));
  g.add(spores);
  g.scale.setScalar(0.85);
  return {
    group: g,
    name: 'Mossling',
    animate: (t) => {
      capPart.pivot.rotation.z = Math.sin(t * 1.3) * 0.08;
      capPart.pivot.rotation.x = Math.cos(t * 1.1) * 0.06;
      breathe(g, 0.85, t, 2.4, 0.015);
      leaves.forEach((l, i) => {
        l.rotation.x = -1.0 + Math.sin(t * 1.7 + i) * 0.08;
      });
      arms.forEach((a, i) => {
        a.pivot.rotation.z = Math.sin(t * 1.9 + i * 2.1) * 0.18 * (i === 0 ? 1 : -1);
        a.pivot.rotation.x = Math.cos(t * 1.4 + i) * 0.1;
      });
      spores.children.forEach((s, i) => {
        const life = (t * 0.25 + i * 0.37) % 1;
        const a = i * 1.7 + t * 0.3;
        s.position.set(
          Math.cos(a) * (0.6 + life * 0.8),
          1.7 + life * 1.6,
          Math.sin(a) * (0.6 + life * 0.8),
        );
        s.scale.setScalar(1 - life * 0.7);
      });
      blink(lids, t, 1.9, 5.1);
    },
  };
}

/** 3. Fennel: a fox pup in shell fur with whiskers, cheek tufts, flecked back, swaying tail and twitching ears. */
function fennel(): Creature {
  const fur = '#f0893a';
  const cream = '#fff3e0';
  const dark = '#5a3a2a';
  const g = new THREE.Group();
  const furMat = surfaceMaterial({
    detail: 'fur',
    scale: 2.2,
    amount: 0.55,
    bump: 0.7,
    roughness: 0.78,
    sheen: 1.0,
    sheenColor: '#ffe6c8',
  });
  const shade = combine(
    gradient(1.1, 0.68, 0, 2.6),
    stripes('z', 4.5, 0.18, '#c9641f', ['body'], 0.55),
    spots(6, 0.74, '#ffd9a8', ['body', 'head'], 96),
  );
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 0.98, -0.2),
      radii: V(0.62, 0.6, 0.95),
      r: 0,
      color: fur,
      tag: 'body',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.8, 0.25),
      radii: V(0.42, 0.45, 0.5),
      r: 0,
      color: cream,
      tag: 'bib',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.78, 0.55),
      radii: V(0.64, 0.56, 0.56),
      r: 0,
      color: fur,
      tag: 'head',
    },
    {
      kind: 'cone',
      a: V(0, 1.56, 0.9),
      b: V(0, 1.42, 1.32),
      r: 0.27,
      r2: 0.1,
      color: cream,
      tag: 'muzzle',
    },
    // Cheek tufts.
    {
      kind: 'cone',
      a: V(-0.55, 1.6, 0.7),
      b: V(-0.95, 1.45, 0.75),
      r: 0.14,
      r2: 0.02,
      color: cream,
      tag: 'cheek',
    },
    {
      kind: 'cone',
      a: V(0.55, 1.6, 0.7),
      b: V(0.95, 1.45, 0.75),
      r: 0.14,
      r2: 0.02,
      color: cream,
      tag: 'cheek',
    },
    {
      kind: 'cone',
      a: V(-0.5, 1.45, 0.75),
      b: V(-0.85, 1.2, 0.8),
      r: 0.12,
      r2: 0.02,
      color: cream,
      tag: 'cheek',
    },
    {
      kind: 'cone',
      a: V(0.5, 1.45, 0.75),
      b: V(0.85, 1.2, 0.8),
      r: 0.12,
      r2: 0.02,
      color: cream,
      tag: 'cheek',
    },
    {
      kind: 'capsule',
      a: V(-0.4, 0.8, 0.45),
      b: V(-0.4, 0.2, 0.5),
      r: 0.14,
      color: fur,
      tag: 'leg',
    },
    { kind: 'capsule', a: V(0.4, 0.8, 0.45), b: V(0.4, 0.2, 0.5), r: 0.14, color: fur, tag: 'leg' },
    {
      kind: 'capsule',
      a: V(-0.38, 0.8, -0.8),
      b: V(-0.42, 0.2, -0.85),
      r: 0.15,
      color: fur,
      tag: 'leg',
    },
    {
      kind: 'capsule',
      a: V(0.38, 0.8, -0.8),
      b: V(0.42, 0.2, -0.85),
      r: 0.15,
      color: fur,
      tag: 'leg',
    },
    {
      kind: 'ellipsoid',
      a: V(-0.42, 0.12, 0.6),
      radii: V(0.19, 0.11, 0.27),
      r: 0,
      color: dark,
      tag: 'paw',
    },
    {
      kind: 'ellipsoid',
      a: V(0.42, 0.12, 0.6),
      radii: V(0.19, 0.11, 0.27),
      r: 0,
      color: dark,
      tag: 'paw',
    },
    {
      kind: 'ellipsoid',
      a: V(-0.44, 0.12, -0.78),
      radii: V(0.19, 0.11, 0.27),
      r: 0,
      color: dark,
      tag: 'paw',
    },
    {
      kind: 'ellipsoid',
      a: V(0.44, 0.12, -0.78),
      radii: V(0.19, 0.11, 0.27),
      r: 0,
      color: dark,
      tag: 'paw',
    },
  ];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const r0 = 0.55;
    prims.push({
      kind: 'cone',
      a: V(Math.cos(a) * r0, 1.25 + Math.sin(a) * 0.1, 0.15 + Math.sin(a) * r0 * 0.6),
      b: V(
        Math.cos(a) * (r0 + 0.35),
        1.1 + Math.sin(a) * 0.25,
        0.05 + Math.sin(a) * (r0 + 0.3) * 0.6,
      ),
      r: 0.14,
      r2: 0.02,
      color: cream,
      tag: 'ruff',
    });
  }
  for (let i = 0; i < 3; i++) {
    prims.push({
      kind: 'cone',
      a: V((i - 1) * 0.14, 2.2, 0.55),
      b: V((i - 1) * 0.3, 2.55 - Math.abs(i - 1) * 0.1, 0.4),
      r: 0.1,
      r2: 0.02,
      color: fur,
      tag: 'crest',
    });
  }
  const body = add(
    g,
    new THREE.Mesh(
      sculpt({
        prims,
        blend: 0.16,
        min: V(-1.3, 0, -1.6),
        max: V(1.3, 2.8, 1.6),
        colorAt: (p, n) => {
          if (n.tag === 'head' && p.y < 1.56 && p.z > 0.7) return cream;
          if (n.tag === 'leg' && p.y < 0.5) return dark;
          return n.color;
        },
        shade,
      }),
      furMat,
    ),
    0,
    0,
    0,
  );
  furShells(g, body, 12, 0.11, 0.25, 70);
  const earMat = surfaceMaterial({
    detail: 'fur',
    scale: 2.2,
    amount: 0.5,
    bump: 0.6,
    roughness: 0.78,
    sheen: 1.0,
  });
  const ears: Part[] = [];
  for (const dx of [-0.34, 0.34]) {
    const e = part(
      g,
      [
        {
          kind: 'cone',
          a: V(dx, 2.1, 0.45),
          b: V(dx * 1.4, 3.0, 0.28),
          r: 0.27,
          r2: 0.04,
          color: fur,
          tag: 'ear',
        },
        {
          kind: 'cone',
          a: V(dx, 2.22, 0.56),
          b: V(dx * 1.32, 2.82, 0.42),
          r: 0.14,
          r2: 0.02,
          color: '#ffb6c8',
          tag: 'inner',
        },
        {
          kind: 'cone',
          a: V(dx * 1.4, 3.0, 0.28),
          b: V(dx * 1.5, 3.25, 0.22),
          r: 0.05,
          r2: 0.01,
          color: dark,
          tag: 'tip',
        },
      ],
      0.05,
      [V(dx - 0.7, 1.9, -0.2), V(dx + 0.7, 3.4, 1.0)],
      earMat,
      V(dx, 2.1, 0.45),
      64,
      gradient(1.05, 0.8, 2, 3.2),
    );
    furShells(e.pivot, e.mesh, 5, 0.06, 0.2, 90);
    ears.push(e);
  }
  const tail = part(
    g,
    [
      { kind: 'sphere', a: V(0, 0.9, -1.1), r: 0.26, color: fur },
      { kind: 'sphere', a: V(0, 1.05, -1.5), r: 0.38, color: fur },
      { kind: 'sphere', a: V(0, 1.4, -1.9), r: 0.44, color: fur },
      { kind: 'sphere', a: V(0, 1.85, -2.05), r: 0.36, color: fur },
      { kind: 'sphere', a: V(0, 2.15, -2.05), r: 0.26, color: cream, tag: 'tip' },
      { kind: 'cone', a: V(0.2, 1.3, -2.1), b: V(0.45, 1.1, -2.45), r: 0.14, r2: 0.02, color: fur },
      {
        kind: 'cone',
        a: V(-0.2, 1.6, -2.2),
        b: V(-0.5, 1.5, -2.55),
        r: 0.14,
        r2: 0.02,
        color: fur,
      },
    ],
    0.25,
    [V(-0.9, 0.4, -2.8), V(0.9, 2.6, -0.6)],
    earMat,
    V(0, 0.9, -1.05),
    80,
    gradient(1.1, 0.7, 0.6, 2.3),
  );
  furShells(tail.pivot, tail.mesh, 12, 0.16, 0.3, 60);
  const lids: THREE.Mesh[] = [];
  for (const dx of [-0.27, 0.27])
    lids.push(eye(g, dx, 1.88, 1.02, 0.17, '#4a9a3a', fur, dx * 0.7, 0.3, 0.74).lid);
  add(
    g,
    new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 12), glossy('#1a1414')),
    0,
    1.46,
    1.38,
  ).scale.set(1.2, 0.8, 0.8);
  const whiskerMat = new THREE.MeshPhysicalMaterial({ color: '#f4e8d8', roughness: 0.6 });
  for (const dx of [-1, 1]) {
    const brow = add(
      g,
      new THREE.Mesh(
        new THREE.CapsuleGeometry(0.025, 0.14, 4, 8),
        new THREE.MeshPhysicalMaterial({ color: dark }),
      ),
      dx * 0.26,
      2.1,
      1.02,
    );
    brow.rotation.z = Math.PI / 2 + (dx > 0 ? -0.3 : 0.3);
    for (let i = 0; i < 3; i++) {
      const w = add(
        g,
        new THREE.Mesh(new THREE.CapsuleGeometry(0.008, 0.5, 3, 6), whiskerMat),
        dx * 0.45,
        1.42 - i * 0.05,
        1.18,
      );
      w.rotation.z = dx * (Math.PI / 2 - 0.15 + i * 0.18);
      w.rotation.y = -dx * 0.3;
      w.castShadow = false;
    }
  }
  g.scale.setScalar(0.95);
  return {
    group: g,
    name: 'Fennel',
    animate: (t) => {
      tail.pivot.rotation.y = Math.sin(t * 2.6) * 0.45;
      tail.pivot.rotation.x = Math.sin(t * 1.3) * 0.12;
      ears.forEach((e, i) => {
        const twitch =
          (t + i * 1.3) % 3.1 < 0.25
            ? Math.sin((((t + i * 1.3) % 3.1) / 0.25) * Math.PI) * 0.25
            : 0;
        e.pivot.rotation.z =
          Math.sin(t * 3.1 + i * 2) * 0.08 * (i === 0 ? 1 : -1) + twitch * (i === 0 ? 1 : -1);
      });
      breathe(g, 0.95, t, 2.0);
      g.rotation.y = (g.userData.yaw ?? 0) + Math.sin(t * 0.5) * 0.05;
      blink(lids, t, 2.7, 3.6);
    },
  };
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

/** 4. Bolder: an eight-legged plated spider with jointed legs, bristles, a row of eyes and an ember abdomen. */
function bolder(): Creature {
  const plate = '#56626f';
  const plateLight = '#92a0b0';
  const under = '#2e333c';
  const ember = '#ff7a2a';
  const time = { value: 0 };
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'plate',
    scale: 1.2,
    amount: 0.7,
    bump: 1.0,
    roughness: 0.38,
    sheen: 0.05,
    clearcoat: 0.7,
    glowStrength: 4,
  });
  const prims: Prim[] = [
    // Cephalothorax and a big abdomen behind it, the head low in front.
    {
      kind: 'ellipsoid',
      a: V(0, 0.95, 0.45),
      radii: V(0.95, 0.62, 0.8),
      r: 0,
      color: plate,
      tag: 'thorax',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.1, -0.95),
      radii: V(1.15, 0.85, 1.1),
      r: 0,
      color: plate,
      tag: 'abdomen',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.72, 1.15),
      radii: V(0.62, 0.46, 0.5),
      r: 0,
      color: under,
      tag: 'head',
    },
    // Plate ridges down the back and a collar between the segments.
    { kind: 'torus', a: V(0, 1.05, -0.2), r: 0.62, r2: 0.09, color: ember, glow: 1, tag: 'seam' },
    {
      kind: 'capsule',
      a: V(0, 1.45, 0.5),
      b: V(0, 1.9, -0.9),
      r: 0.09,
      color: plateLight,
      tag: 'ridge',
    },
    {
      kind: 'capsule',
      a: V(-0.45, 1.3, -0.5),
      b: V(-0.5, 1.6, -1.5),
      r: 0.06,
      color: plateLight,
      tag: 'ridge',
    },
    {
      kind: 'capsule',
      a: V(0.45, 1.3, -0.5),
      b: V(0.5, 1.6, -1.5),
      r: 0.06,
      color: plateLight,
      tag: 'ridge',
    },
    // Two horns and the pedipalps.
    {
      kind: 'cone',
      a: V(-0.4, 1.2, 0.95),
      b: V(-0.95, 2.1, 0.7),
      r: 0.17,
      r2: 0.03,
      color: plateLight,
      tag: 'horn',
    },
    {
      kind: 'cone',
      a: V(0.4, 1.2, 0.95),
      b: V(0.95, 2.1, 0.7),
      r: 0.17,
      r2: 0.03,
      color: plateLight,
      tag: 'horn',
    },
    {
      kind: 'capsule',
      a: V(-0.3, 0.5, 1.4),
      b: V(-0.55, 0.35, 1.9),
      r: 0.08,
      color: under,
      tag: 'palp',
    },
    {
      kind: 'capsule',
      a: V(0.3, 0.5, 1.4),
      b: V(0.55, 0.35, 1.9),
      r: 0.08,
      color: under,
      tag: 'palp',
    },
    // Spinnerets.
    {
      kind: 'cone',
      a: V(0, 0.9, -2.0),
      b: V(0, 0.8, -2.35),
      r: 0.14,
      r2: 0.03,
      color: under,
      tag: 'spin',
    },
  ];
  for (const side of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      const t = 0.25 + k * 0.18;
      prims.push({
        kind: 'sphere',
        a: V(side * (0.4 + 0.55 * t), 1.2 + 0.9 * t, 0.95 - 0.25 * t),
        r: 0.1 - k * 0.015,
        color: plateLight,
        tag: 'ridge',
      });
    }
  }
  add(
    g,
    new THREE.Mesh(
      sculpt({
        prims,
        blend: 0.12,
        min: V(-1.6, 0, -2.6),
        max: V(1.6, 2.5, 2.2),
        colorAt: (p, n) => {
          if (n.tag === 'abdomen') {
            // An ember hourglass across the back of the abdomen.
            const lx = Math.abs(p.x);
            const ly = p.z + 0.95;
            const hour = lx < 0.12 + Math.abs(ly) * 0.55 && Math.abs(ly) < 0.7 && p.y > 1.05;
            if (hour) return ember;
            const seam = Math.abs(Math.sin(p.z * 5.5)) < 0.08 && p.y > 1.2;
            return seam ? '#7a8898' : plate;
          }
          if (n.tag === 'thorax')
            return Math.abs(Math.sin(p.x * 5)) < 0.08 && p.y > 1.1 ? '#7a8898' : plate;
          return n.color;
        },
        shade: gradient(1.14, 0.5, 0, 2.2),
      }),
      mat,
    ),
    0,
    0,
    0,
  );
  // Short dark bristles on the abdomen and thorax.
  // Eight jointed legs on hip pivots: hip to knee rising, knee to foot dropping, a claw.
  const legMat = surfaceMaterial({
    detail: 'plate',
    scale: 2.4,
    amount: 0.5,
    bump: 0.6,
    roughness: 0.45,
    clearcoat: 0.5,
  });
  const legs: Array<{ part: Part; phase: number; side: number }> = [];
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const z = 1.0 - i * 0.6;
      const spread = 0.85 + Math.abs(i - 1.5) * 0.08;
      const hip = V(side * 0.75, 0.95, z);
      const knee = V(
        side * (0.75 + spread * 0.9),
        1.75 + (i === 0 || i === 3 ? 0.1 : 0.25),
        z + (i < 2 ? 0.35 : -0.35) * (i === 0 || i === 3 ? 1.6 : 1),
      );
      const foot = V(
        side * (0.75 + spread * 1.9),
        0.08,
        z + (i < 2 ? 0.75 : -0.75) * (i === 0 || i === 3 ? 1.5 : 1),
      );
      const leg = part(
        g,
        [
          { kind: 'cone', a: hip, b: knee, r: 0.15, r2: 0.1, color: under, tag: 'leg' },
          { kind: 'sphere', a: knee, r: 0.13, color: plateLight, tag: 'knee' },
          { kind: 'cone', a: knee, b: foot, r: 0.1, r2: 0.05, color: under, tag: 'leg' },
          {
            kind: 'cone',
            a: foot,
            b: V(foot.x + side * 0.22, 0.0, foot.z),
            r: 0.07,
            r2: 0.01,
            color: plateLight,
            tag: 'claw',
          },
        ],
        0.06,
        [
          V(Math.min(hip.x, foot.x) - 0.5, -0.2, Math.min(hip.z, foot.z, knee.z) - 0.5),
          V(Math.max(hip.x, foot.x) + 0.5, 2.4, Math.max(hip.z, foot.z, knee.z) + 0.5),
        ],
        legMat,
        hip,
        56,
        gradient(1.1, 0.6, 0, 2),
      );
      legs.push({ part: leg, phase: (i + (side > 0 ? 0.5 : 0)) * 1.57, side });
    }
  }
  // Eyes: two big and a row of six small, all glossy.
  const lids: THREE.Mesh[] = [];
  for (const dx of [-0.26, 0.26])
    lids.push(eye(g, dx, 0.92, 1.58, 0.13, '#ffb020', under, dx * 0.6, 0.42, 0.82).lid);
  for (let i = 0; i < 6; i++) {
    const dx = -0.42 + i * 0.168;
    const small = add(
      g,
      new THREE.Mesh(
        new THREE.SphereGeometry(0.05 + (i === 2 || i === 3 ? 0.015 : 0), 14, 10),
        glossy('#ffb020', { emissive: new THREE.Color('#ff8a20'), emissiveIntensity: 0.6 }),
      ),
      dx,
      1.12 - Math.abs(i - 2.5) * 0.03,
      1.5 - Math.abs(i - 2.5) * 0.06,
    );
    small.castShadow = false;
  }
  const mandible = new THREE.MeshPhysicalMaterial({
    color: plateLight,
    roughness: 0.35,
    clearcoat: 0.6,
  });
  const jaws: THREE.Mesh[] = [];
  for (const dx of [-0.22, 0.22]) {
    const j = add(
      g,
      new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.5, 10), mandible),
      dx,
      0.5,
      1.6,
    );
    j.rotation.x = Math.PI / 2 + 0.3;
    j.rotation.z = -dx * 1.4;
    jaws.push(j);
  }
  const emberLight = new THREE.PointLight('#ff7a2a', 3, 4.5, 1.5);
  emberLight.position.set(0, 1.4, -0.9);
  g.add(emberLight);
  g.scale.setScalar(0.9);
  return {
    group: g,
    name: 'Bolder',
    animate: (t) => {
      time.value = t;
      breathe(g, 0.9, t, 1.4, 0.01);
      legs.forEach(({ part: p, phase, side }) => {
        // A slow shifting of weight: legs flex at the hip, alternating sides.
        const s = Math.sin(t * 1.6 + phase);
        // Each leg lifts in turn at the top of its cycle and sets down again.
        p.pivot.rotation.z = side * (s * 0.07 + Math.max(0, s - 0.75) * 0.6);
        p.pivot.rotation.y = Math.sin(t * 1.1 + phase) * 0.05;
      });
      jaws.forEach((j, i) => {
        j.rotation.z =
          -(i === 0 ? -0.22 : 0.22) * 1.4 + Math.sin(t * 2.2) * 0.14 * (i === 0 ? 1 : -1);
      });
      emberLight.intensity = 2.5 + Math.sin(t * 2.7) * 0.9;
      blink(lids, t, 3.3, 6.5);
      const u = (
        mat.userData.shader as { uniforms: { uGlowStrength: { value: number } } } | undefined
      )?.uniforms;
      if (u) u.uGlowStrength.value = 3.2 + Math.sin(t * 2.7) * 1.2;
    },
  };
}

/** 5. Wisp: violet smoke over a bright core, marbled, with horn tufts, a skirt of wisps and a vapour shell. */
function wisp(): Creature {
  const smoke = '#6b3fb0';
  const dark = '#2a1a4a';
  const core = '#d8f6ff';
  const time = { value: 0 };
  const g = new THREE.Group();
  const mat = surfaceMaterial({
    detail: 'smooth',
    amount: 0.3,
    bump: 0.35,
    roughness: 0.26,
    sheen: 0.3,
    sheenColor: '#d0a0ff',
    clearcoat: 0.5,
    glowStrength: 3.0,
  });
  const prims: Prim[] = [
    {
      kind: 'ellipsoid',
      a: V(0, 1.7, 0),
      radii: V(0.84, 0.94, 0.82),
      r: 0,
      color: smoke,
      tag: 'body',
    },
    {
      kind: 'ellipsoid',
      a: V(0, 1.72, 0.34),
      radii: V(0.48, 0.54, 0.44),
      r: 0,
      color: core,
      glow: 1,
      tag: 'core',
    },
    {
      kind: 'cone',
      a: V(0, 1.0, 0),
      b: V(0.3, 0.1, -0.2),
      r: 0.46,
      r2: 0.03,
      color: dark,
      tag: 'tail',
    },
    {
      kind: 'cone',
      a: V(-0.7, 1.6, 0.1),
      b: V(-1.6, 2.25, 0.3),
      r: 0.2,
      r2: 0.03,
      color: smoke,
      tag: 'arm',
    },
    {
      kind: 'cone',
      a: V(0.7, 1.6, 0.1),
      b: V(1.6, 2.25, 0.3),
      r: 0.2,
      r2: 0.03,
      color: smoke,
      tag: 'arm',
    },
    { kind: 'sphere', a: V(-1.6, 2.25, 0.3), r: 0.13, color: core, glow: 0.7, tag: 'armtip' },
    { kind: 'sphere', a: V(1.6, 2.25, 0.3), r: 0.13, color: core, glow: 0.7, tag: 'armtip' },
    // Horn tufts curling back from the brow.
    {
      kind: 'cone',
      a: V(-0.5, 2.35, 0.3),
      b: V(-0.9, 2.95, -0.2),
      r: 0.14,
      r2: 0.02,
      color: dark,
      tag: 'horn',
    },
    {
      kind: 'cone',
      a: V(0.5, 2.35, 0.3),
      b: V(0.9, 2.95, -0.2),
      r: 0.14,
      r2: 0.02,
      color: dark,
      tag: 'horn',
    },
    // A brow ridge and cheek flares.
    {
      kind: 'capsule',
      a: V(-0.45, 2.22, 0.62),
      b: V(0.45, 2.22, 0.62),
      r: 0.08,
      color: dark,
      tag: 'brow',
    },
    {
      kind: 'cone',
      a: V(-0.8, 1.6, 0.4),
      b: V(-1.15, 1.35, 0.55),
      r: 0.1,
      r2: 0.02,
      color: dark,
      tag: 'flare',
    },
    {
      kind: 'cone',
      a: V(0.8, 1.6, 0.4),
      b: V(1.15, 1.35, 0.55),
      r: 0.1,
      r2: 0.02,
      color: dark,
      tag: 'flare',
    },
  ];
  const body = add(
    g,
    new THREE.Mesh(
      sculpt({
        prims,
        blend: 0.3,
        min: V(-1.9, -0.2, -1.4),
        max: V(1.9, 3.2, 1.4),
        shade: combine(
          gradient(1.15, 0.45, 0, 2.8),
          spots(2.2, 0.66, '#9a6ad8', ['body'], 94),
          spots(5.0, 0.7, '#3a2460', ['body', 'tail'], 95),
        ),
      }),
      mat,
    ),
    0,
    0,
    0,
  );
  smokeShell(g, body, '#8a5ad8', time);
  const flames: Part[] = [];
  const flameMat = surfaceMaterial({
    detail: 'smooth',
    amount: 0.2,
    bump: 0.2,
    roughness: 0.3,
    clearcoat: 0.3,
    glowStrength: 2.4,
  });
  for (const [x, z, h, lean] of [
    [0, 0, 1.15, 0.1],
    [-0.32, -0.12, 0.9, -0.38],
    [0.34, -0.1, 0.85, 0.42],
    [-0.1, -0.38, 0.65, -0.1],
    [0.15, -0.4, 0.55, 0.2],
  ] as const) {
    const f = part(
      g,
      [
        {
          kind: 'cone',
          a: V(x, 2.45, z),
          b: V(x + lean, 2.45 + h, z - 0.1),
          r: 0.22,
          r2: 0.03,
          color: smoke,
          tag: 'flame',
        },
        {
          kind: 'cone',
          a: V(x, 2.5, z),
          b: V(x + lean * 0.7, 2.45 + h * 0.6, z - 0.05),
          r: 0.1,
          r2: 0.02,
          color: core,
          glow: 0.9,
          tag: 'inner',
        },
      ],
      0.08,
      [V(x - 0.8, 2.2, z - 0.8), V(x + 0.8, 2.5 + h + 0.4, z + 0.8)],
      flameMat,
      V(x, 2.45, z),
      56,
      gradient(1.0, 0.8, 2.4, 3.8),
    );
    flames.push(f);
  }
  // A skirt of wisps hanging under the body, each on its own pivot.
  const skirt: Part[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const x = Math.cos(a) * 0.55;
    const z = Math.sin(a) * 0.5;
    const s = part(
      g,
      [
        {
          kind: 'cone',
          a: V(x, 1.05, z),
          b: V(x * 1.6, 0.25 + (i % 2) * 0.2, z * 1.6),
          r: 0.16,
          r2: 0.02,
          color: dark,
          tag: 'skirt',
        },
      ],
      0.05,
      [V(x * 1.6 - 0.4, -0.1, z * 1.6 - 0.4), V(x * 1.6 + 0.4, 1.3, z * 1.6 + 0.4)],
      flameMat,
      V(x, 1.05, z),
      40,
      gradient(1.0, 0.6, 0, 1.2),
    );
    skirt.push(s);
  }
  const lids: THREE.Mesh[] = [];
  for (const dx of [-0.27, 0.27])
    lids.push(eye(g, dx, 1.9, 0.82, 0.19, '#b9ff5a', smoke, dx * 0.5, 0.2, 0.8).lid);
  // A trail of fading motes behind the tail.
  const trail = new THREE.Group();
  const trailMat = new THREE.MeshBasicMaterial({
    color: '#c8b0ff',
    transparent: true,
    opacity: 0.7,
  });
  for (let i = 0; i < 8; i++)
    trail.add(new THREE.Mesh(new THREE.SphereGeometry(0.09 - i * 0.009, 8, 6), trailMat));
  g.add(trail);
  const grin = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.03, 8, 20, Math.PI),
      new THREE.MeshPhysicalMaterial({ color: '#1a0f2e' }),
    ),
    0,
    1.56,
    0.88,
  );
  grin.rotation.z = Math.PI;
  for (const dx of [-0.11, 0.11])
    add(
      g,
      new THREE.Mesh(
        new THREE.ConeGeometry(0.035, 0.1, 6),
        new THREE.MeshPhysicalMaterial({ color: '#f4f0ff' }),
      ),
      dx,
      1.5,
      0.92,
    ).rotation.x = Math.PI;
  const motes = new THREE.Group();
  const moteMat = new THREE.MeshBasicMaterial({ color: '#d8f6ff' });
  for (let i = 0; i < 18; i++)
    motes.add(new THREE.Mesh(new THREE.SphereGeometry(0.03 + (i % 3) * 0.015, 8, 6), moteMat));
  g.add(motes);
  const ring = add(
    g,
    new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.02, 8, 64),
      new THREE.MeshBasicMaterial({ color: '#b9a0ff', transparent: true, opacity: 0.5 }),
    ),
    0,
    1.3,
    0,
  );
  ring.rotation.x = Math.PI / 2 + 0.3;
  const light = new THREE.PointLight('#9ad8ff', 5, 6, 1.5);
  light.position.set(0, 1.8, 0.4);
  g.add(light);
  g.scale.setScalar(0.85);
  return {
    group: g,
    name: 'Wisp',
    animate: (t) => {
      time.value = t;
      g.position.y = g.userData.baseY + 0.55 + Math.sin(t * 1.4) * 0.18;
      g.rotation.z = Math.sin(t * 0.9) * 0.06;
      flames.forEach((f, i) => {
        f.pivot.rotation.z = Math.sin(t * 3.2 + i * 1.3) * 0.18;
        f.pivot.rotation.x = Math.cos(t * 2.4 + i) * 0.12;
      });
      skirt.forEach((s, i) => {
        s.pivot.rotation.z = Math.sin(t * 2.1 + i * 1.1) * 0.22;
        s.pivot.rotation.x = Math.cos(t * 1.7 + i * 0.8) * 0.18;
      });
      motes.children.forEach((m, i) => {
        const a = t * 0.9 + i * 0.35;
        const rr = 0.9 + (i % 3) * 0.22;
        m.position.set(
          Math.cos(a) * rr,
          1.5 + Math.sin(a * 1.7) * 0.6 + (i % 2) * 0.3,
          Math.sin(a) * rr,
        );
      });
      ring.rotation.z = t * 0.5;
      light.intensity = 4 + Math.sin(t * 3) * 1.2;
      trail.children.forEach((m, i) => {
        const k = i / 8;
        m.position.set(
          0.3 + k * 0.9 + Math.sin(t * 2 + k * 6) * 0.15,
          0.1 - k * 0.9 + Math.sin(t * 1.4 + k * 4) * 0.1,
          -0.2 - k * 0.6,
        );
      });
      blink(lids, t, 0.2, 4.8);
      const u = (
        mat.userData.shader as { uniforms: { uGlowStrength: { value: number } } } | undefined
      )?.uniforms;
      if (u) u.uGlowStrength.value = 2.6 + Math.sin(t * 2.2) * 0.9;
    },
  };
}

export const CREATURES: Array<() => Creature> = [nubbin, mossling, fennel, bolder, wisp];

export function buildCreature(index: number): Creature {
  const make = CREATURES[Math.max(0, Math.min(CREATURES.length - 1, index))]!;
  const c = make();
  c.group.userData.baseY = 0;
  return c;
}
