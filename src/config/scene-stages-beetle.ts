import { chapterStages } from './scene-stages-kit';
import type { SceneStage, StageCast } from './story';

/**
 * The Beetle Road: the guard house on the lane in, torch-lit at night to open, then
 * the long road down. The floors below (chapters 3, 4, 6, 7 and the last door of 8) are the
 * `below` place, drawn alone (`exclusive`), at a fixed hour with every post lit; the
 * chapters at the guard house keep their own hours. Every opening, closing, beat and
 * ending is staged (campaign graphics 2, H2 and N2). Grist stands at the guard house bench,
 * Vane by the cart; the banners show from chapter 1 and the cart is shut until chapter 5.
 */
const LIT: SceneStage['lights'] = {
  'lantern-1': 'lit',
  'lantern-2': 'lit',
  'lantern-3': 'lit',
  'lantern-4': 'lit',
};

/** The torches of the floors below: drawn alone, every post lit, the below grade, one hour. */
const BELOW = {
  place: 'below',
  exclusive: true,
  grade: 'beetle-below',
  hour: 21,
  lights: LIT,
} as const;
const RAIN = { weather: 'rain' } as const;

const hob = (mark = 'guardhouse-bench', o: Partial<StageCast> = {}): StageCast => ({
  who: 'b-hob',
  mark,
  face: 'you',
  ...o,
});
const vane = (mark = 'cart', o: Partial<StageCast> = {}): StageCast => ({
  who: 'b-vane',
  mark,
  face: 'you',
  ...o,
});
/** The guard house by lamplight, drawn alone (K10): the counter, the banners. */
const INSIDE = { place: 'inside-guardhouse', exclusive: true } as const;
const COUNTER = 'in-guardhouse-counter';
/** Grist on his stool behind the counter. */
const SAT = { pose: 'sit' } as const;
/** Indoors the camera keeps to the room's open side, the south-east (K10). */
const ROOM_YAW = 0.45;
const NOTEBOOK = { carry: 'notebook' } as const;
const SHUT = { banners: 'show', cart: 'shut' } as const;
const OPEN = { banners: 'show', cart: 'open' } as const;

/** The endings: the guard yard after the last door, Grist at his bench (N2). */
const YARD_CLEAR: SceneStage = {
  grave: true,
  place: 'guardhouse',
  hour: 10,
  weather: 'wind',
  props: OPEN,
  cast: [hob('guardhouse-bench')],
  shot: { kind: 'wide', focus: ['guardhouse', 'cart', 'banner-3'] },
};
const YARD_RAIN: SceneStage = { ...YARD_CLEAR, hour: 17, weather: 'rain' };
const VANE_UP = vane('cart', { pose: 'sit', ...NOTEBOOK });
const VANE_UP_RAIN = vane('cart', NOTEBOOK);

