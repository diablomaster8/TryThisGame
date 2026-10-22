import { chapterStages } from './scene-stages-kit';
import type { SceneStage } from './story';

/**
 * Logged In: the Day Grove (a meadow with a lobby), the Night Grove (lights off, the
 * board glowing), the board, and the Root Node's white room.
 */
const DARK: SceneStage['lights'] = {
  'lantern-1': 'out',
  'lantern-2': 'out',
  'lantern-3': 'out',
  'lantern-4': 'out',
};

export const LOGGED_STAGES: Readonly<Record<string, SceneStage>> = chapterStages('l', [
  // 1 Log In: the visor, three eggs on the grass.
  [
    { place: 'grove', hour: 12, shot: { kind: 'establish' } },
    { place: 'grove', hour: 12, shot: { kind: 'two' } },
  ],
  // 2 The Lobby: the scoreboard meadow.
  [
    { place: 'grove', hour: 12.5, shot: { kind: 'wide' } },
    { place: 'grove', hour: 13, shot: { kind: 'two' } },
  ],
  // 3 No Log Out.
  [
    { place: 'grove', hour: 14, shot: { kind: 'close' } },
    { place: 'grove', hour: 16, shot: { kind: 'two' } },
  ],
  // 4 Night Grove: the meadow with the lights off.
  [
    { place: 'grove', hour: 23, lights: DARK, shot: { kind: 'establish' } },
    { place: 'grove', hour: 23, lights: DARK, shot: { kind: 'two' } },
  ],
  // 5 The Message Board, at night.
  [
    { place: 'grove', hour: 23.5, lights: DARK, shot: { kind: 'two' } },
    { place: 'grove', hour: 23.5, lights: DARK, shot: { kind: 'close' } },
  ],
  // 6 Mirror Match: the plain door in the meadow.
  [
    { place: 'grove', hour: 22, shot: { kind: 'wide' } },
    { place: 'grove', hour: 22, shot: { kind: 'two' } },
  ],
  // 7 The Root Node: a white room with one chair, bright whatever the clock.
  [
    { place: 'rootNode', hour: 12, shot: { kind: 'close' } },
    { place: 'grove', hour: 12, shot: { kind: 'two' } },
  ],
  // 8 Log Out: the last bout, then the board takes the word at first light.
  [
    { place: 'grove', hour: 22, shot: { kind: 'wide' } },
    { place: 'grove', hour: 6, shot: { kind: 'wide' } },
  ],
]);
