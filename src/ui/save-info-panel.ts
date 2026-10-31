/**
 * R0659 (CAMP-67): the Saves block in Settings: when this slot was last saved and how big it
 * is, the IndexedDB second copy (`platform/save-mirror.ts`) with its own age and size, and how
 * many unreadable saves are kept aside. Reads storage only; every read is guarded there.
 */
import { SAVE_INFO_TEXT } from '../config/strings';
import { mirrorReadAll } from '../platform/save-mirror';
import { currentSlot, readSave, readUnreadable } from '../platform/storage';
import { el } from './dom';
import { saveInfoLines } from './save-info';

/** Mount the block under `parent`; returns the refresh to call when Settings opens. */
export function mountSaveInfo(parent: HTMLElement): () => void {
  const box = el('div', 'help save-info');
  box.setAttribute('aria-live', 'polite');
  parent.appendChild(el('strong', undefined, SAVE_INFO_TEXT.heading));
  parent.appendChild(box);
  let asked = 0;
  const draw = (mirror: string | null | undefined): void => {
    const slot = currentSlot();
    const lines = saveInfoLines({
      nowMs: Date.now(),
      current: readSave(),
      mirror,
      unreadable: readUnreadable(slot).length,
    });
    box.replaceChildren(...lines.map((t) => el('div', undefined, t)));
  };
  return () => {
    draw(undefined);
    const ask = ++asked;
    const slot = currentSlot();
    // The mirror's key is `mode:index`, as storage.ts writes it.
    void mirrorReadAll().then((all) => {
      if (ask !== asked) return;
      draw(all.find((r) => r.key === `${slot.mode}:${slot.index}`)?.json ?? null);
    });
  };
}
