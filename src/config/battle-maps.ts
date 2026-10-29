/**
 * Hand-authored tactics maps for story battles (recs FIGHT-51), by area id. They win over the
 * map sampled from the open field. Rows use the ASCII of `mapFromRows` (`sim/battle/tactics/map.ts`):
 * `.` grass, `#` wall, `~` deep, `,` shallow, `*` crystal, `L` lantern, `"` tall grass, `=` path,
 * `m` mud, `s` shade, `T` fruit tree, `p` crop plot, `X` exit; heights are digit rows 0..4.
 */
export interface AuthoredMap {
  rows: readonly string[];
  heights?: readonly string[];
}

export const BATTLE_MAPS: Readonly<Record<string, AuthoredMap>> = {
  /** Corvin's garden: a lantern-lit plot with a fruit tree and a shady hedge. */
  'corvin-garden': {
    rows: [
      'ssss......',
      's..T...L..',
      '...pppp...',
      '...pppp...',
      '==========',
      '...,,.....',
      '..,,,,..."',
      '.......L""',
    ],
    heights: [
      '1111000000',
      '1000000000',
      '0000000000',
      '0000000000',
      '0000000000',
      '0000000000',
      '0000000001',
      '0000000011',
    ],
  },
};
