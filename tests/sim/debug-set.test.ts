import { describe, expect, it } from 'vitest';
import { buildScenario } from '../../src/dev/scenarios';
import { debugSet, debugSetProblem } from '../../src/sim/debug-set';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** TECH-47: the World editor's one-leaf set, checked by type and by the import rules. */
describe('debugSet', () => {
  it('sets a number leaf, and the command does the same', () => {
    const w = createWorld(1, 0);
    expect(debugSet(w, ['inventory', 'shells'], 77)).toBeNull();
    expect(w.inventory.shells).toBe(77);
    applyCommand(w, { kind: 'debugSet', path: ['inventory', 'fruit'], value: 9 }, []);
    expect(w.inventory.fruit).toBe(9);
  });

  it('refuses a wrong type, a missing path, a non-finite number and a prototype path', () => {
    const w = createWorld(1, 0);
    expect(debugSetProblem(w, ['inventory', 'shells'], 'lots')).toMatch(/number/);
    expect(debugSetProblem(w, ['inventory', 'nope'], 1)).toMatch(/No field/);
    expect(debugSetProblem(w, ['nope', 'x'], 1)).toMatch(/No field/);
    expect(debugSetProblem(w, ['inventory', 'shells'], Infinity)).toMatch(/finite/);
    expect(debugSetProblem(w, ['__proto__', 'x'], 1)).toMatch(/not allowed/);
  });

  it('a refused set changes nothing', () => {
    const w = createWorld(1, 0);
    const before = JSON.stringify(w);
    expect(debugSet(w, ['inventory', 'shells'], 'x')).not.toBeNull();
    expect(JSON.stringify(w)).toBe(before);
  });

  it('alignment 0.81 then evolving gives a Sun form', () => {
    const w = buildScenario('child-about-to-evolve:neutral:normal', 5, 0)!;
    expect(debugSet(w, ['nubbins', '0', 'alignment'], 0.81)).toBeNull();
    for (let t = 0; t < 45_000; t += 100) stepWorld(w, 100, t);
    expect(w.nubbins[0]!.stage).toBe('adult');
    expect(w.nubbins[0]!.form?.band).toBe('sun');
  });
});
