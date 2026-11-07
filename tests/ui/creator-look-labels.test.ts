import { describe, expect, it } from 'vitest';
import { cosmeticLabel } from '../../src/config/cosmetics';
import { CREATOR_LOOKS } from '../../src/sim/creator';

/** BS-04 (bug sweep 2026-11-06): the creator picker's Character look list showed raw ids. */
describe('creator picker look names', () => {
  it('every look has a player-facing name, not its id', () => {
    for (const id of CREATOR_LOOKS) {
      const name = cosmeticLabel(id);
      expect(name).not.toBe(id);
      expect(name).not.toMatch(/^look-/);
    }
  });
});
