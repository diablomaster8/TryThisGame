import type { StagePlace } from './story';
import { GROVE, HUSH, LANTERN_POSTS, LOOK_F, STORY_B } from './tuning';

/**
 * The story's stage marks (campaign graphics C1): where a figure stands for a scene, as
 * `{ x, z, yaw }`. `yaw` is the way the figure faces, as `atan2(dx, dz)`: 0 faces +z
 * (south, toward the cottage), PI faces -z (north, toward the falls). Scripts name marks
 * and never carry coordinates.
 *
 * Three sets, each in its own coordinates:
 * - `grove`: the home Grove (the GROVE numbers in tuning.ts). The separate campaigns
 *   (The Hundred Days' Fold, Dawn & Dusk's green, The Beetle Road, Logged In) are dressed
 *   over the same ground, so their marks are here too.
 * - `hollow`: the dark wood past the falls (render/grove-scene.ts `buildHollow`, the 3D
 *   story-sets.ts), with the flat stone at (-9, -9).
 * - `corvin`: Corvin's garden, three pens in rows from z -7.5 to 1.5, x -10 to 10.
 */
export interface StageMark {
  x: number;
  z: number;
  yaw: number;
}

export type MarkSet = 'grove' | 'hollow' | 'corvin';

const PI = Math.PI;
const N = PI; // facing north (-z)
const S = 0; // facing south (+z)
const W = -PI / 2; // facing west (-x)
const E = PI / 2; // facing east (+x)
/** The yaw from (x, z) toward (tx, tz). */
const toward = (x: number, z: number, tx: number, tz: number): number => Math.atan2(tx - x, tz - z);

const post = (id: string): { x: number; z: number } =>
  LANTERN_POSTS.find((l) => l.id === id) ?? { x: 0, z: 0 };
/** A spot a step south of a lantern post, turned to it. */
const byPost = (id: string): StageMark => {
  const p = post(id);
  return { x: p.x, z: p.z + 1.2, yaw: N };
};

const COTTAGE = GROVE.buildings.cottage;
const HILL = GROVE.hills[0];
const FALLS = GROVE.waterfall;
const POND = GROVE.pond;
const WINDMILL = GROVE.buildings.windmill;
/** Dawn & Dusk's green (tuning-b): its houses stand `houseRadius` out, N, E, S, W. */
const GREEN = STORY_B.dawnDusk.green;
const HOUSE_R = STORY_B.dawnDusk.houseRadius;
/** A spot at a house's door, between the house and the green, facing the green. */
const doorOf = (dx: number, dz: number): StageMark => ({
  x: GREEN.x + dx * (HOUSE_R - 2.8),
  z: GREEN.z + dz * (HOUSE_R - 2.8),
  yaw: Math.atan2(-dx, -dz),
});

const WELL = GROVE.buildings.well;
/** The Fold's ruins round `fold-square` (STORY_B.fold.extras; package b draws them there). */
const FOLD_SQ = { x: 0, z: 2 };
/** A step in front of a Fold house (doors face +z), facing out to the square. */
const foldDoor = (x: number, z: number): StageMark => ({ x, z: z + 2.6, yaw: S });
/** The Beetle Road's guard house (LOOK_F.beetle.cabin), centred on the `guardhouse` mark. */
const GH = { x: -7, z: 29.5 };
const CAB = LOOK_F.beetle.cabin;
/** Dawn & Dusk's house `i` (1..4, N E S W): the house stands on its `house-i` mark. */
const houseDoor = (dx: number, dz: number): StageMark => {
  const h = doorOf(dx, dz);
  const len = Math.hypot(GREEN.x - h.x, GREEN.z - h.z) || 1;
  const x = h.x + ((GREEN.x - h.x) / len) * 2.6;
  const z = h.z + ((GREEN.z - h.z) / len) * 2.6;
  return { x, z, yaw: toward(h.x, h.z, GREEN.x, GREEN.z) };
};
/** Hazel ch12's picnic cloth (package f places it at 0.5, 2.5) and the festival ring round it. */
const PICNIC = { x: 0.5, z: 2.5 };
const FESTIVAL_R = 5.5;
const festival = (i: number): StageMark => {
  const a = (i / 12) * PI * 2;
  const x = PICNIC.x + Math.sin(a) * FESTIVAL_R;
  const z = PICNIC.z + Math.cos(a) * FESTIVAL_R;
  return { x, z, yaw: toward(x, z, PICNIC.x, PICNIC.z) };
};

