import type { Quest } from '../content/types';
import { audienceAllowed, funQuestBlocked } from './audience';
import { hatch } from './lifecycle';
import { createEgg } from './nubbin';
import { EARLY_RULES } from './side-rules-early';
import { LATE_RULES } from './side-rules-late';
import { EXPANSION_RULES } from './side-rules-expansions';
import { MID_RULES } from './side-rules-mid';
import {
  commandMeets,
  dawnSince,
  duskSince,
  postGameMorning,
  type StoryRule,
  watchCheck,
} from './side-rule-kit';
import { CHAPTERS, SPEAKERS, STORY_TEXT } from '../config/story';
import { FUN, STORY } from '../config/tuning';
import { funQuests, funRule } from './fun-quests';
import { isLangQuestCode, langQuestIds, langRule } from './lang';
import { nextGrade } from './stats';
import { grantRewards } from './story-rewards';
import { sceneById, sideStory } from './story-scenes';
import {
  collectorRoute,
  mossInWorld,
  nextDawn,
  nextDusk,
  queueScene,
  resting,
  sableBonded,
  sceneOwner,
  sideResting,
  seen,
  seenAt,
  wispSaved,
} from './story-state';
import type { CampaignState, Command, SideStoryState, SimEvent, World } from './types';
import { newId, withRng } from './world';

/**
 * The side-story runner. It drives every Grove side story: when each opens, when each
 * step's scene may play, when each check is met, which variant scene plays, and when an
 * unfinished story closes. Scenes go through the campaign queue, one at a time, and the
 * dialogue box plays them like any other. The five stories the campaign waits on (S5, S9,
 * S10, S27 and S28) are written here; the other 26 live in side-rules-early/mid/late.ts
 * and share the kit in side-rule-kit.ts.
 *
 * Checks the sim can watch (a dusk passing, a talk, a race entered, chapter 12 arriving)
 * are met on their own (`watchCheck`, `noteSideCommand`). The rest (carry Fossil to the
 * cliff, find the wire coil…) need places and minigames that do not exist yet, so the
 * journal offers the step as an action (`sideAct`), which meets it. Each story's notes
 * are the source for the rules.
 */

/** S9's family gate: two or more of six ties to the valley (canon 27). */
export function familyCount(c: CampaignState): number {
  const f = c.flags;
  return [
    f.corvin === 'reconciled',
    Boolean(f.s3Done),
    Boolean(f.s6Done),
    Boolean(f.s8Done),
    f.millLetter === 'kept',
    Boolean(f.visitors),
  ].filter(Boolean).length;
}

/** The S10 foot-of-the-hill scene: m (Moss can walk), s (Sable), c (Corvin), in order. */
export function s10FootScene(world: World, c: CampaignState): string {
  const tag = [
    mossInWorld(c) ? 'm' : '',
    sableBonded(world, c) ? 's' : '',
    c.flags.corvinGate === 'family' ? 'c' : '',
  ].join('');
  return tag ? `s10-foot-${tag}` : 's10-foot';
}

const S5: StoryRule = {
  id: 's5',
  // The first morning after c5-open.
  opens: (w, c) => c.chapter === 5 && c.openedMs !== null && w.timeMs >= nextDawn(c.openedMs),
  closes: (_w, c) => c.chapter > 5,
  // Step 4: sit with them until dark.
  auto: (w, _c, st, i) => i === 3 && duskSince(w, st),
  autoOnly: [3],
};

