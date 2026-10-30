import { describe, expect, it } from 'vitest';
import { eduLimitReason, inQuietHours } from '../../src/sim/edu-limits';
import { stepEdu } from '../../src/sim/edu';
import { applyCommand, createWorld } from '../../src/sim/world';

describe('R0695 (KIDS-27) limits', () => {
  it('twenty minutes of live play set a 20-minute daily lock; the next day clears it', () => {
    const day1 = new Date(2026, 9, 30, 10, 0).getTime();
    const w = createWorld(1, day1);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    applyCommand(w, { kind: 'eduSetLimits', limits: { dailyMinutes: 20 } }, []);
    for (let i = 0; i < 19 * 60 * 10; i++) stepEdu(w, 100, day1 + i * 100);
    expect(eduLimitReason(w, day1 + 19 * 60_000)).toBeNull();
    for (let i = 0; i < 60 * 10; i++) stepEdu(w, 100, day1 + 19 * 60_000 + i * 100);
    expect(eduLimitReason(w, day1 + 20 * 60_000)).toBe('daily');
    const day2 = new Date(2026, 9, 31, 9, 0).getTime();
    stepEdu(w, 100, day2);
    expect(eduLimitReason(w, day2)).toBeNull();
  });

  it('quiet hours cross midnight, and a grown-up unlock lasts a while', () => {
    expect(inQuietHours(21, 20, 7)).toBe(true);
    expect(inQuietHours(3, 20, 7)).toBe(true);
    expect(inQuietHours(12, 20, 7)).toBe(false);
    expect(inQuietHours(13, 12, 14)).toBe(true);
    const night = new Date(2026, 9, 30, 21, 0).getTime();
    const w = createWorld(1, night);
    applyCommand(w, { kind: 'eduStart', age: 5 }, []);
    applyCommand(w, { kind: 'eduSetLimits', limits: { quietFrom: 20, quietTo: 7 } }, []);
    expect(eduLimitReason(w, night)).toBe('quiet');
    w.lastWallMs = night;
    applyCommand(w, { kind: 'eduUnlockLimits' }, []);
    expect(eduLimitReason(w, night + 60_000)).toBeNull();
    expect(eduLimitReason(w, night + 31 * 60_000)).toBe('quiet');
  });

  it('keeps values in range and leaves saves without limits alone', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 5 }, []);
    expect(eduLimitReason(w, 0)).toBeNull();
    applyCommand(w, { kind: 'eduSetLimits', limits: { dailyMinutes: 5000, quietFrom: 99 } }, []);
    expect(w.edu?.limits?.dailyMinutes).toBe(180);
    expect(w.edu?.limits?.quietFrom).toBe(23);
  });
});
