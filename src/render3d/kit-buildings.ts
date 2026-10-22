import * as THREE from 'three';
import type { Tex } from '../samples/aaa-kit';
import { bevelBox, buildingMaterial, Buckets, house, type LightSpill } from './building-kit';

/**
 * The garden's and the side stories' buildings built from the Grove's building kit (review
 * 2026-10-21, bug 15): the nursery, bathhouse and workshop as kit houses, and the shed and
 * barn as plank cabins with a stone footing, timber corners, a pitched roof and a framed
 * door, all on the painted, toon-lit materials the cottage wears. They were plain boxes.
 * The materials are made once per texture set and kept for the page's life (`SHARED`), so
 * a rebuilt garden makes none; each building is a handful of merged meshes.
 */
export type KitKey = 'roof' | 'timber' | 'stone' | 'glass' | 'door' | 'plank' | 'shutter' | 'wall';

const KITS = new WeakMap<Tex, Record<KitKey, THREE.Material>>();
/** Every material made here, so `disposeModel` leaves them alone. */
export const KIT_SHARED = new Set<THREE.Material>();

export function kitMaterials(tex: Tex): Record<KitKey, THREE.Material> {
  let k = KITS.get(tex);
  if (k) return k;
  k = {
    roof: buildingMaterial(tex.roof, { color: '#e9cdb8', normal: 0.5 }),
    timber: buildingMaterial(tex.wood, { color: '#7a5434', normal: 0.5 }),
    stone: buildingMaterial(tex.cobble, { color: '#d8d2c8', normal: 0.5 }),
    door: buildingMaterial(tex.wood, { color: '#9a6236', normal: 0.4 }),
    plank: buildingMaterial(tex.wood, { color: '#c49a68', normal: 0.4 }),
    shutter: buildingMaterial(tex.wood, { color: '#5a8a6a', normal: 0.3 }),
    wall: buildingMaterial(tex.plaster, { color: '#f3ebdd', normal: 0.3 }),
    glass: new THREE.MeshStandardMaterial({
      color: '#9ad0ff',
      emissive: '#ffb347',
      emissiveIntensity: 0.4,
      roughness: 0.15,
    }),
  };
  for (const m of Object.values(k)) KIT_SHARED.add(m);
  KITS.set(tex, k);
  return k;
}

/** Roof tints by colour, for the page's life. */
const ROOFS = new Map<string, THREE.Material>();

function buckets(m: Record<KitKey, THREE.Material>, roof?: THREE.Material): Buckets {
  const kit = new Buckets();
  kit.material('roof', roof ?? m.roof);
  kit.material('timber', m.timber);
  kit.material('stone', m.stone);
  kit.material('glass', m.glass, false, false);
  kit.material('door', m.door);
  kit.material('plank', m.plank);
  kit.material('shutter', m.shutter);
  return kit;
}

/**
 * A kit house of the garden's sizes (the pixel ones): `width` across the front, its roof
 * tinted `roofColor` over the painted tiles. Origin at its foot, door toward +z.
 */
export function kitHouse(tex: Tex, width: number, roofColor: string): THREE.Group {
  const m = kitMaterials(tex);
  let roof = ROOFS.get(roofColor);
  if (!roof) {
    roof = buildingMaterial(tex.roof, { color: roofColor, normal: 0.5 });
    KIT_SHARED.add(roof);
    ROOFS.set(roofColor, roof);
  }
  const g = new THREE.Group();
  const kit = buckets(m, roof);
  const spills: LightSpill[] = [];
  const lights: THREE.Vector3[] = [];
  const walls = house(
    kit,
    m.wall,
    'shutter',
    { x: 0, y: 0, z: 0 },
    { w: width, d: width * 0.7, h: width * 0.45 },
    { wall: '#f3ebdd', shutter: '#5a8a6a', overhang: 0.35, pitch: 0.55 },
    spills,
    lights,
  );
  g.add(walls);
  kit.flush(g);
  return g;
}

/**
 * A plank cabin `w` × `d`, walls `h` high: the shed (with a lit window) and the barn (a
 * wide door). Origin at its foot, door toward +z.
 */
