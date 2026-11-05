/** Lane D round 13 strings (helper 3). */
export const LEVEL_TEXT = {
  levelUp: (name: string, stat: string, level: number): string =>
    `${name}'s ${stat} reached level ${level}!`,
} as const;
