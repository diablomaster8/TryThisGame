import { describe, expect, it } from 'vitest';
import { RARITIES } from '../../src/config/dungeon-loot';
import { hollowCueFor } from '../../src/ui/hollow-sounds';
import { HOLLOW_CUE_NOTES } from '../../src/config/tuning-r17d1';
import { createWorld } from '../../src/sim/world';
import type { GearItem, SimEvent } from '../../src/sim/types';

// R0199: every Hollow encounter event has its cue; the rest stay quiet.

describe('Hollow cues (R0199)', () => {
  it('maps each encounter event to its cue', () => {
    const world = createWorld(1, 0);
    const cue = (e: SimEvent) => hollowCueFor(e, world);
    expect(cue({ kind: 'packNoticed', packId: 'pack-1' })).toBe('notice');
    expect(cue({ kind: 'packBeaten', packId: 'pack-1', x: 0, z: 0, shells: 3 })).toBe('poof');
    expect(cue({ kind: 'shrineUsed', shrine: 'snuggly' })).toBe('shrine');
    expect(cue({ kind: 'waypointActivated', id: 'rootways.1' })).toBe('waypoint');
    for (const r of RARITIES) {
      const item = { rarity: r.id } as GearItem;
      expect(cue({ kind: 'gearFound', item })).toBe(
        r.id === 'charm' ? 'drop:shiny' : `drop:${r.id}`,
      );
    }
    expect(cue({ kind: 'encounterStarted', packId: 'pack-2' })).toBeNull();
    expect(cue({ kind: 'encounterStarted', packId: 'pack-boss' })).toBe('boss:0');
    expect(cue({ kind: 'chestOpened', shells: 1, egg: false })).toBeNull();
  });

  // R0450 (R17 d1): the Hollow's own sounds.
  it('gives the Hollow’s own moments their cues, and every note cue is reached', () => {
    const world = createWorld(1, 0);
    const cue = (e: SimEvent) => hollowCueFor(e, world);
    expect(cue({ kind: 'dungeonEntered', depth: 1, daily: false })).toBe('cavern');
    expect(cue({ kind: 'dungeonEntered', depth: 1, daily: false, camp: true })).toBeNull();
    expect(cue({ kind: 'descended', depth: 2, daily: false })).toBe('stairs');
    expect(cue({ kind: 'hollowSecret', id: 's', how: 'bump' })).toBe('secret');
    const puzzle = (what: 'solved' | 'shortcut' | 'plate' | 'torch' | 'push' | 'reset') =>
      cue({ kind: 'hollowPuzzle', what, puzzle: 'plates' });
    expect(puzzle('solved')).toBe('puzzle');
    expect(puzzle('plate')).toBe('plate');
    expect(puzzle('reset')).toBeNull();
    expect(cue({ kind: 'hollowFell', water: true, from: { x: 0, z: 0 }, to: { x: 0, z: 0 } })).toBe(
      'fall:water',
    );
    expect(
      cue({ kind: 'hollowFell', water: false, from: { x: 0, z: 0 }, to: { x: 0, z: 0 } }),
    ).toBe('fall:chasm');
    expect(cue({ kind: 'trapSpotted', trap: 't' })).toBe('spot');
    expect(cue({ kind: 'trapSprung', trap: 't' })).toBe('trap');
    expect(cue({ kind: 'bossBeaten', act: 0 })).toBe('bossDown');
    expect(cue({ kind: 'hollowBossDoor', sealed: false })).toBe('door');
    expect(cue({ kind: 'hollowBossDoor', sealed: true })).toBeNull();
    // Every note cue is the answer to some event above (none is dead data), and is short and soft.
    const reached = new Set([
      'cavern',
      'stairs',
      'secret',
      'puzzle',
      'plate',
      'fall:water',
      'fall:chasm',
      'spot',
      'trap',
      'bossDown',
      'door',
    ]);
    expect(Object.keys(HOLLOW_CUE_NOTES).sort()).toEqual([...reached].sort());
    for (const notes of Object.values(HOLLOW_CUE_NOTES))
      for (const [, at, dur, , gain] of notes) {
        expect(at + dur).toBeLessThanOrEqual(1000);
        expect(gain).toBeLessThanOrEqual(0.06);
      }
  });
});
