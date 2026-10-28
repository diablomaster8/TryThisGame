import type { ChaoPose } from './chao';
import type { Anchors, CreatureSpec } from './creature';
import { C, shadeOf } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * Extra kit parts for the second half of the first-generation pocket line (agent pkB):
 * the clam shell, star points, extra heads, held bones and leeks, pincers, magnets, a
 * single big eye and the rest that the shared kit in `creature.ts` has no slot for. A
 * species lists them in `CreatureSpec.gen1b`; this file draws them in pixels and
 * `render3d/art-species-gen1b.ts` sculpts the same list in 3D. The creature drawer calls
 * `drawGen1b` three times: behind the body, over the body (before the face), and on top.
 */
export type Gen1bPart =
  | 'shellPair'
  | 'skull'
  | 'bone'
  | 'leek'
  | 'pendulum'
  | 'fishTail'
  | 'pincers'
  | 'bigPincer'
  | 'scythes'
  | 'star5'
  | 'star10'
  | 'gem'
  | 'pearl'
  | 'magnets'
  | 'cyclops'
  | 'palm'
  | 'vines'
  | 'aura'
  | 'backShell'
  | 'pouchBaby'
  | 'pouchEgg'
  | 'ruff'
  | 'spikeRuff'
  | 'tongue'
  | 'beak'
  | 'snout'
  | 'lowerHalf'
  | 'barbels'
  | 'boulders'
  | 'floatHands'
  | 'grin'
  | 'pincerHead';

export type Gen1bLayer = 'behind' | 'mid' | 'front';

/** Eye row, as the face drawer places it. */
const eyeY = (a: Anchors, spec: CreatureSpec) => a.headCy + (spec.plan === 'round' ? 0 : 1);
const mouthX = (a: Anchors) => a.headCx + (a.face > 0 ? 2 : 0);

/** Where a held item sits: the right hand (the one nearer the viewer from the side). */
function handAt(a: Anchors): [number, number] {
  if (a.bodyRx > 0) {
    const x = a.face >= 1 ? a.bodyCx + 4 : a.bodyCx + a.bodyRx + 1;
    return [x, a.bodyCy - a.bodyRy + 5];
  }
  return [a.face >= 1 ? a.headCx + 3 : a.headCx + a.headRx - 1, a.headCy + a.headRy - 2];
}

/** Both claw or hand positions, outermost first. */
function handsAt(a: Anchors): Array<[number, number, 1 | -1]> {
  const y = a.bodyRx > 0 ? a.bodyCy - a.bodyRy + 5 : a.headCy + 3;
  const w = a.bodyRx > 0 ? a.bodyRx + 2 : a.headRx + 2;
  if (a.face >= 1) return [[a.bodyCx + 4, y, 1]];
  return [
    [a.bodyCx - w, y, -1],
    [a.bodyCx + w, y, 1],
  ];
}

/** Fill the part of an ellipse below row `from` (design units), on the fine grid. */
function lowerEllipse(
  pc: PixelCanvas,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  from: number,
  col: number,
): void {
  for (let y = Math.max(from, cy - ry); y < cy + ry; y += 0.5) {
    const k = (y + 0.25 - cy) / ry;
    if (k * k >= 1) continue;
    const w = rx * Math.sqrt(1 - k * k);
    pc.rect(cx - w, y, w * 2, 0.5, col);
  }
}

function upperEllipse(
  pc: PixelCanvas,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  to: number,
  col: number,
): void {
  for (let y = cy - ry; y < Math.min(to, cy + ry); y += 0.5) {
    const k = (y + 0.25 - cy) / ry;
    if (k * k >= 1) continue;
    const w = rx * Math.sqrt(1 - k * k);
    pc.rect(cx - w, y, w * 2, 0.5, col);
  }
}

