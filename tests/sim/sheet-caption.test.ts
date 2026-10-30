import { describe, expect, it } from 'vitest';
import { createWorld } from '../../src/sim/world';
import { fittingCaptions, sheetCaption } from '../../src/ui/sheet-caption';
import { SHEET_CAPTIONS } from '../../src/config/strings-fun-r7';

// R0360 (FUN-71): a dry caption on the sheet in the main band, none in the sprout band.
describe('R0360 sheet captions', () => {
  it('has 30 or more templates, every one under 100 characters', () => {
    const all = Object.values(SHEET_CAPTIONS);
    expect(all.length).toBeGreaterThanOrEqual(30);
    for (const t of all) expect(t.length).toBeLessThan(100);
  });

  it('shows one in the main band and none in sprout', () => {
    const w = createWorld(4, 0);
    const n = w.nubbins[0]!;
    n.stage = 'child';
    expect(sheetCaption(w, n)).toBeTruthy();
    w.edu = { ...(w.edu ?? {}), band: 'sprout' } as typeof w.edu;
    expect(sheetCaption(w, n)).toBeNull();
  });

  it('reads the counts: never thrown, then thrown', () => {
    const w = createWorld(4, 0);
    const n = w.nubbins[0]!;
    n.stage = 'child';
    expect(fittingCaptions(n)).toContain('Thrown: never. Keep it that way.');
    n.childCare.throws = 2;
    expect(fittingCaptions(n).some((t) => t.startsWith('Thrown 2 times'))).toBe(true);
  });
});
