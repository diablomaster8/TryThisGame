import type { Mood } from '../../config/story';
import type { TrainerLook } from '../../sim/trainers';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { frameKey } from './animations';
import { C, shadeOf } from './palette';
import { PixelCanvas } from './pixel-canvas';

/** The Keeper's design grid (keeper.ts's KEEPER_SIZE; not imported, so the modules do not cycle). */
const SIZE = 32;

/**
 * K8: the dialogue portrait's expression layers. A Keeper's face is drawn on the 32 px grid
 * by keeper.ts; for a line with a `mood` the portrait takes one of four faces that differ in
 * SHAPE, not only colour: a smile (a curved mouth, bright eyes), a frown (slanted brows
 * pitched up at the middle, a down-turned mouth), surprise (wide eyes, high brows, a round
 * open mouth) and eyes closed (two arcs and a small calm smile). The layer paints over the
 * eye and mouth region of the front-facing head, so the hat and hair above stay as drawn.
 */
export type Expression = 'smile' | 'frown' | 'surprised' | 'closed';

export const EXPRESSIONS: readonly Expression[] = ['smile', 'frown', 'surprised', 'closed'];

/** The face a line's mood takes; null keeps the idle face. */
export function expressionOf(mood: Mood | undefined): Expression | null {
  switch (mood) {
    case 'happy':
      return 'smile';
    case 'soft':
      return 'closed';
    case 'sad':
    case 'angry':
      return 'frown';
    case 'shock':
      return 'surprised';
    default:
      return null;
  }
}

/** Paint the expression over a front-facing head centred on (cx, cy). */
export function drawFace(
  pc: PixelCanvas,
  cx: number,
  cy: number,
  col: TrainerLook,
  expr: Expression,
): void {
  // Clear the idle eyes, brows and mouth back to skin.
  pc.rect(cx - 3, cy - 2, 6, 5, col.skin);
  const ink = col.outline;
  const brow = shadeOf(col.hair);
  const eye = (ex: number, big: boolean): void => {
    if (big) {
      pc.rect(ex - 0.5, cy - 1, 2, 2, C.white);
      pc.rect(ex, cy - 0.5, 1, 1, ink);
    } else {
      pc.rect(ex - 0.5, cy - 0.5, 1.5, 1.5, C.white);
      pc.dot(ex + 0.5, cy + 0.5, ink);
      pc.dot(ex + 0.5, cy, ink);
    }
  };
  switch (expr) {
    case 'smile':
      eye(cx - 2, false);
      eye(cx + 2, false);
      pc.thinLine(cx - 2.5, cy - 1, cx - 1, cy - 1.5, brow);
      pc.thinLine(cx + 1, cy - 1.5, cx + 2.5, cy - 1, brow);
      // A curve: corners up, the middle low.
      pc.px(cx - 2, cy + 2, ink);
      pc.rect(cx - 1.5, cy + 2.5, 3, 1, ink);
      pc.px(cx + 1, cy + 2, ink);
      break;
    case 'frown':
      eye(cx - 2, false);
      eye(cx + 2, false);
      // Brows pitched up toward the middle.
      pc.thinLine(cx - 2.5, cy - 1.5, cx - 0.5, cy - 2, brow);
      pc.thinLine(cx + 0.5, cy - 2, cx + 2.5, cy - 1.5, brow);
      // A curve: the middle high, the corners down.
      pc.rect(cx - 1, cy + 2, 2, 1, ink);
      pc.px(cx - 2, cy + 2.5, ink);
      pc.px(cx + 1, cy + 2.5, ink);
      break;
    case 'surprised':
      eye(cx - 2, true);
      eye(cx + 2, true);
      pc.thinLine(cx - 2.5, cy - 2, cx - 1, cy - 2, brow);
      pc.thinLine(cx + 1, cy - 2, cx + 2.5, cy - 2, brow);
      pc.rect(cx - 1, cy + 1.5, 2, 2, ink);
      pc.rect(cx - 0.5, cy + 2, 1, 1, C.roseDeep);
      break;
    case 'closed':
      // Two arcs, high in the middle, for the closed lids.
      pc.px(cx - 3, cy, ink);
      pc.rect(cx - 2.5, cy - 0.5, 2, 1, ink);
      pc.px(cx - 0.5, cy, ink);
      pc.px(cx + 1, cy, ink);
      pc.rect(cx + 1.5, cy - 0.5, 2, 1, ink);
      pc.px(cx + 3, cy, ink);
      pc.rect(cx - 1, cy + 2.5, 2, 1, ink);
      break;
  }
}

/**
 * A sheet of the four faces for one Keeper look: `face-smile`, `face-frown`, `face-surprised`
 * and `face-closed`, each a full front, idle frame. `draw` renders the Keeper with the
 * expression (`drawKeeperFrame('front', 'idle', 0, colours, look, expr)`).
 */
export function buildFaceSheet(draw: (expr: Expression) => PixelCanvas): SpriteSheet {
  const atlas = new AtlasBuilder(SIZE, SIZE, 4);
  for (const e of EXPRESSIONS) atlas.add(faceKey(e), draw(e));
  return atlas.build();
}

export const faceKey = (e: Expression): string => `face-${e}`;
/** The plain idle front frame, for the neutral face. */
export const IDLE_KEY = frameKey('idle', 'front', 0);
