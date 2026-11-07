import { SLOT_LINES_TEXT } from '../config/strings-camp';
import { confirmModal } from './confirm';
import { TRASH_TEXT } from '../config/strings-r9d3';
import { SLOT_TRASH } from '../config/tuning-r9d3';
import { keepInTrash, listTrash, restoreTrash, trashSlot } from '../platform/slot-trash';
import { titleGate } from './title-gate'; /* Lane E r9 */
import { showFirstNubbin } from './kids-portrait'; /* Lane E r10 */
import { CAMP_TEXT } from '../config/strings';
import {
  KEEPER_LOOK_BLURBS,
  KEEPER_LOOK_NAMES,
  NAMES,
  SLOT_TEXT,
  STORYLINE_TEXT,
} from '../config/strings';
import { STORY_TEXT } from '../config/story';
import { playSong } from '../platform/audio';
import {
  hasSave,
  summarize,
  readGraphicsPref,
  readSlotIndex,
  slotId,
  readThumb,
  storageAvailable,
  writeGraphicsPref,
  isStorylineMode,
  storylineFinished,
  SLOTS_PER_MODE,
  slotsFor,
  copySlot,
  profileOf,
  beginVisit,
  keeperProfile,
  readSlotSummaryOf,
  setKeeperProfile,
  childProfile,
  setChildProfile,
  type SaveMode,
  type SaveSlot,
  type SaveSummary,
} from '../platform/storage';
import type { KeeperAlignment } from '../sim/types';
import { TRAINERS } from '../sim/trainers';
import { button, el } from './dom';
import { askGrownUp } from './grown-up-gate';
import { EDU_AGES, type EduAge } from '../config/edu';
import type { EduBand } from '../content/types';
import { EDU_STORY_TEXT, EDU_TEXT, UI_TEXT } from '../config/strings';
import { AGE_PICK_TEXT } from '../config/strings-kids';
import { speakLater } from './speak-lazy';
import { UI_FX_TEXT } from '../config/strings-ui';
import { SLOT_LABEL_TEXT } from '../config/strings';
import { openSlotLabel, slotName, slotTagText, tagRow } from './title-slots';
import { C11_TEXT } from '../config/strings';
/* Lane E r9, R0696 / R0720 */
import { eduTagLabel, tagCss, tagStep, type EduTag } from './kids-launch';
/* Lane C r11 (R0621): 8 Hazel's Grove slots as cards, play time, Copy. */
import { SAVE_LAYOUT_TEXT } from '../config/strings-camp11-save';
import '../save-r11.css';
import '../camp-r11.css';
/* Lane C r11 helper "profiles" (R0598, R0621, R0627, R0628, R0653) */
import { TITLE_R13_TEXT } from '../config/strings-r13d3';
import { PROFILE_TEXT } from '../config/strings-camp11-profiles';
import { continueSlot } from './install-hint';
import { unifiedActive } from '../platform/unified-keys';
import {
  FIXED_PROFILES,
  listProfiles,
  markLastProfile,
  profileById,
  purgeDeleted,
} from '../platform/profiles';

/** R0621: the big Continue, or nothing when no slot was played yet. */
function continueHeader(
  slot: SaveSlot | null,
  what: string,
  onContinue: () => void,
): HTMLElement | null {
  if (!slot || !hasSave(slot)) return null;
  const b = button('', onContinue, 'btn btn-primary title-continue');
  const thumb = slot.mode === 'edu' ? null : readThumb(slot);
  if (thumb) {
    const img = el('img', 'title-slot-thumb') as HTMLImageElement;
    img.src = thumb;
    img.alt = '';
    img.width = 80;
    img.height = 45;
    b.classList.add('title-slot-has-thumb');
    b.append(img);
  }
  b.append(
    el('strong', undefined, PROFILE_TEXT.continueBig),
    el('small', undefined, PROFILE_TEXT.continueWhere(SLOT_TEXT.slot(slot.index), what)),
  );
  return b;
}

/** Does the title open on "Who's playing?" (a child's Grove, or more than the two profiles)? */
function pickerDue(): boolean {
  const kids = Array.from({ length: slotsFor('edu') }, (_, i) =>
    readSlotSummaryOf('k1', { mode: 'edu', index: i + 1 }),
  ).some(Boolean);
  return kids || listProfiles().length > FIXED_PROFILES.length;
}

