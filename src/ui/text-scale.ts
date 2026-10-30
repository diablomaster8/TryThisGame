import { textBandOf } from '../sim/story-scenes';
import type { World } from '../sim/types';

/**
 * TECH-27: the Text size setting scales the root font size, which every rem-sized panel
 * follows. Unset: 1.15 in the Learning Grove's read-aloud band, else 1.
 */
export const TEXT_SCALES: Readonly<Record<string, number>> = {
  small: 0.9,
  normal: 1,
  large: 1.15,
  larger: 1.3,
};

/** The menu key for a scale. */
export function textSizeKey(scale: number): string {
  return Object.keys(TEXT_SCALES).find((k) => TEXT_SCALES[k] === scale) ?? 'normal';
}

export function textScaleOf(world: World): number {
  return world.settings.textScale ?? (textBandOf(world) === 'sprout' ? 1.15 : 1);
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
