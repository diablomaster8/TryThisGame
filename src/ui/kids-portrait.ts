/**
 * Lane E r10, R0696 (KIDS-28): the child's first Nubbin on their Learning Grove tiles (the
 * title's slot row and the `?kids` picker), so a child who can't read finds her own Grove by
 * its face. The save is read and drawn when the browser is idle; until then (and if the save
 * has no Nubbin yet, or can't be read) the tile keeps its animal icon.
 */
import '../kids-r10.css';
import { frameKey } from '../render/sprites/animations';
import { SheetCache } from '../render/sprites/sheets';
import { deserialize } from '../sim/save';
import type { Nubbin } from '../sim/types';
import { slotKey, type SaveSlot } from '../platform/storage';
import { KIDS_R10_TUNING } from '../config/tuning-kids-r10';
import { el } from './dom';

/** Pure: the Nubbin a tile shows, the first hatched one, else the first egg, else none. */
export function firstNubbinOf<T extends Pick<Nubbin, 'stage'>>(nubbins: readonly T[]): T | null {
  return nubbins.find((n) => n.stage !== 'egg') ?? nubbins[0] ?? null;
}

/** Drawn pictures by slot and save time, so going back to the title doesn't redraw them. */
const drawn = new Map<string, HTMLCanvasElement | null>();

function readFirst(slot: SaveSlot): { key: string; nubbin: Nubbin | null } | null {
  try {
    const json = localStorage.getItem(slotKey(slot));
    if (json === null) return null;
    const file = deserialize(json);
    return {
      key: `${slotKey(slot)}:${file.savedAtWallMs}:${json.length}`,
      nubbin: firstNubbinOf(file.world.nubbins),
    };
  } catch {
    return null;
  }
}

function draw(n: Nubbin): HTMLCanvasElement | null {
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
export function showFirstNubbin(slot: SaveSlot, icon: HTMLElement): void {
  whenIdle(() => {
    if (!icon.isConnected) return;
    const first = readFirst(slot);
    if (!first?.nubbin) return;
    let pic = drawn.get(first.key);
    if (pic === undefined) {
      pic = draw(first.nubbin);
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
  });
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
