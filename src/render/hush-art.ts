import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import { fbm } from './paint/noise';

/**
 * C8, pixel: the Hush as a tall, soft grey silhouette: a round head, sloped shoulders and
 * long arms hung to the ground, its foot lost in fog. Painted a pixel at a time with no
 * outline; its edge is an ordered dither, so it reads as weather rather than a cut-out. It
 * is still: the pixel view fades it in, and reduced motion only skips the fade.
 */
export const HUSH_PX = { w: 48, h: 108 };

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

/** How much of the shape covers a spot, 0..1: the head, neck, shoulders, body and arms. */
function density(x: number, y: number): number {
  const lobe = (cx: number, cy: number, rx: number, ry: number) => {
    const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
    return Math.max(0, 1 - d);
  };
  const cloud = (fbm(x / 7, y / 9, 2, 41) - 0.5) * 0.35;
  const head = lobe(24, 17, 8.5, 9.5);
  const neck = lobe(24, 30, 6, 7);
  const shoulders = lobe(24, 42, 20, 11);
  const body = lobe(24, 70, 15, 40);
  const armL = lobe(8, 66, 5.5, 34);
  const armR = lobe(40, 66, 5.5, 34);
  return Math.min(1, Math.max(head, neck, shoulders, body, armL, armR) * 1.25 + cloud);
}

const GREYS = ['#b9c1cd', '#9aa4b4', '#7d889b', '#677286'];

export function paintHush(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = HUSH_PX.w;
  c.height = HUSH_PX.h;
  const g = c.getContext('2d')!;
  for (let y = 0; y < HUSH_PX.h; y++)
    for (let x = 0; x < HUSH_PX.w; x++) {
      let d = density(x, y);
      // The foot goes into the fog: the lowest fifth thins out on the same dither.
      d *= Math.min(1, (HUSH_PX.h - y) / (HUSH_PX.h * 0.22));
      const t = (BAYER[(y % 4) * 4 + (x % 4)]! + 0.5) / 16;
      // Solid inside, ordered dither across the soft edge.
      if (d < 0.18 + t * 0.34) continue;
      // Lighter towards the top, darker in the body and arms' hollows.
      const drift = (fbm(x / 5, y / 6, 2, 43) - 0.5) * 2.4;
      const tone = Math.min(
        3,
        Math.max(0, Math.round((1 - d) * 2.2 + (y / HUSH_PX.h) * 1.2 + drift)),
      );
      g.fillStyle = GREYS[tone]!;
      g.fillRect(x, y, 1, 1);
    }
  return c;
}

export function hushTexture(): CanvasTexture {
  const t = new CanvasTexture(paintHush());
  t.magFilter = NearestFilter;
  t.minFilter = NearestFilter;
  t.generateMipmaps = false;
  t.colorSpace = SRGBColorSpace;
  return t;
}
