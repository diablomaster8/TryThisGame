import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CG4_E4 } from '../config/tuning-e4';
import type { Dress3dCtx } from './dressings';
import { groveHeight } from './terrain';

/**
 * K28 in Full 3D: the four named lantern posts each wear their own head, round, square,
 * hexagonal or tall, with a small tag hung from a bracket in the owner's shape and colour
 * (the shape is the cue; the colour is a second). The stock head's glass, roof and frame
 * are hidden while this is on (they stay tappable: a raycast ignores `visible`) and each
 * new head's glass follows the stock glass material every frame, so the existing lit, out,
 * flicker and low states (package e, the lamp pool) show through the new shape. One merged
 * frame mesh and one glass mesh per post; the tags are four sprites.
 */
type Shape = 'round' | 'square' | 'hex' | 'tall';

const DARK = new THREE.Color('#2a2030');

function part(
  g: THREE.BufferGeometry,
  x: number,
  y: number,
  z: number,
  ry = 0,
): THREE.BufferGeometry {
  const out = g.clone();
  if (ry) out.rotateY(ry);
  out.translate(x, y, z);
  const n = out.getAttribute('position').count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.set([DARK.r, DARK.g, DARK.b], i * 3);
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return out;
}

/** The glass body and the dark frame of one head, in metres above the post's foot. */
function headGeometry(shape: Shape): { glass: THREE.BufferGeometry; frame: THREE.BufferGeometry } {
  const parts: THREE.BufferGeometry[] = [];
  let glass: THREE.BufferGeometry;
  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  if (shape === 'round') {
    glass = new THREE.SphereGeometry(0.25, 16, 12).translate(0, 2.1, 0);
    parts.push(
      part(new THREE.CylinderGeometry(0.2, 0.22, 0.06, 12), 0, 1.84, 0),
      part(new THREE.CylinderGeometry(0.31, 0.28, 0.05, 14), 0, 2.37, 0),
      part(new THREE.SphereGeometry(0.28, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), 0, 2.39, 0),
      part(new THREE.SphereGeometry(0.06, 8, 6), 0, 2.7, 0),
      part(new THREE.TorusGeometry(0.255, 0.018, 6, 22), 0, 2.1, 0),
      part(new THREE.TorusGeometry(0.255, 0.018, 6, 22), 0, 2.1, 0, Math.PI / 2),
    );
  } else if (shape === 'square') {
    glass = box(0.4, 0.44, 0.4).translate(0, 2.1, 0);
    for (const sx of [-1, 1])
      for (const sz of [-1, 1]) parts.push(part(box(0.05, 0.5, 0.05), sx * 0.21, 2.1, sz * 0.21));
    parts.push(
      part(box(0.52, 0.06, 0.52), 0, 1.85, 0),
      part(box(0.54, 0.06, 0.54), 0, 2.36, 0),
      part(new THREE.ConeGeometry(0.42, 0.3, 4), 0, 2.54, 0, Math.PI / 4),
      part(box(0.08, 0.08, 0.08), 0, 2.72, 0),
    );
  } else if (shape === 'hex') {
    glass = new THREE.CylinderGeometry(0.24, 0.24, 0.46, 6).translate(0, 2.1, 0);
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3;
      parts.push(
        part(
          new THREE.CylinderGeometry(0.02, 0.02, 0.5, 4),
          Math.cos(a) * 0.245,
          2.1,
          Math.sin(a) * 0.245,
        ),
      );
    }
    parts.push(
      part(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 6), 0, 1.85, 0),
      part(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 6), 0, 2.37, 0),
      part(new THREE.ConeGeometry(0.36, 0.34, 6), 0, 2.57, 0),
      part(new THREE.SphereGeometry(0.05, 8, 6), 0, 2.78, 0),
    );
  } else {
    glass = box(0.34, 0.92, 0.34).translate(0, 2.3, 0);
    for (const sx of [-1, 1])
      for (const sz of [-1, 1]) parts.push(part(box(0.05, 0.98, 0.05), sx * 0.19, 2.3, sz * 0.19));
    parts.push(
      part(box(0.46, 0.06, 0.46), 0, 1.83, 0),
      part(box(0.5, 0.06, 0.5), 0, 2.78, 0),
      part(box(0.44, 0.05, 0.44), 0, 2.3, 0),
      part(new THREE.ConeGeometry(0.34, 0.46, 4), 0, 3.04, 0, Math.PI / 4),
      part(new THREE.SphereGeometry(0.05, 8, 6), 0, 3.32, 0),
    );
  }
  // The bracket and cord the tag hangs from, on the +x side.
  parts.push(
    part(box(0.3, 0.025, 0.025), 0.3, 1.95, 0),
    part(box(0.012, 0.22, 0.012), 0.42, 1.84, 0),
  );
  return { glass, frame: mergeGeometries(parts, false) };
}

