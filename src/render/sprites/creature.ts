import { CLIPS, frameKey, type ClipName } from './animations';
import { DRAWN_ANGLES, type DrawnAngle } from './angles';
import { AtlasBuilder, type SpriteSheet } from './atlas';
import { poseFor, type ChaoPose } from './chao';
import {
  drawKitBody,
  drawKitExtras,
  kitAnchors,
  type KitExtra,
  type KitPlan,
} from './creature-kit-digi';
import { drawGen1b, type Gen1bPart } from './creature-gen1b';
import { C, shadeOf } from './palette';
import { PixelCanvas } from './pixel-canvas';

/**
 * A generic chibi creature drawer for the non-Chao families. Every species is a body
 * plan plus a handful of parametric features and a palette, so dozens of species share
 * one drawer and still read as themselves at 32 px: colour, silhouette, ears, tail,
 * crest, wings and markings carry the likeness. Frames are 32×32 with feet on row 30.
 */
export type BodyPlan =
  'round' | 'biped' | 'tall' | 'shell' | 'serpent' | 'slug' | 'stalk' | KitPlan;

export type Ears =
  'none' | 'tallPointed' | 'round' | 'roundBig' | 'prongs' | 'horns' | 'fins' | 'catTips' | 'stubs';
export type Tail =
  | 'none'
  | 'lightning'
  | 'lightningCurl'
  | 'curl'
  | 'ball'
  | 'stub'
  | 'spiky'
  | 'flame'
  | 'long'
  | 'club';
export type Crest =
  | 'none'
  | 'horn'
  | 'helmet'
  | 'flame'
  | 'hair'
  | 'forelock'
  | 'spikesTop'
  | 'petals'
  | 'dome'
  | 'shellTop'
  | 'bow'
  | 'antenna'
  | 'twinHorns';
export type Wings = 'none' | 'small' | 'bat' | 'feather';
export type Arms = 'stub' | 'long' | 'claws' | 'boxing' | 'none' | 'metal' | 'tentacles';
export type Legs = 'stub' | 'long' | 'none';
export type Eyes = 'dot' | 'big' | 'angry' | 'cute' | 'stalk' | 'closed';
export type Mark =
  'cheeks' | 'belly' | 'stripes' | 'star' | 'spots' | 'eyeMask' | 'chest' | 'zigzag';

export interface CreaturePalette {
  body: number;
  shade: number;
  belly: number;
  accent: number;
  accent2: number;
  eye: number;
  outline: number;
}

export interface CreatureSpec {
  plan: BodyPlan;
  /** 0.8 small baby … 1.25 big final form. */
  size: number;
  colors: CreaturePalette;
  ears: Ears;
  tail: Tail;
  crest: Crest;
  wings: Wings;
  arms: Arms;
  legs: Legs;
  eyes: Eyes;
  marks: Mark[];
  /** Extra head and body pieces from the digital-line kit (creature-kit-digi.ts). */
  extras?: readonly KitExtra[];
  /** Extra parts for the later first-generation pocket species (`creature-gen1b.ts`). */
  gen1b?: Gen1bPart[];
}

export const CREATURE_SIZE = 32;

export interface Anchors {
  headCx: number;
  headCy: number;
  headRx: number;
  headRy: number;
  bodyCx: number;
  bodyCy: number;
  bodyRx: number;
  bodyRy: number;
  feetY: number;
  /** Which side is "back" for one-sided features (tail, crest sweep). */
  dir: 1 | -1;
  /** Face visible, and how far toward the side (0 front … 1 side). */
  face: number;
  back: boolean;
  plan: BodyPlan;
}

