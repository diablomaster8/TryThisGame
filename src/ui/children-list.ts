/**
 * R0728 (KIDS-60): "Children on this device", in the grown-up area's Child tab. Up to six
 * child profiles (the Learning Grove slots): rename, reorder, and copy this child's limits
 * to the rest. The child in play is renamed through the game; the others by rewriting
 * their slot. Reordering swaps two slots whole, so the child in play stays where it is.
 */
import { CHILDREN_TEXT } from '../config/strings-children';
import type { Game } from '../game';
import {
  currentSlot,
  hasSave,
  readSlotJson,
  readSlotSummary,
  slotsFor,
  writeSlotFrom,
  type SaveSlot,
} from '../platform/storage';
import { copySettingsJson, renameChildJson } from '../sim/edu-children';
import { button, el } from './dom';

function eduSlots(): SaveSlot[] {
  const out: SaveSlot[] = [];
  for (let index = 1; index <= slotsFor('edu'); index++) {
    const s: SaveSlot = { mode: 'edu', index };
    if (hasSave(s)) out.push(s);
  }
  return out;
}

function isCurrent(s: SaveSlot): boolean {
  const c = currentSlot();
  return c.mode === s.mode && c.index === s.index;
}

export function childrenList(body: HTMLElement, g: Game, rerender: () => void): void {
  const slots = eduSlots();
  if (slots.length === 0) return;
  body.appendChild(el('h3', undefined, CHILDREN_TEXT.heading));
  body.appendChild(el('p', 'help', CHILDREN_TEXT.help(slots.length, slotsFor('edu'))));
  const status = el('p', 'help');
  status.setAttribute('role', 'status');
  const say = (t: string) => {
    status.textContent = t;
  };
  for (const [i, slot] of slots.entries()) {
    const sum = readSlotSummary(slot);
    const row = el('div', 'field-row children-row');
    row.appendChild(el('span', undefined, sum?.eduIcon ?? '🌱'));
    const name = el('input');
    name.type = 'text';
    name.maxLength = 20;
    name.value = isCurrent(slot) ? (g.world.edu?.childName ?? '') : (sum?.eduName ?? '');
    name.setAttribute('aria-label', CHILDREN_TEXT.rename(slot.index));
    name.addEventListener('change', () => {
      if (isCurrent(slot)) g.send({ kind: 'eduSetName', name: name.value });
      else {
        const json = readSlotJson(slot);
        const next = json ? renameChildJson(json, name.value, Date.now()) : null;
        if (!next || !writeSlotFrom(slot, next)) return say(CHILDREN_TEXT.failed);
      }
      say(CHILDREN_TEXT.renamed);
    });
    row.appendChild(name);
    const swap = (other: SaveSlot) => {
      const a = readSlotJson(slot);
      const b = readSlotJson(other);
      if (a === null || b === null || !writeSlotFrom(slot, b) || !writeSlotFrom(other, a))
        return say(CHILDREN_TEXT.failed);
      rerender();
    };
    const prev = slots[i - 1];
    const next = slots[i + 1];
    const up = button('↑', () => prev && swap(prev), 'btn btn-small');
    const down = button('↓', () => next && swap(next), 'btn btn-small');
    up.setAttribute('aria-label', CHILDREN_TEXT.moveUp(slot.index));
    down.setAttribute('aria-label', CHILDREN_TEXT.moveDown(slot.index));
    up.disabled = !prev || isCurrent(slot) || isCurrent(prev);
    down.disabled = !next || isCurrent(slot) || isCurrent(next);
    row.append(up, down);
    body.appendChild(row);
  }
  const edu = g.world.edu;
  if (slots.length > 1 && edu)
    body.appendChild(
      button(
        CHILDREN_TEXT.copyAll,
        () => {
          const from = { limits: edu.limits, sessionMinutes: edu.sessionMinutes };
          let ok = true;
          for (const slot of slots) {
            if (isCurrent(slot)) continue;
            const json = readSlotJson(slot);
            const next = json ? copySettingsJson(json, from, Date.now()) : null;
            if (!next || !writeSlotFrom(slot, next)) ok = false;
          }
          say(ok ? CHILDREN_TEXT.copied : CHILDREN_TEXT.failed);
        },
        'btn',
      ),
    );
  body.appendChild(status);
}