function star(pc: PixelCanvas, a: Anchors, turn: number, reach: number, col: number): void {
  for (let i = 0; i < 5; i++) {
    const t = -Math.PI / 2 + turn + (i * Math.PI * 2) / 5;
    const tip = [
      a.headCx + Math.cos(t) * (a.headRx + reach),
      a.headCy + Math.sin(t) * (a.headRy + reach),
    ];
    const base = (d: number) => [
      a.headCx + Math.cos(t + d) * (a.headRx - 1),
      a.headCy + Math.sin(t + d) * (a.headRy - 1),
    ];
    const b1 = base(0.42);
    const b2 = base(-0.42);
    pc.tri(b1[0]!, b1[1]!, b2[0]!, b2[1]!, tip[0]!, tip[1]!, col);
  }
}

/** Behind-the-body parts swap to the front when the creature is seen from the back. */
function behindPass(layer: Gen1bLayer, a: Anchors): boolean {
  return a.back ? layer === 'front' : layer === 'behind';
}

export function drawGen1b(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  pose: ChaoPose,
  layer: Gen1bLayer,
): void {
  const parts = spec.gen1b;
  if (!parts || parts.length === 0) return;
  const col = spec.colors;
  const top = a.headCy - a.headRy;
  const ey = eyeY(a, spec);
  const mx = mouthX(a);
  const side = a.face >= 1;
  for (const part of parts) {
    switch (part) {
      // ---- around and behind ----
      case 'shellPair':
        if (!behindPass(layer, a)) break;
        pc.ellipse(a.headCx, a.headCy - 1, a.headRx + 4, a.headRy + 4, col.accent);
        for (let k = -2; k <= 2; k++)
          pc.line(a.headCx + k * 1.5, a.headCy, a.headCx + k * 3.5, top - 4, col.accent2);
        pc.ellipse(a.headCx, a.headCy + a.headRy + 1, a.headRx + 3, 2.5, col.accent);
        break;
      case 'star10':
      case 'star5':
        if (layer !== 'behind') break;
        // The second star sits behind the first.
        if (part === 'star10') star(pc, a, Math.PI / 5, 4, col.shade);
        star(pc, a, 0, 5, col.body);
        break;
      case 'aura':
        if (layer !== 'behind') break;
        for (let i = 0; i < 9; i++) {
          const t = (i / 9) * Math.PI * 2 + 0.3;
          const r = i % 2 ? 2.2 : 1.6;
          pc.disc(
            a.headCx + Math.cos(t) * (a.headRx + 2),
            a.headCy + Math.sin(t) * (a.headRy + 2),
            r,
            col.accent,
          );
        }
        break;
      case 'boulders': {
        // A chain of rocks over the coils, so the body reads as boulders.
        if (layer !== 'mid') break;
        const d = side ? -1 : 1;
        [3.4, 3.8, 3.2].forEach((r, i) => {
          const x = a.bodyCx + d * (i - 1) * 6;
          const y = a.bodyCy + 1 + (i === 1 ? 1 : 0);
          pc.disc(x, y, r + 0.6, col.outline);
          pc.disc(x, y, r, col.body);
          pc.disc(x + 0.8, y + 0.8, r - 1, col.shade);
          pc.disc(x - 0.4, y - 0.4, r - 1.2, col.body);
        });
        break;
      }
      case 'backShell': {
        if (!behindPass(layer, a)) break;
        const rx = Math.max(a.bodyRx, a.headRx - 2) + 3;
        const cy = a.bodyRx > 0 ? a.bodyCy - 1 : a.headCy + 2;
        pc.ellipse(a.bodyCx, cy, rx, (a.bodyRy || a.headRy - 2) + 2, col.accent);
        for (const dx of [-4, 0, 4]) pc.disc(a.bodyCx + dx, cy - 3, 1.3, col.accent2);
        break;
      }
      case 'fishTail': {
        if (!behindPass(layer, a)) break;
        const rx = a.bodyRx || a.headRx;
        const cx = a.bodyRx ? a.bodyCx : a.headCx;
        const x = a.back ? cx + 1 : side ? cx - rx - 1 : cx + rx - 1;
        const y = (a.bodyRx ? a.bodyCy : a.headCy + 2) + 1;
        const d = side ? -1 : 1;
        pc.tri(x, y - 1, x + d * 6, y - 6, x + d * 3, y, col.accent);
        pc.tri(x, y + 1, x + d * 6, y + 5, x + d * 3, y, col.accent);
        break;
      }
      // ---- over the body, under the face ----
      case 'lowerHalf':
        if (layer !== 'mid') break;
        if (a.bodyRx > 0) {
          lowerEllipse(pc, a.bodyCx, a.bodyCy, a.bodyRx, a.bodyRy, a.bodyCy - 1, col.accent2);
        } else {
          lowerEllipse(pc, a.headCx, a.headCy, a.headRx, a.headRy, a.headCy + 1, col.accent2);
          pc.line(
            a.headCx - a.headRx + 1,
            a.headCy + 1,
            a.headCx + a.headRx - 1,
            a.headCy + 1,
            col.outline,
          );
        }
        break;
      case 'vines':
        if (layer !== 'mid') break;
        for (let i = 0; i < 16; i++) {
          const t = i * 2.39996;
          const r = 0.25 + ((i * 37) % 10) / 13;
          const x = a.headCx + Math.cos(t) * a.headRx * r;
          const y = a.headCy + Math.sin(t) * a.headRy * r;
          pc.line(
            x,
            y,
            x + Math.cos(t + 1.3) * 2.5,
            y + Math.sin(t + 1.3) * 2,
            i % 3 ? col.shade : col.accent,
          );
        }
        for (let i = 0; i < 7; i++) {
          const t = -Math.PI + (i / 6) * Math.PI;
          pc.line(
            a.headCx + Math.cos(t) * (a.headRx - 1),
            a.headCy + Math.sin(t) * (a.headRy - 1),
            a.headCx + Math.cos(t) * (a.headRx + 2),
            a.headCy + Math.sin(t) * (a.headRy + 2),
            col.body,
          );
        }
        break;
      case 'ruff':
      case 'spikeRuff': {
        if (layer !== 'mid') break;
        const y = a.headCy + a.headRy - 1;
        const c = part === 'ruff' ? col.belly : col.body;
        pc.ellipse(a.headCx, y, a.headRx - 1, 2.5, c);
        const n = part === 'ruff' ? 5 : 4;
        for (let i = 0; i < n; i++) {
          const x = a.headCx - a.headRx + 2 + (i * (a.headRx * 2 - 4)) / (n - 1);
          pc.tri(x - 1.5, y, x + 1.5, y, x, y + (part === 'ruff' ? 4 : 5), c);
        }
        if (part === 'spikeRuff')
          for (const d of [-1, 1])
            pc.tri(
              a.headCx + d * (a.headRx - 2),
              y - 2,
              a.headCx + d * (a.headRx - 2),
              y + 2,
              a.headCx + d * (a.headRx + 4),
              y + 1,
              c,
            );
        break;
      }
      case 'pouchBaby':
      case 'pouchEgg': {
        if (layer !== 'mid' || a.back) break;
        const cx = a.bodyRx > 0 ? a.bodyCx : a.headCx;
        const cy = a.bodyRx > 0 ? a.bodyCy + 2 : a.headCy + a.headRy - 1;
        const rx = a.bodyRx > 0 ? Math.max(3, a.bodyRx - 2) : 4;
        pc.ellipse(cx, cy, rx, 3, col.belly);
        if (part === 'pouchBaby') {
          pc.disc(cx, cy - 2, 2.4, col.body);
          pc.px(cx - 1, cy - 2, col.eye);
          pc.px(cx + 1, cy - 2, col.eye);
        } else {
          pc.ellipse(cx, cy - 1, 1.8, 2.2, C.white);
        }
        pc.line(cx - rx + 1, cy, cx + rx - 1, cy, col.shade);
        break;
      }
      case 'pearl':
        if (layer === 'mid' && !a.back) pc.disc(a.headCx, a.headCy + a.headRy + 1, 1.4, C.skyLight);
        break;
      // ---- on top ----
      case 'cyclops':
      case 'gem':
        if (layer !== 'front' || a.back) break;
        // Cover the pair of eyes (and the mouth) the face drawer put down.
        pc.rect(
          a.headCx - a.headRx + 2,
          ey - 3,
          a.headRx * 2 - 4,
          part === 'gem' ? 9 : 6,
          col.body,
        );
        if (part === 'cyclops') {
          const x = a.headCx + (side ? a.headRx * 0.45 : 0);
          pc.ellipse(x, ey, side ? 1.6 : 2.6, 2.6, C.white);
          pc.ellipse(x + 0.2, ey + 0.3, side ? 0.9 : 1.2, 1.3, col.eye);
          pc.dot(x - 0.6, ey - 0.8, C.white);
        } else {
          const x = a.headCx + (side ? a.headRx * 0.45 : 0);
          pc.ellipse(x, a.headCy + 1, side ? 2 : 3.2, 3.2, C.sunYellow);
          pc.ellipse(x, a.headCy + 1, side ? 1.3 : 2.2, 2.2, C.ember);
          pc.dot(x - 0.8, a.headCy, C.white);
        }
        break;
      case 'magnets': {
        if (layer !== 'front') break;
        pc.rect(a.headCx - 1, top - 3, 2, 4, C.lilacGrey);
        pc.rect(a.headCx - 1.5, top - 3.5, 3, 1, C.pale);
        const ys = a.headCy;
        const xs: Array<[number, 1 | -1]> = side
          ? [[a.headCx + a.headRx + 1, 1]]
          : [
              [a.headCx - a.headRx - 1, -1],
              [a.headCx + a.headRx + 1, 1],
            ];
        for (const [x, d] of xs) {
          pc.rect(x - 1, ys - 3, 2, 7, C.lilacGrey);
          pc.rect(x + (d > 0 ? 1 : -3), ys - 3, 2, 2, C.ember);
          pc.rect(x + (d > 0 ? 1 : -3), ys + 2, 2, 2, C.water);
        }
        break;
      }
      case 'skull':
        if (layer !== 'front') break;
        upperEllipse(pc, a.headCx, a.headCy, a.headRx + 1, a.headRy + 1, a.headCy - 1, C.cream);
        pc.line(a.headCx - a.headRx, a.headCy - 1, a.headCx + a.headRx, a.headCy - 1, C.sand);
        for (const d of [-1, 1])
          pc.tri(
            a.headCx + d * 3,
            top + 1,
            a.headCx + d * 6,
            top + 2,
            a.headCx + d * 5,
            top - 3,
            C.cream,
          );
        if (!a.back) {
          pc.px(a.headCx - 2, a.headCy - 3, C.sand);
          pc.px(a.headCx + 2, a.headCy - 3, C.sand);
        }
        break;
      case 'bone': {
        if (layer !== 'front') break;
        const [hx, hy] = handAt(a);
        pc.rect(hx, hy - 6, 1.5, 9, C.cream);
        pc.disc(hx, hy - 6, 1.3, C.cream);
        pc.disc(hx + 1.5, hy - 6, 1.3, C.cream);
        pc.disc(hx, hy + 3, 1.3, C.cream);
        pc.disc(hx + 1.5, hy + 3, 1.3, C.cream);
        break;
      }
      case 'leek': {
        if (layer !== 'front') break;
        const [hx, hy] = handAt(a);
        pc.line(hx, hy + 2, hx + 1, hy - 3, C.white);
        pc.line(hx + 1, hy - 3, hx + 2, hy - 8, C.leaf);
        pc.tri(hx + 1, hy - 6, hx + 4, hy - 11, hx + 3, hy - 5, C.grass);
        break;
      }
      case 'pendulum': {
        if (layer !== 'front') break;
        const [hx, hy] = handAt(a);
        const swing = pose.arms === 'swingA' ? -1 : pose.arms === 'swingB' ? 1 : 0;
        pc.thinLine(hx, hy, hx + 1 + swing, hy + 5, C.lilacGrey);
        pc.disc(hx + 1 + swing, hy + 6, 1.6, C.sunLight);
        break;
      }
      case 'pincers':
      case 'bigPincer':
        if (layer !== 'front') break;
        for (const [x, y, d] of handsAt(a)) {
          const big = part === 'bigPincer' && d > 0 ? 1.6 : 1;
          pc.disc(x, y - 1, 2.4 * big, col.accent);
          pc.disc(x + d, y + 2 * big, 1.8 * big, col.accent);
          pc.line(x, y + 0.5 * big, x + d * 3 * big, y + 0.5 * big, col.outline);
        }
        break;
      case 'scythes':
        if (layer !== 'front') break;
        for (const [x, y, d] of handsAt(a))
          pc.tri(x, y - 1, x + d * 2, y + 1, x + d * 7, y - 7, col.belly);
        break;
      case 'floatHands':
        if (layer !== 'front') break;
        for (const [x, y, d] of handsAt(a)) {
          pc.disc(x + d * 2, y, 2.2, col.body);
          pc.px(x + d * 4, y - 1, col.body);
          pc.px(x + d * 4, y + 1, col.body);
        }
        break;
      case 'palm':
        if (layer !== 'front') break;
        for (const [dx, h] of [
          [-6, 3],
          [-3, 6],
          [2, 7],
          [6, 4],
        ] as const) {
          pc.tri(a.headCx, top + 2, a.headCx + dx * 0.5, top + 1, a.headCx + dx, top - h, C.leaf);
          pc.line(a.headCx, top + 1, a.headCx + dx, top - h, C.forest);
        }
        break;
      case 'tongue':
        if (layer !== 'front' || a.back) break;
        pc.line(mx, ey + 4, mx + 2, ey + 8, C.rose);
        pc.disc(mx + 2, ey + 9, 1.8, C.rose);
        break;
      case 'beak':
        if (layer !== 'front' || a.back) break;
        if (side)
          pc.tri(
            a.headCx + a.headRx - 2,
            ey + 1,
            a.headCx + a.headRx - 2,
            ey + 4,
            a.headCx + a.headRx + 3,
            ey + 3,
            col.accent,
          );
        else pc.tri(mx - 2, ey + 2, mx + 2, ey + 2, mx, ey + 5, col.accent);
        break;
      case 'snout':
        if (layer !== 'front' || a.back) break;
        if (side) {
          pc.rect(a.headCx + a.headRx - 2, ey + 2, 4, 2, col.body);
          pc.px(a.headCx + a.headRx + 2, ey + 2.5, col.shade);
        } else {
          pc.ellipse(mx, ey + 3.5, 1.6, 2.4, col.body);
          pc.px(mx, ey + 5, col.shade);
        }
        break;
      case 'barbels':
        if (layer !== 'front' || a.back) break;
        for (const d of side ? [1] : [-1, 1])
          pc.line(mx + d * 2, ey + 3, mx + d * 6, ey + 7, col.accent2);
        break;
      case 'grin':
        if (layer !== 'front' || a.back) break;
        pc.ellipse(mx, ey + 4, side ? 2.5 : 4, 1.6, C.white);
        pc.thinLine(mx - (side ? 2.5 : 4), ey + 4, mx + (side ? 2.5 : 4), ey + 4, col.eye);
        break;
      case 'pincerHead':
        if (layer !== 'front') break;
        for (const d of side ? [1] : [-1, 1]) {
          pc.tri(
            a.headCx + d * 2,
            top + 2,
            a.headCx + d * 6,
            top + 2,
            a.headCx + d * 4,
            top - 9,
            col.accent2,
          );
          pc.px(a.headCx + d * 3, top - 3, col.outline);
          pc.px(a.headCx + d * 3.5, top - 6, col.outline);
        }
        break;
      default:
        break;
    }
  }
}

