import { UI_TEXT } from '../config/strings';
import type { OrbitCamera } from '../render/camera';
import { UI_FX_TEXT } from '../config/strings-ui';
import { TOUCH_HINT } from '../config/tuning-ui';
import { WORLD_TEXT } from '../config/strings-world';
import { roseAngle } from './hud-world-math';

/** On-screen rotate/zoom buttons (48px targets) for phones and as a desktop fallback. */
export function mountCameraButtons(parent: HTMLElement, camera: OrbitCamera): HTMLDivElement {
  const bar = document.createElement('div');
  bar.className = 'camera-buttons';

  const make = (glyph: string, label: string, onPress: () => void): HTMLButtonElement => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = glyph;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.addEventListener('click', onPress);
    bar.appendChild(button);
    return button;
  };

  make('↺', UI_TEXT.rotateLeft, () => camera.rotate(-1));
  make('↻', UI_TEXT.rotateRight, () => camera.rotate(1));
  // R0014: phones get ⤢ from the More menu instead (CSS hides this one on touch screens).
  make('⤢', UI_TEXT.zoomToggle, () => camera.toggleZoom()).classList.add('cam-zoom');

  // A tiny north pointer that turns with the camera (R0082).
  const north = document.createElement('span');
  north.className = 'cam-north';
  north.setAttribute('role', 'img');
  north.setAttribute('aria-label', WORLD_TEXT.rotateNorth);
  const arm = document.createElement('span');
  arm.className = 'cam-north-arm';
  arm.textContent = `▲${WORLD_TEXT.compassN}`;
  north.appendChild(arm);
  bar.insertBefore(north, bar.firstChild);
  const spin = (): void => {
    arm.style.transform = `rotate(${roseAngle(camera.currentYaw)}rad)`;
    requestAnimationFrame(spin);
  };
  requestAnimationFrame(spin);

  parent.appendChild(bar);

  const hint = document.createElement('div');
  hint.className = 'hint keys-hint';
  hint.textContent = UI_TEXT.desktopHint;
  parent.appendChild(hint);

  // A touch screen gets its own hint (tap, drag, pinch), shown for a while and then gone.
  const touch = document.createElement('div');
  touch.className = 'touch-hint';
  touch.textContent = UI_FX_TEXT.touchHint;
  parent.appendChild(touch);
  window.setTimeout(() => (touch.hidden = true), TOUCH_HINT.showMs);

  return bar;
}
