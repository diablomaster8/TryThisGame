/**
 * Lane C round 11, helper "profiles": the title's new top parts, kept out of title.ts.
 * - R0621: the big Continue (the slot played last) above the slot cards.
 * - R0628 / R0653: "Who's playing?". Each child's Grove is a big picture tile that opens it in
 *   one tap with nothing to read (its name is read aloud); the Keeper tile opens the slot
 *   cards, through the grown-up gate when a child played last. Rename, delete (gate plus a
 *   typed word) and Deleted profiles with Restore sit behind each tile's ⋯. New profiles
 *   need the unified slots (R0598 stage B), so "+ New profile" shows only once they are on.
 * - R0598: the one-time "Your saves moved" card with Combine endings, and Older saves.
 */
import { PROFILE_TEXT } from '../config/strings-camp11-profiles';
import { PROFILES } from '../config/tuning-camp11-profiles';
import { SAVE_LAYOUT } from '../config/tuning-camp11-save';
import { SLOT_TEXT } from '../config/strings';
import { EDU_TAG } from '../config/tuning';
import {
  hasSave,
  readSlotSummary,
  slotsFor,
  type SaveSlot,
  type SaveSummary,
} from '../platform/storage';
import {
  addProfile,
  deleteProfile,
  FIXED_PROFILES,
  lastProfile,
  listDeleted,
  listProfiles,
  renameProfile,
  restoreProfile,
  type Profile,
} from '../platform/profiles';
import {
  combineInto,
  endingSources,
  hazelTargets,
  markMovedSeen,
  movedCardDue,
  olderSaves,
  swapOlder,
  unifiedSlots,
} from '../platform/unified-after';
import { askGrownUp } from './grown-up-gate';
import { button, el, modal } from './dom';
import { tagCss } from './kids-launch';
import { showFirstNubbin } from './kids-portrait';
import { speakLine } from './lesson';
import '../profiles-r11.css';

/** R0621: the big Continue, or nothing when no slot was played yet. */
export function continueHeader(
  slot: SaveSlot | null,
  what: string,
  onContinue: () => void,
): HTMLElement | null {
  if (!slot || !hasSave(slot)) return null;
  const b = button('', onContinue, 'btn btn-primary title-continue');
  b.append(
    el('strong', undefined, PROFILE_TEXT.continueBig),
    el('small', undefined, PROFILE_TEXT.continueWhere(SLOT_TEXT.slot(slot.index), what)),
  );
  return b;
}

/** Does the title open on "Who's playing?" (a child's Grove, or more than the two profiles)? */
export function pickerDue(): boolean {
  const kids = Array.from({ length: slotsFor('edu') }, (_, i) =>
    hasSave({ mode: 'edu', index: i + 1 }),
  ).some(Boolean);
  return kids || listProfiles().length > FIXED_PROFILES.length;
}

export interface WhoOptions {
  parent: HTMLElement;
  onKeeper: (p: Profile) => void;
  onChild: (slot: SaveSlot) => void;
  /** Redraw the picker (after a rename, delete or restore). */
  redraw: () => void;
}

/** A child's Grove tile: picture, colour and name, read aloud; one tap opens it. */
function childTile(slot: SaveSlot, s: SaveSummary | null, onChild: (s: SaveSlot) => void) {
  const name = s?.eduName ?? SLOT_TEXT.slot(slot.index);
  const b = button('', () => onChild(slot), 'btn kids-pick-tile title-who-child');
  b.style.setProperty('--tile', `${EDU_TAG.tilePx}px`);
  const css = tagCss(s?.eduColour);
  if (css) b.style.setProperty('--tag', css);
  const icon = el('span', 'kids-pick-icon', s?.eduIcon ?? '🌱');
  b.append(icon, el('strong', undefined, name));
  showFirstNubbin(slot, icon);
  b.setAttribute('aria-label', PROFILE_TEXT.childTileLabel(name));
  b.addEventListener('pointerenter', () => speakLine(name), { once: true });
  return b;
}

