import { OFFLINE } from '../config/tuning';
import { UI_TEXT } from '../config/strings';
import type { Game } from '../game';
import { clearSave, downloadText, pickTextFile } from '../platform/storage';
import { deserialize, SaveError } from '../sim/save';
import type { OfflineMode, Settings } from '../sim/types';
import { createWorld } from '../sim/world';
import { button, el, modal } from './dom';

/** The Settings menu: Aging while closed, departures toggle, save export/import/reset. */
export class SettingsMenu {
  private readonly dialog;
  private readonly modeInputs = new Map<OfflineMode, HTMLInputElement>();
  private readonly capInput: HTMLInputElement;
  private readonly capError: HTMLDivElement;
  private readonly departures: HTMLInputElement;
  private readonly departuresRow: HTMLLabelElement;
  private readonly sound: HTMLInputElement;
  private readonly music: HTMLInputElement;
  private readonly joystick: HTMLInputElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, UI_TEXT.settings, UI_TEXT.close);
    const body = this.dialog.body;

    const section = el('fieldset', 'settings-section');
    section.appendChild(el('legend', undefined, UI_TEXT.offlineAgingTitle));
    section.appendChild(el('p', 'help', UI_TEXT.offlineAgingHelp));
    const modes: Array<[OfflineMode, string, string]> = [
      ['indefinite', UI_TEXT.modeIndefinite, UI_TEXT.modeIndefiniteHelp],
      ['capped', UI_TEXT.modeCapped, UI_TEXT.modeCappedHelp],
      ['off', UI_TEXT.modeOff, UI_TEXT.modeOffHelp],
    ];
    for (const [mode, label, help] of modes) {
      const row = el('label', 'radio-row');
      const input = el('input');
      input.type = 'radio';
      input.name = 'offline-mode';
      input.value = mode;
      input.addEventListener('change', () => this.apply());
      this.modeInputs.set(mode, input);
      const text = el('span');
      text.append(el('strong', undefined, label), el('small', undefined, help));
      row.append(input, text);
      section.appendChild(row);
    }

    const capRow = el('label', 'field-row');
    capRow.appendChild(el('span', undefined, UI_TEXT.capHours));
    this.capInput = el('input');
    this.capInput.type = 'number';
    this.capInput.inputMode = 'numeric';
    this.capInput.min = String(OFFLINE.minCapHours);
    this.capInput.max = String(OFFLINE.maxCapHours);
    this.capInput.step = '1';
    this.capInput.addEventListener('input', () => this.apply());
    capRow.appendChild(this.capInput);
    this.capError = el('div', 'field-error', UI_TEXT.capHoursError);
    this.capError.hidden = true;
    section.append(capRow, this.capError);

    this.departuresRow = el('label', 'check-row');
    this.departures = el('input');
    this.departures.type = 'checkbox';
    this.departures.addEventListener('change', () => this.apply());
    const dText = el('span');
    dText.append(
      el('strong', undefined, UI_TEXT.allowDepartures),
      el('small', undefined, UI_TEXT.allowDeparturesHelp),
    );
    this.departuresRow.append(this.departures, dText);
    section.appendChild(this.departuresRow);
    body.appendChild(section);

    const musicRow = el('label', 'check-row');
    this.music = el('input');
    this.music.type = 'checkbox';
    this.music.addEventListener('change', () => this.apply());
    const mText = el('span');
    mText.append(el('strong', undefined, UI_TEXT.music), el('small', undefined, UI_TEXT.musicHelp));
    musicRow.append(this.music, mText);
    body.appendChild(musicRow);

    const soundRow = el('label', 'check-row');
    this.sound = el('input');
    this.sound.type = 'checkbox';
    this.sound.addEventListener('change', () => this.apply());
    const sText = el('span');
    sText.append(el('strong', undefined, UI_TEXT.sound), el('small', undefined, UI_TEXT.soundHelp));
    soundRow.append(this.sound, sText);
    body.appendChild(soundRow);

    const joyRow = el('label', 'check-row');
    this.joystick = el('input');
    this.joystick.type = 'checkbox';
    this.joystick.addEventListener('change', () => this.apply());
    const jText = el('span');
    jText.append(
      el('strong', undefined, UI_TEXT.joystick),
      el('small', undefined, UI_TEXT.joystickHelp),
    );
    joyRow.append(this.joystick, jText);
    body.appendChild(joyRow);

    const saves = el('div', 'settings-actions');
    saves.append(
      button(UI_TEXT.exportSave, () => this.exportSave()),
      button(UI_TEXT.importSave, () => void this.importSave()),
      button(UI_TEXT.resetSave, () => this.reset(), 'btn btn-danger'),
    );
    body.appendChild(saves);
  }

  open(): void {
    const g = this.game();
    if (!g) return;
    const s = g.world.settings.offlineAging;
    for (const [mode, input] of this.modeInputs) input.checked = mode === s.mode;
    this.capInput.value = String(s.capHours);
    this.capError.hidden = true;
    this.departures.checked = s.allowOfflineDepartures;
    this.sound.checked = g.world.settings.sound;
    this.music.checked = g.world.settings.music;
    this.joystick.checked = g.world.settings.joystick;
    this.syncEnabled(s.mode);
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private currentMode(): OfflineMode {
    for (const [mode, input] of this.modeInputs) if (input.checked) return mode;
    return OFFLINE.defaultMode;
  }

  private syncEnabled(mode: OfflineMode): void {
    this.capInput.disabled = mode !== 'capped';
    // With mode off no time passes, so the toggle has no effect: show it disabled.
    this.departures.disabled = mode === 'off';
    this.departuresRow.classList.toggle('disabled', mode === 'off');
  }

  /** Validate and push the settings into the sim. Invalid hours keep the old value. */
  private apply(): void {
    const g = this.game();
    if (!g) return;
    const mode = this.currentMode();
    this.syncEnabled(mode);
    const prev = g.world.settings;
    const raw = this.capInput.value.trim();
    const hours = Number(raw);
    const valid =
      raw !== '' &&
      Number.isInteger(hours) &&
      hours >= OFFLINE.minCapHours &&
      hours <= OFFLINE.maxCapHours;
    this.capError.hidden = valid || mode !== 'capped';
    const settings: Settings = {
      ...prev,
      sound: this.sound.checked,
      music: this.music.checked,
      joystick: this.joystick.checked,
      offlineAging: {
        mode,
        capHours: valid ? hours : prev.offlineAging.capHours,
        allowOfflineDepartures: this.departures.checked,
      },
    };
    g.send({ kind: 'setSettings', settings });
  }

  private exportSave(): void {
    const g = this.game();
    if (!g) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadText(`grove-save-${stamp}.json`, g.exportJson());
  }

  private async importSave(): Promise<void> {
    const g = this.game();
    if (!g) return;
    const text = await pickTextFile();
    if (text === null) return;
    try {
      const file = deserialize(text);
      g.replaceWorld(file.world);
      this.close();
      this.toast(UI_TEXT.saved);
    } catch (err) {
      this.toast(err instanceof SaveError ? UI_TEXT.importError : UI_TEXT.importError);
    }
  }

  private reset(): void {
    const g = this.game();
    if (!g) return;
    if (!window.confirm(UI_TEXT.resetConfirm)) return;
    clearSave();
    const now = Date.now();
    g.replaceWorld(createWorld(now % 2147483647, now));
    this.close();
  }
}
