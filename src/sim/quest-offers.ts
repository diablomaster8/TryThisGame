import { REGIONS } from '../config/regions';
import { QUEST_OFFERS, STORY_BOOK } from '../config/tuning';
import type { Quest } from '../content/types';
import { areaOf } from '../content/where-map';
import { homeRegion } from './quest-areas';
import { regionOf } from './regions';
import { sideStory } from './story-scenes';
import type { CampaignState, QuestBook, QuestEntry, SimEvent, World } from './types';

/**
 * Lane C round 8 (R0602, R0603, R0609, R0664): the Open quest flow. In the Guided flow (unset,
 * every save from before) side stories and capers open on their own, as they always have. In the
 * Open flow a story whose `opens()` holds waits instead, until the Keeper walks into its area:
 * then it is offered, once, and opens only when accepted. Not now keeps it on the area's board
 * and it is never pushed on entry again. The campaign's own stories (`QUEST_OFFERS.decline` `never`)
 * and anything opening in Hazel's quiet chapters still arrive on their own, as part of the
 * chapter (R0612). Done and closed stay where they always were, in `campaign.side` and `fun`.
 */

/** Is this world on the Open flow (a Hazel's Grove save, outside the Learning Grove). */
export function openFlow(world: World): boolean {
  return world.settings.questFlow === 'open' && world.edu === null;
}

export function questBook(world: World): QuestBook {
  return (world.questBook ??= {
    v: 1,
    entries: {},
    offer: null,
    tracked: [],
    areas: {},
    here: null,
  });
}

/** R0603: what Not now means for this story. */
export function declineRule(id: string): 'never' | 'lapse' | 'free' {
  return QUEST_OFFERS.decline[id] ?? 'free';
}

function quiet(c: CampaignState): boolean {
  return STORY_BOOK.quietChapters.includes(c.chapter) || (c.vigil !== null && !c.vigil.done);
}

/**
 * How the runner may open story `id` (called before `opens()`): `auto` as before, `accepted`
 * once the Keeper said yes (it opens now, whatever the hour), `wait` until then.
 */
export function questGate(
  world: World,
  c: CampaignState,
  id: string,
): 'auto' | 'accepted' | 'wait' {
  if (!openFlow(world) || c.storyline !== null || declineRule(id) === 'never') return 'auto';
  const entry = world.questBook?.entries[id];
  if (entry?.state === 'active') return 'accepted';
  if (entry) return 'wait';
  return quiet(c) ? 'auto' : 'wait';
}

/** A started story the Keeper put aside: the runner holds it exactly where it is. */
export function questShelved(world: World, id: string): boolean {
  return openFlow(world) && world.questBook?.entries[id]?.state === 'shelved';
}

/** Where a quest is offered: `region/poi`, `region/*` for anywhere in it, or null for anywhere. */
export function questAreaKey(quest: Quest): string | null {
  const home = homeRegion(quest);
  if (home === null) return null;
  const a = areaOf(quest);
  if (!a || a.region !== home) return QUEST_OFFERS.hubArea;
  return `${home}/${a.poi ?? '*'}`;
}

/** Is `quest` offered in area `here`. */
export function offeredAt(quest: Quest, here: string): boolean {
  const key = questAreaKey(quest);
  if (key === null) return true;
  const [region, poi] = key.split('/');
  const [hereRegion, herePoi] = here.split('/');
  if (region !== hereRegion) return false;
  return poi === '*' || herePoi === '*' || poi === herePoi;
}

/**
 * The area the Keeper is in: in the Grove the nearest point of interest within
 * `QUEST_OFFERS.areaR`, else none; anywhere else the region as a whole (`region/*`).
 */
export function keeperArea(world: World): string | null {
  const region = regionOf(world.location);
  if (region !== 'grove') return `${region}/*`;
  const { x, z } = world.keeper.pos;
  let best: string | null = null;
  let bestD = QUEST_OFFERS.areaR * QUEST_OFFERS.areaR;
  for (const p of REGIONS.grove.pois) {
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d <= bestD) {
      bestD = d;
      best = `grove/${p.id}`;
    }
  }
  return best;
}

