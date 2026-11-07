import { describe, expect, it } from 'vitest';
import { buildScenario } from '../../src/dev/scenarios';
import { worldFingerprint } from '../../src/sim/save';
import { applyCommand, stepWorld } from '../../src/sim/world';

/**
 * TECH-34: a seeded run of the whole step is pinned by a hash, so reordering or rewrapping
 * the systems in `stepWorld` (the registry in sim/systems.ts) cannot change behaviour
 * unnoticed. If a deliberate rule change moves it, update EXPECTED in the same commit.
 */
const WALL = Date.UTC(2026, 9, 31, 9);

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function run(): number {
  const w = buildScenario('eight-nubbins', 21, WALL)!;
  const events: never[] = [];
  applyCommand(w, { kind: 'debugGive', what: 'fruit', amount: 5 }, events);
  for (let i = 0; i < 12_000; i++) {
    if (i % 900 === 0) {
      const n = w.nubbins[(i / 900) % w.nubbins.length];
      if (n) applyCommand(w, { kind: 'pet', nubbinId: n.id }, events);
    }
    stepWorld(w, 100, WALL + i * 100);
  }
  return hash(worldFingerprint(w));
}

// Re-pinned for R0509: settings.graphics left the saved world (it is a device preference), which
// shortens the fingerprint; with the field put back the old 2204227681 comes out, so no rule moved.
const EXPECTED = 1827331222;

describe('stepWorld determinism', () => {
  it('two runs agree', { timeout: 60_000 }, () => {
    expect(run()).toBe(run());
  });

  it('matches the pinned hash', { timeout: 60_000 }, () => {
    expect(run()).toBe(EXPECTED);
  });
});
