import { GROVE3D } from '../config/tuning';

/**
 * What the Hollow Below gives up first when a phone cannot hold the frame rate: the spec's
 * order is particles, then triplanar rock, then bloom, and only then the render scale (the
 * Grove keeps the governor's own order). The governor counts the steps (`shedLevel`); each
 * cave module registers a hook for its step here, so the modules never touch the governor.
 * A step with no hook registered sheds nothing.
 *
 *   const off = caveShed.register({ name: 'particles', apply: (shed) => (motes.visible = !shed) });
 *
 * `apply(true)` means drop the effect, `apply(false)` bring it back. A new hook is told the
 * current state at once; the returned function unregisters it.
 */
export type CaveShedName = (typeof GROVE3D.cave.light.governor.order)[number];

export interface CaveShedHook {
  name: CaveShedName;
  apply(shed: boolean): void;
}

export class CaveShed {
  readonly order: readonly CaveShedName[] = GROVE3D.cave.light.governor.order;
  private readonly hooks = new Set<CaveShedHook>();
  private level = 0;

  /** How many steps the governor should take ahead of the render scale. */
  get steps(): number {
    return this.order.length;
  }

  register(hook: CaveShedHook): () => void {
    this.hooks.add(hook);
    hook.apply(this.sheds(hook.name));
    return () => {
      this.hooks.delete(hook);
    };
  }

  /** Whether the step for `name` is shed at the current level. */
  sheds(name: CaveShedName): boolean {
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

/** The one shed list for the 3D Hollow; hollow-atmos.ts and hollow-rock.ts register here. */
export const caveShed = new CaveShed();
