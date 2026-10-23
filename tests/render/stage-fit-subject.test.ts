import { describe, expect, it } from 'vitest';
import { MARK_FIT } from '../../src/config/tuning-f2';
import { fitTiers, type FitPoint } from '../../src/render/stage-fit';

/**
 * cg5: a line that names a big prop (the pond) makes it the line's subject, but the frame
 * never narrows to the prop alone: the nearest person stays with the prop's rim.
 */
describe('fit tiers with a prop as the subject', () => {
  const pond = MARK_FIT['pond-centre']!;
  const keeper: FitPoint = { x: 0, z: 0, w: 1 };
  const subject: FitPoint = { x: 10, z: 0, w: 1, fit: pond, speaker: true };

  it('keeps a person in every tier', () => {
    const tiers = fitTiers([keeper, subject]);
    for (const t of tiers) expect(t.some((p) => !p.fit)).toBe(true);
  });

  it('ends on the person and the prop’s middle', () => {
    const last = fitTiers([keeper, subject]).at(-1)!;
    const mid = last.find((p) => p.fit)!;
    expect(last).toContain(keeper);
    expect(mid.fit!.r).toBeLessThan(pond.r * 0.5);
    expect(mid.x).toBe(subject.x);
  });

  it('still narrows to a speaking person alone', () => {
    const far: FitPoint = { x: 30, z: 0, w: 1, speaker: true };
    expect(fitTiers([keeper, { x: 5, z: 5, w: 0.3 }, far]).at(-1)).toEqual([far]);
  });
});
