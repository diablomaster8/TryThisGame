import * as THREE from 'three';
import { visibleStoryProps, type StoryPropKind } from '../sim/story-props';
import type { DecorKind, Plant, TileKind, World } from '../sim/types';

/**
 * The Keeper's own garden work in 3D: placed decor (fences, beds, benches, the statue,
 * path stones, small lanterns, rock piles, thickets and the three buildings), the
 * orchard and crop plants through their four stages, and painted ground tiles. The pixel
 * view draws the same lists in `world-view.ts`; picks use the same kinds and ids, so a tap
 * on a bench or a sapling does what it does in the pixel mode. Rebuilt only when the
 * lists change (a signature is checked twice a second).
 */
type Ground = (x: number, z: number) => number;

const mat = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...o });

const MATS = {
  wood: mat('#9a6a3e'),
  darkWood: mat('#6a4428'),
  stone: mat('#a8a4a0'),
  darkStone: mat('#7a7672'),
  soil: mat('#6a4a30', { roughness: 1 }),
  leaf: mat('#4f9a3a'),
  leafLight: mat('#78c050'),
  roofRed: mat('#c0503a'),
  roofBlue: mat('#4a7ab8'),
  roofGreen: mat('#4a8a5a'),
  wall: mat('#efe4cc'),
  glow: mat('#ffe0a0', { emissive: '#ffb347', emissiveIntensity: 1.6 }),
  bark: mat('#7a5232'),
};
const FLOWERS = ['#ff8fb0', '#ffd94a', '#b89af0', '#ffffff', '#ff7a5a'].map((c) => mat(c));
/** Materials every model shares for the page's life; never disposed. */
const SHARED = new Set<THREE.Material>([...Object.values(MATS), ...FLOWERS]);

/**
 * Free what a garden or visit model made for itself: geometry, instance buffers and its
 * own materials. The shared materials above and every texture (the kit's, shared with the
 * Grove) stay.
 */
export function disposeModel(root: THREE.Object3D): void {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.geometry.dispose();
    for (const mat of Array.isArray(m.material) ? m.material : [m.material])
      if (!SHARED.has(mat)) mat.dispose();
    if ((o as THREE.InstancedMesh).isInstancedMesh) (o as THREE.InstancedMesh).dispose();
  });
}

function box(w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y + h / 2, z);
  return o;
}
function ball(r: number, m: THREE.Material, x = 0, y = 0, z = 0, detail = 1) {
  const o = new THREE.Mesh(new THREE.IcosahedronGeometry(r, detail), m);
  o.position.set(x, y, z);
  return o;
}

/** A small house for the nursery, bathhouse and workshop, sized like the pixel ones. */
export function building(width: number, roof: THREE.Material): THREE.Group {
  const g = new THREE.Group();
  const d = width * 0.7;
  const h = width * 0.45;
  g.add(box(width, h, d, MATS.wall));
  const r = new THREE.Mesh(new THREE.ConeGeometry(width * 0.78, width * 0.4, 4), roof);
  r.rotation.y = Math.PI / 4;
  r.scale.z = d / width;
  r.position.y = h + width * 0.2;
  g.add(r);
  g.add(box(width * 0.18, h * 0.6, 0.05, MATS.darkWood, 0, 0, d / 2 + 0.01));
  return g;
}

