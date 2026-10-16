import {
  Box3,
  type BufferGeometry,
  type Light,
  type Material,
  type Mesh,
  type Object3D,
} from 'three';
import { GROVE3D } from '../config/tuning';
import { buildSpecies, type Rigged } from '../samples/species';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import type { Keeper, Nubbin } from '../sim/types';
import { specForKey } from './looks';
import { SculptFarm } from './sculpt-farm';
import { stubOnce } from './stubs';

/**
 * Rigged creatures for the 3D Grove, one build per species look and reused after
 * that. The slow half of a build, marching each surface, runs in the sculpt workers
 * (`SculptFarm`) and is cached by look key; the fast half (materials, eyes, fur shells,
 * the rig) runs here, at most one rig per frame. Until a look's surfaces are back,
 * `acquire` returns null and the caller shows a placeholder. A rig is never thrown away:
 * a Nubbin that leaves hands it back, and the next one with the same look takes it.
 */
/** A look: which spec to build, under what pool key, and how tall it stands in the Grove. */
export interface Look {
  /** The look key (see `looks.ts`); the spec is `specForKey(key)`. */
  key: string;
  /** Height in world units; the sculpt is scaled to it (the format works at 3 to 4 units). */
  height: number;
}

/** Which look a Nubbin wears: the child, a first evolution, or another line's species. */
export function nubbinLook(n: Nubbin): Look {
  const height = n.stage === 'adult' ? GROVE3D.adultHeight : GROVE3D.nubbinHeight;
  if (n.species !== 'chao') {
    const roster = ROSTER.find((s) => s.name.toLowerCase() === n.species.toLowerCase());
    if (roster) return { key: `roster:${roster.name}`, height };
    stubOnce(`species:${n.species}`, 'drawn as the base Nubbin');
    return { key: 'nubbin', height };
  }
  if (n.stage === 'adult' && n.form) {
    const ids = [
      n.form.second ? `second-${n.form.band}-${n.form.type}-${n.form.second}` : null,
      `first-${n.form.band}-${n.form.type}`,
    ];
    for (const id of ids) {
      if (!id) continue;
      const v = variantById(id);
      if (v) return { key: `variant:${id}`, height };
    }
    stubOnce(`form:${n.form.band}-${n.form.type}`, 'no variant found; base Nubbin');
    return { key: 'nubbin', height };
  }
  const id = n.alignment > 0.25 ? 'child-sun' : n.alignment < -0.25 ? 'child-moon' : 'child';
  const v = variantById(id);
  return v ? { key: `variant:${id}`, height } : { key: 'nubbin', height };
}

export function keeperLook(k: Keeper): Look {
  const height = GROVE3D.keeperHeight;
  return k.alignment === 'moon' ? { key: 'keeper-moon', height } : { key: 'keeper-sun', height };
}

export class CreaturePool {
  private readonly free = new Map<string, Rigged[]>();
  private readonly farm = new SculptFarm();
  /** Marched surfaces by look key, once the workers have them. */
  private readonly ready = new Map<string, BufferGeometry[]>();
  private readonly asked = new Set<string>();
  /** Rigs built this frame; one per frame keeps a crowd of hatchlings from stalling. */
  private builtThisFrame = 0;
  /** Rigs whose shaders are compiling; they join the spares when done. */
  private compiling = 0;
  /**
   * Compiles a fresh rig's shaders before it is first drawn (the scene sets this to the
   * renderer's `compileAsync`). Without it, the first frame that shows a new look stalls
   * for half a second or more while the GPU driver links its programs.
   */
  compile: ((o: Object3D) => Promise<unknown>) | null = null;
  /** Build times by key, in ms, for the debug readout: marching (worker) and rigging. */
  readonly buildMs = new Map<string, { march: number; rig: number }>();

  /** Call once a frame, before any `acquire`. */
  frame(): void {
    this.builtThisFrame = 0;
  }

  /**
   * A rig for the look: a spare if there is one, else a fresh build once the look's
   * surfaces are back from the workers. Null means not yet; ask again next frame.
   */
  acquire(look: Look): Rigged | null {
    const spare = this.free.get(look.key)?.pop();
    if (spare) return spare;
    const geos = this.ready.get(look.key);
    if (!geos) {
      this.request(look.key);
      return null;
    }
    if (this.builtThisFrame > 0 || this.compiling > 0) return null;
    this.builtThisFrame++;
    const t0 = performance.now();
    const rig = buildSpecies(
      specForKey(look.key),
      geos.map((g) => g.clone()),
    );
    rig.group.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(rig.group);
    const built = Math.max(0.1, box.max.y - box.min.y);
    rig.group.scale.setScalar(look.height / built);
    // The sculpt casts a shadow; the shells, cards and the blob under the feet do not.
    // The emote ball's lamp goes: a light per Nubbin would change the scene's light count
    // at every hatch and recompile every material in the Grove (a half-second stall).
    const lamps: Object3D[] = [];
    rig.group.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh && !(m.material as Material).transparent) m.castShadow = true;
      if ((o as Light).isLight) lamps.push(o);
    });
    for (const l of lamps) l.removeFromParent();
    const took = performance.now() - t0;
    const ms = this.buildMs.get(look.key);
    if (ms) ms.rig += took;
    if (import.meta.env.DEV) console.info(`[3d] rigged ${look.key} in ${took.toFixed(0)} ms`);
    if (!this.compile) return rig;
    // Park the rig until its programs are linked; the next acquire takes it as a spare.
    this.compiling++;
    const settle = () => {
      this.compiling--;
      this.release(look.key, rig);
    };
    this.compile(rig.group).then(settle, settle);
    return null;
  }

  /** Hand a rig back for the next creature with the same look. */
  release(key: string, rig: Rigged): void {
    rig.group.removeFromParent();
    const list = this.free.get(key) ?? [];
    list.push(rig);
    this.free.set(key, list);
  }

  /** Start marching the looks a Grove needs first, in order (the Keeper leads). */
  warm(looks: Look[]): void {
    for (const look of looks) this.request(look.key);
  }

  /** Whether a look's surfaces are back, so `acquire` can build it. */
  isReady(key: string): boolean {
    return this.ready.has(key) || (this.free.get(key)?.length ?? 0) > 0;
  }

  get threaded(): boolean {
    return this.farm.threaded;
  }

  dispose(): void {
    this.farm.dispose();
  }

  private request(key: string): void {
    if (this.asked.has(key)) return;
    this.asked.add(key);
    const t0 = performance.now();
    this.farm.surfaces(key).then(
      (geos) => {
        this.ready.set(key, geos);
        const march = performance.now() - t0;
        this.buildMs.set(key, { march, rig: 0 });
        if (import.meta.env.DEV)
          console.info(
            `[3d] sculpted ${key} in ${march.toFixed(0)} ms (${this.farm.threaded ? 'workers' : 'page'})`,
          );
      },
      (e: unknown) => {
        this.asked.delete(key);
        console.warn(`[3d] could not sculpt ${key}`, e);
      },
    );
  }
}
