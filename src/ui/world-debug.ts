/**
 * WORLD-46: the debug panel's World line: which region and chunk the Keeper is in, the
 * geometry level and budget, the terrain chunks drawn, the instances and creature savings,
 * memory against the region caps (WORLD-15), the governor's state and how many pixel sprites
 * were skipped off screen. Read-only; the panel refreshes it at its own pace. Below it, the
 * World controls: teleport to a Grove point of interest, pin the geometry level, and freeze
 * the terrain chunk set.
 */
import type * as THREE from 'three';
import { REGIONS } from '../config/regions';
import { WORLD_LOD, WORLD_MEM } from '../config/tuning-world';
import type { Game } from '../game';
import { chunkOf } from '../render/chunks';
import { regionOf } from '../sim/regions';
import { button, el } from './dom';

/** GPU bytes of the textures the scene's materials use (mipmaps add a third), in MB. */
function textureMb(scene: THREE.Object3D): number {
  const seen = new Set<THREE.Texture>();
  scene.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (!m) return;
    for (const mat of Array.isArray(m) ? m : [m]) {
      for (const v of Object.values(mat)) {
        if ((v as THREE.Texture | null)?.isTexture) seen.add(v as THREE.Texture);
      }
    }
  });
  let bytes = 0;
  for (const t of seen) {
    const img = t.image as { width?: number; height?: number } | undefined;
    if (!img?.width || !img.height) continue;
    bytes += img.width * img.height * 4 * (t.generateMipmaps ? 4 / 3 : 1);
  }
  return Math.round(bytes / 1e6);
}

/** "now/cap" with a mark when over. */
const of = (now: number, cap: number): string => `${now}/${cap}${now > cap ? '!' : ''}`;

export function worldLine(g: Game): string {
  const k = g.world.keeper.pos;
  const c = chunkOf(k.x, k.z);
  const mem = g.pipeline.renderer.info.memory;
  const heap = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
  const heapMb = heap ? Math.round(heap.usedJSHeapSize / 1e6) : null;
  const s = g.scene3d;
  if (!s) {
    return (
      `region ${regionOf(g.world.location)} chunk (${c.cx},${c.cz})` +
      `  geo ${mem.geometries} tex ${mem.textures} heap ${heapMb ?? '?'}MB` +
      `  culled ${g.view.batch.culled}`
    );
  }
  const phone = Math.min(window.innerWidth, window.innerHeight) < WORLD_LOD.phoneMaxPx;
  const cap = phone ? WORLD_MEM.phone : WORLD_MEM.desktop;
  let inst = 0;
  s.scene.traverseVisible((o) => {
    if ((o as THREE.InstancedMesh).isInstancedMesh) inst += (o as THREE.InstancedMesh).count;
  });
  const t = s.terrainChunks;
  const cr = s.creatureLod;
  return (
    `region ${regionOf(g.world.location)} chunk (${c.cx},${c.cz}) ground ${t.drawn}/${t.total}` +
    `${t.frozen ? ' frozen' : ''}  lod ${s.lodBias}${s.governor.forcedGeo !== null ? ' pinned' : ''}` +
    ` ${s.tier} budget ${s.perfBudget.calls}/${s.perfBudget.tris}` +
    `\ninst ${(inst / 1000).toFixed(1)}k  creatures ${cr.inView} in view, ${cr.casting} casting,` +
    ` ${cr.hulls} outlined` +
    `\nmem tex ${of(textureMb(s.scene), cap.gpuTexMB)}MB geo ${of(mem.geometries, cap.geometries)}` +
    ` heap ${heapMb === null ? '?' : of(heapMb, cap.heapMB)}MB` +
    `  gov ${s.governor.ratio}/cpu${s.governor.cpuLevel}/shed${s.governor.shedLevel}`
  );
}

/** The World controls row (WORLD-46). */
export function worldControls(game: () => Game | null): HTMLElement {
  const row = el('div', 'debug-row');
  row.appendChild(el('span', undefined, 'World'));
  const poi = document.createElement('select');
  poi.className = 'btn btn-small';
  poi.append(new Option('Teleport…', ''));
  for (const p of REGIONS.grove.pois) poi.append(new Option(p.id, `${p.x},${p.z}`));
  poi.addEventListener('change', () => {
    const [x, z] = poi.value.split(',').map(Number);
    if (x !== undefined && z !== undefined && poi.value)
      game()?.send({ kind: 'teleport', pos: { x, z } });
    poi.value = '';
  });
  const lod = document.createElement('select');
  lod.className = 'btn btn-small';
  lod.append(new Option('LOD auto', ''));
  for (let i = 0; i <= 3; i++) lod.append(new Option(`LOD ${i}`, String(i)));
  lod.addEventListener('change', () => {
    const s = game()?.scene3d;
    if (s) s.governor.forcedGeo = lod.value === '' ? null : Number(lod.value);
  });
  const freeze = button(
    'Freeze streaming',
    () => {
      const t = game()?.scene3d?.terrainChunks;
      if (!t) return;
      t.frozen = !t.frozen;
      freeze.classList.toggle('active', t.frozen);
    },
    'btn btn-small',
  );
  row.append(poi, lod, freeze);
  return row;
}