// ---------------------------------------------------------------- many heads

/**
 * A species with more than one head (R0376): every head is drawn at the same size on its
 * own neck, fanned over an arc, instead of one main head with small knobs. The first head
 * is the main one (the creature drawer gives it the eyes and the kit's head parts); the
 * rest are drawn here. `render3d/art-species-gen1b.ts` reads the same record.
 */
export interface HeadsSpec {
  /** Heads in all, the main one included. */
  count: number;
  /** Neck length, 0 (heads side by side on the body or each other) to 1 (long necks). */
  neck: number;
  /** The arc the heads fan across, in degrees. */
  spread: number;
  /** Size of each head against the main one (index 0 is the main head, 1). */
  sizes: readonly number[];
  /** `full`: the species' own eyes and mouth on every head; `simple`: bead eyes. */
  faces: 'full' | 'simple';
  /** A clutch of separate eggs (one per head, no shared body) instead of an arc. */
  cluster?: boolean;
  /** The heads poke up out of a dirt mound. */
  mound?: boolean;
  /** The extra heads are the ends of snake-necked arms, jaws open. */
  arms?: boolean;
}

/** One head as drawn: its centre and radii, whether it sits in front of the main head, its neck. */
export interface HeadSlot {
  x: number;
  y: number;
  rx: number;
  ry: number;
  front: boolean;
  /** Where the neck leaves the body; null when the head sits straight on. */
  neck: [number, number] | null;
}

