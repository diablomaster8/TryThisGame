import { chapterStages } from './scene-stages-kit';
import type { SceneStage } from './story';

/**
 * The Hundred Days: ten chapters, each opened and closed in the Fold. Chapter 8's mill
 * and chapter 7's mire are drawn at the `corvin` location (the sim's `onArea`), so their
 * scenes carry that place; chapter 9's Hush scenes leave `lights` to the Hush's own ring.
 */
const LIT: SceneStage['lights'] = {
  'lantern-1': 'lit',
  'lantern-2': 'lit',
  'lantern-3': 'lit',
  'lantern-4': 'lit',
};

export const HUNDRED_STAGES: Readonly<Record<string, SceneStage>> = chapterStages('h', [
  // 1 One Egg: the gate with no fence, then the first hatch in the ruined square.
  [
    { place: 'gate', hour: 8, shot: { kind: 'establish', focus: ['fold-square'] } },
    { place: 'fold', hour: 11, shot: { kind: 'two' } },
  ],
  // 2 The Fold: the broom, the first one into the square.
  [
    { place: 'fold', hour: 9, shot: { kind: 'wide' } },
    { place: 'fold', hour: 16.5, shot: { kind: 'two' } },
  ],
  // 3 Meadow Days: mornings in the meadow, the well lip.
  [
    { place: 'grove', hour: 7.5, shot: { kind: 'wide', focus: ['fold-square'] } },
    { place: 'fold', hour: 15, shot: { kind: 'two' } },
  ],
  // 4 The Shore: the jetty, a swimmer up the path.
  [
    { place: 'pond', hour: 10, shot: { kind: 'establish' } },
    { place: 'fold', hour: 17, shot: { kind: 'two' } },
  ],
  // 5 The Cave: Sorrel on the well lip; the stairs hold.
  [
    { place: 'fold', hour: 13, shot: { kind: 'two' } },
    { place: 'fold', hour: 18.5, shot: { kind: 'two' } },
  ],
  // 6 Grown.
  [
    { place: 'fold', hour: 9, shot: { kind: 'wide' } },
    { place: 'fold', hour: 12, shot: { kind: 'close' } },
  ],
  // 7 The Mire: rain, drawn at the corvin place; then five in the square.
  [
    { place: 'corvin', hour: 14, weather: 'rain', shot: { kind: 'wide' } },
    { place: 'fold', hour: 18, shot: { kind: 'wide' } },
  ],
  // 8 The Mill: the wheel stands in the Grove but the sim draws this area at corvin.
  [
    { place: 'grove', hour: 10.5, shot: { kind: 'establish' } },
    { place: 'corvin', hour: 11.5, weather: 'clear', shot: { kind: 'wide' } },
  ],
  // 9 The Hush: night; the lamps are the Hush's own ring (no `lights`), back at dusk.
  [
    { place: 'fold', hour: 21.5, shot: { kind: 'wide' } },
    { place: 'fold', hour: 19.5, shot: { kind: 'wide' } },
  ],
  // 10 The Hundredth Day: the last morning, then dusk with the Fold's lamps lit.
  [
    { place: 'fold', hour: 7.5, shot: { kind: 'establish' } },
    { place: 'fold', hour: 19, lights: LIT, shot: { kind: 'wide' } },
  ],
]);
