/**
 * R0604 (CAMP-12): every storyline and mission is reachable from one world. A greedy bot
 * plays one Open-flow Hazel's Grove at 18+: it walks the Keeper round every area, accepts
 * what it is offered (Not now at the cap, taken up again from the board later), takes the
 * journal's "Do it" for every step it can't play, meets the chapter goals, and keeps going
 * past the ending while the Free Grove still has things to offer. The calendar turns as a
 * year would (weather, season, weekday and weekend), and the Keeper does the ordinary
 * things some capers wait for (builds, a lesson, a karate win, a tired Nubbin).
 */
import { describe, expect, it } from 'vitest';
import { regionOfLine } from '../../src/config/story-regions';
import { REGIONS } from '../../src/config/regions';
import { QUEST_OFFERS, SIM } from '../../src/config/tuning';
import { FINAL_CHAPTER, sceneById } from '../../src/sim/campaign';
import { activeQuests } from '../../src/sim/quest-offers';
import { sideActable } from '../../src/sim/side-stories';
import { lineRefusal } from '../../src/sim/story-book';
import { STORYLINE_CONTENT } from '../../src/sim/storyline-content';
import {
  GROVE_SIDE_STORIES,
  registerStorylines,
  storylineById,
  storylines,
} from '../../src/sim/story-scenes';
import type { CampaignState, SimEvent, World } from '../../src/sim/types';
import { applyCommand, stepWorld } from '../../src/sim/world';
import { c, campaignWorld, goalMetNow, meetGoal } from './campaign-driver';
import { playLineToEnding } from './line-ender';

registerStorylines(STORYLINE_CONTENT);

const WEATHER = ['clear', 'rain', 'snow'] as const;
/** A Wednesday and a Saturday (UTC noon), for weekday and weekend triggers. */
const WEEKDAY = Date.UTC(2026, 9, 28, 12);
const WEEKEND = Date.UTC(2026, 9, 31, 12);
/** Passes per calendar slot: a little over one story day, so every hour comes round. */
const SLOT = 120;
/** Every weather on a weekday and a weekend. */
const CYCLE = 6 * SLOT;
/** In a chapter, the bot holds the goal while stories still move, as a player who explores. */
const LINGER = 2 * SLOT;

/** Step the sim, keeping everyone fed and rested but one Nubbin, who is always tired. */
function tick(world: World, events: SimEvent[], seconds: number): void {
  const steps = Math.ceil((seconds * 1000) / SIM.stepMs);
  for (let i = 0; i < steps; i++) {
    const hatched = world.nubbins.filter((n) => n.stage !== 'egg');
    for (const n of world.nubbins) {
      n.needs.hunger = 1;
      n.needs.energy = n === hatched[0] && hatched.length > 1 ? 0.2 : 1;
    }
    events.push(...stepWorld(world, SIM.stepMs));
  }
}

/** The ordinary things a Keeper does in a long save, which some capers wait for. */
function keeperHabits(world: World): void {
  if (world.placed.length < 4) {
    world.placed.push(
      ...(['nursery', 'bench', 'flowerbed', 'fence'] as const).map((kind, i) => ({
        id: `bot-${kind}`,
        kind,
        pos: { x: -20 + i * 3, z: 24 },
      })),
    );
  }
  world.karate.wins = Math.max(1, world.karate.wins);
  for (const n of world.nubbins) {
    if (n.stage === 'egg') continue;
    n.lessons = { ...n.lessons, music: 1 };
    n.stats.fly.points = Math.max(n.stats.fly.points, 900);
    n.stats.swim.points = Math.max(n.stats.swim.points, 900);
  }
}

/**
 * Turn the calendar: the weather and the weekday change slot by slot and hold through it. The
 * season is Hazel's Grove's own (each chapter has one, and the Free Grove after the ending is
 * spring), so the bot leaves it alone.
 */
function turnCalendar(world: World, events: SimEvent[], slot: number): void {
  world.lastWallMs = Math.floor(slot / 3) % 2 === 0 ? WEEKDAY : WEEKEND;
  const weather = WEATHER[slot % 3]!;
  if (world.weather.kind !== weather)
    applyCommand(world, { kind: 'debugWeather', weather }, events);
}

const statusOf = (st: CampaignState, id: string) => (st.side[id] ?? st.fun[id])?.status;

