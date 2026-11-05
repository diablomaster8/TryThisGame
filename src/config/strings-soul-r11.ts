/**
 * Lane A round 11 (SOUL): the sheet's favourites line (R0568's favourite Keeper, R0569's
 * favourite spot).
 */
export const FAVOURITES_SHEET = {
  keeper: 'Favourite',
  keeperNames: { sun: 'Sun Keeper', moon: 'Moon Keeper' },
  keeperIcons: { sun: '☀', moon: '☾' },
  spot: 'Spot',
  spotNames: {
    bridge: 'the bridge',
    well: 'the well',
    oldTree: 'the old tree',
    westHill: 'the west hill top',
    pondShore: 'the pond shore',
    tree0: 'the first fruit tree',
    tree1: 'the second fruit tree',
    tree2: 'the third fruit tree',
  } as Record<string, string>,
  spotUnknown: '?',
  spotHelp: 'Find it sitting there to learn its favourite spot.',
} as const;
