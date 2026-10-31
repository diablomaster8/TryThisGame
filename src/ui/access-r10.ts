/**
 * Lane E round 10 (R0709 KIDS-41, R0710 KIDS-42): reading and touch access in the DOM.
 * `applyAccess` runs each frame beside the text scale and marks `<html>` with a class per
 * option (touching the DOM only on a change); `access-r10.css` does the rest, for the main
 * game and the Learning Grove alike. `mountAccessSettings` adds the rows to Settings and to
 * the grown-up area. The text size itself is the existing Text size row (now up to 150%).
 */
import '../access-r10.css';
import { ACCESS_TEXT } from '../config/strings-access-r10';
import type { Game } from '../game';
import { SIMPLE_TOUCH_CLASS } from '../input/simple-touch';
import { accessOf } from '../sim/access';
import type { AccessSettings, World } from '../sim/types';

let shownKey = '';

export function applyAccess(world: World): void {
  if (typeof document === 'undefined') return;
  const a = accessOf(world);
  const key = `${a.font}|${a.contrast}|${a.simpleTouch}`;
  if (key === shownKey) return;
  shownKey = key;
  const root = document.documentElement.classList;
  root.toggle('a11y-readable', a.font === 'readable');
  root.toggle('a11y-contrast', a.contrast === 'high');
  root.toggle(SIMPLE_TOUCH_CLASS, a.simpleTouch);
}

function setAccess(game: () => Game | null, patch: AccessSettings): void {
  const g = game();
  if (!g) return;
  const access: AccessSettings = { ...(g.world.settings.access ?? {}), ...patch };
  g.send({ kind: 'setSettings', settings: { ...g.world.settings, access } });
  applyAccess(g.world);
}

/** Append the reading font, contrast and Simple touch rows; returns a refresh for opening. */
export function mountAccessSettings(body: HTMLElement, game: () => Game | null): (g: Game) => void {
  const select = (
    label: string,
    options: Record<string, string>,
    onChange: (v: string) => void,
  ) => {
    const row = document.createElement('label');
    row.className = 'field-row';
    const strong = document.createElement('strong');
    strong.textContent = label;
    const sel = document.createElement('select');
    for (const [value, text] of Object.entries(options)) {
      const o = document.createElement('option');
      o.value = value;
      o.textContent = text;
      sel.appendChild(o);
    }
    sel.addEventListener('change', () => onChange(sel.value));
    row.append(strong, sel);
    body.appendChild(row);
    return sel;
  };
  const font = select(ACCESS_TEXT.fontLabel, ACCESS_TEXT.fonts, (v) =>
    setAccess(game, { font: v === 'readable' ? 'readable' : 'default' }),
  );
  const contrast = select(ACCESS_TEXT.contrastLabel, ACCESS_TEXT.contrasts, (v) =>
    setAccess(game, { contrast: v === 'high' ? 'high' : 'normal' }),
  );
  const row = document.createElement('label');
  row.className = 'check-row';
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.addEventListener('change', () => setAccess(game, { simpleTouch: cb.checked }));
  const text = document.createElement('span');
  const strong = document.createElement('strong');
  strong.textContent = ACCESS_TEXT.simpleTouch;
  const small = document.createElement('small');
  small.textContent = ACCESS_TEXT.simpleTouchHelp;
  text.append(strong, small);
  row.append(cb, text);
  body.appendChild(row);
  return (g) => {
    const a = accessOf(g.world);
    font.value = a.font;
    contrast.value = a.contrast;
    cb.checked = a.simpleTouch;
  };
}
