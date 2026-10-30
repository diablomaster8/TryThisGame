import { describe, expect, it } from 'vitest';
import { EDU_TRACE } from '../../src/config/tuning-kids';
import { LANG } from '../../src/config/tuning';
import { afterMiss, strokeMet, traceRadius } from '../../src/ui/trace-check';

const stroke = [
  { x: 20, y: 50 },
  { x: 80, y: 50 },
];
/** The same stroke drawn `off` units below the line. */
const drag = (off: number) => [
  { x: 20, y: 50 + off },
  { x: 50, y: 50 + off },
  { x: 80, y: 50 + off },
];

describe('R0703 (KIDS-35) forgiving tracing', () => {
  it('a three-year-old’s stroke 18 units off the path counts; a reader’s does not', () => {
    const young = traceRadius({ age: 3, band: 'sprout' }, EDU_TRACE.radius, LANG.traceRadius);
    const reader = traceRadius({ age: 6, band: 'reader' }, EDU_TRACE.radius, LANG.traceRadius);
    expect(strokeMet(stroke, drag(18), young, LANG.strokeCover)).toBe(true);
    expect(strokeMet(stroke, drag(18), reader, LANG.strokeCover)).toBe(false);
    expect(traceRadius(null, EDU_TRACE.radius, LANG.traceRadius)).toBe(LANG.traceRadius);
    expect(traceRadius({ age: 5, band: 'sprout' }, EDU_TRACE.radius, 14)).toBe(16);
  });

  it('shows the ghost finger after two misses and finishes the stroke after four', () => {
    const steps = [1, 2, 3, 4].map((m) =>
      afterMiss(m, EDU_TRACE.demoAfterMisses, EDU_TRACE.completeAfterMisses),
    );
    expect(steps).toEqual(['again', 'demo', 'demo', 'complete']);
  });
});
