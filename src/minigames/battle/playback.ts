import type { BattleEvent } from '../../sim/battle';

/**
 * Battle event playback (recs FIGHT-26), apart from resolution: the sim resolves a whole turn
 * at once and appends events to the bout's log; the view keeps a cursor into that log and
 * plays each event for a while (a wind-up, a hit with a shake and a number, a miss with a
 * little "nope", a status word, a nap, a swap, a walk home). A tap skips to the end of what is
 * queued, and a ×2 speed halves every wait. Under reduced motion the view draws no shake or
 * flash; the timing here stays the same so the lines can still be read.
 *
 * No DOM here: the battle screen asks `current()` each frame and draws it.
 */
export const PLAY_MS: Partial<Record<BattleEvent['k'], number>> = {
  use: 300,
  hit: 520,
  miss: 480,
  status: 520,
  mood: 420,
  shrug: 360,
  skip: 520,
  boing: 520,
  peckish: 420,
  trait: 480,
  decoy: 420,
  rally: 420,
  guard: 380,
  tuckered: 900,
  swap: 480,
  item: 420,
  calm: 380,
  befriend: 900,
  play: 480,
  cuddle: 600,
  swing: 300,
  unhurt: 420,
  yawny: 420,
};

export class Playback {
  /** Index of the next event to play. */
  private cursor = 0;
  /** The event playing now and when it started. */
  private now: { e: BattleEvent; at: number; ms: number } | null = null;
  speed: 1 | 2 = 1;

  /** Start from `from` (events already in the log when the view opened are skipped). */
  reset(from: number): void {
    this.cursor = from;
    this.now = null;
  }

  /** The event to draw at `t` (ms), moving through `log`; null when caught up. */
  current(log: readonly BattleEvent[], t: number): { e: BattleEvent; k: number } | null {
    for (;;) {
      if (this.now && t - this.now.at < this.now.ms)
        return { e: this.now.e, k: (t - this.now.at) / this.now.ms };
      if (this.cursor >= log.length) {
        this.now = null;
        return null;
      }
      const e = log[this.cursor++]!;
      const ms = (PLAY_MS[e.k] ?? 0) / this.speed;
      this.now = ms > 0 ? { e, at: this.now ? this.now.at + this.now.ms : t, ms } : null;
      // An event that started in the past (after a long frame) is played from now.
      if (this.now && t - this.now.at > this.now.ms) this.now.at = t;
    }
  }

  /** Whether anything is still to play. */
  busy(log: readonly BattleEvent[]): boolean {
    return this.now !== null || this.cursor < log.length;
  }

  /** A tap: everything queued is shown as done. */
  skip(log: readonly BattleEvent[]): void {
    this.cursor = log.length;
    this.now = null;
  }

  /** The events between `from` and the cursor, for the log and the results card. */
  played(): number {
    return this.cursor;
  }
}
