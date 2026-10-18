import type { Quest } from '../content/types';
import { FUN, STORY } from '../config/tuning';
import { isFunQuestCode, questAvailable } from './audience';
import { FUN_PACK_RULES } from './fun-pack-rules';
import { hasRoom } from './roster';
import { levelOf } from './stats';
import { isAfternoon, isMorning, isNight, type StoryRule } from './side-rule-kit';
import { GROVE_SIDE_STORIES } from './story-scenes';
import type { CampaignState, World } from './types';

/**
 * The fun quests Q1 to Q95 (Python, Bean, Sunny, Avatar, Alice, Holmes and Hodja), driven by the same step
 * machine as the side stories but kept apart from them: their state lives in
 * `campaign.fun`, they never hold a chapter, never run in chapters 9 to 11, and the
 * Mature content setting decides whether the Sunny line is offered at all. Each offers
 * itself once, from the plain-English `when` text of its trigger, read here as a few
 * predicates: a time of day, the weather, the season, the day of the week, a chapter,
 * a quest it follows, and a handful of Grove facts. Phrases the sim cannot see yet (a
 * shooting star, a murky stream) read as "any time", and are listed in PROGRESS.md.
 */

export interface WhenRule {
  time: 'morning' | 'midday' | 'afternoon' | 'evening' | 'night' | null;
  weather: 'rain' | 'snow' | 'clear' | null;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
  day: 'weekday' | 'weekend' | 'market' | 'festival' | null;
  /** The chapter the quest waits for ("after Chapter 2"). */
  chapter: number | null;
  /** Quest codes it follows ("after Q21"), on top of `requires`. */
  after: string[];
  /** Grove facts it needs. */
  facts: FunFact[];
}

export type FunFact =
  | 'roomForEgg'
  | 'lessonTaken'
  | 'karateWin'
  | 'raceDay'
  | 'builtThree'
  | 'tiredNubbin'
  | 'swimNubbin'
  | 'flyNubbin';

const has = (text: string, ...words: string[]): boolean => words.some((w) => text.includes(w));

/** Read a trigger's `when` text into predicates. Unknown phrases fall to "any time". */
export function parseWhen(when: string): WhenRule {
  const t = when.toLowerCase();
  const rule: WhenRule = {
    time: null,
    weather: null,
    season: null,
    day: null,
    chapter: null,
    after: [],
    facts: [],
  };
  if (has(t, 'morning')) rule.time = 'morning';
  else if (has(t, 'midday')) rule.time = 'midday';
  else if (has(t, 'afternoon', 'daytime')) rule.time = 'afternoon';
  else if (has(t, 'evening', 'after closing')) rule.time = 'evening';
  else if (has(t, 'night')) rule.time = 'night';
  if (has(t, 'rainy', 'rain ')) rule.weather = 'rain';
  else if (has(t, 'snow')) rule.weather = 'snow';
  else if (has(t, 'dry', 'fine weather', 'warm', 'hot', 'summer day', 'sunny'))
    rule.weather = 'clear';
  if (has(t, 'autumn', 'harvest')) rule.season = 'autumn';
  else if (has(t, 'summer')) rule.season = 'summer';
  else if (has(t, 'winter')) rule.season = 'winter';
  else if (has(t, 'spring')) rule.season = 'spring';
  if (has(t, 'weekday')) rule.day = 'weekday';
  else if (has(t, 'weekend')) rule.day = 'weekend';
  else if (has(t, 'market day', 'market morning')) rule.day = 'market';
  else if (has(t, 'festival day')) rule.day = 'festival';
  const chapter = /after chapter (\d+)/.exec(t) ?? /once chapter (\d+) is done/.exec(t);
  if (chapter) rule.chapter = Number(chapter[1]) + 1;
  for (const m of t.matchAll(/after q(\d+)/g)) rule.after.push(`Q${m[1]}`);
  if (has(t, 'room for an egg')) rule.facts.push('roomForEgg');
  if (has(t, 'kindergarten lesson')) rule.facts.push('lessonTaken');
  if (has(t, 'karate win')) rule.facts.push('karateWin');
  if (has(t, 'race day')) rule.facts.push('raceDay');
  if (has(t, 'built at least three')) rule.facts.push('builtThree');
  if (has(t, 'nubbin is tired')) rule.facts.push('tiredNubbin');
  if (has(t, 'some swim')) rule.facts.push('swimNubbin');
  if (has(t, 'fly-leaning')) rule.facts.push('flyNubbin');
  return rule;
}

