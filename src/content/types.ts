/**
 * Script data for quests, side stories, story lines and readers.
 *
 * Pure data: no DOM, no Three.js, no sim calls. Dialogue reuses the campaign's own
 * Line / Choice / Scene shapes from config/story.ts so the existing dialogue box can
 * play every scene here unchanged.
 *
 * Conventions
 * - Ids are kebab-case and globally unique: `<quest id>-<scene name>`, e.g. `q01-intro`.
 * - `who` in a Line is a speaker id: either one of the campaign's SPEAKERS (you,
 *   narrator, moss, sable, corvin, hazel, fern, marina, sparks, clover, pixel, luna,
 *   ember, byte, dusty, nova) or an id declared in the file's `speakers` list.
 * - `check` strings name a goal the sim must implement later. They are written as
 *   `verb:object[:detail]`, e.g. `craft:shrubbery`, `karate:win:dented-helm`,
 *   `talk:mr-tweed`, `place:decor:model-castle`, `minigame:score:meerca-chase:500`.
 *   A list of every check used lives in each file's exported `CHECKS` array.
 * - Child mode (the Learning Grove): `childLines` replaces a line's text by key
 *   `"<scene id>#<line index>"` (0-based). Only audience 'all' appears there; quests
 *   with audience 'main', 'teen' or 'adult' never do, so they need no childLines.
 * - Flags set by choices are plain strings (`'sable-wisp': 'spared'`). Story lines
 *   prefix them with their line id (`mv-cw`, `np-`, `s2-`).
 */
import type { Choice, Line, Scene } from '../config/story';

/**
 * Who a quest is for.
 * - 'all': the Learning Grove and the main game.
 * - 'main': the main game only (never the Learning Grove).
 * - 'teen': 13+. Main game only, behind the content setting.
 * - 'adult': 18+. Main game only, behind the content setting, which is off by default.
 */
export type Audience = 'all' | 'main' | 'teen' | 'adult';

export interface Speaker {
  id: string;
  /** In-game name (original, safe to ship). */
  name: string;
  kind: 'keeper' | 'nubbin' | 'other';
  /** The source character this speaker is based on, for reference only. */
  basedOn?: string;
}

export interface QuestStep {
  id: string;
  /** Journal goal text. */
  goal: string;
  hint: string;
  /** What completes the step (see conventions above). */
  check: string;
  /** Scene played when the step begins. */
  scene: Scene;
  /** Optional short scene played when the step is completed. */
  done?: Scene;
}

export interface Reward {
  id: string;
  kind: 'cosmetic' | 'feature' | 'item' | 'decor' | 'title' | 'flag';
  label: string;
  description: string;
}

export interface Quest {
  id: string;
  /** Number in its list (Q1–Q65, S1–S10, NP1–NP13, IM1…). */
  code: string;
  title: string;
  /** Source work, e.g. "Monty Python and the Holy Grail: the Black Knight". */
  source: string;
  audience: Audience;
  /** Where and when the quest offers itself. */
  trigger: { where: string; when: string };
  /** Codes of quests or flags that must be complete first. */
  requires?: string[];
  speakers: Speaker[];
  steps: QuestStep[];
  /** Scene played when the whole quest finishes. */
  complete: Scene;
  rewards: Reward[];
  /** Flags set when the quest completes (choices may set more). */
  sets?: Record<string, number | boolean | string>;
  /** Learning Grove replacements: "<scene id>#<line index>" -> new text. */
  childLines?: Record<string, string>;
  /** Free-text notes for the implementer (staging, timing, art needs). */
  notes?: string;
}

/** A reading service: the fortune teller, the doctor, the Island Mystic and so on. */
export interface Reading {
  id: string;
  /**
   * When this reading applies, as `field:value` terms joined by `&`, e.g.
   * `band:sun&type:run`, `personality:shy`, `rebirth:likely`, `trust:<15`,
   * `family:digi`, `stage:child`, `any`. The reader picks the most specific match,
   * then a seeded random one among ties.
   */
  when: string;
  text: string;
  /** Learning Grove version, when the main text is not suitable. */
  childText?: string;
}

export interface Reader {
  id: string;
  name: string;
  where: string;
  /** Lines before the reading. */
  intro: Line[];
  readings: Reading[];
  /** Lines after the reading. */
  outro: Line[];
}

/** Result text for screens that report an outcome (races, karate, expeditions…). */
export interface ResultLine {
  id: string;
  /** Same condition grammar as Reading.when, e.g. `place:1`, `margin:<1s`, `shells:>100`. */
  when: string;
  text: string;
  childText?: string;
}

export interface ResultSet {
  id: string;
  screen: string;
  lines: ResultLine[];
}

// ---------------------------------------------------------------- educational versions
/**
 * The Learning Grove's language switch. Every story scene can have an educational
 * version per band; the sim plays it in place of the main scene with the same id.
 * - 'sprout' (ages 3–6): read aloud by a grown-up. Very short lines, one idea each.
 * - 'reader' (ages 7–10): read by the child. Richer, with real curriculum woven in.
 * See EDU-STYLE.md.
 */
export type EduBand = 'sprout' | 'reader';

