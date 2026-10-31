/**
 * R0552 (lane A r9): the soft sounds of the Grove going about its day, near the Keeper only:
 * a napping Nubbin snores now and then, and two buddies chatting chirp at each other. Read
 * from the world each frame by the HUD; at most one sound per beat, so it never piles up.
 */
import { SOUL_AMBIENT } from '../config/tuning';
import type { SoundName } from '../platform/audio';
import type { World } from '../sim/types';

export class SoulAmbient {
  private nextSnore = 0;
  private nextChirp = 0;

  /** The sound to play this frame, or null. `nowMs` is the page clock. */
  tick(world: World, nowMs: number): SoundName | null {
    const k = world.keeper.pos;
    const near = world.nubbins.filter(
      (n) => Math.hypot(n.pos.x - k.x, n.pos.z - k.z) < SOUL_AMBIENT.radius,
    );
    if (nowMs >= this.nextSnore && near.some((n) => n.behavior.state === 'nap')) {
      this.nextSnore = nowMs + SOUL_AMBIENT.snoreEveryMs;
      return 'snore';
    }
    // A chat is a greet aimed at a buddy, not at the Keeper.
    const chatting = near.some(
      (n) =>
        n.behavior.state === 'greet' &&
        !!n.behavior.target &&
        Math.hypot(n.behavior.target.x - k.x, n.behavior.target.z - k.z) > 1.5,
    );
    if (nowMs >= this.nextChirp && chatting) {
      this.nextChirp = nowMs + SOUL_AMBIENT.chirpEveryMs;
      return 'chirp';
    }
    return null;
  }
}
