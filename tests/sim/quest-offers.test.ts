/** Lane C round 8: the Open quest flow, offers on area entry (sim/quest-offers.ts). */
import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { QUEST_OFFERS } from '../../src/config/tuning';
import { FINAL_CHAPTER } from '../../src/sim/campaign';
import {
  activeQuests,
  boardState,
  keeperArea,
  questBook,
  playStats,
  questProgress,
} from '../../src/sim/quest-offers';
import { RUNNER_STORIES } from '../../src/sim/side-stories';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { catchUp } from '../../src/sim/offline';
import { deserialize, serialize, worldFingerprint } from '../../src/sim/save';
import { c, campaignWorld, drive, playScenes, tick } from './campaign-driver';

const POIS = REGIONS.grove.pois;

function poi(id: string): { x: number; z: number } {
  const p = POIS.find((q) => q.id === id)!;
  return { x: p.x, z: p.z };
}

/** Hazel's Grove at chapter `n` in the Open flow, its opening played, the Keeper nowhere. */
function openAt(n: number): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  world.settings.questFlow = 'open';
  applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
  playScenes(world, events);
  world.keeper.pos = { x: 0, z: -40 };
  tick(world, events, 400);
  playScenes(world, events);
  return { world, events };
}

function walkTo(world: World, events: SimEvent[], id: string): void {
  world.keeper.pos = poi(id);
  world.keeper.moveTarget = null;
  tick(world, events, 2);
}

function away(world: World, events: SimEvent[]): void {
  world.keeper.pos = { x: 0, z: -40 };
  tick(world, events, 2);
}

function offers(events: SimEvent[], quest: string): number {
  return events.filter((e) => e.kind === 'questOffered' && e.quest === quest).length;
}

