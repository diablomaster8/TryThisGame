/* Lane D r11 (d3), PERF item 8: freeze the matrices of Full 3D scenery that holds still.
 *
 * Three recomposes every auto-updating object's matrix each frame and, since the scene root is
 * one of them, multiplies every world matrix too. Most of the Grove's ~900 scenery objects never
 * move, and `updateMatrixWorld` was 5.7 ms/frame on a 4x-throttled phone; freezing them cut it
 * to 4.2 ms in an interleaved A/B (2026-11-02).
 *
 * Hand-picking "static" objects goes wrong the day some code moves one (wind, doors, seasons,
 * pools, carried props, region changes, the stage inspector), so the freezer is automatic and
 * can never leave a moved object stale:
 * - A sweep every `sweepMs` freezes (`matrixAutoUpdate = false`, after one last `updateMatrix`)
 *   the objects under the scene, outside the excluded roots (the creatures), whose transform
 *   held still since the previous sweep. Objects that animate never qualify.
 * - A frozen object's `position` and `scale` become trapped vectors (`TrappedVec3`) and its `quaternion` and
 *   `rotation` a wrapped change callback, and it listens for `added` (reparenting). Any write
 *   by any path (a kept reference, `lookAt`, `attach`, a slerp) thaws it on the spot, before
 *   the frame renders, so it moves exactly as before. A later sweep may freeze it again.
 * - `auditMatrices` is the debug check: under `?debug` each sweep runs it and warns about any
 *   object whose matrix or world matrix no longer matches its transform.
 * `?freeze=0` turns the freezer off (A/B and a kill switch). */
import { Matrix4, Object3D, Quaternion, Vector3 } from 'three';

const KEYS = ['x', 'y', 'z'] as const;

/** A Vector3 whose x/y/z are prototype accessors, so a frozen object's `position` and `scale`
 * can see writes while staying fast-mode objects of one shape (per-instance accessors would put
 * every trapped vector in V8's slow dictionary mode). */
class TrappedVec3 extends Vector3 {
  declare _x: number;
  declare _y: number;
  declare _z: number;
  /** Called on every write; null on a clone. */
  declare onWrite: (() => void) | null;

  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z); // through the setters below, which create _x/_y/_z in order
    this.onWrite = null;
  }

  override clone(): this {
    return new Vector3(this.x, this.y, this.z) as this;
  }
}
for (const [i, key] of KEYS.entries()) {
  const slot = (['_x', '_y', '_z'] as const)[i]!;
  Object.defineProperty(TrappedVec3.prototype, key, {
    configurable: true,
    enumerable: true,
    get(this: TrappedVec3): number {
      return this[slot];
    },
    set(this: TrappedVec3, v: number): void {
      this[slot] = v;
      if (this.onWrite) this.onWrite(); // undefined while super() runs
    },
  });
}

/** Swap `o[prop]` for a trapped vector. A reference some code kept to the old vector still
 * works: the old one forwards to the new (it goes slow, but only stale references use it). */
function trapVector(o: Object3D, prop: 'position' | 'scale', onWrite: () => void): void {
  const old = o[prop];
  const v = new TrappedVec3(old.x, old.y, old.z);
  v.onWrite = onWrite;
  Object.defineProperty(o, prop, { configurable: true, enumerable: true, value: v });
  for (const key of KEYS)
    Object.defineProperty(old, key, {
      configurable: true,
      enumerable: true,
      get: () => v[key],
      set: (x: number) => {
        v[key] = x;
      },
    });
}

interface Hooked {
  /** Snapshot of the transform at the last sweep, for the stillness test. */
  snap: Float64Array;
  thaw: () => void;
}

/** The transform as ten numbers. */
function read(o: Object3D, out: Float64Array): void {
  const p = o.position;
  const q = o.quaternion;
  const k = o.scale;
  out[0] = p.x;
  out[1] = p.y;
  out[2] = p.z;
  out[3] = q.x;
  out[4] = q.y;
  out[5] = q.z;
  out[6] = q.w;
  out[7] = k.x;
  out[8] = k.y;
  out[9] = k.z;
}