export interface TitleChoice {
  slot: SaveSlot;
  /** Start fresh (erase that slot) instead of continuing. */
  fresh: boolean;
  /** Trainer for a new campaign. */
  trainer: string | null;
  /** A separate campaign to start (its storyline id), for the storyline modes. */
  storyline?: string;
  /** Age band for a new Learning Grove. */
  age?: EduAge;
  /** The story's band for a new Learning Grove (Grove Readers picks age 6 for the games). */
  band?: EduBand;
  /** Lane E r9, R0696: the new Learning Grove's name, colour and animal. */
  tag?: EduTag;
  /** R0627: a new Hazel's Grove slot as a Sandbox: the story off until Settings starts it. */
  sandbox?: boolean;
}

const MODES: SaveMode[] = ['campaign', 'hundred', 'logged', 'beetle', 'dawndusk', 'free', 'edu'];

/** Which storyline a new save in a storyline mode plays (Dawn & Dusk asks first). */
const MODE_STORYLINE: Record<string, string> = {
  hundred: 'hundred',
  logged: 'logged',
  beetle: 'beetle',
};

/** One line about a save: who, how many, how far, when. */
function describe(mode: SaveMode, s: SaveSummary, nowMs: number): string {
  const parts: string[] = [];
  const story = mode === 'campaign' || isStorylineMode(mode);
  /* Lane E r9, R0696: a Learning Grove slot names its child first. */
  if (mode === 'edu' && (s.eduName || s.eduIcon)) parts.push(eduTagLabel(s, 0));
  if (story && s.trainer) parts.push(KEEPER_LOOK_NAMES[s.trainer] ?? s.trainer);
  if (mode === 'dawndusk' && s.storyline)
    parts.push(STORYLINE_TEXT.sides[s.storyline] ?? s.storyline);
  if (story && s.chapter !== null) parts.push(SLOT_TEXT.chapter(s.chapter));
  if (mode === 'edu' && s.eduBand === 'reader')
    parts.push(SLOT_TEXT.age(s.eduReaderAge ?? EDU_STORY_TEXT.readerAges)); /* Lane E r10 */
  else if (mode === 'edu' && s.eduAge !== null) parts.push(SLOT_TEXT.age(s.eduAge));
  parts.push(s.names.length > 0 ? s.names.join(', ') : SLOT_TEXT.nubbins(s.nubbins));
  // Lane C r8 (R0648): Hazel's Grove names its other roads, a check on each one ended.
  if (mode === 'campaign') parts.push(...slotStories(s));
  if (story && s.playMs >= 60_000) parts.push(SAVE_LAYOUT_TEXT.played(s.playMs));
  if (s.savedAtWallMs > 0) {
    const days = Math.floor((nowMs - s.savedAtWallMs) / 86_400_000);
    parts.push(SLOT_TEXT.ago(days));
  }
  return parts.join(' · ');
}

/** R0648: a line glyph per road walked (✓ once ended), and the stories done. */
export function slotStories(s: SaveSummary): string[] {
  const out: string[] = [];
  const glyphs = Object.entries(s.lines ?? {})
    .map(
      ([id, st]) =>
        `${SLOT_LINES_TEXT.glyph[id] ?? id}${st === 'done' ? SLOT_LINES_TEXT.done : ''}`,
    )
    .join(' ');
  if (glyphs) out.push(glyphs);
  if (s.questsDone) out.push(SLOT_LINES_TEXT.stories(s.questsDone));
  return out;
}

/**
 * The title screen: three save slots for each mode (the campaign, the Free Grove, the
 * Learning Grove). A filled slot continues, or starts over after a confirm, or is
 * erased; an empty one starts new. A new campaign asks which Keeper you are first; a
 * new Learning Grove asks the child's age. `focusMode` scrolls that mode's slots into view
 * (an old `?edu` link lands on the Learning Grove without touching any save).
 */
