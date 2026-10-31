import {
  Box3,
  Vector3,
  type BufferGeometry,
  type Light,
  type Material,
  type Mesh,
  type MeshPhysicalMaterial,
  type Object3D,
  type Texture,
} from 'three';
import { CHILD_HINT, GROVE3D } from '../config/tuning';
import { childLean, leanStep } from '../render/sprites/child-hint';
import { birthmarkKey, birthmarkOf } from '../render/birthmark';
import { GRANDCHILD3D } from '../config/tuning-fx3d';
import { buildSpecies, type Rigged } from '../samples/species';
import { TOON } from '../samples/creatures';
import { addOutlines } from './toon-outline';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import type { Keeper, Nubbin, World } from '../sim/types';
import { speciesArt } from '../render/sprites/species-art';
import { partsModBody } from '../samples/nubbin-critter-parts';
import { partSteps } from '../render/sprites/part-size';
import { specForKey, tintMods } from './looks';
import { SculptFarm } from './sculpt-farm';
import { qualityForRes } from './sculpt-res';
import { stubOnce } from './stubs';

/**
 * Rigged creatures for the 3D Grove, one build per species look and reused after
 * that. The slow half of a build, marching each surface, runs in the sculpt workers
 * (`SculptFarm`) and is cached by look key; the fast half (materials, eyes, fur shells,
 * the rig) runs here, at most one rig per frame. Until a look's surfaces are back,
 * `acquire` returns null and the caller shows a placeholder. A Nubbin that leaves hands
 * its rig back and the next one with the same look takes it; spares and surfaces past the
 * caps in `GROVE3D` are freed, least recently used first, so old looks do not pile up.
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
  // LOOK-36: each part carries its size step, and a Sun or Moon adult's parts lean to its body.
  const band = n.stage === 'adult' && !n.eternal ? n.form?.band : undefined;
  const parts = partsModBody(n.parts, partSteps(n), band === 'sun' || band === 'moon');
  // LOOK-53: the birthmark from the seed, painted on the sculpt.
  const mark = birthmarkKey(birthmarkOf(n));
  const tints =
    tintMods(look ? { ...n, eggColor: 'plain', tone: null } : n) +
    (parts ? `~parts:${parts}` : '') +
    (mark ? `~mark:${mark}` : '');
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
  // LOOK-49: the lean fades in with |alignment| (`childLean`); short of full it is a blend step.
  const lean = childLean(n.alignment);
  const id = lean.band === 'neutral' ? 'child' : `child-${lean.band}`;
  const step = leanStep(lean, CHILD_HINT.steps3d);
  const hint = step > 0 && step < CHILD_HINT.steps3d ? `~hint:${step}` : '';
  return variantById(id)
    ? { key: `variant:${id}${hint}${tints}`, height }
    : { key: `nubbin${tints}`, height };
}

/**
 * The player's look: Hazel's grandchild (never the trainer NPC of the same name, who stands
 * in the Grove too), in the chosen trainer's outfit tinted by Sun or Moon (`keeperOutfit`).
 */
export function keeperLook(k: Keeper, trainerId: string): Look {
  return {
    key: grandchildLookKey(trainerId, k.alignment),
    height: GROVE3D.keeperHeight * GRANDCHILD3D.heightShare,
  };
}

/** The grandchild's look key (see `looks.ts`); the trainers' own stay `keeper-<side>~npc:`. */
export function grandchildLookKey(trainerId: string, side: Keeper['alignment']): string {
  return `grandchild-${side}~outfit:${trainerId}`;
}

/** Triangles in a mesh's geometry. */
function triangles(m: Mesh): number {
  const g = m.geometry;
  return Math.floor((g.index ? g.index.count : (g.attributes.position?.count ?? 0)) / 3);
}

