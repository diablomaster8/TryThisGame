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
  /** Squarer segments: a rounded plate with a lit top edge and a stud (Steelix). */
  plated?: boolean;
  /** A ring of short spikes round every other segment, from disc 1 (Steelix). */
  spikes?: boolean;
  /** A wide, square, jutting lower jaw on the head: an underbite (Steelix). */
  jaw?: boolean;
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
  /** The grid frame (creature.ts `gridFrame`, LOOK-43): every length scales by g.k. */
  g: { k: number; mid: number } = { k: 1, mid: 16 },
): SerpentLayout {
  const o = spec.serpent ?? {};
  const G = g.k;
  const s = spec.size * G;
  const n = Math.max(7, Math.min(10, o.segments ?? 8));
  const taper = o.taper ?? 0.35;
  const rise = Math.max(1, Math.min(n - 3, o.rise ?? 2));
  const headRx = Math.round(4.5 * s);
  const headRy = Math.round(4.2 * s * squash);
  const r0 = Math.max(2.5 * G, headRy * 0.95);
  const radius = (i: number) => r0 * (1 - ((1 - taper) * i) / (n - 1));
  // Discs that stand up climb from the ground at disc `rise` to RISE_PX under the head.
  // The size caps read the species' own size; the grid scale applies after.
  const lift = (i: number) =>
    i < rise ? ((rise - i) / rise) * RISE_PX * Math.min(1, spec.size) * G : 0;
  const discs: SerpentDisc[] = [];
  if (face >= 0.5 && !back) {
    // Side (and three-quarter, foreshortened): the body trails off behind the head.
    const k = face >= 1 ? 1 : 0.62;
    // The big grid keeps the muzzle and its gape a design pixel or two inside the frame.
    const edge = G > 1 ? 28 : 30;
    const headCx = face >= 1 ? edge * G - headRx : 23 * G - headRx * 0.5;
    const x0 = headCx - G;
    const tailX =
      face >= 1 ? (G > 1 ? 4 : 2) * G + radius(n - 1) : g.mid - (g.mid - 2 * G) * k + radius(n - 1);
    const sp = (x0 - tailX) / (n - 1);
    for (let i = 0; i < n; i++) {
      const r = radius(i);
      // The travelling wave: small humps that move one disc back per walk frame.
      const hump = i >= rise ? Math.max(0, Math.sin((i - step) * 1.05)) * 1.3 * G : 0;
      // The three-quarter view sees the body run away from the camera, so it climbs a little.
      const away = face >= 1 ? 0 : i * 0.35 * G;
      discs.push({ x: x0 - sp * i, y: feetY - r - lift(i) - hump - away, r, z: n - i });
    }
    const top = discs[0]!;
    return { discs, headCx, headCy: top.y - 3 * G + headDrop, headRx, headRy };
  }
  // Front or back: the neck stands under the head and the rest coils round behind it.
  const headCx = g.mid;
  const ring = n - rise;
  for (let i = 0; i < n; i++) {
    const r = radius(i);
    if (i < rise) {
      discs.push({
        x: headCx + Math.sin(i - step * 0.5) * 0.6 * G,
        y: feetY - r - lift(i),
        r,
        z: 0,
      });
      continue;
    }
    // Round an ellipse from the near side, phase stepping a disc per frame.
    const t = ((i - rise) / ring) * Math.PI * 1.7 + Math.PI / 2 + step * 0.25;
    const x = headCx + Math.cos(t) * 9 * Math.min(1.1, spec.size) * G;
    const depth = Math.sin(t);
    discs.push({ x, y: feetY - r - G - (1 - depth) * 1.2 * G, r, z: back ? -depth : depth });
  }
  const top = discs[0]!;
  return { discs, headCx, headCy: top.y - 3 * G + headDrop, headRx, headRy };
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
  const side = a.face >= 0.5 && !a.back;
  const disc = (d: SerpentDisc) => {
    if (o.plated) {
      // A squarer plate: a rounded block, a lit top edge and a stud.
      const w = d.r * 0.95;
      const h = d.r * 0.92;
      pc.rect(d.x - w, d.y - h + 1, w * 2, h * 2 - 2, col.shade);
      pc.rect(d.x - w + 1, d.y - h, w * 2 - 2, h * 2, col.shade);
      pc.rect(d.x - w + 1, d.y - h + 1, w * 2 - 2, h * 2 - 2, col.body);
      pc.rect(d.x - w + 1, d.y - h + 1, w * 2 - 2, 1, col.belly);
      if (d.r >= 3) pc.px(d.x, d.y, col.belly);
    } else {
      pc.disc(d.x, d.y, d.r, col.shade);
      pc.disc(d.x - 0.4, d.y - 0.5, Math.max(1, d.r - 0.8), col.body);
    }
    if (o.belly && !a.back) pc.ellipse(d.x, d.y + d.r * 0.62, d.r * 0.65, d.r * 0.22, col.belly);
  };
  const spike = (d: SerpentDisc) => {
    // Short spikes: up and down in the side views, out to each side from the front.
    const h = Math.max(3, Math.round(d.r * 0.95));
    const w = o.plated ? d.r * 0.95 : d.r;
    for (let k = 0; k < h; k++) {
      const taper = Math.max(0, 1 - k / h);
      const c = k === h - 1 ? col.belly : col.accent;
      if (side) {
        pc.rect(d.x - taper, d.y - d.r - k, 1 + taper, 1, c);
        pc.rect(d.x - taper, d.y + d.r - 1 + k, 1 + taper, 1, c);
      } else {
        pc.rect(d.x - w - k, d.y - taper, 1, 1 + taper, c);
        pc.rect(d.x + w - 1 + k, d.y - taper, 1, 1 + taper, c);
      }
    }
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
  const drawn = (d: SerpentDisc) => {
    const i = l.discs.indexOf(d);
    if (o.spikes && i >= 1 && i % 2 === 1 && i < l.discs.length - 1) spike(d);
    disc(d);
  };
  for (const d of behind) drawn(d);
  if (a.back) blob(l.headCx, l.headCy, l.headRx, l.headRy);
  for (const f of fins) fin(f);
  for (const d of front) drawn(d);
  if (!a.back) {
    blob(l.headCx, l.headCy, l.headRx, l.headRy);
    if (o.jaw) jaw(pc, a, spec, l, side);
  } else if (o.jaw) jaw(pc, a, spec, l, side);
}

/** The underbite: a wide square lower jaw jutting past the head, with a pale lip and two tusks. */
function jaw(
  pc: PixelCanvas,
  a: Anchors,
  spec: CreatureSpec,
  l: SerpentLayout,
  side: boolean,
): void {
  const col = spec.colors;
  const cx = Math.round(l.headCx);
  const bottom = Math.round(l.headCy + l.headRy);
  const h = Math.max(3, Math.round(l.headRy * 0.5));
  if (a.back) {
    // From behind only the jaw's corners show beyond the head.
    pc.rect(cx - l.headRx, bottom - 2, l.headRx * 2, 2, col.shade);
    return;
  }
  if (side) {
    // Facing right: the jaw juts forward past the face and drops below the chin.
    const x1 = Math.round(l.headCx + l.headRx * 1.15);
    const x0 = Math.round(l.headCx - l.headRx * 0.2);
    const top = bottom - h + 2;
    pc.rect(x0, top, x1 - x0, h, col.shade);
    pc.rect(x0 + 1, top + 1, x1 - x0 - 2, h - 2, col.body);
    pc.rect(x0 + 1, top, x1 - x0 - 2, 1, col.belly);
    pc.rect(x1 - 3, top - 2, 1, 2, col.belly);
    pc.rect(x1 - 6, top - 1, 1, 1, col.belly);
    return;
  }
  const w = Math.round(l.headRx * 1.05);
  const top = bottom - h + 2;
  pc.rect(cx - w, top, w * 2, h, col.shade);
  pc.rect(cx - w + 1, top + 1, w * 2 - 2, h - 2, col.body);
  pc.rect(cx - w + 1, top, w * 2 - 2, 1, col.belly);
  pc.rect(cx - w + 2, top - 2, 1, 2, col.belly);
  pc.rect(cx + w - 3, top - 2, 1, 2, col.belly);
}