/** R0628: "Who's playing?". */
export function renderWho(menu: HTMLElement, o: WhoOptions): void {
  menu.replaceChildren();
  menu.appendChild(el('h2', 'title-who-head', PROFILE_TEXT.whoTitle));
  const kids = el('div', 'kids-pick-row title-who-kids');
  for (let index = 1; index <= slotsFor('edu'); index++) {
    const slot: SaveSlot = { mode: 'edu', index };
    if (hasSave(slot)) kids.appendChild(childTile(slot, readSlotSummary(slot), o.onChild));
  }
  if (kids.childElementCount > 0) menu.appendChild(kids);
  const gate = (then: () => void): void => {
    void askGrownUp(o.parent, () => undefined).then((ok) => ok && then());
  };
  const keepers = el('div', 'title-who-keepers');
  for (const p of listProfiles()) {
    if (p.kind === 'child') continue;
    const row = el('div', 'title-slot');
    const open = button(
      '',
      () => {
        // A child played last: the way to a Keeper's saves asks the grown-up gate first.
        if (lastProfile().startsWith('k')) gate(() => o.onKeeper(p));
        else o.onKeeper(p);
      },
      'btn title-slot-main title-who-keeper',
    );
    open.append(el('strong', undefined, `${p.avatar} ${PROFILE_TEXT.keeperTile(p.name)}`));
    const more = button(
      PROFILE_TEXT.more,
      () => gate(() => manage(o, p)),
      'btn btn-small btn-icon title-slot-more',
    );
    more.setAttribute('aria-label', PROFILE_TEXT.moreLabel(p.name));
    row.append(open, more);
    keepers.appendChild(row);
  }
  menu.appendChild(keepers);
  // The child profile's own name and ⋯ (rename), behind the gate like the rest.
  const kid = listProfiles().find((p) => p.id === 'k1');
  if (kid && kids.childElementCount > 0) {
    const more = button(
      `${kid.avatar} ${kid.name} ${PROFILE_TEXT.more}`,
      () => gate(() => manage(o, kid)),
      'btn btn-small title-who-kidmore',
    );
    more.setAttribute('aria-label', PROFILE_TEXT.moreLabel(kid.name));
    menu.appendChild(more);
  }
  if (SAVE_LAYOUT.unifiedSlots) {
    const add = button(
      PROFILE_TEXT.newProfile,
      () => gate(() => newProfile(o)),
      'btn btn-small title-who-add',
    );
    add.disabled = listProfiles().length >= PROFILES.max;
    menu.appendChild(add);
  }
  deletedSection(menu, o);
  if (kids.childElementCount > 0) speakLine(PROFILE_TEXT.childSay);
}

/** Rename and delete, in a small dialog (already past the gate). */
function manage(o: WhoOptions, p: Profile): void {
  const d = modal(o.parent, p.name, PROFILE_TEXT.cancel);
  d.root.classList.add('grown-up-modal');
  const input = el('input');
  input.type = 'text';
  input.value = p.name;
  input.maxLength = PROFILES.nameMax;
  input.setAttribute('aria-label', PROFILE_TEXT.renameAsk);
  const status = el('p', 'help');
  status.setAttribute('role', 'status');
  const save = button(
    PROFILE_TEXT.renameSave,
    () => {
      if (renameProfile(p.id, input.value)) {
        d.hide();
        d.root.remove();
        o.redraw();
      }
    },
    'btn btn-small btn-primary',
  );
  d.body.append(el('label', 'help', PROFILE_TEXT.renameAsk), input, save);
  if (FIXED_PROFILES.includes(p.id)) d.body.appendChild(el('p', 'help', PROFILE_TEXT.removeLocked));
  else {
    const word = el('input');
    word.type = 'text';
    word.autocomplete = 'off';
    word.setAttribute('aria-label', PROFILE_TEXT.removeAsk(p.name, PROFILES.confirmWord));
    const del = button(
      PROFILE_TEXT.removeYes,
      () => {
        if (word.value.trim().toUpperCase() !== PROFILES.confirmWord) return;
        del.disabled = true;
        void deleteProfile(p.id, Date.now()).then((ok) => {
          d.hide();
          d.root.remove();
          if (ok) o.redraw();
        });
      },
      'btn btn-small btn-danger',
    );
    del.disabled = true;
    word.addEventListener('input', () => {
      del.disabled = word.value.trim().toUpperCase() !== PROFILES.confirmWord;
    });
    d.body.append(el('p', 'help', PROFILE_TEXT.removeAsk(p.name, PROFILES.confirmWord)), word, del);
  }
  d.body.appendChild(status);
  d.show();
}

/** + New profile: a Keeper or a child (already past the gate). */
function newProfile(o: WhoOptions): void {
  const d = modal(o.parent, PROFILE_TEXT.newProfile, PROFILE_TEXT.cancel);
  d.root.classList.add('grown-up-modal');
  if (listProfiles().length >= PROFILES.max) {
    d.body.appendChild(el('p', undefined, PROFILE_TEXT.profileFull(PROFILES.max)));
    d.show();
    return;
  }
  const name = el('input');
  name.type = 'text';
  name.maxLength = PROFILES.nameMax;
  name.setAttribute('aria-label', PROFILE_TEXT.renameAsk);
  d.body.append(el('p', 'help', PROFILE_TEXT.newProfileHelp), name);
  for (const [kind, label, avatar] of [
    ['keeper', PROFILE_TEXT.newKeeper, '🧑‍🌾'],
    ['child', PROFILE_TEXT.newChild, '🌱'],
  ] as const)
    d.body.appendChild(
      button(
        label,
        () => {
          if (!addProfile(kind, name.value, avatar)) return;
          d.hide();
          d.root.remove();
          o.redraw();
        },
        'btn btn-small',
      ),
    );
  d.show();
}

