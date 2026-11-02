import { describe, expect, it } from 'vitest';
import { cleanDiary, newDiary, stepGroveDiary } from '../../src/sim/grove-diary';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import { deserialize, serialize } from '../../src/sim/save';

describe('Grove diary (TECH-32)', () => {
  it('records the first hatch, pat and meal once, from events', () => {
    const w = createWorld(7, 0);
    w.timeMs = 9000;
    stepGroveDiary(w, 100, [{ kind: 'hatched', nubbinId: 'a' }]);
    w.timeMs = 20000;
    stepGroveDiary(w, 100, [
      { kind: 'petted', nubbinId: 'a' },
      { kind: 'ate', nubbinId: 'a' },
    ]);
    w.timeMs = 30000;
    stepGroveDiary(w, 100, [{ kind: 'petted', nubbinId: 'a' }]);
    expect(w.diary?.firstHatchMs).toBe(9000);
    expect(w.diary?.firstPetMs).toBe(20000);
    expect(w.diary?.firstFeedMs).toBe(20000);
    expect(w.diary?.hatched).toBe(1);
  });

  it('counts sessions and panels through commands and live steps only', () => {
    const w = createWorld(7, 0);
    applyCommand(w, { kind: 'diaryNote', what: 'session' }, []);
    applyCommand(w, { kind: 'diaryNote', what: { panel: 'journal' } }, []);
    applyCommand(w, { kind: 'diaryNote', what: { panel: 'journal' } }, []);
    stepWorld(w, 100, undefined, true); // catch-up: not play
    expect(w.diary?.minutesPlayed ?? 0).toBe(0);
    stepWorld(w, 600);
    expect(w.diary?.sessions).toBe(1);
    expect(w.diary?.panelsOpened['journal']).toBe(2);
    expect(w.diary?.minutesPlayed).toBeGreaterThan(0);
  });

  it('travels in an exported save and cleans a bad file', () => {
    const w = createWorld(7, 0);
    stepGroveDiary(w, 100, [{ kind: 'hatched', nubbinId: 'a' }]);
    const back = deserialize(serialize(w, 1)).world;
    expect(back.diary?.hatched).toBe(1);
    expect(cleanDiary({ hatched: -4, sessions: 'x', panelsOpened: { a: 'b' } })).toEqual(
      newDiary(),
    );
  });
});

describe('Progress page data (TECH-69)', () => {
  it('computes rings and diary lines from a fresh save in well under 50 ms', async () => {
    const { ringsOf, diaryLines } = await import('../../src/ui/progress-panel');
    const w = createWorld(7, 0);
    stepGroveDiary(w, 100, [{ kind: 'hatched', nubbinId: 'a' }]);
    const t0 = performance.now();
    const rings = ringsOf(w);
    const lines = diaryLines(w);
    expect(performance.now() - t0).toBeLessThan(50);
    expect(rings.map((r) => r.key)).toEqual(['forms', 'pocket', 'digital', 'badges', 'races']);
    expect(rings[0]!.total).toBeGreaterThan(0);
    expect(lines[0]).toContain('hatched 1 Nubbin.');
  });
});