/** Shrink on the main head so equal heads fit the frame (and the 3D figure stays its size). */
export function headScale(h: HeadsSpec): number {
  if (h.arms) return 1;
  if (h.cluster) return 0.68;
  if (h.mound) return 0.75;
  if (h.count >= 3) return h.neck >= 0.5 ? 0.5 : 0.62;
  return 0.78;
}

/** Height over width of each head when it is not the kit's round head: eggs, burrowers. */
export function headTall(h: HeadsSpec): number | null {
  return h.cluster ? 1.15 : h.mound ? 1.4 : null;
}

/** Arc angles in radians, main head first: the middle one for an odd count, else the left. */
export function headAngles(h: HeadsSpec): number[] {
  const sp = (h.spread * Math.PI) / 180;
  const step = h.count > 1 ? sp / (h.count - 1) : 0;
  const t = Array.from({ length: h.count }, (_, i) => -sp / 2 + i * step);
  return t.sort((p, q) => Math.abs(p) - Math.abs(q) || p - q);
}

/** Egg offsets of a clutch, in head radii: x, y (down), and whether in front of the main egg. */
export const CLUTCH: ReadonlyArray<readonly [number, number, boolean]> = [
  [0, 0, true],
  [-1.85, 0.15, true],
  [1.85, 0.15, true],
  // The top egg first, so the middle pair overlap it and keep their faces in view.
  [0, -2.75, false],
  [-0.95, -1.5, false],
  [0.95, -1.5, false],
];

