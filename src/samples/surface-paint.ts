import { fbm, ridged, vnoise } from '../render/paint/noise';
import { hex, mix, Raster, shade, type RGB } from '../render/paint/raster';

/**
 * The painted PBR surfaces (grass, rock, dirt and the rest) and the leaf and tuft cards,
 * as plain bytes. Nothing here touches the DOM or a GPU, so the same painters run on the
 * page for the `?aaa` stage and in `render3d/surface-worker.ts` for the 3D Grove, which
 * paints its ten textures off the main thread while the scene boots.
 */

export type Kind = 'grass' | 'rock' | 'dirt' | 'bark' | 'cobble' | 'plaster' | 'roof' | 'wood';

export interface Painted {
  albedo: Raster;
  height: Float32Array;
  size: number;
}

/** Albedo and a height field, painted on a torus so the tile wraps. */
export function paint(kind: Kind, size: number): Painted {
  const r = new Raster(size, size, hex('#5f9e3c'));
  const height = new Float32Array(size * size);
  const s = size;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const ax = Math.cos((x / s) * Math.PI * 2) * 1.6;
      const ay = Math.sin((x / s) * Math.PI * 2) * 1.6;
      const bx = Math.cos((y / s) * Math.PI * 2) * 1.6;
      const by = Math.sin((y / s) * Math.PI * 2) * 1.6;
      const n = fbm(ax + bx + 5, ay + by + 5, 4, 51);
      const fine = fbm(x / (s / 24), y / (s / 24), 3, 52);
      const micro = fbm(x / (s / 64), y / (s / 64), 2, 53);
      let c: RGB;
      let h: number;
      switch (kind) {
        case 'grass': {
          // Blades: many fine, directional strokes over a mottled base.
          const blade = Math.abs(vnoise(x / (s / 90), y / (s / 14), 54) - 0.5) < 0.06;
          c = mix(hex('#3f8a2e'), hex('#8ed455'), Math.max(0, Math.min(1, (n - 0.3) * 1.8)));
          c = shade(c, 0.8 + fine * 0.4);
          if (blade) c = shade(c, 1.22);
          if (micro > 0.78) c = mix(c, hex('#d8e86a'), 0.3);
          h = 0.45 + (blade ? 0.3 : 0) + micro * 0.2;
          break;
        }
        case 'rock': {
          const strata = fbm(ax + 9, (y / s) * 8 + fbm(ax, 0, 2, 55) * 1.2, 3, 56);
          const g = ridged(x / (s / 10), y / (s / 10), 4, 57);
          c = mix(hex('#6a4a3a'), hex('#c8a080'), strata * 0.5 + g * 0.5);
          if (g > 0.86) c = shade(c, 0.45);
          if (micro > 0.8) c = mix(c, hex('#8a9a6a'), 0.35); // lichen
          h = g * 0.8 + strata * 0.2;
          break;
        }
        case 'dirt': {
          c = mix(hex('#6a4a2a'), hex('#b89262'), n * 0.6 + fine * 0.4);
          const pebble = vnoise(x / (s / 40), y / (s / 40), 58) > 0.8;
          if (pebble) c = mix(c, hex('#a8a8a0'), 0.6);
          h = 0.4 + fine * 0.3 + (pebble ? 0.3 : 0);
          break;
        }
        case 'bark': {
          const ridge = ridged(x / (s / 7), y / (s / 40), 3, 59);
          c = mix(hex('#3e2816'), hex('#8a6240'), ridge * 0.6 + n * 0.4);
          if (ridge > 0.85) c = shade(c, 0.5);
          h = ridge;
          break;
        }
        case 'cobble': {
          const cell = vnoise(x / (s / 9), y / (s / 9), 60);
          const cell2 = vnoise(x / (s / 9) + 3, y / (s / 9), 61);
          const joint = Math.abs(cell - 0.5) < 0.04 || Math.abs(cell2 - 0.5) < 0.035;
          c = mix(hex('#8a98a8'), hex('#e0e8ee'), n * 0.5 + fine * 0.5);
          if (joint) c = shade(c, 0.4);
          h = joint ? 0.1 : 0.6 + fine * 0.35;
          break;
        }
        case 'plaster':
          c = mix(hex('#e6dcc6'), hex('#fff8ea'), n);
          if (micro > 0.82) c = shade(c, 0.9);
          h = 0.5 + micro * 0.25;
          break;
        case 'roof': {
          const row = Math.floor(y / (s / 10));
          const tx = (x + (row % 2) * (s / 20)) % (s / 10);
          const ty = y % (s / 10);
          c = mix(hex('#8a3a2a'), hex('#d87a5a'), fine);
          const edge = tx < s / 120 || ty < s / 100;
          if (edge) c = shade(c, 0.45);
          h = edge ? 0.1 : 0.55 + (ty / (s / 10)) * 0.35;
          break;
        }
        default: {
          const plank = Math.floor(y / (s / 5));
          c = mix(
            hex('#7a4e26'),
            hex('#cfa066'),
            fbm(x / (s / 8), plank * 3, 3, 62) * 0.7 + fine * 0.3,
          );
          const seam = y % (s / 5) < 2;
          if (seam) c = shade(c, 0.45);
          h = seam ? 0.2 : 0.5 + fine * 0.3;
        }
      }
      r.set(x, y, c);
      height[y * s + x] = h;
    }
  }
  return { albedo: r, height, size };
}

