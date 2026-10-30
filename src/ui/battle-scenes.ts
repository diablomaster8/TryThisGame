// The two script files themselves, never the content barrel: the barrel would pull every
// script into the eager bundle (TECH-41, 5 MB gzip on 2026-10-30).
import { BATTLES_CIRCUIT_VARIANTS, BATTLES_PLAYDAY_VARIANTS } from '../content/battles-circuit';
import { BATTLES_STORY_LOGGED, BATTLES_STORY_VARIANTS } from '../content/battles-story';
import { eduContent, textBandOf } from '../sim/story-scenes';
import type { Scene } from '../config/story';
import { RESUME_TEXT, STORY_BOUT_TEXT } from '../config/strings-battle-r6';
import type { Game } from '../game';
import { openBout } from '../sim/battle/resume';
import {
  hatchedOf,
  STORY_BOUTS,
  storyBoutsOf,
  storyTurnContext,
  type StoryBoutId,
} from '../sim/battle/story-bouts';
import { battleScreen } from './battle-screen';
import type { Dialogue } from './dialogue';
import { button, el, modal } from './dom';

/**
 * Lane C round 6's battle scenes and prompts: the Circuit's pre- and post-bout scenes
 * (recs FIGHT-22), the story battles' scenes and their fight-or-skip choices (FIGHT-82), and
 * the "Resume the bout?" prompt after a load (FIGHT-64). The HUD registers its dialogue box
 * once; the dojo asks for scenes through here, so neither file needs the other.
 */
let dialogue: Dialogue | null = null;
/** Play-fight Day is offered once a session at most, even before the sim has noted it. */
let playdayTried = false;

export function setBattleDialogue(d: Dialogue): void {
  dialogue = d;
}

const ALL: readonly Scene[] = [
  ...BATTLES_CIRCUIT_VARIANTS,
  ...BATTLES_PLAYDAY_VARIANTS,
  ...BATTLES_STORY_VARIANTS,
  ...BATTLES_STORY_LOGGED,
];

/** Plays a battle scene by id; `onDone` gets the choice made. False when there is none. */
export function playBattleScene(
  id: string,
  onDone: (choice: string | null) => void,
  g?: Game,
): boolean {
  const scene = ALL.find((s) => s.id === id);
  if (!scene || !dialogue) return false;
  // In the Learning Grove a scene with a band version plays that, lessons and all.
  const band = g ? textBandOf(g.world) : 'main';
  const edu = band !== 'main' ? eduContent()?.eduSceneFor(band, id) : undefined;
  if (edu) {
    const lines = edu.lines;
    dialogue.playScene({ ...scene, lines, choices: edu.choices ?? [] }, {}, onDone, edu.lessons);
  } else dialogue.playScene(scene, {}, onDone);
  return true;
}

/**
 * Play-fight Day (FIGHT-24, FIGHT-83): the first time the Keeper opens Gentle bouts, its three
 * scenes play in turn (the Learning Grove's band versions in kid mode). Never in chapters 9–11.
 */
export function playPlayDay(g: Game, after: () => void): void {
  const ch = g.world.campaign?.chapter ?? 0;
  if (
    playdayTried ||
    (ch >= 9 && ch <= 11) ||
    g.world.battleOnce?.keepsakes.includes(PLAYDAY_SEEN)
  ) {
    after();
    return;
  }
  playdayTried = true;
  g.send({ kind: 'battleKeepsake', id: PLAYDAY_SEEN });
  const ids = ['bc-playday-open', 'bc-playday-bout', 'bc-playday-hug'];
  const next = (i: number): void => {
    if (i >= ids.length || !playBattleScene(ids[i]!, () => next(i + 1), g)) after();
  };
  next(0);
}

/** Marks Play-fight Day as seen, once (kept with the bout keepsakes). */
export const PLAYDAY_SEEN = 'playday-seen';

/** The story battles open now and not yet won, for the dojo's list. */
export function openStoryBouts(g: Game): StoryBoutId[] {
  const marks = storyBoutsOf(g.world);
  return (Object.keys(STORY_BOUTS) as StoryBoutId[]).filter(
    (id) => STORY_BOUTS[id].open(g.world) && marks[id] !== 'won',
  );
}

/** Plays a story battle's scene; the fight choice starts its bout, skip lets it pass. */
export function playStoryBout(g: Game, id: StoryBoutId, after: () => void): void {
  const played = playBattleScene(`bs-${id}`, (choice) => {
    const fight = choice === 'fight' || choice === 'defend';
    if (!fight || STORY_BOUTS[id].mode === 'tactics') {
      // Tactics bouts start in the sim; the HUD opens the board while `world.tactics` is live.
      g.send({ kind: 'storyBout', id, fight });
      after();
      return;
    }
    const party = hatchedOf(g.world, g.world.battlePrefs?.party ?? []);
    battleScreen(document.body, () => g).start(storyTurnContext(g.world, id, party), () => after());
  });
  if (!played) after();
}

/** The list rows for the dojo menu. */
export function storyBoutRows(
  g: Game,
  list: HTMLElement,
  reopen: () => void,
  hide: () => void,
): void {
  const open = openStoryBouts(g);
  if (!open.length) return;
  list.appendChild(el('div', 'btn-name', STORY_BOUT_TEXT.title));
  for (const id of open) {
    list.appendChild(
      button(
        STORY_BOUT_TEXT.names[id] ?? id,
        () => {
          hide();
          playStoryBout(g, id, reopen);
        },
        'btn bs-tier',
      ),
    );
  }
}

/**
 * Lane C r7 (R0275): the journal offers a story bout at its campaign beat, the first time it
 * opens, beside the chapter's goal: Fight or Let it pass, as the dojo's list does. One the
 * Keeper has answered (fought, skipped or won) stays in the dojo's list only.
 */
export function storyBoutJournal(g: Game, body: HTMLElement, close: () => void): void {
  const marks = storyBoutsOf(g.world);
  const fresh = openStoryBouts(g).filter((id) => marks[id] === undefined);
  if (!fresh.length) return;
  const box = el('div', 'journal-actions');
  for (const id of fresh)
    box.appendChild(
      button(
        STORY_BOUT_TEXT.waiting(STORY_BOUT_TEXT.names[id] ?? id),
        () => {
          close();
          playStoryBout(g, id, () => undefined);
        },
        'btn btn-small btn-primary',
      ),
    );
  body.appendChild(box);
}

/**
 * After a load: a bout still going asks "Resume the bout? / Call it a draw" (FIGHT-64). A turn
 * bout reopens on the battle screen at the start of the turn's picks; a tactics bout's board
 * reopens by itself (the HUD shows it while `world.tactics` is live), so only the draw is asked.
 */
export function askResume(parent: HTMLElement, game: () => Game | null): void {
  const g = game();
  if (!g) return;
  const kind = openBout(g.world);
  if (kind !== 'turn') return;
  const box = modal(parent, RESUME_TEXT.title, RESUME_TEXT.later);
  box.body.appendChild(el('p', 'help', RESUME_TEXT.body));
  box.body.append(
    button(
      RESUME_TEXT.resume,
      () => {
        box.hide();
        g.send({ kind: 'battleResume' });
        battleScreen(parent, game).resume();
      },
      'btn btn-primary',
    ),
    button(
      RESUME_TEXT.draw,
      () => {
        box.hide();
        g.send({ kind: 'battleDraw' });
      },
      'btn',
    ),
  );
  box.show();
}
