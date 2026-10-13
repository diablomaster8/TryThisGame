/**
 * Buildings in the organic style: walls of plaster, stone or plank with noise grain,
 * and roofs that read as roofs: stepped thatch courses, scalloped slate, curved
 * ceramic tiles, staggered wood shingles, a seamed copper dome. Shared by the organic
 * scene and the building contact sheet.
 */
import { Rng } from '../../src/sim/rng';
import { fbm, ridged, vnoise } from './noise';
import { hash, hex, mix, Raster, shade, type RGB } from './raster';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function stamp(r: Raster, x: number, y: number, w: number, c: RGB, a = 1): void {
  for (let dy = -w; dy <= w; dy++) {
    for (let dx = -w; dx <= w; dx++) {
      if (dx * dx + dy * dy <= w * w + 0.5) r.set(x + dx, y + dy, c, a);
    }
  }
}

/** A shadow on the grass under a building: an ellipse eaten by noise. */
export function groundShadow(
  r: Raster,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  salt: number,
): void {
  const was = r.tracking;
  r.tracking = false;
  for (let yy = -ry - 3; yy <= ry + 3; yy++) {
    for (let xx = -rx - 4; xx <= rx + 4; xx++) {
      const rr = Math.hypot(xx / rx, yy / ry) + (fbm(xx / 10, yy / 4, 2, salt) - 0.5) * 0.5;
      if (rr < 1) r.set(cx + xx, cy + yy, hex('#24481f'), 0.45);
    }
  }
  r.tracking = was;
}

// ---------------------------------------------------------------- walls

export function plasterWall(
  r: Raster,
  x0: number,
  y0: number,
  w: number,
  h: number,
  salt: number,
  tint = hex('#f1dfb9'),
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const t = (y - y0) / h;
      const n = fbm(x / 16, y / 16, 4, salt);
      let c = mix(tint, shade(tint, 0.72), t * 0.5 + n * 0.5);
      if (x > x0 + w - 12) c = shade(c, 0.74 + ((x - (x0 + w - 12)) / 12) * 0.1);
      if (ridged(x / 3, y / 3, 2, salt + 1) > 0.9 && n > 0.55) c = shade(c, 0.7);
      r.set(x, y, c);
    }
  }
}

export function timber(
  r: Raster,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  w: number,
  salt: number,
): void {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const px = x0 + (x1 - x0) * t + (vnoise(t * 6, y0 + salt, 34) - 0.5) * 2;
    const py = y0 + (y1 - y0) * t;
    const g = ridged(px / 4, py / 4, 2, salt);
    stamp(r, px, py, w, mix(hex('#4a2e18'), hex('#8a5a32'), g * 0.7));
  }
}

/** Stones packed in rows, each its own tone, with dark mortar; `round` makes them pebbly. */
export function stoneWall(
  r: Raster,
  x0: number,
  y0: number,
  w: number,
  h: number,
  salt: number,
  round = false,
  dark = false,
): void {
  const rowH = round ? 7 : 6;
  const base = dark ? hex('#4a4a56') : hex('#8f8f9a');
  const light = dark ? hex('#7a7a88') : hex('#c6c6d0');
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const row = Math.floor((y - y0) / rowH);
      const off = (row % 2) * 5;
      const colW = 9 + (hash(row, 0, salt) > 0.5 ? 2 : 0);
      const col = Math.floor((x - x0 + off) / colW);
      const fx = ((x - x0 + off) % colW) / colW;
      const fy = ((y - y0) % rowH) / rowH;
      const edge = round
        ? Math.hypot((fx - 0.5) * 2, (fy - 0.5) * 2.2) > 0.92
        : fx < 0.08 || fy < 0.12 || fx > 0.94;
      const tone = hash(col, row, salt + 2);
      let c = mix(base, light, tone * 0.8 + fbm(x / 4, y / 4, 2, salt + 3) * 0.3);
      c = shade(c, 0.85 + (1 - fy) * 0.2);
      if (edge) c = shade(c, 0.45);
      if (fbm(x / 5, y / 5, 2, salt + 4) > 0.66 && y > y0 + h * 0.6 && !edge)
        c = mix(c, hex('#5f8a3a'), 0.4);
      r.set(x, y, c);
    }
  }
}

