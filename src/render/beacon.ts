import * as THREE from 'three';
import { WORLD_BEACON } from '../config/tuning-world';
import type { Vec2 } from '../sim/types';

/**
 * R0100 (WORLD-42): the tracked objective's beacon, the same in both renderers (it is added to
 * whichever scene is drawing): a soft vertical beam of light, unfogged so it reads from 60 u
 * away, with a star at its top and a pulsing ring on the ground. The Learning Grove gets a
 * friendlier balloon on a string instead. Three draws at most, hidden when nothing is tracked.
 */
function beamTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, 'rgba(255,240,170,0)');
  grad.addColorStop(0.55, 'rgba(255,236,150,0.55)');
  grad.addColorStop(1, 'rgba(255,250,220,0.95)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 64);
  return new THREE.CanvasTexture(c);
}

function starTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = 'rgba(30,20,10,0.55)';
  g.beginPath();
  g.arc(32, 32, 30, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#ffd84a';
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 11 : 25;
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r);
  }
  g.closePath();
  g.fill();
  return new THREE.CanvasTexture(c);
}

export class Beacon {
  readonly group = new THREE.Group();
  private readonly beam: THREE.Mesh;
  private readonly ring: THREE.Mesh;
  private readonly star: THREE.Sprite;
  private readonly balloon: THREE.Group;

  constructor(scene: THREE.Object3D) {
    const T = WORLD_BEACON;
    this.group.name = 'objective-beacon';
    this.group.visible = false;
    const glow = { transparent: true, depthWrite: false, fog: false } as const;
    this.beam = new THREE.Mesh(
      new THREE.CylinderGeometry(T.beamRadius, T.beamRadius, T.beamHeight, 12, 1, true).translate(
        0,
        T.beamHeight / 2,
        0,
      ),
      new THREE.MeshBasicMaterial({
        ...glow,
        map: beamTexture(),
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    );
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(T.ringRadius * 0.8, T.ringRadius, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ ...glow, color: '#ffe680', opacity: 0.8 }),
    );
    this.ring.position.y = 0.04;
    this.star = new THREE.Sprite(
      new THREE.SpriteMaterial({ ...glow, map: starTexture(), depthTest: false }),
    );
    this.star.scale.setScalar(T.starSize);
    this.star.position.y = T.starHeight;
    this.star.renderOrder = 5;
    // The Learning Grove's balloon: a round red balloon, a knot and a string to the ground.
    this.balloon = new THREE.Group();
    const skin = new THREE.Mesh(
      new THREE.SphereGeometry(T.balloonRadius, 16, 12).scale(1, 1.15, 1),
      new THREE.MeshBasicMaterial({ color: '#ff5a5a', fog: false }),
    );
    skin.position.y = T.balloonHeight;
    const shine = new THREE.Mesh(
      new THREE.SphereGeometry(T.balloonRadius * 0.25, 8, 6),
      new THREE.MeshBasicMaterial({ color: '#ffd0d0', fog: false }),
    );
    shine.position.set(
      -T.balloonRadius * 0.4,
      T.balloonHeight + T.balloonRadius * 0.45,
      T.balloonRadius * 0.6,
    );
    const string = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, T.balloonHeight, 4).translate(
        0,
        T.balloonHeight / 2,
        0,
      ),
      new THREE.MeshBasicMaterial({ color: '#f4f0e8', fog: false }),
    );
    this.balloon.add(string, skin, shine);
    this.group.add(this.beam, this.ring, this.star, this.balloon);
    scene.add(this.group);
  }

  /**
   * Show the beacon at `at` (the ground there at height `y`), or hide it for null; `kids`
   * draws the balloon instead of the beam; `t` in seconds drives the pulse and the bob.
   */
  update(at: Vec2 | null, y: number, kids: boolean, t: number, reduceMotion: boolean): void {
    this.group.visible = at !== null;
    if (!at) return;
    this.group.position.set(at.x, y, at.z);
    this.beam.visible = !kids;
    this.star.visible = !kids;
    this.balloon.visible = kids;
    const pulse = reduceMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 3);
    this.ring.scale.setScalar(1 + pulse * 0.25);
    (this.ring.material as THREE.MeshBasicMaterial).opacity = 0.85 - pulse * 0.45;
    this.balloon.position.y = reduceMotion ? 0 : Math.sin(t * 1.6) * 0.15;
  }

  dispose(): void {
    this.group.removeFromParent();
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh && !(o as THREE.Sprite).isSprite) return;
      m.geometry?.dispose();
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.map?.dispose();
      mat.dispose();
    });
  }
}
