import { ATLAS, FRAME_SPIKES } from '../../config/tuning';
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
  /** Which atlas page holds it. */
  page: number;
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

/** One 4096² canvas and its texture, packed on shelves. */
class Page {
  readonly texture = new Texture();
  surface: AtlasSurface | null = null;
  /** Rows of sheets, top to bottom; each fills left to right. */
  shelves: Array<{ y: number; h: number; x: number }> = [];
  /** Sheets placed since the last upload, each to be copied into its own region. */
  pending: Array<{ sheet: SpriteSheet; x: number; y: number }> = [];
  fullUpload = false;

  constructor() {
    this.texture.magFilter = NearestFilter;
    this.texture.minFilter = NearestFilter;
    this.texture.generateMipmaps = false;
    this.texture.colorSpace = SRGBColorSpace;
  }

  clear(): void {
    this.shelves.length = 0;
    this.pending.length = 0;
  }
}

/**
 * One big texture holding every sprite sheet, so all sprites can be drawn in one call.
 * Sheets are packed on shelves (rows) as they arrive. When one does not fit, the atlas
 * opens a second page (HOT-2), sampled by the same draw call: its UVs sit at u + 2, and
 * the batch's shader picks the page from u. Only when every page is full does it repack
 * from scratch: the sheets drawn this frame and the newcomer first, then the sheets drawn
 * last frame (they are about to be drawn again, so dropping them only repacks again on
 * the next frame and re-uploads every page every frame), then the rest from most to least
 * recently used up to the headroom line, so the least recently used sheets are the ones
 * dropped (they come back the next time something draws them). A repack moves sheets, so
 * it bumps `generation` and callers re-ask their UVs.
 *
 * A page's 4096² canvas is only allocated when its first sheet is placed, so the full-3D
 * mode, which keeps a WorldView only for its sheet cache, never pays for it, and the
 * second page only exists in a crowded Grove. A new sheet uploads only its own region
 * (`flush`, called by the batch with the renderer just before it draws); a page's first
 * fill and a repack upload the whole page once.
 */
export class MegaAtlas {
  private readonly pages: Page[];
  /** Bumped by every repack: every placement handed out before it is stale. */
  generation = 0;
  private readonly slots = new Map<SpriteSheet, Slot>();
  private frame = 0;
  private readonly scratch = new Texture();
  private readonly dst = new Vector2();
  private warned = false;
  /** Sheets a repack dropped, and the frame it did: the churn check. */
  private readonly dropped = new WeakMap<SpriteSheet, number>();
  /** During a repack: when each sheet being re-placed was last drawn. */
  private lastUsed = new Map<SpriteSheet, number>();

  constructor(
    readonly size = 4096,
    private readonly makeSurface: (size: number) => AtlasSurface = canvasSurface,
    readonly maxPages: number = FRAME_SPIKES.atlasPages,
  ) {
    this.pages = Array.from({ length: Math.max(1, maxPages) }, () => new Page());
    this.scratch.magFilter = NearestFilter;
    this.scratch.minFilter = NearestFilter;
    this.scratch.generateMipmaps = false;
    this.scratch.colorSpace = SRGBColorSpace;
  }

  /** The first page's texture. */
  get texture(): Texture {
    return this.pages[0]!.texture;
  }

  /** The second page's texture (empty until a crowded frame opens it), or the first's. */
  get texture2(): Texture {
    return (this.pages[1] ?? this.pages[0]!).texture;
  }

  /** The first page's backing canvas, or null before the first sheet is placed. */
  get canvas(): HTMLCanvasElement | null {
    return this.pages[0]!.surface?.canvas ?? null;
  }

