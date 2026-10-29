/**
 * R0304 (FUN-15): the small hands-on beats a story line can wait on. The opening's stuck gate
 * is played, not narrated: hold to lift, then swipe up (or let go) to push. The first push
 * always sticks with a boing; the second always gives with a creak, so it can never fail and
 * takes about three seconds. The cup is one tap (or Leave it). Keys work too: Enter or Space
 * pushes the gate. Lives in the dialogue's choice row, so the line cannot advance past it.
 */
import { LINE_ACT_TEXT } from '../config/strings-fun';
import type { LineAct } from '../config/story';
import { playSound } from '../platform/audio';
import { button, el } from './dom';

/** Fill `row` with the act's controls; `done(played)` runs once, when it is over. */
export function renderLineAct(
  row: HTMLElement,
  act: LineAct,
  sprout: boolean,
  reduceMotion: boolean,
  done: (played: boolean) => void,
): void {
  row.innerHTML = '';
  if (act === 'cup') {
    const t = LINE_ACT_TEXT.cup;
    const wrap = el('div', 'line-act line-act-cup');
    const turn = button(
      `☕ ${t.button}`,
      () => {
        playSound('pop');
        wrap.replaceChildren(el('p', 'line-act-hint', t.done));
        window.setTimeout(() => done(true), 900);
      },
      'btn btn-primary edu-option line-act-btn',
    );
    wrap.append(
      el('p', 'line-act-hint', t.hint),
      turn,
      button(t.leave, () => done(false), 'btn line-act-leave'),
    );
    row.append(wrap);
    return;
  }
  const t = LINE_ACT_TEXT.gate;
  const wrap = el('div', 'line-act line-act-gate');
  const hint = el('p', 'line-act-hint', sprout ? t.sproutHint : t.hint);
  const gate = button('', () => undefined, 'btn btn-primary edu-option line-act-btn gate-btn');
  gate.setAttribute('aria-label', t.label);
  const art = el('span', 'gate-art', '');
  for (let i = 0; i < 4; i++) art.append(el('span', 'gate-slat'));
  const label = el('span', 'gate-label', t.lift);
  gate.append(art, label);
  wrap.append(hint, gate);
  row.append(wrap);

  let pushes = 0;
  let lifted = false;
  let liftTimer = 0;
  let startY = 0;
  let finished = false;
  const push = (): void => {
    if (finished) return;
    pushes += 1;
    lifted = false;
    gate.classList.remove('lifted');
    if (pushes === 1) {
      playSound('boing');
      hint.textContent = sprout ? t.sproutHint : t.stuck;
      label.textContent = t.lift;
      if (!reduceMotion) {
        gate.classList.remove('stuck');
        void gate.offsetWidth;
        gate.classList.add('stuck');
      }
      return;
    }
    finished = true;
    playSound('creak');
    gate.classList.add('open');
    hint.textContent = t.open;
    label.textContent = '';
    window.setTimeout(() => done(true), reduceMotion ? 300 : 700);
  };
  const lift = (): void => {
    lifted = true;
    gate.classList.add('lifted');
    label.textContent = t.push;
  };
  gate.addEventListener('pointerdown', (e) => {
    if (finished) return;
    startY = e.clientY;
    gate.setPointerCapture?.(e.pointerId);
    window.clearTimeout(liftTimer);
    liftTimer = window.setTimeout(lift, 220);
  });
  gate.addEventListener('pointermove', (e) => {
    if (finished || startY === 0) return;
    // A swipe up pushes at once, lifted or not: the gate never asks twice for the same try.
    if (startY - e.clientY > 30) {
      window.clearTimeout(liftTimer);
      startY = 0;
      push();
    }
  });
  const release = (): void => {
    window.clearTimeout(liftTimer);
    if (startY === 0) return;
    startY = 0;
    // Letting go pushes too; a quick tap lifts and pushes in one go.
    if (!lifted) lift();
    push();
  };
  gate.addEventListener('pointerup', release);
  gate.addEventListener('pointercancel', release);
  gate.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    if (!lifted) lift();
    push();
  });
  // Clicks are handled by the pointer events above; a synthetic click (assistive tech, no
  // pointer events) still pushes.
  gate.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.detail === 0) {
      if (!lifted) lift();
      push();
    }
  });
  gate.focus({ preventScroll: true });
}
