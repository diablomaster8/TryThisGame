import { WORLD_LOD } from '../config/tuning-world';
import { WORLD_SETTINGS_TEXT } from '../config/strings-world';
import type { Game } from '../game';
import type { Settings } from '../sim/types';

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
  return (g) => {
    for (const [key, box] of rows) box.checked = phoneDefault(g.world.settings[key]);
  };
}
