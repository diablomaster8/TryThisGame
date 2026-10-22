/**
 * The card for a graphics failure: no WebGL2, a renderer that would not start, or a
 * context the browser took away (a GPU reset, too many tabs, a phone short on memory).
 * Both modes draw with WebGL2, so the card offers a reload, and from Full 3D a switch to
 * Pixel, which asks far less of the device. Shown once, above everything, instead of a
 * blank screen. The same card covers a frame that threw or a boot that failed for any
 * other reason (`showCrashCard`), and a passing notice covers stray errors after that.
 */
import { UI_TEXT } from '../config/strings';
import { ERRORS } from '../config/tuning';
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

/** A frame threw: the last save is safe, and a reload goes back to it. */
export function showCrashCard(): void {
  if (shown) return;
  const box = el('div', 'update-notice');
  box.setAttribute('role', 'alert');
  box.appendChild(el('p', undefined, UI_TEXT.crashed));
  const row = el('div', 'settings-actions');
  row.appendChild(button(UI_TEXT.glReload, () => location.reload(), 'btn btn-primary'));
  box.appendChild(row);
  document.body.appendChild(box);
  shown = true;
}

/**
 * Was this boot error the renderer's? Only those get the graphics card and its "Switch to
 * Pixel"; any other error gets the plain "something went wrong, reload" card (review D,
 * bug 46), since a switch of renderer would not help it.
 */
export function isGraphicsError(err: unknown): boolean {
  const text = err instanceof Error ? `${err.name} ${err.message}` : String(err);
  return /webgl|gl context|context lost|shader|gpu|renderer|getContext/i.test(text);
}

/**
 * A short notice that fades by itself and blocks nothing: an error nothing else caught,
 * which may have left something looking odd. It joins the HUD's toast row when there is one.
 */
export function showErrorNotice(): void {
  let row = document.querySelector<HTMLElement>('.toasts');
  if (!row) {
    row = el('div', 'toasts');
    document.body.appendChild(row);
  }
  const t = el('div', 'toast', UI_TEXT.errorNotice);
  t.setAttribute('role', 'status');
  row.appendChild(t);
  setTimeout(() => t.remove(), ERRORS.noticeMs);
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
