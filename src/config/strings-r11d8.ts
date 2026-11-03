/** Round 11, helper d8: player-facing text for the living regions. */
export const REGION_LIFE_TEXT = {
  critter: (species: string) => `A ${species} hops into your pack.`,
  gate: 'The boulder rolls aside. Something glints behind it.',
  companion: (name: string, line: string) => `${name} ${line}.`,
  firstVisit: ' It seems to have grown a little braver here.',
};