const S27: StoryRule = {
  id: 's27',
  // Simplified: the Circuit visit after c5-close is chapter 6 onwards.
  opens: (_w, c) => c.chapter >= 6 && c.chapter <= 8 && seen(c, 'c5-close'),
  // c8-close with the homecoming (step 11) not done closes it unfinished.
  closes: (_w, c, st) => seen(c, 'c8-close') && st.step <= 10,
  gate: (w, c, st, i) => {
    if (i === 2) return dawnSince(w, st); // s27-wait: the next Circuit visit, a day later
    if (i === 4 || i === 6) return duskSince(w, st); // the two nights at the pens
    if (i === 8) return seen(c, 'c7-open'); // the Autumn Show
    if (i === 11) return typeof c.flags.wisp === 'string' || c.chapter >= 8; // the egg sac
    return true;
  },
  // Step 5: be at the pens at first light.
  auto: (w, _c, st, i) => i === 4 && dawnSince(w, st),
  autoOnly: [4],
  variant: (_w, c, scene) => {
    const sold = Boolean(c.flags['s27-sold']);
    if (sold && scene === 's27-row') return 's27-row-sold';
    if (sold && scene === 's27-words') return 's27-words-sold';
    if (sold && scene === 's27-letgo') return 's27-home';
    if (sold && scene === 's27-gate') return 's27-gate-sold';
    if (scene === 's27-midnight' && c.flags['s27-truth'] === 'shield') return 's27-midnight-shield';
    if (scene === 's27-carry') {
      if (wispSaved(c)) return 's27-carry-wisp';
      if (c.flags.s21Done) return 's27-carry-clank';
    }
    return scene;
  },
};

const S28: StoryRule = {
  id: 's28',
  opens: (_w, c) => c.chapter === 8 && seen(c, 'c8-nova'),
  closes: (_w, c) => c.chapter >= 12,
  gate: (w, c, st, i) => {
    if (i === 0) return w.timeMs >= nextDawn(st.openedMs); // the morning after the notebook
    if (i === 4) return dawnSince(w, st); // elevenses, the first morning after step 4
    // Steps 11–13: the second morning after the Long Night.
    if (i === 10)
      return c.chapter === 11 && c.openedMs !== null && w.timeMs >= nextDawn(c.openedMs);
    return true;
  },
  variant: (_w, c, scene) => {
    const f = c.flags;
    // Pixel's Minder still ticking: S7 has reached it and nobody has stopped it.
    const s7 = c.side.s7;
    if (scene === 's28-null' && s7 && s7.step >= 2 && !f.s7Done && !f['s7-stopped'])
      return 's28-null-minder';
    const column = f['s28-column'];
    if (scene === 's28-logged' && column === 'unverified') return 's28-logged-unverified';
    if (scene === 's28-logged' && column === 'none') return 's28-logged-none';
    if (scene === 's28-bench' && f.s8Reunited) return 's28-bench-bramble';
    if (scene === 's28-why' && f['s28-told'] === false) return 's28-why-untold';
    if (scene === 's28-grue-back' && f['s28-offer'] === 'weed') return 's28-grue-back-weed';
    if (scene === 's28-grue-back' && f['s28-offer'] === 'stare') return 's28-grue-back-stare';
    if (scene === 's28-complete' && column === 'unverified') return 's28-complete-unverified';
    if (scene === 's28-complete' && column === 'none') return 's28-complete-none';
    // s28-null-minder needs S7's Minder, which no runner tracks yet: s28-null plays.
    return scene;
  },
};

const S10: StoryRule = {
  id: 's10',
  // Hazel's first evening home.
  opens: (w, c) => c.chapter === 11 && c.openedMs !== null && w.timeMs >= nextDusk(c.openedMs),
  closes: (_w, c) => c.chapter > 12,
  adjust: (_w, c, st) => {
    // Wishes still open on the eve of chapter 12 lapse; step 4's scene plays anyway.
    if (st.step < 3 && (seen(c, 'c11-close') || c.chapter >= 12)) {
      st.step = 3;
      st.stage = 'wait';
      st.pending = null;
    }
  },
  gate: (w, c, st, i) => {
    if (i === 1 || i === 2) return dawnSince(w, st); // later chapter 11 days
    if (i === 3) {
      // The eve of chapter 12: after c11-close, and after c11-gate when it plays.
      const gateDue = seen(c, 's9-ask') && !c.flags.keptStone;
      return seen(c, 'c11-close') && (!gateDue || seen(c, 'c11-gate'));
    }
    return true;
  },
  // Step 2's race is reported by noteSideRace; step 4 is the walk after c12-open.
  auto: (_w, c, _st, i) =>
    i === 3 &&
    c.chapter === 12 &&
    seen(c, 'c12-open') &&
    (typeof c.flags.hazel !== 'string' || seen(c, 'c12-foot-told') || seen(c, 'c12-foot-secret')),
  autoOnly: [1, 3],
  completeGate: (_w, c) => seen(c, 'c12-close'),
  variant: (w, c, scene) => {
    const told = c.flags.hazel === 'told';
    if (scene === 's10-lanterns' && c.flags.keptStone) return 's10-lanterns-kept';
    if (scene === 's10-night' && told) return 's10-night-told';
    if (scene === 's10-letter' && told) return 's10-letter-told';
    if (scene === 's10-foot-msc') return s10FootScene(w, c);
    return scene;
  },
};

