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

/**
 * The trial map pack (recs FIGHT-97, `sim/battle/tactics/trials.ts`): `.` floor, `#` wall,
 * `~` water, `B` boulder, `S` start, `X` gate, `1`–`3` bells, `F` a lit lantern, `L` a lantern
 * to light. `par` is the fewest steps (the solver test proves each one), `relay` the flame's
 * steps.
 */
export interface TrialMap {
  id: string;
  name: string;
  rows: readonly string[];
  par: number;
  relay?: number;
}

export const TRIAL_MAPS: readonly TrialMap[] = [
  { id: 'trial-01', name: 'One Big Splash', par: 4, rows: ['#######', '#S.B~X#', '#######'] },
  {
    id: 'trial-02',
    name: 'Ding, Dong, Door',
    par: 17,
    rows: ['#######', '#1...2#', '#..S..#', '#3...X#', '#######'],
  },
  {
    id: 'trial-03',
    name: 'Pass the Flame',
    par: 12,
    relay: 5,
    rows: ['########', '#F....L#', '#S.....#', '#L....X#', '########'],
  },
  {
    id: 'trial-04',
    name: 'Two Boulders, One Pond',
    par: 7,
    rows: ['########', '#S.B...#', '#..B.~~#', '#.....X#', '########'],
  },
  {
    id: 'trial-05',
    name: 'Bells Across the Brook',
    par: 22,
    rows: ['#########', '#S.B~.1.#', '#...~...#', '#2..~.3X#', '#########'],
  },
  {
    id: 'trial-06',
    name: 'Lantern Relay Race',
    par: 11,
    relay: 4,
    rows: ['#########', '#F..L...#', '#S......#', '#...L..L#', '#.....X.#', '#########'],
  },
  {
    id: 'trial-07',
    name: 'The Long Push',
    par: 8,
    rows: ['#########', '#S......#', '#.B.###.#', '#...~~~X#', '#..B....#', '#########'],
  },
  {
    id: 'trial-08',
    name: 'Backwards Bells',
    par: 16,
    rows: ['#########', '#3..S..1#', '#.#####.#', '#...2...#', '#X......#', '#########'],
  },
  {
    id: 'trial-09',
    name: 'Bridge, Then Light',
    par: 9,
    relay: 6,
    rows: ['#########', '#F.B~..L#', '#S..~...#', '#...~..X#', '#########'],
  },
  {
    id: 'trial-10',
    name: 'Corner Pocket',
    par: 8,
    rows: ['########', '#S.....#', '#.B..B.#', '#.....~#', '#~....X#', '########'],
  },
  {
    id: 'trial-11',
    name: 'Everything at Once',
    par: 15,
    relay: 8,
    rows: ['##########', '#S.B~.1..#', '#F..~..L.#', '#...~.2.3#', '#......X.#', '##########'],
  },
  {
    id: 'trial-12',
    name: 'Grand Ringing',
    par: 29,
    relay: 5,
    rows: [
      '##########',
      '#1.....F.#',
      '#.##B##..#',
      '#S..~..L.#',
      '#.##.##..#',
      '#2..~.3.X#',
      '##########',
    ],
  },
];
