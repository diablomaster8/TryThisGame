import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { playChime, playKindle } from '../platform/audio';
import { cellAt, cellCentre, FLOOR, WALL, WATER, type Floor } from '../sim/dungeon';
import type { DungeonLootKind } from '../sim/types';
import type { Tex } from '../samples/aaa-kit';
import {
  CELL,
  cellHash,
  WALL_H,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';
import {
  BALL,
  BOX,
  CONE,
  CYL,
  decalAtlas,
  decalMaterial,
  fallTexture,
  glowMaterial,
  glyphAtlas,
  glyphMaterial,
  chasmTexture,
  beamGeometry,
  Kit,
  kitMaterial,
  prim,
  ROCK,
  SPHERE,
} from './hollow-dress-kit';
import { cellTop } from './hollow-dress-path';
import { buildSet, type GlowSpot, type GlyphSpot } from './hollow-dress-set';
import { paintedWater, type PaintedWater } from './water';

export { pathBaker } from './hollow-dress-path';

/**
 * The Hollow's dressing: everything decorative that is not rock, light or air, and the tap
 * targets (`picks`). Almost all of it is one merged, vertex-coloured mesh per floor (the set
 * pieces in `hollow-dress-set.ts`: the landmark, arches and rails, the stair portals, the
 * chest's nook, bridges and stepping stones, vista lips, mural stones), plus one instanced
 * mesh per repeated kind: loose rubble, rounded stalagmites and stalactites, roots and vines
 * with their glowing berries, floor decals, the mural glyphs, the soft glows (beams and
 * pools), and every piece of loot (one instanced mesh for all six kinds and the chest lid).
 * The still pools are the painted water. Everything stands on `Floor.elevation`.
 *
 * Things hanging off the rock (stalactites, roots) shrink away with the wall they hang from
 * when it sinks for the camera, by the rock's own rule. Under reduced motion nothing
 * breathes, bobs or turns; the murals still fade in smoothly as the Keeper nears.
 */

export type HollowPick = [THREE.Vector3, 'stairs' | 'chest' | 'loot', string, number];

/**
 * What the dressing needs from the light module for item 44 (contract 3, agent D). Read
 * through a cast, so this compiles before that API lands, and does nothing until it does.
 */
interface SconceApi {
  readonly torchCount: number;
  isLit(i: number): boolean;
  lightTorch(i: number): void;
}

const LOOT_KIND: Record<DungeonLootKind, number> = {
  shells: 0,
  stone: 1,
  seed: 2,
  essence: 3,
  critter: 4,
  egg: 5,
};
const LID_KIND = 6;

/** The rock's own cut rule (`hollow-rock.ts`): a wall this near the camera-to-party line sinks. */
const CUT_RADIUS = CELL * 0.95;

/** Loose stones: flat-shaded rock with plain UVs. */
function stoneMaterial(tex: Tex): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: tex.rock.map,
    color: '#9a8c94',
    roughness: 0.95,
    flatShading: true,
  });
}

/** A rounded stalagmite, base at y 0 and tip at 1, radius 1 (item 20: no sharp spikes). */
const STALAG = () =>
  prim('stalag', () => {
    const pts = [
      [1, 0],
      [0.96, 0.1],
      [0.78, 0.3],
      [0.56, 0.52],
      [0.38, 0.72],
      [0.24, 0.88],
      [0.1, 0.98],
      [0, 1],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(pts, 8);
  });

/** One root strand hanging from y 0 down about 2.2: a root, a vine round it, glowing berries. */
const STRAND = () =>
  prim('strand', () => {
    const k = new Kit();
    const D = GROVE3D.cave.dress;
    const pt = (t: number) =>
      new THREE.Vector3(
        Math.sin(t * 2.2) * 0.12,
        -t * 2.2,
        Math.sin(t * 3.1 + 1) * 0.08 + t * 0.12,
      );
    for (let i = 0; i < 7; i++)
      k.rod(pt(i / 7), pt((i + 1) / 7), 0.075 - i * 0.008, i % 2 ? '#6e4a30' : '#7a5636');
    // Two rootlets.
    k.rod(pt(0.35), pt(0.35).add(new THREE.Vector3(0.28, -0.35, 0.05)), 0.02, '#7a5636');
    k.rod(pt(0.6), pt(0.6).add(new THREE.Vector3(-0.22, -0.3, 0.1)), 0.018, '#7a5636');
    // The vine winding round it, with leaves.
    let prev: THREE.Vector3 | null = null;
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const c = pt(t * 0.92);
      const a = t * 9;
      const p = new THREE.Vector3(c.x + Math.cos(a) * 0.09, c.y, c.z + Math.sin(a) * 0.09);
      if (prev) k.rod(prev, p, 0.016, '#4f8a42');
      if (i % 3 === 1)
        k.part(
          SPHERE(),
          p.x + Math.cos(a) * 0.06,
          p.y,
          p.z + Math.sin(a) * 0.06,
          0.12,
          0.03,
          0.07,
          '#6aa84f',
          0.05,
          a,
        );
      prev = p;
    }
    for (let b = 0; b < D.berriesPerRoot; b++) {
      const c = pt(0.35 + (b / Math.max(1, D.berriesPerRoot - 1)) * 0.55);
      for (let j = 0; j < 3; j++)
        k.part(
          BALL(),
          c.x + Math.cos(j * 2.1 + b) * 0.07,
          c.y - j * 0.04,
          c.z + Math.sin(j * 2.1 + b) * 0.07,
          0.12,
          0.12,
          0.12,
          D.berry,
          1.6,
        );
    }
    return k.build()!;
  });

