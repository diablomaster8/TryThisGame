import { NAMES, TRAINER_LABELS } from '../config/strings';
import { STORY_TEXT } from '../config/story';
import { playSong } from '../platform/audio';
import { hasSave, type SaveSlot } from '../platform/storage';
import { frameKey } from '../render/sprites/animations';
import { buildKeeperSheet } from '../render/sprites/keeper';
import { TRAINERS } from '../sim/trainers';
import { button, el } from './dom';

export interface TitleChoice {
  slot: SaveSlot;
  /** Start fresh (erase that slot) instead of continuing. */
  fresh: boolean;
  /** Trainer for a new campaign. */
  trainer: string | null;
}

/**
 * The title screen: Campaign or Free Grove, each with Continue when a save exists. A
 * new campaign asks which Keeper you are first.
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
  root.appendChild(card);
  parent.appendChild(root);

  const finish = (c: TitleChoice) => {
    root.remove();
    onChoose(c);
  };

  const mainMenu = () => {
    menu.innerHTML = '';
    if (hasSave('campaign')) {
      menu.appendChild(
        button(
          STORY_TEXT.continueCampaign,
          () => finish({ slot: 'campaign', fresh: false, trainer: null }),
          'btn btn-primary btn-wide',
        ),
      );
    }
    menu.appendChild(
      button(
        hasSave('campaign') ? STORY_TEXT.newCampaign : STORY_TEXT.campaign,
        () => keeperMenu(),
        `btn btn-wide${hasSave('campaign') ? '' : ' btn-primary'}`,
      ),
    );
    if (hasSave('free')) {
      menu.appendChild(
        button(
          STORY_TEXT.continueGrove,
          () => finish({ slot: 'free', fresh: false, trainer: null }),
          'btn btn-wide',
        ),
      );
    }
    menu.appendChild(
      button(
        hasSave('free') ? STORY_TEXT.newGrove : STORY_TEXT.freeGrove,
        () => {
          if (hasSave('free') && !confirm(STORY_TEXT.newGroveConfirm)) return;
          finish({ slot: 'free', fresh: true, trainer: null });
        },
        'btn btn-wide',
      ),
    );
  };

  const keeperMenu = () => {
    if (hasSave('campaign') && !confirm(STORY_TEXT.resetCampaignConfirm)) return;
    menu.innerHTML = '';
    menu.appendChild(el('div', 'help', STORY_TEXT.chooseKeeper));
    const grid = el('div', 'title-keepers');
    for (const t of TRAINERS) {
      const label = TRAINER_LABELS[t.id]?.name ?? t.id;
      const b = button(
        '',
        () => finish({ slot: 'campaign', fresh: true, trainer: t.id }),
        'btn title-keeper',
      );
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
