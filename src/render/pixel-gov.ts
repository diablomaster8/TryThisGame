import { GOV_MEMORY, PIXEL_GOV, RENDER } from '../config/tuning';
import { GovMemory } from '../platform/gov-memory';
import { FrameGovernor } from '../render3d/governor';

/**
 * TECH-53: the Pixel renderer's frame governor. It is the Full 3D governor with no render
 * scale to move (the pixel frame is already low-res) and a Pixel shed list instead
 * (`PIXEL_GOV.order`): full particles to light, the wind's sway, the weather overlay, then the
 * frame height 540 → 432. A step is taken after a run of slow frames and given back, latest
 * first, after a long run of easy ones. The level is kept per device (`grove.govpx`).
 */
export type PixelShedName = (typeof PIXEL_GOV.order)[number];

export class PixelGovernor {
  private readonly gov = new FrameGovernor(0);
  private readonly memory: GovMemory | null;

  /** `remember` false for tests: no storage. */
  constructor(remember = true) {
    this.memory = remember ? new GovMemory(GOV_MEMORY.keyPx) : null;
    const start = this.memory?.read()?.shed ?? 0;
    this.gov.setShedSteps(PIXEL_GOV.order.length, 'pixel', PIXEL_GOV, Math.round(start));
  }

  get level(): number {
    return this.gov.shedLevel;
  }

  sheds(name: PixelShedName): boolean {
    return PIXEL_GOV.order.indexOf(name) < this.gov.shedLevel;
  }

  /** The frame height to draw at now. */
  get targetHeight(): number {
    return this.sheds('height') ? PIXEL_GOV.smallHeight : RENDER.targetHeight;
  }

  /** The particle density to draw with, given the player's choice. */
  particles<T extends 'full' | 'light' | 'off'>(chosen: T): T | 'light' {
    return chosen === 'full' && this.sheds('particles') ? 'light' : chosen;
  }

  /** Feed one frame interval; true when the shed level changed. */
  sample(intervalMs: number, nowMs: number): boolean {
    const was = this.gov.shedLevel;
    this.gov.sample(intervalMs);
    this.memory?.note({ shed: this.gov.shedLevel }, nowMs);
    return this.gov.shedLevel !== was;
  }
}
