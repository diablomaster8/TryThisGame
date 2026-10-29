import { JEWEL_COLORS } from './chao';
import { C } from './palette';

export interface EggPalette {
  shell: number;
  shade: number;
  cap: number;
  spot: number;
}

/**
 * The plain egg colours by name. 'plain' is the Chao's default pale egg with a soft blue cap.
 * Kept apart from `egg.ts` so the eggshell hat (`cosmetic-pixel.ts`, `render3d/dress.ts`)
 * can read them without pulling the egg sheets into the creature drawer.
 */
export const PLAIN_EGG_PALETTES: Record<string, EggPalette> = {
  plain: { shell: C.pale, shade: C.lilacGrey, cap: C.shallows, spot: C.white },
  sky: { shell: C.shallows, shade: C.water, cap: C.white, spot: C.pale },
  rose: { shell: C.blush, shade: C.rose, cap: C.white, spot: C.pale },
  mint: { shell: C.mint, shade: C.teal, cap: C.cream, spot: C.pale },
  gold: { shell: C.sunYellow, shade: C.orange, cap: C.cream, spot: C.white },
  violet: { shell: C.lavender, shade: C.violet, cap: C.pale, spot: C.white },
};

/** One egg colour's palette: a plain colour, else a jewel's stone, else the plain egg. */
export function eggPalette(name: string): EggPalette {
  const plain = PLAIN_EGG_PALETTES[name];
  if (plain) return plain;
  // Read at call time: chao.ts imports this module's users, so no top-level use of it here.
  const j = JEWEL_COLORS[name];
  if (j) return { shell: j.body, shade: j.shade, cap: j.belly, spot: j.tip };
  return PLAIN_EGG_PALETTES.plain!;
}
