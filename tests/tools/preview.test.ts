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
  shadowColors,
  VARIANT_COLORS,
  variantColors,
  type ChaoColors,
  type ChaoLook,
} from '../../src/render/sprites/chao';
import { drawChaoHiRes, type HiResLook } from '../../src/render/sprites/chao-hires';
import { C } from '../../src/render/sprites/palette';
import { drawCreature } from '../../src/render/sprites/creature';
import type { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { blitScaled, encodePng, solid } from './png';

it.skipIf(!process.env.PREVIEW_HIRES3)('writes three more looks at 32, 48 and 64 px', () => {
  // Rows: Sun adult (Fly), Moon adult (Power), Shadow child. Columns: 32 ×4, 48 ×3, 64 ×2.
  const looks: Array<[ChaoColors, HiResLook, ChaoLook]> = [
    [
      adultColors('sun', 'fly'),
      { wings: 'feathered', ball: 'halo', iris: C.skyDeep },
      lookOf(adultColors('sun', 'fly'), 'fly'),
    ],
    [
      adultColors('moon', 'power'),
      { wings: 'bat', ball: 'spiky', iris: C.berry },
      lookOf(adultColors('moon', 'power'), 'power'),
    ],
    [
      shadowColors(CHILD_NEUTRAL),
      { wings: 'small', ball: 'ball', iris: C.ember },
      lookOf(shadowColors(CHILD_NEUTRAL)),
    ],
  ];
  const cell = 48 * 3 + 16;
  const width = cell * 3;
  const height = cell * looks.length;
  const rgba = solid(width, height, '#3a3550');
  looks.forEach(([col, hi, look32], r) => {
    const sprites: Array<[number, PixelCanvas]> = [
      [4, drawChao('front', poseFor('idle', 0), look32)],
      [3, drawChaoHiRes(48, col, hi)],
      [2, drawChaoHiRes(64, col, hi)],
    ];
    sprites.forEach(([s, pc], i) => blitScaled(rgba, width, pc, i * cell + 8, r * cell + 8, s));
  });
  writeFileSync(process.env.PREVIEW_HIRES3!, encodePng(width, height, rgba));
  expect(looks.length).toBe(3);
});

it.skipIf(!process.env.PREVIEW_HIRES2)('writes the next tiers: 96, 128 and 192 px', () => {
  const sizes = [64, 96, 128, 192] as const;
  const cell = 192 + 16;
  const width = cell * sizes.length;
  const height = cell;
  const rgba = solid(width, height, '#3a3550');
  sizes.forEach((size, i) => {
    const pc = drawChaoHiRes(size);
    blitScaled(rgba, width, pc, i * cell + 8 + (192 - size) / 2, 8 + (192 - size), 1);
  });
  writeFileSync(process.env.PREVIEW_HIRES2!, encodePng(width, height, rgba));
  expect(sizes.length).toBe(4);
});

it.skipIf(!process.env.PREVIEW_HIRES)('writes the resolution comparison: 32, 48 and 64 px', () => {
  // Each shown at the same on-screen size (a 1080p monitor): 32 px ×4, 48 px ×3, 64 px ×2.
  const scaleFor = { 32: 4, 48: 3, 64: 2 } as const;
  const cellPx = 64 * 2 + 16;
  const width = cellPx * 3;
  const height = cellPx + 16;
  const rgba = solid(width, height, '#3a3550');
  const sprites: Array<[number, PixelCanvas]> = [
    [32, drawChao('front', poseFor('idle', 0), lookOf(CHILD_NEUTRAL))],
    [48, drawChaoHiRes(48)],
    [64, drawChaoHiRes(64)],
  ];
  sprites.forEach(([size, pc], i) => {
    const s = scaleFor[size as 32 | 48 | 64];
    blitScaled(rgba, width, pc, i * cellPx + 8, 8, s);
  });
  writeFileSync(process.env.PREVIEW_HIRES!, encodePng(width, height, rgba));
  expect(sprites.length).toBe(3);
});

it.skipIf(!process.env.PREVIEW_SPECIES)('writes a preview sheet of every species', () => {
  const ids = Object.keys(SPECIES_ART);
  const cols = 7;
  const scale = 3;
  const cell = 34 * scale;
  const angles = ['front', 'side'] as const;
  const rows = Math.ceil(ids.length / cols);
  const width = cell * cols * angles.length;
  const height = cell * rows;
  const rgba = solid(width, height, '#3a3550');
  ids.forEach((id, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    angles.forEach((angle, k) => {
      const pc = drawCreature(angle, poseFor('idle', 0), SPECIES_ART[id]!);
      blitScaled(rgba, width, pc, (c * angles.length + k) * cell + scale, r * cell + scale, scale);
    });
  });
  writeFileSync(process.env.PREVIEW_SPECIES!, encodePng(width, height, rgba));
  expect(ids.length).toBeGreaterThan(40);
});

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
