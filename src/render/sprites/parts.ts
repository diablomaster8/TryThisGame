import type { DrawnAngle } from './angles';
import type { Layout } from './layout';
import { C } from './palette';
import type { PixelCanvas } from './pixel-canvas';

/**
 * Critter parts: the newest critter given sets the part in each slot. Every part is a
 * small parametric drawing so 15 species × 4 slots × 5 angles stay manageable. The
 * species → part mapping lives in sim/critters.ts; here part ids map to a shape + palette.
 */
export interface PartStyle {
  shape: string;
  color: number;
  accent: number;
  /** Size of the drawing; a child wears its parts at 0.8 (LOOK-66). */
  k?: number;
}

export const PART_STYLES: Record<string, PartStyle> = {
  // Swim
  'penguin-arms': { shape: 'flipper', color: C.ink, accent: C.white },
  'penguin-tail': { shape: 'stub', color: C.ink, accent: C.white },
  'seal-arms': { shape: 'flipper', color: C.lilacGrey, accent: C.pale },
  'seal-tail': { shape: 'fin', color: C.lilacGrey, accent: C.pale },
  'otter-ears': { shape: 'round', color: C.bark, accent: C.sand },
  'otter-tail': { shape: 'long', color: C.bark, accent: C.wood },
  // Fly
  'peacock-back': { shape: 'feathers', color: C.teal, accent: C.violet },
  'peacock-ears': { shape: 'crest', color: C.teal, accent: C.mint },
  'parrot-back': { shape: 'wings', color: C.ember, accent: C.sunYellow },
  'parrot-ears': { shape: 'crest', color: C.ember, accent: C.sunYellow },
  'condor-back': { shape: 'wings', color: C.darkPlum, accent: C.dusk },
  'condor-ears': { shape: 'tuft', color: C.white, accent: C.pale },
  // Run
  'cheetah-ears': { shape: 'round', color: C.sand, accent: C.darkBark },
  'cheetah-tail': { shape: 'long', color: C.sand, accent: C.darkBark },
  'rabbit-ears': { shape: 'long', color: C.pale, accent: C.blush },
  'rabbit-tail': { shape: 'puff', color: C.white, accent: C.pale },
  'boar-ears': { shape: 'pointed', color: C.dusk, accent: C.plum },
  'boar-tail': { shape: 'stub', color: C.dusk, accent: C.plum },
  // Power
  'gorilla-arms': { shape: 'big', color: C.darkPlum, accent: C.dusk },
  'gorilla-ears': { shape: 'round', color: C.darkPlum, accent: C.dusk },
  'bear-ears': { shape: 'round', color: C.bark, accent: C.sand },
  'bear-arms': { shape: 'paw', color: C.bark, accent: C.sand },
  'tiger-ears': { shape: 'round', color: C.orange, accent: C.ink },
  'tiger-tail': { shape: 'long', color: C.orange, accent: C.ink },
  // Normal
  'sheep-ears': { shape: 'horn', color: C.cream, accent: C.sand },
  'sheep-tail': { shape: 'puff', color: C.pale, accent: C.white },
  'raccoon-ears': { shape: 'pointed', color: C.dusk, accent: C.ink },
  'raccoon-tail': { shape: 'bushy', color: C.dusk, accent: C.ink },
  'skunk-ears': { shape: 'pointed', color: C.ink, accent: C.white },
  'skunk-tail': { shape: 'bushy', color: C.ink, accent: C.white },
};

export function partStyle(id: string | null): PartStyle | null {
  return id ? (PART_STYLES[id] ?? null) : null;
}

// ---------- ears (on the head, drawn after the head, before the face) ----------

export function drawEars(pc: PixelCanvas, angle: DrawnAngle, L: Layout, s: PartStyle): void {
  const k = s.k ?? 1;
  const top = L.headCy - L.headRy;
  const left = L.headCx - L.headRx + 2;
  const right = L.headCx + L.headRx - 2;
  // Where the two ears sit for each angle (x positions); the back hides nothing.
  const spots: Array<[number, number]> =
    angle === 'front' || angle === 'back'
      ? [
          [left, top + 1],
          [right, top + 1],
        ]
      : angle === 'side'
        ? [[L.headCx - 2, top]]
        : [
            [left + 1, top + 1],
            [right - 1, top + 2],
          ];
  for (const [x, y] of spots) {
    switch (s.shape) {
      case 'round':
        pc.disc(x, y, 2.4 * k, s.color);
        pc.px(x, y, s.accent);
        break;
      case 'long':
        pc.ellipse(x, y - 4 * k, 1.6 * k, 5 * k, s.color);
        pc.ellipse(x, y - 4 * k, 0.8 * k, 3 * k, s.accent);
        break;
      case 'pointed':
        pc.tri(x - 2 * k, y + k, x + 2 * k, y + k, x, y - 4 * k, s.color);
        pc.px(x, y - k, s.accent);
        break;
      case 'horn':
        pc.disc(x, y, 2.2 * k, s.color);
        pc.px(x, y, s.accent);
        pc.px(x - k, y - k, s.accent);
        pc.px(x + k, y + k, s.accent);
        break;
      case 'crest':
        if (x !== spots[0]?.[0] && spots.length > 1) break; // one crest only
        for (let i = -1; i <= 1; i++) {
          pc.line(L.headCx, top - k, L.headCx + i * 3, top - 5 * k - Math.abs(i), s.color);
          pc.px(L.headCx + i * 3, top - 5 * k - Math.abs(i), s.accent);
        }
        break;
      case 'tuft':
        if (x !== spots[0]?.[0] && spots.length > 1) break;
        pc.disc(L.headCx - 1, top - k, 2.2 * k, s.color);
        pc.disc(L.headCx + 2, top - 2 * k, 1.6 * k, s.accent);
        break;
    }
  }
}

