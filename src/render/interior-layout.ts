import { INTERIOR_IDS, type InteriorId } from '../config/stage-marks';
import { CG4_C4 } from '../config/tuning';
import type { SceneStage } from '../config/story';
import { insideOf } from './scene-stage';

/**
 * Campaign graphics 4, K10: what stands in each interior, shared by both renderers (room
 * coordinates round `CG4_C4.room.origin`; the back wall is at z = -d/2). The pixel view
 * draws each piece as a billboard, Full 3D builds it from the prop kit. `y` lifts a piece
 * onto another (the lamp on the counter).
 */
export type FurnitureKind =
  | 'table'
  | 'stool'
  | 'stove'
  | 'counter'
  | 'chair'
  | 'bed'
  | 'bucket'
  | 'kettle'
  | 'hearth'
  | 'bench'
  | 'lamp';

export interface Piece {
  kind: FurnitureKind;
  x: number;
  z: number;
  y?: number;
}

export const ROOM_FURNITURE: Readonly<Record<InteriorId, readonly Piece[]>> = {
  kitchen: [
    { kind: 'stove', x: 2.6, z: -2.4 },
    { kind: 'table', x: 0.2, z: -0.6 },
    { kind: 'stool', x: -0.8, z: -0.2 },
    { kind: 'stool', x: 1.2, z: -0.2 },
    { kind: 'lamp', x: 0.7, z: -0.75, y: 0.86 },
  ],
  guardhouse: [
    { kind: 'counter', x: -0.6, z: -1.0 },
    { kind: 'lamp', x: 0.9, z: -1.0, y: 1.0 },
    { kind: 'bench', x: 2.4, z: 1.2 },
    { kind: 'stool', x: -0.6, z: -1.9 },
  ],
  corvin: [
    { kind: 'chair', x: -1.8, z: -1.5 },
    { kind: 'stove', x: -0.6, z: -2.5 },
    { kind: 'table', x: 0.9, z: -0.7 },
    { kind: 'lamp', x: 1.3, z: -0.85, y: 0.86 },
  ],
  crest: [
    { kind: 'hearth', x: 0, z: -2.7 },
    { kind: 'bench', x: -2.4, z: -0.4 },
    { kind: 'chair', x: 2.2, z: -1.2 },
  ],
  fold: [
    { kind: 'bed', x: -2.3, z: -2.2 },
    { kind: 'kettle', x: 2.2, z: -1.7 },
    { kind: 'bucket', x: 0.6, z: -0.4 },
  ],
};

/** The interior a stage is inside, when it names a known one. */
export function interiorOf(stage: SceneStage): InteriorId | null {
  if (Object.keys(stage).length === 0) return null;
  const id = insideOf(stage.place);
  return id && (INTERIOR_IDS as readonly string[]).includes(id) ? (id as InteriorId) : null;
}

/** The room's world centre on the ground. */
export function roomOrigin(): { x: number; z: number } {
  return CG4_C4.room.origin;
}

/**
 * Which of the four walls face away from the camera and stay drawn: a wall whose outward
 * side faces the camera (its normal within ~70 degrees of the view) is the one in the way.
 * `cam` is the camera's ground direction from the room (any length). Order N, E, S, W.
 */
export function wallsShown(cam: { x: number; z: number }): [boolean, boolean, boolean, boolean] {
  const len = Math.hypot(cam.x, cam.z) || 1;
  const cx = cam.x / len;
  const cz = cam.z / len;
  // Outward normals: N -z, E +x, S +z, W -x.
  const out: Array<[number, number]> = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  return out.map(([x, z]) => x * cx + z * cz < 0.34) as [boolean, boolean, boolean, boolean];
}
