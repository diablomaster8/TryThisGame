import type { NubbinType, PartSlot } from '../../sim/types';
import { CLIPS, frameKey, type ClipName } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { CHILD_SHAPE, layout, type ChaoShape, type Layout } from './layout';
import { C } from './palette';
import { drawArmPart, drawBack, drawEars, drawTail, partStyle, type PartStyle } from './parts';
import { PixelCanvas } from './pixel-canvas';

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
}

export const CHILD_NEUTRAL: ChaoColors = {
  body: C.shallows,
  shade: C.water,
  belly: C.pale,
  tip: C.sunYellow,
  tipShade: C.orange,
  wing: C.blush,
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
  wing: C.cream,
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
  if (band === 'neutral') {
    switch (type) {
      case 'swim':
        return { ...base, body: C.water, shade: C.deepWater, belly: C.shallows };
      case 'fly':
        return { ...base, body: C.lavender, shade: C.violet, belly: C.pale };
      case 'run':
        return { ...base, body: C.sprout, shade: C.grass, belly: C.cream };
      case 'power':
        return { ...base, body: C.orange, shade: C.ember, belly: C.sand };
      default:
        return { ...base, body: C.mint, shade: C.teal, belly: C.pale };
    }
  }
  if (band === 'sun') {
    switch (type) {
      case 'swim':
        return { ...base, body: C.shallows, shade: C.water };
      case 'fly':
        return { ...base, body: C.white, shade: C.lavender };
      case 'run':
        return { ...base, body: C.cream, shade: C.sand };
      case 'power':
        return { ...base, body: C.pale, shade: C.orange };
      default:
        return base;
    }
  }
  switch (type) {
    case 'swim':
      return { ...base, body: C.nightBlue, shade: C.ink };
    case 'fly':
      return { ...base, body: C.moonPurple, shade: C.darkPlum };
    case 'run':
      return { ...base, body: C.deepGreen, shade: C.ink };
    case 'power':
      return { ...base, body: C.berry, shade: C.darkPlum };
    default:
      return base;
  }
}

/**
 * The Chaos forms: Eternals. Sun is the angelic white-and-gold look with great wings,
 * Moon the devilish black-and-red one, Neutral a silvery, ethereal one.
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
        body: C.ink,
        shade: C.darkPlum,
        belly: C.plum,
        tip: C.ember,
        tipShade: C.berry,
        wing: C.berry,
        eye: C.ember,
        glint: C.sunYellow,
        outline: C.darkPlum,
      };
    default:
      return {
        body: C.lilacGrey,
        shade: C.dusk,
        belly: C.pale,
        tip: C.mint,
        tipShade: C.teal,
        wing: C.lavender,
        eye: C.teal,
        glint: C.white,
        outline: C.plum,
      };
  }
}

/** Silhouette by type. Second evolutions add a lighter touch of their type. */
export function shapeFor(
  type: NubbinType | null,
  second: NubbinType | null,
  eternal = false,
): ChaoShape {
  if (!type) return CHILD_SHAPE;
  const s: ChaoShape = { ...CHILD_SHAPE, grow: 1, wingScale: eternal ? 2.2 : 1 };
  const apply = (t: NubbinType, k: number) => {
    switch (t) {
      case 'swim':
        s.headFins = Math.max(s.headFins, k === 1 ? 2 : 1);
        break;
      case 'fly':
        s.wingScale = Math.max(s.wingScale, k === 1 ? 1.8 : 1.35);
        break;
      case 'run':
        s.legLength = Math.max(s.legLength, k === 1 ? 3 : 2);
        break;
      case 'power':
        s.bodyWiden = Math.max(s.bodyWiden, k === 1 ? 1 : 0);
        s.handBonus = Math.max(s.handBonus, k === 1 ? 1.2 : 0.6);
        break;
      default:
        break;
    }
  };
  apply(type, 1);
  if (second && second !== type) apply(second, 0.5);
  return s;
}

export type EyeState = 'open' | 'closed' | 'happy' | 'half' | 'dizzy' | 'wide';
export type MouthState = 'smile' | 'flat' | 'open' | 'sad' | 'none';
export type ArmPose = 'down' | 'up' | 'out' | 'swingA' | 'swingB';

