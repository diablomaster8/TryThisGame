import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GROVE } from '../config/tuning';
import { CG4_E4 } from '../config/tuning-e4';
import { hash01, type Season } from '../render/e4-shared';
import type { Dress3dCtx } from './dressings';
import { groveHeight } from './terrain';

/**
 * K27 and K43 in Full 3D. The crop plot beside the cottage is a boarded bed with tilled
 * rows, and one merged mesh of crops for each season (sprouts, a green clump, gourds, dry
 * stalks): the staged season picks which shows, so the soil, boards and one crop mesh are
 * three draws. The cottage's seasonal decor (a wreath in winter, blossoms in the window
 * boxes in spring, gourds by the step in autumn) is one merged mesh per season on the
 * cottage's front. Vertex colours on one material each; nothing moves.
 */
const SEASONS: readonly Season[] = ['spring', 'summer', 'autumn', 'winter'];

function colored(g: THREE.BufferGeometry, hex: string): THREE.BufferGeometry {
  const c = new THREE.Color(hex);
  const n = g.getAttribute('position').count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

function put(
  g: THREE.BufferGeometry,
  hex: string,
  x: number,
  y: number,
  z: number,
  s: [number, number, number] = [1, 1, 1],
  ry = 0,
): THREE.BufferGeometry {
  const out = g.clone();
  out.scale(...s);
  if (ry) out.rotateY(ry);
  out.translate(x, y, z);
  return colored(out, hex);
}

/** One plant of a season, at the origin, about 0.45 tall. */
function plantGeometry(season: Season, seed: number): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const sph = (r: number) => new THREE.SphereGeometry(r, 8, 6);
  if (season === 'spring') {
    for (const dx of [-0.07, 0.07]) {
      parts.push(put(new THREE.CylinderGeometry(0.012, 0.016, 0.18, 4), '#5f9a3a', dx, 0.09, 0));
      parts.push(put(sph(0.06), '#8fcb5e', dx - 0.04, 0.2, 0, [1.4, 0.5, 0.9]));
      parts.push(put(sph(0.06), '#6fb04a', dx + 0.04, 0.2, 0, [1.4, 0.5, 0.9]));
    }
  } else if (season === 'summer') {
    parts.push(put(new THREE.CylinderGeometry(0.02, 0.025, 0.3, 5), '#4f8a32', 0, 0.15, 0));
    for (const [x, y, z, r, c] of [
      [-0.12, 0.2, 0.02, 0.13, '#5f9a3a'],
      [0.12, 0.22, -0.03, 0.14, '#6fb04a'],
      [0, 0.34 + hash01(seed) * 0.06, 0, 0.15, '#8fcb5e'],
      [0, 0.1, 0.1, 0.15, '#4f8a32'],
    ] as const)
      parts.push(put(sph(r), c, x, y, z, [1, 0.7, 1]));
    parts.push(put(sph(0.03), '#ffd94a', 0.02, 0.5, 0.02));
  } else if (season === 'autumn') {
    parts.push(put(sph(0.2), '#e87a2a', 0, 0.17, 0, [1.1, 0.8, 1.1]));
    parts.push(put(sph(0.12), '#f3a04a', 0, 0.19, 0.06, [0.9, 0.8, 0.8]));
    parts.push(put(new THREE.CylinderGeometry(0.02, 0.03, 0.1, 5), '#5f6a2a', 0, 0.36, 0));
    parts.push(put(sph(0.08), '#6f8a3a', 0.1, 0.34, 0, [1.5, 0.3, 1]));
  } else {
    for (const dx of [-0.07, 0, 0.07]) {
      parts.push(
        put(
          new THREE.CylinderGeometry(0.008, 0.012, 0.3 + hash01(seed + dx * 9) * 0.1, 4),
          '#7a5a3a',
          dx,
          0.17,
          0.02 * dx * 10,
        ),
      );
      parts.push(put(sph(0.025), '#eef4fb', dx, 0.34, 0));
    }
    parts.push(put(sph(0.05), '#a88a5a', -0.1, 0.14, 0.04, [1.5, 0.4, 1]));
  }
  return mergeGeometries(parts, false);
}