export function decorModel(kind: DecorKind): THREE.Group {
  const g = new THREE.Group();
  switch (kind) {
    case 'fence':
      for (const x of [-0.45, 0.45]) g.add(box(0.1, 0.6, 0.1, MATS.wood, x));
      for (const y of [0.2, 0.42]) g.add(box(1.0, 0.07, 0.05, MATS.wood, 0, y));
      break;
    case 'flowerbed':
      g.add(box(1.0, 0.14, 0.6, MATS.soil));
      for (let i = 0; i < 8; i++) {
        const x = -0.38 + (i % 4) * 0.25;
        const z = i < 4 ? -0.13 : 0.13;
        g.add(ball(0.06, MATS.leaf, x, 0.2, z, 0));
        g.add(ball(0.07, FLOWERS[i % FLOWERS.length]!, x, 0.3, z, 0));
      }
      break;
    case 'bench':
      g.add(box(1.1, 0.08, 0.36, MATS.wood, 0, 0.36));
      g.add(box(1.1, 0.3, 0.06, MATS.wood, 0, 0.44, -0.16));
      for (const x of [-0.45, 0.45]) g.add(box(0.08, 0.36, 0.3, MATS.darkWood, x));
      break;
    case 'statue':
      g.add(box(0.6, 0.4, 0.6, MATS.darkStone));
      g.add(ball(0.32, MATS.stone, 0, 0.75, 0, 2));
      g.add(ball(0.36, MATS.stone, 0, 1.2, 0, 2));
      g.add(new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.36, 10), MATS.stone));
      g.children[g.children.length - 1]!.position.y = 1.62;
      break;
    case 'pathTile': {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.05, 8), MATS.stone);
      t.position.y = 0.025;
      g.add(t);
      break;
    }
    case 'lanternSmall':
      g.add(box(0.07, 0.8, 0.07, MATS.darkWood));
      g.add(box(0.2, 0.22, 0.2, MATS.glow, 0, 0.8));
      g.add(box(0.26, 0.04, 0.26, MATS.darkWood, 0, 1.02));
      break;
    case 'rockPile':
      g.add(ball(0.32, MATS.stone, -0.18, 0.2, 0, 0));
      g.add(ball(0.26, MATS.darkStone, 0.22, 0.16, 0.1, 0));
      g.add(ball(0.2, MATS.stone, 0.02, 0.42, -0.05, 0));
      break;
    case 'thicket':
      for (const [x, y, z, r] of [
        [-0.3, 0.35, 0, 0.42],
        [0.3, 0.3, 0.1, 0.38],
        [0, 0.55, -0.15, 0.4],
      ] as const)
        g.add(ball(r, y > 0.5 ? MATS.leafLight : MATS.leaf, x, y, z, 1));
      break;
    case 'nursery':
      g.add(building(4.4, MATS.roofRed));
      break;
    case 'bathhouse':
      g.add(building(5.6, MATS.roofBlue));
      break;
    case 'workshop':
      g.add(building(5.8, MATS.roofGreen));
      break;
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return g;
}

type GardenPickKind = 'decor' | 'building' | 'plant' | 'storyProp';

/** A side-story prop (sim/story-props.ts) in the same plain style as the decor. */
export function storyPropModel(kind: StoryPropKind): THREE.Group {
  const g = new THREE.Group();
  switch (kind) {
    case 'trowel': {
      const handle = box(0.05, 0.05, 0.3, MATS.darkWood, -0.1, 0.03, 0);
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 4), MATS.stone);
      blade.rotation.x = -Math.PI / 2;
      blade.position.set(-0.1, 0.05, 0.3);
      g.add(handle, blade);
      break;
    }
    case 'register':
      g.add(box(0.36, 0.1, 0.28, MATS.darkStone));
      g.add(box(0.32, 0.08, 0.24, MATS.stone, 0, 0.1));
      break;
    case 'handLantern':
      g.add(box(0.05, 0.9, 0.05, MATS.darkWood));
      g.add(box(0.18, 0.2, 0.18, MATS.glow, 0, 0.6));
      g.add(box(0.22, 0.04, 0.22, MATS.darkWood, 0, 0.8));
      break;
    case 'flatStone':
      g.add(box(1.3, 0.16, 0.9, MATS.stone));
      break;
    case 'gardenDoor':
      for (const x of [-0.75, 0.75]) g.add(box(0.5, 1.5, 0.5, MATS.darkStone, x));
      g.add(box(2.0, 0.18, 0.56, MATS.stone, 0, 1.5));
      g.add(box(1.0, 1.35, 0.1, MATS.wood, 0, 0, 0.18));
      g.add(ball(0.05, MATS.darkStone, 0.35, 0.7, 0.26, 0));
      break;
    case 'oldBench':
      g.add(box(1.1, 0.08, 0.36, MATS.darkWood, 0, 0.36));
      g.add(box(1.1, 0.3, 0.06, MATS.darkWood, 0, 0.44, -0.16));
      for (const x of [-0.45, 0.45]) g.add(box(0.08, 0.36, 0.3, MATS.darkWood, x));
      break;
    case 'chair':
      g.add(box(0.5, 0.06, 0.5, MATS.wood, 0, 0.4));
      g.add(box(0.5, 0.5, 0.05, MATS.wood, 0, 0.46, -0.22));
      for (const [x, z] of [
        [-0.2, -0.2],
        [0.2, -0.2],
        [-0.2, 0.2],
        [0.2, 0.2],
      ] as const)
        g.add(box(0.05, 0.4, 0.05, MATS.darkWood, x, 0, z));
      break;
    case 'shed':
      g.add(box(1.8, 1.4, 1.4, MATS.wood));
      g.add(box(2.0, 0.12, 1.6, MATS.darkWood, 0, 1.4));
      g.add(box(0.5, 1.0, 0.06, MATS.darkWood, 0.3, 0, 0.72));
      g.add(box(0.4, 0.36, 0.04, MATS.glow, -0.45, 0.7, 0.72));
      break;
    case 'barn': {
      g.add(box(3.6, 2.2, 2.6, MATS.wood));
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.4, 4), MATS.darkWood);
      roof.position.y = 2.9;
      roof.rotation.y = Math.PI / 4;
      roof.scale.z = 0.8;
      g.add(roof);
      g.add(box(1.2, 1.7, 0.08, MATS.darkWood, 0, 0, 1.32));
      break;
    }
    case 'shelf':
      g.add(box(0.7, 0.05, 0.22, MATS.wood, 0, 0.9));
      g.add(box(0.14, 0.14, 0.14, MATS.glow, -0.2, 0.95));
      g.add(box(0.2, 0.12, 0.16, MATS.darkStone, 0.15, 0.95));
      break;
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return g;
}