export class CreaturePool {
  private readonly free = new Map<string, Rigged[]>();
  private readonly farm = new SculptFarm();
  /** Marched surfaces by look key, once the workers have them. */
  private readonly ready = new Map<string, BufferGeometry[]>();
  private readonly asked = new Set<string>();
  /** R0079: coarse-grid surfaces by look key, for the stand-ins, and the looks asked for. */
  private readonly low = new Map<string, BufferGeometry[]>();
  private readonly lowAsked = new Set<string>();
  private lowQ = 1;
  /** Looks whose sculpt failed: how often, and not to ask again before `untilMs`. */
  private readonly failed = new Map<string, { n: number; untilMs: number }>();
  /** When each look key was last asked for or handed back, for eviction by recency. */
  private readonly used = new Map<string, number>();
  /** R0081: the rigs handed out and not yet back, so `trim` knows which looks are on screen. */
  private readonly lent = new Set<Rigged>();
  private tick = 0;
  /** Rigs built this frame; one per frame keeps a crowd of hatchlings from stalling. */
  private builtThisFrame = 0;
  /** Rigs whose shaders are compiling; they join the spares when done. */
  private compiling = 0;
  /**
   * R0456 (lane D r10): rigs compiling per look, and how many creatures asked for each look
   * this frame. While the loading veil is up a look whose rig was still compiling was built
   * again every frame: the Keeper's look came out with ten spare rigs (about 1 MB of CPU
   * geometry each, plus GPU buffers and materials). Now a look builds only while its rigs in
   * flight are fewer than the creatures waiting for it.
   */
  private readonly compilingKey = new Map<string, number>();
  private readonly demand = new Map<string, number>();
  /** R0456: looks whose surfaces stay cached at most (the scene sets it by device tier). */
  lookCap: number = GROVE3D.poolLooks;
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
  /** R0081: spare rigs kept at most (the scene sets it by device tier, `WORLD_MEM.poolSpares`). */
  spareCap: number = GROVE3D.poolSpares;
  /** Surfaces the warm looks need, and how many have landed: the loading bar. */
  private warmSurfaces = 0;
  private landed = 0;

  constructor() {
    this.farm.onSurface = () => this.landed++;
  }

  /** Call once a frame, before any `acquire`. */
  frame(): void {
    this.builtThisFrame = 0;
    this.demand.clear();
  }

