import {
  BoxGeometry,
  CapsuleGeometry,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
} from 'three';
import type { Rigged } from '../samples/species';
import { bellyOf, headDome } from '../samples/nubbin-critter-parts';
import { DYE_COLORS } from '../render/sprites/chao';
import { C, color, nearestIndex, shadeOf } from '../render/sprites/palette';
import type { DyeColor, Nubbin } from '../sim/types';
import { specForKey } from './looks';
import { stubOnce } from './stubs';
import { cosmetic, eggshellColour, type CosmeticColour } from '../config/cosmetics';
import { eggPalette } from '../render/sprites/egg-palette';

/**
 * What a Nubbin wears on top of its sculpted body in Full 3D: the hat (with its dye), the
 * scarf and the glasses. They hang on the head and hip bones as plain meshes, so a change
 * of hat never re-sculpts the body; geometry is shared per item kind and materials per
 * colour, and both are disposed with the dresser. Critter parts and character looks are not
 * here: they change the body, so they are part of the look key (`looks.ts`). The one
 * exception is a character look's head accessory on an adult or Eternal (the fox's twin
 * tails, the echidna's dreadlocks, the rose's headband, the dream's jester cap): an adult
 * keeps its form's shape under the look's palette, so the accessory is worn like a hat, as
 * the pixel view does; a child wears the look's whole figure and needs no hat.
 *
 * Every piece is placed from the rig's spec (read back from `userData.lookKey`, which the
 * pool stamps): hats sit on the top of the head's dome and scale with it, the glasses in
 * front of the spec's eyes, the scarf round the bottom of the dome.
 */

/** Unit geometries, scaled per piece. */
type GeoKind = 'cyl' | 'sphere' | 'dome' | 'cone' | 'torus' | 'ring' | 'capsule' | 'box';

const GEOMETRY: Record<GeoKind, () => BufferGeometry> = {
  cyl: () => new CylinderGeometry(1, 1, 1, 24),
  sphere: () => new SphereGeometry(1, 16, 12),
  dome: () => new SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2),
  cone: () => new ConeGeometry(1, 1, 12),
  torus: () => new TorusGeometry(1, 0.15, 8, 28),
  ring: () => new TorusGeometry(1, 0.09, 6, 24),
  capsule: () => new CapsuleGeometry(0.5, 1, 4, 10),
  box: () => new BoxGeometry(1, 1, 1),
};

type V3 = readonly [number, number, number];

/** One mesh of an item: geometry, palette colour, position, scale and Euler rotation. */
interface Piece {
  geo: GeoKind;
  col: number;
  pos: V3;
  scale: V3 | number;
  rot?: V3;
}

/**
 * Where an item hangs: on the top of the dome, before the eyes or round the bottom of the dome
 * (head bone), or on the back or round the middle of the belly (hips).
 */
interface Item {
  at: 'top' | 'tail' | 'face' | 'neck' | 'body';
  pieces: Piece[];
}

const p = (geo: GeoKind, col: number, pos: V3, scale: V3 | number, rot?: V3): Piece => ({
  geo,
  col,
  pos,
  scale,
  ...(rot ? { rot } : {}),
});

/** A cone hanging along `rot` from `pos`, with a ball at its tip. */
function spike(pos: V3, rot: V3, len: number, r: number, col: number, tip: number): Piece[] {
  // A cone's tip is +y; rotate that the same way to find where the ball goes.
  const dir = new Vector3(0, 1, 0).applyEuler(new Euler(rot[0], rot[1], rot[2]));
  const mid: V3 = [
    pos[0] + (dir.x * len) / 2,
    pos[1] + (dir.y * len) / 2,
    pos[2] + (dir.z * len) / 2,
  ];
  const end: V3 = [pos[0] + dir.x * len, pos[1] + dir.y * len, pos[2] + dir.z * len];
  return [p('cone', col, mid, [r, len, r], rot), p('sphere', tip, end, r * 0.55)];
}

const NAVY = nearestIndex('#2443c4');
const SHADE_GREY = nearestIndex('#8c8a96');

