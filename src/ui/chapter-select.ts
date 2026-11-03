/**
 * Lane C round 11, helper "profiles" (R0618, CAMP-26): chapter select on the journal's Lines
 * page. Each finished chapter offers Watch again (its scenes in first-seen order, played
 * from a copy: the sim never hears of it, so the save is unchanged) and, when a checkpoint
 * was kept, Play from here, which puts that checkpoint into the first empty slot of the
 * same mode, labelled as a branch. The live save is never rewound. Without IndexedDB there
 * are no checkpoints, so only Watch again shows.
 */
import { PROFILE_TEXT } from '../config/strings-camp11-profiles';
import { STORY_TEXT, type Scene } from '../config/story';
import type { Game } from '../game';
import { readCheckpoint } from '../platform/save-backups';
import {
  currentSlot,
  hasSave,
  labelSlot,
  slotsFor,
  writeSlotFrom,
  type SaveSlot,
} from '../platform/storage';
import { chapterSelect, type DoneChapter } from '../sim/chapter-select';
import { sceneById, storylines } from '../sim/story-scenes';
import { SPINE_LINE } from '../sim/story-marks';
import { button, el } from './dom';

/** One scene made of a chapter's scenes, with no choices: a read-only replay. */
export function replayScene(ch: DoneChapter): Scene | null {
  const scenes = ch.scenes.map((id) => sceneById(id)).filter((s): s is Scene => !!s);
  const first = scenes[0];
  if (!first) return null;
  return {
    id: `replay-${ch.line}-${ch.n}`,
    lines: scenes.flatMap((s) => s.lines),
    ...(first.stage ? { stage: first.stage } : {}),
  };
}

/** The checkpoint's save, cleaned for its new slot (its checkpoint keys point at the old one). */
export function branchJson(json: string): string | null {
  try {
    const data = JSON.parse(json) as { world?: { campaign?: { checkpoints?: unknown } | null } };
    const c = data.world?.campaign;
    if (!c) return null;
    delete c.checkpoints;
    return JSON.stringify(data);
  } catch {
    return null;
  }
}

/** The first empty slot of the mode in play, or null. */
function emptySlot(of: SaveSlot): SaveSlot | null {
  for (let index = 1; index <= slotsFor(of.mode); index++) {
    const s = { mode: of.mode, index };
    if (!hasSave(s)) return s;
  }
  return null;
}

/** Puts chapter `ch`'s checkpoint into a new slot; answers what to tell the player. */
export async function branchFrom(ch: DoneChapter): Promise<string> {
  if (!ch.checkpoint) return PROFILE_TEXT.noCheckpoint;
  const from = currentSlot();
  const to = emptySlot(from);
  if (!to) return PROFILE_TEXT.branchNoRoom;
  const raw = await readCheckpoint(ch.checkpoint).catch(() => null);
  const json = raw ? branchJson(raw) : null;
  if (!json || !writeSlotFrom(to, json)) return PROFILE_TEXT.branchFailed;
  labelSlot(to, { name: PROFILE_TEXT.branchName(from.index, ch.n) });
  return PROFILE_TEXT.branched(to.index);
}

function roadName(line: string): string {
  if (line === SPINE_LINE) return STORY_TEXT.title;
  return storylines().find((s) => s.id === line)?.title ?? line;
}

/** The Chapters fold, under the Lines page. Nothing when no chapter is finished yet. */
export function renderChapterSelect(
  g: Game,
  body: HTMLElement,
  replay: ((scene: Scene) => void) | null,
  close: () => void,
): void {
  const done = chapterSelect(g.world);
  if (done.length === 0) return;
  const box = el('details', 'journal-chapters');
  box.appendChild(el('summary', 'btn-name', PROFILE_TEXT.chaptersHead));
  box.appendChild(el('p', 'help', PROFILE_TEXT.chaptersHelp));
  const status = el('p', 'help');
  status.setAttribute('role', 'status');
  for (const ch of done) {
    const row = el('div', 'journal-line');
    row.appendChild(el('div', 'roster-line', PROFILE_TEXT.chapterRow(roadName(ch.line), ch.n)));
    const actions = el('div', 'journal-actions');
    const scene = replayScene(ch);
    if (scene && replay)
      actions.appendChild(
        button(
          PROFILE_TEXT.watchAgain,
          () => {
            close();
            replay(scene);
          },
          'btn btn-small',
        ),
      );
    if (ch.checkpoint) {
      const b = button(
        PROFILE_TEXT.playFromHere,
        () => {
          b.disabled = true;
          void branchFrom(ch).then((said) => {
            status.textContent = said;
            b.disabled = false;
          });
        },
        'btn btn-small',
      );
      actions.appendChild(b);
    } else row.appendChild(el('small', undefined, PROFILE_TEXT.noCheckpoint));
    row.appendChild(actions);
    box.appendChild(row);
  }
  box.appendChild(status);
  body.appendChild(box);
}