/** The tag: the owner's shape in the owner's colour, outlined, on a transparent card. */
function tagTexture(shape: Shape, colour: string): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = cv.height = 64;
  const g = cv.getContext('2d');
  if (!g) return null;
  g.lineWidth = 5;
  g.strokeStyle = '#2a2030';
  g.fillStyle = colour;
  g.beginPath();
  if (shape === 'round') g.arc(32, 32, 20, 0, Math.PI * 2);
  else if (shape === 'square') g.rect(13, 13, 38, 38);
  else if (shape === 'hex')
    for (let k = 0; k < 6; k++) {
      const a = (k * Math.PI) / 3;
      g[k ? 'lineTo' : 'moveTo'](32 + Math.cos(a) * 24, 32 + Math.sin(a) * 24);
    }
  else g.rect(21, 6, 22, 52);
  g.closePath();
  g.fill();
  g.stroke();
  g.fillStyle = '#2a2030';
  g.beginPath();
  g.arc(32, shape === 'tall' ? 14 : 32, 3, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface Post {
  id: string;
  group: THREE.Group;
  glass: THREE.MeshStandardMaterial;
  tag: THREE.Sprite;
  /** The stock head's pieces, found through the pickables. */
  stock: THREE.Mesh[];
  stockGlass: THREE.MeshStandardMaterial | null;
  foot: number;
}

export class LanternHeads3d {
  private readonly posts: Post[] = [];
  private readonly frameMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.75,
    metalness: 0.1,
  });
  private readonly owned: Array<{ dispose(): void }> = [this.frameMat];
  private found = false;
  private shown: boolean | null = null;

  constructor(
    private readonly ctx: Dress3dCtx,
    posts: ReadonlyArray<{ id: string; x: number; z: number }>,
  ) {
    for (const p of posts) {
      const spec = CG4_E4.heads.shapes[p.id as keyof typeof CG4_E4.heads.shapes];
      if (!spec) continue;
      const { glass, frame } = headGeometry(spec.shape);
      const foot = groveHeight(p.x, p.z);
      const group = new THREE.Group();
      group.name = `e4-head-${p.id}`;
      group.position.set(p.x, foot, p.z);
      const gm = new THREE.MeshStandardMaterial({
        color: '#ffe9b0',
        emissive: '#ffb347',
        emissiveIntensity: 0,
        roughness: 0.15,
        transparent: true,
        opacity: 0.88,
      });
      group.add(new THREE.Mesh(glass, gm), new THREE.Mesh(frame, this.frameMat));
      const tex = tagTexture(spec.shape, spec.tag);
      const tm = new THREE.SpriteMaterial({ map: tex, depthWrite: false });
      const tag = new THREE.Sprite(tm);
      tag.scale.setScalar(CG4_E4.heads.tag);
      tag.position.set(0.42, 1.62, 0);
      group.add(tag);
      group.visible = false;
      ctx.world3d.add(group);
      void ctx.compile(group);
      this.owned.push(glass, frame, gm, tm);
      if (tex) this.owned.push(tex);
      this.posts.push({ id: p.id, group, glass: gm, tag, stock: [], stockGlass: null, foot });
    }
  }

  /** Find each post's stock head parts: lantern pickables whose box starts above the post's chest. */
  private find(): void {
    if (this.found) return;
    const box = new THREE.Box3();
    for (const o of this.ctx.pickables) {
      const pick = o.userData.pick as { kind?: string; id?: string } | undefined;
      if (pick?.kind !== 'lantern') continue;
      const post = this.posts.find((p) => p.id === pick.id);
      const m = o as THREE.Mesh;
      if (!post || !m.isMesh) continue;
      m.updateWorldMatrix(true, false);
      box.setFromObject(m);
      if (box.isEmpty() || box.min.y < post.foot + 1.5) continue;
      post.stock.push(m);
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat.transparent && mat.isMeshStandardMaterial) post.stockGlass = mat;
    }
    this.found = this.posts.every((p) => p.stock.length > 0);
  }

  /** Show the new heads (or give the stock ones back) and copy the glass state across. */
  update(active: boolean, home: boolean): void {
    this.find();
    const on = active && home;
    if (on !== this.shown) {
      this.shown = on;
      for (const p of this.posts) for (const m of p.stock) m.visible = !on;
    }
    for (const p of this.posts) {
      p.group.visible = on;
      if (!on) continue;
      const s = p.stockGlass;
      if (s) {
        p.glass.emissive.copy(s.emissive);
        p.glass.emissiveIntensity = s.emissiveIntensity;
      }
    }
  }

  dispose(): void {
    for (const p of this.posts) {
      for (const m of p.stock) m.visible = true;
      p.group.removeFromParent();
    }
    for (const o of this.owned) o.dispose();
  }
}
