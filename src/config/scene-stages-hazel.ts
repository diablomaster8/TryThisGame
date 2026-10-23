import type { SceneStage, StageCast } from './story';

/**
 * Hazel's Grove, scene by scene (campaign graphics C1). Chapters 1 to 12, in order. Every
 * `fx` and `props` name here is one a dressing reads; marks are in stage-marks.ts. Where
 * tuning-e's `E_STAGES` already seats a scene's cast or lights (c4-open, c4-close,
 * c10-vigil, c11-moss-*, c12-walk-*), the entry here leaves that field out, because a
 * field set here replaces the one under it.
 */
const ALL_LIT: SceneStage['lights'] = {
  'lantern-1': 'lit',
  'lantern-2': 'lit',
  'lantern-3': 'lit',
  'lantern-4': 'lit',
};
const DRY_FALLS: SceneStage = {
  place: 'falls',
  hour: 3.5,
  weather: 'frost',
  fx: ['fallsStill'],
  shot: { kind: 'wide' },
};
const WARM_WATER: SceneStage = {
  place: 'ledge',
  hour: 4.5,
  weather: 'frost',
  fx: ['goldWater', 'stoneGlow'],
  shot: { kind: 'two' },
};

/** The ten valley Keepers on the festival ring (marks 1..10), facing the picnic. */
const FRIENDS = [
  'fern',
  'marina',
  'sparks',
  'clover',
  'pixel',
  'luna',
  'ember',
  'byte',
  'dusty',
  'nova',
];
const RING: StageCast[] = FRIENDS.map((who, i) => ({ who, mark: `festival-${i + 1}` }));
/** Corvin and Sable come in on the ring's last two marks. */
const RING_GUESTS: StageCast[] = [
  { who: 'corvin', mark: 'festival-11' },
  { who: 'sable', mark: 'festival-12' },
];
/** The ring as c12-open has it: two arrivals, late to it (K5), walk on from the step and the gate. */
const LATE_FROM: Readonly<Record<string, string>> = { ember: 'step', dusty: 'gate-inside' };
const RING_LATE: StageCast[] = RING.map((c) => {
  const from = LATE_FROM[c.who];
  return from ? { ...c, from } : c;
});
const RING_FOCUS = ['festival-1', 'festival-4', 'festival-7', 'festival-10'];

