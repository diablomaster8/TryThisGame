import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GROVE3D } from '../config/tuning';
import type { Surface } from '../samples/aaa-kit';
import { toonShader } from '../samples/creatures';
import { addHull } from './toon-outline';

/**
 * The 3D Grove's building kit (art pass 2): bevelled walls, stone plinths, timber trim,
 * roofs with real overhangs and barge boards, framed windows with sills and shutters,
 * framed doors with a step, and the warm light decals that spill from windows and lanterns
 * at night. Everything is lit in the creatures' toon bands (`toonShader`, with the sky's
 * share of fill), so the houses and the Nubbins read as one painted world.
 *
 * Pieces are gathered into buckets by material and merged into one mesh per bucket, so the
 * extra trim costs geometry, not draw calls: a house is its (tappable) walls plus a share
 * of the Grove-wide roof, timber, stone and glass meshes.
 */

/** A toon-lit painted surface; one program for every building material. */
export function buildingMaterial(
  map: Surface,
  o: { color?: string; normal?: number } = {},
): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    map: map.map,
    normalMap: map.normal,
    normalScale: new THREE.Vector2(o.normal ?? 0.35, o.normal ?? 0.35),
    roughness: 1,
    metalness: 0,
    color: o.color ?? '#ffffff',
  });
  const sky = GROVE3D.toon.sky;
  m.onBeforeCompile = (shader) => toonShader(shader, 0, sky);
  m.customProgramCacheKey = () => `building-toon|${sky}`;
  return m;
}

/** Scale a geometry's UVs so its texture repeats every `texel` world units. */
function tile(geo: THREE.BufferGeometry, u: number, v: number): THREE.BufferGeometry {
  const uv = geo.attributes.uv as THREE.BufferAttribute | undefined;
  if (uv) for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * u, uv.getY(i) * v);
  return geo;
}

/** A bevelled box whose texture tiles every `texel` units over its long faces. */
export function bevelBox(
  w: number,
  h: number,
  d: number,
  radius = 0.06,
  texel = 0,
): THREE.BufferGeometry {
  const g = new RoundedBoxGeometry(w, h, d, 1, Math.min(radius, w / 2, h / 2, d / 2) * 0.999);
  return texel > 0 ? tile(g, Math.max(w, d) / texel, h / texel) : g;
}

const plainBox = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

/**
 * Geometry gathered by material, merged on `flush`. `outline` buckets get the toon hull
 * the creatures wear (only smooth-normalled pieces go there: a hull on a sharp box gaps
 * at the corners).
 */
export class Buckets {
  private readonly lists = new Map<
    string,
    { mat: THREE.Material; geos: THREE.BufferGeometry[]; outline: boolean; shadow: boolean }
  >();
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly one = new THREE.Vector3(1, 1, 1);

  material(key: string, mat: THREE.Material, outline = false, shadow = true): void {
    if (!this.lists.has(key)) this.lists.set(key, { mat, geos: [], outline, shadow });
  }

  materialOf(key: string): THREE.Material {
    const b = this.lists.get(key);
    if (!b) throw new Error(`no bucket ${key}`);
    return b.mat;
  }

  /** Add `geo` placed at `p`, turned by `rot` (x, y, z in radians) about its centre. */
  add(
    key: string,
    geo: THREE.BufferGeometry,
    p: THREE.Vector3Like,
    rot: readonly [number, number, number] = [0, 0, 0],
    parent?: THREE.Matrix4,
  ): void {
    const b = this.lists.get(key);
    if (!b) throw new Error(`no bucket ${key}`);
    this.q.setFromEuler(this.e.set(rot[0], rot[1], rot[2]));
    this.m4.compose(new THREE.Vector3(p.x, p.y, p.z), this.q, this.one);
    if (parent) this.m4.premultiply(parent);
    const g = (geo.index ? geo.toNonIndexed() : geo.clone()).applyMatrix4(this.m4);
    for (const k of Object.keys(g.attributes))
      if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    if (!g.attributes.uv)
      g.setAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(g.attributes.position!.count * 2), 2),
      );
    b.geos.push(g);
    geo.dispose();
  }

  /** One mesh per bucket under `group`; returns them by key. */
  flush(group: THREE.Object3D): Map<string, THREE.Mesh> {
    const out = new Map<string, THREE.Mesh>();
    for (const [key, b] of this.lists) {
      if (!b.geos.length) continue;
      const geo = mergeGeometries(b.geos, false);
      for (const g of b.geos) g.dispose();
      b.geos = [];
      if (!geo) continue;
      const mesh = new THREE.Mesh(geo, b.mat);
      mesh.castShadow = b.shadow;
      mesh.receiveShadow = true;
      mesh.name = key;
      if (b.outline) addHull(mesh);
      group.add(mesh);
      out.set(key, mesh);
    }
    return out;
  }
}

