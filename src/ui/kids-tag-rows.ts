/**
 * Lane E r10, R0696 (KIDS-28): the grown-up area's animal and colour rows, so the tag picked
 * when the Learning Grove was made (kids-launch.ts `tagStep`) can be changed later. Each
 * colour shows its name, so colour is never the only signal.
 */
import { KIDS_TAG_TEXT } from '../config/strings';
import { KIDS_R10_TEXT } from '../config/strings-kids-r10';
import { EDU_TAG } from '../config/tuning';
import type { Game } from '../game';
import { el } from './dom';

export function tagRows(g: Game, icon: string | null, colour: string | null): HTMLElement {
  const box = el('div');
  let cur = { icon, colour };
  const send = () => g.send({ kind: 'eduSetTag', icon: cur.icon, colour: cur.colour });

  const iconRow = el('label', 'field-row');
  const iconSel = el('select');
  iconSel.appendChild(option('', KIDS_R10_TEXT.tagNone));
  for (const i of EDU_TAG.icons) iconSel.appendChild(option(i, i));
  iconSel.value = icon ?? '';
  iconSel.addEventListener('change', () => {
    cur = { ...cur, icon: iconSel.value || null };
    send();
  });
  iconRow.append(el('strong', undefined, KIDS_R10_TEXT.tagAnimal), iconSel);

  const colourRow = el('label', 'field-row');
  const colourSel = el('select');
  colourSel.appendChild(option('', KIDS_R10_TEXT.tagNone));
  for (const id of Object.keys(EDU_TAG.colours))
    colourSel.appendChild(option(id, KIDS_TAG_TEXT.colourNames[id] ?? id));
  colourSel.value = colour ?? '';
  colourSel.addEventListener('change', () => {
    cur = { ...cur, colour: colourSel.value || null };
    send();
  });
  colourRow.append(el('strong', undefined, KIDS_R10_TEXT.tagColour), colourSel);

  box.append(iconRow, colourRow);
  return box;
}

function option(value: string, text: string): HTMLOptionElement {
  const o = el('option', undefined, text);
  o.value = value;
  return o;
}
