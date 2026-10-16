import { describe, expect, it } from 'vitest';
import { STORY } from '../../src/config/tuning';
import { seen } from '../../src/sim/story-state';
import type { World } from '../../src/sim/types';
import { c, moss, sable } from './campaign-driver';
import { begun, expectStoryDone, runUntil, status } from './side-driver';

/** Chapter 9 reconciled, Sable bonded, Moss loved: the route most late stories expect. */
const CHOICES = { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront' };
function bonded(r: { world: World }): void {
  const s = sable(r.world);
  if (s) {
    s.trust = 80;
    s.bond = true;
  }
  const m = moss(r.world);
  if (m) m.needs.affection = 80;
}

/** The sim time the ending's last scene played (Infinity before it has). */
function endedAt(w: World): number {
  return c(w).seenMs[`end-${c(w).ending}-last`] ?? Infinity;
}

/** The side stories of chapters 9 to 12 and after, plus the CV1 left-overs. */
describe('late side stories: windows', () => {
  it('S6 and S23 open the morning after chapter 9 closes, before the Long Night opens', () => {
    const r = runUntil((w) => seen(c(w), 'c9-close'), [], CHOICES);
    expect(status(r, 's6')).toBeUndefined();
    expect(status(r, 's23')).toBeUndefined();
    runUntil((w) => status(r, 's23') !== undefined || begun(10)(w), [], CHOICES, r);
    expect(c(r.world).chapter).toBe(10);
    expect(seen(c(r.world), 'c10-open')).toBe(false);
    expect(status(r, 's6')).toBe('open');
    expect(status(r, 's23')).toBe('open');
    // Ignored, S23 lapses when the Long Night opens, and visitors stays unset.
    runUntil(begun(10), [], CHOICES, r);
    expect(status(r, 's23')).toBe('closed');
    expect(c(r.world).flags.visitors).toBeUndefined();
    expect(status(r, 's6')).toBe('open');
  });

  it('S6 never opens on the Collector route', () => {
    const r = runUntil((w) => seen(c(w), 'c9-open'), [], CHOICES);
    c(r.world).flags.soldNubbin = true;
    delete c(r.world).flags.boughtBack;
    runUntil(begun(10), [], CHOICES, r);
    expect(status(r, 's6')).toBeUndefined();
  });

  it('S19 and S20 open on chapter 11’s first morning and lapse at the final choice', () => {
    const r = runUntil((w) => seen(c(w), 'c11-open'), [], CHOICES);
    bonded(r);
    expect(status(r, 's19')).toBeUndefined();
    runUntil((w) => status(r, 's20') !== undefined || begun(12)(w), [], CHOICES, r);
    expect(status(r, 's19')).toBe('open');
    expect(status(r, 's20')).toBe('open');
    runUntil((w) => seen(c(w), 'c12-open'), [], CHOICES, r);
    expect(status(r, 's19')).toBe('closed');
    expect(status(r, 's20')).toBe('closed');
    expect(c(r.world).flags.cinder).toBeUndefined();
  });

  it('S26 opens after Fossil’s farewell and closes if chapter 9 comes before the bulbs', () => {
    const r = runUntil((w) => seen(c(w), 'c6-close'), [], CHOICES);
    runUntil((w) => status(r, 's26') !== undefined || begun(7)(w), [], CHOICES, r);
    expect(status(r, 's26')).toBe('open');
    runUntil(begun(9), [], CHOICES, r);
    expect(status(r, 's26')).toBe('closed');
    expect(c(r.world).flags.hushGarden).toBeUndefined();
  });

  it('S24 opens only on the first morning after the ending', () => {
    const r = runUntil((w) => c(w).chapter > 12, [], CHOICES);
    expect(status(r, 's24')).toBeUndefined();
    runUntil(() => status(r, "s24") !== undefined, [], CHOICES, r);
    expect(status(r, 's24')).toBe('open');
  });
});

describe('late side stories: full runs', () => {
  it('S6 runs to its end and warms Ember', () => {
    const r = expectStoryDone('s6', CHOICES, begun(11));
    expect(c(r.world).friendship.ember ?? 0).toBeGreaterThanOrEqual(5);
  });

  it('S23 completes before the Long Night opens, sets visitors, and Corvin stands in the lane', () => {
    const r = runUntil((w) => seen(c(w), 'c9-close'), ['s23'], CHOICES);
    bonded(r);
    expectStoryDone('s23', CHOICES, begun(10), r);
    expect(c(r.world).flags.visitors).toBe(true);
    const seenIds = c(r.world).seen;
    const complete = seenIds.findIndex((s) => s.startsWith('s23-complete'));
    expect(complete).toBeGreaterThan(seenIds.indexOf('s23-drip'));
    expect(seen(c(r.world), 'c10-open')).toBe(false);
    runUntil((w) => seen(c(w), 'c10-close'), ['s23'], CHOICES, r);
    expect(c(r.world).seen).toContain('c10-vigil-corvin');
    expect(c(r.world).seen).toContain('c10-dawn-lane');
  });

  it('S19 runs to its end and sets cinder; its version follows who is left', () => {
    const r = runUntil((w) => seen(c(w), 'c7-open'), ['s19'], CHOICES);
    bonded(r);
    expectStoryDone(
      's19',
      { ...CHOICES, 's19-question': 'remembered' },
      (w) => seen(c(w), 'c12-open'),
      r,
    );
    expect(['forgiven', 'remembered']).toContain(c(r.world).flags.cinder);
    const w = c(r.world).flags['s19-with'];
    expect(['moss', 'sable', 'alone']).toContain(w);
    const seenIds = c(r.world).seen;
    if (w === 'moss') expect(seenIds).toContain('s19-climb');
    else expect(seenIds).toContain(`s19-climb-${w}`);
  });

  it('S20 runs to its end in chapter 11', () => {
    expectStoryDone('s20', CHOICES, (w) => seen(c(w), 'c12-open'));
  });

  it('S26 runs to its end across the pause and sets hushGarden', () => {
    const r = expectStoryDone('s26', { ...CHOICES, 's26-key-choice': 'door' }, begun(13));
    expect(c(r.world).flags.hushGarden).toBe(true);
    const seenIds = c(r.world).seen;
    expect(seenIds.indexOf('s26-snow')).toBeGreaterThan(seenIds.indexOf('c11-open'));
    expect(seenIds).toContain('s26-complete-door');
  });

  it('S24 runs to its end after the ending, and Spindle’s spring scene plays', () => {
    const r = expectStoryDone(
      's24',
      CHOICES,
      (w) => c(w).chapter > 12 && w.timeMs > endedAt(w) + 10 * STORY.dayMs,
    );
    const seenIds = c(r.world).seen;
    expect(seenIds.indexOf('s24-tea')).toBeGreaterThan(
      seenIds.indexOf(`end-${c(r.world).ending}-last`),
    );
    if (c(r.world).flags.s27Done)
      expect(seenIds.some((s) => s === 's27-spring' || s === 's27-spring-wisp')).toBe(true);
  });
});

describe('the CV1 left-overs', () => {
  it('Wisp settles under the cottage step as a stray once he has unmade the stone', () => {
    const r = runUntil((w) => seen(c(w), 'c9-open'), [], CHOICES);
    bonded(r);
    c(r.world).flags.wisp = 'spared';
    runUntil((w) => seen(c(w), 'c10-close'), [], CHOICES, r);
    expect(c(r.world).seen).toContain('c10-bank-wisp');
    const wisp =
      r.world.strays.find((s) => s.nubbin.name === 'Wisp')?.nubbin ??
      r.world.nubbins.find((n) => n.name === 'Wisp');
    expect(wisp).toBeDefined();
    expect(wisp!.shadow).toBe(true);
    expect(c(r.world).flags.wispHome).toBe(true);
  });

  it('S28 shows Pixel’s Minder still ticking while S7 has reached it and not stopped it', () => {
    // S7 has inspected the Minder and its week talk is still far off.
    const r = runUntil((w) => c(w).side.s7 !== undefined, [], CHOICES);
    const s7 = c(r.world).side.s7!;
    s7.step = 2;
    s7.stage = 'wait';
    s7.sinceMs = r.world.timeMs + 1e9;
    runUntil((w) => seen(c(w), 's28-null') || seen(c(w), 's28-null-minder'), [], CHOICES, r);
    expect(c(r.world).seen).toContain('s28-null-minder');
  });
});
