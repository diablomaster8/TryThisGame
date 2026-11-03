import * as THREE from 'three';
import type { RegionId } from '../config/regions';
import type { LayoutChunk, RegionLayout } from '../config/region-layout';
import { REGION_BORDER, REGION_CACHE } from '../config/tuning-r11d1';
import { WORLD_STREAM } from '../config/tuning-world';
import { ActiveChunks, ChunkLRU, chunkKey, type ChunkCoord } from '../render/chunks';
import {
  drawnRegion,
  EDGE_SPECS,
  layoutOf,
  REGION_SPECS,
  seamlessOffset,
  walkExitsHere,
} from '../sim/region-walk';
import type { Vec2, World } from '../sim/types';

/**
 * R11 lane D: the Full 3D region engine (WORLD-09, 15, 25, 39, 56, 68), the twin of the pixel
 * host (`render/region-host-px.ts`). A drawn region is a lazy module (`REGION_3D`) that builds
 * a group of a few instanced batches; the host feeds it the chunks to draw and decides what is
 * live:
 * - the region the Keeper is in: its batches hold only the chunks within `WORLD_STREAM.rings`
 *   of the Keeper (refilled when a chunk edge is crossed, one ring of hysteresis), each chunk's
 *   instance data kept in a byte-capped LRU;
 * - a loaded neighbour: within `prewarmReach` of the way in its module loads, it is built hidden
 *   and its programs link for the light set it will be drawn in (WORLD-68), so the border never
 *   links a shader; within `prebuildReach` it is ready for the iris to swap in;
 * - a seamless neighbour: its edge chunks drawn across the border at the exit's offset;
 * - anything else is disposed whole on the way out (WORLD-15).
 * The draw calls stay flat whatever the region's size: one per batch, never one per chunk.
 */

export interface Region3d {
  readonly group: THREE.Group;
  /**
   * Refill the batches from these chunks (region-local; the group carries any offset). `clip`
   * leaves out what stands past the region's own edge (its forest margin): across a seamless
   * border that ground belongs to the near region.
   */
  setChunks(chunks: readonly LayoutChunk[], cache: ChunkLRU<Float32Array[]>, clip: boolean): void;
  /** Per-frame motion (the dapple's drift), from the scene's clock in seconds. */
  tick(t: number, still: boolean, cam: THREE.Vector3, keeper: Vec2): void;
  /** R11 d7: read the world for what changes with it (a door that thaws, lanterns lit). */
  sync?(world: World): void;
  dispose(): void;
}

export interface Region3dModule {
  createRegion3d(l: RegionLayout): Region3d;
  /** The arch over a loaded way in, in whichever region it stands (shared, never disposed). */
  entrance(): THREE.Object3D;
}

/** Each drawn region's 3D module, loaded on first approach (a new region adds a line). */
export const REGION_3D: Partial<Record<RegionId, () => Promise<Region3dModule>>> = {
  wood: () => import('./region-wood'),
  shore: () => import('./region-shore'),
  sunlands: () => import('./region-sunmoon').then((m) => m.sun),
  moonlands: () => import('./region-sunmoon').then((m) => m.moon),
  // R11 d7: the Grove's stand-in strip, drawn only across a seamless border from a neighbour.
  grove: () => import('./region-grove-edge'),
};

interface Live {
  id: RegionId;
  r: Region3d;
  layout: RegionLayout;
  chunks: ActiveChunks;
  cache: ChunkLRU<Float32Array[]>;
  key: string;
  /** Its programs are linked (or the link was tried). */
  warm: 'no' | 'going' | 'yes';
}

export class RegionHost3d {
  readonly group = new THREE.Group();
  private readonly mods = new Map<RegionId, Region3dModule>();
  private readonly loading = new Set<RegionId>();
  private readonly live = new Map<RegionId, Live>();
  private readonly arches = new Map<string, THREE.Object3D>();
  /** Chunks drawn by the live region, of those it has (the debug readout). */
  drawnChunks = 0;
  /** Disposals so far (the memory tour reads it). */
  released = 0;

  /**
   * `compile` links an object's programs for the light set a drawn region is shown in
   * (the scene's `compileAs('plain')`); it is handed the hidden group, shown for the call.
   */
  constructor(
    parent: THREE.Object3D,
    private readonly compile: (o: THREE.Object3D) => Promise<unknown>,
  ) {
    this.group.name = 'regions';
    parent.add(this.group);
  }

