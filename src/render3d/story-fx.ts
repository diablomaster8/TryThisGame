import * as THREE from 'three';
import { CG_C } from '../config/tuning-c';
import type { StoryFx } from '../render/story-fx-state';
import { QuadCloud } from './quad-particles';

/**
 * The Long Night's held effects in 3D (campaign graphics H6): `fallsStill` freezes the
 * waterfall's scroll and tints it frosted, `stoneGlow` lights the flat stone blue under
 * bloom, `goldWater` warms the pond and stream to gold. Each is a state the scene holds, never
 * a pulse; it settles over a second or so and snaps under reduced motion. All of it is
 * uniforms and one emissive, so it costs nothing on a phone. The water's colours live in
 * uniforms the three waters share; this takes its own copies of them (the materials keep
 * their own dictionaries) so the rest of the scene is untouched.
 */
type Cols = {
  shallow: THREE.IUniform<THREE.Color>;
  deep: THREE.IUniform<THREE.Color>;
  foam: THREE.IUniform<THREE.Color>;
};

const col = (u: THREE.IUniform | undefined, fallback: string): THREE.Color =>
  u?.value instanceof THREE.Color ? u.value.clone() : new THREE.Color(fallback);

function own(m: THREE.ShaderMaterial): { cols: Cols; base: THREE.Color[] } {
  const base = [
    col(m.uniforms.uShallow, '#8fd6f0'),
    col(m.uniforms.uDeep, '#2e5ca8'),
    col(m.uniforms.uFoam, '#ffffff'),
  ];
  const cols: Cols = {
    shallow: { value: base[0]!.clone() },
    deep: { value: base[1]!.clone() },
    foam: { value: base[2]!.clone() },
  };
  m.uniforms.uShallow = cols.shallow;
  m.uniforms.uDeep = cols.deep;
  m.uniforms.uFoam = cols.foam;
  return { cols, base };
}

function approach(v: number, target: number, step: number): number {
  return v < target ? Math.min(target, v + step) : Math.max(target, v - step);
}

const GOLD = Object.values(CG_C.fx.gold).map((c) => new THREE.Color(c));
const FROST = Object.values(CG_C.fx.frostFall).map((c) => new THREE.Color(c));
const STONE = new THREE.Color(CG_C.fx.stone);
const KEYS = ['shallow', 'deep', 'foam'] as const;

export interface StoneSpot {
  /** Where the glow card hangs, and whether the stone is in the place on screen. */
  at: THREE.Vector3;
  inlay: THREE.MeshStandardMaterial;
  place: 'grove' | 'hollow';
}

export class StoryFx3d {
  private fall: THREE.ShaderMaterial | null = null;
  private fallOwn: ReturnType<typeof own> | null = null;
  private fallTime: THREE.IUniform | null = null;
  private readonly frozen = { value: 0 };
  private surfaces: Array<ReturnType<typeof own>> = [];
  private still = 0;
  private glow = 0;
  private gold = 0;
  private readonly glows: QuadCloud;

  constructor(
    scene: THREE.Scene,
    private readonly stones: readonly StoneSpot[],
    roots: readonly THREE.Object3D[] = [],
  ) {
    this.glows = new QuadCloud(scene, 4, 'cpu');
    const seen = new Set<THREE.Material>();
    const visit = (o: THREE.Object3D): void => {
      const m = (o as THREE.Mesh).material;
      if (!(m instanceof THREE.ShaderMaterial) || !m.uniforms.uShallow || seen.has(m)) return;
      seen.add(m);
      if (m.uniforms.uFlow) this.surfaces.push(own(m));
      else if (!this.fall) {
        this.fall = m;
        this.fallTime = m.uniforms.uTime ?? null;
        this.fallOwn = own(m);
      }
    };
    scene.traverse(visit);
    for (const r of roots) r.traverse(visit);
  }

  update(on: ReadonlySet<StoryFx>, place: string, dt: number, still: boolean, now: number): void {
    const step = still ? 1 : dt / CG_C.fx.settle;
    const tStill = on.has('fallsStill') ? 1 : 0;
    this.still = approach(this.still, tStill, step);
    this.glow = approach(this.glow, on.has('stoneGlow') ? 1 : 0, step);
    this.gold = approach(this.gold, on.has('goldWater') ? 1 : 0, step);

    // The fall: the scroll holds the moment the effect starts, and resumes once it has thawed.
    if (this.fall && this.fallOwn && this.fallTime) {
      if (tStill && this.fall.uniforms.uTime !== this.frozen) {
        this.frozen.value = now;
        this.fall.uniforms.uTime = this.frozen;
      } else if (!tStill && this.still === 0 && this.fall.uniforms.uTime !== this.fallTime) {
        this.fall.uniforms.uTime = this.fallTime;
      }
      KEYS.forEach((k, i) => {
        const c = this.fallOwn!.cols[k].value;
        c.copy(this.fallOwn!.base[i]!)
          .lerp(FROST[i]!, this.still)
          .lerp(GOLD[i]!, this.gold * (1 - this.still));
      });
    }
    for (const s of this.surfaces)
      KEYS.forEach((k, i) => s.cols[k].value.copy(s.base[i]!).lerp(GOLD[i]!, this.gold));

    for (const s of this.stones) {
      const here = s.place === place && this.glow > 0.001;
      s.inlay.emissiveIntensity = s.place === place || this.glow === 0 ? 2.6 * this.glow : 0;
      if (here)
        this.glows.set(s.at.x, s.at.y, s.at.z, STONE, 0.55 * this.glow, 2.4 * this.glow, 'glow', {
          additive: true,
        });
    }
    this.glows.flush();
  }

  dispose(): void {
    this.glows.dispose();
  }
}
