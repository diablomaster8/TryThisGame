import { UI_TEXT } from '../config/strings';
import type { OrbitCamera } from '../render/camera';

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
  make('⤢', UI_TEXT.zoomToggle, () => camera.toggleZoom());

  parent.appendChild(bar);

  const hint = document.createElement('div');
  hint.className = 'hint';
  hint.textContent = UI_TEXT.desktopHint;
  parent.appendChild(hint);

  return bar;
}
