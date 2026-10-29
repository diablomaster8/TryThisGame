import type { DyeColor, NubbinType, PartSlot } from '../../sim/types';
import { CLIPS, frameKey, type ClipName } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { drawEternalSign } from './eternal-sign';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { CHILD_SHAPE, layout, type ChaoShape, type Layout } from './layout';
import { C, lightOf, mixHex, nearestIndex, shadeOf } from './palette';
import { drawArmPart, drawBack, drawEars, drawTail, partStyle, type PartStyle } from './parts';
import { PixelCanvas } from './pixel-canvas';
import { drawCosmetic } from './cosmetic-pixel';
import { ditherGlass, metalColors } from './finish-pixel';

/**
 * The Nubbin, drawn Chao-faithfully from memory: a big round head that is most of the
 * creature, a swept-back point on the crown, a small round body, stubby arms, little
 * feet, two small wings on the back, and big dark eyes. The emote ball floats above as
 * its own sprite (see emote.ts) so moods change without rebuilding the sheet.
 *
 * Adults differ by type (fins, bigger wings, longer legs, bigger arms) and carry critter
 * parts in four slots. Frames are 32×32 with the feet on row 30. Parts render in
 * back-to-front order so the same code serves all five drawn angles.
 */

export const CHAO_SIZE = 32;

export interface ChaoColors {
  body: number;
  shade: number;
  belly: number;
  tip: number;
  tipShade: number;
  wing: number;
  eye: number;
  glint: number;
  outline: number;
  /** A second evolution's tell colour (see `ChaoShape.tellType`); unset otherwise. */
  tell?: number;
  /** The belly patch colour, set only on a look that wears one (two-tone); unset is no patch. */
  bellyPatch?: number;
  /** A one-pixel rim on the head's lit (upper-left) side, the Moon forms' type hue. */
  rim?: number;
}

export const CHILD_NEUTRAL: ChaoColors = {
  body: C.shallows,
  shade: C.water,
  belly: C.pale,
  tip: C.sunYellow,
  tipShade: C.orange,
  // The same pale cream the 3D child wears (LOOK-13).
  wing: C.cream,
  eye: C.ink,
  glint: C.white,
  outline: C.darkPlum,
};

export const CHILD_SUN: ChaoColors = {
  ...CHILD_NEUTRAL,
  body: C.pale,
  shade: C.shallows,
  belly: C.white,
  tip: C.sunYellow,
  tipShade: C.sunYellow,
  wing: C.white,
};

export const CHILD_MOON: ChaoColors = {
  ...CHILD_NEUTRAL,
  body: C.plum,
  shade: C.darkPlum,
  belly: C.dusk,
  tip: C.rose,
  tipShade: C.berry,
  wing: C.lavender,
  eye: C.ink,
  glint: C.rose,
};

/** Adult palettes by alignment band and type: the 15 first-evolution looks. */
export function adultColors(band: 'sun' | 'moon' | 'neutral', type: string): ChaoColors {
  const base = band === 'sun' ? CHILD_SUN : band === 'moon' ? CHILD_MOON : CHILD_NEUTRAL;
  // Hues after the neutral evolution chart (2026-10-15): Swim green, Fly pink, Run blue,
  // Power orange-red, Normal cyan; Sun forms stay pale with the hue in the shade, Moon
  // forms stay dark with the hue in the body.
  if (band === 'neutral') {
    switch (type) {
      case 'swim':
        return { ...base, body: C.sprout, shade: C.grass, belly: C.cream };
      case 'fly':
        return { ...base, body: C.rose, shade: C.roseDeep, belly: C.roseLight };
      case 'run':
        return { ...base, body: C.water, shade: C.deepWater, belly: C.shallows };
      case 'power':
        return { ...base, body: C.orange, shade: C.ember, belly: C.sand };
      default:
        return { ...base, body: C.mint, shade: C.teal, belly: C.pale };
    }
  }
  if (band === 'sun') {
    switch (type) {
      case 'swim':
        return { ...base, body: C.pale, shade: C.sprout };
      case 'fly':
        return { ...base, body: C.white, shade: C.blush };
      case 'run':
        return { ...base, body: C.pale, shade: C.water };
      case 'power':
        return { ...base, body: C.pale, shade: C.orange };
      default:
        return base;
    }
  }
  // Moon forms (LOOK-48): a lighter shade than ink, and the type hue on the tip, hands and
  // feet and as a one-pixel rim on the head's lit side, so the five read apart at dusk.
  const moon = (body: number, shade: number, tip: number, tipShade: number): ChaoColors => ({
    ...base,
    body,
    shade,
    tip,
    tipShade,
    rim: tip,
  });
  switch (type) {
    case 'swim':
      return moon(C.tealDeep, C.deepGreen, C.teal, C.tealDeep);
    case 'fly':
      return moon(C.moonPurple, C.darkPlum, C.violet, C.violetDeep);
    case 'run':
      return moon(C.nightBlue, C.darkPlum, C.deepWater, C.skyDeep);
    case 'power':
      return moon(C.berry, C.darkPlum, C.rose, C.roseDeep);
    default:
      return { ...base, rim: C.dusk };
  }
}

/**
 * The five type hues, the same as the 3D `TYPE_COLORS` (samples/nubbin-variants.ts; a test
 * keeps the two equal). The pixel palette is mapped from them, nearest colour first.
 */
export const TYPE_HEX: Record<NubbinType, { body: string; shade: string; belly: string }> = {
  normal: { body: '#3ec9d6', shade: '#1a8fa6', belly: '#d2f6ff' },
  swim: { body: '#86d94a', shade: '#3f9a2a', belly: '#e6ffb8' },
  fly: { body: '#ff86c2', shade: '#c84d8f', belly: '#ffd9ec' },
  run: { body: '#3b6cf0', shade: '#1f3db0', belly: '#c0d4ff' },
  power: { body: '#ff6a2a', shade: '#b8360e', belly: '#ffd2a6' },
};

/**
 * A second evolution's palette, after the 3D recipe (`samples/nubbin-variants-second.ts`):
 * the first type's hue blended 55% toward the second's, through the band's recipe (Neutral
 * wears it, Sun keeps a pale body with the hue on shade and tips, Moon deepens it into the body),
 * and a `tell` colour from the second type for its half-strength tells. Each blend skips the
 * first evolution's own colour, so a second evolution never looks unchanged, Normal included.
 */
export function secondColors(
  band: 'sun' | 'moon' | 'neutral',
  type: NubbinType,
  second: NubbinType,
): ChaoColors {
  const first = adultColors(band, type);
  const a = TYPE_HEX[type];
  const b = TYPE_HEX[second];
  const hue = {
    body: mixHex(a.body, b.body, 0.55),
    shade: mixHex(a.shade, b.shade, 0.55),
    belly: mixHex(a.belly, b.belly, 0.55),
  };
  const tellHex = mixHex(b.body, a.body, 0.3);
  const out: ChaoColors = { ...first };
  if (band === 'neutral') {
    out.body = nearestIndex(hue.body, [first.body]);
    out.shade = nearestIndex(hue.shade, [first.shade, out.body]);
    out.belly = nearestIndex(hue.belly, [out.body]);
    out.tell = nearestIndex(tellHex, [out.body]);
  } else if (band === 'sun') {
    // The hue on the shade and, lifted toward white, on the tips (crown, hands and feet).
    out.shade = nearestIndex(hue.body, [first.shade, first.body]);
    out.tip = nearestIndex(mixHex(hue.body, '#ffffff', 0.25), [first.body]);
    out.tipShade = out.shade;
    out.tell = nearestIndex(mixHex(tellHex, '#ffffff', 0.1), [first.body]);
  } else {
    out.body = nearestIndex(mixHex(hue.body, '#000000', 0.4), [
      first.body,
      first.shade,
      C.ink,
      C.darkPlum,
    ]);
    out.tip = nearestIndex(mixHex(hue.body, '#000000', 0.15), [out.body, C.ink]);
    out.tipShade = shadeOf(out.tip);
    out.tell = nearestIndex(mixHex(tellHex, '#000000', 0.25), [out.body, C.ink]);
  }
  return out;
}

/** Body colours by egg colour. The egg's colour is the Nubbin's colour for life. */
export const VARIANT_COLORS: Record<string, { body: number; shade: number; belly: number }> = {
  sky: { body: C.water, shade: C.deepWater, belly: C.shallows },
  rose: { body: C.rose, shade: C.berry, belly: C.blush },
  mint: { body: C.mint, shade: C.teal, belly: C.pale },
  gold: { body: C.sunYellow, shade: C.orange, belly: C.cream },
  violet: { body: C.violet, shade: C.moonPurple, belly: C.lavender },
  // Seasonal eggs: winter frost and autumn ember.
  frost: { body: C.skyLight, shade: C.skyDeep, belly: C.white },
  ember: { body: C.ember, shade: C.berry, belly: C.sunLight },
  // LOOK-31: the rest of the egg palette.
  yellow: { body: C.sunLight, shade: C.sunYellow, belly: C.cream },
  white: { body: C.white, shade: C.greyLight, belly: C.pale },
  brown: { body: C.wood, shade: C.bark, belly: C.sandLight },
  grey: { body: C.greyLight, shade: C.greyDeep, belly: C.pale },
  black: { body: C.dusk, shade: C.darkPlum, belly: C.plum },
  orange: { body: C.orange, shade: C.ember, belly: C.sunLight },
  lime: { body: C.sprout, shade: C.leaf, belly: C.leafLight },
  red: { body: C.ember, shade: C.berry, belly: C.roseLight },
  pearl: { body: C.cream, shade: C.roseLight, belly: C.white },
};

