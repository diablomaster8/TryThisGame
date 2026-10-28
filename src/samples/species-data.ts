import * as THREE from 'three';
import { stripes } from './creatures';
import { V } from './sculpted';
import { namedRule } from './sculpt-rules';
import { digits, tuftRow } from './species-kit';
import type { Mark, SpeciesSpec } from './species';

/**
 * Two species written in the description format: the Nubbin (the Chao-faithful hero,
 * a biped with wings and the emote ball) and Fennel (a furred quadruped). These are
 * the templates the rest of the roster follows.
 */
const nubbinBody = '#9ad0ff';
const nubbinTip = '#ffd94a';

/**
 * One stubby leg with a knee: a thigh from the hip to a knee ball, and a shin on its own
 * bone under it ending in the yellow-tipped foot, a smooth nub. The knee sits a touch
 * forward of the hip so the leg bends like a standing toddler's, and the walk plants the
 * feet.
 */
function nubbinLeg(side: -1 | 1): SpeciesSpec['parts'][number] {
  const x = side * 0.36;
  const hip = V(x, 0.46, 0.06);
  const knee = V(x, 0.28, 0.15);
  const ankle = V(x, 0.17, 0.22);
  return {
    name: side < 0 ? 'legL' : 'legR',
    pivot: V(x, 0.42, 0.08),
    prims: [
      { kind: 'capsule', a: hip, b: knee, r: 0.16, color: nubbinBody, tag: 'leg' },
      { kind: 'sphere', a: knee, r: 0.155, color: nubbinBody, tag: 'leg' },
    ],
    box: [V(x - 0.45, 0.0, -0.3), V(x + 0.45, 0.75, 0.5)],
    resolution: 40,
    joint: {
      name: side < 0 ? 'kneeL' : 'kneeR',
      pivot: knee,
      prims: [
        { kind: 'sphere', a: knee, r: 0.165, color: nubbinBody, tag: 'leg' },
        { kind: 'capsule', a: knee, b: ankle, r: 0.15, color: nubbinBody, tag: 'leg' },
        // A smooth rounded nub, no toes: Chao feet (LOOK-15).
        {
          kind: 'ellipsoid',
          a: V(x, 0.12, 0.26),
          radii: V(0.2, 0.12, 0.26),
          r: 0,
          color: nubbinTip,
          tag: 'foot',
          blend: 0.08,
        },
      ],
      box: [V(x - 0.45, -0.1, -0.2), V(x + 0.45, 0.5, 0.8)],
      resolution: 48,
    },
  };
}

/**
 * The marks a Chao does not wear (LOOK-12), kept for the looks that want them: blush under
 * each eye, a pale heart on the belly (the two-tone eggs' signature) and a star on the brow.
 */
export const NUBBIN_EXTRA_MARKS: Record<'blush' | 'belly' | 'star', Mark[]> = {
  blush: [
    {
      kind: 'ellipsoid',
      a: V(-0.4, 1.76, 0.56),
      radii: V(0.13, 0.075, 0.1),
      color: '#ffb3c6',
      soft: 0.1,
    },
    {
      kind: 'ellipsoid',
      a: V(0.4, 1.76, 0.56),
      radii: V(0.13, 0.075, 0.1),
      color: '#ffb3c6',
      soft: 0.1,
    },
  ],
  belly: [
    {
      kind: 'ellipsoid',
      a: V(-0.18, 0.95, 0.56),
      radii: V(0.22, 0.2, 0.2),
      color: '#e4f3ff',
      soft: 0.08,
    },
    {
      kind: 'ellipsoid',
      a: V(0.18, 0.95, 0.56),
      radii: V(0.22, 0.2, 0.2),
      color: '#e4f3ff',
      soft: 0.08,
    },
    {
      kind: 'ellipsoid',
      a: V(0, 0.72, 0.62),
      radii: V(0.3, 0.3, 0.18),
      color: '#e4f3ff',
      soft: 0.08,
    },
  ],
  star: [{ kind: 'sphere', a: V(0, 2.42, 0.6), r: 0.09, color: '#fff4b0', soft: 0.03 }],
};