/** One window, door or lantern that throws light onto the ground at night. */
export interface LightSpill {
  x: number;
  z: number;
  /** Which way the light falls from the opening (radians about y; 0 = +z). */
  yaw: number;
  size: number;
}

export interface HouseStyle {
  wall: string;
  shutter: string;
  /** How far the roof reaches past the walls. */
  overhang: number;
  /** Ridge height above the walls, as a share of the wall height. */
  pitch: number;
  chimney?: boolean;
}

/** Bucket keys the house builder uses; `kit` must have them all. */
export const BUILD_KEYS = ['roof', 'timber', 'stone', 'glass', 'door'] as const;

/**
 * A house of footprint w × d and wall height h at (x, y, z), door and windows on its +z
 * face: the walls (a bevelled box and the two gables, returned as one tappable mesh), and
 * into the buckets the plinth, the corner posts and eave band, the roof slabs with their
 * ridge and barge boards, the windows (frame, cross, sill, shutters), the door and its
 * step, and a chimney if asked. Window glass goes to `glass`; spills and light points are
 * pushed for the night.
 */
export function house(
  kit: Buckets,
  wallMat: THREE.Material,
  shutterKey: string,
  at: { x: number; y: number; z: number },
  size: { w: number; d: number; h: number },
  style: HouseStyle,
  spills: LightSpill[],
  lights: THREE.Vector3[],
): THREE.Mesh {
  const { x, y, z } = at;
  const { w, d, h } = size;
  const rh = h * style.pitch;
  // Walls and gables: one tappable mesh.
  const parts: THREE.BufferGeometry[] = [];
  const body = bevelBox(w, h, d, 0.09, 2.2);
  body.translate(0, h / 2, 0);
  parts.push(body.index ? body.toNonIndexed() : body);
  const tri = new THREE.Shape();
  tri.moveTo(-w / 2, 0);
  tri.lineTo(w / 2, 0);
  tri.lineTo(0, rh);
  tri.closePath();
  const gable = new THREE.ExtrudeGeometry(tri, { depth: d - 0.04, bevelEnabled: false });
  tile(gable, 1 / 2.2, 1 / 2.2);
  gable.translate(0, h, -(d - 0.04) / 2);
  parts.push(gable);
  for (const p of parts)
    for (const k of Object.keys(p.attributes))
      if (k !== 'position' && k !== 'normal' && k !== 'uv') p.deleteAttribute(k);
  const wallGeo = mergeGeometries(parts, false)!;
  for (const p of parts) p.dispose();
  const walls = new THREE.Mesh(wallGeo, wallMat);
  walls.position.set(x, y, z);
  walls.castShadow = walls.receiveShadow = true;
  addHull(walls);

  // Stone plinth, reaching under the slope so a house on a hillside never floats.
  kit.add('stone', bevelBox(w + 0.24, 0.9, d + 0.24, 0.07, 1.4), { x, y: y - 0.2, z });
  // Timber: corner posts and the eave band.
  const t = 0.16;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      kit.add('timber', plainBox(t, h, t), {
        x: x + (sx * w) / 2,
        y: y + h / 2,
        z: z + (sz * d) / 2,
      });
  for (const sz of [-1, 1])
    kit.add('timber', plainBox(w + t, 0.16, t), { x, y: y + h - 0.08, z: z + (sz * d) / 2 });
  for (const sx of [-1, 1])
    kit.add('timber', plainBox(t, 0.16, d + t), { x: x + (sx * w) / 2, y: y + h - 0.08, z });

  // The roof: two slabs from the ridge out past the eaves, a ridge cap, barge boards.
  const a = Math.atan2(rh, w / 2);
  const o = style.overhang;
  const slope = Math.hypot(w / 2, rh) + o;
  const thick = 0.16;
  const len = d + o * 2;
  for (const side of [-1, 1]) {
    const cx = side * Math.cos(a) * slope * 0.5;
    const cy = rh - Math.sin(a) * slope * 0.5;
    const nx = side * Math.sin(a) * (thick / 2);
    const ny = Math.cos(a) * (thick / 2);
    kit.add(
      'roof',
      tile(bevelBox(slope, thick, len, 0.05), slope / 1.6, len / 1.6),
      {
        x: x + cx + nx,
        y: y + h + cy + ny,
        z,
      },
      [0, 0, -side * a],
    );
    // Barge boards along both gable ends.
    for (const sz of [-1, 1])
      kit.add(
        'timber',
        plainBox(slope, 0.2, 0.08),
        {
          x: x + cx + nx * 0.4,
          y: y + h + cy + ny * 0.4 - 0.06,
          z: z + (sz * len) / 2,
        },
        [0, 0, -side * a],
      );
  }
  kit.add('timber', bevelBox(0.26, 0.2, len + 0.1, 0.06), { x, y: y + h + rh + thick * 0.75, z });
  if (style.chimney) {
    const cx = x + w * 0.25;
    const top = y + h + rh * 0.5 + 1.0;
    kit.add('stone', bevelBox(0.62, 1.7, 0.62, 0.06, 1.2), {
      x: cx,
      y: top - 0.85,
      z: z - d * 0.15,
    });
    kit.add('stone', bevelBox(0.78, 0.16, 0.78, 0.05), { x: cx, y: top + 0.05, z: z - d * 0.15 });
  }

  // The door: a frame, the leaf set back in it, a stone step.
  const fz = z + d / 2;
  kit.add('door', bevelBox(0.86, 1.62, 0.1, 0.03), { x, y: y + 0.81, z: fz + 0.01 });
  kit.add('timber', plainBox(0.14, 1.8, 0.16), { x: x - 0.5, y: y + 0.9, z: fz + 0.04 });
  kit.add('timber', plainBox(0.14, 1.8, 0.16), { x: x + 0.5, y: y + 0.9, z: fz + 0.04 });
  kit.add('timber', plainBox(1.2, 0.16, 0.18), { x, y: y + 1.82, z: fz + 0.05 });
  kit.add('stone', bevelBox(1.3, 0.22, 0.6, 0.05, 1), { x, y: y + 0.05, z: fz + 0.36 });
  spills.push({ x, z: fz + 0.9, yaw: 0, size: 1.6 });

  // Windows: glass, a frame, a cross, a sill and two shutters.
  for (const dx of [-w * 0.3, w * 0.3]) {
    const wx = x + dx;
    const wy = y + h * 0.55;
    kit.add('glass', plainBox(0.7, 0.7, 0.06), { x: wx, y: wy, z: fz + 0.01 });
    kit.add('timber', plainBox(0.88, 0.1, 0.14), { x: wx, y: wy + 0.4, z: fz + 0.03 });
    kit.add('timber', plainBox(0.1, 0.8, 0.14), { x: wx - 0.4, y: wy, z: fz + 0.03 });
    kit.add('timber', plainBox(0.1, 0.8, 0.14), { x: wx + 0.4, y: wy, z: fz + 0.03 });
    kit.add('timber', plainBox(0.05, 0.7, 0.08), { x: wx, y: wy, z: fz + 0.05 });
    kit.add('timber', plainBox(0.7, 0.05, 0.08), { x: wx, y: wy, z: fz + 0.05 });
    kit.add('stone', bevelBox(1.0, 0.1, 0.24, 0.03), { x: wx, y: wy - 0.42, z: fz + 0.08 });
    for (const s of [-1, 1])
      kit.add(
        shutterKey,
        bevelBox(0.34, 0.78, 0.05, 0.02),
        { x: wx + s * 0.64, y: wy, z: fz + 0.05 },
        [0, s * 0.35, 0],
      );
    lights.push(new THREE.Vector3(wx, wy, fz + 0.9));
    spills.push({ x: wx, z: fz + 1.0, yaw: 0, size: 1.4 });
  }
  return walls;
}

