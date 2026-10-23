import { npcLookOf, type NpcLook } from '../config/npc-looks';
import { V, type Prim } from '../samples/sculpted';
import type { SpeciesSpec } from '../samples/species';

/**
 * H12 in Full 3D: a named Keeper's silhouette prop, as extra primitives on the existing
 * Keeper rig (no new meshes, no new bones): Corvin's long coat flares from the shoulders to
 * the knee, Marina's bucket hangs from the right hand, Fern's satchel crosses the chest to
 * a hip bag, Hazel's shawl drapes over the shoulders (her smaller height is the crowd's, via `NpcLook.scale`). It runs
 * inside `specForKey`, so the sculpt worker builds the same figure from the look key, and
 * the pool files each dressed Keeper under its own key.
 *
 * Also holds M6's seat: the Nubbin the scene seats this frame (set by the 3D dressing,
 * read by the Nubbin poser), since the poser has no stage of its own.
 */
export const stagedSeat: { id: string | null } = { id: null };

type Box = [ReturnType<typeof V>, ReturnType<typeof V>];

const ell = (
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  color: string,
  tag: string,
): Prim => ({
  kind: 'ellipsoid',
  a: V(x, y, z),
  radii: V(rx, ry, rz),
  r: 0,
  color,
  tag,
});

const cap = (
  a: ReturnType<typeof V>,
  b: ReturnType<typeof V>,
  r: number,
  color: string,
  tag: string,
): Prim => ({
  kind: 'capsule',
  a,
  b,
  r,
  color,
  tag,
});

/** Widen the torso's sculpt box so the new prims are not clipped. */
function widenTorso(spec: SpeciesSpec, x: number, yLow: number): void {
  const box = spec.torso.box as Box;
  spec.torso.box = [V(-x, Math.min(box[0].y, yLow), -x), V(x, box[1].y, x)];
}

function addCoat(spec: SpeciesSpec, look: NpcLook): void {
  const { main, trim } = look;
  spec.torso.prims.push(
    // The skirt: a wide flare to the knee, deeper behind than in front.
    ell(0, 0.78, 0, 0.8, 0.72, 0.68, main, 'coat'),
    ell(0, 0.72, -0.42, 0.5, 0.62, 0.3, trim, 'coat'),
    // The body of the coat over the tee, and a high collar.
    ell(0, 1.72, -0.02, 0.66, 0.52, 0.56, main, 'coat'),
    ell(0, 2.12, -0.05, 0.52, 0.17, 0.5, trim, 'coat'),
  );
  widenTorso(spec, 1.0, 0.1);
  // The vest, badge and collar marks belong to the tee; the coat covers them.
  spec.marks = spec.marks.filter((m) => !(m.a.y > 1.2 && m.a.y < 2.3 && Math.abs(m.a.x) < 0.75));
}

function addBucket(spec: SpeciesSpec, look: NpcLook): void {
  const arm = spec.parts.find((p) => p.name === 'armR');
  if (!arm?.joint) return;
  const hand = V(1.01, 0.93, 0.25);
  arm.joint.prims.push(
    ell(1.04, 0.5, 0.25, 0.27, 0.21, 0.27, look.main, 'bucket'),
    ell(1.04, 0.69, 0.25, 0.3, 0.05, 0.3, look.trim, 'bucket'),
    cap(hand, V(0.78, 0.68, 0.25), 0.03, look.trim, 'bucket'),
    cap(hand, V(1.3, 0.68, 0.25), 0.03, look.trim, 'bucket'),
  );
  const box = arm.joint.box;
  arm.joint.box = [V(0.1, 0.2, -0.4), V(1.6, box[1].y, 0.9)];
}

