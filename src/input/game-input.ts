import { INPUT, THROW } from '../config/tuning';
import type { OrbitCamera } from '../render/camera';
import type { Picker } from '../render/picker';
import type { Command, Vec2 } from '../sim/types';
import type { Object3D } from 'three';

export interface InputHost {
  camera: OrbitCamera;
  picker: Picker;
  pickables(): Object3D[];
  /** Hit-test the batched sprites at a screen point (NDC). */
  pickSprite(ndcX: number, ndcY: number): { kind: 'nubbin' | 'item' | 'npc'; id: string } | null;
  /** Is this Nubbin id something that can be grabbed right now? */
  canGrab(id: string): boolean;
  send(cmd: Command): void;
  /** Called on a tap that selected or deselected something. */
  onSelect(id: string | null): void;
}

interface Sample {
  pos: Vec2;
  t: number;
}

/**
 * Single-pointer game input: tap the ground to walk, tap a Nubbin or item to select,
 * drag a Nubbin to lift and throw it, shake while dragging. Keyboard WASD/arrows move
 * the Keeper relative to the camera. Two-finger gestures belong to CameraControls; when
 * a second pointer appears any drag is dropped gently.
 */
export class GameInput {
  private readonly abort = new AbortController();
  private readonly keys = new Set<string>();
  private pointerId: number | null = null;
  private pointerCount = 0;
  private downAt = 0;
  private downClient: Vec2 = { x: 0, z: 0 };
  private pressed: { kind: string; id: string } | null = null;
  private dragging: string | null = null;
  private samples: Sample[] = [];
  private lastDx = 0;
  private reversals: number[] = [];
  private lastInput: Vec2 = { x: 0, z: 0 };

  constructor(
    private readonly surface: HTMLElement,
    private readonly host: InputHost,
  ) {
    const { signal } = this.abort;
    surface.addEventListener('pointerdown', this.onDown, { signal });
    surface.addEventListener('pointermove', this.onMove, { signal });
    surface.addEventListener('pointerup', this.onUp, { signal });
    surface.addEventListener('pointercancel', this.onUp, { signal });
    window.addEventListener('keydown', this.onKey, { signal });
    window.addEventListener('keyup', this.onKey, { signal });
    window.addEventListener('blur', () => this.keys.clear(), { signal });
  }

  dispose(): void {
    this.abort.abort();
  }

