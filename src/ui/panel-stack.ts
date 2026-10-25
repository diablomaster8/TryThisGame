/**
 * The panel stack: at most one full panel (a menu, the stats sheet, the Journal, a minigame)
 * is open at a time. Panels keep their own open/close code; this watches the `hidden`
 * attributes under the HUD root and, when a panel opens, closes any other open one. A panel
 * with no `close` (a running minigame, which ends through its own results screen) is never
 * closed for another: the newcomer is closed instead.
 *
 * `onChange` runs after every settle, whatever was shown or hidden under the root, so the
 * story dialogue can start waiting the moment a panel opens over it.
 */
export interface StackPanel {
  isOpen: () => boolean;
  close?: () => void;
}

export interface PanelStack {
  /** Whether any panel in the stack is open. */
  anyOpen(): boolean;
  /** Close every open panel that can be closed (a story scene takes the screen). */
  closeAll(): void;
}

export function mountPanelStack(
  root: HTMLElement,
  panels: StackPanel[],
  onChange?: () => void,
): PanelStack {
  let open = new Set<StackPanel>();
  let busy = false;

  function settle(): void {
    if (busy) return;
    busy = true;
    const now = new Set(panels.filter((p) => p.isOpen()));
    const fresh = [...now].filter((p) => !open.has(p));
    if (fresh.length > 0 && now.size > 1) {
      const pinned = [...now].find((p) => !p.close && !fresh.includes(p));
      const keep = pinned ?? fresh[fresh.length - 1]!;
      for (const p of now) {
        if (p === keep) continue;
        p.close?.();
        if (!p.isOpen()) now.delete(p);
      }
    }
    open = now;
    busy = false;
    onChange?.();
  }

  new MutationObserver(settle).observe(root, {
    subtree: true,
    attributes: true,
    attributeFilter: ['hidden'],
  });
  return {
    anyOpen: () => panels.some((p) => p.isOpen()),
    closeAll: () => {
      for (const p of panels) if (p.isOpen()) p.close?.();
    },
  };
}
