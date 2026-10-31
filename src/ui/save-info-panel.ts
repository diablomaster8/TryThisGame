/**
 * R0659 (CAMP-67): the Saves block in Settings: when this slot was last saved and how big it
 * is, the IndexedDB second copy (`platform/save-mirror.ts`) with its own age and size, and how
 * many unreadable saves are kept aside. Lane C r10 agent B adds the rolling backups
 * (`platform/save-backups.ts`), each with Restore, and the chapter checkpoint count. Reads
 * storage only; every read is guarded there. Restoring swaps the world in place (no reload).
 */
import { SAVE_BACKUP_TEXT, SAVE_INFO_TEXT } from '../config/strings';
import type { Game } from '../game';
import {
  backupsAvailable,
  countCheckpoints,
  listBackups,
  type Backup,
} from '../platform/save-backups';
import { mirrorReadAll } from '../platform/save-mirror';
import { currentSlot, modeOfWorld, readSave, readUnreadable, slotId } from '../platform/storage';
import { deserialize, importProblem } from '../sim/save';
import { confirmModal } from './confirm';
import { button, el } from './dom';
import { formatBytes, formatSavedAgo, saveInfoLines, storedBytes } from './save-info';

export interface SaveInfoHooks {
  game: () => Game | null;
  toast: (text: string, ms?: number) => void;
  /** After a restore: close Settings so the restored Grove shows. */
  onRestored: () => void;
}

/**
 * Pure: put a backup's world in place of the game's, keeping this device's Mature content
 * choice (a backup is this slot's own past, not a file from elsewhere). Null when it cannot.
 */
export function restorableWorld(
  json: string,
  slotMode: string,
  matureContent: Game['world']['settings']['matureContent'],
): Game['world'] | null {
  try {
    const file = deserialize(json);
    if (importProblem(file.world) || modeOfWorld(file.world) !== slotMode) return null;
    file.world.settings.matureContent = matureContent;
    return file.world;
  } catch {
    return null;
  }
}

/** Mount the block under `parent`; returns the refresh to call when Settings opens. */
export function mountSaveInfo(parent: HTMLElement, hooks?: SaveInfoHooks): () => void {
  const box = el('div', 'help save-info');
  box.setAttribute('aria-live', 'polite');
  parent.appendChild(el('strong', undefined, SAVE_INFO_TEXT.heading));
  parent.appendChild(box);
  const backups = el('div', 'save-backups');
  if (hooks) parent.appendChild(backups);
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
  const restore = (b: Backup, said: string): void => {
    if (!hooks) return;
    const ask = { title: SAVE_BACKUP_TEXT.confirmTitle, body: SAVE_BACKUP_TEXT.confirmBody(said) };
    void confirmModal({ ...ask, confirm: SAVE_BACKUP_TEXT.confirmYes, danger: true }).then((ok) => {
      const g = hooks.game();
      if (!ok || !g) return;
      const world = restorableWorld(b.json, currentSlot().mode, g.world.settings.matureContent);
      if (!world) return hooks.toast(SAVE_BACKUP_TEXT.broken);
      g.replaceWorld(world);
      hooks.onRestored();
      hooks.toast(SAVE_BACKUP_TEXT.restored);
    });
  };
  const drawBackups = (list: Backup[] | null, checkpoints: number): void => {
    const nowMs = Date.now();
    const kids: HTMLElement[] = [
      el('strong', undefined, SAVE_BACKUP_TEXT.heading),
      el('p', 'help', SAVE_BACKUP_TEXT.help),
    ];
    if (list === null) kids.push(el('p', 'help', SAVE_BACKUP_TEXT.unavailable));
    else if (list.length === 0) kids.push(el('p', 'help', SAVE_BACKUP_TEXT.none));
    for (const b of list ?? []) {
      const said = formatSavedAgo(nowMs, b.savedAtWallMs);
      const row = el('div', 'save-backup-row');
      const go = button(SAVE_BACKUP_TEXT.restore, () => restore(b, said), 'btn btn-small');
      go.setAttribute('aria-label', SAVE_BACKUP_TEXT.restoreLabel(b.n, said));
      row.append(
        el('span', undefined, SAVE_BACKUP_TEXT.line(b.n, said, formatBytes(storedBytes(b.json)))),
        go,
      );
      kids.push(row);
    }
    if (list !== null) kids.push(el('p', 'help', SAVE_BACKUP_TEXT.checkpoints(checkpoints)));
    backups.replaceChildren(...kids);
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
    if (!hooks) return;
    const id = slotId(slot);
    void (async () => {
      const ok = await backupsAvailable();
      const list = ok ? await listBackups(id) : null;
      const n = ok ? await countCheckpoints(id) : 0;
      if (ask === asked) drawBackups(list, n);
    })();
  };
}
