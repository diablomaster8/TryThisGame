/**
 * Colour for the 3D art species (LOOK-09). The pocket and digital lines take their colours from
 * the shared pixel palette, and under the stage's lights and sheen they came out milky next to
 * their pixel originals. Each palette hex is pushed a little further out in OKLCH chroma here
 * (hue and lightness kept, clamped back into sRGB), and `REF_HEX` holds the reference body
 * colours the likeness test measures against.
 */

const toLin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c: number) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

/** sRGB hex to OKLab. */
export function oklab(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const r = toLin(((n >> 16) & 255) / 255);
  const g = toLin(((n >> 8) & 255) / 255);
  const b = toLin((n & 255) / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function linFromLab(L: number, a: number, b: number): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (c: number[]) => c.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** OKLab back to an sRGB hex. */
function hexOf(rgb: number[]): string {
  return (
    '#' +
    rgb
      .map((v) =>
        Math.round(Math.min(1, Math.max(0, toSrgb(Math.min(1, Math.max(0, v))))) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

/** How much further out in chroma an art species' colours sit in 3D. */
export const ART_CHROMA = 1.12;

/**
 * The colour pushed out in OKLCH chroma by `gain`, hue and lightness kept. A colour that would
 * leave sRGB is pulled back by bisection on chroma, so a vivid yellow stays yellow, not orange.
 */
export function vivid(hex: string, gain = ART_CHROMA): string {
  const [L, a, b] = oklab(hex);
  let lo = 1;
  let hi = gain;
  if (inGamut(linFromLab(L, a * hi, b * hi))) lo = hi;
  else
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(linFromLab(L, a * mid, b * mid))) lo = mid;
      else hi = mid;
    }
  return hexOf(linFromLab(L, a * lo, b * lo));
}

/** OKLab distance, scaled by 100 so it reads like a CIE ΔE. */
export function deltaE(x: string, y: string): number {
  const p = oklab(x);
  const q = oklab(y);
  return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) * 100;
}

/** Reference body colours for the colour-likeness test, keyed by species id (LOOK-09). */
export const REF_HEX: Record<string, string> = {
  zapkin: '#f8d030',
  cinderkit: '#f08030',
  shellpup: '#68b0d8',
  bulblet: '#78c8a8',
  spookgrin: '#705898',
  snoozelump: '#2e5c6e',
  dinolet: '#f0a020',
  // Gabumon (peltpup) is left out: the pixel figure shows the blue-white pelt over the front,
  // and the reference's #e8c070 names the skin under it.
  hornsaur: '#f08a1c',
  flapkit: '#f0b060',
};
