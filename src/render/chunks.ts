/**
 * The chunk grid (WORLD-09): every region is cut into `WORLD_STREAM.chunk`-unit squares, and
 * the set worth keeping is the rings around the Keeper, with one ring of hysteresis so walking
 * along a chunk edge does not build and drop the same chunk every step. Pure and shared by
 * both renderers. The pixel renderer also uses the view test here to skip sprites off screen
 * (`SpriteCuller`), which is where most of its per-frame cost goes.
 */
import { WORLD_STREAM } from '../config/tuning-world';
import type { SpriteDraw } from './sprite-batch';

export interface ChunkCoord {
  cx: number;
  cz: number;
}

export function chunkOf(x: number, z: number, size: number = WORLD_STREAM.chunk): ChunkCoord {
  return { cx: Math.floor(x / size), cz: Math.floor(z / size) };
}

export function chunkKey(c: ChunkCoord): string {
  return `${c.cx},${c.cz}`;
}

/** The chunks within `rings` of a chunk (a square of side 2 × rings + 1). */
export function chunksAround(c: ChunkCoord, rings: number): ChunkCoord[] {
  const out: ChunkCoord[] = [];
  for (let dz = -rings; dz <= rings; dz++) {
    for (let dx = -rings; dx <= rings; dx++) out.push({ cx: c.cx + dx, cz: c.cz + dz });
  }
  return out;
}

/**
 * The active chunk set with hysteresis: a chunk joins when it comes within `rings` of the
 * Keeper's chunk and leaves only once it is further than `rings + keepRings`.
 */
export class ActiveChunks {
  private readonly live = new Map<string, ChunkCoord>();

  constructor(
    private readonly rings: number = WORLD_STREAM.rings,
    private readonly keepRings: number = WORLD_STREAM.keepRings,
    private readonly size: number = WORLD_STREAM.chunk,
  ) {}

  /** Move the centre; returns the chunks that joined and the ones that left. */
  update(x: number, z: number): { added: ChunkCoord[]; removed: ChunkCoord[] } {
    const at = chunkOf(x, z, this.size);
    const added: ChunkCoord[] = [];
    const removed: ChunkCoord[] = [];
    for (const c of chunksAround(at, this.rings)) {
      const k = chunkKey(c);
      if (this.live.has(k)) continue;
      this.live.set(k, c);
      added.push(c);
    }
    const keep = this.rings + this.keepRings;
    for (const [k, c] of this.live) {
      if (Math.max(Math.abs(c.cx - at.cx), Math.abs(c.cz - at.cz)) <= keep) continue;
      this.live.delete(k);
      removed.push(c);
    }
    return { added, removed };
  }

  has(c: ChunkCoord): boolean {
    return this.live.has(chunkKey(c));
  }

  /** The live chunks (R11 lane D: what a region's batches hold). */
  list(): ChunkCoord[] {
    return [...this.live.values()];
  }

  get count(): number {
    return this.live.size;
  }
}

/** What the culler needs from the camera (the pixel `OrbitCamera` has all of it). */
export interface CullCamera {
  readonly target: { x: number; y: number; z: number };
  readonly currentYaw: number;
  readonly pitch: number;
  readonly visibleWidth: number;
  readonly visibleHeight: number;
}

/**
 * Tests a sprite against the orthographic view, in the camera's own screen axes: right along
 * the ground, up tilted back by the pitch, as the batch draws them. Updated once a frame and
 * read for every sprite, so it allocates nothing.
 */
export class SpriteCuller {
  private cx = 0;
  private cy = 0;
  private cz = 0;
  private rx = 1;
  private rz = 0;
  private ux = 0;
  private uy = 1;
  private uz = 0;
  private halfW = 0;
  private halfH = 0;
  private margin: number = WORLD_STREAM.viewMargin;

  update(camera: CullCamera): void {
    const yaw = camera.currentYaw;
    const p = camera.pitch;
    this.cx = camera.target.x;
    this.cy = camera.target.y;
    this.cz = camera.target.z;
    this.rx = Math.cos(yaw);
    this.rz = -Math.sin(yaw);
    this.ux = -Math.sin(yaw) * Math.sin(p);
    this.uy = Math.cos(p);
    this.uz = -Math.cos(yaw) * Math.sin(p);
    this.halfW = camera.visibleWidth / 2;
    this.halfH = camera.visibleHeight / 2;
  }

  /** Whether any of the sprite can be on screen (false only when it surely is not). */
  readonly visible = (d: SpriteDraw, w: number, h: number): boolean => {
    const dx = d.x - this.cx;
    const dy = d.y - this.cy;
    const dz = d.z - this.cz;
    const sx = dx * this.rx + dz * this.rz;
    const sy = dx * this.ux + dy * this.uy + dz * this.uz;
    const m = this.margin;
    const reach = d.mode === 'flat' ? Math.max(w, h) : w / 2;
    if (sx + reach < -this.halfW - m || sx - reach > this.halfW + m) return false;
    const low = d.mode === 'flat' ? sy - Math.max(w, h) : sy;
    const high = sy + (d.mode === 'flat' ? Math.max(w, h) : h);
    return high >= -this.halfH - m && low <= this.halfH + m;
  };