function campaignStatus(c: CampaignState, id: string): string | undefined {
  return (c.side[id] ?? c.fun[id])?.status;
}

/** Accepted quests still under way, in the order they were accepted (the cap counts these). */
export function activeQuests(world: World, c: CampaignState): string[] {
  const book = world.questBook;
  if (!book) return [];
  return Object.entries(book.entries)
    .filter(
      ([id, e]) =>
        e.state === 'active' && !['done', 'closed'].includes(campaignStatus(c, id) ?? ''),
    )
    .sort((a, b) => (a[1].acceptedMs ?? 0) - (b[1].acceptedMs ?? 0))
    .map(([id]) => id);
}

/** What the board shows for one quest (R0607), or null if it has nothing to say. */
export function boardState(
  world: World,
  c: CampaignState,
  id: string,
): 'available' | 'active' | 'shelved' | 'done' | null {
  const status = campaignStatus(c, id);
  if (status === 'done' || status === 'closed') return 'done';
  const e = world.questBook?.entries[id];
  if (!e) return null;
  if (e.state === 'active') return 'active';
  if (e.state === 'shelved') return 'shelved';
  return 'available';
}

/**
 * Once a sim second, after the runner: note the Keeper's area and, on entering one, offer at
 * most one quest there. `candidates` are in priority order (the side stories, then the capers),
 * and `opens(id)` is the runner's own "may this open now" (audience included).
 */
export function stepQuestOffers(
  world: World,
  c: CampaignState,
  candidates: readonly string[],
  opens: (id: string) => boolean,
  events: SimEvent[],
): void {
  if (!openFlow(world) || c.storyline !== null) return;
  const book = questBook(world);
  const here = keeperArea(world);
  if (here === book.here) return;
  book.here = here;
  if (here === null) return;
  const now = world.timeMs;
  const seen = (book.areas[here] ??= { firstMs: now, lastMs: now, visits: 0 });
  seen.lastMs = now;
  seen.visits += 1;
  events.push({ kind: 'areaEntered', area: here });
  if (quiet(c)) return;
  for (const id of candidates) {
    if (declineRule(id) === 'never' || campaignStatus(c, id) !== undefined) continue;
    const e = book.entries[id];
    if (e && (e.state !== 'offered' || now < e.offeredMs + QUEST_OFFERS.reofferMs)) continue;
    const quest = sideStory(id);
    if (!quest || !offeredAt(quest, here) || !opens(id)) continue;
    book.entries[id] = {
      state: 'offered',
      area: here,
      offeredMs: now,
      acceptedMs: null,
      declines: e?.declines ?? 0,
    };
    book.offer = { quest: id, area: here, atMs: now };
    events.push({ kind: 'questOffered', quest: id, area: here });
    return;
  }
}

/** R0644: QA's offer of any quest not yet begun, here and now (the debug panel). */
export function debugOffer(world: World, id: string, events: SimEvent[]): boolean {
  const c = world.campaign;
  if (!openFlow(world) || !c || !sideStory(id) || declineRule(id) === 'never') return false;
  if (campaignStatus(c, id) !== undefined) return false;
  const book = questBook(world);
  const area = book.here ?? QUEST_OFFERS.hubArea;
  const prior = book.entries[id];
  book.entries[id] = {
    state: 'offered',
    area,
    offeredMs: world.timeMs,
    acceptedMs: null,
    declines: prior?.declines ?? 0,
  };
  book.offer = { quest: id, area, atMs: world.timeMs };
  events.push({ kind: 'questOffered', quest: id, area });
  return true;
}

function entryFor(world: World, id: string): QuestEntry {
  const book = questBook(world);
  return (book.entries[id] ??= {
    state: 'offered',
    area: book.here ?? QUEST_OFFERS.hubArea,
    offeredMs: world.timeMs,
    acceptedMs: null,
    declines: 0,
  });
}

function clearOffer(book: QuestBook, id: string): void {
  if (book.offer?.quest === id) book.offer = null;
}

