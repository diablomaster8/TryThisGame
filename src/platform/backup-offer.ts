/**
 * TECH-03: after a week of playing without saving a backup file, the Grove offers one, once.
 * The record lives in `grove.backup` (first play, last export, offered), never in the save,
 * so it covers every slot on this browser. Every storage touch is wrapped: with no storage
 * the offer never shows.
 */
import { BACKUP_OFFER } from '../config/tuning';

const KEY = 'grove.backup';

interface BackupRecord {
  since: number;
  exported?: number;
  offered?: boolean;
}

function read(): BackupRecord | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const r = JSON.parse(raw) as Partial<BackupRecord>;
    return typeof r.since === 'number' ? (r as BackupRecord) : null;
  } catch {
    return null;
  }
}

function write(r: BackupRecord): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
    return true;
  } catch {
    return false;
  }
}

/** Whether to offer now; the first call starts the week. */
export function backupOfferDue(nowWallMs: number): boolean {
  const r = read();
  if (!r) {
    write({ since: nowWallMs });
    return false;
  }
  if (r.offered || r.exported !== undefined) return false;
  // Lane C's after-an-ending backup chip (ui/backup-nudge.ts) shown in the last day: not
  // two backup asks back to back.
  if (nowWallMs - nudgeShownMs() < DAY_MS) return false;
  return nowWallMs - r.since >= BACKUP_OFFER.afterPlayMs;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** When the backup chip of `ui/backup-nudge.ts` last showed, or 0. */
function nudgeShownMs(): number {
  try {
    const m = JSON.parse(localStorage.getItem('grove.backupNudge') ?? '{}') as { lastMs?: unknown };
    return typeof m.lastMs === 'number' ? m.lastMs : 0;
  } catch {
    return 0;
  }
}

/** The offer was shown: it never shows again, whatever the answer. */
export function noteBackupOffered(): void {
  write({ ...(read() ?? { since: Date.now() }), offered: true });
}

/** A save file was exported (from Settings or the offer). */
export function noteBackupExported(nowWallMs = Date.now()): void {
  write({ ...(read() ?? { since: nowWallMs }), exported: nowWallMs });
}
