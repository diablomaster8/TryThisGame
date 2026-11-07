/**
 * LOOK-43 (R0409, lane F r15): the four big final forms on the 48 px design grid. Each draws
 * inside its 96 px cell at every angle and clip pose without touching the edge rows and
 * columns, and four big sheets plus eight Chao sheets pack within the mega-atlas page budget.
 * Measured: a big sheet is 960×2688 (ten 96 px cells across, 28 rows), so four of them take
 * about 66% of one 4096 page and the Chao sheets spill onto the second page; eight big
 * species would not fit, which is why only four opt in.
 */
import { describe, expect, it } from 'vitest';
import { FRAME_SPIKES } from '../../src/config/tuning-tech';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { CLIPS } from '../../src/render/sprites/animations';
import { atlasSize, type SpriteSheet } from '../../src/render/sprites/atlas';
import { HELD_POSES, poseFor } from '../../src/render/sprites/chao';
import { CREATURE_GRID_BIG, CREATURE_SIZE, drawCreature } from '../../src/render/sprites/creature';
import { MegaAtlas, type AtlasSurface } from '../../src/render/sprites/mega-atlas';
import { PX } from '../../src/render/sprites/pixel-canvas';
import { SPECIES_ART } from '../../src/render/sprites/species-art';

/** Charizard, Gyarados, Greymon, Kabuterimon. */
const BIG = ['cinderwing', 'stormwyrm', 'hornsaur', 'thunderbug'] as const;

describe('big-grid final forms (R0409)', () => {
  it('exactly these four species use the 48 grid', () => {
    const on = Object.keys(SPECIES_ART)
      .filter((id) => SPECIES_ART[id]!.grid === 48)
      .sort();
    expect(on).toEqual([...BIG].sort());
  });

  it('each draws inside its 96 px cell, top, left and right edges empty', () => {
    for (const id of BIG) {
      const spec = SPECIES_ART[id]!;
      for (const a of DRAWN_ANGLES)
        for (const clip of ['idle', 'walk'] as const)
          for (let f = 0; f < 2; f++) {
            const pc = drawCreature(a, poseFor(clip, f), spec);
            expect(pc.width).toBe(CREATURE_GRID_BIG * PX);
            const { width: w, height: h } = pc;
            expect(h).toBe(w);
            let lit = 0;
            for (let y = 0; y < h; y++)
              for (let x = 0; x < w; x++) {
                if (!pc.data[y * w + x]) continue;
                lit++;
                // The feet stand on row 46 of 48, so the bottom rows are theirs; the rest must be clear.
                const edge = x < PX || y < PX || x >= w - PX;
                expect(edge, `${id} ${a} ${clip}${f} lit edge pixel at ${x},${y}`).toBe(false);
              }
            expect(lit, `${id} ${a} draws`).toBeGreaterThan(200);
          }
    }
  });

  it('the new parts change the picture (a species without them differs)', () => {
    for (const id of ['cinderwing', 'stormwyrm', 'hornsaur']) {
      const spec = SPECIES_ART[id]!;
      const { big: _big, ...rest } = spec;
      void _big;
      const a = drawCreature('frontQuarter', poseFor('idle', 0), spec);
      const b = drawCreature('frontQuarter', poseFor('idle', 0), rest);
      expect(Array.from(a.data), id).not.toEqual(Array.from(b.data));
    }
  });

  it('four big sheets plus eight Chao sheets fit the atlas page budget', () => {
    const frames =
      DRAWN_ANGLES.length *
      (Object.values(CLIPS).reduce((n, c) => n + c.frames, 0) + 3 + HELD_POSES.length);
    const fake = (cell: number): SpriteSheet => {
      const { width, height } = atlasSize(frames, cell, cell, 10);
      return {
        texture: { image: { width, height } } as unknown as SpriteSheet['texture'],
        width,
        height,
        frames: new Map(),
        cellW: cell,
        cellH: cell,
        dispose: () => undefined,
      };
    };
    const surface = (size: number): AtlasSurface => ({
      canvas: { width: size, height: size } as HTMLCanvasElement,
      ctx: {
        drawImage: () => undefined,
        clearRect: () => undefined,
      } as unknown as AtlasSurface['ctx'],
    });
    const big = BIG.map(() => fake(CREATURE_GRID_BIG * PX));
    const atlas = new MegaAtlas(4096, surface, FRAME_SPIKES.atlasPages);
    atlas.beginFrame();
    const sheets = [...big, ...Array.from({ length: 8 }, () => fake(CREATURE_SIZE * PX))];
    for (const s of sheets) expect(atlas.place(s)).not.toBeNull();
    expect(atlas.pagesOpen).toBeLessThanOrEqual(FRAME_SPIKES.atlasPages);
  });
});
