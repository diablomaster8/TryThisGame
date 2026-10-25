import { GRANDCHILD3D } from '../config/tuning-fx3d';
import { keeperSpec, type KeeperColors } from './keeper-spec';
import { V, type Prim } from './sculpted';
import type { Mark, SpeciesSpec } from './species';
import { tuft, tuftRow } from './species-kit';

/**
 * The player's own avatar in Full 3D: Hazel's grandchild (fx-rules 2026-10-25, the shared
 * Keeper decision). Every trainer stands in the Grove as an NPC on the Keeper figure, so the
 * avatar must never read as one of them. It keeps the Keeper's body, rig and poses (carry,
 * throw, pet, sit) and changes what tells a figure apart at a glance:
 * - hair: a soft copper bob with a side-swept fringe and a cowlick at the crown, where every
 *   trainer has the spiky mop (and most wear a hat or goggles over it);
 * - a two-leaf clip at the right temple, Hazel's garden;
 * - face: freckles and green eyes, a touch larger;
 * - outfit cut: dungarees (a bib, crossed-back straps and two buttons) over the tee instead of
 *   the open vest and wristbands; no goggles;
 * - a little shorter (`GRANDCHILD3D.heightShare`, applied by the look's height).
 * The picked role supplies the outfit colours (tee, bib and straps from its vest colour,
 * trousers, shoes, trim) through `keeperColours`, so switching Keeper changes only those, the
 * Sun or Moon trim and the badge. Hair, skin and eyes are the grandchild's own.
 */
export function grandchildColours(outfit: KeeperColors): KeeperColors {
  const g = GRANDCHILD3D;
  return { ...outfit, hair: g.hair, skin: g.skin, blush: g.blush, iris: g.iris };
}

function hair(c: KeeperColors): Prim[] {
  const g = GRANDCHILD3D;
  const ell = (x: number, y: number, z: number, rx: number, ry: number, rz: number): Prim => ({
    kind: 'ellipsoid',
    a: V(x, y, z),
    radii: V(rx, ry, rz),
    r: 0,
    color: c.hair,
    tag: 'hair',
    blend: 0.06,
  });
  return [
    // The bob: a cap over the crown and a fuller back that falls to the jaw.
    ell(0, 2.92, -0.1, 0.72, 0.48, 0.68),
    ell(0, 2.55, -0.24, 0.74, 0.52, 0.54),
    // Side locks framing the face, short of the jaw and clear of the eyes.
    ell(-0.6, 2.5, 0.12, 0.17, 0.34, 0.26),
    ell(0.6, 2.5, 0.12, 0.17, 0.34, 0.26),
    // The fringe, swept to the right above the brows.
    ...tuftRow(
      V(-0.36, 3.02, 0.46),
      V(0.22, 3.06, 0.5),
      3,
      V(0.7, -0.45, 0.55),
      0.32,
      0.13,
      c.hair,
      0.8,
      'hair',
    ),
    // The cowlick at the crown and its curl, in the shade so they read against the bob.
    tuft(V(0.05, 3.3, -0.12), V(0.2, 1, 0.1), 0.32, 0.09, g.hairShade, 'hair'),
    tuft(V(0.13, 3.58, -0.08), V(0.9, 0.15, 0.3), 0.2, 0.06, g.hairShade, 'hair'),
    // The leaf clip: two leaves at the right temple.
    {
      kind: 'capsule',
      a: V(0.44, 2.98, 0.42),
      b: V(0.64, 3.12, 0.3),
      r: 0.07,
      color: g.leaf,
      tag: 'clip',
    },
    {
      kind: 'capsule',
      a: V(0.44, 2.98, 0.42),
      b: V(0.62, 2.86, 0.44),
      r: 0.06,
      color: g.leaf,
      tag: 'clip',
    },
  ];
}

function marks(c: KeeperColors): Mark[] {
  const g = GRANDCHILD3D;
  const dot = (x: number, y: number, z: number): Mark => ({
    kind: 'sphere',
    a: V(x, y, z),
    r: 0.03,
    color: g.freckle,
    soft: 0,
  });
  const freckles = [
    [0.3, 2.46, 0.55],
    [0.38, 2.5, 0.51],
    [0.35, 2.4, 0.53],
  ].flatMap(([x, y, z]) => [dot(-x!, y!, z!), dot(x!, y!, z!)]);
  const strap = (s: -1 | 1): Mark => ({
    kind: 'capsule',
    a: V(0.24 * s, 1.98, 0.4),
    b: V(-0.28 * s, 2.0, -0.4),
    r: 0.065,
    color: c.vest,
    soft: 0,
  });
  const button = (s: -1 | 1): Mark => ({
    kind: 'sphere',
    a: V(0.24 * s, 1.96, 0.45),
    r: 0.05,
    color: c.stripe,
    soft: 0,
  });
  // The badge again, on the bib (the stock one sits under it): a sun disc or a crescent cut
  // by a disc of the bib colour.
  const badge: Mark[] =
    c.emblem === 'sun'
      ? [{ kind: 'sphere', a: V(0, 1.72, 0.53), r: 0.11, color: c.badge, soft: 0 }]
      : [
          { kind: 'sphere', a: V(0, 1.72, 0.53), r: 0.11, color: c.badge, soft: 0 },
          { kind: 'sphere', a: V(0.06, 1.76, 0.55), r: 0.09, color: c.vest, soft: 0 },
        ];
  return [
    ...freckles,
    // The bib, the straps crossing over the shoulders to the back, the buttons.
    { kind: 'ellipsoid', a: V(0, 1.7, 0.36), radii: V(0.34, 0.34, 0.17), color: c.vest, soft: 0 },
    strap(-1),
    strap(1),
    button(-1),
    button(1),
    ...badge,
    // Leaf veins on the clip.
    {
      kind: 'capsule',
      a: V(0.46, 2.99, 0.47),
      b: V(0.62, 3.1, 0.36),
      r: 0.012,
      color: g.leafVein,
      soft: 0,
    },
  ];
}

/** The grandchild in an outfit (the picked role's colours for its side). */
export function grandchildSpec(outfit: KeeperColors): SpeciesSpec {
  const c = grandchildColours(outfit);
  return keeperSpec(c, 'Grandchild', {
    hair: hair(c),
    goggles: false,
    vest: false,
    wristbands: false,
    marks: marks(c),
    eyes: { r: 0.165, tall: 1.38, irisScale: 0.76 },
    notes:
      "The player's avatar (fx-rules 2026-10-25): Hazel's grandchild on the Keeper body, " +
      'copper bob, leaf clip, freckles, dungarees; distinct from every trainer NPC.',
  });
}
