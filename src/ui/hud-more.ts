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

export type MoreEntry = readonly [label: string, open: () => void];

export function fillMoreList(
  more: { hide(): void },
  moreList: HTMLElement,
  entries: readonly MoreEntry[],
  game: () => Game | null,
  openKarate: () => void,
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
