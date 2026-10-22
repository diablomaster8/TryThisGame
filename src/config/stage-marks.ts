import { GROVE, LANTERN_POSTS } from './tuning';

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
const E = PI / 2; // facing east (+x)
const W = -PI / 2; // facing west (-x)

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
  'flat-stone': { x: HILL.x + HILL.r * 0.45, z: HILL.z + 0.5, yaw: W },
  'hill-top': { x: HILL.x, z: HILL.z, yaw: S },
  briar: { x: HILL.x - 1, z: HILL.z - 1.5, yaw: S },
  // The falls: the pool at the foot, the ledge behind the water.
  'falls-foot': { x: FALLS.x - 3, z: FALLS.z + 4, yaw: Math.atan2(3, -4) },
  ledge: { x: FALLS.x, z: FALLS.z + 0.8, yaw: S },
  // The Hundred Days: the Fold round the Grove's heart, the mill, the shore.
  'fold-square': { x: 0, z: 2, yaw: S },
  mill: { x: WINDMILL.x + 2.4, z: WINDMILL.z + 2, yaw: W },
  'shore-jetty': { x: POND.x, z: POND.z + POND.r + 0.6, yaw: N },
  // Dawn & Dusk: four houses round a green, facing in.
  'green-centre': { x: 0, z: 2, yaw: S },
  'house-1': { x: 0, z: -7, yaw: S },
  'house-2': { x: 9, z: 2, yaw: W },
  'house-3': { x: 0, z: 11, yaw: N },
  'house-4': { x: -9, z: 2, yaw: E },
  shrine: { x: -3, z: -11, yaw: S },
  bell: { x: -1, z: -10.5, yaw: S },
  // The Beetle Road: a guard house on the lane in.
  guardhouse: { x: -3, z: 20, yaw: N },
  cart: { x: 3, z: 19, yaw: W },
  // Logged In: a lobby round the Grove's heart.
  lobby: { x: 0, z: 1, yaw: S },
  board: { x: 3, z: -2, yaw: S },
  'root-chair': { x: -3, z: -2.5, yaw: S },
};

/** The Hollow: the camp short of the flat stone, and the stone itself. */
const HOLLOW_MARKS: Record<string, StageMark> = {
  'hollow-camp': { x: -5, z: -5, yaw: Math.atan2(-1, -1) },
  'hollow-stone': { x: -8, z: -7.6, yaw: Math.atan2(-1, -1) },
};

/** Corvin's garden: the gate south of the pens, his door north of them. */
const CORVIN_MARKS: Record<string, StageMark> = {
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