/** Horizontal planks with grain and knots. */
export function plankWall(
  r: Raster,
  x0: number,
  y0: number,
  w: number,
  h: number,
  salt: number,
  tint = hex('#a9743f'),
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const plank = Math.floor((y - y0) / 7);
      const fy = ((y - y0) % 7) / 7;
      const grain = ridged(x / 14, (y + plank * 31) / 2.5, 2, salt);
      let c = mix(shade(tint, 0.6), tint, grain * 0.6 + hash(plank, 1, salt) * 0.4);
      if (fy < 0.15) c = shade(c, 0.55);
      if (fy > 0.85) c = shade(c, 1.15);
      const knot = vnoise(x / 9 + plank * 7, 0, salt + 5);
      if (knot > 0.93) c = shade(c, 0.6);
      if (x > x0 + w - 10) c = shade(c, 0.75);
      r.set(x, y, c);
    }
  }
}

// ---------------------------------------------------------------- openings

export function windowPane(
  r: Raster,
  wx: number,
  wy: number,
  w: number,
  h: number,
  salt: number,
  glow = false,
): void {
  for (let y = -2; y < h + 2; y++) {
    for (let x = -2; x < w + 2; x++) {
      const frame =
        x < 0 ||
        y < 0 ||
        x >= w ||
        y >= h ||
        Math.abs(x - (w - 1) / 2) < 1.2 ||
        Math.abs(y - (h - 1) / 2) < 1.1;
      if (frame)
        r.set(wx + x, wy + y, mix(hex('#4a3018'), hex('#7a5230'), ridged(x / 3, y / 3, 2, salt)));
      else {
        const wave = vnoise(x / 5 + wx, y / 3, salt + 1);
        r.set(
          wx + x,
          wy + y,
          glow
            ? mix(hex('#ffb04a'), hex('#fff1b8'), wave)
            : mix(hex('#7fb0e0'), hex('#d4ecff'), wave),
        );
      }
    }
  }
  r.rect(wx - 4, wy + h + 2, w + 8, 3, hex('#5e3a1f'));
}

export function flowerBox(r: Raster, rng: Rng, x: number, y: number, w: number): void {
  for (let i = 0; i < w / 2.2; i++) {
    const fx = x + i * 2.2 + rng.float(-0.5, 0.5);
    r.disc(
      fx,
      y + rng.float(-1.5, 1),
      1.3 + rng.float(0, 0.6),
      [hex('#ff7a9a'), hex('#ffd84a'), hex('#ff9ab8'), hex('#c9a0ff')][i % 4]!,
      0.9,
    );
    r.set(fx, y + 2, hex('#2f6f32'), 0.7);
  }
}

export function plankDoor(
  r: Raster,
  dx: number,
  dy: number,
  w: number,
  h: number,
  salt: number,
  arch = true,
): void {
  for (let y = dy; y < dy + h; y++) {
    for (let x = dx; x < dx + w; x++) {
      const top = y - dy;
      const a = Math.hypot((x - dx - w / 2) / (w / 2), (top - w / 3) / (w / 3));
      if (arch && top < w / 3 && a > 1) continue;
      const plank = Math.floor((x - dx) / 6);
      const grain = ridged((x + plank * 13) / 2, y / 9, 2, salt);
      let c = mix(hex('#4a2e18'), hex('#8a5a32'), grain * 0.7 + hash(plank, 3, salt) * 0.3);
      if ((x - dx) % 6 === 0) c = shade(c, 0.6);
      r.set(x, y, c);
    }
  }
  r.disc(dx + w - 5, dy + h / 2, 1.6, hex('#f3d088'));
}

