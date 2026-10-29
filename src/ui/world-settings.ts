import { WORLD_LOD } from '../config/tuning-world';
import { TRAVEL_TEXT, WORLD_SETTINGS_TEXT } from '../config/strings-world';
import type { Game } from '../game';
import type { Settings } from '../sim/types';
import { travelMode, type TravelMode } from '../sim/travel';

/**
 * Lane D's two phone-room settings, mounted under the minimap in Settings: "Zoom out when
 * running" (R0073, the survey step) and "Hide bar while walking" (R0106). Both are optional
 * fields of the saved settings; unset reads as on for a phone and off elsewhere.
 */
export function isPhoneScreen(): boolean {
  return Math.min(window.innerWidth, window.innerHeight) < WORLD_LOD.phoneMaxPx;
}

/** Whether an optional phone setting is on: the saved choice, or on for a phone when unset. */
export function phoneDefault(saved: boolean | undefined): boolean {
  return saved ?? isPhoneScreen();
}

type Key = 'surveyWhenRunning' | 'hideBarWhileWalking';

export function mountWorldSettings(body: HTMLElement, game: () => Game | null): (g: Game) => void {
  const rows: Array<[Key, HTMLInputElement]> = [];
  for (const key of ['surveyWhenRunning', 'hideBarWhileWalking'] as const) {
    const t = WORLD_SETTINGS_TEXT[key];
    const row = document.createElement('label');
    row.className = 'check-row';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.addEventListener('change', () => {
      const g = game();
      if (!g) return;
      const next: Settings = { ...g.world.settings, [key]: box.checked };
      g.send({ kind: 'setSettings', settings: next });
    });
    const text = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = t.label;
    const small = document.createElement('small');
    small.textContent = t.help;
    text.append(strong, small);
    row.append(box, text);
    body.appendChild(row);
    rows.push([key, box]);
  }
  const sync = mountTravelRow(body, game);
  return (g) => {
    for (const [key, box] of rows) box.checked = phoneDefault(g.world.settings[key]);
    sync(g);
  };
}

/** R0102: the Travel assist row, a select of Walk, Auto-walk and Skip with a line on each. */
function mountTravelRow(body: HTMLElement, game: () => Game | null): (g: Game) => void {
  const t = TRAVEL_TEXT;
  const row = document.createElement('label');
  row.className = 'check-row travel-row';
  const text = document.createElement('span');
  const strong = document.createElement('strong');
  strong.textContent = t.label;
  const small = document.createElement('small');
  text.append(strong, small);
  const select = document.createElement('select');
  select.className = 'travel-select';
  for (const mode of ['walk', 'auto', 'skip'] as const) {
    const o = document.createElement('option');
    o.value = mode;
    o.textContent = t.modes[mode];
    select.appendChild(o);
  }
  const help = (mode: TravelMode): void => {
    small.textContent = `${t.help} ${t.modeHelp[mode]}`;
  };
  select.addEventListener('change', () => {
    const g = game();
    if (!g) return;
    const mode = select.value as TravelMode;
    help(mode);
    const next: Settings = { ...g.world.settings, travel: mode };
    g.send({ kind: 'setSettings', settings: next });
  });
  row.append(text, select);
  body.appendChild(row);
  return (g) => {
    const mode = travelMode(g.world);
    select.value = mode;
    help(mode);
  };
}