export type EduDomain =
  | 'maths'
  | 'literacy'
  | 'science'
  | 'social-studies'
  | 'sel'
  | 'music'
  | 'art'
  | 'health';

export interface LessonOption {
  label: string;
  /** The answer the lesson is teaching. Every option still continues the story. */
  best?: boolean;
  /** What the characters say back. A wrong answer gets a kind, teaching reply. */
  reply: Line[];
}

/** One learning beat, played inside a scene. Never blocks the story, never fails. */
export interface Lesson {
  /** `<scene id>-l<n>`, e.g. `sprout:c1-letter-l1`. */
  id: string;
  domain: EduDomain;
  /** The skill in plain words, e.g. "count to 5", "why winter nights are long". */
  skill: string;
  /** A code from the approved list in EDU-STYLE.md only, when one fits. */
  standard?: string;
  /** ask = a question with options · notice = a fact a character shares (tap to go on) · do = an action in the Grove. */
  kind: 'ask' | 'notice' | 'do';
  /** Index of the scene line after which the beat plays. */
  after: number;
  /** ask: the question line(s), then the options. */
  prompt?: Line[];
  options?: LessonOption[];
  /** do: a check string, like a quest step (`edu:count:lanterns:4`). */
  check?: string;
  /** notice / do: the lines for the beat. */
  lines?: Line[];
  /** One sentence for the grown-up progress view: what the child practised. */
  parentNote: string;
}

/**
 * The educational version of one scene. It has no scene-level `set`: the sim still applies
 * the original scene's `set` flags when it plays this version.
 */
export interface EduScene {
  /** `<band>:<original scene id>`, e.g. `reader:c4-tale`. */
  id: string;
  /** The original scene id this replaces. */
  of: string;
  band: EduBand;
  lines: Line[];
  /**
   * Choices keep the original choice ids so flags still work. A band may offer fewer;
   * `defaultChoice` names the id the sim uses for any choice this version leaves out.
   */
  choices?: Choice[];
  defaultChoice?: string;
  lessons: Lesson[];
}

/** A vocabulary word for the reader band (shown underlined; tap for the meaning). */
export interface GlossaryEntry {
  word: string;
  meaning: string;
  /** Scene id where it first appears. */
  scene: string;
}

/** Educational version of a whole quest or side story, for one band. */
export interface EduQuest {
  /** `<band>:<quest id>`. */
  id: string;
  /** Original quest id. */
  of: string;
  band: EduBand;
  title?: string;
  /** Journal text per step id, in the band's language. */
  goals: Record<string, { goal: string; hint: string }>;
  /** One per original scene (steps, done scenes, complete, variants). */
  scenes: EduScene[];
  glossary?: GlossaryEntry[];
  notes?: string;
}

/** Educational version of a slice of the campaign, for one band. */
export interface EduCampaign {
  id: string;
  band: EduBand;
  /** Chapter journal text by chapter number. */
  chapters: Record<number, { title?: string; goalText: string; hint: string }>;
  scenes: EduScene[];
  /** Ending titles and "how" text by ending id, if this slice covers endings. */
  endings?: Record<string, { title: string; how: string }>;
  glossary?: GlossaryEntry[];
  notes?: string;
}

// ---------------------------------------------------------------- language questlines
/** A word or phrase taught in a language questline (Learning Grove only). */
export interface VocabItem {
  /** `<lang>-<slug>`, e.g. `he-shalom`, `ja-arigatou`. */
  id: string;
  lang: 'he' | 'ja';
  /** Native script. Hebrew with niqqud (vowel points); Japanese in kana as children learn it. */
  native: string;
  /** Hebrew without niqqud (as adults write it); Japanese with kanji where it is usual. */
  plain?: string;
  /** Latin letters: Israeli Hebrew in common transliteration; Japanese in Hepburn with macrons. */
  roman: string;
  english: string;
  /** A rough English sound-alike for a grown-up reading aloud, stress in capitals: "toe-DAH". */
  sayIt: string;
  topic: 'greetings' | 'letters' | 'numbers' | 'colours' | 'food' | 'animals' | 'family' | 'feelings' | 'nature' | 'culture';
  /** Code of the quest that first teaches it. */
  quest: string;
  /** 'both' bands, or 'reader' only. */
  band: 'both' | 'reader';
  /** Gender forms, politeness levels, spelling notes. */
  notes?: string;
  /** Clip id for a native-speaker recording, e.g. `he/shalom`. Record; don't synthesise. */
  audio: string;
}

/** One letter or kana in a script primer. */
export interface ScriptChar {
  char: string;
  name: string;
  roman: string;
  /** Final form (Hebrew) or the kanji it is often paired with, if any. */
  alt?: string;
  notes?: string;
}

/** A language questline: the quests, its teacher, its words and its script primer. */
export interface LanguageCourse {
  id: 'hebrew' | 'japanese';
  lang: 'he' | 'ja';
  title: string;
  /** Quest codes in order, e.g. LH1–LH6. */
  quests: string[];
  vocab: VocabItem[];
  script: { name: string; direction: string; chars: ScriptChar[] };
  notes: string;
}
