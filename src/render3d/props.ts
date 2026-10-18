import * as THREE from 'three';
import { GROVE, LANTERN_POSTS } from '../config/tuning';
import { buildTree, pbr, repeatUv, shadowed, type Tex } from '../samples/aaa-kit';
import { treeOf, type GroveTree } from './crowns';
import { buildGroveGrass, type GroveGrass } from './grass';
import { groveHeight } from './terrain';

/**
 * The Grove's dressing in 3D, placed from the same GROVE numbers the pixel scenery
 * uses: the buildings (cottage, school, dojo, well, windmill), the big rocks, the
 * four lantern posts, the bridge over the inflow and the cave mouth in the north-west
 * hill. Each tappable piece carries `userData.pick`, the pixel picker's convention.
 */
export interface Lantern {
  id: string;
  x: number;
  z: number;
  glass: THREE.MeshStandardMaterial;
  /** Where its light shines from; the scene's lamp pool lights it at night. */
  light: THREE.Vector3;
}

export interface GroveProps {
  group: THREE.Group;
  pickables: THREE.Object3D[];
  lanterns: Lantern[];
  /** The shared window glass, and where each window's light shines from at night. */
  windows: { material: THREE.MeshPhysicalMaterial; lights: THREE.Vector3[] };
  blades: THREE.Group;
  grass: GroveGrass;
}

/** The four lantern posts, in the pixel scene's places and with its ids. */
const LANTERNS = LANTERN_POSTS.map((p) => [p.x, p.z] as const);

function pick(o: THREE.Object3D, kind: string, id: string, into: THREE.Object3D[]): void {
  o.userData.pick = { kind, id };
  into.push(o);
}

function roof(w: number, d: number, h: number, tex: Tex): THREE.Mesh {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2 - 0.4, 0);
  shape.lineTo(w / 2 + 0.4, 0);
  shape.lineTo(0, h);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d + 0.8, bevelEnabled: false });
  const p = geo.attributes.position as THREE.BufferAttribute;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    uv[i * 2] = p.getZ(i) / 1.8;
    uv[i * 2 + 1] = p.getX(i) / 1.8;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geo.computeVertexNormals();
  geo.translate(0, 0, -(d + 0.8) / 2);
  return shadowed(new THREE.Mesh(geo, pbr(tex.roof, { scale: 1.1 })));
}

