/**
 * The tactics board in Full 3D (recs FIGHT-62): the same grid the Pixel board draws, as
 * blocks on a `MiniStage` (the Grove's renderer, sky, creature pool and disposal) under the
 * see-through tactics screen. Tiles are one `InstancedMesh` per tile kind, so a 16×16 board
 * costs a dozen draws; the overlays (move, aim, path, charges, fruit, cursor) are one
 * instanced quad set with a colour per kind; units are the creature pool's rigs, posed from
 * the state (idle, active, hurt, tuckered) and turned to their facing. The camera is long
 * (20°), 35° down like the Grove, and snaps in quarter turns. Everything is disposed when the
 * screen closes: the stage frees what it made and the rigs go back to the pool.
 */
import { idleKind, idlePose, reducedMotion } from '../ui/battle-idle';
import * as THREE from 'three';
import { TACTICS } from '../config/tuning-tactics';
import type { Flashes, Overlays, TacticsBoardView } from '../minigames/tactics/board-view';
import { daylightAt } from '../render/daylight';
import { C, color } from '../render/sprites/palette';
import { speciesArt } from '../render/sprites/species-art';
import { variantById } from '../samples/nubbin-variant-catalogue';
import type { Rigged } from '../samples/species';
import { ROSTER } from '../samples/species-roster';
import { standing } from '../sim/battle/damage';
import { heightAt, mapOf, tileAt } from '../sim/battle/tactics';
import { chargeTiles } from '../sim/battle/tactics/engine';
import {
  TILE,
  type Cell,
  type Dir,
  type GridMap,
  type TacticsState,
  type TUnit,
} from '../sim/battle/tactics/types';
import type { Keeper, Nubbin, NubbinType } from '../sim/types';
import { keeperLook, nubbinLook, type Look } from './creature-pool';
import type { Grove3dScene } from './grove-3d-scene';
import { CreatureLod } from './lod';
import { MiniStage } from './minigame-stage';

const V = TACTICS.view3d;

/** Tile tops by kind, in the Pixel board's palette so both boards read alike. */
const TOP: Record<number, number> = {
  [TILE.grass]: C.grass,
  [TILE.wall]: C.lilacGrey,
  [TILE.deep]: C.deepWater,
  [TILE.shallow]: C.shallows,
  [TILE.crystal]: C.tealLight,
  [TILE.lantern]: C.sunYellow,
  [TILE.tall]: C.leaf,
  [TILE.path]: C.sand,
  [TILE.mud]: C.bark,
  [TILE.shade]: C.forest,
  [TILE.tree]: C.leafDeep,
  [TILE.plot]: C.wood,
  [TILE.exit]: C.roseLight,
};

/** Overlay kinds and their colours; one instanced quad set draws them all. */
const OVERLAY = {
  move: C.skyDeep,
  aim: C.orange,
  path: C.cream,
  charge: C.ember,
  fruit: C.berry,
  target: C.sunYellow,
  cursor: C.white,
} as const;
type OverlayKind = keyof typeof OVERLAY;

const DIR_VEC: Record<Dir, Cell> = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 },
};

/** The look a rival with no Nubbin of its own wears: its species, else the child Nubbin. */
export function foeLook(species: string, type: NubbinType, adult: boolean): Look {
  const height = 1.0 * (adult ? 1.2 : 1);
  if (species !== 'chao') {
    const roster = ROSTER.find((s) => s.name.toLowerCase() === species.toLowerCase());
    if (roster) return { key: `roster:${roster.name}`, height };
    const art = speciesArt(species);
    if (art) return { key: `art:${species}`, height: art.size };
  }
  const first = `first-neutral-${type}`;
  if (adult && variantById(first)) return { key: `variant:${first}`, height };
  return variantById('child') ? { key: 'variant:child', height } : { key: 'nubbin', height };
}

interface UnitView {
  key: string;
  rig: Rigged | null;
  compiling: boolean;
  stand: THREE.Mesh | null;
  bar: { group: THREE.Group; fill: THREE.Sprite };
}

