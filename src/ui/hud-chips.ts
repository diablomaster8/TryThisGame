/**
 * Three small floating HUD pieces: the decorating "placing" chip, the way-home button while
 * visiting, and the one-time joystick offer (TECH-24: split out of hud.ts).
 */
import { UI } from '../config/tuning';
import { UI_TEXT } from '../config/strings';
import { JOYSTICK_TUNING } from '../config/tuning-move-joy';
import { JOYSTICK_TEXT } from '../config/strings-move-joy';
import type { Game } from '../game';
import { snapYaw } from '../sim/decorate';
import { coarsePointer } from '../platform/viewport';
import { button, el } from './dom';
import { joystickWanted } from './joystick-math';

export interface Chips {
  placingChip: HTMLElement;
  placingText: HTMLElement;
  rotateBtn: HTMLButtonElement;
  homeBtn: HTMLButtonElement;
}

export function mountChips(
  root: HTMLElement,
  game: () => Game | null,
  toast: (text: string, ms?: number) => void,
): Chips {
  // Placing chip while decorating.
  const placingChip = el('div', 'placing-chip');
  placingChip.hidden = true;
  const placingText = el('span');
  // Decor turns in eighths before it goes down, so fence runs can go any way (MOVE-04).
  const rotateBtn = button(
    `↻ ${UI_TEXT.rotatePiece}`,
    () => {
      const g = game();
      const p = g?.placing;
      if (g && p?.mode === 'decor') g.placing = { ...p, yaw: snapYaw((p.yaw ?? 0) + Math.PI / 4) };
    },
    'btn btn-small',
  );
  placingChip.append(
    placingText,
    rotateBtn,
    button(
      UI_TEXT.donePlacing,
      () => {
        const g = game();
        if (g) g.placing = null;
      },
      'btn btn-small',
    ),
  );
  root.appendChild(placingChip);
  // Visiting a neighbour: the way home stays on screen, not three menus deep (bug 28).
  const goHome = (): void => game()?.send({ kind: 'visit', trainer: null });
  const homeBtn = button(`🏡 ${UI_TEXT.goHome}`, goHome, 'btn home-btn');
  homeBtn.hidden = true;
  root.appendChild(homeBtn);
  // The first touch offers the floating joystick once, in a toast (R0028).
  const offerJoystick = (e: PointerEvent): void => {
    if (e.pointerType !== 'touch') return;
    // Not while the stick is already on (the setting, or the Hollow's default on a touch
    // device): the offer waits for a touch somewhere it would help.
    const g = game();
    if (g && joystickWanted(!!g.world.settings.joystick, g.world.location, coarsePointer())) return;
    window.removeEventListener('pointerdown', offerJoystick, true);
    try {
      if (localStorage.getItem(JOYSTICK_TUNING.offerKey)) return;
      localStorage.setItem(JOYSTICK_TUNING.offerKey, '1');
    } catch {
      /* storage blocked: offer it this session only */
    }
    toast(JOYSTICK_TEXT.offer, UI.toastLongMs);
  };
  window.addEventListener('pointerdown', offerJoystick, true);
  return { placingChip, placingText, rotateBtn, homeBtn };
}
