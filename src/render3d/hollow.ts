import * as THREE from 'three';
import { DUNGEON } from '../config/tuning';
import { cellAt, cellCentre, WALL, WATER, type Floor } from '../sim/dungeon';
import type { DungeonRun } from '../sim/types';

/**
 * A Hollow Below floor in 3D, built from the sim's `Floor` (`sim/dungeon.ts`): rock walls
 * on the cells that border the open ground, a stone floor, still water in the wet cells,
 * the stairs up and down, the chest (open once looted), torches and glowing crystals, and
 * the loot still lying about. Torch light comes from four point lights that follow the
 * torches nearest the Keeper, so the light count never changes while underground. Their
 * programs differ from the Grove's (four more lights, no lanterns), so the scene links
 * them in the background with `withLamps` and the hidden `samples` (see grove-3d-scene.ts).
 * Picks use the pixel view's kinds: `stairs` (`up`/`down`), `chest`, `loot`.
 */
const CELL = DUNGEON.cell;
const WALL_H = 2.4;
const LAMPS = 4;

const mat = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...o });

const LOOT_COLORS: Record<string, string> = {
  shells: '#ffb0c8',
  stone: '#8a8680',
  seed: '#9a6a3e',
  essence: '#8ae0ff',
  critter: '#b8f0ff',
  egg: '#f3efe2',
};

export class Hollow {
  readonly group = new THREE.Group();
  private floor: Floor | null = null;
  private readonly lamps: THREE.PointLight[] = [];
  private torchAt: THREE.Vector3[] = [];
  private chestLid: THREE.Object3D | null = null;
  private readonly loot = new Map<string, THREE.Object3D>();
  private readonly picks: Array<[THREE.Vector3, 'stairs' | 'chest' | 'loot', string, number]> = [];
  /**
   * One hidden mesh per program kind a floor uses (plain, flat-shaded and plain
   * instanced), so the cave programs can link before the first floor exists.
   */
  readonly samples = new THREE.Group();
  /** The shadow pass's depth programs for those (never drawn, never in the scene). */
  readonly shadowSamples = new THREE.Group();

