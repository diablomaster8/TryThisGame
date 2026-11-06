import { V, type Prim } from './sculpted';
import { CHILD, variant, type NubbinVariant, type VariantOverrides } from './nubbin-variants';
import {
  WHITE,
  bigEar,
  catEar,
  braceletArm,
  chestMark,
  cone,
  dress,
  earTips,
  foldedArm,
  gloveArm,
  gogglesUp,
  mechLegs,
  quillCluster,
  quillShades,
  roundEar,
  twinTail,
  widen,
} from './nubbin-lineup-kit';
import type { Mark } from './species';

/**
 * The six unlockable character looks on the child body, matched to Maor's "Chao World" line-up
 * (Part G8b): fox, echidna, rose, dream, quills and shade. The pieces they share live in
 * `nubbin-lineup-kit.ts`; each look is a `variant()` of the child with its own palette.
 */

const QUILLS_BODY = '#2c58e0';
const QUILLS_BELLY = '#f5c99a';
const QUILLS_SHOE = '#d8302a';
/** The quill ball is a shade darker than the dome in the line-up. */
const QUILLS_NAVY = '#2443c4';
const QUILLS_CLUSTER = quillCluster(QUILLS_NAVY);

/** The shade look's flats: near-black suit, grey inner ears. */
const SHADE_BLACK = '#2c2a34';
const SHADE_GREY = '#8c8a96';

/** The dream look's body: a saturated magenta. */
const DREAM_BODY = '#a82a8c';

/** The fox look's flats: orange vest, cream face and feet, black hood, pink trim, navy eyes. */
const FOX_ORANGE = '#f08a1c';
const FOX_CREAM = '#f6e2b4';
const FOX_HOOD = '#16121f';
const FOX_PINK = '#d02a72';
const FOX_NAVY = '#1c2a58';

/** The echidna look's body: a deep crimson-maroon, darker than the flat red of the quills' shoes. */
const ECHIDNA_BODY = '#b8344f';

const look = (id: string, name: string, o: VariantOverrides): NubbinVariant => ({
  id,
  family: 'special',
  spec: variant(CHILD, name, o),
});

