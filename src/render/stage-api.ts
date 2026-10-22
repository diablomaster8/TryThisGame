/**
 * What both renderers hand the story dressings beyond the first pass's ctx (campaign
 * graphics 2, wave 0): the HUD-safe screen area (`safeRect`), and a building registry the
 * dressings can list, hide and fade (`BuildingRegistry`). The registry is render-only
 * state: hiding a building never touches the world, and a building hidden here still stands
 * in the sim (Keepers and Nubbins still walk round it).
 */
import { Vector3, type Camera } from 'three';

/** A screen rectangle in CSS pixels, viewport coordinates (y down). */
export interface ScreenRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The viewport the game is drawn into: the `#game` element, else the window. */
export function viewRect(): ScreenRect {
  if (typeof document === 'undefined') return { x: 0, y: 0, w: 1, h: 1 };
  const host = document.getElementById('game');
  const r = host?.getBoundingClientRect();
  if (r && r.width > 0 && r.height > 0) return { x: r.left, y: r.top, w: r.width, h: r.height };
  return { x: 0, y: 0, w: window.innerWidth || 1, h: window.innerHeight || 1 };
}

const shownRect = (e: Element | null): DOMRect | null => {
  if (!e) return null;
  const r = e.getBoundingClientRect();
  return r.width > 0 && r.height > 0 ? r : null;
};

/**
 * The part of the view clear of the HUD (H4): below the top bar and above the dialogue
 * box (and the phone's bottom action bar). Read from the DOM each call; without a DOM it
 * is the whole view. Never less than 40% of the view's height, so a tall HUD on a small
 * phone still leaves a frame to fit into.
 */
export function safeRect(): ScreenRect {
  const v = viewRect();
  if (typeof document === 'undefined') return v;
  let top = v.y;
  let bottom = v.y + v.h;
  const bar = shownRect(document.querySelector('.topbar'));
  if (bar && bar.bottom < v.y + v.h * 0.5) top = Math.max(top, bar.bottom + 4);
  const dialogue = document.querySelector('.dialogue');
  const box =
    dialogue && !(dialogue as HTMLElement).hidden
      ? shownRect(document.querySelector('.dialogue-box'))
      : null;
  if (box && box.top > v.y + v.h * 0.4) bottom = Math.min(bottom, box.top - 4);
  const actions = shownRect(document.querySelector('.actionbar'));
  if (actions && actions.top > v.y + v.h * 0.6) bottom = Math.min(bottom, actions.top - 4);
  const minH = v.h * 0.4;
  if (bottom - top < minH) {
    const mid = (top + bottom) / 2;
    top = Math.max(v.y, mid - minH / 2);
    bottom = Math.min(v.y + v.h, top + minH);
  }
  return { x: v.x, y: top, w: v.w, h: bottom - top };
}

/** One building as a dressing sees it. */
export interface StageBuilding {
  /** The building's id: `cottage`, `school`, `dojo`, `windmill`, `well`, `cave`, `nursery`… */
  id: string;
  /** What it is drawn as (pixel: the scenery kind; 3D: the pick kind's id). */
  kind: string;
  x: number;
  z: number;
  /** Pixel only: its sprite's screen rectangle last frame (CSS px), or null if not drawn. */
  rect: ScreenRect | null;
}

/** The buildings API both ctx objects carry (`ctx.buildings`). */
export interface StageBuildings {
  list(): StageBuilding[];
  /** Hide or show a building for as long as the dressing says (render-only). */
  setHidden(id: string, hidden: boolean): void;
  /**
   * Thin a building: 0 is solid, 1 is the occluder fade's full thinning. Pixel draws the
   * sprite with a checkerboard dither inside a screen circle round the framed cast; 3D
   * uses the H9 occluder dither over the building's box.
   */
  setFade(id: string, fade: number): void;
}

interface Entry extends StageBuilding {
  hidden: boolean;
  fade: number;
}

/**
 * A renderer's buildings. The renderer `define`s each building it draws, reads
 * `isHidden`/`fadeOf` when it draws, and sets `stageHidden` from the staged scene (an
 * exclusive stage or a set); dressings use the `StageBuildings` side.
 */
export class BuildingRegistry implements StageBuildings {
  private readonly entries = new Map<string, Entry>();
  /** Hidden by the stage itself (H3's set list, or an exclusive stage's `all`). */
  stageHidden: ReadonlySet<string> = new Set();
  /** An exclusive stage hides every building. */
  stageHidesAll = false;

  define(id: string, kind: string, x: number, z: number): void {
    const e = this.entries.get(id);
    if (e) {
      e.kind = kind;
      e.x = x;
      e.z = z;
    } else this.entries.set(id, { id, kind, x, z, rect: null, hidden: false, fade: 0 });
  }

  setRect(id: string, rect: ScreenRect | null): void {
    const e = this.entries.get(id);
    if (e) e.rect = rect;
  }

  list(): StageBuilding[] {
    return [...this.entries.values()].map(({ id, kind, x, z, rect }) => ({ id, kind, x, z, rect }));
  }

  setHidden(id: string, hidden: boolean): void {
    const e = this.entries.get(id);
    if (e) e.hidden = hidden;
  }

  setFade(id: string, fade: number): void {
    const e = this.entries.get(id);
    if (e) e.fade = Math.max(0, Math.min(1, fade));
  }

  isHidden(id: string): boolean {
    return this.stageHidesAll || this.stageHidden.has(id) || !!this.entries.get(id)?.hidden;
  }

  fadeOf(id: string): number {
    return this.entries.get(id)?.fade ?? 0;
  }

  /** Every id with a fade over zero, and its fade. */
  fades(): Array<[string, number]> {
    const out: Array<[string, number]> = [];
    for (const e of this.entries.values()) if (e.fade > 0) out.push([e.id, e.fade]);
    return out;
  }

  /** Every id hidden now, by the stage or a dressing. */
  hiddenIds(): string[] {
    return [...this.entries.keys()].filter((id) => this.isHidden(id));
  }
}

/** The pixel view's registry: `world-view.ts` fills it as it draws, dressings use it. */
export const PIXEL_BUILDINGS = new BuildingRegistry();

/** The pixel view's camera, set by the WorldView each frame (null before the first). */
export const PIXEL_VIEW: { camera: Camera | null } = { camera: null };

const tmp = new Vector3();

/** Project a world point through `camera` to CSS pixels in the view (null if behind it). */
export function toScreen(camera: Camera | null, x: number, y: number, z: number): Vec2xy | null {
  if (!camera) return null;
  tmp.set(x, y, z).project(camera);
  if (tmp.z > 1 || tmp.z < -1) return null;
  const v = viewRect();
  return { x: v.x + ((tmp.x + 1) / 2) * v.w, y: v.y + ((1 - tmp.y) / 2) * v.h };
}

/** The screen rect (CSS px) round a set of projected world corners, or null. */
export function rectOf(camera: Camera | null, corners: readonly Vector3[]): ScreenRect | null {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const c of corners) {
    const p = toScreen(camera, c.x, c.y, c.z);
    if (!p) return null;
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  return x1 > x0 ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : null;
}

export interface Vec2xy {
  x: number;
  y: number;
}