/** Tangent-space normal bytes (RGBA) from a painted height field. */
export function normalBytes(p: Painted, strength: number): Uint8Array {
  const s = p.size;
  const data = new Uint8Array(s * s * 4);
  const h = (x: number, y: number) => p.height[((y + s) % s) * s + ((x + s) % s)]!;
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const dx = (h(x + 1, y) - h(x - 1, y)) * strength;
      const dy = (h(x, y + 1) - h(x, y - 1)) * strength;
      // The same arithmetic as THREE.Vector3.normalize, so the bytes match it exactly.
      const k = 1 / (Math.sqrt(dx * dx + dy * dy + 1) || 1);
      const i = (y * s + x) * 4;
      data[i] = Math.round((-dx * k * 0.5 + 0.5) * 255);
      data[i + 1] = Math.round((-dy * k * 0.5 + 0.5) * 255);
      data[i + 2] = Math.round((1 * k * 0.5 + 0.5) * 255);
      data[i + 3] = 255;
    }
  }
  return data;
}

/** A card of overlapping leaves with alpha, for the instanced canopies. */
export function leafRaster(size: number): Raster {
  const r = new Raster(size, size, null);
  r.tracking = true;
  const rng = { v: 7, next: () => (rng.v = (rng.v * 16807) % 2147483647) / 2147483647 };
  for (let i = 0; i < 14; i++) {
    const cx = size * (0.2 + rng.next() * 0.6);
    const cy = size * (0.2 + rng.next() * 0.6);
    const rx = size * (0.1 + rng.next() * 0.08);
    const ry = rx * (0.5 + rng.next() * 0.3);
    const tone = mix(hex('#2d7a2a'), hex('#8fd255'), rng.next());
    r.ellipse(cx, cy, rx, ry, tone);
    r.ellipse(cx - rx * 0.25, cy - ry * 0.3, rx * 0.55, ry * 0.45, shade(tone, 1.22));
    r.line(cx - rx * 0.8, cy, cx + rx * 0.8, cy, shade(tone, 0.7));
  }
  r.tracking = false;
  return r;
}

/** A tuft of grass blades with alpha. */
export function tuftRaster(size: number): Raster {
  const r = new Raster(size, size, null);
  r.tracking = true;
  for (let i = 0; i < 9; i++) {
    const x0 = size * (0.3 + (i / 9) * 0.4);
    const lean = (i - 4) * size * 0.06;
    const h = size * (0.55 + ((i * 7) % 5) * 0.08);
    const tone = mix(hex('#3f8a2e'), hex('#a8e060'), ((i * 5) % 9) / 9);
    for (let t = 0; t < 1; t += 0.02) {
      const x = x0 + lean * t * t;
      const y = size - t * h;
      r.disc(x, y, size * 0.03 * (1 - t) + 0.6, t > 0.7 ? shade(tone, 1.2) : tone);
    }
  }
  r.tracking = false;
  return r;
}

/** One texture to paint: a surface (albedo and normal) or a card (albedo with alpha). */
export type PaintJob =
  { kind: Kind; size: number; strength: number } | { kind: 'leaf' | 'tuft'; size: number };

/** What a job paints: RGBA albedo (opaque for surfaces) and, for surfaces, RGBA normals. */
export interface PaintedBytes {
  size: number;
  albedo: Uint8Array;
  normal: Uint8Array | null;
}

export function paintJob(job: PaintJob): PaintedBytes {
  if (!('strength' in job)) {
    const r = job.kind === 'leaf' ? leafRaster(job.size) : tuftRaster(job.size);
    return { size: job.size, albedo: r.toRgba(1, false).rgba, normal: null };
  }
  const p = paint(job.kind, job.size);
  return {
    size: job.size,
    albedo: p.albedo.toRgba(1, true).rgba,
    normal: normalBytes(p, job.strength),
  };
}
