import { NAMES, SLOT_TEXT, TRAINER_LABELS } from '../config/strings';
import { STORY_TEXT } from '../config/story';
import { playSong } from '../platform/audio';
import {
  clearSlot,
  hasSave,
  readGraphicsPref,
  readSlotSummary,
  writeGraphicsPref,
  SLOTS_PER_MODE,
  type SaveMode,
  type SaveSlot,
  type SaveSummary,
} from '../platform/storage';
import { frameKey } from '../render/sprites/animations';
import { buildKeeperSheet } from '../render/sprites/keeper';
import { TRAINERS } from '../sim/trainers';
import { button, el } from './dom';
import { EDU_AGES, type EduAge } from '../config/edu';
import type { EduBand } from '../content/types';
import { EDU_STORY_TEXT, EDU_TEXT, UI_TEXT } from '../config/strings';

export interface TitleChoice {
  slot: SaveSlot;
  /** Start fresh (erase that slot) instead of continuing. */
  fresh: boolean;
  /** Trainer for a new campaign. */
  trainer: string | null;
  /** Age band for a new Learning Grove. */
  age?: EduAge;
  /** The story's band for a new Learning Grove (Grove Readers picks age 6 for the games). */
  band?: EduBand;
}

const MODES: SaveMode[] = ['campaign', 'free', 'edu'];

/** One line about a save: who, how many, how far, when. */
function describe(mode: SaveMode, s: SaveSummary, nowMs: number): string {
  const parts: string[] = [];
  if (mode === 'campaign' && s.trainer) parts.push(TRAINER_LABELS[s.trainer]?.name ?? s.trainer);
  if (mode === 'campaign' && s.chapter !== null) parts.push(SLOT_TEXT.chapter(s.chapter));
  if (mode === 'edu' && s.eduAge !== null) parts.push(SLOT_TEXT.age(s.eduAge));
  parts.push(s.names.length > 0 ? s.names.join(', ') : SLOT_TEXT.nubbins(s.nubbins));
  if (s.savedAtWallMs > 0) {
    const days = Math.floor((nowMs - s.savedAtWallMs) / 86_400_000);
    parts.push(SLOT_TEXT.ago(days));
  }
  return parts.join(' · ');
}

/**
 * The title screen: three save slots for each mode (the campaign, the Free Grove, the
 * Learning Grove). A filled slot continues, or starts over after a confirm, or is
 * erased; an empty one starts new. A new campaign asks which Keeper you are first; a
 * new Learning Grove asks the child's age.
 */
export function showTitle(parent: HTMLElement, onChoose: (c: TitleChoice) => void): void {
  const root = el('div', 'title');
  playSong('title');
  const card = el('div', 'title-card');
  card.appendChild(el('div', 'title-logo', `🌿 ${NAMES.game}`));
  card.appendChild(el('div', 'title-sub', STORY_TEXT.title));
  card.appendChild(el('div', 'title-tag', STORY_TEXT.tagline));
  const menu = el('div', 'title-menu');
  card.appendChild(menu);
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
  root.appendChild(card);
  parent.appendChild(root);

  const finish = (c: TitleChoice) => {
    root.remove();
    onChoose(c);
  };

  /** Starting new in a slot: the campaign and the Learning Grove ask a question first. */
  const startNew = (slot: SaveSlot) => {
    if (slot.mode === 'campaign') keeperMenu(slot);
    else if (slot.mode === 'edu') ageMenu(slot);
    else finish({ slot, fresh: true, trainer: null });
  };

  const mainMenu = () => {
    menu.innerHTML = '';
    const now = Date.now();
    for (const mode of MODES) {
      const section = el('div', 'title-mode');
      section.appendChild(el('div', 'title-mode-name', SLOT_TEXT.modes[mode] ?? mode));
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
          main.append(
            el('strong', undefined, `${SLOT_TEXT.slot(index)} · ${SLOT_TEXT.continue}`),
            el('small', undefined, summary ? describe(mode, summary, now) : ''),
          );
          const fresh = button(
            SLOT_TEXT.newHere,
            () => {
              if (!confirm(SLOT_TEXT.newOverConfirm(index))) return;
              startNew(slot);
            },
            'btn btn-small',
          );
          const erase = button(
            '✕',
            () => {
              if (!confirm(SLOT_TEXT.eraseConfirm(index))) return;
              clearSlot(slot);
              mainMenu();
            },
            'btn btn-small btn-icon',
          );
          erase.title = SLOT_TEXT.erase;
          erase.setAttribute('aria-label', `${SLOT_TEXT.erase} ${SLOT_TEXT.slot(index)}`);
          row.append(main, fresh, erase);
        } else {
          const main = button('', () => startNew(slot), 'btn title-slot-main');
          main.append(
            el('strong', undefined, `${SLOT_TEXT.slot(index)} · ${SLOT_TEXT.empty}`),
            el('small', undefined, SLOT_TEXT.newHere),
          );
          row.append(main);
        }
        section.appendChild(row);
      }
      menu.appendChild(section);
    }
  };

  const ageMenu = (slot: SaveSlot) => {
    menu.innerHTML = '';
    menu.appendChild(el('div', 'help', EDU_TEXT.chooseAge));
    const row = el('div', 'title-ages');
    for (const age of EDU_AGES) {
      row.appendChild(
        button(
          String(age),
          () => finish({ slot, fresh: true, trainer: null, age, band: 'sprout' }),
          'btn title-age',
        ),
      );
    }
    // Grove Readers (7–10): the story in the reader band; the six games stay at their top age.
    row.appendChild(
      button(
        EDU_STORY_TEXT.readerAges,
        () => finish({ slot, fresh: true, trainer: null, age: 6, band: 'reader' }),
        'btn title-age',
      ),
    );
    menu.appendChild(row);
    menu.appendChild(el('div', 'help', EDU_TEXT.ageHelp));
    menu.appendChild(button('←', () => mainMenu(), 'btn btn-small'));
  };

  const keeperMenu = (slot: SaveSlot) => {
    menu.innerHTML = '';
    menu.appendChild(el('div', 'help', STORY_TEXT.chooseKeeper));
    const grid = el('div', 'title-keepers');
    for (const t of TRAINERS) {
      const label = TRAINER_LABELS[t.id]?.name ?? t.id;
      const b = button('', () => finish({ slot, fresh: true, trainer: t.id }), 'btn title-keeper');
      b.appendChild(portrait(t.id));
      b.appendChild(el('span', undefined, label));
      grid.appendChild(b);
    }
    menu.appendChild(grid);
    menu.appendChild(button('←', () => mainMenu(), 'btn btn-small'));
  };

  mainMenu();
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
