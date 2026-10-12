import { CLIPS, frameKey, type ClipName } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { C } from './palette';
import { PixelCanvas } from './pixel-canvas';

/**
 * The Nubbin, drawn Chao-faithfully from memory: a big round head that is most of the
 * creature, a swept-back point on the crown, a small round body, stubby arms, little
 * feet, two small wings on the back, and big dark eyes. The emote ball floats above as
 * its own sprite (see emote.ts) so moods change without rebuilding the sheet.
 *
 * Frames are 32×32 with the feet on row 30. Parts render in back-to-front order so the
 * same code serves all five drawn angles.
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

/** Adult recolours by alignment band and type. Parts and shapes come in M2. */
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
  /** Adult: a little larger. */
  grown: boolean;
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
  grown: false,
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

// ---------- geometry ----------

interface Layout {
  headCx: number;
  headCy: number;
  headRx: number;
  headRy: number;
  bodyCx: number;
  bodyCy: number;
  bodyRx: number;
  bodyRy: number;
  feetY: number;
}

function layout(angle: DrawnAngle, pose: ChaoPose): Layout {
  const g = pose.grown ? 1 : 0;
  const lift = pose.lift;
  const feetY = 30 + lift;
  const bodyRy = Math.round((5 + g) * pose.squash);
  const bodyCy = feetY - bodyRy + 1;
  const headRy = Math.round((7 + g) * pose.squash);
  const headRx = angle === 'side' ? 7 + g : 8 + g;
  const headCy = bodyCy - bodyRy - headRy + 3 + pose.headDrop;
  return {
    headCx: 16,
    headCy,
    headRx,
    headRy,
    bodyCx: angle === 'side' ? 15 : 16,
    bodyCy,
    bodyRx: angle === 'side' ? 5 + g : 6 + g,
    bodyRy,
    feetY,
  };
}

// ---------- parts ----------

function drawWings(
  pc: PixelCanvas,
  angle: DrawnAngle,
  pose: ChaoPose,
  L: Layout,
  col: ChaoColors,
  front: boolean,
): void {
  // Wings sit behind the shoulders. From the front they peek out at the sides; from the
  // back they are the main feature. `front` says whether this call draws the layer behind
  // or in front of the body.
  const raise = pose.wings === 1 ? 3 : 0;
  const y = L.headCy + L.headRy - 2 - raise;
  const wing = (cx: number, dir: 1 | -1, big: boolean) => {
    const w = big ? 4 : 3;
    const h = big ? 4 : 3;
    pc.tri(cx, y + 2, cx + dir * w, y - h, cx + dir * (w + 1), y + 2, col.wing);
    pc.px(cx + dir * 2, y, col.belly);
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
  col: ChaoColors,
): void {
  const shoulderY = L.bodyCy - L.bodyRy + 2;
  const hand = (x: number, y: number) => {
    pc.disc(x, y, 1.6, col.body);
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
    pc.line(sx, shoulderY, hx, hy, col.shade);
    hand(hx, hy);
  };
  switch (angle) {
    case 'front':
      armAt(L.bodyCx - L.bodyRx + 1, -1, pose.arms);
      armAt(
        L.bodyCx + L.bodyRx - 1,
        1,
        pose.arms === 'swingA' ? 'swingB' : pose.arms === 'swingB' ? 'swingA' : pose.arms,
      );
      break;
    case 'frontQuarter':
      armAt(L.bodyCx - L.bodyRx + 1, -1, pose.arms);
      armAt(
        L.bodyCx + L.bodyRx - 2,
        1,
        pose.arms === 'swingA' ? 'swingB' : pose.arms === 'swingB' ? 'swingA' : pose.arms,
      );
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
      // Just the far eye's edge.
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

/** Draw one Chao frame into a fresh 32×32 canvas. */
export function drawChao(angle: DrawnAngle, pose: ChaoPose, col: ChaoColors): PixelCanvas {
  const pc = new PixelCanvas(CHAO_SIZE, CHAO_SIZE);
  const L = layout(angle, pose);

  // Back layer: wings behind the body for front-ish views.
  drawWings(pc, angle, pose, L, col, false);

  // Body.
  if (!pose.waterline) {
    pc.ellipse(L.bodyCx, L.bodyCy, L.bodyRx, L.bodyRy, col.body);
    pc.ellipse(L.bodyCx + 1, L.bodyCy + 1, L.bodyRx - 1, L.bodyRy - 1, col.shade);
    pc.ellipse(L.bodyCx, L.bodyCy, L.bodyRx - 1, L.bodyRy - 1, col.body);
    if (angle === 'front' || angle === 'frontQuarter') {
      pc.ellipse(L.bodyCx + (angle === 'frontQuarter' ? 1 : 0), L.bodyCy + 1, 3, 2.5, col.belly);
    }
    drawFeet(pc, angle, pose, L, col);
  } else {
    // In the pond: only the top of the body shows above a ripple.
    pc.ellipse(L.bodyCx, L.bodyCy - 1, L.bodyRx, 2, col.body);
  }

  // Arms (behind the head for back views, in front otherwise handled by order).
  if (angle === 'back' || angle === 'backQuarter') drawArms(pc, angle, pose, L, col);

  // Head.
  drawCrown(pc, angle, pose, L, col);
  pc.ellipse(L.headCx, L.headCy, L.headRx, L.headRy, col.body);
  // Shade under the head and on the far side.
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
  // Soft highlight.
  pc.px(L.headCx - 3, L.headCy - 4, col.belly);
  pc.px(L.headCx - 4, L.headCy - 3, col.belly);

  if (angle !== 'back' && angle !== 'backQuarter') drawArms(pc, angle, pose, L, col);
  drawFace(pc, angle, pose, L, col);

  // Front layer: wings over the body for back views.
  drawWings(pc, angle, pose, L, col, true);

  if (pose.waterline) {
    // Ripple line.
    pc.line(L.bodyCx - 7, L.bodyCy - 1, L.bodyCx + 7, L.bodyCy - 1, C.shallows);
    pc.px(L.bodyCx - 8, L.bodyCy, C.white);
    pc.px(L.bodyCx + 8, L.bodyCy, C.white);
  }

  pc.outline(col.outline);
  return pc;
}

/** Every clip at every drawn angle, baked into one sheet. */
export function buildChaoSheet(col: ChaoColors, grown = false): SpriteSheet {
  const atlas = new AtlasBuilder(CHAO_SIZE, CHAO_SIZE, 10);
  for (const clip of Object.keys(CLIPS) as ClipName[]) {
    const def = CLIPS[clip];
    for (const angle of DRAWN_ANGLES) {
      for (let f = 0; f < def.frames; f++) {
        const pose = { ...poseFor(clip, f), grown };
        atlas.add(frameKey(clip, angle, f), drawChao(angle, pose, col));
      }
    }
  }
  // Reaction stills.
  for (const angle of DRAWN_ANGLES) {
    atlas.add(
      frameKey('dizzy', angle, 0),
      drawChao(angle, { ...BASE, eyes: 'dizzy', mouth: 'sad', headDrop: 1, grown }, col),
    );
    atlas.add(
      frameKey('surprised', angle, 0),
      drawChao(angle, { ...BASE, eyes: 'wide', mouth: 'open', lift: -1, arms: 'up', grown }, col),
    );
    atlas.add(
      frameKey('held', angle, 0),
      drawChao(
        angle,
        { ...BASE, eyes: 'wide', mouth: 'flat', legs: 'tucked', arms: 'out', grown },
        col,
      ),
    );
  }
  return atlas.build();
}