  /**
   * A rig for the look: a spare if there is one, else a fresh build once the look's
   * surfaces are back from the workers. Null means not yet; ask again next frame.
   */
  acquire(look: Look): Rigged | null {
    this.used.set(look.key, ++this.tick);
    const spare = this.free.get(look.key)?.pop();
    if (spare) {
      this.lent.add(spare);
      return spare;
    }
    const geos = this.ready.get(look.key);
    if (!geos) {
      this.request(look.key);
      return null;
    }
    if (!this.burst && (this.builtThisFrame > 0 || this.compiling > 0)) return null;
    // R0456: enough rigs of this look are already compiling for the creatures asking.
    const asking = (this.demand.get(look.key) ?? 0) + 1;
    this.demand.set(look.key, asking);
    if ((this.compilingKey.get(look.key) ?? 0) >= asking) return null;
    this.builtThisFrame++;
    const t0 = performance.now();
    // The Grove's creatures wear the toon look (`GROVE3D.toon`); the flag is read while the
    // materials are made, so it is set around the build and put back for the stage samples.
    const was = { on: TOON.on, rim: TOON.rim, sky: TOON.sky };
    if (GROVE3D.toon.on)
      Object.assign(TOON, { on: true, rim: GROVE3D.toon.rim, sky: GROVE3D.toon.sky });
    let rig: Rigged;
    try {
      rig = buildSpecies(
        specForKey(look.key),
        // Each part's surface index, so its stand-in can take the coarse grid (`lowSurface`).
        geos.map((g, i) => {
          const c = g.clone();
          c.userData.surf = i;
          return c;
        }),
      );
    } finally {
      Object.assign(TOON, was);
    }
    // The Dresser reads the spec back from the key to find the head's dome and the eyes.
    rig.group.userData.lookKey = look.key;
    rig.group.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(rig.group);
    const built = Math.max(0.1, box.max.y - box.min.y);
    rig.group.scale.setScalar(look.height / built);
    // The sculpt casts a shadow; the face parts, shells, cards and the blob under the feet do
    // not.
    // The emote ball's lamp goes: a light per Nubbin would change the scene's light count
    // at every hatch and recompile every material in the Grove (a half-second stall).
    // Wing films and dew drops lose their transmission here too: one transmissive mesh on
    // screen makes the renderer draw the whole scene a second time (review C, item 6). The
    // stage samples keep theirs.
    const lamps: Object3D[] = [];
    rig.group.traverse((o) => {
      const m = o as Mesh;
      if (
        m.isMesh &&
        !(m.material as Material).transparent &&
        triangles(m) >= GROVE3D.casterMinTris
      )
        m.castShadow = true;
      if ((o as Light).isLight) lamps.push(o);
      if (m.isMesh) {
        for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
          const phys = mat as MeshPhysicalMaterial;
          if (phys.isMeshPhysicalMaterial && phys.transmission > 0) phys.transmission = 0;
          // Wing films and their veins are drawn solid: half-clear, a wing laid over the
          // body showed the sky through the Nubbin from the side, as in the Expedition's
          // jumps (review 2026-10-21, bug 17).
          if (phys.isMeshPhysicalMaterial && phys.transparent && phys.opacity < 1) {
            phys.transparent = false;
            phys.opacity = 1;
          }
        }
      }
    });
    for (const l of lamps) l.removeFromParent();
    if (GROVE3D.toon.on) {
      // A toon creature takes no sun shadow on itself: with no sky light under the bands,
      // the shadow map's speckle on a body this small turned whole creatures black. They
      // still cast one, and the soft blob under the feet grounds them.
      rig.group.traverse((o) => {
        if ((o as Mesh).isMesh) o.receiveShadow = false;
      });
      // After the shadow pass above, so the hulls (which share the parts' geometry) cast none.
      addOutlines(rig.group);
    }
    const took = performance.now() - t0;
    const ms = this.buildMs.get(look.key);
    if (ms) ms.rig += took;
    if (import.meta.env.DEV) console.info(`[3d] rigged ${look.key} in ${took.toFixed(0)} ms`);
    if (!this.compile) {
      this.lent.add(rig);
      return rig;
    }
    // Park the rig until its programs are linked; the next acquire takes it as a spare.
    this.compiling++;
    this.compilingKey.set(look.key, (this.compilingKey.get(look.key) ?? 0) + 1);
    const settle = () => {
      this.compiling--;
      const n = (this.compilingKey.get(look.key) ?? 1) - 1;
      if (n > 0) this.compilingKey.set(look.key, n);
      else this.compilingKey.delete(look.key);
      this.release(look.key, rig);
    };
    this.compile(rig.group).then(settle, settle);
    return null;
  }

  /** Hand a rig back for the next creature with the same look. */
  release(key: string, rig: Rigged): void {
    this.lent.delete(rig);
    rig.group.removeFromParent();
    const list = this.free.get(key) ?? [];
    list.push(rig);
    this.free.set(key, list);
    this.used.set(key, ++this.tick);
    this.evict();
  }

  /** Free the least recently used spares and surfaces past the caps. */
  private evict(): void {
    // Never while the loading veil is up: every warm look is about to be needed.
    if (this.burst) return;
    const spares = [...this.free.entries()].map(([k, l]) => [k, l.length] as const);
    for (const key of evictionOrder(spares, this.used, this.spareCap)) this.discard(key);
    const looks = [...this.ready.keys()]
      .filter((k) => !this.free.has(k))
      .map((k) => [k, 1] as const);
    const over = this.ready.size - this.lookCap;
    if (over <= 0) return;
    for (const key of evictionOrder(looks, this.used, looks.length - over)) {
      for (const g of this.ready.get(key) ?? []) g.dispose();
      this.farm.forget(key, this.quality);
      this.ready.delete(key);
      this.dropLow(key);
      this.asked.delete(key);
      this.used.delete(key);
    }
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
    // R0456: the spares and looks the veil let pile up go down to the caps now, not at the
    // next release.
    this.evict();
  }

  /**
   * R0079: whether a look's coarse-grid surfaces (sculpt grid `res`) are back for its
   * stand-in: `none` when the rig's own grid is that coarse already. The first ask starts
   * the march in the workers.
   */
  lowState(key: string, res: number): 'ready' | 'pending' | 'none' {
    const q = qualityForRes(res);
    if (q >= this.quality) return 'none';
    if (this.low.has(key)) return 'ready';
    if (!this.lowAsked.has(key)) {
      this.lowAsked.add(key);
      this.lowQ = q;
      this.farm.surfaces(key, q).then(
        (geos) => {
          if (this.lowAsked.has(key)) this.low.set(key, geos);
        },
        () => this.lowAsked.delete(key),
      );
    }
    return 'pending';
  }

  /**
   * The coarse-grid version of a rig part's surface (see `lowState`), placed as the part's
   * own geometry is. Null when the part is not a plain moved copy of its surface.
   */
  lowSurface(key: string, part: BufferGeometry): BufferGeometry | null {
    const i = part.userData.surf as number | undefined;
    const low = this.low.get(key);
    if (i === undefined || !low) return null;
    const full = this.ready.get(key)?.[i];
    const src = low[i];
    if (!full || !src) return null;
    // The part is its surface moved to the pivot (`buildSpecies`): find the move from the first
    // vertex and check it against the bounds, so a part built any other way keeps its own.
    const a = part.attributes.position!;
    const b = full.attributes.position!;
    if (a.count !== b.count) return null;
    const dx = a.getX(0) - b.getX(0);
    const dy = a.getY(0) - b.getY(0);
    const dz = a.getZ(0) - b.getZ(0);
    part.computeBoundingBox();
    full.computeBoundingBox();
    const moved = full.boundingBox!.clone().translate(new Vector3(dx, dy, dz));
    const off =
      moved.min.distanceTo(part.boundingBox!.min) + moved.max.distanceTo(part.boundingBox!.max);
    if (off > 1e-3) return null;
    return src.clone().translate(dx, dy, dz);
  }

  /**
   * R0081: let go of what can be rebuilt (the page is hidden, and a phone may kill a hidden tab
   * that holds on to memory): every spare rig and every coarse-grid surface. The surfaces
   * the rigs in the scene were built from stay, so nothing on screen needs a march to come back.
   * Round 9: so do the surfaces of looks no rig is using (warmed or left behind; CPU-side only,
   * never drawn). A later rig of such a look reads them back from the sculpt cache.
   */
  trim(): void {
    for (const key of [...this.free.keys()]) this.discard(key);
    for (const key of [...this.low.keys()]) this.dropLow(key);
    const inUse = new Set<string>();
    for (const rig of this.lent) inUse.add(rig.group.userData.lookKey as string);
    for (const key of [...this.ready.keys()]) {
      if (inUse.has(key)) continue;
      for (const g of this.ready.get(key) ?? []) g.dispose();
      this.farm.forget(key, this.quality);
      this.ready.delete(key);
      this.asked.delete(key);
    }
  }

  /** R0456 (lane D r10): sizes for the debug panel's memory line. */
  get counts(): { looks: number; low: number; spares: number; lent: number } {
    let spares = 0;
    for (const l of this.free.values()) spares += l.length;
    return { looks: this.ready.size, low: this.low.size, spares, lent: this.lent.size };
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
    this.lent.clear();
    freeRigs([...this.free.values()].flat(), true);
    this.free.clear();
    for (const geos of this.ready.values()) for (const g of geos) g.dispose();
    this.ready.clear();
    this.asked.clear();
    for (const key of [...this.low.keys()]) this.dropLow(key);
  }

  private dropLow(key: string): void {
    for (const g of this.low.get(key) ?? []) g.dispose();
    if (this.low.delete(key)) this.farm.forget(key, this.lowQ);
    this.lowAsked.delete(key);
  }

  private request(key: string): void {
    if (this.asked.has(key)) return;
    // A look that failed waits out its backoff (`acquire` asks every frame).
    const fail = this.failed.get(key);
    if (fail && performance.now() < fail.untilMs) return;
    this.asked.add(key);
    const t0 = performance.now();
    this.farm.surfaces(key, this.quality).then(
      (geos) => {
        this.failed.delete(key);
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
        const n = (this.failed.get(key)?.n ?? 0) + 1;
        this.failed.set(key, { n, untilMs: performance.now() + sculptRetryMs(n) });
        // One warning per look; the retries back off quietly (the stand-in stays meanwhile).
        if (n === 1) console.warn(`[3d] could not sculpt ${key}; retrying with backoff`, e);
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

/** How long to wait before sculpting a look again after its `n`th failure: 1 s doubling to 60 s. */
export function sculptRetryMs(n: number): number {
  return Math.min(60_000, 1000 * 2 ** Math.max(0, n - 1));
}

/**
 * Which keys to free so that at most `cap` items stay: the least recently used first,
 * a key's items going together. `items` pairs each key with how many items it holds.
 */
export function evictionOrder(
  items: ReadonlyArray<readonly [string, number]>,
  used: ReadonlyMap<string, number>,
  cap: number,
): string[] {
  let total = items.reduce((n, [, c]) => n + c, 0);
  const out: string[] = [];
  const oldest = [...items].sort((a, b) => (used.get(a[0]) ?? 0) - (used.get(b[0]) ?? 0));
  for (const [key, count] of oldest) {
    if (total <= cap) break;
    out.push(key);
    total -= count;
  }
  return out;
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
