import { GROVE_SHED } from '../config/tuning-r8d-perf';

/**
 * TECH-52: what the Grove gives up above ground before the render scale when frames run
 * slow, cheapest to lose first: particles to light, SMAA, the dusk bloom, then the sun's
 * shadow redraws (`GROVE_SHED.order`). The cave keeps its own list (`cave-shed.ts`); this one
 * works the same way: the governor counts the steps, the scene registers a hook per step.
 * None of the steps changes a shader program, so a step never stalls a frame.
 */
export type GroveShedName = (typeof GROVE_SHED.order)[number];

export interface GroveShedHook {
  name: GroveShedName;
  apply(shed: boolean): void;
}

export class GroveShed {
  readonly order: readonly GroveShedName[] = GROVE_SHED.order;
  private readonly hooks = new Set<GroveShedHook>();
  private level = 0;

  get steps(): number {
    return this.order.length;
  }

  register(hook: GroveShedHook): () => void {
    this.hooks.add(hook);
    hook.apply(this.sheds(hook.name));
    return () => {
      this.hooks.delete(hook);
    };
  }

  sheds(name: GroveShedName): boolean {
    return this.order.indexOf(name) < this.level;
  }

  /** Apply the governor's shed level (0 = everything on); hooks hear only about changes. */
  apply(level: number): void {
    const next = Math.max(0, Math.min(this.order.length, level));
    if (next === this.level) return;
    const was = this.order.map((n) => this.sheds(n));
    this.level = next;
    for (const h of this.hooks) {
      const now = this.sheds(h.name);
      if (now !== was[this.order.indexOf(h.name)]) h.apply(now);
    }
  }
}
