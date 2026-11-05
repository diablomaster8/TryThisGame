import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { favSpot } from '../../src/sim/fav-spot';
import { favouriteKeeper } from '../../src/sim/keeper-fondness';
import { likesOf } from '../../src/sim/likes';
import { leanShares } from '../../src/sim/personality';
import { deserialize, SAVE_VERSION, serialize } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';

/**
 * R0576 (SOUL-59), lane A r11: the soul fields need no save bump. Every one added in rounds
 * 8-11 is optional and defaults where it is read (seeded ones, likes and the favourite spot,
 * come from `n.seed` and are never stored), so an old save loads with all of them and an
 * export round-trips unchanged. This pins that down instead of a migration step.
 */
const FIX = join(__dirname, '..', 'fixtures', 'saves');

describe('R0576 soul fields across saves', () => {
  it('the oldest saves load and every soul reader works on their Nubbins', () => {
    for (const f of ['v1-minimal.json', 'v13-played.json']) {
      const { world } = deserialize(readFileSync(join(FIX, f), 'utf8'));
      for (const n of world.nubbins) {
        expect(favouriteKeeper(n)).toBeNull();
        expect(likesOf(n)).toEqual(likesOf({ seed: n.seed }));
        expect(favSpot(n, world).id).toBe(favSpot(n, world).id);
        const s = leanShares(n);
        expect(Object.keys(s)).toHaveLength(8);
      }
      // And round-trips unchanged.
      const once = serialize(world, 0);
      expect(serialize(deserialize(once).world, 0)).toBe(once);
    }
  });

  it('a world with every soul field set round-trips identically', () => {
    const w = createWorld(9, 0);
    const n = w.nubbins[0]!;
    n.personality = 'dreamy';
    n.keeperFondness = { sun: 3, moon: 11 };
    n.tiltFor = 'sun';
    n.spotSeen = true;
    n.echo = 'bold';
    n.childCare = {
      pets: 1,
      throws: 0,
      feeds: 2,
      curious: 3,
      gentle: 4,
      praises: 2,
      bold: 1,
      dreamMs: 4000,
    };
    n.recentCare = [{ kind: 'hug', atMs: 5 }];
    n.rivals = { x: 3 };
    n.toyBoredom = { t: { v: 2, at: 1 } };
    n.remembered = [{ id: 'a', name: 'A', atMs: 1 }];
    const once = serialize(w, 0);
    const back = deserialize(once).world;
    expect(serialize(back, 0)).toBe(once);
    expect(back.nubbins[0]!.keeperFondness).toEqual({ sun: 3, moon: 11 });
    expect(back.nubbins[0]!.personality).toBe('dreamy');
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(15);
  });

  it('a ninth personality in a hand-edited save loads as none', () => {
    const raw = JSON.parse(serialize(createWorld(9, 0), 0)) as {
      world: { nubbins: Array<Record<string, unknown>> };
    };
    raw.world.nubbins[0]!.personality = 'grumpy';
    raw.world.nubbins[0]!.echo = 'sleepy';
    const n = deserialize(JSON.stringify(raw)).world.nubbins[0]!;
    expect(n.personality).toBeNull();
    expect(n.echo).toBeUndefined();
  });
});