/** A plant at its stage: seed mound, sprout, young and grown (with fruit when ready). */
export function plantModel(p: Plant): THREE.Group {
  const g = new THREE.Group();
  const dry = p.water < 0.25;
  const leaf = dry ? mat('#9a9a50') : MATS.leaf;
  g.add(ball(0.22, MATS.soil, 0, 0, 0, 0));
  g.children[0]!.scale.y = 0.35;
  if (p.kind === 'tree') {
    if (p.stage >= 1) {
      const s = [0, 0.35, 0.7, 1.15][p.stage] ?? 1;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05 * s, 0.09 * s, 1.4 * s, 7),
        MATS.bark,
      );
      trunk.position.y = 0.7 * s;
      g.add(trunk);
      g.add(ball(0.55 * s, leaf, 0, 1.55 * s, 0, 1));
      if (p.stage >= 3) {
        g.add(ball(0.4, leaf, 0.35, 1.35, 0.2, 1), ball(0.4, leaf, -0.35, 1.45, -0.1, 1));
        if (p.fruitTimerMs <= 0)
          for (let i = 0; i < 3; i++)
            g.add(
              ball(0.1, mat('#ff8a2a'), Math.cos(i * 2.1) * 0.5, 1.2, Math.sin(i * 2.1) * 0.5, 1),
            );
      }
    }
  } else if (p.stage >= 1) {
    const n = Math.min(p.stage + 1, 4);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const l = ball(
        0.12 + p.stage * 0.04,
        leaf,
        Math.cos(a) * 0.14,
        0.12 + p.stage * 0.06,
        Math.sin(a) * 0.14,
        0,
      );
      l.scale.y = 1.6;
      g.add(l);
    }
    if (p.ripe) g.add(ball(0.14, FLOWERS[4]!, 0, 0.42, 0, 1));
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return g;
}

const TILE_COLORS: Record<TileKind, string> = {
  grass: '#6aa84a',
  dirt: '#9a7448',
  water: '#4a9be0',
  flowers: '#7ab858',
  stone: '#a8a4a0',
};

export class Garden {
  readonly group = new THREE.Group();
  private sig = '';
  private checkedMs = -1e9;
  /** Pick targets: [object, pick kind, pick id, radius]. */
  private readonly picks: Array<[THREE.Object3D, GardenPickKind, string, number]> = [];

  constructor(parent: THREE.Object3D) {
    this.group.name = 'garden';
    parent.add(this.group);
  }

  /** Rebuild when the decor, plants or tiles change; cheap otherwise. */
  update(world: World, ground: Ground, nowMs: number, home: boolean): void {
    this.group.visible = home;
    if (!home || nowMs - this.checkedMs < 500) return;
    this.checkedMs = nowMs;
    const sig = [
      world.placed.map((d) => `${d.id}:${d.pos.x},${d.pos.z}`).join('|'),
      world.plants
        .map(
          (p) =>
            `${p.id}:${p.stage}:${p.ripe ? 1 : 0}:${p.water < 0.25 ? 1 : 0}:${p.fruitTimerMs <= 0 ? 1 : 0}`,
        )
        .join('|'),
      Object.entries(world.tiles)
        .map(([k, v]) => `${k}=${v}`)
        .join('|'),
      visibleStoryProps(world)
        .map((p) => p.id)
        .join('|'),
    ].join('#');
    if (sig === this.sig) return;
    this.sig = sig;
    this.rebuild(world, ground);
  }

