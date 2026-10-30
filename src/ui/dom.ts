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
  // R0519 (TECH-78): the number, shown only in forced colours and high contrast (style.css),
  // where the drawn bar alone can vanish or read poorly.
  const pct = el('span', 'meter-pct');
  head.appendChild(pct);
  root.append(head, track);
  let shown = -1;
  return {
    root,
    set(v: number) {
      const p = Math.round(Math.max(0, Math.min(1, v)) * 100);
      fill.style.width = `${p}%`;
      if (p !== shown) pct.textContent = `${(shown = p)}%`;
    },
  };
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let dialogIds = 0;

/**
 * Make an overlay behave as a modal dialog for keyboards and screen readers: it is named
 * by its heading, takes focus when it opens, keeps Tab inside, closes on Escape (when
 * `onEscape` is given) and hands focus back to whatever opened it. Call `opened` right
 * after showing it and `closed` right after hiding it.
 */
export function dialogFocus(
  root: HTMLElement,
  card: HTMLElement,
  heading: HTMLElement | null,
  onEscape?: () => void,
): { opened(): void; closed(): void } {
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.tabIndex = -1;
  if (heading) {
    heading.id ||= `dialog-title-${++dialogIds}`;
    card.setAttribute('aria-labelledby', heading.id);
  }
  let opener: Element | null = null;
  root.addEventListener('keydown', (e) => {
    if (root.hidden) return;
    if (e.key === 'Escape' && onEscape) {
      // Handled here, so the HUD's own Escape does not close the panel underneath too.
      e.stopPropagation();
      e.preventDefault();
      onEscape();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = [...card.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (x) => x.offsetParent !== null || x === document.activeElement,
    );
    if (items.length === 0) {
      e.preventDefault();
      card.focus();
      return;
    }
    const first = items[0]!;
    const last = items[items.length - 1]!;
    const at = document.activeElement;
    if (e.shiftKey && (at === first || at === card)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (at === last || !card.contains(at))) {
      e.preventDefault();
      first.focus();
    }
  });
  return {
    opened() {
      if (!card.contains(document.activeElement)) opener = document.activeElement;
      // The card itself, not its first field: a phone keyboard should not pop up unasked.
      card.focus({ preventScroll: true });
    },
    closed() {
      const back = opener;
      opener = null;
      if (back instanceof HTMLElement && back.isConnected && card.contains(document.activeElement))
        back.focus({ preventScroll: true });
      else if (card.contains(document.activeElement))
        (document.activeElement as HTMLElement).blur();
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
  const heading = el('h2', undefined, title);
  head.appendChild(heading);
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
  const focus = dialogFocus(root, card, heading, () => hide());
  function show() {
    root.hidden = false;
    focus.opened();
  }
  function hide() {
    if (root.hidden) return;
    root.hidden = true;
    focus.closed();
  }
  return { root, body, show, hide, isOpen: () => !root.hidden };
}
