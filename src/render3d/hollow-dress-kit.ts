import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';

/**
 * The Hollow dressing's building kit (`hollow-dress.ts`): a merger that bakes many small
 * transformed primitives into one vertex-coloured geometry, so a whole floor's props draw
 * in one call; the materials that read it (a per-vertex glow, and a per-instance "kind"
 * for the loot, which draws every kind of find in one instanced call); and the painted
 * atlases (floor decals, wall glyphs, the chasm, falling water), drawn once per page.
 */

const cache = new Map<string, THREE.BufferGeometry>();
/** A unit primitive, made once per page and shared by every floor (never disposed). */
export function prim(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g;
}

export const BOX = () => prim('box', () => new THREE.BoxGeometry(1, 1, 1));
export const CYL = (top = 0.5, seg = 8) =>
  prim(`cyl${top}:${seg}`, () => new THREE.CylinderGeometry(top, 0.5, 1, seg, 1));
export const BALL = () => prim('ball', () => new THREE.IcosahedronGeometry(0.5, 1));
export const SPHERE = () => prim('sphere', () => new THREE.SphereGeometry(0.5, 12, 8));
export const CONE = (seg = 8) => prim(`cone${seg}`, () => new THREE.ConeGeometry(0.5, 1, seg));
export const OCT = () => prim('oct', () => new THREE.OctahedronGeometry(0.5));
export const ROCK = () => prim('rock', () => new THREE.DodecahedronGeometry(0.5, 0));
export const TORUS = () => prim('torus', () => new THREE.TorusGeometry(0.5, 0.1, 6, 20));
/** A flat disc lying on the ground, facing up. */
export const DISC = () =>
  prim('disc', () => new THREE.CircleGeometry(0.5, 18).rotateX(-Math.PI / 2));
/** A tent's A-frame: a prism one unit each way, the ridge along z (its ends face �z), floor at y 0. */
export const PRISM = () =>
  prim('prism', () => {
    const s = new THREE.Shape();
    s.moveTo(-0.5, 0);
    s.lineTo(0.5, 0);
    s.lineTo(0, 1);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);
  });

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Many primitives, each with its own transform, colour, glow (0 matte, 1 lit from
 * within) and kind (the loot's selector), merged into one geometry.
 */
export class Kit {
  private readonly pos: number[] = [];
  private readonly nrm: number[] = [];
  private readonly col: number[] = [];
  private readonly glw: number[] = [];
  private readonly knd: number[] = [];
  private readonly idx: number[] = [];
  private readonly c = new THREE.Color();
  private readonly v = new THREE.Vector3();
  private readonly n3 = new THREE.Matrix3();
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly s = new THREE.Vector3();
  private readonly p = new THREE.Vector3();
  /** The kind stamped on what is added next (the loot kit sets it per find). */
  kind = 0;

  get empty(): boolean {
    return this.idx.length === 0;
  }

  add(g: THREE.BufferGeometry, m: THREE.Matrix4, color: THREE.ColorRepresentation, glow = 0): void {
    const base = this.pos.length / 3;
    const P = g.attributes.position as THREE.BufferAttribute;
    const N = g.attributes.normal as THREE.BufferAttribute | undefined;
    this.n3.getNormalMatrix(m);
    this.c.set(color);
    for (let i = 0; i < P.count; i++) {
      this.v.fromBufferAttribute(P, i).applyMatrix4(m);
      this.pos.push(this.v.x, this.v.y, this.v.z);
      if (N) this.v.fromBufferAttribute(N, i).applyMatrix3(this.n3).normalize();
      else this.v.set(0, 1, 0);
      this.nrm.push(this.v.x, this.v.y, this.v.z);
      this.col.push(this.c.r, this.c.g, this.c.b);
      this.glw.push(glow);
      this.knd.push(this.kind);
    }
    const I = g.index;
    if (I) for (let i = 0; i < I.count; i++) this.idx.push(base + I.getX(i));
    else for (let i = 0; i < P.count; i++) this.idx.push(base + i);
  }

  /** A primitive at (x, y, z), scaled (sx, sy, sz), turned by (rx, ry, rz). */
  part(
    g: THREE.BufferGeometry,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
    color: THREE.ColorRepresentation,
    glow = 0,
    ry = 0,
    rx = 0,
    rz = 0,
  ): void {
    this.q.setFromEuler(this.e.set(rx, ry, rz, 'YXZ'));
    this.m4.compose(this.p.set(x, y, z), this.q, this.s.set(sx, sy, sz));
    this.add(g, this.m4, color, glow);
  }

  /** A rod of radius `r` from `a` to `b` (ropes, roots, rails, braces). */
  rod(
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    color: THREE.ColorRepresentation,
    glow = 0,
    g: THREE.BufferGeometry = CYL(0.5, 6),
  ): void {
    const d = this.v.subVectors(b, a);
    const len = d.length();
    if (len < 1e-4) return;
    this.q.setFromUnitVectors(UP, d.divideScalar(len));
    this.m4.compose(
      this.p.addVectors(a, b).multiplyScalar(0.5),
      this.q,
      this.s.set(r * 2, len, r * 2),
    );
    this.add(g, this.m4, color, glow);
  }

  build(): THREE.BufferGeometry | null {
    if (!this.idx.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nrm, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setAttribute('aGlow', new THREE.Float32BufferAttribute(this.glw, 1));
    g.setAttribute('aKind', new THREE.Float32BufferAttribute(this.knd, 1));
    g.setIndex(this.idx);
    g.computeBoundingSphere();
    return g;
  }
}

/** The kit's glow strength, shared by every kit material (the shed step could lower it). */
export const KIT_GLOW = { value: 1 };

/**
 * The kit material: vertex colour (times any instance colour), lit as stone and wood are,
 * plus `aGlow` of its own colour as emission, so lanterns, berries and crystals in the same
 * merged mesh light from within. `kinds` adds the loot's selector: a vertex whose `aKind`
 * is not its instance's `iKind` collapses to a point, so one instanced mesh draws every find.
 */
export function kitMaterial(kinds = false, flat = false): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.85,
    metalness: 0,
    flatShading: flat,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uGlow = KIT_GLOW;
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aGlow;
        varying float vGlow;
        ${kinds ? 'attribute float aKind; attribute float iKind;' : ''}`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vGlow = aGlow;
        ${kinds ? 'if ( abs( aKind - iKind ) > 0.5 ) transformed = vec3( 0.0 );' : ''}`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying float vGlow;
        uniform float uGlow;`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * vGlow * uGlow;`,
      );
  };
  m.customProgramCacheKey = () => `hollow-kit${kinds ? '-kinds' : ''}${flat ? '-flat' : ''}`;
  return m;
}

