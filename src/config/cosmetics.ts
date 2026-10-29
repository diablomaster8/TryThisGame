import { HAT_LABELS } from './strings';
import { COSMETIC_LABELS, eggshellLabel } from './strings-look';
import { HOP_COURSE_TEXT } from './strings-move';
import type { C } from '../render/sprites/palette';

/**
 * The hat and costume registry (LOOK-32). Every wearable is one entry: its slot, rarity and
 * where it comes from, plus how each renderer draws it as plain data, so a new hat is one
 * entry here and shows in Pixel, Full 3D, the shop and the Roster. The five shop hats and the
 * character looks keep their hand-drawn shapes in the renderers (`bespoke`); every other
 * entry is drawn from its `px` and `mesh` lists.
 *
 * Colours are names in the shared 48-colour palette, so the two modes match. The eggshell's
 * colours are `egg.*` tokens, read from the egg it hatched from at draw time.
 */

export type CosmeticSlot = 'hat' | 'face' | 'neck' | 'back' | 'body';
export type CosmeticRarity = 'common' | 'rare' | 'prize';
export type CosmeticSource = 'shop' | 'race' | 'hatch';

/** A palette colour by name, or a colour of the egg the wearer hatched from. */
export type CosmeticColour = keyof typeof C | 'egg.shell' | 'egg.shade' | 'egg.cap' | 'egg.spot';

/**
 * One pixel shape, in design pixels (the 32 px grid) from the slot's anchor: the top of the
 * head (hat), the head's centre (face), under the chin (neck), or the body's centre (back,
 * body). Side views face right, as the rest of the drawer does.
 */
export type PxOp =
  | readonly ['ellipse', number, number, number, number, CosmeticColour]
  | readonly ['rect', number, number, number, number, CosmeticColour]
  | readonly ['tri', number, number, number, number, number, number, CosmeticColour]
  | readonly ['disc', number, number, number, CosmeticColour]
  | readonly ['px', number, number, CosmeticColour]
  | readonly ['line', number, number, number, number, CosmeticColour];

type V3 = readonly [number, number, number];

/**
 * One 3D piece: unit geometry, colour, position, scale, Euler rotation. Units are the base
 * Nubbin's head (dome half-width 0.74) from the slot's anchor: the top of the dome (hat), the
 * eyes' centre (face), the bottom of the dome (neck), the back of the belly (back), the
 * belly's centre (body).
 */
export type MeshOp = readonly [
  'cyl' | 'sphere' | 'dome' | 'cone' | 'torus' | 'ring' | 'capsule' | 'box',
  CosmeticColour,
  V3,
  V3 | number,
  V3?,
];

export interface Cosmetic {
  id: string;
  label: string;
  slot: CosmeticSlot;
  rarity: CosmeticRarity;
  source: CosmeticSource;
  /** Drawn by the renderers' own hand-made shapes instead of the lists below. */
  bespoke?: true;
  /** Pixel shapes for the front and side views, and for the back views when they differ. */
  px?: readonly PxOp[];
  pxBack?: readonly PxOp[];
  mesh?: readonly MeshOp[];
}

const ring = (n: number, r: number, y: number, f: (x: number, z: number, a: number) => MeshOp) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return f(Math.sin(a) * r, Math.cos(a) * r, a);
  });

const bespoke = (
  id: string,
  rarity: CosmeticRarity,
  source: CosmeticSource,
  slot: CosmeticSlot = 'hat',
): Cosmetic => ({
  id,
  label: HAT_LABELS[id] ?? COSMETIC_LABELS[id] ?? id,
  slot,
  rarity,
  source,
  bespoke: true,
});

const item = (
  id: string,
  slot: CosmeticSlot,
  rarity: CosmeticRarity,
  px: readonly PxOp[],
  mesh: readonly MeshOp[],
  pxBack?: readonly PxOp[],
): Cosmetic => ({
  id,
  label: COSMETIC_LABELS[id] ?? id,
  slot,
  rarity,
  source: 'shop',
  px,
  mesh,
  ...(pxBack ? { pxBack } : {}),
});

