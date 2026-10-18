/**
 * The story-world runner (CV4) and the festivals the Atlas and Arcade unlock (CV5). Nova's
 * atlas holds thirty-one pages; each is a line of quests played from the atlas, in any
 * order, with its progress inside the Atlas save (canon 30). Pixel's cartridges, the
 * Multiverse lines and Neopia's lines use the same runner over their own saves.
 *
 * A line plays as: each quest's step scene, then the step's goal for the Keeper to do
 * ("Do it" on the shelf, since the line's world is not the Grove's), then the step's done
 * scene, and at the end the quest's complete scene. Choices and scenes set flags in the
 * line's own progress, and finished quests leave their reward ids there too, never in the
 * Grove (canon 21). A line may read the rest of its own side save through a `LineContext`:
 * the Multiverse endgames wait on the other lines and branch on their flags. Pure
 * functions over plain data.
 */
import type { Scene } from '../config/story';
import type { Quest } from '../content/types';
import { audienceAllowed, type AudienceContext } from './audience';
import { arcadeDone, atlasDone, type CrossSaves } from './cross-saves';
import { freshLine, type FlagValue, type LineProgress, type QuestProgress } from './side-saves';

export type LineFlags = Readonly<Record<string, FlagValue>>;

/** One Atlas page, Arcade cartridge, Multiverse line or Neopia line, as the runner sees it. */
export interface StoryLine {
  /** 'A1'..'A31', 'PA1'..'PA5', 'IM', 'E', 'NP', 'NQ-faerie'... */
  id: string;
  title: string;
  quests: Quest[];
  variants: Scene[];
  /** False for a step that does not play under these flags (a branch not taken). */
  stepLive?(stepId: string, flags: LineFlags): boolean;
  /** False for a choice not offered under these flags. */
  choiceLive?(sceneId: string, choiceId: string, flags: LineFlags): boolean;
  /** True once another line's choice has closed this one (Neopia's rival chains). */
  closed?(flags: LineFlags): boolean;
}

/** What a line may read from the rest of its side save. */
export interface LineContext {
  /** A quest code held by another line of the same save is finished there (unknown: met). */
  met(code: string): boolean;
  /** Flags from every line of the save, and any read-only facts, under this line's own. */
  flags: LineFlags;
  /**
   * The Grove's campaign and side-story flags, frozen: a story world reads them (they pick
   * its Grove variants) and never writes them.
   */
  grove: Readonly<LineFlags>;
}

/** The line's audience: its strictest quest, so a `teen` page is hidden as a whole. */
export function lineAudience(line: StoryLine): Quest['audience'] {
  const order = ['all', 'main', 'teen', 'adult'] as const;
  let worst = 0;
  for (const q of line.quests) worst = Math.max(worst, order.indexOf(q.audience));
  return order[worst]!;
}

export function lineAvailable(line: StoryLine, ctx: AudienceContext): boolean {
  return audienceAllowed(lineAudience(line), ctx);
}

function flagsOf(p: LineProgress, ctx: LineContext | undefined): LineFlags {
  return ctx ? { ...ctx.grove, ...ctx.flags, ...p.flags } : p.flags;
}

/** A line closed by another's choice is hidden, unless it was already begun. */
export function lineClosed(
  line: StoryLine,
  p: LineProgress | undefined,
  ctx?: LineContext,
): boolean {
  if (!line.closed || (p && Object.keys(p.quests).length > 0)) return false;
  return line.closed(flagsOf(p ?? freshLine(), ctx));
}

function questState(p: LineProgress, q: Quest): QuestProgress {
  return p.quests[q.id] ?? { step: 0, stage: 'scene' };
}

function finished(p: LineProgress, q: Quest): boolean {
  return p.quests[q.id]?.stage === 'finished';
}

