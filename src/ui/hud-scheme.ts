/**
 * R0519 (TECH-78): the HUD colours setting. The HUD is dark by default (the game's look);
 * "Follow system" puts `hud-follow-scheme` on the root, and the stylesheet then turns the
 * always-on chrome light under `prefers-color-scheme: light`. A self-contained Settings row.
 */
import { HUD_SCHEME_TEXT } from '../config/strings-r10d2';
import type { Game } from '../game';
import type { Settings, World } from '../sim/types';

let applied: boolean | null = null;

/** Mirror the setting on the root element; cheap to call every frame (writes on change only). */
export function applyHudScheme(world: World): void {
  const follow = world.settings.hudColours === 'system';
  if (follow === applied || typeof document === 'undefined') return;
  applied = follow;
  document.documentElement.classList.toggle('hud-follow-scheme', follow);
}

export function mountHudSchemeSetting(
  body: HTMLElement,
  game: () => Game | null,
): (g: Game) => void {
  const row = document.createElement('label');
  row.className = 'field-row';
  const label = document.createElement('strong');
  label.textContent = HUD_SCHEME_TEXT.label;
  const sel = document.createElement('select');
  for (const [value, text] of Object.entries(HUD_SCHEME_TEXT.levels)) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = text;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => {
    const g = game();
    if (!g) return;
    const hudColours: Settings['hudColours'] = sel.value === 'system' ? 'system' : 'dark';
    g.send({ kind: 'setSettings', settings: { ...g.world.settings, hudColours } });
  });
  row.append(label, sel);
  const help = document.createElement('div');
  help.className = 'help';
  help.textContent = HUD_SCHEME_TEXT.help;
  body.append(row, help);
  return (g) => {
    sel.value = g.world.settings.hudColours === 'system' ? 'system' : 'dark';
  };
}
