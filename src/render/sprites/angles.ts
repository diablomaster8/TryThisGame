/**
 * Sprites are drawn from five angles and mirrored for the other three.
 *
 * View index 0 faces the camera. Indices go clockwise as seen from above, so index 2 is
 * the sprite facing screen-right, 4 is its back, 6 faces screen-left.
 */
export type DrawnAngle = 'front' | 'frontQuarter' | 'side' | 'backQuarter' | 'back';
export const DRAWN_ANGLES: readonly DrawnAngle[] = [
  'front',
  'frontQuarter',
  'side',
  'backQuarter',
  'back',
];

export interface ViewAngle {
  angle: DrawnAngle;
  /** True when the drawn (right-facing) frame must be mirrored to face left. */
  flip: boolean;
}

const TABLE: readonly ViewAngle[] = [
  { angle: 'front', flip: false },
  { angle: 'frontQuarter', flip: false },
  { angle: 'side', flip: false },
  { angle: 'backQuarter', flip: false },
  { angle: 'back', flip: false },
  { angle: 'backQuarter', flip: true },
  { angle: 'side', flip: true },
  { angle: 'frontQuarter', flip: true },
];

const TWO_PI = Math.PI * 2;

/**
 * Which of the 8 views shows a sprite with world facing `facing` (radians, atan2(x, z))
 * to a camera orbiting at `cameraYaw`. A sprite whose facing equals the camera yaw is
 * looking straight at the camera.
 */
export function viewIndex(facing: number, cameraYaw: number): number {
  const rel = (((facing - cameraYaw) % TWO_PI) + TWO_PI) % TWO_PI;
  return Math.round(rel / (Math.PI / 4)) % 8;
}

export function viewAngle(facing: number, cameraYaw: number): ViewAngle {
  return TABLE[viewIndex(facing, cameraYaw)] ?? TABLE[0]!;
}
