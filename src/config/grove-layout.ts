import { DECOR, GROVE, LANTERN_POSTS, STORY_PROPS } from './tuning';
import type { StoryPropKind } from '../sim/story-props';
import { BRIDGE_DECK, BRIDGE_YAW, TERRACE } from './tuning-sim';

/**
 * The one table of placed solids in the home Grove (MOVE-01). The sim builds its colliders
 * from it (`sim/obstacles.ts`), the pixel view places the scenery sprites from it
 * (`render/scenery.ts`) and the 3D village places its stalls from it, so what is drawn and
 * what blocks a walker can no longer drift apart. Hills, fruit trees, buildings, the big
 * rocks and the lantern posts still live in `GROVE` and `LANTERN_POSTS`; they are turned
 * into colliders here, beside the wild props that used to live only in the pixel view.
 */

/**
 * A collider's outline on the ground. Boxes and segments turn by the collider's `yaw` the
 * way a three.js `rotation.y` does: local x runs along (cos yaw, −sin yaw) in world x/z.
 */
export type ColliderShape =
  | { type: 'circle'; r: number }
  /** An oriented box, half width along local x and half depth along local z. */
  | { type: 'box'; hw: number; hd: number }
  /** A capsule: a line `len` long along local x, thickened by `r`. */
  | { type: 'segment'; len: number; r: number };

/**
 * What a collider does to walkers. `solid` blocks everyone; `keeperOnly` blocks only the
 * Keepers (Nubbins walk under a canopy to the fruit); `soft` slows and nudges the Keeper
 * instead of stopping it, and Nubbins pass; `hop` can be jumped by a Nubbin with Run or Fly
 * of `NUBBIN_HOP.stat` or more (the Keeper's jump comes with MOVE-10); `standable` has a top
 * a jumper can land on (MOVE-10). Until the jump lands, hop and standable pieces block the
 * Keeper like any solid.
 * `nubbinOnly` blocks Nubbins but not the Keeper: the hills, whose terraces the Keeper climbs
 * by their ramps or jumps (MOVE-09), stopped at each cliff by `ledgeY` instead.
 */
export type ColliderFlag = 'solid' | 'keeperOnly' | 'nubbinOnly' | 'soft' | 'hop' | 'standable';

export interface Collider {
  id: string;
  x: number;
  z: number;
  yaw: number;
  shape: ColliderShape;
  /** Height of the top surface above the ground, in units. */
  top: number;
  flags: readonly ColliderFlag[];
  /** A stall stands only once the village has grown to it (`townUnlocks`). */
  when?: StallUnlock;
}

/** A Nubbin with Run or Fly at this level or above hops a `hop` collider (a fence, a log). */
export const NUBBIN_HOP = { stat: 20 } as const;

/** The art keys of the wild props; the pixel painter and the 3D dressing know them. */
export type WildArt =
  | 'bush-1'
  | 'bush-2'
  | 'bush-3'
  | 'log'
  | 'rock-1'
  | 'rock-2'
  | 'wild-1'
  | 'wild-2'
  | 'wild-3'
  | 'wild-4';

/** A wild prop: drawn by both renderers, collided by the sim. `size` is the sprite width. */
export interface WildProp {
  art: WildArt;
  x: number;
  z: number;
  size: number;
  /** Logs lie along this angle (radians, as a collider's yaw). */
  yaw?: number;
}

