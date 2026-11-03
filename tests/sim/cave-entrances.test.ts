import { describe, expect, it } from 'vitest';
import { caveMouths, caveReturn } from '../../src/sim/cave-entrances';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

// R0115 (WORLD-38, R11 d7): the world owns its cave entrances.
describe('cave entrances (WORLD-38)', () => {
  it('pairs every cave mouth with a way back just outside it, facing away', () => {
    const mouths = caveMouths();
    expect(mouths.map((m) => m.mouth.id).sort()).toEqual(['grove-cave', 'ridge-ice', 'ruins-door']);
    for (const { mouth, back } of mouths) {
      const r = mouth.rect;
      const cx = r.x + r.w / 2;
      const cz = r.z + r.h / 2;
      const a = back.arrive;
      const inside = a.x >= r.x && a.x <= r.x + r.w && a.z >= r.z && a.z <= r.z + r.h;
      expect(inside, mouth.id).toBe(false);
      expect(Math.hypot(a.x - cx, a.z - cz), mouth.id).toBeLessThan(6);
      // Facing away: the facing direction points from the mouth out past the arrival.
      const away = (a.x - cx) * Math.sin(back.facing) + (a.z - cz) * Math.cos(back.facing);
      expect(away, mouth.id).toBeGreaterThan(0);
    }
  });

  it('leaving the Hollow puts the Keeper back at its mouth, facing out', () => {
    const world = createWorld(14, 0);
    world.nubbins = [];
    world.keeper.pos = { x: -12.6, z: -12.2 };
    world.keeper.facing = Math.PI;
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, ev);
    expect(world.location).toBe('dungeon');
    applyCommand(world, { kind: 'leaveDungeon' }, ev);
    expect(world.location).toBe('grove');
    const out = caveReturn('grove', { x: -12.4, z: -13.6 })!;
    expect(world.keeper.pos).toEqual(out.pos);
    expect(world.keeper.facing).toBe(out.facing);
  });

  it('keeps the ruins’ door shut while it is sealed in ice', () => {
    const world = createWorld(15, 0);
    applyCommand(world, { kind: 'travel', exit: 'grove-wood' }, []);
    applyCommand(world, { kind: 'travel', exit: 'wood-ruins' }, []);
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'travel', exit: 'ruins-door' }, ev);
    // The caves are DUNG's and not drawn yet: the door is refused either way, never crossed.
    expect(world.location).toBe('region:ruins');
    expect(ev.some((e) => e.kind === 'travelRefused')).toBe(true);
  });
});
