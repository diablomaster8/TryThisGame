import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { isJewel } from '../../sim/nubbin';
import { JEWEL_COLORS } from './chao';
import { PLAIN_EGG_PALETTES, type EggPalette } from './egg-palette';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

export const EGG_SIZE = 32;

/** Egg colours by name: the plain colours (`egg-palette.ts`) and the jewel eggs. */
export const EGG_PALETTES: Record<string, EggPalette> = {
  ...PLAIN_EGG_PALETTES,
  // The jewel eggs, from the same stones as the Nubbins inside (`JEWEL_COLORS`).
  ...Object.fromEntries(
    Object.entries(JEWEL_COLORS).map(([name, j]) => [
      name,
      { shell: j.body, shade: j.shade, cap: j.belly, spot: j.tip },
    ]),
  ),
};

export type EggFrame = 'idle' | 'wobbleL' | 'wobbleR' | 'crack1' | 'crack2' | 'held';

/** Egg looks by family: the pocket line's eggs cream over green, the digital line's grey with plum spots. */
const FAMILY_EGGS: Record<string, { shell: number; shade: number; cap: number; spot: number }> = {
  pocket: { shell: C.cream, shade: C.sand, cap: C.cream, spot: C.leaf },
  digi: { shell: C.lilacGrey, shade: C.dusk, cap: C.pale, spot: C.plum },
};

export function drawEgg(frame: EggFrame, colorName: string, family = 'chao'): PixelCanvas {
  const pal =
    (family !== 'chao' && colorName === 'plain' ? FAMILY_EGGS[family] : undefined) ??
    EGG_PALETTES[colorName] ??
    EGG_PALETTES.plain!;
  const pc = new PixelCanvas(EGG_SIZE, EGG_SIZE);
  const tilt = frame === 'wobbleL' ? -2 : frame === 'wobbleR' ? 2 : 0;
  const cx = 16 + tilt * 0.5;
  const cy = 20;
  const jewel = isJewel(colorName);
  if (jewel) drawGem(pc, cx, cy, pal);
  else drawShell(pc, cx, cy, tilt, pal, family);
  // A gem cracks in white fracture lines, so the crack shows even on onyx.
  const crack = jewel ? C.white : C.darkPlum;
  if (frame === 'crack1' || frame === 'crack2') {
    pc.line(cx - 2, cy - 7, cx, cy - 3, crack);
    pc.line(cx, cy - 3, cx + 3, cy - 5, crack);
    if (frame === 'crack2') {
      pc.line(cx + 3, cy - 5, cx + 4, cy - 1, crack);
      pc.line(cx - 2, cy - 7, cx - 5, cy - 4, crack);
      pc.px(cx + 1, cy - 2, jewel ? C.white : C.ink);
    }
  }
  pc.finish(C.darkPlum, [C.white]);
  return pc;
}

/** The ordinary egg: a soft shell with a coloured cap and its line's pattern (LOOK-63). */
function drawShell(
  pc: PixelCanvas,
  cx: number,
  cy: number,
  tilt: number,
  pal: EggPalette,
  family: string,
): void {
  // Egg: a taller ellipse, slightly pointed at the top.
  pc.ellipse(cx, cy, 7, 9, pal.shell);
  pc.ellipse(cx, cy - 3, 6, 5, pal.shell);
  pc.ellipse(cx + 2, cy + 2, 5, 6, pal.shade);
  pc.ellipse(cx - 0.5, cy, 5.5, 7.5, pal.shell);
  // The coloured cap near the top.
  pc.ellipse(cx + tilt * 0.4, cy - 6, 4, 2.5, pal.cap);
  // LOOK-63: each line's own pattern. The Chao egg: a band of speckles round the middle.
  // The pocket egg: split in two tones with a band at the seam. The digital egg: a few big
  // spots, as on the original pet's egg.
  if (family === 'digi') {
    pc.disc(cx - 3, cy - 2, 1.8, pal.spot);
    pc.disc(cx + 3, cy + 1, 2.2, pal.spot);
    pc.disc(cx - 2, cy + 5, 1.5, pal.spot);
    pc.disc(cx + 2, cy - 6, 1.2, pal.spot);
  } else if (family === 'pocket') {
    for (let y = cy + 1; y <= cy + 9; y++) {
      const half = Math.sqrt(Math.max(0, 1 - ((y - cy) / 9) ** 2)) * 7 - 1;
      if (half > 0) pc.line(cx - half, y, cx + half - (y > cy + 3 ? 1 : 0), y, pal.spot);
    }
    pc.line(cx - 6, cy, cx + 6, cy, pal.shade);
  } else {
    for (const [dx, dy] of [
      [-5, 1],
      [-3, 0],
      [-1, 1],
      [1, 0],
      [3, 1],
      [5, 0],
      [-2, 2],
      [2, 2],
    ] as const)
      pc.px(cx + dx, cy + dy, pal.spot);
  }
  // Highlight.
  pc.px(cx - 3, cy - 4, C.white);
  pc.px(cx - 4, cy - 3, C.white);
}

