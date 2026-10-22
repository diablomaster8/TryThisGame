import { chapterStages } from './scene-stages-kit';
import type { SceneStage, StageCast } from './story';

/**
 * The Hundred Days: ten chapters, each opened and closed in the Fold. Chapter 8's mill
 * and chapter 7's mire are drawn at the `corvin` location (the sim's `onArea`), so their
 * scenes carry that place; chapter 9's Hush scenes leave `lights` to the Hush's own ring.
 * Every opening, closing, beat and ending is staged (campaign graphics 2, H2 and N2): the
 * hour follows the chapter's own opening and closing, and Ida and Sorrel stand on the
 * Fold's marks (`fold-door-1` is the one whole step, `fold-well` the well lip).
 * Chapters 9 and 10 are winter (the Hush and the last morning).
 */
const LIT: SceneStage['lights'] = {
  'lantern-1': 'lit',
  'lantern-2': 'lit',
  'lantern-3': 'lit',
  'lantern-4': 'lit',
};

const ida = (mark: string, o: Partial<StageCast> = {}): StageCast => ({
  who: 'h-ida',
  mark,
  face: 'you',
  ...o,
});
const sorrel = (mark: string, o: Partial<StageCast> = {}): StageCast => ({
  who: 'h-sorrel',
  mark,
  face: 'you',
  ...o,
});
const STEP = 'fold-door-1';
const BROOM = { carry: 'broom' } as const;
const SIT = { pose: 'sit' } as const;
const HUSH_FOCUS = ['you', 'hush'];
const WINTER = { season: 'winter' } as const;

