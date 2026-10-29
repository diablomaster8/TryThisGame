/** Player-facing names for the look lane: cosmetics (`cosmetics.ts`). */

/** Cosmetic names by registry id. The eggshell's name comes from `eggshellLabel`. */
export const COSMETIC_LABELS: Record<string, string> = {
  'look-quills': 'Quills look',
  'look-shade': 'Shade look',
  pot: 'Flower pot',
  box: 'Cardboard box',
  pumpkin: 'Pumpkin',
  bow: 'Hair bow',
  bell: 'Bell collar',
  cape: 'Cape',
  backpack: 'Backpack',
  'flower-crown': 'Flower crown',
  party: 'Party hat',
  'top-hat': 'Top hat',
  chef: "Chef's hat",
  beret: 'Beret',
  'swim-ring': 'Swim ring',
  'leaf-umbrella': 'Leaf umbrella',
  sunhat: 'Straw sunhat',
  nightcap: 'Nightcap',
  'halo-band': 'Halo headband',
  horns: 'Devil horns',
};

/** "Eggshell (sky)": the hatchling's first hat, named for its egg. */
export const eggshellLabel = (colour: string): string => `Eggshell (${colour})`;

/** The shop's hat row note: what the hat of the day is. */
export const shopHatNote = (label: string): string => `Today: ${label}`;
