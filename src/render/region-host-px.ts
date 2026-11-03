import * as THREE from 'three';
import { REGIONS, type RegionId } from '../config/regions';
import { CAMERA } from '../config/tuning';
import type { LayoutChunk, RegionLayout } from '../config/region-layout';
import { REGION_BORDER, REGION_CACHE, REGION_ORIGIN } from '../config/tuning-r11d1';
import { WORLD_STREAM } from '../config/tuning-world';
import {
  drawnRegion,
  EDGE_SPECS,
  layoutOf,
  REGION_SPECS,
  seamlessOffset,
  walkExitsHere,
} from '../sim/region-walk';
import type { Vec2, World } from '../sim/types';
import { ActiveChunks, ChunkLRU, chunkKey } from './chunks';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';

/**
 * R11 lane D: the pixel view's region engine (WORLD-09, 15, 25, 39, 56). Each drawn region is
 * a lazy module (`REGION_PX`) that paints its ground once and hands back a chunk's sprites; the
 * host decides what is live:
 * - the region the Keeper is in, its ground shown and only the chunks within
 *   `WORLD_STREAM.rings` of the Keeper drawn (the batch culls what is off view), each chunk's
 *   sprite list kept in a byte-capped LRU so walking back costs nothing;
 * - a loaded neighbour, built hidden during the last `prebuildReach` units of the approach, so
 *   the iris only swaps it in; and the arch over the way in, drawn from the target's module;
 * - a seamless neighbour, its edge chunks drawn across the border at the exit's offset
 *   (`seamlessOffset`, the floating origin), from `neighbourReach` out.
 * A region no longer wanted is disposed whole (ground, texture, cache): memory goes back on exit.
 */

export interface RegionPx {
  /** The painted ground, a flat plane at y 0 centred on the region's origin. */
  readonly ground: THREE.Mesh;
  /** A chunk's sprites (trees, props, landmarks standing in it), region-local. */
  chunkDraws(c: LayoutChunk): SpriteDraw[];
  dispose(): void;
}

export interface RegionPxModule {
  createRegionPx(l: RegionLayout): RegionPx;
  /** The arch over a loaded way in, drawn in whichever region it stands. */
  drawEntrance(batch: SpriteBatch, x: number, z: number, tint: number): void;
  /** R11 d7: the few sprites that change with the world (a thawed door), drawn every frame. */
  drawDynamic?(batch: SpriteBatch, world: World, tint: number): void;
}

/** Each drawn region's pixel module, loaded on first approach (a new region adds a line). */
export const REGION_PX: Partial<Record<RegionId, () => Promise<RegionPxModule>>> = {
  wood: () => import('./region-wood'),
  shore: () => import('./region-shore'),
  sunlands: () => import('./region-sunmoon').then((m) => m.sun),
  moonlands: () => import('./region-sunmoon').then((m) => m.moon),
  ruins: () => import('./region-ruins'),
  ridge: () => import('./region-ridge'),
  // R11 d7: the Grove's stand-in strip, drawn only across a seamless border from a neighbour.
  grove: () => import('./region-grove-edge'),
};

interface Live {
  id: RegionId;
  px: RegionPx;
  layout: RegionLayout;
  chunks: ActiveChunks;
  cache: ChunkLRU<SpriteDraw[]>;
}

const scratch: SpriteDraw = {} as SpriteDraw;

export class RegionHostPx {
  private readonly mods = new Map<RegionId, RegionPxModule>();
  private readonly loading = new Set<RegionId>();
  private readonly live = new Map<RegionId, Live>();
  /** Sprites drawn by regions in the last frame (the debug readout). */
  drawn = 0;
  /** Regions released so far (WORLD-15). */
  released = 0;

  private load(id: RegionId): RegionPxModule | null {
    const m = this.mods.get(id);
    if (m) return m;
    const get = REGION_PX[id];
    if (get && !this.loading.has(id)) {
      this.loading.add(id);
      void get().then(
        (mod) => this.mods.set(id, mod),
        () => this.loading.delete(id),
      );
    }
    return null;
  }

  private ensure(id: RegionId, parent: THREE.Object3D): Live | null {
    let l = this.live.get(id);
    if (l) return l;
    const mod = this.load(id);
    const layout = layoutOf(id);
    if (!mod || !layout) return null;
    const px = mod.createRegionPx(layout);
    px.ground.visible = false;
    parent.add(px.ground);
    l = { id, px, layout, chunks: new ActiveChunks(), cache: new ChunkLRU(REGION_CACHE.lruBytes) };
    this.live.set(id, l);
    return l;
  }

  private draws(l: Live, key: string, c: LayoutChunk): SpriteDraw[] {
    let list = l.cache.get(key);
    if (!list) {
      list = l.px.chunkDraws(c);
      // About 200 bytes a draw record.
      l.cache.set(key, list, 64 + list.length * 200);
    }
    return list;
  }