interface Run {
  world: World;
  events: SimEvent[];
  offered: Set<string>;
  opened: Set<string>;
  ms: number;
}

let run: Run | null = null;

function play(): Run {
  if (run) return run;
  const t0 = Date.now();
  const { world, events } = campaignWorld();
  world.settings.questFlow = 'open';
  world.settings.matureContent = 'adult';
  const spots: Array<() => void> = [
    ...REGIONS.grove.pois.map((p) => () => {
      world.location = 'grove';
      world.keeper.pos = { x: p.x, z: p.z };
    }),
    () => (world.location = 'dungeon'),
    () => (world.location = 'corvin'),
  ];
  const all = GROVE_SIDE_STORIES.map((q) => q.id);
  const offered = new Set<string>();
  const opened = new Set<string>();
  let walk = 0;
  let chapter = 0;
  let chapterFrom = 0;
  let lastNews = 0;
  let progress = -1;
  for (let pass = 0; pass < 60_000; pass++) {
    const st = c(world);
    // News is any story moving on: a step taken, a story begun or finished.
    const now = [...Object.values(st.side), ...Object.values(st.fun)].reduce(
      (sum, s) => sum + s.step + (s.status === 'open' ? 1 : 100),
      0,
    );
    if (now !== progress) {
      progress = now;
      lastNews = pass;
    }
    if (st.chapter > FINAL_CHAPTER) {
      // Past the ending: keep sweeping the Free Grove while it still has news.
      const left = all.filter((id) => !['done', 'closed'].includes(statusOf(st, id) ?? ''));
      if (left.length === 0 || pass - lastNews > CYCLE) break;
    }
    if (st.chapter !== chapter) {
      chapter = st.chapter;
      chapterFrom = pass;
    }
    if (st.chapter >= 3) keeperHabits(world);
    turnCalendar(world, events, Math.floor(pass / SLOT));
    const offer = world.questBook?.offer;
    if (offer) {
      offered.add(offer.quest);
      lastNews = pass;
      const free = activeQuests(world, st).length < QUEST_OFFERS.activeCap;
      applyCommand(world, { kind: free ? 'questAccept' : 'questDecline', id: offer.quest }, events);
    }
    // Take up put-off quests from the board as room frees up.
    for (const [id, e] of Object.entries(world.questBook?.entries ?? {}))
      if (e.state === 'declined' && activeQuests(world, st).length < QUEST_OFFERS.activeCap)
        applyCommand(world, { kind: 'questAccept', id }, events);
    for (const id of [...Object.keys(st.side), ...Object.keys(st.fun)])
      if (!opened.has(id)) {
        opened.add(id);
        lastNews = pass;
      }
    if (st.queue.length > 0) {
      const id = st.queue[0]!;
      const scene = sceneById(id)!;
      const choice = scene.choices ? scene.choices[0]!.id : null;
      applyCommand(world, { kind: 'sceneDone', scene: id, choice }, events);
    } else {
      if (st.vigil && !st.vigil.done)
        for (let k = 1; k <= 4; k++)
          applyCommand(world, { kind: 'lightLantern', id: `lantern-${k}` }, events);
      let acted = false;
      for (const id of [...Object.keys(st.side), ...Object.keys(st.fun)])
        if (sideActable(world, st, id)) {
          applyCommand(world, { kind: 'sideAct', story: id }, events);
          acted = true;
        }
      // A player who finishes what they took on before moving the chapter on, within reason.
      const busy = activeQuests(world, st).some((id) => st.fun[id]?.status === 'open');
      const lingering = pass - lastNews < LINGER || (busy && pass - chapterFrom < CYCLE);
      if (
        !acted &&
        !lingering &&
        st.chapter <= FINAL_CHAPTER &&
        st.step === 1 &&
        !goalMetNow(world)
      )
        meetGoal(world, events);
      spots[walk++ % spots.length]!();
      world.keeper.moveTarget = null;
    }
    tick(world, events, 1.1);
  }
  run = { world, events, offered, opened, ms: Date.now() - t0 };
  return run;
}

/**
 * Quests no greedy run of one world reaches today, with the reason. The test fails if this
 * list is wrong either way, so a fix (or a new dead end) has to update it.
 */
const AUTUMN_CHAIN =
  "Q78 to Q85 are an autumn chain; Hazel's Grove has one autumn chapter (8) and a spring Free Grove, so Q79 (an autumn night after Q78) rarely fits and never after the ending";
