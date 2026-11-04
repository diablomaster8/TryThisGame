/**
 * Lane C round 12 (R0640, CAMP-48): a bot plays the spine at Full pace and logs when each story
 * region opens and how much of the time up to chapter 5 went on the spine alone (the bot
 * neither playing a side scene nor moving a side story, fun quest or line on). The log is printed so a writer can read it; the test holds
 * the unlock order to `STORY_REGION_TUNING.opensAt` and the spine share to the 40% target.
 */
import { describe, expect, it } from 'vitest';
import { STORY_REGION_TUNING } from '../../src/config/tuning';
import { FINAL_CHAPTER } from '../../src/sim/campaign';
import type { SimEvent } from '../../src/sim/types';
import { c, campaignWorld, idle, playScenes, tick } from './campaign-driver';

interface Log {
  unlocks: { region: string; chapter: number; atMin: number }[];
  chapterAtMin: Record<number, number>;
  spineShareToCh5: number;
  spineShareAll: number;
}

type W = ReturnType<typeof campaignWorld>['world'];

/** What the side stories and fun quests are doing, to see whether a pass moved one on. */
function sideSignature(world: W): string {
  return JSON.stringify([c(world).side, c(world).fun, world.lines]);
}

/** A spine scene: a chapter's own ('c4-open'), the ending's or the vigil's. */
function spineScene(id: string): boolean {
  return /^(c\d+|t|end)(-|$)/.test(id);
}

function playBot(): Log {
  const { world, events } = campaignWorld();
  const log: Log = { unlocks: [], chapterAtMin: {}, spineShareToCh5: 0, spineShareAll: 0 };
  let seenEvents = 0;
  let spineMs = 0;
  let allMs = 0;
  let spineToCh5 = 0;
  let allToCh5 = 0;
  for (let pass = 0; pass < 8000 && c(world).chapter <= FINAL_CHAPTER && !c(world).ending; pass++) {
    const before = world.timeMs;
    const chapter = c(world).chapter;
    const queued = c(world).queue[0];
    const sig = sideSignature(world);
    log.chapterAtMin[chapter] ??= Math.round(world.timeMs / 600) / 100;
    if (c(world).queue.length > 0) playScenes(world, events);
    else idle(world, events);
    tick(world, events, 1.1);
    // A pass is side time when it played a side scene or moved a side story or line on.
    const alone = !(queued !== undefined && !spineScene(queued)) && sig === sideSignature(world);
    const dt = world.timeMs - before;
    allMs += dt;
    if (alone) spineMs += dt;
    if (chapter < 5) {
      allToCh5 += dt;
      if (alone) spineToCh5 += dt;
    }
    for (const e of events.slice(seenEvents) as SimEvent[])
      if (e.kind === 'storyRegionOpened')
        log.unlocks.push({
          region: e.region,
          chapter: c(world).chapter,
          atMin: Math.round(world.timeMs / 600) / 100,
        });
    seenEvents = events.length;
  }
  log.spineShareToCh5 = allToCh5 ? spineToCh5 / allToCh5 : 1;
  log.spineShareAll = allMs ? spineMs / allMs : 1;
  return log;
}

describe('R0640: the first hour at Full pace', () => {
  it('opens the regions in order and keeps the spine at 40% or more until chapter 5', () => {
    const log = playBot();
    console.log(`pace-bot log: ${JSON.stringify(log)}`);
    const order = log.unlocks.map((u) => u.region);
    const opens = STORY_REGION_TUNING.opensAt;
    // Each region opens at or after its chapter, and never before an earlier-opening one.
    for (const u of log.unlocks) expect(u.chapter).toBeGreaterThanOrEqual(opens[u.region]!);
    const chapters = log.unlocks.map((u) => opens[u.region]!);
    expect([...chapters].sort((a, b) => a - b)).toEqual(chapters);
    expect(order.includes('fold')).toBe(true);
    expect(log.spineShareToCh5).toBeGreaterThanOrEqual(0.4);
  });
});
