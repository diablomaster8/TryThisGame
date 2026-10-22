/**
 * A loaded or replaced world reaches the renderers' own state: the painted ground and the
 * Hollow floor (review D, bug 5). The scenes are stood in for by recorders, since the real
 * ones need WebGL.
 */
import { describe, expect, it } from 'vitest';
import type { Floor } from '../../src/sim/dungeon';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, TileKind } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { syncWorldScenes } from '../../src/render/world-sync';

function recorder() {
  const seen: { tiles: Array<Record<string, TileKind>>; floors: Array<Floor | null> } = {
    tiles: [],
    floors: [],
  };
  return {
    seen,
    setTiles: (t: Record<string, TileKind>) => void seen.tiles.push(t),
    setDungeon: (f: Floor | null) => void seen.floors.push(f),
  };
}

describe('syncWorldScenes', () => {
  it('hands a reloaded world its painted ground', () => {
    const world = createWorld(5, 0);
    world.tiles['2,2'] = 'stone';
    world.tiles['2.5,2'] = 'flowers';
    const loaded = deserialize(serialize(world, 1000)).world;
    const grove = recorder();
    syncWorldScenes(loaded, grove, [grove]);
    expect(grove.seen.tiles).toHaveLength(1);
    expect(grove.seen.tiles[0]).toEqual({ '2,2': 'stone', '2.5,2': 'flowers' });
    expect(grove.seen.floors).toEqual([null]);
  });

  it('shows the Hollow floor of a world swapped in underground, and the surface after', () => {
    const under = createWorld(3, 0);
    const events: SimEvent[] = [];
    for (const n of under.nubbins) hatch(n, events, 0);
    applyCommand(under, { kind: 'enterDungeon', daily: false }, events);
    expect(under.location).toBe('dungeon');
    const scene = recorder();
    const view = recorder();
    syncWorldScenes(under, scene, [scene, null, view]);
    expect(scene.seen.floors[0]).not.toBeNull();
    expect(view.seen.floors[0]).toEqual(scene.seen.floors[0]);
    // A reset to a fresh world must leave the cave behind.
    syncWorldScenes(createWorld(4, 0), scene, [scene, null, view]);
    expect(scene.seen.floors[1]).toBeNull();
    expect(view.seen.floors[1]).toBeNull();
  });
});
