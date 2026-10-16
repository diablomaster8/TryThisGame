/**
 * The Learning Grove's story controls (CV2), kept apart from the six minigames in edu.ts:
 * the "Story" entry in the picker, the grown-up area's band, story-language and read-aloud
 * switches, and the grown-up progress view of story lessons by area and by standard, with
 * the `parentNote` lines. Everything reads `world.edu` and the loaded edu chunk and sends
 * commands; nothing here changes the world.
 */
import { EDU_STORY_TEXT } from '../config/strings';
import type { EduBand } from '../content/types';
import type { Game } from '../game';
import { eduContent } from '../sim/story-scenes';
import { TRAINERS } from '../sim/trainers';
import { button, el } from './dom';

/** The picker's story button: starts Hazel's Grove the first time, then points at the journal. */
export function storyPickButton(
  g: Game,
  close: () => void,
  toast: (text: string) => void,
): HTMLButtonElement {
  const b = button(
    '',
    () => {
      if (g.world.campaign) {
        toast(EDU_STORY_TEXT.storyContinue);
        return;
      }
      // The Learning Grove has no Keeper menu; the story starts with the first Keeper.
      g.send({ kind: 'setTrainer', id: TRAINERS[0]!.id });
      g.send({ kind: 'campaignStart' });
      close();
    },
    'btn edu-pick',
  );
  b.append(
    el('span', 'edu-pick-icon', '📖'),
    el('strong', undefined, EDU_STORY_TEXT.story),
    el('small', undefined, EDU_STORY_TEXT.storyBlurb),
  );
  return b;
}

function selectRow<T extends string>(
  label: string,
  options: Record<T, string>,
  value: T,
  onChange: (v: T) => void,
): HTMLLabelElement {
  const row = el('label', 'field-row');
  const sel = el('select');
  for (const [v, text] of Object.entries(options) as [T, string][]) {
    const o = el('option', undefined, text);
    o.value = v;
    sel.appendChild(o);
  }
  sel.value = value;
  sel.addEventListener('change', () => onChange(sel.value as T));
  row.append(el('strong', undefined, label), sel);
  return row;
}

/** The grown-up area's story switches: band, story language, read-aloud. */
export function storySettings(body: HTMLElement, g: Game): void {
  const e = g.world.edu;
  if (!e) return;
  body.appendChild(el('h3', undefined, EDU_STORY_TEXT.story));
  body.appendChild(
    selectRow<EduBand>(EDU_STORY_TEXT.bandLabel, EDU_STORY_TEXT.bands, e.band, (band) =>
      g.send({ kind: 'eduSetBand', band }),
    ),
  );
  body.appendChild(
    selectRow(EDU_STORY_TEXT.languageLabel, EDU_STORY_TEXT.languages, e.storyLanguage, (language) =>
      g.send({ kind: 'eduSetLanguage', language }),
    ),
  );
  body.appendChild(el('p', 'help', EDU_STORY_TEXT.languageHelp));
  const row = el('label', 'check-row');
  const cb = el('input');
  cb.type = 'checkbox';
  cb.checked = e.readAloud;
  cb.addEventListener('change', () => g.send({ kind: 'eduSetReadAloud', on: cb.checked }));
  const text = el('span');
  text.append(
    el('strong', undefined, EDU_STORY_TEXT.readAloudLabel),
    el('small', undefined, EDU_STORY_TEXT.readAloudHelp),
  );
  row.append(cb, text);
  body.appendChild(row);
}

/** How many story lessons, by area and by standard, and the latest parent notes. */
export function storyProgress(body: HTMLElement, g: Game): void {
  const e = g.world.edu;
  const content = eduContent();
  if (!e) return;
  body.appendChild(el('h3', undefined, EDU_STORY_TEXT.progressTitle));
  const played = Object.keys(e.lessons)
    .map((id) => content?.eduLesson(id))
    .filter((l) => l !== undefined);
  if (played.length === 0) {
    body.appendChild(el('p', 'help', EDU_STORY_TEXT.progressNone));
    return;
  }
  const tally = (key: (l: (typeof played)[number]) => string | undefined) => {
    const m = new Map<string, number>();
    for (const l of played) {
      const k = key(l);
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m].sort((a, b) => b[1] - a[1]);
  };
  const list = (title: string, rows: [string, number][]) => {
    body.appendChild(el('strong', undefined, title));
    const box = el('div', 'shop-list');
    for (const [name, n] of rows) {
      const row = el('div', 'shop-row');
      const t = el('div');
      t.append(
        el('strong', undefined, name),
        el('small', undefined, EDU_STORY_TEXT.lessonCount(n)),
      );
      row.appendChild(t);
      box.appendChild(row);
    }
    body.appendChild(box);
  };
  list(
    EDU_STORY_TEXT.byDomain,
    tally((l) => EDU_STORY_TEXT.lessonDomains[l.domain] ?? l.domain),
  );
  const standards = tally((l) => l.standard);
  if (standards.length > 0) list(EDU_STORY_TEXT.byStandard, standards);
  // The newest notes last in the record, so show the end of it, newest first.
  body.appendChild(el('strong', undefined, EDU_STORY_TEXT.recentNotes));
  const notes = el('ul', 'edu-notes');
  for (const l of played.slice(-8).reverse()) notes.appendChild(el('li', undefined, l.parentNote));
  body.appendChild(notes);
}
