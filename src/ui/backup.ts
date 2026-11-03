/**
 * R0625 (CAMP-33) and R0623 (CAMP-31): Settings → Saves gets "Back up everything" (one file
 * for the whole profile, through the share sheet on a phone) and "Restore from a backup",
 * which lists each slot as "theirs (yours: …)" and restores one slot or all, never silently.
 * `offerStorageFull` is the prompt the HUD shows when a save no longer fits.
 */
import { SAVE_LAYOUT_TEXT as T } from '../config/strings-camp11-save';
import { SLOT_TEXT } from '../config/strings';
import {
  backupDiff,
  backupFileName,
  backupText,
  collectBackup,
  parseBackup,
  restoreBackupExtras,
  restoreBackupSlot,
  slotOfId,
  type DiffRow,
  type ParsedBackup,
} from '../platform/profile-backup';
import { shareOrDownload } from '../platform/share';
import { noteBackupExported } from '../platform/backup-offer';
import {
  currentSlot,
  pickTextFile,
  profileOf,
  readSlotJson,
  readWorldsRead,
  slotId,
  writeWorldsRead,
  type SaveSummary,
} from '../platform/storage';
import { button, el, modal } from './dom';
import { confirmModal } from './confirm';

/** Save the profile's backup file (share sheet on a phone). */
export async function exportProfileBackup(toast: (text: string) => void): Promise<void> {
  const profile = profileOf(currentSlot());
  const b = await collectBackup(profile, Date.now());
  if (Object.keys(b.slots).length === 0) return toast(T.backupNone);
  const r = await shareOrDownload(
    backupFileName(profile, new Date()),
    backupText(b),
    T.backupTitle,
  );
  if (r !== 'cancelled') {
    noteBackupExported();
    toast(T.backupDone);
  }
}

function where(id: string): string {
  const slot = slotOfId(id);
  if (!slot) return id;
  return `${SLOT_TEXT.modes[slot.mode] ?? slot.mode}, ${SLOT_TEXT.slot(slot.index)}`;
}

function said(s: SaveSummary | null): string {
  if (!s) return T.restoreEmpty;
  if (s.chapter !== null && s.chapter > 0) return SLOT_TEXT.chapter(s.chapter);
  return s.names.length > 0 ? s.names.join(', ') : SLOT_TEXT.nubbins(s.nubbins);
}

/** The diff screen: one row a slot, Restore on each, Restore all at the foot. */
function showRestore(p: ParsedBackup, toast: (text: string) => void): void {
  const m = modal(document.body, T.restoreHeading, T.restoreClose);
  const playing = slotId(currentSlot());
  const rows: DiffRow[] = backupDiff(p, (id) => {
    const slot = slotOfId(id);
    return slot ? readSlotJson(slot) : null;
  });
  const done = (n: number, skipped: boolean): void => {
    toast(skipped ? `${T.restored(n)} ${T.restoreSkipped}` : T.restored(n));
  };
  for (const r of rows) {
    const row = el('div', 'settings-actions');
    const text = r.same
      ? `${where(r.id)}: ${T.restoreSame}`
      : T.restoreSlot(where(r.id), said(r.theirs), said(r.yours));
    row.appendChild(el('p', 'help', text));
    if (!r.same) {
      const one = button(T.restoreOne, () => {
        const ok = restoreBackupSlot(p, r.id, playing, Date.now());
        one.disabled = true;
        done(ok ? 1 : 0, r.id === playing);
      });
      one.disabled = r.id === playing;
      row.appendChild(one);
    }
    m.body.appendChild(row);
  }
  const all = button(T.restoreEvery, () => {
    void confirmModal({
      title: T.restoreHeading,
      body: T.restoreEvery,
      confirm: T.restoreEvery,
    }).then(async (ok) => {
      if (!ok) return;
      let n = 0;
      for (const r of rows) if (!r.same && restoreBackupSlot(p, r.id, playing, Date.now())) n += 1;
      await restoreBackupExtras(p, Date.now());
      m.hide();
      m.root.remove();
      done(
        n,
        rows.some((r) => r.id === playing && !r.same),
      );
    });
  });
  m.body.appendChild(all);
  m.show();
}

async function restoreFromFile(toast: (text: string) => void): Promise<void> {
  const text = await pickTextFile();
  if (text === null) return;
  const p = parseBackup(text);
  if (!p) return toast(T.restoreBad);
  showRestore(p, toast);
}

/** Settings → Saves: the whole-profile backup, restore, and what story worlds read. */
export function mountProfileBackup(body: HTMLElement, toast: (text: string) => void): void {
  const row = el('div', 'settings-actions');
  row.append(
    button(T.backupAll, () => void exportProfileBackup(toast)),
    button(T.restoreAll, () => void restoreFromFile(toast)),
  );
  body.append(el('p', 'help', T.backupAllHelp), row);
  // R0626: story worlds look at the slot in play unless the profile says every slot.
  const label = el('label', 'field-row');
  const pick = el('select');
  for (const [v, name] of [
    ['slot', T.worldsReadSlot],
    ['every', T.worldsReadEvery],
  ] as const) {
    const o = el('option', undefined, name);
    o.value = v;
    pick.appendChild(o);
  }
  pick.value = readWorldsRead();
  pick.addEventListener('change', () => {
    writeWorldsRead(pick.value === 'every' ? 'every' : 'slot');
  });
  label.append(el('strong', undefined, T.worldsRead), pick);
  body.appendChild(label);
}

/** R0623: storage is full. Offer the backup file, once per page life. */
let offered = false;
export function offerStorageFull(toast: (text: string) => void): void {
  if (offered) return;
  offered = true;
  void confirmModal({
    title: T.fullTitle,
    body: T.fullBody,
    confirm: T.fullExport,
    cancel: T.fullLater,
  }).then((ok) => ok && void exportProfileBackup(toast));
}
