import type { SceneStage, StageCast } from './story';

/**
 * Campaign graphics 4, package c4: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 *
 * K10's indoor scenes all have a `place` in the content files already, and the content's
 * place wins over an overlay, so an overlay entry cannot move them indoors (and an overlay
 * `exclusive` would blank their outdoor place). The staging they should take is kept in
 * `C4_INDOOR_STAGES` below, for the content wave to move into the content files; nothing
 * merges it.
 */
export const PKG_C4_STAGES: Readonly<Record<string, SceneStage>> = {};

const hob = (mark: string): StageCast => ({ who: 'b-hob', mark, face: 'you' });

/** The guard house by lamplight: the counter, the banners, drawn alone. */
const GUARD = { place: 'inside-guardhouse', exclusive: true } as const;

/**
 * Proposed indoor staging (K10), for the content wave. Each interior is drawn alone round
 * one origin; its marks are `in-<id>-b1`..`f3` (a 3 × 3 grid), the named spots in
 * `config/stage-marks.ts` (`in-kitchen-shelf`, `in-guardhouse-counter`, `in-fold-hole`, ...)
 * and the Keeper's `keeper-inside-<id>`.
 */
export const C4_INDOOR_STAGES: Readonly<Record<string, SceneStage>> = {
  // Beetle ch1–2: "Behind the counter sits a man"; the ledger, the badge, the book.
  'b-c1-open': {
    ...GUARD,
    hour: 22.5,
    cast: [hob('in-guardhouse-counter')],
    shot: { kind: 'establish' },
  },
  'b-c1-ledger': { ...GUARD, hour: 9, cast: [hob('in-guardhouse-counter')], shot: { kind: 'two' } },
  'b-c1-close': {
    ...GUARD,
    hour: 22.5,
    cast: [hob('in-guardhouse-counter')],
    shot: { kind: 'two' },
  },
  'b-c2-errand': {
    ...GUARD,
    hour: 17.5,
    cast: [hob('in-guardhouse-counter')],
    shot: { kind: 'two' },
  },
  // Hazel ch1: the kitchen lines of the letter ("the kettle is on the stove, cold"), if the
  // content wave splits them from Fern's lines at the gate.
  'c1-letter': {
    place: 'inside-kitchen',
    exclusive: true,
    hour: 15.5,
    cast: [{ who: 'fern', mark: 'in-kitchen-m3', face: 'you' }],
    shot: { kind: 'establish' },
  },
  // The Hundred Days ch5: "Sorrel takes a roof with a hole in it".
  'h-c5-close': {
    place: 'inside-fold',
    exclusive: true,
    hour: 18,
    cast: [{ who: 'h-sorrel', mark: 'in-fold-kettle', face: 'you' }],
    shot: { kind: 'establish' },
  },
};
