import * as THREE from 'three';

/**
 * Little bursts in the 3D Grove, the counterparts of the pixel view's particle bursts:
 * leaves and petals from a shaken tree, dust where a thrown Nubbin lands, crumbs when one
 * eats, hearts for a loving reaction and sparkles for a hatch, an evolution, a rebirth or
 * a cocoon. One points cloud per shape (plain dots, four-point stars, hearts) holds every
 * burst with per-particle colour; particles fall with a drag (leaves flutter down slowly,
 * dust settles fast, sparkles hang and hearts float up) and fade before they go.
 */
export type BurstKind = 'leaf' | 'petal' | 'dust' | 'crumb' | 'sparkle' | 'heart';

type Shape = 'dot' | 'star' | 'heart';

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
  crumb: ['#e8b060', '#c88a40', '#f4d08a'],
  sparkle: ['#fff6c0', '#ffffff', '#ffe08a', '#c8f0ff'],
  heart: ['#ff6f9c', '#ff8fb4', '#f2507e'],
};

/**
 * How each kind moves: gravity (negative floats it), drag, a sideways flutter, and
 * whether it comes to rest on the ground or passes through the air until it fades.
 */
const MOTION: Record<
  BurstKind,
  { gravity: number; drag: number; flutter: number; lands: boolean; shape: Shape }
> = {
  leaf: { gravity: 1.2, drag: 2.2, flutter: 0.8, lands: true, shape: 'dot' },
  petal: { gravity: 0.9, drag: 2.6, flutter: 0.8, lands: true, shape: 'dot' },
  dust: { gravity: 2.4, drag: 3.5, flutter: 0, lands: true, shape: 'dot' },
  crumb: { gravity: 3.2, drag: 2.0, flutter: 0, lands: true, shape: 'dot' },
  sparkle: { gravity: 0, drag: 2.4, flutter: 0, lands: false, shape: 'star' },
  heart: { gravity: -0.6, drag: 1.5, flutter: 1.2, lands: false, shape: 'heart' },
};

const MAX = 320;

/** A white mask for a point sprite, drawn once on a small canvas. */
function shapeTexture(shape: Exclude<Shape, 'dot'>): THREE.Texture {
  const s = 32;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#fff';
  g.beginPath();
  if (shape === 'star') {
    // A soft glow under four thin points.
    const c = s / 2;
    const glow = g.createRadialGradient(c, c, 0, c, c, c * 0.6);
    glow.addColorStop(0, 'rgba(255,255,255,0.9)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, s, s);
    g.fillStyle = '#fff';
    g.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? c - 1 : c * 0.22;
      g.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r);
    }
  } else {
    g.moveTo(16, 28);
    g.bezierCurveTo(4, 20, 1, 13, 4, 8);
    g.bezierCurveTo(7, 3, 14, 3, 16, 9);
    g.bezierCurveTo(18, 3, 25, 3, 28, 8);
    g.bezierCurveTo(31, 13, 28, 20, 16, 28);
  }
  g.closePath();
  g.fill();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

class Cloud {
  readonly points: THREE.Points;
  readonly pos: THREE.BufferAttribute;
  readonly col: THREE.BufferAttribute;
  n = 0;

  constructor(parent: THREE.Object3D, shape: Shape) {
    const geo = new THREE.BufferGeometry();
    this.pos = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    this.col = new THREE.BufferAttribute(new Float32Array(MAX * 3), 3);
    geo.setAttribute('position', this.pos);
    geo.setAttribute('color', this.col);
    geo.setDrawRange(0, 0);
    const mat =
      shape === 'dot'
        ? new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.95,
            depthWrite: false,
          })
        : new THREE.PointsMaterial({
            size: shape === 'star' ? 0.55 : 0.4,
            map: shapeTexture(shape),
            vertexColors: true,
            transparent: true,
            alphaTest: shape === 'star' ? 0.02 : 0.2,
            depthWrite: false,
            // Sparkles add light (and catch the bloom); hearts stay solid.
            blending: shape === 'star' ? THREE.AdditiveBlending : THREE.NormalBlending,
          });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 2;
    parent.add(this.points);
  }

  flush(): void {
    this.pos.needsUpdate = true;
    this.col.needsUpdate = true;
    this.points.geometry.setDrawRange(0, this.n);
    this.n = 0;
  }
}

export class Bursts {
  private readonly clouds: Record<Shape, Cloud>;
  private readonly list: Particle[] = [];
  private readonly c = new THREE.Color();
  private seed = 1;

  constructor(parent: THREE.Object3D) {
    this.clouds = {
      dot: new Cloud(parent, 'dot'),
      star: new Cloud(parent, 'star'),
      heart: new Cloud(parent, 'heart'),
    };
  }

  /** The dot cloud (leaves, petals, dust, crumbs). */
  get points(): THREE.Points {
    return this.clouds.dot.points;
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
    for (let i = this.list.length - 1; i >= 0; i--) {
      const q = this.list[i]!;
      const age = nowMs - q.born;
      if (age > q.life) {
        this.list.splice(i, 1);
        continue;
      }
      const f = MOTION[q.kind];
      q.v.y -= f.gravity * dt;
      q.v.multiplyScalar(Math.exp(-f.drag * dt));
      if (f.flutter) q.v.x += Math.sin(nowMs / 300 + q.phase) * dt * f.flutter;
      q.p.addScaledVector(q.v, dt);
      if (f.lands) {
        const g = ground(q.p.x, q.p.z) + 0.03;
        if (q.p.y < g) {
          q.p.y = g;
          q.v.set(0, 0, 0);
        }
      }
      const cloud = this.clouds[f.shape];
      const n = cloud.n++;
      cloud.pos.setXYZ(n, q.p.x, q.p.y, q.p.z);
      const palette = COLORS[q.kind];
      this.c.set(palette[Math.floor(q.phase * 10) % palette.length]!);
      // Fade the last fifth of a life toward the ground colour's darkness; sparkles twinkle.
      let fade = Math.min(1, (q.life - age) / (q.life * 0.2));
      if (q.kind === 'sparkle') fade *= 0.65 + 0.35 * Math.sin(nowMs / 60 + q.phase * 3);
      cloud.col.setXYZ(n, this.c.r * fade, this.c.g * fade, this.c.b * fade);
    }
    this.clouds.dot.flush();
    this.clouds.star.flush();
    this.clouds.heart.flush();
  }
}
