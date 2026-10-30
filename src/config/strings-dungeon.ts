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

/** Act towns and outdoor fields (R0152, R0147). Never shown in story worlds. */
export const HOLLOW_ZONE_TEXT = {
  town: (act: string) => `${act} · Camp`,
  field: (act: string) => `${act} · Fields`,
  side: (act: string, n: number) => `${act} · Side cave ${n}`,
  enterTownHelp: 'Start at the camp: stash, vendor and friends, then out across the fields.',
  mouthButton: '⛰ Enter the cave',
  campEntered: 'Lanterns, a kettle, friendly faces. The camp at the Hollow mouth.',
  acornCamp: 'The acorn sprouts, and everyone falls up through a swirl of leaves, into camp.',
  portalBack: '🌰 Back through the acorn',
  townWaypoint: 'Camp',
  fieldWaypoint: 'Fields',
  services: {
    stash: 'Stash chest',
    vendor: 'Vendor',
    craft: 'Crafting table',
    gamble: 'Gamble stall',
    hire: 'Hire board',
    quest: 'Quest',
  } as Record<string, string>,
  talk: (who: string) => `Talk to ${who}`,
  open: (what: string) => `Open the ${what.toLowerCase()}`,
  stashTitle: 'Stash chest',
  stashHelp: 'Shells in the stash are safe from sticky-fingered strays.',
  stashHeld: (stash: number, purse: number) => `In the stash: ${stash} Shells · On you: ${purse}`,
  stashIn: (n: number) => `Put in ${n}`,
  stashOut: (n: number) => `Take out ${n}`,
  stashAll: 'All',
  vendorFruit: (price: number) => `Fruit · ${price} Shells`,
  vendorFruitHelp: 'For coaxing strays home.',
  bought: 'Bought.',
  questDone: (shells: number) => `A job well done. Here's ${shells} Shells for your trouble.`,
  questPaid: 'Nothing more for now. Thank you again.',
  /** Services whose systems come later (DUNG-33, -34, -38). */
  soon: 'Not open yet. Come back when the Hollow has more to offer.',
};

/**
 * What each act camp's people say, by service. `{boss}` is the act boss's name. Kept short:
 * a line each, the camp's own voice.
 */
export const HOLLOW_TOWN_LINES: Record<string, Record<string, string>> = {
  rootways: {
    vendor:
      'Fresh fruit, and acorns that know the way home. Pie is not for sale. Pie is for later.',
    craft: 'Bring me bits and I will make them better bits. Once I have finished this table.',
    gamble: 'Pick a cup, any cup. Not yet, though. The cups are still drying.',
    hire: 'Sometimes a friend wants to come along. Their names go up here.',
    quest: 'Something big grumbles at the bottom of the Rootways. Quiet it, and come and tell me.',
  },
  cloister: {
    vendor: 'Everything here is dusted daily. Mostly by me.',
    craft: 'The old monks mended everything. So can we.',
    gamble: 'A riddle for a Shell? Later. I am still writing the riddles.',
    hire: 'Names of willing helpers. In my best handwriting.',
    quest: 'The Topiary Knight trims anything that wanders past. Show it some manners.',
  },
  sandglass: {
    vendor: 'Water, fruit, shade. The three things worth having out here.',
    craft: 'These glyphs are just instructions. Badly commented ones.',
    gamble: 'Sand runs one way. Luck runs both. Not open yet.',
    hire: 'Guides, porters, and one very keen beetle.',
    quest: 'Fluffhotep sleeps under the big dune. Wake it gently, then win.',
  },
  frostbell: {
    vendor: 'Warm fruit. Do not ask how. It is a trade secret.',
    craft: 'Ice is only water that is waiting. Give me time.',
    gamble: 'Guess which hole the fish is in. Soon.',
    hire: 'The lake is wide. Better crossed with company.',
    quest: 'Yeti Spaghetti tangles the far shore. Untangle it.',
  },
  gloom: {
    vendor: 'A little light, a little fruit. Enough to be going on with.',
    craft: 'Even here, things can be mended.',
    gamble: 'In the dark, every card is a surprise. Not yet.',
    hire: 'Nobody should walk down there alone.',
    quest: 'The Hushkeeper keeps everything quiet. Too quiet. Go and say hello.',
  },
};

/** Each camp's local (the one face not from the Grove). */
export const HOLLOW_LOCALS: Record<string, string> = {
  rootways: 'Old Tansy',
  cloister: 'Brother Wick',
  sandglass: 'Saffi',
  frostbell: 'Ilka',
  gloom: 'Mothwen',
};

/**
 * The named uniques (R0156): a short name (22 characters at most) and a caption shown when the
 * bout starts. Foes do not speak: the caption says what they do.
 */