/** Deleted profiles inside the 30 days, each with Restore. */
function deletedSection(menu: HTMLElement, o: WhoOptions): void {
  const now = Date.now();
  const gone = listDeleted(now);
  if (gone.length === 0) return;
  const box = el('details', 'title-who-deleted');
  box.appendChild(el('summary', undefined, PROFILE_TEXT.deletedHead));
  for (const d of gone) {
    const days = Math.floor((now - d.atWallMs) / 86_400_000);
    const row = el('div', 'title-slot');
    row.appendChild(el('span', 'title-slot-main', PROFILE_TEXT.deletedRow(d.profile.name, days)));
    row.appendChild(
      button(
        PROFILE_TEXT.restore,
        () =>
          void askGrownUp(o.parent, () => undefined).then(
            (ok) => ok && void restoreProfile(d.profile.id, Date.now()).then(() => o.redraw()),
          ),
        'btn btn-small',
      ),
    );
    box.appendChild(row);
  }
  menu.appendChild(box);
}

/** R0598: "Your saves moved", once, with Combine endings. */
export function showMovedCard(parent: HTMLElement): void {
  const m = movedCardDue();
  if (!m) return;
  const d = modal(parent, PROFILE_TEXT.movedTitle, PROFILE_TEXT.movedOk);
  const moved = m.p1.filter(Boolean).length + m.k1.filter(Boolean).length;
  d.body.appendChild(el('p', undefined, PROFILE_TEXT.movedBody(moved)));
  if (m.older.length > 0)
    d.body.appendChild(el('p', 'help', PROFILE_TEXT.movedOlder(m.older.length)));
  const sources = endingSources();
  const targets = hazelTargets();
  const status = el('p', 'help');
  status.setAttribute('role', 'status');
  if (sources.length > 0 && targets.length > 0) {
    d.body.appendChild(el('div', 'btn-name', PROFILE_TEXT.movedCombine));
    d.body.appendChild(el('p', 'help', PROFILE_TEXT.movedCombineHelp));
    const row = el('div', 'journal-actions');
    for (const index of targets) {
      const where = SLOT_TEXT.slot(index);
      row.appendChild(
        button(
          PROFILE_TEXT.movedCombineInto(where),
          () => {
            const ok = sources.every((k) => combineInto(k, index));
            status.textContent = ok
              ? PROFILE_TEXT.movedCombined(where)
              : PROFILE_TEXT.movedCombineFailed;
          },
          'btn btn-small',
        ),
      );
    }
    d.body.appendChild(row);
  }
  d.body.append(
    status,
    button(PROFILE_TEXT.movedOk, () => d.hide(), 'btn btn-primary'),
  );
  markMovedSeen();
  d.show();
}

/** R0598: Older saves, each with "Put in Slot n" for the first empty unified slot. */
export function renderOlder(menu: HTMLElement, say: (t: string) => void, redraw: () => void): void {
  const older = olderSaves();
  if (older.length === 0) return;
  const section = el('div', 'title-mode title-older');
  section.appendChild(el('div', 'title-mode-name', PROFILE_TEXT.olderHead));
  section.appendChild(el('div', 'title-mode-blurb', PROFILE_TEXT.olderHelp));
  const free = unifiedSlots().findIndex((s) => s === null) + 1;
  for (const o of older) {
    const row = el('div', 'title-slot');
    const s = o.summary;
    row.appendChild(
      el(
        'span',
        'title-slot-main',
        s ? `${s.names.join(', ') || SLOT_TEXT.nubbins(s.nubbins)}` : o.key,
      ),
    );
    const put = button(
      free > 0 ? PROFILE_TEXT.olderSwap(SLOT_TEXT.slot(free)) : PROFILE_TEXT.olderNoRoom,
      () => {
        if (free > 0 && swapOlder(o.key, free)) {
          redraw();
          say(PROFILE_TEXT.olderSwapped(SLOT_TEXT.slot(free)));
        }
      },
      'btn btn-small',
    );
    put.disabled = free === 0;
    row.appendChild(put);
    section.appendChild(row);
  }
  menu.appendChild(section);
}
