import { textBandOf } from '../sim/story-scenes';
import type { World } from '../sim/types';

/**
 * TECH-27: the Text size setting scales the root font size, which every rem-sized panel
 * follows. Unset: 1.15 in the Learning Grove's read-aloud band or with the system asking for
 * more contrast, else 1.
 */
export const TEXT_SCALES: Readonly<Record<string, number>> = {
  small: 0.9,
  normal: 1,
  large: 1.15,
  larger: 1.3,
  /** Lane E r10 (R0709): the largest step for readers who need it. */
  largest: 1.5,
};

/** The menu key for a scale. */
export function textSizeKey(scale: number): string {
  return Object.keys(TEXT_SCALES).find((k) => TEXT_SCALES[k] === scale) ?? 'normal';
}

export function textScaleOf(world: World): number {
  return world.settings.textScale ?? (textBandOf(world) === 'sprout' || moreContrast() ? 1.15 : 1);
}

/** R0519 (TECH-78): a player who asks the system for more contrast starts on Large text. */
let contrastQuery: MediaQueryList | null | undefined;
function moreContrast(): boolean {
  if (contrastQuery === undefined) {
    try {
      contrastQuery =
        typeof matchMedia === 'function' ? matchMedia('(prefers-contrast: more)') : null;
    } catch {
      contrastQuery = null;
    }
  }
  return contrastQuery?.matches ?? false;
}

let shown = 0;

/** Called each frame; touches the DOM only when the scale changes. */
export function applyTextScale(world: World): void {
  const s = textScaleOf(world);
  if (s === shown || typeof document === 'undefined') return;
  shown = s;
  document.documentElement.style.fontSize = s === 1 ? '' : `${s * 100}%`;
  document.documentElement.style.setProperty('--text-scale', String(s));
}
