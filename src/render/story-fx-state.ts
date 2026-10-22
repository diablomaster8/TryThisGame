import type { SceneStage } from '../config/story';
import type { StageFlags } from './scene-stage';

/**
 * Which held effects are on (campaign graphics H6, N2), the one rule both renderers use.
 * They come from the staged scene's `fx`. Two additions that are not in a script:
 * - `breath` also holds through Hazel's chapters 9 to 11, the cold chapters (N2), so a
 *   scene that never names it still shows the cold;
 * - in a dev build, `grove.fx = ['fallsStill', ...]` on `window.grove` turns effects on by
 *   hand, for checking each one without playing to its scene.
 */
export type StoryFx = NonNullable<SceneStage['fx']>[number];

export function activeFx(stage: SceneStage, flags: StageFlags): Set<StoryFx> {
  const on = new Set<StoryFx>(stage.fx ?? []);
  if (flags.campaign === 'hazel' && flags.chapter >= 9 && flags.chapter <= 11) on.add('breath');
  if (import.meta.env.DEV) {
    const hand = (globalThis as { grove?: { fx?: unknown } }).grove?.fx;
    if (Array.isArray(hand)) for (const f of hand) on.add(f as StoryFx);
  }
  return on;
}

/** Whether the Hazel campaign's cold is on the ground: chapters 9 and 10 (footprints, N3). */
export function coldGround(flags: StageFlags): boolean {
  return flags.campaign === 'hazel' && (flags.chapter === 9 || flags.chapter === 10);
}

/** Whether the memorial hill's dressing stands: Hazel's Grove, once the campaign begins. */
export function hazelHill(flags: StageFlags): boolean {
  return flags.campaign === 'hazel' && flags.chapter > 0;
}