/**
 * The hats, in the units of the base Nubbin's head (dome half-width 0.74), with the origin on
 * the top of the dome. Colours follow the pixel drawer's, so the dye swaps the same ones.
 */
const HATS: Record<string, Item> = {
  straw: {
    at: 'top',
    pieces: [
      p('cyl', C.cream, [0, -0.28, 0], [0.95, 0.05, 0.95]),
      p('cyl', C.cream, [0, -0.06, 0], [0.5, 0.42, 0.5]),
      p('dome', C.cream, [0, 0.15, 0], [0.5, 0.14, 0.5]),
      p('cyl', C.ember, [0, -0.19, 0], [0.52, 0.1, 0.52]),
    ],
  },
  crown: {
    at: 'top',
    pieces: [
      p('cyl', C.sunYellow, [0, 0.02, 0], [0.42, 0.28, 0.42]),
      ...[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return p(
          'cone',
          C.sunYellow,
          [Math.sin(a) * 0.36, 0.25, Math.cos(a) * 0.36],
          [0.09, 0.2, 0.09],
        );
      }),
      p('sphere', C.rose, [0, 0.02, 0.43], 0.065),
      p('sphere', C.water, [-0.3, 0.02, 0.31], 0.05),
      p('sphere', C.water, [0.3, 0.02, 0.31], 0.05),
    ],
  },
  beanie: {
    at: 'top',
    pieces: [
      p('dome', C.ember, [0, -0.3, 0], [0.8, 0.62, 0.8]),
      p('cyl', C.pale, [0, -0.3, 0], [0.82, 0.12, 0.82]),
      p('sphere', C.cream, [0, 0.36, 0], 0.14),
    ],
  },
  flower: {
    at: 'top',
    pieces: [
      ...(
        [
          [0, 0.15],
          [0.15, 0],
          [0, -0.15],
          [-0.15, 0],
        ] as const
      ).map(([dx, dy]) => p('sphere', C.rose, [0.38 + dx, -0.08 + dy, 0.2], 0.13)),
      p('sphere', C.sunYellow, [0.38, -0.08, 0.3], 0.1),
      p('sphere', C.leaf, [0.22, -0.3, 0.2], [0.13, 0.06, 0.09]),
    ],
  },
  bucket: {
    at: 'top',
    pieces: [
      p('cyl', C.teal, [0, -0.05, 0], [0.55, 0.4, 0.55]),
      p('dome', C.teal, [0, 0.15, 0], [0.55, 0.1, 0.55]),
      p('cyl', C.teal, [0, -0.25, 0], [0.85, 0.05, 0.85]),
      p('cyl', C.mint, [0, -0.17, 0], [0.57, 0.08, 0.57]),
    ],
  },
  // Character looks' accessories, for adults (a child wears the look's whole figure).
  'look-fox': {
    at: 'tail',
    pieces: [-1, 1].flatMap((dx) => [
      p('capsule', C.orange, [dx * 0.28, 0.2, -0.3], [0.32, 0.5, 0.32], [-0.9, 0, -dx * 0.5]),
      p('sphere', C.white, [dx * 0.42, 0.48, -0.56], 0.2),
    ]),
  },
  'look-echidna': {
    at: 'top',
    pieces: (
      [
        [-0.55, -0.45, -0.3],
        [0.55, -0.45, -0.3],
        [-0.3, -0.3, -0.52],
        [0.3, -0.3, -0.52],
      ] as const
    ).flatMap(([x, y, z]) =>
      spike([x, y, z], [Math.PI + 0.5, 0, x * 0.4], 0.45, 0.1, C.ember, C.berry),
    ),
  },
  'look-rose': {
    at: 'top',
    pieces: [
      p('torus', C.ember, [0, -0.22, 0.02], [0.56, 0.56, 0.56], [Math.PI / 2, 0, 0]),
      p('sphere', C.ember, [0.36, -0.08, 0.22], [0.12, 0.1, 0.06]),
      p('sphere', C.ember, [0.56, -0.06, 0.16], [0.1, 0.09, 0.06]),
      p('sphere', C.cream, [0.46, -0.07, 0.24], 0.045),
    ],
  },
  'look-dream': {
    at: 'top',
    pieces: [
      p('dome', C.violet, [0, -0.25, 0], [0.74, 0.42, 0.74]),
      ...spike([-0.2, 0.05, 0], [0, 0, 0.8], 0.6, 0.2, C.violet, C.sunYellow),
      ...spike([0.2, 0.05, 0], [0, 0, -0.8], 0.6, 0.2, C.moonPurple, C.sunYellow),
    ],
  },
  // Quills and Shade (LOOK-27), the same shapes as the pixel drawer's.
  'look-quills': {
    at: 'top',
    pieces: [-0.5, -0.25, 0, 0.25, 0.5].flatMap((x) =>
      spike(
        [x, -0.28 + Math.abs(x) * 0.2, -0.28],
        [-1.15, 0, -x * 1.1],
        0.62 - Math.abs(x) * 0.2,
        0.13,
        NAVY,
        NAVY,
      ),
    ),
  },
  'look-shade': {
    at: 'top',
    pieces: [
      ...[-1, 1].flatMap((d) => [
        p('cone', C.darkPlum, [d * 0.42, 0.02, 0], [0.2, 0.62, 0.13], [0, 0, -d * 0.25]),
        p('cone', SHADE_GREY, [d * 0.4, 0.0, 0.06], [0.11, 0.4, 0.06], [0, 0, -d * 0.25]),
      ]),
      ...spike([0, -0.1, -0.3], [-0.6, 0, 0], 0.45, 0.1, C.white, C.white),
    ],
  },
};

