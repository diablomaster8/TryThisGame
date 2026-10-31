/** Lane C round 9, agent Q: scene priorities, spine pacing, line rewards, windows, audience, cadence. */
import { afterEach, describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import {
  LINE_REWARD,
  OFFER_WINDOWS,
  QUEST_CADENCE,
  SCENE_PRIO,
  STORY,
} from '../../src/config/tuning';
import { castAwaitingChoice } from '../../src/sim/line-rewards';
import { hasRoom } from '../../src/sim/roster';
import {
  activeCapers,
  activeQuests,
  boardState,
  questAllowed,
  questBook,
} from '../../src/sim/quest-offers';
import { deserialize, serialize } from '../../src/sim/save';
import { orderSceneQueue, queuedScenes, scenePrio } from '../../src/sim/scene-queue';
import { spineBusy } from '../../src/sim/side-stories';
import { noteLineEvents } from '../../src/sim/story-book';
import { nextDawn } from '../../src/sim/story-state';
import { registerStorylines, sceneById, sideStory } from '../../src/sim/story-scenes';
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, meetGoal, playScenes, tick } from './campaign-driver';

registerStorylines(STORYLINE_CONTENT);

const POIS = REGIONS.grove.pois;

function hazelAt(n: number, open = false): { world: World; events: SimEvent[] } {
  const { world, events } = campaignWorld();
  if (open) world.settings.questFlow = 'open';
  applyCommand(world, { kind: 'debugChapter', chapter: n }, events);
  playScenes(world, events);
  world.keeper.pos = { x: 0, z: -40 };
  tick(world, events, 400);
  playScenes(world, events);
  return { world, events };
}

function walkTo(world: World, events: SimEvent[], id: string): void {
  const p = POIS.find((q) => q.id === id)!;
  world.keeper.pos = { x: p.x, z: p.z };
  world.keeper.moveTarget = null;
  tick(world, events, 2);
}

function away(world: World, events: SimEvent[]): void {
  world.keeper.pos = { x: 0, z: -40 };
  tick(world, events, 2);
}

describe('R0597: one scene queue with explicit owners and priorities', () => {
  it('spine before line before side story before caper; the head never moves', () => {
    const { world, events } = hazelAt(4);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    const line = world.lines.hundred!;
    // Lane C r10 agent A: the Keeper in the Fold, where the Hundred Days' scenes play (R0605).
    applyCommand(world, { kind: 'storyRegion', region: 'fold' }, events);
    const q = c(world);
    q.queue = ['t-ran-away', 'q01-intro', 's13-step1', 'h-c2-open', 'c4-open'];
    line.queue = ['h-c2-open'];
    expect(scenePrio(world, 'c4-open')).toBe(SCENE_PRIO.spine);
    expect(scenePrio(world, 'h-c2-open')).toBe(SCENE_PRIO.line);
    expect(scenePrio(world, 's13-step1')).toBe(SCENE_PRIO.side);
    expect(scenePrio(world, 'q01-intro')).toBe(SCENE_PRIO.caper);
    expect(orderSceneQueue(world)).toBe(true);
    expect(q.queue).toEqual(['t-ran-away', 'c4-open', 'h-c2-open', 's13-step1', 'q01-intro']);
    expect(queuedScenes(world).map((s) => s.prio)).toEqual([0, 0, 1, 2, 3]);
    expect(orderSceneQueue(world)).toBe(false);
  });

  it('a chain already playing finishes before another owner starts', () => {
    const { world } = hazelAt(4);
    const q = c(world);
    q.queue = ['s13-step1', 'c4-open', 's13-tobin'];
    orderSceneQueue(world);
    expect(q.queue).toEqual(['s13-step1', 's13-tobin', 'c4-open']);
  });
});