export const UNIQUE_TEXT: Record<string, { name: string; line: string }> = {
  'sir-snorts': {
    name: 'Sir Snorts-a-Lot',
    line: 'Sir Snorts-a-Lot paws the moss and snorts. Twice.',
  },
  mumblemoss: {
    name: 'Old Mumblemoss',
    line: 'Old Mumblemoss grumbles, and a small cloud follows.',
  },
  'captain-crumbs': {
    name: 'Captain Crumbs',
    line: 'Captain Crumbs raises a biscuit like a shield.',
  },
  willowby: {
    name: 'The Weeping Willowby',
    line: 'The Weeping Willowby droops. It would like a hug.',
  },
  snapdragon: { name: 'Sister Snapdragon', line: 'Sister Snapdragon snaps her petals, very fast.' },
  'count-compost': {
    name: 'Count Compost',
    line: 'Count Compost bows. Something smells of old leaves.',
  },
  'dune-buggy': { name: 'Dune Buggy', line: 'Dune Buggy zips a circle in the sand. Vroom.' },
  'sandy-claws': { name: 'Sandy Claws', line: 'Sandy Claws clacks both claws and bounces.' },
  'sphinx-kitten': {
    name: 'The Sphinx-ish Kitten',
    line: 'The Kitten sits very still and looks wise.',
  },
  'brr-nadette': { name: 'Brr-nadette', line: 'Brr-nadette shivers glitter everywhere.' },
  'sir-shivers': { name: 'Sir Shivers', line: 'Sir Shivers bounces to keep warm.' },
  'icicle-choir': {
    name: 'The Icicle Choir',
    line: 'The Icicle Choir hums one long, chilly note.',
  },
  'hush-one': { name: 'Hush the Elder', line: 'A grey echo of a Nubbin. It looks cold.' },
  'hush-two': { name: 'Hush the Middle', line: 'Another grey echo. It copies how you stand.' },
  'hush-three': {
    name: 'Hush the Least',
    line: 'The smallest echo. Warm it, and it might colour back.',
  },
};

export const UNIQUE_RESULT_TEXT = {
  firstWin: (name: string, shells: number) =>
    `${name}, beaten for the first time! +${shells} Shells`,
  again: (name: string) => `${name} goes home to sulk.`,
};

/** The cave-mouth party picker (R0168). */
export const HOLLOW_PARTY_TEXT = {
  title: 'Who comes along',
  recommended: 'Recommended',
  help: (n: number) => `Tap to choose up to ${n}. The pick is kept for next time.`,
  tired: '💤 Tired',
  energy: (pct: number) => `Energy ${pct}%`,
};

/** Rumble rooms (R0257, R0282) and the stray's choice (R0281). */
export const RUMBLE_TEXT = {
  prefix: {
    fluffy: 'Extra Fluffy',
    speedy: 'Speedy',
    sticky: 'Sticky Paws',
  } as Record<string, string>,
  start: (prefix: string) => `A rumble room! A champion pack, ${prefix}, wants a play-fight.`,
  won: (prefix: string) => `The ${prefix} pack flops over, giggling. A chest pops open.`,
  lost: 'The pack bounces you out of the room. Step back in when you are ready.',
  loot: {
    hat: (hat: string) => `In the chest: a ${hat} hat!`,
    critter: (species: string) => `In the chest: a ${species} in a bubble!`,
    shells: (n: number) => `In the chest: ${n} Shells.`,
  },
  door: 'Rumble room',
  strayAsk: 'A Shadow stray tugs at your pocket. Calm it, or toss it a snack?',
  calm: '🤝 Calm it (bout)',
  snack: '🍎 Toss a snack',
  calmed: (shells: number) => `The stray calms down and gives back ${shells} Shells, and some.`,
  calmFailed: 'The stray wriggles free with your Shells.',
};

/** Hollow gear (R0163, R0164): tiers, bases, affixes and the gear panel. */
export const GEAR_TEXT = {
  button: '🎒 Gear',
  title: 'Gear',
  help: 'Worn pieces help underground. The shape shows how rare a piece is.',
  empty: 'Nothing yet. Beaten packs sometimes leave something behind.',
  rarity: {
    plain: 'Plain',
    shiny: 'Shiny',
    fancy: 'Fancy',
    legendary: 'Legendary',
    set: 'Set',
    charm: 'Charm',
  } as Record<string, string>,
  base: {
    satchel: 'Satchel',
    boots: 'Boots',
    lantern: 'Lantern',
    gloves: 'Gloves',
    scarf: 'Scarf',
    charm: 'Charm necklace',
    bracelet: 'Bracelet',
    backpack: 'Backpack',
  } as Record<string, string>,
  prefix: {
    bouncy: 'Bouncy',
    sunny: 'Sunny',
    lucky: 'Lucky',
    snug: 'Snug',
    brave: 'Brave',
  } as Record<string, string>,
  suffix: { crumbs: 'of Crumbs', owl: 'of the Owl', naps: 'of Naps' } as Record<string, string>,
  stat: {
    pickup: 'reach',
    speed: 'speed',
    explore: 'sight',
    shells: 'Shells a pickup',
    mf: 'luck',
    snug: 'snugness',
    brave: 'bravery',
    fruit: 'fruit finds',
    energy: 'naps',
    carry: 'carrying',
  } as Record<string, string>,
  wearKeeper: 'Wear',
  wearOn: (name: string) => `Give to ${name}`,
  takeOff: 'Take off',
  worn: (who: string) => `Worn by ${who}`,
  you: 'you',
  found: (glyph: string, name: string) => `Found: ${glyph} ${name}`,
};

