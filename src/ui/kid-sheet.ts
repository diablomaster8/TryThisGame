/**
 * R0671 (KIDS-06): in a Learning Grove the ⚙ button opens this kid-safe sheet, sound on or
 * off and one big volume slider, with no gate. Everything else in Settings (reset, back to
 * title, aging, import) sits behind the grown-up sum gate, reached from the sheet's last
 * button. The routing is pure so the tests can drive it without a DOM.
 */
import { KID_SHEET_TEXT } from '../config/strings-kids';
import type { Game } from '../game';
import { setMusicEnabled, setMusicVolume, setSfxVolume, setSoundEnabled } from '../platform/audio';
import { button, el, modal } from './dom';

export interface SettingsRoute {
  openFull(): void;
  openQuick(): void;
  ask(): Promise<boolean>;
}

/**
 * What a ⚙ tap does: the full Settings outside a Learning Grove, the quick sheet inside one.
 * `fromQuick` is the sheet's "Grown-up settings" button, which opens the full panel only past
 * the gate. Resolves true when the full panel opened.
 */
export async function routeSettingsTap(
  edu: boolean,
  r: SettingsRoute,
  fromQuick = false,
): Promise<boolean> {
  if (!edu) {
    r.openFull();
    return true;
  }
  if (!fromQuick) {
    r.openQuick();
    return false;
  }
  if (!(await r.ask())) return false;
  r.openFull();
  return true;
}

/**
 * Reset save: a Learning Grove asks the gate before the confirm, so two taps by a child
 * cannot erase the Grove. Resolves true when the reset should go ahead.
 */
export async function resetAllowed(
  edu: boolean,
  ask: () => Promise<boolean>,
  confirm: () => boolean | Promise<boolean>,
): Promise<boolean> {
  if (edu && !(await ask())) return false;
  return await confirm();
}

export class KidSoundSheet {
  private readonly dialog;
  private readonly toggle: HTMLButtonElement;
  private readonly volume: HTMLInputElement;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    grownUps: () => void,
  ) {
    this.dialog = modal(parent, KID_SHEET_TEXT.title, '✕');
    this.dialog.root.classList.add('kid-sheet');
    const body = this.dialog.body;
    this.toggle = button('', () => this.flip(), 'btn btn-primary kid-sheet-toggle');
    const label = el('label', 'kid-sheet-volume');
    label.appendChild(el('span', undefined, `🔉 ${KID_SHEET_TEXT.volume} 🔊`));
    this.volume = el('input');
    this.volume.type = 'range';
    this.volume.min = '0';
    this.volume.max = '100';
    this.volume.step = '5';
    this.volume.setAttribute('aria-label', KID_SHEET_TEXT.volume);
    this.volume.addEventListener('input', () => this.setVolume(Number(this.volume.value) / 100));
    label.appendChild(this.volume);
    const grown = button(
      `🧑‍🏫 ${KID_SHEET_TEXT.grownUps}`,
      () => {
        this.close();
        grownUps();
      },
      'btn btn-small',
    );
    body.append(this.toggle, label, grown);
  }

  open(): void {
    this.sync();
    this.dialog.show();
  }

  close(): void {
    this.dialog.hide();
  }

  isOpen(): boolean {
    return this.dialog.isOpen();
  }

  private sync(): void {
    const s = this.game()?.world.settings;
    if (!s) return;
    this.toggle.textContent = s.sound
      ? `🔊 ${KID_SHEET_TEXT.soundOn}`
      : `🔇 ${KID_SHEET_TEXT.soundOff}`;
    this.toggle.setAttribute('aria-pressed', String(s.sound));
    this.volume.value = String(Math.round(Math.max(s.sfxVolume, s.musicVolume) * 100));
  }

  private flip(): void {
    const g = this.game();
    if (!g) return;
    const on = !g.world.settings.sound;
    g.send({ kind: 'setSettings', settings: { ...g.world.settings, sound: on, music: on } });
    setSoundEnabled(on);
    setMusicEnabled(on);
    // The command lands on the next step; show the new state now.
    this.toggle.textContent = on ? `🔊 ${KID_SHEET_TEXT.soundOn}` : `🔇 ${KID_SHEET_TEXT.soundOff}`;
    this.toggle.setAttribute('aria-pressed', String(on));
  }

  /** One slider for both: music and effects move together. */
  private setVolume(v: number): void {
    const g = this.game();
    if (!g) return;
    g.send({
      kind: 'setSettings',
      settings: { ...g.world.settings, sfxVolume: v, musicVolume: v },
    });
    setSfxVolume(v);
    setMusicVolume(v);
  }
}
