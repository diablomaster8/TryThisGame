import { describe, expect, it } from 'vitest';
import { DUNGEON } from '../../src/config/tuning';
import { floorOf, resolveDungeon, type Floor } from '../../src/sim/dungeon';
import { floorProps } from '../../src/sim/dungeon-props';
import { setPieces } from '../../src/sim/dungeon-set-pieces';
import { Rng } from '../../src/sim/rng';

// R0032 (round 11): the timber arch posts and the parked cart are solid, from the same list
// the dressing draws.

function floors(): Floor[] {
  const out: Floor[] = [];
  for (let s = 1; s <= 60; s++) out.push(floorOf(s * 6151, 1 + (s % 7)));
  return out;
}

describe('arch posts and the cart', () => {
  const all = floors();

  it('some floors carry arches and a cart', () => {
    expect(all.some((f) => setPieces(f).arches.length > 0)).toBe(true);
    expect(all.some((f) => setPieces(f).cart)).toBe(true);
  });

  it('every post and cart circle is a collider', () => {
    for (const f of all) {
      const sp = setPieces(f);
      const props = floorProps(f);
      expect(props.filter((p) => p.kind === 'post').length).toBe(sp.arches.length * 2);
      expect(props.filter((p) => p.kind === 'cart').length).toBe(sp.cart ? 2 : 0);
    }
  });

  it('a sweep leaves 0 bodies inside a post or the cart', () => {
    const rng = new Rng(11);
    let inside = 0;
    let probes = 0;
    for (const f of all) {
      const props = floorProps(f).filter((p) => p.kind !== 'landmark');
      if (!props.length) continue;
      for (let i = 0; i < 100; i++) {
        const prop = props[rng.int(0, props.length - 1)]!;
        const p = {
          x: prop.x + (rng.next() - 0.5) * 0.8,
          z: prop.z + (rng.next() - 0.5) * 0.8,
        };
        resolveDungeon(p, f, 0.3);
        resolveDungeon(p, f, 0.3);
        probes++;
        if (props.some((c) => Math.hypot(p.x - c.x, p.z - c.z) < c.r + 0.3 - 1e-3)) inside++;
      }
    }
    expect(probes).toBeGreaterThan(200);
    expect(inside).toBe(0);
  });

  it('posts stand inside the corridor, against the rock', () => {
    for (const f of all) {
      for (const a of setPieces(f).arches) {
        expect(a.half).toBeGreaterThan(0);
        expect(a.half).toBeLessThan(2 * DUNGEON.cell);
      }
    }
  });
});
