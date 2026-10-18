import {
  Box3,
  type BufferGeometry,
  type Light,
  type Material,
  type Mesh,
  type Object3D,
  type Texture,
} from 'three';
import { keeperLookKey } from '../render/keeper-look';
import { GROVE3D } from '../config/tuning';
import { buildSpecies, type Rigged } from '../samples/species';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import type { Keeper, Nubbin, World } from '../sim/types';
import { speciesArt } from '../render/sprites/species-art';
import { partsModBody } from '../samples/nubbin-critter-parts';
import { specForKey, tintMods } from './looks';
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

/** The character look a Nubbin wears as its hat (`look-fox`...), when the catalogue has it. */
export function characterLook(n: Pick<Nubbin, 'hat'>): string | null {
  return n.hat?.startsWith('look-') && variantById(n.hat) ? n.hat : null;
}

/**
 * Which look a Nubbin wears: the child, an evolution, an Eternal (the three Chaos forms), or
 * another line's species. A Chao-line Nubbin's key also carries its critter parts
 * (`~parts:`) and, with a character look on, the look: a child takes the look's whole figure
 * (`variant:look-fox`), an adult or Eternal keeps its form and takes the look's palette
 * (`~look:look-fox`). A look's palette replaces the egg colour and two-tone, as in the pixel
 * view; shiny and the Shadow's grey still apply.
 */
export function nubbinLook(n: Nubbin): Look {
  const height = n.stage === 'adult' ? GROVE3D.adultHeight : GROVE3D.nubbinHeight;
  const look = characterLook(n);
  const parts = partsModBody(n.parts);
  const tints =
    tintMods(look ? { ...n, eggColor: 'plain', tone: null } : n) + (parts ? `~parts:${parts}` : '');
  const over = look ? `~look:${look}` : '';
  if (n.species !== 'chao') {
    // Other lines keep their own colours; only the Shadow's grey reaches them.
    const shade = n.shadow ? '~shadow' : '';
    const roster = ROSTER.find((s) => s.name.toLowerCase() === n.species.toLowerCase());
    if (roster) return { key: `roster:${roster.name}${shade}`, height };
    const art = speciesArt(n.species);
    if (art) return { key: `art:${n.species}${shade}`, height: GROVE3D.nubbinHeight * art.size };
    stubOnce(`species:${n.species}`, 'no recipe; drawn as the base Nubbin');
    return { key: `nubbin${shade}`, height };
  }
  if (n.stage === 'adult' && n.eternal) {
    const id = `eternal-${n.eternal}`;
    if (variantById(id)) return { key: `variant:${id}${over}${tints}`, height };
  }
  if (n.stage === 'adult' && n.form) {
    const ids = [
      n.form.second ? `second-${n.form.band}-${n.form.type}-${n.form.second}` : null,
      `first-${n.form.band}-${n.form.type}`,
    ];
    for (const id of ids) {
      if (!id) continue;
      if (variantById(id)) return { key: `variant:${id}${over}${tints}`, height };
    }
    stubOnce(`form:${n.form.band}-${n.form.type}`, 'no variant found; base Nubbin');
    return { key: `nubbin${over}${tints}`, height };
  }
  if (look) return { key: `variant:${look}${tints}`, height };
  const id = n.alignment > 0.25 ? 'child-sun' : n.alignment < -0.25 ? 'child-moon' : 'child';
  return variantById(id)
    ? { key: `variant:${id}${tints}`, height }
    : { key: `nubbin${tints}`, height };
}

