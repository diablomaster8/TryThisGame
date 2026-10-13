/**
 * Scenery and Keeper contact sheets:
 *
 *   PREVIEW_SCENERY=path/to/scenery.png npx vitest run tests/tools
 */
import { writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { drawScenery, type SceneryKind } from '../../src/render/sprites/scenery';
import { TRAINERS } from '../../src/sim/trainers';
import { blitScaled, encodePng, solid } from './png';

it.skipIf(!process.env.PREVIEW_SCENERY)(
  'writes the scenery pieces and a Keeper strip',
  async () => {
    const kinds: SceneryKind[] = [
      'tree',
      'tree2',
      'bush',
      'bush2',
      'cottage',
      'school',
      'dojo',
      'well',
      'log',
    ];
    const scale = 2;
    const cell = 66 * scale;
    const width = cell * kinds.length;
    const height = cell + 36 * scale;
    const rgba = solid(width, height, '#5a8f3c');
    kinds.forEach((k, i) =>
      blitScaled(rgba, width, drawScenery(k), i * cell + scale, scale, scale),
    );
    // The Keeper at every angle, two looks, through the drawer (no DOM needed).
    const { drawKeeperFrame } = await import('../../src/render/sprites/keeper');
    [TRAINERS[0]!, TRAINERS[5]!].forEach((t, row) => {
      DRAWN_ANGLES.forEach((angle, i) => {
        blitScaled(
          rgba,
          width,
          drawKeeperFrame(angle, 'idle', 0, t.look),
          (row * 6 + i) * 34 * scale + scale,
          cell + scale,
          scale,
        );
      });
    });
    writeFileSync(process.env.PREVIEW_SCENERY!, encodePng(width, height, rgba));
    expect(kinds.length).toBe(9);
  },
);