const RAW: Readonly<Record<string, SceneStage>> = {
  // ---------------------------------------------------------------- 1 The Letter
  'c1-letter': {
    place: 'gate',
    hour: 15.5,
    season: 'spring',
    props: { gate: 'shut', signpost: 'show' },
    // Fern comes up from next door and speaks at the gate: she must be in the frame with you.
    cast: [{ who: 'fern', mark: 'gate-inside', face: 'you' }],
    shot: { kind: 'establish' },
  },
  'c1-close': {
    place: 'step',
    hour: 9,
    season: 'spring',
    cast: [
      { who: 'sparks', mark: 'step', face: 'you' },
      { who: 'fern', mark: 'porch', face: 'you' },
    ],
    shot: { kind: 'close' },
  },
  // ---------------------------------------------------------------- 2 Shells and Promises
  'c2-open': {
    place: 'gate',
    hour: 7.5,
    season: 'spring',
    cast: [{ who: 'marina', mark: 'gate-outside', face: 'you', carry: 'bucket' }],
    shot: { kind: 'two' },
  },
  // Late afternoon: a man in a grey coat who waits for the gate to be opened for him.
  'c2-corvin': {
    place: 'gate',
    hour: 17,
    season: 'spring',
    props: { gate: 'shut' },
    cast: [{ who: 'corvin', mark: 'gate-outside', face: 'you', from: 'lane-west' }],
    shot: { kind: 'two', focus: ['corvin'] },
  },
  // ---------------------------------------------------------------- 3 The One Who Hides
  'c3-open': {
    place: 'step',
    hour: 22.5,
    props: { 'step-teacup': 'show', porch: 'lit' },
    fx: ['fireflies'],
    cast: [{ who: 'luna', mark: 'porch', face: 'you', pose: 'sit' }],
    shot: { kind: 'two' },
  },
  'c3-close': {
    place: 'pond',
    hour: 18.5,
    cast: [
      { who: 'clover', mark: 'pond-lantern', face: 'luna' },
      { who: 'luna', mark: 'grass-lantern', face: 'clover', pose: 'sit' },
    ],
    shot: { kind: 'two' },
  },
  // ---------------------------------------------------------------- 4 Moss Remembers
  // c4-close's lanterns come from E_STAGES; c4-open seats Moss itself.
  'c4-open': {
    place: 'hill',
    hour: 10,
    cast: [
      { who: 'moss', mark: 'flat-stone', pose: 'sit' },
      // "You sit down next to him, because that is the rule."
      { who: 'you', mark: 'flat-stone-beside', face: 'moss', pose: 'sit' },
    ],
    // From in front of the pair, a little to the south: the side two-shot sat in tall grass.
    shot: { kind: 'two', focus: ['moss', 'you'], yaw: -1.0 },
  },
  'c4-close': { place: 'pond', hour: 19.2, shot: { kind: 'wide' } },
  'c4-tale': {
    tale: true,
    place: 'pond',
    hour: 22.5,
    lights: { 'lantern-3': 'lit' },
    cast: [{ who: 'moss', mark: 'pond-lantern', pose: 'sit' }],
    shot: { kind: 'close', focus: ['moss'] },
  },
  'c4-tale-2': {
    tale: true,
    place: 'pond',
    hour: 22.5,
    lights: { 'lantern-3': 'lit' },
    cast: [{ who: 'moss', mark: 'pond-lantern', pose: 'sit' }],
    shot: { kind: 'close', focus: ['moss'] },
  },
  'c4-tale-3': {
    tale: true,
    place: 'pond',
    hour: 23.5,
    lights: { 'lantern-3': 'lit', 'lantern-4': 'flicker' },
    // Young Hazel sits beside him on the jetty ("I sat beside her a whole winter").
    cast: [
      { who: 'moss', mark: 'pond-lantern', pose: 'sit' },
      { who: 'hazel', mark: 'shore-jetty', face: 'moss', pose: 'sit' },
    ],
    shot: { kind: 'two', focus: ['moss'] },
  },
  'c4-out': {
    place: 'pond',
    hour: 5.5,
    weather: 'wind',
    lights: { 'lantern-3': 'lit', 'lantern-4': 'flicker' },
    cast: [{ who: 'moss', mark: 'pond-lantern', pose: 'sit' }],
    shot: { kind: 'two', focus: ['moss'] },
  },
  // ---------------------------------------------------------------- 5 The Circuit
  'c5-open': {
    place: 'gate',
    hour: 10,
    season: 'summer',
    cast: [{ who: 'ember', mark: 'gate', face: 'you' }],
    shot: { kind: 'two' },
  },
  // ---------------------------------------------------------------- 6 Rain on the Hill
  'c6-open': {
    place: 'hill',
    hour: 15,
    season: 'summer',
    weather: 'rain',
    cast: [{ who: 'dusty', mark: 'hill-top', face: 'you', pose: 'sit' }],
    shot: { kind: 'wide' },
  },
  'c6-open-walked': {
    place: 'hill',
    hour: 15,
    season: 'summer',
    weather: 'rain',
    cast: [{ who: 'dusty', mark: 'hill-top', face: 'you', pose: 'sit' }],
    shot: { kind: 'wide' },
  },
  'c6-close': {
    place: 'hill',
    hour: 17,
    season: 'summer',
    weather: 'rain',
    cast: [{ who: 'dusty', mark: 'briar', face: 'you', pose: 'sit' }],
    shot: { kind: 'two', focus: ['dusty'] },
  },
  // ---------------------------------------------------------------- 7 What Fear Teaches
  'c7-open': { place: 'grove', hour: 5.6, weather: 'frost', shot: { kind: 'two' } },
  'c7-stillness': {
    place: 'grove',
    hour: 7.2,
    weather: 'frost',
    cast: [{ who: 'moss', mark: 'grass-lantern', face: 'you' }],
    shot: { kind: 'two', focus: ['moss'] },
  },
  'c7-stillness-2': {
    place: 'grove',
    hour: 7.4,
    weather: 'frost',
    cast: [{ who: 'moss', mark: 'grass-lantern', face: 'you' }],
    shot: { kind: 'close', focus: ['moss'] },
  },
  'c7-stillness-3': { place: 'grove', hour: 8.6, weather: 'frost', shot: { kind: 'wide' } },
  'c7-close': { place: 'grove', hour: 15, weather: 'frost', shot: { kind: 'two' } },
  // ---------------------------------------------------------------- 8 The Hollow
  'c8-open': {
    place: 'gate',
    hour: 6.6,
    season: 'autumn',
    cast: [{ who: 'nova', mark: 'gate', face: 'you' }],
    shot: { kind: 'two' },
  },
  // c8-ledge and c8-ledge-s4 play in the Hollow: no sky, so no hour.
  'c8-ledge': {
    place: 'hollow',
    season: 'autumn',
    cast: [{ who: 'fern', mark: 'hollow-camp', face: 'you', carry: 'bag' }],
    shot: { kind: 'two' },
  },
  'c8-ledge-s4': {
    place: 'hollow',
    season: 'autumn',
    cast: [{ who: 'fern', mark: 'hollow-camp', face: 'you', carry: 'bag' }],
    shot: { kind: 'two' },
  },
  // The Hollow has no sky, so no hour: the camp, a cold fire, grey shapes in the trees.
  'c8-close': {
    place: 'hollow',
    season: 'autumn',
    cast: [{ who: 'nova', mark: 'hollow-camp', face: 'you' }],
    shot: { kind: 'wide' },
  },
  'c8-nova': {
    place: 'falls',
    hour: 20.5,
    season: 'autumn',
    fx: ['fireflies'],
    cast: [{ who: 'nova', mark: 'falls-foot', face: 'you' }],
    shot: { kind: 'two' },
  },
  // ---------------------------------------------------------------- 9 Corvin's Garden
  'c9-partner': {
    place: 'step',
    hour: 21.5,
    season: 'winter',
    weather: 'frost',
    props: { porch: 'lit' },
    shot: { kind: 'close' },
  },
  'c9-open': {
    place: 'corvin',
    hour: 10,
    season: 'winter',
    weather: 'frost',
    cast: [
      { who: 'ember', mark: 'corvin-gate', face: 'corvin' },
      { who: 'corvin', mark: 'pen-3', face: 'you' },
    ],
    shot: { kind: 'establish' },
  },
  'c9-open-sold': {
    place: 'corvin',
    hour: 10,
    season: 'winter',
    weather: 'frost',
    cast: [
      { who: 'ember', mark: 'corvin-gate', face: 'corvin' },
      { who: 'corvin', mark: 'pen-3', face: 'you' },
    ],
    shot: { kind: 'establish' },
  },
  'c9-shard-reconciled': {
    place: 'corvin',
    hour: 12,
    season: 'winter',
    weather: 'frost',
    cast: [{ who: 'corvin', mark: 'corvin-gate', face: 'you' }],
    shot: { kind: 'close', focus: ['corvin'] },
  },
  'c9-shard-bargained': {
    place: 'corvin',
    hour: 12,
    season: 'winter',
    weather: 'frost',
    cast: [
      { who: 'corvin', mark: 'corvin-gate', face: 'you' },
      { who: 'ember', mark: 'pen-3', face: 'corvin' },
    ],
    shot: { kind: 'two', focus: ['corvin'] },
  },
  'c9-shard-forced': {
    place: 'corvin',
    hour: 12,
    season: 'winter',
    weather: 'frost',
    cast: [
      { who: 'corvin', mark: 'pen-2', face: 'you', pose: 'kneel' },
      { who: 'ember', mark: 'pen-3', face: 'corvin' },
    ],
    shot: { kind: 'two', focus: ['corvin'] },
  },
  'c9-shard-collector': {
    place: 'corvin',
    hour: 12,
    season: 'winter',
    weather: 'frost',
    cast: [{ who: 'corvin', mark: 'pen-2', face: 'you' }],
    shot: { kind: 'two', focus: ['corvin'] },
  },
  'c9-sable': {
    place: 'gate',
    hour: 16,
    season: 'winter',
    weather: 'frost',
    shot: { kind: 'two' },
  },
  'c9-close': {
    place: 'step',
    hour: 18.5,
    season: 'winter',
    weather: 'frost',
    props: { 'step-pie': 'show', porch: 'lit' },
    cast: [{ who: 'marina', mark: 'porch', face: 'you' }],
    shot: { kind: 'close' },
  },
  // ---------------------------------------------------------------- 10 The Long Night
  // c10-vigil's lanterns and cast come from E_STAGES; the sim's vigil waves drive the rest.
  // The pond's new ice is the second line's subject, so the wide shot fits the pond too.
  'c10-open': {
    place: 'hill',
    hour: 22.5,
    weather: 'frost',
    shot: { kind: 'wide', focus: ['you', 'pond-centre'], then: 'wide' },
  },
  'c10-sable-watch': {
    place: 'grove',
    hour: 15.5,
    weather: 'frost',
    cast: [{ who: 'luna', mark: 'grass-lantern', face: 'you', pose: 'sit' }],
    shot: { kind: 'two' },
  },
  'c10-vigil': { place: 'grove', hour: 23, weather: 'frost', shot: { kind: 'wide' } },
  'c10-vigil-wisp': { place: 'grove', hour: 23.5, weather: 'frost', shot: { kind: 'wide' } },
  'c10-lull': { place: 'grove', hour: 2.5, weather: 'frost', shot: { kind: 'wide' } },
  // The falls stop; the ledge behind them; the stone; the warm water.
  'c10-falls': {
    grave: true,
    ...DRY_FALLS,
    cast: [{ who: 'marina', mark: 'falls-foot', face: 'you', carry: 'lantern' }],
  },
  'c10-bearer-sable': DRY_FALLS,
  'c10-bearer-moss': DRY_FALLS,
  'c10-ledge': {
    place: 'ledge',
    hour: 4,
    weather: 'frost',
    fx: ['fallsStill', 'stoneGlow'],
    cast: [{ who: 'marina', mark: 'ledge', face: 'you', carry: 'lantern' }],
    shot: { kind: 'two', focus: ['marina'] },
  },
  'c10-edge': {
    place: 'ledge',
    hour: 4.3,
    weather: 'frost',
    fx: ['fallsStill', 'stoneGlow'],
    shot: { kind: 'close' },
  },
  // The falls run again and a rim of frost stays; the stone is in a pocket.
  'c10-kept': { place: 'ledge', hour: 4.6, weather: 'frost', shot: { kind: 'two' } },
  'c10-safe-sable': WARM_WATER,
  'c10-safe-moss': WARM_WATER,
  'c10-wisp': WARM_WATER,
  'c10-moss-walks': WARM_WATER,
  'c10-moss-walks-bearer': WARM_WATER,
  'c10-bank-wisp': { ...WARM_WATER, fx: ['goldWater'] },
  'c10-bank-moss-returned': {
    ...WARM_WATER,
    fx: ['goldWater'],
    cast: [{ who: 'marina', mark: 'ledge', face: 'you' }],
  },
  'c10-bank-moss-gone': {
    ...WARM_WATER,
    fx: ['goldWater'],
    cast: [{ who: 'marina', mark: 'ledge', face: 'you' }],
  },
  'c10-dawn': {
    place: 'falls',
    hour: 7.2,
    weather: 'frost',
    fx: ['breath'],
    shot: { kind: 'establish' },
  },
  'c10-moss-stays': {
    place: 'hill',
    hour: 8,
    weather: 'frost',
    cast: [{ who: 'moss', mark: 'hill-path', pose: 'sit' }],
    shot: { kind: 'two', focus: ['moss'] },
  },
  'c10-moss-fades': {
    grave: true,
    place: 'hill',
    hour: 8,
    weather: 'frost',
    cast: [{ who: 'moss', mark: 'hill-path' }],
    shot: { kind: 'close', focus: ['moss'] },
  },
  'c10-moss-mourned': {
    grave: true,
    place: 'gate',
    hour: 8.3,
    weather: 'frost',
    shot: { kind: 'two' },
  },
  'c10-moss-light': {
    place: 'hill',
    hour: 8.2,
    weather: 'frost',
    fx: ['seed'],
    shot: { kind: 'two' },
  },
  'c10-close': {
    place: 'hill',
    hour: 9,
    weather: 'frost',
    cast: [{ who: 'hazel', mark: 'hill-path', face: 'you', carry: 'lantern' }],
    shot: { kind: 'wide', focus: ['hazel'] },
  },
  'c10-bramble': { place: 'grove', hour: 9.5, weather: 'frost', shot: { kind: 'close' } },
  // ---------------------------------------------------------------- 11 Hazel
  'c11-open': {
    grave: true,
    place: 'gate',
    hour: 10.5,
    season: 'winter',
    // She walks back in through the gate.
    cast: [{ who: 'hazel', mark: 'gate', face: 'you', from: 'lane-south' }],
    shot: { kind: 'two', then: 'close', focus: ['hazel'] },
  },
  // c11-moss-here and c11-moss-kept: Moss's seat comes from E_STAGES.
  'c11-moss-here': { place: 'pond', hour: 11, shot: { kind: 'close', focus: ['moss'] } },
  'c11-moss-kept': { place: 'hill', hour: 11, shot: { kind: 'close', focus: ['hazel'] } },
  'c11-moss-gone': {
    grave: true,
    place: 'hill',
    hour: 11,
    cast: [{ who: 'hazel', mark: 'hill-path', face: 'you' }],
    shot: { kind: 'close', focus: ['hazel'] },
  },
  'c11-moss-passed': {
    grave: true,
    place: 'hill',
    hour: 11,
    cast: [{ who: 'hazel', mark: 'hill-path', face: 'you' }],
    shot: { kind: 'close', focus: ['hazel'] },
  },
  'c11-sable': {
    place: 'pond',
    hour: 13,
    cast: [{ who: 'hazel', mark: 'pond-lantern', face: 'you', pose: 'sit' }],
    shot: { kind: 'two', focus: ['hazel'] },
  },
  'c11-cold-hands': {
    place: 'pond',
    hour: 14,
    cast: [{ who: 'hazel', mark: 'pond-lantern', face: 'you', pose: 'sit' }],
    shot: { kind: 'close', focus: ['hazel'] },
  },
  'c11-close': {
    place: 'pond',
    hour: 18.5,
    cast: [
      { who: 'hazel', mark: 'pond-lantern', face: 'you', pose: 'sit' },
      { who: 'ember', mark: 'stream-lantern', face: 'hazel' },
    ],
    shot: { kind: 'two', focus: ['hazel'] },
  },
  'c11-gate': {
    place: 'gate',
    hour: 16,
    props: { gate: 'shut', pondIce: 'show' },
    cast: [
      { who: 'corvin', mark: 'gate-outside', face: 'you', from: 'lane-west' },
      { who: 'hazel', mark: 'pond-lantern', face: 'corvin', pose: 'sit' },
    ],
    shot: { kind: 'two', focus: ['corvin'] },
  },
  // ---------------------------------------------------------------- 12 Keepers
  // Every Keeper is here: the ring with Hazel among them; Ember and Dusty come late.
  'c12-open': {
    place: 'festival',
    hour: 9.5,
    season: 'winter',
    cast: [...RING_LATE, { who: 'hazel', mark: 'festival-11' }],
    shot: { kind: 'establish' },
  },
  'c12-foot-told': {
    place: 'grove',
    hour: 11.5,
    cast: [{ who: 'hazel', mark: 'step', face: 'you' }],
    shot: { kind: 'two', focus: ['hazel'] },
  },
  'c12-foot-secret': {
    place: 'grove',
    hour: 11.5,
    cast: [{ who: 'hazel', mark: 'step', face: 'you' }],
    shot: { kind: 'two', focus: ['hazel'] },
  },
  // The walk up: Hazel's lantern and Moss's seat come from E_STAGES.
  'c12-walk-you': { place: 'hill', hour: 17.8, shot: { kind: 'wide' } },
  'c12-walk-moss': { place: 'hill', hour: 17.8, shot: { kind: 'two', focus: ['moss', 'hazel'] } },
  'c12-walk-sable': { place: 'hill', hour: 17.8, shot: { kind: 'wide' } },
  'c12-walk-corvin': { place: 'hill', hour: 17.8, shot: { kind: 'wide' } },
  'c12-walk-alone': { place: 'hill', hour: 17.8, shot: { kind: 'wide' } },
  'c12-close': { place: 'grove', hour: 19.2, lights: ALL_LIT, shot: { kind: 'wide' } },
  // ---------------------------------------------------------------- the eight endings (N2)
  // Each ending's first scene is its last wide shot, with the people it is about on the
  // festival ring (round the picnic) or on the mark its text names, and its props. The
  // `-last`, `-moss`, `-sold` and `-kept` scenes that follow keep the place and the hour.
  // Hazel's Grove: the whole valley round the picnic at dusk, the gate that sticks.
  'end-hazels-grove': {
    place: 'festival',
    hour: 18.8,
    lights: ALL_LIT,
    props: { gate: 'shut' },
    cast: [...RING, ...RING_GUESTS],
    shot: { kind: 'wide', focus: RING_FOCUS },
  },
  // The open variant: the gate is gone and the lamps are lit along the lane.
  'end-hazels-grove-open': {
    place: 'festival',
    hour: 18.8,
    lights: ALL_LIT,
    props: { gate: 'open' },
    cast: [...RING, ...RING_GUESTS],
    shot: { kind: 'wide', focus: RING_FOCUS },
  },
  // By the pond, in the place nobody says anything.
  'end-hazels-grove-last': {
    grave: true,
    place: 'pond',
    hour: 19.5,
    lights: ALL_LIT,
    cast: [{ who: 'hazel', mark: 'pond-lantern', face: 'you', pose: 'sit' }],
    shot: { kind: 'wide', focus: ['hazel'] },
  },
  // Eternal Dawn: first light, the whole valley round the ring, an Eternal among them.
  'end-eternal-dawn': {
    place: 'festival',
    hour: 6.3,
    cast: [...RING],
    shot: { kind: 'wide', focus: RING_FOCUS },
  },
  'end-eternal-dawn-moss': {
    place: 'hill',
    hour: 6.5,
    cast: [{ who: 'moss', mark: 'hill-top', pose: 'sit' }],
    shot: { kind: 'two', focus: ['moss'] },
  },
  'end-eternal-dawn-nomoss': {
    place: 'hill',
    hour: 6.5,
    shot: { kind: 'wide', focus: ['moss'] },
  },
  'end-eternal-dawn-last': {
    grave: true,
    place: 'festival',
    hour: 19.5,
    lights: ALL_LIT,
    cast: [...RING],
    shot: { kind: 'wide', focus: RING_FOCUS },
  },
  // The Shadow's Keeper: the gate open, Clover with her bag of fruit, Sable and Luna by it.
  'end-shadow-keeper': {
    place: 'gate',
    hour: 8.5,
    props: { gate: 'open' },
    cast: [
      { who: 'clover', mark: 'gate-outside', face: 'you', carry: 'bag' },
      { who: 'sable', mark: 'gate', face: 'you' },
      { who: 'luna', mark: 'signpost', face: 'you' },
    ],
    shot: { kind: 'wide', focus: ['gate', 'gate-outside'] },
  },
  'end-shadow-keeper-last': {
    grave: true,
    place: 'gate',
    hour: 8.5,
    props: { gate: 'open' },
    cast: [
      { who: 'clover', mark: 'gate-outside', face: 'you', carry: 'bag' },
      { who: 'sable', mark: 'gate', face: 'you' },
    ],
    shot: { kind: 'two', focus: ['clover'] },
  },
  // Moss Sleeps: spring on the hill, his flower open by the flat stone.
  'end-moss-sleeps': {
    place: 'hill',
    hour: 7,
    season: 'spring',
    cast: [
      { who: 'luna', mark: 'flat-stone', face: 'you', pose: 'kneel' },
      { who: 'clover', mark: 'hill-path', face: 'luna' },
      { who: 'byte', mark: 'briar', face: 'luna' },
    ],
    shot: { kind: 'wide', focus: ['flat-stone', 'hill-path'] },
  },
  'end-moss-sleeps-last': {
    grave: true,
    place: 'hill',
    hour: 7,
    season: 'spring',
    cast: [{ who: 'luna', mark: 'flat-stone', face: 'you', pose: 'kneel' }],
    shot: { kind: 'two', focus: ['luna'] },
  },
  // Wild Grove: no gate, the Grove open to the wood, Nova at the lane.
  'end-wild-grove': {
    place: 'grove',
    hour: 15,
    props: { gate: 'open' },
    cast: [{ who: 'nova', mark: 'gate-outside', face: 'you' }],
    shot: { kind: 'wide', focus: ['gate', 'falls-foot'] },
  },
  'end-wild-grove-last': {
    grave: true,
    place: 'grove',
    hour: 15,
    props: { gate: 'open' },
    cast: [{ who: 'nova', mark: 'gate-outside', face: 'you' }],
    shot: { kind: 'two', focus: ['nova'] },
  },
  // The Empty Lantern: night, the long grass, Luna with the bag of fruit, one lantern lit.
  'end-empty-lantern': {
    place: 'grove',
    hour: 22.5,
    lights: { 'lantern-4': 'lit' },
    cast: [{ who: 'luna', mark: 'grass-lantern', face: 'you', carry: 'bag' }],
    shot: { kind: 'wide', focus: ['grass-lantern', 'step'] },
  },
  'end-empty-lantern-last': {
    grave: true,
    place: 'grove',
    hour: 22.5,
    lights: { 'lantern-4': 'lit' },
    cast: [{ who: 'hazel', mark: 'pond-lantern', face: 'you', pose: 'sit' }],
    shot: { kind: 'wide', focus: ['pond-lantern', 'grass-lantern'] },
  },
  // The Collector: the gate that opens by itself, the pens, the quiet.
  'end-collector': {
    place: 'gate',
    hour: 17,
    props: { gate: 'open' },
    shot: { kind: 'wide', focus: ['gate'] },
  },
  'end-collector-sold': {
    place: 'corvin',
    hour: 17,
    cast: [{ who: 'corvin', mark: 'corvin-door', face: 'you' }],
    shot: { kind: 'wide', focus: ['corvin'] },
  },
  'end-collector-kept': {
    place: 'grove',
    hour: 14,
    cast: [{ who: 'corvin', mark: 'gate-outside', face: 'you', from: 'lane-west' }],
    shot: { kind: 'wide', focus: ['corvin'] },
  },
  'end-collector-last': {
    grave: true,
    place: 'gate',
    hour: 17.5,
    props: { gate: 'open' },
    shot: { kind: 'wide', focus: ['gate'] },
  },
  // The Long Road: Sable two steps off the cottage step, Clover on it, dusk.
  'end-long-road': {
    place: 'step',
    hour: 17.5,
    cast: [
      { who: 'sable', mark: 'porch', face: 'you' },
      { who: 'clover', mark: 'step', face: 'you' },
    ],
    shot: { kind: 'wide', focus: ['step', 'porch'] },
  },
  'end-long-road-last': {
    grave: true,
    place: 'step',
    hour: 17.5,
    cast: [
      { who: 'sable', mark: 'porch', face: 'you' },
      { who: 'clover', mark: 'step', face: 'you' },
    ],
    shot: { kind: 'two', focus: ['clover'] },
  },
};

/** The season and weather each chapter holds, unless a scene sets its own. */
const LOOK: Record<number, Pick<SceneStage, 'season' | 'weather'>> = {
  1: { season: 'spring' },
  5: { season: 'summer' },
  6: { weather: 'rain' },
  7: { weather: 'frost' },
  8: { season: 'autumn' },
  9: { season: 'winter', weather: 'frost' },
  10: { season: 'winter', weather: 'frost' },
  11: { season: 'winter', weather: 'frost' },
};

export const HAZEL_STAGES: Readonly<Record<string, SceneStage>> = Object.fromEntries(
  Object.entries(RAW).map(([id, st]) => {
    const n = Number(/^c(\d+)-/.exec(id)?.[1]);
    const look = id === 'c12-open' ? { weather: 'clear' as const } : LOOK[n];
    return [id, { ...look, ...st }];
  }),
);