  /** Call once per frame: turns held keys into a Keeper input vector relative to the camera. */
  pollKeyboard(): void {
    let fwd = 0;
    let right = 0;
    if (this.keys.has('w') || this.keys.has('arrowup')) fwd += 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) fwd -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) right += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) right -= 1;
    const yaw = this.host.camera.currentYaw;
    // Camera forward on the ground is -(sin yaw, cos yaw); right is (cos yaw, -sin yaw).
    const x = -Math.sin(yaw) * fwd + Math.cos(yaw) * right;
    const z = -Math.cos(yaw) * fwd - Math.sin(yaw) * right;
    if (x !== this.lastInput.x || z !== this.lastInput.z) {
      this.lastInput = { x, z };
      this.host.send({ kind: 'keeperInput', input: { x, z } });
    }
  }

  private readonly onKey = (e: KeyboardEvent): void => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const key = e.key.toLowerCase();
    if (e.type === 'keydown') {
      this.keys.add(key);
      if (key === ' ' && !e.repeat) {
        this.host.send({ kind: 'shakeHeld' });
        e.preventDefault();
      }
    } else {
      this.keys.delete(key);
    }
  };

  private readonly onDown = (e: PointerEvent): void => {
    this.pointerCount += 1;
    if (this.pointerCount > 1) {
      this.cancelDrag();
      return;
    }
    if (!e.isPrimary) return;
    this.pointerId = e.pointerId;
    this.downAt = performance.now();
    this.downClient = { x: e.clientX, z: e.clientY };
    const hit = this.host.picker.pick(
      e.clientX,
      e.clientY,
      this.host.camera.camera,
      this.host.pickables(),
      this.host.pickSprite,
    );
    this.pressed = hit && hit.kind !== 'ground' ? { kind: hit.kind, id: hit.id } : null;
    this.samples = [];
    this.reversals = [];
    this.lastDx = 0;
  };

  private readonly onMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId || this.pointerCount > 1) return;
    const dx = e.clientX - this.downClient.x;
    const dy = e.clientY - this.downClient.z;
    if (!this.dragging) {
      if (!this.pressed || this.pressed.kind !== 'nubbin') return;
      if (Math.hypot(dx, dy) < INPUT.dragThresholdPx) return;
      if (!this.host.canGrab(this.pressed.id)) return;
      this.dragging = this.pressed.id;
      this.host.send({ kind: 'grab', nubbinId: this.dragging });
    }
    const ground = this.host.picker.groundPoint(e.clientX, e.clientY, this.host.camera.camera);
    if (!ground) return;
    const now = performance.now();
    this.samples.push({ pos: ground, t: now });
    while (this.samples.length > 8) this.samples.shift();
    this.host.send({ kind: 'drag', pos: ground });

    // Shake: rapid horizontal reversals.
    const mx = e.movementX || 0;
    if (mx !== 0) {
      if ((mx > 0 && this.lastDx < 0) || (mx < 0 && this.lastDx > 0)) {
        this.reversals.push(now);
        this.reversals = this.reversals.filter((t) => now - t < 1000);
        if (this.reversals.length >= INPUT.shakeReversalsPerSecond) {
          this.host.send({ kind: 'shakeHeld' });
          this.reversals = [];
        }
      }
      this.lastDx = mx;
    }
  };

  private readonly onUp = (e: PointerEvent): void => {
    this.pointerCount = Math.max(0, this.pointerCount - 1);
    if (e.pointerId !== this.pointerId) return;
    this.pointerId = null;
    const now = performance.now();
    if (this.dragging) {
      this.host.send({ kind: 'release', vel: this.releaseVelocity(now) });
      this.dragging = null;
      this.pressed = null;
      return;
    }
    const moved = Math.hypot(e.clientX - this.downClient.x, e.clientY - this.downClient.z);
    const quick = now - this.downAt <= INPUT.tapMaxMs;
    if (moved <= INPUT.dragThresholdPx && quick) this.tap(e);
    this.pressed = null;
  };

  private tap(e: PointerEvent): void {
    const hit = this.host.picker.pick(
      e.clientX,
      e.clientY,
      this.host.camera.camera,
      this.host.pickables(),
      this.host.pickSprite,
    );
    if (!hit) return;
    switch (hit.kind) {
      case 'nubbin':
        this.host.send({ kind: 'select', id: hit.id });
        this.host.onSelect(hit.id);
        return;
      case 'item':
        this.host.send({ kind: 'collect', itemId: hit.id });
        return;
      case 'tree':
        this.host.send({ kind: 'shakeTree', treeId: hit.id });
        return;
      case 'npc':
        this.host.send({ kind: 'talk', npcId: hit.id });
        return;
      case 'lantern':
        this.host.send({ kind: 'lightLantern', id: hit.id });
        return;
      case 'ground':
        if (hit.ground) this.host.send({ kind: 'moveKeeperTo', pos: hit.ground });
        this.host.send({ kind: 'select', id: null });
        this.host.onSelect(null);
        return;
    }
  }

  private releaseVelocity(now: number): Vec2 {
    const recent = this.samples.filter((s) => now - s.t <= 120);
    const first = recent[0];
    const last = recent[recent.length - 1];
    if (!first || !last || last.t === first.t) return { x: 0, z: 0 };
    const dt = (last.t - first.t) / 1000;
    const vx = (last.pos.x - first.pos.x) / dt;
    const vz = (last.pos.z - first.pos.z) / dt;
    const speed = Math.hypot(vx, vz);
    if (speed <= THROW.maxSpeed) return { x: vx, z: vz };
    const k = THROW.maxSpeed / speed;
    return { x: vx * k, z: vz * k };
  }

  private cancelDrag(): void {
    if (!this.dragging) return;
    this.host.send({ kind: 'release', vel: { x: 0, z: 0 } });
    this.dragging = null;
    this.pressed = null;
  }
}
