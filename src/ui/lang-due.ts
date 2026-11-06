/**
 * R0701 (KIDS-33): due language words coming up in Grove life. Now and then, while the child
 * is just looking around, a Nubbin near the Keeper waves and Ori (or Hana) says a word that is
 * due for review, with its clip and a short caption. It never interrupts a game, a scene or a
 * panel, asks nothing, counts nothing for or against the child and is not a daily task: it
 * simply stops when no word is due. Which word and Nubbin is the sim's pure `pickDueWave`.
 */
import { DUE_WAVE_TEXT } from '../config/strings-story-r11e';
import { DUE_WAVE } from '../config/tuning-story-r11e';
import type { Game } from '../game';
import { playWord } from '../platform/lang-audio';
import { langWord, peekSrsDay, pickDueWave } from '../sim/lang';

export class DueWave {
  private nextAt = Number.NaN;

  constructor(private readonly toast: (text: string, ms?: number) => void) {}

  /** Call each frame; `busy` is true while anything else has the child's attention. */
  update(g: Game, busy: boolean, nowMs = performance.now()): void {
    if (!g.world.edu) return;
    if (Number.isNaN(this.nextAt)) this.nextAt = nowMs + DUE_WAVE.firstMs;
    if (busy || nowMs < this.nextAt) return;
    const pick = pickDueWave(g.world, peekSrsDay(g.world));
    this.nextAt = nowMs + DUE_WAVE.gapMs;
    const w = pick ? langWord(pick.word) : undefined;
    if (!pick || !w) return;
    g.send({ kind: 'langDueWave', word: pick.word });
    playWord(w.audio);
    this.toast(DUE_WAVE_TEXT.says(DUE_WAVE_TEXT.friend[w.lang] ?? '', w.roman));
  }
}
