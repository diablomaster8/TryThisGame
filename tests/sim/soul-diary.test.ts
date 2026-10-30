import { describe, expect, it } from 'vitest';
import { recently, stepDiary } from '../../src/sim/diary';
import { createWorld } from '../../src/sim/world';
import type { Nubbin } from '../../src/sim/types';

// R0563 (SOUL-46): the diary behind the sheet's "Recently" lines.
describe('R0563 diary', () => {
  it('notes both sides, keeps five, shows the last three newest first, skips catch-up', () => {
    const w = createWorld(2, 0);
    const a = w.nubbins[0]!;
    const b: Nubbin = structuredClone(a);
    b.id = 'b';
    w.nubbins.push(b);
    stepDiary(w, [{ kind: 'comforted', nubbinId: a.id, markId: 'b' }], false);
    expect(recently(b)[0]).toMatchObject({ kind: 'wasComforted', otherId: a.id });
    // The same line twice inside a minute is one.
    stepDiary(w, [{ kind: 'antic', nubbinId: a.id, antic: 'trip' }], false);
    stepDiary(w, [{ kind: 'antic', nubbinId: a.id, antic: 'trip' }], false);
    expect(a.diary).toHaveLength(2);
    for (const [i, k] of (['sneeze', 'hiccup', 'trip', 'sneeze'] as const).entries()) {
      w.timeMs += 61_000 * (i + 1);
      stepDiary(w, [{ kind: 'antic', nubbinId: a.id, antic: k }], false);
    }
    expect(a.diary).toHaveLength(5);
    expect(recently(a).map((e) => e.kind)).toEqual(['sneeze', 'trip', 'hiccup']);
    stepDiary(w, [{ kind: 'fruitTaste', nubbinId: a.id, taste: 'yum' }], true);
    expect(recently(a)[0]!.kind).toBe('sneeze');
  });
});
