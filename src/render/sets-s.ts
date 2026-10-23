import type { SceneStage } from '../config/story';
import { markAt, type StageMark } from '../config/stage-marks';
import { CG2_S } from '../config/tuning-s';
import { DUNGEON } from '../config/tuning';
import { FLOOR, WALL, type Floor } from '../sim/dungeon';
import type { World } from '../sim/types';
import { stageFlags } from './scene-stage';

/**
 * Campaign graphics 2, package s: which of its sets a frame draws, shared by both
 * renderers. Pure: reads the world and the queued stage only.
 */
export interface SetsS {
  /** C3: the Root Node's white room (an exclusive `rootNode` stage). */
  root: boolean;
  /** C4: the Beetle Road's floors below (an exclusive `below` stage, or the below grade). */
  below: boolean;
  /** C4: rain below, drawn as drips. */
  drips: boolean;
  /** M3: Logged In's digital set in the Day and Night Grove. */
  digital: boolean;
  /** M3: chapter 6's plain freestanding door. */
  door: boolean;
}

export const NO_SETS: SetsS = {
  root: false,
  below: false,
  drips: false,
  digital: false,
  door: false,
};

export function setsS(world: World, stage: SceneStage): SetsS {
  const ex = stage.exclusive === true;
  const root = ex && stage.place === 'rootNode';
  // K16 (campaign graphics 4): on a real Hollow Below floor the floor itself is the set;
  // the made-up cave stays the fallback for below scenes staged anywhere else.
  const below =
    ex &&
    world.location !== 'dungeon' &&
    (stage.place === 'below' || stage.grade === 'beetle-below');
  const f = stageFlags(world, stage);
  const digital =
    !ex &&
    f.campaign === 'logged' &&
    f.location === 'grove' &&
    stage.props?.loggedSet !== 'hide' &&
    stage.place !== 'rootNode';
  const prop = stage.props?.door;
  const door = digital && (prop ? prop !== 'hide' : f.chapter === 6);
  return { root, below, drips: below && stage.weather === 'rain', digital, door };
}

/** Where the white room stands: the chair's mark. */
export function rootMark(): StageMark {
  return markAt('grove', 'rootNode-chair') ?? { x: -3, z: -2.5, yaw: 0 };
}

/** Where the floor below is lit: the Keeper's mark there. */
export function belowMark(): StageMark {
  return markAt('grove', 'keeper-below') ?? { x: -6.5, z: 33, yaw: 0 };
}

/** Whether the cell (cx, cy) of the painted floor lies inside the lit oval. */
function inOval(cx: number, cy: number, n: number): boolean {
  const B = CG2_S.below;
  const c = DUNGEON.cell;
  const x = (cx + 0.5 - n / 2) * c;
  const z = (cy + 0.5 - n / 2) * c;
  return (x / (B.ovalX + c * 0.6)) ** 2 + (z / (B.ovalZ + c * 0.6)) ** 2 <= 1;
}

/**
 * A small made-up floor for the dungeon painter (render/paint/dungeon.ts): an oval room of
 * floor cells with rock round it, torches on its rim. Render-only: never in the world.
 */
export function belowFloor(): Floor {
  const n = CG2_S.below.cells;
  const cells = new Uint8Array(n * n);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) cells[y * n + x] = inOval(x, y, n) ? FLOOR : WALL;
  const mid = { x: Math.floor(n / 2), y: Math.floor(n / 2) };
  const torches = torchCells(n);
  const floor = {
    cols: n,
    rows: n,
    cells,
    rooms: [],
    stairsUp: mid,
    stairsDown: null,
    chest: mid,
    torches,
    crystals: [],
    loot: [],
    strayStarts: [],
    wildSpots: [],
    light: 0.55,
    version: DUNGEON.genVersion,
    greatRoom: -1,
    elevation: new Float32Array(0),
    landmark: null,
    vistas: [],
    crossings: [],
    nook: null,
    special: 'none',
  };
  return floor as unknown as Floor;
}

/** The torches' cells: floor cells on the oval's rim, spread round it. */
function torchCells(n: number): Array<{ x: number; y: number }> {
  return torchSpots().map((p) => ({
    x: Math.max(0, Math.min(n - 1, Math.floor(p.x / DUNGEON.cell + n / 2))),
    y: Math.max(0, Math.min(n - 1, Math.floor(p.z / DUNGEON.cell + n / 2))),
  }));
}

/**
 * The wall torches, as offsets from the mark (world units), on the oval's far side and
 * flanks so none stands between the camera and the cast.
 */
export function torchSpots(): Array<{ x: number; z: number; a: number }> {
  const B = CG2_S.below;
  const out: Array<{ x: number; z: number; a: number }> = [];
  for (let i = 0; i < B.torches; i++) {
    // From the left flank round the back to the right flank (-z is the back).
    const a = Math.PI * (0.9 + (1.2 * i) / Math.max(1, B.torches - 1));
    out.push({ x: Math.cos(a) * B.ovalX * 0.96, z: Math.sin(a) * B.ovalZ * 0.96, a });
  }
  return out;
}

/** A drip's spot and phase, fixed per index (no randomness in the frame). */
export function dripSpot(i: number): { x: number; z: number; phase: number } {
  const B = CG2_S.below;
  const a = i * 2.399;
  const r = 0.25 + ((i * 37) % 100) / 140;
  return {
    x: Math.cos(a) * B.ovalX * r,
    z: Math.sin(a) * B.ovalZ * r,
    phase: ((i * 53) % 100) / 100,
  };
}