/** Lane B round 6 (2026-10-29): boss floors, the sack, warm losses, sleepy packs, strays. */
export const HOLLOW_R6_TEXT = {
  /** R0160: the boss celebration card. */
  bossTitle: (boss: string) => `${boss} runs home!`,
  bossBody: 'It poofs into a shower of sparkles and scuttles off, looking sheepish.',
  bossChest: (glyph: string, name: string) => `In the big chest: ${glyph} ${name}`,
  bossNext: 'The next Hollow’s waypoint hums awake. The stairs up lead home.',
  bossRetry: 'Back to the anteroom, everyone rested. Try again whenever you like.',
  /** R0175: the haul card. */
  banked: (n: number) => `Bank it! ${n} ${n === 1 ? 'find' : 'finds'} safely home.`,
  sack: (n: number) => `🎒 Sack ×${n}`,
  /** R0180: warm losses and sneaking past. */
  giggles: 'Everyone got the giggles! A sparkle carries you back. Nothing lost.',
  sneakAsk: 'This pack keeps winning. Sneak past?',
  sneakYes: '🤫 Sneak past',
  sneakDone: 'You tiptoe by. The pack pretends not to see you for a minute.',
  /** R0203: sleepy packs. */
  tiptoe: (shells: number) => `Tiptoe! The pack snores on. +${shells} Shells`,
  woke: 'Your footsteps wake the pack. It blinks, then gives chase!',
  yawned: (name: string) => `${name} yawns enormously. The pack wakes up, offended.`,
  /** R0362: the tumble home. */
  tumble: 'Everyone is out of puff. You roll up the stairs in a heap… splash! Home, damp.',
  tumbleKept: (kept: number, stashed: number) =>
    `Half the finds came too (${kept}); the other ${stashed} washed up in the stash.`,
  /** R0184: End trip. */
  endTrip: '🏠 End trip',
  endConfirm: (n: number, depth: number) =>
    n > 0
      ? `End the trip? ${n} unbanked ${n === 1 ? 'find goes' : 'finds go'} home with you.`
      : `End the trip from level ${depth}?`,
  endYes: 'Yes, go home',
  endNo: 'Keep exploring',
  /** R0185: today's run results on the cave-mouth menu. */
  today: (deepest: number, time: string, finds: number) =>
    `Today: deepest ${deepest} · best time ${time} · finds ${finds}`,
  todayNone: 'Today: no trips yet.',
  /** R0176: the Mystery Basket stall. */
  basketTitle: 'Mystery Baskets',
  basketHelp: 'A covered basket for one slot. Never Plain: Shiny, Fancy, Legendary or Set.',
  basketBuy: (slot: string, price: number) => `${slot} · ${price} Shells`,
  basketOpened: (glyph: string, name: string) => `Out of the basket: ${glyph} ${name}!`,
  basketShort: 'Not enough Shells for that basket.',
  /** R0174: the stash. */
  stashTitle: (n: number) => `Stash (${n})`,
  stashTake: 'Take',
  /** R0165: the Journal page. */
  journalTitle: 'The Hollow',
  journalBoss: (name: string, done: boolean) => `${done ? '✓' : '○'} ${name}`,
  journalWaypoints: (n: number, total: number) => `Waypoints: ${n} of ${total}`,
  journalUniques: (n: number, total: number) => `★ Named foes met: ${n} of ${total}`,
  journalBest: (n: number) => `Deepest ever: level ${n}`,
  /** R0326: the strays' comic routine, three lines per outcome, rotated. */
  strayLines: {
    snatch: [
      (n: number) => `A stray pockets ${n} Shells and looks extremely casual.`,
      (n: number) => `A stray tiptoes off with ${n} Shells, humming innocently.`,
      (n: number) => `${n} Shells vanish. A stray wobbles away, overloaded.`,
    ],
    fed: [
      (name: string) => `${name} nibbles the fruit, goes shy and delighted, and follows you home.`,
      (name: string) => `${name} forgets all about Shells. Fruit is better. It joins you.`,
      (name: string) => `${name} hugs the fruit, then your boot. A new friend for the Grove.`,
    ],
    king: (hat: string) =>
      `The Stray King! It doffs its bottle-cap crown and leaves you a gift: ${hat}.`,
  },
};