export const WILD_PROPS: readonly WildProp[] = [
  // Bushes at the edges and near the water.
  { art: 'bush-1', x: -11, z: 1, size: 2.4 },
  { art: 'bush-2', x: 13.5, z: 10.5, size: 2.4 },
  { art: 'bush-3', x: -20, z: -4, size: 2.4 },
  { art: 'bush-1', x: 2, z: 18, size: 2.4 },
  { art: 'bush-2', x: 13, z: -2.5, size: 2.2 },
  { art: 'bush-3', x: -10, z: -10, size: 2.2 },
  { art: 'bush-1', x: 20, z: 18, size: 2.4 },
  { art: 'bush-2', x: -20, z: 20, size: 2.4 },
  { art: 'bush-3', x: 8, z: -20, size: 2.2 },
  { art: 'bush-1', x: -1, z: -8, size: 2.1 },
  { art: 'log', x: -1, z: 20, size: 2.4 },
  { art: 'log', x: 3, z: -5, size: 2.4 },
  { art: 'log', x: -17, z: 2, size: 2.4 },
  { art: 'rock-1', x: -7, z: 9, size: 1.6 },
  { art: 'rock-2', x: -6, z: 9.8, size: 1.0 },
  { art: 'rock-1', x: 6, z: -9, size: 1.4 },
  { art: 'rock-2', x: 13, z: -5, size: 1.0 },
  { art: 'rock-1', x: -10, z: 10, size: 1.3 },
  // ---- the outer ring (the field grew to 96 units) ----
  // The north wood: a stand of wild trees between the cave hill and the north edge.
  { art: 'wild-1', x: -30, z: -30, size: 7.0 },
  { art: 'wild-2', x: -36, z: -24, size: 6.4 },
  { art: 'wild-3', x: -24, z: -36, size: 6.8 },
  { art: 'wild-4', x: -28, z: -42, size: 6.0 },
  { art: 'wild-2', x: -18, z: -32, size: 6.2 },
  { art: 'wild-1', x: -40, z: -14, size: 6.6 },
  { art: 'wild-3', x: -8, z: -36, size: 6.4 },
  { art: 'wild-4', x: 10, z: -40, size: 6.0 },
  { art: 'wild-1', x: -14, z: -42, size: 6.4 },
  { art: 'bush-3', x: -31, z: -36.8, size: 2.4 },
  { art: 'bush-1', x: -22, z: -28, size: 2.2 },
  { art: 'bush-2', x: -12, z: -30, size: 2.2 },
  { art: 'log', x: -30, z: -20, size: 2.4 },
  { art: 'rock-1', x: -22, z: -40, size: 1.4 },
  { art: 'rock-2', x: -34, z: -20, size: 1.1 },
  // The east ridge: the big hill, scree and a few hardy trees.
  { art: 'wild-3', x: 26, z: -26, size: 6.4 },
  { art: 'wild-1', x: 40, z: -20, size: 6.0 },
  { art: 'wild-2', x: 28, z: -42, size: 6.2 },
  { art: 'rock-1', x: 20, z: -32, size: 1.6 },
  { art: 'rock-2', x: 24, z: -30, size: 1.0 },
  { art: 'rock-1', x: 30, z: 12, size: 1.4 },
  { art: 'bush-3', x: 34, z: -12, size: 2.4 },
  { art: 'bush-1', x: 40, z: 2, size: 2.4 },
  { art: 'log', x: 36, z: 10, size: 2.4 },
  { art: 'bush-2', x: 30, z: 20, size: 2.2 },
  // The far orchard corner and the south marsh along the stream.
  { art: 'wild-4', x: 36, z: 22, size: 6.0 },
  { art: 'wild-2', x: 22, z: 40, size: 6.4 },
  { art: 'bush-1', x: 32, z: 36, size: 2.4 },
  { art: 'rock-2', x: 36, z: 40, size: 1.0 },
  { art: 'log', x: 2, z: 32, size: 2.4 },
  { art: 'rock-1', x: -6, z: 34, size: 1.3 },
  { art: 'wild-1', x: -4, z: 42, size: 6.2 },
  { art: 'bush-3', x: 18, z: 30, size: 2.2 },
  { art: 'bush-2', x: -12, z: 40, size: 2.2 },
  // The west meadow: open grass, flowers, a fruit tree and the low hill.
  { art: 'wild-3', x: -42, z: 8, size: 6.4 },
  { art: 'wild-4', x: -40, z: 28, size: 6.0 },
  { art: 'wild-2', x: -22, z: 30, size: 6.4 },
  { art: 'bush-1', x: -26, z: 24, size: 2.4 },
  { art: 'bush-2', x: -36, z: 14, size: 2.2 },
  { art: 'log', x: -26, z: 12.5, size: 2.4 },
  { art: 'rock-1', x: -28, z: 8, size: 1.5 },
  { art: 'bush-3', x: -30, z: 42, size: 2.4 },
];

/** The cottage's own lantern, beside its door (not one of the four story lanterns). */
export const COTTAGE_LANTERN = {
  x: GROVE.buildings.cottage.x - 3.2,
  z: GROVE.buildings.cottage.z + 1.6,
} as const;

/** The cave mouth in the east face of the north-west hill, and the radius of its opening. */
export const CAVE_MOUTH = { x: -12.4, z: -13.6, r: 1.6 } as const;

export type StallUnlock = 'stall' | 'attendant' | 'festival';

/** The village stalls: where each stands and which town unlock puts it there. */
export const STALL_SPOTS: ReadonlyArray<{ x: number; z: number; when: StallUnlock }> = [
  { x: -12, z: 17.5, when: 'stall' },
  { x: -9.5, z: 18.5, when: 'attendant' },
  { x: -14.5, z: 18.8, when: 'festival' },
];

/**
 * The houses' footprints, matching the 3D walls (`render3d/props.ts` HOUSES: w × d, square
 * to the axes). The roof overhang is left out so the Keeper can tuck under the eaves.
 */