const S9: StoryRule = {
  id: 's9',
  // Hazel's second evening home, and only once the stone has been unmade.
  opens: (w, c) =>
    c.chapter === 11 &&
    !c.flags.keptStone &&
    c.openedMs !== null &&
    w.timeMs >= nextDusk(nextDusk(c.openedMs)),
  closes: (_w, c) => Boolean(c.flags.keptStone),
  adjust: (w, c, st) => {
    // An ignored S9 never holds chapter 11: still on step 1 or 2 at the dusk after
    // threeFriends (and after S9 opened), c11-close plays, c11-gate is skipped, and S9
    // jumps to its dawn gate scene.
    if (st.step >= 2) return;
    // Waiting at the gate for step 2's dusk: that dusk is s9-ask, not a jump.
    if (seen(c, 's9-ask')) return;
    if (st.step === 1 && (st.stage === 'check' || st.stage === 'done') && c.chapter === 11) return;
    const since = Math.max(c.goalMetMs ?? Infinity, st.openedMs);
    if (c.chapter >= 12 || (c.chapter === 11 && w.timeMs >= nextDusk(since))) {
      st.step = 2;
      st.stage = 'check';
      st.pending = null;
      st.acted = false;
      c.flags.s9Jumped = true;
    }
  },
  before: (_w, c, i) => (i === 1 && c.flags.millLetter === 'kept' ? ['s13-letter-given'] : []),
  gate: (_w, c, _st, i) => i !== 1 || c.flags.millLetter !== 'kept' || seen(c, 's13-letter-given'),
  auto: (w, c, st, i) => {
    // Step 2: the next dusk, offered only once threeFriends is met.
    if (i === 1)
      return c.goalMetMs !== null && w.timeMs >= nextDusk(Math.max(st.sinceMs, c.goalMetMs));
    // Step 3: chapter 12's first light.
    if (i === 2) return c.chapter >= 12;
    return false;
  },
  autoOnly: [1, 2],
  variant: (_w, c, scene) =>
    scene === 's9-gate' && familyCount(c) >= 2 ? 's9-gate-family' : scene,
};

/** In the order they are stepped. */
const RULES: StoryRule[] = [
  S5,
  S27,
  S28,
  S10,
  S9,
  ...EARLY_RULES,
  ...MID_RULES,
  ...LATE_RULES,
  ...EXPANSION_RULES,
];
const RULE_BY_ID = new Map(RULES.map((r) => [r.id, r]));

/** The stories the runner drives, by quest id. */
export const RUNNER_STORIES = RULES.map((r) => r.id);

export function sideState(c: CampaignState, id: string): SideStoryState | undefined {
  return c.side[id];
}

export function sideOpen(c: CampaignState, id: string): boolean {
  return c.side[id]?.status === 'open';
}

function variantOf(world: World, c: CampaignState, rule: StoryRule, scene: string): string {
  const chosen = rule.variant?.(world, c, scene) ?? scene;
  // A variant the scripts have not written yet falls back to the scene as written.
  return sceneById(chosen) ? chosen : scene;
}

