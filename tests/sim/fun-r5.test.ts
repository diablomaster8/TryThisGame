import { describe, expect, it } from 'vitest';
import { applyCommand } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';
import { c, campaignWorld } from './campaign-driver';

// Round 5 lane A (FUN): the sim halves of R0304 and the items after it.

describe('R0304 line acts', () => {
  it('turning the cup in c1-letter sets the chapter 12 callback flag', () => {
    const { world } = campaignWorld('fern');
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'lineAct', scene: 'c1-letter', act: 'cup' }, ev);
    expect(c(world).flags['c1-cup-turned']).toBe(true);
  });

  it('the turned cup comes back in c12-close', async () => {
    const { sceneFor } = await import('../../src/sim/story-scenes');
    const { world } = campaignWorld('fern');
    const before = sceneFor(world, 'c12-close')!.lines.length;
    c(world).flags['c1-cup-turned'] = true;
    const after = sceneFor(world, 'c12-close')!.lines;
    expect(after.length).toBe(before + 1);
    expect(after[4]!.text).toContain('right way up');
  });

  it('an act a scene does not have sets nothing', () => {
    const { world } = campaignWorld('fern');
    applyCommand(world, { kind: 'lineAct', scene: 'c2-feed', act: 'cup' }, []);
    expect(c(world).flags['c1-cup-turned']).toBeUndefined();
  });
});
