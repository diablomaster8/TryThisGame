import { describe, expect, it } from 'vitest';
import { gateFrame, TITLE_GATE } from '../../src/ui/title-gate';

/** FUN-67 (lane E r9): the title gate's loop, one try alone, then together. */
describe('title gate', () => {
  it('stays shut for one Nubbin, opens for two, and loops', () => {
    expect(gateFrame(2500).open).toBe(0);
    expect(gateFrame(2500).b).toBeNull();
    expect(gateFrame(3800).a.sit).toBe(true);
    expect(gateFrame(4800).b).not.toBeNull();
    expect(gateFrame(5700).open).toBeGreaterThan(0);
    const still = gateFrame(TITLE_GATE.stillMs);
    expect(still.open).toBe(1);
    expect(still.b).not.toBeNull();
    expect(gateFrame(TITLE_GATE.loopMs + 2500)).toEqual(gateFrame(2500));
    expect(gateFrame(0).open).toBe(0);
  });
});
