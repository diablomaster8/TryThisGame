import { REGIONS } from '../config/regions';
import { regionOfLine } from '../config/story-regions';
import { C11_CHOICE_FLAGS, C11_UI, QUEST_OFFERS } from '../config/tuning';
import type { Quest } from '../content/types';
import { objectivePoi } from './beacon';
import { chapterDef, FINAL_CHAPTER } from './campaign';
import { goalTarget } from './goal-target';
import { homeRegion } from './quest-areas';
import { boardState, questAllowed, questAreaKey, questSize } from './quest-offers';
import { regionOf } from './regions';
import { GROVE_SIDE_STORIES, sideStory, storylines } from './story-scenes';
import type { CampaignState, World } from './types';

/**
 * Lane C round 11, helper ui (R0608, R0641, R0663, R0667, R0651): what the map, the journal's
 * pages and the title read about quests. Everything here only reads the world; nothing writes
 * it, so the markers, the ledger and the recommender are safe to draw on any frame.
 */

export type MapMarkKind = 'offer' | 'tracked' | 'active' | 'done';
export const MARK_GLYPH: Readonly<Record<MapMarkKind, string>> = {
  offer: '!',
  tracked: '◆',
  active: '◇',
  done: '✓',
};

export interface AreaMark {
  /** `region/poi`, as `questAreaKey` writes it. */
  area: string;
  offer: string[];
  tracked: string[];
  active: string[];
  done: string[];
}

/** The state of one quest for the markers: null when the save has nothing to say about it. */
export function questMarkState(
  world: World,
  c: CampaignState,
  id: string,
): 'available' | 'active' | 'done' | null {
  const b = boardState(world, c, id);
  if (b === 'done') return 'done';
  if (b === 'available') return 'available';
  if (b === 'active' || b === 'shelved') return 'active';
  const st = c.fun[id] ?? c.side[id];
  return st?.status === 'open' ? 'active' : null;
}

/** Where a quest sits for a marker: its current step's own area, else the quest's area. */
export function markArea(quest: Quest, stepIndex: number): string | null {
  const step = quest.steps[Math.min(stepIndex, quest.steps.length - 1)] as
    { area?: string } | undefined;
  const key = step?.area ?? questAreaKey(quest);
  if (!key) return null;
  const [region, poi] = key.split('/');
  // A region-wide quest hangs on the hub's marker.
  return !poi || poi === '*' ? (region === 'grove' ? QUEST_OFFERS.hubArea : `${region}/*`) : key;
}

/** One entry per area that has anything to show, keyed by area. */
export function areaMarks(world: World): Record<string, AreaMark> {
  const c = world.campaign;
  const out: Record<string, AreaMark> = {};
  if (!c || c.storyline) return out;
  const tracked = new Set(world.questBook?.tracked ?? []);
  for (const q of GROVE_SIDE_STORIES) {
    if (!questAllowed(world, q)) continue;
    const st = questMarkState(world, c, q.id);
    if (!st) continue;
    const stepNow = (c.fun[q.id] ?? c.side[q.id])?.step ?? 0;
    const area = markArea(q, st === 'done' ? 0 : stepNow);
    if (!area) continue;
    const m = (out[area] ??= { area, offer: [], tracked: [], active: [], done: [] });
    if (st === 'available') m.offer.push(q.id);
    else if (st === 'done') m.done.push(q.id);
    else if (tracked.has(q.id)) m.tracked.push(q.id);
    else m.active.push(q.id);
  }
  return out;
}

/** The marker an area shows: `!` over `◆` over `◇` over `✓`. */
export function markKind(m: AreaMark): MapMarkKind {
  if (m.offer.length > 0) return 'offer';
  if (m.tracked.length > 0) return 'tracked';
  if (m.active.length > 0) return 'active';
  return 'done';
}

/** How many quests the marker stands for (a badge shows when more than one). */
export function markCount(m: AreaMark): number {
  return m[markKind(m)].length;
}

/** The area's id after the slash, or null for a region-wide one. */
export function areaPoi(area: string): string | null {
  const poi = area.split('/')[1];
  return poi && poi !== '*' ? poi : null;
}

export function areaCounts(m: AreaMark): { fresh: number; active: number; done: number } {
  return { fresh: m.offer.length, active: m.active.length + m.tracked.length, done: m.done.length };
}

/** R0635: how long a quest is, in steps and rough minutes. */
export function questLength(id: string): { of: number; minutes: number } | null {
  const q = sideStory(id);
  if (!q) return null;
  const of = q.steps.length;
  return { of, minutes: Math.max(1, of * QUEST_OFFERS.minutesPerStep) };
}

export { questSize };

export interface LedgerRow {
  id: string;
  done: number;
  total: number;
  played: number;
  endings: number;
}

export interface Ledger {
  regions: LedgerRow[];
  lines: Array<{
    id: string;
    title: string;
    n: number;
    of: number;
    begun: boolean;
    ending: string | null;
  }>;
  percent: number;
  /** Quests done, and done with no skip. */
  done: number;
  played: number;
  total: number;
  /** Quest ids finished with no skip (the leaf). */
  leaves: Set<string>;
}

