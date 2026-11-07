import { fmt } from './icu';
import { MESSAGES_EN } from './messages-en';
/** Lane C round 10, agent B (re-exported through strings-camp10.ts). */

/** R0659 / R0619 (CAMP-67, CAMP-27): backups and checkpoints in Settings → Saves. */
export const SAVE_BACKUP_TEXT = {
  heading: 'Backups of this save',
  help: 'Every ten minutes of play this browser keeps a copy. Restore puts one back in place of this save.',
  none: 'No backups yet.',
  unavailable: 'This browser cannot keep backups here (its database is blocked).',
  /** One backup: its age and size, as the save line says them. */
  line: (n: number, saved: string, size: string) => `Backup ${n}: ${saved} · ${size}`,
  restore: 'Restore',
  restoreLabel: (n: number, saved: string) =>
    fmt(MESSAGES_EN.restoreBackup, { n, saved: saved.toLowerCase() }),
  confirmTitle: 'Restore this backup?',
  confirmBody: (saved: string) => fmt(MESSAGES_EN.restoreConfirm, { saved: saved.toLowerCase() }),
  confirmYes: 'Restore',
  restored: 'Backup restored.',
  broken: 'That backup could not be read.',
  checkpoints: (n: number) => fmt(MESSAGES_EN.checkpoints, { n }),
} as const;

/** R0642 (CAMP-50): the date an ending was reached, on the endings shelf. */
export const ENDING_DATE_TEXT = {
  reached: (date: string) => `reached ${date}`,
} as const;

/** R0649 (CAMP-57): naming and colour-tagging a save slot on the title. */
export const SLOT_LABEL_TEXT = {
  rename: 'Name',
  renameLabel: (slot: string) => `Name or tag ${slot}`,
  title: 'Name this save',
  nameLabel: 'Name',
  tagLabel: 'Tag',
  noTag: 'No tag',
  save: 'Save',
  cancel: 'Cancel',
  /** The default name: whose Grove it is. */
  defaultName: (keeper: string) => `${keeper}'s Grove`,
  /** Each tag has an icon and a word, so the colour is never the only signal. */
  tags: {
    leaf: { icon: '🍃', name: 'Leaf' },
    star: { icon: '⭐', name: 'Star' },
    shell: { icon: '🐚', name: 'Shell' },
    moon: { icon: '🌙', name: 'Moon' },
    sun: { icon: '☀️', name: 'Sun' },
    heart: { icon: '💗', name: 'Heart' },
  },
} as const;
