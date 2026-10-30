import { describe, expect, it } from 'vitest';
import { OUTER_TEXT } from '../../src/config/strings';
import { WORLD_GAGS } from '../../src/content/world-gags';
import { createWorld } from '../../src/sim/world';
import { outerLine } from '../../src/ui/outer-gag';

/** R0129: outer-ring gags answer taps in turn after a piece's own line. */
describe('outer-ring gags (R0129)', () => {
  it('a piece with its own line says it first, then its gag lines, then round again', () => {
    const world = createWorld(1, 0);
    const gag = WORLD_GAGS.find((g) => g.piece === 'wm-crow')!;
    const said = [0, 1, 2, 3].map(() => outerLine('outer:wm-crow', world));
    expect(said).toEqual([
      OUTER_TEXT.tap.scarecrow,
      gag.lines[0]!.text,
      gag.lines[1]!.text,
      OUTER_TEXT.tap.scarecrow,
    ]);
  });

  it('a gag piece starts with its gag, and a Learning Grove reads the child line', () => {
    const world = createWorld(1, 0);
    const gag = WORLD_GAGS.find((g) => g.piece === 'fo-sign')!;
    expect(outerLine('outer:fo-sign', world)).toBe(gag.lines[0]!.text);
    world.edu = { band: 'sprout' } as typeof world.edu;
    expect(outerLine('outer:fo-sign', world)).toBe(gag.childLines['gag-every-way#1']);
  });

  it('the Grove has at least three gags, each on a tappable piece', () => {
    expect(WORLD_GAGS.filter((g) => g.region === 'grove').length).toBeGreaterThanOrEqual(3);
    for (const g of WORLD_GAGS)
      expect(outerLine(`outer:${g.piece}`, createWorld(1, 0))).toBeTruthy();
  });
});
