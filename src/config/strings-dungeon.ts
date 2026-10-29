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
  /** Hollow platforming (R0031): a step into a gap or deep water, and straight back. */
  fellChasm: 'Whoops! A soft bounce, and you are back on the ledge. Jump to cross.',
  fellWater: 'Splash! Too deep to wade. Find the stones, or jump.',
  /** Strays (R0162). */
  strayShooed: (name: string) => `${name || 'Your Nubbin'} chases the stray off, puffing.`,
  /** Pack plates (R0155): the words after the plate's shape. */
  plate: {
    normal: '',
    champion: 'Champion pack',
    elite: 'Elite',
    unique: 'Someone special',
    boss: 'Boss',
  },
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
  /** Waypoint stones (R0148). */
  waypointsTitle: 'Waypoints',
  waypointsHelp: 'Mossy stones that remember the way. Walk onto one to wake it; travel is free.',
  waypointButton: '◆ Waypoint',
  waypointLevel: (level: number) => `Level ${level}`,
  waypointAwake: '✓ Awake',
  waypointAsleep: '○ Not found yet',
  waypointHere: 'You are here',
  waypointActivated: 'A waypoint stone hums awake. You can travel back here any time.',
  waypointArrived: 'The moss glows, and here you are.',
  waypointsNone: 'No waypoint stones awake yet. The first sits near the top of each Hollow.',
  /** New paths (R0149). */
  newPaths: 'New paths',
  newPathsHelp: 'Redraw every Hollow’s tunnels. Once a day; bosses beaten stay beaten.',
  newPathsDone: 'The tunnels shift and settle. New paths wait below.',
  newPathsLater: 'The tunnels have shifted once today already.',
  /** The Homing Acorn (R0150). */
  acornsTitle: 'Homing Acorns',
  acornsHelp: (count: number, bundle: number, price: number) =>
    `Plant one to fall up home and come back later. You have ${count}. ${bundle} for ${price} Shells.`,
  acornsBuy: 'Buy',
  acornsBought: (count: number) => `${count} Homing Acorns in your pocket.`,
  acornsShort: 'Not enough Shells for a bundle of acorns.',
  acornFound: 'Tucked in the find: a Homing Acorn!',
  acornButton: (count: number, free: boolean) => (free ? '🌰 Acorn (free)' : `🌰 Acorn ×${count}`),
  acornPortal: (free: boolean) =>
    free
      ? 'Grandma’s acorn sprouts, and everyone falls up through a swirl of leaves. Home!'
      : 'The acorn sprouts, and everyone falls up through a swirl of leaves. Home!',
  portalTitle: 'Acorn portal',
  portalHelp: (level: string) => `Your acorn still glows at ${level}. Step back through.`,
  portalGo: 'Step through',
  portalReturned: 'Back through the acorn, right where you left off.',
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
  stray: 'Stray',
  way: 'Show me the way',
} as const;

/** Shrines (R0159): each kind's name, icon and what it does, plus the buff ring's labels. */
export const SHRINE_TEXT = {
  kinds: {
    sunny: { name: 'Sunny shrine', icon: '☀', does: 'A quarter more Shells from finds' },
    bouncy: { name: 'Bouncy shrine', icon: '➶', does: 'A spring in your step' },
    snuggly: { name: 'Snuggly shrine', icon: '♥', does: 'A happy party, a little stronger' },
    lucky: { name: 'Lucky Clover', icon: '☘', does: 'Better finds for a while' },
    picnic: { name: 'Picnic shrine', icon: '🧺', does: 'Everyone fed and rested' },
    glowy: { name: 'Glowy shrine', icon: '✺', does: 'You can see further' },
    gem: { name: 'Gem shrine', icon: '◆', does: 'A charm grows brighter' },
    secret: { name: 'Secret shrine', icon: '⌖', does: 'The whole level is on your map' },
  } as Record<string, { name: string; icon: string; does: string }>,
  used: (name: string, does: string) => `${name}! ${does}.`,
  faded: (name: string) => `The ${name}'s glow fades.`,
  ring: 'Shrine buffs',
  left: (name: string, s: number) => `${name}, ${s} seconds left`,
};

/** Traps (R0161): what each does when sprung, its tile icon, and a scout's spot. */
export const TRAP_TEXT = {
  sprung: {
    whoopee: 'Pfrrt! A whoopee tile. Everyone goes a bit pink.',
    sticky: 'A sticky puddle! Your boots squelch for a moment.',
    leaves: 'Whoosh! A leaf pile slides you back.',
    sneeze: 'A sneeze mushroom! Achoo, achoo.',
    bell: 'A bell wire tinkles. Something comes to have a look.',
    ice: 'Wheee! Ice underfoot.',
  } as Record<string, string>,
  icon: { whoopee: '◠', sticky: '◉', leaves: '❦', sneeze: '✲', bell: '♪', ice: '❄' } as Record<
    string,
    string
  >,
  spotted: 'Your scout points: ! A trap just ahead.',
};
