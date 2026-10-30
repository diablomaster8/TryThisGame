import { describe, expect, it } from 'vitest';
import { FRAME_LOG } from '../../src/config/tuning';
import { FRAME_WORK, FrameSpikes } from '../../src/platform/frame-spikes';
import type { SpriteSheet } from '../../src/render/sprites/atlas';
import { SheetCache } from '../../src/render/sprites/sheets';
import type { Nubbin } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

/** TECH-31: the frame log's 10 s histogram, its bake count, and one bake a frame. */
describe('frame log work and window', () => {
  it('summarises only the latest window of frames', () => {
    const log = new FrameSpikes();
    let t = 0;
    const frame = (ms: number) => {
      log.begin(t);
      log.end(t + 1);
      t += ms;
    };
    for (let i = 0; i < 600; i++) frame(50); // 30 s of slow frames
    for (let i = 0; i < 700; i++) frame(16); // then 11 s of smooth ones
    frame(16);
    expect(log.summary().p99).toBeGreaterThan(40);
    const recent = log.summary(FRAME_LOG.windowMs);
    expect(recent.p99).toBeLessThan(20);
    expect(recent.frames).toBeLessThan(700);
  });

  it('names the bakes and HUD time in a long frame', () => {
    const log = new FrameSpikes();
    log.begin(0);
    log.end(1);
    log.begin(16);
    FRAME_WORK.bakes = 2;
    FRAME_WORK.bakeMs = 30;
    FRAME_WORK.hudMs = 4;
    log.end(50);
    log.begin(60);
    expect(log.spikes[0]?.work).toEqual({ bakes: 2, bakeMs: 30, hudMs: 4 });
    expect(FRAME_WORK.bakes).toBe(0);
  });

  it('bakes at most one new Nubbin sheet a frame in the world view, and the rest catch up', () => {
    const cache = new SheetCache(() => 0);
    const built: string[] = [];
    // Stand in for the canvas drawing (no canvas under Node).
    (cache as unknown as { nubbinSheet: (n: Nubbin) => SpriteSheet }).nubbinSheet = (n) =>
      cache.get(SheetCache.nubbinKey(n), () => {
        built.push(n.id);
        return { dispose: () => undefined } as unknown as SpriteSheet;
      });
    const w = createWorld(5, 0);
    for (let i = 0; i < 4000; i++) stepWorld(w, 100, 1000 + i * 100);
    const ns = w.nubbins.filter((n) => n.stage !== 'egg');
    expect(ns.length).toBeGreaterThan(1);
    const log = new FrameSpikes();
    let t = 0;
    const frame = () => {
      log.begin((t += 16));
      for (const n of ns) cache.forNubbin(n, true);
      log.end(t + 1);
    };
    frame(); // first sight: every Nubbin is baked
    expect(built.length).toBe(new Set(ns.map((n) => SheetCache.nubbinKey(n))).size);
    built.length = 0;
    // Each look changes at once (a different hat each): one new sheet a frame until all are in.
    const hats = ['crown', 'tophat', 'bow', 'cap', 'flower', 'party', 'beanie', 'halo'];
    ns.forEach((n, i) => (n.hat = hats[i % hats.length]!));
    // (A creature of another family wears no drawn hat: its look stays.)
    const keys = new Set(ns.map((n) => SheetCache.nubbinKey(n)).filter((k) => !cache.has(k)));
    expect(keys.size).toBeGreaterThan(1);
    for (let i = 0; i < keys.size; i++) {
      frame();
      expect(built.length).toBe(i + 1);
    }
    frame();
    expect(built.length).toBe(keys.size);
    for (const n of ns) expect(cache.has(SheetCache.nubbinKey(n))).toBe(true);
    // A one-shot drawing never waits.
    log.begin((t += 16));
    FRAME_WORK.bakes = 5;
    const n0 = { ...ns[0]!, hat: 'tophat' };
    cache.forNubbin(n0);
    expect(built.at(-1)).toBe(n0.id);
  });
});