  private rebuild(world: World, ground: Ground): void {
    for (const c of [...this.group.children]) {
      c.removeFromParent();
      disposeModel(c);
    }
    this.picks.length = 0;
    for (const d of world.placed) {
      const m = decorModel(d.kind);
      m.position.set(d.pos.x, ground(d.pos.x, d.pos.z), d.pos.z);
      this.group.add(m);
      const isBuilding = d.kind === 'nursery' || d.kind === 'bathhouse' || d.kind === 'workshop';
      this.picks.push([
        m,
        isBuilding ? 'building' : 'decor',
        isBuilding ? d.kind : d.id,
        isBuilding ? 2.2 : 0.55,
      ]);
    }
    for (const p of world.plants) {
      const m = plantModel(p);
      m.position.set(p.pos.x, ground(p.pos.x, p.pos.z), p.pos.z);
      this.group.add(m);
      this.picks.push([m, 'plant', p.id, p.kind === 'tree' ? 0.4 + p.stage * 0.3 : 0.45]);
    }
    for (const p of visibleStoryProps(world)) {
      const m = storyPropModel(p.kind);
      m.position.set(p.x, ground(p.x, p.z), p.z);
      this.group.add(m);
      const reach = p.kind === 'barn' ? 2 : p.kind === 'shed' ? 1.2 : 0.55;
      this.picks.push([m, 'storyProp', p.id, reach]);
    }
    this.buildTiles(world, ground);
  }

  /** Painted tiles: one instanced quad per tile kind, laid on the ground. */
  private buildTiles(world: World, ground: Ground): void {
    const byKind = new Map<TileKind, Array<[number, number]>>();
    for (const [key, kind] of Object.entries(world.tiles)) {
      const [x, z] = key.split(',').map(Number) as [number, number];
      const list = byKind.get(kind) ?? [];
      list.push([x, z]);
      byKind.set(kind, list);
    }
    const geo = new THREE.PlaneGeometry(0.5, 0.5);
    geo.rotateX(-Math.PI / 2);
    const m4 = new THREE.Matrix4();
    for (const [kind, cells] of byKind) {
      const material = mat(
        TILE_COLORS[kind],
        kind === 'water' ? { roughness: 0.1, metalness: 0.2 } : {},
      );
      const mesh = new THREE.InstancedMesh(geo, material, cells.length);
      cells.forEach(([x, z], i) =>
        mesh.setMatrixAt(i, m4.makeTranslation(x, ground(x, z) + 0.03, z)),
      );
      mesh.receiveShadow = true;
      this.group.add(mesh);
      if (kind === 'flowers') {
        const petals = new THREE.InstancedMesh(
          new THREE.IcosahedronGeometry(0.05, 0),
          FLOWERS[0]!,
          cells.length * 3,
        );
        const colorAt = new THREE.Color();
        cells.forEach(([x, z], i) => {
          for (let j = 0; j < 3; j++) {
            const dx = Math.sin(i * 7.1 + j * 2.3) * 0.18;
            const dz = Math.cos(i * 5.3 + j * 1.7) * 0.18;
            petals.setMatrixAt(i * 3 + j, m4.makeTranslation(x + dx, ground(x, z) + 0.1, z + dz));
            petals.setColorAt(i * 3 + j, colorAt.set(FLOWERS[(i + j) % FLOWERS.length]!.color));
          }
        });
        this.group.add(petals);
      }
    }
  }

  /** Where a plant or story prop stands and its reach, for the tap highlight. */
  spot(kind: string, id: string): { x: number; z: number; r: number } | null {
    if (!this.group.visible) return null;
    const p = this.picks.find(([, k, i]) => k === kind && i === id);
    return p ? { x: p[0].position.x, z: p[0].position.z, r: p[3] } : null;
  }

  pick(ray: THREE.Ray): { kind: GardenPickKind; id: string; d: number } | null {
    const sphere = new THREE.Sphere();
    const hit = new THREE.Vector3();
    let best: { kind: GardenPickKind; id: string; d: number } | null = null;
    if (!this.group.visible) return null;
    for (const [o, kind, id, r] of this.picks) {
      sphere.center.copy(o.position);
      sphere.center.y += r * 0.8;
      sphere.radius = r;
      if (!ray.intersectSphere(sphere, hit)) continue;
      const d = hit.distanceTo(ray.origin);
      if (!best || d < best.d) best = { kind, id, d };
    }
    return best;
  }
}
