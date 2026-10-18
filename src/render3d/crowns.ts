import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';

/**
 * Fruit-tree crowns that step aside for the camera. At the close zoom the Lakitu camera
 * can sit inside a crown, or a crown can stand between it and the Keeper; then that
 * crown dithers out (a screen-door discard on its leaf cards) and its branches and fruit
 * hide, and it fills back in once the view is clear. A trunk standing between the camera
 * and the Keeper thins the same way. The dither is a uniform on each tree's own
 * materials, so fading never recompiles a program, and the shadows (a separate depth
 * material) stay on the ground.
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
  /** The trunk: its mesh, the foot of its axis, its height and its widest radius. */
  trunk?: { mesh: THREE.Mesh; foot: THREE.Vector3; height: number; r: number };
}

interface Faded extends GroveTree {
  fade: { value: number };
  /** 1 while the camera is inside the crown: then all of it fades, not only the hole. */
  whole: { value: number };
  trunkFade: { value: number } | null;
}

/**
 * Where the Keeper is on screen, in drawing-buffer pixels (x, y from the bottom left, and
 * the radius). A blocking crown or trunk thins only inside this circle, so at the far zoom
 * a row of trees is not ghosted whole into dots (review C, item 21). Shared by every tree.
 */
const HOLE = { value: new THREE.Vector3(0, 0, 0) };

/**
 * The fadeable parts of an `aaa-kit` `buildTree`: its first part is the trunk (a 3.2-unit
 * cylinder, 0.5 wide at the foot, at the scale given), the instanced part is the crown,
 * the rest are branches and fruit. Null if the parts have no crown.
 */
export function treeOf(parts: THREE.Object3D[], scale = 1.05): GroveTree | null {
  const trunk = parts[0] as THREE.Mesh | undefined;
  const crown = parts.find((p): p is THREE.InstancedMesh => p instanceof THREE.InstancedMesh);
  if (!crown) return null;
  crown.computeBoundingBox();
  const box = crown.boundingBox!;
  const size = box.getSize(new THREE.Vector3());
  const height = 3.2 * scale;
  return {
    crown,
    inner: parts.filter((p) => p !== trunk && p !== crown),
    centre: box.getCenter(new THREE.Vector3()),
    rx: Math.max(size.x, size.z) / 2,
    ry: size.y / 2,
    ...(trunk?.isMesh
      ? {
          trunk: {
            mesh: trunk,
            foot: trunk.position.clone().setY(trunk.position.y - height / 2),
            height,
            r: 0.5 * scale,
          },
        }
      : {}),
  };
}

/**
 * Hook the dither into a crown's leaf material. The shader text is the same for every
 * crown, so they all share one program; each keeps its own `uCrownFade`.
 */
function ditherable(
  mat: THREE.Material,
  whole: { value: number } = { value: 0 },
): { value: number } {
  const fade = { value: 1 };
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uCrownFade = fade;
    shader.uniforms.uCrownWhole = whole;
    shader.uniforms.uCrownHole = HOLE;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nuniform float uCrownFade;\nuniform float uCrownWhole;\nuniform vec3 uCrownHole;',
      )
      .replace(
        '#include <alphatest_fragment>',
        `#include <alphatest_fragment>
        if (uCrownFade < 0.999) {
          float d = distance(gl_FragCoord.xy, uCrownHole.xy);
          float hole = uCrownWhole > 0.5 ? 1.0 : 1.0 - smoothstep(uCrownHole.z * 0.6, uCrownHole.z, d);
          float keep = mix(1.0, uCrownFade, hole);
          float n = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
          if (n >= keep) discard;
        }`,
      );
    mat.userData.shader = shader;
  };
  return fade;
}

export class CrownFade {
  /** Place the see-through circle on the Keeper, in drawing-buffer pixels. */
  static setHole(x: number, y: number, radius: number): void {
    HOLE.value.set(x, y, radius);
  }

  private readonly trees: Faded[] = [];
  private readonly a = new THREE.Vector3();
  private readonly b = new THREE.Vector3();

  add(tree: GroveTree): void {
    const mat = tree.crown.material as THREE.Material;
    const trunk = tree.trunk ? ditherable(tree.trunk.mesh.material as THREE.Material) : null;
    const whole = { value: 0 };
    this.trees.push({ ...tree, fade: ditherable(mat, whole), whole, trunkFade: trunk });
  }

  /** Forget every tree (a visit garden is redressed for each neighbour). */
  clear(): void {
    this.trees.length = 0;
  }

  /**
   * Does the segment pass the trunk? Sampled along its length: a point at trunk height
   * within the trunk's radius (and a little more, for the Keeper's width) of its axis.
   */
  private hitsTrunk(t: Faded, from: THREE.Vector3, to: THREE.Vector3): boolean {
    const k = t.trunk;
    if (!k) return false;
    const steps = 16;
    for (let i = 1; i < steps; i++) {
      const p = this.a.lerpVectors(from, to, i / steps);
      if (p.y < k.foot.y || p.y > k.foot.y + k.height) continue;
      if (Math.hypot(p.x - k.foot.x, p.z - k.foot.z) < k.r + GROVE3D.crownFade.trunkMargin)
        return true;
    }
    return false;
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
      const inside = this.inside(t, camera);
      if (inside) goal = f.inside;
      else if (targets.some((p) => this.crosses(t, camera, p))) goal = f.blocked;
      if (inside) t.whole.value = 1;
      else if (t.fade.value > 0.999) t.whole.value = 0;
      const v = t.fade.value + (goal - t.fade.value) * k;
      t.fade.value = Math.abs(v - goal) < 0.01 ? goal : v;
      // Branches and fruit hide only when the whole crown is going, not for the hole.
      const show = t.whole.value < 0.5 || t.fade.value > f.innerBelow;
      for (const o of t.inner) o.visible = show;
      const tf = t.trunkFade;
      if (tf) {
        const want = targets.some((p) => this.hitsTrunk(t, camera, p)) ? f.blocked : 1;
        const w = tf.value + (want - tf.value) * k;
        tf.value = Math.abs(w - want) < 0.01 ? want : w;
      }
    }
  }
}
