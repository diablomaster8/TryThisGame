/**
 * Nova's postcard and the word lists (CV3), Learning Grove only. The postcard card in the
 * Learning Grove picker opens a panel with one card per course: start it (Ori or Hana
 * arrives at the gate), see how far it has got, and open its word list, where each word
 * met so far plays its clip on a tap. The grown-up area gets the full list with how often
 * each word was heard and used. UI only: it sends commands and reads `world.edu`.
 */
import { LANG_TEXT } from '../config/strings';
import { TRAINERS } from '../sim/trainers';
import type { Game } from '../game';
import type { LanguageCourse, VocabItem } from '../content/types';
import { langCourses } from '../sim/lang';
import type { LangCourseId } from '../sim/types';
import { clipFor, playWord } from '../platform/lang-audio';
import { button, el, modal } from './dom';
import { appendScriptText } from './lang-dom';

/** Words the child's band shows: sprouts skip the reader-only words. */
function bandWords(g: Game, course: LanguageCourse): VocabItem[] {
  const band = g.world.edu?.band ?? 'sprout';
  return course.vocab.filter((w) => band === 'reader' || w.band === 'both');
}

function questsDone(g: Game, course: LanguageCourse): number {
  const fun = g.world.campaign?.fun ?? {};
  return course.quests.filter((q) => fun[q.toLowerCase()]?.status === 'done').length;
}

function learnedCount(g: Game, course: LanguageCourse): number {
  const words = g.world.edu?.words ?? {};
  return bandWords(g, course).filter((w) => (words[w.id]?.heard ?? 0) > 0).length;
}

/** One word as a row: native script, romanisation and meaning; a tap plays it. */
function wordRow(g: Game, w: VocabItem, extra?: string): HTMLElement {
  const row = el('button', 'shop-row lang-row');
  row.type = 'button';
  const native = el('strong', 'lang-native');
  appendScriptText(native, w.native);
  const t = el('div');
  t.append(native, el('small', undefined, `${w.roman} · ${w.english}`));
  if (extra) t.appendChild(el('small', 'help', extra));
  row.appendChild(t);
  row.addEventListener('click', () => {
    playWord(w.audio);
    g.send({ kind: 'langWord', word: w.id, how: 'heard' });
  });
  return row;
}

export class LangPanel {
  private readonly dialog;

  constructor(
    parent: HTMLElement,
    private readonly game: () => Game | null,
    private readonly toast: (text: string) => void,
  ) {
    this.dialog = modal(parent, LANG_TEXT.postcard, LANG_TEXT.back);
  }

  /** The picker's postcard button. */
  pickButton(closePicker: () => void): HTMLButtonElement {
    const b = button(
      '',
      () => {
        closePicker();
        this.open();
      },
      'btn edu-pick',
    );
    b.append(
      el('span', 'edu-pick-icon', '💌'),
      el('strong', undefined, LANG_TEXT.postcard),
      el('small', undefined, LANG_TEXT.postcardBlurb),
    );
    return b;
  }

  open(): void {
    const g = this.game();
    if (!g?.world.edu) return;
    const body = this.dialog.body;
    body.textContent = '';
    body.appendChild(el('p', 'lang-postcard', LANG_TEXT.postcardBody));
    for (const course of langCourses()) body.appendChild(this.courseCard(g, course));
    this.dialog.show();
  }

  private courseCard(g: Game, course: LanguageCourse): HTMLElement {
    const id = course.id as LangCourseId;
    const started = g.world.edu?.courses[id] ?? false;
    const friend = LANG_TEXT.friends[id] ?? course.title;
    const card = el('div', 'lang-course');
    card.appendChild(el('strong', undefined, `${course.title} (${LANG_TEXT.languages[id]})`));
    card.appendChild(
      el(
        'small',
        undefined,
        LANG_TEXT.progress(questsDone(g, course), course.quests.length, learnedCount(g, course)),
      ),
    );
    const row = el('div', 'lang-actions');
    row.appendChild(
      button(
        started ? LANG_TEXT.carryOn(friend) : LANG_TEXT.meet(friend),
        () => this.start(g, id),
        'btn btn-primary',
      ),
    );
    row.appendChild(button(LANG_TEXT.words, () => this.words(g, course), 'btn'));
    card.appendChild(row);
    return card;
  }

  private start(g: Game, course: LangCourseId): void {
    // The friends come through the story, so it starts if it has not (as the Story card does).
    if (!g.world.campaign) {
      g.send({ kind: 'setTrainer', id: TRAINERS[0]!.id });
      g.send({ kind: 'campaignStart' });
    }
    g.send({ kind: 'langStart', course });
    this.toast(LANG_TEXT.arriving);
    this.dialog.hide();
  }

  /** The child's word list: the words met so far, each tappable. */
  private words(g: Game, course: LanguageCourse): void {
    const body = this.dialog.body;
    body.textContent = '';
    body.appendChild(
      el('h3', undefined, LANG_TEXT.wordsTitle(LANG_TEXT.languages[course.id] ?? '')),
    );
    const met = bandWords(g, course).filter((w) => (g.world.edu?.words[w.id]?.heard ?? 0) > 0);
    if (met.length === 0) body.appendChild(el('p', 'help', LANG_TEXT.noWordsYet));
    else {
      body.appendChild(el('p', 'help', LANG_TEXT.tapToHear));
      const list = el('div', 'shop-list');
      for (const w of met) list.appendChild(wordRow(g, w));
      body.appendChild(list);
    }
    body.appendChild(button(LANG_TEXT.back, () => this.open(), 'btn'));
  }
}

/** The grown-up area's word list: every course word, heard and used counts. */
export function langProgress(body: HTMLElement, g: Game): void {
  const e = g.world.edu;
  if (!e || langCourses().length === 0) return;
  body.appendChild(el('h3', undefined, LANG_TEXT.grownUpTitle));
  body.appendChild(el('p', 'help', LANG_TEXT.grownUpHelp));
  const anyPlaceholder = langCourses().some((c) =>
    c.vocab.some((w) => clipFor(w.audio).placeholder),
  );
  if (anyPlaceholder) body.appendChild(el('p', 'help', LANG_TEXT.placeholderClip));
  for (const course of langCourses()) {
    body.appendChild(
      el('strong', undefined, `${course.title} (${LANG_TEXT.languages[course.id]})`),
    );
    const list = el('div', 'shop-list');
    for (const w of bandWords(g, course)) {
      const s = e.words[w.id];
      const counts = s ? LANG_TEXT.heardUsed(s.heard, s.used) : LANG_TEXT.notMet;
      list.appendChild(wordRow(g, w, counts));
    }
    body.appendChild(list);
  }
}