/** A story or fun quest by id: its state and rule, whichever store holds it. */
function lookup(c: CampaignState, id: string): { st: SideStoryState; rule: StoryRule } | null {
  const rule = RULE_BY_ID.get(id);
  if (rule) {
    const st = c.side[id];
    return st ? { st, rule } : null;
  }
  const st = c.fun[id];
  const quest = sideStory(id);
  return st && quest ? { st, rule: funRuleFor(quest) } : null;
}

const FUN_RULES = new Map<string, StoryRule>();
function funRuleFor(quest: Quest): StoryRule {
  let rule = FUN_RULES.get(quest.id);
  if (!rule) {
    rule = isLangQuestCode(quest.code) ? langRule(quest) : funRule(quest);
    FUN_RULES.set(quest.id, rule);
  }
  return rule;
}

/** The fun quests that are open or done, for the journal. */
export function funQuestIds(c: CampaignState): string[] {
  return Object.keys(c.fun);
}

/** Can the journal offer step `st.step` as an action now. */
export function sideActable(world: World, c: CampaignState, id: string): boolean {
  const found = lookup(c, id);
  if (!found) return false;
  const { st, rule } = found;
  if (st.status !== 'open' || st.stage !== 'check' || st.acted) return false;
  if ((rule.autoOnly ?? []).includes(st.step)) return false;
  return rule.canAct?.(world, c, st, st.step) ?? true;
}

/** The Keeper does the current step (the journal's button). */
export function sideAct(world: World, c: CampaignState, id: string): void {
  if (sideActable(world, c, id)) lookup(c, id)!.st.acted = true;
}

/**
 * Chapter 10's opening waits for the three nights before the Long Night (S23's window,
 * and S6's and S14's): three story dawns after c9-close, and longer while S23 is still
 * moving, so an ignored S23 lapses and a played one is never cut off.
 */
export function sideHoldsOpening(world: World, c: CampaignState): boolean {
  if (c.chapter !== 10) return false;
  const closed = seenAt(c, 'c9-close');
  if (closed === null) return false;
  if (world.timeMs < nextDawn(closed) + (STORY.nightsBeforeLongNight - 1) * STORY.dayMs)
    return true;
  const s23 = c.side.s23;
  if (s23?.status !== 'open') return false;
  // Its last morning plays before c10-open; otherwise it lapses after two idle days.
  return s23.step >= 13 || world.timeMs < s23.sinceMs + 2 * STORY.dayMs;
}

/**
 * A chapter has begun and its opening is next: nothing else starts first, unless a story
 * holds that opening on purpose (S23's nights before c10-open, S9's dawn gate before
 * chapter 12), when those stories play in the gap as they always have.
 */
function openingDue(world: World, c: CampaignState): boolean {
  if (c.storyline || c.step !== 0 || c.chapter < 1 || c.chapter > 12) return false;
  const def = CHAPTERS.find((ch) => ch.n === c.chapter);
  if (!def || seen(c, def.opening)) return false;
  if (sideHoldsOpening(world, c)) return false;
  return !(c.chapter === 12 && sideOpen(c, 's9'));
}

/** A rule file asked the chapter machine to wait (the notes' "hold chapter N" rules). */
export function sideHolds(world: World, c: CampaignState, what: 'next' | 'close'): boolean {
  return RULES.some((rule) => {
    const st = c.side[rule.id];
    if (!st || st.status !== 'open') return false;
    const hold = what === 'next' ? rule.holdsNext : rule.holdsClose;
    return hold?.(world, c, st) ?? false;
  });
}

/** A race was entered: S10's second wish. */
export function noteSideRace(c: CampaignState): void {
  const st = c.side.s10;
  if (st?.status === 'open' && st.step === 1 && st.stage === 'check') st.acted = true;
}

/**
 * A Keeper command may be the very thing an open step waits for (a talk with the person
 * named, a visit, a tap on a story prop). Called from applyCommand for every command.
 */
