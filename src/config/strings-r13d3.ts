/** Lane D round 13 strings (helper 3). */
export const LEVEL_TEXT = {
  levelUp: (name: string, stat: string, level: number): string =>
    `${name}'s ${stat} reached level ${level}!`,
} as const;

/** R0447: the title's fold for the slots beyond the first empty one of each mode. */
export const TITLE_R13_TEXT = {
  loadAnother: 'Load another save',
  loadAnotherHelp: 'More slots, empty and saved. Pick one to start or carry on.',
} as const;