function anchors(angle: DrawnAngle, pose: ChaoPose, spec: CreatureSpec): Anchors {
  const s = spec.size;
  const feetY = 30 + pose.lift;
  const face = angle === 'front' ? 0 : angle === 'frontQuarter' ? 0.5 : angle === 'side' ? 1 : 0;
  const back = angle === 'back' || angle === 'backQuarter';
  const dir: 1 | -1 = -1;
  let headRx = Math.round(7 * s);
  let headRy = Math.round(6.5 * s * pose.squash);
  let bodyRx = Math.round(5.5 * s);
  let bodyRy = Math.round(5 * s * pose.squash);
  let headCy: number;
  let bodyCy: number;
  switch (spec.plan) {
    case 'quad':
    case 'fish':
      return kitAnchors(spec.plan, spec, pose, { angle, feetY, face, back, dir });
    case 'round':
      headRx = Math.round(9 * s);
      headRy = Math.round(8.5 * s * pose.squash);
      bodyRx = 0;
      bodyRy = 0;
      headCy = feetY - headRy - (spec.legs === 'none' ? 0 : 2) + pose.headDrop;
      bodyCy = headCy + headRy - 2;
      break;
    case 'tall':
      headRx = Math.round(6 * s);
      headRy = Math.round(5 * s * pose.squash);
      bodyRx = Math.round(6.5 * s);
      bodyRy = Math.round(8 * s * pose.squash);
      bodyCy = feetY - bodyRy + 1 - (spec.legs === 'none' ? 0 : 1);
      headCy = bodyCy - bodyRy - headRy + 3 + pose.headDrop;
      break;
    case 'shell':
      headRx = Math.round(8 * s);
      headRy = Math.round(6 * s * pose.squash);
      bodyRx = 0;
      bodyRy = 0;
      headCy = feetY - headRy - 1 + pose.headDrop;
      bodyCy = feetY - 1;
      break;
    case 'serpent':
      headRx = Math.round(5.5 * s);
      headRy = Math.round(5 * s * pose.squash);
      bodyRx = Math.round(8 * s);
      bodyRy = Math.round(5 * s);
      bodyCy = feetY - bodyRy;
      headCy = bodyCy - bodyRy - headRy + 4 + pose.headDrop;
      break;
    case 'slug':
      headRx = Math.round(9 * s);
      headRy = Math.round(5 * s * pose.squash);
      bodyRx = 0;
      bodyRy = 0;
      headCy = feetY - headRy + pose.headDrop;
      bodyCy = feetY;
      break;
    case 'stalk':
      headRx = Math.round(6.5 * s);
      headRy = Math.round(5.5 * s * pose.squash);
      bodyRx = Math.round(2.5 * s);
      bodyRy = Math.round(7 * s);
      bodyCy = feetY - bodyRy;
      headCy = bodyCy - bodyRy - headRy + 3 + pose.headDrop;
      break;
    default: {
      // biped
      bodyCy = feetY - bodyRy + 1 - (spec.legs === 'long' ? 4 : spec.legs === 'none' ? 0 : 1);
      headCy = bodyCy - bodyRy - headRy + 3 + pose.headDrop;
    }
  }
  const headCx = 16 + (angle === 'side' ? -1 : 0);
  return {
    headCx,
    headCy,
    headRx,
    headRy,
    bodyCx: 16,
    bodyCy,
    bodyRx,
    bodyRy,
    feetY,
    dir,
    face,
    back,
    plan: spec.plan,
  };
}

// ---------- feature drawers ----------

function drawEars(pc: PixelCanvas, a: Anchors, spec: CreatureSpec): void {
  const col = spec.colors;
  const top = a.headCy - a.headRy;
  const lx = a.headCx - a.headRx + 2;
  const rx = a.headCx + a.headRx - 2;
  const both: Array<[number, number]> =
    a.face >= 1
      ? [[a.headCx - 2, top]]
      : [
          [lx, top + 1],
          [rx, top + 1],
        ];
  for (const [x, y] of both) {
    switch (spec.ears) {
      case 'tallPointed':
        pc.tri(x - 3, y + 2, x + 3, y + 2, x + (x < a.headCx ? -3 : 3), y - 9, col.body);
        pc.tri(
          x + (x < a.headCx ? -2 : 2),
          y - 5,
          x + (x < a.headCx ? -3 : 3),
          y - 9,
          x + (x < a.headCx ? -1 : 1),
          y - 7,
          col.outline,
        );
        break;
      case 'round':
        pc.disc(x, y - 1, 2.6, col.body);
        pc.px(x, y - 1, col.belly);
        break;
      case 'roundBig':
        pc.disc(x + (x < a.headCx ? -2 : 2), y - 2, 3.6, col.body);
        pc.disc(x + (x < a.headCx ? -2 : 2), y - 2, 1.8, col.belly);
        break;
      case 'prongs':
        pc.rect(x - 1, y - 7, 2, 8, col.accent);
        pc.rect(x - 2, y - 8, 4, 2, col.accent);
        break;
      case 'horns':
        pc.tri(x - 2, y + 2, x + 2, y + 2, x + (x < a.headCx ? -4 : 4), y - 6, col.accent);
        break;
      case 'fins':
        pc.tri(x - 1, y + 3, x + 1, y + 3, x + (x < a.headCx ? -5 : 5), y - 4, col.accent);
        pc.px(x + (x < a.headCx ? -3 : 3), y - 2, col.accent2);
        break;
      case 'catTips':
        pc.tri(x - 2, y + 2, x + 2, y + 2, x, y - 4, col.body);
        break;
      case 'stubs':
        pc.disc(x, y - 1, 1.6, col.body);
        break;
      default:
        break;
    }
  }
}