/** A Keeper's look: the chosen trainer's outfit tinted by Sun or Moon (`render/keeper-look.ts`). */
export function keeperLook(k: Keeper, trainerId: string): Look {
  return { key: keeperLookKey(trainerId, k.alignment), height: GROVE3D.keeperHeight };
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
  /**
   * Grid quality for every sculpt, 1 = the authored resolution. The scene sets it from
   * the save's `sculptRes` before the first `warm` (a phone marches at about 0.6).
   */
  quality = 1;
  /**
   * While the loading veil is up nobody sees a hitch, so every look whose surfaces are back
   * rigs at once and compiles in parallel; after it lifts, one rig a frame again.
   */
  burst = true;
  /** Surfaces the warm looks need, and how many have landed: the loading bar. */
  private warmSurfaces = 0;
  private landed = 0;

  constructor() {
    this.farm.onSurface = () => this.landed++;
  }

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
    if (!this.burst && (this.builtThisFrame > 0 || this.compiling > 0)) return null;
    this.builtThisFrame++;
    const t0 = performance.now();
    const rig = buildSpecies(
      specForKey(look.key),
      geos.map((g) => g.clone()),
    );
    // The Dresser reads the spec back from the key to find the head's dome and the eyes.
    rig.group.userData.lookKey = look.key;
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

  /**
   * Free every spare rig of a look (its GPU buffers and materials): the race rivals'
   * looks change with every seed and would pile up otherwise. The marched surfaces stay
   * cached, so the next rig of the look is a quick build.
   */
  discard(key: string): void {
    const spares = this.free.get(key) ?? [];
    this.free.delete(key);
    freeRigs(spares, false);
  }

  /** Start marching the looks a Grove needs first, in order (the Keeper leads). */
  warm(looks: Look[]): void {
    for (const look of looks) {
      if (this.asked.has(look.key)) continue;
      this.warmSurfaces += this.farm.surfaceCount(look.key);
      this.request(look.key);
    }
  }

  /** Share of the warm looks' surfaces back from the cache or the workers, 0..1. */
  get warmProgress(): number {
    return this.warmSurfaces ? Math.min(1, this.landed / this.warmSurfaces) : 0;
  }

  /** Surfaces read from the IndexedDB cache and surfaces marched since load. */
  get sculptStats(): { cached: number; marched: number } {
    return this.farm.stats;
  }

  /** The opening Grove is built: one rig a frame from now on, and the cache may be written. */
  loaded(): void {
    this.burst = false;
    this.farm.holdWrites = false;
    this.farm.saveSoon();
  }

  /** Whether a look's surfaces are back, so `acquire` can build it. */
  isReady(key: string): boolean {
    return this.ready.has(key) || (this.free.get(key)?.length ?? 0) > 0;
  }

  get threaded(): boolean {
    return this.farm.threaded;
  }

  /**
   * Free everything the pool holds: the spare rigs (their geometry, materials and textures,
   * each once) and the marched surfaces filed by look key. Each rig owns clones of the
   * marched surfaces, so the originals in `ready` are freed separately. Rigs still in a
   * scene are the caller's to release first.
   */
  dispose(): void {
    this.farm.dispose();
    freeRigs([...this.free.values()].flat(), true);
    this.free.clear();
    for (const geos of this.ready.values()) for (const g of geos) g.dispose();
    this.ready.clear();
    this.asked.clear();
  }

  private request(key: string): void {
    if (this.asked.has(key)) return;
    this.asked.add(key);
    const t0 = performance.now();
    this.farm.surfaces(key, this.quality).then(
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

/**
 * Dispose rigs' GPU resources, each geometry, material and texture once. The Dresser's
 * meshes (`userData.shared`) are skipped: their geometry and materials are shared and the
 * Dresser frees them. Textures are freed only on teardown (`textures`): the detail, iris and
 * glyph textures are module caches every rig shares, and three re-uploads them if a later
 * scene uses them again.
 */
function freeRigs(rigs: Rigged[], textures: boolean): void {
  const geos = new Set<BufferGeometry>();
  const mats = new Set<Material>();
  for (const rig of rigs)
    rig.group.traverse((o) => {
      const m = o as Mesh;
      if (m.userData.shared) return;
      if (m.geometry) geos.add(m.geometry);
      if (Array.isArray(m.material)) for (const x of m.material) mats.add(x);
      else if (m.material) mats.add(m.material);
    });
  const texs = new Set<Texture>();
  for (const mat of mats) {
    if (textures)
      for (const v of Object.values(mat) as unknown[])
        if ((v as Texture | null)?.isTexture) texs.add(v as Texture);
    mat.dispose();
  }
  for (const g of geos) g.dispose();
  for (const t of texs) t.dispose();
}

/** The looks a Grove opens with, the Keeper first, each once. */
export function openingLooks(world: Pick<World, 'keeper' | 'nubbins' | 'trainer'>): Look[] {
  const looks = [keeperLook(world.keeper, world.trainer), ...world.nubbins.map(nubbinLook)];
  const seen = new Set<string>();
  return looks.filter((l) => !seen.has(l.key) && !!seen.add(l.key));
}

let early: CreaturePool | null = null;

/**
 * The pool the scene will use, made before the scene so its workers can march while the
 * page builds everything else (see `prewarmCreatures`).
 */
export function earlyPool(): CreaturePool {
  return (early ??= new CreaturePool());
}

/** Hand the early pool to the scene, or a fresh one when nothing started early. */
export function takePool(): CreaturePool {
  const pool = earlyPool();
  early = null;
  return pool;
}