  /**
   * WORLD-09 (R12 lane D): whether any of a ground box `[x0,x1]×[z0,z1]` holding sprites up
   * to `height` tall can be on screen. Its four ground corners and their tops are taken to
   * screen axes; false only when all eight fall off one side.
   */
  boxVisible(x0: number, x1: number, z0: number, z1: number, height: number): boolean {
    let loX = Infinity;
    let hiX = -Infinity;
    let loY = Infinity;
    let hiY = -Infinity;
    for (let i = 0; i < 4; i++) {
      const dx = (i & 1 ? x1 : x0) - this.cx;
      const dz = (i & 2 ? z1 : z0) - this.cz;
      const sx = dx * this.rx + dz * this.rz;
      const sy = dx * this.ux - this.cy * this.uy + dz * this.uz;
      if (sx < loX) loX = sx;
      if (sx > hiX) hiX = sx;
      if (sy < loY) loY = sy;
      if (sy + height * this.uy > hiY) hiY = sy + height * this.uy;
    }
    const m = this.margin;
    if (hiX < -this.halfW - m || loX > this.halfW + m) return false;
    return hiY >= -this.halfH - m && loY <= this.halfH + m;
  }
}

/**
 * WORLD-09 (R12 lane D): the Grove's own static sprites (scenery, fence posts, ground
 * dressing) bucketed into the 16 u chunks once, so a frame tests a few dozen chunk boxes and
 * then skips every sprite of a chunk off screen with one array read, instead of lighting,
 * swaying and culling each of the ~780 sprites one by one. The list's order is kept, so the
 * draw order is unchanged.
 */
export class ChunkMask {
  private readonly ids: Uint16Array;
  private readonly boxes: number[] = [];
  private readonly on: Uint8Array;
  /** Sprites skipped by their chunk on the last `update` (the debug readout). */
  skipped = 0;
  /** Chunks drawn on the last `update`. */
  live = 0;

  constructor(
    items: ReadonlyArray<{ x: number; z: number }>,
    private readonly reach: number,
    private readonly height: number,
    size: number = WORLD_STREAM.chunk,
  ) {
    this.ids = new Uint16Array(items.length);
    const index = new Map<string, number>();
    items.forEach((it, i) => {
      const c = chunkOf(it.x, it.z, size);
      const k = chunkKey(c);
      let id = index.get(k);
      if (id === undefined) {
        id = index.size;
        index.set(k, id);
        this.boxes.push(c.cx * size, (c.cx + 1) * size, c.cz * size, (c.cz + 1) * size);
      }
      this.ids[i] = id;
    });
    this.on = new Uint8Array(index.size).fill(1);
  }

  /**
   * Mark the chunks the view can reach; `null` (no culler) keeps them all. `ox`/`oz` shift
   * the items into the view's coordinates (the Grove drawn back from a seamless neighbour).
   */
  update(culler: SpriteCuller | null, ox = 0, oz = 0): void {
    this.live = 0;
    const r = this.reach;
    for (let c = 0; c < this.on.length; c++) {
      const b = c * 4;
      const v =
        culler === null ||
        culler.boxVisible(
          this.boxes[b]! - r + ox,
          this.boxes[b + 1]! + r + ox,
          this.boxes[b + 2]! - r + oz,
          this.boxes[b + 3]! + r + oz,
          this.height,
        );
      this.on[c] = v ? 1 : 0;
      if (v) this.live++;
    }
    this.skipped = 0;
  }

  /** Whether item `i` of the list built on stands in a chunk worth drawing. */
  has(i: number): boolean {
    if (this.on[this.ids[i]!] === 1) return true;
    this.skipped++;
    return false;
  }

  get chunks(): number {
    return this.on.length;
  }
}

/**
 * WORLD-09 (R11 lane D): the built-chunk cache. Each region keeps what it built for a chunk
 * (instance matrices, sprite lists) under a byte cap, least recently used first out, so
 * walking back over ground just left costs nothing and a long walk never grows memory. The
 * builds are cheap and seeded, so a chunk dropped here is simply built again; nothing is kept
 * across reloads (IndexedDB would cost more to read than the build does).
 */
export class ChunkLRU<T> {
  private readonly map = new Map<string, { value: T; bytes: number }>();
  private used = 0;

  constructor(private readonly capBytes: number) {}

  get(key: string): T | undefined {
    const hit = this.map.get(key);
    if (!hit) return undefined;
    // Re-insert so iteration order is least recently used first.
    this.map.delete(key);
    this.map.set(key, hit);
    return hit.value;
  }

  set(key: string, value: T, bytes: number): void {
    const old = this.map.get(key);
    if (old) {
      this.used -= old.bytes;
      this.map.delete(key);
    }
    this.map.set(key, { value, bytes });
    this.used += bytes;
    for (const [k, v] of this.map) {
      if (this.used <= this.capBytes || k === key) break;
      this.map.delete(k);
      this.used -= v.bytes;
    }
  }

  /** Keep only `keys` (the active ring): a hidden tab on a phone drops the rest. */
  trimTo(keys: ReadonlySet<string>): void {
    for (const [k, v] of this.map) {
      if (keys.has(k)) continue;
      this.map.delete(k);
      this.used -= v.bytes;
    }
  }

  clear(): void {
    this.map.clear();
    this.used = 0;
  }

  get bytes(): number {
    return this.used;
  }

  get size(): number {
    return this.map.size;
  }
}
