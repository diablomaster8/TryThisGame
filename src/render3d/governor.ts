import { GROVE3D, PERF_BUDGET } from '../config/tuning';

/**
 * The Full 3D frame-time governor (review C, item 6). It watches the time between frames
 * and lowers the render scale (the renderer's pixel ratio) while the device cannot hold the
 * 30 fps floor, then raises it again slowly once frames come easily. A step that buys no
 * time (a frame held up by the CPU, not by filling pixels) is taken back, and the scale
 * never drops that low again, so a CPU-bound phone keeps a sharp picture.
 *
 * A frame still slow at the lowest useful scale is held up by the CPU, so the governor then
 * steps through CPU savings (`cpuLevel`, 0 to `cpuLevels`: the scene decides what each step
 * drops, the creature outlines first). When frames come easily again it gives the savings
 * back before any sharpness, the latest first; a saving given back that brings the slow
 * frames straight back is kept for good, so the picture does not flicker between the two.
 * Some places shed effects before any sharpness (`setShedSteps`; the Hollow Below sheds
 * particles, then triplanar rock, then bloom, `cave-shed.ts`): while shed steps are set, a
 * frame slower than the shed target (`GROVE3D.cave.light.governor.slowMs`, the phone target
 * rather than the 30 fps floor) takes the next shed step (`shedLevel`) before the render scale
 * moves, and a fast run gives sharpness back before the shed steps, the latest first; a shed
 * step given back
 * that brings the slow frames straight back stays on while the place lasts.
 * Pure apart from the numbers it is fed, so the tests drive it with made-up frame times.
 */
/** TECH-52: a governor's level, as kept between sessions (`platform/gov-memory.ts`). */
export interface GovernorLevel {
  ratio: number;
  cpu: number;
  /** Shed steps above ground (the cave list always starts clean). */
  shed: number;
}

