import { ATLAS } from '../../config/tuning';
import { NearestFilter, SRGBColorSpace, Texture, Vector2 } from 'three';
import type { FrameRect, SpriteSheet } from './atlas';

/** Where a sheet landed inside the mega atlas. */
export interface Placement {
  x: number;
  y: number;
}

/** The 2D canvas the atlas paints into; tests hand in a fake. */
export interface AtlasSurface {
  canvas: HTMLCanvasElement;
  ctx: Pick<CanvasRenderingContext2D, 'drawImage' | 'clearRect'>;
}

/** The one renderer call the atlas needs to upload just the region a new sheet covers. */
export interface AtlasUploader {
  copyTextureToTexture(
    src: Texture,
    dst: Texture,
    srcRegion?: null,
    dstPosition?: Vector2 | null,
  ): void;
}

interface Slot extends Placement {
  w: number;
  h: number;
  /** The atlas frame this sheet was last asked for; this frame's sheets are never evicted. */
  lastUsed: number;
}

function canvasSurface(size: number): AtlasSurface {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

/**
 * One big texture holding every sprite sheet, so all sprites can be drawn in one call.
 * Sheets are packed on shelves (rows) as they arrive. When one does not fit, the atlas
 * repacks from scratch: the sheets drawn this frame and the newcomer first, then the
 * rest from most to least recently used until the space runs out, so the least recently
 * used sheets are the ones dropped (they come back the next time something draws them).
 * A repack moves sheets, so it bumps `generation` and callers re-ask their UVs.
 *
 * The 4096² canvas is only allocated when the first sheet is placed, so the full-3D
 * mode, which keeps a WorldView only for its sheet cache, never pays for it. A new sheet
 * uploads only its own region (`flush`, called by the batch with the renderer just before
 * it draws); the first fill and a repack upload the whole texture once.
 */
export class MegaAtlas {
  readonly texture = new Texture();
  /** Bumped by every repack: every placement handed out before it is stale. */
  generation = 0;
  private surface: AtlasSurface | null = null;
  private readonly slots = new Map<SpriteSheet, Slot>();
  private shelfY = 0;
  private shelfX = 0;
  private shelfH = 0;
  private frame = 0;
  /** Sheets placed since the last upload, each to be copied into its own region. */
  private pending: Array<{ sheet: SpriteSheet; x: number; y: number }> = [];
  private fullUpload = false;
  private readonly scratch = new Texture();
  private readonly dst = new Vector2();
  private warned = false;

  constructor(
    readonly size = 4096,
    private readonly makeSurface: (size: number) => AtlasSurface = canvasSurface,
  ) {
    for (const t of [this.texture, this.scratch]) {
      t.magFilter = NearestFilter;
      t.minFilter = NearestFilter;
      t.generateMipmaps = false;
      t.colorSpace = SRGBColorSpace;
    }
  }

  /** The backing canvas, or null before the first sheet is placed. */
  get canvas(): HTMLCanvasElement | null {
    return this.surface?.canvas ?? null;
  }

  /** How many sheets are resident (for tests and the debug panel). */
  get sheetCount(): number {
    return this.slots.size;
  }

  /** Start a frame: sheets asked for from now on are pinned until the next call. */
  beginFrame(): void {
    this.frame++;
  }

  has(sheet: SpriteSheet): boolean {
    return this.slots.has(sheet);
  }

  /** Copy a sheet in (evicting stale sheets if needed); null only if it cannot fit at all. */
  place(sheet: SpriteSheet): Placement | null {
    const existing = this.slots.get(sheet);
    if (existing) {
      existing.lastUsed = this.frame;
      return existing;
    }
    if (sheet.width > this.size || sheet.height > this.size) {
      this.warnOnce(`a ${sheet.width}x${sheet.height} sheet is larger than the atlas`);
      return null;
    }
    const at = this.alloc(sheet.width, sheet.height);
    if (!at) {
      this.repack(sheet);
      const placed = this.slots.get(sheet) ?? null;
      if (!placed) this.warnOnce("this frame's sheets do not fit even after eviction");
      return placed;
    }
    const slot = this.put(sheet, at);
    this.pending.push({ sheet, x: slot.x, y: slot.y });
    return slot;
  }

  /** UV rectangle [u0, vTop, u1, vBottom] for a frame of a placed sheet. */
  uv(sheet: SpriteSheet, rect: FrameRect): [number, number, number, number] | null {
    const p = this.slots.get(sheet);
    if (!p) return null;
    p.lastUsed = this.frame;
    const x = p.x + rect.x;
    const y = p.y + rect.y;
    return [
      x / this.size,
      1 - y / this.size,
      (x + rect.w) / this.size,
      1 - (y + rect.h) / this.size,
    ];
  }

  /**
   * Upload what changed since the last call: each new sheet into its own region, or
   * nothing when a full upload is already due (the texture's `needsUpdate` covers it).
   */
  flush(renderer: AtlasUploader): void {
    if (this.fullUpload) {
      this.fullUpload = false;
      this.pending.length = 0;
      return;
    }
    for (const p of this.pending) {
      // A fresh stand-in texture for the sheet's canvas: never bound itself, so three
      // copies it with texSubImage2D. With flipY the canvas row y lands on texture row
      // size - 1 - y, the same as the full upload.
      this.scratch.image = p.sheet.texture.image;
      this.scratch.flipY = this.texture.flipY;
      this.dst.set(p.x, this.size - p.y - p.sheet.height);
      renderer.copyTextureToTexture(this.scratch, this.texture, null, this.dst);
    }
    this.pending.length = 0;
    this.scratch.image = null;
  }

  dispose(): void {
    this.texture.dispose();
  }

  /** Shelf packing; null when the sheet does not fit in what is left. */
  private alloc(w: number, h: number): Placement | null {
    let x = this.shelfX;
    let y = this.shelfY;
    let shelfH = this.shelfH;
    if (x + w > this.size) {
      y += shelfH;
      x = 0;
      shelfH = 0;
    }
    if (y + h > this.size) return null;
    this.shelfX = x + w;
    this.shelfY = y;
    this.shelfH = Math.max(shelfH, h);
    return { x, y };
  }

  private put(sheet: SpriteSheet, at: Placement): Slot {
    const surface = this.ensureSurface();
    surface.ctx.drawImage(sheet.texture.image as HTMLCanvasElement, at.x, at.y);
    const slot: Slot = { ...at, w: sheet.width, h: sheet.height, lastUsed: this.frame };
    this.slots.set(sheet, slot);
    return slot;
  }

  private ensureSurface(): AtlasSurface {
    if (!this.surface) {
      this.surface = this.makeSurface(this.size);
      this.texture.image = this.surface.canvas;
      this.texture.needsUpdate = true;
      this.fullUpload = true;
    }
    return this.surface;
  }

  /** Start over with this frame's sheets and `incoming`, then refill by recency. */
  private repack(incoming: SpriteSheet): void {
    const entries = [...this.slots.entries()];
    const pinned = entries.filter(([, s]) => s.lastUsed === this.frame).map(([sheet]) => sheet);
    const rest = entries
      .filter(([, s]) => s.lastUsed !== this.frame)
      .sort((a, b) => b[1].lastUsed - a[1].lastUsed)
      .map(([sheet]) => sheet);
    this.slots.clear();
    this.pending.length = 0;
    this.shelfX = 0;
    this.shelfY = 0;
    this.shelfH = 0;
    const surface = this.ensureSurface();
    surface.ctx.clearRect(0, 0, this.size, this.size);
    // Tallest first packs shelves tightly; the must-keep sheets go in before the rest.
    const first = [...pinned, incoming].sort((a, b) => b.height - a.height);
    for (const sheet of first) {
      const at = this.alloc(sheet.width, sheet.height);
      if (at) this.put(sheet, at);
    }
    // Refill with recent sheets only up to the headroom line, so the next new sheets land
    // in free space instead of each forcing another repack and full upload.
    const limit = this.size * (1 - ATLAS.headroom);
    for (const sheet of rest) {
      const y = this.shelfX + sheet.width > this.size ? this.shelfY + this.shelfH : this.shelfY;
      if (y + sheet.height > limit) break;
      const at = this.alloc(sheet.width, sheet.height);
      if (at) this.put(sheet, at);
    }
    this.texture.needsUpdate = true;
    this.fullUpload = true;
    this.generation++;
  }

  private warnOnce(why: string): void {
    if (this.warned) return;
    this.warned = true;
    console.warn(`[sprites] mega atlas: ${why}; some sprites are skipped`);
  }
}
