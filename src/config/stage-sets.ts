import type { SceneStage } from './story';

/**
 * Campaign landmark sets (campaign graphics H3): while a scene's stage names `set`, both
 * renderers hide these Grove-only buildings, by building id. The ids are the same in both:
 * the stock houses (`cottage`, `school`, `dojo`, `windmill`, `well`, `cave`) and the placed
 * garden buildings (`nursery`, `bathhouse`, `workshop`). Package b's Fold ruins and Dawn &
 * Dusk's crest houses stand where the cottage, school and dojo stood, so those sets leave
 * the stock houses to package b. The Fold keeps its mill and its well (the well square is
 * the Fold's own landmark); the other three campaigns take the mill and the well away, so
 * no campaign shows the Grove's own landmarks it has no use for.
 */
export type StageSet = NonNullable<SceneStage['set']>;

const GARDEN = ['nursery', 'bathhouse', 'workshop'] as const;

export const STAGE_SET_HIDES: Readonly<Record<StageSet, readonly string[]>> = {
  fold: [...GARDEN],
  dawndusk: [...GARDEN, 'dojo', 'windmill'],
  logged: [...GARDEN, 'cottage', 'school', 'dojo', 'windmill', 'well'],
  beetle: [...GARDEN, 'cottage', 'school', 'dojo', 'windmill', 'well'],
};

/** The building ids a stage hides: its set's list (none for an exclusive stage: all go). */
export function stageHides(stage: SceneStage): readonly string[] {
  return stage.set ? STAGE_SET_HIDES[stage.set] : [];
}
