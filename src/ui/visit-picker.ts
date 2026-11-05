import { SAVE_LAYOUT_TEXT } from '../config/strings-camp11-save';
import { SLOT_TEXT } from '../config/strings';
import { listProfiles } from '../platform/profiles';
import {
  currentSlot,
  keeperProfile,
  markResumeSlot,
  profileModes,
  readSlotSummaryOf,
  slotsFor,
  visitingProfile,
  type SaveSlot,
} from '../platform/storage';
import { button, el, modal } from './dom';

/**
 * R0669 (CAMP-77, round 13): visiting another Keeper's Grove from inside the game. The list is
 * built from the other Keeper profiles' slot summaries, never the active profile's, and a
 * tap saves the player's own Grove, remembers its slot, and reloads into the read-only visit
 * (`?visit=<profile>&vslot=<mode>:<index>`). The visit's banner then brings the player home.
 */

export interface VisitChoice {
  profile: string;
  name: string;
  slot: SaveSlot;
  where: string;
}

/** Every other Keeper's saved slot that can be visited; empty when the device has one Keeper. */
export function visitChoices(): VisitChoice[] {
  if (visitingProfile() !== null) return [];
  const out: VisitChoice[] = [];
  for (const p of listProfiles()) {
    if (p.kind !== 'keeper' || p.id === keeperProfile()) continue;
    for (const mode of profileModes(p.id))
      for (let index = 1; index <= slotsFor(mode); index++) {
        const slot: SaveSlot = { mode, index };
        if (!readSlotSummaryOf(p.id, slot)) continue;
        out.push({
          profile: p.id,
          name: p.name,
          slot,
          where: `${SLOT_TEXT.modes[mode] ?? mode} · ${SLOT_TEXT.slot(index)}`,
        });
      }
  }
  return out;
}

/** The address of a visit, keeping what else is on the current one (`?debug`). */
export function visitUrl(c: VisitChoice, search: string, path: string): string {
  const q = new URLSearchParams(search);
  q.set('visit', c.profile);
  q.set('vslot', `${c.slot.mode}:${c.slot.index}`);
  return `${path}?${q.toString()}`;
}

/** The modal behind More → "Visit a Keeper's Grove"; `saveOwn` writes the player's own Grove. */
export function mountVisitPicker(
  parent: HTMLElement,
  saveOwn: () => void,
): { open(): void; hasChoices(): boolean } {
  const m = modal(parent, SAVE_LAYOUT_TEXT.visitOthers, SAVE_LAYOUT_TEXT.visitClose);
  const fill = (): VisitChoice[] => {
    m.body.replaceChildren(el('p', 'help', SAVE_LAYOUT_TEXT.visitOthersHelp));
    const list = visitChoices();
    for (const c of list) {
      const b = button(
        SAVE_LAYOUT_TEXT.visitSlot(c.name, c.where),
        () => {
          saveOwn();
          markResumeSlot(currentSlot());
          location.assign(visitUrl(c, location.search, location.pathname));
        },
        'btn btn-wide',
      );
      m.body.appendChild(b);
    }
    if (list.length === 0) m.body.appendChild(el('p', 'help', SAVE_LAYOUT_TEXT.visitNone));
    return list;
  };
  return {
    open() {
      fill();
      m.show();
    },
    hasChoices: () => visitChoices().length > 0,
  };
}
