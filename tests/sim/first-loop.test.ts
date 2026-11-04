import { describe, expect, it } from 'vitest';
import { EGG } from '../../src/config/tuning';
import { firstLoopStep } from '../../src/sim/first-loop';
import { groveSuggestion } from '../../src/ui/objective';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

// R0448 (TECH-06): the guided first loop, from a fresh Free Grove, with no debug commands.
describe('guided first loop', () => {
  it('hatches the first egg in five shakes, then asks for a pat, a fruit and a name', () => {
    const w = createWorld(5, 0);
    const egg = w.nubbins.find((n) => n.stage === 'egg')!;
    expect(groveSuggestion(w)?.key).toBe('grove:hatch');
    w.keeper.carrying = egg.id;
    for (let i = 0; i < 5; i++) {
      w.timeMs += EGG.shakeCooldownMs + 10;
      applyCommand(w, { kind: 'shakeHeld' }, []);
    }
    expect(egg.hatchRemainingMs).toBeLessThanOrEqual(0);
    w.keeper.carrying = null;
    stepWorld(w, 100);
    stepWorld(w, 100);
    expect(egg.stage).toBe('child');
    expect(w.diary?.firstHatchMs).not.toBeNull();
    expect(groveSuggestion(w)?.key).toBe('grove:loop-pat');
    // A pat, then it is the fruit cue's turn, then the name.
    stepWorld(w, 100);
    w.diary!.firstPetMs = w.timeMs;
    expect(groveSuggestion(w)?.key).not.toBe('grove:loop-pat');
    w.diary!.firstFeedMs = w.timeMs;
    expect(groveSuggestion(w)?.key).toBe('grove:loop-name');
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'rename', nubbinId: egg.id, name: 'Pebble' }, events);
    expect(firstLoopStep(w)).toBeNull();
  });

  it('later eggs shake at the usual rate, and the skip ends the guide', () => {
    const w = createWorld(5, 0);
    const [a, b] = w.nubbins.filter((n) => n.stage === 'egg');
    a!.hatchRemainingMs = 0;
    stepWorld(w, 100);
    stepWorld(w, 100);
    const before = b!.hatchRemainingMs;
    w.keeper.carrying = b!.id;
    w.timeMs += EGG.shakeCooldownMs + 10;
    applyCommand(w, { kind: 'shakeHeld' }, []);
    expect(before - b!.hatchRemainingMs).toBeLessThan(EGG.shakeBonusMs + 1);
    expect(groveSuggestion(w)?.key).toBe('grove:loop-pat');
    applyCommand(w, { kind: 'diaryNote', what: 'loopSkip' }, []);
    expect(groveSuggestion(w)?.key).not.toBe('grove:loop-pat');
  });
});
