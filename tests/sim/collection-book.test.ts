import { describe, expect, it } from 'vitest';
import {
  allKeys,
  BOOK_TABS,
  keysOf,
  noteNubbin,
  stepCollection,
  tabOf,
  tabProgress,
} from '../../src/sim/collection';
import { createWorld } from '../../src/sim/world';
import { JEWEL_EGG_COLORS } from '../../src/sim/nubbin';
import type { SimEvent } from '../../src/sim/types';

/** LOOK-55: the book holds every form, look, colour, part and hat. */
describe('the widened collection book', () => {
  it('lists the 60 second evolutions, looks, colours, jewels, parts and hats', () => {
    const keys = allKeys();
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.filter((k) => /^chao:(sun|moon|neutral):\w+:\w+$/.test(k)).length).toBe(60);
    expect(keys.filter((k) => k.startsWith('look:')).length).toBe(6);
    expect(keys.filter((k) => k.startsWith('jewel:')).length).toBe(JEWEL_EGG_COLORS.length);
    expect(keys).toContain('colour:sky:shiny');
    expect(keys).toContain('colour:sky:twotone:rose');
    expect(keys).toContain('part:penguin:arms');
    expect(keys).toContain('hat:straw');
    for (const tab of BOOK_TABS)
      expect(
        keys.some((k) => tabOf(k) === tab),
        tab,
      ).toBe(true);
  });

  it('notes what a Nubbin shows from play, with who showed it', () => {
    const world = createWorld(2, 0);
    const n = world.nubbins[0]!;
    n.species = 'chao';
    n.stage = 'adult';
    n.name = 'Pip';
    n.eggColor = 'sky';
    n.shiny = true;
    n.form = {
      band: 'sun',
      type: 'fly',
      second: 'swim',
      leanAtEvolution: { normal: 0, swim: 0, fly: 0, run: 0, power: 0 },
    };
    n.parts = { ...n.parts, arms: 'penguin' };
    n.hat = 'look-fox';
    expect(keysOf(n)).toEqual(
      expect.arrayContaining([
        'chao:sun:fly',
        'chao:sun:fly:swim',
        'colour:sky',
        'colour:sky:shiny',
        'part:penguin:arms',
        'look:look-fox',
      ]),
    );
    const events: SimEvent[] = [{ kind: 'critterGiven', nubbinId: n.id, species: 'penguin' }];
    stepCollection(world, events);
    expect(world.seen['chao:sun:fly:swim']).toBeDefined();
    expect(world.seenBy?.['part:penguin:arms']).toBe('Pip');
    expect(events.filter((e) => e.kind === 'firstSeen').length).toBeGreaterThanOrEqual(6);
  });

  it('pays a completed tab once', () => {
    const world = createWorld(2, 0);
    for (const k of allKeys())
      if (tabOf(k) === 'looks' && k !== 'look:look-shade') world.seen[k] = 1;
    const n = world.nubbins[0]!;
    n.stage = 'child';
    n.hat = 'look-shade';
    noteNubbin(world, n, []);
    expect(tabProgress(world, 'looks')).toEqual({ seen: 6, total: 6 });
    expect(world.bookTabs).toEqual(['looks']);
    noteNubbin(world, n, []);
    expect(world.bookTabs).toEqual(['looks']);
  });
});