export class Tactics3dView implements TacticsBoardView {
  rot = 0;
  zoom: 1 | 2 = 1;
  /** The screen divides drags by 2 × scale; 0.5 makes pan plain CSS pixels. */
  readonly scale = 0.5;
  panX = 0;
  panY = 0;
  private stage: MiniStage;
  private ready = false;
  private mapKey = '';
  private map: GridMap | null = null;
  private tiles: { mesh: THREE.InstancedMesh; cells: Cell[] }[] = [];
  private overlay: THREE.InstancedMesh | null = null;
  private props: THREE.Object3D[] = [];
  private readonly units = new Map<string, UnitView>();
  private readonly focus = new THREE.Vector3();
  private readonly target = new THREE.Vector3();
  private readonly ray = new THREE.Raycaster();
  private readonly tmp = new THREE.Object3D();
  private readonly col = new THREE.Color();
  private readonly v = new THREE.Vector3();
  private readonly v2 = new THREE.Vector2();
  private calls: number | null = null;
  private disposed = false;
  /** The Grove's creature LOD: from this far every rig is its merged coarse stand-in. */
  private readonly lod = new CreatureLod();

  constructor(
    host: Grove3dScene,
    /** The screen's input surface: framing centres the board on it. */
    private readonly surface: HTMLElement,
    private readonly nubbinOf: (id: string) => Nubbin | null,
    /** The Keeper and its outfit, for the Keeper's piece (FIGHT-66). */
    private readonly keeperOf: () => { keeper: Keeper; trainer: string } | null = () => null,
  ) {
    this.stage = new MiniStage(host, V.hour);
    this.stage.backdrop(V.backdrop.top, V.backdrop.bottom);
    // Phone budget (180 draws, 450k triangles): no shadow pass. Every rig carries its own
    // contact blob, and the tiles are flat-shaded blocks that read without cast shadows.
    this.stage.sky.sun.castShadow = false;
    const pool = this.stage.pool;
    this.lod.low = {
      state: (key, res) => pool.lowState(key, res),
      surface: (key, part) => pool.lowSurface(key, part),
    };
    this.lod.compile = (o) => this.stage.compile([o]);
  }

  /** World position of a tile's top centre. */
  private world(m: GridMap, x: number, y: number, out = new THREE.Vector3()): THREE.Vector3 {
    return out.set((x - (m.w - 1) / 2) * V.tile, this.topOf(m, x, y), (y - (m.h - 1) / 2) * V.tile);
  }

  private topOf(m: GridMap, x: number, y: number): number {
    const t = tileAt(m, x, y);
    const lift = t === TILE.wall ? 2 : t === TILE.lantern ? 1 : 0;
    const sink = t === TILE.deep ? -0.5 : t === TILE.shallow ? -0.2 : 0;
    return V.base + (heightAt(m, x, y) + lift + sink) * V.level;
  }

  resize(m: GridMap): void {
    if (!this.map) this.map = m;
  }