function same(a: Float64Array, b: Float64Array): boolean {
  for (let i = 0; i < 10; i++) if (a[i] !== b[i]) return false;
  return true;
}

export interface FreezeStats {
  frozen: number;
  /** Frozen objects thawed by a write since the freezer started. */
  thawed: number;
  sweeps: number;
  /** Stale matrices the last debug audit found (0 when the audit is off). */
  stale: number;
}

export class StaticFreezer {
  readonly stats: FreezeStats = { frozen: 0, thawed: 0, sweeps: 0, stale: 0 };
  private readonly hooked = new WeakMap<Object3D, Hooked>();
  /** Last sweep's snapshot of objects not yet hooked. */
  private readonly seen = new WeakMap<Object3D, Float64Array>();
  private readonly tmp = new Float64Array(10);
  private sinceMs = 0;
  private enabled = true;

  constructor(
    private readonly root: Object3D,
    /** Subtrees left alone (the creatures, whose rigs move all the time). */
    private readonly skip: (o: Object3D) => boolean,
    private readonly sweepMs = 2000,
    private readonly audit = false,
  ) {}

  /** Call once a frame, before the render; sweeps every `sweepMs`. */
  tick(dtMs: number): void {
    if (!this.enabled) return;
    this.sinceMs += dtMs;
    if (this.sinceMs < this.sweepMs) return;
    this.sinceMs = 0;
    this.sweep();
  }

  sweep(): void {
    this.stats.sweeps++;
    let frozen = 0;
    const visit = (o: Object3D): void => {
      if (this.skip(o)) return;
      if (this.consider(o)) frozen++;
      const c = o.children;
      for (let i = 0; i < c.length; i++) visit(c[i]!);
    };
    visit(this.root);
    this.stats.frozen = frozen;
    if (this.audit) {
      const a = auditMatrices(this.root, (o) => this.isFrozen(o));
      this.stats.stale = a.stale.length;
      if (a.stale.length) console.warn('[freeze] stale matrices', a.stale.slice(0, 8));
    }
  }

  /** Switch freezing off (thawing everything) or back on: the debug A/B. */
  setEnabled(on: boolean): void {
    this.enabled = on;
    if (on) return;
    this.root.traverse((o) => {
      if (this.isFrozen(o)) o.matrixAutoUpdate = true;
    });
    this.stats.frozen = 0;
  }

  /** Freeze `o` if it held still since the last sweep. Returns whether it is frozen now. */
  private consider(o: Object3D): boolean {
    const h = this.hooked.get(o);
    if (h) {
      if (!o.matrixAutoUpdate) return true;
      // Thawed by a write earlier: freeze again once it has held still for a whole sweep.
      read(o, this.tmp);
      if (same(this.tmp, h.snap)) {
        this.freeze(o);
        return true;
      }
      h.snap.set(this.tmp);
      return false;
    }
    // Objects that manage their own matrix, carry a pivot, or are cameras/bones stay as they are.
    if (!o.matrixAutoUpdate || o.pivot !== null || (o as { isCamera?: boolean }).isCamera)
      return false;
    if ((o as { isBone?: boolean }).isBone) return false;
    const prev = this.seen.get(o);
    const now = prev ?? new Float64Array(10);
    read(o, this.tmp);
    if (prev && same(this.tmp, prev)) {
      this.hook(o, prev);
      this.freeze(o);
      return true;
    }
    now.set(this.tmp);
    if (!prev) this.seen.set(o, now);
    return false;
  }

  /** Frozen by this freezer (and not thawed since). */
  isFrozen(o: Object3D): boolean {
    return !o.matrixAutoUpdate && this.hooked.has(o);
  }

  private freeze(o: Object3D): void {
    o.updateMatrix();
    o.matrixAutoUpdate = false;
  }

