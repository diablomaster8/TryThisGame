import { BEACON_LANDMARKS } from './region-extras-r11d6';
import type { RegionId } from './regions';

type BeaconKey = Exclude<RegionId, 'little-grove'>;

/**
 * Round 12, helper d2: player-facing words for the open world's content (British spelling,
 * short lines). Kept apart from `strings.ts` so the helper branches merge cleanly.
 */

/** R0138 (WORLD-72): a photo frame, and the button that takes the picture. */
export const PHOTO_FRAME_TEXT = {
  button: 'Take photo',
  buttonLabel: 'Take a photo of this view',
  /** The first time standing in a region's frame; the beacon is what the frame looks at. */
  first: (region: string): string => {
    const b = BEACON_LANDMARKS[region as BeaconKey];
    return `📷 A good spot for a photo. ${cap(b ? b.name : 'the view')} sits right in the frame.`;
  },
  again: '📷 The view is still good from here.',
  /** The title on the saved picture. */
  title: (region: string): string => {
    const b = BEACON_LANDMARKS[region as BeaconKey];
    return b ? `A view of ${b.name}` : 'A view';
  },
  note: 'Vista',
};

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