/** The quest playing now: the first unfinished one whose requirements are met. */
export function currentQuest(line: StoryLine, p: LineProgress, ctx?: LineContext): Quest | null {
  const byCode = new Map(line.quests.map((q) => [q.code, q]));
  for (const q of line.quests) {
    if (finished(p, q)) continue;
    const ready = (q.requires ?? []).every((code) => {
      const needed = byCode.get(code);
      if (needed) return finished(p, needed);
      // Outside the line: another line of the same save when the shelf passes a context;
      // otherwise (a Grove flag) it never blocks a page.
      return ctx?.met(code) ?? true;
    });
    if (ready) return q;
  }
  return null;
}

/** Skip the steps whose branch is not taken, so the state points at a step that plays. */
function liveState(line: StoryLine, q: Quest, s: QuestProgress, flags: LineFlags): QuestProgress {
  const live = line.stepLive;
  if (s.stage !== 'scene' || !live) return s;
  let i = s.step;
  while (q.steps[i] && !live(q.steps[i]!.id, flags)) i++;
  if (i === s.step) return s;
  return q.steps[i] ? { step: i, stage: 'scene' } : { step: i, stage: 'complete' };
}

/**
 * Grove flags whose variants are named for what they bring rather than for the flag:
 * `a24-02-council-done-fern` answers s8Reunited, `pa5-01-shed-clank` answers s21Done.
 */
const GROVE_ALIASES: Record<string, readonly string[]> = {
  s1Done: ['charm', 'oak'],
  s6Done: ['ash'],
  s7Done: ['s7'],
  s8Reunited: ['fern', 'bramble'],
  s21Done: ['clank'],
  keptStone: ['kept'],
};

/** Grove flags a line answers with an `-unset` variant while the Grove has not set them. */
const GROVE_UNSET: Record<string, readonly string[]> = { A19: ['sableFirst'] };

/** How many answers a variant suffix is made of (`ran-unset` is two), or 0 if not all. */
function answeredParts(suffix: string, answers: ReadonlySet<string>): number {
  const parts = suffix.split('-');
  // best[i]: the most answers that make up parts[0..i), or -1 if they cannot.
  const best: number[] = [0, ...parts.map(() => -1)];
  for (let i = 0; i < parts.length; i++) {
    if (best[i]! < 0) continue;
    for (let j = i + 1; j <= parts.length; j++) {
      if (answers.has(parts.slice(i, j).join('-'))) best[j] = Math.max(best[j]!, best[i]! + 1);
    }
  }
  return Math.max(0, best[parts.length]!);
}

/**
 * The variant written for a scene, chosen by the line's own flags and the Grove's. Variant
 * ids extend the scene id with the value they answer (`a15-14-screen-done-reconciled`
 * answers a flag set to 'reconciled'), with the name of a flag that is on, or with several
 * of those joined (`a19-18-complete-ran-unset`); the most specific one wins. Other lines'
 * flags do not count: a value another line happens to share must not pick a variant here.
 */
export function variantFor(
  line: StoryLine,
  p: LineProgress,
  scene: Scene,
  grove: Readonly<LineFlags> = {},
): Scene {
  const prefix = `${scene.id}-`;
  const answers = new Set<string>();
  for (const flags of [grove, p.flags]) {
    for (const [k, v] of Object.entries(flags)) {
      if (typeof v === 'string') answers.add(v);
      else if (v === true) {
        answers.add(k);
        for (const alias of GROVE_ALIASES[k] ?? []) answers.add(alias);
      }
    }
  }
  if ((GROVE_UNSET[line.id] ?? []).some((k) => grove[k] === undefined || grove[k] === false)) {
    answers.add('unset');
  }
  let chosen = scene;
  let chosenParts = 0;
  for (const v of line.variants) {
    if (!v.id.startsWith(prefix)) continue;
    const parts = answeredParts(v.id.slice(prefix.length), answers);
    if (parts > chosenParts) {
      chosen = v;
      chosenParts = parts;
    }
  }
  return chosen;
}

