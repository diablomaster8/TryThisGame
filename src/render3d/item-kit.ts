import * as THREE from 'three';
import { EGG_PALETTES } from '../render/sprites/egg';
import { C, color } from '../render/sprites/palette';
import { EGG_COLOURS, JEWELS } from '../samples/nubbin-variants-colour';
import { bandOf } from '../sim/alignment';
import { isJewel } from '../sim/nubbin';
import { speciesOf, type Family } from '../sim/species';
import type { Item, Nubbin, ToyKind } from '../sim/types';
import { FRUIT_COLOURS, FRUIT_PLAIN } from './glow';
import { buildToy } from './toys';

/**
 * The small things the 3D Grove places by the dozen: eggs, cocoons, fruit, notebooks, toys
 * and the stand-ins shown while a figure is still being sculpted. Geometry is built once
 * per kind and materials once per kind and colour, so a hundred fruit drops cost nothing;
 * only a cocoon (whose opacity fades per instance) has a material of its own, and
 * `release` disposes it. `dispose` frees everything the kit ever made.
 *
 * The eggs mirror the pixel art (`render/sprites/egg.ts`): a coloured cap at the top and
 * spots for the Chao line, a rounder cream egg with big green spots for the pocket line,
 * and a taller grey egg banded with stripes for the digital line. A jewel egg is a
 * faceted gem in its stone's colour under a clearcoat.
 */

/** Egg shapes by family: half-height, radius at the waist, and how much the top narrows. */
const EGG_SHAPES: Record<Family, { half: number; r: number; taper: number }> = {
  chao: { half: 0.46, r: 0.36, taper: 0.15 },
  pocket: { half: 0.42, r: 0.37, taper: 0.07 },
  digi: { half: 0.48, r: 0.33, taper: 0.2 },
};

/** The pixel egg's family palettes for a plain egg (its `FAMILY_EGGS`). */
const FAMILY_PLAIN: Partial<Record<Family, { shell: string; cap: string; spot: string }>> = {
  pocket: { shell: color(C.cream), cap: color(C.cream), spot: color(C.leaf) },
  digi: { shell: color(C.lilacGrey), cap: color(C.pale), spot: color(C.plum) },
};

/**
 * A cocoon's colours, as the pixel cocoons (LOOK-25): an evolving one tinted by the band it
 * is heading for (Sun white with a cyan glow, Moon dusk purple, Neutral pale mint), rebirth
 * warm pink, departure soft grey-lilac.
 */
const COCOON: Record<string, { color: string; emissive: string }> = {
  evolve: { color: '#d8c8f0', emissive: '#8a70c0' },
  'evolve:sun': { color: '#ffffff', emissive: '#7fd8f0' },
  'evolve:moon': { color: '#8a6ab8', emissive: '#4a2a78' },
  'evolve:neutral': { color: '#c8f0dc', emissive: '#60b090' },
  rebirth: { color: '#ffb8d8', emissive: '#ff7aa8' },
  depart: { color: '#d8d0e4', emissive: '#a8a0c0' },
};

/** A wrapped Chao turned on a lathe: a round bottom, a waist, a wider head and the point. */
const COCOON_PROFILE: [number, number][] = [
  [0, -0.5],
  [0.2, -0.48],
  [0.3, -0.38],
  [0.32, -0.2],
  [0.27, -0.02],
  [0.36, 0.12],
  [0.42, 0.25],
  [0.38, 0.36],
  [0.26, 0.44],
  [0.1, 0.5],
  [0.04, 0.6],
  [0, 0.62],
];

/** The cocoon colour key: the kind, and for an evolving one the band it is heading for. */
function cocoonColourKey(n: Nubbin): string {
  const kind = n.cocoonKind ?? 'evolve';
  return kind === 'evolve' ? `evolve:${bandOf(n.alignment)}` : kind;
}

/** The egg family of a Nubbin (the Chao line when the species is unknown). */
export function eggFamily(n: Pick<Nubbin, 'species'>): Family {
  return speciesOf(n.species).family;
}

/** The egg's profile, bottom to top: wider below the waist and narrowing to the top. */
function eggProfile(shape: { half: number; r: number; taper: number }): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI;
    const y = -Math.cos(a);
    pts.push(new THREE.Vector2(Math.sin(a) * shape.r * (1 - shape.taper * y), y * shape.half));
  }
  return pts;
}

export class ItemKit {
  private readonly geos = new Map<string, THREE.BufferGeometry>();
  private readonly mats = new Map<string, THREE.Material>();
  private readonly toys = new Map<string, THREE.Group>();
  /** The stand-in's material, shared by every stand-in so one pulse drives them all. */
  readonly standMat = new THREE.MeshStandardMaterial({
    color: '#ffd9a8',
    emissive: '#ffb060',
    emissiveIntensity: 0.35,
    roughness: 0.4,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });

