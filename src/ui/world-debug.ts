/**
 * WORLD-46: the debug panel's World line: which region and chunk the Keeper is in, the
 * geometry level and budget, what the GPU holds, the heap, the governor's state and how many
 * pixel sprites were skipped off screen. Read-only; the panel refreshes it at its own pace.
 */
import type { Game } from '../game';
import { chunkOf } from '../render/chunks';
import { regionOf } from '../sim/regions';

export function worldLine(g: Game): string {
  const k = g.world.keeper.pos;
  const c = chunkOf(k.x, k.z);
  const mem = g.pipeline.renderer.info.memory;
  const heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
  const heapMb = heap ? `${Math.round(heap.usedJSHeapSize / 1e6)}MB` : '?';
  const s = g.scene3d;
  const gov = s
    ? `  lod ${s.lodBias} budget ${s.perfBudget.calls}/${s.perfBudget.tris}` +
      `  gov ${s.governor.ratio}/cpu${s.governor.cpuLevel}/shed${s.governor.shedLevel}`
    : `  culled ${g.view.batch.culled}`;
  return (
    `region ${regionOf(g.world.location)} chunk (${c.cx},${c.cz})` +
    `  geo ${mem.geometries} tex ${mem.textures} heap ${heapMb}${gov}`
  );
}
