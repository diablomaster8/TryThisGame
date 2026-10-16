import * as THREE from 'three';

/**
 * Little bursts in the 3D Grove, the counterparts of the pixel view's particle bursts:
 * leaves and petals from a shaken tree, a puff of dust where a thrown Nubbin lands.
 * One points cloud with per-particle colour holds every burst; particles fall with a
 * drag (leaves flutter down slowly, dust settles fast) and fade before they go.
 */
export type BurstKind = 'leaf' | 'petal' | 'dust';

interface Particle {
  p: THREE.Vector3;
  v: THREE.Vector3;
  born: number;
  life: number;
  kind: BurstKind;
  phase: number;
}

const COLORS: Record<BurstKind, string[]> = {
  leaf: ['#5fae3a', '#86c84a', '#3f8a2e', '#a8d860'],
  petal: ['#ffc8dc', '#ffe0ec', '#ffb0c8'],
  dust: ['#c8b08a', '#d8c4a0', '#b89c74'],
};

/** Fall speed limit and drag per kind: leaves drift, dust drops. */
const FALL: Record<BurstKind, { gravity: number; drag: number }> = {
  leaf: { gravity: 1.2, drag: 2.2 },
  petal: { gravity: 0.9, drag: 2.6 },
  dust: { gravity: 2.4, drag: 3.5 },
};

const MAX = 240;

export class Bursts {
  readonly points: THREE.Points;
  private readonly list: Particle[] = [];
  private readonly pos: THREE.BufferAttribute;
  private readonly col: THREE.BufferAttribute;
  private readonly c = new THREE.Color();
  private seed = 1;

  constructor(parent: THREE.Object3D) {
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    this.col = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    geo.setAttribute('position', this.pos);
    geo.setAttribute('color', this.col);
    geo.setDrawRange(0, 0);
    this.points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      }),
    );
    this.points.frustumCulled = false;
    parent.add(this.points);
  }

  /** A render-side jitter: bursts are decoration, so no sim randomness is spent on them. */
  private rand(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  burst(
    kind: BurstKind,
    at: THREE.Vector3,
    count: number,
    o: { spread: number; speed: number; rise: number; lifeMs: number },
    nowMs: number,
  ): void {
    for (let i = 0; i < count && this.list.length < MAX; i++) {
      const a = this.rand() * Math.PI * 2;
      const r = this.rand() * o.spread;
      const s = o.speed * (0.5 + this.rand() * 0.5);
      this.list.push({
        p: at.clone().add(new THREE.Vector3(Math.cos(a) * r, this.rand() * 0.3, Math.sin(a) * r)),
        v: new THREE.Vector3(Math.cos(a) * s, o.rise + this.rand() * 0.6, Math.sin(a) * s),
        born: nowMs,
        life: o.lifeMs * (0.7 + this.rand() * 0.3),
        kind,
        phase: this.rand() * 6.28,
      });
    }
  }

  update(nowMs: number, dt: number, ground: (x: number, z: number) => number): void {
    let n = 0;
    for (let i = this.list.length - 1; i >= 0; i--) {
      const q = this.list[i]!;
      const age = nowMs - q.born;
      if (age > q.life) {
        this.list.splice(i, 1);
        continue;
      }
      const f = FALL[q.kind];
      q.v.y -= f.gravity * dt;
      q.v.multiplyScalar(Math.exp(-f.drag * dt));
      if (q.kind !== 'dust') q.v.x += Math.sin(nowMs / 300 + q.phase) * dt * 0.8;
      q.p.addScaledVector(q.v, dt);
      const g = ground(q.p.x, q.p.z) + 0.03;
      if (q.p.y < g) {
        q.p.y = g;
        q.v.set(0, 0, 0);
      }
      this.pos.setXYZ(n, q.p.x, q.p.y, q.p.z);
      const palette = COLORS[q.kind];
      this.c.set(palette[Math.floor(q.phase * 10) % palette.length]!);
      // Fade the last fifth of a life toward the ground colour's darkness.
      const fade = Math.min(1, (q.life - age) / (q.life * 0.2));
      this.col.setXYZ(n, this.c.r * fade, this.c.g * fade, this.c.b * fade);
      n++;
    }
    this.pos.needsUpdate = true;
    this.col.needsUpdate = true;
    this.points.geometry.setDrawRange(0, n);
  }
}
