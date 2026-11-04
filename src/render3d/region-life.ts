import * as THREE from 'three';
import { CRITTER_RULES } from '../config/region-wild';
import { speciesById } from '../sim/critters';
import { closedGates } from '../sim/region-gates';
import { liveCritters } from '../sim/region-critters';
import { wildNubbinHere } from '../sim/region-wild-nubbin';
import { heightAt } from '../sim/height';
import type { World } from '../sim/types';

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
const MAX_GATES = 3;

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
    this.critters = new THREE.InstancedMesh(geo, mat, CRITTER_RULES.maxLive + 1);
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
      new THREE.MeshStandardMaterial({ color: '#8d887e', roughness: 1, flatShading: true }),
      MAX_GATES,
    );
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
      this.p.set(c.x, heightAt(world.location, c.x, c.z) + hop, c.z);
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, c.x + c.z);
      this.s.set(1, 1, 1);
      this.m.compose(this.p, this.q, this.s);
      this.critters.setMatrixAt(n, this.m);
      this.critters.setColorAt(n, this.c.set(TYPE_COLOUR[t] ?? '#d8c49c'));
      n++;
    }
    // R12 d2 (R0120): the region's shy wild Nubbin, a bigger light-blue one.
    const wn = here ? wildNubbinHere(world) : null;
    if (wn) {
      const hop = still ? 0 : Math.max(0, Math.sin(tSec * 4 + wn.x)) * 0.12;
      this.p.set(wn.x, heightAt(world.location, wn.x, wn.z) + hop, wn.z);
      this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, -wn.heading);
      this.s.setScalar(1.45);
      this.m.compose(this.p, this.q, this.s);
      this.critters.setMatrixAt(n, this.m);
      this.critters.setColorAt(n, this.c.set('#8ec8f0'));
      n++;
    }
    this.critters.count = n;
    this.critters.instanceMatrix.needsUpdate = n > 0;
    if (this.critters.instanceColor) this.critters.instanceColor.needsUpdate = n > 0;
    let g = 0;
    for (const gate of gates) {
      if (g >= MAX_GATES) break;
      this.p.set(gate.x, heightAt(world.location, gate.x, gate.z), gate.z);
      this.q.identity();
      this.s.setScalar(gate.r);
      this.m.compose(this.p, this.q, this.s);
      this.rocks.setMatrixAt(g++, this.m);
    }
    this.rocks.count = g;
    this.rocks.instanceMatrix.needsUpdate = g > 0;
  }
}
