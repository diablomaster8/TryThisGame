import { describe, expect, it } from 'vitest';
import {
  HidePeek,
  PEEK_EASE_MS,
  isPeeking,
  keeperSide,
  peekSpot,
} from '../../src/render-common/hide-peek';
import { soulLookKind, soulPose } from '../../src/render/soul-looks';
import { hideCover } from '../../src/sim/hide';
import { createEgg } from '../../src/sim/nubbin';
import { obstacles } from '../../src/sim/obstacles';
import { Rng } from '../../src/sim/rng';
import { createWorld } from '../../src/sim/world';

function setup() {
  const world = createWorld(1, 0);
  const n = createEgg('s', { x: 0, z: 0 }, Rng.fromSeed(3));
  n.stage = 'adult';
  n.personality = 'shy';
  world.nubbins.push(n);
  const tree = obstacles(world).find((c) => c.id.startsWith('tree-') && c.shape.type === 'circle')!;
  n.pos = { x: tree.x, z: tree.z + 1.2 };
  n.behavior.state = 'hide';
  n.behavior.target = null;
  return { world, n, tree };
}

describe('hide peek placement (R0321)', () => {
  it('finds the cover a hider sits by', () => {
    const { world, n, tree } = setup();
    const c = hideCover(world, n)!;
    expect(c).not.toBeNull();
    expect(Math.hypot(c.x - tree.x, c.z - tree.z)).toBeLessThan(3);
  });

  it('seats the peek on the far side of the cover from the camera, whichever way it looks', () => {
    const { world, n } = setup();
    const c = hideCover(world, n)!;
    for (const cam of [
      { x: c.x, z: c.z - 12 },
      { x: c.x + 12, z: c.z },
      { x: c.x, z: c.z + 12 },
      { x: c.x - 9, z: c.z + 9 },
    ]) {
      const p = peekSpot(world, c, cam, 1);
      const dCam = Math.hypot(p.x - cam.x, p.z - cam.z);
      const cCam = Math.hypot(c.x - cam.x, c.z - cam.z);
      expect(dCam).toBeGreaterThan(cCam - 0.01);
    }
  });

  it('keeps the Keeper side steady inside the dead zone', () => {
    const { world, n } = setup();
    const c = hideCover(world, n)!;
    const cam = { x: c.x, z: c.z - 10 };
    expect(keeperSide(c, cam, { x: c.x + 0.2, z: c.z }, -1)).toBe(-1);
    expect(keeperSide(c, cam, { x: c.x - 4, z: c.z }, 1)).not.toBe(
      keeperSide(c, cam, { x: c.x + 4, z: c.z }, 1),
    );
  });

  it('eases in, snaps under reduced motion, and eases out when it pops out', () => {
    const { world, n } = setup();
    const c = hideCover(world, n)!;
    const cam = { x: c.x, z: c.z - 10 };
    const hp = new HidePeek();
    expect(isPeeking(n)).toBe(true);
    const a = hp.place(world, n, cam, n.pos.x, n.pos.z, 0, false)!;
    expect(a.k).toBe(0);
    const b = hp.place(world, n, cam, n.pos.x, n.pos.z, 100, false)!;
    expect(b.k).toBeGreaterThan(0);
    expect(b.k).toBeLessThan(1);
    for (let t = 200; t <= 100 + PEEK_EASE_MS + 100; t += 100)
      hp.place(world, n, cam, n.pos.x, n.pos.z, t, false);
    expect(hp.place(world, n, cam, n.pos.x, n.pos.z, 1000, false)!.k).toBe(1);
    n.behavior.state = 'react';
    expect(hp.place(world, n, cam, n.pos.x, n.pos.z, 1100, false)!.k).toBeLessThan(1);
    for (let t = 1200; t <= 2000; t += 100) hp.place(world, n, cam, n.pos.x, n.pos.z, t, false);
    expect(hp.place(world, n, cam, n.pos.x, n.pos.z, 2100, false)).toBeNull();
    const calm = new HidePeek();
    n.behavior.state = 'hide';
    expect(calm.place(world, n, cam, n.pos.x, n.pos.z, 0, true)!.k).toBe(1);
  });

  it('draws the peek frame while tucked, and the walk there is not a peek', () => {
    const { n } = setup();
    expect(soulLookKind(n)).toBe('hidePeek');
    const calm = soulPose('hidePeek', 1234, 0.5, true);
    expect(calm.clip).toBe('peek');
    expect(calm.dx).toBe(0);
    n.behavior.target = { x: 1, z: 1 };
    expect(soulLookKind(n)).toBeNull();
  });
});