export interface ChaoPose {
  /** Whole-body vertical offset in px (negative = up). */
  lift: number;
  /** Squash: 1 = normal, <1 shorter. */
  squash: number;
  legs: 'together' | 'stepA' | 'stepB' | 'tucked';
  arms: ArmPose;
  eyes: EyeState;
  mouth: MouthState;
  /** Wing flap phase 0 (rest) or 1 (raised). */
  wings: 0 | 1;
  /** Hide the lower body (in water). */
  waterline: boolean;
  /** Head tilt in px for sad and sleep poses. */
  headDrop: number;
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
    case 'idle':
      return { ...BASE, squash: frame === 1 ? 0.94 : 1 };
    case 'walk':
      return {
        ...BASE,
        legs: frame % 2 === 0 ? 'stepA' : 'stepB',
        arms: frame % 2 === 0 ? 'swingA' : 'swingB',
        lift: frame === 1 || frame === 3 ? -1 : 0,
      };
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
      return { ...BASE, eyes: 'half', mouth: 'sad', headDrop: frame === 0 ? 1 : 2, squash: 0.96 };
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
        mouth: frame === 1 ? 'open' : 'smile',
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
  }
}

export interface ChaoLook {
  colors: ChaoColors;
  shape: ChaoShape;
  parts: Record<PartSlot, string | null>;
  /** Hat id from the shop, or null. */
  hat?: string | null;
}

