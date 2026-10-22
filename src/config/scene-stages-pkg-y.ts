import type { SceneStage } from './story';

/**
 * Campaign graphics 2, package y: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins, field by
 * field, so `lights: { windows: 'out' }` cannot be added to Logged In's ch4-5 scenes here:
 * their `lights` is already set. The renderers treat those two chapters as windows-out
 * until the content wave adds it; see `windowsState` in render/dress-y-shared.ts).
 */
export const PKG_Y_STAGES: Readonly<Record<string, SceneStage>> = {
  // M10: Hazel's cold, bright morning.
  'c12-open': { grade: 'crisp' },
  // M11: the festival's lantern string, lit with the picnic's dusk.
  'c12-close': { props: { lanternString: 'lit' } },
  // M11: the Fold's lamps lit, at the Hundredth Day's dusk.
  'h-c10-close': { props: { lanternString: 'lit' } },
  // M15: the board takes the word at first light (hour 6 is staged already).
  'l-c8-close': { props: { board: 'final' } },
};