export const NUBBIN_SPEC: SpeciesSpec = {
  name: 'Nubbin',
  scale: 0.78,
  gait: 'biped',
  hipY: 0.66,
  // Quick short steps on jointed legs (1.2 leg lengths a cycle, a light jog), so a child keeps
  // up with BEHAVIOR.walkSpeed without the cadence cap sliding its feet.
  stride: { length: 1.2, period: 0.5, duty: 0.5 },
  blend: 0.22,
  surface: {
    detail: 'smooth',
    amount: 0.12,
    bump: 0.15,
    roughness: 0.66,
    sheen: 0.7,
    sheenColor: '#dff2ff',
  },
  torso: {
    prims: [
      {
        kind: 'ellipsoid',
        // The head is the bigger mass, 1.3-1.4x the body's width (LOOK-03).
        a: V(0, 0.66, 0),
        radii: V(0.6, 0.58, 0.56),
        r: 0,
        color: nubbinBody,
        tag: 'belly',
      },
      // A neck stub that sits inside the head, so the join stays soft when the head turns.
      { kind: 'sphere', a: V(0, 1.3, 0), r: 0.28, color: nubbinBody, tag: 'neck' },
    ],
    box: [V(-1.0, 0, -1.0), V(1.0, 1.8, 1.0)],
  },
  head: {
    name: 'head',
    pivot: V(0, 1.34, 0),
    prims: [
      {
        kind: 'ellipsoid',
        a: V(0, 1.84, 0),
        radii: V(0.82, 0.74, 0.78),
        r: 0,
        color: nubbinBody,
        tag: 'head',
      },
      // The point sweeps back as a Chao's does: a base cone out of the dome, then a thinner
      // tip cone leaning further back, capped by the yellow tip (LOOK-01, LOOK-11).
      {
        kind: 'cone',
        a: V(0, 2.35, 0),
        b: V(0, 2.78, -0.1),
        r: 0.46,
        r2: 0.2,
        color: nubbinBody,
        tag: 'crown',
        blend: 0.14,
      },
      {
        kind: 'cone',
        a: V(0, 2.78, -0.1),
        b: V(0, 3.0, -0.3),
        r: 0.2,
        r2: 0.05,
        color: nubbinBody,
        tag: 'crown',
        blend: 0.1,
      },
      {
        kind: 'ellipsoid',
        a: V(0, 3.02, -0.32),
        radii: V(0.13, 0.16, 0.13),
        r: 0,
        color: nubbinTip,
        tag: 'tip',
        blend: 0.03,
      },
    ],
    box: [V(-1.1, 1.0, -1.1), V(1.1, 3.3, 1.1)],
  },
  parts: [
    {
      name: 'armL',
      pivot: V(-0.48, 0.96, 0.1),
      prims: [
        {
          kind: 'capsule',
          a: V(-0.48, 0.96, 0.1),
          b: V(-0.88, 0.7, 0.2),
          r: 0.15,
          color: nubbinBody,
          tag: 'arm',
        },
        // One round mitt, no fingers (LOOK-15).
        {
          kind: 'ellipsoid',
          a: V(-0.91, 0.67, 0.22),
          radii: V(0.16, 0.18, 0.16),
          r: 0,
          color: nubbinTip,
          tag: 'hand',
        },
      ],
      box: [V(-1.4, 0.4, -0.3), V(-0.2, 1.4, 0.6)],
      resolution: 56,
    },
    {
      name: 'armR',
      pivot: V(0.48, 0.96, 0.1),
      prims: [
        {
          kind: 'capsule',
          a: V(0.48, 0.96, 0.1),
          b: V(0.88, 0.7, 0.2),
          r: 0.15,
          color: nubbinBody,
          tag: 'arm',
        },
        // One round mitt, no fingers (LOOK-15).
        {
          kind: 'ellipsoid',
          a: V(0.91, 0.67, 0.22),
          radii: V(0.16, 0.18, 0.16),
          r: 0,
          color: nubbinTip,
          tag: 'hand',
        },
      ],
      box: [V(0.2, 0.4, -0.3), V(1.4, 1.4, 0.6)],
      resolution: 56,
    },
    nubbinLeg(-1),
    nubbinLeg(1),
  ],
  shade: { top: 1.1, bottom: 0.72, yMax: 3.1 },
  marks: [
    // The crown darkens toward the point, stopping short of the yellow tip so it never
    // paints over it (tests/render/likeness.test.ts checks).
    {
      kind: 'capsule',
      a: V(0, 2.5, -0.02),
      b: V(0, 2.6, -0.04),
      r: 0.2,
      color: '#5f9ee8',
      soft: 0.12,
    },
  ],
  // Chao eyes (LOOK-02): tall solid dark ovals with two glints, no sclera, no brows; the
  // moods are carried by the lids alone.
  eyes: {
    x: 0.31,
    y: 2.02,
    z: 0.62,
    r: 0.28,
    iris: '#141a3a',
    lidColor: nubbinBody,
    yaw: 0,
    lid: 0.12,
    irisScale: 1.0,
    pitch: 0,
    tall: 1.3,
    brow: false,
    style: 'chao',
  },
  mouth: {
    x: 0,
    y: 1.7,
    z: 0.7,
    width: 0.2,
    lip: '#6a3a5a',
    teeth: false,
    tongue: '#ff8aa0',
    pitch: 0,
  },
  blush: '#ffb3c6',
  wings: { x: 0.42, y: 1.15, z: -0.6, size: 1, color: '#f6faff' },
  ball: { y: 3.5, color: nubbinTip },
  notes:
    'Shape pass 2026-10-15 against the Palworld roster screenshot (toes, mitts, crisp crown); ' +
    'eyes and petting against the All Pet Animations video (docs/samples/look-nubbin.jpg, ' +
    'pet-nubbin.jpg).',
};

