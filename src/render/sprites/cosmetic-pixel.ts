import { cosmetic, eggshellColour, type CosmeticColour, type PxOp } from '../../config/cosmetics';
import type { DrawnAngle } from './angles';
import { eggPalette } from './egg-palette';
import type { Layout } from './layout';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * Draws a registry wearable (`config/cosmetics.ts`) from its pixel shape list, so a new hat
 * needs no drawing code. Layers: `behind` is the back slot seen from the front (drawn
 * before the body, which hides its middle), `body` goes over the body (the swim ring), and
 * `over` is the hat pass: the hat, face and neck slots, and the back slot seen from behind.
 */
export type CosmeticLayer = 'behind' | 'body' | 'over';

const BACK_VIEW = new Set<DrawnAngle>(['back', 'backQuarter']);

/** Which layer a slot draws in, for one angle. */
function layerOf(slot: string, angle: DrawnAngle): CosmeticLayer {
  if (slot === 'back') return BACK_VIEW.has(angle) ? 'over' : 'behind';
  if (slot === 'body') return 'body';
  return 'over';
}

/** True when `id` is a registry wearable this drawer draws (not a hand-drawn one). */
export function drawsCosmetic(id: string): boolean {
  const c = cosmetic(id);
  return !!c && !c.bespoke && !!c.px;
}

export function drawCosmetic(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  id: string,
  layer: CosmeticLayer,
): void {
  const c = cosmetic(id);
  if (!c || c.bespoke || !c.px || layerOf(c.slot, angle) !== layer) return;
  const ops = BACK_VIEW.has(angle) ? (c.pxBack ?? c.px) : c.px;
  const side = angle === 'side' ? -1 : 0;
  const [ax, ay] =
    c.slot === 'hat'
      ? [L.headCx + side, L.headCy - L.headRy]
      : c.slot === 'face'
        ? [L.headCx + side, L.headCy]
        : c.slot === 'neck'
          ? [L.headCx, L.headCy + L.headRy]
          : [L.bodyCx, L.bodyCy];
  const shell = eggshellColour(id);
  const egg = shell ? eggPalette(shell) : null;
  const col = (k: CosmeticColour): number => {
    if (k.startsWith('egg.')) {
      const pal = egg ?? eggPalette('plain');
      return pal[k.slice(4) as 'shell' | 'shade' | 'cap' | 'spot'];
    }
    return C[k as keyof typeof C];
  };
  for (const op of ops) drawOp(pc, op, ax, ay, col);
}

function drawOp(
  pc: PixelCanvas,
  op: PxOp,
  x: number,
  y: number,
  col: (k: CosmeticColour) => number,
): void {
  switch (op[0]) {
    case 'ellipse':
      pc.ellipse(x + op[1], y + op[2], op[3], op[4], col(op[5]));
      return;
    case 'rect':
      pc.rect(x + op[1], y + op[2], op[3], op[4], col(op[5]));
      return;
    case 'tri':
      pc.tri(x + op[1], y + op[2], x + op[3], y + op[4], x + op[5], y + op[6], col(op[7]));
      return;
    case 'disc':
      pc.disc(x + op[1], y + op[2], op[3], col(op[4]));
      return;
    case 'px':
      pc.px(x + op[1], y + op[2], col(op[3]));
      return;
    case 'line':
      pc.line(x + op[1], y + op[2], x + op[3], y + op[4], col(op[5]));
      return;
  }
}