/**
 * The seven jewel eggs (`JEWEL_EGG_COLORS` in sim/nubbin.ts), as near the 3D gem colours
 * (`JEWELS` in samples/nubbin-variants-colour.ts) as the shared palette goes. Ruby sits
 * a step brighter than garnet, as in 3D. A jewel Nubbin keeps its stone for life.
 */
export const JEWEL_COLORS: Record<
  string,
  { body: number; shade: number; belly: number; tip: number }
> = {
  ruby: { body: C.rose, shade: C.berry, belly: C.blush, tip: C.roseLight },
  sapphire: { body: C.deepWater, shade: C.nightBlue, belly: C.shallows, tip: C.skyLight },
  emerald: { body: C.teal, shade: C.tealDeep, belly: C.tealLight, tip: C.skyLight },
  amethyst: { body: C.violet, shade: C.violetDeep, belly: C.lavender, tip: C.violetLight },
  topaz: { body: C.orange, shade: C.sunDeep, belly: C.sunLight, tip: C.cream },
  garnet: { body: C.berry, shade: C.darkPlum, belly: C.rose, tip: C.blush },
  onyx: { body: C.darkPlum, shade: C.ink, belly: C.plum, tip: C.lilacGrey },
  silver: { body: C.greyLight, shade: C.greyDeep, belly: C.white, tip: C.white },
  aquamarine: { body: C.shallows, shade: C.tealDeep, belly: C.skyLight, tip: C.white },
  peridot: { body: C.leafLight, shade: C.leafDeep, belly: C.sprout, tip: C.cream },
};

/**
 * Apply an egg-colour variant to a palette. Coloured Nubbins keep their colour through
 * evolution; Sun forms lighten the belly, Moon forms darken the shade. Two-tone takes the
 * belly and tips from a second colour; shiny brightens the outline and glint.
 */
export function variantColors(
  base: ChaoColors,
  eggColor: string,
  shiny = false,
  tone: string | null = null,
  band: 'sun' | 'moon' | 'neutral' | null = null,
): ChaoColors {
  let out = { ...base };
  // A jewel keeps its stone in every form (no Sun belly or Moon shade), but two-tone and
  // shiny still go on top of it, as the 3D look does (`render3d/looks.ts`, `tint`).
  const j = JEWEL_COLORS[eggColor];
  if (j) {
    const { body, shade, belly, tip } = j;
    out = { ...out, body, shade, belly, tip, tipShade: shade, wing: tip, glint: C.white };
  }
  const v = j ? undefined : VARIANT_COLORS[eggColor];
  if (v) {
    out = { ...out, body: v.body, shade: v.shade, belly: v.belly };
    if (band === 'sun') out.belly = C.white;
    if (band === 'moon') out.shade = C.darkPlum;
  }
  // A two-tone may be a plain colour or a jewel, as in 3D.
  const t = tone ? (VARIANT_COLORS[tone] ?? JEWEL_COLORS[tone]) : undefined;
  if (t) out = { ...out, belly: t.body, bellyPatch: t.body, tip: t.body, tipShade: t.shade };
  if (shiny) out = { ...out, outline: C.white, glint: C.cream, wing: C.white };
  return out;
}

/**
 * The Chaos forms: Eternals. Sun is the angelic white-and-gold look with great wings. Moon
 * and Neutral follow the 3D line-up references (`samples/nubbin-variants-special.ts`, Maor
 * 2026-10-18): Moon dark indigo armour with icy spikes and an ember eye, Neutral flat lime
 * with a yellow-green belly and salmon hands and feet.
 */
export function eternalColors(band: 'sun' | 'moon' | 'neutral'): ChaoColors {
  switch (band) {
    case 'sun':
      return {
        body: C.white,
        shade: C.cream,
        belly: C.white,
        tip: C.sunYellow,
        tipShade: C.orange,
        wing: C.cream,
        eye: C.deepWater,
        glint: C.white,
        outline: C.sand,
      };
    case 'moon':
      return {
        body: C.nightBlue,
        shade: C.darkPlum,
        belly: C.lilacGrey,
        tip: C.nightBlue,
        tipShade: C.darkPlum,
        // No great wings in 3D: the wing slot reads as the icy shoulder spikes.
        wing: C.lavender,
        eye: C.ember,
        glint: C.lavender,
        outline: C.ink,
      };
    default:
      return {
        body: C.grass,
        shade: C.leaf,
        belly: C.sprout,
        tip: C.rose,
        tipShade: C.roseDeep,
        wing: C.grass,
        eye: C.teal,
        glint: C.white,
        outline: C.leafDeep,
      };
  }
}

/** A Shadow Nubbin: ash-grey coat, dark ball, an ember glint in the eye. The grey stays. */
export function shadowColors(base: ChaoColors): ChaoColors {
  return {
    ...base,
    body: C.dusk,
    shade: C.darkPlum,
    belly: C.lilacGrey,
    tip: C.plum,
    tipShade: C.darkPlum,
    wing: C.plum,
    eye: C.ember,
    glint: C.roseLight,
    outline: C.ink,
  };
}

/** Silhouette by type. Second evolutions add a lighter touch of their type. */
/** A part slot's style at the look's part size (smaller on a child, LOOK-66). */
function partFor(look: ChaoLook, id: string | null): PartStyle | null {
  const s = partStyle(id);
  return s && { ...s, k: look.shape.partScale ?? 1 };
}

/** The first evolution's silhouette by type (LOOK-19); Swim keeps its side fins too. */
const FIRST_TELLS: Record<NubbinType, Partial<ChaoShape>> = {
  swim: { crownKind: 'fin', dorsal: true },
  fly: { tufts: true, wingsUp: true },
  run: { crownKind: 'quills', bodyNarrow: 1, lean: 1 },
  power: { horns: true },
  normal: { crownKind: 'full' },
};

export function shapeFor(
  type: NubbinType | null,
  second: NubbinType | null,
  eternal = false,
  band: 'sun' | 'moon' | 'neutral' | null = null,
): ChaoShape {
  if (!type) return CHILD_SHAPE;
  const s: ChaoShape = {
    ...CHILD_SHAPE,
    grow: 1,
    wingScale: eternal ? 2.2 : 1,
    partScale: 1,
    ...(band ? { band } : {}),
  };
  // The first type's silhouette tell, strong enough to sort the 15 by outline alone.
  if (!eternal) Object.assign(s, FIRST_TELLS[type]);
  const apply = (t: NubbinType, k: number) => {
    switch (t) {
      case 'swim':
        s.headFins = Math.max(s.headFins, k === 1 ? 2 : 1);
        break;
      case 'fly':
        s.wingScale = Math.max(s.wingScale, k === 1 ? 2.2 : 1.35);
        break;
      case 'run':
        s.legLength = Math.max(s.legLength, k === 1 ? 3 : 2);
        break;
      case 'power':
        s.bodyWiden = Math.max(s.bodyWiden, k === 1 ? 1 : 0);
        s.handBonus = Math.max(s.handBonus, k === 1 ? 1.8 : 0.6);
        break;
      default:
        break;
    }
  };
  apply(type, 1);
  if (second) {
    // Normal has no silhouette tell of its own: a taller crown stands in for it, so an
    // untrained "–Normal" second evolution still changes shape (review 2026-10-24).
    if (second !== type) apply(second, 0.5);
    s.tellType = second;
    if (second === 'normal') s.crownLift = 2;
  if (eternal && band) s.eternalBand = band;
  }
  return s;
}

export type EyeState = 'open' | 'closed' | 'happy' | 'half' | 'dizzy' | 'wide';
/**
 * The Chao mouth set (LOOK-65): a smile, a big open D when happy, a small `o` when surprised,
 * a wide wail when crying, a munch while eating, a pout (Mischievous), flat asleep.
 */
export type MouthState =
  'smile' | 'flat' | 'open' | 'o' | 'wail' | 'munch' | 'pout' | 'sad' | 'none';
/** `rubA`/`rubB`: both fists at the eyes, crying (LOOK-21); the A hand presses higher. */
export type ArmPose = 'down' | 'up' | 'out' | 'swingA' | 'swingB' | 'rubA' | 'rubB';

export interface ChaoPose {
  /** Whole-body vertical offset in px (negative = up). */
  lift: number;
  /** Squash: 1 = normal, <1 shorter. */
  squash: number;
  /** The waddle's head rock, in px across the body (walk contact frames); 0 when unset. */
  rock?: -1 | 0 | 1;
  /** The walk frame, 0..5, for bodies that move by a wave instead of steps (the serpent). */
  step?: number;
  /** `out`: seated, the legs straight out in front with the soles to the camera (LOOK-20). */
  legs: 'together' | 'stepA' | 'stepB' | 'tucked' | 'out';
  arms: ArmPose;
  eyes: EyeState;
  mouth: MouthState;
  /** Wing flap phase 0 (rest) or 1 (raised). */
  wings: 0 | 1;
  /** Hide the lower body (in water). */
  waterline: boolean;
  /** Head tilt in px for sad and sleep poses. */
  headDrop: number;
  /** Rosy cheeks (the love pose). */
  blush?: boolean;
  /** Quarter turns clockwise, applied to the finished frame (the tumble roll). */
  spin?: number;
  /** Tear drops running from the eyes (the cry clip's second frame). */
  tears?: boolean;
}

const BASE: ChaoPose = {
  lift: 0,
  squash: 1,
  legs: 'together',
  arms: 'down',
  eyes: 'open',
  mouth: 'smile',
  wings: 0,
  waterline: false,
  headDrop: 0,
};

