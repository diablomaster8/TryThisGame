/**
 * R0125 (WORLD-59): camera presets per region, as data keyed by region id, so a new region
 * only adds an entry (`regionCameraFor` falls back to the Grove's defaults). Full 3D takes a
 * pitch and a distance factor; Pixel keeps its 35° pitch (the art rule) and takes only its
 * zoom steps (pixels per unit, far then near, each a whole-number ratio of the art's);
 * `canopyCut` thins tree crowns between the camera and the Keeper (a wood).
 */
import { READ3D } from './tuning';
import type { RegionId } from './regions';

export interface RegionCamera {
  /** Full 3D orbit pitch, degrees (unset: `GROVE3D.pitchDeg`). */
  pitchDeg3d?: number;
  /** Full 3D orbit distance, as a factor of the zoom step's (unset: 1). */
  distanceK3d?: number;
  /** Pixel zoom steps, far then near, in pixels per unit (unset: `CAMERA.pixelsPerUnit`). */
  zooms?: readonly [number, number];
  /** Thin the crowns of trees that stand between the camera and the Keeper. */
  canopyCut?: boolean;
}

export const REGION_CAMERA: Readonly<Partial<Record<RegionId, RegionCamera>>> = {
  grove: {},
  // The caves keep the Hollow's own (DUNG) framing.
  hollow: { pitchDeg3d: READ3D.hollow.pitchDeg, distanceK3d: READ3D.hollow.distanceK },
  caves: { pitchDeg3d: READ3D.hollow.pitchDeg, distanceK3d: READ3D.hollow.distanceK },
  // Vertical spaces: look up more, stand further off; Pixel sees twice as far.
  peaks: { pitchDeg3d: 30, distanceK3d: 1.2, zooms: [8, 16] },
  ridge: { pitchDeg3d: 30, distanceK3d: 1.2 },
  // A tight wood: see through the canopy to the Keeper.
  wood: { canopyCut: true },
  // R11 d7: the open shore stands a little further off to take in the beach and the sea; the
  // terraced Sun lands look up their steps; the Moon lands keep the Grove's framing.
  shore: { distanceK3d: 1.1 },
  sunlands: { pitchDeg3d: 32, distanceK3d: 1.1 },
  moonlands: {},
};

const NONE: RegionCamera = {};

/** The preset for a region (the Grove's defaults when it has none). */
export function regionCameraFor(region: RegionId): RegionCamera {
  return REGION_CAMERA[region] ?? NONE;
}