  /** Draw what the Keeper's place needs; call once a frame from the pixel world view. */
  frame(
    world: World,
    batch: SpriteBatch,
    parent: THREE.Object3D | null,
    tint: number,
    keeper: Vec2,
  ): void {
    this.drawn = 0;
    const here = drawnRegion(world);
    const home = world.location === 'grove';
    const want = new Set<RegionId>();
    if (here) want.add(here);
    const exits = here || home ? walkExitsHere(world) : [];
    // Loaded ways in get their target built near the end of the approach; seamless ones stream.
    const near: { id: RegionId; off: Vec2 | null; at: Vec2 }[] = [];
    for (const e of exits) {
      const cx = e.rect.x + e.rect.w / 2;
      const cz = e.rect.z + e.rect.h / 2;
      const d = Math.hypot(keeper.x - cx, keeper.z - cz);
      const seam = e.kind === 'seamless';
      if (!REGION_SPECS[e.to] && !(seam && EDGE_SPECS[e.to])) continue;
      if (d <= REGION_BORDER.prewarmReach) this.load(e.to);
      if (d <= (seam ? REGION_BORDER.neighbourReach : REGION_BORDER.prebuildReach)) {
        want.add(e.to);
        if (seam) near.push({ id: e.to, off: seamlessOffset(e), at: e.arrive });
      }
    }
    // Release whatever is no longer wanted (WORLD-15).
    for (const [id, l] of this.live) {
      if (want.has(id)) continue;
      l.px.ground.removeFromParent();
      l.px.dispose();
      l.cache.clear();
      this.live.delete(id);
      this.released++;
    }
    if (!parent) return;
    for (const id of want) this.ensure(id, parent);
    for (const l of this.live.values()) l.px.ground.visible = l.id === here;
    if (here) {
      const l = this.live.get(here);
      // R11 d7: a region first drawn as a seamless neighbour still sits at that offset.
      l?.px.ground.position.set(0, 0, 0);
      if (l) this.drawRegion(l, batch, keeper, null, tint);
      this.mods.get(here)?.drawDynamic?.(batch, world, tint);
    }
    for (const n of near) {
      const l = this.live.get(n.id);
      if (!l) continue;
      // Neighbour coordinates are ours shifted by the offset: draw them back by it.
      const off = { x: -n.off!.x, z: -n.off!.z };
      l.px.ground.visible = true;
      // Under the near region's own ground where the two overlap (the forest margin).
      l.px.ground.position.set(off.x, -0.03, off.z);
      this.drawRegion(l, batch, n.at, off, tint, REGION_BORDER.neighbourRows - 1);
    }
    // The arch over each loaded way in, from the drawn region's own module.
    for (const e of exits) {
      if (e.kind === 'seamless') continue;
      const art = this.mods.get(here ?? e.to);
      if (!art) {
        this.load(here ?? e.to);
        continue;
      }
      const ex = e.rect.x + e.rect.w / 2;
      const ez = e.rect.z + e.rect.h / 2;
      // Stand it just beyond the box, on the region's edge side (R11 d7: east and west too).
      const side = Math.abs(ex) > Math.abs(ez);
      art.drawEntrance(
        batch,
        side ? ex + Math.sign(ex) * 1.2 : ex,
        side ? ez : ez + (ez < 0 ? -1.2 : 1.2),
        tint,
      );
    }
  }

  private drawRegion(
    l: Live,
    batch: SpriteBatch,
    centre: Vec2,
    off: Vec2 | null,
    tint: number,
    rings?: number,
  ): void {
    const cx = Math.floor(centre.x / WORLD_STREAM.chunk);
    const cz = Math.floor(centre.z / WORLD_STREAM.chunk);
    const r = rings ?? WORLD_STREAM.rings;
    if (rings === undefined) l.chunks.update(centre.x, centre.z);
    for (let dz = -r; dz <= r; dz++)
      for (let dx = -r; dx <= r; dx++) {
        const key = chunkKey({ cx: cx + dx, cz: cz + dz });
        const c = l.layout.chunks.get(key);
        if (!c) continue;
        const hw = l.layout.spec.size.w / 2;
        const hh = l.layout.spec.size.h / 2;
        for (const d of this.draws(l, key, c)) {
          d.tint = tint;
          if (off) {
            // Across a seamless border only the neighbour's own ground is drawn, never its
            // forest margin, which would stand inside this region.
            if (Math.abs(d.x) > hw || Math.abs(d.z) > hh) continue;
            Object.assign(scratch, d);
            scratch.x = d.x + off.x;
            scratch.z = d.z + off.z;
            batch.draw(scratch);
          } else batch.draw(d);
          this.drawn++;
        }
      }
  }

  /** The debug panel's region line (WORLD-15). */
  debug(): string {
    const parts = [...this.live.values()].map(
      (l) => `${l.id} cache ${l.cache.size}c ${Math.round(l.cache.bytes / 1024)}kB`,
    );
    return `regions ${parts.join(', ') || 'none'}  sprites ${this.drawn}  released ${this.released}`;
  }

  /** A hidden tab (iOS drops background tabs): drop the chunk caches; the view rebuilds them. */
  trim(): void {
    for (const l of this.live.values()) l.cache.clear();
  }

  dispose(): void {
    for (const l of this.live.values()) {
      l.px.ground.removeFromParent();
      l.px.dispose();
    }
    this.live.clear();
  }
}

/**
 * WORLD-56: the pixel camera's far plane covers a region's diagonal times `farScale`, never
 * less than `CAMERA.far`, so a long view down a big region never clips.
 */
export function regionFar(camera: THREE.OrthographicCamera, region: string): void {
  const def = REGIONS[region as RegionId];
  if (!def) return;
  const far = Math.max(CAMERA.far, Math.hypot(def.size.w, def.size.h) * REGION_ORIGIN.farScale);
  if (camera.far === far) return;
  camera.far = far;
  camera.updateProjectionMatrix();
}

// Dev builds only: the Edge drivers register a stand-in region here to check a seamless border
// live (`recs-2026-10-27/tools/r11-d1-seam.cjs`); the module instances must be the app's own.
if (import.meta.env.DEV)
  (globalThis as { __regionEngine?: object }).__regionEngine = { REGIONS, REGION_SPECS, REGION_PX };