/**
 * Where every head goes, the main one first, from anchors whose head is already shrunk by
 * `headScale`. Side views squeeze the arc, since the heads then line up in depth.
 */
export function headSlots(a: Anchors, h: HeadsSpec): HeadSlot[] {
  const kx = a.face >= 1 ? 0.3 : a.face > 0 ? 0.75 : 1;
  const flip = a.back ? -1 : 1;
  const r = a.headRx;
  const size = (i: number) => (h.sizes[i] ?? 1) / (h.sizes[0] ?? 1);
  const out: HeadSlot[] = [];
  if (h.cluster) {
    CLUTCH.slice(0, h.count).forEach(([dx, dy, front], i) =>
      out.push({
        x: a.headCx + dx * r * kx * flip,
        y: a.headCy + dy * a.headRy,
        rx: r * size(i),
        ry: a.headRy * size(i),
        front,
        neck: null,
      }),
    );
    return out;
  }
  if (h.arms) {
    out.push({ x: a.headCx, y: a.headCy, rx: r, ry: a.headRy, front: false, neck: null });
    for (let i = 1; i < h.count; i++) {
      const d = (i % 2 ? -1 : 1) * flip;
      const rx = r * size(i) * 0.55;
      const sx = a.bodyCx + d * (a.bodyRx - 1) * kx;
      const sy = a.bodyCy - a.bodyRy + 3;
      out.push({
        x: a.bodyCx + d * (a.bodyRx + rx - 0.5) * Math.max(kx, 0.5),
        y: a.bodyCy - a.bodyRy - 1,
        rx,
        ry: rx * 0.75,
        // From the side the far arm hides behind the body.
        front: a.face < 1 || d > 0,
        neck: [sx, sy],
      });
    }
    return out;
  }
  const th = headAngles(h);
  const sp = (h.spread * Math.PI) / 180;
  const step = h.count > 1 ? sp / (h.count - 1) : 0;
  const touch = step > 0 ? (0.92 * r) / Math.sin(step / 2) : 0;
  const body = a.bodyRx > 0;
  const ox = body ? a.bodyCx : a.headCx;
  const oy = body ? a.bodyCy - a.bodyRy + 1 : a.headCy + touch;
  let R = touch;
  if (body) R = Math.min(Math.max(touch, oy - a.headCy + h.neck * 6), oy - a.headRy - 0.5);
  th.forEach((t, i) => {
    const s = size(i);
    out.push({
      x: ox + Math.sin(t) * R * kx * flip,
      y: oy - Math.cos(t) * R,
      rx: r * s,
      ry: a.headRy * s,
      front: i === 0,
      neck: body && h.neck > 0 ? [ox + Math.sin(t) * 2 * kx * flip, oy + 1] : null,
    });
  });
  // Heads side by side on no body rest on the ground: lift the set until the lowest touches.
  const low = Math.max(...out.map((o) => o.y + o.ry));
  if (!body && low > a.feetY) for (const o of out) o.y -= low - a.feetY;
  return out;
}

