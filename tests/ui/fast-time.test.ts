import { describe, expect, it } from 'vitest';
import { FAST_TIME, SIM } from '../../src/config/tuning';
import { Clock } from '../../src/sim/clock';
import type { SimEvent } from '../../src/sim/types';
import { dedupeEvents, dedupeToaster } from '../../src/ui/event-dedupe';

/** TECH-54: high time scales through one clock path, with feedback once per subject. */
describe('fast time', () => {
  it('gives unrun steps back to the same clock, losing no sim time', () => {
    const c = new Clock();
    c.setTimeScale(1000);
    const due = c.advance(16);
    expect(due).toBe(160);
    // The frame ran 40 of them; 120 go back and come out on the next frame.
    c.giveBack(due - 40);
    expect(c.advance(0)).toBe(120);
    let total = 40 + 120;
    for (let i = 0; i < 10; i++) total += c.advance(16);
    expect(total * SIM.stepMs).toBe(11 * 16 * 1000);
  });

  it('keeps the first event per kind and subject, and every distinct one', () => {
    const events = [
      { kind: 'hungry', nubbinId: 'a' },
      { kind: 'hungry', nubbinId: 'a' },
      { kind: 'hungry', nubbinId: 'b' },
      { kind: 'curfew', night: true },
      { kind: 'curfew', night: true },
      { kind: 'curfew', night: false },
    ] as unknown as SimEvent[];
    const out = dedupeEvents(events) as unknown as Array<Record<string, unknown>>;
    expect(out).toHaveLength(4);
    expect(out.map((e) => e['nubbinId'] ?? e['night'])).toEqual(['a', 'b', true, false]);
  });

  it('shows a toast text once in the window while time runs fast, every time at ×1', () => {
    const shown: string[] = [];
    let scale = 100;
    let t = 0;
    const toast = dedupeToaster(
      (s) => shown.push(s),
      () => scale,
      () => t,
    );
    toast('Pip is hungry');
    t += 1000;
    toast('Pip is hungry');
    toast('Bo is hungry');
    t += FAST_TIME.toastDedupeMs;
    toast('Pip is hungry');
    expect(shown).toEqual(['Pip is hungry', 'Bo is hungry', 'Pip is hungry']);
    scale = 1;
    toast('Pip is hungry');
    expect(shown).toHaveLength(4);
  });
});