export function noteSideCommand(world: World, c: CampaignState, cmd: Command): void {
  for (const id of [...RULES.map((r) => r.id), ...Object.keys(c.fun)]) {
    const found = lookup(c, id);
    if (!found) continue;
    const { st, rule } = found;
    if (st.status !== 'open' || st.stage !== 'check' || st.acted) continue;
    const step = sideStory(id)?.steps[st.step];
    if (!step) continue;
    rule.note?.(world, c, st, st.step, cmd);
    if (!st.acted && commandMeets(step.check, cmd, world)) st.acted = true;
  }
}

/** Advance one story by at most one queued scene. `store` is c.side or c.fun. */
function stepOne(
  world: World,
  c: CampaignState,
  rule: StoryRule,
  quest: Quest,
  events: SimEvent[],
  store: Record<string, SideStoryState> = c.side,
): void {
  let st = store[rule.id];
  if (!st) {
    if (!rule.opens(world, c)) return;
    st = {
      status: 'open',
      step: 0,
      stage: 'wait',
      pending: null,
      openedMs: world.timeMs,
      sinceMs: world.timeMs,
      acted: false,
    };
    store[rule.id] = st;
    if (rule.id === 's27') c.flags['s27-sold'] = collectorRoute(c);
    events.push({ kind: 'sideStory', story: rule.id, status: 'open' });
  }
  if (st.status !== 'open') return;
  if (rule.closes?.(world, c, st)) {
    st.status = 'closed';
    events.push({ kind: 'sideStory', story: rule.id, status: 'closed' });
    return;
  }
  rule.adjust?.(world, c, st);
  const now = world.timeMs;
  const free = () => c.queue.length === 0;
  // A few transitions per tick; stop once something is queued.
  for (let guard = 0; guard < 6; guard++) {
    const step = quest.steps[st.step];
    if (st.stage === 'wait' && step) {
      // A step's scene is something new: it waits out the breather after another story's
      // scene (review 2026-10-24, item 4); this story's own next beat does not.
      // Scenes queued before the step for it (another story's letter) count as its own.
      const pre = rule.before?.(world, c, st.step) ?? [];
      if (sideResting(world, c, [rule.id, ...pre.map(sceneOwner)]) || openingDue(world, c)) return;
      // Scenes due before the step come first: its gate may wait on one of them.
      const extra = pre.filter((s) => !seen(c, s));
      if (extra.length > 0) {
        for (const s of extra) queueScene(c, s);
        return;
      }
      if (!(rule.gate?.(world, c, st, st.step) ?? true)) return;
      const id = variantOf(world, c, rule, step.scene.id);
      st.stage = 'scene';
      st.pending = id;
      st.sinceMs = now;
      if (queueScene(c, id)) return;
      continue;
    }
    if (st.stage === 'scene') {
      if (st.pending && c.queue.includes(st.pending)) return;
      // Scenes due straight after the step's scene (a letter in a coat, a stowaway).
      const extra = (rule.after?.(world, c, st.step) ?? []).filter((s) => !seen(c, s));
      if (extra.length > 0) {
        if (!free()) return;
        for (const s of extra) queueScene(c, s);
        st.pending = extra[extra.length - 1]!;
        return;
      }
      st.stage = 'check';
      st.pending = null;
      st.sinceMs = now;
      st.acted = false;
      continue;
    }
    if (st.stage === 'check' && step) {
      if (
        !st.acted &&
        !(rule.auto?.(world, c, st, st.step) ?? false) &&
        !watchCheck(world, c, st, step.check)
      )
        return;
      if (step.done) {
        if (!free()) return;
        const id = variantOf(world, c, rule, step.done.id);
        st.stage = 'done';
        st.pending = id;
        st.sinceMs = now;
        if (queueScene(c, id)) return;
        continue;
      }
      st.stage = 'done';
      st.pending = null;
      continue;
    }
    if (st.stage === 'done') {
      if (st.pending && c.queue.includes(st.pending)) return;
      st.step += 1;
      st.pending = null;
      st.sinceMs = now;
      st.acted = false;
      st.stage = st.step < quest.steps.length ? 'wait' : 'complete';
      continue;
    }
    if (st.stage === 'complete') {
      if (st.pending === null) {
        if (!(rule.completeGate?.(world, c, st) ?? true) || sideResting(world, c, [rule.id]))
          return;
        const extra = (rule.before?.(world, c, quest.steps.length) ?? []).filter(
          (s) => !seen(c, s),
        );
        if (extra.length > 0) {
          for (const s of extra) queueScene(c, s);
          return;
        }
        const id = variantOf(world, c, rule, quest.complete.id);
        st.pending = id;
        if (queueScene(c, id)) return;
      }
      if (st.pending && c.queue.includes(st.pending)) return;
      const coda = (rule.after?.(world, c, quest.steps.length) ?? []).filter((s) => !seen(c, s));
      if (coda.length > 0) {
        if (!free()) return;
        for (const s of coda) queueScene(c, s);
        st.pending = coda[coda.length - 1]!;
        return;
      }
      st.status = 'done';
      if (quest.sets) Object.assign(c.flags, quest.sets);
      grantRewards(world, c, quest, events);
      events.push({ kind: 'sideStory', story: rule.id, status: 'done' });
      return;
    }
    return;
  }
}

