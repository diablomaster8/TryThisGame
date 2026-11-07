/**
 * R0732 / R0733.
 *
 * R0733 investigation (why the hunt is a drawn still, not a snapshot of the live Grove): a
 * read-only still IS possible in both renderers (`Game.captureFrame` redraws and copies in the
 * same task, no sim change), and `toScreen` (guide.ts) can project world props. But the hunt
 * needs 3 or 4 props of different plain shapes in view at once, and the live camera follows the
 * Keeper and orbits, so the pond, roof, window and door are rarely all on screen; a real roof
 * is a 3D or billboard pitch, not a guaranteed triangle from every angle; and the props cannot
 * be recoloured in the real view, so the shape-not-colour cue would be lost. The drawn still
 * (src/ui/edu-scene.ts) is therefore kept, drawn from the shared palette with the pond, roof,
 * window and door as their plain shapes, each prop recoloured per round.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EDU_COLOUR_HEX, EDU_COLOURS } from '../../src/config/edu';
import { GROVE_SHAPES } from '../../src/config/edu-grove-shapes';
import { EDU_COLOUR_PATTERN, EDU_COLOUR_THINGS } from '../../src/config/edu-things';
import { colourRound, shapeHuntRound, shapeRound } from '../../src/minigames/edu/games';
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

describe('R0732 patterns and thing share', () => {
  const ids = Object.keys(EDU_COLOUR_HEX);
  it('every swatch has its own pattern id, with a real css rule (white and black included)', () => {
    const pats = ids.map((c) => EDU_COLOUR_PATTERN[c]);
    expect(pats.every((p) => typeof p === 'string' && p.length > 0)).toBe(true);
    expect(new Set(pats).size).toBe(ids.length);
    expect(pats).not.toContain('plain');
    expect(pats).not.toContain('solid');
    const css = readFileSync('src/style.css', 'utf8');
    for (const p of pats) expect(css).toContain(`.edu-pat-${p} {`);
    expect(css).toContain('.edu-nopat .edu-swatch');
  });
  it('at least half of 1000 seeded colour rounds use thing options, at every age', () => {
    const rng = new Rng(2024);
    let things = 0;
    for (let i = 0; i < 1000; i++) {
      const age = (3 + (i % 4)) as 3 | 4 | 5 | 6;
      const r = colourRound(age, rng);
      if (r.options.some((o) => o.kind === 'thing')) things++;
    }
    expect(things / 1000).toBeGreaterThanOrEqual(0.5);
  });
});

describe('R0733 hunt share, colours and the pond', () => {
  it('about half of the age 5 and 6 shape rounds are the hunt', () => {
    const rng = new Rng(11);
    for (const age of [5, 6] as const) {
      let hunts = 0;
      for (let i = 0; i < 1000; i++) if (shapeRound(age, rng).scene === 'grove') hunts++;
      expect(hunts / 1000).toBeGreaterThan(0.42);
      expect(hunts / 1000).toBeLessThan(0.58);
    }
  });
  it('props in a round all have different colours, and a shape is not tied to a colour', () => {
    const rng = new Rng(5);
    const seen = new Map<string, Set<string>>();
    for (let i = 0; i < 200; i++) {
      const r = shapeHuntRound(rng);
      const cols = r.options.map((o) => (o.kind === 'prop' ? o.colour : undefined));
      expect(cols.every((c) => c && EDU_COLOUR_HEX[c])).toBe(true);
      expect(new Set(cols).size).toBe(cols.length);
      for (const o of r.options)
        if (o.kind === 'prop') {
          if (!seen.has(o.shape)) seen.set(o.shape, new Set());
          seen.get(o.shape)!.add(o.colour!);
        }
    }
    for (const set of seen.values()) expect(set.size).toBeGreaterThan(3);
  });
  it('a tap on the pond hotspot answers circle', () => {
    const rng = new Rng(9);
    let asked = 0;
    for (let i = 0; i < 400; i++) {
      const r = shapeHuntRound(rng);
      const pond = r.options.findIndex((o) => o.kind === 'prop' && o.prop === 'pond');
      if (pond < 0) continue;
      const o = r.options[pond]!;
      expect(o.kind === 'prop' && o.shape).toBe('circle');
      // The pond is the right tap exactly when the round asks for a circle.
      expect(pond === r.answer).toBe(r.prompt.includes('circle'));
      if (pond === r.answer) asked++;
    }
    expect(asked).toBeGreaterThan(10);
  });
});