function addSatchel(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(-0.76, 0.8, -0.12, 0.25, 0.3, 0.3, look.main, 'satchel'),
    ell(-0.76, 1.04, -0.12, 0.27, 0.1, 0.33, look.trim, 'satchel'),
    // The strap, across the chest from the right shoulder to the left hip.
    cap(V(0.4, 2.0, 0.42), V(-0.62, 1.1, 0.4), 0.06, look.trim, 'satchel'),
    cap(V(0.4, 2.0, -0.4), V(-0.62, 1.1, -0.34), 0.06, look.trim, 'satchel'),
  );
  widenTorso(spec, 1.15, 0.3);
}

function addShawl(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(0, 1.98, -0.02, 0.84, 0.32, 0.62, look.main, 'shawl'),
    ell(0, 1.42, -0.4, 0.64, 0.64, 0.22, look.main, 'shawl'),
    cap(V(0.4, 2.0, 0.46), V(0.3, 1.1, 0.52), 0.1, look.trim, 'shawl'),
    cap(V(-0.4, 2.0, 0.46), V(-0.3, 1.1, 0.52), 0.1, look.main, 'shawl'),
  );
  widenTorso(spec, 1.0, 0.5);
}

/** Widen the torso's or head's sculpt box to hold new prims (never shrinks it). */
function growBox(
  part: { box: unknown },
  min: [number, number, number],
  max: [number, number, number],
): void {
  const box = part.box as Box;
  part.box = [
    V(Math.min(box[0].x, min[0]), Math.min(box[0].y, min[1]), Math.min(box[0].z, min[2])),
    V(Math.max(box[1].x, max[0]), Math.max(box[1].y, max[1]), Math.max(box[1].z, max[2])),
  ];
}

const sph = (x: number, y: number, z: number, r: number, color: string, tag: string): Prim => ({
  kind: 'sphere',
  a: V(x, y, z),
  r,
  color,
  tag,
});

/** M1 Sparks: big round lenses over the eyes on a strap round the head. */
function addGoggles(spec: SpeciesSpec, look: NpcLook): void {
  spec.head.prims.push(
    { kind: 'torus', a: V(0, 2.66, -0.02), r: 0.66, r2: 0.05, color: look.main, tag: 'goggles' },
    sph(-0.26, 2.66, 0.6, 0.2, look.main, 'goggles'),
    sph(0.26, 2.66, 0.6, 0.2, look.main, 'goggles'),
    sph(-0.26, 2.66, 0.74, 0.12, look.trim, 'lens'),
    sph(0.26, 2.66, 0.74, 0.12, look.trim, 'lens'),
  );
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.1, 3.8, 1.1]);
}

/** M1 Pixel: a band over the crown and a big cup over each ear. */
function addHeadphones(spec: SpeciesSpec, look: NpcLook): void {
  const band: Array<[number, number, number]> = [
    [-0.74, 2.7, 0],
    [-0.62, 3.25, 0],
    [0, 3.6, 0],
    [0.62, 3.25, 0],
    [0.74, 2.7, 0],
  ];
  for (let i = 0; i < band.length - 1; i++)
    spec.head.prims.push(cap(V(...band[i]!), V(...band[i + 1]!), 0.07, look.trim, 'headphones'));
  for (const sx of [-1, 1])
    spec.head.prims.push(ell(sx * 0.76, 2.58, 0, 0.17, 0.3, 0.3, look.main, 'headphones'));
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.1, 3.9, 1.1]);
}

/** M1 Luna: a scarf wound at the neck with one long tail to the knee. */
function addScarf(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(0, 2.04, 0.02, 0.52, 0.15, 0.5, look.main, 'scarf'),
    cap(V(0.32, 2.0, 0.5), V(0.38, 0.62, 0.54), 0.11, look.main, 'scarf'),
    ell(0.38, 0.55, 0.54, 0.13, 0.08, 0.06, look.trim, 'scarf'),
  );
  growBox(spec.torso, [-1, 0.4, -1], [1, 2.5, 1]);
}

