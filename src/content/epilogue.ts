/**
 * R0600 (CAMP-07): the Valley Fair, the optional grand epilogue. It unlocks when Hazel's Grove has
 * ended and at least two of the four lines beside it have, and it plays one callback line per
 * finished ending. It changes no ending: every line is a small glance back, said at the fair.
 *
 * Keys: `hazel` for the spine (its ending ids), then a line id (`hundred`, `logged`, `beetle`,
 * `dawn`, `dusk`) and its ending ids. Every line is at most 160 characters. The content checker
 * fails an ending id that has no callback here.
 *
 * The fair is cosy and low-stakes: bunting, the pie table, children in a three-legged race. The
 * narrator speaks in the present tense, second person, and never explains a plot twice.
 */
export const EPILOGUE_CALLBACKS: Record<string, Record<string, string>> = {
  hazel: {
    'hazels-grove': 'Gran Hazel’s stall sells nothing. People queue anyway, to stand near it.',
    'moss-sleeps': 'A small stone sits on the bunting table. Someone has hung a ribbon on it.',
    'shadow-keeper': 'Sable walks the fair beside you, and the children stop being afraid of the dark.',
    'long-road': 'Someone hands you a paper lantern. You carry it a long way round, and you are glad to.',
    'eternal-dawn': 'The Eternal sits in the sun by the pie table and lets the smallest ones pat its head.',
    'wild-grove': 'The wild ones watch from the hedge. A few come close enough to share the crumbs.',
    collector: 'There is an empty pen at the back of the fair. Somebody has put a flower in it.',
    'empty-lantern': 'One lantern stays unlit on the string. Nobody mends it. Everybody notices it kindly.',
  },
  hundred: {
    'bright-fold': 'The Fold’s whole festival has come down the lane, banners and all, and the fair is brighter for it.',
    'the-fold': 'Steam still clings to the Fold’s visitors. They smell of bathhouse and good soap.',
    'quiet-fold': 'The few from the quiet Fold sit together, perfectly content, passing one pie along.',
    'grey-fold': 'A grey lamp hangs by the gate. Somebody has put a second one beside it, so it isn’t alone.',
  },
  logged: {
    'everyone-wakes': 'Three little sleepers wake on the grass, stretch, and go straight to the sweet stall.',
    'quiet-exit': 'The company’s lamps glow on the hay bales, tidy and quiet, like a well-kept shop.',
    'one-short': 'The party saves a place on the bench for the one who isn’t here. Nobody sits in it.',
  },
  beetle: {
    'open-sky': 'The weather holds fair all day, as if the sky itself had been asked, and said yes.',
    'two-as-one': 'One Nubbin with two sets of footprints trots round the fair, delighted with itself.',
    'steady-rain': 'A gentle rain taps the bunting all afternoon. Nobody minds. The pies stay warm.',
  },
  dawn: {
    'half-day': 'The first light of the morning falls on the fairground, and the small one sleeps through it.',
    'wrong-cause': 'The Nubbin that grew small again is growing fast, and has opinions about the fence.',
    'whole-day': 'A whole day at last: the fair opens in the sun and doesn’t close until the stars.',
  },
  dusk: {
    'half-day': 'The last light stays on the bunting a little longer than it should, as a favour.',
    'wrong-cause': 'The small one at your boot yawns. It has been growing again, and is quite tired of it.',
    'whole-day': 'Sun and moon share the sky above the fair for one long, strange, lovely minute.',
  },
};

/** The fair's own opening and closing words (the scene is `epilogue-fair`). */
export const EPILOGUE_FRAME = {
  open: [
    'Bunting goes up along the lane, and by afternoon the whole valley is at the fair.',
    'Every road you walked has sent someone. They have saved you a place.',
  ],
  close: [
    'The lanterns come on, one by one. Nobody is in a hurry to go home.',
    'You have walked a long way, and it has all led here, to a table with a pie on it.',
  ],
} as const;
