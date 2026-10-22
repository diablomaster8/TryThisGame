import { markAt } from '../config/stage-marks';
import { STORY_B } from '../config/tuning-b';

/**
 * Where package b places things, read from the story marks (stage-marks.ts) so the scenes'
 * framing and the buildings never drift apart: Dawn & Dusk's green and four houses, and the
 * Fold's extra ruins round the square.
 */
export interface DdLayout {
  centre: { x: number; z: number };
  radius: number;
  houses: Array<{ x: number; z: number; yaw: number }>;
}

export function ddLayout(): DdLayout {
  const c = markAt('grove', 'green-centre') ?? { x: 0, z: 2, yaw: 0 };
  const hs = [1, 2, 3, 4].map((i) => markAt('grove', `house-${i}`) ?? { x: c.x, z: c.z, yaw: 0 });
  const mean = hs.reduce((a, h) => a + Math.hypot(h.x - c.x, h.z - c.z), 0) / hs.length;
  return {
    centre: { x: c.x, z: c.z },
    radius: Math.max(2.5, mean * STORY_B.dawnDusk.greenShare),
    // The door faces +z locally, so a yaw of atan2(dx, dz) turns it to the green.
    houses: hs.map((h) => ({ x: h.x, z: h.z, yaw: Math.atan2(c.x - h.x, c.z - h.z) })),
  };
}

export function foldExtras(): Array<{ kind: 'cottage' | 'school' | 'dojo'; x: number; z: number }> {
  const sq = markAt('grove', 'fold-square') ?? { x: 0, z: 2, yaw: 0 };
  return STORY_B.fold.extras.map((e) => ({ kind: e.kind, x: sq.x + e.dx, z: sq.z + e.dz }));
}