  private load(id: RegionId): Region3dModule | null {
    const m = this.mods.get(id);
    if (m) return m;
    const get = REGION_3D[id];
    if (get && !this.loading.has(id)) {
      this.loading.add(id);
      void get().then(
        (mod) => this.mods.set(id, mod),
        () => this.loading.delete(id),
      );
    }
    return null;
  }

  private ensure(id: RegionId): Live | null {
    let l = this.live.get(id);
    if (l) return l;
    const mod = this.load(id);
    const layout = layoutOf(id);
    if (!mod || !layout) return null;
    const r = mod.createRegion3d(layout);
    r.group.visible = false;
    this.group.add(r.group);
    l = {
      id,
      r,
      layout,
      chunks: new ActiveChunks(),
      cache: new ChunkLRU(REGION_CACHE.lruBytes),
      key: '',
      warm: 'no',
    };
    this.live.set(id, l);
    return l;
  }

  /** WORLD-68: link a live region's programs once, off the critical path. */
  private prewarm(l: Live, at: Vec2): void {
    if (l.warm !== 'no') return;
    l.warm = 'going';
    // Fill it round the arrival so every batch has something to link with.
    this.fill(l, at);
    const shown = l.r.group.visible;
    l.r.group.visible = true;
    const done = this.compile(l.r.group);
    l.r.group.visible = shown;
    void done.then(
      () => (l.warm = 'yes'),
      () => (l.warm = 'yes'),
    );
  }

  /** Whether the region's programs are linked (a test and the debug line read it). */
  warmed(id: RegionId): boolean {
    return this.live.get(id)?.warm === 'yes';
  }

  /** Fill from the chunks round `centre` within `rings` (a neighbour's edge, a prewarm). */
  private fill(l: Live, centre: Vec2, rings: number = WORLD_STREAM.rings, clip = false): void {
    const cx = Math.floor(centre.x / WORLD_STREAM.chunk);
    const cz = Math.floor(centre.z / WORLD_STREAM.chunk);
    const coords: ChunkCoord[] = [];
    for (let dz = -rings; dz <= rings; dz++)
      for (let dx = -rings; dx <= rings; dx++) coords.push({ cx: cx + dx, cz: cz + dz });
    this.fillFrom(l, coords, clip);
  }

  private fillFrom(l: Live, coords: readonly ChunkCoord[], clip = false): void {
    const key = coords.map(chunkKey).sort().join('|') + (clip ? '|clip' : '');
    if (key === l.key) return;
    l.key = key;
    const list: LayoutChunk[] = [];
    for (const c of coords) {
      const ch = l.layout.chunks.get(chunkKey(c));
      if (ch) list.push(ch);
    }
    this.drawnChunks = list.length;
    l.r.setChunks(list, l.cache, clip);
  }

  /** Call once a frame: what the Keeper's place needs, built, shown, filled or released. */
  frame(world: World, keeper: Vec2, t: number, still: boolean, cam: THREE.Vector3): void {
    const here = drawnRegion(world);
    const home = world.location === 'grove';
    const want = new Map<RegionId, { at: Vec2; off: Vec2 | null; warm: boolean }>();
    if (here) want.set(here, { at: keeper, off: null, warm: true });
    const exits = here || home ? walkExitsHere(world) : [];
    for (const e of exits) {
      const seam = e.kind === 'seamless';
      if (!REGION_SPECS[e.to] && !(seam && EDGE_SPECS[e.to])) continue;
      const cx = e.rect.x + e.rect.w / 2;
      const cz = e.rect.z + e.rect.h / 2;
      const d = Math.hypot(keeper.x - cx, keeper.z - cz);
      if (d > (seam ? REGION_BORDER.neighbourReach : REGION_BORDER.prewarmReach)) continue;
      const off = seamlessOffset(e);
      want.set(e.to, { at: e.arrive, off: seam ? { x: -off.x, z: -off.z } : null, warm: true });
    }
    for (const [id, l] of this.live) {
      if (want.has(id)) continue;
      l.r.group.removeFromParent();
      l.r.dispose();
      l.cache.clear();
      this.live.delete(id);
      this.released++;
    }
    for (const [id, w] of want) {
      const l = this.ensure(id);
      if (!l) continue;
      if (id === here) {
        l.r.group.visible = true;
        l.r.group.position.set(0, 0, 0);
        // The active set with hysteresis (WORLD-09): refilled only when a chunk joins or leaves.
        const moved = l.chunks.update(keeper.x, keeper.z);
        if (moved.added.length || moved.removed.length || l.key === '')
          this.fillFrom(l, l.chunks.list());
      } else if (w.off) {
        l.r.group.visible = true;
        l.r.group.position.set(w.off.x, -0.03, w.off.z);
        this.fill(l, w.at, REGION_BORDER.neighbourRows - 1, true);
      } else {
        l.r.group.visible = false;
        this.prewarm(l, w.at);
      }
      l.r.tick(t, still, cam, keeper);
      l.r.sync?.(world);
    }
    this.placeArches(exits, here);
  }