/** The hat ids the Dresser draws by hand (every one the pixel drawer has). */
export const DRESS_HATS: readonly string[] = Object.keys(HATS);

const SLOT_AT = { hat: 'top', face: 'face', neck: 'neck', back: 'tail', body: 'body' } as const;

/**
 * A registry wearable (`config/cosmetics.ts`) built from its mesh list, in the same palette
 * colours as its pixel shapes; the eggshell takes its egg's colours. Null when it has none.
 */
export function registryItem(id: string): Item | null {
  const c = cosmetic(id);
  if (!c || c.bespoke || !c.mesh) return null;
  const shell = eggshellColour(id);
  const egg = eggPalette(shell ?? 'plain');
  const col = (k: CosmeticColour): number =>
    k.startsWith('egg.')
      ? egg[k.slice(4) as 'shell' | 'shade' | 'cap' | 'spot']
      : C[k as keyof typeof C];
  return {
    at: SLOT_AT[c.slot],
    pieces: c.mesh.map(([geo, k, pos, scale, rot]) => p(geo, col(k), pos, scale, rot)),
  };
}

/** The dye swaps the hat's main colours for the dye and its warm shades for the dye's shade. */
const DYE_MAIN = new Set<number>([C.cream, C.sunYellow, C.teal, C.rose, C.violet]);
const DYE_SHADE = new Set<number>([C.ember, C.moonPurple, C.plum, C.orange]);

function dyed(col: number, dye: DyeColor | null): number {
  if (!dye) return col;
  const d = DYE_COLORS[dye];
  if (DYE_MAIN.has(col)) return d;
  if (DYE_SHADE.has(col)) return shadeOf(d);
  return col;
}

/** Where things go on a rig, in its bones' own spaces (spec units). */
interface Anchors {
  /** The top of the dome, in head-bone space, and the hat scale (x/z and y). */
  top: Vector3;
  s: number;
  sy: number;
  /** The back of the belly, in hip-bone space. */
  tail: Vector3;
  /** Eye centres (right eye; mirror x), ring radius and height factor, in head-bone space. */
  eye: Vector3;
  eyeR: number;
  eyeTall: number;
  /** The scarf: the ring's centre and radius in head-bone space. */
  neck: Vector3;
  neckR: number;
  /** The belly's centre in hip-bone space, and its width over the base Nubbin's head. */
  waist: Vector3;
  waistS: number;
  /** LOOK-54: high on the front of the dome, under the crown, in head-bone space. */
  brow: Vector3;
}