export function showTitle(
  parent: HTMLElement,
  onChoose: (c: TitleChoice) => void,
  focusMode?: SaveMode,
): void {
  const root = el('div', 'title');
  playSong('title');
  const card = el('div', 'title-card');
  card.appendChild(el('div', 'title-logo', `🌿 ${NAMES.game}`));
  const sub = el('div', 'title-sub', STORY_TEXT.title);
  const tag = el('div', 'title-tag', STORY_TEXT.tagline);
  card.append(sub, tag);
  card.appendChild(titleGate()); /* Lane E r9, R0356: the living gate */
  // R0720: the Learning Grove's age screen carries its own subtitle, not the campaign's.
  const subtitle = (edu: boolean) => {
    sub.textContent = edu ? EDU_TEXT.learningGrove : STORY_TEXT.title;
    tag.textContent = edu ? AGE_PICK_TEXT.tagline : STORY_TEXT.tagline;
  };
  // With storage blocked every slot reads empty: say why before the player starts (review C, 11).
  if (!storageAvailable()) {
    const notice = el('p', 'title-storage', UI_TEXT.storageBlockedTitle);
    notice.setAttribute('role', 'alert');
    card.appendChild(notice);
  }
  // The renderer: a device-wide choice, made here because no save is open yet.
  const graphicsRow = el('label', 'field-row title-graphics');
  const graphicsSel = el('select');
  for (const [value, text] of Object.entries(UI_TEXT.graphicsLevels)) {
    const o = el('option', undefined, text);
    o.value = value;
    graphicsSel.appendChild(o);
  }
  graphicsSel.value = readGraphicsPref();
  graphicsSel.addEventListener('change', () => {
    writeGraphicsPref(graphicsSel.value === '3d' ? '3d' : 'pixel');
  });
  graphicsRow.append(el('strong', undefined, UI_TEXT.graphicsLabel), graphicsSel);
  card.appendChild(graphicsRow);
  // R0621: what a slot action did (a copy, or why it could not), read out too.
  const sayLine = el('p', 'title-status');
  sayLine.setAttribute('role', 'status');
  card.appendChild(sayLine);
  const say = (text: string): void => {
    sayLine.textContent = text;
  };
  // The slot list comes after the renderer pick, so the pick is in the first screenful.
  const menu = el('div', 'title-menu');
  card.appendChild(menu);
  root.appendChild(card);
  parent.appendChild(root);

  const finish = (c: TitleChoice) => {
    root.remove();
    markLastProfile(profileOf(c.slot));
    onChoose(c);
  };

  /** Starting new in a slot: the campaign and the Learning Grove ask a question first. */
  const startNew = (slot: SaveSlot) => {
    if (slot.mode === 'campaign') keeperMenu(slot);
    else if (slot.mode === 'dawndusk') sideMenu(slot);
    else if (isStorylineMode(slot.mode)) keeperMenu(slot, MODE_STORYLINE[slot.mode]);
    else if (slot.mode === 'edu') ageMenu(slot);
    else finish({ slot, fresh: true, trainer: null });
  };

  const mainMenu = () => {
    menu.innerHTML = '';
    const now = Date.now();
    // R0628: back to "Who's playing?" when there is a child's Grove to pick.
    if (pickerDue()) {
      const who = button(
        `← ${PROFILE_TEXT.whoTitle}`,
        () => whoMenu(),
        'btn btn-small title-who-back',
      );
      who.setAttribute('aria-label', PROFILE_TEXT.backLabel);
      menu.appendChild(who);
    }
    // R0447 (r14): a returning player sees the big Continue and one fold, not every slot row.
    let headShown = false;
    // R0621: the slot played last, big, before every card.
    const last = continueSlot();
    if (last && last.mode !== 'edu') {
      const s = readSlotIndex().slots[slotId(last)]?.summary ?? null;
      const head = continueHeader(last, s ? describe(last.mode, s, now) : '', () =>
        finish({ slot: last, fresh: false, trainer: null }),
      );
      if (head) {
        menu.appendChild(head);
        headShown = true;
      }
    }
    // Lane C r10 agent B (R0622): one read of the slot index in place of parsing every save.
    const slotIndex = readSlotIndex();
    /* Lane E r9, R0696: the Learning Grove moves to the top once a child has a Grove. */
    const kidsFirst = Array.from(
      { length: slotsFor('edu') },
      (_, i) => slotIndex.slots[slotId({ mode: 'edu', index: i + 1 })] !== undefined,
    ).some(Boolean);
    const order = kidsFirst ? ['edu' as SaveMode, ...MODES.filter((m) => m !== 'edu')] : MODES;
    // Lane C r11 (R0611): the four questline saves sit in one fold, since the Grove offers
    // those lines in its own regions; the fold opens when any of them already has a save.
    const ROADS: SaveMode[] = ['hundred', 'logged', 'beetle', 'dawndusk'];
    // R0611 (round 13): with the unified slots the lines are begun in their regions, so only a
    // road that already has a separate save is listed here (no empty "new" cards for them).
    const inWorld = unifiedActive();
    const roads = el('details', 'title-roads');
    roads.appendChild(el('summary', 'title-roads-sum', C11_TEXT.roadsHead));
    roads.appendChild(el('p', 'help', C11_TEXT.roadsHelp));
    // R0447: only the first empty slot of a mode shows; the rest wait in one "Load another
    // save" fold, so the first screen of a new save is a handful of buttons.
    const spare: Array<{ modeName: string; row: HTMLElement }> = [];
    const returning = (): boolean => headShown && !focusMode;
    for (const mode of order) {
      const isRoad = ROADS.includes(mode);
      let emptyShown = 0;
      if (
        inWorld &&
        isRoad &&
        !Array.from(
          { length: slotsFor(mode) },
          (_, i) => slotIndex.slots[slotId({ mode, index: i + 1 })],
        ).some(Boolean)
      )
        continue;
      const section = el('div', 'title-mode');
      const modeName = SLOT_TEXT.modes[mode] ?? mode;
      section.appendChild(el('div', 'title-mode-name', modeName));
      // One line on what the mode is, so three identical "Empty" rows are not all it says.
      const blurb = UI_FX_TEXT.modeBlurbs[mode];
      if (blurb) section.appendChild(el('div', 'title-mode-blurb', blurb));
      if (slotsFor(mode) > SLOTS_PER_MODE) section.classList.add('title-mode-grid');
      for (let index = 1; index <= slotsFor(mode); index++) {
        const slot: SaveSlot = { mode, index };
        const row = el('div', 'title-slot');
        const entry = slotIndex.slots[slotId(slot)];
        const filled = entry !== undefined;
        if (inWorld && isRoad && !filled) continue;
        const summary = entry?.summary ?? null;
        if (filled) {
          const main = button(
            '',
            () => finish({ slot, fresh: false, trainer: null }),
            'btn btn-primary title-slot-main',
          );
          // R0649: the slot's name and tag (icon and word) lead what the row says.
          const said = [
            slotTagText(summary?.label?.tag),
            summary ? describe(mode, summary, now) : '',
          ]
            .filter((t) => t.length > 0)
            .join(' · ');
          main.append(
            el('strong', undefined, `${slotName(index, summary)} · ${SLOT_TEXT.continue}`),
            el('small', undefined, said),
          );
          /* Lane E r10, R0696: the child's first Nubbin leads a Learning Grove tile. */
          if (mode === 'edu') {
            const pic = el('span', 'title-slot-icon', summary?.eduIcon ?? '🌱');
            pic.setAttribute('aria-hidden', 'true');
            main.classList.add('title-slot-has-pic');
            main.prepend(pic);
            showFirstNubbin(slot, pic);
          }
          // R0447: the picture the last autosave took, when there is one.
          const thumb = mode === 'edu' ? null : readThumb(slot);
          if (thumb) {
            const img = el('img', 'title-slot-thumb') as HTMLImageElement;
            img.src = thumb;
            img.alt = '';
            img.width = 80;
            img.height = 45;
            main.classList.add('title-slot-has-thumb');
            main.prepend(img);
          }
          main.setAttribute('aria-label', SLOT_TEXT.continueLabel(modeName, index, said));
          // A Learning Grove slot is a child's: erasing it, or starting over it, asks the
          // grown-up gate first (review C, item 4).
          const grownUp = (then: () => void) => {
            if (mode !== 'edu') then();
            else void askGrownUp(parent, () => undefined).then((ok) => ok && then());
          };
          const fresh = button(
            SLOT_TEXT.newHere,
            () => {
              const ask = { title: CAMP_TEXT.confirmTitle, body: SLOT_TEXT.newOverConfirm(index) };
              void confirmModal({ ...ask, confirm: CAMP_TEXT.startOverYes, danger: true }).then(
                // TECH-29: the old save is kept for a week before the new one replaces it.
                (ok) =>
                  ok &&
                  grownUp(() => {
                    keepInTrash(slot, Date.now());
                    startNew(slot);
                  }),
              );
            },
            'btn btn-small',
          );
          fresh.setAttribute('aria-label', SLOT_TEXT.newOverLabel(modeName, index));
          // TECH-29: Erase sits behind ⋯ (not beside Continue), is held for a moment, and
          // the slot is kept for a week under Recently erased.
          const erase = button(
            SLOT_TEXT.erase,
            () => {
              const ask = {
                title: CAMP_TEXT.confirmTitle,
                body: `${TRASH_TEXT.eraseBody(index, said)} ${TRASH_TEXT.holdHint}`,
              };
              void confirmModal({
                ...ask,
                confirm: TRASH_TEXT.holdToErase,
                danger: true,
                holdMs: SLOT_TRASH.holdMs,
              }).then(
                (ok) =>
                  ok &&
                  grownUp(() => {
                    trashSlot(slot, Date.now());
                    mainMenu();
                  }),
              );
            },
            'btn btn-small btn-danger title-slot-erase',
          );
          erase.hidden = true;
          // R0621: Copy waits behind the same ⋯, into the mode's first empty slot.
          const copy = button(
            SAVE_LAYOUT_TEXT.copy,
            () => {
              let to = 0;
              for (let i = 1; i <= slotsFor(mode) && to === 0; i++)
                if (!slotIndex.slots[slotId({ mode, index: i })]) to = i;
              if (to === 0) return say(SAVE_LAYOUT_TEXT.copyNoRoom);
              if (!copySlot(slot, { mode, index: to })) return say(SAVE_LAYOUT_TEXT.copyFailed);
              mainMenu();
              say(SAVE_LAYOUT_TEXT.copied(to));
            },
            'btn btn-small title-slot-copy',
          );
          copy.hidden = true;
          copy.setAttribute(
            'aria-label',
            SAVE_LAYOUT_TEXT.copyLabel(`${modeName}, ${SLOT_TEXT.slot(index)}`),
          );
          // Lane C r11 (R0667, R0669): Compare and Visit, read-only, behind the same ⋯.
          const compare = button(
            C11_TEXT.compare,
            () => {
              const others = Array.from({ length: slotsFor(mode) }, (_, i) => i + 1)
                .filter((i) => i !== index && slotIndex.slots[slotId({ mode, index: i })])
                .map((i) => ({
                  index: i,
                  summary: slotIndex.slots[slotId({ mode, index: i })]!.summary ?? null,
                }));
              void import('./title-compare').then((m) =>
                m.openCompare(document.body, { index, summary }, others),
              );
            },
            'btn btn-small',
          );
          const visit = button(
            C11_TEXT.visit,
            () =>
              void import('./title-compare').then((m) =>
                m.openVisit(document.body, { index, summary }),
              ),
            'btn btn-small',
          );
          compare.hidden = true;
          visit.hidden = true;
          const more = button(
            TRASH_TEXT.more,
            () => {
              more.hidden = true;
              compare.hidden = mode === 'edu';
              visit.hidden = mode === 'edu';
              copy.hidden = false;
              erase.hidden = false;
              erase.focus();
            },
            'btn btn-small btn-icon title-slot-more',
          );
          more.setAttribute('aria-label', TRASH_TEXT.moreLabel(modeName, index));
          erase.title = SLOT_TEXT.erase;
          // Each mode has a Slot 1: the mode name tells the three apart (review C, item 25).
          erase.setAttribute(
            'aria-label',
            `${SLOT_TEXT.erase} ${modeName}, ${SLOT_TEXT.slot(index)}`,
          );
          const name = button(
            '✎',
            () => openSlotLabel(document.body, slot, summary, mainMenu),
            'btn btn-small btn-icon title-slot-name',
          );
          name.title = SLOT_LABEL_TEXT.rename;
          name.setAttribute(
            'aria-label',
            SLOT_LABEL_TEXT.renameLabel(`${modeName}, ${SLOT_TEXT.slot(index)}`),
          );
          tagRow(row, summary);
          row.append(main, name, fresh, more, copy, compare, visit, erase);
          /* Lane E r9, R0696: the child's colour tag down the slot's edge. */
          const tagColour = mode === 'edu' ? tagCss(summary?.eduColour) : null;
          if (tagColour) {
            row.classList.add('title-slot-tagged');
            row.style.setProperty('--tag', tagColour);
          }
        } else if (mode === 'campaign') {
          // R0621 / R0627: an empty Hazel's Grove card offers the story or a Sandbox.
          row.classList.add('title-slot-empty');
          row.appendChild(
            el('strong', 'title-slot-empty-name', `${SLOT_TEXT.slot(index)} · ${SLOT_TEXT.empty}`),
          );
          const where = `${modeName}, ${SLOT_TEXT.slot(index)}`;
          const story = button(
            PROFILE_TEXT.newStory,
            () => keeperMenu(slot),
            'btn btn-small btn-primary',
          );
          story.title = PROFILE_TEXT.newStoryHelp;
          story.setAttribute('aria-label', PROFILE_TEXT.newStoryLabel(where));
          const sand = button(
            PROFILE_TEXT.sandbox,
            () => keeperMenu(slot, undefined, undefined, true),
            'btn btn-small',
          );
          sand.title = PROFILE_TEXT.sandboxHelp;
          sand.setAttribute('aria-label', PROFILE_TEXT.sandboxLabel(where));
          row.append(story, sand);
        } else {
          const main = button('', () => startNew(slot), 'btn title-slot-main');
          main.append(
            el('strong', undefined, `${SLOT_TEXT.slot(index)} · ${SLOT_TEXT.empty}`),
            el('small', undefined, SLOT_TEXT.newHere),
          );
          main.setAttribute('aria-label', SLOT_TEXT.newLabel(modeName, index));
          row.append(main);
        }
        if (!isRoad && (returning() || (!filled && ++emptyShown > 1)))
          spare.push({ modeName, row });
        else section.appendChild(row);
      }
      if (ROADS.includes(mode)) {
        roads.appendChild(section);
        const used = Array.from({ length: slotsFor(mode) }, (_, i) =>
          slotId({ mode, index: i + 1 }),
        ).some((k) => slotIndex.slots[k]);
        if ((used && !returning()) || mode === focusMode) roads.open = true;
        if (!roads.isConnected) menu.appendChild(roads);
      } else if (!returning() || section.querySelector('.title-slot')) menu.appendChild(section);
      if (mode === focusMode) focus.section = section;
    }
    if (spare.length > 0) {
      const fold = el('details', 'title-mode title-spare');
      fold.appendChild(el('summary', 'title-mode-name', TITLE_R13_TEXT.loadAnother));
      fold.appendChild(el('p', 'help', TITLE_R13_TEXT.loadAnotherHelp));
      const grid = el('div', 'title-spare-grid');
      let last = '';
      for (const s of spare) {
        if (s.modeName !== last) grid.appendChild(el('div', 'title-mode-name', s.modeName));
        last = s.modeName;
        grid.appendChild(s.row);
      }
      fold.appendChild(grid);
      menu.appendChild(fold);
    }
    const olderHost = el('div');
    menu.appendChild(olderHost);
    void import('./title-profiles').then((m) => m.renderOlder(olderHost, say, mainMenu)); // R0598: saves that did not fit the 8 slots
    visitOthers(now);
    recentlyErased(now);
  };

  /**
   * R0669 (CAMP-77): the other Keepers' Groves, opened read-only: the game draws the world
   * as saved, frozen, and writes nothing (storage refuses every write during a visit).
   */
  const visitOthers = (now: number) => {
    const others = listProfiles().filter((p) => p.kind === 'keeper' && p.id !== keeperProfile());
    const rows: HTMLElement[] = [];
    for (const p of others)
      for (const mode of MODES) {
        if (mode === 'edu') continue;
        for (let index = 1; index <= slotsFor(mode); index++) {
          const slot: SaveSlot = { mode, index };
          const s = readSlotSummaryOf(p.id, slot);
          if (!s) continue;
          const where = `${SLOT_TEXT.modes[mode] ?? mode} · ${SLOT_TEXT.slot(index)}`;
          const b = button(
            '',
            () => {
              if (beginVisit(p.id)) finish({ slot, fresh: false, trainer: null });
            },
            'btn title-slot-main',
          );
          b.append(
            el('strong', undefined, SAVE_LAYOUT_TEXT.visitSlot(p.name, where)),
            el('small', undefined, describe(mode, s, now)),
          );
          const row = el('div', 'title-slot');
          row.appendChild(b);
          rows.push(row);
        }
      }
    if (rows.length === 0) return;
    const fold = el('details', 'title-mode title-visit');
    fold.appendChild(el('summary', 'title-mode-name', SAVE_LAYOUT_TEXT.visitOthers));
    fold.appendChild(el('p', 'help', SAVE_LAYOUT_TEXT.visitOthersHelp));
    fold.append(...rows);
    menu.appendChild(fold);
  };

  /** TECH-29: erased slots from the last week, each with Restore while its slot is empty. */
  const recentlyErased = (now: number) => {
    const kept = listTrash(MODES, slotsFor, now);
    if (kept.length === 0) return;
    const section = el('div', 'title-mode title-trash');
    section.appendChild(el('div', 'title-mode-name', TRASH_TEXT.recent));
    for (const k of kept) {
      const modeName = SLOT_TEXT.modes[k.slot.mode] ?? k.slot.mode;
      const s = summarize(k.json);
      const said = s ? describe(k.slot.mode, s, now) : '';
      const days = Math.floor((now - k.at) / (24 * 60 * 60 * 1000));
      const row = el('div', 'title-slot');
      const info = el('div', 'title-slot-main title-trash-info');
      info.append(
        el('strong', undefined, `${modeName} · ${SLOT_TEXT.slot(k.slot.index)}`),
        el('small', undefined, [said, TRASH_TEXT.erasedAgo(days)].filter(Boolean).join(' · ')),
      );
      const inUse = hasSave(k.slot);
      const back = button(
        inUse ? TRASH_TEXT.slotInUse : TRASH_TEXT.restore,
        () => {
          if (restoreTrash(k.slot)) mainMenu();
        },
        'btn btn-small',
      );
      back.disabled = inUse;
      back.setAttribute('aria-label', TRASH_TEXT.restoreLabel(modeName, k.slot.index));
      row.append(info, back);
      section.appendChild(row);
    }
    menu.appendChild(section);
  };
  const focus = { section: null as HTMLElement | null };

  const ageMenu = (slot: SaveSlot) => {
    menu.innerHTML = '';
    subtitle(true);
    // Lane E r9, R0720 / R0696: the age pick leads to the name, colour and animal step.
    const named = (c: TitleChoice) =>
      tagStep(
        menu,
        (tag) => finish({ ...c, tag }),
        backButton(() => ageMenu(slot), true),
      );
    menu.appendChild(el('div', 'help', EDU_TEXT.chooseAge));
    // R0720: four sprout tiles in a row, then one wide reader tile, so nothing wraps at 375 px.
    const row = el('div', 'title-ages');
    for (const age of EDU_AGES) {
      const b = button(
        '',
        () => named({ slot, fresh: true, trainer: null, age, band: 'sprout' }),
        'btn title-age',
      );
      b.append(el('span', 'title-age-n', String(age)), el('span', 'title-age-badge', '🌱'));
      row.appendChild(b);
    }
    menu.appendChild(row);
    // Grove Readers (7–10): the story in the reader band; the six games stay at their top age.
    const reader = button(
      '',
      () => named({ slot, fresh: true, trainer: null, age: 6, band: 'reader' }),
      'btn title-age title-age-reader',
    );
    reader.append(
      el('span', 'title-age-n', EDU_STORY_TEXT.readerAges),
      el('span', undefined, `📚 ${AGE_PICK_TEXT.reader}`),
    );
    menu.appendChild(reader);
    menu.appendChild(el('div', 'help', EDU_TEXT.ageHelp));
    menu.appendChild(
      backButton(() => {
        subtitle(false);
        mainMenu();
      }, true),
    );
    speakLater(EDU_TEXT.chooseAge);
  };

  /** Dawn & Dusk: pick a half; the other opens once one half has reached an ending. */
  const sideMenu = (slot: SaveSlot) => {
    menu.innerHTML = '';
    menu.appendChild(el('div', 'help', STORYLINE_TEXT.chooseSide));
    const row = el('div', 'title-ages');
    const done = {
      dawn: storylineFinished('dawndusk', 'dawn'),
      dusk: storylineFinished('dawndusk', 'dusk'),
    };
    for (const side of ['dawn', 'dusk'] as const) {
      const other = side === 'dawn' ? 'dusk' : 'dawn';
      const locked = !done[side] && !done[other] && side === 'dusk';
      const b = button(
        STORYLINE_TEXT.sides[side] ?? side,
        () => keeperMenu(slot, side, side === 'dawn' ? 'sun' : 'moon'),
        'btn title-age',
      );
      b.disabled = locked;
      b.title = locked
        ? STORYLINE_TEXT.locked(STORYLINE_TEXT.sides[other] ?? other)
        : (STORYLINE_TEXT.sideHelp[side] ?? '');
      row.appendChild(b);
    }
    menu.appendChild(row);
    menu.appendChild(el('div', 'help', STORYLINE_TEXT.sideHelp.dawn ?? ''));
    menu.appendChild(backButton(mainMenu));
  };

  const keeperMenu = (
    slot: SaveSlot,
    storyline?: string,
    side?: KeeperAlignment,
    sandbox = false,
  ) => {
    menu.innerHTML = '';
    menu.appendChild(el('div', 'help', STORY_TEXT.chooseKeeper));
    const grid = el('div', 'title-keepers');
    for (const t of TRAINERS) {
      if (side && t.band !== side) continue;
      const label = KEEPER_LOOK_NAMES[t.id] ?? t.id;
      const b = button(
        '',
        () =>
          finish({
            slot,
            fresh: true,
            trainer: t.id,
            ...(storyline ? { storyline } : {}),
            ...(sandbox ? { sandbox: true } : {}),
          }),
        'btn title-keeper',
      );
      b.appendChild(portrait(t.id));
      b.appendChild(el('span', undefined, label));
      const sideName = t.band === 'sun' ? `☀ ${NAMES.playerSun}` : `☾ ${NAMES.playerMoon}`;
      const blurb = `${sideName} · ${KEEPER_LOOK_BLURBS[t.id] ?? ''}`;
      b.appendChild(el('small', 'title-keeper-blurb', blurb));
      b.setAttribute('aria-label', `${label}. ${blurb}`);
      grid.appendChild(b);
    }
    menu.appendChild(grid);
    menu.appendChild(backButton(mainMenu));
  };

  /** R0628: "Who's playing?": a child's Grove opens in one tap; a Keeper's through the gate. */
  const whoMenu = (): void => {
    menu.innerHTML = '';
    void import('./title-profiles').then((m) =>
      m.renderWho(menu, {
        parent,
        onKeeper: (p) => {
          // R0653: that Keeper's own slots (only p1 has any before the unified slots).
          setChildProfile('k1');
          setKeeperProfile(p.id);
          markLastProfile(keeperProfile());
          mainMenu();
        },
        onChild: (slot, profile) => {
          setChildProfile(profile);
          finish({ slot, fresh: false, trainer: null });
        },
        onNewChild: (profile) => {
          // R0653: a child profile with no Grove yet starts one in its first free slot.
          setChildProfile(profile);
          const free = Array.from({ length: slotsFor('edu') }, (_, i) => i + 1).find(
            (index) => !hasSave({ mode: 'edu', index }),
          );
          if (free === undefined) return say(PROFILE_TEXT.childFull);
          ageMenu({ mode: 'edu', index: free });
        },
        redraw: () => whoMenu(),
      }),
    );
  };

  // A child profile deleted in a past visit does not stay in play.
  if (!profileById(childProfile())) setChildProfile('k1');
  if (pickerDue() && !focusMode) whoMenu();
  else mainMenu();
  // R0598 stage B: the one-time move (off until SAVE_LAYOUT.unifiedSlots), then its card.
  void Promise.all([import('../platform/migrate-unified'), import('./title-profiles')])
    .then(async ([mig, prof]) => {
      await mig.migrateToUnified(Date.now());
      if (root.isConnected) prof.showMovedCard(parent);
    })
    .catch(() => undefined);
  void purgeDeleted(Date.now()).catch(() => undefined); // R0653: past the 30 days
  const section = focus.section;
  if (section) {
    section.scrollIntoView({ block: 'center' });
    section.querySelector('button')?.focus({ preventScroll: true });
  }
}

