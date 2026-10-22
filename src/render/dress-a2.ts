import { CG4_A2 } from '../config/tuning-a2';
import type { SceneStage } from '../config/story';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { stageFlags, terraceY } from './scene-stage';
import { StageTracker } from './stage-actors';
import { AtlasBuilder, type SpriteSheet } from './sprites/atlas';
import { frameKey } from './sprites/animations';
import { PixelCanvas } from './sprites/pixel-canvas';
import { PrintTrail, type Print } from './walk-prints';
import { groundType } from './walk-on';

/**
 * Campaign graphics 4, package a2, pixel: the footprints walk-ons leave on snow, mud and
 * sand (K36). The walk-ons themselves (K5) and the partner's reactions (K40) live in the
 * shared stager (render/scene-stage.ts, walk-on.ts) that both renderers read; this
 * dressing only watches who is mid-stride and lays a ring of flat print sprites behind them.
 * Under reduced motion no one walks, so nothing is laid.
 */
const GROUND = { snow: 0, mud: 1, sand: 2 } as const;

function buildPrintSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(8, 8, 1);
  const P = CG4_A2.prints;
  [P.snow.pixel, P.mud.pixel, P.sand.pixel].forEach((c, i) => {
    const pc = new PixelCanvas(8, 8);
    pc.ellipse(4, 4, 2, 3, c);
    atlas.add(frameKey('print', 'front', i), pc);
  });
  return atlas.build();
}

class PixelA2 implements PixelDressing {
  readonly id = 'a2';
  private ctx: PixelDressCtx | null = null;
  private tracker = new StageTracker();
  private readonly trail = new PrintTrail();
  private ring: Print[] = [];
  private cursor = 0;
  private loc = '';
  private scene = '';

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.tracker = new StageTracker();
    this.ring = [];
    this.cursor = 0;
    this.loc = this.scene = '';
    this.trail.reset();
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    const sp = ctx?.sprites;
    if (!ctx || !sp) return;
    const tracker = this.tracker;
    tracker.tick(world, dt);
    // Prints belong to one place, and one scene's walk: a new place or scene clears them.
    const id = tracker.stager.id;
    if (world.location !== this.loc || (id && id !== this.scene)) {
      this.ring = [];
      this.cursor = 0;
      this.trail.reset();
    }
    this.loc = world.location;
    if (id) this.scene = id;
    const g = groundType(stageFlags(world, tracker.stage));
    const P = CG4_A2.prints;
    if (g && !ctx.reduceMotion()) {
      for (const p of this.trail.feed(tracker.stager.walkers, GROUND[g])) {
        if (this.ring.length < P.cap) this.ring.push(p);
        else this.ring[this.cursor] = p;
        this.cursor = (this.cursor + 1) % P.cap;
      }
    }
    if (!this.ring.length) return;
    const sheet = sp.sheets.get('a2:prints', buildPrintSheet);
    const dim = Math.max(0.35, 1 - 0.5 * daylight.darkness);
    const grove = world.location === 'grove';
    for (const p of this.ring) {
      const rect = sheet.frames.get(frameKey('print', 'front', p.ground));
      if (!rect) continue;
      sp.batch.draw({
        sheet,
        rect,
        flip: false,
        x: p.x,
        y: (grove ? terraceY(p.x, p.z) : 0) + 0.02,
        z: p.z,
        mode: 'flat',
        w: P.size * 0.75,
        h: P.size * 1.1,
        opacity: P.opacity,
        tint: dim,
      });
    }
    void stage;
  }

  dispose(): void {
    this.ring = [];
    this.ctx = null;
  }
}

export const dressA2: PixelDressing = new PixelA2();
