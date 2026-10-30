import { BATTLES_CIRCUIT_VARIANTS, BATTLES_STORY_LOGGED, BATTLES_STORY_VARIANTS } from '../content';
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

export function setBattleDialogue(d: Dialogue): void {
  dialogue = d;
}

const ALL: readonly Scene[] = [
  ...BATTLES_CIRCUIT_VARIANTS,
  ...BATTLES_STORY_VARIANTS,
  ...BATTLES_STORY_LOGGED,
];

/** Plays a battle scene by id; `onDone` gets the choice made. False when there is none. */
export function playBattleScene(id: string, onDone: (choice: string | null) => void): boolean {
  const scene = ALL.find((s) => s.id === id);
  if (!scene || !dialogue) return false;
  dialogue.playScene(scene, {}, onDone);
  return true;
}

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
