import type { NubbinType } from '../../sim/types';
import type { DrawnAngle } from './angles';

/** Body shape tweaks by type: adults differ in silhouette, second evolutions a little. */
export interface ChaoShape {
  /** Extra head/body radius (adults are a touch bigger). */
  grow: number;
  /** Extra body width (Power). */
  bodyWiden: number;
  /** Leg length in px below the body (Run). */
  legLength: number;
  /** Wing size multiplier (Fly). */
  wingScale: number;
  /** Fins on the sides of the head (Swim). */
  headFins: number;
  /** Hand radius bonus (Power). */
  handBonus: number;
  /**
   * A second evolution's type: its half-strength tell (fins, wings, legs, hands, or for
   * Normal a taller crown) takes the palette's `tell` colour so the pair reads at a glance.
   */
  tellType?: NubbinType | null;
  /** Extra height of the crown point, in px (the Normal second evolution's tell). */
  crownLift?: number;
}

export const CHILD_SHAPE: ChaoShape = {
  grow: 0,
  bodyWiden: 0,
  legLength: 0,
  wingScale: 1,
  headFins: 0,
  handBonus: 0,
  tellType: null,
  crownLift: 0,
};

export interface ChaoPoseGeometry {
  lift: number;
  squash: number;
  headDrop: number;
}

export interface Layout {
  headCx: number;
  headCy: number;
  headRx: number;
  headRy: number;
  bodyCx: number;
  bodyCy: number;
  bodyRx: number;
  bodyRy: number;
  feetY: number;
  legLength: number;
}

export function layout(angle: DrawnAngle, pose: ChaoPoseGeometry, shape: ChaoShape): Layout {
  const g = shape.grow;
  const feetY = 30 + pose.lift;
  const bodyRy = Math.round((5 + g) * pose.squash);
  const bodyCy = feetY - bodyRy + 1 - shape.legLength;
  const headRy = Math.round((7 + g) * pose.squash);
  const headRx = angle === 'side' ? 7 + g : 8 + g;
  const headCy = bodyCy - bodyRy - headRy + 3 + pose.headDrop;
  return {
    headCx: 16,
    headCy,
    headRx,
    headRy,
    bodyCx: angle === 'side' ? 15 : 16,
    bodyCy,
    bodyRx: (angle === 'side' ? 5 : 6) + g + shape.bodyWiden,
    bodyRy,
    feetY,
    legLength: shape.legLength,
  };
}
