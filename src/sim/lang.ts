/**
 * The Learning Grove's language courses (CV3): Ori's Hebrew (LH1–LH6) and Hana's Japanese
 * (LJ1–LJ6). Their scripts arrive with the edu chunk and register here. The quests run on
 * the side-story step machine (state in `campaign.fun`) under `langRule`, which lets them
 * open, step and finish only in a Learning Grove save: Nova's postcard starts a course,
 * the first quest opens straight away, and each next one opens on a morning after the last.
 *
 * Words: every scene the child sees counts each course word in it as heard, a tap on a word
 * counts as heard, and tracing it or picking it in a choice counts as used. A learned word
 * (used, or heard often enough) makes the Nubbins near the Keeper react when it comes up.
 */
import { LANG } from '../config/tuning';
import type { LanguageCourse, Quest, VocabItem } from '../content/types';
import { react } from './behavior';
import { bare, scriptRuns, wordsInLine } from './lang-text';
import { isMorning, type StoryRule } from './side-rule-kit';
import { queueScene } from './story-state';
import type { CampaignState, LangCourseId, LangGesture, Reaction, SimEvent, World } from './types';

const COURSES: LanguageCourse[] = [];
const WORDS = new Map<string, VocabItem>();
/** Bare native (and kanji) forms → word id, for finding words in a line. */
const NATIVES = new Map<string, string>();
const COURSE_OF_QUEST = new Map<string, LanguageCourse>();
const FRAMES: { before: string; after: string; id: string }[] = [];

/** Register the courses and their quests' codes. Safe to repeat. */
export function registerLangCourses(courses: LanguageCourse[]): void {
  if (COURSES.length) return;
  COURSES.push(...courses);
  for (const course of courses) {
    for (const code of course.quests) COURSE_OF_QUEST.set(code.toLowerCase(), course);
    for (const w of course.vocab) {
      WORDS.set(w.id, w);
      // A frame with a blank ("わたしは ___ です") matches any one word in the blank.
      const [before, after] = w.native.split('___');
      if (after !== undefined) FRAMES.push({ before: bare(before!), after: bare(after), id: w.id });
      // Two readings ("よん / し") are each the word.
      else for (const form of w.native.split(' / ')) NATIVES.set(bare(form), w.id);
      if (w.lang === 'ja' && w.plain) NATIVES.set(bare(w.plain), w.id);
    }
  }
}

export function langCourses(): readonly LanguageCourse[] {
  return COURSES;
}

export function langCourse(id: LangCourseId): LanguageCourse | undefined {
  return COURSES.find((c) => c.id === id);
}

export function langWord(id: string): VocabItem | undefined {
  return WORDS.get(id);
}

export function isLangQuestCode(code: string): boolean {
  return /^L[HJ]\d+$/.test(code);
}

/** The course words a line uses, by id. */
export function langWordsIn(text: string): string[] {
  const ids = wordsInLine(text, NATIVES);
  for (const f of FRAMES) {
    for (const run of scriptRuns(text)) {
      const t = bare(run.text).split(' ');
      if (t.some((w, i) => w === f.before && t[i + 2] === f.after)) ids.push(f.id);
    }
  }
  return ids;
}

// ------------------------------------------------------------------ the quests

/** The quest before `quest` in its course, or null for the first. */
function previous(quest: Quest): string | null {
  const course = COURSE_OF_QUEST.get(quest.id);
  if (!course) return null;
  const i = course.quests.indexOf(quest.code);
  return i > 0 ? course.quests[i - 1]!.toLowerCase() : null;
}

/** Whether `quest` may open now: Learning Grove, course started, the one before done. */
export function langQuestOpens(world: World, c: CampaignState, quest: Quest): boolean {
  const course = COURSE_OF_QUEST.get(quest.id);
  if (!world.edu || !course || !world.edu.courses[course.id]) return false;
  const prev = previous(quest);
  if (prev === null) return true;
  const st = c.fun[prev];
  if (st?.status !== 'done') return false;
  return world.timeMs >= st.sinceMs + LANG.nextQuestAfterMs && isMorning(world.timeMs);
}

