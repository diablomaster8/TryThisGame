import { chapterStages } from './scene-stages-kit';
import type { SceneStage } from './story';

/**
 * Dawn & Dusk: four houses round a green. The hour follows the half (M13): about 6.5 for
 * the dawn half and about 19 for the dusk half. Every scene of the two scripts is staged
 * here, openings and closings alike; `resolveStage` falls back to the same two hours for
 * any other scene of either half (beats, endings).
 */
export const DAWN_HOUR = 6.5;
export const DUSK_HOUR = 19;

/** Each chapter's shot, opening then closing (the same for both halves). */
type Shot = NonNullable<SceneStage['shot']>;
const SHOTS: ReadonlyArray<readonly [Shot, Shot]> = [
  [{ kind: 'establish' }, { kind: 'two' }],
  [{ kind: 'wide' }, { kind: 'two' }],
  [{ kind: 'two' }, { kind: 'close' }],
  [{ kind: 'wide' }, { kind: 'two' }],
  [{ kind: 'two' }, { kind: 'two' }],
  [{ kind: 'two' }, { kind: 'wide' }],
  [{ kind: 'wide' }, { kind: 'establish' }],
];

const half = (hour: number): Array<[SceneStage, SceneStage]> =>
  SHOTS.map(([o, c]) => [
    { place: 'green', hour, shot: o },
    { place: 'green', hour, shot: c },
  ]);

export const DAWNDUSK_STAGES: Readonly<Record<string, SceneStage>> = {
  ...chapterStages('dawn', half(DAWN_HOUR)),
  ...chapterStages('dusk', half(DUSK_HOUR)),
};