  /** Install the write traps (once per object; they stay, cheap when thawed). */
  private hook(o: Object3D, snap: Float64Array): void {
    this.seen.delete(o);
    const thaw = (): void => {
      if (o.matrixAutoUpdate) return;
      o.matrixAutoUpdate = true;
      this.stats.thawed++;
    };
    trapVector(o, 'position', thaw);
    trapVector(o, 'scale', thaw);
    const q = o.quaternion as Quaternion & { _onChangeCallback: () => void };
    const r = o.rotation as typeof o.rotation & { _onChangeCallback: () => void };
    const qcb = q._onChangeCallback;
    const rcb = r._onChangeCallback;
    q._onChange(() => {
      qcb();
      thaw();
    });
    r._onChange(() => {
      rcb();
      thaw();
    });
    // Reparenting changes the world matrix without touching the transform.
    o.addEventListener('added', thaw);
    this.hooked.set(o, { snap, thaw });
  }
}

/** `?freeze=0` turns the freezer off. */
export function freezeWanted(): boolean {
  try {
    return new URLSearchParams(globalThis.location?.search ?? '').get('freeze') !== '0';
  } catch {
    return true;
  }
}

const tmpM = new Matrix4();
const tmpW = new Matrix4();
const tmpP = new Vector3();
const tmpQ = new Quaternion();
const tmpS = new Vector3();

function gap(a: Matrix4, b: Matrix4): number {
  let g = 0;
  for (let i = 0; i < 16; i++) g = Math.max(g, Math.abs(a.elements[i]! - b.elements[i]!));
  return g;
}

function label(o: Object3D, what: string, g: number): string {
  const p = o.parent;
  return `${o.name || o.type}<${p ? p.name || p.type : '-'}> ${what} auto=${o.matrixAutoUpdate ? 1 : 0} gap=${g.toPrecision(2)}`;
}

function near(a: Matrix4, b: Matrix4, eps: number): boolean {
  const x = a.elements;
  const y = b.elements;
  for (let i = 0; i < 16; i++)
    if (Math.abs(x[i]! - y[i]!) > eps * Math.max(1, Math.abs(y[i]!))) return false;
  return true;
}

export interface MatrixAudit {
  checked: number;
  /** Objects whose matrix or world matrix does not match their transform, by name/type. */
  stale: string[];
}

/** Debug check, run between frames: every frozen object's matrix must still be its transform
 * composed, and wherever the next render will not rebuild a world matrix (the object and all its
 * ancestors are frozen or hand-managed, with no update pending), it must be its parent's world
 * times its matrix. Auto-updating objects are skipped: the render recomposes them anyway.
 * Objects that set their own world matrix at draw time mark `userData.ownWorld`. */
export function auditMatrices(
  root: Object3D,
  frozen: (o: Object3D) => boolean = () => false,
  eps = 1e-5,
): MatrixAudit {
  const stale: string[] = [];
  let checked = 0;
  const visit = (o: Object3D, chainStill: boolean): void => {
    const still = chainStill && !o.matrixAutoUpdate && !o.matrixWorldNeedsUpdate;
    let ok = true;
    if (frozen(o)) {
      checked++;
      tmpM.compose(tmpP.copy(o.position), tmpQ.copy(o.quaternion), tmpS.copy(o.scale));
      if (!near(o.matrix, tmpM, eps)) {
        stale.push(label(o, 'matrix', gap(o.matrix, tmpM)));
        ok = false;
      }
    }
    if (ok && still && o.matrixWorldAutoUpdate && !o.userData.ownWorld) {
      if (o.parent) tmpW.multiplyMatrices(o.parent.matrixWorld, o.matrix);
      else tmpW.copy(o.matrix);
      if (!near(o.matrixWorld, tmpW, eps)) stale.push(label(o, 'world', gap(o.matrixWorld, tmpW)));
    }
    for (const c of o.children) visit(c, still && o.matrixWorldAutoUpdate && !o.userData.ownWorld);
  };
  visit(root, true);
  return { checked, stale: stale.slice(0, 40) };
}
