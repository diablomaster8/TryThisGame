import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HANDLED_KINDS } from '../../src/sim/commands';
import { applyCommand, createWorld } from '../../src/sim/world';

/** TECH-35: the command handler modules (sim/commands/). */
describe('command handler modules', () => {
  it('own a kind in exactly one place: none is also a case in world.ts', () => {
    const src = readFileSync('src/sim/world.ts', 'utf8');
    for (const kind of HANDLED_KINDS) {
      expect(src.includes(`case '${kind}':`), kind).toBe(false);
    }
  });

  it('moved commands still work through applyCommand', () => {
    const w = createWorld(2, 0);
    const before = w.inventory.shells;
    applyCommand(w, { kind: 'debugGive', what: 'shells', amount: 5 }, []);
    expect(w.inventory.shells).toBe(before + 5);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    expect(w.edu).toBeTruthy();
  });

  it('there are handlers for the debug and Learning Grove domains', () => {
    expect(HANDLED_KINDS).toContain('debugSet');
    expect(HANDLED_KINDS).toContain('eduResult');
    expect(HANDLED_KINDS.length).toBeGreaterThan(30);
  });
});