/** M1 Ember, C2 Hob: a bib apron to the knee, a pocket and cross straps. */
function addApron(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(0, 1.3, 0.38, 0.42, 0.82, 0.13, look.main, 'apron'),
    ell(0, 0.92, 0.5, 0.22, 0.12, 0.07, look.trim, 'apron'),
    cap(V(-0.3, 2.05, 0.4), V(-0.16, 1.9, 0.5), 0.045, look.trim, 'apron'),
    cap(V(0.3, 2.05, 0.4), V(0.16, 1.9, 0.5), 0.045, look.trim, 'apron'),
  );
  growBox(spec.torso, [-1, 0.4, -1], [1, 2.5, 1]);
}

/** M1 Byte: a cap with a long peak. */
function addCap(spec: SpeciesSpec, look: NpcLook): void {
  spec.head.prims.push(
    ell(0, 3.0, -0.05, 0.7, 0.36, 0.66, look.main, 'cap'),
    ell(0, 2.95, 0.78, 0.46, 0.05, 0.46, look.trim, 'cap'),
    ell(0, 3.06, 0.2, 0.72, 0.05, 0.7, look.trim, 'cap'),
  );
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.1, 3.9, 1.3]);
}

/** M1 Dusty: a hat brim wider than the shoulders. */
function addWideHat(spec: SpeciesSpec, look: NpcLook): void {
  spec.head.prims.push(
    ell(0, 3.0, 0, 1.4, 0.07, 1.4, look.main, 'widehat'),
    ell(0, 3.3, 0, 0.64, 0.36, 0.62, look.main, 'widehat'),
    ell(0, 3.1, 0, 0.67, 0.07, 0.65, look.trim, 'widehat'),
  );
  growBox(spec.head, [-1.6, 1.8, -1.6], [1.6, 4.0, 1.6]);
}

/** M1 Nova: a big messenger bag on the right hip, strap over the left shoulder. */
function addSling(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(0.72, 0.95, -0.05, 0.28, 0.36, 0.42, look.main, 'sling'),
    ell(0.72, 1.24, -0.05, 0.3, 0.1, 0.44, look.trim, 'sling'),
    cap(V(-0.4, 2.0, 0.42), V(0.66, 1.2, 0.4), 0.06, look.trim, 'sling'),
    cap(V(-0.4, 2.0, -0.4), V(0.66, 1.2, -0.36), 0.06, look.trim, 'sling'),
  );
  growBox(spec.torso, [-1.1, 0.3, -1.1], [1.15, 2.5, 1.1]);
}

/** M1 Clover: a wide basket of flowers on the left arm (round, low and open). */
function addBasket(spec: SpeciesSpec, look: NpcLook): void {
  const arm = spec.parts.find((p) => p.name === 'armL');
  if (!arm?.joint) return;
  const hand = V(-1.01, 0.93, 0.25);
  arm.joint.prims.push(
    ell(-1.04, 0.55, 0.25, 0.36, 0.2, 0.36, look.main, 'basket'),
    ell(-1.04, 0.72, 0.25, 0.4, 0.05, 0.4, look.main, 'basket'),
    sph(-1.12, 0.82, 0.18, 0.1, look.trim, 'flower'),
    sph(-0.96, 0.84, 0.32, 0.1, '#ffd166', 'flower'),
    sph(-1.04, 0.82, 0.25, 0.09, '#ffffff', 'flower'),
    cap(hand, V(-1.38, 0.74, 0.25), 0.03, '#5a3c22', 'basket'),
  );
  const box = arm.joint.box;
  arm.joint.box = [V(-1.7, 0.2, -0.4), V(-0.1, box[1].y, 0.9)];
}

/** C2 Vane: a notebook hung from the belt on a cord, a pencil behind the ear. */
function addNotebook(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(-0.72, 0.9, 0.14, 0.1, 0.3, 0.24, look.main, 'notebook'),
    ell(-0.64, 0.9, 0.14, 0.05, 0.26, 0.2, look.trim, 'notebook'),
    cap(V(-0.42, 1.35, 0.2), V(-0.7, 1.2, 0.16), 0.03, '#5a3c22', 'notebook'),
  );
  spec.head.prims.push(cap(V(0.64, 2.75, 0), V(0.86, 3.2, -0.06), 0.045, '#ffd166', 'pencil'));
  growBox(spec.torso, [-1.1, 0.4, -1], [1, 2.5, 1]);
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.1, 3.8, 1.1]);
}

