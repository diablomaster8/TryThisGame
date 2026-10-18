import { OFFLINE, SAVE_SAFETY } from '../config/tuning';
import { SLOT_TEXT, TRAINER_LABELS, UI_TEXT } from '../config/strings';
import { SONG_NAMES } from '../platform/audio';
import { TRAINERS } from '../sim/trainers';
import type { Game } from '../game';
import {
  clearSave,
  currentSlot,
  downloadText,
  markResumeSlot,
  modeOfWorld,
  pickTextFile,
  readUnreadable,
  writeGraphicsPref,
} from '../platform/storage';
import { deserialize, importProblem } from '../sim/save';
import { matureControlVisible, matureRaiseNeedsGate } from '../sim/audience';
import type { MatureContent, OfflineMode, Settings } from '../sim/types';
import { createWorld } from '../sim/world';
import { button, el, modal } from './dom';
import { askGrownUp } from './grown-up-gate';

/** The Settings menu: Aging while closed, departures toggle, save export/import/reset. */
export class SettingsMenu {
  private readonly dialog;
  private readonly modeInputs = new Map<OfflineMode, HTMLInputElement>();
  private readonly capInput: HTMLInputElement;
  private readonly capError: HTMLDivElement;
  /** Shown only when this slot's save once failed to load and a copy was kept. */
  private readonly unreadableBtn: HTMLButtonElement;
  private readonly departures: HTMLInputElement;
  private readonly departuresRow: HTMLLabelElement;
  private readonly sound: HTMLInputElement;
  private readonly music: HTMLInputElement;
  private readonly musicVol: HTMLInputElement;
  private readonly sfxVol: HTMLInputElement;
  private readonly matureSection: HTMLFieldSetElement;
  private readonly matureInputs = new Map<MatureContent, HTMLInputElement>();
  private readonly textSpeed: HTMLSelectElement;
  private readonly shake: HTMLInputElement;
  private readonly particles: HTMLSelectElement;
  private readonly reduced: HTMLSelectElement;
  private readonly graphics: HTMLSelectElement;
  private readonly joystick: HTMLInputElement;
  private readonly jukebox: HTMLSelectElement;
  private readonly ambience: HTMLInputElement;
  private readonly coop: HTMLInputElement;
  private readonly coopTrainer: HTMLSelectElement;

