import type { SceneStage } from './story';

/** One storyline chapter's staging: its opening scene, then its closing scene. */
export type ChapterStaging = readonly [open: SceneStage, close: SceneStage];

/**
 * Stages for a storyline's chapters, keyed by scene id: `<prefix>-c<n>-open` and
 * `<prefix>-c<n>-close`. `rows[0]` is chapter 1.
 */
export function chapterStages(
  prefix: string,
  rows: readonly ChapterStaging[],
): Record<string, SceneStage> {
  const out: Record<string, SceneStage> = {};
  rows.forEach(([open, close], i) => {
    out[`${prefix}-c${i + 1}-open`] = open;
    out[`${prefix}-c${i + 1}-close`] = close;
  });
  return out;
}