export const HUNDRED_STAGES: Readonly<Record<string, SceneStage>> = {
  ...chapterStages('h', [
    // 1 One Egg: the gate with no fence, then the first hatch in the ruined square.
    [
      {
        place: 'gate',
        hour: 8,
        cast: [ida(STEP, { ...SIT, ...BROOM })],
        // The gate with no fence, and Ida on the one whole step: both lines' subjects stay in
        // frame with you (the square alone left them off a phone's screen).
        shot: { kind: 'establish', focus: ['you', 'gate', 'h-ida'], then: 'wide' },
      },
      { place: 'fold', hour: 11, cast: [ida(STEP)], shot: { kind: 'two' } },
    ],
    // 2 The Fold: the broom, the first one into the square.
    [
      { place: 'fold', hour: 9, cast: [ida(STEP, BROOM)], shot: { kind: 'wide' } },
      { place: 'fold', hour: 16.5, cast: [ida('fold-door-2', BROOM)], shot: { kind: 'two' } },
    ],
    // 3 Meadow Days: mornings in the meadow, the well lip.
    [
      { place: 'grove', hour: 7.5, shot: { kind: 'wide', focus: ['fold-square'] } },
      { place: 'fold', hour: 15, cast: [ida(STEP)], shot: { kind: 'two' } },
    ],
    // 4 The Shore: the jetty, a swimmer up the path.
    [
      { place: 'pond', hour: 10, shot: { kind: 'establish' } },
      { place: 'fold', hour: 17, cast: [ida('fold-well')], shot: { kind: 'two' } },
    ],
    // 5 The Cave: Sorrel on the well lip; the stairs hold.
    [
      { place: 'fold', hour: 13, cast: [sorrel('fold-well', SIT)], shot: { kind: 'two' } },
      { place: 'fold', hour: 18.5, cast: [sorrel('fold-door-3')], shot: { kind: 'two' } },
    ],
    // 6 Grown.
    [
      { place: 'fold', hour: 9, cast: [ida(STEP)], shot: { kind: 'wide' } },
      { place: 'fold', hour: 12, cast: [ida(STEP)], shot: { kind: 'close' } },
    ],
    // 7 The Mire: rain, drawn at the corvin place; then five in the square.
    [
      {
        place: 'corvin',
        hour: 14,
        weather: 'rain',
        cast: [sorrel('corvin-gate')],
        shot: { kind: 'wide' },
      },
      { place: 'fold', hour: 18, shot: { kind: 'wide' } },
    ],
    // 8 The Mill: the wheel stands in the Grove but the sim draws this area at corvin.
    [
      {
        place: 'grove',
        hour: 10.5,
        cast: [sorrel('mill'), ida('fold-well')],
        shot: { kind: 'establish' },
      },
      {
        place: 'corvin',
        hour: 11.5,
        weather: 'clear',
        cast: [sorrel('corvin-gate')],
        shot: { kind: 'wide' },
      },
    ],
    // 9 The Hush: night; the lamps are the Hush's own ring (no `lights`), back at dusk.
    [
      {
        place: 'fold',
        hour: 21.5,
        ...WINTER,
        cast: [ida(STEP), sorrel('fold-well')],
        shot: { kind: 'wide', focus: HUSH_FOCUS },
      },
      { place: 'fold', hour: 19.5, ...WINTER, cast: [ida(STEP)], shot: { kind: 'wide' } },
    ],
    // 10 The Hundredth Day: the last morning, then dusk with the Fold's lamps lit.
    [
      { place: 'fold', hour: 7.5, ...WINTER, shot: { kind: 'establish' } },
      { place: 'fold', hour: 19, ...WINTER, lights: LIT, shot: { kind: 'wide' } },
    ],
  ]),
  // ---- beats: `h-c<n>-<name>`, in the chapter's own hours --------------------------------
  // 1
  'h-c1-wait': { place: 'fold', hour: 9.5, cast: [ida(STEP, SIT)], shot: { kind: 'two' } },
  'h-c1-step': {
    place: 'fold',
    hour: 10.5,
    cast: [ida(STEP, SIT)],
    shot: { kind: 'close', focus: ['h-ida'] },
  },
  // 2
  'h-c2-visitor': { place: 'fold', hour: 10, shot: { kind: 'wide', focus: ['fold-square'] } },
  'h-c2-fed': { place: 'fold', hour: 12, shot: { kind: 'close' } },
  'h-c2-slip': { place: 'fold', hour: 8, cast: [ida(STEP, BROOM)], shot: { kind: 'two' } },
  // 3
  'h-c3-second': { place: 'gate', hour: 11, shot: { kind: 'wide', focus: ['gate'] } },
  'h-c3-fond': { place: 'gate', hour: 16, shot: { kind: 'two' } },
  'h-c3-evening': {
    place: 'fold',
    hour: 19.5,
    cast: [ida(STEP, { carry: 'lantern' })],
    shot: { kind: 'two' },
  },
  // 4
  'h-c4-sand': { place: 'pond', hour: 10.5, shot: { kind: 'wide', focus: ['shore-jetty'] } },
  'h-c4-paddle': { place: 'pond', hour: 12, shot: { kind: 'close' } },
  'h-c4-jetty': {
    place: 'pond',
    hour: 14,
    cast: [ida('pond-lantern')],
    shot: { kind: 'two', focus: ['shore-jetty'] },
  },
  // 5
  'h-c5-stairs': { place: 'fold', hour: 15, shot: { kind: 'close' } },
  'h-c5-stray': { place: 'fold', hour: 16, shot: { kind: 'close' } },
  'h-c5-chest': { place: 'fold', hour: 17, shot: { kind: 'close' } },
  // 6
  'h-c6-trust': { place: 'fold', hour: 9.5, shot: { kind: 'close' } },
  'h-c6-slips': { place: 'fold', hour: 10, cast: [ida(STEP)], shot: { kind: 'two' } },
  'h-c6-cocoon': {
    place: 'fold',
    hour: 11,
    cast: [sorrel('fold-door-3', SIT)],
    shot: { kind: 'wide', focus: ['fold-square'] },
  },
  // 7
  'h-c7-rain': { place: 'corvin', hour: 14.5, weather: 'rain', shot: { kind: 'wide' } },
  'h-c7-four': {
    place: 'fold',
    hour: 17,
    cast: [sorrel('fold-door-3')],
    shot: { kind: 'two', focus: ['h-sorrel'] },
  },
  // 8
  'h-c8-wheel': { place: 'corvin', hour: 11, weather: 'clear', shot: { kind: 'close' } },
  'h-c8-stall': { place: 'fold', hour: 13, cast: [ida(STEP)], shot: { kind: 'two' } },
  'h-c8-yard': {
    place: 'fold',
    hour: 6.5,
    cast: [ida('fold-door-2', BROOM)],
    shot: { kind: 'wide' },
  },
  // 9: the mountain path, at night, the Hush and the Keeper in frame
  'h-c9-mountain': {
    place: 'hill',
    hour: 22,
    ...WINTER,
    shot: { kind: 'wide', focus: HUSH_FOCUS },
  },
  'h-c9-lamp-lit': { place: 'hill', hour: 22.5, ...WINTER, shot: { kind: 'two' } },
  'h-c9-lamp-left': { place: 'hill', hour: 23, ...WINTER, shot: { kind: 'wide' } },
  // 10
  'h-c10-name-quick': {
    place: 'fold',
    hour: 8,
    ...WINTER,
    cast: [ida(STEP)],
    shot: { kind: 'two' },
  },
  'h-c10-name-slow': {
    place: 'fold',
    hour: 8,
    ...WINTER,
    cast: [ida(STEP)],
    shot: { kind: 'two' },
  },
  'h-c10-drawing-ida': {
    place: 'fold',
    hour: 9,
    ...WINTER,
    cast: [ida(STEP)],
    shot: { kind: 'close', focus: ['h-ida'] },
  },
  'h-c10-drawing-box': { place: 'fold', hour: 10, ...WINTER, shot: { kind: 'close' } },
  'h-c10-moody': { place: 'fold', hour: 12, ...WINTER, shot: { kind: 'two' } },
  // ---- endings: the whole Fold at the last wide shot (N2) --------------------------------
  // Bunting on the mill, a festival in the square, afternoon.
  'end-hundred-bright-fold': {
    place: 'fold',
    hour: 15.5,
    cast: [ida(STEP, SIT), sorrel('fold-well', { face: 'h-ida' })],
    shot: { kind: 'wide', focus: ['fold-square', 'fold-well', 'fold-door-2', 'fold-door-4'] },
  },
  // Bathhouse steaming, the wheel turning, the lamps lit at dusk.
  'end-hundred-the-fold': {
    place: 'fold',
    hour: 18.5,
    lights: LIT,
    cast: [ida(STEP), sorrel('fold-well', { face: 'h-ida' })],
    shot: { kind: 'wide', focus: ['fold-square', 'fold-well', 'fold-door-2', 'fold-door-4'] },
  },
  // Half the doorsteps with someone on them, Ida sweeping the whole square.
  'end-hundred-quiet-fold': {
    place: 'fold',
    hour: 17.5,
    cast: [ida('fold-square', BROOM), sorrel('fold-door-3', SIT)],
    shot: { kind: 'wide', focus: ['fold-square', 'fold-door-2', 'fold-door-3', 'fold-door-4'] },
  },
  // The grey one apart, the lamps lit, the Keeper beside it.
  'end-hundred-grey-fold': {
    place: 'fold',
    hour: 19.5,
    lights: LIT,
    cast: [ida(STEP, SIT), sorrel('fold-well', { face: 'h-ida' })],
    shot: { kind: 'wide', focus: ['fold-square', 'fold-well', 'fold-door-2', 'fold-door-4'] },
  },
};
