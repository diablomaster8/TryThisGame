import * as THREE from 'three';
import { BuildingRegistry } from '../render/stage-api';
import { CG_A } from '../config/tuning-a';
import { OCCLUDE } from './building-kit';

/**
 * The Full 3D Grove's buildings API (campaign graphics 2, wave 0). The stock houses are
 * merged into Grove-wide roof, timber and stone meshes, so a building is hidden or thinned
 * by its world box in the building shader (`OCCLUDE.hide*`, the same screen-door dither as
 * H9's occluder fade): every building-kit fragment inside the box drops or thins. The
 * placed garden buildings are their own models and simply hide. Render-only: the sim's
 * buildings still stand. A box only clips building-kit materials (walls, roofs, trim,
 * hulls, and the glass and lamp cards package a hooks), never terrain, trees or figures.
 */
export class StageBuildings3d extends BuildingRegistry {
  private readonly boxes = new Map<string, THREE.Box3>();
  private readonly gardenHidden = new Set<THREE.Object3D>();

  constructor(
    private readonly pickables: readonly THREE.Object3D[],
    private readonly garden: () => Array<{ object: THREE.Object3D; id: string }>,
  ) {
    super();
  }

  /** Find every `building` pickable's box (again when a scene begins: sets build late). */
  discover(): void {
    const seen = new Map<string, THREE.Box3>();
    for (const o of this.pickables) {
      const pick = o.userData.pick as { kind?: string; id?: string } | undefined;
      if (pick?.kind !== 'building' || !pick.id) continue;
      const box = new THREE.Box3().setFromObject(o);
      if (box.isEmpty()) continue;
      // The walls' box, grown to take in the eaves and the roof (merged elsewhere).
      box.min.x -= CG_A.occlude.eaves;
      box.min.z -= CG_A.occlude.eaves;
      box.max.x += CG_A.occlude.eaves;
      box.max.z += CG_A.occlude.eaves;
      box.max.y += 3;
      const prev = seen.get(pick.id);
      seen.set(pick.id, prev ? prev.union(box) : box);
    }
    for (const [id, box] of seen) {
      this.boxes.set(id, box);
      const c = box.getCenter(new THREE.Vector3());
      this.define(id, id, c.x, c.z);
    }
    for (const g of this.garden())
      this.define(g.id, g.id, g.object.position.x, g.object.position.z);
  }

  /** Push this frame's hidden and thinned boxes to the shader; hide garden models. */
  apply(): void {
    const garden = this.garden();
    const gardenIds = new Set(garden.map((g) => g.id));
    for (const g of garden) {
      if (this.isHidden(g.id)) {
        g.object.visible = false;
        this.gardenHidden.add(g.object);
      } else if (this.gardenHidden.delete(g.object)) g.object.visible = true;
    }
    const want = new Map<string, number>();
    for (const [id, f] of this.fades()) want.set(id, f);
    // 2 is "hidden" to the shader; 0..1 a fade.
    for (const id of this.hiddenIds()) want.set(id, 2);
    let n = 0;
    for (const [id, f] of want) {
      const box = this.boxes.get(id);
      if (!box || gardenIds.has(id) || n >= OCCLUDE.hideMin.value.length) continue;
      OCCLUDE.hideMin.value[n]!.copy(box.min);
      OCCLUDE.hideMax.value[n]!.copy(box.max);
      OCCLUDE.hideFade.value[n] = f;
      n++;
    }
    OCCLUDE.hides.value = n;
  }

  dispose(): void {
    OCCLUDE.hides.value = 0;
  }
}
