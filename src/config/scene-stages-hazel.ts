import type { SceneStage } from './story';

/**
 * Hazel's Grove, scene by scene (campaign graphics C1). Chapters 1 to 12, in order. Every
 * `fx` and `props` name here is one a dressing reads; marks are in stage-marks.ts. Where
 * tuning-more/campaign-people-lanterns's `E_STAGES` already seats a scene's cast or lights (c4-open, c4-close,
 * c10-vigil, c11-moss-*, c12-walk-*), the entry here leaves that field out, because a
 * field set here replaces the one under it.
 */
import { HAZEL_RAW_EARLY } from './scene-stages-hazel-early';
import { HAZEL_RAW_LATE } from './scene-stages-hazel-late';

const RAW: Readonly<Record<string, SceneStage>> = { ...HAZEL_RAW_EARLY, ...HAZEL_RAW_LATE };

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