describe('R0631: the spine stays first with two lines running', () => {
  it('every spine opening is queued within breatherMs + 1 s of its chapter beginning', () => {
    const { world, events } = hazelAt(3);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    // Lane C r10 agent A (R0640): at chapter 3 only the Fold is open; the Keeper stays in the
    // Fold, where the Hundred Days plays (R0605).
    applyCommand(world, { kind: 'storyRegion', region: 'fold' }, events);
    expect(Object.keys(world.lines)).toEqual(['hundred']);
    const lineScenes: string[] = [];
    const checked: number[] = [];
    for (const n of [4, 5]) {
      // Let the lines get going before the spine moves on.
      for (let i = 0; i < 90; i++) {
        tick(world, events, 1);
        lineScenes.push(...playScenes(world, events).filter((s) => !/^c\d/.test(s)));
      }
      meetGoal(world, events);
      const open = `c${n}-open`;
      let begunMs: number | null = null;
      let queuedMs: number | null = null;
      // Ticks of 0.5 s, scenes answered each tick, so the gap is read to the half second.
      for (let i = 0; i < 2400 && queuedMs === null; i++) {
        const mark = events.length;
        tick(world, events, 0.5);
        const begun = events
          .slice(mark)
          .find((e) => e.kind === 'chapter' && e.chapter === n && !e.line);
        if (begunMs === null && begun) begunMs = world.timeMs;
        if (begunMs !== null && c(world).queue.includes(open)) queuedMs = world.timeMs;
        const head = c(world).queue[0];
        if (head && head !== open)
          applyCommand(
            world,
            { kind: 'sceneDone', scene: head, choice: sceneById(head)?.choices?.[0]?.id ?? null },
            events,
          );
        else if (head === open) break;
      }
      expect(begunMs, `chapter ${n} at ${c(world).chapter}.${c(world).step}`).not.toBeNull();
      expect(queuedMs! - begunMs!).toBeLessThanOrEqual(STORY.breatherMs + 1000);
      checked.push(n);
      playScenes(world, events);
    }
    expect(checked).toEqual([4, 5]);
    expect(lineScenes.some((s) => s.startsWith('h-') || s.startsWith('b-'))).toBe(true);
  }, 60_000);

  it('no offer is made while Hazel’s opening is due', () => {
    const { world, events } = hazelAt(3, true);
    const st = c(world);
    // A new chapter begun, its opening not yet played.
    st.chapter = 4;
    st.step = 0;
    st.seen = st.seen.filter((s) => s !== 'c4-open');
    expect(spineBusy(world, st)).toBe(true);
    const before = events.length;
    for (const p of POIS) {
      world.keeper.pos = { x: p.x, z: p.z };
      // One sim second at most, so the opening has no time to queue and play.
      tick(world, events, 0.2);
      if (!spineBusy(world, st)) break;
    }
    expect(events.slice(before).some((e) => e.kind === 'questOffered')).toBe(false);
  });
});