export class FrameGovernor {
  private avgMs = 0;
  private samples = 0;
  private slowFor = 0;
  private fastFor = 0;
  /** CPU savings in force, 0 = none. */
  cpuLevel = 0;
  /** The fewest savings worth running with: raised when giving one back did not hold. */
  private cpuFloor = 0;
  /** Frames since a saving was given back, to judge whether that held. */
  private sinceRestore = Infinity;
  /** Shed steps taken ahead of the render scale, 0 = none, up to `shedSteps`. */
  shedLevel = 0;
  private shedSteps = 0;
  private shedFloor = 0;
  private sinceShedRestore = Infinity;
  private shedSlowFor = 0;
  /** TECH-52: which place's shed list is set, and the frame times its steps judge against. */
  private shedKey = 'cave';
  private shedTarget: { readonly slowMs: number; readonly fastMs: number } =
    GROVE3D.cave.light.governor;
  private shedFastFor = 0;
  /** The last step down, to judge once the average has settled at the new scale. */
  private trial: { fromRatio: number; fromMs: number } | null = null;
  /** The lowest scale worth using: raised when a step down did not help. */
  private floor: number;
  /**
   * WORLD-03: geometry savings in force (0 = none, up to `PERF_BUDGET.maxLevel`), raised when
   * the frame draws more calls or triangles than the device's budget for `overFrames` in a row
   * and lowered after a long run well under it. Every LOD consumer reads it as `lodBias`. It
   * moves before the render scale: a vertex-bound phone has no other way out.
   */
  geoLevel = 0;
  /** WORLD-46: a geometry level the debug panel pins (null: the budget decides). */
  forcedGeo: number | null = null;
  private geoOver = 0;
  private geoUnder = 0;
  /** The render scale it wants now. */
  ratio: number;
  /** The most it will ever ask for: the device's ratio, capped (and by the tier, `capRatio`). */
  maxRatio: number;

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
    this.sinceRestore++;
    this.sinceShedRestore++;
    // The shed steps judge against the place's own target (`GROVE3D.cave.light.governor`
    // underground, the governor's own above it, TECH-52).
    const shed = this.shedTarget;
    this.shedSlowFor = this.avgMs > shed.slowMs ? this.shedSlowFor + 1 : 0;
    this.shedFastFor = this.avgMs < shed.fastMs ? this.shedFastFor + 1 : 0;
    if (this.shedSlowFor >= g.downFrames && this.shedLevel < this.shedSteps) {
      if (this.sinceShedRestore < g.upFrames) this.shedFloor = this.shedLevel + 1;
      this.shedLevel++;
      this.settle();
      return null;
    }
    if (this.slowFor >= g.downFrames && this.ratio > this.floor + 1e-6) {
      const fromRatio = this.ratio;
      const fromMs = this.avgMs;
      const next = this.set(Math.max(this.floor, this.ratio * g.stepDown));
      this.trial = { fromRatio, fromMs };
      return next;
    }
    if (this.slowFor >= g.downFrames && this.cpuLevel < g.cpuLevels) {
      // Slow at the lowest useful scale: the CPU is the limit. A saving just given back
      // that did not hold stays on from now on.
      if (this.sinceRestore < g.upFrames) this.cpuFloor = this.cpuLevel + 1;
      this.cpuLevel++;
      this.settle();
      return null;
    }
    if (this.fastFor >= g.upFrames && this.cpuLevel > this.cpuFloor) {
      this.cpuLevel--;
      this.sinceRestore = 0;
      this.settle();
      return null;
    }
    if (this.fastFor >= g.upFrames && this.ratio < this.maxRatio) {
      return this.set(Math.min(this.maxRatio, this.ratio / g.stepDown));
    }
    if (
      this.shedFastFor >= g.upFrames &&
      this.ratio >= this.maxRatio &&
      this.cpuLevel === 0 &&
      this.shedLevel > this.shedFloor
    ) {
      this.shedLevel--;
      this.sinceShedRestore = 0;
      this.settle();
      return null;
    }
    return null;
  }

  /**
   * How many shed steps come ahead of the render scale here (0 above ground). A change
   * starts the new place with nothing shed.
   */
  setShedSteps(
    n: number,
    key = 'cave',
    target: { readonly slowMs: number; readonly fastMs: number } = GROVE3D.cave.light.governor,
    start = 0,
  ): void {
    if (n === this.shedSteps && key === this.shedKey) return;
    this.shedSteps = n;
    this.shedKey = key;
    this.shedTarget = target;
    this.shedLevel = Math.max(0, Math.min(n, start));
    this.shedFloor = 0;
    this.sinceShedRestore = Infinity;
    this.settle();
  }

  /**
   * Feed one frame's draw calls and triangles against a budget; returns the new geometry
   * level when it changes, else null.
   */
  sampleGeometry(
    calls: number,
    tris: number,
    budget: { calls: number; tris: number },
  ): number | null {
    const b = PERF_BUDGET;
    if (this.forcedGeo !== null) {
      if (this.geoLevel === this.forcedGeo) return null;
      return (this.geoLevel = this.forcedGeo);
    }
    const over = calls > budget.calls || tris > budget.tris;
    const easy = calls < budget.calls * b.relaxShare && tris < budget.tris * b.relaxShare;
    this.geoOver = over ? this.geoOver + 1 : 0;
    this.geoUnder = easy ? this.geoUnder + 1 : 0;
    if (this.geoOver >= b.overFrames && this.geoLevel < b.maxLevel) {
      this.geoOver = 0;
      return ++this.geoLevel;
    }
    if (this.geoUnder >= b.underFrames && this.geoLevel > 0) {
      this.geoUnder = 0;
      return --this.geoLevel;
    }
    return null;
  }

  /**
   * TECH-52: the device tier's ceiling on the render scale. Lowers the scale now if it is above;
   * returns the new ratio when it changed, else null.
   */
  capRatio(cap: number): number | null {
    const g = GROVE3D.governor;
    this.maxRatio = Math.max(g.minRatio, Math.min(this.maxRatio, cap));
    return this.ratio > this.maxRatio ? this.set(this.maxRatio) : null;
  }

  /** TECH-52: what to keep for the next boot on this device. */
  get settled(): GovernorLevel {
    return {
      ratio: this.ratio,
      cpu: this.cpuLevel,
      shed: this.shedKey === 'cave' ? 0 : this.shedLevel,
    };
  }

  /**
   * TECH-52: start where the last session on this device settled (clamped to this device's
   * range). The governor still climbs back up once frames come easily.
   */
  restore(level: GovernorLevel): void {
    const g = GROVE3D.governor;
    if (Number.isFinite(level.ratio))
      this.set(Math.max(g.minRatio, Math.min(this.maxRatio, level.ratio)));
    if (Number.isFinite(level.cpu))
      this.cpuLevel = Math.max(0, Math.min(g.cpuLevels, Math.round(level.cpu)));
  }

  /** Let the average settle at the new setting before judging it again. */
  private settle(): void {
    this.slowFor = 0;
    this.fastFor = 0;
    this.shedSlowFor = 0;
    this.shedFastFor = 0;
    this.samples = 0;
  }

  private set(ratio: number): number {
    this.ratio = Math.round(ratio * 100) / 100;
    this.settle();
    return this.ratio;
  }
}