export function stoneStep(r: Raster, x: number, y: number, w: number): void {
  for (let i = 0; i < 4; i++)
    r.rect(x - i, y + i, w + i * 2, 1, mix(hex('#9a9aa6'), hex('#5f5f6a'), i / 3));
}

/** The dark band a roof throws onto the wall just under its eave. */
export function eaveShadow(r: Raster, x0: number, y0: number, w: number, depth: number): void {
  for (let y = 0; y < depth; y++) {
    const f = 0.42 + (y / depth) * 0.58;
    for (let x = x0; x < x0 + w; x++) r.multiply(x, y0 + y, [f, f, f * 1.05]);
  }
}

// ---------------------------------------------------------------- roofs

export interface Roof {
  /** Left and right of the eave line, and its y. */
  x0: number;
  x1: number;
  eaveY: number;
  /** Ridge: narrower and higher. */
  rx0: number;
  rx1: number;
  ridgeY: number;
}

function roofHalfWidth(roof: Roof, y: number): [number, number] {
  const t = clamp01((y - roof.ridgeY) / (roof.eaveY - roof.ridgeY));
  return [roof.rx0 + (roof.x0 - roof.rx0) * t, roof.rx1 + (roof.x1 - roof.rx1) * t];
}

/**
 * Thatch that reads as thatch: courses stepped down the slope, each with a lit top and
 * a shadowed, ragged underside, a lit slope and a shaded slope split at the middle, a
 * woven ridge cap with spars, and eaves that hang below the line.
 */
export function roofThatch(r: Raster, rng: Rng, roof: Roof, salt: number): void {
  const course = 9;
  const mid = (roof.x0 + roof.x1) / 2;
  for (let y = roof.ridgeY - 4; y < roof.eaveY + 7; y++) {
    const [l, rt] = roofHalfWidth(roof, Math.min(y, roof.eaveY));
    for (let x = l - 3; x <= rt + 3; x++) {
      const edgeNoise = (fbm(x / 5, y / 5, 2, salt) - 0.5) * 3;
      if (x < l + edgeNoise || x > rt - edgeNoise) continue;
      const hang = (fbm(x / 4, 0, 3, salt + 1) - 0.3) * 10;
      if (y > roof.eaveY + hang) continue;
      const t = clamp01((y - roof.ridgeY) / (roof.eaveY - roof.ridgeY));
      const cy = (y - roof.ridgeY) % course;
      const strand = fbm(x / 2.2, y / 15, 3, salt + 2);
      const lit = x < mid ? 1 : 0.68;
      let c = mix(hex('#8c5a24'), hex('#d9a24e'), strand);
      c = mix(c, hex('#e9c276'), (1 - t) * 0.25); // sun on the upper slope
      c = shade(c, 0.78 + ((course - cy) / course) * 0.28); // each course lit at its top
      if (cy >= course - 2) c = shade(c, 0.55); // the shadowed underside of a course
      if (cy === 0) c = shade(c, 1.15);
      c = shade(c, lit);
      if (y > roof.eaveY) c = shade(c, 0.6); // the hanging fringe in shade
      r.set(x, y, c);
    }
  }
  // Fine strands.
  for (let i = 0; i < 3200; i++) {
    const y = roof.ridgeY + rng.float(0, roof.eaveY - roof.ridgeY + 4);
    const [l, rt] = roofHalfWidth(roof, Math.min(y, roof.eaveY));
    const x = rng.float(l + 1, rt - 1);
    const lit = x < mid;
    r.line(
      x,
      y,
      x + rng.float(-0.6, 0.6),
      y + rng.int(2, 5),
      lit ? hex('#f4cf7e') : hex('#5a3a16'),
      0.35,
    );
  }
  // Ridge cap: a thick woven band, darker, with spars.
  for (let y = roof.ridgeY - 5; y <= roof.ridgeY + 3; y++) {
    const half = (roof.rx1 - roof.rx0) / 2 + 4 + (y - roof.ridgeY) * 0.8;
    for (let x = mid - half; x <= mid + half; x++) {
      const weave = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0 ? 0.85 : 1;
      let c = mix(hex('#6b4418'), hex('#b07c34'), fbm(x / 3, y / 2, 2, salt + 3));
      c = shade(c, weave * (y > roof.ridgeY + 1 ? 0.6 : 1));
      r.set(x, y + (vnoise(x / 9, 0, salt + 4) - 0.5) * 2, c);
    }
  }
  for (let x = mid - (roof.rx1 - roof.rx0) / 2; x <= mid + (roof.rx1 - roof.rx0) / 2; x += 11) {
    r.line(x - 3, roof.ridgeY + 6, x, roof.ridgeY - 4, hex('#3a2410'));
    r.line(x + 3, roof.ridgeY + 6, x, roof.ridgeY - 4, hex('#3a2410'));
  }
}