const fur = '#f0893a';
const cream = '#fff3e0';
const dark = '#5a3a2a';

/** Fur grows longer on the ruff, chest and tail, short on the muzzle and legs, combed back and down. */
const fennelFur = namedRule(
  'fennel.fur',
  function fennelFur(
    p: THREE.Vector3,
    n: THREE.Vector3,
    q: { tag?: string },
  ): { len: number; dir: THREE.Vector3 } {
    const tag = q.tag ?? '';
    let len = 0.6;
    if (tag === 'ruff' || tag === 'bib' || tag === 'cheek') len = 1.0;
    else if (tag === 'muzzle' || tag === 'paw' || tag === 'digit') len = 0.15;
    else if (tag === 'tuft' || tag === 'crest') len = 0.2;
    else if (tag === 'leg') len = 0.35;
    else if (tag === 'tail') len = 1.0;
    else if (tag === 'head') len = 0.5;
    else if (tag === 'ear' || tag === 'inner') len = 0.3;
    // Combed down and back, with a little of the surface normal so it still puffs.
    const dir = new THREE.Vector3(
      n.x * 0.4,
      -0.55 - Math.max(0, n.y) * 0.3,
      -0.5 + (p.z > 0.8 ? 0.6 : 0),
    ).normalize();
    return { len, dir };
  },
);

