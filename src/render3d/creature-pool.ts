import { Box3, type Material, type Mesh } from 'three';
import { GROVE3D } from '../config/tuning';
import { buildSpecies, type Rigged, type SpeciesSpec } from '../samples/species';
import { KEEPER_MOON_SPEC, KEEPER_SPEC } from '../samples/keeper-spec';
import { NUBBIN_SPEC } from '../samples/species-data';
import { ROSTER } from '../samples/species-roster';
import { variantById } from '../samples/nubbin-variant-catalogue';
import type { Keeper, Nubbin } from '../sim/types';
import { stubOnce } from './stubs';

/**
 * Rigged creatures for the 3D Grove, one build per species look and reused after
 * that. `buildSpecies` sculpts a figure in about a second on a PC, so a rig is never
 * thrown away: a Nubbin that leaves hands its rig back to the pool, and the next one
 * with the same look takes it. The Keeper and the child are built up front so the
 * first seconds of play do not stall.
 */
/** A look: which spec to build, under what pool key, and how tall it stands in the Grove. */
export interface Look {
  key: string;
  spec: SpeciesSpec;
  /** Height in world units; the sculpt is scaled to it (the format works at 3 to 4 units). */
  height: number;
}

/** Which look a Nubbin wears: the child, a first evolution, or another line's species. */
export function nubbinLook(n: Nubbin): Look {
  const height = n.stage === 'adult' ? GROVE3D.adultHeight : GROVE3D.nubbinHeight;
  if (n.species !== 'chao') {
    const roster = ROSTER.find((s) => s.name.toLowerCase() === n.species.toLowerCase());
    if (roster) return { key: `roster:${roster.name}`, spec: roster, height };
    stubOnce(`species:${n.species}`, 'drawn as the base Nubbin');
    return { key: 'nubbin', spec: NUBBIN_SPEC, height };
  }
  if (n.stage === 'adult' && n.form) {
    const ids = [
      n.form.second ? `second-${n.form.band}-${n.form.type}-${n.form.second}` : null,
      `first-${n.form.band}-${n.form.type}`,
    ];
    for (const id of ids) {
      if (!id) continue;
      const v = variantById(id);
      if (v) return { key: `variant:${id}`, spec: v.spec, height };
    }
    stubOnce(`form:${n.form.band}-${n.form.type}`, 'no variant found; base Nubbin');
    return { key: 'nubbin', spec: NUBBIN_SPEC, height };
  }
  const id = n.alignment > 0.25 ? 'child-sun' : n.alignment < -0.25 ? 'child-moon' : 'child';
  const v = variantById(id);
  return v
    ? { key: `variant:${id}`, spec: v.spec, height }
    : { key: 'nubbin', spec: NUBBIN_SPEC, height };
}

export function keeperLook(k: Keeper): Look {
  const height = GROVE3D.keeperHeight;
  return k.alignment === 'moon'
    ? { key: 'keeper-moon', spec: KEEPER_MOON_SPEC, height }
    : { key: 'keeper-sun', spec: KEEPER_SPEC, height };
}

export class CreaturePool {
  private readonly free = new Map<string, Rigged[]>();
  /** Build times by key, in ms, for the debug readout. */
  readonly buildMs = new Map<string, number>();

  /** Build a rig for the look (or take a spare), scaled to its height and ready to place. */
  acquire(look: Look): Rigged {
    const spare = this.free.get(look.key)?.pop();
    if (spare) return spare;
    const t0 = performance.now();
    const rig = buildSpecies(look.spec);
    rig.group.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(rig.group);
    const built = Math.max(0.1, box.max.y - box.min.y);
    rig.group.scale.setScalar(look.height / built);
    // The sculpt casts a shadow; the shells, cards and the blob under the feet do not.
    rig.group.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh && !(m.material as Material).transparent) m.castShadow = true;
    });
    const took = performance.now() - t0;
    this.buildMs.set(look.key, (this.buildMs.get(look.key) ?? 0) + took);
    if (import.meta.env.DEV) console.info(`[3d] built ${look.key} in ${took.toFixed(0)} ms`);
    return rig;
  }

  /** Hand a rig back for the next creature with the same look. */
  release(key: string, rig: Rigged): void {
    rig.group.removeFromParent();
    const list = this.free.get(key) ?? [];
    list.push(rig);
    this.free.set(key, list);
  }

  /** Build the looks a fresh Grove needs first, so hatching does not stall later. */
  warm(looks: Look[]): void {
    for (const look of looks) {
      if ((this.free.get(look.key)?.length ?? 0) > 0) continue;
      this.release(look.key, this.acquire(look));
    }
  }
}
