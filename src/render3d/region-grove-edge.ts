import * as THREE from 'three';
import { edgePieces, paintGroveEdge } from '../render/region-grove-edge';
import { groundTexture } from '../render/region-ground';
import { at, kitMaterial, merged, tinted } from './region-kit';
import type { Region3d, Region3dModule } from './region-host';

/**
 * R11 d7 (WORLD-39): the Grove drawn back across a seamless border from inside a neighbour, in
 * Full 3D: the pixel twin's painted strip as the ground and one merged mesh of the Grove's
 * trees, rocks, reeds and border hedge near that edge. Two draws, built once; the chunks the
 * host hands in change nothing (the strip is small and fixed).
 */

function piece(key: string, x: number, z: number, w: number): THREE.BufferGeometry[] {
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

class GroveEdge3d implements Region3d {
  readonly group = new THREE.Group();
  private readonly tex: THREE.CanvasTexture;
  private readonly owned: THREE.BufferGeometry[] = [];
  private readonly mat: THREE.MeshStandardMaterial;

  constructor() {
    this.group.name = 'region-grove-edge';
    const p = paintGroveEdge();
    this.tex = groundTexture(p.canvas);
    const gg = new THREE.PlaneGeometry(p.w, p.h);
    gg.rotateX(-Math.PI / 2);
    gg.translate(0, 0, p.z0 + p.h / 2);
    this.mat = new THREE.MeshStandardMaterial({ map: this.tex, roughness: 1, metalness: 0 });
    const ground = new THREE.Mesh(gg, this.mat);
    ground.receiveShadow = true;
    ground.name = 'grove-edge-ground';
    this.group.add(ground);
    const parts = edgePieces().flatMap((q) => piece(q.key, q.x, q.z, q.w));
    const pg = merged(parts);
    const pm = new THREE.Mesh(pg, kitMaterial());
    pm.castShadow = true;
    pm.name = 'grove-edge-pieces';
    this.group.add(pm);
    this.owned.push(gg, pg);
  }

  setChunks(): void {}

  tick(): void {}

  dispose(): void {
    for (const g of this.owned) g.dispose();
    this.mat.dispose();
    this.tex.dispose();
  }
}

const mod: Region3dModule = {
  createRegion3d: () => new GroveEdge3d(),
  entrance: () => new THREE.Group(),
};

export const createRegion3d = mod.createRegion3d;
export const entrance = mod.entrance;
