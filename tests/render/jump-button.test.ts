import { describe, expect, it } from 'vitest';
import { JUMP_BUTTON } from '../../src/config/tuning-move';
import { jumpButtonState } from '../../src/ui/jump-states';
import { createWorld } from '../../src/sim/world';

// MOVE-51: the jump button's four states.

describe('the jump button states (MOVE-51)', () => {
  it('on the ground: an empty ring, the air-jump pip ready, no feather', () => {
    const w = createWorld(1, 0);
    expect(jumpButtonState(w, null)).toEqual({
      hold: 0,
      pip: 'ready',
      feather: 'none',
      shake: false,
    });
  });

  it('held: the ring fills over the rise, then stays full', () => {
    const w = createWorld(1, 0);
    expect(jumpButtonState(w, JUMP_BUTTON.ringMs / 2).hold).toBeCloseTo(0.5, 5);
    expect(jumpButtonState(w, JUMP_BUTTON.ringMs * 3).hold).toBe(1);
  });

  it('in the air with the air jump spent: the pip empties', () => {
    const w = createWorld(1, 0);
    w.keeper.grounded = false;
    w.keeper.airJumps = 1;
    expect(jumpButtonState(w, null).pip).toBe('ready');
    w.keeper.airJumps = 0;
    expect(jumpButtonState(w, null).pip).toBe('spent');
  });

  it('carrying: the Shake button, greyed, with no ring, pip or feather', () => {
    const w = createWorld(1, 0);
    w.keeper.carrying = 'someone';
    expect(jumpButtonState(w, 100)).toEqual({ hold: 0, pip: 'none', feather: 'none', shake: true });
  });
});
