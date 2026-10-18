import { describe, expect, it } from 'vitest';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, SaveError, serialize } from '../../src/sim/save';
import { decodeNubbin, encodeNubbin, receiveNubbin } from '../../src/sim/share';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/**
 * Share codes are untrusted: the checksum is public, so anyone can wrap any JSON in a
 * valid code (review C, item 2). A code must pass the import check, and a save that
 * already holds a broken Nubbin must go down the unreadable-save path, never crash.
 */

function hatchedWorld(seed: number): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) hatch(n, events, 0);
  return w;
}

const BARE = { name: 'Bare', stats: {} } as unknown as Nubbin;

describe('share codes', () => {
  it('refuses a code built from {"name":"Bare","stats":{}} with a valid checksum', () => {
    expect(decodeNubbin(encodeNubbin(BARE))).toBeNull();
  });

  it('takes a real Nubbin and caps its name at 16 characters', () => {
    const n = structuredClone(hatchedWorld(3).nubbins[0]!);
    n.name = 'A very long name indeed, far too long';
    const back = decodeNubbin(encodeNubbin(n));
    expect(back).not.toBeNull();
    expect(back!.name).toBe('A very long name');
    expect(back!.stats).toEqual(n.stats);
  });

  it('refuses a broken Nubbin sent straight to the command', () => {
    const w = hatchedWorld(4);
    const before = w.nubbins.length;
    expect(receiveNubbin(w, BARE, [])).toBe(false);
    expect(w.nubbins.length).toBe(before);
  });

  it('sends a save that already holds one to the unreadable path', () => {
    const w = hatchedWorld(5);
    w.nubbins.push(BARE);
    expect(() => deserialize(serialize(w, 1))).toThrow(SaveError);
  });
});
