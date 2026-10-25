import { describe, expect, it } from 'vitest';
import { FUN, STORY } from '../../src/config/tuning';
import { funQuestOpens, funQuests, parseWhen } from '../../src/sim/fun-quests';
import { FUN_PACK_RULES } from '../../src/sim/fun-pack-rules';
import { SIDE_STORY_CONTENT } from '../../src/sim/side-story-content';
import { sideActable } from '../../src/sim/side-stories';
import { sideStory } from '../../src/sim/story-scenes';
import type { CampaignState, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, drive, tick } from './campaign-driver';
import { begun, runUntil } from './side-driver';

/** Flags the campaign and the side stories own; a fun quest may never write one. */
const CAMPAIGN_FLAGS = [
  'wisp',
  'corvinGate',
  'hazel',
  'walk',
  'millLetter',
  'cinder',
  'visitors',
  'hushGarden',
  'keptStone',
  'boughtBack',
  'soldNubbin',
  'corvin',
  'mossFaded',
  'mossReturned',
  'stoneUnmadeBy',
  'stoneBearer',
  'letThemGo',
  'freedByForce',
  'eternalRaised',
  'notebookFound',
  'mossPetted',
  'corvinOffer',
];

/** A world in `chapter`, a story day in, with nothing queued and no quest open yet. */
function settled(chapter: number) {
  const r = runUntil((w) => c(w).chapter >= chapter && c(w).step >= 1);
  const st = c(r.world);
  st.fun = {};
  tick(r.world, r.events, FUN.offerAfterMs / 1000 + 1);
  drive(r.world, r.events, {}, {}, { until: (w) => c(w).queue.length === 0 });
  st.fun = {};
  // Side stories now wait out the breather between scenes; park them so the fun quests
  // under test have the Grove to themselves.
  for (const s of Object.values(st.side)) if (s.status === 'open') s.status = 'closed';
  return r;
}

describe('fun quests', () => {
  it('reads the trigger texts into predicates', () => {
    expect(parseWhen('Any rainy afternoon')).toMatchObject({ time: 'afternoon', weather: 'rain' });
    expect(parseWhen('Any morning after Chapter 2')).toMatchObject({ time: 'morning', chapter: 3 });
    expect(parseWhen('A weekend afternoon, after Q22')).toMatchObject({
      day: 'weekend',
      after: ['Q22'],
    });
    expect(parseWhen('Harvest season (autumn), daytime')).toMatchObject({
      season: 'autumn',
      time: 'afternoon',
    });
    expect(parseWhen('Any morning when the player has room for an egg').facts).toContain(
      'roomForEgg',
    );
    expect(parseWhen('Its festival day')).toMatchObject({ day: 'festival' });
    // The Hodja pack opens "once Chapter 3 is done", as "after Chapter 3" does.
    expect(parseWhen('once Chapter 3 is done (never during Chapters 9–11)').chapter).toBe(4);
    expect(parseWhen('Any day')).toMatchObject({
      time: null,
      weather: null,
      season: null,
      day: null,
    });
  });

  it('registers all 95 and none of them writes a campaign flag', () => {
    const quests = funQuests();
    expect(quests).toHaveLength(95);
    for (const q of quests) {
      const written = new Set<string>(Object.keys(q.sets ?? {}));
      const scenes = [...q.steps.map((s) => s.scene), ...q.steps.map((s) => s.done), q.complete];
      for (const scene of scenes) {
        for (const k of Object.keys(scene?.set ?? {})) written.add(k);
        for (const ch of scene?.choices ?? [])
          for (const k of Object.keys(ch.set ?? {})) written.add(k);
      }
      for (const k of written) {
        expect(CAMPAIGN_FLAGS, `${q.code} writes ${k}`).not.toContain(k);
        expect(/^s\d+Done$/.test(k), `${q.code} writes ${k}`).toBe(false);
      }
    }
  });

  it('offers one quest at a time, a story day into a chapter, and never the same one twice', () => {
    const r = settled(3);
    const st = c(r.world);
    // A clear morning in chapter 3: the Bean's Mr Tweed is at his gate.
    r.world.weather.kind = 'clear';
    r.world.timeMs = Math.floor(r.world.timeMs / STORY.dayMs) * STORY.dayMs + 1000;
    st.openedMs = r.world.timeMs - FUN.offerAfterMs - 1;
    // The clock was moved by hand: the last scene's breather is long over.
    st.rest = null;
    expect(funQuestOpens(r.world, st, sideStory('q21')!)).toBe(true);
    tick(r.world, r.events, 2);
    const open = Object.values(st.fun).filter((s) => s.status === 'open');
    expect(open).toHaveLength(1);
    tick(r.world, r.events, 5);
    expect(Object.values(st.fun).filter((s) => s.status === 'open')).toHaveLength(1);
    // Done or closed, it is never offered again.
    const [id] = Object.keys(st.fun);
    st.fun[id!]!.status = 'closed';
    st.queue = [];
    tick(r.world, r.events, 5);
    expect(st.fun[id!]!.status).toBe('closed');
  });

  it('a quest runs to its end on the journal’s button and keeps its rewards', () => {
    const r = settled(3);
    const st = c(r.world);
    r.world.weather.kind = 'clear';
    r.world.timeMs = Math.floor(r.world.timeMs / STORY.dayMs) * STORY.dayMs + 1000;
    st.openedMs = r.world.timeMs - FUN.offerAfterMs - 1;
    // The clock was moved by hand: the last scene's breather is long over.
    st.rest = null;
    tick(r.world, r.events, 2);
    const id = Object.keys(st.fun)[0]!;
    const quest = sideStory(id)!;
    for (let guard = 0; guard < 400 && st.fun[id]!.status === 'open'; guard++) {
      if (st.queue.length > 0) {
        const scene = st.queue[0]!;
        const def = sideStory(id)!;
        const all = [
          ...def.steps.map((s) => s.scene),
          ...def.steps.map((s) => s.done),
          def.complete,
        ];
        const found = all.find((s) => s?.id === scene);
        const choice = found?.choices ? found.choices[0]!.id : null;
        applyCommand(r.world, { kind: 'sceneDone', scene, choice }, r.events);
      } else if (sideActable(r.world, st, id)) {
        applyCommand(r.world, { kind: 'sideAct', story: id }, r.events);
      }
      tick(r.world, r.events, 1.1);
    }
    expect(st.fun[id]!.status).toBe('done');
    for (const reward of quest.rewards) expect(r.world.inventory.keepsakes).toContain(reward.id);
  });

  it('never offers one before the first hatch or in chapter 1', () => {
    const r = runUntil(begun(1));
    const st = c(r.world);
    st.fun = {};
    tick(r.world, r.events, FUN.offerAfterMs / 1000 + 1);
    for (const q of funQuests()) expect(funQuestOpens(r.world, st, q), q.code).toBe(false);
    expect(Object.keys(st.fun)).toHaveLength(0);
    // Even a later chapter waits for the first hatch.
    st.chapter = 2;
    st.stats.hatched = 0;
    for (const q of funQuests()) expect(funQuestOpens(r.world, st, q), q.code).toBe(false);
  });

  it('never offers, advances or acts in chapters 9 to 11', () => {
    const r = runUntil(begun(9));
    const st = c(r.world);
    for (const q of funQuests()) expect(funQuestOpens(r.world, st, q), q.code).toBe(false);
    const openQ = Object.entries(st.fun).find(([, s]) => s.status === 'open');
    if (openQ) expect(sideActable(r.world, st, openQ[0])).toBe(false);
    runUntil(begun(12), [], {}, r);
    const during = st.seen.filter((s) => /^q\d+-/.test(s));
    const before = c(r.world).seen.indexOf('c9-open');
    const after = c(r.world).seen.indexOf('c12-open');
    for (const s of during) {
      const at = st.seen.indexOf(s);
      expect(at < before || at > after, `${s} inside chapters 9-11`).toBe(true);
    }
  });

  it('the Sunny line waits for the 18+ setting and follows Q31', () => {
    const r = settled(4);
    const st = c(r.world);
    const q31 = sideStory('q31')!;
    const q32 = sideStory('q32')!;
    const evening = (w: World) => {
      w.timeMs =
        Math.floor(w.timeMs / STORY.dayMs) * STORY.dayMs + STORY.duskAt * STORY.dayMs + 1000;
    };
    evening(r.world);
    expect(funQuestOpens(r.world, st, q31)).toBe(false);
    r.world.settings.matureContent = 'adult';
    expect(funQuestOpens(r.world, st, q31)).toBe(true);
    expect(funQuestOpens(r.world, st, q32)).toBe(false);
    st.fun.q31 = {
      status: 'done',
      step: 0,
      stage: 'complete',
      pending: null,
      openedMs: 0,
      sinceMs: 0,
      acted: false,
    };
    r.world.timeMs = Math.floor(r.world.timeMs / STORY.dayMs) * STORY.dayMs + STORY.dayMs + 1000;
    expect(funQuestOpens(r.world, st, q32)).toBe(true);
  });
});

