import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  GROVE3D,
  PERF_BUDGET,
  PERF_GLOBAL,
  PERF_TIERS,
  RENDER,
  TIER_BUDGET,
  WORLD_MEM,
} from '../../src/config/tuning';
import { detectTier } from '../../src/platform/device-tier';

/** TECH-09: the per-tier budget exists, is ordered, and agrees with the governor it feeds. */
describe('performance budget per tier', () => {
  it('has every tier, cheapest first', () => {
    expect(Object.keys(TIER_BUDGET)).toEqual([...PERF_TIERS]);
    for (const t of PERF_TIERS) {
      const b = TIER_BUDGET[t];
      expect(b.fps, t).toBeGreaterThanOrEqual(30);
      // The p95 frame may run a little past the target frame, never past the 30 fps floor.
      expect(b.p95Ms, t).toBeGreaterThanOrEqual(1000 / b.fps - 0.5);
      expect(b.p95Ms, t).toBeLessThanOrEqual(1000 / 30 + 0.5);
      if (b.p99Ms !== null) expect(b.p99Ms, t).toBeGreaterThanOrEqual(b.p95Ms);
      expect(b.pixelHeight, t).toBe(RENDER.targetHeight);
    }
  });

  it('grows from low to high', () => {
    const [low, mid, high] = PERF_TIERS.map((t) => TIER_BUDGET[t]);
    expect(low!.fps).toBeLessThanOrEqual(mid!.fps);
    expect(low!.calls).toBeLessThan(mid!.calls);
    expect(mid!.calls).toBeLessThan(high!.calls);
    expect(low!.heapMB).toBeLessThan(mid!.heapMB);
    expect(mid!.heapMB).toBeLessThan(high!.heapMB);
    expect(low!.three.ratio).toBeLessThan(mid!.three.ratio);
    expect(mid!.three.ratio).toBeLessThanOrEqual(high!.three.ratio);
    expect(low!.three.offered).toBe(false);
  });

  it('starts 3D inside the governor and its geometry budget', () => {
    const g = GROVE3D.governor;
    for (const t of PERF_TIERS) {
      const r = TIER_BUDGET[t].three.ratio;
      expect(r, t).toBeGreaterThanOrEqual(g.minRatio);
      expect(r, t).toBeLessThanOrEqual(g.maxRatio);
    }
    // The governor sheds geometry before the tier's draw-call line is reached.
    expect(PERF_BUDGET.phone.calls).toBeLessThanOrEqual(TIER_BUDGET.mid.calls);
    expect(PERF_BUDGET.desktop.calls).toBeLessThanOrEqual(TIER_BUDGET.high.calls);
    expect(WORLD_MEM.desktop.heapMB).toBeLessThanOrEqual(TIER_BUDGET.high.heapMB);
  });

  it('keeps the shared budgets at the brief', () => {
    expect(PERF_GLOBAL.catchUp7dMs).toBe(3000);
    expect(PERF_GLOBAL.firstFrameMs).toBe(3000);
    expect(PERF_GLOBAL.eagerJsKbGz).toBe(450);
    expect(PERF_GLOBAL.autosaveMs).toBeLessThanOrEqual(2);
  });

  it('is published in docs/perf-budget.md with the same numbers', () => {
    const doc = readFileSync(new URL('../../docs/perf-budget.md', import.meta.url), 'utf8');
    for (const t of PERF_TIERS) {
      const b = TIER_BUDGET[t];
      const row = doc.split('\n').find((l) => new RegExp(`^\\| ${t} +\\|`).test(l));
      expect(row, t).toBeDefined();
      expect(row, t).toContain(`${b.fps} fps`);
      expect(row, t).toContain(`p95 ≤${b.p95Ms} ms`);
      expect(row, t).toContain(`heap ≤${b.heapMB} MB`);
      expect(row, t).toContain(`≤${b.calls} calls`);
      expect(row, t).toContain(`ratio ${b.three.ratio}`);
    }
    expect(doc).toContain(`≤${PERF_GLOBAL.eagerJsKbGz} kB`);
  });
});

describe('detectTier', () => {
  it('reads low from memory, the GPU or the benchmark', () => {
    expect(detectTier({ memoryGB: 3, phone: true }).tier).toBe('low');
    expect(detectTier({ gpu: 'Mali-G52 MC2', phone: true }).tier).toBe('low');
    expect(detectTier({ gpu: 'Adreno (TM) 610', phone: true }).tier).toBe('low');
    expect(detectTier({ sculpt: 'slow', phone: false }).tier).toBe('low');
  });

  it('reads high only off a phone, with a desktop GPU and enough memory', () => {
    expect(detectTier({ memoryGB: 8, gpu: 'NVIDIA GeForce RTX 3060', phone: false }).tier).toBe(
      'high',
    );
    expect(detectTier({ gpu: 'ANGLE (Intel, Intel(R) UHD Graphics 630)', phone: false }).tier).toBe(
      'high',
    );
    expect(detectTier({ memoryGB: 8, gpu: 'NVIDIA GeForce RTX 3060', phone: true }).tier).toBe(
      'mid',
    );
    expect(detectTier({ memoryGB: 6, gpu: 'Radeon RX 580', phone: false }).tier).toBe('mid');
    expect(detectTier({ sculpt: 'desktop', phone: false }).tier).toBe('high');
  });

  it('defaults to mid', () => {
    expect(detectTier({ phone: true }).tier).toBe('mid');
    expect(detectTier({ gpu: 'Apple GPU', memoryGB: 6, phone: true }).tier).toBe('mid');
    expect(detectTier({ gpu: 'Adreno (TM) 730', phone: true }).tier).toBe('mid');
    expect(detectTier({ gpu: 'Google SwiftShader', phone: false }).tier).toBe('mid');
  });
});
