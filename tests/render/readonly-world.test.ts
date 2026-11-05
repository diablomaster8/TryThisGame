import { describe, expect, it } from 'vitest';
import { deepFreeze, type ReadonlyWorld } from '../../src/render/readonly-world';
import { stepWorld, createWorld } from '../../src/sim/world';

/** R0482: render code that takes ReadonlyWorld cannot write, and a frozen world still reads. */
describe('ReadonlyWorld', () => {
  it('refuses writes at compile time and at run time once frozen', () => {
    const w = createWorld(5, 0);
    for (let i = 0; i < 20; i++) stepWorld(w, 100, i * 100);
    const r: ReadonlyWorld = deepFreeze(w);
    // @ts-expect-error a renderer may not change the sim
    expect(() => (r.timeMs = 1)).toThrow();
    // @ts-expect-error nor push into its lists
    expect(() => r.nubbins.push(r.nubbins[0])).toThrow();
    expect(r.nubbins.length).toBeGreaterThan(0);
  });
});