/** Scalloped slate: dark blue-grey rows, every slate a slightly different tone. */
export function roofSlate(r: Raster, roof: Roof, salt: number): void {
  const row = 6;
  const mid = (roof.x0 + roof.x1) / 2;
  for (let y = roof.ridgeY - 2; y <= roof.eaveY + 2; y++) {
    const [l, rt] = roofHalfWidth(roof, Math.min(y, roof.eaveY));
    for (let x = l - 1; x <= rt + 1; x++) {
      if (x < l - (fbm(y / 4, 0, 2, salt) - 0.5) * 2 || x > rt + (fbm(y / 4, 1, 2, salt) - 0.5) * 2)
        continue;
      const ry = Math.floor((y - roof.ridgeY) / row);
      const off = (ry % 2) * 5;
      const col = Math.floor((x + off) / 10);
      const fx = ((x + off) % 10) / 10;
      const fy = ((y - roof.ridgeY) % row) / row;
      const scallop = fy > 0.6 && Math.hypot((fx - 0.5) * 2, (fy - 0.6) * 2.5) > 1;
      const tone = hash(col, ry, salt + 1);
      let c = mix(
        hex('#2d3448'),
        hex('#5c6a86'),
        tone * 0.7 + fbm(x / 5, y / 5, 2, salt + 2) * 0.3,
      );
      c = shade(c, 0.8 + (1 - fy) * 0.25);
      if (scallop || fx < 0.06) c = shade(c, 0.5);
      if (x < mid) c = shade(c, 1.12);
      r.set(x, y, c);
    }
  }
  r.rect(
    mid - (roof.rx1 - roof.rx0) / 2 - 2,
    roof.ridgeY - 3,
    roof.rx1 - roof.rx0 + 4,
    3,
    hex('#1f2434'),
  );
}

/** Curved ceramic tiles: round ridges and dark troughs, a heavy ridge beam, upturned ends. */
export function roofTiles(r: Raster, roof: Roof, salt: number, tint = hex('#4f6b7a')): void {
  const mid = (roof.x0 + roof.x1) / 2;
  for (let y = roof.ridgeY; y <= roof.eaveY + 2; y++) {
    const [l, rt] = roofHalfWidth(roof, Math.min(y, roof.eaveY));
    for (let x = l; x <= rt; x++) {
      const t = clamp01((y - roof.ridgeY) / (roof.eaveY - roof.ridgeY));
      const lane = (((x - mid) % 6) + 6) % 6;
      const bump = Math.cos(((lane - 3) / 3) * Math.PI) * 0.5 + 0.5; // round tile profile
      const row = Math.floor((y - roof.ridgeY) / 7);
      const fy = ((y - roof.ridgeY) % 7) / 7;
      let c = mix(shade(tint, 0.55), shade(tint, 1.35), bump);
      c = shade(c, 0.85 + (1 - fy) * 0.2 + hash(Math.floor((x - mid) / 6), row, salt) * 0.1);
      if (fy > 0.82) c = shade(c, 0.55);
      c = shade(c, 1 - t * 0.15);
      if (x < mid) c = shade(c, 1.1);
      r.set(x, y, c);
    }
  }
  r.rect(roof.rx0 - 6, roof.ridgeY - 4, roof.rx1 - roof.rx0 + 12, 5, hex('#2a2f3a'));
  r.rect(roof.rx0 - 6, roof.ridgeY - 4, roof.rx1 - roof.rx0 + 12, 1, hex('#5a6270'));
  // Upturned ends.
  for (let i = 0; i < 6; i++) {
    r.set(roof.rx0 - 6 - i, roof.ridgeY - 2 - i * 0.8, hex('#2a2f3a'));
    r.set(roof.rx0 - 6 - i, roof.ridgeY - 1 - i * 0.8, hex('#2a2f3a'));
    r.set(roof.rx1 + 6 + i, roof.ridgeY - 2 - i * 0.8, hex('#2a2f3a'));
    r.set(roof.rx1 + 6 + i, roof.ridgeY - 1 - i * 0.8, hex('#2a2f3a'));
  }
}