export const HOUSE_FOOTPRINT = {
  cottage: { hw: 2.6, hd: 2.0 },
  school: { hw: 2.3, hd: 1.8 },
  dojo: { hw: 3.2, hd: 2.4 },
} as const;

/** The windmill's stone footing (`render3d/props.ts`: a 1.95 radius drum). */
const WINDMILL_FOOTING = 1.95;

const circle = (r: number): ColliderShape => ({ type: 'circle', r });

/** The colliders of the wild props, by kind (MOVE-03). */
function wildCollider(p: WildProp, i: number): Collider | null {
  const id = `wild-${i}`;
  if (p.art.startsWith('bush'))
    return { id, x: p.x, z: p.z, yaw: 0, shape: circle(0.3 * p.size), top: 0.9, flags: ['soft'] };
  if (p.art === 'log')
    return {
      id,
      x: p.x,
      z: p.z,
      yaw: p.yaw ?? 0,
      shape: { type: 'segment', len: 0.8 * p.size, r: 0.3 },
      top: 0.45,
      flags: ['hop'],
    };
  if (p.art.startsWith('wild'))
    return { id, x: p.x, z: p.z, yaw: 0, shape: circle(0.45), top: 4, flags: ['keeperOnly'] };
  // A rock sprite that stands on one of the big rocks is that rock; it is collided there.
  if (GROVE.rocks.some((k) => Math.hypot(k.x - p.x, k.z - p.z) < 0.3)) return null;
  return {
    id,
    x: p.x,
    z: p.z,
    yaw: 0,
    shape: circle(0.3 * p.size),
    top: 0.5,
    flags: ['hop', 'standable'],
  };
}

/** Every fixed collider in the home Grove; placed decor is added by the sim per world. */
export const GROVE_COLLIDERS: readonly Collider[] = (() => {
  const out: Collider[] = [];
  const add = (c: Collider): void => {
    out.push(c);
  };
  GROVE.hills.forEach((h, i) =>
    add({
      id: `hill-${i}`,
      x: h.x,
      z: h.z,
      yaw: 0,
      shape: circle(h.r + 0.25),
      top: h.h,
      flags: ['nubbinOnly'],
    }),
  );
  // Hill 1's waterfall face is never climbed: a solid band down the cascade's line, from
  // part way across the top to the foot, at the full height of the hill.
  {
    const h = GROVE.hills[1];
    const f = GROVE.river.inflow[0];
    const phi = Math.atan2(f.z - h.z, f.x - h.x);
    const r0 = h.r * TERRACE.topFactor * 0.5;
    const r1 = h.r + 0.3;
    const mid = (r0 + r1) / 2;
    add({
      id: 'waterfall-face',
      x: h.x + Math.cos(phi) * mid,
      z: h.z + Math.sin(phi) * mid,
      yaw: -phi,
      shape: { type: 'segment', len: r1 - r0, r: GROVE.waterfall.width / 2 },
      top: h.h,
      flags: ['solid'],
    });
  }
  GROVE.trees.forEach((t, i) =>
    add({
      id: `tree-${i + 1}`,
      x: t.x,
      z: t.z,
      yaw: 0,
      shape: circle(0.45),
      top: 4,
      flags: ['keeperOnly'],
    }),
  );
  const b = GROVE.buildings;
  for (const id of ['cottage', 'school', 'dojo'] as const) {
    const f = HOUSE_FOOTPRINT[id];
    add({
      id,
      x: b[id].x,
      z: b[id].z,
      yaw: 0,
      shape: { type: 'box', hw: f.hw, hd: f.hd },
      top: 2.6,
      flags: ['solid'],
    });
  }
  add({
    id: 'well',
    x: b.well.x,
    z: b.well.z,
    yaw: 0,
    shape: circle(b.well.r),
    top: 0.9,
    flags: ['solid'],
  });
  add({
    id: 'windmill',
    x: b.windmill.x,
    z: b.windmill.z,
    yaw: 0,
    shape: circle(WINDMILL_FOOTING),
    top: 5,
    flags: ['solid'],
  });
  GROVE.rocks.forEach((k, i) =>
    add({
      id: `rock-${i}`,
      x: k.x,
      z: k.z,
      yaw: 0,
      shape: circle(k.r),
      top: 0.6,
      flags: ['solid'],
    }),
  );
  // The bridge's rails (MOVE-12): one each side of the deck, along its length and open at
  // both ends, so the deck is walked end to end and never stepped off sideways.
  for (const side of [-1, 1]) {
    const c = Math.cos(BRIDGE_YAW);
    const s = Math.sin(BRIDGE_YAW);
    const off = side * BRIDGE_DECK.railOffset;
    add({
      id: `bridge-rail-${side < 0 ? 'w' : 'e'}`,
      x: GROVE.bridge.x + off * c,
      z: GROVE.bridge.z - off * s,
      yaw: BRIDGE_YAW - Math.PI / 2,
      shape: { type: 'segment', len: BRIDGE_DECK.hd * 2, r: BRIDGE_DECK.railR },
      top: BRIDGE_DECK.railTop,
      flags: ['solid'],
    });
  }
  // Lantern posts are thin but solid: nobody walks through one (review D, play-test).
  for (const p of LANTERN_POSTS)
    add({ id: p.id, x: p.x, z: p.z, yaw: 0, shape: circle(0.3), top: 1.6, flags: ['solid'] });
  add({
    id: 'cottage-lantern',
    ...COTTAGE_LANTERN,
    yaw: 0,
    shape: circle(0.3),
    top: 1.6,
    flags: ['solid'],
  });
  // The cave's arch stands proud of the hill; its two lips run east from the hill face on
  // either side of the opening, so the mouth itself stays open to walk into.
  for (const side of [-1, 1])
    add({
      id: `cave-lip-${side < 0 ? 'n' : 's'}`,
      x: CAVE_MOUTH.x + 0.2,
      z: CAVE_MOUTH.z + side * (CAVE_MOUTH.r + 0.3),
      yaw: 0,
      shape: { type: 'segment', len: 1.2, r: 0.3 },
      top: 2,
      flags: ['solid'],
    });
  for (const s of STALL_SPOTS)
    add({
      id: `stall-${s.when}`,
      x: s.x,
      z: s.z,
      yaw: 0,
      shape: { type: 'box', hw: 1.05, hd: 0.3 },
      top: 0.8,
      flags: ['solid'],
      when: s.when,
    });
  WILD_PROPS.forEach((p, i) => {
    const c = wildCollider(p, i);
    if (c) add(c);
  });
  return out;
})();

