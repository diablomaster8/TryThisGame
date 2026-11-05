import { describe, expect, it } from 'vitest';
import {
  PERSONALITY_CARDS,
  personalityCardLines,
  personalityCardProblems,
} from '../../src/content/edu-personality-cards';
import { hatch, evolve } from '../../src/sim/lifecycle';
import { PERSONALITIES, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

// R0591 (SOUL-74): the reader band's personality card shows once per personality.
function grow(w: World, i: number): SimEvent[] {
  const n = w.nubbins[i]!;
  hatch(n, [], 0);
  const ev: SimEvent[] = [];
  evolve(n, ev, w);
  return ev;
}

describe('R0591 personality card', () => {
  it('has a valid card for every personality', () => {
    expect(personalityCardProblems(PERSONALITIES)).toEqual([]);
    for (const p of PERSONALITIES) expect(PERSONALITY_CARDS[p].likes).toHaveLength(3);
    expect(personalityCardLines('shy', 'Pip')[0]).toContain('Pip is shy');
  });

  it('the evolution event carries the card once per personality, reader band only', () => {
    const w = createWorld(9, 0);
    applyCommand(w, { kind: 'eduStart', age: 6, band: 'reader' }, []);
    const first = grow(w, 0).find((e) => e.kind === 'personalityLocked');
    expect(first && first.kind === 'personalityLocked' && first.card).toBe(true);
    const p = w.nubbins[0]!.personality!;
    expect(w.edu!.cardsSeen).toContain(p);
    // The same personality again: no card.
    const n = w.nubbins[0]!;
    n.stage = 'child';
    n.personality = p;
    const ev: SimEvent[] = [];
    evolve(n, ev, w);
    const again = ev.find((e) => e.kind === 'personalityLocked');
    expect(again && again.kind === 'personalityLocked' && again.card).toBeUndefined();
  });

  it('no card outside the reader band', () => {
    const w = createWorld(9, 0);
    const none = grow(w, 0).find((e) => e.kind === 'personalityLocked');
    expect(none && none.kind === 'personalityLocked' && none.card).toBeUndefined();
    const s = createWorld(9, 0);
    applyCommand(s, { kind: 'eduStart', age: 4, band: 'sprout' }, []);
    const sp = grow(s, 0).find((e) => e.kind === 'personalityLocked');
    expect(sp && sp.kind === 'personalityLocked' && sp.card).toBeUndefined();
  });
});
