import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';

/**
 * Fruit-tree crowns that step aside for the camera. At the close zoom the Lakitu camera
 * can sit inside a crown, or a crown can stand between it and the Keeper; then that
 * crown dithers out (a screen-door discard on its leaf cards) and its branches and fruit
 * hide, and it fills back in once the view is clear. The dither is a uniform on each
 * crown's own material, so fading never recompiles a program, and the leaves' shadow
 * (a separate depth material) stays on the ground.
 */
export interface GroveTree {
  /** The leaf cards. */
  crown: THREE.Mesh;
  /** Branches and fruit inside the crown, hidden while it is mostly gone. */
  inner: THREE.Object3D[];
  /** The crown's centre and its half-extents (cards included). */
  centre: THREE.Vector3;
  rx: number;
  ry: number;
}

interface Faded extends GroveTree {
  fade: { value: number };
}

/**
 * Hook the dither into a crown's leaf material. The shader text is the same for every
 * crown, so they all share one program; each keeps its own `uCrownFade`.
 */
function ditherable(mat: THREE.Material): { value: number } {
  const fade = { value: 1 };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uCrownFade = fade;
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uCrownFade;')
      .replace(
        '#include <alphatest_fragment>',
        `#include <alphatest_fragment>
        if (uCrownFade < 0.999) {
          float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
          if (n >= uCrownFade) discard;
        }`,
      );
    mat.userData.shader = shader;
  };
  return fade;
}

export class CrownFade {
  private readonly trees: Faded[] = [];
  private readonly a = new THREE.Vector3();
  private readonly b = new THREE.Vector3();

  add(tree: GroveTree): void {
    const mat = tree.crown.material as THREE.Material;
    this.trees.push({ ...tree, fade: ditherable(mat) });
  }

  /** Is the point inside the crown's ellipsoid? */
  private inside(t: Faded, p: THREE.Vector3): boolean {
    const x = (p.x - t.centre.x) / t.rx;
    const y = (p.y - t.centre.y) / t.ry;
    const z = (p.z - t.centre.z) / t.rx;
    return x * x + y * y + z * z < 1;
  }

  /** Does the segment from `from` to `to` pass through the crown's ellipsoid? */
  private crosses(t: Faded, from: THREE.Vector3, to: THREE.Vector3): boolean {
    // Scale space so the ellipsoid is the unit sphere, then a segment-sphere test.
    const s = this.a.set(
      (from.x - t.centre.x) / t.rx,
      (from.y - t.centre.y) / t.ry,
      (from.z - t.centre.z) / t.rx,
    );
    const d = this.b.set(
      (to.x - t.centre.x) / t.rx - s.x,
      (to.y - t.centre.y) / t.ry - s.y,
      (to.z - t.centre.z) / t.rx - s.z,
    );
    const dd = d.lengthSq();
    if (dd < 1e-9) return s.lengthSq() < 1;
    const k = THREE.MathUtils.clamp(-s.dot(d) / dd, 0, 1);
    return s.addScaledVector(d, k).lengthSq() < 1;
  }

  /**
   * Ease each crown toward its goal: gone when the camera is inside it, thin when it
   * stands between the camera and any of the targets (the Keeper's middle and head).
   */
  update(camera: THREE.Vector3, targets: THREE.Vector3[], dt: number): void {
    const f = GROVE3D.crownFade;
    const k = dt === 0 ? 1 : 1 - Math.exp(-f.rate * dt);
    for (const t of this.trees) {
      let goal = 1;
      if (this.inside(t, camera)) goal = f.inside;
      else if (targets.some((p) => this.crosses(t, camera, p))) goal = f.blocked;
      const v = t.fade.value + (goal - t.fade.value) * k;
      t.fade.value = Math.abs(v - goal) < 0.01 ? goal : v;
      const show = t.fade.value > f.innerBelow;
      for (const o of t.inner) o.visible = show;
    }
  }
}
