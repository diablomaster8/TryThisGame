import * as THREE from 'three';

/**
 * The Grove's night lights in Full 3D: a fixed handful of point lights that go to the lit
 * lanterns and windows nearest the camera's focus. Every point light in the scene is a loop
 * in every lit fragment shader and a set of uniforms per draw, whether it shines or not, so
 * a light per lantern and per window cost every phone frame by day as well as by night
 * (review C, item 6). The pool is hidden while nothing is lit, which is a light set of its
 * own (see `LightSet` in grove-3d-scene.ts), so by day the shaders carry no point lights.
 */

/** A place a light may shine from, with how it shines. */
export interface LampSource {
  x: number;
  y: number;
  z: number;
  color: string;
  intensity: number;
  distance: number;
  decay: number;
}

export class LampPool {
  private readonly lights: THREE.PointLight[] = [];

  constructor(parent: THREE.Object3D, count: number) {
    for (let i = 0; i < count; i++) {
      const l = new THREE.PointLight('#ffb347', 0, 10, 1.4);
      l.visible = false;
      this.lights.push(l);
      parent.add(l);
    }
  }

  /** Whether the pool is drawn (some source is lit). */
  get on(): boolean {
    return this.lights[0]!.visible;
  }

  /** Run `fn` with the pool counted as on or off; for compiling the other light set. */
  withOn<T>(on: boolean, fn: () => T): T {
    const was = this.on;
    for (const l of this.lights) l.visible = on;
    try {
      return fn();
    } finally {
      for (const l of this.lights) l.visible = was;
    }
  }

  /** Give the lights to the sources nearest `focus`; the pool hides when there are none. */
  place(sources: readonly LampSource[], focus: THREE.Vector3): void {
    const on = sources.length > 0;
    const near = on
      ? [...sources]
          .sort(
            (a, b) =>
              (a.x - focus.x) ** 2 +
              (a.z - focus.z) ** 2 -
              (b.x - focus.x) ** 2 -
              (b.z - focus.z) ** 2,
          )
          .slice(0, this.lights.length)
      : [];
    this.lights.forEach((l, i) => {
      l.visible = on;
      const s = near[i];
      if (!s) {
        l.intensity = 0;
        return;
      }
      l.position.set(s.x, s.y, s.z);
      l.color.set(s.color);
      l.intensity = s.intensity;
      l.distance = s.distance;
      l.decay = s.decay;
    });
  }
}
