import { frameKey } from './animations';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';
import type { Reaction } from '../../sim/types';

export const EMOTE_SIZE = 12;

/**
 * The emote ball that floats above a Chao's head. Its shape is the mood: a plain ball,
 * a heart, a spiral, an exclamation mark, a question mark. Sun forms carry a halo ring,
 * Moon forms a spiked ball. Sleep shows a Z.
 */
export type EmoteShape =
  | 'ball'
  | 'heart'
  | 'spiral'
  | 'exclaim'
  | 'question'
  | 'halo'
  | 'spiky'
  | 'zz'
  | 'star'
  | 'fruit'
  // Lane A r8: a cross grey puff (a grumpy refusal, a harrumph) and a note (a song, a hum).
  | 'puff'
  | 'note'
  // Lane A r10 (R0548, R0540): moods, the chat's topic pictures and the families' signs.
  | 'drop'
  | 'bulb'
  | 'dots'
  | 'sparkle'
  | 'smirk'
  | 'zzbig'
  | 'droop'
  | 'toyball'
  | 'keeper'
  | 'cloud'
  | 'pspark'
  | 'dblink'
  | 'none';
export const EMOTE_SHAPES: readonly EmoteShape[] = [
  'ball',
  'heart',
  'spiral',
  'exclaim',
  'question',
  'halo',
  'spiky',
  'zz',
  'star',
  'fruit',
  'puff',
  'note',
  'drop',
  'bulb',
  'dots',
  'sparkle',
  'smirk',
  'zzbig',
  'droop',
  'toyball',
  'keeper',
  'cloud',
  'pspark',
  'dblink',
];