/** Poses per clip frame. */
export function poseFor(clip: ClipName, frame: number): ChaoPose {
  switch (clip) {
    case 'idle': {
      // A slow breath over eight frames, with a blink on the last one.
      const breath = [1, 0.99, 0.97, 0.95, 0.94, 0.95, 0.97, 1] as const;
      return {
        ...BASE,
        squash: breath[frame % 8] ?? 1,
        eyes: frame % 8 === 7 ? 'closed' : 'open',
      };
    }
    case 'walk': {
      // Six frames: contact, push-off and passing for each foot. The passing frames
  /** LOOK-23: the waterline this many px higher (the paddle keeps only the head out). */
  waterRise?: number;
  /** LOOK-23: kick splashes behind the body (the crawl). */
  kick?: boolean;
      // lift the body and stretch it a touch; contact frames squash it.
      const phase = frame % 6;
      const contact = phase === 0 || phase === 3;
      const passing = phase === 2 || phase === 5;
      const left = phase < 3;
      return {
        ...BASE,
        legs: passing ? 'together' : left ? 'stepA' : 'stepB',
        arms: left ? 'swingA' : 'swingB',
        lift: passing ? -2 : contact ? 0 : -1,
        squash: contact ? 0.97 : passing ? 1.02 : 1,
        // The waddle (LOOK-22): on each contact the head rocks a pixel away from the planted foot.
        rock: phase === 0 ? 1 : phase === 3 ? -1 : 0,
        step: phase,
      };
    }
    case 'happy':
      return {
        ...BASE,
        lift: frame === 0 ? -3 : -1,
        arms: 'up',
        eyes: 'happy',
        mouth: 'open',
        wings: frame as 0 | 1,
        legs: 'tucked',
      };
    case 'sad':
      // Crying: the sad mouth opens into a wail on the second frame.
      return {
        ...BASE,
        eyes: 'half',
        mouth: frame === 0 ? 'sad' : 'wail',
        headDrop: frame === 0 ? 1 : 2,
        squash: 0.96,
      };
    case 'sleep':
      return {
        ...BASE,
        eyes: 'closed',
        mouth: 'flat',
        squash: frame === 0 ? 0.9 : 0.93,
        headDrop: 2,
        legs: 'tucked',
      };
    case 'eat':
      return {
        ...BASE,
        mouth: frame === 1 ? 'munch' : 'smile',
        eyes: frame === 2 ? 'happy' : 'open',
        squash: frame === 1 ? 0.96 : 1,
      };
    case 'swim':
      return {
        ...BASE,
        waterline: true,
        arms: frame === 0 ? 'out' : 'up',
        eyes: 'open',
        mouth: 'smile',
        lift: frame === 1 ? -1 : 0,
      };
    case 'flap':
      return {
        ...BASE,
        wings: frame as 0 | 1,
        lift: frame === 1 ? -2 : -1,
        legs: 'tucked',
        arms: 'out',
      };
    case 'love':
      // Eyes squeezed happy, hands up to the cheeks, a little rise and settle, pink cheeks.
      return {
        ...BASE,
        eyes: 'happy',
        mouth: 'smile',
        arms: 'up',
        wings: frame as 0 | 1,
        lift: frame === 0 ? -1 : 0,
        squash: frame === 0 ? 1.02 : 0.97,
        blush: true,
      };
    case 'tumble':
      // Thrown: curled up, eyes wide, rolling a quarter turn a frame.
      return { ...BASE, eyes: 'wide', mouth: 'o', arms: 'out', legs: 'tucked', spin: frame % 4 };
  }
}

/**
 * The cry clip (LOOK-21): the sit base (legs out), both fists at the eyes, the A hand
 * pressing higher each frame, the mouth a wail, and tears in the second frame. Reduced
 * motion keeps the pose; the world view holds frame 0 then.
 */
export function cryPose(frame: number): ChaoPose {
  return {
    ...BASE,
    legs: 'out',
    arms: frame % 2 === 0 ? 'rubA' : 'rubB',
    eyes: 'closed',
    mouth: 'wail',
    headDrop: 1,
    squash: frame % 2 === 0 ? 0.97 : 0.95,
    ...(frame % 2 === 1 ? { tears: true } : {}),
  };
}

/** The cry clip's timing, beside the stock clips (`CLIPS`). */
export const CRY_CLIP = { frames: 2, ms: 260, loop: true } as const;

export interface ChaoLook {
  colors: ChaoColors;
  shape: ChaoShape;
  parts: Record<PartSlot, string | null>;
  /** Hat id from the shop, or null. */
  hat?: string | null;
  /** The metal or glass egg finish (LOOK-31). */
  finish?: 'metal' | 'glass' | null;
  /** Extra sparkles. */
  shiny?: boolean;
  /** A jewel Nubbin's gem finish: cut facets and a hard glint. */
  gem?: boolean;
  /** Accessories: a dyed scarf, glasses, a dyed hat. */
  scarf?: DyeColor | null;
  glasses?: boolean;
  hatDye?: DyeColor | null;
}

/** Palette colour for each dye, and its shade. */
export const DYE_COLORS: Record<DyeColor, number> = {
  rose: C.rose,
  sky: C.water,
  mint: C.mint,
  gold: C.sunYellow,
  violet: C.violet,
  ember: C.ember,
};

/** LOOK-23: the paddle and crawl clips beside the stock `swim` (the breaststroke). */
export const SWIM_CLIPS: Record<string, { frames: number; ms: number; loop: boolean }> = {
  paddle: { frames: 2, ms: 150, loop: true },
  crawl: { frames: 2, ms: 210, loop: true },
};

/** A weak swimmer's dog-paddle (head only out, hands fluttering) or a strong one's crawl. */
export function swimPose(style: 'paddle' | 'crawl', frame: number): ChaoPose {
  return style === 'paddle'
    ? {
        ...BASE,
        waterline: true,
        waterRise: 4,
        arms: frame === 0 ? 'up' : 'out',
        eyes: 'wide',
        mouth: 'open',
        lift: frame === 1 ? -1 : 0,
      }
    : {
        ...BASE,
        waterline: true,
        waterRise: -1,
        arms: frame === 0 ? 'swingA' : 'swingB',
        eyes: 'open',
        mouth: 'smile',
        headDrop: 1,
        lift: 1,
        kick: true,
      };
}

/**
 * Character looks: the Chao that dressed up as other heroes. Each is a palette plus a
 * head accessory, worn like a hat from the roster. Won at race tier 3. The palettes follow
 * the 3D line-up references (`samples/nubbin-variants-lineup.ts`, Maor 2026-10-18).
 */
export const CHARACTER_LOOKS: Record<string, { colors: ChaoColors; label: string }> = {
  'look-fox': {
    label: 'Fox look',
    colors: {
      ...CHILD_NEUTRAL,
      body: C.orange,
      shade: C.sunDeep,
      belly: C.orange,
      tip: C.cream,
      tipShade: C.sandLight,
      wing: C.cream,
      eye: C.nightBlue,
    },
  },
  'look-echidna': {
    label: 'Echidna look',
    colors: {
      ...CHILD_NEUTRAL,
      body: C.berry,
      shade: C.darkPlum,
      belly: C.white,
      bellyPatch: C.white,
      tip: C.white,
      tipShade: C.pale,
      wing: C.berry,
      eye: C.teal,
    },
  },
  'look-rose': {
    label: 'Rose look',
    colors: {
      ...CHILD_NEUTRAL,
      body: C.blush,
      shade: C.rose,
      belly: C.roseLight,
      tip: C.white,
      tipShade: C.roseDeep,
      wing: C.white,
    },
  },
  'look-quills': {
    label: 'Quills look',
    colors: {
      ...CHILD_NEUTRAL,
      body: nearestIndex('#2c58e0'),
      shade: C.nightBlue,
      belly: nearestIndex('#f5c99a'),
      bellyPatch: nearestIndex('#f5c99a'),
      tip: C.white,
      tipShade: C.pale,
      wing: nearestIndex('#2c58e0'),
      eye: C.teal,
    },
  },
  'look-shade': {
    label: 'Shade look',
    colors: {
      ...CHILD_NEUTRAL,
      body: C.darkPlum,
      shade: C.ink,
      belly: C.darkPlum,
      tip: C.white,
      tipShade: C.pale,
      wing: C.darkPlum,
      eye: C.ink,
    },
  },
  'look-dream': {
    label: 'Dream look',
    colors: {
      ...CHILD_NEUTRAL,
      body: C.roseDeep,
      shade: C.moonPurple,
      belly: C.roseDeep,
      tip: C.sunYellow,
      tipShade: C.sunDeep,
      wing: C.roseDeep,
      eye: C.darkPlum,
    },
  },
};

