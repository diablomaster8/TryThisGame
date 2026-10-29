import { describe, expect, it } from 'vitest';
import { WORLD_BEACON } from '../../src/config/tuning-world';
import { objectivePoi, poiPos } from '../../src/sim/beacon';
import { createWorld } from '../../src/sim/world';
import { edgeArrow } from '../../src/ui/hud-world-math';

/** R0100: the tracked objective's place, and the edge arrow that points at it. */
describe('objective beacon', () => {
  it('points the hatch goal at the egg nearest the Keeper, then at what hatched', () => {
    const w = createWorld(7, 0);
    const eggs = w.nubbins.filter((n) => n.stage === 'egg');
    expect(eggs.length).toBeGreaterThan(0);
    w.keeper.pos = { x: 40, z: 40 };
    const at = objectivePoi(w, 'grove:hatch')!;
    const nearest = eggs
      .map((n) => Math.hypot(n.pos.x - 40, n.pos.z - 40))
      .reduce((a, b) => Math.min(a, b));
    expect(Math.hypot(at.x - 40, at.z - 40)).toBeCloseTo(nearest);
    for (const n of eggs) n.stage = 'child';
    const after = objectivePoi(w, 'story:hazel:1');
    expect(after).not.toBeNull();
    expect(eggs.some((n) => n.pos.x === after!.x && n.pos.z === after!.z)).toBe(true);
  });

  it('has no place for a step without a row, or away from the Grove', () => {
    const w = createWorld(7, 0);
    expect(objectivePoi(w, 'story:hazel:2')).toBeNull();
    expect(objectivePoi(w, null)).toBeNull();
    w.location = 'hollow';
    expect(objectivePoi(w, 'grove:hatch')).toBeNull();
    expect(poiPos('well')).toEqual({ x: 3, z: 10 });
  });

  it('puts the arrow on the inset edge, pointing within 10 degrees of the target', () => {
    const w = 375;
    const h = 812;
    for (const [x, y] of [
      [3, 0.4],
      [-2, -5],
      [0.2, 4],
      [-6, 1],
    ] as const) {
      const p = edgeArrow({ x, y, behind: false }, w, h, WORLD_BEACON.inset);
      const truth = Math.atan2(-y * (h / 2), x * (w / 2));
      const err = Math.abs(Math.atan2(Math.sin(p.angle - truth), Math.cos(p.angle - truth)));
      expect(err * (180 / Math.PI)).toBeLessThan(10);
      const onEdge =
        Math.abs(p.x - WORLD_BEACON.inset.side) < 0.5 ||
        Math.abs(p.x - (w - WORLD_BEACON.inset.side)) < 0.5 ||
        Math.abs(p.y - WORLD_BEACON.inset.top) < 0.5 ||
        Math.abs(p.y - (h - WORLD_BEACON.inset.bottom)) < 0.5;
      expect(onEdge).toBe(true);
    }
    // Behind the camera the direction turns round.
    const back = edgeArrow({ x: 0.5, y: 0, behind: true }, w, h, WORLD_BEACON.inset);
    expect(back.x).toBeLessThan(w / 2);
  });
});
