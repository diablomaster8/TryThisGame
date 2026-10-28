import type { PixelCanvas } from './pixel-canvas';
import type { Anchors, CreatureSpec } from './creature';

/**
 * The serpent body plan (LOOK-05): a long body of overlapping discs along an S-curve,
 * tapering from head size to a thin tail, with the head raised on the first few. The
 * curve's phase moves one disc per walk frame, so the body slithers instead of stepping.
 * Both renderers read these settings (`render3d/art-serpent.ts` builds the 3D chain).
 */
export interface SerpentOpts {
  /** Discs in the body, 7–10; 8 by default. */
  segments?: number;
  /** The tail disc's radius as a share of the first; 0.35 by default. */
  taper?: number;
  /** How many discs stand up under the head; 2 by default. */
  rise?: number;
  /** A belly stripe in the belly colour (Gyarados's cream underside). */
  belly?: boolean;
  /** A dorsal fin crest in the accent colour on discs 2 and 5. */
  fin?: boolean;
}

export interface SerpentDisc {
  x: number;
  y: number;
  r: number;
  /** Drawn order: lower first. Discs behind the head are negative. */
  z: number;
}

export interface SerpentLayout {
  discs: SerpentDisc[];
  headCx: number;
  headCy: number;
  headRx: number;
  headRy: number;
}

/** How far the head stands above the first disc, in px (LOOK-05: 6–8). */
const RISE_PX = 7;

/**
 * Lay out the discs for one angle and walk step. Side views face right, as the rest of
 * the creature drawer does; the front and back views coil the body behind the head.
 */
export function serpentLayout(
  face: number,
  back: boolean,
  spec: CreatureSpec,
  feetY: number,
  squash: number,
  headDrop: number,
  step: number,
): SerpentLayout {
  const o = spec.serpent ?? {};
  const s = spec.size;
  const n = Math.max(7, Math.min(10, o.segments ?? 8));
  const taper = o.taper ?? 0.35;
  const rise = Math.max(1, Math.min(n - 3, o.rise ?? 2));
  const headRx = Math.round(4.5 * s);
  const headRy = Math.round(4.2 * s * squash);
  const r0 = Math.max(2.5, headRy * 0.95);
  const radius = (i: number) => r0 * (1 - ((1 - taper) * i) / (n - 1));
  // Discs that stand up climb from the ground at disc `rise` to RISE_PX under the head.
  const lift = (i: number) => (i < rise ? ((rise - i) / rise) * RISE_PX * Math.min(1, s) : 0);
  const discs: SerpentDisc[] = [];
  if (face >= 0.5 && !back) {
    // Side (and three-quarter, foreshortened): the body trails off behind the head.
    const k = face >= 1 ? 1 : 0.62;
    const headCx = face >= 1 ? 30 - headRx : 23 - headRx * 0.5;
    const x0 = headCx - 1;
    const tailX = face >= 1 ? 2 + radius(n - 1) : 16 - (16 - 2) * k + radius(n - 1);
    const sp = (x0 - tailX) / (n - 1);
    for (let i = 0; i < n; i++) {
      const r = radius(i);
      // The travelling wave: small humps that move one disc back per walk frame.
      const hump = i >= rise ? Math.max(0, Math.sin((i - step) * 1.05)) * 1.3 : 0;
      // The three-quarter view sees the body run away from the camera, so it climbs a little.
      const away = face >= 1 ? 0 : i * 0.35;
      discs.push({ x: x0 - sp * i, y: feetY - r - lift(i) - hump - away, r, z: n - i });
    }
    const top = discs[0]!;
    return { discs, headCx, headCy: top.y - 3 + headDrop, headRx, headRy };
  }
  // Front or back: the neck stands under the head and the rest coils round behind it.
  const headCx = 16;
  const ring = n - rise;
  for (let i = 0; i < n; i++) {
    const r = radius(i);
    if (i < rise) {
      discs.push({ x: headCx + Math.sin(i - step * 0.5) * 0.6, y: feetY - r - lift(i), r, z: 0 });
      continue;
    }
    // Round an ellipse from the near side, phase stepping a disc per frame.
    const t = ((i - rise) / ring) * Math.PI * 1.7 + Math.PI / 2 + step * 0.25;
    const x = headCx + Math.cos(t) * 9 * Math.min(1.1, s);
    const depth = Math.sin(t);
    discs.push({ x, y: feetY - r - 1 - (1 - depth) * 1.2, r, z: back ? -depth : depth });
  }
  const top = discs[0]!;
  return { discs, headCx, headCy: top.y - 3 + headDrop, headRx, headRy };
}

/** Body anchors for features that hang off the body: the middle at disc 2, the tail end at the last disc. */
export function serpentBodyAnchors(l: SerpentLayout): {
  bodyCx: number;
  bodyCy: number;
  bodyRx: number;
  bodyRy: number;
} {
  const mid = l.discs[2]!;
  const end = l.discs[l.discs.length - 1]!;
  return {
    bodyCx: Math.round(mid.x),
    bodyCy: Math.round(mid.y),
    bodyRx: Math.max(2, Math.round(Math.abs(mid.x - end.x))),
    bodyRy: Math.round(mid.r),
  };
}

/** Draw the disc chain and the head; the face and crest are drawn on top by the caller. */
export function drawSerpentBody(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  l: SerpentLayout,
  blob: (cx: number, cy: number, rx: number, ry: number) => void,
): void {
  const col = spec.colors;
  const o = spec.serpent ?? {};
  const disc = (d: SerpentDisc) => {
    pc.disc(d.x, d.y, d.r, col.shade);
    pc.disc(d.x - 0.4, d.y - 0.5, Math.max(1, d.r - 0.8), col.body);
    if (o.belly && !a.back) pc.ellipse(d.x, d.y + d.r * 0.62, d.r * 0.65, d.r * 0.22, col.belly);
  };
  const fin = (d: SerpentDisc) => {
    const h = Math.max(2, d.r * 0.9);
    for (let k = 0; k < 3; k++)
      pc.line(d.x - 1 + k, d.y - d.r, d.x + k - 2, d.y - d.r - h + k * 0.6, col.accent);
  };
  const fins = o.fin ? [2, 5].map((i) => l.discs[i]).filter((d) => d !== undefined) : [];
  const order = [...l.discs].sort((p, q) => p.z - q.z);
  const behind = order.filter((d) => d.z < 0);
  const front = order.filter((d) => d.z >= 0);
  for (const d of behind) disc(d);
  if (a.back) blob(l.headCx, l.headCy, l.headRx, l.headRy);
  for (const f of fins) fin(f);
  for (const d of front) disc(d);
  if (!a.back) blob(l.headCx, l.headCy, l.headRx, l.headRy);
}