export const FENNEL_SPEC: SpeciesSpec = {
  name: 'Fennel',
  scale: 0.95,
  gait: 'quadruped',
  hipY: 0.98,
  blend: 0.16,
  surface: {
    detail: 'fur',
    scale: 2.2,
    amount: 0.4,
    bump: 0.4,
    roughness: 0.78,
    sheen: 1.0,
    sheenColor: '#ffe6c8',
  },
  fur: { layers: 12, length: 0.1, lift: 0.25, cell: 70 },
  furRule: fennelFur,
  torso: {
    prims: [
      {
        kind: 'ellipsoid',
        a: V(0, 0.98, -0.2),
        radii: V(0.62, 0.6, 0.95),
        r: 0,
        color: fur,
        tag: 'body',
      },
      {
        kind: 'ellipsoid',
        a: V(0, 0.8, 0.25),
        radii: V(0.42, 0.45, 0.5),
        r: 0,
        color: cream,
        tag: 'bib',
      },
      { kind: 'sphere', a: V(0, 1.35, 0.55), r: 0.3, color: fur, tag: 'neck' },
      ...Array.from({ length: 10 }, (_, i): import('./sculpted').Prim => {
        const a = (i / 10) * Math.PI * 2;
        const r0 = 0.55;
        return {
          kind: 'cone',
          a: V(Math.cos(a) * r0, 1.25 + Math.sin(a) * 0.1, 0.15 + Math.sin(a) * r0 * 0.6),
          b: V(
            Math.cos(a) * (r0 + 0.35),
            1.1 + Math.sin(a) * 0.25,
            0.05 + Math.sin(a) * (r0 + 0.3) * 0.6,
          ),
          r: 0.14,
          r2: 0.02,
          color: cream,
          tag: 'ruff',
        };
      }),
      ...tuftRow(V(-0.3, 1.0, 0.6), V(0.3, 1.0, 0.6), 5, V(0, -0.75, 0.45), 0.3, 0.11, cream, 0.8),
    ],
    box: [V(-1.3, 0.1, -1.4), V(1.3, 1.9, 1.3)],
  },
  head: {
    name: 'head',
    pivot: V(0, 1.45, 0.5),
    prims: [
      {
        kind: 'ellipsoid',
        a: V(0, 1.8, 0.55),
        radii: V(0.78, 0.68, 0.66),
        r: 0,
        color: fur,
        tag: 'head',
      },
      {
        kind: 'cone',
        a: V(0, 1.56, 1.0),
        b: V(0, 1.4, 1.42),
        blend: 0.1,
        r: 0.27,
        r2: 0.1,
        color: cream,
        tag: 'muzzle',
      },
      {
        kind: 'cone',
        a: V(-0.66, 1.65, 0.7),
        b: V(-1.15, 1.5, 0.78),
        r: 0.14,
        r2: 0.02,
        color: cream,
        tag: 'cheek',
        blend: 0.07,
      },
      {
        kind: 'cone',
        a: V(0.66, 1.65, 0.7),
        b: V(1.15, 1.5, 0.78),
        r: 0.14,
        r2: 0.02,
        color: cream,
        tag: 'cheek',
        blend: 0.07,
      },
      {
        kind: 'cone',
        a: V(-0.62, 1.5, 0.78),
        b: V(-1.0, 1.22, 0.85),
        r: 0.12,
        r2: 0.02,
        color: cream,
        tag: 'cheek',
        blend: 0.07,
      },
      {
        kind: 'cone',
        a: V(0.62, 1.5, 0.78),
        b: V(1.0, 1.22, 0.85),
        r: 0.12,
        r2: 0.02,
        color: cream,
        tag: 'cheek',
        blend: 0.07,
      },
      ...tuftRow(
        V(-0.17, 2.36, 0.5),
        V(0.17, 2.36, 0.5),
        3,
        V(0, 0.9, -0.35),
        0.42,
        0.1,
        fur,
        0.8,
        'crest',
      ),
    ],
    box: [V(-1.4, 1.0, -0.2), V(1.4, 3.0, 1.9)],
    resolution: 96,
  },
  parts: [
    ...(['FL', 'FR', 'BL', 'BR'] as const).map((k): import('./species').PartSpec => {
      const side = k.endsWith('L') ? -1 : 1;
      const front = k.startsWith('F');
      const x = side * (front ? 0.4 : 0.4);
      const z = front ? 0.45 : -0.8;
      // Two segments: the knee sits a little behind the line on a front leg (an elbow)
      // and a little ahead on a hind leg (a stifle), so the walk bends each the right way.
      const r = front ? 0.14 : 0.15;
      const knee = V(x, 0.5, z + (front ? -0.04 : 0.06));
      return {
        name: `leg${k}`,
        pivot: V(x, 0.85, z),
        prims: [
          { kind: 'capsule', a: V(x, 0.9, z), b: knee, r, color: fur, tag: 'leg' },
          { kind: 'sphere', a: knee, r: r * 0.98, color: fur, tag: 'leg' },
        ],
        box: [V(x - 0.4, 0.3, z - 0.4), V(x + 0.4, 1.2, z + 0.5)],
        resolution: 44,
        joint: {
          name: `knee${k}`,
          pivot: knee,
          prims: [
            { kind: 'sphere', a: knee, r: r * 1.05, color: fur, tag: 'leg' },
            { kind: 'capsule', a: knee, b: V(x, 0.2, z + 0.05), r, color: fur, tag: 'leg' },
            {
              kind: 'ellipsoid',
              a: V(x, 0.12, z + 0.08),
              radii: V(0.17, 0.1, 0.2),
              r: 0,
              color: dark,
              tag: 'paw',
            },
            ...digits(V(x, 0.09, z + 0.2), {
              count: 3,
              spread: 0.2,
              length: 0.18,
              r: 0.055,
              color: dark,
              pad: { color: '#7a4a4a', r: 0.1 },
              tag: 'paw',
            }),
          ],
          box: [V(x - 0.4, -0.1, z - 0.4), V(x + 0.4, 0.75, z + 0.6)],
          resolution: 44,
        },
      };
    }),
    {
      name: 'tail',
      pivot: V(0, 0.9, -1.05),
      prims: [
        { kind: 'sphere', a: V(0, 0.9, -1.1), r: 0.26, color: fur, tag: 'tail' },
        { kind: 'sphere', a: V(0, 1.05, -1.5), r: 0.38, color: fur, tag: 'tail' },
        { kind: 'sphere', a: V(0, 1.4, -1.9), r: 0.44, color: fur, tag: 'tail' },
        { kind: 'sphere', a: V(0, 1.85, -2.05), r: 0.36, color: fur, tag: 'tail' },
        { kind: 'sphere', a: V(0, 2.15, -2.05), r: 0.26, color: cream, tag: 'tailtip' },
        ...tuftRow(
          V(-0.18, 2.3, -2.05),
          V(0.18, 2.3, -2.05),
          4,
          V(0, 0.8, -0.4),
          0.38,
          0.11,
          cream,
          0.7,
        ),
        {
          kind: 'cone',
          a: V(0.2, 1.3, -2.1),
          b: V(0.45, 1.1, -2.45),
          r: 0.14,
          r2: 0.02,
          color: fur,
          tag: 'tail',
        },
        {
          kind: 'cone',
          a: V(-0.2, 1.6, -2.2),
          b: V(-0.5, 1.5, -2.55),
          r: 0.14,
          r2: 0.02,
          color: fur,
          tag: 'tail',
        },
      ],
      box: [V(-0.9, 0.4, -2.8), V(0.9, 3.0, -0.6)],
      blend: 0.25,
      resolution: 80,
    },
    ...([-1, 1] as const).map((side): import('./species').PartSpec => {
      const dx = side * 0.42;
      return {
        name: side < 0 ? 'earL' : 'earR',
        pivot: V(dx, 2.1, 0.45),
        prims: [
          {
            kind: 'cone',
            a: V(dx, 2.1, 0.45),
            b: V(dx * 1.4, 3.0, 0.28),
            r: 0.27,
            r2: 0.04,
            color: fur,
            tag: 'ear',
          },
          {
            kind: 'cone',
            a: V(dx, 2.22, 0.56),
            b: V(dx * 1.32, 2.82, 0.42),
            r: 0.14,
            r2: 0.02,
            color: '#ffb6c8',
            tag: 'inner',
          },
          {
            kind: 'cone',
            a: V(dx * 1.4, 3.0, 0.28),
            b: V(dx * 1.5, 3.25, 0.22),
            r: 0.05,
            r2: 0.01,
            color: dark,
            tag: 'tip',
          },
        ],
        box: [V(dx - 0.7, 1.9, -0.2), V(dx + 0.7, 3.4, 1.0)],
        blend: 0.05,
        resolution: 64,
      };
    }),
  ],
  shade: { top: 1.1, bottom: 0.68, yMax: 2.6 },
  marks: [
    // A dark mask across the eyes, a dark nose on the muzzle tip, a cream chest patch and
    // a dark ring on the tail.
    { kind: 'sphere', a: V(0, 1.45, 1.5), r: 0.085, color: '#2a1a1e', soft: 0 },
    {
      kind: 'ellipsoid',
      a: V(0, 1.82, 1.0),
      radii: V(0.76, 0.17, 0.3),
      color: '#9a5a2a',
      soft: 0.1,
    },
    { kind: 'ellipsoid', a: V(0, 0.95, 0.6), radii: V(0.3, 0.26, 0.2), color: cream, soft: 0 },
    {
      kind: 'capsule',
      a: V(0, 1.6, -2.0),
      b: V(0, 1.75, -2.05),
      r: 0.5,
      color: '#b8602a',
      soft: 0.08,
    },
  ],
  colorRules: namedRule('fennel.colors', (p, n) => {
    if (n.tag === 'head' && p.y < 1.56 && p.z > 0.7) return cream;
    if (n.tag === 'leg' && p.y < 0.5) return dark;
    return null;
  }),
  extraShades: [stripes('z', 4.5, 0.18, '#c9641f', ['body'], 0.55)],
  eyes: {
    x: 0.36,
    y: 1.78,
    z: 1.08,
    r: 0.23,
    iris: '#4a9a3a',
    lidColor: fur,
    yaw: 0,
    lid: 0.18,
    irisScale: 0.8,
    pitch: 0,
    tall: 1.3,
  },
  mouth: {
    // Ahead of and below the muzzle tip, so it lands on the tip's underside front.
    x: 0,
    y: 1.31,
    z: 1.62,
    width: 0.17,
    lip: '#3a2420',
    teeth: true,
    tongue: '#ff8a9a',
    pitch: 0,
  },
  notes:
    'Shape pass 2026-10-15 against the Palworld roster screenshot (bigger head, eyes wide and ' +
    'low, tufts, docs/samples/shape-fennel.jpg); the planted walk against the All Pet ' +
    'Animations video (walk-fennel.jpg); crisp nose and chest patch (marks-fennel.jpg).',
};
