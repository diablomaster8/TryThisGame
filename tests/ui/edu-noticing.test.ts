import { describe, expect, it } from 'vitest';
import { EDU_NOTICING } from '../../src/config/tuning-kids-r11e';
import { eduNotice } from '../../src/sim/edu-notice';
import type { World } from '../../src/sim/types';
import { EduNoticing } from '../../src/ui/edu-noticing';

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
