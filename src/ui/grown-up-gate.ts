/**
 * The grown-up sum gate: "type the answer to a + b". The Learning Grove's grown-up area
 * opens behind it, and so does anything that raises Mature content (the Settings radios
 * and a save import that carries 13+ or 18+). It is a speed bump for small children, not
 * a lock, which is all a parental gate on a static site can be.
 */
import { EDU_TEXT } from '../config/strings';
import { button, el, modal } from './dom';

/** Draw the gate into `container` (emptied first); `onPass` runs on the right answer. */
export function renderSumGate(
  container: HTMLElement,
  toast: (text: string) => void,
  onPass: () => void,
): void {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 2 + Math.floor(Math.random() * 7);
  container.innerHTML = '';
  container.appendChild(el('h3', undefined, EDU_TEXT.gateTitle));
  container.appendChild(el('p', 'help', EDU_TEXT.gateHelp(a, b)));
  const row = el('div', 'settings-actions');
  const input = el('input');
  input.type = 'number';
  input.inputMode = 'numeric';
  input.className = 'edu-gate-input';
  input.setAttribute('aria-label', EDU_TEXT.gateTitle);
  const enter = button(
    EDU_TEXT.gateEnter,
    () => {
      if (Number(input.value) === a + b) onPass();
      else {
        toast(EDU_TEXT.gateWrong);
        input.value = '';
      }
    },
    'btn btn-primary',
  );
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') enter.click();
  });
  row.append(input, enter);
  container.appendChild(row);
  setTimeout(() => input.focus(), 50);
}

/** Ask the gate in its own dialog. Resolves true on the right answer, false if closed. */
export function askGrownUp(parent: HTMLElement, toast: (text: string) => void): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = modal(parent, EDU_TEXT.gateTitle, EDU_TEXT.leave);
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      dialog.hide();
      dialog.root.remove();
      resolve(ok);
    };
    // The modal's own close button and a tap on the backdrop count as a no.
    const observer = new MutationObserver(() => {
      if (dialog.root.hidden) finish(false);
    });
    renderSumGate(dialog.body, toast, () => finish(true));
    dialog.show();
    observer.observe(dialog.root, { attributes: true, attributeFilter: ['hidden'] });
  });
}