  /** Build the tile instances once per map. */
  private build(s: TacticsState): void {
    const key = `${s.map.tiles}:${s.map.height}`;
    if (key === this.mapKey) return;
    this.mapKey = key;
    this.clearBoard();
    const m = mapOf(s);
    this.map = m;
    const byKind = new Map<number, Cell[]>();
    for (let y = 0; y < m.h; y++)
      for (let x = 0; x < m.w; x++) {
        const t = tileAt(m, x, y);
        let list = byKind.get(t);
        if (!list) byKind.set(t, (list = []));
        list.push({ x, y });
      }
    const box = new THREE.BoxGeometry(1, 1, 1);
    box.translate(0, 0.5, 0);
    for (const [kind, cells] of byKind) {
      const water = kind === TILE.deep || kind === TILE.shallow;
      const mat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: water ? 0.25 : 0.9,
        flatShading: true,
        ...(water ? { transparent: true, opacity: 0.88 } : {}),
      });
      const mesh = new THREE.InstancedMesh(box.clone(), mat, cells.length);
      cells.forEach((c, i) => {
        const p = this.world(m, c.x, c.y);
        this.tmp.position.set(p.x, 0, p.z);
        this.tmp.scale.set(V.tile * 0.98, Math.max(0.05, p.y), V.tile * 0.98);
        this.tmp.updateMatrix();
        mesh.setMatrixAt(i, this.tmp.matrix);
        // A faint checker, so tiles count at a glance on flat ground.
        const shade = (c.x + c.y) % 2 ? 0.94 : 1;
        mesh.setColorAt(
          i,
          this.col.set(color(TOP[kind] ?? C.grass)).multiplyScalar(shade * V.shade),
        );
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.receiveShadow = true;
      this.stage.scene.add(mesh);
      this.tiles.push({ mesh, cells });
      // Fruit trees stand on their tiles; a few small groups, made by the stage's own kit.
      if (kind === TILE.tree)
        for (const c of cells) {
          const tree = this.stage.tree(0.45, c.x * 31 + c.y);
          this.world(m, c.x, c.y, tree.position);
          this.props.push(tree);
        }
    }
    box.dispose();
    const quad = new THREE.PlaneGeometry(V.tile * 0.86, V.tile * 0.86);
    quad.rotateX(-Math.PI / 2);
    const om = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    this.overlay = new THREE.InstancedMesh(quad, om, m.w * m.h * 3 + 64);
    this.overlay.count = 0;
    this.overlay.renderOrder = 3;
    this.overlay.frustumCulled = false;
    this.stage.scene.add(this.overlay);
    this.focus.set(0, V.base, 0);
    this.stage.sky.set(V.hour, daylightAt(V.hour), 'clear', this.focus);
    // The long lens stands ~50 units off: the Grove's distance fog would wash the board out.
    this.stage.scene.fog = null;
    this.ready = false;
    void this.stage.compile().then(() => {
      if (!this.disposed) this.ready = true;
    });
  }

  private clearBoard(): void {
    for (const t of this.tiles) {
      this.stage.scene.remove(t.mesh);
      t.mesh.geometry.dispose();
      (t.mesh.material as THREE.Material).dispose();
      t.mesh.dispose();
    }
    this.tiles = [];
    if (this.overlay) {
      this.stage.scene.remove(this.overlay);
      this.overlay.geometry.dispose();
      (this.overlay.material as THREE.Material).dispose();
      this.overlay.dispose();
      this.overlay = null;
    }
    // Trees stay in the scene (hidden) so the stage frees their parts with everything else.
    for (const p of this.props) p.visible = false;
    this.props = [];
  }

  draw(s: TacticsState, o: Overlays, now: number, _sheetFor: unknown, flashes: Flashes): void {
    if (this.disposed) return;
    this.build(s);
    const m = this.map!;
    this.aim(m);
    if (!this.ready) return;
    this.stage.pool.frame();
    this.overlays(s, m, o);
    this.placeUnits(s, m, now, flashes);
    // Phone budget: hulls go and far rigs become one-draw stand-ins (level 3, as a busy Grove).
    const roots: THREE.Object3D[] = [];
    for (const v of this.units.values()) if (v.rig && !v.compiling) roots.push(v.rig.group);
    this.lod.update(roots, this.stage.camera, 3, this.stage.renderer.domElement.clientHeight);
    this.stage.render(now, (x, z) => this.groundAt(m, x, z));
    this.calls = this.stage.renderer.info.render.calls;
  }

  /** Ground height under a world point (rigs plant their feet on it). */
  private groundAt(m: GridMap, x: number, z: number): number {
    const gx = Math.round(x / V.tile + (m.w - 1) / 2);
    const gy = Math.round(z / V.tile + (m.h - 1) / 2);
    if (gx < 0 || gy < 0 || gx >= m.w || gy >= m.h) return V.base;
    return this.topOf(m, gx, gy);
  }

