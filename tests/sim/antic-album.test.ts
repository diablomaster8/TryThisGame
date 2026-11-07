import { describe, expect, it } from 'vitest';
import { ALBUM } from '../../src/config/tuning-more/soul-wider-kindergarten';
import { ALBUM_IDS, pinDoodle, sawAntic, stampCount } from '../../src/sim/antic-album';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** R0564 and R0588 (lane A r11): the Antics album and the Fridge. */
function setup() {
  const world = createWorld(7, 0);
  const n = world.nubbins[0]!;
  hatch(n, [], 0);
  return { world, n };
}

describe('Antics album (R0564)', () => {
  it('has about forty pages', () => {
    expect(ALBUM_IDS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(ALBUM_IDS).size).toBe(ALBUM_IDS.length);
  });

  it('stamps a sneeze once, and only for a listed behaviour', () => {
    const { world, n } = setup();
    const ev: SimEvent[] = [];
    n.behavior.itemId = 'sneeze';
    expect(sawAntic(world, n, ev)).toBe('sneeze');
    expect(sawAntic(world, n, ev)).toBeNull();
    expect(stampCount(world)).toBe(1);
    n.behavior.itemId = 'eatingApple';
    expect(sawAntic(world, n, ev)).toBeNull();
    expect(ev.filter((e) => e.kind === 'albumStamp')).toHaveLength(1);
  });

  it('pays each milestone once and keeps the stamps in the world', () => {
    const { world, n } = setup();
    const before = world.inventory.shells;
    const ev: SimEvent[] = [];
    for (const id of ALBUM_IDS.slice(0, 10)) {
      n.behavior.itemId = id;
      sawAntic(world, n, ev);
    }
    expect(world.inventory.shells).toBe(before + ALBUM.prizes[10]!);
    n.behavior.itemId = ALBUM_IDS[0]!;
    sawAntic(world, n, ev);
    expect(world.inventory.shells).toBe(before + ALBUM.prizes[10]!);
    const copy = JSON.parse(JSON.stringify(world)) as typeof world;
    expect(Object.keys(copy.album ?? {})).toHaveLength(10);
  });

  it('works through the sawAntic command', () => {
    const { world, n } = setup();
    n.behavior.itemId = 'sneeze';
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'sawAntic', nubbinId: n.id }, ev);
    expect(world.album?.sneeze).toBeDefined();
  });
});

describe('Fridge (R0588)', () => {
  it('keeps the newest thirty doodles', () => {
    const { world, n } = setup();
    for (let i = 0; i < 40; i++) pinDoodle(world, n, i % 12, i * 1000);
    expect(world.fridge).toHaveLength(ALBUM.fridgeMax);
    expect(world.fridge![0]!.atMs).toBe(10_000);
    expect(world.fridge!.at(-1)!.atMs).toBe(39_000);
  });
});
