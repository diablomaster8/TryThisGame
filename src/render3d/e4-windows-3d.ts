import * as THREE from 'three';
import { CG_C } from '../config/tuning-c';
import { CG4_E4 } from '../config/tuning-e4';
import { figureFor, hashStr } from '../render/e4-shared';
import type { Dress3dCtx } from './dressings';
import { kitMaterials } from './kit-buildings';

/**
 * K18 in Full 3D: a figure cut-out laid over the lit windows near the action. The Grove's
 * windows are boxes of glass inside merged meshes, so they are found from the glass
 * geometry itself (the shared window material and the kit's glass), clustered into one box
 * per window; each window's facing comes from its thinnest horizontal side, signed by the
 * building box it sits on. The cards are one merged mesh of quads over a 4-cell texture,
 * emissive past the bloom threshold; a figure changes with the scene's beat and never
 * animates. Corvin's one lit window is a fixed entry (his house is its own kit).
 */
interface Win {
  x: number;
  y: number;
  z: number;
  /** Outward unit normal in xz, and the window's width and height. */
  nx: number;
  nz: number;
  w: number;
  h: number;
  key: number;
}

const CELL = 64;
const CAP = 40;

function figureAtlas(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const n = CG4_E4.figures.variants + 1;
  const cv = document.createElement('canvas');
  cv.width = CELL * n;
  cv.height = CELL;
  const g = cv.getContext('2d');
  if (!g) return null;
  for (let v = 0; v < n; v++) {
    const x0 = v * CELL;
    const grad = g.createLinearGradient(0, 0, 0, CELL);
    grad.addColorStop(0, '#ffe9a8');
    grad.addColorStop(1, '#f1a84c');
    g.fillStyle = grad;
    g.fillRect(x0, 0, CELL, CELL);
    // A soft vignette so the glass reads as a lit room, not a flat card.
    const vg = g.createRadialGradient(
      x0 + CELL / 2,
      CELL / 2,
      6,
      x0 + CELL / 2,
      CELL / 2,
      CELL * 0.8,
    );
    vg.addColorStop(0, 'rgba(255,255,255,0.35)');
    vg.addColorStop(1, 'rgba(120,60,10,0.35)');
    g.fillStyle = vg;
    g.fillRect(x0, 0, CELL, CELL);
    g.fillStyle = '#3b2416';
    const head = (cx: number, cy: number, r: number) => {
      g.beginPath();
      g.arc(x0 + cx, cy, r, 0, Math.PI * 2);
      g.fill();
    };
    const body = (cx: number, cy: number, rx: number, ry: number) => {
      g.beginPath();
      g.ellipse(x0 + cx, cy, rx, ry, 0, 0, Math.PI * 2);
      g.fill();
    };
    if (v === 0) {
      head(32, 26, 8);
      body(32, 62, 18, 20);
    } else if (v === 1) {
      head(21, 28, 7);
      body(21, 64, 13, 19);
      head(45, 34, 6);
      body(45, 66, 11, 17);
    } else if (v === 2) {
      head(27, 36, 8);
      body(27, 70, 16, 19);
      g.fillStyle = '#fff6d0';
      g.fillRect(x0 + 50, 44, 3, 8);
    }
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  return t;
}

export class WindowFigures3d {
  private readonly mesh: THREE.Mesh;
  private readonly geo: THREE.BufferGeometry;
  private readonly mat: THREE.MeshBasicMaterial;
  private readonly tex: THREE.CanvasTexture | null;
  private wins: Win[] = [];
  private scannedFor = '';
  private shownKey = '';
  private readonly glass: Set<THREE.Material>;
  private readonly focus = new THREE.Vector3();
  private lastPick = -1;

  constructor(private readonly ctx: Dress3dCtx) {
    this.glass = new Set([kitMaterials(ctx.tex).glass]);
    this.tex = figureAtlas();
    this.mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      toneMapped: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const g = CG4_E4.figures.glow;
    this.mat.color.setRGB(g, g * 0.8, g * 0.5);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(CAP * 12), 3));
    this.geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(CAP * 8), 2));
    const idx: number[] = [];
    for (let i = 0; i < CAP; i++)
      idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 2, i * 4 + 1, i * 4 + 3);
    this.geo.setIndex(idx);
    this.geo.setDrawRange(0, 0);
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    this.mesh.name = 'e4-window-figures';
    ctx.scene.add(this.mesh);
    void ctx.compile(this.mesh);
  }

  /** Find every kit window in the Grove once per scene, as boxes with a facing. */
  private scan(): void {
    const { ctx } = this;
    const wins: Win[] = [];
    const boxes: THREE.Box3[] = [];
    for (const o of ctx.pickables) {
      const pick = o.userData.pick as { kind?: string } | undefined;
      if (pick?.kind !== 'building') continue;
      const b = new THREE.Box3().setFromObject(o);
      if (!b.isEmpty()) boxes.push(b);
    }
    const inside = (x: number, y: number, z: number) =>
      boxes.some((b) => b.containsPoint(new THREE.Vector3(x, y, z)));
    const v = new THREE.Vector3();
    ctx.world3d.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || m === this.mesh) return;
      const mat = m.material as THREE.Material;
      const isWin =
        this.glass.has(mat) ||
        ((mat as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial &&
          (mat as THREE.MeshPhysicalMaterial).clearcoat === 1 &&
          (mat as THREE.MeshPhysicalMaterial).color.getHex() === 0x9ad0ff);
      if (!isWin) return;
      m.updateWorldMatrix(true, false);
      const pos = m.geometry.getAttribute('position');
      if (!pos) return;
      let cluster: THREE.Vector3[] = [];
      const flush = () => {
        if (cluster.length < 4) {
          cluster = [];
          return;
        }
        const box = new THREE.Box3().setFromPoints(cluster);
        const c = box.getCenter(new THREE.Vector3());
        // The thinnest horizontal side is the pane's depth: its direction is the normal.
        let best = Infinity;
        let ang = 0;
        for (let a = 0; a < 180; a += 3) {
          const dx = Math.cos((a * Math.PI) / 180);
          const dz = Math.sin((a * Math.PI) / 180);
          let lo = Infinity;
          let hi = -Infinity;
          for (const p of cluster) {
            const d = p.x * dx + p.z * dz;
            lo = Math.min(lo, d);
            hi = Math.max(hi, d);
          }
          if (hi - lo < best) {
            best = hi - lo;
            ang = a;
          }
        }
        let nx = Math.cos((ang * Math.PI) / 180);
        let nz = Math.sin((ang * Math.PI) / 180);
        // Sign: the card sits outside the wall, which is the side that is not in a building box.
        const probe = 0.25;
        const outA = !inside(c.x + nx * probe, c.y, c.z + nz * probe);
        const outB = !inside(c.x - nx * probe, c.y, c.z - nz * probe);
        if (outB && !outA) {
          nx = -nx;
          nz = -nz;
        } else if (outA === outB && nz < 0) {
          nx = -nx;
          nz = -nz;
        }
        let lo = Infinity;
        let hi = -Infinity;
        for (const p of cluster) {
          const d = -p.x * nz + p.z * nx;
          lo = Math.min(lo, d);
          hi = Math.max(hi, d);
        }
        wins.push({
          x: c.x,
          y: c.y,
          z: c.z,
          nx,
          nz,
          w: hi - lo,
          h: box.max.y - box.min.y,
          key: Math.round(c.x * 7 + c.z * 13),
        });
        cluster = [];
      };
      let first = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
        if (cluster.length === 0) first = v.clone();
        else if (v.distanceTo(first) > 1.2) {
          flush();
          first = v.clone();
        }
        cluster.push(v.clone());
      }
      flush();
    });
    this.wins = wins;
  }

  /**
   * Lay the cards for this frame. `on` is whether the scene wants them and the windows are
   * lit; `corvin` adds his window (his set shows only at his place).
   */
  update(
    on: boolean,
    sceneId: string | null,
    corvin: boolean,
    camera: THREE.PerspectiveCamera,
  ): void {
    this.mesh.visible = false;
    if (!on) return;
    const F = CG4_E4.figures;
    if (sceneId !== this.scannedFor) {
      this.scannedFor = sceneId ?? '';
      this.scan();
      this.shownKey = '';
    }
    // Where the camera looks on the ground: the windows nearest it get figures.
    const dir = camera.getWorldDirection(new THREE.Vector3());
    const t = dir.y < -0.05 ? -camera.position.y / dir.y : 20;
    this.focus.copy(camera.position).addScaledVector(dir, Math.min(60, t));
    const pick = Math.floor(performance.now() / 600);
    if (pick !== this.lastPick || this.shownKey === '') {
      this.lastPick = pick;
      const near = this.wins
        .map((w) => ({ w, d: Math.hypot(w.x - this.focus.x, w.z - this.focus.z) }))
        .filter((e) => e.d < 18)
        .sort((a, b) => a.d - b.d)
        .slice(0, CAP - 2)
        .map((e) => e.w);
      const list: Win[] = corvin
        ? [
            {
              x: CG_C.corvin.house.x + CG_C.corvin.house.w * 0.28,
              y: CG_C.corvin.house.h * 0.6,
              z: CG_C.corvin.house.z + CG_C.corvin.house.d / 2 + 0.075,
              nx: 0,
              nz: 1,
              w: 0.9,
              h: 0.8,
              key: 99,
            },
          ]
        : near;
      const key = list.map((w) => w.key).join(',') + '|' + sceneId;
      if (key !== this.shownKey) {
        this.shownKey = key;
        this.fill(list, sceneId);
      }
    }
    this.mesh.visible = this.geo.drawRange.count > 0;
    void F;
  }

  private fill(list: Win[], sceneId: string | null): void {
    const F = CG4_E4.figures;
    const pos = this.geo.getAttribute('position') as THREE.BufferAttribute;
    const uv = this.geo.getAttribute('uv') as THREE.BufferAttribute;
    const n = F.variants + 1;
    const beat = sceneId ? hashStr(sceneId) : 0;
    list.slice(0, CAP).forEach((w, i) => {
      const hw = (Math.min(w.w, 0.9) * F.share) / 2;
      const hh = (Math.min(w.h, 0.9) * F.share) / 2;
      const tx = -w.nz;
      const tz = w.nx;
      const cx = w.x + w.nx * F.lift;
      const cz = w.z + w.nz * F.lift;
      const corners: Array<[number, number, number]> = [
        [cx - tx * hw, w.y + hh, cz - tz * hw],
        [cx + tx * hw, w.y + hh, cz + tz * hw],
        [cx - tx * hw, w.y - hh, cz - tz * hw],
        [cx + tx * hw, w.y - hh, cz + tz * hw],
      ];
      corners.forEach((c, k) => pos.setXYZ(i * 4 + k, c[0], c[1], c[2]));
      // Some windows stay empty (a lit room, nobody at the glass): the last cell.
      const v =
        hashStr(String(w.key) + String(beat)) < 0.22 ? F.variants : figureFor(w.key, sceneId);
      const u0 = v / n;
      const u1 = (v + 1) / n;
      uv.setXY(i * 4, u0, 1);
      uv.setXY(i * 4 + 1, u1, 1);
      uv.setXY(i * 4 + 2, u0, 0);
      uv.setXY(i * 4 + 3, u1, 0);
    });
    pos.needsUpdate = true;
    uv.needsUpdate = true;
    this.geo.setDrawRange(0, Math.min(list.length, CAP) * 6);
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.geo.dispose();
    this.mat.dispose();
    this.tex?.dispose();
  }
}