/** C2 Marigold: a big flower pinned over one ear. */
function addBloom(spec: SpeciesSpec, look: NpcLook): void {
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    spec.head.prims.push(
      sph(-0.58 + Math.cos(a) * 0.2, 3.0 + Math.sin(a) * 0.2, 0.36, 0.15, look.main, 'bloom'),
    );
  }
  spec.head.prims.push(sph(-0.58, 3.0, 0.4, 0.13, look.trim, 'bloom'));
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.1, 3.8, 1.1]);
}

/** C2 Ash: a cape over the shoulders that hangs behind to the knee, with a clasp. */
function addCloak(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(0, 1.92, 0, 0.84, 0.3, 0.62, look.main, 'cloak'),
    ell(0, 1.18, -0.42, 0.78, 1.0, 0.26, look.main, 'cloak'),
    ell(0, 2.06, 0.02, 0.52, 0.12, 0.5, look.trim, 'cloak'),
    sph(0, 1.9, 0.55, 0.08, look.trim, 'cloak'),
  );
  growBox(spec.torso, [-1, 0.1, -1], [1, 2.5, 1]);
}

/** C2 Vask: a map tube slung across the back, its capped ends over each shoulder. */
function addScroll(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    cap(V(0.55, 2.2, -0.48), V(-0.52, 0.85, -0.52), 0.13, look.main, 'scroll'),
    sph(0.55, 2.2, -0.48, 0.16, look.trim, 'scroll'),
    sph(-0.52, 0.85, -0.52, 0.16, look.trim, 'scroll'),
    cap(V(0.4, 2.0, 0.42), V(-0.4, 1.1, 0.44), 0.05, look.trim, 'scroll'),
  );
  growBox(spec.torso, [-1, 0.6, -1], [1, 2.6, 1]);
}

/** C2 Ida: a broom shouldered, its bristles above the head. */
function addBroom(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(cap(V(0.7, 0.9, -0.3), V(0.96, 2.5, -0.28), 0.05, look.main, 'broom'));
  spec.head.prims.push(
    cap(V(0.96, 2.5, -0.28), V(1.04, 3.7, -0.26), 0.05, look.main, 'broom'),
    ell(1.06, 3.9, -0.26, 0.2, 0.28, 0.2, look.trim, 'broom'),
  );
  growBox(spec.torso, [-1, 0.4, -1], [1.2, 2.6, 1]);
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.4, 4.4, 1.1]);
}

/** C2 Sorrel: a tinker's bundle on the back with a pot hung from it. */
function addPack(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(0, 1.7, -0.66, 0.62, 0.58, 0.44, look.main, 'pack'),
    ell(0, 2.3, -0.58, 0.52, 0.16, 0.22, look.trim, 'pack'),
    sph(0.5, 1.15, -0.78, 0.2, look.trim, 'pot'),
    cap(V(-0.36, 2.05, 0.4), V(0.2, 1.1, 0.44), 0.05, '#5a3c22', 'pack'),
  );
  growBox(spec.torso, [-1, 0.7, -1.2], [1, 2.6, 1]);
}

/** C2 Juno: a tall backpack with a flap and a pocket, straps over the shoulders. */
function addBackpack(spec: SpeciesSpec, look: NpcLook): void {
  spec.torso.prims.push(
    ell(0, 1.62, -0.62, 0.52, 0.66, 0.36, look.main, 'backpack'),
    ell(0, 2.18, -0.62, 0.52, 0.15, 0.38, look.trim, 'backpack'),
    ell(0, 1.25, -0.94, 0.34, 0.22, 0.12, look.trim, 'backpack'),
    cap(V(-0.34, 2.14, -0.34), V(-0.34, 2.06, 0.3), 0.06, look.trim, 'backpack'),
    cap(V(0.34, 2.14, -0.34), V(0.34, 2.06, 0.3), 0.06, look.trim, 'backpack'),
    cap(V(-0.3, 2.0, 0.46), V(-0.3, 1.3, 0.48), 0.05, look.trim, 'backpack'),
    cap(V(0.3, 2.0, 0.46), V(0.3, 1.3, 0.48), 0.05, look.trim, 'backpack'),
  );
  growBox(spec.torso, [-1, 0.6, -1.2], [1, 2.6, 1]);
}

