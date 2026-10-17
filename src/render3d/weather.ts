import * as THREE from 'three';
import type { Daylight } from '../render/daylight';
import { buildParticles } from '../samples/aaa-kit';
import type { Location, Vec2, WeatherKind, World } from '../sim/types';
import { FallingLeaves } from './leaves';
import { groveHeight } from './terrain';

/**
 * The 3D Grove's ambient particles, after the pixel view's (`render/particles.ts`): rain
 * and snow over the home ground, fireflies at night and always in the story Hollow, and
 * leaves drifting off the fruit trees by day in clear weather. The same gates apply every
 * frame: none at all under reduced motion, two fifths at the 'light' density, none at
 * 'off', and rain and snow scale with the weather's intensity. Clouds are built on first
 * need; `set` comes with the daylight (every few seconds), `update` every frame.
 */
export class GroveWeather {
  private rain: THREE.Points | null = null;
  private snow: THREE.Points | null = null;
  private fireflies: THREE.Points | null = null;
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
    if (this.wants.rain && !this.rain) this.rain = buildParticles(this.scene, 'rain');
    // Snow: the rain cloud's layout, white, fat and slow, drifting as it falls.
    if (this.wants.snow && !this.snow) {
      this.snow = buildParticles(this.scene, 'rain');
      if (this.snow) {
        const m = this.snow.material as THREE.PointsMaterial;
        m.color.set('#ffffff');
        m.size = 0.13;
        m.opacity = 0.9;
      }
    }
    if (this.wants.flies && !this.fireflies) this.fireflies = buildParticles(this.scene, 'golden');
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
      p.visible = want && !still && share > 0;
      const n = (p.geometry.attributes.position as THREE.BufferAttribute).count;
      p.geometry.setDrawRange(0, Math.round(n * share * rate));
    }
    // Fireflies keep their number at any density, as the pixel spawner does.
    if (this.fireflies) this.fireflies.visible = this.wants.flies && !still;
    this.leaves.points.visible = this.wants.leaves && !still;
    if (this.leaves.points.visible) this.leaves.update(trees, groveHeight, dt, dens);

    if (this.rain?.visible) {
      const p = this.rain.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) - 0.35;
        if (y < 0) y += 14;
        p.setY(i, y);
      }
      p.needsUpdate = true;
      this.rain.position.set(camTarget.x, 0, camTarget.z - 6);
    }
    if (this.snow?.visible) {
      const p = this.snow.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        let y = p.getY(i) - 1.1 * dt;
        if (y < 0) y += 14;
        p.setY(i, y);
        p.setX(i, p.getX(i) + Math.sin(t * 0.9 + i) * 0.4 * dt);
      }
      p.needsUpdate = true;
      this.snow.position.set(camTarget.x, 0, camTarget.z - 6);
    }
    if (this.fireflies?.visible) {
      const p = this.fireflies.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        p.setY(i, p.getY(i) + Math.sin(t * 1.3 + i) * 0.004);
        p.setX(i, p.getX(i) + Math.cos(t * 0.7 + i * 0.3) * 0.004);
      }
      p.needsUpdate = true;
    }
  }
}
