/**
 * Lane C r10 agent A: the questline regions beside Hazel's Grove (R0605 CAMP-13), opened one
 * at a time (R0640 CAMP-48), with per-region presentation (R0601 CAMP-08) and region waits in
 * the one scene queue (R0597 CAMP-04).
 */
import { describe, expect, it } from 'vitest';
import { STAGE_SET_HIDES } from '../../src/config/stage-sets';
import { STORY_REGIONS } from '../../src/config/story-regions';
import { SceneStager, stageFlags } from '../../src/render/scene-stage';
import { registerStorylines } from '../../src/sim/story-scenes';
import { storyRegionBlock, storyRegionHere } from '../../src/sim/story-regions';
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { regionChoices } from '../../src/ui/region-chip';
import { c, campaignWorld, playScenes, tick } from './campaign-driver';

registerStorylines(STORYLINE_CONTENT);

function hazelAt(n: number): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
  playScenes(world, events);
  return { world, events };
}

const go = (world: World, events: SimEvent[], region: string | null) =>
  applyCommand(world, { kind: 'storyRegion', region }, events);

describe('R0605: each line has its own region, reached from the Grove', () => {
  it('through the gate is the Fold, with its set and its chapter; back is the Grove', () => {
    const { world, events } = hazelAt(3);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    // The entrance offers the Fold only at the gate.
    world.keeper.pos = { x: 0, z: -10 };
    expect(regionChoices(world)).toEqual([]);
    world.keeper.pos = { ...STORY_REGIONS.fold.at };
    expect(regionChoices(world)).toEqual(['fold']);
    const stager = new SceneStager();
    stager.update(world, 0);
    expect(stager.regionHides()).toEqual([]);
    expect(stageFlags(world, null).campaign).toBe('hazel');

    go(world, events, 'fold');
    expect(storyRegionHere(world)).toBe('fold');
    expect(events.some((e) => e.kind === 'storyRegionEntered' && e.region === 'fold')).toBe(true);
    expect(stager.update(world, 1)).toBe(true);
    expect(stager.regionHides()).toEqual(STAGE_SET_HIDES.fold);
    const f = stageFlags(world, null);
    expect(f.campaign).toBe('hundred');
    expect(f.chapter).toBe(world.lines.hundred!.chapter);
    // Its chapter's opening plays here.
    let seen: string[] = [];
    for (let i = 0; i < 60 && !seen.includes('h-c1-open'); i++) {
      tick(world, events, 1.1);
      seen = seen.concat(playScenes(world, events));
    }
    expect(seen).toContain('h-c1-open');
    // At the gate again it offers the way back.
    expect(regionChoices(world)).toEqual([null]);

    go(world, events, null);
    expect(storyRegionHere(world)).toBeNull();
    expect(world.location).toBe('grove');
    stager.update(world, 2);
    expect(stager.regionHides()).toEqual([]);
    expect(stageFlags(world, null).campaign).toBe('hazel');
  });

  it('refuses a region not open yet, or with no line running', () => {
    const { world, events } = hazelAt(3);
    expect(storyRegionBlock(world, 'fold')).toBe('noLine');
    expect(storyRegionBlock(world, 'server')).toBe('locked');
    expect(storyRegionBlock(world, 'nowhere')).toBe('unknown');
    go(world, events, 'server');
    expect(world.storyRegion).toBeUndefined();
    expect(events.some((e) => e.kind === 'storyRegionRefused' && e.reason === 'locked')).toBe(true);
  });

  it('the region survives a save, and a line that ends sends the Keeper home', () => {
    const { world, events } = hazelAt(3);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    go(world, events, 'fold');
    expect(deserialize(serialize(world, 1)).world.storyRegion).toBe('fold');
    applyCommand(world, { kind: 'lineAbandon', line: 'hundred' }, events);
    tick(world, events, 0.2);
    expect(world.storyRegion).toBeUndefined();
  });
});

describe('R0640: the world opens one region at a time', () => {
  it('Fold at 3, server at 5, Sun and Moon at 6, Hollow at 8, each announced once', () => {
    const { world, events } = hazelAt(1);
    const order: Array<[string, number]> = [];
    for (let n = 2; n <= 8; n++) {
      const mark = events.length;
      applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
      playScenes(world, events);
      tick(world, events, 0.5);
      for (const e of events.slice(mark))
        if (e.kind === 'storyRegionOpened') order.push([e.region, n]);
    }
    expect(order).toEqual([
      ['fold', 3],
      ['server', 5],
      ['sun', 6],
      ['moon', 6],
      ['hollow', 8],
    ]);
    const mark = events.length;
    tick(world, events, 2);
    expect(events.slice(mark).some((e) => e.kind === 'storyRegionOpened')).toBe(false);
  });
});

describe('R0601: a line dresses the Grove only inside its region', () => {
  it('Dawn turns the Grove to the Sun recolour inside, and back outside', () => {
    const { world, events } = hazelAt(6);
    const unlocks = { ...world.unlocks };
    applyCommand(world, { kind: 'storylineStart', id: 'dawn' }, events);
    expect(world.grove).toBe('main');
    go(world, events, 'sun');
    expect(world.grove).toBe('sun');
    go(world, events, null);
    expect(world.grove).toBe('main');
    expect(world.unlocks).toEqual(unlocks);
  });
});

describe('R0597: a line scene waits until the Keeper is in its region', () => {
  it('c4-open, then s13-step1 after the breather; h-c2-open waits for the Fold', () => {
    const { world, events } = hazelAt(4);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    const line = world.lines.hundred!;
    playScenes(world, events);
    line.queue = ['h-c2-open'];
    c(world).queue = ['c4-open', 'h-c2-open', 's13-step1'];
    tick(world, events, 0.2);
    expect(c(world).queue).toEqual(['c4-open', 's13-step1']);
    const seen: string[] = [];
    for (const id of ['c4-open', 's13-step1']) {
      expect(c(world).queue[0]).toBe(id);
      applyCommand(world, { kind: 'sceneDone', scene: id, choice: null }, events);
      seen.push(id);
      c(world).queue = c(world).queue.filter((s) => s === 's13-step1');
    }
    expect(seen).toEqual(['c4-open', 's13-step1']);
    expect(c(world).queue).not.toContain('h-c2-open');
    go(world, events, 'fold');
    tick(world, events, 0.2);
    expect(c(world).queue).toContain('h-c2-open');
  });
});
