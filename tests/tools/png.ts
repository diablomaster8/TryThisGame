import { deflateSync } from 'node:zlib';
import { PALETTE } from '../../src/render/sprites/palette';
import { hexToRgb, type PixelCanvas } from '../../src/render/sprites/pixel-canvas';

/** A tiny PNG encoder (RGBA, no filtering) for icons and previews. */

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = (CRC_TABLE[(c ^ b) & 0xff] ?? 0) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  out.set(
    [...type].map((ch) => ch.charCodeAt(0)),
    4,
  );
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

export function encodePng(width: number, height: number, rgba: Uint8Array): Uint8Array {
  const raw = new Uint8Array((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    raw.set(rgba.subarray(y * width * 4, (y + 1) * width * 4), y * (width * 4 + 1) + 1);
  }
  const ihdr = new Uint8Array(13);
  const v = new DataView(ihdr.buffer);
  v.setUint32(0, width);
  v.setUint32(4, height);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const idat = new Uint8Array(deflateSync(raw));
  const parts = [sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', new Uint8Array(0))];
  const png = new Uint8Array(parts.reduce((a, p) => a + p.length, 0));
  let o = 0;
  for (const p of parts) {
    png.set(p, o);
    o += p.length;
  }
  return png;
}

/** Paint a PixelCanvas into an RGBA buffer at (ox, oy) scaled by `scale`. */
export function blitScaled(
  rgba: Uint8Array,
  width: number,
  pc: PixelCanvas,
  ox: number,
  oy: number,
  scale: number,
): void {
  for (let y = 0; y < pc.height; y++) {
    for (let x = 0; x < pc.width; x++) {
      const idx = pc.get(x, y);
      if (idx < 0) continue;
      const [r, g, b] = hexToRgb(PALETTE[idx] ?? '#000000');
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          rgba.set([r, g, b, 255], ((oy + y * scale + dy) * width + ox + x * scale + dx) * 4);
        }
      }
    }
  }
}

/** A filled RGBA buffer. */
export function solid(width: number, height: number, hex: string): Uint8Array {
  const [r, g, b] = hexToRgb(hex);
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) rgba.set([r, g, b, 255], i * 4);
  return rgba;
}