/** The placed garden buildings' footprints: the kit house is `w` wide and 0.7·w deep. */
const PLACED_WIDTH: Partial<Record<string, number>> = {
  nursery: 4.4,
  bathhouse: 5.6,
  workshop: 5.8,
};

/** The collider a placed piece of decor gets, or null for a walk-on piece (path tiles). */
export function decorCollider(
  id: string,
  kind: string,
  x: number,
  z: number,
  yaw = 0,
): Collider | null {
  const w = PLACED_WIDTH[kind];
  if (w) {
    return {
      id,
      x,
      z,
      yaw,
      shape: { type: 'box', hw: w / 2, hd: (w * 0.7) / 2 },
      top: w * 0.45,
      flags: ['solid'],
    };
  }
  const specs: Partial<
    Record<string, { shape: ColliderShape; top: number; flags: readonly ColliderFlag[] }>
  > = DECOR.colliders;
  const spec = specs[kind];
  if (!spec) return null;
  return { id, x, z, yaw, shape: spec.shape, top: spec.top, flags: spec.flags };
}

/**
 * The story props' colliders (MOVE-16), by kind, the size of what both renderers draw:
 * the shed and the barn are walls, the benches, Corvin's chair and the flat stone can be
 * stood on, the sunrise shelf is a solid little stand. The trowel, the register, the hand
 * lantern and the garden door have none. Only a prop standing now collides
 * (`storyPropStands`, sim/story-props.ts).
 */
const STORY_PROP_SHAPES: Partial<Record<StoryPropKind, Pick<Collider, 'shape' | 'top' | 'flags'>>> =
  {
    shed: { shape: { type: 'box', hw: 1.2, hd: 1.0 }, top: 1.6, flags: ['solid'] },
    barn: { shape: { type: 'box', hw: 1.9, hd: 1.4 }, top: 3.4, flags: ['solid'] },
    oldBench: { shape: { type: 'box', hw: 0.6, hd: 0.2 }, top: 0.45, flags: ['hop', 'standable'] },
    chair: { shape: circle(0.3), top: 0.45, flags: ['hop', 'standable'] },
    shelf: { shape: { type: 'box', hw: 0.5, hd: 0.15 }, top: 1.0, flags: ['solid'] },
    flatStone: { shape: circle(0.5), top: 0.15, flags: ['standable'] },
  };

/** Each story prop's collider, in `STORY_PROPS` order (null for one that has none). */
export const STORY_PROP_COLLIDERS: ReadonlyArray<Collider | null> = STORY_PROPS.map((p) => {
  const s = STORY_PROP_SHAPES[p.kind];
  return s ? { id: `story-${p.id}`, x: p.x, z: p.z, yaw: 0, ...s } : null;
});
