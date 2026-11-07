/** Round 17 lane D (helper d1): the small caves behind the ridge and the ruins (R0115). */
export const CAVE_TEXT = {
  /** Toast on stepping into a cave, by its place id (`caves:<id>`). */
  entered: {
    ice: 'You step into the ice caves. The air is still and blue.',
    door: 'Beyond the thawed door, a cold hush. Your steps echo.',
  } as Record<string, string>,
  /** Toast when a cave's way leads back out. */
  left: (items: number, shells: number) =>
    items + shells > 0
      ? `Back in the light with ${items} finds and ${shells} Shells.`
      : 'You step back out into the light.',
};
