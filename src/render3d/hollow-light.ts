import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GROVE3D } from '../config/tuning';
import {
  cellAt,
  cellCentre,
  cellDist,
  elevationAt,
  FLOOR,
  WALL,
  type Cell,
  type Floor,
} from '../sim/dungeon';
import { CaveLamps } from './cave-lamps';
import { caveShed } from './cave-shed';
import { fogged } from './hollow-fog';
import {
  CELL,
  cellHash,
  disposeObjects,
  mat,
  type Baker,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';

/**
 * The Hollow's light (recommendations items 5, 6, 14, 15, 29 and 30). Torches are wall
 * sconces (one InstancedMesh each for the bracket, the flame sprite and the halo), some
 * starting cold until the Keeper lights them; crystals are big emissive clusters and
 * mushrooms small glowing ones at the wall foot (one InstancedMesh each). Their light is
 * baked into the floor and wall vertices by `lightBaker` (the rock applies it, see the bake
 * seam in `hollow-ctx.ts`), with the torch share flickering through `uniforms.torchFlicker`.
 * The Keeper's lamp also paints a soft ground disc and a warm wall wash that follow it, a
 * decal rather than a fifth real light. The four point lights (`CaveLamps`) follow the
 * Keeper and the lit torches nearest it. Every number is in `GROVE3D.cave.light`.
 */
const CFG = GROVE3D.cave.light;
/** Where an unlit torch sits for the lamps: so far away that it is never one of the nearest. */
const FAR = 1e6;

/** A torch: its cell, the wall face it hangs on (the wall is to the north) and its heights. */
export interface TorchSpot {
  cell: Cell;
  x: number;
  /** The wall's face: the sconce stands `out` in front of it. */
  wallZ: number;
  /** Ground height at the torch's cell. */
  ground: number;
}

/** Torches in the sim's order, with the wall face each hangs on. */
export function torchSpots(f: Floor): TorchSpot[] {
  return f.torches.map((cell) => {
    const p = cellCentre(f, cell);
    return {
      cell,
      x: p.x,
      wallZ: p.z - CELL / 2,
      ground: f.elevation[cell.y * f.cols + cell.x] ?? 0,
    };
  });
}

const litState = new WeakMap<Floor, boolean[]>();

/**
 * Which torches burn at the start of a visit: all but a seeded share (`sconce.unlitShare`),
 * and always the one nearest the stairs, so the way in is lit. The state lives with the
 * floor so the baker and the sconces agree before either is built.
 */
export function litTorches(f: Floor): boolean[] {
  let lit = litState.get(f);
  if (lit) return lit;
  lit = f.torches.map((t) => cellHash(t.x, t.y, 91) >= CFG.sconce.unlitShare);
  let near = -1;
  let best = Infinity;
  f.torches.forEach((t, i) => {
    const d = cellDist(t, f.stairsUp);
    if (d < best) {
      best = d;
      near = i;
    }
  });
  if (near >= 0) lit[near] = true;
  litState.set(f, lit);
  return lit;
}

/** Wall-foot spots for glowing mushrooms: seeded, spaced, never on a special cell. */
export interface MushroomSpot {
  x: number;
  z: number;
  /** The unit direction toward the wall. */
  dx: number;
  dz: number;
  ground: number;
}

const DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export function mushroomSpots(f: Floor): MushroomSpot[] {
  const M = CFG.mushroom;
  const keep: Cell[] = [f.stairsUp, f.chest, ...(f.stairsDown ? [f.stairsDown] : [])];
  const cand: Array<{ c: Cell; h: number; dir: readonly [number, number] }> = [];
  for (let y = 1; y < f.rows - 1; y++) {
    for (let x = 1; x < f.cols - 1; x++) {
      if (cellAt(f, x, y) !== FLOOR) continue;
      const h = cellHash(x, y, 53);
      if (h >= M.share) continue;
      const start = Math.floor(cellHash(x, y, 54) * 4);
      let dir: readonly [number, number] | null = null;
      for (let k = 0; k < 4 && !dir; k++) {
        const d = DIRS[(start + k) % 4]!;
        if (cellAt(f, x + d[0], y + d[1]) === WALL) dir = d;
      }
      if (!dir) continue;
      const c = { x, y };
      if (keep.some((k) => cellDist(k, c) < 3)) continue;
      if (f.torches.some((k) => cellDist(k, c) < 1.5)) continue;
      if (f.crystals.some((k) => cellDist(k, c) < 2)) continue;
      cand.push({ c, h, dir });
    }
  }
  cand.sort((a, b) => a.h - b.h);
  const out: MushroomSpot[] = [];
  const taken: Cell[] = [];
  for (const k of cand) {
    if (out.length >= M.max) break;
    if (taken.some((t) => cellDist(t, k.c) < M.spacing)) continue;
    taken.push(k.c);
    const p = cellCentre(f, k.c);
    const [dx, dz] = k.dir;
    out.push({
      x: p.x + dx * (CELL / 2 - 0.25),
      z: p.z + dz * (CELL / 2 - 0.25),
      dx,
      dz,
      ground: f.elevation[k.c.y * f.cols + k.c.x] ?? 0,
    });
  }
  return out;
}

interface Source {
  x: number;
  y: number;
  z: number;
  r: number;
  s: number;
  /** 0 torch, 1 crystal, 2 mushroom. */
  kind: 0 | 1 | 2;
  /** Torch index, for the lit check. */
  i: number;
}

/**
 * The bake seam's function (item 5): warm torch light into `torch` (the flickering share),
 * crystal and mushroom light into `base`, tinted by the band's crystal and glow colours.
 * Quadratic falloff from each source; a torch that is not lit gives nothing, so
 * `lightTorch` plus a re-bake lights its surroundings. Sources are bucketed in a grid the
 * size of the widest radius so a vertex checks nine buckets, not every source.
 */
export function lightBaker(f: Floor, ctx: HollowCtx): Baker {
  const B = CFG.bake;
  const lit = litTorches(f);
  const src: Source[] = [];
  torchSpots(f).forEach((t, i) =>
    src.push({
      x: t.x,
      y: t.ground + CFG.sconce.height + 0.3,
      z: t.wallZ + 0.3,
      r: B.torch.radius,
      s: B.torch.strength,
      kind: 0,
      i,
    }),
  );
  const crystalR = f.special === 'crystal' ? B.crystal.crystalFloorRadius : B.crystal.radius;
  for (const c of f.crystals) {
    const p = cellCentre(f, c);
    const g = f.elevation[c.y * f.cols + c.x] ?? 0;
    src.push({
      x: p.x,
      y: g + B.crystal.height,
      z: p.z,
      r: crystalR,
      s: B.crystal.strength,
      kind: 1,
      i: -1,
    });
  }
  for (const m of mushroomSpots(f))
    src.push({
      x: m.x,
      y: m.ground + B.mushroom.height,
      z: m.z,
      r: B.mushroom.radius,
      s: B.mushroom.strength,
      kind: 2,
      i: -1,
    });
  const size = Math.max(B.torch.radius, crystalR, B.mushroom.radius);
  const key = (gx: number, gz: number) => (gx + 512) * 1024 + (gz + 512);
  const grid = new Map<number, Source[]>();
  for (const s of src) {
    const k = key(Math.floor(s.x / size), Math.floor(s.z / size));
    const list = grid.get(k);
    if (list) list.push(s);
    else grid.set(k, [s]);
  }
  const torchCol = new THREE.Color(ctx.band.torch);
  const crystalCol = new THREE.Color(ctx.band.crystal);
  const glowCol = new THREE.Color(ctx.band.glow);
  return (x, y, z, _ny, base, torch) => {
    const gx = Math.floor(x / size);
    const gz = Math.floor(z / size);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const list = grid.get(key(gx + dx, gz + dz));
        if (!list) continue;
        for (const s of list) {
          if (s.kind === 0 && !lit[s.i]) continue;
          const ex = x - s.x;
          const ey = y - s.y;
          const ez = z - s.z;
          const d2 = ex * ex + ey * ey + ez * ez;
          if (d2 >= s.r * s.r) continue;
          const t = 1 - Math.sqrt(d2) / s.r;
          const w = t * t * s.s;
          if (s.kind === 0) {
            torch.r += torchCol.r * w;
            torch.g += torchCol.g * w;
            torch.b += torchCol.b * w;
          } else {
            const c = s.kind === 1 ? crystalCol : glowCol;
            base.r += c.r * w;
            base.g += c.g * w;
            base.b += c.b * w;
          }
        }
      }
    }
  };
}