  private geo<T extends THREE.BufferGeometry>(key: string, make: () => T): T {
    let g = this.geos.get(key);
    if (!g) this.geos.set(key, (g = make()));
    return g as T;
  }

  private mat<T extends THREE.Material>(key: string, make: () => T): T {
    let m = this.mats.get(key);
    if (!m) this.mats.set(key, (m = make()));
    return m as T;
  }

  /** How many geometries and materials the kit holds (for tests and the leak probe). */
  get counts(): { geometries: number; materials: number; toys: number } {
    return { geometries: this.geos.size, materials: this.mats.size, toys: this.toys.size };
  }

  /**
   * A stand-in for a figure still being sculpted: a low, round, warm shimmer sitting on
   * the grass, sized to the look's height. Nothing upright and pale, so a row of them
   * never reads as grave markers. `placeStand` sets it on the ground and pulses it.
   */
  stand(height: number): THREE.Mesh {
    const m = new THREE.Mesh(
      this.geo('stand', () => new THREE.SphereGeometry(0.5, 20, 12)),
      this.standMat,
    );
    m.userData.base = new THREE.Vector3(height * 0.42, height * 0.26, height * 0.42);
    m.scale.copy(m.userData.base as THREE.Vector3);
    m.renderOrder = 1;
    return m;
  }

  /** Pulse every stand-in's glow together (once a frame). */
  pulseStands(t: number): void {
    this.standMat.emissiveIntensity = 0.3 + Math.sin(t * 2.4) * 0.15;
    this.standMat.opacity = 0.34 + Math.sin(t * 2.4) * 0.06;
  }

  /** An egg or cocoon shell; the key says when it must be rebuilt (`shellKey`). */
  shell(n: Nubbin): THREE.Mesh {
    const mesh = n.stage === 'cocoon' ? this.cocoon(n) : this.egg(n);
    mesh.castShadow = true;
    return mesh;
  }

