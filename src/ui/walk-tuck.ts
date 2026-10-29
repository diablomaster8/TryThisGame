import '../walk-tuck.css';
import { WORLD_TUCK } from '../config/tuning-world';
import { WORLD_SETTINGS_TEXT } from '../config/strings-world';
import type { Game } from '../game';
import { isPhoneScreen, phoneDefault } from './world-settings';

/**
 * R0106 (WORLD-48): on a phone, the bottom bar tucks away while the Keeper walks, so the
 * world has the screen. After `WORLD_TUCK.walkMs` of moving with no panel open, the root gets
 * `walk-tucked`: the bar slides down to a thin handle (a fade under reduced motion, see
 * `walk-tuck.css`) and the objective chip shrinks to its label. Everything comes back
 * `WORLD_TUCK.backMs` after the Keeper stops, when a panel opens, or at a tap on the handle
 * (which also holds the bar out until the next stop). The setting is "Hide bar while walking".
 */
export function mountWalkTuck(root: HTMLElement, game: () => Game | null): void {
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'walk-tuck-handle';
  handle.setAttribute('aria-label', WORLD_SETTINGS_TEXT.handle);
  handle.hidden = true;
  root.appendChild(handle);
  let last: { x: number; z: number } | null = null;
  let movingSince: number | null = null;
  let stillSince: number | null = null;
  let heldOut = false;
  const set = (on: boolean) => {
    if (root.classList.contains('walk-tucked') === on) return;
    root.classList.toggle('walk-tucked', on);
    handle.hidden = !on;
  };
  handle.addEventListener('click', () => {
    heldOut = true;
    set(false);
  });
  window.setInterval(() => {
    const g = game();
    const k = g?.world.keeper;
    const now = performance.now();
    const on = !!g && isPhoneScreen() && phoneDefault(g.world.settings.hideBarWhileWalking);
    const panel = !!root.querySelector('.modal:not([hidden]), .dialogue:not([hidden])');
    if (!on || !k || panel) {
      last = null;
      movingSince = null;
      set(false);
      return;
    }
    const moved = !!last && Math.hypot(k.pos.x - last.x, k.pos.z - last.z) > WORLD_TUCK.minStep;
    last = { x: k.pos.x, z: k.pos.z };
    if (moved) {
      stillSince = null;
      movingSince ??= now;
      if (!heldOut && now - movingSince >= WORLD_TUCK.walkMs) set(true);
      return;
    }
    movingSince = null;
    heldOut = false;
    stillSince ??= now;
    if (now - stillSince >= WORLD_TUCK.backMs) set(false);
  }, WORLD_TUCK.pollMs);
}