/** Hats sit on the crown. Five styles plus the character accessories. */
function drawHat(pc: PixelCanvas, angle: DrawnAngle, L: Layout, hat: string): void {
  const top = L.headCy - L.headRy;
  const cx = L.headCx + (angle === 'side' ? -1 : 0);
  switch (hat) {
    case 'look-fox':
      // A black hood over the crown, its rim framing the face.
      pc.ellipse(cx, top + 2, 8, 4.5, C.ink);
      pc.rect(cx - 8, top + 3, 17, 2, C.ink);
      pc.thinLine(cx - 4, top - 1, cx + 3, top - 1, C.darkPlum);
      // Twin fluffy tails fanned out behind, white at the tips (LOOK-28).
      if (angle !== 'back' && angle !== 'backQuarter') {
        pc.ellipse(cx + 9, L.bodyCy - 2, 2.5, 3.5, C.orange);
        pc.ellipse(cx + 11, L.bodyCy + 1, 2.5, 3.5, C.orange);
        pc.disc(cx + 10, L.bodyCy - 5, 1.3, C.white);
        pc.disc(cx + 13, L.bodyCy - 1, 1.3, C.white);
      } else {
        pc.ellipse(cx - 2, L.bodyCy, 2.5, 3.5, C.orange);
        pc.ellipse(cx + 2, L.bodyCy, 2.5, 3.5, C.orange);
        pc.disc(cx - 3, L.bodyCy - 3, 1.3, C.white);
        pc.disc(cx + 3, L.bodyCy - 3, 1.3, C.white);
      }
      break;
    case 'look-echidna':
      // The line-up figure's white spikes, standing up round the crown.
      for (const dx of [-6, -3, 3, 6]) {
        pc.tri(cx + dx - 1.5, top + 3, cx + dx + 1.5, top + 3, cx + dx * 1.3, top - 3, C.white);
        pc.px(cx + dx * 1.3, top - 2, C.pale);
      }
      // The line-up's huge white ears and the green dot on the white belly patch.
      pc.ellipse(cx - L.headRx + 1, top + 4, 2, 3, C.white);
      pc.ellipse(cx + L.headRx - 1, top + 4, 2, 3, C.white);
      if (angle === 'front' || angle === 'frontQuarter') pc.px(L.bodyCx, L.bodyCy + 1, C.leaf);
      break;
    case 'look-rose':
      // A red headband with a bow.
      pc.rect(cx - 7, top + 1, 15, 2, C.ember);
      pc.disc(cx + 6, top, 2, C.ember);
      pc.disc(cx + 9, top + 1, 1.6, C.ember);
      pc.px(cx + 7, top, C.cream);
      break;
    case 'look-dream':
      // The line-up figure: a gold horn on the onion dome, tiny ear points, a dark belly centre.
      pc.tri(cx - 1.5, top + 2, cx + 1.5, top + 2, cx + 1, top - 4, C.sunYellow);
      pc.px(cx, top, C.sunDeep);
      pc.tri(cx - 7, top + 4, cx - 5, top + 4, cx - 7, top + 1, C.roseDeep);
      pc.tri(cx + 5, top + 4, cx + 7, top + 4, cx + 7, top + 1, C.roseDeep);
      if (angle === 'front' || angle === 'frontQuarter')
        pc.ellipse(L.bodyCx, L.bodyCy + 1, 2, 1.6, C.moonPurple);
      break;
    case 'look-quills': {
      // Five navy quills swept back round the crown.
      const navy = nearestIndex('#2443c4');
      for (const dx of [-7, -4, 0, 4, 7]) {
        pc.tri(
          cx + dx - 2,
          top + 4,
          cx + dx + 2,
          top + 4,
          cx + dx * 1.6,
          top - 3 + Math.abs(dx) / 2,
          navy,
        );
      }
      break;
    }
    case 'look-shade':
      // Tall pointed ears with grey insides, white spikes behind, a white collar with a lilac diamond.
      for (const d of [-1, 1]) {
        const ex = cx + d * 5;
        pc.tri(ex - 2.5, top + 3, ex + 2.5, top + 3, ex + d, top - 6, C.darkPlum);
        pc.tri(ex - 1, top + 2, ex + 1, top + 2, ex + d * 0.6, top - 3, nearestIndex('#8c8a96'));
      }
      pc.tri(cx - 1, top + 2, cx + 1, top + 2, cx, top - 4, C.white);
      if (angle !== 'back') {
        pc.rect(L.bodyCx - 4, L.headCy + L.headRy - 1, 9, 1, C.white);
        pc.px(L.bodyCx, L.headCy + L.headRy, C.lavender);
      }
      break;
    case 'straw':
      pc.rect(cx - 9, top + 1, 19, 2, C.cream);
      pc.rect(cx - 9, top + 2, 19, 1, C.sand);
      pc.ellipse(cx, top - 1, 5.5, 3.5, C.cream);
      pc.rect(cx - 5, top + 0, 11, 1, C.ember);
      // Weave: fine lines across the brim and crown.
      for (let x = -8; x <= 8; x += 2) pc.dot(cx + x + 0.5, top + 1.5, C.sand);
      pc.thinLine(cx - 4, top - 2.5, cx + 4, top - 2.5, C.sandLight);
      pc.thinLine(cx - 5, top - 1, cx + 5, top - 1, C.sand);
      break;
    case 'crown':
      pc.rect(cx - 4, top - 1, 9, 4, C.sunYellow);
      for (const dx of [-4, -1, 2])
        pc.tri(cx + dx, top - 1, cx + dx + 3, top - 1, cx + dx + 1.5, top - 4, C.sunYellow);
      pc.px(cx, top + 1, C.rose);
      pc.px(cx - 3, top + 1, C.water);
      pc.px(cx + 3, top + 1, C.water);
      // Jewel glints and a gold rim.
      pc.dot(cx - 2.5, top + 1, C.white);
      pc.dot(cx + 0.5, top + 1, C.white);
      pc.dot(cx + 3.5, top + 1, C.white);
      pc.thinLine(cx - 4, top + 2.5, cx + 5, top + 2.5, C.sunDeep);
      break;
    case 'beanie':
      pc.ellipse(cx, top + 1, 7.5, 4.5, C.ember);
      pc.rect(cx - 7, top + 2, 15, 2, C.pale);
      pc.disc(cx, top - 3, 2, C.cream);
      // Knit ribs.
      for (let x = -6; x <= 6; x += 2) pc.thinLine(cx + x, top + 2, cx + x, top + 3.5, C.lilacGrey);
      pc.thinLine(cx - 3, top - 1, cx + 3, top - 1, C.roseDeep);
      break;
    case 'flower':
      for (const [dx, dy] of [
        [0, -3],
        [3, 0],
        [0, 3],
        [-3, 0],
      ] as const) {
        pc.disc(cx + 5 + dx, top + 1 + dy, 1.5, C.rose);
      }
      pc.disc(cx + 5, top + 1, 1.5, C.sunYellow);
      pc.px(cx + 3, top + 4, C.leaf);
      break;
    case 'bucket':
      pc.rect(cx - 6, top - 3, 13, 5, C.teal);
      pc.rect(cx - 8, top + 1, 17, 2, C.teal);
      pc.rect(cx - 6, top - 1, 13, 1, C.mint);
      // Stitching and a fold highlight.
      for (let x = -7; x <= 7; x += 2) pc.dot(cx + x + 0.5, top + 1.5, C.tealLight);
      pc.thinLine(cx - 5, top - 2.5, cx + 5, top - 2.5, C.tealLight);
      break;
    default:
      // Registry wearables (`config/cosmetics.ts`) draw from their shape lists.
      drawCosmetic(pc, angle, L, hat, 'over');
      break;
  }
}

export const NO_PARTS: Record<PartSlot, string | null> = {
  ears: null,
  tail: null,
  arms: null,
  back: null,
};

// ---------- body features ----------

function drawWings(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  look: ChaoLook,
  front: boolean,
): void {
  const raise = pose.wings === 1 ? 3 : 0;
  const back = partFor(look, look.parts.back);
  if (back) {
    drawBack(pc, angle, L, back, raise, front);
    return;
  }
  // Default wings sit behind the shoulders. From the front they peek out at the sides;
  // from the back they are the main feature.
  const col = look.colors;
  const scale = look.shape.wingScale;
  // Fly's great wings stand up behind the head rather than at the shoulders (LOOK-19).
  const y = (look.shape.wingsUp ? L.headCy - 1 : L.headCy + L.headRy - 2) - raise;
  const wing = (cx: number, dir: 1 | -1, big: boolean) => {
    // Raised wings grow up more than out, so they stand tall behind the head in the frame.
    const up = look.shape.wingsUp ? 1 : 0;
    const w = Math.round((big ? 4 : 3) * scale * (up ? 0.55 : 1));
    const h = Math.round((big ? 4 : 3) * scale * (up ? 1.1 : 1));
    pc.tri(cx, y + 2, cx + dir * w, y - h, cx + dir * (w + 1), y + 2, col.wing);
    pc.px(cx + dir * 2, y, col.belly);
    if (scale > 1.2) pc.line(cx + dir, y + 1, cx + dir * (w - 1), y - h + 2, col.belly);
  };
  switch (angle) {
    case 'front':
      if (!front) {
        wing(L.headCx - L.headRx + 1, -1, false);
        wing(L.headCx + L.headRx - 1, 1, false);
      }
      break;
    case 'frontQuarter':
      if (!front) {
        wing(L.headCx - L.headRx + 1, -1, true);
        wing(L.headCx + L.headRx - 2, 1, false);
      }
      break;
    case 'side':
      if (!front) wing(L.headCx - L.headRx + 1, -1, true);
      break;
    case 'backQuarter':
      if (front) {
        wing(L.headCx - 3, -1, true);
        wing(L.headCx + 4, 1, false);
      }
      break;
    case 'back':
      if (front) {
        wing(L.headCx - 2, -1, true);
        wing(L.headCx + 2, 1, true);
      }
      break;
  }
}

