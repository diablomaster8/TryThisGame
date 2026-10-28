import type { OrbitCamera } from '../render/camera';
import type { Command } from '../sim/types';
import { JOYSTICK_TUNING as J } from '../config/tuning-move-joy';
import { el } from './dom';
import { inPadZone, stickState, stickToWorld, type Pt } from './joystick-math';
import '../move-joy.css';

/**
 * An optional on-screen joystick (off by default). It floats: the pad appears where a
 * thumb lands in the left share of the screen below the top bar, and follows the thumb
 * when it is dragged far. The stick is kept in screen space and turned by the camera's
 * yaw every frame (`poll`, called from the game loop like the keyboard), so rotating the
 * camera with the stick held changes the walking direction at once. The length of the
 * stick is the pace; held near the rim it auto-runs. It only sends input while held.
 */
export class Joystick {
  readonly root: HTMLDivElement;
  private readonly zone: HTMLDivElement;
  private readonly knob: HTMLDivElement;
  private pointerId: number | null = null;
  private centre: Pt = { x: 0, y: 0 };
  /** Stick vector in radius units, screen space (x right, y down). */
  private stick: Pt = { x: 0, y: 0 };
  private sent = { x: 0, z: 0 };
  private rimSince = 0;
  private autoRun = false;
  private enabled = false;

  constructor(
    parent: HTMLElement,
    private readonly camera: OrbitCamera,
    private readonly send: (cmd: Command) => void,
    private readonly run: { set: (on: boolean) => void; isOn: () => boolean },
  ) {
    this.zone = el('div', 'joystick-zone');
    this.zone.hidden = true;
    this.root = el('div', 'joystick');
    this.root.hidden = true;
    this.knob = el('div', 'joystick-knob');
    this.root.appendChild(this.knob);
    // Under every other HUD control, so buttons and panels keep their taps.
    parent.prepend(this.zone);
    parent.appendChild(this.root);
    this.root.style.setProperty('--joy-r', `${J.radius}px`);
    this.zone.addEventListener('pointerdown', this.onDown);
    this.zone.addEventListener('pointermove', this.onMove);
    this.zone.addEventListener('pointerup', this.onUp);
    this.zone.addEventListener('pointercancel', this.onUp);
    // Safety nets: a release anywhere, or losing focus, must never leave the Keeper walking.
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('blur', () => this.release());
  }

  setVisible(on: boolean): void {
    this.enabled = on;
    this.zone.hidden = !on;
    if (!on) this.release();
  }

  /** Called every frame: turn the held stick by the camera's current yaw. */
  poll(): void {
    if (this.pointerId === null) return;
    const len = Math.hypot(this.stick.x, this.stick.y);
    this.updateAutoRun(len);
    const w = stickToWorld(this.stick.x, this.stick.y, this.camera.currentYaw);
    if (Math.abs(w.x - this.sent.x) > 1e-4 || Math.abs(w.z - this.sent.z) > 1e-4) {
      this.sent = w;
      this.send({ kind: 'keeperInput', input: w });
    }
  }

  private updateAutoRun(len: number): void {
    const now = performance.now();
    if (len >= J.autoRunAt) {
      if (this.rimSince === 0) this.rimSince = now;
      if (!this.autoRun && now - this.rimSince >= J.autoRunMs && !this.run.isOn()) {
        this.autoRun = true;
        this.run.set(true);
      }
    } else {
      this.rimSince = 0;
      if (this.autoRun && len < J.autoRunOff) this.stopAutoRun();
    }
  }

  private stopAutoRun(): void {
    if (!this.autoRun) return;
    this.autoRun = false;
    this.run.set(false);
  }

  private readonly onDown = (e: PointerEvent): void => {
    if (this.pointerId !== null || !this.enabled) return;
    // Touch and pen only: a mouse keeps its clicks (and WASD).
    if (e.pointerType === 'mouse') return;
    const top = document.querySelector('.topbar')?.getBoundingClientRect().bottom ?? 0;
    if (!inPadZone(e.clientX, e.clientY, window.innerWidth, top)) return;
    this.pointerId = e.pointerId;
    try {
      this.zone.setPointerCapture(e.pointerId);
    } catch {
      /* a synthetic pointer has nothing to capture */
    }
    this.centre = { x: e.clientX, y: e.clientY };
    this.root.style.left = `${e.clientX}px`;
    this.root.style.top = `${e.clientY}px`;
    this.root.hidden = false;
    try {
      navigator.vibrate?.(J.hapticMs);
    } catch {
      /* haptics are a nicety */
    }
    this.onMove(e);
  };

  private readonly onMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return;
    const s = stickState(this.centre, { x: e.clientX, y: e.clientY });
    if (s.centre !== this.centre) {
      this.centre = s.centre;
      this.root.style.left = `${s.centre.x}px`;
      this.root.style.top = `${s.centre.y}px`;
    }
    this.stick = s.vec;
    this.knob.style.transform = `translate(${s.knob.x}px, ${s.knob.y}px)`;
    this.poll();
  };

  private readonly onUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return;
    this.release();
  };

  private release(): void {
    this.pointerId = null;
    this.stick = { x: 0, y: 0 };
    this.rimSince = 0;
    this.stopAutoRun();
    this.knob.style.transform = '';
    this.root.hidden = true;
    if (this.sent.x !== 0 || this.sent.z !== 0) {
      this.sent = { x: 0, z: 0 };
      this.send({ kind: 'keeperInput', input: this.sent });
    }
  }
}