function drawCrest(pc: PixelCanvas, a: Anchors, spec: CreatureSpec): void {
  const col = spec.colors;
  const top = a.headCy - a.headRy;
  const cx = a.headCx;
  switch (spec.crest) {
    case 'horn':
      pc.tri(cx - 2, top + 2, cx + 2, top + 2, cx + 1, top - 7, col.accent2);
      break;
    case 'helmet':
      pc.ellipse(cx, top + 2, a.headRx - 1, 4, col.accent2);
      pc.tri(cx - 2, top + 1, cx + 2, top + 1, cx, top - 6, col.accent);
      pc.px(cx - a.headRx + 3, top + 3, col.outline);
      pc.px(cx + a.headRx - 3, top + 3, col.outline);
      break;
    case 'flame':
      pc.tri(cx - 4, top + 2, cx + 4, top + 2, cx, top - 7, col.accent);
      pc.tri(cx - 2, top + 1, cx + 2, top + 1, cx + 1, top - 4, col.accent2);
      pc.px(cx + 3, top - 3, col.accent);
      pc.px(cx - 3, top - 2, col.accent);
      break;
    case 'hair':
      pc.ellipse(cx, top + 2, a.headRx, 4, col.accent);
      pc.rect(cx - a.headRx, top + 2, 3, a.headRy + 4, col.accent);
      pc.rect(cx + a.headRx - 3, top + 2, 3, a.headRy + 4, col.accent);
      pc.px(cx - 2, top - 1, col.accent2);
      break;
    case 'forelock':
      pc.disc(cx + 1, top + 1, 2.5, col.body);
      pc.px(cx + 3, top - 1, col.body);
      pc.px(cx + 4, top - 2, col.body);
      break;
    case 'spikesTop':
      for (const dx of [-4, 0, 4])
        pc.tri(cx + dx - 2, top + 2, cx + dx + 2, top + 2, cx + dx, top - 4, col.accent);
      break;
    case 'petals':
      for (const dx of [-6, -3, 0, 3, 6]) {
        pc.line(cx, top + 2, cx + dx, top - 5 + Math.abs(dx) / 2, col.accent);
        pc.disc(cx + dx, top - 5 + Math.abs(dx) / 2, 1.4, col.accent2);
      }
      break;
    case 'dome':
      pc.ellipse(cx, top + 3, a.headRx, 5, col.accent2);
      pc.px(cx - 3, top + 2, col.accent);
      pc.px(cx + 3, top + 2, col.accent);
      break;
    case 'shellTop':
      for (const dx of [-5, -2, 1, 4])
        pc.tri(cx + dx - 2, top + 3, cx + dx + 2, top + 3, cx + dx, top - 1, col.belly);
      break;
    case 'bow':
      pc.disc(cx - 2, top, 1.6, col.accent);
      pc.disc(cx + 2, top, 1.6, col.accent);
      pc.px(cx, top, col.accent2);
      break;
    case 'antenna':
      pc.line(cx, top + 1, cx + 2, top - 5, col.body);
      pc.disc(cx + 2, top - 5, 1.2, col.accent);
      break;
    case 'twinHorns':
      pc.tri(cx - 5, top + 2, cx - 2, top + 2, cx - 6, top - 5, col.accent2);
      pc.tri(cx + 2, top + 2, cx + 5, top + 2, cx + 6, top - 5, col.accent2);
      break;
    default:
      break;
  }
}

