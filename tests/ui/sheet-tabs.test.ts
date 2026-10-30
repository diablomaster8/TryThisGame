import { describe, expect, it } from 'vitest';
import { EGG } from '../../src/config/tuning';
import { SHEET_TABS } from '../../src/config/tuning-r8d';
import {
  careFaces,
  faceBand,
  hatchFraction,
  PLAYS,
  playsUnlocked,
  sheetTabsFor,
} from '../../src/ui/sheet-tabs';
import type { Nubbin } from '../../src/sim/types';

const form = { type: 'run' } as unknown as Nubbin['form'];

/** TECH-07: the stats sheet shows only what applies to the stage. */
describe('stats sheet tabs', () => {
  it('gives an egg no tabs, a child Care and Inside, and a grown one Grow too', () => {
    expect(sheetTabsFor({ stage: 'egg', form: null })).toEqual([]);
    expect(sheetTabsFor({ stage: 'child', form: null })).toEqual(['care', 'inside']);
    expect(sheetTabsFor({ stage: 'adult', form })).toEqual(['care', 'inside', 'grow']);
  });

  it('lets a first-life child discover the plays over its childhood', () => {
    const child = (ageMs: number) => ({ form: null, rebirths: 0, ageMs });
    expect(playsUnlocked(child(0))).toBe(SHEET_TABS.playsAtHatch);
    expect(playsUnlocked(child(SHEET_TABS.playEveryMs))).toBe(SHEET_TABS.playsAtHatch + 1);
    expect(playsUnlocked(child(100 * SHEET_TABS.playEveryMs))).toBe(PLAYS.length);
    // A grown or reborn Nubbin has every play already.
    expect(playsUnlocked({ form, rebirths: 0, ageMs: 0 })).toBe(PLAYS.length);
    expect(playsUnlocked({ form: null, rebirths: 1, ageMs: 0 })).toBe(PLAYS.length);
  });

  it('shows needs as faces with a word and icon, never the face alone', () => {
    expect(faceBand(1)).toBe('good');
    expect(faceBand(SHEET_TABS.okAt)).toBe('ok');
    expect(faceBand(0)).toBe('low');
    const faces = careFaces({
      needs: { hunger: 0.1, energy: 0.5, happiness: 80 } as Nubbin['needs'],
    });
    expect(faces.map((f) => f.band)).toEqual(['low', 'ok', 'good']);
    for (const f of faces) {
      expect(f.text).toMatch(/\p{L}/u);
      expect(f.label).toMatch(/: (fine|so-so|low)$/);
    }
  });

  it('fills the hatch ring as the countdown runs', () => {
    expect(hatchFraction({ hatchRemainingMs: EGG.hatchMs })).toBe(0);
    expect(hatchFraction({ hatchRemainingMs: EGG.hatchMs / 2 })).toBeCloseTo(0.5);
    expect(hatchFraction({ hatchRemainingMs: 0 })).toBe(1);
  });
});
