/**
 * LOOK-71 (R0439): where a species' Pixel art comes from. Every species is `generated` (drawn
 * in code) unless `public/sprites/manifest.json` lists it, in which case its hand-drawn sheet
 * (`public/sprites/<id>.json` plus the image it names) replaces the hatched forms' frames.
 * Eggs and cocoons stay generated. Adding a sheet needs no code change: drop the two files in
 * and add the id to the manifest. The format is in `docs/sprite-sheets.md`.
 *
 * Loading is best-effort: a missing or broken file leaves the generated art in place and
 * never throws, and the shipped manifest is empty so a normal load makes one small request.
 */
import { DRAWN_ANGLES } from './angles';
import { CLIPS, CLIP_NAMES, frameKey } from './animations';
import { sheetFromImage, type SpriteSheet } from './atlas';

export type SpriteSource =
  { kind: 'generated' } | { kind: 'sheet'; url: string; frameMap: Record<string, FrameTuple> };

export type FrameTuple = [number, number, number, number];

/** A species sheet file: the image beside it, the cell size and its frames by key. */
export interface SheetFile {
  image: string;
  cell: [number, number];
  frames: Record<string, FrameTuple>;
}

const HAND = new Map<string, SpriteSheet>();
let loading: Promise<void> | null = null;

/** The hand-drawn sheet for a species, once loaded; undefined means draw it in code. */
export function handSheetFor(species: string): SpriteSheet | undefined {
  return HAND.get(species);
}

/** Where a species' art comes from right now. */
export function spriteSourceOf(species: string): SpriteSource['kind'] {
  return HAND.has(species) ? 'sheet' : 'generated';
}

/** For tests and tools: register a sheet as if it had loaded. */
export function registerHandSheet(species: string, sheet: SpriteSheet | null): void {
  if (sheet) HAND.set(species, sheet);
  else HAND.delete(species);
}

/**
 * Fill the clips a sheet leaves out, so every frame the views ask for exists: a missing
 * frame borrows the same clip's first frame at that angle, then the idle frame at that
 * angle, then the front idle, then whatever the sheet has first. Pure, for the tests.
 */
export function completeFrameMap(frames: Record<string, FrameTuple>): Record<string, FrameTuple> {
  const out: Record<string, FrameTuple> = { ...frames };
  const first = Object.values(frames)[0];
  if (!first) return out;
  for (const clip of CLIP_NAMES)
    for (const angle of DRAWN_ANGLES)
      for (let i = 0; i < CLIPS[clip].frames; i++) {
        const k = frameKey(clip, angle, i);
        out[k] ??=
          frames[frameKey(clip, angle, 0)] ??
          frames[frameKey('idle', angle, 0)] ??
          frames[frameKey('idle', 'front', 0)] ??
          first;
      }
  return out;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`sprite image ${url}`));
    img.src = url;
  });
}

async function loadOne(base: string, id: string): Promise<void> {
  const res = await fetch(`${base}sprites/${id}.json`);
  if (!res.ok) return;
  const file = (await res.json()) as Partial<SheetFile>;
  if (!file.image || !file.frames || !Array.isArray(file.cell)) return;
  const img = await loadImage(`${base}sprites/${file.image}`);
  HAND.set(id, sheetFromImage(img, completeFrameMap(file.frames), file.cell[0], file.cell[1]));
}

/** Read the manifest and every sheet it lists, once. Resolves when done, never rejects. */
export function loadHandSheets(base: string): Promise<void> {
  if (typeof fetch !== 'function' || typeof document === 'undefined') return Promise.resolve();
  loading ??= (async () => {
    try {
      const res = await fetch(`${base}sprites/manifest.json`);
      if (!res.ok) return;
      const m = (await res.json()) as { species?: unknown };
      const ids = Array.isArray(m.species) ? m.species.filter((x) => typeof x === 'string') : [];
      await Promise.all(ids.map((id: string) => loadOne(base, id).catch(() => undefined)));
    } catch {
      // No manifest, no network, or a bad file: the generated art stays.
    }
  })();
  return loading;
}
