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
  }
  return spec;
}