/**
 * The floor decals' material: the 2×2 atlas, each instance choosing its tile through
 * `iTile` (0..3), lit like the floor, blended on top of it without writing depth.
 */
export function decalMaterial(map: THREE.Texture): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    map,
    transparent: true,
    depthWrite: false,
    roughness: 0.7,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float iTile;')
      .replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
        vMapUv = vMapUv * 0.5 + vec2( mod( iTile, 2.0 ), floor( iTile / 2.0 ) ) * 0.5;`,
      );
  };
  m.customProgramCacheKey = () => 'hollow-decal';
  return m;
}

/** The wall glyphs: an unlit tile of the glyph atlas, tinted (and brightened) per instance. */
export function glyphMaterial(map: THREE.Texture): THREE.MeshBasicMaterial {
  const m = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
  m.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float iTile;')
      .replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
        vMapUv = vMapUv * 0.5 + vec2( mod( iTile, 2.0 ), floor( iTile / 2.0 ) ) * 0.5;`,
      );
  };
  m.customProgramCacheKey = () => 'hollow-glyph';
  return m;
}

/** Soft additive light (portal beams, lantern pools, the crystal's chime flash). */
export function glowMaterial(): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    fog: false,
    side: THREE.DoubleSide,
  });
}

/** A ground pool with a soft beam over it, fading to black (additive: black is clear). */
export function beamGeometry(): THREE.BufferGeometry {
  return prim('beam', () => {
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const seg = 20;
    const add = (x: number, y: number, z: number, v: number) => {
      pos.push(x, y, z);
      col.push(v, v, v);
    };
    // The pool: soft in the middle with a brighter ring near its edge, so a tap target
    // reads at a glance; radii and brightness from the middle out.
    const rings = [
      [0.32, 0.22],
      [0.43, 0.45],
      [0.5, 0],
    ] as const;
    add(0, 0.03, 0, 0.5);
    for (const [r, v] of rings)
      for (let i = 0; i < seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        add(Math.cos(a) * r, 0.03, Math.sin(a) * r, v);
      }
    for (let i = 0; i < seg; i++) idx.push(0, 1 + ((i + 1) % seg), 1 + i);
    for (let k = 0; k < rings.length - 1; k++)
      for (let i = 0; i < seg; i++) {
        const j = (i + 1) % seg;
        const a = 1 + k * seg;
        const b = a + seg;
        idx.push(a + i, a + j, b + i, a + j, b + j, b + i);
      }
    // The beam: three crossed sheets, bright down the middle and at the foot, clear at
    // their edges and top, so it reads as soft light from any side (never a hard cone).
    for (let p = 0; p < 3; p++) {
      const a = (p / 3) * Math.PI;
      const cx = Math.cos(a);
      const cz = Math.sin(a);
      const b0 = pos.length / 3;
      for (const [y, w, v] of [
        [0.03, 0.2, 0.42],
        [1, 0.3, 0],
      ] as const) {
        add(-cx * w, y, -cz * w, 0);
        add(0, y, 0, v);
        add(cx * w, y, cz * w, 0);
      }
      idx.push(
        b0,
        b0 + 1,
        b0 + 3,
        b0 + 1,
        b0 + 4,
        b0 + 3,
        b0 + 1,
        b0 + 2,
        b0 + 4,
        b0 + 2,
        b0 + 5,
        b0 + 4,
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    return g;
  });
}

// ---------------------------------------------------------------- painted atlases

function canvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')!];
}

/** A fixed little hash for painting (the same picture every page). */
function rnd(i: number): number {
  const v = Math.sin(i * 91.345 + 7.13) * 43758.5453;
  return v - Math.floor(v);
}

function texture(c: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 2;
  return t;
}

let decals: THREE.CanvasTexture | null = null;
/** Tiles: 0 a crack, 1 a puddle, 2 pebbles, 3 leaf litter (u right, v up). */
export function decalAtlas(): THREE.CanvasTexture {
  if (decals) return decals;
  const S = 256;
  const H = S / 2;
  const [c, g] = canvas(S);
  const cell = (tile: number): [number, number] => [(tile % 2) * H, (1 - Math.floor(tile / 2)) * H];
  // A crack: a dark branching line with a pale lip.
  {
    const [ox, oy] = cell(0);
    g.lineCap = 'round';
    const branch = (x: number, y: number, a: number, len: number, w: number, k: number) => {
      if (len < 6 || w < 0.6) return;
      const x2 = x + Math.cos(a) * len;
      const y2 = y + Math.sin(a) * len;
      g.strokeStyle = 'rgba(205,190,170,0.35)';
      g.lineWidth = w + 2;
      g.beginPath();
      g.moveTo(ox + x, oy + y + 1);
      g.lineTo(ox + x2, oy + y2 + 1);
      g.stroke();
      g.strokeStyle = 'rgba(28,20,24,0.85)';
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(ox + x, oy + y);
      g.lineTo(ox + x2, oy + y2);
      g.stroke();
      branch(x2, y2, a + (rnd(k) - 0.5) * 0.9, len * 0.78, w * 0.8, k + 1);
      if (rnd(k + 7) < 0.45)
        branch(x2, y2, a + (rnd(k + 3) > 0.5 ? 0.9 : -0.9), len * 0.5, w * 0.6, k + 11);
    };
    branch(18, 70, -0.2, 24, 3.4, 1);
    branch(64, 64, 2.6, 18, 2.6, 30);
  }
  // A puddle: a soft-edged pool with a sky sheen and a bright rim.
  {
    const [ox, oy] = cell(1);
    const grd = g.createRadialGradient(ox + 62, oy + 66, 6, ox + 64, oy + 64, 54);
    grd.addColorStop(0, 'rgba(120,170,210,0.85)');
    grd.addColorStop(0.7, 'rgba(70,110,150,0.75)');
    grd.addColorStop(0.92, 'rgba(170,210,235,0.6)');
    grd.addColorStop(1, 'rgba(60,80,100,0)');
    g.fillStyle = grd;
    g.beginPath();
    g.ellipse(ox + 64, oy + 64, 54, 40, 0.3, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = 'rgba(235,245,255,0.55)';
    g.beginPath();
    g.ellipse(ox + 50, oy + 54, 14, 5, 0.3, 0, Math.PI * 2);
    g.fill();
  }
  // Pebbles: a scatter of rounded stones with a light top and a soft shadow.
  {
    const [ox, oy] = cell(2);
    for (let i = 0; i < 14; i++) {
      const x = ox + 18 + rnd(i) * 92;
      const y = oy + 18 + rnd(i + 40) * 92;
      const r = 4 + rnd(i + 80) * 8;
      g.fillStyle = 'rgba(20,16,20,0.4)';
      g.beginPath();
      g.ellipse(x + 2, y + 3, r, r * 0.8, 0, 0, Math.PI * 2);
      g.fill();
      const tone = 120 + Math.floor(rnd(i + 9) * 70);
      g.fillStyle = `rgb(${tone},${tone - 8},${tone - 14})`;
      g.beginPath();
      g.ellipse(x, y, r, r * 0.8, rnd(i + 5) * 3, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = 'rgba(255,250,240,0.35)';
      g.beginPath();
      g.ellipse(x - r * 0.3, y - r * 0.3, r * 0.4, r * 0.25, 0, 0, Math.PI * 2);
      g.fill();
    }
  }
  // Leaf litter: little leaves fallen from the Grove above, russet, gold and green.
  {
    const [ox, oy] = cell(3);
    const tones = ['#b0642c', '#d59a3a', '#7d8a3a', '#9a4a2a', '#c9b04a'];
    for (let i = 0; i < 18; i++) {
      const x = ox + 16 + rnd(i + 200) * 96;
      const y = oy + 16 + rnd(i + 300) * 96;
      const a = rnd(i + 400) * Math.PI * 2;
      g.save();
      g.translate(x, y);
      g.rotate(a);
      g.fillStyle = tones[i % tones.length]!;
      g.beginPath();
      g.ellipse(0, 0, 9, 4.5, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = 'rgba(60,30,10,0.6)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(-9, 0);
      g.lineTo(11, 0);
      g.stroke();
      g.restore();
    }
  }
  decals = texture(c);
  return decals;
}

let glyphs: THREE.CanvasTexture | null = null;
/**
 * Friendly carvings, white on clear (the instance colour tints them): 0 a Nubbin with its
 * crown and floating ball, 1 a Nubbin with a heart, 2 an egg with a sprout, 3 a sun and moon.
 */
export function glyphAtlas(): THREE.CanvasTexture {
  if (glyphs) return glyphs;
  const S = 256;
  const H = S / 2;
  const [c, g] = canvas(S);
  g.strokeStyle = '#ffffff';
  g.fillStyle = '#ffffff';
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const at = (tile: number): [number, number] => [
    (tile % 2) * H + H / 2,
    (1 - Math.floor(tile / 2)) * H + H / 2,
  ];
  const nubbin = (cx: number, cy: number, heart: boolean) => {
    g.lineWidth = 6;
    // The body: a round head on a little round body with stubby arms and feet.
    g.beginPath();
    g.arc(cx, cy + 4, 26, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.moveTo(cx - 18, cy + 30);
    g.quadraticCurveTo(cx, cy + 50, cx + 18, cy + 30);
    g.stroke();
    // The crown point on top, and the floating ball above it.
    g.beginPath();
    g.moveTo(cx - 8, cy - 20);
    g.quadraticCurveTo(cx, cy - 34, cx + 4, cy - 40);
    g.stroke();
    if (heart) {
      const hx = cx + 4;
      const hy = cy - 50;
      g.beginPath();
      g.moveTo(hx, hy + 8);
      g.bezierCurveTo(hx - 14, hy - 2, hx - 6, hy - 14, hx, hy - 6);
      g.bezierCurveTo(hx + 6, hy - 14, hx + 14, hy - 2, hx, hy + 8);
      g.fill();
    } else {
      g.beginPath();
      g.arc(cx + 4, cy - 52, 7, 0, Math.PI * 2);
      g.fill();
    }
    // Big eyes and a small smile.
    g.beginPath();
    g.ellipse(cx - 9, cy + 1, 4, 6, 0, 0, Math.PI * 2);
    g.ellipse(cx + 9, cy + 1, 4, 6, 0, 0, Math.PI * 2);
    g.fill();
    g.lineWidth = 4;
    g.beginPath();
    g.arc(cx, cy + 10, 7, 0.2 * Math.PI, 0.8 * Math.PI);
    g.stroke();
  };
  {
    const [x, y] = at(0);
    nubbin(x, y + 4, false);
  }
  {
    const [x, y] = at(1);
    nubbin(x, y + 4, true);
  }
  {
    const [x, y] = at(2);
    g.lineWidth = 6;
    g.beginPath();
    g.ellipse(x, y + 10, 24, 32, 0, 0, Math.PI * 2);
    g.stroke();
    g.beginPath();
    g.moveTo(x, y - 22);
    g.quadraticCurveTo(x - 2, y - 38, x, y - 44);
    g.stroke();
    g.beginPath();
    g.ellipse(x - 10, y - 44, 10, 5, -0.4, 0, Math.PI * 2);
    g.ellipse(x + 10, y - 44, 10, 5, 0.4, 0, Math.PI * 2);
    g.fill();
    for (const [dx, dy] of [
      [-8, 6],
      [9, 16],
      [-2, 26],
    ] as const) {
      g.beginPath();
      g.arc(x + dx, y + dy, 4, 0, Math.PI * 2);
      g.fill();
    }
  }
  {
    const [x, y] = at(3);
    g.lineWidth = 5;
    g.beginPath();
    g.arc(x - 16, y, 16, 0, Math.PI * 2);
    g.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.beginPath();
      g.moveTo(x - 16 + Math.cos(a) * 22, y + Math.sin(a) * 22);
      g.lineTo(x - 16 + Math.cos(a) * 30, y + Math.sin(a) * 30);
      g.stroke();
    }
    g.beginPath();
    g.arc(x + 24, y, 18, 0.5 * Math.PI, 1.5 * Math.PI, true);
    g.arc(x + 16, y, 13, 1.5 * Math.PI, 0.5 * Math.PI, false);
    g.fill();
  }
  glyphs = texture(c);
  return glyphs;
}

let chasm: THREE.CanvasTexture | null = null;
/**
 * The painted chasm beyond a vista's lip (v 0 at the lip, 1 far out): a cool deep blue
 * falling away into a soft dark (a mid-tone, never black), far cliffs, faint mist, and
 * crystals glittering far below.
 */
export function chasmTexture(): THREE.CanvasTexture {
  if (chasm) return chasm;
  const S = 256;
  const [c, g] = canvas(S);
  const dir = GROVE3D.cave.dress.vista;
  const grd = g.createLinearGradient(0, S, 0, 0);
  grd.addColorStop(0, dir.near);
  grd.addColorStop(0.5, dir.mid);
  grd.addColorStop(1, dir.far);
  g.fillStyle = grd;
  g.fillRect(0, 0, S, S);
  // Far cliffs: soft layered silhouettes.
  for (let layer = 0; layer < 3; layer++) {
    g.fillStyle = `rgba(30,40,80,${0.28 - layer * 0.07})`;
    g.beginPath();
    g.moveTo(0, S);
    for (let x = 0; x <= S; x += 16) {
      const y = S * (0.3 + layer * 0.2) + Math.sin(x * 0.05 + layer * 2) * 12 + rnd(x + layer) * 10;
      g.lineTo(x, S - y);
    }
    g.lineTo(S, S);
    g.closePath();
    g.fill();
  }
  // Crystals far below, glittering.
  for (let i = 0; i < 46; i++) {
    const x = rnd(i + 500) * S;
    const y = (0.15 + rnd(i + 600) * 0.8) * S;
    const r = 1 + rnd(i + 700) * 2.4;
    g.fillStyle = i % 3 ? dir.crystal : '#ffd9ff';
    g.globalAlpha = 0.5 + rnd(i + 800) * 0.5;
    g.beginPath();
    g.moveTo(x, y - r * 2);
    g.lineTo(x + r, y);
    g.lineTo(x, y + r * 2);
    g.lineTo(x - r, y);
    g.fill();
  }
  g.globalAlpha = 1;
  // Mist rising from the depths near the lip.
  const mist = g.createLinearGradient(0, S, 0, S * 0.6);
  mist.addColorStop(0, 'rgba(180,200,255,0.25)');
  mist.addColorStop(1, 'rgba(180,200,255,0)');
  g.fillStyle = mist;
  g.fillRect(0, 0, S, S);
  chasm = texture(c);
  chasm.wrapS = THREE.RepeatWrapping;
  return chasm;
}

let fall: THREE.CanvasTexture | null = null;
/** Falling water streaks, tiling up and down (scrolled by the dressing's update). */
export function fallTexture(): THREE.CanvasTexture {
  if (fall) return fall;
  const S = 128;
  const [c, g] = canvas(S);
  g.fillStyle = 'rgba(120,190,230,0.55)';
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 40; i++) {
    const x = rnd(i + 900) * S;
    const y = rnd(i + 950) * S;
    const len = 12 + rnd(i + 990) * 40;
    g.strokeStyle = `rgba(235,250,255,${0.4 + rnd(i) * 0.5})`;
    g.lineWidth = 1 + rnd(i + 3) * 2.5;
    for (const off of [0, -S, S]) {
      g.beginPath();
      g.moveTo(x, y + off);
      g.lineTo(x, y + len + off);
      g.stroke();
    }
  }
  fall = texture(c);
  fall.wrapS = fall.wrapT = THREE.RepeatWrapping;
  return fall;
}
