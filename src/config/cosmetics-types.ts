// The cosmetic registry's shapes (split from cosmetics.ts, TECH-36).
import type { C } from '../render/sprites/palette';
import type { Season } from '../sim/types';

export type CosmeticSlot = 'hat' | 'face' | 'neck' | 'back' | 'body';
export type CosmeticRarity = 'common' | 'rare' | 'prize';
/** `season`: on sale only in its real season (LOOK-70), and kept for good once bought. */
/** `hollow`: a Hollow keepsake (R0206, lane B), given by an act boss. */
/** `keepsake`: given by the story of the Grove itself, never sold (lane E r9, R0424). */
/** `eternal`: a character look unlocked by a Nubbin becoming Eternal (R0414). */
export type CosmeticSource =
  'shop' | 'race' | 'hatch' | 'season' | 'hollow' | 'keepsake' | 'eternal';

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
  /** LOOK-70: the real season a `season` wearable is on sale in. */
  season?: Season;
  /** Drawn by the renderers' own hand-made shapes instead of the lists below. */
  bespoke?: true;
  /** Pixel shapes for the front and side views, and for the back views when they differ. */
  px?: readonly PxOp[];
  pxBack?: readonly PxOp[];
  /** R0437: drawn in place of `px` in the side view, where a race is always seen from. */
  pxSide?: readonly PxOp[];
  mesh?: readonly MeshOp[];
  /**
   * R0413: a body-slot costume. `costume` recolours the body roles (palette names); `head` and
   * `headMesh` are its head parts (antennae, a hood, a helmet), anchored like a hat while
   * `px` and `mesh` are anchored on the body. A costume never covers the face or the eyes.
   */
  costume?: { body: keyof typeof C; shade: keyof typeof C; belly?: keyof typeof C };
  head?: readonly PxOp[];
  headMesh?: readonly MeshOp[];
}
