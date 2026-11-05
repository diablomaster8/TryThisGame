/**
 * Lane C round 11, helper "profiles" (R0618, CAMP-26): chapter select on the journal's Lines
 * page. Each finished chapter offers Watch again (its scenes in first-seen order, played
 * from a copy: the sim never hears of it, so the save is unchanged) and, when a checkpoint
 * was kept, Play from here, which puts that checkpoint into the first empty slot of the
 * same mode, labelled as a branch. The live save is never rewound. Without IndexedDB there
 * are no checkpoints, so only Watch again shows.
 */
import { PROFILE_TEXT } from '../config/strings-camp11-profiles';
import { REPLAY_TEXT } from '../config/strings-camp12d';
import { STORY_TEXT, type Choice, type Line, type Scene } from '../config/story';
import type { Game } from '../game';
import { readCheckpoint } from '../platform/save-backups';
import {
  currentSlot,
  hasSave,
  labelSlot,
  readSlotSummary,
  slotsFor,
  writeSlotFrom,
  type SaveSlot,
} from '../platform/storage';
import { chapterSelect, type DoneChapter } from '../sim/chapter-select';
import { sceneById, storylines } from '../sim/story-scenes';
import { SPINE_LINE } from '../sim/story-marks';
import { confirmModal } from './confirm';
import { button, el } from './dom';

/** The choice of `scene` this story's flags show was taken: all its `set` flags hold. */
export function chosenOf(scene: Scene, flags: Readonly<Record<string, unknown>>): Choice | null {
  return (
    scene.choices?.find((ch) => {
      const set = Object.entries(ch.set ?? {});
      return set.length > 0 && set.every(([k, v]) => flags[k] === v);
    }) ?? null
  );
}

/**
 * One scene made of a chapter's scenes, read-only. R0618: a scene with choices shows them all,
 * then the one taken ("You chose: ..."), then what was said after it; none can be clicked.
 */
export function replayScene(
  ch: DoneChapter,
  flags: Readonly<Record<string, unknown>> = {},
): Scene | null {
  const scenes = ch.scenes.map((id) => sceneById(id)).filter((s): s is Scene => !!s);
  const first = scenes[0];
  if (!first) return null;
  const narrate = (text: string): Line => ({ who: 'narrator', text });
  const lines = scenes.flatMap((s) => {
    if (!s.choices || s.choices.length === 0) return s.lines;
    const taken = chosenOf(s, flags);
    return [
      ...s.lines,
      narrate(REPLAY_TEXT.options(s.choices.map((x) => x.label))),
      narrate(taken ? REPLAY_TEXT.chose(taken.label) : REPLAY_TEXT.choseUnknown),
      ...(taken?.then ?? []),
    ];
  });
  return {
    id: `replay-${ch.line}-${ch.n}`,
    lines,
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

/** The slot a branch would replace when none is empty: the last slot that is not this one. */
export function overwriteSlot(of: SaveSlot): SaveSlot | null {
  for (let index = slotsFor(of.mode); index >= 1; index--)
    if (index !== of.index) return { mode: of.mode, index };
  return null;
}

function confirmOverwrite(slot: SaveSlot): Promise<boolean> {
  const name = readSlotSummary(slot)?.label?.name ?? '';
  return confirmModal({
    title: REPLAY_TEXT.overwriteTitle,
    body: REPLAY_TEXT.overwriteBody(slot.index, name),
    confirm: REPLAY_TEXT.overwriteConfirm(slot.index),
    cancel: REPLAY_TEXT.overwriteCancel,
  });
}

/** Puts chapter `ch`'s checkpoint into a new slot; answers what to tell the player. */
export async function branchFrom(ch: DoneChapter): Promise<string> {
  if (!ch.checkpoint) return PROFILE_TEXT.noCheckpoint;
  const from = currentSlot();
  let to = emptySlot(from);
  if (!to) {
    // R0618: every slot is full: offer the last other one, and only replace it on a yes.
    const over = overwriteSlot(from);
    if (!over || !(await confirmOverwrite(over))) return PROFILE_TEXT.branchNoRoom;
    to = over;
  }
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
    const owner = ch.line === SPINE_LINE ? g.world.campaign : g.world.lines?.[ch.line];
    const scene = replayScene(ch, owner?.flags ?? {});
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