// ---------- tail (behind the body from the front, in front from the back) ----------

export function drawTail(pc: PixelCanvas, angle: DrawnAngle, L: Layout, s: PartStyle): void {
  const k = s.k ?? 1;
  // Anchor: the lower back of the body.
  let x = L.bodyCx;
  const y = L.bodyCy + 2;
  let dir: 1 | -1 = -1;
  switch (angle) {
    case 'front':
      x = L.bodyCx + L.bodyRx - 1;
      dir = 1;
      break;
    case 'frontQuarter':
      x = L.bodyCx - L.bodyRx + 1;
      dir = -1;
      break;
    case 'side':
      x = L.bodyCx - L.bodyRx;
      dir = -1;
      break;
    case 'backQuarter':
      x = L.bodyCx - 1;
      dir = -1;
      break;
    case 'back':
      x = L.bodyCx;
      dir = 1;
      break;
  }
  switch (s.shape) {
    case 'puff':
      pc.disc(x + dir * 2 * k, y, 2.4 * k, s.color);
      pc.px(x + dir * 2 * k - 1, y - k, s.accent);
      break;
    case 'stub':
      pc.tri(x, y - 2 * k, x, y + 2 * k, x + dir * 4 * k, y, s.color);
      pc.px(x + dir * 2 * k, y, s.accent);
      break;
    case 'fin':
      pc.tri(x, y - k, x + dir * 5 * k, y - 4 * k, x + dir * 5 * k, y + 3 * k, s.color);
      pc.px(x + dir * 3 * k, y, s.accent);
      break;
    case 'long': {
      pc.line(x, y, x + dir * 4 * k, y + k, s.color);
      pc.line(x + dir * 4 * k, y + k, x + dir * 7 * k, y - 3 * k, s.color);
      pc.line(x + dir * 7 * k, y - 3 * k, x + dir * 7 * k, y - 6 * k, s.color);
      pc.px(x + dir * 5 * k, y - k, s.accent);
      pc.px(x + dir * 7 * k, y - 5 * k, s.accent);
      break;
    }
    case 'bushy':
      pc.ellipse(x + dir * 4 * k, y - k, 3.5 * k, 2.6 * k, s.color);
      pc.line(x + dir * 2 * k, y - 3 * k, x + dir * 2 * k, y + k, s.accent);
      pc.line(x + dir * 6 * k, y - 3 * k, x + dir * 6 * k, y + k, s.accent);
      break;
  }
}

// ---------- arms (replace the default stubby arms) ----------

export function drawArmPart(
  pc: PixelCanvas,
  sx: number,
  sy: number,
  hx: number,
  hy: number,
  dir: 1 | -1,
  s: PartStyle,
): void {
  const k = s.k ?? 1;
  switch (s.shape) {
    case 'flipper':
      pc.line(sx, sy, hx, hy, s.color);
      pc.ellipse(hx + dir, hy + k, 2.6 * k, 1.4 * k, s.color);
      pc.px(hx + dir, hy + k, s.accent);
      break;
    case 'paw':
      pc.line(sx, sy, hx, hy, s.color);
      pc.disc(hx, hy, 2.2 * k, s.color);
      pc.px(hx, hy + k, s.accent);
      pc.px(hx + dir, hy, s.accent);
      break;
    case 'big':
      pc.line(sx, sy, hx, hy, s.color);
      pc.line(sx, sy + k, hx, hy + k, s.color);
      pc.disc(hx + dir, hy + k, 2.8 * k, s.color);
      pc.px(hx + dir, hy + k, s.accent);
      break;
  }
}

// ---------- back (replaces the default little wings) ----------

export function drawBack(
  pc: PixelCanvas,
  angle: DrawnAngle,
  L: Layout,
  s: PartStyle,
  raise: number,
  frontLayer: boolean,
): void {
  const k = s.k ?? 1;
  const y = L.headCy + L.headRy - 2 - raise;
  const showBehind = angle === 'front' || angle === 'frontQuarter' || angle === 'side';
  if (showBehind === frontLayer) return;
  const wing = (cx: number, dir: 1 | -1, size: number) => {
    if (s.shape === 'feathers') {
      for (let i = 0; i < 3; i++) {
        const ex = cx + dir * (size + i * 2);
        const ey = y - size - 2 + i * 3;
        pc.line(cx, y + k, ex, ey, s.color);
        pc.disc(ex, ey, 1.2 * k, s.accent);
        pc.px(ex, ey, C.ink);
      }
    } else {
      pc.tri(
        cx,
        y + 2 * k,
        cx + dir * (size + 1) * k,
        y - size,
        cx + dir * (size + 3) * k,
        y + 3 * k,
        s.color,
      );
      pc.line(cx + dir, y + k, cx + dir * (size + 1) * k, y - size + 2, s.accent);
    }
  };
  const big = 5;
  const small = 4;
  switch (angle) {
    case 'front':
      wing(L.headCx - L.headRx + 1, -1, small);
      wing(L.headCx + L.headRx - 1, 1, small);
      break;
    case 'frontQuarter':
      wing(L.headCx - L.headRx + 1, -1, big);
      wing(L.headCx + L.headRx - 2, 1, small - 1);
      break;
    case 'side':
      wing(L.headCx - L.headRx + 1, -1, big);
      break;
    case 'backQuarter':
      wing(L.headCx - 3, -1, big);
      wing(L.headCx + 4, 1, small);
      break;
    case 'back':
      wing(L.headCx - 2, -1, big);
      wing(L.headCx + 2, 1, big);
      break;
  }
}
