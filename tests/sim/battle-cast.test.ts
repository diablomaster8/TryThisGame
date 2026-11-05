import { describe, expect, it } from 'vitest';
import { rivalArt } from '../../src/minigames/battle/cast';
import type { BattleContext } from '../../src/sim/battle';

// R0219 (leftover of R0157): a Hollow bout's rivals draw as their family's own look.
const hollow = (key: string): BattleContext => ({
  kind: 'encounter',
  tier: 1,
  ids: ['a'],
  source: 'hollow',
  key,
  foes: [{ species: 'leafgrub', level: 3 }],
});

describe('rivalArt', () => {
  it('gives a Hollow pack foe its family look', () => {
    expect(rivalArt({}, hollow('pack-1'), 'leafgrub')).toBe('foe:grubble');
  });
  it('colour-drains the families in an act of Greylings', () => {
    expect(rivalArt({ dungeon: { act: 4 } as never }, hollow('pack-1'), 'leafgrub')).toBe(
      'foe:grey-grubble',
    );
  });
  it('keeps the boss, other species and bouts outside the Hollow as themselves', () => {
    expect(rivalArt({}, hollow('pack-boss'), 'leafgrub')).toBe('leafgrub');
    expect(rivalArt({}, hollow('pack-1'), 'chao')).toBe('chao');
    expect(rivalArt({}, { kind: 'dojo', tier: 1, ids: ['a'] }, 'leafgrub')).toBe('leafgrub');
  });
});