/** A soft round of light, white in the middle, for the night spills (one small canvas). */
function spillTexture(): THREE.Texture {
  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const g = cv.getContext('2d')!;
  const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.45, 'rgba(255,255,255,0.45)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Every spill as one mesh of small grids draped on the ground, drawn additively; the
 * scene fades its material in with the lamps. Each spill is stretched away from its
 * opening, so a window lays a long pool of light on the grass in front of it.
 */
export function buildSpills(
  spills: readonly LightSpill[],
  ground: (x: number, z: number) => number,
): THREE.Mesh {
  const N = 4;
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  for (const sp of spills) {
    const base = pos.length / 3;
    const c = Math.cos(sp.yaw);
    const s = Math.sin(sp.yaw);
    for (let j = 0; j <= N; j++)
      for (let i = 0; i <= N; i++) {
        const u = i / N - 0.5;
        const v = j / N - 0.5;
        const lx = u * sp.size;
        const lz = v * sp.size * 1.5;
        const wx = sp.x + lx * c + lz * s;
        const wz = sp.z - lx * s + lz * c;
        pos.push(wx, ground(wx, wz) + 0.06, wz);
        uv.push(i / N, j / N);
      }
    for (let j = 0; j < N; j++)
      for (let i = 0; i < N; i++) {
        const a = base + j * (N + 1) + i;
        const b = a + N + 1;
        index.push(a, b, a + 1, a + 1, b, b + 1);
      }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  const mat = new THREE.MeshBasicMaterial({
    map: spillTexture(),
    color: '#ffb35c',
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
    fog: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.name = 'light-spills';
  mesh.renderOrder = 1;
  return mesh;
}
