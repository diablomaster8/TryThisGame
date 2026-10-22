import { CG4_A2 } from '../config/tuning-a2';

/**
 * Campaign graphics 4, package a2 (K36): the shared half of the walk-ons' footprints. Fed
 * the figures mid-stride each frame, it says where a new print lands; each renderer keeps
 * its own ring of them and draws it. Nothing here reads or writes the world.
 */
export interface Print {
  x: number;
  z: number;
  yaw: number;
  /** 0 snow, 1 mud, 2 sand. */
  ground: 0 | 1 | 2;
}

export class PrintTrail {
  private readonly last = new Map<string, { x: number; z: number }>();
  private side = 1;

  /** Forget where anyone last stepped (a new place or scene). */
  reset(): void {
    this.last.clear();
  }

  /** New prints for walkers this frame, one per stride, a foot to each side of the line. */
  feed(
    walkers: ReadonlyArray<{ key: string; x: number; z: number; yaw: number }>,
    ground: 0 | 1 | 2,
  ): Print[] {
    const P = CG4_A2.prints;
    const out: Print[] = [];
    for (const w of walkers) {
      const l = this.last.get(w.key);
      if (!l) {
        this.last.set(w.key, { x: w.x, z: w.z });
        continue;
      }
      if (Math.hypot(w.x - l.x, w.z - l.z) < P.stride) continue;
      // A foot lands to the left or right of the line of travel.
      const sx = Math.cos(w.yaw) * P.spread * this.side;
      const sz = -Math.sin(w.yaw) * P.spread * this.side;
      this.side = -this.side;
      out.push({ x: w.x + sx, z: w.z + sz, yaw: w.yaw, ground });
      l.x = w.x;
      l.z = w.z;
    }
    return out;
  }
}
