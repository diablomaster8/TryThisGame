import { playBlip } from '../platform/audio';
import { button, el } from './dom';

/**
 * R0675: the 🙌 clap pad of the clap rounds. Each tap counts one beat (a dot lights and a
 * soft tick plays); it never marks anything, the child still picks the number. A grown-up
 * or sprout can tap along with the word being said.
 */
export function clapPad(onBeat?: (n: number) => void): HTMLElement {
  const wrap = el('div', 'edu-clap');
  const dots = el('div', 'edu-clap-dots');
  let n = 0;
  const pad = button(
    '🙌',
    () => {
      n += 1;
      playBlip(520 + 60 * Math.min(n, 6), 'triangle', 90);
      dots.appendChild(el('span', 'edu-clap-dot', '●'));
      pad.classList.remove('edu-clap-hit');
      void pad.offsetWidth;
      pad.classList.add('edu-clap-hit');
      wrap.dataset.beats = String(n);
      onBeat?.(n);
    },
    'btn edu-clap-pad',
  );
  pad.setAttribute('aria-label', 'Clap');
  const reset = button(
    '↺',
    () => {
      n = 0;
      dots.textContent = '';
      wrap.dataset.beats = '0';
    },
    'btn btn-small edu-clap-reset',
  );
  reset.setAttribute('aria-label', 'Clap again');
  wrap.dataset.beats = '0';
  wrap.append(pad, dots, reset);
  return wrap;
}
