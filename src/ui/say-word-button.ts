/**
 * R0708: the "Say a word" button on the stats sheet in a Learning Grove save. It shows only
 * while a language quest waits on a teach step (`lang:he:teach:nubbins:shalom:3`): a tap
 * plays the word's clip and sends `langTeach` for the open Nubbin, which copies the gesture.
 * Three distinct Nubbins meet the step; the journal goal says so.
 */
import { LANG_TEXT } from '../config/strings';
import { langQuestIds, teachTarget } from '../sim/lang';
import { sideStory } from '../sim/story-scenes';
import type { World } from '../sim/types';
import { playWord } from '../platform/lang-audio';
import type { Game } from '../game';
import { button } from './dom';

/** The word of the open teach step, with how many Nubbins it still needs, or null. */
export function openTeach(world: World): { word: string; id: string; need: number } | null {
  const fun = world.campaign?.fun;
  if (!world.edu || !fun) return null;
  for (const id of langQuestIds()) {
    const st = fun[id];
    if (st?.status !== 'open' || st.stage !== 'check' || st.acted) continue;
    const t = teachTarget(sideStory(id)?.steps[st.step]?.check);
    if (t) return { word: t.word, id, need: t.count - (world.edu.taught?.[t.word]?.length ?? 0) };
  }
  return null;
}

export class SayWordButton {
  readonly el: HTMLButtonElement;
  private nubbinId: string | null = null;

  constructor(private readonly game: () => Game | null) {
    this.el = button(LANG_TEXT.sayWord, () => this.say(), 'btn btn-small');
    this.el.hidden = true;
  }

  private say(): void {
    const g = this.game();
    const t = g ? openTeach(g.world) : null;
    if (!g || !t || !this.nubbinId) return;
    playWord(t.word.replace('-', '/'));
    g.send({ kind: 'langTeach', nubbinId: this.nubbinId, word: t.word });
  }

  refresh(world: World, nubbinId: string, grown: boolean): void {
    this.nubbinId = nubbinId;
    this.el.hidden = !(grown && openTeach(world));
  }
}
