import * as THREE from 'three';
import { PETALS } from '../config/region-content-r12d2';
import { heightAt } from '../sim/height';
import { closedGates } from '../sim/region-gates';
import { regionMarks, type Mark } from '../sim/region-marks';
import type { World } from '../sim/types';

/**
 * R12 d2 (R0090, R0091, R0138, R0136): the small marks of an open region in Full 3D, from
 * `sim/region-marks.ts`. Two instanced meshes, so the whole set costs two draws however many
 * there are: gems (a pressed petal in its region's colour, a key, a trace's glint) and blocks
 * (a trace stone, a postcard, the photo frame's posts, the build plot's outline). Always in the
 * scene (count 0 when empty) so the programs link with the rest. Same program as the region
 * critters (standard material, per-instance colour), so nothing new compiles.
 */
const MAX_GEMS = 40;
const MAX_BLOCKS = 56;
const REACH = 60;

export class RegionMarks3d {
  private readonly gems: THREE.InstancedMesh;
  private readonly blocks: THREE.InstancedMesh;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly c = new THREE.Color();
  private ng = 0;
  private nb = 0;

  constructor(parent: THREE.Object3D) {
    const gemGeo = new THREE.OctahedronGeometry(1, 0);
    this.gems = new THREE.InstancedMesh(
      gemGeo,
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.5,
        emissive: '#ffffff',
        emissiveIntensity: 0.22,
      }),
      MAX_GEMS,
    );
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    boxGeo.translate(0, 0.5, 0);
    this.blocks = new THREE.InstancedMesh(
      boxGeo,
      new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 }),
      MAX_BLOCKS,
    );
    for (const [mesh, name] of [
      [this.gems, 'region-marks-gems'],
      [this.blocks, 'region-marks-blocks'],
    ] as const) {
      mesh.count = 0;
      mesh.frustumCulled = false;
      mesh.castShadow = false;
      mesh.name = name;
      mesh.setColorAt(0, this.c.set('#ffffff'));
      parent.add(mesh);
    }
  }

  private gem(x: number, y: number, z: number, size: number, colour: string, spin: number): void {
    if (this.ng >= MAX_GEMS) return;
    this.p.set(x, y, z);
    this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, spin);
    this.s.set(size, size * 1.3, size);
    this.m.compose(this.p, this.q, this.s);
    this.gems.setMatrixAt(this.ng, this.m);
    this.gems.setColorAt(this.ng, this.c.set(colour));
    this.ng++;
  }

  private block(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    colour: string,
    yaw = 0,
  ): void {
    if (this.nb >= MAX_BLOCKS) return;
    this.p.set(x, y, z);
    this.q.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, yaw);
    this.s.set(w, h, d);
    this.m.compose(this.p, this.q, this.s);
    this.blocks.setMatrixAt(this.nb, this.m);
    this.blocks.setColorAt(this.nb, this.c.set(colour));
    this.nb++;
  }

  update(world: World, tSec: number, still: boolean): void {
    this.ng = 0;
    this.nb = 0;
    if (world.location.startsWith('region:')) {
      const k = world.keeper.pos;
      for (const m of regionMarks(world)) {
        if (Math.abs(m.x - k.x) > REACH || Math.abs(m.z - k.z) > REACH) continue;
        this.mark(world, m, tSec, still);
      }
    }
    if (world.location.startsWith('region:'))
      for (const g of closedGates(world))
        this.gate(world, g.kind, g.x, g.z, g.r, this.still(tSec, still));
    for (const [mesh, n] of [
      [this.gems, this.ng],
      [this.blocks, this.nb],
    ] as const) {
      mesh.count = n;
      mesh.instanceMatrix.needsUpdate = n > 0;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = n > 0;
    }
  }

  private still(tSec: number, still: boolean): number {
    return still ? 0 : tSec;
  }

  /** R0110: the three gates that are not a boulder, built from a few blocks. */
  private gate(world: World, kind: string, x: number, z: number, r: number, t: number): void {
    const y = heightAt(world.location, x, z);
    if (kind === 'deepWater') {
      this.block(x, y + 0.02, z, r * 2.6, 0.05, r * 2.6, '#24508c', t * 0.3);
      this.block(x, y + 0.06, z, r * 1.7, 0.05, r * 1.7, '#2f6aa8', -t * 0.5);
      this.block(x, y + 0.1, z, r * 0.8, 0.05, r * 0.8, '#173a68', t * 0.8);
    } else if (kind === 'updraft') {
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + t * 0.4;
        this.block(
          x + Math.cos(a) * r * 0.8,
          y,
          z + Math.sin(a) * r * 0.8,
          0.14,
          3.4,
          0.14,
          '#dff0ff',
        );
      }
    } else if (kind === 'longRun') {
      for (let i = 0; i < 6; i++)
        this.block(
          x - r * 1.2 + i * r * 0.48,
          y + 0.04,
          z,
          r * 0.4,
          0.12,
          r * 2.2,
          i % 2 ? '#74502c' : '#8a5e34',
        );
    }
  }

  private mark(world: World, m: Mark, tSec: number, still: boolean): void {
    const y = heightAt(world.location, m.x, m.z);
    const t = still ? 0 : tSec;
    switch (m.kind) {
      case 'petal':
        this.gem(
          m.x,
          y + 0.4 + Math.sin(t * 2 + m.x) * 0.05,
          m.z,
          0.2,
          PETALS[m.region]?.colour ?? '#f2a6c4',
          t,
        );
        break;
      case 'key':
        this.gem(m.x, y + 0.7 + Math.sin(t * 2 + m.x) * 0.06, m.z, 0.26, '#e8b830', t * 1.5);
        break;
      case 'postcard':
        this.block(m.x, y + 0.04, m.z, 0.55, 0.04, 0.38, '#f4ead0', m.x);
        break;
      case 'trace':
        this.block(m.x, y, m.z, 0.9, 0.5, 0.7, '#9a968c', m.z);
        this.gem(m.x, y + 0.95 + Math.sin(t * 2 + m.z) * 0.05, m.z, 0.14, '#f8e8a0', t);
        break;
      case 'photo': {
        const wood = '#9a6a3a';
        this.block(m.x - 1.1, y, m.z, 0.16, 1.9, 0.16, wood);
        this.block(m.x + 1.1, y, m.z, 0.16, 1.9, 0.16, wood);
        this.block(m.x, y + 1.85, m.z, 2.5, 0.18, 0.18, '#b07a44');
        break;
      }
      case 'plot': {
        const edge = '#f4ead0';
        this.block(m.x, y + 0.01, m.z - 4, 8, 0.04, 0.1, edge);
        this.block(m.x, y + 0.01, m.z + 4, 8, 0.04, 0.1, edge);
        this.block(m.x - 4, y + 0.01, m.z, 0.1, 0.04, 8, edge);
        this.block(m.x + 4, y + 0.01, m.z, 0.1, 0.04, 8, edge);
        for (const [dx, dz] of [
          [-4, -4],
          [4, -4],
          [-4, 4],
          [4, 4],
        ] as const)
          this.block(
            m.x + dx,
            heightAt(world.location, m.x + dx, m.z + dz),
            m.z + dz,
            0.18,
            0.9,
            0.18,
            '#8a5e34',
          );
        break;
      }
    }
  }
}