/** Every loot model and the chest lid in one geometry, each part stamped with its kind. */
const LOOT = () =>
  prim('loot', () => {
    const k = new Kit();
    k.kind = LOOT_KIND.shells;
    for (const [x, z] of [
      [-0.1, 0.05],
      [0.08, 0.09],
      [-0.02, -0.08],
      [0.12, -0.06],
    ] as const)
      k.part(SPHERE(), x, -0.12, z, 0.18, 0.08, 0.14, '#f2d34c', 0.7);
    k.kind = LOOT_KIND.stone;
    k.part(ROCK(), 0, 0, 0, 0.32, 0.22, 0.27, '#9a9aac', 0.35);
    k.kind = LOOT_KIND.seed;
    k.part(SPHERE(), 0, 0, 0, 0.19, 0.24, 0.19, '#8a5a32', 0.4);
    k.part(CYL(0.5, 5), 0.03, 0.17, 0, 0.03, 0.14, 0.03, '#4a9c42');
    k.part(SPHERE(), 0.07, 0.24, 0, 0.14, 0.05, 0.08, '#8fd262', 0.2);
    k.kind = LOOT_KIND.essence;
    k.part(CONE(6), 0, 0.02, 0, 0.22, 0.34, 0.22, '#b58cff', 0.9);
    k.part(CYL(0.5, 12), 0, -0.16, 0, 0.26, 0.03, 0.26, '#7a5ad0', 0.2);
    k.kind = LOOT_KIND.critter;
    k.part(SPHERE(), 0, 0, 0, 0.16, 0.16, 0.16, '#3a3346');
    for (const x of [-0.03, 0.03])
      k.part(SPHERE(), x, 0.02, 0.07, 0.036, 0.036, 0.036, '#ffffff', 0.4);
    k.kind = LOOT_KIND.egg;
    k.part(SPHERE(), 0, 0, 0, 0.34, 0.44, 0.34, '#f3efe2', 0.45);
    for (let i = 0; i < 6; i++) {
      const a = i * 2.4;
      const y = -0.1 + (i % 3) * 0.09;
      const r = Math.sqrt(Math.max(0, 1 - (y / 0.22) ** 2)) * 0.165;
      k.part(SPHERE(), Math.cos(a) * r, y, Math.sin(a) * r, 0.05, 0.05, 0.05, '#c9a0ff', 0.3);
    }
    // The chest lid, its hinge at the origin, opening toward +z.
    k.kind = LID_KIND;
    k.part(BOX(), 0, 0.07, 0.235, 0.72, 0.14, 0.47, '#a06a32', 0.15);
    k.part(BOX(), 0, 0.075, 0.235, 0.1, 0.15, 0.48, '#e0c060', 0.6);
    return k.build()!;
  });

const PLANE = () => prim('plane', () => new THREE.PlaneGeometry(1, 1));
const FLAT = () => prim('flat', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2));

/** An instanced list whose instances can shrink away (into the rock they hang from). */
interface Shrinkable {
  mesh: THREE.InstancedMesh;
  pos: THREE.Vector3[];
  quat: THREE.Quaternion[];
  scale: THREE.Vector3[];
  /** The wall cell each hangs from (null: never hides); its share of full size now. */
  wall: Array<{ x: number; z: number } | null>;
  now: number[];
  /** Whether each one's wall is sunk now. */
  cut: boolean[];
}

