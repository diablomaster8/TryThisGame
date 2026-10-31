/**
 * FUN-43 (R0332): spots the curiosities the player can stumble on and tells the sim, which
 * logs each once (`sim/curiosities.ts`); the first find shows its line as a toast. Watched
 * here: "liftandpush" typed anywhere (the title screen included; it waits for a game), the
 * camera turned eight times in a row, one tree shaken thirty times, five fruit eaten in ten
 * seconds, a Nubbin named Moss or (with 18+ content on) Gerald, and the Grove open at
 * 3:00 local time. The rest are logged by the places that own them, or by the debug command.
 */
import { CURIOSITY_TEXT } from '../config/strings-look';
import type { Command, SimEvent, World } from '../sim/types';
import { CuriosityTriggers } from './curiosity-triggers';

const WORD = 'liftandpush';
/** Turns this close together count as "in a row". */
const SPIN_GAP_MS = 2500;

export class CuriosityWatch {
  private typed = '';
  private pending = new Set<string>();
  private spins = 0;
  private lastSpinMs = 0;
  private lastYaw: number | null = null;
  private readonly shakes = new Map<string, number>();
  private eats: number[] = [];
  // Lane E r9: the eight in-world triggers (`curiosity-triggers.ts`).
  private readonly triggers = new CuriosityTriggers();
  private lastWorld: World | null = null;

  constructor(
    private readonly send: (cmd: Command) => void,
    private readonly toast: (text: string) => void,
  ) {
    window.addEventListener('keydown', (e) => {
      if (e.key.length !== 1) return;
      this.typed = (this.typed + e.key.toLowerCase()).slice(-WORD.length);
      if (this.typed === WORD) this.pending.add('liftAndPush');
    });
  }

  /** Lane E r9: every command the player sends, from `Game.send`. */
  onCommand(cmd: Command): void {
    this.triggers.onCommand(cmd, this.lastWorld, performance.now());
  }

  /** Lane E r9: a tap that opens a panel (`building:cottage`, …). */
  onSelect(id: string | null): void {
    this.triggers.onSelect(id);
  }

  /** Per sim batch: count shakes and meals, and toast what the sim just logged. */
  onEvents(events: SimEvent[]): void {
    const now = performance.now();
    for (const e of events) {
      if (e.kind === 'treeShaken') {
        const k = (this.shakes.get(e.treeId) ?? 0) + 1;
        this.shakes.set(e.treeId, k);
        if (k >= 30) this.pending.add('squirrel');
      } else if (e.kind === 'ate') {
        this.eats = [...this.eats.filter((t) => now - t < 10_000), now];
        if (this.eats.length >= 5) this.pending.add('fruitRoll');
      } else if (e.kind === 'curiosityFound') {
        const line = CURIOSITY_TEXT[e.id];
        if (line) this.toast(line);
      }
    }
  }

  /** A few times a second: the camera's snap index, names and the clock; then send finds. */
  tick(world: World, yawIndex: number): void {
    const now = performance.now();
    if (this.lastYaw !== null && yawIndex !== this.lastYaw) {
      this.spins = now - this.lastSpinMs < SPIN_GAP_MS ? this.spins + 1 : 1;
      this.lastSpinMs = now;
      if (this.spins >= 8) this.pending.add('dizzyCam');
    }
    this.lastYaw = yawIndex;
    this.lastWorld = world;
    const angle = typeof screen !== 'undefined' ? (screen.orientation?.angle ?? 0) : 0;
    this.triggers.tick(world, yawIndex, now, angle);
    for (const id of this.triggers.take()) this.pending.add(id);
    for (const n of world.nubbins) {
      const name = n.name.trim().toLowerCase();
      if (name === 'moss') this.pending.add('mossName');
      if (name === 'gerald' && world.settings.matureContent === 'adult') this.pending.add('gerald');
    }
    const d = new Date();
    if (d.getHours() === 3 && d.getMinutes() === 0) this.pending.add('moonFace');
    for (const id of this.pending)
      if (world.curiosities?.[id] === undefined) this.send({ kind: 'curiosity', id });
    this.pending.clear();
  }
}