  constructor(parent: THREE.Object3D) {
    this.group.name = 'hollow';
    this.group.visible = false;
    parent.add(this.group);
    for (let i = 0; i < LAMPS; i++) {
      // Hidden above ground: four more lights on every Grove material would cost each frame;
      // the one recompile happens on the way down the stairs.
      const l = new THREE.PointLight('#ffa850', 0, 9, 1.6);
      l.visible = false;
      this.lamps.push(l);
      parent.add(l);
    }
    const box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    this.samples.add(
      new THREE.Mesh(box, mat('#4a4450')),
      new THREE.InstancedMesh(box, mat('#3a3440', { flatShading: true }), 1),
      new THREE.InstancedMesh(box, mat('#2a5a8a'), 1),
    );
    this.samples.traverse((o) => (o.castShadow = o.receiveShadow = true));
    // And a textured sprite, as the emote balls are, which may first appear underground.
    const dot = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    this.samples.add(new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, fog: false })));
    // The shadow pass draws casters with its own depth material (back faces), which
    // `compile` never sees; these match it when compiled as the pass draws (see the scene).
    const depth = new THREE.MeshDepthMaterial({ side: THREE.BackSide });
    this.shadowSamples.add(new THREE.Mesh(box, depth), new THREE.InstancedMesh(box, depth, 1));
    this.samples.visible = false;
    parent.add(this.samples);
  }

  /** Whether the torch lamps are on (a floor is showing). */
  get lit(): boolean {
    return this.lamps[0]!.visible;
  }

  /** Run `fn` with the lamps counted as on or off; for compiling another place's set. */
  withLamps<T>(on: boolean, fn: () => T): T {
    const was = this.lamps.map((l) => l.visible);
    for (const l of this.lamps) l.visible = on;
    try {
      return fn();
    } finally {
      this.lamps.forEach((l, i) => (l.visible = was[i]!));
    }
  }

  /** Build (or clear) the floor; called when the sim enters or leaves a floor. */
  set(f: Floor | null): void {
    if (f === this.floor) return;
    this.floor = f;
    for (const c of [...this.group.children]) {
      c.removeFromParent();
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
      });
    }
    this.loot.clear();
    this.picks.length = 0;
    this.torchAt = [];
    this.chestLid = null;
    if (f) this.build(f);
  }

  private build(f: Floor): void {
    const w = f.cols * CELL;
    const h = f.rows * CELL;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat('#4a4450'));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);
    // Walls only where rock meets open ground: the solid interior is never seen.
    const walls: THREE.Vector3[] = [];
    const water: THREE.Vector3[] = [];
    for (let y = 0; y < f.rows; y++)
      for (let x = 0; x < f.cols; x++) {
        const c = cellAt(f, x, y);
        const at = cellCentre(f, { x, y });
        if (c === WATER) water.push(new THREE.Vector3(at.x, 0, at.z));
        if (c !== WALL) continue;
        let edge = false;
        for (let dy = -1; dy <= 1 && !edge; dy++)
          for (let dx = -1; dx <= 1 && !edge; dx++)
            if (cellAt(f, x + dx, y + dy) !== WALL) edge = true;
        if (edge) walls.push(new THREE.Vector3(at.x, 0, at.z));
      }
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const wallMesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(CELL, WALL_H, CELL),
      mat('#3a3440', { flatShading: true }),
      walls.length,
    );
    walls.forEach((p, i) => {
      // Uneven tops so the rock does not read as a hedge.
      const k = 0.8 + ((Math.sin(p.x * 3.1 + p.z * 1.7) + 1) / 2) * 0.45;
      s.set(1, k, 1);
      wallMesh.setMatrixAt(i, m4.compose(new THREE.Vector3(p.x, (WALL_H * k) / 2, p.z), q, s));
    });
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    this.group.add(wallMesh);
    if (water.length) {
      const pool = new THREE.InstancedMesh(
        new THREE.PlaneGeometry(CELL, CELL).rotateX(-Math.PI / 2),
        mat('#2a5a8a', {
          roughness: 0.08,
          metalness: 0.3,
          emissive: '#0a2a4a',
          emissiveIntensity: 0.6,
        }),
        water.length,
      );
      water.forEach((p, i) => pool.setMatrixAt(i, m4.makeTranslation(p.x, 0.02, p.z)));
      this.group.add(pool);
    }
    // Stairs: steps rising for the way up, a dark well with a rim for the way down.
    const up = cellCentre(f, f.stairsUp);
    const steps = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const st = new THREE.Mesh(
        new THREE.BoxGeometry(CELL * 0.8, 0.18 * (i + 1), CELL * 0.22),
        mat('#8a8490'),
      );
      st.position.set(0, 0.09 * (i + 1), -CELL * 0.3 + i * CELL * 0.2);
      steps.add(st);
    }
    steps.position.set(up.x, 0, up.z);
    this.group.add(steps);
    this.picks.push([new THREE.Vector3(up.x, 0.4, up.z), 'stairs', 'up', 0.9]);
    if (f.stairsDown) {
      const dn = cellCentre(f, f.stairsDown);
      const hole = new THREE.Mesh(new THREE.CircleGeometry(CELL * 0.38, 20), mat('#05040a'));
      hole.rotation.x = -Math.PI / 2;
      hole.position.set(dn.x, 0.03, dn.z);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(CELL * 0.4, 0.08, 8, 24), mat('#8a8490'));
      rim.rotation.x = -Math.PI / 2;
      rim.position.set(dn.x, 0.06, dn.z);
      this.group.add(hole, rim);
      this.picks.push([new THREE.Vector3(dn.x, 0.2, dn.z), 'stairs', 'down', 0.9]);
    }
    // The chest.
    const ch = cellCentre(f, f.chest);
    const chest = new THREE.Group();
    chest.add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.45), mat('#8a5a2a')));
    chest.children[0]!.position.y = 0.2;
    const lid = new THREE.Group();
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.47), mat('#a06a32'));
    lidMesh.position.set(0, 0.07, 0.235);
    lid.add(lidMesh);
    lid.position.set(0, 0.4, -0.235);
    chest.add(lid);
    const band = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.42, 0.47),
      mat('#e0c060', { metalness: 0.8, roughness: 0.3 }),
    );
    band.position.y = 0.21;
    chest.add(band);
    chest.position.set(ch.x, 0, ch.z);
    chest.traverse((o) => (o.castShadow = true));
    this.chestLid = lid;
    this.group.add(chest);
    this.picks.push([new THREE.Vector3(ch.x, 0.3, ch.z), 'chest', 'chest', 0.6]);
    // Torches: a post, a flame that glows; the lamps follow the nearest four.
    const flame = mat('#ffd080', { emissive: '#ff9a30', emissiveIntensity: 3 });
    for (const t of f.torches) {
      const p = cellCentre(f, t);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.1, 6), mat('#5a3a22'));
      post.position.set(p.x, 0.55, p.z);
      const fire = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), flame);
      fire.position.set(p.x, 1.25, p.z);
      this.group.add(post, fire);
      this.torchAt.push(new THREE.Vector3(p.x, 1.4, p.z));
    }
    const crystal = mat('#9ae8ff', { emissive: '#4ac8ff', emissiveIntensity: 1.4, roughness: 0.2 });
    for (const c of f.crystals) {
      const p = cellCentre(f, c);
      for (let i = 0; i < 3; i++) {
        const k = new THREE.Mesh(new THREE.OctahedronGeometry(0.16 + i * 0.05), crystal);
        k.scale.y = 2;
        k.position.set(
          p.x + Math.cos(i * 2.1) * 0.2,
          0.3 + i * 0.05,
          p.z + Math.sin(i * 2.1) * 0.2,
        );
        k.rotation.z = (i - 1) * 0.3;
        this.group.add(k);
      }
    }
    for (const l of f.loot) {
      const p = cellCentre(f, l.cell);
      const c = LOOT_COLORS[l.kind] ?? '#ffffff';
      const glow = l.kind === 'essence' || l.kind === 'critter';
      const m = new THREE.Mesh(
        l.kind === 'egg'
          ? new THREE.SphereGeometry(0.2, 14, 10)
          : l.kind === 'essence'
            ? new THREE.OctahedronGeometry(0.18)
            : new THREE.DodecahedronGeometry(0.16),
        mat(
          c,
          glow
            ? {
                emissive: c,
                emissiveIntensity: 0.8,
                transparent: l.kind === 'critter',
                opacity: 0.7,
              }
            : { roughness: 0.5 },
        ),
      );
      if (l.kind === 'egg') m.scale.set(0.85, 1.1, 0.85);
      m.position.set(p.x, 0.25, p.z);
      m.castShadow = true;
      this.group.add(m);
      this.loot.set(l.id, m);
      this.picks.push([m.position, 'loot', l.id, 0.45]);
    }
  }

  update(run: DungeonRun | null, keeper: { x: number; z: number }, t: number): void {
    const on = !!this.floor && !!run;
    this.group.visible = on;
    for (const l of this.lamps) {
      l.intensity = 0;
      l.visible = on;
    }
    if (!on || !run) return;
    for (const [id, m] of this.loot) {
      m.visible = !run.taken.includes(id);
      m.position.y = 0.25 + Math.sin(t * 2 + m.position.x) * 0.04;
      m.rotation.y = t * 0.8;
    }
    if (this.chestLid) this.chestLid.rotation.x = run.chestOpen ? -1.9 : 0;
    // The four lamps go to the torches nearest the Keeper, flickering a little.
    const near = [...this.torchAt]
      .sort(
        (a, b) =>
          Math.hypot(a.x - keeper.x, a.z - keeper.z) - Math.hypot(b.x - keeper.x, b.z - keeper.z),
      )
      .slice(0, LAMPS);
    near.forEach((p, i) => {
      const l = this.lamps[i]!;
      l.position.copy(p);
      l.intensity = 16 + Math.sin(t * 13 + i * 2) * 2;
    });
  }

  pick(
    ray: THREE.Ray,
    run: DungeonRun | null,
  ): { kind: 'stairs' | 'chest' | 'loot'; id: string; d: number } | null {
    if (!this.group.visible) return null;
    const sphere = new THREE.Sphere();
    const hit = new THREE.Vector3();
    let best: { kind: 'stairs' | 'chest' | 'loot'; id: string; d: number } | null = null;
    for (const [c, kind, id, r] of this.picks) {
      if (kind === 'loot' && run?.taken.includes(id)) continue;
      sphere.center.copy(c);
      sphere.radius = r;
      if (!ray.intersectSphere(sphere, hit)) continue;
      const d = hit.distanceTo(ray.origin);
      if (!best || d < best.d) best = { kind, id, d };
    }
    return best;
  }

  /** Where stairs, the chest or a piece of loot sits and its reach, for the tap highlight. */
  spot(kind: string, id: string): { x: number; z: number; r: number } | null {
    if (!this.group.visible) return null;
    const p = this.picks.find(([, k, i]) => k === kind && i === id);
    return p ? { x: p[0].x, z: p[0].z, r: p[3] } : null;
  }

  /** Ambient light for the floor: 0..1, deeper floors darker. */
  get light(): number {
    return this.floor?.light ?? 1;
  }
}