/** Accept an offered, put-off or shelved quest; at the cap, shelve `shelve` first or ask. */
export function acceptQuest(
  world: World,
  c: CampaignState,
  id: string,
  shelve: string | undefined,
  events: SimEvent[],
): boolean {
  if (!openFlow(world) || !sideStory(id) || declineRule(id) === 'never') return false;
  const status = campaignStatus(c, id);
  const prior = world.questBook?.entries[id];
  if (status === 'done' || status === 'closed' || prior?.state === 'active') return false;
  // A story that opened on its own (the quiet chapters) is already under way.
  if (status === 'open' && prior?.state !== 'shelved') return false;
  const active = activeQuests(world, c);
  if (active.length >= QUEST_OFFERS.activeCap) {
    if (!shelve || !active.includes(shelve) || !shelveQuest(world, shelve)) {
      events.push({ kind: 'questAtCap', quest: id, active });
      return false;
    }
  }
  const book = questBook(world);
  const e = entryFor(world, id);
  e.state = 'active';
  e.acceptedMs ??= world.timeMs;
  clearOffer(book, id);
  if (!book.tracked.includes(id) && book.tracked.length < QUEST_OFFERS.trackCap)
    book.tracked.push(id);
  return true;
}

/** Not now: back on the board, never pushed on entry again. The campaign's own stories refuse. */
export function declineQuest(world: World, c: CampaignState, id: string): boolean {
  if (!openFlow(world) || !sideStory(id) || declineRule(id) === 'never') return false;
  if (campaignStatus(c, id) !== undefined) return false;
  const book = questBook(world);
  const e = entryFor(world, id);
  if (e.state === 'active') return false;
  e.state = 'declined';
  e.declines += 1;
  clearOffer(book, id);
  return true;
}

/** Put an active quest aside, its progress kept. Only quests that change nothing may be. */
export function shelveQuest(world: World, id: string): boolean {
  if (!openFlow(world) || declineRule(id) !== 'free') return false;
  const e = world.questBook?.entries[id];
  if (e?.state !== 'active') return false;
  e.state = 'shelved';
  const book = questBook(world);
  book.tracked = book.tracked.filter((t) => t !== id);
  return true;
}

/** Pin or unpin an active quest on the objective chip (R0609). */
export function trackQuest(world: World, id: string, on: boolean): boolean {
  if (!openFlow(world)) return false;
  const book = questBook(world);
  if (!on) {
    const had = book.tracked.includes(id);
    book.tracked = book.tracked.filter((t) => t !== id);
    return had;
  }
  if (book.entries[id]?.state !== 'active' || book.tracked.includes(id)) return false;
  if (book.tracked.length >= QUEST_OFFERS.trackCap) return false;
  book.tracked.push(id);
  return true;
}

/** Drop tracked quests that have finished (the journal and chip read only live ones). */
export function tidyTracked(world: World, c: CampaignState): void {
  const book = world.questBook;
  if (!book || book.tracked.length === 0) return;
  book.tracked = book.tracked.filter(
    (id) => !['done', 'closed'].includes(campaignStatus(c, id) ?? ''),
  );
}

/** R0606: the size chip, from the quest's step count. */
export function questSize(quest: Quest): 'S' | 'M' | 'L' {
  const n = quest.steps.length;
  return n <= QUEST_OFFERS.size.s ? 'S' : n <= QUEST_OFFERS.size.m ? 'M' : 'L';
}

/** R0635: where a started quest stands, as step i of n, and the minutes left, or null. */
export function questProgress(
  world: World,
  id: string,
): { step: number; of: number; minutesLeft: number } | null {
  const c = world.campaign;
  const st = c?.side[id] ?? c?.fun[id];
  const quest = sideStory(id);
  if (!st || st.status !== 'open' || !quest) return null;
  const of = quest.steps.length;
  const step = Math.min(st.step + 1, of);
  return { step, of, minutesLeft: Math.max(1, (of - st.step) * QUEST_OFFERS.minutesPerStep) };
}
