/**
 * hot/perf-leaks round 5: each Nubbin's look (`nubbinLook`), worked out once per change of the
 * world instead of every frame.
 *
 * A look is a function of the Nubbin's own state (stage, form, parts, dyes, hat look, wear,
 * alignment, seed...) and of the rainbow dye's ring step, which moves with the wall clock. The
 * Nubbin's state only changes inside the sim: a fixed step (which advances `world.timeMs`) or a
 * command (the game calls `invalidate` through the scene's `snapshot` before it applies either).
 * So a look is reused while the world, its clock, the Nubbin object, the rainbow step and the
 * invalidation count are all as they were when it was worked out, and worked out again
 * otherwise. The same holds for anything else read off a Nubbin that way (`changed`).
 */
import type { Nubbin, World } from '../sim/types';
import { rainbowStep } from '../render/sprites/rainbow-dye';
import { nubbinLook, type Look } from './creature-pool';

interface Entry {
  n: Nubbin;
  look: Look;
  epoch: number;
}

export class LookCache {
  private epoch = 0;
  private world: World | null = null;
  private timeMs = NaN;
  private rainbow = -1;
  private readonly entries = new Map<string, Entry>();
  /** Looks worked out (not reused) since the cache was made: for the tests and the debug line. */
  computed = 0;

  /** The sim is about to change the world (a step or a command): every look is stale. */
  invalidate(): void {
    this.epoch++;
  }

  /** Bring the cache's view of the world up to date; call once a frame before `look`. */
  frame(world: World): void {
    const rb = rainbowStep();
    if (world !== this.world || world.timeMs !== this.timeMs || rb !== this.rainbow) {
      this.world = world;
      this.timeMs = world.timeMs;
      this.rainbow = rb;
      this.epoch++;
    }
  }

  /** The current epoch: anything derived from a Nubbin's state may be kept while it holds. */
  get stamp(): number {
    return this.epoch;
  }

  look(n: Nubbin): Look {
    const e = this.entries.get(n.id);
    if (e && e.n === n && e.epoch === this.epoch) return e.look;
    const look = nubbinLook(n);
    this.computed++;
    if (e) {
      e.n = n;
      e.look = look;
      e.epoch = this.epoch;
    } else this.entries.set(n.id, { n, look, epoch: this.epoch });
    return look;
  }

  /** Forget Nubbins that are gone (call now and then with the live ids). */
  prune(live: ReadonlySet<string>): void {
    for (const id of this.entries.keys()) if (!live.has(id)) this.entries.delete(id);
  }
}
