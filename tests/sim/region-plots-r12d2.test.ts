import { describe, expect, it } from 'vitest';
import { PLOT_RULES } from '../../src/config/tuning-more/world-content-tables';
import { plotAt } from '../../src/sim/region-marks';
import { plotPieces, plotRefusal } from '../../src/sim/region-plots';
import { regionLocation } from '../../src/sim/region-walk';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

function shoreWorld() {
  const w = createWorld(9, 0);
  w.location = regionLocation('shore');
  w.inventory.decor = { bench: 3, flowerbed: 2, statue: 1 };
  return w;
}

describe('build plots (R0136)', () => {
  it('a piece placed on the shore plot stays through a save, a reload and a trip home', () => {
    const w = shoreWorld();
    const plot = plotAt('shore')!;
    const ev: SimEvent[] = [];
    applyCommand(
      w,
      { kind: 'placeDecor', decor: 'bench', pos: { x: plot.x + 1, z: plot.z - 1 } },
      ev,
    );
    expect(ev.some((e) => e.kind === 'decorPlaced')).toBe(true);
    expect(plotPieces(w, 'shore')).toHaveLength(1);
    expect(w.inventory.decor.bench).toBe(2);
    expect(w.placed).toHaveLength(0);
    // Away to the Grove and back, then through a save.
    w.location = 'grove';
    w.location = regionLocation('shore');
    const back = deserialize(serialize(w, 0)).world;
    expect(plotPieces(back, 'shore')).toEqual(plotPieces(w, 'shore'));
    // An older save has no plots.
    const old = JSON.parse(serialize(w, 0)) as { world: Record<string, unknown> };
    delete old.world.plotDecor;
    expect(plotPieces(deserialize(JSON.stringify(old)).world, 'shore')).toHaveLength(0);
  });

  it('keeps to the plot: only accepted pieces, inside the square, not on each other, to a limit', () => {
    const w = shoreWorld();
    const p = plotAt('shore')!;
    expect(plotRefusal(w, 'shore', 'statue', p)).toBe('kind');
    expect(plotRefusal(w, 'shore', 'bench', { x: p.x + PLOT_RULES.half + 1, z: p.z })).toBe(
      'outside',
    );
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'placeDecor', decor: 'bench', pos: { x: p.x, z: p.z } }, ev);
    expect(plotRefusal(w, 'shore', 'bench', { x: p.x + 0.2, z: p.z })).toBe('someone');
    w.inventory.decor.pathTile = 40;
    for (let i = 0; i < 30; i++)
      applyCommand(
        w,
        {
          kind: 'placeDecor',
          decor: 'pathTile',
          pos: { x: p.x - 4 + (i % 8), z: p.z - 4 + Math.floor(i / 8) * 2 },
        },
        ev,
      );
    expect(plotPieces(w, 'shore').length).toBeLessThanOrEqual(PLOT_RULES.max);
  });

  it('taking a piece up returns it to the pack', () => {
    const w = shoreWorld();
    const p = plotAt('shore')!;
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'placeDecor', decor: 'flowerbed', pos: p }, ev);
    const id = plotPieces(w, 'shore')[0]!.id;
    applyCommand(w, { kind: 'removeDecor', id }, ev);
    expect(plotPieces(w, 'shore')).toHaveLength(0);
    expect(w.inventory.decor.flowerbed).toBe(2);
  });
});
