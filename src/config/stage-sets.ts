import type { SceneStage } from './story';

/**
 * Campaign landmark sets (campaign graphics H3): while a scene's stage names `set`, both
 * renderers hide these Grove-only buildings, by building id. The ids are the same in both:
 * the stock houses (`cottage`, `school`, `dojo`, `windmill`, `well`, `cave`) and the placed
 * garden buildings (`nursery`, `bathhouse`, `workshop`). Package b's Fold ruins and Dawn &
 * Dusk's crest houses stand where the cottage, school and dojo stood, so those sets leave
 * the stock houses to package b.
 */
export type StageSet = NonNullable<SceneStage['set']>;

const GARDEN = ['nursery', 'bathhouse', 'workshop'] as const;

export const STAGE_SET_HIDES: Readonly<Record<StageSet, readonly string[]>> = {
  fold: [...GARDEN],
  dawndusk: [...GARDEN, 'dojo'],
  logged: [...GARDEN, 'cottage', 'school', 'dojo'],
  beetle: [...GARDEN, 'cottage', 'school', 'dojo'],
};

/** The building ids a stage hides: its set's list (none for an exclusive stage: all go). */
export function stageHides(stage: SceneStage): readonly string[] {
  return stage.set ? STAGE_SET_HIDES[stage.set] : [];
}
