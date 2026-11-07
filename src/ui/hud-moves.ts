/**
 * The Run toggle and the Jump thumb button (TECH-24: split out of hud.ts).
 */
import { RUN_MODE } from '../config/tuning-move';
import { UI_TEXT } from '../config/strings';
import { SNOW_TEXT } from '../config/strings-r13d1';
import type { Game } from '../game';

import { button, el } from './dom';
import { JumpButtonLook } from './jump-states';

export interface RunJump {
  runOn: () => boolean;
  setRunning: (on: boolean) => void;
  jumpBtn: HTMLButtonElement;
  jumpLook: JumpButtonLook;
  snowBtn: HTMLButtonElement;
}

export function mountRunJump(
  root: HTMLElement,
  game: () => Game | null,
  sproutHide: HTMLElement[],
): RunJump {
  // Run: a toggle on screen, or hold Shift on a keyboard.
  const runBtn = button(`🏃 ${UI_TEXT.run}`, () => setRunning(!runOn), 'btn run-btn');
  runBtn.title = UI_TEXT.runHelp;
  let runOn = false;
  function setRunning(on: boolean): void {
    runOn = on;
    runBtn.classList.toggle('active', on);
    game()?.send({ kind: 'setRunning', running: on });
  }
  root.appendChild(runBtn);
  // R0679: what a sprout does not need (style.css hides these under `body.edu-sprout`).
  for (const b of [runBtn, ...sproutHide]) b.classList.add('sprout-hide');
  // MOVE-42: on a phone the Run toggle turns itself off after a few seconds standing still,
  // so it is never left on by accident. Shift on a keyboard is held, so it needs none.
  if (window.matchMedia?.('(pointer: coarse)').matches) {
    let stillMs = 0;
    let last: { x: number; z: number } | null = null;
    window.setInterval(() => {
      const k = game()?.world.keeper;
      if (!runOn || !k) {
        stillMs = 0;
        last = null;
        return;
      }
      const moved = !last || Math.hypot(k.pos.x - last.x, k.pos.z - last.z) > 0.02;
      last = { x: k.pos.x, z: k.pos.z };
      stillMs = moved ? 0 : stillMs + 250;
      if (stillMs >= RUN_MODE.idleResetMs) setRunning(false);
    }, 250);
  }

  // Jump (MOVE-14): a thumb button on touch screens, Space on a keyboard. It reacts on
  // pointerdown, with no click delay; holding it holds the jump higher. With something in
  // hand it shakes that instead, and says so (MOVE-22).
  const jumpBtn = el('button', 'btn jump-btn');
  jumpBtn.type = 'button';
  jumpBtn.setAttribute('aria-label', UI_TEXT.jump);
  // MOVE-51: the hold ring, the air-jump pip and the glide feather.
  const jumpLook = new JumpButtonLook(jumpBtn);
  let jumpPointer: number | null = null;
  jumpBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    jumpPointer = e.pointerId;
    try {
      jumpBtn.setPointerCapture(e.pointerId);
    } catch {
      // A pointer already gone cannot be captured; its release still ends the jump.
    }
    game()?.send({ kind: 'jump', down: true });
  });
  const jumpUp = (e: PointerEvent): void => {
    if (e.pointerId !== jumpPointer) return;
    jumpPointer = null;
    game()?.send({ kind: 'jump', down: false });
  };
  jumpBtn.addEventListener('pointerup', jumpUp);
  jumpBtn.addEventListener('pointercancel', jumpUp);
  root.appendChild(jumpBtn);
  // R0113 (R13 d1): the snowball button, shown only on the ridge's snow.
  const snowBtn = el('button', 'btn jump-btn snow-btn');
  snowBtn.type = 'button';
  snowBtn.textContent = SNOW_TEXT.glyph;
  snowBtn.setAttribute('aria-label', SNOW_TEXT.button);
  snowBtn.hidden = true;
  snowBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    game()?.send({ kind: 'snowball' });
  });
  root.appendChild(snowBtn);
  return { runOn: () => runOn, setRunning, jumpBtn, jumpLook, snowBtn };
}