const KNOWN_UNREACHED: Record<string, string> = {
  q79: AUTUMN_CHAIN,
  q80: AUTUMN_CHAIN,
  q81: AUTUMN_CHAIN,
  q82: AUTUMN_CHAIN,
  q83: AUTUMN_CHAIN,
  q84: AUTUMN_CHAIN,
  q85: AUTUMN_CHAIN,
  e3: 'offered at the Hollow steps, but campaign.ts steps no side story while the Keeper is underground (location dungeon), so the Hollow never offers it',
};

describe('reachability from one world (R0604)', () => {
  it('the spine ends and every quest in the catalogue is reached, most of them finished', () => {
    const { world, offered, opened, ms } = play();
    const st = c(world);
    expect(st.chapter).toBeGreaterThan(FINAL_CHAPTER);
    expect(st.ending).not.toBeNull();
    const all = GROVE_SIDE_STORIES.map((q) => q.id);
    const unreached = all.filter((id) => !offered.has(id) && !opened.has(id));
    expect(unreached.sort()).toEqual(Object.keys(KNOWN_UNREACHED).sort());
    // Reached means it began: offered and accepted (or opened as part of the chapter).
    const begun = all.filter((id) => statusOf(st, id) !== undefined);
    const finished = all.filter((id) => ['done', 'closed'].includes(statusOf(st, id) ?? ''));
    const still = begun.filter((id) => !finished.includes(id));
    console.info(
      `reachability: ${all.length} quests, ${offered.size} offered, ${begun.length} begun, ` +
        `${finished.length} done or closed, still open: ${still.join(' ') || 'none'} (${ms} ms)`,
    );
    expect(begun.length).toBe(all.length - unreached.length);
    // E1 and E2 run on the world alone (a walk, a Nubbin's whole life), past the bot's horizon.
    expect(still.filter((id) => !['e1', 'e2'].includes(id))).toEqual([]);
  }, 120_000);

  it('every line in the story book starts beside Hazel in that same world', () => {
    const { world, events } = play();
    const ids = storylines().map((s) => s.id);
    expect(ids.length).toBeGreaterThanOrEqual(5);
    for (const id of ids) {
      for (const l of Object.keys(world.lines ?? {}))
        if (world.lines[l]!.ending === null)
          applyCommand(world, { kind: 'lineAbandon', line: l }, events);
      expect(lineRefusal(world, id), id).toBeNull();
      applyCommand(world, { kind: 'storylineStart', id }, events);
      const line = world.lines[id];
      expect(line, id).toBeDefined();
      // Lane C r10 agent A (R0605): its scenes play in its own region, entered from the Grove.
      const region = regionOfLine(id);
      if (region) applyCommand(world, { kind: 'storyRegion', region }, events);
      const opening = storylines().find((s) => s.id === id)!.chapters[0]!.opening.id;
      // Play until the line's opening scene has played.
      for (let i = 0; i < 400 && !c(world).seen.includes(opening); i++) {
        const q = c(world).queue[0];
        if (q) {
          const scene = sceneById(q)!;
          applyCommand(
            world,
            { kind: 'sceneDone', scene: q, choice: scene.choices?.[0]?.id ?? null },
            events,
          );
        }
        tick(world, events, 1.1);
      }
      expect(c(world).seen, `${id} opening`).toContain(opening);
    }
  }, 60_000);

  // Lane C r10 agent D (R0604): and every line plays on to one of its endings there.
  it('every line in the story book reaches an ending in that same world', () => {
    const { world, events } = play();
    for (const id of storylines().map((s) => s.id)) {
      for (const l of Object.keys(world.lines ?? {}))
        if (world.lines[l]!.ending === null)
          applyCommand(world, { kind: 'lineAbandon', line: l }, events);
      expect(lineRefusal(world, id), id).toBeNull();
      const r = playLineToEnding(world, events, id);
      expect(r.stuck, `${id} goal terms the bot can't meet`).toEqual([]);
      expect(r.ending, `${id} ending (chapter ${r.chapters})`).not.toBeNull();
      expect(Object.keys(storylineById(id)!.endings)).toContain(r.ending);
      expect(c(world).queue.filter((q) => q.startsWith(`end-${id}-`))).toEqual([]);
    }
  }, 60_000);
});
