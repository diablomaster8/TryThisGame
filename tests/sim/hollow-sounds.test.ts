import { describe, expect, it } from 'vitest';
import { RARITIES } from '../../src/config/dungeon-loot';
import { hollowCueFor } from '../../src/ui/hollow-sounds';
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
});