function anchorsFor(key: string): Anchors {
  const spec = specForKey(key);
  const P = spec.head.pivot;
  const d = headDome(spec);
  const b = bellyOf(spec);
  const e = spec.eyes;
  // The eye sits on the dome: push the ring just proud of the surface there.
  const u = (e.x - d.c.x) / d.rx;
  const v = (e.y - d.c.y) / d.ry;
  const front = d.c.z + d.rz * Math.sqrt(Math.max(0, 1 - u * u - v * v));
  return {
    top: new Vector3(d.c.x - P.x, d.c.y + d.ry - P.y, d.c.z - P.z),
    s: d.rx / 0.74,
    sy: d.ry / 0.68,
    tail: new Vector3(b.c.x, b.c.y - b.ry * 0.05 - spec.hipY, b.c.z - b.rz * 0.85),
    eye: new Vector3(e.x, e.y - P.y, Math.max(front, e.z) + 0.05 - P.z),
    eyeR: e.r * 1.05,
    eyeTall: e.tall ?? 1.2,
    neck: new Vector3(d.c.x - P.x, d.c.y - d.ry * 0.86 - P.y, d.c.z - P.z),
    neckR: d.rx * 0.56,
    waist: new Vector3(b.c.x, b.c.y - spec.hipY, b.c.z),
    waistS: b.rx / 0.74,
    brow: new Vector3(d.c.x - P.x, d.c.y + d.ry * 0.72 - P.y, d.c.z + d.rz * 0.71 - P.z),
  };
}

/** What a rig wears now, kept on its `userData` so an unchanged Nubbin costs a few compares. */
interface Worn {
  hat: string | null;
  dye: DyeColor | null;
  scarf: DyeColor | null;
  glasses: boolean;
  /** LOOK-54: rebirth stars shown (0-3), or 4 for the ring. */
  stars: number;
  groups: Group[];
}

export class Dresser {
  private readonly geos = new Map<GeoKind, BufferGeometry>();
  private readonly mats = new Map<number, MeshStandardMaterial>();

