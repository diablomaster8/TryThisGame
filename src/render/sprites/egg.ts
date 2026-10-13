import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

export const EGG_SIZE = 32;

/** Egg colours by name. 'plain' is the Chao's default pale egg with a soft blue cap. */
export const EGG_PALETTES: Record<
  string,
  { shell: number; shade: number; cap: number; spot: number }
> = {
  plain: { shell: C.pale, shade: C.lilacGrey, cap: C.shallows, spot: C.white },
  sky: { shell: C.shallows, shade: C.water, cap: C.white, spot: C.pale },
  rose: { shell: C.blush, shade: C.rose, cap: C.white, spot: C.pale },
  mint: { shell: C.mint, shade: C.teal, cap: C.cream, spot: C.pale },
  gold: { shell: C.sunYellow, shade: C.orange, cap: C.cream, spot: C.white },
  violet: { shell: C.lavender, shade: C.violet, cap: C.pale, spot: C.white },
};

export type EggFrame = 'idle' | 'wobbleL' | 'wobbleR' | 'crack1' | 'crack2' | 'held';

/** Egg looks by family: the pocket line's eggs are cream with green spots, the digital line's grey and striped. */
const FAMILY_EGGS: Record<string, { shell: number; shade: number; cap: number; spot: number }> = {
  pocket: { shell: C.cream, shade: C.sand, cap: C.cream, spot: C.leaf },
  digi: { shell: C.lilacGrey, shade: C.dusk, cap: C.pale, spot: C.plum },
};

function drawEgg(frame: EggFrame, colorName: string, family = 'chao'): PixelCanvas {
  const pal =
    (family !== 'chao' && colorName === 'plain' ? FAMILY_EGGS[family] : undefined) ??
    EGG_PALETTES[colorName] ??
    EGG_PALETTES.plain!;
  const pc = new PixelCanvas(EGG_SIZE, EGG_SIZE);
  const tilt = frame === 'wobbleL' ? -2 : frame === 'wobbleR' ? 2 : 0;
  const cx = 16 + tilt * 0.5;
  const cy = 20;
  // Egg: a taller ellipse, slightly pointed at the top.
  pc.ellipse(cx, cy, 7, 9, pal.shell);
  pc.ellipse(cx, cy - 3, 6, 5, pal.shell);
  pc.ellipse(cx + 2, cy + 2, 5, 6, pal.shade);
  pc.ellipse(cx - 0.5, cy, 5.5, 7.5, pal.shell);
  // The coloured cap near the top.
  pc.ellipse(cx + tilt * 0.4, cy - 6, 4, 2.5, pal.cap);
  // Spots, or stripes for the digital line.
  if (family === 'digi') {
    for (let i = -1; i <= 1; i++) pc.line(cx - 5, cy + i * 4, cx + 5, cy + i * 4 - 2, pal.spot);
  } else {
    pc.disc(cx - 3, cy + 1, family === 'pocket' ? 1.4 : 0.6, pal.spot);
    pc.disc(cx + 2, cy - 1, family === 'pocket' ? 1.4 : 0.6, pal.spot);
    pc.px(cx + 3, cy + 4, pal.spot);
    pc.px(cx - 4, cy + 4, pal.spot);
  }
  // Highlight.
  pc.px(cx - 3, cy - 4, C.white);
  pc.px(cx - 4, cy - 3, C.white);

  if (frame === 'crack1' || frame === 'crack2') {
    pc.line(cx - 2, cy - 7, cx, cy - 3, C.darkPlum);
    pc.line(cx, cy - 3, cx + 3, cy - 5, C.darkPlum);
    if (frame === 'crack2') {
      pc.line(cx + 3, cy - 5, cx + 4, cy - 1, C.darkPlum);
      pc.line(cx - 2, cy - 7, cx - 5, cy - 4, C.darkPlum);
      pc.px(cx + 1, cy - 2, C.ink);
    }
  }
  pc.outline(C.darkPlum);
  return pc;
}

export function buildEggSheet(colorName: string, family = 'chao'): SpriteSheet {
  const atlas = new AtlasBuilder(EGG_SIZE, EGG_SIZE, 6);
  const frames: EggFrame[] = ['idle', 'wobbleL', 'wobbleR', 'crack1', 'crack2', 'held'];
  for (const f of frames) atlas.add(frameKey(f, 'front', 0), drawEgg(f, colorName, family));
  return atlas.build();
}

/**
 * A cocoon: the Nubbin wrapped up before evolving (lavender), being reborn (a warm
 * glow) or moving on (pale and soft, faded by the view).
 */
export function buildCocoonSheet(kind: 'evolve' | 'rebirth' | 'depart' = 'evolve'): SpriteSheet {
  const atlas = new AtlasBuilder(EGG_SIZE, EGG_SIZE, 2);
  const pal =
    kind === 'rebirth'
      ? { body: C.sunYellow, shade: C.orange, thread: C.cream, glint: C.white, outline: C.orange }
      : kind === 'depart'
        ? {
            body: C.pale,
            shade: C.lilacGrey,
            thread: C.white,
            glint: C.white,
            outline: C.lilacGrey,
          }
        : {
            body: C.lavender,
            shade: C.violet,
            thread: C.pale,
            glint: C.white,
            outline: C.moonPurple,
          };
  for (let f = 0; f < 2; f++) {
    const pc = new PixelCanvas(EGG_SIZE, EGG_SIZE);
    const cy = 19;
    pc.ellipse(16, cy, 7, 10 - f * 0.5, pal.body);
    pc.ellipse(18, cy + 2, 5, 7, pal.shade);
    pc.ellipse(15.5, cy, 5.5, 8, pal.body);
    for (let i = 0; i < 4; i++) pc.line(10, cy - 6 + i * 4, 22, cy - 8 + i * 4, pal.thread);
    pc.px(13, cy - 6, pal.glint);
    pc.px(12, cy - 5, pal.glint);
    if (kind === 'rebirth') {
      // Sparkles around a glowing cocoon.
      const s = f === 0 ? 0 : 1;
      pc.px(6 + s, cy - 8, C.white);
      pc.px(26 - s, cy - 3, C.white);
      pc.px(8, cy + 7 + s, C.cream);
      pc.px(24 + s, cy + 9, C.cream);
    }
    pc.outline(pal.outline);
    atlas.add(frameKey('idle', 'front', f), pc);
  }
  return atlas.build();
}
