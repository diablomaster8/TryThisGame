/**
 * R0329 (FUN-40): weather gags over the Nubbins, render only. In rain one Nubbin holds a
 * leaf over its head, which blows inside out once a while; in snow one catches a flake on
 * its tongue and shivers; the first minute of a clear spell after rain, one splashes in a
 * puddle; two or more swimmers paddle in time with a splash. Each is a small DOM sprite
 * projected through whichever camera is drawing (like the bark bubbles), so both
 * renderers show the same gag. The choice of Nubbin and the timing are read from the
 * sim's clock and ids; nothing here changes the sim.
 */
import '../fun.css';
import * as THREE from 'three';
import { WEATHER_GAGS } from '../config/tuning-fun';
import type { Game } from '../game';
import { playSound } from '../platform/audio';
import { terraceY } from '../render/scene-stage';
import { viewRect } from '../render/stage-api';
import { standHeight } from '../render3d/terrain-shape';
import { hashSeed } from '../sim/rng';
import type { Nubbin, WeatherKind } from '../sim/types';
import { el } from './dom';

type Gag = 'leaf' | 'leafFlip' | 'tongue' | 'shiver' | 'puddle' | 'paddle';

const ICON: Record<Gag, string> = {
  leaf: '🍃',
  leafFlip: '🍂',
  tongue: '❄',
  shiver: '🥶',
  puddle: '💦',
  paddle: '💦',
};

/** The gag (if any) a Nubbin shows now. Pure, exported for the test. */
export function gagFor(
  n: Pick<Nubbin, 'id' | 'stage' | 'behavior'>,
  all: ReadonlyArray<Pick<Nubbin, 'id' | 'stage' | 'behavior'>>,
  weather: WeatherKind,
  timeMs: number,
  clearSinceRainMs: number | null,
): Gag | null {
  if (n.stage === 'egg') return null;
  const free = (x: (typeof all)[number]): boolean =>
    x.stage !== 'egg' && !['held', 'thrown', 'nap', 'swim'].includes(x.behavior.state);
  if (n.behavior.state === 'swim') {
    const swimmers = all.filter((x) => x.behavior.state === 'swim').length;
    if (swimmers < 2) return null;
    // In time: every swimmer splashes on the same beat.
    return timeMs % WEATHER_GAGS.paddleMs < 500 ? 'paddle' : null;
  }
  // One performer at a time: the free Nubbin whose id hashes lowest for this cycle.
  const cycle = Math.floor(timeMs / WEATHER_GAGS.cycleMs);
  const pick = all
    .filter(free)
    .sort((a, b) => (hashSeed(`${a.id}:${cycle}`) >>> 0) - (hashSeed(`${b.id}:${cycle}`) >>> 0))[0];
  if (!pick || pick.id !== n.id) return null;
  const t = timeMs % WEATHER_GAGS.cycleMs;
  if (weather === 'rain')
    return t > WEATHER_GAGS.flipAt && t < WEATHER_GAGS.flipAt + 900 ? 'leafFlip' : 'leaf';
  if (weather === 'snow') {
    if (t < WEATHER_GAGS.tongueMs) return 'tongue';
    if (t < WEATHER_GAGS.tongueMs + WEATHER_GAGS.shiverMs) return 'shiver';
    return null;
  }
  if (clearSinceRainMs !== null && timeMs - clearSinceRainMs < WEATHER_GAGS.puddleWindowMs)
    return t < 2500 ? 'puddle' : null;
  return null;
}

export class NubbinGags {
  private readonly pool = new Map<string, HTMLDivElement>();
  private readonly v = new THREE.Vector3();
  private lastWeather: WeatherKind | null = null;
  private clearSinceRainMs: number | null = null;
  private lastSplashMs = -Infinity;

  constructor(private readonly parent: HTMLElement) {}

  update(g: Game): void {
    const w = g.world;
    const weather = w.weather.kind;
    if (this.lastWeather === 'rain' && weather === 'clear') this.clearSinceRainMs = w.timeMs;
    if (weather !== 'clear') this.clearSinceRainMs = null;
    this.lastWeather = weather;
    const scene = (w.campaign?.queue.length ?? 0) > 0 || w.location !== 'grove';
    const s3 = g.scene3d;
    const cam: THREE.Camera = s3 ? s3.camera : g.camera.camera;
    const view = viewRect();
    let splash = false;
    const seen = new Set<string>();
    for (const n of w.nubbins) {
      const gag = scene ? null : gagFor(n, w.nubbins, weather, w.timeMs, this.clearSinceRainMs);
      let e = this.pool.get(n.id);
      seen.add(n.id);
      if (!gag) {
        if (e) e.hidden = true;
        continue;
      }
      if (!e) {
        e = el('div', 'nubbin-gag');
        e.setAttribute('aria-hidden', 'true');
        this.parent.append(e);
        this.pool.set(n.id, e);
      }
      if (e.dataset.gag !== gag) {
        e.dataset.gag = gag;
        e.textContent = ICON[gag];
        if (gag === 'paddle' || gag === 'puddle') splash = true;
      }
      const ground = s3 ? standHeight(n.pos.x, n.pos.z) : terraceY(n.pos.x, n.pos.z);
      const lift = gag === 'leaf' || gag === 'leafFlip' ? 1.15 : gag === 'tongue' ? 0.95 : 0.3;
      const p = this.v.set(n.pos.x, ground + n.y + lift, n.pos.z).project(cam);
      const on = p.z <= 1 && p.z >= -1 && Math.abs(p.x) < 1 && Math.abs(p.y) < 1;
      e.hidden = !on;
      if (on) {
        e.style.left = `${view.x + ((p.x + 1) / 2) * view.w}px`;
        e.style.top = `${view.y + ((1 - p.y) / 2) * view.h}px`;
      }
    }
    for (const [id, e] of this.pool)
      if (!seen.has(id)) {
        e.remove();
        this.pool.delete(id);
      }
    const now = performance.now();
    if (splash && now - this.lastSplashMs > 1500) {
      this.lastSplashMs = now;
      playSound('splash');
    }
  }
}
