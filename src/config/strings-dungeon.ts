/**
 * Player-facing text for the Hollow Below's rebuild (lane B, DUNG). The older Hollow text
 * stays in `DUNGEON_TEXT` in strings.ts.
 */
export const HOLLOW_TEXT = {
  /** The boot veil's label when the save opens underground (R0142). */
  loading: 'Lighting the Hollow…',
  /** Monster packs (R0146). */
  packBeaten: (shells: number) =>
    `The pack poofs into sparkles and scurries home. +${shells} Shells`,
  partyGiggles: 'Your party gets the giggles and sits down. Back to the stairs, everything kept.',
  packFled: 'You slip away; the pack wanders home.',
  /** The pack fight's panel, on the battle core. */
  boutTitle: 'A pack!',
  boutBackOff: 'Back off',
  boutFoes: 'The pack',
  boutWon: 'The whole pack has toddled home.',
  boutEnded: 'Everyone backs off and catches their breath.',
  /** The acts' cave-mouth menu (R0145). */
  actsTitle: 'The five Hollows',
  deepHollow: 'The Deep Hollow',
  deepHollowHelp: 'The endless cave: as deep as you dare, a new one every time.',
  actLocked: 'Beat the boss of the Hollow above to open this one.',
  actCleared: 'Boss beaten',
  bossGuard: 'Something big sits on the way on. It will have to be beaten first.',
  bossBeaten: (name: string) => `${name} is beaten! The way to the next Hollow is open.`,
} as const;

/** The acts' names, a line each, and their bosses (R0145), by `ActId`. */
export const ACT_TEXT: Record<string, { name: string; blurb: string; boss: string }> = {
  rootways: {
    name: 'The Rootways',
    blurb: 'The Hollow you know: roots, pools and lamplit rock.',
    boss: 'Big Grumblecap',
  },
  cloister: {
    name: 'The Mossy Cloister',
    blurb: 'Walled herb gardens and stone arches, lanterns in the niches.',
    boss: 'The Topiary Knight',
  },
  sandglass: {
    name: 'The Sandglass Ruins',
    blurb: 'Sun courtyards, hourglass towers and sand slides.',
    boss: 'Pharaoh Fluffhotep',
  },
  frostbell: {
    name: 'The Frostbell Caves',
    blurb: 'Ice bridges, bell-icicles and floors you slide on.',
    boss: 'Yeti Spaghetti',
  },
  gloom: {
    name: 'The Gloom',
    blurb: 'Where the cold goes grey and still.',
    boss: 'The Hushkeeper',
  },
};

/**
 * The automap (R0154): the map button's three states, the full-screen overlay's label, and
 * the legend's names. `HOLLOW_MAP_TEXT` in strings.ts keeps the corner map's older words.
 */
export const HOLLOW_AUTOMAP_TEXT = {
  /** The button's label for the state the map is in now; a tap moves to the next one. */
  button: { off: 'Map: off', corner: 'Map: corner', overlay: 'Map: over the cave' },
  /** Shown as the button's tooltip on desktop. */
  keys: 'Map (M corner, Tab over the cave)',
  overlay: (floor: number) => `Map of floor ${floor}, over the cave`,
  you: 'You',
  party: 'Party',
  up: 'Stairs up',
  down: 'Stairs down',
  chest: 'Chest',
  waypoint: 'Waypoint',
  portal: 'Portal',
  shrine: 'Shrine',
  unique: 'Someone special',
  quest: 'Quest',
  way: 'Show me the way',
} as const;
