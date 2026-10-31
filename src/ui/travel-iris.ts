import { reducedMotion } from '../platform/motion';
import { WORLD_TRAVEL } from '../config/tuning-world';

/**
 * R0074: the fast-travel transition, drawn over the canvas so both renderers share it. A
 * black iris closes on the middle of the view (where the camera keeps the Keeper), the trip
 * happens at the dark moment, and the iris opens on the new place. With reduced motion it is
 * a short cross-fade through black instead.
 */
export function playIris(atDark: () => void): void {
  if (typeof document === 'undefined' || !document.body.animate) {
    atDark();
    return;
  }
  const still = reducedMotion();
  const veil = document.createElement('div');
  veil.className = still ? 'travel-fade' : 'travel-iris';
  veil.setAttribute('aria-hidden', 'true');
  document.body.appendChild(veil);
  const half = (still ? WORLD_TRAVEL.fadeMs : WORLD_TRAVEL.irisMs) / 2;
  // The iris is a hole whose shadow covers the screen: shrinking the hole closes the view.
  const open = still ? { opacity: 0 } : { width: '160vmax', height: '160vmax' };
  const shut = still ? { opacity: 1 } : { width: '0vmax', height: '0vmax' };
  const close = veil.animate([open, shut], { duration: half, easing: 'ease-in', fill: 'forwards' });
  close.onfinish = () => {
    atDark();
    const reopen = veil.animate([shut, open], {
      duration: half,
      easing: 'ease-out',
      fill: 'forwards',
    });
    reopen.onfinish = () => veil.remove();
  };
}
