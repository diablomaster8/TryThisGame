/**
 * R0509 (TECH-67): a Graphics change in Settings swaps the renderer live, Pixel <-> Full 3D,
 * without reloading the page. A WebGL canvas keeps the one context it was first given, so the
 * swap puts a fresh `#game` canvas in place of the old one, mounts the new renderer on it
 * (`Game.swapRenderer`) and forces the old context lost; the world, HUD, clock and sim loop
 * carry on. Anything that goes wrong part way falls back to the old path: save, mark the slot
 * to resume and reload. The plan and the canvas copy are pure, for the unit tests.
 */
import type { Game } from './game';
import type { GraphicsMode, Settings } from './sim/types';
import {
  currentSlot,
  markResumeSlot,
  readGraphicsPref,
  writeGraphicsPref,
} from './platform/storage';

/** How a Graphics change is carried out. */
export type SwapPlan = 'none' | 'live' | 'reload';

export interface SwapState {
  running: GraphicsMode;
  wanted: GraphicsMode;
  /** A frame threw: the world may be bad, so the old reload path (which never saves it) runs. */
  crashed: boolean;
  /** An offline catch-up is running between paints. */
  catchingUp: boolean;
  /** A minigame covers the Grove and may be drawing with the Grove's renderer. */
  renderPaused: boolean;
  /** `?reloadswap`: the old reload path, for comparison and as a kill switch. */
  forceReload: boolean;
}

/** Live unless the game is mid catch-up, under a minigame, crashed, or told not to. */
export function planGraphicsSwap(s: SwapState): SwapPlan {
  if (s.wanted === s.running) return 'none';
  if (s.crashed || s.catchingUp || s.renderPaused || s.forceReload) return 'reload';
  return 'live';
}

/** The attributes a replacement canvas takes over: all but the backing size and inline style. */
export function carriedAttributes(attrs: ReadonlyArray<{ name: string; value: string }>): Array<{
  name: string;
  value: string;
}> {
  // The 3D scene sets `image-rendering: auto` inline and the input sets a cursor: the Pixel
  // view must get the stylesheet's nearest-neighbour scaling back, so style is not copied.
  const skip = new Set(['style', 'width', 'height']);
  return attrs
    .filter((a) => !skip.has(a.name.toLowerCase()))
    .map((a) => ({ name: a.name, value: a.value }));
}

/** A fresh canvas with the old one's id, class and aria attributes, put in its place. */
export function replaceCanvas(old: HTMLCanvasElement): HTMLCanvasElement {
  const fresh = document.createElement('canvas');
  for (const a of carriedAttributes([...old.attributes])) fresh.setAttribute(a.name, a.value);
  const focused = document.activeElement === old;
  old.replaceWith(fresh);
  if (focused) fresh.focus({ preventScroll: true });
  return fresh;
}

/**
 * Settings changed the Graphics row to `wanted` (with `settings` the row's whole new set).
 * Compared with the device preference, the one source of truth. 'blocked': a reload was
 * needed but storage would not keep the choice, so nothing changed and the row should be put
 * back (with storage blocked the reload would lose this Grove and the choice, review D, 13).
 */
export function changeGraphics(
  g: Game,
  wanted: GraphicsMode,
  settings: Settings,
  hudRoot: HTMLElement,
): SwapPlan | 'blocked' {
  const running = readGraphicsPref();
  const plan = planGraphicsSwap({
    running,
    wanted,
    crashed: g.crashed,
    catchingUp: g.catchingUp,
    renderPaused: g.renderPaused,
    forceReload: new URLSearchParams(location.search).has('reloadswap'),
  });
  if (plan === 'none') return plan;
  // A live swap needs no storage: the choice is kept for the session even when it is blocked.
  const stored = writeGraphicsPref(wanted);
  if (plan === 'reload' && !stored) {
    writeGraphicsPref(running); // the page keeps running the renderer it has
    return 'blocked';
  }
  // The save written before the swap or reload carries the row's other changes too.
  g.world.settings = settings;
  if (plan === 'live') void swapGraphicsLive(g, wanted, hudRoot);
  else reloadForGraphics(g);
  return plan;
}

