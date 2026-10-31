import { describe, expect, it } from 'vitest';
import { PLACES_EDU } from '../../src/config/edu';
import { EDU_PLACES_TEXT } from '../../src/config/strings';
import { openPlaces, placeOpen } from '../../src/ui/edu-places';
import { applyCommand, createWorld } from '../../src/sim/world';

describe('R0680 (KIDS-12) Places menu', () => {
  it('shows only kid places by default, every one with an icon and a name', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    const open = openPlaces(w.edu!);
    expect(open).toEqual(['book', 'collection', 'decorate', 'photo', 'playFight']);
    for (const p of PLACES_EDU) {
      expect(p.icon.length).toBeGreaterThan(0);
      expect(EDU_PLACES_TEXT.names[p.id].length).toBeGreaterThan(0);
    }
  });

  it('a grown-up opens and closes places', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 5 }, []);
    applyCommand(w, { kind: 'eduSetPlace', place: 'beetle', on: true }, []);
    applyCommand(w, { kind: 'eduSetPlace', place: 'photo', on: false }, []);
    expect(placeOpen(w.edu!, 'beetle')).toBe(true);
    expect(openPlaces(w.edu!)).not.toContain('photo');
  });
});
