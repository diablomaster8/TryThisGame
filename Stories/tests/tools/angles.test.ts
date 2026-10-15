/**
 * A contact sheet of every drawn angle and clip for a few looks, to catch stray pixels
 * and odd eyes:
 *
 *   PREVIEW_ANGLES=path/to/angles.png npx vitest run tests/tools
 */
import { writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { CLIPS, type ClipName } from '../../src/render/sprites/animations';
import {
  adultColors,
  CHILD_NEUTRAL,
  drawChao,
  lookOf,
  poseFor,
  shadowColors,
} from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import type { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { SPECIES_ART } from '../../src/render/sprites/species-art';
import { blitScaled, encodePng, solid } from './png';

it.skipIf(!process.env.PREVIEW_ANGLES)('writes every angle and clip for a few looks', () => {
  const clips = Object.keys(CLIPS) as ClipName[];
  const looks: Array<
    [string, (clip: ClipName, f: number, angle: (typeof DRAWN_ANGLES)[number]) => PixelCanvas]
  > = [
    ['child', (c, f, a) => drawChao(a, poseFor(c, f), lookOf(CHILD_NEUTRAL))],
    ['sun fly', (c, f, a) => drawChao(a, poseFor(c, f), lookOf(adultColors('sun', 'fly'), 'fly'))],
    [
      'moon power',
      (c, f, a) => drawChao(a, poseFor(c, f), lookOf(adultColors('moon', 'power'), 'power')),
    ],
    ['shadow', (c, f, a) => drawChao(a, poseFor(c, f), lookOf(shadowColors(CHILD_NEUTRAL)))],
    ...['zapling', 'starbud', 'puffbud', 'zapmaw', 'starwing']
      .filter((id) => SPECIES_ART[id])
      .map(
        (
          id,
        ): [string, (c: ClipName, f: number, a: (typeof DRAWN_ANGLES)[number]) => PixelCanvas] => [
          id,
          (c, f, a) => drawCreature(a, poseFor(c, f), SPECIES_ART[id]!),
        ],
      ),
  ];
  const scale = 2;
  const cell = 34 * scale;
  // Columns: every angle of the idle frame, then frame 0 of every other clip (front).
  const columns = DRAWN_ANGLES.length + (clips.length - 1);
  const width = cell * columns;
  const height = cell * looks.length;
  const rgba = solid(width, height, '#3a3550');
  looks.forEach(([, draw], r) => {
    let c = 0;
    for (const angle of DRAWN_ANGLES) {
      blitScaled(rgba, width, draw('idle', 0, angle), c * cell + scale, r * cell + scale, scale);
      c++;
    }
    for (const clip of clips) {
      if (clip === 'idle') continue;
      blitScaled(rgba, width, draw(clip, 0, 'front'), c * cell + scale, r * cell + scale, scale);
      c++;
    }
  });
  writeFileSync(process.env.PREVIEW_ANGLES!, encodePng(width, height, rgba));
  expect(looks.length).toBeGreaterThan(4);
});
