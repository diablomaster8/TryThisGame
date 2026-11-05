/**
 * Lane C round 13 (R0630): the journal reads Pixel's cabinet and the rift from their side saves
 * and writes nothing to the Grove.
 */
import { describe, expect, it } from 'vitest';
import { crossSavesFrom, worldProgress } from '../../src/sim/cross-saves';
import { derivedUnlocks } from '../../src/sim/derived-unlocks';
import { serialize } from '../../src/sim/save';
import { parseMultiverse } from '../../src/sim/side-saves';
import { createWorld } from '../../src/sim/world';

const arcade = JSON.stringify({
  version: 2,
  carts: {
    PA1: {
      quests: { pa1: { stage: 'finished' }, pa1b: { stage: 'scene' } },
      flags: {},
      rewards: [],
      done: false,
    },
    PA2: { quests: { pa2: { stage: 'finished' } }, flags: {}, rewards: [], done: true },
  },
});
const multiverse = JSON.stringify({
  version: 2,
  reflection: null,
  reflectionLost: false,
  lines: { IM: { quests: {}, flags: {}, rewards: [], done: false } },
});

describe('story-world shelves (R0630)', () => {
  it('counts finished and begun quests per cartridge and rift line', () => {
    const x = crossSavesFrom(null, arcade, []);
    expect(worldProgress(x.arcade.carts)).toEqual([
      { id: 'PA1', finished: 1, begun: 2, done: false },
      { id: 'PA2', finished: 1, begun: 1, done: true },
    ]);
    expect(worldProgress(parseMultiverse(multiverse).lines)).toEqual([
      { id: 'IM', finished: 0, begun: 0, done: false },
    ]);
  });

  it('reading them leaves the Grove save byte-identical', () => {
    const world = createWorld(7);
    const before = serialize(world);
    const x = crossSavesFrom(null, arcade, []);
    worldProgress(x.arcade.carts);
    worldProgress(parseMultiverse(multiverse).lines);
    derivedUnlocks(x);
    expect(serialize(world)).toBe(before);
  });
});
