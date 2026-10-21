import { describe, expect, it } from 'vitest';
import { EGG, LIFECYCLE, SIM } from '../../src/config/tuning';
import { catchUp } from '../../src/sim/offline';
import { deserialize, serialize } from '../../src/sim/save';
import { lifespanMs } from '../../src/sim/slips';
import type { Nubbin, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Review 2026-10-21, Bug 1: Nubbins that waited for the Keeper must meet their end-of-life
// check in live play, after the "While you were away" screen closes, one at a time.
const DAY = 24 * 3_600_000;

function runMs(w: World, ms: number): SimEvent[] {
  const events: SimEvent[] = [];
  for (let i = 0; i < Math.ceil(ms / SIM.stepMs); i++) events.push(...stepWorld(w, SIM.stepMs));
  return events;
}

/** Two unloved adults near the end of their lives, the second younger by a minute. */
function twoNearTheEnd(): { w: World; ns: Nubbin[] } {
  const w = createWorld(41, 0);
  runMs(w, EGG.hatchMs + LIFECYCLE.childMs + LIFECYCLE.cocoonMs + 1000);
  const ns = w.nubbins.filter((n) => n.stage === 'adult');
  expect(ns.length).toBeGreaterThanOrEqual(2);
  ns.forEach((n, i) => {
    n.needs.affection = 5;
    n.happinessSum = -500;
    n.happinessSamples = 10;
    n.stageMs = lifespanMs(n) - 30 * 60_000 - i * 60_000;
  });
  w.settings.offlineAging.mode = 'indefinite';
  w.settings.offlineAging.allowOfflineDepartures = false;
  return { w, ns };
}

const cocoonsOf = (events: SimEvent[]): string[] =>
  events.flatMap((e) => (e.kind === 'cocoonStarted' && e.cocoon === 'depart' ? [e.nubbinId] : []));

describe('waiting end-of-life checks and the away screen', () => {
  it('hold while the screen is up, then run one at a time with a focus event each', () => {
    const { w, ns } = twoNearTheEnd();
    catchUp(w, 2 * DAY, 0);
    expect(ns.every((n) => n.awaitingKeeper)).toBe(true);

    applyCommand(w, { kind: 'holdEndOfLife', hold: true }, []);
    const underScreen = runMs(w, 60_000);
    expect(cocoonsOf(underScreen)).toEqual([]);
    expect(underScreen.some((e) => e.kind === 'endOfLifeFocus')).toBe(false);
    expect(w.nubbins).toHaveLength(ns.length);

    applyCommand(w, { kind: 'holdEndOfLife', hold: false }, []);
    // Nothing the very step the screen closes: the first check waits a beat.
    expect(cocoonsOf(runMs(w, SIM.stepMs))).toEqual([]);
    const first = runMs(w, LIFECYCLE.awaitingAfterReleaseMs);
    expect(cocoonsOf(first)).toHaveLength(1);
    const focus = first.find((e) => e.kind === 'endOfLifeFocus');
    expect(focus && focus.kind === 'endOfLifeFocus' && focus.nubbinId).toBe(cocoonsOf(first)[0]);
    // The next one waits its turn.
    expect(cocoonsOf(runMs(w, LIFECYCLE.awaitingStaggerMs - 2 * SIM.stepMs))).toEqual([]);
    const second = runMs(w, 2 * SIM.stepMs);
    expect(cocoonsOf(second)).toHaveLength(1);
    expect(cocoonsOf(second)[0]).not.toBe(cocoonsOf(first)[0]);
    // Both cocoons play out on screen and leave memorials.
    runMs(w, LIFECYCLE.cocoonMs + LIFECYCLE.awaitingStaggerMs * ns.length);
    expect(w.memorials.length).toBe(ns.length);
  });

  it('a live end of life that comes due while the screen is up waits too', () => {
    const { w, ns } = twoNearTheEnd();
    const n = ns[0]!;
    n.stageMs = lifespanMs(n) - 1000;
    applyCommand(w, { kind: 'holdEndOfLife', hold: true }, []);
    const events = runMs(w, 5000);
    expect(cocoonsOf(events)).toEqual([]);
    expect(n.awaitingKeeper).toBe(true);
    applyCommand(w, { kind: 'holdEndOfLife', hold: false }, []);
    expect(cocoonsOf(runMs(w, 2000))).toEqual([n.id]);
  });

  it('a load starts released, so a save written under the screen cannot hold forever', () => {
    const { w } = twoNearTheEnd();
    applyCommand(w, { kind: 'holdEndOfLife', hold: true }, []);
    const loaded = deserialize(serialize(w, 0)).world;
    expect(loaded.endOfLife?.held).toBe(false);
  });
});
