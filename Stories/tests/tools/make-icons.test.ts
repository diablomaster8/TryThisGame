/**
 * Writes the PWA icons (public/icons/icon-192.png, icon-512.png) from the Chao drawer.
 * It runs through Vitest because that already resolves the project's TypeScript; it is
 * skipped unless asked for:
 *
 *   MAKE_ICONS=1 npx vitest run tests/tools
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from '../../src/render/sprites/chao';
import { PALETTE } from '../../src/render/sprites/palette';
import { blitScaled, encodePng, solid } from './png';

function icon(size: number): Uint8Array {
  const sprite = drawChao('front', poseFor('happy', 0), lookOf(CHILD_NEUTRAL));
  const scale = Math.floor((size * 0.8) / 32);
  const offset = Math.floor((size - 32 * scale) / 2);
  const rgba = solid(size, size, PALETTE[16]);
  blitScaled(rgba, size, sprite, offset, offset, scale);
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
