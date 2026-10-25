import type * as THREE from 'three';

/**
 * The grass parts round the few creatures nearest the camera (`PUSHERS` in the grass
 * shader). This keeps the nearest `slots.length` offered points by squared distance in
 * fixed arrays, so the per-frame pick makes no objects, no sort and no square roots
 * (review 2026-10-24: it built an array of objects and sorted it with `Math.hypot`).
 */
export class NearestPushers {
  private readonly d2: number[];
  private readonly xs: number[];
  private readonly zs: number[];
  private readonly rs: number[];
  private count = 0;
  private cx = 0;
  private cz = 0;

  constructor(private readonly slots: THREE.Vector4[]) {
    const n = slots.length;
    this.d2 = new Array<number>(n).fill(Infinity);
    this.xs = new Array<number>(n).fill(0);
    this.zs = new Array<number>(n).fill(0);
    this.rs = new Array<number>(n).fill(0);
  }

  /** Start a frame's pick round the camera's ground position. */
  begin(cx: number, cz: number): void {
    this.cx = cx;
    this.cz = cz;
    this.count = 0;
  }

  /** Offer one creature: its ground position and parting radius. */
  readonly offer = (x: number, z: number, r: number): void => {
    const dx = x - this.cx;
    const dz = z - this.cz;
    const d = dx * dx + dz * dz;
    const n = this.slots.length;
    if (this.count === n && d >= this.d2[n - 1]!) return;
    // Insertion into the sorted few; the farthest falls off the end when full.
    let i = Math.min(this.count, n - 1);
    while (i > 0 && this.d2[i - 1]! > d) {
      this.d2[i] = this.d2[i - 1]!;
      this.xs[i] = this.xs[i - 1]!;
      this.zs[i] = this.zs[i - 1]!;
      this.rs[i] = this.rs[i - 1]!;
      i--;
    }
    this.d2[i] = d;
    this.xs[i] = x;
    this.zs[i] = z;
    this.rs[i] = r;
    if (this.count < n) this.count++;
  };

  /** Write the pick into the slots, nearest first; unused slots part nothing. */
  end(): void {
    this.slots.forEach((s, i) =>
      i < this.count ? s.set(this.xs[i]!, this.zs[i]!, this.rs[i]!, 0) : s.set(0, 0, 0, 0),
    );
  }
}
