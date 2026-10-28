import { INPUT, THROW } from '../config/tuning';
import type { PickHit, Picker } from '../render/picker';
import type { Command, DecorKind, Flavor, TileKind, ToyKind, Vec2 } from '../sim/types';

/** What a ground tap places while a panel is in placing mode. */
export type Placing =
  | { mode: 'decor'; kind: DecorKind }
  | { mode: 'tile'; tile: TileKind }
  | { mode: 'plant'; plantKind: 'tree' | 'crop'; flavor: Flavor }
  | { mode: 'toy'; toy: ToyKind }
  | null;
import type { Camera, Object3D } from 'three';
import { isControlTarget, isGameKey } from './keys';

/** Hits a near-miss Nubbin may override: open ground and the scenery around it. */
const LOOSE_KINDS = new Set<PickHit['kind']>(['ground', 'tree', 'building', 'decor', 'plant']);
/** Probe directions for the Nubbin slack, in units of the slack radius, nearest first. */
const SLOP_RING: ReadonlyArray<readonly [number, number]> = [
  [0, -0.5],
  [0, 0.5],
  [-0.5, 0],
  [0.5, 0],
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
  [-0.7, -0.7],
  [0.7, -0.7],
  [-0.7, 0.7],
  [0.7, 0.7],
];

export interface InputHost {
  /** The orbit yaw (keys move relative to it) and the camera that rays are cast from. */
  camera: { readonly currentYaw: number; readonly camera: Camera };
  picker: Picker;
  pickables(): Object3D[];
  /** Decorating: the piece a ground tap should place, if any. */
  placing?(): Placing;
  /** Hit-test the batched sprites at a screen point (NDC). */
  pickSprite(
    ndcX: number,
    ndcY: number,
  ): {
    kind:
      | 'nubbin'
      | 'item'
      | 'npc'
      | 'memorial'
      | 'decor'
      | 'tree'
      | 'building'
      | 'plant'
      | 'wild'
      | 'lantern'
      | 'stairs'
      | 'chest'
      | 'stray'
      | 'loot'
      | 'storyProp';
    id: string;
  } | null;
  /** Is this Nubbin id something that can be grabbed right now? */
  canGrab(id: string): boolean;
  /** The thing under the mouse (or just tapped), for a highlight; null clears it. */
  hover?(hit: { kind: string; id: string } | null): void;
  /** A sparkle burst where something was tapped. */
  sparkle?(pos: Vec2): void;
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
  /**
   * The pointers down on the surface, by id. A set rather than a counter: a release the
   * surface never hears (over the HUD, outside the window) cannot leave a phantom finger
   * that turns every later tap into a two-finger gesture (review D, bug 9).
   */
  private readonly down = new Set<number>();
  private downAt = 0;
  private downClient: Vec2 = { x: 0, z: 0 };
  private pressed: { kind: string; id: string } | null = null;
  private dragging: string | null = null;
  private samples: Sample[] = [];
  private lastDx = 0;
  private reversals: number[] = [];
  private lastInput: Vec2 = { x: 0, z: 0 };
  private lastInput2: Vec2 = { x: 0, z: 0 };
  private padHeld = { a: false, b: false };

  constructor(
    private readonly surface: HTMLElement,
    private readonly host: InputHost,
  ) {
    const { signal } = this.abort;
    surface.addEventListener('pointerdown', this.onDown, { signal });
    surface.addEventListener('pointermove', this.onMove, { signal });
    surface.addEventListener('pointermove', this.onHover, { signal });
    surface.addEventListener('pointerleave', this.onLeave, { signal });
    surface.addEventListener('pointerup', this.onUp, { signal });
    surface.addEventListener('pointercancel', this.onUp, { signal });
    surface.addEventListener('lostpointercapture', this.onLost, { signal });
    window.addEventListener('keydown', this.onKey, { signal });
    window.addEventListener('keyup', this.onKey, { signal });
    window.addEventListener(
      'blur',
      () => {
        this.keys.clear();
        this.resetPointers();
      },
      { signal },
    );
  }

  /** Forget every pointer: a held Nubbin is put down gently and taps start fresh. */
  private resetPointers(): void {
    this.cancelDrag();
    this.down.clear();
    this.pointerId = null;
    this.pressed = null;
    this.surface.style.cursor = '';
  }