/**
 * The Keeper's picture on the pick step. R0446 (r12-d3): the sprite painter brings Three.js
 * with it, so the canvas goes in at its final size and is painted once that chunk is in (the
 * boot prefetch has usually fetched it by the time a player reaches this step).
 */
function portrait(trainerId: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width = 64 * scale;
  canvas.height = 64 * scale;
  Promise.all([import('../render/sprites/keeper'), import('../render/sprites/animations')]).then(
    ([{ buildKeeperSheet }, { frameKey }]) => {
      const sheet = buildKeeperSheet(TRAINERS.find((t) => t.id === trainerId)!.look);
      const rect = sheet.frames.get(frameKey('idle', 'front', 0));
      canvas.width = (rect?.w ?? 32) * scale;
      canvas.height = (rect?.h ?? 32) * scale;
      const ctx = canvas.getContext('2d');
      if (ctx && rect) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
          sheet.texture.image as HTMLCanvasElement,
          rect.x,
          rect.y,
          rect.w,
          rect.h,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      }
      sheet.dispose();
    },
    () => undefined,
  );
  return canvas;
}

/** The "←" back to the slot list, named for screen readers (review C, item 23). */
function backButton(onBack: () => void, kids = false): HTMLButtonElement {
  // R0678: the Learning Grove's own steps use a big "← Back" (64 px, a word and an arrow).
  const b = kids
    ? button(`← ${SLOT_TEXT.back}`, onBack, 'btn kids-back')
    : button('←', onBack, 'btn btn-small');
  b.setAttribute('aria-label', SLOT_TEXT.back);
  b.title = SLOT_TEXT.back;
  return b;
}