/** A plastered house of the given footprint; windows share one material so lamps toggle at once. */
function house(
  group: THREE.Group,
  tex: Tex,
  x: number,
  z: number,
  w: number,
  d: number,
  h: number,
  windowMat: THREE.MeshPhysicalMaterial,
  windowLights: THREE.Vector3[],
  wallColor = '#ffffff',
): THREE.Mesh {
  const y = groveHeight(x, z);
  const walls = shadowed(
    new THREE.Mesh(
      repeatUv(new THREE.BoxGeometry(w, h, d), 2, 1),
      pbr(tex.plaster, { scale: 0.5, color: wallColor }),
    ),
  );
  walls.position.set(x, y + h / 2, z);
  const top = roof(w, d, h * 0.7, tex);
  top.position.set(x, y + h, z);
  const door = shadowed(
    new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.12), pbr(tex.wood, { color: '#8a5a32' })),
  );
  door.position.set(x, y + 0.8, z + d / 2 + 0.02);
  group.add(walls, top, door);
  for (const dx of [-w * 0.3, w * 0.3]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.1), windowMat);
    win.position.set(x + dx, y + h * 0.55, z + d / 2 + 0.02);
    group.add(win);
    windowLights.push(new THREE.Vector3(x + dx, y + h * 0.55, z + d / 2 + 0.9));
  }
  return walls;
}

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
  const b = GROVE.buildings;

  // Buildings.
  const cottage = house(group, tex, b.cottage.x, b.cottage.z, 5.2, 4, 2.8, windowMat, windowLights);
  pick(cottage, 'building', 'cottage', pickables);
  const school = house(
    group,
    tex,
    b.school.x,
    b.school.z,
    4.6,
    3.6,
    2.6,
    windowMat,
    windowLights,
    '#f3e2c6',
  );
  pick(school, 'building', 'school', pickables);
  const dojo = house(
    group,
    tex,
    b.dojo.x,
    b.dojo.z,
    6.4,
    4.8,
    2.4,
    windowMat,
    windowLights,
    '#d9c2a8',
  );
  pick(dojo, 'building', 'dojo', pickables);

  // The well: a cobbled ring, two posts and a little roof.
  {
    const y = groveHeight(b.well.x, b.well.z);
    const ring = shadowed(
      new THREE.Mesh(
        repeatUv(new THREE.CylinderGeometry(0.9, 1.0, 0.9, 16, 1, true), 3, 1),
        pbr(tex.cobble, { scale: 1.2 }),
      ),
    );
    (ring.material as THREE.Material).side = THREE.DoubleSide;
    ring.position.set(b.well.x, y + 0.45, b.well.z);
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 16),
      new THREE.MeshStandardMaterial({ color: '#0d1a2a' }),
    );
    water.rotation.x = -Math.PI / 2;
    water.position.set(b.well.x, y + 0.5, b.well.z);
    group.add(ring, water);
    for (const dx of [-0.8, 0.8]) {
      const post = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.0, 0.14), pbr(tex.wood)));
      post.position.set(b.well.x + dx, y + 1.0, b.well.z);
      group.add(post);
    }
    const top = roof(1.8, 1.4, 0.7, tex);
    top.position.set(b.well.x, y + 2.0, b.well.z);
    group.add(top);
    pick(ring, 'building', 'well', pickables);
  }

  // The windmill: a tapered tower and four sails that turn with the breeze.
  const blades = new THREE.Group();
  {
    const y = groveHeight(b.windmill.x, b.windmill.z);
    const tower = shadowed(
      new THREE.Mesh(
        repeatUv(new THREE.CylinderGeometry(1.1, 1.7, 5.2, 10), 2, 2),
        pbr(tex.plaster, { scale: 0.5, color: '#efe6d6' }),
      ),
    );
    tower.position.set(b.windmill.x, y + 2.6, b.windmill.z);
    const cap = shadowed(new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.2, 10), pbr(tex.roof)));
    cap.position.set(b.windmill.x, y + 5.8, b.windmill.z);
    group.add(tower, cap);
    for (let i = 0; i < 4; i++) {
      const sail = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.2, 0.06), pbr(tex.wood)));
      sail.position.y = 1.7;
      const arm = new THREE.Group();
      arm.rotation.z = (i / 4) * Math.PI * 2;
      arm.add(sail);
      blades.add(arm);
    }
    blades.position.set(b.windmill.x, y + 4.4, b.windmill.z + 1.3);
    group.add(blades);
    pick(tower, 'building', 'windmill', pickables);
  }

  // Rocks: a lumpy icosahedron each, sunk a little into the slope.
  for (const [i, r] of GROVE.rocks.entries()) {
    const geo = new THREE.IcosahedronGeometry(r.r * 1.3, 1);
    const p = geo.attributes.position as THREE.BufferAttribute;
    for (let v = 0; v < p.count; v++) {
      const k = 0.85 + (((v * 7919) % 23) / 23) * 0.3;
      p.setXYZ(v, p.getX(v) * k, p.getY(v) * 0.75 * k, p.getZ(v) * k);
    }
    geo.computeVertexNormals();
    const rock = shadowed(new THREE.Mesh(geo, pbr(tex.rock, { scale: 1.3 })));
    rock.position.set(r.x, groveHeight(r.x, r.z) + r.r * 0.5, r.z);
    rock.rotation.y = i * 1.3;
    group.add(rock);
    pick(rock, 'decor', `rock-${i + 1}`, pickables);
  }

  // Lantern posts: a wooden post, a glass box that glows when lit, and its light.
  const lanterns: Lantern[] = [];
  LANTERNS.forEach(([x, z], i) => {
    const y = groveHeight(x, z);
    const post = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.0, 0.14), pbr(tex.wood)));
    post.position.set(x, y + 1.0, z);
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
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.36), glass);
    box.position.set(x, y + 2.1, z);
    const cap = shadowed(new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.25, 4), pbr(tex.roof)));
    cap.position.set(x, y + 2.42, z);
    cap.rotation.y = Math.PI / 4;
    const light = new THREE.Vector3(x, y + 2.1, z);
    group.add(post, box, cap);
    const id = `lantern-${i + 1}`;
    pick(post, 'lantern', id, pickables);
    pick(box, 'lantern', id, pickables);
    lanterns.push({ id, x, z, glass, light });
  });

  // The bridge: planks across the inflow where the path crosses it.
  {
    const br = GROVE.bridge;
    const deck = shadowed(
      new THREE.Mesh(repeatUv(new THREE.BoxGeometry(2.0, 0.18, 3.6), 1, 3), pbr(tex.wood)),
    );
    deck.position.set(br.x, groveHeight(br.x, br.z) + 0.55, br.z);
    deck.rotation.y = Math.atan2(14 - 4, -5 - 1) + Math.PI / 2;
    group.add(deck);
    for (const side of [-1, 1]) {
      const rail = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 3.6), pbr(tex.wood)));
      rail.position.set(0.95 * side, 0.3, 0);
      deck.add(rail);
    }
  }

  // The cave mouth: a dark opening in the east face of the north-west hill, under an arch.
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
    const arch = shadowed(
      new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.45, 8, 16, Math.PI),
        pbr(tex.rock, { scale: 1.3 }),
      ),
    );
    arch.position.set(cx + 0.2, y + 1.0, cz);
    arch.rotation.y = Math.PI / 2;
    group.add(mouth, arch);
    pick(mouth, 'building', 'cave', pickables);
    pick(arch, 'building', 'cave', pickables);
  }

  // Grass over the meadow, placed in a worker (`grass.ts`).
  const grass = buildGroveGrass(scene, tex, time);

  return {
    group,
    pickables,
    lanterns,
    windows: { material: windowMat, lights: windowLights },
    blades,
    grass,
  };
}

/** The fruit trees, from the sim's tree list so taps reach the right id. */
export function buildGroveTrees(
  scene: THREE.Object3D,
  tex: Tex,
  trees: ReadonlyArray<{ id: string; pos: { x: number; z: number } }>,
  pickables: THREE.Object3D[],
): GroveTree[] {
  const made: GroveTree[] = [];
  trees.forEach((t, i) => {
    const parts = buildTree(scene, tex, t.pos.x, t.pos.z, 1.05, i + 1, groveHeight);
    const trunk = parts[0];
    if (trunk) pick(trunk, 'tree', t.id, pickables);
    const tree = treeOf(parts);
    if (!tree) return;
    // The branches share the trunk's tap halo (the leaf cards sway in their shader, so a
    // copy would not follow them).
    for (const p of tree.inner) p.userData.halo = { kind: 'tree', id: t.id };
    made.push(tree);
  });
  return made;
}
