import * as THREE from 'three';
import type { ToyKind } from '../sim/types';

/**
 * The toys in 3D, one small model per kind, the counterparts of the pixel toy sprites:
 * a striped ball, a radio with its aerial, a stack of blocks, a hand mirror and a little
 * television whose screen glows. Each sits on its base at y = 0.
 */
const mat = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.55, ...o });

function at<T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T {
  o.position.set(x, y, z);
  return o;
}

export function buildToy(kind: ToyKind | undefined): THREE.Group {
  const g = new THREE.Group();
  switch (kind) {
    case 'radio': {
      g.add(
        at(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.26, 0.16), mat('#c0503a')), 0, 0.13, 0),
      );
      const grille = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), mat('#3a2a2a'));
      g.add(at(grille, -0.09, 0.13, 0.081));
      const knob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.03, 12),
        mat('#f0e0b0'),
      );
      knob.rotation.x = Math.PI / 2;
      g.add(at(knob, 0.11, 0.15, 0.09));
      const aerial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.36, 6),
        mat('#b0b8c0', { metalness: 0.8 }),
      );
      aerial.rotation.z = -0.5;
      g.add(at(aerial, 0.24, 0.38, -0.03));
      break;
    }
    case 'blocks': {
      const colors = ['#e05a4a', '#4a8ae0', '#f0c040'];
      [
        [-0.1, 0.07, 0, 0.1],
        [0.1, 0.07, 0.02, -0.15],
        [0, 0.21, 0.01, 0.4],
      ].forEach(([x, y, z, r], i) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.14), mat(colors[i]!));
        b.rotation.y = r!;
        g.add(at(b, x!, y!, z!));
      });
      break;
    }
    case 'mirror': {
      const frame = new THREE.Mesh(
        new THREE.TorusGeometry(0.15, 0.03, 8, 24),
        mat('#d8a840', { metalness: 0.7, roughness: 0.3 }),
      );
      g.add(at(frame, 0, 0.3, 0));
      const glass = new THREE.Mesh(
        new THREE.CircleGeometry(0.15, 24),
        mat('#dff2ff', { metalness: 1, roughness: 0.05 }),
      );
      g.add(at(glass, 0, 0.3, 0.005));
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.035, 0.18, 8),
        mat('#d8a840', { metalness: 0.7, roughness: 0.3 }),
      );
      g.add(at(handle, 0, 0.09, 0));
      break;
    }
    case 'tv': {
      g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.34, 0.3), mat('#7a5a3a')), 0, 0.2, 0));
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.32, 0.24),
        mat('#9ad0ff', { emissive: '#6aa8e0', emissiveIntensity: 0.9 }),
      );
      g.add(at(screen, -0.02, 0.21, 0.151));
      for (const s of [-1, 1]) {
        const ear = new THREE.Mesh(
          new THREE.CylinderGeometry(0.006, 0.006, 0.24, 6),
          mat('#3a3a40'),
        );
        ear.rotation.z = s * 0.45;
        g.add(at(ear, s * 0.06, 0.45, 0));
      }
      break;
    }
    case 'seesaw': {
      // The plank is its own child (named) so the renderer can rock it about the post.
      const pivot = new THREE.Group();
      pivot.name = 'plank';
      pivot.position.y = 0.2;
      pivot.add(
        at(new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 0.22), mat('#d89a4a')), 0, 0.03, 0),
      );
      pivot.add(
        at(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.2), mat('#e04a6a')), -0.42, 0.075, 0),
      );
      pivot.add(
        at(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.2), mat('#3a6ea8')), 0.42, 0.075, 0),
      );
      g.add(pivot);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.2, 8), mat('#7a4f2d'));
      g.add(at(post, 0, 0.1, 0));
      break;
    }
    case 'sandbox': {
      const wood = mat('#9a6a3a');
      g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.9), mat('#e8cf8a')), 0, 0.05, 0));
      for (const [x, z, w, d] of [
        [0, -0.45, 0.96, 0.06],
        [0, 0.45, 0.96, 0.06],
        [-0.45, 0, 0.06, 0.9],
        [0.45, 0, 0.06, 0.9],
      ] as const)
        g.add(at(new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), wood), x, 0.07, z));
      g.add(
        at(
          new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.14, 10), mat('#f0dba0')),
          -0.1,
          0.14,
          0.05,
        ),
      );
      g.add(
        at(
          new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.09, 8), mat('#e04a3a')),
          0.22,
          0.12,
          -0.12,
        ),
      );
      break;
    }
    case 'drum': {
      g.add(
        at(
          new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.28, 18), mat('#c0503a')),
          0,
          0.14,
          0,
        ),
      );
      g.add(
        at(
          new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.02, 18), mat('#f3e2b6')),
          0,
          0.29,
          0,
        ),
      );
      for (const s of [-1, 1]) {
        const stick = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6),
          mat('#7a4f2d'),
        );
        stick.rotation.z = s * 0.9;
        g.add(at(stick, s * 0.07, 0.36, 0.0));
      }
      break;
    }
    case 'bubbleWand': {
      g.add(
        at(
          new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 6), mat('#7a4f2d')),
          0,
          0.2,
          0,
        ),
      );
      g.add(
        at(new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.01, 6, 16), mat('#9ad0ff')), 0, 0.45, 0),
      );
      const bubble = mat('#cfeaff', { transparent: true, opacity: 0.45, roughness: 0.1 });
      for (const [x, y, z, r] of [
        [0.15, 0.6, 0.05, 0.06],
        [-0.12, 0.72, -0.04, 0.045],
        [0.05, 0.85, 0.08, 0.035],
      ] as const)
        g.add(at(new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), bubble), x, y, z));
      break;
    }
    default: {
      // The ball: red with a pale band, the classic beach ball.
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 18, 12),
        mat('#e04a6a', { roughness: 0.4 }),
      );
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.035, 6, 24),
        mat('#fff4e0', { roughness: 0.4 }),
      );
      band.rotation.y = Math.PI / 2;
      g.add(at(ball, 0, 0.2, 0), at(band, 0, 0.2, 0));
    }
  }
  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = true;
  });
  return g;
}
