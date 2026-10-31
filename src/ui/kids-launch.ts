/**
 * Lane E round 9, R0696 (KIDS-28) and R0720 (KIDS-52): a child's own way into the Learning
 * Grove. A new Learning Grove asks the child's name (the grown-up types it), a colour and an
 * animal, so siblings can tell their Groves apart; and the `?kids` launch (the PWA shortcut)
 * opens a picture-only picker of the children's Groves, with no adult modes on it.
 */
import { EDU_TAG } from '../config/tuning';
import { KIDS_PICK_TEXT, KIDS_TAG_TEXT } from '../config/strings';
import {
  hasSave,
  readSlotSummary,
  SLOTS_PER_MODE,
  type SaveSlot,
  type SaveSummary,
} from '../platform/storage';
import { button, el } from './dom';
import { speakLine } from './lesson';

/** What the name-and-icon step chose; empty fields were skipped. */
export interface EduTag {
  name: string;
  icon: string | null;
  colour: string | null;
}

/** Pure: a Learning Grove slot's label for the title and the picker. */
export function eduTagLabel(s: Pick<SaveSummary, 'eduName' | 'eduIcon'>, index: number): string {
  const name = s.eduName ?? KIDS_PICK_TEXT.unnamed(index);
  return s.eduIcon ? `${s.eduIcon} ${name}` : name;
}

/** The CSS colour for a tag, or null. */
export function tagCss(colour: string | undefined | null): string | null {
  return colour ? (EDU_TAG.colours[colour] ?? null) : null;
}

/**
 * The step after the age pick: name, colour and animal, then "Start my Grove". Everything is
 * optional; the colour buttons carry their names and the animals are pictures, so colour is
 * never the only signal.
 */
export function tagStep(menu: HTMLElement, onDone: (tag: EduTag) => void, back: HTMLElement): void {
  menu.innerHTML = '';
  const pick: EduTag = { name: '', icon: null, colour: null };
  menu.appendChild(el('div', 'help kids-tag-q', KIDS_TAG_TEXT.name));
  const name = el('input', 'kids-tag-name');
  name.type = 'text';
  name.maxLength = EDU_TAG.nameMax;
  name.autocomplete = 'off';
  name.placeholder = KIDS_TAG_TEXT.namePlaceholder;
  name.setAttribute('aria-label', KIDS_TAG_TEXT.name);
  menu.append(name, el('small', 'help', KIDS_TAG_TEXT.nameHelp));

  const choose = (row: HTMLElement, b: HTMLButtonElement) => {
    for (const o of row.querySelectorAll('button')) o.setAttribute('aria-pressed', 'false');
    b.setAttribute('aria-pressed', 'true');
  };
  menu.appendChild(el('div', 'help kids-tag-q', KIDS_TAG_TEXT.colour));
  const colours = el('div', 'kids-tag-row');
  for (const [id, css] of Object.entries(EDU_TAG.colours)) {
    const label = KIDS_TAG_TEXT.colourNames[id] ?? id;
    const b = button(
      '',
      () => {
        pick.colour = id;
        choose(colours, b);
      },
      'btn kids-tag-colour',
    );
    const dot = el('span', 'kids-tag-dot');
    dot.style.background = css;
    b.append(dot, el('span', undefined, label));
    b.setAttribute('aria-pressed', 'false');
    colours.appendChild(b);
  }
  menu.appendChild(colours);
  menu.appendChild(el('div', 'help kids-tag-q', KIDS_TAG_TEXT.icon));
  const icons = el('div', 'kids-tag-row');
  for (const icon of EDU_TAG.icons) {
    const b = button(
      icon,
      () => {
        pick.icon = icon;
        choose(icons, b);
      },
      'btn kids-tag-icon',
    );
    b.setAttribute('aria-pressed', 'false');
    icons.appendChild(b);
  }
  menu.appendChild(icons);
  menu.appendChild(
    button(
      KIDS_TAG_TEXT.go,
      () => onDone({ ...pick, name: name.value.trim().slice(0, EDU_TAG.nameMax) }),
      'btn btn-primary kids-tag-go',
    ),
  );
  menu.appendChild(back);
  speakLine(KIDS_TAG_TEXT.say);
}

/**
 * The `?kids` picker: each filled Learning Grove as a big picture tile with the child's name,
 * and one small grown-ups' way to the full title. With no Learning Grove yet, only that way.
 */
export function showKidsPicker(
  parent: HTMLElement,
  onChoose: (slot: SaveSlot) => void,
  onGrownUps: () => void,
): void {
  const root = el('div', 'title kids-pick');
  const card = el('div', 'title-card');
  card.appendChild(el('h1', 'kids-pick-title', KIDS_PICK_TEXT.title));
  const row = el('div', 'kids-pick-row');
  let any = false;
  for (let index = 1; index <= SLOTS_PER_MODE; index++) {
    const slot: SaveSlot = { mode: 'edu', index };
    if (!hasSave(slot)) continue;
    const s = readSlotSummary(slot);
    const name = s?.eduName ?? KIDS_PICK_TEXT.unnamed(index);
    const b = button(
      '',
      () => {
        root.remove();
        onChoose(slot);
      },
      'btn kids-pick-tile',
    );
    b.style.setProperty('--tile', `${EDU_TAG.tilePx}px`);
    const css = tagCss(s?.eduColour);
    if (css) b.style.setProperty('--tag', css);
    b.append(el('span', 'kids-pick-icon', s?.eduIcon ?? '🌱'), el('strong', undefined, name));
    b.setAttribute('aria-label', KIDS_PICK_TEXT.open(name));
    row.appendChild(b);
    any = true;
  }
  if (any) card.appendChild(row);
  else card.appendChild(el('p', 'help', KIDS_PICK_TEXT.none));
  card.appendChild(
    button(
      KIDS_PICK_TEXT.grownUps,
      () => {
        root.remove();
        onGrownUps();
      },
      'btn btn-small kids-pick-grown',
    ),
  );
  root.appendChild(card);
  parent.appendChild(root);
  if (any) speakLine(KIDS_PICK_TEXT.say);
}
