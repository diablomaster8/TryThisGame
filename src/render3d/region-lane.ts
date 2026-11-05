import * as THREE from 'three';
import { LANE_GATES, LANE_MAILBOX } from '../config/region-lane';
import { LANE_GROUND, paintLane } from '../render/region-lane';
import { color } from '../render/sprites/palette';
import { trainerOf } from '../sim/trainers';
import { at, kit3dModule, merged, tinted } from './region-kit';

/**
 * WORLD-33 (R12 lane D): the neighbourhood lane in Full 3D, on the region kit. Round orchard
 * trees, hedgerow bushes and tall pears as the fill; one merged mesh for every garden's picket
 * gate, its mailbox in the trainer's colour (a pale initial plate on its side) and its pennant
 * in their hat colour. A signpost stands at each loaded way in.
 */

const LEAF = '#4f8a3a';
const BARK = '#6b4a2e';
const WOOD = '#efe6d0';
const POST = '#8a6a46';

function roundTree(tall: boolean): THREE.BufferGeometry {
  const h = tall ? 2.6 : 1.8;
  return merged([
    tinted(at(new THREE.CylinderGeometry(0.16, 0.24, h, 6), 0, h / 2, 0), BARK),
    tinted(at(new THREE.IcosahedronGeometry(tall ? 1.2 : 1.5, 1), 0, h + 0.9, 0), LEAF, 0.25),
  ]);
}

function bush(): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(1, 1);
  g.scale(1.3, 0.75, 1);
  return merged([tinted(at(g, 0, 0.6, 0), '#3f7a32', 0.25)]);
}

function churn(): THREE.BufferGeometry {
  return merged([tinted(at(new THREE.CylinderGeometry(0.22, 0.25, 0.6, 8), 0, 0.3, 0), '#c8c8c0')]);
}

function pieces(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const g of LANE_GATES) {
    const look = trainerOf(g.id).look;
    // The gate across the hedge gap: two posts and palings, facing along x.
    for (const dz of [-1.5, 1.5])
      parts.push(tinted(at(new THREE.BoxGeometry(0.22, 1.4, 0.22), g.x, 0.7, g.z + dz), POST));
    for (let i = -1.2; i <= 1.21; i += 0.4)
      parts.push(tinted(at(new THREE.BoxGeometry(0.06, 0.9, 0.14), g.x, 0.5, g.z + i), WOOD));
    parts.push(tinted(at(new THREE.BoxGeometry(0.08, 0.1, 2.8), g.x, 0.75, g.z), WOOD));
    // The mailbox on its post, toward the lane, and its initial plate.
    const mx = g.x - g.side * 2.6;
    const mz = g.z - 1.8;
    parts.push(tinted(at(new THREE.BoxGeometry(0.12, 1, 0.12), mx, 0.5, mz), POST));
    parts.push(tinted(at(new THREE.BoxGeometry(0.4, 0.34, 0.6), mx, 1.15, mz), LANE_MAILBOX[g.id]));
    parts.push(tinted(at(new THREE.BoxGeometry(0.42, 0.16, 0.2), mx, 1.18, mz), '#fff8e8'));
    // The pennant.
    const fx = g.x + g.side * 0.4;
    const fz = g.z - 2.2;
    parts.push(tinted(at(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 5), fx, 1.1, fz), POST));
    const pen = new THREE.BufferGeometry();
    pen.setAttribute(
      'position',
      new THREE.Float32BufferAttribute([0, 2.2, 0, 0, 1.6, 0, 0, 1.9, -0.8 * g.side], 3),
    );
    pen.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 2));
    pen.translate(fx, 0, fz);
    pen.computeVertexNormals();
    parts.push(tinted(pen, color(look.hat)));
  }
  return merged(parts);
}

function signpost(): THREE.BufferGeometry {
  return merged([
    tinted(at(new THREE.BoxGeometry(0.18, 2, 0.18), 0, 1, 0), POST),
    tinted(at(new THREE.BoxGeometry(1.2, 0.34, 0.08), 0.3, 1.7, 0), WOOD),
    tinted(at(new THREE.BoxGeometry(1, 0.3, 0.08), -0.2, 1.3, 0), WOOD),
  ]);
}

const mod = kit3dModule({
  name: 'lane',
  look: LANE_GROUND,
  paint: paintLane,
  fill: () => [roundTree(false), bush(), roundTree(true)],
  tuft: '#6f9e4a',
  prop: churn,
  pieces,
  arch: signpost,
  fold: true,
});

export const createRegion3d = mod.createRegion3d;
export const entrance = mod.entrance;