function drawTail(pc: PixelCanvas, a: Anchors, spec: CreatureSpec, behind: boolean): void {
  const col = spec.colors;
  // Tails show behind the body from the front and in front from the back.
  if (behind === a.back) return;
  const x = a.back ? a.bodyCx + 1 : a.face >= 1 ? a.bodyCx - a.bodyRx - 1 : a.bodyCx + a.bodyRx - 1;
  const y = (a.plan === 'round' ? a.headCy + 2 : a.bodyCy) + 1;
  const d: 1 | -1 = a.face >= 1 ? -1 : 1;
  switch (spec.tail) {
    case 'lightning':
      pc.line(x, y, x + d * 3, y - 2, col.accent2);
      pc.rect(x + d * 3 - (d < 0 ? 4 : 0), y - 7, 5, 5, col.accent2);
      pc.rect(x + d * 5 - (d < 0 ? 3 : 0), y - 10, 4, 4, col.accent2);
      pc.px(x + d * 2, y - 1, col.outline);
      break;
    case 'lightningCurl':
      pc.line(x, y, x + d * 6, y - 3, col.outline);
      pc.line(x + d * 6, y - 3, x + d * 7, y - 9, col.outline);
      pc.disc(x + d * 7, y - 10, 2.5, col.accent2);
      pc.px(x + d * 7, y - 10, col.outline);
      break;
    case 'curl':
      pc.line(x, y, x + d * 3, y - 1, col.body);
      pc.disc(x + d * 4, y - 3, 1.8, col.body);
      break;
    case 'ball':
      pc.line(x, y - 1, x + d * 4, y - 6, col.outline);
      pc.disc(x + d * 5, y - 8, 3.2, col.body);
      pc.px(x + d * 4, y - 9, col.belly);
      break;
    case 'stub':
      pc.tri(x, y - 2, x, y + 2, x + d * 4, y, col.body);
      break;
    case 'spiky':
      pc.line(x, y, x + d * 7, y - 2, col.body);
      for (let i = 1; i <= 6; i += 2) pc.px(x + d * i, y - 1, col.outline);
      pc.tri(x + d * 6, y - 4, x + d * 6, y, x + d * 9, y - 2, col.body);
      break;
    case 'flame':
      pc.line(x, y, x + d * 4, y - 3, col.body);
      pc.tri(x + d * 3, y - 1, x + d * 6, y - 1, x + d * 5, y - 8, col.accent);
      pc.px(x + d * 5, y - 5, col.accent2);
      break;
    case 'long':
      pc.line(x, y, x + d * 5, y + 1, col.body);
      pc.line(x + d * 5, y + 1, x + d * 9, y - 1, col.body);
      pc.px(x + d * 9, y - 1, col.shade);
      break;
    case 'club':
      pc.line(x, y, x + d * 5, y - 1, col.body);
      pc.disc(x + d * 6, y - 1, 2.2, col.shade);
      break;
    default:
      break;
  }
}

function drawWings(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  pose: ChaoPose,
  behind: boolean,
): void {
  if (spec.wings === 'none') return;
  if (behind === a.back) return;
  const col = spec.colors;
  const raise = pose.wings === 1 ? 3 : 0;
  const y = a.headCy + a.headRy - 2 - raise;
  const size = spec.wings === 'bat' ? 7 : spec.wings === 'feather' ? 6 : 4;
  const wing = (cx: number, d: 1 | -1) => {
    if (spec.wings === 'bat') {
      pc.tri(cx, y + 2, cx + d * size, y - size, cx + d * (size + 2), y + 3, col.accent2);
      pc.line(cx + d * 2, y, cx + d * (size + 1), y + 2, col.outline);
    } else if (spec.wings === 'feather') {
      pc.tri(cx, y + 2, cx + d * size, y - size + 1, cx + d * (size + 2), y + 2, col.belly);
      pc.line(cx + d * 2, y + 1, cx + d * (size + 1), y + 1, col.accent);
    } else {
      pc.tri(cx, y + 2, cx + d * size, y - size, cx + d * (size + 1), y + 2, col.belly);
    }
  };
  if (a.face >= 1) wing(a.headCx - a.headRx + 1, -1);
  else if (a.back) {
    wing(a.headCx - 2, -1);
    wing(a.headCx + 2, 1);
  } else {
    wing(a.headCx - a.headRx + 1, -1);
    wing(a.headCx + a.headRx - 1, 1);
  }
}

