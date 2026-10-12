/**
 * Renders a contact sheet of looks to a PNG for eyeballing without a browser:
 *
 *   PREVIEW_OUT=path/to/preview.png npx vitest run tests/tools
 */
import { writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import {
  adultColors,
  CHARACTER_LOOKS,
  CHILD_NEUTRAL,
  drawChao,
  lookOf,
  poseFor,
  VARIANT_COLORS,
  variantColors,
  type ChaoLook,
} from '../../src/render/sprites/chao';
import { blitScaled, encodePng, solid } from './png';

it.skipIf(!process.env.PREVIEW_OUT)('writes a preview sheet of looks', () => {
  const rows: ChaoLook[][] = [];
  // Row per egg colour: child, two-tone, shiny, Sun adult, Moon adult.
  for (const colour of Object.keys(VARIANT_COLORS)) {
    rows.push([
      lookOf(variantColors(CHILD_NEUTRAL, colour)),
      lookOf(variantColors(CHILD_NEUTRAL, colour, false, 'gold')),
      lookOf(variantColors(CHILD_NEUTRAL, colour, true), null, null, undefined, false, null, true),
      lookOf(variantColors(adultColors('sun', 'swim'), colour, false, null, 'sun'), 'swim'),
      lookOf(variantColors(adultColors('moon', 'power'), colour, false, null, 'moon'), 'power'),
    ]);
  }
  rows.push(
    Object.entries(CHARACTER_LOOKS).map(([id, l]) =>
      lookOf(l.colors, 'normal', null, undefined, false, id),
    ),
  );
  rows.push(
    ['straw', 'crown', 'beanie', 'flower', 'bucket'].map((hat) =>
      lookOf(CHILD_NEUTRAL, null, null, undefined, false, hat),
    ),
  );
  const scale = 4;
  const cell = 34 * scale;
  const width = cell * 5;
  const height = cell * rows.length;
  const rgba = solid(width, height, '#3a3550');
  rows.forEach((row, r) => {
    row.forEach((look, c) => {
      blitScaled(
        rgba,
        width,
        drawChao('front', poseFor('idle', 0), look),
        c * cell + scale,
        r * cell + scale,
        scale,
      );
    });
  });
  writeFileSync(process.env.PREVIEW_OUT!, encodePng(width, height, rgba));
  expect(rows.length).toBe(7);
});
