/**
 * R0450 (TECH-08): the Expedition's sound effects. A tracker watches the run state between
 * frames and turns what changed into cues: the jump and the held high jump, a shell chime
 * that climbs with the combo, an essence sparkle, a critter bubble's pop, a soft boing for
 * an obstacle and a fanfare for the results. Pure (no audio calls), so a test can count
 * the cues from a scripted run; the screen plays them.
 */
import { EXPEDITION_SFX } from '../../config/tuning-r8d-audio';
import type { SoundName } from '../../platform/audio';
import type { RunState } from './run';

/** One thing to play: a named effect, or the shell chime at a pitch share 0..1. */
export type ExpeditionCue = { sound: SoundName } | { chime: number };

export class ExpeditionSfx {
  private lastEventAt = -1;
  private wasOnGround = true;
  private highJumped = false;
  private combo = 0;
  private lastShellAt = -Infinity;
  private finished = false;

  /** What changed since the last call, as cues in the order they happened. */
  observe(run: RunState): ExpeditionCue[] {
    const cues: ExpeditionCue[] = [];
    // Leaving the ground is the jump; holding it past the threshold adds the second tone.
    if (this.wasOnGround && !run.onGround) {
      cues.push({ sound: 'jump' });
      this.highJumped = false;
    }
    if (!run.onGround && !this.highJumped && run.holdMs >= EXPEDITION_SFX.highJumpHoldMs) {
      cues.push({ sound: 'jumpHigh' });
      this.highJumped = true;
    }
    this.wasOnGround = run.onGround;
    const e = run.lastEvent;
    if (e && e.atMs !== this.lastEventAt) {
      this.lastEventAt = e.atMs;
      switch (e.kind) {
        case 'shell':
          this.combo =
            e.atMs - this.lastShellAt <= EXPEDITION_SFX.comboWindowMs ? this.combo + 1 : 0;
          this.lastShellAt = e.atMs;
          cues.push({ chime: Math.min(1, this.combo / EXPEDITION_SFX.comboSteps) });
          break;
        case 'essence':
          cues.push({ sound: 'sparkle' });
          break;
        case 'critter':
          cues.push({ sound: 'bubblePop' });
          break;
        case 'hit':
          this.combo = 0;
          cues.push({ sound: 'boing' });
          break;
      }
    }
    if (run.finished && !this.finished) {
      this.finished = true;
      cues.push({ sound: 'fanfare' });
    }
    return cues;
  }
}