/** The old path: save, come back to this slot, reload. */
export function reloadForGraphics(g: Game): void {
  g.save();
  markResumeSlot(currentSlot());
  location.reload();
}

/** What the last live swap took, for the debug probes (`window.__groveSwap`). */
export interface SwapTiming {
  to: GraphicsMode;
  /** From the Settings change to the new renderer mounted and drawing. */
  mountMs: number;
  /** To the 3D veil lifting (creatures sculpted); equal to `mountMs` for Pixel. */
  readyMs: number;
}

const nextFrame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));

let swapping = false;

/**
 * Swap `g` to `wanted` in place. `hudRoot` holds the loading veil shown while a 3D scene
 * builds. Resolves once the new renderer is mounted (the 3D veil lifts on its own later).
 */
export async function swapGraphicsLive(
  g: Game,
  wanted: GraphicsMode,
  hudRoot: HTMLElement,
): Promise<void> {
  if (swapping || g.graphics === wanted) return;
  swapping = true;
  const t0 = performance.now();
  let veil: import('./ui/loading-bar').LoadingBar | null = null;
  try {
    g.save();
    let scene: import('./render3d/grove-3d-scene').Grove3dScene | null = null;
    let fresh: HTMLCanvasElement;
    if (wanted === '3d') {
      const [{ LoadingBar }, { spawnSculptWorkers }] = await Promise.all([
        import('./ui/loading-bar'),
        import('./render3d/sculpt-spawn'),
      ]);
      veil = new LoadingBar(hudRoot);
      veil.step(0.05);
      spawnSculptWorkers();
      const m = await import('./render3d/grove-3d-scene');
      veil.step(0.1);
      // The saved creatures start sculpting in workers while the scene builds (just saved).
      m.prewarmCreatures();
      // Let the veil paint before the scene's long synchronous build.
      await nextFrame();
      await nextFrame();
      fresh = replaceCanvas(g.canvas);
      try {
        scene = new m.Grove3dScene(fresh);
      } catch (err) {
        // The old renderer is untouched: put its canvas back and say why on the reload.
        fresh.replaceWith(g.canvas);
        throw err;
      }
    } else {
      fresh = replaceCanvas(g.canvas);
    }
    g.swapRenderer(fresh, wanted, scene);
    const app = fresh.parentElement;
    const rect = app?.getBoundingClientRect();
    if (rect) g.resize(rect.width, rect.height);
    const mountMs = Math.round(performance.now() - t0);
    const timing: SwapTiming = { to: wanted, mountMs, readyMs: mountMs };
    (window as unknown as { __groveSwap?: SwapTiming }).__groveSwap = timing;
    if (scene && veil) {
      // Like a boot: the world holds still behind the veil until the creatures are sculpted.
      g.send({ kind: 'setLoading', on: true });
      veil.restartClock();
      const s3 = scene;
      const bar = veil;
      const watch = (): void => {
        if (g.scene3d !== s3) {
          bar.remove();
          return;
        }
        const s = s3.loadState();
        bar.update(0.2 + 0.8 * s.progress, s.done);
        if (!bar.done) {
          requestAnimationFrame(watch);
          return;
        }
        timing.readyMs = Math.round(performance.now() - t0);
        g.send({ kind: 'setLoading', on: false });
        console.info(`[graphics] Full 3D ready ${timing.readyMs} ms after the switch`);
      };
      requestAnimationFrame(watch);
    } else console.info(`[graphics] Pixel ready ${mountMs} ms after the switch`);
  } catch (err) {
    veil?.remove();
    console.warn('Graphics: the live switch failed; reloading instead.', err);
    // Before the mount the old renderer still runs; after it the bundle may be half built.
    // Either way the reload is the one safe road back.
    reloadForGraphics(g);
  } finally {
    swapping = false;
  }
}
