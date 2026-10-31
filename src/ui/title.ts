import { SLOT_LINES_TEXT } from '../config/strings-camp';
import { confirmModal } from './confirm';
import { titleGate } from './title-gate'; /* Lane E r9 */
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
  clearSlot,
  hasSave,
  readGraphicsPref,
  readSlotSummary,
  storageAvailable,
  writeGraphicsPref,
  isStorylineMode,
  storylineFinished,
  SLOTS_PER_MODE,
  type SaveMode,
  type SaveSlot,
  type SaveSummary,
} from '../platform/storage';
import type { KeeperAlignment } from '../sim/types';
import { frameKey } from '../render/sprites/animations';
import { buildKeeperSheet } from '../render/sprites/keeper';
import { TRAINERS } from '../sim/trainers';
import { button, el } from './dom';
import { askGrownUp } from './grown-up-gate';
import { EDU_AGES, type EduAge } from '../config/edu';
import type { EduBand } from '../content/types';
import { EDU_STORY_TEXT, EDU_TEXT, UI_TEXT } from '../config/strings';
import { AGE_PICK_TEXT } from '../config/strings-kids';
import { speakLine } from './lesson';
import { UI_FX_TEXT } from '../config/strings-ui';
/* Lane E r9, R0696 / R0720 */
import { eduTagLabel, tagCss, tagStep, type EduTag } from './kids-launch';

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
    parts.push(SLOT_TEXT.age(EDU_STORY_TEXT.readerAges));
  else if (mode === 'edu' && s.eduAge !== null) parts.push(SLOT_TEXT.age(s.eduAge));
  parts.push(s.names.length > 0 ? s.names.join(', ') : SLOT_TEXT.nubbins(s.nubbins));
  // Lane C r8 (R0648): Hazel's Grove names its other roads, a check on each one ended.
  if (mode === 'campaign') parts.push(...slotStories(s));
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
  // The slot list comes after the renderer pick, so the pick is in the first screenful.
  const menu = el('div', 'title-menu');
  card.appendChild(menu);
  root.appendChild(card);
  parent.appendChild(root);

  const finish = (c: TitleChoice) => {
    root.remove();
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
    /* Lane E r9, R0696: the Learning Grove moves to the top once a child has a Grove. */
    const kidsFirst = Array.from({ length: SLOTS_PER_MODE }, (_, i) =>
      hasSave({ mode: 'edu', index: i + 1 }),
    ).some(Boolean);
    const order = kidsFirst ? ['edu' as SaveMode, ...MODES.filter((m) => m !== 'edu')] : MODES;
    for (const mode of order) {
      const section = el('div', 'title-mode');
      const modeName = SLOT_TEXT.modes[mode] ?? mode;
      section.appendChild(el('div', 'title-mode-name', modeName));
      // One line on what the mode is, so three identical "Empty" rows are not all it says.
      const blurb = UI_FX_TEXT.modeBlurbs[mode];
      if (blurb) section.appendChild(el('div', 'title-mode-blurb', blurb));
      for (let index = 1; index <= SLOTS_PER_MODE; index++) {
        const slot: SaveSlot = { mode, index };
        const row = el('div', 'title-slot');
        const filled = hasSave(slot);
        const summary = filled ? readSlotSummary(slot) : null;
        if (filled) {
          const main = button(
            '',
            () => finish({ slot, fresh: false, trainer: null }),
            'btn btn-primary title-slot-main',
          );
          const said = summary ? describe(mode, summary, now) : '';
          main.append(
            el('strong', undefined, `${SLOT_TEXT.slot(index)} · ${SLOT_TEXT.continue}`),
            el('small', undefined, said),
          );
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
                (ok) => ok && grownUp(() => startNew(slot)),
              );
            },
            'btn btn-small',
          );
          fresh.setAttribute('aria-label', SLOT_TEXT.newOverLabel(modeName, index));
          const erase = button(
            '✕',
            () => {
              const ask = { title: CAMP_TEXT.confirmTitle, body: SLOT_TEXT.eraseConfirm(index) };
              void confirmModal({ ...ask, confirm: CAMP_TEXT.eraseYes, danger: true }).then(
                (ok) =>
                  ok &&
                  grownUp(() => {
                    clearSlot(slot);
                    mainMenu();
                  }),
              );
            },
            'btn btn-small btn-icon title-slot-erase',
          );
          erase.title = SLOT_TEXT.erase;
          // Each mode has a Slot 1: the mode name tells the three apart (review C, item 25).
          erase.setAttribute(
            'aria-label',
            `${SLOT_TEXT.erase} ${modeName}, ${SLOT_TEXT.slot(index)}`,
          );
          /* Lane E r9, R0696: the child's colour tag down the slot's edge. */
          const tagColour = mode === 'edu' ? tagCss(summary?.eduColour) : null;
          if (tagColour) {
            row.classList.add('title-slot-tagged');
            row.style.setProperty('--tag', tagColour);
          }
          row.append(main, fresh, erase);
        } else {
          const main = button('', () => startNew(slot), 'btn title-slot-main');
          main.append(
            el('strong', undefined, `${SLOT_TEXT.slot(index)} · ${SLOT_TEXT.empty}`),
            el('small', undefined, SLOT_TEXT.newHere),
          );
          main.setAttribute('aria-label', SLOT_TEXT.newLabel(modeName, index));
          row.append(main);
        }
        section.appendChild(row);
      }
      menu.appendChild(section);
      if (mode === focusMode) focus.section = section;
    }
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
        backButton(() => ageMenu(slot)),
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
      }),
    );
    speakLine(EDU_TEXT.chooseAge);
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

  const keeperMenu = (slot: SaveSlot, storyline?: string, side?: KeeperAlignment) => {
    menu.innerHTML = '';
    menu.appendChild(el('div', 'help', STORY_TEXT.chooseKeeper));
    const grid = el('div', 'title-keepers');
    for (const t of TRAINERS) {
      if (side && t.band !== side) continue;
      const label = KEEPER_LOOK_NAMES[t.id] ?? t.id;
      const b = button(
        '',
        () => finish({ slot, fresh: true, trainer: t.id, ...(storyline ? { storyline } : {}) }),
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

  mainMenu();
  const section = focus.section;
  if (section) {
    section.scrollIntoView({ block: 'center' });
    section.querySelector('button')?.focus({ preventScroll: true });
  }
}

function portrait(trainerId: string): HTMLCanvasElement {
  const sheet = buildKeeperSheet(TRAINERS.find((t) => t.id === trainerId)!.look);
  const rect = sheet.frames.get(frameKey('idle', 'front', 0));
  const canvas = document.createElement('canvas');
  const scale = 2;
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
  return canvas;
}

/** The "←" back to the slot list, named for screen readers (review C, item 23). */
function backButton(onBack: () => void): HTMLButtonElement {
  const b = button('←', onBack, 'btn btn-small');
  b.setAttribute('aria-label', SLOT_TEXT.back);
  b.title = SLOT_TEXT.back;
  return b;
}