describe('the Open quest flow', () => {
  it('the Guided flow (unset) keeps no book and pushes as before', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    tick(world, events, 60);
    expect(world.questBook).toBeUndefined();
    expect(events.some((e) => e.kind === 'questOffered')).toBe(false);
  });

  it('nothing opens on its own: free stories wait to be offered', () => {
    const { world } = openAt(3);
    const st = c(world);
    for (const id of Object.keys(st.side))
      expect(QUEST_OFFERS.decline[id], `${id} opened unasked`).toBe('never');
    expect(Object.keys(st.fun)).toEqual([]);
  });

  it('walking to the falls in chapter 3 offers Q1 once; Not now puts it on the board for good', () => {
    const { world, events } = openAt(3);
    walkTo(world, events, 'falls');
    expect(keeperArea(world)).toBe('grove/falls');
    expect(questBook(world).offer?.quest).toBe('q01');
    expect(offers(events, 'q01')).toBe(1);
    tick(world, events, 30);
    expect(offers(events, 'q01')).toBe(1);
    applyCommand(world, { kind: 'questDecline', id: 'q01' }, events);
    expect(questBook(world).offer).toBeNull();
    expect(boardState(world, c(world), 'q01')).toBe('available');
    for (let i = 0; i < 3; i++) {
      away(world, events);
      walkTo(world, events, 'falls');
    }
    world.timeMs += QUEST_OFFERS.reofferMs * 2;
    away(world, events);
    walkTo(world, events, 'falls');
    expect(offers(events, 'q01')).toBe(1);
    expect(c(world).fun.q01).toBeUndefined();
    // Accepting from the board later opens it.
    applyCommand(world, { kind: 'questAccept', id: 'q01' }, events);
    tick(world, events, 3);
    expect(c(world).fun.q01?.status).toBe('open');
    expect(questBook(world).tracked).toContain('q01');
    // R0635: step 1 of its steps, three minutes a step.
    const p = questProgress(world, 'q01')!;
    expect(p.step).toBe(1);
    expect(p.of).toBeGreaterThan(0);
    expect(p.minutesLeft).toBe(p.of * QUEST_OFFERS.minutesPerStep);
  });

  it('an unanswered offer may come again after a while; a different area offers its own', () => {
    const { world, events } = openAt(3);
    walkTo(world, events, 'falls');
    away(world, events);
    walkTo(world, events, 'falls');
    expect(offers(events, 'q01')).toBe(1);
    world.timeMs += QUEST_OFFERS.reofferMs;
    away(world, events);
    walkTo(world, events, 'falls');
    expect(offers(events, 'q01')).toBe(2);
  });

  it('the sixth accept asks to shelve one; shelved progress resumes exactly', () => {
    const { world, events } = openAt(4);
    const ids = ['q01', 'q02', 'q03', 'q04', 'q05', 'q06'];
    for (const id of ids.slice(0, 5)) applyCommand(world, { kind: 'questAccept', id }, events);
    expect(activeQuests(world, c(world))).toEqual(ids.slice(0, 5));
    applyCommand(world, { kind: 'questAccept', id: 'q06' }, events);
    const cap = events.find((e) => e.kind === 'questAtCap');
    expect(cap).toMatchObject({ quest: 'q06', active: ids.slice(0, 5) });
    expect(questBook(world).entries.q06?.state).not.toBe('active');
    tick(world, events, 3);
    const before = JSON.stringify(c(world).fun.q02);
    applyCommand(world, { kind: 'questAccept', id: 'q06', shelve: 'q02' }, events);
    expect(questBook(world).entries.q02?.state).toBe('shelved');
    expect(questBook(world).tracked).not.toContain('q02');
    for (let i = 0; i < 40; i++) {
      tick(world, events, 5);
      playScenes(world, events);
    }
    expect(JSON.stringify(c(world).fun.q02)).toBe(before);
    applyCommand(world, { kind: 'questShelve', id: 'q03' }, events);
    applyCommand(world, { kind: 'questAccept', id: 'q02' }, events);
    expect(questBook(world).entries.q02?.state).toBe('active');
    // R0670: the counts match what was done (7 accepts, the capped one not counted; 2 shelves).
    expect(playStats(world)).toMatchObject({ offered: 0, accepted: 7, declined: 0, shelved: 2 });
  });

  it('the campaign’s own stories refuse Not now and still open on their own (R0603)', () => {
    const { world, events } = openAt(5);
    for (const id of ['s5', 's9', 's10', 's27', 's28']) {
      expect(QUEST_OFFERS.decline[id]).toBe('never');
      applyCommand(world, { kind: 'questDecline', id }, events);
      expect(questBook(world).entries[id]).toBeUndefined();
    }
    for (let i = 0; i < 300 && !c(world).side.s5; i++) {
      tick(world, events, 5);
      playScenes(world, events);
    }
    expect(c(world).side.s5?.status).toBe('open');
  });

  it('every story that changes the campaign says what declining means (R0603)', () => {
    for (const id of ['s2', 's9', 's10', 's13', 's19', 's23', 's26', 's27'])
      expect(QUEST_OFFERS.decline[id], id).toBeDefined();
    for (const id of Object.keys(QUEST_OFFERS.decline)) expect(RUNNER_STORIES).toContain(id);
    // Only free quests can be shelved: a lapse story mid-way would hold a chapter.
    const { world, events } = openAt(7);
    applyCommand(world, { kind: 'questAccept', id: 's13' }, events);
    applyCommand(world, { kind: 'questShelve', id: 's13' }, events);
    expect(questBook(world).entries.s13?.state).toBe('active');
  });

  it('declining every offer, the lapse stories among them, the chapters still reach the end', () => {
    const { world, events } = campaignWorld();
    world.settings.questFlow = 'open';
    const declined = new Set<string>();
    let i = 0;
    drive(
      world,
      events,
      {},
      {},
      {
        until: (w) => {
          const offer = w.questBook?.offer;
          if (offer) {
            declined.add(offer.quest);
            applyCommand(w, { kind: 'questDecline', id: offer.quest }, events);
          }
          w.keeper.pos = { ...POIS[i++ % POIS.length]! };
          w.keeper.moveTarget = null;
          return c(w).chapter > FINAL_CHAPTER;
        },
      },
    );
    expect(c(world).chapter).toBeGreaterThan(FINAL_CHAPTER);
    // S19 and S23 open in the quiet chapters, as part of them (R0612): never offered.
    for (const id of ['s2', 's13', 's26']) expect(declined, id).toContain(id);
    for (const id of ['s19', 's23']) expect(declined.has(id), id).toBe(false);
    for (const id of declined) expect(c(world).side[id] ?? c(world).fun[id]).toBeUndefined();
  }, 60_000);

  it('nothing is offered in the quiet chapters (R0612)', () => {
    const { world, events } = openAt(10);
    for (const p of POIS) walkTo(world, events, p.id);
    expect(events.some((e) => e.kind === 'questOffered')).toBe(false);
    expect(events.some((e) => e.kind === 'areaEntered')).toBe(true);
  });

  it('the book survives a save and load, and catch-up offers nothing', () => {
    const { world, events } = openAt(3);
    walkTo(world, events, 'falls');
    applyCommand(world, { kind: 'questDecline', id: 'q01' }, events);
    applyCommand(world, { kind: 'questAccept', id: 'q02' }, events);
    const back = deserialize(serialize(world, 1)).world;
    // A second round trip changes nothing (the first may repair fields a live world lacks).
    expect(worldFingerprint(deserialize(serialize(back, 1)).world)).toBe(worldFingerprint(back));
    expect(back.questBook).toEqual(world.questBook);
    const before = JSON.stringify(world.questBook?.entries);
    const away = catchUp(world, 7 * 86_400_000, 7 * 86_400_000);
    expect(away.events.some((e) => e.kind === 'questOffered')).toBe(false);
    expect(JSON.stringify(world.questBook?.entries)).toBe(before);
  });

  it('QA can put any quest on the card (R0644)', () => {
    const { world, events } = openAt(3);
    applyCommand(world, { kind: 'debugQuestOffer', id: 'q20' }, events);
    expect(questBook(world).offer?.quest).toBe('q20');
    applyCommand(world, { kind: 'debugQuestOffer', id: 's5' }, events);
    expect(questBook(world).offer?.quest).toBe('q20');
  });
});
