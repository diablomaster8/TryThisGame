import { PLAQUE_OUTLINES, type Outline, type PlaqueCreature } from '../../config/tuning-k';
import { hex, Raster, rimObjects, shade, type RGB } from './raster';

/**
 * Campaign graphics 2, package k, pixel painters: the carved creature plaque over each Dawn &
 * Dusk crest-house door (M5), the Fold's tally post and wreath (N5), the Beetle Road's lane,
 * milestones, banner poles and cart (H3, M4) and the green's sundial (H3). Everything draws
 * into a `Raster` whose coverage becomes the sprite's alpha, then sheeted by `dress-k.ts`.
 * Pure: runs in tests.
 */
export const K_PPU = 24;

/** Is (u, v) inside the closed outline? (even-odd; both in the outline's unit box). */
export function insideOutline(o: Outline, u: number, v: number): boolean {
  let inside = false;
  for (let i = 0, j = o.length - 1; i < o.length; j = i++) {
    const [xi, yi] = o[i]!;
    const [xj, yj] = o[j]!;
    if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const WOOD: RGB[] = ['#4a2e18', '#6a4426', '#8a5a32', '#b4864c', '#d9a76a'].map(hex) as RGB[];

/**
 * A carved plaque painted into `r` with its top-left at (x0, y0): a dark board with a light
 * rim and the creature's silhouette cut pale, `iw` x `ih` pixels for the silhouette alone
 * (12 x 8 for the carved sign). The silhouette is sampled on the pixel grid, so it is the
 * same shape the 3D relief extrudes.
 */
export function paintPlaque(
  r: Raster,
  creature: PlaqueCreature,
  x0: number,
  y0: number,
  iw = 12,
  ih = 8,
): void {
  const bw = iw + 4;
  const bh = ih + 3;
  r.rect(x0, y0, bw, bh, WOOD[0]!);
  r.rect(x0, y0, bw, 1, WOOD[3]!);
  r.rect(x0, y0 + bh - 1, bw, 1, WOOD[1]!);
  r.rect(x0, y0, 1, bh, WOOD[2]!);
  const o = PLAQUE_OUTLINES[creature];
  for (let j = 0; j < ih; j++)
    for (let i = 0; i < iw; i++) {
      // Sample at four points in the pixel and carve when most of them are inside.
      let n = 0;
      for (const [dx, dy] of [
        [0.25, 0.25],
        [0.75, 0.25],
        [0.25, 0.75],
        [0.75, 0.75],
      ] as const)
        if (insideOutline(o, (i + dx) / iw, 1 - (j + dy) / ih)) n++;
      if (n >= 2) r.set(x0 + 2 + i, y0 + 1 + j, n === 4 ? WOOD[4]! : WOOD[3]!);
    }
}

/** The painted plaque on its own, for the tests and the atlas. */
export function paintPlaqueSprite(creature: PlaqueCreature): Raster {
  const r = new Raster(16, 11, null);
  r.tracking = true;
  paintPlaque(r, creature, 0, 0);
  return r;
}

/** The tally post: a timber post with a stroke per day in groups of five, `days` of them. */
export function paintTallyPost(days: number, perGroup: number): Raster {
  const r = new Raster(18, 44, null);
  r.tracking = true;
  r.rect(5, 6, 8, 38, WOOD[1]!);
  r.rect(5, 6, 1, 38, WOOD[2]!);
  r.rect(12, 6, 1, 38, WOOD[0]!);
  r.rect(4, 3, 10, 3, WOOD[0]!);
  r.rect(4, 3, 10, 1, WOOD[2]!);
  const groups = Math.ceil(days / perGroup);
  for (let g = 0; g < groups; g++) {
    const n = Math.min(perGroup, days - g * perGroup);
    const col = g % 2;
    const row = Math.floor(g / 2);
    const bx = 6 + col * 4;
    const by = 9 + row * 4;
    for (let k = 0; k < Math.min(4, n); k++)
      r.rect(bx + (k >> 1) * 1 + (k & 1) * 0, by, 1, 3, WOOD[4]!);
    if (n >= 5) r.line(bx - 1, by + 2, bx + 2, by, hex('#fff1c9'));
  }
  rimObjects(r);
  return r;
}

/** A wreath: a green ring with red berries and a pale ribbon. */
export function paintWreath(): Raster {
  const r = new Raster(14, 16, null);
  r.tracking = true;
  const green = hex('#4f8a3a');
  const dark = hex('#2f5a28');
  for (let y = 0; y < 14; y++)
    for (let x = 0; x < 14; x++) {
      const d = Math.hypot(x - 6.5, y - 6.5);
      if (d <= 6.4 && d >= 3.2) r.set(x, y, (x + y) % 3 === 0 ? dark : green);
    }
  for (const [x, y] of [
    [6, 1],
    [11, 5],
    [10, 11],
    [2, 9],
    [2, 4],
  ] as const)
    r.rect(x, y, 2, 2, hex('#d8473a'));
  r.rect(5, 12, 4, 3, hex('#f2e6c8'));
  rimObjects(r);
  return r;
}

/** A knee-high milestone with `n` notches cut in its face. */
export function paintMilestone(n: number): Raster {
  const r = new Raster(16, 22, null);
  r.tracking = true;
  const stone = hex('#9a9892');
  r.rect(2, 19, 12, 3, shade(stone, 0.8));
  r.rect(4, 6, 8, 14, stone);
  r.ellipse(8, 7, 4, 4, shade(stone, 1.1));
  r.rect(4, 6, 1, 14, shade(stone, 1.2));
  r.rect(11, 6, 1, 14, shade(stone, 0.75));
  for (let i = 0; i < n; i++) r.rect(8 - n + i * 2 + (n > 1 ? 1 : 0), 10, 1, 5, hex('#4a4a48'));
  rimObjects(r);
  return r;
}

/**
 * A banner on a pole: a cloth card with a swallow-tail hem and a cream crest, drawn as a
 * shape (sun disc and rays, crescent, drop) so the colour is never the only cue.
 */
export function paintBannerPole(crest: 'sun' | 'moon' | 'drop', colour: string): Raster {
  const W = 24;
  const H = 76;
  const r = new Raster(W, H, null);
  r.tracking = true;
  const cloth = hex(colour);
  r.rect(11, 6, 2, H - 6, WOOD[1]!);
  r.rect(11, 6, 1, H - 6, WOOD[2]!);
  r.disc(12, 5, 2, hex('#e0c28a'));
  r.rect(2, 9, 20, 2, WOOD[0]!);
  // Cloth: x 3..20, y 11..40 with a notch at the bottom.
  for (let y = 11; y < 40; y++)
    for (let x = 3; x < 21; x++) {
      const notch = y > 34 && Math.abs(x - 11.5) < (y - 34) * 1.3;
      if (!notch) r.set(x, y, x < 5 ? shade(cloth, 1.12) : x > 18 ? shade(cloth, 0.82) : cloth);
    }
  const ink = hex('#fff1c9');
  const cx = 12;
  const cy = 24;
  if (crest === 'sun') {
    r.disc(cx, cy, 3.4, ink);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      r.line(
        cx + Math.cos(a) * 5,
        cy + Math.sin(a) * 5,
        cx + Math.cos(a) * 7.4,
        cy + Math.sin(a) * 7.4,
        ink,
      );
    }
  } else if (crest === 'moon') {
    r.disc(cx - 1, cy, 6.6, ink);
    r.disc(cx + 3, cy - 1.5, 5.4, cloth);
  } else {
    for (let y = -6; y <= 6; y++) {
      const wd = y < 0 ? (y + 6.5) * 0.5 : Math.sqrt(Math.max(0, 1 - (y / 6.5) ** 2)) * 4.6;
      r.rect(Math.round(cx - wd), cy + y, Math.max(1, Math.round(wd * 2)), 1, ink);
    }
  }
  rimObjects(r);
  return r;
}

/** The beetle cart: a bed on four wheels with shafts; a tarp over the load, or the load bare. */
export function paintCart(open: boolean): Raster {
  const r = new Raster(88, 60, null);
  r.tracking = true;
  const wood = hex('#8a5c34');
  const dark = hex('#5a3c28');
  r.rect(8, 30, 60, 10, wood);
  r.rect(8, 30, 60, 1, shade(wood, 1.25));
  r.rect(66, 36, 20, 3, hex('#6a4426'));
  r.rect(66, 30, 20, 3, hex('#6a4426'));
  if (open) {
    // The tarp rolled at the back; crates, a sack and the shell plate show.
    r.rect(8, 22, 8, 8, hex('#7d8f68'));
    r.rect(8, 22, 8, 1, hex('#9aab82'));
    r.rect(18, 16, 16, 14, hex('#b0824a'));
    r.rect(18, 16, 16, 1, hex('#d0a468'));
    r.rect(18, 22, 16, 1, hex('#6a4426'));
    r.rect(36, 18, 14, 12, hex('#9a6a3c'));
    r.rect(36, 18, 14, 1, hex('#b0824a'));
    r.rect(24, 6, 12, 10, hex('#b0824a'));
    r.rect(24, 6, 12, 1, hex('#d0a468'));
    r.ellipse(58, 28, 8, 7, hex('#c9b48a'));
    r.ellipse(46, 26, 12, 8, hex('#3a6a52'));
    r.ellipse(46, 24, 8, 4, hex('#4f8a6c'));
    r.rect(38, 24, 16, 1, hex('#2a4a3a'));
  } else {
    r.set(0, 0, hex('#000000'), 0);
    const tarp = hex('#7d8f68');
    for (let y = 6; y < 41; y++)
      for (let x = 4; x < 73; x++) {
        // A hump: the top edge follows a curve, the hem droops at the sides.
        const u = (x - 38.5) / 34.5;
        const top = 38 - 32 * Math.max(0, 1 - u * u) ** 0.8;
        if (y >= top && y < 40 + (Math.abs(u) > 0.85 ? 1 : 0))
          r.set(x, y, y < top + 3 ? shade(tarp, 1.2) : tarp);
      }
    r.rect(22, 14, 8, 2, hex('#9aab82'));
    // The rope: two lines over the hump.
    for (const x0 of [26, 50])
      for (let y = 10; y < 40; y++) {
        const u = (x0 - 38.5) / 34.5;
        if (y >= 38 - 32 * Math.max(0, 1 - u * u) ** 0.8)
          r.set(x0 + ((y - 20) >> 4), y, hex('#d9c08a'));
      }
  }
  for (const wx of [22, 54]) {
    r.disc(wx, 46, 10, dark);
    r.disc(wx, 46, 7, wood);
    r.disc(wx, 46, 3, dark);
    r.line(wx - 7, 46, wx + 7, 46, dark);
    r.line(wx, 39, wx, 53, dark);
  }
  rimObjects(r);
  return r;
}

/** The sundial: a stepped stone drum with a dial plate, hour cuts and a bronze gnomon. */
export function paintSundial(): Raster {
  const r = new Raster(30, 26, null);
  r.tracking = true;
  const stone = hex('#a39e96');
  r.ellipse(15, 22, 13, 4, shade(stone, 0.8));
  r.rect(9, 11, 12, 11, stone);
  r.rect(9, 11, 1, 11, shade(stone, 1.2));
  r.rect(20, 11, 1, 11, shade(stone, 0.75));
  r.ellipse(15, 11, 13, 4.5, hex('#bcb6aa'));
  r.ellipse(15, 11, 10, 3, shade(hex('#bcb6aa'), 1.1));
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    r.set(15 + Math.cos(a) * 8.5, 11 + Math.sin(a) * 2.5, hex('#4a4a48'));
  }
  r.tri(15, 11, 21, 11, 15, 3, hex('#b08a3a'));
  r.line(15, 11, 15, 3, hex('#fff1c9'), 0.5);
  rimObjects(r);
  return r;
}