/** The scene with only the choices its line offers under these flags. */
function shown(line: StoryLine, scene: Scene, flags: LineFlags): Scene {
  const live = line.choiceLive;
  if (!live || !scene.choices) return scene;
  const choices = scene.choices.filter((c) => live(scene.id, c.id, flags));
  return choices.length === scene.choices.length ? scene : { ...scene, choices };
}

/**
 * What the line shows next: a scene to play, a goal to do, nothing yet (its next quest
 * waits on another line), or nothing at all (finished).
 */
export type LineNext =
  | { kind: 'scene'; quest: Quest; scene: Scene }
  | { kind: 'act'; quest: Quest; goal: string; hint: string }
  | { kind: 'waiting' }
  | { kind: 'finished' };

export function lineNext(line: StoryLine, p: LineProgress, ctx?: LineContext): LineNext {
  const q = currentQuest(line, p, ctx);
  if (!q) {
    return line.quests.every((x) => finished(p, x)) ? { kind: 'finished' } : { kind: 'waiting' };
  }
  const flags = flagsOf(p, ctx);
  const s = liveState(line, q, questState(p, q), flags);
  const step = q.steps[s.step];
  const play = (scene: Scene): LineNext => ({
    kind: 'scene',
    quest: q,
    scene: shown(line, variantFor(line, p, scene, ctx?.grove), flags),
  });
  if (s.stage === 'complete' || !step) return play(q.complete);
  if (s.stage === 'act') return { kind: 'act', quest: q, goal: step.goal, hint: step.hint };
  if (s.stage === 'done' && step.done) return play(step.done);
  return play(step.scene);
}

function setFlags(p: LineProgress, set: Scene['set']): void {
  if (set) Object.assign(p.flags, set);
}

function nextStep(q: Quest, s: QuestProgress): QuestProgress {
  const step = s.step + 1;
  return step < q.steps.length ? { step, stage: 'scene' } : { step, stage: 'complete' };
}

function settle(line: StoryLine, p: LineProgress): void {
  p.done = line.quests.length > 0 && line.quests.every((q) => finished(p, q));
}

/** A finished quest's rewards, kept by id in the line's own progress, once each. */
function keepRewards(p: LineProgress, q: Quest): void {
  for (const r of q.rewards) if (!p.rewards.includes(r.id)) p.rewards.push(r.id);
}

/**
 * The scene `lineNext` gave has played; `choice` is the picked choice's id. Mutates only
 * the line's own progress. A scene that is not the one due is ignored.
 */
export function lineSceneDone(
  line: StoryLine,
  p: LineProgress,
  sceneId: string,
  choice: string | null,
  ctx?: LineContext,
): void {
  const next = lineNext(line, p, ctx);
  if (next.kind !== 'scene' || next.scene.id !== sceneId) return;
  const { quest: q, scene } = next;
  // Where the quest stands is read before this scene's flags land, as `lineNext` read it.
  const s = liveState(line, q, questState(p, q), flagsOf(p, ctx));
  setFlags(p, scene.set);
  const picked = scene.choices?.find((c) => c.id === choice);
  if (picked) setFlags(p, picked.set);
  if (s.stage === 'complete' || !q.steps[s.step]) {
    setFlags(p, q.sets);
    keepRewards(p, q);
    p.quests[q.id] = { step: s.step, stage: 'finished' };
  } else if (s.stage === 'done') {
    p.quests[q.id] = nextStep(q, s);
  } else {
    p.quests[q.id] = { step: s.step, stage: 'act' };
  }
  settle(line, p);
}

/** The Keeper did the goal `lineNext` asked for. */
export function lineAct(line: StoryLine, p: LineProgress, ctx?: LineContext): void {
  const next = lineNext(line, p, ctx);
  if (next.kind !== 'act') return;
  const q = next.quest;
  const s = questState(p, q);
  p.quests[q.id] = q.steps[s.step]?.done ? { step: s.step, stage: 'done' } : nextStep(q, s);
  settle(line, p);
}

/** Progress for a line, made on first use. */
export function lineProgress(lines: Record<string, LineProgress>, id: string): LineProgress {
  return (lines[id] ??= freshLine());
}