describe('R0639 / R0600: a line ending leaves Shells, a keepsake and a Grove change, once', () => {
  it('pays once, then asks after its cast (R0594: home needs room; stay frees the slot)', () => {
    const { world, events } = hazelAt(4);
    applyCommand(world, { kind: 'storylineStart', id: 'hundred' }, events);
    const line = world.lines.hundred!;
    const partner = String(line.flags.cast);
    // The Grove full of the Keeper's own (the running line's partner counts apart).
    while (hasRoom(world))
      applyCommand(world, { kind: 'debugGive', what: 'egg', amount: 1 }, events);
    const shells = world.inventory.shells;
    line.ending = 'kept';
    const ev: SimEvent[] = [{ kind: 'lineEnded', line: 'hundred', ending: 'kept' }];
    noteLineEvents(world, ev);
    const r = LINE_REWARD.hundred!;
    expect(world.inventory.shells).toBe(shells + r.shells);
    expect(world.inventory.keepsakes).toContain(r.keepsake);
    expect(world.inventory.keepsakes).toContain(r.grove);
    expect(ev.some((e) => e.kind === 'lineReward' && e.shells === r.shells)).toBe(true);
    expect(ev.find((e) => e.kind === 'lineCastChoice')).toMatchObject({ cast: [partner] });
    // Walking it again pays nothing more.
    noteLineEvents(world, [{ kind: 'lineEnded', line: 'hundred', ending: 'kept' }]);
    expect(world.inventory.shells).toBe(shells + r.shells);
    // The Grove is full: home is refused; staying sets its home and ends the wait.
    const mark = events.length;
    applyCommand(
      world,
      { kind: 'lineCastHome', line: 'hundred', nubbinId: partner, home: true },
      events,
    );
    const full = events.slice(mark).find((e) => e.kind === 'lineCastChose');
    expect(full).toMatchObject({ ok: false });
    expect(castAwaitingChoice(world, 'hundred')).toEqual([partner]);
    applyCommand(
      world,
      { kind: 'lineCastHome', line: 'hundred', nubbinId: partner, home: false },
      events,
    );
    expect(world.nubbins.find((n) => n.id === partner)?.home).toBe(r.home);
    expect(castAwaitingChoice(world, 'hundred')).toEqual([]);
    // Optional fields: the save keeps them with no version bump.
    const back = deserialize(serialize(world, 1)).world;
    expect(back.nubbins.find((n) => n.id === partner)?.home).toBe(r.home);
    expect(back.inventory.keepsakes).toContain(r.grove);
  });
});

describe('R0652: offers with a window', () => {
  afterEach(() => {
    delete OFFER_WINDOWS.s2;
  });

  it('a free story’s offer lasts until dawn, then may be offered again next window', () => {
    const { world, events } = hazelAt(6, true);
    applyCommand(world, { kind: 'debugQuestOffer', id: 's12' }, events);
    const e = questBook(world).entries.s12!;
    expect(e.expiresMs).toBe(nextDawn(world.timeMs));
    applyCommand(world, { kind: 'questDecline', id: 's12' }, events);
    world.timeMs = e.expiresMs! + 1;
    tick(world, events, 2);
    expect(events.find((x) => x.kind === 'questExpired')).toMatchObject({
      quest: 's12',
      lapsed: false,
    });
    expect(questBook(world).entries.s12?.state).toBe('offered');
    expect(questBook(world).entries.s12?.expiresMs).toBeUndefined();
    expect(c(world).side.s12).toBeUndefined();
  });

  it('a lapse story left until its window ends lapses, as declining it does', () => {
    OFFER_WINDOWS.s2 = 5;
    const { world, events } = hazelAt(3, true);
    applyCommand(world, { kind: 'debugQuestOffer', id: 's2' }, events);
    expect(questBook(world).entries.s2?.expiresMs).toBe(world.timeMs + 5 * 60_000);
    tick(world, events, 5 * 60 + 2);
    expect(questBook(world).entries.s2).toMatchObject({ state: 'declined', expired: true });
    expect(questBook(world).offer).toBeNull();
    expect(boardState(world, c(world), 's2')).toBeNull();
    applyCommand(world, { kind: 'questAccept', id: 's2' }, events);
    tick(world, events, 30);
    expect(c(world).side.s2).toBeUndefined();
  });
});