/** C2 Warden: a glowing visor band across the eyes. */
function addVisor(spec: SpeciesSpec, look: NpcLook): void {
  spec.head.prims.push(
    ell(0, 2.66, 0.34, 0.7, 0.15, 0.36, look.trim, 'visor'),
    ell(0, 2.66, 0.6, 0.52, 0.1, 0.1, look.main, 'visor'),
  );
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.1, 3.8, 1.1]);
}

/** C2 Root: a thin stalk with a glowing bulb above the head. */
function addAntenna(spec: SpeciesSpec, look: NpcLook): void {
  spec.head.prims.push(
    cap(V(0, 3.2, -0.1), V(0, 4.0, -0.1), 0.04, look.trim, 'antenna'),
    sph(0, 4.12, -0.1, 0.14, look.main, 'antenna'),
  );
  growBox(spec.head, [-1.1, 1.8, -1.1], [1.1, 4.5, 1.1]);
}

/** M13: two darker patches on the sleeves, at the elbows. */
function addPatches(spec: SpeciesSpec): void {
  for (const [name, sx] of [
    ['armL', -1],
    ['armR', 1],
  ] as const) {
    const arm = spec.parts.find((p) => p.name === name);
    arm?.prims.push(ell(sx * 0.93, 1.54, 0.07, 0.07, 0.1, 0.1, '#5c3d70', 'patch'));
  }
}

/** The Keeper spec for trainer `trainer`, with its silhouette prop (a no-op for the rest). */
export function withNpcAccessories(spec: SpeciesSpec, trainer: string): SpeciesSpec {
  const look = npcLookOf(trainer);
  if (!look) return spec;
  switch (look.accessory) {
    case 'coat':
      addCoat(spec, look);
      break;
    case 'bucket':
      addBucket(spec, look);
      break;
    case 'satchel':
      addSatchel(spec, look);
      break;
    case 'shawl':
      addShawl(spec, look);
      break;
    case 'goggles':
      addGoggles(spec, look);
      break;
    case 'basket':
      addBasket(spec, look);
      break;
    case 'headphones':
      addHeadphones(spec, look);
      break;
    case 'scarf':
      addScarf(spec, look);
      break;
    case 'apron':
      addApron(spec, look);
      break;
    case 'cap':
      addCap(spec, look);
      break;
    case 'widehat':
      addWideHat(spec, look);
      break;
    case 'sling':
      addSling(spec, look);
      break;
    case 'notebook':
      addNotebook(spec, look);
      break;
    case 'bloom':
      addBloom(spec, look);
      break;
    case 'cloak':
      addCloak(spec, look);
      break;
    case 'scroll':
      addScroll(spec, look);
      break;
    case 'broom':
      addBroom(spec, look);
      break;
    case 'pack':
      addPack(spec, look);
      break;
    case 'visor':
      addVisor(spec, look);
      break;
    case 'backpack':
      addBackpack(spec, look);
      break;
    case 'antenna':
      addAntenna(spec, look);
      break;
  }
  // K4: Fern's story look also wears a green cap and a rose scarf, so she is not the Gardener.
  if (trainer === 'fern-story') {
    addCap(spec, { ...look, main: '#2f6a3a', trim: '#d94a7a' });
    addScarf(spec, { ...look, main: '#d94a7a', trim: '#f3b0c4' });
  }
  if (look.patches) addPatches(spec);
  return spec;
}
