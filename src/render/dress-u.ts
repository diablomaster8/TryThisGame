import { setItemSource } from '../ui/item-card';
import { pixelItem } from '../ui/item-art';
import type { PixelDressing } from './dressings';

/**
 * Campaign graphics 2, package u, pixel. The story UI (ui/story-ui.ts) is DOM, so this
 * dressing only tells the item card (M9) to draw its items as pixel art, 3x, on the shared
 * palette. The postcard hold (N1) and the chapter photo (N6) need nothing from the scene.
 */
export const dressU: PixelDressing = {
  id: 'u',
  build: () => setItemSource(pixelItem),
  update: () => undefined,
  dispose: () => setItemSource(null),
};