  constructor(
    private readonly parent: HTMLElement,
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

    // Never shown in a Learning Grove save: that mode only ever offers `all` stories.
    this.matureSection = el('fieldset', 'settings-section');
    this.matureSection.appendChild(el('legend', undefined, UI_TEXT.matureTitle));
    this.matureSection.appendChild(el('p', 'help', UI_TEXT.matureHelp));
    const matureOptions: Array<[MatureContent, string, string]> = [
      ['off', UI_TEXT.matureOff, UI_TEXT.matureOffHelp],
      ['teen', UI_TEXT.matureTeen, UI_TEXT.matureTeenHelp],
      ['adult', UI_TEXT.matureAdult, UI_TEXT.matureAdultHelp],
    ];
    for (const [value, label, help] of matureOptions) {
      const row = el('label', 'radio-row');
      const input = el('input');
      input.type = 'radio';
      input.name = 'mature-content';
      input.value = value;
      input.addEventListener('change', () => this.changeMature(value));
      this.matureInputs.set(value, input);
      const text = el('span');
      text.append(el('strong', undefined, label), el('small', undefined, help));
      row.append(input, text);
      this.matureSection.appendChild(row);
    }
    body.appendChild(this.matureSection);

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

    // Sliders and the rest.
    const slider = (label: string) => {
      const row = el('label', 'field-row');
      const input = el('input');
      input.type = 'range';
      input.min = '0';
      input.max = '100';
      input.step = '5';
      input.addEventListener('input', () => this.apply());
      row.append(el('strong', undefined, label), input);
      body.appendChild(row);
      return input;
    };
    // One change handler per select: the co-op Keeper's runs only `applyCoop` (review C, 27).
    const select = (
      label: string,
      options: Record<string, string>,
      onChange: () => void = () => this.apply(),
    ) => {
      const row = el('label', 'field-row');
      const sel = el('select');
      for (const [value, text] of Object.entries(options)) {
        const o = el('option', undefined, text);
        o.value = value;
        sel.appendChild(o);
      }
      sel.addEventListener('change', onChange);
      row.append(el('strong', undefined, label), sel);
      body.appendChild(row);
      return sel;
    };
    this.musicVol = slider(UI_TEXT.musicVolume);
    this.sfxVol = slider(UI_TEXT.sfxVolume);
    this.textSpeed = select(UI_TEXT.textSpeed, UI_TEXT.textSpeeds);
    const shakeRow = el('label', 'check-row');
    this.shake = el('input');
    this.shake.type = 'checkbox';
    this.shake.addEventListener('change', () => this.apply());
    const shText = el('span');
    shText.append(
      el('strong', undefined, UI_TEXT.screenShake),
      el('small', undefined, UI_TEXT.screenShakeHelp),
    );
    shakeRow.append(this.shake, shText);
    body.appendChild(shakeRow);
    this.particles = select(UI_TEXT.particlesLabel, UI_TEXT.particleLevels);
    this.reduced = select(UI_TEXT.reducedMotionLabel, UI_TEXT.reducedMotionLevels);
    this.graphics = select(UI_TEXT.graphicsLabel, UI_TEXT.graphicsLevels);
    body.appendChild(el('div', 'help', UI_TEXT.graphicsHelp));
    // Jukebox and ambience.
    const songs: Record<string, string> = { '': UI_TEXT.jukeboxAuto };
    for (const s of SONG_NAMES) songs[s] = UI_TEXT.songNames[s] ?? s;
    this.jukebox = select(UI_TEXT.jukebox, songs);
    const ambRow = el('label', 'check-row');
    this.ambience = el('input');
    this.ambience.type = 'checkbox';
    this.ambience.addEventListener('change', () => this.apply());
    const aText = el('span');
    aText.append(
      el('strong', undefined, UI_TEXT.ambience),
      el('small', undefined, UI_TEXT.ambienceHelp),
    );
    ambRow.append(this.ambience, aText);
    body.appendChild(ambRow);
    // Local co-op.
    const coopRow = el('label', 'check-row');
    this.coop = el('input');
    this.coop.type = 'checkbox';
    this.coop.addEventListener('change', () => this.applyCoop());
    const cText = el('span');
    cText.append(el('strong', undefined, UI_TEXT.coop), el('small', undefined, UI_TEXT.coopHelp));
    coopRow.append(this.coop, cText);
    body.appendChild(coopRow);
    const trainers: Record<string, string> = {};
    for (const t of TRAINERS) trainers[t.id] = TRAINER_LABELS[t.id]?.name ?? t.id;
    this.coopTrainer = select(UI_TEXT.coopTrainer, trainers, () => this.applyCoop());
    const screen = el('div', 'settings-actions');
    screen.append(
      button(UI_TEXT.fullscreen, () => {
        if (document.fullscreenElement) void document.exitFullscreen?.();
        else void document.documentElement.requestFullscreen?.().catch(() => undefined);
      }),
      button(UI_TEXT.backToTitle, () => {
        this.game()?.save();
        location.href = location.pathname;
      }),
    );
    body.appendChild(screen);

    const slot = currentSlot();
    body.appendChild(
      el('p', 'help', SLOT_TEXT.current(SLOT_TEXT.modes[slot.mode] ?? slot.mode, slot.index)),
    );
    const saves = el('div', 'settings-actions');
    saves.append(
      button(UI_TEXT.exportSave, () => this.exportSave()),
      button(UI_TEXT.importSave, () => void this.importSave()),
      button(UI_TEXT.resetSave, () => this.reset(), 'btn btn-danger'),
    );
    this.unreadableBtn = button(UI_TEXT.exportUnreadable, () => this.exportUnreadable());
    this.unreadableBtn.hidden = true;
    saves.append(this.unreadableBtn);
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
    this.unreadableBtn.hidden = !g.unreadableJson && readUnreadable(currentSlot()).length === 0;
    for (const [value, input] of this.matureInputs)
      input.checked = value === g.world.settings.matureContent;
    this.matureSection.hidden = !matureControlVisible({
      learningGrove: currentSlot().mode === 'edu',
    });
    this.sound.checked = g.world.settings.sound;
    this.music.checked = g.world.settings.music;
    this.musicVol.value = String(Math.round(g.world.settings.musicVolume * 100));
    this.sfxVol.value = String(Math.round(g.world.settings.sfxVolume * 100));
    this.textSpeed.value = g.world.settings.textSpeed;
    this.shake.checked = g.world.settings.screenShake;
    this.particles.value = g.world.settings.particles;
    this.reduced.value = g.world.settings.reducedMotion;
    this.graphics.value = g.world.settings.graphics;
    this.joystick.checked = g.world.settings.joystick;
    this.jukebox.value = g.world.settings.jukebox ?? '';
    this.ambience.checked = g.world.settings.ambience;
    this.coop.checked = g.world.coop.active;
    this.coopTrainer.value = g.world.coop.trainer;
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

  private currentMature(fallback: MatureContent): MatureContent {
    for (const [value, input] of this.matureInputs) if (input.checked) return value;
    return fallback;
  }

  private checkMature(value: MatureContent): void {
    for (const [v, input] of this.matureInputs) input.checked = v === value;
  }

  /** Lowering applies at once; raising waits for a grown-up to answer the sum gate. */
  private changeMature(value: MatureContent): void {
    const g = this.game();
    if (!g) return;
    const from = g.world.settings.matureContent;
    if (!matureRaiseNeedsGate(from, value)) {
      this.apply();
      return;
    }
    this.checkMature(from);
    void askGrownUp(this.parent, this.toast).then((ok) => {
      if (!ok || this.game() !== g) return;
      this.checkMature(value);
      this.apply();
    });
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
      matureContent: this.currentMature(prev.matureContent),
      sound: this.sound.checked,
      music: this.music.checked,
      musicVolume: Number(this.musicVol.value) / 100,
      sfxVolume: Number(this.sfxVol.value) / 100,
      textSpeed: this.textSpeed.value as Settings['textSpeed'],
      screenShake: this.shake.checked,
      particles: this.particles.value as Settings['particles'],
      reducedMotion: this.reduced.value as Settings['reducedMotion'],
      graphics: this.graphics.value === '3d' ? '3d' : 'pixel',
      joystick: this.joystick.checked,
      jukebox: this.jukebox.value || null,
      ambience: this.ambience.checked,
      offlineAging: {
        mode,
        capHours: valid ? hours : prev.offlineAging.capHours,
        allowOfflineDepartures: this.departures.checked,
      },
    };
    g.send({ kind: 'setSettings', settings });
    // The renderer is picked when the game starts, so a change saves and reloads.
    if (settings.graphics !== prev.graphics) {
      writeGraphicsPref(settings.graphics);
      g.world.settings = settings;
      g.save();
      // Back into this same slot after the reload, as the help text promises.
      markResumeSlot(currentSlot());
      location.reload();
    }
  }