describe('R0655: Mature content per quest inside one save', () => {
  it('lowering 18+ to Off shelves and hides Q31; raising shows it shelved, progress kept', () => {
    const { world, events } = hazelAt(4, true);
    const q31 = sideStory('q31')!;
    world.settings.matureContent = 'off';
    expect(questAllowed(world, q31)).toBe(false);
    applyCommand(world, { kind: 'questAccept', id: 'q31' }, events);
    expect(questBook(world).entries.q31).toBeUndefined();
    world.settings.matureContent = 'adult';
    applyCommand(world, { kind: 'questAccept', id: 'q31' }, events);
    tick(world, events, 5);
    expect(c(world).fun.q31?.status).toBe('open');
    playScenes(world, events);
    tick(world, events, 5);
    const progress = JSON.stringify(c(world).fun.q31);
    applyCommand(
      world,
      { kind: 'setSettings', settings: { ...world.settings, matureContent: 'off' } },
      events,
    );
    tick(world, events, 2);
    expect(questBook(world).entries.q31).toMatchObject({ state: 'shelved', audienceHeld: true });
    expect(activeQuests(world, c(world))).not.toContain('q31');
    expect(questBook(world).tracked).not.toContain('q31');
    expect(boardState(world, c(world), 'q31')).toBeNull();
    tick(world, events, 60);
    expect(JSON.stringify(c(world).fun.q31)).toBe(progress);
    applyCommand(
      world,
      { kind: 'setSettings', settings: { ...world.settings, matureContent: 'adult' } },
      events,
    );
    tick(world, events, 2);
    expect(boardState(world, c(world), 'q31')).toBe('shelved');
    expect(questBook(world).entries.q31?.state).toBe('shelved');
  });

  it('never offers above the setting while walking every area', () => {
    const { world, events } = hazelAt(4, true);
    world.settings.matureContent = 'off';
    for (let round = 0; round < 6; round++)
      for (const p of POIS) {
        walkTo(world, events, p.id);
        const offer = questBook(world).offer;
        if (offer) applyCommand(world, { kind: 'questDecline', id: offer.quest }, events);
        world.timeMs += QUEST_CADENCE.areaOfferCooldownMs;
      }
    const offered = events.flatMap((e) => (e.kind === 'questOffered' ? [e.quest] : []));
    expect(offered.length).toBeGreaterThan(0);
    for (const id of offered) expect(sideStory(id)!.audience, id).not.toMatch(/teen|adult/);
  });
});

describe('R0637: capers are pulled, not pushed', () => {
  it('Open never opens a caper without an accepted offer; one offer per entry; area cooldown', () => {
    const { world, events } = hazelAt(3, true);
    let entries = 0;
    for (let round = 0; round < 10; round++)
      for (const p of POIS) {
        const mark = events.length;
        walkTo(world, events, p.id);
        entries += 1;
        const now = events.slice(mark).filter((e) => e.kind === 'questOffered');
        expect(now.length).toBeLessThanOrEqual(QUEST_CADENCE.offerPerEntry);
        const offer = questBook(world).offer;
        if (offer) applyCommand(world, { kind: 'questDecline', id: offer.quest }, events);
        away(world, events);
      }
    expect(entries).toBeGreaterThan(0);
    expect(Object.keys(c(world).fun)).toEqual([]);
    // Re-entering an area inside its cooldown makes no new offer.
    const area = Object.entries(questBook(world).areaOfferMs ?? {})[0];
    if (area) {
      const poi = area[0].split('/')[1]!;
      world.timeMs = area[1] + 1000;
      const mark = events.length;
      away(world, events);
      walkTo(world, events, poi);
      expect(events.slice(mark).some((e) => e.kind === 'questOffered')).toBe(false);
    }
  });

  it('no caper is offered past capersActiveMax under way', () => {
    const { world, events } = hazelAt(4, true);
    for (const id of ['q01', 'q02', 'q03'])
      applyCommand(world, { kind: 'questAccept', id }, events);
    tick(world, events, 3);
    expect(activeCapers(world, c(world))).toBe(QUEST_CADENCE.capersActiveMax);
    const mark = events.length;
    for (const p of POIS) {
      walkTo(world, events, p.id);
      world.timeMs += QUEST_CADENCE.areaOfferCooldownMs;
      away(world, events);
    }
    const capers = events
      .slice(mark)
      .flatMap((e) => (e.kind === 'questOffered' ? [e.quest] : []))
      .filter((id) => /^q\d+$/.test(id));
    expect(capers).toEqual([]);
  });
});