/**
 * A jewel egg: the same egg outline cut like a gemstone. A pale crown facet catches the
 * light top-left, the pavilion facets step from body to shade towards the lower right,
 * crisp cut lines run between them, and a hard white star sits on the crown.
 */
function drawGem(pc: PixelCanvas, cx: number, cy: number, pal: EggPalette): void {
  const { shell: body, shade, cap: light, spot: tip } = pal;
  pc.ellipse(cx, cy, 7, 9, body);
  pc.ellipse(cx, cy - 3, 6, 5, body);
  // Crown: two facets meeting under the tip, and the girdle where the crown ends.
  const girdle = cy - 2;
  pc.tri(cx, cy - 9, cx - 6.5, girdle, cx - 0.5, girdle, light);
  pc.tri(cx, cy - 9, cx + 6.5, girdle, cx + 0.5, girdle, body);
  pc.tri(cx - 1.5, cy - 6, cx - 3.5, girdle, cx + 1, girdle, tip);
  // Pavilion: three facets down to the point at the bottom.
  pc.tri(cx - 7, girdle, cx, cy + 9, cx - 2, girdle, body);
  pc.tri(cx - 2, girdle, cx, cy + 9, cx + 3, girdle, light);
  pc.tri(cx + 3, girdle, cx, cy + 9, cx + 7, girdle, shade);
  // Cut lines.
  pc.thinLine(cx - 6.5, girdle, cx + 6.5, girdle, tip);
  pc.thinLine(cx, cy - 9, cx - 6.5, girdle, tip);
  pc.thinLine(cx, cy - 9, cx + 6.5, girdle, light);
  pc.thinLine(cx - 2, girdle, cx, cy + 8.5, tip);
  pc.thinLine(cx + 3, girdle, cx, cy + 8.5, light);
  // The hard glint: a white pixel with a fine four-point star.
  const gx = cx - 4;
  const gy = cy - 4;
  pc.px(gx, gy, C.white);
  pc.dot(gx + 0.5, gy - 1, C.white);
  pc.dot(gx + 0.5, gy + 2, C.white);
  pc.dot(gx - 1, gy + 0.5, C.white);
  pc.dot(gx + 2, gy + 0.5, C.white);
}

export function buildEggSheet(colorName: string, family = 'chao'): SpriteSheet {
  const atlas = new AtlasBuilder(EGG_SIZE, EGG_SIZE, 6);
  const frames: EggFrame[] = ['idle', 'wobbleL', 'wobbleR', 'crack1', 'crack2', 'held'];
  for (const f of frames) atlas.add(frameKey(f, 'front', 0), drawEgg(f, colorName, family));
  return atlas.build();
}

type CocoonKind = 'evolve' | 'rebirth' | 'depart';
type Band = 'sun' | 'moon' | 'neutral';

/** A cocoon's palette (LOOK-25): band-tinted for evolving, warm pink for rebirth, grey-lilac to depart. */
export function cocoonPalette(kind: CocoonKind, band: Band | null = null) {
  if (kind === 'rebirth')
    return {
      body: C.roseLight,
      shade: C.blush,
      thread: C.white,
      glint: C.white,
      outline: C.roseDeep,
    };
  if (kind === 'depart')
    return {
      body: C.pale,
      shade: C.lilacGrey,
      thread: C.white,
      glint: C.white,
      outline: C.lilacGrey,
    };
  if (band === 'sun')
    return {
      body: C.white,
      shade: C.pale,
      thread: C.skyLight,
      glint: C.shallows,
      outline: C.shallows,
    };
  if (band === 'moon')
    return {
      body: C.violet,
      shade: C.moonPurple,
      thread: C.lavender,
      glint: C.violetLight,
      outline: C.darkPlum,
    };
  if (band === 'neutral')
    return { body: C.tealLight, shade: C.mint, thread: C.white, glint: C.white, outline: C.teal };
  return {
    body: C.lavender,
    shade: C.violet,
    thread: C.pale,
    glint: C.white,
    outline: C.moonPurple,
  };
}