  /** How many pages hold a canvas (for tests, the debug panel and the spike probe). */
  get pagesOpen(): number {
    return this.pages.filter((p) => p.surface).length;
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
    // Fill the open pages in order (the first even before its canvas exists).
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages[i]!;
      if (i > 0 && !page.surface) break;
      const at = this.alloc(page, sheet.width, sheet.height, this.size);
      if (!at) continue;
      const slot = this.put(sheet, i, at);
      page.pending.push({ sheet, x: slot.x, y: slot.y });
      return slot;
    }
    this.repack(sheet);
    const placed = this.slots.get(sheet) ?? null;
    if (!placed) this.warnOnce("this frame's sheets do not fit even after eviction");
    return placed;
  }

  /**
   * UV rectangle [u0, vTop, u1, vBottom] for a frame of a placed sheet. A sheet on page k
   * has u shifted by 2k, which the batch's shader reads back as the page.
   */
  uv(sheet: SpriteSheet, rect: FrameRect): [number, number, number, number] | null {
    return this.uvInto(sheet, rect, [0, 0, 0, 0]);
  }

  /** R0473 (lane D r10): `uv` written into `out`, so the per-sprite hot path makes no garbage. */
  uvInto(
    sheet: SpriteSheet,
    rect: FrameRect,
    out: [number, number, number, number],
  ): [number, number, number, number] | null {
    const p = this.slots.get(sheet);
    if (!p) return null;
    p.lastUsed = this.frame;
    const x = p.x + rect.x;
    const y = p.y + rect.y;
    const u = 2 * p.page;
    out[0] = u + x / this.size;
    out[1] = 1 - y / this.size;
    out[2] = u + (x + rect.w) / this.size;
    out[3] = 1 - (y + rect.h) / this.size;
    return out;
  }

  /**
   * Upload what changed since the last call: each new sheet into its own region, or
   * nothing when a full upload of that page is already due (its `needsUpdate` covers it).
   */
  flush(renderer: AtlasUploader): void {
    for (const page of this.pages) {
      if (page.fullUpload) {
        page.fullUpload = false;
        page.pending.length = 0;
        continue;
      }
      for (const p of page.pending) {
        // A fresh stand-in texture for the sheet's canvas: never bound itself, so three
        // copies it with texSubImage2D. With flipY the canvas row y lands on texture row
        // size - 1 - y, the same as the full upload.
        this.scratch.image = p.sheet.texture.image;
        this.scratch.flipY = page.texture.flipY;
        this.dst.set(p.x, this.size - p.y - p.sheet.height);
        renderer.copyTextureToTexture(this.scratch, page.texture, null, this.dst);
      }
      page.pending.length = 0;
    }
    this.scratch.image = null;
  }

  dispose(): void {
    for (const page of this.pages) page.texture.dispose();
  }

  /**
   * First-fit shelf packing below row `limit`: the first shelf tall enough with room
   * left takes the sheet (HOT-2: the old packer only ever filled the last shelf, and the
   * gaps it left were what pushed a crowded Grove over one page); else the last shelf
   * grows if it can, else a new shelf opens under it. Null when nothing has room.
   */
  private alloc(page: Page, w: number, h: number, limit: number): Placement | null {
    if (w > this.size) return null;
    const shelves = page.shelves;
    const last = shelves[shelves.length - 1];
    for (const s of shelves) {
      const fits = s.h >= h || (s === last && s.y + h <= limit);
      if (fits && s.x + w <= this.size && s.y + h <= limit) {
        const at = { x: s.x, y: s.y };
        s.x += w;
        s.h = Math.max(s.h, h);
        return at;
      }
    }
    const y = last ? last.y + last.h : 0;
    if (y + h > limit) return null;
    shelves.push({ y, h, x: w });
    return { x: 0, y };
  }

  private put(sheet: SpriteSheet, pageIndex: number, at: Placement): Slot {
    const surface = this.ensureSurface(this.pages[pageIndex]!);
    surface.ctx.drawImage(sheet.texture.image as HTMLCanvasElement, at.x, at.y);
    const slot: Slot = {
      ...at,
      page: pageIndex,
      w: sheet.width,
      h: sheet.height,
      // A repack keeps each sheet's own last use: last frame's sheets must not come out
      // of it looking drawn this frame, or the next repack would treat them as on screen.
      lastUsed: this.lastUsed.get(sheet) ?? this.frame,
    };
    this.slots.set(sheet, slot);
    return slot;
  }

  private ensureSurface(page: Page): AtlasSurface {
    if (!page.surface) {
      page.surface = this.makeSurface(this.size);
      page.texture.image = page.surface.canvas;
      page.texture.needsUpdate = true;
      page.fullUpload = true;
    }
    return page.surface;
  }

  /**
   * Place `sheet` on the first page with room under `limit`; false if none has. Only
   * `mayOpen` opens a page that has no canvas yet: sheets on screen now never wait.
   */
  private fit(sheet: SpriteSheet, limit: number, mayOpen: boolean): boolean {
    for (let i = 0; i < this.pages.length; i++) {
      const page = this.pages[i]!;
      if (!page.surface && !mayOpen) continue;
      const at = this.alloc(page, sheet.width, sheet.height, limit);
      if (at) {
        this.put(sheet, i, at);
        return true;
      }
    }
    return false;
  }

  /** Start over with this frame's sheets and `incoming`, last frame's, then by recency. */
  private repack(incoming: SpriteSheet): void {
    const entries = [...this.slots.entries()];
    this.lastUsed = new Map(entries.map(([sheet, s]) => [sheet, s.lastUsed]));
    const tallest = (a: SpriteSheet, b: SpriteSheet) => b.height - a.height;
    const pinned = entries.filter(([, s]) => s.lastUsed === this.frame).map(([sheet]) => sheet);
    const recent = entries
      .filter(([, s]) => s.lastUsed === this.frame - 1)
      .map(([sheet]) => sheet)
      .sort(tallest);
    const rest = entries
      .filter(([, s]) => s.lastUsed < this.frame - 1)
      .sort((a, b) => b[1].lastUsed - a[1].lastUsed)
      .map(([sheet]) => sheet);
    this.clearPages();
    // This frame's and last frame's sheets pack together, tallest first, on the pages
    // already open; only what still does not fit opens the next page (64 MB on a phone).
    const now = [...pinned, incoming];
    const keep = [...now, ...recent].sort(tallest);
    const over = keep.filter((sheet) => !this.fit(sheet, this.size, false));
    // Only sheets drawn this frame open a page; last frame's that do not fit are dropped,
    // and if they come straight back the churn check below opens it for them.
    for (const sheet of over) if (now.includes(sheet)) this.fit(sheet, this.size, true);
    // More on screen than every page holds: this frame's sheets come first after all.
    if (now.some((sheet) => !this.slots.has(sheet))) {
      this.clearPages();
      for (const sheet of now.sort(tallest)) this.fit(sheet, this.size, true);
      for (const sheet of recent) this.fit(sheet, this.size, true);
    }
    // Churn (HOT-2): the newcomer is a sheet a repack dropped moments ago, so dropping
    // sheets is not working (a view that shifts as the camera turns). Rather than re-upload
    // a whole page every second or two, open the next page for the older sheets; a Grove
    // that settles on one page never pays for the second.
    const back = this.dropped.get(incoming);
    const churn = back !== undefined && this.frame - back < FRAME_SPIKES.churnFrames;
    const next = this.pages.find((p) => !p.surface);
    if (churn && next) this.ensureSurface(next);
    // Refill with older sheets only up to the headroom line, so the next new sheets land
    // in free space instead of each forcing another repack and full upload.
    const limit = this.size * (1 - ATLAS.headroom);
    for (const sheet of rest) if (!this.fit(sheet, limit, false)) break;
    for (const [sheet] of entries) if (!this.slots.has(sheet)) this.dropped.set(sheet, this.frame);
    this.lastUsed.clear();
    this.generation++;
  }

  /** Empty every open page (each uploads in full next time); the first is always open. */
  private clearPages(): void {
    this.slots.clear();
    for (const page of this.pages) {
      if (!page.surface) continue;
      page.clear();
      page.surface.ctx.clearRect(0, 0, this.size, this.size);
      page.texture.needsUpdate = true;
      page.fullUpload = true;
    }
    this.ensureSurface(this.pages[0]!);
  }

  private warnOnce(why: string): void {
    if (this.warned) return;
    this.warned = true;
    console.warn(`[sprites] mega atlas: ${why}; some sprites are skipped`);
  }
}
