/**
 * Writes the PWA icons (public/icons/icon-192.png, icon-512.png) from the Chao drawer
 * with a tiny PNG encoder, so no image tooling is needed. It runs through Vitest because
 * that already resolves the project's TypeScript; it is skipped unless asked for:
 *
 *   MAKE_ICONS=1 npx vitest run tests/tools
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { expect, it } from 'vitest';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from '../../src/render/sprites/chao';
import { PALETTE } from '../../src/render/sprites/palette';
import { hexToRgb } from '../../src/render/sprites/pixel-canvas';

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

function icon(size: number): Uint8Array {
  const sprite = drawChao('front', poseFor('happy', 0), lookOf(CHILD_NEUTRAL));
  const scale = Math.floor((size * 0.8) / 32);
  const offset = Math.floor((size - 32 * scale) / 2);
  const rgba = new Uint8Array(size * size * 4);
  const [br, bg, bb] = hexToRgb(PALETTE[16]);
  for (let i = 0; i < size * size; i++) rgba.set([br, bg, bb, 255], i * 4);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const idx = sprite.get(x, y);
      if (idx < 0) continue;
      const [r, g, b] = hexToRgb(PALETTE[idx] ?? '#000000');
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          rgba.set(
            [r, g, b, 255],
            ((offset + y * scale + dy) * size + offset + x * scale + dx) * 4,
          );
        }
      }
    }
  }
  return encodePng(size, size, rgba);
}

it('encodes a valid PNG header', () => {
  const png = encodePng(2, 2, new Uint8Array(16));
  expect(Array.from(png.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  expect(String.fromCharCode(...png.subarray(12, 16))).toBe('IHDR');
});

it.skipIf(!process.env.MAKE_ICONS)('writes the PWA icons', () => {
  mkdirSync('public/icons', { recursive: true });
  for (const size of [192, 512]) writeFileSync(`public/icons/icon-${size}.png`, icon(size));
  expect(true).toBe(true);
});
