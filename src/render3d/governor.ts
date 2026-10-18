import { GROVE3D } from '../config/tuning';

/**
 * The Full 3D frame-time governor (review C, item 6). It watches the time between frames
 * and lowers the render scale (the renderer's pixel ratio) while the device cannot hold the
 * 30 fps floor, then raises it again slowly once frames come easily. A step that buys no
 * time (a frame held up by the CPU, not by filling pixels) is taken back, and the scale
 * never drops that low again, so a CPU-bound phone keeps a sharp picture. Pure apart from
 * the numbers it is fed, so the tests drive it with made-up frame times.
 */
export class FrameGovernor {
  private avgMs = 0;
  private samples = 0;
  private slowFor = 0;
  private fastFor = 0;
  /** The last step down, to judge once the average has settled at the new scale. */
  private trial: { fromRatio: number; fromMs: number } | null = null;
  /** The lowest scale worth using: raised when a step down did not help. */
  private floor: number;
  /** The render scale it wants now. */
  ratio: number;
  /** The most it will ever ask for: the device's ratio, capped. */
  readonly maxRatio: number;

  constructor(deviceRatio: number) {
    const g = GROVE3D.governor;
    this.maxRatio = Math.max(g.minRatio, Math.min(g.maxRatio, deviceRatio));
    this.ratio = this.maxRatio;
    this.floor = g.minRatio;
  }

  /** Feed one frame's interval; returns the new ratio when it changes, else null. */
  sample(frameMs: number): number | null {
    const g = GROVE3D.governor;
    // A hidden tab, a stall on a shader link or a debugger pause is not the frame rate.
    if (!(frameMs > 0) || frameMs > 250) return null;
    this.avgMs = this.samples === 0 ? frameMs : this.avgMs + (frameMs - this.avgMs) * g.smoothing;
    this.samples++;
    if (this.trial && this.samples >= g.downFrames) {
      const { fromRatio, fromMs } = this.trial;
      this.trial = null;
      if (this.avgMs > fromMs * g.minGain) {
        // Fewer pixels, no faster: the frame is not fill-bound. Go back and stay there.
        this.floor = fromRatio;
        return this.set(fromRatio);
      }
    }
    this.slowFor = this.avgMs > g.slowMs ? this.slowFor + 1 : 0;
    this.fastFor = this.avgMs < g.fastMs ? this.fastFor + 1 : 0;
    if (this.slowFor >= g.downFrames && this.ratio > this.floor + 1e-6) {
      const fromRatio = this.ratio;
      const fromMs = this.avgMs;
      const next = this.set(Math.max(this.floor, this.ratio * g.stepDown));
      this.trial = { fromRatio, fromMs };
      return next;
    }
    if (this.fastFor >= g.upFrames && this.ratio < this.maxRatio) {
      return this.set(Math.min(this.maxRatio, this.ratio / g.stepDown));
    }
    return null;
  }

  private set(ratio: number): number {
    this.ratio = Math.round(ratio * 100) / 100;
    this.slowFor = 0;
    this.fastFor = 0;
    // Let the average settle at the new scale before judging it again.
    this.samples = 0;
    return this.ratio;
  }
}
