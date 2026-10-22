import { chapterStages } from './scene-stages-kit';
import type { SceneStage, StageCast } from './story';

/**
 * Logged In: the Day Grove (a meadow with a lobby), the Night Grove (lights off, the
 * board glowing), the board, and the Root Node's white room. Every opening, closing, beat
 * and ending is staged (campaign graphics 2, H2 and N2). The warden stands at the lobby,
 * Juno at the board; chapters 4 and 5 are the Night Grove, so the windows are out; chapter
 * 6 shows its plain door; chapter 7's white room draws only itself.
 */
const DARK: NonNullable<SceneStage['lights']> = {
  'lantern-1': 'out',
  'lantern-2': 'out',
  'lantern-3': 'out',
  'lantern-4': 'out',
  windows: 'out',
};

const warden = (mark = 'lobby', o: Partial<StageCast> = {}): StageCast => ({
  who: 'l-warden',
  mark,
  face: 'you',
  ...o,
});
const juno = (mark = 'board', o: Partial<StageCast> = {}): StageCast => ({
  who: 'l-juno',
  mark,
  face: 'you',
  ...o,
});
const NO_SET = { loggedSet: 'hide' } as const;
const DOOR = { door: 'show' } as const;

export const LOGGED_STAGES: Readonly<Record<string, SceneStage>> = {
  ...chapterStages('l', [
    // 1 Log In: the visor, three eggs on the grass.
    [
      { place: 'grove', hour: 12, cast: [warden()], shot: { kind: 'establish' } },
      { place: 'grove', hour: 12, cast: [warden()], shot: { kind: 'two' } },
    ],
    // 2 The Lobby: the scoreboard meadow.
    [
      { place: 'grove', hour: 12.5, cast: [juno()], shot: { kind: 'wide' } },
      { place: 'grove', hour: 13, cast: [juno()], shot: { kind: 'two' } },
    ],
    // 3 No Log Out: the player is out of the game (no set drawn).
    [
      {
        place: 'grove',
        hour: 14,
        props: NO_SET,
        cast: [warden(), juno('board')],
        shot: { kind: 'close' },
      },
      {
        place: 'grove',
        hour: 16,
        props: NO_SET,
        cast: [warden(), juno('board')],
        shot: { kind: 'two' },
      },
    ],
    // 4 Night Grove: the meadow with the lights off.
    [
      { place: 'grove', hour: 23, lights: DARK, cast: [juno()], shot: { kind: 'establish' } },
      { place: 'grove', hour: 23, lights: DARK, cast: [warden()], shot: { kind: 'two' } },
    ],
    // 5 The Message Board, at night.
    [
      { place: 'grove', hour: 23.5, lights: DARK, cast: [juno()], shot: { kind: 'two' } },
      { place: 'grove', hour: 23.5, lights: DARK, cast: [juno()], shot: { kind: 'close' } },
    ],
    // 6 Mirror Match: the plain door in the meadow.
    [
      { place: 'grove', hour: 22, props: DOOR, cast: [warden(), juno()], shot: { kind: 'wide' } },
      { place: 'grove', hour: 22, props: DOOR, cast: [warden(), juno()], shot: { kind: 'two' } },
    ],
    // 7 The Root Node: a white room with one chair, bright whatever the clock.
    [
      {
        place: 'rootNode',
        hour: 12,
        exclusive: true,
        cast: [{ who: 'l-root', mark: 'root-chair', pose: 'sit' }, juno('lobby')],
        shot: { kind: 'close' },
      },
      { place: 'grove', hour: 12, cast: [warden()], shot: { kind: 'two' } },
    ],
    // 8 Log Out: the last bout, then the board takes the word at first light.
    [
      { place: 'grove', hour: 22, cast: [juno()], shot: { kind: 'wide' } },
      { place: 'grove', hour: 6, shot: { kind: 'wide', focus: ['board'] } },
    ],
  ]),
  // ---- beats ------------------------------------------------------------------------------
  // 1: the hatchlings
  'l-c1-first': { place: 'grove', hour: 12.2, cast: [warden()], shot: { kind: 'close' } },
  'l-c1-second': { place: 'grove', hour: 12.4, cast: [warden()], shot: { kind: 'two' } },
  // 2: the lobby
  'l-c2-still': {
    place: 'grove',
    hour: 13,
    cast: [juno()],
    shot: { kind: 'wide', focus: ['board'] },
  },
  'l-c2-fruit': { place: 'grove', hour: 13.5, cast: [warden()], shot: { kind: 'close' } },
  // 3: out of the game, so no set
  'l-c3-second': {
    place: 'grove',
    hour: 15,
    props: NO_SET,
    cast: [juno('lobby')],
    shot: { kind: 'two' },
  },
  'l-c3-meals': {
    place: 'grove',
    hour: 15.5,
    props: NO_SET,
    cast: [juno('lobby')],
    shot: { kind: 'close' },
  },
  // 4: the Night Grove
  'l-c4-night': {
    place: 'grove',
    hour: 23,
    lights: DARK,
    shot: { kind: 'wide', focus: ['board'] },
  },
  'l-c4-dark-bout': {
    place: 'grove',
    hour: 23.2,
    lights: DARK,
    cast: [juno()],
    shot: { kind: 'wide' },
  },
  'l-c4-sleepers': {
    place: 'grove',
    hour: 23.5,
    lights: DARK,
    cast: [juno()],
    shot: { kind: 'close', focus: ['board'] },
  },
  // 5: the board at night
  'l-c5-told': { place: 'grove', hour: 23.6, lights: DARK, cast: [juno()], shot: { kind: 'two' } },
  'l-c5-quiet': {
    place: 'grove',
    hour: 23.7,
    lights: DARK,
    cast: [juno()],
    shot: { kind: 'close' },
  },
  'l-c5-thread': {
    place: 'grove',
    hour: 23.8,
    lights: DARK,
    cast: [juno()],
    shot: { kind: 'close', focus: ['board'] },
  },
  // 6: the plain door
  'l-c6-lost': {
    place: 'grove',
    hour: 22.2,
    props: DOOR,
    cast: [juno()],
    shot: { kind: 'two', focus: ['l-juno'] },
  },
  'l-c6-day-win': {
    place: 'grove',
    hour: 14,
    props: DOOR,
    cast: [warden()],
    shot: { kind: 'wide', focus: ['board'] },
  },
  'l-c6-night-win': {
    place: 'grove',
    hour: 22.5,
    props: DOOR,
    cast: [juno()],
    shot: { kind: 'wide' },
  },
  'l-c6-wage': { place: 'grove', hour: 22.6, props: DOOR, cast: [juno()], shot: { kind: 'two' } },
  // 8: the last bout
  'l-c8-loud': { place: 'grove', hour: 22.2, cast: [juno()], shot: { kind: 'wide' } },
  'l-c8-quiet': { place: 'grove', hour: 22.4, cast: [juno()], shot: { kind: 'two' } },
  'l-c8-nine': {
    place: 'grove',
    hour: 22.6,
    cast: [juno(), warden()],
    shot: { kind: 'wide' },
  },
  // ---- endings: the board's last post in first light, everyone on the meadow (N2) --------
  'end-logged-everyone-wakes': {
    place: 'grove',
    hour: 6,
    props: { board: 'final' },
    cast: [juno('board'), warden('lobby')],
    shot: { kind: 'wide', focus: ['board', 'lobby'] },
  },
  'end-logged-quiet-exit': {
    place: 'grove',
    hour: 6.5,
    cast: [juno('board'), warden('lobby')],
    shot: { kind: 'wide', focus: ['board', 'lobby'] },
  },
  'end-logged-one-short': {
    place: 'grove',
    hour: 6,
    props: { board: 'final' },
    cast: [juno('board'), warden('lobby')],
    shot: { kind: 'wide', focus: ['board', 'lobby'] },
  },
};
