import { describe, expect, it } from 'vitest';
import { floorOf, type Floor } from '../../src/sim/dungeon';

// Pins generator versions 1 and 2 bit for bit (R0144, DUNG-67): a saved run keeps the floor
// it stands on, so the rebuild must never change what the old versions make. If one of
// these hashes moves, an old generator changed; that is the bug, not the hash.

function fnv(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function fingerprint(f: Floor): string {
  return fnv(
    JSON.stringify(f, (_k, v: unknown) =>
      v instanceof Uint8Array || v instanceof Float32Array ? Array.from(v) : v,
    ),
  );
}

const CASES: Array<[number, number, number]> = [
  [11, 1, 1],
  [11, 6, 1],
  [11, 1, 2],
  [12345, 3, 2],
  [987654321, 8, 2],
  [42, 14, 2],
  [7, 20, 2],
];

describe('old generators stay frozen', () => {
  it('versions 1 and 2 make the same floors as before the rebuild', () => {
    const got = CASES.map(([seed, depth, version]) => fingerprint(floorOf(seed, depth, version)));
    expect(got).toEqual(EXPECTED);
  });
});

const EXPECTED: string[] = [
  '36ed47a2',
  'af1fdfb7',
  '85de28f6',
  '7682c76b',
  '46bcb918',
  'e86e76a5',
  '00d21673',
];