/** The home Grove, and the separate campaigns' places dressed over it. */
const GROVE_MARKS: Record<string, StageMark> = {
  // The entrance: the lane comes in from the south, past the cottage side of the Grove.
  gate: { x: 0, z: 23, yaw: N },
  'gate-outside': { x: 0, z: 26, yaw: N },
  signpost: { x: 2, z: 21.5, yaw: N },
  // The cottage's door faces +z (kit-buildings: "door toward +z"), its front at z + 2.
  step: { x: COTTAGE.x, z: COTTAGE.z + 2.8, yaw: S },
  porch: { x: COTTAGE.x + 1.4, z: COTTAGE.z + 3.4, yaw: S },
  window: { x: COTTAGE.x + 1.6, z: COTTAGE.z + 2.6, yaw: N },
  // The four lanterns: lantern-3 by the pond, lantern-2 by the stream (the vigil's first
  // wave), lantern-1 by the wall, lantern-4 in the long grass (the second wave).
  'pond-lantern': byPost('lantern-3'),
  'stream-lantern': byPost('lantern-2'),
  'wall-lantern': byPost('lantern-1'),
  'grass-lantern': byPost('lantern-4'),
  // The memorial hill (GROVE.hills[0]); the path climbs from the east.
  'hill-path': { x: HILL.x + HILL.r + 1, z: HILL.z + 1, yaw: W },
  // On the second terrace (0.62 r out), where package c draws the stone itself.
  'flat-stone': { x: HILL.x + HILL.r * 0.61, z: HILL.z + 0.68, yaw: W },
  'hill-top': { x: HILL.x, z: HILL.z, yaw: S },
  briar: { x: HILL.x - 1, z: HILL.z - 1.5, yaw: S },
  // The falls: the pool at the foot, the ledge behind the water.
  'falls-foot': { x: FALLS.x - 3, z: FALLS.z + 4, yaw: Math.atan2(3, -4) },
  ledge: { x: FALLS.x, z: FALLS.z + 0.8, yaw: S },
  // The Hundred Days: the Fold round the Grove's heart, the mill, the shore.
  'fold-square': { x: 0, z: 2, yaw: S },
  mill: { x: WINDMILL.x + 2.4, z: WINDMILL.z + 2, yaw: W },
  'shore-jetty': { x: POND.x, z: POND.z + POND.r + 0.6, yaw: N },
  // Dawn & Dusk: four houses round a green (STORY_B.dawnDusk), each mark at a door.
  'green-centre': { x: GREEN.x, z: GREEN.z, yaw: S },
  green: { x: GREEN.x, z: GREEN.z, yaw: S },
  'house-1': doorOf(0, -1),
  'house-2': doorOf(1, 0),
  'house-3': doorOf(0, 1),
  'house-4': doorOf(-1, 0),
  shrine: { x: GREEN.x - 1.5, z: GREEN.z + 1.5, yaw: S },
  bell: { x: GREEN.x + 1.5, z: GREEN.z + 1.5, yaw: S },
  // The Beetle Road: a guard house and the cart on the lane outside the gate, well clear
  // of the gate's posts and fence (the cart is LOOK_F's, drawn there by package f).
  guardhouse: { x: -7, z: 29.5, yaw: N },
  cart: { x: LOOK_F.beetle.cart.x, z: LOOK_F.beetle.cart.z, yaw: W },
  // Logged In: a lobby round the Grove's heart.
  lobby: { x: 0, z: 1, yaw: S },
  board: { x: 3, z: -2, yaw: S },
  'root-chair': { x: -3, z: -2.5, yaw: S },
  // ---- campaign graphics 2 (wave 0): the storylines' speakers and the festival ring ----
  'fold-well': { x: WELL.x, z: WELL.z + WELL.r + 0.6, yaw: N },
  'fold-door-1': { x: COTTAGE.x, z: COTTAGE.z + 2.8, yaw: S },
  'fold-door-2': foldDoor(FOLD_SQ.x - 9, FOLD_SQ.z - 2),
  'fold-door-3': foldDoor(FOLD_SQ.x - 7, FOLD_SQ.z + 6),
  'fold-door-4': foldDoor(FOLD_SQ.x + 5, FOLD_SQ.z - 9),
  'house-1-door': houseDoor(0, -1),
  'house-2-door': houseDoor(1, 0),
  'house-3-door': houseDoor(0, 1),
  'house-4-door': houseDoor(-1, 0),
  'guardhouse-bench': { x: GH.x + CAB.w / 2 + 1.0, z: GH.z + CAB.d / 2 + 0.6, yaw: S },
  'banner-1': { x: GH.x - CAB.w / 2 + 0.55, z: GH.z + CAB.d / 2 + 1.3, yaw: N },
  'banner-2': { x: GH.x + CAB.w / 2 - 0.55, z: GH.z + CAB.d / 2 + 1.3, yaw: N },
  'banner-3': { x: GH.x + CAB.w / 2 + 1.3, z: GH.z, yaw: W },
  'rootNode-chair': { x: -3, z: -2.5, yaw: S },
  hush: { x: HUSH.origin.x, z: HUSH.origin.z, yaw: S },
  ...Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [`festival-${i + 1}`, festival(i)] as const),
  ),
  // Where the Keeper stands by default for a scene at each place (H7; `PLACE_KEEPER`).
  // Inside the gate and a step aside, so its posts and fence never hide the Keeper.
  'keeper-gate': { x: 1.8, z: 19.8, yaw: toward(1.8, 19.8, 0, 23) },
  'keeper-step': { x: COTTAGE.x + 0.4, z: COTTAGE.z + 5.0, yaw: N },
  'keeper-pond': { x: POND.x + 1.6, z: POND.z + POND.r + 1.4, yaw: N },
  'keeper-falls': {
    x: FALLS.x - 4.6,
    z: FALLS.z + 5.6,
    yaw: toward(FALLS.x - 4.6, FALLS.z + 5.6, FALLS.x, FALLS.z),
  },
  'keeper-ledge': { x: FALLS.x - 1.4, z: FALLS.z + 1.0, yaw: E },
  'keeper-hill': { x: HILL.x + HILL.r + 1, z: HILL.z + 1, yaw: W },
  'keeper-fold': { x: FOLD_SQ.x + 0.8, z: FOLD_SQ.z + 2.6, yaw: N },
  // Off the south-west corner of the four houses (they stand close round a small green).
  'keeper-green': {
    x: GREEN.x - 4.2,
    z: GREEN.z + 5.6,
    yaw: toward(GREEN.x - 4.2, GREEN.z + 5.6, GREEN.x, GREEN.z),
  },
  'keeper-guardhouse': { x: GH.x + 0.5, z: GH.z + CAB.d / 2 + 2.2, yaw: N },
  'keeper-below': { x: GH.x + 0.5, z: GH.z + CAB.d / 2 + 2.2, yaw: N },
  'keeper-rootNode': { x: -1.2, z: -0.8, yaw: toward(-1.2, -0.8, -3, -2.5) },
  'keeper-festival': { x: PICNIC.x, z: PICNIC.z + 2.1, yaw: N },
};