export class HollowDress implements HollowModule {
  readonly stone: THREE.MeshStandardMaterial;
  readonly water: PaintedWater;
  readonly picks: HollowPick[] = [];
  /** The kit materials: merged set pieces, instanced pieces, and the loot's kind selector. */
  private readonly kit = kitMaterial();
  private readonly kitInst = kitMaterial();
  private readonly lootMat = kitMaterial(true);
  private readonly bubbleMat = new THREE.MeshStandardMaterial({
    color: '#9ad0ff',
    emissive: '#9ad0ff',
    emissiveIntensity: 0.5,
    roughness: 0.1,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  private readonly decalMat: THREE.MeshStandardMaterial;
  private readonly glyphMat: THREE.MeshBasicMaterial;
  private readonly glowMat = glowMaterial();
  private readonly chasmMat: THREE.MeshBasicMaterial;
  private readonly fallMat: THREE.MeshBasicMaterial;
  /** What `dispose` takes out; `own` geometries are freed, shared ones kept. */
  private readonly objs: THREE.Object3D[] = [];
  private readonly own: THREE.BufferGeometry[] = [];
  private group: THREE.Group | null = null;
  private sky: HollowCtx['sky'] | null = null;
  /** The shared context (reduced motion and the band are read from it each frame). */
  private ctx: HollowCtx | null = null;
  private lastT = 0;
  // Per-floor state the frame reads.
  private loot: THREE.InstancedMesh | null = null;
  private lootAt: Array<{
    id: string;
    p: THREE.Vector3;
    y0: number;
    seed: number;
    bubble: number;
  }> = [];
  private bubbles: THREE.InstancedMesh | null = null;
  private lid: { x: number; y: number; z: number; ry: number } | null = null;
  private lidOpen: boolean | null = null;
  private glows: THREE.InstancedMesh | null = null;
  private glowSpots: GlowSpot[] = [];
  private crystalFlash: Array<{ x: number; z: number; slot: number; near: boolean; at: number }> =
    [];
  private glyphs: THREE.InstancedMesh | null = null;
  private glyphSpots: GlyphSpot[] = [];
  private glyphK: number[] = [];
  private shrink: Shrinkable[] = [];
  private cutKey = '';
  private sconces: unknown = null;
  private sconceAt: THREE.Vector3[] = [];
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly v = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly c = new THREE.Color();

  constructor(tex: Tex) {
    this.stone = stoneMaterial(tex);
    this.water = paintedWater(0, 0.55);
    this.decalMat = decalMaterial(decalAtlas());
    this.glyphMat = glyphMaterial(glyphAtlas());
    this.chasmMat = new THREE.MeshBasicMaterial({ map: chasmTexture(), side: THREE.DoubleSide });
    this.fallMat = new THREE.MeshBasicMaterial({
      map: fallTexture(),
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  /** The light module, for item 44's sconces (see `SconceApi`). */
  useLights(light: unknown): void {
    this.sconces = light;
  }

  private get api(): SconceApi | null {
    const a = this.sconces as Partial<SconceApi> | null;
    return a && typeof a.lightTorch === 'function' && typeof a.isLit === 'function'
      ? (a as SconceApi)
      : null;
  }

  /**
   * One hidden object per program the dressing draws with, for the scene to link before the
   * first floor (as `Hollow.samples` does for the rock).
   */
  samples(): THREE.Object3D[] {
    const k = new Kit();
    k.part(BOX(), 0, 0, 0, 0.1, 0.1, 0.1, '#ffffff');
    const g = k.build()!;
    const one = (geo: THREE.BufferGeometry, m: THREE.Material, colour: boolean) => {
      const im = new THREE.InstancedMesh(geo, m, 1);
      if (colour) im.setColorAt(0, new THREE.Color('#ffffff'));
      return im;
    };
    const loot = one(g.clone(), this.lootMat, false);
    loot.geometry.setAttribute('iKind', new THREE.InstancedBufferAttribute(new Float32Array(1), 1));
    const decal = one(FLAT().clone(), this.decalMat, false);
    decal.geometry.setAttribute(
      'iTile',
      new THREE.InstancedBufferAttribute(new Float32Array(1), 1),
    );
    const glyph = one(PLANE().clone(), this.glyphMat, true);
    glyph.geometry.setAttribute(
      'iTile',
      new THREE.InstancedBufferAttribute(new Float32Array(1), 1),
    );
    return [
      new THREE.Mesh(g, this.kit),
      one(g, this.kitInst, true),
      one(STALAG(), this.stone, false),
      loot,
      one(SPHERE(), this.bubbleMat, false),
      decal,
      glyph,
      one(beamGeometry(), this.glowMat, true),
      new THREE.Mesh(FLAT(), this.chasmMat),
      new THREE.Mesh(FLAT(), this.fallMat),
    ];
  }

  private put(o: THREE.Object3D, ownGeo = true): void {
    this.group?.add(o);
    this.objs.push(o);
    if (ownGeo && (o as THREE.Mesh).geometry) this.own.push((o as THREE.Mesh).geometry);
  }

  build(f: Floor, ctx: HollowCtx): void {
    this.group = ctx.group;
    this.sky = ctx.sky;
    this.ctx = ctx;
    const busy = new Set(
      [f.stairsUp, f.stairsDown, f.chest, ...f.torches, ...f.crystals, ...f.loot.map((l) => l.cell)]
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => `${c.x},${c.y}`),
    );
    const kit = new Kit();
    const set = buildSet(f, kit, ctx.band, busy);
    this.lid = set.lid;
    this.scatter(f, busy);
    const geo = kit.build();
    if (geo) {
      const m = new THREE.Mesh(geo, this.kit);
      m.castShadow = true;
      m.receiveShadow = true;
      m.name = 'hollow-set';
      this.put(m);
    }
    this.buildGlows(f, set.glows);
    this.buildGlyphs(set.glyphs);
    if (set.chasm) this.put(new THREE.Mesh(set.chasm, this.chasmMat));
    if (set.fall) {
      const fall = new THREE.Mesh(set.fall, this.fallMat);
      fall.renderOrder = 1;
      this.put(fall);
    }
    const pool = poolGeometry(f);
    if (pool) this.put(new THREE.Mesh(pool, this.water.material));
    this.buildLoot(f);
    this.buildPicks(f);
  }

  /** Rubble, stalagmites and stalactites along the rock, roots and vines, floor decals. */
  private scatter(f: Floor, busy: Set<string>): void {
    const D = GROVE3D.cave.dress;
    const { rubbleShare, spikeShare } = GROVE3D.cave;
    const stones: THREE.Matrix4[] = [];
    const stalag: Array<
      [THREE.Vector3, THREE.Quaternion, THREE.Vector3, { x: number; z: number } | null]
    > = [];
    const roots: Array<[THREE.Vector3, THREE.Quaternion, THREE.Vector3, { x: number; z: number }]> =
      [];
    const decals: Array<[THREE.Matrix4, number]> = [];
    const e = this.e;
    const flip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        const c = cellAt(f, x, y);
        if (c === WALL || c === WATER || busy.has(`${x},${y}`)) continue;
        const at = cellCentre(f, { x, y });
        const y0 = cellTop(f, { x, y });
        let nearRock = false;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          if (cellAt(f, x + dx, y + dy) !== WALL) continue;
          nearRock = true;
          const wall = cellCentre(f, { x: x + dx, y: y + dy });
          const h1 = cellHash(x * 2 + dx, y * 2 + dy, 1);
          const along = (cellHash(x, y, 2 + dx + dy * 3) - 0.5) * CELL * 0.7;
          const px = at.x + dx * CELL * 0.38 + dy * along;
          const pz = at.z + dy * CELL * 0.38 + dx * along;
          if (h1 < rubbleShare) {
            const n = 1 + Math.floor(cellHash(x, y, 7 + dx) * 3);
            for (let i = 0; i < n; i++) {
              const r = 0.07 + cellHash(x + i, y, 9) * 0.12;
              const ox = (cellHash(x, y + i, 11) - 0.5) * 0.5;
              const oz = (cellHash(x + i, y + i, 13) - 0.5) * 0.5;
              e.set(cellHash(i, x, 3) * 3, cellHash(y, i, 5) * 6, 0);
              stones.push(
                new THREE.Matrix4().compose(
                  new THREE.Vector3(px + ox * 0.6, y0 + r * 0.45, pz + oz * 0.6),
                  new THREE.Quaternion().setFromEuler(e),
                  new THREE.Vector3(r, r * 0.7, r),
                ),
              );
            }
          } else if (h1 < rubbleShare + spikeShare) {
            // A rounded stalagmite with a smaller one or two beside it.
            const n = 1 + Math.floor(cellHash(x, y, 29) * 2.4);
            for (let i = 0; i < n; i++) {
              const tall = (0.5 + cellHash(x, y, 17 + i) * 0.7) * (i ? 0.55 : 1);
              const r = (0.16 + cellHash(y, x, 19 + i) * 0.1) * (i ? 0.7 : 1);
              const a = cellHash(x, y, 31 + i) * Math.PI * 2;
              stalag.push([
                new THREE.Vector3(
                  px + (i ? Math.cos(a) * 0.28 : 0),
                  y0 - 0.02,
                  pz + (i ? Math.sin(a) * 0.28 : 0),
                ),
                new THREE.Quaternion().setFromEuler(
                  e.set((cellHash(x, y, 23 + i) - 0.5) * 0.25, a, 0),
                ),
                new THREE.Vector3(r, tall, r),
                null,
              ]);
            }
          } else if (h1 < rubbleShare + spikeShare + D.stalactiteShare) {
            // A stalactite hanging from the wall's lip, a hand out from its face.
            const tall = 0.35 + cellHash(x, y, 37) * 0.5;
            const r = 0.12 + cellHash(y, x, 39) * 0.08;
            stalag.push([
              new THREE.Vector3(
                wall.x - dx * (CELL * 0.5 - 0.1),
                WALL_H * 0.86,
                wall.z - dy * (CELL * 0.5 - 0.1),
              ),
              flip.clone(),
              new THREE.Vector3(r, tall, r),
              wall,
            ]);
          }
          if (cellHash(x, y, 43 + dx * 2 + dy) < D.rootShare) {
            const s = 1.15 + cellHash(x, y, 47) * 0.6;
            roots.push([
              new THREE.Vector3(
                wall.x - dx * (CELL * 0.5 - 0.05),
                WALL_H * 0.98,
                wall.z - dy * (CELL * 0.5 - 0.05),
              ),
              new THREE.Quaternion().setFromEuler(e.set(0, Math.atan2(-dx, -dy), 0)),
              new THREE.Vector3(s, s, s),
              wall,
            ]);
          }
        }
        // Decals on level open ground.
        if (c !== FLOOR) continue;
        const level = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ].every(([dx, dy]) => {
          const n = cellAt(f, x + dx!, y + dy!);
          return n === WALL || Math.abs(cellTop(f, { x: x + dx!, y: y + dy! }) - y0) < 0.01;
        });
        if (!level || cellHash(x, y, 51) >= D.decalShare) continue;
        const wet = [-2, -1, 0, 1, 2].some((dy) =>
          [-2, -1, 0, 1, 2].some((dx) => cellAt(f, x + dx, y + dy) === WATER),
        );
        const r = cellHash(x, y, 53);
        const tile =
          wet && r < 0.5 ? 1 : nearRock && r < 0.4 ? 3 : Math.floor(cellHash(x, y, 55) * 4) % 4;
        const size = D.decalSize[0] + cellHash(x, y, 57) * (D.decalSize[1] - D.decalSize[0]);
        decals.push([
          new THREE.Matrix4().compose(
            new THREE.Vector3(
              at.x + (cellHash(x, y, 58) - 0.5) * 0.5,
              y0 + 0.015,
              at.z + (cellHash(x, y, 59) - 0.5) * 0.5,
            ),
            new THREE.Quaternion().setFromEuler(e.set(0, cellHash(x, y, 60) * Math.PI * 2, 0)),
            new THREE.Vector3(size, 1, size),
          ),
          tile,
        ]);
      }
    if (stones.length) {
      const im = new THREE.InstancedMesh(ROCK(), this.stone, stones.length);
      stones.forEach((m, i) => im.setMatrixAt(i, m));
      im.receiveShadow = true;
      this.put(im, false);
    }
    if (stalag.length) {
      const im = new THREE.InstancedMesh(STALAG(), this.stone, stalag.length);
      im.castShadow = true;
      im.receiveShadow = true;
      this.put(im, false);
      this.shrinkable(im, stalag);
    }
    if (roots.length) {
      const im = new THREE.InstancedMesh(STRAND(), this.kitInst, roots.length);
      roots.forEach((_, i) => {
        const t = 0.9 + cellHash(i, 3, 5) * 0.2;
        im.setColorAt(i, this.c.setRGB(t, t * 0.97, t * 0.94));
      });
      im.frustumCulled = false;
      this.put(im, false);
      this.shrinkable(im, roots);
    }
    if (decals.length) {
      const geo = FLAT().clone();
      geo.setAttribute(
        'iTile',
        new THREE.InstancedBufferAttribute(new Float32Array(decals.map(([, t]) => t)), 1),
      );
      const im = new THREE.InstancedMesh(geo, this.decalMat, decals.length);
      decals.forEach(([m], i) => im.setMatrixAt(i, m));
      im.receiveShadow = true;
      im.renderOrder = 1;
      this.put(im);
    }
  }

  private shrinkable(
    mesh: THREE.InstancedMesh,
    list: Array<[THREE.Vector3, THREE.Quaternion, THREE.Vector3, { x: number; z: number } | null]>,
  ): void {
    const sh: Shrinkable = { mesh, pos: [], quat: [], scale: [], wall: [], now: [], cut: [] };
    list.forEach(([p, q, s, w], i) => {
      mesh.setMatrixAt(i, this.m4.compose(p, q, s));
      sh.pos.push(p);
      sh.quat.push(q);
      sh.scale.push(s);
      sh.wall.push(w);
      sh.now.push(1);
      sh.cut.push(false);
    });
    this.shrink.push(sh);
  }

  /** The soft glows (portal beams, lantern and landmark pools) and the crystal flashes. */
  private buildGlows(f: Floor, spots: GlowSpot[]): void {
    this.crystalFlash = f.crystals.map((c, i) => {
      const p = cellCentre(f, c);
      return { x: p.x, z: p.z, slot: spots.length + i, near: false, at: -99 };
    });
    const n = spots.length + this.crystalFlash.length;
    if (!n) return;
    const im = new THREE.InstancedMesh(beamGeometry(), this.glowMat, n);
    spots.forEach((s, i) => {
      im.setMatrixAt(
        i,
        this.m4.compose(
          this.v.set(s.x, s.y, s.z),
          this.q.identity(),
          this.s.set(s.r * 2, s.h, s.r * 2),
        ),
      );
      im.setColorAt(i, s.color);
    });
    this.crystalFlash.forEach((c, i) => {
      const y = cellTop(f, f.crystals[i]!);
      im.setMatrixAt(
        c.slot,
        this.m4.compose(this.v.set(c.x, y, c.z), this.q.identity(), this.s.set(2.4, 1.2, 2.4)),
      );
      im.setColorAt(c.slot, this.c.setRGB(0, 0, 0));
    });
    im.frustumCulled = false;
    im.renderOrder = 3;
    this.glows = im;
    this.glowSpots = spots;
    this.put(im, false);
  }

  private buildGlyphs(spots: GlyphSpot[]): void {
    if (!spots.length) return;
    const geo = PLANE().clone();
    geo.setAttribute(
      'iTile',
      new THREE.InstancedBufferAttribute(new Float32Array(spots.map((s) => s.tile)), 1),
    );
    const im = new THREE.InstancedMesh(geo, this.glyphMat, spots.length);
    const dim = new THREE.Color(GROVE3D.cave.dress.mural.dim);
    spots.forEach((s, i) => {
      this.q.setFromEuler(this.e.set(0, s.ry, 0));
      im.setMatrixAt(
        i,
        this.m4.compose(this.v.set(s.x, s.y, s.z), this.q, this.s.set(s.size, s.size, 1)),
      );
      im.setColorAt(i, dim);
    });
    im.renderOrder = 2;
    this.glyphs = im;
    this.glyphSpots = spots;
    this.glyphK = spots.map(() => 0);
    this.put(im);
  }

  /** Every find on the floor, and the chest lid, in one instanced mesh; bubbles for critters. */
  private buildLoot(f: Floor): void {
    const n = f.loot.length + (this.lid ? 1 : 0);
    if (!n) return;
    const geo = LOOT().clone();
    const kinds = new Float32Array(n);
    f.loot.forEach((l, i) => (kinds[i] = LOOT_KIND[l.kind]));
    if (this.lid) kinds[n - 1] = LID_KIND;
    geo.setAttribute('iKind', new THREE.InstancedBufferAttribute(kinds, 1));
    const im = new THREE.InstancedMesh(geo, this.lootMat, n);
    im.frustumCulled = false;
    let bubble = 0;
    this.lootAt = f.loot.map((l) => {
      const p = cellCentre(f, l.cell);
      const crit = l.kind === 'critter';
      return {
        id: l.id,
        p: new THREE.Vector3(p.x, cellTop(f, l.cell) + 0.25, p.z),
        y0: cellTop(f, l.cell) + 0.25,
        seed: p.x,
        bubble: crit ? bubble++ : -1,
      };
    });
    this.loot = im;
    this.put(im);
    if (bubble) {
      const b = new THREE.InstancedMesh(SPHERE(), this.bubbleMat, bubble);
      b.frustumCulled = false;
      b.renderOrder = 2;
      this.bubbles = b;
      this.put(b, false);
    }
    this.lidOpen = null;
    this.placeLoot(0, [], false, true);
  }

  private buildPicks(f: Floor): void {
    const up = cellCentre(f, f.stairsUp);
    this.picks.push([
      new THREE.Vector3(up.x, cellTop(f, f.stairsUp) + 0.4, up.z),
      'stairs',
      'up',
      0.9,
    ]);
    if (f.stairsDown) {
      const dn = cellCentre(f, f.stairsDown);
      this.picks.push([
        new THREE.Vector3(dn.x, cellTop(f, f.stairsDown) + 0.2, dn.z),
        'stairs',
        'down',
        0.9,
      ]);
    }
    const ch = cellCentre(f, f.chest);
    this.picks.push([
      new THREE.Vector3(ch.x, cellTop(f, f.chest) + 0.3, ch.z),
      'chest',
      'chest',
      0.6,
    ]);
    for (const l of this.lootAt) this.picks.push([l.p, 'loot', l.id, 0.45]);
    // Item 44: unlit sconces and the crystals are walk-to targets (a tap walks the Keeper
    // over; being there lights the sconce or rings the crystal). Their ids never match loot.
    this.sconceAt = f.torches.map((t) => {
      const p = cellCentre(f, t);
      return new THREE.Vector3(p.x, cellTop(f, t) + 1.1, p.z);
    });
    const api = this.api;
    if (api)
      for (let i = 0; i < Math.min(api.torchCount, this.sconceAt.length); i++)
        if (!api.isLit(i)) this.picks.push([this.sconceAt[i]!, 'loot', `sconce:${i}`, 0.55]);
    f.crystals.forEach((c, i) => {
      const p = cellCentre(f, c);
      this.picks.push([
        new THREE.Vector3(p.x, cellTop(f, c) + 0.4, p.z),
        'loot',
        `crystal:${i}`,
        0.5,
      ]);
    });
  }

  dispose(): void {
    for (const o of this.objs) {
      o.removeFromParent();
      if (o instanceof THREE.InstancedMesh) o.dispose();
    }
    for (const g of this.own) g.dispose();
    this.objs.length = 0;
    this.own.length = 0;
    this.picks.length = 0;
    this.loot = this.bubbles = this.glows = this.glyphs = null;
    this.lootAt = [];
    this.lid = null;
    this.glowSpots = [];
    this.glyphSpots = [];
    this.glyphK = [];
    this.crystalFlash = [];
    this.shrink = [];
    this.cutKey = '';
    this.sconceAt = [];
  }

  update(t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    const run = fr.run;
    if (!fr.on || !run) return;
    const dt = Math.min(0.1, Math.max(0, t - this.lastT));
    this.lastT = t;
    const still = this.ctx?.reduceMotion ?? false;
    this.placeLoot(t, run.taken, run.chestOpen, still);
    this.breathe(t, still);
    this.fadeGlyphs(keeper, dt);
    this.touch(t, keeper, fr.party);
    if (fr.camera) this.cutaway(fr.camera, [keeper, ...fr.party], dt);
    if (this.fallMat.map && !still) this.fallMat.map.offset.y = (t * 0.9) % 1;
    if (this.sky) this.water.update(t, this.sky.sun, this.sky.hemi);
  }

  private placeLoot(t: number, taken: readonly string[], open: boolean, still: boolean): void {
    const im = this.loot;
    if (!im) return;
    const L = GROVE3D.cave.dress.loot;
    this.lootAt.forEach((l, i) => {
      const gone = taken.includes(l.id);
      const bob = still ? 0 : Math.sin(t * 2 + l.seed) * L.bob;
      // The pick follows the bob (the tap sphere is this same vector).
      l.p.y = l.y0 + bob;
      const y = l.p.y;
      this.q.setFromEuler(this.e.set(0, still ? 0 : t * L.spin, 0));
      im.setMatrixAt(
        i,
        this.m4.compose(this.v.set(l.p.x, y, l.p.z), this.q, this.s.setScalar(gone ? 0 : 1)),
      );
      if (this.bubbles && l.bubble >= 0)
        this.bubbles.setMatrixAt(
          l.bubble,
          this.m4.compose(this.v, this.q.identity(), this.s.setScalar(gone ? 0 : 0.4)),
        );
    });
    im.instanceMatrix.needsUpdate = true;
    if (this.bubbles) this.bubbles.instanceMatrix.needsUpdate = true;
    if (this.lid && open !== this.lidOpen) {
      this.lidOpen = open;
      this.q.setFromEuler(this.e.set(open ? -1.9 : 0, this.lid.ry, 0, 'YXZ'));
      im.setMatrixAt(
        this.lootAt.length,
        this.m4.compose(
          this.v.set(this.lid.x, this.lid.y, this.lid.z),
          this.q,
          this.s.setScalar(1),
        ),
      );
    }
  }

  /** The portal beams swell gently, and the crystal flashes fade (both read the clock). */
  private breathe(t: number, still: boolean): void {
    const im = this.glows;
    if (!im) return;
    const P = GROVE3D.cave.dress.portal;
    const T = GROVE3D.cave.dress.touch;
    let dirty = false;
    if (!still)
      this.glowSpots.forEach((s, i) => {
        if (!s.breathe) return;
        const k = 1 + Math.sin(t * Math.PI * 2 * P.breathePerSec + i) * P.breathe;
        im.setColorAt(i, this.c.copy(s.color).multiplyScalar(k));
        dirty = true;
      });
    const flash = new THREE.Color(this.ctx?.band.crystal ?? '#9ae8ff');
    for (const c of this.crystalFlash) {
      const k = Math.max(0, 1 - (t - c.at) / T.flashSec);
      if (k <= 0 && c.at < -1) continue;
      im.setColorAt(c.slot, this.c.copy(flash).multiplyScalar(k * 0.8));
      if (k <= 0) c.at = -99;
      dirty = true;
    }
    if (dirty && im.instanceColor) im.instanceColor.needsUpdate = true;
  }

  /** Murals wake as the Keeper comes near and sleep again behind them, always smoothly. */
  private fadeGlyphs(keeper: { x: number; z: number }, dt: number): void {
    const im = this.glyphs;
    if (!im) return;
    const M = GROVE3D.cave.dress.mural;
    const dim = this.c.set(M.dim);
    const lit = new THREE.Color(M.lit).multiplyScalar(M.litGain);
    const dimC = dim.clone();
    let dirty = false;
    this.glyphSpots.forEach((s, i) => {
      const want = Math.hypot(s.x - keeper.x, s.z - keeper.z) < M.reach ? 1 : 0;
      const now = this.glyphK[i]!;
      if (now === want) return;
      const step = M.fadePerSec * dt;
      const next = Math.abs(want - now) <= step ? want : now + Math.sign(want - now) * step;
      this.glyphK[i] = next;
      // Smoothstep, so it eases in and out rather than ramping.
      const k = next * next * (3 - 2 * next);
      im.setColorAt(i, this.c.copy(dimC).lerp(lit, k));
      dirty = true;
    });
    if (dirty && im.instanceColor) im.instanceColor.needsUpdate = true;
  }

  /** Item 44: the Keeper lights an unlit sconce it reaches; a crystal chimes when brushed. */
  private touch(
    t: number,
    keeper: { x: number; z: number },
    party: ReadonlyArray<{ x: number; z: number }>,
  ): void {
    const T = GROVE3D.cave.dress.touch;
    const api = this.api;
    if (api)
      for (let i = 0; i < Math.min(api.torchCount, this.sconceAt.length); i++) {
        const s = this.sconceAt[i]!;
        if (Math.hypot(s.x - keeper.x, s.z - keeper.z) > T.sconceReach || api.isLit(i)) continue;
        api.lightTorch(i);
        playKindle();
        const at = this.picks.findIndex((p) => p[2] === `sconce:${i}`);
        if (at >= 0) this.picks.splice(at, 1);
      }
    const who = [keeper, ...party];
    for (const c of this.crystalFlash) {
      const near = who.some((p) => Math.hypot(p.x - c.x, p.z - c.z) < T.crystalReach);
      if (near && !c.near && t - c.at > T.chimeCooldown) {
        c.at = t;
        playChime(cellHash(c.x, c.z, 71));
      }
      c.near = near;
    }
  }

  /**
   * What hangs off a sunk wall shrinks away into it, and grows back as the wall rises: the
   * same set the rock sinks (`hollow-rock.ts`), at the same rate.
   */
  private cutaway(
    camera: THREE.Vector3,
    party: ReadonlyArray<{ x: number; z: number }>,
    dt: number,
  ): void {
    if (!this.shrink.length) return;
    const key = `${Math.round(camera.x * 2)},${Math.round(camera.z * 2)}|${party
      .map((p) => `${Math.round(p.x / (CELL / 2))},${Math.round(p.z / (CELL / 2))}`)
      .join(';')}`;
    const recut = key !== this.cutKey;
    this.cutKey = key;
    const step = GROVE3D.cave.cutPerSec * dt;
    for (const sh of this.shrink) {
      let moved = false;
      sh.wall.forEach((w, i) => {
        if (!w) return;
        if (recut) sh.cut[i] = inTheWay(w, camera, party);
        const want = sh.cut[i] ? 0 : 1;
        const now = sh.now[i]!;
        if (now === want) return;
        const next = Math.abs(want - now) <= step ? want : now + Math.sign(want - now) * step;
        sh.now[i] = next;
        sh.mesh.setMatrixAt(
          i,
          this.m4.compose(sh.pos[i]!, sh.quat[i]!, this.s.copy(sh.scale[i]!).multiplyScalar(next)),
        );
        moved = true;
      });
      if (moved) sh.mesh.instanceMatrix.needsUpdate = true;
    }
  }
}

/** The rock's rule: is this wall between the camera and someone in the party? */
function inTheWay(
  w: { x: number; z: number },
  camera: THREE.Vector3,
  party: ReadonlyArray<{ x: number; z: number }>,
): boolean {
  return party.some((p) => {
    const dx = camera.x - p.x;
    const dz = camera.z - p.z;
    const len2 = dx * dx + dz * dz || 1;
    const t = ((w.x - p.x) * dx + (w.z - p.z) * dz) / len2;
    if (t <= 0) return false;
    const k = Math.min(1, t);
    return Math.hypot(w.x - (p.x + dx * k), w.z - (p.z + dz * k)) < CUT_RADIUS;
  });
}

/**
 * The still pools, one mesh over every wet cell at its own surface height (water sits below
 * the ground around it), carrying the painted water's `depth`: zero at a corner that
 * touches dry ground, so foam rings the shore.
 */
function poolGeometry(f: Floor): THREE.BufferGeometry | null {
  const wet = (x: number, y: number) => cellAt(f, x, y) === WATER;
  const top = (x: number, y: number) => f.elevation[y * f.cols + x] ?? 0;
  const corners = new Map<number, number>();
  const pos: number[] = [];
  const depth: number[] = [];
  const index: number[] = [];
  const corner = (ix: number, iz: number): number => {
    const key = iz * (f.cols + 1) + ix;
    const had = corners.get(key);
    if (had !== undefined) return had;
    const i = pos.length / 3;
    corners.set(key, i);
    let sum = 0;
    let n = 0;
    for (const [x, y] of [
      [ix - 1, iz - 1],
      [ix, iz - 1],
      [ix - 1, iz],
      [ix, iz],
    ] as const)
      if (wet(x, y)) {
        sum += top(x, y);
        n++;
      }
    pos.push((ix - f.cols / 2) * CELL, (n ? sum / n : 0) + 0.02, (iz - f.rows / 2) * CELL);
    depth.push(n === 4 ? 0.8 : 0);
    return i;
  };
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) {
      if (!wet(x, y)) continue;
      const a = corner(x, y);
      const b = corner(x + 1, y);
      const c = corner(x, y + 1);
      const d = corner(x + 1, y + 1);
      // A centre vertex with water under it, so a pool one cell wide still has open water
      // in the middle and foam only at its banks.
      const m = pos.length / 3;
      pos.push((x + 0.5 - f.cols / 2) * CELL, top(x, y) + 0.02, (y + 0.5 - f.rows / 2) * CELL);
      depth.push(0.8);
      index.push(a, c, m, c, d, m, d, b, m, b, a, m);
    }
  if (!index.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('depth', new THREE.Float32BufferAttribute(depth, 1));
  g.setIndex(index);
  return g;
}
