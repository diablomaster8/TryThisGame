/**
 * The card for a graphics failure: no WebGL2, a renderer that would not start, or a
 * context the browser took away (a GPU reset, too many tabs, a phone short on memory).
 * Both modes draw with WebGL2, so the card offers a reload, and from Full 3D a switch to
 * Pixel, which asks far less of the device. Shown once, above everything, instead of a
 * blank screen.
 */
import { UI_TEXT } from '../config/strings';
import { writeGraphicsPref } from '../platform/storage';
import { button, el } from './dom';

export type GlFailure = 'unsupported' | 'failed' | 'lost';

let shown = false;

/** True when this browser can give the game a WebGL2 context. */
export function hasWebGL2(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return gl !== null;
  } catch {
    return false;
  }
}

export function showGlFailure(kind: GlFailure, mode: 'pixel' | '3d', err?: unknown): void {
  if (err !== undefined) console.warn('Grove: graphics failed.', err);
  if (shown) return;
  const box = el('div', 'update-notice');
  box.setAttribute('role', 'alert');
  box.appendChild(el('p', undefined, UI_TEXT.glFailure[kind]));
  const row = el('div', 'settings-actions');
  row.appendChild(button(UI_TEXT.glReload, () => location.reload(), 'btn btn-primary'));
  if (mode === '3d') {
    row.appendChild(
      button(UI_TEXT.glToPixel, () => {
        writeGraphicsPref('pixel');
        location.reload();
      }),
    );
  }
  box.appendChild(row);
  document.body.appendChild(box);
  shown = true;
}