function factHolds(world: World, c: CampaignState, fact: FunFact): boolean {
  switch (fact) {
    case 'roomForEgg':
      return hasRoom(world);
    case 'lessonTaken':
      return world.nubbins.some((n) => Object.keys(n.lessons).length > 0);
    case 'karateWin':
      return world.karate.wins > 0;
    case 'raceDay':
      return c.stats.races > 0;
    case 'builtThree':
      return world.placed.length >= 3;
    case 'tiredNubbin':
      return world.nubbins.some((n) => n.stage !== 'egg' && n.needs.energy < FUN.tiredBelow);
    case 'swimNubbin':
      return world.nubbins.some((n) => levelOf(n.stats.swim.points) >= FUN.someStatLevel);
    case 'flyNubbin':
      return world.nubbins.some((n) => levelOf(n.stats.fly.points) >= FUN.someStatLevel);
  }
}

function timeHolds(world: World, time: WhenRule['time']): boolean {
  const ms = world.timeMs;
  switch (time) {
    case null:
      return true;
    case 'morning':
      return isMorning(ms);
    case 'midday': {
      const f = (ms % STORY.dayMs) / STORY.dayMs;
      return (
        f >= STORY.morningEndsAt - FUN.middayHalfWidth &&
        f <= STORY.morningEndsAt + FUN.middayHalfWidth
      );
    }
    case 'afternoon':
      return isAfternoon(ms);
    case 'evening':
    case 'night':
      return isNight(ms);
  }
}

function dayHolds(world: World, day: WhenRule['day']): boolean {
  if (day === null) return true;
  if (day === 'festival') return world.festivalSeen === world.season;
  const weekday = new Date(world.lastWallMs).getDay();
  const weekend = weekday === 0 || weekday === 6;
  if (day === 'weekend') return weekend;
  if (day === 'weekday') return !weekend;
  return (FUN.marketDays as readonly number[]).includes(weekday);
}

/** The quest's `requires` and "after Qn": codes of quests done, or flags set. */
function followsMet(c: CampaignState, quest: Quest, rule: WhenRule): boolean {
  const needs = [...(quest.requires ?? []), ...rule.after];
  return needs.every((need) =>
    isFunQuestCode(need) ? c.fun[need.toLowerCase()]?.status === 'done' : Boolean(c.flags[need]),
  );
}

/** Whether `quest` offers itself now. Once open (or done) it is never offered again. */
export function funQuestOpens(world: World, c: CampaignState, quest: Quest): boolean {
  if (!questAvailable(quest, audienceContext(world), c.chapter)) return false;
  const rule = parseWhen(quest.trigger.when);
  if (rule.chapter !== null && c.chapter < rule.chapter) return false;
  if (!followsMet(c, quest, rule)) return false;
  if (!timeHolds(world, rule.time)) return false;
  if (rule.weather !== null && world.weather.kind !== rule.weather) return false;
  if (rule.season !== null && world.season !== rule.season) return false;
  if (!dayHolds(world, rule.day)) return false;
  return rule.facts.every((f) => factHolds(world, c, f));
}

export function audienceContext(world: World): {
  matureContent: World['settings']['matureContent'];
  learningGrove: boolean;
} {
  // A Learning Grove save carries `edu`; only audience 'all' is offered there (CV2).
  return { matureContent: world.settings.matureContent, learningGrove: world.edu !== null };
}

/** The fun quests in the registry, by quest id ('q21'). */
export function funQuests(): Quest[] {
  return GROVE_SIDE_STORIES.filter((q) => isFunQuestCode(q.code));
}

/** One rule per fun quest: opens from its `when`, pauses through chapters 9 to 11. */
export function funRule(quest: Quest): StoryRule {
  const paused = (world: World, c: CampaignState): boolean =>
    !questAvailable(quest, audienceContext(world), c.chapter);
  return {
    ...FUN_PACK_RULES[quest.id],
    id: quest.id,
    opens: (w, c) => funQuestOpens(w, c, quest),
    gate: (w, c) => !paused(w, c),
    canAct: (w, c) => !paused(w, c),
    completeGate: (w, c) => !paused(w, c),
  };
}