function drawArmsLegs(pc: PixelCanvas, a: Anchors, spec: CreatureSpec, pose: ChaoPose): void {
  const col = spec.colors;
  if (spec.legs !== 'none' && !pose.waterline) {
    const yTop = a.bodyCy + a.bodyRy - 2;
    const len = spec.legs === 'long' ? 6 : 2;
    const step = pose.legs === 'stepA' ? -1 : pose.legs === 'stepB' ? 1 : 0;
    const spread = a.face >= 1 ? 2 : 4;
    for (const d of [-1, 1] as const) {
      const lx = a.bodyCx + d * spread - 1;
      const dy = pose.legs === 'tucked' ? 0 : step * d;
      pc.rect(lx, yTop, 2, len + 1 + dy, col.shade);
      pc.ellipse(lx + 1, a.feetY + dy, 2.5, 1.5, col.body);
    }
  }
  if (spec.arms === 'none') return;
  const sy = a.bodyCy - a.bodyRy + 2;
  const posePick = pose.arms;
  const hand = (sx: number, d: 1 | -1) => {
    let hx = sx + d * 2;
    let hy = sy + 3;
    if (posePick === 'up') {
      hx = sx + d * 3;
      hy = sy - 5;
    } else if (posePick === 'out') {
      hx = sx + d * 4;
      hy = sy;
    } else if (posePick === 'swingA') hy = sy + 1;
    else if (posePick === 'swingB') hy = sy + 4;
    switch (spec.arms) {
      case 'long':
        pc.line(sx, sy, hx + d, hy + 2, col.body);
        pc.disc(hx + d, hy + 2, 1.6, col.body);
        break;
      case 'claws':
        pc.line(sx, sy, hx, hy, col.body);
        pc.tri(hx - 1, hy, hx + 1, hy, hx + d * 3, hy + 3, col.accent2);
        pc.tri(hx - 1, hy - 1, hx + 1, hy - 1, hx + d * 3, hy - 3, col.accent2);
        break;
      case 'boxing':
        pc.line(sx, sy, hx, hy, col.body);
        pc.disc(hx + d, hy, 2.4, col.accent);
        break;
      case 'metal':
        pc.line(sx, sy, hx, hy, col.body);
        pc.disc(hx + d, hy, 2.6, C.lilacGrey);
        pc.px(hx + d, hy - 1, C.pale);
        break;
      case 'tentacles':
        for (let i = 0; i < 2; i++)
          pc.line(sx, sy + i * 2, hx + d * (2 + i), hy + 3 + i, col.shade);
        break;
      default:
        pc.line(sx, sy, hx, hy, col.shade);
        pc.disc(hx, hy, 1.5, col.body);
    }
  };
  if (a.face >= 1) hand(a.bodyCx + 2, 1);
  else {
    hand(a.bodyCx - a.bodyRx + 1, -1);
    hand(a.bodyCx + a.bodyRx - 1, 1);
  }
}

