/** Value noise, fractal Brownian motion and domain warping for the organic samples. */
import { hash } from './raster';

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** Smooth value noise in [0, 1] on a unit lattice. */
export function vnoise(x: number, y: number, salt = 0): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const tx = smooth(x - x0);
  const ty = smooth(y - y0);
  const a = hash(x0, y0, salt);
  const b = hash(x0 + 1, y0, salt);
  const c = hash(x0, y0 + 1, salt);
  const d = hash(x0 + 1, y0 + 1, salt);
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

/** Fractal Brownian motion: octaves of value noise, each half the size and weight. */
export function fbm(
  x: number,
  y: number,
  octaves = 5,
  salt = 0,
  lacunarity = 2,
  gain = 0.5,
): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let fx = x;
  let fy = y;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(fx, fy, salt + i * 17) * amp;
    norm += amp;
    amp *= gain;
    fx *= lacunarity;
    fy *= lacunarity;
  }
  return sum / norm;
}

/** Domain-warped fbm: noise sampled through noise, for the wandering edges of real things. */
export function warped(x: number, y: number, strength = 1, salt = 0): number {
  const qx = fbm(x, y, 3, salt + 101);
  const qy = fbm(x + 5.2, y + 1.3, 3, salt + 202);
  return fbm(x + strength * (qx - 0.5) * 2, y + strength * (qy - 0.5) * 2, 5, salt);
}

/** Ridged noise for rock and bark: sharp creases. */
export function ridged(x: number, y: number, octaves = 4, salt = 0): number {
  let sum = 0;
  let amp = 0.5;
  let fx = x;
  let fy = y;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(vnoise(fx, fy, salt + i * 31) * 2 - 1);
    sum += n * n * amp;
    amp *= 0.5;
    fx *= 2.1;
    fy *= 2.1;
  }
  return sum;
}
