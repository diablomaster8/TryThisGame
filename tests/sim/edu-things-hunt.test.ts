import { describe, expect, it } from 'vitest';
import { EDU_COLOURS } from '../../src/config/edu';
import { GROVE_SHAPES } from '../../src/config/edu-grove-shapes';
import { EDU_COLOUR_PATTERN, EDU_COLOUR_THINGS } from '../../src/config/edu-things';
import { colourRound, shapeHuntRound } from '../../src/minigames/edu/games';
import { Rng } from '../../src/sim/rng';

describe('R0732 colour things', () => {
  it('at least half the colour rounds use things; every colour has a distinct pattern', () => {
    const rng = new Rng(7);
    let things = 0;
    for (let i = 0; i < 200; i++)
      if (colourRound(5, rng).options.some((o) => o.kind === 'thing')) things++;
    expect(things / 200).toBeGreaterThan(0.5);
    const colours = EDU_COLOURS[6];
    expect(new Set(colours.map((c) => EDU_COLOUR_PATTERN[c])).size).toBe(colours.length);
    for (const c of colours) expect(EDU_COLOUR_THINGS[c]!.length).toBeGreaterThanOrEqual(3);
  });
});

describe('R0733 shape hunt', () => {
  it('a hunt round has props of different shapes and the answer is the asked shape', () => {
    const rng = new Rng(3);
    for (let i = 0; i < 50; i++) {
      const r = shapeHuntRound(rng);
      const o = r.options[r.answer]!;
      expect(o.kind === 'prop' && r.prompt.includes(o.shape)).toBe(true);
      const shapes = r.options.map((x) => (x.kind === 'prop' ? x.shape : ''));
      expect(new Set(shapes).size).toBe(shapes.length);
      for (const x of r.options)
        expect(
          x.kind === 'prop' && GROVE_SHAPES.some((p) => p.id === x.prop && p.shape === x.shape),
        ).toBe(true);
    }
  });
  it('the pond is a circle', () => {
    expect(GROVE_SHAPES.find((p) => p.id === 'pond')?.shape).toBe('circle');
  });
});
