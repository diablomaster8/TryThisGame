/** R0661 (CAMP-69): "Go there" finds every tracked goal's place, the spine's included. */
import { describe, expect, it } from 'vitest';
import { LANTERN_POSTS } from '../../src/config/tuning';
import { poiPos } from '../../src/sim/beacon';
import { goalTarget } from '../../src/sim/goal-target';
import { questAreaKey } from '../../src/sim/quest-offers';
import { GROVE_SIDE_STORIES } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, playScenes } from './campaign-driver';

function hazelAt(n: number): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
  playScenes(world, events);
  c(world).step = 1;
  return { world, events };
}

describe('Go there (R0661)', () => {
  it('chapter 6: Talk to Dusty points at Dusty, wherever Dusty stands', () => {
    const { world } = hazelAt(6);
    const dusty = world.npcs.find((n) => n.trainer === 'dusty' && !n.guest)!;
    expect(dusty).toBeDefined();
    expect(goalTarget(world, 'story:hazel:6')).toEqual({ x: dusty.pos.x, z: dusty.pos.z });
    dusty.pos = { x: 3, z: -7 };
    expect(goalTarget(world, 'story:hazel:6')).toEqual({ x: 3, z: -7 });
    // Walking there and talking meets the goal.
    world.keeper.pos = { ...goalTarget(world, 'story:hazel:6')! };
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'talk', npcId: dusty.id }, events);
    expect(c(world).flags['talked:6:dusty']).toBe(true);
  });

  it('the lanterns: the nearest unlit post, then the next', () => {
    const { world, events } = hazelAt(4);
    world.keeper.pos = { x: LANTERN_POSTS[0].x, z: LANTERN_POSTS[0].z };
    expect(goalTarget(world, 'story:hazel:4')).toEqual({ x: -4, z: 4 });
    applyCommand(world, { kind: 'lightLantern', id: 'lantern-1' }, events);
    const next = goalTarget(world, 'story:hazel:4');
    expect(next).not.toEqual({ x: -4, z: 4 });
    expect(LANTERN_POSTS.some((p) => p.x === next?.x && p.z === next?.z)).toBe(true);
  });

  it('a stale key, another region or a goal with no place points nowhere', () => {
    const { world } = hazelAt(6);
    expect(goalTarget(world, 'story:hazel:5')).toBeNull();
    expect(goalTarget(world, null)).toBeNull();
    world.location = 'dungeon';
    expect(goalTarget(world, 'story:hazel:6')).toBeNull();
    const ch9 = hazelAt(9).world;
    expect(goalTarget(ch9, 'story:hazel:9')).toBeNull();
  });

  it('a tracked quest points at its Grove area', () => {
    const { world } = hazelAt(3);
    const quest = GROVE_SIDE_STORIES.find((q) => {
      const key = questAreaKey(q);
      return key?.startsWith('grove/') && !key.endsWith('/*');
    })!;
    const poi = questAreaKey(quest)!.split('/')[1]!;
    expect(goalTarget(world, `quest:${quest.id}:0`)).toEqual(poiPos(poi));
  });

  it('every spine goal with a place resolves in its chapter', () => {
    for (const [n, goal] of [
      [2, 'feedTwice'],
      [3, 'sableTrust20'],
      [11, 'threeFriends'],
    ] as const) {
      const { world } = hazelAt(n);
      expect(goalTarget(world, `story:hazel:${n}`), `${n} ${goal}`).not.toBeNull();
    }
  });
});