  /** Frame the board: long lens, 35° down, quarter-turn yaw, centred on the input surface. */
  private aim(m: GridMap): void {
    const st = this.stage;
    st.fit({ height: 6, minSpan: 6, fovDeg: V.fovDeg });
    const cam = st.camera;
    const size = st.renderer.getSize(this.v as unknown as THREE.Vector2);
    const w = Math.max(1, size.x);
    const h = Math.max(1, size.y);
    const aspect = w / h;
    // Turned 45°, the board is as wide as its diagonal: half of it is about 0.72 of a side.
    const radius = (Math.max(m.w, m.h) * 0.72 + V.margin) * V.tile;
    const half = Math.tan((V.fovDeg * Math.PI) / 360);
    let dist = radius / (half * Math.min(1, aspect));
    if (this.zoom === 2) dist *= 0.55;
    const yaw = Math.PI / 4 - (this.rot * Math.PI) / 2;
    const pitch = (V.pitchDeg * Math.PI) / 180;
    const k = (2 * dist * half) / h;
    // Pan: the board follows the finger, so the look point moves against the drag.
    const rx = Math.cos(yaw);
    const rz = -Math.sin(yaw);
    const fx = -Math.sin(yaw);
    const fz = -Math.cos(yaw);
    this.target.set(
      this.focus.x - rx * this.panX * k - (fx * this.panY * k) / Math.sin(pitch),
      this.focus.y,
      this.focus.z - rz * this.panX * k - (fz * this.panY * k) / Math.sin(pitch),
    );
    cam.position.set(
      this.target.x + Math.sin(yaw) * Math.cos(pitch) * dist,
      this.target.y + Math.sin(pitch) * dist,
      this.target.z + Math.cos(yaw) * Math.cos(pitch) * dist,
    );
    cam.lookAt(this.target);
    cam.fov = V.fovDeg;
    cam.near = Math.max(0.5, dist - radius * 2);
    cam.far = dist + radius * 3;
    // The board sits in the gap between the screen's top strip and its bar, not the window.
    const r = this.surface.getBoundingClientRect();
    const c = st.renderer.domElement.getBoundingClientRect();
    const sx = w / Math.max(1, c.width);
    const sy = h / Math.max(1, c.height);
    const cx = (r.left + r.width / 2 - c.left) * sx;
    const cy = (r.top + r.height / 2 - c.top) * sy;
    cam.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
    cam.updateProjectionMatrix();
  }

  private overlays(s: TacticsState, m: GridMap, o: Overlays): void {
    const ov = this.overlay;
    if (!ov) return;
    let n = 0;
    const put = (c: Cell, kind: OverlayKind, size = 1) => {
      if (n >= ov.instanceMatrix.count) return;
      this.world(m, c.x, c.y, this.tmp.position);
      this.tmp.position.y += 0.02 + n * 0.0005;
      this.tmp.scale.set(size, 1, size);
      this.tmp.updateMatrix();
      ov.setMatrixAt(n, this.tmp.matrix);
      ov.setColorAt(n, this.col.set(color(OVERLAY[kind])));
      n++;
    };
    for (const c of o.move ?? []) put(c, 'move');
    for (const c of o.aim ?? []) put(c, 'aim');
    for (const c of o.path ?? []) put(c, 'path', 0.45);
    for (const c of chargeTiles(s)) put(c, 'charge', 0.95);
    for (const f of s.fruit) put(f, 'fruit', 0.3);
    if (o.target) put(o.target, 'target', 1.05);
    if (o.cursor) put(o.cursor, 'cursor', 0.7);
    ov.count = n;
    ov.instanceMatrix.needsUpdate = true;
    if (ov.instanceColor) ov.instanceColor.needsUpdate = true;
  }

  private lookOf(u: TUnit): Look {
    const k = u.keeper ? this.keeperOf() : null;
    if (k) return keeperLook(k.keeper, k.trainer);
    const n = u.c.nubbinId ? this.nubbinOf(u.c.nubbinId) : null;
    if (n) return nubbinLook(n);
    return foeLook(u.c.species, u.c.type, u.job !== 'tumbler');
  }

