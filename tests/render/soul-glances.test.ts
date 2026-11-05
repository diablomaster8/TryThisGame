import { describe, expect, it } from 'vitest';
import { Glances } from '../../src/render/glances';
import { createWorld } from '../../src/sim/world';
import { hatch } from '../../src/sim/lifecycle';

// R0580 (SOUL-63), lane A r11: Nubbins glance at what happens near them.
function three() {
  const w = createWorld(3, 0);
  for (const n of w.nubbins) hatch(n, [], 0);
  while (w.nubbins.length < 3) w.nubbins.push({ ...w.nubbins[0]!, id: `x${w.nubbins.length}` });
  const [a, b, c] = w.nubbins;
  a!.pos = { x: 0, z: 0 };
  b!.pos = { x: 2, z: 0 };
  c!.pos = { x: 9, z: 0 };
  for (const n of w.nubbins)
    n.behavior = { ...n.behavior, state: 'sit', itemId: null, target: null };
  return { w, a: a!, b: b!, c: c! };
}

describe('R0580 glances', () => {
  it('a Nubbin tripping makes the nearby ones look at it, not the far one', () => {
    const { w, a, b, c } = three();
    const g = new Glances();
    a.behavior = { ...a.behavior, state: 'perform', itemId: 'trip' };
    const fb = g.face(b, w, 0);
    expect(fb).not.toBeNull();
    expect(fb!).toBeCloseTo(Math.atan2(a.pos.x - b.pos.x, a.pos.z - b.pos.z), 5);
    expect(g.face(c, w, 0)).toBeNull();
  });

  it('a falling fruit draws a look; a new target waits two seconds', () => {
    const { w, a, b } = three();
    const g = new Glances();
    w.items.push({ id: 'f', kind: 'fruit', pos: { x: 1, z: 3 }, y: 2, vel: { x: 0, y: 0, z: 0 } });
    expect(g.at(b, w, 0)).toEqual({ x: 1, z: 3 });
    a.behavior = { ...a.behavior, state: 'perform', itemId: 'sneeze' };
    expect(g.at(b, w, 1000)).toEqual({ x: 1, z: 3 });
    expect(g.at(b, w, 2100)).toEqual(a.pos);
  });

  it('a walking or sleeping Nubbin keeps its own way', () => {
    const { w, a, b } = three();
    const g = new Glances();
    a.behavior = { ...a.behavior, state: 'perform', itemId: 'trip' };
    b.behavior = { ...b.behavior, state: 'nap' };
    expect(g.at(b, w, 0)).toBeNull();
  });
});
