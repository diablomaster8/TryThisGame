import type { SceneStage } from '../config/story';
import { CG4_D4 } from '../config/tuning-d4';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import { moonPhaseFor, rainingNow, WetTracker, type MoonPhase } from './d4-state';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { RasterAtlas } from './paint/atlas';
import { paintLightBand, paintPuddle, PUDDLE_PX, RAY_PX } from './paint/d4';
import { stageFlags } from './scene-stage';
import type { SpriteSheet } from './sprites/atlas';

/**
 * Campaign graphics 4, package d4, pixel: the moon and stars at the sky edge of the view (K24),
 * puddles that appear in three steps in the rain and dry after (K34), and dithered diagonal
 * light bands on a crisp morning (K22). Snow cover and path wear (K25, K26) are repainted
 * ground levels in dress-w.ts / ground.ts; the Hush's walk (K17) is in dress-w.ts.
 */

const hash1 = (i: number, salt: number): number => {
  const s = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * The sky-edge overlay: stars and the moon, painted a pixel at a time on a small canvas that
 * the page stretches with nearest-neighbour filtering, like the game canvas under it. It sits
 * between the game canvas and the HUD, and is only redrawn when the phase changes.
 */
class MoonOverlay {
  private readonly canvas: HTMLCanvasElement;
  private phase: MoonPhase | null = null;

  constructor() {
    const m = CG4_D4.moon;
    const c = document.createElement('canvas');
    c.width = m.pixelSize;
    c.height = m.pixelSize;
    c.className = 'moon-overlay';
    c.setAttribute('aria-hidden', 'true');
    const s = c.style;
    s.position = 'absolute';
    s.left = 'calc(var(--safe-left, 0px) + 14px)';
    s.top = 'calc(var(--safe-top, 0px) + 56px)';
    s.imageRendering = 'pixelated';
    s.pointerEvents = 'none';
    s.opacity = '0';
    this.size(c);
    const app = document.getElementById('app');
    const hud = document.getElementById('hud');
    if (app && hud) app.insertBefore(c, hud);
    else document.body.appendChild(c);
    this.canvas = c;
  }

  /** One moon pixel is about one game pixel (the target is about 540 px tall). */
  private size(c: HTMLCanvasElement): void {
    const k = Math.max(1, Math.round(innerHeight / 270));
    c.style.width = `${c.width * k}px`;
    c.style.height = `${c.height * k}px`;
  }

  /** Paint the moon for `phase`: a disc shaded by its phase, with a ragged terminator. */
  private paint(phase: MoonPhase): void {
    const m = CG4_D4.moon;
    const g = this.canvas.getContext('2d');
    if (!g) return;
    g.clearRect(0, 0, m.pixelSize, m.pixelSize);
    const lit = m.lit[phase];
    const a = Math.acos(2 * lit - 1);
    const lx = Math.sin(a);
    const lz = Math.cos(a);
    const cx = m.pixelSize / 2;
    const cy = m.pixelSize / 2;
    const R = m.pixelSize / 2 - 1;
    for (let y = -R; y < R; y++)
      for (let x = -R; x < R; x++) {
        const d = Math.hypot(x + 0.5, y + 0.5);
        if (d > R) continue;
        const nx = (x + 0.5) / R;
        const ny = (y + 0.5) / R;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        const l = nx * lx + nz * lz;
        const crater = hash1(x * 7 + 3, y * 5 + 1) > 0.9;
        if (l > 0.06) g.fillStyle = crater ? '#bfc6d6' : '#f2f1dc';
        else if (l > -0.06 && (x + y) % 2 === 0) g.fillStyle = '#f2f1dc';
        else g.fillStyle = d > R - 1.2 ? '#4a5578' : '#2a3250';
        g.fillRect(cx + x, cy + y, 1, 1);
      }
  }

  update(phase: MoonPhase, night: number): void {
    if (phase !== this.phase) {
      this.phase = phase;
      this.paint(phase);
    }
    this.size(this.canvas);
    this.canvas.style.opacity = String(Math.max(0, Math.min(1, (night - 0.35) / 0.4)));
  }

  hide(): void {
    this.canvas.style.opacity = '0';
  }

  dispose(): void {
    this.canvas.remove();
  }
}

class PixelD4 implements PixelDressing {
  readonly id = 'd4';
  private ctx: PixelDressCtx | null = null;
  private moon: MoonOverlay | null = null;
  private sheet: SpriteSheet | null = null;
  private wet = new WetTracker();
  private rayK = 0;

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.moon = null;
    this.sheet = null;
    this.wet = new WetTracker();
    this.rayK = 0;
    if (typeof document === 'undefined') return;
    try {
      this.moon = new MoonOverlay();
      if (ctx.sprites) {
        const atlas = new RasterAtlas(512);
        atlas.add('ray', paintLightBand());
        for (let i = 0; i < 3; i++) atlas.add(`puddle${i}`, paintPuddle(i * 17));
        this.sheet = atlas.build();
        ctx.track(this.sheet);
      }
    } catch {
      this.moon = null;
    }
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const staged = Object.keys(stage).length ? stage : null;
    const flags = stageFlags(world, staged);
    const home = flags.location === 'grove';
    const shown = home && stage.exclusive !== true;

    // K24: the moon and stars at the sky's edge.
    if (this.moon) {
      if (shown) this.moon.update(moonPhaseFor(flags), daylight.darkness);
      else this.moon.hide();
    }

    const sp = ctx.sprites;
    const sheet = this.sheet;
    const wet = this.wet.update(home && rainingNow(world.weather.kind, stage), dt);
    // K22: the shafts ease in and out; reduced motion cuts.
    const morning =
      stage.grade === 'crisp' ||
      flags.half === 'dawn' ||
      (flags.campaign === 'hundred' && flags.chapter === 10);
    const goal = shown && morning && flags.inside === null && daylight.darkness < 0.35 ? 1 : 0;
    this.rayK += (goal - this.rayK) * (reduce ? 1 : Math.min(1, dt / 1.5));
    if (Math.abs(goal - this.rayK) < 0.01) this.rayK = goal;
    if (!sp || !sheet || !shown) return;
    const batch = sp.batch;
    const dim = 1 - 0.55 * daylight.darkness;

    // K34: puddles in three steps (four, eight, twelve), each step a little larger.
    const w = CG4_D4.wet;
    const step = wet >= w.steps[2] ? 3 : wet >= w.steps[1] ? 2 : wet >= w.steps[0] ? 1 : 0;
    for (let i = 0; i < step * 4 && i < w.pixelSpots.length; i++) {
      const s = w.pixelSpots[i]!;
      const rect = sheet.frames.get(`puddle${i % 3}`);
      if (!rect) continue;
      const width = w.pixelW * s.s * (0.8 + 0.1 * step);
      batch.draw({
        sheet,
        rect,
        flip: false,
        x: s.x,
        y: 0.03,
        z: s.z,
        mode: 'flat',
        w: width,
        h: (width * PUDDLE_PX.h) / PUDDLE_PX.w,
        tint: dim,
        opacity: 0.9,
      });
    }

    // K22: dithered diagonal bands of light through the tree line, behind the Keeper.
    if (this.rayK > 0.01) {
      const r = CG4_D4.rays;
      const rect = sheet.frames.get('ray');
      if (rect) {
        const k = world.keeper.pos;
        for (let i = 0; i < r.pixelBands; i++) {
          const lat = (i - (r.pixelBands - 1) / 2) * r.spread * 0.9;
          batch.draw({
            sheet,
            rect,
            flip: false,
            x: k.x + lat,
            y: 0,
            z: k.z - 1.5 - i * 2,
            mode: 'billboard',
            w: r.pixelW,
            h: (r.pixelW * RAY_PX.h) / RAY_PX.w + r.pixelH * 0.4,
            opacity: r.pixelOpacity * this.rayK,
          });
        }
      }
    }
  }

  dispose(): void {
    this.moon?.dispose();
    this.moon = null;
    this.sheet = null;
    this.ctx = null;
  }
}

export const dressD4: PixelDressing = new PixelD4();
