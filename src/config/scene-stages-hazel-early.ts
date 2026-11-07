import type { SceneStage } from './story';

/** Chapters 1 to 9 of Hazel's Grove, scene by scene (split from scene-stages-hazel.ts). */
export const HAZEL_RAW_EARLY: Readonly<Record<string, SceneStage>> = {
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
};