/** Staggered wood shingles, each a slightly different brown, weathered grey toward the eave. */
export function roofShingles(r: Raster, roof: Roof, salt: number): void {
  const mid = (roof.x0 + roof.x1) / 2;
  for (let y = roof.ridgeY - 1; y <= roof.eaveY + 2; y++) {
    const [l, rt] = roofHalfWidth(roof, Math.min(y, roof.eaveY));
    for (let x = l - 1; x <= rt + 1; x++) {
      const ry = Math.floor((y - roof.ridgeY) / 6);
      const off = (ry % 2) * 4;
      const col = Math.floor((x + off) / 8);
      const fx = ((x + off) % 8) / 8;
      const fy = ((y - roof.ridgeY) % 6) / 6;
      const t = clamp01((y - roof.ridgeY) / (roof.eaveY - roof.ridgeY));
      const tone = hash(col, ry, salt);
      let c = mix(hex('#6a4a2a'), hex('#b8864a'), tone);
      c = mix(c, hex('#8a8a86'), t * 0.5 * hash(col, ry, salt + 1)); // weathering
      c = mix(c, shade(c, 0.7), ridged(x / 3, y / 1.5, 2, salt + 2) * 0.5);
      if (fy > 0.8 || fx < 0.1) c = shade(c, 0.5);
      if (x < mid) c = shade(c, 1.1);
      r.set(x, y, c);
    }
  }
  r.rect(roof.rx0 - 2, roof.ridgeY - 3, roof.rx1 - roof.rx0 + 4, 3, hex('#3a2a18'));
}

/** A copper dome gone green: seams in wedges, a lit side, a finial. */
export function roofDome(
  r: Raster,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  salt: number,
): void {
  for (let y = cy - ry; y <= cy; y++) {
    for (let x = cx - rx; x <= cx + rx; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy > 1) continue;
      const nz = Math.sqrt(1 - dx * dx - dy * dy);
      const lit = clamp01(0.5 - dx * 0.4 + nz * 0.5 + dy * 0.2);
      const seam = Math.abs((((Math.atan2(dx, nz) / Math.PI) * 8) % 1) - 0.5) < 0.05;
      let c = mix(hex('#2f6b5a'), hex('#7cc4a4'), lit * 0.8 + fbm(x / 6, y / 6, 2, salt) * 0.3);
      c = mix(c, hex('#8a5a32'), clamp01(fbm(x / 9, y / 9, 3, salt + 1) - 0.62) * 1.5); // bare copper
      if (seam) c = shade(c, 0.65);
      r.set(x, y, c);
    }
  }
  r.rect(cx - 1, cy - ry - 6, 3, 6, hex('#3a2a18'));
  r.disc(cx + 0.5, cy - ry - 7, 2, hex('#e0b84a'));
}

/** A conical roof (towers, the hut) for any of the flat roof painters: build a Roof and clip to the cone. */
export function cone(cx: number, topY: number, baseY: number, baseHalf: number, topHalf = 3): Roof {
  return {
    x0: cx - baseHalf,
    x1: cx + baseHalf,
    eaveY: baseY,
    rx0: cx - topHalf,
    rx1: cx + topHalf,
    ridgeY: topY,
  };
}
