/** Tiny DOM helpers so the UI code stays readable without a framework. */

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function button(label: string, onPress: () => void, className = 'btn'): HTMLButtonElement {
  const b = el('button', className, label);
  b.type = 'button';
  b.addEventListener('click', onPress);
  return b;
}

export function meter(label: string, icon: string): { root: HTMLDivElement; set(v: number): void } {
  const root = el('div', 'meter');
  const head = el('div', 'meter-label');
  head.append(el('span', 'meter-icon', icon), el('span', undefined, label));
  const track = el('div', 'meter-track');
  const fill = el('div', 'meter-fill');
  track.appendChild(fill);
  root.append(head, track);
  return {
    root,
    set(v: number) {
      fill.style.width = `${Math.round(Math.max(0, Math.min(1, v)) * 100)}%`;
    },
  };
}

/** A modal shell with a title, a body and a close button. Returns show/hide controls. */
export function modal(
  parent: HTMLElement,
  title: string,
  closeLabel: string,
): { root: HTMLDivElement; body: HTMLDivElement; show(): void; hide(): void; isOpen(): boolean } {
  const root = el('div', 'modal');
  root.hidden = true;
  const card = el('div', 'modal-card');
  const head = el('div', 'modal-head');
  head.appendChild(el('h2', undefined, title));
  const body = el('div', 'modal-body');
  const close = button(closeLabel, () => hide(), 'btn btn-close');
  close.setAttribute('aria-label', closeLabel);
  head.appendChild(close);
  card.append(head, body);
  root.appendChild(card);
  parent.appendChild(root);
  root.addEventListener('click', (e) => {
    if (e.target === root) hide();
  });
  function show() {
    root.hidden = false;
  }
  function hide() {
    root.hidden = true;
  }
  return { root, body, show, hide, isOpen: () => !root.hidden };
}