/** Parts that belong to a head and so are drawn on every head with a full face. */
const HEAD_PARTS: readonly Gen1bPart[] = ['beak', 'cyclops', 'magnets', 'grin', 'snout'];

function neckLine(
  pc: PixelCanvas,
  from: [number, number],
  to: [number, number],
  bend: number,
  fill: number,
  rim: number,
): void {
  // A soft curve through a control point pushed sideways by `bend`.
  const [x0, y0] = from;
  const [x1, y1] = to;
  const cx = (x0 + x1) / 2 + bend;
  const cy = (y0 + y1) / 2;
  for (const [r, c] of [
    [1.9, rim],
    [1.3, fill],
  ] as const)
    for (let k = 0; k <= 1.001; k += 0.08) {
      const x = (1 - k) * (1 - k) * x0 + 2 * (1 - k) * k * cx + k * k * x1;
      const y = (1 - k) * (1 - k) * y0 + 2 * (1 - k) * k * cy + k * k * y1;
      pc.disc(x, y, r, c);
    }
}

/** The zigzag cracks on a clutch egg's crown. */
export function eggCracks(
  pc: PixelCanvas,
  s: { x: number; y: number; rx: number; ry: number },
): void {
  const y = s.y - s.ry * 0.55;
  pc.thinLine(s.x - s.rx * 0.6, y, s.x - s.rx * 0.2, y + 1, C.darkPlum);
  pc.thinLine(s.x - s.rx * 0.2, y + 1, s.x + s.rx * 0.2, y - 0.5, C.darkPlum);
  pc.thinLine(s.x + s.rx * 0.2, y - 0.5, s.x + s.rx * 0.6, y + 0.5, C.darkPlum);
}