/**
 * The lane as one flat raster: dust with two wheel ruts, painted over `bounds` (grove x,
 * z) at `ppu` pixels per unit. `pts` is the lane's centre line.
 */
export function paintRoad(
  pts: ReadonlyArray<readonly [number, number]>,
  width: number,
  rutOffset: number,
  rutWidth: number,
  bounds: { x0: number; z0: number; x1: number; z1: number },
  ppu: number,
): Raster {
  const W = Math.ceil((bounds.x1 - bounds.x0) * ppu);
  const H = Math.ceil((bounds.z1 - bounds.z0) * ppu);
  const r = new Raster(W, H, null);
  r.tracking = true;
  const dust = hex('#c9a56e');
  const rut = hex('#8a6a40');
  for (let py = 0; py < H; py++)
    for (let px = 0; px < W; px++) {
      const x = bounds.x0 + (px + 0.5) / ppu;
      const z = bounds.z0 + (py + 0.5) / ppu;
      // Nearest segment, with the signed offset from the centre line.
      let best = 1e9;
      let off = 0;
      for (let i = 0; i + 1 < pts.length; i++) {
        const [ax, az] = pts[i]!;
        const [bx, bz] = pts[i + 1]!;
        const dx = bx - ax;
        const dz = bz - az;
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)));
        const d = Math.hypot(x - (ax + dx * t), z - (az + dz * t));
        if (d < best) {
          best = d;
          off = ((x - ax) * -dz + (z - az) * dx) / Math.hypot(dx, dz);
        }
      }
      // A ragged edge: the verge wobbles a little by pixel.
      const wob = (((px * 7 + py * 13) % 5) - 2) * 0.02;
      if (best > width / 2 + wob) continue;
      const inRut = Math.abs(Math.abs(off) - rutOffset) < rutWidth / 2;
      const speck = (px * 31 + py * 17) % 11 === 0;
      r.set(px, py, inRut ? rut : speck ? shade(dust, 0.9) : dust);
    }
  return r;
}
