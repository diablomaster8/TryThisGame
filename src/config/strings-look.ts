/** Player-facing names for the look lane: cosmetics (`cosmetics.ts`). */
import type { Personality } from '../sim/types';

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

/** The critters added in R0402 (wild, then the Hollow's two rare ones). */
export const MORE_CRITTER_LABELS: Record<string, string> = {
  bonefish: 'Bonefish',
  turtle: 'Turtle',
  swallow: 'Swallow',
  bat: 'Bat',
  deer: 'Deer',
  monkey: 'Monkey',
  unicorn: 'Unicorn',
  wolf: 'Wolf',
  koala: 'Koala',
  phoenix: 'Phoenix',
  dragon: 'Dragon',
};

/**
 * FUN-09 (R0298): one toast per pet action and personality, in place of the old "liked that"
 * line. `any` is the child's (no personality yet). `{n}` is the Nubbin's name.
 */
export const PET_TOASTS: Record<string, Record<'any' | Personality, string>> = {
  tickle: {
    any: '{n} squirms and giggles.',
    cheerful: '{n} giggles so hard the crown wobbles.',
    shy: '{n} curls up, giggling into both hands.',
    mischievous: '{n} giggles, then tries to tickle you back.',
    lazy: '{n} lets out one slow, sleepy giggle.',
  },
  hiccup: {
    any: '{n} giggles so hard it turns into hiccups.',
    cheerful: '{n} laughs straight into a fit of hiccups. Hic!',
    shy: '{n} hiccups, and looks very embarrassed about it.',
    mischievous: '{n} hiccups, then pretends it was you.',
    lazy: '{n} hiccups three times without opening an eye.',
  },
  hug: {
    any: '{n} squishes into the hug.',
    cheerful: '{n} squeezes back with both stubby arms.',
    shy: '{n} goes still, then leans in.',
    mischievous: '{n} hugs back and steals a crumb from your pocket.',
    lazy: '{n} melts into the hug like warm dough.',
  },
  groom: {
    any: '{n} fluffs up, very pleased.',
    cheerful: '{n} puffs up round and shows off the shine.',
    shy: '{n} fluffs up and peeks at you sideways.',
    mischievous: '{n} shakes off the brushing all over you.',
    lazy: '{n} fluffs up and nearly falls asleep mid-brush.',
  },
  praise: {
    any: '{n} stands up a little taller.',
    cheerful: '{n} puffs out a proud chest. The crown shines.',
    shy: '{n} goes pink and looks at the grass.',
    mischievous: '{n} bows to an imaginary crowd.',
    lazy: '{n} accepts the praise from a lying-down position.',
  },
  highFive: {
    any: '{n} slaps your palm with a tiny paw.',
    cheerful: '{n} high-fives you with a delighted slap.',
    shy: '{n} misses, bonks its own head and stares at its paw.',
    mischievous: '{n} pulls the paw away at the last second. Too slow!',
    lazy: '{n} lifts one paw and lets you do the rest.',
  },
  tuckIn: {
    any: '{n} snuggles down for a nap.',
    cheerful: '{n} yawns a big happy yawn and settles down.',
    shy: '{n} burrows in until only the crown shows.',
    mischievous: '{n} pretends to sleep, one eye open.',
    lazy: '{n} was halfway asleep already.',
  },
  wideAwake: {
    any: '{n} sits bolt upright, eyes wide. Not sleepy at all.',
    cheerful: '{n} bounces back up. Nap? Never heard of it.',
    shy: '{n} sits up straight and blinks at you.',
    mischievous: '{n} pops right back up, grinning.',
    lazy: '{n} is not tired. Shockingly.',
  },
};

/** The toast for a pet action (FUN-09), by the beat it played and the Nubbin's personality. */
export function petToast(name: string, beat: string, personality: Personality | null): string {
  const set = PET_TOASTS[beat];
  if (!set) return `${name} liked that.`;
  return set[personality ?? 'any'].replace('{n}', name);
}