/** The first spring morning after the ending: Spindle's egg sac hatches (S27). */
function stepPostGame(world: World, c: CampaignState): void {
  if (!postGameMorning(world, c) || c.queue.length > 0 || !c.flags.s27Done) return;
  if (seen(c, 's27-spring') || seen(c, 's27-spring-wisp')) return;
  queueScene(c, c.flags['s27-carrier'] === 'wisp' ? 's27-spring-wisp' : 's27-spring');
}

/** The campaign's own stories, which the chapter machine waits on: always first. */
const SPINE = new Set(['s5', 's27', 's28', 's10', 's9']);

/**
 * Who gets the next free slot (review 2026-10-24, item 4). With a breather between scenes
 * only one new step scene starts at a time, so a fixed order would starve the stories at
 * the end of the list. The campaign's own stories go first (and S23 while the nights before
 * the Long Night hold c10-open); then stories mid-step, which only finish what they began;
 * then stories waiting to start a step, longest wait first; then the unopened, in order.
 */
function stepOrder(world: World, c: CampaignState): StoryRule[] {
  const spine = (r: StoryRule) => SPINE.has(r.id) || (r.id === 's23' && sideHoldsOpening(world, c));
  const key = (r: StoryRule): number => {
    const st = c.side[r.id];
    if (spine(r)) return -Infinity;
    if (!st) return Infinity;
    return st.stage === 'wait' ? st.sinceMs : -1e15;
  };
  return RULES.map((r, i) => ({ r, i, k: key(r) }))
    .sort((a, b) => a.k - b.k || a.i - b.i)
    .map((x) => x.r);
}

/** Once a sim second, after the chapter machine. */
export function stepSideStories(world: World, c: CampaignState, events: SimEvent[]): void {
  stepPostGame(world, c);
  const ctx = { matureContent: world.settings.matureContent, learningGrove: world.edu !== null };
  for (const rule of stepOrder(world, c)) {
    const quest = sideStory(rule.id);
    // The Mature content setting gates side stories like every other quest: a Learning
    // Grove save sees only 'all' (S23 is 'main'), and a 'teen' or 'adult' story waits for
    // the setting. Lowering it only pauses a story; its progress is kept.
    if (quest && audienceAllowed(quest.audience, ctx)) stepOne(world, c, rule, quest, events);
  }
  stepFunQuests(world, c, events);
}

/**
 * The fun quests: the open ones step like any story; a new one is offered only when
 * none is open, the queue is empty, and the chapter has had its first story day.
 */
