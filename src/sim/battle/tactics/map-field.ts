/**
 * Tactics maps from the open Grove (recs FIGHT-51): the collision field and the painted ground
 * sampled on a 1.5-unit grid around a centre. Anything that stops a Nubbin (the cottage, the
 * well, fences, trees) is a blocked tile, using the same colliders as the "no walking through
 * assets" rule; trees become fruit trees and lanterns lantern posts. Water is deep with a
 * shallow rim, paths and decks are path tiles, and hills become height steps. Maps are cached
 * per area id; hand-authored ones in `config/battle-maps.ts` win.
 */
import { BATTLE_MAPS } from '../../../config/battle-maps';
import { TACTICS } from '../../../config/tuning-tactics';
import { contact, obstacles, stops } from '../../obstacles';
import { groundAt } from '../../terrain';
import type { World } from '../../types';
import { blocks, defaultDeploy, mapFromRows, N4 } from './map';
import { TILE, type GridMap } from './types';

const M = TACTICS.map;
const cache = new Map<string, GridMap>();

/** The collider standing on (x, z) that stops a Nubbin, if any. */
function solidAt(world: World | null, x: number, z: number): string | null {
  const r = M.fieldTile * 0.3;
  for (const c of obstacles(world)) if (stops(c, 'nubbin') && contact(c, x, z, r)) return c.id;
  return null;
}

/** Samples a `size` × `size` map centred on (cx, cz). */
export function sampleField(world: World | null, cx: number, cz: number, size: number): GridMap {
  const step = M.fieldTile;
  const half = (size * step) / 2;
  const kinds: number[] = [];
  const ys: number[] = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      const x = cx - half + (c + 0.5) * step;
      const z = cz - half + (r + 0.5) * step;
      const g = groundAt(world, x, z);
      const solid = solidAt(world, x, z);
      let t: number = TILE.grass;
      if (solid)
        t = /tree/.test(solid) ? TILE.tree : /lantern/.test(solid) ? TILE.lantern : TILE.wall;
      else if (g.surface === 'water') t = TILE.deep;
      else if (g.surface === 'path' || g.surface === 'deck') t = TILE.path;
      kinds.push(t);
      ys.push(g.y);
    }
  const low = Math.min(...ys);
  const tiles = new Uint8Array(kinds);
  const height = new Uint8Array(
    ys.map((y) => Math.max(0, Math.min(M.maxHeight, Math.round((y - low) / M.fieldLevel)))),
  );
  const m: GridMap = { w: size, h: size, tiles, height, deploy: { a: [], b: [] } };
  // A shallow rim where water meets dry ground.
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      if (tiles[i] !== TILE.deep) continue;
      const dry = N4.some((d) => {
        const nx = x + d.x;
        const ny = y + d.y;
        if (nx < 0 || ny < 0 || nx >= size || ny >= size) return false;
        const t = tiles[ny * size + nx]!;
        return t !== TILE.deep && t !== TILE.shallow && !blocks(t);
      });
      if (dry) tiles[i] = TILE.shallow;
    }
  m.deploy = defaultDeploy(m);
  return m;
}

/**
 * The map for an area: its authored map if there is one, else the field around `centre`,
 * cached by area id. A sampled map whose deploy zones don't meet is still returned; the
 * caller (a story battle) picks another centre.
 */
export function mapFromField(
  world: World | null,
  area: string,
  centre: { x: number; z: number },
  size: number,
): GridMap {
  const authored = BATTLE_MAPS[area];
  if (authored) return mapFromRows(authored.rows, authored.heights);
  const key = `${area}:${centre.x},${centre.z}:${size}`;
  let m = cache.get(key);
  if (!m) {
    m = sampleField(world, centre.x, centre.z, size);
    if (cache.size > 8) cache.clear();
    cache.set(key, m);
  }
  return m;
}
