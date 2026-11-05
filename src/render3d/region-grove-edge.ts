import * as THREE from 'three';
import { edgePieces, paintGroveEdge } from '../render/region-grove-edge';
import { groundTexture } from '../render/region-ground';
import { at, kitMaterial, merged, tinted } from './region-kit';
import type { Region3d, Region3dModule } from './region-host';
import { groveBackSource, type GroveBackSource } from './region-grove-source';
import { GROVE } from '../config/tuning';
import { GROVE_BACK } from '../config/tuning-r12d1';
import { TERRAIN_SEGS, TERRAIN_SIZE } from './terrain-shape';
import { groveHeight } from './terrain';

/**
 * R11 d7 (WORLD-39): the Grove drawn back across a seamless border from inside a neighbour, in
 * Full 3D: the pixel twin's painted strip as the ground and one merged mesh of the Grove's
 * trees, rocks, reeds and border hedge near that edge. Two draws, built once; the chunks the
 * host hands in change nothing (the strip is small and fixed).
 *
 * R12 lane D: once the 3D Grove's terrain is registered (`region-grove-source.ts`) the ground
 * is that very mesh's geometry and material, hills, banks and marsh and all, and the pieces
 * stand on its heights; the painted strip is only the fallback before it lands.
 */

function piece(
  key: string,
  x: number,
  z: number,
  w: number,
  onReal: boolean,
): THREE.BufferGeometry[] {
  const parts = pieceAt(key, x, z, w);
  const y = onReal ? groveHeight(x, z) : 0;
  if (y !== 0) for (const g of parts) g.translate(0, y, 0);
  return parts;
}

function pieceAt(key: string, x: number, z: number, w: number): THREE.BufferGeometry[] {
  if (key === 'tree')
    return [
      tinted(at(new THREE.CylinderGeometry(0.22, 0.32, 2.2, 6), x, 1.1, z), '#6b4a2e'),
      tinted(at(new THREE.IcosahedronGeometry(1.8, 1), x, 3.1, z), '#3d7d3c', 0.25),
    ];
  if (key === 'rock') {
    const g = new THREE.DodecahedronGeometry(w * 0.4, 0);
    g.scale(1, 0.6, 0.9);
    return [tinted(at(g, x, 0.2, z), '#7f7f88', 0.3)];
  }
  if (key === 'reeds') {
    const out: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 5; i++)
      out.push(
        tinted(
          at(
            new THREE.CylinderGeometry(0.03, 0.04, 1.3, 3),
            x - 0.4 + i * 0.2,
            0.65,
            z + (i % 2) * 0.2,
          ),
          '#6f8a3a',
        ),
      );
    return out;
  }
  const g = new THREE.IcosahedronGeometry(1, 1);
  g.scale(1.3, 0.8, 0.9);
  return [tinted(at(g, x, 0.7, z), '#2f6b3a', 0.25)];
}

/**
 * The real terrain's cells inside the Grove's square and within `depth` of the sides a
 * neighbour sees (south and east), drawn through the shared vertex buffers. Its rim past the
 * square is left out: from a neighbour it would stand over that region's own ground.
 */
function groveBand(src: GroveBackSource, depth: number): THREE.BufferGeometry | null {
  const full = src.index();
  if (!full) return null;
  const segs = TERRAIN_SEGS;
  const cell = TERRAIN_SIZE / segs;
  const half = TERRAIN_SIZE / 2;
  const inner = GROVE.size / 2;
  const keep: number[] = [];
  for (let iy = 0; iy < segs; iy++) {
    const z = -half + (iy + 0.5) * cell;
    if (Math.abs(z) > inner) continue;
    for (let ix = 0; ix < segs; ix++) {
      const x = -half + (ix + 0.5) * cell;
      if (Math.abs(x) > inner) continue;
      if (z < inner - depth && x < inner - depth) continue;
      keep.push(iy * segs + ix);
    }
  }
  const out = new (full instanceof Uint32Array ? Uint32Array : Uint16Array)(keep.length * 6);
  keep.forEach((c, i) => out.set(full.subarray(c * 6, c * 6 + 6), i * 6));
  const g = new THREE.BufferGeometry();
  const geo = src.mesh.geometry;
  for (const name of Object.keys(geo.attributes)) g.setAttribute(name, geo.attributes[name]!);
  g.setIndex(new THREE.BufferAttribute(out, 1));
  g.computeBoundingSphere();
  return g;
}

class GroveEdge3d implements Region3d {
  readonly group = new THREE.Group();
  private readonly tex: THREE.CanvasTexture | null = null;
  private readonly owned: THREE.BufferGeometry[] = [];
  private readonly mat: THREE.MeshStandardMaterial | null = null;
  /** The band sharing the live terrain's buffers (only its index is ours). */
  private readonly band: THREE.BufferGeometry | null = null;

  constructor() {
    this.group.name = 'region-grove-edge';
    const real = groveBackSource();
    this.band = real ? groveBand(real, GROVE_BACK.depth) : null;
    let ground: THREE.Mesh;
    if (real && this.band) {
      ground = new THREE.Mesh(this.band, real.mesh.material);
    } else {
      const p = paintGroveEdge();
      this.tex = groundTexture(p.canvas);
      const gg = new THREE.PlaneGeometry(p.w, p.h);
      gg.rotateX(-Math.PI / 2);
      gg.translate(0, 0, p.z0 + p.h / 2);
      this.mat = new THREE.MeshStandardMaterial({ map: this.tex, roughness: 1, metalness: 0 });
      ground = new THREE.Mesh(gg, this.mat);
      this.owned.push(gg);
    }
    ground.receiveShadow = true;
    ground.name = 'grove-edge-ground';
    this.group.add(ground);
    const onReal = this.band !== null;
    const parts = edgePieces().flatMap((q) => piece(q.key, q.x, q.z, q.w, onReal));
    const pg = merged(parts);
    const pm = new THREE.Mesh(pg, kitMaterial());
    pm.castShadow = true;
    pm.name = 'grove-edge-pieces';
    this.group.add(pm);
    this.owned.push(pg);
  }

  setChunks(): void {}

  tick(): void {}

  dispose(): void {
    for (const g of this.owned) g.dispose();
    if (this.band) {
      // The vertex buffers are the Grove terrain's: let go of them before disposing, so only
      // our index leaves the GPU.
      for (const name of Object.keys(this.band.attributes)) this.band.deleteAttribute(name);
      this.band.dispose();
    }
    this.mat?.dispose();
    this.tex?.dispose();
  }
}

const mod: Region3dModule = {
  createRegion3d: () => new GroveEdge3d(),
  entrance: () => new THREE.Group(),
};

export const createRegion3d = mod.createRegion3d;
export const entrance = mod.entrance;
