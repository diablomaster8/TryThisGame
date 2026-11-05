/**
 * TECH-11: `window.grove.test`, the hooks browser specs use. Installed only by a `?e2e`
 * load (main.ts imports this file lazily), so a normal build never carries it into play.
 * `screenToWorld` and `worldToScreen` let a spec tap real canvas positions instead of
 * guessing pixels; `events()` returns the recent SimEvents the Game fed the HUD.
 */
import { Vector3 } from 'three';
import type { Game } from '../game';
import { createWorld } from '../sim/world';
import type { SimEvent } from '../sim/types';
import { RENDER_HOLD } from '../ui/render-hold';

const KEEP = 200;
/**
 * R0454 (TECH-12, r12-d3): a frozen frame first runs `SETTLE_FRAMES` frames of exactly 1/60 s
 * (the camera and fades converge the same way on a fast or a slow machine), then holds the
 * frame clock at `HOLD_MS`, so every time-driven sway, ripple and bob is drawn at one phase.
 */
const SETTLE_FRAMES = 40;
const HOLD_MS = 3_600_000;

export interface E2eApi {
  seed(n: number): void;
  setTimeScale(scale: number): void;
  events(): SimEvent[];
  /** TECH-12: a still frame: no particles, reduced motion, and a clock that barely runs. */
  freeze(): void;
  /** R0454: true once a frozen frame holds its clock and has drawn twice since. */
  frozen(): boolean;
  /** R0454: resolves after `n` more frames (with `?still`, n/60 s of game time each). */
  frames(n: number): Promise<void>;
  /** Client (CSS pixel) position of a world point, or of a Nubbin by id. */
  worldToScreen(
    target: string | { x: number; z: number; y?: number },
  ): { x: number; y: number } | null;
  screenToWorld(clientX: number, clientY: number): { x: number; z: number } | null;
}

export function installE2eApi(game: Game): E2eApi {
  const recent: SimEvent[] = [];
  const hooks = (game as unknown as { hooks: { onEvents(e: SimEvent[]): void } }).hooks;
  const original = hooks.onEvents.bind(hooks);
  hooks.onEvents = (events: SimEvent[]): void => {
    recent.push(...events);
    if (recent.length > KEEP) recent.splice(0, recent.length - KEEP);
    original(events);
  };
  const v = new Vector3();
  let settled = 0;
  /** The `?still` load's clock (main.ts), which runs only while a test asks it to. */
  const stillClock = (): { run: boolean } | null => {
    const c = game.frameClock as { run?: boolean } | null;
    return c && typeof c.run === 'boolean' ? (c as { run: boolean }) : null;
  };
  let held = 0;
  const api: E2eApi = {
    seed: (n) => game.replaceWorld(createWorld(n, Date.now())),
    setTimeScale: (s) => game.setTimeScale(s),
    events: () => recent.slice(),
    freeze() {
      game.send({
        kind: 'setSettings',
        settings: { ...game.world.settings, particles: 'off', reducedMotion: 'on' },
      });
      game.setTimeScale(1e-6);
      // R0454: noon whatever the machine's clock says, full quality whatever its speed, and a
      // frame clock that settles in fixed steps and then stands still.
      game.hourOverride = 12;
      game.scene3d?.governor.pin();
      RENDER_HOLD.off = true;
      // Rain and leaves already falling were spawned on the real clock: start the frame clear.
      game.view.particles.clear();
      // A `?still` load already steps its clock from the first frame (main.ts); keep that one.
      let t: number | null = null;
      const still = stillClock();
      if (still) still.run = true;
      const step = game.frameClock ?? ((now: number) => (t = t === null ? now : t + 1000 / 60));
      settled = 0;
      held = 0;
      game.frameClock = (now) => {
        if (++settled <= SETTLE_FRAMES) return step(now);
        held++;
        return HOLD_MS;
      };
    },
    // The Pixel ground's full painting comes from a worker: a slow first load shows the quick one.
    frozen: () => held > 2 && game.grove?.groundReady !== false,
    frames: (n) =>
      new Promise<void>((done) => {
        let left = n;
        const still = stillClock();
        if (still) still.run = true;
        const poll = (): void => {
          if (--left > 0) return;
          game.framePollers.splice(game.framePollers.indexOf(poll), 1);
          if (still) still.run = false;
          done();
        };
        game.framePollers.push(poll);
      }),
    worldToScreen(target) {
      let p: { x: number; z: number; y?: number } | undefined;
      if (typeof target === 'string') {
        const n = game.world.nubbins.find((m) => m.id === target);
        p = n ? { x: n.pos.x, z: n.pos.z, y: n.y + 0.5 } : undefined;
      } else p = target;
      if (!p) return null;
      const rect = game.canvas.getBoundingClientRect();
      v.set(p.x, p.y ?? 0, p.z).project(game.camera.camera);
      return {
        x: rect.left + ((v.x + 1) / 2) * rect.width,
        y: rect.top + ((1 - v.y) / 2) * rect.height,
      };
    },
    screenToWorld: (x, y) => game.picker.groundPoint(x, y, game.camera.camera),
  };
  return api;
}