export function kitCabin(
  tex: Tex,
  size: { w: number; d: number; h: number },
  o: { window: boolean; doorW: number },
): THREE.Group {
  const m = kitMaterials(tex);
  const { w, d, h } = size;
  const g = new THREE.Group();
  const kit = buckets(m);
  // Walls of planks, on a stone footing.
  const body = new THREE.Mesh(bevelBox(w, h, d, 0.05, 1.2), m.plank);
  body.position.y = h / 2;
  body.castShadow = body.receiveShadow = true;
  g.add(body);
  kit.add('stone', bevelBox(w + 0.16, 0.24, d + 0.16, 0.04, 1), { x: 0, y: 0.06, z: 0 });
  // Timber corner posts and an eave band.
  const t = 0.12;
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      kit.add('timber', new THREE.BoxGeometry(t, h, t), {
        x: (sx * w) / 2,
        y: h / 2,
        z: (sz * d) / 2,
      });
  for (const sz of [-1, 1])
    kit.add('timber', new THREE.BoxGeometry(w + t, 0.12, t), {
      x: 0,
      y: h - 0.06,
      z: (sz * d) / 2,
    });
  // A pitched roof: two slabs meeting at a ridge along the depth, with gables of plank.
  const rise = h * 0.45;
  const over = 0.22;
  const a = Math.atan2(rise, w / 2);
  const slope = Math.hypot(w / 2, rise) + over;
  for (const side of [-1, 1])
    kit.add(
      'roof',
      bevelBox(slope, 0.12, d + over * 2, 0.04),
      {
        x: side * Math.cos(a) * slope * 0.5 + side * Math.sin(a) * 0.06,
        y: h + rise - Math.sin(a) * slope * 0.5 + Math.cos(a) * 0.06,
        z: 0,
      },
      [0, 0, -side * a],
    );
  kit.add('timber', bevelBox(0.18, 0.14, d + over * 2 + 0.06, 0.04), {
    x: 0,
    y: h + rise + 0.08,
    z: 0,
  });
  const tri = new THREE.Shape();
  tri.moveTo(-w / 2, 0);
  tri.lineTo(w / 2, 0);
  tri.lineTo(0, rise);
  tri.closePath();
  const gable = new THREE.ExtrudeGeometry(tri, { depth: d - 0.02, bevelEnabled: false });
  gable.translate(0, h, -(d - 0.02) / 2);
  const gables = new THREE.Mesh(gable, m.plank);
  gables.castShadow = true;
  g.add(gables);
  // The door in a frame, and a window with a cross and a sill.
  const fz = d / 2;
  const dh = Math.min(h * 0.78, 1.7);
  const dx = o.window ? w * 0.18 : 0;
  kit.add('door', bevelBox(o.doorW, dh, 0.08, 0.03), { x: dx, y: dh / 2, z: fz + 0.02 });
  kit.add('timber', new THREE.BoxGeometry(o.doorW + 0.2, 0.12, 0.12), {
    x: dx,
    y: dh + 0.06,
    z: fz + 0.04,
  });
  for (const s of [-1, 1])
    kit.add('timber', new THREE.BoxGeometry(0.1, dh, 0.12), {
      x: dx + (s * (o.doorW + 0.1)) / 2,
      y: dh / 2,
      z: fz + 0.04,
    });
  if (o.window) {
    const wx = -w * 0.25;
    const wy = h * 0.55;
    kit.add('glass', new THREE.BoxGeometry(0.4, 0.36, 0.04), { x: wx, y: wy, z: fz + 0.01 });
    kit.add('timber', new THREE.BoxGeometry(0.52, 0.06, 0.1), {
      x: wx,
      y: wy + 0.21,
      z: fz + 0.03,
    });
    kit.add('timber', new THREE.BoxGeometry(0.06, 0.46, 0.1), {
      x: wx - 0.23,
      y: wy,
      z: fz + 0.03,
    });
    kit.add('timber', new THREE.BoxGeometry(0.06, 0.46, 0.1), {
      x: wx + 0.23,
      y: wy,
      z: fz + 0.03,
    });
    kit.add('timber', new THREE.BoxGeometry(0.04, 0.36, 0.06), { x: wx, y: wy, z: fz + 0.04 });
    kit.add('stone', bevelBox(0.6, 0.07, 0.16, 0.02), { x: wx, y: wy - 0.22, z: fz + 0.06 });
  }
  kit.flush(g);
  return g;
}