/**
 * A cocoon: the Nubbin wrapped up before evolving (tinted by where it is heading), being
 * reborn (warm pink with petal motes rising) or moving on (soft grey-lilac, faded by the
 * view). Given the Nubbin's own front frame as `mask`, the cocoon takes its silhouette,
 * grown by one pixel (LOOK-25); without one it is the old egg-shaped wrap.
 */
export function buildCocoonSheet(
  kind: CocoonKind = 'evolve',
  band: Band | null = null,
  mask: PixelCanvas | null = null,
): SpriteSheet {
  const atlas = new AtlasBuilder(EGG_SIZE, EGG_SIZE, 2);
  const pal = cocoonPalette(kind, band);
  const inside = cocoonMask(mask);
  for (let f = 0; f < 2; f++) {
    const pc = new PixelCanvas(EGG_SIZE, EGG_SIZE);
    const cy = 19;
    if (inside) {
      const at = (x: number, y: number) =>
        x >= 0 && y >= 0 && x < EGG_SIZE && y < EGG_SIZE && inside[y * EGG_SIZE + x] === 1;
      let top = EGG_SIZE;
      for (let y = 0; y < EGG_SIZE; y++)
        for (let x = 0; x < EGG_SIZE; x++) {
          if (!at(x, y)) continue;
          top = Math.min(top, y);
          // Shade the lower-right edge, then wind diagonal threads round the body.
          const edge = !at(x + 2, y) || !at(x, y + 2) || !at(x + 1, y + 1);
          const thread = (x + y + f * 2) % 5 === 0;
          pc.px(x, y, thread ? pal.thread : edge ? pal.shade : pal.body);
        }
      for (let x = 0; x < EGG_SIZE; x++)
        if (at(x, top + 2) && at(x + 1, top + 2)) {
          pc.px(x + 1, top + 2, pal.glint);
          pc.px(x + 2, top + 3, pal.glint);
          break;
        }
    } else {
      pc.ellipse(16, cy, 7, 10 - f * 0.5, pal.body);
      pc.ellipse(18, cy + 2, 5, 7, pal.shade);
      pc.ellipse(15.5, cy, 5.5, 8, pal.body);
      for (let i = 0; i < 4; i++) pc.line(10, cy - 6 + i * 4, 22, cy - 8 + i * 4, pal.thread);
      pc.px(13, cy - 6, pal.glint);
      pc.px(12, cy - 5, pal.glint);
    }
    if (kind === 'rebirth') {
      // Petal motes rising round a warm cocoon.
      const s = f === 0 ? 0 : 2;
      pc.px(6, cy - 6 - s, C.blush);
      pc.px(26, cy - 1 - s, C.white);
      pc.px(8, cy + 6 - s, C.roseLight);
      pc.px(24, cy + 7 - s, C.blush);
    } else if (kind === 'evolve' && band === 'sun') {
      // A cyan glint winking on the white wrap.
      pc.px(f === 0 ? 9 : 23, cy - 7, C.shallows);
    }
    pc.finish(pal.outline, [C.white, pal.glint]);
    atlas.add(frameKey('idle', 'front', f), pc);
  }
  return atlas.build();
}

/** The mask's opaque design pixels grown by one (4-neighbour), or null with no mask. */
function cocoonMask(mask: PixelCanvas | null): Uint8Array | null {
  if (!mask) return null;
  const n = EGG_SIZE;
  const src = new Uint8Array(n * n);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (mask.get(x, y) >= 0) src[y * n + x] = 1;
  const out = src.slice();
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      if (src[y * n + x]) continue;
      if (
        (x > 0 && src[y * n + x - 1]) ||
        (x < n - 1 && src[y * n + x + 1]) ||
        (y > 0 && src[(y - 1) * n + x]) ||
        (y < n - 1 && src[(y + 1) * n + x])
      )
        out[y * n + x] = 1;
    }
  return out;
}
