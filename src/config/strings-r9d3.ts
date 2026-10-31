/**
 * Lane D, round 9 (helper d3): the player-facing words for the egg's shake how-to. Imported
 * directly where used.
 */

/** TECH-62: the ghost hand over a selected egg, and the line said once to a sprout. */
export const SHAKE_HINT_TEXT = {
  say: 'Pick up the egg and shake it!',
  aria: 'Pick up the egg and shake it to help it hatch',
} as const;

/** TECH-58: a story world, minigame or lesson chunk that fails offline keeps the Grove going. */
export const OFFLINE_CHUNK_TEXT = {
  body: 'That part of the Grove needs the internet once. Keep playing here?',
  keep: 'Keep playing',
} as const;

/** TECH-28: what a screen reader hears about the selected Nubbin, and the canvas's own label. */
export const A11Y_TEXT = {
  canvas: 'The Grove. Tab picks each Nubbin, Enter opens its sheet.',
  mood: { happy: 'happy', content: 'content', glum: 'a little sad', sad: 'sad' },
  hungry: 'a little hungry',
  starving: 'very hungry',
  sleepy: 'sleepy',
  ready: 'ready to hatch',
} as const;

/** TECH-29: erasing is held, not clicked, and an erased slot can come back for a week. */
export const TRASH_TEXT = {
  holdToErase: 'Hold to erase',
  holdHint: 'Press and hold for a moment.',
  eraseBody: (n: number, said: string) =>
    `Erase slot ${n}?${said ? ` (${said})` : ''} You can restore it for 7 days.`,
  more: '⋯',
  moreLabel: (mode: string, n: number) => `More for ${mode}, slot ${n}`,
  recent: 'Recently erased',
  restore: 'Restore',
  restoreLabel: (mode: string, n: number) => `Restore ${mode}, slot ${n}`,
  slotInUse: 'Slot in use',
  erasedAgo: (days: number) => (days < 1 ? 'erased today' : `erased ${days} d ago`),
} as const;
