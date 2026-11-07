import type { ReadonlyWorld } from './readonly-world';
import { markAt } from '../config/stage-marks';
import { C12C } from '../config/tuning-more/story-quest-markers';
import type { SceneStage } from '../config/story';

import type { DressItem, DressShape } from './dress-d-rules';

/**
 * R0630 (CAMP-38): the doors to the story worlds, standing in the Grove as props the Keeper can
 * tap (both renderers; the tap reaches `StoryShelf` through the HUD's `building:door-*` branch):
 *
 * - the Atlas on the cottage's shelf (always, outside the Learning Grove);
 * - Pixel's cabinet beside the workshop, once one is built (the HUD's own rule: Free Grove, or
 *   after chapter 5);
 * - the rift on the hill, at night, with Mature content 18+ only (its confirm still asks);
 * - the Neopia rainbow gate by the long grass (Free Grove, or after chapter 2).
 *
 * Pure: reads the world, writes nothing. A scene's `stage.props` may hide one by key.
 */
export const DOOR_SHAPES: ReadonlySet<DressShape> = new Set<DressShape>([
  'doorAtlas',
  'doorCabinet',
  'doorRift',
  'doorGate',
]);

export function isDoorKey(key: string): boolean {
  return key.startsWith('door-');
}

export function storyDoorItems(
  world: ReadonlyWorld,
  stage: SceneStage,
  darkness: number,
): DressItem[] {
  const out: DressItem[] = [];
  if (world.location !== 'grove' || world.edu !== null) return out;
  const sp = stage.props ?? {};
  const D = C12C.doors;
  const k = world.keeper.pos;
  const chapter = world.campaign?.chapter ?? 0;
  const free = !world.campaign;
  const push = (
    key: string,
    shape: DressShape,
    p: { x: number; z: number; yaw: number } | null,
    lit = false,
  ): void => {
    if (!p || sp[key] === 'hide') return;
    if (Math.hypot(p.x - k.x, p.z - k.z) > D.near) return;
    out.push({
      key,
      shape,
      place: 'grove',
      x: p.x,
      z: p.z,
      yaw: p.yaw,
      glint: false,
      glintAt: [0, 0, 0],
      lit,
      n: 0,
      cottage: false,
    });
  };
  const at = (
    mark: string,
    off: readonly [number, number],
  ): { x: number; z: number; yaw: number } | null => {
    const m = markAt('grove', mark);
    return m ? { x: m.x + off[0], z: m.z + off[1], yaw: m.yaw } : null;
  };
  push('door-atlas', 'doorAtlas', at(D.atlas.mark, D.atlas.off), true);
  if (free || chapter > D.cabinetAfterChapter) {
    const w = world.placed.find((d) => d.kind === 'workshop');
    if (w)
      push(
        'door-cabinet',
        'doorCabinet',
        { x: w.pos.x + D.cabinetOff[0], z: w.pos.z + D.cabinetOff[1], yaw: 0 },
        true,
      );
  }
  if (world.settings.matureContent === 'adult' && darkness > D.riftDarkness)
    push('door-rift', 'doorRift', at(D.rift.mark, D.rift.off), true);
  if (free || chapter > D.gateAfterChapter)
    push('door-gate', 'doorGate', at(D.gate.mark, D.gate.off));
  return out;
}
