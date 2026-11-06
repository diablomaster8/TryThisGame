import { describe, expect, it } from 'vitest';
import {
  LATIN_CAPITALS,
  LATIN_DIGITS,
  LATIN_LOWER,
  LATIN_STROKES,
} from '../../src/ui/latin-strokes';
import { nameGlyphs, tracedItem, tracingTarget } from '../../src/ui/edu-tracing';
import { resample, strokeMet } from '../../src/ui/trace-check';
import { EDU_GAMES, EDU_RECOMMENDED } from '../../src/config/edu';
import { LANG } from '../../src/config/tuning';
import { Rng } from '../../src/sim/rng';
import { createWorld } from '../../src/sim/world';
import { applyCommand } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

/** R0702: English letter and number tracing. */
describe('English tracing (R0702)', () => {
  it('has 62 glyphs, each with 1 to 4 strokes inside the board', () => {
    const all = [...LATIN_CAPITALS, ...LATIN_LOWER, ...LATIN_DIGITS];
    expect(all).toHaveLength(62);
    for (const g of all) {
      const strokes = LATIN_STROKES[g];
      expect(strokes, g).toBeDefined();
      expect(strokes!.length, g).toBeGreaterThanOrEqual(1);
      expect(strokes!.length, g).toBeLessThanOrEqual(4);
      for (const p of strokes!.flat()) {
        expect(p.x, g).toBeGreaterThanOrEqual(0);
        expect(p.x, g).toBeLessThanOrEqual(100);
        expect(p.y, g).toBeGreaterThanOrEqual(0);
        expect(p.y, g).toBeLessThanOrEqual(100);
      }
    }
  });

  it('tracing A along its guides completes every stroke; a scribble does not', () => {
    const r = 12;
    for (const s of LATIN_STROKES.A!) {
      const drag = resample(s, 2).map((p) => ({ x: p.x + 2, y: p.y - 1 }));
      expect(strokeMet(s, drag, r, LANG.strokeCover)).toBe(true);
    }
    const scribble = [
      { x: 10, y: 90 },
      { x: 90, y: 92 },
      { x: 12, y: 94 },
      { x: 88, y: 96 },
    ];
    for (const s of LATIN_STROKES.A!)
      expect(strokeMet(s, scribble, r, LANG.strokeCover)).toBe(false);
  });

  it('every glyph can be traced along its own guides', () => {
    for (const [g, strokes] of Object.entries(LATIN_STROKES))
      for (const s of strokes)
        expect(strokeMet(s, resample(s, 2), 10, LANG.strokeCover), g).toBe(true);
  });

  it('a sitting is two letters and a number, then the name letter by letter', () => {
    const t = tracingTarget(4, 'maya', Rng.fromSeed(5));
    expect(t.lang).toBe('en');
    expect(t.glyphs.slice(-4)).toEqual(['M', 'a', 'y', 'a']);
    expect(t.glyphs.length).toBeGreaterThanOrEqual(7);
    // Age 4 gets capitals only.
    for (let seed = 0; seed < 30; seed++)
      for (const g of tracingTarget(4, '', Rng.fromSeed(seed)).glyphs.slice(0, 2))
        expect(LATIN_CAPITALS).toContain(g);
    expect(nameGlyphs('Zoë-1')).toEqual(['Z', 'o', '1']);
    expect(tracedItem('b')).toBe('letter:B');
    expect(tracedItem('7')).toBe('count:7');
  });

  it('is offered from age 4 and feeds items and progress, even on an older save', () => {
    expect(EDU_GAMES).toContain('tracing');
    expect(EDU_RECOMMENDED[3]).not.toContain('tracing');
    for (const a of [4, 5, 6] as const) expect(EDU_RECOMMENDED[a]).toContain('tracing');
    const world = createWorld(1, 0);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'eduStart', age: 4 }, events);
    delete (world.edu!.progress as Record<string, unknown>).tracing;
    applyCommand(world, { kind: 'eduResult', game: 'tracing', stars: 3, item: 'letter:A' }, events);
    expect(world.edu!.progress.tracing.plays).toBe(1);
    expect(world.edu!.items?.['letter:A']?.seen).toBe(1);
    expect(world.edu!.skills?.tracing).toBeUndefined();
  });
});