/** A soft round glow: white in the middle fading out; tinted by colour and opacity. */
function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  if (g) {
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,255,255,0.9)');
    r.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    r.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = r;
    g.fillRect(0, 0, 64, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A teardrop flame, bright core and orange edge, on a transparent ground. */
function flameTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 48;
  c.height = 80;
  const g = c.getContext('2d');
  if (g) {
    const shape = (w: number, top: number, bottom: number, fill: string) => {
      g.beginPath();
      g.moveTo(24, top);
      g.bezierCurveTo(24 + w, top + 28, 24 + w, bottom - 14, 24, bottom);
      g.bezierCurveTo(24 - w, bottom - 14, 24 - w, top + 28, 24, top);
      g.fillStyle = fill;
      g.fill();
    };
    shape(20, 2, 78, 'rgba(255,140,40,0.85)');
    shape(13, 16, 76, 'rgba(255,200,90,0.95)');
    shape(6, 36, 74, 'rgba(255,248,210,1)');
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** The sconce: a back plate on the wall and a small cup that holds the flame. */
function sconceGeometry(): THREE.BufferGeometry {
  const plate = new THREE.BoxGeometry(0.24, 0.36, 0.05);
  plate.translate(0, 0, 0.025);
  const arm = new THREE.BoxGeometry(0.06, 0.06, 0.2);
  arm.translate(0, -0.06, 0.15);
  const cup = new THREE.CylinderGeometry(0.12, 0.07, 0.16, 8);
  cup.translate(0, 0.0, 0.26);
  return mergeGeometries([plate, arm, cup], false)!;
}

/** One mushroom: a stalk and a cap, merged so the whole kind is one draw. */
function mushroomGeometry(): THREE.BufferGeometry {
  const stalk = new THREE.CylinderGeometry(0.035, 0.05, 0.2, 6);
  stalk.translate(0, 0.1, 0);
  const cap = new THREE.SphereGeometry(0.15, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2);
  cap.scale(1, 0.7, 1);
  cap.translate(0, 0.2, 0);
  return mergeGeometries([stalk, cap], false)!;
}

/** A crystal shard: a stretched bipyramid standing on y = 0, 2 units tall. */
function shardGeometry(): THREE.BufferGeometry {
  const g = new THREE.OctahedronGeometry(1, 0);
  g.translate(0, 1, 0);
  return g;
}

export class HollowLight implements HollowModule {
  /** The four point lights; the scene sets their colour and motion. */
  readonly lamps: CaveLamps;
  /** Set by `Hollow`: re-bakes the floor's light after a torch is lit (`HollowRock.rebake`). */
  rebake: (() => void) | null = null;
  private readonly objs: THREE.Object3D[] = [];
  private readonly glowTex = glowTexture();
  private readonly flameTex = flameTexture();
  private readonly haloMat: THREE.MeshBasicMaterial;
  private readonly flameMat: THREE.MeshBasicMaterial;
  private readonly cookieMat: THREE.MeshBasicMaterial;
  private floor: Floor | null = null;
  private ctx: HollowCtx | null = null;
  private spots: TorchSpot[] = [];
  private lit: boolean[] = [];
  /** Per torch: hidden because the camera is behind its wall (the wall is cut away there). */
  private hidden: boolean[] = [];
  /** Where each torch is for the lamps: its flame, or far away while it is unlit. */
  private torchAt: THREE.Vector3[] = [];
  private sconces: THREE.InstancedMesh | null = null;
  private flames: THREE.InstancedMesh | null = null;
  private halos: THREE.InstancedMesh | null = null;
  private ground: THREE.Mesh | null = null;
  private wash: THREE.Mesh | null = null;
  private washDir = -1;
  private washAlpha = 0;
  private washFace = 0;
  private lastT = 0;
  private shed = false;
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly yAxis = new THREE.Vector3(0, 1, 0);
  private readonly pos = new THREE.Vector3();
  private readonly scl = new THREE.Vector3();
  private readonly col = new THREE.Color();

  constructor(parent: THREE.Object3D) {
    this.lamps = new CaveLamps(parent);
    const additive = {
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    } as const;
    // Fog-aware (R0153): a torch under the fog of war must not glow through it.
    this.haloMat = fogged(
      new THREE.MeshBasicMaterial({ map: this.glowTex, ...additive, opacity: 1 }),
    );
    this.flameMat = fogged(new THREE.MeshBasicMaterial({ map: this.flameTex, ...additive }));
    this.cookieMat = fogged(
      new THREE.MeshBasicMaterial({
        map: this.glowTex,
        color: CFG.cookie.color,
        ...additive,
        opacity: CFG.cookie.groundOpacity,
      }),
    );
    // The first cut of the governor's ladder: the halos and the wall wash go.
    caveShed.register({
      name: 'particles',
      apply: (s) => {
        this.shed = s;
        if (this.halos) this.halos.visible = !s;
        if (this.wash && s) this.wash.visible = false;
      },
    });
  }

  /**
   * Hidden meshes of the programs this module draws with, for the scene to link before the
   * first floor exists (an instanced basic material with a map and per-instance colour).
   */
  programSamples(): THREE.Object3D[] {
    const g = new THREE.PlaneGeometry(0.1, 0.1);
    const halo = new THREE.InstancedMesh(g, this.haloMat, 1);
    halo.setColorAt(0, new THREE.Color('#ffffff'));
    const flame = new THREE.InstancedMesh(g, this.flameMat, 1);
    return [halo, flame, new THREE.Mesh(g, this.cookieMat)];
  }

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = f;
    this.ctx = ctx;
    this.spots = torchSpots(f);
    this.lit = litTorches(f);
    this.hidden = this.spots.map(() => false);
    const n = this.spots.length;
    const S = CFG.sconce;
    this.torchAt = this.spots.map((t, i) => this.flamePos(t, new THREE.Vector3(), this.lit[i]!));

    // Sconces on the wall faces, with a flame sprite and a halo for each.
    const add = (o: THREE.Object3D) => {
      o.castShadow = o.receiveShadow = false;
      o.frustumCulled = false;
      ctx.group.add(o);
      this.objs.push(o);
    };
    this.sconces = new THREE.InstancedMesh(sconceGeometry(), mat('#3b2c26'), Math.max(1, n));
    const quad = (w: number, h: number, up: number) => {
      const g = new THREE.PlaneGeometry(w, h);
      g.translate(0, up, 0);
      return g;
    };
    this.flames = new THREE.InstancedMesh(
      quad(S.flameSize * 0.7, S.flameSize, S.flameSize / 2),
      this.flameMat,
      Math.max(1, n),
    );
    this.halos = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(S.haloSize, S.haloSize),
      this.haloMat,
      Math.max(1, n),
    );
    this.sconces.count = this.flames.count = this.halos.count = n;
    this.halos.visible = !this.shed;
    this.spots.forEach((t, i) => {
      this.setSconce(i, true);
      this.paintTorch(i);
      this.setFlame(i, 0, 1);
    });
    if (this.halos.instanceColor) this.halos.instanceColor.needsUpdate = true;
    // Draw the halo over the flame and both over the cave.
    this.halos.renderOrder = 3;
    this.flames.renderOrder = 4;
    add(this.sconces);
    add(this.flames);
    add(this.halos);

    // Crystals: big clusters of shards, all one InstancedMesh, in the band's colour.
    const C = CFG.crystal;
    const shardAt: THREE.Matrix4[] = [];
    const euler = new THREE.Euler();
    f.crystals.forEach((c, ci) => {
      const p = cellCentre(f, c);
      const g = f.elevation[c.y * f.cols + c.x] ?? 0;
      const count =
        C.shards[0] + Math.floor(cellHash(c.x, c.y, 61) * (C.shards[1] - C.shards[0] + 1));
      for (let k = 0; k < count; k++) {
        const h = (s: number) => cellHash(c.x + k * 3.1, c.y + ci, 62 + s);
        const a = (k / count) * Math.PI * 2 + h(0) * 0.8;
        const r = k === 0 ? 0 : 0.18 + h(1) * 0.3;
        const tall = k === 0 ? C.height[1] : C.height[0] + h(2) * (C.height[1] - C.height[0]) * 0.8;
        const wide = C.width[0] + h(3) * (C.width[1] - C.width[0]);
        const tilt = k === 0 ? 0.05 : C.tilt * (0.4 + h(4));
        euler.set(Math.sin(a) * tilt, h(5) * 6.28, -Math.cos(a) * tilt);
        const m = new THREE.Matrix4().compose(
          this.pos.set(p.x + Math.cos(a) * r, g - 0.04, p.z + Math.sin(a) * r),
          this.q.setFromEuler(euler),
          this.scl.set(wide, tall / 2, wide),
        );
        shardAt.push(m);
      }
    });
    if (shardAt.length) {
      const crystal = mat(ctx.band.crystal, {
        emissive: ctx.band.crystal,
        emissiveIntensity: C.glow,
        roughness: 0.25,
      });
      const mesh = new THREE.InstancedMesh(shardGeometry(), crystal, shardAt.length);
      shardAt.forEach((m, i) => mesh.setMatrixAt(i, m));
      add(mesh);
      mesh.frustumCulled = true;
    }

    // Mushrooms: seeded wall-foot clusters of small emissive caps.
    const M = CFG.mushroom;
    const spots = mushroomSpots(f);
    if (spots.length) {
      const shroom = mat(ctx.band.glow, {
        emissive: ctx.band.glow,
        emissiveIntensity: M.glow,
        roughness: 0.6,
      });
      const mesh = new THREE.InstancedMesh(mushroomGeometry(), shroom, spots.length * M.perSpot);
      let i = 0;
      spots.forEach((s, si) => {
        for (let k = 0; k < M.perSpot; k++) {
          const h = (a: number) => cellHash(si * 7 + k, s.x * 3 + s.z, 70 + a);
          const along = (h(0) - 0.5) * 0.7;
          const off = (h(1) - 0.5) * 0.25;
          const size = 1.1 + h(2) * (k === 0 ? 1.1 : 0.6);
          this.pos.set(s.x + -s.dz * along + s.dx * off, s.ground, s.z + s.dx * along + s.dz * off);
          this.q.setFromAxisAngle(this.yAxis, h(3) * 6.28);
          this.scl.set(size, size, size);
          mesh.setMatrixAt(i++, this.m4.compose(this.pos, this.q, this.scl));
        }
      });
      add(mesh);
      mesh.frustumCulled = true;
    }

    // The Keeper's lamp cookie: a ground disc and a wall wash, both following the Keeper.
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.cookieMat);
    ground.rotation.x = -Math.PI / 2;
    ground.renderOrder = 2;
    ground.visible = false;
    this.ground = ground;
    add(ground);
    const wash = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), this.cookieMat.clone());
    wash.renderOrder = 2;
    wash.visible = false;
    this.wash = wash;
    this.washDir = -1;
    this.washAlpha = 0;
    add(wash);
  }

  dispose(): void {
    disposeObjects(this.objs);
    (this.wash?.material as THREE.Material | undefined)?.dispose();
    this.floor = null;
    this.ctx = null;
    this.spots = [];
    this.lit = [];
    this.hidden = [];
    this.torchAt = [];
    this.sconces = this.flames = this.halos = null;
    this.ground = this.wash = null;
  }

  /** How many wall sconces the floor has. */
  get torchCount(): number {
    return this.spots.length;
  }

  isLit(i: number): boolean {
    return this.lit[i] === true;
  }

  /**
   * Light torch `i` (a no-op when it already burns): its flame and warm halo come up, the
   * lamps may use it, and the floor's baked light is re-baked round it.
   */
  lightTorch(i: number): boolean {
    if (!this.spots[i] || this.lit[i]) return false;
    this.lit[i] = true;
    this.flamePos(this.spots[i]!, this.torchAt[i]!, true);
    this.paintTorch(i);
    if (this.halos?.instanceColor) this.halos.instanceColor.needsUpdate = true;
    this.rebake?.();
    return true;
  }

  /** Where torch `i`'s sconce is and how far a tap reaches, for the tap highlight. */
  torchSpot(i: number): { x: number; y: number; z: number; r: number } | null {
    const t = this.spots[i];
    if (!t) return null;
    return { x: t.x, y: t.ground + CFG.sconce.height, z: t.wallZ + 0.3, r: CFG.sconce.pickRadius };
  }

  /** The nearest unlit sconce a ray passes close to, or null. */
  pickTorch(ray: THREE.Ray): { index: number; d: number } | null {
    const sphere = new THREE.Sphere();
    const hit = new THREE.Vector3();
    let best: { index: number; d: number } | null = null;
    this.spots.forEach((t, i) => {
      if (this.lit[i] || this.hidden[i]) return;
      sphere.center.set(t.x, t.ground + CFG.sconce.height + 0.1, t.wallZ + 0.3);
      sphere.radius = CFG.sconce.pickRadius;
      if (!ray.intersectSphere(sphere, hit)) return;
      const d = hit.distanceTo(ray.origin);
      if (!best || d < best.d) best = { index: i, d };
    });
    return best;
  }

  /** The flame's world position for the lamps (far away when `lit` is false). */
  private flamePos(t: TorchSpot, out: THREE.Vector3, lit: boolean): THREE.Vector3 {
    if (!lit) return out.set(FAR, 1, FAR);
    return out.set(t.x, t.ground + CFG.sconce.height + 0.4, t.wallZ + 0.4);
  }

  /** The sconce bracket's matrix: shown, or squashed to nothing while the wall is cut. */
  private setSconce(i: number, show: boolean): void {
    const t = this.spots[i];
    if (!t || !this.sconces) return;
    this.pos.set(t.x, t.ground + CFG.sconce.height, t.wallZ);
    this.q.identity();
    const s = show ? 1 : 0;
    this.scl.set(s, s, s);
    this.sconces.setMatrixAt(i, this.m4.compose(this.pos, this.q, this.scl));
    this.sconces.instanceMatrix.needsUpdate = true;
  }

  /** Warm full halo for a lit torch; a small cool one for a cold sconce so it reads as tappable. */
  private paintTorch(i: number): void {
    if (!this.halos) return;
    this.col.set(this.lit[i] ? (this.ctx?.band.torch ?? '#ffa850') : '#7f9cc8');
    this.col.multiplyScalar(this.lit[i] ? CFG.sconce.haloGlow : 0.5);
    this.halos.setColorAt(i, this.col);
  }

  /** Place torch `i`'s flame and halo, facing yaw `yaw`, the flame scaled by `k` (0 when cold). */
  private setFlame(i: number, yaw: number, k: number): void {
    const t = this.spots[i];
    if (!t || !this.flames || !this.halos) return;
    const lit = this.lit[i] === true;
    const show = !this.hidden[i];
    this.q.setFromAxisAngle(this.yAxis, yaw);
    const y = t.ground + CFG.sconce.height;
    const fk = lit && show ? k : 0;
    this.pos.set(t.x, y + 0.1, t.wallZ + 0.26);
    this.scl.set(2 - fk, fk, 1);
    this.flames.setMatrixAt(i, this.m4.compose(this.pos, this.q, this.scl));
    const hs = !show ? 0 : lit ? 0.9 + (k - 1) * 1.5 : 0.3;
    this.pos.set(t.x, y + 0.3, t.wallZ + 0.35);
    this.scl.set(hs, hs, 1);
    this.halos.setMatrixAt(i, this.m4.compose(this.pos, this.q, this.scl));
  }

  update(t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    this.lamps.update(fr.on, keeper, this.torchAt, t);
    const dt = Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    const f = this.floor;
    if (!fr.on || !fr.run || !f) return;
    const calm = this.lamps.reduceMotion;
    const amp = calm ? 0 : CFG.flicker.amp;
    const w = CFG.flicker.hz;
    const flick = (ph: number) =>
      1 + amp * (0.6 * Math.sin(t * w + ph) + 0.4 * Math.sin(t * w * 2.7 + ph * 1.9 + 1.3));
    // The baked torch light flickers as one (the rock shader reads this uniform).
    if (this.ctx) this.ctx.uniforms.torchFlicker.value = flick(0);

    const cam = fr.camera;
    for (let i = 0; i < this.spots.length; i++) {
      const s = this.spots[i]!;
      const behind = !!cam && cam.z < s.wallZ - 0.2;
      if (behind !== this.hidden[i]) {
        this.hidden[i] = behind;
        this.setSconce(i, !behind);
      }
      const yaw = cam ? Math.atan2(cam.x - s.x, cam.z - (s.wallZ + 0.3)) : 0;
      this.setFlame(i, Math.max(-1.2, Math.min(1.2, yaw)), flick(i * 1.7 + 0.5));
    }
    if (this.flames && this.halos) {
      this.flames.instanceMatrix.needsUpdate = true;
      this.halos.instanceMatrix.needsUpdate = true;
    }
    this.cookie(f, keeper, dt);
  }

  /** The Keeper's lamp as a soft ground disc and a warm wash on the nearest wall. */
  private cookie(f: Floor, keeper: { x: number; z: number }, dt: number): void {
    const K = CFG.cookie;
    const g = this.ground;
    const wash = this.wash;
    if (!g || !wash) return;
    const e = elevationAt(f, keeper);
    g.visible = true;
    g.position.set(keeper.x, e + 0.05, keeper.z);
    g.scale.setScalar(K.groundRadius * 2);
    if (this.shed) {
      wash.visible = false;
      return;
    }
    // The nearest wall within reach along the four axes.
    let best = -1;
    let bestD: number = K.wallReach;
    let face = 0;
    const kx = Math.floor(keeper.x / CELL + f.cols / 2);
    const kz = Math.floor(keeper.z / CELL + f.rows / 2);
    DIRS.forEach(([dx, dz], di) => {
      for (let n = 1; n <= 3; n++) {
        if (cellAt(f, kx + dx * n, kz + dz * n) !== WALL) continue;
        const wx = dx !== 0 ? (kx + dx * n + (dx < 0 ? 1 : 0) - f.cols / 2) * CELL : 0;
        const wz = dz !== 0 ? (kz + dz * n + (dz < 0 ? 1 : 0) - f.rows / 2) * CELL : 0;
        const d = dx !== 0 ? Math.abs(wx - keeper.x) : Math.abs(wz - keeper.z);
        if (d < bestD) {
          bestD = d;
          best = di;
          face = dx !== 0 ? wx : wz;
        }
        break;
      }
    });
    if (best === this.washDir) {
      const target = best < 0 ? 0 : 1 - bestD / K.wallReach;
      this.washAlpha += (target - this.washAlpha) * Math.min(1, dt * 8);
    } else {
      // A different wall: fade the old wash out, then start on the new one.
      this.washAlpha = Math.max(0, this.washAlpha - dt * 6);
      if (this.washAlpha <= 0.01) {
        this.washAlpha = 0;
        this.washDir = best;
      }
    }
    const dir = this.washDir >= 0 ? DIRS[this.washDir]! : null;
    if (!dir || this.washAlpha < 0.01) {
      wash.visible = false;
      return;
    }
    if (best === this.washDir) this.washFace = face;
    const [dx, dz] = dir;
    const wallFace = this.washFace;
    const lateral = dx !== 0 ? keeper.z : keeper.x;
    const off = 0.2;
    wash.visible = true;
    if (dx !== 0) wash.position.set(wallFace - dx * off, e + 1.1, lateral);
    else wash.position.set(lateral, e + 1.1, wallFace - dz * off);
    wash.rotation.set(0, Math.atan2(-dx, -dz), 0);
    wash.scale.set(K.wallRadius * 2, K.wallRadius * 2, 1);
    (wash.material as THREE.MeshBasicMaterial).opacity = K.wallOpacity * this.washAlpha;
  }
}
