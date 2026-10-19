import * as THREE from 'three';
import type { Daylight } from '../render/daylight';
import { GROVE3D } from '../config/tuning';
import type { Location, Vec2, WeatherKind, World } from '../sim/types';
import { FallingLeaves } from './leaves';
import { QuadCloud } from './quad-particles';
import { groveHeight } from './terrain';

/**
 * The 3D Grove's ambient particles, after the pixel view's (`render/particles.ts`): rain
 * and snow over the home ground, fireflies at night and always in the story Hollow, and
 * leaves drifting off the fruit trees by day in clear weather. The same gates apply every
 * frame: none at all under reduced motion, two fifths at the 'light' density, none at
 * 'off', and rain and snow scale with the weather's intensity. Clouds are built on first
 * need; `set` comes with the daylight (every few seconds), `update` every frame.
 *
 * Art pass 2: all of them are quad clouds (`quad-particles.ts`): rain falls as thin
 * streaks and snow as soft flakes, both moved in the vertex shader (they were thousands of
 * points rewritten on the CPU every frame), and fireflies glow and wander there too.
 */

/** A render-side generator, so the weather spends no sim randomness. */
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const COLUMN = 14;

/** A column of falling streaks or flakes round the camera's focus. */
function fallCloud(
  scene: THREE.Object3D,
  count: number,
  o: { speed: number; sway: number; color: string; alpha: number; size: number; stretch: number },
): QuadCloud {
  const cloud = new QuadCloud(scene, count, 'fall', {
    speed: o.speed,
    height: COLUMN,
    sway: o.sway,
  });
  const r = lcg(7);
  const c = new THREE.Color(o.color);
  for (let i = 0; i < count; i++)
    cloud.set(
      (r() - 0.5) * 40,
      r() * COLUMN,
      (r() - 0.5) * 40 + 6,
      c,
      o.alpha,
      o.size,
      o.stretch > 1 ? 'streak' : 'dot',
      {
        stretch: o.stretch,
      },
      i,
    );
  cloud.commit(count);
  cloud.mesh.visible = false;
  return cloud;
}
export class GroveWeather {
  private rain: QuadCloud | null = null;
  private snow: QuadCloud | null = null;
  private fireflies: QuadCloud | null = null;
  private readonly leaves: FallingLeaves;
  private wants = { rain: false, snow: false, flies: false, leaves: false };
  private particles: 'full' | 'light' | 'off' = 'full';
  private readonly reduceQuery =
    typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

  constructor(
    private readonly scene: THREE.Scene,
    home: THREE.Object3D,
  ) {
    this.leaves = new FallingLeaves(home);
  }

  /** What the place, hour and weather ask for. */
  set(
    grove: boolean,
    place: Location,
    weather: WeatherKind,
    d: Daylight,
    particles: 'full' | 'light' | 'off',
  ): void {
    this.particles = particles;
    const on = particles !== 'off';
    this.wants = {
      rain: grove && weather === 'rain' && on,
      snow: grove && weather === 'snow' && on,
      flies: ((grove && d.fireflies) || place === 'hollow') && on,
      leaves: grove && weather === 'clear' && (d.phase === 'day' || d.phase === 'dawn') && on,
    };
    if (this.wants.rain && !this.rain)
      this.rain = fallCloud(this.scene, GROVE3D.rain.streaks, {
        speed: GROVE3D.rain.speed,
        sway: 0,
        color: '#d8e6f0',
        alpha: 0.42,
        size: 0.028,
        stretch: 20,
      });
    // Snow: soft white flakes, slow, drifting as they fall.
    if (this.wants.snow && !this.snow)
      this.snow = fallCloud(this.scene, 1500, {
        speed: 1.1,
        sway: 0.4,
        color: '#ffffff',
        alpha: 0.9,
        size: 0.13,
        stretch: 1,
      });
    if (this.wants.flies && !this.fireflies) {
      const n = 220;
      const flies = new QuadCloud(this.scene, n, 'hover');
      const r = lcg(11);
      const c = new THREE.Color('#ffe08a');
      for (let i = 0; i < n; i++)
        flies.set(
          (r() - 0.5) * 40,
          r() * 3 + 0.3,
          (r() - 0.5) * 40 + 6,
          c,
          1,
          0.26,
          'glow',
          { additive: true },
          i,
        );
      flies.commit(n);
      this.fireflies = flies;
    }
  }

  update(
    world: World,
    trees: Iterable<Vec2>,
    dt: number,
    t: number,
    camTarget: THREE.Vector3,
  ): void {
    const s = world.settings;
    const still =
      s.reducedMotion === 'on' || (s.reducedMotion === 'system' && !!this.reduceQuery?.matches);
    const dens = this.particles === 'light' ? 0.4 : 1;
    const share = dens * Math.min(1, Math.max(0, world.weather.intensity));
    // Snow falls at about two fifths of the rain's rate in the pixel view.
    for (const [p, want, rate] of [
      [this.rain, this.wants.rain, 1],
      [this.snow, this.wants.snow, 0.6],
    ] as const) {
      if (!p) continue;
      p.mesh.visible = want && !still && share > 0;
      p.draw(Math.round(p.max * share * rate));
      // The column follows the camera's focus; the drops fall in the shader.
      if (p.mesh.visible) p.mesh.position.set(camTarget.x, 0, camTarget.z - 6);
    }
    // Fireflies keep their number at any density, as the pixel spawner does.
    if (this.fireflies) this.fireflies.mesh.visible = this.wants.flies && !still;
    this.leaves.points.visible = this.wants.leaves && !still;
    if (this.leaves.points.visible) this.leaves.update(trees, groveHeight, dt, dens);

    void t;
  }
}
