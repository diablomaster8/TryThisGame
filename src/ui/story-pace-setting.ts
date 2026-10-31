/**
 * Lane C round 10, agent C (R0614, CAMP-22): Settings → Story pace, self-contained like the
 * Minimap row. It appends its own select and one-line help to `body`, saves through
 * `setSettings` and returns a function that refreshes the row when the menu opens. Hidden in
 * the Learning Grove's sprout band, where skips are hidden already.
 */
import { PACE_TEXT } from '../config/strings';
import type { Game } from '../game';
import type { StoryPace } from '../sim/types';
import { storyPaceOf } from '../sim/story-pace';

export function mountStoryPaceSetting(
  body: HTMLElement,
  game: () => Game | null,
): (g: Game) => void {
  const row = document.createElement('label');
  row.className = 'field-row story-pace-row';
  const label = document.createElement('strong');
  label.textContent = PACE_TEXT.label;
  const sel = document.createElement('select');
  for (const [value, text] of Object.entries(PACE_TEXT.options)) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = text;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => {
    const g = game();
    if (!g) return;
    g.send({
      kind: 'setSettings',
      settings: { ...g.world.settings, storyPace: sel.value as StoryPace },
    });
  });
  row.append(label, sel);
  const help = document.createElement('div');
  help.className = 'help';
  help.textContent = PACE_TEXT.help;
  body.append(row, help);
  return (g) => {
    sel.value = storyPaceOf(g.world);
    const hide = g.world.edu?.band === 'sprout';
    row.hidden = hide;
    help.hidden = hide;
  };
}