function drawCrown(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  col: ChaoColors,
): void {
  // The swept-back point on top of the head, with a yellow tip.
  const top = L.headCy - L.headRy;
  const droop = pose.headDrop;
  switch (angle) {
    case 'front': {
      pc.tri(L.headCx - 3, top + 2, L.headCx + 3, top + 2, L.headCx + 1, top - 4 + droop, col.body);
      pc.px(L.headCx + 1, top - 4 + droop, col.tip);
      pc.px(L.headCx + 1, top - 3 + droop, col.tip);
      pc.px(L.headCx, top - 3 + droop, col.tip);
      break;
    }
    case 'frontQuarter': {
      pc.tri(L.headCx - 4, top + 2, L.headCx + 2, top + 2, L.headCx - 3, top - 4 + droop, col.body);
      pc.px(L.headCx - 3, top - 4 + droop, col.tip);
      pc.px(L.headCx - 3, top - 3 + droop, col.tip);
      pc.px(L.headCx - 2, top - 3 + droop, col.tip);
      break;
    }
    case 'side': {
      pc.tri(L.headCx - 5, top + 3, L.headCx + 1, top + 1, L.headCx - 7, top - 3 + droop, col.body);
      pc.px(L.headCx - 7, top - 3 + droop, col.tip);
      pc.px(L.headCx - 6, top - 3 + droop, col.tip);
      pc.px(L.headCx - 6, top - 2 + droop, col.tip);
      break;
    }
    case 'backQuarter': {
      pc.tri(L.headCx - 4, top + 2, L.headCx + 2, top + 2, L.headCx - 4, top - 3 + droop, col.body);
      pc.px(L.headCx - 4, top - 3 + droop, col.tip);
      pc.px(L.headCx - 4, top - 2 + droop, col.tip);
      pc.px(L.headCx - 3, top - 2 + droop, col.tip);
      break;
    }
    case 'back': {
      pc.tri(L.headCx - 3, top + 2, L.headCx + 3, top + 2, L.headCx, top - 3 + droop, col.body);
      pc.px(L.headCx, top - 3 + droop, col.tip);
      pc.px(L.headCx, top - 2 + droop, col.tip);
      pc.px(L.headCx + 1, top - 2 + droop, col.tip);
      break;
    }
  }
}

/** Where the plain crown point's tip sits, per angle (dx from the head, dy from its top). */
const CROWN_TIP: Record<DrawnAngle, [number, number]> = {
  front: [1, -4],
  frontQuarter: [-3, -4],
  side: [-7, -3],
  backQuarter: [-4, -3],
  back: [0, -3],
};

/** A crown spike as base-left, base-right and tip, relative to the head's top centre. */
type Spike = readonly [number, number, number, number, number, number];

/** The Swim fin (a flat crescent swept back) and the three Run quills, per angle. */
const TYPE_CROWNS: Record<'fin' | 'quills', Record<DrawnAngle, readonly Spike[]>> = {
  fin: {
    front: [[-1.5, 2, 1.5, 2, 0.5, -5]],
    frontQuarter: [[-3, 2, 1, 2, -5, -4]],
    side: [
      [2, 2, -5, 3, -11, -3],
      [1, 0, -4, 0, -10, -3],
    ],
    backQuarter: [[-3, 2, 1, 2, -5, -3]],
    back: [[-1.5, 2, 1.5, 2, 0, -4]],
  },
  quills: {
    front: [
      [-5, 3, -2, 2, -7, -2],
      [2, 2, 5, 3, 7, -2],
      [-2, 2, 2, 2, 0, -5],
    ],
    frontQuarter: [
      [-6, 3, -3, 2, -9, -1],
      [0, 2, 3, 3, 3, -3],
      [-4, 2, 0, 2, -6, -4],
    ],
    side: [
      [-4, 5, -1, 4, -9, 5],
      [-4, 3, 0, 2, -10, 1],
      [-3, 1, 1, 1, -9, -3],
    ],
    backQuarter: [
      [-6, 3, -3, 2, -9, -1],
      [0, 2, 3, 3, 3, -3],
      [-4, 2, 0, 2, -6, -3],
    ],
    back: [
      [-5, 3, -2, 2, -7, -2],
      [2, 2, 5, 3, 7, -2],
      [-2, 2, 2, 2, 0, -4],
    ],
  },
};

/**
 * The crown with the first evolution's tell (LOOK-19): the plain point, a fuller point
 * (Normal), the Swim fin or the Run quills, then the band's tip: Sun rounds it into a
 * ball, Moon adds a spike either side.
 */
function drawCrownFor(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  col: ChaoColors,
  shape: ChaoShape,
): void {
  const kind = shape.crownKind ?? 'point';
  const top = L.headCy - L.headRy;
  const d = pose.headDrop;
  const hx = L.headCx;
  let tip: [number, number];
  if (kind === 'fin' || kind === 'quills') {
    const spikes = TYPE_CROWNS[kind][angle];
    spikes.forEach(([ax, ay, bx, by, tx, ty], i) => {
      // The Swim crescent's inner blade is its shade.
      const c = kind === 'fin' && i > 0 ? col.shade : col.body;
      pc.tri(hx + ax, top + ay, hx + bx, top + by, hx + tx, top + ty + d, c);
      pc.px(hx + tx, top + ty + d, col.tip);
    });
    const main = spikes[spikes.length - 1]!;
    tip = [hx + main[4], top + main[5] + d];
  } else {
    const [dx, dy] = CROWN_TIP[angle];
    if (kind === 'full') {
      // A fuller point: wider at the foot and two pixels taller under the usual one.
      pc.tri(hx - 4, top + 2, hx + 4, top + 2, hx + dx, top + dy - 2 + d, col.body);
      pc.px(hx + dx, top + dy - 2 + d, col.tip);
      pc.px(hx + dx, top + dy - 1 + d, col.tip);
    }
    drawCrown(pc, angle, pose, L, col);
    tip = [hx + dx, top + dy + (kind === 'full' ? -2 : 0) + d];
  }
  const [tx, ty] = tip;
  if (shape.band === 'sun') {
    pc.disc(tx, ty, 1.4, col.tip);
    pc.px(tx - 0.5, ty - 0.5, C.white);
  } else if (shape.band === 'moon') {
    pc.tri(hx - 3, top + 2, hx - 1, top + 1, hx - 5, top - 2 + d, col.body);
    pc.tri(hx + 1, top + 1, hx + 3, top + 2, hx + 5, top - 2 + d, col.body);
    pc.px(hx - 5, top - 2 + d, col.tip);
    pc.px(hx + 5, top - 2 + d, col.tip);
  }
}

/** Power's horn nubs on the brow and Fly's feather tufts at the temples (LOOK-19). */
function drawHeadTells(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  col: ChaoColors,
  shape: ChaoShape,
): void {
  const top = L.headCy - L.headRy;
  const side = angle === 'side';
  if (shape.horns) {
    const xs = side ? [L.headCx + 2] : [L.headCx - L.headRx + 3, L.headCx + L.headRx - 3];
    for (const x of xs) {
      const out = side ? 0.5 : x < L.headCx ? -1 : 1;
      pc.tri(x - 1.5, top + 3, x + 1.5, top + 3, x + out * 1.5, top - 1, col.tip);
    }
  }
  if (shape.tufts) {
    const y = Math.round(L.headCy - L.headRy * 0.4);
    const xs = side
      ? [L.headCx - L.headRx + 1]
      : [L.headCx - L.headRx + 1, L.headCx + L.headRx - 1];
    for (const x of xs) {
      const out = side || x < L.headCx ? -1 : 1;
      pc.tri(x, y + 1, x, y - 2, x + out * 3, y - 4, col.belly);
    }
  }
}

/** Swim's back fin and fish-tail stub (LOOK-19): behind the body from the side, on it from behind. */
function drawDorsal(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  col: ChaoColors,
  onBack: boolean,
): void {
  const back = angle === 'back' || angle === 'backQuarter';
  if (back !== onBack || angle === 'front') return;
  if (back) {
    pc.tri(
      L.bodyCx - 1.5,
      L.bodyCy - 1,
      L.bodyCx + 1.5,
      L.bodyCy - 1,
      L.bodyCx,
      L.bodyCy - 6,
      col.tip,
    );
    const y = L.bodyCy + L.bodyRy;
    pc.tri(L.bodyCx - 3, y + 1, L.bodyCx + 3, y + 1, L.bodyCx, y - 2, col.shade);
    return;
  }
  const bx = L.bodyCx - L.bodyRx;
  pc.tri(bx + 1, L.bodyCy - 2, bx + 4, L.bodyCy - 4, bx - 2, L.bodyCy - 7, col.tip);
  pc.tri(bx + 1, L.bodyCy + 2, bx - 3, L.bodyCy, bx - 3, L.bodyCy + 4, col.shade);
}

/** Swim types: small fins on the sides of the head. */
function drawHeadFins(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  col: ChaoColors,
  size: number,
): void {
  if (size <= 0) return;
  const y = L.headCy;
  const fin = (x: number, dir: 1 | -1) => {
    pc.tri(x, y - 2, x, y + 2, x + dir * (2 + size), y - 1, col.shade);
    pc.px(x + dir, y, col.tip);
  };
  switch (angle) {
    case 'front':
    case 'back':
      fin(L.headCx - L.headRx + 1, -1);
      fin(L.headCx + L.headRx - 1, 1);
      break;
    case 'frontQuarter':
    case 'backQuarter':
      fin(L.headCx - L.headRx + 1, -1);
      break;
    case 'side':
      fin(L.headCx - L.headRx + 2, -1);
      break;
  }
}

