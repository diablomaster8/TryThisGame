/**
 * Lane C r10 agent B (R0649, CAMP-57): naming and colour-tagging save slots on the title.
 * A slot shows its name (default "<Keeper>'s Grove" once a Keeper is chosen, else "Slot N")
 * and its tag as an icon plus a word, so the colour is never the only signal. The label is
 * written into the save and the slot index by `labelSlot` (platform/storage.ts).
 */
import { KEEPER_LOOK_NAMES, SLOT_LABEL_TEXT, SLOT_TEXT } from '../config/strings';
import { SLOT_LABEL } from '../config/tuning';
import { labelSlot, type SaveSlot, type SaveSummary } from '../platform/storage';
import { cleanSlotLabel } from '../sim/slot-label';
import { SLOT_TAGS, type SlotLabel, type SlotTag } from '../sim/types';
import { button, el, modal } from './dom';

/** Pure: the name a slot shows. */
export function slotName(index: number, s: SaveSummary | null): string {
  return s?.label?.name || defaultSlotName(index, s);
}

/** Pure: the name a slot shows when it has none of its own. */
export function defaultSlotName(index: number, s: SaveSummary | null): string {
  const keeper = s?.trainer ? (KEEPER_LOOK_NAMES[s.trainer] ?? null) : null;
  return keeper ? SLOT_LABEL_TEXT.defaultName(keeper) : SLOT_TEXT.slot(index);
}

/** Pure: the tag's icon and word ("🍃 Leaf"), or '' without a tag. */
export function slotTagText(tag: SlotTag | undefined): string {
  if (!tag) return '';
  const t = SLOT_LABEL_TEXT.tags[tag];
  return `${t.icon} ${t.name}`;
}

/** Style a slot row by its tag (a coloured edge; the icon and word carry it too). */
export function tagRow(row: HTMLElement, s: SaveSummary | null): void {
  const tag = s?.label?.tag;
  if (tag) row.classList.add('title-slot-tagged', `slot-tag-${tag}`);
}

/** Open the name-and-tag dialog for a filled slot; `done` runs after a save. */
export function openSlotLabel(
  parent: HTMLElement,
  slot: SaveSlot,
  summary: SaveSummary | null,
  done: () => void,
): void {
  const m = modal(parent, SLOT_LABEL_TEXT.title, SLOT_LABEL_TEXT.cancel);
  m.root.classList.add('slot-label-dialog');
  const close = (): void => {
    m.hide();
    m.root.remove();
  };
  const input = el('input');
  input.type = 'text';
  input.maxLength = SLOT_LABEL.nameMax;
  input.className = 'rename-input';
  input.value = summary?.label?.name ?? '';
  input.placeholder = defaultSlotName(slot.index, summary);
  input.setAttribute('aria-label', SLOT_LABEL_TEXT.nameLabel);
  let tag: SlotTag | null = summary?.label?.tag ?? null;
  const tags = el('div', 'slot-label-tags');
  tags.setAttribute('role', 'radiogroup');
  tags.setAttribute('aria-label', SLOT_LABEL_TEXT.tagLabel);
  const choices: Array<{ b: HTMLButtonElement; t: SlotTag | null }> = [];
  const mark = (): void => {
    for (const c of choices) c.b.setAttribute('aria-checked', String(c.t === tag));
  };
  for (const t of [null, ...SLOT_TAGS] as Array<SlotTag | null>) {
    const b = button(
      t ? slotTagText(t) : SLOT_LABEL_TEXT.noTag,
      () => {
        tag = t;
        mark();
      },
      `btn btn-small slot-tag-choice${t ? ` slot-tag-${t}` : ''}`,
    );
    b.setAttribute('role', 'radio');
    choices.push({ b, t });
    tags.appendChild(b);
  }
  mark();
  const save = button(
    SLOT_LABEL_TEXT.save,
    () => {
      const raw: SlotLabel = tag ? { name: input.value, tag } : { name: input.value };
      labelSlot(slot, cleanSlotLabel(raw));
      close();
      done();
    },
    'btn btn-primary',
  );
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') save.click();
  });
  // The modal's own close button cancels.
  const row = el('div', 'settings-actions');
  row.append(save);
  m.body.append(
    el('label', 'help', SLOT_LABEL_TEXT.nameLabel),
    input,
    el('div', 'help', SLOT_LABEL_TEXT.tagLabel),
    tags,
    row,
  );
  m.show();
  input.focus();
}
