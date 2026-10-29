import { describe, expect, it } from 'vitest';
import { STORY_PROPS } from '../../src/config/tuning';
import { STORY_PROP_REACH } from '../../src/config/tuning-move';
import { stepPropReach } from '../../src/sim/prop-reach';
import { sideStory } from '../../src/sim/story-scenes';
import { applyCommand } from '../../src/sim/world';
import { keeperFooting } from '../../src/sim/keeper';
import type { World } from '../../src/sim/types';
import { c } from './campaign-driver';
import { runUntil } from './side-driver';

// MOVE-56: walking up to the flat stone meets S24's hill step, as a tap does.

const atHill = (w: World): boolean => {
  const s = c(w).side.s24;
  if (!s || s.stage !== 'check') return false;
  return sideStory('s24')!.steps[s.step]?.check.includes('s24-hill') ?? false;
};

const stone = STORY_PROPS.find((p) => p.id === 'flat-stone')!;

function standAt(w: World, x: number, z: number): void {
  w.keeper.pos = { x, z };
  w.keeper.y = keeperFooting(w, x, z).y;
  w.keeper.grounded = true;
}

describe('story props met by walking up (MOVE-56)', () => {
  const r = runUntil(atHill, ['s24']);

  it('the run reaches S24 waiting at the hill', () => {
    expect(atHill(r.world)).toBe(true);
  });

  it('standing 3 u off does nothing; within reach meets the step', () => {
    const w = structuredClone(r.world);
    standAt(w, stone.x + 3, stone.z);
    stepPropReach(w);
    expect(c(w).side.s24!.acted).toBe(false);
    standAt(w, stone.x + STORY_PROP_REACH['flat-stone']! - 0.2, stone.z);
    stepPropReach(w);
    expect(c(w).side.s24!.acted).toBe(true);
  });

  it('the tap still meets it', () => {
    const w = structuredClone(r.world);
    standAt(w, stone.x + 6, stone.z);
    applyCommand(w, { kind: 'storyProp', prop: 'flat-stone' }, []);
    expect(c(w).side.s24!.acted).toBe(true);
  });
});
