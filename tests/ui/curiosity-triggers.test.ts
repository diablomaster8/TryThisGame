import { describe, expect, it } from 'vitest';
import { STORY } from '../../src/config/tuning';
import { CURIO_TRIGGER, CuriosityTriggers } from '../../src/ui/curiosity-triggers';
import { createWorld } from '../../src/sim/world';
import type { Npc } from '../../src/sim/types';

/** FUN-43 (lane E r9): the eight in-world curiosity triggers. */
describe('curiosity triggers', () => {
  it('counts lantern taps, Fern pats, cottage taps and Keeper talks', () => {
    const w = createWorld(3, 0);
    const t = new CuriosityTriggers();
    for (let i = 0; i < CURIO_TRIGGER.lanternTaps - 1; i++)
      t.onCommand({ kind: 'lightLantern', id: 'lantern-4' }, w, i);
    t.onCommand({ kind: 'lightLantern', id: 'lantern-1' }, w, 30);
    expect(t.take()).toEqual([]);
    t.onCommand({ kind: 'lightLantern', id: 'lantern-4' }, w, 40);
    expect(t.take()).toEqual(['lantern']);
    // Pats far apart do not count; three quick ones do.
    t.onCommand({ kind: 'storyProp', prop: 'fern-stone' }, w, 0);
    t.onCommand({ kind: 'storyProp', prop: 'fern-stone' }, w, 10_000);
    t.onCommand({ kind: 'storyProp', prop: 'fern-stone' }, w, 20_000);
    expect(t.take()).toEqual([]);
    t.onCommand({ kind: 'storyProp', prop: 'fern-stone' }, w, 21_000);
    t.onCommand({ kind: 'storyProp', prop: 'fern-stone' }, w, 22_000);
    expect(t.take()).toEqual(['fernBlush']);
    t.onSelect('building:cottage');
    t.onSelect('building:dojo');
    t.onSelect('building:cottage');
    expect(t.take()).toEqual([]);
    t.onSelect('building:cottage');
    expect(t.take()).toEqual(['cup']);
    const npc = (id: string, trainer: string): Npc =>
      ({ id, trainer, pos: { x: 0, z: 0 }, facing: 0 }) as unknown as Npc;
    w.npcs = [npc('n1', 'byte'), npc('n2', 'clover')];
    for (let i = 0; i < CURIO_TRIGGER.byteTalks; i++)
      t.onCommand({ kind: 'talk', npcId: 'n1' }, w, i);
    t.onCommand({ kind: 'talk', npcId: 'n2' }, w, 0);
    expect(t.take()).toEqual(['stopwatch']);
    w.timeMs = STORY.dayMs * CURIO_TRIGGER.scarfDay;
    t.onCommand({ kind: 'talk', npcId: 'n2' }, w, 0);
    expect(t.take()).toEqual(['scarf']);
  });

  it('spots a quick switch and back, and an egg turned upside down', () => {
    const w = createWorld(3, 0);
    w.settings.jukebox = null;
    const t = new CuriosityTriggers();
    w.keeper.alignment = 'sun';
    t.tick(w, 0, 0, 0);
    w.keeper.alignment = 'moon';
    t.tick(w, 0, 100, 0);
    expect(t.take()).toEqual([]);
    w.keeper.alignment = 'sun';
    t.tick(w, 0, 2000, 0);
    expect(t.take()).toEqual(['backToBack']);
    const egg = w.nubbins.find((n) => n.stage === 'egg')!;
    egg.behavior.state = 'held';
    t.tick(w, 2, 3000, 0);
    t.tick(w, 3, 3100, 0);
    expect(t.take()).toEqual([]);
    t.tick(w, 6, 3200, 0);
    expect(t.take()).toEqual(['eggUpside']);
    egg.behavior.state = 'idle' as typeof egg.behavior.state;
    t.tick(w, 6, 3300, 0);
    expect(t.take()).toEqual([]);
    egg.behavior.state = 'held';
    t.tick(w, 6, 3400, 180);
    expect(t.take()).toEqual(['eggUpside']);
  });
});
