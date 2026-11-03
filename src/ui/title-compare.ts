import { C11_TEXT, SLOT_TEXT } from '../config/strings';
import { compareChoices } from '../sim/camp11';
import type { SaveSummary } from '../platform/storage';
import { slotName } from './title-slots';
import { button, el, modal } from './dom';

/**
 * Lane C round 11, helper ui (R0667, R0669): the title's Compare and Visit, both read-only.
 * They work from the slot summaries the index already holds (`summary.choices`, the quest and
 * line counts), so neither opens, loads or writes a save. Compare lists only the signature
 * choices that differ, by their flag's name and value, so it never spoils an ending.
 */

export interface SlotRef {
  index: number;
  summary: SaveSummary | null;
}

/** A flag such as `s1-pace` as "S1 · pace", and its value as plain words. */
export function choiceName(flag: string): string {
  const [quest, ...rest] = flag.split('-');
  return `${(quest ?? '').toUpperCase()} · ${rest.join(' ')}`;
}

export function choiceValue(v: string | null): string {
  if (v === null) return C11_TEXT.compareNotMade;
  if (v === 'true') return 'yes';
  if (v === 'false') return 'no';
  return v.replace(/-/g, ' ');
}

/** Pick another slot of this mode and list the choices that differ from `me`. */
export function openCompare(parent: HTMLElement, me: SlotRef, others: SlotRef[]): void {
  const m = modal(parent, C11_TEXT.compare, C11_TEXT.compareClose);
  m.root.classList.add('c11-compare');
  const result = el('div', 'c11-compare-result');
  const pick = el('div', 'c11-compare-pick');
  pick.appendChild(el('p', 'help', C11_TEXT.comparePick));
  const show = (other: SlotRef): void => {
    result.replaceChildren();
    const diffs = compareChoices(me.summary?.choices, other.summary?.choices);
    result.appendChild(el('div', 'btn-name', C11_TEXT.compareHead));
    if (diffs.length === 0) result.appendChild(el('p', 'help', C11_TEXT.compareSame));
    const table = el('table', 'c11-compare-table');
    const head = el('tr');
    head.append(
      el('th', undefined, ''),
      el('th', undefined, slotName(me.index, me.summary)),
      el('th', undefined, slotName(other.index, other.summary)),
    );
    table.appendChild(head);
    for (const d of diffs) {
      const tr = el('tr');
      tr.append(
        el('td', undefined, choiceName(d.flag)),
        el('td', undefined, choiceValue(d.a)),
        el('td', undefined, choiceValue(d.b)),
      );
      table.appendChild(tr);
    }
    if (diffs.length > 0) result.appendChild(table);
  };
  for (const o of others) {
    pick.appendChild(
      button(
        `${slotName(o.index, o.summary)} · ${SLOT_TEXT.slot(o.index)}`,
        () => show(o),
        'btn btn-small c11-go',
      ),
    );
  }
  m.body.append(pick, result);
  m.show();
}

/** A read-only look at a slot: who lives there, how far it has got. Nothing is loaded. */
export function openVisit(parent: HTMLElement, me: SlotRef): void {
  const m = modal(parent, C11_TEXT.visit, C11_TEXT.compareClose);
  m.root.classList.add('c11-visit');
  const s = me.summary;
  const who = s?.names[0] ? s.names.join(', ') : slotName(me.index, s);
  m.body.appendChild(
    el('div', 'btn-name', C11_TEXT.visitHead(s?.trainer ?? slotName(me.index, s))),
  );
  m.body.appendChild(el('p', 'help', C11_TEXT.visitHelp));
  if (!s) m.body.appendChild(el('p', undefined, C11_TEXT.visitEmpty));
  else {
    const list = el('ul', 'c11-visit-list');
    list.appendChild(el('li', undefined, `${C11_TEXT.visitNubbins(s.nubbins)}: ${who}`));
    if (s.chapter !== null) list.appendChild(el('li', undefined, C11_TEXT.visitChapter(s.chapter)));
    if (s.questsDone !== undefined)
      list.appendChild(el('li', undefined, C11_TEXT.visitQuests(s.questsDone)));
    const roads = Object.keys(s.lines ?? {}).length;
    if (roads > 0) list.appendChild(el('li', undefined, C11_TEXT.visitLines(roads)));
    m.body.appendChild(list);
  }
  m.show();
}
