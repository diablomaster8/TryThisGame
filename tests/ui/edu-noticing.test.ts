import { beforeEach, describe, expect, it } from 'vitest';
import { EDU_NOTICING } from '../../src/config/tuning-kids-r11e';
import { eduNotice } from '../../src/sim/edu-notice';
import type { World } from '../../src/sim/types';
import { EduNoticing } from '../../src/ui/edu-noticing';
import {
  fruitAvailable,
  isFruitThing,
  noticeHighlight,
  onFruitEaten,
  resetGroveNoticed,
  takeFruit,
} from '../../src/ui/grove-noticed';

function world(band: 'sprout' | 'reader'): World {
  const fruit = (id: string) => ({ id, kind: 'fruit' });
  return {
    timeMs: 5000,
    edu: { band, items: {} },
    items: [fruit('a'), fruit('b'), fruit('c')],
    nubbins: [{ id: 'n1', name: 'Nono', eggColor: 'sky' }],
  } as unknown as World;
}
const drop = { kind: 'fruitDropped', treeId: 't', itemId: 'a' } as const;

describe('R0723 Grove noticing', () => {
  it('a fruit drop counts the fruit aloud, then stays quiet for the gap', () => {
    const w = world('sprout');
    const n = new EduNoticing();
    expect(n.onEvent(drop, w, 1000)?.text).toBe('One, two, three apples!');
    expect(n.onEvent(drop, w, 1000 + EDU_NOTICING.gapMs - 1)).toBeNull();
    expect(n.onEvent(drop, w, 1000 + EDU_NOTICING.gapMs)).not.toBeNull();
  });
  it('a hatch names the colour and readers hear nothing', () => {
    const hatch = { kind: 'hatched', nubbinId: 'n1' } as const;
    expect(new EduNoticing().onEvent(hatch, world('sprout'), 0)?.text).toBe(
      'What colour is Nono? Sky!',
    );
    expect(new EduNoticing().onEvent(drop, world('reader'), 0)).toBeNull();
  });
  it('shakes are counted, and a notice logs an item hit with no mistakes', () => {
    const w = world('sprout');
    const n = new EduNoticing();
    const shake = { kind: 'treeShaken', treeId: 't' } as const;
    expect(n.onEvent(shake, w, 0)).toBeNull();
    expect(n.onEvent(shake, w, 10)?.text).toBe('Shake, shake: two shakes!');
    eduNotice(w, 'count:3');
    expect(w.edu!.items!['count:3']).toMatchObject({ seen: 1, firstTry: 1 });
  });
});

describe('R0723 fruit highlight and real fruit eaten', () => {
  beforeEach(() => resetGroveNoticed());
  const ate = { kind: 'ate', nubbinId: 'n1' } as const;

  it('a fruit moment lights that fruit for a while, then lets go', () => {
    const n = new EduNoticing();
    expect(n.onEvent(drop, world('sprout'), 1000)?.highlight).toBe('a');
    expect(noticeHighlight(1000 + EDU_NOTICING.highlightMs - 1)).toBe('a');
    expect(noticeHighlight(1000 + EDU_NOTICING.highlightMs)).toBeNull();
  });
  it('a moment with no fruit lights nothing, and a rate-limited drop lights nothing new', () => {
    const n = new EduNoticing();
    n.onEvent({ kind: 'hatched', nubbinId: 'n1' }, world('sprout'), 0);
    expect(noticeHighlight(1)).toBeNull();
    n.onEvent(drop, world('sprout'), 10);
    expect(noticeHighlight(11)).toBeNull();
  });
  it('counts the fruit the Grove really ate, in either band, and takes it once', () => {
    const n = new EduNoticing();
    n.onEvent(ate, world('sprout'), 0);
    n.onEvent(ate, world('reader'), 0);
    n.onEvent(ate, { ...world('sprout'), edu: null } as unknown as World, 0);
    expect(fruitAvailable()).toBe(2);
    expect(takeFruit(5)).toBe(2);
    expect(takeFruit(1)).toBe(0);
    expect(fruitAvailable()).toBe(0);
  });
  it('tells a count beat each piece as it is eaten, until it stops listening', () => {
    let heard = 0;
    const stop = onFruitEaten(() => (heard += 1));
    const n = new EduNoticing();
    n.onEvent(ate, world('sprout'), 0);
    stop();
    n.onEvent(ate, world('sprout'), 0);
    expect(heard).toBe(1);
  });
  it('knows which count things are the Grove fruit', () => {
    expect(isFruitThing('fruit')).toBe(true);
    expect(isFruitThing('apples')).toBe(true);
    expect(isFruitThing('stars')).toBe(false);
  });
});
