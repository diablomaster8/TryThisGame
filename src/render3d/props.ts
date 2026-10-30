import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GROVE, LANTERN_POSTS } from '../config/tuning';
import { buildTree, pbr, repeatUv, shadowed, type Tex } from '../samples/aaa-kit';
import {
  bevelBox,
  buildingMaterial,
  buildSpills,
  Buckets,
  house,
  type LightSpill,
} from './building-kit';
import { treeOf, type GroveTree } from './crowns';
import { buildGroveGrass, type GroveGrass } from './grass';
import { groveHeight } from './terrain';
import { bridgeDeckTop } from '../sim/terrain';
import { BRIDGE_YAW } from '../config/tuning-sim';
import { addHull } from './toon-outline';
import { occluders } from './occluders';
import { buildWildGround, buildWildTrees, compactTree } from './wild';
import { buildOuterRing } from './outer-ring';

/**
 * The Grove's dressing in 3D, placed from the same GROVE numbers the pixel scenery
 * uses: the buildings (cottage, school, dojo, well, windmill), the big rocks, the
 * four lantern posts, the bridge over the inflow and the cave mouth in the north-west
 * hill. Each tappable piece carries `userData.pick`, the pixel picker's convention.
 * Art pass 2 builds them from the building kit (`building-kit.ts`): bevelled, trimmed,
 * toon-lit and merged by material, with pools of lamplight on the ground at night.
 */
export interface Lantern {
  id: string;
  x: number;
  z: number;
  glass: THREE.MeshStandardMaterial;
  /** Where its light shines from; the scene's lamp pool lights it at night. */
  light: THREE.Vector3;
  /** Its own materials, its foot and height: what the occluder fade needs (crowns.ts). */
  materials: THREE.Material[];
  foot: THREE.Vector3;
  height: number;
}

export interface GroveProps {
  group: THREE.Group;
  pickables: THREE.Object3D[];
  lanterns: Lantern[];
  /** The shared window glass, and where each window's light shines from at night. */
  windows: { material: THREE.MeshPhysicalMaterial; lights: THREE.Vector3[] };
  /** The pools of lamplight on the ground by windows, doors and lanterns (one mesh). */
  spills: THREE.Mesh;
  blades: THREE.Group;
  grass: GroveGrass;
}

/** The four lantern posts, in the pixel scene's places and with its ids. */
const LANTERNS = LANTERN_POSTS.map((p) => [p.x, p.z] as const);

function pick(o: THREE.Object3D, kind: string, id: string, into: THREE.Object3D[]): void {
  o.userData.pick = { kind, id };
  into.push(o);
}

/** The houses: footprint, wall height, plaster tone, shutter paint, roof shape. */
const HOUSES = [
  {
    id: 'cottage',
    w: 5.2,
    d: 4,
    h: 2.8,
    style: { wall: '#fff6ea', shutter: '#5f8f62', overhang: 0.5, pitch: 0.7, chimney: true },
  },
  {
    id: 'school',
    w: 4.6,
    d: 3.6,
    h: 2.6,
    style: { wall: '#f3e2c6', shutter: '#4f78a8', overhang: 0.45, pitch: 0.72 },
  },
  {
    id: 'dojo',
    w: 6.4,
    d: 4.8,
    h: 2.4,
    style: { wall: '#e6d0b4', shutter: '#b0453c', overhang: 0.85, pitch: 0.55 },
  },
] as const;