export const LINEUP_LOOKS: NubbinVariant[] = [
  look('look-fox', 'Nubbin (Fox look)', {
    // Flat line-up colours: an orange vest over a black hood with a cream face, cream hands
    // and feet. The role colours the base paints as marks all take the orange or cream.
    colors: {
      body: FOX_ORANGE,
      belly: FOX_ORANGE,
      tip: FOX_CREAM,
      pad: FOX_CREAM,
      iris: FOX_NAVY,
      blush: FOX_CREAM,
      star: FOX_ORANGE,
      crownShade: FOX_HOOD,
    },
    crown: 'none',
    slots: {
      ears: [],
      tail: [twinTail('tail', -1, FOX_ORANGE), twinTail('tail2', 1, FOX_ORANGE)],
      arms: [
        gloveArm(-1, FOX_ORANGE, WHITE, { y: 1.1, reach: 0.55 }),
        gloveArm(1, FOX_ORANGE, WHITE, { y: 1.1, reach: 0.55 }),
      ],
    },
    ball: { color: '#f29c2e', glow: '#b86a10' },
    hints: [
      // Black sides to the vest and the gold bell under it.
      ...[-1, 1].map((dx) => ({
        kind: 'ellipsoid' as const,
        a: V(dx * 0.5, 0.85, 0.3),
        radii: V(0.16, 0.3, 0.22),
        color: FOX_HOOD,
        soft: 0.01,
      })),
      { kind: 'sphere' as const, a: V(0, 0.55, 0.58), r: 0.09, color: '#f2c94c', soft: 0.01 },
    ],
    headScale: 1.2,
    eyes: {
      x: 0.5,
      y: 2.12,
      r: 0.17,
      tall: 1.4,
      irisScale: 1,
      iris: FOX_NAVY,
      lidColor: FOX_CREAM,
      lid: 0,
      brow: false,
    },
    mouth: { shape: 'smile', width: 0.14, y: 1.8, z: 1.0, line: '#b8895a' },
    patch: (spec) => {
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.25, 0);
      dome.radii!.set(0.95, 0.85, 0.9);
      // The face is cream; the hood is painted over the top of it, down to a pink V.
      dome.color = FOX_CREAM;
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.02, 0);
      belly.radii!.set(0.58, 0.5, 0.55);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      // A point on the dome's skin at (x, y), pushed a hair out.
      const onDome = (x: number, y: number, out = 0.03): ReturnType<typeof V> =>
        V(x, y, 0.9 * Math.sqrt(Math.max(0, 1 - (x / 0.95) ** 2 - ((y - 2.25) / 0.85) ** 2)) + out);
      // The V: from the temples at y 2.25 down to an apex at y 1.72, as short capsules that
      // follow the dome (a straight chord would cut inside it and paint nothing).
      const vLine = (r: number, lift: number, color: string): Mark[] => {
        const out: Mark[] = [];
        for (const dx of [-1, 1])
          for (let i = 0; i < 4; i++) {
            const x0 = (i / 4) * 0.94;
            const x1 = ((i + 1) / 4) * 0.94;
            const y = (x: number) => 2.0 + 0.64 * x + lift;
            out.push({
              kind: 'capsule',
              a: onDome(dx * x0, y(x0)),
              b: onDome(dx * x1, y(x1)),
              r,
              color,
              soft: 0.01,
            });
          }
        return out;
      };
      spec.marks.push(
        // The hood: black over the back and crown, and thick black capsules riding above the
        // V line so their lower edge is the V.
        {
          kind: 'ellipsoid',
          a: V(0, 3.05, -0.2),
          radii: V(1.1, 0.7, 1.0),
          color: FOX_HOOD,
          soft: 0.01,
        },
        {
          kind: 'ellipsoid',
          a: V(0, 2.3, -0.9),
          radii: V(0.9, 0.8, 0.3),
          color: FOX_HOOD,
          soft: 0.01,
        },
        ...vLine(0.5, 0.5, FOX_HOOD),
        ...vLine(0.1, 0, FOX_PINK),
        // The orange crown with a pale stripe.
        {
          kind: 'ellipsoid',
          a: V(-0.1, 3.12, 0.05),
          radii: V(0.7, 0.3, 0.6),
          color: FOX_ORANGE,
          soft: 0.01,
        },
        {
          kind: 'capsule',
          a: V(-0.4, 3.1, 0.25),
          b: V(0.3, 3.1, -0.1),
          r: 0.06,
          color: WHITE,
          soft: 0.01,
        },
      );
      const gg = gogglesUp('#bfe8ff', '#4a3a30');
      spec.head.prims.push(...gg.prims);
      spec.marks.push(...gg.marks);
      widen(spec.head, { x: 1.4, z: -1.2 });
      mechLegs(spec, {
        leg: FOX_ORANGE,
        ring: FOX_CREAM,
        shoe: FOX_CREAM,
        stripe: FOX_CREAM,
        size: 0.9,
      });
    },
    notes:
      'Line-up figure 3 (Part G8b): a cream face under a black hood edged by a pink V, an orange ' +
      'crown, big navy eyes, goggles pushed up on the right, an orange vest, cream shoes, twin tails.',
  }),
  look('look-echidna', 'Nubbin (Echidna look)', {
    colors: {
      body: ECHIDNA_BODY,
      belly: WHITE,
      tip: WHITE,
      pad: ECHIDNA_BODY,
      iris: '#1e7a74',
      blush: ECHIDNA_BODY,
      star: ECHIDNA_BODY,
      crownShade: WHITE,
    },
    // A low white tuft of short spikes on the top of the dome, in place of the crown.
    crown: [
      cone(V(0, 2.6, 0.1), V(0, 2.98, 0.05), 0.26, 0.03, WHITE, 'crown', 0.03),
      cone(V(-0.3, 2.58, 0.1), V(-0.64, 2.86, 0), 0.22, 0.03, WHITE, 'crown', 0.03),
      cone(V(0.3, 2.58, 0.1), V(0.64, 2.86, 0), 0.22, 0.03, WHITE, 'crown', 0.03),
      cone(V(-0.15, 2.55, 0.35), V(-0.32, 2.9, 0.55), 0.2, 0.03, WHITE, 'crown', 0.03),
      cone(V(0.15, 2.55, 0.35), V(0.32, 2.9, 0.55), 0.2, 0.03, WHITE, 'crown', 0.03),
    ],
    slots: {
      ears: [bigEar(-1, WHITE, ECHIDNA_BODY), bigEar(1, WHITE, ECHIDNA_BODY)],
      arms: [
        gloveArm(-1, ECHIDNA_BODY, WHITE, { y: 1.3, reach: 0.8 }),
        gloveArm(1, ECHIDNA_BODY, WHITE, { y: 1.3, reach: 0.8 }),
      ],
    },
    // The reference's ball is a flat green ring floating over the head.
    ball: { shape: 'halo', color: '#2fa84a', glow: '#1e7a3a' },
    hints: [
      // A big white belly patch with a green dot.
      {
        kind: 'ellipsoid',
        a: V(0, 0.98, 0.5),
        radii: V(0.36, 0.36, 0.3),
        color: WHITE,
        soft: 0.01,
      },
      { kind: 'sphere', a: V(0, 1.2, 0.52), r: 0.1, color: '#4cc47a', soft: 0.01 },
    ],
    headScale: 1.2,
    eyes: { r: 0.34, tall: 1.15, brow: false },
    mouth: { shape: 'smile', width: 0.26, y: 1.72, z: 1.0, line: '#c8203a' },
    patch: (spec) => {
      // A wide, low dome and a small body, as in the line-up.
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.0, 0);
      dome.radii!.set(1.12, 0.8, 0.92);
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.0, 0);
      belly.radii!.set(0.56, 0.5, 0.54);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      // The white muzzle across the lower face.
      spec.head.prims.push({
        kind: 'ellipsoid',
        a: V(0, 1.72, 0.72),
        r: 0,
        radii: V(0.58, 0.3, 0.3),
        color: WHITE,
        tag: 'muzzle',
        blend: 0.08,
      });
      widen(spec.head, { x: 1.7, z: -1.2 });
      mechLegs(spec, {
        leg: ECHIDNA_BODY,
        ring: ECHIDNA_BODY,
        shoe: WHITE,
        stripe: WHITE,
        size: 0.8,
      });
    },
    notes:
      'Line-up figure 2 (Part G8b): crimson, a wide low head with a white tuft, huge white ears, ' +
      'a white muzzle and belly patch with a green dot, white gloves and shoes, a green ring above.',
  }),
  look('look-rose', 'Nubbin (Rose look)', {
    colors: {
      body: '#f7a3c2',
      belly: '#ffc8d8',
      tip: WHITE,
      pad: '#a3365e',
      crownShade: '#e85a7a',
    },
    slots: { ears: [roundEar(-1, '#ffc8d8', 0.28), roundEar(1, '#ffc8d8', 0.28)] },
    hints: [chestMark('#ffc8d8', 1.05, 0.3)],
    patch: (spec) => {
      const bow = (a: Prim['a']): Prim => ({
        kind: 'ellipsoid',
        a,
        radii: V(0.14, 0.1, 0.1),
        r: 0,
        color: '#e0562e',
        tag: 'band',
      });
      spec.head.prims.push(
        {
          kind: 'torus',
          a: V(0, 2.32, 0),
          r: 0.7,
          r2: 0.06,
          color: '#e0562e',
          tag: 'band',
          blend: 0.04,
        },
        bow(V(0.55, 2.5, 0.35)),
        bow(V(0.75, 2.42, 0.2)),
      );
      dress(spec, { gloves: WHITE, shoes: '#e85a7a' });
    },
    notes: 'Pink with round ears, a red headband and bow, white gloves and pink shoes.',
  }),
  look('look-dream', 'Nubbin (Dream look)', {
    // Flat magenta all over; a darker centre on the belly, a gold horn, a black ball above.
    colors: {
      body: DREAM_BODY,
      belly: DREAM_BODY,
      tip: '#e6b84a',
      pad: DREAM_BODY,
      iris: '#2a1a4a',
      blush: DREAM_BODY,
      star: DREAM_BODY,
      crownShade: DREAM_BODY,
    },
    // An onion dome: a wide cone that melts into the head, tiny ear points and the gold horn.
    crown: [
      cone(V(0, 2.5, 0), V(0, 3.2, -0.05), 0.58, 0.04, DREAM_BODY, 'crown', 0.1),
      ...[-1, 1].map((dx) =>
        cone(
          V(dx * 0.9, 2.28, -0.1),
          V(dx * 1.12, 2.55, -0.15),
          0.13,
          0.02,
          DREAM_BODY,
          'ear',
          0.05,
        ),
      ),
      cone(V(0, 2.4, 0.6), V(0, 2.82, 0.78), 0.13, 0.02, '#e6b84a', 'tip', 0.03),
    ],
    slots: {
      arms: [braceletArm(-1, DREAM_BODY), braceletArm(1, DREAM_BODY)],
    },
    ball: { color: '#1a1424', glow: '#3a2a50' },
    hints: [
      // The eyes are white ovals the closed arcs are drawn on.
      ...[-1, 1].map((dx) => ({
        kind: 'ellipsoid' as const,
        a: V(dx * 0.46, 1.86, 0.86),
        radii: V(0.34, 0.42, 0.2),
        color: WHITE,
        soft: 0.01,
      })),
      // The dark smudge in the middle of the belly.
      {
        kind: 'ellipsoid',
        a: V(0, 1.0, 0.5),
        radii: V(0.4, 0.42, 0.3),
        color: '#5a1250',
        soft: 0.12,
      },
    ],
    headScale: 1.2,
    // A closed eye stays a white oval with a dark ^ across it.
    eyes: { x: 0.42, y: 1.78, r: 0.3, tall: 1.3, lidColor: WHITE, brow: false },
    mouth: { shape: 'smile', width: 0.12, y: 1.62, z: 1.0, line: '#d0508a' },
    patch: (spec) => {
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.0, 0);
      dome.radii!.set(1.2, 0.78, 0.95);
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.0, 0);
      belly.radii!.set(0.6, 0.55, 0.56);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      widen(spec.head, { x: 1.4, z: -1.2 });
      // Long pointed teardrop legs in place of legs and shoes.
      for (const ps of spec.parts) {
        if (!ps.name.startsWith('leg')) continue;
        const x = (ps.name === 'legL' ? -1 : 1) * 0.36;
        delete ps.joint;
        ps.prims = [
          cone(V(x, 0.78, 0.05), V(x * 1.4, 0.08, 0.3), 0.36, 0.14, DREAM_BODY, 'foot', 0.1),
        ];
        ps.box = [V(x - 0.8, -0.2, -0.5), V(x + 0.8, 1.0, 0.8)];
        ps.resolution = 56;
      }
    },
    notes:
      'Line-up figure 4 (Part G8b): an onion-domed magenta head with tiny ear points and a gold ' +
      'horn, big white oval eyes, grey studded bracers, a dark belly centre, pointed legs.',
  }),
  look('look-quills', 'Nubbin (Quills look)', {
    // Flat line-up colours; the blush, star and crown shade take the body colour so no
    // soft marks show on the flat head.
    colors: {
      body: QUILLS_BODY,
      belly: QUILLS_BELLY,
      tip: QUILLS_BELLY,
      pad: '#1f3db0',
      iris: '#1e7a74',
      blush: QUILLS_BODY,
      star: QUILLS_BODY,
      crownShade: QUILLS_BODY,
    },
    crown: [...QUILLS_CLUSTER, ...earTips('#f2c94c')],
    hints: [
      ...quillShades(QUILLS_CLUSTER, '#17289a'),
      chestMark(QUILLS_BELLY, 0.92, 0.3),
      // The mech emblem on the belly: a yellow ring around a dark hexagon-like disc.
      { kind: 'sphere', a: V(0, 0.9, 0.5), r: 0.2, color: '#f2c94c', soft: 0.01 },
      { kind: 'sphere', a: V(0, 0.9, 0.52), r: 0.13, color: '#1a1026', soft: 0.01 },
    ],
    slots: { arms: [gloveArm(-1, QUILLS_BODY, WHITE), gloveArm(1, QUILLS_BODY, WHITE)] },
    // The head is about half the standing height in the line-up.
    headScale: 1.25,
    eyes: { r: 0.34, tall: 1.15, brow: false },
    mouth: { shape: 'o', width: 0.24, y: 1.74, z: 1.0, line: QUILLS_SHOE },
    patch: (spec) => {
      // The dome is wider than it is tall, and the body a small ball held clear of the legs.
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.02, 0);
      dome.radii!.set(1.0, 0.8, 0.9);
      const belly = spec.torso.prims.find((p) => p.tag === 'belly')!;
      belly.a.set(0, 1.05, 0);
      belly.radii!.set(0.56, 0.5, 0.54);
      // Flat colour top to bottom: the line-up's figures carry no painted gradient.
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      // The peach muzzle, raised off the face around the mouth.
      spec.head.prims.push({
        kind: 'ellipsoid',
        a: V(0, 1.74, 0.76),
        r: 0,
        radii: V(0.4, 0.24, 0.28),
        color: QUILLS_BELLY,
        tag: 'muzzle',
        blend: 0.08,
      });
      widen(spec.head, { x: 1.4, z: -1.75 });
      mechLegs(spec, { leg: '#8e95a3', ring: QUILLS_SHOE, shoe: QUILLS_SHOE, stripe: WHITE });
    },
    notes:
      'Line-up figure 1 (Part G8b): head half the height, five quills with shade marks, a peach ' +
      'muzzle, glove balls with cuffs, mech lower legs with a red ring, red striped shoes.',
  }),
  look('look-shade', 'Nubbin (Shade look)', {
    // A black cat suit: flat near-black, grey inner ears, a white collar with a lilac diamond.
    colors: {
      body: SHADE_BLACK,
      belly: SHADE_BLACK,
      tip: SHADE_BLACK,
      pad: SHADE_BLACK,
      iris: '#2a2a3a',
      blush: SHADE_BLACK,
      star: SHADE_BLACK,
      crownShade: SHADE_BLACK,
    },
    // A few white spikes standing up behind the crown.
    crown: [
      cone(V(-0.25, 2.65, -0.35), V(-0.4, 2.95, -0.5), 0.15, 0.02, WHITE, 'crown', 0.03),
      cone(V(0.05, 2.7, -0.35), V(0.1, 3.05, -0.5), 0.17, 0.02, WHITE, 'crown', 0.03),
      cone(V(0.35, 2.65, -0.3), V(0.5, 2.9, -0.45), 0.13, 0.02, WHITE, 'crown', 0.03),
    ],
    slots: {
      ears: [catEar(-1, SHADE_BLACK, SHADE_GREY), catEar(1, SHADE_BLACK, SHADE_GREY)],
      arms: [foldedArm(-1, SHADE_BLACK), foldedArm(1, SHADE_BLACK)],
    },
    ball: { shape: 'spikes', color: '#3a3840', glow: '#201e26' },
    hints: [
      // White oval eyes with a white slash over the left one.
      ...[-1, 1].map((dx) => ({
        kind: 'ellipsoid' as const,
        a: V(dx * 0.42, 2.0, 0.8),
        radii: V(0.2, 0.3, 0.2),
        color: WHITE,
        soft: 0.01,
      })),
      {
        kind: 'capsule' as const,
        a: V(-0.62, 2.28, 0.6),
        b: V(-0.3, 1.82, 0.84),
        r: 0.05,
        color: WHITE,
        soft: 0.01,
      },
      // The white collar and the lilac diamond on the chest.
      {
        kind: 'ellipsoid' as const,
        a: V(0, 1.4, 0.55),
        radii: V(0.34, 0.1, 0.22),
        color: WHITE,
        soft: 0.01,
      },
      {
        kind: 'ellipsoid' as const,
        a: V(0, 1.26, 0.66),
        radii: V(0.13, 0.18, 0.1),
        color: '#d070e0',
        soft: 0.01,
      },
    ],
    headScale: 1.15,
    eyes: { x: 0.42, y: 2.0, r: 0.22, tall: 1.4, lidColor: WHITE, brow: false },
    mouth: { shape: 'o', width: 0.07, y: 1.66, z: 1.0, line: '#d02a3a' },
    patch: (spec) => {
      const dome = spec.head.prims.find((p) => p.tag === 'head')!;
      dome.a.set(0, 2.0, 0);
      dome.radii!.set(1.05, 0.88, 0.92);
      spec.shade = { top: 1.0, bottom: 0.94, yMax: 3.5 };
      widen(spec.head, { x: 1.4, z: -1.2 });
      mechLegs(spec, {
        leg: SHADE_BLACK,
        ring: SHADE_BLACK,
        shoe: WHITE,
        stripe: WHITE,
        size: 0.95,
      });
    },
    notes:
      'Line-up figure 6 (Part G8b): a black cat suit, tall pointed ears with grey insides, white ' +
      'spikes behind the crown, white oval eyes, a white collar with a lilac diamond, white shoes.',
  }),
];
