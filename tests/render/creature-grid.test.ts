/**
 * LOOK-43 (R0409): the big 48 px design grid. A spec that names grid 32 draws exactly what a
 * spec with no grid draws; a grid-48 spec draws a 96 px frame with its feet on row 46 and its
 * body half again as big; only big final forms may use it; and eight big species' sheets
 * plus eight Chao sheets pack within the mega-atlas page budget. The sprite batch samples
 * both pages in one shader (map and map2), so staying within the budget keeps one draw call.
 * Measured: a big sheet is 960×2016 (205 frames at 96 px, ten across), so eight of them fill
 * about 90% of one 4096 page by themselves and everything else moves to the second page.
 */
import { describe, expect, it } from 'vitest';
import { CLIPS } from '../../src/render/sprites/animations';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import { atlasSize, type SpriteSheet } from '../../src/render/sprites/atlas';
import { HELD_POSES, poseFor } from '../../src/render/sprites/chao';
import {
  CREATURE_GRID_BIG,
  CREATURE_GRID_MIN_SIZE,
  CREATURE_SIZE,
  drawCreature,
  gridOf,
  tallFramePx,
  type CreatureSpec,
} from '../../src/render/sprites/creature';
import { MegaAtlas, type AtlasSurface } from '../../src/render/sprites/mega-atlas';
import { FRAME_SPIKES } from '../../src/config/tuning-tech';
import { PX, type PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { SPECIES_ART } from '../../src/render/sprites/species-art';

/** One example species per body plan, picked from the live roster. */
function onePerPlan(): Map<string, CreatureSpec> {
  const out = new Map<string, CreatureSpec>();
  for (const id of Object.keys(SPECIES_ART).sort()) {
    const s = SPECIES_ART[id]!;
    if (!out.has(s.plan)) out.set(s.plan, s);
  }
  return out;
}

/** Design-pixel bounds of the lit pixels. */
function box(pc: PixelCanvas): { x0: number; y0: number; x1: number; y1: number } {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (let y = 0; y < pc.height; y++)
    for (let x = 0; x < pc.width; x++)
      if (pc.data[y * pc.width + x]) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
      }
  return { x0: x0 / PX, y0: y0 / PX, x1: (x1 + 1) / PX, y1: (y1 + 1) / PX };
}

describe('creature design grid (LOOK-43)', () => {
  const plans = onePerPlan();

  it('an explicit grid 32 is pixel-identical to no grid, every plan and angle', () => {
    for (const [plan, spec] of plans)
      for (const a of DRAWN_ANGLES) {
        const one = drawCreature(a, poseFor('walk', 1), spec);
        const two = drawCreature(a, poseFor('walk', 1), { ...spec, grid: 32 });
        expect(Array.from(two.data), `${plan} ${a}`).toEqual(Array.from(one.data));
      }
  });

  it('grid 48 draws 96 px frames, feet on row 46, about 1.5× the body', () => {
    for (const [plan, spec] of plans) {
      const big = { ...spec, size: Math.max(spec.size, 1.2), grid: 48 as const };
      const small = { ...big, grid: 32 as const };
      for (const a of DRAWN_ANGLES) {
        const pb = drawCreature(a, poseFor('idle', 0), big);
        expect(pb.width, plan).toBe(CREATURE_GRID_BIG * PX);
        expect(pb.height, plan).toBe(CREATURE_GRID_BIG * PX);
        const bb = box(pb);
        const bs = box(drawCreature(a, poseFor('idle', 0), small));
        expect(Number.isFinite(bb.y1), `${plan} ${a} draws`).toBe(true);
        // Feet sit on the same row from the bottom on either grid (ghosts float alike).
        expect(CREATURE_GRID_BIG - bb.y1, `${plan} ${a} feet`).toBeCloseTo(
          CREATURE_SIZE - bs.y1,
          -0.5,
        );
        // The figure grows, but less than the full 1.5× where fixed-size parts dominate.
        const ratio = (bb.y1 - bb.y0) / (bs.y1 - bs.y0);
        expect(ratio, `${plan} ${a} height ratio`).toBeGreaterThan(1.15);
        expect(ratio, `${plan} ${a} height ratio`).toBeLessThan(1.65);
      }
    }
  });

  it('only big final forms use the big grid; babies stay at 32', () => {
    for (const [id, spec] of Object.entries(SPECIES_ART)) {
      if (gridOf(spec) === CREATURE_SIZE) continue;
      expect(spec.size, id).toBeGreaterThanOrEqual(CREATURE_GRID_MIN_SIZE);
    }
  });

  it('the emote lift is zero for 64 px cells and the extra height for 96 px ones', () => {
    expect(tallFramePx(CREATURE_SIZE * PX)).toBe(0);
    expect(tallFramePx(CREATURE_GRID_BIG * PX)).toBe((CREATURE_GRID_BIG - CREATURE_SIZE) * PX);
  });

  it('eight big species plus eight Chao sheets fit the two-page atlas budget', () => {
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
    const big = Array.from({ length: 8 }, () => fake(CREATURE_GRID_BIG * PX));
    expect(big[0]!.width).toBe(960);
    expect(big[0]!.height).toBe(2016);
    // Eight big sheets alone: one page.
    const alone = new MegaAtlas(4096, surface, FRAME_SPIKES.atlasPages);
    alone.beginFrame();
    for (const s of big) expect(alone.place(s)).not.toBeNull();
    expect(alone.pagesOpen).toBe(1);
    // With eight Chao sheets beside them: within the page budget, so still one draw call.
    const atlas = new MegaAtlas(4096, surface, FRAME_SPIKES.atlasPages);
    atlas.beginFrame();
    const sheets = [...big, ...Array.from({ length: 8 }, () => fake(CREATURE_SIZE * PX))];
    for (const s of sheets) expect(atlas.place(s)).not.toBeNull();
    expect(atlas.pagesOpen).toBeLessThanOrEqual(FRAME_SPIKES.atlasPages);
  });
});