export class PlotAndCottage3d {
  private readonly root = new THREE.Group();
  private readonly crops = new Map<Season, THREE.Mesh>();
  private readonly decor = new Map<Season, THREE.Mesh>();
  private readonly soil: THREE.Mesh;
  private readonly soilMats = new Map<Season, THREE.MeshStandardMaterial>();
  private readonly owned: Array<{ dispose(): void }> = [];
  private season: Season | null = null;
  private decorOn: Season | null = null;

  constructor(private readonly ctx: Dress3dCtx) {
    const P = CG4_E4.plot;
    this.root.name = 'e4-world';
    const y = groveHeight(P.x, P.z);
    const plot = new THREE.Group();
    plot.position.set(P.x, y, P.z);
    this.root.add(plot);
    // Soil: a slab with tilled ridges, coloured by season.
    const soilColors: Record<Season, string> = {
      spring: '#4a3220',
      summer: '#5d4128',
      autumn: '#7a5a3a',
      winter: '#7d7d86',
    };
    const slab = colored(new THREE.BoxGeometry(P.w, 0.12, P.d), '#ffffff');
    this.owned.push(slab);
    const mat0 = new THREE.MeshStandardMaterial({ color: soilColors.spring, roughness: 1 });
    this.soil = new THREE.Mesh(slab, mat0);
    this.soil.position.y = 0.04;
    this.soil.receiveShadow = true;
    plot.add(this.soil);
    this.owned.push(mat0);
    for (const s of SEASONS) {
      const m = new THREE.MeshStandardMaterial({ color: soilColors[s], roughness: 1 });
      this.soilMats.set(s, m);
      this.owned.push(m);
    }
    // Ridges between the rows, and the boards round the bed.
    const ridgeGeo = new THREE.BoxGeometry(P.w - 0.3, 0.07, 0.16);
    const ridges = new THREE.InstancedMesh(
      ridgeGeo,
      new THREE.MeshStandardMaterial({ color: '#3a2616', roughness: 1 }),
      P.rows + 1,
    );
    const m4 = new THREE.Matrix4();
    for (let i = 0; i <= P.rows; i++) {
      m4.makeTranslation(0, 0.13, -P.d / 2 + 0.3 + ((P.d - 0.6) * i) / P.rows);
      ridges.setMatrixAt(i, m4);
    }
    plot.add(ridges);
    this.owned.push(ridgeGeo, ridges.material as THREE.Material);
    const wood = new THREE.MeshStandardMaterial({ color: '#8a5a32', roughness: 0.85 });
    const boardGeo = mergeGeometries([
      new THREE.BoxGeometry(P.w + 0.2, 0.2, 0.1).translate(0, 0.1, P.d / 2 + 0.05),
      new THREE.BoxGeometry(P.w + 0.2, 0.2, 0.1).translate(0, 0.1, -P.d / 2 - 0.05),
      new THREE.BoxGeometry(0.1, 0.2, P.d).translate(P.w / 2 + 0.05, 0.1, 0),
      new THREE.BoxGeometry(0.1, 0.2, P.d).translate(-P.w / 2 - 0.05, 0.1, 0),
    ])!;
    plot.add(new THREE.Mesh(boardGeo, wood));
    this.owned.push(boardGeo, wood);
    // One merged crop mesh per season.
    const cropMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 });
    this.owned.push(cropMat);
    for (const s of SEASONS) {
      const list: THREE.BufferGeometry[] = [];
      for (let r = 0; r < P.rows; r++)
        for (let c = 0; c < P.perRow; c++) {
          const seed = r * 7 + c;
          const g = plantGeometry(s, seed);
          g.translate(
            -P.w / 2 + 0.4 + ((P.w - 0.8) * (c + 0.5)) / P.perRow + (hash01(seed) - 0.5) * 0.12,
            0.16,
            -P.d / 2 + 0.3 + ((P.d - 0.6) * (r + 0.5)) / P.rows,
          );
          list.push(g);
        }
      const geo = mergeGeometries(list, false)!;
      this.owned.push(geo);
      const mesh = new THREE.Mesh(geo, cropMat);
      mesh.visible = false;
      mesh.castShadow = true;
      plot.add(mesh);
      this.crops.set(s, mesh);
    }
    this.buildDecor();
    this.root.visible = false;
    ctx.world3d.add(this.root);
    void ctx.compile(this.root);
  }

  /** The cottage's door, windows and step, from the Grove's own building numbers. */
  private buildDecor(): void {
    const c = GROVE.buildings.cottage;
    const d = 4;
    const w = 5.2;
    const h = 2.8;
    const fz = c.z + d / 2;
    const y0 = groveHeight(c.x, c.z);
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 });
    this.owned.push(mat);
    const sph = (r: number) => new THREE.SphereGeometry(r, 8, 6);
    const make = (season: Season, parts: THREE.BufferGeometry[]) => {
      const geo = mergeGeometries(parts, false)!;
      this.owned.push(geo);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      mesh.castShadow = true;
      this.root.add(mesh);
      this.decor.set(season, mesh);
    };
    // Winter: a fir wreath with berries and a bow on the door.
    const wreath: THREE.BufferGeometry[] = [
      put(new THREE.TorusGeometry(0.22, 0.06, 8, 18), '#2f6a3a', c.x, y0 + 1.5, fz + 0.12),
    ];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + 0.3;
      wreath.push(
        put(
          sph(0.035),
          '#d63a3a',
          c.x + Math.cos(a) * 0.22,
          y0 + 1.5 + Math.sin(a) * 0.22,
          fz + 0.17,
        ),
      );
    }
    wreath.push(put(new THREE.BoxGeometry(0.2, 0.07, 0.03), '#b82a2a', c.x, y0 + 1.27, fz + 0.18));
    make('winter', wreath);
    // Spring: blossoms spilling from a box under each window.
    const spring: THREE.BufferGeometry[] = [];
    const cols = ['#ff8fb0', '#ffd94a', '#ffffff', '#b89af0', '#ff7a5a'];
    for (const sx of [-1, 1]) {
      const wx = c.x + sx * w * 0.3;
      spring.push(
        put(new THREE.BoxGeometry(0.95, 0.18, 0.26), '#8a5a32', wx, y0 + h * 0.55 - 0.55, fz + 0.2),
      );
      for (let i = 0; i < 9; i++)
        spring.push(
          put(
            sph(0.065),
            cols[(i + (sx > 0 ? 2 : 0)) % cols.length]!,
            wx - 0.4 + i * 0.1,
            y0 + h * 0.55 - 0.4 + hash01(i + sx) * 0.1,
            fz + 0.2 + (hash01(i * 3) - 0.5) * 0.12,
          ),
        );
    }
    make('spring', spring);
    // Autumn: gourds by the step.
    const autumn: THREE.BufferGeometry[] = [];
    for (const [dx, r, col] of [
      [-1.15, 0.26, '#e87a2a'],
      [-0.78, 0.18, '#e8c03a'],
      [-1.45, 0.2, '#5f9a3a'],
    ] as const) {
      autumn.push(put(sph(r), col, c.x + dx, y0 + r * 0.8, fz + 0.75, [1.1, 0.8, 1.1]));
      autumn.push(
        put(
          new THREE.CylinderGeometry(0.02, 0.03, 0.1, 5),
          '#5f6a2a',
          c.x + dx,
          y0 + r * 1.55,
          fz + 0.75,
        ),
      );
    }
    make('autumn', autumn);
  }

  /** `season` shows the plot (null hides it); `decor` is the cottage's season, or null. */
  update(home: boolean, season: Season | null, decor: Season | null): void {
    this.root.visible = home && season !== null;
    if (!this.root.visible) return;
    if (season !== this.season) {
      this.season = season;
      this.soil.material = this.soilMats.get(season!)!;
      for (const [s, m] of this.crops) m.visible = s === season;
    }
    if (decor !== this.decorOn) {
      this.decorOn = decor;
      for (const [s, m] of this.decor) m.visible = s === decor;
    }
  }

  dispose(): void {
    this.root.removeFromParent();
    for (const o of this.owned) o.dispose();
  }
}