export function buildGroveProps(
  scene: THREE.Object3D,
  tex: Tex,
  time: { value: number },
): GroveProps {
  const group = new THREE.Group();
  group.name = 'props';
  scene.add(group);
  const pickables: THREE.Object3D[] = [];
  const windowMat = new THREE.MeshPhysicalMaterial({
    color: '#9ad0ff',
    emissive: '#ffb347',
    emissiveIntensity: 0,
    roughness: 0.1,
    clearcoat: 1,
  });
  const windowLights: THREE.Vector3[] = [];
  const spills: LightSpill[] = [];
  const b = GROVE.buildings;
  const kit = new Buckets();
  kit.material('roof', buildingMaterial(tex.roof, { color: '#e9cdb8', normal: 0.5 }), true);
  kit.material('timber', buildingMaterial(tex.wood, { color: '#7a5434', normal: 0.5 }));
  kit.material('stone', buildingMaterial(tex.cobble, { color: '#d8d2c8', normal: 0.5 }));
  kit.material('door', buildingMaterial(tex.wood, { color: '#9a6236', normal: 0.4 }));
  kit.material('glass', windowMat, false, false);
  kit.material('plank', buildingMaterial(tex.wood, { color: '#c49a68', normal: 0.4 }));
  kit.material('sail', buildingMaterial(tex.plaster, { color: '#f4eadb', normal: 0.2 }));
  kit.material('rock', buildingMaterial(tex.rock, { color: '#b8aea6', normal: 0.6 }), true);
  for (const hs of HOUSES) {
    const shutter = `shutter-${hs.id}`;
    kit.material(shutter, buildingMaterial(tex.wood, { color: hs.style.shutter, normal: 0.3 }));
    const at = b[hs.id];
    const walls = house(
      kit,
      buildingMaterial(tex.plaster, { color: hs.style.wall, normal: 0.3 }),
      shutter,
      { x: at.x, y: groveHeight(at.x, at.z), z: at.z },
      hs,
      hs.style,
      spills,
      windowLights,
    );
    group.add(walls);
    pick(walls, 'building', hs.id, pickables);
  }

  // The well: a bevelled stone ring (turned, so its lip is rounded), two posts, a little
  // roof with a ridge, a windlass and its bucket.
  {
    const y = groveHeight(b.well.x, b.well.z);
    // Outer wall up, over the rounded lip, inner wall down: lathe normals face out.
    const profile = [
      [1.08, -0.3],
      [1.08, 0.9],
      [1.0, 0.99],
      [0.9, 0.97],
      [0.84, 0.86],
      [0.84, -0.3],
    ].map(([r, h]) => new THREE.Vector2(r, h));
    const ringGeo = new THREE.LatheGeometry(profile, 24);
    const uv = ringGeo.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 4, uv.getY(i) * 1.2);
    const ring = new THREE.Mesh(
      ringGeo,
      buildingMaterial(tex.cobble, { color: '#e2dcd2', normal: 0.5 }),
    );
    ring.castShadow = ring.receiveShadow = true;
    addHull(ring);
    ring.position.set(b.well.x, y, b.well.z);
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 20),
      new THREE.MeshStandardMaterial({ color: '#0d1a2a' }),
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(b.well.x, y + 0.5, b.well.z);
    group.add(ring, water);
    const wx = b.well.x;
    const wz = b.well.z;
    for (const dx of [-0.95, 0.95])
      kit.add('timber', bevelBox(0.16, 2.1, 0.16, 0.04), { x: wx + dx, y: y + 1.05, z: wz });
    kit.add(
      'timber',
      new THREE.CylinderGeometry(0.07, 0.07, 1.9, 8),
      { x: wx, y: y + 1.45, z: wz },
      [0, 0, Math.PI / 2],
    );
    kit.add('door', new THREE.CylinderGeometry(0.18, 0.15, 0.3, 10, 1), {
      x: wx,
      y: y + 1.05,
      z: wz,
    });
    const a = Math.atan2(0.7, 0.9);
    const slope = Math.hypot(0.9, 0.7) + 0.3;
    for (const side of [-1, 1])
      kit.add(
        'roof',
        bevelBox(slope, 0.1, 1.8, 0.04),
        {
          x: wx + side * Math.cos(a) * slope * 0.5 + side * Math.sin(a) * 0.05,
          y: y + 2.1 + 0.7 - Math.sin(a) * slope * 0.5 + Math.cos(a) * 0.05,
          z: wz,
        },
        [0, 0, -side * a],
      );
    kit.add('timber', bevelBox(0.18, 0.14, 1.9, 0.04), { x: wx, y: y + 2.86, z: wz });
    pick(ring, 'building', 'well', pickables);
  }

  // The windmill: a tapered tower on a stone footing, a door and a window, a capped roof
  // with a rim, and four lattice sails on a hub that turn with the breeze.
  const blades = new THREE.Group();
  {
    const x = b.windmill.x;
    const z = b.windmill.z;
    const y = groveHeight(x, z);
    const tower = new THREE.Mesh(
      tileUv(new THREE.CylinderGeometry(1.1, 1.7, 5.2, 16), 3, 2),
      buildingMaterial(tex.plaster, { color: '#f3ebdd', normal: 0.3 }),
    );
    tower.castShadow = tower.receiveShadow = true;
    addHull(tower);
    tower.position.set(x, y + 2.6, z);
    group.add(tower);
    kit.add('stone', tileUv(new THREE.CylinderGeometry(1.82, 1.95, 0.9, 16), 4, 1), {
      x,
      y: y - 0.05,
      z,
    });
    kit.add('timber', new THREE.TorusGeometry(1.16, 0.09, 6, 20), { x, y: y + 5.15, z }, [
      Math.PI / 2,
      0,
      0,
    ]);
    kit.add('roof', tileUv(new THREE.ConeGeometry(1.5, 1.4, 16, 2), 3, 1), { x, y: y + 5.9, z });
    kit.add('timber', new THREE.SphereGeometry(0.14, 10, 8), { x, y: y + 6.66, z });
    kit.add('door', bevelBox(0.8, 1.5, 0.12, 0.03), { x, y: y + 0.75, z: z + 1.66 }, [-0.11, 0, 0]);
    kit.add('timber', plainFrame(1.0, 1.7), { x, y: y + 0.82, z: z + 1.68 }, [-0.11, 0, 0]);
    kit.add(
      'glass',
      new THREE.BoxGeometry(0.46, 0.56, 0.05),
      { x, y: y + 3.3, z: z + 1.34 },
      [-0.11, 0, 0],
    );
    kit.add('timber', plainFrame(0.6, 0.7), { x, y: y + 3.3, z: z + 1.36 }, [-0.11, 0, 0]);
    windowLights.push(new THREE.Vector3(x, y + 3.3, z + 2.2));
    spills.push({ x, z: z + 2.6, yaw: 0, size: 1.6 });
    // The sails: a spar, a cloth to one side, three cross bars; merged into one turning mesh.
    const sails = new Buckets();
    sails.material('plank', buildingMaterial(tex.wood, { color: '#a8784a', normal: 0.4 }));
    sails.material('sail', buildingMaterial(tex.plaster, { color: '#f4eadb', normal: 0.2 }));
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 4; i++) {
      m4.makeRotationZ((i / 4) * Math.PI * 2);
      sails.add(
        'plank',
        new THREE.BoxGeometry(0.1, 3.5, 0.1),
        { x: 0, y: 1.9, z: 0 },
        [0, 0, 0],
        m4,
      );
      sails.add(
        'sail',
        new THREE.BoxGeometry(0.52, 2.6, 0.03),
        { x: 0.32, y: 2.15, z: 0.04 },
        [0, 0, 0],
        m4,
      );
      for (const by of [1.0, 2.15, 3.3])
        sails.add(
          'plank',
          new THREE.BoxGeometry(0.7, 0.05, 0.06),
          { x: 0.3, y: by, z: 0.07 },
          [0, 0, 0],
          m4,
        );
    }
    sails.add('plank', new THREE.CylinderGeometry(0.26, 0.3, 0.4, 12), { x: 0, y: 0, z: 0 }, [
      Math.PI / 2,
      0,
      0,
    ]);
    sails.flush(blades);
    blades.position.set(x, y + 4.4, z + 1.3);
    group.add(blades);
    pick(tower, 'building', 'windmill', pickables);
  }

  // Rocks: a lumpy icosahedron each, sunk a little into the slope. Round 5 (phone perf): all
  // drawn as one merged mesh (one draw and one shadow draw, not one each); every rock keeps
  // an undrawn copy of itself for its tap and its halo.
  const rockGeos: THREE.BufferGeometry[] = [];
  const unseen = new THREE.MeshBasicMaterial({ visible: false });
  for (const [i, r] of GROVE.rocks.entries()) {
    const geo = new THREE.IcosahedronGeometry(r.r * 1.3, 1);
    const p = geo.attributes.position as THREE.BufferAttribute;
    for (let v = 0; v < p.count; v++) {
      const k = 0.85 + (((v * 7919) % 23) / 23) * 0.3;
      p.setXYZ(v, p.getX(v) * k, p.getY(v) * 0.75 * k, p.getZ(v) * k);
    }
    geo.computeVertexNormals();
    const rock = new THREE.Mesh(geo, unseen);
    rock.position.set(r.x, groveHeight(r.x, r.z) + r.r * 0.5, r.z);
    rock.rotation.y = i * 1.3;
    rock.updateMatrix();
    rockGeos.push(geo.clone().applyMatrix4(rock.matrix));
    group.add(rock);
    pick(rock, 'decor', `rock-${i + 1}`, pickables);
  }
  if (rockGeos.length) {
    const rocks = shadowed(
      new THREE.Mesh(mergeGeometries(rockGeos, false)!, pbr(tex.rock, { scale: 1.3 })),
    );
    rocks.name = 'grove-rocks';
    for (const g of rockGeos) g.dispose();
    group.add(rocks);
  }

  // Lantern posts: a footing stone, a bevelled post, a framed glass box that glows when
  // lit, a cap with an overhang and a finial, and its light. Each lantern has its own
  // materials (one program for all four), so one standing between the camera and the
  // Keeper or a Nubbin can thin out of the way on its own (review 2026-10-21, bug 10).
  const lanterns: Lantern[] = [];
  const postGeo = bevelBox(0.16, 2.0, 0.16, 0.04);
  LANTERNS.forEach(([x, z], i) => {
    const y = groveHeight(x, z);
    const own = new Buckets();
    const timber = buildingMaterial(tex.wood, { color: '#7a5434', normal: 0.5 });
    const roof = buildingMaterial(tex.roof, { color: '#e9cdb8', normal: 0.5 });
    const stone = buildingMaterial(tex.cobble, { color: '#d8d2c8', normal: 0.5 });
    own.material('timber', timber);
    own.material('roof', roof);
    own.material('stone', stone);
    // Round 5 (phone perf): the post goes in the lantern's own timber bucket, one draw less.
    own.add('timber', postGeo.clone(), { x, y: y + 1.0, z });
    own.add('stone', bevelBox(0.42, 0.3, 0.42, 0.05), { x, y: y + 0.05, z });
    // No transmission: one transmissive object makes the renderer draw the whole scene a
    // second time into a refraction target every frame (review C, item 6).
    const glass = new THREE.MeshStandardMaterial({
      color: '#ffe9b0',
      emissive: '#ffb347',
      emissiveIntensity: 0,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.32), glass);
    box.position.set(x, y + 2.1, z);
    for (const sx of [-1, 1])
      for (const sz of [-1, 1])
        own.add('timber', new THREE.BoxGeometry(0.05, 0.44, 0.05), {
          x: x + sx * 0.18,
          y: y + 2.1,
          z: z + sz * 0.18,
        });
    own.add('timber', bevelBox(0.44, 0.06, 0.44, 0.02), { x, y: y + 1.88, z });
    own.add('roof', new THREE.ConeGeometry(0.36, 0.26, 4), { x, y: y + 2.44, z }, [
      0,
      Math.PI / 4,
      0,
    ]);
    own.add('timber', new THREE.SphereGeometry(0.05, 8, 6), { x, y: y + 2.6, z });
    const light = new THREE.Vector3(x, y + 2.1, z);
    group.add(box);
    const id = `lantern-${i + 1}`;
    for (const part of own.flush(group).values()) pick(part, 'lantern', id, pickables);
    pick(box, 'lantern', id, pickables);
    lanterns.push({
      id,
      x,
      z,
      glass,
      light,
      materials: [timber, roof, stone, glass],
      foot: new THREE.Vector3(x, y, z),
      height: 2.7,
    });
    spills.push({ x, z, yaw: 0, size: 3.2 });
  });

  // The bridge: planks across the inflow where the path crosses it, each a little off
  // true, on two stringers, with posted rails.
  {
    const br = GROVE.bridge;
    const yaw = BRIDGE_YAW;
    // The deck the sim walks on (sim/terrain.ts): plank tops sit 0.09 above this frame.
    const y = bridgeDeckTop() - 0.09;
    const m4 = new THREE.Matrix4().compose(
      new THREE.Vector3(br.x, y, br.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0)),
      new THREE.Vector3(1, 1, 1),
    );
    for (let i = 0; i < 9; i++) {
      const jog = Math.sin(i * 2.7) * 0.05;
      kit.add(
        'plank',
        bevelBox(2.0 + jog, 0.1, 0.36, 0.03),
        { x: jog, y: 0.04, z: -1.62 + i * 0.405 },
        [0, jog, 0],
        m4,
      );
    }
    for (const side of [-1, 1]) {
      kit.add(
        'timber',
        new THREE.BoxGeometry(0.16, 0.2, 3.8),
        { x: side * 0.8, y: -0.1, z: 0 },
        [0, 0, 0],
        m4,
      );
      kit.add(
        'timber',
        bevelBox(0.1, 0.1, 3.7, 0.03),
        { x: side * 0.95, y: 0.55, z: 0 },
        [0, 0, 0],
        m4,
      );
      for (const pz of [-1.7, 0, 1.7])
        kit.add(
          'timber',
          bevelBox(0.13, 0.62, 0.13, 0.03),
          { x: side * 0.95, y: 0.26, z: pz },
          [0, 0, 0],
          m4,
        );
    }
  }

  // The cave mouth: a dark opening in the east face of the north-west hill, framed by an
  // arch of rough-cut stones.
  {
    const cx = -12.4;
    const cz = -13.6;
    const y = groveHeight(cx, cz);
    const mouth = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 24),
      new THREE.MeshBasicMaterial({ color: '#07070f' }),
    );
    mouth.position.set(cx + 0.4, y + 1.2, cz);
    mouth.rotation.y = Math.PI / 2;
    mouth.scale.y = 0.85;
    const stones: THREE.BufferGeometry[] = [];
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i / (n - 1)) * Math.PI;
      const g = new THREE.DodecahedronGeometry(0.5 + (i % 3) * 0.06, 0);
      g.scale(0.8, 1, 1.15);
      g.rotateX(a - Math.PI / 2);
      g.translate(0, Math.sin(a) * 1.8, Math.cos(a) * 1.8);
      stones.push(g);
    }
    for (const g of stones)
      for (const k of Object.keys(g.attributes))
        if (k !== 'position' && k !== 'normal' && k !== 'uv') g.deleteAttribute(k);
    const archGeo = mergeGeometries(stones, false)!;
    archGeo.computeVertexNormals();
    const arch = new THREE.Mesh(archGeo, kitMaterial(kit, 'rock'));
    arch.castShadow = arch.receiveShadow = true;
    arch.position.set(cx + 0.2, y + 0.9, cz);
    group.add(mouth, arch);
    pick(mouth, 'building', 'cave', pickables);
    pick(arch, 'building', 'cave', pickables);
  }

  kit.flush(group);
  const spillMesh = buildSpills(spills, groveHeight);
  spillMesh.visible = false;
  group.add(spillMesh);

  // Grass over the meadow, placed in a worker (`grass.ts`).
  const grass = buildGroveGrass(scene, tex, time);

  // R0018: the houses and the windmill thin out between the camera and the Keeper.
  occluders.clear('props');
  for (const hs of HOUSES) {
    const at = b[hs.id];
    const gy = groveHeight(at.x, at.z);
    const ov = hs.style.overhang + 0.2;
    occluders.add(
      'props',
      at.x,
      at.z,
      hs.w / 2 + ov,
      hs.d / 2 + ov,
      gy - 0.2,
      gy + hs.h * (1 + hs.style.pitch) + 1,
      gy + hs.h,
    );
  }
  {
    const wy = groveHeight(b.windmill.x, b.windmill.z);
    occluders.add('props', b.windmill.x, b.windmill.z, 2.1, 2.1, wy - 0.2, wy + 7.4, wy + 5.1);
  }
  occluders.patch(group);
  buildWildGround(group, tex);
  buildOuterRing(group, tex, pickables);

  return {
    group,
    pickables,
    lanterns,
    windows: { material: windowMat, lights: windowLights },
    spills: spillMesh,
    blades,
    grass,
  };
}

