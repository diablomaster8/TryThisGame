/**
 * TECH-02: the ring both renderers draw under a held Nubbin, green when letting go now would
 * be a gentle place (no penalty), and the 200 ms ease to the ground after a place. It reads
 * the held Nubbin's position each frame and judges its speed over the same last stretch the
 * input reads a release from (`THROW.placeStillMs`), so the colour matches the outcome.
 * Drawn only; it never changes the sim.
 */
import { HELD_RING, THROW } from '../config/tuning';
import type { World } from '../sim/types';
import { frameKey } from './sprites/animations';
import { AtlasBuilder, type SpriteSheet } from './sprites/atlas';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';

export interface HeldRingSpot {
  x: number;
  z: number;
  gentle: boolean;
}

export class HeldRing {
  private samples: Array<{ t: number; x: number; z: number }> = [];
  private heldId: string | null = null;
  private heldY = 0;
  private lowering: { id: string; fromY: number; at: number } | null = null;
  spot: HeldRingSpot | null = null;

  /** Once a frame, before the Nubbins are drawn. */
  frame(world: World, nowMs: number, calm: boolean): void {
    const n = world.nubbins.find((m) => m.behavior.state === 'held');
    if (this.heldId && (!n || n.id !== this.heldId)) {
      const was = world.nubbins.find((m) => m.id === this.heldId);
      // A place or a drop eases down; a throw flies on its own arc.
      if (was && was.behavior.state !== 'thrown' && !calm && this.heldY > 0)
        this.lowering = { id: was.id, fromY: this.heldY, at: nowMs };
      this.samples = [];
    }
    this.heldId = n?.id ?? null;
    if (!n) {
      this.spot = null;
      return;
    }
    this.heldY = n.y;
    this.samples.push({ t: nowMs, x: n.pos.x, z: n.pos.z });
    while (this.samples.length > 1 && nowMs - this.samples[0]!.t > THROW.placeStillMs)
      this.samples.shift();
    const a = this.samples[0]!;
    const b = this.samples[this.samples.length - 1]!;
    const dt = (b.t - a.t) / 1000;
    const speed = dt > 0 ? Math.hypot(b.x - a.x, b.z - a.z) / dt : 0;
    this.spot = { x: n.pos.x, z: n.pos.z, gentle: speed < THROW.placeMaxSpeed };
  }

  /** The height a just-placed Nubbin is drawn at, at least; 0 once it has landed. */
  lowerY(id: string, nowMs: number): number {
    const l = this.lowering;
    if (!l || l.id !== id) return 0;
    const k = (nowMs - l.at) / HELD_RING.lowerMs;
    if (k >= 1) {
      this.lowering = null;
      return 0;
    }
    return l.fromY * (1 - k) * (1 - k);
  }
}

/** The Pixel ring frames: cream while a release would be a drop or a throw, green for a place. */
export function buildHeldRingSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(16, 16, 2);
  for (const gentle of [false, true]) {
    const pc = new PixelCanvas(16, 16);
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const d = Math.hypot(x - 7.5, y - 7.5);
        if (d >= 5.6 && d <= 7.4) pc.px(x, y, gentle ? C.mint : C.cream);
      }
    atlas.add(frameKey(gentle ? 'heldRingGentle' : 'heldRing', 'front', 0), pc);
  }
  return atlas.build();
}
