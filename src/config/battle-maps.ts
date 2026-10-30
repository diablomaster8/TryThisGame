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

/**
 * Lane C round 6 (recs FIGHT-82, FIGHT-72): the story battles' and the Hollow guardian's maps,
 * 10 wide and 8 high, the Keeper's side deploying in the west.
 */
export const BATTLE_STORY_MAPS: Readonly<Record<string, AuthoredMap>> = {
  ...BATTLE_MAPS,
  /** Chapter 8: the Hollow's rumble room; the notebook nook is the far north-east corner. */
  'rumble-room': {
    rows: [
      '#####...=.',
      '#...#.#.=.',
      '..*.....=.',
      '....,,....',
      '....,,..#.',
      '..*.....#.',
      '#........*',
      '#####.....',
    ],
    heights: [
      '0000000011',
      '0000000011',
      '0000000001',
      '0000000000',
      '0000000000',
      '0000000000',
      '0000000000',
      '0000000000',
    ],
  },
  /** S20's snow fort: frozen plums to gather across a yard of drifts and a slushy ditch. */
  'snow-fort': {
    rows: [
      '..........',
      '.##....##.',
      '..........',
      '....,,....',
      '....,,....',
      '..........',
      '.##....##.',
      '..........',
    ],
    heights: [
      '0000000000',
      '0110000110',
      '0000000000',
      '0000000000',
      '0000000000',
      '0000000000',
      '0110000110',
      '0000000000',
    ],
  },
  /** Post-game: under the Hollow's roots, where the old cold sleeps. */
  'old-cold': {
    rows: [
      '###....###',
      '#..*..*..#',
      '..........',
      '...,,,,...',
      '...,,,,...',
      '..........',
      '#..*..*..#',
      '###....###',
    ],
  },
  /** The Hollow's floor-5 guardian hall: pillars, crystal and a shallow pool. */
  'guardian-hall': {
    rows: [
      '##......##',
      '#..#..#..#',
      '..........',
      '....**....',
      '....,,....',
      '..........',
      '#..#..#..#',
      '##......##',
    ],
  },
};
