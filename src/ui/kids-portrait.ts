/**
 * Lane E r10, R0696 (KIDS-28): the child's first Nubbin on their Learning Grove tiles (the
 * title's slot row and the `?kids` picker), so a child who can't read finds her own Grove by
 * its face. The save is read and drawn when the browser is idle; until then (and if the save
 * has no Nubbin yet, or can't be read) the tile keeps its animal icon.
 */
// Its stylesheet (kids-r10.css) is imported by main.ts, which keeps it in the entry's CSS.
import { frameKey } from '../render/sprites/animations';
import type { Nubbin } from '../sim/types';
import { slotKey, slotKeyFor, type SaveSlot } from '../platform/storage';
import { KIDS_R10_TUNING } from '../config/tuning-more/kids-screens';
import { el } from './dom';
// R0446 (r12-d3): the save codec and the sprite sheets reach the whole sim, so they load when
// the tile is drawn, not with the title.
type Draw = [typeof import('../sim/save'), typeof import('../render/sprites/sheets')];
let drawMods: Promise<Draw> | undefined;
const loadDraw = (): Promise<Draw> =>
  (drawMods ??= Promise.all([import('../sim/save'), import('../render/sprites/sheets')]).catch(
    (err: unknown) => {
      drawMods = undefined;
      throw err;
    },
  ));

/** Pure: the Nubbin a tile shows, the first hatched one, else the first egg, else none. */
export function firstNubbinOf<T extends Pick<Nubbin, 'stage'>>(nubbins: readonly T[]): T | null {
  return nubbins.find((n) => n.stage !== 'egg') ?? nubbins[0] ?? null;
}

/** Drawn pictures by slot and save time, so going back to the title doesn't redraw them. */
const drawn = new Map<string, HTMLCanvasElement | null>();

function readFirst(
  { deserialize }: Draw[0],
  slot: SaveSlot,
  profile?: string,
): { key: string; nubbin: Nubbin | null } | null {
  try {
    const key = profile ? slotKeyFor(profile, slot) : slotKey(slot);
    const json = localStorage.getItem(key);
    if (json === null) return null;
    const file = deserialize(json);
    return {
      key: `${key}:${file.savedAtWallMs}:${json.length}`,
      nubbin: firstNubbinOf(file.world.nubbins),
    };
  } catch {
    return null;
  }
}

function draw({ SheetCache }: Draw[1], n: Nubbin): HTMLCanvasElement | null {
  const cache = new SheetCache();
  try {
    const sheet = cache.forNubbin(n);
    const rect =
      sheet.frames.get(frameKey('idle', 'front', 0)) ?? sheet.frames.values().next().value;
    if (!rect) return null;
    const px = KIDS_R10_TUNING.portraitPx;
    const c = el('canvas', 'kids-r10-portrait');
    c.width = px;
    c.height = px;
    const ctx = c.getContext('2d');
    if (!ctx) return null;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      sheet.texture.image as HTMLCanvasElement,
      rect.x,
      rect.y,
      rect.w,
      rect.h,
      0,
      0,
      px,
      px,
    );
    return c;
  } catch {
    return null;
  } finally {
    cache.dispose();
  }
}

function copyOf(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = el('canvas', src.className);
  c.width = src.width;
  c.height = src.height;
  c.getContext('2d')?.drawImage(src, 0, 0);
  return c;
}

/**
 * When idle, put the slot's first Nubbin in place of `icon` (an emoji span on the tile).
 * Leaves the icon alone when there is no Nubbin to show or the tile has left the page.
 */
export function showFirstNubbin(slot: SaveSlot, icon: HTMLElement, profile?: string): void {
  whenIdle(() => {
    if (!icon.isConnected) return;
    loadDraw().then(
      ([save, sheets]) => paint(save, sheets, slot, icon, profile),
      () => undefined,
    );
  });
}

function paint(
  save: Draw[0],
  sheets: Draw[1],
  slot: SaveSlot,
  icon: HTMLElement,
  profile?: string,
): void {
  if (!icon.isConnected) return;
  const first = readFirst(save, slot, profile);
  if (!first?.nubbin) return;
  let pic = drawn.get(first.key);
  if (pic === undefined) {
    pic = draw(sheets, first.nubbin);
    drawn.set(first.key, pic);
  }
  if (!pic) return;
  const shown = copyOf(pic);
  shown.setAttribute('aria-hidden', 'true');
  // The animal stays as a small badge on the picture, so siblings' tiles still differ.
  const wrap = el('span', 'kids-r10-pic');
  const badge = el('span', 'kids-r10-badge', icon.textContent ?? '');
  badge.setAttribute('aria-hidden', 'true');
  wrap.append(shown, badge);
  wrap.classList.add(...[...icon.classList].map((c) => `${c}-pic`));
  icon.replaceWith(wrap);
}

function whenIdle(fn: () => void): void {
  const ric = (
    window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (ric) ric(fn, { timeout: KIDS_R10_TUNING.portraitIdleMs });
  else window.setTimeout(fn, 50);
}