function drawFace(pc: PixelCanvas, a: Anchors, spec: CreatureSpec, pose: ChaoPose): void {
  if (a.back) return;
  const col = spec.colors;
  const ey = a.headCy + (spec.plan === 'round' ? 0 : 1);
  const eyeAt = (cx: number, narrow: boolean) => {
    if (pose.eyes === 'closed' || spec.eyes === 'closed') {
      pc.line(cx - 1, ey + 1, cx + 1, ey + 1, col.eye);
      return;
    }
    if (pose.eyes === 'happy') {
      pc.px(cx - 1, ey + 1, col.eye);
      pc.px(cx, ey, col.eye);
      pc.px(cx + 1, ey + 1, col.eye);
      return;
    }
    if (pose.eyes === 'dizzy') {
      pc.px(cx - 1, ey - 1, col.eye);
      pc.px(cx + 1, ey + 1, col.eye);
      pc.px(cx + 1, ey - 1, col.eye);
      pc.px(cx - 1, ey + 1, col.eye);
      return;
    }
    switch (spec.eyes) {
      case 'big': {
        const rx = narrow ? 1 : 1.6;
        const ry = pose.eyes === 'half' ? 1.5 : 2.4;
        pc.ellipse(cx, ey, rx, ry, col.eye);
        // Iris, pupil and two glints on the fine grid.
        pc.ellipse(cx + 0.15, ey + 0.6, rx * 0.6, ry * 0.55, shadeOf(col.accent));
        pc.ellipse(cx + 0.15, ey + 0.8, rx * 0.3, ry * 0.3, col.eye);
        pc.ellipse(cx - (narrow ? 0.2 : 0.6), ey - 1.2, narrow ? 0.4 : 0.55, 0.7, C.white);
        pc.dot(cx + 0.5, ey + 1.1, C.white);
        break;
      }
      case 'cute': {
        const rx = narrow ? 0.9 : 1.3;
        pc.ellipse(cx, ey, rx, 1.8, col.eye);
        pc.ellipse(cx + 0.1, ey + 0.5, rx * 0.55, 1.0, shadeOf(col.accent));
        pc.ellipse(cx - 0.4, ey - 0.9, 0.45, 0.6, C.white);
        break;
      }
      case 'angry': {
        // A narrowed eye under a slanted brow, with an iris and a hard glint.
        const rx = narrow ? 1.1 : 1.7;
        pc.ellipse(cx, ey + 0.5, rx, 1.4, col.eye);
        pc.ellipse(cx + 0.2, ey + 0.7, rx * 0.55, 0.9, shadeOf(col.accent));
        pc.ellipse(cx + 0.2, ey + 0.8, rx * 0.25, 0.5, col.eye);
        pc.dot(cx - 0.6, ey, C.white);
        pc.thinLine(cx - rx - 0.5, ey - 0.6, cx + rx * 0.6, ey - 1.6, col.outline);
        break;
      }
      case 'stalk':
        pc.line(cx, ey - 2, cx + (cx < a.headCx ? -1 : 1), ey - 6, col.body);
        pc.disc(cx + (cx < a.headCx ? -1 : 1), ey - 7, 1.6, C.white);
        pc.px(cx + (cx < a.headCx ? -1 : 1), ey - 7, col.eye);
        break;
      default:
        // Dot eyes: a small bead with a glint.
        pc.ellipse(cx + 0.5, ey + 1, 0.8, 1.1, col.eye);
        pc.dot(cx + 0.2, ey + 0.4, C.white);
    }
  };
  const spread = Math.round(a.headRx * 0.55);
  if (a.face >= 1) eyeAt(a.headCx + spread - 1, true);
  else if (a.face > 0) {
    eyeAt(a.headCx - 1, false);
    eyeAt(a.headCx + spread + 1, true);
  } else {
    eyeAt(a.headCx - spread, false);
    eyeAt(a.headCx + spread, false);
  }
  // Mouth.
  const mx = a.headCx + (a.face > 0 ? 2 : 0);
  const my = ey + 4;
  switch (pose.mouth) {
    case 'open':
      pc.rect(mx - 1, my, 3, 2, col.eye);
      break;
    case 'sad':
      pc.px(mx - 1, my + 1, col.eye);
      pc.px(mx, my, col.eye);
      pc.px(mx + 1, my + 1, col.eye);
      break;
    case 'flat':
      pc.px(mx - 1, my, col.eye);
      pc.px(mx, my, col.eye);
      break;
    case 'none':
      break;
    default:
      pc.px(mx - 1, my, col.eye);
      pc.px(mx + 1, my, col.eye);
      pc.px(mx, my + 1, col.eye);
  }
  if (spec.marks.includes('cheeks')) {
    pc.disc(a.headCx - spread - 2, ey + 3, 1.3, col.accent);
    if (a.face < 1) pc.disc(a.headCx + spread + 2, ey + 3, 1.3, col.accent);
  }
}

