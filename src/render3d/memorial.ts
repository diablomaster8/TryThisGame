import * as THREE from 'three';
import { READ3D } from '../config/tuning';

/**
 * The memorial flower a departed Nubbin leaves on the hill, in 3D (review 2026-10-21,
 * bug 14): a curved stem tall enough to stand over the grass, two leaves, six petals round
 * a golden heart, and a soft glow behind the bloom that breathes slowly. Geometry and
 * materials are shared by every flower for the page's life, so a flower costs only its
 * meshes; only the glow's opacity changes, once a frame for all of them.
 */
interface Kit {
  stem: THREE.BufferGeometry;
  leaf: THREE.BufferGeometry;
  petal: THREE.BufferGeometry;
  heart: THREE.BufferGeometry;
  glow: THREE.BufferGeometry;
  green: THREE.Material;
  pink: THREE.Material;
  gold: THREE.Material;
  halo: THREE.MeshBasicMaterial;
}

let kit: Kit | null = null;

/** A soft round of light, white in the middle, for the glow card. */
function glowTexture(): THREE.Texture {
  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const g = cv.getContext('2d')!;
  const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(0.4, 'rgba(255,255,255,0.4)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeKit(): Kit {
  const h = READ3D.memorial.height;
  // The stem leans a little and straightens under the bloom.
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.05, h * 0.35, 0.02),
    new THREE.Vector3(-0.02, h * 0.7, 0),
    new THREE.Vector3(0, h, 0),
  ]);
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.09, 0.1, 0, 0.3);
  leafShape.quadraticCurveTo(-0.09, 0.1, 0, 0);
  const petal = new THREE.SphereGeometry(0.1, 10, 8);
  petal.scale(0.75, 0.28, 1.25);
  petal.translate(0, 0, 0.12);
  return {
    stem: new THREE.TubeGeometry(curve, 10, 0.022, 6),
    leaf: new THREE.ShapeGeometry(leafShape, 6),
    petal,
    heart: new THREE.SphereGeometry(0.065, 10, 8),
    glow: new THREE.PlaneGeometry(0.9, 0.9),
    green: new THREE.MeshStandardMaterial({
      color: '#4f9a3a',
      roughness: 0.7,
      side: THREE.DoubleSide,
    }),
    pink: new THREE.MeshStandardMaterial({
      color: '#ff9ccc',
      emissive: '#ff8fc4',
      emissiveIntensity: 0.35,
      roughness: 0.5,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: '#ffd94a',
      emissive: '#ffb020',
      emissiveIntensity: 0.6,
      roughness: 0.4,
    }),
    halo: new THREE.MeshBasicMaterial({
      map: glowTexture(),
      color: '#ffd6ec',
      transparent: true,
      opacity: READ3D.memorial.glow,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    }),
  };
}

/** A memorial flower standing at its foot (the group's origin). */
export function memorialFlower(): THREE.Group {
  kit ??= makeKit();
  const k = kit;
  const h = READ3D.memorial.height;
  const g = new THREE.Group();
  g.name = 'memorial';
  const stem = new THREE.Mesh(k.stem, k.green);
  stem.castShadow = true;
  g.add(stem);
  for (const [y, turn, tilt] of [
    [0.28, 0.4, 0.9],
    [0.48, 0.4 + Math.PI, 0.8],
  ] as const) {
    const leaf = new THREE.Mesh(k.leaf, k.green);
    leaf.position.y = h * y;
    leaf.rotation.set(0, turn, tilt);
    g.add(leaf);
  }
  const bloom = new THREE.Group();
  bloom.position.y = h;
  // Facing up and a little forward, so it reads from the camera's height.
  bloom.rotation.x = -0.5;
  bloom.scale.setScalar(1.4);
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(k.petal, k.pink);
    p.rotation.y = (i / 6) * Math.PI * 2;
    p.rotation.x = -0.25;
    bloom.add(p);
  }
  const heart = new THREE.Mesh(k.heart, k.gold);
  heart.scale.y = 0.6;
  bloom.add(heart);
  g.add(bloom);
  const glow = new THREE.Mesh(k.glow, k.halo);
  glow.position.y = h;
  glow.renderOrder = 2;
  glow.userData.billboard = true;
  g.add(glow);
  return g;
}

/** Breathe every flower's glow and turn the glow cards to the camera. */
export function updateMemorials(
  flowers: Iterable<THREE.Group>,
  camera: THREE.Vector3,
  t: number,
): void {
  if (!kit) return;
  kit.halo.opacity = READ3D.memorial.glow * (0.75 + Math.sin(t * 1.3) * 0.25);
  for (const g of flowers) {
    const glow = g.children[g.children.length - 1];
    if (glow) glow.lookAt(camera);
  }
}

/**
 * Briar's flower (campaign graphics H7): the first on the hill, older and larger than the
 * rest, in a ring of stones. The difference is shape and size, so colour is not the only cue:
 * it stands a head taller, and the ring marks it. Static: no glow card to turn or breathe.
 */
export function elderMemorialFlower(scale: number, ring: number, ringR: number): THREE.Group {
  const g = memorialFlower();
  // Drop the glow card (the last child): the elder flower holds still.
  const glow = g.children[g.children.length - 1];
  if (glow) g.remove(glow);
  const flower = new THREE.Group();
  flower.add(...g.children);
  flower.scale.setScalar(scale);
  const out = new THREE.Group();
  out.name = 'elder-memorial';
  out.add(flower);
  const stones = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: '#9a9aa6', roughness: 0.95, flatShading: true }),
    ring,
  );
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < ring; i++) {
    const a = (i / ring) * Math.PI * 2;
    const s = 0.1 + ((i * 37) % 7) * 0.012;
    stones.setMatrixAt(
      i,
      m4.compose(
        new THREE.Vector3(Math.cos(a) * ringR, s * 0.5, Math.sin(a) * ringR),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), i),
        new THREE.Vector3(s * 1.4, s, s * 1.2),
      ),
    );
  }
  stones.castShadow = stones.receiveShadow = true;
  out.add(stones);
  return out;
}
