import { chapterStages } from './scene-stages-kit';
import type { SceneStage } from './story';

/**
 * The Beetle Road: the guard house on the lane in, torch-lit at night to open, then
 * the long road down (the dungeon floors have no sky, so their hours matter only at the
 * guard house).
 */
const LIT: SceneStage['lights'] = {
  'lantern-1': 'lit',
  'lantern-2': 'lit',
  'lantern-3': 'lit',
  'lantern-4': 'lit',
};

/** The torches of the floors below: every post lit, the below grade, a fixed hour. */
const BELOW = { grade: 'beetle-below', hour: 21, lights: LIT } as const;

export const BEETLE_STAGES: Readonly<Record<string, SceneStage>> = chapterStages('b', [
  // 1 The Guard: night at the guard house, the three banners.
  [
    {
      place: 'guardhouse',
      hour: 22.5,
      lights: LIT,
      shot: { kind: 'establish', focus: ['guardhouse'] },
    },
    { place: 'guardhouse', hour: 22.5, lights: LIT, shot: { kind: 'two' } },
  ],
  // 2 The Beetle: the cart under its tarp; home with the cargo.
  [
    { place: 'guardhouse', hour: 9.5, shot: { kind: 'wide' } },
    { place: 'guardhouse', hour: 17.5, shot: { kind: 'two' } },
  ],
  // 3 The First Domain.
  [
    { place: 'guardhouse', ...BELOW, shot: { kind: 'wide' } },
    { place: 'guardhouse', ...BELOW, shot: { kind: 'two' } },
  ],
  // 4 The Door's Opinion.
  [
    { place: 'guardhouse', ...BELOW, shot: { kind: 'two' } },
    { place: 'guardhouse', ...BELOW, shot: { kind: 'wide' } },
  ],
  // 5 Two Into One: Vane on the bonnet.
  [
    { place: 'guardhouse', hour: 16, shot: { kind: 'two', focus: ['b-vane'] } },
    { place: 'guardhouse', hour: 18.5, shot: { kind: 'close' } },
  ],
  // 6 The Second Domain: the floor that rains.
  [
    { place: 'guardhouse', ...BELOW, shot: { kind: 'wide' } },
    { place: 'guardhouse', ...BELOW, weather: 'rain', shot: { kind: 'wide' } },
  ],
  // 7 The Weather Machine.
  [
    { place: 'guardhouse', ...BELOW, weather: 'rain', shot: { kind: 'wide' } },
    { place: 'guardhouse', ...BELOW, weather: 'rain', shot: { kind: 'two' } },
  ],
  // 8 The Road Home: the last door, then the road driven end to end.
  [
    { place: 'guardhouse', ...BELOW, shot: { kind: 'wide' } },
    { place: 'guardhouse', hour: 19, lights: LIT, shot: { kind: 'establish' } },
  ],
]);
