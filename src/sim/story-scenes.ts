import { SCENES, type Line, type Scene } from '../config/story';
import type { Quest } from '../content/types';
import { SIDE_STORIES_FUN } from '../content/side-stories-fun';
import { SIDE_STORIES_FUN_2, SIDE_STORIES_FUN_2_VARIANTS } from '../content/side-stories-fun-2';
import { SIDE_STORIES_MAIN, SIDE_STORIES_MAIN_VARIANTS } from '../content/side-stories-main';
import { SIDE_STORIES_NEW_1 } from '../content/side-stories-new-1';
import { SIDE_STORIES_NEW_2 } from '../content/side-stories-new-2';
import { SIDE_STORIES_NEW_3, SIDE_STORIES_NEW_3_VARIANTS } from '../content/side-stories-new-3';
import { SIDE_STORIES_NEW_4 } from '../content/side-stories-new-4';
import { SIDE_STORY_S23, SIDE_STORY_S23_VARIANTS } from '../content/side-stories-s23';
import { SIDE_STORY_S24, SIDE_STORY_S24_VARIANTS } from '../content/side-stories-s24';
import { SIDE_STORY_S25, SIDE_STORY_S25_VARIANTS } from '../content/side-stories-s25';
import { SIDE_STORY_S26, SIDE_STORY_S26_VARIANTS } from '../content/side-stories-s26';
import { SIDE_STORY_S27, SIDE_STORY_S27_VARIANTS } from '../content/side-stories-s27';
import { SIDE_STORY_S28, SIDE_STORY_S28_VARIANTS } from '../content/side-stories-s28';
import { SIDE_STORY_S29, SIDE_STORY_S29_VARIANTS } from '../content/side-stories-s29';
import { SIDE_STORY_S30, SIDE_STORY_S30_VARIANTS } from '../content/side-stories-s30';
import { SIDE_STORY_S31, SIDE_STORY_S31_VARIANTS } from '../content/side-stories-s31';
import type { World } from './types';

/**
 * Every scene the Grove's story can queue: the campaign's, every Grove side story's
 * steps, done and complete scenes, and their variant scenes. `sceneFor` applies the line
 * swaps the scene notes ask for, read from flags at the moment the scene is shown.
 */

/** The Grove's side stories S1–S31, by quest id ('s9'). */
export const GROVE_SIDE_STORIES: Quest[] = [
  ...SIDE_STORIES_FUN,
  ...SIDE_STORIES_MAIN,
  ...SIDE_STORIES_FUN_2,
  ...SIDE_STORIES_NEW_1,
  ...SIDE_STORIES_NEW_2,
  ...SIDE_STORIES_NEW_3,
  ...SIDE_STORIES_NEW_4,
  ...SIDE_STORY_S23,
  ...SIDE_STORY_S24,
  ...SIDE_STORY_S25,
  ...SIDE_STORY_S26,
  ...SIDE_STORY_S27,
  ...SIDE_STORY_S28,
  ...SIDE_STORY_S29,
  ...SIDE_STORY_S30,
  ...SIDE_STORY_S31,
];

const SIDE_VARIANTS: Scene[] = [
  ...SIDE_STORIES_MAIN_VARIANTS,
  ...SIDE_STORIES_FUN_2_VARIANTS,
  ...SIDE_STORIES_NEW_3_VARIANTS,
  ...SIDE_STORY_S23_VARIANTS,
  ...SIDE_STORY_S24_VARIANTS,
  ...SIDE_STORY_S25_VARIANTS,
  ...SIDE_STORY_S26_VARIANTS,
  ...SIDE_STORY_S27_VARIANTS,
  ...SIDE_STORY_S28_VARIANTS,
  ...SIDE_STORY_S29_VARIANTS,
  ...SIDE_STORY_S30_VARIANTS,
  ...SIDE_STORY_S31_VARIANTS,
];

const QUEST_BY_ID = new Map<string, Quest>(GROVE_SIDE_STORIES.map((q) => [q.id, q]));

export function sideStory(id: string): Quest | undefined {
  return QUEST_BY_ID.get(id);
}

const SCENE_BY_ID = new Map<string, Scene>();
function add(s: Scene | undefined): void {
  if (s && !SCENE_BY_ID.has(s.id)) SCENE_BY_ID.set(s.id, s);
}
for (const s of SCENES) add(s);
for (const q of GROVE_SIDE_STORIES) {
  for (const step of q.steps) {
    add(step.scene);
    add(step.done);
  }
  add(q.complete);
}
for (const s of SIDE_VARIANTS) add(s);

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
