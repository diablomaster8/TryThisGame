/**
 * Nova's postcard and the word lists (CV3), Learning Grove only. The postcard card in the
 * Learning Grove picker opens a panel with one card per course: start it (Ori or Hana
 * arrives at the gate), see how far it has got, and open its word list, where each word
 * met so far plays its clip on a tap. The grown-up area gets the full list with how often
 * each word was heard and used. UI only: it sends commands and reads `world.edu`.
 */
import { GROWN_UP_TEXT } from '../config/strings-access-r10'; /* Lane E r10 */
import { LANG_TEXT } from '../config/strings';
import { TRAINERS } from '../sim/trainers';
import type { Game } from '../game';
import type { LanguageCourse, VocabItem } from '../content/types';
import { langCourses } from '../sim/lang';
import type { LangCourseId } from '../sim/types';
import { clipFor, playWord } from '../platform/lang-audio';
import { button, el, modal } from './dom';
import { appendScriptText } from './lang-dom';
/* Lane E r9 */
import { langSkipRow, langWaitCard, langWaitLine, sayLangWait } from './lang-wait';
import { friendCard, greetAll, stampsFor } from './postcard-faces'; /* Lane E r10, R0705 */
import { speakLine } from './lesson';
import { KIDS_R10_TEXT } from '../config/strings-kids-r10';
import { KIDS_R10_TUNING } from '../config/tuning-kids-r10';

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
    // Lane E r10, R0705: the friends side by side, as faces.
    const friends = el('div', 'postcard-friends');
    for (const course of langCourses()) friends.appendChild(this.courseCard(g, course));
    body.appendChild(friends);
    this.dialog.show();
    // R0705: the postcard is read aloud, then each friend says hello from their clip.
    const greet = () => greetAll(langCourses(), KIDS_R10_TUNING.greetGapMs);
    if (g.world.edu.readAloud) speakLine(KIDS_R10_TEXT.postcard.say, { onDone: greet });
    else greet();
    /* Lane E r9, R0737: a sprout hears when Ori or Hana comes back. */
    const waits = langCourses()
      .map((c) =>
        langWaitLine(g, c.id as LangCourseId, c.quests, LANG_TEXT.friends[c.id] ?? c.title),
      )
      .filter((l): l is string => l !== null);
    if (waits.length)
      window.setTimeout(() => sayLangWait(g, waits), KIDS_R10_TUNING.greetGapMs * 3);
  }

  /** Lane E r10, R0705: a friend's face card, with the wait card between visits. */
  private courseCard(g: Game, course: LanguageCourse): HTMLElement {
    const id = course.id as LangCourseId;
    const friend = LANG_TEXT.friends[id] ?? course.title;
    const fun = g.world.campaign?.fun ?? {};
    const card = friendCard(g, course, {
      name: friend,
      language: LANG_TEXT.languages[id] ?? course.title,
      started: g.world.edu?.courses[id] ?? false,
      stamps: stampsFor(course.quests, (q) => fun[q.toLowerCase()]?.status === 'done'),
      onMeet: () => this.start(g, id),
      onWords: () => this.words(g, course),
    });
    card.title = LANG_TEXT.progress(
      questsDone(g, course),
      course.quests.length,
      learnedCount(g, course),
    );
    /* Lane E r9, R0737: between visits, the next one as a picture of the time. */
    const wait = langWaitCard(g, id, course.quests, friend);
    if (wait) card.appendChild(wait);
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
    body.appendChild(button(`← ${LANG_TEXT.back}`, () => this.open(), 'btn'));
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
    /* Lane E r9, R0737: the grown-up's skip to Grove morning, while a visit waits. */
    const skip = langSkipRow(
      g,
      langWaitLine(g, course.id as LangCourseId, course.quests, '') !== null,
    );
    if (skip) body.appendChild(skip);
    // Lane E r10 (R0718): the word list folds by topic, so the report stays short.
    const byTopic = new Map<string, VocabItem[]>();
    for (const w of bandWords(g, course))
      byTopic.set(w.topic, [...(byTopic.get(w.topic) ?? []), w]);
    for (const [topic, words] of byTopic) {
      const fold = el('details', 'lang-topic');
      const met = words.filter((w) => e.words[w.id]).length;
      fold.appendChild(el('summary', undefined, GROWN_UP_TEXT.topicFold(topic, met, words.length)));
      const list = el('div', 'shop-list');
      for (const w of words) {
        const s = e.words[w.id];
        const counts = s ? LANG_TEXT.heardUsed(s.heard, s.used) : LANG_TEXT.notMet;
        list.appendChild(wordRow(g, w, counts));
      }
      fold.appendChild(list);
      body.appendChild(fold);
    }
  }
}