  private readonly onLeave = (e: PointerEvent): void => {
    this.host.hover?.(null);
    // A mouse that leaves with no button held is certainly up, whatever the surface heard.
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      this.down.delete(e.pointerId);
      if (e.pointerId === this.pointerId) this.resetPointers();
    }
  };

  /** Capture ended without a release here (the element changed, the browser took it). */
  private readonly onLost = (e: PointerEvent): void => {
    this.down.delete(e.pointerId);
    if (e.pointerId === this.pointerId) this.resetPointers();
  };

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
    this.pollSecondKeeper(yaw);
  }

  /** The second Keeper: IJKL and U/O on the keyboard, or the first gamepad. */
  private pollSecondKeeper(yaw: number): void {
    let fwd = 0;
    let right = 0;
    if (this.keys.has('i')) fwd += 1;
    if (this.keys.has('k')) fwd -= 1;
    if (this.keys.has('l')) right += 1;
    if (this.keys.has('j')) right -= 1;
    let pet = false;
    let feed = false;
    const pads = typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : [];
    const pad = pads?.[0];
    if (pad) {
      const ax = pad.axes[0] ?? 0;
      const ay = pad.axes[1] ?? 0;
      if (Math.abs(ax) > 0.25) right += ax;
      if (Math.abs(ay) > 0.25) fwd -= ay;
      const a = pad.buttons[0]?.pressed ?? false;
      const b = pad.buttons[1]?.pressed ?? false;
      pet = a && !this.padHeld.a;
      feed = b && !this.padHeld.b;
      this.padHeld = { a, b };
    }
    const len = Math.hypot(fwd, right);
    if (len > 1) {
      fwd /= len;
      right /= len;
    }
    const x = -Math.sin(yaw) * fwd + Math.cos(yaw) * right;
    const z = -Math.cos(yaw) * fwd - Math.sin(yaw) * right;
    if (x !== this.lastInput2.x || z !== this.lastInput2.z) {
      this.lastInput2 = { x, z };
      this.host.send({ kind: 'keeper2Input', input: { x, z } });
    }
    if (pet) this.host.send({ kind: 'keeper2Act', action: 'pet' });
    if (feed) this.host.send({ kind: 'keeper2Act', action: 'feed' });
  }

  private readonly onKey = (e: KeyboardEvent): void => {
    const key = e.key.toLowerCase();
    // A key let go always clears, wherever focus went in between, so none sticks.
    if (e.type !== 'keydown') {
      this.keys.delete(key);
      return;
    }
    if (!isGameKey(e)) return;
    // Space on a focused button presses the button; it shakes the held egg only otherwise.
    if (key === ' ' && isControlTarget(e.target)) return;
    this.keys.add(key);
    if (key === ' ' && !e.repeat) {
      this.host.send({ kind: 'shakeHeld' });
      e.preventDefault();
    }
    if (key === 'u' && !e.repeat) this.host.send({ kind: 'keeper2Act', action: 'pet' });
    if (key === 'o' && !e.repeat) this.host.send({ kind: 'keeper2Act', action: 'feed' });
  };

  private readonly onDown = (e: PointerEvent): void => {
    // There is only one mouse: a stale id from a release nobody heard is dropped here.
    if (e.pointerType === 'mouse') this.down.clear();
    this.down.add(e.pointerId);
    if (this.down.size > 1) {
      this.cancelDrag();
      return;
    }
    if (!e.isPrimary) return;
    this.pointerId = e.pointerId;
    // The release comes back here even over the HUD or outside the window.
    try {
      this.surface.setPointerCapture?.(e.pointerId);
    } catch {
      // A pointer that is already gone cannot be captured; its release resets us anyway.
    }
    this.downAt = performance.now();
    this.downClient = { x: e.clientX, z: e.clientY };
    const hit = this.pickNear(e.clientX, e.clientY);
    this.pressed = hit && hit.kind !== 'ground' ? { kind: hit.kind, id: hit.id } : null;
    this.samples = [];
    this.reversals = [];
    this.lastDx = 0;
  };

  private lastHoverMs = 0;
  private tapGlow = 0;

  /** With a mouse, the thing under the pointer gets a halo and a pointer cursor. */
  private readonly onHover = (e: PointerEvent): void => {
    if (e.pointerType !== 'mouse' || this.pointerId !== null) return;
    const now = performance.now();
    if (now - this.lastHoverMs < 50) return;
    this.lastHoverMs = now;
    const hit = this.pickNear(e.clientX, e.clientY);
    const tappable =
      hit && hit.kind !== 'ground' && hit.kind !== 'tree' ? hit : hit?.kind === 'tree' ? hit : null;
    this.host.hover?.(tappable ? { kind: tappable.kind, id: tappable.id } : null);
  };

  /**
   * What is under a screen point, with some slack for Nubbins: when the exact point finds
   * only ground or scenery, a ring of nearby points is tried for a Nubbin, so a press just
   * beside a small wandering child still lifts it (review D, bug 9).
   */
  private pickNear(clientX: number, clientY: number): PickHit | null {
    const { picker, camera, pickSprite } = this.host;
    const hit = picker.pick(clientX, clientY, camera.camera, this.host.pickables(), pickSprite);
    if (hit && !LOOSE_KINDS.has(hit.kind)) return hit;
    // Decorating: a ground tap places a piece exactly where it lands.
    if (this.host.placing?.()) return hit;
    const rect = this.surface.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return hit;
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
    const r = INPUT.nubbinPickSlopPx;
    for (const [ox, oy] of SLOP_RING) {
      const s = pickSprite(ndcX + (ox * r * 2) / rect.width, ndcY - (oy * r * 2) / rect.height);
      if (s?.kind === 'nubbin') return { kind: 'nubbin', id: s.id, ground: hit?.ground ?? null };
    }
    return hit;
  }

  private readonly onMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId || this.down.size > 1) return;
    const dx = e.clientX - this.downClient.x;
    const dy = e.clientY - this.downClient.z;
    if (!this.dragging) {
      if (!this.pressed || this.pressed.kind !== 'nubbin') return;
      if (Math.hypot(dx, dy) < INPUT.dragThresholdPx) return;
      if (!this.host.canGrab(this.pressed.id)) return;
      this.dragging = this.pressed.id;
      this.host.send({ kind: 'grab', nubbinId: this.dragging });
      if (e.pointerType === 'mouse') this.surface.style.cursor = 'grabbing';
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
    this.down.delete(e.pointerId);
    if (e.pointerId !== this.pointerId) return;
    this.pointerId = null;
    const now = performance.now();
    if (this.dragging) {
      this.host.send({ kind: 'release', vel: this.releaseVelocity(now) });
      this.dragging = null;
      this.pressed = null;
      this.surface.style.cursor = '';
      return;
    }
    const moved = Math.hypot(e.clientX - this.downClient.x, e.clientY - this.downClient.z);
    const quick = now - this.downAt <= INPUT.tapMaxMs;
    if (moved <= INPUT.dragThresholdPx && quick) this.tap(e);
    this.pressed = null;
  };

  private tap(e: PointerEvent): void {
    const hit = this.pickNear(e.clientX, e.clientY);
    if (!hit) return;
    if (hit.kind !== 'ground') {
      // Feedback for the tap: sparkles where it landed and a short halo (touch has no hover).
      if (hit.ground) this.host.sparkle?.(hit.ground);
      this.host.hover?.({ kind: hit.kind, id: hit.id });
      const stamp = ++this.tapGlow;
      window.setTimeout(() => {
        if (this.tapGlow === stamp && e.pointerType !== 'mouse') this.host.hover?.(null);
      }, 700);
    }
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
      case 'stairs':
        this.host.send({ kind: 'dungeonGo', to: hit.id === 'down' ? 'down' : 'up' });
        return;
      case 'chest':
        this.host.send({ kind: 'dungeonGo', to: 'chest' });
        return;
      case 'stray':
        this.host.send({ kind: 'feedStray', id: hit.id });
        return;
      case 'loot':
        if (hit.ground) this.host.send({ kind: 'moveKeeperTo', pos: hit.ground });
        return;
      case 'memorial':
        this.host.onSelect(`memorial:${hit.id}`);
        return;
      case 'building':
        this.host.onSelect(`building:${hit.id}`);
        return;
      case 'plant':
        this.host.onSelect(`plant:${hit.id}`);
        return;
      case 'wild':
        this.host.send({ kind: 'feedWild', id: hit.id });
        return;
      case 'decor':
        this.host.onSelect(`decor:${hit.id}`);
        return;
      case 'storyProp':
        this.host.send({ kind: 'storyProp', prop: hit.id });
        return;
      case 'ground': {
        // Decorating: a ground tap places the chosen piece instead of walking.
        const placing = this.host.placing?.();
        if (placing && hit.ground) {
          const pos = hit.ground;
          if (placing.mode === 'decor')
            this.host.send({ kind: 'placeDecor', decor: placing.kind, pos });
          else if (placing.mode === 'tile')
            this.host.send({ kind: 'paintTile', pos, tile: placing.tile });
          else if (placing.mode === 'plant') {
            this.host.send({
              kind: 'plant',
              plantKind: placing.plantKind,
              flavor: placing.flavor,
              pos,
            });
          } else this.host.send({ kind: 'placeToy', toy: placing.toy, pos });
          return;
        }
        // Gathering: rocks give stone, the stream bank gives reeds.
        if (hit.id === 'rock') {
          this.host.send({ kind: 'gather', what: 'stone' });
          return;
        }
        if (hit.id === 'stream') {
          this.host.send({ kind: 'gather', what: 'reeds' });
          return;
        }
        if (hit.ground) this.host.send({ kind: 'moveKeeperTo', pos: hit.ground });
        this.host.send({ kind: 'select', id: null });
        this.host.onSelect(null);
        return;
      }
    }
  }

  private releaseVelocity(now: number): Vec2 {
    const recent = this.samples.filter((s) => now - s.t <= THROW.placeStillMs);
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
    this.surface.style.cursor = '';
  }
}