function drawLegs(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  col: ChaoColors,
): void {
  if (L.legLength <= 0 || pose.waterline || pose.legs === 'out') return;
  const a = pose.legs === 'stepA' ? -1 : pose.legs === 'stepB' ? 1 : 0;
  const top = L.bodyCy + L.bodyRy - 2;
  if (angle === 'side') {
    pc.rect(L.bodyCx - 2 + a * 2, top, 2, L.legLength + 2, col.shade);
    pc.rect(L.bodyCx + 1 - a * 2, top, 2, L.legLength + 2, col.shade);
  } else {
    const spread = angle === 'front' || angle === 'back' ? 4 : 3;
    pc.rect(
      L.bodyCx - spread - 1,
      top,
      2,
      L.legLength + 2 + (pose.legs === 'tucked' ? 0 : a),
      col.shade,
    );
    pc.rect(
      L.bodyCx + spread - 1,
      top,
      2,
      L.legLength + 2 - (pose.legs === 'tucked' ? 0 : a),
      col.shade,
    );
  }
}

function drawFeet(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  col: ChaoColors,
): void {
  if (pose.waterline) return;
  if (pose.legs === 'out') {
    drawSitFeet(pc, angle, L, col);
    return;
  }
  const y = L.feetY;
  const foot = (cx: number, dy = 0) => {
    pc.ellipse(cx, y + dy, 2.5, 1.5, col.body);
    pc.px(cx + 1, y + dy, col.tip);
    pc.px(cx + 2, y + dy, col.tip);
    pc.px(cx + 1, y + dy - 1, col.tip);
  };
  const tucked = pose.legs === 'tucked';
  const a = pose.legs === 'stepA' ? -1 : pose.legs === 'stepB' ? 1 : 0;
  switch (angle) {
    case 'front':
    case 'frontQuarter':
    case 'back':
    case 'backQuarter': {
      const spread = angle === 'front' || angle === 'back' ? 4 : 3;
      foot(L.bodyCx - spread, tucked ? 0 : a);
      foot(L.bodyCx + spread, tucked ? 0 : -a);
      break;
    }
    case 'side': {
      foot(L.bodyCx - 1 + a * 2, 0);
      foot(L.bodyCx + 2 - a * 2, 0);
      break;
    }
  }
}

/**
 * LOOK-20, the Chao sit: the legs reach straight out in front, heels on the ground. From the
 * front the two yellow soles face the camera; from the side the legs run forward with the toes up.
 */
function drawSitFeet(pc: PixelCanvas, angle: DrawnAngle, L: Layout, col: ChaoColors): void {
  const y = L.bodyCy + L.bodyRy - 1;
  const sole = (cx: number) => {
    pc.ellipse(cx, y, 2.5, 2, col.body);
    pc.ellipse(cx, y, 1.3, 1.1, col.tip);
  };
  switch (angle) {
    case 'front':
      sole(L.bodyCx - 3);
      sole(L.bodyCx + 3);
      break;
    case 'frontQuarter':
      sole(L.bodyCx - 1);
      sole(L.bodyCx + 4);
      break;
    case 'side': {
      const toe = L.bodyCx + L.bodyRx + 2;
      pc.rect(L.bodyCx, y - 1, toe - L.bodyCx, 2, col.shade);
      pc.ellipse(toe, y - 1, 1.5, 2.2, col.body);
      pc.px(toe, y - 3, col.tip);
      pc.px(toe + 1, y - 2, col.tip);
      break;
    }
    case 'backQuarter':
      // The far foot's heel just shows past the body.
      pc.ellipse(L.bodyCx - L.bodyRx, y, 1.5, 1, col.body);
      break;
    case 'back':
      break;
  }
}

/** The eye on one side of the face (`dir` −1 is the drawn left), as the face drawer places them. */
function eyeXs(angle: DrawnAngle, L: Layout, dir: 1 | -1): [number, number] {
  const y = L.headCy + 1;
  switch (angle) {
    case 'side':
      return [L.headCx + 4, y];
    case 'frontQuarter':
      return [dir < 0 ? L.headCx - 1 : L.headCx + 5, y];
    default:
      return [L.headCx + dir * 4, y];
  }
}

/** Two light-blue drops running down and out from each eye (LOOK-21). */
function drawTears(pc: PixelCanvas, angle: DrawnAngle, L: Layout, fist: number): void {
  if (angle === 'back' || angle === 'backQuarter') return;
  const sides: (1 | -1)[] = angle === 'side' ? [1] : [-1, 1];
  for (const dir of sides) {
    const [ex, ey] = eyeXs(angle, L, dir);
    // Just outside the fist, arcing out and down.
    const x = ex + dir * Math.ceil(fist + 1);
    pc.px(x, ey - 1, C.white);
    pc.px(x, ey, C.skyLight);
    pc.px(x + dir, ey + 1, C.skyLight);
    pc.px(x + dir, ey + 3, C.shallows);
  }
}

function drawArms(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  look: ChaoLook,
): void {
  const col = look.colors;
  const part = partFor(look, look.parts.arms);
  const shoulderY = L.bodyCy - L.bodyRy + 2;
  const hand = (x: number, y: number, dir: 1 | -1, sx: number, onFace = false) => {
    if (part) {
      drawArmPart(pc, sx, shoulderY, x, y, dir, part);
      return;
    }
    pc.line(sx, shoulderY, x, y, col.shade);
    // A fist over the face needs its own rim, or it melts into the head.
    if (onFace) pc.disc(x, y, 2.4 + look.shape.handBonus, col.shade);
    pc.disc(x, y, 1.6 + look.shape.handBonus, col.body);
    pc.px(x, y + 1, col.tip);
    pc.px(x + 1, y, col.tip);
  };
  const armAt = (sx: number, dir: 1 | -1, posePick: ArmPose) => {
    let hx = sx + dir * 2;
    let hy = shoulderY + 3;
    switch (posePick) {
      case 'up':
        hx = sx + dir * 3;
        hy = shoulderY - 5;
        break;
      case 'out':
        hx = sx + dir * 4;
        hy = shoulderY;
        break;
      case 'swingA':
        hx = sx + dir * 2;
        hy = shoulderY + 1;
        break;
      case 'swingB':
        hx = sx + dir * 2;
        hy = shoulderY + 4;
        break;
      case 'rubA':
      case 'rubB': {
        // A fist pressed to the eye on this hand's side.
        const [ex] = eyeXs(angle, L, dir);
        hx = ex;
        hy = L.headCy + (posePick === 'rubA' ? 1 : 2);
        break;
      }
      default:
        break;
    }
    hand(hx, hy, dir, sx, posePick === 'rubA' || posePick === 'rubB');
  };
  const mirror = (p: ArmPose): ArmPose =>
    p === 'swingA'
      ? 'swingB'
      : p === 'swingB'
        ? 'swingA'
        : p === 'rubA'
          ? 'rubB'
          : p === 'rubB'
            ? 'rubA'
            : p;
  switch (angle) {
    case 'front':
      armAt(L.bodyCx - L.bodyRx + 1, -1, pose.arms);
      armAt(L.bodyCx + L.bodyRx - 1, 1, mirror(pose.arms));
      break;
    case 'frontQuarter':
      armAt(L.bodyCx - L.bodyRx + 1, -1, pose.arms);
      armAt(L.bodyCx + L.bodyRx - 2, 1, mirror(pose.arms));
      break;
    case 'side':
      armAt(L.bodyCx + 2, 1, pose.arms);
      break;
    case 'backQuarter':
      armAt(L.bodyCx + L.bodyRx - 1, 1, pose.arms);
      armAt(L.bodyCx - L.bodyRx + 2, -1, pose.arms);
      break;
    case 'back':
      armAt(L.bodyCx - L.bodyRx + 1, -1, pose.arms);
      armAt(L.bodyCx + L.bodyRx - 1, 1, pose.arms);
      break;
  }
}