function drawMarks(pc: PixelCanvas, a: Anchors, spec: CreatureSpec): void {
  const col = spec.colors;
  const bodyTop = a.bodyCy - a.bodyRy;
  for (const m of spec.marks) {
    switch (m) {
      case 'belly':
        if (!a.back)
          pc.ellipse(
            a.bodyCx + (a.face > 0 ? 1 : 0),
            a.bodyCy + 1,
            Math.max(2, a.bodyRx - 2),
            Math.max(2, a.bodyRy - 2),
            col.belly,
          );
        break;
      case 'chest':
        if (!a.back)
          pc.ellipse(a.headCx, a.headCy + a.headRy - 2, Math.max(2, a.headRx - 3), 2.5, col.belly);
        break;
      case 'stripes':
        for (let y = bodyTop + 2; y < a.bodyCy + a.bodyRy - 1; y += 3) {
          pc.line(a.bodyCx - a.bodyRx + 1, y, a.bodyCx + a.bodyRx - 1, y, col.outline);
        }
        break;
      case 'zigzag':
        for (let y = a.headCy - 2; y < a.headCy + a.headRy - 1; y += 3) {
          pc.line(a.headCx - a.headRx + 2, y, a.headCx + a.headRx - 2, y + 1, col.accent);
        }
        break;
      case 'star':
        if (!a.back) {
          pc.px(a.headCx - 3, a.headCy + 3, col.accent);
          pc.px(a.headCx + 3, a.headCy + 2, col.accent2);
          pc.px(a.headCx, a.headCy + 5, col.accent);
        }
        break;
      case 'spots':
        pc.px(a.headCx - 3, a.headCy - 3, col.shade);
        pc.px(a.headCx + 4, a.headCy - 1, col.shade);
        pc.px(a.headCx + 1, a.headCy + 4, col.shade);
        break;
      case 'eyeMask':
        if (!a.back)
          pc.rect(a.headCx - a.headRx + 2, a.headCy - 1, a.headRx * 2 - 3, 3, col.accent);
        break;
      default:
        break;
    }
  }
}

function drawBody(pc: PixelCanvas, a: Anchors, spec: CreatureSpec, pose: ChaoPose): void {
  const col = spec.colors;
  const blob = (cx: number, cy: number, rx: number, ry: number) => {
    if (rx <= 0 || ry <= 0) return;
    pc.ellipse(cx, cy, rx, ry, col.body);
    pc.ellipse(cx + 1, cy + 1, rx - 1, ry - 1, col.shade);
    pc.ellipse(cx, cy, rx - 1, ry - 1, col.body);
    pc.px(cx - Math.round(rx * 0.5), cy - Math.round(ry * 0.5), col.belly);
  };
  switch (spec.plan) {
    case 'quad':
    case 'fish':
      drawKitBody(pc, a, spec, pose);
      return;
    case 'shell': {
      // Legs or tentacles under a domed shell, face below the rim.
      if (!pose.waterline) {
        for (const dx of [-5, -2, 1, 4])
          pc.line(
            a.headCx + dx,
            a.feetY - 3,
            a.headCx + dx + (dx < 0 ? -1 : 1),
            a.feetY,
            col.shade,
          );
      }
      pc.ellipse(a.headCx, a.headCy + 2, a.headRx - 1, 3, col.body);
      pc.ellipse(a.headCx, a.headCy - 1, a.headRx, a.headRy, col.accent2);
      pc.ellipse(a.headCx - 1, a.headCy - 2, a.headRx - 2, a.headRy - 2, col.accent);
      if (spec.marks.includes('spots'))
        pc.ellipse(a.headCx, a.headCy - 1, a.headRx - 4, a.headRy - 4, col.accent2);
      return;
    }
    case 'serpent': {
      // A coil: two humps behind the head.
      const d = a.face >= 1 ? -1 : 1;
      pc.ellipse(a.bodyCx + d * 4, a.bodyCy + 1, a.bodyRx - 2, a.bodyRy, col.body);
      pc.ellipse(a.bodyCx - d * 5, a.bodyCy + 2, a.bodyRx - 3, a.bodyRy - 1, col.shade);
      pc.ellipse(a.bodyCx + d * 1, a.bodyCy + 2, 3, a.bodyRy - 2, col.belly);
      blob(a.headCx, a.headCy, a.headRx, a.headRy);
      return;
    }
    case 'slug': {
      pc.ellipse(a.headCx, a.headCy, a.headRx, a.headRy, col.body);
      pc.ellipse(a.headCx + 1, a.headCy + 1, a.headRx - 1, a.headRy - 1, col.shade);
      pc.ellipse(a.headCx, a.headCy, a.headRx - 1, a.headRy - 1, col.body);
      pc.ellipse(a.headCx, a.headCy + a.headRy - 1, a.headRx, 1.5, col.shade);
      return;
    }
    case 'stalk': {
      pc.rect(a.bodyCx - a.bodyRx, a.bodyCy - a.bodyRy, a.bodyRx * 2, a.bodyRy * 2, col.shade);
      pc.rect(
        a.bodyCx - a.bodyRx + 1,
        a.bodyCy - a.bodyRy,
        a.bodyRx * 2 - 2,
        a.bodyRy * 2,
        col.body,
      );
      pc.ellipse(a.bodyCx, a.feetY - 1, a.bodyRx + 3, 2, col.shade);
      blob(a.headCx, a.headCy, a.headRx, a.headRy);
      return;
    }
    default: {
      if (!pose.waterline) blob(a.bodyCx, a.bodyCy, a.bodyRx, a.bodyRy);
      else if (a.bodyRx > 0) pc.ellipse(a.bodyCx, a.bodyCy - 1, a.bodyRx, 2, col.body);
      blob(a.headCx, a.headCy, a.headRx, a.headRy);
    }
  }
}

