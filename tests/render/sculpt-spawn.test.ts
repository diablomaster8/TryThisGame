import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/** A stand-in Worker: records what was made and ended, and can fail to load. */
class FakeWorker {
  static made: FakeWorker[] = [];
  onerror: ((e: { preventDefault(): void }) => void) | null = null;
  ended = false;
  constructor() {
    FakeWorker.made.push(this);
  }
  terminate(): void {
    this.ended = true;
  }
  fail(): void {
    this.onerror?.({ preventDefault: () => undefined });
  }
}

describe('sculpt workers started at the title (perf-leaks D)', () => {
  beforeEach(() => {
    vi.resetModules();
    FakeWorker.made = [];
    vi.stubGlobal('Worker', FakeWorker);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('starts one set once and hands it over once', async () => {
    const m = await import('../../src/render3d/sculpt-spawn');
    m.spawnSculptWorkers();
    m.spawnSculptWorkers();
    expect(FakeWorker.made.length).toBe(m.sculptWorkerCount());
    expect(m.takeSculptWorkers().length).toBe(m.sculptWorkerCount());
    expect(m.takeSculptWorkers()).toEqual([]);
  });

  it('never hands over a worker that failed to load', async () => {
    const m = await import('../../src/render3d/sculpt-spawn');
    m.spawnSculptWorkers();
    FakeWorker.made[0]!.fail();
    const got = m.takeSculptWorkers() as unknown as FakeWorker[];
    expect(got).not.toContain(FakeWorker.made[0]);
    expect(got.length).toBe(FakeWorker.made.length - 1);
    expect(FakeWorker.made[0]!.ended).toBe(true);
  });

  it('lets the workers go when Pixel is picked, and can start again', async () => {
    const m = await import('../../src/render3d/sculpt-spawn');
    m.spawnSculptWorkers();
    const first = [...FakeWorker.made];
    m.dropSculptWorkers();
    expect(first.every((w) => w.ended)).toBe(true);
    expect(m.takeSculptWorkers()).toEqual([]);
    m.spawnSculptWorkers();
    expect(FakeWorker.made.length).toBe(first.length * 2);
  });
});
