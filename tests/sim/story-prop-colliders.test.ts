/**
 * Story props collide (R0016, MOVE-16): a standing shed, bench, chair, shelf, barn or flat
 * stone holds the Keeper out (or up, for the ones that can be stood on); a prop that is not
 * standing never blocks.
 */
import { describe, expect, it } from 'vitest';
import { STORY_PROP_COLLIDERS } from '../../src/config/grove-layout';
import { SIM, STORY_PROPS } from '../../src/config/tuning';
import { blocked, contact, obstacles } from '../../src/sim/obstacles';
import { visibleStoryProps } from '../../src/sim/story-props';
import { stepWorld } from '../../src/sim/world';
import { campaignWorld } from './campaign-driver';

describe('story prop colliders (MOVE-16)', () => {
  it('gives every drawn kind but the small hand-held ones a collider', () => {
    STORY_PROPS.forEach((p, i) => {
      const has = STORY_PROP_COLLIDERS[i] !== null;
      const none = ['trowel', 'register', 'handLantern', 'gardenDoor'].includes(p.kind);
      expect(has, p.id).toBe(!none);
    });
  });

  it('collides only while the prop stands', () => {
    const { world } = campaignWorld();
    const ids = new Set(visibleStoryProps(world).map((p) => p.id));
    const live = new Set(obstacles(world).map((c) => c.id));
    STORY_PROPS.forEach((p, i) => {
      const c = STORY_PROP_COLLIDERS[i];
      if (!c) return;
      expect(live.has(c.id), p.id).toBe(ids.has(p.id));
    });
    // Corvin's chair is not out at the start: its spot is open ground.
    const chair = STORY_PROPS.find((p) => p.id === 'corvins-chair')!;
    expect(ids.has('corvins-chair')).toBe(false);
    expect(blocked({ x: chair.x, z: chair.z }, world, 0.3)).toBe(false);
    world.location = 'hollow';
    expect(obstacles(world).some((c) => c.id.startsWith('story-'))).toBe(false);
  });

  it('never lets a walking Keeper inside a standing prop', () => {
    const { world } = campaignWorld();
    world.nubbins = [];
    const standing = obstacles(world).filter(
      (c) => c.id.startsWith('story-') && c.flags.includes('solid'),
    );
    expect(standing.map((c) => c.id)).toContain('story-lantern-shed');
    let inside = 0;
    for (const c of standing)
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        world.keeper.pos = { x: c.x + Math.cos(a) * 3.5, z: c.z + Math.sin(a) * 3.5 };
        world.keeper.moveTarget = null;
        world.keeper.intent = null;
        world.keeper.input = { x: -Math.cos(a), z: -Math.sin(a) };
        for (let s = 0; s < 25; s++) {
          stepWorld(world, SIM.stepMs);
          if (contact(c, world.keeper.pos.x, world.keeper.pos.z, 0.05)) inside++;
        }
        world.keeper.input = { x: 0, z: 0 };
      }
    expect(inside).toBe(0);
  });
});