function stepFunQuests(world: World, c: CampaignState, events: SimEvent[]): void {
  let open = 0;
  let lastOpened = -Infinity;
  // Chapters 9 to 11 belong to the campaign: no fun quest moves at all, not even a done
  // scene or a coda of one opened earlier (CLAUDE.md; review 2026-10-24, item 7).
  const blocked = funQuestBlocked(c.chapter);
  for (const [id, st] of Object.entries(c.fun)) {
    const quest = sideStory(id);
    const lang = !quest || isLangQuestCode(quest.code);
    if (!lang) lastOpened = Math.max(lastOpened, st.openedMs);
    if (st.status === 'open' && !lang) open += 1;
    if (quest && (lang || !blocked)) stepOne(world, c, funRuleFor(quest), quest, events, c.fun);
  }
  // The language courses (CV3, Learning Grove only) offer their next quest on their own.
  if (world.edu && c.queue.length === 0) {
    for (const id of langQuestIds()) {
      const quest = sideStory(id);
      if (!quest || c.fun[id]) continue;
      const rule = funRuleFor(quest);
      if (rule.opens(world, c)) stepOne(world, c, rule, quest, events, c.fun);
    }
  }
  if (blocked || open >= FUN.maxOpen || resting(world, c) || openingDue(world, c)) return;
  if (c.openedMs === null || world.timeMs < c.openedMs + FUN.offerAfterMs) return;
  // Offers never stack: one fun quest opening keeps the next away for a while.
  if (world.timeMs < lastOpened + FUN.offerGapMs) return;
  for (const quest of funQuests()) {
    if (c.fun[quest.id]) continue;
    const rule = funRuleFor(quest);
    if (!rule.opens(world, c)) continue;
    stepOne(world, c, rule, quest, events, c.fun);
    return;
  }
}

/** World side effects of side-story scenes (the buy-back lives in campaign.ts). */
export function sideSceneDone(
  world: World,
  c: CampaignState,
  scene: string,
  events: SimEvent[] = [],
): void {
  for (const rule of RULES)
    if (c.side[rule.id]?.status === 'open') rule.sceneDone?.(world, c, scene, events);
  if (scene === 's6-complete') c.friendship.ember = (c.friendship.ember ?? 0) + STORY.s6Friendship;
  if (scene === 'c10-bank-wisp' && wispSaved(c) && !c.flags.wispHome) {
    // Wisp, who unmade the stone, settles under the cottage step as a stray you can take in.
    c.flags.wispHome = true;
    withRng(world, (rng) => {
      const wisp = createEgg(newId(world, 'nub'), { ...STORY.wispHome }, rng, 'plain');
      wisp.name = SPEAKERS.wisp?.name ?? STORY_TEXT.wispName;
      hatch(wisp, [], world.timeMs);
      wisp.stage = 'adult';
      wisp.stageMs = 0;
      wisp.shadow = true;
      wisp.trust = 30;
      world.strays.push({ nubbin: wisp, leftAtMs: world.timeMs, returnsAtMs: world.timeMs });
    });
  }
  if (scene === 's5-gift') {
    // Fossil's secret wish: the youngest Nubbin's Stamina grade goes up one, for good.
    const youngest = world.nubbins
      .filter((n) => n.id !== c.mossId && n.id !== c.sableId && n.stage !== 'egg')
      .sort((a, b) => a.ageMs - b.ageMs)[0];
    if (youngest) {
      youngest.stats.stamina.grade = nextGrade(youngest.stats.stamina.grade);
      youngest.gradeUpgrades.stamina = (youngest.gradeUpgrades.stamina ?? 0) + 1;
    }
  }
  if (scene === 's27-letgo') {
    // The runner path: Nine arrives at the gate as a grey stray you can take in.
    const name =
      typeof c.flags['s27-nine-name'] === 'string' && c.flags['s27-nine-name']
        ? c.flags['s27-nine-name']
        : 'Tansy';
    withRng(world, (rng) => {
      const nine = createEgg(newId(world, 'nub'), { x: 0, z: 0 }, rng, 'plain');
      nine.name = name;
      hatch(nine, [], world.timeMs);
      nine.stage = 'adult';
      nine.stageMs = 0;
      nine.shadow = true;
      nine.trust = 20;
      nine.typeLean.run += 50;
      nine.stats.run.points += 300;
      world.strays.push({ nubbin: nine, leftAtMs: world.timeMs, returnsAtMs: world.timeMs });
    });
  }
}
