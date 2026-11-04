import * as THREE from 'three';
import { CRITTER_RULES } from '../config/region-wild';
import { speciesById } from '../sim/critters';
import { closedGates } from '../sim/region-gates';
import { liveCritters } from '../sim/region-critters';
import type { World } from '../sim/types';
import { REGION_FLIGHTS, regionLedges } from '../sim/region-moves';
import { drawnRegion, regionGround } from '../sim/region-walk';

/**
 * R0120 and R0110 (R11 d8): a region's critters and shut gates in Full 3D. The critters are one
 * instanced mesh (a body and two ears merged, coloured by type per instance, at most
 * `CRITTER_RULES.maxLive`), each hopping now and then; a shut gate is one instance of a rock mesh.
 * Always in the scene (count 0 when empty) so the programs link with the rest. A region with
 * neither costs only two invisible draws.
 */
const TYPE_COLOUR: Record<string, string> = {
  swim: '#5aa0d8',
  fly: '#9ac8f0',
  run: '#e8c84a',
  power: '#c8583c',
  normal: '#d8c49c',
};
/** Shut gates, plus (R12 lane D) the built ledges and stones and the flying zones' marks. */
const MAX_GATES = 16;

function mergeSimple(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  let base = 0;
  for (const g of parts) {
    const p = g.attributes.position!;
    const nm = g.attributes.normal!;
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      nor.push(nm.getX(i), nm.getY(i), nm.getZ(i));
    }
    for (const i of g.index!.array) idx.push(base + i);
    base += p.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  out.setIndex(idx);
  return out;
}

/** R12 lane D: the shut gates' colours by look. */
const GATE_COLOUR = {
  boulder: '#8d887e',
  vines: '#4f8a34',
  ledge: '#9a948a',
  flight: '#dff1ff',
} as const;

export class RegionLife3d {
  private readonly critters: THREE.InstancedMesh;
  private readonly rocks: THREE.InstancedMesh;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly c = new THREE.Color();

  constructor(parent: THREE.Object3D) {
    const body = new THREE.SphereGeometry(0.3, 8, 6);
    body.translate(0, 0.3, 0);
    const ear = new THREE.SphereGeometry(0.1, 6, 4);
    const earL = ear.clone().translate(-0.17, 0.62, 0);
    const earR = ear.translate(0.17, 0.62, 0);
    const geo = mergeSimple([body, earL, earR]);
    const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 });
    this.critters = new THREE.InstancedMesh(geo, mat, CRITTER_RULES.maxLive);
    this.critters.count = 0;
    this.critters.frustumCulled = false;
    this.critters.castShadow = true;
    this.critters.name = 'region-critters';
    // The per-instance colour is allocated up front so the program never changes.
    this.critters.setColorAt(0, this.c.set('#ffffff'));
    parent.add(this.critters);
    const rock = new THREE.DodecahedronGeometry(1, 0);
    rock.scale(1, 0.75, 0.9);
    rock.translate(0, 0.7, 0);
    this.rocks = new THREE.InstancedMesh(
      rock,
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true }),
      MAX_GATES,
    );
    // R12 lane D: a boulder grey, a vine wall green (WORLD-25).
    this.rocks.setColorAt(0, this.c.set(GATE_COLOUR.boulder));
    this.rocks.count = 0;
    this.rocks.frustumCulled = false;
    this.rocks.castShadow = true;
    this.rocks.receiveShadow = true;
    this.rocks.name = 'region-gates';
    parent.add(this.rocks);
  }

  update(world: World, tSec: number, still: boolean): void {
    const here = world.location.startsWith('region:');
    const crit = here ? liveCritters(world) : [];
    const gates = here ? closedGates(world) : [];
    let n = 0;
    for (const c of crit) {
      const t = speciesById(c.species)?.type ?? 'normal';
      const hop = still ? 0 : Math.max(0, Math.sin(tSec * 3 + c.x)) * 0.18;
      this.p.set(c.x, hop, c.z);
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, c.x + c.z);
      this.s.set(1, 1, 1);
      this.m.compose(this.p, this.q, this.s);
      this.critters.setMatrixAt(n, this.m);
      this.critters.setColorAt(n, this.c.set(TYPE_COLOUR[t] ?? '#d8c49c'));
      n++;
    }
    this.critters.count = n;
    this.critters.instanceMatrix.needsUpdate = n > 0;
    if (this.critters.instanceColor) this.critters.instanceColor.needsUpdate = n > 0;
    let g = 0;
    for (const gate of gates) {
      if (g >= MAX_GATES) break;
      this.p.set(gate.x, 0, gate.z);
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, gate.yaw ?? 0);
      // A vine wall is a long, thin curtain across the lane; a boulder a round rock.
      if (gate.kind === 'vines') this.s.set(gate.r * 0.85, 1.5, 0.35);
      else this.s.setScalar(gate.r);
      this.m.compose(this.p, this.q, this.s);
      this.rocks.setColorAt(
        g,
        this.c.set(GATE_COLOUR[gate.kind === 'vines' ? 'vines' : 'boulder']),
      );
      this.rocks.setMatrixAt(g++, this.m);
    }
    // R12 lane D: the region's built stones and ledges (a rock from the low ground up to the
    // top), and a pale flat mark on each flying zone's spot.
    const id = here ? drawnRegion(world) : null;
    if (id) {
      const ground = regionGround(world.location);
      for (const l of regionLedges(id)) {
        if (g >= MAX_GATES) break;
        const low = Math.min(ground(l.x, l.z - l.h / 2), ground(l.x, l.z + l.h / 2)) - 0.3;
        this.p.set(l.x, low, l.z);
        this.q.identity();
        this.s.set(l.w * 0.55, (l.y - low) / 1.45, l.h * 0.55);
        this.m.compose(this.p, this.q, this.s);
        this.rocks.setColorAt(g, this.c.set(GATE_COLOUR.ledge));
        this.rocks.setMatrixAt(g++, this.m);
      }
      for (const f of REGION_FLIGHTS[id] ?? []) {
        if (g >= MAX_GATES) break;
        this.p.set(f.at.x, ground(f.at.x, f.at.z) - 0.6, f.at.z);
        this.q.identity();
        this.s.set(0.9, 0.45, 0.9);
        this.m.compose(this.p, this.q, this.s);
        this.rocks.setColorAt(g, this.c.set(GATE_COLOUR.flight));
        this.rocks.setMatrixAt(g++, this.m);
      }
    }
    this.rocks.count = g;
    this.rocks.instanceMatrix.needsUpdate = g > 0;
    if (this.rocks.instanceColor) this.rocks.instanceColor.needsUpdate = g > 0;
  }
}