  private placeUnits(s: TacticsState, m: GridMap, now: number, f: Flashes): void {
    const seen = new Set<string>();
    for (const u of s.units) {
      const out = !standing(u.c);
      if (out && u.c.side !== 0) continue;
      seen.add(u.c.id);
      let view = this.units.get(u.c.id);
      if (!view) {
        const look = this.lookOf(u);
        view = {
          key: look.key,
          rig: null,
          compiling: false,
          stand: this.stage.standIn(look),
          bar: this.stage.bar(0.9, 0.12, color(u.c.side === 0 ? C.leaf : C.ember)),
        };
        this.units.set(u.c.id, view);
      }
      if (!view.rig) {
        const rig = this.stage.acquire(this.lookOf(u));
        if (rig) {
          view.rig = rig;
          view.compiling = true;
          void this.stage.compile([rig.group]).then(() => {
            if (this.disposed || !view) return;
            view.compiling = false;
            if (view.stand) {
              view.stand.visible = false;
              view.stand = null;
            }
            rig.group.visible = true;
          });
        }
      }
      const p = this.world(m, u.x, u.y);
      const pile = f.pile.get(u.c.id);
      if (pile !== undefined && now - pile < 450) p.x += Math.sin((now - pile) / 40) * 0.08;
      // FIGHT-78: a personality idle while the board waits (pixels to world units, ~1/24).
      if (standing(u.c) && !s.result) {
        const idle = idlePose(idleKind(u.c), u.c.id, s.seed, now, reducedMotion());
        p.x += idle.dx / 24;
        p.y -= idle.dy / 24;
      }
      const hurt = f.hurt.get(u.c.id);
      const d = DIR_VEC[u.face];
      if (view.stand) view.stand.position.set(p.x, p.y + view.stand.scale.y * 0.55, p.z);
      const rig = view.rig;
      if (rig && !view.compiling) {
        rig.group.position.copy(p);
        rig.group.visible = true;
        // Merged partners (FIGHT-57) stand about two tiles tall.
        const base = (rig.group.userData.baseScale ??= rig.group.scale.x) as number;
        rig.group.scale.setScalar(base * (u.tall ? 1.8 : 1));
        rig.setPose(
          out
            ? 'sleep'
            : hurt !== undefined && now - hurt < 500
              ? 'sad'
              : s.active === u.c.id
                ? 'happy'
                : 'idle',
        );
        rig.face(Math.atan2(d.x, d.y));
        rig.animate(now / 1000);
      }
      const share = Math.max(0, u.c.hp / u.c.maxHp);
      view.bar.group.position.set(p.x, p.y + (u.tall ? 3 : 1.7), p.z);
      view.bar.fill.scale.x = 0.9 * share;
      view.bar.group.visible = !out;
    }
    // Units that left the board (a rival gone home) hide; the stage frees them on dispose.
    for (const [id, view] of this.units)
      if (!seen.has(id)) {
        if (view.rig) view.rig.group.visible = false;
        if (view.stand) view.stand.visible = false;
        view.bar.group.visible = false;
      }
  }

  pick(_s: TacticsState, bx: number, by: number): Cell | null {
    const c = this.stage.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((bx - c.left) / c.width) * 2 - 1,
      -((by - c.top) / c.height) * 2 + 1,
    );
    this.ray.setFromCamera(ndc, this.stage.camera);
    const hits = this.ray.intersectObjects(
      this.tiles.map((t) => t.mesh),
      false,
    );
    for (const h of hits) {
      const t = this.tiles.find((x) => x.mesh === h.object);
      if (t && h.instanceId !== undefined) return t.cells[h.instanceId] ?? null;
    }
    return null;
  }

  tileCss(): number {
    const m = this.map;
    if (!m) return 0;
    const a = this.clientAt(this.world(m, 0, 0));
    const b = this.clientAt(this.world(m, 1, 0));
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  centreOn(s: TacticsState, c: Cell): void {
    const m = this.map ?? mapOf(s);
    this.world(m, c.x, c.y, this.focus);
    this.panX = 0;
    this.panY = 0;
  }

  private clientAt(p: THREE.Vector3): { x: number; y: number } {
    const c = this.stage.renderer.domElement.getBoundingClientRect();
    const v = this.v.copy(p).project(this.stage.camera);
    return { x: c.left + ((v.x + 1) / 2) * c.width, y: c.top + ((1 - v.y) / 2) * c.height };
  }

  clientOf(s: TacticsState, c: Cell): { x: number; y: number } {
    const m = this.map ?? mapOf(s);
    return this.clientAt(this.world(m, c.x, c.y));
  }

  /** 3D picks in client pixels directly. */
  toBoard(clientX: number, clientY: number): { x: number; y: number } {
    return { x: clientX, y: clientY };
  }

  drawCalls(): number | null {
    return this.calls;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    // Rigs go back to the pool whole: no stand-in left on, every hull and caster back.
    this.lod.update([], this.stage.camera, 0, 1);
    this.clearBoard();
    this.units.clear();
    this.stage.camera.clearViewOffset();
    this.stage.dispose();
  }
}
