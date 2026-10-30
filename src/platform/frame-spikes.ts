/**
 * HOT-2: a cheap frame-time log for finding frame-rate spikes. The game loop laps each part
 * of a frame (input, sim, events, camera, scene update, draw, save). The time between two
 * frame starts is the earlier frame's own callback plus the gap after it, which is what the
 * browser spent outside our callback (layout, paint, GPU uploads, garbage collection, other
 * tasks), so a long interval is charged to the frame before it. Long frames keep their
 * breakdown so a probe or the debug panel can name the cause, not just the number.
 */

export type FrameSection = 'input' | 'sim' | 'events' | 'camera' | 'update' | 'draw' | 'save';

export interface FrameSpike {
  /** Wall time from this frame's start to the next one's, in ms. */
  readonly deltaMs: number;
  /** Time inside our frame callback, in ms. */
  readonly tickMs: number;
  /** Time after it before the next frame started (browser work, GC, other tasks). */
  readonly outsideMs: number;
  readonly sections: Readonly<Partial<Record<FrameSection, number>>>;
  /** performance.now() at the frame's start. */
  readonly atMs: number;
  /** Sim steps run in the frame. */
  readonly steps: number;
}

export interface FrameSummary {
  readonly frames: number;
  readonly p50: number;
  readonly p95: number;
  readonly p99: number;
  readonly worst: number;
  /** Frames longer than `longMs`. */
  readonly long: number;
}

/** Frames kept for the percentiles: about a minute at 60 fps. */
const RING = 4096;
/** Spikes kept with their breakdown, the longest first. */
const KEEP = 40;

export class FrameSpikes {
  /** A frame longer than this keeps its breakdown (two missed 60 Hz frames). */
  longMs = 34;
  private readonly deltas = new Float32Array(RING);
  private count = 0;
  private head = 0;
  private lastStart = 0;
  private lastEnd = 0;
  private start = 0;
  private mark = 0;
  private steps = 0;
  private readonly cur: Partial<Record<FrameSection, number>> = {};
  /**
   * The last finished frame, charged with the interval that ends at the next start. Kept in
   * reused fields: the log itself must not make garbage every frame.
   */
  private prevTick = -1;
  private prevSteps = 0;
  private readonly prevSections: Partial<Record<FrameSection, number>> = {};
  readonly spikes: FrameSpike[] = [];

  begin(now = performance.now()): void {
    if (this.prevTick >= 0 && this.lastStart > 0) {
      const delta = now - this.lastStart;
      this.deltas[this.head] = delta;
      this.head = (this.head + 1) % RING;
      this.count = Math.min(RING, this.count + 1);
      if (delta > this.longMs) {
        this.keep({
          deltaMs: delta,
          tickMs: this.prevTick,
          outsideMs: Math.max(0, now - this.lastEnd),
          sections: { ...this.prevSections },
          atMs: this.lastStart,
          steps: this.prevSteps,
        });
      }
    }
    this.start = now;
    this.mark = now;
    this.steps = 0;
    for (const k in this.cur) delete this.cur[k as FrameSection];
  }

  /** Charge the time since the last lap to `section`. */
  lap(section: FrameSection, now = performance.now()): void {
    this.cur[section] = (this.cur[section] ?? 0) + (now - this.mark);
    this.mark = now;
  }

  noteSteps(n: number): void {
    this.steps += n;
  }

  end(now = performance.now()): void {
    this.prevTick = now - this.start;
    this.prevSteps = this.steps;
    for (const k in this.prevSections) delete this.prevSections[k as FrameSection];
    Object.assign(this.prevSections, this.cur);
    this.lastStart = this.start;
    this.lastEnd = now;
  }

  /** A pause (hidden tab, catch-up) is not a spike: the next frame starts a fresh delta. */
  rest(): void {
    this.lastStart = 0;
    this.prevTick = -1;
  }

  private keep(s: FrameSpike): void {
    if (this.spikes.length >= KEEP && s.deltaMs <= this.spikes[this.spikes.length - 1]!.deltaMs)
      return;
    this.spikes.push(s);
    this.spikes.sort((a, b) => b.deltaMs - a.deltaMs);
    if (this.spikes.length > KEEP) this.spikes.length = KEEP;
  }

  reset(): void {
    this.count = 0;
    this.head = 0;
    this.lastStart = 0;
    this.spikes.length = 0;
  }

  summary(): FrameSummary {
    const n = this.count;
    const xs = Array.from(this.deltas.subarray(0, n)).sort((a, b) => a - b);
    const at = (q: number) => (n ? xs[Math.min(n - 1, Math.floor(q * n))]! : 0);
    let long = 0;
    for (const x of xs) if (x > this.longMs) long++;
    return {
      frames: n,
      p50: at(0.5),
      p95: at(0.95),
      p99: at(0.99),
      worst: n ? xs[n - 1]! : 0,
      long,
    };
  }
}
