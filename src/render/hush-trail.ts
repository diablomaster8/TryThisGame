import { CG2_W } from '../config/tuning-w';
import type { StageFlags } from './scene-stage';
import type { LampState } from './dress-e';

/**
 * M14: the Hush leaves a trail. As each lantern goes out in its walk (chapter 9 of The
 * Hundred Days) a grey frost grows under it, and stays for the rest of the chapter, so the
 * path it took is readable after the lamps are lit again. Both renderers share this
 * bookkeeping and draw the frost their own way. Render-only: it reads lamp states and keeps a
 * memory of its own, which a reload rebuilds from the scene it lands in.
 */
export class HushTrail {
  private since = new Map<string, number>();
  private clock = 0;

  /** Frost growth per post, 0..1, for this frame. Call once per frame with the lamp states. */
  update(
    flags: StageFlags,
    states: Partial<Record<string, LampState>>,
    posts: ReadonlyArray<{ id: string }>,
    walk: boolean,
    back: boolean,
    dt: number,
    reduce: boolean,
  ): Map<string, number> {
    this.clock += dt;
    const here = flags.location === 'grove' && flags.campaign === 'hundred' && flags.chapter === 9;
    const out = new Map<string, number>();
    if (!here) {
      this.since.clear();
      return out;
    }
    for (const p of posts) {
      // A post that goes out in the walk starts its frost; arriving mid-way (a reload on the
      // closing scene) finds every one already frosted.
      if (!this.since.has(p.id) && ((walk && states[p.id] === 'out') || back))
        this.since.set(p.id, back ? -1e6 : this.clock);
      const t0 = this.since.get(p.id);
      if (t0 === undefined) continue;
      out.set(p.id, reduce ? 1 : Math.min(1, (this.clock - t0) / CG2_W.hush.frostGrow));
    }
    return out;
  }

  reset(): void {
    this.since.clear();
    this.clock = 0;
  }
}
