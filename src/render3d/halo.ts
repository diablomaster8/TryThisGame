import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';

/**
 * The tap highlight for still props (buildings, lanterns, decor, trees), after the pixel
 * view's halo (`SpriteBatch.highlight`): the same shapes pushed out along their normals and
 * bright, drawn as back faces so the prop covers the middle and only a glowing rim shows
 * round it (a set width, so a thin lantern post gets as much rim as a cottage). A
 * ground ring, as Nubbins get, sinks out of sight in the grass at a prop's foot.
 * The copies share the props' geometry (and a crown's instance matrices); one material.
 */
export class Halo {
  readonly group = new THREE.Group();
  // Overbright, as the pixel halo's tint is, so tone mapping leaves it a glow, not cream.
  private readonly mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(2.4, 2.1, 1.1),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    fog: false,
  });
  private key = '';
  private readonly rim = { value: GROVE3D.haloRim as number };
  private copies: Array<{ o: THREE.Mesh; src: THREE.Object3D }> = [];

  constructor(parent: THREE.Object3D) {
    this.mat.onBeforeCompile = (shader) => {
      shader.uniforms.uRim = this.rim;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uRim;')
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\ntransformed += normalize(normal) * uRim;',
        );
    };
    this.group.name = 'halo';
    parent.add(this.group);
    // Hidden samples of both kinds, so the scene links the halo's programs at boot and a
    // first hover does not stall.
    const box = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const samples = new THREE.Group();
    samples.add(new THREE.Mesh(box, this.mat), new THREE.InstancedMesh(box, this.mat, 1));
    samples.visible = false;
    parent.add(samples);
  }

  /** Halo `parts` (every mesh under them), or clear with an empty list. `key` names the prop. */
  show(key: string, parts: THREE.Object3D[]): void {
    if (key === this.key) return;
    this.key = key;
    for (const c of this.copies) c.o.removeFromParent();
    this.copies = [];
    if (!parts.length) return;
    for (const p of parts)
      p.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh || !o.visible) return;
        const copy =
          m instanceof THREE.InstancedMesh
            ? Object.assign(new THREE.InstancedMesh(m.geometry, this.mat, m.count), {
                instanceMatrix: m.instanceMatrix,
              })
            : new THREE.Mesh(m.geometry, this.mat);
        copy.matrixAutoUpdate = false;
        copy.frustumCulled = false;
        this.group.add(copy);
        this.copies.push({ o: copy, src: o });
      });
  }

  /** Follow the props (a crown sways) and pulse, as the pixel halo does. */
  update(t: number): void {
    if (!this.copies.length) return;
    const pulse = (Math.sin(t * 6) + 1) / 2;
    this.rim.value = GROVE3D.haloRim * (1 + pulse * 0.4);
    for (const { o, src } of this.copies) {
      src.updateWorldMatrix(true, false);
      o.matrix.copy(src.matrixWorld);
      o.matrixWorldNeedsUpdate = true;
    }
    this.mat.opacity = 0.55 + pulse * 0.35;
  }
}