/**
 * Draw the extra heads (not the main one) that sit behind (`front` false) or in front of
 * the main head, each with its neck and face. `face` is the creature drawer's own face
 * routine, so a `full` head looks exactly like the main one.
 */
export function drawHeads(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  pose: ChaoPose,
  front: boolean,
  face: (at: Anchors, sub: CreatureSpec) => void,
): void {
  const h = spec.heads;
  const slots = a.heads;
  if (!h || !slots) return;
  const col = spec.colors;
  const sub: CreatureSpec = {
    ...spec,
    gen1b: (spec.gen1b ?? []).filter((p) => HEAD_PARTS.includes(p)),
  };
  slots.forEach((s, i) => {
    if (i === 0 || s.front !== front) return;
    const at: Anchors = { ...a, headCx: s.x, headCy: s.y, headRx: s.rx, headRy: s.ry };
    const tint = h.arms ? (i % 2 ? col.accent : col.accent2) : col.body;
    const bend = h.arms ? (s.x < a.bodyCx ? -3 : 3) : 0;
    if (s.neck) neckLine(pc, s.neck, [s.x, s.y + s.ry * 0.5], bend, tint, col.outline);
    pc.ellipse(s.x, s.y, s.rx + 0.5, s.ry + 0.5, col.outline);
    pc.ellipse(s.x, s.y, s.rx, s.ry, tint);
    pc.ellipse(s.x + 1, s.y + 1, s.rx - 1, s.ry - 1, shadeOf(tint));
    pc.ellipse(s.x, s.y, s.rx - 1, s.ry - 1, tint);
    if (h.arms) {
      // A snake's head: open jaws facing out, a fang, one eye.
      const d = s.x < a.bodyCx ? -1 : 1;
      const jx = s.x + d * (s.rx - 0.5);
      pc.tri(jx - d * 2.5, s.y + 0.5, jx + d * 1.5, s.y - 1.5, jx + d * 1.5, s.y + 2.5, C.berry);
      pc.px(jx, s.y - 0.5, C.white);
      pc.px(jx, s.y + 1.5, C.white);
      if (!a.back) {
        pc.px(s.x - d * 0.5, s.y - s.ry * 0.5, C.white);
        pc.dot(s.x - d * 0.3, s.y - s.ry * 0.5, col.eye);
      }
      return;
    }
    if (h.cluster && !a.back) eggCracks(pc, s);
    if (h.faces === 'full') {
      face(at, sub);
      drawGen1b(pc, at, sub, pose, 'front');
      // A kit nose (the burrowers') goes on every head, as on the main one.
      const nose = spec.addons?.find((e) => e.kind === 'nose');
      if (nose && !a.back) {
        const nx = a.face >= 1 ? s.x + s.rx - 1 : s.x + (a.face > 0 ? 2 : 0);
        pc.ellipse(nx, s.y + 2.5, 1.6, 1.2, nose.c ?? col.accent);
      }
    } else if (!a.back) {
      pc.px(s.x - 1.5, s.y - 0.5, col.eye);
      pc.px(s.x + 1.5, s.y - 0.5, col.eye);
    }
  });
  if (front && h.cluster && !a.back && slots[0]) eggCracks(pc, slots[0]);
  if (front && h.mound) {
    // The dirt the heads pop out of, over their lower edges.
    const y = a.feetY;
    upperEllipse(pc, a.bodyCx, y + 1, 15, 4, y + 1, C.sandDeep);
    upperEllipse(pc, a.bodyCx, y + 1.5, 14, 3, y + 1.5, C.sand);
    for (const [dx, dy] of [
      [-9, -1],
      [-3, -2.5],
      [4, -1.5],
      [10, -0.5],
    ] as const)
      pc.px(a.bodyCx + dx, y + dy * 0.6, C.sandDeep);
  }
}