/** Every wearable but the eggshell, which is one entry per egg colour (`cosmetic`). */
export const COSMETICS: readonly Cosmetic[] = [
  bespoke('straw', 'common', 'shop'),
  bespoke('crown', 'common', 'shop'),
  bespoke('beanie', 'common', 'shop'),
  bespoke('flower', 'common', 'shop'),
  bespoke('bucket', 'common', 'shop'),
  bespoke('look-fox', 'prize', 'race'),
  bespoke('look-echidna', 'prize', 'race'),
  bespoke('look-rose', 'prize', 'race'),
  bespoke('look-dream', 'prize', 'race'),
  bespoke('look-quills', 'prize', 'race'),
  bespoke('look-shade', 'prize', 'race'),
  // MOVE-63 (lane A): the hop course's one-time prize, a leaf-green cap with a spring on top.
  {
    ...item(
      'hop-hat',
      'hat',
      'prize',
      [
        ['ellipse', 0, -2, 7, 4, 'leaf'],
        ['rect', -8, 1, 16, 2, 'leafDeep'],
        ['line', 0, -6, 0, -9, 'greyLight'],
        ['disc', 0, -10, 2, 'sunYellow'],
      ],
      [
        ['dome', 'leaf', [0, 0, 0], [0.62, 0.42, 0.62]],
        ['cyl', 'leafDeep', [0, -0.02, 0.18], [0.66, 0.04, 0.5]],
        ['cyl', 'greyLight', [0, 0.52, 0], [0.04, 0.2, 0.04]],
        ['sphere', 'sunYellow', [0, 0.72, 0], 0.12],
      ],
    ),
    source: 'race',
    label: HOP_COURSE_TEXT.hat,
  },
  item(
    'pot',
    'hat',
    'common',
    [
      ['rect', -5, -5, 11, 7, 'ember'],
      ['rect', -6, 1, 13, 2, 'orange'],
      ['line', -4, -4, -4, 0, 'orange'],
      ['rect', -1, -6, 3, 1, 'berry'],
    ],
    [
      ['cyl', 'ember', [0, 0.02, 0], [0.5, 0.5, 0.5]],
      ['cyl', 'orange', [0, -0.24, 0], [0.62, 0.1, 0.62]],
      ['cyl', 'berry', [0, 0.28, 0], [0.16, 0.04, 0.16]],
    ],
  ),
  item(
    'box',
    'hat',
    'common',
    [
      ['rect', -6, -7, 13, 10, 'wood'],
      ['rect', -6, -7, 13, 1, 'sandDeep'],
      ['line', 0, -6, 0, 2, 'bark'],
      ['rect', 3, -4, 3, 2, 'sand'],
    ],
    [
      ['box', 'wood', [0, 0.12, 0], [1.25, 0.95, 1.25]],
      ['box', 'bark', [0, 0.12, 0.63], [0.06, 0.9, 0.02]],
      ['box', 'sandDeep', [0, 0.6, 0], [1.27, 0.03, 1.27]],
    ],
  ),
  item(
    'pumpkin',
    'hat',
    'rare',
    [
      ['ellipse', 0, -1, 7, 4.5, 'orange'],
      ['ellipse', -3, -1, 2, 4, 'ember'],
      ['ellipse', 3, -1, 2, 4, 'ember'],
      ['ellipse', 0, -1, 1.5, 4.5, 'orange'],
      ['rect', 0, -7, 1, 3, 'leafDeep'],
      ['px', 1, -7, 'leaf'],
    ],
    [
      ['sphere', 'orange', [0, -0.08, 0], [0.82, 0.55, 0.82]],
      ...ring(
        6,
        0.5,
        -0.08,
        (x, z) => ['sphere', 'ember', [x, -0.08, z], [0.3, 0.5, 0.3]] as const,
      ),
      ['cyl', 'leafDeep', [0, 0.52, 0], [0.07, 0.24, 0.07], [0.2, 0, 0.2]],
    ],
  ),
  item(
    'bow',
    'hat',
    'common',
    [
      ['tri', 4, 0, 4, 4, 8, 2, 'rose'],
      ['tri', 4, 0, 4, 4, 0, 2, 'rose'],
      ['disc', 4, 2, 1.2, 'roseDeep'],
    ],
    [
      ['cone', 'rose', [0.42, -0.02, 0.18], [0.14, 0.32, 0.1], [0, 0, -Math.PI / 2]],
      ['cone', 'rose', [0.14, -0.02, 0.18], [0.14, 0.32, 0.1], [0, 0, Math.PI / 2]],
      ['sphere', 'roseDeep', [0.28, -0.02, 0.2], 0.08],
    ],
  ),
  item(
    'bell',
    'neck',
    'common',
    [
      ['rect', -5, -1, 11, 1, 'ember'],
      ['disc', 0, 1, 1.6, 'sunYellow'],
      ['px', 0, 2, 'sunDeep'],
    ],
    [
      ['torus', 'ember', [0, 0, 0], [0.42, 0.34, 0.42], [Math.PI / 2, 0, 0]],
      ['sphere', 'sunYellow', [0, -0.12, 0.42], 0.12],
      ['sphere', 'sunDeep', [0, -0.17, 0.5], 0.03],
    ],
    [['rect', -5, -1, 11, 1, 'ember']],
  ),
  item(
    'cape',
    'back',
    'common',
    [
      ['tri', -5, -5, 5, -5, -9, 6, 'ember'],
      ['tri', -5, -5, 5, -5, 9, 6, 'ember'],
      ['rect', -6, -6, 13, 2, 'berry'],
    ],
    [
      ['box', 'ember', [0, 0.25, -0.08], [1.1, 1.0, 0.05], [-0.2, 0, 0]],
      ['box', 'berry', [0, 0.72, 0.02], [1.0, 0.1, 0.12]],
    ],
    [
      ['tri', -5, -5, 5, -5, -8, 6, 'ember'],
      ['tri', -5, -5, 5, -5, 8, 6, 'ember'],
      ['rect', -6, -6, 13, 2, 'berry'],
      ['line', 0, -3, 0, 5, 'berry'],
    ],
  ),
  item(
    'backpack',
    'back',
    'common',
    [
      ['line', -3, -4, -2, 2, 'bark'],
      ['line', 3, -4, 2, 2, 'bark'],
    ],
    [
      ['box', 'leafDeep', [0, 0.2, -0.12], [0.75, 0.8, 0.4]],
      ['box', 'leaf', [0, 0.05, -0.34], [0.55, 0.35, 0.06]],
      ['box', 'bark', [0, 0.62, -0.1], [0.4, 0.06, 0.2]],
    ],
    [
      ['rect', -4, -5, 9, 9, 'leafDeep'],
      ['rect', -3, 0, 7, 3, 'leaf'],
      ['rect', -2, -6, 5, 1, 'bark'],
    ],
  ),
  item(
    'flower-crown',
    'hat',
    'common',
    [
      ['rect', -7, 1, 15, 1, 'leaf'],
      ['disc', -6, 1, 1.4, 'rose'],
      ['disc', -2, 0, 1.4, 'sunYellow'],
      ['disc', 2, 0, 1.4, 'lavender'],
      ['disc', 6, 1, 1.4, 'rose'],
      ['px', -2, 0, 'orange'],
      ['px', 2, 0, 'white'],
    ],
    [
      ['torus', 'leaf', [0, -0.2, 0], [0.62, 0.62, 0.62], [Math.PI / 2, 0, 0]],
      ...ring(
        6,
        0.62,
        -0.2,
        (x, z, a) =>
          [
            'sphere',
            (['rose', 'sunYellow', 'lavender'] as const)[Math.round(a * 0.96) % 3]!,
            [x, -0.16, z],
            0.11,
          ] as const,
      ),
    ],
  ),
  item(
    'party',
    'hat',
    'common',
    [
      ['tri', -4, 2, 4, 2, 0, -8, 'violet'],
      ['line', -2, -1, 2, -2, 'sunYellow'],
      ['line', -3, 1, 3, 0, 'mint'],
      ['disc', 0, -8, 1.4, 'sunYellow'],
    ],
    [
      ['cone', 'violet', [0, 0.3, 0], [0.4, 0.8, 0.4], [0, 0, 0.15]],
      ['cyl', 'sunYellow', [0, 0.1, 0], [0.33, 0.05, 0.33], [0, 0, 0.15]],
      ['sphere', 'sunYellow', [-0.1, 0.72, 0], 0.11],
    ],
  ),
  item(
    'top-hat',
    'hat',
    'rare',
    [
      ['rect', -4, -8, 9, 9, 'ink'],
      ['rect', -7, 1, 15, 2, 'ink'],
      ['rect', -4, -1, 9, 1, 'ember'],
      ['line', -3, -7, -3, -2, 'dusk'],
    ],
    [
      ['cyl', 'ink', [0, 0.25, 0], [0.42, 0.75, 0.42]],
      ['cyl', 'ink', [0, -0.12, 0], [0.78, 0.04, 0.78]],
      ['cyl', 'ember', [0, -0.02, 0], [0.43, 0.1, 0.43]],
    ],
  ),
  item(
    'chef',
    'hat',
    'common',
    [
      ['rect', -5, -2, 11, 4, 'white'],
      ['ellipse', -3, -4, 3, 3, 'white'],
      ['ellipse', 3, -4, 3, 3, 'white'],
      ['ellipse', 0, -6, 3.5, 3, 'white'],
      ['line', -5, 1, 5, 1, 'greyLight'],
    ],
    [
      ['cyl', 'white', [0, 0, 0], [0.5, 0.42, 0.5]],
      ['sphere', 'white', [0, 0.4, 0], [0.62, 0.36, 0.62]],
      ['sphere', 'greyLight', [0, -0.18, 0], [0.51, 0.06, 0.51]],
    ],
  ),
  item(
    'beret',
    'hat',
    'common',
    [
      ['ellipse', -1, 0, 7, 2.5, 'berry'],
      ['ellipse', -1, -1, 6, 1.5, 'rose'],
      ['rect', 0, -4, 1, 2, 'berry'],
    ],
    [
      ['sphere', 'berry', [-0.1, -0.05, 0], [0.72, 0.18, 0.72], [0, 0, 0.2]],
      ['cyl', 'berry', [-0.12, 0.16, 0], [0.04, 0.12, 0.04]],
    ],
  ),
  item(
    'swim-ring',
    'body',
    'common',
    [
      ['ellipse', 0, 2, 9, 3, 'rose'],
      ['ellipse', 0, 1, 6, 1.5, 'white'],
      ['rect', -9, 1, 2, 2, 'white'],
      ['rect', 7, 1, 2, 2, 'white'],
    ],
    [
      ['torus', 'rose', [0, -0.1, 0], [0.84, 0.84, 1.4], [Math.PI / 2, 0, 0]],
      ...ring(4, 0.84, -0.1, (x, z) => ['sphere', 'white', [x, -0.1, z], 0.15] as const),
    ],
  ),
  item(
    'leaf-umbrella',
    'hat',
    'common',
    [
      ['line', 2, 2, 2, -8, 'bark'],
      ['ellipse', 2, -9, 9, 3, 'leaf'],
      ['ellipse', 2, -8, 8, 1.5, 'leafDeep'],
      ['line', -6, -9, 10, -9, 'leafLight'],
    ],
    [
      ['cyl', 'bark', [0.15, 0.45, 0], [0.04, 1.0, 0.04]],
      ['dome', 'leaf', [0.15, 0.9, 0], [1.1, 0.3, 0.85]],
      ['cyl', 'leafDeep', [0.15, 0.9, 0], [1.08, 0.02, 0.83]],
    ],
  ),
  item(
    'sunhat',
    'hat',
    'common',
    [
      ['ellipse', 0, 1, 11, 2.5, 'sandLight'],
      ['ellipse', 0, -2, 5, 3.5, 'sandLight'],
      ['rect', -5, -1, 11, 1, 'rose'],
      ['disc', 5, -1, 1.3, 'roseLight'],
    ],
    [
      ['cyl', 'sandLight', [0, -0.25, 0], [1.25, 0.04, 1.25]],
      ['dome', 'sandLight', [0, -0.22, 0], [0.55, 0.45, 0.55]],
      ['cyl', 'rose', [0, -0.15, 0], [0.56, 0.1, 0.56]],
    ],
  ),
  item(
    'nightcap',
    'hat',
    'common',
    [
      ['ellipse', 0, 1, 7.5, 3, 'skyDeep'],
      ['tri', -6, 1, 6, 1, 9, -5, 'skyDeep'],
      ['rect', -7, 2, 15, 2, 'white'],
      ['disc', 9, -5, 1.6, 'white'],
      ['px', -2, -1, 'sunYellow'],
    ],
    [
      ['dome', 'skyDeep', [0, -0.3, 0], [0.8, 0.5, 0.8]],
      ['cone', 'skyDeep', [0.3, 0.3, 0], [0.4, 0.8, 0.4], [0, 0, -1.1]],
      ['cyl', 'white', [0, -0.3, 0], [0.82, 0.12, 0.82]],
      ['sphere', 'white', [0.72, 0.42, 0], 0.13],
    ],
  ),
  item(
    'halo-band',
    'hat',
    'rare',
    [
      ['line', 4, 1, 4, -5, 'greyLight'],
      ['ellipse', 0, -6, 6, 1.6, 'sunYellow'],
      ['ellipse', 0, -6, 4, 0.6, 'sunLight'],
    ],
    [
      ['cyl', 'greyLight', [0.3, 0.2, 0], [0.02, 0.5, 0.02]],
      ['ring', 'sunYellow', [0, 0.45, 0], [0.55, 0.55, 0.55], [Math.PI / 2, 0, 0]],
    ],
  ),
  item(
    'horns',
    'hat',
    'rare',
    [
      ['tri', -6, 3, -3, 3, -6, -3, 'ember'],
      ['tri', 3, 3, 6, 3, 6, -3, 'ember'],
      ['px', -6, -2, 'berry'],
      ['px', 6, -2, 'berry'],
    ],
    [
      ['cone', 'ember', [-0.42, -0.1, 0.05], [0.13, 0.36, 0.13], [0, 0, 0.4]],
      ['cone', 'ember', [0.42, -0.1, 0.05], [0.13, 0.36, 0.13], [0, 0, -0.4]],
    ],
  ),
];

