import { describe, expect, it } from 'vitest';
import { CURIOSITY_TEXT } from '../../src/config/strings-look';
import { CURIOSITY_IDS, curiositiesFound } from '../../src/sim/curiosities';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';

/** FUN-43: every curiosity has a test command, logs once, says its line and is counted. */
describe('curiosities', () => {
  it('logs each of the 15 once through the curiosity command', () => {
    const w = createWorld(7, 0);
    for (const id of CURIOSITY_IDS) {
      expect(CURIOSITY_TEXT[id], id).toBeTruthy();
      const ev: SimEvent[] = [];
      applyCommand(w, { kind: 'curiosity', id }, ev);
      expect(ev).toEqual([{ kind: 'curiosityFound', id }]);
      const again: SimEvent[] = [];
      applyCommand(w, { kind: 'curiosity', id }, again);
      expect(again).toEqual([]);
    }
    expect(curiositiesFound(w)).toBe(15);
    const ev: SimEvent[] = [];
    applyCommand(w, { kind: 'curiosity', id: 'nonsense' }, ev);
    expect(ev).toEqual([]);
  });
});