  /** The arch over each loaded way in, from the drawn region's module, shown where it stands. */
  private placeArches(exits: ReturnType<typeof walkExitsHere>, here: RegionId | null): void {
    const shown = new Set<string>();
    for (const e of exits) {
      if (e.kind === 'seamless') continue;
      const mod = this.mods.get(here ?? e.to);
      if (!mod) {
        this.load(here ?? e.to);
        continue;
      }
      let a = this.arches.get(e.id);
      if (!a) {
        a = mod.entrance().clone();
        const ex = e.rect.x + e.rect.w / 2;
        const ez = e.rect.z + e.rect.h / 2;
        // R11 d7: an east or west way in stands beyond the box on that side, turned to face in.
        if (Math.abs(ex) > Math.abs(ez)) {
          a.position.set(ex + Math.sign(ex) * 1.2, 0, ez);
          a.rotation.y = ex < 0 ? Math.PI / 2 : -Math.PI / 2;
        } else {
          a.position.set(ex, 0, ez + (ez < 0 ? -1.2 : 1.2));
          // Open toward the region the Keeper walks out of.
          a.rotation.y = ez < 0 ? 0 : Math.PI;
        }
        this.arches.set(e.id, a);
        this.group.add(a);
      }
      shown.add(e.id);
    }
    for (const [id, a] of this.arches) a.visible = shown.has(id);
  }

  /** The debug panel's region line (WORLD-15): what is live, its chunks and cache, releases. */
  debug(): string {
    const parts = [...this.live.values()].map(
      (l) =>
        `${l.id}${l.r.group.visible ? '' : ' (built)'} ${l.warm === 'yes' ? 'linked ' : ''}` +
        `cache ${l.cache.size}c ${Math.round(l.cache.bytes / 1024)}kB`,
    );
    return `regions ${parts.join(', ') || 'none'}  chunks ${this.drawnChunks}  released ${this.released}`;
  }

  /** A hidden tab (iOS drops background tabs): drop the chunk caches; the batches keep the live ring. */
  trim(): void {
    for (const l of this.live.values()) l.cache.clear();
  }

  dispose(): void {
    for (const l of this.live.values()) l.r.dispose();
    this.live.clear();
    this.group.removeFromParent();
  }
}

const sx = new THREE.Vector3();
const sy = new THREE.Vector3();
const dir = new THREE.Vector3();
const off = new THREE.Vector3();
const UP = new THREE.Vector3(0, 1, 0);

/**
 * WORLD-56: hold the sun's shadow box on `focus` (the Keeper's look point) every frame, with
 * the box's centre snapped to whole shadow-map texels in the light's own axes. A box that slid
 * by fractions of a texel made every static shadow edge crawl as the Keeper walked; snapped,
 * static pixels stay put however far out in a big region the Keeper goes.
 */
export function snapShadow(sun: THREE.DirectionalLight, focus: THREE.Vector3): void {
  const cam = sun.shadow.camera;
  const texel = (cam.right - cam.left) / sun.shadow.mapSize.x;
  if (!(texel > 0)) return;
  off.subVectors(sun.position, sun.target.position);
  if (off.lengthSq() < 1e-6) return;
  dir.copy(off).normalize();
  sx.crossVectors(UP, dir);
  if (sx.lengthSq() < 1e-6) sx.set(1, 0, 0);
  sx.normalize();
  sy.crossVectors(dir, sx).normalize();
  const a = focus.dot(sx);
  const b = focus.dot(sy);
  const t = sun.target.position;
  t.copy(focus)
    .addScaledVector(sx, Math.round(a / texel) * texel - a)
    .addScaledVector(sy, Math.round(b / texel) * texel - b);
  sun.position.copy(t).add(off);
  sun.target.updateMatrixWorld();
}

if (import.meta.env.DEV)
  (globalThis as { __regionEngine3d?: object }).__regionEngine3d = { REGION_3D };