  private applyCoop(): void {
    const g = this.game();
    if (!g) return;
    g.send({ kind: 'setCoop', active: this.coop.checked, trainer: this.coopTrainer.value });
  }

  private exportSave(): void {
    const g = this.game();
    if (!g) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadText(`grove-save-${stamp}.json`, g.exportJson());
  }

  /** The newest copy of a save that failed to load, as a file the player can keep. */
  private exportUnreadable(): void {
    const g = this.game();
    const json = readUnreadable(currentSlot())[0] ?? g?.unreadableJson ?? null;
    if (json === null) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadText(`grove-save-unreadable-${stamp}.json`, json);
  }

  /**
   * Import over the current slot, but only a sound save of the same mode, and only after
   * the player confirms. Mature content always comes back Off: a file is not a grown-up.
   */
  private async importSave(): Promise<void> {
    const g = this.game();
    if (!g) return;
    const text = await pickTextFile();
    if (text === null) return;
    if (text.length > SAVE_SAFETY.importMaxBytes) {
      this.toast(UI_TEXT.importTooBig);
      return;
    }
    let file: ReturnType<typeof deserialize>;
    try {
      file = deserialize(text);
    } catch {
      this.toast(UI_TEXT.importError);
      return;
    }
    const problem = importProblem(file.world);
    if (problem) {
      console.warn('Import refused:', problem);
      this.toast(UI_TEXT.importError);
      return;
    }
    const slot = currentSlot();
    const mode = modeOfWorld(file.world);
    const modeName = (m: string) => SLOT_TEXT.modes[m] ?? m;
    if (mode !== slot.mode) {
      this.toast(UI_TEXT.importWrongMode(modeName(mode), modeName(slot.mode)));
      return;
    }
    const slotName = `${modeName(slot.mode)}, ${SLOT_TEXT.slot(slot.index)}`;
    if (!window.confirm(UI_TEXT.importConfirm(slotName))) return;
    file.world.settings.matureContent = 'off';
    file.world.settings.riftConfirmed = false;
    g.replaceWorld(file.world);
    this.close();
    this.toast(UI_TEXT.saved);
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