/** A language quest's rule: nothing moves outside a Learning Grove save. */
export function langRule(quest: Quest): StoryRule {
  const edu = (world: World): boolean => world.edu !== null;
  return {
    id: quest.id,
    opens: (w, c) => langQuestOpens(w, c, quest),
    gate: (w) => edu(w),
    canAct: (w) => edu(w),
    completeGate: (w) => edu(w),
    // A finished tracing game meets the step it was opened for.
    note: (_w, _c, st, _i, cmd) => {
      if (cmd.kind === 'langTraced' && cmd.quest === quest.id) st.acted = true;
    },
    // Every other step is met by playing its own scene: the greeting, the bow and the
    // "oyasumi" are choices in it, and the Grove has no separate Say action (review
    // 2026-10-21, bug 8). Only a tracing step waits, for the tracing game.
    auto: (_w, _c, _st, i) => {
      const check = quest.steps[i]?.check;
      return check !== undefined && !TRACE_TARGETS[check];
    },
  };
}

/** The language quests in course order, from the registered scripts. */
export function langQuestIds(): string[] {
  return COURSES.flatMap((c) => c.quests.map((q) => q.toLowerCase()));
}

/**
 * Nova's postcard: start a course. With nothing else queued (a fresh Learning Grove, where
 * the story has only just begun), the friend's arrival and greeting are queued at once, in
 * place of Chapter 1's opening, which follows later, so the child meets Hana or Ori
 * straight away (review 2026-10-21, bug 8). Otherwise the first quest opens on the next
 * sim second as before.
 */
export function langStart(world: World, course: LangCourseId): void {
  if (!world.edu) return;
  world.edu.courses[course] = true;
  const c = world.campaign;
  const code = langCourse(course)?.quests[0]?.toLowerCase();
  const quest = code ? QUESTS.get(code) : undefined;
  const step = quest?.steps[0];
  // Before any scene has been seen, only the story's own opening can be queued: the friend
  // goes ahead of it. Later, an empty queue is the only way in.
  const fresh = c?.seen.length === 0;
  if (!c || !quest || !step || c.fun[quest.id] || (!fresh && c.queue.length > 0)) return;
  if (TRACE_TARGETS[step.check]) return;
  // The story's opening is taken out of the queue rather than kept behind the friend: the
  // chapter machine queues it again once the friend's scenes have played, so the postcard
  // opens with Ori or Hana and never replays Chapter 1 first (review 2026-10-24, item 5).
  const ahead = c.queue;
  c.queue = [];
  const queued = queueScene(c, step.scene.id);
  const done = queued && step.done && queueScene(c, step.done.id) ? step.done.id : null;
  if (!queued) {
    c.queue = ahead;
    return;
  }
  // Anything else waiting (a trigger scene) keeps its place after the friend.
  c.queue.push(...ahead.filter((id) => !/^c\d+-/.test(id)));
  c.fun[quest.id] = {
    status: 'open',
    step: 0,
    stage: done ? 'done' : 'scene',
    pending: done ?? step.scene.id,
    openedMs: world.timeMs,
    sinceMs: world.timeMs,
    acted: false,
  };
}

// ------------------------------------------------------------------ tracing

/** What a tracing step asks for: glyphs in writing order, and the word it uses, if any. */
export interface TraceTarget {
  lang: 'he' | 'ja';
  glyphs: string[];
  word?: string;
}

/** The steps whose check is a tracing game, by check string. */
export const TRACE_TARGETS: Readonly<Record<string, TraceTarget>> = {
  'lang:he:find:letters:shalom': { lang: 'he', glyphs: ['ש', 'ל', 'ו', 'ם'] },
  'lang:he:trace:alef-bet': { lang: 'he', glyphs: ['א', 'ב', 'ג', 'ד', 'ה'] },
  'lang:he:write:ori': { lang: 'he', glyphs: ['א', 'ו', 'ר', 'י'], word: 'he-ori' },
  'lang:ja:find:kana:vowels': { lang: 'ja', glyphs: ['あ', 'い', 'う', 'え', 'お'] },
  'lang:ja:trace:ka-row': { lang: 'ja', glyphs: ['か', 'き', 'く', 'け', 'こ'] },
  'lang:ja:write:hana': { lang: 'ja', glyphs: ['は', 'な'], word: 'ja-hana' },
};

