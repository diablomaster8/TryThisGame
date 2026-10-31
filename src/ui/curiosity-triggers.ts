/**
 * FUN-43 (R0332, lane E r9): the eight in-world curiosity triggers the first pass left, as
 * pure counting with no DOM so a node test can drive it. `CuriosityWatch` feeds it the
 * commands the player sends, the taps that open panels, and a few-times-a-second tick, and
 * passes back the ids it spots; the sim still logs each one once.
 *
 * - cup: tap the cottage three times (the upside-down cup inside rights itself).
 * - lantern: tap the fourth lantern 22 times.
 * - fernBlush: pat Fern's stone three times in quick succession.
 * - robotDance: a jukebox piece playing while Pixel is out with the robot.
 * - stopwatch: talk to Byte twelve times.
 * - scarf: talk to Clover on story day 100 or later.
 * - backToBack: switch to the other Keeper and straight back again.
 * - eggUpside: hold an egg with the screen upside down, or turn the camera half round under it.
 */
import { STORY } from '../config/tuning';
import { currentStation } from '../sim/npc-routines';
import type { Command, World } from '../sim/types';

export const CURIO_TRIGGER = {
  cottageTaps: 3,
  lanternId: 'lantern-4',
  lanternTaps: 22,
  fernId: 'fern-stone',
  fernPats: 3,
  fernWindowMs: 4000,
  byteTalks: 12,
  scarfDay: 100,
  /** Sun to Moon and back inside this window counts as back to back. */
  switchBackMs: 6000,
  /** Camera snaps in a full turn; half of it is "upside down" from the egg's view. */
  yawSteps: 8,
} as const;

export class CuriosityTriggers {
  private cottage = 0;
  private lantern = 0;
  private fern: number[] = [];
  private byte = 0;
  private lastBand: string | null = null;
  private bandSwaps: { band: string; at: number }[] = [];
  private eggId: string | null = null;
  private eggYaw = 0;
  private readonly found = new Set<string>();

  /** Every command the player sends (`Game.send`). */
  onCommand(cmd: Command, world: World | null, nowMs: number): void {
    if (cmd.kind === 'lightLantern' && cmd.id === CURIO_TRIGGER.lanternId) {
      if (++this.lantern >= CURIO_TRIGGER.lanternTaps) this.found.add('lantern');
    } else if (cmd.kind === 'storyProp' && cmd.prop === CURIO_TRIGGER.fernId) {
      this.fern = [...this.fern.filter((t) => nowMs - t < CURIO_TRIGGER.fernWindowMs), nowMs];
      if (this.fern.length >= CURIO_TRIGGER.fernPats) this.found.add('fernBlush');
    } else if (cmd.kind === 'talk' && world) {
      const who = world.npcs.find((n) => n.id === cmd.npcId)?.trainer;
      if (who === 'byte' && ++this.byte >= CURIO_TRIGGER.byteTalks) this.found.add('stopwatch');
      if (who === 'clover' && Math.floor(world.timeMs / STORY.dayMs) >= CURIO_TRIGGER.scarfDay)
        this.found.add('scarf');
    }
  }

  /** A tap that opens something rather than sending a command (`building:cottage`, …). */
  onSelect(id: string | null): void {
    if (id === 'building:cottage' && ++this.cottage >= CURIO_TRIGGER.cottageTaps)
      this.found.add('cup');
  }

  /** A few times a second, with the camera's snap index and the screen's rotation angle. */
  tick(world: World, yawIndex: number, nowMs: number, screenAngle: number): void {
    // Back to back: the Keeper's side flips and flips back quickly.
    const band = world.keeper.alignment;
    if (this.lastBand !== null && band !== this.lastBand) {
      this.bandSwaps = [
        ...this.bandSwaps.filter((s) => nowMs - s.at < CURIO_TRIGGER.switchBackMs),
        { band, at: nowMs },
      ];
      const seen = new Set([this.lastBand, ...this.bandSwaps.map((s) => s.band)]);
      if (this.bandSwaps.length >= 2 && seen.has('sun') && seen.has('moon'))
        this.found.add('backToBack');
    }
    this.lastBand = band;
    // The egg held upside down.
    const egg = world.nubbins.find((n) => n.stage === 'egg' && n.behavior.state === 'held');
    if (!egg) this.eggId = null;
    else {
      if (egg.id !== this.eggId) {
        this.eggId = egg.id;
        this.eggYaw = yawIndex;
      }
      const half = CURIO_TRIGGER.yawSteps / 2;
      const turned =
        (((yawIndex - this.eggYaw) % CURIO_TRIGGER.yawSteps) + CURIO_TRIGGER.yawSteps) %
          CURIO_TRIGGER.yawSteps ===
        half;
      if (turned || Math.abs(screenAngle) === 180) this.found.add('eggUpside');
    }
    // The robot does the robot to the jukebox.
    const pixel = world.settings.jukebox ? currentStation('pixel', world.timeMs) : null;
    if (pixel && (pixel.station.id === 'robot' || pixel.station.id === 'path'))
      this.found.add('robotDance');
  }

  /** What was spotted since the last call. */
  take(): string[] {
    const out = [...this.found];
    this.found.clear();
    return out;
  }
}
