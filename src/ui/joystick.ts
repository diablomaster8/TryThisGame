import type { OrbitCamera } from '../render/camera';
import type { Command } from '../sim/types';
import { el } from './dom';

/**
 * An optional on-screen joystick (off by default): a thumb pad in the bottom-left that
 * moves the Keeper relative to the camera, like WASD. It only sends input while held.
 */
export class Joystick {
  readonly root: HTMLDivElement;
  private readonly knob: HTMLDivElement;
  private pointerId: number | null = null;
  private centre = { x: 0, y: 0 };
  private vec = { x: 0, z: 0 };
  private readonly radius = 36;

  constructor(
    parent: HTMLElement,
    private readonly camera: OrbitCamera,
    private readonly send: (cmd: Command) => void,
  ) {
    this.root = el('div', 'joystick');
    this.root.hidden = true;
    this.knob = el('div', 'joystick-knob');
    this.root.appendChild(this.knob);
    parent.appendChild(this.root);
    this.root.addEventListener('pointerdown', this.onDown);
    this.root.addEventListener('pointermove', this.onMove);
    this.root.addEventListener('pointerup', this.onUp);
    this.root.addEventListener('pointercancel', this.onUp);
  }

  setVisible(on: boolean): void {
    this.root.hidden = !on;
    if (!on) this.release();
  }

  private readonly onDown = (e: PointerEvent): void => {
    if (this.pointerId !== null) return;
    this.pointerId = e.pointerId;
    this.root.setPointerCapture(e.pointerId);
    const r = this.root.getBoundingClientRect();
    this.centre = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    this.onMove(e);
  };

  private readonly onMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return;
    let dx = e.clientX - this.centre.x;
    let dy = e.clientY - this.centre.y;
    const len = Math.hypot(dx, dy);
    if (len > this.radius) {
      dx *= this.radius / len;
      dy *= this.radius / len;
    }
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    // Screen up = camera forward on the ground; screen right = camera right.
    const fwd = -dy / this.radius;
    const right = dx / this.radius;
    const yaw = this.camera.currentYaw;
    const x = -Math.sin(yaw) * fwd + Math.cos(yaw) * right;
    const z = -Math.cos(yaw) * fwd - Math.sin(yaw) * right;
    const dead = Math.hypot(x, z) < 0.15;
    this.vec = dead ? { x: 0, z: 0 } : { x, z };
    this.send({ kind: 'keeperInput', input: this.vec });
  };

  private readonly onUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return;
    this.release();
  };

  private release(): void {
    this.pointerId = null;
    this.knob.style.transform = '';
    if (this.vec.x !== 0 || this.vec.z !== 0) {
      this.vec = { x: 0, z: 0 };
      this.send({ kind: 'keeperInput', input: this.vec });
    }
  }
}