/** The Hollow: the camp short of the flat stone, and the stone itself. */
const HOLLOW_MARKS: Record<string, StageMark> = {
  keeper: { x: -3.6, z: -3.6, yaw: toward(-3.6, -3.6, -5, -5) },
  'hollow-camp': { x: -5, z: -5, yaw: Math.atan2(-1, -1) },
  'hollow-stone': { x: -8, z: -7.6, yaw: Math.atan2(-1, -1) },
};

/** Corvin's garden: the gate south of the pens, his door north of them. */
const CORVIN_MARKS: Record<string, StageMark> = {
  keeper: { x: 1.2, z: 3.2, yaw: N },
  'corvin-gate': { x: 0, z: 5, yaw: N },
  'corvin-door': { x: 0, z: -10.5, yaw: S },
  'pen-1': { x: 0, z: -6, yaw: S },
  'pen-2': { x: 0, z: -3, yaw: S },
  'pen-3': { x: 0, z: 0, yaw: S },
};

export const STAGE_MARKS: Readonly<Record<MarkSet, Readonly<Record<string, StageMark>>>> = {
  grove: GROVE_MARKS,
  hollow: HOLLOW_MARKS,
  corvin: CORVIN_MARKS,
};

/** Which set a sim location's marks come from; null where there are none (the dungeon). */
export function markSetFor(location: string): MarkSet | null {
  if (location === 'hollow') return 'hollow';
  if (location === 'corvin') return 'corvin';
  if (location === 'grove' || location.startsWith('visit:')) return 'grove';
  return null;
}

/** A mark by name in the set for `location`, or undefined. */
export function markAt(location: string, name: string): StageMark | undefined {
  const set = markSetFor(location);
  return set ? STAGE_MARKS[set][name] : undefined;
}

/** Which mark set a staged place's marks live in (H1's dev check compares it with the world). */
export function placeSet(place: StagePlace): MarkSet {
  return place === 'hollow' ? 'hollow' : place === 'corvin' ? 'corvin' : 'grove';
}

/**
 * The Keeper's default mark at each place (H7): the cast gets `you` there unless it names
 * one. 'grove' (the whole Grove, no one spot) has none: the Keeper stays where they are.
 */
export const PLACE_KEEPER: Readonly<Record<StagePlace, string | null>> = {
  grove: null,
  hollow: 'keeper',
  corvin: 'keeper',
  hill: 'keeper-hill',
  gate: 'keeper-gate',
  step: 'keeper-step',
  pond: 'keeper-pond',
  falls: 'keeper-falls',
  ledge: 'keeper-ledge',
  fold: 'keeper-fold',
  green: 'keeper-green',
  guardhouse: 'keeper-guardhouse',
  rootNode: 'keeper-rootNode',
  below: 'keeper-below',
  festival: 'keeper-festival',
};