function drawEmote(shape: EmoteShape, frame: number, tint: number): PixelCanvas {
  const pc = new PixelCanvas(EMOTE_SIZE, EMOTE_SIZE);
  const bob = frame === 1 ? 1 : 0;
  const cx = 6;
  const cy = 6 + bob;
  switch (shape) {
    case 'ball':
      // The neutral ball is a saturated yellow with a darker rim (LOOK-17); a tinted sheet keeps its tint.
      pc.disc(cx, cy, 2.6, tint === C.sunYellow ? C.sunDeep : tint);
      pc.disc(cx - 0.3, cy - 0.3, 2.1, tint);
      pc.px(cx - 1, cy - 1, tint === C.sunYellow ? C.sunLight : C.white);
      break;
    case 'heart':
      pc.disc(cx - 1.5, cy - 1, 1.8, C.rose);
      pc.disc(cx + 1.5, cy - 1, 1.8, C.rose);
      pc.tri(cx - 3.5, cy - 0.5, cx + 3.5, cy - 0.5, cx, cy + 4, C.rose);
      pc.px(cx - 2, cy - 2, C.blush);
      break;
    case 'spiral':
      pc.disc(cx, cy, 3.2, tint);
      pc.px(cx, cy, C.darkPlum);
      pc.px(cx + 1, cy, C.darkPlum);
      pc.px(cx + 1, cy + 1, C.darkPlum);
      pc.px(cx, cy + 1, C.darkPlum);
      pc.px(cx - 1, cy + 1, C.darkPlum);
      pc.px(cx - 1, cy, C.darkPlum);
      pc.px(cx - 1, cy - 1, C.darkPlum);
      pc.px(cx, cy - 2, C.darkPlum);
      pc.px(cx + 1, cy - 2, C.darkPlum);
      pc.px(cx + 2, cy - 1, C.darkPlum);
      pc.px(cx + 2, cy + 1, C.darkPlum);
      break;
    case 'fruit':
      // TECH-01: a new hatchling's first wish, a red apple with a leaf.
      pc.disc(cx, cy + 0.5, 3.2, C.roseDeep);
      pc.disc(cx - 0.3, cy + 0.2, 2.6, C.rose);
      pc.px(cx - 1, cy - 1, C.blush);
      pc.rect(cx, cy - 4, 1, 2, C.darkBark);
      pc.rect(cx + 1, cy - 4, 2, 1, C.leaf);
      break;
    case 'exclaim':
      pc.rect(cx - 1, cy - 4, 2, 5, C.ember);
      pc.rect(cx - 1, cy + 2, 2, 2, C.ember);
      break;
    case 'question':
      pc.rect(cx - 2, cy - 4, 4, 1, tint);
      pc.rect(cx + 1, cy - 3, 1, 2, tint);
      pc.rect(cx - 1, cy - 1, 3, 1, tint);
      pc.rect(cx - 1, cy, 1, 2, tint);
      pc.rect(cx - 1, cy + 3, 1, 1, tint);
      break;
    case 'halo':
      // A ring, not a disc (LOOK-17): a gold rim round a pale cyan band, open in the middle.
      pc.ellipse(cx, cy, 4.5, 2, C.sunDeep);
      pc.ellipse(cx, cy, 3.8, 1.4, C.skyLight);
      for (let x = -2; x <= 2; x++) pc.erase(cx + x, cy);
      for (let x = -1; x <= 1; x++) pc.erase(cx + x, cy - 1);
      break;
    case 'spiky':
      // A deep purple core with eight red-tipped spikes (LOOK-17).
      pc.disc(cx, cy, 2.4, C.darkPlum);
      for (const [dx, dy] of [
        [0, -4],
        [4, 0],
        [0, 4],
        [-4, 0],
        [3, -3],
        [-3, -3],
        [3, 3],
        [-3, 3],
      ] as const) {
        pc.line(cx, cy, cx + dx, cy + dy, C.plum);
        pc.px(cx + dx, cy + dy, C.berry);
      }
      pc.px(cx - 1, cy - 1, C.violet);
      break;
    case 'zz':
      pc.line(cx - 2, cy - 3, cx + 1, cy - 3, C.pale);
      pc.line(cx + 1, cy - 3, cx - 2, cy, C.pale);
      pc.line(cx - 2, cy, cx + 1, cy, C.pale);
      pc.line(cx + 1, cy + 1, cx + 4, cy + 1, C.pale);
      pc.line(cx + 4, cy + 1, cx + 1, cy + 4, C.pale);
      pc.line(cx + 1, cy + 4, cx + 4, cy + 4, C.pale);
      break;
    case 'star':
      // The Eternal Neutral's silver star.
      pc.line(cx, cy - 4, cx, cy + 4, C.pale);
      pc.line(cx - 4, cy, cx + 4, cy, C.pale);
      pc.line(cx - 2, cy - 2, cx + 2, cy + 2, C.lilacGrey);
      pc.line(cx - 2, cy + 2, cx + 2, cy - 2, C.lilacGrey);
      pc.px(cx, cy, C.white);
      break;
    case 'puff':
      // Three grey lumps blown out sideways: a huff.
      pc.disc(cx - 2, cy + 1, 2.2, C.greyLight);
      pc.disc(cx + 1, cy - 1, 2.6, C.greyLight);
      pc.disc(cx + 3, cy + 2, 1.8, C.greyLight);
      pc.px(cx, cy - 2, C.white);
      pc.px(cx - 3, cy + 1, C.greyDeep);
      break;
    case 'note':
      // A quaver: a round head and a flagged stem.
      pc.disc(cx - 1.5, cy + 2.5, 1.8, C.violet);
      pc.rect(cx, cy - 4, 1, 7, C.violet);
      pc.rect(cx + 1, cy - 4, 2, 1, C.violet);
      pc.rect(cx + 2, cy - 3, 1, 2, C.violet);
      break;
    case 'drop':
      // A bead of nervous sweat.
      pc.disc(cx, cy + 1.5, 2.6, C.skyDeep);
      pc.tri(cx - 2, cy, cx + 2, cy, cx, cy - 4, C.skyDeep);
      pc.disc(cx - 0.4, cy + 1.2, 1.8, C.skyLight);
      pc.px(cx - 1, cy + 1, C.white);
      break;
    case 'bulb':
      // A light bulb: an idea, or something worth a look.
      pc.disc(cx, cy - 1, 3.2, C.sunYellow);
      pc.px(cx - 1, cy - 2, C.white);
      pc.rect(cx - 1, cy + 2, 3, 2, C.greyLight);
      pc.rect(cx - 1, cy + 3, 3, 1, C.greyDeep);
      break;
    case 'dots':
      // Thinking (or bored): three dots, the lit one walking along.
      for (let i = 0; i < 3; i++)
        pc.disc(
          cx - 3 + i * 3,
          cy + 1,
          1.1,
          i === frame + 1 || (frame === 0 && i === 0) ? C.white : C.lilacGrey,
        );
      break;
    case 'sparkle':
      // A four-point twinkle and a little one: found it, or the favourite.
      pc.line(cx, cy - 4, cx, cy + 4, C.sunYellow);
      pc.line(cx - 4, cy, cx + 4, cy, C.sunYellow);
      pc.disc(cx, cy, 1.2, C.white);
      pc.px(cx + 3, cy - 3, frame === 0 ? C.white : C.sunLight);
      pc.px(cx - 3, cy + 3, frame === 1 ? C.white : C.sunLight);
      break;
    case 'smirk':
      // A Moon prank: a violet ball with a lopsided grin and one narrowed eye.
      pc.disc(cx, cy, 3.4, C.violet);
      pc.rect(cx - 2, cy - 1, 2, 1, C.darkPlum);
      pc.px(cx + 1, cy - 1, C.darkPlum);
      pc.px(cx + 2, cy - 2, C.darkPlum);
      pc.line(cx - 1, cy + 2, cx + 2, cy + 1, C.white);
      break;
    case 'zzbig':
      // Deep sleep: three Zs, growing.
      pc.line(cx - 4, cy + 2, cx - 2, cy + 2, C.pale);
      pc.line(cx - 2, cy + 2, cx - 4, cy + 4, C.pale);
      pc.line(cx - 4, cy + 4, cx - 2, cy + 4, C.pale);
      pc.line(cx - 1, cy - 1, cx + 2, cy - 1, C.pale);
      pc.line(cx + 2, cy - 1, cx - 1, cy + 2, C.pale);
      pc.line(cx - 1, cy + 2, cx + 2, cy + 2, C.pale);
      pc.line(cx + 1, cy - 5, cx + 5, cy - 5, C.white);
      pc.line(cx + 5, cy - 5, cx + 1, cy - 1, C.white);
      pc.line(cx + 1, cy - 1, cx + 5, cy - 1, C.white);
      break;
    case 'droop':
      // Sad: a soft ball sagging at the bottom, a drip running off it (never a broken heart).
      pc.ellipse(cx, cy + 1, 3.4, 2.6, C.lilacGrey);
      pc.disc(cx - 0.4, cy + 0.6, 1.8, C.pale);
      pc.rect(cx + 2, cy + 3, 1, 2, C.skyDeep);
      break;
    case 'toyball':
      // The chat's toy: a beach ball in two colours.
      pc.disc(cx, cy, 3.4, C.white);
      pc.rect(cx - 3, cy - 1, 7, 2, C.rose);
      pc.px(cx - 1, cy - 2, C.skyLight);
      break;
    case 'keeper':
      // The chat's Keeper: a round face under a hat brim.
      pc.disc(cx, cy + 1, 3, C.cream);
      pc.rect(cx - 4, cy - 2, 9, 1, C.roseDeep);
      pc.rect(cx - 2, cy - 4, 5, 2, C.roseDeep);
      pc.px(cx - 1, cy + 1, C.ink);
      pc.px(cx + 1, cy + 1, C.ink);
      pc.px(cx, cy + 3, C.rose);
      break;
    case 'cloud':
      // The chat's weather: a cloud with a raindrop under it.
      pc.disc(cx - 2, cy, 2.2, C.greyLight);
      pc.disc(cx + 1, cy - 1, 2.8, C.white);
      pc.disc(cx + 3, cy + 1, 1.8, C.greyLight);
      pc.px(cx, cy + 4, C.skyDeep);
      break;
    case 'pspark':
      // The pocket family's content sign: a tiny spark off an ear flick.
      pc.line(cx + 1, cy - 2, cx + 1, cy + 2, frame === 0 ? C.sunYellow : C.sunLight);
      pc.line(cx - 1, cy, cx + 3, cy, frame === 0 ? C.sunYellow : C.sunLight);
      pc.px(cx + 1, cy, C.white);
      break;
    case 'dblink':
      // The digital family's content sign: one green pixel, blinking.
      if (frame === 0) {
        pc.rect(cx - 1, cy - 1, 3, 3, C.leaf);
        pc.px(cx, cy, C.white);
      } else pc.rect(cx, cy, 1, 1, C.leafDeep);
      break;
    case 'none':
      break;
  }
  if (shape !== 'none') pc.outline(C.darkPlum);
  return pc;
}

/** The bubble a reaction shows over the head for a moment; both renderers use it. */
export function bubbleFor(reaction: Reaction): EmoteShape {
  if (reaction === 'love' || reaction === 'happy') return 'heart';
  if (reaction === 'surprised') return 'exclaim';
  if (reaction === 'confused') return 'question';
  return 'spiral';
}

export function buildEmoteSheet(tint: number = C.sunYellow): SpriteSheet {
  const atlas = new AtlasBuilder(EMOTE_SIZE, EMOTE_SIZE, 8);
  for (const shape of EMOTE_SHAPES) {
    for (let f = 0; f < 2; f++) atlas.add(frameKey(shape, 'front', f), drawEmote(shape, f, tint));
  }
  return atlas.build();
}
