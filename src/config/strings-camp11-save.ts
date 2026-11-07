import { fmt } from './icu';
import { MESSAGES_EN } from './messages-en';
/** Lane C round 11, the save helper: player-facing text for slots, storage and backups. */

export const SAVE_LAYOUT_TEXT = {
  /** R0621: the slot card's play time. */
  played: (ms: number): string => {
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    return h > 0 ? `${h} h ${m} min played` : `${m} min played`;
  },
  copy: 'Copy to an empty slot',
  copyLabel: (where: string) => `Copy ${where} to an empty slot`,
  copied: (n: number) => `Copied to Slot ${n}.`,
  copyNoRoom: 'Every slot is full. Erase one first.',
  copyFailed: 'That copy could not be saved here.',
  /** R0623: the storage-full prompt. */
  fullTitle: 'Storage is full',
  fullBody:
    'This browser has no room left to keep your Grove. Save a backup file now, then free some space.',
  fullExport: 'Back up my saves',
  fullLater: 'Not now',
  /** R0625: Settings → Saves. */
  backupAll: 'Back up everything',
  backupAllHelp: 'One file with every slot, the story worlds and the chapter checkpoints.',
  restoreAll: 'Restore from a backup',
  backupTitle: 'Grove backup',
  backupDone: 'Backup saved.',
  backupNone: 'No saves to back up yet.',
  restoreBad: 'That file is not a Grove backup.',
  restoreHeading: 'Restore from the backup',
  restoreSlot: (where: string, theirs: string, yours: string) =>
    `${where}: ${theirs} (yours: ${yours})`,
  restoreEmpty: 'empty',
  restoreSame: 'the same',
  restoreOne: 'Restore this one',
  restoreEvery: 'Restore all of them',
  restoreClose: 'Close',
  restored: (n: number) => fmt(MESSAGES_EN.restoredSaves, { n }),
  restoreSkipped: 'The slot you are playing was left alone. Restore it from the title.',
  sideName: {
    atlas: 'The Atlas',
    arcade: "Pixel's Arcade",
    multiverse: 'The Multiverse',
    neopia: 'Neopia',
  } as Readonly<Record<string, string>>,
  /** R0626: what the story worlds look at. */
  worldsRead: 'Story worlds remember',
  worldsReadSlot: 'This slot',
  worldsReadEvery: 'Every slot',
  /** R0669 (CAMP-77): the title's visit to another Keeper's Grove. */
  visitOthers: "Visit another Keeper's Grove",
  visitOthersHelp: 'Walk round and look. Nothing you see is changed or saved.',
  visitSlot: (keeper: string, where: string) => `Visit ${keeper}: ${where}`,
  /** R0669 (round 13): the banner over a visit, and its way out. */
  visitBanner: (keeper: string) => `Visiting ${keeper}'s Grove · look, don't touch`,
  visitLeave: 'Leave visit',
  visitLeaveLabel: 'Leave the visit and go back to the title',
  /** Round 13: the picker in the More menu, and the way home when the visit began there. */
  visitClose: 'Close',
  visitNone: 'No other Keeper has a Grove saved on this device yet.',
  visitMenu: "Visit a Keeper's Grove",
  visitLeaveHome: 'Leave the visit and go back to your own Grove',
} as const;