/** R0641: the completion ledger at the save's own Mature content setting. */
export function ledger(world: World): Ledger {
  const c = world.campaign;
  const skipped = world.questBook?.skippedSteps ?? {};
  const rows = new Map<string, LedgerRow>();
  const row = (id: string): LedgerRow => {
    let r = rows.get(id);
    if (!r) {
      r = { id, done: 0, total: 0, played: 0, endings: 0 };
      rows.set(id, r);
    }
    return r;
  };
  const leaves = new Set<string>();
  let done = 0;
  let played = 0;
  let total = 0;
  for (const q of GROVE_SIDE_STORIES) {
    if (!questAllowed(world, q)) continue;
    const r = row(homeRegion(q) ?? 'grove');
    r.total += 1;
    total += 1;
    const st = c?.fun[q.id] ?? c?.side[q.id];
    if (st?.status === 'done' || st?.status === 'closed') {
      r.done += 1;
      done += 1;
      if (!skipped[q.id]) {
        r.played += 1;
        played += 1;
        leaves.add(q.id);
      }
    }
  }
  const lines: Ledger['lines'] = [];
  let ended = 0;
  for (const s of storylines()) {
    const line = world.lines?.[s.id];
    const ending = line?.ending ?? null;
    lines.push({
      id: s.id,
      title: s.title,
      n: line?.chapter ?? 0,
      of: s.chapters.length,
      begun: !!line,
      ending: ending ? (s.endings[ending]?.title ?? ending) : null,
    });
    if (ending) {
      ended += 1;
      row(regionOfLine(s.id) ?? 'grove').endings += 1;
    }
  }
  const all = total + lines.length;
  const percent = all === 0 ? 0 : Math.round(((done + ended) / all) * 100);
  return { regions: [...rows.values()], lines, percent, done, played, total, leaves };
}

/** R0663: the spine goal's nearest point of interest (its area), or null. */
export function spineAreaPoi(world: World): string | null {
  const c = world.campaign;
  if (!c || c.storyline || c.chapter > FINAL_CHAPTER) return null;
  const key = `story:hazel:${c.chapter}`;
  const at = goalTarget(world, key) ?? objectivePoi(world, key);
  if (!at) return null;
  let best: string | null = null;
  let d = Infinity;
  for (const p of REGIONS.grove.pois) {
    const e = Math.hypot(p.x - at.x, p.z - at.z);
    if (e < d) {
      d = e;
      best = p.id;
    }
  }
  return best;
}

export function storyFirst(
  world: World,
): { chapter: number; poi: string | null; over: boolean } | null {
  const c = world.campaign;
  if (!c || c.storyline) return null;
  if (c.chapter > FINAL_CHAPTER || !chapterDef(c.chapter))
    return { chapter: c.chapter, poi: null, over: true };
  return { chapter: c.chapter, poi: spineAreaPoi(world), over: false };
}

/** R0663: the shortest quest on offer in the Keeper's region, or null. */
export function suggestedNext(world: World): string | null {
  const c = world.campaign;
  if (!c) return null;
  const here = regionOf(world.location);
  let best: string | null = null;
  let steps = Infinity;
  for (const q of GROVE_SIDE_STORIES) {
    if (!questAllowed(world, q) || boardState(world, c, q.id) !== 'available') continue;
    if ((homeRegion(q) ?? 'grove') !== here) continue;
    if (q.steps.length < steps) {
      steps = q.steps.length;
      best = q.id;
    }
  }
  return best;
}

/**
 * R0651: whether an arrival beat may show now. At most `beatsPerHour` an hour, never within
 * `beatGapMs` of the last, never while a scene is up. `recent` holds the sim times of the beats.
 */
export function beatAllowed(recent: readonly number[], nowMs: number, busy: boolean): boolean {
  if (busy) return false;
  const last = recent[recent.length - 1];
  if (last !== undefined && nowMs - last < C11_UI.beatGapMs) return false;
  return recent.filter((t) => nowMs - t < 3_600_000).length < C11_UI.beatsPerHour;
}

/** R0667: the signature choices in a campaign's flags, as `flag -> value` text. */
export function choicesOf(
  flags: Readonly<Record<string, number | boolean | string>>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of C11_CHOICE_FLAGS) if (flags[k] !== undefined) out[k] = String(flags[k]);
  return out;
}

/** R0667: the choices that differ between two summaries, in a stable order. */
export function compareChoices(
  a: Readonly<Record<string, string>> | undefined,
  b: Readonly<Record<string, string>> | undefined,
): Array<{ flag: string; a: string | null; b: string | null }> {
  const out: Array<{ flag: string; a: string | null; b: string | null }> = [];
  for (const k of C11_CHOICE_FLAGS) {
    const x = a?.[k] ?? null;
    const y = b?.[k] ?? null;
    if (x !== y) out.push({ flag: k, a: x, b: y });
  }
  return out;
}
