import { OUTER_TEXT } from '../config/strings';
import { OUTER_PROPS } from '../config/outer-ring';
import { WORLD_GAGS } from '../content/world-gags';
import type { World } from '../sim/types';

/**
 * The line an outer-ring piece answers a tap with (R0072, R0129). A piece with its own line
 * says it first and its gag's lines on later taps, in turn; a piece made for a gag goes
 * straight to the gag. Taps are counted per piece for this visit to the page only: nothing
 * is saved, and nothing ever asks to be tapped again. A Learning Grove reads `childLines`.
 */
const taps = new Map<string, number>();

export function outerLine(pickId: string, world: World): string | null {
  const piece = OUTER_PROPS.find((p) => `outer:${p.id}` === pickId);
  if (!piece?.tap) return null;
  const n = taps.get(piece.id) ?? 0;
  taps.set(piece.id, n + 1);
  const gag = WORLD_GAGS.find((g) => g.piece === piece.id);
  const own = piece.tap === 'gag' ? null : OUTER_TEXT.tap[piece.tap];
  if (!gag || gag.lines.length === 0) return own;
  const lines = own ? [own, ...gag.lines.map((l) => l.text)] : gag.lines.map((l) => l.text);
  const i = n % lines.length;
  const gi = own ? i - 1 : i;
  if (gi >= 0 && world.edu) return gag.childLines[`${gag.id}#${gi}`] ?? lines[i]!;
  return lines[i]!;
}