export const BEETLE_STAGES: Readonly<Record<string, SceneStage>> = {
  ...chapterStages('b', [
    // 1 The Guard: night at the guard house, the three banners.
    [
      {
        ...INSIDE,
        hour: 22.5,
        // "Behind the counter sits a man": Grist at his counter, the banners on the wall.
        cast: [hob(COUNTER, SAT)],
        shot: { kind: 'establish', yaw: ROOM_YAW },
      },
      { ...INSIDE, hour: 22.5, cast: [hob(COUNTER, SAT)], shot: { kind: 'two', yaw: ROOM_YAW } },
    ],
    // 2 The Beetle: the cart under its tarp; home with the cargo.
    [
      { place: 'guardhouse', hour: 9.5, cast: [hob('cart')], shot: { kind: 'wide' } },
      { place: 'guardhouse', hour: 17.5, cast: [hob()], shot: { kind: 'two' } },
    ],
    // 3 The First Domain.
    [
      { ...BELOW, cast: [hob('floor-up')], shot: { kind: 'wide' } },
      { ...BELOW, cast: [hob('floor-up')], shot: { kind: 'two' } },
    ],
    // 4 The Door's Opinion.
    [
      { ...BELOW, cast: [hob('floor-up')], shot: { kind: 'two' } },
      { ...BELOW, cast: [hob('floor-up')], shot: { kind: 'wide' } },
    ],
    // 5 Two Into One: Vane on the bonnet.
    [
      {
        place: 'guardhouse',
        hour: 16,
        cast: [vane('cart', { pose: 'sit', ...NOTEBOOK })],
        shot: { kind: 'two', focus: ['b-vane'] },
      },
      { place: 'guardhouse', hour: 18.5, cast: [vane('cart', NOTEBOOK)], shot: { kind: 'close' } },
    ],
    // 6 The Second Domain: the floor that rains.
    [
      { ...BELOW, cast: [hob('floor-up'), vane('banner-1')], shot: { kind: 'wide' } },
      { ...BELOW, ...RAIN, cast: [hob('floor-up'), vane('banner-1')], shot: { kind: 'wide' } },
    ],
    // 7 The Weather Machine.
    [
      { ...BELOW, ...RAIN, cast: [hob('floor-up'), vane('banner-1')], shot: { kind: 'wide' } },
      { ...BELOW, ...RAIN, cast: [vane('floor-up')], shot: { kind: 'two' } },
    ],
    // 8 The Road Home: the last door, then the road driven end to end.
    [
      { ...BELOW, cast: [hob('floor-up')], shot: { kind: 'wide' } },
      {
        place: 'guardhouse',
        hour: 19,
        lights: LIT,
        cast: [vane('cart')],
        shot: { kind: 'establish' },
      },
    ],
  ]),
  // ---- beats ------------------------------------------------------------------------------
  // 1: the banners, the ledger
  'b-c1-banners': {
    place: 'guardhouse',
    hour: 22.5,
    lights: LIT,
    props: { banners: 'show' },
    cast: [hob()],
    shot: { kind: 'wide', focus: ['banner-1', 'banner-2', 'banner-3'] },
  },
  // Grist writes in his ledger behind the counter (indoors, K10).
  'b-c1-ledger': {
    ...INSIDE,
    hour: 9,
    cast: [hob(COUNTER, { ...NOTEBOOK, ...SAT })],
    shot: { kind: 'two', yaw: ROOM_YAW },
  },
  // 2: the Beetle under its tarp; the first errand
  'b-c2-tarp': {
    place: 'guardhouse',
    hour: 10,
    props: SHUT,
    cast: [hob('cart')],
    shot: { kind: 'two', focus: ['cart'] },
  },
  // "Write it in the book": the ledger on the counter (indoors, K10).
  'b-c2-errand': {
    ...INSIDE,
    hour: 17.5,
    cast: [hob(COUNTER, { ...NOTEBOOK, ...SAT })],
    shot: { kind: 'two', yaw: ROOM_YAW },
  },
  // 3: the first domain's stair and torches; back up at dusk
  'b-c3-stair': { ...BELOW, cast: [hob('floor-up')], shot: { kind: 'wide' } },
  'b-c3-back-up': {
    place: 'guardhouse',
    hour: 17,
    props: SHUT,
    cast: [hob()],
    shot: { kind: 'two' },
  },
  'b-c3-torches': { ...BELOW, shot: { kind: 'close' } },
  // 4: training in the yard; the errands
  'b-c4-wait': { place: 'guardhouse', hour: 9, props: SHUT, shot: { kind: 'wide' } },
  'b-c4-errands': {
    place: 'guardhouse',
    hour: 12,
    props: SHUT,
    cast: [hob('guardhouse-bench', NOTEBOOK)],
    shot: { kind: 'two' },
  },
  // 5: Vane, the fusion, the notebook; the cart stands open
  'b-c5-fused': {
    place: 'guardhouse',
    hour: 17.5,
    props: OPEN,
    cast: [vane('cart', NOTEBOOK)],
    shot: { kind: 'two', focus: ['b-vane'] },
  },
  'b-c5-refused': {
    place: 'guardhouse',
    hour: 17.5,
    props: OPEN,
    cast: [vane('cart', NOTEBOOK)],
    shot: { kind: 'two', focus: ['b-vane'] },
  },
  'b-c5-two': {
    place: 'guardhouse',
    hour: 17.5,
    props: OPEN,
    cast: [vane('cart', NOTEBOOK)],
    shot: { kind: 'wide' },
  },
  'b-c5-notebook': {
    place: 'guardhouse',
    hour: 17,
    props: OPEN,
    cast: [vane('cart', NOTEBOOK), hob()],
    shot: { kind: 'two' },
  },
  // 6: the rain floors
  'b-c6-second-run': { ...BELOW, ...RAIN, cast: [hob('floor-up')], shot: { kind: 'wide' } },
  'b-c6-third-floor': { ...BELOW, shot: { kind: 'wide' } },
  'b-c6-torch': { ...BELOW, shot: { kind: 'close' } },
  // 8: the last door
  'b-c8-dry': { ...BELOW, cast: [vane('floor-up')], shot: { kind: 'wide' } },
  'b-c8-wet': {
    ...BELOW,
    ...RAIN,
    cast: [vane('banner-1'), hob('floor-up')],
    shot: { kind: 'wide' },
  },
  'b-c8-one': { ...BELOW, shot: { kind: 'two' } },
  'b-c8-two': { ...BELOW, cast: [vane('floor-up')], shot: { kind: 'two' } },
  // ---- endings: up the guard stairs, the whole yard in the last wide shot (N2) -----------
  // The title cards leave Ottoline out (she may be on the fourth floor); each ending's body
  // (`b-end-<ending>-<stayed|left>`, SR-20261023-412) has her by the cart only if she came up.
  'end-beetle-open-sky': YARD_CLEAR,
  'b-end-open-sky-stayed': { ...YARD_CLEAR, cast: [hob('guardhouse-bench'), VANE_UP] },
  'b-end-open-sky-left': YARD_CLEAR,
  'end-beetle-two-as-one': YARD_CLEAR,
  'b-end-two-as-one-stayed': { ...YARD_CLEAR, cast: [hob('guardhouse-bench'), VANE_UP] },
  'b-end-two-as-one-left': YARD_CLEAR,
  'end-beetle-steady-rain': YARD_RAIN,
  'b-end-steady-rain-stayed': { ...YARD_RAIN, cast: [hob('guardhouse-bench'), VANE_UP_RAIN] },
  'b-end-steady-rain-left': YARD_RAIN,
  'b-end-steady-rain-stayed-fused': {
    ...YARD_RAIN,
    cast: [hob('guardhouse-bench'), VANE_UP_RAIN],
  },
  'b-end-steady-rain-left-fused': YARD_RAIN,
};
