import type { SceneStage } from './story';

/**
 * Campaign graphics 2, package s: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 *
 * - C3: Logged In ch7 opens in the Root Node's white room (`place: 'rootNode'` is already
 *   authored there), drawn alone.
 * - C4: the Beetle Road's Hollow Below scenes (the `beetle-below` grade) are drawn alone, as
 *   the cave. The content wave should also set `place: 'below'` on them; the content file's
 *   `place: 'guardhouse'` wins over an overlay, and the set keys on the grade meanwhile.
 * - M3: chapter 6's door is named by the `door` prop (the set also shows it in ch6 unasked).
 */
const BELOW: SceneStage = { exclusive: true };

export const PKG_S_STAGES: Readonly<Record<string, SceneStage>> = {
  'l-c7-open': { exclusive: true },
  'l-c6-open': { props: { door: 'show' } },
  'l-c6-close': { props: { door: 'show' } },
  'b-c3-open': BELOW,
  'b-c3-close': BELOW,
  'b-c4-open': BELOW,
  'b-c4-close': BELOW,
  'b-c6-open': BELOW,
  'b-c6-close': BELOW,
  'b-c7-open': BELOW,
  'b-c7-close': BELOW,
  'b-c8-open': BELOW,
};