/** A bucket's material, for a piece that must stay its own (tappable) mesh. */
function kitMaterial(kit: Buckets, key: string): THREE.Material {
  return kit.materialOf(key);
}

/** Scale a geometry's UVs (cylinders and cones, whose UVs run 0..1 round and up). */
function tileUv(geo: THREE.BufferGeometry, u: number, v: number): THREE.BufferGeometry {
  return repeatUv(geo, u, v);
}

/** A door or window frame: two jambs and a lintel, centred, opening along y. */
function plainFrame(w: number, h: number): THREE.BufferGeometry {
  const parts = [
    new THREE.BoxGeometry(0.12, h, 0.1).translate(-w / 2, 0, 0),
    new THREE.BoxGeometry(0.12, h, 0.1).translate(w / 2, 0, 0),
    new THREE.BoxGeometry(w + 0.12, 0.12, 0.1).translate(0, h / 2, 0),
  ];
  const g = mergeGeometries(parts, false)!;
  for (const p of parts) p.dispose();
  return g;
}

/** The fruit trees, from the sim's tree list so taps reach the right id. */
export function buildGroveTrees(
  scene: THREE.Object3D,
  tex: Tex,
  trees: ReadonlyArray<{ id: string; pos: { x: number; z: number } }>,
  pickables: THREE.Object3D[],
  time?: { value: number },
): GroveTree[] {
  const made: GroveTree[] = [];
  trees.forEach((t, i) => {
    const parts = compactTree(
      scene,
      buildTree(scene, tex, t.pos.x, t.pos.z, 1.05, i + 1, groveHeight, time),
    );
    const trunk = parts[0];
    if (trunk) pick(trunk, 'tree', t.id, pickables);
    const tree = treeOf(parts);
    if (!tree) return;
    // The branches share the trunk's tap halo (the leaf cards sway in their shader, so a
    // copy would not follow them).
    for (const p of tree.inner) p.userData.halo = { kind: 'tree', id: t.id };
    made.push(tree);
  });
  made.push(...buildWildTrees(scene, tex, time));
  return made;
}
