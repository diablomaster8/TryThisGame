/* hot/perf-leaks (2026-11-06): the per-frame hot paths that can run in Node stay inside a frame
 * budget with headroom, and the DOM-write guards that keep the HUD from restyling every frame
 * keep working. Timing asserts follow `budgetMs` (skipped in CI's main suite, scaled in the
 * PERF=1 job). The browser-side numbers live in recs-2026-10-27/tools/pl-frame.cjs. */
import { describe, expect, it } from 'vitest';
import { budgetMs } from '../sim/timing-budget';
import type { SpriteSheet } from '../../src/render/sprites/atlas';
import { MegaAtlas, type AtlasSurface } from '../../src/render/sprites/mega-atlas';
import { SpriteBatch } from '../../src/render/sprite-batch';
import { SIM } from '../../src/config/tuning';
import { startCampaign } from '../../src/sim/campaign';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';
import { installHiddenGuard } from '../../src/platform/dom-guards';
import { cachedQuery } from '../../src/platform/dom-cache';
import { coarsePointer } from '../../src/platform/viewport';

/** One frame at 60 fps. The budgets below are a small share of it: the sim step and the sprite
 *  batch are two of many things a 4x-throttled phone's frame has to fit. */
const FRAME_MS = 1000 / 60;
const STEP_MS_MAX = 20;

function eightNubbins(): World {
  const w = createWorld(11, 0);
  const ev: SimEvent[] = [];
  startCampaign(w, ev);
  const more = 8 - w.nubbins.length;
  if (more > 0) applyCommand(w, { kind: 'debugGive', what: 'egg', amount: more }, ev);
  for (const n of w.nubbins) applyCommand(w, { kind: 'debugHatchNow', nubbinId: n.id }, ev);
  return w;
}

describe('frame budget: sim and sprite batch', () => {
  it('steps a Grove of eight Nubbins well inside a frame (per 100 ms step)', () => {
    const w = eightNubbins();
    for (let i = 0; i < 50; i++) stepWorld(w, SIM.stepMs); // warm up the JIT
    const steps = 600;
    const t0 = performance.now();
    for (let i = 0; i < steps; i++) stepWorld(w, SIM.stepMs);
    const perStep = (performance.now() - t0) / steps;
    expect(w.nubbins.length).toBe(8);
    // Ten steps a second: a step this cheap leaves every sixth frame room for the render. The
    // limit is loose on purpose (a shared dev machine measured 1 to 9 ms), it catches a
    // regression to a step that no phone could fit, not noise.
    expect(perStep).toBeLessThan(budgetMs(STEP_MS_MAX));
  });

  it('batches 600 sprites a frame (eight Nubbins, scenery, shadows) inside a frame share', () => {
    const surface = (size: number): AtlasSurface => ({
      canvas: { width: size, height: size } as HTMLCanvasElement,
      ctx: {
        drawImage: () => undefined,
        clearRect: () => undefined,
      } as unknown as AtlasSurface['ctx'],
    });
    const rect = { x: 0, y: 0, w: 10, h: 10 };
    const sheet: SpriteSheet = {
      texture: { image: { width: 50, height: 50 } } as unknown as SpriteSheet['texture'],
      width: 50,
      height: 50,
      frames: new Map(),
      cellW: 10,
      cellH: 10,
      dispose: () => undefined,
    };
    const batch = new SpriteBatch(new MegaAtlas(512, surface));
    const frame = (): void => {
      batch.begin(0.7, 0.6);
      for (let i = 0; i < 600; i++)
        batch.draw({
          sheet,
          rect,
          flip: (i & 1) === 1,
          x: i % 25,
          y: 0,
          z: Math.floor(i / 25),
          mode: i % 3 === 0 ? 'flat' : 'billboard',
        });
      batch.end();
    };
    for (let i = 0; i < 30; i++) frame();
    const frames = 300;
    const t0 = performance.now();
    for (let i = 0; i < frames; i++) frame();
    const perFrame = (performance.now() - t0) / frames;
    expect(batch.mesh.geometry.drawRange.count).toBe(600 * 6);
    expect(perFrame).toBeLessThan(budgetMs(FRAME_MS / 2));
  });
});

/** A just-enough DOM: one text node under one element, counting node insertions. */
function fakeDom(): { inserted: () => number; el: { textContent: string } } {
  let inserts = 0;
  class FakeNode {
    nodeType = 1;
    firstChild: FakeText | null = null;
    private get text(): string {
      return this.firstChild?.data ?? '';
    }
    get textContent(): string {
      return this.text;
    }
    set textContent(v: string) {
      this.firstChild = v === '' ? null : new FakeText(v);
      if (v !== '') inserts++;
    }
  }
  class FakeText {
    nodeType = 3;
    nextSibling = null;
    constructor(public data: string) {}
  }
  const g = globalThis as unknown as Record<string, unknown>;
  g.Node = FakeNode;
  g.HTMLElement = class {};
  return { inserted: () => inserts, el: new FakeNode() };
}

describe('frame budget: DOM-write guards', () => {
  it('rewriting the same text leaves the text node alone; a new text is written in place', () => {
    const g = globalThis as unknown as Record<string, unknown>;
    const had = { Node: g.Node, HTMLElement: g.HTMLElement };
    try {
      const dom = fakeDom();
      installHiddenGuard();
      dom.el.textContent = '🐚 3';
      expect(dom.inserted()).toBe(1);
      for (let i = 0; i < 1000; i++) dom.el.textContent = '🐚 3';
      expect(dom.inserted()).toBe(1);
      dom.el.textContent = '🐚 4';
      expect(dom.el.textContent).toBe('🐚 4');
      expect(dom.inserted()).toBe(1);
      dom.el.textContent = '';
      expect(dom.el.textContent).toBe('');
    } finally {
      g.Node = had.Node;
      g.HTMLElement = had.HTMLElement;
    }
  });

  it('asks the pointer and the DOM once, then answers from memory', () => {
    const g = globalThis as unknown as Record<string, unknown>;
    let queries = 0;
    let lookups = 0;
    const el = { isConnected: true };
    g.matchMedia = () => {
      queries++;
      return { matches: true, addEventListener: () => undefined };
    };
    g.document = {
      querySelector: () => {
        lookups++;
        return el;
      },
    };
    try {
      for (let i = 0; i < 1000; i++) {
        expect(coarsePointer()).toBe(true);
        expect(cachedQuery('.dialogue')).toBe(el);
      }
      expect(queries).toBe(1);
      expect(lookups).toBe(1);
      el.isConnected = false;
      cachedQuery('.dialogue');
      expect(lookups).toBe(2);
    } finally {
      delete g.matchMedia;
      delete g.document;
    }
  });
});