const BY_ID = new Map(COSMETICS.map((c) => [c.id, c]));

/** The eggshell hat's id for one egg colour (LOOK-26). */
export const eggshellId = (colour: string): string => `shell:${colour}`;

/** The egg colour an eggshell id was cut from, or null. */
export const eggshellColour = (id: string): string | null =>
  id.startsWith('shell:') ? id.slice(6) : null;

/** The top half of the egg: a dome with a zigzag rim, a cap on top, in the egg's colours. */
function eggshell(colour: string): Cosmetic {
  return {
    id: eggshellId(colour),
    label: eggshellLabel(colour),
    slot: 'hat',
    rarity: 'common',
    source: 'hatch',
    px: [
      // The broken rim first, in the shade, so its teeth read against the head.
      ...[-6, -3, 0, 3].map((x) => ['tri', x, 0, x + 3, 0, x + 1.5, 4.5, 'egg.shade'] as const),
      ...[-6, -3, 0, 3].map(
        (x) => ['tri', x + 0.5, 0, x + 2.5, 0, x + 1.5, 3.5, 'egg.shell'] as const,
      ),
      ['ellipse', 0, -1, 6, 3.5, 'egg.shade'],
      ['ellipse', -0.5, -1.5, 5.5, 3, 'egg.shell'],
      ['ellipse', 0, -3, 2.5, 1, 'egg.cap'],
      ['px', -3, -2, 'white'],
      ['px', 2, -1, 'egg.spot'],
    ],
    mesh: [
      ['dome', 'egg.shell', [0, -0.3, 0], [0.66, 0.5, 0.66]],
      ['sphere', 'egg.cap', [0, 0.17, 0], [0.32, 0.06, 0.32]],
      ...ring(
        8,
        0.62,
        -0.3,
        (x, z, a) =>
          [
            'cone',
            'egg.shell',
            [x, -0.37, z],
            [0.12, 0.16, 0.12],
            [Math.PI + Math.cos(a) * 0.3, 0, -Math.sin(a) * 0.3],
          ] as const,
      ),
    ],
  };
}

/** A wearable by id, the eggshells included; null for an unknown id (an old or bad save). */
export function cosmetic(id: string): Cosmetic | null {
  const shell = eggshellColour(id);
  if (shell) return eggshell(shell);
  return BY_ID.get(id) ?? null;
}

/** The name the Roster and the shop show for a wearable. */
export function cosmeticLabel(id: string): string {
  return cosmetic(id)?.label ?? HAT_LABELS[id] ?? id;
}

/** What the shop sells: every wearable whose source is the shop, in registry order. */
export const SHOP_COSMETICS: readonly string[] = COSMETICS.filter((c) => c.source === 'shop').map(
  (c) => c.id,
);