function drawFace(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  col: ChaoColors,
): void {
  if (angle === 'back') return;
  const eyeY = L.headCy + 1;
  // On the fine grid the eye gets an iris, a pupil and two glints.
  const iris = col.eye === C.ink || col.eye === C.darkPlum ? C.skyDeep : shadeOf(col.eye);
  const eye = (cx: number, narrow: boolean) => {
    const rx = narrow ? 1 : 1.6;
    switch (pose.eyes) {
      case 'open':
      case 'wide': {
        const ry = pose.eyes === 'wide' ? 3 : 2.6;
        pc.ellipse(cx, eyeY, rx, ry, col.eye);
        pc.ellipse(cx + 0.15, eyeY + 0.7, rx * 0.62, ry * 0.55, iris);
        pc.ellipse(cx + 0.15, eyeY + 0.9, rx * 0.32, ry * 0.3, col.eye);
        pc.ellipse(cx - (narrow ? 0.2 : 0.6), eyeY - 1.4, narrow ? 0.4 : 0.55, 0.75, col.glint);
        pc.dot(cx + (narrow ? 0.3 : 0.6), eyeY + 1.3, col.glint);
        break;
      }
      case 'half':
        pc.ellipse(cx, eyeY + 1, rx, 1.6, col.eye);
        pc.ellipse(cx + 0.15, eyeY + 1.5, rx * 0.6, 0.9, iris);
        pc.px(cx - (narrow ? 0 : 1), eyeY, col.glint);
        break;
      case 'closed':
        pc.line(cx - 1, eyeY + 1, cx + 1, eyeY + 1, col.eye);
        break;
      case 'happy':
        pc.px(cx - 1, eyeY + 1, col.eye);
        pc.px(cx, eyeY, col.eye);
        pc.px(cx + 1, eyeY + 1, col.eye);
        break;
      case 'dizzy':
        pc.px(cx - 1, eyeY - 1, col.eye);
        pc.px(cx + 1, eyeY + 1, col.eye);
        pc.px(cx + 1, eyeY - 1, col.eye);
        pc.px(cx - 1, eyeY + 1, col.eye);
        pc.px(cx, eyeY, col.eye);
        break;
    }
  };
  let mouthX = L.headCx;
  switch (angle) {
    case 'front':
      eye(L.headCx - 4, false);
      eye(L.headCx + 4, false);
      break;
    case 'frontQuarter':
      eye(L.headCx - 1, false);
      eye(L.headCx + 5, true);
      mouthX = L.headCx + 2;
      break;
    case 'side':
      eye(L.headCx + 4, true);
      mouthX = L.headCx + 6;
      break;
    case 'backQuarter':
      pc.px(L.headCx + L.headRx - 1, eyeY, col.eye);
      pc.px(L.headCx + L.headRx - 1, eyeY + 1, col.eye);
      return;
    default:
      return;
  }
  // Soft cheeks, only while loved (a Chao wears no blush at rest, LOOK-12).
  if (pose.blush && angle === 'front') {
    pc.ellipse(L.headCx - 6, eyeY + 2.6, 1.2, 0.7, C.roseLight);
    pc.ellipse(L.headCx + 6, eyeY + 2.6, 1.2, 0.7, C.roseLight);
  } else if (pose.blush && angle === 'frontQuarter') {
    pc.ellipse(L.headCx - 3.5, eyeY + 2.6, 1.2, 0.7, C.roseLight);
  }
  const my = eyeY + 4;
  switch (pose.mouth) {
    case 'smile':
      if (angle === 'side') {
        pc.thinLine(mouthX - 1, my, mouthX + 1.5, my, col.eye);
      } else {
        pc.thinLine(mouthX - 1.5, my + 0.3, mouthX, my + 1.3, col.eye);
        pc.thinLine(mouthX, my + 1.3, mouthX + 1.5, my + 0.3, col.eye);
      }
      break;
    case 'flat':
      pc.px(mouthX - 1, my, col.eye);
      pc.px(mouthX, my, col.eye);
      break;
    case 'open':
      // A big D: a flat top lip, a round bottom, the tongue inside.
      if (angle === 'side') {
        pc.rect(mouthX - 1, my, 3, 2, col.eye);
        pc.px(mouthX, my + 1, C.berry);
      } else {
        pc.rect(mouthX - 2, my, 5, 2, col.eye);
        pc.rect(mouthX - 1, my + 2, 3, 1, col.eye);
        pc.px(mouthX, my + 1, C.rose);
        pc.px(mouthX - 1, my + 1, C.berry);
      }
      break;
    case 'o':
      pc.px(mouthX, my, col.eye);
      pc.px(mouthX - 1, my + 1, col.eye);
      pc.px(mouthX + 1, my + 1, col.eye);
      pc.px(mouthX, my + 2, col.eye);
      break;
    case 'wail':
      // A wide trapezoid, the narrow edge on top.
      pc.rect(mouthX - 1, my, 3, 1, col.eye);
      pc.rect(mouthX - 2, my + 1, 5, 2, col.eye);
      pc.px(mouthX, my + 2, C.berry);
      break;
    case 'munch':
      pc.rect(mouthX - 1, my, 3, 2, col.eye);
      pc.px(mouthX, my + 1, C.berry);
      break;
    case 'pout':
      pc.px(mouthX - 1, my + 1, col.eye);
      pc.px(mouthX, my + 1, col.eye);
      pc.px(mouthX + 1, my, col.eye);
      break;
    case 'sad':
      pc.px(mouthX - 1, my + 1, col.eye);
      pc.px(mouthX, my, col.eye);
      pc.px(mouthX + 1, my + 1, col.eye);
      break;
    case 'none':
      break;
  }
}

/**
 * The gem finish on a jewel Nubbin: a pale cut on the crown side of the head, a dark
 * facet on the far side, crisp cut lines and a hard white star of a glint, plus one facet
 * on the body. Drawn before the face, so the eyes stay on top.
 */
function drawGemFacets(pc: PixelCanvas, L: Layout, col: ChaoColors): void {
  const hx = L.headCx;
  const hy = L.headCy;
  const rx = L.headRx;
  const ry = L.headRy;
  const top = { x: hx - rx * 0.05, y: hy - ry * 0.85 };
  const corner = { x: hx - rx * 0.65, y: hy - ry * 0.45 };
  const inner = { x: hx - rx * 0.15, y: hy - ry * 0.25 };
  pc.tri(top.x, top.y, corner.x, corner.y, inner.x, inner.y, col.belly);
  pc.tri(
    hx + rx * 0.35,
    hy + ry * 0.15,
    hx + rx * 0.9,
    hy - ry * 0.15,
    hx + rx * 0.6,
    hy + ry * 0.75,
    col.shade,
  );
  pc.thinLine(top.x, top.y, corner.x, corner.y, col.tip);
  pc.thinLine(corner.x, corner.y, hx - rx * 0.9, hy + ry * 0.2, col.tip);
  pc.thinLine(top.x, top.y, hx + rx * 0.6, hy - ry * 0.6, col.tip);
  pc.thinLine(inner.x, inner.y, hx + rx * 0.35, hy + ry * 0.15, col.belly);
  // The hard glint: a white pixel with a fine four-point star.
  const gx = hx - rx * 0.4;
  const gy = hy - ry * 0.55;
  pc.px(gx, gy, C.white);
  pc.dot(gx + 0.5, gy - 1, C.white);
  pc.dot(gx + 0.5, gy + 2, C.white);
  pc.dot(gx - 1, gy + 0.5, C.white);
  pc.dot(gx + 2, gy + 0.5, C.white);
  // One facet catching the light on the body.
  pc.thinLine(
    L.bodyCx - L.bodyRx * 0.6,
    L.bodyCy - 1,
    L.bodyCx,
    L.bodyCy - L.bodyRy * 0.8,
    col.tip,
  );
  pc.dot(L.bodyCx - L.bodyRx * 0.3, L.bodyCy - L.bodyRy * 0.4, C.white);
}