/** Hats sit on the crown. Five styles, drawn simply enough to read at 32 px. */
function drawHat(pc: PixelCanvas, angle: DrawnAngle, L: Layout, hat: string): void {
  const top = L.headCy - L.headRy;
  const cx = L.headCx + (angle === 'side' ? -1 : 0);
  switch (hat) {
    case 'straw':
      pc.rect(cx - 9, top + 1, 19, 2, C.cream);
      pc.rect(cx - 9, top + 2, 19, 1, C.sand);
      pc.ellipse(cx, top - 1, 5.5, 3.5, C.cream);
      pc.rect(cx - 5, top + 0, 11, 1, C.ember);
      break;
    case 'crown':
      pc.rect(cx - 4, top - 1, 9, 4, C.sunYellow);
      for (const dx of [-4, -1, 2])
        pc.tri(cx + dx, top - 1, cx + dx + 3, top - 1, cx + dx + 1.5, top - 4, C.sunYellow);
      pc.px(cx, top + 1, C.rose);
      pc.px(cx - 3, top + 1, C.water);
      pc.px(cx + 3, top + 1, C.water);
      break;
    case 'beanie':
      pc.ellipse(cx, top + 1, 7.5, 4.5, C.ember);
      pc.rect(cx - 7, top + 2, 15, 2, C.pale);
      pc.disc(cx, top - 3, 2, C.cream);
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
      break;
    default:
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
  const back = partStyle(look.parts.back);
  if (back) {
    drawBack(pc, angle, L, back, raise, front);
    return;
  }
  // Default wings sit behind the shoulders. From the front they peek out at the sides;
  // from the back they are the main feature.
  const col = look.colors;
  const scale = look.shape.wingScale;
  const y = L.headCy + L.headRy - 2 - raise;
  const wing = (cx: number, dir: 1 | -1, big: boolean) => {
    const w = Math.round((big ? 4 : 3) * scale);
    const h = Math.round((big ? 4 : 3) * scale);
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
  if (L.legLength <= 0 || pose.waterline) return;
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

function drawArms(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  look: ChaoLook,
): void {
  const col = look.colors;
  const part = partStyle(look.parts.arms);
  const shoulderY = L.bodyCy - L.bodyRy + 2;
  const hand = (x: number, y: number, dir: 1 | -1, sx: number) => {
    if (part) {
      drawArmPart(pc, sx, shoulderY, x, y, dir, part);
      return;
    }
    pc.line(sx, shoulderY, x, y, col.shade);
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
      default:
        break;
    }
    hand(hx, hy, dir, sx);
  };
  const mirror = (p: ArmPose): ArmPose =>
    p === 'swingA' ? 'swingB' : p === 'swingB' ? 'swingA' : p;
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
  const eye = (cx: number, narrow: boolean) => {
    const rx = narrow ? 1 : 1.6;
    switch (pose.eyes) {
      case 'open':
      case 'wide':
        pc.ellipse(cx, eyeY, rx, pose.eyes === 'wide' ? 3 : 2.6, col.eye);
        pc.px(cx - (narrow ? 0 : 1), eyeY - 2, col.glint);
        break;
      case 'half':
        pc.ellipse(cx, eyeY + 1, rx, 1.6, col.eye);
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
  const my = eyeY + 4;
  switch (pose.mouth) {
    case 'smile':
      pc.px(mouthX - 1, my, col.eye);
      pc.px(mouthX, my + (angle === 'side' ? 0 : 1), col.eye);
      pc.px(mouthX + 1, my, col.eye);
      break;
    case 'flat':
      pc.px(mouthX - 1, my, col.eye);
      pc.px(mouthX, my, col.eye);
      break;
    case 'open':
      pc.rect(mouthX - 1, my, 3, 2, col.eye);
      pc.px(mouthX, my + 1, C.berry);
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

/** Draw one frame into a fresh 32×32 canvas. */
export function drawChao(angle: DrawnAngle, pose: ChaoPose, look: ChaoLook): PixelCanvas {
  const pc = new PixelCanvas(CHAO_SIZE, CHAO_SIZE);
  const col = look.colors;
  const L = layout(angle, pose, look.shape);
  const tail = partStyle(look.parts.tail);
  const fromFront = angle === 'front' || angle === 'frontQuarter' || angle === 'side';

  // Back layer: wings/back part and tail behind the body for front-ish views.
  drawWings(pc, angle, pose, L, look, false);
  if (tail && fromFront) drawTail(pc, angle, L, tail);

  // Legs and body.
  drawLegs(pc, angle, pose, L, col);
  if (!pose.waterline) {
    pc.ellipse(L.bodyCx, L.bodyCy, L.bodyRx, L.bodyRy, col.body);
    pc.ellipse(L.bodyCx + 1, L.bodyCy + 1, L.bodyRx - 1, L.bodyRy - 1, col.shade);
    pc.ellipse(L.bodyCx, L.bodyCy, L.bodyRx - 1, L.bodyRy - 1, col.body);
    if (angle === 'front' || angle === 'frontQuarter') {
      pc.ellipse(L.bodyCx + (angle === 'frontQuarter' ? 1 : 0), L.bodyCy + 1, 3, 2.5, col.belly);
    }
    drawFeet(pc, angle, pose, L, col);
  } else {
    pc.ellipse(L.bodyCx, L.bodyCy - 1, L.bodyRx, 2, col.body);
  }

  if (angle === 'back' || angle === 'backQuarter') drawArms(pc, angle, pose, L, look);

  // Head.
  drawCrown(pc, angle, pose, L, col);
  drawHeadFins(pc, angle, L, col, look.shape.headFins);
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

  const ears = partStyle(look.parts.ears);
  if (ears) drawEars(pc, angle, L, ears);
  if (look.hat) drawHat(pc, angle, L, look.hat);

  if (fromFront) drawArms(pc, angle, pose, L, look);
  drawFace(pc, angle, pose, L, col);

  // Front layer: wings over the body for back views, tail in front for back views.
  drawWings(pc, angle, pose, L, look, true);
  if (tail && !fromFront) drawTail(pc, angle, L, tail);

  if (pose.waterline) {
    pc.line(L.bodyCx - 7, L.bodyCy - 1, L.bodyCx + 7, L.bodyCy - 1, C.shallows);
    pc.px(L.bodyCx - 8, L.bodyCy, C.white);
    pc.px(L.bodyCx + 8, L.bodyCy, C.white);
  }

  pc.outline(col.outline);
  return pc;
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
): ChaoLook {
  return { colors, shape: shapeFor(type, second, eternal), parts, hat };
}

export type { PartStyle };
