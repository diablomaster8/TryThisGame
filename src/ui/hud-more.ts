/**
 * The "More" menu's buttons (TECH-24): one wide button per panel, plus the Learning Grove's
 * play-fight, the keys hint and the zoom toggle. Split out of hud.ts.
 */
import { ATLAS_TEXT, UI_TEXT, EDU_TEXT } from '../config/strings';
import { BATTLE_SCREEN_TEXT } from '../config/strings-battle';
import { KEYS_HINT_TEXT } from '../config/strings-r8d';
import { MOVE_R10_TEXT } from '../config/strings-move-r10';
import type { Game } from '../game';
import { button } from './dom';
import { showKeysHintAgain } from './keys-hint';
import { SAVE_LAYOUT_TEXT } from '../config/strings-camp11-save';
import { mountVisitPicker } from './visit-picker';

export type MoreEntry = readonly [label: string, open: () => void];

export function fillMoreList(
  more: { hide(): void },
  moreList: HTMLElement,
  entries: readonly MoreEntry[],
  game: () => Game | null,
  openKarate: () => void,
  visitBtn: HTMLElement,
): void {
  for (const [label, open] of entries) {
    const isEdu = label.includes(EDU_TEXT.grownUps);
    // Receiving a stranger's code is not for the Learning Grove (review C, items 2 and 24).
    const isKarate = label.includes(UI_TEXT.karate) || label.includes(UI_TEXT.receive);
    const isRift = label.includes(ATLAS_TEXT.rift);
    const isGate = label.includes(ATLAS_TEXT.gate);
    const isCabinet = label.includes(ATLAS_TEXT.cabinet);
    const isSide = label.includes(ATLAS_TEXT.atlas) || isCabinet || isRift || isGate;
    moreList.appendChild(
      button(
        label,
        () => {
          more.hide();
          open();
        },
        `btn btn-wide${isEdu ? ' edu-only' : isKarate || isSide ? ' not-edu' : ''}${isCabinet ? ' cabinet' : ''}${isRift ? ' rift' : ''}${isGate ? ' neo-gate' : ''}`,
      ),
    );
  }
  // Lane C: the Learning Grove gets the dojo as gentle play-fights (recs FIGHT-24).
  moreList.appendChild(
    button(
      BATTLE_SCREEN_TEXT.playFight,
      () => {
        more.hide();
        openKarate();
      },
      'btn btn-wide edu-only',
    ),
  );
  moreList.appendChild(visitBtn);
  // TECH-60: the keys hint comes back from here, or from the "?" key.
  moreList.appendChild(
    button(
      KEYS_HINT_TEXT.menu,
      () => {
        more.hide();
        showKeysHintAgain();
      },
      'btn btn-wide not-edu keys-hint-again',
    ),
  );
  // R0014 (lane A r10): on phones the camera cluster drops ⤢ for the jump button; it lives here.
  moreList.appendChild(
    button(
      MOVE_R10_TEXT.zoomMenu,
      () => {
        more.hide();
        game()?.camera.toggleZoom();
      },
      'btn btn-wide zoom-more',
    ),
  );
}

/** R0669: look round another Keeper's Grove, read-only; shown only when one exists on this device. */
export function mountVisitEntry(
  root: HTMLElement,
  game: () => Game | null,
  more: { hide(): void; show(): void },
): { btn: HTMLButtonElement; has: () => boolean; show: () => void } {
  const picker = mountVisitPicker(root, () => void game()?.save());
  const btn = button(
    `👥 ${SAVE_LAYOUT_TEXT.visitMenu}`,
    () => {
      more.hide();
      picker.open();
    },
    'btn btn-wide not-edu visit-more',
  );
  let has = picker.hasChoices();
  btn.hidden = !has;
  return {
    btn,
    has: () => has,
    // Opens the More menu; profiles can change between opens.
    show: () => {
      has = picker.hasChoices();
      btn.hidden = !has;
      more.show();
    },
  };
}
