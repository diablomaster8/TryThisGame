/**
 * R0491 (TECH-50): the side stories as the app boots them, from the skeleton alone. Every
 * quest, step, reward and scene id is registered (offers, catch-up, the save's queue check
 * and the journal's goals all work), but each scene has no lines until its file's text chunk
 * loads (`loadSideText`); `sceneFor` refuses such a scene and starts the load, so the HUD's
 * next refresh plays it. Tests register the full scripts instead, and none of this runs.
 */
import type { Scene } from '../config/story';
import type { Quest } from '../content/types';
import { loadOnce } from './load-once';
import {
  SIDE_STORY_FILES,
  type SideSkeleton,
  type SideStoryFile,
  type SkeletonScene,
} from './side-story-files';
import { sideRegistry, type SideStoryContent } from './story-scenes';

const SCENE_FILE = new Map<string, SideStoryFile>();
const QUEST_FILE = new Map<string, SideStoryFile>();
/** Scene ids whose text is not loaded yet. */
const STUB_SCENES = new Set<string>();

function stubScene(s: SkeletonScene): Scene {
  const { choices, ...rest } = s;
  return {
    ...rest,
    lines: [],
    ...(choices ? { choices: choices.map((ch) => ({ ...ch, label: '' })) } : {}),
  };
}

/** Register every side story from the skeleton. Does nothing once any are registered. */
export function registerSideSkeleton(skeleton: SideSkeleton): void {
  const reg = sideRegistry();
  if (reg.quests.length) return;
  for (const file of Object.keys(SIDE_STORY_FILES) as SideStoryFile[]) {
    const part = skeleton[file];
    if (!part) continue;
    const stub = (s: SkeletonScene, q?: Quest): Scene => {
      const scene = stubScene(s);
      if (!reg.sceneById.has(s.id)) {
        STUB_SCENES.add(s.id);
        SCENE_FILE.set(s.id, file);
      }
      reg.add(scene, q);
      return scene;
    };
    for (const k of part.quests) {
      const q: Quest = {
        ...k,
        source: '',
        trigger: { where: '', ...k.trigger },
        steps: [],
        complete: { id: k.complete.id, lines: [] },
      };
      q.steps = k.steps.map((st) => ({
        id: st.id,
        goal: st.goal,
        hint: '',
        check: st.check,
        ...(st.area ? { area: st.area } : {}),
        scene: stub(st.scene, q),
        ...(st.done ? { done: stub(st.done, q) } : {}),
      }));
      q.complete = stub(k.complete, q);
      reg.quests.push(q);
      reg.questById.set(q.id, q);
      QUEST_FILE.set(q.id, file);
      for (const r of q.rewards) reg.rewardById.set(r.id, { quest: q.id, reward: r });
    }
    for (const s of part.variants) stub(s);
  }
}

/** Put a loaded file's full scripts in place of its skeleton (quest objects keep their identity). */
function fillSideText(content: SideStoryContent): void {
  const reg = sideRegistry();
  const swap = (s: Scene | undefined): void => {
    if (s && STUB_SCENES.delete(s.id)) reg.sceneById.set(s.id, s);
  };
  for (const full of content.quests) {
    const q = reg.questById.get(full.id);
    if (q) Object.assign(q, full);
    for (const step of full.steps) {
      swap(step.scene);
      swap(step.done);
    }
    swap(full.complete);
    if (full.audience === 'all')
      for (const [key, text] of Object.entries(full.childLines ?? {}))
        reg.childLines.set(key, text);
  }
  for (const s of content.variants) swap(s);
}

const SIDE_TEXT = new Map<SideStoryFile, () => Promise<void>>();
/** When a failed text fetch may be tried again (the HUD asks every 200 ms). */
const retryAt = new Map<SideStoryFile, number>();
const RETRY_MS = 5000;

function loadSideFile(file: SideStoryFile): Promise<void> {
  let load = SIDE_TEXT.get(file);
  if (!load) {
    load = loadOnce(() =>
      SIDE_STORY_FILES[file]().then(fillSideText, (e: unknown) => {
        retryAt.set(file, Date.now() + RETRY_MS);
        throw e;
      }),
    );
    SIDE_TEXT.set(file, load);
  }
  return load();
}

/** Whether scene `id` is a side-story scene whose text has not loaded yet. */
export function sideTextPending(id: string): boolean {
  return STUB_SCENES.has(id);
}

/**
 * Load the text chunks for these quest or scene ids (unknown and loaded ones are skipped).
 * Boot awaits it for the quests a save has under way and its queued scenes; offers prefetch.
 */
export function loadSideText(ids: Iterable<string>): Promise<void> {
  const files = new Set<SideStoryFile>();
  for (const id of ids) {
    const q = sideRegistry().questById.get(id);
    const scene = QUEST_FILE.has(id) && q ? q.complete.id : id;
    const file = SCENE_FILE.get(scene);
    if (file && STUB_SCENES.has(scene)) files.add(file);
  }
  return Promise.all([...files].map(loadSideFile)).then(() => undefined);
}

/** `sceneFor`'s fail-safe: start the scene's text load, unless one failed moments ago. */
export function wantSideText(id: string): void {
  const file = SCENE_FILE.get(id);
  if (!file || (retryAt.get(file) ?? 0) > Date.now()) return;
  loadSideFile(file).catch(() => undefined);
}