/** Quests finished in a line, for the page list. */
export function lineCount(line: StoryLine, p: LineProgress | undefined): [number, number] {
  const done = p ? line.quests.filter((q) => finished(p, q)).length : 0;
  return [done, line.quests.length];
}

/**
 * The context for the lines of one side save: requirements met in any of its lines, and
 * every line's flags (over `extra`, read-only facts such as the Multiverse's reflection)
 * to branch on.
 */
export function lineContext(
  lines: readonly StoryLine[],
  progress: Record<string, LineProgress>,
  extra: LineFlags = {},
  grove: Readonly<LineFlags> = {},
): LineContext {
  const known = new Map<string, { line: string; quest: string }>();
  for (const l of lines) for (const q of l.quests) known.set(q.code, { line: l.id, quest: q.id });
  const flags: Record<string, FlagValue> = { ...extra };
  for (const p of Object.values(progress)) Object.assign(flags, p.flags);
  return {
    met: (code) => {
      const at = known.get(code);
      return !at || progress[at.line]?.quests[at.quest]?.stage === 'finished';
    },
    flags,
    grove: Object.freeze({ ...grove }),
  };
}

// ---------- festivals (CV5, docs/more-stories.md "Festivals") ----------

export interface FestivalDef {
  id: string;
  /** Finishing any `need` of these lines unlocks it. */
  lines: readonly string[];
  need: number;
}

export const ATLAS_FESTIVALS: readonly FestivalDef[] = [
  { id: 'remembering', lines: ['A3', 'A5', 'A7', 'A16', 'A21', 'A23'], need: 2 },
  { id: 'voyage', lines: ['A2', 'A6', 'A9', 'A10', 'A12', 'A14', 'A19'], need: 2 },
  { id: 'power', lines: ['A1', 'A4', 'A8', 'A15', 'A20', 'A30'], need: 2 },
  { id: 'longTable', lines: ['A11', 'A13', 'A17', 'A18', 'A22'], need: 2 },
  { id: 'highScore', lines: ['PA1', 'PA2', 'PA3', 'PA4', 'PA5'], need: 2 },
];

function lineFinished(x: CrossSaves, id: string): boolean {
  return id.startsWith('PA') ? arcadeDone(x, id) : atlasDone(x, id);
}

/** Festivals the side saves have unlocked, read-only. */
export function festivalsUnlocked(x: CrossSaves): string[] {
  return ATLAS_FESTIVALS.filter(
    (f) => f.lines.filter((id) => lineFinished(x, id)).length >= f.need,
  ).map((f) => f.id);
}

// ---------- the catalogues, each its own lazy chunk ----------

let atlasPages: StoryLine[] | null = null;
let arcadeCarts: StoryLine[] | null = null;
let multiverseLines: StoryLine[] | null = null;
let neopiaLines: StoryLine[] | null = null;

/** The Atlas pages, loaded on first open. */
export async function loadAtlas(): Promise<StoryLine[]> {
  atlasPages ??= (await import('./atlas-catalogue')).ATLAS_PAGES;
  return atlasPages;
}

/** Pixel's cartridges PA1–PA5, loaded on first open of the cabinet. */
export async function loadArcade(): Promise<StoryLine[]> {
  arcadeCarts ??= (await import('./arcade-catalogue')).ARCADE_CARTS;
  return arcadeCarts;
}

/** The Multiverse's nine lines and its endgames, loaded when the rift first opens. */
export async function loadMultiverse(): Promise<StoryLine[]> {
  multiverseLines ??= (await import('./multiverse-catalogue')).MULTIVERSE_LINES;
  return multiverseLines;
}

/** Neopia's plots and quest lines, loaded when the rainbow gate first opens. */
export async function loadNeopia(): Promise<StoryLine[]> {
  neopiaLines ??= (await import('./neopia-catalogue')).NEOPIA_LINES;
  return neopiaLines;
}
