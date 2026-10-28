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
}