  /** Dress (or undress) a rig to match a Nubbin; cheap when nothing changed. */
  update(rig: Rigged, n: Nubbin): void {
    const ud = rig.group.userData as { dress?: Worn; dressAt?: Anchors; lookKey?: string };
    const dressable = n.stage !== 'egg' && n.stage !== 'cocoon';
    let hat = dressable ? n.hat : null;
    // LOOK-61: every line wears the shop hats on its head dome; the character looks are the Chao's.
    if (hat?.startsWith('look-') && n.species !== 'chao') hat = null;
    // A child with a character look already wears the look's whole figure.
    if (hat?.startsWith('look-') && n.stage !== 'adult') hat = null;
    const item = hat ? (HATS[hat] ?? registryItem(hat)) : null;
    if (hat && !item) {
      stubOnce(`hat:${hat}`, 'no 3D hat; drawn bare');
      hat = null;
    }
    const dye = hat ? (n.hatDye ?? null) : null;
    const scarf = dressable ? (n.scarf ?? null) : null;
    const glasses = dressable && !!n.glasses;
    const stars = dressable ? Math.min(4, n.rebirths) : 0;
    const w = ud.dress;
    if (
      w &&
      w.hat === hat &&
      w.dye === dye &&
      w.scarf === scarf &&
      w.glasses === glasses &&
      w.stars === stars
    )
      return;
    if (!w && !hat && !scarf && !glasses && !stars) return;
    this.strip(rig);
    if (!hat && !scarf && !glasses && !stars) return;
    const head = rig.bones.head;
    const hips = rig.bones.hips;
    if (!head || !hips) return;
    const at = (ud.dressAt ??= anchorsFor(ud.lookKey ?? 'nubbin'));
    const groups: Group[] = [];
    if (hat && item) {
      const g = this.build(item.pieces, (c) => dyed(c, dye));
      if (item.at === 'top') {
        g.position.copy(at.top);
        g.scale.set(at.s, at.sy, at.s);
        head.add(g);
      } else if (item.at === 'face' || item.at === 'neck') {
        g.position.copy(item.at === 'neck' ? at.neck : at.eye).setX(0);
        g.scale.setScalar(at.s);
        head.add(g);
      } else if (item.at === 'body') {
        g.position.copy(at.waist);
        g.scale.setScalar(at.waistS);
        hips.add(g);
      } else {
        g.position.copy(at.tail);
        g.scale.setScalar(at.s);
        hips.add(g);
      }
      groups.push(g);
    }
    if (scarf) {
      const sc = DYE_COLORS[scarf];
      const r = at.neckR;
      const g = this.build(
        [
          p('torus', sc, [0, 0, 0], [r, r * 0.8, r], [Math.PI / 2, 0, 0]),
          p('capsule', sc, [r * 0.35, -0.2, r * 0.92], [0.16, 0.22, 0.08], [0.2, 0, 0.15]),
          p(
            'cyl',
            shadeOf(sc),
            [r * 0.35 + 0.03, -0.38, r * 0.92 + 0.04],
            [0.08, 0.03, 0.05],
            [0.2, 0, 0.15],
          ),
        ],
        (c) => c,
      );
      g.position.copy(at.neck);
      head.add(g);
      groups.push(g);
    }
    if (glasses) {
      const { eye, eyeR: r, eyeTall: tall } = at;
      const frame = C.darkPlum;
      const pieces: Piece[] = [-1, 1].map((dx) =>
        p(
          'ring',
          frame,
          [dx * eye.x, eye.y, eye.z],
          [r, r * Math.min(tall, 1.3), r],
          [0, dx * 0.35, 0],
        ),
      );
      const gap = eye.x * 2 - r * 2;
      if (gap > 0.02)
        pieces.push(
          p('cyl', frame, [0, eye.y, eye.z + 0.02], [0.022, gap, 0.022], [0, 0, Math.PI / 2]),
        );
      const g = this.build(pieces, (c) => c);
      head.add(g);
      groups.push(g);
    }
    if (stars) {
      // LOOK-54: a little gold star on the brow per rebirth, three at most; a ring past that.
      const gold = C.sunYellow;
      const pieces: Piece[] = [];
      if (stars > 3) pieces.push(p('torus', gold, [0, 0, 0], [0.09, 0.09, 0.05]));
      else
        for (let i = 0; i < stars; i++) {
          const x = (i - (stars - 1) / 2) * 0.17;
          pieces.push(
            p('box', gold, [x, 0, 0], [0.035, 0.13, 0.03]),
            p('box', gold, [x, 0, 0], [0.13, 0.035, 0.03]),
          );
        }
      const g = this.build(pieces, (c) => c);
      g.position.copy(at.brow);
      g.scale.setScalar(at.s);
      // Tipped back to lie on the dome's slope.
      g.rotation.x = -0.75;
      head.add(g);
      groups.push(g);
    }
    ud.dress = { hat, dye, scarf, glasses, stars, groups };
  }

  /** Take everything off a rig before it goes back to the pool. */
  strip(rig: Rigged): void {
    const ud = rig.group.userData as { dress?: Worn };
    for (const g of ud.dress?.groups ?? []) g.removeFromParent();
    delete ud.dress;
  }

  dispose(): void {
    for (const g of this.geos.values()) g.dispose();
    for (const m of this.mats.values()) m.dispose();
    this.geos.clear();
    this.mats.clear();
  }

  private build(pieces: Piece[], tint: (col: number) => number): Group {
    const g = new Group();
    g.name = 'dress';
    for (const pc of pieces) {
      const m = new Mesh(this.geo(pc.geo), this.mat(tint(pc.col)));
      m.position.set(...pc.pos);
      if (typeof pc.scale === 'number') m.scale.setScalar(pc.scale);
      else m.scale.set(...pc.scale);
      if (pc.rot) m.rotation.set(...pc.rot);
      // Shared geometry and materials: the pool must not free them with the rig.
      m.userData.shared = true;
      g.add(m);
    }
    return g;
  }

  private geo(kind: GeoKind): BufferGeometry {
    let g = this.geos.get(kind);
    if (!g) this.geos.set(kind, (g = GEOMETRY[kind]()));
    return g;
  }

  private mat(col: number): MeshStandardMaterial {
    let m = this.mats.get(col);
    if (!m)
      this.mats.set(col, (m = new MeshStandardMaterial({ color: color(col), roughness: 0.7 })));
    return m;
  }
}
