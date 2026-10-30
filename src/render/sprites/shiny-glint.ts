import type { Nubbin } from '../../sim/types';
import { frameKey, type ClipName } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { CHAO_SIZE, poseFor, shapeFor } from './chao';
import { layout, type ChaoShape } from './layout';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';
import type { DrawnAngle } from './angles';

/**
 * The pixel shiny glint (LOOK-30): a short white diagonal that sweeps across the head every
 * couple of seconds, so a shiny reads from across the Grove at 1×. It is an overlay drawn
 * from one small shared sheet per head size (never rebuilt per Nubbin), laid over the
 * Nubbin's head from the same layout the sprite was drawn with. The sheet goes into the
 * sprite batch's mega-atlas like every other sheet, so it costs no draw call of its own.
 */
export const SHINY_GLINT = {
  /** One sweep every this many ms; each of the 4 frames shows this long. */
  everyMs: 2000,
  frameMs: 90,
  frames: 4,
};

/** The head box the cell covers, for a head grown by `grow`. */
const cellOf = (grow: number) => ({ w: 2 * (8 + grow) + 1, h: 2 * (7 + grow) + 1 });

/** One sweep frame for a head grown by `grow`, from the front-ish views or the side. */
export function drawShinyGlintFrame(grow: number, view: 'front' | 'side', f: number): PixelCanvas {
  const cell = cellOf(grow);
  // Inset a pixel inside the head's outline, so the streak never runs off the silhouette.
  const rx = (view === 'side' ? 7 + grow : 8 + grow) - 1.5;
  const ry = 7 + grow - 1.5;
  const cx = (cell.w - 1) / 2;
  const cy = (cell.h - 1) / 2;
  const pc = new PixelCanvas(cell.w, cell.h);
  // The '/' diagonal: x + y is constant along it; the sweep moves it left to right across
  // the upper head, where light would catch.
  const k = Math.round(cx + cy - rx * 0.9 + (f * rx * 1.5) / (SHINY_GLINT.frames - 1));
  for (let y = 0; y < cell.h; y++) {
    for (let x = 0; x < cell.w; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      // Above the eyes (they sit a pixel under the head's middle), so the face stays clear.
      if (dx * dx + dy * dy > 1 || y > cy - 2) continue;
      const d = x + y - k;
      if (d === 0 || d === 1) pc.px(x, y, C.white);
      else if (d === 2) pc.px(x, y, C.cream);
    }
  }
  return pc;
}

/** The sweep sheet for one head size: frames `shiny:front|side:<0..3>`. */
export function buildShinyGlintSheet(grow: number): SpriteSheet {
  const cell = cellOf(grow);
  const atlas = new AtlasBuilder(cell.w, cell.h, SHINY_GLINT.frames);
  for (const view of ['front', 'side'] as const) {
    for (let f = 0; f < SHINY_GLINT.frames; f++)
      atlas.add(frameKey('shiny', view, f), drawShinyGlintFrame(grow, view, f));
  }
  return atlas.build();
}

/** The body shape a Nubbin's sprite was drawn with (the same choice as `SheetCache`). */
export function glintShape(n: Nubbin): ChaoShape {
  if (n.stage === 'adult' && n.form) {
    return n.eternal
      ? shapeFor('normal', null, n.eternal !== 'moon', null)
      : shapeFor(n.form.type, n.form.second, false, n.form.band);
  }
  return shapeFor(null, null, false, null);
}

const GLINT_CLIPS = new Set<string>(['idle', 'walk', 'happy', 'love', 'sad', 'eat', 'flap']);
const ANGLES = new Set<string>(['front', 'frontQuarter', 'side']);

export interface GlintPlace {
  /** The overlay's frame key in the glint sheet. */
  key: string;
  /** Offsets in the sprite's own frame, as shares of its width (right) and height (up). */
  right: number;
  up: number;
  /** Size as shares of the sprite's width and height. */
  w: number;
  h: number;
}

/**
 * Where the glint goes for the Nubbin frame `spriteKey` (`clip:angle:index`) at `nowMs`, or
 * null when no sweep is showing (between sweeps, from behind, or in a clip whose head
 * moves too far for the overlay to sit on it). `phase` spreads Nubbins apart in time.
 */
export function glintPlace(
  spriteKey: string,
  shape: ChaoShape,
  nowMs: number,
  phase: number,
  spriteSize = CHAO_SIZE,
): GlintPlace | null {
  const t = (nowMs + phase) % SHINY_GLINT.everyMs;
  const f = Math.floor(t / SHINY_GLINT.frameMs);
  if (f >= SHINY_GLINT.frames) return null;
  const [clip = '', angle = '', index = '0'] = spriteKey.split(':');
  if (!GLINT_CLIPS.has(clip) || !ANGLES.has(angle)) return null;
  const pose = poseFor(clip as ClipName, Number(index));
  const L = layout(angle as DrawnAngle, pose, shape);
  const cell = cellOf(shape.grow);
  return {
    key: frameKey('shiny', angle === 'side' ? 'side' : 'front', f),
    right: (L.headCx + 0.5 - spriteSize / 2) / spriteSize,
    up: (spriteSize - (L.headCy + 0.5 + cell.h / 2)) / spriteSize,
    w: cell.w / spriteSize,
    h: cell.h / spriteSize,
  };
}
