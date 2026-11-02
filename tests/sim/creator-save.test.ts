import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { deserialize, SAVE_VERSION, serialize } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';

describe('creator flag in saves', () => {
  it('SAVE_VERSION is at least 15', () => {
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(15);
  });

  it('a v14 save loads with creator false', () => {
    const json = readFileSync(join(__dirname, '..', 'fixtures', 'saves', 'v14-fresh.json'), 'utf8');
    expect(JSON.parse(json).version).toBe(14);
    expect(deserialize(json).world.creator).toBe(false);
  });

  it('creator true round-trips', () => {
    const w = createWorld(2, 0);
    w.creator = true;
    expect(deserialize(serialize(w, 5)).world.creator).toBe(true);
    w.creator = false;
    expect(deserialize(serialize(w, 5)).world.creator).toBe(false);
  });
});