/** Draw one frame into a fresh 32×32 canvas. */
export function drawChao(angle: DrawnAngle, pose: ChaoPose, look: ChaoLook): PixelCanvas {
  const pc = new PixelCanvas(CHAO_SIZE, CHAO_SIZE);
  const col = look.finish === 'metal' ? metalColors(look.colors) : look.colors;
  // Seated (LOOK-20): the body comes down until its bottom rests at the ground line.
  const L0 = layout(
    angle,
    pose.legs === 'out' ? { ...pose, lift: pose.lift + look.shape.legLength - 1 } : pose,
    look.shape,
  );
  // The waddle rocks the head across the body; from the side it would read as a nod.
  const rock = angle === 'side' ? 0 : (pose.rock ?? 0);
  const L = rock ? { ...L0, headCx: L0.headCx + rock } : L0;
  const tail = partFor(look, look.parts.tail);
  const fromFront = angle === 'front' || angle === 'frontQuarter' || angle === 'side';

  // A second evolution's tell takes its own colour: fins, wings, legs, hands or crown tip.
  const tellType = look.colors.tell === undefined ? null : (look.shape.tellType ?? null);
  const tell = look.colors.tell ?? col.tip;
  const wingLook = tellType === 'fly' ? { ...look, colors: { ...col, wing: tell } } : look;
  const armLook = tellType === 'power' ? { ...look, colors: { ...col, body: tell } } : look;
  const lift = look.shape.crownLift ?? 0;
  const crownL = lift ? { ...L, headCy: L.headCy - lift } : L;
  const crownCol = tellType === 'normal' ? { ...col, tip: tell } : col;

  // Back layer: wings/back part and tail behind the body for front-ish views.
  drawWings(pc, angle, pose, L, wingLook, false);
  if (tail && fromFront) drawTail(pc, angle, L, tail);
  if (look.shape.dorsal) drawDorsal(pc, angle, L, col, false);
  if (look.hat) drawCosmetic(pc, angle, L, look.hat, 'behind');

  // Legs and body.
  drawLegs(pc, angle, pose, L, tellType === 'run' ? { ...col, shade: tell } : col);
  if (!pose.waterline) {
    pc.ellipse(L.bodyCx, L.bodyCy, L.bodyRx, L.bodyRy, col.body);
    pc.ellipse(L.bodyCx + 1, L.bodyCy + 1, L.bodyRx - 1, L.bodyRy - 1, col.shade);
    pc.ellipse(L.bodyCx, L.bodyCy, L.bodyRx - 1, L.bodyRy - 1, col.body);
    // A belly patch only where a look asks for one: the two-tone eggs' signature. A Chao's
    // belly is its body colour (LOOK-12).
    if (col.bellyPatch !== undefined && (angle === 'front' || angle === 'frontQuarter')) {
      const bx = L.bodyCx + (angle === 'frontQuarter' ? 1 : 0);
      pc.ellipse(bx, L.bodyCy + 1, 3, 2.5, col.bellyPatch);
      pc.ellipse(bx - 0.5, L.bodyCy + 0.5, 1.8, 1.3, lightOf(col.bellyPatch));
    }
    drawFeet(pc, angle, pose, L, col);
    if (look.shape.dorsal) drawDorsal(pc, angle, L, col, true);
    if (look.hat) drawCosmetic(pc, angle, L, look.hat, 'body');
  } else {
    pc.ellipse(L.bodyCx, L.bodyCy - 1, L.bodyRx, 2, col.body);
  }

  if (angle === 'back' || angle === 'backQuarter') drawArms(pc, angle, pose, L, armLook);

  // Head.
  drawCrownFor(pc, angle, pose, crownL, crownCol, look.shape);
  drawHeadFins(
    pc,
    angle,
    L,
    tellType === 'swim' ? { ...col, shade: tell } : col,
    look.shape.headFins,
  );
  pc.ellipse(L.headCx, L.headCy, L.headRx, L.headRy, col.body);
  pc.ellipse(L.headCx + 1, L.headCy + 2, L.headRx - 1, L.headRy - 1, col.shade);
  pc.ellipse(L.headCx, L.headCy, L.headRx - 1, L.headRy - 1, col.body);
  pc.ellipse(
    L.headCx - 2,
    L.headCy - 2,
    Math.max(1, L.headRx - 4),
    Math.max(1, L.headRy - 4),
    col.belly,
  );
  pc.ellipse(L.headCx, L.headCy, L.headRx - 1, L.headRy - 1, col.body);
  pc.px(L.headCx - 3, L.headCy - 4, col.belly);
  pc.px(L.headCx - 4, L.headCy - 3, col.belly);
  if (col.rim !== undefined && angle !== 'back') {
    // Just inside the outline, from the brow round to the crown's foot.
    for (let a = 2.8; a <= 4.5; a += 0.22) {
      const x = Math.round(L.headCx + Math.cos(a) * (L.headRx - 1));
      const y = Math.round(L.headCy + Math.sin(a) * (L.headRy - 1));
      pc.px(x, y, col.rim);
    }
  }
  if (look.shiny) {
    // Shiny: a sparkle on the head and the body.
    pc.px(L.headCx + 3, L.headCy - 5, C.white);
    pc.px(L.headCx + 4, L.headCy - 4, C.white);
    pc.px(L.headCx + 3, L.headCy - 3, C.white);
    pc.px(L.bodyCx - 3, L.bodyCy - 2, C.white);
  }

  drawHeadTells(pc, angle, L, col, look.shape);
  if (look.gem) drawGemFacets(pc, L, col);

  const ears = partFor(look, look.parts.ears);
  if (ears) drawEars(pc, angle, L, ears);
  if (look.hat) {
    if (look.hatDye) {
      // Draw the hat aside, swap its main colours for the dye, then lay it on.
      const tmp = new PixelCanvas(CHAO_SIZE, CHAO_SIZE);
      drawHat(tmp, angle, L, look.hat);
      const d = DYE_COLORS[look.hatDye];
      const map: Partial<Record<number, number>> = {};
      for (const c of [
        C.cream,
        C.ember,
        C.sunYellow,
        C.teal,
        C.rose,
        C.violet,
        C.moonPurple,
        C.plum,
        C.orange,
      ]) {
        map[c] =
          c === C.ember || c === C.moonPurple || c === C.plum || c === C.orange ? shadeOf(d) : d;
      }
      tmp.recolor(map);
      pc.blit(tmp, 0, 0);
    } else drawHat(pc, angle, L, look.hat);
  }
  // A scarf around the neck and glasses over the eyes.
  if (look.scarf && angle !== 'back') {
    const sc = DYE_COLORS[look.scarf];
    const ny = L.headCy + L.headRy - 1;
    pc.ellipse(L.headCx, ny, L.headRx - 1.5, 1.6, sc);
    pc.thinLine(L.headCx - L.headRx + 2, ny + 0.5, L.headCx + L.headRx - 2, ny + 0.5, shadeOf(sc));
    pc.rect(L.headCx + 2, ny, 2, 4, sc);
    pc.dot(L.headCx + 3, ny + 3.5, shadeOf(sc));
  }

  // Crying fists rub the eyes, so they go on after the face.
  const rubbing = pose.arms === 'rubA' || pose.arms === 'rubB';
  if (fromFront && !rubbing) drawArms(pc, angle, pose, L, armLook);
  drawFace(pc, angle, pose, L, col);
  if (fromFront && rubbing) drawArms(pc, angle, pose, L, armLook);
  if (pose.tears) drawTears(pc, angle, L, 2.4 + look.shape.handBonus);
  if (look.glasses && angle !== 'back' && angle !== 'backQuarter') {
    const ey = L.headCy + 1;
    const xs =
      angle === 'side'
        ? [L.headCx + 4]
        : angle === 'frontQuarter'
          ? [L.headCx - 1, L.headCx + 5]
          : [L.headCx - 4, L.headCx + 4];
    for (const ex of xs) {
      pc.thinLine(ex - 2.2, ey - 2.6, ex + 2.2, ey - 2.6, C.darkPlum);
      pc.thinLine(ex - 2.2, ey + 2.6, ex + 2.2, ey + 2.6, C.darkPlum);
      pc.thinLine(ex - 2.3, ey - 2.6, ex - 2.3, ey + 2.6, C.darkPlum);
      pc.thinLine(ex + 2.3, ey - 2.6, ex + 2.3, ey + 2.6, C.darkPlum);
      pc.dot(ex - 1.5, ey - 1.8, C.white);
    }
    if (xs.length === 2) pc.thinLine(xs[0]! + 2.3, ey, xs[1]! - 2.3, ey, C.darkPlum);
  }

  // Front layer: wings over the body for back views, tail in front for back views.
  drawWings(pc, angle, pose, L, wingLook, true);
  if (tail && !fromFront) drawTail(pc, angle, L, tail);

  if (pose.waterline) {
    const wy = L.bodyCy - 1 - (pose.waterRise ?? 0);
    // LOOK-23: a raised waterline hides the body under a dithered sheet of water.
    for (let y = wy + 1; y <= Math.min(L.bodyCy + 2, wy + 6); y++)
      for (let x = L.bodyCx - 7; x <= L.bodyCx + 7; x++)
        if (y > L.bodyCy - 1 || (x + y) % 2 === 0) pc.px(x, y, C.shallows);
    pc.line(L.bodyCx - 7, wy, L.bodyCx + 7, wy, C.shallows);
    pc.px(L.bodyCx - 8, wy + 1, C.white);
    pc.px(L.bodyCx + 8, wy + 1, C.white);
    if (pose.kick) {
      const kx = angle === 'side' ? L.bodyCx - 9 : L.bodyCx + 5;
      pc.px(kx, wy - 1, C.white);
      pc.px(kx + 1, wy - 2, C.white);
      pc.px(kx + 2, wy, C.white);
    }
  }

  if (pose.blush && angle !== 'back' && angle !== 'backQuarter') {
    const cy = L.headCy + 2;
    if (angle !== 'side') pc.px(L.headCx - 5 + (angle === 'frontQuarter' ? 1 : 0), cy, C.rose);
    pc.px(L.headCx + (angle === 'side' ? 3 : 4), cy, C.rose);
  }

  pc.finish(col.outline, [col.eye, col.glint, C.white]);
  if (look.finish === 'glass') ditherGlass(pc, [col.outline, col.eye, col.glint, C.white, C.ink]);
  return pose.spin ? pc.rotatedQuarter(pose.spin) : pc;
}

/** Every clip at every drawn angle, baked into one sheet. */
export function buildChaoSheet(look: ChaoLook): SpriteSheet {
  const atlas = new AtlasBuilder(CHAO_SIZE, CHAO_SIZE, 10);
  for (const clip of Object.keys(CLIPS) as ClipName[]) {
    const def = CLIPS[clip];
    for (const angle of DRAWN_ANGLES) {
      for (let f = 0; f < def.frames; f++) {
        atlas.add(frameKey(clip, angle, f), drawChao(angle, poseFor(clip, f), look));
      }
    }
  }
  for (const angle of DRAWN_ANGLES) {
    atlas.add(
      frameKey('dizzy', angle, 0),
      drawChao(angle, { ...BASE, eyes: 'dizzy', mouth: 'sad', headDrop: 1 }, look),
    );
    atlas.add(
      frameKey('surprised', angle, 0),
      drawChao(angle, { ...BASE, eyes: 'wide', mouth: 'open', lift: -1, arms: 'up' }, look),
    );
    atlas.add(
      frameKey('held', angle, 0),
      drawChao(angle, { ...BASE, eyes: 'wide', mouth: 'flat', legs: 'tucked', arms: 'out' }, look),
    );
    // K1 and LOOK-20: sitting awake on its bottom, the legs straight out in front, eyes open
    // (the sleep frames shut them), with a slow breath over two frames.
    for (let f = 0; f < 2; f++)
      atlas.add(
        frameKey('sit', angle, f),
        drawChao(angle, { ...BASE, legs: 'out', squash: f === 0 ? 1 : 0.95 }, look),
      );
    // LOOK-21: crying, distinct from sad: seated, fists rubbing the eyes in turn, wailing.
    for (let f = 0; f < 2; f++)
      atlas.add(frameKey('cry', angle, f), drawChao(angle, cryPose(f), look));
  }
  return atlas.build();
}

/** Convenience for callers that only have colours (gallery, tests). */
export function lookOf(
  colors: ChaoColors,
  type: NubbinType | null = null,
  second: NubbinType | null = null,
  parts: Record<PartSlot, string | null> = NO_PARTS,
  eternal = false,
  hat: string | null = null,
  shiny = false,
  band: 'sun' | 'moon' | 'neutral' | null = null,
): ChaoLook {
  return { colors, shape: shapeFor(type, second, eternal, band), parts, hat, shiny };
}
  if (look.shape.eternalBand) drawEternalSign(pc, angle, L, look.shape.eternalBand);

export type { PartStyle };
    for (const style of ['paddle', 'crawl'] as const)
      for (let f = 0; f < 2; f++)
        atlas.add(frameKey(style, angle, f), drawChao(angle, swimPose(style, f), look));