  private egg(n: Nubbin): THREE.Mesh {
    if (isJewel(n.eggColor)) {
      const jewel = JEWELS.find((j) => j.name === n.eggColor) ?? JEWELS[0]!;
      const shape = EGG_SHAPES.chao;
      const geo = this.geo('egg:jewel', () => {
        // A low-poly gem: the icosphere's faces kept flat (its triangles share no
        // vertices, so the normals come out one per face), stretched to an egg.
        const g = new THREE.IcosahedronGeometry(1, 1);
        g.scale(shape.r, shape.half, shape.r);
        g.computeVertexNormals();
        return g;
      });
      const mat = this.mat(
        `egg:jewel:${jewel.name}`,
        () =>
          new THREE.MeshPhysicalMaterial({
            color: jewel.body,
            emissive: jewel.crownShade,
            emissiveIntensity: 0.3,
            roughness: 0.12,
            metalness: 0.1,
            clearcoat: 1,
            clearcoatRoughness: 0.04,
            iridescence: 0.25,
            flatShading: true,
          }),
      );
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.half = shape.half;
      return mesh;
    }
    const family = eggFamily(n);
    const shape = EGG_SHAPES[family];
    const geo = this.geo(`egg:${family}`, () => new THREE.LatheGeometry(eggProfile(shape), 28));
    const mat = this.mat(`egg:${family}:${n.eggColor}`, () => {
      const map = eggTexture(family, n.eggColor);
      return new THREE.MeshPhysicalMaterial({
        map,
        roughness: 0.5,
        clearcoat: 0.3,
      });
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.half = shape.half;
    return mesh;
  }

  private cocoon(n: Nubbin): THREE.Mesh {
    const geo = this.geo(
      'cocoon',
      () =>
        new THREE.LatheGeometry(
          COCOON_PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
          24,
        ),
    );
    const c = COCOON[cocoonColourKey(n)] ?? COCOON.evolve!;
    // Its own material: a departing cocoon fades and a rebirth one shimmers (see Actors).
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshPhysicalMaterial({
        color: c.color,
        roughness: 0.15,
        clearcoat: 1,
        // No transmission: one transmissive mesh on screen costs a second draw of the scene.
        emissive: c.emissive,
        emissiveIntensity: 0.5,
        transparent: true,
      }),
    );
    // The lathe's foot is half a unit below its origin.
    mesh.userData.half = 0.5;
    mesh.userData.ownMaterial = true;
    return mesh;
  }

  /** An item's model and how high its origin sits above the ground. */
  item(i: Item): { mesh: THREE.Object3D; lift: number } {
    if (i.kind === 'toy') return { mesh: this.toy(i.toy), lift: 0 };
    let mesh: THREE.Mesh;
    if (i.kind === 'fruit') {
      const colour = i.flavor ? FRUIT_COLOURS[i.flavor] : FRUIT_PLAIN;
      mesh = new THREE.Mesh(
        this.geo('fruit', () => new THREE.SphereGeometry(0.2, 14, 10)),
        this.mat(
          `fruit:${colour}`,
          () => new THREE.MeshPhysicalMaterial({ color: colour, roughness: 0.35, clearcoat: 0.6 }),
        ),
      );
    } else {
      mesh = new THREE.Mesh(
        this.geo('notebook', () => new THREE.BoxGeometry(0.36, 0.06, 0.46)),
        this.mat(
          'notebook',
          () => new THREE.MeshStandardMaterial({ color: '#f0e6c8', roughness: 0.8 }),
        ),
      );
    }
    mesh.castShadow = true;
    return { mesh, lift: 0.2 };
  }

  /** A toy: a clone of the kind's one model, sharing its geometry and materials. */
  private toy(kind: ToyKind | undefined): THREE.Object3D {
    const key = kind ?? 'ball';
    let t = this.toys.get(key);
    if (!t) this.toys.set(key, (t = buildToy(kind)));
    return t.clone();
  }

  /** Take a prop out of the scene, disposing whatever it owned alone. */
  release(o: THREE.Object3D): void {
    o.removeFromParent();
    o.traverse((x) => {
      const m = x as THREE.Mesh;
      if (m.userData.ownMaterial && m.material) (m.material as THREE.Material).dispose();
    });
  }

  dispose(): void {
    for (const g of this.geos.values()) g.dispose();
    for (const m of this.mats.values()) {
      (m as THREE.MeshStandardMaterial).map?.dispose();
      m.dispose();
    }
    for (const t of this.toys.values())
      t.traverse((x) => {
        const m = x as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    this.geos.clear();
    this.mats.clear();
    this.toys.clear();
    this.standMat.dispose();
  }
}

/** The key that decides when a Nubbin's shell must be rebuilt. */
export function shellKey(n: Nubbin): string {
  return n.stage === 'cocoon'
    ? `shell:cocoon:${cocoonColourKey(n)}`
    : `shell:egg:${eggFamily(n)}:${n.eggColor}`;
}

/**
 * The shell pattern, painted in the lathe's UV space: u runs round the egg, v from the
 * bottom (canvas bottom) to the top (canvas top). A dot is drawn as an ellipse, as the
 * circumference is wider than the height.
 */
function eggTexture(family: Family, name: string): THREE.CanvasTexture {
  const W = 128;
  const H = 64;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d')!;
  const pix = EGG_PALETTES[name] ?? EGG_PALETTES.plain!;
  const plain = name === 'plain' ? FAMILY_PLAIN[family] : undefined;
  const body = EGG_COLOURS.find((c) => c.name === name)?.body;
  const shell = plain?.shell ?? body ?? (name === 'plain' ? '#f3efe2' : color(pix.shell));
  const cap = plain?.cap ?? color(pix.cap);
  const spot = plain?.spot ?? color(pix.spot);
  g.fillStyle = shell;
  g.fillRect(0, 0, W, H);
  // The cap: a soft band over the top, its edge a gentle wave.
  g.fillStyle = cap;
  g.beginPath();
  g.moveTo(0, 0);
  for (let x = 0; x <= W; x += 4) g.lineTo(x, H * 0.16 + Math.sin((x / W) * Math.PI * 6) * 1.5);
  g.lineTo(W, 0);
  g.closePath();
  g.fill();
  g.fillStyle = spot;
  g.strokeStyle = spot;
  if (family === 'digi') {
    // Three bands round the egg, each tilted (a tilted ring is a sine wave in u).
    g.lineWidth = 3;
    for (const v of [0.34, 0.5, 0.66]) {
      g.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = H * (1 - v) + Math.sin((x / W) * Math.PI * 2) * 4;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
  } else {
    // Spots scattered round the egg: big and green on the pocket line, small on the Chao's.
    const big = family === 'pocket';
    const spots: Array<[number, number]> = [
      [0.08, 0.55],
      [0.27, 0.35],
      [0.42, 0.62],
      [0.6, 0.4],
      [0.78, 0.58],
      [0.92, 0.3],
      [0.18, 0.2],
      [0.68, 0.18],
    ];
    for (const [u, v] of spots) {
      const r = big ? 4.5 : 2;
      g.beginPath();
      g.ellipse(u * W, H * (1 - v), r * 1.6, r, 0, 0, Math.PI * 2);
      g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Set a stand-in on the ground at x, z (ground height `gy`), sunk a little into the grass,
 * and swell it softly, each one a little out of step with its neighbours.
 */
export function placeStand(m: THREE.Object3D, x: number, gy: number, z: number, t: number): void {
  const base = m.userData.base as THREE.Vector3 | undefined;
  const k = 1 + Math.sin(t * 2.4 + x * 1.7 + z) * 0.05;
  if (base) m.scale.set(base.x * k, base.y * (2 - k), base.z * k);
  m.position.set(x, gy + m.scale.y * 0.3, z);
}
