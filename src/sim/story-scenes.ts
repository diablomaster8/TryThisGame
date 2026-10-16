import { SCENES, type Line, type Scene } from '../config/story';
import type { Quest } from '../content/types';
import type { World } from './types';

/**
 * Every scene the Grove's story can queue: the campaign's, and (once registered) every
 * Grove side story's steps, done and complete scenes, and their variant scenes. `sceneFor`
 * applies the line swaps the scene notes ask for, read from flags when the scene is shown.
 */

/** The side-story scripts, loaded as their own chunk (see `loadSideStories`). */
export interface SideStoryContent {
  quests: Quest[];
  variants: Scene[];
}

/** The Grove's side stories S1–S31, by quest id ('s9'). Empty until registered. */
export const GROVE_SIDE_STORIES: Quest[] = [];

const QUEST_BY_ID = new Map<string, Quest>();

export function sideStory(id: string): Quest | undefined {
  return QUEST_BY_ID.get(id);
}

const SCENE_BY_ID = new Map<string, Scene>();
function add(s: Scene | undefined): void {
  if (s && !SCENE_BY_ID.has(s.id)) SCENE_BY_ID.set(s.id, s);
}
for (const s of SCENES) add(s);

/**
 * Add the side stories' quests, step scenes and variant scenes to the registry. The app
 * calls it (through `loadSideStories`) before a save loads, since save.ts drops queued
 * scene ids the registry does not know; tests call it straight away. Safe to repeat.
 */
export function registerSideStories(content: SideStoryContent): void {
  if (GROVE_SIDE_STORIES.length) return;
  GROVE_SIDE_STORIES.push(...content.quests);
  for (const q of content.quests) {
    QUEST_BY_ID.set(q.id, q);
    for (const step of q.steps) {
      add(step.scene);
      add(step.done);
    }
    add(q.complete);
  }
  for (const s of content.variants) add(s);
}

let loading: Promise<void> | null = null;

/** Load the side-story chunk once and register it. */
export function loadSideStories(): Promise<void> {
  loading ??= import('./side-story-content').then((m) => registerSideStories(m.SIDE_STORY_CONTENT));
  return loading;
}

export function sceneById(id: string): Scene | undefined {
  return SCENE_BY_ID.get(id);
}

function narrator(text: string): Line {
  return { who: 'narrator', text };
}

/** Swap the line whose text starts with `start`; `text` replaces the whole line. */
function swapLine(lines: Line[], start: string, text: string): Line[] {
  return lines.map((l) => (l.text.startsWith(start) ? { ...l, text } : l));
}

/** Insert `extra` after the line whose text starts with `start` (or after index `at`). */
function insertAfter(lines: Line[], at: string | number, extra: Line[]): Line[] {
  const i = typeof at === 'number' ? at : lines.findIndex((l) => l.text.startsWith(at));
  if (i < 0 || i >= lines.length) return lines;
  return [...lines.slice(0, i + 1), ...extra, ...lines.slice(i + 1)];
}

/** The scene as it should be shown now: the line swaps from the scene notes applied. */
export function sceneFor(world: World, id: string): Scene | undefined {
  const scene = SCENE_BY_ID.get(id);
  const c = world.campaign;
  if (!scene || !c) return scene;
  const f = c.flags;
  let lines = scene.lines;
  switch (id) {
    case 'c11-close':
      // The days read as the ones before s9-ask; and S8's youngest has gone home.
      if (c.seen.includes('s9-ask'))
        lines = insertAfter(lines, 0, [
          narrator('Then comes the evening Corvin asks at the gate.'),
        ]);
      if (f.s8Done)
        lines = swapLine(
          lines,
          'The thin grey Nubbin wakes',
          'Hazel’s arm is empty now. She keeps it crooked anyway, out of habit.',
        );
      break;
    case 'c12-open': {
      // S26's walled garden, spliced in as Hazel walks the posts.
      const garden = SCENE_BY_ID.get('c12-wall-garden');
      if (f.hushGarden && garden)
        lines = insertAfter(lines, 'Hazel walks the Grove. Slowly.', garden.lines);
      break;
    }
    case 's10-letter':
    case 's10-letter-told':
      if (f.letThemGo) {
        lines = swapLine(
          lines,
          'Morning. Your Nubbins are up before you. The gate is stuck.',
          'Morning. Your Nubbins are up before you. There is no gate to stick. You lift and push at the air anyway.',
        );
        lines = lines.map((l) =>
          l.text.startsWith('The Keepers are already at the gate.')
            ? { ...l, text: l.text.replace('at the gate.', 'at the gateposts.') }
            : l,
        );
      }
      break;
    case 's6-fern':
      if (f['s18-centre'] === 'register' && lines[8])
        lines = lines.map((l, i) =>
          i === 8
            ? {
                ...l,
                text: 'It’s on your table. Delve brought it back from his museum this morning, wrapped in a scarf.',
              }
            : l,
        );
      break;
    case 's6-register':
      if (f['s18-centre'] === 'register' && lines[0])
        lines = [
          narrator(
            'On the cottage table: a fat ledger, soft at the corners, with a card tucked in the front. On the cover, in Hazel’s hand: “EGGS.”',
          ),
          ...lines.slice(1),
        ];
      break;
    case 's17-complete':
      if (f['s17-nursery'] === 'open')
        lines = insertAfter(lines, 2, [
          narrator(
            'On the nursery roof a lantern burns every night now. Some nights a grey shape sits beside it, very still.',
          ),
        ]);
      else if (f['s17-nursery'] === 'shut')
        lines = insertAfter(lines, 2, [
          narrator(
            'Some nights a grey shape sits on the cottage roof and looks down the chimney. Luna leaves a mouse on the step.',
          ),
        ]);
      break;
    default:
      break;
  }
  return lines === scene.lines ? scene : { ...scene, lines };
}