describe('the Alice, Holmes and Hodja payoffs', () => {
  const variants = new Set(SIDE_STORY_CONTENT.variants.map((v) => v.id));
  const world = {} as World;
  const camp = (flags: Record<string, string | boolean>) => ({ flags }) as unknown as CampaignState;

  it('play a written variant scene for every value of the choice they answer', () => {
    const r = FUN_PACK_RULES;
    expect(r.q71!.variant!(world, camp({}), 'q71-witness')).toBe('q71-witness');
    for (const [flag, v] of [
      ['q70-garden', 'garden'],
      ['q70-mirror', 'mirror'],
    ] as const) {
      expect(r.q71!.variant!(world, camp({ [flag]: true }), 'q71-witness')).toBe(
        `q71-witness-${v}`,
      );
      expect(r.q75!.variant!(world, camp({ [flag]: true }), 'q75-wake')).toBe(`q75-wake-${v}`);
    }
    const picks: string[] = [];
    for (const jem of ['freed', 'owned', 'lestrade'])
      picks.push(
        ...r.q84!.after!(world, camp({ 'q78-jem': jem }), 1),
        ...r.q85!.after!(world, camp({ 'q78-jem': jem }), 1),
      );
    picks.push(
      ...r.q85!.before!(world, camp({}), 2),
      ...r.q85!.before!(world, camp({ 'q79-contradicted': true }), 2),
    );
    expect(r.q91!.variant!(world, camp({ 'q87-gift': 'seat' }), 'q91-judge')).toBe(
      'q91-judge-seat',
    );
    for (const gift of ['seat', 'coat', 'watch'])
      picks.push(...r.q95!.after!(world, camp({ 'q87-gift': gift }), 2));
    picks.push(
      'q71-witness-garden',
      'q71-witness-mirror',
      'q75-wake-garden',
      'q75-wake-mirror',
      'q91-judge-seat',
    );
    expect(new Set(picks).size).toBe(14);
    for (const id of picks) expect(variants.has(id), id).toBe(true);
  });
});
