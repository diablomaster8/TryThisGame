/**
 * The Atlas runner (CV4) and the festivals its pages unlock (CV5). Nova's atlas holds
 * thirty-one pages; each is a line of quests played from the atlas, in any order, with
 * its progress inside the Atlas save (canon 30). Pixel's cartridges and the Multiverse
 * lines use the same runner over their own saves.
 *
 * A page plays as: each quest's step scene, then the step's goal for the Keeper to do
 * ("Do it" in the atlas, since the page's world is not the Grove's), then the step's done
 * scene, and at the end the quest's complete scene. Choices and scenes set flags in the
 * page's own progress and nowhere else. Pure functions over plain data.
 */
import type { Scene } from '../config/story';
import type { Quest } from '../content/types';
import { audienceAllowed, type AudienceContext } from './audience';
import { arcadeDone, atlasDone, type CrossSaves } from './cross-saves';
import { freshLine, type LineProgress, type QuestProgress } from './side-saves';

/** One Atlas page, Arcade cartridge or Multiverse line, as the runner sees it. */
export interface StoryLine {
  /** 'A1'..'A31', 'PA1'..'PA5'. */
  id: string;
  title: string;
  quests: Quest[];
  variants: Scene[];
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

function questState(p: LineProgress, q: Quest): QuestProgress {
  return p.quests[q.id] ?? { step: 0, stage: 'scene' };
}

function finished(p: LineProgress, q: Quest): boolean {
  return p.quests[q.id]?.stage === 'finished';
}

/** The quest playing now: the first unfinished one whose in-line requirements are met. */
export function currentQuest(line: StoryLine, p: LineProgress): Quest | null {
  const byCode = new Map(line.quests.map((q) => [q.code, q]));
  for (const q of line.quests) {
    if (finished(p, q)) continue;
    const ready = (q.requires ?? []).every((code) => {
      const needed = byCode.get(code);
      // A requirement outside this line (a Grove flag) never blocks a page.
      return !needed || finished(p, needed);
    });
    if (ready) return q;
  }
  return null;
}

/**
 * The variant written for a scene, chosen by the page's flags. Variant ids extend the
 * scene id with the value they answer (`a15-14-screen-done-reconciled` answers a flag set
 * to 'reconciled'), or with the name of a flag that is on.
 */
export function variantFor(line: StoryLine, p: LineProgress, scene: Scene): Scene {
  const prefix = `${scene.id}-`;
  const answers = new Set<string>();
  for (const [k, v] of Object.entries(p.flags)) {
    if (typeof v === 'string') answers.add(v);
    else if (v === true) answers.add(k);
  }
  for (const v of line.variants) {
    if (v.id.startsWith(prefix) && answers.has(v.id.slice(prefix.length))) return v;
  }
  return scene;
}

/** What the page shows next: a scene to play, a goal to do, or nothing (finished). */
export type LineNext =
  | { kind: 'scene'; quest: Quest; scene: Scene }
  | { kind: 'act'; quest: Quest; goal: string; hint: string }
  | { kind: 'finished' };

export function lineNext(line: StoryLine, p: LineProgress): LineNext {
  const q = currentQuest(line, p);
  if (!q) return { kind: 'finished' };
  const s = questState(p, q);
  const step = q.steps[s.step];
  if (s.stage === 'complete' || !step) {
    return { kind: 'scene', quest: q, scene: variantFor(line, p, q.complete) };
  }
  if (s.stage === 'act') return { kind: 'act', quest: q, goal: step.goal, hint: step.hint };
  if (s.stage === 'done' && step.done) {
    return { kind: 'scene', quest: q, scene: variantFor(line, p, step.done) };
  }
  return { kind: 'scene', quest: q, scene: variantFor(line, p, step.scene) };
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

/**
 * The scene `lineNext` gave has played; `choice` is the picked choice's id. Mutates only
 * the page's own progress. A scene that is not the one due is ignored.
 */
export function lineSceneDone(
  line: StoryLine,
  p: LineProgress,
  sceneId: string,
  choice: string | null,
): void {
  const next = lineNext(line, p);
  if (next.kind !== 'scene' || next.scene.id !== sceneId) return;
  const { quest: q, scene } = next;
  setFlags(p, scene.set);
  const picked = scene.choices?.find((c) => c.id === choice);
  if (picked) setFlags(p, picked.set);
  const s = questState(p, q);
  if (s.stage === 'complete' || !q.steps[s.step]) {
    setFlags(p, q.sets);
    p.quests[q.id] = { step: s.step, stage: 'finished' };
  } else if (s.stage === 'done') {
    p.quests[q.id] = nextStep(q, s);
  } else {
    p.quests[q.id] = { step: s.step, stage: 'act' };
  }
  settle(line, p);
}

/** The Keeper did the goal `lineNext` asked for. */
export function lineAct(line: StoryLine, p: LineProgress): void {
  const next = lineNext(line, p);
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

// ---------- the catalogues ----------

let atlasPages: StoryLine[] | null = null;

/** The Atlas pages, loaded on first open (their own lazy chunk). */
export async function loadAtlas(): Promise<StoryLine[]> {
  atlasPages ??= (await import('./atlas-catalogue')).ATLAS_PAGES;
  return atlasPages;
}

/**
 * Pixel's cartridges. PA1–PA5 are not scripted yet, so the shelf is empty; the save,
 * the runner and the cabinet are ready for them.
 */
export const ARCADE_CARTS: StoryLine[] = [];
