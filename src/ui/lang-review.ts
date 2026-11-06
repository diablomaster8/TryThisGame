/**
 * R0701: the language review game, "Ori's Word Pond" and "Hana's Word Garden". Only words
 * that are due come up (`dueWords`): the friend's clip plays, the word shows in its own
 * script, and the child taps the matching picture of three. A right pick moves the word up a
 * Leitner box; a wrong one sends it to box 1 and shows the answer; no stars are lost either
 * way. UI only: answers go to the sim as `langReview`, and the picks are made by `pickRound`.
 */
import { LANG_REVIEW_TEXT as T } from '../config/strings-srs';
import { LANG } from '../config/tuning';
import type { LanguageCourse, VocabItem } from '../content/types';
import type { Game } from '../game';
import { playWord } from '../platform/lang-audio';
import { dueWords, peekSrsDay } from '../sim/lang';
import { Rng } from '../sim/rng';
import type { World } from '../sim/types';
import { button, el, modal } from './dom';
import { appendScriptText } from './lang-dom';
import { wordIcon } from './lang-icons';
import { speakLine } from './lesson';

/** The course's due words the child's band sees, soonest first. */
export function dueFor(world: World, course: LanguageCourse): VocabItem[] {
  const band = world.edu?.band ?? 'sprout';
  const byId = new Map(course.vocab.map((w) => [w.id, w]));
  return dueWords(world, peekSrsDay(world))
    .map((id) => byId.get(id))
    .filter((w): w is VocabItem => !!w && (band === 'reader' || w.band === 'both'));
}

/** A seeded shuffle (Fisher-Yates). */
function shuffled<T>(rng: Rng, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** A round: the word, and three pictures (the right one among two others with other icons). */
export function pickRound(
  word: VocabItem,
  pool: readonly VocabItem[],
  rng: Rng,
): { word: VocabItem; options: VocabItem[]; answer: number } {
  const icon = (w: VocabItem) => wordIcon(w.id, w.topic);
  const others: VocabItem[] = [];
  for (const w of shuffled(
    rng,
    pool.filter((x) => x.id !== word.id),
  ))
    if (
      icon(w) !== icon(word) &&
      !others.some((o) => icon(o) === icon(w)) &&
      others.length < LANG.srs.options - 1
    )
      others.push(w);
  const options = shuffled(rng, [word, ...others]);
  return { word, options, answer: options.indexOf(word) };
}

export class LangReview {
  private readonly dialog;
  private readonly heading: HTMLElement | null;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly onBack: () => void,
  ) {
    this.dialog = modal(parent, T.title.hebrew ?? '', T.back);
    this.heading = this.dialog.root.querySelector('h2');
  }

  open(course: LanguageCourse): void {
    const g = this.game();
    if (!g?.world.edu) return;
    if (this.heading) this.heading.textContent = T.title[course.id] ?? course.title;
    const queue = dueFor(g.world, course).slice(0, LANG.srs.perSitting);
    this.dialog.show();
    this.round(g, course, queue, 0, Rng.fromSeed(Date.now()));
  }

  private round(g: Game, course: LanguageCourse, queue: VocabItem[], i: number, rng: Rng): void {
    const body = this.dialog.body;
    body.textContent = '';
    const word = queue[i];
    if (!word) return this.finish(g, queue.length);
    const r = pickRound(
      word,
      course.vocab.filter((w) => g.world.edu?.band === 'reader' || w.band === 'both'),
      rng,
    );
    body.appendChild(el('p', 'help', T.prompt));
    const say = el('div', 'edu-prompt lang-review-word');
    const native = el('strong', 'lang-native');
    appendScriptText(native, word.native);
    say.appendChild(native);
    say.appendChild(button('🔊', () => playWord(word.audio), 'btn edu-hear'));
    say.querySelector('.edu-hear')?.setAttribute('aria-label', T.hear);
    body.appendChild(say);
    const opts = el('div', `edu-options n${r.options.length}`);
    let answered = false;
    r.options.forEach((o, k) => {
      const b = button(
        '',
        () => {
          if (answered) return;
          answered = true;
          const right = k === r.answer;
          g.send({ kind: 'langReview', word: word.id, right });
          b.classList.add(right ? 'right' : 'wrong');
          if (!right) opts.children[r.answer]?.classList.add('right');
          if (g.world.edu?.readAloud) speakLine(right ? T.say.right : T.say.wrong);
          body.appendChild(el('p', 'help edu-reply', right ? rng.pick(T.right) : T.wrong));
          body.appendChild(
            button(
              '➡️',
              () => this.round(g, course, queue, i + 1, rng),
              'btn btn-primary edu-next',
            ),
          );
        },
        'btn edu-option',
      );
      b.setAttribute('aria-label', o.english);
      b.appendChild(el('span', 'edu-big', wordIcon(o.id, o.topic)));
      opts.appendChild(b);
    });
    body.appendChild(opts);
    playWord(word.audio);
  }

  private finish(g: Game, n: number): void {
    const body = this.dialog.body;
    body.textContent = '';
    body.appendChild(el('div', 'edu-prompt', n === 0 ? T.allDone : T.done(n)));
    if (n > 0 && g.world.edu?.readAloud) speakLine(T.say.done);
    body.appendChild(
      button(
        `🏡 ${T.back}`,
        () => {
          this.dialog.hide();
          this.onBack();
        },
        'btn btn-primary',
      ),
    );
  }
}
