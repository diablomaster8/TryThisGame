/* TECH-73 / TECH-09 (r11-d3): the long-absence catch-up and the autosave stay inside their
 * budgets with a full Grove: eight adults, the campaign running and a Hollow run underway. */
import { describe, expect, it } from 'vitest';
import { budgetMs } from './timing-budget';
import { PERF_GLOBAL } from '../../src/config/tuning-more/perf-tiers';
import { CATCHUP_PERF } from '../../src/config/tuning-more/perf-catchup';
import { catchUp } from '../../src/sim/offline';
import { serialize } from '../../src/sim/save';
import { startCampaign } from '../../src/sim/campaign';
import { applyCommand, createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function fullGrove(): World {
  const w = createWorld(73, 0);
  const ev: SimEvent[] = [];
  startCampaign(w, ev);
  const more = CATCHUP_PERF.nubbins - w.nubbins.length;
  if (more > 0) applyCommand(w, { kind: 'debugGive', what: 'egg', amount: more }, ev);
  for (const n of w.nubbins) applyCommand(w, { kind: 'debugHatchNow', nubbinId: n.id }, ev);
  w.settings.offlineAging.mode = 'indefinite';
  catchUp(w, 2 * HOUR, 0); // everyone grows up
  applyCommand(w, { kind: 'enterDungeon', daily: false }, ev);
  return w;
}

describe('catch-up and autosave budgets with a full Grove', () => {
  it('sets up eight adults, the campaign and a Hollow run', () => {
    const w = fullGrove();
    expect(w.nubbins.length).toBe(CATCHUP_PERF.nubbins);
    expect(w.nubbins.every((n) => n.stage !== 'egg')).toBe(true);
    expect(w.campaign).not.toBeNull();
    expect(w.location).not.toBe('grove');
  });

  it(`catches up ${CATCHUP_PERF.days} days indefinite inside the budget`, () => {
    const w = fullGrove();
    const start = performance.now();
    const report = catchUp(w, CATCHUP_PERF.days * DAY, 0);
    const ms = performance.now() - start;
    expect(report.simulatedMs).toBe(CATCHUP_PERF.days * DAY);
    expect(ms).toBeLessThan(budgetMs(CATCHUP_PERF.budgetMs));
  });

  it('serialises the save inside the autosave budget', () => {
    const w = fullGrove();
    catchUp(w, 3 * DAY, 0);
    const times: number[] = [];
    let size = 0;
    for (let i = 0; i < 25; i++) {
      const t = performance.now();
      size = serialize(w, Date.now()).length;
      times.push(performance.now() - t);
    }
    times.sort((a, b) => a - b);
    expect(size).toBeGreaterThan(1000);
    expect(times[times.length >> 1]).toBeLessThan(budgetMs(PERF_GLOBAL.autosaveMs));
  });
});
