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

/** R0477: every Command kind has a handler (tsc checks the shapes, this checks the list). */
describe('command coverage', () => {
  it('every Command kind in types.ts has exactly one handler', () => {
    const lines = readFileSync('src/sim/types.ts', 'utf8').split('\n');
    const from = lines.findIndex((l) => l.startsWith('export type Command ='));
    let block = '';
    for (let i = from; i < lines.length; i++) {
      if (i > from && lines[i].startsWith('export ')) break;
      block += lines[i] + '\n';
    }
    const kinds = [...block.matchAll(/\|\s*\{\s*kind:\s*'(\w+)'/g)].map((m) => m[1]);
    expect(kinds.length).toBeGreaterThan(150);
    const missing = kinds.filter((k) => !HANDLED_KINDS.includes(k));
    expect(missing).toEqual([]);
    expect(new Set(HANDLED_KINDS).size).toBe(HANDLED_KINDS.length);
  });
});