/** Draw one frame of a species into a fresh 32×32 canvas. */
export function drawCreature(angle: DrawnAngle, pose: ChaoPose, spec: CreatureSpec): PixelCanvas {
  const pc = new PixelCanvas(CREATURE_SIZE, CREATURE_SIZE);
  const a = anchors(angle, pose, spec);
  drawWings(pc, a, spec, pose, true);
  drawTail(pc, a, spec, true);
  drawKitExtras(pc, a, spec, true);
  drawGen1b(pc, a, spec, pose, 'behind');
  if (spec.plan === 'biped' || spec.plan === 'tall' || spec.plan === 'round')
    drawArmsLegs(pc, a, spec, pose);
  drawBody(pc, a, spec, pose);
  drawMarks(pc, a, spec);
  drawGen1b(pc, a, spec, pose, 'mid');
  drawEars(pc, a, spec);
  drawCrest(pc, a, spec);
  drawFace(pc, a, spec, pose);
  drawKitExtras(pc, a, spec, false);
  drawWings(pc, a, spec, pose, false);
  drawTail(pc, a, spec, false);
  drawGen1b(pc, a, spec, pose, 'front');
  if (pose.waterline) {
    pc.line(a.headCx - 8, a.bodyCy - 1, a.headCx + 8, a.bodyCy - 1, C.shallows);
  }
  pc.finish(spec.colors.outline, [spec.colors.eye, C.white]);
  return pc;
}

/** Every clip at every drawn angle, baked into one sheet, with the same keys as the Chao. */
export function buildCreatureSheet(spec: CreatureSpec): SpriteSheet {
  const atlas = new AtlasBuilder(CREATURE_SIZE, CREATURE_SIZE, 10);
  for (const clip of Object.keys(CLIPS) as ClipName[]) {
    for (const angle of DRAWN_ANGLES) {
      for (let f = 0; f < CLIPS[clip].frames; f++) {
        atlas.add(frameKey(clip, angle, f), drawCreature(angle, poseFor(clip, f), spec));
      }
    }
  }
  const base = poseFor('idle', 0);
  for (const angle of DRAWN_ANGLES) {
    atlas.add(
      frameKey('dizzy', angle, 0),
      drawCreature(angle, { ...base, eyes: 'dizzy', mouth: 'sad', headDrop: 1 }, spec),
    );
    atlas.add(
      frameKey('surprised', angle, 0),
      drawCreature(angle, { ...base, eyes: 'wide', mouth: 'open', lift: -1, arms: 'up' }, spec),
    );
    atlas.add(
      frameKey('held', angle, 0),
      drawCreature(
        angle,
        { ...base, eyes: 'wide', mouth: 'flat', legs: 'tucked', arms: 'out' },
        spec,
      ),
    );
  }
  return atlas.build();
}
