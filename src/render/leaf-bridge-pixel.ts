import {
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  type BufferGeometry,
  type Group,
  type Material,
} from 'three';
import { DUNGEON } from '../config/tuning';
import { cellAt, cellCentre, CHASM, type Floor } from '../sim/dungeon';
import { assistBridges } from '../sim/dungeon-falls';
import { makeLeafTexture } from './textures';

/**
 * The sprout leaf-bridge in Pixel (R0025, round 12): once the sim grows a bridge across a
 * Hollow gap, each covered cell gets a flat quad of the leaf pattern laid over the painted
 * chasm, a hair above the floor plane. `sync` runs every frame underground and does work only
 * when the number of covered cells changes; a floor change calls `clear`.
 */
export class PixelLeafBridge {
  private shown = 0;
  private meshes: Mesh[] = [];
  private geo: BufferGeometry | null = null;
  private mat: Material | null = null;

  constructor(
    private readonly group: Group,
    /** The scene's fog patch, so the deck dims like the floor round it. */
    private readonly patch: (m: MeshLambertMaterial) => MeshLambertMaterial,
  ) {}

  sync(f: Floor | null): void {
    const cells = f ? assistBridges(f).filter((c) => cellAt(f, c.x, c.y) === CHASM) : [];
    if (cells.length === this.shown || !f) {
      if (!f) this.clear();
      return;
    }
    this.clear();
    this.shown = cells.length;
    if (!cells.length) return;
    const size = DUNGEON.cell;
    this.geo = new PlaneGeometry(size, size);
    const m = new MeshLambertMaterial({ map: makeLeafTexture(8, 2) });
    this.mat = this.patch(m);
    for (const c of cells) {
      const p = cellCentre(f, c);
      const mesh = new Mesh(this.geo, this.mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(p.x, 0.03, p.z);
      mesh.name = 'leaf-bridge';
      this.group.add(mesh);
      this.meshes.push(mesh);
    }
  }

  clear(): void {
    for (const m of this.meshes) m.removeFromParent();
    this.meshes = [];
    this.geo?.dispose();
    this.mat?.dispose();
    this.geo = null;
    this.mat = null;
    this.shown = 0;
  }
}
