/**
 * MOVE-55: the "Look around" chip. After `LOOKOUT.dwellMs` on a lookout (a standable top at
 * least 0.4 u up, or the well's rim) a 🔭 chip appears. Pressing it looks round: the sim
 * makes any one-time finds, and the camera eases out to its far zoom until the Keeper steps
 * off. The chip hides in dialogue with the other thumb buttons (move.css).
 */
import '../move.css';
import { LOOKOUT } from '../config/tuning-move';
import { LOOKOUT_TEXT } from '../config/strings-move';
import { lookoutHere } from '../sim/lookout';
import type { Command, World } from '../sim/types';
import { button } from './dom';

/** The camera's side of the look: its held zoom. */
export interface LookCamera {
  holdZoom(index: number | null, nowMs?: number): void;
}

export class LookoutChip {
  readonly root: HTMLButtonElement;
  private since: number | null = null;
  private looking = false;
  /** Where the Keeper looked round from: moving off it ends the look, even onto another lookout. */
  private lookedFrom: { x: number; z: number } | null = null;

  constructor(
    parent: HTMLElement,
    private readonly send: (cmd: Command) => void,
    private readonly camera: () => LookCamera | null,
  ) {
    this.root = button(LOOKOUT_TEXT.chip, () => this.look(), 'btn lookout-chip');
    this.root.hidden = true;
    parent.appendChild(this.root);
  }

  private look(): void {
    this.send({ kind: 'lookAround' });
    this.looking = true;
    this.lookedFrom = null;
    this.camera()?.holdZoom(0);
    this.root.hidden = true;
  }

  /** Per frame: show the chip after the dwell, and let the camera go on stepping off. */
  update(world: World, nowMs: number): void {
    const k = world.keeper.pos;
    if (this.looking && !this.lookedFrom) this.lookedFrom = { x: k.x, z: k.z };
    const moved =
      !!this.lookedFrom &&
      Math.hypot(k.x - this.lookedFrom.x, k.z - this.lookedFrom.z) > LOOKOUT.leaveDist;
    const here = lookoutHere(world);
    if (!here || moved) {
      this.lookedFrom = null;
      this.since = null;
      this.root.hidden = true;
      if (this.looking) {
        this.looking = false;
        this.camera()?.holdZoom(null);
      }
      return;
    }
    this.since ??= nowMs;
    if (!this.looking) this.root.hidden = nowMs - this.since < LOOKOUT.dwellMs;
  }
}
