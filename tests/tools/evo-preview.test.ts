/**
 * Lane F r11 (EVO): a contact sheet of every family's evolution ladder in Pixel, front and
 * front three-quarter, one row per line:
 *
 *   PREVIEW_EVO=path/to/evo.png npx vitest run tests/tools/evo-preview.test.ts
 */
import { writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import {
  adultColors,
  CHILD_NEUTRAL,
  drawChao,
  eternalColors,
  lookOf,
  poseFor,
  secondColors,
  type ChaoLook,
} from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { speciesArt } from '../../src/render/sprites/species-art';
import { RADIANT_PX } from '../../src/config/tuning';
import { radiantColors } from '../../src/render/sprites/radiant-sign';
import type { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import type { NubbinType } from '../../src/sim/types';
import { blitScaled, encodePng, solid } from './png';

type Band = 'sun' | 'moon' | 'neutral';
type Angle = 'front' | 'frontQuarter';

function chaoLadder(
  band: Band,
  type: NubbinType,
  second: NubbinType,
): ((a: Angle) => PixelCanvas)[] {
  const draw = (look: ChaoLook) => (a: Angle) => drawChao(a, poseFor('idle', 0), look);
  const first = lookOf(adultColors(band, type), type, null, undefined, false, null, false, band);
  const sec = lookOf(
    secondColors(band, type, second),
    type,
    second,
    undefined,
    false,
    null,
    false,
    band,
  );
  const rad: ChaoLook = {
    ...sec,
    colors: radiantColors(sec.colors, band),
    shape: {
      ...sec.shape,
      radiantBand: band,
      wingScale: Math.max(sec.shape.wingScale, RADIANT_PX.wingScale),
    },
  };
  const eternal = lookOf(eternalColors(band), 'normal', null, undefined, true, null, false, band);
  return [draw(lookOf(CHILD_NEUTRAL)), draw(first), draw(sec), draw(rad), draw(eternal)];
}

const art = (id: string) => (a: Angle) => drawCreature(a, poseFor('idle', 0), speciesArt(id)!);

it.skipIf(!process.env.PREVIEW_EVO)('writes the evolution ladders', () => {
  const chaoOnly = !!process.env.PREVIEW_EVO_CHAO;
  const all = [
    chaoLadder('sun', 'power', 'fly'),
    chaoLadder('moon', 'swim', 'run'),
    chaoLadder('neutral', 'run', 'power'),
    ['zapling', 'zapkin', 'zapmaw', 'radiant:zapmaw'].map(art),
    ['shellbit', 'shellwing', 'shellhalo', 'radiant:shellhalo'].map(art),
    ['juv:skyfang', 'skyfang', 'radiant:skyfang'].map(art),
    ['juv:snoozelump', 'snoozelump', 'radiant:snoozelump'].map(art),
    ['kindlefox', 'radiant:kindlefox', 'boulderwyrm', 'ironwyrm', 'radiant:ironwyrm'].map(art),
    ['fuzzlet', 'chompet', 'dinolet', 'hornsaur', 'ironsaur'].map(art),
  ];
  const rows = chaoOnly ? all.slice(0, 3).map((r) => r.slice(2)) : all;
  const scale = chaoOnly ? 5 : 2;
  const probe = rows[0]![0]!('front');
  const cell = probe.width * scale + 8;
  const cols = 5 * 2;
  const width = cell * cols;
  const height = cell * rows.length;
  const rgba = solid(width, height, '#3a3550');
  rows.forEach((row, r) =>
    row.forEach((draw, c) =>
      (['front', 'frontQuarter'] as const).forEach((a, k) =>
        blitScaled(rgba, width, draw(a), (c * 2 + k) * cell + 4, r * cell + 4, scale),
      ),
    ),
  );
  writeFileSync(process.env.PREVIEW_EVO!, encodePng(width, height, rgba));
  expect(all.length).toBe(9);
});
