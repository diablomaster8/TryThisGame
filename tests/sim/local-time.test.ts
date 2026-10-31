import { describe, expect, it } from 'vitest';
import { CURFEW, VISITS } from '../../src/config/tuning';
import { stepCurfew } from '../../src/sim/curfew';
import { dayKey, isLanternNight, stepDaily } from '../../src/sim/daily';
import { dailySeed } from '../../src/sim/dungeon';
import { localDayKey, localParts } from '../../src/sim/local-time';
import { Rng } from '../../src/sim/rng';
import type { SimEvent } from '../../src/sim/types';
import { seasonAt } from '../../src/sim/weather';
import { applyCommand, createWorld } from '../../src/sim/world';

/**
 * TECH-45: the sim's days and hours come from the wall time and the time zone the UI sent,
 * never from the test runner's zone. Run under TZ=UTC, Asia/Tokyo and Pacific/Kiritimati,
 * these give the same answers.
 */
describe('time zone independent days and hours', () => {
  it('matches the calendar for any instant and offset', () => {
    const offsets = [-720, -480, -210, 0, 60, 330, 540, 545, 840];
    for (let ms = Date.UTC(1999, 11, 25); ms < Date.UTC(2031, 2, 3); ms += 61 * 3_600_000 + 7919) {
      for (const tz of offsets) {
        const d = new Date(ms + tz * 60_000);
        const p = localParts(ms, tz);
        expect(p.year).toBe(d.getUTCFullYear());
        expect(p.month).toBe(d.getUTCMonth());
        expect(p.day).toBe(d.getUTCDate());
        expect(p.weekday).toBe(d.getUTCDay());
        expect(p.hour).toBe(d.getUTCHours());
      }
    }
  });

  it('runs the daily, curfew and season rules by the sent offset alone', () => {
    // 2026-10-10 (a Saturday) 13:30 UTC: Saturday night 23:30 in UTC+10, Sunday in UTC+14.
    const wall = Date.UTC(2026, 9, 10, 13, 30);
    const run = (tz: number) => {
      const w = createWorld(3, 0);
      applyCommand(w, { kind: 'setTimeZone', offsetMin: tz }, []);
      const events: SimEvent[] = [];
      stepDaily(w, wall, new Rng(1), events);
      stepCurfew(w, 100, wall, events);
      return {
        day: w.visits.lastDay,
        night: w.night,
        lanterns: events.some((e) => e.kind === 'lanternNight'),
        season: seasonAt(wall, tz),
        seed: dailySeed(wall, tz).day,
      };
    };
    const tokyo = run(540);
    expect(tokyo).toEqual({
      day: '2026-10-10',
      night: CURFEW.nightFrom <= 22,
      lanterns: VISITS.lanternNightDay === 6,
      season: 'autumn',
      seed: '2026-10-10',
    });
    const kiritimati = run(840);
    expect(kiritimati.day).toBe('2026-10-11');
    expect(kiritimati.lanterns).toBe((VISITS.lanternNightDay as number) === 0);
    // The same offset, the same answer, whatever this process's own zone is.
    expect(run(840)).toEqual(kiritimati);
    expect(run(0).day).toBe(dayKey(wall, 0));
    expect(isLanternNight(wall, 840)).toBe(kiritimati.lanterns);
    expect(localDayKey(wall, -720)).toBe('2026-10-10');
  });

  it('ignores an offset no place on Earth has', () => {
    const w = createWorld(3, 0);
    applyCommand(w, { kind: 'setTimeZone', offsetMin: 9000 }, []);
    expect(w.tzOffsetMin).toBeUndefined();
    applyCommand(w, { kind: 'setTimeZone', offsetMin: 330 }, []);
    expect(w.tzOffsetMin).toBe(330);
  });
});