/** Tracing finished in the UI: the open quest's step is met, and its word is used. */
export function langTraced(world: World, quest: string, events: SimEvent[]): void {
  const c = world.campaign;
  const st = c?.fun[quest];
  if (!world.edu || !c || !st || st.status !== 'open') return;
  const check = questSteps.get(quest)?.[st.step];
  const target = check ? TRACE_TARGETS[check] : undefined;
  if (target?.word) noteWord(world, target.word, 'used', events);
}

/** Step checks per language quest, and the quests, filled by `registerLangQuests`. */
const questSteps = new Map<string, string[]>();
const QUESTS = new Map<string, Quest>();
export function registerLangQuests(quests: Quest[]): void {
  for (const q of quests) QUESTS.set(q.id, q);
  for (const q of quests)
    questSteps.set(
      q.id,
      q.steps.map((s) => s.check),
    );
}

// ------------------------------------------------------------------ words heard and used

/** How each learned word shows, from the courses' notes. Unlisted Hebrew words: none. */
const GESTURES: Readonly<Record<string, LangGesture>> = {
  'he-shalom': 'wave',
  'he-toda': 'nod',
  'he-toda-raba': 'nod',
  'he-laila-tov': 'yawn',
  'he-kochav': 'look-up',
  'he-yareach': 'look-up',
  'he-adom': 'point',
  'he-kachol': 'point',
  'he-tsahov': 'point',
  'he-yarok': 'point',
  'he-lavan': 'point',
  'he-shachor': 'point',
  'he-katom': 'point',
  'he-sagol': 'point',
  'he-varod': 'point',
  'he-sameach': 'smile',
  'he-smecha': 'smile',
  'he-atsuv': 'droop',
  'he-atsuva': 'droop',
  'he-ayef': 'yawn',
  'he-ayefa': 'yawn',
};

/** The face each gesture wears until the renderers draw the gesture itself. */
const GESTURE_FACE: Readonly<Record<LangGesture, Reaction>> = {
  wave: 'happy',
  bow: 'love',
  nod: 'love',
  yawn: 'dizzy',
  'look-up': 'surprised',
  smile: 'happy',
  droop: 'sad',
  point: 'surprised',
};

/** A learned word's gesture: Hebrew from the table; every Japanese word gets a bow. */
export function gestureFor(id: string): LangGesture | null {
  const w = WORDS.get(id);
  if (!w) return null;
  return w.lang === 'ja' ? 'bow' : (GESTURES[id] ?? null);
}

export function wordLearned(world: World, id: string): boolean {
  const s = world.edu?.words[id];
  return s !== undefined && (s.used > 0 || s.heard >= LANG.learnedAfterHeard);
}

/** Count a word heard or used; a learned word heard makes nearby Nubbins react. */
export function noteWord(
  world: World,
  id: string,
  how: 'heard' | 'used',
  events: SimEvent[],
): void {
  if (!world.edu || !WORDS.has(id)) return;
  const s = (world.edu.words[id] ??= { heard: 0, used: 0 });
  s[how] += 1;
  if (how === 'heard' && wordLearned(world, id)) reactTo(world, id, events);
}

/** Every course word in a scene the child just saw, heard once each. */
export function noteSceneWords(
  world: World,
  lines: readonly { text: string }[],
  picked: string | null,
  events: SimEvent[],
): void {
  if (!world.edu || COURSES.length === 0) return;
  const heard = new Set<string>();
  for (const l of lines) for (const id of langWordsIn(l.text)) heard.add(id);
  for (const id of heard) noteWord(world, id, 'heard', events);
  if (picked) for (const id of langWordsIn(picked)) noteWord(world, id, 'used', events);
}

function reactTo(world: World, id: string, events: SimEvent[]): void {
  const gesture = gestureFor(id);
  if (!gesture) return;
  const k = world.keeper.pos;
  const near = world.nubbins
    .filter((n) => n.stage === 'child' || n.stage === 'adult')
    .map((n) => ({ n, d: Math.hypot(n.pos.x - k.x, n.pos.z - k.z) }))
    .filter((e) => e.d <= LANG.reactRadius)
    .sort((a, b) => a.d - b.d)
    .slice(0, LANG.reactMax);
  for (const { n } of near) {
    react(n, GESTURE_FACE[gesture], world.timeMs, events);
    events.push({ kind: 'langReact', nubbinId: n.id, word: id, gesture });
  }
}
