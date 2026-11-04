import { describe, expect, it } from 'vitest';
import { PetBeats, transitionKind } from '../../src/render/pet-reactions';
import { createWorld } from '../../src/sim/world';

// R0577 (SOUL-60), lane A r11: short moves between states, render-only.
function child() {
  const n = createWorld(1, 0).nubbins[0]!;
  n.stage = 'child';
  return n;
}

describe('R0577 state transitions', () => {
  it('waking from a nap rubs its eyes, then stretches, in both renderers', () => {
    const beats = new PetBeats();
    const n = child();
    n.behavior.state = 'nap';
    beats.frame(n, 0);
    n.behavior.state = 'wander';
    n.behavior.itemId = null;
    const rub = beats.frame(n, 1100);
    expect(rub?.kind).toBe('wakeStretch');
    expect(rub?.clip).toBe('sit');
    expect(rub?.pose3d).toBe('sit');
    const stretch = beats.frame(n, 1500);
    expect(stretch?.clip).toBe('happy');
    expect(stretch?.pose3d).toBe('happy');
    expect(stretch!.sh).toBeGreaterThan(1);
    expect(beats.frame(n, 1800)?.kind).not.toBe('wakeStretch');
  });

  it('keys by previous and next state', () => {
    expect(transitionKind('sit', 'wander')).toBe('standUp');
    expect(transitionKind('findFood', 'eat')).toBe('crouch');
    expect(transitionKind('react', 'sit')).toBe('shakeOff');
    expect(transitionKind('wander', 'sit')).toBeNull();
  });

  it('reduced motion skips them', () => {
    const beats = new PetBeats();
    beats.calm = true;
    const n = child();
    n.behavior.state = 'nap';
    beats.frame(n, 0);
    n.behavior.state = 'wander';
    expect(beats.frame(n, 1100)?.kind ?? null).not.toBe('wakeStretch');
  });
});
