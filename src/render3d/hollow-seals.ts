import * as THREE from 'three';
import { FLOORS_TEXT } from '../config/strings-hollow-r8-floors';
import { cellCentre, type Cell, type Floor } from '../sim/dungeon';
import { blocksNow, hintFor, layoutOf, platesDown, torchesLit } from '../sim/dungeon-puzzles';
import { sealOpen, type Seal } from '../sim/dungeon-secrets';
import { cellTop } from './hollow-dress-path';
import {
  CELL,
  disposeObjects,
  mat,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';
import { plate } from './hollow-plates';

/**
 * Lane B round 8, "floors", in Full 3D: the cracked-wall tell on a secret room's mouth
 * (R0182), the puzzles' plates, torch stands, mural, blocks and targets (R0202), the part
 * spot's icon and words (R0212) and kid mode's hint arrow. Shared materials (`mat`), the
 * same plate sprites the traps use, one small set of meshes per floor; per frame only
 * positions and visibility change.
 */
export class HollowSeals implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private sprites: THREE.Sprite[] = [];
  private floor: Floor | null = null;
  private cracks: Array<{ seal: Seal; mesh: THREE.Object3D }> = [];
  private plates: Array<{ seal: Seal; i: number; mesh: THREE.Mesh; y: number }> = [];
  private torches: Array<{ seal: Seal; i: number; flame: THREE.Sprite }> = [];
  private blocks: Array<{ seal: Seal; meshes: THREE.Mesh[] }> = [];
  private hint: THREE.Sprite | null = null;
  private ctx: HollowCtx | null = null;
  private readonly crackMat = mat('#1c1620', { roughness: 1 });
  private readonly plateMat = mat('#a89f8c', { roughness: 0.8 });
  private readonly blockMat = mat('#7d6a55', { roughness: 0.9 });
  private readonly targetMat = mat('#e8c75a', { roughness: 0.6 });
  private readonly postMat = mat('#5a4636', { roughness: 0.9 });

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = f;
    this.ctx = ctx;
    const add = (o: THREE.Object3D) => {
      ctx.group.add(o);
      this.objs.push(o);
    };
    const sprite = (text: string, colour: string, c: Cell, y: number) => {
      const s = plate(text, colour);
      const at = cellCentre(f, c);
      s.position.set(at.x, cellTop(f, c) + y, at.z);
      add(s);
      this.sprites.push(s);
      return s;
    };
    const crackGeo = new THREE.BoxGeometry(0.06, 0.7, 0.06);
    const tileGeo = new THREE.BoxGeometry(CELL * 0.7, 0.08, CELL * 0.7);
    const targetGeo = new THREE.BoxGeometry(CELL * 0.8, 0.02, CELL * 0.8);
    const blockGeo = new THREE.BoxGeometry(CELL * 0.85, CELL * 0.75, CELL * 0.85);
    const postGeo = new THREE.BoxGeometry(0.12, 0.7, 0.12);
    for (const s of f.seals ?? []) {
      if (s.kind === 'secret') {
        // A zigzag crack on the rock face the Keeper leans on, at the mouth's floor side.
        const g = new THREE.Group();
        g.name = 'hollow-secret-crack';
        const at = cellCentre(f, s.door[0]!);
        const fr = cellCentre(f, s.front);
        const mx = (at.x + fr.x) / 2;
        const mz = (at.z + fr.z) / 2;
        for (let k = 0; k < 3; k++) {
          const m = new THREE.Mesh(crackGeo, this.crackMat);
          m.position.set(mx + (k - 1) * 0.12, cellTop(f, s.front) + 0.45 + (k % 2) * 0.15, mz);
          m.rotation.z = k % 2 ? 0.5 : -0.5;
          g.add(m);
        }
        add(g);
        this.cracks.push({ seal: s, mesh: g });
      }
      const p = s.puzzle;
      if (!p) continue;
      p.plates?.forEach((c, i) => {
        const m = new THREE.Mesh(tileGeo, this.plateMat);
        const y = cellTop(f, c) + 0.04;
        const at = cellCentre(f, c);
        m.position.set(at.x, y, at.z);
        m.receiveShadow = true;
        add(m);
        sprite('▣', '#e9e3d0', c, 0.35);
        this.plates.push({ seal: s, i, mesh: m, y });
      });
      p.torches?.forEach((c, i) => {
        const at = cellCentre(f, c);
        const post = new THREE.Mesh(postGeo, this.postMat);
        post.position.set(at.x, cellTop(f, c) + 0.35, at.z);
        add(post);
        sprite(FLOORS_TEXT.torchSymbols[i] ?? '?', '#f4ead2', c, 1.05);
        const flame = sprite('🔥', '#ffb347', c, 0.8);
        flame.visible = false;
        this.torches.push({ seal: s, i, flame });
      });
      if (p.mural && p.order) {
        const words = p.order.map((t) => FLOORS_TEXT.torchSymbols[t] ?? '?').join(' ');
        sprite(`${FLOORS_TEXT.muralTitle}: ${words}`, '#f4ead2', p.mural, 1.2);
      }
      if (p.layout !== undefined) {
        for (const t of layoutOf(p.layout).targets) {
          const c = p.grid[t]!;
          const at = cellCentre(f, c);
          const m = new THREE.Mesh(targetGeo, this.targetMat);
          m.position.set(at.x, cellTop(f, c) + 0.012, at.z);
          add(m);
          sprite('◎', '#e8c75a', c, 0.3);
        }
        const meshes = layoutOf(p.layout).blocks.map(() => {
          const m = new THREE.Mesh(blockGeo, this.blockMat);
          m.castShadow = true;
          m.receiveShadow = true;
          add(m);
          return m;
        });
        this.blocks.push({ seal: s, meshes });
      }
      if (p.shortcut) {
        const w = FLOORS_TEXT.spot[p.shortcut.part];
        sprite(`${w.icon} ${w.words}`, '#bfe3ff', p.shortcut.spot, 0.9);
      }
    }
    this.hint = plate(FLOORS_TEXT.hint, '#ffe14d');
    this.hint.visible = false;
    add(this.hint);
    this.sprites.push(this.hint);
  }

  dispose(): void {
    for (const s of this.sprites) {
      s.material.map?.dispose();
      s.material.dispose();
    }
    disposeObjects(this.objs);
    this.sprites = [];
    this.cracks = [];
    this.plates = [];
    this.torches = [];
    this.blocks = [];
    this.hint = null;
    this.floor = null;
  }

  update(t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    const run = fr.run;
    const f = this.floor;
    if (!f || !run) return;
    for (const c of this.cracks) c.mesh.visible = !sealOpen(run, c.seal);
    for (const p of this.plates) {
      const down = platesDown(run, p.seal.id).includes(p.i);
      p.mesh.position.y = p.y - (down ? 0.05 : 0);
    }
    for (const tr of this.torches)
      tr.flame.visible =
        sealOpen(run, tr.seal) ||
        tr.seal.puzzle!.order!.slice(0, torchesLit(run, tr.seal)).includes(tr.i);
    for (const b of this.blocks) {
      const p = b.seal.puzzle!;
      blocksNow(run, b.seal).forEach((g, k) => {
        const c = p.grid[g]!;
        const at = cellCentre(f, c);
        b.meshes[k]?.position.set(at.x, cellTop(f, c) + CELL * 0.375, at.z);
      });
    }
    if (this.hint) {
      const h = hintFor(run);
      this.hint.visible = !!h;
      if (h) {
        const at = cellCentre(f, h);
        this.hint.position.set(
          at.x,
          cellTop(f, h) + 0.9 + (this.ctx?.reduceMotion ? 0 : 0.08 * Math.sin(t * 4)),
          at.z,
        );
      }
    }
  }
}
